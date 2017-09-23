Rails.application.routes.draw do
  devise_for :users, controllers: {omniauth_callbacks: "omniauth_callbacks"}
  scope '/admin' do
  end

  get '/states' => 'state#list', as: 'states'
  get '/states/map_data' => 'state#map_data', as: 'states_map_data'

  get '/users' => 'user#list', as: 'users'
  get '/users/user/:id' => 'user#index', as: 'user'

  get '/bills/:tab' => 'bill#list', as: 'bills'
  get '/bills/bill/:id' => 'bill#index', as: 'bill'
  get '/bills/change/:tab' => 'bill#change_tab', as: 'bill_change'
  # post '/bills/bill/:id/vote' => 'bill#vote', as: 'billVote'

  get '/representatives/:tab' => 'representative#list', as: 'representatives'
  get '/representatives/representative/:id' => 'representative#index', as: 'representative'
  get '/representatives/change/:tab' => 'representative#change_tab', as: 'representative_change'
  # post '/representatives/representative/:id/vote' => 'representative/vote', as: 'representativeVote'

  get '/notifications/mark_all_viewed' => 'notifications#mark_all_viewed', as: 'notifications_mark'
  get '/notifications/most_recent' => 'notifications#most_recent', as: 'notifications'

  get '/search' => 'search#search', as: 'search'

  root to: "home#index"
end
