class UserController < ApplicationController
  include UserHelper
  def index
  end

  def save
    current_user.bio = params["about_me"]
    current_user.age = params["age"]
    current_user.save!

    flash.notice = 'User updated!'
    redirect_to root_path

  end
end
