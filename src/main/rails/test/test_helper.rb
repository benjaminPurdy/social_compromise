ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'
require 'mocha/mini_test'
require '../../../../src/main/rails/lib/faker/community'
require 'pry'


class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :applications
  fixtures :application_access_tokens
  fixtures :application_access_keys,
           :people
end
