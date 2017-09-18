class AnnouncementsController < ShopifyApp::AuthenticatedController
  before_action :load_shop
  before_action :load_announcement, only: [:edit, :update, :destroy]

  def index
    return unless @shop
    @announcements = @shop.announcements
  end

  def new
    @announcement = Announcement.template.first.dup
    setup_new_announcement
  end

  def choose_template
    @announcement = Announcement.find_by(id: params[:template_id]).dup
    setup_new_announcement
  end

  def create
    @announcement = Announcement.new announcement_params
    @announcement.is_template = false
    @announcement.shop_id = @shop.id
    if @announcement.save
      flash[:success] = "Announcement has been created"
      redirect_to announcements_url
    end
  end

  def edit
  end

  def update
    @announcement.update announcement_params
    redirect_to root_url
  end

  def destroy
    if @announcement.destroy
      flash[:success] = "Announcement has been deleted"
      redirect_to root_url
    end
  end

  private

  def load_shop
    @shop = Shop.find_by shopify_domain: ShopifyAPI::Shop.current.domain
  end

  def load_announcement
    @announcement = Announcement.find_by id: params[:id]
  end

  def setup_new_announcement
    @announcement.name = "New announcement"
    @announcement.message = "All men's t-shirts are 15\% off"
    @announcement.button_text = "Check the product"
    @announcement.active = !Announcement.get_active(@shop.id)
  end

  def announcement_params
    params.require(:announcement).permit :template_id, :shop_id, :name, :message, :button_text, :active, 
      :background_color, :text_color, :button_background_color, :button_text_color, :fonts, :font_size,
      :display_pages_option, :display_pages, :exclude_pages_option, :exclude_pages
  end
end
