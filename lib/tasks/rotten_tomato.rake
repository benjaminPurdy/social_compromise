require 'net/http'
namespace :rotten_tomato do
  desc "TODO"
  task seed_movies: :environment do
    uri = URI('http://localhost:3000/admin/upcomming_movies')
    Net::HTTP.get(uri)
  end

end
