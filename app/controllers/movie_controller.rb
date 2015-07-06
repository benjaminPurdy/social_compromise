class MovieController < ApplicationController
  def index
    @movie = Movie.find(params["id"])
  end

end
