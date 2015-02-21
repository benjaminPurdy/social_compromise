require 'java'


class HttpClient
  java_import org.apache.http.conn.socket.PlainConnectionSocketFactory
  java_import org.apache.http.conn.ssl.SSLConnectionSocketFactory
  java_import org.apache.http.config.RegistryBuilder
  java_import java.util.concurrent.TimeUnit
  java_import org.apache.http.impl.conn.SystemDefaultDnsResolver
  java_import com.codahale.metrics.httpclient.InstrumentedHttpClientConnectionManager
  java_import org.apache.http.impl.client.HttpClientBuilder
  java_import org.apache.http.client.config.CookieSpecs
  java_import org.apache.http.config.SocketConfig
  java_import org.apache.http.client.config.RequestConfig
  java_import org.apache.http.impl.NoConnectionReuseStrategy
  java_import com.codahale.metrics.httpclient.InstrumentedHttpRequestExecutor
  java_import com.codahale.metrics.httpclient.HttpClientMetricNameStrategies

  cattr_accessor :metrics_registry

  @lock = Mutex.new

  class << self
    def startup
      @lock.synchronize do
        @client ||= build_client
      end
    end

    def client
      @client || startup
    end

    def shutdown
      client.get_connection_manager.shutdown
    end

    def build_client

      registry = RegistryBuilder.create
      .register('http', PlainConnectionSocketFactory.getSocketFactory)
      .register('https', SSLConnectionSocketFactory.getSocketFactory)
      .build

      connection_manager = create_connection_manager(registry)

      create_client(HttpClientBuilder.create, connection_manager, name)
    end

    def create_connection_manager(registry)
      manager = InstrumentedHttpClientConnectionManager.new(
          metrics_registry,
          registry,
          nil, nil,
          SystemDefaultDnsResolver.new,
          1,
          TimeUnit::HOURS,
          name
      )

      manager.set_default_max_per_route(1024)
      manager.set_max_total(1024)
      manager
    end

    def create_client(builder, manager, name)
      cookie_policy = CookieSpecs::IGNORE_COOKIES;
      timeout = 1000;
      connection_timeout = 1000;
      reuse_strategy = NoConnectionReuseStrategy.new
      # retry_handler =

      request_config = RequestConfig.custom
      .set_cookie_spec(cookie_policy)
      .set_socket_timeout(timeout)
      .set_connect_timeout(connection_timeout)
      .set_stale_connection_check_enabled(false)
      .build

      socket_config = SocketConfig.custom
      .set_tcp_no_delay(true)
      .set_so_timeout(timeout)
      .build

      builder.set_request_executor(InstrumentedHttpRequestExecutor.new(metrics_registry, HttpClientMetricNameStrategies::METHOD_ONLY))
      .set_connection_manager(manager)
      .set_default_request_config(request_config)
      .set_default_socket_config(socket_config)
      .set_connection_reuse_strategy(reuse_strategy)
      .set_user_agent('Snowstorm')

      builder.build
    end

  end

end