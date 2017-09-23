class RepresentativeState < ActiveRecord::Base
  belongs_to :state
  belongs_to :representative
end
