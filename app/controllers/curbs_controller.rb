class CurbsController < ApplicationController

  def index
    # Sometime change all to map bounds
    @curbs = Curb.all
    img_url = ActionController::Base.helpers.path_to_image('red_wheelchair.png')
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

  def edit
    @curb = Curb.find(params[:id])
    render partial: 'form',  :locals => { :@curb => @curb}
  end

  def create

    curb = Curb.new(curb_params)

    respond_to do |format|
      if curb.save
        img_url = ActionController::Base.helpers.path_to_image('red_wheelchair.png')
        curbs = [*curb]
        @hash = Gmaps4rails.build_markers(curbs) do |curb, marker|
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
      end
    end
  end

  def update
    @curb = Curb.find(params[:id])
    respond_to do |format| 
      if @curb.update(curb_params)
        curbs = [*@curb]
        img_url = ActionController::Base.helpers.path_to_image('red_wheelchair.png')
        @hash = Gmaps4rails.build_markers(curbs) do |curb, marker|
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
      else
        # Write something here.
      end
    end
  end


  def destroy
    @curb = Curb.find(params[:id])
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

end