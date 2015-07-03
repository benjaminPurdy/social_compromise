class NotificationsController < ActionController::Base

  def most_recent
    if !user_signed_in?
      @notifications = []
      @unread_notification_count = 0
    else
      @notifications = current_user.notifications.first(5) || []
      @unread_notification_count = current_user.unread_notification_count
    end
    respond_to do |format|
      format.js
    end
  end

  def mark_all_viewed
    current_user.notification_user_mappings.where(viewed: false).update_all(viewed: true)
    @notifications = current_user.notifications.first(5) || []
    respond_to do |format|
      format.js
    end
  end
end