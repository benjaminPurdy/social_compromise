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

  resources :friends, :controller => 'friendships', :except => [:show, :edit] do
    get "requests", :on => :collection
    get "invites", :on => :collection
  end

  root to: "home#index"
end
