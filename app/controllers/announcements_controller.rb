class AnnouncementsController < ApplicationController
  def index
    @shop = Shop.find_by shopify_domain: params[:shop]
    @announcements = @shop.announcements
    respond_to do |format|
      format.json {
        response.headers['Access-Control-Allow-Origin'] = "https://#{@shop.shopify_domain}"
        render json: @announcements
      }
    end
  end
end
