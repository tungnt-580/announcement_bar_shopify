class HomeController < ShopifyApp::AuthenticatedController
  def index
    redirect_to announcements_path(shop: params[:shop])
  end
end
