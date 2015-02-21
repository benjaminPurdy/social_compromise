require 'require_all'
require 'faker'
require_all File.join(File.dirname(File.expand_path('..')), 'src', 'main', 'rails', 'lib', 'faker', '*.rb')

class CapybaraTestCase < Minitest::Test
  include Capybara::DSL
  @@locale_path=Dir[File.join(File.dirname(File.expand_path('..')), 'src', 'main', 'rails', 'config', 'locales', '*.{rb,yml}')]

  def self.test(name, &block)
    @@test_name = "test_#{name}"
    define_method @@test_name, block
  end

  def before_setup
    I18n.load_path+=@@locale_path
    Capybara.current_session.driver.browser.manage.timeouts.script_timeout = Capybara.default_wait_time
    Capybara.current_session.driver.browser.manage.timeouts.page_load = Capybara.default_wait_time
    Capybara.current_session.driver.browser.manage.window.maximize
  end

  def before_teardown
    unless passed?
      screenshot = name + "-#{DateTime.now}.png"
      page.save_screenshot 'screenshots/' + screenshot, :full => true
    end
  end

  def after_teardown
    page.driver.reset!
    Capybara.reset_sessions!
    Capybara.use_default_driver
  end
end