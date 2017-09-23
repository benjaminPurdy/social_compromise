class State < ActiveRecord::Base
  has_many :representative_state
  has_many :representatives, through: :representative_state

  def first_letter_uppercased
    self.name.split.map(&:capitalize)*' '
  end

  def flag_name
    self.name.parameterize.underscore
  end
end
