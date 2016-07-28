class RenameStreetAgain < ActiveRecord::Migration
  def change
    rename_column :curbs, :route, :street
  end
end
