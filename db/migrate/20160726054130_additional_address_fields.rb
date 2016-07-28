class AdditionalAddressFields < ActiveRecord::Migration
  def change
    add_column :curbs, :street_number, :string
    add_column :curbs, :name, :string
    rename_column :curbs, :street, :route
  end
end
