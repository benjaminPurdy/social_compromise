module MetricsFilters

  mattr_accessor :metrics_registry

  class Timed

    def self.around(controller)
      name = "#{controller.class.name}##{controller.action_name}"
      timer = MetricsFilters.metrics_registry.timer(name)
      context = timer.time
      begin
        yield
      ensure
        context.stop
      end
    end
  end

  class Metered

    def self.around(controller)
      name = "#{controller.class.name}##{controller.action_name}"
      meter = MetricsFilters.metrics_registry.meter(name)
      meter.mark
      yield
    end
  end

  class ExceptionMetered

    def self.around(controller)
      name = "#{controller.class.name}##{controller.action_name}-EXCEPTION"
      meter = MetricsFilters.metrics_registry.meter(name)
      begin
        yield
      rescue => e
        meter.mark
        throw e
      end
    end

  end

end