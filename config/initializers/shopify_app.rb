ShopifyApp.configure do |config|
  config.application_name = "Announcement Bar"
  config.api_key = ENV['API_KEY']
  config.secret = ENV['SECRET_KEY']
  config.scope = "write_script_tags"
  config.embedded_app = true
  config.after_authenticate_job = false
  config.session_repository = Shop
  config.scripttags = [
    {
      event: 'onload',
      src: 'https://83f36ac9.ngrok.io/script_tags/add_announcements.js'
    }
  ]
end
