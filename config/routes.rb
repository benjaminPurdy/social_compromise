Rails.application.routes.draw do
  devise_for :users, path_names: {sign_in: "login", sign_out: "logout"},
                     controllers: {omniauth_callbacks: "omniauth_callbacks"}
  scope '/admin' do
  end

  get '/user/index' => 'user#index', as: 'user'

  get '/bills/:tab' => 'bill#list', as: 'bills'
  get '/bills/bill/:id' => 'bill#index', as: 'bill'
  # post '/bills/bill/:id/vote' => 'bill#vote', as: 'billVote'
  get '/representatives/:tab' => 'representative#list', as: 'representatives'
  get '/representatives/representative/:id' => 'representative#index', as: 'representative'
  # post '/representatives/representative/:id/vote' => 'representative/vote', as: 'representativeVote'
  get '/notifications/mark_all_viewed' => 'notifications#mark_all_viewed', as: 'notificationsMark'
  get '/notifications/most_recent' => 'notifications#most_recent', as: 'notifications'

  get '/search' => 'search#search', as: 'search'

  root to: "home#index"
end
