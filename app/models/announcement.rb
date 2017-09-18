class Announcement < ApplicationRecord
  before_save :check_active

  scope :template, -> {where is_template: true}

  def self.get_active shop_id
    Announcement.find_by active: true, shop_id: shop_id
  end

  def display_in_page page 
    display = 
    case display_pages_option
    when 0
      true
    when 1
      URI(page).path == "/"
    when 2
    when 3

    end
  end

  private

  def check_active
    return unless active && active_changed?
    return unless a = Announcement.get_active(shop_id)
    a.update active: false
  end
end