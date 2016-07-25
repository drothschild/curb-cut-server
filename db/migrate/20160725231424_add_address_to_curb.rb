class AddAddressToCurb < ActiveRecord::Migration
  def change
    add_column :curbs, :street, :string
    add_column :curbs, :street2, :string
    add_column :curbs, :cross_street, :string
    add_column :curbs, :city, :string
    add_column :curbs, :state, :string
    add_column :curbs, :zip, :string
    add_column :curbs, :country, :string
    add_column :curbs, :broken, :boolean
  end
end
