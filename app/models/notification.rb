class Notification < ActiveRecord::Base
  has_many :notification_user_mapping
  has_many :users, :through => :notification_user_mapping
end
