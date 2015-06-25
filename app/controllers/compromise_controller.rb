class CompromiseController < ApplicationController
  def new
    @friends = current_user.friends
  end

  def create
    compromise = Compromise.create!(title: params[:title], description: params[:description])

    CompromiseUserMapping.create!(user_id: current_user.id, compromise_id: compromise.id)
    params['members'].each do |key, value|
      user = User.find_by_display_name(key)
      CompromiseUserMapping.create!(user_id: user.id, compromise_id: compromise.id)
    end
    redirect_to :controller => 'compromise', :action => 'index', :compromise => compromise.id
  end

  def index
    @compromise = Compromise.find(params[:compromise])
    @participant = CompromiseUserMapping.find_by(compromise_id: @compromise.id)
  end

  def edit

  end

  def save

  end
end
