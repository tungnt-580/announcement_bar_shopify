class CreateAnnouncements < ActiveRecord::Migration[5.1]
  def change
    create_table :announcements do |t|
      t.references :shop, foreign_key: true, null: false
      t.references :template, references: :announcements
      t.string :name
      t.string :message
      t.string :button_text
      t.boolean :is_template
      t.boolean :active
      t.timestamps
    end
    add_foreign_key :announcements, :announcements, column: :template_id
  end
end
