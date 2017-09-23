class Representative < ActiveRecord::Base
  has_one :representative_state
  has_one :state, through: :representative_state


  def name
    self.first_name + ' ' + self.last_name
  end
end
