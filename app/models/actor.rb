class Actor < ActiveRecord::Base
  has_many :actor_movie_mappings
  has_many :movie, through: :actor_movie_mappings
  has_many :characters
end
