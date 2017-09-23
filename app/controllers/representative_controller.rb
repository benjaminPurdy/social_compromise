class RepresentativeController < ApplicationController
  def list
    @tab = params[:tab]
    @local_label = local_label
    @local_representatives = Representative.take(page_size_small)
    @house_label = senate_label
    @house_representatives = Representative.where(senate: true)
    @senate_label = house_label
    @senate_representatives = Representative.where(house: true)
  end

  def filtered_list
    @filtered_list
  end


  def index
    @representative = Representative.find(params[:id])
  end

end
