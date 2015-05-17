class Actor < ActiveRecord::Base
  has_many :actor_movie_mappings
  has_many :movies, through: :actor_movie_mappings
  has_many :characters
end
