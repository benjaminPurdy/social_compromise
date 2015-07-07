require 'net/http'
require 'json'
require 'openssl'

module RottenTomatoHelper
  OpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE
  def populate_movies
    opening_movie = opening_movies["results"]
    opening_movie.each do |movie|
      if Movie.find(movie.id)
        return;
      end
      new_movie = populate_movie(movie)
      populate_similar_movies(movie)
      populate_cast(movie)
    end
  end

  private

  def opening_movies
    @opening_movies ||= begin
      uri = URI('https://api.themoviedb.org/3/movie/now_playing?api_key=09fb6f99c8994ae7bfaa6206be6dbd5d')
      JSON.parse(Net::HTTP.get(uri))
    end
  end
  def movies
    opening_movies['movies']
  end

  def populate_movie(movie)
    movie_specifics = JSON.parse(Net::HTTP.get(URI('https://api.themoviedb.org/3/movie/' + movie['id'].to_s + '?api_key=09fb6f99c8994ae7bfaa6206be6dbd5d')))
    movie = Movie.initilize
    movie.themoviedb_id = movie_specifics["id"]
    movie.imdb_id = movie_specifics["imdb_id"]
    movie.overview = movie_specifics["overview"]
    movie.release_date = movie_specifics["release_date"]
    movie.runtime = movie_specifics["runtime"]
    movie.title = movie_specifics["original_title"]
    movie.poster_path = movie_specifics["poster_path"]
    movie.fetched_similar = false
    movie.save!
    movie_specifics["genres"].each do |key, value|
      genera = Generes.find_or_create_by!(name: "value")
      GeneraMovieMapping(genera_id: genera.id, movie_id: movie.id)
    end
  end

  def populate_cast(movie)
    cast = JSON.parse(Net::HTTP.get(URI('https://api.themoviedb.org/3/movie/' + movie['id'].to_s + '/credits?api_key=09fb6f99c8994ae7bfaa6206be6dbd5d')))["cast"]
    cast.each do |cast_member|
      actor = Actor.find(themoviedb_id: cast_member['id'])
      actor_json = {}
      if actor == nil
        actor_json = JSON.parse(Net::HTTP.get(URI('https://api.themoviedb.org/3/person/' + cast_member['id'].to_s + '/credits?api_key=09fb6f99c8994ae7bfaa6206be6dbd5d')))["cast"]
      end
      actor = create_actor(actor_json)
      ActorMovieMapping.find_or_create_by!(movie_id: movie_id, actor_id: actor.id, character: cast_member["character"])
    end
  end

  def populate_similar_movies(movie)

  end

  def create_actor(actor_json)
    actor = Actor.initilize
    actor.biography = actor_json["biography"]
    actor.birthday = actor_json["birthday"]
    actor.deathday = actor_json["deathday"]
    actor.themoviedb_id = actor_json["id"]
    actor.imdb_id = actor_json["imdb_id"]
    actor.name = actor_json["name"]
    actor.place_of_birth = actor_json["place_of_birth"]
    actor.profile_path = actor_json["profile_path"]
    actor.save!
  end
end