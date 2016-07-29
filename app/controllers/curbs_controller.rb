class CurbsController < ApplicationController

  def index
    # Sometime change all to map bounds
    @curbs = Curb.all
    img_url = ActionController::Base.helpers.path_to_image('red_wheelchair.png')
    p img_url
    @hash = Gmaps4rails.build_markers(@curbs) do |curb, marker|
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
  end

  def show 
    @curb = Curb.find(params[:id])
  end

  def new
    @curb = Curb.new(params[:curb].present? ? curb_params : nil)
    render partial: 'form'
  end

  def create

    curb = Curb.new(curb_params)

    respond_to do |format|
      if curb.save
        img_url = ActionController::Base.helpers.path_to_image('red_wheelchair.png')
        @hash = Gmaps4rails.build_markers([*curb]) do |curb, marker|
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

        format.js
      #   flash[:success] = "Curb saved successfully"
      #   respond_to do |format|
      #     format.html do
      #       redirect_to curbs_url
      #     end
      #     format.json do
            # infowindow = render_to_string(:partial => 'show.html.haml', :locals => { :@curb => curb})
            #  img_url = ActionController::Base.helpers.path_to_image('red_wheelchair.png')

            # render :json => {id: curb.id, infowindow: infowindow, imgUrl: img_url, lat: curb.lat, lng: curb.lng}
      #     end
      #   end
      # else 
      #   flash.now[:danger] = @curb.errors.full_messages
      # end
        
      end
    end
  end

  private

  def curb_params
    params.require(:curb).permit(:lat, :lng, :photo, :street_number, :street, :zip, :city, :state, :country, :name)
  end

end