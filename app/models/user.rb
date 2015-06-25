require 'amistad'
class User < ActiveRecord::Base

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :omniauthable,
         :recoverable, :rememberable, :trackable, :validatable
  before_save :auto_set_display_name

  include Amistad::FriendModel

  #validates_presence_of :username
  #validates_uniqueness_of :username

  def self.from_omniauth(auth)
    user_information = auth.slice(:provider, :uid, :info)
    User.find_or_create_by(email: user_information.info.email) do |user|
      user.provider = user_information.provider
      user.uid = user_information.uid
      user.email = user_information.info.email
    end

  end

  def self.new_with_session(params, session)
    if session['devise.user_attributes']
      new(session['devise.user_attributes'], without_protection) do |user|
        user.attributes = params
        user.valid?
      end
     else
       super
     end
  end

  def auto_set_display_name
    self.display_name = email.split('@')[0]
  end

  def password_required?
    super && provider.blank?
  end
end
