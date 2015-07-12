
Recommendable.configure do |config|
  # Recommendable's connection to Redis
  #config.redis = Redis.new(:host => 'localhost', :port => 6379, :db => 0)
  uri = URI.parse(ENV["REDISTOGO_URL"] || "redis://localhost:6379/" )
  config.redis = REDIS = Redis.new(:host => uri.host, :port => uri.port, :password => uri.password)

  # A prefix for all keys Recommendable uses
  config.redis_namespace = :recommendable

  # Whether or not to automatically enqueue users to have their recommendations
  # refreshed after they like/dislike an item
  config.auto_enqueue = true

  # The number of nearest neighbors (k-NN) to check when updating
  # recommendations for a user. Set to `nil` if you want to check all
  # other users as opposed to a subset of the nearest ones.
  config.nearest_neighbors = nil
end