class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  before_action :notifications
  layout :layout_by_resource
  helper_method :user_location_label
  # helper :all

  def notifications
    unless user_signed_in?
      return;
    end
    #@notifications = current_user.notifications.first(5)
    #@unread_notification_cont = current_user.unread_notification_count
  end



  def user_location_label
    'Charlotte'
  end

  private
   def notifications_config
     #@notifications_config ||= Rails.application.config.social_compromise["notification"]
   end



    def layout_by_resource
      'application'
    end

    def page_size_medium
      12
    end

    def page_size_small
      4
    end

    def local_label
      'Local'
    end

    def house_label
      'House'
    end

    def senate_label
      'Senate'
    end
end
