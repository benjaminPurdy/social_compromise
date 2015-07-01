class CompromiseController < ApplicationController
  include SuggestionHelper
  def new
    @friends = current_user.friends
  end

  def create
    compromise = Compromise.create!(title: params[:title], description: params[:description])

    CompromiseUserMapping.create!(user_id: current_user.id, compromise_id: compromise.id, owner: true)
    members = params[:members] || []
    users = []
    members.each do |key, value|
      user = User.find_by_display_name(key)
      CompromiseUserMapping.create!(user_id: user.id, compromise_id: compromise.id)
      users.push(user)
    end
    Thread.new do
      puts "getting here!"
      notification = Notification.create!(link: '/compromise/index?compromise=' + compromise.id.to_s, thumbnail: '', description: compromise.description)
      users.each do |user|
        NotificationUserMapping.create!(user_id: user.id, notification_id: notification.id)
      end
      ActiveRecord::Base.connection.close
    end

    redirect_to :controller => 'compromise', :action => 'index', :compromise => compromise.id
  end

  def index
    @compromise = Compromise.find(params[:compromise])
    map = CompromiseUserMapping.where(compromise_id: @compromise.id)
    @participants = []
    @owner = nil;
    map.each do |mapping|
      user = User.find(mapping.user_id)
      @participants.push user
      if mapping.owner
        @owner = user
      end
    end
    @movie_suggestions = suggestions(:movie, suggestion_config["count"])
  end

  def movie_vote
    @previous_id = params["id"]
    @new_suggestion = Movie.last
    respond_to do |format|
      format.js
    end
  end

  def edit

  end

  def save

  end

  private
  def suggestion_config
    @social_compromise ||= Rails.application.config.social_compromise["suggestion"]
  end
end
