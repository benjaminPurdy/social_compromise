require 'site_prism'
require '../page_objects/tam'
class Page < SitePrism::Page
  def load(expansion = {})
    expanded_url = url(expansion)
    raise SitePrism::NoUrlForPage if expanded_url.nil?
    visit expanded_url
    tam_page_check
  end

  def reload
    Capybara.reset_sessions!
    self.load
  end

  private
  def tam_page_check
    login_page = PremierConnect::LoginPage.new
    if login_page.has_username_field?
      login_page.log_in(@@env_configurations['generic_user'], @@env_configurations['generic_user_password'])
    end
  end

end