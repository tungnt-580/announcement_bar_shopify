Rails.application.routes.draw do
  root :to => 'announcements#index'
  mount ShopifyApp::Engine, at: '/'
  resources :announcements do
    get "choose_template", on: :collection
  end

  namespace :api do
    resources :announcements do
      get "active", on: :collection
    end
  end
end
