class CurbsController < ApplicationController
  before_action :set_curb, only: [:show, :edit, :update, :destroy ]

  def index
    # Todo: change all to map bounds
    @curbs = Curb.all
    @hash = curbs_to_hash(@curbs)
  end

  def show 
  end

  def new
    @curb = Curb.new(params[:curb].present? ? curb_params : nil)
    render partial: 'form'
  end

  def edit
    render partial: 'form',  :locals => { :@curb => @curb}
  end

  def create
    curb = Curb.new(curb_params)
    respond_to do |format|
      if curb.save
        @hash = curbs_to_hash([*curb])
        format.js
      end
    end
  end

  def update
    respond_to do |format| 
      if @curb.update(curb_params)
        @hash = curbs_to_hash([*@curb])
        format.js
      end
    end
  end


  def destroy
    @curb.destroy
    if request.xhr?
      render json: {id: params[:id]}
    else
      redirect_to curbs_url
    end

  end

  private

  def curb_params
    params.require(:curb).permit(:lat, :lng, :photo, :street_number, :street, :zip, :city, :state, :country, :name, :delete_image)
  end

  def curbs_to_hash(curbs)
    img_url = ActionController::Base.helpers.path_to_image('red_wheelchair.png')
    hash = Gmaps4rails.build_markers(curbs) do |curb, marker|
      marker.infowindow render_to_string(:partial => 'show', :locals => { :@curb => curb})

      marker.lat curb.lat
      marker.lng curb.lng
      marker.picture({
                  :url => img_url,
                  :width   => 16,
                  :height  => 16
                 })
      marker.json ({id: curb.id})
    end
    hash
  end

  def set_curb
    @curb = Curb.find(params[:id])
  end

end