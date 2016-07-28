class AddAttachmentPhotoToCurbs < ActiveRecord::Migration
  def self.up
    change_table :curbs do |t|
      t.attachment :photo
    end
  end

  def self.down
    remove_attachment :curbs, :photo
  end
end
