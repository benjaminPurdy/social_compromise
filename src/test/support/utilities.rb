class Utilities
  include Capybara::DSL

  def wait_until(condition)
    Timeout.timeout(Capybara.default_wait_time) do
      break if condition
    end
  end

  def ready_state_completed?
    page.execute_script('return document.readyState') == 'complete';
  end

  def construct_url(protocol, host, port)
    protocol + '://' + host + ':' + port.to_s
  end
end