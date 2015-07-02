class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
   before_action :notifications
  layout :layout_by_resource
  # helper :all

  #TODO: do this on a timer and not every time the page reloads?
  def notifications
    unless user_signed_in?
      return;
    end
    @notifications = current_user.notifications.first(5)
    @unread_notification_cont = current_user.unread_notification_count
  end



  private
   def notifications_config
     @notifications_config ||= Rails.application.config.social_compromise["notification"]
   end

  def layout_by_resource
    if devise_controller?
      'blank'
    else
      'application'
    end
  end
end
