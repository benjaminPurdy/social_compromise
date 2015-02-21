require 'rack/proxy'
class ProxyToWebpack < Rack::Proxy
  def initialize(app)
    @app = app
  end

  def call(env)
    original_host = env['HTTP_HOST']
    rewrite_env(env)
    if env['HTTP_HOST'] != original_host
      perform_request(env)
    else
      # just regular
      @app.call(env)
    end
  end

  def rewrite_env(env)
    request = Rack::Request.new(env)
    if request.path =~ %r{^/assets/}
      env['HTTP_HOST'] = 'localhost:8082'
    end

    if env['REQUEST_PATH'] =~ %r{\.(ttf|woff)$}
      env['HTTP_HOST'] = 'localhost:8082'
      env['PATH_INFO'] = "/assets#{env['REQUEST_PATH']}"
    end
    env
  end
end