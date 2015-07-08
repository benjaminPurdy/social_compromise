require 'net/http'
require 'json'
require 'openssl'

module RottenTomatoHelper
  OpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE
  def populate_movies()
    opening_movies = 'https://api.themoviedb.org/3/movie/now_playing?api_key=09fb6f99c8994ae7bfaa6206be6dbd5d'
    populate_movies1(opening_movies)
  end

  def populate_movies1(url)
    puts "url: " + url
    movies_populated = []
    movies = JSON.parse(Net::HTTP.get(URI(url)))
    total_pages = movies["total_pages"]
    puts movies.inspect
    total_pages.times do |index|
      puts "page " + (index + 1).to_s + "/" + total_pages.to_s
      url_with_page = url + '&page=' + (index + 1).to_s
      movies = JSON.parse(Net::HTTP.get(URI(url_with_page)))
      results = movies["results"]
      results.each do |movie|
        if !Movie.where(themoviedb_id: movie['id']).empty? || !(movie['original_language'] == 'en')
          next
        end
        new_movie = populate_movie(movie['id'])
        movies_populated.push(new_movie)
        populate_cast(new_movie)
        sleep 4
      end
    end
    movies_populated
  end

  private

  def populate_movie(themoviedb_id)
    movie_specifics = JSON.parse(Net::HTTP.get(URI('https://api.themoviedb.org/3/movie/' + themoviedb_id.to_s + '?api_key=09fb6f99c8994ae7bfaa6206be6dbd5d')))
    movie = Movie.new
    movie.themoviedb_id = movie_specifics["id"]
    movie.imdb_id = movie_specifics["imdb_id"]
    movie.overview = movie_specifics["overview"]
    movie.release_date = movie_specifics["release_date"]
    movie.runtime = movie_specifics["runtime"]
    movie.title = movie_specifics["title"]
    movie.poster_path = movie_specifics["poster_path"]
    movie.fetch_similar = false
    movie.save!
    genres = movie_specifics["genres"] || []
    genres.each do |genre|
      genre = Genre.find_or_create_by!(name: genre["name"].downcase!)
      GenreMovieMapping.find_or_create_by!(genre_id: genre.id, movie_id: movie.id)
    end
    movie
  end

  def populate_cast(movie)
    url = 'https://api.themoviedb.org/3/movie/' + movie.themoviedb_id.to_s + '/credits?api_key=09fb6f99c8994ae7bfaa6206be6dbd5d'
    uri =URI(url)
    cast_info = JSON.parse(Net::HTTP.get(uri))
    cast_list = cast_info["cast"]
    cast_list.each do |cast_member|
      actor = find_or_create_actor(cast_member)
      character = Character.find_or_create_by!(name: cast_member["character"])
      ActorMovieCharacterMapping.find_or_create_by!(movie_id: movie.id, actor_id: actor.id, character_id: character.id)
    end
  end

  def find_or_create_actor(cast_member)
    actor = Actor.where(themoviedb_id: cast_member['id'])
    unless actor.empty?
      return actor[0]
    end
    url = 'https://api.themoviedb.org/3/person/' + cast_member['id'].to_s + '?api_key=09fb6f99c8994ae7bfaa6206be6dbd5d'
    uri = URI(url)
    actor_cast_json = JSON.parse(Net::HTTP.get(uri))
    actor_json = actor_cast_json
    create_actor(actor_json)
  end

  def populate_similar_movies(movie)
    url = 'http://api.themoviedb.org/3/movie/' + movie.themoviedb_id.to_s + '/similar?api_key=09fb6f99c8994ae7bfaa6206be6dbd5d'
    similar_movies = populate_movies1(url)
    similar_movies.each do |similar_movie|
      SimilarMovieMapping.find_or_create_by!(movie_id: movie.id, similar_movie_id: similar_movie.id)
    end
  end

  def create_actor(actor_json)

    actor = Actor.new
    actor.biography = actor_json["biography"]
    actor.birthday = actor_json["birthday"]
    actor.deathday = actor_json["deathday"]
    actor.themoviedb_id = actor_json["id"]
    actor.imdb_id = actor_json["imdb_id"]
    actor.name = actor_json["name"]
    actor.place_of_birth = actor_json["place_of_birth"]
    actor.profile_path = actor_json["profile_path"]
    actor.save!
    return actor
  end
end