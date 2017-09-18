class Api::AnnouncementsController < ApplicationController
  before_action :load_shop

  def index
    @announcements = @shop.announcements
    response.headers['Access-Control-Allow-Origin'] = "https://#{@shop.shopify_domain}"
    render json: @announcements
  end

  def active
    @announcement = Announcement.get_active @shop.id
    @announcement = nil unless @announcement.display_in_page params[:page]
    response.headers['Access-Control-Allow-Origin'] = "https://#{@shop.shopify_domain}"
    render json: @announcement
  end

  private

  def load_shop
    @shop = Shop.find_by shopify_domain: params[:shop]
  end
end
