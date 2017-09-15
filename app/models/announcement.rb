class Announcement < ApplicationRecord
  before_save :check_active

  scope :template, -> {where is_template: true}

  def self.get_active shop_id
    Announcement.find_by active: true, shop_id: shop_id
  end

  private

  def check_active
    return unless active && active_changed?
    return unless a = Announcement.get_active(shop_id)
    a.update active: false
  end
end