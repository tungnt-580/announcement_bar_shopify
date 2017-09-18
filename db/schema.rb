# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170912084712) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "announcements", force: :cascade do |t|
    t.bigint "shop_id"
    t.bigint "template_id"
    t.string "name"
    t.string "message"
    t.string "button_text"
    t.boolean "is_template"
    t.boolean "active"
    t.string "background_color"
    t.string "text_color"
    t.string "button_background_color"
    t.string "button_text_color"
    t.string "fonts"
    t.string "font_size"
    t.integer "display_pages_option"
    t.string "display_pages"
    t.integer "exclude_pages_option"
    t.string "exclude_pages"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["shop_id"], name: "index_announcements_on_shop_id"
    t.index ["template_id"], name: "index_announcements_on_template_id"
  end

  create_table "shops", force: :cascade do |t|
    t.string "shopify_domain", null: false
    t.string "shopify_token", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["shopify_domain"], name: "index_shops_on_shopify_domain", unique: true
  end

  add_foreign_key "announcements", "announcements", column: "template_id"
  add_foreign_key "announcements", "shops"
end
