class CompromiseController < ApplicationController
  include SuggestionHelper
  include CompromiseHelper
  def new
    @friends = current_user.friends
  end

  def create
    compromise = Compromise.create!(title: params[:title], description: params[:description])

    CompromiseUserMapping.create!(user_id: current_user.id, compromise_id: compromise.id, owner: true)
    participants = params[:participants] || []
    users = []
    participants.each do |key, value|
      user = User.find_by_display_name(key)
      CompromiseUserMapping.create!(user_id: user.id, compromise_id: compromise.id)
      users.push(user)
    end
    Thread.new do
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
    @participants = users_in_compromise(@compromise)
    @movie_suggestions = []
    @owner = owner(@compromise)

    displayed_movies = displayed_movies(@compromise)
    displaying_movies = displaying_movies(@compromise)
    suggested_movies = suggestions(:movie, 3 - displayed_movies.count, @participants, displayed_movies)
    mark_as_displaying(suggested_movies, @compromise.id)

    displaying_movies.each do |displaying_movie|
      @movie_suggestions.push(displaying_movie)
    end

    @movie_suggestions.concat suggested_movies

    puts "-" * 100
    puts "diplaying_movies count : " + displaying_movies(@compromise).count.to_s
    puts "-" * 100


  end

  def compromise(compromise_id)
    @compromise ||= Compromise.find(compromise_id)
  end

  def movie_vote
    compromise_id = params["compromise_id"]
    @compromise = compromise compromise_id
    @participants = users_in_compromise(@compromise)
    @movie_id = params["movie_id"]
    displayed_movies = displayed_movies(@compromise)

    delete_old_votes(@compromise)
    record_new_vote(@movie_id, @compromise.id, params["vote"])

    suggestions = suggestions(:movie, 1, @participants, displayed_movies)

    mark_as_displaying(suggestions, @compromise.id)
    @new_suggestion = suggestions[0] || []
    respond_to do |format|
      format.js
    end
  end

  def edit

  end

  def save

  end
end
