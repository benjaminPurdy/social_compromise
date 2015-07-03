class CompromiseController < ApplicationController
  include SuggestionHelper
  include CompromiseHelper
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
    @participants = []
    @movie_suggestions = []
    @owner = nil;
    map = CompromiseUserMapping.where(compromise_id: @compromise.id)
    map.each do |mapping|
      user = User.find(mapping.user_id)
      @participants.push user
      if mapping.owner
        @owner = user
      end
    end
    displayed_movies = CompromiseUserMovieVoteMapping.where(user_id: current_user.id, compromise_id: @compromise.id, displayed?: false, displaying?: true)
    suggested_movies = suggestions(:movie, 4 - displayed_movies.count, @participants, @compromise.id, [])

    mark_as_displaying(suggested_movies, @compromise.id)
    displayed_movies.each do |displayed_movie|
      @movie_suggestions.push(Movie.find(displayed_movie.movie_id))
    end

    @movie_suggestions.concat suggested_movies


  end

  def movie_vote
    displayed_movies = []
    @participants = []
    @compromise_id = params["compromise_id"]
    @compromise = Compromise.find(@compromise_id)
    @movie_id = params["movie_id"]
    movies_map = CompromiseUserMovieVoteMapping.where(user_id: current_user.id, compromise_id: @compromise_id, displayed?: false, displaying?: true)
    movies_map.each do |movie_map|
      displayed_movies.push(Movie.find(movie_map.movie_id))
    end
    map = CompromiseUserMapping.where(compromise_id: @compromise_id)
    map.each do |mapping|
      user = User.find(mapping.user_id)
      @participants.push user
      if mapping.owner
        @owner = user
      end
    end
#    delete_old_votes(@compromise_id)
    record_new_vote(@movie_id, @compromise_id, params["vote"])
    mark_as_displayed(@compromise_id, @movie_id)

    suggestions = suggestions(:movie, 1, @participants, @compromise_id, displayed_movies)
    mark_as_displaying(suggestions, @compromise_id)
    @new_suggestion = suggestions[0]
    puts "-" * 100
    puts params.inspect
    puts "-" * 100
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
