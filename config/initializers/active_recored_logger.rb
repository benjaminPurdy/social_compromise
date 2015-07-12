#disable SQL going to logs
old_logger = ActiveRecord::Base.logger
ActiveRecord::Base.logger = nil

#to enable uncomment the line below
#ActiveRecord::Base.logger = old_logger