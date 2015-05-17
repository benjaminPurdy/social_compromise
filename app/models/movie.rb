class Movie < ActiveRecord::Base
  validates :title, :uniqueness => {:scope => :release_date}
  has_many :actor_movie_mappings
  has_many :actors, through: :actor_movie_mappings
  has_many :characters
end
