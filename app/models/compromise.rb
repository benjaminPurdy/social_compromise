class Compromise < ActiveRecord::Base
  has_many :compromise_user_mapping
  has_many :users, :through => :compromise_user_mapping
end
