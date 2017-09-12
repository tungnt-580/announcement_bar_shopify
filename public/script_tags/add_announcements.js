(function() {
  var server, shop, scripts = document.getElementsByTagName('script');

  for (var i = 0; i < scripts.length; i++) {
    if (scripts[i].src.indexOf('/add_announcements.js') > 0) {
      server = scripts[i].src.split('script_tags/add_announcements.js')[0];
      shop   = scripts[i].src.split('script_tags/add_announcements.js?shop=')[1];
    }
  }

  console.log(server, shop, scripts);

  function init_announcements() {
    SS.Ajax.request(server + 'announcements.json?shop=' + shop + '&task=get_settings', function(res) {
      if (res.responseJSON) {
        console.log(res.responseJSON);
        settings = res.responseJSON;
      }
    });
  }

  // Load common library.
  var script = document.createElement( 'script' );

  script.src = server + '/common.js';
  script.async = 1;
  script.onload = init_announcements;

  script.onreadystatechange = function() {
    if ( this.readyState == 'complete' || this.readyState == 'loaded' ) {
      script.onload();
    }
  };

  document.body.appendChild(script);

}());
