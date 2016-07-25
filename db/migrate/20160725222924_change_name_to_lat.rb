class ChangeNameToLat < ActiveRecord::Migration
  def change
    change_table :curbs do |t|
      t.rename :longit, :lng
    end
  end
end
