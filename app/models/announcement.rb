class Announcement < ApplicationRecord
  before_save :check_active

  scope :template, -> {where is_template: true}

  def self.get_active shop_id
    Announcement.find_by active: true, shop_id: shop_id
  end

  def display_in_page page
    check_page("display", display_pages_option, display_pages, page) && !check_page("exclude", exclude_pages_option, exclude_pages, page)
  end

  private

  def check_page type, option, pages, page
    case option
    when 0
      type == "display"
    when 1
      URI(page).path == "/"
    when 2
      pages.delete(" ").split(",").include? page
    when 3
      keywords = pages.delete(" ").split(",")
      keywords.each do |keyword|
        return true if page.include? keyword
      end
      false
    end
  end

  def check_active
    return unless active && active_changed?
    return unless a = Announcement.get_active(shop_id)
    a.update active: false
  end
end
