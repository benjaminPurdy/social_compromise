class Notification < ActiveRecord::Base
  has_many :notification_user_mappings
  has_many :users, :through => :notification_user_mappings
end
