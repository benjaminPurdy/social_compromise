class UserController < ApplicationController
  include UserHelper
  def index
    @user = User.find(params["id"])
    if @user.id == current_user.id
      redirect_to '/settings/profile'
    end
    @is_friend = current_user.friend_with? @user
    pending_invites = current_user.pending_invited @user
    pending_invited_by = current_user.pending_invited_by
    @invited = false
    @common_likes = @user.likes_in_common_with(current_user)

    @pending_invite = false
    pending_invites.each do |invite|
      if invite == @user
        @pending_invite = true
      end
    end
    pending_invited_by.each do |invited_by|
      if invited_by == @user
        @invited = true
      end
    end
  end

  def friends_request
    user = User.find(params["user"])
    request_type = params["request_type"]
    case request_type
      when 'add'
        current_user.invite user
      when 'remove'
        current_user.remove_friendship user
      when 'approve'
        current_user.approve user
      when 'block'
        current_user.block user
      else
        puts "ERROR"
    end
    redirect_to '/user/index?id=' + user.id.to_s
  end
end
