require 'java'
module TomcatDataSource
  class ManagedPooledDataSource < org.apache.tomcat.jdbc.pool.DataSourceProxy

    class PoolGauge
      include com.codahale.metrics.Gauge

      def initialize(pool, method)
        @pool = pool
        @method = method
      end

      def get_value
        @pool.send(@method)
      end
    end

    include javax.sql.DataSource

    def initialize(config, metrics_registry)
      raise ArgumentError.new 'config cannot be nil' if config.nil?
      raise ArgumentError.new 'metrics_registry cannot be nil' if metrics_registry.nil?
      super(config)
      @metrics_registry = metrics_registry
    end

    def get_logger
      raise SQLFeatureNotSupportedException.new 'Doesn\'t use java.util.logging'
    end

    def start
      pool = create_pool

      @metrics_registry.register("ManagedPooledDataSource.#{pool.get_name}.active_connections",
                                 PoolGauge.new(pool, :get_active))

      @metrics_registry.register("ManagedPooledDataSource.#{pool.get_name}.idle_connections",
                                 PoolGauge.new(pool, :get_idle))
    end

    def stop
      close
    end

  end
end