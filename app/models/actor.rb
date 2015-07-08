require 'elasticsearch/model'

class Actor < ActiveRecord::Base

  has_many :actor_movie_character_mappings
  has_many :movie, through: :actor_movie_character_mappings
  has_many :characters, through: :actor_movie_character_mappings

  include Elasticsearch::Model
end
