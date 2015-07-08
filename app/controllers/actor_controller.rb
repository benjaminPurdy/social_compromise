class ActorController < ApplicationController
  def index
    @actor = Actor.find(params["id"])
    @movies = @actor.movie_basics
  end
end
