require 'minitest'
require 'minitest/autorun'
require 'minitest/reporters'
require 'capybara'
require '../support/capybara_test_case'
require 'selenium-webdriver'
require 'site_prism'
require 'yaml'
require 'pry'

default_wait_time = 20
@remote = false
@@tam_protected = false
@capabilities = nil

Capybara.default_wait_time = default_wait_time
Capybara.run_server = false
Minitest::Reporters.use! [Minitest::Reporters::SpecReporter.new(:color => true)]

def build_remote_capabilities(browser, version = nil, platform = nil)
  case browser
    when 'ie'
      capabilities = Selenium::WebDriver::Remote::Capabilities.internet_explorer
    when 'chrome'
      capabilities = Selenium::WebDriver::Remote::Capabilities.chrome
    when 'ff'
      capabilities = Selenium::WebDriver::Remote::Capabilities.firefox
    when 'safari'
      capabilities = Selenium::WebDriver::Remote::Capabilities.safari
    else
      raise "To specify a browser, use the following format: rake test BROWSER="
  end

  unless version.nil?
    capabilities.version = version
  end

  unless platform.nil?
    capabilities.platform = platform
  end
  capabilities
end

def start_driver
  if @remote
    Capybara.register_driver :remote_browser do |app|
      Capybara::Selenium::Driver.new(app,
                                     :browser => :remote,
                                     :url => 'http://code.premierinc.com:4444/wd/hub',
                                     :desired_capabilities => @capabilities)
    end
  else
    Capybara.register_driver :selenium do |app|
      Capybara::Selenium::Driver.new(app,
                                     :browser => :firefox
      )
    end
  end
end

#Todo: Clean this up, this is not a very clear way of stating where the browsers will be run
if ENV['ENV'] != nil && !ENV['ENV'].casecmp('LOCAL').zero?
  @@env_configurations = YAML::load_file('resources/configurations_' + ENV['ENV'] + '.yml')
  #@@tam_protected = true
else
  @@env_configurations = YAML::load_file('resources/configurations_local.yml')
end

if ENV['REMOTE'] != nil && ENV['REMOTE'].casecmp('TRUE').zero?
  @@env_configurations = YAML::load_file('resources/configurations_' + ENV['ENV'] + '.yml')
  if ENV['BROWSER'] != nil
    @capabilities = build_remote_capabilities(ENV['BROWSER'], ENV['VERSION'], ENV['PLATFORM'])
  else
    @capabilities = build_remote_capabilities('chrome')
  end
  Capybara.default_driver = :remote_browser
  @remote = true
  @@tam_protected = true
else
  Capybara.default_driver = :selenium
end


Capybara.app_host = @@env_configurations['app_url']

start_driver