class CreateAnnouncements < ActiveRecord::Migration[5.1]
  def change
    create_table :announcements do |t|
      t.references :shop, foreign_key: true, null: false
    end
  end
end
