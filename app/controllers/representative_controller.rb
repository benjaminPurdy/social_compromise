class RepresentativeController < ApplicationController
  def list
    @tab = params[:tab]
    @local_label = localLabel
    @local_representatives = Representative.take(page_size_small)
    @house_label = senateLabel
    @house_representatives = Representative.where(senate: true).take(page_size_small)
    @senate_label = houseLabel
    @senate_representatives = Representative.where(house: true).take(page_size_small)
  end

  def index
    @representative = Representative.find(params[:id])
  end

  private


end
