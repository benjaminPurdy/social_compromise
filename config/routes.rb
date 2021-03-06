Rails.application.routes.draw do
  devise_for :users, path_names: {sign_in: "login", sign_out: "logout"},
                     controllers: {omniauth_callbacks: "omniauth_callbacks"}
  scope '/admin' do
    get 'upcomming_movies' => 'rotten_tomato#populate_upcomming_movies', :defaults => { :format => :json }
  end

  namespace :settings do
    get '/' => 'profile#index'
    get 'profile' => 'profile#index'
    post 'profile' => 'profile#save'
    get 'friends' => 'friends#index'
  end

  get '/compromise/new' => 'compromise#new'
  post '/compromise/create' => 'compromise#create'
  get '/compromise/index' => 'compromise#index'
  get '/compromise/movie_vote' => 'compromise#movie_vote'
  get '/movie/index' => 'movie#index'
  get '/actor/index' => 'actor#index'
  get '/user/index' => 'user#index'
  get '/user/friends_request' => 'user#friends_request'

  resources :friends, :controller => 'friendships', :except => [:show, :edit] do
    get "requests", :on => :collection
    get "invites", :on => :collection
  end

  get '/notifications/mark_all_viewed' => 'notifications#mark_all_viewed'
  get '/notifications/most_recent' => 'notifications#most_recent'

  get '/search' => 'search#search'

  root to: "home#index"
end
