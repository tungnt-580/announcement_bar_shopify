class AnnouncementSettings < ActiveRecord::Migration[5.1]
  def change
    create_table :announcement_settings do |t|
      t.references :announcement, foreign_key: true, null: false
      t.string :url_address
      t.timestamps
    end
  end
end
