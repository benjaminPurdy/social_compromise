class CompromiseUserMapping < ActiveRecord::Base
  belongs_to :user
  belongs_to :compromise
end
