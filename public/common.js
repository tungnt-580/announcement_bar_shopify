/**
 * @version    $Id$
 * @package    SellerSmith
 * @author     SellerSmith Team <hi@sellersmith.com>
 * @copyright  Copyright (C) 2017 SellerSmith. All Rights Reserved.
 * @license    GNU/GPL v2 or later http://www.gnu.org/licenses/gpl-2.0.html
 */

(function(w) {
  w.SS = {
    // Define event helper functions.
    Event: {
      handlers: {},

      add: function(el, evt, fn) {
        if (typeof el == 'string') {
          el = document.querySelectorAll(el);
        }

        if ( ! (el instanceof NodeList) ) {
          el = [el];
        }

        for (var i = 0; i < el.length; i++) {
          var e = el[i];

          if (typeof e.addEventListener == 'function') {
            e.addEventListener(evt, fn, false);
          } else if (typeof e.attachEvent == 'function') {
            e.attachEvent(evt, fn);
          } else {
            // Store event handler for later reference.
            this.handlers[e] = this.handlers[e] || {};
            this.handlers[e][evt] = this.handlers[e][evt] || [];
            this.handlers[e][evt].push(fn);
          }
        }
      },

      remove: function(el, evt, fn) {
        if (typeof el == 'string') {
          el = document.querySelectorAll(el);
        }

        if ( ! (el instanceof NodeList) ) {
          el = [el];
        }

        for (var i = 0; i < el.length; i++) {
          var e = el[i];

          if (typeof e.removeEventListener == 'function') {
            e.removeEventListener(evt, fn, false);
          } else if (typeof e.detachEvent == 'function') {
            e.detachEvent(evt, fn);
          } else {
            // Remove event handler.
            if (this.handlers[e] && this.handlers[e][evt]) {
              for (var j = 0; j < this.handlers[e][evt].length; j++) {
                if (this.handlers[e][evt][j] === fn) {
                  delete this.handlers[e][evt][j];
                }
              }
            }
          }
        }
      },

      trigger: function(el, evt) {
        if (typeof el == 'string') {
          el = document.querySelectorAll(el);
        }

        if ( ! (el instanceof NodeList) ) {
          el = [el];
        }

        for (var i = 0; i < el.length; i++) {
          var e = el[i], event = {target: e, type: evt};

          if (typeof e.dispatchEvent == 'function') {
            event = new Event(evt);

            e.dispatchEvent(event);
          } else if (typeof e.fireEvent == 'function') {
            event = doc.createEventObject();

            e.fireEvent('on' + evt, event);
          } else {
            // Execute stored event handlers.
            if (this.handlers[e] && this.handlers[e][evt]) {
              for (var j = 0; j < this.handlers[e][evt].length; j++) {
                if (typeof this.handlers[e][evt][j] == 'function') {
                  this.handlers[e][evt][j](event);
                }
              }
            }
          }
        }
      }
    },

    // Define AJAX helper functions.
    Ajax: {
      /**
       * Convert Javascript object to query string that can be used directly
       * in GET request or POST to server.
       *
       * @param   object  obj     A Javascript object.
       * @param   string  prefix  Prefix to prepend to variable in query string.
       *
       * @return  string
       */
      toQueryString: function(obj, prefix) {
        // Make sure obj is an object.
        if (typeof obj != 'object') {
          return obj;
        }

        // Convert the provided object to query string.
        var str = [];

        for (var p in obj) {
          if ( obj.hasOwnProperty(p) ) {
            var k = prefix ? prefix + '[' + p + ']' : p, v = obj[p];

            str.push(
              typeof v == 'object'
                ? this.toQueryString(v, k)
                : encodeURIComponent(k) + '=' + encodeURIComponent(v)
            );
          }
        }

        return str.join('&');
      },

      requesting: {},

      /**
       * Send a HTTP request using Ajax.
       *
       * @param   string    url       URL to load file content.
       * @param   function  callback  If specified, this function will be called
       *                              when file content is loaded.
       * @param   object    postData  If specified, the data will be POST-ed to the specified URL.
       *
       * @return  mixed
       */
      request: function(url, callback, postData) {
        // Define function to create a XMLHttpRequest object.
        var XMLHttpFactories = [
          function() { return new XMLHttpRequest() },
          function() { return new ActiveXObject( 'Msxml2.XMLHTTP' ) },
          function() { return new ActiveXObject( 'Msxml3.XMLHTTP' ) },
          function() { return new ActiveXObject( 'Microsoft.XMLHTTP' ) }
        ];

        function createXMLHTTPObject() {
          var xmlhttp = false;

          for (var i = 0; i < XMLHttpFactories.length; i++) {
            try {
              xmlhttp = XMLHttpFactories[i]();
            }
            catch (e) {
              continue;
            }

            break;
          }

          return xmlhttp;
        }

        // Never request the same URL twice.
        if (this.requesting && this.requesting[url]) {
          return this.requesting[url].push(callback);
        }

        // Create a new XMLHttpRequest object.
        var req = createXMLHTTPObject();

        if ( ! req ) {
          if (typeof callback == 'function') {
            callback(req);
          }

          return;
        }

        // Prepare request method then open new request.
        var method = postData ? 'POST' : 'GET';

        req.open(method, url, true);

        if (postData) {
          req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }

        // Handle state change.
        req.onreadystatechange = function() {
          if (req.readyState != 4) {
            return;
          }

          if (parseInt( req.status.toString().substr(0, 1) ) != 2 && req.status != 304) {
            var res = {};

            for (var p in req) {
              res[p] = req[p];
            }

            res.response = res.responseText = req.status + ' ' + req.statusText;

            req = res;
          }

          // Try to JSON-decode the response text.
          try {
            req.responseJSON = JSON.parse(req.responseText);
          } catch (e) {
            req.responseJSON = {
              type: 'error',
              data: req.responseText,
              error: e,
              success: false
            };
          }

          // If call-back specified and is a valid function, execute it.
          for (var i = 0, n = this.requesting[url].length; i < n; i++) {
            if (typeof this.requesting[url][i] == 'function') {
              this.requesting[url][i](req);
            }
          }

          delete this.requesting[url];
        }.bind(this);

        req.send( this.toQueryString(postData) );

        // Store currently requested URL and call back function.
        this.requesting[url] = this.requesting[url] || [];

        this.requesting[url].push(callback);

        return req;
      },

      loadedStylesheets: {},

      /**
       * Dynamically load a stylesheet file.
       *
       * @param   string    file      The stylesheet file to load.
       * @param   function  callback  If specified, this function will be called
       *                              when the stylesheet is loaded.
       *
       * @return  void
       */
      loadStylesheet: function( file, callback ) {
        // Never request the same URL twice.
        if ( this.loadedStylesheets && this.loadedStylesheets[file] ) {
          if ( this.loadedStylesheets[file] === true ) {
            // The specified stylesheet is finished loading, execute call back immediately.
            if (typeof callback == 'function') {
              callback();
            }
          } else {
            this.loadedStylesheets[file].push(callback);
          }

          return;
        }

        // Load stylesheet.
        var stylesheet = document.createElement( 'link' );

        stylesheet.rel = 'stylesheet';
        stylesheet.href = file;
        stylesheet.type = 'text/css';
        stylesheet.async = 1;

        stylesheet.onload = function( event ) {
          // If call-back specified and is a valid function, execute it.
          for (var i = 0, n = this.loadedStylesheets[file].length; i < n; i++) {
            if (typeof this.loadedStylesheets[file][i] == 'function') {
              this.loadedStylesheets[file][i]();
            }
          }

          this.loadedStylesheets[file] = true;
        }.bind(this);

        stylesheet.onreadystatechange = function() {
          if ( this.readyState == 'complete' || this.readyState == 'loaded' ) {
            stylesheet.onload();
          }
        };

        // Store currently requested URL and call back function.
        this.loadedStylesheets[file] = this.loadedStylesheets[file] || [];

        this.loadedStylesheets[file].push(callback);

        document.body.appendChild( stylesheet );
      },

      loadedScripts: {},

      /**
       * Dynamically load a Javascript file.
       *
       * @param   string    file      The Javascript file to load.
       * @param   function  callback  If specified, this function will be called when file content is loaded.
       * @param   string    type      If 'babel' is specified, then the content of the script file will
       *                              be loaded via Ajax then passed to Babel for transpilation.
       *
       * @return  void
       */
      loadScript: function( file, callback, type ) {
        // Never request the same URL twice.
        if ( this.loadedScripts && this.loadedScripts[file] ) {
          if ( this.loadedScripts[file] === true ) {
            // The specified script is finished loading, execute call back immediately.
            if (typeof callback == 'function') {
              callback();
            }
          } else {
            this.loadedScripts[file].push(callback);
          }

          return;
        }

        // Define function that handles load event.
        var onload = function() {
          // If call-back specified and is a valid function, execute it.
          for (var i = 0, n = this.loadedScripts[file].length; i < n; i++) {
            if (typeof this.loadedScripts[file][i] == 'function') {
              this.loadedScripts[file][i]();
            }
          }

          this.loadedScripts[file] = true;
        }.bind(this);

        // Store currently requested URL and call back function.
        this.loadedScripts[file] = this.loadedScripts[file] || [];

        this.loadedScripts[file].push(callback);

        if ( type != 'babel' ) {
          // Load script normally.
          var script = document.createElement( 'script' );

          script.src = file;
          script.async = 1;
          script.onload = onload;

          script.onreadystatechange = function() {
            if ( this.readyState == 'complete' || this.readyState == 'loaded' ) {
              script.onload();
            }
          };

          document.body.appendChild( script );
        } else {
          // Load the content of the script file via Ajax then let Babel execute it.
          this.request( file, function( req ) {
            if ( window.babel === undefined ) {
              this.loadScript(
                'https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.24/browser.min.js',
                function( script, callback ) {
                  babel.run( script );
                  callback();
                }.bind(this, req.responseText, onload)
              );
            } else {
              babel.run( req.responseText );
              onload();
            }
          }.bind(this) );
        }
      }
    }
  };
})(window);
