class Curb < ActiveRecord::Base

  acts_as_mappable
  
  geocoded_by :address, :latitude  => :lat, :longitude => :lon

  
  has_attached_file :photo, styles: {
    thumb: '100x100>',
    square: '200x200#',
    medium: '300x300>'
  }

validates_attachment_content_type :photo, :content_type => /\Aimage\/.*\Z/

before_validation { photo.clear if @delete_image }

  def delete_image
    @delete_image ||= false
  end

  def delete_image=(value)
    @delete_image  = !value.to_i.zero?
  end

end
