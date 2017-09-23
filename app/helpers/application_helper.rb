module ApplicationHelper
  def viewed_notifications
  end
  def show_svg(path)
    File.open("app/assets/images/#{path}", "rb") do |file|
      raw file.read
    end
  end
end
