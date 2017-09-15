(function() {
  var server, shop, scripts = document.getElementsByTagName('script');

  for (var i = 0; i < scripts.length; i++) {
    if (scripts[i].src.indexOf('script_tags/add_announcements.js') > 0) {
      server = scripts[i].src.split('script_tags/add_announcements.js')[0];
      shop   = scripts[i].src.split('script_tags/add_announcements.js?shop=')[1];
    }
  }

  function render_announcements() {
    SS.Ajax.request(server + 'api/announcements/active.json?shop=' + shop, function(res) {
      if (res.responseJSON) {
        announcement = res.responseJSON;
        console.log(announcement);

        fonts_link = document.createElement('link');
        fonts_link.setAttribute('href', 'https://fonts.googleapis.com/css?family=' + announcement.fonts);
        fonts_link.setAttribute('rel', 'stylesheet');
        fonts_link.setAttribute('type', 'text/css');

        container = document.createElement('div');
        container.style.cssText = 'opacity: 1; margin: 0px; padding: 0px; left: 0px; height: 40px; width: 100%; z-index: 100000; top: 0px; position: absolute;';

        announcement_ele = document.createElement('div');
        announcement_ele.style.cssText = 'text-align: center; margin: 0px; padding: 10px; left: 0px; height: auto; width: 100%; box-sizing: border-box; border: none; position: absolute; line-height: 20px;';
        announcement_ele.style.backgroundColor = announcement.background_color;
        announcement_ele.style.color = announcement.text_color;
        announcement_ele.style.fontFamily = announcement.fonts;
        announcement_ele.style.fontSize = announcement.font_size;
        container.appendChild(announcement_ele);

        content = document.createElement('div');
        content.style.cssText = 'text-align:center; display: inline-block;';
        announcement_ele.appendChild(content);

        message = document.createElement('span');
        message.innerHTML = announcement.message;
        content.appendChild(message);

        button = document.createElement('span');
        button.style.cssText = "display:inline-block; cursor: pointer;";
        content.appendChild(button);

        link = document.createElement('a');
        link.style.cssText = 'outline: none; border: none; padding: 0px 10px; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; border-bottom-left-radius: 5px; text-decoration: none; line-height: 20px;';
        link.style.backgroundColor = announcement.button_background_color;
        link.style.color = announcement.button_text_color;
        link.style.font_size = announcement.font_size;
        link.setAttribute('type', 'button');
        link.innerHTML = announcement.button_text;
        button.appendChild(link);

        document.head.appendChild(fonts_link);
        document.body.appendChild(container);
        document.body.style.cssText='padding-top: 40px; position: relative;';
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
