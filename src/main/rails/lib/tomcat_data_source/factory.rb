require 'java'
require_relative 'managed_pooled_datasource'
module TomcatDataSource
  class Factory

    TRANSACTION_ISOLATION = {
        none: java.sql.Connection::TRANSACTION_NONE,
        default: org.apache.tomcat.jdbc.pool.DataSourceFactory::UNKNOWN_TRANSACTIONISOLATION,
        read_uncommitted: java.sql.Connection::TRANSACTION_READ_UNCOMMITTED,
        read_committed: java.sql.Connection::TRANSACTION_READ_COMMITTED,
        repeatable_read: java.sql.Connection::TRANSACTION_REPEATABLE_READ,
        serializable: java.sql.Connection::TRANSACTION_REPEATABLE_READ
    }.freeze

    DEFAULT_CONFIG = {
        abandon_when_percentage_full: 0,
        alternate_usernames_allowed: false,
        commit_on_return: false,
        password: '',
        default_transaction_isolation: TRANSACTION_ISOLATION[:default],
        use_fair_queue: true,
        initial_size: 10,
        min_size: 1,
        max_size: 100,
        log_abandoned_connections: false,
        log_validation_errors: false,
        max_wait_for_connection: 30 * 1000,
        min_idle_time: 60 * 1000,
        validation_query: '/* Health Check */ SELECT 1',
        check_connection_while_idle: true,
        check_connection_on_borrow: false,
        check_connection_on_connect: true,
        check_connection_on_return: false,
        auto_comments_enabled: true,
        eviction_interval: 5 * 1000,
        validation_interval: 30 * 1000,
        remove_abandoned: true,
        remove_abandoned_timeout: 60
    }.freeze

    def self.using_config_and_metrics(config, metrics_registry)
      new(config, metrics_registry).build
    end

    def initialize(config, metrics_registry)
      @config = DEFAULT_CONFIG.merge(config).freeze
      @metrics_registry = metrics_registry
    end

    def build

      pool_config = org.apache.tomcat.jdbc.pool.PoolProperties.new

      pool_config.setName(@config[:name])
      pool_config.setUrl(@config[:url])
      pool_config.setDriverClassName(@config[:driver_class])
      pool_config.setUsername(@config[:username])
      pool_config.setPassword(@config[:password])
      pool_config.setTestWhileIdle(@config[:check_connection_while_idle])
      pool_config.setTestOnBorrow(@config[:check_connection_on_borrow])
      pool_config.setValidationQuery(@config[:validation_query])
      pool_config.setTestOnReturn(@config[:check_connection_on_return])
      pool_config.setValidationInterval(@config[:validation_interval])
      pool_config.setTimeBetweenEvictionRunsMillis(@config[:eviction_interval])
      pool_config.setMaxActive(@config[:max_size])
      pool_config.setMaxIdle(@config[:max_size])
      pool_config.setInitialSize(@config[:initial_size])
      pool_config.setMaxWait(@config[:max_wait_for_connection])
      pool_config.setRemoveAbandonedTimeout(@config[:remove_abandoned_timeout])
      pool_config.setMinEvictableIdleTimeMillis(@config[:min_idle_time])
      pool_config.setMinIdle(@config[:min_size])
      pool_config.setLogAbandoned(@config[:log_abandoned_connections])
      pool_config.setRemoveAbandoned(@config[:remove_abandoned])

      #
      pool_config.setAbandonWhenPercentageFull(@config[:abandon_when_percentage_full])
      pool_config.setAlternateUsernameAllowed(@config[:alternate_usernames_allowed])
      pool_config.setCommitOnReturn(@config[:commit_on_return])
      pool_config.setDefaultAutoCommit(@config[:auto_commit_by_default])
      pool_config.setDefaultCatalog(@config[:default_catalog])
      pool_config.setDefaultReadOnly(@config[:read_only_by_default])
      pool_config.setDefaultTransactionIsolation(@config[:default_transaction_isolation])
      pool_config.setFairQueue(@config[:use_fair_queue])
      pool_config.setInitSQL(@config[:initialization_query])
      pool_config.setLogValidationErrors(@config[:log_validation_errors])

      unless @config[:max_connection_age].nil?
        pool_config.setMaxAge(@config[:max_connection_age])
      end

      TomcatDataSource::ManagedPooledDataSource.new(pool_config, @metrics_registry)
    end

  end
end