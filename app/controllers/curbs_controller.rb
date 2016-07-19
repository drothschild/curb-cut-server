class CurbsController < ApplicationController

  def index
    @curbs = Curb.all
  end

  def show 
    @product = Product.find(params[:id])
  end

  def new
    @curb = Curb.new
  end

  def create
    @curb = Curb.new(curb_params)
    if @curb.save
      flash[:success] = "Curb saved successfully"
      redirect_to curbs_url
    else 
      flash.now[:danger] = @curb.errors.full_messages
    end

  end

  private

  def curb_params
    params.require(:curb).permit(:lat, :longit)
  end

end