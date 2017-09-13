(function() {
  var server, shop, scripts = document.getElementsByTagName('script');

  for (var i = 0; i < scripts.length; i++) {
    if (scripts[i].src.indexOf('/add_announcements.js') > 0) {
      server = scripts[i].src.split('script_tags/add_announcements.js')[0];
      shop   = scripts[i].src.split('script_tags/add_announcements.js?shop=')[1];
    }
  }

  function render_announcements() {
    SS.Ajax.request(server + 'announcements.json?shop=' + shop + '&task=get_settings', function(res) {
      if (res.responseJSON) {
        settings = res.responseJSON;
        announcements = document.createElement('div');
        announcements.innerHTML = '<div style="opacity: 1; margin: 0px; padding: 0px; left: 0px; height: 40px; width: 100%; z-index: 100000; top: 0px; position: absolute;"><div id="qab_bar" style="text-align: center; margin: 0px; padding: 10px; left: 0px; height: auto; width: 100%; box-sizing: border-box; border: none; position: absolute; background-color: rgba(252, 255, 245, 0.701961); color: rgb(25, 52, 65); font-size: 16px; line-height: 20px; font-family: "Carter One";"><div id="qab_content" style="text-align:center; display: inline-block;"><span id="qab_message">All men\'s t-shirts are 15% off </span> <span style="display:inline-block;"><a id="qab_button" style="outline: none; border: none; padding: 0px 10px; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; border-bottom-left-radius: 5px; text-decoration: none; color: rgb(252, 255, 245); background-color: rgb(25, 52, 65); font-size: 16px; line-height: 20px;" type="button" href="javascript:qab_button_on_click()">Check the product</a></span></div></div></div>';
        document.body.appendChild(announcements);
        document.body.style.cssText='padding-top: 40px; position: relative;'
      }
    });
    
  }

  // Load common library.
  var script = document.createElement( 'script' );

  script.src = server + '/common.js';
  script.async = 1;
  script.onload = render_announcements;

  script.onreadystatechange = function() {
    if ( this.readyState == 'complete' || this.readyState == 'loaded' ) {
      script.onload();
    }
  };

  document.body.appendChild(script);

}());
