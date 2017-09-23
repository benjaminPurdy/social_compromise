class BillController < ApplicationController

  def list
    @tab = params[:tab]
    @local_label = local_label
    @local_bills = Bill.take(page_size_small)
    @house_label = senate_label
    @house_bills = Bill.take(page_size_small)
    @senate_label = house_label
    @senate_bills = Bill.take(page_size_small)
  end

  def index
    @bill = Bill.find(params[:id])
  end

  def change_tab
    @tab = params[:tab]

    if @tab == 'local' || @tab == 'all'
      @local_label = local_label
      @local_bills = Bill.take(page_size_small)
    end
    if @tab == 'house' || @tab == 'all'
      @house_label = house_label
      @house_bills = Bill.take(page_size_small)
    end

    if @tab == 'senate' || @tab == 'all'
      @senate_label = senate_label
      @senate_bills = Bill.take(page_size_small)
    end

    respond_to do |format|
      puts format.js
      format.js
    end
  end
end
