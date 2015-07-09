class Settings::FriendsController < ApplicationController

  before_filter :authenticate_user!

  def index
    @friends = current_user.friends
    @pending_invited_by = current_user.pending_invited_by
    @pending_invited = current_user.pending_invited
  end


end
