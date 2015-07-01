#class Settings::ProfileController < ApplicationController
class Settings::ProfileController < Settings::BaseController
  def index

  end

  def save
    current_user.email = params[:user][:email]
    current_user.first_name = params[:user][:first_name]
    current_user.last_name = params[:user][:last_name]
    current_user.bio = params[:user][:bio]
    current_user.age = params[:user][:age]
    current_user.save

    puts "Hello world!"
    flash.notice = 'User updated!'
    redirect_to root_path

  end

end
