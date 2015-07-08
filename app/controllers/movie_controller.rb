class MovieController < ApplicationController
  include RottenTomatoHelper
  def index
    @movie = Movie.find(params["id"])
    unless (@movie.fetch_similar)
      populate_similar_movies(@movie)
      @movie.fetch_similar = true
      @movie.save
    end
    @similar_movies = @movie.similar_movies
    @actors = @movie.actors_basic
  end

end
