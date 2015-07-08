#class Settings::ProfileController < ApplicationController
class Settings::ProfileController < ApplicationController
  def index

  end

  def save
    current_user.bio = params[:user][:bio]
    current_user.age = params[:user][:age]
    current_user.save!

    flash.notice = 'User updated!'
    redirect_to root_path

  end

end
