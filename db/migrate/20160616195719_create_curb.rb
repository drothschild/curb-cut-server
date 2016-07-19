class CreateCurb < ActiveRecord::Migration
  def change
    create_table :curbs do |t|
      t.decimal :lat
      t.decimal :longit
    end
  end
end
