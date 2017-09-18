class CreateAnnouncements < ActiveRecord::Migration[5.1]
  def change
    create_table :announcements do |t|
      t.references :shop, foreign_key: true
      t.references :template, references: :announcements
      t.string :name
      t.string :message
      t.string :button_text
      t.boolean :is_template
      t.boolean :active
      t.string :background_color
      t.string :text_color
      t.string :button_background_color
      t.string :button_text_color
      t.string :fonts
      t.string :font_size
      t.integer :display_pages_option
      t.string :display_pages
      t.integer :exclude_pages_option
      t.string :exclude_pages
      t.timestamps
    end
    add_foreign_key :announcements, :announcements, column: :template_id
  end
end
