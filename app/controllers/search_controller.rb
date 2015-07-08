require 'elasticsearch/model'

class SearchController < ApplicationController
  include Elasticsearch::Model

  def search
    @query = params["q"]
    page = params["page"] || 1
    filter = params["filter"] || ''
    case filter
      when 'actor'
        @results = Actor.search(@query).page(page).records.to_a
      when 'user'
        @results = User.search(@query).page(page).records.to_a
      when 'movie'
        @results = Movie.search(@query).page(page).records.to_a
      else
        @results = Elasticsearch::Model.search(@query, [User, Movie, Actor]).records.to_a
    end
  end
end
