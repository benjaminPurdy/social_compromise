Rails.application.routes.draw do
  devise_for :users, path_names: {sign_in: "login", sign_out: "logout"},
                     controllers: {omniauth_callbacks: "omniauth_callbacks"}
  scope '/admin' do
    get 'upcomming_movies' => 'rotten_tomato#populate_upcomming_movies', :defaults => { :format => :json }
  end

  root to: "home#index"
end
