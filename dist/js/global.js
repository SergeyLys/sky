(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

var _COMMON = require("./pages/COMMON");

var _COMMON2 = _interopRequireDefault(_COMMON);

var _HOME = require("./pages/HOME");

var _HOME2 = _interopRequireDefault(_HOME);

var _PROJECTS = require("./pages/PROJECTS");

var _PROJECTS2 = _interopRequireDefault(_PROJECTS);

var _CONTACTS = require("./pages/CONTACTS");

var _CONTACTS2 = _interopRequireDefault(_CONTACTS);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var init = null;

switch (global.vars.page) {
    case 'home_page':
        init = _HOME2.default.init.bind(_HOME2.default);
        break;
    case 'projects_page':
        init = _PROJECTS2.default.init.bind(_PROJECTS2.default);
        break;
    case 'common_page':
        init = _COMMON2.default.init.bind(_COMMON2.default);
        break;
    case 'contacts_page':
        init = _CONTACTS2.default.init.bind(_CONTACTS2.default);
        break;
    default:
        init = function init() {
            console.log('default init');
        };
}

$(document).ready(init());

$(window).on('resize', function () {});

$(window).on('scroll', function () {});

$(window).on('load', function () {});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./pages/COMMON":9,"./pages/CONTACTS":10,"./pages/HOME":11,"./pages/PROJECTS":12}],2:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * Select2 4.0.3
 * https://select2.github.io
 *
 * Released under the MIT license
 * https://github.com/select2/select2/blob/master/LICENSE.md
 */
(function (factory) {
  factory(jQuery);
})(function (jQuery) {
  // This is needed so we can catch the AMD loader configuration and use it
  // The inner file should be wrapped (by `banner.start.js`) in a function that
  // returns the AMD loader references.
  var S2 = function () {
    // Restore the Select2 AMD loader so it can be used
    // Needed mostly in the language files, where the loader is not inserted
    if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd) {
      var S2 = jQuery.fn.select2.amd;
    }
    var S2;(function () {
      if (!S2 || !S2.requirejs) {
        if (!S2) {
          S2 = {};
        } else {
          require = S2;
        }
        /**
         * @license almond 0.3.1 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
         * Available via the MIT or new BSD license.
         * see: http://github.com/jrburke/almond for details
         */
        //Going sloppy to avoid 'use strict' string cost, but strict practices should
        //be followed.
        /*jslint sloppy: true */
        /*global setTimeout: false */

        var requirejs, require, define;
        (function (undef) {
          var main,
              _req,
              makeMap,
              handlers,
              defined = {},
              waiting = {},
              config = {},
              defining = {},
              hasOwn = Object.prototype.hasOwnProperty,
              aps = [].slice,
              jsSuffixRegExp = /\.js$/;

          function hasProp(obj, prop) {
            return hasOwn.call(obj, prop);
          }

          /**
           * Given a relative module name, like ./something, normalize it to
           * a real name that can be mapped to a path.
           * @param {String} name the relative name
           * @param {String} baseName a real name that the name arg is relative
           * to.
           * @returns {String} normalized name
           */
          function normalize(name, baseName) {
            var nameParts,
                nameSegment,
                mapValue,
                foundMap,
                lastIndex,
                foundI,
                foundStarMap,
                starI,
                i,
                j,
                part,
                baseParts = baseName && baseName.split("/"),
                map = config.map,
                starMap = map && map['*'] || {};

            //Adjust any relative paths.
            if (name && name.charAt(0) === ".") {
              //If have a base name, try to normalize against it,
              //otherwise, assume it is a top-level require that will
              //be relative to baseUrl in the end.
              if (baseName) {
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                  name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                //Lop off the last part of baseParts, so that . matches the
                //"directory" and not name of the baseName's module. For instance,
                //baseName of "one/two/three", maps to "one/two/three.js", but we
                //want the directory, "one/two" for this normalization.
                name = baseParts.slice(0, baseParts.length - 1).concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                  part = name[i];
                  if (part === ".") {
                    name.splice(i, 1);
                    i -= 1;
                  } else if (part === "..") {
                    if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                      //End of the line. Keep at least one non-dot
                      //path segment at the front so it can be mapped
                      //correctly to disk. Otherwise, there is likely
                      //no path mapping for a path starting with '..'.
                      //This can still fail, but catches the most reasonable
                      //uses of ..
                      break;
                    } else if (i > 0) {
                      name.splice(i - 1, 2);
                      i -= 2;
                    }
                  }
                }
                //end trimDots

                name = name.join("/");
              } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
              }
            }

            //Apply map config if available.
            if ((baseParts || starMap) && map) {
              nameParts = name.split('/');

              for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                  //Find the longest baseName segment match in the config.
                  //So, do joins on the biggest to smallest lengths of baseParts.
                  for (j = baseParts.length; j > 0; j -= 1) {
                    mapValue = map[baseParts.slice(0, j).join('/')];

                    //baseName segment has  config, find if it has one for
                    //this name.
                    if (mapValue) {
                      mapValue = mapValue[nameSegment];
                      if (mapValue) {
                        //Match, update name to the new value.
                        foundMap = mapValue;
                        foundI = i;
                        break;
                      }
                    }
                  }
                }

                if (foundMap) {
                  break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                  foundStarMap = starMap[nameSegment];
                  starI = i;
                }
              }

              if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
              }

              if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
              }
            }

            return name;
          }

          function makeRequire(relName, forceSync) {
            return function () {
              //A version of a require function that passes a moduleName
              //value for items that may need to
              //look up paths relative to the moduleName
              var args = aps.call(arguments, 0);

              //If first arg is not require('string'), and there is only
              //one arg, it is the array form without a callback. Insert
              //a null so that the following concat is correct.
              if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
              }
              return _req.apply(undef, args.concat([relName, forceSync]));
            };
          }

          function makeNormalize(relName) {
            return function (name) {
              return normalize(name, relName);
            };
          }

          function makeLoad(depName) {
            return function (value) {
              defined[depName] = value;
            };
          }

          function callDep(name) {
            if (hasProp(waiting, name)) {
              var args = waiting[name];
              delete waiting[name];
              defining[name] = true;
              main.apply(undef, args);
            }

            if (!hasProp(defined, name) && !hasProp(defining, name)) {
              throw new Error('No ' + name);
            }
            return defined[name];
          }

          //Turns a plugin!resource to [plugin, resource]
          //with the plugin being undefined if the name
          //did not have a plugin prefix.
          function splitPrefix(name) {
            var prefix,
                index = name ? name.indexOf('!') : -1;
            if (index > -1) {
              prefix = name.substring(0, index);
              name = name.substring(index + 1, name.length);
            }
            return [prefix, name];
          }

          /**
           * Makes a name map, normalizing the name, and using a plugin
           * for normalization if necessary. Grabs a ref to plugin
           * too, as an optimization.
           */
          makeMap = function makeMap(name, relName) {
            var plugin,
                parts = splitPrefix(name),
                prefix = parts[0];

            name = parts[1];

            if (prefix) {
              prefix = normalize(prefix, relName);
              plugin = callDep(prefix);
            }

            //Normalize according
            if (prefix) {
              if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
              } else {
                name = normalize(name, relName);
              }
            } else {
              name = normalize(name, relName);
              parts = splitPrefix(name);
              prefix = parts[0];
              name = parts[1];
              if (prefix) {
                plugin = callDep(prefix);
              }
            }

            //Using ridiculous property names for space reasons
            return {
              f: prefix ? prefix + '!' + name : name, //fullName
              n: name,
              pr: prefix,
              p: plugin
            };
          };

          function makeConfig(name) {
            return function () {
              return config && config.config && config.config[name] || {};
            };
          }

          handlers = {
            require: function require(name) {
              return makeRequire(name);
            },
            exports: function exports(name) {
              var e = defined[name];
              if (typeof e !== 'undefined') {
                return e;
              } else {
                return defined[name] = {};
              }
            },
            module: function module(name) {
              return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
              };
            }
          };

          main = function main(name, deps, callback, relName) {
            var cjsModule,
                depName,
                ret,
                map,
                i,
                args = [],
                callbackType = typeof callback === "undefined" ? "undefined" : _typeof(callback),
                usingExports;

            //Use name if no relName
            relName = relName || name;

            //Call the callback to define the module, if necessary.
            if (callbackType === 'undefined' || callbackType === 'function') {
              //Pull out the defined dependencies and pass the ordered
              //values to the callback.
              //Default to [require, exports, module] if no deps
              deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
              for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                  args[i] = handlers.require(name);
                } else if (depName === "exports") {
                  //CommonJS module spec 1.1
                  args[i] = handlers.exports(name);
                  usingExports = true;
                } else if (depName === "module") {
                  //CommonJS module spec 1.1
                  cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) || hasProp(waiting, depName) || hasProp(defining, depName)) {
                  args[i] = callDep(depName);
                } else if (map.p) {
                  map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                  args[i] = defined[depName];
                } else {
                  throw new Error(name + ' missing ' + depName);
                }
              }

              ret = callback ? callback.apply(defined[name], args) : undefined;

              if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef && cjsModule.exports !== defined[name]) {
                  defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                  //Use the return value from the function.
                  defined[name] = ret;
                }
              }
            } else if (name) {
              //May just be an object definition for the module. Only
              //worry about defining if have a module name.
              defined[name] = callback;
            }
          };

          requirejs = require = _req = function req(deps, callback, relName, forceSync, alt) {
            if (typeof deps === "string") {
              if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
              }
              //Just return the module wanted. In this scenario, the
              //deps arg is the module name, and second arg (if passed)
              //is just the relName.
              //Normalize module name, if it contains . or ..
              return callDep(makeMap(deps, callback).f);
            } else if (!deps.splice) {
              //deps is a config object, not an array.
              config = deps;
              if (config.deps) {
                _req(config.deps, config.callback);
              }
              if (!callback) {
                return;
              }

              if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
              } else {
                deps = undef;
              }
            }

            //Support require(['a'])
            callback = callback || function () {};

            //If relName is a function, it is an errback handler,
            //so remove it.
            if (typeof relName === 'function') {
              relName = forceSync;
              forceSync = alt;
            }

            //Simulate async callback;
            if (forceSync) {
              main(undef, deps, callback, relName);
            } else {
              //Using a non-zero value because of concern for what old browsers
              //do, and latest browsers "upgrade" to 4 if lower value is used:
              //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
              //If want a value immediately, use require('id') instead -- something
              //that works in almond on the global level, but not guaranteed and
              //unlikely to work in other AMD implementations.
              setTimeout(function () {
                main(undef, deps, callback, relName);
              }, 4);
            }

            return _req;
          };

          /**
           * Just drops the config on the floor, but returns req in case
           * the config return value is used.
           */
          _req.config = function (cfg) {
            return _req(cfg);
          };

          /**
           * Expose module registry for debugging and tooling
           */
          requirejs._defined = defined;

          define = function define(name, deps, callback) {
            if (typeof name !== 'string') {
              throw new Error('See almond README: incorrect module build, no module name');
            }

            //This module may not have dependencies
            if (!deps.splice) {
              //deps is not an array, so probably means
              //an object literal or factory function for
              //the value. Adjust args.
              callback = deps;
              deps = [];
            }

            if (!hasProp(defined, name) && !hasProp(waiting, name)) {
              waiting[name] = [name, deps, callback];
            }
          };

          define.amd = {
            jQuery: true
          };
        })();

        S2.requirejs = requirejs;S2.require = require;S2.define = define;
      }
    })();
    S2.define("almond", function () {});

    /* global jQuery:false, $:false */
    S2.define('jquery', [], function () {
      var _$ = jQuery || $;

      if (_$ == null && console && console.error) {
        console.error('Select2: An instance of jQuery or a jQuery-compatible library was not ' + 'found. Make sure that you are including jQuery before Select2 on your ' + 'web page.');
      }

      return _$;
    });

    S2.define('select2/utils', ['jquery'], function ($) {
      var Utils = {};

      Utils.Extend = function (ChildClass, SuperClass) {
        var __hasProp = {}.hasOwnProperty;

        function BaseConstructor() {
          this.constructor = ChildClass;
        }

        for (var key in SuperClass) {
          if (__hasProp.call(SuperClass, key)) {
            ChildClass[key] = SuperClass[key];
          }
        }

        BaseConstructor.prototype = SuperClass.prototype;
        ChildClass.prototype = new BaseConstructor();
        ChildClass.__super__ = SuperClass.prototype;

        return ChildClass;
      };

      function getMethods(theClass) {
        var proto = theClass.prototype;

        var methods = [];

        for (var methodName in proto) {
          var m = proto[methodName];

          if (typeof m !== 'function') {
            continue;
          }

          if (methodName === 'constructor') {
            continue;
          }

          methods.push(methodName);
        }

        return methods;
      }

      Utils.Decorate = function (SuperClass, DecoratorClass) {
        var decoratedMethods = getMethods(DecoratorClass);
        var superMethods = getMethods(SuperClass);

        function DecoratedClass() {
          var unshift = Array.prototype.unshift;

          var argCount = DecoratorClass.prototype.constructor.length;

          var calledConstructor = SuperClass.prototype.constructor;

          if (argCount > 0) {
            unshift.call(arguments, SuperClass.prototype.constructor);

            calledConstructor = DecoratorClass.prototype.constructor;
          }

          calledConstructor.apply(this, arguments);
        }

        DecoratorClass.displayName = SuperClass.displayName;

        function ctr() {
          this.constructor = DecoratedClass;
        }

        DecoratedClass.prototype = new ctr();

        for (var m = 0; m < superMethods.length; m++) {
          var superMethod = superMethods[m];

          DecoratedClass.prototype[superMethod] = SuperClass.prototype[superMethod];
        }

        var calledMethod = function calledMethod(methodName) {
          // Stub out the original method if it's not decorating an actual method
          var originalMethod = function originalMethod() {};

          if (methodName in DecoratedClass.prototype) {
            originalMethod = DecoratedClass.prototype[methodName];
          }

          var decoratedMethod = DecoratorClass.prototype[methodName];

          return function () {
            var unshift = Array.prototype.unshift;

            unshift.call(arguments, originalMethod);

            return decoratedMethod.apply(this, arguments);
          };
        };

        for (var d = 0; d < decoratedMethods.length; d++) {
          var decoratedMethod = decoratedMethods[d];

          DecoratedClass.prototype[decoratedMethod] = calledMethod(decoratedMethod);
        }

        return DecoratedClass;
      };

      var Observable = function Observable() {
        this.listeners = {};
      };

      Observable.prototype.on = function (event, callback) {
        this.listeners = this.listeners || {};

        if (event in this.listeners) {
          this.listeners[event].push(callback);
        } else {
          this.listeners[event] = [callback];
        }
      };

      Observable.prototype.trigger = function (event) {
        var slice = Array.prototype.slice;
        var params = slice.call(arguments, 1);

        this.listeners = this.listeners || {};

        // Params should always come in as an array
        if (params == null) {
          params = [];
        }

        // If there are no arguments to the event, use a temporary object
        if (params.length === 0) {
          params.push({});
        }

        // Set the `_type` of the first object to the event
        params[0]._type = event;

        if (event in this.listeners) {
          this.invoke(this.listeners[event], slice.call(arguments, 1));
        }

        if ('*' in this.listeners) {
          this.invoke(this.listeners['*'], arguments);
        }
      };

      Observable.prototype.invoke = function (listeners, params) {
        for (var i = 0, len = listeners.length; i < len; i++) {
          listeners[i].apply(this, params);
        }
      };

      Utils.Observable = Observable;

      Utils.generateChars = function (length) {
        var chars = '';

        for (var i = 0; i < length; i++) {
          var randomChar = Math.floor(Math.random() * 36);
          chars += randomChar.toString(36);
        }

        return chars;
      };

      Utils.bind = function (func, context) {
        return function () {
          func.apply(context, arguments);
        };
      };

      Utils._convertData = function (data) {
        for (var originalKey in data) {
          var keys = originalKey.split('-');

          var dataLevel = data;

          if (keys.length === 1) {
            continue;
          }

          for (var k = 0; k < keys.length; k++) {
            var key = keys[k];

            // Lowercase the first letter
            // By default, dash-separated becomes camelCase
            key = key.substring(0, 1).toLowerCase() + key.substring(1);

            if (!(key in dataLevel)) {
              dataLevel[key] = {};
            }

            if (k == keys.length - 1) {
              dataLevel[key] = data[originalKey];
            }

            dataLevel = dataLevel[key];
          }

          delete data[originalKey];
        }

        return data;
      };

      Utils.hasScroll = function (index, el) {
        // Adapted from the function created by @ShadowScripter
        // and adapted by @BillBarry on the Stack Exchange Code Review website.
        // The original code can be found at
        // http://codereview.stackexchange.com/q/13338
        // and was designed to be used with the Sizzle selector engine.

        var $el = $(el);
        var overflowX = el.style.overflowX;
        var overflowY = el.style.overflowY;

        //Check both x and y declarations
        if (overflowX === overflowY && (overflowY === 'hidden' || overflowY === 'visible')) {
          return false;
        }

        if (overflowX === 'scroll' || overflowY === 'scroll') {
          return true;
        }

        return $el.innerHeight() < el.scrollHeight || $el.innerWidth() < el.scrollWidth;
      };

      Utils.escapeMarkup = function (markup) {
        var replaceMap = {
          '\\': '&#92;',
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          '\'': '&#39;',
          '/': '&#47;'
        };

        // Do not try to escape the markup if it's not a string
        if (typeof markup !== 'string') {
          return markup;
        }

        return String(markup).replace(/[&<>"'\/\\]/g, function (match) {
          return replaceMap[match];
        });
      };

      // Append an array of jQuery nodes to a given element.
      Utils.appendMany = function ($element, $nodes) {
        // jQuery 1.7.x does not support $.fn.append() with an array
        // Fall back to a jQuery object collection using $.fn.add()
        if ($.fn.jquery.substr(0, 3) === '1.7') {
          var $jqNodes = $();

          $.map($nodes, function (node) {
            $jqNodes = $jqNodes.add(node);
          });

          $nodes = $jqNodes;
        }

        $element.append($nodes);
      };

      return Utils;
    });

    S2.define('select2/results', ['jquery', './utils'], function ($, Utils) {
      function Results($element, options, dataAdapter) {
        this.$element = $element;
        this.data = dataAdapter;
        this.options = options;

        Results.__super__.constructor.call(this);
      }

      Utils.Extend(Results, Utils.Observable);

      Results.prototype.render = function () {
        var $results = $('<ul class="select2-results__options" role="tree"></ul>');

        if (this.options.get('multiple')) {
          $results.attr('aria-multiselectable', 'true');
        }

        this.$results = $results;

        return $results;
      };

      Results.prototype.clear = function () {
        this.$results.empty();
      };

      Results.prototype.displayMessage = function (params) {
        var escapeMarkup = this.options.get('escapeMarkup');

        this.clear();
        this.hideLoading();

        var $message = $('<li role="treeitem" aria-live="assertive"' + ' class="select2-results__option"></li>');

        var message = this.options.get('translations').get(params.message);

        $message.append(escapeMarkup(message(params.args)));

        $message[0].className += ' select2-results__message';

        this.$results.append($message);
      };

      Results.prototype.hideMessages = function () {
        this.$results.find('.select2-results__message').remove();
      };

      Results.prototype.append = function (data) {
        this.hideLoading();

        var $options = [];

        if (data.results == null || data.results.length === 0) {
          if (this.$results.children().length === 0) {
            this.trigger('results:message', {
              message: 'noResults'
            });
          }

          return;
        }

        data.results = this.sort(data.results);

        for (var d = 0; d < data.results.length; d++) {
          var item = data.results[d];

          var $option = this.option(item);

          $options.push($option);
        }

        this.$results.append($options);
      };

      Results.prototype.position = function ($results, $dropdown) {
        var $resultsContainer = $dropdown.find('.select2-results');
        $resultsContainer.append($results);
      };

      Results.prototype.sort = function (data) {
        var sorter = this.options.get('sorter');

        return sorter(data);
      };

      Results.prototype.highlightFirstItem = function () {
        var $options = this.$results.find('.select2-results__option[aria-selected]');

        var $selected = $options.filter('[aria-selected=true]');

        // Check if there are any selected options
        if ($selected.length > 0) {
          // If there are selected options, highlight the first
          $selected.first().trigger('mouseenter');
        } else {
          // If there are no selected options, highlight the first option
          // in the dropdown
          $options.first().trigger('mouseenter');
        }

        this.ensureHighlightVisible();
      };

      Results.prototype.setClasses = function () {
        var self = this;

        this.data.current(function (selected) {
          var selectedIds = $.map(selected, function (s) {
            return s.id.toString();
          });

          var $options = self.$results.find('.select2-results__option[aria-selected]');

          $options.each(function () {
            var $option = $(this);

            var item = $.data(this, 'data');

            // id needs to be converted to a string when comparing
            var id = '' + item.id;

            if (item.element != null && item.element.selected || item.element == null && $.inArray(id, selectedIds) > -1) {
              $option.attr('aria-selected', 'true');
            } else {
              $option.attr('aria-selected', 'false');
            }
          });
        });
      };

      Results.prototype.showLoading = function (params) {
        this.hideLoading();

        var loadingMore = this.options.get('translations').get('searching');

        var loading = {
          disabled: true,
          loading: true,
          text: loadingMore(params)
        };
        var $loading = this.option(loading);
        $loading.className += ' loading-results';

        this.$results.prepend($loading);
      };

      Results.prototype.hideLoading = function () {
        this.$results.find('.loading-results').remove();
      };

      Results.prototype.option = function (data) {
        var option = document.createElement('li');
        option.className = 'select2-results__option';

        var attrs = {
          'role': 'treeitem',
          'aria-selected': 'false'
        };

        if (data.disabled) {
          delete attrs['aria-selected'];
          attrs['aria-disabled'] = 'true';
        }

        if (data.id == null) {
          delete attrs['aria-selected'];
        }

        if (data._resultId != null) {
          option.id = data._resultId;
        }

        if (data.title) {
          option.title = data.title;
        }

        if (data.children) {
          attrs.role = 'group';
          attrs['aria-label'] = data.text;
          delete attrs['aria-selected'];
        }

        for (var attr in attrs) {
          var val = attrs[attr];

          option.setAttribute(attr, val);
        }

        if (data.children) {
          var $option = $(option);

          var label = document.createElement('strong');
          label.className = 'select2-results__group';

          var $label = $(label);
          this.template(data, label);

          var $children = [];

          for (var c = 0; c < data.children.length; c++) {
            var child = data.children[c];

            var $child = this.option(child);

            $children.push($child);
          }

          var $childrenContainer = $('<ul></ul>', {
            'class': 'select2-results__options select2-results__options--nested'
          });

          $childrenContainer.append($children);

          $option.append(label);
          $option.append($childrenContainer);
        } else {
          this.template(data, option);
        }

        $.data(option, 'data', data);

        return option;
      };

      Results.prototype.bind = function (container, $container) {
        var self = this;

        var id = container.id + '-results';

        this.$results.attr('id', id);

        container.on('results:all', function (params) {
          self.clear();
          self.append(params.data);

          if (container.isOpen()) {
            self.setClasses();
            self.highlightFirstItem();
          }
        });

        container.on('results:append', function (params) {
          self.append(params.data);

          if (container.isOpen()) {
            self.setClasses();
          }
        });

        container.on('query', function (params) {
          self.hideMessages();
          self.showLoading(params);
        });

        container.on('select', function () {
          if (!container.isOpen()) {
            return;
          }

          self.setClasses();
          self.highlightFirstItem();
        });

        container.on('unselect', function () {
          if (!container.isOpen()) {
            return;
          }

          self.setClasses();
          self.highlightFirstItem();
        });

        container.on('open', function () {
          // When the dropdown is open, aria-expended="true"
          self.$results.attr('aria-expanded', 'true');
          self.$results.attr('aria-hidden', 'false');

          self.setClasses();
          self.ensureHighlightVisible();
        });

        container.on('close', function () {
          // When the dropdown is closed, aria-expended="false"
          self.$results.attr('aria-expanded', 'false');
          self.$results.attr('aria-hidden', 'true');
          self.$results.removeAttr('aria-activedescendant');
        });

        container.on('results:toggle', function () {
          var $highlighted = self.getHighlightedResults();

          if ($highlighted.length === 0) {
            return;
          }

          $highlighted.trigger('mouseup');
        });

        container.on('results:select', function () {
          var $highlighted = self.getHighlightedResults();

          if ($highlighted.length === 0) {
            return;
          }

          var data = $highlighted.data('data');

          if ($highlighted.attr('aria-selected') == 'true') {
            self.trigger('close', {});
          } else {
            self.trigger('select', {
              data: data
            });
          }
        });

        container.on('results:previous', function () {
          var $highlighted = self.getHighlightedResults();

          var $options = self.$results.find('[aria-selected]');

          var currentIndex = $options.index($highlighted);

          // If we are already at te top, don't move further
          if (currentIndex === 0) {
            return;
          }

          var nextIndex = currentIndex - 1;

          // If none are highlighted, highlight the first
          if ($highlighted.length === 0) {
            nextIndex = 0;
          }

          var $next = $options.eq(nextIndex);

          $next.trigger('mouseenter');

          var currentOffset = self.$results.offset().top;
          var nextTop = $next.offset().top;
          var nextOffset = self.$results.scrollTop() + (nextTop - currentOffset);

          if (nextIndex === 0) {
            self.$results.scrollTop(0);
          } else if (nextTop - currentOffset < 0) {
            self.$results.scrollTop(nextOffset);
          }
        });

        container.on('results:next', function () {
          var $highlighted = self.getHighlightedResults();

          var $options = self.$results.find('[aria-selected]');

          var currentIndex = $options.index($highlighted);

          var nextIndex = currentIndex + 1;

          // If we are at the last option, stay there
          if (nextIndex >= $options.length) {
            return;
          }

          var $next = $options.eq(nextIndex);

          $next.trigger('mouseenter');

          var currentOffset = self.$results.offset().top + self.$results.outerHeight(false);
          var nextBottom = $next.offset().top + $next.outerHeight(false);
          var nextOffset = self.$results.scrollTop() + nextBottom - currentOffset;

          if (nextIndex === 0) {
            self.$results.scrollTop(0);
          } else if (nextBottom > currentOffset) {
            self.$results.scrollTop(nextOffset);
          }
        });

        container.on('results:focus', function (params) {
          params.element.addClass('select2-results__option--highlighted');
        });

        container.on('results:message', function (params) {
          self.displayMessage(params);
        });

        if ($.fn.mousewheel) {
          this.$results.on('mousewheel', function (e) {
            var top = self.$results.scrollTop();

            var bottom = self.$results.get(0).scrollHeight - top + e.deltaY;

            var isAtTop = e.deltaY > 0 && top - e.deltaY <= 0;
            var isAtBottom = e.deltaY < 0 && bottom <= self.$results.height();

            if (isAtTop) {
              self.$results.scrollTop(0);

              e.preventDefault();
              e.stopPropagation();
            } else if (isAtBottom) {
              self.$results.scrollTop(self.$results.get(0).scrollHeight - self.$results.height());

              e.preventDefault();
              e.stopPropagation();
            }
          });
        }

        this.$results.on('mouseup', '.select2-results__option[aria-selected]', function (evt) {
          var $this = $(this);

          var data = $this.data('data');

          if ($this.attr('aria-selected') === 'true') {
            if (self.options.get('multiple')) {
              self.trigger('unselect', {
                originalEvent: evt,
                data: data
              });
            } else {
              self.trigger('close', {});
            }

            return;
          }

          self.trigger('select', {
            originalEvent: evt,
            data: data
          });
        });

        this.$results.on('mouseenter', '.select2-results__option[aria-selected]', function (evt) {
          var data = $(this).data('data');

          self.getHighlightedResults().removeClass('select2-results__option--highlighted');

          self.trigger('results:focus', {
            data: data,
            element: $(this)
          });
        });
      };

      Results.prototype.getHighlightedResults = function () {
        var $highlighted = this.$results.find('.select2-results__option--highlighted');

        return $highlighted;
      };

      Results.prototype.destroy = function () {
        this.$results.remove();
      };

      Results.prototype.ensureHighlightVisible = function () {
        var $highlighted = this.getHighlightedResults();

        if ($highlighted.length === 0) {
          return;
        }

        var $options = this.$results.find('[aria-selected]');

        var currentIndex = $options.index($highlighted);

        var currentOffset = this.$results.offset().top;
        var nextTop = $highlighted.offset().top;
        var nextOffset = this.$results.scrollTop() + (nextTop - currentOffset);

        var offsetDelta = nextTop - currentOffset;
        nextOffset -= $highlighted.outerHeight(false) * 2;

        if (currentIndex <= 2) {
          this.$results.scrollTop(0);
        } else if (offsetDelta > this.$results.outerHeight() || offsetDelta < 0) {
          this.$results.scrollTop(nextOffset);
        }
      };

      Results.prototype.template = function (result, container) {
        var template = this.options.get('templateResult');
        var escapeMarkup = this.options.get('escapeMarkup');

        var content = template(result, container);

        if (content == null) {
          container.style.display = 'none';
        } else if (typeof content === 'string') {
          container.innerHTML = escapeMarkup(content);
        } else {
          $(container).append(content);
        }
      };

      return Results;
    });

    S2.define('select2/keys', [], function () {
      var KEYS = {
        BACKSPACE: 8,
        TAB: 9,
        ENTER: 13,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        ESC: 27,
        SPACE: 32,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        END: 35,
        HOME: 36,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        DELETE: 46
      };

      return KEYS;
    });

    S2.define('select2/selection/base', ['jquery', '../utils', '../keys'], function ($, Utils, KEYS) {
      function BaseSelection($element, options) {
        this.$element = $element;
        this.options = options;

        BaseSelection.__super__.constructor.call(this);
      }

      Utils.Extend(BaseSelection, Utils.Observable);

      BaseSelection.prototype.render = function () {
        var $selection = $('<span class="select2-selection" role="combobox" ' + ' aria-haspopup="true" aria-expanded="false">' + '</span>');

        this._tabindex = 0;

        if (this.$element.data('old-tabindex') != null) {
          this._tabindex = this.$element.data('old-tabindex');
        } else if (this.$element.attr('tabindex') != null) {
          this._tabindex = this.$element.attr('tabindex');
        }

        $selection.attr('title', this.$element.attr('title'));
        $selection.attr('tabindex', this._tabindex);

        this.$selection = $selection;

        return $selection;
      };

      BaseSelection.prototype.bind = function (container, $container) {
        var self = this;

        var id = container.id + '-container';
        var resultsId = container.id + '-results';

        this.container = container;

        this.$selection.on('focus', function (evt) {
          self.trigger('focus', evt);
        });

        this.$selection.on('blur', function (evt) {
          self._handleBlur(evt);
        });

        this.$selection.on('keydown', function (evt) {
          self.trigger('keypress', evt);

          if (evt.which === KEYS.SPACE) {
            evt.preventDefault();
          }
        });

        container.on('results:focus', function (params) {
          self.$selection.attr('aria-activedescendant', params.data._resultId);
        });

        container.on('selection:update', function (params) {
          self.update(params.data);
        });

        container.on('open', function () {
          // When the dropdown is open, aria-expanded="true"
          self.$selection.attr('aria-expanded', 'true');
          self.$selection.attr('aria-owns', resultsId);

          self._attachCloseHandler(container);
        });

        container.on('close', function () {
          // When the dropdown is closed, aria-expanded="false"
          self.$selection.attr('aria-expanded', 'false');
          self.$selection.removeAttr('aria-activedescendant');
          self.$selection.removeAttr('aria-owns');

          self.$selection.focus();

          self._detachCloseHandler(container);
        });

        container.on('enable', function () {
          self.$selection.attr('tabindex', self._tabindex);
        });

        container.on('disable', function () {
          self.$selection.attr('tabindex', '-1');
        });
      };

      BaseSelection.prototype._handleBlur = function (evt) {
        var self = this;

        // This needs to be delayed as the active element is the body when the tab
        // key is pressed, possibly along with others.
        window.setTimeout(function () {
          // Don't trigger `blur` if the focus is still in the selection
          if (document.activeElement == self.$selection[0] || $.contains(self.$selection[0], document.activeElement)) {
            return;
          }

          self.trigger('blur', evt);
        }, 1);
      };

      BaseSelection.prototype._attachCloseHandler = function (container) {
        var self = this;

        $(document.body).on('mousedown.select2.' + container.id, function (e) {
          var $target = $(e.target);

          var $select = $target.closest('.select2');

          var $all = $('.select2.select2-container--open');

          $all.each(function () {
            var $this = $(this);

            if (this == $select[0]) {
              return;
            }

            var $element = $this.data('element');

            $element.select2('close');
          });
        });
      };

      BaseSelection.prototype._detachCloseHandler = function (container) {
        $(document.body).off('mousedown.select2.' + container.id);
      };

      BaseSelection.prototype.position = function ($selection, $container) {
        var $selectionContainer = $container.find('.selection');
        $selectionContainer.append($selection);
      };

      BaseSelection.prototype.destroy = function () {
        this._detachCloseHandler(this.container);
      };

      BaseSelection.prototype.update = function (data) {
        throw new Error('The `update` method must be defined in child classes.');
      };

      return BaseSelection;
    });

    S2.define('select2/selection/single', ['jquery', './base', '../utils', '../keys'], function ($, BaseSelection, Utils, KEYS) {
      function SingleSelection() {
        SingleSelection.__super__.constructor.apply(this, arguments);
      }

      Utils.Extend(SingleSelection, BaseSelection);

      SingleSelection.prototype.render = function () {
        var $selection = SingleSelection.__super__.render.call(this);

        $selection.addClass('select2-selection--single');

        $selection.html('<span class="select2-selection__rendered"></span>' + '<span class="select2-selection__arrow" role="presentation">' + '<b role="presentation"></b>' + '</span>');

        return $selection;
      };

      SingleSelection.prototype.bind = function (container, $container) {
        var self = this;

        SingleSelection.__super__.bind.apply(this, arguments);

        var id = container.id + '-container';

        this.$selection.find('.select2-selection__rendered').attr('id', id);
        this.$selection.attr('aria-labelledby', id);

        this.$selection.on('mousedown', function (evt) {
          // Only respond to left clicks
          if (evt.which !== 1) {
            return;
          }

          self.trigger('toggle', {
            originalEvent: evt
          });
        });

        this.$selection.on('focus', function (evt) {
          // User focuses on the container
        });

        this.$selection.on('blur', function (evt) {
          // User exits the container
        });

        container.on('focus', function (evt) {
          if (!container.isOpen()) {
            self.$selection.focus();
          }
        });

        container.on('selection:update', function (params) {
          self.update(params.data);
        });
      };

      SingleSelection.prototype.clear = function () {
        this.$selection.find('.select2-selection__rendered').empty();
      };

      SingleSelection.prototype.display = function (data, container) {
        var template = this.options.get('templateSelection');
        var escapeMarkup = this.options.get('escapeMarkup');

        return escapeMarkup(template(data, container));
      };

      SingleSelection.prototype.selectionContainer = function () {
        return $('<span></span>');
      };

      SingleSelection.prototype.update = function (data) {
        if (data.length === 0) {
          this.clear();
          return;
        }

        var selection = data[0];

        var $rendered = this.$selection.find('.select2-selection__rendered');
        var formatted = this.display(selection, $rendered);

        $rendered.empty().append(formatted);
        $rendered.prop('title', selection.title || selection.text);
      };

      return SingleSelection;
    });

    S2.define('select2/selection/multiple', ['jquery', './base', '../utils'], function ($, BaseSelection, Utils) {
      function MultipleSelection($element, options) {
        MultipleSelection.__super__.constructor.apply(this, arguments);
      }

      Utils.Extend(MultipleSelection, BaseSelection);

      MultipleSelection.prototype.render = function () {
        var $selection = MultipleSelection.__super__.render.call(this);

        $selection.addClass('select2-selection--multiple');

        $selection.html('<ul class="select2-selection__rendered"></ul>');

        return $selection;
      };

      MultipleSelection.prototype.bind = function (container, $container) {
        var self = this;

        MultipleSelection.__super__.bind.apply(this, arguments);

        this.$selection.on('click', function (evt) {
          self.trigger('toggle', {
            originalEvent: evt
          });
        });

        this.$selection.on('click', '.select2-selection__choice__remove', function (evt) {
          // Ignore the event if it is disabled
          if (self.options.get('disabled')) {
            return;
          }

          var $remove = $(this);
          var $selection = $remove.parent();

          var data = $selection.data('data');

          self.trigger('unselect', {
            originalEvent: evt,
            data: data
          });
        });
      };

      MultipleSelection.prototype.clear = function () {
        this.$selection.find('.select2-selection__rendered').empty();
      };

      MultipleSelection.prototype.display = function (data, container) {
        var template = this.options.get('templateSelection');
        var escapeMarkup = this.options.get('escapeMarkup');

        return escapeMarkup(template(data, container));
      };

      MultipleSelection.prototype.selectionContainer = function () {
        var $container = $('<li class="select2-selection__choice">' + '<span class="select2-selection__choice__remove" role="presentation">' + '&times;' + '</span>' + '</li>');

        return $container;
      };

      MultipleSelection.prototype.update = function (data) {
        this.clear();

        if (data.length === 0) {
          return;
        }

        var $selections = [];

        for (var d = 0; d < data.length; d++) {
          var selection = data[d];

          var $selection = this.selectionContainer();
          var formatted = this.display(selection, $selection);

          $selection.append(formatted);
          $selection.prop('title', selection.title || selection.text);

          $selection.data('data', selection);

          $selections.push($selection);
        }

        var $rendered = this.$selection.find('.select2-selection__rendered');

        Utils.appendMany($rendered, $selections);
      };

      return MultipleSelection;
    });

    S2.define('select2/selection/placeholder', ['../utils'], function (Utils) {
      function Placeholder(decorated, $element, options) {
        this.placeholder = this.normalizePlaceholder(options.get('placeholder'));

        decorated.call(this, $element, options);
      }

      Placeholder.prototype.normalizePlaceholder = function (_, placeholder) {
        if (typeof placeholder === 'string') {
          placeholder = {
            id: '',
            text: placeholder
          };
        }

        return placeholder;
      };

      Placeholder.prototype.createPlaceholder = function (decorated, placeholder) {
        var $placeholder = this.selectionContainer();

        $placeholder.html(this.display(placeholder));
        $placeholder.addClass('select2-selection__placeholder').removeClass('select2-selection__choice');

        return $placeholder;
      };

      Placeholder.prototype.update = function (decorated, data) {
        var singlePlaceholder = data.length == 1 && data[0].id != this.placeholder.id;
        var multipleSelections = data.length > 1;

        if (multipleSelections || singlePlaceholder) {
          return decorated.call(this, data);
        }

        this.clear();

        var $placeholder = this.createPlaceholder(this.placeholder);

        this.$selection.find('.select2-selection__rendered').append($placeholder);
      };

      return Placeholder;
    });

    S2.define('select2/selection/allowClear', ['jquery', '../keys'], function ($, KEYS) {
      function AllowClear() {}

      AllowClear.prototype.bind = function (decorated, container, $container) {
        var self = this;

        decorated.call(this, container, $container);

        if (this.placeholder == null) {
          if (this.options.get('debug') && window.console && console.error) {
            console.error('Select2: The `allowClear` option should be used in combination ' + 'with the `placeholder` option.');
          }
        }

        this.$selection.on('mousedown', '.select2-selection__clear', function (evt) {
          self._handleClear(evt);
        });

        container.on('keypress', function (evt) {
          self._handleKeyboardClear(evt, container);
        });
      };

      AllowClear.prototype._handleClear = function (_, evt) {
        // Ignore the event if it is disabled
        if (this.options.get('disabled')) {
          return;
        }

        var $clear = this.$selection.find('.select2-selection__clear');

        // Ignore the event if nothing has been selected
        if ($clear.length === 0) {
          return;
        }

        evt.stopPropagation();

        var data = $clear.data('data');

        for (var d = 0; d < data.length; d++) {
          var unselectData = {
            data: data[d]
          };

          // Trigger the `unselect` event, so people can prevent it from being
          // cleared.
          this.trigger('unselect', unselectData);

          // If the event was prevented, don't clear it out.
          if (unselectData.prevented) {
            return;
          }
        }

        this.$element.val(this.placeholder.id).trigger('change');

        this.trigger('toggle', {});
      };

      AllowClear.prototype._handleKeyboardClear = function (_, evt, container) {
        if (container.isOpen()) {
          return;
        }

        if (evt.which == KEYS.DELETE || evt.which == KEYS.BACKSPACE) {
          this._handleClear(evt);
        }
      };

      AllowClear.prototype.update = function (decorated, data) {
        decorated.call(this, data);

        if (this.$selection.find('.select2-selection__placeholder').length > 0 || data.length === 0) {
          return;
        }

        var $remove = $('<span class="select2-selection__clear">' + '&times;' + '</span>');
        $remove.data('data', data);

        this.$selection.find('.select2-selection__rendered').prepend($remove);
      };

      return AllowClear;
    });

    S2.define('select2/selection/search', ['jquery', '../utils', '../keys'], function ($, Utils, KEYS) {
      function Search(decorated, $element, options) {
        decorated.call(this, $element, options);
      }

      Search.prototype.render = function (decorated) {
        var $search = $('<li class="select2-search select2-search--inline">' + '<input class="select2-search__field" type="search" tabindex="-1"' + ' autocomplete="off" autocorrect="off" autocapitalize="off"' + ' spellcheck="false" role="textbox" aria-autocomplete="list" />' + '</li>');

        this.$searchContainer = $search;
        this.$search = $search.find('input');

        var $rendered = decorated.call(this);

        this._transferTabIndex();

        return $rendered;
      };

      Search.prototype.bind = function (decorated, container, $container) {
        var self = this;

        decorated.call(this, container, $container);

        container.on('open', function () {
          self.$search.trigger('focus');
        });

        container.on('close', function () {
          self.$search.val('');
          self.$search.removeAttr('aria-activedescendant');
          self.$search.trigger('focus');
        });

        container.on('enable', function () {
          self.$search.prop('disabled', false);

          self._transferTabIndex();
        });

        container.on('disable', function () {
          self.$search.prop('disabled', true);
        });

        container.on('focus', function (evt) {
          self.$search.trigger('focus');
        });

        container.on('results:focus', function (params) {
          self.$search.attr('aria-activedescendant', params.id);
        });

        this.$selection.on('focusin', '.select2-search--inline', function (evt) {
          self.trigger('focus', evt);
        });

        this.$selection.on('focusout', '.select2-search--inline', function (evt) {
          self._handleBlur(evt);
        });

        this.$selection.on('keydown', '.select2-search--inline', function (evt) {
          evt.stopPropagation();

          self.trigger('keypress', evt);

          self._keyUpPrevented = evt.isDefaultPrevented();

          var key = evt.which;

          if (key === KEYS.BACKSPACE && self.$search.val() === '') {
            var $previousChoice = self.$searchContainer.prev('.select2-selection__choice');

            if ($previousChoice.length > 0) {
              var item = $previousChoice.data('data');

              self.searchRemoveChoice(item);

              evt.preventDefault();
            }
          }
        });

        // Try to detect the IE version should the `documentMode` property that
        // is stored on the document. This is only implemented in IE and is
        // slightly cleaner than doing a user agent check.
        // This property is not available in Edge, but Edge also doesn't have
        // this bug.
        var msie = document.documentMode;
        var disableInputEvents = msie && msie <= 11;

        // Workaround for browsers which do not support the `input` event
        // This will prevent double-triggering of events for browsers which support
        // both the `keyup` and `input` events.
        this.$selection.on('input.searchcheck', '.select2-search--inline', function (evt) {
          // IE will trigger the `input` event when a placeholder is used on a
          // search box. To get around this issue, we are forced to ignore all
          // `input` events in IE and keep using `keyup`.
          if (disableInputEvents) {
            self.$selection.off('input.search input.searchcheck');
            return;
          }

          // Unbind the duplicated `keyup` event
          self.$selection.off('keyup.search');
        });

        this.$selection.on('keyup.search input.search', '.select2-search--inline', function (evt) {
          // IE will trigger the `input` event when a placeholder is used on a
          // search box. To get around this issue, we are forced to ignore all
          // `input` events in IE and keep using `keyup`.
          if (disableInputEvents && evt.type === 'input') {
            self.$selection.off('input.search input.searchcheck');
            return;
          }

          var key = evt.which;

          // We can freely ignore events from modifier keys
          if (key == KEYS.SHIFT || key == KEYS.CTRL || key == KEYS.ALT) {
            return;
          }

          // Tabbing will be handled during the `keydown` phase
          if (key == KEYS.TAB) {
            return;
          }

          self.handleSearch(evt);
        });
      };

      /**
       * This method will transfer the tabindex attribute from the rendered
       * selection to the search box. This allows for the search box to be used as
       * the primary focus instead of the selection container.
       *
       * @private
       */
      Search.prototype._transferTabIndex = function (decorated) {
        this.$search.attr('tabindex', this.$selection.attr('tabindex'));
        this.$selection.attr('tabindex', '-1');
      };

      Search.prototype.createPlaceholder = function (decorated, placeholder) {
        this.$search.attr('placeholder', placeholder.text);
      };

      Search.prototype.update = function (decorated, data) {
        var searchHadFocus = this.$search[0] == document.activeElement;

        this.$search.attr('placeholder', '');

        decorated.call(this, data);

        this.$selection.find('.select2-selection__rendered').append(this.$searchContainer);

        this.resizeSearch();
        if (searchHadFocus) {
          this.$search.focus();
        }
      };

      Search.prototype.handleSearch = function () {
        this.resizeSearch();

        if (!this._keyUpPrevented) {
          var input = this.$search.val();

          this.trigger('query', {
            term: input
          });
        }

        this._keyUpPrevented = false;
      };

      Search.prototype.searchRemoveChoice = function (decorated, item) {
        this.trigger('unselect', {
          data: item
        });

        this.$search.val(item.text);
        this.handleSearch();
      };

      Search.prototype.resizeSearch = function () {
        this.$search.css('width', '25px');

        var width = '';

        if (this.$search.attr('placeholder') !== '') {
          width = this.$selection.find('.select2-selection__rendered').innerWidth();
        } else {
          var minimumWidth = this.$search.val().length + 1;

          width = minimumWidth * 0.75 + 'em';
        }

        this.$search.css('width', width);
      };

      return Search;
    });

    S2.define('select2/selection/eventRelay', ['jquery'], function ($) {
      function EventRelay() {}

      EventRelay.prototype.bind = function (decorated, container, $container) {
        var self = this;
        var relayEvents = ['open', 'opening', 'close', 'closing', 'select', 'selecting', 'unselect', 'unselecting'];

        var preventableEvents = ['opening', 'closing', 'selecting', 'unselecting'];

        decorated.call(this, container, $container);

        container.on('*', function (name, params) {
          // Ignore events that should not be relayed
          if ($.inArray(name, relayEvents) === -1) {
            return;
          }

          // The parameters should always be an object
          params = params || {};

          // Generate the jQuery event for the Select2 event
          var evt = $.Event('select2:' + name, {
            params: params
          });

          self.$element.trigger(evt);

          // Only handle preventable events if it was one
          if ($.inArray(name, preventableEvents) === -1) {
            return;
          }

          params.prevented = evt.isDefaultPrevented();
        });
      };

      return EventRelay;
    });

    S2.define('select2/translation', ['jquery', 'require'], function ($, require) {
      function Translation(dict) {
        this.dict = dict || {};
      }

      Translation.prototype.all = function () {
        return this.dict;
      };

      Translation.prototype.get = function (key) {
        return this.dict[key];
      };

      Translation.prototype.extend = function (translation) {
        this.dict = $.extend({}, translation.all(), this.dict);
      };

      // Static functions

      Translation._cache = {};

      Translation.loadPath = function (path) {
        if (!(path in Translation._cache)) {
          var translations = require(path);

          Translation._cache[path] = translations;
        }

        return new Translation(Translation._cache[path]);
      };

      return Translation;
    });

    S2.define('select2/diacritics', [], function () {
      var diacritics = {
        "\u24B6": 'A',
        "\uFF21": 'A',
        "\xC0": 'A',
        "\xC1": 'A',
        "\xC2": 'A',
        "\u1EA6": 'A',
        "\u1EA4": 'A',
        "\u1EAA": 'A',
        "\u1EA8": 'A',
        "\xC3": 'A',
        "\u0100": 'A',
        "\u0102": 'A',
        "\u1EB0": 'A',
        "\u1EAE": 'A',
        "\u1EB4": 'A',
        "\u1EB2": 'A',
        "\u0226": 'A',
        "\u01E0": 'A',
        "\xC4": 'A',
        "\u01DE": 'A',
        "\u1EA2": 'A',
        "\xC5": 'A',
        "\u01FA": 'A',
        "\u01CD": 'A',
        "\u0200": 'A',
        "\u0202": 'A',
        "\u1EA0": 'A',
        "\u1EAC": 'A',
        "\u1EB6": 'A',
        "\u1E00": 'A',
        "\u0104": 'A',
        "\u023A": 'A',
        "\u2C6F": 'A',
        "\uA732": 'AA',
        "\xC6": 'AE',
        "\u01FC": 'AE',
        "\u01E2": 'AE',
        "\uA734": 'AO',
        "\uA736": 'AU',
        "\uA738": 'AV',
        "\uA73A": 'AV',
        "\uA73C": 'AY',
        "\u24B7": 'B',
        "\uFF22": 'B',
        "\u1E02": 'B',
        "\u1E04": 'B',
        "\u1E06": 'B',
        "\u0243": 'B',
        "\u0182": 'B',
        "\u0181": 'B',
        "\u24B8": 'C',
        "\uFF23": 'C',
        "\u0106": 'C',
        "\u0108": 'C',
        "\u010A": 'C',
        "\u010C": 'C',
        "\xC7": 'C',
        "\u1E08": 'C',
        "\u0187": 'C',
        "\u023B": 'C',
        "\uA73E": 'C',
        "\u24B9": 'D',
        "\uFF24": 'D',
        "\u1E0A": 'D',
        "\u010E": 'D',
        "\u1E0C": 'D',
        "\u1E10": 'D',
        "\u1E12": 'D',
        "\u1E0E": 'D',
        "\u0110": 'D',
        "\u018B": 'D',
        "\u018A": 'D',
        "\u0189": 'D',
        "\uA779": 'D',
        "\u01F1": 'DZ',
        "\u01C4": 'DZ',
        "\u01F2": 'Dz',
        "\u01C5": 'Dz',
        "\u24BA": 'E',
        "\uFF25": 'E',
        "\xC8": 'E',
        "\xC9": 'E',
        "\xCA": 'E',
        "\u1EC0": 'E',
        "\u1EBE": 'E',
        "\u1EC4": 'E',
        "\u1EC2": 'E',
        "\u1EBC": 'E',
        "\u0112": 'E',
        "\u1E14": 'E',
        "\u1E16": 'E',
        "\u0114": 'E',
        "\u0116": 'E',
        "\xCB": 'E',
        "\u1EBA": 'E',
        "\u011A": 'E',
        "\u0204": 'E',
        "\u0206": 'E',
        "\u1EB8": 'E',
        "\u1EC6": 'E',
        "\u0228": 'E',
        "\u1E1C": 'E',
        "\u0118": 'E',
        "\u1E18": 'E',
        "\u1E1A": 'E',
        "\u0190": 'E',
        "\u018E": 'E',
        "\u24BB": 'F',
        "\uFF26": 'F',
        "\u1E1E": 'F',
        "\u0191": 'F',
        "\uA77B": 'F',
        "\u24BC": 'G',
        "\uFF27": 'G',
        "\u01F4": 'G',
        "\u011C": 'G',
        "\u1E20": 'G',
        "\u011E": 'G',
        "\u0120": 'G',
        "\u01E6": 'G',
        "\u0122": 'G',
        "\u01E4": 'G',
        "\u0193": 'G',
        "\uA7A0": 'G',
        "\uA77D": 'G',
        "\uA77E": 'G',
        "\u24BD": 'H',
        "\uFF28": 'H',
        "\u0124": 'H',
        "\u1E22": 'H',
        "\u1E26": 'H',
        "\u021E": 'H',
        "\u1E24": 'H',
        "\u1E28": 'H',
        "\u1E2A": 'H',
        "\u0126": 'H',
        "\u2C67": 'H',
        "\u2C75": 'H',
        "\uA78D": 'H',
        "\u24BE": 'I',
        "\uFF29": 'I',
        "\xCC": 'I',
        "\xCD": 'I',
        "\xCE": 'I',
        "\u0128": 'I',
        "\u012A": 'I',
        "\u012C": 'I',
        "\u0130": 'I',
        "\xCF": 'I',
        "\u1E2E": 'I',
        "\u1EC8": 'I',
        "\u01CF": 'I',
        "\u0208": 'I',
        "\u020A": 'I',
        "\u1ECA": 'I',
        "\u012E": 'I',
        "\u1E2C": 'I',
        "\u0197": 'I',
        "\u24BF": 'J',
        "\uFF2A": 'J',
        "\u0134": 'J',
        "\u0248": 'J',
        "\u24C0": 'K',
        "\uFF2B": 'K',
        "\u1E30": 'K',
        "\u01E8": 'K',
        "\u1E32": 'K',
        "\u0136": 'K',
        "\u1E34": 'K',
        "\u0198": 'K',
        "\u2C69": 'K',
        "\uA740": 'K',
        "\uA742": 'K',
        "\uA744": 'K',
        "\uA7A2": 'K',
        "\u24C1": 'L',
        "\uFF2C": 'L',
        "\u013F": 'L',
        "\u0139": 'L',
        "\u013D": 'L',
        "\u1E36": 'L',
        "\u1E38": 'L',
        "\u013B": 'L',
        "\u1E3C": 'L',
        "\u1E3A": 'L',
        "\u0141": 'L',
        "\u023D": 'L',
        "\u2C62": 'L',
        "\u2C60": 'L',
        "\uA748": 'L',
        "\uA746": 'L',
        "\uA780": 'L',
        "\u01C7": 'LJ',
        "\u01C8": 'Lj',
        "\u24C2": 'M',
        "\uFF2D": 'M',
        "\u1E3E": 'M',
        "\u1E40": 'M',
        "\u1E42": 'M',
        "\u2C6E": 'M',
        "\u019C": 'M',
        "\u24C3": 'N',
        "\uFF2E": 'N',
        "\u01F8": 'N',
        "\u0143": 'N',
        "\xD1": 'N',
        "\u1E44": 'N',
        "\u0147": 'N',
        "\u1E46": 'N',
        "\u0145": 'N',
        "\u1E4A": 'N',
        "\u1E48": 'N',
        "\u0220": 'N',
        "\u019D": 'N',
        "\uA790": 'N',
        "\uA7A4": 'N',
        "\u01CA": 'NJ',
        "\u01CB": 'Nj',
        "\u24C4": 'O',
        "\uFF2F": 'O',
        "\xD2": 'O',
        "\xD3": 'O',
        "\xD4": 'O',
        "\u1ED2": 'O',
        "\u1ED0": 'O',
        "\u1ED6": 'O',
        "\u1ED4": 'O',
        "\xD5": 'O',
        "\u1E4C": 'O',
        "\u022C": 'O',
        "\u1E4E": 'O',
        "\u014C": 'O',
        "\u1E50": 'O',
        "\u1E52": 'O',
        "\u014E": 'O',
        "\u022E": 'O',
        "\u0230": 'O',
        "\xD6": 'O',
        "\u022A": 'O',
        "\u1ECE": 'O',
        "\u0150": 'O',
        "\u01D1": 'O',
        "\u020C": 'O',
        "\u020E": 'O',
        "\u01A0": 'O',
        "\u1EDC": 'O',
        "\u1EDA": 'O',
        "\u1EE0": 'O',
        "\u1EDE": 'O',
        "\u1EE2": 'O',
        "\u1ECC": 'O',
        "\u1ED8": 'O',
        "\u01EA": 'O',
        "\u01EC": 'O',
        "\xD8": 'O',
        "\u01FE": 'O',
        "\u0186": 'O',
        "\u019F": 'O',
        "\uA74A": 'O',
        "\uA74C": 'O',
        "\u01A2": 'OI',
        "\uA74E": 'OO',
        "\u0222": 'OU',
        "\u24C5": 'P',
        "\uFF30": 'P',
        "\u1E54": 'P',
        "\u1E56": 'P',
        "\u01A4": 'P',
        "\u2C63": 'P',
        "\uA750": 'P',
        "\uA752": 'P',
        "\uA754": 'P',
        "\u24C6": 'Q',
        "\uFF31": 'Q',
        "\uA756": 'Q',
        "\uA758": 'Q',
        "\u024A": 'Q',
        "\u24C7": 'R',
        "\uFF32": 'R',
        "\u0154": 'R',
        "\u1E58": 'R',
        "\u0158": 'R',
        "\u0210": 'R',
        "\u0212": 'R',
        "\u1E5A": 'R',
        "\u1E5C": 'R',
        "\u0156": 'R',
        "\u1E5E": 'R',
        "\u024C": 'R',
        "\u2C64": 'R',
        "\uA75A": 'R',
        "\uA7A6": 'R',
        "\uA782": 'R',
        "\u24C8": 'S',
        "\uFF33": 'S',
        "\u1E9E": 'S',
        "\u015A": 'S',
        "\u1E64": 'S',
        "\u015C": 'S',
        "\u1E60": 'S',
        "\u0160": 'S',
        "\u1E66": 'S',
        "\u1E62": 'S',
        "\u1E68": 'S',
        "\u0218": 'S',
        "\u015E": 'S',
        "\u2C7E": 'S',
        "\uA7A8": 'S',
        "\uA784": 'S',
        "\u24C9": 'T',
        "\uFF34": 'T',
        "\u1E6A": 'T',
        "\u0164": 'T',
        "\u1E6C": 'T',
        "\u021A": 'T',
        "\u0162": 'T',
        "\u1E70": 'T',
        "\u1E6E": 'T',
        "\u0166": 'T',
        "\u01AC": 'T',
        "\u01AE": 'T',
        "\u023E": 'T',
        "\uA786": 'T',
        "\uA728": 'TZ',
        "\u24CA": 'U',
        "\uFF35": 'U',
        "\xD9": 'U',
        "\xDA": 'U',
        "\xDB": 'U',
        "\u0168": 'U',
        "\u1E78": 'U',
        "\u016A": 'U',
        "\u1E7A": 'U',
        "\u016C": 'U',
        "\xDC": 'U',
        "\u01DB": 'U',
        "\u01D7": 'U',
        "\u01D5": 'U',
        "\u01D9": 'U',
        "\u1EE6": 'U',
        "\u016E": 'U',
        "\u0170": 'U',
        "\u01D3": 'U',
        "\u0214": 'U',
        "\u0216": 'U',
        "\u01AF": 'U',
        "\u1EEA": 'U',
        "\u1EE8": 'U',
        "\u1EEE": 'U',
        "\u1EEC": 'U',
        "\u1EF0": 'U',
        "\u1EE4": 'U',
        "\u1E72": 'U',
        "\u0172": 'U',
        "\u1E76": 'U',
        "\u1E74": 'U',
        "\u0244": 'U',
        "\u24CB": 'V',
        "\uFF36": 'V',
        "\u1E7C": 'V',
        "\u1E7E": 'V',
        "\u01B2": 'V',
        "\uA75E": 'V',
        "\u0245": 'V',
        "\uA760": 'VY',
        "\u24CC": 'W',
        "\uFF37": 'W',
        "\u1E80": 'W',
        "\u1E82": 'W',
        "\u0174": 'W',
        "\u1E86": 'W',
        "\u1E84": 'W',
        "\u1E88": 'W',
        "\u2C72": 'W',
        "\u24CD": 'X',
        "\uFF38": 'X',
        "\u1E8A": 'X',
        "\u1E8C": 'X',
        "\u24CE": 'Y',
        "\uFF39": 'Y',
        "\u1EF2": 'Y',
        "\xDD": 'Y',
        "\u0176": 'Y',
        "\u1EF8": 'Y',
        "\u0232": 'Y',
        "\u1E8E": 'Y',
        "\u0178": 'Y',
        "\u1EF6": 'Y',
        "\u1EF4": 'Y',
        "\u01B3": 'Y',
        "\u024E": 'Y',
        "\u1EFE": 'Y',
        "\u24CF": 'Z',
        "\uFF3A": 'Z',
        "\u0179": 'Z',
        "\u1E90": 'Z',
        "\u017B": 'Z',
        "\u017D": 'Z',
        "\u1E92": 'Z',
        "\u1E94": 'Z',
        "\u01B5": 'Z',
        "\u0224": 'Z',
        "\u2C7F": 'Z',
        "\u2C6B": 'Z',
        "\uA762": 'Z',
        "\u24D0": 'a',
        "\uFF41": 'a',
        "\u1E9A": 'a',
        "\xE0": 'a',
        "\xE1": 'a',
        "\xE2": 'a',
        "\u1EA7": 'a',
        "\u1EA5": 'a',
        "\u1EAB": 'a',
        "\u1EA9": 'a',
        "\xE3": 'a',
        "\u0101": 'a',
        "\u0103": 'a',
        "\u1EB1": 'a',
        "\u1EAF": 'a',
        "\u1EB5": 'a',
        "\u1EB3": 'a',
        "\u0227": 'a',
        "\u01E1": 'a',
        "\xE4": 'a',
        "\u01DF": 'a',
        "\u1EA3": 'a',
        "\xE5": 'a',
        "\u01FB": 'a',
        "\u01CE": 'a',
        "\u0201": 'a',
        "\u0203": 'a',
        "\u1EA1": 'a',
        "\u1EAD": 'a',
        "\u1EB7": 'a',
        "\u1E01": 'a',
        "\u0105": 'a',
        "\u2C65": 'a',
        "\u0250": 'a',
        "\uA733": 'aa',
        "\xE6": 'ae',
        "\u01FD": 'ae',
        "\u01E3": 'ae',
        "\uA735": 'ao',
        "\uA737": 'au',
        "\uA739": 'av',
        "\uA73B": 'av',
        "\uA73D": 'ay',
        "\u24D1": 'b',
        "\uFF42": 'b',
        "\u1E03": 'b',
        "\u1E05": 'b',
        "\u1E07": 'b',
        "\u0180": 'b',
        "\u0183": 'b',
        "\u0253": 'b',
        "\u24D2": 'c',
        "\uFF43": 'c',
        "\u0107": 'c',
        "\u0109": 'c',
        "\u010B": 'c',
        "\u010D": 'c',
        "\xE7": 'c',
        "\u1E09": 'c',
        "\u0188": 'c',
        "\u023C": 'c',
        "\uA73F": 'c',
        "\u2184": 'c',
        "\u24D3": 'd',
        "\uFF44": 'd',
        "\u1E0B": 'd',
        "\u010F": 'd',
        "\u1E0D": 'd',
        "\u1E11": 'd',
        "\u1E13": 'd',
        "\u1E0F": 'd',
        "\u0111": 'd',
        "\u018C": 'd',
        "\u0256": 'd',
        "\u0257": 'd',
        "\uA77A": 'd',
        "\u01F3": 'dz',
        "\u01C6": 'dz',
        "\u24D4": 'e',
        "\uFF45": 'e',
        "\xE8": 'e',
        "\xE9": 'e',
        "\xEA": 'e',
        "\u1EC1": 'e',
        "\u1EBF": 'e',
        "\u1EC5": 'e',
        "\u1EC3": 'e',
        "\u1EBD": 'e',
        "\u0113": 'e',
        "\u1E15": 'e',
        "\u1E17": 'e',
        "\u0115": 'e',
        "\u0117": 'e',
        "\xEB": 'e',
        "\u1EBB": 'e',
        "\u011B": 'e',
        "\u0205": 'e',
        "\u0207": 'e',
        "\u1EB9": 'e',
        "\u1EC7": 'e',
        "\u0229": 'e',
        "\u1E1D": 'e',
        "\u0119": 'e',
        "\u1E19": 'e',
        "\u1E1B": 'e',
        "\u0247": 'e',
        "\u025B": 'e',
        "\u01DD": 'e',
        "\u24D5": 'f',
        "\uFF46": 'f',
        "\u1E1F": 'f',
        "\u0192": 'f',
        "\uA77C": 'f',
        "\u24D6": 'g',
        "\uFF47": 'g',
        "\u01F5": 'g',
        "\u011D": 'g',
        "\u1E21": 'g',
        "\u011F": 'g',
        "\u0121": 'g',
        "\u01E7": 'g',
        "\u0123": 'g',
        "\u01E5": 'g',
        "\u0260": 'g',
        "\uA7A1": 'g',
        "\u1D79": 'g',
        "\uA77F": 'g',
        "\u24D7": 'h',
        "\uFF48": 'h',
        "\u0125": 'h',
        "\u1E23": 'h',
        "\u1E27": 'h',
        "\u021F": 'h',
        "\u1E25": 'h',
        "\u1E29": 'h',
        "\u1E2B": 'h',
        "\u1E96": 'h',
        "\u0127": 'h',
        "\u2C68": 'h',
        "\u2C76": 'h',
        "\u0265": 'h',
        "\u0195": 'hv',
        "\u24D8": 'i',
        "\uFF49": 'i',
        "\xEC": 'i',
        "\xED": 'i',
        "\xEE": 'i',
        "\u0129": 'i',
        "\u012B": 'i',
        "\u012D": 'i',
        "\xEF": 'i',
        "\u1E2F": 'i',
        "\u1EC9": 'i',
        "\u01D0": 'i',
        "\u0209": 'i',
        "\u020B": 'i',
        "\u1ECB": 'i',
        "\u012F": 'i',
        "\u1E2D": 'i',
        "\u0268": 'i',
        "\u0131": 'i',
        "\u24D9": 'j',
        "\uFF4A": 'j',
        "\u0135": 'j',
        "\u01F0": 'j',
        "\u0249": 'j',
        "\u24DA": 'k',
        "\uFF4B": 'k',
        "\u1E31": 'k',
        "\u01E9": 'k',
        "\u1E33": 'k',
        "\u0137": 'k',
        "\u1E35": 'k',
        "\u0199": 'k',
        "\u2C6A": 'k',
        "\uA741": 'k',
        "\uA743": 'k',
        "\uA745": 'k',
        "\uA7A3": 'k',
        "\u24DB": 'l',
        "\uFF4C": 'l',
        "\u0140": 'l',
        "\u013A": 'l',
        "\u013E": 'l',
        "\u1E37": 'l',
        "\u1E39": 'l',
        "\u013C": 'l',
        "\u1E3D": 'l',
        "\u1E3B": 'l',
        "\u017F": 'l',
        "\u0142": 'l',
        "\u019A": 'l',
        "\u026B": 'l',
        "\u2C61": 'l',
        "\uA749": 'l',
        "\uA781": 'l',
        "\uA747": 'l',
        "\u01C9": 'lj',
        "\u24DC": 'm',
        "\uFF4D": 'm',
        "\u1E3F": 'm',
        "\u1E41": 'm',
        "\u1E43": 'm',
        "\u0271": 'm',
        "\u026F": 'm',
        "\u24DD": 'n',
        "\uFF4E": 'n',
        "\u01F9": 'n',
        "\u0144": 'n',
        "\xF1": 'n',
        "\u1E45": 'n',
        "\u0148": 'n',
        "\u1E47": 'n',
        "\u0146": 'n',
        "\u1E4B": 'n',
        "\u1E49": 'n',
        "\u019E": 'n',
        "\u0272": 'n',
        "\u0149": 'n',
        "\uA791": 'n',
        "\uA7A5": 'n',
        "\u01CC": 'nj',
        "\u24DE": 'o',
        "\uFF4F": 'o',
        "\xF2": 'o',
        "\xF3": 'o',
        "\xF4": 'o',
        "\u1ED3": 'o',
        "\u1ED1": 'o',
        "\u1ED7": 'o',
        "\u1ED5": 'o',
        "\xF5": 'o',
        "\u1E4D": 'o',
        "\u022D": 'o',
        "\u1E4F": 'o',
        "\u014D": 'o',
        "\u1E51": 'o',
        "\u1E53": 'o',
        "\u014F": 'o',
        "\u022F": 'o',
        "\u0231": 'o',
        "\xF6": 'o',
        "\u022B": 'o',
        "\u1ECF": 'o',
        "\u0151": 'o',
        "\u01D2": 'o',
        "\u020D": 'o',
        "\u020F": 'o',
        "\u01A1": 'o',
        "\u1EDD": 'o',
        "\u1EDB": 'o',
        "\u1EE1": 'o',
        "\u1EDF": 'o',
        "\u1EE3": 'o',
        "\u1ECD": 'o',
        "\u1ED9": 'o',
        "\u01EB": 'o',
        "\u01ED": 'o',
        "\xF8": 'o',
        "\u01FF": 'o',
        "\u0254": 'o',
        "\uA74B": 'o',
        "\uA74D": 'o',
        "\u0275": 'o',
        "\u01A3": 'oi',
        "\u0223": 'ou',
        "\uA74F": 'oo',
        "\u24DF": 'p',
        "\uFF50": 'p',
        "\u1E55": 'p',
        "\u1E57": 'p',
        "\u01A5": 'p',
        "\u1D7D": 'p',
        "\uA751": 'p',
        "\uA753": 'p',
        "\uA755": 'p',
        "\u24E0": 'q',
        "\uFF51": 'q',
        "\u024B": 'q',
        "\uA757": 'q',
        "\uA759": 'q',
        "\u24E1": 'r',
        "\uFF52": 'r',
        "\u0155": 'r',
        "\u1E59": 'r',
        "\u0159": 'r',
        "\u0211": 'r',
        "\u0213": 'r',
        "\u1E5B": 'r',
        "\u1E5D": 'r',
        "\u0157": 'r',
        "\u1E5F": 'r',
        "\u024D": 'r',
        "\u027D": 'r',
        "\uA75B": 'r',
        "\uA7A7": 'r',
        "\uA783": 'r',
        "\u24E2": 's',
        "\uFF53": 's',
        "\xDF": 's',
        "\u015B": 's',
        "\u1E65": 's',
        "\u015D": 's',
        "\u1E61": 's',
        "\u0161": 's',
        "\u1E67": 's',
        "\u1E63": 's',
        "\u1E69": 's',
        "\u0219": 's',
        "\u015F": 's',
        "\u023F": 's',
        "\uA7A9": 's',
        "\uA785": 's',
        "\u1E9B": 's',
        "\u24E3": 't',
        "\uFF54": 't',
        "\u1E6B": 't',
        "\u1E97": 't',
        "\u0165": 't',
        "\u1E6D": 't',
        "\u021B": 't',
        "\u0163": 't',
        "\u1E71": 't',
        "\u1E6F": 't',
        "\u0167": 't',
        "\u01AD": 't',
        "\u0288": 't',
        "\u2C66": 't',
        "\uA787": 't',
        "\uA729": 'tz',
        "\u24E4": 'u',
        "\uFF55": 'u',
        "\xF9": 'u',
        "\xFA": 'u',
        "\xFB": 'u',
        "\u0169": 'u',
        "\u1E79": 'u',
        "\u016B": 'u',
        "\u1E7B": 'u',
        "\u016D": 'u',
        "\xFC": 'u',
        "\u01DC": 'u',
        "\u01D8": 'u',
        "\u01D6": 'u',
        "\u01DA": 'u',
        "\u1EE7": 'u',
        "\u016F": 'u',
        "\u0171": 'u',
        "\u01D4": 'u',
        "\u0215": 'u',
        "\u0217": 'u',
        "\u01B0": 'u',
        "\u1EEB": 'u',
        "\u1EE9": 'u',
        "\u1EEF": 'u',
        "\u1EED": 'u',
        "\u1EF1": 'u',
        "\u1EE5": 'u',
        "\u1E73": 'u',
        "\u0173": 'u',
        "\u1E77": 'u',
        "\u1E75": 'u',
        "\u0289": 'u',
        "\u24E5": 'v',
        "\uFF56": 'v',
        "\u1E7D": 'v',
        "\u1E7F": 'v',
        "\u028B": 'v',
        "\uA75F": 'v',
        "\u028C": 'v',
        "\uA761": 'vy',
        "\u24E6": 'w',
        "\uFF57": 'w',
        "\u1E81": 'w',
        "\u1E83": 'w',
        "\u0175": 'w',
        "\u1E87": 'w',
        "\u1E85": 'w',
        "\u1E98": 'w',
        "\u1E89": 'w',
        "\u2C73": 'w',
        "\u24E7": 'x',
        "\uFF58": 'x',
        "\u1E8B": 'x',
        "\u1E8D": 'x',
        "\u24E8": 'y',
        "\uFF59": 'y',
        "\u1EF3": 'y',
        "\xFD": 'y',
        "\u0177": 'y',
        "\u1EF9": 'y',
        "\u0233": 'y',
        "\u1E8F": 'y',
        "\xFF": 'y',
        "\u1EF7": 'y',
        "\u1E99": 'y',
        "\u1EF5": 'y',
        "\u01B4": 'y',
        "\u024F": 'y',
        "\u1EFF": 'y',
        "\u24E9": 'z',
        "\uFF5A": 'z',
        "\u017A": 'z',
        "\u1E91": 'z',
        "\u017C": 'z',
        "\u017E": 'z',
        "\u1E93": 'z',
        "\u1E95": 'z',
        "\u01B6": 'z',
        "\u0225": 'z',
        "\u0240": 'z',
        "\u2C6C": 'z',
        "\uA763": 'z',
        "\u0386": "\u0391",
        "\u0388": "\u0395",
        "\u0389": "\u0397",
        "\u038A": "\u0399",
        "\u03AA": "\u0399",
        "\u038C": "\u039F",
        "\u038E": "\u03A5",
        "\u03AB": "\u03A5",
        "\u038F": "\u03A9",
        "\u03AC": "\u03B1",
        "\u03AD": "\u03B5",
        "\u03AE": "\u03B7",
        "\u03AF": "\u03B9",
        "\u03CA": "\u03B9",
        "\u0390": "\u03B9",
        "\u03CC": "\u03BF",
        "\u03CD": "\u03C5",
        "\u03CB": "\u03C5",
        "\u03B0": "\u03C5",
        "\u03C9": "\u03C9",
        "\u03C2": "\u03C3"
      };

      return diacritics;
    });

    S2.define('select2/data/base', ['../utils'], function (Utils) {
      function BaseAdapter($element, options) {
        BaseAdapter.__super__.constructor.call(this);
      }

      Utils.Extend(BaseAdapter, Utils.Observable);

      BaseAdapter.prototype.current = function (callback) {
        throw new Error('The `current` method must be defined in child classes.');
      };

      BaseAdapter.prototype.query = function (params, callback) {
        throw new Error('The `query` method must be defined in child classes.');
      };

      BaseAdapter.prototype.bind = function (container, $container) {
        // Can be implemented in subclasses
      };

      BaseAdapter.prototype.destroy = function () {
        // Can be implemented in subclasses
      };

      BaseAdapter.prototype.generateResultId = function (container, data) {
        var id = container.id + '-result-';

        id += Utils.generateChars(4);

        if (data.id != null) {
          id += '-' + data.id.toString();
        } else {
          id += '-' + Utils.generateChars(4);
        }
        return id;
      };

      return BaseAdapter;
    });

    S2.define('select2/data/select', ['./base', '../utils', 'jquery'], function (BaseAdapter, Utils, $) {
      function SelectAdapter($element, options) {
        this.$element = $element;
        this.options = options;

        SelectAdapter.__super__.constructor.call(this);
      }

      Utils.Extend(SelectAdapter, BaseAdapter);

      SelectAdapter.prototype.current = function (callback) {
        var data = [];
        var self = this;

        this.$element.find(':selected').each(function () {
          var $option = $(this);

          var option = self.item($option);

          data.push(option);
        });

        callback(data);
      };

      SelectAdapter.prototype.select = function (data) {
        var self = this;

        data.selected = true;

        // If data.element is a DOM node, use it instead
        if ($(data.element).is('option')) {
          data.element.selected = true;

          this.$element.trigger('change');

          return;
        }

        if (this.$element.prop('multiple')) {
          this.current(function (currentData) {
            var val = [];

            data = [data];
            data.push.apply(data, currentData);

            for (var d = 0; d < data.length; d++) {
              var id = data[d].id;

              if ($.inArray(id, val) === -1) {
                val.push(id);
              }
            }

            self.$element.val(val);
            self.$element.trigger('change');
          });
        } else {
          var val = data.id;

          this.$element.val(val);
          this.$element.trigger('change');
        }
      };

      SelectAdapter.prototype.unselect = function (data) {
        var self = this;

        if (!this.$element.prop('multiple')) {
          return;
        }

        data.selected = false;

        if ($(data.element).is('option')) {
          data.element.selected = false;

          this.$element.trigger('change');

          return;
        }

        this.current(function (currentData) {
          var val = [];

          for (var d = 0; d < currentData.length; d++) {
            var id = currentData[d].id;

            if (id !== data.id && $.inArray(id, val) === -1) {
              val.push(id);
            }
          }

          self.$element.val(val);

          self.$element.trigger('change');
        });
      };

      SelectAdapter.prototype.bind = function (container, $container) {
        var self = this;

        this.container = container;

        container.on('select', function (params) {
          self.select(params.data);
        });

        container.on('unselect', function (params) {
          self.unselect(params.data);
        });
      };

      SelectAdapter.prototype.destroy = function () {
        // Remove anything added to child elements
        this.$element.find('*').each(function () {
          // Remove any custom data set by Select2
          $.removeData(this, 'data');
        });
      };

      SelectAdapter.prototype.query = function (params, callback) {
        var data = [];
        var self = this;

        var $options = this.$element.children();

        $options.each(function () {
          var $option = $(this);

          if (!$option.is('option') && !$option.is('optgroup')) {
            return;
          }

          var option = self.item($option);

          var matches = self.matches(params, option);

          if (matches !== null) {
            data.push(matches);
          }
        });

        callback({
          results: data
        });
      };

      SelectAdapter.prototype.addOptions = function ($options) {
        Utils.appendMany(this.$element, $options);
      };

      SelectAdapter.prototype.option = function (data) {
        var option;

        if (data.children) {
          option = document.createElement('optgroup');
          option.label = data.text;
        } else {
          option = document.createElement('option');

          if (option.textContent !== undefined) {
            option.textContent = data.text;
          } else {
            option.innerText = data.text;
          }
        }

        if (data.id) {
          option.value = data.id;
        }

        if (data.disabled) {
          option.disabled = true;
        }

        if (data.selected) {
          option.selected = true;
        }

        if (data.title) {
          option.title = data.title;
        }

        var $option = $(option);

        var normalizedData = this._normalizeItem(data);
        normalizedData.element = option;

        // Override the option's data with the combined data
        $.data(option, 'data', normalizedData);

        return $option;
      };

      SelectAdapter.prototype.item = function ($option) {
        var data = {};

        data = $.data($option[0], 'data');

        if (data != null) {
          return data;
        }

        if ($option.is('option')) {
          data = {
            id: $option.val(),
            text: $option.text(),
            disabled: $option.prop('disabled'),
            selected: $option.prop('selected'),
            title: $option.prop('title')
          };
        } else if ($option.is('optgroup')) {
          data = {
            text: $option.prop('label'),
            children: [],
            title: $option.prop('title')
          };

          var $children = $option.children('option');
          var children = [];

          for (var c = 0; c < $children.length; c++) {
            var $child = $($children[c]);

            var child = this.item($child);

            children.push(child);
          }

          data.children = children;
        }

        data = this._normalizeItem(data);
        data.element = $option[0];

        $.data($option[0], 'data', data);

        return data;
      };

      SelectAdapter.prototype._normalizeItem = function (item) {
        if (!$.isPlainObject(item)) {
          item = {
            id: item,
            text: item
          };
        }

        item = $.extend({}, {
          text: ''
        }, item);

        var defaults = {
          selected: false,
          disabled: false
        };

        if (item.id != null) {
          item.id = item.id.toString();
        }

        if (item.text != null) {
          item.text = item.text.toString();
        }

        if (item._resultId == null && item.id && this.container != null) {
          item._resultId = this.generateResultId(this.container, item);
        }

        return $.extend({}, defaults, item);
      };

      SelectAdapter.prototype.matches = function (params, data) {
        var matcher = this.options.get('matcher');

        return matcher(params, data);
      };

      return SelectAdapter;
    });

    S2.define('select2/data/array', ['./select', '../utils', 'jquery'], function (SelectAdapter, Utils, $) {
      function ArrayAdapter($element, options) {
        var data = options.get('data') || [];

        ArrayAdapter.__super__.constructor.call(this, $element, options);

        this.addOptions(this.convertToOptions(data));
      }

      Utils.Extend(ArrayAdapter, SelectAdapter);

      ArrayAdapter.prototype.select = function (data) {
        var $option = this.$element.find('option').filter(function (i, elm) {
          return elm.value == data.id.toString();
        });

        if ($option.length === 0) {
          $option = this.option(data);

          this.addOptions($option);
        }

        ArrayAdapter.__super__.select.call(this, data);
      };

      ArrayAdapter.prototype.convertToOptions = function (data) {
        var self = this;

        var $existing = this.$element.find('option');
        var existingIds = $existing.map(function () {
          return self.item($(this)).id;
        }).get();

        var $options = [];

        // Filter out all items except for the one passed in the argument
        function onlyItem(item) {
          return function () {
            return $(this).val() == item.id;
          };
        }

        for (var d = 0; d < data.length; d++) {
          var item = this._normalizeItem(data[d]);

          // Skip items which were pre-loaded, only merge the data
          if ($.inArray(item.id, existingIds) >= 0) {
            var $existingOption = $existing.filter(onlyItem(item));

            var existingData = this.item($existingOption);
            var newData = $.extend(true, {}, item, existingData);

            var $newOption = this.option(newData);

            $existingOption.replaceWith($newOption);

            continue;
          }

          var $option = this.option(item);

          if (item.children) {
            var $children = this.convertToOptions(item.children);

            Utils.appendMany($option, $children);
          }

          $options.push($option);
        }

        return $options;
      };

      return ArrayAdapter;
    });

    S2.define('select2/data/ajax', ['./array', '../utils', 'jquery'], function (ArrayAdapter, Utils, $) {
      function AjaxAdapter($element, options) {
        this.ajaxOptions = this._applyDefaults(options.get('ajax'));

        if (this.ajaxOptions.processResults != null) {
          this.processResults = this.ajaxOptions.processResults;
        }

        AjaxAdapter.__super__.constructor.call(this, $element, options);
      }

      Utils.Extend(AjaxAdapter, ArrayAdapter);

      AjaxAdapter.prototype._applyDefaults = function (options) {
        var defaults = {
          data: function data(params) {
            return $.extend({}, params, {
              q: params.term
            });
          },
          transport: function transport(params, success, failure) {
            var $request = $.ajax(params);

            $request.then(success);
            $request.fail(failure);

            return $request;
          }
        };

        return $.extend({}, defaults, options, true);
      };

      AjaxAdapter.prototype.processResults = function (results) {
        return results;
      };

      AjaxAdapter.prototype.query = function (params, callback) {
        var matches = [];
        var self = this;

        if (this._request != null) {
          // JSONP requests cannot always be aborted
          if ($.isFunction(this._request.abort)) {
            this._request.abort();
          }

          this._request = null;
        }

        var options = $.extend({
          type: 'GET'
        }, this.ajaxOptions);

        if (typeof options.url === 'function') {
          options.url = options.url.call(this.$element, params);
        }

        if (typeof options.data === 'function') {
          options.data = options.data.call(this.$element, params);
        }

        function request() {
          var $request = options.transport(options, function (data) {
            var results = self.processResults(data, params);

            if (self.options.get('debug') && window.console && console.error) {
              // Check to make sure that the response included a `results` key.
              if (!results || !results.results || !$.isArray(results.results)) {
                console.error('Select2: The AJAX results did not return an array in the ' + '`results` key of the response.');
              }
            }

            callback(results);
          }, function () {
            // Attempt to detect if a request was aborted
            // Only works if the transport exposes a status property
            if ($request.status && $request.status === '0') {
              return;
            }

            self.trigger('results:message', {
              message: 'errorLoading'
            });
          });

          self._request = $request;
        }

        if (this.ajaxOptions.delay && params.term != null) {
          if (this._queryTimeout) {
            window.clearTimeout(this._queryTimeout);
          }

          this._queryTimeout = window.setTimeout(request, this.ajaxOptions.delay);
        } else {
          request();
        }
      };

      return AjaxAdapter;
    });

    S2.define('select2/data/tags', ['jquery'], function ($) {
      function Tags(decorated, $element, options) {
        var tags = options.get('tags');

        var createTag = options.get('createTag');

        if (createTag !== undefined) {
          this.createTag = createTag;
        }

        var insertTag = options.get('insertTag');

        if (insertTag !== undefined) {
          this.insertTag = insertTag;
        }

        decorated.call(this, $element, options);

        if ($.isArray(tags)) {
          for (var t = 0; t < tags.length; t++) {
            var tag = tags[t];
            var item = this._normalizeItem(tag);

            var $option = this.option(item);

            this.$element.append($option);
          }
        }
      }

      Tags.prototype.query = function (decorated, params, callback) {
        var self = this;

        this._removeOldTags();

        if (params.term == null || params.page != null) {
          decorated.call(this, params, callback);
          return;
        }

        function wrapper(obj, child) {
          var data = obj.results;

          for (var i = 0; i < data.length; i++) {
            var option = data[i];

            var checkChildren = option.children != null && !wrapper({
              results: option.children
            }, true);

            var checkText = option.text === params.term;

            if (checkText || checkChildren) {
              if (child) {
                return false;
              }

              obj.data = data;
              callback(obj);

              return;
            }
          }

          if (child) {
            return true;
          }

          var tag = self.createTag(params);

          if (tag != null) {
            var $option = self.option(tag);
            $option.attr('data-select2-tag', true);

            self.addOptions([$option]);

            self.insertTag(data, tag);
          }

          obj.results = data;

          callback(obj);
        }

        decorated.call(this, params, wrapper);
      };

      Tags.prototype.createTag = function (decorated, params) {
        var term = $.trim(params.term);

        if (term === '') {
          return null;
        }

        return {
          id: term,
          text: term
        };
      };

      Tags.prototype.insertTag = function (_, data, tag) {
        data.unshift(tag);
      };

      Tags.prototype._removeOldTags = function (_) {
        var tag = this._lastTag;

        var $options = this.$element.find('option[data-select2-tag]');

        $options.each(function () {
          if (this.selected) {
            return;
          }

          $(this).remove();
        });
      };

      return Tags;
    });

    S2.define('select2/data/tokenizer', ['jquery'], function ($) {
      function Tokenizer(decorated, $element, options) {
        var tokenizer = options.get('tokenizer');

        if (tokenizer !== undefined) {
          this.tokenizer = tokenizer;
        }

        decorated.call(this, $element, options);
      }

      Tokenizer.prototype.bind = function (decorated, container, $container) {
        decorated.call(this, container, $container);

        this.$search = container.dropdown.$search || container.selection.$search || $container.find('.select2-search__field');
      };

      Tokenizer.prototype.query = function (decorated, params, callback) {
        var self = this;

        function createAndSelect(data) {
          // Normalize the data object so we can use it for checks
          var item = self._normalizeItem(data);

          // Check if the data object already exists as a tag
          // Select it if it doesn't
          var $existingOptions = self.$element.find('option').filter(function () {
            return $(this).val() === item.id;
          });

          // If an existing option wasn't found for it, create the option
          if (!$existingOptions.length) {
            var $option = self.option(item);
            $option.attr('data-select2-tag', true);

            self._removeOldTags();
            self.addOptions([$option]);
          }

          // Select the item, now that we know there is an option for it
          select(item);
        }

        function select(data) {
          self.trigger('select', {
            data: data
          });
        }

        params.term = params.term || '';

        var tokenData = this.tokenizer(params, this.options, createAndSelect);

        if (tokenData.term !== params.term) {
          // Replace the search term if we have the search box
          if (this.$search.length) {
            this.$search.val(tokenData.term);
            this.$search.focus();
          }

          params.term = tokenData.term;
        }

        decorated.call(this, params, callback);
      };

      Tokenizer.prototype.tokenizer = function (_, params, options, callback) {
        var separators = options.get('tokenSeparators') || [];
        var term = params.term;
        var i = 0;

        var createTag = this.createTag || function (params) {
          return {
            id: params.term,
            text: params.term
          };
        };

        while (i < term.length) {
          var termChar = term[i];

          if ($.inArray(termChar, separators) === -1) {
            i++;

            continue;
          }

          var part = term.substr(0, i);
          var partParams = $.extend({}, params, {
            term: part
          });

          var data = createTag(partParams);

          if (data == null) {
            i++;
            continue;
          }

          callback(data);

          // Reset the term to not include the tokenized portion
          term = term.substr(i + 1) || '';
          i = 0;
        }

        return {
          term: term
        };
      };

      return Tokenizer;
    });

    S2.define('select2/data/minimumInputLength', [], function () {
      function MinimumInputLength(decorated, $e, options) {
        this.minimumInputLength = options.get('minimumInputLength');

        decorated.call(this, $e, options);
      }

      MinimumInputLength.prototype.query = function (decorated, params, callback) {
        params.term = params.term || '';

        if (params.term.length < this.minimumInputLength) {
          this.trigger('results:message', {
            message: 'inputTooShort',
            args: {
              minimum: this.minimumInputLength,
              input: params.term,
              params: params
            }
          });

          return;
        }

        decorated.call(this, params, callback);
      };

      return MinimumInputLength;
    });

    S2.define('select2/data/maximumInputLength', [], function () {
      function MaximumInputLength(decorated, $e, options) {
        this.maximumInputLength = options.get('maximumInputLength');

        decorated.call(this, $e, options);
      }

      MaximumInputLength.prototype.query = function (decorated, params, callback) {
        params.term = params.term || '';

        if (this.maximumInputLength > 0 && params.term.length > this.maximumInputLength) {
          this.trigger('results:message', {
            message: 'inputTooLong',
            args: {
              maximum: this.maximumInputLength,
              input: params.term,
              params: params
            }
          });

          return;
        }

        decorated.call(this, params, callback);
      };

      return MaximumInputLength;
    });

    S2.define('select2/data/maximumSelectionLength', [], function () {
      function MaximumSelectionLength(decorated, $e, options) {
        this.maximumSelectionLength = options.get('maximumSelectionLength');

        decorated.call(this, $e, options);
      }

      MaximumSelectionLength.prototype.query = function (decorated, params, callback) {
        var self = this;

        this.current(function (currentData) {
          var count = currentData != null ? currentData.length : 0;
          if (self.maximumSelectionLength > 0 && count >= self.maximumSelectionLength) {
            self.trigger('results:message', {
              message: 'maximumSelected',
              args: {
                maximum: self.maximumSelectionLength
              }
            });
            return;
          }
          decorated.call(self, params, callback);
        });
      };

      return MaximumSelectionLength;
    });

    S2.define('select2/dropdown', ['jquery', './utils'], function ($, Utils) {
      function Dropdown($element, options) {
        this.$element = $element;
        this.options = options;

        Dropdown.__super__.constructor.call(this);
      }

      Utils.Extend(Dropdown, Utils.Observable);

      Dropdown.prototype.render = function () {
        var $dropdown = $('<span class="select2-dropdown">' + '<span class="select2-results"></span>' + '</span>');

        $dropdown.attr('dir', this.options.get('dir'));

        this.$dropdown = $dropdown;

        return $dropdown;
      };

      Dropdown.prototype.bind = function () {
        // Should be implemented in subclasses
      };

      Dropdown.prototype.position = function ($dropdown, $container) {
        // Should be implmented in subclasses
      };

      Dropdown.prototype.destroy = function () {
        // Remove the dropdown from the DOM
        this.$dropdown.remove();
      };

      return Dropdown;
    });

    S2.define('select2/dropdown/search', ['jquery', '../utils'], function ($, Utils) {
      function Search() {}

      Search.prototype.render = function (decorated) {
        var $rendered = decorated.call(this);

        var $search = $('<span class="select2-search select2-search--dropdown">' + '<input class="select2-search__field" type="search" tabindex="-1"' + ' autocomplete="off" autocorrect="off" autocapitalize="off"' + ' spellcheck="false" role="textbox" />' + '</span>');

        this.$searchContainer = $search;
        this.$search = $search.find('input');

        $rendered.prepend($search);

        return $rendered;
      };

      Search.prototype.bind = function (decorated, container, $container) {
        var self = this;

        decorated.call(this, container, $container);

        this.$search.on('keydown', function (evt) {
          self.trigger('keypress', evt);

          self._keyUpPrevented = evt.isDefaultPrevented();
        });

        // Workaround for browsers which do not support the `input` event
        // This will prevent double-triggering of events for browsers which support
        // both the `keyup` and `input` events.
        this.$search.on('input', function (evt) {
          // Unbind the duplicated `keyup` event
          $(this).off('keyup');
        });

        this.$search.on('keyup input', function (evt) {
          self.handleSearch(evt);
        });

        container.on('open', function () {
          self.$search.attr('tabindex', 0);

          self.$search.focus();

          window.setTimeout(function () {
            self.$search.focus();
          }, 0);
        });

        container.on('close', function () {
          self.$search.attr('tabindex', -1);

          self.$search.val('');
        });

        container.on('focus', function () {
          if (container.isOpen()) {
            self.$search.focus();
          }
        });

        container.on('results:all', function (params) {
          if (params.query.term == null || params.query.term === '') {
            var showSearch = self.showSearch(params);

            if (showSearch) {
              self.$searchContainer.removeClass('select2-search--hide');
            } else {
              self.$searchContainer.addClass('select2-search--hide');
            }
          }
        });
      };

      Search.prototype.handleSearch = function (evt) {
        if (!this._keyUpPrevented) {
          var input = this.$search.val();

          this.trigger('query', {
            term: input
          });
        }

        this._keyUpPrevented = false;
      };

      Search.prototype.showSearch = function (_, params) {
        return true;
      };

      return Search;
    });

    S2.define('select2/dropdown/hidePlaceholder', [], function () {
      function HidePlaceholder(decorated, $element, options, dataAdapter) {
        this.placeholder = this.normalizePlaceholder(options.get('placeholder'));

        decorated.call(this, $element, options, dataAdapter);
      }

      HidePlaceholder.prototype.append = function (decorated, data) {
        data.results = this.removePlaceholder(data.results);

        decorated.call(this, data);
      };

      HidePlaceholder.prototype.normalizePlaceholder = function (_, placeholder) {
        if (typeof placeholder === 'string') {
          placeholder = {
            id: '',
            text: placeholder
          };
        }

        return placeholder;
      };

      HidePlaceholder.prototype.removePlaceholder = function (_, data) {
        var modifiedData = data.slice(0);

        for (var d = data.length - 1; d >= 0; d--) {
          var item = data[d];

          if (this.placeholder.id === item.id) {
            modifiedData.splice(d, 1);
          }
        }

        return modifiedData;
      };

      return HidePlaceholder;
    });

    S2.define('select2/dropdown/infiniteScroll', ['jquery'], function ($) {
      function InfiniteScroll(decorated, $element, options, dataAdapter) {
        this.lastParams = {};

        decorated.call(this, $element, options, dataAdapter);

        this.$loadingMore = this.createLoadingMore();
        this.loading = false;
      }

      InfiniteScroll.prototype.append = function (decorated, data) {
        this.$loadingMore.remove();
        this.loading = false;

        decorated.call(this, data);

        if (this.showLoadingMore(data)) {
          this.$results.append(this.$loadingMore);
        }
      };

      InfiniteScroll.prototype.bind = function (decorated, container, $container) {
        var self = this;

        decorated.call(this, container, $container);

        container.on('query', function (params) {
          self.lastParams = params;
          self.loading = true;
        });

        container.on('query:append', function (params) {
          self.lastParams = params;
          self.loading = true;
        });

        this.$results.on('scroll', function () {
          var isLoadMoreVisible = $.contains(document.documentElement, self.$loadingMore[0]);

          if (self.loading || !isLoadMoreVisible) {
            return;
          }

          var currentOffset = self.$results.offset().top + self.$results.outerHeight(false);
          var loadingMoreOffset = self.$loadingMore.offset().top + self.$loadingMore.outerHeight(false);

          if (currentOffset + 50 >= loadingMoreOffset) {
            self.loadMore();
          }
        });
      };

      InfiniteScroll.prototype.loadMore = function () {
        this.loading = true;

        var params = $.extend({}, { page: 1 }, this.lastParams);

        params.page++;

        this.trigger('query:append', params);
      };

      InfiniteScroll.prototype.showLoadingMore = function (_, data) {
        return data.pagination && data.pagination.more;
      };

      InfiniteScroll.prototype.createLoadingMore = function () {
        var $option = $('<li ' + 'class="select2-results__option select2-results__option--load-more"' + 'role="treeitem" aria-disabled="true"></li>');

        var message = this.options.get('translations').get('loadingMore');

        $option.html(message(this.lastParams));

        return $option;
      };

      return InfiniteScroll;
    });

    S2.define('select2/dropdown/attachBody', ['jquery', '../utils'], function ($, Utils) {
      function AttachBody(decorated, $element, options) {
        this.$dropdownParent = options.get('dropdownParent') || $(document.body);

        decorated.call(this, $element, options);
      }

      AttachBody.prototype.bind = function (decorated, container, $container) {
        var self = this;

        var setupResultsEvents = false;

        decorated.call(this, container, $container);

        container.on('open', function () {
          self._showDropdown();
          self._attachPositioningHandler(container);

          if (!setupResultsEvents) {
            setupResultsEvents = true;

            container.on('results:all', function () {
              self._positionDropdown();
              self._resizeDropdown();
            });

            container.on('results:append', function () {
              self._positionDropdown();
              self._resizeDropdown();
            });
          }
        });

        container.on('close', function () {
          self._hideDropdown();
          self._detachPositioningHandler(container);
        });

        this.$dropdownContainer.on('mousedown', function (evt) {
          evt.stopPropagation();
        });
      };

      AttachBody.prototype.destroy = function (decorated) {
        decorated.call(this);

        this.$dropdownContainer.remove();
      };

      AttachBody.prototype.position = function (decorated, $dropdown, $container) {
        // Clone all of the container classes
        $dropdown.attr('class', $container.attr('class'));

        $dropdown.removeClass('select2');
        $dropdown.addClass('select2-container--open');

        $dropdown.css({
          position: 'absolute',
          top: -999999
        });

        this.$container = $container;
      };

      AttachBody.prototype.render = function (decorated) {
        var $container = $('<span></span>');

        var $dropdown = decorated.call(this);
        $container.append($dropdown);

        this.$dropdownContainer = $container;

        return $container;
      };

      AttachBody.prototype._hideDropdown = function (decorated) {
        this.$dropdownContainer.detach();
      };

      AttachBody.prototype._attachPositioningHandler = function (decorated, container) {
        var self = this;

        var scrollEvent = 'scroll.select2.' + container.id;
        var resizeEvent = 'resize.select2.' + container.id;
        var orientationEvent = 'orientationchange.select2.' + container.id;

        var $watchers = this.$container.parents().filter(Utils.hasScroll);
        $watchers.each(function () {
          $(this).data('select2-scroll-position', {
            x: $(this).scrollLeft(),
            y: $(this).scrollTop()
          });
        });

        $watchers.on(scrollEvent, function (ev) {
          var position = $(this).data('select2-scroll-position');
          $(this).scrollTop(position.y);
        });

        $(window).on(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent, function (e) {
          self._positionDropdown();
          self._resizeDropdown();
        });
      };

      AttachBody.prototype._detachPositioningHandler = function (decorated, container) {
        var scrollEvent = 'scroll.select2.' + container.id;
        var resizeEvent = 'resize.select2.' + container.id;
        var orientationEvent = 'orientationchange.select2.' + container.id;

        var $watchers = this.$container.parents().filter(Utils.hasScroll);
        $watchers.off(scrollEvent);

        $(window).off(scrollEvent + ' ' + resizeEvent + ' ' + orientationEvent);
      };

      AttachBody.prototype._positionDropdown = function () {
        var $window = $(window);

        var isCurrentlyAbove = this.$dropdown.hasClass('select2-dropdown--above');
        var isCurrentlyBelow = this.$dropdown.hasClass('select2-dropdown--below');

        var newDirection = null;

        var offset = this.$container.offset();

        offset.bottom = offset.top + this.$container.outerHeight(false);

        var container = {
          height: this.$container.outerHeight(false)
        };

        container.top = offset.top;
        container.bottom = offset.top + container.height;

        var dropdown = {
          height: this.$dropdown.outerHeight(false)
        };

        var viewport = {
          top: $window.scrollTop(),
          bottom: $window.scrollTop() + $window.height()
        };

        var enoughRoomAbove = viewport.top < offset.top - dropdown.height;
        var enoughRoomBelow = viewport.bottom > offset.bottom + dropdown.height;

        var css = {
          left: offset.left,
          top: container.bottom
        };

        // Determine what the parent element is to use for calciulating the offset
        var $offsetParent = this.$dropdownParent;

        // For statically positoned elements, we need to get the element
        // that is determining the offset
        if ($offsetParent.css('position') === 'static') {
          $offsetParent = $offsetParent.offsetParent();
        }

        var parentOffset = $offsetParent.offset();

        css.top -= parentOffset.top;
        css.left -= parentOffset.left;

        if (!isCurrentlyAbove && !isCurrentlyBelow) {
          newDirection = 'below';
        }

        if (!enoughRoomBelow && enoughRoomAbove && !isCurrentlyAbove) {
          newDirection = 'above';
        } else if (!enoughRoomAbove && enoughRoomBelow && isCurrentlyAbove) {
          newDirection = 'below';
        }

        if (newDirection == 'above' || isCurrentlyAbove && newDirection !== 'below') {
          css.top = container.top - parentOffset.top - dropdown.height;
        }

        if (newDirection != null) {
          this.$dropdown.removeClass('select2-dropdown--below select2-dropdown--above').addClass('select2-dropdown--' + newDirection);
          this.$container.removeClass('select2-container--below select2-container--above').addClass('select2-container--' + newDirection);
        }

        this.$dropdownContainer.css(css);
      };

      AttachBody.prototype._resizeDropdown = function () {
        var css = {
          width: this.$container.outerWidth(false) + 'px'
        };

        if (this.options.get('dropdownAutoWidth')) {
          css.minWidth = css.width;
          css.position = 'relative';
          css.width = 'auto';
        }

        this.$dropdown.css(css);
      };

      AttachBody.prototype._showDropdown = function (decorated) {
        this.$dropdownContainer.appendTo(this.$dropdownParent);

        this._positionDropdown();
        this._resizeDropdown();
      };

      return AttachBody;
    });

    S2.define('select2/dropdown/minimumResultsForSearch', [], function () {
      function countResults(data) {
        var count = 0;

        for (var d = 0; d < data.length; d++) {
          var item = data[d];

          if (item.children) {
            count += countResults(item.children);
          } else {
            count++;
          }
        }

        return count;
      }

      function MinimumResultsForSearch(decorated, $element, options, dataAdapter) {
        this.minimumResultsForSearch = options.get('minimumResultsForSearch');

        if (this.minimumResultsForSearch < 0) {
          this.minimumResultsForSearch = Infinity;
        }

        decorated.call(this, $element, options, dataAdapter);
      }

      MinimumResultsForSearch.prototype.showSearch = function (decorated, params) {
        if (countResults(params.data.results) < this.minimumResultsForSearch) {
          return false;
        }

        return decorated.call(this, params);
      };

      return MinimumResultsForSearch;
    });

    S2.define('select2/dropdown/selectOnClose', [], function () {
      function SelectOnClose() {}

      SelectOnClose.prototype.bind = function (decorated, container, $container) {
        var self = this;

        decorated.call(this, container, $container);

        container.on('close', function (params) {
          self._handleSelectOnClose(params);
        });
      };

      SelectOnClose.prototype._handleSelectOnClose = function (_, params) {
        if (params && params.originalSelect2Event != null) {
          var event = params.originalSelect2Event;

          // Don't select an item if the close event was triggered from a select or
          // unselect event
          if (event._type === 'select' || event._type === 'unselect') {
            return;
          }
        }

        var $highlightedResults = this.getHighlightedResults();

        // Only select highlighted results
        if ($highlightedResults.length < 1) {
          return;
        }

        var data = $highlightedResults.data('data');

        // Don't re-select already selected resulte
        if (data.element != null && data.element.selected || data.element == null && data.selected) {
          return;
        }

        this.trigger('select', {
          data: data
        });
      };

      return SelectOnClose;
    });

    S2.define('select2/dropdown/closeOnSelect', [], function () {
      function CloseOnSelect() {}

      CloseOnSelect.prototype.bind = function (decorated, container, $container) {
        var self = this;

        decorated.call(this, container, $container);

        container.on('select', function (evt) {
          self._selectTriggered(evt);
        });

        container.on('unselect', function (evt) {
          self._selectTriggered(evt);
        });
      };

      CloseOnSelect.prototype._selectTriggered = function (_, evt) {
        var originalEvent = evt.originalEvent;

        // Don't close if the control key is being held
        if (originalEvent && originalEvent.ctrlKey) {
          return;
        }

        this.trigger('close', {
          originalEvent: originalEvent,
          originalSelect2Event: evt
        });
      };

      return CloseOnSelect;
    });

    S2.define('select2/i18n/en', [], function () {
      // English
      return {
        errorLoading: function errorLoading() {
          return 'The results could not be loaded.';
        },
        inputTooLong: function inputTooLong(args) {
          var overChars = args.input.length - args.maximum;

          var message = 'Please delete ' + overChars + ' character';

          if (overChars != 1) {
            message += 's';
          }

          return message;
        },
        inputTooShort: function inputTooShort(args) {
          var remainingChars = args.minimum - args.input.length;

          var message = 'Please enter ' + remainingChars + ' or more characters';

          return message;
        },
        loadingMore: function loadingMore() {
          return 'Loading more results…';
        },
        maximumSelected: function maximumSelected(args) {
          var message = 'You can only select ' + args.maximum + ' item';

          if (args.maximum != 1) {
            message += 's';
          }

          return message;
        },
        noResults: function noResults() {
          return 'No results found';
        },
        searching: function searching() {
          return 'Searching…';
        }
      };
    });

    S2.define('select2/defaults', ['jquery', 'require', './results', './selection/single', './selection/multiple', './selection/placeholder', './selection/allowClear', './selection/search', './selection/eventRelay', './utils', './translation', './diacritics', './data/select', './data/array', './data/ajax', './data/tags', './data/tokenizer', './data/minimumInputLength', './data/maximumInputLength', './data/maximumSelectionLength', './dropdown', './dropdown/search', './dropdown/hidePlaceholder', './dropdown/infiniteScroll', './dropdown/attachBody', './dropdown/minimumResultsForSearch', './dropdown/selectOnClose', './dropdown/closeOnSelect', './i18n/en'], function ($, require, ResultsList, SingleSelection, MultipleSelection, Placeholder, AllowClear, SelectionSearch, EventRelay, Utils, Translation, DIACRITICS, SelectData, ArrayData, AjaxData, Tags, Tokenizer, MinimumInputLength, MaximumInputLength, MaximumSelectionLength, Dropdown, DropdownSearch, HidePlaceholder, InfiniteScroll, AttachBody, MinimumResultsForSearch, SelectOnClose, CloseOnSelect, EnglishTranslation) {
      function Defaults() {
        this.reset();
      }

      Defaults.prototype.apply = function (options) {
        options = $.extend(true, {}, this.defaults, options);

        if (options.dataAdapter == null) {
          if (options.ajax != null) {
            options.dataAdapter = AjaxData;
          } else if (options.data != null) {
            options.dataAdapter = ArrayData;
          } else {
            options.dataAdapter = SelectData;
          }

          if (options.minimumInputLength > 0) {
            options.dataAdapter = Utils.Decorate(options.dataAdapter, MinimumInputLength);
          }

          if (options.maximumInputLength > 0) {
            options.dataAdapter = Utils.Decorate(options.dataAdapter, MaximumInputLength);
          }

          if (options.maximumSelectionLength > 0) {
            options.dataAdapter = Utils.Decorate(options.dataAdapter, MaximumSelectionLength);
          }

          if (options.tags) {
            options.dataAdapter = Utils.Decorate(options.dataAdapter, Tags);
          }

          if (options.tokenSeparators != null || options.tokenizer != null) {
            options.dataAdapter = Utils.Decorate(options.dataAdapter, Tokenizer);
          }

          if (options.query != null) {
            var Query = require(options.amdBase + 'compat/query');

            options.dataAdapter = Utils.Decorate(options.dataAdapter, Query);
          }

          if (options.initSelection != null) {
            var InitSelection = require(options.amdBase + 'compat/initSelection');

            options.dataAdapter = Utils.Decorate(options.dataAdapter, InitSelection);
          }
        }

        if (options.resultsAdapter == null) {
          options.resultsAdapter = ResultsList;

          if (options.ajax != null) {
            options.resultsAdapter = Utils.Decorate(options.resultsAdapter, InfiniteScroll);
          }

          if (options.placeholder != null) {
            options.resultsAdapter = Utils.Decorate(options.resultsAdapter, HidePlaceholder);
          }

          if (options.selectOnClose) {
            options.resultsAdapter = Utils.Decorate(options.resultsAdapter, SelectOnClose);
          }
        }

        if (options.dropdownAdapter == null) {
          if (options.multiple) {
            options.dropdownAdapter = Dropdown;
          } else {
            var SearchableDropdown = Utils.Decorate(Dropdown, DropdownSearch);

            options.dropdownAdapter = SearchableDropdown;
          }

          if (options.minimumResultsForSearch !== 0) {
            options.dropdownAdapter = Utils.Decorate(options.dropdownAdapter, MinimumResultsForSearch);
          }

          if (options.closeOnSelect) {
            options.dropdownAdapter = Utils.Decorate(options.dropdownAdapter, CloseOnSelect);
          }

          if (options.dropdownCssClass != null || options.dropdownCss != null || options.adaptDropdownCssClass != null) {
            var DropdownCSS = require(options.amdBase + 'compat/dropdownCss');

            options.dropdownAdapter = Utils.Decorate(options.dropdownAdapter, DropdownCSS);
          }

          options.dropdownAdapter = Utils.Decorate(options.dropdownAdapter, AttachBody);
        }

        if (options.selectionAdapter == null) {
          if (options.multiple) {
            options.selectionAdapter = MultipleSelection;
          } else {
            options.selectionAdapter = SingleSelection;
          }

          // Add the placeholder mixin if a placeholder was specified
          if (options.placeholder != null) {
            options.selectionAdapter = Utils.Decorate(options.selectionAdapter, Placeholder);
          }

          if (options.allowClear) {
            options.selectionAdapter = Utils.Decorate(options.selectionAdapter, AllowClear);
          }

          if (options.multiple) {
            options.selectionAdapter = Utils.Decorate(options.selectionAdapter, SelectionSearch);
          }

          if (options.containerCssClass != null || options.containerCss != null || options.adaptContainerCssClass != null) {
            var ContainerCSS = require(options.amdBase + 'compat/containerCss');

            options.selectionAdapter = Utils.Decorate(options.selectionAdapter, ContainerCSS);
          }

          options.selectionAdapter = Utils.Decorate(options.selectionAdapter, EventRelay);
        }

        if (typeof options.language === 'string') {
          // Check if the language is specified with a region
          if (options.language.indexOf('-') > 0) {
            // Extract the region information if it is included
            var languageParts = options.language.split('-');
            var baseLanguage = languageParts[0];

            options.language = [options.language, baseLanguage];
          } else {
            options.language = [options.language];
          }
        }

        if ($.isArray(options.language)) {
          var languages = new Translation();
          options.language.push('en');

          var languageNames = options.language;

          for (var l = 0; l < languageNames.length; l++) {
            var name = languageNames[l];
            var language = {};

            try {
              // Try to load it with the original name
              language = Translation.loadPath(name);
            } catch (e) {
              try {
                // If we couldn't load it, check if it wasn't the full path
                name = this.defaults.amdLanguageBase + name;
                language = Translation.loadPath(name);
              } catch (ex) {
                // The translation could not be loaded at all. Sometimes this is
                // because of a configuration problem, other times this can be
                // because of how Select2 helps load all possible translation files.
                if (options.debug && window.console && console.warn) {
                  console.warn('Select2: The language file for "' + name + '" could not be ' + 'automatically loaded. A fallback will be used instead.');
                }

                continue;
              }
            }

            languages.extend(language);
          }

          options.translations = languages;
        } else {
          var baseTranslation = Translation.loadPath(this.defaults.amdLanguageBase + 'en');
          var customTranslation = new Translation(options.language);

          customTranslation.extend(baseTranslation);

          options.translations = customTranslation;
        }

        return options;
      };

      Defaults.prototype.reset = function () {
        function stripDiacritics(text) {
          // Used 'uni range + named function' from http://jsperf.com/diacritics/18
          function match(a) {
            return DIACRITICS[a] || a;
          }

          return text.replace(/[^\u0000-\u007E]/g, match);
        }

        function matcher(params, data) {
          // Always return the object if there is nothing to compare
          if ($.trim(params.term) === '') {
            return data;
          }

          // Do a recursive check for options with children
          if (data.children && data.children.length > 0) {
            // Clone the data object if there are children
            // This is required as we modify the object to remove any non-matches
            var match = $.extend(true, {}, data);

            // Check each child of the option
            for (var c = data.children.length - 1; c >= 0; c--) {
              var child = data.children[c];

              var matches = matcher(params, child);

              // If there wasn't a match, remove the object in the array
              if (matches == null) {
                match.children.splice(c, 1);
              }
            }

            // If any children matched, return the new object
            if (match.children.length > 0) {
              return match;
            }

            // If there were no matching children, check just the plain object
            return matcher(params, match);
          }

          var original = stripDiacritics(data.text).toUpperCase();
          var term = stripDiacritics(params.term).toUpperCase();

          // Check if the text contains the term
          if (original.indexOf(term) > -1) {
            return data;
          }

          // If it doesn't contain the term, don't return anything
          return null;
        }

        this.defaults = {
          amdBase: './',
          amdLanguageBase: './i18n/',
          closeOnSelect: true,
          debug: false,
          dropdownAutoWidth: false,
          escapeMarkup: Utils.escapeMarkup,
          language: EnglishTranslation,
          matcher: matcher,
          minimumInputLength: 0,
          maximumInputLength: 0,
          maximumSelectionLength: 0,
          minimumResultsForSearch: 0,
          selectOnClose: false,
          sorter: function sorter(data) {
            return data;
          },
          templateResult: function templateResult(result) {
            return result.text;
          },
          templateSelection: function templateSelection(selection) {
            return selection.text;
          },
          theme: 'default',
          width: 'resolve'
        };
      };

      Defaults.prototype.set = function (key, value) {
        var camelKey = $.camelCase(key);

        var data = {};
        data[camelKey] = value;

        var convertedData = Utils._convertData(data);

        $.extend(this.defaults, convertedData);
      };

      var defaults = new Defaults();

      return defaults;
    });

    S2.define('select2/options', ['require', 'jquery', './defaults', './utils'], function (require, $, Defaults, Utils) {
      function Options(options, $element) {
        this.options = options;

        if ($element != null) {
          this.fromElement($element);
        }

        this.options = Defaults.apply(this.options);

        if ($element && $element.is('input')) {
          var InputCompat = require(this.get('amdBase') + 'compat/inputData');

          this.options.dataAdapter = Utils.Decorate(this.options.dataAdapter, InputCompat);
        }
      }

      Options.prototype.fromElement = function ($e) {
        var excludedData = ['select2'];

        if (this.options.multiple == null) {
          this.options.multiple = $e.prop('multiple');
        }

        if (this.options.disabled == null) {
          this.options.disabled = $e.prop('disabled');
        }

        if (this.options.language == null) {
          if ($e.prop('lang')) {
            this.options.language = $e.prop('lang').toLowerCase();
          } else if ($e.closest('[lang]').prop('lang')) {
            this.options.language = $e.closest('[lang]').prop('lang');
          }
        }

        if (this.options.dir == null) {
          if ($e.prop('dir')) {
            this.options.dir = $e.prop('dir');
          } else if ($e.closest('[dir]').prop('dir')) {
            this.options.dir = $e.closest('[dir]').prop('dir');
          } else {
            this.options.dir = 'ltr';
          }
        }

        $e.prop('disabled', this.options.disabled);
        $e.prop('multiple', this.options.multiple);

        if ($e.data('select2Tags')) {
          if (this.options.debug && window.console && console.warn) {
            console.warn('Select2: The `data-select2-tags` attribute has been changed to ' + 'use the `data-data` and `data-tags="true"` attributes and will be ' + 'removed in future versions of Select2.');
          }

          $e.data('data', $e.data('select2Tags'));
          $e.data('tags', true);
        }

        if ($e.data('ajaxUrl')) {
          if (this.options.debug && window.console && console.warn) {
            console.warn('Select2: The `data-ajax-url` attribute has been changed to ' + '`data-ajax--url` and support for the old attribute will be removed' + ' in future versions of Select2.');
          }

          $e.attr('ajax--url', $e.data('ajaxUrl'));
          $e.data('ajax--url', $e.data('ajaxUrl'));
        }

        var dataset = {};

        // Prefer the element's `dataset` attribute if it exists
        // jQuery 1.x does not correctly handle data attributes with multiple dashes
        if ($.fn.jquery && $.fn.jquery.substr(0, 2) == '1.' && $e[0].dataset) {
          dataset = $.extend(true, {}, $e[0].dataset, $e.data());
        } else {
          dataset = $e.data();
        }

        var data = $.extend(true, {}, dataset);

        data = Utils._convertData(data);

        for (var key in data) {
          if ($.inArray(key, excludedData) > -1) {
            continue;
          }

          if ($.isPlainObject(this.options[key])) {
            $.extend(this.options[key], data[key]);
          } else {
            this.options[key] = data[key];
          }
        }

        return this;
      };

      Options.prototype.get = function (key) {
        return this.options[key];
      };

      Options.prototype.set = function (key, val) {
        this.options[key] = val;
      };

      return Options;
    });

    S2.define('select2/core', ['jquery', './options', './utils', './keys'], function ($, Options, Utils, KEYS) {
      var Select2 = function Select2($element, options) {
        if ($element.data('select2') != null) {
          $element.data('select2').destroy();
        }

        this.$element = $element;

        this.id = this._generateId($element);

        options = options || {};

        this.options = new Options(options, $element);

        Select2.__super__.constructor.call(this);

        // Set up the tabindex

        var tabindex = $element.attr('tabindex') || 0;
        $element.data('old-tabindex', tabindex);
        $element.attr('tabindex', '-1');

        // Set up containers and adapters

        var DataAdapter = this.options.get('dataAdapter');
        this.dataAdapter = new DataAdapter($element, this.options);

        var $container = this.render();

        this._placeContainer($container);

        var SelectionAdapter = this.options.get('selectionAdapter');
        this.selection = new SelectionAdapter($element, this.options);
        this.$selection = this.selection.render();

        this.selection.position(this.$selection, $container);

        var DropdownAdapter = this.options.get('dropdownAdapter');
        this.dropdown = new DropdownAdapter($element, this.options);
        this.$dropdown = this.dropdown.render();

        this.dropdown.position(this.$dropdown, $container);

        var ResultsAdapter = this.options.get('resultsAdapter');
        this.results = new ResultsAdapter($element, this.options, this.dataAdapter);
        this.$results = this.results.render();

        this.results.position(this.$results, this.$dropdown);

        // Bind events

        var self = this;

        // Bind the container to all of the adapters
        this._bindAdapters();

        // Register any DOM event handlers
        this._registerDomEvents();

        // Register any internal event handlers
        this._registerDataEvents();
        this._registerSelectionEvents();
        this._registerDropdownEvents();
        this._registerResultsEvents();
        this._registerEvents();

        // Set the initial state
        this.dataAdapter.current(function (initialData) {
          self.trigger('selection:update', {
            data: initialData
          });
        });

        // Hide the original select
        $element.addClass('select2-hidden-accessible');
        $element.attr('aria-hidden', 'true');

        // Synchronize any monitored attributes
        this._syncAttributes();

        $element.data('select2', this);
      };

      Utils.Extend(Select2, Utils.Observable);

      Select2.prototype._generateId = function ($element) {
        var id = '';

        if ($element.attr('id') != null) {
          id = $element.attr('id');
        } else if ($element.attr('name') != null) {
          id = $element.attr('name') + '-' + Utils.generateChars(2);
        } else {
          id = Utils.generateChars(4);
        }

        id = id.replace(/(:|\.|\[|\]|,)/g, '');
        id = 'select2-' + id;

        return id;
      };

      Select2.prototype._placeContainer = function ($container) {
        $container.insertAfter(this.$element);

        var width = this._resolveWidth(this.$element, this.options.get('width'));

        if (width != null) {
          $container.css('width', width);
        }
      };

      Select2.prototype._resolveWidth = function ($element, method) {
        var WIDTH = /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;

        if (method == 'resolve') {
          var styleWidth = this._resolveWidth($element, 'style');

          if (styleWidth != null) {
            return styleWidth;
          }

          return this._resolveWidth($element, 'element');
        }

        if (method == 'element') {
          var elementWidth = $element.outerWidth(false);

          if (elementWidth <= 0) {
            return 'auto';
          }

          return elementWidth + 'px';
        }

        if (method == 'style') {
          var style = $element.attr('style');

          if (typeof style !== 'string') {
            return null;
          }

          var attrs = style.split(';');

          for (var i = 0, l = attrs.length; i < l; i = i + 1) {
            var attr = attrs[i].replace(/\s/g, '');
            var matches = attr.match(WIDTH);

            if (matches !== null && matches.length >= 1) {
              return matches[1];
            }
          }

          return null;
        }

        return method;
      };

      Select2.prototype._bindAdapters = function () {
        this.dataAdapter.bind(this, this.$container);
        this.selection.bind(this, this.$container);

        this.dropdown.bind(this, this.$container);
        this.results.bind(this, this.$container);
      };

      Select2.prototype._registerDomEvents = function () {
        var self = this;

        this.$element.on('change.select2', function () {
          self.dataAdapter.current(function (data) {
            self.trigger('selection:update', {
              data: data
            });
          });
        });

        this.$element.on('focus.select2', function (evt) {
          self.trigger('focus', evt);
        });

        this._syncA = Utils.bind(this._syncAttributes, this);
        this._syncS = Utils.bind(this._syncSubtree, this);

        if (this.$element[0].attachEvent) {
          this.$element[0].attachEvent('onpropertychange', this._syncA);
        }

        var observer = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

        if (observer != null) {
          this._observer = new observer(function (mutations) {
            $.each(mutations, self._syncA);
            $.each(mutations, self._syncS);
          });
          this._observer.observe(this.$element[0], {
            attributes: true,
            childList: true,
            subtree: false
          });
        } else if (this.$element[0].addEventListener) {
          this.$element[0].addEventListener('DOMAttrModified', self._syncA, false);
          this.$element[0].addEventListener('DOMNodeInserted', self._syncS, false);
          this.$element[0].addEventListener('DOMNodeRemoved', self._syncS, false);
        }
      };

      Select2.prototype._registerDataEvents = function () {
        var self = this;

        this.dataAdapter.on('*', function (name, params) {
          self.trigger(name, params);
        });
      };

      Select2.prototype._registerSelectionEvents = function () {
        var self = this;
        var nonRelayEvents = ['toggle', 'focus'];

        this.selection.on('toggle', function () {
          self.toggleDropdown();
        });

        this.selection.on('focus', function (params) {
          self.focus(params);
        });

        this.selection.on('*', function (name, params) {
          if ($.inArray(name, nonRelayEvents) !== -1) {
            return;
          }

          self.trigger(name, params);
        });
      };

      Select2.prototype._registerDropdownEvents = function () {
        var self = this;

        this.dropdown.on('*', function (name, params) {
          self.trigger(name, params);
        });
      };

      Select2.prototype._registerResultsEvents = function () {
        var self = this;

        this.results.on('*', function (name, params) {
          self.trigger(name, params);
        });
      };

      Select2.prototype._registerEvents = function () {
        var self = this;

        this.on('open', function () {
          self.$container.addClass('select2-container--open');
        });

        this.on('close', function () {
          self.$container.removeClass('select2-container--open');
        });

        this.on('enable', function () {
          self.$container.removeClass('select2-container--disabled');
        });

        this.on('disable', function () {
          self.$container.addClass('select2-container--disabled');
        });

        this.on('blur', function () {
          self.$container.removeClass('select2-container--focus');
        });

        this.on('query', function (params) {
          if (!self.isOpen()) {
            self.trigger('open', {});
          }

          this.dataAdapter.query(params, function (data) {
            self.trigger('results:all', {
              data: data,
              query: params
            });
          });
        });

        this.on('query:append', function (params) {
          this.dataAdapter.query(params, function (data) {
            self.trigger('results:append', {
              data: data,
              query: params
            });
          });
        });

        this.on('keypress', function (evt) {
          var key = evt.which;

          if (self.isOpen()) {
            if (key === KEYS.ESC || key === KEYS.TAB || key === KEYS.UP && evt.altKey) {
              self.close();

              evt.preventDefault();
            } else if (key === KEYS.ENTER) {
              self.trigger('results:select', {});

              evt.preventDefault();
            } else if (key === KEYS.SPACE && evt.ctrlKey) {
              self.trigger('results:toggle', {});

              evt.preventDefault();
            } else if (key === KEYS.UP) {
              self.trigger('results:previous', {});

              evt.preventDefault();
            } else if (key === KEYS.DOWN) {
              self.trigger('results:next', {});

              evt.preventDefault();
            }
          } else {
            if (key === KEYS.ENTER || key === KEYS.SPACE || key === KEYS.DOWN && evt.altKey) {
              self.open();

              evt.preventDefault();
            }
          }
        });
      };

      Select2.prototype._syncAttributes = function () {
        this.options.set('disabled', this.$element.prop('disabled'));

        if (this.options.get('disabled')) {
          if (this.isOpen()) {
            this.close();
          }

          this.trigger('disable', {});
        } else {
          this.trigger('enable', {});
        }
      };

      Select2.prototype._syncSubtree = function (evt, mutations) {
        var changed = false;
        var self = this;

        // Ignore any mutation events raised for elements that aren't options or
        // optgroups. This handles the case when the select element is destroyed
        if (evt && evt.target && evt.target.nodeName !== 'OPTION' && evt.target.nodeName !== 'OPTGROUP') {
          return;
        }

        if (!mutations) {
          // If mutation events aren't supported, then we can only assume that the
          // change affected the selections
          changed = true;
        } else if (mutations.addedNodes && mutations.addedNodes.length > 0) {
          for (var n = 0; n < mutations.addedNodes.length; n++) {
            var node = mutations.addedNodes[n];

            if (node.selected) {
              changed = true;
            }
          }
        } else if (mutations.removedNodes && mutations.removedNodes.length > 0) {
          changed = true;
        }

        // Only re-pull the data if we think there is a change
        if (changed) {
          this.dataAdapter.current(function (currentData) {
            self.trigger('selection:update', {
              data: currentData
            });
          });
        }
      };

      /**
       * Override the trigger method to automatically trigger pre-events when
       * there are events that can be prevented.
       */
      Select2.prototype.trigger = function (name, args) {
        var actualTrigger = Select2.__super__.trigger;
        var preTriggerMap = {
          'open': 'opening',
          'close': 'closing',
          'select': 'selecting',
          'unselect': 'unselecting'
        };

        if (args === undefined) {
          args = {};
        }

        if (name in preTriggerMap) {
          var preTriggerName = preTriggerMap[name];
          var preTriggerArgs = {
            prevented: false,
            name: name,
            args: args
          };

          actualTrigger.call(this, preTriggerName, preTriggerArgs);

          if (preTriggerArgs.prevented) {
            args.prevented = true;

            return;
          }
        }

        actualTrigger.call(this, name, args);
      };

      Select2.prototype.toggleDropdown = function () {
        if (this.options.get('disabled')) {
          return;
        }

        if (this.isOpen()) {
          this.close();
        } else {
          this.open();
        }
      };

      Select2.prototype.open = function () {
        if (this.isOpen()) {
          return;
        }

        this.trigger('query', {});
      };

      Select2.prototype.close = function () {
        if (!this.isOpen()) {
          return;
        }

        this.trigger('close', {});
      };

      Select2.prototype.isOpen = function () {
        return this.$container.hasClass('select2-container--open');
      };

      Select2.prototype.hasFocus = function () {
        return this.$container.hasClass('select2-container--focus');
      };

      Select2.prototype.focus = function (data) {
        // No need to re-trigger focus events if we are already focused
        if (this.hasFocus()) {
          return;
        }

        this.$container.addClass('select2-container--focus');
        this.trigger('focus', {});
      };

      Select2.prototype.enable = function (args) {
        if (this.options.get('debug') && window.console && console.warn) {
          console.warn('Select2: The `select2("enable")` method has been deprecated and will' + ' be removed in later Select2 versions. Use $element.prop("disabled")' + ' instead.');
        }

        if (args == null || args.length === 0) {
          args = [true];
        }

        var disabled = !args[0];

        this.$element.prop('disabled', disabled);
      };

      Select2.prototype.data = function () {
        if (this.options.get('debug') && arguments.length > 0 && window.console && console.warn) {
          console.warn('Select2: Data can no longer be set using `select2("data")`. You ' + 'should consider setting the value instead using `$element.val()`.');
        }

        var data = [];

        this.dataAdapter.current(function (currentData) {
          data = currentData;
        });

        return data;
      };

      Select2.prototype.val = function (args) {
        if (this.options.get('debug') && window.console && console.warn) {
          console.warn('Select2: The `select2("val")` method has been deprecated and will be' + ' removed in later Select2 versions. Use $element.val() instead.');
        }

        if (args == null || args.length === 0) {
          return this.$element.val();
        }

        var newVal = args[0];

        if ($.isArray(newVal)) {
          newVal = $.map(newVal, function (obj) {
            return obj.toString();
          });
        }

        this.$element.val(newVal).trigger('change');
      };

      Select2.prototype.destroy = function () {
        this.$container.remove();

        if (this.$element[0].detachEvent) {
          this.$element[0].detachEvent('onpropertychange', this._syncA);
        }

        if (this._observer != null) {
          this._observer.disconnect();
          this._observer = null;
        } else if (this.$element[0].removeEventListener) {
          this.$element[0].removeEventListener('DOMAttrModified', this._syncA, false);
          this.$element[0].removeEventListener('DOMNodeInserted', this._syncS, false);
          this.$element[0].removeEventListener('DOMNodeRemoved', this._syncS, false);
        }

        this._syncA = null;
        this._syncS = null;

        this.$element.off('.select2');
        this.$element.attr('tabindex', this.$element.data('old-tabindex'));

        this.$element.removeClass('select2-hidden-accessible');
        this.$element.attr('aria-hidden', 'false');
        this.$element.removeData('select2');

        this.dataAdapter.destroy();
        this.selection.destroy();
        this.dropdown.destroy();
        this.results.destroy();

        this.dataAdapter = null;
        this.selection = null;
        this.dropdown = null;
        this.results = null;
      };

      Select2.prototype.render = function () {
        var $container = $('<span class="select2 select2-container">' + '<span class="selection"></span>' + '<span class="dropdown-wrapper" aria-hidden="true"></span>' + '</span>');

        $container.attr('dir', this.options.get('dir'));

        this.$container = $container;

        this.$container.addClass('select2-container--' + this.options.get('theme'));

        $container.data('element', this.$element);

        return $container;
      };

      return Select2;
    });

    S2.define('jquery-mousewheel', ['jquery'], function ($) {
      // Used to shim jQuery.mousewheel for non-full builds.
      return $;
    });

    S2.define('jquery.select2', ['jquery', 'jquery-mousewheel', './select2/core', './select2/defaults'], function ($, _, Select2, Defaults) {
      if ($.fn.select2 == null) {
        // All methods that should return the element
        var thisMethods = ['open', 'close', 'destroy'];

        $.fn.select2 = function (options) {
          options = options || {};

          if ((typeof options === "undefined" ? "undefined" : _typeof(options)) === 'object') {
            this.each(function () {
              var instanceOptions = $.extend(true, {}, options);

              var instance = new Select2($(this), instanceOptions);
            });

            return this;
          } else if (typeof options === 'string') {
            var ret;
            var args = Array.prototype.slice.call(arguments, 1);

            this.each(function () {
              var instance = $(this).data('select2');

              if (instance == null && window.console && console.error) {
                console.error('The select2(\'' + options + '\') method was called on an ' + 'element that is not using Select2.');
              }

              ret = instance[options].apply(instance, args);
            });

            // Check if we should be returning `this`
            if ($.inArray(options, thisMethods) > -1) {
              return this;
            }

            return ret;
          } else {
            throw new Error('Invalid arguments for Select2: ' + options);
          }
        };
      }

      if ($.fn.select2.defaults == null) {
        $.fn.select2.defaults = Defaults;
      }

      return Select2;
    });

    // Return the AMD loader configuration so it can be used outside of this file
    return {
      define: S2.define,
      require: S2.require
    };
  }();

  // Autoload the jQuery bindings
  // We know that all of the modules exist above this, so we're safe
  var select2 = S2.require('jquery.select2');

  // Hold the AMD module references on the jQuery function that was just loaded
  // This allows Select2 to use the internal loader outside of this file, such
  // as in the language files.
  jQuery.fn.select2.amd = S2;

  // Return the Select2 instance for anyone who is importing it.
  return select2;
});

},{}],3:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.6.0
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */
/* global window, document, define, jQuery, setInterval, clearInterval */
(function (factory) {
    'use strict';

    factory(jQuery);
})(function ($) {
    'use strict';

    var Slick = window.Slick || {};

    Slick = function () {

        var instanceUid = 0;

        function Slick(element, settings) {

            var _ = this,
                dataSettings;

            _.defaults = {
                accessibility: true,
                adaptiveHeight: false,
                appendArrows: $(element),
                appendDots: $(element),
                arrows: true,
                asNavFor: null,
                prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',
                nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
                autoplay: false,
                autoplaySpeed: 3000,
                centerMode: false,
                centerPadding: '50px',
                cssEase: 'ease',
                customPaging: function customPaging(slider, i) {
                    return $('<button type="button" data-role="none" role="button" tabindex="0" />').text(i + 1);
                },
                dots: false,
                dotsClass: 'slick-dots',
                draggable: true,
                easing: 'linear',
                edgeFriction: 0.35,
                fade: false,
                focusOnSelect: false,
                infinite: true,
                initialSlide: 0,
                lazyLoad: 'ondemand',
                mobileFirst: false,
                pauseOnHover: true,
                pauseOnFocus: true,
                pauseOnDotsHover: false,
                respondTo: 'window',
                responsive: null,
                rows: 1,
                rtl: false,
                slide: '',
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: true,
                swipeToSlide: false,
                touchMove: true,
                touchThreshold: 5,
                useCSS: true,
                useTransform: true,
                variableWidth: false,
                vertical: false,
                verticalSwiping: false,
                waitForAnimate: true,
                zIndex: 1000
            };

            _.initials = {
                animating: false,
                dragging: false,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: false,
                slideOffset: 0,
                swipeLeft: null,
                $list: null,
                touchObject: {},
                transformsEnabled: false,
                unslicked: false
            };

            $.extend(_, _.initials);

            _.activeBreakpoint = null;
            _.animType = null;
            _.animProp = null;
            _.breakpoints = [];
            _.breakpointSettings = [];
            _.cssTransitions = false;
            _.focussed = false;
            _.interrupted = false;
            _.hidden = 'hidden';
            _.paused = true;
            _.positionProp = null;
            _.respondTo = null;
            _.rowCount = 1;
            _.shouldClick = true;
            _.$slider = $(element);
            _.$slidesCache = null;
            _.transformType = null;
            _.transitionType = null;
            _.visibilityChange = 'visibilitychange';
            _.windowWidth = 0;
            _.windowTimer = null;

            dataSettings = $(element).data('slick') || {};

            _.options = $.extend({}, _.defaults, settings, dataSettings);

            _.currentSlide = _.options.initialSlide;

            _.originalSettings = _.options;

            if (typeof document.mozHidden !== 'undefined') {
                _.hidden = 'mozHidden';
                _.visibilityChange = 'mozvisibilitychange';
            } else if (typeof document.webkitHidden !== 'undefined') {
                _.hidden = 'webkitHidden';
                _.visibilityChange = 'webkitvisibilitychange';
            }

            _.autoPlay = $.proxy(_.autoPlay, _);
            _.autoPlayClear = $.proxy(_.autoPlayClear, _);
            _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
            _.changeSlide = $.proxy(_.changeSlide, _);
            _.clickHandler = $.proxy(_.clickHandler, _);
            _.selectHandler = $.proxy(_.selectHandler, _);
            _.setPosition = $.proxy(_.setPosition, _);
            _.swipeHandler = $.proxy(_.swipeHandler, _);
            _.dragHandler = $.proxy(_.dragHandler, _);
            _.keyHandler = $.proxy(_.keyHandler, _);

            _.instanceUid = instanceUid++;

            // A simple way to check for HTML strings
            // Strict HTML recognition (must start with <)
            // Extracted from jQuery v1.11 source
            _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;

            _.registerBreakpoints();
            _.init(true);
        }

        return Slick;
    }();

    Slick.prototype.activateADA = function () {
        var _ = this;

        _.$slideTrack.find('.slick-active').attr({
            'aria-hidden': 'false'
        }).find('a, input, button, select').attr({
            'tabindex': '0'
        });
    };

    Slick.prototype.addSlide = Slick.prototype.slickAdd = function (markup, index, addBefore) {

        var _ = this;

        if (typeof index === 'boolean') {
            addBefore = index;
            index = null;
        } else if (index < 0 || index >= _.slideCount) {
            return false;
        }

        _.unload();

        if (typeof index === 'number') {
            if (index === 0 && _.$slides.length === 0) {
                $(markup).appendTo(_.$slideTrack);
            } else if (addBefore) {
                $(markup).insertBefore(_.$slides.eq(index));
            } else {
                $(markup).insertAfter(_.$slides.eq(index));
            }
        } else {
            if (addBefore === true) {
                $(markup).prependTo(_.$slideTrack);
            } else {
                $(markup).appendTo(_.$slideTrack);
            }
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slides.each(function (index, element) {
            $(element).attr('data-slick-index', index);
        });

        _.$slidesCache = _.$slides;

        _.reinit();
    };

    Slick.prototype.animateHeight = function () {
        var _ = this;
        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.animate({
                height: targetHeight
            }, _.options.speed);
        }
    };

    Slick.prototype.animateSlide = function (targetLeft, callback) {

        var animProps = {},
            _ = this;

        _.animateHeight();

        if (_.options.rtl === true && _.options.vertical === false) {
            targetLeft = -targetLeft;
        }
        if (_.transformsEnabled === false) {
            if (_.options.vertical === false) {
                _.$slideTrack.animate({
                    left: targetLeft
                }, _.options.speed, _.options.easing, callback);
            } else {
                _.$slideTrack.animate({
                    top: targetLeft
                }, _.options.speed, _.options.easing, callback);
            }
        } else {

            if (_.cssTransitions === false) {
                if (_.options.rtl === true) {
                    _.currentLeft = -_.currentLeft;
                }
                $({
                    animStart: _.currentLeft
                }).animate({
                    animStart: targetLeft
                }, {
                    duration: _.options.speed,
                    easing: _.options.easing,
                    step: function step(now) {
                        now = Math.ceil(now);
                        if (_.options.vertical === false) {
                            animProps[_.animType] = 'translate(' + now + 'px, 0px)';
                            _.$slideTrack.css(animProps);
                        } else {
                            animProps[_.animType] = 'translate(0px,' + now + 'px)';
                            _.$slideTrack.css(animProps);
                        }
                    },
                    complete: function complete() {
                        if (callback) {
                            callback.call();
                        }
                    }
                });
            } else {

                _.applyTransition();
                targetLeft = Math.ceil(targetLeft);

                if (_.options.vertical === false) {
                    animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
                } else {
                    animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
                }
                _.$slideTrack.css(animProps);

                if (callback) {
                    setTimeout(function () {

                        _.disableTransition();

                        callback.call();
                    }, _.options.speed);
                }
            }
        }
    };

    Slick.prototype.getNavTarget = function () {

        var _ = this,
            asNavFor = _.options.asNavFor;

        if (asNavFor && asNavFor !== null) {
            asNavFor = $(asNavFor).not(_.$slider);
        }

        return asNavFor;
    };

    Slick.prototype.asNavFor = function (index) {

        var _ = this,
            asNavFor = _.getNavTarget();

        if (asNavFor !== null && (typeof asNavFor === 'undefined' ? 'undefined' : _typeof(asNavFor)) === 'object') {
            asNavFor.each(function () {
                var target = $(this).slick('getSlick');
                if (!target.unslicked) {
                    target.slideHandler(index, true);
                }
            });
        }
    };

    Slick.prototype.applyTransition = function (slide) {

        var _ = this,
            transition = {};

        if (_.options.fade === false) {
            transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
        } else {
            transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
        }

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }
    };

    Slick.prototype.autoPlay = function () {

        var _ = this;

        _.autoPlayClear();

        if (_.slideCount > _.options.slidesToShow) {
            _.autoPlayTimer = setInterval(_.autoPlayIterator, _.options.autoplaySpeed);
        }
    };

    Slick.prototype.autoPlayClear = function () {

        var _ = this;

        if (_.autoPlayTimer) {
            clearInterval(_.autoPlayTimer);
        }
    };

    Slick.prototype.autoPlayIterator = function () {

        var _ = this,
            slideTo = _.currentSlide + _.options.slidesToScroll;

        if (!_.paused && !_.interrupted && !_.focussed) {

            if (_.options.infinite === false) {

                if (_.direction === 1 && _.currentSlide + 1 === _.slideCount - 1) {
                    _.direction = 0;
                } else if (_.direction === 0) {

                    slideTo = _.currentSlide - _.options.slidesToScroll;

                    if (_.currentSlide - 1 === 0) {
                        _.direction = 1;
                    }
                }
            }

            _.slideHandler(slideTo);
        }
    };

    Slick.prototype.buildArrows = function () {

        var _ = this;

        if (_.options.arrows === true) {

            _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
            _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');

            if (_.slideCount > _.options.slidesToShow) {

                _.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');
                _.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

                if (_.htmlExpr.test(_.options.prevArrow)) {
                    _.$prevArrow.prependTo(_.options.appendArrows);
                }

                if (_.htmlExpr.test(_.options.nextArrow)) {
                    _.$nextArrow.appendTo(_.options.appendArrows);
                }

                if (_.options.infinite !== true) {
                    _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                }
            } else {

                _.$prevArrow.add(_.$nextArrow).addClass('slick-hidden').attr({
                    'aria-disabled': 'true',
                    'tabindex': '-1'
                });
            }
        }
    };

    Slick.prototype.buildDots = function () {

        var _ = this,
            i,
            dot;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$slider.addClass('slick-dotted');

            dot = $('<ul />').addClass(_.options.dotsClass);

            for (i = 0; i <= _.getDotCount(); i += 1) {
                dot.append($('<li />').append(_.options.customPaging.call(this, _, i)));
            }

            _.$dots = dot.appendTo(_.options.appendDots);

            _.$dots.find('li').first().addClass('slick-active').attr('aria-hidden', 'false');
        }
    };

    Slick.prototype.buildOut = function () {

        var _ = this;

        _.$slides = _.$slider.children(_.options.slide + ':not(.slick-cloned)').addClass('slick-slide');

        _.slideCount = _.$slides.length;

        _.$slides.each(function (index, element) {
            $(element).attr('data-slick-index', index).data('originalStyling', $(element).attr('style') || '');
        });

        _.$slider.addClass('slick-slider');

        _.$slideTrack = _.slideCount === 0 ? $('<div class="slick-track"/>').appendTo(_.$slider) : _.$slides.wrapAll('<div class="slick-track"/>').parent();

        _.$list = _.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>').parent();
        _.$slideTrack.css('opacity', 0);

        if (_.options.centerMode === true || _.options.swipeToSlide === true) {
            _.options.slidesToScroll = 1;
        }

        $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');

        _.setupInfinite();

        _.buildArrows();

        _.buildDots();

        _.updateDots();

        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

        if (_.options.draggable === true) {
            _.$list.addClass('draggable');
        }
    };

    Slick.prototype.buildRows = function () {

        var _ = this,
            a,
            b,
            c,
            newSlides,
            numOfSlides,
            originalSlides,
            slidesPerSection;

        newSlides = document.createDocumentFragment();
        originalSlides = _.$slider.children();

        if (_.options.rows > 1) {

            slidesPerSection = _.options.slidesPerRow * _.options.rows;
            numOfSlides = Math.ceil(originalSlides.length / slidesPerSection);

            for (a = 0; a < numOfSlides; a++) {
                var slide = document.createElement('div');
                for (b = 0; b < _.options.rows; b++) {
                    var row = document.createElement('div');
                    for (c = 0; c < _.options.slidesPerRow; c++) {
                        var target = a * slidesPerSection + (b * _.options.slidesPerRow + c);
                        if (originalSlides.get(target)) {
                            row.appendChild(originalSlides.get(target));
                        }
                    }
                    slide.appendChild(row);
                }
                newSlides.appendChild(slide);
            }

            _.$slider.empty().append(newSlides);
            _.$slider.children().children().children().css({
                'width': 100 / _.options.slidesPerRow + '%',
                'display': 'inline-block'
            });
        }
    };

    Slick.prototype.checkResponsive = function (initial, forceUpdate) {

        var _ = this,
            breakpoint,
            targetBreakpoint,
            respondToWidth,
            triggerBreakpoint = false;
        var sliderWidth = _.$slider.width();
        var windowWidth = window.innerWidth || $(window).width();

        if (_.respondTo === 'window') {
            respondToWidth = windowWidth;
        } else if (_.respondTo === 'slider') {
            respondToWidth = sliderWidth;
        } else if (_.respondTo === 'min') {
            respondToWidth = Math.min(windowWidth, sliderWidth);
        }

        if (_.options.responsive && _.options.responsive.length && _.options.responsive !== null) {

            targetBreakpoint = null;

            for (breakpoint in _.breakpoints) {
                if (_.breakpoints.hasOwnProperty(breakpoint)) {
                    if (_.originalSettings.mobileFirst === false) {
                        if (respondToWidth < _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    } else {
                        if (respondToWidth > _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    }
                }
            }

            if (targetBreakpoint !== null) {
                if (_.activeBreakpoint !== null) {
                    if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
                        _.activeBreakpoint = targetBreakpoint;
                        if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                            _.unslick(targetBreakpoint);
                        } else {
                            _.options = $.extend({}, _.originalSettings, _.breakpointSettings[targetBreakpoint]);
                            if (initial === true) {
                                _.currentSlide = _.options.initialSlide;
                            }
                            _.refresh(initial);
                        }
                        triggerBreakpoint = targetBreakpoint;
                    }
                } else {
                    _.activeBreakpoint = targetBreakpoint;
                    if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                        _.unslick(targetBreakpoint);
                    } else {
                        _.options = $.extend({}, _.originalSettings, _.breakpointSettings[targetBreakpoint]);
                        if (initial === true) {
                            _.currentSlide = _.options.initialSlide;
                        }
                        _.refresh(initial);
                    }
                    triggerBreakpoint = targetBreakpoint;
                }
            } else {
                if (_.activeBreakpoint !== null) {
                    _.activeBreakpoint = null;
                    _.options = _.originalSettings;
                    if (initial === true) {
                        _.currentSlide = _.options.initialSlide;
                    }
                    _.refresh(initial);
                    triggerBreakpoint = targetBreakpoint;
                }
            }

            // only trigger breakpoints during an actual break. not on initialize.
            if (!initial && triggerBreakpoint !== false) {
                _.$slider.trigger('breakpoint', [_, triggerBreakpoint]);
            }
        }
    };

    Slick.prototype.changeSlide = function (event, dontAnimate) {

        var _ = this,
            $target = $(event.currentTarget),
            indexOffset,
            slideOffset,
            unevenOffset;

        // If target is a link, prevent default action.
        if ($target.is('a')) {
            event.preventDefault();
        }

        // If target is not the <li> element (ie: a child), find the <li>.
        if (!$target.is('li')) {
            $target = $target.closest('li');
        }

        unevenOffset = _.slideCount % _.options.slidesToScroll !== 0;
        indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;

        switch (event.data.message) {

            case 'previous':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
                }
                break;

            case 'next':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
                }
                break;

            case 'index':
                var index = event.data.index === 0 ? 0 : event.data.index || $target.index() * _.options.slidesToScroll;

                _.slideHandler(_.checkNavigable(index), false, dontAnimate);
                $target.children().trigger('focus');
                break;

            default:
                return;
        }
    };

    Slick.prototype.checkNavigable = function (index) {

        var _ = this,
            navigables,
            prevNavigable;

        navigables = _.getNavigableIndexes();
        prevNavigable = 0;
        if (index > navigables[navigables.length - 1]) {
            index = navigables[navigables.length - 1];
        } else {
            for (var n in navigables) {
                if (index < navigables[n]) {
                    index = prevNavigable;
                    break;
                }
                prevNavigable = navigables[n];
            }
        }

        return index;
    };

    Slick.prototype.cleanUpEvents = function () {

        var _ = this;

        if (_.options.dots && _.$dots !== null) {

            $('li', _.$dots).off('click.slick', _.changeSlide).off('mouseenter.slick', $.proxy(_.interrupt, _, true)).off('mouseleave.slick', $.proxy(_.interrupt, _, false));
        }

        _.$slider.off('focus.slick blur.slick');

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide);
            _.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide);
        }

        _.$list.off('touchstart.slick mousedown.slick', _.swipeHandler);
        _.$list.off('touchmove.slick mousemove.slick', _.swipeHandler);
        _.$list.off('touchend.slick mouseup.slick', _.swipeHandler);
        _.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler);

        _.$list.off('click.slick', _.clickHandler);

        $(document).off(_.visibilityChange, _.visibility);

        _.cleanUpSlideEvents();

        if (_.options.accessibility === true) {
            _.$list.off('keydown.slick', _.keyHandler);
        }

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().off('click.slick', _.selectHandler);
        }

        $(window).off('orientationchange.slick.slick-' + _.instanceUid, _.orientationChange);

        $(window).off('resize.slick.slick-' + _.instanceUid, _.resize);

        $('[draggable!=true]', _.$slideTrack).off('dragstart', _.preventDefault);

        $(window).off('load.slick.slick-' + _.instanceUid, _.setPosition);
        $(document).off('ready.slick.slick-' + _.instanceUid, _.setPosition);
    };

    Slick.prototype.cleanUpSlideEvents = function () {

        var _ = this;

        _.$list.off('mouseenter.slick', $.proxy(_.interrupt, _, true));
        _.$list.off('mouseleave.slick', $.proxy(_.interrupt, _, false));
    };

    Slick.prototype.cleanUpRows = function () {

        var _ = this,
            originalSlides;

        if (_.options.rows > 1) {
            originalSlides = _.$slides.children().children();
            originalSlides.removeAttr('style');
            _.$slider.empty().append(originalSlides);
        }
    };

    Slick.prototype.clickHandler = function (event) {

        var _ = this;

        if (_.shouldClick === false) {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();
        }
    };

    Slick.prototype.destroy = function (refresh) {

        var _ = this;

        _.autoPlayClear();

        _.touchObject = {};

        _.cleanUpEvents();

        $('.slick-cloned', _.$slider).detach();

        if (_.$dots) {
            _.$dots.remove();
        }

        if (_.$prevArrow && _.$prevArrow.length) {

            _.$prevArrow.removeClass('slick-disabled slick-arrow slick-hidden').removeAttr('aria-hidden aria-disabled tabindex').css('display', '');

            if (_.htmlExpr.test(_.options.prevArrow)) {
                _.$prevArrow.remove();
            }
        }

        if (_.$nextArrow && _.$nextArrow.length) {

            _.$nextArrow.removeClass('slick-disabled slick-arrow slick-hidden').removeAttr('aria-hidden aria-disabled tabindex').css('display', '');

            if (_.htmlExpr.test(_.options.nextArrow)) {
                _.$nextArrow.remove();
            }
        }

        if (_.$slides) {

            _.$slides.removeClass('slick-slide slick-active slick-center slick-visible slick-current').removeAttr('aria-hidden').removeAttr('data-slick-index').each(function () {
                $(this).attr('style', $(this).data('originalStyling'));
            });

            _.$slideTrack.children(this.options.slide).detach();

            _.$slideTrack.detach();

            _.$list.detach();

            _.$slider.append(_.$slides);
        }

        _.cleanUpRows();

        _.$slider.removeClass('slick-slider');
        _.$slider.removeClass('slick-initialized');
        _.$slider.removeClass('slick-dotted');

        _.unslicked = true;

        if (!refresh) {
            _.$slider.trigger('destroy', [_]);
        }
    };

    Slick.prototype.disableTransition = function (slide) {

        var _ = this,
            transition = {};

        transition[_.transitionType] = '';

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }
    };

    Slick.prototype.fadeSlide = function (slideIndex, callback) {

        var _ = this;

        if (_.cssTransitions === false) {

            _.$slides.eq(slideIndex).css({
                zIndex: _.options.zIndex
            });

            _.$slides.eq(slideIndex).animate({
                opacity: 1
            }, _.options.speed, _.options.easing, callback);
        } else {

            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 1,
                zIndex: _.options.zIndex
            });

            if (callback) {
                setTimeout(function () {

                    _.disableTransition(slideIndex);

                    callback.call();
                }, _.options.speed);
            }
        }
    };

    Slick.prototype.fadeSlideOut = function (slideIndex) {

        var _ = this;

        if (_.cssTransitions === false) {

            _.$slides.eq(slideIndex).animate({
                opacity: 0,
                zIndex: _.options.zIndex - 2
            }, _.options.speed, _.options.easing);
        } else {

            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 0,
                zIndex: _.options.zIndex - 2
            });
        }
    };

    Slick.prototype.filterSlides = Slick.prototype.slickFilter = function (filter) {

        var _ = this;

        if (filter !== null) {

            _.$slidesCache = _.$slides;

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.filter(filter).appendTo(_.$slideTrack);

            _.reinit();
        }
    };

    Slick.prototype.focusHandler = function () {

        var _ = this;

        _.$slider.off('focus.slick blur.slick').on('focus.slick blur.slick', '*:not(.slick-arrow)', function (event) {

            event.stopImmediatePropagation();
            var $sf = $(this);

            setTimeout(function () {

                if (_.options.pauseOnFocus) {
                    _.focussed = $sf.is(':focus');
                    _.autoPlay();
                }
            }, 0);
        });
    };

    Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function () {

        var _ = this;
        return _.currentSlide;
    };

    Slick.prototype.getDotCount = function () {

        var _ = this;

        var breakPoint = 0;
        var counter = 0;
        var pagerQty = 0;

        if (_.options.infinite === true) {
            while (breakPoint < _.slideCount) {
                ++pagerQty;
                breakPoint = counter + _.options.slidesToScroll;
                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
            }
        } else if (_.options.centerMode === true) {
            pagerQty = _.slideCount;
        } else if (!_.options.asNavFor) {
            pagerQty = 1 + Math.ceil((_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll);
        } else {
            while (breakPoint < _.slideCount) {
                ++pagerQty;
                breakPoint = counter + _.options.slidesToScroll;
                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
            }
        }

        return pagerQty - 1;
    };

    Slick.prototype.getLeft = function (slideIndex) {

        var _ = this,
            targetLeft,
            verticalHeight,
            verticalOffset = 0,
            targetSlide;

        _.slideOffset = 0;
        verticalHeight = _.$slides.first().outerHeight(true);

        if (_.options.infinite === true) {
            if (_.slideCount > _.options.slidesToShow) {
                _.slideOffset = _.slideWidth * _.options.slidesToShow * -1;
                verticalOffset = verticalHeight * _.options.slidesToShow * -1;
            }
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
                    if (slideIndex > _.slideCount) {
                        _.slideOffset = (_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth * -1;
                        verticalOffset = (_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight * -1;
                    } else {
                        _.slideOffset = _.slideCount % _.options.slidesToScroll * _.slideWidth * -1;
                        verticalOffset = _.slideCount % _.options.slidesToScroll * verticalHeight * -1;
                    }
                }
            }
        } else {
            if (slideIndex + _.options.slidesToShow > _.slideCount) {
                _.slideOffset = (slideIndex + _.options.slidesToShow - _.slideCount) * _.slideWidth;
                verticalOffset = (slideIndex + _.options.slidesToShow - _.slideCount) * verticalHeight;
            }
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.slideOffset = 0;
            verticalOffset = 0;
        }

        if (_.options.centerMode === true && _.options.infinite === true) {
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
        } else if (_.options.centerMode === true) {
            _.slideOffset = 0;
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
        }

        if (_.options.vertical === false) {
            targetLeft = slideIndex * _.slideWidth * -1 + _.slideOffset;
        } else {
            targetLeft = slideIndex * verticalHeight * -1 + verticalOffset;
        }

        if (_.options.variableWidth === true) {

            if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
            } else {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow);
            }

            if (_.options.rtl === true) {
                if (targetSlide[0]) {
                    targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
                } else {
                    targetLeft = 0;
                }
            } else {
                targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
            }

            if (_.options.centerMode === true) {
                if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
                } else {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow + 1);
                }

                if (_.options.rtl === true) {
                    if (targetSlide[0]) {
                        targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
                    } else {
                        targetLeft = 0;
                    }
                } else {
                    targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
                }

                targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
            }
        }

        return targetLeft;
    };

    Slick.prototype.getOption = Slick.prototype.slickGetOption = function (option) {

        var _ = this;

        return _.options[option];
    };

    Slick.prototype.getNavigableIndexes = function () {

        var _ = this,
            breakPoint = 0,
            counter = 0,
            indexes = [],
            max;

        if (_.options.infinite === false) {
            max = _.slideCount;
        } else {
            breakPoint = _.options.slidesToScroll * -1;
            counter = _.options.slidesToScroll * -1;
            max = _.slideCount * 2;
        }

        while (breakPoint < max) {
            indexes.push(breakPoint);
            breakPoint = counter + _.options.slidesToScroll;
            counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
        }

        return indexes;
    };

    Slick.prototype.getSlick = function () {

        return this;
    };

    Slick.prototype.getSlideCount = function () {

        var _ = this,
            slidesTraversed,
            swipedSlide,
            centerOffset;

        centerOffset = _.options.centerMode === true ? _.slideWidth * Math.floor(_.options.slidesToShow / 2) : 0;

        if (_.options.swipeToSlide === true) {
            _.$slideTrack.find('.slick-slide').each(function (index, slide) {
                if (slide.offsetLeft - centerOffset + $(slide).outerWidth() / 2 > _.swipeLeft * -1) {
                    swipedSlide = slide;
                    return false;
                }
            });

            slidesTraversed = Math.abs($(swipedSlide).attr('data-slick-index') - _.currentSlide) || 1;

            return slidesTraversed;
        } else {
            return _.options.slidesToScroll;
        }
    };

    Slick.prototype.goTo = Slick.prototype.slickGoTo = function (slide, dontAnimate) {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'index',
                index: parseInt(slide)
            }
        }, dontAnimate);
    };

    Slick.prototype.init = function (creation) {

        var _ = this;

        if (!$(_.$slider).hasClass('slick-initialized')) {

            $(_.$slider).addClass('slick-initialized');

            _.buildRows();
            _.buildOut();
            _.setProps();
            _.startLoad();
            _.loadSlider();
            _.initializeEvents();
            _.updateArrows();
            _.updateDots();
            _.checkResponsive(true);
            _.focusHandler();
        }

        if (creation) {
            _.$slider.trigger('init', [_]);
        }

        if (_.options.accessibility === true) {
            _.initADA();
        }

        if (_.options.autoplay) {

            _.paused = false;
            _.autoPlay();
        }
    };

    Slick.prototype.initADA = function () {
        var _ = this;
        _.$slides.add(_.$slideTrack.find('.slick-cloned')).attr({
            'aria-hidden': 'true',
            'tabindex': '-1'
        }).find('a, input, button, select').attr({
            'tabindex': '-1'
        });

        _.$slideTrack.attr('role', 'listbox');

        _.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function (i) {
            $(this).attr({
                'role': 'option',
                'aria-describedby': 'slick-slide' + _.instanceUid + i + ''
            });
        });

        if (_.$dots !== null) {
            _.$dots.attr('role', 'tablist').find('li').each(function (i) {
                $(this).attr({
                    'role': 'presentation',
                    'aria-selected': 'false',
                    'aria-controls': 'navigation' + _.instanceUid + i + '',
                    'id': 'slick-slide' + _.instanceUid + i + ''
                });
            }).first().attr('aria-selected', 'true').end().find('button').attr('role', 'button').end().closest('div').attr('role', 'toolbar');
        }
        _.activateADA();
    };

    Slick.prototype.initArrowEvents = function () {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow.off('click.slick').on('click.slick', {
                message: 'previous'
            }, _.changeSlide);
            _.$nextArrow.off('click.slick').on('click.slick', {
                message: 'next'
            }, _.changeSlide);
        }
    };

    Slick.prototype.initDotEvents = function () {

        var _ = this;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
            $('li', _.$dots).on('click.slick', {
                message: 'index'
            }, _.changeSlide);
        }

        if (_.options.dots === true && _.options.pauseOnDotsHover === true) {

            $('li', _.$dots).on('mouseenter.slick', $.proxy(_.interrupt, _, true)).on('mouseleave.slick', $.proxy(_.interrupt, _, false));
        }
    };

    Slick.prototype.initSlideEvents = function () {

        var _ = this;

        if (_.options.pauseOnHover) {

            _.$list.on('mouseenter.slick', $.proxy(_.interrupt, _, true));
            _.$list.on('mouseleave.slick', $.proxy(_.interrupt, _, false));
        }
    };

    Slick.prototype.initializeEvents = function () {

        var _ = this;

        _.initArrowEvents();

        _.initDotEvents();
        _.initSlideEvents();

        _.$list.on('touchstart.slick mousedown.slick', {
            action: 'start'
        }, _.swipeHandler);
        _.$list.on('touchmove.slick mousemove.slick', {
            action: 'move'
        }, _.swipeHandler);
        _.$list.on('touchend.slick mouseup.slick', {
            action: 'end'
        }, _.swipeHandler);
        _.$list.on('touchcancel.slick mouseleave.slick', {
            action: 'end'
        }, _.swipeHandler);

        _.$list.on('click.slick', _.clickHandler);

        $(document).on(_.visibilityChange, $.proxy(_.visibility, _));

        if (_.options.accessibility === true) {
            _.$list.on('keydown.slick', _.keyHandler);
        }

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
        }

        $(window).on('orientationchange.slick.slick-' + _.instanceUid, $.proxy(_.orientationChange, _));

        $(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _));

        $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);

        $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
        $(document).on('ready.slick.slick-' + _.instanceUid, _.setPosition);
    };

    Slick.prototype.initUI = function () {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.show();
            _.$nextArrow.show();
        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.show();
        }
    };

    Slick.prototype.keyHandler = function (event) {

        var _ = this;
        //Dont slide if the cursor is inside the form fields and arrow keys are pressed
        if (!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
            if (event.keyCode === 37 && _.options.accessibility === true) {
                _.changeSlide({
                    data: {
                        message: _.options.rtl === true ? 'next' : 'previous'
                    }
                });
            } else if (event.keyCode === 39 && _.options.accessibility === true) {
                _.changeSlide({
                    data: {
                        message: _.options.rtl === true ? 'previous' : 'next'
                    }
                });
            }
        }
    };

    Slick.prototype.lazyLoad = function () {

        var _ = this,
            loadRange,
            cloneRange,
            rangeStart,
            rangeEnd;

        function loadImages(imagesScope) {

            $('img[data-lazy]', imagesScope).each(function () {

                var image = $(this),
                    imageSource = $(this).attr('data-lazy'),
                    imageToLoad = document.createElement('img');

                imageToLoad.onload = function () {

                    image.animate({ opacity: 0 }, 100, function () {
                        image.attr('src', imageSource).animate({ opacity: 1 }, 200, function () {
                            image.removeAttr('data-lazy').removeClass('slick-loading');
                        });
                        _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
                    });
                };

                imageToLoad.onerror = function () {

                    image.removeAttr('data-lazy').removeClass('slick-loading').addClass('slick-lazyload-error');

                    _.$slider.trigger('lazyLoadError', [_, image, imageSource]);
                };

                imageToLoad.src = imageSource;
            });
        }

        if (_.options.centerMode === true) {
            if (_.options.infinite === true) {
                rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
                rangeEnd = rangeStart + _.options.slidesToShow + 2;
            } else {
                rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));
                rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
            }
        } else {
            rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
            rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);
            if (_.options.fade === true) {
                if (rangeStart > 0) rangeStart--;
                if (rangeEnd <= _.slideCount) rangeEnd++;
            }
        }

        loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);
        loadImages(loadRange);

        if (_.slideCount <= _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-slide');
            loadImages(cloneRange);
        } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);
            loadImages(cloneRange);
        } else if (_.currentSlide === 0) {
            cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);
            loadImages(cloneRange);
        }
    };

    Slick.prototype.loadSlider = function () {

        var _ = this;

        _.setPosition();

        _.$slideTrack.css({
            opacity: 1
        });

        _.$slider.removeClass('slick-loading');

        _.initUI();

        if (_.options.lazyLoad === 'progressive') {
            _.progressiveLazyLoad();
        }
    };

    Slick.prototype.next = Slick.prototype.slickNext = function () {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'next'
            }
        });
    };

    Slick.prototype.orientationChange = function () {

        var _ = this;

        _.checkResponsive();
        _.setPosition();
    };

    Slick.prototype.pause = Slick.prototype.slickPause = function () {

        var _ = this;

        _.autoPlayClear();
        _.paused = true;
    };

    Slick.prototype.play = Slick.prototype.slickPlay = function () {

        var _ = this;

        _.autoPlay();
        _.options.autoplay = true;
        _.paused = false;
        _.focussed = false;
        _.interrupted = false;
    };

    Slick.prototype.postSlide = function (index) {

        var _ = this;

        if (!_.unslicked) {

            _.$slider.trigger('afterChange', [_, index]);

            _.animating = false;

            _.setPosition();

            _.swipeLeft = null;

            if (_.options.autoplay) {
                _.autoPlay();
            }

            if (_.options.accessibility === true) {
                _.initADA();
            }
        }
    };

    Slick.prototype.prev = Slick.prototype.slickPrev = function () {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'previous'
            }
        });
    };

    Slick.prototype.preventDefault = function (event) {

        event.preventDefault();
    };

    Slick.prototype.progressiveLazyLoad = function (tryCount) {

        tryCount = tryCount || 1;

        var _ = this,
            $imgsToLoad = $('img[data-lazy]', _.$slider),
            image,
            imageSource,
            imageToLoad;

        if ($imgsToLoad.length) {

            image = $imgsToLoad.first();
            imageSource = image.attr('data-lazy');
            imageToLoad = document.createElement('img');

            imageToLoad.onload = function () {

                image.attr('src', imageSource).removeAttr('data-lazy').removeClass('slick-loading');

                if (_.options.adaptiveHeight === true) {
                    _.setPosition();
                }

                _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
                _.progressiveLazyLoad();
            };

            imageToLoad.onerror = function () {

                if (tryCount < 3) {

                    /**
                     * try to load the image 3 times,
                     * leave a slight delay so we don't get
                     * servers blocking the request.
                     */
                    setTimeout(function () {
                        _.progressiveLazyLoad(tryCount + 1);
                    }, 500);
                } else {

                    image.removeAttr('data-lazy').removeClass('slick-loading').addClass('slick-lazyload-error');

                    _.$slider.trigger('lazyLoadError', [_, image, imageSource]);

                    _.progressiveLazyLoad();
                }
            };

            imageToLoad.src = imageSource;
        } else {

            _.$slider.trigger('allImagesLoaded', [_]);
        }
    };

    Slick.prototype.refresh = function (initializing) {

        var _ = this,
            currentSlide,
            lastVisibleIndex;

        lastVisibleIndex = _.slideCount - _.options.slidesToShow;

        // in non-infinite sliders, we don't want to go past the
        // last visible index.
        if (!_.options.infinite && _.currentSlide > lastVisibleIndex) {
            _.currentSlide = lastVisibleIndex;
        }

        // if less slides than to show, go to start.
        if (_.slideCount <= _.options.slidesToShow) {
            _.currentSlide = 0;
        }

        currentSlide = _.currentSlide;

        _.destroy(true);

        $.extend(_, _.initials, { currentSlide: currentSlide });

        _.init();

        if (!initializing) {

            _.changeSlide({
                data: {
                    message: 'index',
                    index: currentSlide
                }
            }, false);
        }
    };

    Slick.prototype.registerBreakpoints = function () {

        var _ = this,
            breakpoint,
            currentBreakpoint,
            l,
            responsiveSettings = _.options.responsive || null;

        if ($.type(responsiveSettings) === 'array' && responsiveSettings.length) {

            _.respondTo = _.options.respondTo || 'window';

            for (breakpoint in responsiveSettings) {

                l = _.breakpoints.length - 1;
                currentBreakpoint = responsiveSettings[breakpoint].breakpoint;

                if (responsiveSettings.hasOwnProperty(breakpoint)) {

                    // loop through the breakpoints and cut out any existing
                    // ones with the same breakpoint number, we don't want dupes.
                    while (l >= 0) {
                        if (_.breakpoints[l] && _.breakpoints[l] === currentBreakpoint) {
                            _.breakpoints.splice(l, 1);
                        }
                        l--;
                    }

                    _.breakpoints.push(currentBreakpoint);
                    _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;
                }
            }

            _.breakpoints.sort(function (a, b) {
                return _.options.mobileFirst ? a - b : b - a;
            });
        }
    };

    Slick.prototype.reinit = function () {

        var _ = this;

        _.$slides = _.$slideTrack.children(_.options.slide).addClass('slick-slide');

        _.slideCount = _.$slides.length;

        if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
            _.currentSlide = _.currentSlide - _.options.slidesToScroll;
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.currentSlide = 0;
        }

        _.registerBreakpoints();

        _.setProps();
        _.setupInfinite();
        _.buildArrows();
        _.updateArrows();
        _.initArrowEvents();
        _.buildDots();
        _.updateDots();
        _.initDotEvents();
        _.cleanUpSlideEvents();
        _.initSlideEvents();

        _.checkResponsive(false, true);

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
        }

        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

        _.setPosition();
        _.focusHandler();

        _.paused = !_.options.autoplay;
        _.autoPlay();

        _.$slider.trigger('reInit', [_]);
    };

    Slick.prototype.resize = function () {

        var _ = this;

        if ($(window).width() !== _.windowWidth) {
            clearTimeout(_.windowDelay);
            _.windowDelay = window.setTimeout(function () {
                _.windowWidth = $(window).width();
                _.checkResponsive();
                if (!_.unslicked) {
                    _.setPosition();
                }
            }, 50);
        }
    };

    Slick.prototype.removeSlide = Slick.prototype.slickRemove = function (index, removeBefore, removeAll) {

        var _ = this;

        if (typeof index === 'boolean') {
            removeBefore = index;
            index = removeBefore === true ? 0 : _.slideCount - 1;
        } else {
            index = removeBefore === true ? --index : index;
        }

        if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
            return false;
        }

        _.unload();

        if (removeAll === true) {
            _.$slideTrack.children().remove();
        } else {
            _.$slideTrack.children(this.options.slide).eq(index).remove();
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slidesCache = _.$slides;

        _.reinit();
    };

    Slick.prototype.setCSS = function (position) {

        var _ = this,
            positionProps = {},
            x,
            y;

        if (_.options.rtl === true) {
            position = -position;
        }
        x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';
        y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';

        positionProps[_.positionProp] = position;

        if (_.transformsEnabled === false) {
            _.$slideTrack.css(positionProps);
        } else {
            positionProps = {};
            if (_.cssTransitions === false) {
                positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';
                _.$slideTrack.css(positionProps);
            } else {
                positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';
                _.$slideTrack.css(positionProps);
            }
        }
    };

    Slick.prototype.setDimensions = function () {

        var _ = this;

        if (_.options.vertical === false) {
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: '0px ' + _.options.centerPadding
                });
            }
        } else {
            _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: _.options.centerPadding + ' 0px'
                });
            }
        }

        _.listWidth = _.$list.width();
        _.listHeight = _.$list.height();

        if (_.options.vertical === false && _.options.variableWidth === false) {
            _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
            _.$slideTrack.width(Math.ceil(_.slideWidth * _.$slideTrack.children('.slick-slide').length));
        } else if (_.options.variableWidth === true) {
            _.$slideTrack.width(5000 * _.slideCount);
        } else {
            _.slideWidth = Math.ceil(_.listWidth);
            _.$slideTrack.height(Math.ceil(_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length));
        }

        var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();
        if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);
    };

    Slick.prototype.setFade = function () {

        var _ = this,
            targetLeft;

        _.$slides.each(function (index, element) {
            targetLeft = _.slideWidth * index * -1;
            if (_.options.rtl === true) {
                $(element).css({
                    position: 'relative',
                    right: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0
                });
            } else {
                $(element).css({
                    position: 'relative',
                    left: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0
                });
            }
        });

        _.$slides.eq(_.currentSlide).css({
            zIndex: _.options.zIndex - 1,
            opacity: 1
        });
    };

    Slick.prototype.setHeight = function () {

        var _ = this;

        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.css('height', targetHeight);
        }
    };

    Slick.prototype.setOption = Slick.prototype.slickSetOption = function () {

        /**
         * accepts arguments in format of:
         *
         *  - for changing a single option's value:
         *     .slick("setOption", option, value, refresh )
         *
         *  - for changing a set of responsive options:
         *     .slick("setOption", 'responsive', [{}, ...], refresh )
         *
         *  - for updating multiple values at once (not responsive)
         *     .slick("setOption", { 'option': value, ... }, refresh )
         */

        var _ = this,
            l,
            item,
            option,
            value,
            refresh = false,
            type;

        if ($.type(arguments[0]) === 'object') {

            option = arguments[0];
            refresh = arguments[1];
            type = 'multiple';
        } else if ($.type(arguments[0]) === 'string') {

            option = arguments[0];
            value = arguments[1];
            refresh = arguments[2];

            if (arguments[0] === 'responsive' && $.type(arguments[1]) === 'array') {

                type = 'responsive';
            } else if (typeof arguments[1] !== 'undefined') {

                type = 'single';
            }
        }

        if (type === 'single') {

            _.options[option] = value;
        } else if (type === 'multiple') {

            $.each(option, function (opt, val) {

                _.options[opt] = val;
            });
        } else if (type === 'responsive') {

            for (item in value) {

                if ($.type(_.options.responsive) !== 'array') {

                    _.options.responsive = [value[item]];
                } else {

                    l = _.options.responsive.length - 1;

                    // loop through the responsive object and splice out duplicates.
                    while (l >= 0) {

                        if (_.options.responsive[l].breakpoint === value[item].breakpoint) {

                            _.options.responsive.splice(l, 1);
                        }

                        l--;
                    }

                    _.options.responsive.push(value[item]);
                }
            }
        }

        if (refresh) {

            _.unload();
            _.reinit();
        }
    };

    Slick.prototype.setPosition = function () {

        var _ = this;

        _.setDimensions();

        _.setHeight();

        if (_.options.fade === false) {
            _.setCSS(_.getLeft(_.currentSlide));
        } else {
            _.setFade();
        }

        _.$slider.trigger('setPosition', [_]);
    };

    Slick.prototype.setProps = function () {

        var _ = this,
            bodyStyle = document.body.style;

        _.positionProp = _.options.vertical === true ? 'top' : 'left';

        if (_.positionProp === 'top') {
            _.$slider.addClass('slick-vertical');
        } else {
            _.$slider.removeClass('slick-vertical');
        }

        if (bodyStyle.WebkitTransition !== undefined || bodyStyle.MozTransition !== undefined || bodyStyle.msTransition !== undefined) {
            if (_.options.useCSS === true) {
                _.cssTransitions = true;
            }
        }

        if (_.options.fade) {
            if (typeof _.options.zIndex === 'number') {
                if (_.options.zIndex < 3) {
                    _.options.zIndex = 3;
                }
            } else {
                _.options.zIndex = _.defaults.zIndex;
            }
        }

        if (bodyStyle.OTransform !== undefined) {
            _.animType = 'OTransform';
            _.transformType = '-o-transform';
            _.transitionType = 'OTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.MozTransform !== undefined) {
            _.animType = 'MozTransform';
            _.transformType = '-moz-transform';
            _.transitionType = 'MozTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.webkitTransform !== undefined) {
            _.animType = 'webkitTransform';
            _.transformType = '-webkit-transform';
            _.transitionType = 'webkitTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.msTransform !== undefined) {
            _.animType = 'msTransform';
            _.transformType = '-ms-transform';
            _.transitionType = 'msTransition';
            if (bodyStyle.msTransform === undefined) _.animType = false;
        }
        if (bodyStyle.transform !== undefined && _.animType !== false) {
            _.animType = 'transform';
            _.transformType = 'transform';
            _.transitionType = 'transition';
        }
        _.transformsEnabled = _.options.useTransform && _.animType !== null && _.animType !== false;
    };

    Slick.prototype.setSlideClasses = function (index) {

        var _ = this,
            centerOffset,
            allSlides,
            indexOffset,
            remainder;

        allSlides = _.$slider.find('.slick-slide').removeClass('slick-active slick-center slick-current').attr('aria-hidden', 'true');

        _.$slides.eq(index).addClass('slick-current');

        if (_.options.centerMode === true) {

            centerOffset = Math.floor(_.options.slidesToShow / 2);

            if (_.options.infinite === true) {

                if (index >= centerOffset && index <= _.slideCount - 1 - centerOffset) {

                    _.$slides.slice(index - centerOffset, index + centerOffset + 1).addClass('slick-active').attr('aria-hidden', 'false');
                } else {

                    indexOffset = _.options.slidesToShow + index;
                    allSlides.slice(indexOffset - centerOffset + 1, indexOffset + centerOffset + 2).addClass('slick-active').attr('aria-hidden', 'false');
                }

                if (index === 0) {

                    allSlides.eq(allSlides.length - 1 - _.options.slidesToShow).addClass('slick-center');
                } else if (index === _.slideCount - 1) {

                    allSlides.eq(_.options.slidesToShow).addClass('slick-center');
                }
            }

            _.$slides.eq(index).addClass('slick-center');
        } else {

            if (index >= 0 && index <= _.slideCount - _.options.slidesToShow) {

                _.$slides.slice(index, index + _.options.slidesToShow).addClass('slick-active').attr('aria-hidden', 'false');
            } else if (allSlides.length <= _.options.slidesToShow) {

                allSlides.addClass('slick-active').attr('aria-hidden', 'false');
            } else {

                remainder = _.slideCount % _.options.slidesToShow;
                indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;

                if (_.options.slidesToShow == _.options.slidesToScroll && _.slideCount - index < _.options.slidesToShow) {

                    allSlides.slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder).addClass('slick-active').attr('aria-hidden', 'false');
                } else {

                    allSlides.slice(indexOffset, indexOffset + _.options.slidesToShow).addClass('slick-active').attr('aria-hidden', 'false');
                }
            }
        }

        if (_.options.lazyLoad === 'ondemand') {
            _.lazyLoad();
        }
    };

    Slick.prototype.setupInfinite = function () {

        var _ = this,
            i,
            slideIndex,
            infiniteCount;

        if (_.options.fade === true) {
            _.options.centerMode = false;
        }

        if (_.options.infinite === true && _.options.fade === false) {

            slideIndex = null;

            if (_.slideCount > _.options.slidesToShow) {

                if (_.options.centerMode === true) {
                    infiniteCount = _.options.slidesToShow + 1;
                } else {
                    infiniteCount = _.options.slidesToShow;
                }

                for (i = _.slideCount; i > _.slideCount - infiniteCount; i -= 1) {
                    slideIndex = i - 1;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '').attr('data-slick-index', slideIndex - _.slideCount).prependTo(_.$slideTrack).addClass('slick-cloned');
                }
                for (i = 0; i < infiniteCount; i += 1) {
                    slideIndex = i;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '').attr('data-slick-index', slideIndex + _.slideCount).appendTo(_.$slideTrack).addClass('slick-cloned');
                }
                _.$slideTrack.find('.slick-cloned').find('[id]').each(function () {
                    $(this).attr('id', '');
                });
            }
        }
    };

    Slick.prototype.interrupt = function (toggle) {

        var _ = this;

        if (!toggle) {
            _.autoPlay();
        }
        _.interrupted = toggle;
    };

    Slick.prototype.selectHandler = function (event) {

        var _ = this;

        var targetElement = $(event.target).is('.slick-slide') ? $(event.target) : $(event.target).parents('.slick-slide');

        var index = parseInt(targetElement.attr('data-slick-index'));

        if (!index) index = 0;

        if (_.slideCount <= _.options.slidesToShow) {

            _.setSlideClasses(index);
            _.asNavFor(index);
            return;
        }

        _.slideHandler(index);
    };

    Slick.prototype.slideHandler = function (index, sync, dontAnimate) {

        var targetSlide,
            animSlide,
            oldSlide,
            slideLeft,
            targetLeft = null,
            _ = this,
            navTarget;

        sync = sync || false;

        if (_.animating === true && _.options.waitForAnimate === true) {
            return;
        }

        if (_.options.fade === true && _.currentSlide === index) {
            return;
        }

        if (_.slideCount <= _.options.slidesToShow) {
            return;
        }

        if (sync === false) {
            _.asNavFor(index);
        }

        targetSlide = index;
        targetLeft = _.getLeft(targetSlide);
        slideLeft = _.getLeft(_.currentSlide);

        _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;

        if (_.options.infinite === false && _.options.centerMode === false && (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true) {
                    _.animateSlide(slideLeft, function () {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        } else if (_.options.infinite === false && _.options.centerMode === true && (index < 0 || index > _.slideCount - _.options.slidesToScroll)) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true) {
                    _.animateSlide(slideLeft, function () {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        }

        if (_.options.autoplay) {
            clearInterval(_.autoPlayTimer);
        }

        if (targetSlide < 0) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = _.slideCount - _.slideCount % _.options.slidesToScroll;
            } else {
                animSlide = _.slideCount + targetSlide;
            }
        } else if (targetSlide >= _.slideCount) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = 0;
            } else {
                animSlide = targetSlide - _.slideCount;
            }
        } else {
            animSlide = targetSlide;
        }

        _.animating = true;

        _.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide]);

        oldSlide = _.currentSlide;
        _.currentSlide = animSlide;

        _.setSlideClasses(_.currentSlide);

        if (_.options.asNavFor) {

            navTarget = _.getNavTarget();
            navTarget = navTarget.slick('getSlick');

            if (navTarget.slideCount <= navTarget.options.slidesToShow) {
                navTarget.setSlideClasses(_.currentSlide);
            }
        }

        _.updateDots();
        _.updateArrows();

        if (_.options.fade === true) {
            if (dontAnimate !== true) {

                _.fadeSlideOut(oldSlide);

                _.fadeSlide(animSlide, function () {
                    _.postSlide(animSlide);
                });
            } else {
                _.postSlide(animSlide);
            }
            _.animateHeight();
            return;
        }

        if (dontAnimate !== true) {
            _.animateSlide(targetLeft, function () {
                _.postSlide(animSlide);
            });
        } else {
            _.postSlide(animSlide);
        }
    };

    Slick.prototype.startLoad = function () {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.hide();
            _.$nextArrow.hide();
        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.hide();
        }

        _.$slider.addClass('slick-loading');
    };

    Slick.prototype.swipeDirection = function () {

        var xDist,
            yDist,
            r,
            swipeAngle,
            _ = this;

        xDist = _.touchObject.startX - _.touchObject.curX;
        yDist = _.touchObject.startY - _.touchObject.curY;
        r = Math.atan2(yDist, xDist);

        swipeAngle = Math.round(r * 180 / Math.PI);
        if (swipeAngle < 0) {
            swipeAngle = 360 - Math.abs(swipeAngle);
        }

        if (swipeAngle <= 45 && swipeAngle >= 0) {
            return _.options.rtl === false ? 'left' : 'right';
        }
        if (swipeAngle <= 360 && swipeAngle >= 315) {
            return _.options.rtl === false ? 'left' : 'right';
        }
        if (swipeAngle >= 135 && swipeAngle <= 225) {
            return _.options.rtl === false ? 'right' : 'left';
        }
        if (_.options.verticalSwiping === true) {
            if (swipeAngle >= 35 && swipeAngle <= 135) {
                return 'down';
            } else {
                return 'up';
            }
        }

        return 'vertical';
    };

    Slick.prototype.swipeEnd = function (event) {

        var _ = this,
            slideCount,
            direction;

        _.dragging = false;
        _.interrupted = false;
        _.shouldClick = _.touchObject.swipeLength > 10 ? false : true;

        if (_.touchObject.curX === undefined) {
            return false;
        }

        if (_.touchObject.edgeHit === true) {
            _.$slider.trigger('edge', [_, _.swipeDirection()]);
        }

        if (_.touchObject.swipeLength >= _.touchObject.minSwipe) {

            direction = _.swipeDirection();

            switch (direction) {

                case 'left':
                case 'down':

                    slideCount = _.options.swipeToSlide ? _.checkNavigable(_.currentSlide + _.getSlideCount()) : _.currentSlide + _.getSlideCount();

                    _.currentDirection = 0;

                    break;

                case 'right':
                case 'up':

                    slideCount = _.options.swipeToSlide ? _.checkNavigable(_.currentSlide - _.getSlideCount()) : _.currentSlide - _.getSlideCount();

                    _.currentDirection = 1;

                    break;

                default:

            }

            if (direction != 'vertical') {

                _.slideHandler(slideCount);
                _.touchObject = {};
                _.$slider.trigger('swipe', [_, direction]);
            }
        } else {

            if (_.touchObject.startX !== _.touchObject.curX) {

                _.slideHandler(_.currentSlide);
                _.touchObject = {};
            }
        }
    };

    Slick.prototype.swipeHandler = function (event) {

        var _ = this;

        if (_.options.swipe === false || 'ontouchend' in document && _.options.swipe === false) {
            return;
        } else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {
            return;
        }

        _.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ? event.originalEvent.touches.length : 1;

        _.touchObject.minSwipe = _.listWidth / _.options.touchThreshold;

        if (_.options.verticalSwiping === true) {
            _.touchObject.minSwipe = _.listHeight / _.options.touchThreshold;
        }

        switch (event.data.action) {

            case 'start':
                _.swipeStart(event);
                break;

            case 'move':
                _.swipeMove(event);
                break;

            case 'end':
                _.swipeEnd(event);
                break;

        }
    };

    Slick.prototype.swipeMove = function (event) {

        var _ = this,
            edgeWasHit = false,
            curLeft,
            swipeDirection,
            swipeLength,
            positionOffset,
            touches;

        touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

        if (!_.dragging || touches && touches.length !== 1) {
            return false;
        }

        curLeft = _.getLeft(_.currentSlide);

        _.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
        _.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;

        _.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));

        if (_.options.verticalSwiping === true) {
            _.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(_.touchObject.curY - _.touchObject.startY, 2)));
        }

        swipeDirection = _.swipeDirection();

        if (swipeDirection === 'vertical') {
            return;
        }

        if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
            event.preventDefault();
        }

        positionOffset = (_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1);
        if (_.options.verticalSwiping === true) {
            positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
        }

        swipeLength = _.touchObject.swipeLength;

        _.touchObject.edgeHit = false;

        if (_.options.infinite === false) {
            if (_.currentSlide === 0 && swipeDirection === 'right' || _.currentSlide >= _.getDotCount() && swipeDirection === 'left') {
                swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;
                _.touchObject.edgeHit = true;
            }
        }

        if (_.options.vertical === false) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        } else {
            _.swipeLeft = curLeft + swipeLength * (_.$list.height() / _.listWidth) * positionOffset;
        }
        if (_.options.verticalSwiping === true) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        }

        if (_.options.fade === true || _.options.touchMove === false) {
            return false;
        }

        if (_.animating === true) {
            _.swipeLeft = null;
            return false;
        }

        _.setCSS(_.swipeLeft);
    };

    Slick.prototype.swipeStart = function (event) {

        var _ = this,
            touches;

        _.interrupted = true;

        if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
            _.touchObject = {};
            return false;
        }

        if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
            touches = event.originalEvent.touches[0];
        }

        _.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
        _.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;

        _.dragging = true;
    };

    Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function () {

        var _ = this;

        if (_.$slidesCache !== null) {

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.appendTo(_.$slideTrack);

            _.reinit();
        }
    };

    Slick.prototype.unload = function () {

        var _ = this;

        $('.slick-cloned', _.$slider).remove();

        if (_.$dots) {
            _.$dots.remove();
        }

        if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
            _.$prevArrow.remove();
        }

        if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
            _.$nextArrow.remove();
        }

        _.$slides.removeClass('slick-slide slick-active slick-visible slick-current').attr('aria-hidden', 'true').css('width', '');
    };

    Slick.prototype.unslick = function (fromBreakpoint) {

        var _ = this;
        _.$slider.trigger('unslick', [_, fromBreakpoint]);
        _.destroy();
    };

    Slick.prototype.updateArrows = function () {

        var _ = this,
            centerOffset;

        centerOffset = Math.floor(_.options.slidesToShow / 2);

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow && !_.options.infinite) {

            _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
            _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            if (_.currentSlide === 0) {

                _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
            } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {

                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
            } else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {

                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
            }
        }
    };

    Slick.prototype.updateDots = function () {

        var _ = this;

        if (_.$dots !== null) {

            _.$dots.find('li').removeClass('slick-active').attr('aria-hidden', 'true');

            _.$dots.find('li').eq(Math.floor(_.currentSlide / _.options.slidesToScroll)).addClass('slick-active').attr('aria-hidden', 'false');
        }
    };

    Slick.prototype.visibility = function () {

        var _ = this;

        if (_.options.autoplay) {

            if (document[_.hidden]) {

                _.interrupted = true;
            } else {

                _.interrupted = false;
            }
        }
    };

    $.fn.slick = function () {
        var _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i,
            ret;
        for (i = 0; i < l; i++) {
            if ((typeof opt === 'undefined' ? 'undefined' : _typeof(opt)) == 'object' || typeof opt == 'undefined') _[i].slick = new Slick(_[i], opt);else ret = _[i].slick[opt].apply(_[i].slick, args);
            if (typeof ret != 'undefined') return ret;
        }
        return _;
    };
});

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  init: function init() {
    this.projectVideoEmbed();
  },
  projectVideoEmbed: function projectVideoEmbed() {
    $.getScript('http://www.youtube.com/iframe_api').done(function () {
      function onPlayerStateChange(event) {
        switch (event.data) {
          case YT.PlayerState.ENDED:
            // console.log('Video has ended.');
            break;
          case YT.PlayerState.PLAYING:
            // console.log('Video is playing.');
            break;
          case YT.PlayerState.PAUSED:
            // console.log('Video is paused.');
            break;
          case YT.PlayerState.BUFFERING:
            // console.log('Video is buffering.');
            break;
          case YT.PlayerState.CUED:
            // console.log('Video is cued.');
            break;
        }
      }

      $('.video-wrap .overlay').on('click', function () {
        var vidId = $(this).attr('data-id');
        $(this).addClass('hidden');
        $(this).parent().find('.iframe-box').html('<iframe id="player_' + vidId + '" width="420" height="315" src="http://www.youtube.com/embed/' + vidId + '?enablejsapi=1&autoplay=1&autohide=1&showinfo=0" frameborder="0" allowfullscreen></iframe>');

        new YT.Player('player_' + vidId, {
          events: {
            'onStateChange': onPlayerStateChange
          }
        });
      });
    });
  }
};

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
// import '../libs/jquery.validate.js';

// (function($) {
//     $.fn.formSubmit = function() {
//         $(this).each(function() {
//             var that = this;
//             $(this).validate({
//                 rules: {
//                     name: "required",
//                     message: "required",
//                     text: "required",
//                     email: {
//                         required: true,
//                         email: true
//                     }
//                 },
//                 messages: {
//                     name: formValidateSettings.name,
//                     message: formValidateSettings.messageEmpty,
//                     text: formValidateSettings.textEmpty,
//                     email: {
//                         required: formValidateSettings.emailEmpty,
//                         email: formValidateSettings.emailIncorrect
//                     }
//                 },

//                 submitHandler: function submitHandler(form, e) {
//                     e.preventDefault();
//                     var $form = $(that);
//                         $.ajax({
//                             type: $form.attr('method'),
//                             url: $form.attr('action'),
//                             dataType: 'json',
//                             data: $form.serialize()
//                         }).done(function (data) {
//                             if(data.title === undefined) data.title = '';
//                             if(data.message === undefined) data.message = '';
//                             if (data.success == true) {
//                                 $form.hide(200);
//                                 $form[0].reset();

//                                 var formSuccess = $('<div></div>').addClass('form-success');
//                                 formSuccess.html('<div class="state-icon"></div> <div class="form-title">' + data.title + '</div> <div class="form-descr">' + data.message + '</div>');
//                                 $form.parent().append(formSuccess);

//                                 setTimeout(function () {
//                                     $form.parent().find('.form-success').show(200);
//                                 }, 200);

//                                 setTimeout(function () {
//                                     $form.parent().find('.form-success').hide(200);
//                                 }, 3000);

//                                 setTimeout(function () {
//                                     $form.parent().find('.form-success').remove();
//                                     $form.parent().find('.form-success');
//                                     $form.show(200);
//                                 }, 3200);
//                             } else {
//                                 $form.hide(200);

//                                 var formError = $('<div></div>').addClass('form-error');
//                                 formError.html('<div class="state-icon"></div> <div class="form-title">' + data.title + '</div> <div class="form-descr">' + data.message + '</div><a href="#" class="btn">' + formValidateSettings.send_again + '</a>');
//                                 $form.parent().append(formError);

//                                 setTimeout(function () {
//                                     $form.parent().find('.form-error').show(200);
//                                 }, 200);

//                                 $form.parent().find('.form-error').find('a').on('click', function (e) {
//                                     e.preventDefault();
//                                     $form.parent().find('.form-error').hide(200);

//                                     setTimeout(function () {
//                                         $form.parent().find('.form-error').remove();
//                                         $form.show(200);
//                                     }, 200);
//                                 });
//                             }
//                         }).fail(function () {
//                             $form.hide(200);

//                             var formError = $('<div></div>').addClass('form-error');
//                             formError.html('<div class="state-icon"></div> <div class="form-title">' + formValidateSettings.send_error_title + '</div> <div class="form-descr">' + formValidateSettings.send_error_message + '</div> <a href="#" class="btn">' + formValidateSettings.send_again + '</a>');
//                             $form.parent().append(formError);

//                             setTimeout(function () {
//                                 $form.parent().find('.form-error').show(200);
//                             }, 200);

//                             $form.parent().find('.form-error').find('a').on('click', function (e) {
//                                 e.preventDefault();
//                                 $form.parent().find('.form-error').hide(200);

//                                 setTimeout(function () {
//                                     $form.parent().find('.form-error').remove();
//                                     $form.show(200);
//                                 }, 200);
//                             });
//                         });

//                 }
//             });
//         })
//     }
// })(jQuery);

exports.default = {
    init: function init() {
        this.validation();
    },
    validation: function validation() {
        // $('form').formSubmit();

        $(".mat-input").focus(function () {
            $(this).parent().addClass("is-active is-completed");
        });

        $(".mat-input").focusout(function () {
            if ($(this).val() === "") $(this).parent().removeClass("is-completed");
            $(this).parent().removeClass("is-active");
        });
    }
};

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _select = require('../libs/select2.js');

var _select2 = _interopRequireDefault(_select);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    init: function init() {
        this.headerFunctions();
    },
    headerFunctions: function headerFunctions() {

        $(document).on('click', function () {
            $('.menu-button').removeClass('active');
            $('.site-nav').slideUp('active');
        });

        $('.menu-button').on('click', function (e) {
            e.stopPropagation();
            $(this).toggleClass('active');
            $('.site-nav').slideToggle('active').toggleClass('active');
        });

        $('.site-nav').on('click', function (e) {
            e.stopPropagation();
        });

        function formatState(state) {
            if (!state.id) {
                return state.text;
            }
            console.log(state.element.value.split('_')[0].toLowerCase());
            var $state = $('<span><img class="contextChange" src= "../images/flags/' + state.element.value.split('_')[0].toLowerCase() + '.png" class="img-flag" /> ' + state.text + '</span>');
            return $state;
        }

        $(".lang").select2({
            // templateResult: formatState,
            // templateSelection: formatState,
            minimumResultsForSearch: Infinity
        });

        // $('.lang').on("select2:select", function(e){
        //     console.log(e.params);
        //     window.location.replace(e.params.data.id.split('_')[1]);
        // });
    }
};

},{"../libs/select2.js":2}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
		value: true
});
exports.default = {
		init: function init() {
				this.initMap();
		},
		initMap: function initMap() {

				$.getScript("http://maps.google.com/maps/api/js?key=AIzaSyC1mu5p7L3KMHnWQXTk4LTWR3BSiaQtdW8&sensor=true").done(function () {
						var mapId = $('#map');
						var dataLat = parseFloat(mapId.attr('data-lat'));
						var dataLng = parseFloat(mapId.attr('data-lng'));
						var center = { lat: dataLat, lng: dataLng };

						var map = new google.maps.Map(document.getElementById("map"), {
								zoom: 16,
								center: center,
								scrollwheel: false,
								draggable: true,
								zoomControl: true,
								zoomControlOptions: {
										position: google.maps.ControlPosition.TOP_RIGHT
								},
								panControl: false,
								mapTypeControl: false,
								streetViewControl: false
						});

						var marker = new google.maps.Marker({
								position: center,
								map: map,
								icon: $('#map').attr('data-pin'),
								title: "my place"
						});
				});
		}
};

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../libs/slick');

exports.default = {
  init: function init() {
    this.headerSlider();
    this.homeProjectSlider();
    this.homeVerticalSlider();
    this.centeredSlider();
    this.doubleSlider();
  },
  headerSlider: function headerSlider() {
    $('.site-header_slider').slick({
      dots: true,
      arrows: false
    });
  },
  homeProjectSlider: function homeProjectSlider() {
    $('.projects-slider').slick({
      centerMode: true,
      responsive: [{
        breakpoint: 1023,
        settings: {
          centerMode: false
        }
      }]
    });

    $('.projects-slider-info .b-info_item').eq(0).addClass('active');

    $('.projects-slider').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
      $('.projects-slider-info .b-info_item').removeClass('active');

      if ($('.projects-slider-info .b-info_item').eq(nextSlide).length != 0) {
        $('.projects-slider-info .b-info_item').eq(nextSlide).addClass('active');
      }
    });
  },
  homeVerticalSlider: function homeVerticalSlider() {
    $('.home-verical-slider').slick({
      dots: true
    });
  },
  centeredSlider: function centeredSlider() {
    $('.center-slider').slick({
      centerMode: true,
      slidesToShow: 3,
      responsive: [{
        breakpoint: 1023,
        settings: {
          centerMode: false,
          slidesToShow: 1
        }
      }]
    });
  },
  doubleSlider: function doubleSlider() {
    $('.double-slider').slick({
      centerMode: true,
      slidesToShow: 2,
      centerPadding: '80px',
      responsive: [{
        breakpoint: 1023,
        settings: {
          centerMode: false,
          slidesToShow: 1,
          centerPadding: '0px'
        }
      }]
    });
  }
};

},{"../libs/slick":3}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _headerFunctions = require("../modules/headerFunctions");

var _headerFunctions2 = _interopRequireDefault(_headerFunctions);

var _sliders = require("../modules/sliders.js");

var _sliders2 = _interopRequireDefault(_sliders);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    init: function init() {
        _headerFunctions2.default.init();
        _sliders2.default.init();
    }
};

},{"../modules/headerFunctions":6,"../modules/sliders.js":8}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _headerFunctions = require("../modules/headerFunctions");

var _headerFunctions2 = _interopRequireDefault(_headerFunctions);

var _sliders = require("../modules/sliders.js");

var _sliders2 = _interopRequireDefault(_sliders);

var _formFunctions = require("../modules/formFunctions");

var _formFunctions2 = _interopRequireDefault(_formFunctions);

var _map = require("../modules/map.js");

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    init: function init() {
        _headerFunctions2.default.init();
        _sliders2.default.init();
        _map2.default.init();
        _formFunctions2.default.init();
    }
};

},{"../modules/formFunctions":5,"../modules/headerFunctions":6,"../modules/map.js":7,"../modules/sliders.js":8}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _headerFunctions = require("../modules/headerFunctions");

var _headerFunctions2 = _interopRequireDefault(_headerFunctions);

var _formFunctions = require("../modules/formFunctions");

var _formFunctions2 = _interopRequireDefault(_formFunctions);

var _sliders = require("../modules/sliders.js");

var _sliders2 = _interopRequireDefault(_sliders);

var _map = require("../modules/map.js");

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    init: function init() {
        _headerFunctions2.default.init();
        _sliders2.default.init();
        // MapInit.init();
        _formFunctions2.default.init();
    }
};

},{"../modules/formFunctions":5,"../modules/headerFunctions":6,"../modules/map.js":7,"../modules/sliders.js":8}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _headerFunctions = require("../modules/headerFunctions");

var _headerFunctions2 = _interopRequireDefault(_headerFunctions);

var _sliders = require("../modules/sliders.js");

var _sliders2 = _interopRequireDefault(_sliders);

var _YTembed = require("../modules/YTembed.js");

var _YTembed2 = _interopRequireDefault(_YTembed);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    init: function init() {
        _headerFunctions2.default.init();
        _sliders2.default.init();
        _YTembed2.default.init();
    }
};

},{"../modules/YTembed.js":4,"../modules/headerFunctions":6,"../modules/sliders.js":8}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvZ2xvYmFsLmpzIiwiYXNzZXRzL2pzL2xpYnMvc2VsZWN0Mi5qcyIsImFzc2V0cy9qcy9saWJzL3NsaWNrLmpzIiwiYXNzZXRzL2pzL21vZHVsZXMvWVRlbWJlZC5qcyIsImFzc2V0cy9qcy9tb2R1bGVzL2Zvcm1GdW5jdGlvbnMuanMiLCJhc3NldHMvanMvbW9kdWxlcy9oZWFkZXJGdW5jdGlvbnMuanMiLCJhc3NldHMvanMvbW9kdWxlcy9tYXAuanMiLCJhc3NldHMvanMvbW9kdWxlcy9zbGlkZXJzLmpzIiwiYXNzZXRzL2pzL3BhZ2VzL0NPTU1PTi5qcyIsImFzc2V0cy9qcy9wYWdlcy9DT05UQUNUUy5qcyIsImFzc2V0cy9qcy9wYWdlcy9IT01FLmpzIiwiYXNzZXRzL2pzL3BhZ2VzL1BST0pFQ1RTLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FDQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQUksT0FBTyxJQUFYOztBQUVBLFFBQVEsT0FBTyxJQUFQLENBQVksSUFBcEI7QUFDSSxTQUFLLFdBQUw7QUFDSSxlQUFPLGVBQUssSUFBTCxDQUFVLElBQVYsZ0JBQVA7QUFDQTtBQUNKLFNBQUssZUFBTDtBQUNJLGVBQU8sbUJBQVMsSUFBVCxDQUFjLElBQWQsb0JBQVA7QUFDQTtBQUNKLFNBQUssYUFBTDtBQUNJLGVBQU8saUJBQU8sSUFBUCxDQUFZLElBQVosa0JBQVA7QUFDQTtBQUNKLFNBQUssZUFBTDtBQUNJLGVBQU8sbUJBQVMsSUFBVCxDQUFjLElBQWQsb0JBQVA7QUFDQTtBQUNKO0FBQ0ksZUFBTyxnQkFBTTtBQUNULG9CQUFRLEdBQVIsQ0FBWSxjQUFaO0FBQ0gsU0FGRDtBQWRSOztBQW1CQSxFQUFFLFFBQUYsRUFBWSxLQUFaLENBQWtCLE1BQWxCOztBQUVBLEVBQUUsTUFBRixFQUFVLEVBQVYsQ0FBYSxRQUFiLEVBQXVCLFlBQVcsQ0FFakMsQ0FGRDs7QUFJQSxFQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEsUUFBYixFQUF1QixZQUFXLENBRWpDLENBRkQ7O0FBSUEsRUFBRSxNQUFGLEVBQVUsRUFBVixDQUFhLE1BQWIsRUFBcUIsWUFBWSxDQUVoQyxDQUZEOzs7Ozs7Ozs7QUNwQ0E7Ozs7Ozs7QUFPQyxXQUFVLE9BQVYsRUFBbUI7QUFDaEIsVUFBUSxNQUFSO0FBQ0gsQ0FGQSxFQUVDLFVBQVUsTUFBVixFQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQSxNQUFJLEtBQ0wsWUFBWTtBQUNYO0FBQ0E7QUFDQSxRQUFJLFVBQVUsT0FBTyxFQUFqQixJQUF1QixPQUFPLEVBQVAsQ0FBVSxPQUFqQyxJQUE0QyxPQUFPLEVBQVAsQ0FBVSxPQUFWLENBQWtCLEdBQWxFLEVBQXVFO0FBQ3JFLFVBQUksS0FBSyxPQUFPLEVBQVAsQ0FBVSxPQUFWLENBQWtCLEdBQTNCO0FBQ0Q7QUFDSCxRQUFJLEVBQUosQ0FBUSxhQUFZO0FBQUUsVUFBSSxDQUFDLEVBQUQsSUFBTyxDQUFDLEdBQUcsU0FBZixFQUEwQjtBQUNoRCxZQUFJLENBQUMsRUFBTCxFQUFTO0FBQUUsZUFBSyxFQUFMO0FBQVUsU0FBckIsTUFBMkI7QUFBRSxvQkFBVSxFQUFWO0FBQWU7QUFDNUM7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsWUFBSSxTQUFKLEVBQWUsT0FBZixFQUF3QixNQUF4QjtBQUNDLG1CQUFVLEtBQVYsRUFBaUI7QUFDZCxjQUFJLElBQUo7QUFBQSxjQUFVLElBQVY7QUFBQSxjQUFlLE9BQWY7QUFBQSxjQUF3QixRQUF4QjtBQUFBLGNBQ0ksVUFBVSxFQURkO0FBQUEsY0FFSSxVQUFVLEVBRmQ7QUFBQSxjQUdJLFNBQVMsRUFIYjtBQUFBLGNBSUksV0FBVyxFQUpmO0FBQUEsY0FLSSxTQUFTLE9BQU8sU0FBUCxDQUFpQixjQUw5QjtBQUFBLGNBTUksTUFBTSxHQUFHLEtBTmI7QUFBQSxjQU9JLGlCQUFpQixPQVByQjs7QUFTQSxtQkFBUyxPQUFULENBQWlCLEdBQWpCLEVBQXNCLElBQXRCLEVBQTRCO0FBQ3hCLG1CQUFPLE9BQU8sSUFBUCxDQUFZLEdBQVosRUFBaUIsSUFBakIsQ0FBUDtBQUNIOztBQUVEOzs7Ozs7OztBQVFBLG1CQUFTLFNBQVQsQ0FBbUIsSUFBbkIsRUFBeUIsUUFBekIsRUFBbUM7QUFDL0IsZ0JBQUksU0FBSjtBQUFBLGdCQUFlLFdBQWY7QUFBQSxnQkFBNEIsUUFBNUI7QUFBQSxnQkFBc0MsUUFBdEM7QUFBQSxnQkFBZ0QsU0FBaEQ7QUFBQSxnQkFDSSxNQURKO0FBQUEsZ0JBQ1ksWUFEWjtBQUFBLGdCQUMwQixLQUQxQjtBQUFBLGdCQUNpQyxDQURqQztBQUFBLGdCQUNvQyxDQURwQztBQUFBLGdCQUN1QyxJQUR2QztBQUFBLGdCQUVJLFlBQVksWUFBWSxTQUFTLEtBQVQsQ0FBZSxHQUFmLENBRjVCO0FBQUEsZ0JBR0ksTUFBTSxPQUFPLEdBSGpCO0FBQUEsZ0JBSUksVUFBVyxPQUFPLElBQUksR0FBSixDQUFSLElBQXFCLEVBSm5DOztBQU1BO0FBQ0EsZ0JBQUksUUFBUSxLQUFLLE1BQUwsQ0FBWSxDQUFaLE1BQW1CLEdBQS9CLEVBQW9DO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBLGtCQUFJLFFBQUosRUFBYztBQUNWLHVCQUFPLEtBQUssS0FBTCxDQUFXLEdBQVgsQ0FBUDtBQUNBLDRCQUFZLEtBQUssTUFBTCxHQUFjLENBQTFCOztBQUVBO0FBQ0Esb0JBQUksT0FBTyxZQUFQLElBQXVCLGVBQWUsSUFBZixDQUFvQixLQUFLLFNBQUwsQ0FBcEIsQ0FBM0IsRUFBaUU7QUFDN0QsdUJBQUssU0FBTCxJQUFrQixLQUFLLFNBQUwsRUFBZ0IsT0FBaEIsQ0FBd0IsY0FBeEIsRUFBd0MsRUFBeEMsQ0FBbEI7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUFPLFVBQVUsS0FBVixDQUFnQixDQUFoQixFQUFtQixVQUFVLE1BQVYsR0FBbUIsQ0FBdEMsRUFBeUMsTUFBekMsQ0FBZ0QsSUFBaEQsQ0FBUDs7QUFFQTtBQUNBLHFCQUFLLElBQUksQ0FBVCxFQUFZLElBQUksS0FBSyxNQUFyQixFQUE2QixLQUFLLENBQWxDLEVBQXFDO0FBQ2pDLHlCQUFPLEtBQUssQ0FBTCxDQUFQO0FBQ0Esc0JBQUksU0FBUyxHQUFiLEVBQWtCO0FBQ2QseUJBQUssTUFBTCxDQUFZLENBQVosRUFBZSxDQUFmO0FBQ0EseUJBQUssQ0FBTDtBQUNILG1CQUhELE1BR08sSUFBSSxTQUFTLElBQWIsRUFBbUI7QUFDdEIsd0JBQUksTUFBTSxDQUFOLEtBQVksS0FBSyxDQUFMLE1BQVksSUFBWixJQUFvQixLQUFLLENBQUwsTUFBWSxJQUE1QyxDQUFKLEVBQXVEO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0gscUJBUkQsTUFRTyxJQUFJLElBQUksQ0FBUixFQUFXO0FBQ2QsMkJBQUssTUFBTCxDQUFZLElBQUksQ0FBaEIsRUFBbUIsQ0FBbkI7QUFDQSwyQkFBSyxDQUFMO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7O0FBRUEsdUJBQU8sS0FBSyxJQUFMLENBQVUsR0FBVixDQUFQO0FBQ0gsZUF2Q0QsTUF1Q08sSUFBSSxLQUFLLE9BQUwsQ0FBYSxJQUFiLE1BQXVCLENBQTNCLEVBQThCO0FBQ2pDO0FBQ0E7QUFDQSx1QkFBTyxLQUFLLFNBQUwsQ0FBZSxDQUFmLENBQVA7QUFDSDtBQUNKOztBQUVEO0FBQ0EsZ0JBQUksQ0FBQyxhQUFhLE9BQWQsS0FBMEIsR0FBOUIsRUFBbUM7QUFDL0IsMEJBQVksS0FBSyxLQUFMLENBQVcsR0FBWCxDQUFaOztBQUVBLG1CQUFLLElBQUksVUFBVSxNQUFuQixFQUEyQixJQUFJLENBQS9CLEVBQWtDLEtBQUssQ0FBdkMsRUFBMEM7QUFDdEMsOEJBQWMsVUFBVSxLQUFWLENBQWdCLENBQWhCLEVBQW1CLENBQW5CLEVBQXNCLElBQXRCLENBQTJCLEdBQTNCLENBQWQ7O0FBRUEsb0JBQUksU0FBSixFQUFlO0FBQ1g7QUFDQTtBQUNBLHVCQUFLLElBQUksVUFBVSxNQUFuQixFQUEyQixJQUFJLENBQS9CLEVBQWtDLEtBQUssQ0FBdkMsRUFBMEM7QUFDdEMsK0JBQVcsSUFBSSxVQUFVLEtBQVYsQ0FBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0IsSUFBdEIsQ0FBMkIsR0FBM0IsQ0FBSixDQUFYOztBQUVBO0FBQ0E7QUFDQSx3QkFBSSxRQUFKLEVBQWM7QUFDVixpQ0FBVyxTQUFTLFdBQVQsQ0FBWDtBQUNBLDBCQUFJLFFBQUosRUFBYztBQUNWO0FBQ0EsbUNBQVcsUUFBWDtBQUNBLGlDQUFTLENBQVQ7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNKOztBQUVELG9CQUFJLFFBQUosRUFBYztBQUNWO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBO0FBQ0Esb0JBQUksQ0FBQyxZQUFELElBQWlCLE9BQWpCLElBQTRCLFFBQVEsV0FBUixDQUFoQyxFQUFzRDtBQUNsRCxpQ0FBZSxRQUFRLFdBQVIsQ0FBZjtBQUNBLDBCQUFRLENBQVI7QUFDSDtBQUNKOztBQUVELGtCQUFJLENBQUMsUUFBRCxJQUFhLFlBQWpCLEVBQStCO0FBQzNCLDJCQUFXLFlBQVg7QUFDQSx5QkFBUyxLQUFUO0FBQ0g7O0FBRUQsa0JBQUksUUFBSixFQUFjO0FBQ1YsMEJBQVUsTUFBVixDQUFpQixDQUFqQixFQUFvQixNQUFwQixFQUE0QixRQUE1QjtBQUNBLHVCQUFPLFVBQVUsSUFBVixDQUFlLEdBQWYsQ0FBUDtBQUNIO0FBQ0o7O0FBRUQsbUJBQU8sSUFBUDtBQUNIOztBQUVELG1CQUFTLFdBQVQsQ0FBcUIsT0FBckIsRUFBOEIsU0FBOUIsRUFBeUM7QUFDckMsbUJBQU8sWUFBWTtBQUNmO0FBQ0E7QUFDQTtBQUNBLGtCQUFJLE9BQU8sSUFBSSxJQUFKLENBQVMsU0FBVCxFQUFvQixDQUFwQixDQUFYOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFJLE9BQU8sS0FBSyxDQUFMLENBQVAsS0FBbUIsUUFBbkIsSUFBK0IsS0FBSyxNQUFMLEtBQWdCLENBQW5ELEVBQXNEO0FBQ2xELHFCQUFLLElBQUwsQ0FBVSxJQUFWO0FBQ0g7QUFDRCxxQkFBTyxLQUFJLEtBQUosQ0FBVSxLQUFWLEVBQWlCLEtBQUssTUFBTCxDQUFZLENBQUMsT0FBRCxFQUFVLFNBQVYsQ0FBWixDQUFqQixDQUFQO0FBQ0gsYUFiRDtBQWNIOztBQUVELG1CQUFTLGFBQVQsQ0FBdUIsT0FBdkIsRUFBZ0M7QUFDNUIsbUJBQU8sVUFBVSxJQUFWLEVBQWdCO0FBQ25CLHFCQUFPLFVBQVUsSUFBVixFQUFnQixPQUFoQixDQUFQO0FBQ0gsYUFGRDtBQUdIOztBQUVELG1CQUFTLFFBQVQsQ0FBa0IsT0FBbEIsRUFBMkI7QUFDdkIsbUJBQU8sVUFBVSxLQUFWLEVBQWlCO0FBQ3BCLHNCQUFRLE9BQVIsSUFBbUIsS0FBbkI7QUFDSCxhQUZEO0FBR0g7O0FBRUQsbUJBQVMsT0FBVCxDQUFpQixJQUFqQixFQUF1QjtBQUNuQixnQkFBSSxRQUFRLE9BQVIsRUFBaUIsSUFBakIsQ0FBSixFQUE0QjtBQUN4QixrQkFBSSxPQUFPLFFBQVEsSUFBUixDQUFYO0FBQ0EscUJBQU8sUUFBUSxJQUFSLENBQVA7QUFDQSx1QkFBUyxJQUFULElBQWlCLElBQWpCO0FBQ0EsbUJBQUssS0FBTCxDQUFXLEtBQVgsRUFBa0IsSUFBbEI7QUFDSDs7QUFFRCxnQkFBSSxDQUFDLFFBQVEsT0FBUixFQUFpQixJQUFqQixDQUFELElBQTJCLENBQUMsUUFBUSxRQUFSLEVBQWtCLElBQWxCLENBQWhDLEVBQXlEO0FBQ3JELG9CQUFNLElBQUksS0FBSixDQUFVLFFBQVEsSUFBbEIsQ0FBTjtBQUNIO0FBQ0QsbUJBQU8sUUFBUSxJQUFSLENBQVA7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxtQkFBUyxXQUFULENBQXFCLElBQXJCLEVBQTJCO0FBQ3ZCLGdCQUFJLE1BQUo7QUFBQSxnQkFDSSxRQUFRLE9BQU8sS0FBSyxPQUFMLENBQWEsR0FBYixDQUFQLEdBQTJCLENBQUMsQ0FEeEM7QUFFQSxnQkFBSSxRQUFRLENBQUMsQ0FBYixFQUFnQjtBQUNaLHVCQUFTLEtBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsS0FBbEIsQ0FBVDtBQUNBLHFCQUFPLEtBQUssU0FBTCxDQUFlLFFBQVEsQ0FBdkIsRUFBMEIsS0FBSyxNQUEvQixDQUFQO0FBQ0g7QUFDRCxtQkFBTyxDQUFDLE1BQUQsRUFBUyxJQUFULENBQVA7QUFDSDs7QUFFRDs7Ozs7QUFLQSxvQkFBVSxpQkFBVSxJQUFWLEVBQWdCLE9BQWhCLEVBQXlCO0FBQy9CLGdCQUFJLE1BQUo7QUFBQSxnQkFDSSxRQUFRLFlBQVksSUFBWixDQURaO0FBQUEsZ0JBRUksU0FBUyxNQUFNLENBQU4sQ0FGYjs7QUFJQSxtQkFBTyxNQUFNLENBQU4sQ0FBUDs7QUFFQSxnQkFBSSxNQUFKLEVBQVk7QUFDUix1QkFBUyxVQUFVLE1BQVYsRUFBa0IsT0FBbEIsQ0FBVDtBQUNBLHVCQUFTLFFBQVEsTUFBUixDQUFUO0FBQ0g7O0FBRUQ7QUFDQSxnQkFBSSxNQUFKLEVBQVk7QUFDUixrQkFBSSxVQUFVLE9BQU8sU0FBckIsRUFBZ0M7QUFDNUIsdUJBQU8sT0FBTyxTQUFQLENBQWlCLElBQWpCLEVBQXVCLGNBQWMsT0FBZCxDQUF2QixDQUFQO0FBQ0gsZUFGRCxNQUVPO0FBQ0gsdUJBQU8sVUFBVSxJQUFWLEVBQWdCLE9BQWhCLENBQVA7QUFDSDtBQUNKLGFBTkQsTUFNTztBQUNILHFCQUFPLFVBQVUsSUFBVixFQUFnQixPQUFoQixDQUFQO0FBQ0Esc0JBQVEsWUFBWSxJQUFaLENBQVI7QUFDQSx1QkFBUyxNQUFNLENBQU4sQ0FBVDtBQUNBLHFCQUFPLE1BQU0sQ0FBTixDQUFQO0FBQ0Esa0JBQUksTUFBSixFQUFZO0FBQ1IseUJBQVMsUUFBUSxNQUFSLENBQVQ7QUFDSDtBQUNKOztBQUVEO0FBQ0EsbUJBQU87QUFDSCxpQkFBRyxTQUFTLFNBQVMsR0FBVCxHQUFlLElBQXhCLEdBQStCLElBRC9CLEVBQ3FDO0FBQ3hDLGlCQUFHLElBRkE7QUFHSCxrQkFBSSxNQUhEO0FBSUgsaUJBQUc7QUFKQSxhQUFQO0FBTUgsV0FwQ0Q7O0FBc0NBLG1CQUFTLFVBQVQsQ0FBb0IsSUFBcEIsRUFBMEI7QUFDdEIsbUJBQU8sWUFBWTtBQUNmLHFCQUFRLFVBQVUsT0FBTyxNQUFqQixJQUEyQixPQUFPLE1BQVAsQ0FBYyxJQUFkLENBQTVCLElBQW9ELEVBQTNEO0FBQ0gsYUFGRDtBQUdIOztBQUVELHFCQUFXO0FBQ1AscUJBQVMsaUJBQVUsSUFBVixFQUFnQjtBQUNyQixxQkFBTyxZQUFZLElBQVosQ0FBUDtBQUNILGFBSE07QUFJUCxxQkFBUyxpQkFBVSxJQUFWLEVBQWdCO0FBQ3JCLGtCQUFJLElBQUksUUFBUSxJQUFSLENBQVI7QUFDQSxrQkFBSSxPQUFPLENBQVAsS0FBYSxXQUFqQixFQUE4QjtBQUMxQix1QkFBTyxDQUFQO0FBQ0gsZUFGRCxNQUVPO0FBQ0gsdUJBQVEsUUFBUSxJQUFSLElBQWdCLEVBQXhCO0FBQ0g7QUFDSixhQVhNO0FBWVAsb0JBQVEsZ0JBQVUsSUFBVixFQUFnQjtBQUNwQixxQkFBTztBQUNILG9CQUFJLElBREQ7QUFFSCxxQkFBSyxFQUZGO0FBR0gseUJBQVMsUUFBUSxJQUFSLENBSE47QUFJSCx3QkFBUSxXQUFXLElBQVg7QUFKTCxlQUFQO0FBTUg7QUFuQk0sV0FBWDs7QUFzQkEsaUJBQU8sY0FBVSxJQUFWLEVBQWdCLElBQWhCLEVBQXNCLFFBQXRCLEVBQWdDLE9BQWhDLEVBQXlDO0FBQzVDLGdCQUFJLFNBQUo7QUFBQSxnQkFBZSxPQUFmO0FBQUEsZ0JBQXdCLEdBQXhCO0FBQUEsZ0JBQTZCLEdBQTdCO0FBQUEsZ0JBQWtDLENBQWxDO0FBQUEsZ0JBQ0ksT0FBTyxFQURYO0FBQUEsZ0JBRUksc0JBQXNCLFFBQXRCLHlDQUFzQixRQUF0QixDQUZKO0FBQUEsZ0JBR0ksWUFISjs7QUFLQTtBQUNBLHNCQUFVLFdBQVcsSUFBckI7O0FBRUE7QUFDQSxnQkFBSSxpQkFBaUIsV0FBakIsSUFBZ0MsaUJBQWlCLFVBQXJELEVBQWlFO0FBQzdEO0FBQ0E7QUFDQTtBQUNBLHFCQUFPLENBQUMsS0FBSyxNQUFOLElBQWdCLFNBQVMsTUFBekIsR0FBa0MsQ0FBQyxTQUFELEVBQVksU0FBWixFQUF1QixRQUF2QixDQUFsQyxHQUFxRSxJQUE1RTtBQUNBLG1CQUFLLElBQUksQ0FBVCxFQUFZLElBQUksS0FBSyxNQUFyQixFQUE2QixLQUFLLENBQWxDLEVBQXFDO0FBQ2pDLHNCQUFNLFFBQVEsS0FBSyxDQUFMLENBQVIsRUFBaUIsT0FBakIsQ0FBTjtBQUNBLDBCQUFVLElBQUksQ0FBZDs7QUFFQTtBQUNBLG9CQUFJLFlBQVksU0FBaEIsRUFBMkI7QUFDdkIsdUJBQUssQ0FBTCxJQUFVLFNBQVMsT0FBVCxDQUFpQixJQUFqQixDQUFWO0FBQ0gsaUJBRkQsTUFFTyxJQUFJLFlBQVksU0FBaEIsRUFBMkI7QUFDOUI7QUFDQSx1QkFBSyxDQUFMLElBQVUsU0FBUyxPQUFULENBQWlCLElBQWpCLENBQVY7QUFDQSxpQ0FBZSxJQUFmO0FBQ0gsaUJBSk0sTUFJQSxJQUFJLFlBQVksUUFBaEIsRUFBMEI7QUFDN0I7QUFDQSw4QkFBWSxLQUFLLENBQUwsSUFBVSxTQUFTLE1BQVQsQ0FBZ0IsSUFBaEIsQ0FBdEI7QUFDSCxpQkFITSxNQUdBLElBQUksUUFBUSxPQUFSLEVBQWlCLE9BQWpCLEtBQ0EsUUFBUSxPQUFSLEVBQWlCLE9BQWpCLENBREEsSUFFQSxRQUFRLFFBQVIsRUFBa0IsT0FBbEIsQ0FGSixFQUVnQztBQUNuQyx1QkFBSyxDQUFMLElBQVUsUUFBUSxPQUFSLENBQVY7QUFDSCxpQkFKTSxNQUlBLElBQUksSUFBSSxDQUFSLEVBQVc7QUFDZCxzQkFBSSxDQUFKLENBQU0sSUFBTixDQUFXLElBQUksQ0FBZixFQUFrQixZQUFZLE9BQVosRUFBcUIsSUFBckIsQ0FBbEIsRUFBOEMsU0FBUyxPQUFULENBQTlDLEVBQWlFLEVBQWpFO0FBQ0EsdUJBQUssQ0FBTCxJQUFVLFFBQVEsT0FBUixDQUFWO0FBQ0gsaUJBSE0sTUFHQTtBQUNILHdCQUFNLElBQUksS0FBSixDQUFVLE9BQU8sV0FBUCxHQUFxQixPQUEvQixDQUFOO0FBQ0g7QUFDSjs7QUFFRCxvQkFBTSxXQUFXLFNBQVMsS0FBVCxDQUFlLFFBQVEsSUFBUixDQUFmLEVBQThCLElBQTlCLENBQVgsR0FBaUQsU0FBdkQ7O0FBRUEsa0JBQUksSUFBSixFQUFVO0FBQ047QUFDQTtBQUNBO0FBQ0Esb0JBQUksYUFBYSxVQUFVLE9BQVYsS0FBc0IsS0FBbkMsSUFDSSxVQUFVLE9BQVYsS0FBc0IsUUFBUSxJQUFSLENBRDlCLEVBQzZDO0FBQ3pDLDBCQUFRLElBQVIsSUFBZ0IsVUFBVSxPQUExQjtBQUNILGlCQUhELE1BR08sSUFBSSxRQUFRLEtBQVIsSUFBaUIsQ0FBQyxZQUF0QixFQUFvQztBQUN2QztBQUNBLDBCQUFRLElBQVIsSUFBZ0IsR0FBaEI7QUFDSDtBQUNKO0FBQ0osYUE3Q0QsTUE2Q08sSUFBSSxJQUFKLEVBQVU7QUFDYjtBQUNBO0FBQ0Esc0JBQVEsSUFBUixJQUFnQixRQUFoQjtBQUNIO0FBQ0osV0E1REQ7O0FBOERBLHNCQUFZLFVBQVUsT0FBTSxhQUFVLElBQVYsRUFBZ0IsUUFBaEIsRUFBMEIsT0FBMUIsRUFBbUMsU0FBbkMsRUFBOEMsR0FBOUMsRUFBbUQ7QUFDM0UsZ0JBQUksT0FBTyxJQUFQLEtBQWdCLFFBQXBCLEVBQThCO0FBQzFCLGtCQUFJLFNBQVMsSUFBVCxDQUFKLEVBQW9CO0FBQ2hCO0FBQ0EsdUJBQU8sU0FBUyxJQUFULEVBQWUsUUFBZixDQUFQO0FBQ0g7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFPLFFBQVEsUUFBUSxJQUFSLEVBQWMsUUFBZCxFQUF3QixDQUFoQyxDQUFQO0FBQ0gsYUFWRCxNQVVPLElBQUksQ0FBQyxLQUFLLE1BQVYsRUFBa0I7QUFDckI7QUFDQSx1QkFBUyxJQUFUO0FBQ0Esa0JBQUksT0FBTyxJQUFYLEVBQWlCO0FBQ2IscUJBQUksT0FBTyxJQUFYLEVBQWlCLE9BQU8sUUFBeEI7QUFDSDtBQUNELGtCQUFJLENBQUMsUUFBTCxFQUFlO0FBQ1g7QUFDSDs7QUFFRCxrQkFBSSxTQUFTLE1BQWIsRUFBcUI7QUFDakI7QUFDQTtBQUNBLHVCQUFPLFFBQVA7QUFDQSwyQkFBVyxPQUFYO0FBQ0EsMEJBQVUsSUFBVjtBQUNILGVBTkQsTUFNTztBQUNILHVCQUFPLEtBQVA7QUFDSDtBQUNKOztBQUVEO0FBQ0EsdUJBQVcsWUFBWSxZQUFZLENBQUUsQ0FBckM7O0FBRUE7QUFDQTtBQUNBLGdCQUFJLE9BQU8sT0FBUCxLQUFtQixVQUF2QixFQUFtQztBQUMvQix3QkFBVSxTQUFWO0FBQ0EsMEJBQVksR0FBWjtBQUNIOztBQUVEO0FBQ0EsZ0JBQUksU0FBSixFQUFlO0FBQ1gsbUJBQUssS0FBTCxFQUFZLElBQVosRUFBa0IsUUFBbEIsRUFBNEIsT0FBNUI7QUFDSCxhQUZELE1BRU87QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBVyxZQUFZO0FBQ25CLHFCQUFLLEtBQUwsRUFBWSxJQUFaLEVBQWtCLFFBQWxCLEVBQTRCLE9BQTVCO0FBQ0gsZUFGRCxFQUVHLENBRkg7QUFHSDs7QUFFRCxtQkFBTyxJQUFQO0FBQ0gsV0ExREQ7O0FBNERBOzs7O0FBSUEsZUFBSSxNQUFKLEdBQWEsVUFBVSxHQUFWLEVBQWU7QUFDeEIsbUJBQU8sS0FBSSxHQUFKLENBQVA7QUFDSCxXQUZEOztBQUlBOzs7QUFHQSxvQkFBVSxRQUFWLEdBQXFCLE9BQXJCOztBQUVBLG1CQUFTLGdCQUFVLElBQVYsRUFBZ0IsSUFBaEIsRUFBc0IsUUFBdEIsRUFBZ0M7QUFDckMsZ0JBQUksT0FBTyxJQUFQLEtBQWdCLFFBQXBCLEVBQThCO0FBQzFCLG9CQUFNLElBQUksS0FBSixDQUFVLDJEQUFWLENBQU47QUFDSDs7QUFFRDtBQUNBLGdCQUFJLENBQUMsS0FBSyxNQUFWLEVBQWtCO0FBQ2Q7QUFDQTtBQUNBO0FBQ0EseUJBQVcsSUFBWDtBQUNBLHFCQUFPLEVBQVA7QUFDSDs7QUFFRCxnQkFBSSxDQUFDLFFBQVEsT0FBUixFQUFpQixJQUFqQixDQUFELElBQTJCLENBQUMsUUFBUSxPQUFSLEVBQWlCLElBQWpCLENBQWhDLEVBQXdEO0FBQ3BELHNCQUFRLElBQVIsSUFBZ0IsQ0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLFFBQWIsQ0FBaEI7QUFDSDtBQUNKLFdBakJEOztBQW1CQSxpQkFBTyxHQUFQLEdBQWE7QUFDVCxvQkFBUTtBQURDLFdBQWI7QUFHSCxTQWxhQSxHQUFEOztBQW9hQSxXQUFHLFNBQUgsR0FBZSxTQUFmLENBQXlCLEdBQUcsT0FBSCxHQUFhLE9BQWIsQ0FBcUIsR0FBRyxNQUFILEdBQVksTUFBWjtBQUM3QztBQUNBLEtBbmJPLEdBQUQ7QUFvYlAsT0FBRyxNQUFILENBQVUsUUFBVixFQUFvQixZQUFVLENBQUUsQ0FBaEM7O0FBRUE7QUFDQSxPQUFHLE1BQUgsQ0FBVSxRQUFWLEVBQW1CLEVBQW5CLEVBQXNCLFlBQVk7QUFDaEMsVUFBSSxLQUFLLFVBQVUsQ0FBbkI7O0FBRUEsVUFBSSxNQUFNLElBQU4sSUFBYyxPQUFkLElBQXlCLFFBQVEsS0FBckMsRUFBNEM7QUFDMUMsZ0JBQVEsS0FBUixDQUNFLDJFQUNBLHdFQURBLEdBRUEsV0FIRjtBQUtEOztBQUVELGFBQU8sRUFBUDtBQUNELEtBWkQ7O0FBY0EsT0FBRyxNQUFILENBQVUsZUFBVixFQUEwQixDQUN4QixRQUR3QixDQUExQixFQUVHLFVBQVUsQ0FBVixFQUFhO0FBQ2QsVUFBSSxRQUFRLEVBQVo7O0FBRUEsWUFBTSxNQUFOLEdBQWUsVUFBVSxVQUFWLEVBQXNCLFVBQXRCLEVBQWtDO0FBQy9DLFlBQUksWUFBWSxHQUFHLGNBQW5COztBQUVBLGlCQUFTLGVBQVQsR0FBNEI7QUFDMUIsZUFBSyxXQUFMLEdBQW1CLFVBQW5CO0FBQ0Q7O0FBRUQsYUFBSyxJQUFJLEdBQVQsSUFBZ0IsVUFBaEIsRUFBNEI7QUFDMUIsY0FBSSxVQUFVLElBQVYsQ0FBZSxVQUFmLEVBQTJCLEdBQTNCLENBQUosRUFBcUM7QUFDbkMsdUJBQVcsR0FBWCxJQUFrQixXQUFXLEdBQVgsQ0FBbEI7QUFDRDtBQUNGOztBQUVELHdCQUFnQixTQUFoQixHQUE0QixXQUFXLFNBQXZDO0FBQ0EsbUJBQVcsU0FBWCxHQUF1QixJQUFJLGVBQUosRUFBdkI7QUFDQSxtQkFBVyxTQUFYLEdBQXVCLFdBQVcsU0FBbEM7O0FBRUEsZUFBTyxVQUFQO0FBQ0QsT0FsQkQ7O0FBb0JBLGVBQVMsVUFBVCxDQUFxQixRQUFyQixFQUErQjtBQUM3QixZQUFJLFFBQVEsU0FBUyxTQUFyQjs7QUFFQSxZQUFJLFVBQVUsRUFBZDs7QUFFQSxhQUFLLElBQUksVUFBVCxJQUF1QixLQUF2QixFQUE4QjtBQUM1QixjQUFJLElBQUksTUFBTSxVQUFOLENBQVI7O0FBRUEsY0FBSSxPQUFPLENBQVAsS0FBYSxVQUFqQixFQUE2QjtBQUMzQjtBQUNEOztBQUVELGNBQUksZUFBZSxhQUFuQixFQUFrQztBQUNoQztBQUNEOztBQUVELGtCQUFRLElBQVIsQ0FBYSxVQUFiO0FBQ0Q7O0FBRUQsZUFBTyxPQUFQO0FBQ0Q7O0FBRUQsWUFBTSxRQUFOLEdBQWlCLFVBQVUsVUFBVixFQUFzQixjQUF0QixFQUFzQztBQUNyRCxZQUFJLG1CQUFtQixXQUFXLGNBQVgsQ0FBdkI7QUFDQSxZQUFJLGVBQWUsV0FBVyxVQUFYLENBQW5COztBQUVBLGlCQUFTLGNBQVQsR0FBMkI7QUFDekIsY0FBSSxVQUFVLE1BQU0sU0FBTixDQUFnQixPQUE5Qjs7QUFFQSxjQUFJLFdBQVcsZUFBZSxTQUFmLENBQXlCLFdBQXpCLENBQXFDLE1BQXBEOztBQUVBLGNBQUksb0JBQW9CLFdBQVcsU0FBWCxDQUFxQixXQUE3Qzs7QUFFQSxjQUFJLFdBQVcsQ0FBZixFQUFrQjtBQUNoQixvQkFBUSxJQUFSLENBQWEsU0FBYixFQUF3QixXQUFXLFNBQVgsQ0FBcUIsV0FBN0M7O0FBRUEsZ0NBQW9CLGVBQWUsU0FBZixDQUF5QixXQUE3QztBQUNEOztBQUVELDRCQUFrQixLQUFsQixDQUF3QixJQUF4QixFQUE4QixTQUE5QjtBQUNEOztBQUVELHVCQUFlLFdBQWYsR0FBNkIsV0FBVyxXQUF4Qzs7QUFFQSxpQkFBUyxHQUFULEdBQWdCO0FBQ2QsZUFBSyxXQUFMLEdBQW1CLGNBQW5CO0FBQ0Q7O0FBRUQsdUJBQWUsU0FBZixHQUEyQixJQUFJLEdBQUosRUFBM0I7O0FBRUEsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLGFBQWEsTUFBakMsRUFBeUMsR0FBekMsRUFBOEM7QUFDMUMsY0FBSSxjQUFjLGFBQWEsQ0FBYixDQUFsQjs7QUFFQSx5QkFBZSxTQUFmLENBQXlCLFdBQXpCLElBQ0UsV0FBVyxTQUFYLENBQXFCLFdBQXJCLENBREY7QUFFSDs7QUFFRCxZQUFJLGVBQWUsU0FBZixZQUFlLENBQVUsVUFBVixFQUFzQjtBQUN2QztBQUNBLGNBQUksaUJBQWlCLDBCQUFZLENBQUUsQ0FBbkM7O0FBRUEsY0FBSSxjQUFjLGVBQWUsU0FBakMsRUFBNEM7QUFDMUMsNkJBQWlCLGVBQWUsU0FBZixDQUF5QixVQUF6QixDQUFqQjtBQUNEOztBQUVELGNBQUksa0JBQWtCLGVBQWUsU0FBZixDQUF5QixVQUF6QixDQUF0Qjs7QUFFQSxpQkFBTyxZQUFZO0FBQ2pCLGdCQUFJLFVBQVUsTUFBTSxTQUFOLENBQWdCLE9BQTlCOztBQUVBLG9CQUFRLElBQVIsQ0FBYSxTQUFiLEVBQXdCLGNBQXhCOztBQUVBLG1CQUFPLGdCQUFnQixLQUFoQixDQUFzQixJQUF0QixFQUE0QixTQUE1QixDQUFQO0FBQ0QsV0FORDtBQU9ELFNBakJEOztBQW1CQSxhQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksaUJBQWlCLE1BQXJDLEVBQTZDLEdBQTdDLEVBQWtEO0FBQ2hELGNBQUksa0JBQWtCLGlCQUFpQixDQUFqQixDQUF0Qjs7QUFFQSx5QkFBZSxTQUFmLENBQXlCLGVBQXpCLElBQTRDLGFBQWEsZUFBYixDQUE1QztBQUNEOztBQUVELGVBQU8sY0FBUDtBQUNELE9BN0REOztBQStEQSxVQUFJLGFBQWEsU0FBYixVQUFhLEdBQVk7QUFDM0IsYUFBSyxTQUFMLEdBQWlCLEVBQWpCO0FBQ0QsT0FGRDs7QUFJQSxpQkFBVyxTQUFYLENBQXFCLEVBQXJCLEdBQTBCLFVBQVUsS0FBVixFQUFpQixRQUFqQixFQUEyQjtBQUNuRCxhQUFLLFNBQUwsR0FBaUIsS0FBSyxTQUFMLElBQWtCLEVBQW5DOztBQUVBLFlBQUksU0FBUyxLQUFLLFNBQWxCLEVBQTZCO0FBQzNCLGVBQUssU0FBTCxDQUFlLEtBQWYsRUFBc0IsSUFBdEIsQ0FBMkIsUUFBM0I7QUFDRCxTQUZELE1BRU87QUFDTCxlQUFLLFNBQUwsQ0FBZSxLQUFmLElBQXdCLENBQUMsUUFBRCxDQUF4QjtBQUNEO0FBQ0YsT0FSRDs7QUFVQSxpQkFBVyxTQUFYLENBQXFCLE9BQXJCLEdBQStCLFVBQVUsS0FBVixFQUFpQjtBQUM5QyxZQUFJLFFBQVEsTUFBTSxTQUFOLENBQWdCLEtBQTVCO0FBQ0EsWUFBSSxTQUFTLE1BQU0sSUFBTixDQUFXLFNBQVgsRUFBc0IsQ0FBdEIsQ0FBYjs7QUFFQSxhQUFLLFNBQUwsR0FBaUIsS0FBSyxTQUFMLElBQWtCLEVBQW5DOztBQUVBO0FBQ0EsWUFBSSxVQUFVLElBQWQsRUFBb0I7QUFDbEIsbUJBQVMsRUFBVDtBQUNEOztBQUVEO0FBQ0EsWUFBSSxPQUFPLE1BQVAsS0FBa0IsQ0FBdEIsRUFBeUI7QUFDdkIsaUJBQU8sSUFBUCxDQUFZLEVBQVo7QUFDRDs7QUFFRDtBQUNBLGVBQU8sQ0FBUCxFQUFVLEtBQVYsR0FBa0IsS0FBbEI7O0FBRUEsWUFBSSxTQUFTLEtBQUssU0FBbEIsRUFBNkI7QUFDM0IsZUFBSyxNQUFMLENBQVksS0FBSyxTQUFMLENBQWUsS0FBZixDQUFaLEVBQW1DLE1BQU0sSUFBTixDQUFXLFNBQVgsRUFBc0IsQ0FBdEIsQ0FBbkM7QUFDRDs7QUFFRCxZQUFJLE9BQU8sS0FBSyxTQUFoQixFQUEyQjtBQUN6QixlQUFLLE1BQUwsQ0FBWSxLQUFLLFNBQUwsQ0FBZSxHQUFmLENBQVosRUFBaUMsU0FBakM7QUFDRDtBQUNGLE9BMUJEOztBQTRCQSxpQkFBVyxTQUFYLENBQXFCLE1BQXJCLEdBQThCLFVBQVUsU0FBVixFQUFxQixNQUFyQixFQUE2QjtBQUN6RCxhQUFLLElBQUksSUFBSSxDQUFSLEVBQVcsTUFBTSxVQUFVLE1BQWhDLEVBQXdDLElBQUksR0FBNUMsRUFBaUQsR0FBakQsRUFBc0Q7QUFDcEQsb0JBQVUsQ0FBVixFQUFhLEtBQWIsQ0FBbUIsSUFBbkIsRUFBeUIsTUFBekI7QUFDRDtBQUNGLE9BSkQ7O0FBTUEsWUFBTSxVQUFOLEdBQW1CLFVBQW5COztBQUVBLFlBQU0sYUFBTixHQUFzQixVQUFVLE1BQVYsRUFBa0I7QUFDdEMsWUFBSSxRQUFRLEVBQVo7O0FBRUEsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE1BQXBCLEVBQTRCLEdBQTVCLEVBQWlDO0FBQy9CLGNBQUksYUFBYSxLQUFLLEtBQUwsQ0FBVyxLQUFLLE1BQUwsS0FBZ0IsRUFBM0IsQ0FBakI7QUFDQSxtQkFBUyxXQUFXLFFBQVgsQ0FBb0IsRUFBcEIsQ0FBVDtBQUNEOztBQUVELGVBQU8sS0FBUDtBQUNELE9BVEQ7O0FBV0EsWUFBTSxJQUFOLEdBQWEsVUFBVSxJQUFWLEVBQWdCLE9BQWhCLEVBQXlCO0FBQ3BDLGVBQU8sWUFBWTtBQUNqQixlQUFLLEtBQUwsQ0FBVyxPQUFYLEVBQW9CLFNBQXBCO0FBQ0QsU0FGRDtBQUdELE9BSkQ7O0FBTUEsWUFBTSxZQUFOLEdBQXFCLFVBQVUsSUFBVixFQUFnQjtBQUNuQyxhQUFLLElBQUksV0FBVCxJQUF3QixJQUF4QixFQUE4QjtBQUM1QixjQUFJLE9BQU8sWUFBWSxLQUFaLENBQWtCLEdBQWxCLENBQVg7O0FBRUEsY0FBSSxZQUFZLElBQWhCOztBQUVBLGNBQUksS0FBSyxNQUFMLEtBQWdCLENBQXBCLEVBQXVCO0FBQ3JCO0FBQ0Q7O0FBRUQsZUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssTUFBekIsRUFBaUMsR0FBakMsRUFBc0M7QUFDcEMsZ0JBQUksTUFBTSxLQUFLLENBQUwsQ0FBVjs7QUFFQTtBQUNBO0FBQ0Esa0JBQU0sSUFBSSxTQUFKLENBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQixXQUFwQixLQUFvQyxJQUFJLFNBQUosQ0FBYyxDQUFkLENBQTFDOztBQUVBLGdCQUFJLEVBQUUsT0FBTyxTQUFULENBQUosRUFBeUI7QUFDdkIsd0JBQVUsR0FBVixJQUFpQixFQUFqQjtBQUNEOztBQUVELGdCQUFJLEtBQUssS0FBSyxNQUFMLEdBQWMsQ0FBdkIsRUFBMEI7QUFDeEIsd0JBQVUsR0FBVixJQUFpQixLQUFLLFdBQUwsQ0FBakI7QUFDRDs7QUFFRCx3QkFBWSxVQUFVLEdBQVYsQ0FBWjtBQUNEOztBQUVELGlCQUFPLEtBQUssV0FBTCxDQUFQO0FBQ0Q7O0FBRUQsZUFBTyxJQUFQO0FBQ0QsT0FoQ0Q7O0FBa0NBLFlBQU0sU0FBTixHQUFrQixVQUFVLEtBQVYsRUFBaUIsRUFBakIsRUFBcUI7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxZQUFJLE1BQU0sRUFBRSxFQUFGLENBQVY7QUFDQSxZQUFJLFlBQVksR0FBRyxLQUFILENBQVMsU0FBekI7QUFDQSxZQUFJLFlBQVksR0FBRyxLQUFILENBQVMsU0FBekI7O0FBRUE7QUFDQSxZQUFJLGNBQWMsU0FBZCxLQUNDLGNBQWMsUUFBZCxJQUEwQixjQUFjLFNBRHpDLENBQUosRUFDeUQ7QUFDdkQsaUJBQU8sS0FBUDtBQUNEOztBQUVELFlBQUksY0FBYyxRQUFkLElBQTBCLGNBQWMsUUFBNUMsRUFBc0Q7QUFDcEQsaUJBQU8sSUFBUDtBQUNEOztBQUVELGVBQVEsSUFBSSxXQUFKLEtBQW9CLEdBQUcsWUFBdkIsSUFDTixJQUFJLFVBQUosS0FBbUIsR0FBRyxXQUR4QjtBQUVELE9BdkJEOztBQXlCQSxZQUFNLFlBQU4sR0FBcUIsVUFBVSxNQUFWLEVBQWtCO0FBQ3JDLFlBQUksYUFBYTtBQUNmLGdCQUFNLE9BRFM7QUFFZixlQUFLLE9BRlU7QUFHZixlQUFLLE1BSFU7QUFJZixlQUFLLE1BSlU7QUFLZixlQUFLLFFBTFU7QUFNZixnQkFBTSxPQU5TO0FBT2YsZUFBSztBQVBVLFNBQWpCOztBQVVBO0FBQ0EsWUFBSSxPQUFPLE1BQVAsS0FBa0IsUUFBdEIsRUFBZ0M7QUFDOUIsaUJBQU8sTUFBUDtBQUNEOztBQUVELGVBQU8sT0FBTyxNQUFQLEVBQWUsT0FBZixDQUF1QixjQUF2QixFQUF1QyxVQUFVLEtBQVYsRUFBaUI7QUFDN0QsaUJBQU8sV0FBVyxLQUFYLENBQVA7QUFDRCxTQUZNLENBQVA7QUFHRCxPQW5CRDs7QUFxQkE7QUFDQSxZQUFNLFVBQU4sR0FBbUIsVUFBVSxRQUFWLEVBQW9CLE1BQXBCLEVBQTRCO0FBQzdDO0FBQ0E7QUFDQSxZQUFJLEVBQUUsRUFBRixDQUFLLE1BQUwsQ0FBWSxNQUFaLENBQW1CLENBQW5CLEVBQXNCLENBQXRCLE1BQTZCLEtBQWpDLEVBQXdDO0FBQ3RDLGNBQUksV0FBVyxHQUFmOztBQUVBLFlBQUUsR0FBRixDQUFNLE1BQU4sRUFBYyxVQUFVLElBQVYsRUFBZ0I7QUFDNUIsdUJBQVcsU0FBUyxHQUFULENBQWEsSUFBYixDQUFYO0FBQ0QsV0FGRDs7QUFJQSxtQkFBUyxRQUFUO0FBQ0Q7O0FBRUQsaUJBQVMsTUFBVCxDQUFnQixNQUFoQjtBQUNELE9BZEQ7O0FBZ0JBLGFBQU8sS0FBUDtBQUNELEtBblJEOztBQXFSQSxPQUFHLE1BQUgsQ0FBVSxpQkFBVixFQUE0QixDQUMxQixRQUQwQixFQUUxQixTQUYwQixDQUE1QixFQUdHLFVBQVUsQ0FBVixFQUFhLEtBQWIsRUFBb0I7QUFDckIsZUFBUyxPQUFULENBQWtCLFFBQWxCLEVBQTRCLE9BQTVCLEVBQXFDLFdBQXJDLEVBQWtEO0FBQ2hELGFBQUssUUFBTCxHQUFnQixRQUFoQjtBQUNBLGFBQUssSUFBTCxHQUFZLFdBQVo7QUFDQSxhQUFLLE9BQUwsR0FBZSxPQUFmOztBQUVBLGdCQUFRLFNBQVIsQ0FBa0IsV0FBbEIsQ0FBOEIsSUFBOUIsQ0FBbUMsSUFBbkM7QUFDRDs7QUFFRCxZQUFNLE1BQU4sQ0FBYSxPQUFiLEVBQXNCLE1BQU0sVUFBNUI7O0FBRUEsY0FBUSxTQUFSLENBQWtCLE1BQWxCLEdBQTJCLFlBQVk7QUFDckMsWUFBSSxXQUFXLEVBQ2Isd0RBRGEsQ0FBZjs7QUFJQSxZQUFJLEtBQUssT0FBTCxDQUFhLEdBQWIsQ0FBaUIsVUFBakIsQ0FBSixFQUFrQztBQUNoQyxtQkFBUyxJQUFULENBQWMsc0JBQWQsRUFBc0MsTUFBdEM7QUFDRDs7QUFFRCxhQUFLLFFBQUwsR0FBZ0IsUUFBaEI7O0FBRUEsZUFBTyxRQUFQO0FBQ0QsT0FaRDs7QUFjQSxjQUFRLFNBQVIsQ0FBa0IsS0FBbEIsR0FBMEIsWUFBWTtBQUNwQyxhQUFLLFFBQUwsQ0FBYyxLQUFkO0FBQ0QsT0FGRDs7QUFJQSxjQUFRLFNBQVIsQ0FBa0IsY0FBbEIsR0FBbUMsVUFBVSxNQUFWLEVBQWtCO0FBQ25ELFlBQUksZUFBZSxLQUFLLE9BQUwsQ0FBYSxHQUFiLENBQWlCLGNBQWpCLENBQW5COztBQUVBLGFBQUssS0FBTDtBQUNBLGFBQUssV0FBTDs7QUFFQSxZQUFJLFdBQVcsRUFDYiw4Q0FDQSx3Q0FGYSxDQUFmOztBQUtBLFlBQUksVUFBVSxLQUFLLE9BQUwsQ0FBYSxHQUFiLENBQWlCLGNBQWpCLEVBQWlDLEdBQWpDLENBQXFDLE9BQU8sT0FBNUMsQ0FBZDs7QUFFQSxpQkFBUyxNQUFULENBQ0UsYUFDRSxRQUFRLE9BQU8sSUFBZixDQURGLENBREY7O0FBTUEsaUJBQVMsQ0FBVCxFQUFZLFNBQVosSUFBeUIsMkJBQXpCOztBQUVBLGFBQUssUUFBTCxDQUFjLE1BQWQsQ0FBcUIsUUFBckI7QUFDRCxPQXRCRDs7QUF3QkEsY0FBUSxTQUFSLENBQWtCLFlBQWxCLEdBQWlDLFlBQVk7QUFDM0MsYUFBSyxRQUFMLENBQWMsSUFBZCxDQUFtQiwyQkFBbkIsRUFBZ0QsTUFBaEQ7QUFDRCxPQUZEOztBQUlBLGNBQVEsU0FBUixDQUFrQixNQUFsQixHQUEyQixVQUFVLElBQVYsRUFBZ0I7QUFDekMsYUFBSyxXQUFMOztBQUVBLFlBQUksV0FBVyxFQUFmOztBQUVBLFlBQUksS0FBSyxPQUFMLElBQWdCLElBQWhCLElBQXdCLEtBQUssT0FBTCxDQUFhLE1BQWIsS0FBd0IsQ0FBcEQsRUFBdUQ7QUFDckQsY0FBSSxLQUFLLFFBQUwsQ0FBYyxRQUFkLEdBQXlCLE1BQXpCLEtBQW9DLENBQXhDLEVBQTJDO0FBQ3pDLGlCQUFLLE9BQUwsQ0FBYSxpQkFBYixFQUFnQztBQUM5Qix1QkFBUztBQURxQixhQUFoQztBQUdEOztBQUVEO0FBQ0Q7O0FBRUQsYUFBSyxPQUFMLEdBQWUsS0FBSyxJQUFMLENBQVUsS0FBSyxPQUFmLENBQWY7O0FBRUEsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssT0FBTCxDQUFhLE1BQWpDLEVBQXlDLEdBQXpDLEVBQThDO0FBQzVDLGNBQUksT0FBTyxLQUFLLE9BQUwsQ0FBYSxDQUFiLENBQVg7O0FBRUEsY0FBSSxVQUFVLEtBQUssTUFBTCxDQUFZLElBQVosQ0FBZDs7QUFFQSxtQkFBUyxJQUFULENBQWMsT0FBZDtBQUNEOztBQUVELGFBQUssUUFBTCxDQUFjLE1BQWQsQ0FBcUIsUUFBckI7QUFDRCxPQTFCRDs7QUE0QkEsY0FBUSxTQUFSLENBQWtCLFFBQWxCLEdBQTZCLFVBQVUsUUFBVixFQUFvQixTQUFwQixFQUErQjtBQUMxRCxZQUFJLG9CQUFvQixVQUFVLElBQVYsQ0FBZSxrQkFBZixDQUF4QjtBQUNBLDBCQUFrQixNQUFsQixDQUF5QixRQUF6QjtBQUNELE9BSEQ7O0FBS0EsY0FBUSxTQUFSLENBQWtCLElBQWxCLEdBQXlCLFVBQVUsSUFBVixFQUFnQjtBQUN2QyxZQUFJLFNBQVMsS0FBSyxPQUFMLENBQWEsR0FBYixDQUFpQixRQUFqQixDQUFiOztBQUVBLGVBQU8sT0FBTyxJQUFQLENBQVA7QUFDRCxPQUpEOztBQU1BLGNBQVEsU0FBUixDQUFrQixrQkFBbEIsR0FBdUMsWUFBWTtBQUNqRCxZQUFJLFdBQVcsS0FBSyxRQUFMLENBQ1osSUFEWSxDQUNQLHlDQURPLENBQWY7O0FBR0EsWUFBSSxZQUFZLFNBQVMsTUFBVCxDQUFnQixzQkFBaEIsQ0FBaEI7O0FBRUE7QUFDQSxZQUFJLFVBQVUsTUFBVixHQUFtQixDQUF2QixFQUEwQjtBQUN4QjtBQUNBLG9CQUFVLEtBQVYsR0FBa0IsT0FBbEIsQ0FBMEIsWUFBMUI7QUFDRCxTQUhELE1BR087QUFDTDtBQUNBO0FBQ0EsbUJBQVMsS0FBVCxHQUFpQixPQUFqQixDQUF5QixZQUF6QjtBQUNEOztBQUVELGFBQUssc0JBQUw7QUFDRCxPQWpCRDs7QUFtQkEsY0FBUSxTQUFSLENBQWtCLFVBQWxCLEdBQStCLFlBQVk7QUFDekMsWUFBSSxPQUFPLElBQVg7O0FBRUEsYUFBSyxJQUFMLENBQVUsT0FBVixDQUFrQixVQUFVLFFBQVYsRUFBb0I7QUFDcEMsY0FBSSxjQUFjLEVBQUUsR0FBRixDQUFNLFFBQU4sRUFBZ0IsVUFBVSxDQUFWLEVBQWE7QUFDN0MsbUJBQU8sRUFBRSxFQUFGLENBQUssUUFBTCxFQUFQO0FBQ0QsV0FGaUIsQ0FBbEI7O0FBSUEsY0FBSSxXQUFXLEtBQUssUUFBTCxDQUNaLElBRFksQ0FDUCx5Q0FETyxDQUFmOztBQUdBLG1CQUFTLElBQVQsQ0FBYyxZQUFZO0FBQ3hCLGdCQUFJLFVBQVUsRUFBRSxJQUFGLENBQWQ7O0FBRUEsZ0JBQUksT0FBTyxFQUFFLElBQUYsQ0FBTyxJQUFQLEVBQWEsTUFBYixDQUFYOztBQUVBO0FBQ0EsZ0JBQUksS0FBSyxLQUFLLEtBQUssRUFBbkI7O0FBRUEsZ0JBQUssS0FBSyxPQUFMLElBQWdCLElBQWhCLElBQXdCLEtBQUssT0FBTCxDQUFhLFFBQXRDLElBQ0MsS0FBSyxPQUFMLElBQWdCLElBQWhCLElBQXdCLEVBQUUsT0FBRixDQUFVLEVBQVYsRUFBYyxXQUFkLElBQTZCLENBQUMsQ0FEM0QsRUFDK0Q7QUFDN0Qsc0JBQVEsSUFBUixDQUFhLGVBQWIsRUFBOEIsTUFBOUI7QUFDRCxhQUhELE1BR087QUFDTCxzQkFBUSxJQUFSLENBQWEsZUFBYixFQUE4QixPQUE5QjtBQUNEO0FBQ0YsV0FkRDtBQWdCRCxTQXhCRDtBQXlCRCxPQTVCRDs7QUE4QkEsY0FBUSxTQUFSLENBQWtCLFdBQWxCLEdBQWdDLFVBQVUsTUFBVixFQUFrQjtBQUNoRCxhQUFLLFdBQUw7O0FBRUEsWUFBSSxjQUFjLEtBQUssT0FBTCxDQUFhLEdBQWIsQ0FBaUIsY0FBakIsRUFBaUMsR0FBakMsQ0FBcUMsV0FBckMsQ0FBbEI7O0FBRUEsWUFBSSxVQUFVO0FBQ1osb0JBQVUsSUFERTtBQUVaLG1CQUFTLElBRkc7QUFHWixnQkFBTSxZQUFZLE1BQVo7QUFITSxTQUFkO0FBS0EsWUFBSSxXQUFXLEtBQUssTUFBTCxDQUFZLE9BQVosQ0FBZjtBQUNBLGlCQUFTLFNBQVQsSUFBc0Isa0JBQXRCOztBQUVBLGFBQUssUUFBTCxDQUFjLE9BQWQsQ0FBc0IsUUFBdEI7QUFDRCxPQWREOztBQWdCQSxjQUFRLFNBQVIsQ0FBa0IsV0FBbEIsR0FBZ0MsWUFBWTtBQUMxQyxhQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLGtCQUFuQixFQUF1QyxNQUF2QztBQUNELE9BRkQ7O0FBSUEsY0FBUSxTQUFSLENBQWtCLE1BQWxCLEdBQTJCLFVBQVUsSUFBVixFQUFnQjtBQUN6QyxZQUFJLFNBQVMsU0FBUyxhQUFULENBQXVCLElBQXZCLENBQWI7QUFDQSxlQUFPLFNBQVAsR0FBbUIseUJBQW5COztBQUVBLFlBQUksUUFBUTtBQUNWLGtCQUFRLFVBREU7QUFFViwyQkFBaUI7QUFGUCxTQUFaOztBQUtBLFlBQUksS0FBSyxRQUFULEVBQW1CO0FBQ2pCLGlCQUFPLE1BQU0sZUFBTixDQUFQO0FBQ0EsZ0JBQU0sZUFBTixJQUF5QixNQUF6QjtBQUNEOztBQUVELFlBQUksS0FBSyxFQUFMLElBQVcsSUFBZixFQUFxQjtBQUNuQixpQkFBTyxNQUFNLGVBQU4sQ0FBUDtBQUNEOztBQUVELFlBQUksS0FBSyxTQUFMLElBQWtCLElBQXRCLEVBQTRCO0FBQzFCLGlCQUFPLEVBQVAsR0FBWSxLQUFLLFNBQWpCO0FBQ0Q7O0FBRUQsWUFBSSxLQUFLLEtBQVQsRUFBZ0I7QUFDZCxpQkFBTyxLQUFQLEdBQWUsS0FBSyxLQUFwQjtBQUNEOztBQUVELFlBQUksS0FBSyxRQUFULEVBQW1CO0FBQ2pCLGdCQUFNLElBQU4sR0FBYSxPQUFiO0FBQ0EsZ0JBQU0sWUFBTixJQUFzQixLQUFLLElBQTNCO0FBQ0EsaUJBQU8sTUFBTSxlQUFOLENBQVA7QUFDRDs7QUFFRCxhQUFLLElBQUksSUFBVCxJQUFpQixLQUFqQixFQUF3QjtBQUN0QixjQUFJLE1BQU0sTUFBTSxJQUFOLENBQVY7O0FBRUEsaUJBQU8sWUFBUCxDQUFvQixJQUFwQixFQUEwQixHQUExQjtBQUNEOztBQUVELFlBQUksS0FBSyxRQUFULEVBQW1CO0FBQ2pCLGNBQUksVUFBVSxFQUFFLE1BQUYsQ0FBZDs7QUFFQSxjQUFJLFFBQVEsU0FBUyxhQUFULENBQXVCLFFBQXZCLENBQVo7QUFDQSxnQkFBTSxTQUFOLEdBQWtCLHdCQUFsQjs7QUFFQSxjQUFJLFNBQVMsRUFBRSxLQUFGLENBQWI7QUFDQSxlQUFLLFFBQUwsQ0FBYyxJQUFkLEVBQW9CLEtBQXBCOztBQUVBLGNBQUksWUFBWSxFQUFoQjs7QUFFQSxlQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxRQUFMLENBQWMsTUFBbEMsRUFBMEMsR0FBMUMsRUFBK0M7QUFDN0MsZ0JBQUksUUFBUSxLQUFLLFFBQUwsQ0FBYyxDQUFkLENBQVo7O0FBRUEsZ0JBQUksU0FBUyxLQUFLLE1BQUwsQ0FBWSxLQUFaLENBQWI7O0FBRUEsc0JBQVUsSUFBVixDQUFlLE1BQWY7QUFDRDs7QUFFRCxjQUFJLHFCQUFxQixFQUFFLFdBQUYsRUFBZTtBQUN0QyxxQkFBUztBQUQ2QixXQUFmLENBQXpCOztBQUlBLDZCQUFtQixNQUFuQixDQUEwQixTQUExQjs7QUFFQSxrQkFBUSxNQUFSLENBQWUsS0FBZjtBQUNBLGtCQUFRLE1BQVIsQ0FBZSxrQkFBZjtBQUNELFNBM0JELE1BMkJPO0FBQ0wsZUFBSyxRQUFMLENBQWMsSUFBZCxFQUFvQixNQUFwQjtBQUNEOztBQUVELFVBQUUsSUFBRixDQUFPLE1BQVAsRUFBZSxNQUFmLEVBQXVCLElBQXZCOztBQUVBLGVBQU8sTUFBUDtBQUNELE9BeEVEOztBQTBFQSxjQUFRLFNBQVIsQ0FBa0IsSUFBbEIsR0FBeUIsVUFBVSxTQUFWLEVBQXFCLFVBQXJCLEVBQWlDO0FBQ3hELFlBQUksT0FBTyxJQUFYOztBQUVBLFlBQUksS0FBSyxVQUFVLEVBQVYsR0FBZSxVQUF4Qjs7QUFFQSxhQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLElBQW5CLEVBQXlCLEVBQXpCOztBQUVBLGtCQUFVLEVBQVYsQ0FBYSxhQUFiLEVBQTRCLFVBQVUsTUFBVixFQUFrQjtBQUM1QyxlQUFLLEtBQUw7QUFDQSxlQUFLLE1BQUwsQ0FBWSxPQUFPLElBQW5COztBQUVBLGNBQUksVUFBVSxNQUFWLEVBQUosRUFBd0I7QUFDdEIsaUJBQUssVUFBTDtBQUNBLGlCQUFLLGtCQUFMO0FBQ0Q7QUFDRixTQVJEOztBQVVBLGtCQUFVLEVBQVYsQ0FBYSxnQkFBYixFQUErQixVQUFVLE1BQVYsRUFBa0I7QUFDL0MsZUFBSyxNQUFMLENBQVksT0FBTyxJQUFuQjs7QUFFQSxjQUFJLFVBQVUsTUFBVixFQUFKLEVBQXdCO0FBQ3RCLGlCQUFLLFVBQUw7QUFDRDtBQUNGLFNBTkQ7O0FBUUEsa0JBQVUsRUFBVixDQUFhLE9BQWIsRUFBc0IsVUFBVSxNQUFWLEVBQWtCO0FBQ3RDLGVBQUssWUFBTDtBQUNBLGVBQUssV0FBTCxDQUFpQixNQUFqQjtBQUNELFNBSEQ7O0FBS0Esa0JBQVUsRUFBVixDQUFhLFFBQWIsRUFBdUIsWUFBWTtBQUNqQyxjQUFJLENBQUMsVUFBVSxNQUFWLEVBQUwsRUFBeUI7QUFDdkI7QUFDRDs7QUFFRCxlQUFLLFVBQUw7QUFDQSxlQUFLLGtCQUFMO0FBQ0QsU0FQRDs7QUFTQSxrQkFBVSxFQUFWLENBQWEsVUFBYixFQUF5QixZQUFZO0FBQ25DLGNBQUksQ0FBQyxVQUFVLE1BQVYsRUFBTCxFQUF5QjtBQUN2QjtBQUNEOztBQUVELGVBQUssVUFBTDtBQUNBLGVBQUssa0JBQUw7QUFDRCxTQVBEOztBQVNBLGtCQUFVLEVBQVYsQ0FBYSxNQUFiLEVBQXFCLFlBQVk7QUFDL0I7QUFDQSxlQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLGVBQW5CLEVBQW9DLE1BQXBDO0FBQ0EsZUFBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixhQUFuQixFQUFrQyxPQUFsQzs7QUFFQSxlQUFLLFVBQUw7QUFDQSxlQUFLLHNCQUFMO0FBQ0QsU0FQRDs7QUFTQSxrQkFBVSxFQUFWLENBQWEsT0FBYixFQUFzQixZQUFZO0FBQ2hDO0FBQ0EsZUFBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixlQUFuQixFQUFvQyxPQUFwQztBQUNBLGVBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsYUFBbkIsRUFBa0MsTUFBbEM7QUFDQSxlQUFLLFFBQUwsQ0FBYyxVQUFkLENBQXlCLHVCQUF6QjtBQUNELFNBTEQ7O0FBT0Esa0JBQVUsRUFBVixDQUFhLGdCQUFiLEVBQStCLFlBQVk7QUFDekMsY0FBSSxlQUFlLEtBQUsscUJBQUwsRUFBbkI7O0FBRUEsY0FBSSxhQUFhLE1BQWIsS0FBd0IsQ0FBNUIsRUFBK0I7QUFDN0I7QUFDRDs7QUFFRCx1QkFBYSxPQUFiLENBQXFCLFNBQXJCO0FBQ0QsU0FSRDs7QUFVQSxrQkFBVSxFQUFWLENBQWEsZ0JBQWIsRUFBK0IsWUFBWTtBQUN6QyxjQUFJLGVBQWUsS0FBSyxxQkFBTCxFQUFuQjs7QUFFQSxjQUFJLGFBQWEsTUFBYixLQUF3QixDQUE1QixFQUErQjtBQUM3QjtBQUNEOztBQUVELGNBQUksT0FBTyxhQUFhLElBQWIsQ0FBa0IsTUFBbEIsQ0FBWDs7QUFFQSxjQUFJLGFBQWEsSUFBYixDQUFrQixlQUFsQixLQUFzQyxNQUExQyxFQUFrRDtBQUNoRCxpQkFBSyxPQUFMLENBQWEsT0FBYixFQUFzQixFQUF0QjtBQUNELFdBRkQsTUFFTztBQUNMLGlCQUFLLE9BQUwsQ0FBYSxRQUFiLEVBQXVCO0FBQ3JCLG9CQUFNO0FBRGUsYUFBdkI7QUFHRDtBQUNGLFNBaEJEOztBQWtCQSxrQkFBVSxFQUFWLENBQWEsa0JBQWIsRUFBaUMsWUFBWTtBQUMzQyxjQUFJLGVBQWUsS0FBSyxxQkFBTCxFQUFuQjs7QUFFQSxjQUFJLFdBQVcsS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixpQkFBbkIsQ0FBZjs7QUFFQSxjQUFJLGVBQWUsU0FBUyxLQUFULENBQWUsWUFBZixDQUFuQjs7QUFFQTtBQUNBLGNBQUksaUJBQWlCLENBQXJCLEVBQXdCO0FBQ3RCO0FBQ0Q7O0FBRUQsY0FBSSxZQUFZLGVBQWUsQ0FBL0I7O0FBRUE7QUFDQSxjQUFJLGFBQWEsTUFBYixLQUF3QixDQUE1QixFQUErQjtBQUM3Qix3QkFBWSxDQUFaO0FBQ0Q7O0FBRUQsY0FBSSxRQUFRLFNBQVMsRUFBVCxDQUFZLFNBQVosQ0FBWjs7QUFFQSxnQkFBTSxPQUFOLENBQWMsWUFBZDs7QUFFQSxjQUFJLGdCQUFnQixLQUFLLFFBQUwsQ0FBYyxNQUFkLEdBQXVCLEdBQTNDO0FBQ0EsY0FBSSxVQUFVLE1BQU0sTUFBTixHQUFlLEdBQTdCO0FBQ0EsY0FBSSxhQUFhLEtBQUssUUFBTCxDQUFjLFNBQWQsTUFBNkIsVUFBVSxhQUF2QyxDQUFqQjs7QUFFQSxjQUFJLGNBQWMsQ0FBbEIsRUFBcUI7QUFDbkIsaUJBQUssUUFBTCxDQUFjLFNBQWQsQ0FBd0IsQ0FBeEI7QUFDRCxXQUZELE1BRU8sSUFBSSxVQUFVLGFBQVYsR0FBMEIsQ0FBOUIsRUFBaUM7QUFDdEMsaUJBQUssUUFBTCxDQUFjLFNBQWQsQ0FBd0IsVUFBeEI7QUFDRDtBQUNGLFNBaENEOztBQWtDQSxrQkFBVSxFQUFWLENBQWEsY0FBYixFQUE2QixZQUFZO0FBQ3ZDLGNBQUksZUFBZSxLQUFLLHFCQUFMLEVBQW5COztBQUVBLGNBQUksV0FBVyxLQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLGlCQUFuQixDQUFmOztBQUVBLGNBQUksZUFBZSxTQUFTLEtBQVQsQ0FBZSxZQUFmLENBQW5COztBQUVBLGNBQUksWUFBWSxlQUFlLENBQS9COztBQUVBO0FBQ0EsY0FBSSxhQUFhLFNBQVMsTUFBMUIsRUFBa0M7QUFDaEM7QUFDRDs7QUFFRCxjQUFJLFFBQVEsU0FBUyxFQUFULENBQVksU0FBWixDQUFaOztBQUVBLGdCQUFNLE9BQU4sQ0FBYyxZQUFkOztBQUVBLGNBQUksZ0JBQWdCLEtBQUssUUFBTCxDQUFjLE1BQWQsR0FBdUIsR0FBdkIsR0FDbEIsS0FBSyxRQUFMLENBQWMsV0FBZCxDQUEwQixLQUExQixDQURGO0FBRUEsY0FBSSxhQUFhLE1BQU0sTUFBTixHQUFlLEdBQWYsR0FBcUIsTUFBTSxXQUFOLENBQWtCLEtBQWxCLENBQXRDO0FBQ0EsY0FBSSxhQUFhLEtBQUssUUFBTCxDQUFjLFNBQWQsS0FBNEIsVUFBNUIsR0FBeUMsYUFBMUQ7O0FBRUEsY0FBSSxjQUFjLENBQWxCLEVBQXFCO0FBQ25CLGlCQUFLLFFBQUwsQ0FBYyxTQUFkLENBQXdCLENBQXhCO0FBQ0QsV0FGRCxNQUVPLElBQUksYUFBYSxhQUFqQixFQUFnQztBQUNyQyxpQkFBSyxRQUFMLENBQWMsU0FBZCxDQUF3QixVQUF4QjtBQUNEO0FBQ0YsU0E1QkQ7O0FBOEJBLGtCQUFVLEVBQVYsQ0FBYSxlQUFiLEVBQThCLFVBQVUsTUFBVixFQUFrQjtBQUM5QyxpQkFBTyxPQUFQLENBQWUsUUFBZixDQUF3QixzQ0FBeEI7QUFDRCxTQUZEOztBQUlBLGtCQUFVLEVBQVYsQ0FBYSxpQkFBYixFQUFnQyxVQUFVLE1BQVYsRUFBa0I7QUFDaEQsZUFBSyxjQUFMLENBQW9CLE1BQXBCO0FBQ0QsU0FGRDs7QUFJQSxZQUFJLEVBQUUsRUFBRixDQUFLLFVBQVQsRUFBcUI7QUFDbkIsZUFBSyxRQUFMLENBQWMsRUFBZCxDQUFpQixZQUFqQixFQUErQixVQUFVLENBQVYsRUFBYTtBQUMxQyxnQkFBSSxNQUFNLEtBQUssUUFBTCxDQUFjLFNBQWQsRUFBVjs7QUFFQSxnQkFBSSxTQUFTLEtBQUssUUFBTCxDQUFjLEdBQWQsQ0FBa0IsQ0FBbEIsRUFBcUIsWUFBckIsR0FBb0MsR0FBcEMsR0FBMEMsRUFBRSxNQUF6RDs7QUFFQSxnQkFBSSxVQUFVLEVBQUUsTUFBRixHQUFXLENBQVgsSUFBZ0IsTUFBTSxFQUFFLE1BQVIsSUFBa0IsQ0FBaEQ7QUFDQSxnQkFBSSxhQUFhLEVBQUUsTUFBRixHQUFXLENBQVgsSUFBZ0IsVUFBVSxLQUFLLFFBQUwsQ0FBYyxNQUFkLEVBQTNDOztBQUVBLGdCQUFJLE9BQUosRUFBYTtBQUNYLG1CQUFLLFFBQUwsQ0FBYyxTQUFkLENBQXdCLENBQXhCOztBQUVBLGdCQUFFLGNBQUY7QUFDQSxnQkFBRSxlQUFGO0FBQ0QsYUFMRCxNQUtPLElBQUksVUFBSixFQUFnQjtBQUNyQixtQkFBSyxRQUFMLENBQWMsU0FBZCxDQUNFLEtBQUssUUFBTCxDQUFjLEdBQWQsQ0FBa0IsQ0FBbEIsRUFBcUIsWUFBckIsR0FBb0MsS0FBSyxRQUFMLENBQWMsTUFBZCxFQUR0Qzs7QUFJQSxnQkFBRSxjQUFGO0FBQ0EsZ0JBQUUsZUFBRjtBQUNEO0FBQ0YsV0FyQkQ7QUFzQkQ7O0FBRUQsYUFBSyxRQUFMLENBQWMsRUFBZCxDQUFpQixTQUFqQixFQUE0Qix5Q0FBNUIsRUFDRSxVQUFVLEdBQVYsRUFBZTtBQUNmLGNBQUksUUFBUSxFQUFFLElBQUYsQ0FBWjs7QUFFQSxjQUFJLE9BQU8sTUFBTSxJQUFOLENBQVcsTUFBWCxDQUFYOztBQUVBLGNBQUksTUFBTSxJQUFOLENBQVcsZUFBWCxNQUFnQyxNQUFwQyxFQUE0QztBQUMxQyxnQkFBSSxLQUFLLE9BQUwsQ0FBYSxHQUFiLENBQWlCLFVBQWpCLENBQUosRUFBa0M7QUFDaEMsbUJBQUssT0FBTCxDQUFhLFVBQWIsRUFBeUI7QUFDdkIsK0JBQWUsR0FEUTtBQUV2QixzQkFBTTtBQUZpQixlQUF6QjtBQUlELGFBTEQsTUFLTztBQUNMLG1CQUFLLE9BQUwsQ0FBYSxPQUFiLEVBQXNCLEVBQXRCO0FBQ0Q7O0FBRUQ7QUFDRDs7QUFFRCxlQUFLLE9BQUwsQ0FBYSxRQUFiLEVBQXVCO0FBQ3JCLDJCQUFlLEdBRE07QUFFckIsa0JBQU07QUFGZSxXQUF2QjtBQUlELFNBdkJEOztBQXlCQSxhQUFLLFFBQUwsQ0FBYyxFQUFkLENBQWlCLFlBQWpCLEVBQStCLHlDQUEvQixFQUNFLFVBQVUsR0FBVixFQUFlO0FBQ2YsY0FBSSxPQUFPLEVBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxNQUFiLENBQVg7O0FBRUEsZUFBSyxxQkFBTCxHQUNLLFdBREwsQ0FDaUIsc0NBRGpCOztBQUdBLGVBQUssT0FBTCxDQUFhLGVBQWIsRUFBOEI7QUFDNUIsa0JBQU0sSUFEc0I7QUFFNUIscUJBQVMsRUFBRSxJQUFGO0FBRm1CLFdBQTlCO0FBSUQsU0FYRDtBQVlELE9BbE9EOztBQW9PQSxjQUFRLFNBQVIsQ0FBa0IscUJBQWxCLEdBQTBDLFlBQVk7QUFDcEQsWUFBSSxlQUFlLEtBQUssUUFBTCxDQUNsQixJQURrQixDQUNiLHVDQURhLENBQW5COztBQUdBLGVBQU8sWUFBUDtBQUNELE9BTEQ7O0FBT0EsY0FBUSxTQUFSLENBQWtCLE9BQWxCLEdBQTRCLFlBQVk7QUFDdEMsYUFBSyxRQUFMLENBQWMsTUFBZDtBQUNELE9BRkQ7O0FBSUEsY0FBUSxTQUFSLENBQWtCLHNCQUFsQixHQUEyQyxZQUFZO0FBQ3JELFlBQUksZUFBZSxLQUFLLHFCQUFMLEVBQW5COztBQUVBLFlBQUksYUFBYSxNQUFiLEtBQXdCLENBQTVCLEVBQStCO0FBQzdCO0FBQ0Q7O0FBRUQsWUFBSSxXQUFXLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsaUJBQW5CLENBQWY7O0FBRUEsWUFBSSxlQUFlLFNBQVMsS0FBVCxDQUFlLFlBQWYsQ0FBbkI7O0FBRUEsWUFBSSxnQkFBZ0IsS0FBSyxRQUFMLENBQWMsTUFBZCxHQUF1QixHQUEzQztBQUNBLFlBQUksVUFBVSxhQUFhLE1BQWIsR0FBc0IsR0FBcEM7QUFDQSxZQUFJLGFBQWEsS0FBSyxRQUFMLENBQWMsU0FBZCxNQUE2QixVQUFVLGFBQXZDLENBQWpCOztBQUVBLFlBQUksY0FBYyxVQUFVLGFBQTVCO0FBQ0Esc0JBQWMsYUFBYSxXQUFiLENBQXlCLEtBQXpCLElBQWtDLENBQWhEOztBQUVBLFlBQUksZ0JBQWdCLENBQXBCLEVBQXVCO0FBQ3JCLGVBQUssUUFBTCxDQUFjLFNBQWQsQ0FBd0IsQ0FBeEI7QUFDRCxTQUZELE1BRU8sSUFBSSxjQUFjLEtBQUssUUFBTCxDQUFjLFdBQWQsRUFBZCxJQUE2QyxjQUFjLENBQS9ELEVBQWtFO0FBQ3ZFLGVBQUssUUFBTCxDQUFjLFNBQWQsQ0FBd0IsVUFBeEI7QUFDRDtBQUNGLE9BdkJEOztBQXlCQSxjQUFRLFNBQVIsQ0FBa0IsUUFBbEIsR0FBNkIsVUFBVSxNQUFWLEVBQWtCLFNBQWxCLEVBQTZCO0FBQ3hELFlBQUksV0FBVyxLQUFLLE9BQUwsQ0FBYSxHQUFiLENBQWlCLGdCQUFqQixDQUFmO0FBQ0EsWUFBSSxlQUFlLEtBQUssT0FBTCxDQUFhLEdBQWIsQ0FBaUIsY0FBakIsQ0FBbkI7O0FBRUEsWUFBSSxVQUFVLFNBQVMsTUFBVCxFQUFpQixTQUFqQixDQUFkOztBQUVBLFlBQUksV0FBVyxJQUFmLEVBQXFCO0FBQ25CLG9CQUFVLEtBQVYsQ0FBZ0IsT0FBaEIsR0FBMEIsTUFBMUI7QUFDRCxTQUZELE1BRU8sSUFBSSxPQUFPLE9BQVAsS0FBbUIsUUFBdkIsRUFBaUM7QUFDdEMsb0JBQVUsU0FBVixHQUFzQixhQUFhLE9BQWIsQ0FBdEI7QUFDRCxTQUZNLE1BRUE7QUFDTCxZQUFFLFNBQUYsRUFBYSxNQUFiLENBQW9CLE9BQXBCO0FBQ0Q7QUFDRixPQWJEOztBQWVBLGFBQU8sT0FBUDtBQUNELEtBMWdCRDs7QUE0Z0JBLE9BQUcsTUFBSCxDQUFVLGNBQVYsRUFBeUIsRUFBekIsRUFFRyxZQUFZO0FBQ2IsVUFBSSxPQUFPO0FBQ1QsbUJBQVcsQ0FERjtBQUVULGFBQUssQ0FGSTtBQUdULGVBQU8sRUFIRTtBQUlULGVBQU8sRUFKRTtBQUtULGNBQU0sRUFMRztBQU1ULGFBQUssRUFOSTtBQU9ULGFBQUssRUFQSTtBQVFULGVBQU8sRUFSRTtBQVNULGlCQUFTLEVBVEE7QUFVVCxtQkFBVyxFQVZGO0FBV1QsYUFBSyxFQVhJO0FBWVQsY0FBTSxFQVpHO0FBYVQsY0FBTSxFQWJHO0FBY1QsWUFBSSxFQWRLO0FBZVQsZUFBTyxFQWZFO0FBZ0JULGNBQU0sRUFoQkc7QUFpQlQsZ0JBQVE7QUFqQkMsT0FBWDs7QUFvQkEsYUFBTyxJQUFQO0FBQ0QsS0F4QkQ7O0FBMEJBLE9BQUcsTUFBSCxDQUFVLHdCQUFWLEVBQW1DLENBQ2pDLFFBRGlDLEVBRWpDLFVBRmlDLEVBR2pDLFNBSGlDLENBQW5DLEVBSUcsVUFBVSxDQUFWLEVBQWEsS0FBYixFQUFvQixJQUFwQixFQUEwQjtBQUMzQixlQUFTLGFBQVQsQ0FBd0IsUUFBeEIsRUFBa0MsT0FBbEMsRUFBMkM7QUFDekMsYUFBSyxRQUFMLEdBQWdCLFFBQWhCO0FBQ0EsYUFBSyxPQUFMLEdBQWUsT0FBZjs7QUFFQSxzQkFBYyxTQUFkLENBQXdCLFdBQXhCLENBQW9DLElBQXBDLENBQXlDLElBQXpDO0FBQ0Q7O0FBRUQsWUFBTSxNQUFOLENBQWEsYUFBYixFQUE0QixNQUFNLFVBQWxDOztBQUVBLG9CQUFjLFNBQWQsQ0FBd0IsTUFBeEIsR0FBaUMsWUFBWTtBQUMzQyxZQUFJLGFBQWEsRUFDZixxREFDQSw4Q0FEQSxHQUVBLFNBSGUsQ0FBakI7O0FBTUEsYUFBSyxTQUFMLEdBQWlCLENBQWpCOztBQUVBLFlBQUksS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixjQUFuQixLQUFzQyxJQUExQyxFQUFnRDtBQUM5QyxlQUFLLFNBQUwsR0FBaUIsS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixjQUFuQixDQUFqQjtBQUNELFNBRkQsTUFFTyxJQUFJLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsVUFBbkIsS0FBa0MsSUFBdEMsRUFBNEM7QUFDakQsZUFBSyxTQUFMLEdBQWlCLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsVUFBbkIsQ0FBakI7QUFDRDs7QUFFRCxtQkFBVyxJQUFYLENBQWdCLE9BQWhCLEVBQXlCLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsT0FBbkIsQ0FBekI7QUFDQSxtQkFBVyxJQUFYLENBQWdCLFVBQWhCLEVBQTRCLEtBQUssU0FBakM7O0FBRUEsYUFBSyxVQUFMLEdBQWtCLFVBQWxCOztBQUVBLGVBQU8sVUFBUDtBQUNELE9BckJEOztBQXVCQSxvQkFBYyxTQUFkLENBQXdCLElBQXhCLEdBQStCLFVBQVUsU0FBVixFQUFxQixVQUFyQixFQUFpQztBQUM5RCxZQUFJLE9BQU8sSUFBWDs7QUFFQSxZQUFJLEtBQUssVUFBVSxFQUFWLEdBQWUsWUFBeEI7QUFDQSxZQUFJLFlBQVksVUFBVSxFQUFWLEdBQWUsVUFBL0I7O0FBRUEsYUFBSyxTQUFMLEdBQWlCLFNBQWpCOztBQUVBLGFBQUssVUFBTCxDQUFnQixFQUFoQixDQUFtQixPQUFuQixFQUE0QixVQUFVLEdBQVYsRUFBZTtBQUN6QyxlQUFLLE9BQUwsQ0FBYSxPQUFiLEVBQXNCLEdBQXRCO0FBQ0QsU0FGRDs7QUFJQSxhQUFLLFVBQUwsQ0FBZ0IsRUFBaEIsQ0FBbUIsTUFBbkIsRUFBMkIsVUFBVSxHQUFWLEVBQWU7QUFDeEMsZUFBSyxXQUFMLENBQWlCLEdBQWpCO0FBQ0QsU0FGRDs7QUFJQSxhQUFLLFVBQUwsQ0FBZ0IsRUFBaEIsQ0FBbUIsU0FBbkIsRUFBOEIsVUFBVSxHQUFWLEVBQWU7QUFDM0MsZUFBSyxPQUFMLENBQWEsVUFBYixFQUF5QixHQUF6Qjs7QUFFQSxjQUFJLElBQUksS0FBSixLQUFjLEtBQUssS0FBdkIsRUFBOEI7QUFDNUIsZ0JBQUksY0FBSjtBQUNEO0FBQ0YsU0FORDs7QUFRQSxrQkFBVSxFQUFWLENBQWEsZUFBYixFQUE4QixVQUFVLE1BQVYsRUFBa0I7QUFDOUMsZUFBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLHVCQUFyQixFQUE4QyxPQUFPLElBQVAsQ0FBWSxTQUExRDtBQUNELFNBRkQ7O0FBSUEsa0JBQVUsRUFBVixDQUFhLGtCQUFiLEVBQWlDLFVBQVUsTUFBVixFQUFrQjtBQUNqRCxlQUFLLE1BQUwsQ0FBWSxPQUFPLElBQW5CO0FBQ0QsU0FGRDs7QUFJQSxrQkFBVSxFQUFWLENBQWEsTUFBYixFQUFxQixZQUFZO0FBQy9CO0FBQ0EsZUFBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLGVBQXJCLEVBQXNDLE1BQXRDO0FBQ0EsZUFBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLFdBQXJCLEVBQWtDLFNBQWxDOztBQUVBLGVBQUssbUJBQUwsQ0FBeUIsU0FBekI7QUFDRCxTQU5EOztBQVFBLGtCQUFVLEVBQVYsQ0FBYSxPQUFiLEVBQXNCLFlBQVk7QUFDaEM7QUFDQSxlQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsZUFBckIsRUFBc0MsT0FBdEM7QUFDQSxlQUFLLFVBQUwsQ0FBZ0IsVUFBaEIsQ0FBMkIsdUJBQTNCO0FBQ0EsZUFBSyxVQUFMLENBQWdCLFVBQWhCLENBQTJCLFdBQTNCOztBQUVBLGVBQUssVUFBTCxDQUFnQixLQUFoQjs7QUFFQSxlQUFLLG1CQUFMLENBQXlCLFNBQXpCO0FBQ0QsU0FURDs7QUFXQSxrQkFBVSxFQUFWLENBQWEsUUFBYixFQUF1QixZQUFZO0FBQ2pDLGVBQUssVUFBTCxDQUFnQixJQUFoQixDQUFxQixVQUFyQixFQUFpQyxLQUFLLFNBQXRDO0FBQ0QsU0FGRDs7QUFJQSxrQkFBVSxFQUFWLENBQWEsU0FBYixFQUF3QixZQUFZO0FBQ2xDLGVBQUssVUFBTCxDQUFnQixJQUFoQixDQUFxQixVQUFyQixFQUFpQyxJQUFqQztBQUNELFNBRkQ7QUFHRCxPQTFERDs7QUE0REEsb0JBQWMsU0FBZCxDQUF3QixXQUF4QixHQUFzQyxVQUFVLEdBQVYsRUFBZTtBQUNuRCxZQUFJLE9BQU8sSUFBWDs7QUFFQTtBQUNBO0FBQ0EsZUFBTyxVQUFQLENBQWtCLFlBQVk7QUFDNUI7QUFDQSxjQUNHLFNBQVMsYUFBVCxJQUEwQixLQUFLLFVBQUwsQ0FBZ0IsQ0FBaEIsQ0FBM0IsSUFDQyxFQUFFLFFBQUYsQ0FBVyxLQUFLLFVBQUwsQ0FBZ0IsQ0FBaEIsQ0FBWCxFQUErQixTQUFTLGFBQXhDLENBRkgsRUFHRTtBQUNBO0FBQ0Q7O0FBRUQsZUFBSyxPQUFMLENBQWEsTUFBYixFQUFxQixHQUFyQjtBQUNELFNBVkQsRUFVRyxDQVZIO0FBV0QsT0FoQkQ7O0FBa0JBLG9CQUFjLFNBQWQsQ0FBd0IsbUJBQXhCLEdBQThDLFVBQVUsU0FBVixFQUFxQjtBQUNqRSxZQUFJLE9BQU8sSUFBWDs7QUFFQSxVQUFFLFNBQVMsSUFBWCxFQUFpQixFQUFqQixDQUFvQix1QkFBdUIsVUFBVSxFQUFyRCxFQUF5RCxVQUFVLENBQVYsRUFBYTtBQUNwRSxjQUFJLFVBQVUsRUFBRSxFQUFFLE1BQUosQ0FBZDs7QUFFQSxjQUFJLFVBQVUsUUFBUSxPQUFSLENBQWdCLFVBQWhCLENBQWQ7O0FBRUEsY0FBSSxPQUFPLEVBQUUsa0NBQUYsQ0FBWDs7QUFFQSxlQUFLLElBQUwsQ0FBVSxZQUFZO0FBQ3BCLGdCQUFJLFFBQVEsRUFBRSxJQUFGLENBQVo7O0FBRUEsZ0JBQUksUUFBUSxRQUFRLENBQVIsQ0FBWixFQUF3QjtBQUN0QjtBQUNEOztBQUVELGdCQUFJLFdBQVcsTUFBTSxJQUFOLENBQVcsU0FBWCxDQUFmOztBQUVBLHFCQUFTLE9BQVQsQ0FBaUIsT0FBakI7QUFDRCxXQVZEO0FBV0QsU0FsQkQ7QUFtQkQsT0F0QkQ7O0FBd0JBLG9CQUFjLFNBQWQsQ0FBd0IsbUJBQXhCLEdBQThDLFVBQVUsU0FBVixFQUFxQjtBQUNqRSxVQUFFLFNBQVMsSUFBWCxFQUFpQixHQUFqQixDQUFxQix1QkFBdUIsVUFBVSxFQUF0RDtBQUNELE9BRkQ7O0FBSUEsb0JBQWMsU0FBZCxDQUF3QixRQUF4QixHQUFtQyxVQUFVLFVBQVYsRUFBc0IsVUFBdEIsRUFBa0M7QUFDbkUsWUFBSSxzQkFBc0IsV0FBVyxJQUFYLENBQWdCLFlBQWhCLENBQTFCO0FBQ0EsNEJBQW9CLE1BQXBCLENBQTJCLFVBQTNCO0FBQ0QsT0FIRDs7QUFLQSxvQkFBYyxTQUFkLENBQXdCLE9BQXhCLEdBQWtDLFlBQVk7QUFDNUMsYUFBSyxtQkFBTCxDQUF5QixLQUFLLFNBQTlCO0FBQ0QsT0FGRDs7QUFJQSxvQkFBYyxTQUFkLENBQXdCLE1BQXhCLEdBQWlDLFVBQVUsSUFBVixFQUFnQjtBQUMvQyxjQUFNLElBQUksS0FBSixDQUFVLHVEQUFWLENBQU47QUFDRCxPQUZEOztBQUlBLGFBQU8sYUFBUDtBQUNELEtBN0pEOztBQStKQSxPQUFHLE1BQUgsQ0FBVSwwQkFBVixFQUFxQyxDQUNuQyxRQURtQyxFQUVuQyxRQUZtQyxFQUduQyxVQUhtQyxFQUluQyxTQUptQyxDQUFyQyxFQUtHLFVBQVUsQ0FBVixFQUFhLGFBQWIsRUFBNEIsS0FBNUIsRUFBbUMsSUFBbkMsRUFBeUM7QUFDMUMsZUFBUyxlQUFULEdBQTRCO0FBQzFCLHdCQUFnQixTQUFoQixDQUEwQixXQUExQixDQUFzQyxLQUF0QyxDQUE0QyxJQUE1QyxFQUFrRCxTQUFsRDtBQUNEOztBQUVELFlBQU0sTUFBTixDQUFhLGVBQWIsRUFBOEIsYUFBOUI7O0FBRUEsc0JBQWdCLFNBQWhCLENBQTBCLE1BQTFCLEdBQW1DLFlBQVk7QUFDN0MsWUFBSSxhQUFhLGdCQUFnQixTQUFoQixDQUEwQixNQUExQixDQUFpQyxJQUFqQyxDQUFzQyxJQUF0QyxDQUFqQjs7QUFFQSxtQkFBVyxRQUFYLENBQW9CLDJCQUFwQjs7QUFFQSxtQkFBVyxJQUFYLENBQ0Usc0RBQ0EsNkRBREEsR0FFRSw2QkFGRixHQUdBLFNBSkY7O0FBT0EsZUFBTyxVQUFQO0FBQ0QsT0FiRDs7QUFlQSxzQkFBZ0IsU0FBaEIsQ0FBMEIsSUFBMUIsR0FBaUMsVUFBVSxTQUFWLEVBQXFCLFVBQXJCLEVBQWlDO0FBQ2hFLFlBQUksT0FBTyxJQUFYOztBQUVBLHdCQUFnQixTQUFoQixDQUEwQixJQUExQixDQUErQixLQUEvQixDQUFxQyxJQUFyQyxFQUEyQyxTQUEzQzs7QUFFQSxZQUFJLEtBQUssVUFBVSxFQUFWLEdBQWUsWUFBeEI7O0FBRUEsYUFBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLDhCQUFyQixFQUFxRCxJQUFyRCxDQUEwRCxJQUExRCxFQUFnRSxFQUFoRTtBQUNBLGFBQUssVUFBTCxDQUFnQixJQUFoQixDQUFxQixpQkFBckIsRUFBd0MsRUFBeEM7O0FBRUEsYUFBSyxVQUFMLENBQWdCLEVBQWhCLENBQW1CLFdBQW5CLEVBQWdDLFVBQVUsR0FBVixFQUFlO0FBQzdDO0FBQ0EsY0FBSSxJQUFJLEtBQUosS0FBYyxDQUFsQixFQUFxQjtBQUNuQjtBQUNEOztBQUVELGVBQUssT0FBTCxDQUFhLFFBQWIsRUFBdUI7QUFDckIsMkJBQWU7QUFETSxXQUF2QjtBQUdELFNBVEQ7O0FBV0EsYUFBSyxVQUFMLENBQWdCLEVBQWhCLENBQW1CLE9BQW5CLEVBQTRCLFVBQVUsR0FBVixFQUFlO0FBQ3pDO0FBQ0QsU0FGRDs7QUFJQSxhQUFLLFVBQUwsQ0FBZ0IsRUFBaEIsQ0FBbUIsTUFBbkIsRUFBMkIsVUFBVSxHQUFWLEVBQWU7QUFDeEM7QUFDRCxTQUZEOztBQUlBLGtCQUFVLEVBQVYsQ0FBYSxPQUFiLEVBQXNCLFVBQVUsR0FBVixFQUFlO0FBQ25DLGNBQUksQ0FBQyxVQUFVLE1BQVYsRUFBTCxFQUF5QjtBQUN2QixpQkFBSyxVQUFMLENBQWdCLEtBQWhCO0FBQ0Q7QUFDRixTQUpEOztBQU1BLGtCQUFVLEVBQVYsQ0FBYSxrQkFBYixFQUFpQyxVQUFVLE1BQVYsRUFBa0I7QUFDakQsZUFBSyxNQUFMLENBQVksT0FBTyxJQUFuQjtBQUNELFNBRkQ7QUFHRCxPQXRDRDs7QUF3Q0Esc0JBQWdCLFNBQWhCLENBQTBCLEtBQTFCLEdBQWtDLFlBQVk7QUFDNUMsYUFBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLDhCQUFyQixFQUFxRCxLQUFyRDtBQUNELE9BRkQ7O0FBSUEsc0JBQWdCLFNBQWhCLENBQTBCLE9BQTFCLEdBQW9DLFVBQVUsSUFBVixFQUFnQixTQUFoQixFQUEyQjtBQUM3RCxZQUFJLFdBQVcsS0FBSyxPQUFMLENBQWEsR0FBYixDQUFpQixtQkFBakIsQ0FBZjtBQUNBLFlBQUksZUFBZSxLQUFLLE9BQUwsQ0FBYSxHQUFiLENBQWlCLGNBQWpCLENBQW5COztBQUVBLGVBQU8sYUFBYSxTQUFTLElBQVQsRUFBZSxTQUFmLENBQWIsQ0FBUDtBQUNELE9BTEQ7O0FBT0Esc0JBQWdCLFNBQWhCLENBQTBCLGtCQUExQixHQUErQyxZQUFZO0FBQ3pELGVBQU8sRUFBRSxlQUFGLENBQVA7QUFDRCxPQUZEOztBQUlBLHNCQUFnQixTQUFoQixDQUEwQixNQUExQixHQUFtQyxVQUFVLElBQVYsRUFBZ0I7QUFDakQsWUFBSSxLQUFLLE1BQUwsS0FBZ0IsQ0FBcEIsRUFBdUI7QUFDckIsZUFBSyxLQUFMO0FBQ0E7QUFDRDs7QUFFRCxZQUFJLFlBQVksS0FBSyxDQUFMLENBQWhCOztBQUVBLFlBQUksWUFBWSxLQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsOEJBQXJCLENBQWhCO0FBQ0EsWUFBSSxZQUFZLEtBQUssT0FBTCxDQUFhLFNBQWIsRUFBd0IsU0FBeEIsQ0FBaEI7O0FBRUEsa0JBQVUsS0FBVixHQUFrQixNQUFsQixDQUF5QixTQUF6QjtBQUNBLGtCQUFVLElBQVYsQ0FBZSxPQUFmLEVBQXdCLFVBQVUsS0FBVixJQUFtQixVQUFVLElBQXJEO0FBQ0QsT0FiRDs7QUFlQSxhQUFPLGVBQVA7QUFDRCxLQWxHRDs7QUFvR0EsT0FBRyxNQUFILENBQVUsNEJBQVYsRUFBdUMsQ0FDckMsUUFEcUMsRUFFckMsUUFGcUMsRUFHckMsVUFIcUMsQ0FBdkMsRUFJRyxVQUFVLENBQVYsRUFBYSxhQUFiLEVBQTRCLEtBQTVCLEVBQW1DO0FBQ3BDLGVBQVMsaUJBQVQsQ0FBNEIsUUFBNUIsRUFBc0MsT0FBdEMsRUFBK0M7QUFDN0MsMEJBQWtCLFNBQWxCLENBQTRCLFdBQTVCLENBQXdDLEtBQXhDLENBQThDLElBQTlDLEVBQW9ELFNBQXBEO0FBQ0Q7O0FBRUQsWUFBTSxNQUFOLENBQWEsaUJBQWIsRUFBZ0MsYUFBaEM7O0FBRUEsd0JBQWtCLFNBQWxCLENBQTRCLE1BQTVCLEdBQXFDLFlBQVk7QUFDL0MsWUFBSSxhQUFhLGtCQUFrQixTQUFsQixDQUE0QixNQUE1QixDQUFtQyxJQUFuQyxDQUF3QyxJQUF4QyxDQUFqQjs7QUFFQSxtQkFBVyxRQUFYLENBQW9CLDZCQUFwQjs7QUFFQSxtQkFBVyxJQUFYLENBQ0UsK0NBREY7O0FBSUEsZUFBTyxVQUFQO0FBQ0QsT0FWRDs7QUFZQSx3QkFBa0IsU0FBbEIsQ0FBNEIsSUFBNUIsR0FBbUMsVUFBVSxTQUFWLEVBQXFCLFVBQXJCLEVBQWlDO0FBQ2xFLFlBQUksT0FBTyxJQUFYOztBQUVBLDBCQUFrQixTQUFsQixDQUE0QixJQUE1QixDQUFpQyxLQUFqQyxDQUF1QyxJQUF2QyxFQUE2QyxTQUE3Qzs7QUFFQSxhQUFLLFVBQUwsQ0FBZ0IsRUFBaEIsQ0FBbUIsT0FBbkIsRUFBNEIsVUFBVSxHQUFWLEVBQWU7QUFDekMsZUFBSyxPQUFMLENBQWEsUUFBYixFQUF1QjtBQUNyQiwyQkFBZTtBQURNLFdBQXZCO0FBR0QsU0FKRDs7QUFNQSxhQUFLLFVBQUwsQ0FBZ0IsRUFBaEIsQ0FDRSxPQURGLEVBRUUsb0NBRkYsRUFHRSxVQUFVLEdBQVYsRUFBZTtBQUNiO0FBQ0EsY0FBSSxLQUFLLE9BQUwsQ0FBYSxHQUFiLENBQWlCLFVBQWpCLENBQUosRUFBa0M7QUFDaEM7QUFDRDs7QUFFRCxjQUFJLFVBQVUsRUFBRSxJQUFGLENBQWQ7QUFDQSxjQUFJLGFBQWEsUUFBUSxNQUFSLEVBQWpCOztBQUVBLGNBQUksT0FBTyxXQUFXLElBQVgsQ0FBZ0IsTUFBaEIsQ0FBWDs7QUFFQSxlQUFLLE9BQUwsQ0FBYSxVQUFiLEVBQXlCO0FBQ3ZCLDJCQUFlLEdBRFE7QUFFdkIsa0JBQU07QUFGaUIsV0FBekI7QUFJRCxTQWxCSDtBQW9CRCxPQS9CRDs7QUFpQ0Esd0JBQWtCLFNBQWxCLENBQTRCLEtBQTVCLEdBQW9DLFlBQVk7QUFDOUMsYUFBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLDhCQUFyQixFQUFxRCxLQUFyRDtBQUNELE9BRkQ7O0FBSUEsd0JBQWtCLFNBQWxCLENBQTRCLE9BQTVCLEdBQXNDLFVBQVUsSUFBVixFQUFnQixTQUFoQixFQUEyQjtBQUMvRCxZQUFJLFdBQVcsS0FBSyxPQUFMLENBQWEsR0FBYixDQUFpQixtQkFBakIsQ0FBZjtBQUNBLFlBQUksZUFBZSxLQUFLLE9BQUwsQ0FBYSxHQUFiLENBQWlCLGNBQWpCLENBQW5COztBQUVBLGVBQU8sYUFBYSxTQUFTLElBQVQsRUFBZSxTQUFmLENBQWIsQ0FBUDtBQUNELE9BTEQ7O0FBT0Esd0JBQWtCLFNBQWxCLENBQTRCLGtCQUE1QixHQUFpRCxZQUFZO0FBQzNELFlBQUksYUFBYSxFQUNmLDJDQUNFLHNFQURGLEdBRUksU0FGSixHQUdFLFNBSEYsR0FJQSxPQUxlLENBQWpCOztBQVFBLGVBQU8sVUFBUDtBQUNELE9BVkQ7O0FBWUEsd0JBQWtCLFNBQWxCLENBQTRCLE1BQTVCLEdBQXFDLFVBQVUsSUFBVixFQUFnQjtBQUNuRCxhQUFLLEtBQUw7O0FBRUEsWUFBSSxLQUFLLE1BQUwsS0FBZ0IsQ0FBcEIsRUFBdUI7QUFDckI7QUFDRDs7QUFFRCxZQUFJLGNBQWMsRUFBbEI7O0FBRUEsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssTUFBekIsRUFBaUMsR0FBakMsRUFBc0M7QUFDcEMsY0FBSSxZQUFZLEtBQUssQ0FBTCxDQUFoQjs7QUFFQSxjQUFJLGFBQWEsS0FBSyxrQkFBTCxFQUFqQjtBQUNBLGNBQUksWUFBWSxLQUFLLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLFVBQXhCLENBQWhCOztBQUVBLHFCQUFXLE1BQVgsQ0FBa0IsU0FBbEI7QUFDQSxxQkFBVyxJQUFYLENBQWdCLE9BQWhCLEVBQXlCLFVBQVUsS0FBVixJQUFtQixVQUFVLElBQXREOztBQUVBLHFCQUFXLElBQVgsQ0FBZ0IsTUFBaEIsRUFBd0IsU0FBeEI7O0FBRUEsc0JBQVksSUFBWixDQUFpQixVQUFqQjtBQUNEOztBQUVELFlBQUksWUFBWSxLQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsOEJBQXJCLENBQWhCOztBQUVBLGNBQU0sVUFBTixDQUFpQixTQUFqQixFQUE0QixXQUE1QjtBQUNELE9BMUJEOztBQTRCQSxhQUFPLGlCQUFQO0FBQ0QsS0E1R0Q7O0FBOEdBLE9BQUcsTUFBSCxDQUFVLCtCQUFWLEVBQTBDLENBQ3hDLFVBRHdDLENBQTFDLEVBRUcsVUFBVSxLQUFWLEVBQWlCO0FBQ2xCLGVBQVMsV0FBVCxDQUFzQixTQUF0QixFQUFpQyxRQUFqQyxFQUEyQyxPQUEzQyxFQUFvRDtBQUNsRCxhQUFLLFdBQUwsR0FBbUIsS0FBSyxvQkFBTCxDQUEwQixRQUFRLEdBQVIsQ0FBWSxhQUFaLENBQTFCLENBQW5COztBQUVBLGtCQUFVLElBQVYsQ0FBZSxJQUFmLEVBQXFCLFFBQXJCLEVBQStCLE9BQS9CO0FBQ0Q7O0FBRUQsa0JBQVksU0FBWixDQUFzQixvQkFBdEIsR0FBNkMsVUFBVSxDQUFWLEVBQWEsV0FBYixFQUEwQjtBQUNyRSxZQUFJLE9BQU8sV0FBUCxLQUF1QixRQUEzQixFQUFxQztBQUNuQyx3QkFBYztBQUNaLGdCQUFJLEVBRFE7QUFFWixrQkFBTTtBQUZNLFdBQWQ7QUFJRDs7QUFFRCxlQUFPLFdBQVA7QUFDRCxPQVREOztBQVdBLGtCQUFZLFNBQVosQ0FBc0IsaUJBQXRCLEdBQTBDLFVBQVUsU0FBVixFQUFxQixXQUFyQixFQUFrQztBQUMxRSxZQUFJLGVBQWUsS0FBSyxrQkFBTCxFQUFuQjs7QUFFQSxxQkFBYSxJQUFiLENBQWtCLEtBQUssT0FBTCxDQUFhLFdBQWIsQ0FBbEI7QUFDQSxxQkFBYSxRQUFiLENBQXNCLGdDQUF0QixFQUNhLFdBRGIsQ0FDeUIsMkJBRHpCOztBQUdBLGVBQU8sWUFBUDtBQUNELE9BUkQ7O0FBVUEsa0JBQVksU0FBWixDQUFzQixNQUF0QixHQUErQixVQUFVLFNBQVYsRUFBcUIsSUFBckIsRUFBMkI7QUFDeEQsWUFBSSxvQkFDRixLQUFLLE1BQUwsSUFBZSxDQUFmLElBQW9CLEtBQUssQ0FBTCxFQUFRLEVBQVIsSUFBYyxLQUFLLFdBQUwsQ0FBaUIsRUFEckQ7QUFHQSxZQUFJLHFCQUFxQixLQUFLLE1BQUwsR0FBYyxDQUF2Qzs7QUFFQSxZQUFJLHNCQUFzQixpQkFBMUIsRUFBNkM7QUFDM0MsaUJBQU8sVUFBVSxJQUFWLENBQWUsSUFBZixFQUFxQixJQUFyQixDQUFQO0FBQ0Q7O0FBRUQsYUFBSyxLQUFMOztBQUVBLFlBQUksZUFBZSxLQUFLLGlCQUFMLENBQXVCLEtBQUssV0FBNUIsQ0FBbkI7O0FBRUEsYUFBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLDhCQUFyQixFQUFxRCxNQUFyRCxDQUE0RCxZQUE1RDtBQUNELE9BZkQ7O0FBaUJBLGFBQU8sV0FBUDtBQUNELEtBaEREOztBQWtEQSxPQUFHLE1BQUgsQ0FBVSw4QkFBVixFQUF5QyxDQUN2QyxRQUR1QyxFQUV2QyxTQUZ1QyxDQUF6QyxFQUdHLFVBQVUsQ0FBVixFQUFhLElBQWIsRUFBbUI7QUFDcEIsZUFBUyxVQUFULEdBQXVCLENBQUc7O0FBRTFCLGlCQUFXLFNBQVgsQ0FBcUIsSUFBckIsR0FBNEIsVUFBVSxTQUFWLEVBQXFCLFNBQXJCLEVBQWdDLFVBQWhDLEVBQTRDO0FBQ3RFLFlBQUksT0FBTyxJQUFYOztBQUVBLGtCQUFVLElBQVYsQ0FBZSxJQUFmLEVBQXFCLFNBQXJCLEVBQWdDLFVBQWhDOztBQUVBLFlBQUksS0FBSyxXQUFMLElBQW9CLElBQXhCLEVBQThCO0FBQzVCLGNBQUksS0FBSyxPQUFMLENBQWEsR0FBYixDQUFpQixPQUFqQixLQUE2QixPQUFPLE9BQXBDLElBQStDLFFBQVEsS0FBM0QsRUFBa0U7QUFDaEUsb0JBQVEsS0FBUixDQUNFLG9FQUNBLGdDQUZGO0FBSUQ7QUFDRjs7QUFFRCxhQUFLLFVBQUwsQ0FBZ0IsRUFBaEIsQ0FBbUIsV0FBbkIsRUFBZ0MsMkJBQWhDLEVBQ0UsVUFBVSxHQUFWLEVBQWU7QUFDYixlQUFLLFlBQUwsQ0FBa0IsR0FBbEI7QUFDSCxTQUhEOztBQUtBLGtCQUFVLEVBQVYsQ0FBYSxVQUFiLEVBQXlCLFVBQVUsR0FBVixFQUFlO0FBQ3RDLGVBQUssb0JBQUwsQ0FBMEIsR0FBMUIsRUFBK0IsU0FBL0I7QUFDRCxTQUZEO0FBR0QsT0F0QkQ7O0FBd0JBLGlCQUFXLFNBQVgsQ0FBcUIsWUFBckIsR0FBb0MsVUFBVSxDQUFWLEVBQWEsR0FBYixFQUFrQjtBQUNwRDtBQUNBLFlBQUksS0FBSyxPQUFMLENBQWEsR0FBYixDQUFpQixVQUFqQixDQUFKLEVBQWtDO0FBQ2hDO0FBQ0Q7O0FBRUQsWUFBSSxTQUFTLEtBQUssVUFBTCxDQUFnQixJQUFoQixDQUFxQiwyQkFBckIsQ0FBYjs7QUFFQTtBQUNBLFlBQUksT0FBTyxNQUFQLEtBQWtCLENBQXRCLEVBQXlCO0FBQ3ZCO0FBQ0Q7O0FBRUQsWUFBSSxlQUFKOztBQUVBLFlBQUksT0FBTyxPQUFPLElBQVAsQ0FBWSxNQUFaLENBQVg7O0FBRUEsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssTUFBekIsRUFBaUMsR0FBakMsRUFBc0M7QUFDcEMsY0FBSSxlQUFlO0FBQ2pCLGtCQUFNLEtBQUssQ0FBTDtBQURXLFdBQW5COztBQUlBO0FBQ0E7QUFDQSxlQUFLLE9BQUwsQ0FBYSxVQUFiLEVBQXlCLFlBQXpCOztBQUVBO0FBQ0EsY0FBSSxhQUFhLFNBQWpCLEVBQTRCO0FBQzFCO0FBQ0Q7QUFDRjs7QUFFRCxhQUFLLFFBQUwsQ0FBYyxHQUFkLENBQWtCLEtBQUssV0FBTCxDQUFpQixFQUFuQyxFQUF1QyxPQUF2QyxDQUErQyxRQUEvQzs7QUFFQSxhQUFLLE9BQUwsQ0FBYSxRQUFiLEVBQXVCLEVBQXZCO0FBQ0QsT0FuQ0Q7O0FBcUNBLGlCQUFXLFNBQVgsQ0FBcUIsb0JBQXJCLEdBQTRDLFVBQVUsQ0FBVixFQUFhLEdBQWIsRUFBa0IsU0FBbEIsRUFBNkI7QUFDdkUsWUFBSSxVQUFVLE1BQVYsRUFBSixFQUF3QjtBQUN0QjtBQUNEOztBQUVELFlBQUksSUFBSSxLQUFKLElBQWEsS0FBSyxNQUFsQixJQUE0QixJQUFJLEtBQUosSUFBYSxLQUFLLFNBQWxELEVBQTZEO0FBQzNELGVBQUssWUFBTCxDQUFrQixHQUFsQjtBQUNEO0FBQ0YsT0FSRDs7QUFVQSxpQkFBVyxTQUFYLENBQXFCLE1BQXJCLEdBQThCLFVBQVUsU0FBVixFQUFxQixJQUFyQixFQUEyQjtBQUN2RCxrQkFBVSxJQUFWLENBQWUsSUFBZixFQUFxQixJQUFyQjs7QUFFQSxZQUFJLEtBQUssVUFBTCxDQUFnQixJQUFoQixDQUFxQixpQ0FBckIsRUFBd0QsTUFBeEQsR0FBaUUsQ0FBakUsSUFDQSxLQUFLLE1BQUwsS0FBZ0IsQ0FEcEIsRUFDdUI7QUFDckI7QUFDRDs7QUFFRCxZQUFJLFVBQVUsRUFDWiw0Q0FDRSxTQURGLEdBRUEsU0FIWSxDQUFkO0FBS0EsZ0JBQVEsSUFBUixDQUFhLE1BQWIsRUFBcUIsSUFBckI7O0FBRUEsYUFBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLDhCQUFyQixFQUFxRCxPQUFyRCxDQUE2RCxPQUE3RDtBQUNELE9BaEJEOztBQWtCQSxhQUFPLFVBQVA7QUFDRCxLQWhHRDs7QUFrR0EsT0FBRyxNQUFILENBQVUsMEJBQVYsRUFBcUMsQ0FDbkMsUUFEbUMsRUFFbkMsVUFGbUMsRUFHbkMsU0FIbUMsQ0FBckMsRUFJRyxVQUFVLENBQVYsRUFBYSxLQUFiLEVBQW9CLElBQXBCLEVBQTBCO0FBQzNCLGVBQVMsTUFBVCxDQUFpQixTQUFqQixFQUE0QixRQUE1QixFQUFzQyxPQUF0QyxFQUErQztBQUM3QyxrQkFBVSxJQUFWLENBQWUsSUFBZixFQUFxQixRQUFyQixFQUErQixPQUEvQjtBQUNEOztBQUVELGFBQU8sU0FBUCxDQUFpQixNQUFqQixHQUEwQixVQUFVLFNBQVYsRUFBcUI7QUFDN0MsWUFBSSxVQUFVLEVBQ1osdURBQ0Usa0VBREYsR0FFRSw0REFGRixHQUdFLGdFQUhGLEdBSUEsT0FMWSxDQUFkOztBQVFBLGFBQUssZ0JBQUwsR0FBd0IsT0FBeEI7QUFDQSxhQUFLLE9BQUwsR0FBZSxRQUFRLElBQVIsQ0FBYSxPQUFiLENBQWY7O0FBRUEsWUFBSSxZQUFZLFVBQVUsSUFBVixDQUFlLElBQWYsQ0FBaEI7O0FBRUEsYUFBSyxpQkFBTDs7QUFFQSxlQUFPLFNBQVA7QUFDRCxPQWpCRDs7QUFtQkEsYUFBTyxTQUFQLENBQWlCLElBQWpCLEdBQXdCLFVBQVUsU0FBVixFQUFxQixTQUFyQixFQUFnQyxVQUFoQyxFQUE0QztBQUNsRSxZQUFJLE9BQU8sSUFBWDs7QUFFQSxrQkFBVSxJQUFWLENBQWUsSUFBZixFQUFxQixTQUFyQixFQUFnQyxVQUFoQzs7QUFFQSxrQkFBVSxFQUFWLENBQWEsTUFBYixFQUFxQixZQUFZO0FBQy9CLGVBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsT0FBckI7QUFDRCxTQUZEOztBQUlBLGtCQUFVLEVBQVYsQ0FBYSxPQUFiLEVBQXNCLFlBQVk7QUFDaEMsZUFBSyxPQUFMLENBQWEsR0FBYixDQUFpQixFQUFqQjtBQUNBLGVBQUssT0FBTCxDQUFhLFVBQWIsQ0FBd0IsdUJBQXhCO0FBQ0EsZUFBSyxPQUFMLENBQWEsT0FBYixDQUFxQixPQUFyQjtBQUNELFNBSkQ7O0FBTUEsa0JBQVUsRUFBVixDQUFhLFFBQWIsRUFBdUIsWUFBWTtBQUNqQyxlQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLFVBQWxCLEVBQThCLEtBQTlCOztBQUVBLGVBQUssaUJBQUw7QUFDRCxTQUpEOztBQU1BLGtCQUFVLEVBQVYsQ0FBYSxTQUFiLEVBQXdCLFlBQVk7QUFDbEMsZUFBSyxPQUFMLENBQWEsSUFBYixDQUFrQixVQUFsQixFQUE4QixJQUE5QjtBQUNELFNBRkQ7O0FBSUEsa0JBQVUsRUFBVixDQUFhLE9BQWIsRUFBc0IsVUFBVSxHQUFWLEVBQWU7QUFDbkMsZUFBSyxPQUFMLENBQWEsT0FBYixDQUFxQixPQUFyQjtBQUNELFNBRkQ7O0FBSUEsa0JBQVUsRUFBVixDQUFhLGVBQWIsRUFBOEIsVUFBVSxNQUFWLEVBQWtCO0FBQzlDLGVBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsdUJBQWxCLEVBQTJDLE9BQU8sRUFBbEQ7QUFDRCxTQUZEOztBQUlBLGFBQUssVUFBTCxDQUFnQixFQUFoQixDQUFtQixTQUFuQixFQUE4Qix5QkFBOUIsRUFBeUQsVUFBVSxHQUFWLEVBQWU7QUFDdEUsZUFBSyxPQUFMLENBQWEsT0FBYixFQUFzQixHQUF0QjtBQUNELFNBRkQ7O0FBSUEsYUFBSyxVQUFMLENBQWdCLEVBQWhCLENBQW1CLFVBQW5CLEVBQStCLHlCQUEvQixFQUEwRCxVQUFVLEdBQVYsRUFBZTtBQUN2RSxlQUFLLFdBQUwsQ0FBaUIsR0FBakI7QUFDRCxTQUZEOztBQUlBLGFBQUssVUFBTCxDQUFnQixFQUFoQixDQUFtQixTQUFuQixFQUE4Qix5QkFBOUIsRUFBeUQsVUFBVSxHQUFWLEVBQWU7QUFDdEUsY0FBSSxlQUFKOztBQUVBLGVBQUssT0FBTCxDQUFhLFVBQWIsRUFBeUIsR0FBekI7O0FBRUEsZUFBSyxlQUFMLEdBQXVCLElBQUksa0JBQUosRUFBdkI7O0FBRUEsY0FBSSxNQUFNLElBQUksS0FBZDs7QUFFQSxjQUFJLFFBQVEsS0FBSyxTQUFiLElBQTBCLEtBQUssT0FBTCxDQUFhLEdBQWIsT0FBdUIsRUFBckQsRUFBeUQ7QUFDdkQsZ0JBQUksa0JBQWtCLEtBQUssZ0JBQUwsQ0FDbkIsSUFEbUIsQ0FDZCw0QkFEYyxDQUF0Qjs7QUFHQSxnQkFBSSxnQkFBZ0IsTUFBaEIsR0FBeUIsQ0FBN0IsRUFBZ0M7QUFDOUIsa0JBQUksT0FBTyxnQkFBZ0IsSUFBaEIsQ0FBcUIsTUFBckIsQ0FBWDs7QUFFQSxtQkFBSyxrQkFBTCxDQUF3QixJQUF4Qjs7QUFFQSxrQkFBSSxjQUFKO0FBQ0Q7QUFDRjtBQUNGLFNBckJEOztBQXVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSSxPQUFPLFNBQVMsWUFBcEI7QUFDQSxZQUFJLHFCQUFxQixRQUFRLFFBQVEsRUFBekM7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBSyxVQUFMLENBQWdCLEVBQWhCLENBQ0UsbUJBREYsRUFFRSx5QkFGRixFQUdFLFVBQVUsR0FBVixFQUFlO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsY0FBSSxrQkFBSixFQUF3QjtBQUN0QixpQkFBSyxVQUFMLENBQWdCLEdBQWhCLENBQW9CLGdDQUFwQjtBQUNBO0FBQ0Q7O0FBRUQ7QUFDQSxlQUFLLFVBQUwsQ0FBZ0IsR0FBaEIsQ0FBb0IsY0FBcEI7QUFDRCxTQWRIOztBQWlCQSxhQUFLLFVBQUwsQ0FBZ0IsRUFBaEIsQ0FDRSwyQkFERixFQUVFLHlCQUZGLEVBR0UsVUFBVSxHQUFWLEVBQWU7QUFDYjtBQUNBO0FBQ0E7QUFDQSxjQUFJLHNCQUFzQixJQUFJLElBQUosS0FBYSxPQUF2QyxFQUFnRDtBQUM5QyxpQkFBSyxVQUFMLENBQWdCLEdBQWhCLENBQW9CLGdDQUFwQjtBQUNBO0FBQ0Q7O0FBRUQsY0FBSSxNQUFNLElBQUksS0FBZDs7QUFFQTtBQUNBLGNBQUksT0FBTyxLQUFLLEtBQVosSUFBcUIsT0FBTyxLQUFLLElBQWpDLElBQXlDLE9BQU8sS0FBSyxHQUF6RCxFQUE4RDtBQUM1RDtBQUNEOztBQUVEO0FBQ0EsY0FBSSxPQUFPLEtBQUssR0FBaEIsRUFBcUI7QUFDbkI7QUFDRDs7QUFFRCxlQUFLLFlBQUwsQ0FBa0IsR0FBbEI7QUFDRCxTQXpCSDtBQTJCRCxPQXZIRDs7QUF5SEE7Ozs7Ozs7QUFPQSxhQUFPLFNBQVAsQ0FBaUIsaUJBQWpCLEdBQXFDLFVBQVUsU0FBVixFQUFxQjtBQUN4RCxhQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLFVBQWxCLEVBQThCLEtBQUssVUFBTCxDQUFnQixJQUFoQixDQUFxQixVQUFyQixDQUE5QjtBQUNBLGFBQUssVUFBTCxDQUFnQixJQUFoQixDQUFxQixVQUFyQixFQUFpQyxJQUFqQztBQUNELE9BSEQ7O0FBS0EsYUFBTyxTQUFQLENBQWlCLGlCQUFqQixHQUFxQyxVQUFVLFNBQVYsRUFBcUIsV0FBckIsRUFBa0M7QUFDckUsYUFBSyxPQUFMLENBQWEsSUFBYixDQUFrQixhQUFsQixFQUFpQyxZQUFZLElBQTdDO0FBQ0QsT0FGRDs7QUFJQSxhQUFPLFNBQVAsQ0FBaUIsTUFBakIsR0FBMEIsVUFBVSxTQUFWLEVBQXFCLElBQXJCLEVBQTJCO0FBQ25ELFlBQUksaUJBQWlCLEtBQUssT0FBTCxDQUFhLENBQWIsS0FBbUIsU0FBUyxhQUFqRDs7QUFFQSxhQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLGFBQWxCLEVBQWlDLEVBQWpDOztBQUVBLGtCQUFVLElBQVYsQ0FBZSxJQUFmLEVBQXFCLElBQXJCOztBQUVBLGFBQUssVUFBTCxDQUFnQixJQUFoQixDQUFxQiw4QkFBckIsRUFDZ0IsTUFEaEIsQ0FDdUIsS0FBSyxnQkFENUI7O0FBR0EsYUFBSyxZQUFMO0FBQ0EsWUFBSSxjQUFKLEVBQW9CO0FBQ2xCLGVBQUssT0FBTCxDQUFhLEtBQWI7QUFDRDtBQUNGLE9BZEQ7O0FBZ0JBLGFBQU8sU0FBUCxDQUFpQixZQUFqQixHQUFnQyxZQUFZO0FBQzFDLGFBQUssWUFBTDs7QUFFQSxZQUFJLENBQUMsS0FBSyxlQUFWLEVBQTJCO0FBQ3pCLGNBQUksUUFBUSxLQUFLLE9BQUwsQ0FBYSxHQUFiLEVBQVo7O0FBRUEsZUFBSyxPQUFMLENBQWEsT0FBYixFQUFzQjtBQUNwQixrQkFBTTtBQURjLFdBQXRCO0FBR0Q7O0FBRUQsYUFBSyxlQUFMLEdBQXVCLEtBQXZCO0FBQ0QsT0FaRDs7QUFjQSxhQUFPLFNBQVAsQ0FBaUIsa0JBQWpCLEdBQXNDLFVBQVUsU0FBVixFQUFxQixJQUFyQixFQUEyQjtBQUMvRCxhQUFLLE9BQUwsQ0FBYSxVQUFiLEVBQXlCO0FBQ3ZCLGdCQUFNO0FBRGlCLFNBQXpCOztBQUlBLGFBQUssT0FBTCxDQUFhLEdBQWIsQ0FBaUIsS0FBSyxJQUF0QjtBQUNBLGFBQUssWUFBTDtBQUNELE9BUEQ7O0FBU0EsYUFBTyxTQUFQLENBQWlCLFlBQWpCLEdBQWdDLFlBQVk7QUFDMUMsYUFBSyxPQUFMLENBQWEsR0FBYixDQUFpQixPQUFqQixFQUEwQixNQUExQjs7QUFFQSxZQUFJLFFBQVEsRUFBWjs7QUFFQSxZQUFJLEtBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsYUFBbEIsTUFBcUMsRUFBekMsRUFBNkM7QUFDM0Msa0JBQVEsS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLDhCQUFyQixFQUFxRCxVQUFyRCxFQUFSO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsY0FBSSxlQUFlLEtBQUssT0FBTCxDQUFhLEdBQWIsR0FBbUIsTUFBbkIsR0FBNEIsQ0FBL0M7O0FBRUEsa0JBQVMsZUFBZSxJQUFoQixHQUF3QixJQUFoQztBQUNEOztBQUVELGFBQUssT0FBTCxDQUFhLEdBQWIsQ0FBaUIsT0FBakIsRUFBMEIsS0FBMUI7QUFDRCxPQWREOztBQWdCQSxhQUFPLE1BQVA7QUFDRCxLQTdORDs7QUErTkEsT0FBRyxNQUFILENBQVUsOEJBQVYsRUFBeUMsQ0FDdkMsUUFEdUMsQ0FBekMsRUFFRyxVQUFVLENBQVYsRUFBYTtBQUNkLGVBQVMsVUFBVCxHQUF1QixDQUFHOztBQUUxQixpQkFBVyxTQUFYLENBQXFCLElBQXJCLEdBQTRCLFVBQVUsU0FBVixFQUFxQixTQUFyQixFQUFnQyxVQUFoQyxFQUE0QztBQUN0RSxZQUFJLE9BQU8sSUFBWDtBQUNBLFlBQUksY0FBYyxDQUNoQixNQURnQixFQUNSLFNBRFEsRUFFaEIsT0FGZ0IsRUFFUCxTQUZPLEVBR2hCLFFBSGdCLEVBR04sV0FITSxFQUloQixVQUpnQixFQUlKLGFBSkksQ0FBbEI7O0FBT0EsWUFBSSxvQkFBb0IsQ0FBQyxTQUFELEVBQVksU0FBWixFQUF1QixXQUF2QixFQUFvQyxhQUFwQyxDQUF4Qjs7QUFFQSxrQkFBVSxJQUFWLENBQWUsSUFBZixFQUFxQixTQUFyQixFQUFnQyxVQUFoQzs7QUFFQSxrQkFBVSxFQUFWLENBQWEsR0FBYixFQUFrQixVQUFVLElBQVYsRUFBZ0IsTUFBaEIsRUFBd0I7QUFDeEM7QUFDQSxjQUFJLEVBQUUsT0FBRixDQUFVLElBQVYsRUFBZ0IsV0FBaEIsTUFBaUMsQ0FBQyxDQUF0QyxFQUF5QztBQUN2QztBQUNEOztBQUVEO0FBQ0EsbUJBQVMsVUFBVSxFQUFuQjs7QUFFQTtBQUNBLGNBQUksTUFBTSxFQUFFLEtBQUYsQ0FBUSxhQUFhLElBQXJCLEVBQTJCO0FBQ25DLG9CQUFRO0FBRDJCLFdBQTNCLENBQVY7O0FBSUEsZUFBSyxRQUFMLENBQWMsT0FBZCxDQUFzQixHQUF0Qjs7QUFFQTtBQUNBLGNBQUksRUFBRSxPQUFGLENBQVUsSUFBVixFQUFnQixpQkFBaEIsTUFBdUMsQ0FBQyxDQUE1QyxFQUErQztBQUM3QztBQUNEOztBQUVELGlCQUFPLFNBQVAsR0FBbUIsSUFBSSxrQkFBSixFQUFuQjtBQUNELFNBdEJEO0FBdUJELE9BcENEOztBQXNDQSxhQUFPLFVBQVA7QUFDRCxLQTVDRDs7QUE4Q0EsT0FBRyxNQUFILENBQVUscUJBQVYsRUFBZ0MsQ0FDOUIsUUFEOEIsRUFFOUIsU0FGOEIsQ0FBaEMsRUFHRyxVQUFVLENBQVYsRUFBYSxPQUFiLEVBQXNCO0FBQ3ZCLGVBQVMsV0FBVCxDQUFzQixJQUF0QixFQUE0QjtBQUMxQixhQUFLLElBQUwsR0FBWSxRQUFRLEVBQXBCO0FBQ0Q7O0FBRUQsa0JBQVksU0FBWixDQUFzQixHQUF0QixHQUE0QixZQUFZO0FBQ3RDLGVBQU8sS0FBSyxJQUFaO0FBQ0QsT0FGRDs7QUFJQSxrQkFBWSxTQUFaLENBQXNCLEdBQXRCLEdBQTRCLFVBQVUsR0FBVixFQUFlO0FBQ3pDLGVBQU8sS0FBSyxJQUFMLENBQVUsR0FBVixDQUFQO0FBQ0QsT0FGRDs7QUFJQSxrQkFBWSxTQUFaLENBQXNCLE1BQXRCLEdBQStCLFVBQVUsV0FBVixFQUF1QjtBQUNwRCxhQUFLLElBQUwsR0FBWSxFQUFFLE1BQUYsQ0FBUyxFQUFULEVBQWEsWUFBWSxHQUFaLEVBQWIsRUFBZ0MsS0FBSyxJQUFyQyxDQUFaO0FBQ0QsT0FGRDs7QUFJQTs7QUFFQSxrQkFBWSxNQUFaLEdBQXFCLEVBQXJCOztBQUVBLGtCQUFZLFFBQVosR0FBdUIsVUFBVSxJQUFWLEVBQWdCO0FBQ3JDLFlBQUksRUFBRSxRQUFRLFlBQVksTUFBdEIsQ0FBSixFQUFtQztBQUNqQyxjQUFJLGVBQWUsUUFBUSxJQUFSLENBQW5COztBQUVBLHNCQUFZLE1BQVosQ0FBbUIsSUFBbkIsSUFBMkIsWUFBM0I7QUFDRDs7QUFFRCxlQUFPLElBQUksV0FBSixDQUFnQixZQUFZLE1BQVosQ0FBbUIsSUFBbkIsQ0FBaEIsQ0FBUDtBQUNELE9BUkQ7O0FBVUEsYUFBTyxXQUFQO0FBQ0QsS0FuQ0Q7O0FBcUNBLE9BQUcsTUFBSCxDQUFVLG9CQUFWLEVBQStCLEVBQS9CLEVBRUcsWUFBWTtBQUNiLFVBQUksYUFBYTtBQUNmLGtCQUFVLEdBREs7QUFFZixrQkFBVSxHQUZLO0FBR2YsZ0JBQVUsR0FISztBQUlmLGdCQUFVLEdBSks7QUFLZixnQkFBVSxHQUxLO0FBTWYsa0JBQVUsR0FOSztBQU9mLGtCQUFVLEdBUEs7QUFRZixrQkFBVSxHQVJLO0FBU2Ysa0JBQVUsR0FUSztBQVVmLGdCQUFVLEdBVks7QUFXZixrQkFBVSxHQVhLO0FBWWYsa0JBQVUsR0FaSztBQWFmLGtCQUFVLEdBYks7QUFjZixrQkFBVSxHQWRLO0FBZWYsa0JBQVUsR0FmSztBQWdCZixrQkFBVSxHQWhCSztBQWlCZixrQkFBVSxHQWpCSztBQWtCZixrQkFBVSxHQWxCSztBQW1CZixnQkFBVSxHQW5CSztBQW9CZixrQkFBVSxHQXBCSztBQXFCZixrQkFBVSxHQXJCSztBQXNCZixnQkFBVSxHQXRCSztBQXVCZixrQkFBVSxHQXZCSztBQXdCZixrQkFBVSxHQXhCSztBQXlCZixrQkFBVSxHQXpCSztBQTBCZixrQkFBVSxHQTFCSztBQTJCZixrQkFBVSxHQTNCSztBQTRCZixrQkFBVSxHQTVCSztBQTZCZixrQkFBVSxHQTdCSztBQThCZixrQkFBVSxHQTlCSztBQStCZixrQkFBVSxHQS9CSztBQWdDZixrQkFBVSxHQWhDSztBQWlDZixrQkFBVSxHQWpDSztBQWtDZixrQkFBVSxJQWxDSztBQW1DZixnQkFBVSxJQW5DSztBQW9DZixrQkFBVSxJQXBDSztBQXFDZixrQkFBVSxJQXJDSztBQXNDZixrQkFBVSxJQXRDSztBQXVDZixrQkFBVSxJQXZDSztBQXdDZixrQkFBVSxJQXhDSztBQXlDZixrQkFBVSxJQXpDSztBQTBDZixrQkFBVSxJQTFDSztBQTJDZixrQkFBVSxHQTNDSztBQTRDZixrQkFBVSxHQTVDSztBQTZDZixrQkFBVSxHQTdDSztBQThDZixrQkFBVSxHQTlDSztBQStDZixrQkFBVSxHQS9DSztBQWdEZixrQkFBVSxHQWhESztBQWlEZixrQkFBVSxHQWpESztBQWtEZixrQkFBVSxHQWxESztBQW1EZixrQkFBVSxHQW5ESztBQW9EZixrQkFBVSxHQXBESztBQXFEZixrQkFBVSxHQXJESztBQXNEZixrQkFBVSxHQXRESztBQXVEZixrQkFBVSxHQXZESztBQXdEZixrQkFBVSxHQXhESztBQXlEZixnQkFBVSxHQXpESztBQTBEZixrQkFBVSxHQTFESztBQTJEZixrQkFBVSxHQTNESztBQTREZixrQkFBVSxHQTVESztBQTZEZixrQkFBVSxHQTdESztBQThEZixrQkFBVSxHQTlESztBQStEZixrQkFBVSxHQS9ESztBQWdFZixrQkFBVSxHQWhFSztBQWlFZixrQkFBVSxHQWpFSztBQWtFZixrQkFBVSxHQWxFSztBQW1FZixrQkFBVSxHQW5FSztBQW9FZixrQkFBVSxHQXBFSztBQXFFZixrQkFBVSxHQXJFSztBQXNFZixrQkFBVSxHQXRFSztBQXVFZixrQkFBVSxHQXZFSztBQXdFZixrQkFBVSxHQXhFSztBQXlFZixrQkFBVSxHQXpFSztBQTBFZixrQkFBVSxHQTFFSztBQTJFZixrQkFBVSxJQTNFSztBQTRFZixrQkFBVSxJQTVFSztBQTZFZixrQkFBVSxJQTdFSztBQThFZixrQkFBVSxJQTlFSztBQStFZixrQkFBVSxHQS9FSztBQWdGZixrQkFBVSxHQWhGSztBQWlGZixnQkFBVSxHQWpGSztBQWtGZixnQkFBVSxHQWxGSztBQW1GZixnQkFBVSxHQW5GSztBQW9GZixrQkFBVSxHQXBGSztBQXFGZixrQkFBVSxHQXJGSztBQXNGZixrQkFBVSxHQXRGSztBQXVGZixrQkFBVSxHQXZGSztBQXdGZixrQkFBVSxHQXhGSztBQXlGZixrQkFBVSxHQXpGSztBQTBGZixrQkFBVSxHQTFGSztBQTJGZixrQkFBVSxHQTNGSztBQTRGZixrQkFBVSxHQTVGSztBQTZGZixrQkFBVSxHQTdGSztBQThGZixnQkFBVSxHQTlGSztBQStGZixrQkFBVSxHQS9GSztBQWdHZixrQkFBVSxHQWhHSztBQWlHZixrQkFBVSxHQWpHSztBQWtHZixrQkFBVSxHQWxHSztBQW1HZixrQkFBVSxHQW5HSztBQW9HZixrQkFBVSxHQXBHSztBQXFHZixrQkFBVSxHQXJHSztBQXNHZixrQkFBVSxHQXRHSztBQXVHZixrQkFBVSxHQXZHSztBQXdHZixrQkFBVSxHQXhHSztBQXlHZixrQkFBVSxHQXpHSztBQTBHZixrQkFBVSxHQTFHSztBQTJHZixrQkFBVSxHQTNHSztBQTRHZixrQkFBVSxHQTVHSztBQTZHZixrQkFBVSxHQTdHSztBQThHZixrQkFBVSxHQTlHSztBQStHZixrQkFBVSxHQS9HSztBQWdIZixrQkFBVSxHQWhISztBQWlIZixrQkFBVSxHQWpISztBQWtIZixrQkFBVSxHQWxISztBQW1IZixrQkFBVSxHQW5ISztBQW9IZixrQkFBVSxHQXBISztBQXFIZixrQkFBVSxHQXJISztBQXNIZixrQkFBVSxHQXRISztBQXVIZixrQkFBVSxHQXZISztBQXdIZixrQkFBVSxHQXhISztBQXlIZixrQkFBVSxHQXpISztBQTBIZixrQkFBVSxHQTFISztBQTJIZixrQkFBVSxHQTNISztBQTRIZixrQkFBVSxHQTVISztBQTZIZixrQkFBVSxHQTdISztBQThIZixrQkFBVSxHQTlISztBQStIZixrQkFBVSxHQS9ISztBQWdJZixrQkFBVSxHQWhJSztBQWlJZixrQkFBVSxHQWpJSztBQWtJZixrQkFBVSxHQWxJSztBQW1JZixrQkFBVSxHQW5JSztBQW9JZixrQkFBVSxHQXBJSztBQXFJZixrQkFBVSxHQXJJSztBQXNJZixrQkFBVSxHQXRJSztBQXVJZixrQkFBVSxHQXZJSztBQXdJZixrQkFBVSxHQXhJSztBQXlJZixrQkFBVSxHQXpJSztBQTBJZixrQkFBVSxHQTFJSztBQTJJZixrQkFBVSxHQTNJSztBQTRJZixrQkFBVSxHQTVJSztBQTZJZixrQkFBVSxHQTdJSztBQThJZixnQkFBVSxHQTlJSztBQStJZixnQkFBVSxHQS9JSztBQWdKZixnQkFBVSxHQWhKSztBQWlKZixrQkFBVSxHQWpKSztBQWtKZixrQkFBVSxHQWxKSztBQW1KZixrQkFBVSxHQW5KSztBQW9KZixrQkFBVSxHQXBKSztBQXFKZixnQkFBVSxHQXJKSztBQXNKZixrQkFBVSxHQXRKSztBQXVKZixrQkFBVSxHQXZKSztBQXdKZixrQkFBVSxHQXhKSztBQXlKZixrQkFBVSxHQXpKSztBQTBKZixrQkFBVSxHQTFKSztBQTJKZixrQkFBVSxHQTNKSztBQTRKZixrQkFBVSxHQTVKSztBQTZKZixrQkFBVSxHQTdKSztBQThKZixrQkFBVSxHQTlKSztBQStKZixrQkFBVSxHQS9KSztBQWdLZixrQkFBVSxHQWhLSztBQWlLZixrQkFBVSxHQWpLSztBQWtLZixrQkFBVSxHQWxLSztBQW1LZixrQkFBVSxHQW5LSztBQW9LZixrQkFBVSxHQXBLSztBQXFLZixrQkFBVSxHQXJLSztBQXNLZixrQkFBVSxHQXRLSztBQXVLZixrQkFBVSxHQXZLSztBQXdLZixrQkFBVSxHQXhLSztBQXlLZixrQkFBVSxHQXpLSztBQTBLZixrQkFBVSxHQTFLSztBQTJLZixrQkFBVSxHQTNLSztBQTRLZixrQkFBVSxHQTVLSztBQTZLZixrQkFBVSxHQTdLSztBQThLZixrQkFBVSxHQTlLSztBQStLZixrQkFBVSxHQS9LSztBQWdMZixrQkFBVSxHQWhMSztBQWlMZixrQkFBVSxHQWpMSztBQWtMZixrQkFBVSxHQWxMSztBQW1MZixrQkFBVSxHQW5MSztBQW9MZixrQkFBVSxHQXBMSztBQXFMZixrQkFBVSxHQXJMSztBQXNMZixrQkFBVSxHQXRMSztBQXVMZixrQkFBVSxHQXZMSztBQXdMZixrQkFBVSxHQXhMSztBQXlMZixrQkFBVSxHQXpMSztBQTBMZixrQkFBVSxHQTFMSztBQTJMZixrQkFBVSxHQTNMSztBQTRMZixrQkFBVSxHQTVMSztBQTZMZixrQkFBVSxHQTdMSztBQThMZixrQkFBVSxHQTlMSztBQStMZixrQkFBVSxHQS9MSztBQWdNZixrQkFBVSxHQWhNSztBQWlNZixrQkFBVSxJQWpNSztBQWtNZixrQkFBVSxJQWxNSztBQW1NZixrQkFBVSxHQW5NSztBQW9NZixrQkFBVSxHQXBNSztBQXFNZixrQkFBVSxHQXJNSztBQXNNZixrQkFBVSxHQXRNSztBQXVNZixrQkFBVSxHQXZNSztBQXdNZixrQkFBVSxHQXhNSztBQXlNZixrQkFBVSxHQXpNSztBQTBNZixrQkFBVSxHQTFNSztBQTJNZixrQkFBVSxHQTNNSztBQTRNZixrQkFBVSxHQTVNSztBQTZNZixrQkFBVSxHQTdNSztBQThNZixnQkFBVSxHQTlNSztBQStNZixrQkFBVSxHQS9NSztBQWdOZixrQkFBVSxHQWhOSztBQWlOZixrQkFBVSxHQWpOSztBQWtOZixrQkFBVSxHQWxOSztBQW1OZixrQkFBVSxHQW5OSztBQW9OZixrQkFBVSxHQXBOSztBQXFOZixrQkFBVSxHQXJOSztBQXNOZixrQkFBVSxHQXROSztBQXVOZixrQkFBVSxHQXZOSztBQXdOZixrQkFBVSxHQXhOSztBQXlOZixrQkFBVSxJQXpOSztBQTBOZixrQkFBVSxJQTFOSztBQTJOZixrQkFBVSxHQTNOSztBQTROZixrQkFBVSxHQTVOSztBQTZOZixnQkFBVSxHQTdOSztBQThOZixnQkFBVSxHQTlOSztBQStOZixnQkFBVSxHQS9OSztBQWdPZixrQkFBVSxHQWhPSztBQWlPZixrQkFBVSxHQWpPSztBQWtPZixrQkFBVSxHQWxPSztBQW1PZixrQkFBVSxHQW5PSztBQW9PZixnQkFBVSxHQXBPSztBQXFPZixrQkFBVSxHQXJPSztBQXNPZixrQkFBVSxHQXRPSztBQXVPZixrQkFBVSxHQXZPSztBQXdPZixrQkFBVSxHQXhPSztBQXlPZixrQkFBVSxHQXpPSztBQTBPZixrQkFBVSxHQTFPSztBQTJPZixrQkFBVSxHQTNPSztBQTRPZixrQkFBVSxHQTVPSztBQTZPZixrQkFBVSxHQTdPSztBQThPZixnQkFBVSxHQTlPSztBQStPZixrQkFBVSxHQS9PSztBQWdQZixrQkFBVSxHQWhQSztBQWlQZixrQkFBVSxHQWpQSztBQWtQZixrQkFBVSxHQWxQSztBQW1QZixrQkFBVSxHQW5QSztBQW9QZixrQkFBVSxHQXBQSztBQXFQZixrQkFBVSxHQXJQSztBQXNQZixrQkFBVSxHQXRQSztBQXVQZixrQkFBVSxHQXZQSztBQXdQZixrQkFBVSxHQXhQSztBQXlQZixrQkFBVSxHQXpQSztBQTBQZixrQkFBVSxHQTFQSztBQTJQZixrQkFBVSxHQTNQSztBQTRQZixrQkFBVSxHQTVQSztBQTZQZixrQkFBVSxHQTdQSztBQThQZixrQkFBVSxHQTlQSztBQStQZixnQkFBVSxHQS9QSztBQWdRZixrQkFBVSxHQWhRSztBQWlRZixrQkFBVSxHQWpRSztBQWtRZixrQkFBVSxHQWxRSztBQW1RZixrQkFBVSxHQW5RSztBQW9RZixrQkFBVSxHQXBRSztBQXFRZixrQkFBVSxJQXJRSztBQXNRZixrQkFBVSxJQXRRSztBQXVRZixrQkFBVSxJQXZRSztBQXdRZixrQkFBVSxHQXhRSztBQXlRZixrQkFBVSxHQXpRSztBQTBRZixrQkFBVSxHQTFRSztBQTJRZixrQkFBVSxHQTNRSztBQTRRZixrQkFBVSxHQTVRSztBQTZRZixrQkFBVSxHQTdRSztBQThRZixrQkFBVSxHQTlRSztBQStRZixrQkFBVSxHQS9RSztBQWdSZixrQkFBVSxHQWhSSztBQWlSZixrQkFBVSxHQWpSSztBQWtSZixrQkFBVSxHQWxSSztBQW1SZixrQkFBVSxHQW5SSztBQW9SZixrQkFBVSxHQXBSSztBQXFSZixrQkFBVSxHQXJSSztBQXNSZixrQkFBVSxHQXRSSztBQXVSZixrQkFBVSxHQXZSSztBQXdSZixrQkFBVSxHQXhSSztBQXlSZixrQkFBVSxHQXpSSztBQTBSZixrQkFBVSxHQTFSSztBQTJSZixrQkFBVSxHQTNSSztBQTRSZixrQkFBVSxHQTVSSztBQTZSZixrQkFBVSxHQTdSSztBQThSZixrQkFBVSxHQTlSSztBQStSZixrQkFBVSxHQS9SSztBQWdTZixrQkFBVSxHQWhTSztBQWlTZixrQkFBVSxHQWpTSztBQWtTZixrQkFBVSxHQWxTSztBQW1TZixrQkFBVSxHQW5TSztBQW9TZixrQkFBVSxHQXBTSztBQXFTZixrQkFBVSxHQXJTSztBQXNTZixrQkFBVSxHQXRTSztBQXVTZixrQkFBVSxHQXZTSztBQXdTZixrQkFBVSxHQXhTSztBQXlTZixrQkFBVSxHQXpTSztBQTBTZixrQkFBVSxHQTFTSztBQTJTZixrQkFBVSxHQTNTSztBQTRTZixrQkFBVSxHQTVTSztBQTZTZixrQkFBVSxHQTdTSztBQThTZixrQkFBVSxHQTlTSztBQStTZixrQkFBVSxHQS9TSztBQWdUZixrQkFBVSxHQWhUSztBQWlUZixrQkFBVSxHQWpUSztBQWtUZixrQkFBVSxHQWxUSztBQW1UZixrQkFBVSxHQW5USztBQW9UZixrQkFBVSxHQXBUSztBQXFUZixrQkFBVSxHQXJUSztBQXNUZixrQkFBVSxHQXRUSztBQXVUZixrQkFBVSxHQXZUSztBQXdUZixrQkFBVSxHQXhUSztBQXlUZixrQkFBVSxHQXpUSztBQTBUZixrQkFBVSxHQTFUSztBQTJUZixrQkFBVSxHQTNUSztBQTRUZixrQkFBVSxHQTVUSztBQTZUZixrQkFBVSxHQTdUSztBQThUZixrQkFBVSxHQTlUSztBQStUZixrQkFBVSxHQS9USztBQWdVZixrQkFBVSxHQWhVSztBQWlVZixrQkFBVSxHQWpVSztBQWtVZixrQkFBVSxHQWxVSztBQW1VZixrQkFBVSxHQW5VSztBQW9VZixrQkFBVSxJQXBVSztBQXFVZixrQkFBVSxHQXJVSztBQXNVZixrQkFBVSxHQXRVSztBQXVVZixnQkFBVSxHQXZVSztBQXdVZixnQkFBVSxHQXhVSztBQXlVZixnQkFBVSxHQXpVSztBQTBVZixrQkFBVSxHQTFVSztBQTJVZixrQkFBVSxHQTNVSztBQTRVZixrQkFBVSxHQTVVSztBQTZVZixrQkFBVSxHQTdVSztBQThVZixrQkFBVSxHQTlVSztBQStVZixnQkFBVSxHQS9VSztBQWdWZixrQkFBVSxHQWhWSztBQWlWZixrQkFBVSxHQWpWSztBQWtWZixrQkFBVSxHQWxWSztBQW1WZixrQkFBVSxHQW5WSztBQW9WZixrQkFBVSxHQXBWSztBQXFWZixrQkFBVSxHQXJWSztBQXNWZixrQkFBVSxHQXRWSztBQXVWZixrQkFBVSxHQXZWSztBQXdWZixrQkFBVSxHQXhWSztBQXlWZixrQkFBVSxHQXpWSztBQTBWZixrQkFBVSxHQTFWSztBQTJWZixrQkFBVSxHQTNWSztBQTRWZixrQkFBVSxHQTVWSztBQTZWZixrQkFBVSxHQTdWSztBQThWZixrQkFBVSxHQTlWSztBQStWZixrQkFBVSxHQS9WSztBQWdXZixrQkFBVSxHQWhXSztBQWlXZixrQkFBVSxHQWpXSztBQWtXZixrQkFBVSxHQWxXSztBQW1XZixrQkFBVSxHQW5XSztBQW9XZixrQkFBVSxHQXBXSztBQXFXZixrQkFBVSxHQXJXSztBQXNXZixrQkFBVSxHQXRXSztBQXVXZixrQkFBVSxHQXZXSztBQXdXZixrQkFBVSxHQXhXSztBQXlXZixrQkFBVSxHQXpXSztBQTBXZixrQkFBVSxHQTFXSztBQTJXZixrQkFBVSxHQTNXSztBQTRXZixrQkFBVSxHQTVXSztBQTZXZixrQkFBVSxJQTdXSztBQThXZixrQkFBVSxHQTlXSztBQStXZixrQkFBVSxHQS9XSztBQWdYZixrQkFBVSxHQWhYSztBQWlYZixrQkFBVSxHQWpYSztBQWtYZixrQkFBVSxHQWxYSztBQW1YZixrQkFBVSxHQW5YSztBQW9YZixrQkFBVSxHQXBYSztBQXFYZixrQkFBVSxHQXJYSztBQXNYZixrQkFBVSxHQXRYSztBQXVYZixrQkFBVSxHQXZYSztBQXdYZixrQkFBVSxHQXhYSztBQXlYZixrQkFBVSxHQXpYSztBQTBYZixrQkFBVSxHQTFYSztBQTJYZixrQkFBVSxHQTNYSztBQTRYZixrQkFBVSxHQTVYSztBQTZYZixrQkFBVSxHQTdYSztBQThYZixnQkFBVSxHQTlYSztBQStYZixrQkFBVSxHQS9YSztBQWdZZixrQkFBVSxHQWhZSztBQWlZZixrQkFBVSxHQWpZSztBQWtZZixrQkFBVSxHQWxZSztBQW1ZZixrQkFBVSxHQW5ZSztBQW9ZZixrQkFBVSxHQXBZSztBQXFZZixrQkFBVSxHQXJZSztBQXNZZixrQkFBVSxHQXRZSztBQXVZZixrQkFBVSxHQXZZSztBQXdZZixrQkFBVSxHQXhZSztBQXlZZixrQkFBVSxHQXpZSztBQTBZZixrQkFBVSxHQTFZSztBQTJZZixrQkFBVSxHQTNZSztBQTRZZixrQkFBVSxHQTVZSztBQTZZZixrQkFBVSxHQTdZSztBQThZZixrQkFBVSxHQTlZSztBQStZZixrQkFBVSxHQS9ZSztBQWdaZixrQkFBVSxHQWhaSztBQWlaZixrQkFBVSxHQWpaSztBQWtaZixrQkFBVSxHQWxaSztBQW1aZixrQkFBVSxHQW5aSztBQW9aZixrQkFBVSxHQXBaSztBQXFaZixrQkFBVSxHQXJaSztBQXNaZixrQkFBVSxHQXRaSztBQXVaZixrQkFBVSxHQXZaSztBQXdaZixrQkFBVSxHQXhaSztBQXlaZixnQkFBVSxHQXpaSztBQTBaZixnQkFBVSxHQTFaSztBQTJaZixnQkFBVSxHQTNaSztBQTRaZixrQkFBVSxHQTVaSztBQTZaZixrQkFBVSxHQTdaSztBQThaZixrQkFBVSxHQTlaSztBQStaZixrQkFBVSxHQS9aSztBQWdhZixnQkFBVSxHQWhhSztBQWlhZixrQkFBVSxHQWphSztBQWthZixrQkFBVSxHQWxhSztBQW1hZixrQkFBVSxHQW5hSztBQW9hZixrQkFBVSxHQXBhSztBQXFhZixrQkFBVSxHQXJhSztBQXNhZixrQkFBVSxHQXRhSztBQXVhZixrQkFBVSxHQXZhSztBQXdhZixrQkFBVSxHQXhhSztBQXlhZixnQkFBVSxHQXphSztBQTBhZixrQkFBVSxHQTFhSztBQTJhZixrQkFBVSxHQTNhSztBQTRhZixnQkFBVSxHQTVhSztBQTZhZixrQkFBVSxHQTdhSztBQThhZixrQkFBVSxHQTlhSztBQSthZixrQkFBVSxHQS9hSztBQWdiZixrQkFBVSxHQWhiSztBQWliZixrQkFBVSxHQWpiSztBQWtiZixrQkFBVSxHQWxiSztBQW1iZixrQkFBVSxHQW5iSztBQW9iZixrQkFBVSxHQXBiSztBQXFiZixrQkFBVSxHQXJiSztBQXNiZixrQkFBVSxHQXRiSztBQXViZixrQkFBVSxHQXZiSztBQXdiZixrQkFBVSxJQXhiSztBQXliZixnQkFBVSxJQXpiSztBQTBiZixrQkFBVSxJQTFiSztBQTJiZixrQkFBVSxJQTNiSztBQTRiZixrQkFBVSxJQTViSztBQTZiZixrQkFBVSxJQTdiSztBQThiZixrQkFBVSxJQTliSztBQStiZixrQkFBVSxJQS9iSztBQWdjZixrQkFBVSxJQWhjSztBQWljZixrQkFBVSxHQWpjSztBQWtjZixrQkFBVSxHQWxjSztBQW1jZixrQkFBVSxHQW5jSztBQW9jZixrQkFBVSxHQXBjSztBQXFjZixrQkFBVSxHQXJjSztBQXNjZixrQkFBVSxHQXRjSztBQXVjZixrQkFBVSxHQXZjSztBQXdjZixrQkFBVSxHQXhjSztBQXljZixrQkFBVSxHQXpjSztBQTBjZixrQkFBVSxHQTFjSztBQTJjZixrQkFBVSxHQTNjSztBQTRjZixrQkFBVSxHQTVjSztBQTZjZixrQkFBVSxHQTdjSztBQThjZixrQkFBVSxHQTljSztBQStjZixnQkFBVSxHQS9jSztBQWdkZixrQkFBVSxHQWhkSztBQWlkZixrQkFBVSxHQWpkSztBQWtkZixrQkFBVSxHQWxkSztBQW1kZixrQkFBVSxHQW5kSztBQW9kZixrQkFBVSxHQXBkSztBQXFkZixrQkFBVSxHQXJkSztBQXNkZixrQkFBVSxHQXRkSztBQXVkZixrQkFBVSxHQXZkSztBQXdkZixrQkFBVSxHQXhkSztBQXlkZixrQkFBVSxHQXpkSztBQTBkZixrQkFBVSxHQTFkSztBQTJkZixrQkFBVSxHQTNkSztBQTRkZixrQkFBVSxHQTVkSztBQTZkZixrQkFBVSxHQTdkSztBQThkZixrQkFBVSxHQTlkSztBQStkZixrQkFBVSxHQS9kSztBQWdlZixrQkFBVSxHQWhlSztBQWllZixrQkFBVSxHQWplSztBQWtlZixrQkFBVSxJQWxlSztBQW1lZixrQkFBVSxJQW5lSztBQW9lZixrQkFBVSxHQXBlSztBQXFlZixrQkFBVSxHQXJlSztBQXNlZixnQkFBVSxHQXRlSztBQXVlZixnQkFBVSxHQXZlSztBQXdlZixnQkFBVSxHQXhlSztBQXllZixrQkFBVSxHQXplSztBQTBlZixrQkFBVSxHQTFlSztBQTJlZixrQkFBVSxHQTNlSztBQTRlZixrQkFBVSxHQTVlSztBQTZlZixrQkFBVSxHQTdlSztBQThlZixrQkFBVSxHQTllSztBQStlZixrQkFBVSxHQS9lSztBQWdmZixrQkFBVSxHQWhmSztBQWlmZixrQkFBVSxHQWpmSztBQWtmZixrQkFBVSxHQWxmSztBQW1mZixnQkFBVSxHQW5mSztBQW9mZixrQkFBVSxHQXBmSztBQXFmZixrQkFBVSxHQXJmSztBQXNmZixrQkFBVSxHQXRmSztBQXVmZixrQkFBVSxHQXZmSztBQXdmZixrQkFBVSxHQXhmSztBQXlmZixrQkFBVSxHQXpmSztBQTBmZixrQkFBVSxHQTFmSztBQTJmZixrQkFBVSxHQTNmSztBQTRmZixrQkFBVSxHQTVmSztBQTZmZixrQkFB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IiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBDT01NT04gZnJvbSAnLi9wYWdlcy9DT01NT04nO1xuaW1wb3J0IEhPTUUgZnJvbSBcIi4vcGFnZXMvSE9NRVwiO1xuaW1wb3J0IFBST0pFQ1RTIGZyb20gXCIuL3BhZ2VzL1BST0pFQ1RTXCI7XG5pbXBvcnQgQ09OVEFDVFMgZnJvbSBcIi4vcGFnZXMvQ09OVEFDVFNcIjtcblxubGV0IGluaXQgPSBudWxsO1xuXG5zd2l0Y2ggKGdsb2JhbC52YXJzLnBhZ2UpIHtcbiAgICBjYXNlICdob21lX3BhZ2UnOlxuICAgICAgICBpbml0ID0gSE9NRS5pbml0LmJpbmQoSE9NRSk7XG4gICAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3Byb2plY3RzX3BhZ2UnOlxuICAgICAgICBpbml0ID0gUFJPSkVDVFMuaW5pdC5iaW5kKFBST0pFQ1RTKTtcbiAgICAgICAgYnJlYWs7XG4gICAgY2FzZSAnY29tbW9uX3BhZ2UnOlxuICAgICAgICBpbml0ID0gQ09NTU9OLmluaXQuYmluZChDT01NT04pO1xuICAgICAgICBicmVhaztcbiAgICBjYXNlICdjb250YWN0c19wYWdlJzpcbiAgICAgICAgaW5pdCA9IENPTlRBQ1RTLmluaXQuYmluZChDT05UQUNUUyk7XG4gICAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICAgIGluaXQgPSAoKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZGVmYXVsdCBpbml0Jyk7XG4gICAgICAgIH07XG59XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGluaXQoKSk7XG5cbiQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24oKSB7XG5cbn0pO1xuXG4kKHdpbmRvdykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xuXG59KTtcblxuJCh3aW5kb3cpLm9uKCdsb2FkJywgZnVuY3Rpb24gKCkge1xuXG59KTsiLCIvKiFcbiAqIFNlbGVjdDIgNC4wLjNcbiAqIGh0dHBzOi8vc2VsZWN0Mi5naXRodWIuaW9cbiAqXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9zZWxlY3QyL3NlbGVjdDIvYmxvYi9tYXN0ZXIvTElDRU5TRS5tZFxuICovXG4oZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgICBmYWN0b3J5KGpRdWVyeSk7XG59KGZ1bmN0aW9uIChqUXVlcnkpIHtcbiAgLy8gVGhpcyBpcyBuZWVkZWQgc28gd2UgY2FuIGNhdGNoIHRoZSBBTUQgbG9hZGVyIGNvbmZpZ3VyYXRpb24gYW5kIHVzZSBpdFxuICAvLyBUaGUgaW5uZXIgZmlsZSBzaG91bGQgYmUgd3JhcHBlZCAoYnkgYGJhbm5lci5zdGFydC5qc2ApIGluIGEgZnVuY3Rpb24gdGhhdFxuICAvLyByZXR1cm5zIHRoZSBBTUQgbG9hZGVyIHJlZmVyZW5jZXMuXG4gIHZhciBTMiA9XG4oZnVuY3Rpb24gKCkge1xuICAvLyBSZXN0b3JlIHRoZSBTZWxlY3QyIEFNRCBsb2FkZXIgc28gaXQgY2FuIGJlIHVzZWRcbiAgLy8gTmVlZGVkIG1vc3RseSBpbiB0aGUgbGFuZ3VhZ2UgZmlsZXMsIHdoZXJlIHRoZSBsb2FkZXIgaXMgbm90IGluc2VydGVkXG4gIGlmIChqUXVlcnkgJiYgalF1ZXJ5LmZuICYmIGpRdWVyeS5mbi5zZWxlY3QyICYmIGpRdWVyeS5mbi5zZWxlY3QyLmFtZCkge1xuICAgIHZhciBTMiA9IGpRdWVyeS5mbi5zZWxlY3QyLmFtZDtcbiAgfVxudmFyIFMyOyhmdW5jdGlvbiAoKSB7IGlmICghUzIgfHwgIVMyLnJlcXVpcmVqcykge1xuaWYgKCFTMikgeyBTMiA9IHt9OyB9IGVsc2UgeyByZXF1aXJlID0gUzI7IH1cbi8qKlxuICogQGxpY2Vuc2UgYWxtb25kIDAuMy4xIENvcHlyaWdodCAoYykgMjAxMS0yMDE0LCBUaGUgRG9qbyBGb3VuZGF0aW9uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBBdmFpbGFibGUgdmlhIHRoZSBNSVQgb3IgbmV3IEJTRCBsaWNlbnNlLlxuICogc2VlOiBodHRwOi8vZ2l0aHViLmNvbS9qcmJ1cmtlL2FsbW9uZCBmb3IgZGV0YWlsc1xuICovXG4vL0dvaW5nIHNsb3BweSB0byBhdm9pZCAndXNlIHN0cmljdCcgc3RyaW5nIGNvc3QsIGJ1dCBzdHJpY3QgcHJhY3RpY2VzIHNob3VsZFxuLy9iZSBmb2xsb3dlZC5cbi8qanNsaW50IHNsb3BweTogdHJ1ZSAqL1xuLypnbG9iYWwgc2V0VGltZW91dDogZmFsc2UgKi9cblxudmFyIHJlcXVpcmVqcywgcmVxdWlyZSwgZGVmaW5lO1xuKGZ1bmN0aW9uICh1bmRlZikge1xuICAgIHZhciBtYWluLCByZXEsIG1ha2VNYXAsIGhhbmRsZXJzLFxuICAgICAgICBkZWZpbmVkID0ge30sXG4gICAgICAgIHdhaXRpbmcgPSB7fSxcbiAgICAgICAgY29uZmlnID0ge30sXG4gICAgICAgIGRlZmluaW5nID0ge30sXG4gICAgICAgIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHksXG4gICAgICAgIGFwcyA9IFtdLnNsaWNlLFxuICAgICAgICBqc1N1ZmZpeFJlZ0V4cCA9IC9cXC5qcyQvO1xuXG4gICAgZnVuY3Rpb24gaGFzUHJvcChvYmosIHByb3ApIHtcbiAgICAgICAgcmV0dXJuIGhhc093bi5jYWxsKG9iaiwgcHJvcCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2l2ZW4gYSByZWxhdGl2ZSBtb2R1bGUgbmFtZSwgbGlrZSAuL3NvbWV0aGluZywgbm9ybWFsaXplIGl0IHRvXG4gICAgICogYSByZWFsIG5hbWUgdGhhdCBjYW4gYmUgbWFwcGVkIHRvIGEgcGF0aC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSB0aGUgcmVsYXRpdmUgbmFtZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBiYXNlTmFtZSBhIHJlYWwgbmFtZSB0aGF0IHRoZSBuYW1lIGFyZyBpcyByZWxhdGl2ZVxuICAgICAqIHRvLlxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9IG5vcm1hbGl6ZWQgbmFtZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZShuYW1lLCBiYXNlTmFtZSkge1xuICAgICAgICB2YXIgbmFtZVBhcnRzLCBuYW1lU2VnbWVudCwgbWFwVmFsdWUsIGZvdW5kTWFwLCBsYXN0SW5kZXgsXG4gICAgICAgICAgICBmb3VuZEksIGZvdW5kU3Rhck1hcCwgc3RhckksIGksIGosIHBhcnQsXG4gICAgICAgICAgICBiYXNlUGFydHMgPSBiYXNlTmFtZSAmJiBiYXNlTmFtZS5zcGxpdChcIi9cIiksXG4gICAgICAgICAgICBtYXAgPSBjb25maWcubWFwLFxuICAgICAgICAgICAgc3Rhck1hcCA9IChtYXAgJiYgbWFwWycqJ10pIHx8IHt9O1xuXG4gICAgICAgIC8vQWRqdXN0IGFueSByZWxhdGl2ZSBwYXRocy5cbiAgICAgICAgaWYgKG5hbWUgJiYgbmFtZS5jaGFyQXQoMCkgPT09IFwiLlwiKSB7XG4gICAgICAgICAgICAvL0lmIGhhdmUgYSBiYXNlIG5hbWUsIHRyeSB0byBub3JtYWxpemUgYWdhaW5zdCBpdCxcbiAgICAgICAgICAgIC8vb3RoZXJ3aXNlLCBhc3N1bWUgaXQgaXMgYSB0b3AtbGV2ZWwgcmVxdWlyZSB0aGF0IHdpbGxcbiAgICAgICAgICAgIC8vYmUgcmVsYXRpdmUgdG8gYmFzZVVybCBpbiB0aGUgZW5kLlxuICAgICAgICAgICAgaWYgKGJhc2VOYW1lKSB7XG4gICAgICAgICAgICAgICAgbmFtZSA9IG5hbWUuc3BsaXQoJy8nKTtcbiAgICAgICAgICAgICAgICBsYXN0SW5kZXggPSBuYW1lLmxlbmd0aCAtIDE7XG5cbiAgICAgICAgICAgICAgICAvLyBOb2RlIC5qcyBhbGxvd2FuY2U6XG4gICAgICAgICAgICAgICAgaWYgKGNvbmZpZy5ub2RlSWRDb21wYXQgJiYganNTdWZmaXhSZWdFeHAudGVzdChuYW1lW2xhc3RJbmRleF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWVbbGFzdEluZGV4XSA9IG5hbWVbbGFzdEluZGV4XS5yZXBsYWNlKGpzU3VmZml4UmVnRXhwLCAnJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy9Mb3Agb2ZmIHRoZSBsYXN0IHBhcnQgb2YgYmFzZVBhcnRzLCBzbyB0aGF0IC4gbWF0Y2hlcyB0aGVcbiAgICAgICAgICAgICAgICAvL1wiZGlyZWN0b3J5XCIgYW5kIG5vdCBuYW1lIG9mIHRoZSBiYXNlTmFtZSdzIG1vZHVsZS4gRm9yIGluc3RhbmNlLFxuICAgICAgICAgICAgICAgIC8vYmFzZU5hbWUgb2YgXCJvbmUvdHdvL3RocmVlXCIsIG1hcHMgdG8gXCJvbmUvdHdvL3RocmVlLmpzXCIsIGJ1dCB3ZVxuICAgICAgICAgICAgICAgIC8vd2FudCB0aGUgZGlyZWN0b3J5LCBcIm9uZS90d29cIiBmb3IgdGhpcyBub3JtYWxpemF0aW9uLlxuICAgICAgICAgICAgICAgIG5hbWUgPSBiYXNlUGFydHMuc2xpY2UoMCwgYmFzZVBhcnRzLmxlbmd0aCAtIDEpLmNvbmNhdChuYW1lKTtcblxuICAgICAgICAgICAgICAgIC8vc3RhcnQgdHJpbURvdHNcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbmFtZS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBwYXJ0ID0gbmFtZVtpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnQgPT09IFwiLlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJ0ID09PSBcIi4uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpID09PSAxICYmIChuYW1lWzJdID09PSAnLi4nIHx8IG5hbWVbMF0gPT09ICcuLicpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9FbmQgb2YgdGhlIGxpbmUuIEtlZXAgYXQgbGVhc3Qgb25lIG5vbi1kb3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3BhdGggc2VnbWVudCBhdCB0aGUgZnJvbnQgc28gaXQgY2FuIGJlIG1hcHBlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29ycmVjdGx5IHRvIGRpc2suIE90aGVyd2lzZSwgdGhlcmUgaXMgbGlrZWx5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9ubyBwYXRoIG1hcHBpbmcgZm9yIGEgcGF0aCBzdGFydGluZyB3aXRoICcuLicuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9UaGlzIGNhbiBzdGlsbCBmYWlsLCBidXQgY2F0Y2hlcyB0aGUgbW9zdCByZWFzb25hYmxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy91c2VzIG9mIC4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZS5zcGxpY2UoaSAtIDEsIDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkgLT0gMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL2VuZCB0cmltRG90c1xuXG4gICAgICAgICAgICAgICAgbmFtZSA9IG5hbWUuam9pbihcIi9cIik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5hbWUuaW5kZXhPZignLi8nKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIE5vIGJhc2VOYW1lLCBzbyB0aGlzIGlzIElEIGlzIHJlc29sdmVkIHJlbGF0aXZlXG4gICAgICAgICAgICAgICAgLy8gdG8gYmFzZVVybCwgcHVsbCBvZmYgdGhlIGxlYWRpbmcgZG90LlxuICAgICAgICAgICAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cmluZygyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vQXBwbHkgbWFwIGNvbmZpZyBpZiBhdmFpbGFibGUuXG4gICAgICAgIGlmICgoYmFzZVBhcnRzIHx8IHN0YXJNYXApICYmIG1hcCkge1xuICAgICAgICAgICAgbmFtZVBhcnRzID0gbmFtZS5zcGxpdCgnLycpO1xuXG4gICAgICAgICAgICBmb3IgKGkgPSBuYW1lUGFydHMubGVuZ3RoOyBpID4gMDsgaSAtPSAxKSB7XG4gICAgICAgICAgICAgICAgbmFtZVNlZ21lbnQgPSBuYW1lUGFydHMuc2xpY2UoMCwgaSkuam9pbihcIi9cIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoYmFzZVBhcnRzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vRmluZCB0aGUgbG9uZ2VzdCBiYXNlTmFtZSBzZWdtZW50IG1hdGNoIGluIHRoZSBjb25maWcuXG4gICAgICAgICAgICAgICAgICAgIC8vU28sIGRvIGpvaW5zIG9uIHRoZSBiaWdnZXN0IHRvIHNtYWxsZXN0IGxlbmd0aHMgb2YgYmFzZVBhcnRzLlxuICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSBiYXNlUGFydHMubGVuZ3RoOyBqID4gMDsgaiAtPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBWYWx1ZSA9IG1hcFtiYXNlUGFydHMuc2xpY2UoMCwgaikuam9pbignLycpXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9iYXNlTmFtZSBzZWdtZW50IGhhcyAgY29uZmlnLCBmaW5kIGlmIGl0IGhhcyBvbmUgZm9yXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3RoaXMgbmFtZS5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXBWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcFZhbHVlID0gbWFwVmFsdWVbbmFtZVNlZ21lbnRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXBWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL01hdGNoLCB1cGRhdGUgbmFtZSB0byB0aGUgbmV3IHZhbHVlLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZE1hcCA9IG1hcFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZEkgPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoZm91bmRNYXApIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy9DaGVjayBmb3IgYSBzdGFyIG1hcCBtYXRjaCwgYnV0IGp1c3QgaG9sZCBvbiB0byBpdCxcbiAgICAgICAgICAgICAgICAvL2lmIHRoZXJlIGlzIGEgc2hvcnRlciBzZWdtZW50IG1hdGNoIGxhdGVyIGluIGEgbWF0Y2hpbmdcbiAgICAgICAgICAgICAgICAvL2NvbmZpZywgdGhlbiBmYXZvciBvdmVyIHRoaXMgc3RhciBtYXAuXG4gICAgICAgICAgICAgICAgaWYgKCFmb3VuZFN0YXJNYXAgJiYgc3Rhck1hcCAmJiBzdGFyTWFwW25hbWVTZWdtZW50XSkge1xuICAgICAgICAgICAgICAgICAgICBmb3VuZFN0YXJNYXAgPSBzdGFyTWFwW25hbWVTZWdtZW50XTtcbiAgICAgICAgICAgICAgICAgICAgc3RhckkgPSBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFmb3VuZE1hcCAmJiBmb3VuZFN0YXJNYXApIHtcbiAgICAgICAgICAgICAgICBmb3VuZE1hcCA9IGZvdW5kU3Rhck1hcDtcbiAgICAgICAgICAgICAgICBmb3VuZEkgPSBzdGFySTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGZvdW5kTWFwKSB7XG4gICAgICAgICAgICAgICAgbmFtZVBhcnRzLnNwbGljZSgwLCBmb3VuZEksIGZvdW5kTWFwKTtcbiAgICAgICAgICAgICAgICBuYW1lID0gbmFtZVBhcnRzLmpvaW4oJy8nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuYW1lO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VSZXF1aXJlKHJlbE5hbWUsIGZvcmNlU3luYykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy9BIHZlcnNpb24gb2YgYSByZXF1aXJlIGZ1bmN0aW9uIHRoYXQgcGFzc2VzIGEgbW9kdWxlTmFtZVxuICAgICAgICAgICAgLy92YWx1ZSBmb3IgaXRlbXMgdGhhdCBtYXkgbmVlZCB0b1xuICAgICAgICAgICAgLy9sb29rIHVwIHBhdGhzIHJlbGF0aXZlIHRvIHRoZSBtb2R1bGVOYW1lXG4gICAgICAgICAgICB2YXIgYXJncyA9IGFwcy5jYWxsKGFyZ3VtZW50cywgMCk7XG5cbiAgICAgICAgICAgIC8vSWYgZmlyc3QgYXJnIGlzIG5vdCByZXF1aXJlKCdzdHJpbmcnKSwgYW5kIHRoZXJlIGlzIG9ubHlcbiAgICAgICAgICAgIC8vb25lIGFyZywgaXQgaXMgdGhlIGFycmF5IGZvcm0gd2l0aG91dCBhIGNhbGxiYWNrLiBJbnNlcnRcbiAgICAgICAgICAgIC8vYSBudWxsIHNvIHRoYXQgdGhlIGZvbGxvd2luZyBjb25jYXQgaXMgY29ycmVjdC5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXJnc1swXSAhPT0gJ3N0cmluZycgJiYgYXJncy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICBhcmdzLnB1c2gobnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVxLmFwcGx5KHVuZGVmLCBhcmdzLmNvbmNhdChbcmVsTmFtZSwgZm9yY2VTeW5jXSkpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VOb3JtYWxpemUocmVsTmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBub3JtYWxpemUobmFtZSwgcmVsTmFtZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUxvYWQoZGVwTmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBkZWZpbmVkW2RlcE5hbWVdID0gdmFsdWU7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FsbERlcChuYW1lKSB7XG4gICAgICAgIGlmIChoYXNQcm9wKHdhaXRpbmcsIG5hbWUpKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9IHdhaXRpbmdbbmFtZV07XG4gICAgICAgICAgICBkZWxldGUgd2FpdGluZ1tuYW1lXTtcbiAgICAgICAgICAgIGRlZmluaW5nW25hbWVdID0gdHJ1ZTtcbiAgICAgICAgICAgIG1haW4uYXBwbHkodW5kZWYsIGFyZ3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFoYXNQcm9wKGRlZmluZWQsIG5hbWUpICYmICFoYXNQcm9wKGRlZmluaW5nLCBuYW1lKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyAnICsgbmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZmluZWRbbmFtZV07XG4gICAgfVxuXG4gICAgLy9UdXJucyBhIHBsdWdpbiFyZXNvdXJjZSB0byBbcGx1Z2luLCByZXNvdXJjZV1cbiAgICAvL3dpdGggdGhlIHBsdWdpbiBiZWluZyB1bmRlZmluZWQgaWYgdGhlIG5hbWVcbiAgICAvL2RpZCBub3QgaGF2ZSBhIHBsdWdpbiBwcmVmaXguXG4gICAgZnVuY3Rpb24gc3BsaXRQcmVmaXgobmFtZSkge1xuICAgICAgICB2YXIgcHJlZml4LFxuICAgICAgICAgICAgaW5kZXggPSBuYW1lID8gbmFtZS5pbmRleE9mKCchJykgOiAtMTtcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIHByZWZpeCA9IG5hbWUuc3Vic3RyaW5nKDAsIGluZGV4KTtcbiAgICAgICAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cmluZyhpbmRleCArIDEsIG5hbWUubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3ByZWZpeCwgbmFtZV07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWFrZXMgYSBuYW1lIG1hcCwgbm9ybWFsaXppbmcgdGhlIG5hbWUsIGFuZCB1c2luZyBhIHBsdWdpblxuICAgICAqIGZvciBub3JtYWxpemF0aW9uIGlmIG5lY2Vzc2FyeS4gR3JhYnMgYSByZWYgdG8gcGx1Z2luXG4gICAgICogdG9vLCBhcyBhbiBvcHRpbWl6YXRpb24uXG4gICAgICovXG4gICAgbWFrZU1hcCA9IGZ1bmN0aW9uIChuYW1lLCByZWxOYW1lKSB7XG4gICAgICAgIHZhciBwbHVnaW4sXG4gICAgICAgICAgICBwYXJ0cyA9IHNwbGl0UHJlZml4KG5hbWUpLFxuICAgICAgICAgICAgcHJlZml4ID0gcGFydHNbMF07XG5cbiAgICAgICAgbmFtZSA9IHBhcnRzWzFdO1xuXG4gICAgICAgIGlmIChwcmVmaXgpIHtcbiAgICAgICAgICAgIHByZWZpeCA9IG5vcm1hbGl6ZShwcmVmaXgsIHJlbE5hbWUpO1xuICAgICAgICAgICAgcGx1Z2luID0gY2FsbERlcChwcmVmaXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9Ob3JtYWxpemUgYWNjb3JkaW5nXG4gICAgICAgIGlmIChwcmVmaXgpIHtcbiAgICAgICAgICAgIGlmIChwbHVnaW4gJiYgcGx1Z2luLm5vcm1hbGl6ZSkge1xuICAgICAgICAgICAgICAgIG5hbWUgPSBwbHVnaW4ubm9ybWFsaXplKG5hbWUsIG1ha2VOb3JtYWxpemUocmVsTmFtZSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuYW1lID0gbm9ybWFsaXplKG5hbWUsIHJlbE5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmFtZSA9IG5vcm1hbGl6ZShuYW1lLCByZWxOYW1lKTtcbiAgICAgICAgICAgIHBhcnRzID0gc3BsaXRQcmVmaXgobmFtZSk7XG4gICAgICAgICAgICBwcmVmaXggPSBwYXJ0c1swXTtcbiAgICAgICAgICAgIG5hbWUgPSBwYXJ0c1sxXTtcbiAgICAgICAgICAgIGlmIChwcmVmaXgpIHtcbiAgICAgICAgICAgICAgICBwbHVnaW4gPSBjYWxsRGVwKHByZWZpeCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL1VzaW5nIHJpZGljdWxvdXMgcHJvcGVydHkgbmFtZXMgZm9yIHNwYWNlIHJlYXNvbnNcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGY6IHByZWZpeCA/IHByZWZpeCArICchJyArIG5hbWUgOiBuYW1lLCAvL2Z1bGxOYW1lXG4gICAgICAgICAgICBuOiBuYW1lLFxuICAgICAgICAgICAgcHI6IHByZWZpeCxcbiAgICAgICAgICAgIHA6IHBsdWdpblxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBtYWtlQ29uZmlnKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAoY29uZmlnICYmIGNvbmZpZy5jb25maWcgJiYgY29uZmlnLmNvbmZpZ1tuYW1lXSkgfHwge307XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgaGFuZGxlcnMgPSB7XG4gICAgICAgIHJlcXVpcmU6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gbWFrZVJlcXVpcmUobmFtZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGV4cG9ydHM6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICB2YXIgZSA9IGRlZmluZWRbbmFtZV07XG4gICAgICAgICAgICBpZiAodHlwZW9mIGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAoZGVmaW5lZFtuYW1lXSA9IHt9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbW9kdWxlOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpZDogbmFtZSxcbiAgICAgICAgICAgICAgICB1cmk6ICcnLFxuICAgICAgICAgICAgICAgIGV4cG9ydHM6IGRlZmluZWRbbmFtZV0sXG4gICAgICAgICAgICAgICAgY29uZmlnOiBtYWtlQ29uZmlnKG5hbWUpXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIG1haW4gPSBmdW5jdGlvbiAobmFtZSwgZGVwcywgY2FsbGJhY2ssIHJlbE5hbWUpIHtcbiAgICAgICAgdmFyIGNqc01vZHVsZSwgZGVwTmFtZSwgcmV0LCBtYXAsIGksXG4gICAgICAgICAgICBhcmdzID0gW10sXG4gICAgICAgICAgICBjYWxsYmFja1R5cGUgPSB0eXBlb2YgY2FsbGJhY2ssXG4gICAgICAgICAgICB1c2luZ0V4cG9ydHM7XG5cbiAgICAgICAgLy9Vc2UgbmFtZSBpZiBubyByZWxOYW1lXG4gICAgICAgIHJlbE5hbWUgPSByZWxOYW1lIHx8IG5hbWU7XG5cbiAgICAgICAgLy9DYWxsIHRoZSBjYWxsYmFjayB0byBkZWZpbmUgdGhlIG1vZHVsZSwgaWYgbmVjZXNzYXJ5LlxuICAgICAgICBpZiAoY2FsbGJhY2tUeXBlID09PSAndW5kZWZpbmVkJyB8fCBjYWxsYmFja1R5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIC8vUHVsbCBvdXQgdGhlIGRlZmluZWQgZGVwZW5kZW5jaWVzIGFuZCBwYXNzIHRoZSBvcmRlcmVkXG4gICAgICAgICAgICAvL3ZhbHVlcyB0byB0aGUgY2FsbGJhY2suXG4gICAgICAgICAgICAvL0RlZmF1bHQgdG8gW3JlcXVpcmUsIGV4cG9ydHMsIG1vZHVsZV0gaWYgbm8gZGVwc1xuICAgICAgICAgICAgZGVwcyA9ICFkZXBzLmxlbmd0aCAmJiBjYWxsYmFjay5sZW5ndGggPyBbJ3JlcXVpcmUnLCAnZXhwb3J0cycsICdtb2R1bGUnXSA6IGRlcHM7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZGVwcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIG1hcCA9IG1ha2VNYXAoZGVwc1tpXSwgcmVsTmFtZSk7XG4gICAgICAgICAgICAgICAgZGVwTmFtZSA9IG1hcC5mO1xuXG4gICAgICAgICAgICAgICAgLy9GYXN0IHBhdGggQ29tbW9uSlMgc3RhbmRhcmQgZGVwZW5kZW5jaWVzLlxuICAgICAgICAgICAgICAgIGlmIChkZXBOYW1lID09PSBcInJlcXVpcmVcIikge1xuICAgICAgICAgICAgICAgICAgICBhcmdzW2ldID0gaGFuZGxlcnMucmVxdWlyZShuYW1lKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRlcE5hbWUgPT09IFwiZXhwb3J0c1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vQ29tbW9uSlMgbW9kdWxlIHNwZWMgMS4xXG4gICAgICAgICAgICAgICAgICAgIGFyZ3NbaV0gPSBoYW5kbGVycy5leHBvcnRzKG5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB1c2luZ0V4cG9ydHMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVwTmFtZSA9PT0gXCJtb2R1bGVcIikge1xuICAgICAgICAgICAgICAgICAgICAvL0NvbW1vbkpTIG1vZHVsZSBzcGVjIDEuMVxuICAgICAgICAgICAgICAgICAgICBjanNNb2R1bGUgPSBhcmdzW2ldID0gaGFuZGxlcnMubW9kdWxlKG5hbWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFzUHJvcChkZWZpbmVkLCBkZXBOYW1lKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzUHJvcCh3YWl0aW5nLCBkZXBOYW1lKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzUHJvcChkZWZpbmluZywgZGVwTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnc1tpXSA9IGNhbGxEZXAoZGVwTmFtZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtYXAucCkge1xuICAgICAgICAgICAgICAgICAgICBtYXAucC5sb2FkKG1hcC5uLCBtYWtlUmVxdWlyZShyZWxOYW1lLCB0cnVlKSwgbWFrZUxvYWQoZGVwTmFtZSksIHt9KTtcbiAgICAgICAgICAgICAgICAgICAgYXJnc1tpXSA9IGRlZmluZWRbZGVwTmFtZV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG5hbWUgKyAnIG1pc3NpbmcgJyArIGRlcE5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0ID0gY2FsbGJhY2sgPyBjYWxsYmFjay5hcHBseShkZWZpbmVkW25hbWVdLCBhcmdzKSA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICAgICAgICAvL0lmIHNldHRpbmcgZXhwb3J0cyB2aWEgXCJtb2R1bGVcIiBpcyBpbiBwbGF5LFxuICAgICAgICAgICAgICAgIC8vZmF2b3IgdGhhdCBvdmVyIHJldHVybiB2YWx1ZSBhbmQgZXhwb3J0cy4gQWZ0ZXIgdGhhdCxcbiAgICAgICAgICAgICAgICAvL2Zhdm9yIGEgbm9uLXVuZGVmaW5lZCByZXR1cm4gdmFsdWUgb3ZlciBleHBvcnRzIHVzZS5cbiAgICAgICAgICAgICAgICBpZiAoY2pzTW9kdWxlICYmIGNqc01vZHVsZS5leHBvcnRzICE9PSB1bmRlZiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgY2pzTW9kdWxlLmV4cG9ydHMgIT09IGRlZmluZWRbbmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmaW5lZFtuYW1lXSA9IGNqc01vZHVsZS5leHBvcnRzO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmV0ICE9PSB1bmRlZiB8fCAhdXNpbmdFeHBvcnRzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vVXNlIHRoZSByZXR1cm4gdmFsdWUgZnJvbSB0aGUgZnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgICAgIGRlZmluZWRbbmFtZV0gPSByZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG5hbWUpIHtcbiAgICAgICAgICAgIC8vTWF5IGp1c3QgYmUgYW4gb2JqZWN0IGRlZmluaXRpb24gZm9yIHRoZSBtb2R1bGUuIE9ubHlcbiAgICAgICAgICAgIC8vd29ycnkgYWJvdXQgZGVmaW5pbmcgaWYgaGF2ZSBhIG1vZHVsZSBuYW1lLlxuICAgICAgICAgICAgZGVmaW5lZFtuYW1lXSA9IGNhbGxiYWNrO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHJlcXVpcmVqcyA9IHJlcXVpcmUgPSByZXEgPSBmdW5jdGlvbiAoZGVwcywgY2FsbGJhY2ssIHJlbE5hbWUsIGZvcmNlU3luYywgYWx0KSB7XG4gICAgICAgIGlmICh0eXBlb2YgZGVwcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgaWYgKGhhbmRsZXJzW2RlcHNdKSB7XG4gICAgICAgICAgICAgICAgLy9jYWxsYmFjayBpbiB0aGlzIGNhc2UgaXMgcmVhbGx5IHJlbE5hbWVcbiAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlcnNbZGVwc10oY2FsbGJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9KdXN0IHJldHVybiB0aGUgbW9kdWxlIHdhbnRlZC4gSW4gdGhpcyBzY2VuYXJpbywgdGhlXG4gICAgICAgICAgICAvL2RlcHMgYXJnIGlzIHRoZSBtb2R1bGUgbmFtZSwgYW5kIHNlY29uZCBhcmcgKGlmIHBhc3NlZClcbiAgICAgICAgICAgIC8vaXMganVzdCB0aGUgcmVsTmFtZS5cbiAgICAgICAgICAgIC8vTm9ybWFsaXplIG1vZHVsZSBuYW1lLCBpZiBpdCBjb250YWlucyAuIG9yIC4uXG4gICAgICAgICAgICByZXR1cm4gY2FsbERlcChtYWtlTWFwKGRlcHMsIGNhbGxiYWNrKS5mKTtcbiAgICAgICAgfSBlbHNlIGlmICghZGVwcy5zcGxpY2UpIHtcbiAgICAgICAgICAgIC8vZGVwcyBpcyBhIGNvbmZpZyBvYmplY3QsIG5vdCBhbiBhcnJheS5cbiAgICAgICAgICAgIGNvbmZpZyA9IGRlcHM7XG4gICAgICAgICAgICBpZiAoY29uZmlnLmRlcHMpIHtcbiAgICAgICAgICAgICAgICByZXEoY29uZmlnLmRlcHMsIGNvbmZpZy5jYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2suc3BsaWNlKSB7XG4gICAgICAgICAgICAgICAgLy9jYWxsYmFjayBpcyBhbiBhcnJheSwgd2hpY2ggbWVhbnMgaXQgaXMgYSBkZXBlbmRlbmN5IGxpc3QuXG4gICAgICAgICAgICAgICAgLy9BZGp1c3QgYXJncyBpZiB0aGVyZSBhcmUgZGVwZW5kZW5jaWVzXG4gICAgICAgICAgICAgICAgZGVwcyA9IGNhbGxiYWNrO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gcmVsTmFtZTtcbiAgICAgICAgICAgICAgICByZWxOYW1lID0gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVwcyA9IHVuZGVmO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9TdXBwb3J0IHJlcXVpcmUoWydhJ10pXG4gICAgICAgIGNhbGxiYWNrID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24gKCkge307XG5cbiAgICAgICAgLy9JZiByZWxOYW1lIGlzIGEgZnVuY3Rpb24sIGl0IGlzIGFuIGVycmJhY2sgaGFuZGxlcixcbiAgICAgICAgLy9zbyByZW1vdmUgaXQuXG4gICAgICAgIGlmICh0eXBlb2YgcmVsTmFtZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmVsTmFtZSA9IGZvcmNlU3luYztcbiAgICAgICAgICAgIGZvcmNlU3luYyA9IGFsdDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vU2ltdWxhdGUgYXN5bmMgY2FsbGJhY2s7XG4gICAgICAgIGlmIChmb3JjZVN5bmMpIHtcbiAgICAgICAgICAgIG1haW4odW5kZWYsIGRlcHMsIGNhbGxiYWNrLCByZWxOYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vVXNpbmcgYSBub24temVybyB2YWx1ZSBiZWNhdXNlIG9mIGNvbmNlcm4gZm9yIHdoYXQgb2xkIGJyb3dzZXJzXG4gICAgICAgICAgICAvL2RvLCBhbmQgbGF0ZXN0IGJyb3dzZXJzIFwidXBncmFkZVwiIHRvIDQgaWYgbG93ZXIgdmFsdWUgaXMgdXNlZDpcbiAgICAgICAgICAgIC8vaHR0cDovL3d3dy53aGF0d2cub3JnL3NwZWNzL3dlYi1hcHBzL2N1cnJlbnQtd29yay9tdWx0aXBhZ2UvdGltZXJzLmh0bWwjZG9tLXdpbmRvd3RpbWVycy1zZXR0aW1lb3V0OlxuICAgICAgICAgICAgLy9JZiB3YW50IGEgdmFsdWUgaW1tZWRpYXRlbHksIHVzZSByZXF1aXJlKCdpZCcpIGluc3RlYWQgLS0gc29tZXRoaW5nXG4gICAgICAgICAgICAvL3RoYXQgd29ya3MgaW4gYWxtb25kIG9uIHRoZSBnbG9iYWwgbGV2ZWwsIGJ1dCBub3QgZ3VhcmFudGVlZCBhbmRcbiAgICAgICAgICAgIC8vdW5saWtlbHkgdG8gd29yayBpbiBvdGhlciBBTUQgaW1wbGVtZW50YXRpb25zLlxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgbWFpbih1bmRlZiwgZGVwcywgY2FsbGJhY2ssIHJlbE5hbWUpO1xuICAgICAgICAgICAgfSwgNCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVxO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBKdXN0IGRyb3BzIHRoZSBjb25maWcgb24gdGhlIGZsb29yLCBidXQgcmV0dXJucyByZXEgaW4gY2FzZVxuICAgICAqIHRoZSBjb25maWcgcmV0dXJuIHZhbHVlIGlzIHVzZWQuXG4gICAgICovXG4gICAgcmVxLmNvbmZpZyA9IGZ1bmN0aW9uIChjZmcpIHtcbiAgICAgICAgcmV0dXJuIHJlcShjZmcpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBFeHBvc2UgbW9kdWxlIHJlZ2lzdHJ5IGZvciBkZWJ1Z2dpbmcgYW5kIHRvb2xpbmdcbiAgICAgKi9cbiAgICByZXF1aXJlanMuX2RlZmluZWQgPSBkZWZpbmVkO1xuXG4gICAgZGVmaW5lID0gZnVuY3Rpb24gKG5hbWUsIGRlcHMsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU2VlIGFsbW9uZCBSRUFETUU6IGluY29ycmVjdCBtb2R1bGUgYnVpbGQsIG5vIG1vZHVsZSBuYW1lJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvL1RoaXMgbW9kdWxlIG1heSBub3QgaGF2ZSBkZXBlbmRlbmNpZXNcbiAgICAgICAgaWYgKCFkZXBzLnNwbGljZSkge1xuICAgICAgICAgICAgLy9kZXBzIGlzIG5vdCBhbiBhcnJheSwgc28gcHJvYmFibHkgbWVhbnNcbiAgICAgICAgICAgIC8vYW4gb2JqZWN0IGxpdGVyYWwgb3IgZmFjdG9yeSBmdW5jdGlvbiBmb3JcbiAgICAgICAgICAgIC8vdGhlIHZhbHVlLiBBZGp1c3QgYXJncy5cbiAgICAgICAgICAgIGNhbGxiYWNrID0gZGVwcztcbiAgICAgICAgICAgIGRlcHMgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaGFzUHJvcChkZWZpbmVkLCBuYW1lKSAmJiAhaGFzUHJvcCh3YWl0aW5nLCBuYW1lKSkge1xuICAgICAgICAgICAgd2FpdGluZ1tuYW1lXSA9IFtuYW1lLCBkZXBzLCBjYWxsYmFja107XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZGVmaW5lLmFtZCA9IHtcbiAgICAgICAgalF1ZXJ5OiB0cnVlXG4gICAgfTtcbn0oKSk7XG5cblMyLnJlcXVpcmVqcyA9IHJlcXVpcmVqcztTMi5yZXF1aXJlID0gcmVxdWlyZTtTMi5kZWZpbmUgPSBkZWZpbmU7XG59XG59KCkpO1xuUzIuZGVmaW5lKFwiYWxtb25kXCIsIGZ1bmN0aW9uKCl7fSk7XG5cbi8qIGdsb2JhbCBqUXVlcnk6ZmFsc2UsICQ6ZmFsc2UgKi9cblMyLmRlZmluZSgnanF1ZXJ5JyxbXSxmdW5jdGlvbiAoKSB7XG4gIHZhciBfJCA9IGpRdWVyeSB8fCAkO1xuXG4gIGlmIChfJCA9PSBudWxsICYmIGNvbnNvbGUgJiYgY29uc29sZS5lcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAnU2VsZWN0MjogQW4gaW5zdGFuY2Ugb2YgalF1ZXJ5IG9yIGEgalF1ZXJ5LWNvbXBhdGlibGUgbGlicmFyeSB3YXMgbm90ICcgK1xuICAgICAgJ2ZvdW5kLiBNYWtlIHN1cmUgdGhhdCB5b3UgYXJlIGluY2x1ZGluZyBqUXVlcnkgYmVmb3JlIFNlbGVjdDIgb24geW91ciAnICtcbiAgICAgICd3ZWIgcGFnZS4nXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBfJDtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvdXRpbHMnLFtcbiAgJ2pxdWVyeSdcbl0sIGZ1bmN0aW9uICgkKSB7XG4gIHZhciBVdGlscyA9IHt9O1xuXG4gIFV0aWxzLkV4dGVuZCA9IGZ1bmN0aW9uIChDaGlsZENsYXNzLCBTdXBlckNsYXNzKSB7XG4gICAgdmFyIF9faGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG4gICAgZnVuY3Rpb24gQmFzZUNvbnN0cnVjdG9yICgpIHtcbiAgICAgIHRoaXMuY29uc3RydWN0b3IgPSBDaGlsZENsYXNzO1xuICAgIH1cblxuICAgIGZvciAodmFyIGtleSBpbiBTdXBlckNsYXNzKSB7XG4gICAgICBpZiAoX19oYXNQcm9wLmNhbGwoU3VwZXJDbGFzcywga2V5KSkge1xuICAgICAgICBDaGlsZENsYXNzW2tleV0gPSBTdXBlckNsYXNzW2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgQmFzZUNvbnN0cnVjdG9yLnByb3RvdHlwZSA9IFN1cGVyQ2xhc3MucHJvdG90eXBlO1xuICAgIENoaWxkQ2xhc3MucHJvdG90eXBlID0gbmV3IEJhc2VDb25zdHJ1Y3RvcigpO1xuICAgIENoaWxkQ2xhc3MuX19zdXBlcl9fID0gU3VwZXJDbGFzcy5wcm90b3R5cGU7XG5cbiAgICByZXR1cm4gQ2hpbGRDbGFzcztcbiAgfTtcblxuICBmdW5jdGlvbiBnZXRNZXRob2RzICh0aGVDbGFzcykge1xuICAgIHZhciBwcm90byA9IHRoZUNsYXNzLnByb3RvdHlwZTtcblxuICAgIHZhciBtZXRob2RzID0gW107XG5cbiAgICBmb3IgKHZhciBtZXRob2ROYW1lIGluIHByb3RvKSB7XG4gICAgICB2YXIgbSA9IHByb3RvW21ldGhvZE5hbWVdO1xuXG4gICAgICBpZiAodHlwZW9mIG0gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChtZXRob2ROYW1lID09PSAnY29uc3RydWN0b3InKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBtZXRob2RzLnB1c2gobWV0aG9kTmFtZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1ldGhvZHM7XG4gIH1cblxuICBVdGlscy5EZWNvcmF0ZSA9IGZ1bmN0aW9uIChTdXBlckNsYXNzLCBEZWNvcmF0b3JDbGFzcykge1xuICAgIHZhciBkZWNvcmF0ZWRNZXRob2RzID0gZ2V0TWV0aG9kcyhEZWNvcmF0b3JDbGFzcyk7XG4gICAgdmFyIHN1cGVyTWV0aG9kcyA9IGdldE1ldGhvZHMoU3VwZXJDbGFzcyk7XG5cbiAgICBmdW5jdGlvbiBEZWNvcmF0ZWRDbGFzcyAoKSB7XG4gICAgICB2YXIgdW5zaGlmdCA9IEFycmF5LnByb3RvdHlwZS51bnNoaWZ0O1xuXG4gICAgICB2YXIgYXJnQ291bnQgPSBEZWNvcmF0b3JDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IubGVuZ3RoO1xuXG4gICAgICB2YXIgY2FsbGVkQ29uc3RydWN0b3IgPSBTdXBlckNsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3RvcjtcblxuICAgICAgaWYgKGFyZ0NvdW50ID4gMCkge1xuICAgICAgICB1bnNoaWZ0LmNhbGwoYXJndW1lbnRzLCBTdXBlckNsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcik7XG5cbiAgICAgICAgY2FsbGVkQ29uc3RydWN0b3IgPSBEZWNvcmF0b3JDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3I7XG4gICAgICB9XG5cbiAgICAgIGNhbGxlZENvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgRGVjb3JhdG9yQ2xhc3MuZGlzcGxheU5hbWUgPSBTdXBlckNsYXNzLmRpc3BsYXlOYW1lO1xuXG4gICAgZnVuY3Rpb24gY3RyICgpIHtcbiAgICAgIHRoaXMuY29uc3RydWN0b3IgPSBEZWNvcmF0ZWRDbGFzcztcbiAgICB9XG5cbiAgICBEZWNvcmF0ZWRDbGFzcy5wcm90b3R5cGUgPSBuZXcgY3RyKCk7XG5cbiAgICBmb3IgKHZhciBtID0gMDsgbSA8IHN1cGVyTWV0aG9kcy5sZW5ndGg7IG0rKykge1xuICAgICAgICB2YXIgc3VwZXJNZXRob2QgPSBzdXBlck1ldGhvZHNbbV07XG5cbiAgICAgICAgRGVjb3JhdGVkQ2xhc3MucHJvdG90eXBlW3N1cGVyTWV0aG9kXSA9XG4gICAgICAgICAgU3VwZXJDbGFzcy5wcm90b3R5cGVbc3VwZXJNZXRob2RdO1xuICAgIH1cblxuICAgIHZhciBjYWxsZWRNZXRob2QgPSBmdW5jdGlvbiAobWV0aG9kTmFtZSkge1xuICAgICAgLy8gU3R1YiBvdXQgdGhlIG9yaWdpbmFsIG1ldGhvZCBpZiBpdCdzIG5vdCBkZWNvcmF0aW5nIGFuIGFjdHVhbCBtZXRob2RcbiAgICAgIHZhciBvcmlnaW5hbE1ldGhvZCA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgICBpZiAobWV0aG9kTmFtZSBpbiBEZWNvcmF0ZWRDbGFzcy5wcm90b3R5cGUpIHtcbiAgICAgICAgb3JpZ2luYWxNZXRob2QgPSBEZWNvcmF0ZWRDbGFzcy5wcm90b3R5cGVbbWV0aG9kTmFtZV07XG4gICAgICB9XG5cbiAgICAgIHZhciBkZWNvcmF0ZWRNZXRob2QgPSBEZWNvcmF0b3JDbGFzcy5wcm90b3R5cGVbbWV0aG9kTmFtZV07XG5cbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB1bnNoaWZ0ID0gQXJyYXkucHJvdG90eXBlLnVuc2hpZnQ7XG5cbiAgICAgICAgdW5zaGlmdC5jYWxsKGFyZ3VtZW50cywgb3JpZ2luYWxNZXRob2QpO1xuXG4gICAgICAgIHJldHVybiBkZWNvcmF0ZWRNZXRob2QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgfTtcblxuICAgIGZvciAodmFyIGQgPSAwOyBkIDwgZGVjb3JhdGVkTWV0aG9kcy5sZW5ndGg7IGQrKykge1xuICAgICAgdmFyIGRlY29yYXRlZE1ldGhvZCA9IGRlY29yYXRlZE1ldGhvZHNbZF07XG5cbiAgICAgIERlY29yYXRlZENsYXNzLnByb3RvdHlwZVtkZWNvcmF0ZWRNZXRob2RdID0gY2FsbGVkTWV0aG9kKGRlY29yYXRlZE1ldGhvZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIERlY29yYXRlZENsYXNzO1xuICB9O1xuXG4gIHZhciBPYnNlcnZhYmxlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubGlzdGVuZXJzID0ge307XG4gIH07XG5cbiAgT2JzZXJ2YWJsZS5wcm90b3R5cGUub24gPSBmdW5jdGlvbiAoZXZlbnQsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5saXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVycyB8fCB7fTtcblxuICAgIGlmIChldmVudCBpbiB0aGlzLmxpc3RlbmVycykge1xuICAgICAgdGhpcy5saXN0ZW5lcnNbZXZlbnRdLnB1c2goY2FsbGJhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxpc3RlbmVyc1tldmVudF0gPSBbY2FsbGJhY2tdO1xuICAgIH1cbiAgfTtcblxuICBPYnNlcnZhYmxlLnByb3RvdHlwZS50cmlnZ2VyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuICAgIHZhciBwYXJhbXMgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgICB0aGlzLmxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzIHx8IHt9O1xuXG4gICAgLy8gUGFyYW1zIHNob3VsZCBhbHdheXMgY29tZSBpbiBhcyBhbiBhcnJheVxuICAgIGlmIChwYXJhbXMgPT0gbnVsbCkge1xuICAgICAgcGFyYW1zID0gW107XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlcmUgYXJlIG5vIGFyZ3VtZW50cyB0byB0aGUgZXZlbnQsIHVzZSBhIHRlbXBvcmFyeSBvYmplY3RcbiAgICBpZiAocGFyYW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcGFyYW1zLnB1c2goe30pO1xuICAgIH1cblxuICAgIC8vIFNldCB0aGUgYF90eXBlYCBvZiB0aGUgZmlyc3Qgb2JqZWN0IHRvIHRoZSBldmVudFxuICAgIHBhcmFtc1swXS5fdHlwZSA9IGV2ZW50O1xuXG4gICAgaWYgKGV2ZW50IGluIHRoaXMubGlzdGVuZXJzKSB7XG4gICAgICB0aGlzLmludm9rZSh0aGlzLmxpc3RlbmVyc1tldmVudF0sIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgfVxuXG4gICAgaWYgKCcqJyBpbiB0aGlzLmxpc3RlbmVycykge1xuICAgICAgdGhpcy5pbnZva2UodGhpcy5saXN0ZW5lcnNbJyonXSwgYXJndW1lbnRzKTtcbiAgICB9XG4gIH07XG5cbiAgT2JzZXJ2YWJsZS5wcm90b3R5cGUuaW52b2tlID0gZnVuY3Rpb24gKGxpc3RlbmVycywgcGFyYW1zKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIHBhcmFtcyk7XG4gICAgfVxuICB9O1xuXG4gIFV0aWxzLk9ic2VydmFibGUgPSBPYnNlcnZhYmxlO1xuXG4gIFV0aWxzLmdlbmVyYXRlQ2hhcnMgPSBmdW5jdGlvbiAobGVuZ3RoKSB7XG4gICAgdmFyIGNoYXJzID0gJyc7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcmFuZG9tQ2hhciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDM2KTtcbiAgICAgIGNoYXJzICs9IHJhbmRvbUNoYXIudG9TdHJpbmcoMzYpO1xuICAgIH1cblxuICAgIHJldHVybiBjaGFycztcbiAgfTtcblxuICBVdGlscy5iaW5kID0gZnVuY3Rpb24gKGZ1bmMsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgZnVuYy5hcHBseShjb250ZXh0LCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH07XG5cbiAgVXRpbHMuX2NvbnZlcnREYXRhID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBmb3IgKHZhciBvcmlnaW5hbEtleSBpbiBkYXRhKSB7XG4gICAgICB2YXIga2V5cyA9IG9yaWdpbmFsS2V5LnNwbGl0KCctJyk7XG5cbiAgICAgIHZhciBkYXRhTGV2ZWwgPSBkYXRhO1xuXG4gICAgICBpZiAoa2V5cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwga2V5cy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIga2V5ID0ga2V5c1trXTtcblxuICAgICAgICAvLyBMb3dlcmNhc2UgdGhlIGZpcnN0IGxldHRlclxuICAgICAgICAvLyBCeSBkZWZhdWx0LCBkYXNoLXNlcGFyYXRlZCBiZWNvbWVzIGNhbWVsQ2FzZVxuICAgICAgICBrZXkgPSBrZXkuc3Vic3RyaW5nKDAsIDEpLnRvTG93ZXJDYXNlKCkgKyBrZXkuc3Vic3RyaW5nKDEpO1xuXG4gICAgICAgIGlmICghKGtleSBpbiBkYXRhTGV2ZWwpKSB7XG4gICAgICAgICAgZGF0YUxldmVsW2tleV0gPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChrID09IGtleXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIGRhdGFMZXZlbFtrZXldID0gZGF0YVtvcmlnaW5hbEtleV07XG4gICAgICAgIH1cblxuICAgICAgICBkYXRhTGV2ZWwgPSBkYXRhTGV2ZWxba2V5XTtcbiAgICAgIH1cblxuICAgICAgZGVsZXRlIGRhdGFbb3JpZ2luYWxLZXldO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9O1xuXG4gIFV0aWxzLmhhc1Njcm9sbCA9IGZ1bmN0aW9uIChpbmRleCwgZWwpIHtcbiAgICAvLyBBZGFwdGVkIGZyb20gdGhlIGZ1bmN0aW9uIGNyZWF0ZWQgYnkgQFNoYWRvd1NjcmlwdGVyXG4gICAgLy8gYW5kIGFkYXB0ZWQgYnkgQEJpbGxCYXJyeSBvbiB0aGUgU3RhY2sgRXhjaGFuZ2UgQ29kZSBSZXZpZXcgd2Vic2l0ZS5cbiAgICAvLyBUaGUgb3JpZ2luYWwgY29kZSBjYW4gYmUgZm91bmQgYXRcbiAgICAvLyBodHRwOi8vY29kZXJldmlldy5zdGFja2V4Y2hhbmdlLmNvbS9xLzEzMzM4XG4gICAgLy8gYW5kIHdhcyBkZXNpZ25lZCB0byBiZSB1c2VkIHdpdGggdGhlIFNpenpsZSBzZWxlY3RvciBlbmdpbmUuXG5cbiAgICB2YXIgJGVsID0gJChlbCk7XG4gICAgdmFyIG92ZXJmbG93WCA9IGVsLnN0eWxlLm92ZXJmbG93WDtcbiAgICB2YXIgb3ZlcmZsb3dZID0gZWwuc3R5bGUub3ZlcmZsb3dZO1xuXG4gICAgLy9DaGVjayBib3RoIHggYW5kIHkgZGVjbGFyYXRpb25zXG4gICAgaWYgKG92ZXJmbG93WCA9PT0gb3ZlcmZsb3dZICYmXG4gICAgICAgIChvdmVyZmxvd1kgPT09ICdoaWRkZW4nIHx8IG92ZXJmbG93WSA9PT0gJ3Zpc2libGUnKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChvdmVyZmxvd1ggPT09ICdzY3JvbGwnIHx8IG92ZXJmbG93WSA9PT0gJ3Njcm9sbCcpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiAoJGVsLmlubmVySGVpZ2h0KCkgPCBlbC5zY3JvbGxIZWlnaHQgfHxcbiAgICAgICRlbC5pbm5lcldpZHRoKCkgPCBlbC5zY3JvbGxXaWR0aCk7XG4gIH07XG5cbiAgVXRpbHMuZXNjYXBlTWFya3VwID0gZnVuY3Rpb24gKG1hcmt1cCkge1xuICAgIHZhciByZXBsYWNlTWFwID0ge1xuICAgICAgJ1xcXFwnOiAnJiM5MjsnLFxuICAgICAgJyYnOiAnJmFtcDsnLFxuICAgICAgJzwnOiAnJmx0OycsXG4gICAgICAnPic6ICcmZ3Q7JyxcbiAgICAgICdcIic6ICcmcXVvdDsnLFxuICAgICAgJ1xcJyc6ICcmIzM5OycsXG4gICAgICAnLyc6ICcmIzQ3OydcbiAgICB9O1xuXG4gICAgLy8gRG8gbm90IHRyeSB0byBlc2NhcGUgdGhlIG1hcmt1cCBpZiBpdCdzIG5vdCBhIHN0cmluZ1xuICAgIGlmICh0eXBlb2YgbWFya3VwICE9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIG1hcmt1cDtcbiAgICB9XG5cbiAgICByZXR1cm4gU3RyaW5nKG1hcmt1cCkucmVwbGFjZSgvWyY8PlwiJ1xcL1xcXFxdL2csIGZ1bmN0aW9uIChtYXRjaCkge1xuICAgICAgcmV0dXJuIHJlcGxhY2VNYXBbbWF0Y2hdO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIEFwcGVuZCBhbiBhcnJheSBvZiBqUXVlcnkgbm9kZXMgdG8gYSBnaXZlbiBlbGVtZW50LlxuICBVdGlscy5hcHBlbmRNYW55ID0gZnVuY3Rpb24gKCRlbGVtZW50LCAkbm9kZXMpIHtcbiAgICAvLyBqUXVlcnkgMS43LnggZG9lcyBub3Qgc3VwcG9ydCAkLmZuLmFwcGVuZCgpIHdpdGggYW4gYXJyYXlcbiAgICAvLyBGYWxsIGJhY2sgdG8gYSBqUXVlcnkgb2JqZWN0IGNvbGxlY3Rpb24gdXNpbmcgJC5mbi5hZGQoKVxuICAgIGlmICgkLmZuLmpxdWVyeS5zdWJzdHIoMCwgMykgPT09ICcxLjcnKSB7XG4gICAgICB2YXIgJGpxTm9kZXMgPSAkKCk7XG5cbiAgICAgICQubWFwKCRub2RlcywgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgJGpxTm9kZXMgPSAkanFOb2Rlcy5hZGQobm9kZSk7XG4gICAgICB9KTtcblxuICAgICAgJG5vZGVzID0gJGpxTm9kZXM7XG4gICAgfVxuXG4gICAgJGVsZW1lbnQuYXBwZW5kKCRub2Rlcyk7XG4gIH07XG5cbiAgcmV0dXJuIFV0aWxzO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9yZXN1bHRzJyxbXG4gICdqcXVlcnknLFxuICAnLi91dGlscydcbl0sIGZ1bmN0aW9uICgkLCBVdGlscykge1xuICBmdW5jdGlvbiBSZXN1bHRzICgkZWxlbWVudCwgb3B0aW9ucywgZGF0YUFkYXB0ZXIpIHtcbiAgICB0aGlzLiRlbGVtZW50ID0gJGVsZW1lbnQ7XG4gICAgdGhpcy5kYXRhID0gZGF0YUFkYXB0ZXI7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgIFJlc3VsdHMuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcyk7XG4gIH1cblxuICBVdGlscy5FeHRlbmQoUmVzdWx0cywgVXRpbHMuT2JzZXJ2YWJsZSk7XG5cbiAgUmVzdWx0cy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkcmVzdWx0cyA9ICQoXG4gICAgICAnPHVsIGNsYXNzPVwic2VsZWN0Mi1yZXN1bHRzX19vcHRpb25zXCIgcm9sZT1cInRyZWVcIj48L3VsPidcbiAgICApO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5nZXQoJ211bHRpcGxlJykpIHtcbiAgICAgICRyZXN1bHRzLmF0dHIoJ2FyaWEtbXVsdGlzZWxlY3RhYmxlJywgJ3RydWUnKTtcbiAgICB9XG5cbiAgICB0aGlzLiRyZXN1bHRzID0gJHJlc3VsdHM7XG5cbiAgICByZXR1cm4gJHJlc3VsdHM7XG4gIH07XG5cbiAgUmVzdWx0cy5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy4kcmVzdWx0cy5lbXB0eSgpO1xuICB9O1xuXG4gIFJlc3VsdHMucHJvdG90eXBlLmRpc3BsYXlNZXNzYWdlID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICAgIHZhciBlc2NhcGVNYXJrdXAgPSB0aGlzLm9wdGlvbnMuZ2V0KCdlc2NhcGVNYXJrdXAnKTtcblxuICAgIHRoaXMuY2xlYXIoKTtcbiAgICB0aGlzLmhpZGVMb2FkaW5nKCk7XG5cbiAgICB2YXIgJG1lc3NhZ2UgPSAkKFxuICAgICAgJzxsaSByb2xlPVwidHJlZWl0ZW1cIiBhcmlhLWxpdmU9XCJhc3NlcnRpdmVcIicgK1xuICAgICAgJyBjbGFzcz1cInNlbGVjdDItcmVzdWx0c19fb3B0aW9uXCI+PC9saT4nXG4gICAgKTtcblxuICAgIHZhciBtZXNzYWdlID0gdGhpcy5vcHRpb25zLmdldCgndHJhbnNsYXRpb25zJykuZ2V0KHBhcmFtcy5tZXNzYWdlKTtcblxuICAgICRtZXNzYWdlLmFwcGVuZChcbiAgICAgIGVzY2FwZU1hcmt1cChcbiAgICAgICAgbWVzc2FnZShwYXJhbXMuYXJncylcbiAgICAgIClcbiAgICApO1xuXG4gICAgJG1lc3NhZ2VbMF0uY2xhc3NOYW1lICs9ICcgc2VsZWN0Mi1yZXN1bHRzX19tZXNzYWdlJztcblxuICAgIHRoaXMuJHJlc3VsdHMuYXBwZW5kKCRtZXNzYWdlKTtcbiAgfTtcblxuICBSZXN1bHRzLnByb3RvdHlwZS5oaWRlTWVzc2FnZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy4kcmVzdWx0cy5maW5kKCcuc2VsZWN0Mi1yZXN1bHRzX19tZXNzYWdlJykucmVtb3ZlKCk7XG4gIH07XG5cbiAgUmVzdWx0cy5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB0aGlzLmhpZGVMb2FkaW5nKCk7XG5cbiAgICB2YXIgJG9wdGlvbnMgPSBbXTtcblxuICAgIGlmIChkYXRhLnJlc3VsdHMgPT0gbnVsbCB8fCBkYXRhLnJlc3VsdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBpZiAodGhpcy4kcmVzdWx0cy5jaGlsZHJlbigpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLnRyaWdnZXIoJ3Jlc3VsdHM6bWVzc2FnZScsIHtcbiAgICAgICAgICBtZXNzYWdlOiAnbm9SZXN1bHRzJ1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGRhdGEucmVzdWx0cyA9IHRoaXMuc29ydChkYXRhLnJlc3VsdHMpO1xuXG4gICAgZm9yICh2YXIgZCA9IDA7IGQgPCBkYXRhLnJlc3VsdHMubGVuZ3RoOyBkKyspIHtcbiAgICAgIHZhciBpdGVtID0gZGF0YS5yZXN1bHRzW2RdO1xuXG4gICAgICB2YXIgJG9wdGlvbiA9IHRoaXMub3B0aW9uKGl0ZW0pO1xuXG4gICAgICAkb3B0aW9ucy5wdXNoKCRvcHRpb24pO1xuICAgIH1cblxuICAgIHRoaXMuJHJlc3VsdHMuYXBwZW5kKCRvcHRpb25zKTtcbiAgfTtcblxuICBSZXN1bHRzLnByb3RvdHlwZS5wb3NpdGlvbiA9IGZ1bmN0aW9uICgkcmVzdWx0cywgJGRyb3Bkb3duKSB7XG4gICAgdmFyICRyZXN1bHRzQ29udGFpbmVyID0gJGRyb3Bkb3duLmZpbmQoJy5zZWxlY3QyLXJlc3VsdHMnKTtcbiAgICAkcmVzdWx0c0NvbnRhaW5lci5hcHBlbmQoJHJlc3VsdHMpO1xuICB9O1xuXG4gIFJlc3VsdHMucHJvdG90eXBlLnNvcnQgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBzb3J0ZXIgPSB0aGlzLm9wdGlvbnMuZ2V0KCdzb3J0ZXInKTtcblxuICAgIHJldHVybiBzb3J0ZXIoZGF0YSk7XG4gIH07XG5cbiAgUmVzdWx0cy5wcm90b3R5cGUuaGlnaGxpZ2h0Rmlyc3RJdGVtID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkb3B0aW9ucyA9IHRoaXMuJHJlc3VsdHNcbiAgICAgIC5maW5kKCcuc2VsZWN0Mi1yZXN1bHRzX19vcHRpb25bYXJpYS1zZWxlY3RlZF0nKTtcblxuICAgIHZhciAkc2VsZWN0ZWQgPSAkb3B0aW9ucy5maWx0ZXIoJ1thcmlhLXNlbGVjdGVkPXRydWVdJyk7XG5cbiAgICAvLyBDaGVjayBpZiB0aGVyZSBhcmUgYW55IHNlbGVjdGVkIG9wdGlvbnNcbiAgICBpZiAoJHNlbGVjdGVkLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIElmIHRoZXJlIGFyZSBzZWxlY3RlZCBvcHRpb25zLCBoaWdobGlnaHQgdGhlIGZpcnN0XG4gICAgICAkc2VsZWN0ZWQuZmlyc3QoKS50cmlnZ2VyKCdtb3VzZWVudGVyJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIHRoZXJlIGFyZSBubyBzZWxlY3RlZCBvcHRpb25zLCBoaWdobGlnaHQgdGhlIGZpcnN0IG9wdGlvblxuICAgICAgLy8gaW4gdGhlIGRyb3Bkb3duXG4gICAgICAkb3B0aW9ucy5maXJzdCgpLnRyaWdnZXIoJ21vdXNlZW50ZXInKTtcbiAgICB9XG5cbiAgICB0aGlzLmVuc3VyZUhpZ2hsaWdodFZpc2libGUoKTtcbiAgfTtcblxuICBSZXN1bHRzLnByb3RvdHlwZS5zZXRDbGFzc2VzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHRoaXMuZGF0YS5jdXJyZW50KGZ1bmN0aW9uIChzZWxlY3RlZCkge1xuICAgICAgdmFyIHNlbGVjdGVkSWRzID0gJC5tYXAoc2VsZWN0ZWQsIGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHJldHVybiBzLmlkLnRvU3RyaW5nKCk7XG4gICAgICB9KTtcblxuICAgICAgdmFyICRvcHRpb25zID0gc2VsZi4kcmVzdWx0c1xuICAgICAgICAuZmluZCgnLnNlbGVjdDItcmVzdWx0c19fb3B0aW9uW2FyaWEtc2VsZWN0ZWRdJyk7XG5cbiAgICAgICRvcHRpb25zLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgJG9wdGlvbiA9ICQodGhpcyk7XG5cbiAgICAgICAgdmFyIGl0ZW0gPSAkLmRhdGEodGhpcywgJ2RhdGEnKTtcblxuICAgICAgICAvLyBpZCBuZWVkcyB0byBiZSBjb252ZXJ0ZWQgdG8gYSBzdHJpbmcgd2hlbiBjb21wYXJpbmdcbiAgICAgICAgdmFyIGlkID0gJycgKyBpdGVtLmlkO1xuXG4gICAgICAgIGlmICgoaXRlbS5lbGVtZW50ICE9IG51bGwgJiYgaXRlbS5lbGVtZW50LnNlbGVjdGVkKSB8fFxuICAgICAgICAgICAgKGl0ZW0uZWxlbWVudCA9PSBudWxsICYmICQuaW5BcnJheShpZCwgc2VsZWN0ZWRJZHMpID4gLTEpKSB7XG4gICAgICAgICAgJG9wdGlvbi5hdHRyKCdhcmlhLXNlbGVjdGVkJywgJ3RydWUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkb3B0aW9uLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB9KTtcbiAgfTtcblxuICBSZXN1bHRzLnByb3RvdHlwZS5zaG93TG9hZGluZyA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICB0aGlzLmhpZGVMb2FkaW5nKCk7XG5cbiAgICB2YXIgbG9hZGluZ01vcmUgPSB0aGlzLm9wdGlvbnMuZ2V0KCd0cmFuc2xhdGlvbnMnKS5nZXQoJ3NlYXJjaGluZycpO1xuXG4gICAgdmFyIGxvYWRpbmcgPSB7XG4gICAgICBkaXNhYmxlZDogdHJ1ZSxcbiAgICAgIGxvYWRpbmc6IHRydWUsXG4gICAgICB0ZXh0OiBsb2FkaW5nTW9yZShwYXJhbXMpXG4gICAgfTtcbiAgICB2YXIgJGxvYWRpbmcgPSB0aGlzLm9wdGlvbihsb2FkaW5nKTtcbiAgICAkbG9hZGluZy5jbGFzc05hbWUgKz0gJyBsb2FkaW5nLXJlc3VsdHMnO1xuXG4gICAgdGhpcy4kcmVzdWx0cy5wcmVwZW5kKCRsb2FkaW5nKTtcbiAgfTtcblxuICBSZXN1bHRzLnByb3RvdHlwZS5oaWRlTG9hZGluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLiRyZXN1bHRzLmZpbmQoJy5sb2FkaW5nLXJlc3VsdHMnKS5yZW1vdmUoKTtcbiAgfTtcblxuICBSZXN1bHRzLnByb3RvdHlwZS5vcHRpb24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIG9wdGlvbi5jbGFzc05hbWUgPSAnc2VsZWN0Mi1yZXN1bHRzX19vcHRpb24nO1xuXG4gICAgdmFyIGF0dHJzID0ge1xuICAgICAgJ3JvbGUnOiAndHJlZWl0ZW0nLFxuICAgICAgJ2FyaWEtc2VsZWN0ZWQnOiAnZmFsc2UnXG4gICAgfTtcblxuICAgIGlmIChkYXRhLmRpc2FibGVkKSB7XG4gICAgICBkZWxldGUgYXR0cnNbJ2FyaWEtc2VsZWN0ZWQnXTtcbiAgICAgIGF0dHJzWydhcmlhLWRpc2FibGVkJ10gPSAndHJ1ZSc7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEuaWQgPT0gbnVsbCkge1xuICAgICAgZGVsZXRlIGF0dHJzWydhcmlhLXNlbGVjdGVkJ107XG4gICAgfVxuXG4gICAgaWYgKGRhdGEuX3Jlc3VsdElkICE9IG51bGwpIHtcbiAgICAgIG9wdGlvbi5pZCA9IGRhdGEuX3Jlc3VsdElkO1xuICAgIH1cblxuICAgIGlmIChkYXRhLnRpdGxlKSB7XG4gICAgICBvcHRpb24udGl0bGUgPSBkYXRhLnRpdGxlO1xuICAgIH1cblxuICAgIGlmIChkYXRhLmNoaWxkcmVuKSB7XG4gICAgICBhdHRycy5yb2xlID0gJ2dyb3VwJztcbiAgICAgIGF0dHJzWydhcmlhLWxhYmVsJ10gPSBkYXRhLnRleHQ7XG4gICAgICBkZWxldGUgYXR0cnNbJ2FyaWEtc2VsZWN0ZWQnXTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBhdHRyIGluIGF0dHJzKSB7XG4gICAgICB2YXIgdmFsID0gYXR0cnNbYXR0cl07XG5cbiAgICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoYXR0ciwgdmFsKTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YS5jaGlsZHJlbikge1xuICAgICAgdmFyICRvcHRpb24gPSAkKG9wdGlvbik7XG5cbiAgICAgIHZhciBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0cm9uZycpO1xuICAgICAgbGFiZWwuY2xhc3NOYW1lID0gJ3NlbGVjdDItcmVzdWx0c19fZ3JvdXAnO1xuXG4gICAgICB2YXIgJGxhYmVsID0gJChsYWJlbCk7XG4gICAgICB0aGlzLnRlbXBsYXRlKGRhdGEsIGxhYmVsKTtcblxuICAgICAgdmFyICRjaGlsZHJlbiA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBjID0gMDsgYyA8IGRhdGEuY2hpbGRyZW4ubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgdmFyIGNoaWxkID0gZGF0YS5jaGlsZHJlbltjXTtcblxuICAgICAgICB2YXIgJGNoaWxkID0gdGhpcy5vcHRpb24oY2hpbGQpO1xuXG4gICAgICAgICRjaGlsZHJlbi5wdXNoKCRjaGlsZCk7XG4gICAgICB9XG5cbiAgICAgIHZhciAkY2hpbGRyZW5Db250YWluZXIgPSAkKCc8dWw+PC91bD4nLCB7XG4gICAgICAgICdjbGFzcyc6ICdzZWxlY3QyLXJlc3VsdHNfX29wdGlvbnMgc2VsZWN0Mi1yZXN1bHRzX19vcHRpb25zLS1uZXN0ZWQnXG4gICAgICB9KTtcblxuICAgICAgJGNoaWxkcmVuQ29udGFpbmVyLmFwcGVuZCgkY2hpbGRyZW4pO1xuXG4gICAgICAkb3B0aW9uLmFwcGVuZChsYWJlbCk7XG4gICAgICAkb3B0aW9uLmFwcGVuZCgkY2hpbGRyZW5Db250YWluZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRlbXBsYXRlKGRhdGEsIG9wdGlvbik7XG4gICAgfVxuXG4gICAgJC5kYXRhKG9wdGlvbiwgJ2RhdGEnLCBkYXRhKTtcblxuICAgIHJldHVybiBvcHRpb247XG4gIH07XG5cbiAgUmVzdWx0cy5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChjb250YWluZXIsICRjb250YWluZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgaWQgPSBjb250YWluZXIuaWQgKyAnLXJlc3VsdHMnO1xuXG4gICAgdGhpcy4kcmVzdWx0cy5hdHRyKCdpZCcsIGlkKTtcblxuICAgIGNvbnRhaW5lci5vbigncmVzdWx0czphbGwnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICBzZWxmLmNsZWFyKCk7XG4gICAgICBzZWxmLmFwcGVuZChwYXJhbXMuZGF0YSk7XG5cbiAgICAgIGlmIChjb250YWluZXIuaXNPcGVuKCkpIHtcbiAgICAgICAgc2VsZi5zZXRDbGFzc2VzKCk7XG4gICAgICAgIHNlbGYuaGlnaGxpZ2h0Rmlyc3RJdGVtKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ3Jlc3VsdHM6YXBwZW5kJywgZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgc2VsZi5hcHBlbmQocGFyYW1zLmRhdGEpO1xuXG4gICAgICBpZiAoY29udGFpbmVyLmlzT3BlbigpKSB7XG4gICAgICAgIHNlbGYuc2V0Q2xhc3NlcygpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdxdWVyeScsIGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgIHNlbGYuaGlkZU1lc3NhZ2VzKCk7XG4gICAgICBzZWxmLnNob3dMb2FkaW5nKHBhcmFtcyk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ3NlbGVjdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghY29udGFpbmVyLmlzT3BlbigpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2VsZi5zZXRDbGFzc2VzKCk7XG4gICAgICBzZWxmLmhpZ2hsaWdodEZpcnN0SXRlbSgpO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCd1bnNlbGVjdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghY29udGFpbmVyLmlzT3BlbigpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2VsZi5zZXRDbGFzc2VzKCk7XG4gICAgICBzZWxmLmhpZ2hsaWdodEZpcnN0SXRlbSgpO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdvcGVuJywgZnVuY3Rpb24gKCkge1xuICAgICAgLy8gV2hlbiB0aGUgZHJvcGRvd24gaXMgb3BlbiwgYXJpYS1leHBlbmRlZD1cInRydWVcIlxuICAgICAgc2VsZi4kcmVzdWx0cy5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgIHNlbGYuJHJlc3VsdHMuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcblxuICAgICAgc2VsZi5zZXRDbGFzc2VzKCk7XG4gICAgICBzZWxmLmVuc3VyZUhpZ2hsaWdodFZpc2libGUoKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbignY2xvc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBXaGVuIHRoZSBkcm9wZG93biBpcyBjbG9zZWQsIGFyaWEtZXhwZW5kZWQ9XCJmYWxzZVwiXG4gICAgICBzZWxmLiRyZXN1bHRzLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgIHNlbGYuJHJlc3VsdHMuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgICAgc2VsZi4kcmVzdWx0cy5yZW1vdmVBdHRyKCdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbigncmVzdWx0czp0b2dnbGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJGhpZ2hsaWdodGVkID0gc2VsZi5nZXRIaWdobGlnaHRlZFJlc3VsdHMoKTtcblxuICAgICAgaWYgKCRoaWdobGlnaHRlZC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAkaGlnaGxpZ2h0ZWQudHJpZ2dlcignbW91c2V1cCcpO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdyZXN1bHRzOnNlbGVjdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkaGlnaGxpZ2h0ZWQgPSBzZWxmLmdldEhpZ2hsaWdodGVkUmVzdWx0cygpO1xuXG4gICAgICBpZiAoJGhpZ2hsaWdodGVkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBkYXRhID0gJGhpZ2hsaWdodGVkLmRhdGEoJ2RhdGEnKTtcblxuICAgICAgaWYgKCRoaWdobGlnaHRlZC5hdHRyKCdhcmlhLXNlbGVjdGVkJykgPT0gJ3RydWUnKSB7XG4gICAgICAgIHNlbGYudHJpZ2dlcignY2xvc2UnLCB7fSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLnRyaWdnZXIoJ3NlbGVjdCcsIHtcbiAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdyZXN1bHRzOnByZXZpb3VzJywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICRoaWdobGlnaHRlZCA9IHNlbGYuZ2V0SGlnaGxpZ2h0ZWRSZXN1bHRzKCk7XG5cbiAgICAgIHZhciAkb3B0aW9ucyA9IHNlbGYuJHJlc3VsdHMuZmluZCgnW2FyaWEtc2VsZWN0ZWRdJyk7XG5cbiAgICAgIHZhciBjdXJyZW50SW5kZXggPSAkb3B0aW9ucy5pbmRleCgkaGlnaGxpZ2h0ZWQpO1xuXG4gICAgICAvLyBJZiB3ZSBhcmUgYWxyZWFkeSBhdCB0ZSB0b3AsIGRvbid0IG1vdmUgZnVydGhlclxuICAgICAgaWYgKGN1cnJlbnRJbmRleCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBuZXh0SW5kZXggPSBjdXJyZW50SW5kZXggLSAxO1xuXG4gICAgICAvLyBJZiBub25lIGFyZSBoaWdobGlnaHRlZCwgaGlnaGxpZ2h0IHRoZSBmaXJzdFxuICAgICAgaWYgKCRoaWdobGlnaHRlZC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgbmV4dEluZGV4ID0gMDtcbiAgICAgIH1cblxuICAgICAgdmFyICRuZXh0ID0gJG9wdGlvbnMuZXEobmV4dEluZGV4KTtcblxuICAgICAgJG5leHQudHJpZ2dlcignbW91c2VlbnRlcicpO1xuXG4gICAgICB2YXIgY3VycmVudE9mZnNldCA9IHNlbGYuJHJlc3VsdHMub2Zmc2V0KCkudG9wO1xuICAgICAgdmFyIG5leHRUb3AgPSAkbmV4dC5vZmZzZXQoKS50b3A7XG4gICAgICB2YXIgbmV4dE9mZnNldCA9IHNlbGYuJHJlc3VsdHMuc2Nyb2xsVG9wKCkgKyAobmV4dFRvcCAtIGN1cnJlbnRPZmZzZXQpO1xuXG4gICAgICBpZiAobmV4dEluZGV4ID09PSAwKSB7XG4gICAgICAgIHNlbGYuJHJlc3VsdHMuc2Nyb2xsVG9wKDApO1xuICAgICAgfSBlbHNlIGlmIChuZXh0VG9wIC0gY3VycmVudE9mZnNldCA8IDApIHtcbiAgICAgICAgc2VsZi4kcmVzdWx0cy5zY3JvbGxUb3AobmV4dE9mZnNldCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ3Jlc3VsdHM6bmV4dCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkaGlnaGxpZ2h0ZWQgPSBzZWxmLmdldEhpZ2hsaWdodGVkUmVzdWx0cygpO1xuXG4gICAgICB2YXIgJG9wdGlvbnMgPSBzZWxmLiRyZXN1bHRzLmZpbmQoJ1thcmlhLXNlbGVjdGVkXScpO1xuXG4gICAgICB2YXIgY3VycmVudEluZGV4ID0gJG9wdGlvbnMuaW5kZXgoJGhpZ2hsaWdodGVkKTtcblxuICAgICAgdmFyIG5leHRJbmRleCA9IGN1cnJlbnRJbmRleCArIDE7XG5cbiAgICAgIC8vIElmIHdlIGFyZSBhdCB0aGUgbGFzdCBvcHRpb24sIHN0YXkgdGhlcmVcbiAgICAgIGlmIChuZXh0SW5kZXggPj0gJG9wdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyICRuZXh0ID0gJG9wdGlvbnMuZXEobmV4dEluZGV4KTtcblxuICAgICAgJG5leHQudHJpZ2dlcignbW91c2VlbnRlcicpO1xuXG4gICAgICB2YXIgY3VycmVudE9mZnNldCA9IHNlbGYuJHJlc3VsdHMub2Zmc2V0KCkudG9wICtcbiAgICAgICAgc2VsZi4kcmVzdWx0cy5vdXRlckhlaWdodChmYWxzZSk7XG4gICAgICB2YXIgbmV4dEJvdHRvbSA9ICRuZXh0Lm9mZnNldCgpLnRvcCArICRuZXh0Lm91dGVySGVpZ2h0KGZhbHNlKTtcbiAgICAgIHZhciBuZXh0T2Zmc2V0ID0gc2VsZi4kcmVzdWx0cy5zY3JvbGxUb3AoKSArIG5leHRCb3R0b20gLSBjdXJyZW50T2Zmc2V0O1xuXG4gICAgICBpZiAobmV4dEluZGV4ID09PSAwKSB7XG4gICAgICAgIHNlbGYuJHJlc3VsdHMuc2Nyb2xsVG9wKDApO1xuICAgICAgfSBlbHNlIGlmIChuZXh0Qm90dG9tID4gY3VycmVudE9mZnNldCkge1xuICAgICAgICBzZWxmLiRyZXN1bHRzLnNjcm9sbFRvcChuZXh0T2Zmc2V0KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbigncmVzdWx0czpmb2N1cycsIGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgIHBhcmFtcy5lbGVtZW50LmFkZENsYXNzKCdzZWxlY3QyLXJlc3VsdHNfX29wdGlvbi0taGlnaGxpZ2h0ZWQnKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbigncmVzdWx0czptZXNzYWdlJywgZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgc2VsZi5kaXNwbGF5TWVzc2FnZShwYXJhbXMpO1xuICAgIH0pO1xuXG4gICAgaWYgKCQuZm4ubW91c2V3aGVlbCkge1xuICAgICAgdGhpcy4kcmVzdWx0cy5vbignbW91c2V3aGVlbCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciB0b3AgPSBzZWxmLiRyZXN1bHRzLnNjcm9sbFRvcCgpO1xuXG4gICAgICAgIHZhciBib3R0b20gPSBzZWxmLiRyZXN1bHRzLmdldCgwKS5zY3JvbGxIZWlnaHQgLSB0b3AgKyBlLmRlbHRhWTtcblxuICAgICAgICB2YXIgaXNBdFRvcCA9IGUuZGVsdGFZID4gMCAmJiB0b3AgLSBlLmRlbHRhWSA8PSAwO1xuICAgICAgICB2YXIgaXNBdEJvdHRvbSA9IGUuZGVsdGFZIDwgMCAmJiBib3R0b20gPD0gc2VsZi4kcmVzdWx0cy5oZWlnaHQoKTtcblxuICAgICAgICBpZiAoaXNBdFRvcCkge1xuICAgICAgICAgIHNlbGYuJHJlc3VsdHMuc2Nyb2xsVG9wKDApO1xuXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNBdEJvdHRvbSkge1xuICAgICAgICAgIHNlbGYuJHJlc3VsdHMuc2Nyb2xsVG9wKFxuICAgICAgICAgICAgc2VsZi4kcmVzdWx0cy5nZXQoMCkuc2Nyb2xsSGVpZ2h0IC0gc2VsZi4kcmVzdWx0cy5oZWlnaHQoKVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy4kcmVzdWx0cy5vbignbW91c2V1cCcsICcuc2VsZWN0Mi1yZXN1bHRzX19vcHRpb25bYXJpYS1zZWxlY3RlZF0nLFxuICAgICAgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgdmFyIGRhdGEgPSAkdGhpcy5kYXRhKCdkYXRhJyk7XG5cbiAgICAgIGlmICgkdGhpcy5hdHRyKCdhcmlhLXNlbGVjdGVkJykgPT09ICd0cnVlJykge1xuICAgICAgICBpZiAoc2VsZi5vcHRpb25zLmdldCgnbXVsdGlwbGUnKSkge1xuICAgICAgICAgIHNlbGYudHJpZ2dlcigndW5zZWxlY3QnLCB7XG4gICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnQsXG4gICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi50cmlnZ2VyKCdjbG9zZScsIHt9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2VsZi50cmlnZ2VyKCdzZWxlY3QnLCB7XG4gICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dCxcbiAgICAgICAgZGF0YTogZGF0YVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLiRyZXN1bHRzLm9uKCdtb3VzZWVudGVyJywgJy5zZWxlY3QyLXJlc3VsdHNfX29wdGlvblthcmlhLXNlbGVjdGVkXScsXG4gICAgICBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICB2YXIgZGF0YSA9ICQodGhpcykuZGF0YSgnZGF0YScpO1xuXG4gICAgICBzZWxmLmdldEhpZ2hsaWdodGVkUmVzdWx0cygpXG4gICAgICAgICAgLnJlbW92ZUNsYXNzKCdzZWxlY3QyLXJlc3VsdHNfX29wdGlvbi0taGlnaGxpZ2h0ZWQnKTtcblxuICAgICAgc2VsZi50cmlnZ2VyKCdyZXN1bHRzOmZvY3VzJywge1xuICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICBlbGVtZW50OiAkKHRoaXMpXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICBSZXN1bHRzLnByb3RvdHlwZS5nZXRIaWdobGlnaHRlZFJlc3VsdHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRoaWdobGlnaHRlZCA9IHRoaXMuJHJlc3VsdHNcbiAgICAuZmluZCgnLnNlbGVjdDItcmVzdWx0c19fb3B0aW9uLS1oaWdobGlnaHRlZCcpO1xuXG4gICAgcmV0dXJuICRoaWdobGlnaHRlZDtcbiAgfTtcblxuICBSZXN1bHRzLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJHJlc3VsdHMucmVtb3ZlKCk7XG4gIH07XG5cbiAgUmVzdWx0cy5wcm90b3R5cGUuZW5zdXJlSGlnaGxpZ2h0VmlzaWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJGhpZ2hsaWdodGVkID0gdGhpcy5nZXRIaWdobGlnaHRlZFJlc3VsdHMoKTtcblxuICAgIGlmICgkaGlnaGxpZ2h0ZWQubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyICRvcHRpb25zID0gdGhpcy4kcmVzdWx0cy5maW5kKCdbYXJpYS1zZWxlY3RlZF0nKTtcblxuICAgIHZhciBjdXJyZW50SW5kZXggPSAkb3B0aW9ucy5pbmRleCgkaGlnaGxpZ2h0ZWQpO1xuXG4gICAgdmFyIGN1cnJlbnRPZmZzZXQgPSB0aGlzLiRyZXN1bHRzLm9mZnNldCgpLnRvcDtcbiAgICB2YXIgbmV4dFRvcCA9ICRoaWdobGlnaHRlZC5vZmZzZXQoKS50b3A7XG4gICAgdmFyIG5leHRPZmZzZXQgPSB0aGlzLiRyZXN1bHRzLnNjcm9sbFRvcCgpICsgKG5leHRUb3AgLSBjdXJyZW50T2Zmc2V0KTtcblxuICAgIHZhciBvZmZzZXREZWx0YSA9IG5leHRUb3AgLSBjdXJyZW50T2Zmc2V0O1xuICAgIG5leHRPZmZzZXQgLT0gJGhpZ2hsaWdodGVkLm91dGVySGVpZ2h0KGZhbHNlKSAqIDI7XG5cbiAgICBpZiAoY3VycmVudEluZGV4IDw9IDIpIHtcbiAgICAgIHRoaXMuJHJlc3VsdHMuc2Nyb2xsVG9wKDApO1xuICAgIH0gZWxzZSBpZiAob2Zmc2V0RGVsdGEgPiB0aGlzLiRyZXN1bHRzLm91dGVySGVpZ2h0KCkgfHwgb2Zmc2V0RGVsdGEgPCAwKSB7XG4gICAgICB0aGlzLiRyZXN1bHRzLnNjcm9sbFRvcChuZXh0T2Zmc2V0KTtcbiAgICB9XG4gIH07XG5cbiAgUmVzdWx0cy5wcm90b3R5cGUudGVtcGxhdGUgPSBmdW5jdGlvbiAocmVzdWx0LCBjb250YWluZXIpIHtcbiAgICB2YXIgdGVtcGxhdGUgPSB0aGlzLm9wdGlvbnMuZ2V0KCd0ZW1wbGF0ZVJlc3VsdCcpO1xuICAgIHZhciBlc2NhcGVNYXJrdXAgPSB0aGlzLm9wdGlvbnMuZ2V0KCdlc2NhcGVNYXJrdXAnKTtcblxuICAgIHZhciBjb250ZW50ID0gdGVtcGxhdGUocmVzdWx0LCBjb250YWluZXIpO1xuXG4gICAgaWYgKGNvbnRlbnQgPT0gbnVsbCkge1xuICAgICAgY29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBlc2NhcGVNYXJrdXAoY29udGVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoY29udGFpbmVyKS5hcHBlbmQoY29udGVudCk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBSZXN1bHRzO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9rZXlzJyxbXG5cbl0sIGZ1bmN0aW9uICgpIHtcbiAgdmFyIEtFWVMgPSB7XG4gICAgQkFDS1NQQUNFOiA4LFxuICAgIFRBQjogOSxcbiAgICBFTlRFUjogMTMsXG4gICAgU0hJRlQ6IDE2LFxuICAgIENUUkw6IDE3LFxuICAgIEFMVDogMTgsXG4gICAgRVNDOiAyNyxcbiAgICBTUEFDRTogMzIsXG4gICAgUEFHRV9VUDogMzMsXG4gICAgUEFHRV9ET1dOOiAzNCxcbiAgICBFTkQ6IDM1LFxuICAgIEhPTUU6IDM2LFxuICAgIExFRlQ6IDM3LFxuICAgIFVQOiAzOCxcbiAgICBSSUdIVDogMzksXG4gICAgRE9XTjogNDAsXG4gICAgREVMRVRFOiA0NlxuICB9O1xuXG4gIHJldHVybiBLRVlTO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9zZWxlY3Rpb24vYmFzZScsW1xuICAnanF1ZXJ5JyxcbiAgJy4uL3V0aWxzJyxcbiAgJy4uL2tleXMnXG5dLCBmdW5jdGlvbiAoJCwgVXRpbHMsIEtFWVMpIHtcbiAgZnVuY3Rpb24gQmFzZVNlbGVjdGlvbiAoJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ID0gJGVsZW1lbnQ7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgIEJhc2VTZWxlY3Rpb24uX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcyk7XG4gIH1cblxuICBVdGlscy5FeHRlbmQoQmFzZVNlbGVjdGlvbiwgVXRpbHMuT2JzZXJ2YWJsZSk7XG5cbiAgQmFzZVNlbGVjdGlvbi5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkc2VsZWN0aW9uID0gJChcbiAgICAgICc8c3BhbiBjbGFzcz1cInNlbGVjdDItc2VsZWN0aW9uXCIgcm9sZT1cImNvbWJvYm94XCIgJyArXG4gICAgICAnIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+JyArXG4gICAgICAnPC9zcGFuPidcbiAgICApO1xuXG4gICAgdGhpcy5fdGFiaW5kZXggPSAwO1xuXG4gICAgaWYgKHRoaXMuJGVsZW1lbnQuZGF0YSgnb2xkLXRhYmluZGV4JykgIT0gbnVsbCkge1xuICAgICAgdGhpcy5fdGFiaW5kZXggPSB0aGlzLiRlbGVtZW50LmRhdGEoJ29sZC10YWJpbmRleCcpO1xuICAgIH0gZWxzZSBpZiAodGhpcy4kZWxlbWVudC5hdHRyKCd0YWJpbmRleCcpICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX3RhYmluZGV4ID0gdGhpcy4kZWxlbWVudC5hdHRyKCd0YWJpbmRleCcpO1xuICAgIH1cblxuICAgICRzZWxlY3Rpb24uYXR0cigndGl0bGUnLCB0aGlzLiRlbGVtZW50LmF0dHIoJ3RpdGxlJykpO1xuICAgICRzZWxlY3Rpb24uYXR0cigndGFiaW5kZXgnLCB0aGlzLl90YWJpbmRleCk7XG5cbiAgICB0aGlzLiRzZWxlY3Rpb24gPSAkc2VsZWN0aW9uO1xuXG4gICAgcmV0dXJuICRzZWxlY3Rpb247XG4gIH07XG5cbiAgQmFzZVNlbGVjdGlvbi5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChjb250YWluZXIsICRjb250YWluZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgaWQgPSBjb250YWluZXIuaWQgKyAnLWNvbnRhaW5lcic7XG4gICAgdmFyIHJlc3VsdHNJZCA9IGNvbnRhaW5lci5pZCArICctcmVzdWx0cyc7XG5cbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcblxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbignZm9jdXMnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBzZWxmLnRyaWdnZXIoJ2ZvY3VzJywgZXZ0KTtcbiAgICB9KTtcblxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbignYmx1cicsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIHNlbGYuX2hhbmRsZUJsdXIoZXZ0KTtcbiAgICB9KTtcblxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbigna2V5ZG93bicsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIHNlbGYudHJpZ2dlcigna2V5cHJlc3MnLCBldnQpO1xuXG4gICAgICBpZiAoZXZ0LndoaWNoID09PSBLRVlTLlNQQUNFKSB7XG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdyZXN1bHRzOmZvY3VzJywgZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgc2VsZi4kc2VsZWN0aW9uLmF0dHIoJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCcsIHBhcmFtcy5kYXRhLl9yZXN1bHRJZCk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ3NlbGVjdGlvbjp1cGRhdGUnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICBzZWxmLnVwZGF0ZShwYXJhbXMuZGF0YSk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ29wZW4nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBXaGVuIHRoZSBkcm9wZG93biBpcyBvcGVuLCBhcmlhLWV4cGFuZGVkPVwidHJ1ZVwiXG4gICAgICBzZWxmLiRzZWxlY3Rpb24uYXR0cignYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XG4gICAgICBzZWxmLiRzZWxlY3Rpb24uYXR0cignYXJpYS1vd25zJywgcmVzdWx0c0lkKTtcblxuICAgICAgc2VsZi5fYXR0YWNoQ2xvc2VIYW5kbGVyKGNvbnRhaW5lcik7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ2Nsb3NlJywgZnVuY3Rpb24gKCkge1xuICAgICAgLy8gV2hlbiB0aGUgZHJvcGRvd24gaXMgY2xvc2VkLCBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIlxuICAgICAgc2VsZi4kc2VsZWN0aW9uLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgIHNlbGYuJHNlbGVjdGlvbi5yZW1vdmVBdHRyKCdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnKTtcbiAgICAgIHNlbGYuJHNlbGVjdGlvbi5yZW1vdmVBdHRyKCdhcmlhLW93bnMnKTtcblxuICAgICAgc2VsZi4kc2VsZWN0aW9uLmZvY3VzKCk7XG5cbiAgICAgIHNlbGYuX2RldGFjaENsb3NlSGFuZGxlcihjb250YWluZXIpO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdlbmFibGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLiRzZWxlY3Rpb24uYXR0cigndGFiaW5kZXgnLCBzZWxmLl90YWJpbmRleCk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ2Rpc2FibGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLiRzZWxlY3Rpb24uYXR0cigndGFiaW5kZXgnLCAnLTEnKTtcbiAgICB9KTtcbiAgfTtcblxuICBCYXNlU2VsZWN0aW9uLnByb3RvdHlwZS5faGFuZGxlQmx1ciA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAvLyBUaGlzIG5lZWRzIHRvIGJlIGRlbGF5ZWQgYXMgdGhlIGFjdGl2ZSBlbGVtZW50IGlzIHRoZSBib2R5IHdoZW4gdGhlIHRhYlxuICAgIC8vIGtleSBpcyBwcmVzc2VkLCBwb3NzaWJseSBhbG9uZyB3aXRoIG90aGVycy5cbiAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBEb24ndCB0cmlnZ2VyIGBibHVyYCBpZiB0aGUgZm9jdXMgaXMgc3RpbGwgaW4gdGhlIHNlbGVjdGlvblxuICAgICAgaWYgKFxuICAgICAgICAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PSBzZWxmLiRzZWxlY3Rpb25bMF0pIHx8XG4gICAgICAgICgkLmNvbnRhaW5zKHNlbGYuJHNlbGVjdGlvblswXSwgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkpXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzZWxmLnRyaWdnZXIoJ2JsdXInLCBldnQpO1xuICAgIH0sIDEpO1xuICB9O1xuXG4gIEJhc2VTZWxlY3Rpb24ucHJvdG90eXBlLl9hdHRhY2hDbG9zZUhhbmRsZXIgPSBmdW5jdGlvbiAoY29udGFpbmVyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgJChkb2N1bWVudC5ib2R5KS5vbignbW91c2Vkb3duLnNlbGVjdDIuJyArIGNvbnRhaW5lci5pZCwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIHZhciAkdGFyZ2V0ID0gJChlLnRhcmdldCk7XG5cbiAgICAgIHZhciAkc2VsZWN0ID0gJHRhcmdldC5jbG9zZXN0KCcuc2VsZWN0MicpO1xuXG4gICAgICB2YXIgJGFsbCA9ICQoJy5zZWxlY3QyLnNlbGVjdDItY29udGFpbmVyLS1vcGVuJyk7XG5cbiAgICAgICRhbGwuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgaWYgKHRoaXMgPT0gJHNlbGVjdFswXSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciAkZWxlbWVudCA9ICR0aGlzLmRhdGEoJ2VsZW1lbnQnKTtcblxuICAgICAgICAkZWxlbWVudC5zZWxlY3QyKCdjbG9zZScpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgQmFzZVNlbGVjdGlvbi5wcm90b3R5cGUuX2RldGFjaENsb3NlSGFuZGxlciA9IGZ1bmN0aW9uIChjb250YWluZXIpIHtcbiAgICAkKGRvY3VtZW50LmJvZHkpLm9mZignbW91c2Vkb3duLnNlbGVjdDIuJyArIGNvbnRhaW5lci5pZCk7XG4gIH07XG5cbiAgQmFzZVNlbGVjdGlvbi5wcm90b3R5cGUucG9zaXRpb24gPSBmdW5jdGlvbiAoJHNlbGVjdGlvbiwgJGNvbnRhaW5lcikge1xuICAgIHZhciAkc2VsZWN0aW9uQ29udGFpbmVyID0gJGNvbnRhaW5lci5maW5kKCcuc2VsZWN0aW9uJyk7XG4gICAgJHNlbGVjdGlvbkNvbnRhaW5lci5hcHBlbmQoJHNlbGVjdGlvbik7XG4gIH07XG5cbiAgQmFzZVNlbGVjdGlvbi5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9kZXRhY2hDbG9zZUhhbmRsZXIodGhpcy5jb250YWluZXIpO1xuICB9O1xuXG4gIEJhc2VTZWxlY3Rpb24ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgYHVwZGF0ZWAgbWV0aG9kIG11c3QgYmUgZGVmaW5lZCBpbiBjaGlsZCBjbGFzc2VzLicpO1xuICB9O1xuXG4gIHJldHVybiBCYXNlU2VsZWN0aW9uO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9zZWxlY3Rpb24vc2luZ2xlJyxbXG4gICdqcXVlcnknLFxuICAnLi9iYXNlJyxcbiAgJy4uL3V0aWxzJyxcbiAgJy4uL2tleXMnXG5dLCBmdW5jdGlvbiAoJCwgQmFzZVNlbGVjdGlvbiwgVXRpbHMsIEtFWVMpIHtcbiAgZnVuY3Rpb24gU2luZ2xlU2VsZWN0aW9uICgpIHtcbiAgICBTaW5nbGVTZWxlY3Rpb24uX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBVdGlscy5FeHRlbmQoU2luZ2xlU2VsZWN0aW9uLCBCYXNlU2VsZWN0aW9uKTtcblxuICBTaW5nbGVTZWxlY3Rpb24ucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJHNlbGVjdGlvbiA9IFNpbmdsZVNlbGVjdGlvbi5fX3N1cGVyX18ucmVuZGVyLmNhbGwodGhpcyk7XG5cbiAgICAkc2VsZWN0aW9uLmFkZENsYXNzKCdzZWxlY3QyLXNlbGVjdGlvbi0tc2luZ2xlJyk7XG5cbiAgICAkc2VsZWN0aW9uLmh0bWwoXG4gICAgICAnPHNwYW4gY2xhc3M9XCJzZWxlY3QyLXNlbGVjdGlvbl9fcmVuZGVyZWRcIj48L3NwYW4+JyArXG4gICAgICAnPHNwYW4gY2xhc3M9XCJzZWxlY3QyLXNlbGVjdGlvbl9fYXJyb3dcIiByb2xlPVwicHJlc2VudGF0aW9uXCI+JyArXG4gICAgICAgICc8YiByb2xlPVwicHJlc2VudGF0aW9uXCI+PC9iPicgK1xuICAgICAgJzwvc3Bhbj4nXG4gICAgKTtcblxuICAgIHJldHVybiAkc2VsZWN0aW9uO1xuICB9O1xuXG4gIFNpbmdsZVNlbGVjdGlvbi5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChjb250YWluZXIsICRjb250YWluZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBTaW5nbGVTZWxlY3Rpb24uX19zdXBlcl9fLmJpbmQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIHZhciBpZCA9IGNvbnRhaW5lci5pZCArICctY29udGFpbmVyJztcblxuICAgIHRoaXMuJHNlbGVjdGlvbi5maW5kKCcuc2VsZWN0Mi1zZWxlY3Rpb25fX3JlbmRlcmVkJykuYXR0cignaWQnLCBpZCk7XG4gICAgdGhpcy4kc2VsZWN0aW9uLmF0dHIoJ2FyaWEtbGFiZWxsZWRieScsIGlkKTtcblxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbignbW91c2Vkb3duJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgLy8gT25seSByZXNwb25kIHRvIGxlZnQgY2xpY2tzXG4gICAgICBpZiAoZXZ0LndoaWNoICE9PSAxKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2VsZi50cmlnZ2VyKCd0b2dnbGUnLCB7XG4gICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLiRzZWxlY3Rpb24ub24oJ2ZvY3VzJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgLy8gVXNlciBmb2N1c2VzIG9uIHRoZSBjb250YWluZXJcbiAgICB9KTtcblxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbignYmx1cicsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIC8vIFVzZXIgZXhpdHMgdGhlIGNvbnRhaW5lclxuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdmb2N1cycsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGlmICghY29udGFpbmVyLmlzT3BlbigpKSB7XG4gICAgICAgIHNlbGYuJHNlbGVjdGlvbi5mb2N1cygpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdzZWxlY3Rpb246dXBkYXRlJywgZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgc2VsZi51cGRhdGUocGFyYW1zLmRhdGEpO1xuICAgIH0pO1xuICB9O1xuXG4gIFNpbmdsZVNlbGVjdGlvbi5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fcmVuZGVyZWQnKS5lbXB0eSgpO1xuICB9O1xuXG4gIFNpbmdsZVNlbGVjdGlvbi5wcm90b3R5cGUuZGlzcGxheSA9IGZ1bmN0aW9uIChkYXRhLCBjb250YWluZXIpIHtcbiAgICB2YXIgdGVtcGxhdGUgPSB0aGlzLm9wdGlvbnMuZ2V0KCd0ZW1wbGF0ZVNlbGVjdGlvbicpO1xuICAgIHZhciBlc2NhcGVNYXJrdXAgPSB0aGlzLm9wdGlvbnMuZ2V0KCdlc2NhcGVNYXJrdXAnKTtcblxuICAgIHJldHVybiBlc2NhcGVNYXJrdXAodGVtcGxhdGUoZGF0YSwgY29udGFpbmVyKSk7XG4gIH07XG5cbiAgU2luZ2xlU2VsZWN0aW9uLnByb3RvdHlwZS5zZWxlY3Rpb25Db250YWluZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICQoJzxzcGFuPjwvc3Bhbj4nKTtcbiAgfTtcblxuICBTaW5nbGVTZWxlY3Rpb24ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHNlbGVjdGlvbiA9IGRhdGFbMF07XG5cbiAgICB2YXIgJHJlbmRlcmVkID0gdGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fcmVuZGVyZWQnKTtcbiAgICB2YXIgZm9ybWF0dGVkID0gdGhpcy5kaXNwbGF5KHNlbGVjdGlvbiwgJHJlbmRlcmVkKTtcblxuICAgICRyZW5kZXJlZC5lbXB0eSgpLmFwcGVuZChmb3JtYXR0ZWQpO1xuICAgICRyZW5kZXJlZC5wcm9wKCd0aXRsZScsIHNlbGVjdGlvbi50aXRsZSB8fCBzZWxlY3Rpb24udGV4dCk7XG4gIH07XG5cbiAgcmV0dXJuIFNpbmdsZVNlbGVjdGlvbjtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvc2VsZWN0aW9uL211bHRpcGxlJyxbXG4gICdqcXVlcnknLFxuICAnLi9iYXNlJyxcbiAgJy4uL3V0aWxzJ1xuXSwgZnVuY3Rpb24gKCQsIEJhc2VTZWxlY3Rpb24sIFV0aWxzKSB7XG4gIGZ1bmN0aW9uIE11bHRpcGxlU2VsZWN0aW9uICgkZWxlbWVudCwgb3B0aW9ucykge1xuICAgIE11bHRpcGxlU2VsZWN0aW9uLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgVXRpbHMuRXh0ZW5kKE11bHRpcGxlU2VsZWN0aW9uLCBCYXNlU2VsZWN0aW9uKTtcblxuICBNdWx0aXBsZVNlbGVjdGlvbi5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkc2VsZWN0aW9uID0gTXVsdGlwbGVTZWxlY3Rpb24uX19zdXBlcl9fLnJlbmRlci5jYWxsKHRoaXMpO1xuXG4gICAgJHNlbGVjdGlvbi5hZGRDbGFzcygnc2VsZWN0Mi1zZWxlY3Rpb24tLW11bHRpcGxlJyk7XG5cbiAgICAkc2VsZWN0aW9uLmh0bWwoXG4gICAgICAnPHVsIGNsYXNzPVwic2VsZWN0Mi1zZWxlY3Rpb25fX3JlbmRlcmVkXCI+PC91bD4nXG4gICAgKTtcblxuICAgIHJldHVybiAkc2VsZWN0aW9uO1xuICB9O1xuXG4gIE11bHRpcGxlU2VsZWN0aW9uLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIE11bHRpcGxlU2VsZWN0aW9uLl9fc3VwZXJfXy5iaW5kLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICB0aGlzLiRzZWxlY3Rpb24ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgc2VsZi50cmlnZ2VyKCd0b2dnbGUnLCB7XG4gICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLiRzZWxlY3Rpb24ub24oXG4gICAgICAnY2xpY2snLFxuICAgICAgJy5zZWxlY3QyLXNlbGVjdGlvbl9fY2hvaWNlX19yZW1vdmUnLFxuICAgICAgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGV2ZW50IGlmIGl0IGlzIGRpc2FibGVkXG4gICAgICAgIGlmIChzZWxmLm9wdGlvbnMuZ2V0KCdkaXNhYmxlZCcpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyICRyZW1vdmUgPSAkKHRoaXMpO1xuICAgICAgICB2YXIgJHNlbGVjdGlvbiA9ICRyZW1vdmUucGFyZW50KCk7XG5cbiAgICAgICAgdmFyIGRhdGEgPSAkc2VsZWN0aW9uLmRhdGEoJ2RhdGEnKTtcblxuICAgICAgICBzZWxmLnRyaWdnZXIoJ3Vuc2VsZWN0Jywge1xuICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dCxcbiAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICk7XG4gIH07XG5cbiAgTXVsdGlwbGVTZWxlY3Rpb24ucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJHNlbGVjdGlvbi5maW5kKCcuc2VsZWN0Mi1zZWxlY3Rpb25fX3JlbmRlcmVkJykuZW1wdHkoKTtcbiAgfTtcblxuICBNdWx0aXBsZVNlbGVjdGlvbi5wcm90b3R5cGUuZGlzcGxheSA9IGZ1bmN0aW9uIChkYXRhLCBjb250YWluZXIpIHtcbiAgICB2YXIgdGVtcGxhdGUgPSB0aGlzLm9wdGlvbnMuZ2V0KCd0ZW1wbGF0ZVNlbGVjdGlvbicpO1xuICAgIHZhciBlc2NhcGVNYXJrdXAgPSB0aGlzLm9wdGlvbnMuZ2V0KCdlc2NhcGVNYXJrdXAnKTtcblxuICAgIHJldHVybiBlc2NhcGVNYXJrdXAodGVtcGxhdGUoZGF0YSwgY29udGFpbmVyKSk7XG4gIH07XG5cbiAgTXVsdGlwbGVTZWxlY3Rpb24ucHJvdG90eXBlLnNlbGVjdGlvbkNvbnRhaW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJGNvbnRhaW5lciA9ICQoXG4gICAgICAnPGxpIGNsYXNzPVwic2VsZWN0Mi1zZWxlY3Rpb25fX2Nob2ljZVwiPicgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJzZWxlY3QyLXNlbGVjdGlvbl9fY2hvaWNlX19yZW1vdmVcIiByb2xlPVwicHJlc2VudGF0aW9uXCI+JyArXG4gICAgICAgICAgJyZ0aW1lczsnICtcbiAgICAgICAgJzwvc3Bhbj4nICtcbiAgICAgICc8L2xpPidcbiAgICApO1xuXG4gICAgcmV0dXJuICRjb250YWluZXI7XG4gIH07XG5cbiAgTXVsdGlwbGVTZWxlY3Rpb24ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5jbGVhcigpO1xuXG4gICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyICRzZWxlY3Rpb25zID0gW107XG5cbiAgICBmb3IgKHZhciBkID0gMDsgZCA8IGRhdGEubGVuZ3RoOyBkKyspIHtcbiAgICAgIHZhciBzZWxlY3Rpb24gPSBkYXRhW2RdO1xuXG4gICAgICB2YXIgJHNlbGVjdGlvbiA9IHRoaXMuc2VsZWN0aW9uQ29udGFpbmVyKCk7XG4gICAgICB2YXIgZm9ybWF0dGVkID0gdGhpcy5kaXNwbGF5KHNlbGVjdGlvbiwgJHNlbGVjdGlvbik7XG5cbiAgICAgICRzZWxlY3Rpb24uYXBwZW5kKGZvcm1hdHRlZCk7XG4gICAgICAkc2VsZWN0aW9uLnByb3AoJ3RpdGxlJywgc2VsZWN0aW9uLnRpdGxlIHx8IHNlbGVjdGlvbi50ZXh0KTtcblxuICAgICAgJHNlbGVjdGlvbi5kYXRhKCdkYXRhJywgc2VsZWN0aW9uKTtcblxuICAgICAgJHNlbGVjdGlvbnMucHVzaCgkc2VsZWN0aW9uKTtcbiAgICB9XG5cbiAgICB2YXIgJHJlbmRlcmVkID0gdGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fcmVuZGVyZWQnKTtcblxuICAgIFV0aWxzLmFwcGVuZE1hbnkoJHJlbmRlcmVkLCAkc2VsZWN0aW9ucyk7XG4gIH07XG5cbiAgcmV0dXJuIE11bHRpcGxlU2VsZWN0aW9uO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9zZWxlY3Rpb24vcGxhY2Vob2xkZXInLFtcbiAgJy4uL3V0aWxzJ1xuXSwgZnVuY3Rpb24gKFV0aWxzKSB7XG4gIGZ1bmN0aW9uIFBsYWNlaG9sZGVyIChkZWNvcmF0ZWQsICRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5wbGFjZWhvbGRlciA9IHRoaXMubm9ybWFsaXplUGxhY2Vob2xkZXIob3B0aW9ucy5nZXQoJ3BsYWNlaG9sZGVyJykpO1xuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgJGVsZW1lbnQsIG9wdGlvbnMpO1xuICB9XG5cbiAgUGxhY2Vob2xkZXIucHJvdG90eXBlLm5vcm1hbGl6ZVBsYWNlaG9sZGVyID0gZnVuY3Rpb24gKF8sIHBsYWNlaG9sZGVyKSB7XG4gICAgaWYgKHR5cGVvZiBwbGFjZWhvbGRlciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHBsYWNlaG9sZGVyID0ge1xuICAgICAgICBpZDogJycsXG4gICAgICAgIHRleHQ6IHBsYWNlaG9sZGVyXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBwbGFjZWhvbGRlcjtcbiAgfTtcblxuICBQbGFjZWhvbGRlci5wcm90b3R5cGUuY3JlYXRlUGxhY2Vob2xkZXIgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBwbGFjZWhvbGRlcikge1xuICAgIHZhciAkcGxhY2Vob2xkZXIgPSB0aGlzLnNlbGVjdGlvbkNvbnRhaW5lcigpO1xuXG4gICAgJHBsYWNlaG9sZGVyLmh0bWwodGhpcy5kaXNwbGF5KHBsYWNlaG9sZGVyKSk7XG4gICAgJHBsYWNlaG9sZGVyLmFkZENsYXNzKCdzZWxlY3QyLXNlbGVjdGlvbl9fcGxhY2Vob2xkZXInKVxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnc2VsZWN0Mi1zZWxlY3Rpb25fX2Nob2ljZScpO1xuXG4gICAgcmV0dXJuICRwbGFjZWhvbGRlcjtcbiAgfTtcblxuICBQbGFjZWhvbGRlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgZGF0YSkge1xuICAgIHZhciBzaW5nbGVQbGFjZWhvbGRlciA9IChcbiAgICAgIGRhdGEubGVuZ3RoID09IDEgJiYgZGF0YVswXS5pZCAhPSB0aGlzLnBsYWNlaG9sZGVyLmlkXG4gICAgKTtcbiAgICB2YXIgbXVsdGlwbGVTZWxlY3Rpb25zID0gZGF0YS5sZW5ndGggPiAxO1xuXG4gICAgaWYgKG11bHRpcGxlU2VsZWN0aW9ucyB8fCBzaW5nbGVQbGFjZWhvbGRlcikge1xuICAgICAgcmV0dXJuIGRlY29yYXRlZC5jYWxsKHRoaXMsIGRhdGEpO1xuICAgIH1cblxuICAgIHRoaXMuY2xlYXIoKTtcblxuICAgIHZhciAkcGxhY2Vob2xkZXIgPSB0aGlzLmNyZWF0ZVBsYWNlaG9sZGVyKHRoaXMucGxhY2Vob2xkZXIpO1xuXG4gICAgdGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fcmVuZGVyZWQnKS5hcHBlbmQoJHBsYWNlaG9sZGVyKTtcbiAgfTtcblxuICByZXR1cm4gUGxhY2Vob2xkZXI7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL3NlbGVjdGlvbi9hbGxvd0NsZWFyJyxbXG4gICdqcXVlcnknLFxuICAnLi4va2V5cydcbl0sIGZ1bmN0aW9uICgkLCBLRVlTKSB7XG4gIGZ1bmN0aW9uIEFsbG93Q2xlYXIgKCkgeyB9XG5cbiAgQWxsb3dDbGVhci5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGNvbnRhaW5lciwgJGNvbnRhaW5lcik7XG5cbiAgICBpZiAodGhpcy5wbGFjZWhvbGRlciA9PSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmdldCgnZGVidWcnKSAmJiB3aW5kb3cuY29uc29sZSAmJiBjb25zb2xlLmVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgJ1NlbGVjdDI6IFRoZSBgYWxsb3dDbGVhcmAgb3B0aW9uIHNob3VsZCBiZSB1c2VkIGluIGNvbWJpbmF0aW9uICcgK1xuICAgICAgICAgICd3aXRoIHRoZSBgcGxhY2Vob2xkZXJgIG9wdGlvbi4nXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy4kc2VsZWN0aW9uLm9uKCdtb3VzZWRvd24nLCAnLnNlbGVjdDItc2VsZWN0aW9uX19jbGVhcicsXG4gICAgICBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgIHNlbGYuX2hhbmRsZUNsZWFyKGV2dCk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ2tleXByZXNzJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgc2VsZi5faGFuZGxlS2V5Ym9hcmRDbGVhcihldnQsIGNvbnRhaW5lcik7XG4gICAgfSk7XG4gIH07XG5cbiAgQWxsb3dDbGVhci5wcm90b3R5cGUuX2hhbmRsZUNsZWFyID0gZnVuY3Rpb24gKF8sIGV2dCkge1xuICAgIC8vIElnbm9yZSB0aGUgZXZlbnQgaWYgaXQgaXMgZGlzYWJsZWRcbiAgICBpZiAodGhpcy5vcHRpb25zLmdldCgnZGlzYWJsZWQnKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciAkY2xlYXIgPSB0aGlzLiRzZWxlY3Rpb24uZmluZCgnLnNlbGVjdDItc2VsZWN0aW9uX19jbGVhcicpO1xuXG4gICAgLy8gSWdub3JlIHRoZSBldmVudCBpZiBub3RoaW5nIGhhcyBiZWVuIHNlbGVjdGVkXG4gICAgaWYgKCRjbGVhci5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICB2YXIgZGF0YSA9ICRjbGVhci5kYXRhKCdkYXRhJyk7XG5cbiAgICBmb3IgKHZhciBkID0gMDsgZCA8IGRhdGEubGVuZ3RoOyBkKyspIHtcbiAgICAgIHZhciB1bnNlbGVjdERhdGEgPSB7XG4gICAgICAgIGRhdGE6IGRhdGFbZF1cbiAgICAgIH07XG5cbiAgICAgIC8vIFRyaWdnZXIgdGhlIGB1bnNlbGVjdGAgZXZlbnQsIHNvIHBlb3BsZSBjYW4gcHJldmVudCBpdCBmcm9tIGJlaW5nXG4gICAgICAvLyBjbGVhcmVkLlxuICAgICAgdGhpcy50cmlnZ2VyKCd1bnNlbGVjdCcsIHVuc2VsZWN0RGF0YSk7XG5cbiAgICAgIC8vIElmIHRoZSBldmVudCB3YXMgcHJldmVudGVkLCBkb24ndCBjbGVhciBpdCBvdXQuXG4gICAgICBpZiAodW5zZWxlY3REYXRhLnByZXZlbnRlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy4kZWxlbWVudC52YWwodGhpcy5wbGFjZWhvbGRlci5pZCkudHJpZ2dlcignY2hhbmdlJyk7XG5cbiAgICB0aGlzLnRyaWdnZXIoJ3RvZ2dsZScsIHt9KTtcbiAgfTtcblxuICBBbGxvd0NsZWFyLnByb3RvdHlwZS5faGFuZGxlS2V5Ym9hcmRDbGVhciA9IGZ1bmN0aW9uIChfLCBldnQsIGNvbnRhaW5lcikge1xuICAgIGlmIChjb250YWluZXIuaXNPcGVuKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZXZ0LndoaWNoID09IEtFWVMuREVMRVRFIHx8IGV2dC53aGljaCA9PSBLRVlTLkJBQ0tTUEFDRSkge1xuICAgICAgdGhpcy5faGFuZGxlQ2xlYXIoZXZ0KTtcbiAgICB9XG4gIH07XG5cbiAgQWxsb3dDbGVhci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgZGF0YSkge1xuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGRhdGEpO1xuXG4gICAgaWYgKHRoaXMuJHNlbGVjdGlvbi5maW5kKCcuc2VsZWN0Mi1zZWxlY3Rpb25fX3BsYWNlaG9sZGVyJykubGVuZ3RoID4gMCB8fFxuICAgICAgICBkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciAkcmVtb3ZlID0gJChcbiAgICAgICc8c3BhbiBjbGFzcz1cInNlbGVjdDItc2VsZWN0aW9uX19jbGVhclwiPicgK1xuICAgICAgICAnJnRpbWVzOycgK1xuICAgICAgJzwvc3Bhbj4nXG4gICAgKTtcbiAgICAkcmVtb3ZlLmRhdGEoJ2RhdGEnLCBkYXRhKTtcblxuICAgIHRoaXMuJHNlbGVjdGlvbi5maW5kKCcuc2VsZWN0Mi1zZWxlY3Rpb25fX3JlbmRlcmVkJykucHJlcGVuZCgkcmVtb3ZlKTtcbiAgfTtcblxuICByZXR1cm4gQWxsb3dDbGVhcjtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvc2VsZWN0aW9uL3NlYXJjaCcsW1xuICAnanF1ZXJ5JyxcbiAgJy4uL3V0aWxzJyxcbiAgJy4uL2tleXMnXG5dLCBmdW5jdGlvbiAoJCwgVXRpbHMsIEtFWVMpIHtcbiAgZnVuY3Rpb24gU2VhcmNoIChkZWNvcmF0ZWQsICRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgJGVsZW1lbnQsIG9wdGlvbnMpO1xuICB9XG5cbiAgU2VhcmNoLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoZGVjb3JhdGVkKSB7XG4gICAgdmFyICRzZWFyY2ggPSAkKFxuICAgICAgJzxsaSBjbGFzcz1cInNlbGVjdDItc2VhcmNoIHNlbGVjdDItc2VhcmNoLS1pbmxpbmVcIj4nICtcbiAgICAgICAgJzxpbnB1dCBjbGFzcz1cInNlbGVjdDItc2VhcmNoX19maWVsZFwiIHR5cGU9XCJzZWFyY2hcIiB0YWJpbmRleD1cIi0xXCInICtcbiAgICAgICAgJyBhdXRvY29tcGxldGU9XCJvZmZcIiBhdXRvY29ycmVjdD1cIm9mZlwiIGF1dG9jYXBpdGFsaXplPVwib2ZmXCInICtcbiAgICAgICAgJyBzcGVsbGNoZWNrPVwiZmFsc2VcIiByb2xlPVwidGV4dGJveFwiIGFyaWEtYXV0b2NvbXBsZXRlPVwibGlzdFwiIC8+JyArXG4gICAgICAnPC9saT4nXG4gICAgKTtcblxuICAgIHRoaXMuJHNlYXJjaENvbnRhaW5lciA9ICRzZWFyY2g7XG4gICAgdGhpcy4kc2VhcmNoID0gJHNlYXJjaC5maW5kKCdpbnB1dCcpO1xuXG4gICAgdmFyICRyZW5kZXJlZCA9IGRlY29yYXRlZC5jYWxsKHRoaXMpO1xuXG4gICAgdGhpcy5fdHJhbnNmZXJUYWJJbmRleCgpO1xuXG4gICAgcmV0dXJuICRyZW5kZXJlZDtcbiAgfTtcblxuICBTZWFyY2gucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBjb250YWluZXIsICRjb250YWluZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBjb250YWluZXIsICRjb250YWluZXIpO1xuXG4gICAgY29udGFpbmVyLm9uKCdvcGVuJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi4kc2VhcmNoLnRyaWdnZXIoJ2ZvY3VzJyk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ2Nsb3NlJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi4kc2VhcmNoLnZhbCgnJyk7XG4gICAgICBzZWxmLiRzZWFyY2gucmVtb3ZlQXR0cignYXJpYS1hY3RpdmVkZXNjZW5kYW50Jyk7XG4gICAgICBzZWxmLiRzZWFyY2gudHJpZ2dlcignZm9jdXMnKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbignZW5hYmxlJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi4kc2VhcmNoLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXG4gICAgICBzZWxmLl90cmFuc2ZlclRhYkluZGV4KCk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ2Rpc2FibGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLiRzZWFyY2gucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbignZm9jdXMnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBzZWxmLiRzZWFyY2gudHJpZ2dlcignZm9jdXMnKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbigncmVzdWx0czpmb2N1cycsIGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgIHNlbGYuJHNlYXJjaC5hdHRyKCdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnLCBwYXJhbXMuaWQpO1xuICAgIH0pO1xuXG4gICAgdGhpcy4kc2VsZWN0aW9uLm9uKCdmb2N1c2luJywgJy5zZWxlY3QyLXNlYXJjaC0taW5saW5lJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgc2VsZi50cmlnZ2VyKCdmb2N1cycsIGV2dCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLiRzZWxlY3Rpb24ub24oJ2ZvY3Vzb3V0JywgJy5zZWxlY3QyLXNlYXJjaC0taW5saW5lJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgc2VsZi5faGFuZGxlQmx1cihldnQpO1xuICAgIH0pO1xuXG4gICAgdGhpcy4kc2VsZWN0aW9uLm9uKCdrZXlkb3duJywgJy5zZWxlY3QyLXNlYXJjaC0taW5saW5lJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICBzZWxmLnRyaWdnZXIoJ2tleXByZXNzJywgZXZ0KTtcblxuICAgICAgc2VsZi5fa2V5VXBQcmV2ZW50ZWQgPSBldnQuaXNEZWZhdWx0UHJldmVudGVkKCk7XG5cbiAgICAgIHZhciBrZXkgPSBldnQud2hpY2g7XG5cbiAgICAgIGlmIChrZXkgPT09IEtFWVMuQkFDS1NQQUNFICYmIHNlbGYuJHNlYXJjaC52YWwoKSA9PT0gJycpIHtcbiAgICAgICAgdmFyICRwcmV2aW91c0Nob2ljZSA9IHNlbGYuJHNlYXJjaENvbnRhaW5lclxuICAgICAgICAgIC5wcmV2KCcuc2VsZWN0Mi1zZWxlY3Rpb25fX2Nob2ljZScpO1xuXG4gICAgICAgIGlmICgkcHJldmlvdXNDaG9pY2UubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHZhciBpdGVtID0gJHByZXZpb3VzQ2hvaWNlLmRhdGEoJ2RhdGEnKTtcblxuICAgICAgICAgIHNlbGYuc2VhcmNoUmVtb3ZlQ2hvaWNlKGl0ZW0pO1xuXG4gICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFRyeSB0byBkZXRlY3QgdGhlIElFIHZlcnNpb24gc2hvdWxkIHRoZSBgZG9jdW1lbnRNb2RlYCBwcm9wZXJ0eSB0aGF0XG4gICAgLy8gaXMgc3RvcmVkIG9uIHRoZSBkb2N1bWVudC4gVGhpcyBpcyBvbmx5IGltcGxlbWVudGVkIGluIElFIGFuZCBpc1xuICAgIC8vIHNsaWdodGx5IGNsZWFuZXIgdGhhbiBkb2luZyBhIHVzZXIgYWdlbnQgY2hlY2suXG4gICAgLy8gVGhpcyBwcm9wZXJ0eSBpcyBub3QgYXZhaWxhYmxlIGluIEVkZ2UsIGJ1dCBFZGdlIGFsc28gZG9lc24ndCBoYXZlXG4gICAgLy8gdGhpcyBidWcuXG4gICAgdmFyIG1zaWUgPSBkb2N1bWVudC5kb2N1bWVudE1vZGU7XG4gICAgdmFyIGRpc2FibGVJbnB1dEV2ZW50cyA9IG1zaWUgJiYgbXNpZSA8PSAxMTtcblxuICAgIC8vIFdvcmthcm91bmQgZm9yIGJyb3dzZXJzIHdoaWNoIGRvIG5vdCBzdXBwb3J0IHRoZSBgaW5wdXRgIGV2ZW50XG4gICAgLy8gVGhpcyB3aWxsIHByZXZlbnQgZG91YmxlLXRyaWdnZXJpbmcgb2YgZXZlbnRzIGZvciBicm93c2VycyB3aGljaCBzdXBwb3J0XG4gICAgLy8gYm90aCB0aGUgYGtleXVwYCBhbmQgYGlucHV0YCBldmVudHMuXG4gICAgdGhpcy4kc2VsZWN0aW9uLm9uKFxuICAgICAgJ2lucHV0LnNlYXJjaGNoZWNrJyxcbiAgICAgICcuc2VsZWN0Mi1zZWFyY2gtLWlubGluZScsXG4gICAgICBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgIC8vIElFIHdpbGwgdHJpZ2dlciB0aGUgYGlucHV0YCBldmVudCB3aGVuIGEgcGxhY2Vob2xkZXIgaXMgdXNlZCBvbiBhXG4gICAgICAgIC8vIHNlYXJjaCBib3guIFRvIGdldCBhcm91bmQgdGhpcyBpc3N1ZSwgd2UgYXJlIGZvcmNlZCB0byBpZ25vcmUgYWxsXG4gICAgICAgIC8vIGBpbnB1dGAgZXZlbnRzIGluIElFIGFuZCBrZWVwIHVzaW5nIGBrZXl1cGAuXG4gICAgICAgIGlmIChkaXNhYmxlSW5wdXRFdmVudHMpIHtcbiAgICAgICAgICBzZWxmLiRzZWxlY3Rpb24ub2ZmKCdpbnB1dC5zZWFyY2ggaW5wdXQuc2VhcmNoY2hlY2snKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBVbmJpbmQgdGhlIGR1cGxpY2F0ZWQgYGtleXVwYCBldmVudFxuICAgICAgICBzZWxmLiRzZWxlY3Rpb24ub2ZmKCdrZXl1cC5zZWFyY2gnKTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgdGhpcy4kc2VsZWN0aW9uLm9uKFxuICAgICAgJ2tleXVwLnNlYXJjaCBpbnB1dC5zZWFyY2gnLFxuICAgICAgJy5zZWxlY3QyLXNlYXJjaC0taW5saW5lJyxcbiAgICAgIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgLy8gSUUgd2lsbCB0cmlnZ2VyIHRoZSBgaW5wdXRgIGV2ZW50IHdoZW4gYSBwbGFjZWhvbGRlciBpcyB1c2VkIG9uIGFcbiAgICAgICAgLy8gc2VhcmNoIGJveC4gVG8gZ2V0IGFyb3VuZCB0aGlzIGlzc3VlLCB3ZSBhcmUgZm9yY2VkIHRvIGlnbm9yZSBhbGxcbiAgICAgICAgLy8gYGlucHV0YCBldmVudHMgaW4gSUUgYW5kIGtlZXAgdXNpbmcgYGtleXVwYC5cbiAgICAgICAgaWYgKGRpc2FibGVJbnB1dEV2ZW50cyAmJiBldnQudHlwZSA9PT0gJ2lucHV0Jykge1xuICAgICAgICAgIHNlbGYuJHNlbGVjdGlvbi5vZmYoJ2lucHV0LnNlYXJjaCBpbnB1dC5zZWFyY2hjaGVjaycpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBrZXkgPSBldnQud2hpY2g7XG5cbiAgICAgICAgLy8gV2UgY2FuIGZyZWVseSBpZ25vcmUgZXZlbnRzIGZyb20gbW9kaWZpZXIga2V5c1xuICAgICAgICBpZiAoa2V5ID09IEtFWVMuU0hJRlQgfHwga2V5ID09IEtFWVMuQ1RSTCB8fCBrZXkgPT0gS0VZUy5BTFQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUYWJiaW5nIHdpbGwgYmUgaGFuZGxlZCBkdXJpbmcgdGhlIGBrZXlkb3duYCBwaGFzZVxuICAgICAgICBpZiAoa2V5ID09IEtFWVMuVEFCKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5oYW5kbGVTZWFyY2goZXZ0KTtcbiAgICAgIH1cbiAgICApO1xuICB9O1xuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCB3aWxsIHRyYW5zZmVyIHRoZSB0YWJpbmRleCBhdHRyaWJ1dGUgZnJvbSB0aGUgcmVuZGVyZWRcbiAgICogc2VsZWN0aW9uIHRvIHRoZSBzZWFyY2ggYm94LiBUaGlzIGFsbG93cyBmb3IgdGhlIHNlYXJjaCBib3ggdG8gYmUgdXNlZCBhc1xuICAgKiB0aGUgcHJpbWFyeSBmb2N1cyBpbnN0ZWFkIG9mIHRoZSBzZWxlY3Rpb24gY29udGFpbmVyLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgU2VhcmNoLnByb3RvdHlwZS5fdHJhbnNmZXJUYWJJbmRleCA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQpIHtcbiAgICB0aGlzLiRzZWFyY2guYXR0cigndGFiaW5kZXgnLCB0aGlzLiRzZWxlY3Rpb24uYXR0cigndGFiaW5kZXgnKSk7XG4gICAgdGhpcy4kc2VsZWN0aW9uLmF0dHIoJ3RhYmluZGV4JywgJy0xJyk7XG4gIH07XG5cbiAgU2VhcmNoLnByb3RvdHlwZS5jcmVhdGVQbGFjZWhvbGRlciA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIHBsYWNlaG9sZGVyKSB7XG4gICAgdGhpcy4kc2VhcmNoLmF0dHIoJ3BsYWNlaG9sZGVyJywgcGxhY2Vob2xkZXIudGV4dCk7XG4gIH07XG5cbiAgU2VhcmNoLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBkYXRhKSB7XG4gICAgdmFyIHNlYXJjaEhhZEZvY3VzID0gdGhpcy4kc2VhcmNoWzBdID09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG5cbiAgICB0aGlzLiRzZWFyY2guYXR0cigncGxhY2Vob2xkZXInLCAnJyk7XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBkYXRhKTtcblxuICAgIHRoaXMuJHNlbGVjdGlvbi5maW5kKCcuc2VsZWN0Mi1zZWxlY3Rpb25fX3JlbmRlcmVkJylcbiAgICAgICAgICAgICAgICAgICAuYXBwZW5kKHRoaXMuJHNlYXJjaENvbnRhaW5lcik7XG5cbiAgICB0aGlzLnJlc2l6ZVNlYXJjaCgpO1xuICAgIGlmIChzZWFyY2hIYWRGb2N1cykge1xuICAgICAgdGhpcy4kc2VhcmNoLmZvY3VzKCk7XG4gICAgfVxuICB9O1xuXG4gIFNlYXJjaC5wcm90b3R5cGUuaGFuZGxlU2VhcmNoID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVzaXplU2VhcmNoKCk7XG5cbiAgICBpZiAoIXRoaXMuX2tleVVwUHJldmVudGVkKSB7XG4gICAgICB2YXIgaW5wdXQgPSB0aGlzLiRzZWFyY2gudmFsKCk7XG5cbiAgICAgIHRoaXMudHJpZ2dlcigncXVlcnknLCB7XG4gICAgICAgIHRlcm06IGlucHV0XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLl9rZXlVcFByZXZlbnRlZCA9IGZhbHNlO1xuICB9O1xuXG4gIFNlYXJjaC5wcm90b3R5cGUuc2VhcmNoUmVtb3ZlQ2hvaWNlID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgaXRlbSkge1xuICAgIHRoaXMudHJpZ2dlcigndW5zZWxlY3QnLCB7XG4gICAgICBkYXRhOiBpdGVtXG4gICAgfSk7XG5cbiAgICB0aGlzLiRzZWFyY2gudmFsKGl0ZW0udGV4dCk7XG4gICAgdGhpcy5oYW5kbGVTZWFyY2goKTtcbiAgfTtcblxuICBTZWFyY2gucHJvdG90eXBlLnJlc2l6ZVNlYXJjaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLiRzZWFyY2guY3NzKCd3aWR0aCcsICcyNXB4Jyk7XG5cbiAgICB2YXIgd2lkdGggPSAnJztcblxuICAgIGlmICh0aGlzLiRzZWFyY2guYXR0cigncGxhY2Vob2xkZXInKSAhPT0gJycpIHtcbiAgICAgIHdpZHRoID0gdGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fcmVuZGVyZWQnKS5pbm5lcldpZHRoKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBtaW5pbXVtV2lkdGggPSB0aGlzLiRzZWFyY2gudmFsKCkubGVuZ3RoICsgMTtcblxuICAgICAgd2lkdGggPSAobWluaW11bVdpZHRoICogMC43NSkgKyAnZW0nO1xuICAgIH1cblxuICAgIHRoaXMuJHNlYXJjaC5jc3MoJ3dpZHRoJywgd2lkdGgpO1xuICB9O1xuXG4gIHJldHVybiBTZWFyY2g7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL3NlbGVjdGlvbi9ldmVudFJlbGF5JyxbXG4gICdqcXVlcnknXG5dLCBmdW5jdGlvbiAoJCkge1xuICBmdW5jdGlvbiBFdmVudFJlbGF5ICgpIHsgfVxuXG4gIEV2ZW50UmVsYXkucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBjb250YWluZXIsICRjb250YWluZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHJlbGF5RXZlbnRzID0gW1xuICAgICAgJ29wZW4nLCAnb3BlbmluZycsXG4gICAgICAnY2xvc2UnLCAnY2xvc2luZycsXG4gICAgICAnc2VsZWN0JywgJ3NlbGVjdGluZycsXG4gICAgICAndW5zZWxlY3QnLCAndW5zZWxlY3RpbmcnXG4gICAgXTtcblxuICAgIHZhciBwcmV2ZW50YWJsZUV2ZW50cyA9IFsnb3BlbmluZycsICdjbG9zaW5nJywgJ3NlbGVjdGluZycsICd1bnNlbGVjdGluZyddO1xuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgY29udGFpbmVyLCAkY29udGFpbmVyKTtcblxuICAgIGNvbnRhaW5lci5vbignKicsIGZ1bmN0aW9uIChuYW1lLCBwYXJhbXMpIHtcbiAgICAgIC8vIElnbm9yZSBldmVudHMgdGhhdCBzaG91bGQgbm90IGJlIHJlbGF5ZWRcbiAgICAgIGlmICgkLmluQXJyYXkobmFtZSwgcmVsYXlFdmVudHMpID09PSAtMSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBwYXJhbWV0ZXJzIHNob3VsZCBhbHdheXMgYmUgYW4gb2JqZWN0XG4gICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG5cbiAgICAgIC8vIEdlbmVyYXRlIHRoZSBqUXVlcnkgZXZlbnQgZm9yIHRoZSBTZWxlY3QyIGV2ZW50XG4gICAgICB2YXIgZXZ0ID0gJC5FdmVudCgnc2VsZWN0MjonICsgbmFtZSwge1xuICAgICAgICBwYXJhbXM6IHBhcmFtc1xuICAgICAgfSk7XG5cbiAgICAgIHNlbGYuJGVsZW1lbnQudHJpZ2dlcihldnQpO1xuXG4gICAgICAvLyBPbmx5IGhhbmRsZSBwcmV2ZW50YWJsZSBldmVudHMgaWYgaXQgd2FzIG9uZVxuICAgICAgaWYgKCQuaW5BcnJheShuYW1lLCBwcmV2ZW50YWJsZUV2ZW50cykgPT09IC0xKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcGFyYW1zLnByZXZlbnRlZCA9IGV2dC5pc0RlZmF1bHRQcmV2ZW50ZWQoKTtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gRXZlbnRSZWxheTtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvdHJhbnNsYXRpb24nLFtcbiAgJ2pxdWVyeScsXG4gICdyZXF1aXJlJ1xuXSwgZnVuY3Rpb24gKCQsIHJlcXVpcmUpIHtcbiAgZnVuY3Rpb24gVHJhbnNsYXRpb24gKGRpY3QpIHtcbiAgICB0aGlzLmRpY3QgPSBkaWN0IHx8IHt9O1xuICB9XG5cbiAgVHJhbnNsYXRpb24ucHJvdG90eXBlLmFsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5kaWN0O1xuICB9O1xuXG4gIFRyYW5zbGF0aW9uLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuZGljdFtrZXldO1xuICB9O1xuXG4gIFRyYW5zbGF0aW9uLnByb3RvdHlwZS5leHRlbmQgPSBmdW5jdGlvbiAodHJhbnNsYXRpb24pIHtcbiAgICB0aGlzLmRpY3QgPSAkLmV4dGVuZCh7fSwgdHJhbnNsYXRpb24uYWxsKCksIHRoaXMuZGljdCk7XG4gIH07XG5cbiAgLy8gU3RhdGljIGZ1bmN0aW9uc1xuXG4gIFRyYW5zbGF0aW9uLl9jYWNoZSA9IHt9O1xuXG4gIFRyYW5zbGF0aW9uLmxvYWRQYXRoID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgICBpZiAoIShwYXRoIGluIFRyYW5zbGF0aW9uLl9jYWNoZSkpIHtcbiAgICAgIHZhciB0cmFuc2xhdGlvbnMgPSByZXF1aXJlKHBhdGgpO1xuXG4gICAgICBUcmFuc2xhdGlvbi5fY2FjaGVbcGF0aF0gPSB0cmFuc2xhdGlvbnM7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBUcmFuc2xhdGlvbihUcmFuc2xhdGlvbi5fY2FjaGVbcGF0aF0pO1xuICB9O1xuXG4gIHJldHVybiBUcmFuc2xhdGlvbjtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZGlhY3JpdGljcycsW1xuXG5dLCBmdW5jdGlvbiAoKSB7XG4gIHZhciBkaWFjcml0aWNzID0ge1xuICAgICdcXHUyNEI2JzogJ0EnLFxuICAgICdcXHVGRjIxJzogJ0EnLFxuICAgICdcXHUwMEMwJzogJ0EnLFxuICAgICdcXHUwMEMxJzogJ0EnLFxuICAgICdcXHUwMEMyJzogJ0EnLFxuICAgICdcXHUxRUE2JzogJ0EnLFxuICAgICdcXHUxRUE0JzogJ0EnLFxuICAgICdcXHUxRUFBJzogJ0EnLFxuICAgICdcXHUxRUE4JzogJ0EnLFxuICAgICdcXHUwMEMzJzogJ0EnLFxuICAgICdcXHUwMTAwJzogJ0EnLFxuICAgICdcXHUwMTAyJzogJ0EnLFxuICAgICdcXHUxRUIwJzogJ0EnLFxuICAgICdcXHUxRUFFJzogJ0EnLFxuICAgICdcXHUxRUI0JzogJ0EnLFxuICAgICdcXHUxRUIyJzogJ0EnLFxuICAgICdcXHUwMjI2JzogJ0EnLFxuICAgICdcXHUwMUUwJzogJ0EnLFxuICAgICdcXHUwMEM0JzogJ0EnLFxuICAgICdcXHUwMURFJzogJ0EnLFxuICAgICdcXHUxRUEyJzogJ0EnLFxuICAgICdcXHUwMEM1JzogJ0EnLFxuICAgICdcXHUwMUZBJzogJ0EnLFxuICAgICdcXHUwMUNEJzogJ0EnLFxuICAgICdcXHUwMjAwJzogJ0EnLFxuICAgICdcXHUwMjAyJzogJ0EnLFxuICAgICdcXHUxRUEwJzogJ0EnLFxuICAgICdcXHUxRUFDJzogJ0EnLFxuICAgICdcXHUxRUI2JzogJ0EnLFxuICAgICdcXHUxRTAwJzogJ0EnLFxuICAgICdcXHUwMTA0JzogJ0EnLFxuICAgICdcXHUwMjNBJzogJ0EnLFxuICAgICdcXHUyQzZGJzogJ0EnLFxuICAgICdcXHVBNzMyJzogJ0FBJyxcbiAgICAnXFx1MDBDNic6ICdBRScsXG4gICAgJ1xcdTAxRkMnOiAnQUUnLFxuICAgICdcXHUwMUUyJzogJ0FFJyxcbiAgICAnXFx1QTczNCc6ICdBTycsXG4gICAgJ1xcdUE3MzYnOiAnQVUnLFxuICAgICdcXHVBNzM4JzogJ0FWJyxcbiAgICAnXFx1QTczQSc6ICdBVicsXG4gICAgJ1xcdUE3M0MnOiAnQVknLFxuICAgICdcXHUyNEI3JzogJ0InLFxuICAgICdcXHVGRjIyJzogJ0InLFxuICAgICdcXHUxRTAyJzogJ0InLFxuICAgICdcXHUxRTA0JzogJ0InLFxuICAgICdcXHUxRTA2JzogJ0InLFxuICAgICdcXHUwMjQzJzogJ0InLFxuICAgICdcXHUwMTgyJzogJ0InLFxuICAgICdcXHUwMTgxJzogJ0InLFxuICAgICdcXHUyNEI4JzogJ0MnLFxuICAgICdcXHVGRjIzJzogJ0MnLFxuICAgICdcXHUwMTA2JzogJ0MnLFxuICAgICdcXHUwMTA4JzogJ0MnLFxuICAgICdcXHUwMTBBJzogJ0MnLFxuICAgICdcXHUwMTBDJzogJ0MnLFxuICAgICdcXHUwMEM3JzogJ0MnLFxuICAgICdcXHUxRTA4JzogJ0MnLFxuICAgICdcXHUwMTg3JzogJ0MnLFxuICAgICdcXHUwMjNCJzogJ0MnLFxuICAgICdcXHVBNzNFJzogJ0MnLFxuICAgICdcXHUyNEI5JzogJ0QnLFxuICAgICdcXHVGRjI0JzogJ0QnLFxuICAgICdcXHUxRTBBJzogJ0QnLFxuICAgICdcXHUwMTBFJzogJ0QnLFxuICAgICdcXHUxRTBDJzogJ0QnLFxuICAgICdcXHUxRTEwJzogJ0QnLFxuICAgICdcXHUxRTEyJzogJ0QnLFxuICAgICdcXHUxRTBFJzogJ0QnLFxuICAgICdcXHUwMTEwJzogJ0QnLFxuICAgICdcXHUwMThCJzogJ0QnLFxuICAgICdcXHUwMThBJzogJ0QnLFxuICAgICdcXHUwMTg5JzogJ0QnLFxuICAgICdcXHVBNzc5JzogJ0QnLFxuICAgICdcXHUwMUYxJzogJ0RaJyxcbiAgICAnXFx1MDFDNCc6ICdEWicsXG4gICAgJ1xcdTAxRjInOiAnRHonLFxuICAgICdcXHUwMUM1JzogJ0R6JyxcbiAgICAnXFx1MjRCQSc6ICdFJyxcbiAgICAnXFx1RkYyNSc6ICdFJyxcbiAgICAnXFx1MDBDOCc6ICdFJyxcbiAgICAnXFx1MDBDOSc6ICdFJyxcbiAgICAnXFx1MDBDQSc6ICdFJyxcbiAgICAnXFx1MUVDMCc6ICdFJyxcbiAgICAnXFx1MUVCRSc6ICdFJyxcbiAgICAnXFx1MUVDNCc6ICdFJyxcbiAgICAnXFx1MUVDMic6ICdFJyxcbiAgICAnXFx1MUVCQyc6ICdFJyxcbiAgICAnXFx1MDExMic6ICdFJyxcbiAgICAnXFx1MUUxNCc6ICdFJyxcbiAgICAnXFx1MUUxNic6ICdFJyxcbiAgICAnXFx1MDExNCc6ICdFJyxcbiAgICAnXFx1MDExNic6ICdFJyxcbiAgICAnXFx1MDBDQic6ICdFJyxcbiAgICAnXFx1MUVCQSc6ICdFJyxcbiAgICAnXFx1MDExQSc6ICdFJyxcbiAgICAnXFx1MDIwNCc6ICdFJyxcbiAgICAnXFx1MDIwNic6ICdFJyxcbiAgICAnXFx1MUVCOCc6ICdFJyxcbiAgICAnXFx1MUVDNic6ICdFJyxcbiAgICAnXFx1MDIyOCc6ICdFJyxcbiAgICAnXFx1MUUxQyc6ICdFJyxcbiAgICAnXFx1MDExOCc6ICdFJyxcbiAgICAnXFx1MUUxOCc6ICdFJyxcbiAgICAnXFx1MUUxQSc6ICdFJyxcbiAgICAnXFx1MDE5MCc6ICdFJyxcbiAgICAnXFx1MDE4RSc6ICdFJyxcbiAgICAnXFx1MjRCQic6ICdGJyxcbiAgICAnXFx1RkYyNic6ICdGJyxcbiAgICAnXFx1MUUxRSc6ICdGJyxcbiAgICAnXFx1MDE5MSc6ICdGJyxcbiAgICAnXFx1QTc3Qic6ICdGJyxcbiAgICAnXFx1MjRCQyc6ICdHJyxcbiAgICAnXFx1RkYyNyc6ICdHJyxcbiAgICAnXFx1MDFGNCc6ICdHJyxcbiAgICAnXFx1MDExQyc6ICdHJyxcbiAgICAnXFx1MUUyMCc6ICdHJyxcbiAgICAnXFx1MDExRSc6ICdHJyxcbiAgICAnXFx1MDEyMCc6ICdHJyxcbiAgICAnXFx1MDFFNic6ICdHJyxcbiAgICAnXFx1MDEyMic6ICdHJyxcbiAgICAnXFx1MDFFNCc6ICdHJyxcbiAgICAnXFx1MDE5Myc6ICdHJyxcbiAgICAnXFx1QTdBMCc6ICdHJyxcbiAgICAnXFx1QTc3RCc6ICdHJyxcbiAgICAnXFx1QTc3RSc6ICdHJyxcbiAgICAnXFx1MjRCRCc6ICdIJyxcbiAgICAnXFx1RkYyOCc6ICdIJyxcbiAgICAnXFx1MDEyNCc6ICdIJyxcbiAgICAnXFx1MUUyMic6ICdIJyxcbiAgICAnXFx1MUUyNic6ICdIJyxcbiAgICAnXFx1MDIxRSc6ICdIJyxcbiAgICAnXFx1MUUyNCc6ICdIJyxcbiAgICAnXFx1MUUyOCc6ICdIJyxcbiAgICAnXFx1MUUyQSc6ICdIJyxcbiAgICAnXFx1MDEyNic6ICdIJyxcbiAgICAnXFx1MkM2Nyc6ICdIJyxcbiAgICAnXFx1MkM3NSc6ICdIJyxcbiAgICAnXFx1QTc4RCc6ICdIJyxcbiAgICAnXFx1MjRCRSc6ICdJJyxcbiAgICAnXFx1RkYyOSc6ICdJJyxcbiAgICAnXFx1MDBDQyc6ICdJJyxcbiAgICAnXFx1MDBDRCc6ICdJJyxcbiAgICAnXFx1MDBDRSc6ICdJJyxcbiAgICAnXFx1MDEyOCc6ICdJJyxcbiAgICAnXFx1MDEyQSc6ICdJJyxcbiAgICAnXFx1MDEyQyc6ICdJJyxcbiAgICAnXFx1MDEzMCc6ICdJJyxcbiAgICAnXFx1MDBDRic6ICdJJyxcbiAgICAnXFx1MUUyRSc6ICdJJyxcbiAgICAnXFx1MUVDOCc6ICdJJyxcbiAgICAnXFx1MDFDRic6ICdJJyxcbiAgICAnXFx1MDIwOCc6ICdJJyxcbiAgICAnXFx1MDIwQSc6ICdJJyxcbiAgICAnXFx1MUVDQSc6ICdJJyxcbiAgICAnXFx1MDEyRSc6ICdJJyxcbiAgICAnXFx1MUUyQyc6ICdJJyxcbiAgICAnXFx1MDE5Nyc6ICdJJyxcbiAgICAnXFx1MjRCRic6ICdKJyxcbiAgICAnXFx1RkYyQSc6ICdKJyxcbiAgICAnXFx1MDEzNCc6ICdKJyxcbiAgICAnXFx1MDI0OCc6ICdKJyxcbiAgICAnXFx1MjRDMCc6ICdLJyxcbiAgICAnXFx1RkYyQic6ICdLJyxcbiAgICAnXFx1MUUzMCc6ICdLJyxcbiAgICAnXFx1MDFFOCc6ICdLJyxcbiAgICAnXFx1MUUzMic6ICdLJyxcbiAgICAnXFx1MDEzNic6ICdLJyxcbiAgICAnXFx1MUUzNCc6ICdLJyxcbiAgICAnXFx1MDE5OCc6ICdLJyxcbiAgICAnXFx1MkM2OSc6ICdLJyxcbiAgICAnXFx1QTc0MCc6ICdLJyxcbiAgICAnXFx1QTc0Mic6ICdLJyxcbiAgICAnXFx1QTc0NCc6ICdLJyxcbiAgICAnXFx1QTdBMic6ICdLJyxcbiAgICAnXFx1MjRDMSc6ICdMJyxcbiAgICAnXFx1RkYyQyc6ICdMJyxcbiAgICAnXFx1MDEzRic6ICdMJyxcbiAgICAnXFx1MDEzOSc6ICdMJyxcbiAgICAnXFx1MDEzRCc6ICdMJyxcbiAgICAnXFx1MUUzNic6ICdMJyxcbiAgICAnXFx1MUUzOCc6ICdMJyxcbiAgICAnXFx1MDEzQic6ICdMJyxcbiAgICAnXFx1MUUzQyc6ICdMJyxcbiAgICAnXFx1MUUzQSc6ICdMJyxcbiAgICAnXFx1MDE0MSc6ICdMJyxcbiAgICAnXFx1MDIzRCc6ICdMJyxcbiAgICAnXFx1MkM2Mic6ICdMJyxcbiAgICAnXFx1MkM2MCc6ICdMJyxcbiAgICAnXFx1QTc0OCc6ICdMJyxcbiAgICAnXFx1QTc0Nic6ICdMJyxcbiAgICAnXFx1QTc4MCc6ICdMJyxcbiAgICAnXFx1MDFDNyc6ICdMSicsXG4gICAgJ1xcdTAxQzgnOiAnTGonLFxuICAgICdcXHUyNEMyJzogJ00nLFxuICAgICdcXHVGRjJEJzogJ00nLFxuICAgICdcXHUxRTNFJzogJ00nLFxuICAgICdcXHUxRTQwJzogJ00nLFxuICAgICdcXHUxRTQyJzogJ00nLFxuICAgICdcXHUyQzZFJzogJ00nLFxuICAgICdcXHUwMTlDJzogJ00nLFxuICAgICdcXHUyNEMzJzogJ04nLFxuICAgICdcXHVGRjJFJzogJ04nLFxuICAgICdcXHUwMUY4JzogJ04nLFxuICAgICdcXHUwMTQzJzogJ04nLFxuICAgICdcXHUwMEQxJzogJ04nLFxuICAgICdcXHUxRTQ0JzogJ04nLFxuICAgICdcXHUwMTQ3JzogJ04nLFxuICAgICdcXHUxRTQ2JzogJ04nLFxuICAgICdcXHUwMTQ1JzogJ04nLFxuICAgICdcXHUxRTRBJzogJ04nLFxuICAgICdcXHUxRTQ4JzogJ04nLFxuICAgICdcXHUwMjIwJzogJ04nLFxuICAgICdcXHUwMTlEJzogJ04nLFxuICAgICdcXHVBNzkwJzogJ04nLFxuICAgICdcXHVBN0E0JzogJ04nLFxuICAgICdcXHUwMUNBJzogJ05KJyxcbiAgICAnXFx1MDFDQic6ICdOaicsXG4gICAgJ1xcdTI0QzQnOiAnTycsXG4gICAgJ1xcdUZGMkYnOiAnTycsXG4gICAgJ1xcdTAwRDInOiAnTycsXG4gICAgJ1xcdTAwRDMnOiAnTycsXG4gICAgJ1xcdTAwRDQnOiAnTycsXG4gICAgJ1xcdTFFRDInOiAnTycsXG4gICAgJ1xcdTFFRDAnOiAnTycsXG4gICAgJ1xcdTFFRDYnOiAnTycsXG4gICAgJ1xcdTFFRDQnOiAnTycsXG4gICAgJ1xcdTAwRDUnOiAnTycsXG4gICAgJ1xcdTFFNEMnOiAnTycsXG4gICAgJ1xcdTAyMkMnOiAnTycsXG4gICAgJ1xcdTFFNEUnOiAnTycsXG4gICAgJ1xcdTAxNEMnOiAnTycsXG4gICAgJ1xcdTFFNTAnOiAnTycsXG4gICAgJ1xcdTFFNTInOiAnTycsXG4gICAgJ1xcdTAxNEUnOiAnTycsXG4gICAgJ1xcdTAyMkUnOiAnTycsXG4gICAgJ1xcdTAyMzAnOiAnTycsXG4gICAgJ1xcdTAwRDYnOiAnTycsXG4gICAgJ1xcdTAyMkEnOiAnTycsXG4gICAgJ1xcdTFFQ0UnOiAnTycsXG4gICAgJ1xcdTAxNTAnOiAnTycsXG4gICAgJ1xcdTAxRDEnOiAnTycsXG4gICAgJ1xcdTAyMEMnOiAnTycsXG4gICAgJ1xcdTAyMEUnOiAnTycsXG4gICAgJ1xcdTAxQTAnOiAnTycsXG4gICAgJ1xcdTFFREMnOiAnTycsXG4gICAgJ1xcdTFFREEnOiAnTycsXG4gICAgJ1xcdTFFRTAnOiAnTycsXG4gICAgJ1xcdTFFREUnOiAnTycsXG4gICAgJ1xcdTFFRTInOiAnTycsXG4gICAgJ1xcdTFFQ0MnOiAnTycsXG4gICAgJ1xcdTFFRDgnOiAnTycsXG4gICAgJ1xcdTAxRUEnOiAnTycsXG4gICAgJ1xcdTAxRUMnOiAnTycsXG4gICAgJ1xcdTAwRDgnOiAnTycsXG4gICAgJ1xcdTAxRkUnOiAnTycsXG4gICAgJ1xcdTAxODYnOiAnTycsXG4gICAgJ1xcdTAxOUYnOiAnTycsXG4gICAgJ1xcdUE3NEEnOiAnTycsXG4gICAgJ1xcdUE3NEMnOiAnTycsXG4gICAgJ1xcdTAxQTInOiAnT0knLFxuICAgICdcXHVBNzRFJzogJ09PJyxcbiAgICAnXFx1MDIyMic6ICdPVScsXG4gICAgJ1xcdTI0QzUnOiAnUCcsXG4gICAgJ1xcdUZGMzAnOiAnUCcsXG4gICAgJ1xcdTFFNTQnOiAnUCcsXG4gICAgJ1xcdTFFNTYnOiAnUCcsXG4gICAgJ1xcdTAxQTQnOiAnUCcsXG4gICAgJ1xcdTJDNjMnOiAnUCcsXG4gICAgJ1xcdUE3NTAnOiAnUCcsXG4gICAgJ1xcdUE3NTInOiAnUCcsXG4gICAgJ1xcdUE3NTQnOiAnUCcsXG4gICAgJ1xcdTI0QzYnOiAnUScsXG4gICAgJ1xcdUZGMzEnOiAnUScsXG4gICAgJ1xcdUE3NTYnOiAnUScsXG4gICAgJ1xcdUE3NTgnOiAnUScsXG4gICAgJ1xcdTAyNEEnOiAnUScsXG4gICAgJ1xcdTI0QzcnOiAnUicsXG4gICAgJ1xcdUZGMzInOiAnUicsXG4gICAgJ1xcdTAxNTQnOiAnUicsXG4gICAgJ1xcdTFFNTgnOiAnUicsXG4gICAgJ1xcdTAxNTgnOiAnUicsXG4gICAgJ1xcdTAyMTAnOiAnUicsXG4gICAgJ1xcdTAyMTInOiAnUicsXG4gICAgJ1xcdTFFNUEnOiAnUicsXG4gICAgJ1xcdTFFNUMnOiAnUicsXG4gICAgJ1xcdTAxNTYnOiAnUicsXG4gICAgJ1xcdTFFNUUnOiAnUicsXG4gICAgJ1xcdTAyNEMnOiAnUicsXG4gICAgJ1xcdTJDNjQnOiAnUicsXG4gICAgJ1xcdUE3NUEnOiAnUicsXG4gICAgJ1xcdUE3QTYnOiAnUicsXG4gICAgJ1xcdUE3ODInOiAnUicsXG4gICAgJ1xcdTI0QzgnOiAnUycsXG4gICAgJ1xcdUZGMzMnOiAnUycsXG4gICAgJ1xcdTFFOUUnOiAnUycsXG4gICAgJ1xcdTAxNUEnOiAnUycsXG4gICAgJ1xcdTFFNjQnOiAnUycsXG4gICAgJ1xcdTAxNUMnOiAnUycsXG4gICAgJ1xcdTFFNjAnOiAnUycsXG4gICAgJ1xcdTAxNjAnOiAnUycsXG4gICAgJ1xcdTFFNjYnOiAnUycsXG4gICAgJ1xcdTFFNjInOiAnUycsXG4gICAgJ1xcdTFFNjgnOiAnUycsXG4gICAgJ1xcdTAyMTgnOiAnUycsXG4gICAgJ1xcdTAxNUUnOiAnUycsXG4gICAgJ1xcdTJDN0UnOiAnUycsXG4gICAgJ1xcdUE3QTgnOiAnUycsXG4gICAgJ1xcdUE3ODQnOiAnUycsXG4gICAgJ1xcdTI0QzknOiAnVCcsXG4gICAgJ1xcdUZGMzQnOiAnVCcsXG4gICAgJ1xcdTFFNkEnOiAnVCcsXG4gICAgJ1xcdTAxNjQnOiAnVCcsXG4gICAgJ1xcdTFFNkMnOiAnVCcsXG4gICAgJ1xcdTAyMUEnOiAnVCcsXG4gICAgJ1xcdTAxNjInOiAnVCcsXG4gICAgJ1xcdTFFNzAnOiAnVCcsXG4gICAgJ1xcdTFFNkUnOiAnVCcsXG4gICAgJ1xcdTAxNjYnOiAnVCcsXG4gICAgJ1xcdTAxQUMnOiAnVCcsXG4gICAgJ1xcdTAxQUUnOiAnVCcsXG4gICAgJ1xcdTAyM0UnOiAnVCcsXG4gICAgJ1xcdUE3ODYnOiAnVCcsXG4gICAgJ1xcdUE3MjgnOiAnVFonLFxuICAgICdcXHUyNENBJzogJ1UnLFxuICAgICdcXHVGRjM1JzogJ1UnLFxuICAgICdcXHUwMEQ5JzogJ1UnLFxuICAgICdcXHUwMERBJzogJ1UnLFxuICAgICdcXHUwMERCJzogJ1UnLFxuICAgICdcXHUwMTY4JzogJ1UnLFxuICAgICdcXHUxRTc4JzogJ1UnLFxuICAgICdcXHUwMTZBJzogJ1UnLFxuICAgICdcXHUxRTdBJzogJ1UnLFxuICAgICdcXHUwMTZDJzogJ1UnLFxuICAgICdcXHUwMERDJzogJ1UnLFxuICAgICdcXHUwMURCJzogJ1UnLFxuICAgICdcXHUwMUQ3JzogJ1UnLFxuICAgICdcXHUwMUQ1JzogJ1UnLFxuICAgICdcXHUwMUQ5JzogJ1UnLFxuICAgICdcXHUxRUU2JzogJ1UnLFxuICAgICdcXHUwMTZFJzogJ1UnLFxuICAgICdcXHUwMTcwJzogJ1UnLFxuICAgICdcXHUwMUQzJzogJ1UnLFxuICAgICdcXHUwMjE0JzogJ1UnLFxuICAgICdcXHUwMjE2JzogJ1UnLFxuICAgICdcXHUwMUFGJzogJ1UnLFxuICAgICdcXHUxRUVBJzogJ1UnLFxuICAgICdcXHUxRUU4JzogJ1UnLFxuICAgICdcXHUxRUVFJzogJ1UnLFxuICAgICdcXHUxRUVDJzogJ1UnLFxuICAgICdcXHUxRUYwJzogJ1UnLFxuICAgICdcXHUxRUU0JzogJ1UnLFxuICAgICdcXHUxRTcyJzogJ1UnLFxuICAgICdcXHUwMTcyJzogJ1UnLFxuICAgICdcXHUxRTc2JzogJ1UnLFxuICAgICdcXHUxRTc0JzogJ1UnLFxuICAgICdcXHUwMjQ0JzogJ1UnLFxuICAgICdcXHUyNENCJzogJ1YnLFxuICAgICdcXHVGRjM2JzogJ1YnLFxuICAgICdcXHUxRTdDJzogJ1YnLFxuICAgICdcXHUxRTdFJzogJ1YnLFxuICAgICdcXHUwMUIyJzogJ1YnLFxuICAgICdcXHVBNzVFJzogJ1YnLFxuICAgICdcXHUwMjQ1JzogJ1YnLFxuICAgICdcXHVBNzYwJzogJ1ZZJyxcbiAgICAnXFx1MjRDQyc6ICdXJyxcbiAgICAnXFx1RkYzNyc6ICdXJyxcbiAgICAnXFx1MUU4MCc6ICdXJyxcbiAgICAnXFx1MUU4Mic6ICdXJyxcbiAgICAnXFx1MDE3NCc6ICdXJyxcbiAgICAnXFx1MUU4Nic6ICdXJyxcbiAgICAnXFx1MUU4NCc6ICdXJyxcbiAgICAnXFx1MUU4OCc6ICdXJyxcbiAgICAnXFx1MkM3Mic6ICdXJyxcbiAgICAnXFx1MjRDRCc6ICdYJyxcbiAgICAnXFx1RkYzOCc6ICdYJyxcbiAgICAnXFx1MUU4QSc6ICdYJyxcbiAgICAnXFx1MUU4Qyc6ICdYJyxcbiAgICAnXFx1MjRDRSc6ICdZJyxcbiAgICAnXFx1RkYzOSc6ICdZJyxcbiAgICAnXFx1MUVGMic6ICdZJyxcbiAgICAnXFx1MDBERCc6ICdZJyxcbiAgICAnXFx1MDE3Nic6ICdZJyxcbiAgICAnXFx1MUVGOCc6ICdZJyxcbiAgICAnXFx1MDIzMic6ICdZJyxcbiAgICAnXFx1MUU4RSc6ICdZJyxcbiAgICAnXFx1MDE3OCc6ICdZJyxcbiAgICAnXFx1MUVGNic6ICdZJyxcbiAgICAnXFx1MUVGNCc6ICdZJyxcbiAgICAnXFx1MDFCMyc6ICdZJyxcbiAgICAnXFx1MDI0RSc6ICdZJyxcbiAgICAnXFx1MUVGRSc6ICdZJyxcbiAgICAnXFx1MjRDRic6ICdaJyxcbiAgICAnXFx1RkYzQSc6ICdaJyxcbiAgICAnXFx1MDE3OSc6ICdaJyxcbiAgICAnXFx1MUU5MCc6ICdaJyxcbiAgICAnXFx1MDE3Qic6ICdaJyxcbiAgICAnXFx1MDE3RCc6ICdaJyxcbiAgICAnXFx1MUU5Mic6ICdaJyxcbiAgICAnXFx1MUU5NCc6ICdaJyxcbiAgICAnXFx1MDFCNSc6ICdaJyxcbiAgICAnXFx1MDIyNCc6ICdaJyxcbiAgICAnXFx1MkM3Ric6ICdaJyxcbiAgICAnXFx1MkM2Qic6ICdaJyxcbiAgICAnXFx1QTc2Mic6ICdaJyxcbiAgICAnXFx1MjREMCc6ICdhJyxcbiAgICAnXFx1RkY0MSc6ICdhJyxcbiAgICAnXFx1MUU5QSc6ICdhJyxcbiAgICAnXFx1MDBFMCc6ICdhJyxcbiAgICAnXFx1MDBFMSc6ICdhJyxcbiAgICAnXFx1MDBFMic6ICdhJyxcbiAgICAnXFx1MUVBNyc6ICdhJyxcbiAgICAnXFx1MUVBNSc6ICdhJyxcbiAgICAnXFx1MUVBQic6ICdhJyxcbiAgICAnXFx1MUVBOSc6ICdhJyxcbiAgICAnXFx1MDBFMyc6ICdhJyxcbiAgICAnXFx1MDEwMSc6ICdhJyxcbiAgICAnXFx1MDEwMyc6ICdhJyxcbiAgICAnXFx1MUVCMSc6ICdhJyxcbiAgICAnXFx1MUVBRic6ICdhJyxcbiAgICAnXFx1MUVCNSc6ICdhJyxcbiAgICAnXFx1MUVCMyc6ICdhJyxcbiAgICAnXFx1MDIyNyc6ICdhJyxcbiAgICAnXFx1MDFFMSc6ICdhJyxcbiAgICAnXFx1MDBFNCc6ICdhJyxcbiAgICAnXFx1MDFERic6ICdhJyxcbiAgICAnXFx1MUVBMyc6ICdhJyxcbiAgICAnXFx1MDBFNSc6ICdhJyxcbiAgICAnXFx1MDFGQic6ICdhJyxcbiAgICAnXFx1MDFDRSc6ICdhJyxcbiAgICAnXFx1MDIwMSc6ICdhJyxcbiAgICAnXFx1MDIwMyc6ICdhJyxcbiAgICAnXFx1MUVBMSc6ICdhJyxcbiAgICAnXFx1MUVBRCc6ICdhJyxcbiAgICAnXFx1MUVCNyc6ICdhJyxcbiAgICAnXFx1MUUwMSc6ICdhJyxcbiAgICAnXFx1MDEwNSc6ICdhJyxcbiAgICAnXFx1MkM2NSc6ICdhJyxcbiAgICAnXFx1MDI1MCc6ICdhJyxcbiAgICAnXFx1QTczMyc6ICdhYScsXG4gICAgJ1xcdTAwRTYnOiAnYWUnLFxuICAgICdcXHUwMUZEJzogJ2FlJyxcbiAgICAnXFx1MDFFMyc6ICdhZScsXG4gICAgJ1xcdUE3MzUnOiAnYW8nLFxuICAgICdcXHVBNzM3JzogJ2F1JyxcbiAgICAnXFx1QTczOSc6ICdhdicsXG4gICAgJ1xcdUE3M0InOiAnYXYnLFxuICAgICdcXHVBNzNEJzogJ2F5JyxcbiAgICAnXFx1MjREMSc6ICdiJyxcbiAgICAnXFx1RkY0Mic6ICdiJyxcbiAgICAnXFx1MUUwMyc6ICdiJyxcbiAgICAnXFx1MUUwNSc6ICdiJyxcbiAgICAnXFx1MUUwNyc6ICdiJyxcbiAgICAnXFx1MDE4MCc6ICdiJyxcbiAgICAnXFx1MDE4Myc6ICdiJyxcbiAgICAnXFx1MDI1Myc6ICdiJyxcbiAgICAnXFx1MjREMic6ICdjJyxcbiAgICAnXFx1RkY0Myc6ICdjJyxcbiAgICAnXFx1MDEwNyc6ICdjJyxcbiAgICAnXFx1MDEwOSc6ICdjJyxcbiAgICAnXFx1MDEwQic6ICdjJyxcbiAgICAnXFx1MDEwRCc6ICdjJyxcbiAgICAnXFx1MDBFNyc6ICdjJyxcbiAgICAnXFx1MUUwOSc6ICdjJyxcbiAgICAnXFx1MDE4OCc6ICdjJyxcbiAgICAnXFx1MDIzQyc6ICdjJyxcbiAgICAnXFx1QTczRic6ICdjJyxcbiAgICAnXFx1MjE4NCc6ICdjJyxcbiAgICAnXFx1MjREMyc6ICdkJyxcbiAgICAnXFx1RkY0NCc6ICdkJyxcbiAgICAnXFx1MUUwQic6ICdkJyxcbiAgICAnXFx1MDEwRic6ICdkJyxcbiAgICAnXFx1MUUwRCc6ICdkJyxcbiAgICAnXFx1MUUxMSc6ICdkJyxcbiAgICAnXFx1MUUxMyc6ICdkJyxcbiAgICAnXFx1MUUwRic6ICdkJyxcbiAgICAnXFx1MDExMSc6ICdkJyxcbiAgICAnXFx1MDE4Qyc6ICdkJyxcbiAgICAnXFx1MDI1Nic6ICdkJyxcbiAgICAnXFx1MDI1Nyc6ICdkJyxcbiAgICAnXFx1QTc3QSc6ICdkJyxcbiAgICAnXFx1MDFGMyc6ICdkeicsXG4gICAgJ1xcdTAxQzYnOiAnZHonLFxuICAgICdcXHUyNEQ0JzogJ2UnLFxuICAgICdcXHVGRjQ1JzogJ2UnLFxuICAgICdcXHUwMEU4JzogJ2UnLFxuICAgICdcXHUwMEU5JzogJ2UnLFxuICAgICdcXHUwMEVBJzogJ2UnLFxuICAgICdcXHUxRUMxJzogJ2UnLFxuICAgICdcXHUxRUJGJzogJ2UnLFxuICAgICdcXHUxRUM1JzogJ2UnLFxuICAgICdcXHUxRUMzJzogJ2UnLFxuICAgICdcXHUxRUJEJzogJ2UnLFxuICAgICdcXHUwMTEzJzogJ2UnLFxuICAgICdcXHUxRTE1JzogJ2UnLFxuICAgICdcXHUxRTE3JzogJ2UnLFxuICAgICdcXHUwMTE1JzogJ2UnLFxuICAgICdcXHUwMTE3JzogJ2UnLFxuICAgICdcXHUwMEVCJzogJ2UnLFxuICAgICdcXHUxRUJCJzogJ2UnLFxuICAgICdcXHUwMTFCJzogJ2UnLFxuICAgICdcXHUwMjA1JzogJ2UnLFxuICAgICdcXHUwMjA3JzogJ2UnLFxuICAgICdcXHUxRUI5JzogJ2UnLFxuICAgICdcXHUxRUM3JzogJ2UnLFxuICAgICdcXHUwMjI5JzogJ2UnLFxuICAgICdcXHUxRTFEJzogJ2UnLFxuICAgICdcXHUwMTE5JzogJ2UnLFxuICAgICdcXHUxRTE5JzogJ2UnLFxuICAgICdcXHUxRTFCJzogJ2UnLFxuICAgICdcXHUwMjQ3JzogJ2UnLFxuICAgICdcXHUwMjVCJzogJ2UnLFxuICAgICdcXHUwMUREJzogJ2UnLFxuICAgICdcXHUyNEQ1JzogJ2YnLFxuICAgICdcXHVGRjQ2JzogJ2YnLFxuICAgICdcXHUxRTFGJzogJ2YnLFxuICAgICdcXHUwMTkyJzogJ2YnLFxuICAgICdcXHVBNzdDJzogJ2YnLFxuICAgICdcXHUyNEQ2JzogJ2cnLFxuICAgICdcXHVGRjQ3JzogJ2cnLFxuICAgICdcXHUwMUY1JzogJ2cnLFxuICAgICdcXHUwMTFEJzogJ2cnLFxuICAgICdcXHUxRTIxJzogJ2cnLFxuICAgICdcXHUwMTFGJzogJ2cnLFxuICAgICdcXHUwMTIxJzogJ2cnLFxuICAgICdcXHUwMUU3JzogJ2cnLFxuICAgICdcXHUwMTIzJzogJ2cnLFxuICAgICdcXHUwMUU1JzogJ2cnLFxuICAgICdcXHUwMjYwJzogJ2cnLFxuICAgICdcXHVBN0ExJzogJ2cnLFxuICAgICdcXHUxRDc5JzogJ2cnLFxuICAgICdcXHVBNzdGJzogJ2cnLFxuICAgICdcXHUyNEQ3JzogJ2gnLFxuICAgICdcXHVGRjQ4JzogJ2gnLFxuICAgICdcXHUwMTI1JzogJ2gnLFxuICAgICdcXHUxRTIzJzogJ2gnLFxuICAgICdcXHUxRTI3JzogJ2gnLFxuICAgICdcXHUwMjFGJzogJ2gnLFxuICAgICdcXHUxRTI1JzogJ2gnLFxuICAgICdcXHUxRTI5JzogJ2gnLFxuICAgICdcXHUxRTJCJzogJ2gnLFxuICAgICdcXHUxRTk2JzogJ2gnLFxuICAgICdcXHUwMTI3JzogJ2gnLFxuICAgICdcXHUyQzY4JzogJ2gnLFxuICAgICdcXHUyQzc2JzogJ2gnLFxuICAgICdcXHUwMjY1JzogJ2gnLFxuICAgICdcXHUwMTk1JzogJ2h2JyxcbiAgICAnXFx1MjREOCc6ICdpJyxcbiAgICAnXFx1RkY0OSc6ICdpJyxcbiAgICAnXFx1MDBFQyc6ICdpJyxcbiAgICAnXFx1MDBFRCc6ICdpJyxcbiAgICAnXFx1MDBFRSc6ICdpJyxcbiAgICAnXFx1MDEyOSc6ICdpJyxcbiAgICAnXFx1MDEyQic6ICdpJyxcbiAgICAnXFx1MDEyRCc6ICdpJyxcbiAgICAnXFx1MDBFRic6ICdpJyxcbiAgICAnXFx1MUUyRic6ICdpJyxcbiAgICAnXFx1MUVDOSc6ICdpJyxcbiAgICAnXFx1MDFEMCc6ICdpJyxcbiAgICAnXFx1MDIwOSc6ICdpJyxcbiAgICAnXFx1MDIwQic6ICdpJyxcbiAgICAnXFx1MUVDQic6ICdpJyxcbiAgICAnXFx1MDEyRic6ICdpJyxcbiAgICAnXFx1MUUyRCc6ICdpJyxcbiAgICAnXFx1MDI2OCc6ICdpJyxcbiAgICAnXFx1MDEzMSc6ICdpJyxcbiAgICAnXFx1MjREOSc6ICdqJyxcbiAgICAnXFx1RkY0QSc6ICdqJyxcbiAgICAnXFx1MDEzNSc6ICdqJyxcbiAgICAnXFx1MDFGMCc6ICdqJyxcbiAgICAnXFx1MDI0OSc6ICdqJyxcbiAgICAnXFx1MjREQSc6ICdrJyxcbiAgICAnXFx1RkY0Qic6ICdrJyxcbiAgICAnXFx1MUUzMSc6ICdrJyxcbiAgICAnXFx1MDFFOSc6ICdrJyxcbiAgICAnXFx1MUUzMyc6ICdrJyxcbiAgICAnXFx1MDEzNyc6ICdrJyxcbiAgICAnXFx1MUUzNSc6ICdrJyxcbiAgICAnXFx1MDE5OSc6ICdrJyxcbiAgICAnXFx1MkM2QSc6ICdrJyxcbiAgICAnXFx1QTc0MSc6ICdrJyxcbiAgICAnXFx1QTc0Myc6ICdrJyxcbiAgICAnXFx1QTc0NSc6ICdrJyxcbiAgICAnXFx1QTdBMyc6ICdrJyxcbiAgICAnXFx1MjREQic6ICdsJyxcbiAgICAnXFx1RkY0Qyc6ICdsJyxcbiAgICAnXFx1MDE0MCc6ICdsJyxcbiAgICAnXFx1MDEzQSc6ICdsJyxcbiAgICAnXFx1MDEzRSc6ICdsJyxcbiAgICAnXFx1MUUzNyc6ICdsJyxcbiAgICAnXFx1MUUzOSc6ICdsJyxcbiAgICAnXFx1MDEzQyc6ICdsJyxcbiAgICAnXFx1MUUzRCc6ICdsJyxcbiAgICAnXFx1MUUzQic6ICdsJyxcbiAgICAnXFx1MDE3Ric6ICdsJyxcbiAgICAnXFx1MDE0Mic6ICdsJyxcbiAgICAnXFx1MDE5QSc6ICdsJyxcbiAgICAnXFx1MDI2Qic6ICdsJyxcbiAgICAnXFx1MkM2MSc6ICdsJyxcbiAgICAnXFx1QTc0OSc6ICdsJyxcbiAgICAnXFx1QTc4MSc6ICdsJyxcbiAgICAnXFx1QTc0Nyc6ICdsJyxcbiAgICAnXFx1MDFDOSc6ICdsaicsXG4gICAgJ1xcdTI0REMnOiAnbScsXG4gICAgJ1xcdUZGNEQnOiAnbScsXG4gICAgJ1xcdTFFM0YnOiAnbScsXG4gICAgJ1xcdTFFNDEnOiAnbScsXG4gICAgJ1xcdTFFNDMnOiAnbScsXG4gICAgJ1xcdTAyNzEnOiAnbScsXG4gICAgJ1xcdTAyNkYnOiAnbScsXG4gICAgJ1xcdTI0REQnOiAnbicsXG4gICAgJ1xcdUZGNEUnOiAnbicsXG4gICAgJ1xcdTAxRjknOiAnbicsXG4gICAgJ1xcdTAxNDQnOiAnbicsXG4gICAgJ1xcdTAwRjEnOiAnbicsXG4gICAgJ1xcdTFFNDUnOiAnbicsXG4gICAgJ1xcdTAxNDgnOiAnbicsXG4gICAgJ1xcdTFFNDcnOiAnbicsXG4gICAgJ1xcdTAxNDYnOiAnbicsXG4gICAgJ1xcdTFFNEInOiAnbicsXG4gICAgJ1xcdTFFNDknOiAnbicsXG4gICAgJ1xcdTAxOUUnOiAnbicsXG4gICAgJ1xcdTAyNzInOiAnbicsXG4gICAgJ1xcdTAxNDknOiAnbicsXG4gICAgJ1xcdUE3OTEnOiAnbicsXG4gICAgJ1xcdUE3QTUnOiAnbicsXG4gICAgJ1xcdTAxQ0MnOiAnbmonLFxuICAgICdcXHUyNERFJzogJ28nLFxuICAgICdcXHVGRjRGJzogJ28nLFxuICAgICdcXHUwMEYyJzogJ28nLFxuICAgICdcXHUwMEYzJzogJ28nLFxuICAgICdcXHUwMEY0JzogJ28nLFxuICAgICdcXHUxRUQzJzogJ28nLFxuICAgICdcXHUxRUQxJzogJ28nLFxuICAgICdcXHUxRUQ3JzogJ28nLFxuICAgICdcXHUxRUQ1JzogJ28nLFxuICAgICdcXHUwMEY1JzogJ28nLFxuICAgICdcXHUxRTREJzogJ28nLFxuICAgICdcXHUwMjJEJzogJ28nLFxuICAgICdcXHUxRTRGJzogJ28nLFxuICAgICdcXHUwMTREJzogJ28nLFxuICAgICdcXHUxRTUxJzogJ28nLFxuICAgICdcXHUxRTUzJzogJ28nLFxuICAgICdcXHUwMTRGJzogJ28nLFxuICAgICdcXHUwMjJGJzogJ28nLFxuICAgICdcXHUwMjMxJzogJ28nLFxuICAgICdcXHUwMEY2JzogJ28nLFxuICAgICdcXHUwMjJCJzogJ28nLFxuICAgICdcXHUxRUNGJzogJ28nLFxuICAgICdcXHUwMTUxJzogJ28nLFxuICAgICdcXHUwMUQyJzogJ28nLFxuICAgICdcXHUwMjBEJzogJ28nLFxuICAgICdcXHUwMjBGJzogJ28nLFxuICAgICdcXHUwMUExJzogJ28nLFxuICAgICdcXHUxRUREJzogJ28nLFxuICAgICdcXHUxRURCJzogJ28nLFxuICAgICdcXHUxRUUxJzogJ28nLFxuICAgICdcXHUxRURGJzogJ28nLFxuICAgICdcXHUxRUUzJzogJ28nLFxuICAgICdcXHUxRUNEJzogJ28nLFxuICAgICdcXHUxRUQ5JzogJ28nLFxuICAgICdcXHUwMUVCJzogJ28nLFxuICAgICdcXHUwMUVEJzogJ28nLFxuICAgICdcXHUwMEY4JzogJ28nLFxuICAgICdcXHUwMUZGJzogJ28nLFxuICAgICdcXHUwMjU0JzogJ28nLFxuICAgICdcXHVBNzRCJzogJ28nLFxuICAgICdcXHVBNzREJzogJ28nLFxuICAgICdcXHUwMjc1JzogJ28nLFxuICAgICdcXHUwMUEzJzogJ29pJyxcbiAgICAnXFx1MDIyMyc6ICdvdScsXG4gICAgJ1xcdUE3NEYnOiAnb28nLFxuICAgICdcXHUyNERGJzogJ3AnLFxuICAgICdcXHVGRjUwJzogJ3AnLFxuICAgICdcXHUxRTU1JzogJ3AnLFxuICAgICdcXHUxRTU3JzogJ3AnLFxuICAgICdcXHUwMUE1JzogJ3AnLFxuICAgICdcXHUxRDdEJzogJ3AnLFxuICAgICdcXHVBNzUxJzogJ3AnLFxuICAgICdcXHVBNzUzJzogJ3AnLFxuICAgICdcXHVBNzU1JzogJ3AnLFxuICAgICdcXHUyNEUwJzogJ3EnLFxuICAgICdcXHVGRjUxJzogJ3EnLFxuICAgICdcXHUwMjRCJzogJ3EnLFxuICAgICdcXHVBNzU3JzogJ3EnLFxuICAgICdcXHVBNzU5JzogJ3EnLFxuICAgICdcXHUyNEUxJzogJ3InLFxuICAgICdcXHVGRjUyJzogJ3InLFxuICAgICdcXHUwMTU1JzogJ3InLFxuICAgICdcXHUxRTU5JzogJ3InLFxuICAgICdcXHUwMTU5JzogJ3InLFxuICAgICdcXHUwMjExJzogJ3InLFxuICAgICdcXHUwMjEzJzogJ3InLFxuICAgICdcXHUxRTVCJzogJ3InLFxuICAgICdcXHUxRTVEJzogJ3InLFxuICAgICdcXHUwMTU3JzogJ3InLFxuICAgICdcXHUxRTVGJzogJ3InLFxuICAgICdcXHUwMjREJzogJ3InLFxuICAgICdcXHUwMjdEJzogJ3InLFxuICAgICdcXHVBNzVCJzogJ3InLFxuICAgICdcXHVBN0E3JzogJ3InLFxuICAgICdcXHVBNzgzJzogJ3InLFxuICAgICdcXHUyNEUyJzogJ3MnLFxuICAgICdcXHVGRjUzJzogJ3MnLFxuICAgICdcXHUwMERGJzogJ3MnLFxuICAgICdcXHUwMTVCJzogJ3MnLFxuICAgICdcXHUxRTY1JzogJ3MnLFxuICAgICdcXHUwMTVEJzogJ3MnLFxuICAgICdcXHUxRTYxJzogJ3MnLFxuICAgICdcXHUwMTYxJzogJ3MnLFxuICAgICdcXHUxRTY3JzogJ3MnLFxuICAgICdcXHUxRTYzJzogJ3MnLFxuICAgICdcXHUxRTY5JzogJ3MnLFxuICAgICdcXHUwMjE5JzogJ3MnLFxuICAgICdcXHUwMTVGJzogJ3MnLFxuICAgICdcXHUwMjNGJzogJ3MnLFxuICAgICdcXHVBN0E5JzogJ3MnLFxuICAgICdcXHVBNzg1JzogJ3MnLFxuICAgICdcXHUxRTlCJzogJ3MnLFxuICAgICdcXHUyNEUzJzogJ3QnLFxuICAgICdcXHVGRjU0JzogJ3QnLFxuICAgICdcXHUxRTZCJzogJ3QnLFxuICAgICdcXHUxRTk3JzogJ3QnLFxuICAgICdcXHUwMTY1JzogJ3QnLFxuICAgICdcXHUxRTZEJzogJ3QnLFxuICAgICdcXHUwMjFCJzogJ3QnLFxuICAgICdcXHUwMTYzJzogJ3QnLFxuICAgICdcXHUxRTcxJzogJ3QnLFxuICAgICdcXHUxRTZGJzogJ3QnLFxuICAgICdcXHUwMTY3JzogJ3QnLFxuICAgICdcXHUwMUFEJzogJ3QnLFxuICAgICdcXHUwMjg4JzogJ3QnLFxuICAgICdcXHUyQzY2JzogJ3QnLFxuICAgICdcXHVBNzg3JzogJ3QnLFxuICAgICdcXHVBNzI5JzogJ3R6JyxcbiAgICAnXFx1MjRFNCc6ICd1JyxcbiAgICAnXFx1RkY1NSc6ICd1JyxcbiAgICAnXFx1MDBGOSc6ICd1JyxcbiAgICAnXFx1MDBGQSc6ICd1JyxcbiAgICAnXFx1MDBGQic6ICd1JyxcbiAgICAnXFx1MDE2OSc6ICd1JyxcbiAgICAnXFx1MUU3OSc6ICd1JyxcbiAgICAnXFx1MDE2Qic6ICd1JyxcbiAgICAnXFx1MUU3Qic6ICd1JyxcbiAgICAnXFx1MDE2RCc6ICd1JyxcbiAgICAnXFx1MDBGQyc6ICd1JyxcbiAgICAnXFx1MDFEQyc6ICd1JyxcbiAgICAnXFx1MDFEOCc6ICd1JyxcbiAgICAnXFx1MDFENic6ICd1JyxcbiAgICAnXFx1MDFEQSc6ICd1JyxcbiAgICAnXFx1MUVFNyc6ICd1JyxcbiAgICAnXFx1MDE2Ric6ICd1JyxcbiAgICAnXFx1MDE3MSc6ICd1JyxcbiAgICAnXFx1MDFENCc6ICd1JyxcbiAgICAnXFx1MDIxNSc6ICd1JyxcbiAgICAnXFx1MDIxNyc6ICd1JyxcbiAgICAnXFx1MDFCMCc6ICd1JyxcbiAgICAnXFx1MUVFQic6ICd1JyxcbiAgICAnXFx1MUVFOSc6ICd1JyxcbiAgICAnXFx1MUVFRic6ICd1JyxcbiAgICAnXFx1MUVFRCc6ICd1JyxcbiAgICAnXFx1MUVGMSc6ICd1JyxcbiAgICAnXFx1MUVFNSc6ICd1JyxcbiAgICAnXFx1MUU3Myc6ICd1JyxcbiAgICAnXFx1MDE3Myc6ICd1JyxcbiAgICAnXFx1MUU3Nyc6ICd1JyxcbiAgICAnXFx1MUU3NSc6ICd1JyxcbiAgICAnXFx1MDI4OSc6ICd1JyxcbiAgICAnXFx1MjRFNSc6ICd2JyxcbiAgICAnXFx1RkY1Nic6ICd2JyxcbiAgICAnXFx1MUU3RCc6ICd2JyxcbiAgICAnXFx1MUU3Ric6ICd2JyxcbiAgICAnXFx1MDI4Qic6ICd2JyxcbiAgICAnXFx1QTc1Ric6ICd2JyxcbiAgICAnXFx1MDI4Qyc6ICd2JyxcbiAgICAnXFx1QTc2MSc6ICd2eScsXG4gICAgJ1xcdTI0RTYnOiAndycsXG4gICAgJ1xcdUZGNTcnOiAndycsXG4gICAgJ1xcdTFFODEnOiAndycsXG4gICAgJ1xcdTFFODMnOiAndycsXG4gICAgJ1xcdTAxNzUnOiAndycsXG4gICAgJ1xcdTFFODcnOiAndycsXG4gICAgJ1xcdTFFODUnOiAndycsXG4gICAgJ1xcdTFFOTgnOiAndycsXG4gICAgJ1xcdTFFODknOiAndycsXG4gICAgJ1xcdTJDNzMnOiAndycsXG4gICAgJ1xcdTI0RTcnOiAneCcsXG4gICAgJ1xcdUZGNTgnOiAneCcsXG4gICAgJ1xcdTFFOEInOiAneCcsXG4gICAgJ1xcdTFFOEQnOiAneCcsXG4gICAgJ1xcdTI0RTgnOiAneScsXG4gICAgJ1xcdUZGNTknOiAneScsXG4gICAgJ1xcdTFFRjMnOiAneScsXG4gICAgJ1xcdTAwRkQnOiAneScsXG4gICAgJ1xcdTAxNzcnOiAneScsXG4gICAgJ1xcdTFFRjknOiAneScsXG4gICAgJ1xcdTAyMzMnOiAneScsXG4gICAgJ1xcdTFFOEYnOiAneScsXG4gICAgJ1xcdTAwRkYnOiAneScsXG4gICAgJ1xcdTFFRjcnOiAneScsXG4gICAgJ1xcdTFFOTknOiAneScsXG4gICAgJ1xcdTFFRjUnOiAneScsXG4gICAgJ1xcdTAxQjQnOiAneScsXG4gICAgJ1xcdTAyNEYnOiAneScsXG4gICAgJ1xcdTFFRkYnOiAneScsXG4gICAgJ1xcdTI0RTknOiAneicsXG4gICAgJ1xcdUZGNUEnOiAneicsXG4gICAgJ1xcdTAxN0EnOiAneicsXG4gICAgJ1xcdTFFOTEnOiAneicsXG4gICAgJ1xcdTAxN0MnOiAneicsXG4gICAgJ1xcdTAxN0UnOiAneicsXG4gICAgJ1xcdTFFOTMnOiAneicsXG4gICAgJ1xcdTFFOTUnOiAneicsXG4gICAgJ1xcdTAxQjYnOiAneicsXG4gICAgJ1xcdTAyMjUnOiAneicsXG4gICAgJ1xcdTAyNDAnOiAneicsXG4gICAgJ1xcdTJDNkMnOiAneicsXG4gICAgJ1xcdUE3NjMnOiAneicsXG4gICAgJ1xcdTAzODYnOiAnXFx1MDM5MScsXG4gICAgJ1xcdTAzODgnOiAnXFx1MDM5NScsXG4gICAgJ1xcdTAzODknOiAnXFx1MDM5NycsXG4gICAgJ1xcdTAzOEEnOiAnXFx1MDM5OScsXG4gICAgJ1xcdTAzQUEnOiAnXFx1MDM5OScsXG4gICAgJ1xcdTAzOEMnOiAnXFx1MDM5RicsXG4gICAgJ1xcdTAzOEUnOiAnXFx1MDNBNScsXG4gICAgJ1xcdTAzQUInOiAnXFx1MDNBNScsXG4gICAgJ1xcdTAzOEYnOiAnXFx1MDNBOScsXG4gICAgJ1xcdTAzQUMnOiAnXFx1MDNCMScsXG4gICAgJ1xcdTAzQUQnOiAnXFx1MDNCNScsXG4gICAgJ1xcdTAzQUUnOiAnXFx1MDNCNycsXG4gICAgJ1xcdTAzQUYnOiAnXFx1MDNCOScsXG4gICAgJ1xcdTAzQ0EnOiAnXFx1MDNCOScsXG4gICAgJ1xcdTAzOTAnOiAnXFx1MDNCOScsXG4gICAgJ1xcdTAzQ0MnOiAnXFx1MDNCRicsXG4gICAgJ1xcdTAzQ0QnOiAnXFx1MDNDNScsXG4gICAgJ1xcdTAzQ0InOiAnXFx1MDNDNScsXG4gICAgJ1xcdTAzQjAnOiAnXFx1MDNDNScsXG4gICAgJ1xcdTAzQzknOiAnXFx1MDNDOScsXG4gICAgJ1xcdTAzQzInOiAnXFx1MDNDMydcbiAgfTtcblxuICByZXR1cm4gZGlhY3JpdGljcztcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZGF0YS9iYXNlJyxbXG4gICcuLi91dGlscydcbl0sIGZ1bmN0aW9uIChVdGlscykge1xuICBmdW5jdGlvbiBCYXNlQWRhcHRlciAoJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICBCYXNlQWRhcHRlci5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzKTtcbiAgfVxuXG4gIFV0aWxzLkV4dGVuZChCYXNlQWRhcHRlciwgVXRpbHMuT2JzZXJ2YWJsZSk7XG5cbiAgQmFzZUFkYXB0ZXIucHJvdG90eXBlLmN1cnJlbnQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBgY3VycmVudGAgbWV0aG9kIG11c3QgYmUgZGVmaW5lZCBpbiBjaGlsZCBjbGFzc2VzLicpO1xuICB9O1xuXG4gIEJhc2VBZGFwdGVyLnByb3RvdHlwZS5xdWVyeSA9IGZ1bmN0aW9uIChwYXJhbXMsIGNhbGxiYWNrKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgYHF1ZXJ5YCBtZXRob2QgbXVzdCBiZSBkZWZpbmVkIGluIGNoaWxkIGNsYXNzZXMuJyk7XG4gIH07XG5cbiAgQmFzZUFkYXB0ZXIucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoY29udGFpbmVyLCAkY29udGFpbmVyKSB7XG4gICAgLy8gQ2FuIGJlIGltcGxlbWVudGVkIGluIHN1YmNsYXNzZXNcbiAgfTtcblxuICBCYXNlQWRhcHRlci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBDYW4gYmUgaW1wbGVtZW50ZWQgaW4gc3ViY2xhc3Nlc1xuICB9O1xuXG4gIEJhc2VBZGFwdGVyLnByb3RvdHlwZS5nZW5lcmF0ZVJlc3VsdElkID0gZnVuY3Rpb24gKGNvbnRhaW5lciwgZGF0YSkge1xuICAgIHZhciBpZCA9IGNvbnRhaW5lci5pZCArICctcmVzdWx0LSc7XG5cbiAgICBpZCArPSBVdGlscy5nZW5lcmF0ZUNoYXJzKDQpO1xuXG4gICAgaWYgKGRhdGEuaWQgIT0gbnVsbCkge1xuICAgICAgaWQgKz0gJy0nICsgZGF0YS5pZC50b1N0cmluZygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZCArPSAnLScgKyBVdGlscy5nZW5lcmF0ZUNoYXJzKDQpO1xuICAgIH1cbiAgICByZXR1cm4gaWQ7XG4gIH07XG5cbiAgcmV0dXJuIEJhc2VBZGFwdGVyO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9kYXRhL3NlbGVjdCcsW1xuICAnLi9iYXNlJyxcbiAgJy4uL3V0aWxzJyxcbiAgJ2pxdWVyeSdcbl0sIGZ1bmN0aW9uIChCYXNlQWRhcHRlciwgVXRpbHMsICQpIHtcbiAgZnVuY3Rpb24gU2VsZWN0QWRhcHRlciAoJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ID0gJGVsZW1lbnQ7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgIFNlbGVjdEFkYXB0ZXIuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcyk7XG4gIH1cblxuICBVdGlscy5FeHRlbmQoU2VsZWN0QWRhcHRlciwgQmFzZUFkYXB0ZXIpO1xuXG4gIFNlbGVjdEFkYXB0ZXIucHJvdG90eXBlLmN1cnJlbnQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICB2YXIgZGF0YSA9IFtdO1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHRoaXMuJGVsZW1lbnQuZmluZCgnOnNlbGVjdGVkJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJG9wdGlvbiA9ICQodGhpcyk7XG5cbiAgICAgIHZhciBvcHRpb24gPSBzZWxmLml0ZW0oJG9wdGlvbik7XG5cbiAgICAgIGRhdGEucHVzaChvcHRpb24pO1xuICAgIH0pO1xuXG4gICAgY2FsbGJhY2soZGF0YSk7XG4gIH07XG5cbiAgU2VsZWN0QWRhcHRlci5wcm90b3R5cGUuc2VsZWN0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBkYXRhLnNlbGVjdGVkID0gdHJ1ZTtcblxuICAgIC8vIElmIGRhdGEuZWxlbWVudCBpcyBhIERPTSBub2RlLCB1c2UgaXQgaW5zdGVhZFxuICAgIGlmICgkKGRhdGEuZWxlbWVudCkuaXMoJ29wdGlvbicpKSB7XG4gICAgICBkYXRhLmVsZW1lbnQuc2VsZWN0ZWQgPSB0cnVlO1xuXG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2NoYW5nZScpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuJGVsZW1lbnQucHJvcCgnbXVsdGlwbGUnKSkge1xuICAgICAgdGhpcy5jdXJyZW50KGZ1bmN0aW9uIChjdXJyZW50RGF0YSkge1xuICAgICAgICB2YXIgdmFsID0gW107XG5cbiAgICAgICAgZGF0YSA9IFtkYXRhXTtcbiAgICAgICAgZGF0YS5wdXNoLmFwcGx5KGRhdGEsIGN1cnJlbnREYXRhKTtcblxuICAgICAgICBmb3IgKHZhciBkID0gMDsgZCA8IGRhdGEubGVuZ3RoOyBkKyspIHtcbiAgICAgICAgICB2YXIgaWQgPSBkYXRhW2RdLmlkO1xuXG4gICAgICAgICAgaWYgKCQuaW5BcnJheShpZCwgdmFsKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHZhbC5wdXNoKGlkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLiRlbGVtZW50LnZhbCh2YWwpO1xuICAgICAgICBzZWxmLiRlbGVtZW50LnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB2YWwgPSBkYXRhLmlkO1xuXG4gICAgICB0aGlzLiRlbGVtZW50LnZhbCh2YWwpO1xuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICB9XG4gIH07XG5cbiAgU2VsZWN0QWRhcHRlci5wcm90b3R5cGUudW5zZWxlY3QgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGlmICghdGhpcy4kZWxlbWVudC5wcm9wKCdtdWx0aXBsZScpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZGF0YS5zZWxlY3RlZCA9IGZhbHNlO1xuXG4gICAgaWYgKCQoZGF0YS5lbGVtZW50KS5pcygnb3B0aW9uJykpIHtcbiAgICAgIGRhdGEuZWxlbWVudC5zZWxlY3RlZCA9IGZhbHNlO1xuXG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2NoYW5nZScpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jdXJyZW50KGZ1bmN0aW9uIChjdXJyZW50RGF0YSkge1xuICAgICAgdmFyIHZhbCA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBkID0gMDsgZCA8IGN1cnJlbnREYXRhLmxlbmd0aDsgZCsrKSB7XG4gICAgICAgIHZhciBpZCA9IGN1cnJlbnREYXRhW2RdLmlkO1xuXG4gICAgICAgIGlmIChpZCAhPT0gZGF0YS5pZCAmJiAkLmluQXJyYXkoaWQsIHZhbCkgPT09IC0xKSB7XG4gICAgICAgICAgdmFsLnB1c2goaWQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHNlbGYuJGVsZW1lbnQudmFsKHZhbCk7XG5cbiAgICAgIHNlbGYuJGVsZW1lbnQudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgfSk7XG4gIH07XG5cbiAgU2VsZWN0QWRhcHRlci5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChjb250YWluZXIsICRjb250YWluZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcblxuICAgIGNvbnRhaW5lci5vbignc2VsZWN0JywgZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgc2VsZi5zZWxlY3QocGFyYW1zLmRhdGEpO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCd1bnNlbGVjdCcsIGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgIHNlbGYudW5zZWxlY3QocGFyYW1zLmRhdGEpO1xuICAgIH0pO1xuICB9O1xuXG4gIFNlbGVjdEFkYXB0ZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gUmVtb3ZlIGFueXRoaW5nIGFkZGVkIHRvIGNoaWxkIGVsZW1lbnRzXG4gICAgdGhpcy4kZWxlbWVudC5maW5kKCcqJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBSZW1vdmUgYW55IGN1c3RvbSBkYXRhIHNldCBieSBTZWxlY3QyXG4gICAgICAkLnJlbW92ZURhdGEodGhpcywgJ2RhdGEnKTtcbiAgICB9KTtcbiAgfTtcblxuICBTZWxlY3RBZGFwdGVyLnByb3RvdHlwZS5xdWVyeSA9IGZ1bmN0aW9uIChwYXJhbXMsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGRhdGEgPSBbXTtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgJG9wdGlvbnMgPSB0aGlzLiRlbGVtZW50LmNoaWxkcmVuKCk7XG5cbiAgICAkb3B0aW9ucy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkb3B0aW9uID0gJCh0aGlzKTtcblxuICAgICAgaWYgKCEkb3B0aW9uLmlzKCdvcHRpb24nKSAmJiAhJG9wdGlvbi5pcygnb3B0Z3JvdXAnKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBvcHRpb24gPSBzZWxmLml0ZW0oJG9wdGlvbik7XG5cbiAgICAgIHZhciBtYXRjaGVzID0gc2VsZi5tYXRjaGVzKHBhcmFtcywgb3B0aW9uKTtcblxuICAgICAgaWYgKG1hdGNoZXMgIT09IG51bGwpIHtcbiAgICAgICAgZGF0YS5wdXNoKG1hdGNoZXMpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY2FsbGJhY2soe1xuICAgICAgcmVzdWx0czogZGF0YVxuICAgIH0pO1xuICB9O1xuXG4gIFNlbGVjdEFkYXB0ZXIucHJvdG90eXBlLmFkZE9wdGlvbnMgPSBmdW5jdGlvbiAoJG9wdGlvbnMpIHtcbiAgICBVdGlscy5hcHBlbmRNYW55KHRoaXMuJGVsZW1lbnQsICRvcHRpb25zKTtcbiAgfTtcblxuICBTZWxlY3RBZGFwdGVyLnByb3RvdHlwZS5vcHRpb24gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBvcHRpb247XG5cbiAgICBpZiAoZGF0YS5jaGlsZHJlbikge1xuICAgICAgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0Z3JvdXAnKTtcbiAgICAgIG9wdGlvbi5sYWJlbCA9IGRhdGEudGV4dDtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG5cbiAgICAgIGlmIChvcHRpb24udGV4dENvbnRlbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBvcHRpb24udGV4dENvbnRlbnQgPSBkYXRhLnRleHQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcHRpb24uaW5uZXJUZXh0ID0gZGF0YS50ZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkYXRhLmlkKSB7XG4gICAgICBvcHRpb24udmFsdWUgPSBkYXRhLmlkO1xuICAgIH1cblxuICAgIGlmIChkYXRhLmRpc2FibGVkKSB7XG4gICAgICBvcHRpb24uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChkYXRhLnNlbGVjdGVkKSB7XG4gICAgICBvcHRpb24uc2VsZWN0ZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChkYXRhLnRpdGxlKSB7XG4gICAgICBvcHRpb24udGl0bGUgPSBkYXRhLnRpdGxlO1xuICAgIH1cblxuICAgIHZhciAkb3B0aW9uID0gJChvcHRpb24pO1xuXG4gICAgdmFyIG5vcm1hbGl6ZWREYXRhID0gdGhpcy5fbm9ybWFsaXplSXRlbShkYXRhKTtcbiAgICBub3JtYWxpemVkRGF0YS5lbGVtZW50ID0gb3B0aW9uO1xuXG4gICAgLy8gT3ZlcnJpZGUgdGhlIG9wdGlvbidzIGRhdGEgd2l0aCB0aGUgY29tYmluZWQgZGF0YVxuICAgICQuZGF0YShvcHRpb24sICdkYXRhJywgbm9ybWFsaXplZERhdGEpO1xuXG4gICAgcmV0dXJuICRvcHRpb247XG4gIH07XG5cbiAgU2VsZWN0QWRhcHRlci5wcm90b3R5cGUuaXRlbSA9IGZ1bmN0aW9uICgkb3B0aW9uKSB7XG4gICAgdmFyIGRhdGEgPSB7fTtcblxuICAgIGRhdGEgPSAkLmRhdGEoJG9wdGlvblswXSwgJ2RhdGEnKTtcblxuICAgIGlmIChkYXRhICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIGlmICgkb3B0aW9uLmlzKCdvcHRpb24nKSkge1xuICAgICAgZGF0YSA9IHtcbiAgICAgICAgaWQ6ICRvcHRpb24udmFsKCksXG4gICAgICAgIHRleHQ6ICRvcHRpb24udGV4dCgpLFxuICAgICAgICBkaXNhYmxlZDogJG9wdGlvbi5wcm9wKCdkaXNhYmxlZCcpLFxuICAgICAgICBzZWxlY3RlZDogJG9wdGlvbi5wcm9wKCdzZWxlY3RlZCcpLFxuICAgICAgICB0aXRsZTogJG9wdGlvbi5wcm9wKCd0aXRsZScpXG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoJG9wdGlvbi5pcygnb3B0Z3JvdXAnKSkge1xuICAgICAgZGF0YSA9IHtcbiAgICAgICAgdGV4dDogJG9wdGlvbi5wcm9wKCdsYWJlbCcpLFxuICAgICAgICBjaGlsZHJlbjogW10sXG4gICAgICAgIHRpdGxlOiAkb3B0aW9uLnByb3AoJ3RpdGxlJylcbiAgICAgIH07XG5cbiAgICAgIHZhciAkY2hpbGRyZW4gPSAkb3B0aW9uLmNoaWxkcmVuKCdvcHRpb24nKTtcbiAgICAgIHZhciBjaGlsZHJlbiA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBjID0gMDsgYyA8ICRjaGlsZHJlbi5sZW5ndGg7IGMrKykge1xuICAgICAgICB2YXIgJGNoaWxkID0gJCgkY2hpbGRyZW5bY10pO1xuXG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuaXRlbSgkY2hpbGQpO1xuXG4gICAgICAgIGNoaWxkcmVuLnB1c2goY2hpbGQpO1xuICAgICAgfVxuXG4gICAgICBkYXRhLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgfVxuXG4gICAgZGF0YSA9IHRoaXMuX25vcm1hbGl6ZUl0ZW0oZGF0YSk7XG4gICAgZGF0YS5lbGVtZW50ID0gJG9wdGlvblswXTtcblxuICAgICQuZGF0YSgkb3B0aW9uWzBdLCAnZGF0YScsIGRhdGEpO1xuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH07XG5cbiAgU2VsZWN0QWRhcHRlci5wcm90b3R5cGUuX25vcm1hbGl6ZUl0ZW0gPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgIGlmICghJC5pc1BsYWluT2JqZWN0KGl0ZW0pKSB7XG4gICAgICBpdGVtID0ge1xuICAgICAgICBpZDogaXRlbSxcbiAgICAgICAgdGV4dDogaXRlbVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpdGVtID0gJC5leHRlbmQoe30sIHtcbiAgICAgIHRleHQ6ICcnXG4gICAgfSwgaXRlbSk7XG5cbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICBzZWxlY3RlZDogZmFsc2UsXG4gICAgICBkaXNhYmxlZDogZmFsc2VcbiAgICB9O1xuXG4gICAgaWYgKGl0ZW0uaWQgIT0gbnVsbCkge1xuICAgICAgaXRlbS5pZCA9IGl0ZW0uaWQudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBpZiAoaXRlbS50ZXh0ICE9IG51bGwpIHtcbiAgICAgIGl0ZW0udGV4dCA9IGl0ZW0udGV4dC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGlmIChpdGVtLl9yZXN1bHRJZCA9PSBudWxsICYmIGl0ZW0uaWQgJiYgdGhpcy5jb250YWluZXIgIT0gbnVsbCkge1xuICAgICAgaXRlbS5fcmVzdWx0SWQgPSB0aGlzLmdlbmVyYXRlUmVzdWx0SWQodGhpcy5jb250YWluZXIsIGl0ZW0pO1xuICAgIH1cblxuICAgIHJldHVybiAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsIGl0ZW0pO1xuICB9O1xuXG4gIFNlbGVjdEFkYXB0ZXIucHJvdG90eXBlLm1hdGNoZXMgPSBmdW5jdGlvbiAocGFyYW1zLCBkYXRhKSB7XG4gICAgdmFyIG1hdGNoZXIgPSB0aGlzLm9wdGlvbnMuZ2V0KCdtYXRjaGVyJyk7XG5cbiAgICByZXR1cm4gbWF0Y2hlcihwYXJhbXMsIGRhdGEpO1xuICB9O1xuXG4gIHJldHVybiBTZWxlY3RBZGFwdGVyO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9kYXRhL2FycmF5JyxbXG4gICcuL3NlbGVjdCcsXG4gICcuLi91dGlscycsXG4gICdqcXVlcnknXG5dLCBmdW5jdGlvbiAoU2VsZWN0QWRhcHRlciwgVXRpbHMsICQpIHtcbiAgZnVuY3Rpb24gQXJyYXlBZGFwdGVyICgkZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHZhciBkYXRhID0gb3B0aW9ucy5nZXQoJ2RhdGEnKSB8fCBbXTtcblxuICAgIEFycmF5QWRhcHRlci5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCAkZWxlbWVudCwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmFkZE9wdGlvbnModGhpcy5jb252ZXJ0VG9PcHRpb25zKGRhdGEpKTtcbiAgfVxuXG4gIFV0aWxzLkV4dGVuZChBcnJheUFkYXB0ZXIsIFNlbGVjdEFkYXB0ZXIpO1xuXG4gIEFycmF5QWRhcHRlci5wcm90b3R5cGUuc2VsZWN0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgJG9wdGlvbiA9IHRoaXMuJGVsZW1lbnQuZmluZCgnb3B0aW9uJykuZmlsdGVyKGZ1bmN0aW9uIChpLCBlbG0pIHtcbiAgICAgIHJldHVybiBlbG0udmFsdWUgPT0gZGF0YS5pZC50b1N0cmluZygpO1xuICAgIH0pO1xuXG4gICAgaWYgKCRvcHRpb24ubGVuZ3RoID09PSAwKSB7XG4gICAgICAkb3B0aW9uID0gdGhpcy5vcHRpb24oZGF0YSk7XG5cbiAgICAgIHRoaXMuYWRkT3B0aW9ucygkb3B0aW9uKTtcbiAgICB9XG5cbiAgICBBcnJheUFkYXB0ZXIuX19zdXBlcl9fLnNlbGVjdC5jYWxsKHRoaXMsIGRhdGEpO1xuICB9O1xuXG4gIEFycmF5QWRhcHRlci5wcm90b3R5cGUuY29udmVydFRvT3B0aW9ucyA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdmFyICRleGlzdGluZyA9IHRoaXMuJGVsZW1lbnQuZmluZCgnb3B0aW9uJyk7XG4gICAgdmFyIGV4aXN0aW5nSWRzID0gJGV4aXN0aW5nLm1hcChmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gc2VsZi5pdGVtKCQodGhpcykpLmlkO1xuICAgIH0pLmdldCgpO1xuXG4gICAgdmFyICRvcHRpb25zID0gW107XG5cbiAgICAvLyBGaWx0ZXIgb3V0IGFsbCBpdGVtcyBleGNlcHQgZm9yIHRoZSBvbmUgcGFzc2VkIGluIHRoZSBhcmd1bWVudFxuICAgIGZ1bmN0aW9uIG9ubHlJdGVtIChpdGVtKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJCh0aGlzKS52YWwoKSA9PSBpdGVtLmlkO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBkID0gMDsgZCA8IGRhdGEubGVuZ3RoOyBkKyspIHtcbiAgICAgIHZhciBpdGVtID0gdGhpcy5fbm9ybWFsaXplSXRlbShkYXRhW2RdKTtcblxuICAgICAgLy8gU2tpcCBpdGVtcyB3aGljaCB3ZXJlIHByZS1sb2FkZWQsIG9ubHkgbWVyZ2UgdGhlIGRhdGFcbiAgICAgIGlmICgkLmluQXJyYXkoaXRlbS5pZCwgZXhpc3RpbmdJZHMpID49IDApIHtcbiAgICAgICAgdmFyICRleGlzdGluZ09wdGlvbiA9ICRleGlzdGluZy5maWx0ZXIob25seUl0ZW0oaXRlbSkpO1xuXG4gICAgICAgIHZhciBleGlzdGluZ0RhdGEgPSB0aGlzLml0ZW0oJGV4aXN0aW5nT3B0aW9uKTtcbiAgICAgICAgdmFyIG5ld0RhdGEgPSAkLmV4dGVuZCh0cnVlLCB7fSwgaXRlbSwgZXhpc3RpbmdEYXRhKTtcblxuICAgICAgICB2YXIgJG5ld09wdGlvbiA9IHRoaXMub3B0aW9uKG5ld0RhdGEpO1xuXG4gICAgICAgICRleGlzdGluZ09wdGlvbi5yZXBsYWNlV2l0aCgkbmV3T3B0aW9uKTtcblxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdmFyICRvcHRpb24gPSB0aGlzLm9wdGlvbihpdGVtKTtcblxuICAgICAgaWYgKGl0ZW0uY2hpbGRyZW4pIHtcbiAgICAgICAgdmFyICRjaGlsZHJlbiA9IHRoaXMuY29udmVydFRvT3B0aW9ucyhpdGVtLmNoaWxkcmVuKTtcblxuICAgICAgICBVdGlscy5hcHBlbmRNYW55KCRvcHRpb24sICRjaGlsZHJlbik7XG4gICAgICB9XG5cbiAgICAgICRvcHRpb25zLnB1c2goJG9wdGlvbik7XG4gICAgfVxuXG4gICAgcmV0dXJuICRvcHRpb25zO1xuICB9O1xuXG4gIHJldHVybiBBcnJheUFkYXB0ZXI7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2RhdGEvYWpheCcsW1xuICAnLi9hcnJheScsXG4gICcuLi91dGlscycsXG4gICdqcXVlcnknXG5dLCBmdW5jdGlvbiAoQXJyYXlBZGFwdGVyLCBVdGlscywgJCkge1xuICBmdW5jdGlvbiBBamF4QWRhcHRlciAoJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmFqYXhPcHRpb25zID0gdGhpcy5fYXBwbHlEZWZhdWx0cyhvcHRpb25zLmdldCgnYWpheCcpKTtcblxuICAgIGlmICh0aGlzLmFqYXhPcHRpb25zLnByb2Nlc3NSZXN1bHRzICE9IG51bGwpIHtcbiAgICAgIHRoaXMucHJvY2Vzc1Jlc3VsdHMgPSB0aGlzLmFqYXhPcHRpb25zLnByb2Nlc3NSZXN1bHRzO1xuICAgIH1cblxuICAgIEFqYXhBZGFwdGVyLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsICRlbGVtZW50LCBvcHRpb25zKTtcbiAgfVxuXG4gIFV0aWxzLkV4dGVuZChBamF4QWRhcHRlciwgQXJyYXlBZGFwdGVyKTtcblxuICBBamF4QWRhcHRlci5wcm90b3R5cGUuX2FwcGx5RGVmYXVsdHMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgIGRhdGE6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuICQuZXh0ZW5kKHt9LCBwYXJhbXMsIHtcbiAgICAgICAgICBxOiBwYXJhbXMudGVybVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICB0cmFuc3BvcnQ6IGZ1bmN0aW9uIChwYXJhbXMsIHN1Y2Nlc3MsIGZhaWx1cmUpIHtcbiAgICAgICAgdmFyICRyZXF1ZXN0ID0gJC5hamF4KHBhcmFtcyk7XG5cbiAgICAgICAgJHJlcXVlc3QudGhlbihzdWNjZXNzKTtcbiAgICAgICAgJHJlcXVlc3QuZmFpbChmYWlsdXJlKTtcblxuICAgICAgICByZXR1cm4gJHJlcXVlc3Q7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWUpO1xuICB9O1xuXG4gIEFqYXhBZGFwdGVyLnByb3RvdHlwZS5wcm9jZXNzUmVzdWx0cyA9IGZ1bmN0aW9uIChyZXN1bHRzKSB7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgQWpheEFkYXB0ZXIucHJvdG90eXBlLnF1ZXJ5ID0gZnVuY3Rpb24gKHBhcmFtcywgY2FsbGJhY2spIHtcbiAgICB2YXIgbWF0Y2hlcyA9IFtdO1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGlmICh0aGlzLl9yZXF1ZXN0ICE9IG51bGwpIHtcbiAgICAgIC8vIEpTT05QIHJlcXVlc3RzIGNhbm5vdCBhbHdheXMgYmUgYWJvcnRlZFxuICAgICAgaWYgKCQuaXNGdW5jdGlvbih0aGlzLl9yZXF1ZXN0LmFib3J0KSkge1xuICAgICAgICB0aGlzLl9yZXF1ZXN0LmFib3J0KCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3JlcXVlc3QgPSBudWxsO1xuICAgIH1cblxuICAgIHZhciBvcHRpb25zID0gJC5leHRlbmQoe1xuICAgICAgdHlwZTogJ0dFVCdcbiAgICB9LCB0aGlzLmFqYXhPcHRpb25zKTtcblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy51cmwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIG9wdGlvbnMudXJsID0gb3B0aW9ucy51cmwuY2FsbCh0aGlzLiRlbGVtZW50LCBwYXJhbXMpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5kYXRhID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBvcHRpb25zLmRhdGEgPSBvcHRpb25zLmRhdGEuY2FsbCh0aGlzLiRlbGVtZW50LCBwYXJhbXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlcXVlc3QgKCkge1xuICAgICAgdmFyICRyZXF1ZXN0ID0gb3B0aW9ucy50cmFuc3BvcnQob3B0aW9ucywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBzZWxmLnByb2Nlc3NSZXN1bHRzKGRhdGEsIHBhcmFtcyk7XG5cbiAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5nZXQoJ2RlYnVnJykgJiYgd2luZG93LmNvbnNvbGUgJiYgY29uc29sZS5lcnJvcikge1xuICAgICAgICAgIC8vIENoZWNrIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSByZXNwb25zZSBpbmNsdWRlZCBhIGByZXN1bHRzYCBrZXkuXG4gICAgICAgICAgaWYgKCFyZXN1bHRzIHx8ICFyZXN1bHRzLnJlc3VsdHMgfHwgISQuaXNBcnJheShyZXN1bHRzLnJlc3VsdHMpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgICAnU2VsZWN0MjogVGhlIEFKQVggcmVzdWx0cyBkaWQgbm90IHJldHVybiBhbiBhcnJheSBpbiB0aGUgJyArXG4gICAgICAgICAgICAgICdgcmVzdWx0c2Aga2V5IG9mIHRoZSByZXNwb25zZS4nXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNhbGxiYWNrKHJlc3VsdHMpO1xuICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBBdHRlbXB0IHRvIGRldGVjdCBpZiBhIHJlcXVlc3Qgd2FzIGFib3J0ZWRcbiAgICAgICAgLy8gT25seSB3b3JrcyBpZiB0aGUgdHJhbnNwb3J0IGV4cG9zZXMgYSBzdGF0dXMgcHJvcGVydHlcbiAgICAgICAgaWYgKCRyZXF1ZXN0LnN0YXR1cyAmJiAkcmVxdWVzdC5zdGF0dXMgPT09ICcwJykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYudHJpZ2dlcigncmVzdWx0czptZXNzYWdlJywge1xuICAgICAgICAgIG1lc3NhZ2U6ICdlcnJvckxvYWRpbmcnXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHNlbGYuX3JlcXVlc3QgPSAkcmVxdWVzdDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5hamF4T3B0aW9ucy5kZWxheSAmJiBwYXJhbXMudGVybSAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5fcXVlcnlUaW1lb3V0KSB7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy5fcXVlcnlUaW1lb3V0KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fcXVlcnlUaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQocmVxdWVzdCwgdGhpcy5hamF4T3B0aW9ucy5kZWxheSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcXVlc3QoKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIEFqYXhBZGFwdGVyO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9kYXRhL3RhZ3MnLFtcbiAgJ2pxdWVyeSdcbl0sIGZ1bmN0aW9uICgkKSB7XG4gIGZ1bmN0aW9uIFRhZ3MgKGRlY29yYXRlZCwgJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB2YXIgdGFncyA9IG9wdGlvbnMuZ2V0KCd0YWdzJyk7XG5cbiAgICB2YXIgY3JlYXRlVGFnID0gb3B0aW9ucy5nZXQoJ2NyZWF0ZVRhZycpO1xuXG4gICAgaWYgKGNyZWF0ZVRhZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmNyZWF0ZVRhZyA9IGNyZWF0ZVRhZztcbiAgICB9XG5cbiAgICB2YXIgaW5zZXJ0VGFnID0gb3B0aW9ucy5nZXQoJ2luc2VydFRhZycpO1xuXG4gICAgaWYgKGluc2VydFRhZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuaW5zZXJ0VGFnID0gaW5zZXJ0VGFnO1xuICAgIH1cblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsICRlbGVtZW50LCBvcHRpb25zKTtcblxuICAgIGlmICgkLmlzQXJyYXkodGFncykpIHtcbiAgICAgIGZvciAodmFyIHQgPSAwOyB0IDwgdGFncy5sZW5ndGg7IHQrKykge1xuICAgICAgICB2YXIgdGFnID0gdGFnc1t0XTtcbiAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLl9ub3JtYWxpemVJdGVtKHRhZyk7XG5cbiAgICAgICAgdmFyICRvcHRpb24gPSB0aGlzLm9wdGlvbihpdGVtKTtcblxuICAgICAgICB0aGlzLiRlbGVtZW50LmFwcGVuZCgkb3B0aW9uKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBUYWdzLnByb3RvdHlwZS5xdWVyeSA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIHBhcmFtcywgY2FsbGJhY2spIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB0aGlzLl9yZW1vdmVPbGRUYWdzKCk7XG5cbiAgICBpZiAocGFyYW1zLnRlcm0gPT0gbnVsbCB8fCBwYXJhbXMucGFnZSAhPSBudWxsKSB7XG4gICAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBwYXJhbXMsIGNhbGxiYWNrKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB3cmFwcGVyIChvYmosIGNoaWxkKSB7XG4gICAgICB2YXIgZGF0YSA9IG9iai5yZXN1bHRzO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG9wdGlvbiA9IGRhdGFbaV07XG5cbiAgICAgICAgdmFyIGNoZWNrQ2hpbGRyZW4gPSAoXG4gICAgICAgICAgb3B0aW9uLmNoaWxkcmVuICE9IG51bGwgJiZcbiAgICAgICAgICAhd3JhcHBlcih7XG4gICAgICAgICAgICByZXN1bHRzOiBvcHRpb24uY2hpbGRyZW5cbiAgICAgICAgICB9LCB0cnVlKVxuICAgICAgICApO1xuXG4gICAgICAgIHZhciBjaGVja1RleHQgPSBvcHRpb24udGV4dCA9PT0gcGFyYW1zLnRlcm07XG5cbiAgICAgICAgaWYgKGNoZWNrVGV4dCB8fCBjaGVja0NoaWxkcmVuKSB7XG4gICAgICAgICAgaWYgKGNoaWxkKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgb2JqLmRhdGEgPSBkYXRhO1xuICAgICAgICAgIGNhbGxiYWNrKG9iaik7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGNoaWxkKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgdGFnID0gc2VsZi5jcmVhdGVUYWcocGFyYW1zKTtcblxuICAgICAgaWYgKHRhZyAhPSBudWxsKSB7XG4gICAgICAgIHZhciAkb3B0aW9uID0gc2VsZi5vcHRpb24odGFnKTtcbiAgICAgICAgJG9wdGlvbi5hdHRyKCdkYXRhLXNlbGVjdDItdGFnJywgdHJ1ZSk7XG5cbiAgICAgICAgc2VsZi5hZGRPcHRpb25zKFskb3B0aW9uXSk7XG5cbiAgICAgICAgc2VsZi5pbnNlcnRUYWcoZGF0YSwgdGFnKTtcbiAgICAgIH1cblxuICAgICAgb2JqLnJlc3VsdHMgPSBkYXRhO1xuXG4gICAgICBjYWxsYmFjayhvYmopO1xuICAgIH1cblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIHBhcmFtcywgd3JhcHBlcik7XG4gIH07XG5cbiAgVGFncy5wcm90b3R5cGUuY3JlYXRlVGFnID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgcGFyYW1zKSB7XG4gICAgdmFyIHRlcm0gPSAkLnRyaW0ocGFyYW1zLnRlcm0pO1xuXG4gICAgaWYgKHRlcm0gPT09ICcnKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IHRlcm0sXG4gICAgICB0ZXh0OiB0ZXJtXG4gICAgfTtcbiAgfTtcblxuICBUYWdzLnByb3RvdHlwZS5pbnNlcnRUYWcgPSBmdW5jdGlvbiAoXywgZGF0YSwgdGFnKSB7XG4gICAgZGF0YS51bnNoaWZ0KHRhZyk7XG4gIH07XG5cbiAgVGFncy5wcm90b3R5cGUuX3JlbW92ZU9sZFRhZ3MgPSBmdW5jdGlvbiAoXykge1xuICAgIHZhciB0YWcgPSB0aGlzLl9sYXN0VGFnO1xuXG4gICAgdmFyICRvcHRpb25zID0gdGhpcy4kZWxlbWVudC5maW5kKCdvcHRpb25bZGF0YS1zZWxlY3QyLXRhZ10nKTtcblxuICAgICRvcHRpb25zLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAkKHRoaXMpLnJlbW92ZSgpO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBUYWdzO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9kYXRhL3Rva2VuaXplcicsW1xuICAnanF1ZXJ5J1xuXSwgZnVuY3Rpb24gKCQpIHtcbiAgZnVuY3Rpb24gVG9rZW5pemVyIChkZWNvcmF0ZWQsICRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdmFyIHRva2VuaXplciA9IG9wdGlvbnMuZ2V0KCd0b2tlbml6ZXInKTtcblxuICAgIGlmICh0b2tlbml6ZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy50b2tlbml6ZXIgPSB0b2tlbml6ZXI7XG4gICAgfVxuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgJGVsZW1lbnQsIG9wdGlvbnMpO1xuICB9XG5cbiAgVG9rZW5pemVyLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgY29udGFpbmVyLCAkY29udGFpbmVyKSB7XG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgY29udGFpbmVyLCAkY29udGFpbmVyKTtcblxuICAgIHRoaXMuJHNlYXJjaCA9ICBjb250YWluZXIuZHJvcGRvd24uJHNlYXJjaCB8fCBjb250YWluZXIuc2VsZWN0aW9uLiRzZWFyY2ggfHxcbiAgICAgICRjb250YWluZXIuZmluZCgnLnNlbGVjdDItc2VhcmNoX19maWVsZCcpO1xuICB9O1xuXG4gIFRva2VuaXplci5wcm90b3R5cGUucXVlcnkgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBwYXJhbXMsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlQW5kU2VsZWN0IChkYXRhKSB7XG4gICAgICAvLyBOb3JtYWxpemUgdGhlIGRhdGEgb2JqZWN0IHNvIHdlIGNhbiB1c2UgaXQgZm9yIGNoZWNrc1xuICAgICAgdmFyIGl0ZW0gPSBzZWxmLl9ub3JtYWxpemVJdGVtKGRhdGEpO1xuXG4gICAgICAvLyBDaGVjayBpZiB0aGUgZGF0YSBvYmplY3QgYWxyZWFkeSBleGlzdHMgYXMgYSB0YWdcbiAgICAgIC8vIFNlbGVjdCBpdCBpZiBpdCBkb2Vzbid0XG4gICAgICB2YXIgJGV4aXN0aW5nT3B0aW9ucyA9IHNlbGYuJGVsZW1lbnQuZmluZCgnb3B0aW9uJykuZmlsdGVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICQodGhpcykudmFsKCkgPT09IGl0ZW0uaWQ7XG4gICAgICB9KTtcblxuICAgICAgLy8gSWYgYW4gZXhpc3Rpbmcgb3B0aW9uIHdhc24ndCBmb3VuZCBmb3IgaXQsIGNyZWF0ZSB0aGUgb3B0aW9uXG4gICAgICBpZiAoISRleGlzdGluZ09wdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgIHZhciAkb3B0aW9uID0gc2VsZi5vcHRpb24oaXRlbSk7XG4gICAgICAgICRvcHRpb24uYXR0cignZGF0YS1zZWxlY3QyLXRhZycsIHRydWUpO1xuXG4gICAgICAgIHNlbGYuX3JlbW92ZU9sZFRhZ3MoKTtcbiAgICAgICAgc2VsZi5hZGRPcHRpb25zKFskb3B0aW9uXSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFNlbGVjdCB0aGUgaXRlbSwgbm93IHRoYXQgd2Uga25vdyB0aGVyZSBpcyBhbiBvcHRpb24gZm9yIGl0XG4gICAgICBzZWxlY3QoaXRlbSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2VsZWN0IChkYXRhKSB7XG4gICAgICBzZWxmLnRyaWdnZXIoJ3NlbGVjdCcsIHtcbiAgICAgICAgZGF0YTogZGF0YVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcGFyYW1zLnRlcm0gPSBwYXJhbXMudGVybSB8fCAnJztcblxuICAgIHZhciB0b2tlbkRhdGEgPSB0aGlzLnRva2VuaXplcihwYXJhbXMsIHRoaXMub3B0aW9ucywgY3JlYXRlQW5kU2VsZWN0KTtcblxuICAgIGlmICh0b2tlbkRhdGEudGVybSAhPT0gcGFyYW1zLnRlcm0pIHtcbiAgICAgIC8vIFJlcGxhY2UgdGhlIHNlYXJjaCB0ZXJtIGlmIHdlIGhhdmUgdGhlIHNlYXJjaCBib3hcbiAgICAgIGlmICh0aGlzLiRzZWFyY2gubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuJHNlYXJjaC52YWwodG9rZW5EYXRhLnRlcm0pO1xuICAgICAgICB0aGlzLiRzZWFyY2guZm9jdXMoKTtcbiAgICAgIH1cblxuICAgICAgcGFyYW1zLnRlcm0gPSB0b2tlbkRhdGEudGVybTtcbiAgICB9XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBwYXJhbXMsIGNhbGxiYWNrKTtcbiAgfTtcblxuICBUb2tlbml6ZXIucHJvdG90eXBlLnRva2VuaXplciA9IGZ1bmN0aW9uIChfLCBwYXJhbXMsIG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHNlcGFyYXRvcnMgPSBvcHRpb25zLmdldCgndG9rZW5TZXBhcmF0b3JzJykgfHwgW107XG4gICAgdmFyIHRlcm0gPSBwYXJhbXMudGVybTtcbiAgICB2YXIgaSA9IDA7XG5cbiAgICB2YXIgY3JlYXRlVGFnID0gdGhpcy5jcmVhdGVUYWcgfHwgZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IHBhcmFtcy50ZXJtLFxuICAgICAgICB0ZXh0OiBwYXJhbXMudGVybVxuICAgICAgfTtcbiAgICB9O1xuXG4gICAgd2hpbGUgKGkgPCB0ZXJtLmxlbmd0aCkge1xuICAgICAgdmFyIHRlcm1DaGFyID0gdGVybVtpXTtcblxuICAgICAgaWYgKCQuaW5BcnJheSh0ZXJtQ2hhciwgc2VwYXJhdG9ycykgPT09IC0xKSB7XG4gICAgICAgIGkrKztcblxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIHBhcnQgPSB0ZXJtLnN1YnN0cigwLCBpKTtcbiAgICAgIHZhciBwYXJ0UGFyYW1zID0gJC5leHRlbmQoe30sIHBhcmFtcywge1xuICAgICAgICB0ZXJtOiBwYXJ0XG4gICAgICB9KTtcblxuICAgICAgdmFyIGRhdGEgPSBjcmVhdGVUYWcocGFydFBhcmFtcyk7XG5cbiAgICAgIGlmIChkYXRhID09IG51bGwpIHtcbiAgICAgICAgaSsrO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY2FsbGJhY2soZGF0YSk7XG5cbiAgICAgIC8vIFJlc2V0IHRoZSB0ZXJtIHRvIG5vdCBpbmNsdWRlIHRoZSB0b2tlbml6ZWQgcG9ydGlvblxuICAgICAgdGVybSA9IHRlcm0uc3Vic3RyKGkgKyAxKSB8fCAnJztcbiAgICAgIGkgPSAwO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB0ZXJtOiB0ZXJtXG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4gVG9rZW5pemVyO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9kYXRhL21pbmltdW1JbnB1dExlbmd0aCcsW1xuXG5dLCBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIE1pbmltdW1JbnB1dExlbmd0aCAoZGVjb3JhdGVkLCAkZSwgb3B0aW9ucykge1xuICAgIHRoaXMubWluaW11bUlucHV0TGVuZ3RoID0gb3B0aW9ucy5nZXQoJ21pbmltdW1JbnB1dExlbmd0aCcpO1xuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgJGUsIG9wdGlvbnMpO1xuICB9XG5cbiAgTWluaW11bUlucHV0TGVuZ3RoLnByb3RvdHlwZS5xdWVyeSA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIHBhcmFtcywgY2FsbGJhY2spIHtcbiAgICBwYXJhbXMudGVybSA9IHBhcmFtcy50ZXJtIHx8ICcnO1xuXG4gICAgaWYgKHBhcmFtcy50ZXJtLmxlbmd0aCA8IHRoaXMubWluaW11bUlucHV0TGVuZ3RoKSB7XG4gICAgICB0aGlzLnRyaWdnZXIoJ3Jlc3VsdHM6bWVzc2FnZScsIHtcbiAgICAgICAgbWVzc2FnZTogJ2lucHV0VG9vU2hvcnQnLFxuICAgICAgICBhcmdzOiB7XG4gICAgICAgICAgbWluaW11bTogdGhpcy5taW5pbXVtSW5wdXRMZW5ndGgsXG4gICAgICAgICAgaW5wdXQ6IHBhcmFtcy50ZXJtLFxuICAgICAgICAgIHBhcmFtczogcGFyYW1zXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgcGFyYW1zLCBjYWxsYmFjayk7XG4gIH07XG5cbiAgcmV0dXJuIE1pbmltdW1JbnB1dExlbmd0aDtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZGF0YS9tYXhpbXVtSW5wdXRMZW5ndGgnLFtcblxuXSwgZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBNYXhpbXVtSW5wdXRMZW5ndGggKGRlY29yYXRlZCwgJGUsIG9wdGlvbnMpIHtcbiAgICB0aGlzLm1heGltdW1JbnB1dExlbmd0aCA9IG9wdGlvbnMuZ2V0KCdtYXhpbXVtSW5wdXRMZW5ndGgnKTtcblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsICRlLCBvcHRpb25zKTtcbiAgfVxuXG4gIE1heGltdW1JbnB1dExlbmd0aC5wcm90b3R5cGUucXVlcnkgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBwYXJhbXMsIGNhbGxiYWNrKSB7XG4gICAgcGFyYW1zLnRlcm0gPSBwYXJhbXMudGVybSB8fCAnJztcblxuICAgIGlmICh0aGlzLm1heGltdW1JbnB1dExlbmd0aCA+IDAgJiZcbiAgICAgICAgcGFyYW1zLnRlcm0ubGVuZ3RoID4gdGhpcy5tYXhpbXVtSW5wdXRMZW5ndGgpIHtcbiAgICAgIHRoaXMudHJpZ2dlcigncmVzdWx0czptZXNzYWdlJywge1xuICAgICAgICBtZXNzYWdlOiAnaW5wdXRUb29Mb25nJyxcbiAgICAgICAgYXJnczoge1xuICAgICAgICAgIG1heGltdW06IHRoaXMubWF4aW11bUlucHV0TGVuZ3RoLFxuICAgICAgICAgIGlucHV0OiBwYXJhbXMudGVybSxcbiAgICAgICAgICBwYXJhbXM6IHBhcmFtc1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIHBhcmFtcywgY2FsbGJhY2spO1xuICB9O1xuXG4gIHJldHVybiBNYXhpbXVtSW5wdXRMZW5ndGg7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2RhdGEvbWF4aW11bVNlbGVjdGlvbkxlbmd0aCcsW1xuXG5dLCBmdW5jdGlvbiAoKXtcbiAgZnVuY3Rpb24gTWF4aW11bVNlbGVjdGlvbkxlbmd0aCAoZGVjb3JhdGVkLCAkZSwgb3B0aW9ucykge1xuICAgIHRoaXMubWF4aW11bVNlbGVjdGlvbkxlbmd0aCA9IG9wdGlvbnMuZ2V0KCdtYXhpbXVtU2VsZWN0aW9uTGVuZ3RoJyk7XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCAkZSwgb3B0aW9ucyk7XG4gIH1cblxuICBNYXhpbXVtU2VsZWN0aW9uTGVuZ3RoLnByb3RvdHlwZS5xdWVyeSA9XG4gICAgZnVuY3Rpb24gKGRlY29yYXRlZCwgcGFyYW1zLCBjYWxsYmFjaykge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICB0aGlzLmN1cnJlbnQoZnVuY3Rpb24gKGN1cnJlbnREYXRhKSB7XG4gICAgICAgIHZhciBjb3VudCA9IGN1cnJlbnREYXRhICE9IG51bGwgPyBjdXJyZW50RGF0YS5sZW5ndGggOiAwO1xuICAgICAgICBpZiAoc2VsZi5tYXhpbXVtU2VsZWN0aW9uTGVuZ3RoID4gMCAmJlxuICAgICAgICAgIGNvdW50ID49IHNlbGYubWF4aW11bVNlbGVjdGlvbkxlbmd0aCkge1xuICAgICAgICAgIHNlbGYudHJpZ2dlcigncmVzdWx0czptZXNzYWdlJywge1xuICAgICAgICAgICAgbWVzc2FnZTogJ21heGltdW1TZWxlY3RlZCcsXG4gICAgICAgICAgICBhcmdzOiB7XG4gICAgICAgICAgICAgIG1heGltdW06IHNlbGYubWF4aW11bVNlbGVjdGlvbkxlbmd0aFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkZWNvcmF0ZWQuY2FsbChzZWxmLCBwYXJhbXMsIGNhbGxiYWNrKTtcbiAgICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBNYXhpbXVtU2VsZWN0aW9uTGVuZ3RoO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9kcm9wZG93bicsW1xuICAnanF1ZXJ5JyxcbiAgJy4vdXRpbHMnXG5dLCBmdW5jdGlvbiAoJCwgVXRpbHMpIHtcbiAgZnVuY3Rpb24gRHJvcGRvd24gKCRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy4kZWxlbWVudCA9ICRlbGVtZW50O1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICBEcm9wZG93bi5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzKTtcbiAgfVxuXG4gIFV0aWxzLkV4dGVuZChEcm9wZG93biwgVXRpbHMuT2JzZXJ2YWJsZSk7XG5cbiAgRHJvcGRvd24ucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJGRyb3Bkb3duID0gJChcbiAgICAgICc8c3BhbiBjbGFzcz1cInNlbGVjdDItZHJvcGRvd25cIj4nICtcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwic2VsZWN0Mi1yZXN1bHRzXCI+PC9zcGFuPicgK1xuICAgICAgJzwvc3Bhbj4nXG4gICAgKTtcblxuICAgICRkcm9wZG93bi5hdHRyKCdkaXInLCB0aGlzLm9wdGlvbnMuZ2V0KCdkaXInKSk7XG5cbiAgICB0aGlzLiRkcm9wZG93biA9ICRkcm9wZG93bjtcblxuICAgIHJldHVybiAkZHJvcGRvd247XG4gIH07XG5cbiAgRHJvcGRvd24ucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gU2hvdWxkIGJlIGltcGxlbWVudGVkIGluIHN1YmNsYXNzZXNcbiAgfTtcblxuICBEcm9wZG93bi5wcm90b3R5cGUucG9zaXRpb24gPSBmdW5jdGlvbiAoJGRyb3Bkb3duLCAkY29udGFpbmVyKSB7XG4gICAgLy8gU2hvdWxkIGJlIGltcGxtZW50ZWQgaW4gc3ViY2xhc3Nlc1xuICB9O1xuXG4gIERyb3Bkb3duLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIFJlbW92ZSB0aGUgZHJvcGRvd24gZnJvbSB0aGUgRE9NXG4gICAgdGhpcy4kZHJvcGRvd24ucmVtb3ZlKCk7XG4gIH07XG5cbiAgcmV0dXJuIERyb3Bkb3duO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9kcm9wZG93bi9zZWFyY2gnLFtcbiAgJ2pxdWVyeScsXG4gICcuLi91dGlscydcbl0sIGZ1bmN0aW9uICgkLCBVdGlscykge1xuICBmdW5jdGlvbiBTZWFyY2ggKCkgeyB9XG5cbiAgU2VhcmNoLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoZGVjb3JhdGVkKSB7XG4gICAgdmFyICRyZW5kZXJlZCA9IGRlY29yYXRlZC5jYWxsKHRoaXMpO1xuXG4gICAgdmFyICRzZWFyY2ggPSAkKFxuICAgICAgJzxzcGFuIGNsYXNzPVwic2VsZWN0Mi1zZWFyY2ggc2VsZWN0Mi1zZWFyY2gtLWRyb3Bkb3duXCI+JyArXG4gICAgICAgICc8aW5wdXQgY2xhc3M9XCJzZWxlY3QyLXNlYXJjaF9fZmllbGRcIiB0eXBlPVwic2VhcmNoXCIgdGFiaW5kZXg9XCItMVwiJyArXG4gICAgICAgICcgYXV0b2NvbXBsZXRlPVwib2ZmXCIgYXV0b2NvcnJlY3Q9XCJvZmZcIiBhdXRvY2FwaXRhbGl6ZT1cIm9mZlwiJyArXG4gICAgICAgICcgc3BlbGxjaGVjaz1cImZhbHNlXCIgcm9sZT1cInRleHRib3hcIiAvPicgK1xuICAgICAgJzwvc3Bhbj4nXG4gICAgKTtcblxuICAgIHRoaXMuJHNlYXJjaENvbnRhaW5lciA9ICRzZWFyY2g7XG4gICAgdGhpcy4kc2VhcmNoID0gJHNlYXJjaC5maW5kKCdpbnB1dCcpO1xuXG4gICAgJHJlbmRlcmVkLnByZXBlbmQoJHNlYXJjaCk7XG5cbiAgICByZXR1cm4gJHJlbmRlcmVkO1xuICB9O1xuXG4gIFNlYXJjaC5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGNvbnRhaW5lciwgJGNvbnRhaW5lcik7XG5cbiAgICB0aGlzLiRzZWFyY2gub24oJ2tleWRvd24nLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBzZWxmLnRyaWdnZXIoJ2tleXByZXNzJywgZXZ0KTtcblxuICAgICAgc2VsZi5fa2V5VXBQcmV2ZW50ZWQgPSBldnQuaXNEZWZhdWx0UHJldmVudGVkKCk7XG4gICAgfSk7XG5cbiAgICAvLyBXb3JrYXJvdW5kIGZvciBicm93c2VycyB3aGljaCBkbyBub3Qgc3VwcG9ydCB0aGUgYGlucHV0YCBldmVudFxuICAgIC8vIFRoaXMgd2lsbCBwcmV2ZW50IGRvdWJsZS10cmlnZ2VyaW5nIG9mIGV2ZW50cyBmb3IgYnJvd3NlcnMgd2hpY2ggc3VwcG9ydFxuICAgIC8vIGJvdGggdGhlIGBrZXl1cGAgYW5kIGBpbnB1dGAgZXZlbnRzLlxuICAgIHRoaXMuJHNlYXJjaC5vbignaW5wdXQnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAvLyBVbmJpbmQgdGhlIGR1cGxpY2F0ZWQgYGtleXVwYCBldmVudFxuICAgICAgJCh0aGlzKS5vZmYoJ2tleXVwJyk7XG4gICAgfSk7XG5cbiAgICB0aGlzLiRzZWFyY2gub24oJ2tleXVwIGlucHV0JywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgc2VsZi5oYW5kbGVTZWFyY2goZXZ0KTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbignb3BlbicsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuJHNlYXJjaC5hdHRyKCd0YWJpbmRleCcsIDApO1xuXG4gICAgICBzZWxmLiRzZWFyY2guZm9jdXMoKTtcblxuICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBzZWxmLiRzZWFyY2guZm9jdXMoKTtcbiAgICAgIH0sIDApO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdjbG9zZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuJHNlYXJjaC5hdHRyKCd0YWJpbmRleCcsIC0xKTtcblxuICAgICAgc2VsZi4kc2VhcmNoLnZhbCgnJyk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ2ZvY3VzJywgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGNvbnRhaW5lci5pc09wZW4oKSkge1xuICAgICAgICBzZWxmLiRzZWFyY2guZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbigncmVzdWx0czphbGwnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICBpZiAocGFyYW1zLnF1ZXJ5LnRlcm0gPT0gbnVsbCB8fCBwYXJhbXMucXVlcnkudGVybSA9PT0gJycpIHtcbiAgICAgICAgdmFyIHNob3dTZWFyY2ggPSBzZWxmLnNob3dTZWFyY2gocGFyYW1zKTtcblxuICAgICAgICBpZiAoc2hvd1NlYXJjaCkge1xuICAgICAgICAgIHNlbGYuJHNlYXJjaENvbnRhaW5lci5yZW1vdmVDbGFzcygnc2VsZWN0Mi1zZWFyY2gtLWhpZGUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxmLiRzZWFyY2hDb250YWluZXIuYWRkQ2xhc3MoJ3NlbGVjdDItc2VhcmNoLS1oaWRlJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBTZWFyY2gucHJvdG90eXBlLmhhbmRsZVNlYXJjaCA9IGZ1bmN0aW9uIChldnQpIHtcbiAgICBpZiAoIXRoaXMuX2tleVVwUHJldmVudGVkKSB7XG4gICAgICB2YXIgaW5wdXQgPSB0aGlzLiRzZWFyY2gudmFsKCk7XG5cbiAgICAgIHRoaXMudHJpZ2dlcigncXVlcnknLCB7XG4gICAgICAgIHRlcm06IGlucHV0XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLl9rZXlVcFByZXZlbnRlZCA9IGZhbHNlO1xuICB9O1xuXG4gIFNlYXJjaC5wcm90b3R5cGUuc2hvd1NlYXJjaCA9IGZ1bmN0aW9uIChfLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICByZXR1cm4gU2VhcmNoO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9kcm9wZG93bi9oaWRlUGxhY2Vob2xkZXInLFtcblxuXSwgZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBIaWRlUGxhY2Vob2xkZXIgKGRlY29yYXRlZCwgJGVsZW1lbnQsIG9wdGlvbnMsIGRhdGFBZGFwdGVyKSB7XG4gICAgdGhpcy5wbGFjZWhvbGRlciA9IHRoaXMubm9ybWFsaXplUGxhY2Vob2xkZXIob3B0aW9ucy5nZXQoJ3BsYWNlaG9sZGVyJykpO1xuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgJGVsZW1lbnQsIG9wdGlvbnMsIGRhdGFBZGFwdGVyKTtcbiAgfVxuXG4gIEhpZGVQbGFjZWhvbGRlci5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgZGF0YSkge1xuICAgIGRhdGEucmVzdWx0cyA9IHRoaXMucmVtb3ZlUGxhY2Vob2xkZXIoZGF0YS5yZXN1bHRzKTtcblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGRhdGEpO1xuICB9O1xuXG4gIEhpZGVQbGFjZWhvbGRlci5wcm90b3R5cGUubm9ybWFsaXplUGxhY2Vob2xkZXIgPSBmdW5jdGlvbiAoXywgcGxhY2Vob2xkZXIpIHtcbiAgICBpZiAodHlwZW9mIHBsYWNlaG9sZGVyID09PSAnc3RyaW5nJykge1xuICAgICAgcGxhY2Vob2xkZXIgPSB7XG4gICAgICAgIGlkOiAnJyxcbiAgICAgICAgdGV4dDogcGxhY2Vob2xkZXJcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHBsYWNlaG9sZGVyO1xuICB9O1xuXG4gIEhpZGVQbGFjZWhvbGRlci5wcm90b3R5cGUucmVtb3ZlUGxhY2Vob2xkZXIgPSBmdW5jdGlvbiAoXywgZGF0YSkge1xuICAgIHZhciBtb2RpZmllZERhdGEgPSBkYXRhLnNsaWNlKDApO1xuXG4gICAgZm9yICh2YXIgZCA9IGRhdGEubGVuZ3RoIC0gMTsgZCA+PSAwOyBkLS0pIHtcbiAgICAgIHZhciBpdGVtID0gZGF0YVtkXTtcblxuICAgICAgaWYgKHRoaXMucGxhY2Vob2xkZXIuaWQgPT09IGl0ZW0uaWQpIHtcbiAgICAgICAgbW9kaWZpZWREYXRhLnNwbGljZShkLCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbW9kaWZpZWREYXRhO1xuICB9O1xuXG4gIHJldHVybiBIaWRlUGxhY2Vob2xkZXI7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2Ryb3Bkb3duL2luZmluaXRlU2Nyb2xsJyxbXG4gICdqcXVlcnknXG5dLCBmdW5jdGlvbiAoJCkge1xuICBmdW5jdGlvbiBJbmZpbml0ZVNjcm9sbCAoZGVjb3JhdGVkLCAkZWxlbWVudCwgb3B0aW9ucywgZGF0YUFkYXB0ZXIpIHtcbiAgICB0aGlzLmxhc3RQYXJhbXMgPSB7fTtcblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsICRlbGVtZW50LCBvcHRpb25zLCBkYXRhQWRhcHRlcik7XG5cbiAgICB0aGlzLiRsb2FkaW5nTW9yZSA9IHRoaXMuY3JlYXRlTG9hZGluZ01vcmUoKTtcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIEluZmluaXRlU2Nyb2xsLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBkYXRhKSB7XG4gICAgdGhpcy4kbG9hZGluZ01vcmUucmVtb3ZlKCk7XG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBkYXRhKTtcblxuICAgIGlmICh0aGlzLnNob3dMb2FkaW5nTW9yZShkYXRhKSkge1xuICAgICAgdGhpcy4kcmVzdWx0cy5hcHBlbmQodGhpcy4kbG9hZGluZ01vcmUpO1xuICAgIH1cbiAgfTtcblxuICBJbmZpbml0ZVNjcm9sbC5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGNvbnRhaW5lciwgJGNvbnRhaW5lcik7XG5cbiAgICBjb250YWluZXIub24oJ3F1ZXJ5JywgZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgc2VsZi5sYXN0UGFyYW1zID0gcGFyYW1zO1xuICAgICAgc2VsZi5sb2FkaW5nID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbigncXVlcnk6YXBwZW5kJywgZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgc2VsZi5sYXN0UGFyYW1zID0gcGFyYW1zO1xuICAgICAgc2VsZi5sb2FkaW5nID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIHRoaXMuJHJlc3VsdHMub24oJ3Njcm9sbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBpc0xvYWRNb3JlVmlzaWJsZSA9ICQuY29udGFpbnMoXG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcbiAgICAgICAgc2VsZi4kbG9hZGluZ01vcmVbMF1cbiAgICAgICk7XG5cbiAgICAgIGlmIChzZWxmLmxvYWRpbmcgfHwgIWlzTG9hZE1vcmVWaXNpYmxlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIGN1cnJlbnRPZmZzZXQgPSBzZWxmLiRyZXN1bHRzLm9mZnNldCgpLnRvcCArXG4gICAgICAgIHNlbGYuJHJlc3VsdHMub3V0ZXJIZWlnaHQoZmFsc2UpO1xuICAgICAgdmFyIGxvYWRpbmdNb3JlT2Zmc2V0ID0gc2VsZi4kbG9hZGluZ01vcmUub2Zmc2V0KCkudG9wICtcbiAgICAgICAgc2VsZi4kbG9hZGluZ01vcmUub3V0ZXJIZWlnaHQoZmFsc2UpO1xuXG4gICAgICBpZiAoY3VycmVudE9mZnNldCArIDUwID49IGxvYWRpbmdNb3JlT2Zmc2V0KSB7XG4gICAgICAgIHNlbGYubG9hZE1vcmUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBJbmZpbml0ZVNjcm9sbC5wcm90b3R5cGUubG9hZE1vcmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcblxuICAgIHZhciBwYXJhbXMgPSAkLmV4dGVuZCh7fSwge3BhZ2U6IDF9LCB0aGlzLmxhc3RQYXJhbXMpO1xuXG4gICAgcGFyYW1zLnBhZ2UrKztcblxuICAgIHRoaXMudHJpZ2dlcigncXVlcnk6YXBwZW5kJywgcGFyYW1zKTtcbiAgfTtcblxuICBJbmZpbml0ZVNjcm9sbC5wcm90b3R5cGUuc2hvd0xvYWRpbmdNb3JlID0gZnVuY3Rpb24gKF8sIGRhdGEpIHtcbiAgICByZXR1cm4gZGF0YS5wYWdpbmF0aW9uICYmIGRhdGEucGFnaW5hdGlvbi5tb3JlO1xuICB9O1xuXG4gIEluZmluaXRlU2Nyb2xsLnByb3RvdHlwZS5jcmVhdGVMb2FkaW5nTW9yZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJG9wdGlvbiA9ICQoXG4gICAgICAnPGxpICcgK1xuICAgICAgJ2NsYXNzPVwic2VsZWN0Mi1yZXN1bHRzX19vcHRpb24gc2VsZWN0Mi1yZXN1bHRzX19vcHRpb24tLWxvYWQtbW9yZVwiJyArXG4gICAgICAncm9sZT1cInRyZWVpdGVtXCIgYXJpYS1kaXNhYmxlZD1cInRydWVcIj48L2xpPidcbiAgICApO1xuXG4gICAgdmFyIG1lc3NhZ2UgPSB0aGlzLm9wdGlvbnMuZ2V0KCd0cmFuc2xhdGlvbnMnKS5nZXQoJ2xvYWRpbmdNb3JlJyk7XG5cbiAgICAkb3B0aW9uLmh0bWwobWVzc2FnZSh0aGlzLmxhc3RQYXJhbXMpKTtcblxuICAgIHJldHVybiAkb3B0aW9uO1xuICB9O1xuXG4gIHJldHVybiBJbmZpbml0ZVNjcm9sbDtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZHJvcGRvd24vYXR0YWNoQm9keScsW1xuICAnanF1ZXJ5JyxcbiAgJy4uL3V0aWxzJ1xuXSwgZnVuY3Rpb24gKCQsIFV0aWxzKSB7XG4gIGZ1bmN0aW9uIEF0dGFjaEJvZHkgKGRlY29yYXRlZCwgJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRkcm9wZG93blBhcmVudCA9IG9wdGlvbnMuZ2V0KCdkcm9wZG93blBhcmVudCcpIHx8ICQoZG9jdW1lbnQuYm9keSk7XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCAkZWxlbWVudCwgb3B0aW9ucyk7XG4gIH1cblxuICBBdHRhY2hCb2R5LnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgY29udGFpbmVyLCAkY29udGFpbmVyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdmFyIHNldHVwUmVzdWx0c0V2ZW50cyA9IGZhbHNlO1xuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgY29udGFpbmVyLCAkY29udGFpbmVyKTtcblxuICAgIGNvbnRhaW5lci5vbignb3BlbicsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX3Nob3dEcm9wZG93bigpO1xuICAgICAgc2VsZi5fYXR0YWNoUG9zaXRpb25pbmdIYW5kbGVyKGNvbnRhaW5lcik7XG5cbiAgICAgIGlmICghc2V0dXBSZXN1bHRzRXZlbnRzKSB7XG4gICAgICAgIHNldHVwUmVzdWx0c0V2ZW50cyA9IHRydWU7XG5cbiAgICAgICAgY29udGFpbmVyLm9uKCdyZXN1bHRzOmFsbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLl9wb3NpdGlvbkRyb3Bkb3duKCk7XG4gICAgICAgICAgc2VsZi5fcmVzaXplRHJvcGRvd24oKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29udGFpbmVyLm9uKCdyZXN1bHRzOmFwcGVuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLl9wb3NpdGlvbkRyb3Bkb3duKCk7XG4gICAgICAgICAgc2VsZi5fcmVzaXplRHJvcGRvd24oKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ2Nsb3NlJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5faGlkZURyb3Bkb3duKCk7XG4gICAgICBzZWxmLl9kZXRhY2hQb3NpdGlvbmluZ0hhbmRsZXIoY29udGFpbmVyKTtcbiAgICB9KTtcblxuICAgIHRoaXMuJGRyb3Bkb3duQ29udGFpbmVyLm9uKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSk7XG4gIH07XG5cbiAgQXR0YWNoQm9keS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQpIHtcbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMuJGRyb3Bkb3duQ29udGFpbmVyLnJlbW92ZSgpO1xuICB9O1xuXG4gIEF0dGFjaEJvZHkucHJvdG90eXBlLnBvc2l0aW9uID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgJGRyb3Bkb3duLCAkY29udGFpbmVyKSB7XG4gICAgLy8gQ2xvbmUgYWxsIG9mIHRoZSBjb250YWluZXIgY2xhc3Nlc1xuICAgICRkcm9wZG93bi5hdHRyKCdjbGFzcycsICRjb250YWluZXIuYXR0cignY2xhc3MnKSk7XG5cbiAgICAkZHJvcGRvd24ucmVtb3ZlQ2xhc3MoJ3NlbGVjdDInKTtcbiAgICAkZHJvcGRvd24uYWRkQ2xhc3MoJ3NlbGVjdDItY29udGFpbmVyLS1vcGVuJyk7XG5cbiAgICAkZHJvcGRvd24uY3NzKHtcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgdG9wOiAtOTk5OTk5XG4gICAgfSk7XG5cbiAgICB0aGlzLiRjb250YWluZXIgPSAkY29udGFpbmVyO1xuICB9O1xuXG4gIEF0dGFjaEJvZHkucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQpIHtcbiAgICB2YXIgJGNvbnRhaW5lciA9ICQoJzxzcGFuPjwvc3Bhbj4nKTtcblxuICAgIHZhciAkZHJvcGRvd24gPSBkZWNvcmF0ZWQuY2FsbCh0aGlzKTtcbiAgICAkY29udGFpbmVyLmFwcGVuZCgkZHJvcGRvd24pO1xuXG4gICAgdGhpcy4kZHJvcGRvd25Db250YWluZXIgPSAkY29udGFpbmVyO1xuXG4gICAgcmV0dXJuICRjb250YWluZXI7XG4gIH07XG5cbiAgQXR0YWNoQm9keS5wcm90b3R5cGUuX2hpZGVEcm9wZG93biA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQpIHtcbiAgICB0aGlzLiRkcm9wZG93bkNvbnRhaW5lci5kZXRhY2goKTtcbiAgfTtcblxuICBBdHRhY2hCb2R5LnByb3RvdHlwZS5fYXR0YWNoUG9zaXRpb25pbmdIYW5kbGVyID1cbiAgICAgIGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGNvbnRhaW5lcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHZhciBzY3JvbGxFdmVudCA9ICdzY3JvbGwuc2VsZWN0Mi4nICsgY29udGFpbmVyLmlkO1xuICAgIHZhciByZXNpemVFdmVudCA9ICdyZXNpemUuc2VsZWN0Mi4nICsgY29udGFpbmVyLmlkO1xuICAgIHZhciBvcmllbnRhdGlvbkV2ZW50ID0gJ29yaWVudGF0aW9uY2hhbmdlLnNlbGVjdDIuJyArIGNvbnRhaW5lci5pZDtcblxuICAgIHZhciAkd2F0Y2hlcnMgPSB0aGlzLiRjb250YWluZXIucGFyZW50cygpLmZpbHRlcihVdGlscy5oYXNTY3JvbGwpO1xuICAgICR3YXRjaGVycy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICQodGhpcykuZGF0YSgnc2VsZWN0Mi1zY3JvbGwtcG9zaXRpb24nLCB7XG4gICAgICAgIHg6ICQodGhpcykuc2Nyb2xsTGVmdCgpLFxuICAgICAgICB5OiAkKHRoaXMpLnNjcm9sbFRvcCgpXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgICR3YXRjaGVycy5vbihzY3JvbGxFdmVudCwgZnVuY3Rpb24gKGV2KSB7XG4gICAgICB2YXIgcG9zaXRpb24gPSAkKHRoaXMpLmRhdGEoJ3NlbGVjdDItc2Nyb2xsLXBvc2l0aW9uJyk7XG4gICAgICAkKHRoaXMpLnNjcm9sbFRvcChwb3NpdGlvbi55KTtcbiAgICB9KTtcblxuICAgICQod2luZG93KS5vbihzY3JvbGxFdmVudCArICcgJyArIHJlc2l6ZUV2ZW50ICsgJyAnICsgb3JpZW50YXRpb25FdmVudCxcbiAgICAgIGZ1bmN0aW9uIChlKSB7XG4gICAgICBzZWxmLl9wb3NpdGlvbkRyb3Bkb3duKCk7XG4gICAgICBzZWxmLl9yZXNpemVEcm9wZG93bigpO1xuICAgIH0pO1xuICB9O1xuXG4gIEF0dGFjaEJvZHkucHJvdG90eXBlLl9kZXRhY2hQb3NpdGlvbmluZ0hhbmRsZXIgPVxuICAgICAgZnVuY3Rpb24gKGRlY29yYXRlZCwgY29udGFpbmVyKSB7XG4gICAgdmFyIHNjcm9sbEV2ZW50ID0gJ3Njcm9sbC5zZWxlY3QyLicgKyBjb250YWluZXIuaWQ7XG4gICAgdmFyIHJlc2l6ZUV2ZW50ID0gJ3Jlc2l6ZS5zZWxlY3QyLicgKyBjb250YWluZXIuaWQ7XG4gICAgdmFyIG9yaWVudGF0aW9uRXZlbnQgPSAnb3JpZW50YXRpb25jaGFuZ2Uuc2VsZWN0Mi4nICsgY29udGFpbmVyLmlkO1xuXG4gICAgdmFyICR3YXRjaGVycyA9IHRoaXMuJGNvbnRhaW5lci5wYXJlbnRzKCkuZmlsdGVyKFV0aWxzLmhhc1Njcm9sbCk7XG4gICAgJHdhdGNoZXJzLm9mZihzY3JvbGxFdmVudCk7XG5cbiAgICAkKHdpbmRvdykub2ZmKHNjcm9sbEV2ZW50ICsgJyAnICsgcmVzaXplRXZlbnQgKyAnICcgKyBvcmllbnRhdGlvbkV2ZW50KTtcbiAgfTtcblxuICBBdHRhY2hCb2R5LnByb3RvdHlwZS5fcG9zaXRpb25Ecm9wZG93biA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJHdpbmRvdyA9ICQod2luZG93KTtcblxuICAgIHZhciBpc0N1cnJlbnRseUFib3ZlID0gdGhpcy4kZHJvcGRvd24uaGFzQ2xhc3MoJ3NlbGVjdDItZHJvcGRvd24tLWFib3ZlJyk7XG4gICAgdmFyIGlzQ3VycmVudGx5QmVsb3cgPSB0aGlzLiRkcm9wZG93bi5oYXNDbGFzcygnc2VsZWN0Mi1kcm9wZG93bi0tYmVsb3cnKTtcblxuICAgIHZhciBuZXdEaXJlY3Rpb24gPSBudWxsO1xuXG4gICAgdmFyIG9mZnNldCA9IHRoaXMuJGNvbnRhaW5lci5vZmZzZXQoKTtcblxuICAgIG9mZnNldC5ib3R0b20gPSBvZmZzZXQudG9wICsgdGhpcy4kY29udGFpbmVyLm91dGVySGVpZ2h0KGZhbHNlKTtcblxuICAgIHZhciBjb250YWluZXIgPSB7XG4gICAgICBoZWlnaHQ6IHRoaXMuJGNvbnRhaW5lci5vdXRlckhlaWdodChmYWxzZSlcbiAgICB9O1xuXG4gICAgY29udGFpbmVyLnRvcCA9IG9mZnNldC50b3A7XG4gICAgY29udGFpbmVyLmJvdHRvbSA9IG9mZnNldC50b3AgKyBjb250YWluZXIuaGVpZ2h0O1xuXG4gICAgdmFyIGRyb3Bkb3duID0ge1xuICAgICAgaGVpZ2h0OiB0aGlzLiRkcm9wZG93bi5vdXRlckhlaWdodChmYWxzZSlcbiAgICB9O1xuXG4gICAgdmFyIHZpZXdwb3J0ID0ge1xuICAgICAgdG9wOiAkd2luZG93LnNjcm9sbFRvcCgpLFxuICAgICAgYm90dG9tOiAkd2luZG93LnNjcm9sbFRvcCgpICsgJHdpbmRvdy5oZWlnaHQoKVxuICAgIH07XG5cbiAgICB2YXIgZW5vdWdoUm9vbUFib3ZlID0gdmlld3BvcnQudG9wIDwgKG9mZnNldC50b3AgLSBkcm9wZG93bi5oZWlnaHQpO1xuICAgIHZhciBlbm91Z2hSb29tQmVsb3cgPSB2aWV3cG9ydC5ib3R0b20gPiAob2Zmc2V0LmJvdHRvbSArIGRyb3Bkb3duLmhlaWdodCk7XG5cbiAgICB2YXIgY3NzID0ge1xuICAgICAgbGVmdDogb2Zmc2V0LmxlZnQsXG4gICAgICB0b3A6IGNvbnRhaW5lci5ib3R0b21cbiAgICB9O1xuXG4gICAgLy8gRGV0ZXJtaW5lIHdoYXQgdGhlIHBhcmVudCBlbGVtZW50IGlzIHRvIHVzZSBmb3IgY2FsY2l1bGF0aW5nIHRoZSBvZmZzZXRcbiAgICB2YXIgJG9mZnNldFBhcmVudCA9IHRoaXMuJGRyb3Bkb3duUGFyZW50O1xuXG4gICAgLy8gRm9yIHN0YXRpY2FsbHkgcG9zaXRvbmVkIGVsZW1lbnRzLCB3ZSBuZWVkIHRvIGdldCB0aGUgZWxlbWVudFxuICAgIC8vIHRoYXQgaXMgZGV0ZXJtaW5pbmcgdGhlIG9mZnNldFxuICAgIGlmICgkb2Zmc2V0UGFyZW50LmNzcygncG9zaXRpb24nKSA9PT0gJ3N0YXRpYycpIHtcbiAgICAgICRvZmZzZXRQYXJlbnQgPSAkb2Zmc2V0UGFyZW50Lm9mZnNldFBhcmVudCgpO1xuICAgIH1cblxuICAgIHZhciBwYXJlbnRPZmZzZXQgPSAkb2Zmc2V0UGFyZW50Lm9mZnNldCgpO1xuXG4gICAgY3NzLnRvcCAtPSBwYXJlbnRPZmZzZXQudG9wO1xuICAgIGNzcy5sZWZ0IC09IHBhcmVudE9mZnNldC5sZWZ0O1xuXG4gICAgaWYgKCFpc0N1cnJlbnRseUFib3ZlICYmICFpc0N1cnJlbnRseUJlbG93KSB7XG4gICAgICBuZXdEaXJlY3Rpb24gPSAnYmVsb3cnO1xuICAgIH1cblxuICAgIGlmICghZW5vdWdoUm9vbUJlbG93ICYmIGVub3VnaFJvb21BYm92ZSAmJiAhaXNDdXJyZW50bHlBYm92ZSkge1xuICAgICAgbmV3RGlyZWN0aW9uID0gJ2Fib3ZlJztcbiAgICB9IGVsc2UgaWYgKCFlbm91Z2hSb29tQWJvdmUgJiYgZW5vdWdoUm9vbUJlbG93ICYmIGlzQ3VycmVudGx5QWJvdmUpIHtcbiAgICAgIG5ld0RpcmVjdGlvbiA9ICdiZWxvdyc7XG4gICAgfVxuXG4gICAgaWYgKG5ld0RpcmVjdGlvbiA9PSAnYWJvdmUnIHx8XG4gICAgICAoaXNDdXJyZW50bHlBYm92ZSAmJiBuZXdEaXJlY3Rpb24gIT09ICdiZWxvdycpKSB7XG4gICAgICBjc3MudG9wID0gY29udGFpbmVyLnRvcCAtIHBhcmVudE9mZnNldC50b3AgLSBkcm9wZG93bi5oZWlnaHQ7XG4gICAgfVxuXG4gICAgaWYgKG5ld0RpcmVjdGlvbiAhPSBudWxsKSB7XG4gICAgICB0aGlzLiRkcm9wZG93blxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NlbGVjdDItZHJvcGRvd24tLWJlbG93IHNlbGVjdDItZHJvcGRvd24tLWFib3ZlJylcbiAgICAgICAgLmFkZENsYXNzKCdzZWxlY3QyLWRyb3Bkb3duLS0nICsgbmV3RGlyZWN0aW9uKTtcbiAgICAgIHRoaXMuJGNvbnRhaW5lclxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NlbGVjdDItY29udGFpbmVyLS1iZWxvdyBzZWxlY3QyLWNvbnRhaW5lci0tYWJvdmUnKVxuICAgICAgICAuYWRkQ2xhc3MoJ3NlbGVjdDItY29udGFpbmVyLS0nICsgbmV3RGlyZWN0aW9uKTtcbiAgICB9XG5cbiAgICB0aGlzLiRkcm9wZG93bkNvbnRhaW5lci5jc3MoY3NzKTtcbiAgfTtcblxuICBBdHRhY2hCb2R5LnByb3RvdHlwZS5fcmVzaXplRHJvcGRvd24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNzcyA9IHtcbiAgICAgIHdpZHRoOiB0aGlzLiRjb250YWluZXIub3V0ZXJXaWR0aChmYWxzZSkgKyAncHgnXG4gICAgfTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuZ2V0KCdkcm9wZG93bkF1dG9XaWR0aCcpKSB7XG4gICAgICBjc3MubWluV2lkdGggPSBjc3Mud2lkdGg7XG4gICAgICBjc3MucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgICAgY3NzLndpZHRoID0gJ2F1dG8nO1xuICAgIH1cblxuICAgIHRoaXMuJGRyb3Bkb3duLmNzcyhjc3MpO1xuICB9O1xuXG4gIEF0dGFjaEJvZHkucHJvdG90eXBlLl9zaG93RHJvcGRvd24gPSBmdW5jdGlvbiAoZGVjb3JhdGVkKSB7XG4gICAgdGhpcy4kZHJvcGRvd25Db250YWluZXIuYXBwZW5kVG8odGhpcy4kZHJvcGRvd25QYXJlbnQpO1xuXG4gICAgdGhpcy5fcG9zaXRpb25Ecm9wZG93bigpO1xuICAgIHRoaXMuX3Jlc2l6ZURyb3Bkb3duKCk7XG4gIH07XG5cbiAgcmV0dXJuIEF0dGFjaEJvZHk7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2Ryb3Bkb3duL21pbmltdW1SZXN1bHRzRm9yU2VhcmNoJyxbXG5cbl0sIGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gY291bnRSZXN1bHRzIChkYXRhKSB7XG4gICAgdmFyIGNvdW50ID0gMDtcblxuICAgIGZvciAodmFyIGQgPSAwOyBkIDwgZGF0YS5sZW5ndGg7IGQrKykge1xuICAgICAgdmFyIGl0ZW0gPSBkYXRhW2RdO1xuXG4gICAgICBpZiAoaXRlbS5jaGlsZHJlbikge1xuICAgICAgICBjb3VudCArPSBjb3VudFJlc3VsdHMoaXRlbS5jaGlsZHJlbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb3VudCsrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjb3VudDtcbiAgfVxuXG4gIGZ1bmN0aW9uIE1pbmltdW1SZXN1bHRzRm9yU2VhcmNoIChkZWNvcmF0ZWQsICRlbGVtZW50LCBvcHRpb25zLCBkYXRhQWRhcHRlcikge1xuICAgIHRoaXMubWluaW11bVJlc3VsdHNGb3JTZWFyY2ggPSBvcHRpb25zLmdldCgnbWluaW11bVJlc3VsdHNGb3JTZWFyY2gnKTtcblxuICAgIGlmICh0aGlzLm1pbmltdW1SZXN1bHRzRm9yU2VhcmNoIDwgMCkge1xuICAgICAgdGhpcy5taW5pbXVtUmVzdWx0c0ZvclNlYXJjaCA9IEluZmluaXR5O1xuICAgIH1cblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsICRlbGVtZW50LCBvcHRpb25zLCBkYXRhQWRhcHRlcik7XG4gIH1cblxuICBNaW5pbXVtUmVzdWx0c0ZvclNlYXJjaC5wcm90b3R5cGUuc2hvd1NlYXJjaCA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIHBhcmFtcykge1xuICAgIGlmIChjb3VudFJlc3VsdHMocGFyYW1zLmRhdGEucmVzdWx0cykgPCB0aGlzLm1pbmltdW1SZXN1bHRzRm9yU2VhcmNoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlY29yYXRlZC5jYWxsKHRoaXMsIHBhcmFtcyk7XG4gIH07XG5cbiAgcmV0dXJuIE1pbmltdW1SZXN1bHRzRm9yU2VhcmNoO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9kcm9wZG93bi9zZWxlY3RPbkNsb3NlJyxbXG5cbl0sIGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gU2VsZWN0T25DbG9zZSAoKSB7IH1cblxuICBTZWxlY3RPbkNsb3NlLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgY29udGFpbmVyLCAkY29udGFpbmVyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgY29udGFpbmVyLCAkY29udGFpbmVyKTtcblxuICAgIGNvbnRhaW5lci5vbignY2xvc2UnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICBzZWxmLl9oYW5kbGVTZWxlY3RPbkNsb3NlKHBhcmFtcyk7XG4gICAgfSk7XG4gIH07XG5cbiAgU2VsZWN0T25DbG9zZS5wcm90b3R5cGUuX2hhbmRsZVNlbGVjdE9uQ2xvc2UgPSBmdW5jdGlvbiAoXywgcGFyYW1zKSB7XG4gICAgaWYgKHBhcmFtcyAmJiBwYXJhbXMub3JpZ2luYWxTZWxlY3QyRXZlbnQgIT0gbnVsbCkge1xuICAgICAgdmFyIGV2ZW50ID0gcGFyYW1zLm9yaWdpbmFsU2VsZWN0MkV2ZW50O1xuXG4gICAgICAvLyBEb24ndCBzZWxlY3QgYW4gaXRlbSBpZiB0aGUgY2xvc2UgZXZlbnQgd2FzIHRyaWdnZXJlZCBmcm9tIGEgc2VsZWN0IG9yXG4gICAgICAvLyB1bnNlbGVjdCBldmVudFxuICAgICAgaWYgKGV2ZW50Ll90eXBlID09PSAnc2VsZWN0JyB8fCBldmVudC5fdHlwZSA9PT0gJ3Vuc2VsZWN0Jykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyICRoaWdobGlnaHRlZFJlc3VsdHMgPSB0aGlzLmdldEhpZ2hsaWdodGVkUmVzdWx0cygpO1xuXG4gICAgLy8gT25seSBzZWxlY3QgaGlnaGxpZ2h0ZWQgcmVzdWx0c1xuICAgIGlmICgkaGlnaGxpZ2h0ZWRSZXN1bHRzLmxlbmd0aCA8IDEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZGF0YSA9ICRoaWdobGlnaHRlZFJlc3VsdHMuZGF0YSgnZGF0YScpO1xuXG4gICAgLy8gRG9uJ3QgcmUtc2VsZWN0IGFscmVhZHkgc2VsZWN0ZWQgcmVzdWx0ZVxuICAgIGlmIChcbiAgICAgIChkYXRhLmVsZW1lbnQgIT0gbnVsbCAmJiBkYXRhLmVsZW1lbnQuc2VsZWN0ZWQpIHx8XG4gICAgICAoZGF0YS5lbGVtZW50ID09IG51bGwgJiYgZGF0YS5zZWxlY3RlZClcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnRyaWdnZXIoJ3NlbGVjdCcsIHtcbiAgICAgICAgZGF0YTogZGF0YVxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBTZWxlY3RPbkNsb3NlO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9kcm9wZG93bi9jbG9zZU9uU2VsZWN0JyxbXG5cbl0sIGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQ2xvc2VPblNlbGVjdCAoKSB7IH1cblxuICBDbG9zZU9uU2VsZWN0LnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgY29udGFpbmVyLCAkY29udGFpbmVyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgY29udGFpbmVyLCAkY29udGFpbmVyKTtcblxuICAgIGNvbnRhaW5lci5vbignc2VsZWN0JywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgc2VsZi5fc2VsZWN0VHJpZ2dlcmVkKGV2dCk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ3Vuc2VsZWN0JywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgc2VsZi5fc2VsZWN0VHJpZ2dlcmVkKGV2dCk7XG4gICAgfSk7XG4gIH07XG5cbiAgQ2xvc2VPblNlbGVjdC5wcm90b3R5cGUuX3NlbGVjdFRyaWdnZXJlZCA9IGZ1bmN0aW9uIChfLCBldnQpIHtcbiAgICB2YXIgb3JpZ2luYWxFdmVudCA9IGV2dC5vcmlnaW5hbEV2ZW50O1xuXG4gICAgLy8gRG9uJ3QgY2xvc2UgaWYgdGhlIGNvbnRyb2wga2V5IGlzIGJlaW5nIGhlbGRcbiAgICBpZiAob3JpZ2luYWxFdmVudCAmJiBvcmlnaW5hbEV2ZW50LmN0cmxLZXkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnRyaWdnZXIoJ2Nsb3NlJywge1xuICAgICAgb3JpZ2luYWxFdmVudDogb3JpZ2luYWxFdmVudCxcbiAgICAgIG9yaWdpbmFsU2VsZWN0MkV2ZW50OiBldnRcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gQ2xvc2VPblNlbGVjdDtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvaTE4bi9lbicsW10sZnVuY3Rpb24gKCkge1xuICAvLyBFbmdsaXNoXG4gIHJldHVybiB7XG4gICAgZXJyb3JMb2FkaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJ1RoZSByZXN1bHRzIGNvdWxkIG5vdCBiZSBsb2FkZWQuJztcbiAgICB9LFxuICAgIGlucHV0VG9vTG9uZzogZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICAgIHZhciBvdmVyQ2hhcnMgPSBhcmdzLmlucHV0Lmxlbmd0aCAtIGFyZ3MubWF4aW11bTtcblxuICAgICAgdmFyIG1lc3NhZ2UgPSAnUGxlYXNlIGRlbGV0ZSAnICsgb3ZlckNoYXJzICsgJyBjaGFyYWN0ZXInO1xuXG4gICAgICBpZiAob3ZlckNoYXJzICE9IDEpIHtcbiAgICAgICAgbWVzc2FnZSArPSAncyc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgIH0sXG4gICAgaW5wdXRUb29TaG9ydDogZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICAgIHZhciByZW1haW5pbmdDaGFycyA9IGFyZ3MubWluaW11bSAtIGFyZ3MuaW5wdXQubGVuZ3RoO1xuXG4gICAgICB2YXIgbWVzc2FnZSA9ICdQbGVhc2UgZW50ZXIgJyArIHJlbWFpbmluZ0NoYXJzICsgJyBvciBtb3JlIGNoYXJhY3RlcnMnO1xuXG4gICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICB9LFxuICAgIGxvYWRpbmdNb3JlOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJ0xvYWRpbmcgbW9yZSByZXN1bHRz4oCmJztcbiAgICB9LFxuICAgIG1heGltdW1TZWxlY3RlZDogZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICAgIHZhciBtZXNzYWdlID0gJ1lvdSBjYW4gb25seSBzZWxlY3QgJyArIGFyZ3MubWF4aW11bSArICcgaXRlbSc7XG5cbiAgICAgIGlmIChhcmdzLm1heGltdW0gIT0gMSkge1xuICAgICAgICBtZXNzYWdlICs9ICdzJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgfSxcbiAgICBub1Jlc3VsdHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAnTm8gcmVzdWx0cyBmb3VuZCc7XG4gICAgfSxcbiAgICBzZWFyY2hpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAnU2VhcmNoaW5n4oCmJztcbiAgICB9XG4gIH07XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2RlZmF1bHRzJyxbXG4gICdqcXVlcnknLFxuICAncmVxdWlyZScsXG5cbiAgJy4vcmVzdWx0cycsXG5cbiAgJy4vc2VsZWN0aW9uL3NpbmdsZScsXG4gICcuL3NlbGVjdGlvbi9tdWx0aXBsZScsXG4gICcuL3NlbGVjdGlvbi9wbGFjZWhvbGRlcicsXG4gICcuL3NlbGVjdGlvbi9hbGxvd0NsZWFyJyxcbiAgJy4vc2VsZWN0aW9uL3NlYXJjaCcsXG4gICcuL3NlbGVjdGlvbi9ldmVudFJlbGF5JyxcblxuICAnLi91dGlscycsXG4gICcuL3RyYW5zbGF0aW9uJyxcbiAgJy4vZGlhY3JpdGljcycsXG5cbiAgJy4vZGF0YS9zZWxlY3QnLFxuICAnLi9kYXRhL2FycmF5JyxcbiAgJy4vZGF0YS9hamF4JyxcbiAgJy4vZGF0YS90YWdzJyxcbiAgJy4vZGF0YS90b2tlbml6ZXInLFxuICAnLi9kYXRhL21pbmltdW1JbnB1dExlbmd0aCcsXG4gICcuL2RhdGEvbWF4aW11bUlucHV0TGVuZ3RoJyxcbiAgJy4vZGF0YS9tYXhpbXVtU2VsZWN0aW9uTGVuZ3RoJyxcblxuICAnLi9kcm9wZG93bicsXG4gICcuL2Ryb3Bkb3duL3NlYXJjaCcsXG4gICcuL2Ryb3Bkb3duL2hpZGVQbGFjZWhvbGRlcicsXG4gICcuL2Ryb3Bkb3duL2luZmluaXRlU2Nyb2xsJyxcbiAgJy4vZHJvcGRvd24vYXR0YWNoQm9keScsXG4gICcuL2Ryb3Bkb3duL21pbmltdW1SZXN1bHRzRm9yU2VhcmNoJyxcbiAgJy4vZHJvcGRvd24vc2VsZWN0T25DbG9zZScsXG4gICcuL2Ryb3Bkb3duL2Nsb3NlT25TZWxlY3QnLFxuXG4gICcuL2kxOG4vZW4nXG5dLCBmdW5jdGlvbiAoJCwgcmVxdWlyZSxcblxuICAgICAgICAgICAgIFJlc3VsdHNMaXN0LFxuXG4gICAgICAgICAgICAgU2luZ2xlU2VsZWN0aW9uLCBNdWx0aXBsZVNlbGVjdGlvbiwgUGxhY2Vob2xkZXIsIEFsbG93Q2xlYXIsXG4gICAgICAgICAgICAgU2VsZWN0aW9uU2VhcmNoLCBFdmVudFJlbGF5LFxuXG4gICAgICAgICAgICAgVXRpbHMsIFRyYW5zbGF0aW9uLCBESUFDUklUSUNTLFxuXG4gICAgICAgICAgICAgU2VsZWN0RGF0YSwgQXJyYXlEYXRhLCBBamF4RGF0YSwgVGFncywgVG9rZW5pemVyLFxuICAgICAgICAgICAgIE1pbmltdW1JbnB1dExlbmd0aCwgTWF4aW11bUlucHV0TGVuZ3RoLCBNYXhpbXVtU2VsZWN0aW9uTGVuZ3RoLFxuXG4gICAgICAgICAgICAgRHJvcGRvd24sIERyb3Bkb3duU2VhcmNoLCBIaWRlUGxhY2Vob2xkZXIsIEluZmluaXRlU2Nyb2xsLFxuICAgICAgICAgICAgIEF0dGFjaEJvZHksIE1pbmltdW1SZXN1bHRzRm9yU2VhcmNoLCBTZWxlY3RPbkNsb3NlLCBDbG9zZU9uU2VsZWN0LFxuXG4gICAgICAgICAgICAgRW5nbGlzaFRyYW5zbGF0aW9uKSB7XG4gIGZ1bmN0aW9uIERlZmF1bHRzICgpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICBEZWZhdWx0cy5wcm90b3R5cGUuYXBwbHkgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgdGhpcy5kZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICBpZiAob3B0aW9ucy5kYXRhQWRhcHRlciA9PSBudWxsKSB7XG4gICAgICBpZiAob3B0aW9ucy5hamF4ICE9IG51bGwpIHtcbiAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlciA9IEFqYXhEYXRhO1xuICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmRhdGEgIT0gbnVsbCkge1xuICAgICAgICBvcHRpb25zLmRhdGFBZGFwdGVyID0gQXJyYXlEYXRhO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlciA9IFNlbGVjdERhdGE7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLm1pbmltdW1JbnB1dExlbmd0aCA+IDApIHtcbiAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxuICAgICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIsXG4gICAgICAgICAgTWluaW11bUlucHV0TGVuZ3RoXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLm1heGltdW1JbnB1dExlbmd0aCA+IDApIHtcbiAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxuICAgICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIsXG4gICAgICAgICAgTWF4aW11bUlucHV0TGVuZ3RoXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLm1heGltdW1TZWxlY3Rpb25MZW5ndGggPiAwKSB7XG4gICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcbiAgICAgICAgICBvcHRpb25zLmRhdGFBZGFwdGVyLFxuICAgICAgICAgIE1heGltdW1TZWxlY3Rpb25MZW5ndGhcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMudGFncykge1xuICAgICAgICBvcHRpb25zLmRhdGFBZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUob3B0aW9ucy5kYXRhQWRhcHRlciwgVGFncyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLnRva2VuU2VwYXJhdG9ycyAhPSBudWxsIHx8IG9wdGlvbnMudG9rZW5pemVyICE9IG51bGwpIHtcbiAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxuICAgICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIsXG4gICAgICAgICAgVG9rZW5pemVyXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLnF1ZXJ5ICE9IG51bGwpIHtcbiAgICAgICAgdmFyIFF1ZXJ5ID0gcmVxdWlyZShvcHRpb25zLmFtZEJhc2UgKyAnY29tcGF0L3F1ZXJ5Jyk7XG5cbiAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxuICAgICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIsXG4gICAgICAgICAgUXVlcnlcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMuaW5pdFNlbGVjdGlvbiAhPSBudWxsKSB7XG4gICAgICAgIHZhciBJbml0U2VsZWN0aW9uID0gcmVxdWlyZShvcHRpb25zLmFtZEJhc2UgKyAnY29tcGF0L2luaXRTZWxlY3Rpb24nKTtcblxuICAgICAgICBvcHRpb25zLmRhdGFBZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXG4gICAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlcixcbiAgICAgICAgICBJbml0U2VsZWN0aW9uXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMucmVzdWx0c0FkYXB0ZXIgPT0gbnVsbCkge1xuICAgICAgb3B0aW9ucy5yZXN1bHRzQWRhcHRlciA9IFJlc3VsdHNMaXN0O1xuXG4gICAgICBpZiAob3B0aW9ucy5hamF4ICE9IG51bGwpIHtcbiAgICAgICAgb3B0aW9ucy5yZXN1bHRzQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxuICAgICAgICAgIG9wdGlvbnMucmVzdWx0c0FkYXB0ZXIsXG4gICAgICAgICAgSW5maW5pdGVTY3JvbGxcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMucGxhY2Vob2xkZXIgIT0gbnVsbCkge1xuICAgICAgICBvcHRpb25zLnJlc3VsdHNBZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXG4gICAgICAgICAgb3B0aW9ucy5yZXN1bHRzQWRhcHRlcixcbiAgICAgICAgICBIaWRlUGxhY2Vob2xkZXJcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMuc2VsZWN0T25DbG9zZSkge1xuICAgICAgICBvcHRpb25zLnJlc3VsdHNBZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXG4gICAgICAgICAgb3B0aW9ucy5yZXN1bHRzQWRhcHRlcixcbiAgICAgICAgICBTZWxlY3RPbkNsb3NlXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuZHJvcGRvd25BZGFwdGVyID09IG51bGwpIHtcbiAgICAgIGlmIChvcHRpb25zLm11bHRpcGxlKSB7XG4gICAgICAgIG9wdGlvbnMuZHJvcGRvd25BZGFwdGVyID0gRHJvcGRvd247XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgU2VhcmNoYWJsZURyb3Bkb3duID0gVXRpbHMuRGVjb3JhdGUoRHJvcGRvd24sIERyb3Bkb3duU2VhcmNoKTtcblxuICAgICAgICBvcHRpb25zLmRyb3Bkb3duQWRhcHRlciA9IFNlYXJjaGFibGVEcm9wZG93bjtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMubWluaW11bVJlc3VsdHNGb3JTZWFyY2ggIT09IDApIHtcbiAgICAgICAgb3B0aW9ucy5kcm9wZG93bkFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcbiAgICAgICAgICBvcHRpb25zLmRyb3Bkb3duQWRhcHRlcixcbiAgICAgICAgICBNaW5pbXVtUmVzdWx0c0ZvclNlYXJjaFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5jbG9zZU9uU2VsZWN0KSB7XG4gICAgICAgIG9wdGlvbnMuZHJvcGRvd25BZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXG4gICAgICAgICAgb3B0aW9ucy5kcm9wZG93bkFkYXB0ZXIsXG4gICAgICAgICAgQ2xvc2VPblNlbGVjdFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgIG9wdGlvbnMuZHJvcGRvd25Dc3NDbGFzcyAhPSBudWxsIHx8XG4gICAgICAgIG9wdGlvbnMuZHJvcGRvd25Dc3MgIT0gbnVsbCB8fFxuICAgICAgICBvcHRpb25zLmFkYXB0RHJvcGRvd25Dc3NDbGFzcyAhPSBudWxsXG4gICAgICApIHtcbiAgICAgICAgdmFyIERyb3Bkb3duQ1NTID0gcmVxdWlyZShvcHRpb25zLmFtZEJhc2UgKyAnY29tcGF0L2Ryb3Bkb3duQ3NzJyk7XG5cbiAgICAgICAgb3B0aW9ucy5kcm9wZG93bkFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcbiAgICAgICAgICBvcHRpb25zLmRyb3Bkb3duQWRhcHRlcixcbiAgICAgICAgICBEcm9wZG93bkNTU1xuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zLmRyb3Bkb3duQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxuICAgICAgICBvcHRpb25zLmRyb3Bkb3duQWRhcHRlcixcbiAgICAgICAgQXR0YWNoQm9keVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5zZWxlY3Rpb25BZGFwdGVyID09IG51bGwpIHtcbiAgICAgIGlmIChvcHRpb25zLm11bHRpcGxlKSB7XG4gICAgICAgIG9wdGlvbnMuc2VsZWN0aW9uQWRhcHRlciA9IE11bHRpcGxlU2VsZWN0aW9uO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3B0aW9ucy5zZWxlY3Rpb25BZGFwdGVyID0gU2luZ2xlU2VsZWN0aW9uO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgdGhlIHBsYWNlaG9sZGVyIG1peGluIGlmIGEgcGxhY2Vob2xkZXIgd2FzIHNwZWNpZmllZFxuICAgICAgaWYgKG9wdGlvbnMucGxhY2Vob2xkZXIgIT0gbnVsbCkge1xuICAgICAgICBvcHRpb25zLnNlbGVjdGlvbkFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcbiAgICAgICAgICBvcHRpb25zLnNlbGVjdGlvbkFkYXB0ZXIsXG4gICAgICAgICAgUGxhY2Vob2xkZXJcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMuYWxsb3dDbGVhcikge1xuICAgICAgICBvcHRpb25zLnNlbGVjdGlvbkFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcbiAgICAgICAgICBvcHRpb25zLnNlbGVjdGlvbkFkYXB0ZXIsXG4gICAgICAgICAgQWxsb3dDbGVhclxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5tdWx0aXBsZSkge1xuICAgICAgICBvcHRpb25zLnNlbGVjdGlvbkFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcbiAgICAgICAgICBvcHRpb25zLnNlbGVjdGlvbkFkYXB0ZXIsXG4gICAgICAgICAgU2VsZWN0aW9uU2VhcmNoXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgb3B0aW9ucy5jb250YWluZXJDc3NDbGFzcyAhPSBudWxsIHx8XG4gICAgICAgIG9wdGlvbnMuY29udGFpbmVyQ3NzICE9IG51bGwgfHxcbiAgICAgICAgb3B0aW9ucy5hZGFwdENvbnRhaW5lckNzc0NsYXNzICE9IG51bGxcbiAgICAgICkge1xuICAgICAgICB2YXIgQ29udGFpbmVyQ1NTID0gcmVxdWlyZShvcHRpb25zLmFtZEJhc2UgKyAnY29tcGF0L2NvbnRhaW5lckNzcycpO1xuXG4gICAgICAgIG9wdGlvbnMuc2VsZWN0aW9uQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxuICAgICAgICAgIG9wdGlvbnMuc2VsZWN0aW9uQWRhcHRlcixcbiAgICAgICAgICBDb250YWluZXJDU1NcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucy5zZWxlY3Rpb25BZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXG4gICAgICAgIG9wdGlvbnMuc2VsZWN0aW9uQWRhcHRlcixcbiAgICAgICAgRXZlbnRSZWxheVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMubGFuZ3VhZ2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAvLyBDaGVjayBpZiB0aGUgbGFuZ3VhZ2UgaXMgc3BlY2lmaWVkIHdpdGggYSByZWdpb25cbiAgICAgIGlmIChvcHRpb25zLmxhbmd1YWdlLmluZGV4T2YoJy0nKSA+IDApIHtcbiAgICAgICAgLy8gRXh0cmFjdCB0aGUgcmVnaW9uIGluZm9ybWF0aW9uIGlmIGl0IGlzIGluY2x1ZGVkXG4gICAgICAgIHZhciBsYW5ndWFnZVBhcnRzID0gb3B0aW9ucy5sYW5ndWFnZS5zcGxpdCgnLScpO1xuICAgICAgICB2YXIgYmFzZUxhbmd1YWdlID0gbGFuZ3VhZ2VQYXJ0c1swXTtcblxuICAgICAgICBvcHRpb25zLmxhbmd1YWdlID0gW29wdGlvbnMubGFuZ3VhZ2UsIGJhc2VMYW5ndWFnZV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcHRpb25zLmxhbmd1YWdlID0gW29wdGlvbnMubGFuZ3VhZ2VdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICgkLmlzQXJyYXkob3B0aW9ucy5sYW5ndWFnZSkpIHtcbiAgICAgIHZhciBsYW5ndWFnZXMgPSBuZXcgVHJhbnNsYXRpb24oKTtcbiAgICAgIG9wdGlvbnMubGFuZ3VhZ2UucHVzaCgnZW4nKTtcblxuICAgICAgdmFyIGxhbmd1YWdlTmFtZXMgPSBvcHRpb25zLmxhbmd1YWdlO1xuXG4gICAgICBmb3IgKHZhciBsID0gMDsgbCA8IGxhbmd1YWdlTmFtZXMubGVuZ3RoOyBsKyspIHtcbiAgICAgICAgdmFyIG5hbWUgPSBsYW5ndWFnZU5hbWVzW2xdO1xuICAgICAgICB2YXIgbGFuZ3VhZ2UgPSB7fTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIFRyeSB0byBsb2FkIGl0IHdpdGggdGhlIG9yaWdpbmFsIG5hbWVcbiAgICAgICAgICBsYW5ndWFnZSA9IFRyYW5zbGF0aW9uLmxvYWRQYXRoKG5hbWUpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIElmIHdlIGNvdWxkbid0IGxvYWQgaXQsIGNoZWNrIGlmIGl0IHdhc24ndCB0aGUgZnVsbCBwYXRoXG4gICAgICAgICAgICBuYW1lID0gdGhpcy5kZWZhdWx0cy5hbWRMYW5ndWFnZUJhc2UgKyBuYW1lO1xuICAgICAgICAgICAgbGFuZ3VhZ2UgPSBUcmFuc2xhdGlvbi5sb2FkUGF0aChuYW1lKTtcbiAgICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgICAgLy8gVGhlIHRyYW5zbGF0aW9uIGNvdWxkIG5vdCBiZSBsb2FkZWQgYXQgYWxsLiBTb21ldGltZXMgdGhpcyBpc1xuICAgICAgICAgICAgLy8gYmVjYXVzZSBvZiBhIGNvbmZpZ3VyYXRpb24gcHJvYmxlbSwgb3RoZXIgdGltZXMgdGhpcyBjYW4gYmVcbiAgICAgICAgICAgIC8vIGJlY2F1c2Ugb2YgaG93IFNlbGVjdDIgaGVscHMgbG9hZCBhbGwgcG9zc2libGUgdHJhbnNsYXRpb24gZmlsZXMuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5kZWJ1ZyAmJiB3aW5kb3cuY29uc29sZSAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgICAgICdTZWxlY3QyOiBUaGUgbGFuZ3VhZ2UgZmlsZSBmb3IgXCInICsgbmFtZSArICdcIiBjb3VsZCBub3QgYmUgJyArXG4gICAgICAgICAgICAgICAgJ2F1dG9tYXRpY2FsbHkgbG9hZGVkLiBBIGZhbGxiYWNrIHdpbGwgYmUgdXNlZCBpbnN0ZWFkLidcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGFuZ3VhZ2VzLmV4dGVuZChsYW5ndWFnZSk7XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMudHJhbnNsYXRpb25zID0gbGFuZ3VhZ2VzO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYmFzZVRyYW5zbGF0aW9uID0gVHJhbnNsYXRpb24ubG9hZFBhdGgoXG4gICAgICAgIHRoaXMuZGVmYXVsdHMuYW1kTGFuZ3VhZ2VCYXNlICsgJ2VuJ1xuICAgICAgKTtcbiAgICAgIHZhciBjdXN0b21UcmFuc2xhdGlvbiA9IG5ldyBUcmFuc2xhdGlvbihvcHRpb25zLmxhbmd1YWdlKTtcblxuICAgICAgY3VzdG9tVHJhbnNsYXRpb24uZXh0ZW5kKGJhc2VUcmFuc2xhdGlvbik7XG5cbiAgICAgIG9wdGlvbnMudHJhbnNsYXRpb25zID0gY3VzdG9tVHJhbnNsYXRpb247XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGlvbnM7XG4gIH07XG5cbiAgRGVmYXVsdHMucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIHN0cmlwRGlhY3JpdGljcyAodGV4dCkge1xuICAgICAgLy8gVXNlZCAndW5pIHJhbmdlICsgbmFtZWQgZnVuY3Rpb24nIGZyb20gaHR0cDovL2pzcGVyZi5jb20vZGlhY3JpdGljcy8xOFxuICAgICAgZnVuY3Rpb24gbWF0Y2goYSkge1xuICAgICAgICByZXR1cm4gRElBQ1JJVElDU1thXSB8fCBhO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9bXlxcdTAwMDAtXFx1MDA3RV0vZywgbWF0Y2gpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1hdGNoZXIgKHBhcmFtcywgZGF0YSkge1xuICAgICAgLy8gQWx3YXlzIHJldHVybiB0aGUgb2JqZWN0IGlmIHRoZXJlIGlzIG5vdGhpbmcgdG8gY29tcGFyZVxuICAgICAgaWYgKCQudHJpbShwYXJhbXMudGVybSkgPT09ICcnKSB7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgfVxuXG4gICAgICAvLyBEbyBhIHJlY3Vyc2l2ZSBjaGVjayBmb3Igb3B0aW9ucyB3aXRoIGNoaWxkcmVuXG4gICAgICBpZiAoZGF0YS5jaGlsZHJlbiAmJiBkYXRhLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gQ2xvbmUgdGhlIGRhdGEgb2JqZWN0IGlmIHRoZXJlIGFyZSBjaGlsZHJlblxuICAgICAgICAvLyBUaGlzIGlzIHJlcXVpcmVkIGFzIHdlIG1vZGlmeSB0aGUgb2JqZWN0IHRvIHJlbW92ZSBhbnkgbm9uLW1hdGNoZXNcbiAgICAgICAgdmFyIG1hdGNoID0gJC5leHRlbmQodHJ1ZSwge30sIGRhdGEpO1xuXG4gICAgICAgIC8vIENoZWNrIGVhY2ggY2hpbGQgb2YgdGhlIG9wdGlvblxuICAgICAgICBmb3IgKHZhciBjID0gZGF0YS5jaGlsZHJlbi5sZW5ndGggLSAxOyBjID49IDA7IGMtLSkge1xuICAgICAgICAgIHZhciBjaGlsZCA9IGRhdGEuY2hpbGRyZW5bY107XG5cbiAgICAgICAgICB2YXIgbWF0Y2hlcyA9IG1hdGNoZXIocGFyYW1zLCBjaGlsZCk7XG5cbiAgICAgICAgICAvLyBJZiB0aGVyZSB3YXNuJ3QgYSBtYXRjaCwgcmVtb3ZlIHRoZSBvYmplY3QgaW4gdGhlIGFycmF5XG4gICAgICAgICAgaWYgKG1hdGNoZXMgPT0gbnVsbCkge1xuICAgICAgICAgICAgbWF0Y2guY2hpbGRyZW4uc3BsaWNlKGMsIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIGFueSBjaGlsZHJlbiBtYXRjaGVkLCByZXR1cm4gdGhlIG5ldyBvYmplY3RcbiAgICAgICAgaWYgKG1hdGNoLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGVyZSB3ZXJlIG5vIG1hdGNoaW5nIGNoaWxkcmVuLCBjaGVjayBqdXN0IHRoZSBwbGFpbiBvYmplY3RcbiAgICAgICAgcmV0dXJuIG1hdGNoZXIocGFyYW1zLCBtYXRjaCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBvcmlnaW5hbCA9IHN0cmlwRGlhY3JpdGljcyhkYXRhLnRleHQpLnRvVXBwZXJDYXNlKCk7XG4gICAgICB2YXIgdGVybSA9IHN0cmlwRGlhY3JpdGljcyhwYXJhbXMudGVybSkudG9VcHBlckNhc2UoKTtcblxuICAgICAgLy8gQ2hlY2sgaWYgdGhlIHRleHQgY29udGFpbnMgdGhlIHRlcm1cbiAgICAgIGlmIChvcmlnaW5hbC5pbmRleE9mKHRlcm0pID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIGl0IGRvZXNuJ3QgY29udGFpbiB0aGUgdGVybSwgZG9uJ3QgcmV0dXJuIGFueXRoaW5nXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLmRlZmF1bHRzID0ge1xuICAgICAgYW1kQmFzZTogJy4vJyxcbiAgICAgIGFtZExhbmd1YWdlQmFzZTogJy4vaTE4bi8nLFxuICAgICAgY2xvc2VPblNlbGVjdDogdHJ1ZSxcbiAgICAgIGRlYnVnOiBmYWxzZSxcbiAgICAgIGRyb3Bkb3duQXV0b1dpZHRoOiBmYWxzZSxcbiAgICAgIGVzY2FwZU1hcmt1cDogVXRpbHMuZXNjYXBlTWFya3VwLFxuICAgICAgbGFuZ3VhZ2U6IEVuZ2xpc2hUcmFuc2xhdGlvbixcbiAgICAgIG1hdGNoZXI6IG1hdGNoZXIsXG4gICAgICBtaW5pbXVtSW5wdXRMZW5ndGg6IDAsXG4gICAgICBtYXhpbXVtSW5wdXRMZW5ndGg6IDAsXG4gICAgICBtYXhpbXVtU2VsZWN0aW9uTGVuZ3RoOiAwLFxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IDAsXG4gICAgICBzZWxlY3RPbkNsb3NlOiBmYWxzZSxcbiAgICAgIHNvcnRlcjogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICB9LFxuICAgICAgdGVtcGxhdGVSZXN1bHQ6IGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC50ZXh0O1xuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlU2VsZWN0aW9uOiBmdW5jdGlvbiAoc2VsZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiBzZWxlY3Rpb24udGV4dDtcbiAgICAgIH0sXG4gICAgICB0aGVtZTogJ2RlZmF1bHQnLFxuICAgICAgd2lkdGg6ICdyZXNvbHZlJ1xuICAgIH07XG4gIH07XG5cbiAgRGVmYXVsdHMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgdmFyIGNhbWVsS2V5ID0gJC5jYW1lbENhc2Uoa2V5KTtcblxuICAgIHZhciBkYXRhID0ge307XG4gICAgZGF0YVtjYW1lbEtleV0gPSB2YWx1ZTtcblxuICAgIHZhciBjb252ZXJ0ZWREYXRhID0gVXRpbHMuX2NvbnZlcnREYXRhKGRhdGEpO1xuXG4gICAgJC5leHRlbmQodGhpcy5kZWZhdWx0cywgY29udmVydGVkRGF0YSk7XG4gIH07XG5cbiAgdmFyIGRlZmF1bHRzID0gbmV3IERlZmF1bHRzKCk7XG5cbiAgcmV0dXJuIGRlZmF1bHRzO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9vcHRpb25zJyxbXG4gICdyZXF1aXJlJyxcbiAgJ2pxdWVyeScsXG4gICcuL2RlZmF1bHRzJyxcbiAgJy4vdXRpbHMnXG5dLCBmdW5jdGlvbiAocmVxdWlyZSwgJCwgRGVmYXVsdHMsIFV0aWxzKSB7XG4gIGZ1bmN0aW9uIE9wdGlvbnMgKG9wdGlvbnMsICRlbGVtZW50KSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgIGlmICgkZWxlbWVudCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmZyb21FbGVtZW50KCRlbGVtZW50KTtcbiAgICB9XG5cbiAgICB0aGlzLm9wdGlvbnMgPSBEZWZhdWx0cy5hcHBseSh0aGlzLm9wdGlvbnMpO1xuXG4gICAgaWYgKCRlbGVtZW50ICYmICRlbGVtZW50LmlzKCdpbnB1dCcpKSB7XG4gICAgICB2YXIgSW5wdXRDb21wYXQgPSByZXF1aXJlKHRoaXMuZ2V0KCdhbWRCYXNlJykgKyAnY29tcGF0L2lucHV0RGF0YScpO1xuXG4gICAgICB0aGlzLm9wdGlvbnMuZGF0YUFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcbiAgICAgICAgdGhpcy5vcHRpb25zLmRhdGFBZGFwdGVyLFxuICAgICAgICBJbnB1dENvbXBhdFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBPcHRpb25zLnByb3RvdHlwZS5mcm9tRWxlbWVudCA9IGZ1bmN0aW9uICgkZSkge1xuICAgIHZhciBleGNsdWRlZERhdGEgPSBbJ3NlbGVjdDInXTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMubXVsdGlwbGUgPT0gbnVsbCkge1xuICAgICAgdGhpcy5vcHRpb25zLm11bHRpcGxlID0gJGUucHJvcCgnbXVsdGlwbGUnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmRpc2FibGVkID09IG51bGwpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5kaXNhYmxlZCA9ICRlLnByb3AoJ2Rpc2FibGVkJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5sYW5ndWFnZSA9PSBudWxsKSB7XG4gICAgICBpZiAoJGUucHJvcCgnbGFuZycpKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5sYW5ndWFnZSA9ICRlLnByb3AoJ2xhbmcnKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgfSBlbHNlIGlmICgkZS5jbG9zZXN0KCdbbGFuZ10nKS5wcm9wKCdsYW5nJykpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmxhbmd1YWdlID0gJGUuY2xvc2VzdCgnW2xhbmddJykucHJvcCgnbGFuZycpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMuZGlyID09IG51bGwpIHtcbiAgICAgIGlmICgkZS5wcm9wKCdkaXInKSkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZGlyID0gJGUucHJvcCgnZGlyJyk7XG4gICAgICB9IGVsc2UgaWYgKCRlLmNsb3Nlc3QoJ1tkaXJdJykucHJvcCgnZGlyJykpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmRpciA9ICRlLmNsb3Nlc3QoJ1tkaXJdJykucHJvcCgnZGlyJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZGlyID0gJ2x0cic7XG4gICAgICB9XG4gICAgfVxuXG4gICAgJGUucHJvcCgnZGlzYWJsZWQnLCB0aGlzLm9wdGlvbnMuZGlzYWJsZWQpO1xuICAgICRlLnByb3AoJ211bHRpcGxlJywgdGhpcy5vcHRpb25zLm11bHRpcGxlKTtcblxuICAgIGlmICgkZS5kYXRhKCdzZWxlY3QyVGFncycpKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnICYmIHdpbmRvdy5jb25zb2xlICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgJ1NlbGVjdDI6IFRoZSBgZGF0YS1zZWxlY3QyLXRhZ3NgIGF0dHJpYnV0ZSBoYXMgYmVlbiBjaGFuZ2VkIHRvICcgK1xuICAgICAgICAgICd1c2UgdGhlIGBkYXRhLWRhdGFgIGFuZCBgZGF0YS10YWdzPVwidHJ1ZVwiYCBhdHRyaWJ1dGVzIGFuZCB3aWxsIGJlICcgK1xuICAgICAgICAgICdyZW1vdmVkIGluIGZ1dHVyZSB2ZXJzaW9ucyBvZiBTZWxlY3QyLidcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgJGUuZGF0YSgnZGF0YScsICRlLmRhdGEoJ3NlbGVjdDJUYWdzJykpO1xuICAgICAgJGUuZGF0YSgndGFncycsIHRydWUpO1xuICAgIH1cblxuICAgIGlmICgkZS5kYXRhKCdhamF4VXJsJykpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcgJiYgd2luZG93LmNvbnNvbGUgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAnU2VsZWN0MjogVGhlIGBkYXRhLWFqYXgtdXJsYCBhdHRyaWJ1dGUgaGFzIGJlZW4gY2hhbmdlZCB0byAnICtcbiAgICAgICAgICAnYGRhdGEtYWpheC0tdXJsYCBhbmQgc3VwcG9ydCBmb3IgdGhlIG9sZCBhdHRyaWJ1dGUgd2lsbCBiZSByZW1vdmVkJyArXG4gICAgICAgICAgJyBpbiBmdXR1cmUgdmVyc2lvbnMgb2YgU2VsZWN0Mi4nXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgICRlLmF0dHIoJ2FqYXgtLXVybCcsICRlLmRhdGEoJ2FqYXhVcmwnKSk7XG4gICAgICAkZS5kYXRhKCdhamF4LS11cmwnLCAkZS5kYXRhKCdhamF4VXJsJykpO1xuICAgIH1cblxuICAgIHZhciBkYXRhc2V0ID0ge307XG5cbiAgICAvLyBQcmVmZXIgdGhlIGVsZW1lbnQncyBgZGF0YXNldGAgYXR0cmlidXRlIGlmIGl0IGV4aXN0c1xuICAgIC8vIGpRdWVyeSAxLnggZG9lcyBub3QgY29ycmVjdGx5IGhhbmRsZSBkYXRhIGF0dHJpYnV0ZXMgd2l0aCBtdWx0aXBsZSBkYXNoZXNcbiAgICBpZiAoJC5mbi5qcXVlcnkgJiYgJC5mbi5qcXVlcnkuc3Vic3RyKDAsIDIpID09ICcxLicgJiYgJGVbMF0uZGF0YXNldCkge1xuICAgICAgZGF0YXNldCA9ICQuZXh0ZW5kKHRydWUsIHt9LCAkZVswXS5kYXRhc2V0LCAkZS5kYXRhKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhc2V0ID0gJGUuZGF0YSgpO1xuICAgIH1cblxuICAgIHZhciBkYXRhID0gJC5leHRlbmQodHJ1ZSwge30sIGRhdGFzZXQpO1xuXG4gICAgZGF0YSA9IFV0aWxzLl9jb252ZXJ0RGF0YShkYXRhKTtcblxuICAgIGZvciAodmFyIGtleSBpbiBkYXRhKSB7XG4gICAgICBpZiAoJC5pbkFycmF5KGtleSwgZXhjbHVkZWREYXRhKSA+IC0xKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoJC5pc1BsYWluT2JqZWN0KHRoaXMub3B0aW9uc1trZXldKSkge1xuICAgICAgICAkLmV4dGVuZCh0aGlzLm9wdGlvbnNba2V5XSwgZGF0YVtrZXldKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub3B0aW9uc1trZXldID0gZGF0YVtrZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIE9wdGlvbnMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zW2tleV07XG4gIH07XG5cbiAgT3B0aW9ucy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGtleSwgdmFsKSB7XG4gICAgdGhpcy5vcHRpb25zW2tleV0gPSB2YWw7XG4gIH07XG5cbiAgcmV0dXJuIE9wdGlvbnM7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2NvcmUnLFtcbiAgJ2pxdWVyeScsXG4gICcuL29wdGlvbnMnLFxuICAnLi91dGlscycsXG4gICcuL2tleXMnXG5dLCBmdW5jdGlvbiAoJCwgT3B0aW9ucywgVXRpbHMsIEtFWVMpIHtcbiAgdmFyIFNlbGVjdDIgPSBmdW5jdGlvbiAoJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICBpZiAoJGVsZW1lbnQuZGF0YSgnc2VsZWN0MicpICE9IG51bGwpIHtcbiAgICAgICRlbGVtZW50LmRhdGEoJ3NlbGVjdDInKS5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgdGhpcy4kZWxlbWVudCA9ICRlbGVtZW50O1xuXG4gICAgdGhpcy5pZCA9IHRoaXMuX2dlbmVyYXRlSWQoJGVsZW1lbnQpO1xuXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICB0aGlzLm9wdGlvbnMgPSBuZXcgT3B0aW9ucyhvcHRpb25zLCAkZWxlbWVudCk7XG5cbiAgICBTZWxlY3QyLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMpO1xuXG4gICAgLy8gU2V0IHVwIHRoZSB0YWJpbmRleFxuXG4gICAgdmFyIHRhYmluZGV4ID0gJGVsZW1lbnQuYXR0cigndGFiaW5kZXgnKSB8fCAwO1xuICAgICRlbGVtZW50LmRhdGEoJ29sZC10YWJpbmRleCcsIHRhYmluZGV4KTtcbiAgICAkZWxlbWVudC5hdHRyKCd0YWJpbmRleCcsICctMScpO1xuXG4gICAgLy8gU2V0IHVwIGNvbnRhaW5lcnMgYW5kIGFkYXB0ZXJzXG5cbiAgICB2YXIgRGF0YUFkYXB0ZXIgPSB0aGlzLm9wdGlvbnMuZ2V0KCdkYXRhQWRhcHRlcicpO1xuICAgIHRoaXMuZGF0YUFkYXB0ZXIgPSBuZXcgRGF0YUFkYXB0ZXIoJGVsZW1lbnQsIHRoaXMub3B0aW9ucyk7XG5cbiAgICB2YXIgJGNvbnRhaW5lciA9IHRoaXMucmVuZGVyKCk7XG5cbiAgICB0aGlzLl9wbGFjZUNvbnRhaW5lcigkY29udGFpbmVyKTtcblxuICAgIHZhciBTZWxlY3Rpb25BZGFwdGVyID0gdGhpcy5vcHRpb25zLmdldCgnc2VsZWN0aW9uQWRhcHRlcicpO1xuICAgIHRoaXMuc2VsZWN0aW9uID0gbmV3IFNlbGVjdGlvbkFkYXB0ZXIoJGVsZW1lbnQsIHRoaXMub3B0aW9ucyk7XG4gICAgdGhpcy4kc2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb24ucmVuZGVyKCk7XG5cbiAgICB0aGlzLnNlbGVjdGlvbi5wb3NpdGlvbih0aGlzLiRzZWxlY3Rpb24sICRjb250YWluZXIpO1xuXG4gICAgdmFyIERyb3Bkb3duQWRhcHRlciA9IHRoaXMub3B0aW9ucy5nZXQoJ2Ryb3Bkb3duQWRhcHRlcicpO1xuICAgIHRoaXMuZHJvcGRvd24gPSBuZXcgRHJvcGRvd25BZGFwdGVyKCRlbGVtZW50LCB0aGlzLm9wdGlvbnMpO1xuICAgIHRoaXMuJGRyb3Bkb3duID0gdGhpcy5kcm9wZG93bi5yZW5kZXIoKTtcblxuICAgIHRoaXMuZHJvcGRvd24ucG9zaXRpb24odGhpcy4kZHJvcGRvd24sICRjb250YWluZXIpO1xuXG4gICAgdmFyIFJlc3VsdHNBZGFwdGVyID0gdGhpcy5vcHRpb25zLmdldCgncmVzdWx0c0FkYXB0ZXInKTtcbiAgICB0aGlzLnJlc3VsdHMgPSBuZXcgUmVzdWx0c0FkYXB0ZXIoJGVsZW1lbnQsIHRoaXMub3B0aW9ucywgdGhpcy5kYXRhQWRhcHRlcik7XG4gICAgdGhpcy4kcmVzdWx0cyA9IHRoaXMucmVzdWx0cy5yZW5kZXIoKTtcblxuICAgIHRoaXMucmVzdWx0cy5wb3NpdGlvbih0aGlzLiRyZXN1bHRzLCB0aGlzLiRkcm9wZG93bik7XG5cbiAgICAvLyBCaW5kIGV2ZW50c1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgLy8gQmluZCB0aGUgY29udGFpbmVyIHRvIGFsbCBvZiB0aGUgYWRhcHRlcnNcbiAgICB0aGlzLl9iaW5kQWRhcHRlcnMoKTtcblxuICAgIC8vIFJlZ2lzdGVyIGFueSBET00gZXZlbnQgaGFuZGxlcnNcbiAgICB0aGlzLl9yZWdpc3RlckRvbUV2ZW50cygpO1xuXG4gICAgLy8gUmVnaXN0ZXIgYW55IGludGVybmFsIGV2ZW50IGhhbmRsZXJzXG4gICAgdGhpcy5fcmVnaXN0ZXJEYXRhRXZlbnRzKCk7XG4gICAgdGhpcy5fcmVnaXN0ZXJTZWxlY3Rpb25FdmVudHMoKTtcbiAgICB0aGlzLl9yZWdpc3RlckRyb3Bkb3duRXZlbnRzKCk7XG4gICAgdGhpcy5fcmVnaXN0ZXJSZXN1bHRzRXZlbnRzKCk7XG4gICAgdGhpcy5fcmVnaXN0ZXJFdmVudHMoKTtcblxuICAgIC8vIFNldCB0aGUgaW5pdGlhbCBzdGF0ZVxuICAgIHRoaXMuZGF0YUFkYXB0ZXIuY3VycmVudChmdW5jdGlvbiAoaW5pdGlhbERhdGEpIHtcbiAgICAgIHNlbGYudHJpZ2dlcignc2VsZWN0aW9uOnVwZGF0ZScsIHtcbiAgICAgICAgZGF0YTogaW5pdGlhbERhdGFcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gSGlkZSB0aGUgb3JpZ2luYWwgc2VsZWN0XG4gICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ3NlbGVjdDItaGlkZGVuLWFjY2Vzc2libGUnKTtcbiAgICAkZWxlbWVudC5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cbiAgICAvLyBTeW5jaHJvbml6ZSBhbnkgbW9uaXRvcmVkIGF0dHJpYnV0ZXNcbiAgICB0aGlzLl9zeW5jQXR0cmlidXRlcygpO1xuXG4gICAgJGVsZW1lbnQuZGF0YSgnc2VsZWN0MicsIHRoaXMpO1xuICB9O1xuXG4gIFV0aWxzLkV4dGVuZChTZWxlY3QyLCBVdGlscy5PYnNlcnZhYmxlKTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5fZ2VuZXJhdGVJZCA9IGZ1bmN0aW9uICgkZWxlbWVudCkge1xuICAgIHZhciBpZCA9ICcnO1xuXG4gICAgaWYgKCRlbGVtZW50LmF0dHIoJ2lkJykgIT0gbnVsbCkge1xuICAgICAgaWQgPSAkZWxlbWVudC5hdHRyKCdpZCcpO1xuICAgIH0gZWxzZSBpZiAoJGVsZW1lbnQuYXR0cignbmFtZScpICE9IG51bGwpIHtcbiAgICAgIGlkID0gJGVsZW1lbnQuYXR0cignbmFtZScpICsgJy0nICsgVXRpbHMuZ2VuZXJhdGVDaGFycygyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWQgPSBVdGlscy5nZW5lcmF0ZUNoYXJzKDQpO1xuICAgIH1cblxuICAgIGlkID0gaWQucmVwbGFjZSgvKDp8XFwufFxcW3xcXF18LCkvZywgJycpO1xuICAgIGlkID0gJ3NlbGVjdDItJyArIGlkO1xuXG4gICAgcmV0dXJuIGlkO1xuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLl9wbGFjZUNvbnRhaW5lciA9IGZ1bmN0aW9uICgkY29udGFpbmVyKSB7XG4gICAgJGNvbnRhaW5lci5pbnNlcnRBZnRlcih0aGlzLiRlbGVtZW50KTtcblxuICAgIHZhciB3aWR0aCA9IHRoaXMuX3Jlc29sdmVXaWR0aCh0aGlzLiRlbGVtZW50LCB0aGlzLm9wdGlvbnMuZ2V0KCd3aWR0aCcpKTtcblxuICAgIGlmICh3aWR0aCAhPSBudWxsKSB7XG4gICAgICAkY29udGFpbmVyLmNzcygnd2lkdGgnLCB3aWR0aCk7XG4gICAgfVxuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLl9yZXNvbHZlV2lkdGggPSBmdW5jdGlvbiAoJGVsZW1lbnQsIG1ldGhvZCkge1xuICAgIHZhciBXSURUSCA9IC9ed2lkdGg6KChbLStdPyhbMC05XSpcXC4pP1swLTldKykocHh8ZW18ZXh8JXxpbnxjbXxtbXxwdHxwYykpL2k7XG5cbiAgICBpZiAobWV0aG9kID09ICdyZXNvbHZlJykge1xuICAgICAgdmFyIHN0eWxlV2lkdGggPSB0aGlzLl9yZXNvbHZlV2lkdGgoJGVsZW1lbnQsICdzdHlsZScpO1xuXG4gICAgICBpZiAoc3R5bGVXaWR0aCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBzdHlsZVdpZHRoO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5fcmVzb2x2ZVdpZHRoKCRlbGVtZW50LCAnZWxlbWVudCcpO1xuICAgIH1cblxuICAgIGlmIChtZXRob2QgPT0gJ2VsZW1lbnQnKSB7XG4gICAgICB2YXIgZWxlbWVudFdpZHRoID0gJGVsZW1lbnQub3V0ZXJXaWR0aChmYWxzZSk7XG5cbiAgICAgIGlmIChlbGVtZW50V2lkdGggPD0gMCkge1xuICAgICAgICByZXR1cm4gJ2F1dG8nO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZWxlbWVudFdpZHRoICsgJ3B4JztcbiAgICB9XG5cbiAgICBpZiAobWV0aG9kID09ICdzdHlsZScpIHtcbiAgICAgIHZhciBzdHlsZSA9ICRlbGVtZW50LmF0dHIoJ3N0eWxlJyk7XG5cbiAgICAgIGlmICh0eXBlb2Yoc3R5bGUpICE9PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIGF0dHJzID0gc3R5bGUuc3BsaXQoJzsnKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBhdHRycy5sZW5ndGg7IGkgPCBsOyBpID0gaSArIDEpIHtcbiAgICAgICAgdmFyIGF0dHIgPSBhdHRyc1tpXS5yZXBsYWNlKC9cXHMvZywgJycpO1xuICAgICAgICB2YXIgbWF0Y2hlcyA9IGF0dHIubWF0Y2goV0lEVEgpO1xuXG4gICAgICAgIGlmIChtYXRjaGVzICE9PSBudWxsICYmIG1hdGNoZXMubGVuZ3RoID49IDEpIHtcbiAgICAgICAgICByZXR1cm4gbWF0Y2hlc1sxXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbWV0aG9kO1xuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLl9iaW5kQWRhcHRlcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5kYXRhQWRhcHRlci5iaW5kKHRoaXMsIHRoaXMuJGNvbnRhaW5lcik7XG4gICAgdGhpcy5zZWxlY3Rpb24uYmluZCh0aGlzLCB0aGlzLiRjb250YWluZXIpO1xuXG4gICAgdGhpcy5kcm9wZG93bi5iaW5kKHRoaXMsIHRoaXMuJGNvbnRhaW5lcik7XG4gICAgdGhpcy5yZXN1bHRzLmJpbmQodGhpcywgdGhpcy4kY29udGFpbmVyKTtcbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5fcmVnaXN0ZXJEb21FdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdGhpcy4kZWxlbWVudC5vbignY2hhbmdlLnNlbGVjdDInLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLmRhdGFBZGFwdGVyLmN1cnJlbnQoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgc2VsZi50cmlnZ2VyKCdzZWxlY3Rpb246dXBkYXRlJywge1xuICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuJGVsZW1lbnQub24oJ2ZvY3VzLnNlbGVjdDInLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBzZWxmLnRyaWdnZXIoJ2ZvY3VzJywgZXZ0KTtcbiAgICB9KTtcblxuICAgIHRoaXMuX3N5bmNBID0gVXRpbHMuYmluZCh0aGlzLl9zeW5jQXR0cmlidXRlcywgdGhpcyk7XG4gICAgdGhpcy5fc3luY1MgPSBVdGlscy5iaW5kKHRoaXMuX3N5bmNTdWJ0cmVlLCB0aGlzKTtcblxuICAgIGlmICh0aGlzLiRlbGVtZW50WzBdLmF0dGFjaEV2ZW50KSB7XG4gICAgICB0aGlzLiRlbGVtZW50WzBdLmF0dGFjaEV2ZW50KCdvbnByb3BlcnR5Y2hhbmdlJywgdGhpcy5fc3luY0EpO1xuICAgIH1cblxuICAgIHZhciBvYnNlcnZlciA9IHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyIHx8XG4gICAgICB3aW5kb3cuV2ViS2l0TXV0YXRpb25PYnNlcnZlciB8fFxuICAgICAgd2luZG93Lk1vek11dGF0aW9uT2JzZXJ2ZXJcbiAgICA7XG5cbiAgICBpZiAob2JzZXJ2ZXIgIT0gbnVsbCkge1xuICAgICAgdGhpcy5fb2JzZXJ2ZXIgPSBuZXcgb2JzZXJ2ZXIoZnVuY3Rpb24gKG11dGF0aW9ucykge1xuICAgICAgICAkLmVhY2gobXV0YXRpb25zLCBzZWxmLl9zeW5jQSk7XG4gICAgICAgICQuZWFjaChtdXRhdGlvbnMsIHNlbGYuX3N5bmNTKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fb2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLiRlbGVtZW50WzBdLCB7XG4gICAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgc3VidHJlZTogZmFsc2VcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodGhpcy4kZWxlbWVudFswXS5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICB0aGlzLiRlbGVtZW50WzBdLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICdET01BdHRyTW9kaWZpZWQnLFxuICAgICAgICBzZWxmLl9zeW5jQSxcbiAgICAgICAgZmFsc2VcbiAgICAgICk7XG4gICAgICB0aGlzLiRlbGVtZW50WzBdLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICdET01Ob2RlSW5zZXJ0ZWQnLFxuICAgICAgICBzZWxmLl9zeW5jUyxcbiAgICAgICAgZmFsc2VcbiAgICAgICk7XG4gICAgICB0aGlzLiRlbGVtZW50WzBdLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICdET01Ob2RlUmVtb3ZlZCcsXG4gICAgICAgIHNlbGYuX3N5bmNTLFxuICAgICAgICBmYWxzZVxuICAgICAgKTtcbiAgICB9XG4gIH07XG5cbiAgU2VsZWN0Mi5wcm90b3R5cGUuX3JlZ2lzdGVyRGF0YUV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB0aGlzLmRhdGFBZGFwdGVyLm9uKCcqJywgZnVuY3Rpb24gKG5hbWUsIHBhcmFtcykge1xuICAgICAgc2VsZi50cmlnZ2VyKG5hbWUsIHBhcmFtcyk7XG4gICAgfSk7XG4gIH07XG5cbiAgU2VsZWN0Mi5wcm90b3R5cGUuX3JlZ2lzdGVyU2VsZWN0aW9uRXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgbm9uUmVsYXlFdmVudHMgPSBbJ3RvZ2dsZScsICdmb2N1cyddO1xuXG4gICAgdGhpcy5zZWxlY3Rpb24ub24oJ3RvZ2dsZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYudG9nZ2xlRHJvcGRvd24oKTtcbiAgICB9KTtcblxuICAgIHRoaXMuc2VsZWN0aW9uLm9uKCdmb2N1cycsIGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgIHNlbGYuZm9jdXMocGFyYW1zKTtcbiAgICB9KTtcblxuICAgIHRoaXMuc2VsZWN0aW9uLm9uKCcqJywgZnVuY3Rpb24gKG5hbWUsIHBhcmFtcykge1xuICAgICAgaWYgKCQuaW5BcnJheShuYW1lLCBub25SZWxheUV2ZW50cykgIT09IC0xKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2VsZi50cmlnZ2VyKG5hbWUsIHBhcmFtcyk7XG4gICAgfSk7XG4gIH07XG5cbiAgU2VsZWN0Mi5wcm90b3R5cGUuX3JlZ2lzdGVyRHJvcGRvd25FdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdGhpcy5kcm9wZG93bi5vbignKicsIGZ1bmN0aW9uIChuYW1lLCBwYXJhbXMpIHtcbiAgICAgIHNlbGYudHJpZ2dlcihuYW1lLCBwYXJhbXMpO1xuICAgIH0pO1xuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLl9yZWdpc3RlclJlc3VsdHNFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdGhpcy5yZXN1bHRzLm9uKCcqJywgZnVuY3Rpb24gKG5hbWUsIHBhcmFtcykge1xuICAgICAgc2VsZi50cmlnZ2VyKG5hbWUsIHBhcmFtcyk7XG4gICAgfSk7XG4gIH07XG5cbiAgU2VsZWN0Mi5wcm90b3R5cGUuX3JlZ2lzdGVyRXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHRoaXMub24oJ29wZW4nLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLiRjb250YWluZXIuYWRkQ2xhc3MoJ3NlbGVjdDItY29udGFpbmVyLS1vcGVuJyk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9uKCdjbG9zZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuJGNvbnRhaW5lci5yZW1vdmVDbGFzcygnc2VsZWN0Mi1jb250YWluZXItLW9wZW4nKTtcbiAgICB9KTtcblxuICAgIHRoaXMub24oJ2VuYWJsZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuJGNvbnRhaW5lci5yZW1vdmVDbGFzcygnc2VsZWN0Mi1jb250YWluZXItLWRpc2FibGVkJyk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9uKCdkaXNhYmxlJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi4kY29udGFpbmVyLmFkZENsYXNzKCdzZWxlY3QyLWNvbnRhaW5lci0tZGlzYWJsZWQnKTtcbiAgICB9KTtcblxuICAgIHRoaXMub24oJ2JsdXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLiRjb250YWluZXIucmVtb3ZlQ2xhc3MoJ3NlbGVjdDItY29udGFpbmVyLS1mb2N1cycpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vbigncXVlcnknLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICBpZiAoIXNlbGYuaXNPcGVuKCkpIHtcbiAgICAgICAgc2VsZi50cmlnZ2VyKCdvcGVuJywge30pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmRhdGFBZGFwdGVyLnF1ZXJ5KHBhcmFtcywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgc2VsZi50cmlnZ2VyKCdyZXN1bHRzOmFsbCcsIHtcbiAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgIHF1ZXJ5OiBwYXJhbXNcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMub24oJ3F1ZXJ5OmFwcGVuZCcsIGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgIHRoaXMuZGF0YUFkYXB0ZXIucXVlcnkocGFyYW1zLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBzZWxmLnRyaWdnZXIoJ3Jlc3VsdHM6YXBwZW5kJywge1xuICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgcXVlcnk6IHBhcmFtc1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vbigna2V5cHJlc3MnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICB2YXIga2V5ID0gZXZ0LndoaWNoO1xuXG4gICAgICBpZiAoc2VsZi5pc09wZW4oKSkge1xuICAgICAgICBpZiAoa2V5ID09PSBLRVlTLkVTQyB8fCBrZXkgPT09IEtFWVMuVEFCIHx8XG4gICAgICAgICAgICAoa2V5ID09PSBLRVlTLlVQICYmIGV2dC5hbHRLZXkpKSB7XG4gICAgICAgICAgc2VsZi5jbG9zZSgpO1xuXG4gICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSBLRVlTLkVOVEVSKSB7XG4gICAgICAgICAgc2VsZi50cmlnZ2VyKCdyZXN1bHRzOnNlbGVjdCcsIHt9KTtcblxuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9IGVsc2UgaWYgKChrZXkgPT09IEtFWVMuU1BBQ0UgJiYgZXZ0LmN0cmxLZXkpKSB7XG4gICAgICAgICAgc2VsZi50cmlnZ2VyKCdyZXN1bHRzOnRvZ2dsZScsIHt9KTtcblxuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gS0VZUy5VUCkge1xuICAgICAgICAgIHNlbGYudHJpZ2dlcigncmVzdWx0czpwcmV2aW91cycsIHt9KTtcblxuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gS0VZUy5ET1dOKSB7XG4gICAgICAgICAgc2VsZi50cmlnZ2VyKCdyZXN1bHRzOm5leHQnLCB7fSk7XG5cbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGtleSA9PT0gS0VZUy5FTlRFUiB8fCBrZXkgPT09IEtFWVMuU1BBQ0UgfHxcbiAgICAgICAgICAgIChrZXkgPT09IEtFWVMuRE9XTiAmJiBldnQuYWx0S2V5KSkge1xuICAgICAgICAgIHNlbGYub3BlbigpO1xuXG4gICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5fc3luY0F0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5vcHRpb25zLnNldCgnZGlzYWJsZWQnLCB0aGlzLiRlbGVtZW50LnByb3AoJ2Rpc2FibGVkJykpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5nZXQoJ2Rpc2FibGVkJykpIHtcbiAgICAgIGlmICh0aGlzLmlzT3BlbigpKSB7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy50cmlnZ2VyKCdkaXNhYmxlJywge30pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRyaWdnZXIoJ2VuYWJsZScsIHt9KTtcbiAgICB9XG4gIH07XG5cbiAgU2VsZWN0Mi5wcm90b3R5cGUuX3N5bmNTdWJ0cmVlID0gZnVuY3Rpb24gKGV2dCwgbXV0YXRpb25zKSB7XG4gICAgdmFyIGNoYW5nZWQgPSBmYWxzZTtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAvLyBJZ25vcmUgYW55IG11dGF0aW9uIGV2ZW50cyByYWlzZWQgZm9yIGVsZW1lbnRzIHRoYXQgYXJlbid0IG9wdGlvbnMgb3JcbiAgICAvLyBvcHRncm91cHMuIFRoaXMgaGFuZGxlcyB0aGUgY2FzZSB3aGVuIHRoZSBzZWxlY3QgZWxlbWVudCBpcyBkZXN0cm95ZWRcbiAgICBpZiAoXG4gICAgICBldnQgJiYgZXZ0LnRhcmdldCAmJiAoXG4gICAgICAgIGV2dC50YXJnZXQubm9kZU5hbWUgIT09ICdPUFRJT04nICYmIGV2dC50YXJnZXQubm9kZU5hbWUgIT09ICdPUFRHUk9VUCdcbiAgICAgIClcbiAgICApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIW11dGF0aW9ucykge1xuICAgICAgLy8gSWYgbXV0YXRpb24gZXZlbnRzIGFyZW4ndCBzdXBwb3J0ZWQsIHRoZW4gd2UgY2FuIG9ubHkgYXNzdW1lIHRoYXQgdGhlXG4gICAgICAvLyBjaGFuZ2UgYWZmZWN0ZWQgdGhlIHNlbGVjdGlvbnNcbiAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAobXV0YXRpb25zLmFkZGVkTm9kZXMgJiYgbXV0YXRpb25zLmFkZGVkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgZm9yICh2YXIgbiA9IDA7IG4gPCBtdXRhdGlvbnMuYWRkZWROb2Rlcy5sZW5ndGg7IG4rKykge1xuICAgICAgICB2YXIgbm9kZSA9IG11dGF0aW9ucy5hZGRlZE5vZGVzW25dO1xuXG4gICAgICAgIGlmIChub2RlLnNlbGVjdGVkKSB7XG4gICAgICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG11dGF0aW9ucy5yZW1vdmVkTm9kZXMgJiYgbXV0YXRpb25zLnJlbW92ZWROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBPbmx5IHJlLXB1bGwgdGhlIGRhdGEgaWYgd2UgdGhpbmsgdGhlcmUgaXMgYSBjaGFuZ2VcbiAgICBpZiAoY2hhbmdlZCkge1xuICAgICAgdGhpcy5kYXRhQWRhcHRlci5jdXJyZW50KGZ1bmN0aW9uIChjdXJyZW50RGF0YSkge1xuICAgICAgICBzZWxmLnRyaWdnZXIoJ3NlbGVjdGlvbjp1cGRhdGUnLCB7XG4gICAgICAgICAgZGF0YTogY3VycmVudERhdGFcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlIHRoZSB0cmlnZ2VyIG1ldGhvZCB0byBhdXRvbWF0aWNhbGx5IHRyaWdnZXIgcHJlLWV2ZW50cyB3aGVuXG4gICAqIHRoZXJlIGFyZSBldmVudHMgdGhhdCBjYW4gYmUgcHJldmVudGVkLlxuICAgKi9cbiAgU2VsZWN0Mi5wcm90b3R5cGUudHJpZ2dlciA9IGZ1bmN0aW9uIChuYW1lLCBhcmdzKSB7XG4gICAgdmFyIGFjdHVhbFRyaWdnZXIgPSBTZWxlY3QyLl9fc3VwZXJfXy50cmlnZ2VyO1xuICAgIHZhciBwcmVUcmlnZ2VyTWFwID0ge1xuICAgICAgJ29wZW4nOiAnb3BlbmluZycsXG4gICAgICAnY2xvc2UnOiAnY2xvc2luZycsXG4gICAgICAnc2VsZWN0JzogJ3NlbGVjdGluZycsXG4gICAgICAndW5zZWxlY3QnOiAndW5zZWxlY3RpbmcnXG4gICAgfTtcblxuICAgIGlmIChhcmdzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGFyZ3MgPSB7fTtcbiAgICB9XG5cbiAgICBpZiAobmFtZSBpbiBwcmVUcmlnZ2VyTWFwKSB7XG4gICAgICB2YXIgcHJlVHJpZ2dlck5hbWUgPSBwcmVUcmlnZ2VyTWFwW25hbWVdO1xuICAgICAgdmFyIHByZVRyaWdnZXJBcmdzID0ge1xuICAgICAgICBwcmV2ZW50ZWQ6IGZhbHNlLFxuICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICBhcmdzOiBhcmdzXG4gICAgICB9O1xuXG4gICAgICBhY3R1YWxUcmlnZ2VyLmNhbGwodGhpcywgcHJlVHJpZ2dlck5hbWUsIHByZVRyaWdnZXJBcmdzKTtcblxuICAgICAgaWYgKHByZVRyaWdnZXJBcmdzLnByZXZlbnRlZCkge1xuICAgICAgICBhcmdzLnByZXZlbnRlZCA9IHRydWU7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFjdHVhbFRyaWdnZXIuY2FsbCh0aGlzLCBuYW1lLCBhcmdzKTtcbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS50b2dnbGVEcm9wZG93biA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmdldCgnZGlzYWJsZWQnKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzT3BlbigpKSB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3BlbigpO1xuICAgIH1cbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5vcGVuID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmlzT3BlbigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy50cmlnZ2VyKCdxdWVyeScsIHt9KTtcbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuaXNPcGVuKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnRyaWdnZXIoJ2Nsb3NlJywge30pO1xuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLmlzT3BlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy4kY29udGFpbmVyLmhhc0NsYXNzKCdzZWxlY3QyLWNvbnRhaW5lci0tb3BlbicpO1xuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLmhhc0ZvY3VzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLiRjb250YWluZXIuaGFzQ2xhc3MoJ3NlbGVjdDItY29udGFpbmVyLS1mb2N1cycpO1xuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLmZvY3VzID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAvLyBObyBuZWVkIHRvIHJlLXRyaWdnZXIgZm9jdXMgZXZlbnRzIGlmIHdlIGFyZSBhbHJlYWR5IGZvY3VzZWRcbiAgICBpZiAodGhpcy5oYXNGb2N1cygpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy4kY29udGFpbmVyLmFkZENsYXNzKCdzZWxlY3QyLWNvbnRhaW5lci0tZm9jdXMnKTtcbiAgICB0aGlzLnRyaWdnZXIoJ2ZvY3VzJywge30pO1xuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLmVuYWJsZSA9IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5nZXQoJ2RlYnVnJykgJiYgd2luZG93LmNvbnNvbGUgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICdTZWxlY3QyOiBUaGUgYHNlbGVjdDIoXCJlbmFibGVcIilgIG1ldGhvZCBoYXMgYmVlbiBkZXByZWNhdGVkIGFuZCB3aWxsJyArXG4gICAgICAgICcgYmUgcmVtb3ZlZCBpbiBsYXRlciBTZWxlY3QyIHZlcnNpb25zLiBVc2UgJGVsZW1lbnQucHJvcChcImRpc2FibGVkXCIpJyArXG4gICAgICAgICcgaW5zdGVhZC4nXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChhcmdzID09IG51bGwgfHwgYXJncy5sZW5ndGggPT09IDApIHtcbiAgICAgIGFyZ3MgPSBbdHJ1ZV07XG4gICAgfVxuXG4gICAgdmFyIGRpc2FibGVkID0gIWFyZ3NbMF07XG5cbiAgICB0aGlzLiRlbGVtZW50LnByb3AoJ2Rpc2FibGVkJywgZGlzYWJsZWQpO1xuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLmRhdGEgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5nZXQoJ2RlYnVnJykgJiZcbiAgICAgICAgYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgd2luZG93LmNvbnNvbGUgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICdTZWxlY3QyOiBEYXRhIGNhbiBubyBsb25nZXIgYmUgc2V0IHVzaW5nIGBzZWxlY3QyKFwiZGF0YVwiKWAuIFlvdSAnICtcbiAgICAgICAgJ3Nob3VsZCBjb25zaWRlciBzZXR0aW5nIHRoZSB2YWx1ZSBpbnN0ZWFkIHVzaW5nIGAkZWxlbWVudC52YWwoKWAuJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICB2YXIgZGF0YSA9IFtdO1xuXG4gICAgdGhpcy5kYXRhQWRhcHRlci5jdXJyZW50KGZ1bmN0aW9uIChjdXJyZW50RGF0YSkge1xuICAgICAgZGF0YSA9IGN1cnJlbnREYXRhO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH07XG5cbiAgU2VsZWN0Mi5wcm90b3R5cGUudmFsID0gZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmdldCgnZGVidWcnKSAmJiB3aW5kb3cuY29uc29sZSAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgJ1NlbGVjdDI6IFRoZSBgc2VsZWN0MihcInZhbFwiKWAgbWV0aG9kIGhhcyBiZWVuIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUnICtcbiAgICAgICAgJyByZW1vdmVkIGluIGxhdGVyIFNlbGVjdDIgdmVyc2lvbnMuIFVzZSAkZWxlbWVudC52YWwoKSBpbnN0ZWFkLidcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKGFyZ3MgPT0gbnVsbCB8fCBhcmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMuJGVsZW1lbnQudmFsKCk7XG4gICAgfVxuXG4gICAgdmFyIG5ld1ZhbCA9IGFyZ3NbMF07XG5cbiAgICBpZiAoJC5pc0FycmF5KG5ld1ZhbCkpIHtcbiAgICAgIG5ld1ZhbCA9ICQubWFwKG5ld1ZhbCwgZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gb2JqLnRvU3RyaW5nKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLiRlbGVtZW50LnZhbChuZXdWYWwpLnRyaWdnZXIoJ2NoYW5nZScpO1xuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy4kY29udGFpbmVyLnJlbW92ZSgpO1xuXG4gICAgaWYgKHRoaXMuJGVsZW1lbnRbMF0uZGV0YWNoRXZlbnQpIHtcbiAgICAgIHRoaXMuJGVsZW1lbnRbMF0uZGV0YWNoRXZlbnQoJ29ucHJvcGVydHljaGFuZ2UnLCB0aGlzLl9zeW5jQSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX29ic2VydmVyICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX29ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgIHRoaXMuX29ic2VydmVyID0gbnVsbDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuJGVsZW1lbnRbMF0ucmVtb3ZlRXZlbnRMaXN0ZW5lcikge1xuICAgICAgdGhpcy4kZWxlbWVudFswXVxuICAgICAgICAucmVtb3ZlRXZlbnRMaXN0ZW5lcignRE9NQXR0ck1vZGlmaWVkJywgdGhpcy5fc3luY0EsIGZhbHNlKTtcbiAgICAgIHRoaXMuJGVsZW1lbnRbMF1cbiAgICAgICAgLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0RPTU5vZGVJbnNlcnRlZCcsIHRoaXMuX3N5bmNTLCBmYWxzZSk7XG4gICAgICB0aGlzLiRlbGVtZW50WzBdXG4gICAgICAgIC5yZW1vdmVFdmVudExpc3RlbmVyKCdET01Ob2RlUmVtb3ZlZCcsIHRoaXMuX3N5bmNTLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgdGhpcy5fc3luY0EgPSBudWxsO1xuICAgIHRoaXMuX3N5bmNTID0gbnVsbDtcblxuICAgIHRoaXMuJGVsZW1lbnQub2ZmKCcuc2VsZWN0MicpO1xuICAgIHRoaXMuJGVsZW1lbnQuYXR0cigndGFiaW5kZXgnLCB0aGlzLiRlbGVtZW50LmRhdGEoJ29sZC10YWJpbmRleCcpKTtcblxuICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ3NlbGVjdDItaGlkZGVuLWFjY2Vzc2libGUnKTtcbiAgICB0aGlzLiRlbGVtZW50LmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG4gICAgdGhpcy4kZWxlbWVudC5yZW1vdmVEYXRhKCdzZWxlY3QyJyk7XG5cbiAgICB0aGlzLmRhdGFBZGFwdGVyLmRlc3Ryb3koKTtcbiAgICB0aGlzLnNlbGVjdGlvbi5kZXN0cm95KCk7XG4gICAgdGhpcy5kcm9wZG93bi5kZXN0cm95KCk7XG4gICAgdGhpcy5yZXN1bHRzLmRlc3Ryb3koKTtcblxuICAgIHRoaXMuZGF0YUFkYXB0ZXIgPSBudWxsO1xuICAgIHRoaXMuc2VsZWN0aW9uID0gbnVsbDtcbiAgICB0aGlzLmRyb3Bkb3duID0gbnVsbDtcbiAgICB0aGlzLnJlc3VsdHMgPSBudWxsO1xuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJGNvbnRhaW5lciA9ICQoXG4gICAgICAnPHNwYW4gY2xhc3M9XCJzZWxlY3QyIHNlbGVjdDItY29udGFpbmVyXCI+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cInNlbGVjdGlvblwiPjwvc3Bhbj4nICtcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwiZHJvcGRvd24td3JhcHBlclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4nICtcbiAgICAgICc8L3NwYW4+J1xuICAgICk7XG5cbiAgICAkY29udGFpbmVyLmF0dHIoJ2RpcicsIHRoaXMub3B0aW9ucy5nZXQoJ2RpcicpKTtcblxuICAgIHRoaXMuJGNvbnRhaW5lciA9ICRjb250YWluZXI7XG5cbiAgICB0aGlzLiRjb250YWluZXIuYWRkQ2xhc3MoJ3NlbGVjdDItY29udGFpbmVyLS0nICsgdGhpcy5vcHRpb25zLmdldCgndGhlbWUnKSk7XG5cbiAgICAkY29udGFpbmVyLmRhdGEoJ2VsZW1lbnQnLCB0aGlzLiRlbGVtZW50KTtcblxuICAgIHJldHVybiAkY29udGFpbmVyO1xuICB9O1xuXG4gIHJldHVybiBTZWxlY3QyO1xufSk7XG5cblMyLmRlZmluZSgnanF1ZXJ5LW1vdXNld2hlZWwnLFtcbiAgJ2pxdWVyeSdcbl0sIGZ1bmN0aW9uICgkKSB7XG4gIC8vIFVzZWQgdG8gc2hpbSBqUXVlcnkubW91c2V3aGVlbCBmb3Igbm9uLWZ1bGwgYnVpbGRzLlxuICByZXR1cm4gJDtcbn0pO1xuXG5TMi5kZWZpbmUoJ2pxdWVyeS5zZWxlY3QyJyxbXG4gICdqcXVlcnknLFxuICAnanF1ZXJ5LW1vdXNld2hlZWwnLFxuXG4gICcuL3NlbGVjdDIvY29yZScsXG4gICcuL3NlbGVjdDIvZGVmYXVsdHMnXG5dLCBmdW5jdGlvbiAoJCwgXywgU2VsZWN0MiwgRGVmYXVsdHMpIHtcbiAgaWYgKCQuZm4uc2VsZWN0MiA9PSBudWxsKSB7XG4gICAgLy8gQWxsIG1ldGhvZHMgdGhhdCBzaG91bGQgcmV0dXJuIHRoZSBlbGVtZW50XG4gICAgdmFyIHRoaXNNZXRob2RzID0gWydvcGVuJywgJ2Nsb3NlJywgJ2Rlc3Ryb3knXTtcblxuICAgICQuZm4uc2VsZWN0MiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0Jykge1xuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBpbnN0YW5jZU9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgb3B0aW9ucyk7XG5cbiAgICAgICAgICB2YXIgaW5zdGFuY2UgPSBuZXcgU2VsZWN0MigkKHRoaXMpLCBpbnN0YW5jZU9wdGlvbnMpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHZhciByZXQ7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBpbnN0YW5jZSA9ICQodGhpcykuZGF0YSgnc2VsZWN0MicpO1xuXG4gICAgICAgICAgaWYgKGluc3RhbmNlID09IG51bGwgJiYgd2luZG93LmNvbnNvbGUgJiYgY29uc29sZS5lcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgJ1RoZSBzZWxlY3QyKFxcJycgKyBvcHRpb25zICsgJ1xcJykgbWV0aG9kIHdhcyBjYWxsZWQgb24gYW4gJyArXG4gICAgICAgICAgICAgICdlbGVtZW50IHRoYXQgaXMgbm90IHVzaW5nIFNlbGVjdDIuJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXQgPSBpbnN0YW5jZVtvcHRpb25zXS5hcHBseShpbnN0YW5jZSwgYXJncyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIENoZWNrIGlmIHdlIHNob3VsZCBiZSByZXR1cm5pbmcgYHRoaXNgXG4gICAgICAgIGlmICgkLmluQXJyYXkob3B0aW9ucywgdGhpc01ldGhvZHMpID4gLTEpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYXJndW1lbnRzIGZvciBTZWxlY3QyOiAnICsgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGlmICgkLmZuLnNlbGVjdDIuZGVmYXVsdHMgPT0gbnVsbCkge1xuICAgICQuZm4uc2VsZWN0Mi5kZWZhdWx0cyA9IERlZmF1bHRzO1xuICB9XG5cbiAgcmV0dXJuIFNlbGVjdDI7XG59KTtcblxuICAvLyBSZXR1cm4gdGhlIEFNRCBsb2FkZXIgY29uZmlndXJhdGlvbiBzbyBpdCBjYW4gYmUgdXNlZCBvdXRzaWRlIG9mIHRoaXMgZmlsZVxuICByZXR1cm4ge1xuICAgIGRlZmluZTogUzIuZGVmaW5lLFxuICAgIHJlcXVpcmU6IFMyLnJlcXVpcmVcbiAgfTtcbn0oKSk7XG5cbiAgLy8gQXV0b2xvYWQgdGhlIGpRdWVyeSBiaW5kaW5nc1xuICAvLyBXZSBrbm93IHRoYXQgYWxsIG9mIHRoZSBtb2R1bGVzIGV4aXN0IGFib3ZlIHRoaXMsIHNvIHdlJ3JlIHNhZmVcbiAgdmFyIHNlbGVjdDIgPSBTMi5yZXF1aXJlKCdqcXVlcnkuc2VsZWN0MicpO1xuXG4gIC8vIEhvbGQgdGhlIEFNRCBtb2R1bGUgcmVmZXJlbmNlcyBvbiB0aGUgalF1ZXJ5IGZ1bmN0aW9uIHRoYXQgd2FzIGp1c3QgbG9hZGVkXG4gIC8vIFRoaXMgYWxsb3dzIFNlbGVjdDIgdG8gdXNlIHRoZSBpbnRlcm5hbCBsb2FkZXIgb3V0c2lkZSBvZiB0aGlzIGZpbGUsIHN1Y2hcbiAgLy8gYXMgaW4gdGhlIGxhbmd1YWdlIGZpbGVzLlxuICBqUXVlcnkuZm4uc2VsZWN0Mi5hbWQgPSBTMjtcblxuICAvLyBSZXR1cm4gdGhlIFNlbGVjdDIgaW5zdGFuY2UgZm9yIGFueW9uZSB3aG8gaXMgaW1wb3J0aW5nIGl0LlxuICByZXR1cm4gc2VsZWN0Mjtcbn0pKTtcbiIsIi8qXG4gICAgIF8gXyAgICAgIF8gICAgICAgX1xuIF9fX3wgKF8pIF9fX3wgfCBfXyAgKF8pX19fXG4vIF9ffCB8IHwvIF9ffCB8LyAvICB8IC8gX198XG5cXF9fIFxcIHwgfCAoX198ICAgPCBfIHwgXFxfXyBcXFxufF9fXy9ffF98XFxfX198X3xcXF8oXykvIHxfX18vXG4gICAgICAgICAgICAgICAgICAgfF9fL1xuXG4gVmVyc2lvbjogMS42LjBcbiAgQXV0aG9yOiBLZW4gV2hlZWxlclxuIFdlYnNpdGU6IGh0dHA6Ly9rZW53aGVlbGVyLmdpdGh1Yi5pb1xuICAgIERvY3M6IGh0dHA6Ly9rZW53aGVlbGVyLmdpdGh1Yi5pby9zbGlja1xuICAgIFJlcG86IGh0dHA6Ly9naXRodWIuY29tL2tlbndoZWVsZXIvc2xpY2tcbiAgSXNzdWVzOiBodHRwOi8vZ2l0aHViLmNvbS9rZW53aGVlbGVyL3NsaWNrL2lzc3Vlc1xuXG4gKi9cbi8qIGdsb2JhbCB3aW5kb3csIGRvY3VtZW50LCBkZWZpbmUsIGpRdWVyeSwgc2V0SW50ZXJ2YWwsIGNsZWFySW50ZXJ2YWwgKi9cbihmdW5jdGlvbihmYWN0b3J5KSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGZhY3RvcnkoalF1ZXJ5KTtcblxufShmdW5jdGlvbigkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBTbGljayA9IHdpbmRvdy5TbGljayB8fCB7fTtcblxuICAgIFNsaWNrID0gKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBpbnN0YW5jZVVpZCA9IDA7XG5cbiAgICAgICAgZnVuY3Rpb24gU2xpY2soZWxlbWVudCwgc2V0dGluZ3MpIHtcblxuICAgICAgICAgICAgdmFyIF8gPSB0aGlzLCBkYXRhU2V0dGluZ3M7XG5cbiAgICAgICAgICAgIF8uZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICAgICAgYWNjZXNzaWJpbGl0eTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBhZGFwdGl2ZUhlaWdodDogZmFsc2UsXG4gICAgICAgICAgICAgICAgYXBwZW5kQXJyb3dzOiAkKGVsZW1lbnQpLFxuICAgICAgICAgICAgICAgIGFwcGVuZERvdHM6ICQoZWxlbWVudCksXG4gICAgICAgICAgICAgICAgYXJyb3dzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGFzTmF2Rm9yOiBudWxsLFxuICAgICAgICAgICAgICAgIHByZXZBcnJvdzogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtcm9sZT1cIm5vbmVcIiBjbGFzcz1cInNsaWNrLXByZXZcIiBhcmlhLWxhYmVsPVwiUHJldmlvdXNcIiB0YWJpbmRleD1cIjBcIiByb2xlPVwiYnV0dG9uXCI+UHJldmlvdXM8L2J1dHRvbj4nLFxuICAgICAgICAgICAgICAgIG5leHRBcnJvdzogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtcm9sZT1cIm5vbmVcIiBjbGFzcz1cInNsaWNrLW5leHRcIiBhcmlhLWxhYmVsPVwiTmV4dFwiIHRhYmluZGV4PVwiMFwiIHJvbGU9XCJidXR0b25cIj5OZXh0PC9idXR0b24+JyxcbiAgICAgICAgICAgICAgICBhdXRvcGxheTogZmFsc2UsXG4gICAgICAgICAgICAgICAgYXV0b3BsYXlTcGVlZDogMzAwMCxcbiAgICAgICAgICAgICAgICBjZW50ZXJNb2RlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjZW50ZXJQYWRkaW5nOiAnNTBweCcsXG4gICAgICAgICAgICAgICAgY3NzRWFzZTogJ2Vhc2UnLFxuICAgICAgICAgICAgICAgIGN1c3RvbVBhZ2luZzogZnVuY3Rpb24oc2xpZGVyLCBpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkKCc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXJvbGU9XCJub25lXCIgcm9sZT1cImJ1dHRvblwiIHRhYmluZGV4PVwiMFwiIC8+JykudGV4dChpICsgMSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkb3RzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBkb3RzQ2xhc3M6ICdzbGljay1kb3RzJyxcbiAgICAgICAgICAgICAgICBkcmFnZ2FibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZWFzaW5nOiAnbGluZWFyJyxcbiAgICAgICAgICAgICAgICBlZGdlRnJpY3Rpb246IDAuMzUsXG4gICAgICAgICAgICAgICAgZmFkZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgZm9jdXNPblNlbGVjdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6IHRydWUsXG4gICAgICAgICAgICAgICAgaW5pdGlhbFNsaWRlOiAwLFxuICAgICAgICAgICAgICAgIGxhenlMb2FkOiAnb25kZW1hbmQnLFxuICAgICAgICAgICAgICAgIG1vYmlsZUZpcnN0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICBwYXVzZU9uSG92ZXI6IHRydWUsXG4gICAgICAgICAgICAgICAgcGF1c2VPbkZvY3VzOiB0cnVlLFxuICAgICAgICAgICAgICAgIHBhdXNlT25Eb3RzSG92ZXI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHJlc3BvbmRUbzogJ3dpbmRvdycsXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogbnVsbCxcbiAgICAgICAgICAgICAgICByb3dzOiAxLFxuICAgICAgICAgICAgICAgIHJ0bDogZmFsc2UsXG4gICAgICAgICAgICAgICAgc2xpZGU6ICcnLFxuICAgICAgICAgICAgICAgIHNsaWRlc1BlclJvdzogMSxcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDUwMCxcbiAgICAgICAgICAgICAgICBzd2lwZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzd2lwZVRvU2xpZGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHRvdWNoTW92ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0b3VjaFRocmVzaG9sZDogNSxcbiAgICAgICAgICAgICAgICB1c2VDU1M6IHRydWUsXG4gICAgICAgICAgICAgICAgdXNlVHJhbnNmb3JtOiB0cnVlLFxuICAgICAgICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHZlcnRpY2FsOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbFN3aXBpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHdhaXRGb3JBbmltYXRlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHpJbmRleDogMTAwMFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgXy5pbml0aWFscyA9IHtcbiAgICAgICAgICAgICAgICBhbmltYXRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGRyYWdnaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBhdXRvUGxheVRpbWVyOiBudWxsLFxuICAgICAgICAgICAgICAgIGN1cnJlbnREaXJlY3Rpb246IDAsXG4gICAgICAgICAgICAgICAgY3VycmVudExlZnQ6IG51bGwsXG4gICAgICAgICAgICAgICAgY3VycmVudFNsaWRlOiAwLFxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogMSxcbiAgICAgICAgICAgICAgICAkZG90czogbnVsbCxcbiAgICAgICAgICAgICAgICBsaXN0V2lkdGg6IG51bGwsXG4gICAgICAgICAgICAgICAgbGlzdEhlaWdodDogbnVsbCxcbiAgICAgICAgICAgICAgICBsb2FkSW5kZXg6IDAsXG4gICAgICAgICAgICAgICAgJG5leHRBcnJvdzogbnVsbCxcbiAgICAgICAgICAgICAgICAkcHJldkFycm93OiBudWxsLFxuICAgICAgICAgICAgICAgIHNsaWRlQ291bnQ6IG51bGwsXG4gICAgICAgICAgICAgICAgc2xpZGVXaWR0aDogbnVsbCxcbiAgICAgICAgICAgICAgICAkc2xpZGVUcmFjazogbnVsbCxcbiAgICAgICAgICAgICAgICAkc2xpZGVzOiBudWxsLFxuICAgICAgICAgICAgICAgIHNsaWRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNsaWRlT2Zmc2V0OiAwLFxuICAgICAgICAgICAgICAgIHN3aXBlTGVmdDogbnVsbCxcbiAgICAgICAgICAgICAgICAkbGlzdDogbnVsbCxcbiAgICAgICAgICAgICAgICB0b3VjaE9iamVjdDoge30sXG4gICAgICAgICAgICAgICAgdHJhbnNmb3Jtc0VuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHVuc2xpY2tlZDogZmFsc2VcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICQuZXh0ZW5kKF8sIF8uaW5pdGlhbHMpO1xuXG4gICAgICAgICAgICBfLmFjdGl2ZUJyZWFrcG9pbnQgPSBudWxsO1xuICAgICAgICAgICAgXy5hbmltVHlwZSA9IG51bGw7XG4gICAgICAgICAgICBfLmFuaW1Qcm9wID0gbnVsbDtcbiAgICAgICAgICAgIF8uYnJlYWtwb2ludHMgPSBbXTtcbiAgICAgICAgICAgIF8uYnJlYWtwb2ludFNldHRpbmdzID0gW107XG4gICAgICAgICAgICBfLmNzc1RyYW5zaXRpb25zID0gZmFsc2U7XG4gICAgICAgICAgICBfLmZvY3Vzc2VkID0gZmFsc2U7XG4gICAgICAgICAgICBfLmludGVycnVwdGVkID0gZmFsc2U7XG4gICAgICAgICAgICBfLmhpZGRlbiA9ICdoaWRkZW4nO1xuICAgICAgICAgICAgXy5wYXVzZWQgPSB0cnVlO1xuICAgICAgICAgICAgXy5wb3NpdGlvblByb3AgPSBudWxsO1xuICAgICAgICAgICAgXy5yZXNwb25kVG8gPSBudWxsO1xuICAgICAgICAgICAgXy5yb3dDb3VudCA9IDE7XG4gICAgICAgICAgICBfLnNob3VsZENsaWNrID0gdHJ1ZTtcbiAgICAgICAgICAgIF8uJHNsaWRlciA9ICQoZWxlbWVudCk7XG4gICAgICAgICAgICBfLiRzbGlkZXNDYWNoZSA9IG51bGw7XG4gICAgICAgICAgICBfLnRyYW5zZm9ybVR5cGUgPSBudWxsO1xuICAgICAgICAgICAgXy50cmFuc2l0aW9uVHlwZSA9IG51bGw7XG4gICAgICAgICAgICBfLnZpc2liaWxpdHlDaGFuZ2UgPSAndmlzaWJpbGl0eWNoYW5nZSc7XG4gICAgICAgICAgICBfLndpbmRvd1dpZHRoID0gMDtcbiAgICAgICAgICAgIF8ud2luZG93VGltZXIgPSBudWxsO1xuXG4gICAgICAgICAgICBkYXRhU2V0dGluZ3MgPSAkKGVsZW1lbnQpLmRhdGEoJ3NsaWNrJykgfHwge307XG5cbiAgICAgICAgICAgIF8ub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBfLmRlZmF1bHRzLCBzZXR0aW5ncywgZGF0YVNldHRpbmdzKTtcblxuICAgICAgICAgICAgXy5jdXJyZW50U2xpZGUgPSBfLm9wdGlvbnMuaW5pdGlhbFNsaWRlO1xuXG4gICAgICAgICAgICBfLm9yaWdpbmFsU2V0dGluZ3MgPSBfLm9wdGlvbnM7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgZG9jdW1lbnQubW96SGlkZGVuICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIF8uaGlkZGVuID0gJ21vekhpZGRlbic7XG4gICAgICAgICAgICAgICAgXy52aXNpYmlsaXR5Q2hhbmdlID0gJ21venZpc2liaWxpdHljaGFuZ2UnO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZG9jdW1lbnQud2Via2l0SGlkZGVuICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIF8uaGlkZGVuID0gJ3dlYmtpdEhpZGRlbic7XG4gICAgICAgICAgICAgICAgXy52aXNpYmlsaXR5Q2hhbmdlID0gJ3dlYmtpdHZpc2liaWxpdHljaGFuZ2UnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfLmF1dG9QbGF5ID0gJC5wcm94eShfLmF1dG9QbGF5LCBfKTtcbiAgICAgICAgICAgIF8uYXV0b1BsYXlDbGVhciA9ICQucHJveHkoXy5hdXRvUGxheUNsZWFyLCBfKTtcbiAgICAgICAgICAgIF8uYXV0b1BsYXlJdGVyYXRvciA9ICQucHJveHkoXy5hdXRvUGxheUl0ZXJhdG9yLCBfKTtcbiAgICAgICAgICAgIF8uY2hhbmdlU2xpZGUgPSAkLnByb3h5KF8uY2hhbmdlU2xpZGUsIF8pO1xuICAgICAgICAgICAgXy5jbGlja0hhbmRsZXIgPSAkLnByb3h5KF8uY2xpY2tIYW5kbGVyLCBfKTtcbiAgICAgICAgICAgIF8uc2VsZWN0SGFuZGxlciA9ICQucHJveHkoXy5zZWxlY3RIYW5kbGVyLCBfKTtcbiAgICAgICAgICAgIF8uc2V0UG9zaXRpb24gPSAkLnByb3h5KF8uc2V0UG9zaXRpb24sIF8pO1xuICAgICAgICAgICAgXy5zd2lwZUhhbmRsZXIgPSAkLnByb3h5KF8uc3dpcGVIYW5kbGVyLCBfKTtcbiAgICAgICAgICAgIF8uZHJhZ0hhbmRsZXIgPSAkLnByb3h5KF8uZHJhZ0hhbmRsZXIsIF8pO1xuICAgICAgICAgICAgXy5rZXlIYW5kbGVyID0gJC5wcm94eShfLmtleUhhbmRsZXIsIF8pO1xuXG4gICAgICAgICAgICBfLmluc3RhbmNlVWlkID0gaW5zdGFuY2VVaWQrKztcblxuICAgICAgICAgICAgLy8gQSBzaW1wbGUgd2F5IHRvIGNoZWNrIGZvciBIVE1MIHN0cmluZ3NcbiAgICAgICAgICAgIC8vIFN0cmljdCBIVE1MIHJlY29nbml0aW9uIChtdXN0IHN0YXJ0IHdpdGggPClcbiAgICAgICAgICAgIC8vIEV4dHJhY3RlZCBmcm9tIGpRdWVyeSB2MS4xMSBzb3VyY2VcbiAgICAgICAgICAgIF8uaHRtbEV4cHIgPSAvXig/OlxccyooPFtcXHdcXFddKz4pW14+XSopJC87XG5cblxuICAgICAgICAgICAgXy5yZWdpc3RlckJyZWFrcG9pbnRzKCk7XG4gICAgICAgICAgICBfLmluaXQodHJ1ZSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBTbGljaztcblxuICAgIH0oKSk7XG5cbiAgICBTbGljay5wcm90b3R5cGUuYWN0aXZhdGVBREEgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIF8uJHNsaWRlVHJhY2suZmluZCgnLnNsaWNrLWFjdGl2ZScpLmF0dHIoe1xuICAgICAgICAgICAgJ2FyaWEtaGlkZGVuJzogJ2ZhbHNlJ1xuICAgICAgICB9KS5maW5kKCdhLCBpbnB1dCwgYnV0dG9uLCBzZWxlY3QnKS5hdHRyKHtcbiAgICAgICAgICAgICd0YWJpbmRleCc6ICcwJ1xuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuYWRkU2xpZGUgPSBTbGljay5wcm90b3R5cGUuc2xpY2tBZGQgPSBmdW5jdGlvbihtYXJrdXAsIGluZGV4LCBhZGRCZWZvcmUpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgaWYgKHR5cGVvZihpbmRleCkgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgYWRkQmVmb3JlID0gaW5kZXg7XG4gICAgICAgICAgICBpbmRleCA9IG51bGw7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5kZXggPCAwIHx8IChpbmRleCA+PSBfLnNsaWRlQ291bnQpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBfLnVubG9hZCgpO1xuXG4gICAgICAgIGlmICh0eXBlb2YoaW5kZXgpID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgaWYgKGluZGV4ID09PSAwICYmIF8uJHNsaWRlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAkKG1hcmt1cCkuYXBwZW5kVG8oXy4kc2xpZGVUcmFjayk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFkZEJlZm9yZSkge1xuICAgICAgICAgICAgICAgICQobWFya3VwKS5pbnNlcnRCZWZvcmUoXy4kc2xpZGVzLmVxKGluZGV4KSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQobWFya3VwKS5pbnNlcnRBZnRlcihfLiRzbGlkZXMuZXEoaW5kZXgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChhZGRCZWZvcmUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAkKG1hcmt1cCkucHJlcGVuZFRvKF8uJHNsaWRlVHJhY2spO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKG1hcmt1cCkuYXBwZW5kVG8oXy4kc2xpZGVUcmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfLiRzbGlkZXMgPSBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSk7XG5cbiAgICAgICAgXy4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmRldGFjaCgpO1xuXG4gICAgICAgIF8uJHNsaWRlVHJhY2suYXBwZW5kKF8uJHNsaWRlcyk7XG5cbiAgICAgICAgXy4kc2xpZGVzLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICQoZWxlbWVudCkuYXR0cignZGF0YS1zbGljay1pbmRleCcsIGluZGV4KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgXy4kc2xpZGVzQ2FjaGUgPSBfLiRzbGlkZXM7XG5cbiAgICAgICAgXy5yZWluaXQoKTtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuYW5pbWF0ZUhlaWdodCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgXyA9IHRoaXM7XG4gICAgICAgIGlmIChfLm9wdGlvbnMuc2xpZGVzVG9TaG93ID09PSAxICYmIF8ub3B0aW9ucy5hZGFwdGl2ZUhlaWdodCA9PT0gdHJ1ZSAmJiBfLm9wdGlvbnMudmVydGljYWwgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0SGVpZ2h0ID0gXy4kc2xpZGVzLmVxKF8uY3VycmVudFNsaWRlKS5vdXRlckhlaWdodCh0cnVlKTtcbiAgICAgICAgICAgIF8uJGxpc3QuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0YXJnZXRIZWlnaHRcbiAgICAgICAgICAgIH0sIF8ub3B0aW9ucy5zcGVlZCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmFuaW1hdGVTbGlkZSA9IGZ1bmN0aW9uKHRhcmdldExlZnQsIGNhbGxiYWNrKSB7XG5cbiAgICAgICAgdmFyIGFuaW1Qcm9wcyA9IHt9LFxuICAgICAgICAgICAgXyA9IHRoaXM7XG5cbiAgICAgICAgXy5hbmltYXRlSGVpZ2h0KCk7XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5ydGwgPT09IHRydWUgJiYgXy5vcHRpb25zLnZlcnRpY2FsID09PSBmYWxzZSkge1xuICAgICAgICAgICAgdGFyZ2V0TGVmdCA9IC10YXJnZXRMZWZ0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChfLnRyYW5zZm9ybXNFbmFibGVkID09PSBmYWxzZSkge1xuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICBsZWZ0OiB0YXJnZXRMZWZ0XG4gICAgICAgICAgICAgICAgfSwgXy5vcHRpb25zLnNwZWVkLCBfLm9wdGlvbnMuZWFzaW5nLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIHRvcDogdGFyZ2V0TGVmdFxuICAgICAgICAgICAgICAgIH0sIF8ub3B0aW9ucy5zcGVlZCwgXy5vcHRpb25zLmVhc2luZywgY2FsbGJhY2spO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIGlmIChfLmNzc1RyYW5zaXRpb25zID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGlmIChfLm9wdGlvbnMucnRsID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIF8uY3VycmVudExlZnQgPSAtKF8uY3VycmVudExlZnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkKHtcbiAgICAgICAgICAgICAgICAgICAgYW5pbVN0YXJ0OiBfLmN1cnJlbnRMZWZ0XG4gICAgICAgICAgICAgICAgfSkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGFuaW1TdGFydDogdGFyZ2V0TGVmdFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IF8ub3B0aW9ucy5zcGVlZCxcbiAgICAgICAgICAgICAgICAgICAgZWFzaW5nOiBfLm9wdGlvbnMuZWFzaW5nLFxuICAgICAgICAgICAgICAgICAgICBzdGVwOiBmdW5jdGlvbihub3cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdyA9IE1hdGguY2VpbChub3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltUHJvcHNbXy5hbmltVHlwZV0gPSAndHJhbnNsYXRlKCcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3cgKyAncHgsIDBweCknO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY3NzKGFuaW1Qcm9wcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1Qcm9wc1tfLmFuaW1UeXBlXSA9ICd0cmFuc2xhdGUoMHB4LCcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3cgKyAncHgpJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNzcyhhbmltUHJvcHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIF8uYXBwbHlUcmFuc2l0aW9uKCk7XG4gICAgICAgICAgICAgICAgdGFyZ2V0TGVmdCA9IE1hdGguY2VpbCh0YXJnZXRMZWZ0KTtcblxuICAgICAgICAgICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWwgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGFuaW1Qcm9wc1tfLmFuaW1UeXBlXSA9ICd0cmFuc2xhdGUzZCgnICsgdGFyZ2V0TGVmdCArICdweCwgMHB4LCAwcHgpJztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhbmltUHJvcHNbXy5hbmltVHlwZV0gPSAndHJhbnNsYXRlM2QoMHB4LCcgKyB0YXJnZXRMZWZ0ICsgJ3B4LCAwcHgpJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jc3MoYW5pbVByb3BzKTtcblxuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBfLmRpc2FibGVUcmFuc2l0aW9uKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgXy5vcHRpb25zLnNwZWVkKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmdldE5hdlRhcmdldCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgIGFzTmF2Rm9yID0gXy5vcHRpb25zLmFzTmF2Rm9yO1xuXG4gICAgICAgIGlmICggYXNOYXZGb3IgJiYgYXNOYXZGb3IgIT09IG51bGwgKSB7XG4gICAgICAgICAgICBhc05hdkZvciA9ICQoYXNOYXZGb3IpLm5vdChfLiRzbGlkZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFzTmF2Rm9yO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5hc05hdkZvciA9IGZ1bmN0aW9uKGluZGV4KSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgYXNOYXZGb3IgPSBfLmdldE5hdlRhcmdldCgpO1xuXG4gICAgICAgIGlmICggYXNOYXZGb3IgIT09IG51bGwgJiYgdHlwZW9mIGFzTmF2Rm9yID09PSAnb2JqZWN0JyApIHtcbiAgICAgICAgICAgIGFzTmF2Rm9yLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9ICQodGhpcykuc2xpY2soJ2dldFNsaWNrJyk7XG4gICAgICAgICAgICAgICAgaWYoIXRhcmdldC51bnNsaWNrZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnNsaWRlSGFuZGxlcihpbmRleCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuYXBwbHlUcmFuc2l0aW9uID0gZnVuY3Rpb24oc2xpZGUpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICB0cmFuc2l0aW9uID0ge307XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgdHJhbnNpdGlvbltfLnRyYW5zaXRpb25UeXBlXSA9IF8udHJhbnNmb3JtVHlwZSArICcgJyArIF8ub3B0aW9ucy5zcGVlZCArICdtcyAnICsgXy5vcHRpb25zLmNzc0Vhc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cmFuc2l0aW9uW18udHJhbnNpdGlvblR5cGVdID0gJ29wYWNpdHkgJyArIF8ub3B0aW9ucy5zcGVlZCArICdtcyAnICsgXy5vcHRpb25zLmNzc0Vhc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNzcyh0cmFuc2l0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF8uJHNsaWRlcy5lcShzbGlkZSkuY3NzKHRyYW5zaXRpb24pO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmF1dG9QbGF5ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIF8uYXV0b1BsYXlDbGVhcigpO1xuXG4gICAgICAgIGlmICggXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyApIHtcbiAgICAgICAgICAgIF8uYXV0b1BsYXlUaW1lciA9IHNldEludGVydmFsKCBfLmF1dG9QbGF5SXRlcmF0b3IsIF8ub3B0aW9ucy5hdXRvcGxheVNwZWVkICk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuYXV0b1BsYXlDbGVhciA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBpZiAoXy5hdXRvUGxheVRpbWVyKSB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKF8uYXV0b1BsYXlUaW1lcik7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuYXV0b1BsYXlJdGVyYXRvciA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgIHNsaWRlVG8gPSBfLmN1cnJlbnRTbGlkZSArIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDtcblxuICAgICAgICBpZiAoICFfLnBhdXNlZCAmJiAhXy5pbnRlcnJ1cHRlZCAmJiAhXy5mb2N1c3NlZCApIHtcblxuICAgICAgICAgICAgaWYgKCBfLm9wdGlvbnMuaW5maW5pdGUgPT09IGZhbHNlICkge1xuXG4gICAgICAgICAgICAgICAgaWYgKCBfLmRpcmVjdGlvbiA9PT0gMSAmJiAoIF8uY3VycmVudFNsaWRlICsgMSApID09PSAoIF8uc2xpZGVDb3VudCAtIDEgKSkge1xuICAgICAgICAgICAgICAgICAgICBfLmRpcmVjdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoIF8uZGlyZWN0aW9uID09PSAwICkge1xuXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlVG8gPSBfLmN1cnJlbnRTbGlkZSAtIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIF8uY3VycmVudFNsaWRlIC0gMSA9PT0gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZGlyZWN0aW9uID0gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF8uc2xpZGVIYW5kbGVyKCBzbGlkZVRvICk7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5idWlsZEFycm93cyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBpZiAoXy5vcHRpb25zLmFycm93cyA9PT0gdHJ1ZSApIHtcblxuICAgICAgICAgICAgXy4kcHJldkFycm93ID0gJChfLm9wdGlvbnMucHJldkFycm93KS5hZGRDbGFzcygnc2xpY2stYXJyb3cnKTtcbiAgICAgICAgICAgIF8uJG5leHRBcnJvdyA9ICQoXy5vcHRpb25zLm5leHRBcnJvdykuYWRkQ2xhc3MoJ3NsaWNrLWFycm93Jyk7XG5cbiAgICAgICAgICAgIGlmKCBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICkge1xuXG4gICAgICAgICAgICAgICAgXy4kcHJldkFycm93LnJlbW92ZUNsYXNzKCdzbGljay1oaWRkZW4nKS5yZW1vdmVBdHRyKCdhcmlhLWhpZGRlbiB0YWJpbmRleCcpO1xuICAgICAgICAgICAgICAgIF8uJG5leHRBcnJvdy5yZW1vdmVDbGFzcygnc2xpY2staGlkZGVuJykucmVtb3ZlQXR0cignYXJpYS1oaWRkZW4gdGFiaW5kZXgnKTtcblxuICAgICAgICAgICAgICAgIGlmIChfLmh0bWxFeHByLnRlc3QoXy5vcHRpb25zLnByZXZBcnJvdykpIHtcbiAgICAgICAgICAgICAgICAgICAgXy4kcHJldkFycm93LnByZXBlbmRUbyhfLm9wdGlvbnMuYXBwZW5kQXJyb3dzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoXy5odG1sRXhwci50ZXN0KF8ub3B0aW9ucy5uZXh0QXJyb3cpKSB7XG4gICAgICAgICAgICAgICAgICAgIF8uJG5leHRBcnJvdy5hcHBlbmRUbyhfLm9wdGlvbnMuYXBwZW5kQXJyb3dzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoXy5vcHRpb25zLmluZmluaXRlICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIF8uJHByZXZBcnJvd1xuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1kaXNhYmxlZCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignYXJpYS1kaXNhYmxlZCcsICd0cnVlJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgXy4kcHJldkFycm93LmFkZCggXy4kbmV4dEFycm93IClcblxuICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWhpZGRlbicpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdhcmlhLWRpc2FibGVkJzogJ3RydWUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3RhYmluZGV4JzogJy0xJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuYnVpbGREb3RzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgaSwgZG90O1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZG90cyA9PT0gdHJ1ZSAmJiBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG5cbiAgICAgICAgICAgIF8uJHNsaWRlci5hZGRDbGFzcygnc2xpY2stZG90dGVkJyk7XG5cbiAgICAgICAgICAgIGRvdCA9ICQoJzx1bCAvPicpLmFkZENsYXNzKF8ub3B0aW9ucy5kb3RzQ2xhc3MpO1xuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDw9IF8uZ2V0RG90Q291bnQoKTsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgZG90LmFwcGVuZCgkKCc8bGkgLz4nKS5hcHBlbmQoXy5vcHRpb25zLmN1c3RvbVBhZ2luZy5jYWxsKHRoaXMsIF8sIGkpKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF8uJGRvdHMgPSBkb3QuYXBwZW5kVG8oXy5vcHRpb25zLmFwcGVuZERvdHMpO1xuXG4gICAgICAgICAgICBfLiRkb3RzLmZpbmQoJ2xpJykuZmlyc3QoKS5hZGRDbGFzcygnc2xpY2stYWN0aXZlJykuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmJ1aWxkT3V0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIF8uJHNsaWRlcyA9XG4gICAgICAgICAgICBfLiRzbGlkZXJcbiAgICAgICAgICAgICAgICAuY2hpbGRyZW4oIF8ub3B0aW9ucy5zbGlkZSArICc6bm90KC5zbGljay1jbG9uZWQpJylcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLXNsaWRlJyk7XG5cbiAgICAgICAgXy5zbGlkZUNvdW50ID0gXy4kc2xpZGVzLmxlbmd0aDtcblxuICAgICAgICBfLiRzbGlkZXMuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xuICAgICAgICAgICAgJChlbGVtZW50KVxuICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXNsaWNrLWluZGV4JywgaW5kZXgpXG4gICAgICAgICAgICAgICAgLmRhdGEoJ29yaWdpbmFsU3R5bGluZycsICQoZWxlbWVudCkuYXR0cignc3R5bGUnKSB8fCAnJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIF8uJHNsaWRlci5hZGRDbGFzcygnc2xpY2stc2xpZGVyJyk7XG5cbiAgICAgICAgXy4kc2xpZGVUcmFjayA9IChfLnNsaWRlQ291bnQgPT09IDApID9cbiAgICAgICAgICAgICQoJzxkaXYgY2xhc3M9XCJzbGljay10cmFja1wiLz4nKS5hcHBlbmRUbyhfLiRzbGlkZXIpIDpcbiAgICAgICAgICAgIF8uJHNsaWRlcy53cmFwQWxsKCc8ZGl2IGNsYXNzPVwic2xpY2stdHJhY2tcIi8+JykucGFyZW50KCk7XG5cbiAgICAgICAgXy4kbGlzdCA9IF8uJHNsaWRlVHJhY2sud3JhcChcbiAgICAgICAgICAgICc8ZGl2IGFyaWEtbGl2ZT1cInBvbGl0ZVwiIGNsYXNzPVwic2xpY2stbGlzdFwiLz4nKS5wYXJlbnQoKTtcbiAgICAgICAgXy4kc2xpZGVUcmFjay5jc3MoJ29wYWNpdHknLCAwKTtcblxuICAgICAgICBpZiAoXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUgfHwgXy5vcHRpb25zLnN3aXBlVG9TbGlkZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsID0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgICQoJ2ltZ1tkYXRhLWxhenldJywgXy4kc2xpZGVyKS5ub3QoJ1tzcmNdJykuYWRkQ2xhc3MoJ3NsaWNrLWxvYWRpbmcnKTtcblxuICAgICAgICBfLnNldHVwSW5maW5pdGUoKTtcblxuICAgICAgICBfLmJ1aWxkQXJyb3dzKCk7XG5cbiAgICAgICAgXy5idWlsZERvdHMoKTtcblxuICAgICAgICBfLnVwZGF0ZURvdHMoKTtcblxuXG4gICAgICAgIF8uc2V0U2xpZGVDbGFzc2VzKHR5cGVvZiBfLmN1cnJlbnRTbGlkZSA9PT0gJ251bWJlcicgPyBfLmN1cnJlbnRTbGlkZSA6IDApO1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZHJhZ2dhYmxlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBfLiRsaXN0LmFkZENsYXNzKCdkcmFnZ2FibGUnKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5idWlsZFJvd3MgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXMsIGEsIGIsIGMsIG5ld1NsaWRlcywgbnVtT2ZTbGlkZXMsIG9yaWdpbmFsU2xpZGVzLHNsaWRlc1BlclNlY3Rpb247XG5cbiAgICAgICAgbmV3U2xpZGVzID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgICBvcmlnaW5hbFNsaWRlcyA9IF8uJHNsaWRlci5jaGlsZHJlbigpO1xuXG4gICAgICAgIGlmKF8ub3B0aW9ucy5yb3dzID4gMSkge1xuXG4gICAgICAgICAgICBzbGlkZXNQZXJTZWN0aW9uID0gXy5vcHRpb25zLnNsaWRlc1BlclJvdyAqIF8ub3B0aW9ucy5yb3dzO1xuICAgICAgICAgICAgbnVtT2ZTbGlkZXMgPSBNYXRoLmNlaWwoXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxTbGlkZXMubGVuZ3RoIC8gc2xpZGVzUGVyU2VjdGlvblxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZm9yKGEgPSAwOyBhIDwgbnVtT2ZTbGlkZXM7IGErKyl7XG4gICAgICAgICAgICAgICAgdmFyIHNsaWRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgZm9yKGIgPSAwOyBiIDwgXy5vcHRpb25zLnJvd3M7IGIrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgICAgIGZvcihjID0gMDsgYyA8IF8ub3B0aW9ucy5zbGlkZXNQZXJSb3c7IGMrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IChhICogc2xpZGVzUGVyU2VjdGlvbiArICgoYiAqIF8ub3B0aW9ucy5zbGlkZXNQZXJSb3cpICsgYykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9yaWdpbmFsU2xpZGVzLmdldCh0YXJnZXQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93LmFwcGVuZENoaWxkKG9yaWdpbmFsU2xpZGVzLmdldCh0YXJnZXQpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzbGlkZS5hcHBlbmRDaGlsZChyb3cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBuZXdTbGlkZXMuYXBwZW5kQ2hpbGQoc2xpZGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfLiRzbGlkZXIuZW1wdHkoKS5hcHBlbmQobmV3U2xpZGVzKTtcbiAgICAgICAgICAgIF8uJHNsaWRlci5jaGlsZHJlbigpLmNoaWxkcmVuKCkuY2hpbGRyZW4oKVxuICAgICAgICAgICAgICAgIC5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOigxMDAgLyBfLm9wdGlvbnMuc2xpZGVzUGVyUm93KSArICclJyxcbiAgICAgICAgICAgICAgICAgICAgJ2Rpc3BsYXknOiAnaW5saW5lLWJsb2NrJ1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuY2hlY2tSZXNwb25zaXZlID0gZnVuY3Rpb24oaW5pdGlhbCwgZm9yY2VVcGRhdGUpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICBicmVha3BvaW50LCB0YXJnZXRCcmVha3BvaW50LCByZXNwb25kVG9XaWR0aCwgdHJpZ2dlckJyZWFrcG9pbnQgPSBmYWxzZTtcbiAgICAgICAgdmFyIHNsaWRlcldpZHRoID0gXy4kc2xpZGVyLndpZHRoKCk7XG4gICAgICAgIHZhciB3aW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoIHx8ICQod2luZG93KS53aWR0aCgpO1xuXG4gICAgICAgIGlmIChfLnJlc3BvbmRUbyA9PT0gJ3dpbmRvdycpIHtcbiAgICAgICAgICAgIHJlc3BvbmRUb1dpZHRoID0gd2luZG93V2lkdGg7XG4gICAgICAgIH0gZWxzZSBpZiAoXy5yZXNwb25kVG8gPT09ICdzbGlkZXInKSB7XG4gICAgICAgICAgICByZXNwb25kVG9XaWR0aCA9IHNsaWRlcldpZHRoO1xuICAgICAgICB9IGVsc2UgaWYgKF8ucmVzcG9uZFRvID09PSAnbWluJykge1xuICAgICAgICAgICAgcmVzcG9uZFRvV2lkdGggPSBNYXRoLm1pbih3aW5kb3dXaWR0aCwgc2xpZGVyV2lkdGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCBfLm9wdGlvbnMucmVzcG9uc2l2ZSAmJlxuICAgICAgICAgICAgXy5vcHRpb25zLnJlc3BvbnNpdmUubGVuZ3RoICYmXG4gICAgICAgICAgICBfLm9wdGlvbnMucmVzcG9uc2l2ZSAhPT0gbnVsbCkge1xuXG4gICAgICAgICAgICB0YXJnZXRCcmVha3BvaW50ID0gbnVsbDtcblxuICAgICAgICAgICAgZm9yIChicmVha3BvaW50IGluIF8uYnJlYWtwb2ludHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoXy5icmVha3BvaW50cy5oYXNPd25Qcm9wZXJ0eShicmVha3BvaW50KSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoXy5vcmlnaW5hbFNldHRpbmdzLm1vYmlsZUZpcnN0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbmRUb1dpZHRoIDwgXy5icmVha3BvaW50c1ticmVha3BvaW50XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEJyZWFrcG9pbnQgPSBfLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbmRUb1dpZHRoID4gXy5icmVha3BvaW50c1ticmVha3BvaW50XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEJyZWFrcG9pbnQgPSBfLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGFyZ2V0QnJlYWtwb2ludCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmIChfLmFjdGl2ZUJyZWFrcG9pbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldEJyZWFrcG9pbnQgIT09IF8uYWN0aXZlQnJlYWtwb2ludCB8fCBmb3JjZVVwZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgXy5hY3RpdmVCcmVha3BvaW50ID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRCcmVha3BvaW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF8uYnJlYWtwb2ludFNldHRpbmdzW3RhcmdldEJyZWFrcG9pbnRdID09PSAndW5zbGljaycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLnVuc2xpY2sodGFyZ2V0QnJlYWtwb2ludCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8ub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBfLm9yaWdpbmFsU2V0dGluZ3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uYnJlYWtwb2ludFNldHRpbmdzW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0QnJlYWtwb2ludF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbml0aWFsID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uY3VycmVudFNsaWRlID0gXy5vcHRpb25zLmluaXRpYWxTbGlkZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5yZWZyZXNoKGluaXRpYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdHJpZ2dlckJyZWFrcG9pbnQgPSB0YXJnZXRCcmVha3BvaW50O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgXy5hY3RpdmVCcmVha3BvaW50ID0gdGFyZ2V0QnJlYWtwb2ludDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF8uYnJlYWtwb2ludFNldHRpbmdzW3RhcmdldEJyZWFrcG9pbnRdID09PSAndW5zbGljaycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8udW5zbGljayh0YXJnZXRCcmVha3BvaW50KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8ub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBfLm9yaWdpbmFsU2V0dGluZ3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5icmVha3BvaW50U2V0dGluZ3NbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEJyZWFrcG9pbnRdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbml0aWFsID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5jdXJyZW50U2xpZGUgPSBfLm9wdGlvbnMuaW5pdGlhbFNsaWRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXy5yZWZyZXNoKGluaXRpYWwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRyaWdnZXJCcmVha3BvaW50ID0gdGFyZ2V0QnJlYWtwb2ludDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChfLmFjdGl2ZUJyZWFrcG9pbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgXy5hY3RpdmVCcmVha3BvaW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgXy5vcHRpb25zID0gXy5vcmlnaW5hbFNldHRpbmdzO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgXy5jdXJyZW50U2xpZGUgPSBfLm9wdGlvbnMuaW5pdGlhbFNsaWRlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF8ucmVmcmVzaChpbml0aWFsKTtcbiAgICAgICAgICAgICAgICAgICAgdHJpZ2dlckJyZWFrcG9pbnQgPSB0YXJnZXRCcmVha3BvaW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gb25seSB0cmlnZ2VyIGJyZWFrcG9pbnRzIGR1cmluZyBhbiBhY3R1YWwgYnJlYWsuIG5vdCBvbiBpbml0aWFsaXplLlxuICAgICAgICAgICAgaWYoICFpbml0aWFsICYmIHRyaWdnZXJCcmVha3BvaW50ICE9PSBmYWxzZSApIHtcbiAgICAgICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignYnJlYWtwb2ludCcsIFtfLCB0cmlnZ2VyQnJlYWtwb2ludF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmNoYW5nZVNsaWRlID0gZnVuY3Rpb24oZXZlbnQsIGRvbnRBbmltYXRlKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgJHRhcmdldCA9ICQoZXZlbnQuY3VycmVudFRhcmdldCksXG4gICAgICAgICAgICBpbmRleE9mZnNldCwgc2xpZGVPZmZzZXQsIHVuZXZlbk9mZnNldDtcblxuICAgICAgICAvLyBJZiB0YXJnZXQgaXMgYSBsaW5rLCBwcmV2ZW50IGRlZmF1bHQgYWN0aW9uLlxuICAgICAgICBpZigkdGFyZ2V0LmlzKCdhJykpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0YXJnZXQgaXMgbm90IHRoZSA8bGk+IGVsZW1lbnQgKGllOiBhIGNoaWxkKSwgZmluZCB0aGUgPGxpPi5cbiAgICAgICAgaWYoISR0YXJnZXQuaXMoJ2xpJykpIHtcbiAgICAgICAgICAgICR0YXJnZXQgPSAkdGFyZ2V0LmNsb3Nlc3QoJ2xpJyk7XG4gICAgICAgIH1cblxuICAgICAgICB1bmV2ZW5PZmZzZXQgPSAoXy5zbGlkZUNvdW50ICUgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsICE9PSAwKTtcbiAgICAgICAgaW5kZXhPZmZzZXQgPSB1bmV2ZW5PZmZzZXQgPyAwIDogKF8uc2xpZGVDb3VudCAtIF8uY3VycmVudFNsaWRlKSAlIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDtcblxuICAgICAgICBzd2l0Y2ggKGV2ZW50LmRhdGEubWVzc2FnZSkge1xuXG4gICAgICAgICAgICBjYXNlICdwcmV2aW91cyc6XG4gICAgICAgICAgICAgICAgc2xpZGVPZmZzZXQgPSBpbmRleE9mZnNldCA9PT0gMCA/IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCA6IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLSBpbmRleE9mZnNldDtcbiAgICAgICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuICAgICAgICAgICAgICAgICAgICBfLnNsaWRlSGFuZGxlcihfLmN1cnJlbnRTbGlkZSAtIHNsaWRlT2Zmc2V0LCBmYWxzZSwgZG9udEFuaW1hdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnbmV4dCc6XG4gICAgICAgICAgICAgICAgc2xpZGVPZmZzZXQgPSBpbmRleE9mZnNldCA9PT0gMCA/IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCA6IGluZGV4T2Zmc2V0O1xuICAgICAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG4gICAgICAgICAgICAgICAgICAgIF8uc2xpZGVIYW5kbGVyKF8uY3VycmVudFNsaWRlICsgc2xpZGVPZmZzZXQsIGZhbHNlLCBkb250QW5pbWF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdpbmRleCc6XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZXZlbnQuZGF0YS5pbmRleCA9PT0gMCA/IDAgOlxuICAgICAgICAgICAgICAgICAgICBldmVudC5kYXRhLmluZGV4IHx8ICR0YXJnZXQuaW5kZXgoKSAqIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDtcblxuICAgICAgICAgICAgICAgIF8uc2xpZGVIYW5kbGVyKF8uY2hlY2tOYXZpZ2FibGUoaW5kZXgpLCBmYWxzZSwgZG9udEFuaW1hdGUpO1xuICAgICAgICAgICAgICAgICR0YXJnZXQuY2hpbGRyZW4oKS50cmlnZ2VyKCdmb2N1cycpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5jaGVja05hdmlnYWJsZSA9IGZ1bmN0aW9uKGluZGV4KSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgbmF2aWdhYmxlcywgcHJldk5hdmlnYWJsZTtcblxuICAgICAgICBuYXZpZ2FibGVzID0gXy5nZXROYXZpZ2FibGVJbmRleGVzKCk7XG4gICAgICAgIHByZXZOYXZpZ2FibGUgPSAwO1xuICAgICAgICBpZiAoaW5kZXggPiBuYXZpZ2FibGVzW25hdmlnYWJsZXMubGVuZ3RoIC0gMV0pIHtcbiAgICAgICAgICAgIGluZGV4ID0gbmF2aWdhYmxlc1tuYXZpZ2FibGVzLmxlbmd0aCAtIDFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yICh2YXIgbiBpbiBuYXZpZ2FibGVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4IDwgbmF2aWdhYmxlc1tuXSkge1xuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IHByZXZOYXZpZ2FibGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwcmV2TmF2aWdhYmxlID0gbmF2aWdhYmxlc1tuXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmNsZWFuVXBFdmVudHMgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5kb3RzICYmIF8uJGRvdHMgIT09IG51bGwpIHtcblxuICAgICAgICAgICAgJCgnbGknLCBfLiRkb3RzKVxuICAgICAgICAgICAgICAgIC5vZmYoJ2NsaWNrLnNsaWNrJywgXy5jaGFuZ2VTbGlkZSlcbiAgICAgICAgICAgICAgICAub2ZmKCdtb3VzZWVudGVyLnNsaWNrJywgJC5wcm94eShfLmludGVycnVwdCwgXywgdHJ1ZSkpXG4gICAgICAgICAgICAgICAgLm9mZignbW91c2VsZWF2ZS5zbGljaycsICQucHJveHkoXy5pbnRlcnJ1cHQsIF8sIGZhbHNlKSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIF8uJHNsaWRlci5vZmYoJ2ZvY3VzLnNsaWNrIGJsdXIuc2xpY2snKTtcblxuICAgICAgICBpZiAoXy5vcHRpb25zLmFycm93cyA9PT0gdHJ1ZSAmJiBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG4gICAgICAgICAgICBfLiRwcmV2QXJyb3cgJiYgXy4kcHJldkFycm93Lm9mZignY2xpY2suc2xpY2snLCBfLmNoYW5nZVNsaWRlKTtcbiAgICAgICAgICAgIF8uJG5leHRBcnJvdyAmJiBfLiRuZXh0QXJyb3cub2ZmKCdjbGljay5zbGljaycsIF8uY2hhbmdlU2xpZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgXy4kbGlzdC5vZmYoJ3RvdWNoc3RhcnQuc2xpY2sgbW91c2Vkb3duLnNsaWNrJywgXy5zd2lwZUhhbmRsZXIpO1xuICAgICAgICBfLiRsaXN0Lm9mZigndG91Y2htb3ZlLnNsaWNrIG1vdXNlbW92ZS5zbGljaycsIF8uc3dpcGVIYW5kbGVyKTtcbiAgICAgICAgXy4kbGlzdC5vZmYoJ3RvdWNoZW5kLnNsaWNrIG1vdXNldXAuc2xpY2snLCBfLnN3aXBlSGFuZGxlcik7XG4gICAgICAgIF8uJGxpc3Qub2ZmKCd0b3VjaGNhbmNlbC5zbGljayBtb3VzZWxlYXZlLnNsaWNrJywgXy5zd2lwZUhhbmRsZXIpO1xuXG4gICAgICAgIF8uJGxpc3Qub2ZmKCdjbGljay5zbGljaycsIF8uY2xpY2tIYW5kbGVyKTtcblxuICAgICAgICAkKGRvY3VtZW50KS5vZmYoXy52aXNpYmlsaXR5Q2hhbmdlLCBfLnZpc2liaWxpdHkpO1xuXG4gICAgICAgIF8uY2xlYW5VcFNsaWRlRXZlbnRzKCk7XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5hY2Nlc3NpYmlsaXR5ID09PSB0cnVlKSB7XG4gICAgICAgICAgICBfLiRsaXN0Lm9mZigna2V5ZG93bi5zbGljaycsIF8ua2V5SGFuZGxlcik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXy5vcHRpb25zLmZvY3VzT25TZWxlY3QgPT09IHRydWUpIHtcbiAgICAgICAgICAgICQoXy4kc2xpZGVUcmFjaykuY2hpbGRyZW4oKS5vZmYoJ2NsaWNrLnNsaWNrJywgXy5zZWxlY3RIYW5kbGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgICQod2luZG93KS5vZmYoJ29yaWVudGF0aW9uY2hhbmdlLnNsaWNrLnNsaWNrLScgKyBfLmluc3RhbmNlVWlkLCBfLm9yaWVudGF0aW9uQ2hhbmdlKTtcblxuICAgICAgICAkKHdpbmRvdykub2ZmKCdyZXNpemUuc2xpY2suc2xpY2stJyArIF8uaW5zdGFuY2VVaWQsIF8ucmVzaXplKTtcblxuICAgICAgICAkKCdbZHJhZ2dhYmxlIT10cnVlXScsIF8uJHNsaWRlVHJhY2spLm9mZignZHJhZ3N0YXJ0JywgXy5wcmV2ZW50RGVmYXVsdCk7XG5cbiAgICAgICAgJCh3aW5kb3cpLm9mZignbG9hZC5zbGljay5zbGljay0nICsgXy5pbnN0YW5jZVVpZCwgXy5zZXRQb3NpdGlvbik7XG4gICAgICAgICQoZG9jdW1lbnQpLm9mZigncmVhZHkuc2xpY2suc2xpY2stJyArIF8uaW5zdGFuY2VVaWQsIF8uc2V0UG9zaXRpb24pO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5jbGVhblVwU2xpZGVFdmVudHMgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgXy4kbGlzdC5vZmYoJ21vdXNlZW50ZXIuc2xpY2snLCAkLnByb3h5KF8uaW50ZXJydXB0LCBfLCB0cnVlKSk7XG4gICAgICAgIF8uJGxpc3Qub2ZmKCdtb3VzZWxlYXZlLnNsaWNrJywgJC5wcm94eShfLmludGVycnVwdCwgXywgZmFsc2UpKTtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuY2xlYW5VcFJvd3MgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXMsIG9yaWdpbmFsU2xpZGVzO1xuXG4gICAgICAgIGlmKF8ub3B0aW9ucy5yb3dzID4gMSkge1xuICAgICAgICAgICAgb3JpZ2luYWxTbGlkZXMgPSBfLiRzbGlkZXMuY2hpbGRyZW4oKS5jaGlsZHJlbigpO1xuICAgICAgICAgICAgb3JpZ2luYWxTbGlkZXMucmVtb3ZlQXR0cignc3R5bGUnKTtcbiAgICAgICAgICAgIF8uJHNsaWRlci5lbXB0eSgpLmFwcGVuZChvcmlnaW5hbFNsaWRlcyk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuY2xpY2tIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgaWYgKF8uc2hvdWxkQ2xpY2sgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24ocmVmcmVzaCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBfLmF1dG9QbGF5Q2xlYXIoKTtcblxuICAgICAgICBfLnRvdWNoT2JqZWN0ID0ge307XG5cbiAgICAgICAgXy5jbGVhblVwRXZlbnRzKCk7XG5cbiAgICAgICAgJCgnLnNsaWNrLWNsb25lZCcsIF8uJHNsaWRlcikuZGV0YWNoKCk7XG5cbiAgICAgICAgaWYgKF8uJGRvdHMpIHtcbiAgICAgICAgICAgIF8uJGRvdHMucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGlmICggXy4kcHJldkFycm93ICYmIF8uJHByZXZBcnJvdy5sZW5ndGggKSB7XG5cbiAgICAgICAgICAgIF8uJHByZXZBcnJvd1xuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnc2xpY2stZGlzYWJsZWQgc2xpY2stYXJyb3cgc2xpY2staGlkZGVuJylcbiAgICAgICAgICAgICAgICAucmVtb3ZlQXR0cignYXJpYS1oaWRkZW4gYXJpYS1kaXNhYmxlZCB0YWJpbmRleCcpXG4gICAgICAgICAgICAgICAgLmNzcygnZGlzcGxheScsJycpO1xuXG4gICAgICAgICAgICBpZiAoIF8uaHRtbEV4cHIudGVzdCggXy5vcHRpb25zLnByZXZBcnJvdyApKSB7XG4gICAgICAgICAgICAgICAgXy4kcHJldkFycm93LnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCBfLiRuZXh0QXJyb3cgJiYgXy4kbmV4dEFycm93Lmxlbmd0aCApIHtcblxuICAgICAgICAgICAgXy4kbmV4dEFycm93XG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdzbGljay1kaXNhYmxlZCBzbGljay1hcnJvdyBzbGljay1oaWRkZW4nKVxuICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCdhcmlhLWhpZGRlbiBhcmlhLWRpc2FibGVkIHRhYmluZGV4JylcbiAgICAgICAgICAgICAgICAuY3NzKCdkaXNwbGF5JywnJyk7XG5cbiAgICAgICAgICAgIGlmICggXy5odG1sRXhwci50ZXN0KCBfLm9wdGlvbnMubmV4dEFycm93ICkpIHtcbiAgICAgICAgICAgICAgICBfLiRuZXh0QXJyb3cucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG5cbiAgICAgICAgaWYgKF8uJHNsaWRlcykge1xuXG4gICAgICAgICAgICBfLiRzbGlkZXNcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NsaWNrLXNsaWRlIHNsaWNrLWFjdGl2ZSBzbGljay1jZW50ZXIgc2xpY2stdmlzaWJsZSBzbGljay1jdXJyZW50JylcbiAgICAgICAgICAgICAgICAucmVtb3ZlQXR0cignYXJpYS1oaWRkZW4nKVxuICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCdkYXRhLXNsaWNrLWluZGV4JylcbiAgICAgICAgICAgICAgICAuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ3N0eWxlJywgJCh0aGlzKS5kYXRhKCdvcmlnaW5hbFN0eWxpbmcnKSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKS5kZXRhY2goKTtcblxuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5kZXRhY2goKTtcblxuICAgICAgICAgICAgXy4kbGlzdC5kZXRhY2goKTtcblxuICAgICAgICAgICAgXy4kc2xpZGVyLmFwcGVuZChfLiRzbGlkZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgXy5jbGVhblVwUm93cygpO1xuXG4gICAgICAgIF8uJHNsaWRlci5yZW1vdmVDbGFzcygnc2xpY2stc2xpZGVyJyk7XG4gICAgICAgIF8uJHNsaWRlci5yZW1vdmVDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKTtcbiAgICAgICAgXy4kc2xpZGVyLnJlbW92ZUNsYXNzKCdzbGljay1kb3R0ZWQnKTtcblxuICAgICAgICBfLnVuc2xpY2tlZCA9IHRydWU7XG5cbiAgICAgICAgaWYoIXJlZnJlc2gpIHtcbiAgICAgICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdkZXN0cm95JywgW19dKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5kaXNhYmxlVHJhbnNpdGlvbiA9IGZ1bmN0aW9uKHNsaWRlKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgdHJhbnNpdGlvbiA9IHt9O1xuXG4gICAgICAgIHRyYW5zaXRpb25bXy50cmFuc2l0aW9uVHlwZV0gPSAnJztcblxuICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNzcyh0cmFuc2l0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF8uJHNsaWRlcy5lcShzbGlkZSkuY3NzKHRyYW5zaXRpb24pO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmZhZGVTbGlkZSA9IGZ1bmN0aW9uKHNsaWRlSW5kZXgsIGNhbGxiYWNrKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIGlmIChfLmNzc1RyYW5zaXRpb25zID09PSBmYWxzZSkge1xuXG4gICAgICAgICAgICBfLiRzbGlkZXMuZXEoc2xpZGVJbmRleCkuY3NzKHtcbiAgICAgICAgICAgICAgICB6SW5kZXg6IF8ub3B0aW9ucy56SW5kZXhcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBfLiRzbGlkZXMuZXEoc2xpZGVJbmRleCkuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICAgICAgfSwgXy5vcHRpb25zLnNwZWVkLCBfLm9wdGlvbnMuZWFzaW5nLCBjYWxsYmFjayk7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgXy5hcHBseVRyYW5zaXRpb24oc2xpZGVJbmRleCk7XG5cbiAgICAgICAgICAgIF8uJHNsaWRlcy5lcShzbGlkZUluZGV4KS5jc3Moe1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICAgICAgekluZGV4OiBfLm9wdGlvbnMuekluZGV4XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICBfLmRpc2FibGVUcmFuc2l0aW9uKHNsaWRlSW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoKTtcbiAgICAgICAgICAgICAgICB9LCBfLm9wdGlvbnMuc3BlZWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuZmFkZVNsaWRlT3V0ID0gZnVuY3Rpb24oc2xpZGVJbmRleCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBpZiAoXy5jc3NUcmFuc2l0aW9ucyA9PT0gZmFsc2UpIHtcblxuICAgICAgICAgICAgXy4kc2xpZGVzLmVxKHNsaWRlSW5kZXgpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgICAgICAgICAgekluZGV4OiBfLm9wdGlvbnMuekluZGV4IC0gMlxuICAgICAgICAgICAgfSwgXy5vcHRpb25zLnNwZWVkLCBfLm9wdGlvbnMuZWFzaW5nKTtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICBfLmFwcGx5VHJhbnNpdGlvbihzbGlkZUluZGV4KTtcblxuICAgICAgICAgICAgXy4kc2xpZGVzLmVxKHNsaWRlSW5kZXgpLmNzcyh7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICAgICAgICB6SW5kZXg6IF8ub3B0aW9ucy56SW5kZXggLSAyXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmZpbHRlclNsaWRlcyA9IFNsaWNrLnByb3RvdHlwZS5zbGlja0ZpbHRlciA9IGZ1bmN0aW9uKGZpbHRlcikge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBpZiAoZmlsdGVyICE9PSBudWxsKSB7XG5cbiAgICAgICAgICAgIF8uJHNsaWRlc0NhY2hlID0gXy4kc2xpZGVzO1xuXG4gICAgICAgICAgICBfLnVubG9hZCgpO1xuXG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZGV0YWNoKCk7XG5cbiAgICAgICAgICAgIF8uJHNsaWRlc0NhY2hlLmZpbHRlcihmaWx0ZXIpLmFwcGVuZFRvKF8uJHNsaWRlVHJhY2spO1xuXG4gICAgICAgICAgICBfLnJlaW5pdCgpO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuZm9jdXNIYW5kbGVyID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIF8uJHNsaWRlclxuICAgICAgICAgICAgLm9mZignZm9jdXMuc2xpY2sgYmx1ci5zbGljaycpXG4gICAgICAgICAgICAub24oJ2ZvY3VzLnNsaWNrIGJsdXIuc2xpY2snLFxuICAgICAgICAgICAgICAgICcqOm5vdCguc2xpY2stYXJyb3cpJywgZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgICAgICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB2YXIgJHNmID0gJCh0aGlzKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIGlmKCBfLm9wdGlvbnMucGF1c2VPbkZvY3VzICkge1xuICAgICAgICAgICAgICAgICAgICBfLmZvY3Vzc2VkID0gJHNmLmlzKCc6Zm9jdXMnKTtcbiAgICAgICAgICAgICAgICAgICAgXy5hdXRvUGxheSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSwgMCk7XG5cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5nZXRDdXJyZW50ID0gU2xpY2sucHJvdG90eXBlLnNsaWNrQ3VycmVudFNsaWRlID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuICAgICAgICByZXR1cm4gXy5jdXJyZW50U2xpZGU7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmdldERvdENvdW50ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIHZhciBicmVha1BvaW50ID0gMDtcbiAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgICAgICB2YXIgcGFnZXJRdHkgPSAwO1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuaW5maW5pdGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHdoaWxlIChicmVha1BvaW50IDwgXy5zbGlkZUNvdW50KSB7XG4gICAgICAgICAgICAgICAgKytwYWdlclF0eTtcbiAgICAgICAgICAgICAgICBicmVha1BvaW50ID0gY291bnRlciArIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDtcbiAgICAgICAgICAgICAgICBjb3VudGVyICs9IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ID8gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIDogXy5vcHRpb25zLnNsaWRlc1RvU2hvdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcGFnZXJRdHkgPSBfLnNsaWRlQ291bnQ7XG4gICAgICAgIH0gZWxzZSBpZighXy5vcHRpb25zLmFzTmF2Rm9yKSB7XG4gICAgICAgICAgICBwYWdlclF0eSA9IDEgKyBNYXRoLmNlaWwoKF8uc2xpZGVDb3VudCAtIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIC8gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgd2hpbGUgKGJyZWFrUG9pbnQgPCBfLnNsaWRlQ291bnQpIHtcbiAgICAgICAgICAgICAgICArK3BhZ2VyUXR5O1xuICAgICAgICAgICAgICAgIGJyZWFrUG9pbnQgPSBjb3VudGVyICsgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsO1xuICAgICAgICAgICAgICAgIGNvdW50ZXIgKz0gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgPyBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgOiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhZ2VyUXR5IC0gMTtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuZ2V0TGVmdCA9IGZ1bmN0aW9uKHNsaWRlSW5kZXgpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICB0YXJnZXRMZWZ0LFxuICAgICAgICAgICAgdmVydGljYWxIZWlnaHQsXG4gICAgICAgICAgICB2ZXJ0aWNhbE9mZnNldCA9IDAsXG4gICAgICAgICAgICB0YXJnZXRTbGlkZTtcblxuICAgICAgICBfLnNsaWRlT2Zmc2V0ID0gMDtcbiAgICAgICAgdmVydGljYWxIZWlnaHQgPSBfLiRzbGlkZXMuZmlyc3QoKS5vdXRlckhlaWdodCh0cnVlKTtcblxuICAgICAgICBpZiAoXy5vcHRpb25zLmluZmluaXRlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuICAgICAgICAgICAgICAgIF8uc2xpZGVPZmZzZXQgPSAoXy5zbGlkZVdpZHRoICogXy5vcHRpb25zLnNsaWRlc1RvU2hvdykgKiAtMTtcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbE9mZnNldCA9ICh2ZXJ0aWNhbEhlaWdodCAqIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpICogLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50ICUgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNsaWRlSW5kZXggKyBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgPiBfLnNsaWRlQ291bnQgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2xpZGVJbmRleCA+IF8uc2xpZGVDb3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgXy5zbGlkZU9mZnNldCA9ICgoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAtIChzbGlkZUluZGV4IC0gXy5zbGlkZUNvdW50KSkgKiBfLnNsaWRlV2lkdGgpICogLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbE9mZnNldCA9ICgoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAtIChzbGlkZUluZGV4IC0gXy5zbGlkZUNvdW50KSkgKiB2ZXJ0aWNhbEhlaWdodCkgKiAtMTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uc2xpZGVPZmZzZXQgPSAoKF8uc2xpZGVDb3VudCAlIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCkgKiBfLnNsaWRlV2lkdGgpICogLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbE9mZnNldCA9ICgoXy5zbGlkZUNvdW50ICUgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKSAqIHZlcnRpY2FsSGVpZ2h0KSAqIC0xO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHNsaWRlSW5kZXggKyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ID4gXy5zbGlkZUNvdW50KSB7XG4gICAgICAgICAgICAgICAgXy5zbGlkZU9mZnNldCA9ICgoc2xpZGVJbmRleCArIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIC0gXy5zbGlkZUNvdW50KSAqIF8uc2xpZGVXaWR0aDtcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbE9mZnNldCA9ICgoc2xpZGVJbmRleCArIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIC0gXy5zbGlkZUNvdW50KSAqIHZlcnRpY2FsSGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF8uc2xpZGVDb3VudCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG4gICAgICAgICAgICBfLnNsaWRlT2Zmc2V0ID0gMDtcbiAgICAgICAgICAgIHZlcnRpY2FsT2Zmc2V0ID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSAmJiBfLm9wdGlvbnMuaW5maW5pdGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIF8uc2xpZGVPZmZzZXQgKz0gXy5zbGlkZVdpZHRoICogTWF0aC5mbG9vcihfLm9wdGlvbnMuc2xpZGVzVG9TaG93IC8gMikgLSBfLnNsaWRlV2lkdGg7XG4gICAgICAgIH0gZWxzZSBpZiAoXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIF8uc2xpZGVPZmZzZXQgPSAwO1xuICAgICAgICAgICAgXy5zbGlkZU9mZnNldCArPSBfLnNsaWRlV2lkdGggKiBNYXRoLmZsb29yKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLyAyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWwgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICB0YXJnZXRMZWZ0ID0gKChzbGlkZUluZGV4ICogXy5zbGlkZVdpZHRoKSAqIC0xKSArIF8uc2xpZGVPZmZzZXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YXJnZXRMZWZ0ID0gKChzbGlkZUluZGV4ICogdmVydGljYWxIZWlnaHQpICogLTEpICsgdmVydGljYWxPZmZzZXQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXy5vcHRpb25zLnZhcmlhYmxlV2lkdGggPT09IHRydWUpIHtcblxuICAgICAgICAgICAgaWYgKF8uc2xpZGVDb3VudCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93IHx8IF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRTbGlkZSA9IF8uJHNsaWRlVHJhY2suY2hpbGRyZW4oJy5zbGljay1zbGlkZScpLmVxKHNsaWRlSW5kZXgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRTbGlkZSA9IF8uJHNsaWRlVHJhY2suY2hpbGRyZW4oJy5zbGljay1zbGlkZScpLmVxKHNsaWRlSW5kZXggKyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5ydGwgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0U2xpZGVbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0TGVmdCA9IChfLiRzbGlkZVRyYWNrLndpZHRoKCkgLSB0YXJnZXRTbGlkZVswXS5vZmZzZXRMZWZ0IC0gdGFyZ2V0U2xpZGUud2lkdGgoKSkgKiAtMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRMZWZ0ID0gIDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRMZWZ0ID0gdGFyZ2V0U2xpZGVbMF0gPyB0YXJnZXRTbGlkZVswXS5vZmZzZXRMZWZ0ICogLTEgOiAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50IDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgfHwgXy5vcHRpb25zLmluZmluaXRlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRTbGlkZSA9IF8uJHNsaWRlVHJhY2suY2hpbGRyZW4oJy5zbGljay1zbGlkZScpLmVxKHNsaWRlSW5kZXgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFNsaWRlID0gXy4kc2xpZGVUcmFjay5jaGlsZHJlbignLnNsaWNrLXNsaWRlJykuZXEoc2xpZGVJbmRleCArIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgKyAxKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoXy5vcHRpb25zLnJ0bCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0U2xpZGVbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldExlZnQgPSAoXy4kc2xpZGVUcmFjay53aWR0aCgpIC0gdGFyZ2V0U2xpZGVbMF0ub2Zmc2V0TGVmdCAtIHRhcmdldFNsaWRlLndpZHRoKCkpICogLTE7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRMZWZ0ID0gIDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRMZWZ0ID0gdGFyZ2V0U2xpZGVbMF0gPyB0YXJnZXRTbGlkZVswXS5vZmZzZXRMZWZ0ICogLTEgOiAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRhcmdldExlZnQgKz0gKF8uJGxpc3Qud2lkdGgoKSAtIHRhcmdldFNsaWRlLm91dGVyV2lkdGgoKSkgLyAyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldExlZnQ7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmdldE9wdGlvbiA9IFNsaWNrLnByb3RvdHlwZS5zbGlja0dldE9wdGlvbiA9IGZ1bmN0aW9uKG9wdGlvbikge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICByZXR1cm4gXy5vcHRpb25zW29wdGlvbl07XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmdldE5hdmlnYWJsZUluZGV4ZXMgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICBicmVha1BvaW50ID0gMCxcbiAgICAgICAgICAgIGNvdW50ZXIgPSAwLFxuICAgICAgICAgICAgaW5kZXhlcyA9IFtdLFxuICAgICAgICAgICAgbWF4O1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuaW5maW5pdGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBtYXggPSBfLnNsaWRlQ291bnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBicmVha1BvaW50ID0gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsICogLTE7XG4gICAgICAgICAgICBjb3VudGVyID0gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsICogLTE7XG4gICAgICAgICAgICBtYXggPSBfLnNsaWRlQ291bnQgKiAyO1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUgKGJyZWFrUG9pbnQgPCBtYXgpIHtcbiAgICAgICAgICAgIGluZGV4ZXMucHVzaChicmVha1BvaW50KTtcbiAgICAgICAgICAgIGJyZWFrUG9pbnQgPSBjb3VudGVyICsgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsO1xuICAgICAgICAgICAgY291bnRlciArPSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyA/IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCA6IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3c7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5kZXhlcztcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuZ2V0U2xpY2sgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuZ2V0U2xpZGVDb3VudCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgIHNsaWRlc1RyYXZlcnNlZCwgc3dpcGVkU2xpZGUsIGNlbnRlck9mZnNldDtcblxuICAgICAgICBjZW50ZXJPZmZzZXQgPSBfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSA/IF8uc2xpZGVXaWR0aCAqIE1hdGguZmxvb3IoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAvIDIpIDogMDtcblxuICAgICAgICBpZiAoXy5vcHRpb25zLnN3aXBlVG9TbGlkZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5maW5kKCcuc2xpY2stc2xpZGUnKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBzbGlkZSkge1xuICAgICAgICAgICAgICAgIGlmIChzbGlkZS5vZmZzZXRMZWZ0IC0gY2VudGVyT2Zmc2V0ICsgKCQoc2xpZGUpLm91dGVyV2lkdGgoKSAvIDIpID4gKF8uc3dpcGVMZWZ0ICogLTEpKSB7XG4gICAgICAgICAgICAgICAgICAgIHN3aXBlZFNsaWRlID0gc2xpZGU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc2xpZGVzVHJhdmVyc2VkID0gTWF0aC5hYnMoJChzd2lwZWRTbGlkZSkuYXR0cignZGF0YS1zbGljay1pbmRleCcpIC0gXy5jdXJyZW50U2xpZGUpIHx8IDE7XG5cbiAgICAgICAgICAgIHJldHVybiBzbGlkZXNUcmF2ZXJzZWQ7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuZ29UbyA9IFNsaWNrLnByb3RvdHlwZS5zbGlja0dvVG8gPSBmdW5jdGlvbihzbGlkZSwgZG9udEFuaW1hdGUpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgXy5jaGFuZ2VTbGlkZSh7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ2luZGV4JyxcbiAgICAgICAgICAgICAgICBpbmRleDogcGFyc2VJbnQoc2xpZGUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIGRvbnRBbmltYXRlKTtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKGNyZWF0aW9uKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIGlmICghJChfLiRzbGlkZXIpLmhhc0NsYXNzKCdzbGljay1pbml0aWFsaXplZCcpKSB7XG5cbiAgICAgICAgICAgICQoXy4kc2xpZGVyKS5hZGRDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKTtcblxuICAgICAgICAgICAgXy5idWlsZFJvd3MoKTtcbiAgICAgICAgICAgIF8uYnVpbGRPdXQoKTtcbiAgICAgICAgICAgIF8uc2V0UHJvcHMoKTtcbiAgICAgICAgICAgIF8uc3RhcnRMb2FkKCk7XG4gICAgICAgICAgICBfLmxvYWRTbGlkZXIoKTtcbiAgICAgICAgICAgIF8uaW5pdGlhbGl6ZUV2ZW50cygpO1xuICAgICAgICAgICAgXy51cGRhdGVBcnJvd3MoKTtcbiAgICAgICAgICAgIF8udXBkYXRlRG90cygpO1xuICAgICAgICAgICAgXy5jaGVja1Jlc3BvbnNpdmUodHJ1ZSk7XG4gICAgICAgICAgICBfLmZvY3VzSGFuZGxlcigpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3JlYXRpb24pIHtcbiAgICAgICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdpbml0JywgW19dKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgXy5pbml0QURBKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIF8ub3B0aW9ucy5hdXRvcGxheSApIHtcblxuICAgICAgICAgICAgXy5wYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIF8uYXV0b1BsYXkoKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmluaXRBREEgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuICAgICAgICBfLiRzbGlkZXMuYWRkKF8uJHNsaWRlVHJhY2suZmluZCgnLnNsaWNrLWNsb25lZCcpKS5hdHRyKHtcbiAgICAgICAgICAgICdhcmlhLWhpZGRlbic6ICd0cnVlJyxcbiAgICAgICAgICAgICd0YWJpbmRleCc6ICctMSdcbiAgICAgICAgfSkuZmluZCgnYSwgaW5wdXQsIGJ1dHRvbiwgc2VsZWN0JykuYXR0cih7XG4gICAgICAgICAgICAndGFiaW5kZXgnOiAnLTEnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIF8uJHNsaWRlVHJhY2suYXR0cigncm9sZScsICdsaXN0Ym94Jyk7XG5cbiAgICAgICAgXy4kc2xpZGVzLm5vdChfLiRzbGlkZVRyYWNrLmZpbmQoJy5zbGljay1jbG9uZWQnKSkuZWFjaChmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICAkKHRoaXMpLmF0dHIoe1xuICAgICAgICAgICAgICAgICdyb2xlJzogJ29wdGlvbicsXG4gICAgICAgICAgICAgICAgJ2FyaWEtZGVzY3JpYmVkYnknOiAnc2xpY2stc2xpZGUnICsgXy5pbnN0YW5jZVVpZCArIGkgKyAnJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChfLiRkb3RzICE9PSBudWxsKSB7XG4gICAgICAgICAgICBfLiRkb3RzLmF0dHIoJ3JvbGUnLCAndGFibGlzdCcpLmZpbmQoJ2xpJykuZWFjaChmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKHtcbiAgICAgICAgICAgICAgICAgICAgJ3JvbGUnOiAncHJlc2VudGF0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgJ2FyaWEtc2VsZWN0ZWQnOiAnZmFsc2UnLFxuICAgICAgICAgICAgICAgICAgICAnYXJpYS1jb250cm9scyc6ICduYXZpZ2F0aW9uJyArIF8uaW5zdGFuY2VVaWQgKyBpICsgJycsXG4gICAgICAgICAgICAgICAgICAgICdpZCc6ICdzbGljay1zbGlkZScgKyBfLmluc3RhbmNlVWlkICsgaSArICcnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5maXJzdCgpLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCAndHJ1ZScpLmVuZCgpXG4gICAgICAgICAgICAgICAgLmZpbmQoJ2J1dHRvbicpLmF0dHIoJ3JvbGUnLCAnYnV0dG9uJykuZW5kKClcbiAgICAgICAgICAgICAgICAuY2xvc2VzdCgnZGl2JykuYXR0cigncm9sZScsICd0b29sYmFyJyk7XG4gICAgICAgIH1cbiAgICAgICAgXy5hY3RpdmF0ZUFEQSgpO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5pbml0QXJyb3dFdmVudHMgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5hcnJvd3MgPT09IHRydWUgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuICAgICAgICAgICAgXy4kcHJldkFycm93XG4gICAgICAgICAgICAgICAub2ZmKCdjbGljay5zbGljaycpXG4gICAgICAgICAgICAgICAub24oJ2NsaWNrLnNsaWNrJywge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAncHJldmlvdXMnXG4gICAgICAgICAgICAgICB9LCBfLmNoYW5nZVNsaWRlKTtcbiAgICAgICAgICAgIF8uJG5leHRBcnJvd1xuICAgICAgICAgICAgICAgLm9mZignY2xpY2suc2xpY2snKVxuICAgICAgICAgICAgICAgLm9uKCdjbGljay5zbGljaycsIHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ25leHQnXG4gICAgICAgICAgICAgICB9LCBfLmNoYW5nZVNsaWRlKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5pbml0RG90RXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZG90cyA9PT0gdHJ1ZSAmJiBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG4gICAgICAgICAgICAkKCdsaScsIF8uJGRvdHMpLm9uKCdjbGljay5zbGljaycsIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnaW5kZXgnXG4gICAgICAgICAgICB9LCBfLmNoYW5nZVNsaWRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggXy5vcHRpb25zLmRvdHMgPT09IHRydWUgJiYgXy5vcHRpb25zLnBhdXNlT25Eb3RzSG92ZXIgPT09IHRydWUgKSB7XG5cbiAgICAgICAgICAgICQoJ2xpJywgXy4kZG90cylcbiAgICAgICAgICAgICAgICAub24oJ21vdXNlZW50ZXIuc2xpY2snLCAkLnByb3h5KF8uaW50ZXJydXB0LCBfLCB0cnVlKSlcbiAgICAgICAgICAgICAgICAub24oJ21vdXNlbGVhdmUuc2xpY2snLCAkLnByb3h5KF8uaW50ZXJydXB0LCBfLCBmYWxzZSkpO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuaW5pdFNsaWRlRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIGlmICggXy5vcHRpb25zLnBhdXNlT25Ib3ZlciApIHtcblxuICAgICAgICAgICAgXy4kbGlzdC5vbignbW91c2VlbnRlci5zbGljaycsICQucHJveHkoXy5pbnRlcnJ1cHQsIF8sIHRydWUpKTtcbiAgICAgICAgICAgIF8uJGxpc3Qub24oJ21vdXNlbGVhdmUuc2xpY2snLCAkLnByb3h5KF8uaW50ZXJydXB0LCBfLCBmYWxzZSkpO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuaW5pdGlhbGl6ZUV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBfLmluaXRBcnJvd0V2ZW50cygpO1xuXG4gICAgICAgIF8uaW5pdERvdEV2ZW50cygpO1xuICAgICAgICBfLmluaXRTbGlkZUV2ZW50cygpO1xuXG4gICAgICAgIF8uJGxpc3Qub24oJ3RvdWNoc3RhcnQuc2xpY2sgbW91c2Vkb3duLnNsaWNrJywge1xuICAgICAgICAgICAgYWN0aW9uOiAnc3RhcnQnXG4gICAgICAgIH0sIF8uc3dpcGVIYW5kbGVyKTtcbiAgICAgICAgXy4kbGlzdC5vbigndG91Y2htb3ZlLnNsaWNrIG1vdXNlbW92ZS5zbGljaycsIHtcbiAgICAgICAgICAgIGFjdGlvbjogJ21vdmUnXG4gICAgICAgIH0sIF8uc3dpcGVIYW5kbGVyKTtcbiAgICAgICAgXy4kbGlzdC5vbigndG91Y2hlbmQuc2xpY2sgbW91c2V1cC5zbGljaycsIHtcbiAgICAgICAgICAgIGFjdGlvbjogJ2VuZCdcbiAgICAgICAgfSwgXy5zd2lwZUhhbmRsZXIpO1xuICAgICAgICBfLiRsaXN0Lm9uKCd0b3VjaGNhbmNlbC5zbGljayBtb3VzZWxlYXZlLnNsaWNrJywge1xuICAgICAgICAgICAgYWN0aW9uOiAnZW5kJ1xuICAgICAgICB9LCBfLnN3aXBlSGFuZGxlcik7XG5cbiAgICAgICAgXy4kbGlzdC5vbignY2xpY2suc2xpY2snLCBfLmNsaWNrSGFuZGxlcik7XG5cbiAgICAgICAgJChkb2N1bWVudCkub24oXy52aXNpYmlsaXR5Q2hhbmdlLCAkLnByb3h5KF8udmlzaWJpbGl0eSwgXykpO1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgXy4kbGlzdC5vbigna2V5ZG93bi5zbGljaycsIF8ua2V5SGFuZGxlcik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXy5vcHRpb25zLmZvY3VzT25TZWxlY3QgPT09IHRydWUpIHtcbiAgICAgICAgICAgICQoXy4kc2xpZGVUcmFjaykuY2hpbGRyZW4oKS5vbignY2xpY2suc2xpY2snLCBfLnNlbGVjdEhhbmRsZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgJCh3aW5kb3cpLm9uKCdvcmllbnRhdGlvbmNoYW5nZS5zbGljay5zbGljay0nICsgXy5pbnN0YW5jZVVpZCwgJC5wcm94eShfLm9yaWVudGF0aW9uQ2hhbmdlLCBfKSk7XG5cbiAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUuc2xpY2suc2xpY2stJyArIF8uaW5zdGFuY2VVaWQsICQucHJveHkoXy5yZXNpemUsIF8pKTtcblxuICAgICAgICAkKCdbZHJhZ2dhYmxlIT10cnVlXScsIF8uJHNsaWRlVHJhY2spLm9uKCdkcmFnc3RhcnQnLCBfLnByZXZlbnREZWZhdWx0KTtcblxuICAgICAgICAkKHdpbmRvdykub24oJ2xvYWQuc2xpY2suc2xpY2stJyArIF8uaW5zdGFuY2VVaWQsIF8uc2V0UG9zaXRpb24pO1xuICAgICAgICAkKGRvY3VtZW50KS5vbigncmVhZHkuc2xpY2suc2xpY2stJyArIF8uaW5zdGFuY2VVaWQsIF8uc2V0UG9zaXRpb24pO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5pbml0VUkgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5hcnJvd3MgPT09IHRydWUgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuXG4gICAgICAgICAgICBfLiRwcmV2QXJyb3cuc2hvdygpO1xuICAgICAgICAgICAgXy4kbmV4dEFycm93LnNob3coKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5kb3RzID09PSB0cnVlICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcblxuICAgICAgICAgICAgXy4kZG90cy5zaG93KCk7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5rZXlIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG4gICAgICAgICAvL0RvbnQgc2xpZGUgaWYgdGhlIGN1cnNvciBpcyBpbnNpZGUgdGhlIGZvcm0gZmllbGRzIGFuZCBhcnJvdyBrZXlzIGFyZSBwcmVzc2VkXG4gICAgICAgIGlmKCFldmVudC50YXJnZXQudGFnTmFtZS5tYXRjaCgnVEVYVEFSRUF8SU5QVVR8U0VMRUNUJykpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSAzNyAmJiBfLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIF8uY2hhbmdlU2xpZGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBfLm9wdGlvbnMucnRsID09PSB0cnVlID8gJ25leHQnIDogICdwcmV2aW91cydcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5rZXlDb2RlID09PSAzOSAmJiBfLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIF8uY2hhbmdlU2xpZGUoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBfLm9wdGlvbnMucnRsID09PSB0cnVlID8gJ3ByZXZpb3VzJyA6ICduZXh0J1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUubGF6eUxvYWQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICBsb2FkUmFuZ2UsIGNsb25lUmFuZ2UsIHJhbmdlU3RhcnQsIHJhbmdlRW5kO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxvYWRJbWFnZXMoaW1hZ2VzU2NvcGUpIHtcblxuICAgICAgICAgICAgJCgnaW1nW2RhdGEtbGF6eV0nLCBpbWFnZXNTY29wZSkuZWFjaChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgIGltYWdlU291cmNlID0gJCh0aGlzKS5hdHRyKCdkYXRhLWxhenknKSxcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VUb0xvYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcblxuICAgICAgICAgICAgICAgIGltYWdlVG9Mb2FkLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGltYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAuYW5pbWF0ZSh7IG9wYWNpdHk6IDAgfSwgMTAwLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignc3JjJywgaW1hZ2VTb3VyY2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hbmltYXRlKHsgb3BhY2l0eTogMSB9LCAyMDAsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQXR0cignZGF0YS1sYXp5JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NsaWNrLWxvYWRpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ2xhenlMb2FkZWQnLCBbXywgaW1hZ2UsIGltYWdlU291cmNlXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBpbWFnZVRvTG9hZC5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCAnZGF0YS1sYXp5JyApXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoICdzbGljay1sb2FkaW5nJyApXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoICdzbGljay1sYXp5bG9hZC1lcnJvcicgKTtcblxuICAgICAgICAgICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignbGF6eUxvYWRFcnJvcicsIFsgXywgaW1hZ2UsIGltYWdlU291cmNlIF0pO1xuXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGltYWdlVG9Mb2FkLnNyYyA9IGltYWdlU291cmNlO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmluZmluaXRlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcmFuZ2VTdGFydCA9IF8uY3VycmVudFNsaWRlICsgKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLyAyICsgMSk7XG4gICAgICAgICAgICAgICAgcmFuZ2VFbmQgPSByYW5nZVN0YXJ0ICsgXy5vcHRpb25zLnNsaWRlc1RvU2hvdyArIDI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJhbmdlU3RhcnQgPSBNYXRoLm1heCgwLCBfLmN1cnJlbnRTbGlkZSAtIChfLm9wdGlvbnMuc2xpZGVzVG9TaG93IC8gMiArIDEpKTtcbiAgICAgICAgICAgICAgICByYW5nZUVuZCA9IDIgKyAoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAvIDIgKyAxKSArIF8uY3VycmVudFNsaWRlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmFuZ2VTdGFydCA9IF8ub3B0aW9ucy5pbmZpbml0ZSA/IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgKyBfLmN1cnJlbnRTbGlkZSA6IF8uY3VycmVudFNsaWRlO1xuICAgICAgICAgICAgcmFuZ2VFbmQgPSBNYXRoLmNlaWwocmFuZ2VTdGFydCArIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpO1xuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJhbmdlU3RhcnQgPiAwKSByYW5nZVN0YXJ0LS07XG4gICAgICAgICAgICAgICAgaWYgKHJhbmdlRW5kIDw9IF8uc2xpZGVDb3VudCkgcmFuZ2VFbmQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxvYWRSYW5nZSA9IF8uJHNsaWRlci5maW5kKCcuc2xpY2stc2xpZGUnKS5zbGljZShyYW5nZVN0YXJ0LCByYW5nZUVuZCk7XG4gICAgICAgIGxvYWRJbWFnZXMobG9hZFJhbmdlKTtcblxuICAgICAgICBpZiAoXy5zbGlkZUNvdW50IDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcbiAgICAgICAgICAgIGNsb25lUmFuZ2UgPSBfLiRzbGlkZXIuZmluZCgnLnNsaWNrLXNsaWRlJyk7XG4gICAgICAgICAgICBsb2FkSW1hZ2VzKGNsb25lUmFuZ2UpO1xuICAgICAgICB9IGVsc2VcbiAgICAgICAgaWYgKF8uY3VycmVudFNsaWRlID49IF8uc2xpZGVDb3VudCAtIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcbiAgICAgICAgICAgIGNsb25lUmFuZ2UgPSBfLiRzbGlkZXIuZmluZCgnLnNsaWNrLWNsb25lZCcpLnNsaWNlKDAsIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpO1xuICAgICAgICAgICAgbG9hZEltYWdlcyhjbG9uZVJhbmdlKTtcbiAgICAgICAgfSBlbHNlIGlmIChfLmN1cnJlbnRTbGlkZSA9PT0gMCkge1xuICAgICAgICAgICAgY2xvbmVSYW5nZSA9IF8uJHNsaWRlci5maW5kKCcuc2xpY2stY2xvbmVkJykuc2xpY2UoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAqIC0xKTtcbiAgICAgICAgICAgIGxvYWRJbWFnZXMoY2xvbmVSYW5nZSk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUubG9hZFNsaWRlciA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBfLnNldFBvc2l0aW9uKCk7XG5cbiAgICAgICAgXy4kc2xpZGVUcmFjay5jc3Moe1xuICAgICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICB9KTtcblxuICAgICAgICBfLiRzbGlkZXIucmVtb3ZlQ2xhc3MoJ3NsaWNrLWxvYWRpbmcnKTtcblxuICAgICAgICBfLmluaXRVSSgpO1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMubGF6eUxvYWQgPT09ICdwcm9ncmVzc2l2ZScpIHtcbiAgICAgICAgICAgIF8ucHJvZ3Jlc3NpdmVMYXp5TG9hZCgpO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLm5leHQgPSBTbGljay5wcm90b3R5cGUuc2xpY2tOZXh0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIF8uY2hhbmdlU2xpZGUoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICduZXh0J1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUub3JpZW50YXRpb25DaGFuZ2UgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgXy5jaGVja1Jlc3BvbnNpdmUoKTtcbiAgICAgICAgXy5zZXRQb3NpdGlvbigpO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5wYXVzZSA9IFNsaWNrLnByb3RvdHlwZS5zbGlja1BhdXNlID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIF8uYXV0b1BsYXlDbGVhcigpO1xuICAgICAgICBfLnBhdXNlZCA9IHRydWU7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnBsYXkgPSBTbGljay5wcm90b3R5cGUuc2xpY2tQbGF5ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIF8uYXV0b1BsYXkoKTtcbiAgICAgICAgXy5vcHRpb25zLmF1dG9wbGF5ID0gdHJ1ZTtcbiAgICAgICAgXy5wYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgXy5mb2N1c3NlZCA9IGZhbHNlO1xuICAgICAgICBfLmludGVycnVwdGVkID0gZmFsc2U7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnBvc3RTbGlkZSA9IGZ1bmN0aW9uKGluZGV4KSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIGlmKCAhXy51bnNsaWNrZWQgKSB7XG5cbiAgICAgICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdhZnRlckNoYW5nZScsIFtfLCBpbmRleF0pO1xuXG4gICAgICAgICAgICBfLmFuaW1hdGluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICBfLnNldFBvc2l0aW9uKCk7XG5cbiAgICAgICAgICAgIF8uc3dpcGVMZWZ0ID0gbnVsbDtcblxuICAgICAgICAgICAgaWYgKCBfLm9wdGlvbnMuYXV0b3BsYXkgKSB7XG4gICAgICAgICAgICAgICAgXy5hdXRvUGxheSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmFjY2Vzc2liaWxpdHkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBfLmluaXRBREEoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnByZXYgPSBTbGljay5wcm90b3R5cGUuc2xpY2tQcmV2ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIF8uY2hhbmdlU2xpZGUoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdwcmV2aW91cydcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnByZXZlbnREZWZhdWx0ID0gZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5wcm9ncmVzc2l2ZUxhenlMb2FkID0gZnVuY3Rpb24oIHRyeUNvdW50ICkge1xuXG4gICAgICAgIHRyeUNvdW50ID0gdHJ5Q291bnQgfHwgMTtcblxuICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICAkaW1nc1RvTG9hZCA9ICQoICdpbWdbZGF0YS1sYXp5XScsIF8uJHNsaWRlciApLFxuICAgICAgICAgICAgaW1hZ2UsXG4gICAgICAgICAgICBpbWFnZVNvdXJjZSxcbiAgICAgICAgICAgIGltYWdlVG9Mb2FkO1xuXG4gICAgICAgIGlmICggJGltZ3NUb0xvYWQubGVuZ3RoICkge1xuXG4gICAgICAgICAgICBpbWFnZSA9ICRpbWdzVG9Mb2FkLmZpcnN0KCk7XG4gICAgICAgICAgICBpbWFnZVNvdXJjZSA9IGltYWdlLmF0dHIoJ2RhdGEtbGF6eScpO1xuICAgICAgICAgICAgaW1hZ2VUb0xvYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcblxuICAgICAgICAgICAgaW1hZ2VUb0xvYWQub25sb2FkID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICBpbWFnZVxuICAgICAgICAgICAgICAgICAgICAuYXR0ciggJ3NyYycsIGltYWdlU291cmNlIClcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUF0dHIoJ2RhdGEtbGF6eScpXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnc2xpY2stbG9hZGluZycpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBfLm9wdGlvbnMuYWRhcHRpdmVIZWlnaHQgPT09IHRydWUgKSB7XG4gICAgICAgICAgICAgICAgICAgIF8uc2V0UG9zaXRpb24oKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignbGF6eUxvYWRlZCcsIFsgXywgaW1hZ2UsIGltYWdlU291cmNlIF0pO1xuICAgICAgICAgICAgICAgIF8ucHJvZ3Jlc3NpdmVMYXp5TG9hZCgpO1xuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpbWFnZVRvTG9hZC5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoIHRyeUNvdW50IDwgMyApIHtcblxuICAgICAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgICAgICogdHJ5IHRvIGxvYWQgdGhlIGltYWdlIDMgdGltZXMsXG4gICAgICAgICAgICAgICAgICAgICAqIGxlYXZlIGEgc2xpZ2h0IGRlbGF5IHNvIHdlIGRvbid0IGdldFxuICAgICAgICAgICAgICAgICAgICAgKiBzZXJ2ZXJzIGJsb2NraW5nIHRoZSByZXF1ZXN0LlxuICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfLnByb2dyZXNzaXZlTGF6eUxvYWQoIHRyeUNvdW50ICsgMSApO1xuICAgICAgICAgICAgICAgICAgICB9LCA1MDAgKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCAnZGF0YS1sYXp5JyApXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoICdzbGljay1sb2FkaW5nJyApXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoICdzbGljay1sYXp5bG9hZC1lcnJvcicgKTtcblxuICAgICAgICAgICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignbGF6eUxvYWRFcnJvcicsIFsgXywgaW1hZ2UsIGltYWdlU291cmNlIF0pO1xuXG4gICAgICAgICAgICAgICAgICAgIF8ucHJvZ3Jlc3NpdmVMYXp5TG9hZCgpO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpbWFnZVRvTG9hZC5zcmMgPSBpbWFnZVNvdXJjZTtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignYWxsSW1hZ2VzTG9hZGVkJywgWyBfIF0pO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUucmVmcmVzaCA9IGZ1bmN0aW9uKCBpbml0aWFsaXppbmcgKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLCBjdXJyZW50U2xpZGUsIGxhc3RWaXNpYmxlSW5kZXg7XG5cbiAgICAgICAgbGFzdFZpc2libGVJbmRleCA9IF8uc2xpZGVDb3VudCAtIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3c7XG5cbiAgICAgICAgLy8gaW4gbm9uLWluZmluaXRlIHNsaWRlcnMsIHdlIGRvbid0IHdhbnQgdG8gZ28gcGFzdCB0aGVcbiAgICAgICAgLy8gbGFzdCB2aXNpYmxlIGluZGV4LlxuICAgICAgICBpZiggIV8ub3B0aW9ucy5pbmZpbml0ZSAmJiAoIF8uY3VycmVudFNsaWRlID4gbGFzdFZpc2libGVJbmRleCApKSB7XG4gICAgICAgICAgICBfLmN1cnJlbnRTbGlkZSA9IGxhc3RWaXNpYmxlSW5kZXg7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiBsZXNzIHNsaWRlcyB0aGFuIHRvIHNob3csIGdvIHRvIHN0YXJ0LlxuICAgICAgICBpZiAoIF8uc2xpZGVDb3VudCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICkge1xuICAgICAgICAgICAgXy5jdXJyZW50U2xpZGUgPSAwO1xuXG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50U2xpZGUgPSBfLmN1cnJlbnRTbGlkZTtcblxuICAgICAgICBfLmRlc3Ryb3kodHJ1ZSk7XG5cbiAgICAgICAgJC5leHRlbmQoXywgXy5pbml0aWFscywgeyBjdXJyZW50U2xpZGU6IGN1cnJlbnRTbGlkZSB9KTtcblxuICAgICAgICBfLmluaXQoKTtcblxuICAgICAgICBpZiggIWluaXRpYWxpemluZyApIHtcblxuICAgICAgICAgICAgXy5jaGFuZ2VTbGlkZSh7XG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnaW5kZXgnLFxuICAgICAgICAgICAgICAgICAgICBpbmRleDogY3VycmVudFNsaWRlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgZmFsc2UpO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUucmVnaXN0ZXJCcmVha3BvaW50cyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcywgYnJlYWtwb2ludCwgY3VycmVudEJyZWFrcG9pbnQsIGwsXG4gICAgICAgICAgICByZXNwb25zaXZlU2V0dGluZ3MgPSBfLm9wdGlvbnMucmVzcG9uc2l2ZSB8fCBudWxsO1xuXG4gICAgICAgIGlmICggJC50eXBlKHJlc3BvbnNpdmVTZXR0aW5ncykgPT09ICdhcnJheScgJiYgcmVzcG9uc2l2ZVNldHRpbmdzLmxlbmd0aCApIHtcblxuICAgICAgICAgICAgXy5yZXNwb25kVG8gPSBfLm9wdGlvbnMucmVzcG9uZFRvIHx8ICd3aW5kb3cnO1xuXG4gICAgICAgICAgICBmb3IgKCBicmVha3BvaW50IGluIHJlc3BvbnNpdmVTZXR0aW5ncyApIHtcblxuICAgICAgICAgICAgICAgIGwgPSBfLmJyZWFrcG9pbnRzLmxlbmd0aC0xO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRCcmVha3BvaW50ID0gcmVzcG9uc2l2ZVNldHRpbmdzW2JyZWFrcG9pbnRdLmJyZWFrcG9pbnQ7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2l2ZVNldHRpbmdzLmhhc093blByb3BlcnR5KGJyZWFrcG9pbnQpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBicmVha3BvaW50cyBhbmQgY3V0IG91dCBhbnkgZXhpc3RpbmdcbiAgICAgICAgICAgICAgICAgICAgLy8gb25lcyB3aXRoIHRoZSBzYW1lIGJyZWFrcG9pbnQgbnVtYmVyLCB3ZSBkb24ndCB3YW50IGR1cGVzLlxuICAgICAgICAgICAgICAgICAgICB3aGlsZSggbCA+PSAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIF8uYnJlYWtwb2ludHNbbF0gJiYgXy5icmVha3BvaW50c1tsXSA9PT0gY3VycmVudEJyZWFrcG9pbnQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5icmVha3BvaW50cy5zcGxpY2UobCwxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGwtLTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIF8uYnJlYWtwb2ludHMucHVzaChjdXJyZW50QnJlYWtwb2ludCk7XG4gICAgICAgICAgICAgICAgICAgIF8uYnJlYWtwb2ludFNldHRpbmdzW2N1cnJlbnRCcmVha3BvaW50XSA9IHJlc3BvbnNpdmVTZXR0aW5nc1ticmVha3BvaW50XS5zZXR0aW5ncztcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfLmJyZWFrcG9pbnRzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiAoIF8ub3B0aW9ucy5tb2JpbGVGaXJzdCApID8gYS1iIDogYi1hO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5yZWluaXQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgXy4kc2xpZGVzID1cbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2tcbiAgICAgICAgICAgICAgICAuY2hpbGRyZW4oXy5vcHRpb25zLnNsaWRlKVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stc2xpZGUnKTtcblxuICAgICAgICBfLnNsaWRlQ291bnQgPSBfLiRzbGlkZXMubGVuZ3RoO1xuXG4gICAgICAgIGlmIChfLmN1cnJlbnRTbGlkZSA+PSBfLnNsaWRlQ291bnQgJiYgXy5jdXJyZW50U2xpZGUgIT09IDApIHtcbiAgICAgICAgICAgIF8uY3VycmVudFNsaWRlID0gXy5jdXJyZW50U2xpZGUgLSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXy5zbGlkZUNvdW50IDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcbiAgICAgICAgICAgIF8uY3VycmVudFNsaWRlID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIF8ucmVnaXN0ZXJCcmVha3BvaW50cygpO1xuXG4gICAgICAgIF8uc2V0UHJvcHMoKTtcbiAgICAgICAgXy5zZXR1cEluZmluaXRlKCk7XG4gICAgICAgIF8uYnVpbGRBcnJvd3MoKTtcbiAgICAgICAgXy51cGRhdGVBcnJvd3MoKTtcbiAgICAgICAgXy5pbml0QXJyb3dFdmVudHMoKTtcbiAgICAgICAgXy5idWlsZERvdHMoKTtcbiAgICAgICAgXy51cGRhdGVEb3RzKCk7XG4gICAgICAgIF8uaW5pdERvdEV2ZW50cygpO1xuICAgICAgICBfLmNsZWFuVXBTbGlkZUV2ZW50cygpO1xuICAgICAgICBfLmluaXRTbGlkZUV2ZW50cygpO1xuXG4gICAgICAgIF8uY2hlY2tSZXNwb25zaXZlKGZhbHNlLCB0cnVlKTtcblxuICAgICAgICBpZiAoXy5vcHRpb25zLmZvY3VzT25TZWxlY3QgPT09IHRydWUpIHtcbiAgICAgICAgICAgICQoXy4kc2xpZGVUcmFjaykuY2hpbGRyZW4oKS5vbignY2xpY2suc2xpY2snLCBfLnNlbGVjdEhhbmRsZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgXy5zZXRTbGlkZUNsYXNzZXModHlwZW9mIF8uY3VycmVudFNsaWRlID09PSAnbnVtYmVyJyA/IF8uY3VycmVudFNsaWRlIDogMCk7XG5cbiAgICAgICAgXy5zZXRQb3NpdGlvbigpO1xuICAgICAgICBfLmZvY3VzSGFuZGxlcigpO1xuXG4gICAgICAgIF8ucGF1c2VkID0gIV8ub3B0aW9ucy5hdXRvcGxheTtcbiAgICAgICAgXy5hdXRvUGxheSgpO1xuXG4gICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdyZUluaXQnLCBbX10pO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpICE9PSBfLndpbmRvd1dpZHRoKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoXy53aW5kb3dEZWxheSk7XG4gICAgICAgICAgICBfLndpbmRvd0RlbGF5ID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgXy53aW5kb3dXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xuICAgICAgICAgICAgICAgIF8uY2hlY2tSZXNwb25zaXZlKCk7XG4gICAgICAgICAgICAgICAgaWYoICFfLnVuc2xpY2tlZCApIHsgXy5zZXRQb3NpdGlvbigpOyB9XG4gICAgICAgICAgICB9LCA1MCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnJlbW92ZVNsaWRlID0gU2xpY2sucHJvdG90eXBlLnNsaWNrUmVtb3ZlID0gZnVuY3Rpb24oaW5kZXgsIHJlbW92ZUJlZm9yZSwgcmVtb3ZlQWxsKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIGlmICh0eXBlb2YoaW5kZXgpID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIHJlbW92ZUJlZm9yZSA9IGluZGV4O1xuICAgICAgICAgICAgaW5kZXggPSByZW1vdmVCZWZvcmUgPT09IHRydWUgPyAwIDogXy5zbGlkZUNvdW50IC0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluZGV4ID0gcmVtb3ZlQmVmb3JlID09PSB0cnVlID8gLS1pbmRleCA6IGluZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF8uc2xpZGVDb3VudCA8IDEgfHwgaW5kZXggPCAwIHx8IGluZGV4ID4gXy5zbGlkZUNvdW50IC0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgXy51bmxvYWQoKTtcblxuICAgICAgICBpZiAocmVtb3ZlQWxsID09PSB0cnVlKSB7XG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKCkucmVtb3ZlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZXEoaW5kZXgpLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgXy4kc2xpZGVzID0gXy4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpO1xuXG4gICAgICAgIF8uJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKS5kZXRhY2goKTtcblxuICAgICAgICBfLiRzbGlkZVRyYWNrLmFwcGVuZChfLiRzbGlkZXMpO1xuXG4gICAgICAgIF8uJHNsaWRlc0NhY2hlID0gXy4kc2xpZGVzO1xuXG4gICAgICAgIF8ucmVpbml0KCk7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnNldENTUyA9IGZ1bmN0aW9uKHBvc2l0aW9uKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgcG9zaXRpb25Qcm9wcyA9IHt9LFxuICAgICAgICAgICAgeCwgeTtcblxuICAgICAgICBpZiAoXy5vcHRpb25zLnJ0bCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcG9zaXRpb24gPSAtcG9zaXRpb247XG4gICAgICAgIH1cbiAgICAgICAgeCA9IF8ucG9zaXRpb25Qcm9wID09ICdsZWZ0JyA/IE1hdGguY2VpbChwb3NpdGlvbikgKyAncHgnIDogJzBweCc7XG4gICAgICAgIHkgPSBfLnBvc2l0aW9uUHJvcCA9PSAndG9wJyA/IE1hdGguY2VpbChwb3NpdGlvbikgKyAncHgnIDogJzBweCc7XG5cbiAgICAgICAgcG9zaXRpb25Qcm9wc1tfLnBvc2l0aW9uUHJvcF0gPSBwb3NpdGlvbjtcblxuICAgICAgICBpZiAoXy50cmFuc2Zvcm1zRW5hYmxlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY3NzKHBvc2l0aW9uUHJvcHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcG9zaXRpb25Qcm9wcyA9IHt9O1xuICAgICAgICAgICAgaWYgKF8uY3NzVHJhbnNpdGlvbnMgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb25Qcm9wc1tfLmFuaW1UeXBlXSA9ICd0cmFuc2xhdGUoJyArIHggKyAnLCAnICsgeSArICcpJztcbiAgICAgICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNzcyhwb3NpdGlvblByb3BzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb25Qcm9wc1tfLmFuaW1UeXBlXSA9ICd0cmFuc2xhdGUzZCgnICsgeCArICcsICcgKyB5ICsgJywgMHB4KSc7XG4gICAgICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jc3MocG9zaXRpb25Qcm9wcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuc2V0RGltZW5zaW9ucyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsID09PSBmYWxzZSkge1xuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgXy4kbGlzdC5jc3Moe1xuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAoJzBweCAnICsgXy5vcHRpb25zLmNlbnRlclBhZGRpbmcpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfLiRsaXN0LmhlaWdodChfLiRzbGlkZXMuZmlyc3QoKS5vdXRlckhlaWdodCh0cnVlKSAqIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpO1xuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgXy4kbGlzdC5jc3Moe1xuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAoXy5vcHRpb25zLmNlbnRlclBhZGRpbmcgKyAnIDBweCcpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfLmxpc3RXaWR0aCA9IF8uJGxpc3Qud2lkdGgoKTtcbiAgICAgICAgXy5saXN0SGVpZ2h0ID0gXy4kbGlzdC5oZWlnaHQoKTtcblxuXG4gICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWwgPT09IGZhbHNlICYmIF8ub3B0aW9ucy52YXJpYWJsZVdpZHRoID09PSBmYWxzZSkge1xuICAgICAgICAgICAgXy5zbGlkZVdpZHRoID0gTWF0aC5jZWlsKF8ubGlzdFdpZHRoIC8gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyk7XG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLndpZHRoKE1hdGguY2VpbCgoXy5zbGlkZVdpZHRoICogXy4kc2xpZGVUcmFjay5jaGlsZHJlbignLnNsaWNrLXNsaWRlJykubGVuZ3RoKSkpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoXy5vcHRpb25zLnZhcmlhYmxlV2lkdGggPT09IHRydWUpIHtcbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2sud2lkdGgoNTAwMCAqIF8uc2xpZGVDb3VudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfLnNsaWRlV2lkdGggPSBNYXRoLmNlaWwoXy5saXN0V2lkdGgpO1xuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5oZWlnaHQoTWF0aC5jZWlsKChfLiRzbGlkZXMuZmlyc3QoKS5vdXRlckhlaWdodCh0cnVlKSAqIF8uJHNsaWRlVHJhY2suY2hpbGRyZW4oJy5zbGljay1zbGlkZScpLmxlbmd0aCkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBvZmZzZXQgPSBfLiRzbGlkZXMuZmlyc3QoKS5vdXRlcldpZHRoKHRydWUpIC0gXy4kc2xpZGVzLmZpcnN0KCkud2lkdGgoKTtcbiAgICAgICAgaWYgKF8ub3B0aW9ucy52YXJpYWJsZVdpZHRoID09PSBmYWxzZSkgXy4kc2xpZGVUcmFjay5jaGlsZHJlbignLnNsaWNrLXNsaWRlJykud2lkdGgoXy5zbGlkZVdpZHRoIC0gb2Zmc2V0KTtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuc2V0RmFkZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgIHRhcmdldExlZnQ7XG5cbiAgICAgICAgXy4kc2xpZGVzLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRhcmdldExlZnQgPSAoXy5zbGlkZVdpZHRoICogaW5kZXgpICogLTE7XG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLnJ0bCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICQoZWxlbWVudCkuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0OiB0YXJnZXRMZWZ0LFxuICAgICAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleDogXy5vcHRpb25zLnpJbmRleCAtIDIsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJChlbGVtZW50KS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogdGFyZ2V0TGVmdCxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IF8ub3B0aW9ucy56SW5kZXggLSAyLFxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIF8uJHNsaWRlcy5lcShfLmN1cnJlbnRTbGlkZSkuY3NzKHtcbiAgICAgICAgICAgIHpJbmRleDogXy5vcHRpb25zLnpJbmRleCAtIDEsXG4gICAgICAgICAgICBvcGFjaXR5OiAxXG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5zZXRIZWlnaHQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgPT09IDEgJiYgXy5vcHRpb25zLmFkYXB0aXZlSGVpZ2h0ID09PSB0cnVlICYmIF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHZhciB0YXJnZXRIZWlnaHQgPSBfLiRzbGlkZXMuZXEoXy5jdXJyZW50U2xpZGUpLm91dGVySGVpZ2h0KHRydWUpO1xuICAgICAgICAgICAgXy4kbGlzdC5jc3MoJ2hlaWdodCcsIHRhcmdldEhlaWdodCk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuc2V0T3B0aW9uID1cbiAgICBTbGljay5wcm90b3R5cGUuc2xpY2tTZXRPcHRpb24gPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogYWNjZXB0cyBhcmd1bWVudHMgaW4gZm9ybWF0IG9mOlxuICAgICAgICAgKlxuICAgICAgICAgKiAgLSBmb3IgY2hhbmdpbmcgYSBzaW5nbGUgb3B0aW9uJ3MgdmFsdWU6XG4gICAgICAgICAqICAgICAuc2xpY2soXCJzZXRPcHRpb25cIiwgb3B0aW9uLCB2YWx1ZSwgcmVmcmVzaCApXG4gICAgICAgICAqXG4gICAgICAgICAqICAtIGZvciBjaGFuZ2luZyBhIHNldCBvZiByZXNwb25zaXZlIG9wdGlvbnM6XG4gICAgICAgICAqICAgICAuc2xpY2soXCJzZXRPcHRpb25cIiwgJ3Jlc3BvbnNpdmUnLCBbe30sIC4uLl0sIHJlZnJlc2ggKVxuICAgICAgICAgKlxuICAgICAgICAgKiAgLSBmb3IgdXBkYXRpbmcgbXVsdGlwbGUgdmFsdWVzIGF0IG9uY2UgKG5vdCByZXNwb25zaXZlKVxuICAgICAgICAgKiAgICAgLnNsaWNrKFwic2V0T3B0aW9uXCIsIHsgJ29wdGlvbic6IHZhbHVlLCAuLi4gfSwgcmVmcmVzaCApXG4gICAgICAgICAqL1xuXG4gICAgICAgIHZhciBfID0gdGhpcywgbCwgaXRlbSwgb3B0aW9uLCB2YWx1ZSwgcmVmcmVzaCA9IGZhbHNlLCB0eXBlO1xuXG4gICAgICAgIGlmKCAkLnR5cGUoIGFyZ3VtZW50c1swXSApID09PSAnb2JqZWN0JyApIHtcblxuICAgICAgICAgICAgb3B0aW9uID0gIGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgIHJlZnJlc2ggPSBhcmd1bWVudHNbMV07XG4gICAgICAgICAgICB0eXBlID0gJ211bHRpcGxlJztcblxuICAgICAgICB9IGVsc2UgaWYgKCAkLnR5cGUoIGFyZ3VtZW50c1swXSApID09PSAnc3RyaW5nJyApIHtcblxuICAgICAgICAgICAgb3B0aW9uID0gIGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgIHZhbHVlID0gYXJndW1lbnRzWzFdO1xuICAgICAgICAgICAgcmVmcmVzaCA9IGFyZ3VtZW50c1syXTtcblxuICAgICAgICAgICAgaWYgKCBhcmd1bWVudHNbMF0gPT09ICdyZXNwb25zaXZlJyAmJiAkLnR5cGUoIGFyZ3VtZW50c1sxXSApID09PSAnYXJyYXknICkge1xuXG4gICAgICAgICAgICAgICAgdHlwZSA9ICdyZXNwb25zaXZlJztcblxuICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZW9mIGFyZ3VtZW50c1sxXSAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cbiAgICAgICAgICAgICAgICB0eXBlID0gJ3NpbmdsZSc7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCB0eXBlID09PSAnc2luZ2xlJyApIHtcblxuICAgICAgICAgICAgXy5vcHRpb25zW29wdGlvbl0gPSB2YWx1ZTtcblxuXG4gICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdtdWx0aXBsZScgKSB7XG5cbiAgICAgICAgICAgICQuZWFjaCggb3B0aW9uICwgZnVuY3Rpb24oIG9wdCwgdmFsICkge1xuXG4gICAgICAgICAgICAgICAgXy5vcHRpb25zW29wdF0gPSB2YWw7XG5cbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ3Jlc3BvbnNpdmUnICkge1xuXG4gICAgICAgICAgICBmb3IgKCBpdGVtIGluIHZhbHVlICkge1xuXG4gICAgICAgICAgICAgICAgaWYoICQudHlwZSggXy5vcHRpb25zLnJlc3BvbnNpdmUgKSAhPT0gJ2FycmF5JyApIHtcblxuICAgICAgICAgICAgICAgICAgICBfLm9wdGlvbnMucmVzcG9uc2l2ZSA9IFsgdmFsdWVbaXRlbV0gXTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgbCA9IF8ub3B0aW9ucy5yZXNwb25zaXZlLmxlbmd0aC0xO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgcmVzcG9uc2l2ZSBvYmplY3QgYW5kIHNwbGljZSBvdXQgZHVwbGljYXRlcy5cbiAgICAgICAgICAgICAgICAgICAgd2hpbGUoIGwgPj0gMCApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIF8ub3B0aW9ucy5yZXNwb25zaXZlW2xdLmJyZWFrcG9pbnQgPT09IHZhbHVlW2l0ZW1dLmJyZWFrcG9pbnQgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLm9wdGlvbnMucmVzcG9uc2l2ZS5zcGxpY2UobCwxKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBsLS07XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIF8ub3B0aW9ucy5yZXNwb25zaXZlLnB1c2goIHZhbHVlW2l0ZW1dICk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCByZWZyZXNoICkge1xuXG4gICAgICAgICAgICBfLnVubG9hZCgpO1xuICAgICAgICAgICAgXy5yZWluaXQoKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnNldFBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIF8uc2V0RGltZW5zaW9ucygpO1xuXG4gICAgICAgIF8uc2V0SGVpZ2h0KCk7XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgXy5zZXRDU1MoXy5nZXRMZWZ0KF8uY3VycmVudFNsaWRlKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfLnNldEZhZGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdzZXRQb3NpdGlvbicsIFtfXSk7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnNldFByb3BzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgYm9keVN0eWxlID0gZG9jdW1lbnQuYm9keS5zdHlsZTtcblxuICAgICAgICBfLnBvc2l0aW9uUHJvcCA9IF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gdHJ1ZSA/ICd0b3AnIDogJ2xlZnQnO1xuXG4gICAgICAgIGlmIChfLnBvc2l0aW9uUHJvcCA9PT0gJ3RvcCcpIHtcbiAgICAgICAgICAgIF8uJHNsaWRlci5hZGRDbGFzcygnc2xpY2stdmVydGljYWwnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF8uJHNsaWRlci5yZW1vdmVDbGFzcygnc2xpY2stdmVydGljYWwnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChib2R5U3R5bGUuV2Via2l0VHJhbnNpdGlvbiAhPT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICBib2R5U3R5bGUuTW96VHJhbnNpdGlvbiAhPT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICBib2R5U3R5bGUubXNUcmFuc2l0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMudXNlQ1NTID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgXy5jc3NUcmFuc2l0aW9ucyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIF8ub3B0aW9ucy5mYWRlICkge1xuICAgICAgICAgICAgaWYgKCB0eXBlb2YgXy5vcHRpb25zLnpJbmRleCA9PT0gJ251bWJlcicgKSB7XG4gICAgICAgICAgICAgICAgaWYoIF8ub3B0aW9ucy56SW5kZXggPCAzICkge1xuICAgICAgICAgICAgICAgICAgICBfLm9wdGlvbnMuekluZGV4ID0gMztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF8ub3B0aW9ucy56SW5kZXggPSBfLmRlZmF1bHRzLnpJbmRleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChib2R5U3R5bGUuT1RyYW5zZm9ybSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBfLmFuaW1UeXBlID0gJ09UcmFuc2Zvcm0nO1xuICAgICAgICAgICAgXy50cmFuc2Zvcm1UeXBlID0gJy1vLXRyYW5zZm9ybSc7XG4gICAgICAgICAgICBfLnRyYW5zaXRpb25UeXBlID0gJ09UcmFuc2l0aW9uJztcbiAgICAgICAgICAgIGlmIChib2R5U3R5bGUucGVyc3BlY3RpdmVQcm9wZXJ0eSA9PT0gdW5kZWZpbmVkICYmIGJvZHlTdHlsZS53ZWJraXRQZXJzcGVjdGl2ZSA9PT0gdW5kZWZpbmVkKSBfLmFuaW1UeXBlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJvZHlTdHlsZS5Nb3pUcmFuc2Zvcm0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgXy5hbmltVHlwZSA9ICdNb3pUcmFuc2Zvcm0nO1xuICAgICAgICAgICAgXy50cmFuc2Zvcm1UeXBlID0gJy1tb3otdHJhbnNmb3JtJztcbiAgICAgICAgICAgIF8udHJhbnNpdGlvblR5cGUgPSAnTW96VHJhbnNpdGlvbic7XG4gICAgICAgICAgICBpZiAoYm9keVN0eWxlLnBlcnNwZWN0aXZlUHJvcGVydHkgPT09IHVuZGVmaW5lZCAmJiBib2R5U3R5bGUuTW96UGVyc3BlY3RpdmUgPT09IHVuZGVmaW5lZCkgXy5hbmltVHlwZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChib2R5U3R5bGUud2Via2l0VHJhbnNmb3JtICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIF8uYW5pbVR5cGUgPSAnd2Via2l0VHJhbnNmb3JtJztcbiAgICAgICAgICAgIF8udHJhbnNmb3JtVHlwZSA9ICctd2Via2l0LXRyYW5zZm9ybSc7XG4gICAgICAgICAgICBfLnRyYW5zaXRpb25UeXBlID0gJ3dlYmtpdFRyYW5zaXRpb24nO1xuICAgICAgICAgICAgaWYgKGJvZHlTdHlsZS5wZXJzcGVjdGl2ZVByb3BlcnR5ID09PSB1bmRlZmluZWQgJiYgYm9keVN0eWxlLndlYmtpdFBlcnNwZWN0aXZlID09PSB1bmRlZmluZWQpIF8uYW5pbVR5cGUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYm9keVN0eWxlLm1zVHJhbnNmb3JtICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIF8uYW5pbVR5cGUgPSAnbXNUcmFuc2Zvcm0nO1xuICAgICAgICAgICAgXy50cmFuc2Zvcm1UeXBlID0gJy1tcy10cmFuc2Zvcm0nO1xuICAgICAgICAgICAgXy50cmFuc2l0aW9uVHlwZSA9ICdtc1RyYW5zaXRpb24nO1xuICAgICAgICAgICAgaWYgKGJvZHlTdHlsZS5tc1RyYW5zZm9ybSA9PT0gdW5kZWZpbmVkKSBfLmFuaW1UeXBlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJvZHlTdHlsZS50cmFuc2Zvcm0gIT09IHVuZGVmaW5lZCAmJiBfLmFuaW1UeXBlICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgXy5hbmltVHlwZSA9ICd0cmFuc2Zvcm0nO1xuICAgICAgICAgICAgXy50cmFuc2Zvcm1UeXBlID0gJ3RyYW5zZm9ybSc7XG4gICAgICAgICAgICBfLnRyYW5zaXRpb25UeXBlID0gJ3RyYW5zaXRpb24nO1xuICAgICAgICB9XG4gICAgICAgIF8udHJhbnNmb3Jtc0VuYWJsZWQgPSBfLm9wdGlvbnMudXNlVHJhbnNmb3JtICYmIChfLmFuaW1UeXBlICE9PSBudWxsICYmIF8uYW5pbVR5cGUgIT09IGZhbHNlKTtcbiAgICB9O1xuXG5cbiAgICBTbGljay5wcm90b3R5cGUuc2V0U2xpZGVDbGFzc2VzID0gZnVuY3Rpb24oaW5kZXgpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICBjZW50ZXJPZmZzZXQsIGFsbFNsaWRlcywgaW5kZXhPZmZzZXQsIHJlbWFpbmRlcjtcblxuICAgICAgICBhbGxTbGlkZXMgPSBfLiRzbGlkZXJcbiAgICAgICAgICAgIC5maW5kKCcuc2xpY2stc2xpZGUnKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdzbGljay1hY3RpdmUgc2xpY2stY2VudGVyIHNsaWNrLWN1cnJlbnQnKVxuICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgICAgICBfLiRzbGlkZXNcbiAgICAgICAgICAgIC5lcShpbmRleClcbiAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stY3VycmVudCcpO1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSkge1xuXG4gICAgICAgICAgICBjZW50ZXJPZmZzZXQgPSBNYXRoLmZsb29yKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLyAyKTtcblxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gdHJ1ZSkge1xuXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID49IGNlbnRlck9mZnNldCAmJiBpbmRleCA8PSAoXy5zbGlkZUNvdW50IC0gMSkgLSBjZW50ZXJPZmZzZXQpIHtcblxuICAgICAgICAgICAgICAgICAgICBfLiRzbGlkZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zbGljZShpbmRleCAtIGNlbnRlck9mZnNldCwgaW5kZXggKyBjZW50ZXJPZmZzZXQgKyAxKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1hY3RpdmUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIGluZGV4T2Zmc2V0ID0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyArIGluZGV4O1xuICAgICAgICAgICAgICAgICAgICBhbGxTbGlkZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zbGljZShpbmRleE9mZnNldCAtIGNlbnRlck9mZnNldCArIDEsIGluZGV4T2Zmc2V0ICsgY2VudGVyT2Zmc2V0ICsgMilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stYWN0aXZlJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgYWxsU2xpZGVzXG4gICAgICAgICAgICAgICAgICAgICAgICAuZXEoYWxsU2xpZGVzLmxlbmd0aCAtIDEgLSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1jZW50ZXInKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5kZXggPT09IF8uc2xpZGVDb3VudCAtIDEpIHtcblxuICAgICAgICAgICAgICAgICAgICBhbGxTbGlkZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIC5lcShfLm9wdGlvbnMuc2xpZGVzVG9TaG93KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1jZW50ZXInKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfLiRzbGlkZXNcbiAgICAgICAgICAgICAgICAuZXEoaW5kZXgpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1jZW50ZXInKTtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICBpZiAoaW5kZXggPj0gMCAmJiBpbmRleCA8PSAoXy5zbGlkZUNvdW50IC0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykpIHtcblxuICAgICAgICAgICAgICAgIF8uJHNsaWRlc1xuICAgICAgICAgICAgICAgICAgICAuc2xpY2UoaW5kZXgsIGluZGV4ICsgXy5vcHRpb25zLnNsaWRlc1RvU2hvdylcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1hY3RpdmUnKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChhbGxTbGlkZXMubGVuZ3RoIDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcblxuICAgICAgICAgICAgICAgIGFsbFNsaWRlc1xuICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWFjdGl2ZScpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgcmVtYWluZGVyID0gXy5zbGlkZUNvdW50ICUgXy5vcHRpb25zLnNsaWRlc1RvU2hvdztcbiAgICAgICAgICAgICAgICBpbmRleE9mZnNldCA9IF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gdHJ1ZSA/IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgKyBpbmRleCA6IGluZGV4O1xuXG4gICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgPT0gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsICYmIChfLnNsaWRlQ291bnQgLSBpbmRleCkgPCBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgYWxsU2xpZGVzXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2xpY2UoaW5kZXhPZmZzZXQgLSAoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAtIHJlbWFpbmRlciksIGluZGV4T2Zmc2V0ICsgcmVtYWluZGVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1hY3RpdmUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIGFsbFNsaWRlc1xuICAgICAgICAgICAgICAgICAgICAgICAgLnNsaWNlKGluZGV4T2Zmc2V0LCBpbmRleE9mZnNldCArIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWFjdGl2ZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXy5vcHRpb25zLmxhenlMb2FkID09PSAnb25kZW1hbmQnKSB7XG4gICAgICAgICAgICBfLmxhenlMb2FkKCk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuc2V0dXBJbmZpbml0ZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgIGksIHNsaWRlSW5kZXgsIGluZmluaXRlQ291bnQ7XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBfLm9wdGlvbnMuY2VudGVyTW9kZSA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gdHJ1ZSAmJiBfLm9wdGlvbnMuZmFkZSA9PT0gZmFsc2UpIHtcblxuICAgICAgICAgICAgc2xpZGVJbmRleCA9IG51bGw7XG5cbiAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5maW5pdGVDb3VudCA9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgKyAxO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGluZmluaXRlQ291bnQgPSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZvciAoaSA9IF8uc2xpZGVDb3VudDsgaSA+IChfLnNsaWRlQ291bnQgLVxuICAgICAgICAgICAgICAgICAgICAgICAgaW5maW5pdGVDb3VudCk7IGkgLT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBzbGlkZUluZGV4ID0gaSAtIDE7XG4gICAgICAgICAgICAgICAgICAgICQoXy4kc2xpZGVzW3NsaWRlSW5kZXhdKS5jbG9uZSh0cnVlKS5hdHRyKCdpZCcsICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2RhdGEtc2xpY2staW5kZXgnLCBzbGlkZUluZGV4IC0gXy5zbGlkZUNvdW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnByZXBlbmRUbyhfLiRzbGlkZVRyYWNrKS5hZGRDbGFzcygnc2xpY2stY2xvbmVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBpbmZpbml0ZUNvdW50OyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVJbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgICAgICQoXy4kc2xpZGVzW3NsaWRlSW5kZXhdKS5jbG9uZSh0cnVlKS5hdHRyKCdpZCcsICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2RhdGEtc2xpY2staW5kZXgnLCBzbGlkZUluZGV4ICsgXy5zbGlkZUNvdW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKF8uJHNsaWRlVHJhY2spLmFkZENsYXNzKCdzbGljay1jbG9uZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5maW5kKCcuc2xpY2stY2xvbmVkJykuZmluZCgnW2lkXScpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignaWQnLCAnJyk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmludGVycnVwdCA9IGZ1bmN0aW9uKCB0b2dnbGUgKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIGlmKCAhdG9nZ2xlICkge1xuICAgICAgICAgICAgXy5hdXRvUGxheSgpO1xuICAgICAgICB9XG4gICAgICAgIF8uaW50ZXJydXB0ZWQgPSB0b2dnbGU7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnNlbGVjdEhhbmRsZXIgPSBmdW5jdGlvbihldmVudCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICB2YXIgdGFyZ2V0RWxlbWVudCA9XG4gICAgICAgICAgICAkKGV2ZW50LnRhcmdldCkuaXMoJy5zbGljay1zbGlkZScpID9cbiAgICAgICAgICAgICAgICAkKGV2ZW50LnRhcmdldCkgOlxuICAgICAgICAgICAgICAgICQoZXZlbnQudGFyZ2V0KS5wYXJlbnRzKCcuc2xpY2stc2xpZGUnKTtcblxuICAgICAgICB2YXIgaW5kZXggPSBwYXJzZUludCh0YXJnZXRFbGVtZW50LmF0dHIoJ2RhdGEtc2xpY2staW5kZXgnKSk7XG5cbiAgICAgICAgaWYgKCFpbmRleCkgaW5kZXggPSAwO1xuXG4gICAgICAgIGlmIChfLnNsaWRlQ291bnQgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuXG4gICAgICAgICAgICBfLnNldFNsaWRlQ2xhc3NlcyhpbmRleCk7XG4gICAgICAgICAgICBfLmFzTmF2Rm9yKGluZGV4KTtcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB9XG5cbiAgICAgICAgXy5zbGlkZUhhbmRsZXIoaW5kZXgpO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5zbGlkZUhhbmRsZXIgPSBmdW5jdGlvbihpbmRleCwgc3luYywgZG9udEFuaW1hdGUpIHtcblxuICAgICAgICB2YXIgdGFyZ2V0U2xpZGUsIGFuaW1TbGlkZSwgb2xkU2xpZGUsIHNsaWRlTGVmdCwgdGFyZ2V0TGVmdCA9IG51bGwsXG4gICAgICAgICAgICBfID0gdGhpcywgbmF2VGFyZ2V0O1xuXG4gICAgICAgIHN5bmMgPSBzeW5jIHx8IGZhbHNlO1xuXG4gICAgICAgIGlmIChfLmFuaW1hdGluZyA9PT0gdHJ1ZSAmJiBfLm9wdGlvbnMud2FpdEZvckFuaW1hdGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZmFkZSA9PT0gdHJ1ZSAmJiBfLmN1cnJlbnRTbGlkZSA9PT0gaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLnNsaWRlQ291bnQgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN5bmMgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBfLmFzTmF2Rm9yKGluZGV4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRhcmdldFNsaWRlID0gaW5kZXg7XG4gICAgICAgIHRhcmdldExlZnQgPSBfLmdldExlZnQodGFyZ2V0U2xpZGUpO1xuICAgICAgICBzbGlkZUxlZnQgPSBfLmdldExlZnQoXy5jdXJyZW50U2xpZGUpO1xuXG4gICAgICAgIF8uY3VycmVudExlZnQgPSBfLnN3aXBlTGVmdCA9PT0gbnVsbCA/IHNsaWRlTGVmdCA6IF8uc3dpcGVMZWZ0O1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuaW5maW5pdGUgPT09IGZhbHNlICYmIF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSBmYWxzZSAmJiAoaW5kZXggPCAwIHx8IGluZGV4ID4gXy5nZXREb3RDb3VudCgpICogXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKSkge1xuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHRhcmdldFNsaWRlID0gXy5jdXJyZW50U2xpZGU7XG4gICAgICAgICAgICAgICAgaWYgKGRvbnRBbmltYXRlICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIF8uYW5pbWF0ZVNsaWRlKHNsaWRlTGVmdCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfLnBvc3RTbGlkZSh0YXJnZXRTbGlkZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIF8ucG9zdFNsaWRlKHRhcmdldFNsaWRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAoXy5vcHRpb25zLmluZmluaXRlID09PSBmYWxzZSAmJiBfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSAmJiAoaW5kZXggPCAwIHx8IGluZGV4ID4gKF8uc2xpZGVDb3VudCAtIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCkpKSB7XG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0U2xpZGUgPSBfLmN1cnJlbnRTbGlkZTtcbiAgICAgICAgICAgICAgICBpZiAoZG9udEFuaW1hdGUgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgXy5hbmltYXRlU2xpZGUoc2xpZGVMZWZ0LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8ucG9zdFNsaWRlKHRhcmdldFNsaWRlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgXy5wb3N0U2xpZGUodGFyZ2V0U2xpZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggXy5vcHRpb25zLmF1dG9wbGF5ICkge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChfLmF1dG9QbGF5VGltZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRhcmdldFNsaWRlIDwgMCkge1xuICAgICAgICAgICAgaWYgKF8uc2xpZGVDb3VudCAlIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGFuaW1TbGlkZSA9IF8uc2xpZGVDb3VudCAtIChfLnNsaWRlQ291bnQgJSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbmltU2xpZGUgPSBfLnNsaWRlQ291bnQgKyB0YXJnZXRTbGlkZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0YXJnZXRTbGlkZSA+PSBfLnNsaWRlQ291bnQpIHtcbiAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgJSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgIT09IDApIHtcbiAgICAgICAgICAgICAgICBhbmltU2xpZGUgPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbmltU2xpZGUgPSB0YXJnZXRTbGlkZSAtIF8uc2xpZGVDb3VudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFuaW1TbGlkZSA9IHRhcmdldFNsaWRlO1xuICAgICAgICB9XG5cbiAgICAgICAgXy5hbmltYXRpbmcgPSB0cnVlO1xuXG4gICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdiZWZvcmVDaGFuZ2UnLCBbXywgXy5jdXJyZW50U2xpZGUsIGFuaW1TbGlkZV0pO1xuXG4gICAgICAgIG9sZFNsaWRlID0gXy5jdXJyZW50U2xpZGU7XG4gICAgICAgIF8uY3VycmVudFNsaWRlID0gYW5pbVNsaWRlO1xuXG4gICAgICAgIF8uc2V0U2xpZGVDbGFzc2VzKF8uY3VycmVudFNsaWRlKTtcblxuICAgICAgICBpZiAoIF8ub3B0aW9ucy5hc05hdkZvciApIHtcblxuICAgICAgICAgICAgbmF2VGFyZ2V0ID0gXy5nZXROYXZUYXJnZXQoKTtcbiAgICAgICAgICAgIG5hdlRhcmdldCA9IG5hdlRhcmdldC5zbGljaygnZ2V0U2xpY2snKTtcblxuICAgICAgICAgICAgaWYgKCBuYXZUYXJnZXQuc2xpZGVDb3VudCA8PSBuYXZUYXJnZXQub3B0aW9ucy5zbGlkZXNUb1Nob3cgKSB7XG4gICAgICAgICAgICAgICAgbmF2VGFyZ2V0LnNldFNsaWRlQ2xhc3NlcyhfLmN1cnJlbnRTbGlkZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIF8udXBkYXRlRG90cygpO1xuICAgICAgICBfLnVwZGF0ZUFycm93cygpO1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZmFkZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgaWYgKGRvbnRBbmltYXRlICE9PSB0cnVlKSB7XG5cbiAgICAgICAgICAgICAgICBfLmZhZGVTbGlkZU91dChvbGRTbGlkZSk7XG5cbiAgICAgICAgICAgICAgICBfLmZhZGVTbGlkZShhbmltU2xpZGUsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBfLnBvc3RTbGlkZShhbmltU2xpZGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF8ucG9zdFNsaWRlKGFuaW1TbGlkZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfLmFuaW1hdGVIZWlnaHQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkb250QW5pbWF0ZSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgXy5hbmltYXRlU2xpZGUodGFyZ2V0TGVmdCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgXy5wb3N0U2xpZGUoYW5pbVNsaWRlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgXy5wb3N0U2xpZGUoYW5pbVNsaWRlKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5zdGFydExvYWQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5hcnJvd3MgPT09IHRydWUgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuXG4gICAgICAgICAgICBfLiRwcmV2QXJyb3cuaGlkZSgpO1xuICAgICAgICAgICAgXy4kbmV4dEFycm93LmhpZGUoKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5kb3RzID09PSB0cnVlICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcblxuICAgICAgICAgICAgXy4kZG90cy5oaWRlKCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIF8uJHNsaWRlci5hZGRDbGFzcygnc2xpY2stbG9hZGluZycpO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5zd2lwZURpcmVjdGlvbiA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciB4RGlzdCwgeURpc3QsIHIsIHN3aXBlQW5nbGUsIF8gPSB0aGlzO1xuXG4gICAgICAgIHhEaXN0ID0gXy50b3VjaE9iamVjdC5zdGFydFggLSBfLnRvdWNoT2JqZWN0LmN1clg7XG4gICAgICAgIHlEaXN0ID0gXy50b3VjaE9iamVjdC5zdGFydFkgLSBfLnRvdWNoT2JqZWN0LmN1clk7XG4gICAgICAgIHIgPSBNYXRoLmF0YW4yKHlEaXN0LCB4RGlzdCk7XG5cbiAgICAgICAgc3dpcGVBbmdsZSA9IE1hdGgucm91bmQociAqIDE4MCAvIE1hdGguUEkpO1xuICAgICAgICBpZiAoc3dpcGVBbmdsZSA8IDApIHtcbiAgICAgICAgICAgIHN3aXBlQW5nbGUgPSAzNjAgLSBNYXRoLmFicyhzd2lwZUFuZ2xlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgoc3dpcGVBbmdsZSA8PSA0NSkgJiYgKHN3aXBlQW5nbGUgPj0gMCkpIHtcbiAgICAgICAgICAgIHJldHVybiAoXy5vcHRpb25zLnJ0bCA9PT0gZmFsc2UgPyAnbGVmdCcgOiAncmlnaHQnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoKHN3aXBlQW5nbGUgPD0gMzYwKSAmJiAoc3dpcGVBbmdsZSA+PSAzMTUpKSB7XG4gICAgICAgICAgICByZXR1cm4gKF8ub3B0aW9ucy5ydGwgPT09IGZhbHNlID8gJ2xlZnQnIDogJ3JpZ2h0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKChzd2lwZUFuZ2xlID49IDEzNSkgJiYgKHN3aXBlQW5nbGUgPD0gMjI1KSkge1xuICAgICAgICAgICAgcmV0dXJuIChfLm9wdGlvbnMucnRsID09PSBmYWxzZSA/ICdyaWdodCcgOiAnbGVmdCcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWxTd2lwaW5nID09PSB0cnVlKSB7XG4gICAgICAgICAgICBpZiAoKHN3aXBlQW5nbGUgPj0gMzUpICYmIChzd2lwZUFuZ2xlIDw9IDEzNSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2Rvd24nO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3VwJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAndmVydGljYWwnO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5zd2lwZUVuZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgc2xpZGVDb3VudCxcbiAgICAgICAgICAgIGRpcmVjdGlvbjtcblxuICAgICAgICBfLmRyYWdnaW5nID0gZmFsc2U7XG4gICAgICAgIF8uaW50ZXJydXB0ZWQgPSBmYWxzZTtcbiAgICAgICAgXy5zaG91bGRDbGljayA9ICggXy50b3VjaE9iamVjdC5zd2lwZUxlbmd0aCA+IDEwICkgPyBmYWxzZSA6IHRydWU7XG5cbiAgICAgICAgaWYgKCBfLnRvdWNoT2JqZWN0LmN1clggPT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggXy50b3VjaE9iamVjdC5lZGdlSGl0ID09PSB0cnVlICkge1xuICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ2VkZ2UnLCBbXywgXy5zd2lwZURpcmVjdGlvbigpIF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCBfLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoID49IF8udG91Y2hPYmplY3QubWluU3dpcGUgKSB7XG5cbiAgICAgICAgICAgIGRpcmVjdGlvbiA9IF8uc3dpcGVEaXJlY3Rpb24oKTtcblxuICAgICAgICAgICAgc3dpdGNoICggZGlyZWN0aW9uICkge1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnZG93bic6XG5cbiAgICAgICAgICAgICAgICAgICAgc2xpZGVDb3VudCA9XG4gICAgICAgICAgICAgICAgICAgICAgICBfLm9wdGlvbnMuc3dpcGVUb1NsaWRlID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmNoZWNrTmF2aWdhYmxlKCBfLmN1cnJlbnRTbGlkZSArIF8uZ2V0U2xpZGVDb3VudCgpICkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uY3VycmVudFNsaWRlICsgXy5nZXRTbGlkZUNvdW50KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgXy5jdXJyZW50RGlyZWN0aW9uID0gMDtcblxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICAgICAgICBjYXNlICd1cCc6XG5cbiAgICAgICAgICAgICAgICAgICAgc2xpZGVDb3VudCA9XG4gICAgICAgICAgICAgICAgICAgICAgICBfLm9wdGlvbnMuc3dpcGVUb1NsaWRlID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmNoZWNrTmF2aWdhYmxlKCBfLmN1cnJlbnRTbGlkZSAtIF8uZ2V0U2xpZGVDb3VudCgpICkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uY3VycmVudFNsaWRlIC0gXy5nZXRTbGlkZUNvdW50KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgXy5jdXJyZW50RGlyZWN0aW9uID0gMTtcblxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG5cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiggZGlyZWN0aW9uICE9ICd2ZXJ0aWNhbCcgKSB7XG5cbiAgICAgICAgICAgICAgICBfLnNsaWRlSGFuZGxlciggc2xpZGVDb3VudCApO1xuICAgICAgICAgICAgICAgIF8udG91Y2hPYmplY3QgPSB7fTtcbiAgICAgICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignc3dpcGUnLCBbXywgZGlyZWN0aW9uIF0pO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgaWYgKCBfLnRvdWNoT2JqZWN0LnN0YXJ0WCAhPT0gXy50b3VjaE9iamVjdC5jdXJYICkge1xuXG4gICAgICAgICAgICAgICAgXy5zbGlkZUhhbmRsZXIoIF8uY3VycmVudFNsaWRlICk7XG4gICAgICAgICAgICAgICAgXy50b3VjaE9iamVjdCA9IHt9O1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5zd2lwZUhhbmRsZXIgPSBmdW5jdGlvbihldmVudCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBpZiAoKF8ub3B0aW9ucy5zd2lwZSA9PT0gZmFsc2UpIHx8ICgnb250b3VjaGVuZCcgaW4gZG9jdW1lbnQgJiYgXy5vcHRpb25zLnN3aXBlID09PSBmYWxzZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChfLm9wdGlvbnMuZHJhZ2dhYmxlID09PSBmYWxzZSAmJiBldmVudC50eXBlLmluZGV4T2YoJ21vdXNlJykgIT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBfLnRvdWNoT2JqZWN0LmZpbmdlckNvdW50ID0gZXZlbnQub3JpZ2luYWxFdmVudCAmJiBldmVudC5vcmlnaW5hbEV2ZW50LnRvdWNoZXMgIT09IHVuZGVmaW5lZCA/XG4gICAgICAgICAgICBldmVudC5vcmlnaW5hbEV2ZW50LnRvdWNoZXMubGVuZ3RoIDogMTtcblxuICAgICAgICBfLnRvdWNoT2JqZWN0Lm1pblN3aXBlID0gXy5saXN0V2lkdGggLyBfLm9wdGlvbnNcbiAgICAgICAgICAgIC50b3VjaFRocmVzaG9sZDtcblxuICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsU3dpcGluZyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgXy50b3VjaE9iamVjdC5taW5Td2lwZSA9IF8ubGlzdEhlaWdodCAvIF8ub3B0aW9uc1xuICAgICAgICAgICAgICAgIC50b3VjaFRocmVzaG9sZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAoZXZlbnQuZGF0YS5hY3Rpb24pIHtcblxuICAgICAgICAgICAgY2FzZSAnc3RhcnQnOlxuICAgICAgICAgICAgICAgIF8uc3dpcGVTdGFydChldmVudCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ21vdmUnOlxuICAgICAgICAgICAgICAgIF8uc3dpcGVNb3ZlKGV2ZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnZW5kJzpcbiAgICAgICAgICAgICAgICBfLnN3aXBlRW5kKGV2ZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnN3aXBlTW92ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgZWRnZVdhc0hpdCA9IGZhbHNlLFxuICAgICAgICAgICAgY3VyTGVmdCwgc3dpcGVEaXJlY3Rpb24sIHN3aXBlTGVuZ3RoLCBwb3NpdGlvbk9mZnNldCwgdG91Y2hlcztcblxuICAgICAgICB0b3VjaGVzID0gZXZlbnQub3JpZ2luYWxFdmVudCAhPT0gdW5kZWZpbmVkID8gZXZlbnQub3JpZ2luYWxFdmVudC50b3VjaGVzIDogbnVsbDtcblxuICAgICAgICBpZiAoIV8uZHJhZ2dpbmcgfHwgdG91Y2hlcyAmJiB0b3VjaGVzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY3VyTGVmdCA9IF8uZ2V0TGVmdChfLmN1cnJlbnRTbGlkZSk7XG5cbiAgICAgICAgXy50b3VjaE9iamVjdC5jdXJYID0gdG91Y2hlcyAhPT0gdW5kZWZpbmVkID8gdG91Y2hlc1swXS5wYWdlWCA6IGV2ZW50LmNsaWVudFg7XG4gICAgICAgIF8udG91Y2hPYmplY3QuY3VyWSA9IHRvdWNoZXMgIT09IHVuZGVmaW5lZCA/IHRvdWNoZXNbMF0ucGFnZVkgOiBldmVudC5jbGllbnRZO1xuXG4gICAgICAgIF8udG91Y2hPYmplY3Quc3dpcGVMZW5ndGggPSBNYXRoLnJvdW5kKE1hdGguc3FydChcbiAgICAgICAgICAgIE1hdGgucG93KF8udG91Y2hPYmplY3QuY3VyWCAtIF8udG91Y2hPYmplY3Quc3RhcnRYLCAyKSkpO1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWxTd2lwaW5nID09PSB0cnVlKSB7XG4gICAgICAgICAgICBfLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoID0gTWF0aC5yb3VuZChNYXRoLnNxcnQoXG4gICAgICAgICAgICAgICAgTWF0aC5wb3coXy50b3VjaE9iamVjdC5jdXJZIC0gXy50b3VjaE9iamVjdC5zdGFydFksIDIpKSk7XG4gICAgICAgIH1cblxuICAgICAgICBzd2lwZURpcmVjdGlvbiA9IF8uc3dpcGVEaXJlY3Rpb24oKTtcblxuICAgICAgICBpZiAoc3dpcGVEaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldmVudC5vcmlnaW5hbEV2ZW50ICE9PSB1bmRlZmluZWQgJiYgXy50b3VjaE9iamVjdC5zd2lwZUxlbmd0aCA+IDQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBwb3NpdGlvbk9mZnNldCA9IChfLm9wdGlvbnMucnRsID09PSBmYWxzZSA/IDEgOiAtMSkgKiAoXy50b3VjaE9iamVjdC5jdXJYID4gXy50b3VjaE9iamVjdC5zdGFydFggPyAxIDogLTEpO1xuICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsU3dpcGluZyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcG9zaXRpb25PZmZzZXQgPSBfLnRvdWNoT2JqZWN0LmN1clkgPiBfLnRvdWNoT2JqZWN0LnN0YXJ0WSA/IDEgOiAtMTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgc3dpcGVMZW5ndGggPSBfLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoO1xuXG4gICAgICAgIF8udG91Y2hPYmplY3QuZWRnZUhpdCA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuaW5maW5pdGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBpZiAoKF8uY3VycmVudFNsaWRlID09PSAwICYmIHN3aXBlRGlyZWN0aW9uID09PSAncmlnaHQnKSB8fCAoXy5jdXJyZW50U2xpZGUgPj0gXy5nZXREb3RDb3VudCgpICYmIHN3aXBlRGlyZWN0aW9uID09PSAnbGVmdCcpKSB7XG4gICAgICAgICAgICAgICAgc3dpcGVMZW5ndGggPSBfLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoICogXy5vcHRpb25zLmVkZ2VGcmljdGlvbjtcbiAgICAgICAgICAgICAgICBfLnRvdWNoT2JqZWN0LmVkZ2VIaXQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIF8uc3dpcGVMZWZ0ID0gY3VyTGVmdCArIHN3aXBlTGVuZ3RoICogcG9zaXRpb25PZmZzZXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfLnN3aXBlTGVmdCA9IGN1ckxlZnQgKyAoc3dpcGVMZW5ndGggKiAoXy4kbGlzdC5oZWlnaHQoKSAvIF8ubGlzdFdpZHRoKSkgKiBwb3NpdGlvbk9mZnNldDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsU3dpcGluZyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgXy5zd2lwZUxlZnQgPSBjdXJMZWZ0ICsgc3dpcGVMZW5ndGggKiBwb3NpdGlvbk9mZnNldDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZmFkZSA9PT0gdHJ1ZSB8fCBfLm9wdGlvbnMudG91Y2hNb3ZlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF8uYW5pbWF0aW5nID09PSB0cnVlKSB7XG4gICAgICAgICAgICBfLnN3aXBlTGVmdCA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBfLnNldENTUyhfLnN3aXBlTGVmdCk7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnN3aXBlU3RhcnQgPSBmdW5jdGlvbihldmVudCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgIHRvdWNoZXM7XG5cbiAgICAgICAgXy5pbnRlcnJ1cHRlZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKF8udG91Y2hPYmplY3QuZmluZ2VyQ291bnQgIT09IDEgfHwgXy5zbGlkZUNvdW50IDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcbiAgICAgICAgICAgIF8udG91Y2hPYmplY3QgPSB7fTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldmVudC5vcmlnaW5hbEV2ZW50ICE9PSB1bmRlZmluZWQgJiYgZXZlbnQub3JpZ2luYWxFdmVudC50b3VjaGVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRvdWNoZXMgPSBldmVudC5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbMF07XG4gICAgICAgIH1cblxuICAgICAgICBfLnRvdWNoT2JqZWN0LnN0YXJ0WCA9IF8udG91Y2hPYmplY3QuY3VyWCA9IHRvdWNoZXMgIT09IHVuZGVmaW5lZCA/IHRvdWNoZXMucGFnZVggOiBldmVudC5jbGllbnRYO1xuICAgICAgICBfLnRvdWNoT2JqZWN0LnN0YXJ0WSA9IF8udG91Y2hPYmplY3QuY3VyWSA9IHRvdWNoZXMgIT09IHVuZGVmaW5lZCA/IHRvdWNoZXMucGFnZVkgOiBldmVudC5jbGllbnRZO1xuXG4gICAgICAgIF8uZHJhZ2dpbmcgPSB0cnVlO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS51bmZpbHRlclNsaWRlcyA9IFNsaWNrLnByb3RvdHlwZS5zbGlja1VuZmlsdGVyID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIGlmIChfLiRzbGlkZXNDYWNoZSAhPT0gbnVsbCkge1xuXG4gICAgICAgICAgICBfLnVubG9hZCgpO1xuXG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZGV0YWNoKCk7XG5cbiAgICAgICAgICAgIF8uJHNsaWRlc0NhY2hlLmFwcGVuZFRvKF8uJHNsaWRlVHJhY2spO1xuXG4gICAgICAgICAgICBfLnJlaW5pdCgpO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUudW5sb2FkID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgICQoJy5zbGljay1jbG9uZWQnLCBfLiRzbGlkZXIpLnJlbW92ZSgpO1xuXG4gICAgICAgIGlmIChfLiRkb3RzKSB7XG4gICAgICAgICAgICBfLiRkb3RzLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF8uJHByZXZBcnJvdyAmJiBfLmh0bWxFeHByLnRlc3QoXy5vcHRpb25zLnByZXZBcnJvdykpIHtcbiAgICAgICAgICAgIF8uJHByZXZBcnJvdy5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLiRuZXh0QXJyb3cgJiYgXy5odG1sRXhwci50ZXN0KF8ub3B0aW9ucy5uZXh0QXJyb3cpKSB7XG4gICAgICAgICAgICBfLiRuZXh0QXJyb3cucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBfLiRzbGlkZXNcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnc2xpY2stc2xpZGUgc2xpY2stYWN0aXZlIHNsaWNrLXZpc2libGUgc2xpY2stY3VycmVudCcpXG4gICAgICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpXG4gICAgICAgICAgICAuY3NzKCd3aWR0aCcsICcnKTtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUudW5zbGljayA9IGZ1bmN0aW9uKGZyb21CcmVha3BvaW50KSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcigndW5zbGljaycsIFtfLCBmcm9tQnJlYWtwb2ludF0pO1xuICAgICAgICBfLmRlc3Ryb3koKTtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUudXBkYXRlQXJyb3dzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgY2VudGVyT2Zmc2V0O1xuXG4gICAgICAgIGNlbnRlck9mZnNldCA9IE1hdGguZmxvb3IoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAvIDIpO1xuXG4gICAgICAgIGlmICggXy5vcHRpb25zLmFycm93cyA9PT0gdHJ1ZSAmJlxuICAgICAgICAgICAgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAmJlxuICAgICAgICAgICAgIV8ub3B0aW9ucy5pbmZpbml0ZSApIHtcblxuICAgICAgICAgICAgXy4kcHJldkFycm93LnJlbW92ZUNsYXNzKCdzbGljay1kaXNhYmxlZCcpLmF0dHIoJ2FyaWEtZGlzYWJsZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgIF8uJG5leHRBcnJvdy5yZW1vdmVDbGFzcygnc2xpY2stZGlzYWJsZWQnKS5hdHRyKCdhcmlhLWRpc2FibGVkJywgJ2ZhbHNlJyk7XG5cbiAgICAgICAgICAgIGlmIChfLmN1cnJlbnRTbGlkZSA9PT0gMCkge1xuXG4gICAgICAgICAgICAgICAgXy4kcHJldkFycm93LmFkZENsYXNzKCdzbGljay1kaXNhYmxlZCcpLmF0dHIoJ2FyaWEtZGlzYWJsZWQnLCAndHJ1ZScpO1xuICAgICAgICAgICAgICAgIF8uJG5leHRBcnJvdy5yZW1vdmVDbGFzcygnc2xpY2stZGlzYWJsZWQnKS5hdHRyKCdhcmlhLWRpc2FibGVkJywgJ2ZhbHNlJyk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5jdXJyZW50U2xpZGUgPj0gXy5zbGlkZUNvdW50IC0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAmJiBfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gZmFsc2UpIHtcblxuICAgICAgICAgICAgICAgIF8uJG5leHRBcnJvdy5hZGRDbGFzcygnc2xpY2stZGlzYWJsZWQnKS5hdHRyKCdhcmlhLWRpc2FibGVkJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cucmVtb3ZlQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICdmYWxzZScpO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKF8uY3VycmVudFNsaWRlID49IF8uc2xpZGVDb3VudCAtIDEgJiYgXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUpIHtcblxuICAgICAgICAgICAgICAgIF8uJG5leHRBcnJvdy5hZGRDbGFzcygnc2xpY2stZGlzYWJsZWQnKS5hdHRyKCdhcmlhLWRpc2FibGVkJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cucmVtb3ZlQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICdmYWxzZScpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS51cGRhdGVEb3RzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIGlmIChfLiRkb3RzICE9PSBudWxsKSB7XG5cbiAgICAgICAgICAgIF8uJGRvdHNcbiAgICAgICAgICAgICAgICAuZmluZCgnbGknKVxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnc2xpY2stYWN0aXZlJylcbiAgICAgICAgICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXG4gICAgICAgICAgICBfLiRkb3RzXG4gICAgICAgICAgICAgICAgLmZpbmQoJ2xpJylcbiAgICAgICAgICAgICAgICAuZXEoTWF0aC5mbG9vcihfLmN1cnJlbnRTbGlkZSAvIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCkpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1hY3RpdmUnKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUudmlzaWJpbGl0eSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBpZiAoIF8ub3B0aW9ucy5hdXRvcGxheSApIHtcblxuICAgICAgICAgICAgaWYgKCBkb2N1bWVudFtfLmhpZGRlbl0gKSB7XG5cbiAgICAgICAgICAgICAgICBfLmludGVycnVwdGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIF8uaW50ZXJydXB0ZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICAkLmZuLnNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgIG9wdCA9IGFyZ3VtZW50c1swXSxcbiAgICAgICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLFxuICAgICAgICAgICAgbCA9IF8ubGVuZ3RoLFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIHJldDtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHQgPT0gJ29iamVjdCcgfHwgdHlwZW9mIG9wdCA9PSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgICAgICBfW2ldLnNsaWNrID0gbmV3IFNsaWNrKF9baV0sIG9wdCk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0ID0gX1tpXS5zbGlja1tvcHRdLmFwcGx5KF9baV0uc2xpY2ssIGFyZ3MpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiByZXQgIT0gJ3VuZGVmaW5lZCcpIHJldHVybiByZXQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF87XG4gICAgfTtcblxufSkpO1xuIiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMucHJvamVjdFZpZGVvRW1iZWQoKTtcbiAgICB9LFxuXG4gICAgcHJvamVjdFZpZGVvRW1iZWQoKSB7XG4gICAgICAkLmdldFNjcmlwdCgnaHR0cDovL3d3dy55b3V0dWJlLmNvbS9pZnJhbWVfYXBpJykuZG9uZShmdW5jdGlvbigpIHtcbiAgICAgICAgZnVuY3Rpb24gb25QbGF5ZXJTdGF0ZUNoYW5nZShldmVudCkge1xuICAgICAgICAgIHN3aXRjaChldmVudC5kYXRhKSB7XG4gICAgICAgICAgICBjYXNlIFlULlBsYXllclN0YXRlLkVOREVEOlxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ1ZpZGVvIGhhcyBlbmRlZC4nKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBZVC5QbGF5ZXJTdGF0ZS5QTEFZSU5HOlxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ1ZpZGVvIGlzIHBsYXlpbmcuJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgWVQuUGxheWVyU3RhdGUuUEFVU0VEOlxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ1ZpZGVvIGlzIHBhdXNlZC4nKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBZVC5QbGF5ZXJTdGF0ZS5CVUZGRVJJTkc6XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnVmlkZW8gaXMgYnVmZmVyaW5nLicpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFlULlBsYXllclN0YXRlLkNVRUQ6XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnVmlkZW8gaXMgY3VlZC4nKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICQoJy52aWRlby13cmFwIC5vdmVybGF5Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHZpZElkID0gJCh0aGlzKS5hdHRyKCdkYXRhLWlkJyk7XG4gICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5maW5kKCcuaWZyYW1lLWJveCcpLmh0bWwoJzxpZnJhbWUgaWQ9XCJwbGF5ZXJfJyt2aWRJZCsnXCIgd2lkdGg9XCI0MjBcIiBoZWlnaHQ9XCIzMTVcIiBzcmM9XCJodHRwOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkLycgKyB2aWRJZCArICc/ZW5hYmxlanNhcGk9MSZhdXRvcGxheT0xJmF1dG9oaWRlPTEmc2hvd2luZm89MFwiIGZyYW1lYm9yZGVyPVwiMFwiIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT4nKTtcblxuICAgICAgICAgIG5ldyBZVC5QbGF5ZXIoJ3BsYXllcl8nK3ZpZElkLCB7XG4gICAgICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICAgJ29uU3RhdGVDaGFuZ2UnOiBvblBsYXllclN0YXRlQ2hhbmdlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICB9KTtcblxuICAgIH1cbn0iLCIvLyBpbXBvcnQgJy4uL2xpYnMvanF1ZXJ5LnZhbGlkYXRlLmpzJztcblxuLy8gKGZ1bmN0aW9uKCQpIHtcbi8vICAgICAkLmZuLmZvcm1TdWJtaXQgPSBmdW5jdGlvbigpIHtcbi8vICAgICAgICAgJCh0aGlzKS5lYWNoKGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuLy8gICAgICAgICAgICAgJCh0aGlzKS52YWxpZGF0ZSh7XG4vLyAgICAgICAgICAgICAgICAgcnVsZXM6IHtcbi8vICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJyZXF1aXJlZFwiLFxuLy8gICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcInJlcXVpcmVkXCIsXG4vLyAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwicmVxdWlyZWRcIixcbi8vICAgICAgICAgICAgICAgICAgICAgZW1haWw6IHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IHRydWVcbi8vICAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgICAgICAgbWVzc2FnZXM6IHtcbi8vICAgICAgICAgICAgICAgICAgICAgbmFtZTogZm9ybVZhbGlkYXRlU2V0dGluZ3MubmFtZSxcbi8vICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogZm9ybVZhbGlkYXRlU2V0dGluZ3MubWVzc2FnZUVtcHR5LFxuLy8gICAgICAgICAgICAgICAgICAgICB0ZXh0OiBmb3JtVmFsaWRhdGVTZXR0aW5ncy50ZXh0RW1wdHksXG4vLyAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogZm9ybVZhbGlkYXRlU2V0dGluZ3MuZW1haWxFbXB0eSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiBmb3JtVmFsaWRhdGVTZXR0aW5ncy5lbWFpbEluY29ycmVjdFxuLy8gICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICAgfSxcblxuLy8gICAgICAgICAgICAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uIHN1Ym1pdEhhbmRsZXIoZm9ybSwgZSkge1xuLy8gICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICAgICAgICAgICAgICAgICAgIHZhciAkZm9ybSA9ICQodGhhdCk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICRmb3JtLmF0dHIoJ21ldGhvZCcpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJGZvcm0uYXR0cignYWN0aW9uJyksXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiAkZm9ybS5zZXJpYWxpemUoKVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgfSkuZG9uZShmdW5jdGlvbiAoZGF0YSkge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGRhdGEudGl0bGUgPT09IHVuZGVmaW5lZCkgZGF0YS50aXRsZSA9ICcnO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGRhdGEubWVzc2FnZSA9PT0gdW5kZWZpbmVkKSBkYXRhLm1lc3NhZ2UgPSAnJztcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzID09IHRydWUpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0uaGlkZSgyMDApO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybVswXS5yZXNldCgpO1xuXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmb3JtU3VjY2VzcyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2Zvcm0tc3VjY2VzcycpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtU3VjY2Vzcy5odG1sKCc8ZGl2IGNsYXNzPVwic3RhdGUtaWNvblwiPjwvZGl2PiA8ZGl2IGNsYXNzPVwiZm9ybS10aXRsZVwiPicgKyBkYXRhLnRpdGxlICsgJzwvZGl2PiA8ZGl2IGNsYXNzPVwiZm9ybS1kZXNjclwiPicgKyBkYXRhLm1lc3NhZ2UgKyAnPC9kaXY+Jyk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLnBhcmVudCgpLmFwcGVuZChmb3JtU3VjY2Vzcyk7XG5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5wYXJlbnQoKS5maW5kKCcuZm9ybS1zdWNjZXNzJykuc2hvdygyMDApO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAyMDApO1xuXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0ucGFyZW50KCkuZmluZCgnLmZvcm0tc3VjY2VzcycpLmhpZGUoMjAwKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMzAwMCk7XG5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5wYXJlbnQoKS5maW5kKCcuZm9ybS1zdWNjZXNzJykucmVtb3ZlKCk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5wYXJlbnQoKS5maW5kKCcuZm9ybS1zdWNjZXNzJyk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5zaG93KDIwMCk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDMyMDApO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLmhpZGUoMjAwKTtcblxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZm9ybUVycm9yID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZm9ybS1lcnJvcicpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtRXJyb3IuaHRtbCgnPGRpdiBjbGFzcz1cInN0YXRlLWljb25cIj48L2Rpdj4gPGRpdiBjbGFzcz1cImZvcm0tdGl0bGVcIj4nICsgZGF0YS50aXRsZSArICc8L2Rpdj4gPGRpdiBjbGFzcz1cImZvcm0tZGVzY3JcIj4nICsgZGF0YS5tZXNzYWdlICsgJzwvZGl2PjxhIGhyZWY9XCIjXCIgY2xhc3M9XCJidG5cIj4nICsgZm9ybVZhbGlkYXRlU2V0dGluZ3Muc2VuZF9hZ2FpbiArICc8L2E+Jyk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLnBhcmVudCgpLmFwcGVuZChmb3JtRXJyb3IpO1xuXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0ucGFyZW50KCkuZmluZCgnLmZvcm0tZXJyb3InKS5zaG93KDIwMCk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDIwMCk7XG5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0ucGFyZW50KCkuZmluZCgnLmZvcm0tZXJyb3InKS5maW5kKCdhJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLnBhcmVudCgpLmZpbmQoJy5mb3JtLWVycm9yJykuaGlkZSgyMDApO1xuXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5wYXJlbnQoKS5maW5kKCcuZm9ybS1lcnJvcicpLnJlbW92ZSgpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLnNob3coMjAwKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDIwMCk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmZhaWwoZnVuY3Rpb24gKCkge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLmhpZGUoMjAwKTtcblxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmb3JtRXJyb3IgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmb3JtLWVycm9yJyk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybUVycm9yLmh0bWwoJzxkaXYgY2xhc3M9XCJzdGF0ZS1pY29uXCI+PC9kaXY+IDxkaXYgY2xhc3M9XCJmb3JtLXRpdGxlXCI+JyArIGZvcm1WYWxpZGF0ZVNldHRpbmdzLnNlbmRfZXJyb3JfdGl0bGUgKyAnPC9kaXY+IDxkaXYgY2xhc3M9XCJmb3JtLWRlc2NyXCI+JyArIGZvcm1WYWxpZGF0ZVNldHRpbmdzLnNlbmRfZXJyb3JfbWVzc2FnZSArICc8L2Rpdj4gPGEgaHJlZj1cIiNcIiBjbGFzcz1cImJ0blwiPicgKyBmb3JtVmFsaWRhdGVTZXR0aW5ncy5zZW5kX2FnYWluICsgJzwvYT4nKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5wYXJlbnQoKS5hcHBlbmQoZm9ybUVycm9yKTtcblxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5wYXJlbnQoKS5maW5kKCcuZm9ybS1lcnJvcicpLnNob3coMjAwKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAyMDApO1xuXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0ucGFyZW50KCkuZmluZCgnLmZvcm0tZXJyb3InKS5maW5kKCdhJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5wYXJlbnQoKS5maW5kKCcuZm9ybS1lcnJvcicpLmhpZGUoMjAwKTtcblxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLnBhcmVudCgpLmZpbmQoJy5mb3JtLWVycm9yJykucmVtb3ZlKCk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5zaG93KDIwMCk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDIwMCk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuLy8gICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgIH0pO1xuLy8gICAgICAgICB9KVxuLy8gICAgIH1cbi8vIH0pKGpRdWVyeSk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLnZhbGlkYXRpb24oKTtcbiAgICB9LFxuXG4gICAgdmFsaWRhdGlvbigpIHtcbiAgICAgICAgLy8gJCgnZm9ybScpLmZvcm1TdWJtaXQoKTtcblxuICAgICAgICAkKFwiLm1hdC1pbnB1dFwiKS5mb2N1cyhmdW5jdGlvbigpe1xuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5hZGRDbGFzcyhcImlzLWFjdGl2ZSBpcy1jb21wbGV0ZWRcIik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoXCIubWF0LWlucHV0XCIpLmZvY3Vzb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZigkKHRoaXMpLnZhbCgpID09PSBcIlwiKVxuICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50KCkucmVtb3ZlQ2xhc3MoXCJpcy1jb21wbGV0ZWRcIik7XG4gICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLnJlbW92ZUNsYXNzKFwiaXMtYWN0aXZlXCIpO1xuICAgICAgICB9KTtcbiAgICB9XG59IiwiaW1wb3J0IHNlbGVjdDIgZnJvbSAnLi4vbGlicy9zZWxlY3QyLmpzJztcblxuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgICBpbml0KCl7XG4gICAgICAgIHRoaXMuaGVhZGVyRnVuY3Rpb25zKCk7XG4gICAgfSxcblxuICAgIGhlYWRlckZ1bmN0aW9ucyAoKSB7XG5cbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKCcubWVudS1idXR0b24nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAkKCcuc2l0ZS1uYXYnKS5zbGlkZVVwKCdhY3RpdmUnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnLm1lbnUtYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICQoJy5zaXRlLW5hdicpLnNsaWRlVG9nZ2xlKCdhY3RpdmUnKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJy5zaXRlLW5hdicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIGZvcm1hdFN0YXRlIChzdGF0ZSkge1xuICAgICAgICAgICAgaWYgKCFzdGF0ZS5pZCkgeyByZXR1cm4gc3RhdGUudGV4dDsgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coc3RhdGUuZWxlbWVudC52YWx1ZS5zcGxpdCgnXycpWzBdLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICAgICAgdmFyICRzdGF0ZSA9ICQoXG4gICAgICAgICAgICAgICAgJzxzcGFuPjxpbWcgY2xhc3M9XCJjb250ZXh0Q2hhbmdlXCIgc3JjPSBcIi4uL2ltYWdlcy9mbGFncy8nICsgc3RhdGUuZWxlbWVudC52YWx1ZS5zcGxpdCgnXycpWzBdLnRvTG93ZXJDYXNlKCkgKyAnLnBuZ1wiIGNsYXNzPVwiaW1nLWZsYWdcIiAvPiAnICsgc3RhdGUudGV4dCArICc8L3NwYW4+J1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gJHN0YXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgJChcIi5sYW5nXCIpLnNlbGVjdDIoe1xuICAgICAgICAgICAgLy8gdGVtcGxhdGVSZXN1bHQ6IGZvcm1hdFN0YXRlLFxuICAgICAgICAgICAgLy8gdGVtcGxhdGVTZWxlY3Rpb246IGZvcm1hdFN0YXRlLFxuICAgICAgICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vICQoJy5sYW5nJykub24oXCJzZWxlY3QyOnNlbGVjdFwiLCBmdW5jdGlvbihlKXtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKGUucGFyYW1zKTtcbiAgICAgICAgLy8gICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKGUucGFyYW1zLmRhdGEuaWQuc3BsaXQoJ18nKVsxXSk7XG4gICAgICAgIC8vIH0pO1xuXG4gICAgfVxufTsiLCJleHBvcnQgZGVmYXVsdCB7XG5cdGluaXQoKSB7XG5cdFx0dGhpcy5pbml0TWFwKCk7XG5cdH0sXG5cblx0aW5pdE1hcCgpIHtcblxuXHRcdFx0XHQkLmdldFNjcmlwdChcImh0dHA6Ly9tYXBzLmdvb2dsZS5jb20vbWFwcy9hcGkvanM/a2V5PUFJemFTeUMxbXU1cDdMM0tNSG5XUVhUazRMVFdSM0JTaWFRdGRXOCZzZW5zb3I9dHJ1ZVwiKS5kb25lKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdGNvbnN0IG1hcElkID0gJCgnI21hcCcpO1xuXHRcdFx0XHRcdFx0Y29uc3QgZGF0YUxhdCA9IHBhcnNlRmxvYXQobWFwSWQuYXR0cignZGF0YS1sYXQnKSk7XG5cdFx0XHRcdFx0XHRjb25zdCBkYXRhTG5nID0gcGFyc2VGbG9hdChtYXBJZC5hdHRyKCdkYXRhLWxuZycpKTtcblx0XHRcdFx0XHRcdGNvbnN0IGNlbnRlciA9IHtsYXQ6IGRhdGFMYXQsIGxuZzogZGF0YUxuZ307XG5cblx0XHRcdFx0XHRcdHZhciBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFwXCIpLCB7XG5cdFx0XHRcdFx0XHRcdFx0em9vbTogMTYsXG5cdFx0XHRcdFx0XHRcdFx0Y2VudGVyOiBjZW50ZXIsXG5cdFx0XHRcdFx0XHRcdFx0c2Nyb2xsd2hlZWw6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRcdGRyYWdnYWJsZTogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XHR6b29tQ29udHJvbDogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XHR6b29tQ29udHJvbE9wdGlvbnM6IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cG9zaXRpb246IGdvb2dsZS5tYXBzLkNvbnRyb2xQb3NpdGlvbi5UT1BfUklHSFRcblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdHBhbkNvbnRyb2w6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRcdG1hcFR5cGVDb250cm9sOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0XHRzdHJlZXRWaWV3Q29udHJvbDogZmFsc2Vcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHR2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG5cdFx0XHRcdFx0XHRcdFx0cG9zaXRpb246IGNlbnRlcixcblx0XHRcdFx0XHRcdFx0XHRtYXA6IG1hcCxcblx0XHRcdFx0XHRcdFx0XHRpY29uOiAkKCcjbWFwJykuYXR0cignZGF0YS1waW4nKSxcblx0XHRcdFx0XHRcdFx0XHR0aXRsZTogXCJteSBwbGFjZVwiXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0fVxufVxuIiwiaW1wb3J0ICcuLi9saWJzL3NsaWNrJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuaGVhZGVyU2xpZGVyKCk7XG4gICAgICAgIHRoaXMuaG9tZVByb2plY3RTbGlkZXIoKTtcbiAgICAgICAgdGhpcy5ob21lVmVydGljYWxTbGlkZXIoKTtcbiAgICAgICAgdGhpcy5jZW50ZXJlZFNsaWRlcigpO1xuICAgICAgICB0aGlzLmRvdWJsZVNsaWRlcigpO1xuICAgIH0sXG5cbiAgICBoZWFkZXJTbGlkZXIoKSB7XG4gICAgICAgICQoJy5zaXRlLWhlYWRlcl9zbGlkZXInKS5zbGljayh7XG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxuICAgICAgICAgICAgYXJyb3dzOiBmYWxzZVxuICAgICAgICB9KTtcblxuICAgICAgICBcbiAgICB9LFxuXG4gICAgaG9tZVByb2plY3RTbGlkZXIoKSB7XG4gICAgICAkKCcucHJvamVjdHMtc2xpZGVyJykuc2xpY2soe1xuICAgICAgICAgIGNlbnRlck1vZGU6IHRydWUsXG4gICAgICAgICAgcmVzcG9uc2l2ZTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDEwMjMsXG4gICAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgICBjZW50ZXJNb2RlOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG5cbiAgICAgICQoJy5wcm9qZWN0cy1zbGlkZXItaW5mbyAuYi1pbmZvX2l0ZW0nKS5lcSgwKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICQoJy5wcm9qZWN0cy1zbGlkZXInKS5vbignYmVmb3JlQ2hhbmdlJywgZnVuY3Rpb24oZXZlbnQsIHNsaWNrLCBjdXJyZW50U2xpZGUsIG5leHRTbGlkZSl7XG4gICAgICAgICQoJy5wcm9qZWN0cy1zbGlkZXItaW5mbyAuYi1pbmZvX2l0ZW0nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgaWYgKCQoJy5wcm9qZWN0cy1zbGlkZXItaW5mbyAuYi1pbmZvX2l0ZW0nKS5lcShuZXh0U2xpZGUpLmxlbmd0aCAhPSAwKSB7XG4gICAgICAgICAgJCgnLnByb2plY3RzLXNsaWRlci1pbmZvIC5iLWluZm9faXRlbScpLmVxKG5leHRTbGlkZSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgaG9tZVZlcnRpY2FsU2xpZGVyKCkge1xuICAgICAgJCgnLmhvbWUtdmVyaWNhbC1zbGlkZXInKS5zbGljayh7XG4gICAgICAgIGRvdHM6IHRydWVcbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBjZW50ZXJlZFNsaWRlcigpIHtcbiAgICAgICQoJy5jZW50ZXItc2xpZGVyJykuc2xpY2soe1xuICAgICAgICBjZW50ZXJNb2RlOiB0cnVlLFxuICAgICAgICBzbGlkZXNUb1Nob3c6IDMsXG4gICAgICAgIHJlc3BvbnNpdmU6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBicmVha3BvaW50OiAxMDIzLFxuICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgY2VudGVyTW9kZTogZmFsc2UsXG4gICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIGRvdWJsZVNsaWRlcigpIHtcbiAgICAgICQoJy5kb3VibGUtc2xpZGVyJykuc2xpY2soe1xuICAgICAgICBjZW50ZXJNb2RlOiB0cnVlLFxuICAgICAgICBzbGlkZXNUb1Nob3c6IDIsXG4gICAgICAgIGNlbnRlclBhZGRpbmc6ICc4MHB4JyxcbiAgICAgICAgcmVzcG9uc2l2ZTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDEwMjMsXG4gICAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgICBjZW50ZXJNb2RlOiBmYWxzZSxcbiAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICAgICAgICBjZW50ZXJQYWRkaW5nOiAnMHB4J1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSk7XG4gICAgfVxufSIsImltcG9ydCBIZWFkZXJGdW5jdGlvbnMgZnJvbSBcIi4uL21vZHVsZXMvaGVhZGVyRnVuY3Rpb25zXCI7XG5pbXBvcnQgU2xpZGVycyBmcm9tIFwiLi4vbW9kdWxlcy9zbGlkZXJzLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBpbml0KCl7XG4gICAgICAgIEhlYWRlckZ1bmN0aW9ucy5pbml0KCk7XG4gICAgICAgIFNsaWRlcnMuaW5pdCgpO1xuICAgIH1cbn07IiwiaW1wb3J0IEhlYWRlckZ1bmN0aW9ucyBmcm9tIFwiLi4vbW9kdWxlcy9oZWFkZXJGdW5jdGlvbnNcIjtcbmltcG9ydCBTbGlkZXJzIGZyb20gXCIuLi9tb2R1bGVzL3NsaWRlcnMuanNcIjtcbmltcG9ydCBGb3JtRnVuY3Rpb25zIGZyb20gXCIuLi9tb2R1bGVzL2Zvcm1GdW5jdGlvbnNcIjtcbmltcG9ydCBHTWFwIGZyb20gJy4uL21vZHVsZXMvbWFwLmpzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGluaXQoKXtcbiAgICAgICAgSGVhZGVyRnVuY3Rpb25zLmluaXQoKTtcbiAgICAgICAgU2xpZGVycy5pbml0KCk7XG4gICAgICAgIEdNYXAuaW5pdCgpO1xuICAgICAgICBGb3JtRnVuY3Rpb25zLmluaXQoKTtcbiAgICB9XG59OyIsImltcG9ydCBIZWFkZXJGdW5jdGlvbnMgZnJvbSBcIi4uL21vZHVsZXMvaGVhZGVyRnVuY3Rpb25zXCI7XG5pbXBvcnQgRm9ybUZ1bmN0aW9ucyBmcm9tIFwiLi4vbW9kdWxlcy9mb3JtRnVuY3Rpb25zXCI7XG5pbXBvcnQgU2xpZGVycyBmcm9tIFwiLi4vbW9kdWxlcy9zbGlkZXJzLmpzXCI7XG5pbXBvcnQgTWFwSW5pdCBmcm9tIFwiLi4vbW9kdWxlcy9tYXAuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGluaXQoKXtcbiAgICAgICAgSGVhZGVyRnVuY3Rpb25zLmluaXQoKTtcbiAgICAgICAgU2xpZGVycy5pbml0KCk7XG4gICAgICAgIC8vIE1hcEluaXQuaW5pdCgpO1xuICAgICAgICBGb3JtRnVuY3Rpb25zLmluaXQoKTtcbiAgICB9XG59OyIsImltcG9ydCBIZWFkZXJGdW5jdGlvbnMgZnJvbSBcIi4uL21vZHVsZXMvaGVhZGVyRnVuY3Rpb25zXCI7XG5pbXBvcnQgU2xpZGVycyBmcm9tIFwiLi4vbW9kdWxlcy9zbGlkZXJzLmpzXCI7XG5pbXBvcnQgUExBWUVSIGZyb20gJy4uL21vZHVsZXMvWVRlbWJlZC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBpbml0KCl7XG4gICAgICAgIEhlYWRlckZ1bmN0aW9ucy5pbml0KCk7XG4gICAgICAgIFNsaWRlcnMuaW5pdCgpO1xuICAgICAgICBQTEFZRVIuaW5pdCgpO1xuICAgIH1cbn07Il19
