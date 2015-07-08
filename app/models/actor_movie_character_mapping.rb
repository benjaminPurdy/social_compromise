class ActorMovieCharacterMapping < ActiveRecord::Base
  belongs_to :actor
  belongs_to :movie
  belongs_to :character
end
