class HomeController < ShopifyApp::AuthenticatedController
  def index
  	@shop = ShopifyAPI::Shop.current
  end
end
