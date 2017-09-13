Rails.application.routes.draw do
  root :to => 'announcements#index'
  mount ShopifyApp::Engine, at: '/'
  resources :announcements
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
