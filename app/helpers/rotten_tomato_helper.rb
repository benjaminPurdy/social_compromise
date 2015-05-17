require 'net/http'
require 'json'

module RottenTomatoHelper
  def populate_movies
    movies.each do |movie|
      new_movie = populate_movie(movie)
      populate_cast(movie['abridged_cast'], new_movie.id)
    end
  end

  private

  def opening_movies
    @opening_movies ||= begin
      uri = URI('http://api.rottentomatoes.com/api/public/v1.0/lists/movies/opening.json?apikey=vegnctdzsxyzsfbews4jqhk9')
      JSON.parse(Net::HTTP.get(uri))
    end
  end
  def movies
    opening_movies['movies']
  end

  def populate_movie(movie)
    release_date = movie['release_dates']['theater'] || movie['release_dates']['dvd']
    release_date = Date.parse(Time.parse(release_date).utc.to_s)
    title = movie['title']
    new_movie = Movie.find_by_title_and_release_date(title, release_date)
    return new_movie if new_movie != nil

    Movie.create(title: title, mpaa_rating: movie['mpaa_rating'], runtime: movie['runtime'], release_date: release_date, critics_score: movie['ratings']['critics_score'], audience_score: movie['ratings']['audience_score'], synopsis: movie['synopsis'], thumbnail: movie['posters']['thumbnail'], similar_movies: movie['similar'], clips: movie['clips'])
  end

  def populate_cast(cast, movie_id)
    cast.each do |actor|
      actor = Actor.find_or_create_by!(name: actor['name'])
      characters = actor['characters'] || []
      characters.each do |character|
        Character.find_or_create_by!(name: character, actor_id: actor.id, movie_id: movie_id)
      end
      ActorMovieMapping.find_or_create_by!(movie_id: movie_id, actor_id: actor.id)
    end
  end
end