class AnnouncementsController < ApplicationController
  before_action :load_shop

  def index
    @announcements = @shop.announcements
    respond_to do |format|
      format.html
      format.json {
        response.headers['Access-Control-Allow-Origin'] = "https://#{@shop.shopify_domain}"
        render json: @announcements
      }
    end
  end
  def create
    announcement = Announcement.new announcement_params
    if announcement.save
      flash[:success] = "Announcement is created"
    end
  end

  private

  def load_shop
    @shop = Shop.find_by shopify_domain: params[:shop]
  end

  def announcement_params
    params.require(:announcement).permit :template_id, :shop_id, :name, :message, :button_text, :active
  end
end
