class MovieController < ApplicationController
  include RottenTomatoHelper
  include MovieHelper
  def index
    @movie = Movie.find(params["id"])
    @iframe_url = canistreamit_iframe_url(@movie)
    unless (@movie.fetch_similar)
      populate_similar_movies(@movie)
      @movie.fetch_similar = true
      @movie.save
    end
    @similar_movies = @movie.similar_movies
    @actors = @movie.actors_basic
  end

end
