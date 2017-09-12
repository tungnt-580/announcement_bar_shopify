class Shop < ActiveRecord::Base
  include ShopifyApp::SessionStorage

  has_many :announcements
end
