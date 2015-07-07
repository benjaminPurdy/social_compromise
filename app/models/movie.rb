class Movie < ActiveRecord::Base
  validates :themoviedb_id, :uniqueness

  has_many :actor_movie_mappings
  has_many :actors, through: :actor_movie_mappings
  has_many :characters
end
