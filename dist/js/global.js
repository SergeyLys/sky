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
								zoomControl: false,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvZ2xvYmFsLmpzIiwiYXNzZXRzL2pzL2xpYnMvc2VsZWN0Mi5qcyIsImFzc2V0cy9qcy9saWJzL3NsaWNrLmpzIiwiYXNzZXRzL2pzL21vZHVsZXMvWVRlbWJlZC5qcyIsImFzc2V0cy9qcy9tb2R1bGVzL2Zvcm1GdW5jdGlvbnMuanMiLCJhc3NldHMvanMvbW9kdWxlcy9oZWFkZXJGdW5jdGlvbnMuanMiLCJhc3NldHMvanMvbW9kdWxlcy9tYXAuanMiLCJhc3NldHMvanMvbW9kdWxlcy9zbGlkZXJzLmpzIiwiYXNzZXRzL2pzL3BhZ2VzL0NPTU1PTi5qcyIsImFzc2V0cy9qcy9wYWdlcy9DT05UQUNUUy5qcyIsImFzc2V0cy9qcy9wYWdlcy9IT01FLmpzIiwiYXNzZXRzL2pzL3BhZ2VzL1BST0pFQ1RTLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FDQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQUksT0FBTyxJQUFYOztBQUVBLFFBQVEsT0FBTyxJQUFQLENBQVksSUFBcEI7QUFDSSxTQUFLLFdBQUw7QUFDSSxlQUFPLGVBQUssSUFBTCxDQUFVLElBQVYsZ0JBQVA7QUFDQTtBQUNKLFNBQUssZUFBTDtBQUNJLGVBQU8sbUJBQVMsSUFBVCxDQUFjLElBQWQsb0JBQVA7QUFDQTtBQUNKLFNBQUssYUFBTDtBQUNJLGVBQU8saUJBQU8sSUFBUCxDQUFZLElBQVosa0JBQVA7QUFDQTtBQUNKLFNBQUssZUFBTDtBQUNJLGVBQU8sbUJBQVMsSUFBVCxDQUFjLElBQWQsb0JBQVA7QUFDQTtBQUNKO0FBQ0ksZUFBTyxnQkFBTTtBQUNULG9CQUFRLEdBQVIsQ0FBWSxjQUFaO0FBQ0gsU0FGRDtBQWRSOztBQW1CQSxFQUFFLFFBQUYsRUFBWSxLQUFaLENBQWtCLE1BQWxCOztBQUVBLEVBQUUsTUFBRixFQUFVLEVBQVYsQ0FBYSxRQUFi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VSxHQTNESztBQTREZixrQkFBVSxHQTVESztBQTZEZixrQkFBVSxHQTdESztBQThEZixrQkFBVSxHQTlESztBQStEZixrQkFBVSxHQS9ESztBQWdFZixrQkFBVSxHQWhFSztBQWlFZixrQkFBVSxHQWpFSztBQWtFZixrQkFBVSxHQWxFSztBQW1FZixrQkFBVSxHQW5FSztBQW9FZixrQkFBVSxHQXBFSztBQXFFZixrQkFBVSxHQXJFSztBQXNFZixrQkFBVSxHQXRFSztBQXVFZixrQkFBVSxHQXZFSztBQXdFZixrQkFBVSxHQXhFSztBQXlFZixrQkFBVSxHQXpFSztBQTBFZixrQkFBVSxHQTFFSztBQTJFZixrQkFBVSxJQTNFSztBQTRFZixrQkFBVSxJQTVFSztBQTZFZixrQkFBVSxJQTdFSztBQThFZixrQkFBVSxJQTlFSztBQStFZixrQkFBVSxHQS9FSztBQWdGZixrQkFBVSxHQWhGSztBQWlGZixnQkFBVSxHQWpGSztBQWtGZixnQkFBVSxHQWxGSztBQW1GZixnQkFBVSxHQW5GSztBQW9GZixrQkFBVSxHQXBGSztBQXFGZixrQkFBVSxHQXJGSztBQXNGZixrQkFBVSxHQXRGSztBQXVGZixrQkFBVSxHQXZGSztBQXdGZixrQkFBVSxHQXhGSztBQXlGZixrQkFBVSxHQXpGSztBQTBGZixrQkFBVSxHQTFGSztBQTJGZixrQkFBVSxHQTNGSztBQTRGZixrQkFBVSxHQTVGSztBQTZGZixrQkFBVSxHQTdGSztBQThGZixnQkFBVSxHQTlGSztBQStGZixrQkFBVSxHQS9GSztBQWdHZixrQkFBVSxHQWhHSztBQWlHZixrQkFBVSxHQWpHSztBQWtHZixrQkFBVSxHQWxHSztBQW1HZixrQkFBVSxHQW5HSztBQW9HZixrQkFBVSxHQXBHSztBQXFHZixrQkFBVSxHQXJHSztBQXNHZixrQkFBVSxHQXRHSztBQXVHZixrQkFBVSxHQXZHSztBQXdHZixrQkFBVSxHQXhHSztBQXlHZixrQkFBVSxHQXpHSztBQTBHZixrQkFBVSxHQTFHSztBQTJHZixrQkFBVSxHQTNHSztBQTRHZixrQkFBVSxHQTVHSztBQTZHZixrQkFBVSxHQTdHSztBQThHZixrQkFBVSxHQTlHSztBQStHZixrQkFBVSxHQS9HSztBQWdIZixrQkFBVSxHQWhISztBQWlIZixrQkFBVSxHQWpISztBQWtIZixrQkFBVSxHQWxISztBQW1IZixrQkFBVSxHQW5ISztBQW9IZixrQkFBVSxHQXBISztBQXFIZixrQkFBVSxHQXJISztBQXNIZixrQkFBVSxHQXRISztBQXVIZixrQkFBVSxHQXZISztBQXdIZixrQkFBVSxHQXhISztBQXlIZixrQkFBVSxHQXpISztBQTBIZixrQkFBVSxHQTFISztBQTJIZixrQkFBVSxHQTNISztBQTRIZixrQkFBVSxHQTVISztBQTZIZixrQkFBVSxHQTdISztBQThIZixrQkFBVSxHQTlISztBQStIZixrQkFBVSxHQS9ISztBQWdJZixrQkFBVSxHQWhJSztBQWlJZixrQkFBVSxHQWpJSztBQWtJZixrQkFBVSxHQWxJSztBQW1JZixrQkFBVSxHQW5JSztBQW9JZixrQkFBVSxHQXBJSztBQXFJZixrQkFBVSxHQXJJSztBQXNJZixrQkFBVSxHQXRJSztBQXVJZixrQkFBVSxHQXZJSztBQXdJZixrQkFBVSxHQXhJSztBQXlJZixrQkFBVSxHQXpJSztBQTBJZixrQkFBVSxHQTFJSztBQTJJZixrQkFBVSxHQTNJSztBQTRJZixrQkFBVSxHQTVJSztBQTZJZixrQkFBVSxHQTdJSztBQThJZixnQkFBVSxHQTlJSztBQStJZixnQkFBVSxHQS9JSztBQWdKZixnQkFBVSxHQWhKSztBQWlKZixrQkFBVSxHQWpKSztBQWtKZixrQkFBVSxHQWxKSztBQW1KZixrQkFBVSxHQW5KSztBQW9KZixrQkFBVSxHQXBKSztBQXFKZixnQkFBVSxHQXJKSztBQXNKZixrQkFBVSxHQXRKSztBQXVKZixrQkFBVSxHQXZKSztBQXdKZixrQkFBVSxHQXhKSztBQXlKZixrQkFBVSxHQXpKSztBQTBKZixrQkFBVSxHQTFKSztBQTJKZixrQkFBVSxHQTNKSztBQTRKZixrQkFBVSxHQTVKSztBQTZKZixrQkFBVSxHQTdKSztBQThKZixrQkFBVSxHQTlKSztBQStKZixrQkFBVSxHQS9KSztBQWdLZixrQkFBVSxHQWhLSztBQWlLZixrQkFBVSxHQWpLSztBQWtLZixrQkFBVSxHQWxLSztBQW1LZixrQkFBVSxHQW5LSztBQW9LZixrQkFBVSxHQXBLSztBQXFLZixrQkFBVSxHQXJLSztBQXNLZixrQkFBVSxHQXRLSztBQXVLZixrQkFBVSxHQXZLSztBQXdLZixrQkFBVSxHQXhLSztBQXlLZixrQkFBVSxHQXpLSztBQTBLZixrQkFBVSxHQTFLSztBQTJLZixrQkFBVSxHQTNLSztBQTRLZixrQkFBVSxHQTVLSztBQTZLZixrQkFBVSxHQTdLSztBQThLZixrQkFBVSxHQTlLSztBQStLZixrQkFBVSxHQS9LSztBQWdMZixrQkFBVSxHQWhMSztBQWlMZixrQkFBVSxHQWpMSztBQWtMZixrQkFBVSxHQWxMSztBQW1MZixrQkFBVSxHQW5MSztBQW9MZixrQkFBVSxHQXBMSztBQXFMZixrQkFBVSxHQXJMSztBQXNMZixrQkFBVSxHQXRMSztBQXVMZixrQkFBVSxHQXZMSztBQXdMZixrQkFBVSxHQXhMSztBQXlMZixrQkFBVSxHQXpMSztBQTBMZixrQkFBVSxHQTFMSztBQTJMZixrQkFBVSxHQTNMSztBQTRMZixrQkFBVSxHQTVMSztBQTZMZixrQkFBVSxHQTdMSztBQThMZixrQkFBVSxHQTlMSztBQStMZixrQkFBVSxHQS9MSztBQWdNZixrQkFBVSxHQWhNSztBQWlNZixrQkFBVSxJQWpNSztBQWtNZixrQkFBVSxJQWxNSztBQW1NZixrQkFBVSxHQW5NSztBQW9NZixrQkFBVSxHQXBNSztBQXFNZixrQkFBVSxHQXJNSztBQXNNZixrQkFBVSxHQXRNSztBQXVNZixrQkFBVSxHQXZNSztBQXdNZixrQkFBVSxHQXhNSztBQXlNZixrQkFBVSxHQXpNSztBQTBNZixrQkFBVSxHQTFNSztBQTJNZixrQkFBVSxHQTNNSztBQTRNZixrQkFBVSxHQTVNSztBQTZNZixrQkFBVSxHQTdNSztBQThNZixnQkFBVSxHQTlNSztBQStNZixrQkFBVSxHQS9NSztBQWdOZixrQkFBVSxHQWhOSztBQWlOZixrQkFBVSxHQWpOSztBQWtOZixrQkFBVSxHQWxOSztBQW1OZixrQkFBVSxHQW5OSztBQW9OZixrQkFBVSxHQXBOSztBQXFOZixrQkFBVSxHQXJOSztBQXNOZixrQkFBVSxHQXROSztBQXVOZixrQkFBVSxHQXZOSztBQXdOZixrQkFBVSxHQXhOSztBQXlOZixrQkFBVSxJQXpOSztBQTBOZixrQkFBVSxJQTFOSztBQTJOZixrQkFBVSxHQTNOSztBQTROZixrQkFBVSxHQTVOSztBQTZOZixnQkFBVSxHQTdOSztBQThOZixnQkFBVSxHQTlOSztBQStOZixnQkFBVSxHQS9OSztBQWdPZixrQkFBVSxHQWhPSztBQWlPZixrQkFBVSxHQWpPSztBQWtPZixrQkFBVSxHQWxPSztBQW1PZixrQkFBVSxHQW5PSztBQW9PZixnQkFBVSxHQXBPSztBQXFPZixrQkFBVSxHQXJPSztBQXNPZixrQkFBVSxHQXRPSztBQXVPZixrQkFBVSxHQXZPSztBQXdPZixrQkFBVSxHQXhPSztBQXlPZixrQkFBVSxHQXpPSztBQTBPZixrQkFBVSxHQTFPSztBQTJPZixrQkFBVSxHQTNPSztBQTRPZixrQkFBVSxHQTVPSztBQTZPZixrQkFBVSxHQTdPSztBQThPZixnQkFBVSxHQTlPSztBQStPZixrQkFBVSxHQS9PSztBQWdQZixrQkFBVSxHQWhQSztBQWlQZixrQkFBVSxHQWpQSztBQWtQZixrQkFBVSxHQWxQSztBQW1QZixrQkFBVSxHQW5QSztBQW9QZixrQkFBVSxHQXBQSztBQXFQZixrQkFBVSxHQXJQSztBQXNQZixrQkFBVSxHQXRQSztBQXVQZixrQkFBVSxHQXZQSztBQXdQZixrQkFBVSxHQXhQSztBQXlQZixrQkFBVSxHQXpQSztBQTBQZixrQkFBVSxHQTFQSztBQTJQZixrQkFBVSxHQTNQSztBQTRQZixrQkFBVSxHQTVQSztBQTZQZixrQkFBVSxHQTdQSztBQThQZixrQkFBVSxHQTlQSztBQStQZixnQkFBVSxHQS9QSztBQWdRZixrQkFBVSxHQWhRSztBQWlRZixrQkFBVSxHQWpRSztBQWtRZixrQkFBVSxHQWxRSztBQW1RZixrQkFBVSxHQW5RSztBQW9RZixrQkFBVSxHQXBRSztBQXFRZixrQkFBVSxJQXJRSztBQXNRZixrQkFBVSxJQXRRSztBQXVRZixrQkFBVSxJQXZRSztBQXdRZixrQkFBVSxHQXhRSztBQXlRZixrQkFBVSxHQXpRSztBQTBRZixrQkFBVSxHQTFRSztBQTJRZixrQkFBVSxHQTNRSztBQTRRZixrQkFBVSxHQTVRSztBQTZRZixrQkFBVSxHQTdRSztBQThRZixrQkFBVSxHQTlRSztBQStRZixrQkFBVSxHQS9RSztBQWdSZixrQkFBVSxHQWhSSztBQWlSZixrQkFBVSxHQWpSSztBQWtSZixrQkFBVSxHQWxSSztBQW1SZixrQkFBVSxHQW5SSztBQW9SZixrQkFBVSxHQXBSSztBQXFSZixrQkFBVSxHQXJSSztBQXNSZixrQkFBVSxHQXRSSztBQXVSZixrQkFBVSxHQXZSSztBQXdSZixrQkFBVSxHQXhSSztBQXlSZixrQkFBVSxHQXpSSztBQTBSZixrQkFBVSxHQTFSSztBQTJSZixrQkFBVSxHQTNSSztBQTRSZixrQkFBVSxHQTVSSztBQTZSZixrQkFBVSxHQTdSSztBQThSZixrQkFBVSxHQTlSSztBQStSZixrQkFBVSxHQS9SSztBQWdTZixrQkFBVSxHQWhTSztBQWlTZixrQkFBVSxHQWpTSztBQWtTZixrQkFBVSxHQWxTSztBQW1TZixrQkFBVSxHQW5TSztBQW9TZixrQkFBVSxHQXBTSztBQXFTZixrQkFBVSxHQXJTSztBQXNTZixrQkFBVSxHQXRTSztBQXVTZixrQkFBVSxHQXZTSztBQXdTZixrQkFBVSxHQXhTSztBQXlTZixrQkFBVSxHQXpTSztBQTBTZixrQkFBVSxHQTFTSztBQTJTZixrQkFBVSxHQTNTSztBQTRTZixrQkFBVSxHQTVTSztBQTZTZixrQkFBVSxHQTdTSztBQThTZixrQkFBVSxHQTlTSztBQStTZixrQkFBVSxHQS9TSztBQWdUZixrQkFBVSxHQWhUSztBQWlUZixrQkFBVSxHQWpUSztBQWtUZixrQkFBVSxHQWxUSztBQW1UZixrQkFBVSxHQW5USztBQW9UZixrQkFBVSxHQXBUSztBQXFUZixrQkFBVSxHQXJUSztBQXNUZixrQkFBVSxHQXRUSztBQXVUZixrQkFBVSxHQXZUSztBQXdUZixrQkFBVSxHQXhUSztBQXlUZixrQkFBVSxHQXpUSztBQTBUZixrQkFBVSxHQTFUSztBQTJUZixrQkFBVSxHQTNUSztBQTRUZixrQkFBVSxHQTVUSztBQTZUZixrQkFBVSxHQTdUSztBQThUZixrQkFBVSxHQTlUSztBQStUZixrQkFBVSxHQS9USztBQWdVZixrQkFBVSxHQWhVSztBQWlVZixrQkFBVSxHQWpVSztBQWtVZixrQkFBVSxHQWxVSztBQW1VZixrQkFBVSxHQW5VSztBQW9VZixrQkFBVSxJQXBVSztBQXFVZixrQkFBVSxHQXJVSztBQXNVZixrQkFBVSxHQXRVSztBQXVVZixnQkFBVSxHQXZVSztBQXdVZixnQkFBVSxHQXhVSztBQXlVZixnQkFBVSxHQXpVSztBQTBVZixrQkFBVSxHQTFVSztBQTJVZixrQkFBVSxHQTNVSztBQTRVZixrQkFBVSxHQTVVSztBQTZVZixrQkFBVSxHQTdVSztBQThVZixrQkFBVSxHQTlVSztBQStVZixnQkFBVSxHQS9VSztBQWdWZixrQkFBVSxHQWhWSztBQWlWZixrQkFBVSxHQWpWSztBQWtWZixrQkFBVSxHQWxWSztBQW1WZixrQkFBVSxHQW5WSztBQW9WZixrQkFBVSxHQXBWSztBQXFWZixrQkFBVSxHQXJWSztBQXNWZixrQkFBVSxHQXRWSztBQXVWZixrQkFBVSxHQXZWSztBQXdWZixrQkFBVSxHQXhWSztBQXlWZixrQkFBVSxHQXpWSztBQTBWZixrQkFBVSxHQTFWSztBQTJWZixrQkFBVSxHQTNWSztBQTRWZixrQkFBVSxHQTVWSztBQTZWZixrQkFBVSxHQTdWSztBQThWZixrQkFBVSxHQTlWSztBQStWZixrQkFBVSxHQS9WSztBQWdXZixrQkFBVSxHQWhXSztBQWlXZixrQkFBVSxHQWpXSztBQWtXZixrQkFBVSxHQWxXSztBQW1XZixrQkFBVSxHQW5XSztBQW9XZixrQkFBVSxHQXBXSztBQXFXZixrQkFBVSxHQXJXSztBQXNXZixrQkFBVSxHQXRXSztBQXVXZixrQkFBVSxHQXZXSztBQXdXZixrQkFBVSxHQXhXSztBQXlXZixrQkFBVSxHQXpXSztBQTBXZixrQkFBVSxHQTFXSztBQTJXZixrQkFBVSxHQTNXSztBQTRXZixrQkFBVSxHQTVXSztBQTZXZixrQkFBVSxJQTdXSztBQThXZixrQkFBVSxHQTlXSztBQStXZixrQkFBVSxHQS9XSztBQWdYZixrQkFBVSxHQWhYSztBQWlYZixrQkFBVSxHQWpYSztBQWtYZixrQkFBVSxHQWxYSztBQW1YZixrQkFBVSxHQW5YSztBQW9YZixrQkFBVSxHQXBYSztBQXFYZixrQkFBVSxHQXJYSztBQXNYZixrQkFBVSxHQXRYSztBQXVYZixrQkFBVSxHQXZYSztBQXdYZixrQkFBVSxHQXhYSztBQXlYZixrQkFBVSxHQXpYSztBQTBYZixrQkFBVSxHQTFYSztBQTJYZixrQkFBVSxHQTNYSztBQTRYZixrQkFBVSxHQTVYSztBQTZYZixrQkFBVSxHQTdYSztBQThYZixnQkFBVSxHQTlYSztBQStYZixrQkFBVSxHQS9YSztBQWdZZixrQkFBVSxHQWhZSztBQWlZZixrQkFBVSxHQWpZSztBQWtZZixrQkFBVSxHQWxZSztBQW1ZZixrQkFBVSxHQW5ZSztBQW9ZZixrQkFBVSxHQXBZSztBQXFZZixrQkFBVSxHQXJZSztBQXNZZixrQkFBVSxHQXRZSztBQXVZZixrQkFBVSxHQXZZSztBQXdZZixrQkFBVSxHQXhZSztBQXlZZixrQkFBVSxHQXpZSztBQTBZZixrQkFBVSxHQTFZSztBQTJZZixrQkFBVSxHQTNZSztBQTRZZixrQkFBVSxHQTVZSztBQTZZZixrQkFBVSxHQTdZSztBQThZZixrQkFBVSxHQTlZSztBQStZZixrQkFBVSxHQS9ZSztBQWdaZixrQkFBVSxHQWhaSztBQWlaZixrQkFBVSxHQWpaSztBQWtaZixrQkFBVSxHQWxaSztBQW1aZixrQkFBVSxHQW5aSztBQW9aZixrQkFBVSxHQXBaSztBQXFaZixrQkFBVSxHQXJaSztBQXNaZixrQkFBVSxHQXRaSztBQXVaZixrQkFBVSxHQXZaSztBQXdaZixrQkFBVSxHQXhaSztBQXlaZixnQkFBVSxHQXpaSztBQTBaZixnQkFBVSxHQTFaSztBQTJaZixnQkFBVSxHQTNaSztBQTRaZixrQkFBVSxHQTVaSztBQTZaZixrQkFBVSxHQTdaSztBQThaZixrQkFBVSxHQTlaSztBQStaZixrQkFBVSxHQS9aSztBQWdhZixnQkFBVSxHQWhhSztBQWlhZixrQkFBVSxHQWphSztBQWthZixrQkFBVSxHQWxhSztBQW1hZixrQkFBVSxHQW5hSztBQW9hZixrQkFBVSxHQXBhSztBQXFhZixrQkFBVSxHQXJhSztBQXNhZixrQkFBVSxHQXRhSztBQXVhZixrQkFBVSxHQXZhSztBQXdhZixrQkFBVSxHQXhhSztBQXlhZixnQkFBVSxHQXphSztBQTBhZixrQkFBVSxHQTFhSztBQTJhZixrQkFBVSxHQTNhSztBQTRhZixnQkFBVSxHQTVhSztBQTZhZixrQkFBVSxHQTdhSztBQThhZixrQkFBVSxHQTlhSztBQSthZixrQkFBVSxHQS9hSztBQWdiZixrQkFBVSxHQWhiSztBQWliZixrQkFBVSxHQWpiSztBQWtiZixrQkFBVSxHQWxiSztBQW1iZixrQkFBVSxHQW5iSztBQW9iZixrQkFBVSxHQXBiSztBQXFiZixrQkFBVSxHQXJiSztBQXNiZixrQkFBVSxHQXRiSztBQXViZixrQkFBVSxHQXZiSztBQXdiZixrQkFBVSxJQXhiSztBQXliZixnQkFBVSxJQXpiSztBQTBiZixrQkFBVSxJQTFiSztBQTJiZixrQkFBVSxJQTNiSztBQTRiZixrQkFBVSxJQTViSztBQTZiZixrQkFBVSxJQTdiSztBQThiZixrQkFBVSxJQTliSztBQStiZixrQkFBVSxJQS9iSztBQWdjZixrQkFBVSxJQWhjSztBQWljZixrQkFBVSxHQWpjSztBQWtjZixrQkFBVSxHQWxjSztBQW1jZixrQkFBVSxHQW5jSztBQW9jZixrQkFBVSxHQXBjSztBQXFjZixrQkFBVSxHQXJjSztBQXNjZixrQkFBVSxHQXRjSztBQXVjZixrQkFBVSxHQXZjSztBQXdjZixrQkFBVSxHQXhjSztBQXljZixrQkFBVSxHQXpjSztBQTBjZixrQkFBVSxHQTFjSztBQTJjZixrQkFBVSxHQTNjSztBQTRjZixrQkFBVSxHQTVjSztBQTZjZixrQkFBVSxHQTdjSztBQThjZixrQkFBVSxHQTljSztBQStjZixnQkFBVSxHQS9jSztBQWdkZixrQkFBVSxHQWhkSztBQWlkZixrQkFBVSxHQWpkSztBQWtkZixrQkFBVSxHQWxkSztBQW1kZixrQkFBVSxHQW5kSztBQW9kZixrQkFBVSxHQXBkSztBQXFkZixrQkFBVSxHQXJkSztBQXNkZixrQkFBVSxHQXRkSztBQXVkZixrQkFBVSxHQXZkSztBQXdkZixrQkFBVSxHQXhkSztBQXlkZixrQkFBVSxHQXpkSztBQTBkZixrQkFBVSxHQTFkSztBQTJkZixrQkFBVSxHQTNkSztBQTRkZixrQkFBVSxHQTVkSztBQTZkZixrQkFBVSxHQTdkSztBQThkZixrQkFBVSxHQTlkSztBQStkZixrQkFBVSxHQS9kSztBQWdlZixrQkFBVSxHQWhlSztBQWllZixrQkFBVSxHQWplSztBQWtlZixrQkFBVSxJQWxlSztBQW1lZixrQkFBVSxJQW5lSztBQW9lZixrQkFBVSxHQXBlSztBQXFlZixrQkFBVSxHQXJlSztBQXNlZixnQkFBVSxHQXRlSztBQXVlZixnQkFBVSxHQXZlSztBQXdlZixnQkFBVSxHQXhlSztBQXllZixrQkFBVSxHQXplSztBQTBlZixrQkFBVSxHQTFlSztBQTJlZixrQkFBVSxHQTNlSztBQTRlZixrQkFBVSxHQTVlSztBQTZlZixrQkFBVSxHQTdlSztBQThlZixrQkFBVSxHQTllSztBQStlZixrQkFBVSxHQS9lSztBQWdmZixrQkFBVSxHQWhmSztBQWlmZixrQkFBVSxHQWpmSztBQWtmZixrQkFBVSxHQWxmSztBQW1mZixnQkFBVSxHQW5mSztBQW9mZixrQkFBVSxHQXBmSztBQXFmZixrQkFBVSxHQXJmSztBQXNmZixrQkFBVSxHQXRmSztBQXVmZixrQkFBVSxHQXZmSztBQXdmZixrQkFBVSxHQXhmSztBQXlmZixrQkFBVSxHQXpmSztBQTBmZixrQkFBVSxHQTFmSztBQTJmZixrQkFBVSxHQTNmSztBQTRmZixrQkFBVSxHQTVmSztBQTZmZixrQkFBVSxHQTdmSztBQThmZixrQkFBVSxHQTlmSztBQStmZixrQkFBVSxHQS9mSztBQWdnQmYsa0JBQVUsR0FoZ0JLO0FBaWdCZixrQkFBVSxHQWpnQks7QUFrZ0JmLGtCQUFVLEdBbGdCSztBQW1nQmYsa0JBQVUsR0FuZ0JLO0FBb2dCZixrQkFBVSxHQXBnQks7QUFxZ0JmLGtCQUFVLEdBcmdCSztBQXNnQmYsa0JBQVUsR0F0Z0JLO0FBdWdCZixrQkFBVSxHQXZnQks7QUF3Z0JmLGtCQUFVLEdBeGdCSztBQXlnQmYsa0JBQVUsR0F6Z0JLO0FBMGdCZixrQkFBVSxHQTFnQks7QUEyZ0JmLGtCQUFVLEdBM2dCSztBQTRnQmYsa0JBQVUsR0E1Z0JLO0FBNmdCZixrQkFBVSxHQTdnQks7QUE4Z0JmLGtCQUFVLEdBOWdCSztBQStnQmYsa0JBQVUsR0EvZ0JLO0FBZ2hCZixrQkFBVSxHQWhoQks7QUFpaEJmLGtCQUFVLEdBamhCSztBQWtoQmYsa0JBQVUsR0FsaEJLO0FBbWhCZixrQkFBVSxHQW5oQks7QUFvaEJmLGtCQUFVLEdBcGhCSztBQXFoQmYsa0JBQVUsR0FyaEJLO0FBc2hCZixrQkFBVSxHQXRoQks7QUF1aEJmLGtCQUFVLEdBdmhCSztBQXdoQmYsa0JBQVUsR0F4aEJLO0FBeWhCZixrQkFBVSxHQXpoQks7QUEwaEJmLGtCQUFVLEdBMWhCSztBQTJoQmYsa0JBQVUsR0EzaEJLO0FBNGhCZixrQkFBVSxHQTVoQks7QUE2aEJmLGtCQUFVLEdBN2hCSztBQThoQmYsa0JBQVUsR0E5aEJLO0FBK2hCZixrQkFBVSxHQS9oQks7QUFnaUJmLGtCQUFVLEdBaGlCSztBQWlpQmYsa0JBQVUsR0FqaUJLO0FBa2lCZixrQkFBVSxHQWxpQks7QUFtaUJmLGtCQUFVLElBbmlCSztBQW9pQmYsa0JBQVUsR0FwaUJLO0FBcWlCZixrQkFBVSxHQXJpQks7QUFzaUJmLGdCQUFVLEdBdGlCSztBQXVpQmYsZ0JBQVUsR0F2aUJLO0FBd2lCZixnQkFBVSxHQXhpQks7QUF5aUJmLGtCQUFVLEdBemlCSztBQTBpQmYsa0JBQVUsR0ExaUJLO0FBMmlCZixrQkFBVSxHQTNpQks7QUE0aUJmLGdCQUFVLEdBNWlCSztBQTZpQmYsa0JBQVUsR0E3aUJLO0FBOGlCZixrQkFBVSxHQTlpQks7QUEraUJmLGtCQUFVLEdBL2lCSztBQWdqQmYsa0JBQVUsR0FoakJLO0FBaWpCZixrQkFBVSxHQWpqQks7QUFrakJmLGtCQUFVLEdBbGpCSztBQW1qQmYsa0JBQVUsR0FuakJLO0FBb2pCZixrQkFBVSxHQXBqQks7QUFxakJmLGtCQUFVLEdBcmpCSztBQXNqQmYsa0JBQVUsR0F0akJLO0FBdWpCZixrQkFBVSxHQXZqQks7QUF3akJmLGtCQUFVLEdBeGpCSztBQXlqQmYsa0JBQVUsR0F6akJLO0FBMGpCZixrQkFBVSxHQTFqQks7QUEyakJmLGtCQUFVLEdBM2pCSztBQTRqQmYsa0JBQVUsR0E1akJLO0FBNmpCZixrQkFBVSxHQTdqQks7QUE4akJmLGtCQUFVLEdBOWpCSztBQStqQmYsa0JBQVUsR0EvakJLO0FBZ2tCZixrQkFBVSxHQWhrQks7QUFpa0JmLGtCQUFVLEdBamtCSztBQWtrQmYsa0JBQVUsR0Fsa0JLO0FBbWtCZixrQkFBVSxHQW5rQks7QUFva0JmLGtCQUFVLEdBcGtCSztBQXFrQmYsa0JBQVUsR0Fya0JLO0FBc2tCZixrQkFBVSxHQXRrQks7QUF1a0JmLGtCQUFVLEdBdmtCSztBQXdrQmYsa0JBQVUsR0F4a0JLO0FBeWtCZixrQkFBVSxHQXprQks7QUEwa0JmLGtCQUFVLEdBMWtCSztBQTJrQmYsa0JBQVUsR0Eza0JLO0FBNGtCZixrQkFBVSxHQTVrQks7QUE2a0JmLGtCQUFVLEdBN2tCSztBQThrQmYsa0JBQVUsR0E5a0JLO0FBK2tCZixrQkFBVSxHQS9rQks7QUFnbEJmLGtCQUFVLEdBaGxCSztBQWlsQmYsa0JBQVUsR0FqbEJLO0FBa2xCZixrQkFBVSxHQWxsQks7QUFtbEJmLGtCQUFVLEdBbmxCSztBQW9sQmYsa0JBQVUsR0FwbEJLO0FBcWxCZixrQkFBVSxHQXJsQks7QUFzbEJmLGtCQUFVLEdBdGxCSztBQXVsQmYsa0JBQVUsR0F2bEJLO0FBd2xCZixrQkFBVSxHQXhsQks7QUF5bEJmLGtCQUFVLEdBemxCSztBQTBsQmYsa0JBQVUsR0ExbEJLO0FBMmxCZixrQkFBVSxJQTNsQks7QUE0bEJmLGtCQUFVLEdBNWxCSztBQTZsQmYsa0JBQVUsR0E3bEJLO0FBOGxCZixrQkFBVSxHQTlsQks7QUErbEJmLGtCQUFVLEdBL2xCSztBQWdtQmYsa0JBQVUsR0FobUJLO0FBaW1CZixrQkFBVSxHQWptQks7QUFrbUJmLGtCQUFVLEdBbG1CSztBQW1tQmYsa0JBQVUsR0FubUJLO0FBb21CZixrQkFBVSxHQXBtQks7QUFxbUJmLGtCQUFVLEdBcm1CSztBQXNtQmYsa0JBQVUsR0F0bUJLO0FBdW1CZixnQkFBVSxHQXZtQks7QUF3bUJmLGtCQUFVLEdBeG1CSztBQXltQmYsa0JBQVUsR0F6bUJLO0FBMG1CZixrQkFBVSxHQTFtQks7QUEybUJmLGtCQUFVLEdBM21CSztBQTRtQmYsa0JBQVUsR0E1bUJLO0FBNm1CZixrQkFBVSxHQTdtQks7QUE4bUJmLGtCQUFVLEdBOW1CSztBQSttQmYsa0JBQVUsR0EvbUJLO0FBZ25CZixrQkFBVSxHQWhuQks7QUFpbkJmLGtCQUFVLEdBam5CSztBQWtuQmYsa0JBQVUsR0FsbkJLO0FBbW5CZixrQkFBVSxJQW5uQks7QUFvbkJmLGtCQUFVLEdBcG5CSztBQXFuQmYsa0JBQVUsR0FybkJLO0FBc25CZixnQkFBVSxHQXRuQks7QUF1bkJmLGdCQUFVLEdBdm5CSztBQXduQmYsZ0JBQVUsR0F4bkJLO0FBeW5CZixrQkFBVSxHQXpuQks7QUEwbkJmLGtCQUFVLEdBMW5CSztBQTJuQmYsa0JBQVUsR0EzbkJLO0FBNG5CZixrQkFBVSxHQTVuQks7QUE2bkJmLGdCQUFVLEdBN25CSztBQThuQmYsa0JBQVUsR0E5bkJLO0FBK25CZixrQkFBVSxHQS9uQks7QUFnb0JmLGtCQUFVLEdBaG9CSztBQWlvQmYsa0JBQVUsR0Fqb0JLO0FBa29CZixrQkFBVSxHQWxvQks7QUFtb0JmLGtCQUFVLEdBbm9CSztBQW9vQmYsa0JBQVUsR0Fwb0JLO0FBcW9CZixrQkFBVSxHQXJvQks7QUFzb0JmLGtCQUFVLEdBdG9CSztBQXVvQmYsZ0JBQVUsR0F2b0JLO0FBd29CZixrQkFBVSxHQXhvQks7QUF5b0JmLGtCQUFVLEdBem9CSztBQTBvQmYsa0JBQVUsR0Exb0JLO0FBMm9CZixrQkFBVSxHQTNvQks7QUE0b0JmLGtCQUFVLEdBNW9CSztBQTZvQmYsa0JBQVUsR0E3b0JLO0FBOG9CZixrQkFBVSxHQTlvQks7QUErb0JmLGtCQUFVLEdBL29CSztBQWdwQmYsa0JBQVUsR0FocEJLO0FBaXBCZixrQkFBVSxHQWpwQks7QUFrcEJmLGtCQUFVLEdBbHBCSztBQW1wQmYsa0JBQVUsR0FucEJLO0FBb3BCZixrQkFBVSxHQXBwQks7QUFxcEJmLGtCQUFVLEdBcnBCSztBQXNwQmYsa0JBQVUsR0F0cEJLO0FBdXBCZixrQkFBVSxHQXZwQks7QUF3cEJmLGdCQUFVLEdBeHBCSztBQXlwQmYsa0JBQVUsR0F6cEJLO0FBMHBCZixrQkFBVSxHQTFwQks7QUEycEJmLGtCQUFVLEdBM3BCSztBQTRwQmYsa0JBQVUsR0E1cEJLO0FBNnBCZixrQkFBVSxHQTdwQks7QUE4cEJmLGtCQUFVLElBOXBCSztBQStwQmYsa0JBQVUsSUEvcEJLO0FBZ3FCZixrQkFBVSxJQWhxQks7QUFpcUJmLGtCQUFVLEdBanFCSztBQWtxQmYsa0JBQVUsR0FscUJLO0FBbXFCZixrQkFBVSxHQW5xQks7QUFvcUJmLGtCQUFVLEdBcHFCSztBQXFxQmYsa0JBQVUsR0FycUJLO0FBc3FCZixrQkFBVSxHQXRxQks7QUF1cUJmLGtCQUFVLEdBdnFCSztBQXdxQmYsa0JBQVUsR0F4cUJLO0FBeXFCZixrQkFBVSxHQXpxQks7QUEwcUJmLGtCQUFVLEdBMXFCSztBQTJxQmYsa0JBQVUsR0EzcUJLO0FBNHFCZixrQkFBVSxHQTVxQks7QUE2cUJmLGtCQUFVLEdBN3FCSztBQThxQmYsa0JBQVUsR0E5cUJLO0FBK3FCZixrQkFBVSxHQS9xQks7QUFnckJmLGtCQUFVLEdBaHJCSztBQWlyQmYsa0JBQVUsR0FqckJLO0FBa3JCZixrQkFBVSxHQWxyQks7QUFtckJmLGtCQUFVLEdBbnJCSztBQW9yQmYsa0JBQVUsR0FwckJLO0FBcXJCZixrQkFBVSxHQXJyQks7QUFzckJmLGtCQUFVLEdBdHJCSztBQXVyQmYsa0JBQVUsR0F2ckJLO0FBd3JCZixrQkFBVSxHQXhyQks7QUF5ckJmLGtCQUFVLEdBenJCSztBQTByQmYsa0JBQVUsR0ExckJLO0FBMnJCZixrQkFBVSxHQTNyQks7QUE0ckJmLGtCQUFVLEdBNXJCSztBQTZyQmYsa0JBQVUsR0E3ckJLO0FBOHJCZixrQkFBVSxHQTlyQks7QUErckJmLGtCQUFVLEdBL3JCSztBQWdzQmYsa0JBQVUsR0Foc0JLO0FBaXNCZixnQkFBVSxHQWpzQks7QUFrc0JmLGtCQUFVLEdBbHNCSztBQW1zQmYsa0JBQVUsR0Fuc0JLO0FBb3NCZixrQkFBVSxHQXBzQks7QUFxc0JmLGtCQUFVLEdBcnNCSztBQXNzQmYsa0JBQVUsR0F0c0JLO0FBdXNCZixrQkFBVSxHQXZzQks7QUF3c0JmLGtCQUFVLEdBeHNCSztBQXlzQmYsa0JBQVUsR0F6c0JLO0FBMHNCZixrQkFBVSxHQTFzQks7QUEyc0JmLGtCQUFVLEdBM3NCSztBQTRzQmYsa0JBQVUsR0E1c0JLO0FBNnNCZixrQkFBVSxHQTdzQks7QUE4c0JmLGtCQUFVLEdBOXNCSztBQStzQmYsa0JBQVUsR0Evc0JLO0FBZ3RCZixrQkFBVSxHQWh0Qks7QUFpdEJmLGtCQUFVLEdBanRCSztBQWt0QmYsa0JBQVUsR0FsdEJLO0FBbXRCZixrQkFBVSxHQW50Qks7QUFvdEJmLGtCQUFVLEdBcHRCSztBQXF0QmYsa0JBQVUsR0FydEJLO0FBc3RCZixrQkFBVSxHQXR0Qks7QUF1dEJmLGtCQUFVLEdBdnRCSztBQXd0QmYsa0JBQVUsR0F4dEJLO0FBeXRCZixrQkFBVSxHQXp0Qks7QUEwdEJmLGtCQUFVLEdBMXRCSztBQTJ0QmYsa0JBQVUsR0EzdEJLO0FBNHRCZixrQkFBVSxHQTV0Qks7QUE2dEJmLGtCQUFVLEdBN3RCSztBQTh0QmYsa0JBQVUsR0E5dEJLO0FBK3RCZixrQkFBVSxJQS90Qks7QUFndUJmLGtCQUFVLEdBaHVCSztBQWl1QmYsa0JBQVUsR0FqdUJLO0FBa3VCZixnQkFBVSxHQWx1Qks7QUFtdUJmLGdCQUFVLEdBbnVCSztBQW91QmYsZ0JBQVUsR0FwdUJLO0FBcXVCZixrQkFBVSxHQXJ1Qks7QUFzdUJmLGtCQUFVLEdBdHVCSztBQXV1QmYsa0JBQVUsR0F2dUJLO0FBd3VCZixrQkFBVSxHQXh1Qks7QUF5dUJmLGtCQUFVLEdBenVCSztBQTB1QmYsZ0JBQVUsR0ExdUJLO0FBMnVCZixrQkFBVSxHQTN1Qks7QUE0dUJmLGtCQUFVLEdBNXVCSztBQTZ1QmYsa0JBQVUsR0E3dUJLO0FBOHVCZixrQkFBVSxHQTl1Qks7QUErdUJmLGtCQUFVLEdBL3VCSztBQWd2QmYsa0JBQVUsR0FodkJLO0FBaXZCZixrQkFBVSxHQWp2Qks7QUFrdkJmLGtCQUFVLEdBbHZCSztBQW12QmYsa0JBQVUsR0FudkJLO0FBb3ZCZixrQkFBVSxHQXB2Qks7QUFxdkJmLGtCQUFVLEdBcnZCSztBQXN2QmYsa0JBQVUsR0F0dkJLO0FBdXZCZixrQkFBVSxHQXZ2Qks7QUF3dkJmLGtCQUFVLEdBeHZCSztBQXl2QmYsa0JBQVUsR0F6dkJLO0FBMHZCZixrQkFBVSxHQTF2Qks7QUEydkJmLGtCQUFVLEdBM3ZCSztBQTR2QmYsa0JBQVUsR0E1dkJLO0FBNnZCZixrQkFBVSxHQTd2Qks7QUE4dkJmLGtCQUFVLEdBOXZCSztBQSt2QmYsa0JBQVUsR0EvdkJLO0FBZ3dCZixrQkFBVSxHQWh3Qks7QUFpd0JmLGtCQUFVLEdBandCSztBQWt3QmYsa0JBQVUsR0Fsd0JLO0FBbXdCZixrQkFBVSxHQW53Qks7QUFvd0JmLGtCQUFVLEdBcHdCSztBQXF3QmYsa0JBQVUsR0Fyd0JLO0FBc3dCZixrQkFBVSxHQXR3Qks7QUF1d0JmLGtCQUFVLEdBdndCSztBQXd3QmYsa0JBQVUsSUF4d0JLO0FBeXdCZixrQkFBVSxHQXp3Qks7QUEwd0JmLGtCQUFVLEdBMXdCSztBQTJ3QmYsa0JBQVUsR0Ezd0JLO0FBNHdCZixrQkFBVSxHQTV3Qks7QUE2d0JmLGtCQUFVLEdBN3dCSztBQTh3QmYsa0JBQVUsR0E5d0JLO0FBK3dCZixrQkFBVSxHQS93Qks7QUFneEJmLGtCQUFVLEdBaHhCSztBQWl4QmYsa0JBQVUsR0FqeEJLO0FBa3hCZixrQkFBVSxHQWx4Qks7QUFteEJmLGtCQUFVLEdBbnhCSztBQW94QmYsa0JBQVUsR0FweEJLO0FBcXhCZixrQkFBVSxHQXJ4Qks7QUFzeEJmLGtCQUFVLEdBdHhCSztBQXV4QmYsa0JBQVUsR0F2eEJLO0FBd3hCZixrQkFBVSxHQXh4Qks7QUF5eEJmLGtCQUFVLEdBenhCSztBQTB4QmYsZ0JBQVUsR0ExeEJLO0FBMnhCZixrQkFBVSxHQTN4Qks7QUE0eEJmLGtCQUFVLEdBNXhCSztBQTZ4QmYsa0JBQVUsR0E3eEJLO0FBOHhCZixrQkFBVSxHQTl4Qks7QUEreEJmLGdCQUFVLEdBL3hCSztBQWd5QmYsa0JBQVUsR0FoeUJLO0FBaXlCZixrQkFBVSxHQWp5Qks7QUFreUJmLGtCQUFVLEdBbHlCSztBQW15QmYsa0JBQVUsR0FueUJLO0FBb3lCZixrQkFBVSxHQXB5Qks7QUFxeUJmLGtCQUFVLEdBcnlCSztBQXN5QmYsa0JBQVUsR0F0eUJLO0FBdXlCZixrQkFBVSxHQXZ5Qks7QUF3eUJmLGtCQUFVLEdBeHlCSztBQXl5QmYsa0JBQVUsR0F6eUJLO0FBMHlCZixrQkFBVSxHQTF5Qks7QUEyeUJmLGtCQUFVLEdBM3lCSztBQTR5QmYsa0JBQVUsR0E1eUJLO0FBNnlCZixrQkFBVSxHQTd5Qks7QUE4eUJmLGtCQUFVLEdBOXlCSztBQSt5QmYsa0JBQVUsR0EveUJLO0FBZ3pCZixrQkFBVSxHQWh6Qks7QUFpekJmLGtCQUFVLEdBanpCSztBQWt6QmYsa0JBQVUsR0FsekJLO0FBbXpCZixrQkFBVSxRQW56Qks7QUFvekJmLGtCQUFVLFFBcHpCSztBQXF6QmYsa0JBQVUsUUFyekJLO0FBc3pCZixrQkFBVSxRQXR6Qks7QUF1ekJmLGtCQUFVLFFBdnpCSztBQXd6QmYsa0JBQVUsUUF4ekJLO0FBeXpCZixrQkFBVSxRQXp6Qks7QUEwekJmLGtCQUFVLFFBMXpCSztBQTJ6QmYsa0JBQVUsUUEzekJLO0FBNHpCZixrQkFBVSxRQTV6Qks7QUE2ekJmLGtCQUFVLFFBN3pCSztBQTh6QmYsa0JBQVUsUUE5ekJLO0FBK3pCZixrQkFBVSxRQS96Qks7QUFnMEJmLGtCQUFVLFFBaDBCSztBQWkwQmYsa0JBQVUsUUFqMEJLO0FBazBCZixrQkFBVSxRQWwwQks7QUFtMEJmLGtCQUFVLFFBbjBCSztBQW8wQmYsa0JBQVUsUUFwMEJLO0FBcTBCZixrQkFBVSxRQXIwQks7QUFzMEJmLGtCQUFVLFFBdDBCSztBQXUwQmYsa0JBQVU7QUF2MEJLLE9BQWpCOztBQTAwQkEsYUFBTyxVQUFQO0FBQ0QsS0E5MEJEOztBQWcxQkEsT0FBRyxNQUFILENBQVUsbUJBQVYsRUFBOEIsQ0FDNUIsVUFENEIsQ0FBOUIsRUFFRyxVQUFVLEtBQVYsRUFBaUI7QUFDbEIsZUFBUyxXQUFULENBQXNCLFFBQXRCLEVBQWdDLE9BQWhDLEVBQXlDO0FBQ3ZDLG9CQUFZLFNBQVosQ0FBc0IsV0FBdEIsQ0FBa0MsSUFBbEMsQ0FBdUMsSUFBdkM7QUFDRDs7QUFFRCxZQUFNLE1BQU4sQ0FBYSxXQUFiLEVBQTBCLE1BQU0sVUFBaEM7O0FBRUEsa0JBQVksU0FBWixDQUFzQixPQUF0QixHQUFnQyxVQUFVLFFBQVYsRUFBb0I7QUFDbEQsY0FBTSxJQUFJLEtBQUosQ0FBVSx3REFBVixDQUFOO0FBQ0QsT0FGRDs7QUFJQSxrQkFBWSxTQUFaLENBQXNCLEtBQXRCLEdBQThCLFVBQVUsTUFBVixFQUFrQixRQUFsQixFQUE0QjtBQUN4RCxjQUFNLElBQUksS0FBSixDQUFVLHNEQUFWLENBQU47QUFDRCxPQUZEOztBQUlBLGtCQUFZLFNBQVosQ0FBc0IsSUFBdEIsR0FBNkIsVUFBVSxTQUFWLEVBQXFCLFVBQXJCLEVBQWlDO0FBQzVEO0FBQ0QsT0FGRDs7QUFJQSxrQkFBWSxTQUFaLENBQXNCLE9BQXRCLEdBQWdDLFlBQVk7QUFDMUM7QUFDRCxPQUZEOztBQUlBLGtCQUFZLFNBQVosQ0FBc0IsZ0JBQXRCLEdBQXlDLFVBQVUsU0FBVixFQUFxQixJQUFyQixFQUEyQjtBQUNsRSxZQUFJLEtBQUssVUFBVSxFQUFWLEdBQWUsVUFBeEI7O0FBRUEsY0FBTSxNQUFNLGFBQU4sQ0FBb0IsQ0FBcEIsQ0FBTjs7QUFFQSxZQUFJLEtBQUssRUFBTCxJQUFXLElBQWYsRUFBcUI7QUFDbkIsZ0JBQU0sTUFBTSxLQUFLLEVBQUwsQ0FBUSxRQUFSLEVBQVo7QUFDRCxTQUZELE1BRU87QUFDTCxnQkFBTSxNQUFNLE1BQU0sYUFBTixDQUFvQixDQUFwQixDQUFaO0FBQ0Q7QUFDRCxlQUFPLEVBQVA7QUFDRCxPQVhEOztBQWFBLGFBQU8sV0FBUDtBQUNELEtBdkNEOztBQXlDQSxPQUFHLE1BQUgsQ0FBVSxxQkFBVixFQUFnQyxDQUM5QixRQUQ4QixFQUU5QixVQUY4QixFQUc5QixRQUg4QixDQUFoQyxFQUlHLFVBQVUsV0FBVixFQUF1QixLQUF2QixFQUE4QixDQUE5QixFQUFpQztBQUNsQyxlQUFTLGFBQVQsQ0FBd0IsUUFBeEIsRUFBa0MsT0FBbEMsRUFBMkM7QUFDekMsYUFBSyxRQUFMLEdBQWdCLFFBQWhCO0FBQ0EsYUFBSyxPQUFMLEdBQWUsT0FBZjs7QUFFQSxzQkFBYyxTQUFkLENBQXdCLFdBQXhCLENBQW9DLElBQXBDLENBQXlDLElBQXpDO0FBQ0Q7O0FBRUQsWUFBTSxNQUFOLENBQWEsYUFBYixFQUE0QixXQUE1Qjs7QUFFQSxvQkFBYyxTQUFkLENBQXdCLE9BQXhCLEdBQWtDLFVBQVUsUUFBVixFQUFvQjtBQUNwRCxZQUFJLE9BQU8sRUFBWDtBQUNBLFlBQUksT0FBTyxJQUFYOztBQUVBLGFBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsV0FBbkIsRUFBZ0MsSUFBaEMsQ0FBcUMsWUFBWTtBQUMvQyxjQUFJLFVBQVUsRUFBRSxJQUFGLENBQWQ7O0FBRUEsY0FBSSxTQUFTLEtBQUssSUFBTCxDQUFVLE9BQVYsQ0FBYjs7QUFFQSxlQUFLLElBQUwsQ0FBVSxNQUFWO0FBQ0QsU0FORDs7QUFRQSxpQkFBUyxJQUFUO0FBQ0QsT0FiRDs7QUFlQSxvQkFBYyxTQUFkLENBQXdCLE1BQXhCLEdBQWlDLFVBQVUsSUFBVixFQUFnQjtBQUMvQyxZQUFJLE9BQU8sSUFBWDs7QUFFQSxhQUFLLFFBQUwsR0FBZ0IsSUFBaEI7O0FBRUE7QUFDQSxZQUFJLEVBQUUsS0FBSyxPQUFQLEVBQWdCLEVBQWhCLENBQW1CLFFBQW5CLENBQUosRUFBa0M7QUFDaEMsZUFBSyxPQUFMLENBQWEsUUFBYixHQUF3QixJQUF4Qjs7QUFFQSxlQUFLLFFBQUwsQ0FBYyxPQUFkLENBQXNCLFFBQXRCOztBQUVBO0FBQ0Q7O0FBRUQsWUFBSSxLQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLFVBQW5CLENBQUosRUFBb0M7QUFDbEMsZUFBSyxPQUFMLENBQWEsVUFBVSxXQUFWLEVBQXVCO0FBQ2xDLGdCQUFJLE1BQU0sRUFBVjs7QUFFQSxtQkFBTyxDQUFDLElBQUQsQ0FBUDtBQUNBLGlCQUFLLElBQUwsQ0FBVSxLQUFWLENBQWdCLElBQWhCLEVBQXNCLFdBQXRCOztBQUVBLGlCQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxNQUF6QixFQUFpQyxHQUFqQyxFQUFzQztBQUNwQyxrQkFBSSxLQUFLLEtBQUssQ0FBTCxFQUFRLEVBQWpCOztBQUVBLGtCQUFJLEVBQUUsT0FBRixDQUFVLEVBQVYsRUFBYyxHQUFkLE1BQXVCLENBQUMsQ0FBNUIsRUFBK0I7QUFDN0Isb0JBQUksSUFBSixDQUFTLEVBQVQ7QUFDRDtBQUNGOztBQUVELGlCQUFLLFFBQUwsQ0FBYyxHQUFkLENBQWtCLEdBQWxCO0FBQ0EsaUJBQUssUUFBTCxDQUFjLE9BQWQsQ0FBc0IsUUFBdEI7QUFDRCxXQWhCRDtBQWlCRCxTQWxCRCxNQWtCTztBQUNMLGNBQUksTUFBTSxLQUFLLEVBQWY7O0FBRUEsZUFBSyxRQUFMLENBQWMsR0FBZCxDQUFrQixHQUFsQjtBQUNBLGVBQUssUUFBTCxDQUFjLE9BQWQsQ0FBc0IsUUFBdEI7QUFDRDtBQUNGLE9BdENEOztBQXdDQSxvQkFBYyxTQUFkLENBQXdCLFFBQXhCLEdBQW1DLFVBQVUsSUFBVixFQUFnQjtBQUNqRCxZQUFJLE9BQU8sSUFBWDs7QUFFQSxZQUFJLENBQUMsS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixVQUFuQixDQUFMLEVBQXFDO0FBQ25DO0FBQ0Q7O0FBRUQsYUFBSyxRQUFMLEdBQWdCLEtBQWhCOztBQUVBLFlBQUksRUFBRSxLQUFLLE9BQVAsRUFBZ0IsRUFBaEIsQ0FBbUIsUUFBbkIsQ0FBSixFQUFrQztBQUNoQyxlQUFLLE9BQUwsQ0FBYSxRQUFiLEdBQXdCLEtBQXhCOztBQUVBLGVBQUssUUFBTCxDQUFjLE9BQWQsQ0FBc0IsUUFBdEI7O0FBRUE7QUFDRDs7QUFFRCxhQUFLLE9BQUwsQ0FBYSxVQUFVLFdBQVYsRUFBdUI7QUFDbEMsY0FBSSxNQUFNLEVBQVY7O0FBRUEsZUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFlBQVksTUFBaEMsRUFBd0MsR0FBeEMsRUFBNkM7QUFDM0MsZ0JBQUksS0FBSyxZQUFZLENBQVosRUFBZSxFQUF4Qjs7QUFFQSxnQkFBSSxPQUFPLEtBQUssRUFBWixJQUFrQixFQUFFLE9BQUYsQ0FBVSxFQUFWLEVBQWMsR0FBZCxNQUF1QixDQUFDLENBQTlDLEVBQWlEO0FBQy9DLGtCQUFJLElBQUosQ0FBUyxFQUFUO0FBQ0Q7QUFDRjs7QUFFRCxlQUFLLFFBQUwsQ0FBYyxHQUFkLENBQWtCLEdBQWxCOztBQUVBLGVBQUssUUFBTCxDQUFjLE9BQWQsQ0FBc0IsUUFBdEI7QUFDRCxTQWREO0FBZUQsT0FoQ0Q7O0FBa0NBLG9CQUFjLFNBQWQsQ0FBd0IsSUFBeEIsR0FBK0IsVUFBVSxTQUFWLEVBQXFCLFVBQXJCLEVBQWlDO0FBQzlELFlBQUksT0FBTyxJQUFYOztBQUVBLGFBQUssU0FBTCxHQUFpQixTQUFqQjs7QUFFQSxrQkFBVSxFQUFWLENBQWEsUUFBYixFQUF1QixVQUFVLE1BQVYsRUFBa0I7QUFDdkMsZUFBSyxNQUFMLENBQVksT0FBTyxJQUFuQjtBQUNELFNBRkQ7O0FBSUEsa0JBQVUsRUFBVixDQUFhLFVBQWIsRUFBeUIsVUFBVSxNQUFWLEVBQWtCO0FBQ3pDLGVBQUssUUFBTCxDQUFjLE9BQU8sSUFBckI7QUFDRCxTQUZEO0FBR0QsT0FaRDs7QUFjQSxvQkFBYyxTQUFkLENBQXdCLE9BQXhCLEdBQWtDLFlBQVk7QUFDNUM7QUFDQSxhQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLEdBQW5CLEVBQXdCLElBQXhCLENBQTZCLFlBQVk7QUFDdkM7QUFDQSxZQUFFLFVBQUYsQ0FBYSxJQUFiLEVBQW1CLE1BQW5CO0FBQ0QsU0FIRDtBQUlELE9BTkQ7O0FBUUEsb0JBQWMsU0FBZCxDQUF3QixLQUF4QixHQUFnQyxVQUFVLE1BQVYsRUFBa0IsUUFBbEIsRUFBNEI7QUFDMUQsWUFBSSxPQUFPLEVBQVg7QUFDQSxZQUFJLE9BQU8sSUFBWDs7QUFFQSxZQUFJLFdBQVcsS0FBSyxRQUFMLENBQWMsUUFBZCxFQUFmOztBQUVBLGlCQUFTLElBQVQsQ0FBYyxZQUFZO0FBQ3hCLGNBQUksVUFBVSxFQUFFLElBQUYsQ0FBZDs7QUFFQSxjQUFJLENBQUMsUUFBUSxFQUFSLENBQVcsUUFBWCxDQUFELElBQXlCLENBQUMsUUFBUSxFQUFSLENBQVcsVUFBWCxDQUE5QixFQUFzRDtBQUNwRDtBQUNEOztBQUVELGNBQUksU0FBUyxLQUFLLElBQUwsQ0FBVSxPQUFWLENBQWI7O0FBRUEsY0FBSSxVQUFVLEtBQUssT0FBTCxDQUFhLE1BQWIsRUFBcUIsTUFBckIsQ0FBZDs7QUFFQSxjQUFJLFlBQVksSUFBaEIsRUFBc0I7QUFDcEIsaUJBQUssSUFBTCxDQUFVLE9BQVY7QUFDRDtBQUNGLFNBZEQ7O0FBZ0JBLGlCQUFTO0FBQ1AsbUJBQVM7QUFERixTQUFUO0FBR0QsT0F6QkQ7O0FBMkJBLG9CQUFjLFNBQWQsQ0FBd0IsVUFBeEIsR0FBcUMsVUFBVSxRQUFWLEVBQW9CO0FBQ3ZELGNBQU0sVUFBTixDQUFpQixLQUFLLFFBQXRCLEVBQWdDLFFBQWhDO0FBQ0QsT0FGRDs7QUFJQSxvQkFBYyxTQUFkLENBQXdCLE1BQXhCLEdBQWlDLFVBQVUsSUFBVixFQUFnQjtBQUMvQyxZQUFJLE1BQUo7O0FBRUEsWUFBSSxLQUFLLFFBQVQsRUFBbUI7QUFDakIsbUJBQVMsU0FBUyxhQUFULENBQXVCLFVBQXZCLENBQVQ7QUFDQSxpQkFBTyxLQUFQLEdBQWUsS0FBSyxJQUFwQjtBQUNELFNBSEQsTUFHTztBQUNMLG1CQUFTLFNBQVMsYUFBVCxDQUF1QixRQUF2QixDQUFUOztBQUVBLGNBQUksT0FBTyxXQUFQLEtBQXVCLFNBQTNCLEVBQXNDO0FBQ3BDLG1CQUFPLFdBQVAsR0FBcUIsS0FBSyxJQUExQjtBQUNELFdBRkQsTUFFTztBQUNMLG1CQUFPLFNBQVAsR0FBbUIsS0FBSyxJQUF4QjtBQUNEO0FBQ0Y7O0FBRUQsWUFBSSxLQUFLLEVBQVQsRUFBYTtBQUNYLGlCQUFPLEtBQVAsR0FBZSxLQUFLLEVBQXBCO0FBQ0Q7O0FBRUQsWUFBSSxLQUFLLFFBQVQsRUFBbUI7QUFDakIsaUJBQU8sUUFBUCxHQUFrQixJQUFsQjtBQUNEOztBQUVELFlBQUksS0FBSyxRQUFULEVBQW1CO0FBQ2pCLGlCQUFPLFFBQVAsR0FBa0IsSUFBbEI7QUFDRDs7QUFFRCxZQUFJLEtBQUssS0FBVCxFQUFnQjtBQUNkLGlCQUFPLEtBQVAsR0FBZSxLQUFLLEtBQXBCO0FBQ0Q7O0FBRUQsWUFBSSxVQUFVLEVBQUUsTUFBRixDQUFkOztBQUVBLFlBQUksaUJBQWlCLEtBQUssY0FBTCxDQUFvQixJQUFwQixDQUFyQjtBQUNBLHVCQUFlLE9BQWYsR0FBeUIsTUFBekI7O0FBRUE7QUFDQSxVQUFFLElBQUYsQ0FBTyxNQUFQLEVBQWUsTUFBZixFQUF1QixjQUF2Qjs7QUFFQSxlQUFPLE9BQVA7QUFDRCxPQXpDRDs7QUEyQ0Esb0JBQWMsU0FBZCxDQUF3QixJQUF4QixHQUErQixVQUFVLE9BQVYsRUFBbUI7QUFDaEQsWUFBSSxPQUFPLEVBQVg7O0FBRUEsZUFBTyxFQUFFLElBQUYsQ0FBTyxRQUFRLENBQVIsQ0FBUCxFQUFtQixNQUFuQixDQUFQOztBQUVBLFlBQUksUUFBUSxJQUFaLEVBQWtCO0FBQ2hCLGlCQUFPLElBQVA7QUFDRDs7QUFFRCxZQUFJLFFBQVEsRUFBUixDQUFXLFFBQVgsQ0FBSixFQUEwQjtBQUN4QixpQkFBTztBQUNMLGdCQUFJLFFBQVEsR0FBUixFQURDO0FBRUwsa0JBQU0sUUFBUSxJQUFSLEVBRkQ7QUFHTCxzQkFBVSxRQUFRLElBQVIsQ0FBYSxVQUFiLENBSEw7QUFJTCxzQkFBVSxRQUFRLElBQVIsQ0FBYSxVQUFiLENBSkw7QUFLTCxtQkFBTyxRQUFRLElBQVIsQ0FBYSxPQUFiO0FBTEYsV0FBUDtBQU9ELFNBUkQsTUFRTyxJQUFJLFFBQVEsRUFBUixDQUFXLFVBQVgsQ0FBSixFQUE0QjtBQUNqQyxpQkFBTztBQUNMLGtCQUFNLFFBQVEsSUFBUixDQUFhLE9BQWIsQ0FERDtBQUVMLHNCQUFVLEVBRkw7QUFHTCxtQkFBTyxRQUFRLElBQVIsQ0FBYSxPQUFiO0FBSEYsV0FBUDs7QUFNQSxjQUFJLFlBQVksUUFBUSxRQUFSLENBQWlCLFFBQWpCLENBQWhCO0FBQ0EsY0FBSSxXQUFXLEVBQWY7O0FBRUEsZUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFVBQVUsTUFBOUIsRUFBc0MsR0FBdEMsRUFBMkM7QUFDekMsZ0JBQUksU0FBUyxFQUFFLFVBQVUsQ0FBVixDQUFGLENBQWI7O0FBRUEsZ0JBQUksUUFBUSxLQUFLLElBQUwsQ0FBVSxNQUFWLENBQVo7O0FBRUEscUJBQVMsSUFBVCxDQUFjLEtBQWQ7QUFDRDs7QUFFRCxlQUFLLFFBQUwsR0FBZ0IsUUFBaEI7QUFDRDs7QUFFRCxlQUFPLEtBQUssY0FBTCxDQUFvQixJQUFwQixDQUFQO0FBQ0EsYUFBSyxPQUFMLEdBQWUsUUFBUSxDQUFSLENBQWY7O0FBRUEsVUFBRSxJQUFGLENBQU8sUUFBUSxDQUFSLENBQVAsRUFBbUIsTUFBbkIsRUFBMkIsSUFBM0I7O0FBRUEsZUFBTyxJQUFQO0FBQ0QsT0E1Q0Q7O0FBOENBLG9CQUFjLFNBQWQsQ0FBd0IsY0FBeEIsR0FBeUMsVUFBVSxJQUFWLEVBQWdCO0FBQ3ZELFlBQUksQ0FBQyxFQUFFLGFBQUYsQ0FBZ0IsSUFBaEIsQ0FBTCxFQUE0QjtBQUMxQixpQkFBTztBQUNMLGdCQUFJLElBREM7QUFFTCxrQkFBTTtBQUZELFdBQVA7QUFJRDs7QUFFRCxlQUFPLEVBQUUsTUFBRixDQUFTLEVBQVQsRUFBYTtBQUNsQixnQkFBTTtBQURZLFNBQWIsRUFFSixJQUZJLENBQVA7O0FBSUEsWUFBSSxXQUFXO0FBQ2Isb0JBQVUsS0FERztBQUViLG9CQUFVO0FBRkcsU0FBZjs7QUFLQSxZQUFJLEtBQUssRUFBTCxJQUFXLElBQWYsRUFBcUI7QUFDbkIsZUFBSyxFQUFMLEdBQVUsS0FBSyxFQUFMLENBQVEsUUFBUixFQUFWO0FBQ0Q7O0FBRUQsWUFBSSxLQUFLLElBQUwsSUFBYSxJQUFqQixFQUF1QjtBQUNyQixlQUFLLElBQUwsR0FBWSxLQUFLLElBQUwsQ0FBVSxRQUFWLEVBQVo7QUFDRDs7QUFFRCxZQUFJLEtBQUssU0FBTCxJQUFrQixJQUFsQixJQUEwQixLQUFLLEVBQS9CLElBQXFDLEtBQUssU0FBTCxJQUFrQixJQUEzRCxFQUFpRTtBQUMvRCxlQUFLLFNBQUwsR0FBaUIsS0FBSyxnQkFBTCxDQUFzQixLQUFLLFNBQTNCLEVBQXNDLElBQXRDLENBQWpCO0FBQ0Q7O0FBRUQsZUFBTyxFQUFFLE1BQUYsQ0FBUyxFQUFULEVBQWEsUUFBYixFQUF1QixJQUF2QixDQUFQO0FBQ0QsT0E5QkQ7O0FBZ0NBLG9CQUFjLFNBQWQsQ0FBd0IsT0FBeEIsR0FBa0MsVUFBVSxNQUFWLEVBQWtCLElBQWxCLEVBQXdCO0FBQ3hELFlBQUksVUFBVSxLQUFLLE9BQUwsQ0FBYSxHQUFiLENBQWlCLFNBQWpCLENBQWQ7O0FBRUEsZUFBTyxRQUFRLE1BQVIsRUFBZ0IsSUFBaEIsQ0FBUDtBQUNELE9BSkQ7O0FBTUEsYUFBTyxhQUFQO0FBQ0QsS0E1UkQ7O0FBOFJBLE9BQUcsTUFBSCxDQUFVLG9CQUFWLEVBQStCLENBQzdCLFVBRDZCLEVBRTdCLFVBRjZCLEVBRzdCLFFBSDZCLENBQS9CLEVBSUcsVUFBVSxhQUFWLEVBQXlCLEtBQXpCLEVBQWdDLENBQWhDLEVBQW1DO0FBQ3BDLGVBQVMsWUFBVCxDQUF1QixRQUF2QixFQUFpQyxPQUFqQyxFQUEwQztBQUN4QyxZQUFJLE9BQU8sUUFBUSxHQUFSLENBQVksTUFBWixLQUF1QixFQUFsQzs7QUFFQSxxQkFBYSxTQUFiLENBQXVCLFdBQXZCLENBQW1DLElBQW5DLENBQXdDLElBQXhDLEVBQThDLFFBQTlDLEVBQXdELE9BQXhEOztBQUVBLGFBQUssVUFBTCxDQUFnQixLQUFLLGdCQUFMLENBQXNCLElBQXRCLENBQWhCO0FBQ0Q7O0FBRUQsWUFBTSxNQUFOLENBQWEsWUFBYixFQUEyQixhQUEzQjs7QUFFQSxtQkFBYSxTQUFiLENBQXVCLE1BQXZCLEdBQWdDLFVBQVUsSUFBVixFQUFnQjtBQUM5QyxZQUFJLFVBQVUsS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixRQUFuQixFQUE2QixNQUE3QixDQUFvQyxVQUFVLENBQVYsRUFBYSxHQUFiLEVBQWtCO0FBQ2xFLGlCQUFPLElBQUksS0FBSixJQUFhLEtBQUssRUFBTCxDQUFRLFFBQVIsRUFBcEI7QUFDRCxTQUZhLENBQWQ7O0FBSUEsWUFBSSxRQUFRLE1BQVIsS0FBbUIsQ0FBdkIsRUFBMEI7QUFDeEIsb0JBQVUsS0FBSyxNQUFMLENBQVksSUFBWixDQUFWOztBQUVBLGVBQUssVUFBTCxDQUFnQixPQUFoQjtBQUNEOztBQUVELHFCQUFhLFNBQWIsQ0FBdUIsTUFBdkIsQ0FBOEIsSUFBOUIsQ0FBbUMsSUFBbkMsRUFBeUMsSUFBekM7QUFDRCxPQVpEOztBQWNBLG1CQUFhLFNBQWIsQ0FBdUIsZ0JBQXZCLEdBQTBDLFVBQVUsSUFBVixFQUFnQjtBQUN4RCxZQUFJLE9BQU8sSUFBWDs7QUFFQSxZQUFJLFlBQVksS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixRQUFuQixDQUFoQjtBQUNBLFlBQUksY0FBYyxVQUFVLEdBQVYsQ0FBYyxZQUFZO0FBQzFDLGlCQUFPLEtBQUssSUFBTCxDQUFVLEVBQUUsSUFBRixDQUFWLEVBQW1CLEVBQTFCO0FBQ0QsU0FGaUIsRUFFZixHQUZlLEVBQWxCOztBQUlBLFlBQUksV0FBVyxFQUFmOztBQUVBO0FBQ0EsaUJBQVMsUUFBVCxDQUFtQixJQUFuQixFQUF5QjtBQUN2QixpQkFBTyxZQUFZO0FBQ2pCLG1CQUFPLEVBQUUsSUFBRixFQUFRLEdBQVIsTUFBaUIsS0FBSyxFQUE3QjtBQUNELFdBRkQ7QUFHRDs7QUFFRCxhQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxNQUF6QixFQUFpQyxHQUFqQyxFQUFzQztBQUNwQyxjQUFJLE9BQU8sS0FBSyxjQUFMLENBQW9CLEtBQUssQ0FBTCxDQUFwQixDQUFYOztBQUVBO0FBQ0EsY0FBSSxFQUFFLE9BQUYsQ0FBVSxLQUFLLEVBQWYsRUFBbUIsV0FBbkIsS0FBbUMsQ0FBdkMsRUFBMEM7QUFDeEMsZ0JBQUksa0JBQWtCLFVBQVUsTUFBVixDQUFpQixTQUFTLElBQVQsQ0FBakIsQ0FBdEI7O0FBRUEsZ0JBQUksZUFBZSxLQUFLLElBQUwsQ0FBVSxlQUFWLENBQW5CO0FBQ0EsZ0JBQUksVUFBVSxFQUFFLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQixJQUFuQixFQUF5QixZQUF6QixDQUFkOztBQUVBLGdCQUFJLGFBQWEsS0FBSyxNQUFMLENBQVksT0FBWixDQUFqQjs7QUFFQSw0QkFBZ0IsV0FBaEIsQ0FBNEIsVUFBNUI7O0FBRUE7QUFDRDs7QUFFRCxjQUFJLFVBQVUsS0FBSyxNQUFMLENBQVksSUFBWixDQUFkOztBQUVBLGNBQUksS0FBSyxRQUFULEVBQW1CO0FBQ2pCLGdCQUFJLFlBQVksS0FBSyxnQkFBTCxDQUFzQixLQUFLLFFBQTNCLENBQWhCOztBQUVBLGtCQUFNLFVBQU4sQ0FBaUIsT0FBakIsRUFBMEIsU0FBMUI7QUFDRDs7QUFFRCxtQkFBUyxJQUFULENBQWMsT0FBZDtBQUNEOztBQUVELGVBQU8sUUFBUDtBQUNELE9BOUNEOztBQWdEQSxhQUFPLFlBQVA7QUFDRCxLQTlFRDs7QUFnRkEsT0FBRyxNQUFILENBQVUsbUJBQVYsRUFBOEIsQ0FDNUIsU0FENEIsRUFFNUIsVUFGNEIsRUFHNUIsUUFINEIsQ0FBOUIsRUFJRyxVQUFVLFlBQVYsRUFBd0IsS0FBeEIsRUFBK0IsQ0FBL0IsRUFBa0M7QUFDbkMsZUFBUyxXQUFULENBQXNCLFFBQXRCLEVBQWdDLE9BQWhDLEVBQXlDO0FBQ3ZDLGFBQUssV0FBTCxHQUFtQixLQUFLLGNBQUwsQ0FBb0IsUUFBUSxHQUFSLENBQVksTUFBWixDQUFwQixDQUFuQjs7QUFFQSxZQUFJLEtBQUssV0FBTCxDQUFpQixjQUFqQixJQUFtQyxJQUF2QyxFQUE2QztBQUMzQyxlQUFLLGNBQUwsR0FBc0IsS0FBSyxXQUFMLENBQWlCLGNBQXZDO0FBQ0Q7O0FBRUQsb0JBQVksU0FBWixDQUFzQixXQUF0QixDQUFrQyxJQUFsQyxDQUF1QyxJQUF2QyxFQUE2QyxRQUE3QyxFQUF1RCxPQUF2RDtBQUNEOztBQUVELFlBQU0sTUFBTixDQUFhLFdBQWIsRUFBMEIsWUFBMUI7O0FBRUEsa0JBQVksU0FBWixDQUFzQixjQUF0QixHQUF1QyxVQUFVLE9BQVYsRUFBbUI7QUFDeEQsWUFBSSxXQUFXO0FBQ2IsZ0JBQU0sY0FBVSxNQUFWLEVBQWtCO0FBQ3RCLG1CQUFPLEVBQUUsTUFBRixDQUFTLEVBQVQsRUFBYSxNQUFiLEVBQXFCO0FBQzFCLGlCQUFHLE9BQU87QUFEZ0IsYUFBckIsQ0FBUDtBQUdELFdBTFk7QUFNYixxQkFBVyxtQkFBVSxNQUFWLEVBQWtCLE9BQWxCLEVBQTJCLE9BQTNCLEVBQW9DO0FBQzdDLGdCQUFJLFdBQVcsRUFBRSxJQUFGLENBQU8sTUFBUCxDQUFmOztBQUVBLHFCQUFTLElBQVQsQ0FBYyxPQUFkO0FBQ0EscUJBQVMsSUFBVCxDQUFjLE9BQWQ7O0FBRUEsbUJBQU8sUUFBUDtBQUNEO0FBYlksU0FBZjs7QUFnQkEsZUFBTyxFQUFFLE1BQUYsQ0FBUyxFQUFULEVBQWEsUUFBYixFQUF1QixPQUF2QixFQUFnQyxJQUFoQyxDQUFQO0FBQ0QsT0FsQkQ7O0FBb0JBLGtCQUFZLFNBQVosQ0FBc0IsY0FBdEIsR0FBdUMsVUFBVSxPQUFWLEVBQW1CO0FBQ3hELGVBQU8sT0FBUDtBQUNELE9BRkQ7O0FBSUEsa0JBQVksU0FBWixDQUFzQixLQUF0QixHQUE4QixVQUFVLE1BQVYsRUFBa0IsUUFBbEIsRUFBNEI7QUFDeEQsWUFBSSxVQUFVLEVBQWQ7QUFDQSxZQUFJLE9BQU8sSUFBWDs7QUFFQSxZQUFJLEtBQUssUUFBTCxJQUFpQixJQUFyQixFQUEyQjtBQUN6QjtBQUNBLGNBQUksRUFBRSxVQUFGLENBQWEsS0FBSyxRQUFMLENBQWMsS0FBM0IsQ0FBSixFQUF1QztBQUNyQyxpQkFBSyxRQUFMLENBQWMsS0FBZDtBQUNEOztBQUVELGVBQUssUUFBTCxHQUFnQixJQUFoQjtBQUNEOztBQUVELFlBQUksVUFBVSxFQUFFLE1BQUYsQ0FBUztBQUNyQixnQkFBTTtBQURlLFNBQVQsRUFFWCxLQUFLLFdBRk0sQ0FBZDs7QUFJQSxZQUFJLE9BQU8sUUFBUSxHQUFmLEtBQXVCLFVBQTNCLEVBQXVDO0FBQ3JDLGtCQUFRLEdBQVIsR0FBYyxRQUFRLEdBQVIsQ0FBWSxJQUFaLENBQWlCLEtBQUssUUFBdEIsRUFBZ0MsTUFBaEMsQ0FBZDtBQUNEOztBQUVELFlBQUksT0FBTyxRQUFRLElBQWYsS0FBd0IsVUFBNUIsRUFBd0M7QUFDdEMsa0JBQVEsSUFBUixHQUFlLFFBQVEsSUFBUixDQUFhLElBQWIsQ0FBa0IsS0FBSyxRQUF2QixFQUFpQyxNQUFqQyxDQUFmO0FBQ0Q7O0FBRUQsaUJBQVMsT0FBVCxHQUFvQjtBQUNsQixjQUFJLFdBQVcsUUFBUSxTQUFSLENBQWtCLE9BQWxCLEVBQTJCLFVBQVUsSUFBVixFQUFnQjtBQUN4RCxnQkFBSSxVQUFVLEtBQUssY0FBTCxDQUFvQixJQUFwQixFQUEwQixNQUExQixDQUFkOztBQUVBLGdCQUFJLEtBQUssT0FBTCxDQUFhLEdBQWIsQ0FBaUIsT0FBakIsS0FBNkIsT0FBTyxPQUFwQyxJQUErQyxRQUFRLEtBQTNELEVBQWtFO0FBQ2hFO0FBQ0Esa0JBQUksQ0FBQyxPQUFELElBQVksQ0FBQyxRQUFRLE9BQXJCLElBQWdDLENBQUMsRUFBRSxPQUFGLENBQVUsUUFBUSxPQUFsQixDQUFyQyxFQUFpRTtBQUMvRCx3QkFBUSxLQUFSLENBQ0UsOERBQ0EsZ0NBRkY7QUFJRDtBQUNGOztBQUVELHFCQUFTLE9BQVQ7QUFDRCxXQWRjLEVBY1osWUFBWTtBQUNiO0FBQ0E7QUFDQSxnQkFBSSxTQUFTLE1BQVQsSUFBbUIsU0FBUyxNQUFULEtBQW9CLEdBQTNDLEVBQWdEO0FBQzlDO0FBQ0Q7O0FBRUQsaUJBQUssT0FBTCxDQUFhLGlCQUFiLEVBQWdDO0FBQzlCLHVCQUFTO0FBRHFCLGFBQWhDO0FBR0QsV0F4QmMsQ0FBZjs7QUEwQkEsZUFBSyxRQUFMLEdBQWdCLFFBQWhCO0FBQ0Q7O0FBRUQsWUFBSSxLQUFLLFdBQUwsQ0FBaUIsS0FBakIsSUFBMEIsT0FBTyxJQUFQLElBQWUsSUFBN0MsRUFBbUQ7QUFDakQsY0FBSSxLQUFLLGFBQVQsRUFBd0I7QUFDdEIsbUJBQU8sWUFBUCxDQUFvQixLQUFLLGFBQXpCO0FBQ0Q7O0FBRUQsZUFBSyxhQUFMLEdBQXFCLE9BQU8sVUFBUCxDQUFrQixPQUFsQixFQUEyQixLQUFLLFdBQUwsQ0FBaUIsS0FBNUMsQ0FBckI7QUFDRCxTQU5ELE1BTU87QUFDTDtBQUNEO0FBQ0YsT0FoRUQ7O0FBa0VBLGFBQU8sV0FBUDtBQUNELEtBNUdEOztBQThHQSxPQUFHLE1BQUgsQ0FBVSxtQkFBVixFQUE4QixDQUM1QixRQUQ0QixDQUE5QixFQUVHLFVBQVUsQ0FBVixFQUFhO0FBQ2QsZUFBUyxJQUFULENBQWUsU0FBZixFQUEwQixRQUExQixFQUFvQyxPQUFwQyxFQUE2QztBQUMzQyxZQUFJLE9BQU8sUUFBUSxHQUFSLENBQVksTUFBWixDQUFYOztBQUVBLFlBQUksWUFBWSxRQUFRLEdBQVIsQ0FBWSxXQUFaLENBQWhCOztBQUVBLFlBQUksY0FBYyxTQUFsQixFQUE2QjtBQUMzQixlQUFLLFNBQUwsR0FBaUIsU0FBakI7QUFDRDs7QUFFRCxZQUFJLFlBQVksUUFBUSxHQUFSLENBQVksV0FBWixDQUFoQjs7QUFFQSxZQUFJLGNBQWMsU0FBbEIsRUFBNkI7QUFDekIsZUFBSyxTQUFMLEdBQWlCLFNBQWpCO0FBQ0g7O0FBRUQsa0JBQVUsSUFBVixDQUFlLElBQWYsRUFBcUIsUUFBckIsRUFBK0IsT0FBL0I7O0FBRUEsWUFBSSxFQUFFLE9BQUYsQ0FBVSxJQUFWLENBQUosRUFBcUI7QUFDbkIsZUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssTUFBekIsRUFBaUMsR0FBakMsRUFBc0M7QUFDcEMsZ0JBQUksTUFBTSxLQUFLLENBQUwsQ0FBVjtBQUNBLGdCQUFJLE9BQU8sS0FBSyxjQUFMLENBQW9CLEdBQXBCLENBQVg7O0FBRUEsZ0JBQUksVUFBVSxLQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWQ7O0FBRUEsaUJBQUssUUFBTCxDQUFjLE1BQWQsQ0FBcUIsT0FBckI7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQsV0FBSyxTQUFMLENBQWUsS0FBZixHQUF1QixVQUFVLFNBQVYsRUFBcUIsTUFBckIsRUFBNkIsUUFBN0IsRUFBdUM7QUFDNUQsWUFBSSxPQUFPLElBQVg7O0FBRUEsYUFBSyxjQUFMOztBQUVBLFlBQUksT0FBTyxJQUFQLElBQWUsSUFBZixJQUF1QixPQUFPLElBQVAsSUFBZSxJQUExQyxFQUFnRDtBQUM5QyxvQkFBVSxJQUFWLENBQWUsSUFBZixFQUFxQixNQUFyQixFQUE2QixRQUE3QjtBQUNBO0FBQ0Q7O0FBRUQsaUJBQVMsT0FBVCxDQUFrQixHQUFsQixFQUF1QixLQUF2QixFQUE4QjtBQUM1QixjQUFJLE9BQU8sSUFBSSxPQUFmOztBQUVBLGVBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLE1BQXpCLEVBQWlDLEdBQWpDLEVBQXNDO0FBQ3BDLGdCQUFJLFNBQVMsS0FBSyxDQUFMLENBQWI7O0FBRUEsZ0JBQUksZ0JBQ0YsT0FBTyxRQUFQLElBQW1CLElBQW5CLElBQ0EsQ0FBQyxRQUFRO0FBQ1AsdUJBQVMsT0FBTztBQURULGFBQVIsRUFFRSxJQUZGLENBRkg7O0FBT0EsZ0JBQUksWUFBWSxPQUFPLElBQVAsS0FBZ0IsT0FBTyxJQUF2Qzs7QUFFQSxnQkFBSSxhQUFhLGFBQWpCLEVBQWdDO0FBQzlCLGtCQUFJLEtBQUosRUFBVztBQUNULHVCQUFPLEtBQVA7QUFDRDs7QUFFRCxrQkFBSSxJQUFKLEdBQVcsSUFBWDtBQUNBLHVCQUFTLEdBQVQ7O0FBRUE7QUFDRDtBQUNGOztBQUVELGNBQUksS0FBSixFQUFXO0FBQ1QsbUJBQU8sSUFBUDtBQUNEOztBQUVELGNBQUksTUFBTSxLQUFLLFNBQUwsQ0FBZSxNQUFmLENBQVY7O0FBRUEsY0FBSSxPQUFPLElBQVgsRUFBaUI7QUFDZixnQkFBSSxVQUFVLEtBQUssTUFBTCxDQUFZLEdBQVosQ0FBZDtBQUNBLG9CQUFRLElBQVIsQ0FBYSxrQkFBYixFQUFpQyxJQUFqQzs7QUFFQSxpQkFBSyxVQUFMLENBQWdCLENBQUMsT0FBRCxDQUFoQjs7QUFFQSxpQkFBSyxTQUFMLENBQWUsSUFBZixFQUFxQixHQUFyQjtBQUNEOztBQUVELGNBQUksT0FBSixHQUFjLElBQWQ7O0FBRUEsbUJBQVMsR0FBVDtBQUNEOztBQUVELGtCQUFVLElBQVYsQ0FBZSxJQUFmLEVBQXFCLE1BQXJCLEVBQTZCLE9BQTdCO0FBQ0QsT0ExREQ7O0FBNERBLFdBQUssU0FBTCxDQUFlLFNBQWYsR0FBMkIsVUFBVSxTQUFWLEVBQXFCLE1BQXJCLEVBQTZCO0FBQ3RELFlBQUksT0FBTyxFQUFFLElBQUYsQ0FBTyxPQUFPLElBQWQsQ0FBWDs7QUFFQSxZQUFJLFNBQVMsRUFBYixFQUFpQjtBQUNmLGlCQUFPLElBQVA7QUFDRDs7QUFFRCxlQUFPO0FBQ0wsY0FBSSxJQURDO0FBRUwsZ0JBQU07QUFGRCxTQUFQO0FBSUQsT0FYRDs7QUFhQSxXQUFLLFNBQUwsQ0FBZSxTQUFmLEdBQTJCLFVBQVUsQ0FBVixFQUFhLElBQWIsRUFBbUIsR0FBbkIsRUFBd0I7QUFDakQsYUFBSyxPQUFMLENBQWEsR0FBYjtBQUNELE9BRkQ7O0FBSUEsV0FBSyxTQUFMLENBQWUsY0FBZixHQUFnQyxVQUFVLENBQVYsRUFBYTtBQUMzQyxZQUFJLE1BQU0sS0FBSyxRQUFmOztBQUVBLFlBQUksV0FBVyxLQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLDBCQUFuQixDQUFmOztBQUVBLGlCQUFTLElBQVQsQ0FBYyxZQUFZO0FBQ3hCLGNBQUksS0FBSyxRQUFULEVBQW1CO0FBQ2pCO0FBQ0Q7O0FBRUQsWUFBRSxJQUFGLEVBQVEsTUFBUjtBQUNELFNBTkQ7QUFPRCxPQVpEOztBQWNBLGFBQU8sSUFBUDtBQUNELEtBNUhEOztBQThIQSxPQUFHLE1BQUgsQ0FBVSx3QkFBVixFQUFtQyxDQUNqQyxRQURpQyxDQUFuQyxFQUVHLFVBQVUsQ0FBVixFQUFhO0FBQ2QsZUFBUyxTQUFULENBQW9CLFNBQXBCLEVBQStCLFFBQS9CLEVBQXlDLE9BQXpDLEVBQWtEO0FBQ2hELFlBQUksWUFBWSxRQUFRLEdBQVIsQ0FBWSxXQUFaLENBQWhCOztBQUVBLFlBQUksY0FBYyxTQUFsQixFQUE2QjtBQUMzQixlQUFLLFNBQUwsR0FBaUIsU0FBakI7QUFDRDs7QUFFRCxrQkFBVSxJQUFWLENBQWUsSUFBZixFQUFxQixRQUFyQixFQUErQixPQUEvQjtBQUNEOztBQUVELGdCQUFVLFNBQVYsQ0FBb0IsSUFBcEIsR0FBMkIsVUFBVSxTQUFWLEVBQXFCLFNBQXJCLEVBQWdDLFVBQWhDLEVBQTRDO0FBQ3JFLGtCQUFVLElBQVYsQ0FBZSxJQUFmLEVBQXFCLFNBQXJCLEVBQWdDLFVBQWhDOztBQUVBLGFBQUssT0FBTCxHQUFnQixVQUFVLFFBQVYsQ0FBbUIsT0FBbkIsSUFBOEIsVUFBVSxTQUFWLENBQW9CLE9BQWxELElBQ2QsV0FBVyxJQUFYLENBQWdCLHdCQUFoQixDQURGO0FBRUQsT0FMRDs7QUFPQSxnQkFBVSxTQUFWLENBQW9CLEtBQXBCLEdBQTRCLFVBQVUsU0FBVixFQUFxQixNQUFyQixFQUE2QixRQUE3QixFQUF1QztBQUNqRSxZQUFJLE9BQU8sSUFBWDs7QUFFQSxpQkFBUyxlQUFULENBQTBCLElBQTFCLEVBQWdDO0FBQzlCO0FBQ0EsY0FBSSxPQUFPLEtBQUssY0FBTCxDQUFvQixJQUFwQixDQUFYOztBQUVBO0FBQ0E7QUFDQSxjQUFJLG1CQUFtQixLQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLFFBQW5CLEVBQTZCLE1BQTdCLENBQW9DLFlBQVk7QUFDckUsbUJBQU8sRUFBRSxJQUFGLEVBQVEsR0FBUixPQUFrQixLQUFLLEVBQTlCO0FBQ0QsV0FGc0IsQ0FBdkI7O0FBSUE7QUFDQSxjQUFJLENBQUMsaUJBQWlCLE1BQXRCLEVBQThCO0FBQzVCLGdCQUFJLFVBQVUsS0FBSyxNQUFMLENBQVksSUFBWixDQUFkO0FBQ0Esb0JBQVEsSUFBUixDQUFhLGtCQUFiLEVBQWlDLElBQWpDOztBQUVBLGlCQUFLLGNBQUw7QUFDQSxpQkFBSyxVQUFMLENBQWdCLENBQUMsT0FBRCxDQUFoQjtBQUNEOztBQUVEO0FBQ0EsaUJBQU8sSUFBUDtBQUNEOztBQUVELGlCQUFTLE1BQVQsQ0FBaUIsSUFBakIsRUFBdUI7QUFDckIsZUFBSyxPQUFMLENBQWEsUUFBYixFQUF1QjtBQUNyQixrQkFBTTtBQURlLFdBQXZCO0FBR0Q7O0FBRUQsZUFBTyxJQUFQLEdBQWMsT0FBTyxJQUFQLElBQWUsRUFBN0I7O0FBRUEsWUFBSSxZQUFZLEtBQUssU0FBTCxDQUFlLE1BQWYsRUFBdUIsS0FBSyxPQUE1QixFQUFxQyxlQUFyQyxDQUFoQjs7QUFFQSxZQUFJLFVBQVUsSUFBVixLQUFtQixPQUFPLElBQTlCLEVBQW9DO0FBQ2xDO0FBQ0EsY0FBSSxLQUFLLE9BQUwsQ0FBYSxNQUFqQixFQUF5QjtBQUN2QixpQkFBSyxPQUFMLENBQWEsR0FBYixDQUFpQixVQUFVLElBQTNCO0FBQ0EsaUJBQUssT0FBTCxDQUFhLEtBQWI7QUFDRDs7QUFFRCxpQkFBTyxJQUFQLEdBQWMsVUFBVSxJQUF4QjtBQUNEOztBQUVELGtCQUFVLElBQVYsQ0FBZSxJQUFmLEVBQXFCLE1BQXJCLEVBQTZCLFFBQTdCO0FBQ0QsT0EvQ0Q7O0FBaURBLGdCQUFVLFNBQVYsQ0FBb0IsU0FBcEIsR0FBZ0MsVUFBVSxDQUFWLEVBQWEsTUFBYixFQUFxQixPQUFyQixFQUE4QixRQUE5QixFQUF3QztBQUN0RSxZQUFJLGFBQWEsUUFBUSxHQUFSLENBQVksaUJBQVosS0FBa0MsRUFBbkQ7QUFDQSxZQUFJLE9BQU8sT0FBTyxJQUFsQjtBQUNBLFlBQUksSUFBSSxDQUFSOztBQUVBLFlBQUksWUFBWSxLQUFLLFNBQUwsSUFBa0IsVUFBVSxNQUFWLEVBQWtCO0FBQ2xELGlCQUFPO0FBQ0wsZ0JBQUksT0FBTyxJQUROO0FBRUwsa0JBQU0sT0FBTztBQUZSLFdBQVA7QUFJRCxTQUxEOztBQU9BLGVBQU8sSUFBSSxLQUFLLE1BQWhCLEVBQXdCO0FBQ3RCLGNBQUksV0FBVyxLQUFLLENBQUwsQ0FBZjs7QUFFQSxjQUFJLEVBQUUsT0FBRixDQUFVLFFBQVYsRUFBb0IsVUFBcEIsTUFBb0MsQ0FBQyxDQUF6QyxFQUE0QztBQUMxQzs7QUFFQTtBQUNEOztBQUVELGNBQUksT0FBTyxLQUFLLE1BQUwsQ0FBWSxDQUFaLEVBQWUsQ0FBZixDQUFYO0FBQ0EsY0FBSSxhQUFhLEVBQUUsTUFBRixDQUFTLEVBQVQsRUFBYSxNQUFiLEVBQXFCO0FBQ3BDLGtCQUFNO0FBRDhCLFdBQXJCLENBQWpCOztBQUlBLGNBQUksT0FBTyxVQUFVLFVBQVYsQ0FBWDs7QUFFQSxjQUFJLFFBQVEsSUFBWixFQUFrQjtBQUNoQjtBQUNBO0FBQ0Q7O0FBRUQsbUJBQVMsSUFBVDs7QUFFQTtBQUNBLGlCQUFPLEtBQUssTUFBTCxDQUFZLElBQUksQ0FBaEIsS0FBc0IsRUFBN0I7QUFDQSxjQUFJLENBQUo7QUFDRDs7QUFFRCxlQUFPO0FBQ0wsZ0JBQU07QUFERCxTQUFQO0FBR0QsT0EzQ0Q7O0FBNkNBLGFBQU8sU0FBUDtBQUNELEtBbkhEOztBQXFIQSxPQUFHLE1BQUgsQ0FBVSxpQ0FBVixFQUE0QyxFQUE1QyxFQUVHLFlBQVk7QUFDYixlQUFTLGtCQUFULENBQTZCLFNBQTdCLEVBQXdDLEVBQXhDLEVBQTRDLE9BQTVDLEVBQXFEO0FBQ25ELGFBQUssa0JBQUwsR0FBMEIsUUFBUSxHQUFSLENBQVksb0JBQVosQ0FBMUI7O0FBRUEsa0JBQVUsSUFBVixDQUFlLElBQWYsRUFBcUIsRUFBckIsRUFBeUIsT0FBekI7QUFDRDs7QUFFRCx5QkFBbUIsU0FBbkIsQ0FBNkIsS0FBN0IsR0FBcUMsVUFBVSxTQUFWLEVBQXFCLE1BQXJCLEVBQTZCLFFBQTdCLEVBQXVDO0FBQzFFLGVBQU8sSUFBUCxHQUFjLE9BQU8sSUFBUCxJQUFlLEVBQTdCOztBQUVBLFlBQUksT0FBTyxJQUFQLENBQVksTUFBWixHQUFxQixLQUFLLGtCQUE5QixFQUFrRDtBQUNoRCxlQUFLLE9BQUwsQ0FBYSxpQkFBYixFQUFnQztBQUM5QixxQkFBUyxlQURxQjtBQUU5QixrQkFBTTtBQUNKLHVCQUFTLEtBQUssa0JBRFY7QUFFSixxQkFBTyxPQUFPLElBRlY7QUFHSixzQkFBUTtBQUhKO0FBRndCLFdBQWhDOztBQVNBO0FBQ0Q7O0FBRUQsa0JBQVUsSUFBVixDQUFlLElBQWYsRUFBcUIsTUFBckIsRUFBNkIsUUFBN0I7QUFDRCxPQWpCRDs7QUFtQkEsYUFBTyxrQkFBUDtBQUNELEtBN0JEOztBQStCQSxPQUFHLE1BQUgsQ0FBVSxpQ0FBVixFQUE0QyxFQUE1QyxFQUVHLFlBQVk7QUFDYixlQUFTLGtCQUFULENBQTZCLFNBQTdCLEVBQXdDLEVBQXhDLEVBQTRDLE9BQTVDLEVBQXFEO0FBQ25ELGFBQUssa0JBQUwsR0FBMEIsUUFBUSxHQUFSLENBQVksb0JBQVosQ0FBMUI7O0FBRUEsa0JBQVUsSUFBVixDQUFlLElBQWYsRUFBcUIsRUFBckIsRUFBeUIsT0FBekI7QUFDRDs7QUFFRCx5QkFBbUIsU0FBbkIsQ0FBNkIsS0FBN0IsR0FBcUMsVUFBVSxTQUFWLEVBQXFCLE1BQXJCLEVBQTZCLFFBQTdCLEVBQXVDO0FBQzFFLGVBQU8sSUFBUCxHQUFjLE9BQU8sSUFBUCxJQUFlLEVBQTdCOztBQUVBLFlBQUksS0FBSyxrQkFBTCxHQUEwQixDQUExQixJQUNBLE9BQU8sSUFBUCxDQUFZLE1BQVosR0FBcUIsS0FBSyxrQkFEOUIsRUFDa0Q7QUFDaEQsZUFBSyxPQUFMLENBQWEsaUJBQWIsRUFBZ0M7QUFDOUIscUJBQVMsY0FEcUI7QUFFOUIsa0JBQU07QUFDSix1QkFBUyxLQUFLLGtCQURWO0FBRUoscUJBQU8sT0FBTyxJQUZWO0FBR0osc0JBQVE7QUFISjtBQUZ3QixXQUFoQzs7QUFTQTtBQUNEOztBQUVELGtCQUFVLElBQVYsQ0FBZSxJQUFmLEVBQXFCLE1BQXJCLEVBQTZCLFFBQTdCO0FBQ0QsT0FsQkQ7O0FBb0JBLGFBQU8sa0JBQVA7QUFDRCxLQTlCRDs7QUFnQ0EsT0FBRyxNQUFILENBQVUscUNBQVYsRUFBZ0QsRUFBaEQsRUFFRyxZQUFXO0FBQ1osZUFBUyxzQkFBVCxDQUFpQyxTQUFqQyxFQUE0QyxFQUE1QyxFQUFnRCxPQUFoRCxFQUF5RDtBQUN2RCxhQUFLLHNCQUFMLEdBQThCLFFBQVEsR0FBUixDQUFZLHdCQUFaLENBQTlCOztBQUVBLGtCQUFVLElBQVYsQ0FBZSxJQUFmLEVBQXFCLEVBQXJCLEVBQXlCLE9BQXpCO0FBQ0Q7O0FBRUQsNkJBQXVCLFNBQXZCLENBQWlDLEtBQWpDLEdBQ0UsVUFBVSxTQUFWLEVBQXFCLE1BQXJCLEVBQTZCLFFBQTdCLEVBQXVDO0FBQ3JDLFlBQUksT0FBTyxJQUFYOztBQUVBLGFBQUssT0FBTCxDQUFhLFVBQVUsV0FBVixFQUF1QjtBQUNsQyxjQUFJLFFBQVEsZUFBZSxJQUFmLEdBQXNCLFlBQVksTUFBbEMsR0FBMkMsQ0FBdkQ7QUFDQSxjQUFJLEtBQUssc0JBQUwsR0FBOEIsQ0FBOUIsSUFDRixTQUFTLEtBQUssc0JBRGhCLEVBQ3dDO0FBQ3RDLGlCQUFLLE9BQUwsQ0FBYSxpQkFBYixFQUFnQztBQUM5Qix1QkFBUyxpQkFEcUI7QUFFOUIsb0JBQU07QUFDSix5QkFBUyxLQUFLO0FBRFY7QUFGd0IsYUFBaEM7QUFNQTtBQUNEO0FBQ0Qsb0JBQVUsSUFBVixDQUFlLElBQWYsRUFBcUIsTUFBckIsRUFBNkIsUUFBN0I7QUFDRCxTQWJEO0FBY0gsT0FsQkQ7O0FBb0JBLGFBQU8sc0JBQVA7QUFDRCxLQTlCRDs7QUFnQ0EsT0FBRyxNQUFILENBQVUsa0JBQVYsRUFBNkIsQ0FDM0IsUUFEMkIsRUFFM0IsU0FGMkIsQ0FBN0IsRUFHRyxVQUFVLENBQVYsRUFBYSxLQUFiLEVBQW9CO0FBQ3JCLGVBQVMsUUFBVCxDQUFtQixRQUFuQixFQUE2QixPQUE3QixFQUFzQztBQUNwQyxhQUFLLFFBQUwsR0FBZ0IsUUFBaEI7QUFDQSxhQUFLLE9BQUwsR0FBZSxPQUFmOztBQUVBLGlCQUFTLFNBQVQsQ0FBbUIsV0FBbkIsQ0FBK0IsSUFBL0IsQ0FBb0MsSUFBcEM7QUFDRDs7QUFFRCxZQUFNLE1BQU4sQ0FBYSxRQUFiLEVBQXVCLE1BQU0sVUFBN0I7O0FBRUEsZUFBUyxTQUFULENBQW1CLE1BQW5CLEdBQTRCLFlBQVk7QUFDdEMsWUFBSSxZQUFZLEVBQ2Qsb0NBQ0UsdUNBREYsR0FFQSxTQUhjLENBQWhCOztBQU1BLGtCQUFVLElBQVYsQ0FBZSxLQUFmLEVBQXNCLEtBQUssT0FBTCxDQUFhLEdBQWIsQ0FBaUIsS0FBakIsQ0FBdEI7O0FBRUEsYUFBSyxTQUFMLEdBQWlCLFNBQWpCOztBQUVBLGVBQU8sU0FBUDtBQUNELE9BWkQ7O0FBY0EsZUFBUyxTQUFULENBQW1CLElBQW5CLEdBQTBCLFlBQVk7QUFDcEM7QUFDRCxPQUZEOztBQUlBLGVBQVMsU0FBVCxDQUFtQixRQUFuQixHQUE4QixVQUFVLFNBQVYsRUFBcUIsVUFBckIsRUFBaUM7QUFDN0Q7QUFDRCxPQUZEOztBQUlBLGVBQVMsU0FBVCxDQUFtQixPQUFuQixHQUE2QixZQUFZO0FBQ3ZDO0FBQ0EsYUFBSyxTQUFMLENBQWUsTUFBZjtBQUNELE9BSEQ7O0FBS0EsYUFBTyxRQUFQO0FBQ0QsS0F6Q0Q7O0FBMkNBLE9BQUcsTUFBSCxDQUFVLHlCQUFWLEVBQW9DLENBQ2xDLFFBRGtDLEVBRWxDLFVBRmtDLENBQXBDLEVBR0csVUFBVSxDQUFWLEVBQWEsS0FBYixFQUFvQjtBQUNyQixlQUFTLE1BQVQsR0FBbUIsQ0FBRzs7QUFFdEIsYUFBTyxTQUFQLENBQWlCLE1BQWpCLEdBQTBCLFVBQVUsU0FBVixFQUFxQjtBQUM3QyxZQUFJLFlBQVksVUFBVSxJQUFWLENBQWUsSUFBZixDQUFoQjs7QUFFQSxZQUFJLFVBQVUsRUFDWiwyREFDRSxrRUFERixHQUVFLDREQUZGLEdBR0UsdUNBSEYsR0FJQSxTQUxZLENBQWQ7O0FBUUEsYUFBSyxnQkFBTCxHQUF3QixPQUF4QjtBQUNBLGFBQUssT0FBTCxHQUFlLFFBQVEsSUFBUixDQUFhLE9BQWIsQ0FBZjs7QUFFQSxrQkFBVSxPQUFWLENBQWtCLE9BQWxCOztBQUVBLGVBQU8sU0FBUDtBQUNELE9BakJEOztBQW1CQSxhQUFPLFNBQVAsQ0FBaUIsSUFBakIsR0FBd0IsVUFBVSxTQUFWLEVBQXFCLFNBQXJCLEVBQWdDLFVBQWhDLEVBQTRDO0FBQ2xFLFlBQUksT0FBTyxJQUFYOztBQUVBLGtCQUFVLElBQVYsQ0FBZSxJQUFmLEVBQXFCLFNBQXJCLEVBQWdDLFVBQWhDOztBQUVBLGFBQUssT0FBTCxDQUFhLEVBQWIsQ0FBZ0IsU0FBaEIsRUFBMkIsVUFBVSxHQUFWLEVBQWU7QUFDeEMsZUFBSyxPQUFMLENBQWEsVUFBYixFQUF5QixHQUF6Qjs7QUFFQSxlQUFLLGVBQUwsR0FBdUIsSUFBSSxrQkFBSixFQUF2QjtBQUNELFNBSkQ7O0FBTUE7QUFDQTtBQUNBO0FBQ0EsYUFBSyxPQUFMLENBQWEsRUFBYixDQUFnQixPQUFoQixFQUF5QixVQUFVLEdBQVYsRUFBZTtBQUN0QztBQUNBLFlBQUUsSUFBRixFQUFRLEdBQVIsQ0FBWSxPQUFaO0FBQ0QsU0FIRDs7QUFLQSxhQUFLLE9BQUwsQ0FBYSxFQUFiLENBQWdCLGFBQWhCLEVBQStCLFVBQVUsR0FBVixFQUFlO0FBQzVDLGVBQUssWUFBTCxDQUFrQixHQUFsQjtBQUNELFNBRkQ7O0FBSUEsa0JBQVUsRUFBVixDQUFhLE1BQWIsRUFBcUIsWUFBWTtBQUMvQixlQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLFVBQWxCLEVBQThCLENBQTlCOztBQUVBLGVBQUssT0FBTCxDQUFhLEtBQWI7O0FBRUEsaUJBQU8sVUFBUCxDQUFrQixZQUFZO0FBQzVCLGlCQUFLLE9BQUwsQ0FBYSxLQUFiO0FBQ0QsV0FGRCxFQUVHLENBRkg7QUFHRCxTQVJEOztBQVVBLGtCQUFVLEVBQVYsQ0FBYSxPQUFiLEVBQXNCLFlBQVk7QUFDaEMsZUFBSyxPQUFMLENBQWEsSUFBYixDQUFrQixVQUFsQixFQUE4QixDQUFDLENBQS9COztBQUVBLGVBQUssT0FBTCxDQUFhLEdBQWIsQ0FBaUIsRUFBakI7QUFDRCxTQUpEOztBQU1BLGtCQUFVLEVBQVYsQ0FBYSxPQUFiLEVBQXNCLFlBQVk7QUFDaEMsY0FBSSxVQUFVLE1BQVYsRUFBSixFQUF3QjtBQUN0QixpQkFBSyxPQUFMLENBQWEsS0FBYjtBQUNEO0FBQ0YsU0FKRDs7QUFNQSxrQkFBVSxFQUFWLENBQWEsYUFBYixFQUE0QixVQUFVLE1BQVYsRUFBa0I7QUFDNUMsY0FBSSxPQUFPLEtBQVAsQ0FBYSxJQUFiLElBQXFCLElBQXJCLElBQTZCLE9BQU8sS0FBUCxDQUFhLElBQWIsS0FBc0IsRUFBdkQsRUFBMkQ7QUFDekQsZ0JBQUksYUFBYSxLQUFLLFVBQUwsQ0FBZ0IsTUFBaEIsQ0FBakI7O0FBRUEsZ0JBQUksVUFBSixFQUFnQjtBQUNkLG1CQUFLLGdCQUFMLENBQXNCLFdBQXRCLENBQWtDLHNCQUFsQztBQUNELGFBRkQsTUFFTztBQUNMLG1CQUFLLGdCQUFMLENBQXNCLFFBQXRCLENBQStCLHNCQUEvQjtBQUNEO0FBQ0Y7QUFDRixTQVZEO0FBV0QsT0F4REQ7O0FBMERBLGFBQU8sU0FBUCxDQUFpQixZQUFqQixHQUFnQyxVQUFVLEdBQVYsRUFBZTtBQUM3QyxZQUFJLENBQUMsS0FBSyxlQUFWLEVBQTJCO0FBQ3pCLGNBQUksUUFBUSxLQUFLLE9BQUwsQ0FBYSxHQUFiLEVBQVo7O0FBRUEsZUFBSyxPQUFMLENBQWEsT0FBYixFQUFzQjtBQUNwQixrQkFBTTtBQURjLFdBQXRCO0FBR0Q7O0FBRUQsYUFBSyxlQUFMLEdBQXVCLEtBQXZCO0FBQ0QsT0FWRDs7QUFZQSxhQUFPLFNBQVAsQ0FBaUIsVUFBakIsR0FBOEIsVUFBVSxDQUFWLEVBQWEsTUFBYixFQUFxQjtBQUNqRCxlQUFPLElBQVA7QUFDRCxPQUZEOztBQUlBLGFBQU8sTUFBUDtBQUNELEtBcEdEOztBQXNHQSxPQUFHLE1BQUgsQ0FBVSxrQ0FBVixFQUE2QyxFQUE3QyxFQUVHLFlBQVk7QUFDYixlQUFTLGVBQVQsQ0FBMEIsU0FBMUIsRUFBcUMsUUFBckMsRUFBK0MsT0FBL0MsRUFBd0QsV0FBeEQsRUFBcUU7QUFDbkUsYUFBSyxXQUFMLEdBQW1CLEtBQUssb0JBQUwsQ0FBMEIsUUFBUSxHQUFSLENBQVksYUFBWixDQUExQixDQUFuQjs7QUFFQSxrQkFBVSxJQUFWLENBQWUsSUFBZixFQUFxQixRQUFyQixFQUErQixPQUEvQixFQUF3QyxXQUF4QztBQUNEOztBQUVELHNCQUFnQixTQUFoQixDQUEwQixNQUExQixHQUFtQyxVQUFVLFNBQVYsRUFBcUIsSUFBckIsRUFBMkI7QUFDNUQsYUFBSyxPQUFMLEdBQWUsS0FBSyxpQkFBTCxDQUF1QixLQUFLLE9BQTVCLENBQWY7O0FBRUEsa0JBQVUsSUFBVixDQUFlLElBQWYsRUFBcUIsSUFBckI7QUFDRCxPQUpEOztBQU1BLHNCQUFnQixTQUFoQixDQUEwQixvQkFBMUIsR0FBaUQsVUFBVSxDQUFWLEVBQWEsV0FBYixFQUEwQjtBQUN6RSxZQUFJLE9BQU8sV0FBUCxLQUF1QixRQUEzQixFQUFxQztBQUNuQyx3QkFBYztBQUNaLGdCQUFJLEVBRFE7QUFFWixrQkFBTTtBQUZNLFdBQWQ7QUFJRDs7QUFFRCxlQUFPLFdBQVA7QUFDRCxPQVREOztBQVdBLHNCQUFnQixTQUFoQixDQUEwQixpQkFBMUIsR0FBOEMsVUFBVSxDQUFWLEVBQWEsSUFBYixFQUFtQjtBQUMvRCxZQUFJLGVBQWUsS0FBSyxLQUFMLENBQVcsQ0FBWCxDQUFuQjs7QUFFQSxhQUFLLElBQUksSUFBSSxLQUFLLE1BQUwsR0FBYyxDQUEzQixFQUE4QixLQUFLLENBQW5DLEVBQXNDLEdBQXRDLEVBQTJDO0FBQ3pDLGNBQUksT0FBTyxLQUFLLENBQUwsQ0FBWDs7QUFFQSxjQUFJLEtBQUssV0FBTCxDQUFpQixFQUFqQixLQUF3QixLQUFLLEVBQWpDLEVBQXFDO0FBQ25DLHlCQUFhLE1BQWIsQ0FBb0IsQ0FBcEIsRUFBdUIsQ0FBdkI7QUFDRDtBQUNGOztBQUVELGVBQU8sWUFBUDtBQUNELE9BWkQ7O0FBY0EsYUFBTyxlQUFQO0FBQ0QsS0F6Q0Q7O0FBMkNBLE9BQUcsTUFBSCxDQUFVLGlDQUFWLEVBQTRDLENBQzFDLFFBRDBDLENBQTVDLEVBRUcsVUFBVSxDQUFWLEVBQWE7QUFDZCxlQUFTLGNBQVQsQ0FBeUIsU0FBekIsRUFBb0MsUUFBcEMsRUFBOEMsT0FBOUMsRUFBdUQsV0FBdkQsRUFBb0U7QUFDbEUsYUFBSyxVQUFMLEdBQWtCLEVBQWxCOztBQUVBLGtCQUFVLElBQVYsQ0FBZSxJQUFmLEVBQXFCLFFBQXJCLEVBQStCLE9BQS9CLEVBQXdDLFdBQXhDOztBQUVBLGFBQUssWUFBTCxHQUFvQixLQUFLLGlCQUFMLEVBQXBCO0FBQ0EsYUFBSyxPQUFMLEdBQWUsS0FBZjtBQUNEOztBQUVELHFCQUFlLFNBQWYsQ0FBeUIsTUFBekIsR0FBa0MsVUFBVSxTQUFWLEVBQXFCLElBQXJCLEVBQTJCO0FBQzNELGFBQUssWUFBTCxDQUFrQixNQUFsQjtBQUNBLGFBQUssT0FBTCxHQUFlLEtBQWY7O0FBRUEsa0JBQVUsSUFBVixDQUFlLElBQWYsRUFBcUIsSUFBckI7O0FBRUEsWUFBSSxLQUFLLGVBQUwsQ0FBcUIsSUFBckIsQ0FBSixFQUFnQztBQUM5QixlQUFLLFFBQUwsQ0FBYyxNQUFkLENBQXFCLEtBQUssWUFBMUI7QUFDRDtBQUNGLE9BVEQ7O0FBV0EscUJBQWUsU0FBZixDQUF5QixJQUF6QixHQUFnQyxVQUFVLFNBQVYsRUFBcUIsU0FBckIsRUFBZ0MsVUFBaEMsRUFBNEM7QUFDMUUsWUFBSSxPQUFPLElBQVg7O0FBRUEsa0JBQVUsSUFBVixDQUFlLElBQWYsRUFBcUIsU0FBckIsRUFBZ0MsVUFBaEM7O0FBRUEsa0JBQVUsRUFBVixDQUFhLE9BQWIsRUFBc0IsVUFBVSxNQUFWLEVBQWtCO0FBQ3RDLGVBQUssVUFBTCxHQUFrQixNQUFsQjtBQUNBLGVBQUssT0FBTCxHQUFlLElBQWY7QUFDRCxTQUhEOztBQUtBLGtCQUFVLEVBQVYsQ0FBYSxjQUFiLEVBQTZCLFVBQVUsTUFBVixFQUFrQjtBQUM3QyxlQUFLLFVBQUwsR0FBa0IsTUFBbEI7QUFDQSxlQUFLLE9BQUwsR0FBZSxJQUFmO0FBQ0QsU0FIRDs7QUFLQSxhQUFLLFFBQUwsQ0FBYyxFQUFkLENBQWlCLFFBQWpCLEVBQTJCLFlBQVk7QUFDckMsY0FBSSxvQkFBb0IsRUFBRSxRQUFGLENBQ3RCLFNBQVMsZUFEYSxFQUV0QixLQUFLLFlBQUwsQ0FBa0IsQ0FBbEIsQ0FGc0IsQ0FBeEI7O0FBS0EsY0FBSSxLQUFLLE9BQUwsSUFBZ0IsQ0FBQyxpQkFBckIsRUFBd0M7QUFDdEM7QUFDRDs7QUFFRCxjQUFJLGdCQUFnQixLQUFLLFFBQUwsQ0FBYyxNQUFkLEdBQXVCLEdBQXZCLEdBQ2xCLEtBQUssUUFBTCxDQUFjLFdBQWQsQ0FBMEIsS0FBMUIsQ0FERjtBQUVBLGNBQUksb0JBQW9CLEtBQUssWUFBTCxDQUFrQixNQUFsQixHQUEyQixHQUEzQixHQUN0QixLQUFLLFlBQUwsQ0FBa0IsV0FBbEIsQ0FBOEIsS0FBOUIsQ0FERjs7QUFHQSxjQUFJLGdCQUFnQixFQUFoQixJQUFzQixpQkFBMUIsRUFBNkM7QUFDM0MsaUJBQUssUUFBTDtBQUNEO0FBQ0YsU0FsQkQ7QUFtQkQsT0FsQ0Q7O0FBb0NBLHFCQUFlLFNBQWYsQ0FBeUIsUUFBekIsR0FBb0MsWUFBWTtBQUM5QyxhQUFLLE9BQUwsR0FBZSxJQUFmOztBQUVBLFlBQUksU0FBUyxFQUFFLE1BQUYsQ0FBUyxFQUFULEVBQWEsRUFBQyxNQUFNLENBQVAsRUFBYixFQUF3QixLQUFLLFVBQTdCLENBQWI7O0FBRUEsZUFBTyxJQUFQOztBQUVBLGFBQUssT0FBTCxDQUFhLGNBQWIsRUFBNkIsTUFBN0I7QUFDRCxPQVJEOztBQVVBLHFCQUFlLFNBQWYsQ0FBeUIsZUFBekIsR0FBMkMsVUFBVSxDQUFWLEVBQWEsSUFBYixFQUFtQjtBQUM1RCxlQUFPLEtBQUssVUFBTCxJQUFtQixLQUFLLFVBQUwsQ0FBZ0IsSUFBMUM7QUFDRCxPQUZEOztBQUlBLHFCQUFlLFNBQWYsQ0FBeUIsaUJBQXpCLEdBQTZDLFlBQVk7QUFDdkQsWUFBSSxVQUFVLEVBQ1osU0FDQSxvRUFEQSxHQUVBLDRDQUhZLENBQWQ7O0FBTUEsWUFBSSxVQUFVLEtBQUssT0FBTCxDQUFhLEdBQWIsQ0FBaUIsY0FBakIsRUFBaUMsR0FBakMsQ0FBcUMsYUFBckMsQ0FBZDs7QUFFQSxnQkFBUSxJQUFSLENBQWEsUUFBUSxLQUFLLFVBQWIsQ0FBYjs7QUFFQSxlQUFPLE9BQVA7QUFDRCxPQVpEOztBQWNBLGFBQU8sY0FBUDtBQUNELEtBeEZEOztBQTBGQSxPQUFHLE1BQUgsQ0FBVSw2QkFBVixFQUF3QyxDQUN0QyxRQURzQyxFQUV0QyxVQUZzQyxDQUF4QyxFQUdHLFVBQVUsQ0FBVixFQUFhLEtBQWIsRUFBb0I7QUFDckIsZUFBUyxVQUFULENBQXFCLFNBQXJCLEVBQWdDLFFBQWhDLEVBQTBDLE9BQTFDLEVBQW1EO0FBQ2pELGFBQUssZUFBTCxHQUF1QixRQUFRLEdBQVIsQ0FBWSxnQkFBWixLQUFpQyxFQUFFLFNBQVMsSUFBWCxDQUF4RDs7QUFFQSxrQkFBVSxJQUFWLENBQWUsSUFBZixFQUFxQixRQUFyQixFQUErQixPQUEvQjtBQUNEOztBQUVELGlCQUFXLFNBQVgsQ0FBcUIsSUFBckIsR0FBNEIsVUFBVSxTQUFWLEVBQXFCLFNBQXJCLEVBQWdDLFVBQWhDLEVBQTRDO0FBQ3RFLFlBQUksT0FBTyxJQUFYOztBQUVBLFlBQUkscUJBQXFCLEtBQXpCOztBQUVBLGtCQUFVLElBQVYsQ0FBZSxJQUFmLEVBQXFCLFNBQXJCLEVBQWdDLFVBQWhDOztBQUVBLGtCQUFVLEVBQVYsQ0FBYSxNQUFiLEVBQXFCLFlBQVk7QUFDL0IsZUFBSyxhQUFMO0FBQ0EsZUFBSyx5QkFBTCxDQUErQixTQUEvQjs7QUFFQSxjQUFJLENBQUMsa0JBQUwsRUFBeUI7QUFDdkIsaUNBQXFCLElBQXJCOztBQUVBLHNCQUFVLEVBQVYsQ0FBYSxhQUFiLEVBQTRCLFlBQVk7QUFDdEMsbUJBQUssaUJBQUw7QUFDQSxtQkFBSyxlQUFMO0FBQ0QsYUFIRDs7QUFLQSxzQkFBVSxFQUFWLENBQWEsZ0JBQWIsRUFBK0IsWUFBWTtBQUN6QyxtQkFBSyxpQkFBTDtBQUNBLG1CQUFLLGVBQUw7QUFDRCxhQUhEO0FBSUQ7QUFDRixTQWpCRDs7QUFtQkEsa0JBQVUsRUFBVixDQUFhLE9BQWIsRUFBc0IsWUFBWTtBQUNoQyxlQUFLLGFBQUw7QUFDQSxlQUFLLHlCQUFMLENBQStCLFNBQS9CO0FBQ0QsU0FIRDs7QUFLQSxhQUFLLGtCQUFMLENBQXdCLEVBQXhCLENBQTJCLFdBQTNCLEVBQXdDLFVBQVUsR0FBVixFQUFlO0FBQ3JELGNBQUksZUFBSjtBQUNELFNBRkQ7QUFHRCxPQWxDRDs7QUFvQ0EsaUJBQVcsU0FBWCxDQUFxQixPQUFyQixHQUErQixVQUFVLFNBQVYsRUFBcUI7QUFDbEQsa0JBQVUsSUFBVixDQUFlLElBQWY7O0FBRUEsYUFBSyxrQkFBTCxDQUF3QixNQUF4QjtBQUNELE9BSkQ7O0FBTUEsaUJBQVcsU0FBWCxDQUFxQixRQUFyQixHQUFnQyxVQUFVLFNBQVYsRUFBcUIsU0FBckIsRUFBZ0MsVUFBaEMsRUFBNEM7QUFDMUU7QUFDQSxrQkFBVSxJQUFWLENBQWUsT0FBZixFQUF3QixXQUFXLElBQVgsQ0FBZ0IsT0FBaEIsQ0FBeEI7O0FBRUEsa0JBQVUsV0FBVixDQUFzQixTQUF0QjtBQUNBLGtCQUFVLFFBQVYsQ0FBbUIseUJBQW5COztBQUVBLGtCQUFVLEdBQVYsQ0FBYztBQUNaLG9CQUFVLFVBREU7QUFFWixlQUFLLENBQUM7QUFGTSxTQUFkOztBQUtBLGFBQUssVUFBTCxHQUFrQixVQUFsQjtBQUNELE9BYkQ7O0FBZUEsaUJBQVcsU0FBWCxDQUFxQixNQUFyQixHQUE4QixVQUFVLFNBQVYsRUFBcUI7QUFDakQsWUFBSSxhQUFhLEVBQUUsZUFBRixDQUFqQjs7QUFFQSxZQUFJLFlBQVksVUFBVSxJQUFWLENBQWUsSUFBZixDQUFoQjtBQUNBLG1CQUFXLE1BQVgsQ0FBa0IsU0FBbEI7O0FBRUEsYUFBSyxrQkFBTCxHQUEwQixVQUExQjs7QUFFQSxlQUFPLFVBQVA7QUFDRCxPQVREOztBQVdBLGlCQUFXLFNBQVgsQ0FBcUIsYUFBckIsR0FBcUMsVUFBVSxTQUFWLEVBQXFCO0FBQ3hELGFBQUssa0JBQUwsQ0FBd0IsTUFBeEI7QUFDRCxPQUZEOztBQUlBLGlCQUFXLFNBQVgsQ0FBcUIseUJBQXJCLEdBQ0ksVUFBVSxTQUFWLEVBQXFCLFNBQXJCLEVBQWdDO0FBQ2xDLFlBQUksT0FBTyxJQUFYOztBQUVBLFlBQUksY0FBYyxvQkFBb0IsVUFBVSxFQUFoRDtBQUNBLFlBQUksY0FBYyxvQkFBb0IsVUFBVSxFQUFoRDtBQUNBLFlBQUksbUJBQW1CLCtCQUErQixVQUFVLEVBQWhFOztBQUVBLFlBQUksWUFBWSxLQUFLLFVBQUwsQ0FBZ0IsT0FBaEIsR0FBMEIsTUFBMUIsQ0FBaUMsTUFBTSxTQUF2QyxDQUFoQjtBQUNBLGtCQUFVLElBQVYsQ0FBZSxZQUFZO0FBQ3pCLFlBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSx5QkFBYixFQUF3QztBQUN0QyxlQUFHLEVBQUUsSUFBRixFQUFRLFVBQVIsRUFEbUM7QUFFdEMsZUFBRyxFQUFFLElBQUYsRUFBUSxTQUFSO0FBRm1DLFdBQXhDO0FBSUQsU0FMRDs7QUFPQSxrQkFBVSxFQUFWLENBQWEsV0FBYixFQUEwQixVQUFVLEVBQVYsRUFBYztBQUN0QyxjQUFJLFdBQVcsRUFBRSxJQUFGLEVBQVEsSUFBUixDQUFhLHlCQUFiLENBQWY7QUFDQSxZQUFFLElBQUYsRUFBUSxTQUFSLENBQWtCLFNBQVMsQ0FBM0I7QUFDRCxTQUhEOztBQUtBLFVBQUUsTUFBRixFQUFVLEVBQVYsQ0FBYSxjQUFjLEdBQWQsR0FBb0IsV0FBcEIsR0FBa0MsR0FBbEMsR0FBd0MsZ0JBQXJELEVBQ0UsVUFBVSxDQUFWLEVBQWE7QUFDYixlQUFLLGlCQUFMO0FBQ0EsZUFBSyxlQUFMO0FBQ0QsU0FKRDtBQUtELE9BMUJEOztBQTRCQSxpQkFBVyxTQUFYLENBQXFCLHlCQUFyQixHQUNJLFVBQVUsU0FBVixFQUFxQixTQUFyQixFQUFnQztBQUNsQyxZQUFJLGNBQWMsb0JBQW9CLFVBQVUsRUFBaEQ7QUFDQSxZQUFJLGNBQWMsb0JBQW9CLFVBQVUsRUFBaEQ7QUFDQSxZQUFJLG1CQUFtQiwrQkFBK0IsVUFBVSxFQUFoRTs7QUFFQSxZQUFJLFlBQVksS0FBSyxVQUFMLENBQWdCLE9BQWhCLEdBQTBCLE1BQTFCLENBQWlDLE1BQU0sU0FBdkMsQ0FBaEI7QUFDQSxrQkFBVSxHQUFWLENBQWMsV0FBZDs7QUFFQSxVQUFFLE1BQUYsRUFBVSxHQUFWLENBQWMsY0FBYyxHQUFkLEdBQW9CLFdBQXBCLEdBQWtDLEdBQWxDLEdBQXdDLGdCQUF0RDtBQUNELE9BVkQ7O0FBWUEsaUJBQVcsU0FBWCxDQUFxQixpQkFBckIsR0FBeUMsWUFBWTtBQUNuRCxZQUFJLFVBQVUsRUFBRSxNQUFGLENBQWQ7O0FBRUEsWUFBSSxtQkFBbUIsS0FBSyxTQUFMLENBQWUsUUFBZixDQUF3Qix5QkFBeEIsQ0FBdkI7QUFDQSxZQUFJLG1CQUFtQixLQUFLLFNBQUwsQ0FBZSxRQUFmLENBQXdCLHlCQUF4QixDQUF2Qjs7QUFFQSxZQUFJLGVBQWUsSUFBbkI7O0FBRUEsWUFBSSxTQUFTLEtBQUssVUFBTCxDQUFnQixNQUFoQixFQUFiOztBQUVBLGVBQU8sTUFBUCxHQUFnQixPQUFPLEdBQVAsR0FBYSxLQUFLLFVBQUwsQ0FBZ0IsV0FBaEIsQ0FBNEIsS0FBNUIsQ0FBN0I7O0FBRUEsWUFBSSxZQUFZO0FBQ2Qsa0JBQVEsS0FBSyxVQUFMLENBQWdCLFdBQWhCLENBQTRCLEtBQTVCO0FBRE0sU0FBaEI7O0FBSUEsa0JBQVUsR0FBVixHQUFnQixPQUFPLEdBQXZCO0FBQ0Esa0JBQVUsTUFBVixHQUFtQixPQUFPLEdBQVAsR0FBYSxVQUFVLE1BQTFDOztBQUVBLFlBQUksV0FBVztBQUNiLGtCQUFRLEtBQUssU0FBTCxDQUFlLFdBQWYsQ0FBMkIsS0FBM0I7QUFESyxTQUFmOztBQUlBLFlBQUksV0FBVztBQUNiLGVBQUssUUFBUSxTQUFSLEVBRFE7QUFFYixrQkFBUSxRQUFRLFNBQVIsS0FBc0IsUUFBUSxNQUFSO0FBRmpCLFNBQWY7O0FBS0EsWUFBSSxrQkFBa0IsU0FBUyxHQUFULEdBQWdCLE9BQU8sR0FBUCxHQUFhLFNBQVMsTUFBNUQ7QUFDQSxZQUFJLGtCQUFrQixTQUFTLE1BQVQsR0FBbUIsT0FBTyxNQUFQLEdBQWdCLFNBQVMsTUFBbEU7O0FBRUEsWUFBSSxNQUFNO0FBQ1IsZ0JBQU0sT0FBTyxJQURMO0FBRVIsZUFBSyxVQUFVO0FBRlAsU0FBVjs7QUFLQTtBQUNBLFlBQUksZ0JBQWdCLEtBQUssZUFBekI7O0FBRUE7QUFDQTtBQUNBLFlBQUksY0FBYyxHQUFkLENBQWtCLFVBQWxCLE1BQWtDLFFBQXRDLEVBQWdEO0FBQzlDLDBCQUFnQixjQUFjLFlBQWQsRUFBaEI7QUFDRDs7QUFFRCxZQUFJLGVBQWUsY0FBYyxNQUFkLEVBQW5COztBQUVBLFlBQUksR0FBSixJQUFXLGFBQWEsR0FBeEI7QUFDQSxZQUFJLElBQUosSUFBWSxhQUFhLElBQXpCOztBQUVBLFlBQUksQ0FBQyxnQkFBRCxJQUFxQixDQUFDLGdCQUExQixFQUE0QztBQUMxQyx5QkFBZSxPQUFmO0FBQ0Q7O0FBRUQsWUFBSSxDQUFDLGVBQUQsSUFBb0IsZUFBcEIsSUFBdUMsQ0FBQyxnQkFBNUMsRUFBOEQ7QUFDNUQseUJBQWUsT0FBZjtBQUNELFNBRkQsTUFFTyxJQUFJLENBQUMsZUFBRCxJQUFvQixlQUFwQixJQUF1QyxnQkFBM0MsRUFBNkQ7QUFDbEUseUJBQWUsT0FBZjtBQUNEOztBQUVELFlBQUksZ0JBQWdCLE9BQWhCLElBQ0Qsb0JBQW9CLGlCQUFpQixPQUR4QyxFQUNrRDtBQUNoRCxjQUFJLEdBQUosR0FBVSxVQUFVLEdBQVYsR0FBZ0IsYUFBYSxHQUE3QixHQUFtQyxTQUFTLE1BQXREO0FBQ0Q7O0FBRUQsWUFBSSxnQkFBZ0IsSUFBcEIsRUFBMEI7QUFDeEIsZUFBSyxTQUFMLENBQ0csV0FESCxDQUNlLGlEQURmLEVBRUcsUUFGSCxDQUVZLHVCQUF1QixZQUZuQztBQUdBLGVBQUssVUFBTCxDQUNHLFdBREgsQ0FDZSxtREFEZixFQUVHLFFBRkgsQ0FFWSx3QkFBd0IsWUFGcEM7QUFHRDs7QUFFRCxhQUFLLGtCQUFMLENBQXdCLEdBQXhCLENBQTRCLEdBQTVCO0FBQ0QsT0EzRUQ7O0FBNkVBLGlCQUFXLFNBQVgsQ0FBcUIsZUFBckIsR0FBdUMsWUFBWTtBQUNqRCxZQUFJLE1BQU07QUFDUixpQkFBTyxLQUFLLFVBQUwsQ0FBZ0IsVUFBaEIsQ0FBMkIsS0FBM0IsSUFBb0M7QUFEbkMsU0FBVjs7QUFJQSxZQUFJLEtBQUssT0FBTCxDQUFhLEdBQWIsQ0FBaUIsbUJBQWpCLENBQUosRUFBMkM7QUFDekMsY0FBSSxRQUFKLEdBQWUsSUFBSSxLQUFuQjtBQUNBLGNBQUksUUFBSixHQUFlLFVBQWY7QUFDQSxjQUFJLEtBQUosR0FBWSxNQUFaO0FBQ0Q7O0FBRUQsYUFBSyxTQUFMLENBQWUsR0FBZixDQUFtQixHQUFuQjtBQUNELE9BWkQ7O0FBY0EsaUJBQVcsU0FBWCxDQUFxQixhQUFyQixHQUFxQyxVQUFVLFNBQVYsRUFBcUI7QUFDeEQsYUFBSyxrQkFBTCxDQUF3QixRQUF4QixDQUFpQyxLQUFLLGVBQXRDOztBQUVBLGFBQUssaUJBQUw7QUFDQSxhQUFLLGVBQUw7QUFDRCxPQUxEOztBQU9BLGFBQU8sVUFBUDtBQUNELEtBN05EOztBQStOQSxPQUFHLE1BQUgsQ0FBVSwwQ0FBVixFQUFxRCxFQUFyRCxFQUVHLFlBQVk7QUFDYixlQUFTLFlBQVQsQ0FBdUIsSUFBdkIsRUFBNkI7QUFDM0IsWUFBSSxRQUFRLENBQVo7O0FBRUEsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssTUFBekIsRUFBaUMsR0FBakMsRUFBc0M7QUFDcEMsY0FBSSxPQUFPLEtBQUssQ0FBTCxDQUFYOztBQUVBLGNBQUksS0FBSyxRQUFULEVBQW1CO0FBQ2pCLHFCQUFTLGFBQWEsS0FBSyxRQUFsQixDQUFUO0FBQ0QsV0FGRCxNQUVPO0FBQ0w7QUFDRDtBQUNGOztBQUVELGVBQU8sS0FBUDtBQUNEOztBQUVELGVBQVMsdUJBQVQsQ0FBa0MsU0FBbEMsRUFBNkMsUUFBN0MsRUFBdUQsT0FBdkQsRUFBZ0UsV0FBaEUsRUFBNkU7QUFDM0UsYUFBSyx1QkFBTCxHQUErQixRQUFRLEdBQVIsQ0FBWSx5QkFBWixDQUEvQjs7QUFFQSxZQUFJLEtBQUssdUJBQUwsR0FBK0IsQ0FBbkMsRUFBc0M7QUFDcEMsZUFBSyx1QkFBTCxHQUErQixRQUEvQjtBQUNEOztBQUVELGtCQUFVLElBQVYsQ0FBZSxJQUFmLEVBQXFCLFFBQXJCLEVBQStCLE9BQS9CLEVBQXdDLFdBQXhDO0FBQ0Q7O0FBRUQsOEJBQXdCLFNBQXhCLENBQWtDLFVBQWxDLEdBQStDLFVBQVUsU0FBVixFQUFxQixNQUFyQixFQUE2QjtBQUMxRSxZQUFJLGFBQWEsT0FBTyxJQUFQLENBQVksT0FBekIsSUFBb0MsS0FBSyx1QkFBN0MsRUFBc0U7QUFDcEUsaUJBQU8sS0FBUDtBQUNEOztBQUVELGVBQU8sVUFBVSxJQUFWLENBQWUsSUFBZixFQUFxQixNQUFyQixDQUFQO0FBQ0QsT0FORDs7QUFRQSxhQUFPLHVCQUFQO0FBQ0QsS0F0Q0Q7O0FBd0NBLE9BQUcsTUFBSCxDQUFVLGdDQUFWLEVBQTJDLEVBQTNDLEVBRUcsWUFBWTtBQUNiLGVBQVMsYUFBVCxHQUEwQixDQUFHOztBQUU3QixvQkFBYyxTQUFkLENBQXdCLElBQXhCLEdBQStCLFVBQVUsU0FBVixFQUFxQixTQUFyQixFQUFnQyxVQUFoQyxFQUE0QztBQUN6RSxZQUFJLE9BQU8sSUFBWDs7QUFFQSxrQkFBVSxJQUFWLENBQWUsSUFBZixFQUFxQixTQUFyQixFQUFnQyxVQUFoQzs7QUFFQSxrQkFBVSxFQUFWLENBQWEsT0FBYixFQUFzQixVQUFVLE1BQVYsRUFBa0I7QUFDdEMsZUFBSyxvQkFBTCxDQUEwQixNQUExQjtBQUNELFNBRkQ7QUFHRCxPQVJEOztBQVVBLG9CQUFjLFNBQWQsQ0FBd0Isb0JBQXhCLEdBQStDLFVBQVUsQ0FBVixFQUFhLE1BQWIsRUFBcUI7QUFDbEUsWUFBSSxVQUFVLE9BQU8sb0JBQVAsSUFBK0IsSUFBN0MsRUFBbUQ7QUFDakQsY0FBSSxRQUFRLE9BQU8sb0JBQW5COztBQUVBO0FBQ0E7QUFDQSxjQUFJLE1BQU0sS0FBTixLQUFnQixRQUFoQixJQUE0QixNQUFNLEtBQU4sS0FBZ0IsVUFBaEQsRUFBNEQ7QUFDMUQ7QUFDRDtBQUNGOztBQUVELFlBQUksc0JBQXNCLEtBQUsscUJBQUwsRUFBMUI7O0FBRUE7QUFDQSxZQUFJLG9CQUFvQixNQUFwQixHQUE2QixDQUFqQyxFQUFvQztBQUNsQztBQUNEOztBQUVELFlBQUksT0FBTyxvQkFBb0IsSUFBcEIsQ0FBeUIsTUFBekIsQ0FBWDs7QUFFQTtBQUNBLFlBQ0csS0FBSyxPQUFMLElBQWdCLElBQWhCLElBQXdCLEtBQUssT0FBTCxDQUFhLFFBQXRDLElBQ0MsS0FBSyxPQUFMLElBQWdCLElBQWhCLElBQXdCLEtBQUssUUFGaEMsRUFHRTtBQUNBO0FBQ0Q7O0FBRUQsYUFBSyxPQUFMLENBQWEsUUFBYixFQUF1QjtBQUNuQixnQkFBTTtBQURhLFNBQXZCO0FBR0QsT0EvQkQ7O0FBaUNBLGFBQU8sYUFBUDtBQUNELEtBakREOztBQW1EQSxPQUFHLE1BQUgsQ0FBVSxnQ0FBVixFQUEyQyxFQUEzQyxFQUVHLFlBQVk7QUFDYixlQUFTLGFBQVQsR0FBMEIsQ0FBRzs7QUFFN0Isb0JBQWMsU0FBZCxDQUF3QixJQUF4QixHQUErQixVQUFVLFNBQVYsRUFBcUIsU0FBckIsRUFBZ0MsVUFBaEMsRUFBNEM7QUFDekUsWUFBSSxPQUFPLElBQVg7O0FBRUEsa0JBQVUsSUFBVixDQUFlLElBQWYsRUFBcUIsU0FBckIsRUFBZ0MsVUFBaEM7O0FBRUEsa0JBQVUsRUFBVixDQUFhLFFBQWIsRUFBdUIsVUFBVSxHQUFWLEVBQWU7QUFDcEMsZUFBSyxnQkFBTCxDQUFzQixHQUF0QjtBQUNELFNBRkQ7O0FBSUEsa0JBQVUsRUFBVixDQUFhLFVBQWIsRUFBeUIsVUFBVSxHQUFWLEVBQWU7QUFDdEMsZUFBSyxnQkFBTCxDQUFzQixHQUF0QjtBQUNELFNBRkQ7QUFHRCxPQVpEOztBQWNBLG9CQUFjLFNBQWQsQ0FBd0IsZ0JBQXhCLEdBQTJDLFVBQVUsQ0FBVixFQUFhLEdBQWIsRUFBa0I7QUFDM0QsWUFBSSxnQkFBZ0IsSUFBSSxhQUF4Qjs7QUFFQTtBQUNBLFlBQUksaUJBQWlCLGNBQWMsT0FBbkMsRUFBNEM7QUFDMUM7QUFDRDs7QUFFRCxhQUFLLE9BQUwsQ0FBYSxPQUFiLEVBQXNCO0FBQ3BCLHlCQUFlLGFBREs7QUFFcEIsZ0NBQXNCO0FBRkYsU0FBdEI7QUFJRCxPQVpEOztBQWNBLGFBQU8sYUFBUDtBQUNELEtBbENEOztBQW9DQSxPQUFHLE1BQUgsQ0FBVSxpQkFBVixFQUE0QixFQUE1QixFQUErQixZQUFZO0FBQ3pDO0FBQ0EsYUFBTztBQUNMLHNCQUFjLHdCQUFZO0FBQ3hCLGlCQUFPLGtDQUFQO0FBQ0QsU0FISTtBQUlMLHNCQUFjLHNCQUFVLElBQVYsRUFBZ0I7QUFDNUIsY0FBSSxZQUFZLEtBQUssS0FBTCxDQUFXLE1BQVgsR0FBb0IsS0FBSyxPQUF6Qzs7QUFFQSxjQUFJLFVBQVUsbUJBQW1CLFNBQW5CLEdBQStCLFlBQTdDOztBQUVBLGNBQUksYUFBYSxDQUFqQixFQUFvQjtBQUNsQix1QkFBVyxHQUFYO0FBQ0Q7O0FBRUQsaUJBQU8sT0FBUDtBQUNELFNBZEk7QUFlTCx1QkFBZSx1QkFBVSxJQUFWLEVBQWdCO0FBQzdCLGNBQUksaUJBQWlCLEtBQUssT0FBTCxHQUFlLEtBQUssS0FBTCxDQUFXLE1BQS9DOztBQUVBLGNBQUksVUFBVSxrQkFBa0IsY0FBbEIsR0FBbUMscUJBQWpEOztBQUVBLGlCQUFPLE9BQVA7QUFDRCxTQXJCSTtBQXNCTCxxQkFBYSx1QkFBWTtBQUN2QixpQkFBTyx1QkFBUDtBQUNELFNBeEJJO0FBeUJMLHlCQUFpQix5QkFBVSxJQUFWLEVBQWdCO0FBQy9CLGNBQUksVUFBVSx5QkFBeUIsS0FBSyxPQUE5QixHQUF3QyxPQUF0RDs7QUFFQSxjQUFJLEtBQUssT0FBTCxJQUFnQixDQUFwQixFQUF1QjtBQUNyQix1QkFBVyxHQUFYO0FBQ0Q7O0FBRUQsaUJBQU8sT0FBUDtBQUNELFNBakNJO0FBa0NMLG1CQUFXLHFCQUFZO0FBQ3JCLGlCQUFPLGtCQUFQO0FBQ0QsU0FwQ0k7QUFxQ0wsbUJBQVcscUJBQVk7QUFDckIsaUJBQU8sWUFBUDtBQUNEO0FBdkNJLE9BQVA7QUF5Q0QsS0EzQ0Q7O0FBNkNBLE9BQUcsTUFBSCxDQUFVLGtCQUFWLEVBQTZCLENBQzNCLFFBRDJCLEVBRTNCLFNBRjJCLEVBSTNCLFdBSjJCLEVBTTNCLG9CQU4yQixFQU8zQixzQkFQMkIsRUFRM0IseUJBUjJCLEVBUzNCLHdCQVQyQixFQVUzQixvQkFWMkIsRUFXM0Isd0JBWDJCLEVBYTNCLFNBYjJCLEVBYzNCLGVBZDJCLEVBZTNCLGNBZjJCLEVBaUIzQixlQWpCMkIsRUFrQjNCLGNBbEIyQixFQW1CM0IsYUFuQjJCLEVBb0IzQixhQXBCMkIsRUFxQjNCLGtCQXJCMkIsRUFzQjNCLDJCQXRCMkIsRUF1QjNCLDJCQXZCMkIsRUF3QjNCLCtCQXhCMkIsRUEwQjNCLFlBMUIyQixFQTJCM0IsbUJBM0IyQixFQTRCM0IsNEJBNUIyQixFQTZCM0IsMkJBN0IyQixFQThCM0IsdUJBOUIyQixFQStCM0Isb0NBL0IyQixFQWdDM0IsMEJBaEMyQixFQWlDM0IsMEJBakMyQixFQW1DM0IsV0FuQzJCLENBQTdCLEVBb0NHLFVBQVUsQ0FBVixFQUFhLE9BQWIsRUFFVSxXQUZWLEVBSVUsZUFKVixFQUkyQixpQkFKM0IsRUFJOEMsV0FKOUMsRUFJMkQsVUFKM0QsRUFLVSxlQUxWLEVBSzJCLFVBTDNCLEVBT1UsS0FQVixFQU9pQixXQVBqQixFQU84QixVQVA5QixFQVNVLFVBVFYsRUFTc0IsU0FUdEIsRUFTaUMsUUFUakMsRUFTMkMsSUFUM0MsRUFTaUQsU0FUakQsRUFVVSxrQkFWVixFQVU4QixrQkFWOUIsRUFVa0Qsc0JBVmxELEVBWVUsUUFaVixFQVlvQixjQVpwQixFQVlvQyxlQVpwQyxFQVlxRCxjQVpyRCxFQWFVLFVBYlYsRUFhc0IsdUJBYnRCLEVBYStDLGFBYi9DLEVBYThELGFBYjlELEVBZVUsa0JBZlYsRUFlOEI7QUFDL0IsZUFBUyxRQUFULEdBQXFCO0FBQ25CLGFBQUssS0FBTDtBQUNEOztBQUVELGVBQVMsU0FBVCxDQUFtQixLQUFuQixHQUEyQixVQUFVLE9BQVYsRUFBbUI7QUFDNUMsa0JBQVUsRUFBRSxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUIsS0FBSyxRQUF4QixFQUFrQyxPQUFsQyxDQUFWOztBQUVBLFlBQUksUUFBUSxXQUFSLElBQXVCLElBQTNCLEVBQWlDO0FBQy9CLGNBQUksUUFBUSxJQUFSLElBQWdCLElBQXBCLEVBQTBCO0FBQ3hCLG9CQUFRLFdBQVIsR0FBc0IsUUFBdEI7QUFDRCxXQUZELE1BRU8sSUFBSSxRQUFRLElBQVIsSUFBZ0IsSUFBcEIsRUFBMEI7QUFDL0Isb0JBQVEsV0FBUixHQUFzQixTQUF0QjtBQUNELFdBRk0sTUFFQTtBQUNMLG9CQUFRLFdBQVIsR0FBc0IsVUFBdEI7QUFDRDs7QUFFRCxjQUFJLFFBQVEsa0JBQVIsR0FBNkIsQ0FBakMsRUFBb0M7QUFDbEMsb0JBQVEsV0FBUixHQUFzQixNQUFNLFFBQU4sQ0FDcEIsUUFBUSxXQURZLEVBRXBCLGtCQUZvQixDQUF0QjtBQUlEOztBQUVELGNBQUksUUFBUSxrQkFBUixHQUE2QixDQUFqQyxFQUFvQztBQUNsQyxvQkFBUSxXQUFSLEdBQXNCLE1BQU0sUUFBTixDQUNwQixRQUFRLFdBRFksRUFFcEIsa0JBRm9CLENBQXRCO0FBSUQ7O0FBRUQsY0FBSSxRQUFRLHNCQUFSLEdBQWlDLENBQXJDLEVBQXdDO0FBQ3RDLG9CQUFRLFdBQVIsR0FBc0IsTUFBTSxRQUFOLENBQ3BCLFFBQVEsV0FEWSxFQUVwQixzQkFGb0IsQ0FBdEI7QUFJRDs7QUFFRCxjQUFJLFFBQVEsSUFBWixFQUFrQjtBQUNoQixvQkFBUSxXQUFSLEdBQXNCLE1BQU0sUUFBTixDQUFlLFFBQVEsV0FBdkIsRUFBb0MsSUFBcEMsQ0FBdEI7QUFDRDs7QUFFRCxjQUFJLFFBQVEsZUFBUixJQUEyQixJQUEzQixJQUFtQyxRQUFRLFNBQVIsSUFBcUIsSUFBNUQsRUFBa0U7QUFDaEUsb0JBQVEsV0FBUixHQUFzQixNQUFNLFFBQU4sQ0FDcEIsUUFBUSxXQURZLEVBRXBCLFNBRm9CLENBQXRCO0FBSUQ7O0FBRUQsY0FBSSxRQUFRLEtBQVIsSUFBaUIsSUFBckIsRUFBMkI7QUFDekIsZ0JBQUksUUFBUSxRQUFRLFFBQVEsT0FBUixHQUFrQixjQUExQixDQUFaOztBQUVBLG9CQUFRLFdBQVIsR0FBc0IsTUFBTSxRQUFOLENBQ3BCLFFBQVEsV0FEWSxFQUVwQixLQUZvQixDQUF0QjtBQUlEOztBQUVELGNBQUksUUFBUSxhQUFSLElBQXlCLElBQTdCLEVBQW1DO0FBQ2pDLGdCQUFJLGdCQUFnQixRQUFRLFFBQVEsT0FBUixHQUFrQixzQkFBMUIsQ0FBcEI7O0FBRUEsb0JBQVEsV0FBUixHQUFzQixNQUFNLFFBQU4sQ0FDcEIsUUFBUSxXQURZLEVBRXBCLGFBRm9CLENBQXRCO0FBSUQ7QUFDRjs7QUFFRCxZQUFJLFFBQVEsY0FBUixJQUEwQixJQUE5QixFQUFvQztBQUNsQyxrQkFBUSxjQUFSLEdBQXlCLFdBQXpCOztBQUVBLGNBQUksUUFBUSxJQUFSLElBQWdCLElBQXBCLEVBQTBCO0FBQ3hCLG9CQUFRLGNBQVIsR0FBeUIsTUFBTSxRQUFOLENBQ3ZCLFFBQVEsY0FEZSxFQUV2QixjQUZ1QixDQUF6QjtBQUlEOztBQUVELGNBQUksUUFBUSxXQUFSLElBQXVCLElBQTNCLEVBQWlDO0FBQy9CLG9CQUFRLGNBQVIsR0FBeUIsTUFBTSxRQUFOLENBQ3ZCLFFBQVEsY0FEZSxFQUV2QixlQUZ1QixDQUF6QjtBQUlEOztBQUVELGNBQUksUUFBUSxhQUFaLEVBQTJCO0FBQ3pCLG9CQUFRLGNBQVIsR0FBeUIsTUFBTSxRQUFOLENBQ3ZCLFFBQVEsY0FEZSxFQUV2QixhQUZ1QixDQUF6QjtBQUlEO0FBQ0Y7O0FBRUQsWUFBSSxRQUFRLGVBQVIsSUFBMkIsSUFBL0IsRUFBcUM7QUFDbkMsY0FBSSxRQUFRLFFBQVosRUFBc0I7QUFDcEIsb0JBQVEsZUFBUixHQUEwQixRQUExQjtBQUNELFdBRkQsTUFFTztBQUNMLGdCQUFJLHFCQUFxQixNQUFNLFFBQU4sQ0FBZSxRQUFmLEVBQXlCLGNBQXpCLENBQXpCOztBQUVBLG9CQUFRLGVBQVIsR0FBMEIsa0JBQTFCO0FBQ0Q7O0FBRUQsY0FBSSxRQUFRLHVCQUFSLEtBQW9DLENBQXhDLEVBQTJDO0FBQ3pDLG9CQUFRLGVBQVIsR0FBMEIsTUFBTSxRQUFOLENBQ3hCLFFBQVEsZUFEZ0IsRUFFeEIsdUJBRndCLENBQTFCO0FBSUQ7O0FBRUQsY0FBSSxRQUFRLGFBQVosRUFBMkI7QUFDekIsb0JBQVEsZUFBUixHQUEwQixNQUFNLFFBQU4sQ0FDeEIsUUFBUSxlQURnQixFQUV4QixhQUZ3QixDQUExQjtBQUlEOztBQUVELGNBQ0UsUUFBUSxnQkFBUixJQUE0QixJQUE1QixJQUNBLFFBQVEsV0FBUixJQUF1QixJQUR2QixJQUVBLFFBQVEscUJBQVIsSUFBaUMsSUFIbkMsRUFJRTtBQUNBLGdCQUFJLGNBQWMsUUFBUSxRQUFRLE9BQVIsR0FBa0Isb0JBQTFCLENBQWxCOztBQUVBLG9CQUFRLGVBQVIsR0FBMEIsTUFBTSxRQUFOLENBQ3hCLFFBQVEsZUFEZ0IsRUFFeEIsV0FGd0IsQ0FBMUI7QUFJRDs7QUFFRCxrQkFBUSxlQUFSLEdBQTBCLE1BQU0sUUFBTixDQUN4QixRQUFRLGVBRGdCLEVBRXhCLFVBRndCLENBQTFCO0FBSUQ7O0FBRUQsWUFBSSxRQUFRLGdCQUFSLElBQTRCLElBQWhDLEVBQXNDO0FBQ3BDLGNBQUksUUFBUSxRQUFaLEVBQXNCO0FBQ3BCLG9CQUFRLGdCQUFSLEdBQTJCLGlCQUEzQjtBQUNELFdBRkQsTUFFTztBQUNMLG9CQUFRLGdCQUFSLEdBQTJCLGVBQTNCO0FBQ0Q7O0FBRUQ7QUFDQSxjQUFJLFFBQVEsV0FBUixJQUF1QixJQUEzQixFQUFpQztBQUMvQixvQkFBUSxnQkFBUixHQUEyQixNQUFNLFFBQU4sQ0FDekIsUUFBUSxnQkFEaUIsRUFFekIsV0FGeUIsQ0FBM0I7QUFJRDs7QUFFRCxjQUFJLFFBQVEsVUFBWixFQUF3QjtBQUN0QixvQkFBUSxnQkFBUixHQUEyQixNQUFNLFFBQU4sQ0FDekIsUUFBUSxnQkFEaUIsRUFFekIsVUFGeUIsQ0FBM0I7QUFJRDs7QUFFRCxjQUFJLFFBQVEsUUFBWixFQUFzQjtBQUNwQixvQkFBUSxnQkFBUixHQUEyQixNQUFNLFFBQU4sQ0FDekIsUUFBUSxnQkFEaUIsRUFFekIsZUFGeUIsQ0FBM0I7QUFJRDs7QUFFRCxjQUNFLFFBQVEsaUJBQVIsSUFBNkIsSUFBN0IsSUFDQSxRQUFRLFlBQVIsSUFBd0IsSUFEeEIsSUFFQSxRQUFRLHNCQUFSLElBQWtDLElBSHBDLEVBSUU7QUFDQSxnQkFBSSxlQUFlLFFBQVEsUUFBUSxPQUFSLEdBQWtCLHFCQUExQixDQUFuQjs7QUFFQSxvQkFBUSxnQkFBUixHQUEyQixNQUFNLFFBQU4sQ0FDekIsUUFBUSxnQkFEaUIsRUFFekIsWUFGeUIsQ0FBM0I7QUFJRDs7QUFFRCxrQkFBUSxnQkFBUixHQUEyQixNQUFNLFFBQU4sQ0FDekIsUUFBUSxnQkFEaUIsRUFFekIsVUFGeUIsQ0FBM0I7QUFJRDs7QUFFRCxZQUFJLE9BQU8sUUFBUSxRQUFmLEtBQTRCLFFBQWhDLEVBQTBDO0FBQ3hDO0FBQ0EsY0FBSSxRQUFRLFFBQVIsQ0FBaUIsT0FBakIsQ0FBeUIsR0FBekIsSUFBZ0MsQ0FBcEMsRUFBdUM7QUFDckM7QUFDQSxnQkFBSSxnQkFBZ0IsUUFBUSxRQUFSLENBQWlCLEtBQWpCLENBQXVCLEdBQXZCLENBQXBCO0FBQ0EsZ0JBQUksZUFBZSxjQUFjLENBQWQsQ0FBbkI7O0FBRUEsb0JBQVEsUUFBUixHQUFtQixDQUFDLFFBQVEsUUFBVCxFQUFtQixZQUFuQixDQUFuQjtBQUNELFdBTkQsTUFNTztBQUNMLG9CQUFRLFFBQVIsR0FBbUIsQ0FBQyxRQUFRLFFBQVQsQ0FBbkI7QUFDRDtBQUNGOztBQUVELFlBQUksRUFBRSxPQUFGLENBQVUsUUFBUSxRQUFsQixDQUFKLEVBQWlDO0FBQy9CLGNBQUksWUFBWSxJQUFJLFdBQUosRUFBaEI7QUFDQSxrQkFBUSxRQUFSLENBQWlCLElBQWpCLENBQXNCLElBQXRCOztBQUVBLGNBQUksZ0JBQWdCLFFBQVEsUUFBNUI7O0FBRUEsZUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLGNBQWMsTUFBbEMsRUFBMEMsR0FBMUMsRUFBK0M7QUFDN0MsZ0JBQUksT0FBTyxjQUFjLENBQWQsQ0FBWDtBQUNBLGdCQUFJLFdBQVcsRUFBZjs7QUFFQSxnQkFBSTtBQUNGO0FBQ0EseUJBQVcsWUFBWSxRQUFaLENBQXFCLElBQXJCLENBQVg7QUFDRCxhQUhELENBR0UsT0FBTyxDQUFQLEVBQVU7QUFDVixrQkFBSTtBQUNGO0FBQ0EsdUJBQU8sS0FBSyxRQUFMLENBQWMsZUFBZCxHQUFnQyxJQUF2QztBQUNBLDJCQUFXLFlBQVksUUFBWixDQUFxQixJQUFyQixDQUFYO0FBQ0QsZUFKRCxDQUlFLE9BQU8sRUFBUCxFQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0Esb0JBQUksUUFBUSxLQUFSLElBQWlCLE9BQU8sT0FBeEIsSUFBbUMsUUFBUSxJQUEvQyxFQUFxRDtBQUNuRCwwQkFBUSxJQUFSLENBQ0UscUNBQXFDLElBQXJDLEdBQTRDLGlCQUE1QyxHQUNBLHdEQUZGO0FBSUQ7O0FBRUQ7QUFDRDtBQUNGOztBQUVELHNCQUFVLE1BQVYsQ0FBaUIsUUFBakI7QUFDRDs7QUFFRCxrQkFBUSxZQUFSLEdBQXVCLFNBQXZCO0FBQ0QsU0FyQ0QsTUFxQ087QUFDTCxjQUFJLGtCQUFrQixZQUFZLFFBQVosQ0FDcEIsS0FBSyxRQUFMLENBQWMsZUFBZCxHQUFnQyxJQURaLENBQXRCO0FBR0EsY0FBSSxvQkFBb0IsSUFBSSxXQUFKLENBQWdCLFFBQVEsUUFBeEIsQ0FBeEI7O0FBRUEsNEJBQWtCLE1BQWxCLENBQXlCLGVBQXpCOztBQUVBLGtCQUFRLFlBQVIsR0FBdUIsaUJBQXZCO0FBQ0Q7O0FBRUQsZUFBTyxPQUFQO0FBQ0QsT0FoUEQ7O0FBa1BBLGVBQVMsU0FBVCxDQUFtQixLQUFuQixHQUEyQixZQUFZO0FBQ3JDLGlCQUFTLGVBQVQsQ0FBMEIsSUFBMUIsRUFBZ0M7QUFDOUI7QUFDQSxtQkFBUyxLQUFULENBQWUsQ0FBZixFQUFrQjtBQUNoQixtQkFBTyxXQUFXLENBQVgsS0FBaUIsQ0FBeEI7QUFDRDs7QUFFRCxpQkFBTyxLQUFLLE9BQUwsQ0FBYSxtQkFBYixFQUFrQyxLQUFsQyxDQUFQO0FBQ0Q7O0FBRUQsaUJBQVMsT0FBVCxDQUFrQixNQUFsQixFQUEwQixJQUExQixFQUFnQztBQUM5QjtBQUNBLGNBQUksRUFBRSxJQUFGLENBQU8sT0FBTyxJQUFkLE1BQXdCLEVBQTVCLEVBQWdDO0FBQzlCLG1CQUFPLElBQVA7QUFDRDs7QUFFRDtBQUNBLGNBQUksS0FBSyxRQUFMLElBQWlCLEtBQUssUUFBTCxDQUFjLE1BQWQsR0FBdUIsQ0FBNUMsRUFBK0M7QUFDN0M7QUFDQTtBQUNBLGdCQUFJLFFBQVEsRUFBRSxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUIsSUFBbkIsQ0FBWjs7QUFFQTtBQUNBLGlCQUFLLElBQUksSUFBSSxLQUFLLFFBQUwsQ0FBYyxNQUFkLEdBQXVCLENBQXBDLEVBQXVDLEtBQUssQ0FBNUMsRUFBK0MsR0FBL0MsRUFBb0Q7QUFDbEQsa0JBQUksUUFBUSxLQUFLLFFBQUwsQ0FBYyxDQUFkLENBQVo7O0FBRUEsa0JBQUksVUFBVSxRQUFRLE1BQVIsRUFBZ0IsS0FBaEIsQ0FBZDs7QUFFQTtBQUNBLGtCQUFJLFdBQVcsSUFBZixFQUFxQjtBQUNuQixzQkFBTSxRQUFOLENBQWUsTUFBZixDQUFzQixDQUF0QixFQUF5QixDQUF6QjtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQSxnQkFBSSxNQUFNLFFBQU4sQ0FBZSxNQUFmLEdBQXdCLENBQTVCLEVBQStCO0FBQzdCLHFCQUFPLEtBQVA7QUFDRDs7QUFFRDtBQUNBLG1CQUFPLFFBQVEsTUFBUixFQUFnQixLQUFoQixDQUFQO0FBQ0Q7O0FBRUQsY0FBSSxXQUFXLGdCQUFnQixLQUFLLElBQXJCLEVBQTJCLFdBQTNCLEVBQWY7QUFDQSxjQUFJLE9BQU8sZ0JBQWdCLE9BQU8sSUFBdkIsRUFBNkIsV0FBN0IsRUFBWDs7QUFFQTtBQUNBLGNBQUksU0FBUyxPQUFULENBQWlCLElBQWpCLElBQXlCLENBQUMsQ0FBOUIsRUFBaUM7QUFDL0IsbUJBQU8sSUFBUDtBQUNEOztBQUVEO0FBQ0EsaUJBQU8sSUFBUDtBQUNEOztBQUVELGFBQUssUUFBTCxHQUFnQjtBQUNkLG1CQUFTLElBREs7QUFFZCwyQkFBaUIsU0FGSDtBQUdkLHlCQUFlLElBSEQ7QUFJZCxpQkFBTyxLQUpPO0FBS2QsNkJBQW1CLEtBTEw7QUFNZCx3QkFBYyxNQUFNLFlBTk47QUFPZCxvQkFBVSxrQkFQSTtBQVFkLG1CQUFTLE9BUks7QUFTZCw4QkFBb0IsQ0FUTjtBQVVkLDhCQUFvQixDQVZOO0FBV2Qsa0NBQXdCLENBWFY7QUFZZCxtQ0FBeUIsQ0FaWDtBQWFkLHlCQUFlLEtBYkQ7QUFjZCxrQkFBUSxnQkFBVSxJQUFWLEVBQWdCO0FBQ3RCLG1CQUFPLElBQVA7QUFDRCxXQWhCYTtBQWlCZCwwQkFBZ0Isd0JBQVUsTUFBVixFQUFrQjtBQUNoQyxtQkFBTyxPQUFPLElBQWQ7QUFDRCxXQW5CYTtBQW9CZCw2QkFBbUIsMkJBQVUsU0FBVixFQUFxQjtBQUN0QyxtQkFBTyxVQUFVLElBQWpCO0FBQ0QsV0F0QmE7QUF1QmQsaUJBQU8sU0F2Qk87QUF3QmQsaUJBQU87QUF4Qk8sU0FBaEI7QUEwQkQsT0FqRkQ7O0FBbUZBLGVBQVMsU0FBVCxDQUFtQixHQUFuQixHQUF5QixVQUFVLEdBQVYsRUFBZSxLQUFmLEVBQXNCO0FBQzdDLFlBQUksV0FBVyxFQUFFLFNBQUYsQ0FBWSxHQUFaLENBQWY7O0FBRUEsWUFBSSxPQUFPLEVBQVg7QUFDQSxhQUFLLFFBQUwsSUFBaUIsS0FBakI7O0FBRUEsWUFBSSxnQkFBZ0IsTUFBTSxZQUFOLENBQW1CLElBQW5CLENBQXBCOztBQUVBLFVBQUUsTUFBRixDQUFTLEtBQUssUUFBZCxFQUF3QixhQUF4QjtBQUNELE9BVEQ7O0FBV0EsVUFBSSxXQUFXLElBQUksUUFBSixFQUFmOztBQUVBLGFBQU8sUUFBUDtBQUNELEtBM1lEOztBQTZZQSxPQUFHLE1BQUgsQ0FBVSxpQkFBVixFQUE0QixDQUMxQixTQUQwQixFQUUxQixRQUYwQixFQUcxQixZQUgwQixFQUkxQixTQUowQixDQUE1QixFQUtHLFVBQVUsT0FBVixFQUFtQixDQUFuQixFQUFzQixRQUF0QixFQUFnQyxLQUFoQyxFQUF1QztBQUN4QyxlQUFTLE9BQVQsQ0FBa0IsT0FBbEIsRUFBMkIsUUFBM0IsRUFBcUM7QUFDbkMsYUFBSyxPQUFMLEdBQWUsT0FBZjs7QUFFQSxZQUFJLFlBQVksSUFBaEIsRUFBc0I7QUFDcEIsZUFBSyxXQUFMLENBQWlCLFFBQWpCO0FBQ0Q7O0FBRUQsYUFBSyxPQUFMLEdBQWUsU0FBUyxLQUFULENBQWUsS0FBSyxPQUFwQixDQUFmOztBQUVBLFlBQUksWUFBWSxTQUFTLEVBQVQsQ0FBWSxPQUFaLENBQWhCLEVBQXNDO0FBQ3BDLGNBQUksY0FBYyxRQUFRLEtBQUssR0FBTCxDQUFTLFNBQVQsSUFBc0Isa0JBQTlCLENBQWxCOztBQUVBLGVBQUssT0FBTCxDQUFhLFdBQWIsR0FBMkIsTUFBTSxRQUFOLENBQ3pCLEtBQUssT0FBTCxDQUFhLFdBRFksRUFFekIsV0FGeUIsQ0FBM0I7QUFJRDtBQUNGOztBQUVELGNBQVEsU0FBUixDQUFrQixXQUFsQixHQUFnQyxVQUFVLEVBQVYsRUFBYztBQUM1QyxZQUFJLGVBQWUsQ0FBQyxTQUFELENBQW5COztBQUVBLFlBQUksS0FBSyxPQUFMLENBQWEsUUFBYixJQUF5QixJQUE3QixFQUFtQztBQUNqQyxlQUFLLE9BQUwsQ0FBYSxRQUFiLEdBQXdCLEdBQUcsSUFBSCxDQUFRLFVBQVIsQ0FBeEI7QUFDRDs7QUFFRCxZQUFJLEtBQUssT0FBTCxDQUFhLFFBQWIsSUFBeUIsSUFBN0IsRUFBbUM7QUFDakMsZUFBSyxPQUFMLENBQWEsUUFBYixHQUF3QixHQUFHLElBQUgsQ0FBUSxVQUFSLENBQXhCO0FBQ0Q7O0FBRUQsWUFBSSxLQUFLLE9BQUwsQ0FBYSxRQUFiLElBQXlCLElBQTdCLEVBQW1DO0FBQ2pDLGNBQUksR0FBRyxJQUFILENBQVEsTUFBUixDQUFKLEVBQXFCO0FBQ25CLGlCQUFLLE9BQUwsQ0FBYSxRQUFiLEdBQXdCLEdBQUcsSUFBSCxDQUFRLE1BQVIsRUFBZ0IsV0FBaEIsRUFBeEI7QUFDRCxXQUZELE1BRU8sSUFBSSxHQUFHLE9BQUgsQ0FBVyxRQUFYLEVBQXFCLElBQXJCLENBQTBCLE1BQTFCLENBQUosRUFBdUM7QUFDNUMsaUJBQUssT0FBTCxDQUFhLFFBQWIsR0FBd0IsR0FBRyxPQUFILENBQVcsUUFBWCxFQUFxQixJQUFyQixDQUEwQixNQUExQixDQUF4QjtBQUNEO0FBQ0Y7O0FBRUQsWUFBSSxLQUFLLE9BQUwsQ0FBYSxHQUFiLElBQW9CLElBQXhCLEVBQThCO0FBQzVCLGNBQUksR0FBRyxJQUFILENBQVEsS0FBUixDQUFKLEVBQW9CO0FBQ2xCLGlCQUFLLE9BQUwsQ0FBYSxHQUFiLEdBQW1CLEdBQUcsSUFBSCxDQUFRLEtBQVIsQ0FBbkI7QUFDRCxXQUZELE1BRU8sSUFBSSxHQUFHLE9BQUgsQ0FBVyxPQUFYLEVBQW9CLElBQXBCLENBQXlCLEtBQXpCLENBQUosRUFBcUM7QUFDMUMsaUJBQUssT0FBTCxDQUFhLEdBQWIsR0FBbUIsR0FBRyxPQUFILENBQVcsT0FBWCxFQUFvQixJQUFwQixDQUF5QixLQUF6QixDQUFuQjtBQUNELFdBRk0sTUFFQTtBQUNMLGlCQUFLLE9BQUwsQ0FBYSxHQUFiLEdBQW1CLEtBQW5CO0FBQ0Q7QUFDRjs7QUFFRCxXQUFHLElBQUgsQ0FBUSxVQUFSLEVBQW9CLEtBQUssT0FBTCxDQUFhLFFBQWpDO0FBQ0EsV0FBRyxJQUFILENBQVEsVUFBUixFQUFvQixLQUFLLE9BQUwsQ0FBYSxRQUFqQzs7QUFFQSxZQUFJLEdBQUcsSUFBSCxDQUFRLGFBQVIsQ0FBSixFQUE0QjtBQUMxQixjQUFJLEtBQUssT0FBTCxDQUFhLEtBQWIsSUFBc0IsT0FBTyxPQUE3QixJQUF3QyxRQUFRLElBQXBELEVBQTBEO0FBQ3hELG9CQUFRLElBQVIsQ0FDRSxvRUFDQSxvRUFEQSxHQUVBLHdDQUhGO0FBS0Q7O0FBRUQsYUFBRyxJQUFILENBQVEsTUFBUixFQUFnQixHQUFHLElBQUgsQ0FBUSxhQUFSLENBQWhCO0FBQ0EsYUFBRyxJQUFILENBQVEsTUFBUixFQUFnQixJQUFoQjtBQUNEOztBQUVELFlBQUksR0FBRyxJQUFILENBQVEsU0FBUixDQUFKLEVBQXdCO0FBQ3RCLGNBQUksS0FBSyxPQUFMLENBQWEsS0FBYixJQUFzQixPQUFPLE9BQTdCLElBQXdDLFFBQVEsSUFBcEQsRUFBMEQ7QUFDeEQsb0JBQVEsSUFBUixDQUNFLGdFQUNBLG9FQURBLEdBRUEsaUNBSEY7QUFLRDs7QUFFRCxhQUFHLElBQUgsQ0FBUSxXQUFSLEVBQXFCLEdBQUcsSUFBSCxDQUFRLFNBQVIsQ0FBckI7QUFDQSxhQUFHLElBQUgsQ0FBUSxXQUFSLEVBQXFCLEdBQUcsSUFBSCxDQUFRLFNBQVIsQ0FBckI7QUFDRDs7QUFFRCxZQUFJLFVBQVUsRUFBZDs7QUFFQTtBQUNBO0FBQ0EsWUFBSSxFQUFFLEVBQUYsQ0FBSyxNQUFMLElBQWUsRUFBRSxFQUFGLENBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsS0FBNEIsSUFBM0MsSUFBbUQsR0FBRyxDQUFILEVBQU0sT0FBN0QsRUFBc0U7QUFDcEUsb0JBQVUsRUFBRSxNQUFGLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUIsR0FBRyxDQUFILEVBQU0sT0FBekIsRUFBa0MsR0FBRyxJQUFILEVBQWxDLENBQVY7QUFDRCxTQUZELE1BRU87QUFDTCxvQkFBVSxHQUFHLElBQUgsRUFBVjtBQUNEOztBQUVELFlBQUksT0FBTyxFQUFFLE1BQUYsQ0FBUyxJQUFULEVBQWUsRUFBZixFQUFtQixPQUFuQixDQUFYOztBQUVBLGVBQU8sTUFBTSxZQUFOLENBQW1CLElBQW5CLENBQVA7O0FBRUEsYUFBSyxJQUFJLEdBQVQsSUFBZ0IsSUFBaEIsRUFBc0I7QUFDcEIsY0FBSSxFQUFFLE9BQUYsQ0FBVSxHQUFWLEVBQWUsWUFBZixJQUErQixDQUFDLENBQXBDLEVBQXVDO0FBQ3JDO0FBQ0Q7O0FBRUQsY0FBSSxFQUFFLGFBQUYsQ0FBZ0IsS0FBSyxPQUFMLENBQWEsR0FBYixDQUFoQixDQUFKLEVBQXdDO0FBQ3RDLGNBQUUsTUFBRixDQUFTLEtBQUssT0FBTCxDQUFhLEdBQWIsQ0FBVCxFQUE0QixLQUFLLEdBQUwsQ0FBNUI7QUFDRCxXQUZELE1BRU87QUFDTCxpQkFBSyxPQUFMLENBQWEsR0FBYixJQUFvQixLQUFLLEdBQUwsQ0FBcEI7QUFDRDtBQUNGOztBQUVELGVBQU8sSUFBUDtBQUNELE9BckZEOztBQXVGQSxjQUFRLFNBQVIsQ0FBa0IsR0FBbEIsR0FBd0IsVUFBVSxHQUFWLEVBQWU7QUFDckMsZUFBTyxLQUFLLE9BQUwsQ0FBYSxHQUFiLENBQVA7QUFDRCxPQUZEOztBQUlBLGNBQVEsU0FBUixDQUFrQixHQUFsQixHQUF3QixVQUFVLEdBQVYsRUFBZSxHQUFmLEVBQW9CO0FBQzFDLGFBQUssT0FBTCxDQUFhLEdBQWIsSUFBb0IsR0FBcEI7QUFDRCxPQUZEOztBQUlBLGFBQU8sT0FBUDtBQUNELEtBekhEOztBQTJIQSxPQUFHLE1BQUgsQ0FBVSxjQUFWLEVBQXlCLENBQ3ZCLFFBRHVCLEVBRXZCLFdBRnVCLEVBR3ZCLFNBSHVCLEVBSXZCLFFBSnVCLENBQXpCLEVBS0csVUFBVSxDQUFWLEVBQWEsT0FBYixFQUFzQixLQUF0QixFQUE2QixJQUE3QixFQUFtQztBQUNwQyxVQUFJLFVBQVUsU0FBVixPQUFVLENBQVUsUUFBVixFQUFvQixPQUFwQixFQUE2QjtBQUN6QyxZQUFJLFNBQVMsSUFBVCxDQUFjLFNBQWQsS0FBNEIsSUFBaEMsRUFBc0M7QUFDcEMsbUJBQVMsSUFBVCxDQUFjLFNBQWQsRUFBeUIsT0FBekI7QUFDRDs7QUFFRCxhQUFLLFFBQUwsR0FBZ0IsUUFBaEI7O0FBRUEsYUFBSyxFQUFMLEdBQVUsS0FBSyxXQUFMLENBQWlCLFFBQWpCLENBQVY7O0FBRUEsa0JBQVUsV0FBVyxFQUFyQjs7QUFFQSxhQUFLLE9BQUwsR0FBZSxJQUFJLE9BQUosQ0FBWSxPQUFaLEVBQXFCLFFBQXJCLENBQWY7O0FBRUEsZ0JBQVEsU0FBUixDQUFrQixXQUFsQixDQUE4QixJQUE5QixDQUFtQyxJQUFuQzs7QUFFQTs7QUFFQSxZQUFJLFdBQVcsU0FBUyxJQUFULENBQWMsVUFBZCxLQUE2QixDQUE1QztBQUNBLGlCQUFTLElBQVQsQ0FBYyxjQUFkLEVBQThCLFFBQTlCO0FBQ0EsaUJBQVMsSUFBVCxDQUFjLFVBQWQsRUFBMEIsSUFBMUI7O0FBRUE7O0FBRUEsWUFBSSxjQUFjLEtBQUssT0FBTCxDQUFhLEdBQWIsQ0FBaUIsYUFBakIsQ0FBbEI7QUFDQSxhQUFLLFdBQUwsR0FBbUIsSUFBSSxXQUFKLENBQWdCLFFBQWhCLEVBQTBCLEtBQUssT0FBL0IsQ0FBbkI7O0FBRUEsWUFBSSxhQUFhLEtBQUssTUFBTCxFQUFqQjs7QUFFQSxhQUFLLGVBQUwsQ0FBcUIsVUFBckI7O0FBRUEsWUFBSSxtQkFBbUIsS0FBSyxPQUFMLENBQWEsR0FBYixDQUFpQixrQkFBakIsQ0FBdkI7QUFDQSxhQUFLLFNBQUwsR0FBaUIsSUFBSSxnQkFBSixDQUFxQixRQUFyQixFQUErQixLQUFLLE9BQXBDLENBQWpCO0FBQ0EsYUFBSyxVQUFMLEdBQWtCLEtBQUssU0FBTCxDQUFlLE1BQWYsRUFBbEI7O0FBRUEsYUFBSyxTQUFMLENBQWUsUUFBZixDQUF3QixLQUFLLFVBQTdCLEVBQXlDLFVBQXpDOztBQUVBLFlBQUksa0JBQWtCLEtBQUssT0FBTCxDQUFhLEdBQWIsQ0FBaUIsaUJBQWpCLENBQXRCO0FBQ0EsYUFBSyxRQUFMLEdBQWdCLElBQUksZUFBSixDQUFvQixRQUFwQixFQUE4QixLQUFLLE9BQW5DLENBQWhCO0FBQ0EsYUFBSyxTQUFMLEdBQWlCLEtBQUssUUFBTCxDQUFjLE1BQWQsRUFBakI7O0FBRUEsYUFBSyxRQUFMLENBQWMsUUFBZCxDQUF1QixLQUFLLFNBQTVCLEVBQXVDLFVBQXZDOztBQUVBLFlBQUksaUJBQWlCLEtBQUssT0FBTCxDQUFhLEdBQWIsQ0FBaUIsZ0JBQWpCLENBQXJCO0FBQ0EsYUFBSyxPQUFMLEdBQWUsSUFBSSxjQUFKLENBQW1CLFFBQW5CLEVBQTZCLEtBQUssT0FBbEMsRUFBMkMsS0FBSyxXQUFoRCxDQUFmO0FBQ0EsYUFBSyxRQUFMLEdBQWdCLEtBQUssT0FBTCxDQUFhLE1BQWIsRUFBaEI7O0FBRUEsYUFBSyxPQUFMLENBQWEsUUFBYixDQUFzQixLQUFLLFFBQTNCLEVBQXFDLEtBQUssU0FBMUM7O0FBRUE7O0FBRUEsWUFBSSxPQUFPLElBQVg7O0FBRUE7QUFDQSxhQUFLLGFBQUw7O0FBRUE7QUFDQSxhQUFLLGtCQUFMOztBQUVBO0FBQ0EsYUFBSyxtQkFBTDtBQUNBLGFBQUssd0JBQUw7QUFDQSxhQUFLLHVCQUFMO0FBQ0EsYUFBSyxzQkFBTDtBQUNBLGFBQUssZUFBTDs7QUFFQTtBQUNBLGFBQUssV0FBTCxDQUFpQixPQUFqQixDQUF5QixVQUFVLFdBQVYsRUFBdUI7QUFDOUMsZUFBSyxPQUFMLENBQWEsa0JBQWIsRUFBaUM7QUFDL0Isa0JBQU07QUFEeUIsV0FBakM7QUFHRCxTQUpEOztBQU1BO0FBQ0EsaUJBQVMsUUFBVCxDQUFrQiwyQkFBbEI7QUFDQSxpQkFBUyxJQUFULENBQWMsYUFBZCxFQUE2QixNQUE3Qjs7QUFFQTtBQUNBLGFBQUssZUFBTDs7QUFFQSxpQkFBUyxJQUFULENBQWMsU0FBZCxFQUF5QixJQUF6QjtBQUNELE9BaEZEOztBQWtGQSxZQUFNLE1BQU4sQ0FBYSxPQUFiLEVBQXNCLE1BQU0sVUFBNUI7O0FBRUEsY0FBUSxTQUFSLENBQWtCLFdBQWxCLEdBQWdDLFVBQVUsUUFBVixFQUFvQjtBQUNsRCxZQUFJLEtBQUssRUFBVDs7QUFFQSxZQUFJLFNBQVMsSUFBVCxDQUFjLElBQWQsS0FBdUIsSUFBM0IsRUFBaUM7QUFDL0IsZUFBSyxTQUFTLElBQVQsQ0FBYyxJQUFkLENBQUw7QUFDRCxTQUZELE1BRU8sSUFBSSxTQUFTLElBQVQsQ0FBYyxNQUFkLEtBQXlCLElBQTdCLEVBQW1DO0FBQ3hDLGVBQUssU0FBUyxJQUFULENBQWMsTUFBZCxJQUF3QixHQUF4QixHQUE4QixNQUFNLGFBQU4sQ0FBb0IsQ0FBcEIsQ0FBbkM7QUFDRCxTQUZNLE1BRUE7QUFDTCxlQUFLLE1BQU0sYUFBTixDQUFvQixDQUFwQixDQUFMO0FBQ0Q7O0FBRUQsYUFBSyxHQUFHLE9BQUgsQ0FBVyxpQkFBWCxFQUE4QixFQUE5QixDQUFMO0FBQ0EsYUFBSyxhQUFhLEVBQWxCOztBQUVBLGVBQU8sRUFBUDtBQUNELE9BZkQ7O0FBaUJBLGNBQVEsU0FBUixDQUFrQixlQUFsQixHQUFvQyxVQUFVLFVBQVYsRUFBc0I7QUFDeEQsbUJBQVcsV0FBWCxDQUF1QixLQUFLLFFBQTVCOztBQUVBLFlBQUksUUFBUSxLQUFLLGFBQUwsQ0FBbUIsS0FBSyxRQUF4QixFQUFrQyxLQUFLLE9BQUwsQ0FBYSxHQUFiLENBQWlCLE9BQWpCLENBQWxDLENBQVo7O0FBRUEsWUFBSSxTQUFTLElBQWIsRUFBbUI7QUFDakIscUJBQVcsR0FBWCxDQUFlLE9BQWYsRUFBd0IsS0FBeEI7QUFDRDtBQUNGLE9BUkQ7O0FBVUEsY0FBUSxTQUFSLENBQWtCLGFBQWxCLEdBQWtDLFVBQVUsUUFBVixFQUFvQixNQUFwQixFQUE0QjtBQUM1RCxZQUFJLFFBQVEsK0RBQVo7O0FBRUEsWUFBSSxVQUFVLFNBQWQsRUFBeUI7QUFDdkIsY0FBSSxhQUFhLEtBQUssYUFBTCxDQUFtQixRQUFuQixFQUE2QixPQUE3QixDQUFqQjs7QUFFQSxjQUFJLGNBQWMsSUFBbEIsRUFBd0I7QUFDdEIsbUJBQU8sVUFBUDtBQUNEOztBQUVELGlCQUFPLEtBQUssYUFBTCxDQUFtQixRQUFuQixFQUE2QixTQUE3QixDQUFQO0FBQ0Q7O0FBRUQsWUFBSSxVQUFVLFNBQWQsRUFBeUI7QUFDdkIsY0FBSSxlQUFlLFNBQVMsVUFBVCxDQUFvQixLQUFwQixDQUFuQjs7QUFFQSxjQUFJLGdCQUFnQixDQUFwQixFQUF1QjtBQUNyQixtQkFBTyxNQUFQO0FBQ0Q7O0FBRUQsaUJBQU8sZUFBZSxJQUF0QjtBQUNEOztBQUVELFlBQUksVUFBVSxPQUFkLEVBQXVCO0FBQ3JCLGNBQUksUUFBUSxTQUFTLElBQVQsQ0FBYyxPQUFkLENBQVo7O0FBRUEsY0FBSSxPQUFPLEtBQVAsS0FBa0IsUUFBdEIsRUFBZ0M7QUFDOUIsbUJBQU8sSUFBUDtBQUNEOztBQUVELGNBQUksUUFBUSxNQUFNLEtBQU4sQ0FBWSxHQUFaLENBQVo7O0FBRUEsZUFBSyxJQUFJLElBQUksQ0FBUixFQUFXLElBQUksTUFBTSxNQUExQixFQUFrQyxJQUFJLENBQXRDLEVBQXlDLElBQUksSUFBSSxDQUFqRCxFQUFvRDtBQUNsRCxnQkFBSSxPQUFPLE1BQU0sQ0FBTixFQUFTLE9BQVQsQ0FBaUIsS0FBakIsRUFBd0IsRUFBeEIsQ0FBWDtBQUNBLGdCQUFJLFVBQVUsS0FBSyxLQUFMLENBQVcsS0FBWCxDQUFkOztBQUVBLGdCQUFJLFlBQVksSUFBWixJQUFvQixRQUFRLE1BQVIsSUFBa0IsQ0FBMUMsRUFBNkM7QUFDM0MscUJBQU8sUUFBUSxDQUFSLENBQVA7QUFDRDtBQUNGOztBQUVELGlCQUFPLElBQVA7QUFDRDs7QUFFRCxlQUFPLE1BQVA7QUFDRCxPQTdDRDs7QUErQ0EsY0FBUSxTQUFSLENBQWtCLGFBQWxCLEdBQWtDLFlBQVk7QUFDNUMsYUFBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCLEVBQTRCLEtBQUssVUFBakM7QUFDQSxhQUFLLFNBQUwsQ0FBZSxJQUFmLENBQW9CLElBQXBCLEVBQTBCLEtBQUssVUFBL0I7O0FBRUEsYUFBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixJQUFuQixFQUF5QixLQUFLLFVBQTlCO0FBQ0EsYUFBSyxPQUFMLENBQWEsSUFBYixDQUFrQixJQUFsQixFQUF3QixLQUFLLFVBQTdCO0FBQ0QsT0FORDs7QUFRQSxjQUFRLFNBQVIsQ0FBa0Isa0JBQWxCLEdBQXVDLFlBQVk7QUFDakQsWUFBSSxPQUFPLElBQVg7O0FBRUEsYUFBSyxRQUFMLENBQWMsRUFBZCxDQUFpQixnQkFBakIsRUFBbUMsWUFBWTtBQUM3QyxlQUFLLFdBQUwsQ0FBaUIsT0FBakIsQ0FBeUIsVUFBVSxJQUFWLEVBQWdCO0FBQ3ZDLGlCQUFLLE9BQUwsQ0FBYSxrQkFBYixFQUFpQztBQUMvQixvQkFBTTtBQUR5QixhQUFqQztBQUdELFdBSkQ7QUFLRCxTQU5EOztBQVFBLGFBQUssUUFBTCxDQUFjLEVBQWQsQ0FBaUIsZUFBakIsRUFBa0MsVUFBVSxHQUFWLEVBQWU7QUFDL0MsZUFBSyxPQUFMLENBQWEsT0FBYixFQUFzQixHQUF0QjtBQUNELFNBRkQ7O0FBSUEsYUFBSyxNQUFMLEdBQWMsTUFBTSxJQUFOLENBQVcsS0FBSyxlQUFoQixFQUFpQyxJQUFqQyxDQUFkO0FBQ0EsYUFBSyxNQUFMLEdBQWMsTUFBTSxJQUFOLENBQVcsS0FBSyxZQUFoQixFQUE4QixJQUE5QixDQUFkOztBQUVBLFlBQUksS0FBSyxRQUFMLENBQWMsQ0FBZCxFQUFpQixXQUFyQixFQUFrQztBQUNoQyxlQUFLLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLFdBQWpCLENBQTZCLGtCQUE3QixFQUFpRCxLQUFLLE1BQXREO0FBQ0Q7O0FBRUQsWUFBSSxXQUFXLE9BQU8sZ0JBQVAsSUFDYixPQUFPLHNCQURNLElBRWIsT0FBTyxtQkFGVDs7QUFLQSxZQUFJLFlBQVksSUFBaEIsRUFBc0I7QUFDcEIsZUFBSyxTQUFMLEdBQWlCLElBQUksUUFBSixDQUFhLFVBQVUsU0FBVixFQUFxQjtBQUNqRCxjQUFFLElBQUYsQ0FBTyxTQUFQLEVBQWtCLEtBQUssTUFBdkI7QUFDQSxjQUFFLElBQUYsQ0FBTyxTQUFQLEVBQWtCLEtBQUssTUFBdkI7QUFDRCxXQUhnQixDQUFqQjtBQUlBLGVBQUssU0FBTCxDQUFlLE9BQWYsQ0FBdUIsS0FBSyxRQUFMLENBQWMsQ0FBZCxDQUF2QixFQUF5QztBQUN2Qyx3QkFBWSxJQUQyQjtBQUV2Qyx1QkFBVyxJQUY0QjtBQUd2QyxxQkFBUztBQUg4QixXQUF6QztBQUtELFNBVkQsTUFVTyxJQUFJLEtBQUssUUFBTCxDQUFjLENBQWQsRUFBaUIsZ0JBQXJCLEVBQXVDO0FBQzVDLGVBQUssUUFBTCxDQUFjLENBQWQsRUFBaUIsZ0JBQWpCLENBQ0UsaUJBREYsRUFFRSxLQUFLLE1BRlAsRUFHRSxLQUhGO0FBS0EsZUFBSyxRQUFMLENBQWMsQ0FBZCxFQUFpQixnQkFBakIsQ0FDRSxpQkFERixFQUVFLEtBQUssTUFGUCxFQUdFLEtBSEY7QUFLQSxlQUFLLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLGdCQUFqQixDQUNFLGdCQURGLEVBRUUsS0FBSyxNQUZQLEVBR0UsS0FIRjtBQUtEO0FBQ0YsT0F0REQ7O0FBd0RBLGNBQVEsU0FBUixDQUFrQixtQkFBbEIsR0FBd0MsWUFBWTtBQUNsRCxZQUFJLE9BQU8sSUFBWDs7QUFFQSxhQUFLLFdBQUwsQ0FBaUIsRUFBakIsQ0FBb0IsR0FBcEIsRUFBeUIsVUFBVSxJQUFWLEVBQWdCLE1BQWhCLEVBQXdCO0FBQy9DLGVBQUssT0FBTCxDQUFhLElBQWIsRUFBbUIsTUFBbkI7QUFDRCxTQUZEO0FBR0QsT0FORDs7QUFRQSxjQUFRLFNBQVIsQ0FBa0Isd0JBQWxCLEdBQTZDLFlBQVk7QUFDdkQsWUFBSSxPQUFPLElBQVg7QUFDQSxZQUFJLGlCQUFpQixDQUFDLFFBQUQsRUFBVyxPQUFYLENBQXJCOztBQUVBLGFBQUssU0FBTCxDQUFlLEVBQWYsQ0FBa0IsUUFBbEIsRUFBNEIsWUFBWTtBQUN0QyxlQUFLLGNBQUw7QUFDRCxTQUZEOztBQUlBLGFBQUssU0FBTCxDQUFlLEVBQWYsQ0FBa0IsT0FBbEIsRUFBMkIsVUFBVSxNQUFWLEVBQWtCO0FBQzNDLGVBQUssS0FBTCxDQUFXLE1BQVg7QUFDRCxTQUZEOztBQUlBLGFBQUssU0FBTCxDQUFlLEVBQWYsQ0FBa0IsR0FBbEIsRUFBdUIsVUFBVSxJQUFWLEVBQWdCLE1BQWhCLEVBQXdCO0FBQzdDLGNBQUksRUFBRSxPQUFGLENBQVUsSUFBVixFQUFnQixjQUFoQixNQUFvQyxDQUFDLENBQXpDLEVBQTRDO0FBQzFDO0FBQ0Q7O0FBRUQsZUFBSyxPQUFMLENBQWEsSUFBYixFQUFtQixNQUFuQjtBQUNELFNBTkQ7QUFPRCxPQW5CRDs7QUFxQkEsY0FBUSxTQUFSLENBQWtCLHVCQUFsQixHQUE0QyxZQUFZO0FBQ3RELFlBQUksT0FBTyxJQUFYOztBQUVBLGFBQUssUUFBTCxDQUFjLEVBQWQsQ0FBaUIsR0FBakIsRUFBc0IsVUFBVSxJQUFWLEVBQWdCLE1BQWhCLEVBQXdCO0FBQzVDLGVBQUssT0FBTCxDQUFhLElBQWIsRUFBbUIsTUFBbkI7QUFDRCxTQUZEO0FBR0QsT0FORDs7QUFRQSxjQUFRLFNBQVIsQ0FBa0Isc0JBQWxCLEdBQTJDLFlBQVk7QUFDckQsWUFBSSxPQUFPLElBQVg7O0FBRUEsYUFBSyxPQUFMLENBQWEsRUFBYixDQUFnQixHQUFoQixFQUFxQixVQUFVLElBQVYsRUFBZ0IsTUFBaEIsRUFBd0I7QUFDM0MsZUFBSyxPQUFMLENBQWEsSUFBYixFQUFtQixNQUFuQjtBQUNELFNBRkQ7QUFHRCxPQU5EOztBQVFBLGNBQVEsU0FBUixDQUFrQixlQUFsQixHQUFvQyxZQUFZO0FBQzlDLFlBQUksT0FBTyxJQUFYOztBQUVBLGFBQUssRUFBTCxDQUFRLE1BQVIsRUFBZ0IsWUFBWTtBQUMxQixlQUFLLFVBQUwsQ0FBZ0IsUUFBaEIsQ0FBeUIseUJBQXpCO0FBQ0QsU0FGRDs7QUFJQSxhQUFLLEVBQUwsQ0FBUSxPQUFSLEVBQWlCLFlBQVk7QUFDM0IsZUFBSyxVQUFMLENBQWdCLFdBQWhCLENBQTRCLHlCQUE1QjtBQUNELFNBRkQ7O0FBSUEsYUFBSyxFQUFMLENBQVEsUUFBUixFQUFrQixZQUFZO0FBQzVCLGVBQUssVUFBTCxDQUFnQixXQUFoQixDQUE0Qiw2QkFBNUI7QUFDRCxTQUZEOztBQUlBLGFBQUssRUFBTCxDQUFRLFNBQVIsRUFBbUIsWUFBWTtBQUM3QixlQUFLLFVBQUwsQ0FBZ0IsUUFBaEIsQ0FBeUIsNkJBQXpCO0FBQ0QsU0FGRDs7QUFJQSxhQUFLLEVBQUwsQ0FBUSxNQUFSLEVBQWdCLFlBQVk7QUFDMUIsZUFBSyxVQUFMLENBQWdCLFdBQWhCLENBQTRCLDBCQUE1QjtBQUNELFNBRkQ7O0FBSUEsYUFBSyxFQUFMLENBQVEsT0FBUixFQUFpQixVQUFVLE1BQVYsRUFBa0I7QUFDakMsY0FBSSxDQUFDLEtBQUssTUFBTCxFQUFMLEVBQW9CO0FBQ2xCLGlCQUFLLE9BQUwsQ0FBYSxNQUFiLEVBQXFCLEVBQXJCO0FBQ0Q7O0FBRUQsZUFBSyxXQUFMLENBQWlCLEtBQWpCLENBQXVCLE1BQXZCLEVBQStCLFVBQVUsSUFBVixFQUFnQjtBQUM3QyxpQkFBSyxPQUFMLENBQWEsYUFBYixFQUE0QjtBQUMxQixvQkFBTSxJQURvQjtBQUUxQixxQkFBTztBQUZtQixhQUE1QjtBQUlELFdBTEQ7QUFNRCxTQVhEOztBQWFBLGFBQUssRUFBTCxDQUFRLGNBQVIsRUFBd0IsVUFBVSxNQUFWLEVBQWtCO0FBQ3hDLGVBQUssV0FBTCxDQUFpQixLQUFqQixDQUF1QixNQUF2QixFQUErQixVQUFVLElBQVYsRUFBZ0I7QUFDN0MsaUJBQUssT0FBTCxDQUFhLGdCQUFiLEVBQStCO0FBQzdCLG9CQUFNLElBRHVCO0FBRTdCLHFCQUFPO0FBRnNCLGFBQS9CO0FBSUQsV0FMRDtBQU1ELFNBUEQ7O0FBU0EsYUFBSyxFQUFMLENBQVEsVUFBUixFQUFvQixVQUFVLEdBQVYsRUFBZTtBQUNqQyxjQUFJLE1BQU0sSUFBSSxLQUFkOztBQUVBLGNBQUksS0FBSyxNQUFMLEVBQUosRUFBbUI7QUFDakIsZ0JBQUksUUFBUSxLQUFLLEdBQWIsSUFBb0IsUUFBUSxLQUFLLEdBQWpDLElBQ0MsUUFBUSxLQUFLLEVBQWIsSUFBbUIsSUFBSSxNQUQ1QixFQUNxQztBQUNuQyxtQkFBSyxLQUFMOztBQUVBLGtCQUFJLGNBQUo7QUFDRCxhQUxELE1BS08sSUFBSSxRQUFRLEtBQUssS0FBakIsRUFBd0I7QUFDN0IsbUJBQUssT0FBTCxDQUFhLGdCQUFiLEVBQStCLEVBQS9COztBQUVBLGtCQUFJLGNBQUo7QUFDRCxhQUpNLE1BSUEsSUFBSyxRQUFRLEtBQUssS0FBYixJQUFzQixJQUFJLE9BQS9CLEVBQXlDO0FBQzlDLG1CQUFLLE9BQUwsQ0FBYSxnQkFBYixFQUErQixFQUEvQjs7QUFFQSxrQkFBSSxjQUFKO0FBQ0QsYUFKTSxNQUlBLElBQUksUUFBUSxLQUFLLEVBQWpCLEVBQXFCO0FBQzFCLG1CQUFLLE9BQUwsQ0FBYSxrQkFBYixFQUFpQyxFQUFqQzs7QUFFQSxrQkFBSSxjQUFKO0FBQ0QsYUFKTSxNQUlBLElBQUksUUFBUSxLQUFLLElBQWpCLEVBQXVCO0FBQzVCLG1CQUFLLE9BQUwsQ0FBYSxjQUFiLEVBQTZCLEVBQTdCOztBQUVBLGtCQUFJLGNBQUo7QUFDRDtBQUNGLFdBdkJELE1BdUJPO0FBQ0wsZ0JBQUksUUFBUSxLQUFLLEtBQWIsSUFBc0IsUUFBUSxLQUFLLEtBQW5DLElBQ0MsUUFBUSxLQUFLLElBQWIsSUFBcUIsSUFBSSxNQUQ5QixFQUN1QztBQUNyQyxtQkFBSyxJQUFMOztBQUVBLGtCQUFJLGNBQUo7QUFDRDtBQUNGO0FBQ0YsU0FsQ0Q7QUFtQ0QsT0FoRkQ7O0FBa0ZBLGNBQVEsU0FBUixDQUFrQixlQUFsQixHQUFvQyxZQUFZO0FBQzlDLGFBQUssT0FBTCxDQUFhLEdBQWIsQ0FBaUIsVUFBakIsRUFBNkIsS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixVQUFuQixDQUE3Qjs7QUFFQSxZQUFJLEtBQUssT0FBTCxDQUFhLEdBQWIsQ0FBaUIsVUFBakIsQ0FBSixFQUFrQztBQUNoQyxjQUFJLEtBQUssTUFBTCxFQUFKLEVBQW1CO0FBQ2pCLGlCQUFLLEtBQUw7QUFDRDs7QUFFRCxlQUFLLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLEVBQXhCO0FBQ0QsU0FORCxNQU1PO0FBQ0wsZUFBSyxPQUFMLENBQWEsUUFBYixFQUF1QixFQUF2QjtBQUNEO0FBQ0YsT0FaRDs7QUFjQSxjQUFRLFNBQVIsQ0FBa0IsWUFBbEIsR0FBaUMsVUFBVSxHQUFWLEVBQWUsU0FBZixFQUEwQjtBQUN6RCxZQUFJLFVBQVUsS0FBZDtBQUNBLFlBQUksT0FBTyxJQUFYOztBQUVBO0FBQ0E7QUFDQSxZQUNFLE9BQU8sSUFBSSxNQUFYLElBQ0UsSUFBSSxNQUFKLENBQVcsUUFBWCxLQUF3QixRQUF4QixJQUFvQyxJQUFJLE1BQUosQ0FBVyxRQUFYLEtBQXdCLFVBRmhFLEVBSUU7QUFDQTtBQUNEOztBQUVELFlBQUksQ0FBQyxTQUFMLEVBQWdCO0FBQ2Q7QUFDQTtBQUNBLG9CQUFVLElBQVY7QUFDRCxTQUpELE1BSU8sSUFBSSxVQUFVLFVBQVYsSUFBd0IsVUFBVSxVQUFWLENBQXFCLE1BQXJCLEdBQThCLENBQTFELEVBQTZEO0FBQ2xFLGVBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxVQUFVLFVBQVYsQ0FBcUIsTUFBekMsRUFBaUQsR0FBakQsRUFBc0Q7QUFDcEQsZ0JBQUksT0FBTyxVQUFVLFVBQVYsQ0FBcUIsQ0FBckIsQ0FBWDs7QUFFQSxnQkFBSSxLQUFLLFFBQVQsRUFBbUI7QUFDakIsd0JBQVUsSUFBVjtBQUNEO0FBQ0Y7QUFDRixTQVJNLE1BUUEsSUFBSSxVQUFVLFlBQVYsSUFBMEIsVUFBVSxZQUFWLENBQXVCLE1BQXZCLEdBQWdDLENBQTlELEVBQWlFO0FBQ3RFLG9CQUFVLElBQVY7QUFDRDs7QUFFRDtBQUNBLFlBQUksT0FBSixFQUFhO0FBQ1gsZUFBSyxXQUFMLENBQWlCLE9BQWpCLENBQXlCLFVBQVUsV0FBVixFQUF1QjtBQUM5QyxpQkFBSyxPQUFMLENBQWEsa0JBQWIsRUFBaUM7QUFDL0Isb0JBQU07QUFEeUIsYUFBakM7QUFHRCxXQUpEO0FBS0Q7QUFDRixPQXRDRDs7QUF3Q0E7Ozs7QUFJQSxjQUFRLFNBQVIsQ0FBa0IsT0FBbEIsR0FBNEIsVUFBVSxJQUFWLEVBQWdCLElBQWhCLEVBQXNCO0FBQ2hELFlBQUksZ0JBQWdCLFFBQVEsU0FBUixDQUFrQixPQUF0QztBQUNBLFlBQUksZ0JBQWdCO0FBQ2xCLGtCQUFRLFNBRFU7QUFFbEIsbUJBQVMsU0FGUztBQUdsQixvQkFBVSxXQUhRO0FBSWxCLHNCQUFZO0FBSk0sU0FBcEI7O0FBT0EsWUFBSSxTQUFTLFNBQWIsRUFBd0I7QUFDdEIsaUJBQU8sRUFBUDtBQUNEOztBQUVELFlBQUksUUFBUSxhQUFaLEVBQTJCO0FBQ3pCLGNBQUksaUJBQWlCLGNBQWMsSUFBZCxDQUFyQjtBQUNBLGNBQUksaUJBQWlCO0FBQ25CLHVCQUFXLEtBRFE7QUFFbkIsa0JBQU0sSUFGYTtBQUduQixrQkFBTTtBQUhhLFdBQXJCOztBQU1BLHdCQUFjLElBQWQsQ0FBbUIsSUFBbkIsRUFBeUIsY0FBekIsRUFBeUMsY0FBekM7O0FBRUEsY0FBSSxlQUFlLFNBQW5CLEVBQThCO0FBQzVCLGlCQUFLLFNBQUwsR0FBaUIsSUFBakI7O0FBRUE7QUFDRDtBQUNGOztBQUVELHNCQUFjLElBQWQsQ0FBbUIsSUFBbkIsRUFBeUIsSUFBekIsRUFBK0IsSUFBL0I7QUFDRCxPQS9CRDs7QUFpQ0EsY0FBUSxTQUFSLENBQWtCLGNBQWxCLEdBQW1DLFlBQVk7QUFDN0MsWUFBSSxLQUFLLE9BQUwsQ0FBYSxHQUFiLENBQWlCLFVBQWpCLENBQUosRUFBa0M7QUFDaEM7QUFDRDs7QUFFRCxZQUFJLEtBQUssTUFBTCxFQUFKLEVBQW1CO0FBQ2pCLGVBQUssS0FBTDtBQUNELFNBRkQsTUFFTztBQUNMLGVBQUssSUFBTDtBQUNEO0FBQ0YsT0FWRDs7QUFZQSxjQUFRLFNBQVIsQ0FBa0IsSUFBbEIsR0FBeUIsWUFBWTtBQUNuQyxZQUFJLEtBQUssTUFBTCxFQUFKLEVBQW1CO0FBQ2pCO0FBQ0Q7O0FBRUQsYUFBSyxPQUFMLENBQWEsT0FBYixFQUFzQixFQUF0QjtBQUNELE9BTkQ7O0FBUUEsY0FBUSxTQUFSLENBQWtCLEtBQWxCLEdBQTBCLFlBQVk7QUFDcEMsWUFBSSxDQUFDLEtBQUssTUFBTCxFQUFMLEVBQW9CO0FBQ2xCO0FBQ0Q7O0FBRUQsYUFBSyxPQUFMLENBQWEsT0FBYixFQUFzQixFQUF0QjtBQUNELE9BTkQ7O0FBUUEsY0FBUSxTQUFSLENBQWtCLE1BQWxCLEdBQTJCLFlBQVk7QUFDckMsZUFBTyxLQUFLLFVBQUwsQ0FBZ0IsUUFBaEIsQ0FBeUIseUJBQXpCLENBQVA7QUFDRCxPQUZEOztBQUlBLGNBQVEsU0FBUixDQUFrQixRQUFsQixHQUE2QixZQUFZO0FBQ3ZDLGVBQU8sS0FBSyxVQUFMLENBQWdCLFFBQWhCLENBQXlCLDBCQUF6QixDQUFQO0FBQ0QsT0FGRDs7QUFJQSxjQUFRLFNBQVIsQ0FBa0IsS0FBbEIsR0FBMEIsVUFBVSxJQUFWLEVBQWdCO0FBQ3hDO0FBQ0EsWUFBSSxLQUFLLFFBQUwsRUFBSixFQUFxQjtBQUNuQjtBQUNEOztBQUVELGFBQUssVUFBTCxDQUFnQixRQUFoQixDQUF5QiwwQkFBekI7QUFDQSxhQUFLLE9BQUwsQ0FBYSxPQUFiLEVBQXNCLEVBQXRCO0FBQ0QsT0FSRDs7QUFVQSxjQUFRLFNBQVIsQ0FBa0IsTUFBbEIsR0FBMkIsVUFBVSxJQUFWLEVBQWdCO0FBQ3pDLFlBQUksS0FBSyxPQUFMLENBQWEsR0FBYixDQUFpQixPQUFqQixLQUE2QixPQUFPLE9BQXBDLElBQStDLFFBQVEsSUFBM0QsRUFBaUU7QUFDL0Qsa0JBQVEsSUFBUixDQUNFLHlFQUNBLHNFQURBLEdBRUEsV0FIRjtBQUtEOztBQUVELFlBQUksUUFBUSxJQUFSLElBQWdCLEtBQUssTUFBTCxLQUFnQixDQUFwQyxFQUF1QztBQUNyQyxpQkFBTyxDQUFDLElBQUQsQ0FBUDtBQUNEOztBQUVELFlBQUksV0FBVyxDQUFDLEtBQUssQ0FBTCxDQUFoQjs7QUFFQSxhQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLFVBQW5CLEVBQStCLFFBQS9CO0FBQ0QsT0FoQkQ7O0FBa0JBLGNBQVEsU0FBUixDQUFrQixJQUFsQixHQUF5QixZQUFZO0FBQ25DLFlBQUksS0FBSyxPQUFMLENBQWEsR0FBYixDQUFpQixPQUFqQixLQUNBLFVBQVUsTUFBVixHQUFtQixDQURuQixJQUN3QixPQUFPLE9BRC9CLElBQzBDLFFBQVEsSUFEdEQsRUFDNEQ7QUFDMUQsa0JBQVEsSUFBUixDQUNFLHFFQUNBLG1FQUZGO0FBSUQ7O0FBRUQsWUFBSSxPQUFPLEVBQVg7O0FBRUEsYUFBSyxXQUFMLENBQWlCLE9BQWpCLENBQXlCLFVBQVUsV0FBVixFQUF1QjtBQUM5QyxpQkFBTyxXQUFQO0FBQ0QsU0FGRDs7QUFJQSxlQUFPLElBQVA7QUFDRCxPQWhCRDs7QUFrQkEsY0FBUSxTQUFSLENBQWtCLEdBQWxCLEdBQXdCLFVBQVUsSUFBVixFQUFnQjtBQUN0QyxZQUFJLEtBQUssT0FBTCxDQUFhLEdBQWIsQ0FBaUIsT0FBakIsS0FBNkIsT0FBTyxPQUFwQyxJQUErQyxRQUFRLElBQTNELEVBQWlFO0FBQy9ELGtCQUFRLElBQVIsQ0FDRSx5RUFDQSxpRUFGRjtBQUlEOztBQUVELFlBQUksUUFBUSxJQUFSLElBQWdCLEtBQUssTUFBTCxLQUFnQixDQUFwQyxFQUF1QztBQUNyQyxpQkFBTyxLQUFLLFFBQUwsQ0FBYyxHQUFkLEVBQVA7QUFDRDs7QUFFRCxZQUFJLFNBQVMsS0FBSyxDQUFMLENBQWI7O0FBRUEsWUFBSSxFQUFFLE9BQUYsQ0FBVSxNQUFWLENBQUosRUFBdUI7QUFDckIsbUJBQVMsRUFBRSxHQUFGLENBQU0sTUFBTixFQUFjLFVBQVUsR0FBVixFQUFlO0FBQ3BDLG1CQUFPLElBQUksUUFBSixFQUFQO0FBQ0QsV0FGUSxDQUFUO0FBR0Q7O0FBRUQsYUFBSyxRQUFMLENBQWMsR0FBZCxDQUFrQixNQUFsQixFQUEwQixPQUExQixDQUFrQyxRQUFsQztBQUNELE9BckJEOztBQXVCQSxjQUFRLFNBQVIsQ0FBa0IsT0FBbEIsR0FBNEIsWUFBWTtBQUN0QyxhQUFLLFVBQUwsQ0FBZ0IsTUFBaEI7O0FBRUEsWUFBSSxLQUFLLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLFdBQXJCLEVBQWtDO0FBQ2hDLGVBQUssUUFBTCxDQUFjLENBQWQsRUFBaUIsV0FBakIsQ0FBNkIsa0JBQTdCLEVBQWlELEtBQUssTUFBdEQ7QUFDRDs7QUFFRCxZQUFJLEtBQUssU0FBTCxJQUFrQixJQUF0QixFQUE0QjtBQUMxQixlQUFLLFNBQUwsQ0FBZSxVQUFmO0FBQ0EsZUFBSyxTQUFMLEdBQWlCLElBQWpCO0FBQ0QsU0FIRCxNQUdPLElBQUksS0FBSyxRQUFMLENBQWMsQ0FBZCxFQUFpQixtQkFBckIsRUFBMEM7QUFDL0MsZUFBSyxRQUFMLENBQWMsQ0FBZCxFQUNHLG1CQURILENBQ3VCLGlCQUR2QixFQUMwQyxLQUFLLE1BRC9DLEVBQ3VELEtBRHZEO0FBRUEsZUFBSyxRQUFMLENBQWMsQ0FBZCxFQUNHLG1CQURILENBQ3VCLGlCQUR2QixFQUMwQyxLQUFLLE1BRC9DLEVBQ3VELEtBRHZEO0FBRUEsZUFBSyxRQUFMLENBQWMsQ0FBZCxFQUNHLG1CQURILENBQ3VCLGdCQUR2QixFQUN5QyxLQUFLLE1BRDlDLEVBQ3NELEtBRHREO0FBRUQ7O0FBRUQsYUFBSyxNQUFMLEdBQWMsSUFBZDtBQUNBLGFBQUssTUFBTCxHQUFjLElBQWQ7O0FBRUEsYUFBSyxRQUFMLENBQWMsR0FBZCxDQUFrQixVQUFsQjtBQUNBLGFBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsVUFBbkIsRUFBK0IsS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixjQUFuQixDQUEvQjs7QUFFQSxhQUFLLFFBQUwsQ0FBYyxXQUFkLENBQTBCLDJCQUExQjtBQUNBLGFBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsYUFBbkIsRUFBa0MsT0FBbEM7QUFDQSxhQUFLLFFBQUwsQ0FBYyxVQUFkLENBQXlCLFNBQXpCOztBQUVBLGFBQUssV0FBTCxDQUFpQixPQUFqQjtBQUNBLGFBQUssU0FBTCxDQUFlLE9BQWY7QUFDQSxhQUFLLFFBQUwsQ0FBYyxPQUFkO0FBQ0EsYUFBSyxPQUFMLENBQWEsT0FBYjs7QUFFQSxhQUFLLFdBQUwsR0FBbUIsSUFBbkI7QUFDQSxhQUFLLFNBQUwsR0FBaUIsSUFBakI7QUFDQSxhQUFLLFFBQUwsR0FBZ0IsSUFBaEI7QUFDQSxhQUFLLE9BQUwsR0FBZSxJQUFmO0FBQ0QsT0F0Q0Q7O0FBd0NBLGNBQVEsU0FBUixDQUFrQixNQUFsQixHQUEyQixZQUFZO0FBQ3JDLFlBQUksYUFBYSxFQUNmLDZDQUNFLGlDQURGLEdBRUUsMkRBRkYsR0FHQSxTQUplLENBQWpCOztBQU9BLG1CQUFXLElBQVgsQ0FBZ0IsS0FBaEIsRUFBdUIsS0FBSyxPQUFMLENBQWEsR0FBYixDQUFpQixLQUFqQixDQUF2Qjs7QUFFQSxhQUFLLFVBQUwsR0FBa0IsVUFBbEI7O0FBRUEsYUFBSyxVQUFMLENBQWdCLFFBQWhCLENBQXlCLHdCQUF3QixLQUFLLE9BQUwsQ0FBYSxHQUFiLENBQWlCLE9BQWpCLENBQWpEOztBQUVBLG1CQUFXLElBQVgsQ0FBZ0IsU0FBaEIsRUFBMkIsS0FBSyxRQUFoQzs7QUFFQSxlQUFPLFVBQVA7QUFDRCxPQWpCRDs7QUFtQkEsYUFBTyxPQUFQO0FBQ0QsS0FubUJEOztBQXFtQkEsT0FBRyxNQUFILENBQVUsbUJBQVYsRUFBOEIsQ0FDNUIsUUFENEIsQ0FBOUIsRUFFRyxVQUFVLENBQVYsRUFBYTtBQUNkO0FBQ0EsYUFBTyxDQUFQO0FBQ0QsS0FMRDs7QUFPQSxPQUFHLE1BQUgsQ0FBVSxnQkFBVixFQUEyQixDQUN6QixRQUR5QixFQUV6QixtQkFGeUIsRUFJekIsZ0JBSnlCLEVBS3pCLG9CQUx5QixDQUEzQixFQU1HLFVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsT0FBaEIsRUFBeUIsUUFBekIsRUFBbUM7QUFDcEMsVUFBSSxFQUFFLEVBQUYsQ0FBSyxPQUFMLElBQWdCLElBQXBCLEVBQTBCO0FBQ3hCO0FBQ0EsWUFBSSxjQUFjLENBQUMsTUFBRCxFQUFTLE9BQVQsRUFBa0IsU0FBbEIsQ0FBbEI7O0FBRUEsVUFBRSxFQUFGLENBQUssT0FBTCxHQUFlLFVBQVUsT0FBVixFQUFtQjtBQUNoQyxvQkFBVSxXQUFXLEVBQXJCOztBQUVBLGNBQUksUUFBTyxPQUFQLHlDQUFPLE9BQVAsT0FBbUIsUUFBdkIsRUFBaUM7QUFDL0IsaUJBQUssSUFBTCxDQUFVLFlBQVk7QUFDcEIsa0JBQUksa0JBQWtCLEVBQUUsTUFBRixDQUFTLElBQVQsRUFBZSxFQUFmLEVBQW1CLE9BQW5CLENBQXRCOztBQUVBLGtCQUFJLFdBQVcsSUFBSSxPQUFKLENBQVksRUFBRSxJQUFGLENBQVosRUFBcUIsZUFBckIsQ0FBZjtBQUNELGFBSkQ7O0FBTUEsbUJBQU8sSUFBUDtBQUNELFdBUkQsTUFRTyxJQUFJLE9BQU8sT0FBUCxLQUFtQixRQUF2QixFQUFpQztBQUN0QyxnQkFBSSxHQUFKO0FBQ0EsZ0JBQUksT0FBTyxNQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0IsSUFBdEIsQ0FBMkIsU0FBM0IsRUFBc0MsQ0FBdEMsQ0FBWDs7QUFFQSxpQkFBSyxJQUFMLENBQVUsWUFBWTtBQUNwQixrQkFBSSxXQUFXLEVBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxTQUFiLENBQWY7O0FBRUEsa0JBQUksWUFBWSxJQUFaLElBQW9CLE9BQU8sT0FBM0IsSUFBc0MsUUFBUSxLQUFsRCxFQUF5RDtBQUN2RCx3QkFBUSxLQUFSLENBQ0UsbUJBQW1CLE9BQW5CLEdBQTZCLDhCQUE3QixHQUNBLG9DQUZGO0FBSUQ7O0FBRUQsb0JBQU0sU0FBUyxPQUFULEVBQWtCLEtBQWxCLENBQXdCLFFBQXhCLEVBQWtDLElBQWxDLENBQU47QUFDRCxhQVhEOztBQWFBO0FBQ0EsZ0JBQUksRUFBRSxPQUFGLENBQVUsT0FBVixFQUFtQixXQUFuQixJQUFrQyxDQUFDLENBQXZDLEVBQTBDO0FBQ3hDLHFCQUFPLElBQVA7QUFDRDs7QUFFRCxtQkFBTyxHQUFQO0FBQ0QsV0F2Qk0sTUF1QkE7QUFDTCxrQkFBTSxJQUFJLEtBQUosQ0FBVSxvQ0FBb0MsT0FBOUMsQ0FBTjtBQUNEO0FBQ0YsU0FyQ0Q7QUFzQ0Q7O0FBRUQsVUFBSSxFQUFFLEVBQUYsQ0FBSyxPQUFMLENBQWEsUUFBYixJQUF5QixJQUE3QixFQUFtQztBQUNqQyxVQUFFLEVBQUYsQ0FBSyxPQUFMLENBQWEsUUFBYixHQUF3QixRQUF4QjtBQUNEOztBQUVELGFBQU8sT0FBUDtBQUNELEtBeEREOztBQTBERTtBQUNBLFdBQU87QUFDTCxjQUFRLEdBQUcsTUFETjtBQUVMLGVBQVMsR0FBRztBQUZQLEtBQVA7QUFJRCxHQXhqTEEsRUFEQzs7QUEyakxBO0FBQ0E7QUFDQSxNQUFJLFVBQVUsR0FBRyxPQUFILENBQVcsZ0JBQVgsQ0FBZDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFPLEVBQVAsQ0FBVSxPQUFWLENBQWtCLEdBQWxCLEdBQXdCLEVBQXhCOztBQUVBO0FBQ0EsU0FBTyxPQUFQO0FBQ0QsQ0E1a0xBLENBQUQ7Ozs7Ozs7QUNQQTs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQTtBQUNDLFdBQVMsT0FBVCxFQUFrQjtBQUNmOztBQUNBLFlBQVEsTUFBUjtBQUVILENBSkEsRUFJQyxVQUFTLENBQVQsRUFBWTtBQUNWOztBQUNBLFFBQUksUUFBUSxPQUFPLEtBQVAsSUFBZ0IsRUFBNUI7O0FBRUEsWUFBUyxZQUFXOztBQUVoQixZQUFJLGNBQWMsQ0FBbEI7O0FBRUEsaUJBQVMsS0FBVCxDQUFlLE9BQWYsRUFBd0IsUUFBeEIsRUFBa0M7O0FBRTlCLGdCQUFJLElBQUksSUFBUjtBQUFBLGdCQUFjLFlBQWQ7O0FBRUEsY0FBRSxRQUFGLEdBQWE7QUFDVCwrQkFBZSxJQUROO0FBRVQsZ0NBQWdCLEtBRlA7QUFHVCw4QkFBYyxFQUFFLE9BQUYsQ0FITDtBQUlULDRCQUFZLEVBQUUsT0FBRixDQUpIO0FBS1Qsd0JBQVEsSUFMQztBQU1ULDBCQUFVLElBTkQ7QUFPVCwyQkFBVyw4SEFQRjtBQVFULDJCQUFXLHNIQVJGO0FBU1QsMEJBQVUsS0FURDtBQVVULCtCQUFlLElBVk47QUFXVCw0QkFBWSxLQVhIO0FBWVQsK0JBQWUsTUFaTjtBQWFULHlCQUFTLE1BYkE7QUFjVCw4QkFBYyxzQkFBUyxNQUFULEVBQWlCLENBQWpCLEVBQW9CO0FBQzlCLDJCQUFPLEVBQUUsc0VBQUYsRUFBMEUsSUFBMUUsQ0FBK0UsSUFBSSxDQUFuRixDQUFQO0FBQ0gsaUJBaEJRO0FBaUJULHNCQUFNLEtBakJHO0FBa0JULDJCQUFXLFlBbEJGO0FBbUJULDJCQUFXLElBbkJGO0FBb0JULHdCQUFRLFFBcEJDO0FBcUJULDhCQUFjLElBckJMO0FBc0JULHNCQUFNLEtBdEJHO0FBdUJULCtCQUFlLEtBdkJOO0FBd0JULDBCQUFVLElBeEJEO0FBeUJULDhCQUFjLENBekJMO0FBMEJULDBCQUFVLFVBMUJEO0FBMkJULDZCQUFhLEtBM0JKO0FBNEJULDhCQUFjLElBNUJMO0FBNkJULDhCQUFjLElBN0JMO0FBOEJULGtDQUFrQixLQTlCVDtBQStCVCwyQkFBVyxRQS9CRjtBQWdDVCw0QkFBWSxJQWhDSDtBQWlDVCxzQkFBTSxDQWpDRztBQWtDVCxxQkFBSyxLQWxDSTtBQW1DVCx1QkFBTyxFQW5DRTtBQW9DVCw4QkFBYyxDQXBDTDtBQXFDVCw4QkFBYyxDQXJDTDtBQXNDVCxnQ0FBZ0IsQ0F0Q1A7QUF1Q1QsdUJBQU8sR0F2Q0U7QUF3Q1QsdUJBQU8sSUF4Q0U7QUF5Q1QsOEJBQWMsS0F6Q0w7QUEwQ1QsMkJBQVcsSUExQ0Y7QUEyQ1QsZ0NBQWdCLENBM0NQO0FBNENULHdCQUFRLElBNUNDO0FBNkNULDhCQUFjLElBN0NMO0FBOENULCtCQUFlLEtBOUNOO0FBK0NULDBCQUFVLEtBL0NEO0FBZ0RULGlDQUFpQixLQWhEUjtBQWlEVCxnQ0FBZ0IsSUFqRFA7QUFrRFQsd0JBQVE7QUFsREMsYUFBYjs7QUFxREEsY0FBRSxRQUFGLEdBQWE7QUFDVCwyQkFBVyxLQURGO0FBRVQsMEJBQVUsS0FGRDtBQUdULCtCQUFlLElBSE47QUFJVCxrQ0FBa0IsQ0FKVDtBQUtULDZCQUFhLElBTEo7QUFNVCw4QkFBYyxDQU5MO0FBT1QsMkJBQVcsQ0FQRjtBQVFULHVCQUFPLElBUkU7QUFTVCwyQkFBVyxJQVRGO0FBVVQsNEJBQVksSUFWSDtBQVdULDJCQUFXLENBWEY7QUFZVCw0QkFBWSxJQVpIO0FBYVQsNEJBQVksSUFiSDtBQWNULDRCQUFZLElBZEg7QUFlVCw0QkFBWSxJQWZIO0FBZ0JULDZCQUFhLElBaEJKO0FBaUJULHlCQUFTLElBakJBO0FBa0JULHlCQUFTLEtBbEJBO0FBbUJULDZCQUFhLENBbkJKO0FBb0JULDJCQUFXLElBcEJGO0FBcUJULHVCQUFPLElBckJFO0FBc0JULDZCQUFhLEVBdEJKO0FBdUJULG1DQUFtQixLQXZCVjtBQXdCVCwyQkFBVztBQXhCRixhQUFiOztBQTJCQSxjQUFFLE1BQUYsQ0FBUyxDQUFULEVBQVksRUFBRSxRQUFkOztBQUVBLGNBQUUsZ0JBQUYsR0FBcUIsSUFBckI7QUFDQSxjQUFFLFFBQUYsR0FBYSxJQUFiO0FBQ0EsY0FBRSxRQUFGLEdBQWEsSUFBYjtBQUNBLGNBQUUsV0FBRixHQUFnQixFQUFoQjtBQUNBLGNBQUUsa0JBQUYsR0FBdUIsRUFBdkI7QUFDQSxjQUFFLGNBQUYsR0FBbUIsS0FBbkI7QUFDQSxjQUFFLFFBQUYsR0FBYSxLQUFiO0FBQ0EsY0FBRSxXQUFGLEdBQWdCLEtBQWhCO0FBQ0EsY0FBRSxNQUFGLEdBQVcsUUFBWDtBQUNBLGNBQUUsTUFBRixHQUFXLElBQVg7QUFDQSxjQUFFLFlBQUYsR0FBaUIsSUFBakI7QUFDQSxjQUFFLFNBQUYsR0FBYyxJQUFkO0FBQ0EsY0FBRSxRQUFGLEdBQWEsQ0FBYjtBQUNBLGNBQUUsV0FBRixHQUFnQixJQUFoQjtBQUNBLGNBQUUsT0FBRixHQUFZLEVBQUUsT0FBRixDQUFaO0FBQ0EsY0FBRSxZQUFGLEdBQWlCLElBQWpCO0FBQ0EsY0FBRSxhQUFGLEdBQWtCLElBQWxCO0FBQ0EsY0FBRSxjQUFGLEdBQW1CLElBQW5CO0FBQ0EsY0FBRSxnQkFBRixHQUFxQixrQkFBckI7QUFDQSxjQUFFLFdBQUYsR0FBZ0IsQ0FBaEI7QUFDQSxjQUFFLFdBQUYsR0FBZ0IsSUFBaEI7O0FBRUEsMkJBQWUsRUFBRSxPQUFGLEVBQVcsSUFBWCxDQUFnQixPQUFoQixLQUE0QixFQUEzQzs7QUFFQSxjQUFFLE9BQUYsR0FBWSxFQUFFLE1BQUYsQ0FBUyxFQUFULEVBQWEsRUFBRSxRQUFmLEVBQXlCLFFBQXpCLEVBQW1DLFlBQW5DLENBQVo7O0FBRUEsY0FBRSxZQUFGLEdBQWlCLEVBQUUsT0FBRixDQUFVLFlBQTNCOztBQUVBLGNBQUUsZ0JBQUYsR0FBcUIsRUFBRSxPQUF2Qjs7QUFFQSxnQkFBSSxPQUFPLFNBQVMsU0FBaEIsS0FBOEIsV0FBbEMsRUFBK0M7QUFDM0Msa0JBQUUsTUFBRixHQUFXLFdBQVg7QUFDQSxrQkFBRSxnQkFBRixHQUFxQixxQkFBckI7QUFDSCxhQUhELE1BR08sSUFBSSxPQUFPLFNBQVMsWUFBaEIsS0FBaUMsV0FBckMsRUFBa0Q7QUFDckQsa0JBQUUsTUFBRixHQUFXLGNBQVg7QUFDQSxrQkFBRSxnQkFBRixHQUFxQix3QkFBckI7QUFDSDs7QUFFRCxjQUFFLFFBQUYsR0FBYSxFQUFFLEtBQUYsQ0FBUSxFQUFFLFFBQVYsRUFBb0IsQ0FBcEIsQ0FBYjtBQUNBLGNBQUUsYUFBRixHQUFrQixFQUFFLEtBQUYsQ0FBUSxFQUFFLGFBQVYsRUFBeUIsQ0FBekIsQ0FBbEI7QUFDQSxjQUFFLGdCQUFGLEdBQXFCLEVBQUUsS0FBRixDQUFRLEVBQUUsZ0JBQVYsRUFBNEIsQ0FBNUIsQ0FBckI7QUFDQSxjQUFFLFdBQUYsR0FBZ0IsRUFBRSxLQUFGLENBQVEsRUFBRSxXQUFWLEVBQXVCLENBQXZCLENBQWhCO0FBQ0EsY0FBRSxZQUFGLEdBQWlCLEVBQUUsS0FBRixDQUFRLEVBQUUsWUFBVixFQUF3QixDQUF4QixDQUFqQjtBQUNBLGNBQUUsYUFBRixHQUFrQixFQUFFLEtBQUYsQ0FBUSxFQUFFLGFBQVYsRUFBeUIsQ0FBekIsQ0FBbEI7QUFDQSxjQUFFLFdBQUYsR0FBZ0IsRUFBRSxLQUFGLENBQVEsRUFBRSxXQUFWLEVBQXVCLENBQXZCLENBQWhCO0FBQ0EsY0FBRSxZQUFGLEdBQWlCLEVBQUUsS0FBRixDQUFRLEVBQUUsWUFBVixFQUF3QixDQUF4QixDQUFqQjtBQUNBLGNBQUUsV0FBRixHQUFnQixFQUFFLEtBQUYsQ0FBUSxFQUFFLFdBQVYsRUFBdUIsQ0FBdkIsQ0FBaEI7QUFDQSxjQUFFLFVBQUYsR0FBZSxFQUFFLEtBQUYsQ0FBUSxFQUFFLFVBQVYsRUFBc0IsQ0FBdEIsQ0FBZjs7QUFFQSxjQUFFLFdBQUYsR0FBZ0IsYUFBaEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBRSxRQUFGLEdBQWEsMkJBQWI7O0FBR0EsY0FBRSxtQkFBRjtBQUNBLGNBQUUsSUFBRixDQUFPLElBQVA7QUFFSDs7QUFFRCxlQUFPLEtBQVA7QUFFSCxLQTFKUSxFQUFUOztBQTRKQSxVQUFNLFNBQU4sQ0FBZ0IsV0FBaEIsR0FBOEIsWUFBVztBQUNyQyxZQUFJLElBQUksSUFBUjs7QUFFQSxVQUFFLFdBQUYsQ0FBYyxJQUFkLENBQW1CLGVBQW5CLEVBQW9DLElBQXBDLENBQXlDO0FBQ3JDLDJCQUFlO0FBRHNCLFNBQXpDLEVBRUcsSUFGSCxDQUVRLDBCQUZSLEVBRW9DLElBRnBDLENBRXlDO0FBQ3JDLHdCQUFZO0FBRHlCLFNBRnpDO0FBTUgsS0FURDs7QUFXQSxVQUFNLFNBQU4sQ0FBZ0IsUUFBaEIsR0FBMkIsTUFBTSxTQUFOLENBQWdCLFFBQWhCLEdBQTJCLFVBQVMsTUFBVCxFQUFpQixLQUFqQixFQUF3QixTQUF4QixFQUFtQzs7QUFFckYsWUFBSSxJQUFJLElBQVI7O0FBRUEsWUFBSSxPQUFPLEtBQVAsS0FBa0IsU0FBdEIsRUFBaUM7QUFDN0Isd0JBQVksS0FBWjtBQUNBLG9CQUFRLElBQVI7QUFDSCxTQUhELE1BR08sSUFBSSxRQUFRLENBQVIsSUFBYyxTQUFTLEVBQUUsVUFBN0IsRUFBMEM7QUFDN0MsbUJBQU8sS0FBUDtBQUNIOztBQUVELFVBQUUsTUFBRjs7QUFFQSxZQUFJLE9BQU8sS0FBUCxLQUFrQixRQUF0QixFQUFnQztBQUM1QixnQkFBSSxVQUFVLENBQVYsSUFBZSxFQUFFLE9BQUYsQ0FBVSxNQUFWLEtBQXFCLENBQXhDLEVBQTJDO0FBQ3ZDLGtCQUFFLE1BQUYsRUFBVSxRQUFWLENBQW1CLEVBQUUsV0FBckI7QUFDSCxhQUZELE1BRU8sSUFBSSxTQUFKLEVBQWU7QUFDbEIsa0JBQUUsTUFBRixFQUFVLFlBQVYsQ0FBdUIsRUFBRSxPQUFGLENBQVUsRUFBVixDQUFhLEtBQWIsQ0FBdkI7QUFDSCxhQUZNLE1BRUE7QUFDSCxrQkFBRSxNQUFGLEVBQVUsV0FBVixDQUFzQixFQUFFLE9BQUYsQ0FBVSxFQUFWLENBQWEsS0FBYixDQUF0QjtBQUNIO0FBQ0osU0FSRCxNQVFPO0FBQ0gsZ0JBQUksY0FBYyxJQUFsQixFQUF3QjtBQUNwQixrQkFBRSxNQUFGLEVBQVUsU0FBVixDQUFvQixFQUFFLFdBQXRCO0FBQ0gsYUFGRCxNQUVPO0FBQ0gsa0JBQUUsTUFBRixFQUFVLFFBQVYsQ0FBbUIsRUFBRSxXQUFyQjtBQUNIO0FBQ0o7O0FBRUQsVUFBRSxPQUFGLEdBQVksRUFBRSxXQUFGLENBQWMsUUFBZCxDQUF1QixLQUFLLE9BQUwsQ0FBYSxLQUFwQyxDQUFaOztBQUVBLFVBQUUsV0FBRixDQUFjLFFBQWQsQ0FBdUIsS0FBSyxPQUFMLENBQWEsS0FBcEMsRUFBMkMsTUFBM0M7O0FBRUEsVUFBRSxXQUFGLENBQWMsTUFBZCxDQUFxQixFQUFFLE9BQXZCOztBQUVBLFVBQUUsT0FBRixDQUFVLElBQVYsQ0FBZSxVQUFTLEtBQVQsRUFBZ0IsT0FBaEIsRUFBeUI7QUFDcEMsY0FBRSxPQUFGLEVBQVcsSUFBWCxDQUFnQixrQkFBaEIsRUFBb0MsS0FBcEM7QUFDSCxTQUZEOztBQUlBLFVBQUUsWUFBRixHQUFpQixFQUFFLE9BQW5COztBQUVBLFVBQUUsTUFBRjtBQUVILEtBM0NEOztBQTZDQSxVQUFNLFNBQU4sQ0FBZ0IsYUFBaEIsR0FBZ0MsWUFBVztBQUN2QyxZQUFJLElBQUksSUFBUjtBQUNBLFlBQUksRUFBRSxPQUFGLENBQVUsWUFBVixLQUEyQixDQUEzQixJQUFnQyxFQUFFLE9BQUYsQ0FBVSxjQUFWLEtBQTZCLElBQTdELElBQXFFLEVBQUUsT0FBRixDQUFVLFFBQVYsS0FBdUIsS0FBaEcsRUFBdUc7QUFDbkcsZ0JBQUksZUFBZSxFQUFFLE9BQUYsQ0FBVSxFQUFWLENBQWEsRUFBRSxZQUFmLEVBQTZCLFdBQTdCLENBQXlDLElBQXpDLENBQW5CO0FBQ0EsY0FBRSxLQUFGLENBQVEsT0FBUixDQUFnQjtBQUNaLHdCQUFRO0FBREksYUFBaEIsRUFFRyxFQUFFLE9BQUYsQ0FBVSxLQUZiO0FBR0g7QUFDSixLQVJEOztBQVVBLFVBQU0sU0FBTixDQUFnQixZQUFoQixHQUErQixVQUFTLFVBQVQsRUFBcUIsUUFBckIsRUFBK0I7O0FBRTFELFlBQUksWUFBWSxFQUFoQjtBQUFBLFlBQ0ksSUFBSSxJQURSOztBQUdBLFVBQUUsYUFBRjs7QUFFQSxZQUFJLEVBQUUsT0FBRixDQUFVLEdBQVYsS0FBa0IsSUFBbEIsSUFBMEIsRUFBRSxPQUFGLENBQVUsUUFBVixLQUF1QixLQUFyRCxFQUE0RDtBQUN4RCx5QkFBYSxDQUFDLFVBQWQ7QUFDSDtBQUNELFlBQUksRUFBRSxpQkFBRixLQUF3QixLQUE1QixFQUFtQztBQUMvQixnQkFBSSxFQUFFLE9BQUYsQ0FBVSxRQUFWLEtBQXVCLEtBQTNCLEVBQWtDO0FBQzlCLGtCQUFFLFdBQUYsQ0FBYyxPQUFkLENBQXNCO0FBQ2xCLDBCQUFNO0FBRFksaUJBQXRCLEVBRUcsRUFBRSxPQUFGLENBQVUsS0FGYixFQUVvQixFQUFFLE9BQUYsQ0FBVSxNQUY5QixFQUVzQyxRQUZ0QztBQUdILGFBSkQsTUFJTztBQUNILGtCQUFFLFdBQUYsQ0FBYyxPQUFkLENBQXNCO0FBQ2xCLHlCQUFLO0FBRGEsaUJBQXRCLEVBRUcsRUFBRSxPQUFGLENBQVUsS0FGYixFQUVvQixFQUFFLE9BQUYsQ0FBVSxNQUY5QixFQUVzQyxRQUZ0QztBQUdIO0FBRUosU0FYRCxNQVdPOztBQUVILGdCQUFJLEVBQUUsY0FBRixLQUFxQixLQUF6QixFQUFnQztBQUM1QixvQkFBSSxFQUFFLE9BQUYsQ0FBVSxHQUFWLEtBQWtCLElBQXRCLEVBQTRCO0FBQ3hCLHNCQUFFLFdBQUYsR0FBZ0IsQ0FBRSxFQUFFLFdBQXBCO0FBQ0g7QUFDRCxrQkFBRTtBQUNFLCtCQUFXLEVBQUU7QUFEZixpQkFBRixFQUVHLE9BRkgsQ0FFVztBQUNQLCtCQUFXO0FBREosaUJBRlgsRUFJRztBQUNDLDhCQUFVLEVBQUUsT0FBRixDQUFVLEtBRHJCO0FBRUMsNEJBQVEsRUFBRSxPQUFGLENBQVUsTUFGbkI7QUFHQywwQkFBTSxjQUFTLEdBQVQsRUFBYztBQUNoQiw4QkFBTSxLQUFLLElBQUwsQ0FBVSxHQUFWLENBQU47QUFDQSw0QkFBSSxFQUFFLE9BQUYsQ0FBVSxRQUFWLEtBQXVCLEtBQTNCLEVBQWtDO0FBQzlCLHNDQUFVLEVBQUUsUUFBWixJQUF3QixlQUNwQixHQURvQixHQUNkLFVBRFY7QUFFQSw4QkFBRSxXQUFGLENBQWMsR0FBZCxDQUFrQixTQUFsQjtBQUNILHlCQUpELE1BSU87QUFDSCxzQ0FBVSxFQUFFLFFBQVosSUFBd0IsbUJBQ3BCLEdBRG9CLEdBQ2QsS0FEVjtBQUVBLDhCQUFFLFdBQUYsQ0FBYyxHQUFkLENBQWtCLFNBQWxCO0FBQ0g7QUFDSixxQkFkRjtBQWVDLDhCQUFVLG9CQUFXO0FBQ2pCLDRCQUFJLFFBQUosRUFBYztBQUNWLHFDQUFTLElBQVQ7QUFDSDtBQUNKO0FBbkJGLGlCQUpIO0FBMEJILGFBOUJELE1BOEJPOztBQUVILGtCQUFFLGVBQUY7QUFDQSw2QkFBYSxLQUFLLElBQUwsQ0FBVSxVQUFWLENBQWI7O0FBRUEsb0JBQUksRUFBRSxPQUFGLENBQVUsUUFBVixLQUF1QixLQUEzQixFQUFrQztBQUM5Qiw4QkFBVSxFQUFFLFFBQVosSUFBd0IsaUJBQWlCLFVBQWpCLEdBQThCLGVBQXREO0FBQ0gsaUJBRkQsTUFFTztBQUNILDhCQUFVLEVBQUUsUUFBWixJQUF3QixxQkFBcUIsVUFBckIsR0FBa0MsVUFBMUQ7QUFDSDtBQUNELGtCQUFFLFdBQUYsQ0FBYyxHQUFkLENBQWtCLFNBQWxCOztBQUVBLG9CQUFJLFFBQUosRUFBYztBQUNWLCtCQUFXLFlBQVc7O0FBRWxCLDBCQUFFLGlCQUFGOztBQUVBLGlDQUFTLElBQVQ7QUFDSCxxQkFMRCxFQUtHLEVBQUUsT0FBRixDQUFVLEtBTGI7QUFNSDtBQUVKO0FBRUo7QUFFSixLQTlFRDs7QUFnRkEsVUFBTSxTQUFOLENBQWdCLFlBQWhCLEdBQStCLFlBQVc7O0FBRXRDLFlBQUksSUFBSSxJQUFSO0FBQUEsWUFDSSxXQUFXLEVBQUUsT0FBRixDQUFVLFFBRHpCOztBQUdBLFlBQUssWUFBWSxhQUFhLElBQTlCLEVBQXFDO0FBQ2pDLHVCQUFXLEVBQUUsUUFBRixFQUFZLEdBQVosQ0FBZ0IsRUFBRSxPQUFsQixDQUFYO0FBQ0g7O0FBRUQsZUFBTyxRQUFQO0FBRUgsS0FYRDs7QUFhQSxVQUFNLFNBQU4sQ0FBZ0IsUUFBaEIsR0FBMkIsVUFBUyxLQUFULEVBQWdCOztBQUV2QyxZQUFJLElBQUksSUFBUjtBQUFBLFlBQ0ksV0FBVyxFQUFFLFlBQUYsRUFEZjs7QUFHQSxZQUFLLGFBQWEsSUFBYixJQUFxQixRQUFPLFFBQVAseUNBQU8sUUFBUCxPQUFvQixRQUE5QyxFQUF5RDtBQUNyRCxxQkFBUyxJQUFULENBQWMsWUFBVztBQUNyQixvQkFBSSxTQUFTLEVBQUUsSUFBRixFQUFRLEtBQVIsQ0FBYyxVQUFkLENBQWI7QUFDQSxvQkFBRyxDQUFDLE9BQU8sU0FBWCxFQUFzQjtBQUNsQiwyQkFBTyxZQUFQLENBQW9CLEtBQXBCLEVBQTJCLElBQTNCO0FBQ0g7QUFDSixhQUxEO0FBTUg7QUFFSixLQWREOztBQWdCQSxVQUFNLFNBQU4sQ0FBZ0IsZUFBaEIsR0FBa0MsVUFBUyxLQUFULEVBQWdCOztBQUU5QyxZQUFJLElBQUksSUFBUjtBQUFBLFlBQ0ksYUFBYSxFQURqQjs7QUFHQSxZQUFJLEVBQUUsT0FBRixDQUFVLElBQVYsS0FBbUIsS0FBdkIsRUFBOEI7QUFDMUIsdUJBQVcsRUFBRSxjQUFiLElBQStCLEVBQUUsYUFBRixHQUFrQixHQUFsQixHQUF3QixFQUFFLE9BQUYsQ0FBVSxLQUFsQyxHQUEwQyxLQUExQyxHQUFrRCxFQUFFLE9BQUYsQ0FBVSxPQUEzRjtBQUNILFNBRkQsTUFFTztBQUNILHVCQUFXLEVBQUUsY0FBYixJQUErQixhQUFhLEVBQUUsT0FBRixDQUFVLEtBQXZCLEdBQStCLEtBQS9CLEdBQXVDLEVBQUUsT0FBRixDQUFVLE9BQWhGO0FBQ0g7O0FBRUQsWUFBSSxFQUFFLE9BQUYsQ0FBVSxJQUFWLEtBQW1CLEtBQXZCLEVBQThCO0FBQzFCLGNBQUUsV0FBRixDQUFjLEdBQWQsQ0FBa0IsVUFBbEI7QUFDSCxTQUZELE1BRU87QUFDSCxjQUFFLE9BQUYsQ0FBVSxFQUFWLENBQWEsS0FBYixFQUFvQixHQUFwQixDQUF3QixVQUF4QjtBQUNIO0FBRUosS0FqQkQ7O0FBbUJBLFVBQU0sU0FBTixDQUFnQixRQUFoQixHQUEyQixZQUFXOztBQUVsQyxZQUFJLElBQUksSUFBUjs7QUFFQSxVQUFFLGFBQUY7O0FBRUEsWUFBSyxFQUFFLFVBQUYsR0FBZSxFQUFFLE9BQUYsQ0FBVSxZQUE5QixFQUE2QztBQUN6QyxjQUFFLGFBQUYsR0FBa0IsWUFBYSxFQUFFLGdCQUFmLEVBQWlDLEVBQUUsT0FBRixDQUFVLGFBQTNDLENBQWxCO0FBQ0g7QUFFSixLQVZEOztBQVlBLFVBQU0sU0FBTixDQUFnQixhQUFoQixHQUFnQyxZQUFXOztBQUV2QyxZQUFJLElBQUksSUFBUjs7QUFFQSxZQUFJLEVBQUUsYUFBTixFQUFxQjtBQUNqQiwwQkFBYyxFQUFFLGFBQWhCO0FBQ0g7QUFFSixLQVJEOztBQVVBLFVBQU0sU0FBTixDQUFnQixnQkFBaEIsR0FBbUMsWUFBVzs7QUFFMUMsWUFBSSxJQUFJLElBQVI7QUFBQSxZQUNJLFVBQVUsRUFBRSxZQUFGLEdBQWlCLEVBQUUsT0FBRixDQUFVLGNBRHpDOztBQUdBLFlBQUssQ0FBQyxFQUFFLE1BQUgsSUFBYSxDQUFDLEVBQUUsV0FBaEIsSUFBK0IsQ0FBQyxFQUFFLFFBQXZDLEVBQWtEOztBQUU5QyxnQkFBSyxFQUFFLE9BQUYsQ0FBVSxRQUFWLEtBQXVCLEtBQTVCLEVBQW9DOztBQUVoQyxvQkFBSyxFQUFFLFNBQUYsS0FBZ0IsQ0FBaEIsSUFBdUIsRUFBRSxZQUFGLEdBQWlCLENBQW5CLEtBQTZCLEVBQUUsVUFBRixHQUFlLENBQXRFLEVBQTJFO0FBQ3ZFLHNCQUFFLFNBQUYsR0FBYyxDQUFkO0FBQ0gsaUJBRkQsTUFJSyxJQUFLLEVBQUUsU0FBRixLQUFnQixDQUFyQixFQUF5Qjs7QUFFMUIsOEJBQVUsRUFBRSxZQUFGLEdBQWlCLEVBQUUsT0FBRixDQUFVLGNBQXJDOztBQUVBLHdCQUFLLEVBQUUsWUFBRixHQUFpQixDQUFqQixLQUF1QixDQUE1QixFQUFnQztBQUM1QiwwQkFBRSxTQUFGLEdBQWMsQ0FBZDtBQUNIO0FBRUo7QUFFSjs7QUFFRCxjQUFFLFlBQUYsQ0FBZ0IsT0FBaEI7QUFFSDtBQUVKLEtBN0JEOztBQStCQSxVQUFNLFNBQU4sQ0FBZ0IsV0FBaEIsR0FBOEIsWUFBVzs7QUFFckMsWUFBSSxJQUFJLElBQVI7O0FBRUEsWUFBSSxFQUFFLE9BQUYsQ0FBVSxNQUFWLEtBQXFCLElBQXpCLEVBQWdDOztBQUU1QixjQUFFLFVBQUYsR0FBZSxFQUFFLEVBQUUsT0FBRixDQUFVLFNBQVosRUFBdUIsUUFBdkIsQ0FBZ0MsYUFBaEMsQ0FBZjtBQUNBLGNBQUUsVUFBRixHQUFlLEVBQUUsRUFBRSxPQUFGLENBQVUsU0FBWixFQUF1QixRQUF2QixDQUFnQyxhQUFoQyxDQUFmOztBQUVBLGdCQUFJLEVBQUUsVUFBRixHQUFlLEVBQUUsT0FBRixDQUFVLFlBQTdCLEVBQTRDOztBQUV4QyxrQkFBRSxVQUFGLENBQWEsV0FBYixDQUF5QixjQUF6QixFQUF5QyxVQUF6QyxDQUFvRCxzQkFBcEQ7QUFDQSxrQkFBRSxVQUFGLENBQWEsV0FBYixDQUF5QixjQUF6QixFQUF5QyxVQUF6QyxDQUFvRCxzQkFBcEQ7O0FBRUEsb0JBQUksRUFBRSxRQUFGLENBQVcsSUFBWCxDQUFnQixFQUFFLE9BQUYsQ0FBVSxTQUExQixDQUFKLEVBQTBDO0FBQ3RDLHNCQUFFLFVBQUYsQ0FBYSxTQUFiLENBQXVCLEVBQUUsT0FBRixDQUFVLFlBQWpDO0FBQ0g7O0FBRUQsb0JBQUksRUFBRSxRQUFGLENBQVcsSUFBWCxDQUFnQixFQUFFLE9BQUYsQ0FBVSxTQUExQixDQUFKLEVBQTBDO0FBQ3RDLHNCQUFFLFVBQUYsQ0FBYSxRQUFiLENBQXNCLEVBQUUsT0FBRixDQUFVLFlBQWhDO0FBQ0g7O0FBRUQsb0JBQUksRUFBRSxPQUFGLENBQVUsUUFBVixLQUF1QixJQUEzQixFQUFpQztBQUM3QixzQkFBRSxVQUFGLENBQ0ssUUFETCxDQUNjLGdCQURkLEVBRUssSUFGTCxDQUVVLGVBRlYsRUFFMkIsTUFGM0I7QUFHSDtBQUVKLGFBbkJELE1BbUJPOztBQUVILGtCQUFFLFVBQUYsQ0FBYSxHQUFiLENBQWtCLEVBQUUsVUFBcEIsRUFFSyxRQUZMLENBRWMsY0FGZCxFQUdLLElBSEwsQ0FHVTtBQUNGLHFDQUFpQixNQURmO0FBRUYsZ0NBQVk7QUFGVixpQkFIVjtBQVFIO0FBRUo7QUFFSixLQTFDRDs7QUE0Q0EsVUFBTSxTQUFOLENBQWdCLFNBQWhCLEdBQTRCLFlBQVc7O0FBRW5DLFlBQUksSUFBSSxJQUFSO0FBQUEsWUFDSSxDQURKO0FBQUEsWUFDTyxHQURQOztBQUdBLFlBQUksRUFBRSxPQUFGLENBQVUsSUFBVixLQUFtQixJQUFuQixJQUEyQixFQUFFLFVBQUYsR0FBZSxFQUFFLE9BQUYsQ0FBVSxZQUF4RCxFQUFzRTs7QUFFbEUsY0FBRSxPQUFGLENBQVUsUUFBVixDQUFtQixjQUFuQjs7QUFFQSxrQkFBTSxFQUFFLFFBQUYsRUFBWSxRQUFaLENBQXFCLEVBQUUsT0FBRixDQUFVLFNBQS9CLENBQU47O0FBRUEsaUJBQUssSUFBSSxDQUFULEVBQVksS0FBSyxFQUFFLFdBQUYsRUFBakIsRUFBa0MsS0FBSyxDQUF2QyxFQUEwQztBQUN0QyxvQkFBSSxNQUFKLENBQVcsRUFBRSxRQUFGLEVBQVksTUFBWixDQUFtQixFQUFFLE9BQUYsQ0FBVSxZQUFWLENBQXVCLElBQXZCLENBQTRCLElBQTVCLEVBQWtDLENBQWxDLEVBQXFDLENBQXJDLENBQW5CLENBQVg7QUFDSDs7QUFFRCxjQUFFLEtBQUYsR0FBVSxJQUFJLFFBQUosQ0FBYSxFQUFFLE9BQUYsQ0FBVSxVQUF2QixDQUFWOztBQUVBLGNBQUUsS0FBRixDQUFRLElBQVIsQ0FBYSxJQUFiLEVBQW1CLEtBQW5CLEdBQTJCLFFBQTNCLENBQW9DLGNBQXBDLEVBQW9ELElBQXBELENBQXlELGFBQXpELEVBQXdFLE9BQXhFO0FBRUg7QUFFSixLQXJCRDs7QUF1QkEsVUFBTSxTQUFOLENBQWdCLFFBQWhCLEdBQTJCLFlBQVc7O0FBRWxDLFlBQUksSUFBSSxJQUFSOztBQUVBLFVBQUUsT0FBRixHQUNJLEVBQUUsT0FBRixDQUNLLFFBREwsQ0FDZSxFQUFFLE9BQUYsQ0FBVSxLQUFWLEdBQWtCLHFCQURqQyxFQUVLLFFBRkwsQ0FFYyxhQUZkLENBREo7O0FBS0EsVUFBRSxVQUFGLEdBQWUsRUFBRSxPQUFGLENBQVUsTUFBekI7O0FBRUEsVUFBRSxPQUFGLENBQVUsSUFBVixDQUFlLFVBQVMsS0FBVCxFQUFnQixPQUFoQixFQUF5QjtBQUNwQyxjQUFFLE9BQUYsRUFDSyxJQURMLENBQ1Usa0JBRFYsRUFDOEIsS0FEOUIsRUFFSyxJQUZMLENBRVUsaUJBRlYsRUFFNkIsRUFBRSxPQUFGLEVBQVcsSUFBWCxDQUFnQixPQUFoQixLQUE0QixFQUZ6RDtBQUdILFNBSkQ7O0FBTUEsVUFBRSxPQUFGLENBQVUsUUFBVixDQUFtQixjQUFuQjs7QUFFQSxVQUFFLFdBQUYsR0FBaUIsRUFBRSxVQUFGLEtBQWlCLENBQWxCLEdBQ1osRUFBRSw0QkFBRixFQUFnQyxRQUFoQyxDQUF5QyxFQUFFLE9BQTNDLENBRFksR0FFWixFQUFFLE9BQUYsQ0FBVSxPQUFWLENBQWtCLDRCQUFsQixFQUFnRCxNQUFoRCxFQUZKOztBQUlBLFVBQUUsS0FBRixHQUFVLEVBQUUsV0FBRixDQUFjLElBQWQsQ0FDTiw4Q0FETSxFQUMwQyxNQUQxQyxFQUFWO0FBRUEsVUFBRSxXQUFGLENBQWMsR0FBZCxDQUFrQixTQUFsQixFQUE2QixDQUE3Qjs7QUFFQSxZQUFJLEVBQUUsT0FBRixDQUFVLFVBQVYsS0FBeUIsSUFBekIsSUFBaUMsRUFBRSxPQUFGLENBQVUsWUFBVixLQUEyQixJQUFoRSxFQUFzRTtBQUNsRSxjQUFFLE9BQUYsQ0FBVSxjQUFWLEdBQTJCLENBQTNCO0FBQ0g7O0FBRUQsVUFBRSxnQkFBRixFQUFvQixFQUFFLE9BQXRCLEVBQStCLEdBQS9CLENBQW1DLE9BQW5DLEVBQTRDLFFBQTVDLENBQXFELGVBQXJEOztBQUVBLFVBQUUsYUFBRjs7QUFFQSxVQUFFLFdBQUY7O0FBRUEsVUFBRSxTQUFGOztBQUVBLFVBQUUsVUFBRjs7QUFHQSxVQUFFLGVBQUYsQ0FBa0IsT0FBTyxFQUFFLFlBQVQsS0FBMEIsUUFBMUIsR0FBcUMsRUFBRSxZQUF2QyxHQUFzRCxDQUF4RTs7QUFFQSxZQUFJLEVBQUUsT0FBRixDQUFVLFNBQVYsS0FBd0IsSUFBNUIsRUFBa0M7QUFDOUIsY0FBRSxLQUFGLENBQVEsUUFBUixDQUFpQixXQUFqQjtBQUNIO0FBRUosS0FoREQ7O0FBa0RBLFVBQU0sU0FBTixDQUFnQixTQUFoQixHQUE0QixZQUFXOztBQUVuQyxZQUFJLElBQUksSUFBUjtBQUFBLFlBQWMsQ0FBZDtBQUFBLFlBQWlCLENBQWpCO0FBQUEsWUFBb0IsQ0FBcEI7QUFBQSxZQUF1QixTQUF2QjtBQUFBLFlBQWtDLFdBQWxDO0FBQUEsWUFBK0MsY0FBL0M7QUFBQSxZQUE4RCxnQkFBOUQ7O0FBRUEsb0JBQVksU0FBUyxzQkFBVCxFQUFaO0FBQ0EseUJBQWlCLEVBQUUsT0FBRixDQUFVLFFBQVYsRUFBakI7O0FBRUEsWUFBRyxFQUFFLE9BQUYsQ0FBVSxJQUFWLEdBQWlCLENBQXBCLEVBQXVCOztBQUVuQiwrQkFBbUIsRUFBRSxPQUFGLENBQVUsWUFBVixHQUF5QixFQUFFLE9BQUYsQ0FBVSxJQUF0RDtBQUNBLDBCQUFjLEtBQUssSUFBTCxDQUNWLGVBQWUsTUFBZixHQUF3QixnQkFEZCxDQUFkOztBQUlBLGlCQUFJLElBQUksQ0FBUixFQUFXLElBQUksV0FBZixFQUE0QixHQUE1QixFQUFnQztBQUM1QixvQkFBSSxRQUFRLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFaO0FBQ0EscUJBQUksSUFBSSxDQUFSLEVBQVcsSUFBSSxFQUFFLE9BQUYsQ0FBVSxJQUF6QixFQUErQixHQUEvQixFQUFvQztBQUNoQyx3QkFBSSxNQUFNLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFWO0FBQ0EseUJBQUksSUFBSSxDQUFSLEVBQVcsSUFBSSxFQUFFLE9BQUYsQ0FBVSxZQUF6QixFQUF1QyxHQUF2QyxFQUE0QztBQUN4Qyw0QkFBSSxTQUFVLElBQUksZ0JBQUosSUFBeUIsSUFBSSxFQUFFLE9BQUYsQ0FBVSxZQUFmLEdBQStCLENBQXZELENBQWQ7QUFDQSw0QkFBSSxlQUFlLEdBQWYsQ0FBbUIsTUFBbkIsQ0FBSixFQUFnQztBQUM1QixnQ0FBSSxXQUFKLENBQWdCLGVBQWUsR0FBZixDQUFtQixNQUFuQixDQUFoQjtBQUNIO0FBQ0o7QUFDRCwwQkFBTSxXQUFOLENBQWtCLEdBQWxCO0FBQ0g7QUFDRCwwQkFBVSxXQUFWLENBQXNCLEtBQXRCO0FBQ0g7O0FBRUQsY0FBRSxPQUFGLENBQVUsS0FBVixHQUFrQixNQUFsQixDQUF5QixTQUF6QjtBQUNBLGNBQUUsT0FBRixDQUFVLFFBQVYsR0FBcUIsUUFBckIsR0FBZ0MsUUFBaEMsR0FDSyxHQURMLENBQ1M7QUFDRCx5QkFBUyxNQUFNLEVBQUUsT0FBRixDQUFVLFlBQWpCLEdBQWlDLEdBRHhDO0FBRUQsMkJBQVc7QUFGVixhQURUO0FBTUg7QUFFSixLQXRDRDs7QUF3Q0EsVUFBTSxTQUFOLENBQWdCLGVBQWhCLEdBQWtDLFVBQVMsT0FBVCxFQUFrQixXQUFsQixFQUErQjs7QUFFN0QsWUFBSSxJQUFJLElBQVI7QUFBQSxZQUNJLFVBREo7QUFBQSxZQUNnQixnQkFEaEI7QUFBQSxZQUNrQyxjQURsQztBQUFBLFlBQ2tELG9CQUFvQixLQUR0RTtBQUVBLFlBQUksY0FBYyxFQUFFLE9BQUYsQ0FBVSxLQUFWLEVBQWxCO0FBQ0EsWUFBSSxjQUFjLE9BQU8sVUFBUCxJQUFxQixFQUFFLE1BQUYsRUFBVSxLQUFWLEVBQXZDOztBQUVBLFlBQUksRUFBRSxTQUFGLEtBQWdCLFFBQXBCLEVBQThCO0FBQzFCLDZCQUFpQixXQUFqQjtBQUNILFNBRkQsTUFFTyxJQUFJLEVBQUUsU0FBRixLQUFnQixRQUFwQixFQUE4QjtBQUNqQyw2QkFBaUIsV0FBakI7QUFDSCxTQUZNLE1BRUEsSUFBSSxFQUFFLFNBQUYsS0FBZ0IsS0FBcEIsRUFBMkI7QUFDOUIsNkJBQWlCLEtBQUssR0FBTCxDQUFTLFdBQVQsRUFBc0IsV0FBdEIsQ0FBakI7QUFDSDs7QUFFRCxZQUFLLEVBQUUsT0FBRixDQUFVLFVBQVYsSUFDRCxFQUFFLE9BQUYsQ0FBVSxVQUFWLENBQXFCLE1BRHBCLElBRUQsRUFBRSxPQUFGLENBQVUsVUFBVixLQUF5QixJQUY3QixFQUVtQzs7QUFFL0IsK0JBQW1CLElBQW5COztBQUVBLGlCQUFLLFVBQUwsSUFBbUIsRUFBRSxXQUFyQixFQUFrQztBQUM5QixvQkFBSSxFQUFFLFdBQUYsQ0FBYyxjQUFkLENBQTZCLFVBQTdCLENBQUosRUFBOEM7QUFDMUMsd0JBQUksRUFBRSxnQkFBRixDQUFtQixXQUFuQixLQUFtQyxLQUF2QyxFQUE4QztBQUMxQyw0QkFBSSxpQkFBaUIsRUFBRSxXQUFGLENBQWMsVUFBZCxDQUFyQixFQUFnRDtBQUM1QywrQ0FBbUIsRUFBRSxXQUFGLENBQWMsVUFBZCxDQUFuQjtBQUNIO0FBQ0oscUJBSkQsTUFJTztBQUNILDRCQUFJLGlCQUFpQixFQUFFLFdBQUYsQ0FBYyxVQUFkLENBQXJCLEVBQWdEO0FBQzVDLCtDQUFtQixFQUFFLFdBQUYsQ0FBYyxVQUFkLENBQW5CO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7O0FBRUQsZ0JBQUkscUJBQXFCLElBQXpCLEVBQStCO0FBQzNCLG9CQUFJLEVBQUUsZ0JBQUYsS0FBdUIsSUFBM0IsRUFBaUM7QUFDN0Isd0JBQUkscUJBQXFCLEVBQUUsZ0JBQXZCLElBQTJDLFdBQS9DLEVBQTREO0FBQ3hELDBCQUFFLGdCQUFGLEdBQ0ksZ0JBREo7QUFFQSw0QkFBSSxFQUFFLGtCQUFGLENBQXFCLGdCQUFyQixNQUEyQyxTQUEvQyxFQUEwRDtBQUN0RCw4QkFBRSxPQUFGLENBQVUsZ0JBQVY7QUFDSCx5QkFGRCxNQUVPO0FBQ0gsOEJBQUUsT0FBRixHQUFZLEVBQUUsTUFBRixDQUFTLEVBQVQsRUFBYSxFQUFFLGdCQUFmLEVBQ1IsRUFBRSxrQkFBRixDQUNJLGdCQURKLENBRFEsQ0FBWjtBQUdBLGdDQUFJLFlBQVksSUFBaEIsRUFBc0I7QUFDbEIsa0NBQUUsWUFBRixHQUFpQixFQUFFLE9BQUYsQ0FBVSxZQUEzQjtBQUNIO0FBQ0QsOEJBQUUsT0FBRixDQUFVLE9BQVY7QUFDSDtBQUNELDRDQUFvQixnQkFBcEI7QUFDSDtBQUNKLGlCQWpCRCxNQWlCTztBQUNILHNCQUFFLGdCQUFGLEdBQXFCLGdCQUFyQjtBQUNBLHdCQUFJLEVBQUUsa0JBQUYsQ0FBcUIsZ0JBQXJCLE1BQTJDLFNBQS9DLEVBQTBEO0FBQ3RELDBCQUFFLE9BQUYsQ0FBVSxnQkFBVjtBQUNILHFCQUZELE1BRU87QUFDSCwwQkFBRSxPQUFGLEdBQVksRUFBRSxNQUFGLENBQVMsRUFBVCxFQUFhLEVBQUUsZ0JBQWYsRUFDUixFQUFFLGtCQUFGLENBQ0ksZ0JBREosQ0FEUSxDQUFaO0FBR0EsNEJBQUksWUFBWSxJQUFoQixFQUFzQjtBQUNsQiw4QkFBRSxZQUFGLEdBQWlCLEVBQUUsT0FBRixDQUFVLFlBQTNCO0FBQ0g7QUFDRCwwQkFBRSxPQUFGLENBQVUsT0FBVjtBQUNIO0FBQ0Qsd0NBQW9CLGdCQUFwQjtBQUNIO0FBQ0osYUFqQ0QsTUFpQ087QUFDSCxvQkFBSSxFQUFFLGdCQUFGLEtBQXVCLElBQTNCLEVBQWlDO0FBQzdCLHNCQUFFLGdCQUFGLEdBQXFCLElBQXJCO0FBQ0Esc0JBQUUsT0FBRixHQUFZLEVBQUUsZ0JBQWQ7QUFDQSx3QkFBSSxZQUFZLElBQWhCLEVBQXNCO0FBQ2xCLDBCQUFFLFlBQUYsR0FBaUIsRUFBRSxPQUFGLENBQVUsWUFBM0I7QUFDSDtBQUNELHNCQUFFLE9BQUYsQ0FBVSxPQUFWO0FBQ0Esd0NBQW9CLGdCQUFwQjtBQUNIO0FBQ0o7O0FBRUQ7QUFDQSxnQkFBSSxDQUFDLE9BQUQsSUFBWSxzQkFBc0IsS0FBdEMsRUFBOEM7QUFDMUMsa0JBQUUsT0FBRixDQUFVLE9BQVYsQ0FBa0IsWUFBbEIsRUFBZ0MsQ0FBQyxDQUFELEVBQUksaUJBQUosQ0FBaEM7QUFDSDtBQUNKO0FBRUosS0F0RkQ7O0FBd0ZBLFVBQU0sU0FBTixDQUFnQixXQUFoQixHQUE4QixVQUFTLEtBQVQsRUFBZ0IsV0FBaEIsRUFBNkI7O0FBRXZELFlBQUksSUFBSSxJQUFSO0FBQUEsWUFDSSxVQUFVLEVBQUUsTUFBTSxhQUFSLENBRGQ7QUFBQSxZQUVJLFdBRko7QUFBQSxZQUVpQixXQUZqQjtBQUFBLFlBRThCLFlBRjlCOztBQUlBO0FBQ0EsWUFBRyxRQUFRLEVBQVIsQ0FBVyxHQUFYLENBQUgsRUFBb0I7QUFDaEIsa0JBQU0sY0FBTjtBQUNIOztBQUVEO0FBQ0EsWUFBRyxDQUFDLFFBQVEsRUFBUixDQUFXLElBQVgsQ0FBSixFQUFzQjtBQUNsQixzQkFBVSxRQUFRLE9BQVIsQ0FBZ0IsSUFBaEIsQ0FBVjtBQUNIOztBQUVELHVCQUFnQixFQUFFLFVBQUYsR0FBZSxFQUFFLE9BQUYsQ0FBVSxjQUF6QixLQUE0QyxDQUE1RDtBQUNBLHNCQUFjLGVBQWUsQ0FBZixHQUFtQixDQUFDLEVBQUUsVUFBRixHQUFlLEVBQUUsWUFBbEIsSUFBa0MsRUFBRSxPQUFGLENBQVUsY0FBN0U7O0FBRUEsZ0JBQVEsTUFBTSxJQUFOLENBQVcsT0FBbkI7O0FBRUksaUJBQUssVUFBTDtBQUNJLDhCQUFjLGdCQUFnQixDQUFoQixHQUFvQixFQUFFLE9BQUYsQ0FBVSxjQUE5QixHQUErQyxFQUFFLE9BQUYsQ0FBVSxZQUFWLEdBQXlCLFdBQXRGO0FBQ0Esb0JBQUksRUFBRSxVQUFGLEdBQWUsRUFBRSxPQUFGLENBQVUsWUFBN0IsRUFBMkM7QUFDdkMsc0JBQUUsWUFBRixDQUFlLEVBQUUsWUFBRixHQUFpQixXQUFoQyxFQUE2QyxLQUE3QyxFQUFvRCxXQUFwRDtBQUNIO0FBQ0Q7O0FBRUosaUJBQUssTUFBTDtBQUNJLDhCQUFjLGdCQUFnQixDQUFoQixHQUFvQixFQUFFLE9BQUYsQ0FBVSxjQUE5QixHQUErQyxXQUE3RDtBQUNBLG9CQUFJLEVBQUUsVUFBRixHQUFlLEVBQUUsT0FBRixDQUFVLFlBQTdCLEVBQTJDO0FBQ3ZDLHNCQUFFLFlBQUYsQ0FBZSxFQUFFLFlBQUYsR0FBaUIsV0FBaEMsRUFBNkMsS0FBN0MsRUFBb0QsV0FBcEQ7QUFDSDtBQUNEOztBQUVKLGlCQUFLLE9BQUw7QUFDSSxvQkFBSSxRQUFRLE1BQU0sSUFBTixDQUFXLEtBQVgsS0FBcUIsQ0FBckIsR0FBeUIsQ0FBekIsR0FDUixNQUFNLElBQU4sQ0FBVyxLQUFYLElBQW9CLFFBQVEsS0FBUixLQUFrQixFQUFFLE9BQUYsQ0FBVSxjQURwRDs7QUFHQSxrQkFBRSxZQUFGLENBQWUsRUFBRSxjQUFGLENBQWlCLEtBQWpCLENBQWYsRUFBd0MsS0FBeEMsRUFBK0MsV0FBL0M7QUFDQSx3QkFBUSxRQUFSLEdBQW1CLE9BQW5CLENBQTJCLE9BQTNCO0FBQ0E7O0FBRUo7QUFDSTtBQXpCUjtBQTRCSCxLQS9DRDs7QUFpREEsVUFBTSxTQUFOLENBQWdCLGNBQWhCLEdBQWlDLFVBQVMsS0FBVCxFQUFnQjs7QUFFN0MsWUFBSSxJQUFJLElBQVI7QUFBQSxZQUNJLFVBREo7QUFBQSxZQUNnQixhQURoQjs7QUFHQSxxQkFBYSxFQUFFLG1CQUFGLEVBQWI7QUFDQSx3QkFBZ0IsQ0FBaEI7QUFDQSxZQUFJLFFBQVEsV0FBVyxXQUFXLE1BQVgsR0FBb0IsQ0FBL0IsQ0FBWixFQUErQztBQUMzQyxvQkFBUSxXQUFXLFdBQVcsTUFBWCxHQUFvQixDQUEvQixDQUFSO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsaUJBQUssSUFBSSxDQUFULElBQWMsVUFBZCxFQUEwQjtBQUN0QixvQkFBSSxRQUFRLFdBQVcsQ0FBWCxDQUFaLEVBQTJCO0FBQ3ZCLDRCQUFRLGFBQVI7QUFDQTtBQUNIO0FBQ0QsZ0NBQWdCLFdBQVcsQ0FBWCxDQUFoQjtBQUNIO0FBQ0o7O0FBRUQsZUFBTyxLQUFQO0FBQ0gsS0FwQkQ7O0FBc0JBLFVBQU0sU0FBTixDQUFnQixhQUFoQixHQUFnQyxZQUFXOztBQUV2QyxZQUFJLElBQUksSUFBUjs7QUFFQSxZQUFJLEVBQUUsT0FBRixDQUFVLElBQVYsSUFBa0IsRUFBRSxLQUFGLEtBQVksSUFBbEMsRUFBd0M7O0FBRXBDLGNBQUUsSUFBRixFQUFRLEVBQUUsS0FBVixFQUNLLEdBREwsQ0FDUyxhQURULEVBQ3dCLEVBQUUsV0FEMUIsRUFFSyxHQUZMLENBRVMsa0JBRlQsRUFFNkIsRUFBRSxLQUFGLENBQVEsRUFBRSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLElBQXhCLENBRjdCLEVBR0ssR0FITCxDQUdTLGtCQUhULEVBRzZCLEVBQUUsS0FBRixDQUFRLEVBQUUsU0FBVixFQUFxQixDQUFyQixFQUF3QixLQUF4QixDQUg3QjtBQUtIOztBQUVELFVBQUUsT0FBRixDQUFVLEdBQVYsQ0FBYyx3QkFBZDs7QUFFQSxZQUFJLEVBQUUsT0FBRixDQUFVLE1BQVYsS0FBcUIsSUFBckIsSUFBNkIsRUFBRSxVQUFGLEdBQWUsRUFBRSxPQUFGLENBQVUsWUFBMUQsRUFBd0U7QUFDcEUsY0FBRSxVQUFGLElBQWdCLEVBQUUsVUFBRixDQUFhLEdBQWIsQ0FBaUIsYUFBakIsRUFBZ0MsRUFBRSxXQUFsQyxDQUFoQjtBQUNBLGNBQUUsVUFBRixJQUFnQixFQUFFLFVBQUYsQ0FBYSxHQUFiLENBQWlCLGFBQWpCLEVBQWdDLEVBQUUsV0FBbEMsQ0FBaEI7QUFDSDs7QUFFRCxVQUFFLEtBQUYsQ0FBUSxHQUFSLENBQVksa0NBQVosRUFBZ0QsRUFBRSxZQUFsRDtBQUNBLFVBQUUsS0FBRixDQUFRLEdBQVIsQ0FBWSxpQ0FBWixFQUErQyxFQUFFLFlBQWpEO0FBQ0EsVUFBRSxLQUFGLENBQVEsR0FBUixDQUFZLDhCQUFaLEVBQTRDLEVBQUUsWUFBOUM7QUFDQSxVQUFFLEtBQUYsQ0FBUSxHQUFSLENBQVksb0NBQVosRUFBa0QsRUFBRSxZQUFwRDs7QUFFQSxVQUFFLEtBQUYsQ0FBUSxHQUFSLENBQVksYUFBWixFQUEyQixFQUFFLFlBQTdCOztBQUVBLFVBQUUsUUFBRixFQUFZLEdBQVosQ0FBZ0IsRUFBRSxnQkFBbEIsRUFBb0MsRUFBRSxVQUF0Qzs7QUFFQSxVQUFFLGtCQUFGOztBQUVBLFlBQUksRUFBRSxPQUFGLENBQVUsYUFBVixLQUE0QixJQUFoQyxFQUFzQztBQUNsQyxjQUFFLEtBQUYsQ0FBUSxHQUFSLENBQVksZUFBWixFQUE2QixFQUFFLFVBQS9CO0FBQ0g7O0FBRUQsWUFBSSxFQUFFLE9BQUYsQ0FBVSxhQUFWLEtBQTRCLElBQWhDLEVBQXNDO0FBQ2xDLGNBQUUsRUFBRSxXQUFKLEVBQWlCLFFBQWpCLEdBQTRCLEdBQTVCLENBQWdDLGFBQWhDLEVBQStDLEVBQUUsYUFBakQ7QUFDSDs7QUFFRCxVQUFFLE1BQUYsRUFBVSxHQUFWLENBQWMsbUNBQW1DLEVBQUUsV0FBbkQsRUFBZ0UsRUFBRSxpQkFBbEU7O0FBRUEsVUFBRSxNQUFGLEVBQVUsR0FBVixDQUFjLHdCQUF3QixFQUFFLFdBQXhDLEVBQXFELEVBQUUsTUFBdkQ7O0FBRUEsVUFBRSxtQkFBRixFQUF1QixFQUFFLFdBQXpCLEVBQXNDLEdBQXRDLENBQTBDLFdBQTFDLEVBQXVELEVBQUUsY0FBekQ7O0FBRUEsVUFBRSxNQUFGLEVBQVUsR0FBVixDQUFjLHNCQUFzQixFQUFFLFdBQXRDLEVBQW1ELEVBQUUsV0FBckQ7QUFDQSxVQUFFLFFBQUYsRUFBWSxHQUFaLENBQWdCLHVCQUF1QixFQUFFLFdBQXpDLEVBQXNELEVBQUUsV0FBeEQ7QUFFSCxLQWhERDs7QUFrREEsVUFBTSxTQUFOLENBQWdCLGtCQUFoQixHQUFxQyxZQUFXOztBQUU1QyxZQUFJLElBQUksSUFBUjs7QUFFQSxVQUFFLEtBQUYsQ0FBUSxHQUFSLENBQVksa0JBQVosRUFBZ0MsRUFBRSxLQUFGLENBQVEsRUFBRSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLElBQXhCLENBQWhDO0FBQ0EsVUFBRSxLQUFGLENBQVEsR0FBUixDQUFZLGtCQUFaLEVBQWdDLEVBQUUsS0FBRixDQUFRLEVBQUUsU0FBVixFQUFxQixDQUFyQixFQUF3QixLQUF4QixDQUFoQztBQUVILEtBUEQ7O0FBU0EsVUFBTSxTQUFOLENBQWdCLFdBQWhCLEdBQThCLFlBQVc7O0FBRXJDLFlBQUksSUFBSSxJQUFSO0FBQUEsWUFBYyxjQUFkOztBQUVBLFlBQUcsRUFBRSxPQUFGLENBQVUsSUFBVixHQUFpQixDQUFwQixFQUF1QjtBQUNuQiw2QkFBaUIsRUFBRSxPQUFGLENBQVUsUUFBVixHQUFxQixRQUFyQixFQUFqQjtBQUNBLDJCQUFlLFVBQWYsQ0FBMEIsT0FBMUI7QUFDQSxjQUFFLE9BQUYsQ0FBVSxLQUFWLEdBQWtCLE1BQWxCLENBQXlCLGNBQXpCO0FBQ0g7QUFFSixLQVZEOztBQVlBLFVBQU0sU0FBTixDQUFnQixZQUFoQixHQUErQixVQUFTLEtBQVQsRUFBZ0I7O0FBRTNDLFlBQUksSUFBSSxJQUFSOztBQUVBLFlBQUksRUFBRSxXQUFGLEtBQWtCLEtBQXRCLEVBQTZCO0FBQ3pCLGtCQUFNLHdCQUFOO0FBQ0Esa0JBQU0sZUFBTjtBQUNBLGtCQUFNLGNBQU47QUFDSDtBQUVKLEtBVkQ7O0FBWUEsVUFBTSxTQUFOLENBQWdCLE9BQWhCLEdBQTBCLFVBQVMsT0FBVCxFQUFrQjs7QUFFeEMsWUFBSSxJQUFJLElBQVI7O0FBRUEsVUFBRSxhQUFGOztBQUVBLFVBQUUsV0FBRixHQUFnQixFQUFoQjs7QUFFQSxVQUFFLGFBQUY7O0FBRUEsVUFBRSxlQUFGLEVBQW1CLEVBQUUsT0FBckIsRUFBOEIsTUFBOUI7O0FBRUEsWUFBSSxFQUFFLEtBQU4sRUFBYTtBQUNULGNBQUUsS0FBRixDQUFRLE1BQVI7QUFDSDs7QUFHRCxZQUFLLEVBQUUsVUFBRixJQUFnQixFQUFFLFVBQUYsQ0FBYSxNQUFsQyxFQUEyQzs7QUFFdkMsY0FBRSxVQUFGLENBQ0ssV0FETCxDQUNpQix5Q0FEakIsRUFFSyxVQUZMLENBRWdCLG9DQUZoQixFQUdLLEdBSEwsQ0FHUyxTQUhULEVBR21CLEVBSG5COztBQUtBLGdCQUFLLEVBQUUsUUFBRixDQUFXLElBQVgsQ0FBaUIsRUFBRSxPQUFGLENBQVUsU0FBM0IsQ0FBTCxFQUE2QztBQUN6QyxrQkFBRSxVQUFGLENBQWEsTUFBYjtBQUNIO0FBQ0o7O0FBRUQsWUFBSyxFQUFFLFVBQUYsSUFBZ0IsRUFBRSxVQUFGLENBQWEsTUFBbEMsRUFBMkM7O0FBRXZDLGNBQUUsVUFBRixDQUNLLFdBREwsQ0FDaUIseUNBRGpCLEVBRUssVUFGTCxDQUVnQixvQ0FGaEIsRUFHSyxHQUhMLENBR1MsU0FIVCxFQUdtQixFQUhuQjs7QUFLQSxnQkFBSyxFQUFFLFFBQUYsQ0FBVyxJQUFYLENBQWlCLEVBQUUsT0FBRixDQUFVLFNBQTNCLENBQUwsRUFBNkM7QUFDekMsa0JBQUUsVUFBRixDQUFhLE1BQWI7QUFDSDtBQUVKOztBQUdELFlBQUksRUFBRSxPQUFOLEVBQWU7O0FBRVgsY0FBRSxPQUFGLENBQ0ssV0FETCxDQUNpQixtRUFEakIsRUFFSyxVQUZMLENBRWdCLGFBRmhCLEVBR0ssVUFITCxDQUdnQixrQkFIaEIsRUFJSyxJQUpMLENBSVUsWUFBVTtBQUNaLGtCQUFFLElBQUYsRUFBUSxJQUFSLENBQWEsT0FBYixFQUFzQixFQUFFLElBQUYsRUFBUSxJQUFSLENBQWEsaUJBQWIsQ0FBdEI7QUFDSCxhQU5MOztBQVFBLGNBQUUsV0FBRixDQUFjLFFBQWQsQ0FBdUIsS0FBSyxPQUFMLENBQWEsS0FBcEMsRUFBMkMsTUFBM0M7O0FBRUEsY0FBRSxXQUFGLENBQWMsTUFBZDs7QUFFQSxjQUFFLEtBQUYsQ0FBUSxNQUFSOztBQUVBLGNBQUUsT0FBRixDQUFVLE1BQVYsQ0FBaUIsRUFBRSxPQUFuQjtBQUNIOztBQUVELFVBQUUsV0FBRjs7QUFFQSxVQUFFLE9BQUYsQ0FBVSxXQUFWLENBQXNCLGNBQXRCO0FBQ0EsVUFBRSxPQUFGLENBQVUsV0FBVixDQUFzQixtQkFBdEI7QUFDQSxVQUFFLE9BQUYsQ0FBVSxXQUFWLENBQXNCLGNBQXRCOztBQUVBLFVBQUUsU0FBRixHQUFjLElBQWQ7O0FBRUEsWUFBRyxDQUFDLE9BQUosRUFBYTtBQUNULGNBQUUsT0FBRixDQUFVLE9BQVYsQ0FBa0IsU0FBbEIsRUFBNkIsQ0FBQyxDQUFELENBQTdCO0FBQ0g7QUFFSixLQTFFRDs7QUE0RUEsVUFBTSxTQUFOLENBQWdCLGlCQUFoQixHQUFvQyxVQUFTLEtBQVQsRUFBZ0I7O0FBRWhELFlBQUksSUFBSSxJQUFSO0FBQUEsWUFDSSxhQUFhLEVBRGpCOztBQUdBLG1CQUFXLEVBQUUsY0FBYixJQUErQixFQUEvQjs7QUFFQSxZQUFJLEVBQUUsT0FBRixDQUFVLElBQVYsS0FBbUIsS0FBdkIsRUFBOEI7QUFDMUIsY0FBRSxXQUFGLENBQWMsR0FBZCxDQUFrQixVQUFsQjtBQUNILFNBRkQsTUFFTztBQUNILGNBQUUsT0FBRixDQUFVLEVBQVYsQ0FBYSxLQUFiLEVBQW9CLEdBQXBCLENBQXdCLFVBQXhCO0FBQ0g7QUFFSixLQWJEOztBQWVBLFVBQU0sU0FBTixDQUFnQixTQUFoQixHQUE0QixVQUFTLFVBQVQsRUFBcUIsUUFBckIsRUFBK0I7O0FBRXZELFlBQUksSUFBSSxJQUFSOztBQUVBLFlBQUksRUFBRSxjQUFGLEtBQXFCLEtBQXpCLEVBQWdDOztBQUU1QixjQUFFLE9BQUYsQ0FBVSxFQUFWLENBQWEsVUFBYixFQUF5QixHQUF6QixDQUE2QjtBQUN6Qix3QkFBUSxFQUFFLE9BQUYsQ0FBVTtBQURPLGFBQTdCOztBQUlBLGNBQUUsT0FBRixDQUFVLEVBQVYsQ0FBYSxVQUFiLEVBQXlCLE9BQXpCLENBQWlDO0FBQzdCLHlCQUFTO0FBRG9CLGFBQWpDLEVBRUcsRUFBRSxPQUFGLENBQVUsS0FGYixFQUVvQixFQUFFLE9BQUYsQ0FBVSxNQUY5QixFQUVzQyxRQUZ0QztBQUlILFNBVkQsTUFVTzs7QUFFSCxjQUFFLGVBQUYsQ0FBa0IsVUFBbEI7O0FBRUEsY0FBRSxPQUFGLENBQVUsRUFBVixDQUFhLFVBQWIsRUFBeUIsR0FBekIsQ0FBNkI7QUFDekIseUJBQVMsQ0FEZ0I7QUFFekIsd0JBQVEsRUFBRSxPQUFGLENBQVU7QUFGTyxhQUE3Qjs7QUFLQSxnQkFBSSxRQUFKLEVBQWM7QUFDViwyQkFBVyxZQUFXOztBQUVsQixzQkFBRSxpQkFBRixDQUFvQixVQUFwQjs7QUFFQSw2QkFBUyxJQUFUO0FBQ0gsaUJBTEQsRUFLRyxFQUFFLE9BQUYsQ0FBVSxLQUxiO0FBTUg7QUFFSjtBQUVKLEtBbENEOztBQW9DQSxVQUFNLFNBQU4sQ0FBZ0IsWUFBaEIsR0FBK0IsVUFBUyxVQUFULEVBQXFCOztBQUVoRCxZQUFJLElBQUksSUFBUjs7QUFFQSxZQUFJLEVBQUUsY0FBRixLQUFxQixLQUF6QixFQUFnQzs7QUFFNUIsY0FBRSxPQUFGLENBQVUsRUFBVixDQUFhLFVBQWIsRUFBeUIsT0FBekIsQ0FBaUM7QUFDN0IseUJBQVMsQ0FEb0I7QUFFN0Isd0JBQVEsRUFBRSxPQUFGLENBQVUsTUFBVixHQUFtQjtBQUZFLGFBQWpDLEVBR0csRUFBRSxPQUFGLENBQVUsS0FIYixFQUdvQixFQUFFLE9BQUYsQ0FBVSxNQUg5QjtBQUtILFNBUEQsTUFPTzs7QUFFSCxjQUFFLGVBQUYsQ0FBa0IsVUFBbEI7O0FBRUEsY0FBRSxPQUFGLENBQVUsRUFBVixDQUFhLFVBQWIsRUFBeUIsR0FBekIsQ0FBNkI7QUFDekIseUJBQVMsQ0FEZ0I7QUFFekIsd0JBQVEsRUFBRSxPQUFGLENBQVUsTUFBVixHQUFtQjtBQUZGLGFBQTdCO0FBS0g7QUFFSixLQXRCRDs7QUF3QkEsVUFBTSxTQUFOLENBQWdCLFlBQWhCLEdBQStCLE1BQU0sU0FBTixDQUFnQixXQUFoQixHQUE4QixVQUFTLE1BQVQsRUFBaUI7O0FBRTFFLFlBQUksSUFBSSxJQUFSOztBQUVBLFlBQUksV0FBVyxJQUFmLEVBQXFCOztBQUVqQixjQUFFLFlBQUYsR0FBaUIsRUFBRSxPQUFuQjs7QUFFQSxjQUFFLE1BQUY7O0FBRUEsY0FBRSxXQUFGLENBQWMsUUFBZCxDQUF1QixLQUFLLE9BQUwsQ0FBYSxLQUFwQyxFQUEyQyxNQUEzQzs7QUFFQSxjQUFFLFlBQUYsQ0FBZSxNQUFmLENBQXNCLE1BQXRCLEVBQThCLFFBQTlCLENBQXVDLEVBQUUsV0FBekM7O0FBRUEsY0FBRSxNQUFGO0FBRUg7QUFFSixLQWxCRDs7QUFvQkEsVUFBTSxTQUFOLENBQWdCLFlBQWhCLEdBQStCLFlBQVc7O0FBRXRDLFlBQUksSUFBSSxJQUFSOztBQUVBLFVBQUUsT0FBRixDQUNLLEdBREwsQ0FDUyx3QkFEVCxFQUVLLEVBRkwsQ0FFUSx3QkFGUixFQUdRLHFCQUhSLEVBRytCLFVBQVMsS0FBVCxFQUFnQjs7QUFFM0Msa0JBQU0sd0JBQU47QUFDQSxnQkFBSSxNQUFNLEVBQUUsSUFBRixDQUFWOztBQUVBLHVCQUFXLFlBQVc7O0FBRWxCLG9CQUFJLEVBQUUsT0FBRixDQUFVLFlBQWQsRUFBNkI7QUFDekIsc0JBQUUsUUFBRixHQUFhLElBQUksRUFBSixDQUFPLFFBQVAsQ0FBYjtBQUNBLHNCQUFFLFFBQUY7QUFDSDtBQUVKLGFBUEQsRUFPRyxDQVBIO0FBU0gsU0FqQkQ7QUFrQkgsS0F0QkQ7O0FBd0JBLFVBQU0sU0FBTixDQUFnQixVQUFoQixHQUE2QixNQUFNLFNBQU4sQ0FBZ0IsaUJBQWhCLEdBQW9DLFlBQVc7O0FBRXhFLFlBQUksSUFBSSxJQUFSO0FBQ0EsZUFBTyxFQUFFLFlBQVQ7QUFFSCxLQUxEOztBQU9BLFVBQU0sU0FBTixDQUFnQixXQUFoQixHQUE4QixZQUFXOztBQUVyQyxZQUFJLElBQUksSUFBUjs7QUFFQSxZQUFJLGFBQWEsQ0FBakI7QUFDQSxZQUFJLFVBQVUsQ0FBZDtBQUNBLFlBQUksV0FBVyxDQUFmOztBQUVBLFlBQUksRUFBRSxPQUFGLENBQVUsUUFBVixLQUF1QixJQUEzQixFQUFpQztBQUM3QixtQkFBTyxhQUFhLEVBQUUsVUFBdEIsRUFBa0M7QUFDOUIsa0JBQUUsUUFBRjtBQUNBLDZCQUFhLFVBQVUsRUFBRSxPQUFGLENBQVUsY0FBakM7QUFDQSwyQkFBVyxFQUFFLE9BQUYsQ0FBVSxjQUFWLElBQTRCLEVBQUUsT0FBRixDQUFVLFlBQXRDLEdBQXFELEVBQUUsT0FBRixDQUFVLGNBQS9ELEdBQWdGLEVBQUUsT0FBRixDQUFVLFlBQXJHO0FBQ0g7QUFDSixTQU5ELE1BTU8sSUFBSSxFQUFFLE9BQUYsQ0FBVSxVQUFWLEtBQXlCLElBQTdCLEVBQW1DO0FBQ3RDLHVCQUFXLEVBQUUsVUFBYjtBQUNILFNBRk0sTUFFQSxJQUFHLENBQUMsRUFBRSxPQUFGLENBQVUsUUFBZCxFQUF3QjtBQUMzQix1QkFBVyxJQUFJLEtBQUssSUFBTCxDQUFVLENBQUMsRUFBRSxVQUFGLEdBQWUsRUFBRSxPQUFGLENBQVUsWUFBMUIsSUFBMEMsRUFBRSxPQUFGLENBQVUsY0FBOUQsQ0FBZjtBQUNILFNBRk0sTUFFRDtBQUNGLG1CQUFPLGFBQWEsRUFBRSxVQUF0QixFQUFrQztBQUM5QixrQkFBRSxRQUFGO0FBQ0EsNkJBQWEsVUFBVSxFQUFFLE9BQUYsQ0FBVSxjQUFqQztBQUNBLDJCQUFXLEVBQUUsT0FBRixDQUFVLGNBQVYsSUFBNEIsRUFBRSxPQUFGLENBQVUsWUFBdEMsR0FBcUQsRUFBRSxPQUFGLENBQVUsY0FBL0QsR0FBZ0YsRUFBRSxPQUFGLENBQVUsWUFBckc7QUFDSDtBQUNKOztBQUVELGVBQU8sV0FBVyxDQUFsQjtBQUVILEtBNUJEOztBQThCQSxVQUFNLFNBQU4sQ0FBZ0IsT0FBaEIsR0FBMEIsVUFBUyxVQUFULEVBQXFCOztBQUUzQyxZQUFJLElBQUksSUFBUjtBQUFBLFlBQ0ksVUFESjtBQUFBLFlBRUksY0FGSjtBQUFBLFlBR0ksaUJBQWlCLENBSHJCO0FBQUEsWUFJSSxXQUpKOztBQU1BLFVBQUUsV0FBRixHQUFnQixDQUFoQjtBQUNBLHlCQUFpQixFQUFFLE9BQUYsQ0FBVSxLQUFWLEdBQWtCLFdBQWxCLENBQThCLElBQTlCLENBQWpCOztBQUVBLFlBQUksRUFBRSxPQUFGLENBQVUsUUFBVixLQUF1QixJQUEzQixFQUFpQztBQUM3QixnQkFBSSxFQUFFLFVBQUYsR0FBZSxFQUFFLE9BQUYsQ0FBVSxZQUE3QixFQUEyQztBQUN2QyxrQkFBRSxXQUFGLEdBQWlCLEVBQUUsVUFBRixHQUFlLEVBQUUsT0FBRixDQUFVLFlBQTFCLEdBQTBDLENBQUMsQ0FBM0Q7QUFDQSxpQ0FBa0IsaUJBQWlCLEVBQUUsT0FBRixDQUFVLFlBQTVCLEdBQTRDLENBQUMsQ0FBOUQ7QUFDSDtBQUNELGdCQUFJLEVBQUUsVUFBRixHQUFlLEVBQUUsT0FBRixDQUFVLGNBQXpCLEtBQTRDLENBQWhELEVBQW1EO0FBQy9DLG9CQUFJLGFBQWEsRUFBRSxPQUFGLENBQVUsY0FBdkIsR0FBd0MsRUFBRSxVQUExQyxJQUF3RCxFQUFFLFVBQUYsR0FBZSxFQUFFLE9BQUYsQ0FBVSxZQUFyRixFQUFtRztBQUMvRix3QkFBSSxhQUFhLEVBQUUsVUFBbkIsRUFBK0I7QUFDM0IsMEJBQUUsV0FBRixHQUFpQixDQUFDLEVBQUUsT0FBRixDQUFVLFlBQVYsSUFBMEIsYUFBYSxFQUFFLFVBQXpDLENBQUQsSUFBeUQsRUFBRSxVQUE1RCxHQUEwRSxDQUFDLENBQTNGO0FBQ0EseUNBQWtCLENBQUMsRUFBRSxPQUFGLENBQVUsWUFBVixJQUEwQixhQUFhLEVBQUUsVUFBekMsQ0FBRCxJQUF5RCxjQUExRCxHQUE0RSxDQUFDLENBQTlGO0FBQ0gscUJBSEQsTUFHTztBQUNILDBCQUFFLFdBQUYsR0FBa0IsRUFBRSxVQUFGLEdBQWUsRUFBRSxPQUFGLENBQVUsY0FBMUIsR0FBNEMsRUFBRSxVQUEvQyxHQUE2RCxDQUFDLENBQTlFO0FBQ0EseUNBQW1CLEVBQUUsVUFBRixHQUFlLEVBQUUsT0FBRixDQUFVLGNBQTFCLEdBQTRDLGNBQTdDLEdBQStELENBQUMsQ0FBakY7QUFDSDtBQUNKO0FBQ0o7QUFDSixTQWhCRCxNQWdCTztBQUNILGdCQUFJLGFBQWEsRUFBRSxPQUFGLENBQVUsWUFBdkIsR0FBc0MsRUFBRSxVQUE1QyxFQUF3RDtBQUNwRCxrQkFBRSxXQUFGLEdBQWdCLENBQUUsYUFBYSxFQUFFLE9BQUYsQ0FBVSxZQUF4QixHQUF3QyxFQUFFLFVBQTNDLElBQXlELEVBQUUsVUFBM0U7QUFDQSxpQ0FBaUIsQ0FBRSxhQUFhLEVBQUUsT0FBRixDQUFVLFlBQXhCLEdBQXdDLEVBQUUsVUFBM0MsSUFBeUQsY0FBMUU7QUFDSDtBQUNKOztBQUVELFlBQUksRUFBRSxVQUFGLElBQWdCLEVBQUUsT0FBRixDQUFVLFlBQTlCLEVBQTRDO0FBQ3hDLGNBQUUsV0FBRixHQUFnQixDQUFoQjtBQUNBLDZCQUFpQixDQUFqQjtBQUNIOztBQUVELFlBQUksRUFBRSxPQUFGLENBQVUsVUFBVixLQUF5QixJQUF6QixJQUFpQyxFQUFFLE9BQUYsQ0FBVSxRQUFWLEtBQXVCLElBQTVELEVBQWtFO0FBQzlELGNBQUUsV0FBRixJQUFpQixFQUFFLFVBQUYsR0FBZSxLQUFLLEtBQUwsQ0FBVyxFQUFFLE9BQUYsQ0FBVSxZQUFWLEdBQXlCLENBQXBDLENBQWYsR0FBd0QsRUFBRSxVQUEzRTtBQUNILFNBRkQsTUFFTyxJQUFJLEVBQUUsT0FBRixDQUFVLFVBQVYsS0FBeUIsSUFBN0IsRUFBbUM7QUFDdEMsY0FBRSxXQUFGLEdBQWdCLENBQWhCO0FBQ0EsY0FBRSxXQUFGLElBQWlCLEVBQUUsVUFBRixHQUFlLEtBQUssS0FBTCxDQUFXLEVBQUUsT0FBRixDQUFVLFlBQVYsR0FBeUIsQ0FBcEMsQ0FBaEM7QUFDSDs7QUFFRCxZQUFJLEVBQUUsT0FBRixDQUFVLFFBQVYsS0FBdUIsS0FBM0IsRUFBa0M7QUFDOUIseUJBQWUsYUFBYSxFQUFFLFVBQWhCLEdBQThCLENBQUMsQ0FBaEMsR0FBcUMsRUFBRSxXQUFwRDtBQUNILFNBRkQsTUFFTztBQUNILHlCQUFlLGFBQWEsY0FBZCxHQUFnQyxDQUFDLENBQWxDLEdBQXVDLGNBQXBEO0FBQ0g7O0FBRUQsWUFBSSxFQUFFLE9BQUYsQ0FBVSxhQUFWLEtBQTRCLElBQWhDLEVBQXNDOztBQUVsQyxnQkFBSSxFQUFFLFVBQUYsSUFBZ0IsRUFBRSxPQUFGLENBQVUsWUFBMUIsSUFBMEMsRUFBRSxPQUFGLENBQVUsUUFBVixLQUF1QixLQUFyRSxFQUE0RTtBQUN4RSw4QkFBYyxFQUFFLFdBQUYsQ0FBYyxRQUFkLENBQXVCLGNBQXZCLEVBQXVDLEVBQXZDLENBQTBDLFVBQTFDLENBQWQ7QUFDSCxhQUZELE1BRU87QUFDSCw4QkFBYyxFQUFFLFdBQUYsQ0FBYyxRQUFkLENBQXVCLGNBQXZCLEVBQXVDLEVBQXZDLENBQTBDLGFBQWEsRUFBRSxPQUFGLENBQVUsWUFBakUsQ0FBZDtBQUNIOztBQUVELGdCQUFJLEVBQUUsT0FBRixDQUFVLEdBQVYsS0FBa0IsSUFBdEIsRUFBNEI7QUFDeEIsb0JBQUksWUFBWSxDQUFaLENBQUosRUFBb0I7QUFDaEIsaUNBQWEsQ0FBQyxFQUFFLFdBQUYsQ0FBYyxLQUFkLEtBQXdCLFlBQVksQ0FBWixFQUFlLFVBQXZDLEdBQW9ELFlBQVksS0FBWixFQUFyRCxJQUE0RSxDQUFDLENBQTFGO0FBQ0gsaUJBRkQsTUFFTztBQUNILGlDQUFjLENBQWQ7QUFDSDtBQUNKLGFBTkQsTUFNTztBQUNILDZCQUFhLFlBQVksQ0FBWixJQUFpQixZQUFZLENBQVosRUFBZSxVQUFmLEdBQTRCLENBQUMsQ0FBOUMsR0FBa0QsQ0FBL0Q7QUFDSDs7QUFFRCxnQkFBSSxFQUFFLE9BQUYsQ0FBVSxVQUFWLEtBQXlCLElBQTdCLEVBQW1DO0FBQy9CLG9CQUFJLEVBQUUsVUFBRixJQUFnQixFQUFFLE9BQUYsQ0FBVSxZQUExQixJQUEwQyxFQUFFLE9BQUYsQ0FBVSxRQUFWLEtBQXVCLEtBQXJFLEVBQTRFO0FBQ3hFLGtDQUFjLEVBQUUsV0FBRixDQUFjLFFBQWQsQ0FBdUIsY0FBdkIsRUFBdUMsRUFBdkMsQ0FBMEMsVUFBMUMsQ0FBZDtBQUNILGlCQUZELE1BRU87QUFDSCxrQ0FBYyxFQUFFLFdBQUYsQ0FBYyxRQUFkLENBQXVCLGNBQXZCLEVBQXVDLEVBQXZDLENBQTBDLGFBQWEsRUFBRSxPQUFGLENBQVUsWUFBdkIsR0FBc0MsQ0FBaEYsQ0FBZDtBQUNIOztBQUVELG9CQUFJLEVBQUUsT0FBRixDQUFVLEdBQVYsS0FBa0IsSUFBdEIsRUFBNEI7QUFDeEIsd0JBQUksWUFBWSxDQUFaLENBQUosRUFBb0I7QUFDaEIscUNBQWEsQ0FBQyxFQUFFLFdBQUYsQ0FBYyxLQUFkLEtBQXdCLFlBQVksQ0FBWixFQUFlLFVBQXZDLEdBQW9ELFlBQVksS0FBWixFQUFyRCxJQUE0RSxDQUFDLENBQTFGO0FBQ0gscUJBRkQsTUFFTztBQUNILHFDQUFjLENBQWQ7QUFDSDtBQUNKLGlCQU5ELE1BTU87QUFDSCxpQ0FBYSxZQUFZLENBQVosSUFBaUIsWUFBWSxDQUFaLEVBQWUsVUFBZixHQUE0QixDQUFDLENBQTlDLEdBQWtELENBQS9EO0FBQ0g7O0FBRUQsOEJBQWMsQ0FBQyxFQUFFLEtBQUYsQ0FBUSxLQUFSLEtBQWtCLFlBQVksVUFBWixFQUFuQixJQUErQyxDQUE3RDtBQUNIO0FBQ0o7O0FBRUQsZUFBTyxVQUFQO0FBRUgsS0E3RkQ7O0FBK0ZBLFVBQU0sU0FBTixDQUFnQixTQUFoQixHQUE0QixNQUFNLFNBQU4sQ0FBZ0IsY0FBaEIsR0FBaUMsVUFBUyxNQUFULEVBQWlCOztBQUUxRSxZQUFJLElBQUksSUFBUjs7QUFFQSxlQUFPLEVBQUUsT0FBRixDQUFVLE1BQVYsQ0FBUDtBQUVILEtBTkQ7O0FBUUEsVUFBTSxTQUFOLENBQWdCLG1CQUFoQixHQUFzQyxZQUFXOztBQUU3QyxZQUFJLElBQUksSUFBUjtBQUFBLFlBQ0ksYUFBYSxDQURqQjtBQUFBLFlBRUksVUFBVSxDQUZkO0FBQUEsWUFHSSxVQUFVLEVBSGQ7QUFBQSxZQUlJLEdBSko7O0FBTUEsWUFBSSxFQUFFLE9BQUYsQ0FBVSxRQUFWLEtBQXVCLEtBQTNCLEVBQWtDO0FBQzlCLGtCQUFNLEVBQUUsVUFBUjtBQUNILFNBRkQsTUFFTztBQUNILHlCQUFhLEVBQUUsT0FBRixDQUFVLGNBQVYsR0FBMkIsQ0FBQyxDQUF6QztBQUNBLHNCQUFVLEVBQUUsT0FBRixDQUFVLGNBQVYsR0FBMkIsQ0FBQyxDQUF0QztBQUNBLGtCQUFNLEVBQUUsVUFBRixHQUFlLENBQXJCO0FBQ0g7O0FBRUQsZUFBTyxhQUFhLEdBQXBCLEVBQXlCO0FBQ3JCLG9CQUFRLElBQVIsQ0FBYSxVQUFiO0FBQ0EseUJBQWEsVUFBVSxFQUFFLE9BQUYsQ0FBVSxjQUFqQztBQUNBLHVCQUFXLEVBQUUsT0FBRixDQUFVLGNBQVYsSUFBNEIsRUFBRSxPQUFGLENBQVUsWUFBdEMsR0FBcUQsRUFBRSxPQUFGLENBQVUsY0FBL0QsR0FBZ0YsRUFBRSxPQUFGLENBQVUsWUFBckc7QUFDSDs7QUFFRCxlQUFPLE9BQVA7QUFFSCxLQXhCRDs7QUEwQkEsVUFBTSxTQUFOLENBQWdCLFFBQWhCLEdBQTJCLFlBQVc7O0FBRWxDLGVBQU8sSUFBUDtBQUVILEtBSkQ7O0FBTUEsVUFBTSxTQUFOLENBQWdCLGFBQWhCLEdBQWdDLFlBQVc7O0FBRXZDLFlBQUksSUFBSSxJQUFSO0FBQUEsWUFDSSxlQURKO0FBQUEsWUFDcUIsV0FEckI7QUFBQSxZQUNrQyxZQURsQzs7QUFHQSx1QkFBZSxFQUFFLE9BQUYsQ0FBVSxVQUFWLEtBQXlCLElBQXpCLEdBQWdDLEVBQUUsVUFBRixHQUFlLEtBQUssS0FBTCxDQUFXLEVBQUUsT0FBRixDQUFVLFlBQVYsR0FBeUIsQ0FBcEMsQ0FBL0MsR0FBd0YsQ0FBdkc7O0FBRUEsWUFBSSxFQUFFLE9BQUYsQ0FBVSxZQUFWLEtBQTJCLElBQS9CLEVBQXFDO0FBQ2pDLGNBQUUsV0FBRixDQUFjLElBQWQsQ0FBbUIsY0FBbkIsRUFBbUMsSUFBbkMsQ0FBd0MsVUFBUyxLQUFULEVBQWdCLEtBQWhCLEVBQXVCO0FBQzNELG9CQUFJLE1BQU0sVUFBTixHQUFtQixZQUFuQixHQUFtQyxFQUFFLEtBQUYsRUFBUyxVQUFULEtBQXdCLENBQTNELEdBQWlFLEVBQUUsU0FBRixHQUFjLENBQUMsQ0FBcEYsRUFBd0Y7QUFDcEYsa0NBQWMsS0FBZDtBQUNBLDJCQUFPLEtBQVA7QUFDSDtBQUNKLGFBTEQ7O0FBT0EsOEJBQWtCLEtBQUssR0FBTCxDQUFTLEVBQUUsV0FBRixFQUFlLElBQWYsQ0FBb0Isa0JBQXBCLElBQTBDLEVBQUUsWUFBckQsS0FBc0UsQ0FBeEY7O0FBRUEsbUJBQU8sZUFBUDtBQUVILFNBWkQsTUFZTztBQUNILG1CQUFPLEVBQUUsT0FBRixDQUFVLGNBQWpCO0FBQ0g7QUFFSixLQXZCRDs7QUF5QkEsVUFBTSxTQUFOLENBQWdCLElBQWhCLEdBQXVCLE1BQU0sU0FBTixDQUFnQixTQUFoQixHQUE0QixVQUFTLEtBQVQsRUFBZ0IsV0FBaEIsRUFBNkI7O0FBRTVFLFlBQUksSUFBSSxJQUFSOztBQUVBLFVBQUUsV0FBRixDQUFjO0FBQ1Ysa0JBQU07QUFDRix5QkFBUyxPQURQO0FBRUYsdUJBQU8sU0FBUyxLQUFUO0FBRkw7QUFESSxTQUFkLEVBS0csV0FMSDtBQU9ILEtBWEQ7O0FBYUEsVUFBTSxTQUFOLENBQWdCLElBQWhCLEdBQXVCLFVBQVMsUUFBVCxFQUFtQjs7QUFFdEMsWUFBSSxJQUFJLElBQVI7O0FBRUEsWUFBSSxDQUFDLEVBQUUsRUFBRSxPQUFKLEVBQWEsUUFBYixDQUFzQixtQkFBdEIsQ0FBTCxFQUFpRDs7QUFFN0MsY0FBRSxFQUFFLE9BQUosRUFBYSxRQUFiLENBQXNCLG1CQUF0Qjs7QUFFQSxjQUFFLFNBQUY7QUFDQSxjQUFFLFFBQUY7QUFDQSxjQUFFLFFBQUY7QUFDQSxjQUFFLFNBQUY7QUFDQSxjQUFFLFVBQUY7QUFDQSxjQUFFLGdCQUFGO0FBQ0EsY0FBRSxZQUFGO0FBQ0EsY0FBRSxVQUFGO0FBQ0EsY0FBRSxlQUFGLENBQWtCLElBQWxCO0FBQ0EsY0FBRSxZQUFGO0FBRUg7O0FBRUQsWUFBSSxRQUFKLEVBQWM7QUFDVixjQUFFLE9BQUYsQ0FBVSxPQUFWLENBQWtCLE1BQWxCLEVBQTBCLENBQUMsQ0FBRCxDQUExQjtBQUNIOztBQUVELFlBQUksRUFBRSxPQUFGLENBQVUsYUFBVixLQUE0QixJQUFoQyxFQUFzQztBQUNsQyxjQUFFLE9BQUY7QUFDSDs7QUFFRCxZQUFLLEVBQUUsT0FBRixDQUFVLFFBQWYsRUFBMEI7O0FBRXRCLGNBQUUsTUFBRixHQUFXLEtBQVg7QUFDQSxjQUFFLFFBQUY7QUFFSDtBQUVKLEtBcENEOztBQXNDQSxVQUFNLFNBQU4sQ0FBZ0IsT0FBaEIsR0FBMEIsWUFBVztBQUNqQyxZQUFJLElBQUksSUFBUjtBQUNBLFVBQUUsT0FBRixDQUFVLEdBQVYsQ0FBYyxFQUFFLFdBQUYsQ0FBYyxJQUFkLENBQW1CLGVBQW5CLENBQWQsRUFBbUQsSUFBbkQsQ0FBd0Q7QUFDcEQsMkJBQWUsTUFEcUM7QUFFcEQsd0JBQVk7QUFGd0MsU0FBeEQsRUFHRyxJQUhILENBR1EsMEJBSFIsRUFHb0MsSUFIcEMsQ0FHeUM7QUFDckMsd0JBQVk7QUFEeUIsU0FIekM7O0FBT0EsVUFBRSxXQUFGLENBQWMsSUFBZCxDQUFtQixNQUFuQixFQUEyQixTQUEzQjs7QUFFQSxVQUFFLE9BQUYsQ0FBVSxHQUFWLENBQWMsRUFBRSxXQUFGLENBQWMsSUFBZCxDQUFtQixlQUFuQixDQUFkLEVBQW1ELElBQW5ELENBQXdELFVBQVMsQ0FBVCxFQUFZO0FBQ2hFLGNBQUUsSUFBRixFQUFRLElBQVIsQ0FBYTtBQUNULHdCQUFRLFFBREM7QUFFVCxvQ0FBb0IsZ0JBQWdCLEVBQUUsV0FBbEIsR0FBZ0MsQ0FBaEMsR0FBb0M7QUFGL0MsYUFBYjtBQUlILFNBTEQ7O0FBT0EsWUFBSSxFQUFFLEtBQUYsS0FBWSxJQUFoQixFQUFzQjtBQUNsQixjQUFFLEtBQUYsQ0FBUSxJQUFSLENBQWEsTUFBYixFQUFxQixTQUFyQixFQUFnQyxJQUFoQyxDQUFxQyxJQUFyQyxFQUEyQyxJQUEzQyxDQUFnRCxVQUFTLENBQVQsRUFBWTtBQUN4RCxrQkFBRSxJQUFGLEVBQVEsSUFBUixDQUFhO0FBQ1QsNEJBQVEsY0FEQztBQUVULHFDQUFpQixPQUZSO0FBR1QscUNBQWlCLGVBQWUsRUFBRSxXQUFqQixHQUErQixDQUEvQixHQUFtQyxFQUgzQztBQUlULDBCQUFNLGdCQUFnQixFQUFFLFdBQWxCLEdBQWdDLENBQWhDLEdBQW9DO0FBSmpDLGlCQUFiO0FBTUgsYUFQRCxFQVFLLEtBUkwsR0FRYSxJQVJiLENBUWtCLGVBUmxCLEVBUW1DLE1BUm5DLEVBUTJDLEdBUjNDLEdBU0ssSUFUTCxDQVNVLFFBVFYsRUFTb0IsSUFUcEIsQ0FTeUIsTUFUekIsRUFTaUMsUUFUakMsRUFTMkMsR0FUM0MsR0FVSyxPQVZMLENBVWEsS0FWYixFQVVvQixJQVZwQixDQVV5QixNQVZ6QixFQVVpQyxTQVZqQztBQVdIO0FBQ0QsVUFBRSxXQUFGO0FBRUgsS0FqQ0Q7O0FBbUNBLFVBQU0sU0FBTixDQUFnQixlQUFoQixHQUFrQyxZQUFXOztBQUV6QyxZQUFJLElBQUksSUFBUjs7QUFFQSxZQUFJLEVBQUUsT0FBRixDQUFVLE1BQVYsS0FBcUIsSUFBckIsSUFBNkIsRUFBRSxVQUFGLEdBQWUsRUFBRSxPQUFGLENBQVUsWUFBMUQsRUFBd0U7QUFDcEUsY0FBRSxVQUFGLENBQ0ksR0FESixDQUNRLGFBRFIsRUFFSSxFQUZKLENBRU8sYUFGUCxFQUVzQjtBQUNkLHlCQUFTO0FBREssYUFGdEIsRUFJTSxFQUFFLFdBSlI7QUFLQSxjQUFFLFVBQUYsQ0FDSSxHQURKLENBQ1EsYUFEUixFQUVJLEVBRkosQ0FFTyxhQUZQLEVBRXNCO0FBQ2QseUJBQVM7QUFESyxhQUZ0QixFQUlNLEVBQUUsV0FKUjtBQUtIO0FBRUosS0FqQkQ7O0FBbUJBLFVBQU0sU0FBTixDQUFnQixhQUFoQixHQUFnQyxZQUFXOztBQUV2QyxZQUFJLElBQUksSUFBUjs7QUFFQSxZQUFJLEVBQUUsT0FBRixDQUFVLElBQVYsS0FBbUIsSUFBbkIsSUFBMkIsRUFBRSxVQUFGLEdBQWUsRUFBRSxPQUFGLENBQVUsWUFBeEQsRUFBc0U7QUFDbEUsY0FBRSxJQUFGLEVBQVEsRUFBRSxLQUFWLEVBQWlCLEVBQWpCLENBQW9CLGFBQXBCLEVBQW1DO0FBQy9CLHlCQUFTO0FBRHNCLGFBQW5DLEVBRUcsRUFBRSxXQUZMO0FBR0g7O0FBRUQsWUFBSyxFQUFFLE9BQUYsQ0FBVSxJQUFWLEtBQW1CLElBQW5CLElBQTJCLEVBQUUsT0FBRixDQUFVLGdCQUFWLEtBQStCLElBQS9ELEVBQXNFOztBQUVsRSxjQUFFLElBQUYsRUFBUSxFQUFFLEtBQVYsRUFDSyxFQURMLENBQ1Esa0JBRFIsRUFDNEIsRUFBRSxLQUFGLENBQVEsRUFBRSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLElBQXhCLENBRDVCLEVBRUssRUFGTCxDQUVRLGtCQUZSLEVBRTRCLEVBQUUsS0FBRixDQUFRLEVBQUUsU0FBVixFQUFxQixDQUFyQixFQUF3QixLQUF4QixDQUY1QjtBQUlIO0FBRUosS0FsQkQ7O0FBb0JBLFVBQU0sU0FBTixDQUFnQixlQUFoQixHQUFrQyxZQUFXOztBQUV6QyxZQUFJLElBQUksSUFBUjs7QUFFQSxZQUFLLEVBQUUsT0FBRixDQUFVLFlBQWYsRUFBOEI7O0FBRTFCLGNBQUUsS0FBRixDQUFRLEVBQVIsQ0FBVyxrQkFBWCxFQUErQixFQUFFLEtBQUYsQ0FBUSxFQUFFLFNBQVYsRUFBcUIsQ0FBckIsRUFBd0IsSUFBeEIsQ0FBL0I7QUFDQSxjQUFFLEtBQUYsQ0FBUSxFQUFSLENBQVcsa0JBQVgsRUFBK0IsRUFBRSxLQUFGLENBQVEsRUFBRSxTQUFWLEVBQXFCLENBQXJCLEVBQXdCLEtBQXhCLENBQS9CO0FBRUg7QUFFSixLQVhEOztBQWFBLFVBQU0sU0FBTixDQUFnQixnQkFBaEIsR0FBbUMsWUFBVzs7QUFFMUMsWUFBSSxJQUFJLElBQVI7O0FBRUEsVUFBRSxlQUFGOztBQUVBLFVBQUUsYUFBRjtBQUNBLFVBQUUsZUFBRjs7QUFFQSxVQUFFLEtBQUYsQ0FBUSxFQUFSLENBQVcsa0NBQVgsRUFBK0M7QUFDM0Msb0JBQVE7QUFEbUMsU0FBL0MsRUFFRyxFQUFFLFlBRkw7QUFHQSxVQUFFLEtBQUYsQ0FBUSxFQUFSLENBQVcsaUNBQVgsRUFBOEM7QUFDMUMsb0JBQVE7QUFEa0MsU0FBOUMsRUFFRyxFQUFFLFlBRkw7QUFHQSxVQUFFLEtBQUYsQ0FBUSxFQUFSLENBQVcsOEJBQVgsRUFBMkM7QUFDdkMsb0JBQVE7QUFEK0IsU0FBM0MsRUFFRyxFQUFFLFlBRkw7QUFHQSxVQUFFLEtBQUYsQ0FBUSxFQUFSLENBQVcsb0NBQVgsRUFBaUQ7QUFDN0Msb0JBQVE7QUFEcUMsU0FBakQsRUFFRyxFQUFFLFlBRkw7O0FBSUEsVUFBRSxLQUFGLENBQVEsRUFBUixDQUFXLGFBQVgsRUFBMEIsRUFBRSxZQUE1Qjs7QUFFQSxVQUFFLFFBQUYsRUFBWSxFQUFaLENBQWUsRUFBRSxnQkFBakIsRUFBbUMsRUFBRSxLQUFGLENBQVEsRUFBRSxVQUFWLEVBQXNCLENBQXRCLENBQW5DOztBQUVBLFlBQUksRUFBRSxPQUFGLENBQVUsYUFBVixLQUE0QixJQUFoQyxFQUFzQztBQUNsQyxjQUFFLEtBQUYsQ0FBUSxFQUFSLENBQVcsZUFBWCxFQUE0QixFQUFFLFVBQTlCO0FBQ0g7O0FBRUQsWUFBSSxFQUFFLE9BQUYsQ0FBVSxhQUFWLEtBQTRCLElBQWhDLEVBQXNDO0FBQ2xDLGNBQUUsRUFBRSxXQUFKLEVBQWlCLFFBQWpCLEdBQTRCLEVBQTVCLENBQStCLGFBQS9CLEVBQThDLEVBQUUsYUFBaEQ7QUFDSDs7QUFFRCxVQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEsbUNBQW1DLEVBQUUsV0FBbEQsRUFBK0QsRUFBRSxLQUFGLENBQVEsRUFBRSxpQkFBVixFQUE2QixDQUE3QixDQUEvRDs7QUFFQSxVQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEsd0JBQXdCLEVBQUUsV0FBdkMsRUFBb0QsRUFBRSxLQUFGLENBQVEsRUFBRSxNQUFWLEVBQWtCLENBQWxCLENBQXBEOztBQUVBLFVBQUUsbUJBQUYsRUFBdUIsRUFBRSxXQUF6QixFQUFzQyxFQUF0QyxDQUF5QyxXQUF6QyxFQUFzRCxFQUFFLGNBQXhEOztBQUVBLFVBQUUsTUFBRixFQUFVLEVBQVYsQ0FBYSxzQkFBc0IsRUFBRSxXQUFyQyxFQUFrRCxFQUFFLFdBQXBEO0FBQ0EsVUFBRSxRQUFGLEVBQVksRUFBWixDQUFlLHVCQUF1QixFQUFFLFdBQXhDLEVBQXFELEVBQUUsV0FBdkQ7QUFFSCxLQTNDRDs7QUE2Q0EsVUFBTSxTQUFOLENBQWdCLE1BQWhCLEdBQXlCLFlBQVc7O0FBRWhDLFlBQUksSUFBSSxJQUFSOztBQUVBLFlBQUksRUFBRSxPQUFGLENBQVUsTUFBVixLQUFxQixJQUFyQixJQUE2QixFQUFFLFVBQUYsR0FBZSxFQUFFLE9BQUYsQ0FBVSxZQUExRCxFQUF3RTs7QUFFcEUsY0FBRSxVQUFGLENBQWEsSUFBYjtBQUNBLGNBQUUsVUFBRixDQUFhLElBQWI7QUFFSDs7QUFFRCxZQUFJLEVBQUUsT0FBRixDQUFVLElBQVYsS0FBbUIsSUFBbkIsSUFBMkIsRUFBRSxVQUFGLEdBQWUsRUFBRSxPQUFGLENBQVUsWUFBeEQsRUFBc0U7O0FBRWxFLGNBQUUsS0FBRixDQUFRLElBQVI7QUFFSDtBQUVKLEtBakJEOztBQW1CQSxVQUFNLFNBQU4sQ0FBZ0IsVUFBaEIsR0FBNkIsVUFBUyxLQUFULEVBQWdCOztBQUV6QyxZQUFJLElBQUksSUFBUjtBQUNDO0FBQ0QsWUFBRyxDQUFDLE1BQU0sTUFBTixDQUFhLE9BQWIsQ0FBcUIsS0FBckIsQ0FBMkIsdUJBQTNCLENBQUosRUFBeUQ7QUFDckQsZ0JBQUksTUFBTSxPQUFOLEtBQWtCLEVBQWxCLElBQXdCLEVBQUUsT0FBRixDQUFVLGFBQVYsS0FBNEIsSUFBeEQsRUFBOEQ7QUFDMUQsa0JBQUUsV0FBRixDQUFjO0FBQ1YsMEJBQU07QUFDRixpQ0FBUyxFQUFFLE9BQUYsQ0FBVSxHQUFWLEtBQWtCLElBQWxCLEdBQXlCLE1BQXpCLEdBQW1DO0FBRDFDO0FBREksaUJBQWQ7QUFLSCxhQU5ELE1BTU8sSUFBSSxNQUFNLE9BQU4sS0FBa0IsRUFBbEIsSUFBd0IsRUFBRSxPQUFGLENBQVUsYUFBVixLQUE0QixJQUF4RCxFQUE4RDtBQUNqRSxrQkFBRSxXQUFGLENBQWM7QUFDViwwQkFBTTtBQUNGLGlDQUFTLEVBQUUsT0FBRixDQUFVLEdBQVYsS0FBa0IsSUFBbEIsR0FBeUIsVUFBekIsR0FBc0M7QUFEN0M7QUFESSxpQkFBZDtBQUtIO0FBQ0o7QUFFSixLQXBCRDs7QUFzQkEsVUFBTSxTQUFOLENBQWdCLFFBQWhCLEdBQTJCLFlBQVc7O0FBRWxDLFlBQUksSUFBSSxJQUFSO0FBQUEsWUFDSSxTQURKO0FBQUEsWUFDZSxVQURmO0FBQUEsWUFDMkIsVUFEM0I7QUFBQSxZQUN1QyxRQUR2Qzs7QUFHQSxpQkFBUyxVQUFULENBQW9CLFdBQXBCLEVBQWlDOztBQUU3QixjQUFFLGdCQUFGLEVBQW9CLFdBQXBCLEVBQWlDLElBQWpDLENBQXNDLFlBQVc7O0FBRTdDLG9CQUFJLFFBQVEsRUFBRSxJQUFGLENBQVo7QUFBQSxvQkFDSSxjQUFjLEVBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxXQUFiLENBRGxCO0FBQUEsb0JBRUksY0FBYyxTQUFTLGFBQVQsQ0FBdUIsS0FBdkIsQ0FGbEI7O0FBSUEsNEJBQVksTUFBWixHQUFxQixZQUFXOztBQUU1QiwwQkFDSyxPQURMLENBQ2EsRUFBRSxTQUFTLENBQVgsRUFEYixFQUM2QixHQUQ3QixFQUNrQyxZQUFXO0FBQ3JDLDhCQUNLLElBREwsQ0FDVSxLQURWLEVBQ2lCLFdBRGpCLEVBRUssT0FGTCxDQUVhLEVBQUUsU0FBUyxDQUFYLEVBRmIsRUFFNkIsR0FGN0IsRUFFa0MsWUFBVztBQUNyQyxrQ0FDSyxVQURMLENBQ2dCLFdBRGhCLEVBRUssV0FGTCxDQUVpQixlQUZqQjtBQUdILHlCQU5MO0FBT0EsMEJBQUUsT0FBRixDQUFVLE9BQVYsQ0FBa0IsWUFBbEIsRUFBZ0MsQ0FBQyxDQUFELEVBQUksS0FBSixFQUFXLFdBQVgsQ0FBaEM7QUFDSCxxQkFWTDtBQVlILGlCQWREOztBQWdCQSw0QkFBWSxPQUFaLEdBQXNCLFlBQVc7O0FBRTdCLDBCQUNLLFVBREwsQ0FDaUIsV0FEakIsRUFFSyxXQUZMLENBRWtCLGVBRmxCLEVBR0ssUUFITCxDQUdlLHNCQUhmOztBQUtBLHNCQUFFLE9BQUYsQ0FBVSxPQUFWLENBQWtCLGVBQWxCLEVBQW1DLENBQUUsQ0FBRixFQUFLLEtBQUwsRUFBWSxXQUFaLENBQW5DO0FBRUgsaUJBVEQ7O0FBV0EsNEJBQVksR0FBWixHQUFrQixXQUFsQjtBQUVILGFBbkNEO0FBcUNIOztBQUVELFlBQUksRUFBRSxPQUFGLENBQVUsVUFBVixLQUF5QixJQUE3QixFQUFtQztBQUMvQixnQkFBSSxFQUFFLE9BQUYsQ0FBVSxRQUFWLEtBQXVCLElBQTNCLEVBQWlDO0FBQzdCLDZCQUFhLEVBQUUsWUFBRixJQUFrQixFQUFFLE9BQUYsQ0FBVSxZQUFWLEdBQXlCLENBQXpCLEdBQTZCLENBQS9DLENBQWI7QUFDQSwyQkFBVyxhQUFhLEVBQUUsT0FBRixDQUFVLFlBQXZCLEdBQXNDLENBQWpEO0FBQ0gsYUFIRCxNQUdPO0FBQ0gsNkJBQWEsS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLEVBQUUsWUFBRixJQUFrQixFQUFFLE9BQUYsQ0FBVSxZQUFWLEdBQXlCLENBQXpCLEdBQTZCLENBQS9DLENBQVosQ0FBYjtBQUNBLDJCQUFXLEtBQUssRUFBRSxPQUFGLENBQVUsWUFBVixHQUF5QixDQUF6QixHQUE2QixDQUFsQyxJQUF1QyxFQUFFLFlBQXBEO0FBQ0g7QUFDSixTQVJELE1BUU87QUFDSCx5QkFBYSxFQUFFLE9BQUYsQ0FBVSxRQUFWLEdBQXFCLEVBQUUsT0FBRixDQUFVLFlBQVYsR0FBeUIsRUFBRSxZQUFoRCxHQUErRCxFQUFFLFlBQTlFO0FBQ0EsdUJBQVcsS0FBSyxJQUFMLENBQVUsYUFBYSxFQUFFLE9BQUYsQ0FBVSxZQUFqQyxDQUFYO0FBQ0EsZ0JBQUksRUFBRSxPQUFGLENBQVUsSUFBVixLQUFtQixJQUF2QixFQUE2QjtBQUN6QixvQkFBSSxhQUFhLENBQWpCLEVBQW9CO0FBQ3BCLG9CQUFJLFlBQVksRUFBRSxVQUFsQixFQUE4QjtBQUNqQztBQUNKOztBQUVELG9CQUFZLEVBQUUsT0FBRixDQUFVLElBQVYsQ0FBZSxjQUFmLEVBQStCLEtBQS9CLENBQXFDLFVBQXJDLEVBQWlELFFBQWpELENBQVo7QUFDQSxtQkFBVyxTQUFYOztBQUVBLFlBQUksRUFBRSxVQUFGLElBQWdCLEVBQUUsT0FBRixDQUFVLFlBQTlCLEVBQTRDO0FBQ3hDLHlCQUFhLEVBQUUsT0FBRixDQUFVLElBQVYsQ0FBZSxjQUFmLENBQWI7QUFDQSx1QkFBVyxVQUFYO0FBQ0gsU0FIRCxNQUlBLElBQUksRUFBRSxZQUFGLElBQWtCLEVBQUUsVUFBRixHQUFlLEVBQUUsT0FBRixDQUFVLFlBQS9DLEVBQTZEO0FBQ3pELHlCQUFhLEVBQUUsT0FBRixDQUFVLElBQVYsQ0FBZSxlQUFmLEVBQWdDLEtBQWhDLENBQXNDLENBQXRDLEVBQXlDLEVBQUUsT0FBRixDQUFVLFlBQW5ELENBQWI7QUFDQSx1QkFBVyxVQUFYO0FBQ0gsU0FIRCxNQUdPLElBQUksRUFBRSxZQUFGLEtBQW1CLENBQXZCLEVBQTBCO0FBQzdCLHlCQUFhLEVBQUUsT0FBRixDQUFVLElBQVYsQ0FBZSxlQUFmLEVBQWdDLEtBQWhDLENBQXNDLEVBQUUsT0FBRixDQUFVLFlBQVYsR0FBeUIsQ0FBQyxDQUFoRSxDQUFiO0FBQ0EsdUJBQVcsVUFBWDtBQUNIO0FBRUosS0E5RUQ7O0FBZ0ZBLFVBQU0sU0FBTixDQUFnQixVQUFoQixHQUE2QixZQUFXOztBQUVwQyxZQUFJLElBQUksSUFBUjs7QUFFQSxVQUFFLFdBQUY7O0FBRUEsVUFBRSxXQUFGLENBQWMsR0FBZCxDQUFrQjtBQUNkLHFCQUFTO0FBREssU0FBbEI7O0FBSUEsVUFBRSxPQUFGLENBQVUsV0FBVixDQUFzQixlQUF0Qjs7QUFFQSxVQUFFLE1BQUY7O0FBRUEsWUFBSSxFQUFFLE9BQUYsQ0FBVSxRQUFWLEtBQXVCLGFBQTNCLEVBQTBDO0FBQ3RDLGNBQUUsbUJBQUY7QUFDSDtBQUVKLEtBbEJEOztBQW9CQSxVQUFNLFNBQU4sQ0FBZ0IsSUFBaEIsR0FBdUIsTUFBTSxTQUFOLENBQWdCLFNBQWhCLEdBQTRCLFlBQVc7O0FBRTFELFlBQUksSUFBSSxJQUFSOztBQUVBLFVBQUUsV0FBRixDQUFjO0FBQ1Ysa0JBQU07QUFDRix5QkFBUztBQURQO0FBREksU0FBZDtBQU1ILEtBVkQ7O0FBWUEsVUFBTSxTQUFOLENBQWdCLGlCQUFoQixHQUFvQyxZQUFXOztBQUUzQyxZQUFJLElBQUksSUFBUjs7QUFFQSxVQUFFLGVBQUY7QUFDQSxVQUFFLFdBQUY7QUFFSCxLQVBEOztBQVNBLFVBQU0sU0FBTixDQUFnQixLQUFoQixHQUF3QixNQUFNLFNBQU4sQ0FBZ0IsVUFBaEIsR0FBNkIsWUFBVzs7QUFFNUQsWUFBSSxJQUFJLElBQVI7O0FBRUEsVUFBRSxhQUFGO0FBQ0EsVUFBRSxNQUFGLEdBQVcsSUFBWDtBQUVILEtBUEQ7O0FBU0EsVUFBTSxTQUFOLENBQWdCLElBQWhCLEdBQXVCLE1BQU0sU0FBTixDQUFnQixTQUFoQixHQUE0QixZQUFXOztBQUUxRCxZQUFJLElBQUksSUFBUjs7QUFFQSxVQUFFLFFBQUY7QUFDQSxVQUFFLE9BQUYsQ0FBVSxRQUFWLEdBQXFCLElBQXJCO0FBQ0EsVUFBRSxNQUFGLEdBQVcsS0FBWDtBQUNBLFVBQUUsUUFBRixHQUFhLEtBQWI7QUFDQSxVQUFFLFdBQUYsR0FBZ0IsS0FBaEI7QUFFSCxLQVZEOztBQVlBLFVBQU0sU0FBTixDQUFnQixTQUFoQixHQUE0QixVQUFTLEtBQVQsRUFBZ0I7O0FBRXhDLFlBQUksSUFBSSxJQUFSOztBQUVBLFlBQUksQ0FBQyxFQUFFLFNBQVAsRUFBbUI7O0FBRWYsY0FBRSxPQUFGLENBQVUsT0FBVixDQUFrQixhQUFsQixFQUFpQyxDQUFDLENBQUQsRUFBSSxLQUFKLENBQWpDOztBQUVBLGNBQUUsU0FBRixHQUFjLEtBQWQ7O0FBRUEsY0FBRSxXQUFGOztBQUVBLGNBQUUsU0FBRixHQUFjLElBQWQ7O0FBRUEsZ0JBQUssRUFBRSxPQUFGLENBQVUsUUFBZixFQUEwQjtBQUN0QixrQkFBRSxRQUFGO0FBQ0g7O0FBRUQsZ0JBQUksRUFBRSxPQUFGLENBQVUsYUFBVixLQUE0QixJQUFoQyxFQUFzQztBQUNsQyxrQkFBRSxPQUFGO0FBQ0g7QUFFSjtBQUVKLEtBeEJEOztBQTBCQSxVQUFNLFNBQU4sQ0FBZ0IsSUFBaEIsR0FBdUIsTUFBTSxTQUFOLENBQWdCLFNBQWhCLEdBQTRCLFlBQVc7O0FBRTFELFlBQUksSUFBSSxJQUFSOztBQUVBLFVBQUUsV0FBRixDQUFjO0FBQ1Ysa0JBQU07QUFDRix5QkFBUztBQURQO0FBREksU0FBZDtBQU1ILEtBVkQ7O0FBWUEsVUFBTSxTQUFOLENBQWdCLGNBQWhCLEdBQWlDLFVBQVMsS0FBVCxFQUFnQjs7QUFFN0MsY0FBTSxjQUFOO0FBRUgsS0FKRDs7QUFNQSxVQUFNLFNBQU4sQ0FBZ0IsbUJBQWhCLEdBQXNDLFVBQVUsUUFBVixFQUFxQjs7QUFFdkQsbUJBQVcsWUFBWSxDQUF2Qjs7QUFFQSxZQUFJLElBQUksSUFBUjtBQUFBLFlBQ0ksY0FBYyxFQUFHLGdCQUFILEVBQXFCLEVBQUUsT0FBdkIsQ0FEbEI7QUFBQSxZQUVJLEtBRko7QUFBQSxZQUdJLFdBSEo7QUFBQSxZQUlJLFdBSko7O0FBTUEsWUFBSyxZQUFZLE1BQWpCLEVBQTBCOztBQUV0QixvQkFBUSxZQUFZLEtBQVosRUFBUjtBQUNBLDBCQUFjLE1BQU0sSUFBTixDQUFXLFdBQVgsQ0FBZDtBQUNBLDBCQUFjLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFkOztBQUVBLHdCQUFZLE1BQVosR0FBcUIsWUFBVzs7QUFFNUIsc0JBQ0ssSUFETCxDQUNXLEtBRFgsRUFDa0IsV0FEbEIsRUFFSyxVQUZMLENBRWdCLFdBRmhCLEVBR0ssV0FITCxDQUdpQixlQUhqQjs7QUFLQSxvQkFBSyxFQUFFLE9BQUYsQ0FBVSxjQUFWLEtBQTZCLElBQWxDLEVBQXlDO0FBQ3JDLHNCQUFFLFdBQUY7QUFDSDs7QUFFRCxrQkFBRSxPQUFGLENBQVUsT0FBVixDQUFrQixZQUFsQixFQUFnQyxDQUFFLENBQUYsRUFBSyxLQUFMLEVBQVksV0FBWixDQUFoQztBQUNBLGtCQUFFLG1CQUFGO0FBRUgsYUFkRDs7QUFnQkEsd0JBQVksT0FBWixHQUFzQixZQUFXOztBQUU3QixvQkFBSyxXQUFXLENBQWhCLEVBQW9COztBQUVoQjs7Ozs7QUFLQSwrQkFBWSxZQUFXO0FBQ25CLDBCQUFFLG1CQUFGLENBQXVCLFdBQVcsQ0FBbEM7QUFDSCxxQkFGRCxFQUVHLEdBRkg7QUFJSCxpQkFYRCxNQVdPOztBQUVILDBCQUNLLFVBREwsQ0FDaUIsV0FEakIsRUFFSyxXQUZMLENBRWtCLGVBRmxCLEVBR0ssUUFITCxDQUdlLHNCQUhmOztBQUtBLHNCQUFFLE9BQUYsQ0FBVSxPQUFWLENBQWtCLGVBQWxCLEVBQW1DLENBQUUsQ0FBRixFQUFLLEtBQUwsRUFBWSxXQUFaLENBQW5DOztBQUVBLHNCQUFFLG1CQUFGO0FBRUg7QUFFSixhQTFCRDs7QUE0QkEsd0JBQVksR0FBWixHQUFrQixXQUFsQjtBQUVILFNBcERELE1Bb0RPOztBQUVILGNBQUUsT0FBRixDQUFVLE9BQVYsQ0FBa0IsaUJBQWxCLEVBQXFDLENBQUUsQ0FBRixDQUFyQztBQUVIO0FBRUosS0FwRUQ7O0FBc0VBLFVBQU0sU0FBTixDQUFnQixPQUFoQixHQUEwQixVQUFVLFlBQVYsRUFBeUI7O0FBRS9DLFlBQUksSUFBSSxJQUFSO0FBQUEsWUFBYyxZQUFkO0FBQUEsWUFBNEIsZ0JBQTVCOztBQUVBLDJCQUFtQixFQUFFLFVBQUYsR0FBZSxFQUFFLE9BQUYsQ0FBVSxZQUE1Qzs7QUFFQTtBQUNBO0FBQ0EsWUFBSSxDQUFDLEVBQUUsT0FBRixDQUFVLFFBQVgsSUFBeUIsRUFBRSxZQUFGLEdBQWlCLGdCQUE5QyxFQUFrRTtBQUM5RCxjQUFFLFlBQUYsR0FBaUIsZ0JBQWpCO0FBQ0g7O0FBRUQ7QUFDQSxZQUFLLEVBQUUsVUFBRixJQUFnQixFQUFFLE9BQUYsQ0FBVSxZQUEvQixFQUE4QztBQUMxQyxjQUFFLFlBQUYsR0FBaUIsQ0FBakI7QUFFSDs7QUFFRCx1QkFBZSxFQUFFLFlBQWpCOztBQUVBLFVBQUUsT0FBRixDQUFVLElBQVY7O0FBRUEsVUFBRSxNQUFGLENBQVMsQ0FBVCxFQUFZLEVBQUUsUUFBZCxFQUF3QixFQUFFLGNBQWMsWUFBaEIsRUFBeEI7O0FBRUEsVUFBRSxJQUFGOztBQUVBLFlBQUksQ0FBQyxZQUFMLEVBQW9COztBQUVoQixjQUFFLFdBQUYsQ0FBYztBQUNWLHNCQUFNO0FBQ0YsNkJBQVMsT0FEUDtBQUVGLDJCQUFPO0FBRkw7QUFESSxhQUFkLEVBS0csS0FMSDtBQU9IO0FBRUosS0FyQ0Q7O0FBdUNBLFVBQU0sU0FBTixDQUFnQixtQkFBaEIsR0FBc0MsWUFBVzs7QUFFN0MsWUFBSSxJQUFJLElBQVI7QUFBQSxZQUFjLFVBQWQ7QUFBQSxZQUEwQixpQkFBMUI7QUFBQSxZQUE2QyxDQUE3QztBQUFBLFlBQ0kscUJBQXFCLEVBQUUsT0FBRixDQUFVLFVBQVYsSUFBd0IsSUFEakQ7O0FBR0EsWUFBSyxFQUFFLElBQUYsQ0FBTyxrQkFBUCxNQUErQixPQUEvQixJQUEwQyxtQkFBbUIsTUFBbEUsRUFBMkU7O0FBRXZFLGNBQUUsU0FBRixHQUFjLEVBQUUsT0FBRixDQUFVLFNBQVYsSUFBdUIsUUFBckM7O0FBRUEsaUJBQU0sVUFBTixJQUFvQixrQkFBcEIsRUFBeUM7O0FBRXJDLG9CQUFJLEVBQUUsV0FBRixDQUFjLE1BQWQsR0FBcUIsQ0FBekI7QUFDQSxvQ0FBb0IsbUJBQW1CLFVBQW5CLEVBQStCLFVBQW5EOztBQUVBLG9CQUFJLG1CQUFtQixjQUFuQixDQUFrQyxVQUFsQyxDQUFKLEVBQW1EOztBQUUvQztBQUNBO0FBQ0EsMkJBQU8sS0FBSyxDQUFaLEVBQWdCO0FBQ1osNEJBQUksRUFBRSxXQUFGLENBQWMsQ0FBZCxLQUFvQixFQUFFLFdBQUYsQ0FBYyxDQUFkLE1BQXFCLGlCQUE3QyxFQUFpRTtBQUM3RCw4QkFBRSxXQUFGLENBQWMsTUFBZCxDQUFxQixDQUFyQixFQUF1QixDQUF2QjtBQUNIO0FBQ0Q7QUFDSDs7QUFFRCxzQkFBRSxXQUFGLENBQWMsSUFBZCxDQUFtQixpQkFBbkI7QUFDQSxzQkFBRSxrQkFBRixDQUFxQixpQkFBckIsSUFBMEMsbUJBQW1CLFVBQW5CLEVBQStCLFFBQXpFO0FBRUg7QUFFSjs7QUFFRCxjQUFFLFdBQUYsQ0FBYyxJQUFkLENBQW1CLFVBQVMsQ0FBVCxFQUFZLENBQVosRUFBZTtBQUM5Qix1QkFBUyxFQUFFLE9BQUYsQ0FBVSxXQUFaLEdBQTRCLElBQUUsQ0FBOUIsR0FBa0MsSUFBRSxDQUEzQztBQUNILGFBRkQ7QUFJSDtBQUVKLEtBdENEOztBQXdDQSxVQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsR0FBeUIsWUFBVzs7QUFFaEMsWUFBSSxJQUFJLElBQVI7O0FBRUEsVUFBRSxPQUFGLEdBQ0ksRUFBRSxXQUFGLENBQ0ssUUFETCxDQUNjLEVBQUUsT0FBRixDQUFVLEtBRHhCLEVBRUssUUFGTCxDQUVjLGFBRmQsQ0FESjs7QUFLQSxVQUFFLFVBQUYsR0FBZSxFQUFFLE9BQUYsQ0FBVSxNQUF6Qjs7QUFFQSxZQUFJLEVBQUUsWUFBRixJQUFrQixFQUFFLFVBQXBCLElBQWtDLEVBQUUsWUFBRixLQUFtQixDQUF6RCxFQUE0RDtBQUN4RCxjQUFFLFlBQUYsR0FBaUIsRUFBRSxZQUFGLEdBQWlCLEVBQUUsT0FBRixDQUFVLGNBQTVDO0FBQ0g7O0FBRUQsWUFBSSxFQUFFLFVBQUYsSUFBZ0IsRUFBRSxPQUFGLENBQVUsWUFBOUIsRUFBNEM7QUFDeEMsY0FBRSxZQUFGLEdBQWlCLENBQWpCO0FBQ0g7O0FBRUQsVUFBRSxtQkFBRjs7QUFFQSxVQUFFLFFBQUY7QUFDQSxVQUFFLGFBQUY7QUFDQSxVQUFFLFdBQUY7QUFDQSxVQUFFLFlBQUY7QUFDQSxVQUFFLGVBQUY7QUFDQSxVQUFFLFNBQUY7QUFDQSxVQUFFLFVBQUY7QUFDQSxVQUFFLGFBQUY7QUFDQSxVQUFFLGtCQUFGO0FBQ0EsVUFBRSxlQUFGOztBQUVBLFVBQUUsZUFBRixDQUFrQixLQUFsQixFQUF5QixJQUF6Qjs7QUFFQSxZQUFJLEVBQUUsT0FBRixDQUFVLGFBQVYsS0FBNEIsSUFBaEMsRUFBc0M7QUFDbEMsY0FBRSxFQUFFLFdBQUosRUFBaUIsUUFBakIsR0FBNEIsRUFBNUIsQ0FBK0IsYUFBL0IsRUFBOEMsRUFBRSxhQUFoRDtBQUNIOztBQUVELFVBQUUsZUFBRixDQUFrQixPQUFPLEVBQUUsWUFBVCxLQUEwQixRQUExQixHQUFxQyxFQUFFLFlBQXZDLEdBQXNELENBQXhFOztBQUVBLFVBQUUsV0FBRjtBQUNBLFVBQUUsWUFBRjs7QUFFQSxVQUFFLE1BQUYsR0FBVyxDQUFDLEVBQUUsT0FBRixDQUFVLFFBQXRCO0FBQ0EsVUFBRSxRQUFGOztBQUVBLFVBQUUsT0FBRixDQUFVLE9BQVYsQ0FBa0IsUUFBbEIsRUFBNEIsQ0FBQyxDQUFELENBQTVCO0FBRUgsS0FoREQ7O0FBa0RBLFVBQU0sU0FBTixDQUFnQixNQUFoQixHQUF5QixZQUFXOztBQUVoQyxZQUFJLElBQUksSUFBUjs7QUFFQSxZQUFJLEVBQUUsTUFBRixFQUFVLEtBQVYsT0FBc0IsRUFBRSxXQUE1QixFQUF5QztBQUNyQyx5QkFBYSxFQUFFLFdBQWY7QUFDQSxjQUFFLFdBQUYsR0FBZ0IsT0FBTyxVQUFQLENBQWtCLFlBQVc7QUFDekMsa0JBQUUsV0FBRixHQUFnQixFQUFFLE1BQUYsRUFBVSxLQUFWLEVBQWhCO0FBQ0Esa0JBQUUsZUFBRjtBQUNBLG9CQUFJLENBQUMsRUFBRSxTQUFQLEVBQW1CO0FBQUUsc0JBQUUsV0FBRjtBQUFrQjtBQUMxQyxhQUplLEVBSWIsRUFKYSxDQUFoQjtBQUtIO0FBQ0osS0FaRDs7QUFjQSxVQUFNLFNBQU4sQ0FBZ0IsV0FBaEIsR0FBOEIsTUFBTSxTQUFOLENBQWdCLFdBQWhCLEdBQThCLFVBQVMsS0FBVCxFQUFnQixZQUFoQixFQUE4QixTQUE5QixFQUF5Qzs7QUFFakcsWUFBSSxJQUFJLElBQVI7O0FBRUEsWUFBSSxPQUFPLEtBQVAsS0FBa0IsU0FBdEIsRUFBaUM7QUFDN0IsMkJBQWUsS0FBZjtBQUNBLG9CQUFRLGlCQUFpQixJQUFqQixHQUF3QixDQUF4QixHQUE0QixFQUFFLFVBQUYsR0FBZSxDQUFuRDtBQUNILFNBSEQsTUFHTztBQUNILG9CQUFRLGlCQUFpQixJQUFqQixHQUF3QixFQUFFLEtBQTFCLEdBQWtDLEtBQTFDO0FBQ0g7O0FBRUQsWUFBSSxFQUFFLFVBQUYsR0FBZSxDQUFmLElBQW9CLFFBQVEsQ0FBNUIsSUFBaUMsUUFBUSxFQUFFLFVBQUYsR0FBZSxDQUE1RCxFQUErRDtBQUMzRCxtQkFBTyxLQUFQO0FBQ0g7O0FBRUQsVUFBRSxNQUFGOztBQUVBLFlBQUksY0FBYyxJQUFsQixFQUF3QjtBQUNwQixjQUFFLFdBQUYsQ0FBYyxRQUFkLEdBQXlCLE1BQXpCO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsY0FBRSxXQUFGLENBQWMsUUFBZCxDQUF1QixLQUFLLE9BQUwsQ0FBYSxLQUFwQyxFQUEyQyxFQUEzQyxDQUE4QyxLQUE5QyxFQUFxRCxNQUFyRDtBQUNIOztBQUVELFVBQUUsT0FBRixHQUFZLEVBQUUsV0FBRixDQUFjLFFBQWQsQ0FBdUIsS0FBSyxPQUFMLENBQWEsS0FBcEMsQ0FBWjs7QUFFQSxVQUFFLFdBQUYsQ0FBYyxRQUFkLENBQXVCLEtBQUssT0FBTCxDQUFhLEtBQXBDLEVBQTJDLE1BQTNDOztBQUVBLFVBQUUsV0FBRixDQUFjLE1BQWQsQ0FBcUIsRUFBRSxPQUF2Qjs7QUFFQSxVQUFFLFlBQUYsR0FBaUIsRUFBRSxPQUFuQjs7QUFFQSxVQUFFLE1BQUY7QUFFSCxLQWpDRDs7QUFtQ0EsVUFBTSxTQUFOLENBQWdCLE1BQWhCLEdBQXlCLFVBQVMsUUFBVCxFQUFtQjs7QUFFeEMsWUFBSSxJQUFJLElBQVI7QUFBQSxZQUNJLGdCQUFnQixFQURwQjtBQUFBLFlBRUksQ0FGSjtBQUFBLFlBRU8sQ0FGUDs7QUFJQSxZQUFJLEVBQUUsT0FBRixDQUFVLEdBQVYsS0FBa0IsSUFBdEIsRUFBNEI7QUFDeEIsdUJBQVcsQ0FBQyxRQUFaO0FBQ0g7QUFDRCxZQUFJLEVBQUUsWUFBRixJQUFrQixNQUFsQixHQUEyQixLQUFLLElBQUwsQ0FBVSxRQUFWLElBQXNCLElBQWpELEdBQXdELEtBQTVEO0FBQ0EsWUFBSSxFQUFFLFlBQUYsSUFBa0IsS0FBbEIsR0FBMEIsS0FBSyxJQUFMLENBQVUsUUFBVixJQUFzQixJQUFoRCxHQUF1RCxLQUEzRDs7QUFFQSxzQkFBYyxFQUFFLFlBQWhCLElBQWdDLFFBQWhDOztBQUVBLFlBQUksRUFBRSxpQkFBRixLQUF3QixLQUE1QixFQUFtQztBQUMvQixjQUFFLFdBQUYsQ0FBYyxHQUFkLENBQWtCLGFBQWxCO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsNEJBQWdCLEVBQWhCO0FBQ0EsZ0JBQUksRUFBRSxjQUFGLEtBQXFCLEtBQXpCLEVBQWdDO0FBQzVCLDhCQUFjLEVBQUUsUUFBaEIsSUFBNEIsZUFBZSxDQUFmLEdBQW1CLElBQW5CLEdBQTBCLENBQTFCLEdBQThCLEdBQTFEO0FBQ0Esa0JBQUUsV0FBRixDQUFjLEdBQWQsQ0FBa0IsYUFBbEI7QUFDSCxhQUhELE1BR087QUFDSCw4QkFBYyxFQUFFLFFBQWhCLElBQTRCLGlCQUFpQixDQUFqQixHQUFxQixJQUFyQixHQUE0QixDQUE1QixHQUFnQyxRQUE1RDtBQUNBLGtCQUFFLFdBQUYsQ0FBYyxHQUFkLENBQWtCLGFBQWxCO0FBQ0g7QUFDSjtBQUVKLEtBM0JEOztBQTZCQSxVQUFNLFNBQU4sQ0FBZ0IsYUFBaEIsR0FBZ0MsWUFBVzs7QUFFdkMsWUFBSSxJQUFJLElBQVI7O0FBRUEsWUFBSSxFQUFFLE9BQUYsQ0FBVSxRQUFWLEtBQXVCLEtBQTNCLEVBQWtDO0FBQzlCLGdCQUFJLEVBQUUsT0FBRixDQUFVLFVBQVYsS0FBeUIsSUFBN0IsRUFBbUM7QUFDL0Isa0JBQUUsS0FBRixDQUFRLEdBQVIsQ0FBWTtBQUNSLDZCQUFVLFNBQVMsRUFBRSxPQUFGLENBQVU7QUFEckIsaUJBQVo7QUFHSDtBQUNKLFNBTkQsTUFNTztBQUNILGNBQUUsS0FBRixDQUFRLE1BQVIsQ0FBZSxFQUFFLE9BQUYsQ0FBVSxLQUFWLEdBQWtCLFdBQWxCLENBQThCLElBQTlCLElBQXNDLEVBQUUsT0FBRixDQUFVLFlBQS9EO0FBQ0EsZ0JBQUksRUFBRSxPQUFGLENBQVUsVUFBVixLQUF5QixJQUE3QixFQUFtQztBQUMvQixrQkFBRSxLQUFGLENBQVEsR0FBUixDQUFZO0FBQ1IsNkJBQVUsRUFBRSxPQUFGLENBQVUsYUFBVixHQUEwQjtBQUQ1QixpQkFBWjtBQUdIO0FBQ0o7O0FBRUQsVUFBRSxTQUFGLEdBQWMsRUFBRSxLQUFGLENBQVEsS0FBUixFQUFkO0FBQ0EsVUFBRSxVQUFGLEdBQWUsRUFBRSxLQUFGLENBQVEsTUFBUixFQUFmOztBQUdBLFlBQUksRUFBRSxPQUFGLENBQVUsUUFBVixLQUF1QixLQUF2QixJQUFnQyxFQUFFLE9BQUYsQ0FBVSxhQUFWLEtBQTRCLEtBQWhFLEVBQXVFO0FBQ25FLGNBQUUsVUFBRixHQUFlLEtBQUssSUFBTCxDQUFVLEVBQUUsU0FBRixHQUFjLEVBQUUsT0FBRixDQUFVLFlBQWxDLENBQWY7QUFDQSxjQUFFLFdBQUYsQ0FBYyxLQUFkLENBQW9CLEtBQUssSUFBTCxDQUFXLEVBQUUsVUFBRixHQUFlLEVBQUUsV0FBRixDQUFjLFFBQWQsQ0FBdUIsY0FBdkIsRUFBdUMsTUFBakUsQ0FBcEI7QUFFSCxTQUpELE1BSU8sSUFBSSxFQUFFLE9BQUYsQ0FBVSxhQUFWLEtBQTRCLElBQWhDLEVBQXNDO0FBQ3pDLGNBQUUsV0FBRixDQUFjLEtBQWQsQ0FBb0IsT0FBTyxFQUFFLFVBQTdCO0FBQ0gsU0FGTSxNQUVBO0FBQ0gsY0FBRSxVQUFGLEdBQWUsS0FBSyxJQUFMLENBQVUsRUFBRSxTQUFaLENBQWY7QUFDQSxjQUFFLFdBQUYsQ0FBYyxNQUFkLENBQXFCLEtBQUssSUFBTCxDQUFXLEVBQUUsT0FBRixDQUFVLEtBQVYsR0FBa0IsV0FBbEIsQ0FBOEIsSUFBOUIsSUFBc0MsRUFBRSxXQUFGLENBQWMsUUFBZCxDQUF1QixjQUF2QixFQUF1QyxNQUF4RixDQUFyQjtBQUNIOztBQUVELFlBQUksU0FBUyxFQUFFLE9BQUYsQ0FBVSxLQUFWLEdBQWtCLFVBQWxCLENBQTZCLElBQTdCLElBQXFDLEVBQUUsT0FBRixDQUFVLEtBQVYsR0FBa0IsS0FBbEIsRUFBbEQ7QUFDQSxZQUFJLEVBQUUsT0FBRixDQUFVLGFBQVYsS0FBNEIsS0FBaEMsRUFBdUMsRUFBRSxXQUFGLENBQWMsUUFBZCxDQUF1QixjQUF2QixFQUF1QyxLQUF2QyxDQUE2QyxFQUFFLFVBQUYsR0FBZSxNQUE1RDtBQUUxQyxLQXJDRDs7QUF1Q0EsVUFBTSxTQUFOLENBQWdCLE9BQWhCLEdBQTBCLFlBQVc7O0FBRWpDLFlBQUksSUFBSSxJQUFSO0FBQUEsWUFDSSxVQURKOztBQUdBLFVBQUUsT0FBRixDQUFVLElBQVYsQ0FBZSxVQUFTLEtBQVQsRUFBZ0IsT0FBaEIsRUFBeUI7QUFDcEMseUJBQWMsRUFBRSxVQUFGLEdBQWUsS0FBaEIsR0FBeUIsQ0FBQyxDQUF2QztBQUNBLGdCQUFJLEVBQUUsT0FBRixDQUFVLEdBQVYsS0FBa0IsSUFBdEIsRUFBNEI7QUFDeEIsa0JBQUUsT0FBRixFQUFXLEdBQVgsQ0FBZTtBQUNYLDhCQUFVLFVBREM7QUFFWCwyQkFBTyxVQUZJO0FBR1gseUJBQUssQ0FITTtBQUlYLDRCQUFRLEVBQUUsT0FBRixDQUFVLE1BQVYsR0FBbUIsQ0FKaEI7QUFLWCw2QkFBUztBQUxFLGlCQUFmO0FBT0gsYUFSRCxNQVFPO0FBQ0gsa0JBQUUsT0FBRixFQUFXLEdBQVgsQ0FBZTtBQUNYLDhCQUFVLFVBREM7QUFFWCwwQkFBTSxVQUZLO0FBR1gseUJBQUssQ0FITTtBQUlYLDRCQUFRLEVBQUUsT0FBRixDQUFVLE1BQVYsR0FBbUIsQ0FKaEI7QUFLWCw2QkFBUztBQUxFLGlCQUFmO0FBT0g7QUFDSixTQW5CRDs7QUFxQkEsVUFBRSxPQUFGLENBQVUsRUFBVixDQUFhLEVBQUUsWUFBZixFQUE2QixHQUE3QixDQUFpQztBQUM3QixvQkFBUSxFQUFFLE9BQUYsQ0FBVSxNQUFWLEdBQW1CLENBREU7QUFFN0IscUJBQVM7QUFGb0IsU0FBakM7QUFLSCxLQS9CRDs7QUFpQ0EsVUFBTSxTQUFOLENBQWdCLFNBQWhCLEdBQTRCLFlBQVc7O0FBRW5DLFlBQUksSUFBSSxJQUFSOztBQUVBLFlBQUksRUFBRSxPQUFGLENBQVUsWUFBVixLQUEyQixDQUEzQixJQUFnQyxFQUFFLE9BQUYsQ0FBVSxjQUFWLEtBQTZCLElBQTdELElBQXFFLEVBQUUsT0FBRixDQUFVLFFBQVYsS0FBdUIsS0FBaEcsRUFBdUc7QUFDbkcsZ0JBQUksZUFBZSxFQUFFLE9BQUYsQ0FBVSxFQUFWLENBQWEsRUFBRSxZQUFmLEVBQTZCLFdBQTdCLENBQXlDLElBQXpDLENBQW5CO0FBQ0EsY0FBRSxLQUFGLENBQVEsR0FBUixDQUFZLFFBQVosRUFBc0IsWUFBdEI7QUFDSDtBQUVKLEtBVEQ7O0FBV0EsVUFBTSxTQUFOLENBQWdCLFNBQWhCLEdBQ0EsTUFBTSxTQUFOLENBQWdCLGNBQWhCLEdBQWlDLFlBQVc7O0FBRXhDOzs7Ozs7Ozs7Ozs7O0FBYUEsWUFBSSxJQUFJLElBQVI7QUFBQSxZQUFjLENBQWQ7QUFBQSxZQUFpQixJQUFqQjtBQUFBLFlBQXVCLE1BQXZCO0FBQUEsWUFBK0IsS0FBL0I7QUFBQSxZQUFzQyxVQUFVLEtBQWhEO0FBQUEsWUFBdUQsSUFBdkQ7O0FBRUEsWUFBSSxFQUFFLElBQUYsQ0FBUSxVQUFVLENBQVYsQ0FBUixNQUEyQixRQUEvQixFQUEwQzs7QUFFdEMscUJBQVUsVUFBVSxDQUFWLENBQVY7QUFDQSxzQkFBVSxVQUFVLENBQVYsQ0FBVjtBQUNBLG1CQUFPLFVBQVA7QUFFSCxTQU5ELE1BTU8sSUFBSyxFQUFFLElBQUYsQ0FBUSxVQUFVLENBQVYsQ0FBUixNQUEyQixRQUFoQyxFQUEyQzs7QUFFOUMscUJBQVUsVUFBVSxDQUFWLENBQVY7QUFDQSxvQkFBUSxVQUFVLENBQVYsQ0FBUjtBQUNBLHNCQUFVLFVBQVUsQ0FBVixDQUFWOztBQUVBLGdCQUFLLFVBQVUsQ0FBVixNQUFpQixZQUFqQixJQUFpQyxFQUFFLElBQUYsQ0FBUSxVQUFVLENBQVYsQ0FBUixNQUEyQixPQUFqRSxFQUEyRTs7QUFFdkUsdUJBQU8sWUFBUDtBQUVILGFBSkQsTUFJTyxJQUFLLE9BQU8sVUFBVSxDQUFWLENBQVAsS0FBd0IsV0FBN0IsRUFBMkM7O0FBRTlDLHVCQUFPLFFBQVA7QUFFSDtBQUVKOztBQUVELFlBQUssU0FBUyxRQUFkLEVBQXlCOztBQUVyQixjQUFFLE9BQUYsQ0FBVSxNQUFWLElBQW9CLEtBQXBCO0FBR0gsU0FMRCxNQUtPLElBQUssU0FBUyxVQUFkLEVBQTJCOztBQUU5QixjQUFFLElBQUYsQ0FBUSxNQUFSLEVBQWlCLFVBQVUsR0FBVixFQUFlLEdBQWYsRUFBcUI7O0FBRWxDLGtCQUFFLE9BQUYsQ0FBVSxHQUFWLElBQWlCLEdBQWpCO0FBRUgsYUFKRDtBQU9ILFNBVE0sTUFTQSxJQUFLLFNBQVMsWUFBZCxFQUE2Qjs7QUFFaEMsaUJBQU0sSUFBTixJQUFjLEtBQWQsRUFBc0I7O0FBRWxCLG9CQUFJLEVBQUUsSUFBRixDQUFRLEVBQUUsT0FBRixDQUFVLFVBQWxCLE1BQW1DLE9BQXZDLEVBQWlEOztBQUU3QyxzQkFBRSxPQUFGLENBQVUsVUFBVixHQUF1QixDQUFFLE1BQU0sSUFBTixDQUFGLENBQXZCO0FBRUgsaUJBSkQsTUFJTzs7QUFFSCx3QkFBSSxFQUFFLE9BQUYsQ0FBVSxVQUFWLENBQXFCLE1BQXJCLEdBQTRCLENBQWhDOztBQUVBO0FBQ0EsMkJBQU8sS0FBSyxDQUFaLEVBQWdCOztBQUVaLDRCQUFJLEVBQUUsT0FBRixDQUFVLFVBQVYsQ0FBcUIsQ0FBckIsRUFBd0IsVUFBeEIsS0FBdUMsTUFBTSxJQUFOLEVBQVksVUFBdkQsRUFBb0U7O0FBRWhFLDhCQUFFLE9BQUYsQ0FBVSxVQUFWLENBQXFCLE1BQXJCLENBQTRCLENBQTVCLEVBQThCLENBQTlCO0FBRUg7O0FBRUQ7QUFFSDs7QUFFRCxzQkFBRSxPQUFGLENBQVUsVUFBVixDQUFxQixJQUFyQixDQUEyQixNQUFNLElBQU4sQ0FBM0I7QUFFSDtBQUVKO0FBRUo7O0FBRUQsWUFBSyxPQUFMLEVBQWU7O0FBRVgsY0FBRSxNQUFGO0FBQ0EsY0FBRSxNQUFGO0FBRUg7QUFFSixLQWhHRDs7QUFrR0EsVUFBTSxTQUFOLENBQWdCLFdBQWhCLEdBQThCLFlBQVc7O0FBRXJDLFlBQUksSUFBSSxJQUFSOztBQUVBLFVBQUUsYUFBRjs7QUFFQSxVQUFFLFNBQUY7O0FBRUEsWUFBSSxFQUFFLE9BQUYsQ0FBVSxJQUFWLEtBQW1CLEtBQXZCLEVBQThCO0FBQzFCLGNBQUUsTUFBRixDQUFTLEVBQUUsT0FBRixDQUFVLEVBQUUsWUFBWixDQUFUO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsY0FBRSxPQUFGO0FBQ0g7O0FBRUQsVUFBRSxPQUFGLENBQVUsT0FBVixDQUFrQixhQUFsQixFQUFpQyxDQUFDLENBQUQsQ0FBakM7QUFFSCxLQWhCRDs7QUFrQkEsVUFBTSxTQUFOLENBQWdCLFFBQWhCLEdBQTJCLFlBQVc7O0FBRWxDLFlBQUksSUFBSSxJQUFSO0FBQUEsWUFDSSxZQUFZLFNBQVMsSUFBVCxDQUFjLEtBRDlCOztBQUdBLFVBQUUsWUFBRixHQUFpQixFQUFFLE9BQUYsQ0FBVSxRQUFWLEtBQXVCLElBQXZCLEdBQThCLEtBQTlCLEdBQXNDLE1BQXZEOztBQUVBLFlBQUksRUFBRSxZQUFGLEtBQW1CLEtBQXZCLEVBQThCO0FBQzFCLGNBQUUsT0FBRixDQUFVLFFBQVYsQ0FBbUIsZ0JBQW5CO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsY0FBRSxPQUFGLENBQVUsV0FBVixDQUFzQixnQkFBdEI7QUFDSDs7QUFFRCxZQUFJLFVBQVUsZ0JBQVYsS0FBK0IsU0FBL0IsSUFDQSxVQUFVLGFBQVYsS0FBNEIsU0FENUIsSUFFQSxVQUFVLFlBQVYsS0FBMkIsU0FGL0IsRUFFMEM7QUFDdEMsZ0JBQUksRUFBRSxPQUFGLENBQVUsTUFBVixLQUFxQixJQUF6QixFQUErQjtBQUMzQixrQkFBRSxjQUFGLEdBQW1CLElBQW5CO0FBQ0g7QUFDSjs7QUFFRCxZQUFLLEVBQUUsT0FBRixDQUFVLElBQWYsRUFBc0I7QUFDbEIsZ0JBQUssT0FBTyxFQUFFLE9BQUYsQ0FBVSxNQUFqQixLQUE0QixRQUFqQyxFQUE0QztBQUN4QyxvQkFBSSxFQUFFLE9BQUYsQ0FBVSxNQUFWLEdBQW1CLENBQXZCLEVBQTJCO0FBQ3ZCLHNCQUFFLE9BQUYsQ0FBVSxNQUFWLEdBQW1CLENBQW5CO0FBQ0g7QUFDSixhQUpELE1BSU87QUFDSCxrQkFBRSxPQUFGLENBQVUsTUFBVixHQUFtQixFQUFFLFFBQUYsQ0FBVyxNQUE5QjtBQUNIO0FBQ0o7O0FBRUQsWUFBSSxVQUFVLFVBQVYsS0FBeUIsU0FBN0IsRUFBd0M7QUFDcEMsY0FBRSxRQUFGLEdBQWEsWUFBYjtBQUNBLGNBQUUsYUFBRixHQUFrQixjQUFsQjtBQUNBLGNBQUUsY0FBRixHQUFtQixhQUFuQjtBQUNBLGdCQUFJLFVBQVUsbUJBQVYsS0FBa0MsU0FBbEMsSUFBK0MsVUFBVSxpQkFBVixLQUFnQyxTQUFuRixFQUE4RixFQUFFLFFBQUYsR0FBYSxLQUFiO0FBQ2pHO0FBQ0QsWUFBSSxVQUFVLFlBQVYsS0FBMkIsU0FBL0IsRUFBMEM7QUFDdEMsY0FBRSxRQUFGLEdBQWEsY0FBYjtBQUNBLGNBQUUsYUFBRixHQUFrQixnQkFBbEI7QUFDQSxjQUFFLGNBQUYsR0FBbUIsZUFBbkI7QUFDQSxnQkFBSSxVQUFVLG1CQUFWLEtBQWtDLFNBQWxDLElBQStDLFVBQVUsY0FBVixLQUE2QixTQUFoRixFQUEyRixFQUFFLFFBQUYsR0FBYSxLQUFiO0FBQzlGO0FBQ0QsWUFBSSxVQUFVLGVBQVYsS0FBOEIsU0FBbEMsRUFBNkM7QUFDekMsY0FBRSxRQUFGLEdBQWEsaUJBQWI7QUFDQSxjQUFFLGFBQUYsR0FBa0IsbUJBQWxCO0FBQ0EsY0FBRSxjQUFGLEdBQW1CLGtCQUFuQjtBQUNBLGdCQUFJLFVBQVUsbUJBQVYsS0FBa0MsU0FBbEMsSUFBK0MsVUFBVSxpQkFBVixLQUFnQyxTQUFuRixFQUE4RixFQUFFLFFBQUYsR0FBYSxLQUFiO0FBQ2pHO0FBQ0QsWUFBSSxVQUFVLFdBQVYsS0FBMEIsU0FBOUIsRUFBeUM7QUFDckMsY0FBRSxRQUFGLEdBQWEsYUFBYjtBQUNBLGNBQUUsYUFBRixHQUFrQixlQUFsQjtBQUNBLGNBQUUsY0FBRixHQUFtQixjQUFuQjtBQUNBLGdCQUFJLFVBQVUsV0FBVixLQUEwQixTQUE5QixFQUF5QyxFQUFFLFFBQUYsR0FBYSxLQUFiO0FBQzVDO0FBQ0QsWUFBSSxVQUFVLFNBQVYsS0FBd0IsU0FBeEIsSUFBcUMsRUFBRSxRQUFGLEtBQWUsS0FBeEQsRUFBK0Q7QUFDM0QsY0FBRSxRQUFGLEdBQWEsV0FBYjtBQUNBLGNBQUUsYUFBRixHQUFrQixXQUFsQjtBQUNBLGNBQUUsY0FBRixHQUFtQixZQUFuQjtBQUNIO0FBQ0QsVUFBRSxpQkFBRixHQUFzQixFQUFFLE9BQUYsQ0FBVSxZQUFWLElBQTJCLEVBQUUsUUFBRixLQUFlLElBQWYsSUFBdUIsRUFBRSxRQUFGLEtBQWUsS0FBdkY7QUFDSCxLQTdERDs7QUFnRUEsVUFBTSxTQUFOLENBQWdCLGVBQWhCLEdBQWtDLFVBQVMsS0FBVCxFQUFnQjs7QUFFOUMsWUFBSSxJQUFJLElBQVI7QUFBQSxZQUNJLFlBREo7QUFBQSxZQUNrQixTQURsQjtBQUFBLFlBQzZCLFdBRDdCO0FBQUEsWUFDMEMsU0FEMUM7O0FBR0Esb0JBQVksRUFBRSxPQUFGLENBQ1AsSUFETyxDQUNGLGNBREUsRUFFUCxXQUZPLENBRUsseUNBRkwsRUFHUCxJQUhPLENBR0YsYUFIRSxFQUdhLE1BSGIsQ0FBWjs7QUFLQSxVQUFFLE9BQUYsQ0FDSyxFQURMLENBQ1EsS0FEUixFQUVLLFFBRkwsQ0FFYyxlQUZkOztBQUlBLFlBQUksRUFBRSxPQUFGLENBQVUsVUFBVixLQUF5QixJQUE3QixFQUFtQzs7QUFFL0IsMkJBQWUsS0FBSyxLQUFMLENBQVcsRUFBRSxPQUFGLENBQVUsWUFBVixHQUF5QixDQUFwQyxDQUFmOztBQUVBLGdCQUFJLEVBQUUsT0FBRixDQUFVLFFBQVYsS0FBdUIsSUFBM0IsRUFBaUM7O0FBRTdCLG9CQUFJLFNBQVMsWUFBVCxJQUF5QixTQUFVLEVBQUUsVUFBRixHQUFlLENBQWhCLEdBQXFCLFlBQTNELEVBQXlFOztBQUVyRSxzQkFBRSxPQUFGLENBQ0ssS0FETCxDQUNXLFFBQVEsWUFEbkIsRUFDaUMsUUFBUSxZQUFSLEdBQXVCLENBRHhELEVBRUssUUFGTCxDQUVjLGNBRmQsRUFHSyxJQUhMLENBR1UsYUFIVixFQUd5QixPQUh6QjtBQUtILGlCQVBELE1BT087O0FBRUgsa0NBQWMsRUFBRSxPQUFGLENBQVUsWUFBVixHQUF5QixLQUF2QztBQUNBLDhCQUNLLEtBREwsQ0FDVyxjQUFjLFlBQWQsR0FBNkIsQ0FEeEMsRUFDMkMsY0FBYyxZQUFkLEdBQTZCLENBRHhFLEVBRUssUUFGTCxDQUVjLGNBRmQsRUFHSyxJQUhMLENBR1UsYUFIVixFQUd5QixPQUh6QjtBQUtIOztBQUVELG9CQUFJLFVBQVUsQ0FBZCxFQUFpQjs7QUFFYiw4QkFDSyxFQURMLENBQ1EsVUFBVSxNQUFWLEdBQW1CLENBQW5CLEdBQXVCLEVBQUUsT0FBRixDQUFVLFlBRHpDLEVBRUssUUFGTCxDQUVjLGNBRmQ7QUFJSCxpQkFORCxNQU1PLElBQUksVUFBVSxFQUFFLFVBQUYsR0FBZSxDQUE3QixFQUFnQzs7QUFFbkMsOEJBQ0ssRUFETCxDQUNRLEVBQUUsT0FBRixDQUFVLFlBRGxCLEVBRUssUUFGTCxDQUVjLGNBRmQ7QUFJSDtBQUVKOztBQUVELGNBQUUsT0FBRixDQUNLLEVBREwsQ0FDUSxLQURSLEVBRUssUUFGTCxDQUVjLGNBRmQ7QUFJSCxTQTNDRCxNQTJDTzs7QUFFSCxnQkFBSSxTQUFTLENBQVQsSUFBYyxTQUFVLEVBQUUsVUFBRixHQUFlLEVBQUUsT0FBRixDQUFVLFlBQXJELEVBQW9FOztBQUVoRSxrQkFBRSxPQUFGLENBQ0ssS0FETCxDQUNXLEtBRFgsRUFDa0IsUUFBUSxFQUFFLE9BQUYsQ0FBVSxZQURwQyxFQUVLLFFBRkwsQ0FFYyxjQUZkLEVBR0ssSUFITCxDQUdVLGFBSFYsRUFHeUIsT0FIekI7QUFLSCxhQVBELE1BT08sSUFBSSxVQUFVLE1BQVYsSUFBb0IsRUFBRSxPQUFGLENBQVUsWUFBbEMsRUFBZ0Q7O0FBRW5ELDBCQUNLLFFBREwsQ0FDYyxjQURkLEVBRUssSUFGTCxDQUVVLGFBRlYsRUFFeUIsT0FGekI7QUFJSCxhQU5NLE1BTUE7O0FBRUgsNEJBQVksRUFBRSxVQUFGLEdBQWUsRUFBRSxPQUFGLENBQVUsWUFBckM7QUFDQSw4QkFBYyxFQUFFLE9BQUYsQ0FBVSxRQUFWLEtBQXVCLElBQXZCLEdBQThCLEVBQUUsT0FBRixDQUFVLFlBQVYsR0FBeUIsS0FBdkQsR0FBK0QsS0FBN0U7O0FBRUEsb0JBQUksRUFBRSxPQUFGLENBQVUsWUFBVixJQUEwQixFQUFFLE9BQUYsQ0FBVSxjQUFwQyxJQUF1RCxFQUFFLFVBQUYsR0FBZSxLQUFoQixHQUF5QixFQUFFLE9BQUYsQ0FBVSxZQUE3RixFQUEyRzs7QUFFdkcsOEJBQ0ssS0FETCxDQUNXLGVBQWUsRUFBRSxPQUFGLENBQVUsWUFBVixHQUF5QixTQUF4QyxDQURYLEVBQytELGNBQWMsU0FEN0UsRUFFSyxRQUZMLENBRWMsY0FGZCxFQUdLLElBSEwsQ0FHVSxhQUhWLEVBR3lCLE9BSHpCO0FBS0gsaUJBUEQsTUFPTzs7QUFFSCw4QkFDSyxLQURMLENBQ1csV0FEWCxFQUN3QixjQUFjLEVBQUUsT0FBRixDQUFVLFlBRGhELEVBRUssUUFGTCxDQUVjLGNBRmQsRUFHSyxJQUhMLENBR1UsYUFIVixFQUd5QixPQUh6QjtBQUtIO0FBRUo7QUFFSjs7QUFFRCxZQUFJLEVBQUUsT0FBRixDQUFVLFFBQVYsS0FBdUIsVUFBM0IsRUFBdUM7QUFDbkMsY0FBRSxRQUFGO0FBQ0g7QUFFSixLQXJHRDs7QUF1R0EsVUFBTSxTQUFOLENBQWdCLGFBQWhCLEdBQWdDLFlBQVc7O0FBRXZDLFlBQUksSUFBSSxJQUFSO0FBQUEsWUFDSSxDQURKO0FBQUEsWUFDTyxVQURQO0FBQUEsWUFDbUIsYUFEbkI7O0FBR0EsWUFBSSxFQUFFLE9BQUYsQ0FBVSxJQUFWLEtBQW1CLElBQXZCLEVBQTZCO0FBQ3pCLGNBQUUsT0FBRixDQUFVLFVBQVYsR0FBdUIsS0FBdkI7QUFDSDs7QUFFRCxZQUFJLEVBQUUsT0FBRixDQUFVLFFBQVYsS0FBdUIsSUFBdkIsSUFBK0IsRUFBRSxPQUFGLENBQVUsSUFBVixLQUFtQixLQUF0RCxFQUE2RDs7QUFFekQseUJBQWEsSUFBYjs7QUFFQSxnQkFBSSxFQUFFLFVBQUYsR0FBZSxFQUFFLE9BQUYsQ0FBVSxZQUE3QixFQUEyQzs7QUFFdkMsb0JBQUksRUFBRSxPQUFGLENBQVUsVUFBVixLQUF5QixJQUE3QixFQUFtQztBQUMvQixvQ0FBZ0IsRUFBRSxPQUFGLENBQVUsWUFBVixHQUF5QixDQUF6QztBQUNILGlCQUZELE1BRU87QUFDSCxvQ0FBZ0IsRUFBRSxPQUFGLENBQVUsWUFBMUI7QUFDSDs7QUFFRCxxQkFBSyxJQUFJLEVBQUUsVUFBWCxFQUF1QixJQUFLLEVBQUUsVUFBRixHQUNwQixhQURSLEVBQ3dCLEtBQUssQ0FEN0IsRUFDZ0M7QUFDNUIsaUNBQWEsSUFBSSxDQUFqQjtBQUNBLHNCQUFFLEVBQUUsT0FBRixDQUFVLFVBQVYsQ0FBRixFQUF5QixLQUF6QixDQUErQixJQUEvQixFQUFxQyxJQUFyQyxDQUEwQyxJQUExQyxFQUFnRCxFQUFoRCxFQUNLLElBREwsQ0FDVSxrQkFEVixFQUM4QixhQUFhLEVBQUUsVUFEN0MsRUFFSyxTQUZMLENBRWUsRUFBRSxXQUZqQixFQUU4QixRQUY5QixDQUV1QyxjQUZ2QztBQUdIO0FBQ0QscUJBQUssSUFBSSxDQUFULEVBQVksSUFBSSxhQUFoQixFQUErQixLQUFLLENBQXBDLEVBQXVDO0FBQ25DLGlDQUFhLENBQWI7QUFDQSxzQkFBRSxFQUFFLE9BQUYsQ0FBVSxVQUFWLENBQUYsRUFBeUIsS0FBekIsQ0FBK0IsSUFBL0IsRUFBcUMsSUFBckMsQ0FBMEMsSUFBMUMsRUFBZ0QsRUFBaEQsRUFDSyxJQURMLENBQ1Usa0JBRFYsRUFDOEIsYUFBYSxFQUFFLFVBRDdDLEVBRUssUUFGTCxDQUVjLEVBQUUsV0FGaEIsRUFFNkIsUUFGN0IsQ0FFc0MsY0FGdEM7QUFHSDtBQUNELGtCQUFFLFdBQUYsQ0FBYyxJQUFkLENBQW1CLGVBQW5CLEVBQW9DLElBQXBDLENBQXlDLE1BQXpDLEVBQWlELElBQWpELENBQXNELFlBQVc7QUFDN0Qsc0JBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxJQUFiLEVBQW1CLEVBQW5CO0FBQ0gsaUJBRkQ7QUFJSDtBQUVKO0FBRUosS0ExQ0Q7O0FBNENBLFVBQU0sU0FBTixDQUFnQixTQUFoQixHQUE0QixVQUFVLE1BQVYsRUFBbUI7O0FBRTNDLFlBQUksSUFBSSxJQUFSOztBQUVBLFlBQUksQ0FBQyxNQUFMLEVBQWM7QUFDVixjQUFFLFFBQUY7QUFDSDtBQUNELFVBQUUsV0FBRixHQUFnQixNQUFoQjtBQUVILEtBVEQ7O0FBV0EsVUFBTSxTQUFOLENBQWdCLGFBQWhCLEdBQWdDLFVBQVMsS0FBVCxFQUFnQjs7QUFFNUMsWUFBSSxJQUFJLElBQVI7O0FBRUEsWUFBSSxnQkFDQSxFQUFFLE1BQU0sTUFBUixFQUFnQixFQUFoQixDQUFtQixjQUFuQixJQUNJLEVBQUUsTUFBTSxNQUFSLENBREosR0FFSSxFQUFFLE1BQU0sTUFBUixFQUFnQixPQUFoQixDQUF3QixjQUF4QixDQUhSOztBQUtBLFlBQUksUUFBUSxTQUFTLGNBQWMsSUFBZCxDQUFtQixrQkFBbkIsQ0FBVCxDQUFaOztBQUVBLFlBQUksQ0FBQyxLQUFMLEVBQVksUUFBUSxDQUFSOztBQUVaLFlBQUksRUFBRSxVQUFGLElBQWdCLEVBQUUsT0FBRixDQUFVLFlBQTlCLEVBQTRDOztBQUV4QyxjQUFFLGVBQUYsQ0FBa0IsS0FBbEI7QUFDQSxjQUFFLFFBQUYsQ0FBVyxLQUFYO0FBQ0E7QUFFSDs7QUFFRCxVQUFFLFlBQUYsQ0FBZSxLQUFmO0FBRUgsS0F2QkQ7O0FBeUJBLFVBQU0sU0FBTixDQUFnQixZQUFoQixHQUErQixVQUFTLEtBQVQsRUFBZ0IsSUFBaEIsRUFBc0IsV0FBdEIsRUFBbUM7O0FBRTlELFlBQUksV0FBSjtBQUFBLFlBQWlCLFNBQWpCO0FBQUEsWUFBNEIsUUFBNUI7QUFBQSxZQUFzQyxTQUF0QztBQUFBLFlBQWlELGFBQWEsSUFBOUQ7QUFBQSxZQUNJLElBQUksSUFEUjtBQUFBLFlBQ2MsU0FEZDs7QUFHQSxlQUFPLFFBQVEsS0FBZjs7QUFFQSxZQUFJLEVBQUUsU0FBRixLQUFnQixJQUFoQixJQUF3QixFQUFFLE9BQUYsQ0FBVSxjQUFWLEtBQTZCLElBQXpELEVBQStEO0FBQzNEO0FBQ0g7O0FBRUQsWUFBSSxFQUFFLE9BQUYsQ0FBVSxJQUFWLEtBQW1CLElBQW5CLElBQTJCLEVBQUUsWUFBRixLQUFtQixLQUFsRCxFQUF5RDtBQUNyRDtBQUNIOztBQUVELFlBQUksRUFBRSxVQUFGLElBQWdCLEVBQUUsT0FBRixDQUFVLFlBQTlCLEVBQTRDO0FBQ3hDO0FBQ0g7O0FBRUQsWUFBSSxTQUFTLEtBQWIsRUFBb0I7QUFDaEIsY0FBRSxRQUFGLENBQVcsS0FBWDtBQUNIOztBQUVELHNCQUFjLEtBQWQ7QUFDQSxxQkFBYSxFQUFFLE9BQUYsQ0FBVSxXQUFWLENBQWI7QUFDQSxvQkFBWSxFQUFFLE9BQUYsQ0FBVSxFQUFFLFlBQVosQ0FBWjs7QUFFQSxVQUFFLFdBQUYsR0FBZ0IsRUFBRSxTQUFGLEtBQWdCLElBQWhCLEdBQXVCLFNBQXZCLEdBQW1DLEVBQUUsU0FBckQ7O0FBRUEsWUFBSSxFQUFFLE9BQUYsQ0FBVSxRQUFWLEtBQXVCLEtBQXZCLElBQWdDLEVBQUUsT0FBRixDQUFVLFVBQVYsS0FBeUIsS0FBekQsS0FBbUUsUUFBUSxDQUFSLElBQWEsUUFBUSxFQUFFLFdBQUYsS0FBa0IsRUFBRSxPQUFGLENBQVUsY0FBcEgsQ0FBSixFQUF5STtBQUNySSxnQkFBSSxFQUFFLE9BQUYsQ0FBVSxJQUFWLEtBQW1CLEtBQXZCLEVBQThCO0FBQzFCLDhCQUFjLEVBQUUsWUFBaEI7QUFDQSxvQkFBSSxnQkFBZ0IsSUFBcEIsRUFBMEI7QUFDdEIsc0JBQUUsWUFBRixDQUFlLFNBQWYsRUFBMEIsWUFBVztBQUNqQywwQkFBRSxTQUFGLENBQVksV0FBWjtBQUNILHFCQUZEO0FBR0gsaUJBSkQsTUFJTztBQUNILHNCQUFFLFNBQUYsQ0FBWSxXQUFaO0FBQ0g7QUFDSjtBQUNEO0FBQ0gsU0FaRCxNQVlPLElBQUksRUFBRSxPQUFGLENBQVUsUUFBVixLQUF1QixLQUF2QixJQUFnQyxFQUFFLE9BQUYsQ0FBVSxVQUFWLEtBQXlCLElBQXpELEtBQWtFLFFBQVEsQ0FBUixJQUFhLFFBQVMsRUFBRSxVQUFGLEdBQWUsRUFBRSxPQUFGLENBQVUsY0FBakgsQ0FBSixFQUF1STtBQUMxSSxnQkFBSSxFQUFFLE9BQUYsQ0FBVSxJQUFWLEtBQW1CLEtBQXZCLEVBQThCO0FBQzFCLDhCQUFjLEVBQUUsWUFBaEI7QUFDQSxvQkFBSSxnQkFBZ0IsSUFBcEIsRUFBMEI7QUFDdEIsc0JBQUUsWUFBRixDQUFlLFNBQWYsRUFBMEIsWUFBVztBQUNqQywwQkFBRSxTQUFGLENBQVksV0FBWjtBQUNILHFCQUZEO0FBR0gsaUJBSkQsTUFJTztBQUNILHNCQUFFLFNBQUYsQ0FBWSxXQUFaO0FBQ0g7QUFDSjtBQUNEO0FBQ0g7O0FBRUQsWUFBSyxFQUFFLE9BQUYsQ0FBVSxRQUFmLEVBQTBCO0FBQ3RCLDBCQUFjLEVBQUUsYUFBaEI7QUFDSDs7QUFFRCxZQUFJLGNBQWMsQ0FBbEIsRUFBcUI7QUFDakIsZ0JBQUksRUFBRSxVQUFGLEdBQWUsRUFBRSxPQUFGLENBQVUsY0FBekIsS0FBNEMsQ0FBaEQsRUFBbUQ7QUFDL0MsNEJBQVksRUFBRSxVQUFGLEdBQWdCLEVBQUUsVUFBRixHQUFlLEVBQUUsT0FBRixDQUFVLGNBQXJEO0FBQ0gsYUFGRCxNQUVPO0FBQ0gsNEJBQVksRUFBRSxVQUFGLEdBQWUsV0FBM0I7QUFDSDtBQUNKLFNBTkQsTUFNTyxJQUFJLGVBQWUsRUFBRSxVQUFyQixFQUFpQztBQUNwQyxnQkFBSSxFQUFFLFVBQUYsR0FBZSxFQUFFLE9BQUYsQ0FBVSxjQUF6QixLQUE0QyxDQUFoRCxFQUFtRDtBQUMvQyw0QkFBWSxDQUFaO0FBQ0gsYUFGRCxNQUVPO0FBQ0gsNEJBQVksY0FBYyxFQUFFLFVBQTVCO0FBQ0g7QUFDSixTQU5NLE1BTUE7QUFDSCx3QkFBWSxXQUFaO0FBQ0g7O0FBRUQsVUFBRSxTQUFGLEdBQWMsSUFBZDs7QUFFQSxVQUFFLE9BQUYsQ0FBVSxPQUFWLENBQWtCLGNBQWxCLEVBQWtDLENBQUMsQ0FBRCxFQUFJLEVBQUUsWUFBTixFQUFvQixTQUFwQixDQUFsQzs7QUFFQSxtQkFBVyxFQUFFLFlBQWI7QUFDQSxVQUFFLFlBQUYsR0FBaUIsU0FBakI7O0FBRUEsVUFBRSxlQUFGLENBQWtCLEVBQUUsWUFBcEI7O0FBRUEsWUFBSyxFQUFFLE9BQUYsQ0FBVSxRQUFmLEVBQTBCOztBQUV0Qix3QkFBWSxFQUFFLFlBQUYsRUFBWjtBQUNBLHdCQUFZLFVBQVUsS0FBVixDQUFnQixVQUFoQixDQUFaOztBQUVBLGdCQUFLLFVBQVUsVUFBVixJQUF3QixVQUFVLE9BQVYsQ0FBa0IsWUFBL0MsRUFBOEQ7QUFDMUQsMEJBQVUsZUFBVixDQUEwQixFQUFFLFlBQTVCO0FBQ0g7QUFFSjs7QUFFRCxVQUFFLFVBQUY7QUFDQSxVQUFFLFlBQUY7O0FBRUEsWUFBSSxFQUFFLE9BQUYsQ0FBVSxJQUFWLEtBQW1CLElBQXZCLEVBQTZCO0FBQ3pCLGdCQUFJLGdCQUFnQixJQUFwQixFQUEwQjs7QUFFdEIsa0JBQUUsWUFBRixDQUFlLFFBQWY7O0FBRUEsa0JBQUUsU0FBRixDQUFZLFNBQVosRUFBdUIsWUFBVztBQUM5QixzQkFBRSxTQUFGLENBQVksU0FBWjtBQUNILGlCQUZEO0FBSUgsYUFSRCxNQVFPO0FBQ0gsa0JBQUUsU0FBRixDQUFZLFNBQVo7QUFDSDtBQUNELGNBQUUsYUFBRjtBQUNBO0FBQ0g7O0FBRUQsWUFBSSxnQkFBZ0IsSUFBcEIsRUFBMEI7QUFDdEIsY0FBRSxZQUFGLENBQWUsVUFBZixFQUEyQixZQUFXO0FBQ2xDLGtCQUFFLFNBQUYsQ0FBWSxTQUFaO0FBQ0gsYUFGRDtBQUdILFNBSkQsTUFJTztBQUNILGNBQUUsU0FBRixDQUFZLFNBQVo7QUFDSDtBQUVKLEtBMUhEOztBQTRIQSxVQUFNLFNBQU4sQ0FBZ0IsU0FBaEIsR0FBNEIsWUFBVzs7QUFFbkMsWUFBSSxJQUFJLElBQVI7O0FBRUEsWUFBSSxFQUFFLE9BQUYsQ0FBVSxNQUFWLEtBQXFCLElBQXJCLElBQTZCLEVBQUUsVUFBRixHQUFlLEVBQUUsT0FBRixDQUFVLFlBQTFELEVBQXdFOztBQUVwRSxjQUFFLFVBQUYsQ0FBYSxJQUFiO0FBQ0EsY0FBRSxVQUFGLENBQWEsSUFBYjtBQUVIOztBQUVELFlBQUksRUFBRSxPQUFGLENBQVUsSUFBVixLQUFtQixJQUFuQixJQUEyQixFQUFFLFVBQUYsR0FBZSxFQUFFLE9BQUYsQ0FBVSxZQUF4RCxFQUFzRTs7QUFFbEUsY0FBRSxLQUFGLENBQVEsSUFBUjtBQUVIOztBQUVELFVBQUUsT0FBRixDQUFVLFFBQVYsQ0FBbUIsZUFBbkI7QUFFSCxLQW5CRDs7QUFxQkEsVUFBTSxTQUFOLENBQWdCLGNBQWhCLEdBQWlDLFlBQVc7O0FBRXhDLFlBQUksS0FBSjtBQUFBLFlBQVcsS0FBWDtBQUFBLFlBQWtCLENBQWxCO0FBQUEsWUFBcUIsVUFBckI7QUFBQSxZQUFpQyxJQUFJLElBQXJDOztBQUVBLGdCQUFRLEVBQUUsV0FBRixDQUFjLE1BQWQsR0FBdUIsRUFBRSxXQUFGLENBQWMsSUFBN0M7QUFDQSxnQkFBUSxFQUFFLFdBQUYsQ0FBYyxNQUFkLEdBQXVCLEVBQUUsV0FBRixDQUFjLElBQTdDO0FBQ0EsWUFBSSxLQUFLLEtBQUwsQ0FBVyxLQUFYLEVBQWtCLEtBQWxCLENBQUo7O0FBRUEscUJBQWEsS0FBSyxLQUFMLENBQVcsSUFBSSxHQUFKLEdBQVUsS0FBSyxFQUExQixDQUFiO0FBQ0EsWUFBSSxhQUFhLENBQWpCLEVBQW9CO0FBQ2hCLHlCQUFhLE1BQU0sS0FBSyxHQUFMLENBQVMsVUFBVCxDQUFuQjtBQUNIOztBQUVELFlBQUssY0FBYyxFQUFmLElBQXVCLGNBQWMsQ0FBekMsRUFBNkM7QUFDekMsbUJBQVEsRUFBRSxPQUFGLENBQVUsR0FBVixLQUFrQixLQUFsQixHQUEwQixNQUExQixHQUFtQyxPQUEzQztBQUNIO0FBQ0QsWUFBSyxjQUFjLEdBQWYsSUFBd0IsY0FBYyxHQUExQyxFQUFnRDtBQUM1QyxtQkFBUSxFQUFFLE9BQUYsQ0FBVSxHQUFWLEtBQWtCLEtBQWxCLEdBQTBCLE1BQTFCLEdBQW1DLE9BQTNDO0FBQ0g7QUFDRCxZQUFLLGNBQWMsR0FBZixJQUF3QixjQUFjLEdBQTFDLEVBQWdEO0FBQzVDLG1CQUFRLEVBQUUsT0FBRixDQUFVLEdBQVYsS0FBa0IsS0FBbEIsR0FBMEIsT0FBMUIsR0FBb0MsTUFBNUM7QUFDSDtBQUNELFlBQUksRUFBRSxPQUFGLENBQVUsZUFBVixLQUE4QixJQUFsQyxFQUF3QztBQUNwQyxnQkFBSyxjQUFjLEVBQWYsSUFBdUIsY0FBYyxHQUF6QyxFQUErQztBQUMzQyx1QkFBTyxNQUFQO0FBQ0gsYUFGRCxNQUVPO0FBQ0gsdUJBQU8sSUFBUDtBQUNIO0FBQ0o7O0FBRUQsZUFBTyxVQUFQO0FBRUgsS0FoQ0Q7O0FBa0NBLFVBQU0sU0FBTixDQUFnQixRQUFoQixHQUEyQixVQUFTLEtBQVQsRUFBZ0I7O0FBRXZDLFlBQUksSUFBSSxJQUFSO0FBQUEsWUFDSSxVQURKO0FBQUEsWUFFSSxTQUZKOztBQUlBLFVBQUUsUUFBRixHQUFhLEtBQWI7QUFDQSxVQUFFLFdBQUYsR0FBZ0IsS0FBaEI7QUFDQSxVQUFFLFdBQUYsR0FBa0IsRUFBRSxXQUFGLENBQWMsV0FBZCxHQUE0QixFQUE5QixHQUFxQyxLQUFyQyxHQUE2QyxJQUE3RDs7QUFFQSxZQUFLLEVBQUUsV0FBRixDQUFjLElBQWQsS0FBdUIsU0FBNUIsRUFBd0M7QUFDcEMsbUJBQU8sS0FBUDtBQUNIOztBQUVELFlBQUssRUFBRSxXQUFGLENBQWMsT0FBZCxLQUEwQixJQUEvQixFQUFzQztBQUNsQyxjQUFFLE9BQUYsQ0FBVSxPQUFWLENBQWtCLE1BQWxCLEVBQTBCLENBQUMsQ0FBRCxFQUFJLEVBQUUsY0FBRixFQUFKLENBQTFCO0FBQ0g7O0FBRUQsWUFBSyxFQUFFLFdBQUYsQ0FBYyxXQUFkLElBQTZCLEVBQUUsV0FBRixDQUFjLFFBQWhELEVBQTJEOztBQUV2RCx3QkFBWSxFQUFFLGNBQUYsRUFBWjs7QUFFQSxvQkFBUyxTQUFUOztBQUVJLHFCQUFLLE1BQUw7QUFDQSxxQkFBSyxNQUFMOztBQUVJLGlDQUNJLEVBQUUsT0FBRixDQUFVLFlBQVYsR0FDSSxFQUFFLGNBQUYsQ0FBa0IsRUFBRSxZQUFGLEdBQWlCLEVBQUUsYUFBRixFQUFuQyxDQURKLEdBRUksRUFBRSxZQUFGLEdBQWlCLEVBQUUsYUFBRixFQUh6Qjs7QUFLQSxzQkFBRSxnQkFBRixHQUFxQixDQUFyQjs7QUFFQTs7QUFFSixxQkFBSyxPQUFMO0FBQ0EscUJBQUssSUFBTDs7QUFFSSxpQ0FDSSxFQUFFLE9BQUYsQ0FBVSxZQUFWLEdBQ0ksRUFBRSxjQUFGLENBQWtCLEVBQUUsWUFBRixHQUFpQixFQUFFLGFBQUYsRUFBbkMsQ0FESixHQUVJLEVBQUUsWUFBRixHQUFpQixFQUFFLGFBQUYsRUFIekI7O0FBS0Esc0JBQUUsZ0JBQUYsR0FBcUIsQ0FBckI7O0FBRUE7O0FBRUo7O0FBMUJKOztBQStCQSxnQkFBSSxhQUFhLFVBQWpCLEVBQThCOztBQUUxQixrQkFBRSxZQUFGLENBQWdCLFVBQWhCO0FBQ0Esa0JBQUUsV0FBRixHQUFnQixFQUFoQjtBQUNBLGtCQUFFLE9BQUYsQ0FBVSxPQUFWLENBQWtCLE9BQWxCLEVBQTJCLENBQUMsQ0FBRCxFQUFJLFNBQUosQ0FBM0I7QUFFSDtBQUVKLFNBM0NELE1BMkNPOztBQUVILGdCQUFLLEVBQUUsV0FBRixDQUFjLE1BQWQsS0FBeUIsRUFBRSxXQUFGLENBQWMsSUFBNUMsRUFBbUQ7O0FBRS9DLGtCQUFFLFlBQUYsQ0FBZ0IsRUFBRSxZQUFsQjtBQUNBLGtCQUFFLFdBQUYsR0FBZ0IsRUFBaEI7QUFFSDtBQUVKO0FBRUosS0F4RUQ7O0FBMEVBLFVBQU0sU0FBTixDQUFnQixZQUFoQixHQUErQixVQUFTLEtBQVQsRUFBZ0I7O0FBRTNDLFlBQUksSUFBSSxJQUFSOztBQUVBLFlBQUssRUFBRSxPQUFGLENBQVUsS0FBVixLQUFvQixLQUFyQixJQUFnQyxnQkFBZ0IsUUFBaEIsSUFBNEIsRUFBRSxPQUFGLENBQVUsS0FBVixLQUFvQixLQUFwRixFQUE0RjtBQUN4RjtBQUNILFNBRkQsTUFFTyxJQUFJLEVBQUUsT0FBRixDQUFVLFNBQVYsS0FBd0IsS0FBeEIsSUFBaUMsTUFBTSxJQUFOLENBQVcsT0FBWCxDQUFtQixPQUFuQixNQUFnQyxDQUFDLENBQXRFLEVBQXlFO0FBQzVFO0FBQ0g7O0FBRUQsVUFBRSxXQUFGLENBQWMsV0FBZCxHQUE0QixNQUFNLGFBQU4sSUFBdUIsTUFBTSxhQUFOLENBQW9CLE9BQXBCLEtBQWdDLFNBQXZELEdBQ3hCLE1BQU0sYUFBTixDQUFvQixPQUFwQixDQUE0QixNQURKLEdBQ2EsQ0FEekM7O0FBR0EsVUFBRSxXQUFGLENBQWMsUUFBZCxHQUF5QixFQUFFLFNBQUYsR0FBYyxFQUFFLE9BQUYsQ0FDbEMsY0FETDs7QUFHQSxZQUFJLEVBQUUsT0FBRixDQUFVLGVBQVYsS0FBOEIsSUFBbEMsRUFBd0M7QUFDcEMsY0FBRSxXQUFGLENBQWMsUUFBZCxHQUF5QixFQUFFLFVBQUYsR0FBZSxFQUFFLE9BQUYsQ0FDbkMsY0FETDtBQUVIOztBQUVELGdCQUFRLE1BQU0sSUFBTixDQUFXLE1BQW5COztBQUVJLGlCQUFLLE9BQUw7QUFDSSxrQkFBRSxVQUFGLENBQWEsS0FBYjtBQUNBOztBQUVKLGlCQUFLLE1BQUw7QUFDSSxrQkFBRSxTQUFGLENBQVksS0FBWjtBQUNBOztBQUVKLGlCQUFLLEtBQUw7QUFDSSxrQkFBRSxRQUFGLENBQVcsS0FBWDtBQUNBOztBQVpSO0FBZ0JILEtBckNEOztBQXVDQSxVQUFNLFNBQU4sQ0FBZ0IsU0FBaEIsR0FBNEIsVUFBUyxLQUFULEVBQWdCOztBQUV4QyxZQUFJLElBQUksSUFBUjtBQUFBLFlBQ0ksYUFBYSxLQURqQjtBQUFBLFlBRUksT0FGSjtBQUFBLFlBRWEsY0FGYjtBQUFBLFlBRTZCLFdBRjdCO0FBQUEsWUFFMEMsY0FGMUM7QUFBQSxZQUUwRCxPQUYxRDs7QUFJQSxrQkFBVSxNQUFNLGFBQU4sS0FBd0IsU0FBeEIsR0FBb0MsTUFBTSxhQUFOLENBQW9CLE9BQXhELEdBQWtFLElBQTVFOztBQUVBLFlBQUksQ0FBQyxFQUFFLFFBQUgsSUFBZSxXQUFXLFFBQVEsTUFBUixLQUFtQixDQUFqRCxFQUFvRDtBQUNoRCxtQkFBTyxLQUFQO0FBQ0g7O0FBRUQsa0JBQVUsRUFBRSxPQUFGLENBQVUsRUFBRSxZQUFaLENBQVY7O0FBRUEsVUFBRSxXQUFGLENBQWMsSUFBZCxHQUFxQixZQUFZLFNBQVosR0FBd0IsUUFBUSxDQUFSLEVBQVcsS0FBbkMsR0FBMkMsTUFBTSxPQUF0RTtBQUNBLFVBQUUsV0FBRixDQUFjLElBQWQsR0FBcUIsWUFBWSxTQUFaLEdBQXdCLFFBQVEsQ0FBUixFQUFXLEtBQW5DLEdBQTJDLE1BQU0sT0FBdEU7O0FBRUEsVUFBRSxXQUFGLENBQWMsV0FBZCxHQUE0QixLQUFLLEtBQUwsQ0FBVyxLQUFLLElBQUwsQ0FDbkMsS0FBSyxHQUFMLENBQVMsRUFBRSxXQUFGLENBQWMsSUFBZCxHQUFxQixFQUFFLFdBQUYsQ0FBYyxNQUE1QyxFQUFvRCxDQUFwRCxDQURtQyxDQUFYLENBQTVCOztBQUdBLFlBQUksRUFBRSxPQUFGLENBQVUsZUFBVixLQUE4QixJQUFsQyxFQUF3QztBQUNwQyxjQUFFLFdBQUYsQ0FBYyxXQUFkLEdBQTRCLEtBQUssS0FBTCxDQUFXLEtBQUssSUFBTCxDQUNuQyxLQUFLLEdBQUwsQ0FBUyxFQUFFLFdBQUYsQ0FBYyxJQUFkLEdBQXFCLEVBQUUsV0FBRixDQUFjLE1BQTVDLEVBQW9ELENBQXBELENBRG1DLENBQVgsQ0FBNUI7QUFFSDs7QUFFRCx5QkFBaUIsRUFBRSxjQUFGLEVBQWpCOztBQUVBLFlBQUksbUJBQW1CLFVBQXZCLEVBQW1DO0FBQy9CO0FBQ0g7O0FBRUQsWUFBSSxNQUFNLGFBQU4sS0FBd0IsU0FBeEIsSUFBcUMsRUFBRSxXQUFGLENBQWMsV0FBZCxHQUE0QixDQUFyRSxFQUF3RTtBQUNwRSxrQkFBTSxjQUFOO0FBQ0g7O0FBRUQseUJBQWlCLENBQUMsRUFBRSxPQUFGLENBQVUsR0FBVixLQUFrQixLQUFsQixHQUEwQixDQUExQixHQUE4QixDQUFDLENBQWhDLEtBQXNDLEVBQUUsV0FBRixDQUFjLElBQWQsR0FBcUIsRUFBRSxXQUFGLENBQWMsTUFBbkMsR0FBNEMsQ0FBNUMsR0FBZ0QsQ0FBQyxDQUF2RixDQUFqQjtBQUNBLFlBQUksRUFBRSxPQUFGLENBQVUsZUFBVixLQUE4QixJQUFsQyxFQUF3QztBQUNwQyw2QkFBaUIsRUFBRSxXQUFGLENBQWMsSUFBZCxHQUFxQixFQUFFLFdBQUYsQ0FBYyxNQUFuQyxHQUE0QyxDQUE1QyxHQUFnRCxDQUFDLENBQWxFO0FBQ0g7O0FBR0Qsc0JBQWMsRUFBRSxXQUFGLENBQWMsV0FBNUI7O0FBRUEsVUFBRSxXQUFGLENBQWMsT0FBZCxHQUF3QixLQUF4Qjs7QUFFQSxZQUFJLEVBQUUsT0FBRixDQUFVLFFBQVYsS0FBdUIsS0FBM0IsRUFBa0M7QUFDOUIsZ0JBQUssRUFBRSxZQUFGLEtBQW1CLENBQW5CLElBQXdCLG1CQUFtQixPQUE1QyxJQUF5RCxFQUFFLFlBQUYsSUFBa0IsRUFBRSxXQUFGLEVBQWxCLElBQXFDLG1CQUFtQixNQUFySCxFQUE4SDtBQUMxSCw4QkFBYyxFQUFFLFdBQUYsQ0FBYyxXQUFkLEdBQTRCLEVBQUUsT0FBRixDQUFVLFlBQXBEO0FBQ0Esa0JBQUUsV0FBRixDQUFjLE9BQWQsR0FBd0IsSUFBeEI7QUFDSDtBQUNKOztBQUVELFlBQUksRUFBRSxPQUFGLENBQVUsUUFBVixLQUF1QixLQUEzQixFQUFrQztBQUM5QixjQUFFLFNBQUYsR0FBYyxVQUFVLGNBQWMsY0FBdEM7QUFDSCxTQUZELE1BRU87QUFDSCxjQUFFLFNBQUYsR0FBYyxVQUFXLGVBQWUsRUFBRSxLQUFGLENBQVEsTUFBUixLQUFtQixFQUFFLFNBQXBDLENBQUQsR0FBbUQsY0FBM0U7QUFDSDtBQUNELFlBQUksRUFBRSxPQUFGLENBQVUsZUFBVixLQUE4QixJQUFsQyxFQUF3QztBQUNwQyxjQUFFLFNBQUYsR0FBYyxVQUFVLGNBQWMsY0FBdEM7QUFDSDs7QUFFRCxZQUFJLEVBQUUsT0FBRixDQUFVLElBQVYsS0FBbUIsSUFBbkIsSUFBMkIsRUFBRSxPQUFGLENBQVUsU0FBVixLQUF3QixLQUF2RCxFQUE4RDtBQUMxRCxtQkFBTyxLQUFQO0FBQ0g7O0FBRUQsWUFBSSxFQUFFLFNBQUYsS0FBZ0IsSUFBcEIsRUFBMEI7QUFDdEIsY0FBRSxTQUFGLEdBQWMsSUFBZDtBQUNBLG1CQUFPLEtBQVA7QUFDSDs7QUFFRCxVQUFFLE1BQUYsQ0FBUyxFQUFFLFNBQVg7QUFFSCxLQXhFRDs7QUEwRUEsVUFBTSxTQUFOLENBQWdCLFVBQWhCLEdBQTZCLFVBQVMsS0FBVCxFQUFnQjs7QUFFekMsWUFBSSxJQUFJLElBQVI7QUFBQSxZQUNJLE9BREo7O0FBR0EsVUFBRSxXQUFGLEdBQWdCLElBQWhCOztBQUVBLFlBQUksRUFBRSxXQUFGLENBQWMsV0FBZCxLQUE4QixDQUE5QixJQUFtQyxFQUFFLFVBQUYsSUFBZ0IsRUFBRSxPQUFGLENBQVUsWUFBakUsRUFBK0U7QUFDM0UsY0FBRSxXQUFGLEdBQWdCLEVBQWhCO0FBQ0EsbUJBQU8sS0FBUDtBQUNIOztBQUVELFlBQUksTUFBTSxhQUFOLEtBQXdCLFNBQXhCLElBQXFDLE1BQU0sYUFBTixDQUFvQixPQUFwQixLQUFnQyxTQUF6RSxFQUFvRjtBQUNoRixzQkFBVSxNQUFNLGFBQU4sQ0FBb0IsT0FBcEIsQ0FBNEIsQ0FBNUIsQ0FBVjtBQUNIOztBQUVELFVBQUUsV0FBRixDQUFjLE1BQWQsR0FBdUIsRUFBRSxXQUFGLENBQWMsSUFBZCxHQUFxQixZQUFZLFNBQVosR0FBd0IsUUFBUSxLQUFoQyxHQUF3QyxNQUFNLE9BQTFGO0FBQ0EsVUFBRSxXQUFGLENBQWMsTUFBZCxHQUF1QixFQUFFLFdBQUYsQ0FBYyxJQUFkLEdBQXFCLFlBQVksU0FBWixHQUF3QixRQUFRLEtBQWhDLEdBQXdDLE1BQU0sT0FBMUY7O0FBRUEsVUFBRSxRQUFGLEdBQWEsSUFBYjtBQUVILEtBckJEOztBQXVCQSxVQUFNLFNBQU4sQ0FBZ0IsY0FBaEIsR0FBaUMsTUFBTSxTQUFOLENBQWdCLGFBQWhCLEdBQWdDLFlBQVc7O0FBRXhFLFlBQUksSUFBSSxJQUFSOztBQUVBLFlBQUksRUFBRSxZQUFGLEtBQW1CLElBQXZCLEVBQTZCOztBQUV6QixjQUFFLE1BQUY7O0FBRUEsY0FBRSxXQUFGLENBQWMsUUFBZCxDQUF1QixLQUFLLE9BQUwsQ0FBYSxLQUFwQyxFQUEyQyxNQUEzQzs7QUFFQSxjQUFFLFlBQUYsQ0FBZSxRQUFmLENBQXdCLEVBQUUsV0FBMUI7O0FBRUEsY0FBRSxNQUFGO0FBRUg7QUFFSixLQWhCRDs7QUFrQkEsVUFBTSxTQUFOLENBQWdCLE1BQWhCLEdBQXlCLFlBQVc7O0FBRWhDLFlBQUksSUFBSSxJQUFSOztBQUVBLFVBQUUsZUFBRixFQUFtQixFQUFFLE9BQXJCLEVBQThCLE1BQTlCOztBQUVBLFlBQUksRUFBRSxLQUFOLEVBQWE7QUFDVCxjQUFFLEtBQUYsQ0FBUSxNQUFSO0FBQ0g7O0FBRUQsWUFBSSxFQUFFLFVBQUYsSUFBZ0IsRUFBRSxRQUFGLENBQVcsSUFBWCxDQUFnQixFQUFFLE9BQUYsQ0FBVSxTQUExQixDQUFwQixFQUEwRDtBQUN0RCxjQUFFLFVBQUYsQ0FBYSxNQUFiO0FBQ0g7O0FBRUQsWUFBSSxFQUFFLFVBQUYsSUFBZ0IsRUFBRSxRQUFGLENBQVcsSUFBWCxDQUFnQixFQUFFLE9BQUYsQ0FBVSxTQUExQixDQUFwQixFQUEwRDtBQUN0RCxjQUFFLFVBQUYsQ0FBYSxNQUFiO0FBQ0g7O0FBRUQsVUFBRSxPQUFGLENBQ0ssV0FETCxDQUNpQixzREFEakIsRUFFSyxJQUZMLENBRVUsYUFGVixFQUV5QixNQUZ6QixFQUdLLEdBSEwsQ0FHUyxPQUhULEVBR2tCLEVBSGxCO0FBS0gsS0F2QkQ7O0FBeUJBLFVBQU0sU0FBTixDQUFnQixPQUFoQixHQUEwQixVQUFTLGNBQVQsRUFBeUI7O0FBRS9DLFlBQUksSUFBSSxJQUFSO0FBQ0EsVUFBRSxPQUFGLENBQVUsT0FBVixDQUFrQixTQUFsQixFQUE2QixDQUFDLENBQUQsRUFBSSxjQUFKLENBQTdCO0FBQ0EsVUFBRSxPQUFGO0FBRUgsS0FORDs7QUFRQSxVQUFNLFNBQU4sQ0FBZ0IsWUFBaEIsR0FBK0IsWUFBVzs7QUFFdEMsWUFBSSxJQUFJLElBQVI7QUFBQSxZQUNJLFlBREo7O0FBR0EsdUJBQWUsS0FBSyxLQUFMLENBQVcsRUFBRSxPQUFGLENBQVUsWUFBVixHQUF5QixDQUFwQyxDQUFmOztBQUVBLFlBQUssRUFBRSxPQUFGLENBQVUsTUFBVixLQUFxQixJQUFyQixJQUNELEVBQUUsVUFBRixHQUFlLEVBQUUsT0FBRixDQUFVLFlBRHhCLElBRUQsQ0FBQyxFQUFFLE9BQUYsQ0FBVSxRQUZmLEVBRTBCOztBQUV0QixjQUFFLFVBQUYsQ0FBYSxXQUFiLENBQXlCLGdCQUF6QixFQUEyQyxJQUEzQyxDQUFnRCxlQUFoRCxFQUFpRSxPQUFqRTtBQUNBLGNBQUUsVUFBRixDQUFhLFdBQWIsQ0FBeUIsZ0JBQXpCLEVBQTJDLElBQTNDLENBQWdELGVBQWhELEVBQWlFLE9BQWpFOztBQUVBLGdCQUFJLEVBQUUsWUFBRixLQUFtQixDQUF2QixFQUEwQjs7QUFFdEIsa0JBQUUsVUFBRixDQUFhLFFBQWIsQ0FBc0IsZ0JBQXRCLEVBQXdDLElBQXhDLENBQTZDLGVBQTdDLEVBQThELE1BQTlEO0FBQ0Esa0JBQUUsVUFBRixDQUFhLFdBQWIsQ0FBeUIsZ0JBQXpCLEVBQTJDLElBQTNDLENBQWdELGVBQWhELEVBQWlFLE9BQWpFO0FBRUgsYUFMRCxNQUtPLElBQUksRUFBRSxZQUFGLElBQWtCLEVBQUUsVUFBRixHQUFlLEVBQUUsT0FBRixDQUFVLFlBQTNDLElBQTJELEVBQUUsT0FBRixDQUFVLFVBQVYsS0FBeUIsS0FBeEYsRUFBK0Y7O0FBRWxHLGtCQUFFLFVBQUYsQ0FBYSxRQUFiLENBQXNCLGdCQUF0QixFQUF3QyxJQUF4QyxDQUE2QyxlQUE3QyxFQUE4RCxNQUE5RDtBQUNBLGtCQUFFLFVBQUYsQ0FBYSxXQUFiLENBQXlCLGdCQUF6QixFQUEyQyxJQUEzQyxDQUFnRCxlQUFoRCxFQUFpRSxPQUFqRTtBQUVILGFBTE0sTUFLQSxJQUFJLEVBQUUsWUFBRixJQUFrQixFQUFFLFVBQUYsR0FBZSxDQUFqQyxJQUFzQyxFQUFFLE9BQUYsQ0FBVSxVQUFWLEtBQXlCLElBQW5FLEVBQXlFOztBQUU1RSxrQkFBRSxVQUFGLENBQWEsUUFBYixDQUFzQixnQkFBdEIsRUFBd0MsSUFBeEMsQ0FBNkMsZUFBN0MsRUFBOEQsTUFBOUQ7QUFDQSxrQkFBRSxVQUFGLENBQWEsV0FBYixDQUF5QixnQkFBekIsRUFBMkMsSUFBM0MsQ0FBZ0QsZUFBaEQsRUFBaUUsT0FBakU7QUFFSDtBQUVKO0FBRUosS0FqQ0Q7O0FBbUNBLFVBQU0sU0FBTixDQUFnQixVQUFoQixHQUE2QixZQUFXOztBQUVwQyxZQUFJLElBQUksSUFBUjs7QUFFQSxZQUFJLEVBQUUsS0FBRixLQUFZLElBQWhCLEVBQXNCOztBQUVsQixjQUFFLEtBQUYsQ0FDSyxJQURMLENBQ1UsSUFEVixFQUVLLFdBRkwsQ0FFaUIsY0FGakIsRUFHSyxJQUhMLENBR1UsYUFIVixFQUd5QixNQUh6Qjs7QUFLQSxjQUFFLEtBQUYsQ0FDSyxJQURMLENBQ1UsSUFEVixFQUVLLEVBRkwsQ0FFUSxLQUFLLEtBQUwsQ0FBVyxFQUFFLFlBQUYsR0FBaUIsRUFBRSxPQUFGLENBQVUsY0FBdEMsQ0FGUixFQUdLLFFBSEwsQ0FHYyxjQUhkLEVBSUssSUFKTCxDQUlVLGFBSlYsRUFJeUIsT0FKekI7QUFNSDtBQUVKLEtBbkJEOztBQXFCQSxVQUFNLFNBQU4sQ0FBZ0IsVUFBaEIsR0FBNkIsWUFBVzs7QUFFcEMsWUFBSSxJQUFJLElBQVI7O0FBRUEsWUFBSyxFQUFFLE9BQUYsQ0FBVSxRQUFmLEVBQTBCOztBQUV0QixnQkFBSyxTQUFTLEVBQUUsTUFBWCxDQUFMLEVBQTBCOztBQUV0QixrQkFBRSxXQUFGLEdBQWdCLElBQWhCO0FBRUgsYUFKRCxNQUlPOztBQUVILGtCQUFFLFdBQUYsR0FBZ0IsS0FBaEI7QUFFSDtBQUVKO0FBRUosS0FsQkQ7O0FBb0JBLE1BQUUsRUFBRixDQUFLLEtBQUwsR0FBYSxZQUFXO0FBQ3BCLFlBQUksSUFBSSxJQUFSO0FBQUEsWUFDSSxNQUFNLFVBQVUsQ0FBVixDQURWO0FBQUEsWUFFSSxPQUFPLE1BQU0sU0FBTixDQUFnQixLQUFoQixDQUFzQixJQUF0QixDQUEyQixTQUEzQixFQUFzQyxDQUF0QyxDQUZYO0FBQUEsWUFHSSxJQUFJLEVBQUUsTUFIVjtBQUFBLFlBSUksQ0FKSjtBQUFBLFlBS0ksR0FMSjtBQU1BLGFBQUssSUFBSSxDQUFULEVBQVksSUFBSSxDQUFoQixFQUFtQixHQUFuQixFQUF3QjtBQUNwQixnQkFBSSxRQUFPLEdBQVAseUNBQU8sR0FBUCxNQUFjLFFBQWQsSUFBMEIsT0FBTyxHQUFQLElBQWMsV0FBNUMsRUFDSSxFQUFFLENBQUYsRUFBSyxLQUFMLEdBQWEsSUFBSSxLQUFKLENBQVUsRUFBRSxDQUFGLENBQVYsRUFBZ0IsR0FBaEIsQ0FBYixDQURKLEtBR0ksTUFBTSxFQUFFLENBQUYsRUFBSyxLQUFMLENBQVcsR0FBWCxFQUFnQixLQUFoQixDQUFzQixFQUFFLENBQUYsRUFBSyxLQUEzQixFQUFrQyxJQUFsQyxDQUFOO0FBQ0osZ0JBQUksT0FBTyxHQUFQLElBQWMsV0FBbEIsRUFBK0IsT0FBTyxHQUFQO0FBQ2xDO0FBQ0QsZUFBTyxDQUFQO0FBQ0gsS0FmRDtBQWlCSCxDQXB6RkEsQ0FBRDs7Ozs7Ozs7a0JDakJlO0FBQ1gsTUFEVyxrQkFDSjtBQUNILFNBQUssaUJBQUw7QUFDSCxHQUhVO0FBS1gsbUJBTFcsK0JBS1M7QUFDbEIsTUFBRSxTQUFGLENBQVksbUNBQVosRUFBaUQsSUFBakQsQ0FBc0QsWUFBVztBQUMvRCxlQUFTLG1CQUFULENBQTZCLEtBQTdCLEVBQW9DO0FBQ2xDLGdCQUFPLE1BQU0sSUFBYjtBQUNFLGVBQUssR0FBRyxXQUFILENBQWUsS0FBcEI7QUFDQTtBQUNBO0FBQ0EsZUFBSyxHQUFHLFdBQUgsQ0FBZSxPQUFwQjtBQUNBO0FBQ0E7QUFDQSxlQUFLLEdBQUcsV0FBSCxDQUFlLE1BQXBCO0FBQ0E7QUFDQTtBQUNBLGVBQUssR0FBRyxXQUFILENBQWUsU0FBcEI7QUFDQTtBQUNBO0FBQ0EsZUFBSyxHQUFHLFdBQUgsQ0FBZSxJQUFwQjtBQUNBO0FBQ0E7QUFmRjtBQWlCRDs7QUFFRCxRQUFFLHNCQUFGLEVBQTBCLEVBQTFCLENBQTZCLE9BQTdCLEVBQXNDLFlBQVc7QUFDL0MsWUFBSSxRQUFRLEVBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxTQUFiLENBQVo7QUFDQSxVQUFFLElBQUYsRUFBUSxRQUFSLENBQWlCLFFBQWpCO0FBQ0EsVUFBRSxJQUFGLEVBQVEsTUFBUixHQUFpQixJQUFqQixDQUFzQixhQUF0QixFQUFxQyxJQUFyQyxDQUEwQyx3QkFBc0IsS0FBdEIsR0FBNEIsK0RBQTVCLEdBQThGLEtBQTlGLEdBQXNHLDRGQUFoSjs7QUFFQSxZQUFJLEdBQUcsTUFBUCxDQUFjLFlBQVUsS0FBeEIsRUFBK0I7QUFDN0Isa0JBQVE7QUFDTiw2QkFBaUI7QUFEWDtBQURxQixTQUEvQjtBQUtELE9BVkQ7QUFZRCxLQWpDRDtBQW1DRDtBQXpDVSxDOzs7Ozs7OztBQ0FmOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztrQkFFZTtBQUNYLFFBRFcsa0JBQ0o7QUFDSCxhQUFLLFVBQUw7QUFDSCxLQUhVO0FBS1gsY0FMVyx3QkFLRTtBQUNUOztBQUVBLFVBQUUsWUFBRixFQUFnQixLQUFoQixDQUFzQixZQUFVO0FBQzVCLGNBQUUsSUFBRixFQUFRLE1BQVIsR0FBaUIsUUFBakIsQ0FBMEIsd0JBQTFCO0FBQ0gsU0FGRDs7QUFJQSxVQUFFLFlBQUYsRUFBZ0IsUUFBaEIsQ0FBeUIsWUFBVTtBQUMvQixnQkFBRyxFQUFFLElBQUYsRUFBUSxHQUFSLE9BQWtCLEVBQXJCLEVBQ0ksRUFBRSxJQUFGLEVBQVEsTUFBUixHQUFpQixXQUFqQixDQUE2QixjQUE3QjtBQUNKLGNBQUUsSUFBRixFQUFRLE1BQVIsR0FBaUIsV0FBakIsQ0FBNkIsV0FBN0I7QUFDSCxTQUpEO0FBS0g7QUFqQlUsQzs7Ozs7Ozs7O0FDM0dmOzs7Ozs7a0JBR2U7QUFFWCxRQUZXLGtCQUVMO0FBQ0YsYUFBSyxlQUFMO0FBQ0gsS0FKVTtBQU1YLG1CQU5XLDZCQU1ROztBQUVmLFVBQUUsUUFBRixFQUFZLEVBQVosQ0FBZSxPQUFmLEVBQXdCLFlBQVc7QUFDL0IsY0FBRSxjQUFGLEVBQWtCLFdBQWxCLENBQThCLFFBQTlCO0FBQ0EsY0FBRSxXQUFGLEVBQWUsT0FBZixDQUF1QixRQUF2QjtBQUNILFNBSEQ7O0FBS0EsVUFBRSxjQUFGLEVBQWtCLEVBQWxCLENBQXFCLE9BQXJCLEVBQThCLFVBQVUsQ0FBVixFQUFhO0FBQ3ZDLGNBQUUsZUFBRjtBQUNBLGNBQUUsSUFBRixFQUFRLFdBQVIsQ0FBb0IsUUFBcEI7QUFDQSxjQUFFLFdBQUYsRUFBZSxXQUFmLENBQTJCLFFBQTNCLEVBQXFDLFdBQXJDLENBQWlELFFBQWpEO0FBQ0gsU0FKRDs7QUFNQSxVQUFFLFdBQUYsRUFBZSxFQUFmLENBQWtCLE9BQWxCLEVBQTJCLFVBQVMsQ0FBVCxFQUFZO0FBQ25DLGNBQUUsZUFBRjtBQUNILFNBRkQ7O0FBSUEsaUJBQVMsV0FBVCxDQUFzQixLQUF0QixFQUE2QjtBQUN6QixnQkFBSSxDQUFDLE1BQU0sRUFBWCxFQUFlO0FBQUUsdUJBQU8sTUFBTSxJQUFiO0FBQW9CO0FBQ3JDLG9CQUFRLEdBQVIsQ0FBWSxNQUFNLE9BQU4sQ0FBYyxLQUFkLENBQW9CLEtBQXBCLENBQTBCLEdBQTFCLEVBQStCLENBQS9CLEVBQWtDLFdBQWxDLEVBQVo7QUFDQSxnQkFBSSxTQUFTLEVBQ1QsNERBQTRELE1BQU0sT0FBTixDQUFjLEtBQWQsQ0FBb0IsS0FBcEIsQ0FBMEIsR0FBMUIsRUFBK0IsQ0FBL0IsRUFBa0MsV0FBbEMsRUFBNUQsR0FBOEcsNEJBQTlHLEdBQTZJLE1BQU0sSUFBbkosR0FBMEosU0FEakosQ0FBYjtBQUdBLG1CQUFPLE1BQVA7QUFDSDs7QUFFRCxVQUFFLE9BQUYsRUFBVyxPQUFYLENBQW1CO0FBQ2Y7QUFDQTtBQUNBLHFDQUF5QjtBQUhWLFNBQW5COztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBRUg7QUEzQ1UsQzs7Ozs7Ozs7a0JDSEE7QUFDZCxNQURjLGtCQUNQO0FBQ04sU0FBSyxPQUFMO0FBQ0EsR0FIYTtBQUtkLFNBTGMscUJBS0o7O0FBRVAsTUFBRSxTQUFGLENBQVksNEZBQVosRUFBMEcsSUFBMUcsQ0FBK0csWUFBWTtBQUN6SCxVQUFNLFFBQVEsRUFBRSxNQUFGLENBQWQ7QUFDQSxVQUFNLFVBQVUsV0FBVyxNQUFNLElBQU4sQ0FBVyxVQUFYLENBQVgsQ0FBaEI7QUFDQSxVQUFNLFVBQVUsV0FBVyxNQUFNLElBQU4sQ0FBVyxVQUFYLENBQVgsQ0FBaEI7QUFDQSxVQUFNLFNBQVMsRUFBQyxLQUFLLE9BQU4sRUFBZSxLQUFLLE9BQXBCLEVBQWY7O0FBRUEsVUFBSSxNQUFNLElBQUksT0FBTyxJQUFQLENBQVksR0FBaEIsQ0FBb0IsU0FBUyxjQUFULENBQXdCLEtBQXhCLENBQXBCLEVBQW9EO0FBQzVELGNBQU0sRUFEc0Q7QUFFNUQsZ0JBQVEsTUFGb0Q7QUFHNUQscUJBQWEsS0FIK0M7QUFJNUQsbUJBQVcsSUFKaUQ7QUFLNUQscUJBQWEsS0FMK0M7QUFNNUQsNEJBQW9CO0FBQ2xCLG9CQUFVLE9BQU8sSUFBUCxDQUFZLGVBQVosQ0FBNEI7QUFEcEIsU0FOd0M7QUFTNUQsb0JBQVksS0FUZ0Q7QUFVNUQsd0JBQWdCLEtBVjRDO0FBVzVELDJCQUFtQjtBQVh5QyxPQUFwRCxDQUFWOztBQWNBLFVBQUksU0FBUyxJQUFJLE9BQU8sSUFBUCxDQUFZLE1BQWhCLENBQXVCO0FBQ2xDLGtCQUFVLE1BRHdCO0FBRWxDLGFBQUssR0FGNkI7QUFHbEMsZUFBTztBQUgyQixPQUF2QixDQUFiO0FBS0QsS0F6QkQ7QUEwQkQ7QUFqQ1ksQzs7Ozs7Ozs7O0FDQWY7O2tCQUVlO0FBQ1gsTUFEVyxrQkFDSjtBQUNILFNBQUssWUFBTDtBQUNBLFNBQUssaUJBQUw7QUFDQSxTQUFLLGtCQUFMO0FBQ0EsU0FBSyxjQUFMO0FBQ0EsU0FBSyxZQUFMO0FBQ0gsR0FQVTtBQVNYLGNBVFcsMEJBU0k7QUFDWCxNQUFFLHFCQUFGLEVBQXlCLEtBQXpCLENBQStCO0FBQzNCLFlBQU0sSUFEcUI7QUFFM0IsY0FBUTtBQUZtQixLQUEvQjtBQU1ILEdBaEJVO0FBa0JYLG1CQWxCVywrQkFrQlM7QUFDbEIsTUFBRSxrQkFBRixFQUFzQixLQUF0QixDQUE0QjtBQUN4QixrQkFBWSxJQURZO0FBRXhCLGtCQUFZLENBQ1o7QUFDRSxvQkFBWSxJQURkO0FBRUUsa0JBQVU7QUFDUixzQkFBWTtBQURKO0FBRlosT0FEWTtBQUZZLEtBQTVCOztBQVlBLE1BQUUsb0NBQUYsRUFBd0MsRUFBeEMsQ0FBMkMsQ0FBM0MsRUFBOEMsUUFBOUMsQ0FBdUQsUUFBdkQ7O0FBRUEsTUFBRSxrQkFBRixFQUFzQixFQUF0QixDQUF5QixjQUF6QixFQUF5QyxVQUFTLEtBQVQsRUFBZ0IsS0FBaEIsRUFBdUIsWUFBdkIsRUFBcUMsU0FBckMsRUFBK0M7QUFDdEYsUUFBRSxvQ0FBRixFQUF3QyxXQUF4QyxDQUFvRCxRQUFwRDs7QUFFQSxVQUFJLEVBQUUsb0NBQUYsRUFBd0MsRUFBeEMsQ0FBMkMsU0FBM0MsRUFBc0QsTUFBdEQsSUFBZ0UsQ0FBcEUsRUFBdUU7QUFDckUsVUFBRSxvQ0FBRixFQUF3QyxFQUF4QyxDQUEyQyxTQUEzQyxFQUFzRCxRQUF0RCxDQUErRCxRQUEvRDtBQUNEO0FBQ0YsS0FORDtBQU9ELEdBeENVO0FBMENYLG9CQTFDVyxnQ0EwQ1U7QUFDbkIsTUFBRSxzQkFBRixFQUEwQixLQUExQixDQUFnQztBQUM5QixZQUFNO0FBRHdCLEtBQWhDO0FBR0QsR0E5Q1U7QUFnRFgsZ0JBaERXLDRCQWdETTtBQUNmLE1BQUUsZ0JBQUYsRUFBb0IsS0FBcEIsQ0FBMEI7QUFDeEIsa0JBQVksSUFEWTtBQUV4QixvQkFBYyxDQUZVO0FBR3hCLGtCQUFZLENBQ1Y7QUFDRSxvQkFBWSxJQURkO0FBRUUsa0JBQVU7QUFDUixzQkFBWSxLQURKO0FBRVIsd0JBQWM7QUFGTjtBQUZaLE9BRFU7QUFIWSxLQUExQjtBQWFELEdBOURVO0FBZ0VYLGNBaEVXLDBCQWdFSTtBQUNiLE1BQUUsZ0JBQUYsRUFBb0IsS0FBcEIsQ0FBMEI7QUFDeEIsa0JBQVksSUFEWTtBQUV4QixvQkFBYyxDQUZVO0FBR3hCLHFCQUFlLE1BSFM7QUFJeEIsa0JBQVksQ0FDVjtBQUNFLG9CQUFZLElBRGQ7QUFFRSxrQkFBVTtBQUNSLHNCQUFZLEtBREo7QUFFUix3QkFBYyxDQUZOO0FBR1IseUJBQWU7QUFIUDtBQUZaLE9BRFU7QUFKWSxLQUExQjtBQWVEO0FBaEZVLEM7Ozs7Ozs7OztBQ0ZmOzs7O0FBQ0E7Ozs7OztrQkFFZTtBQUNYLFFBRFcsa0JBQ0w7QUFDRixrQ0FBZ0IsSUFBaEI7QUFDQSwwQkFBUSxJQUFSO0FBQ0g7QUFKVSxDOzs7Ozs7Ozs7QUNIZjs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O2tCQUVlO0FBQ1gsUUFEVyxrQkFDTDtBQUNGLGtDQUFnQixJQUFoQjtBQUNBLDBCQUFRLElBQVI7QUFDQSxzQkFBSyxJQUFMO0FBQ0EsZ0NBQWMsSUFBZDtBQUNIO0FBTlUsQzs7Ozs7Ozs7O0FDTGY7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztrQkFFZTtBQUNYLFFBRFcsa0JBQ0w7QUFDRixrQ0FBZ0IsSUFBaEI7QUFDQSwwQkFBUSxJQUFSO0FBQ0E7QUFDQSxnQ0FBYyxJQUFkO0FBQ0g7QUFOVSxDOzs7Ozs7Ozs7QUNMZjs7OztBQUNBOzs7O0FBQ0E7Ozs7OztrQkFFZTtBQUNYLFFBRFcsa0JBQ0w7QUFDRixrQ0FBZ0IsSUFBaEI7QUFDQSwwQkFBUSxJQUFSO0FBQ0EsMEJBQU8sSUFBUDtBQUNIO0FBTFUsQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgQ09NTU9OIGZyb20gJy4vcGFnZXMvQ09NTU9OJztcbmltcG9ydCBIT01FIGZyb20gXCIuL3BhZ2VzL0hPTUVcIjtcbmltcG9ydCBQUk9KRUNUUyBmcm9tIFwiLi9wYWdlcy9QUk9KRUNUU1wiO1xuaW1wb3J0IENPTlRBQ1RTIGZyb20gXCIuL3BhZ2VzL0NPTlRBQ1RTXCI7XG5cbmxldCBpbml0ID0gbnVsbDtcblxuc3dpdGNoIChnbG9iYWwudmFycy5wYWdlKSB7XG4gICAgY2FzZSAnaG9tZV9wYWdlJzpcbiAgICAgICAgaW5pdCA9IEhPTUUuaW5pdC5iaW5kKEhPTUUpO1xuICAgICAgICBicmVhaztcbiAgICBjYXNlICdwcm9qZWN0c19wYWdlJzpcbiAgICAgICAgaW5pdCA9IFBST0pFQ1RTLmluaXQuYmluZChQUk9KRUNUUyk7XG4gICAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2NvbW1vbl9wYWdlJzpcbiAgICAgICAgaW5pdCA9IENPTU1PTi5pbml0LmJpbmQoQ09NTU9OKTtcbiAgICAgICAgYnJlYWs7XG4gICAgY2FzZSAnY29udGFjdHNfcGFnZSc6XG4gICAgICAgIGluaXQgPSBDT05UQUNUUy5pbml0LmJpbmQoQ09OVEFDVFMpO1xuICAgICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgICBpbml0ID0gKCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2RlZmF1bHQgaW5pdCcpO1xuICAgICAgICB9O1xufVxuXG4kKGRvY3VtZW50KS5yZWFkeShpbml0KCkpO1xuXG4kKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xuXG59KTtcblxuJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcblxufSk7XG5cbiQod2luZG93KS5vbignbG9hZCcsIGZ1bmN0aW9uICgpIHtcblxufSk7IiwiLyohXG4gKiBTZWxlY3QyIDQuMC4zXG4gKiBodHRwczovL3NlbGVjdDIuZ2l0aHViLmlvXG4gKlxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiBodHRwczovL2dpdGh1Yi5jb20vc2VsZWN0Mi9zZWxlY3QyL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWRcbiAqL1xuKGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gICAgZmFjdG9yeShqUXVlcnkpO1xufShmdW5jdGlvbiAoalF1ZXJ5KSB7XG4gIC8vIFRoaXMgaXMgbmVlZGVkIHNvIHdlIGNhbiBjYXRjaCB0aGUgQU1EIGxvYWRlciBjb25maWd1cmF0aW9uIGFuZCB1c2UgaXRcbiAgLy8gVGhlIGlubmVyIGZpbGUgc2hvdWxkIGJlIHdyYXBwZWQgKGJ5IGBiYW5uZXIuc3RhcnQuanNgKSBpbiBhIGZ1bmN0aW9uIHRoYXRcbiAgLy8gcmV0dXJucyB0aGUgQU1EIGxvYWRlciByZWZlcmVuY2VzLlxuICB2YXIgUzIgPVxuKGZ1bmN0aW9uICgpIHtcbiAgLy8gUmVzdG9yZSB0aGUgU2VsZWN0MiBBTUQgbG9hZGVyIHNvIGl0IGNhbiBiZSB1c2VkXG4gIC8vIE5lZWRlZCBtb3N0bHkgaW4gdGhlIGxhbmd1YWdlIGZpbGVzLCB3aGVyZSB0aGUgbG9hZGVyIGlzIG5vdCBpbnNlcnRlZFxuICBpZiAoalF1ZXJ5ICYmIGpRdWVyeS5mbiAmJiBqUXVlcnkuZm4uc2VsZWN0MiAmJiBqUXVlcnkuZm4uc2VsZWN0Mi5hbWQpIHtcbiAgICB2YXIgUzIgPSBqUXVlcnkuZm4uc2VsZWN0Mi5hbWQ7XG4gIH1cbnZhciBTMjsoZnVuY3Rpb24gKCkgeyBpZiAoIVMyIHx8ICFTMi5yZXF1aXJlanMpIHtcbmlmICghUzIpIHsgUzIgPSB7fTsgfSBlbHNlIHsgcmVxdWlyZSA9IFMyOyB9XG4vKipcbiAqIEBsaWNlbnNlIGFsbW9uZCAwLjMuMSBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxNCwgVGhlIERvam8gRm91bmRhdGlvbiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogQXZhaWxhYmxlIHZpYSB0aGUgTUlUIG9yIG5ldyBCU0QgbGljZW5zZS5cbiAqIHNlZTogaHR0cDovL2dpdGh1Yi5jb20vanJidXJrZS9hbG1vbmQgZm9yIGRldGFpbHNcbiAqL1xuLy9Hb2luZyBzbG9wcHkgdG8gYXZvaWQgJ3VzZSBzdHJpY3QnIHN0cmluZyBjb3N0LCBidXQgc3RyaWN0IHByYWN0aWNlcyBzaG91bGRcbi8vYmUgZm9sbG93ZWQuXG4vKmpzbGludCBzbG9wcHk6IHRydWUgKi9cbi8qZ2xvYmFsIHNldFRpbWVvdXQ6IGZhbHNlICovXG5cbnZhciByZXF1aXJlanMsIHJlcXVpcmUsIGRlZmluZTtcbihmdW5jdGlvbiAodW5kZWYpIHtcbiAgICB2YXIgbWFpbiwgcmVxLCBtYWtlTWFwLCBoYW5kbGVycyxcbiAgICAgICAgZGVmaW5lZCA9IHt9LFxuICAgICAgICB3YWl0aW5nID0ge30sXG4gICAgICAgIGNvbmZpZyA9IHt9LFxuICAgICAgICBkZWZpbmluZyA9IHt9LFxuICAgICAgICBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LFxuICAgICAgICBhcHMgPSBbXS5zbGljZSxcbiAgICAgICAganNTdWZmaXhSZWdFeHAgPSAvXFwuanMkLztcblxuICAgIGZ1bmN0aW9uIGhhc1Byb3Aob2JqLCBwcm9wKSB7XG4gICAgICAgIHJldHVybiBoYXNPd24uY2FsbChvYmosIHByb3ApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdpdmVuIGEgcmVsYXRpdmUgbW9kdWxlIG5hbWUsIGxpa2UgLi9zb21ldGhpbmcsIG5vcm1hbGl6ZSBpdCB0b1xuICAgICAqIGEgcmVhbCBuYW1lIHRoYXQgY2FuIGJlIG1hcHBlZCB0byBhIHBhdGguXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgdGhlIHJlbGF0aXZlIG5hbWVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYmFzZU5hbWUgYSByZWFsIG5hbWUgdGhhdCB0aGUgbmFtZSBhcmcgaXMgcmVsYXRpdmVcbiAgICAgKiB0by5cbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSBub3JtYWxpemVkIG5hbWVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBub3JtYWxpemUobmFtZSwgYmFzZU5hbWUpIHtcbiAgICAgICAgdmFyIG5hbWVQYXJ0cywgbmFtZVNlZ21lbnQsIG1hcFZhbHVlLCBmb3VuZE1hcCwgbGFzdEluZGV4LFxuICAgICAgICAgICAgZm91bmRJLCBmb3VuZFN0YXJNYXAsIHN0YXJJLCBpLCBqLCBwYXJ0LFxuICAgICAgICAgICAgYmFzZVBhcnRzID0gYmFzZU5hbWUgJiYgYmFzZU5hbWUuc3BsaXQoXCIvXCIpLFxuICAgICAgICAgICAgbWFwID0gY29uZmlnLm1hcCxcbiAgICAgICAgICAgIHN0YXJNYXAgPSAobWFwICYmIG1hcFsnKiddKSB8fCB7fTtcblxuICAgICAgICAvL0FkanVzdCBhbnkgcmVsYXRpdmUgcGF0aHMuXG4gICAgICAgIGlmIChuYW1lICYmIG5hbWUuY2hhckF0KDApID09PSBcIi5cIikge1xuICAgICAgICAgICAgLy9JZiBoYXZlIGEgYmFzZSBuYW1lLCB0cnkgdG8gbm9ybWFsaXplIGFnYWluc3QgaXQsXG4gICAgICAgICAgICAvL290aGVyd2lzZSwgYXNzdW1lIGl0IGlzIGEgdG9wLWxldmVsIHJlcXVpcmUgdGhhdCB3aWxsXG4gICAgICAgICAgICAvL2JlIHJlbGF0aXZlIHRvIGJhc2VVcmwgaW4gdGhlIGVuZC5cbiAgICAgICAgICAgIGlmIChiYXNlTmFtZSkge1xuICAgICAgICAgICAgICAgIG5hbWUgPSBuYW1lLnNwbGl0KCcvJyk7XG4gICAgICAgICAgICAgICAgbGFzdEluZGV4ID0gbmFtZS5sZW5ndGggLSAxO1xuXG4gICAgICAgICAgICAgICAgLy8gTm9kZSAuanMgYWxsb3dhbmNlOlxuICAgICAgICAgICAgICAgIGlmIChjb25maWcubm9kZUlkQ29tcGF0ICYmIGpzU3VmZml4UmVnRXhwLnRlc3QobmFtZVtsYXN0SW5kZXhdKSkge1xuICAgICAgICAgICAgICAgICAgICBuYW1lW2xhc3RJbmRleF0gPSBuYW1lW2xhc3RJbmRleF0ucmVwbGFjZShqc1N1ZmZpeFJlZ0V4cCwgJycpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vTG9wIG9mZiB0aGUgbGFzdCBwYXJ0IG9mIGJhc2VQYXJ0cywgc28gdGhhdCAuIG1hdGNoZXMgdGhlXG4gICAgICAgICAgICAgICAgLy9cImRpcmVjdG9yeVwiIGFuZCBub3QgbmFtZSBvZiB0aGUgYmFzZU5hbWUncyBtb2R1bGUuIEZvciBpbnN0YW5jZSxcbiAgICAgICAgICAgICAgICAvL2Jhc2VOYW1lIG9mIFwib25lL3R3by90aHJlZVwiLCBtYXBzIHRvIFwib25lL3R3by90aHJlZS5qc1wiLCBidXQgd2VcbiAgICAgICAgICAgICAgICAvL3dhbnQgdGhlIGRpcmVjdG9yeSwgXCJvbmUvdHdvXCIgZm9yIHRoaXMgbm9ybWFsaXphdGlvbi5cbiAgICAgICAgICAgICAgICBuYW1lID0gYmFzZVBhcnRzLnNsaWNlKDAsIGJhc2VQYXJ0cy5sZW5ndGggLSAxKS5jb25jYXQobmFtZSk7XG5cbiAgICAgICAgICAgICAgICAvL3N0YXJ0IHRyaW1Eb3RzXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG5hbWUubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFydCA9IG5hbWVbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0ID09PSBcIi5cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpIC09IDE7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocGFydCA9PT0gXCIuLlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMSAmJiAobmFtZVsyXSA9PT0gJy4uJyB8fCBuYW1lWzBdID09PSAnLi4nKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vRW5kIG9mIHRoZSBsaW5lLiBLZWVwIGF0IGxlYXN0IG9uZSBub24tZG90XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9wYXRoIHNlZ21lbnQgYXQgdGhlIGZyb250IHNvIGl0IGNhbiBiZSBtYXBwZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvcnJlY3RseSB0byBkaXNrLiBPdGhlcndpc2UsIHRoZXJlIGlzIGxpa2VseVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vbm8gcGF0aCBtYXBwaW5nIGZvciBhIHBhdGggc3RhcnRpbmcgd2l0aCAnLi4nLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vVGhpcyBjYW4gc3RpbGwgZmFpbCwgYnV0IGNhdGNoZXMgdGhlIG1vc3QgcmVhc29uYWJsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdXNlcyBvZiAuLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUuc3BsaWNlKGkgLSAxLCAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpIC09IDI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9lbmQgdHJpbURvdHNcblxuICAgICAgICAgICAgICAgIG5hbWUgPSBuYW1lLmpvaW4oXCIvXCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuYW1lLmluZGV4T2YoJy4vJykgPT09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBObyBiYXNlTmFtZSwgc28gdGhpcyBpcyBJRCBpcyByZXNvbHZlZCByZWxhdGl2ZVxuICAgICAgICAgICAgICAgIC8vIHRvIGJhc2VVcmwsIHB1bGwgb2ZmIHRoZSBsZWFkaW5nIGRvdC5cbiAgICAgICAgICAgICAgICBuYW1lID0gbmFtZS5zdWJzdHJpbmcoMik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL0FwcGx5IG1hcCBjb25maWcgaWYgYXZhaWxhYmxlLlxuICAgICAgICBpZiAoKGJhc2VQYXJ0cyB8fCBzdGFyTWFwKSAmJiBtYXApIHtcbiAgICAgICAgICAgIG5hbWVQYXJ0cyA9IG5hbWUuc3BsaXQoJy8nKTtcblxuICAgICAgICAgICAgZm9yIChpID0gbmFtZVBhcnRzLmxlbmd0aDsgaSA+IDA7IGkgLT0gMSkge1xuICAgICAgICAgICAgICAgIG5hbWVTZWdtZW50ID0gbmFtZVBhcnRzLnNsaWNlKDAsIGkpLmpvaW4oXCIvXCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGJhc2VQYXJ0cykge1xuICAgICAgICAgICAgICAgICAgICAvL0ZpbmQgdGhlIGxvbmdlc3QgYmFzZU5hbWUgc2VnbWVudCBtYXRjaCBpbiB0aGUgY29uZmlnLlxuICAgICAgICAgICAgICAgICAgICAvL1NvLCBkbyBqb2lucyBvbiB0aGUgYmlnZ2VzdCB0byBzbWFsbGVzdCBsZW5ndGhzIG9mIGJhc2VQYXJ0cy5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gYmFzZVBhcnRzLmxlbmd0aDsgaiA+IDA7IGogLT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFwVmFsdWUgPSBtYXBbYmFzZVBhcnRzLnNsaWNlKDAsIGopLmpvaW4oJy8nKV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vYmFzZU5hbWUgc2VnbWVudCBoYXMgIGNvbmZpZywgZmluZCBpZiBpdCBoYXMgb25lIGZvclxuICAgICAgICAgICAgICAgICAgICAgICAgLy90aGlzIG5hbWUuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFwVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBWYWx1ZSA9IG1hcFZhbHVlW25hbWVTZWdtZW50XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFwVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9NYXRjaCwgdXBkYXRlIG5hbWUgdG8gdGhlIG5ldyB2YWx1ZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRNYXAgPSBtYXBWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRJID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGZvdW5kTWFwKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vQ2hlY2sgZm9yIGEgc3RhciBtYXAgbWF0Y2gsIGJ1dCBqdXN0IGhvbGQgb24gdG8gaXQsXG4gICAgICAgICAgICAgICAgLy9pZiB0aGVyZSBpcyBhIHNob3J0ZXIgc2VnbWVudCBtYXRjaCBsYXRlciBpbiBhIG1hdGNoaW5nXG4gICAgICAgICAgICAgICAgLy9jb25maWcsIHRoZW4gZmF2b3Igb3ZlciB0aGlzIHN0YXIgbWFwLlxuICAgICAgICAgICAgICAgIGlmICghZm91bmRTdGFyTWFwICYmIHN0YXJNYXAgJiYgc3Rhck1hcFtuYW1lU2VnbWVudF0pIHtcbiAgICAgICAgICAgICAgICAgICAgZm91bmRTdGFyTWFwID0gc3Rhck1hcFtuYW1lU2VnbWVudF07XG4gICAgICAgICAgICAgICAgICAgIHN0YXJJID0gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghZm91bmRNYXAgJiYgZm91bmRTdGFyTWFwKSB7XG4gICAgICAgICAgICAgICAgZm91bmRNYXAgPSBmb3VuZFN0YXJNYXA7XG4gICAgICAgICAgICAgICAgZm91bmRJID0gc3Rhckk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChmb3VuZE1hcCkge1xuICAgICAgICAgICAgICAgIG5hbWVQYXJ0cy5zcGxpY2UoMCwgZm91bmRJLCBmb3VuZE1hcCk7XG4gICAgICAgICAgICAgICAgbmFtZSA9IG5hbWVQYXJ0cy5qb2luKCcvJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmFtZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlUmVxdWlyZShyZWxOYW1lLCBmb3JjZVN5bmMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vQSB2ZXJzaW9uIG9mIGEgcmVxdWlyZSBmdW5jdGlvbiB0aGF0IHBhc3NlcyBhIG1vZHVsZU5hbWVcbiAgICAgICAgICAgIC8vdmFsdWUgZm9yIGl0ZW1zIHRoYXQgbWF5IG5lZWQgdG9cbiAgICAgICAgICAgIC8vbG9vayB1cCBwYXRocyByZWxhdGl2ZSB0byB0aGUgbW9kdWxlTmFtZVxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcHMuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgICAgICAgICAvL0lmIGZpcnN0IGFyZyBpcyBub3QgcmVxdWlyZSgnc3RyaW5nJyksIGFuZCB0aGVyZSBpcyBvbmx5XG4gICAgICAgICAgICAvL29uZSBhcmcsIGl0IGlzIHRoZSBhcnJheSBmb3JtIHdpdGhvdXQgYSBjYWxsYmFjay4gSW5zZXJ0XG4gICAgICAgICAgICAvL2EgbnVsbCBzbyB0aGF0IHRoZSBmb2xsb3dpbmcgY29uY2F0IGlzIGNvcnJlY3QuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3NbMF0gIT09ICdzdHJpbmcnICYmIGFyZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgYXJncy5wdXNoKG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlcS5hcHBseSh1bmRlZiwgYXJncy5jb25jYXQoW3JlbE5hbWUsIGZvcmNlU3luY10pKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlTm9ybWFsaXplKHJlbE5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9ybWFsaXplKG5hbWUsIHJlbE5hbWUpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VMb2FkKGRlcE5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgZGVmaW5lZFtkZXBOYW1lXSA9IHZhbHVlO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhbGxEZXAobmFtZSkge1xuICAgICAgICBpZiAoaGFzUHJvcCh3YWl0aW5nLCBuYW1lKSkge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSB3YWl0aW5nW25hbWVdO1xuICAgICAgICAgICAgZGVsZXRlIHdhaXRpbmdbbmFtZV07XG4gICAgICAgICAgICBkZWZpbmluZ1tuYW1lXSA9IHRydWU7XG4gICAgICAgICAgICBtYWluLmFwcGx5KHVuZGVmLCBhcmdzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaGFzUHJvcChkZWZpbmVkLCBuYW1lKSAmJiAhaGFzUHJvcChkZWZpbmluZywgbmFtZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gJyArIG5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWZpbmVkW25hbWVdO1xuICAgIH1cblxuICAgIC8vVHVybnMgYSBwbHVnaW4hcmVzb3VyY2UgdG8gW3BsdWdpbiwgcmVzb3VyY2VdXG4gICAgLy93aXRoIHRoZSBwbHVnaW4gYmVpbmcgdW5kZWZpbmVkIGlmIHRoZSBuYW1lXG4gICAgLy9kaWQgbm90IGhhdmUgYSBwbHVnaW4gcHJlZml4LlxuICAgIGZ1bmN0aW9uIHNwbGl0UHJlZml4KG5hbWUpIHtcbiAgICAgICAgdmFyIHByZWZpeCxcbiAgICAgICAgICAgIGluZGV4ID0gbmFtZSA/IG5hbWUuaW5kZXhPZignIScpIDogLTE7XG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICBwcmVmaXggPSBuYW1lLnN1YnN0cmluZygwLCBpbmRleCk7XG4gICAgICAgICAgICBuYW1lID0gbmFtZS5zdWJzdHJpbmcoaW5kZXggKyAxLCBuYW1lLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtwcmVmaXgsIG5hbWVdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1ha2VzIGEgbmFtZSBtYXAsIG5vcm1hbGl6aW5nIHRoZSBuYW1lLCBhbmQgdXNpbmcgYSBwbHVnaW5cbiAgICAgKiBmb3Igbm9ybWFsaXphdGlvbiBpZiBuZWNlc3NhcnkuIEdyYWJzIGEgcmVmIHRvIHBsdWdpblxuICAgICAqIHRvbywgYXMgYW4gb3B0aW1pemF0aW9uLlxuICAgICAqL1xuICAgIG1ha2VNYXAgPSBmdW5jdGlvbiAobmFtZSwgcmVsTmFtZSkge1xuICAgICAgICB2YXIgcGx1Z2luLFxuICAgICAgICAgICAgcGFydHMgPSBzcGxpdFByZWZpeChuYW1lKSxcbiAgICAgICAgICAgIHByZWZpeCA9IHBhcnRzWzBdO1xuXG4gICAgICAgIG5hbWUgPSBwYXJ0c1sxXTtcblxuICAgICAgICBpZiAocHJlZml4KSB7XG4gICAgICAgICAgICBwcmVmaXggPSBub3JtYWxpemUocHJlZml4LCByZWxOYW1lKTtcbiAgICAgICAgICAgIHBsdWdpbiA9IGNhbGxEZXAocHJlZml4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vTm9ybWFsaXplIGFjY29yZGluZ1xuICAgICAgICBpZiAocHJlZml4KSB7XG4gICAgICAgICAgICBpZiAocGx1Z2luICYmIHBsdWdpbi5ub3JtYWxpemUpIHtcbiAgICAgICAgICAgICAgICBuYW1lID0gcGx1Z2luLm5vcm1hbGl6ZShuYW1lLCBtYWtlTm9ybWFsaXplKHJlbE5hbWUpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmFtZSA9IG5vcm1hbGl6ZShuYW1lLCByZWxOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5hbWUgPSBub3JtYWxpemUobmFtZSwgcmVsTmFtZSk7XG4gICAgICAgICAgICBwYXJ0cyA9IHNwbGl0UHJlZml4KG5hbWUpO1xuICAgICAgICAgICAgcHJlZml4ID0gcGFydHNbMF07XG4gICAgICAgICAgICBuYW1lID0gcGFydHNbMV07XG4gICAgICAgICAgICBpZiAocHJlZml4KSB7XG4gICAgICAgICAgICAgICAgcGx1Z2luID0gY2FsbERlcChwcmVmaXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9Vc2luZyByaWRpY3Vsb3VzIHByb3BlcnR5IG5hbWVzIGZvciBzcGFjZSByZWFzb25zXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBmOiBwcmVmaXggPyBwcmVmaXggKyAnIScgKyBuYW1lIDogbmFtZSwgLy9mdWxsTmFtZVxuICAgICAgICAgICAgbjogbmFtZSxcbiAgICAgICAgICAgIHByOiBwcmVmaXgsXG4gICAgICAgICAgICBwOiBwbHVnaW5cbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gbWFrZUNvbmZpZyhuYW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gKGNvbmZpZyAmJiBjb25maWcuY29uZmlnICYmIGNvbmZpZy5jb25maWdbbmFtZV0pIHx8IHt9O1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGhhbmRsZXJzID0ge1xuICAgICAgICByZXF1aXJlOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIG1ha2VSZXF1aXJlKG5hbWUpO1xuICAgICAgICB9LFxuICAgICAgICBleHBvcnRzOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgdmFyIGUgPSBkZWZpbmVkW25hbWVdO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKGRlZmluZWRbbmFtZV0gPSB7fSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1vZHVsZTogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaWQ6IG5hbWUsXG4gICAgICAgICAgICAgICAgdXJpOiAnJyxcbiAgICAgICAgICAgICAgICBleHBvcnRzOiBkZWZpbmVkW25hbWVdLFxuICAgICAgICAgICAgICAgIGNvbmZpZzogbWFrZUNvbmZpZyhuYW1lKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBtYWluID0gZnVuY3Rpb24gKG5hbWUsIGRlcHMsIGNhbGxiYWNrLCByZWxOYW1lKSB7XG4gICAgICAgIHZhciBjanNNb2R1bGUsIGRlcE5hbWUsIHJldCwgbWFwLCBpLFxuICAgICAgICAgICAgYXJncyA9IFtdLFxuICAgICAgICAgICAgY2FsbGJhY2tUeXBlID0gdHlwZW9mIGNhbGxiYWNrLFxuICAgICAgICAgICAgdXNpbmdFeHBvcnRzO1xuXG4gICAgICAgIC8vVXNlIG5hbWUgaWYgbm8gcmVsTmFtZVxuICAgICAgICByZWxOYW1lID0gcmVsTmFtZSB8fCBuYW1lO1xuXG4gICAgICAgIC8vQ2FsbCB0aGUgY2FsbGJhY2sgdG8gZGVmaW5lIHRoZSBtb2R1bGUsIGlmIG5lY2Vzc2FyeS5cbiAgICAgICAgaWYgKGNhbGxiYWNrVHlwZSA9PT0gJ3VuZGVmaW5lZCcgfHwgY2FsbGJhY2tUeXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAvL1B1bGwgb3V0IHRoZSBkZWZpbmVkIGRlcGVuZGVuY2llcyBhbmQgcGFzcyB0aGUgb3JkZXJlZFxuICAgICAgICAgICAgLy92YWx1ZXMgdG8gdGhlIGNhbGxiYWNrLlxuICAgICAgICAgICAgLy9EZWZhdWx0IHRvIFtyZXF1aXJlLCBleHBvcnRzLCBtb2R1bGVdIGlmIG5vIGRlcHNcbiAgICAgICAgICAgIGRlcHMgPSAhZGVwcy5sZW5ndGggJiYgY2FsbGJhY2subGVuZ3RoID8gWydyZXF1aXJlJywgJ2V4cG9ydHMnLCAnbW9kdWxlJ10gOiBkZXBzO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGRlcHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBtYXAgPSBtYWtlTWFwKGRlcHNbaV0sIHJlbE5hbWUpO1xuICAgICAgICAgICAgICAgIGRlcE5hbWUgPSBtYXAuZjtcblxuICAgICAgICAgICAgICAgIC8vRmFzdCBwYXRoIENvbW1vbkpTIHN0YW5kYXJkIGRlcGVuZGVuY2llcy5cbiAgICAgICAgICAgICAgICBpZiAoZGVwTmFtZSA9PT0gXCJyZXF1aXJlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnc1tpXSA9IGhhbmRsZXJzLnJlcXVpcmUobmFtZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkZXBOYW1lID09PSBcImV4cG9ydHNcIikge1xuICAgICAgICAgICAgICAgICAgICAvL0NvbW1vbkpTIG1vZHVsZSBzcGVjIDEuMVxuICAgICAgICAgICAgICAgICAgICBhcmdzW2ldID0gaGFuZGxlcnMuZXhwb3J0cyhuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgdXNpbmdFeHBvcnRzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRlcE5hbWUgPT09IFwibW9kdWxlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9Db21tb25KUyBtb2R1bGUgc3BlYyAxLjFcbiAgICAgICAgICAgICAgICAgICAgY2pzTW9kdWxlID0gYXJnc1tpXSA9IGhhbmRsZXJzLm1vZHVsZShuYW1lKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGhhc1Byb3AoZGVmaW5lZCwgZGVwTmFtZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc1Byb3Aod2FpdGluZywgZGVwTmFtZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc1Byb3AoZGVmaW5pbmcsIGRlcE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ3NbaV0gPSBjYWxsRGVwKGRlcE5hbWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWFwLnApIHtcbiAgICAgICAgICAgICAgICAgICAgbWFwLnAubG9hZChtYXAubiwgbWFrZVJlcXVpcmUocmVsTmFtZSwgdHJ1ZSksIG1ha2VMb2FkKGRlcE5hbWUpLCB7fSk7XG4gICAgICAgICAgICAgICAgICAgIGFyZ3NbaV0gPSBkZWZpbmVkW2RlcE5hbWVdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihuYW1lICsgJyBtaXNzaW5nICcgKyBkZXBOYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldCA9IGNhbGxiYWNrID8gY2FsbGJhY2suYXBwbHkoZGVmaW5lZFtuYW1lXSwgYXJncykgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgLy9JZiBzZXR0aW5nIGV4cG9ydHMgdmlhIFwibW9kdWxlXCIgaXMgaW4gcGxheSxcbiAgICAgICAgICAgICAgICAvL2Zhdm9yIHRoYXQgb3ZlciByZXR1cm4gdmFsdWUgYW5kIGV4cG9ydHMuIEFmdGVyIHRoYXQsXG4gICAgICAgICAgICAgICAgLy9mYXZvciBhIG5vbi11bmRlZmluZWQgcmV0dXJuIHZhbHVlIG92ZXIgZXhwb3J0cyB1c2UuXG4gICAgICAgICAgICAgICAgaWYgKGNqc01vZHVsZSAmJiBjanNNb2R1bGUuZXhwb3J0cyAhPT0gdW5kZWYgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGNqc01vZHVsZS5leHBvcnRzICE9PSBkZWZpbmVkW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmluZWRbbmFtZV0gPSBjanNNb2R1bGUuZXhwb3J0cztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJldCAhPT0gdW5kZWYgfHwgIXVzaW5nRXhwb3J0cykge1xuICAgICAgICAgICAgICAgICAgICAvL1VzZSB0aGUgcmV0dXJuIHZhbHVlIGZyb20gdGhlIGZ1bmN0aW9uLlxuICAgICAgICAgICAgICAgICAgICBkZWZpbmVkW25hbWVdID0gcmV0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChuYW1lKSB7XG4gICAgICAgICAgICAvL01heSBqdXN0IGJlIGFuIG9iamVjdCBkZWZpbml0aW9uIGZvciB0aGUgbW9kdWxlLiBPbmx5XG4gICAgICAgICAgICAvL3dvcnJ5IGFib3V0IGRlZmluaW5nIGlmIGhhdmUgYSBtb2R1bGUgbmFtZS5cbiAgICAgICAgICAgIGRlZmluZWRbbmFtZV0gPSBjYWxsYmFjaztcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICByZXF1aXJlanMgPSByZXF1aXJlID0gcmVxID0gZnVuY3Rpb24gKGRlcHMsIGNhbGxiYWNrLCByZWxOYW1lLCBmb3JjZVN5bmMsIGFsdCkge1xuICAgICAgICBpZiAodHlwZW9mIGRlcHMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGlmIChoYW5kbGVyc1tkZXBzXSkge1xuICAgICAgICAgICAgICAgIC8vY2FsbGJhY2sgaW4gdGhpcyBjYXNlIGlzIHJlYWxseSByZWxOYW1lXG4gICAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZXJzW2RlcHNdKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vSnVzdCByZXR1cm4gdGhlIG1vZHVsZSB3YW50ZWQuIEluIHRoaXMgc2NlbmFyaW8sIHRoZVxuICAgICAgICAgICAgLy9kZXBzIGFyZyBpcyB0aGUgbW9kdWxlIG5hbWUsIGFuZCBzZWNvbmQgYXJnIChpZiBwYXNzZWQpXG4gICAgICAgICAgICAvL2lzIGp1c3QgdGhlIHJlbE5hbWUuXG4gICAgICAgICAgICAvL05vcm1hbGl6ZSBtb2R1bGUgbmFtZSwgaWYgaXQgY29udGFpbnMgLiBvciAuLlxuICAgICAgICAgICAgcmV0dXJuIGNhbGxEZXAobWFrZU1hcChkZXBzLCBjYWxsYmFjaykuZik7XG4gICAgICAgIH0gZWxzZSBpZiAoIWRlcHMuc3BsaWNlKSB7XG4gICAgICAgICAgICAvL2RlcHMgaXMgYSBjb25maWcgb2JqZWN0LCBub3QgYW4gYXJyYXkuXG4gICAgICAgICAgICBjb25maWcgPSBkZXBzO1xuICAgICAgICAgICAgaWYgKGNvbmZpZy5kZXBzKSB7XG4gICAgICAgICAgICAgICAgcmVxKGNvbmZpZy5kZXBzLCBjb25maWcuY2FsbGJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrLnNwbGljZSkge1xuICAgICAgICAgICAgICAgIC8vY2FsbGJhY2sgaXMgYW4gYXJyYXksIHdoaWNoIG1lYW5zIGl0IGlzIGEgZGVwZW5kZW5jeSBsaXN0LlxuICAgICAgICAgICAgICAgIC8vQWRqdXN0IGFyZ3MgaWYgdGhlcmUgYXJlIGRlcGVuZGVuY2llc1xuICAgICAgICAgICAgICAgIGRlcHMgPSBjYWxsYmFjaztcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IHJlbE5hbWU7XG4gICAgICAgICAgICAgICAgcmVsTmFtZSA9IG51bGw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlcHMgPSB1bmRlZjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vU3VwcG9ydCByZXF1aXJlKFsnYSddKVxuICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgICAgIC8vSWYgcmVsTmFtZSBpcyBhIGZ1bmN0aW9uLCBpdCBpcyBhbiBlcnJiYWNrIGhhbmRsZXIsXG4gICAgICAgIC8vc28gcmVtb3ZlIGl0LlxuICAgICAgICBpZiAodHlwZW9mIHJlbE5hbWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJlbE5hbWUgPSBmb3JjZVN5bmM7XG4gICAgICAgICAgICBmb3JjZVN5bmMgPSBhbHQ7XG4gICAgICAgIH1cblxuICAgICAgICAvL1NpbXVsYXRlIGFzeW5jIGNhbGxiYWNrO1xuICAgICAgICBpZiAoZm9yY2VTeW5jKSB7XG4gICAgICAgICAgICBtYWluKHVuZGVmLCBkZXBzLCBjYWxsYmFjaywgcmVsTmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL1VzaW5nIGEgbm9uLXplcm8gdmFsdWUgYmVjYXVzZSBvZiBjb25jZXJuIGZvciB3aGF0IG9sZCBicm93c2Vyc1xuICAgICAgICAgICAgLy9kbywgYW5kIGxhdGVzdCBicm93c2VycyBcInVwZ3JhZGVcIiB0byA0IGlmIGxvd2VyIHZhbHVlIGlzIHVzZWQ6XG4gICAgICAgICAgICAvL2h0dHA6Ly93d3cud2hhdHdnLm9yZy9zcGVjcy93ZWItYXBwcy9jdXJyZW50LXdvcmsvbXVsdGlwYWdlL3RpbWVycy5odG1sI2RvbS13aW5kb3d0aW1lcnMtc2V0dGltZW91dDpcbiAgICAgICAgICAgIC8vSWYgd2FudCBhIHZhbHVlIGltbWVkaWF0ZWx5LCB1c2UgcmVxdWlyZSgnaWQnKSBpbnN0ZWFkIC0tIHNvbWV0aGluZ1xuICAgICAgICAgICAgLy90aGF0IHdvcmtzIGluIGFsbW9uZCBvbiB0aGUgZ2xvYmFsIGxldmVsLCBidXQgbm90IGd1YXJhbnRlZWQgYW5kXG4gICAgICAgICAgICAvL3VubGlrZWx5IHRvIHdvcmsgaW4gb3RoZXIgQU1EIGltcGxlbWVudGF0aW9ucy5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIG1haW4odW5kZWYsIGRlcHMsIGNhbGxiYWNrLCByZWxOYW1lKTtcbiAgICAgICAgICAgIH0sIDQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlcTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogSnVzdCBkcm9wcyB0aGUgY29uZmlnIG9uIHRoZSBmbG9vciwgYnV0IHJldHVybnMgcmVxIGluIGNhc2VcbiAgICAgKiB0aGUgY29uZmlnIHJldHVybiB2YWx1ZSBpcyB1c2VkLlxuICAgICAqL1xuICAgIHJlcS5jb25maWcgPSBmdW5jdGlvbiAoY2ZnKSB7XG4gICAgICAgIHJldHVybiByZXEoY2ZnKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRXhwb3NlIG1vZHVsZSByZWdpc3RyeSBmb3IgZGVidWdnaW5nIGFuZCB0b29saW5nXG4gICAgICovXG4gICAgcmVxdWlyZWpzLl9kZWZpbmVkID0gZGVmaW5lZDtcblxuICAgIGRlZmluZSA9IGZ1bmN0aW9uIChuYW1lLCBkZXBzLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NlZSBhbG1vbmQgUkVBRE1FOiBpbmNvcnJlY3QgbW9kdWxlIGJ1aWxkLCBubyBtb2R1bGUgbmFtZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9UaGlzIG1vZHVsZSBtYXkgbm90IGhhdmUgZGVwZW5kZW5jaWVzXG4gICAgICAgIGlmICghZGVwcy5zcGxpY2UpIHtcbiAgICAgICAgICAgIC8vZGVwcyBpcyBub3QgYW4gYXJyYXksIHNvIHByb2JhYmx5IG1lYW5zXG4gICAgICAgICAgICAvL2FuIG9iamVjdCBsaXRlcmFsIG9yIGZhY3RvcnkgZnVuY3Rpb24gZm9yXG4gICAgICAgICAgICAvL3RoZSB2YWx1ZS4gQWRqdXN0IGFyZ3MuXG4gICAgICAgICAgICBjYWxsYmFjayA9IGRlcHM7XG4gICAgICAgICAgICBkZXBzID0gW107XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWhhc1Byb3AoZGVmaW5lZCwgbmFtZSkgJiYgIWhhc1Byb3Aod2FpdGluZywgbmFtZSkpIHtcbiAgICAgICAgICAgIHdhaXRpbmdbbmFtZV0gPSBbbmFtZSwgZGVwcywgY2FsbGJhY2tdO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGRlZmluZS5hbWQgPSB7XG4gICAgICAgIGpRdWVyeTogdHJ1ZVxuICAgIH07XG59KCkpO1xuXG5TMi5yZXF1aXJlanMgPSByZXF1aXJlanM7UzIucmVxdWlyZSA9IHJlcXVpcmU7UzIuZGVmaW5lID0gZGVmaW5lO1xufVxufSgpKTtcblMyLmRlZmluZShcImFsbW9uZFwiLCBmdW5jdGlvbigpe30pO1xuXG4vKiBnbG9iYWwgalF1ZXJ5OmZhbHNlLCAkOmZhbHNlICovXG5TMi5kZWZpbmUoJ2pxdWVyeScsW10sZnVuY3Rpb24gKCkge1xuICB2YXIgXyQgPSBqUXVlcnkgfHwgJDtcblxuICBpZiAoXyQgPT0gbnVsbCAmJiBjb25zb2xlICYmIGNvbnNvbGUuZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKFxuICAgICAgJ1NlbGVjdDI6IEFuIGluc3RhbmNlIG9mIGpRdWVyeSBvciBhIGpRdWVyeS1jb21wYXRpYmxlIGxpYnJhcnkgd2FzIG5vdCAnICtcbiAgICAgICdmb3VuZC4gTWFrZSBzdXJlIHRoYXQgeW91IGFyZSBpbmNsdWRpbmcgalF1ZXJ5IGJlZm9yZSBTZWxlY3QyIG9uIHlvdXIgJyArXG4gICAgICAnd2ViIHBhZ2UuJ1xuICAgICk7XG4gIH1cblxuICByZXR1cm4gXyQ7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL3V0aWxzJyxbXG4gICdqcXVlcnknXG5dLCBmdW5jdGlvbiAoJCkge1xuICB2YXIgVXRpbHMgPSB7fTtcblxuICBVdGlscy5FeHRlbmQgPSBmdW5jdGlvbiAoQ2hpbGRDbGFzcywgU3VwZXJDbGFzcykge1xuICAgIHZhciBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuICAgIGZ1bmN0aW9uIEJhc2VDb25zdHJ1Y3RvciAoKSB7XG4gICAgICB0aGlzLmNvbnN0cnVjdG9yID0gQ2hpbGRDbGFzcztcbiAgICB9XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gU3VwZXJDbGFzcykge1xuICAgICAgaWYgKF9faGFzUHJvcC5jYWxsKFN1cGVyQ2xhc3MsIGtleSkpIHtcbiAgICAgICAgQ2hpbGRDbGFzc1trZXldID0gU3VwZXJDbGFzc1trZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIEJhc2VDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBTdXBlckNsYXNzLnByb3RvdHlwZTtcbiAgICBDaGlsZENsYXNzLnByb3RvdHlwZSA9IG5ldyBCYXNlQ29uc3RydWN0b3IoKTtcbiAgICBDaGlsZENsYXNzLl9fc3VwZXJfXyA9IFN1cGVyQ2xhc3MucHJvdG90eXBlO1xuXG4gICAgcmV0dXJuIENoaWxkQ2xhc3M7XG4gIH07XG5cbiAgZnVuY3Rpb24gZ2V0TWV0aG9kcyAodGhlQ2xhc3MpIHtcbiAgICB2YXIgcHJvdG8gPSB0aGVDbGFzcy5wcm90b3R5cGU7XG5cbiAgICB2YXIgbWV0aG9kcyA9IFtdO1xuXG4gICAgZm9yICh2YXIgbWV0aG9kTmFtZSBpbiBwcm90bykge1xuICAgICAgdmFyIG0gPSBwcm90b1ttZXRob2ROYW1lXTtcblxuICAgICAgaWYgKHR5cGVvZiBtICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAobWV0aG9kTmFtZSA9PT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgbWV0aG9kcy5wdXNoKG1ldGhvZE5hbWUpO1xuICAgIH1cblxuICAgIHJldHVybiBtZXRob2RzO1xuICB9XG5cbiAgVXRpbHMuRGVjb3JhdGUgPSBmdW5jdGlvbiAoU3VwZXJDbGFzcywgRGVjb3JhdG9yQ2xhc3MpIHtcbiAgICB2YXIgZGVjb3JhdGVkTWV0aG9kcyA9IGdldE1ldGhvZHMoRGVjb3JhdG9yQ2xhc3MpO1xuICAgIHZhciBzdXBlck1ldGhvZHMgPSBnZXRNZXRob2RzKFN1cGVyQ2xhc3MpO1xuXG4gICAgZnVuY3Rpb24gRGVjb3JhdGVkQ2xhc3MgKCkge1xuICAgICAgdmFyIHVuc2hpZnQgPSBBcnJheS5wcm90b3R5cGUudW5zaGlmdDtcblxuICAgICAgdmFyIGFyZ0NvdW50ID0gRGVjb3JhdG9yQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yLmxlbmd0aDtcblxuICAgICAgdmFyIGNhbGxlZENvbnN0cnVjdG9yID0gU3VwZXJDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3I7XG5cbiAgICAgIGlmIChhcmdDb3VudCA+IDApIHtcbiAgICAgICAgdW5zaGlmdC5jYWxsKGFyZ3VtZW50cywgU3VwZXJDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IpO1xuXG4gICAgICAgIGNhbGxlZENvbnN0cnVjdG9yID0gRGVjb3JhdG9yQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yO1xuICAgICAgfVxuXG4gICAgICBjYWxsZWRDb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIERlY29yYXRvckNsYXNzLmRpc3BsYXlOYW1lID0gU3VwZXJDbGFzcy5kaXNwbGF5TmFtZTtcblxuICAgIGZ1bmN0aW9uIGN0ciAoKSB7XG4gICAgICB0aGlzLmNvbnN0cnVjdG9yID0gRGVjb3JhdGVkQ2xhc3M7XG4gICAgfVxuXG4gICAgRGVjb3JhdGVkQ2xhc3MucHJvdG90eXBlID0gbmV3IGN0cigpO1xuXG4gICAgZm9yICh2YXIgbSA9IDA7IG0gPCBzdXBlck1ldGhvZHMubGVuZ3RoOyBtKyspIHtcbiAgICAgICAgdmFyIHN1cGVyTWV0aG9kID0gc3VwZXJNZXRob2RzW21dO1xuXG4gICAgICAgIERlY29yYXRlZENsYXNzLnByb3RvdHlwZVtzdXBlck1ldGhvZF0gPVxuICAgICAgICAgIFN1cGVyQ2xhc3MucHJvdG90eXBlW3N1cGVyTWV0aG9kXTtcbiAgICB9XG5cbiAgICB2YXIgY2FsbGVkTWV0aG9kID0gZnVuY3Rpb24gKG1ldGhvZE5hbWUpIHtcbiAgICAgIC8vIFN0dWIgb3V0IHRoZSBvcmlnaW5hbCBtZXRob2QgaWYgaXQncyBub3QgZGVjb3JhdGluZyBhbiBhY3R1YWwgbWV0aG9kXG4gICAgICB2YXIgb3JpZ2luYWxNZXRob2QgPSBmdW5jdGlvbiAoKSB7fTtcblxuICAgICAgaWYgKG1ldGhvZE5hbWUgaW4gRGVjb3JhdGVkQ2xhc3MucHJvdG90eXBlKSB7XG4gICAgICAgIG9yaWdpbmFsTWV0aG9kID0gRGVjb3JhdGVkQ2xhc3MucHJvdG90eXBlW21ldGhvZE5hbWVdO1xuICAgICAgfVxuXG4gICAgICB2YXIgZGVjb3JhdGVkTWV0aG9kID0gRGVjb3JhdG9yQ2xhc3MucHJvdG90eXBlW21ldGhvZE5hbWVdO1xuXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdW5zaGlmdCA9IEFycmF5LnByb3RvdHlwZS51bnNoaWZ0O1xuXG4gICAgICAgIHVuc2hpZnQuY2FsbChhcmd1bWVudHMsIG9yaWdpbmFsTWV0aG9kKTtcblxuICAgICAgICByZXR1cm4gZGVjb3JhdGVkTWV0aG9kLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgIH07XG5cbiAgICBmb3IgKHZhciBkID0gMDsgZCA8IGRlY29yYXRlZE1ldGhvZHMubGVuZ3RoOyBkKyspIHtcbiAgICAgIHZhciBkZWNvcmF0ZWRNZXRob2QgPSBkZWNvcmF0ZWRNZXRob2RzW2RdO1xuXG4gICAgICBEZWNvcmF0ZWRDbGFzcy5wcm90b3R5cGVbZGVjb3JhdGVkTWV0aG9kXSA9IGNhbGxlZE1ldGhvZChkZWNvcmF0ZWRNZXRob2QpO1xuICAgIH1cblxuICAgIHJldHVybiBEZWNvcmF0ZWRDbGFzcztcbiAgfTtcblxuICB2YXIgT2JzZXJ2YWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmxpc3RlbmVycyA9IHt9O1xuICB9O1xuXG4gIE9ic2VydmFibGUucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKGV2ZW50LCBjYWxsYmFjaykge1xuICAgIHRoaXMubGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnMgfHwge307XG5cbiAgICBpZiAoZXZlbnQgaW4gdGhpcy5saXN0ZW5lcnMpIHtcbiAgICAgIHRoaXMubGlzdGVuZXJzW2V2ZW50XS5wdXNoKGNhbGxiYWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5saXN0ZW5lcnNbZXZlbnRdID0gW2NhbGxiYWNrXTtcbiAgICB9XG4gIH07XG5cbiAgT2JzZXJ2YWJsZS5wcm90b3R5cGUudHJpZ2dlciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbiAgICB2YXIgcGFyYW1zID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gICAgdGhpcy5saXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVycyB8fCB7fTtcblxuICAgIC8vIFBhcmFtcyBzaG91bGQgYWx3YXlzIGNvbWUgaW4gYXMgYW4gYXJyYXlcbiAgICBpZiAocGFyYW1zID09IG51bGwpIHtcbiAgICAgIHBhcmFtcyA9IFtdO1xuICAgIH1cblxuICAgIC8vIElmIHRoZXJlIGFyZSBubyBhcmd1bWVudHMgdG8gdGhlIGV2ZW50LCB1c2UgYSB0ZW1wb3Jhcnkgb2JqZWN0XG4gICAgaWYgKHBhcmFtcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHBhcmFtcy5wdXNoKHt9KTtcbiAgICB9XG5cbiAgICAvLyBTZXQgdGhlIGBfdHlwZWAgb2YgdGhlIGZpcnN0IG9iamVjdCB0byB0aGUgZXZlbnRcbiAgICBwYXJhbXNbMF0uX3R5cGUgPSBldmVudDtcblxuICAgIGlmIChldmVudCBpbiB0aGlzLmxpc3RlbmVycykge1xuICAgICAgdGhpcy5pbnZva2UodGhpcy5saXN0ZW5lcnNbZXZlbnRdLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIH1cblxuICAgIGlmICgnKicgaW4gdGhpcy5saXN0ZW5lcnMpIHtcbiAgICAgIHRoaXMuaW52b2tlKHRoaXMubGlzdGVuZXJzWycqJ10sIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9O1xuXG4gIE9ic2VydmFibGUucHJvdG90eXBlLmludm9rZSA9IGZ1bmN0aW9uIChsaXN0ZW5lcnMsIHBhcmFtcykge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBwYXJhbXMpO1xuICAgIH1cbiAgfTtcblxuICBVdGlscy5PYnNlcnZhYmxlID0gT2JzZXJ2YWJsZTtcblxuICBVdGlscy5nZW5lcmF0ZUNoYXJzID0gZnVuY3Rpb24gKGxlbmd0aCkge1xuICAgIHZhciBjaGFycyA9ICcnO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHJhbmRvbUNoYXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAzNik7XG4gICAgICBjaGFycyArPSByYW5kb21DaGFyLnRvU3RyaW5nKDM2KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2hhcnM7XG4gIH07XG5cbiAgVXRpbHMuYmluZCA9IGZ1bmN0aW9uIChmdW5jLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9O1xuXG4gIFV0aWxzLl9jb252ZXJ0RGF0YSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgZm9yICh2YXIgb3JpZ2luYWxLZXkgaW4gZGF0YSkge1xuICAgICAgdmFyIGtleXMgPSBvcmlnaW5hbEtleS5zcGxpdCgnLScpO1xuXG4gICAgICB2YXIgZGF0YUxldmVsID0gZGF0YTtcblxuICAgICAgaWYgKGtleXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IGtleXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXNba107XG5cbiAgICAgICAgLy8gTG93ZXJjYXNlIHRoZSBmaXJzdCBsZXR0ZXJcbiAgICAgICAgLy8gQnkgZGVmYXVsdCwgZGFzaC1zZXBhcmF0ZWQgYmVjb21lcyBjYW1lbENhc2VcbiAgICAgICAga2V5ID0ga2V5LnN1YnN0cmluZygwLCAxKS50b0xvd2VyQ2FzZSgpICsga2V5LnN1YnN0cmluZygxKTtcblxuICAgICAgICBpZiAoIShrZXkgaW4gZGF0YUxldmVsKSkge1xuICAgICAgICAgIGRhdGFMZXZlbFtrZXldID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoayA9PSBrZXlzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBkYXRhTGV2ZWxba2V5XSA9IGRhdGFbb3JpZ2luYWxLZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgZGF0YUxldmVsID0gZGF0YUxldmVsW2tleV07XG4gICAgICB9XG5cbiAgICAgIGRlbGV0ZSBkYXRhW29yaWdpbmFsS2V5XTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcblxuICBVdGlscy5oYXNTY3JvbGwgPSBmdW5jdGlvbiAoaW5kZXgsIGVsKSB7XG4gICAgLy8gQWRhcHRlZCBmcm9tIHRoZSBmdW5jdGlvbiBjcmVhdGVkIGJ5IEBTaGFkb3dTY3JpcHRlclxuICAgIC8vIGFuZCBhZGFwdGVkIGJ5IEBCaWxsQmFycnkgb24gdGhlIFN0YWNrIEV4Y2hhbmdlIENvZGUgUmV2aWV3IHdlYnNpdGUuXG4gICAgLy8gVGhlIG9yaWdpbmFsIGNvZGUgY2FuIGJlIGZvdW5kIGF0XG4gICAgLy8gaHR0cDovL2NvZGVyZXZpZXcuc3RhY2tleGNoYW5nZS5jb20vcS8xMzMzOFxuICAgIC8vIGFuZCB3YXMgZGVzaWduZWQgdG8gYmUgdXNlZCB3aXRoIHRoZSBTaXp6bGUgc2VsZWN0b3IgZW5naW5lLlxuXG4gICAgdmFyICRlbCA9ICQoZWwpO1xuICAgIHZhciBvdmVyZmxvd1ggPSBlbC5zdHlsZS5vdmVyZmxvd1g7XG4gICAgdmFyIG92ZXJmbG93WSA9IGVsLnN0eWxlLm92ZXJmbG93WTtcblxuICAgIC8vQ2hlY2sgYm90aCB4IGFuZCB5IGRlY2xhcmF0aW9uc1xuICAgIGlmIChvdmVyZmxvd1ggPT09IG92ZXJmbG93WSAmJlxuICAgICAgICAob3ZlcmZsb3dZID09PSAnaGlkZGVuJyB8fCBvdmVyZmxvd1kgPT09ICd2aXNpYmxlJykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAob3ZlcmZsb3dYID09PSAnc2Nyb2xsJyB8fCBvdmVyZmxvd1kgPT09ICdzY3JvbGwnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gKCRlbC5pbm5lckhlaWdodCgpIDwgZWwuc2Nyb2xsSGVpZ2h0IHx8XG4gICAgICAkZWwuaW5uZXJXaWR0aCgpIDwgZWwuc2Nyb2xsV2lkdGgpO1xuICB9O1xuXG4gIFV0aWxzLmVzY2FwZU1hcmt1cCA9IGZ1bmN0aW9uIChtYXJrdXApIHtcbiAgICB2YXIgcmVwbGFjZU1hcCA9IHtcbiAgICAgICdcXFxcJzogJyYjOTI7JyxcbiAgICAgICcmJzogJyZhbXA7JyxcbiAgICAgICc8JzogJyZsdDsnLFxuICAgICAgJz4nOiAnJmd0OycsXG4gICAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICAgICdcXCcnOiAnJiMzOTsnLFxuICAgICAgJy8nOiAnJiM0NzsnXG4gICAgfTtcblxuICAgIC8vIERvIG5vdCB0cnkgdG8gZXNjYXBlIHRoZSBtYXJrdXAgaWYgaXQncyBub3QgYSBzdHJpbmdcbiAgICBpZiAodHlwZW9mIG1hcmt1cCAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBtYXJrdXA7XG4gICAgfVxuXG4gICAgcmV0dXJuIFN0cmluZyhtYXJrdXApLnJlcGxhY2UoL1smPD5cIidcXC9cXFxcXS9nLCBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICAgIHJldHVybiByZXBsYWNlTWFwW21hdGNoXTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBBcHBlbmQgYW4gYXJyYXkgb2YgalF1ZXJ5IG5vZGVzIHRvIGEgZ2l2ZW4gZWxlbWVudC5cbiAgVXRpbHMuYXBwZW5kTWFueSA9IGZ1bmN0aW9uICgkZWxlbWVudCwgJG5vZGVzKSB7XG4gICAgLy8galF1ZXJ5IDEuNy54IGRvZXMgbm90IHN1cHBvcnQgJC5mbi5hcHBlbmQoKSB3aXRoIGFuIGFycmF5XG4gICAgLy8gRmFsbCBiYWNrIHRvIGEgalF1ZXJ5IG9iamVjdCBjb2xsZWN0aW9uIHVzaW5nICQuZm4uYWRkKClcbiAgICBpZiAoJC5mbi5qcXVlcnkuc3Vic3RyKDAsIDMpID09PSAnMS43Jykge1xuICAgICAgdmFyICRqcU5vZGVzID0gJCgpO1xuXG4gICAgICAkLm1hcCgkbm9kZXMsIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICRqcU5vZGVzID0gJGpxTm9kZXMuYWRkKG5vZGUpO1xuICAgICAgfSk7XG5cbiAgICAgICRub2RlcyA9ICRqcU5vZGVzO1xuICAgIH1cblxuICAgICRlbGVtZW50LmFwcGVuZCgkbm9kZXMpO1xuICB9O1xuXG4gIHJldHVybiBVdGlscztcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvcmVzdWx0cycsW1xuICAnanF1ZXJ5JyxcbiAgJy4vdXRpbHMnXG5dLCBmdW5jdGlvbiAoJCwgVXRpbHMpIHtcbiAgZnVuY3Rpb24gUmVzdWx0cyAoJGVsZW1lbnQsIG9wdGlvbnMsIGRhdGFBZGFwdGVyKSB7XG4gICAgdGhpcy4kZWxlbWVudCA9ICRlbGVtZW50O1xuICAgIHRoaXMuZGF0YSA9IGRhdGFBZGFwdGVyO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICBSZXN1bHRzLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMpO1xuICB9XG5cbiAgVXRpbHMuRXh0ZW5kKFJlc3VsdHMsIFV0aWxzLk9ic2VydmFibGUpO1xuXG4gIFJlc3VsdHMucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJHJlc3VsdHMgPSAkKFxuICAgICAgJzx1bCBjbGFzcz1cInNlbGVjdDItcmVzdWx0c19fb3B0aW9uc1wiIHJvbGU9XCJ0cmVlXCI+PC91bD4nXG4gICAgKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuZ2V0KCdtdWx0aXBsZScpKSB7XG4gICAgICAkcmVzdWx0cy5hdHRyKCdhcmlhLW11bHRpc2VsZWN0YWJsZScsICd0cnVlJyk7XG4gICAgfVxuXG4gICAgdGhpcy4kcmVzdWx0cyA9ICRyZXN1bHRzO1xuXG4gICAgcmV0dXJuICRyZXN1bHRzO1xuICB9O1xuXG4gIFJlc3VsdHMucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJHJlc3VsdHMuZW1wdHkoKTtcbiAgfTtcblxuICBSZXN1bHRzLnByb3RvdHlwZS5kaXNwbGF5TWVzc2FnZSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICB2YXIgZXNjYXBlTWFya3VwID0gdGhpcy5vcHRpb25zLmdldCgnZXNjYXBlTWFya3VwJyk7XG5cbiAgICB0aGlzLmNsZWFyKCk7XG4gICAgdGhpcy5oaWRlTG9hZGluZygpO1xuXG4gICAgdmFyICRtZXNzYWdlID0gJChcbiAgICAgICc8bGkgcm9sZT1cInRyZWVpdGVtXCIgYXJpYS1saXZlPVwiYXNzZXJ0aXZlXCInICtcbiAgICAgICcgY2xhc3M9XCJzZWxlY3QyLXJlc3VsdHNfX29wdGlvblwiPjwvbGk+J1xuICAgICk7XG5cbiAgICB2YXIgbWVzc2FnZSA9IHRoaXMub3B0aW9ucy5nZXQoJ3RyYW5zbGF0aW9ucycpLmdldChwYXJhbXMubWVzc2FnZSk7XG5cbiAgICAkbWVzc2FnZS5hcHBlbmQoXG4gICAgICBlc2NhcGVNYXJrdXAoXG4gICAgICAgIG1lc3NhZ2UocGFyYW1zLmFyZ3MpXG4gICAgICApXG4gICAgKTtcblxuICAgICRtZXNzYWdlWzBdLmNsYXNzTmFtZSArPSAnIHNlbGVjdDItcmVzdWx0c19fbWVzc2FnZSc7XG5cbiAgICB0aGlzLiRyZXN1bHRzLmFwcGVuZCgkbWVzc2FnZSk7XG4gIH07XG5cbiAgUmVzdWx0cy5wcm90b3R5cGUuaGlkZU1lc3NhZ2VzID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJHJlc3VsdHMuZmluZCgnLnNlbGVjdDItcmVzdWx0c19fbWVzc2FnZScpLnJlbW92ZSgpO1xuICB9O1xuXG4gIFJlc3VsdHMucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5oaWRlTG9hZGluZygpO1xuXG4gICAgdmFyICRvcHRpb25zID0gW107XG5cbiAgICBpZiAoZGF0YS5yZXN1bHRzID09IG51bGwgfHwgZGF0YS5yZXN1bHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgaWYgKHRoaXMuJHJlc3VsdHMuY2hpbGRyZW4oKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy50cmlnZ2VyKCdyZXN1bHRzOm1lc3NhZ2UnLCB7XG4gICAgICAgICAgbWVzc2FnZTogJ25vUmVzdWx0cydcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBkYXRhLnJlc3VsdHMgPSB0aGlzLnNvcnQoZGF0YS5yZXN1bHRzKTtcblxuICAgIGZvciAodmFyIGQgPSAwOyBkIDwgZGF0YS5yZXN1bHRzLmxlbmd0aDsgZCsrKSB7XG4gICAgICB2YXIgaXRlbSA9IGRhdGEucmVzdWx0c1tkXTtcblxuICAgICAgdmFyICRvcHRpb24gPSB0aGlzLm9wdGlvbihpdGVtKTtcblxuICAgICAgJG9wdGlvbnMucHVzaCgkb3B0aW9uKTtcbiAgICB9XG5cbiAgICB0aGlzLiRyZXN1bHRzLmFwcGVuZCgkb3B0aW9ucyk7XG4gIH07XG5cbiAgUmVzdWx0cy5wcm90b3R5cGUucG9zaXRpb24gPSBmdW5jdGlvbiAoJHJlc3VsdHMsICRkcm9wZG93bikge1xuICAgIHZhciAkcmVzdWx0c0NvbnRhaW5lciA9ICRkcm9wZG93bi5maW5kKCcuc2VsZWN0Mi1yZXN1bHRzJyk7XG4gICAgJHJlc3VsdHNDb250YWluZXIuYXBwZW5kKCRyZXN1bHRzKTtcbiAgfTtcblxuICBSZXN1bHRzLnByb3RvdHlwZS5zb3J0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgc29ydGVyID0gdGhpcy5vcHRpb25zLmdldCgnc29ydGVyJyk7XG5cbiAgICByZXR1cm4gc29ydGVyKGRhdGEpO1xuICB9O1xuXG4gIFJlc3VsdHMucHJvdG90eXBlLmhpZ2hsaWdodEZpcnN0SXRlbSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJG9wdGlvbnMgPSB0aGlzLiRyZXN1bHRzXG4gICAgICAuZmluZCgnLnNlbGVjdDItcmVzdWx0c19fb3B0aW9uW2FyaWEtc2VsZWN0ZWRdJyk7XG5cbiAgICB2YXIgJHNlbGVjdGVkID0gJG9wdGlvbnMuZmlsdGVyKCdbYXJpYS1zZWxlY3RlZD10cnVlXScpO1xuXG4gICAgLy8gQ2hlY2sgaWYgdGhlcmUgYXJlIGFueSBzZWxlY3RlZCBvcHRpb25zXG4gICAgaWYgKCRzZWxlY3RlZC5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBJZiB0aGVyZSBhcmUgc2VsZWN0ZWQgb3B0aW9ucywgaGlnaGxpZ2h0IHRoZSBmaXJzdFxuICAgICAgJHNlbGVjdGVkLmZpcnN0KCkudHJpZ2dlcignbW91c2VlbnRlcicpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gc2VsZWN0ZWQgb3B0aW9ucywgaGlnaGxpZ2h0IHRoZSBmaXJzdCBvcHRpb25cbiAgICAgIC8vIGluIHRoZSBkcm9wZG93blxuICAgICAgJG9wdGlvbnMuZmlyc3QoKS50cmlnZ2VyKCdtb3VzZWVudGVyJyk7XG4gICAgfVxuXG4gICAgdGhpcy5lbnN1cmVIaWdobGlnaHRWaXNpYmxlKCk7XG4gIH07XG5cbiAgUmVzdWx0cy5wcm90b3R5cGUuc2V0Q2xhc3NlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB0aGlzLmRhdGEuY3VycmVudChmdW5jdGlvbiAoc2VsZWN0ZWQpIHtcbiAgICAgIHZhciBzZWxlY3RlZElkcyA9ICQubWFwKHNlbGVjdGVkLCBmdW5jdGlvbiAocykge1xuICAgICAgICByZXR1cm4gcy5pZC50b1N0cmluZygpO1xuICAgICAgfSk7XG5cbiAgICAgIHZhciAkb3B0aW9ucyA9IHNlbGYuJHJlc3VsdHNcbiAgICAgICAgLmZpbmQoJy5zZWxlY3QyLXJlc3VsdHNfX29wdGlvblthcmlhLXNlbGVjdGVkXScpO1xuXG4gICAgICAkb3B0aW9ucy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyICRvcHRpb24gPSAkKHRoaXMpO1xuXG4gICAgICAgIHZhciBpdGVtID0gJC5kYXRhKHRoaXMsICdkYXRhJyk7XG5cbiAgICAgICAgLy8gaWQgbmVlZHMgdG8gYmUgY29udmVydGVkIHRvIGEgc3RyaW5nIHdoZW4gY29tcGFyaW5nXG4gICAgICAgIHZhciBpZCA9ICcnICsgaXRlbS5pZDtcblxuICAgICAgICBpZiAoKGl0ZW0uZWxlbWVudCAhPSBudWxsICYmIGl0ZW0uZWxlbWVudC5zZWxlY3RlZCkgfHxcbiAgICAgICAgICAgIChpdGVtLmVsZW1lbnQgPT0gbnVsbCAmJiAkLmluQXJyYXkoaWQsIHNlbGVjdGVkSWRzKSA+IC0xKSkge1xuICAgICAgICAgICRvcHRpb24uYXR0cignYXJpYS1zZWxlY3RlZCcsICd0cnVlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJG9wdGlvbi5hdHRyKCdhcmlhLXNlbGVjdGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgfSk7XG4gIH07XG5cbiAgUmVzdWx0cy5wcm90b3R5cGUuc2hvd0xvYWRpbmcgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgdGhpcy5oaWRlTG9hZGluZygpO1xuXG4gICAgdmFyIGxvYWRpbmdNb3JlID0gdGhpcy5vcHRpb25zLmdldCgndHJhbnNsYXRpb25zJykuZ2V0KCdzZWFyY2hpbmcnKTtcblxuICAgIHZhciBsb2FkaW5nID0ge1xuICAgICAgZGlzYWJsZWQ6IHRydWUsXG4gICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgdGV4dDogbG9hZGluZ01vcmUocGFyYW1zKVxuICAgIH07XG4gICAgdmFyICRsb2FkaW5nID0gdGhpcy5vcHRpb24obG9hZGluZyk7XG4gICAgJGxvYWRpbmcuY2xhc3NOYW1lICs9ICcgbG9hZGluZy1yZXN1bHRzJztcblxuICAgIHRoaXMuJHJlc3VsdHMucHJlcGVuZCgkbG9hZGluZyk7XG4gIH07XG5cbiAgUmVzdWx0cy5wcm90b3R5cGUuaGlkZUxvYWRpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy4kcmVzdWx0cy5maW5kKCcubG9hZGluZy1yZXN1bHRzJykucmVtb3ZlKCk7XG4gIH07XG5cbiAgUmVzdWx0cy5wcm90b3R5cGUub3B0aW9uID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBvcHRpb24uY2xhc3NOYW1lID0gJ3NlbGVjdDItcmVzdWx0c19fb3B0aW9uJztcblxuICAgIHZhciBhdHRycyA9IHtcbiAgICAgICdyb2xlJzogJ3RyZWVpdGVtJyxcbiAgICAgICdhcmlhLXNlbGVjdGVkJzogJ2ZhbHNlJ1xuICAgIH07XG5cbiAgICBpZiAoZGF0YS5kaXNhYmxlZCkge1xuICAgICAgZGVsZXRlIGF0dHJzWydhcmlhLXNlbGVjdGVkJ107XG4gICAgICBhdHRyc1snYXJpYS1kaXNhYmxlZCddID0gJ3RydWUnO1xuICAgIH1cblxuICAgIGlmIChkYXRhLmlkID09IG51bGwpIHtcbiAgICAgIGRlbGV0ZSBhdHRyc1snYXJpYS1zZWxlY3RlZCddO1xuICAgIH1cblxuICAgIGlmIChkYXRhLl9yZXN1bHRJZCAhPSBudWxsKSB7XG4gICAgICBvcHRpb24uaWQgPSBkYXRhLl9yZXN1bHRJZDtcbiAgICB9XG5cbiAgICBpZiAoZGF0YS50aXRsZSkge1xuICAgICAgb3B0aW9uLnRpdGxlID0gZGF0YS50aXRsZTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YS5jaGlsZHJlbikge1xuICAgICAgYXR0cnMucm9sZSA9ICdncm91cCc7XG4gICAgICBhdHRyc1snYXJpYS1sYWJlbCddID0gZGF0YS50ZXh0O1xuICAgICAgZGVsZXRlIGF0dHJzWydhcmlhLXNlbGVjdGVkJ107XG4gICAgfVxuXG4gICAgZm9yICh2YXIgYXR0ciBpbiBhdHRycykge1xuICAgICAgdmFyIHZhbCA9IGF0dHJzW2F0dHJdO1xuXG4gICAgICBvcHRpb24uc2V0QXR0cmlidXRlKGF0dHIsIHZhbCk7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEuY2hpbGRyZW4pIHtcbiAgICAgIHZhciAkb3B0aW9uID0gJChvcHRpb24pO1xuXG4gICAgICB2YXIgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHJvbmcnKTtcbiAgICAgIGxhYmVsLmNsYXNzTmFtZSA9ICdzZWxlY3QyLXJlc3VsdHNfX2dyb3VwJztcblxuICAgICAgdmFyICRsYWJlbCA9ICQobGFiZWwpO1xuICAgICAgdGhpcy50ZW1wbGF0ZShkYXRhLCBsYWJlbCk7XG5cbiAgICAgIHZhciAkY2hpbGRyZW4gPSBbXTtcblxuICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCBkYXRhLmNoaWxkcmVuLmxlbmd0aDsgYysrKSB7XG4gICAgICAgIHZhciBjaGlsZCA9IGRhdGEuY2hpbGRyZW5bY107XG5cbiAgICAgICAgdmFyICRjaGlsZCA9IHRoaXMub3B0aW9uKGNoaWxkKTtcblxuICAgICAgICAkY2hpbGRyZW4ucHVzaCgkY2hpbGQpO1xuICAgICAgfVxuXG4gICAgICB2YXIgJGNoaWxkcmVuQ29udGFpbmVyID0gJCgnPHVsPjwvdWw+Jywge1xuICAgICAgICAnY2xhc3MnOiAnc2VsZWN0Mi1yZXN1bHRzX19vcHRpb25zIHNlbGVjdDItcmVzdWx0c19fb3B0aW9ucy0tbmVzdGVkJ1xuICAgICAgfSk7XG5cbiAgICAgICRjaGlsZHJlbkNvbnRhaW5lci5hcHBlbmQoJGNoaWxkcmVuKTtcblxuICAgICAgJG9wdGlvbi5hcHBlbmQobGFiZWwpO1xuICAgICAgJG9wdGlvbi5hcHBlbmQoJGNoaWxkcmVuQ29udGFpbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50ZW1wbGF0ZShkYXRhLCBvcHRpb24pO1xuICAgIH1cblxuICAgICQuZGF0YShvcHRpb24sICdkYXRhJywgZGF0YSk7XG5cbiAgICByZXR1cm4gb3B0aW9uO1xuICB9O1xuXG4gIFJlc3VsdHMucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoY29udGFpbmVyLCAkY29udGFpbmVyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdmFyIGlkID0gY29udGFpbmVyLmlkICsgJy1yZXN1bHRzJztcblxuICAgIHRoaXMuJHJlc3VsdHMuYXR0cignaWQnLCBpZCk7XG5cbiAgICBjb250YWluZXIub24oJ3Jlc3VsdHM6YWxsJywgZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgc2VsZi5jbGVhcigpO1xuICAgICAgc2VsZi5hcHBlbmQocGFyYW1zLmRhdGEpO1xuXG4gICAgICBpZiAoY29udGFpbmVyLmlzT3BlbigpKSB7XG4gICAgICAgIHNlbGYuc2V0Q2xhc3NlcygpO1xuICAgICAgICBzZWxmLmhpZ2hsaWdodEZpcnN0SXRlbSgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdyZXN1bHRzOmFwcGVuZCcsIGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgIHNlbGYuYXBwZW5kKHBhcmFtcy5kYXRhKTtcblxuICAgICAgaWYgKGNvbnRhaW5lci5pc09wZW4oKSkge1xuICAgICAgICBzZWxmLnNldENsYXNzZXMoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbigncXVlcnknLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICBzZWxmLmhpZGVNZXNzYWdlcygpO1xuICAgICAgc2VsZi5zaG93TG9hZGluZyhwYXJhbXMpO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdzZWxlY3QnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWNvbnRhaW5lci5pc09wZW4oKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNlbGYuc2V0Q2xhc3NlcygpO1xuICAgICAgc2VsZi5oaWdobGlnaHRGaXJzdEl0ZW0oKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbigndW5zZWxlY3QnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWNvbnRhaW5lci5pc09wZW4oKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNlbGYuc2V0Q2xhc3NlcygpO1xuICAgICAgc2VsZi5oaWdobGlnaHRGaXJzdEl0ZW0oKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbignb3BlbicsIGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIFdoZW4gdGhlIGRyb3Bkb3duIGlzIG9wZW4sIGFyaWEtZXhwZW5kZWQ9XCJ0cnVlXCJcbiAgICAgIHNlbGYuJHJlc3VsdHMuYXR0cignYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XG4gICAgICBzZWxmLiRyZXN1bHRzLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG5cbiAgICAgIHNlbGYuc2V0Q2xhc3NlcygpO1xuICAgICAgc2VsZi5lbnN1cmVIaWdobGlnaHRWaXNpYmxlKCk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ2Nsb3NlJywgZnVuY3Rpb24gKCkge1xuICAgICAgLy8gV2hlbiB0aGUgZHJvcGRvd24gaXMgY2xvc2VkLCBhcmlhLWV4cGVuZGVkPVwiZmFsc2VcIlxuICAgICAgc2VsZi4kcmVzdWx0cy5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICBzZWxmLiRyZXN1bHRzLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgIHNlbGYuJHJlc3VsdHMucmVtb3ZlQXR0cignYXJpYS1hY3RpdmVkZXNjZW5kYW50Jyk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ3Jlc3VsdHM6dG9nZ2xlJywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICRoaWdobGlnaHRlZCA9IHNlbGYuZ2V0SGlnaGxpZ2h0ZWRSZXN1bHRzKCk7XG5cbiAgICAgIGlmICgkaGlnaGxpZ2h0ZWQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgJGhpZ2hsaWdodGVkLnRyaWdnZXIoJ21vdXNldXAnKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbigncmVzdWx0czpzZWxlY3QnLCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJGhpZ2hsaWdodGVkID0gc2VsZi5nZXRIaWdobGlnaHRlZFJlc3VsdHMoKTtcblxuICAgICAgaWYgKCRoaWdobGlnaHRlZC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgZGF0YSA9ICRoaWdobGlnaHRlZC5kYXRhKCdkYXRhJyk7XG5cbiAgICAgIGlmICgkaGlnaGxpZ2h0ZWQuYXR0cignYXJpYS1zZWxlY3RlZCcpID09ICd0cnVlJykge1xuICAgICAgICBzZWxmLnRyaWdnZXIoJ2Nsb3NlJywge30pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi50cmlnZ2VyKCdzZWxlY3QnLCB7XG4gICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbigncmVzdWx0czpwcmV2aW91cycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkaGlnaGxpZ2h0ZWQgPSBzZWxmLmdldEhpZ2hsaWdodGVkUmVzdWx0cygpO1xuXG4gICAgICB2YXIgJG9wdGlvbnMgPSBzZWxmLiRyZXN1bHRzLmZpbmQoJ1thcmlhLXNlbGVjdGVkXScpO1xuXG4gICAgICB2YXIgY3VycmVudEluZGV4ID0gJG9wdGlvbnMuaW5kZXgoJGhpZ2hsaWdodGVkKTtcblxuICAgICAgLy8gSWYgd2UgYXJlIGFscmVhZHkgYXQgdGUgdG9wLCBkb24ndCBtb3ZlIGZ1cnRoZXJcbiAgICAgIGlmIChjdXJyZW50SW5kZXggPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgbmV4dEluZGV4ID0gY3VycmVudEluZGV4IC0gMTtcblxuICAgICAgLy8gSWYgbm9uZSBhcmUgaGlnaGxpZ2h0ZWQsIGhpZ2hsaWdodCB0aGUgZmlyc3RcbiAgICAgIGlmICgkaGlnaGxpZ2h0ZWQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIG5leHRJbmRleCA9IDA7XG4gICAgICB9XG5cbiAgICAgIHZhciAkbmV4dCA9ICRvcHRpb25zLmVxKG5leHRJbmRleCk7XG5cbiAgICAgICRuZXh0LnRyaWdnZXIoJ21vdXNlZW50ZXInKTtcblxuICAgICAgdmFyIGN1cnJlbnRPZmZzZXQgPSBzZWxmLiRyZXN1bHRzLm9mZnNldCgpLnRvcDtcbiAgICAgIHZhciBuZXh0VG9wID0gJG5leHQub2Zmc2V0KCkudG9wO1xuICAgICAgdmFyIG5leHRPZmZzZXQgPSBzZWxmLiRyZXN1bHRzLnNjcm9sbFRvcCgpICsgKG5leHRUb3AgLSBjdXJyZW50T2Zmc2V0KTtcblxuICAgICAgaWYgKG5leHRJbmRleCA9PT0gMCkge1xuICAgICAgICBzZWxmLiRyZXN1bHRzLnNjcm9sbFRvcCgwKTtcbiAgICAgIH0gZWxzZSBpZiAobmV4dFRvcCAtIGN1cnJlbnRPZmZzZXQgPCAwKSB7XG4gICAgICAgIHNlbGYuJHJlc3VsdHMuc2Nyb2xsVG9wKG5leHRPZmZzZXQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdyZXN1bHRzOm5leHQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJGhpZ2hsaWdodGVkID0gc2VsZi5nZXRIaWdobGlnaHRlZFJlc3VsdHMoKTtcblxuICAgICAgdmFyICRvcHRpb25zID0gc2VsZi4kcmVzdWx0cy5maW5kKCdbYXJpYS1zZWxlY3RlZF0nKTtcblxuICAgICAgdmFyIGN1cnJlbnRJbmRleCA9ICRvcHRpb25zLmluZGV4KCRoaWdobGlnaHRlZCk7XG5cbiAgICAgIHZhciBuZXh0SW5kZXggPSBjdXJyZW50SW5kZXggKyAxO1xuXG4gICAgICAvLyBJZiB3ZSBhcmUgYXQgdGhlIGxhc3Qgb3B0aW9uLCBzdGF5IHRoZXJlXG4gICAgICBpZiAobmV4dEluZGV4ID49ICRvcHRpb25zLmxlbmd0aCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciAkbmV4dCA9ICRvcHRpb25zLmVxKG5leHRJbmRleCk7XG5cbiAgICAgICRuZXh0LnRyaWdnZXIoJ21vdXNlZW50ZXInKTtcblxuICAgICAgdmFyIGN1cnJlbnRPZmZzZXQgPSBzZWxmLiRyZXN1bHRzLm9mZnNldCgpLnRvcCArXG4gICAgICAgIHNlbGYuJHJlc3VsdHMub3V0ZXJIZWlnaHQoZmFsc2UpO1xuICAgICAgdmFyIG5leHRCb3R0b20gPSAkbmV4dC5vZmZzZXQoKS50b3AgKyAkbmV4dC5vdXRlckhlaWdodChmYWxzZSk7XG4gICAgICB2YXIgbmV4dE9mZnNldCA9IHNlbGYuJHJlc3VsdHMuc2Nyb2xsVG9wKCkgKyBuZXh0Qm90dG9tIC0gY3VycmVudE9mZnNldDtcblxuICAgICAgaWYgKG5leHRJbmRleCA9PT0gMCkge1xuICAgICAgICBzZWxmLiRyZXN1bHRzLnNjcm9sbFRvcCgwKTtcbiAgICAgIH0gZWxzZSBpZiAobmV4dEJvdHRvbSA+IGN1cnJlbnRPZmZzZXQpIHtcbiAgICAgICAgc2VsZi4kcmVzdWx0cy5zY3JvbGxUb3AobmV4dE9mZnNldCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ3Jlc3VsdHM6Zm9jdXMnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICBwYXJhbXMuZWxlbWVudC5hZGRDbGFzcygnc2VsZWN0Mi1yZXN1bHRzX19vcHRpb24tLWhpZ2hsaWdodGVkJyk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ3Jlc3VsdHM6bWVzc2FnZScsIGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgIHNlbGYuZGlzcGxheU1lc3NhZ2UocGFyYW1zKTtcbiAgICB9KTtcblxuICAgIGlmICgkLmZuLm1vdXNld2hlZWwpIHtcbiAgICAgIHRoaXMuJHJlc3VsdHMub24oJ21vdXNld2hlZWwnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgdG9wID0gc2VsZi4kcmVzdWx0cy5zY3JvbGxUb3AoKTtcblxuICAgICAgICB2YXIgYm90dG9tID0gc2VsZi4kcmVzdWx0cy5nZXQoMCkuc2Nyb2xsSGVpZ2h0IC0gdG9wICsgZS5kZWx0YVk7XG5cbiAgICAgICAgdmFyIGlzQXRUb3AgPSBlLmRlbHRhWSA+IDAgJiYgdG9wIC0gZS5kZWx0YVkgPD0gMDtcbiAgICAgICAgdmFyIGlzQXRCb3R0b20gPSBlLmRlbHRhWSA8IDAgJiYgYm90dG9tIDw9IHNlbGYuJHJlc3VsdHMuaGVpZ2h0KCk7XG5cbiAgICAgICAgaWYgKGlzQXRUb3ApIHtcbiAgICAgICAgICBzZWxmLiRyZXN1bHRzLnNjcm9sbFRvcCgwKTtcblxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzQXRCb3R0b20pIHtcbiAgICAgICAgICBzZWxmLiRyZXN1bHRzLnNjcm9sbFRvcChcbiAgICAgICAgICAgIHNlbGYuJHJlc3VsdHMuZ2V0KDApLnNjcm9sbEhlaWdodCAtIHNlbGYuJHJlc3VsdHMuaGVpZ2h0KClcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuJHJlc3VsdHMub24oJ21vdXNldXAnLCAnLnNlbGVjdDItcmVzdWx0c19fb3B0aW9uW2FyaWEtc2VsZWN0ZWRdJyxcbiAgICAgIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgIHZhciBkYXRhID0gJHRoaXMuZGF0YSgnZGF0YScpO1xuXG4gICAgICBpZiAoJHRoaXMuYXR0cignYXJpYS1zZWxlY3RlZCcpID09PSAndHJ1ZScpIHtcbiAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5nZXQoJ211bHRpcGxlJykpIHtcbiAgICAgICAgICBzZWxmLnRyaWdnZXIoJ3Vuc2VsZWN0Jywge1xuICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZ0LFxuICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbGYudHJpZ2dlcignY2xvc2UnLCB7fSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNlbGYudHJpZ2dlcignc2VsZWN0Jywge1xuICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnQsXG4gICAgICAgIGRhdGE6IGRhdGFcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy4kcmVzdWx0cy5vbignbW91c2VlbnRlcicsICcuc2VsZWN0Mi1yZXN1bHRzX19vcHRpb25bYXJpYS1zZWxlY3RlZF0nLFxuICAgICAgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgdmFyIGRhdGEgPSAkKHRoaXMpLmRhdGEoJ2RhdGEnKTtcblxuICAgICAgc2VsZi5nZXRIaWdobGlnaHRlZFJlc3VsdHMoKVxuICAgICAgICAgIC5yZW1vdmVDbGFzcygnc2VsZWN0Mi1yZXN1bHRzX19vcHRpb24tLWhpZ2hsaWdodGVkJyk7XG5cbiAgICAgIHNlbGYudHJpZ2dlcigncmVzdWx0czpmb2N1cycsIHtcbiAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgZWxlbWVudDogJCh0aGlzKVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgUmVzdWx0cy5wcm90b3R5cGUuZ2V0SGlnaGxpZ2h0ZWRSZXN1bHRzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkaGlnaGxpZ2h0ZWQgPSB0aGlzLiRyZXN1bHRzXG4gICAgLmZpbmQoJy5zZWxlY3QyLXJlc3VsdHNfX29wdGlvbi0taGlnaGxpZ2h0ZWQnKTtcblxuICAgIHJldHVybiAkaGlnaGxpZ2h0ZWQ7XG4gIH07XG5cbiAgUmVzdWx0cy5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLiRyZXN1bHRzLnJlbW92ZSgpO1xuICB9O1xuXG4gIFJlc3VsdHMucHJvdG90eXBlLmVuc3VyZUhpZ2hsaWdodFZpc2libGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRoaWdobGlnaHRlZCA9IHRoaXMuZ2V0SGlnaGxpZ2h0ZWRSZXN1bHRzKCk7XG5cbiAgICBpZiAoJGhpZ2hsaWdodGVkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciAkb3B0aW9ucyA9IHRoaXMuJHJlc3VsdHMuZmluZCgnW2FyaWEtc2VsZWN0ZWRdJyk7XG5cbiAgICB2YXIgY3VycmVudEluZGV4ID0gJG9wdGlvbnMuaW5kZXgoJGhpZ2hsaWdodGVkKTtcblxuICAgIHZhciBjdXJyZW50T2Zmc2V0ID0gdGhpcy4kcmVzdWx0cy5vZmZzZXQoKS50b3A7XG4gICAgdmFyIG5leHRUb3AgPSAkaGlnaGxpZ2h0ZWQub2Zmc2V0KCkudG9wO1xuICAgIHZhciBuZXh0T2Zmc2V0ID0gdGhpcy4kcmVzdWx0cy5zY3JvbGxUb3AoKSArIChuZXh0VG9wIC0gY3VycmVudE9mZnNldCk7XG5cbiAgICB2YXIgb2Zmc2V0RGVsdGEgPSBuZXh0VG9wIC0gY3VycmVudE9mZnNldDtcbiAgICBuZXh0T2Zmc2V0IC09ICRoaWdobGlnaHRlZC5vdXRlckhlaWdodChmYWxzZSkgKiAyO1xuXG4gICAgaWYgKGN1cnJlbnRJbmRleCA8PSAyKSB7XG4gICAgICB0aGlzLiRyZXN1bHRzLnNjcm9sbFRvcCgwKTtcbiAgICB9IGVsc2UgaWYgKG9mZnNldERlbHRhID4gdGhpcy4kcmVzdWx0cy5vdXRlckhlaWdodCgpIHx8IG9mZnNldERlbHRhIDwgMCkge1xuICAgICAgdGhpcy4kcmVzdWx0cy5zY3JvbGxUb3AobmV4dE9mZnNldCk7XG4gICAgfVxuICB9O1xuXG4gIFJlc3VsdHMucHJvdG90eXBlLnRlbXBsYXRlID0gZnVuY3Rpb24gKHJlc3VsdCwgY29udGFpbmVyKSB7XG4gICAgdmFyIHRlbXBsYXRlID0gdGhpcy5vcHRpb25zLmdldCgndGVtcGxhdGVSZXN1bHQnKTtcbiAgICB2YXIgZXNjYXBlTWFya3VwID0gdGhpcy5vcHRpb25zLmdldCgnZXNjYXBlTWFya3VwJyk7XG5cbiAgICB2YXIgY29udGVudCA9IHRlbXBsYXRlKHJlc3VsdCwgY29udGFpbmVyKTtcblxuICAgIGlmIChjb250ZW50ID09IG51bGwpIHtcbiAgICAgIGNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gZXNjYXBlTWFya3VwKGNvbnRlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKGNvbnRhaW5lcikuYXBwZW5kKGNvbnRlbnQpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gUmVzdWx0cztcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIva2V5cycsW1xuXG5dLCBmdW5jdGlvbiAoKSB7XG4gIHZhciBLRVlTID0ge1xuICAgIEJBQ0tTUEFDRTogOCxcbiAgICBUQUI6IDksXG4gICAgRU5URVI6IDEzLFxuICAgIFNISUZUOiAxNixcbiAgICBDVFJMOiAxNyxcbiAgICBBTFQ6IDE4LFxuICAgIEVTQzogMjcsXG4gICAgU1BBQ0U6IDMyLFxuICAgIFBBR0VfVVA6IDMzLFxuICAgIFBBR0VfRE9XTjogMzQsXG4gICAgRU5EOiAzNSxcbiAgICBIT01FOiAzNixcbiAgICBMRUZUOiAzNyxcbiAgICBVUDogMzgsXG4gICAgUklHSFQ6IDM5LFxuICAgIERPV046IDQwLFxuICAgIERFTEVURTogNDZcbiAgfTtcblxuICByZXR1cm4gS0VZUztcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvc2VsZWN0aW9uL2Jhc2UnLFtcbiAgJ2pxdWVyeScsXG4gICcuLi91dGlscycsXG4gICcuLi9rZXlzJ1xuXSwgZnVuY3Rpb24gKCQsIFV0aWxzLCBLRVlTKSB7XG4gIGZ1bmN0aW9uIEJhc2VTZWxlY3Rpb24gKCRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy4kZWxlbWVudCA9ICRlbGVtZW50O1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICBCYXNlU2VsZWN0aW9uLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMpO1xuICB9XG5cbiAgVXRpbHMuRXh0ZW5kKEJhc2VTZWxlY3Rpb24sIFV0aWxzLk9ic2VydmFibGUpO1xuXG4gIEJhc2VTZWxlY3Rpb24ucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJHNlbGVjdGlvbiA9ICQoXG4gICAgICAnPHNwYW4gY2xhc3M9XCJzZWxlY3QyLXNlbGVjdGlvblwiIHJvbGU9XCJjb21ib2JveFwiICcgK1xuICAgICAgJyBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiPicgK1xuICAgICAgJzwvc3Bhbj4nXG4gICAgKTtcblxuICAgIHRoaXMuX3RhYmluZGV4ID0gMDtcblxuICAgIGlmICh0aGlzLiRlbGVtZW50LmRhdGEoJ29sZC10YWJpbmRleCcpICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX3RhYmluZGV4ID0gdGhpcy4kZWxlbWVudC5kYXRhKCdvbGQtdGFiaW5kZXgnKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuJGVsZW1lbnQuYXR0cigndGFiaW5kZXgnKSAhPSBudWxsKSB7XG4gICAgICB0aGlzLl90YWJpbmRleCA9IHRoaXMuJGVsZW1lbnQuYXR0cigndGFiaW5kZXgnKTtcbiAgICB9XG5cbiAgICAkc2VsZWN0aW9uLmF0dHIoJ3RpdGxlJywgdGhpcy4kZWxlbWVudC5hdHRyKCd0aXRsZScpKTtcbiAgICAkc2VsZWN0aW9uLmF0dHIoJ3RhYmluZGV4JywgdGhpcy5fdGFiaW5kZXgpO1xuXG4gICAgdGhpcy4kc2VsZWN0aW9uID0gJHNlbGVjdGlvbjtcblxuICAgIHJldHVybiAkc2VsZWN0aW9uO1xuICB9O1xuXG4gIEJhc2VTZWxlY3Rpb24ucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoY29udGFpbmVyLCAkY29udGFpbmVyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdmFyIGlkID0gY29udGFpbmVyLmlkICsgJy1jb250YWluZXInO1xuICAgIHZhciByZXN1bHRzSWQgPSBjb250YWluZXIuaWQgKyAnLXJlc3VsdHMnO1xuXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG5cbiAgICB0aGlzLiRzZWxlY3Rpb24ub24oJ2ZvY3VzJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgc2VsZi50cmlnZ2VyKCdmb2N1cycsIGV2dCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLiRzZWxlY3Rpb24ub24oJ2JsdXInLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBzZWxmLl9oYW5kbGVCbHVyKGV2dCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLiRzZWxlY3Rpb24ub24oJ2tleWRvd24nLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBzZWxmLnRyaWdnZXIoJ2tleXByZXNzJywgZXZ0KTtcblxuICAgICAgaWYgKGV2dC53aGljaCA9PT0gS0VZUy5TUEFDRSkge1xuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbigncmVzdWx0czpmb2N1cycsIGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgIHNlbGYuJHNlbGVjdGlvbi5hdHRyKCdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnLCBwYXJhbXMuZGF0YS5fcmVzdWx0SWQpO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdzZWxlY3Rpb246dXBkYXRlJywgZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgc2VsZi51cGRhdGUocGFyYW1zLmRhdGEpO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdvcGVuJywgZnVuY3Rpb24gKCkge1xuICAgICAgLy8gV2hlbiB0aGUgZHJvcGRvd24gaXMgb3BlbiwgYXJpYS1leHBhbmRlZD1cInRydWVcIlxuICAgICAgc2VsZi4kc2VsZWN0aW9uLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgICAgc2VsZi4kc2VsZWN0aW9uLmF0dHIoJ2FyaWEtb3ducycsIHJlc3VsdHNJZCk7XG5cbiAgICAgIHNlbGYuX2F0dGFjaENsb3NlSGFuZGxlcihjb250YWluZXIpO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdjbG9zZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIFdoZW4gdGhlIGRyb3Bkb3duIGlzIGNsb3NlZCwgYXJpYS1leHBhbmRlZD1cImZhbHNlXCJcbiAgICAgIHNlbGYuJHNlbGVjdGlvbi5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICBzZWxmLiRzZWxlY3Rpb24ucmVtb3ZlQXR0cignYXJpYS1hY3RpdmVkZXNjZW5kYW50Jyk7XG4gICAgICBzZWxmLiRzZWxlY3Rpb24ucmVtb3ZlQXR0cignYXJpYS1vd25zJyk7XG5cbiAgICAgIHNlbGYuJHNlbGVjdGlvbi5mb2N1cygpO1xuXG4gICAgICBzZWxmLl9kZXRhY2hDbG9zZUhhbmRsZXIoY29udGFpbmVyKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbignZW5hYmxlJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi4kc2VsZWN0aW9uLmF0dHIoJ3RhYmluZGV4Jywgc2VsZi5fdGFiaW5kZXgpO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdkaXNhYmxlJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi4kc2VsZWN0aW9uLmF0dHIoJ3RhYmluZGV4JywgJy0xJyk7XG4gICAgfSk7XG4gIH07XG5cbiAgQmFzZVNlbGVjdGlvbi5wcm90b3R5cGUuX2hhbmRsZUJsdXIgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgLy8gVGhpcyBuZWVkcyB0byBiZSBkZWxheWVkIGFzIHRoZSBhY3RpdmUgZWxlbWVudCBpcyB0aGUgYm9keSB3aGVuIHRoZSB0YWJcbiAgICAvLyBrZXkgaXMgcHJlc3NlZCwgcG9zc2libHkgYWxvbmcgd2l0aCBvdGhlcnMuXG4gICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgLy8gRG9uJ3QgdHJpZ2dlciBgYmx1cmAgaWYgdGhlIGZvY3VzIGlzIHN0aWxsIGluIHRoZSBzZWxlY3Rpb25cbiAgICAgIGlmIChcbiAgICAgICAgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT0gc2VsZi4kc2VsZWN0aW9uWzBdKSB8fFxuICAgICAgICAoJC5jb250YWlucyhzZWxmLiRzZWxlY3Rpb25bMF0sIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2VsZi50cmlnZ2VyKCdibHVyJywgZXZ0KTtcbiAgICB9LCAxKTtcbiAgfTtcblxuICBCYXNlU2VsZWN0aW9uLnByb3RvdHlwZS5fYXR0YWNoQ2xvc2VIYW5kbGVyID0gZnVuY3Rpb24gKGNvbnRhaW5lcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICQoZG9jdW1lbnQuYm9keSkub24oJ21vdXNlZG93bi5zZWxlY3QyLicgKyBjb250YWluZXIuaWQsIGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgJHRhcmdldCA9ICQoZS50YXJnZXQpO1xuXG4gICAgICB2YXIgJHNlbGVjdCA9ICR0YXJnZXQuY2xvc2VzdCgnLnNlbGVjdDInKTtcblxuICAgICAgdmFyICRhbGwgPSAkKCcuc2VsZWN0Mi5zZWxlY3QyLWNvbnRhaW5lci0tb3BlbicpO1xuXG4gICAgICAkYWxsLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXG4gICAgICAgIGlmICh0aGlzID09ICRzZWxlY3RbMF0pIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgJGVsZW1lbnQgPSAkdGhpcy5kYXRhKCdlbGVtZW50Jyk7XG5cbiAgICAgICAgJGVsZW1lbnQuc2VsZWN0MignY2xvc2UnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIEJhc2VTZWxlY3Rpb24ucHJvdG90eXBlLl9kZXRhY2hDbG9zZUhhbmRsZXIgPSBmdW5jdGlvbiAoY29udGFpbmVyKSB7XG4gICAgJChkb2N1bWVudC5ib2R5KS5vZmYoJ21vdXNlZG93bi5zZWxlY3QyLicgKyBjb250YWluZXIuaWQpO1xuICB9O1xuXG4gIEJhc2VTZWxlY3Rpb24ucHJvdG90eXBlLnBvc2l0aW9uID0gZnVuY3Rpb24gKCRzZWxlY3Rpb24sICRjb250YWluZXIpIHtcbiAgICB2YXIgJHNlbGVjdGlvbkNvbnRhaW5lciA9ICRjb250YWluZXIuZmluZCgnLnNlbGVjdGlvbicpO1xuICAgICRzZWxlY3Rpb25Db250YWluZXIuYXBwZW5kKCRzZWxlY3Rpb24pO1xuICB9O1xuXG4gIEJhc2VTZWxlY3Rpb24ucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fZGV0YWNoQ2xvc2VIYW5kbGVyKHRoaXMuY29udGFpbmVyKTtcbiAgfTtcblxuICBCYXNlU2VsZWN0aW9uLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlIGB1cGRhdGVgIG1ldGhvZCBtdXN0IGJlIGRlZmluZWQgaW4gY2hpbGQgY2xhc3Nlcy4nKTtcbiAgfTtcblxuICByZXR1cm4gQmFzZVNlbGVjdGlvbjtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvc2VsZWN0aW9uL3NpbmdsZScsW1xuICAnanF1ZXJ5JyxcbiAgJy4vYmFzZScsXG4gICcuLi91dGlscycsXG4gICcuLi9rZXlzJ1xuXSwgZnVuY3Rpb24gKCQsIEJhc2VTZWxlY3Rpb24sIFV0aWxzLCBLRVlTKSB7XG4gIGZ1bmN0aW9uIFNpbmdsZVNlbGVjdGlvbiAoKSB7XG4gICAgU2luZ2xlU2VsZWN0aW9uLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgVXRpbHMuRXh0ZW5kKFNpbmdsZVNlbGVjdGlvbiwgQmFzZVNlbGVjdGlvbik7XG5cbiAgU2luZ2xlU2VsZWN0aW9uLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRzZWxlY3Rpb24gPSBTaW5nbGVTZWxlY3Rpb24uX19zdXBlcl9fLnJlbmRlci5jYWxsKHRoaXMpO1xuXG4gICAgJHNlbGVjdGlvbi5hZGRDbGFzcygnc2VsZWN0Mi1zZWxlY3Rpb24tLXNpbmdsZScpO1xuXG4gICAgJHNlbGVjdGlvbi5odG1sKFxuICAgICAgJzxzcGFuIGNsYXNzPVwic2VsZWN0Mi1zZWxlY3Rpb25fX3JlbmRlcmVkXCI+PC9zcGFuPicgK1xuICAgICAgJzxzcGFuIGNsYXNzPVwic2VsZWN0Mi1zZWxlY3Rpb25fX2Fycm93XCIgcm9sZT1cInByZXNlbnRhdGlvblwiPicgK1xuICAgICAgICAnPGIgcm9sZT1cInByZXNlbnRhdGlvblwiPjwvYj4nICtcbiAgICAgICc8L3NwYW4+J1xuICAgICk7XG5cbiAgICByZXR1cm4gJHNlbGVjdGlvbjtcbiAgfTtcblxuICBTaW5nbGVTZWxlY3Rpb24ucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoY29udGFpbmVyLCAkY29udGFpbmVyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgU2luZ2xlU2VsZWN0aW9uLl9fc3VwZXJfXy5iaW5kLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICB2YXIgaWQgPSBjb250YWluZXIuaWQgKyAnLWNvbnRhaW5lcic7XG5cbiAgICB0aGlzLiRzZWxlY3Rpb24uZmluZCgnLnNlbGVjdDItc2VsZWN0aW9uX19yZW5kZXJlZCcpLmF0dHIoJ2lkJywgaWQpO1xuICAgIHRoaXMuJHNlbGVjdGlvbi5hdHRyKCdhcmlhLWxhYmVsbGVkYnknLCBpZCk7XG5cbiAgICB0aGlzLiRzZWxlY3Rpb24ub24oJ21vdXNlZG93bicsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIC8vIE9ubHkgcmVzcG9uZCB0byBsZWZ0IGNsaWNrc1xuICAgICAgaWYgKGV2dC53aGljaCAhPT0gMSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNlbGYudHJpZ2dlcigndG9nZ2xlJywge1xuICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnRcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy4kc2VsZWN0aW9uLm9uKCdmb2N1cycsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIC8vIFVzZXIgZm9jdXNlcyBvbiB0aGUgY29udGFpbmVyXG4gICAgfSk7XG5cbiAgICB0aGlzLiRzZWxlY3Rpb24ub24oJ2JsdXInLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAvLyBVc2VyIGV4aXRzIHRoZSBjb250YWluZXJcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbignZm9jdXMnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICBpZiAoIWNvbnRhaW5lci5pc09wZW4oKSkge1xuICAgICAgICBzZWxmLiRzZWxlY3Rpb24uZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbignc2VsZWN0aW9uOnVwZGF0ZScsIGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgIHNlbGYudXBkYXRlKHBhcmFtcy5kYXRhKTtcbiAgICB9KTtcbiAgfTtcblxuICBTaW5nbGVTZWxlY3Rpb24ucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJHNlbGVjdGlvbi5maW5kKCcuc2VsZWN0Mi1zZWxlY3Rpb25fX3JlbmRlcmVkJykuZW1wdHkoKTtcbiAgfTtcblxuICBTaW5nbGVTZWxlY3Rpb24ucHJvdG90eXBlLmRpc3BsYXkgPSBmdW5jdGlvbiAoZGF0YSwgY29udGFpbmVyKSB7XG4gICAgdmFyIHRlbXBsYXRlID0gdGhpcy5vcHRpb25zLmdldCgndGVtcGxhdGVTZWxlY3Rpb24nKTtcbiAgICB2YXIgZXNjYXBlTWFya3VwID0gdGhpcy5vcHRpb25zLmdldCgnZXNjYXBlTWFya3VwJyk7XG5cbiAgICByZXR1cm4gZXNjYXBlTWFya3VwKHRlbXBsYXRlKGRhdGEsIGNvbnRhaW5lcikpO1xuICB9O1xuXG4gIFNpbmdsZVNlbGVjdGlvbi5wcm90b3R5cGUuc2VsZWN0aW9uQ29udGFpbmVyID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAkKCc8c3Bhbj48L3NwYW4+Jyk7XG4gIH07XG5cbiAgU2luZ2xlU2VsZWN0aW9uLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBzZWxlY3Rpb24gPSBkYXRhWzBdO1xuXG4gICAgdmFyICRyZW5kZXJlZCA9IHRoaXMuJHNlbGVjdGlvbi5maW5kKCcuc2VsZWN0Mi1zZWxlY3Rpb25fX3JlbmRlcmVkJyk7XG4gICAgdmFyIGZvcm1hdHRlZCA9IHRoaXMuZGlzcGxheShzZWxlY3Rpb24sICRyZW5kZXJlZCk7XG5cbiAgICAkcmVuZGVyZWQuZW1wdHkoKS5hcHBlbmQoZm9ybWF0dGVkKTtcbiAgICAkcmVuZGVyZWQucHJvcCgndGl0bGUnLCBzZWxlY3Rpb24udGl0bGUgfHwgc2VsZWN0aW9uLnRleHQpO1xuICB9O1xuXG4gIHJldHVybiBTaW5nbGVTZWxlY3Rpb247XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL3NlbGVjdGlvbi9tdWx0aXBsZScsW1xuICAnanF1ZXJ5JyxcbiAgJy4vYmFzZScsXG4gICcuLi91dGlscydcbl0sIGZ1bmN0aW9uICgkLCBCYXNlU2VsZWN0aW9uLCBVdGlscykge1xuICBmdW5jdGlvbiBNdWx0aXBsZVNlbGVjdGlvbiAoJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICBNdWx0aXBsZVNlbGVjdGlvbi5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIFV0aWxzLkV4dGVuZChNdWx0aXBsZVNlbGVjdGlvbiwgQmFzZVNlbGVjdGlvbik7XG5cbiAgTXVsdGlwbGVTZWxlY3Rpb24ucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJHNlbGVjdGlvbiA9IE11bHRpcGxlU2VsZWN0aW9uLl9fc3VwZXJfXy5yZW5kZXIuY2FsbCh0aGlzKTtcblxuICAgICRzZWxlY3Rpb24uYWRkQ2xhc3MoJ3NlbGVjdDItc2VsZWN0aW9uLS1tdWx0aXBsZScpO1xuXG4gICAgJHNlbGVjdGlvbi5odG1sKFxuICAgICAgJzx1bCBjbGFzcz1cInNlbGVjdDItc2VsZWN0aW9uX19yZW5kZXJlZFwiPjwvdWw+J1xuICAgICk7XG5cbiAgICByZXR1cm4gJHNlbGVjdGlvbjtcbiAgfTtcblxuICBNdWx0aXBsZVNlbGVjdGlvbi5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChjb250YWluZXIsICRjb250YWluZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBNdWx0aXBsZVNlbGVjdGlvbi5fX3N1cGVyX18uYmluZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgdGhpcy4kc2VsZWN0aW9uLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIHNlbGYudHJpZ2dlcigndG9nZ2xlJywge1xuICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnRcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy4kc2VsZWN0aW9uLm9uKFxuICAgICAgJ2NsaWNrJyxcbiAgICAgICcuc2VsZWN0Mi1zZWxlY3Rpb25fX2Nob2ljZV9fcmVtb3ZlJyxcbiAgICAgIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBldmVudCBpZiBpdCBpcyBkaXNhYmxlZFxuICAgICAgICBpZiAoc2VsZi5vcHRpb25zLmdldCgnZGlzYWJsZWQnKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciAkcmVtb3ZlID0gJCh0aGlzKTtcbiAgICAgICAgdmFyICRzZWxlY3Rpb24gPSAkcmVtb3ZlLnBhcmVudCgpO1xuXG4gICAgICAgIHZhciBkYXRhID0gJHNlbGVjdGlvbi5kYXRhKCdkYXRhJyk7XG5cbiAgICAgICAgc2VsZi50cmlnZ2VyKCd1bnNlbGVjdCcsIHtcbiAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnQsXG4gICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICApO1xuICB9O1xuXG4gIE11bHRpcGxlU2VsZWN0aW9uLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLiRzZWxlY3Rpb24uZmluZCgnLnNlbGVjdDItc2VsZWN0aW9uX19yZW5kZXJlZCcpLmVtcHR5KCk7XG4gIH07XG5cbiAgTXVsdGlwbGVTZWxlY3Rpb24ucHJvdG90eXBlLmRpc3BsYXkgPSBmdW5jdGlvbiAoZGF0YSwgY29udGFpbmVyKSB7XG4gICAgdmFyIHRlbXBsYXRlID0gdGhpcy5vcHRpb25zLmdldCgndGVtcGxhdGVTZWxlY3Rpb24nKTtcbiAgICB2YXIgZXNjYXBlTWFya3VwID0gdGhpcy5vcHRpb25zLmdldCgnZXNjYXBlTWFya3VwJyk7XG5cbiAgICByZXR1cm4gZXNjYXBlTWFya3VwKHRlbXBsYXRlKGRhdGEsIGNvbnRhaW5lcikpO1xuICB9O1xuXG4gIE11bHRpcGxlU2VsZWN0aW9uLnByb3RvdHlwZS5zZWxlY3Rpb25Db250YWluZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRjb250YWluZXIgPSAkKFxuICAgICAgJzxsaSBjbGFzcz1cInNlbGVjdDItc2VsZWN0aW9uX19jaG9pY2VcIj4nICtcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwic2VsZWN0Mi1zZWxlY3Rpb25fX2Nob2ljZV9fcmVtb3ZlXCIgcm9sZT1cInByZXNlbnRhdGlvblwiPicgK1xuICAgICAgICAgICcmdGltZXM7JyArXG4gICAgICAgICc8L3NwYW4+JyArXG4gICAgICAnPC9saT4nXG4gICAgKTtcblxuICAgIHJldHVybiAkY29udGFpbmVyO1xuICB9O1xuXG4gIE11bHRpcGxlU2VsZWN0aW9uLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMuY2xlYXIoKTtcblxuICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciAkc2VsZWN0aW9ucyA9IFtdO1xuXG4gICAgZm9yICh2YXIgZCA9IDA7IGQgPCBkYXRhLmxlbmd0aDsgZCsrKSB7XG4gICAgICB2YXIgc2VsZWN0aW9uID0gZGF0YVtkXTtcblxuICAgICAgdmFyICRzZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvbkNvbnRhaW5lcigpO1xuICAgICAgdmFyIGZvcm1hdHRlZCA9IHRoaXMuZGlzcGxheShzZWxlY3Rpb24sICRzZWxlY3Rpb24pO1xuXG4gICAgICAkc2VsZWN0aW9uLmFwcGVuZChmb3JtYXR0ZWQpO1xuICAgICAgJHNlbGVjdGlvbi5wcm9wKCd0aXRsZScsIHNlbGVjdGlvbi50aXRsZSB8fCBzZWxlY3Rpb24udGV4dCk7XG5cbiAgICAgICRzZWxlY3Rpb24uZGF0YSgnZGF0YScsIHNlbGVjdGlvbik7XG5cbiAgICAgICRzZWxlY3Rpb25zLnB1c2goJHNlbGVjdGlvbik7XG4gICAgfVxuXG4gICAgdmFyICRyZW5kZXJlZCA9IHRoaXMuJHNlbGVjdGlvbi5maW5kKCcuc2VsZWN0Mi1zZWxlY3Rpb25fX3JlbmRlcmVkJyk7XG5cbiAgICBVdGlscy5hcHBlbmRNYW55KCRyZW5kZXJlZCwgJHNlbGVjdGlvbnMpO1xuICB9O1xuXG4gIHJldHVybiBNdWx0aXBsZVNlbGVjdGlvbjtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvc2VsZWN0aW9uL3BsYWNlaG9sZGVyJyxbXG4gICcuLi91dGlscydcbl0sIGZ1bmN0aW9uIChVdGlscykge1xuICBmdW5jdGlvbiBQbGFjZWhvbGRlciAoZGVjb3JhdGVkLCAkZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMucGxhY2Vob2xkZXIgPSB0aGlzLm5vcm1hbGl6ZVBsYWNlaG9sZGVyKG9wdGlvbnMuZ2V0KCdwbGFjZWhvbGRlcicpKTtcblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsICRlbGVtZW50LCBvcHRpb25zKTtcbiAgfVxuXG4gIFBsYWNlaG9sZGVyLnByb3RvdHlwZS5ub3JtYWxpemVQbGFjZWhvbGRlciA9IGZ1bmN0aW9uIChfLCBwbGFjZWhvbGRlcikge1xuICAgIGlmICh0eXBlb2YgcGxhY2Vob2xkZXIgPT09ICdzdHJpbmcnKSB7XG4gICAgICBwbGFjZWhvbGRlciA9IHtcbiAgICAgICAgaWQ6ICcnLFxuICAgICAgICB0ZXh0OiBwbGFjZWhvbGRlclxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGxhY2Vob2xkZXI7XG4gIH07XG5cbiAgUGxhY2Vob2xkZXIucHJvdG90eXBlLmNyZWF0ZVBsYWNlaG9sZGVyID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgcGxhY2Vob2xkZXIpIHtcbiAgICB2YXIgJHBsYWNlaG9sZGVyID0gdGhpcy5zZWxlY3Rpb25Db250YWluZXIoKTtcblxuICAgICRwbGFjZWhvbGRlci5odG1sKHRoaXMuZGlzcGxheShwbGFjZWhvbGRlcikpO1xuICAgICRwbGFjZWhvbGRlci5hZGRDbGFzcygnc2VsZWN0Mi1zZWxlY3Rpb25fX3BsYWNlaG9sZGVyJylcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NlbGVjdDItc2VsZWN0aW9uX19jaG9pY2UnKTtcblxuICAgIHJldHVybiAkcGxhY2Vob2xkZXI7XG4gIH07XG5cbiAgUGxhY2Vob2xkZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGRhdGEpIHtcbiAgICB2YXIgc2luZ2xlUGxhY2Vob2xkZXIgPSAoXG4gICAgICBkYXRhLmxlbmd0aCA9PSAxICYmIGRhdGFbMF0uaWQgIT0gdGhpcy5wbGFjZWhvbGRlci5pZFxuICAgICk7XG4gICAgdmFyIG11bHRpcGxlU2VsZWN0aW9ucyA9IGRhdGEubGVuZ3RoID4gMTtcblxuICAgIGlmIChtdWx0aXBsZVNlbGVjdGlvbnMgfHwgc2luZ2xlUGxhY2Vob2xkZXIpIHtcbiAgICAgIHJldHVybiBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBkYXRhKTtcbiAgICB9XG5cbiAgICB0aGlzLmNsZWFyKCk7XG5cbiAgICB2YXIgJHBsYWNlaG9sZGVyID0gdGhpcy5jcmVhdGVQbGFjZWhvbGRlcih0aGlzLnBsYWNlaG9sZGVyKTtcblxuICAgIHRoaXMuJHNlbGVjdGlvbi5maW5kKCcuc2VsZWN0Mi1zZWxlY3Rpb25fX3JlbmRlcmVkJykuYXBwZW5kKCRwbGFjZWhvbGRlcik7XG4gIH07XG5cbiAgcmV0dXJuIFBsYWNlaG9sZGVyO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9zZWxlY3Rpb24vYWxsb3dDbGVhcicsW1xuICAnanF1ZXJ5JyxcbiAgJy4uL2tleXMnXG5dLCBmdW5jdGlvbiAoJCwgS0VZUykge1xuICBmdW5jdGlvbiBBbGxvd0NsZWFyICgpIHsgfVxuXG4gIEFsbG93Q2xlYXIucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBjb250YWluZXIsICRjb250YWluZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBjb250YWluZXIsICRjb250YWluZXIpO1xuXG4gICAgaWYgKHRoaXMucGxhY2Vob2xkZXIgPT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5nZXQoJ2RlYnVnJykgJiYgd2luZG93LmNvbnNvbGUgJiYgY29uc29sZS5lcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICdTZWxlY3QyOiBUaGUgYGFsbG93Q2xlYXJgIG9wdGlvbiBzaG91bGQgYmUgdXNlZCBpbiBjb21iaW5hdGlvbiAnICtcbiAgICAgICAgICAnd2l0aCB0aGUgYHBsYWNlaG9sZGVyYCBvcHRpb24uJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbignbW91c2Vkb3duJywgJy5zZWxlY3QyLXNlbGVjdGlvbl9fY2xlYXInLFxuICAgICAgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICBzZWxmLl9oYW5kbGVDbGVhcihldnQpO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdrZXlwcmVzcycsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIHNlbGYuX2hhbmRsZUtleWJvYXJkQ2xlYXIoZXZ0LCBjb250YWluZXIpO1xuICAgIH0pO1xuICB9O1xuXG4gIEFsbG93Q2xlYXIucHJvdG90eXBlLl9oYW5kbGVDbGVhciA9IGZ1bmN0aW9uIChfLCBldnQpIHtcbiAgICAvLyBJZ25vcmUgdGhlIGV2ZW50IGlmIGl0IGlzIGRpc2FibGVkXG4gICAgaWYgKHRoaXMub3B0aW9ucy5nZXQoJ2Rpc2FibGVkJykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgJGNsZWFyID0gdGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fY2xlYXInKTtcblxuICAgIC8vIElnbm9yZSB0aGUgZXZlbnQgaWYgbm90aGluZyBoYXMgYmVlbiBzZWxlY3RlZFxuICAgIGlmICgkY2xlYXIubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgdmFyIGRhdGEgPSAkY2xlYXIuZGF0YSgnZGF0YScpO1xuXG4gICAgZm9yICh2YXIgZCA9IDA7IGQgPCBkYXRhLmxlbmd0aDsgZCsrKSB7XG4gICAgICB2YXIgdW5zZWxlY3REYXRhID0ge1xuICAgICAgICBkYXRhOiBkYXRhW2RdXG4gICAgICB9O1xuXG4gICAgICAvLyBUcmlnZ2VyIHRoZSBgdW5zZWxlY3RgIGV2ZW50LCBzbyBwZW9wbGUgY2FuIHByZXZlbnQgaXQgZnJvbSBiZWluZ1xuICAgICAgLy8gY2xlYXJlZC5cbiAgICAgIHRoaXMudHJpZ2dlcigndW5zZWxlY3QnLCB1bnNlbGVjdERhdGEpO1xuXG4gICAgICAvLyBJZiB0aGUgZXZlbnQgd2FzIHByZXZlbnRlZCwgZG9uJ3QgY2xlYXIgaXQgb3V0LlxuICAgICAgaWYgKHVuc2VsZWN0RGF0YS5wcmV2ZW50ZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuJGVsZW1lbnQudmFsKHRoaXMucGxhY2Vob2xkZXIuaWQpLnRyaWdnZXIoJ2NoYW5nZScpO1xuXG4gICAgdGhpcy50cmlnZ2VyKCd0b2dnbGUnLCB7fSk7XG4gIH07XG5cbiAgQWxsb3dDbGVhci5wcm90b3R5cGUuX2hhbmRsZUtleWJvYXJkQ2xlYXIgPSBmdW5jdGlvbiAoXywgZXZ0LCBjb250YWluZXIpIHtcbiAgICBpZiAoY29udGFpbmVyLmlzT3BlbigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGV2dC53aGljaCA9PSBLRVlTLkRFTEVURSB8fCBldnQud2hpY2ggPT0gS0VZUy5CQUNLU1BBQ0UpIHtcbiAgICAgIHRoaXMuX2hhbmRsZUNsZWFyKGV2dCk7XG4gICAgfVxuICB9O1xuXG4gIEFsbG93Q2xlYXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGRhdGEpIHtcbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBkYXRhKTtcblxuICAgIGlmICh0aGlzLiRzZWxlY3Rpb24uZmluZCgnLnNlbGVjdDItc2VsZWN0aW9uX19wbGFjZWhvbGRlcicpLmxlbmd0aCA+IDAgfHxcbiAgICAgICAgZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgJHJlbW92ZSA9ICQoXG4gICAgICAnPHNwYW4gY2xhc3M9XCJzZWxlY3QyLXNlbGVjdGlvbl9fY2xlYXJcIj4nICtcbiAgICAgICAgJyZ0aW1lczsnICtcbiAgICAgICc8L3NwYW4+J1xuICAgICk7XG4gICAgJHJlbW92ZS5kYXRhKCdkYXRhJywgZGF0YSk7XG5cbiAgICB0aGlzLiRzZWxlY3Rpb24uZmluZCgnLnNlbGVjdDItc2VsZWN0aW9uX19yZW5kZXJlZCcpLnByZXBlbmQoJHJlbW92ZSk7XG4gIH07XG5cbiAgcmV0dXJuIEFsbG93Q2xlYXI7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL3NlbGVjdGlvbi9zZWFyY2gnLFtcbiAgJ2pxdWVyeScsXG4gICcuLi91dGlscycsXG4gICcuLi9rZXlzJ1xuXSwgZnVuY3Rpb24gKCQsIFV0aWxzLCBLRVlTKSB7XG4gIGZ1bmN0aW9uIFNlYXJjaCAoZGVjb3JhdGVkLCAkZWxlbWVudCwgb3B0aW9ucykge1xuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsICRlbGVtZW50LCBvcHRpb25zKTtcbiAgfVxuXG4gIFNlYXJjaC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKGRlY29yYXRlZCkge1xuICAgIHZhciAkc2VhcmNoID0gJChcbiAgICAgICc8bGkgY2xhc3M9XCJzZWxlY3QyLXNlYXJjaCBzZWxlY3QyLXNlYXJjaC0taW5saW5lXCI+JyArXG4gICAgICAgICc8aW5wdXQgY2xhc3M9XCJzZWxlY3QyLXNlYXJjaF9fZmllbGRcIiB0eXBlPVwic2VhcmNoXCIgdGFiaW5kZXg9XCItMVwiJyArXG4gICAgICAgICcgYXV0b2NvbXBsZXRlPVwib2ZmXCIgYXV0b2NvcnJlY3Q9XCJvZmZcIiBhdXRvY2FwaXRhbGl6ZT1cIm9mZlwiJyArXG4gICAgICAgICcgc3BlbGxjaGVjaz1cImZhbHNlXCIgcm9sZT1cInRleHRib3hcIiBhcmlhLWF1dG9jb21wbGV0ZT1cImxpc3RcIiAvPicgK1xuICAgICAgJzwvbGk+J1xuICAgICk7XG5cbiAgICB0aGlzLiRzZWFyY2hDb250YWluZXIgPSAkc2VhcmNoO1xuICAgIHRoaXMuJHNlYXJjaCA9ICRzZWFyY2guZmluZCgnaW5wdXQnKTtcblxuICAgIHZhciAkcmVuZGVyZWQgPSBkZWNvcmF0ZWQuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMuX3RyYW5zZmVyVGFiSW5kZXgoKTtcblxuICAgIHJldHVybiAkcmVuZGVyZWQ7XG4gIH07XG5cbiAgU2VhcmNoLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgY29udGFpbmVyLCAkY29udGFpbmVyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgY29udGFpbmVyLCAkY29udGFpbmVyKTtcblxuICAgIGNvbnRhaW5lci5vbignb3BlbicsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuJHNlYXJjaC50cmlnZ2VyKCdmb2N1cycpO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdjbG9zZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuJHNlYXJjaC52YWwoJycpO1xuICAgICAgc2VsZi4kc2VhcmNoLnJlbW92ZUF0dHIoJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCcpO1xuICAgICAgc2VsZi4kc2VhcmNoLnRyaWdnZXIoJ2ZvY3VzJyk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ2VuYWJsZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuJHNlYXJjaC5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcblxuICAgICAgc2VsZi5fdHJhbnNmZXJUYWJJbmRleCgpO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdkaXNhYmxlJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi4kc2VhcmNoLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ2ZvY3VzJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgc2VsZi4kc2VhcmNoLnRyaWdnZXIoJ2ZvY3VzJyk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ3Jlc3VsdHM6Zm9jdXMnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICBzZWxmLiRzZWFyY2guYXR0cignYXJpYS1hY3RpdmVkZXNjZW5kYW50JywgcGFyYW1zLmlkKTtcbiAgICB9KTtcblxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbignZm9jdXNpbicsICcuc2VsZWN0Mi1zZWFyY2gtLWlubGluZScsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIHNlbGYudHJpZ2dlcignZm9jdXMnLCBldnQpO1xuICAgIH0pO1xuXG4gICAgdGhpcy4kc2VsZWN0aW9uLm9uKCdmb2N1c291dCcsICcuc2VsZWN0Mi1zZWFyY2gtLWlubGluZScsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIHNlbGYuX2hhbmRsZUJsdXIoZXZ0KTtcbiAgICB9KTtcblxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbigna2V5ZG93bicsICcuc2VsZWN0Mi1zZWFyY2gtLWlubGluZScsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgc2VsZi50cmlnZ2VyKCdrZXlwcmVzcycsIGV2dCk7XG5cbiAgICAgIHNlbGYuX2tleVVwUHJldmVudGVkID0gZXZ0LmlzRGVmYXVsdFByZXZlbnRlZCgpO1xuXG4gICAgICB2YXIga2V5ID0gZXZ0LndoaWNoO1xuXG4gICAgICBpZiAoa2V5ID09PSBLRVlTLkJBQ0tTUEFDRSAmJiBzZWxmLiRzZWFyY2gudmFsKCkgPT09ICcnKSB7XG4gICAgICAgIHZhciAkcHJldmlvdXNDaG9pY2UgPSBzZWxmLiRzZWFyY2hDb250YWluZXJcbiAgICAgICAgICAucHJldignLnNlbGVjdDItc2VsZWN0aW9uX19jaG9pY2UnKTtcblxuICAgICAgICBpZiAoJHByZXZpb3VzQ2hvaWNlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB2YXIgaXRlbSA9ICRwcmV2aW91c0Nob2ljZS5kYXRhKCdkYXRhJyk7XG5cbiAgICAgICAgICBzZWxmLnNlYXJjaFJlbW92ZUNob2ljZShpdGVtKTtcblxuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBUcnkgdG8gZGV0ZWN0IHRoZSBJRSB2ZXJzaW9uIHNob3VsZCB0aGUgYGRvY3VtZW50TW9kZWAgcHJvcGVydHkgdGhhdFxuICAgIC8vIGlzIHN0b3JlZCBvbiB0aGUgZG9jdW1lbnQuIFRoaXMgaXMgb25seSBpbXBsZW1lbnRlZCBpbiBJRSBhbmQgaXNcbiAgICAvLyBzbGlnaHRseSBjbGVhbmVyIHRoYW4gZG9pbmcgYSB1c2VyIGFnZW50IGNoZWNrLlxuICAgIC8vIFRoaXMgcHJvcGVydHkgaXMgbm90IGF2YWlsYWJsZSBpbiBFZGdlLCBidXQgRWRnZSBhbHNvIGRvZXNuJ3QgaGF2ZVxuICAgIC8vIHRoaXMgYnVnLlxuICAgIHZhciBtc2llID0gZG9jdW1lbnQuZG9jdW1lbnRNb2RlO1xuICAgIHZhciBkaXNhYmxlSW5wdXRFdmVudHMgPSBtc2llICYmIG1zaWUgPD0gMTE7XG5cbiAgICAvLyBXb3JrYXJvdW5kIGZvciBicm93c2VycyB3aGljaCBkbyBub3Qgc3VwcG9ydCB0aGUgYGlucHV0YCBldmVudFxuICAgIC8vIFRoaXMgd2lsbCBwcmV2ZW50IGRvdWJsZS10cmlnZ2VyaW5nIG9mIGV2ZW50cyBmb3IgYnJvd3NlcnMgd2hpY2ggc3VwcG9ydFxuICAgIC8vIGJvdGggdGhlIGBrZXl1cGAgYW5kIGBpbnB1dGAgZXZlbnRzLlxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbihcbiAgICAgICdpbnB1dC5zZWFyY2hjaGVjaycsXG4gICAgICAnLnNlbGVjdDItc2VhcmNoLS1pbmxpbmUnLFxuICAgICAgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAvLyBJRSB3aWxsIHRyaWdnZXIgdGhlIGBpbnB1dGAgZXZlbnQgd2hlbiBhIHBsYWNlaG9sZGVyIGlzIHVzZWQgb24gYVxuICAgICAgICAvLyBzZWFyY2ggYm94LiBUbyBnZXQgYXJvdW5kIHRoaXMgaXNzdWUsIHdlIGFyZSBmb3JjZWQgdG8gaWdub3JlIGFsbFxuICAgICAgICAvLyBgaW5wdXRgIGV2ZW50cyBpbiBJRSBhbmQga2VlcCB1c2luZyBga2V5dXBgLlxuICAgICAgICBpZiAoZGlzYWJsZUlucHV0RXZlbnRzKSB7XG4gICAgICAgICAgc2VsZi4kc2VsZWN0aW9uLm9mZignaW5wdXQuc2VhcmNoIGlucHV0LnNlYXJjaGNoZWNrJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVW5iaW5kIHRoZSBkdXBsaWNhdGVkIGBrZXl1cGAgZXZlbnRcbiAgICAgICAgc2VsZi4kc2VsZWN0aW9uLm9mZigna2V5dXAuc2VhcmNoJyk7XG4gICAgICB9XG4gICAgKTtcblxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbihcbiAgICAgICdrZXl1cC5zZWFyY2ggaW5wdXQuc2VhcmNoJyxcbiAgICAgICcuc2VsZWN0Mi1zZWFyY2gtLWlubGluZScsXG4gICAgICBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgIC8vIElFIHdpbGwgdHJpZ2dlciB0aGUgYGlucHV0YCBldmVudCB3aGVuIGEgcGxhY2Vob2xkZXIgaXMgdXNlZCBvbiBhXG4gICAgICAgIC8vIHNlYXJjaCBib3guIFRvIGdldCBhcm91bmQgdGhpcyBpc3N1ZSwgd2UgYXJlIGZvcmNlZCB0byBpZ25vcmUgYWxsXG4gICAgICAgIC8vIGBpbnB1dGAgZXZlbnRzIGluIElFIGFuZCBrZWVwIHVzaW5nIGBrZXl1cGAuXG4gICAgICAgIGlmIChkaXNhYmxlSW5wdXRFdmVudHMgJiYgZXZ0LnR5cGUgPT09ICdpbnB1dCcpIHtcbiAgICAgICAgICBzZWxmLiRzZWxlY3Rpb24ub2ZmKCdpbnB1dC5zZWFyY2ggaW5wdXQuc2VhcmNoY2hlY2snKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIga2V5ID0gZXZ0LndoaWNoO1xuXG4gICAgICAgIC8vIFdlIGNhbiBmcmVlbHkgaWdub3JlIGV2ZW50cyBmcm9tIG1vZGlmaWVyIGtleXNcbiAgICAgICAgaWYgKGtleSA9PSBLRVlTLlNISUZUIHx8IGtleSA9PSBLRVlTLkNUUkwgfHwga2V5ID09IEtFWVMuQUxUKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGFiYmluZyB3aWxsIGJlIGhhbmRsZWQgZHVyaW5nIHRoZSBga2V5ZG93bmAgcGhhc2VcbiAgICAgICAgaWYgKGtleSA9PSBLRVlTLlRBQikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuaGFuZGxlU2VhcmNoKGV2dCk7XG4gICAgICB9XG4gICAgKTtcbiAgfTtcblxuICAvKipcbiAgICogVGhpcyBtZXRob2Qgd2lsbCB0cmFuc2ZlciB0aGUgdGFiaW5kZXggYXR0cmlidXRlIGZyb20gdGhlIHJlbmRlcmVkXG4gICAqIHNlbGVjdGlvbiB0byB0aGUgc2VhcmNoIGJveC4gVGhpcyBhbGxvd3MgZm9yIHRoZSBzZWFyY2ggYm94IHRvIGJlIHVzZWQgYXNcbiAgICogdGhlIHByaW1hcnkgZm9jdXMgaW5zdGVhZCBvZiB0aGUgc2VsZWN0aW9uIGNvbnRhaW5lci5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIFNlYXJjaC5wcm90b3R5cGUuX3RyYW5zZmVyVGFiSW5kZXggPSBmdW5jdGlvbiAoZGVjb3JhdGVkKSB7XG4gICAgdGhpcy4kc2VhcmNoLmF0dHIoJ3RhYmluZGV4JywgdGhpcy4kc2VsZWN0aW9uLmF0dHIoJ3RhYmluZGV4JykpO1xuICAgIHRoaXMuJHNlbGVjdGlvbi5hdHRyKCd0YWJpbmRleCcsICctMScpO1xuICB9O1xuXG4gIFNlYXJjaC5wcm90b3R5cGUuY3JlYXRlUGxhY2Vob2xkZXIgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBwbGFjZWhvbGRlcikge1xuICAgIHRoaXMuJHNlYXJjaC5hdHRyKCdwbGFjZWhvbGRlcicsIHBsYWNlaG9sZGVyLnRleHQpO1xuICB9O1xuXG4gIFNlYXJjaC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgZGF0YSkge1xuICAgIHZhciBzZWFyY2hIYWRGb2N1cyA9IHRoaXMuJHNlYXJjaFswXSA9PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXG4gICAgdGhpcy4kc2VhcmNoLmF0dHIoJ3BsYWNlaG9sZGVyJywgJycpO1xuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgZGF0YSk7XG5cbiAgICB0aGlzLiRzZWxlY3Rpb24uZmluZCgnLnNlbGVjdDItc2VsZWN0aW9uX19yZW5kZXJlZCcpXG4gICAgICAgICAgICAgICAgICAgLmFwcGVuZCh0aGlzLiRzZWFyY2hDb250YWluZXIpO1xuXG4gICAgdGhpcy5yZXNpemVTZWFyY2goKTtcbiAgICBpZiAoc2VhcmNoSGFkRm9jdXMpIHtcbiAgICAgIHRoaXMuJHNlYXJjaC5mb2N1cygpO1xuICAgIH1cbiAgfTtcblxuICBTZWFyY2gucHJvdG90eXBlLmhhbmRsZVNlYXJjaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlc2l6ZVNlYXJjaCgpO1xuXG4gICAgaWYgKCF0aGlzLl9rZXlVcFByZXZlbnRlZCkge1xuICAgICAgdmFyIGlucHV0ID0gdGhpcy4kc2VhcmNoLnZhbCgpO1xuXG4gICAgICB0aGlzLnRyaWdnZXIoJ3F1ZXJ5Jywge1xuICAgICAgICB0ZXJtOiBpbnB1dFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5fa2V5VXBQcmV2ZW50ZWQgPSBmYWxzZTtcbiAgfTtcblxuICBTZWFyY2gucHJvdG90eXBlLnNlYXJjaFJlbW92ZUNob2ljZSA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGl0ZW0pIHtcbiAgICB0aGlzLnRyaWdnZXIoJ3Vuc2VsZWN0Jywge1xuICAgICAgZGF0YTogaXRlbVxuICAgIH0pO1xuXG4gICAgdGhpcy4kc2VhcmNoLnZhbChpdGVtLnRleHQpO1xuICAgIHRoaXMuaGFuZGxlU2VhcmNoKCk7XG4gIH07XG5cbiAgU2VhcmNoLnByb3RvdHlwZS5yZXNpemVTZWFyY2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy4kc2VhcmNoLmNzcygnd2lkdGgnLCAnMjVweCcpO1xuXG4gICAgdmFyIHdpZHRoID0gJyc7XG5cbiAgICBpZiAodGhpcy4kc2VhcmNoLmF0dHIoJ3BsYWNlaG9sZGVyJykgIT09ICcnKSB7XG4gICAgICB3aWR0aCA9IHRoaXMuJHNlbGVjdGlvbi5maW5kKCcuc2VsZWN0Mi1zZWxlY3Rpb25fX3JlbmRlcmVkJykuaW5uZXJXaWR0aCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgbWluaW11bVdpZHRoID0gdGhpcy4kc2VhcmNoLnZhbCgpLmxlbmd0aCArIDE7XG5cbiAgICAgIHdpZHRoID0gKG1pbmltdW1XaWR0aCAqIDAuNzUpICsgJ2VtJztcbiAgICB9XG5cbiAgICB0aGlzLiRzZWFyY2guY3NzKCd3aWR0aCcsIHdpZHRoKTtcbiAgfTtcblxuICByZXR1cm4gU2VhcmNoO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9zZWxlY3Rpb24vZXZlbnRSZWxheScsW1xuICAnanF1ZXJ5J1xuXSwgZnVuY3Rpb24gKCQpIHtcbiAgZnVuY3Rpb24gRXZlbnRSZWxheSAoKSB7IH1cblxuICBFdmVudFJlbGF5LnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgY29udGFpbmVyLCAkY29udGFpbmVyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciByZWxheUV2ZW50cyA9IFtcbiAgICAgICdvcGVuJywgJ29wZW5pbmcnLFxuICAgICAgJ2Nsb3NlJywgJ2Nsb3NpbmcnLFxuICAgICAgJ3NlbGVjdCcsICdzZWxlY3RpbmcnLFxuICAgICAgJ3Vuc2VsZWN0JywgJ3Vuc2VsZWN0aW5nJ1xuICAgIF07XG5cbiAgICB2YXIgcHJldmVudGFibGVFdmVudHMgPSBbJ29wZW5pbmcnLCAnY2xvc2luZycsICdzZWxlY3RpbmcnLCAndW5zZWxlY3RpbmcnXTtcblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGNvbnRhaW5lciwgJGNvbnRhaW5lcik7XG5cbiAgICBjb250YWluZXIub24oJyonLCBmdW5jdGlvbiAobmFtZSwgcGFyYW1zKSB7XG4gICAgICAvLyBJZ25vcmUgZXZlbnRzIHRoYXQgc2hvdWxkIG5vdCBiZSByZWxheWVkXG4gICAgICBpZiAoJC5pbkFycmF5KG5hbWUsIHJlbGF5RXZlbnRzKSA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGUgcGFyYW1ldGVycyBzaG91bGQgYWx3YXlzIGJlIGFuIG9iamVjdFxuICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuXG4gICAgICAvLyBHZW5lcmF0ZSB0aGUgalF1ZXJ5IGV2ZW50IGZvciB0aGUgU2VsZWN0MiBldmVudFxuICAgICAgdmFyIGV2dCA9ICQuRXZlbnQoJ3NlbGVjdDI6JyArIG5hbWUsIHtcbiAgICAgICAgcGFyYW1zOiBwYXJhbXNcbiAgICAgIH0pO1xuXG4gICAgICBzZWxmLiRlbGVtZW50LnRyaWdnZXIoZXZ0KTtcblxuICAgICAgLy8gT25seSBoYW5kbGUgcHJldmVudGFibGUgZXZlbnRzIGlmIGl0IHdhcyBvbmVcbiAgICAgIGlmICgkLmluQXJyYXkobmFtZSwgcHJldmVudGFibGVFdmVudHMpID09PSAtMSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHBhcmFtcy5wcmV2ZW50ZWQgPSBldnQuaXNEZWZhdWx0UHJldmVudGVkKCk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIEV2ZW50UmVsYXk7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL3RyYW5zbGF0aW9uJyxbXG4gICdqcXVlcnknLFxuICAncmVxdWlyZSdcbl0sIGZ1bmN0aW9uICgkLCByZXF1aXJlKSB7XG4gIGZ1bmN0aW9uIFRyYW5zbGF0aW9uIChkaWN0KSB7XG4gICAgdGhpcy5kaWN0ID0gZGljdCB8fCB7fTtcbiAgfVxuXG4gIFRyYW5zbGF0aW9uLnByb3RvdHlwZS5hbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGljdDtcbiAgfTtcblxuICBUcmFuc2xhdGlvbi5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiB0aGlzLmRpY3Rba2V5XTtcbiAgfTtcblxuICBUcmFuc2xhdGlvbi5wcm90b3R5cGUuZXh0ZW5kID0gZnVuY3Rpb24gKHRyYW5zbGF0aW9uKSB7XG4gICAgdGhpcy5kaWN0ID0gJC5leHRlbmQoe30sIHRyYW5zbGF0aW9uLmFsbCgpLCB0aGlzLmRpY3QpO1xuICB9O1xuXG4gIC8vIFN0YXRpYyBmdW5jdGlvbnNcblxuICBUcmFuc2xhdGlvbi5fY2FjaGUgPSB7fTtcblxuICBUcmFuc2xhdGlvbi5sb2FkUGF0aCA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgaWYgKCEocGF0aCBpbiBUcmFuc2xhdGlvbi5fY2FjaGUpKSB7XG4gICAgICB2YXIgdHJhbnNsYXRpb25zID0gcmVxdWlyZShwYXRoKTtcblxuICAgICAgVHJhbnNsYXRpb24uX2NhY2hlW3BhdGhdID0gdHJhbnNsYXRpb25zO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgVHJhbnNsYXRpb24oVHJhbnNsYXRpb24uX2NhY2hlW3BhdGhdKTtcbiAgfTtcblxuICByZXR1cm4gVHJhbnNsYXRpb247XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2RpYWNyaXRpY3MnLFtcblxuXSwgZnVuY3Rpb24gKCkge1xuICB2YXIgZGlhY3JpdGljcyA9IHtcbiAgICAnXFx1MjRCNic6ICdBJyxcbiAgICAnXFx1RkYyMSc6ICdBJyxcbiAgICAnXFx1MDBDMCc6ICdBJyxcbiAgICAnXFx1MDBDMSc6ICdBJyxcbiAgICAnXFx1MDBDMic6ICdBJyxcbiAgICAnXFx1MUVBNic6ICdBJyxcbiAgICAnXFx1MUVBNCc6ICdBJyxcbiAgICAnXFx1MUVBQSc6ICdBJyxcbiAgICAnXFx1MUVBOCc6ICdBJyxcbiAgICAnXFx1MDBDMyc6ICdBJyxcbiAgICAnXFx1MDEwMCc6ICdBJyxcbiAgICAnXFx1MDEwMic6ICdBJyxcbiAgICAnXFx1MUVCMCc6ICdBJyxcbiAgICAnXFx1MUVBRSc6ICdBJyxcbiAgICAnXFx1MUVCNCc6ICdBJyxcbiAgICAnXFx1MUVCMic6ICdBJyxcbiAgICAnXFx1MDIyNic6ICdBJyxcbiAgICAnXFx1MDFFMCc6ICdBJyxcbiAgICAnXFx1MDBDNCc6ICdBJyxcbiAgICAnXFx1MDFERSc6ICdBJyxcbiAgICAnXFx1MUVBMic6ICdBJyxcbiAgICAnXFx1MDBDNSc6ICdBJyxcbiAgICAnXFx1MDFGQSc6ICdBJyxcbiAgICAnXFx1MDFDRCc6ICdBJyxcbiAgICAnXFx1MDIwMCc6ICdBJyxcbiAgICAnXFx1MDIwMic6ICdBJyxcbiAgICAnXFx1MUVBMCc6ICdBJyxcbiAgICAnXFx1MUVBQyc6ICdBJyxcbiAgICAnXFx1MUVCNic6ICdBJyxcbiAgICAnXFx1MUUwMCc6ICdBJyxcbiAgICAnXFx1MDEwNCc6ICdBJyxcbiAgICAnXFx1MDIzQSc6ICdBJyxcbiAgICAnXFx1MkM2Ric6ICdBJyxcbiAgICAnXFx1QTczMic6ICdBQScsXG4gICAgJ1xcdTAwQzYnOiAnQUUnLFxuICAgICdcXHUwMUZDJzogJ0FFJyxcbiAgICAnXFx1MDFFMic6ICdBRScsXG4gICAgJ1xcdUE3MzQnOiAnQU8nLFxuICAgICdcXHVBNzM2JzogJ0FVJyxcbiAgICAnXFx1QTczOCc6ICdBVicsXG4gICAgJ1xcdUE3M0EnOiAnQVYnLFxuICAgICdcXHVBNzNDJzogJ0FZJyxcbiAgICAnXFx1MjRCNyc6ICdCJyxcbiAgICAnXFx1RkYyMic6ICdCJyxcbiAgICAnXFx1MUUwMic6ICdCJyxcbiAgICAnXFx1MUUwNCc6ICdCJyxcbiAgICAnXFx1MUUwNic6ICdCJyxcbiAgICAnXFx1MDI0Myc6ICdCJyxcbiAgICAnXFx1MDE4Mic6ICdCJyxcbiAgICAnXFx1MDE4MSc6ICdCJyxcbiAgICAnXFx1MjRCOCc6ICdDJyxcbiAgICAnXFx1RkYyMyc6ICdDJyxcbiAgICAnXFx1MDEwNic6ICdDJyxcbiAgICAnXFx1MDEwOCc6ICdDJyxcbiAgICAnXFx1MDEwQSc6ICdDJyxcbiAgICAnXFx1MDEwQyc6ICdDJyxcbiAgICAnXFx1MDBDNyc6ICdDJyxcbiAgICAnXFx1MUUwOCc6ICdDJyxcbiAgICAnXFx1MDE4Nyc6ICdDJyxcbiAgICAnXFx1MDIzQic6ICdDJyxcbiAgICAnXFx1QTczRSc6ICdDJyxcbiAgICAnXFx1MjRCOSc6ICdEJyxcbiAgICAnXFx1RkYyNCc6ICdEJyxcbiAgICAnXFx1MUUwQSc6ICdEJyxcbiAgICAnXFx1MDEwRSc6ICdEJyxcbiAgICAnXFx1MUUwQyc6ICdEJyxcbiAgICAnXFx1MUUxMCc6ICdEJyxcbiAgICAnXFx1MUUxMic6ICdEJyxcbiAgICAnXFx1MUUwRSc6ICdEJyxcbiAgICAnXFx1MDExMCc6ICdEJyxcbiAgICAnXFx1MDE4Qic6ICdEJyxcbiAgICAnXFx1MDE4QSc6ICdEJyxcbiAgICAnXFx1MDE4OSc6ICdEJyxcbiAgICAnXFx1QTc3OSc6ICdEJyxcbiAgICAnXFx1MDFGMSc6ICdEWicsXG4gICAgJ1xcdTAxQzQnOiAnRFonLFxuICAgICdcXHUwMUYyJzogJ0R6JyxcbiAgICAnXFx1MDFDNSc6ICdEeicsXG4gICAgJ1xcdTI0QkEnOiAnRScsXG4gICAgJ1xcdUZGMjUnOiAnRScsXG4gICAgJ1xcdTAwQzgnOiAnRScsXG4gICAgJ1xcdTAwQzknOiAnRScsXG4gICAgJ1xcdTAwQ0EnOiAnRScsXG4gICAgJ1xcdTFFQzAnOiAnRScsXG4gICAgJ1xcdTFFQkUnOiAnRScsXG4gICAgJ1xcdTFFQzQnOiAnRScsXG4gICAgJ1xcdTFFQzInOiAnRScsXG4gICAgJ1xcdTFFQkMnOiAnRScsXG4gICAgJ1xcdTAxMTInOiAnRScsXG4gICAgJ1xcdTFFMTQnOiAnRScsXG4gICAgJ1xcdTFFMTYnOiAnRScsXG4gICAgJ1xcdTAxMTQnOiAnRScsXG4gICAgJ1xcdTAxMTYnOiAnRScsXG4gICAgJ1xcdTAwQ0InOiAnRScsXG4gICAgJ1xcdTFFQkEnOiAnRScsXG4gICAgJ1xcdTAxMUEnOiAnRScsXG4gICAgJ1xcdTAyMDQnOiAnRScsXG4gICAgJ1xcdTAyMDYnOiAnRScsXG4gICAgJ1xcdTFFQjgnOiAnRScsXG4gICAgJ1xcdTFFQzYnOiAnRScsXG4gICAgJ1xcdTAyMjgnOiAnRScsXG4gICAgJ1xcdTFFMUMnOiAnRScsXG4gICAgJ1xcdTAxMTgnOiAnRScsXG4gICAgJ1xcdTFFMTgnOiAnRScsXG4gICAgJ1xcdTFFMUEnOiAnRScsXG4gICAgJ1xcdTAxOTAnOiAnRScsXG4gICAgJ1xcdTAxOEUnOiAnRScsXG4gICAgJ1xcdTI0QkInOiAnRicsXG4gICAgJ1xcdUZGMjYnOiAnRicsXG4gICAgJ1xcdTFFMUUnOiAnRicsXG4gICAgJ1xcdTAxOTEnOiAnRicsXG4gICAgJ1xcdUE3N0InOiAnRicsXG4gICAgJ1xcdTI0QkMnOiAnRycsXG4gICAgJ1xcdUZGMjcnOiAnRycsXG4gICAgJ1xcdTAxRjQnOiAnRycsXG4gICAgJ1xcdTAxMUMnOiAnRycsXG4gICAgJ1xcdTFFMjAnOiAnRycsXG4gICAgJ1xcdTAxMUUnOiAnRycsXG4gICAgJ1xcdTAxMjAnOiAnRycsXG4gICAgJ1xcdTAxRTYnOiAnRycsXG4gICAgJ1xcdTAxMjInOiAnRycsXG4gICAgJ1xcdTAxRTQnOiAnRycsXG4gICAgJ1xcdTAxOTMnOiAnRycsXG4gICAgJ1xcdUE3QTAnOiAnRycsXG4gICAgJ1xcdUE3N0QnOiAnRycsXG4gICAgJ1xcdUE3N0UnOiAnRycsXG4gICAgJ1xcdTI0QkQnOiAnSCcsXG4gICAgJ1xcdUZGMjgnOiAnSCcsXG4gICAgJ1xcdTAxMjQnOiAnSCcsXG4gICAgJ1xcdTFFMjInOiAnSCcsXG4gICAgJ1xcdTFFMjYnOiAnSCcsXG4gICAgJ1xcdTAyMUUnOiAnSCcsXG4gICAgJ1xcdTFFMjQnOiAnSCcsXG4gICAgJ1xcdTFFMjgnOiAnSCcsXG4gICAgJ1xcdTFFMkEnOiAnSCcsXG4gICAgJ1xcdTAxMjYnOiAnSCcsXG4gICAgJ1xcdTJDNjcnOiAnSCcsXG4gICAgJ1xcdTJDNzUnOiAnSCcsXG4gICAgJ1xcdUE3OEQnOiAnSCcsXG4gICAgJ1xcdTI0QkUnOiAnSScsXG4gICAgJ1xcdUZGMjknOiAnSScsXG4gICAgJ1xcdTAwQ0MnOiAnSScsXG4gICAgJ1xcdTAwQ0QnOiAnSScsXG4gICAgJ1xcdTAwQ0UnOiAnSScsXG4gICAgJ1xcdTAxMjgnOiAnSScsXG4gICAgJ1xcdTAxMkEnOiAnSScsXG4gICAgJ1xcdTAxMkMnOiAnSScsXG4gICAgJ1xcdTAxMzAnOiAnSScsXG4gICAgJ1xcdTAwQ0YnOiAnSScsXG4gICAgJ1xcdTFFMkUnOiAnSScsXG4gICAgJ1xcdTFFQzgnOiAnSScsXG4gICAgJ1xcdTAxQ0YnOiAnSScsXG4gICAgJ1xcdTAyMDgnOiAnSScsXG4gICAgJ1xcdTAyMEEnOiAnSScsXG4gICAgJ1xcdTFFQ0EnOiAnSScsXG4gICAgJ1xcdTAxMkUnOiAnSScsXG4gICAgJ1xcdTFFMkMnOiAnSScsXG4gICAgJ1xcdTAxOTcnOiAnSScsXG4gICAgJ1xcdTI0QkYnOiAnSicsXG4gICAgJ1xcdUZGMkEnOiAnSicsXG4gICAgJ1xcdTAxMzQnOiAnSicsXG4gICAgJ1xcdTAyNDgnOiAnSicsXG4gICAgJ1xcdTI0QzAnOiAnSycsXG4gICAgJ1xcdUZGMkInOiAnSycsXG4gICAgJ1xcdTFFMzAnOiAnSycsXG4gICAgJ1xcdTAxRTgnOiAnSycsXG4gICAgJ1xcdTFFMzInOiAnSycsXG4gICAgJ1xcdTAxMzYnOiAnSycsXG4gICAgJ1xcdTFFMzQnOiAnSycsXG4gICAgJ1xcdTAxOTgnOiAnSycsXG4gICAgJ1xcdTJDNjknOiAnSycsXG4gICAgJ1xcdUE3NDAnOiAnSycsXG4gICAgJ1xcdUE3NDInOiAnSycsXG4gICAgJ1xcdUE3NDQnOiAnSycsXG4gICAgJ1xcdUE3QTInOiAnSycsXG4gICAgJ1xcdTI0QzEnOiAnTCcsXG4gICAgJ1xcdUZGMkMnOiAnTCcsXG4gICAgJ1xcdTAxM0YnOiAnTCcsXG4gICAgJ1xcdTAxMzknOiAnTCcsXG4gICAgJ1xcdTAxM0QnOiAnTCcsXG4gICAgJ1xcdTFFMzYnOiAnTCcsXG4gICAgJ1xcdTFFMzgnOiAnTCcsXG4gICAgJ1xcdTAxM0InOiAnTCcsXG4gICAgJ1xcdTFFM0MnOiAnTCcsXG4gICAgJ1xcdTFFM0EnOiAnTCcsXG4gICAgJ1xcdTAxNDEnOiAnTCcsXG4gICAgJ1xcdTAyM0QnOiAnTCcsXG4gICAgJ1xcdTJDNjInOiAnTCcsXG4gICAgJ1xcdTJDNjAnOiAnTCcsXG4gICAgJ1xcdUE3NDgnOiAnTCcsXG4gICAgJ1xcdUE3NDYnOiAnTCcsXG4gICAgJ1xcdUE3ODAnOiAnTCcsXG4gICAgJ1xcdTAxQzcnOiAnTEonLFxuICAgICdcXHUwMUM4JzogJ0xqJyxcbiAgICAnXFx1MjRDMic6ICdNJyxcbiAgICAnXFx1RkYyRCc6ICdNJyxcbiAgICAnXFx1MUUzRSc6ICdNJyxcbiAgICAnXFx1MUU0MCc6ICdNJyxcbiAgICAnXFx1MUU0Mic6ICdNJyxcbiAgICAnXFx1MkM2RSc6ICdNJyxcbiAgICAnXFx1MDE5Qyc6ICdNJyxcbiAgICAnXFx1MjRDMyc6ICdOJyxcbiAgICAnXFx1RkYyRSc6ICdOJyxcbiAgICAnXFx1MDFGOCc6ICdOJyxcbiAgICAnXFx1MDE0Myc6ICdOJyxcbiAgICAnXFx1MDBEMSc6ICdOJyxcbiAgICAnXFx1MUU0NCc6ICdOJyxcbiAgICAnXFx1MDE0Nyc6ICdOJyxcbiAgICAnXFx1MUU0Nic6ICdOJyxcbiAgICAnXFx1MDE0NSc6ICdOJyxcbiAgICAnXFx1MUU0QSc6ICdOJyxcbiAgICAnXFx1MUU0OCc6ICdOJyxcbiAgICAnXFx1MDIyMCc6ICdOJyxcbiAgICAnXFx1MDE5RCc6ICdOJyxcbiAgICAnXFx1QTc5MCc6ICdOJyxcbiAgICAnXFx1QTdBNCc6ICdOJyxcbiAgICAnXFx1MDFDQSc6ICdOSicsXG4gICAgJ1xcdTAxQ0InOiAnTmonLFxuICAgICdcXHUyNEM0JzogJ08nLFxuICAgICdcXHVGRjJGJzogJ08nLFxuICAgICdcXHUwMEQyJzogJ08nLFxuICAgICdcXHUwMEQzJzogJ08nLFxuICAgICdcXHUwMEQ0JzogJ08nLFxuICAgICdcXHUxRUQyJzogJ08nLFxuICAgICdcXHUxRUQwJzogJ08nLFxuICAgICdcXHUxRUQ2JzogJ08nLFxuICAgICdcXHUxRUQ0JzogJ08nLFxuICAgICdcXHUwMEQ1JzogJ08nLFxuICAgICdcXHUxRTRDJzogJ08nLFxuICAgICdcXHUwMjJDJzogJ08nLFxuICAgICdcXHUxRTRFJzogJ08nLFxuICAgICdcXHUwMTRDJzogJ08nLFxuICAgICdcXHUxRTUwJzogJ08nLFxuICAgICdcXHUxRTUyJzogJ08nLFxuICAgICdcXHUwMTRFJzogJ08nLFxuICAgICdcXHUwMjJFJzogJ08nLFxuICAgICdcXHUwMjMwJzogJ08nLFxuICAgICdcXHUwMEQ2JzogJ08nLFxuICAgICdcXHUwMjJBJzogJ08nLFxuICAgICdcXHUxRUNFJzogJ08nLFxuICAgICdcXHUwMTUwJzogJ08nLFxuICAgICdcXHUwMUQxJzogJ08nLFxuICAgICdcXHUwMjBDJzogJ08nLFxuICAgICdcXHUwMjBFJzogJ08nLFxuICAgICdcXHUwMUEwJzogJ08nLFxuICAgICdcXHUxRURDJzogJ08nLFxuICAgICdcXHUxRURBJzogJ08nLFxuICAgICdcXHUxRUUwJzogJ08nLFxuICAgICdcXHUxRURFJzogJ08nLFxuICAgICdcXHUxRUUyJzogJ08nLFxuICAgICdcXHUxRUNDJzogJ08nLFxuICAgICdcXHUxRUQ4JzogJ08nLFxuICAgICdcXHUwMUVBJzogJ08nLFxuICAgICdcXHUwMUVDJzogJ08nLFxuICAgICdcXHUwMEQ4JzogJ08nLFxuICAgICdcXHUwMUZFJzogJ08nLFxuICAgICdcXHUwMTg2JzogJ08nLFxuICAgICdcXHUwMTlGJzogJ08nLFxuICAgICdcXHVBNzRBJzogJ08nLFxuICAgICdcXHVBNzRDJzogJ08nLFxuICAgICdcXHUwMUEyJzogJ09JJyxcbiAgICAnXFx1QTc0RSc6ICdPTycsXG4gICAgJ1xcdTAyMjInOiAnT1UnLFxuICAgICdcXHUyNEM1JzogJ1AnLFxuICAgICdcXHVGRjMwJzogJ1AnLFxuICAgICdcXHUxRTU0JzogJ1AnLFxuICAgICdcXHUxRTU2JzogJ1AnLFxuICAgICdcXHUwMUE0JzogJ1AnLFxuICAgICdcXHUyQzYzJzogJ1AnLFxuICAgICdcXHVBNzUwJzogJ1AnLFxuICAgICdcXHVBNzUyJzogJ1AnLFxuICAgICdcXHVBNzU0JzogJ1AnLFxuICAgICdcXHUyNEM2JzogJ1EnLFxuICAgICdcXHVGRjMxJzogJ1EnLFxuICAgICdcXHVBNzU2JzogJ1EnLFxuICAgICdcXHVBNzU4JzogJ1EnLFxuICAgICdcXHUwMjRBJzogJ1EnLFxuICAgICdcXHUyNEM3JzogJ1InLFxuICAgICdcXHVGRjMyJzogJ1InLFxuICAgICdcXHUwMTU0JzogJ1InLFxuICAgICdcXHUxRTU4JzogJ1InLFxuICAgICdcXHUwMTU4JzogJ1InLFxuICAgICdcXHUwMjEwJzogJ1InLFxuICAgICdcXHUwMjEyJzogJ1InLFxuICAgICdcXHUxRTVBJzogJ1InLFxuICAgICdcXHUxRTVDJzogJ1InLFxuICAgICdcXHUwMTU2JzogJ1InLFxuICAgICdcXHUxRTVFJzogJ1InLFxuICAgICdcXHUwMjRDJzogJ1InLFxuICAgICdcXHUyQzY0JzogJ1InLFxuICAgICdcXHVBNzVBJzogJ1InLFxuICAgICdcXHVBN0E2JzogJ1InLFxuICAgICdcXHVBNzgyJzogJ1InLFxuICAgICdcXHUyNEM4JzogJ1MnLFxuICAgICdcXHVGRjMzJzogJ1MnLFxuICAgICdcXHUxRTlFJzogJ1MnLFxuICAgICdcXHUwMTVBJzogJ1MnLFxuICAgICdcXHUxRTY0JzogJ1MnLFxuICAgICdcXHUwMTVDJzogJ1MnLFxuICAgICdcXHUxRTYwJzogJ1MnLFxuICAgICdcXHUwMTYwJzogJ1MnLFxuICAgICdcXHUxRTY2JzogJ1MnLFxuICAgICdcXHUxRTYyJzogJ1MnLFxuICAgICdcXHUxRTY4JzogJ1MnLFxuICAgICdcXHUwMjE4JzogJ1MnLFxuICAgICdcXHUwMTVFJzogJ1MnLFxuICAgICdcXHUyQzdFJzogJ1MnLFxuICAgICdcXHVBN0E4JzogJ1MnLFxuICAgICdcXHVBNzg0JzogJ1MnLFxuICAgICdcXHUyNEM5JzogJ1QnLFxuICAgICdcXHVGRjM0JzogJ1QnLFxuICAgICdcXHUxRTZBJzogJ1QnLFxuICAgICdcXHUwMTY0JzogJ1QnLFxuICAgICdcXHUxRTZDJzogJ1QnLFxuICAgICdcXHUwMjFBJzogJ1QnLFxuICAgICdcXHUwMTYyJzogJ1QnLFxuICAgICdcXHUxRTcwJzogJ1QnLFxuICAgICdcXHUxRTZFJzogJ1QnLFxuICAgICdcXHUwMTY2JzogJ1QnLFxuICAgICdcXHUwMUFDJzogJ1QnLFxuICAgICdcXHUwMUFFJzogJ1QnLFxuICAgICdcXHUwMjNFJzogJ1QnLFxuICAgICdcXHVBNzg2JzogJ1QnLFxuICAgICdcXHVBNzI4JzogJ1RaJyxcbiAgICAnXFx1MjRDQSc6ICdVJyxcbiAgICAnXFx1RkYzNSc6ICdVJyxcbiAgICAnXFx1MDBEOSc6ICdVJyxcbiAgICAnXFx1MDBEQSc6ICdVJyxcbiAgICAnXFx1MDBEQic6ICdVJyxcbiAgICAnXFx1MDE2OCc6ICdVJyxcbiAgICAnXFx1MUU3OCc6ICdVJyxcbiAgICAnXFx1MDE2QSc6ICdVJyxcbiAgICAnXFx1MUU3QSc6ICdVJyxcbiAgICAnXFx1MDE2Qyc6ICdVJyxcbiAgICAnXFx1MDBEQyc6ICdVJyxcbiAgICAnXFx1MDFEQic6ICdVJyxcbiAgICAnXFx1MDFENyc6ICdVJyxcbiAgICAnXFx1MDFENSc6ICdVJyxcbiAgICAnXFx1MDFEOSc6ICdVJyxcbiAgICAnXFx1MUVFNic6ICdVJyxcbiAgICAnXFx1MDE2RSc6ICdVJyxcbiAgICAnXFx1MDE3MCc6ICdVJyxcbiAgICAnXFx1MDFEMyc6ICdVJyxcbiAgICAnXFx1MDIxNCc6ICdVJyxcbiAgICAnXFx1MDIxNic6ICdVJyxcbiAgICAnXFx1MDFBRic6ICdVJyxcbiAgICAnXFx1MUVFQSc6ICdVJyxcbiAgICAnXFx1MUVFOCc6ICdVJyxcbiAgICAnXFx1MUVFRSc6ICdVJyxcbiAgICAnXFx1MUVFQyc6ICdVJyxcbiAgICAnXFx1MUVGMCc6ICdVJyxcbiAgICAnXFx1MUVFNCc6ICdVJyxcbiAgICAnXFx1MUU3Mic6ICdVJyxcbiAgICAnXFx1MDE3Mic6ICdVJyxcbiAgICAnXFx1MUU3Nic6ICdVJyxcbiAgICAnXFx1MUU3NCc6ICdVJyxcbiAgICAnXFx1MDI0NCc6ICdVJyxcbiAgICAnXFx1MjRDQic6ICdWJyxcbiAgICAnXFx1RkYzNic6ICdWJyxcbiAgICAnXFx1MUU3Qyc6ICdWJyxcbiAgICAnXFx1MUU3RSc6ICdWJyxcbiAgICAnXFx1MDFCMic6ICdWJyxcbiAgICAnXFx1QTc1RSc6ICdWJyxcbiAgICAnXFx1MDI0NSc6ICdWJyxcbiAgICAnXFx1QTc2MCc6ICdWWScsXG4gICAgJ1xcdTI0Q0MnOiAnVycsXG4gICAgJ1xcdUZGMzcnOiAnVycsXG4gICAgJ1xcdTFFODAnOiAnVycsXG4gICAgJ1xcdTFFODInOiAnVycsXG4gICAgJ1xcdTAxNzQnOiAnVycsXG4gICAgJ1xcdTFFODYnOiAnVycsXG4gICAgJ1xcdTFFODQnOiAnVycsXG4gICAgJ1xcdTFFODgnOiAnVycsXG4gICAgJ1xcdTJDNzInOiAnVycsXG4gICAgJ1xcdTI0Q0QnOiAnWCcsXG4gICAgJ1xcdUZGMzgnOiAnWCcsXG4gICAgJ1xcdTFFOEEnOiAnWCcsXG4gICAgJ1xcdTFFOEMnOiAnWCcsXG4gICAgJ1xcdTI0Q0UnOiAnWScsXG4gICAgJ1xcdUZGMzknOiAnWScsXG4gICAgJ1xcdTFFRjInOiAnWScsXG4gICAgJ1xcdTAwREQnOiAnWScsXG4gICAgJ1xcdTAxNzYnOiAnWScsXG4gICAgJ1xcdTFFRjgnOiAnWScsXG4gICAgJ1xcdTAyMzInOiAnWScsXG4gICAgJ1xcdTFFOEUnOiAnWScsXG4gICAgJ1xcdTAxNzgnOiAnWScsXG4gICAgJ1xcdTFFRjYnOiAnWScsXG4gICAgJ1xcdTFFRjQnOiAnWScsXG4gICAgJ1xcdTAxQjMnOiAnWScsXG4gICAgJ1xcdTAyNEUnOiAnWScsXG4gICAgJ1xcdTFFRkUnOiAnWScsXG4gICAgJ1xcdTI0Q0YnOiAnWicsXG4gICAgJ1xcdUZGM0EnOiAnWicsXG4gICAgJ1xcdTAxNzknOiAnWicsXG4gICAgJ1xcdTFFOTAnOiAnWicsXG4gICAgJ1xcdTAxN0InOiAnWicsXG4gICAgJ1xcdTAxN0QnOiAnWicsXG4gICAgJ1xcdTFFOTInOiAnWicsXG4gICAgJ1xcdTFFOTQnOiAnWicsXG4gICAgJ1xcdTAxQjUnOiAnWicsXG4gICAgJ1xcdTAyMjQnOiAnWicsXG4gICAgJ1xcdTJDN0YnOiAnWicsXG4gICAgJ1xcdTJDNkInOiAnWicsXG4gICAgJ1xcdUE3NjInOiAnWicsXG4gICAgJ1xcdTI0RDAnOiAnYScsXG4gICAgJ1xcdUZGNDEnOiAnYScsXG4gICAgJ1xcdTFFOUEnOiAnYScsXG4gICAgJ1xcdTAwRTAnOiAnYScsXG4gICAgJ1xcdTAwRTEnOiAnYScsXG4gICAgJ1xcdTAwRTInOiAnYScsXG4gICAgJ1xcdTFFQTcnOiAnYScsXG4gICAgJ1xcdTFFQTUnOiAnYScsXG4gICAgJ1xcdTFFQUInOiAnYScsXG4gICAgJ1xcdTFFQTknOiAnYScsXG4gICAgJ1xcdTAwRTMnOiAnYScsXG4gICAgJ1xcdTAxMDEnOiAnYScsXG4gICAgJ1xcdTAxMDMnOiAnYScsXG4gICAgJ1xcdTFFQjEnOiAnYScsXG4gICAgJ1xcdTFFQUYnOiAnYScsXG4gICAgJ1xcdTFFQjUnOiAnYScsXG4gICAgJ1xcdTFFQjMnOiAnYScsXG4gICAgJ1xcdTAyMjcnOiAnYScsXG4gICAgJ1xcdTAxRTEnOiAnYScsXG4gICAgJ1xcdTAwRTQnOiAnYScsXG4gICAgJ1xcdTAxREYnOiAnYScsXG4gICAgJ1xcdTFFQTMnOiAnYScsXG4gICAgJ1xcdTAwRTUnOiAnYScsXG4gICAgJ1xcdTAxRkInOiAnYScsXG4gICAgJ1xcdTAxQ0UnOiAnYScsXG4gICAgJ1xcdTAyMDEnOiAnYScsXG4gICAgJ1xcdTAyMDMnOiAnYScsXG4gICAgJ1xcdTFFQTEnOiAnYScsXG4gICAgJ1xcdTFFQUQnOiAnYScsXG4gICAgJ1xcdTFFQjcnOiAnYScsXG4gICAgJ1xcdTFFMDEnOiAnYScsXG4gICAgJ1xcdTAxMDUnOiAnYScsXG4gICAgJ1xcdTJDNjUnOiAnYScsXG4gICAgJ1xcdTAyNTAnOiAnYScsXG4gICAgJ1xcdUE3MzMnOiAnYWEnLFxuICAgICdcXHUwMEU2JzogJ2FlJyxcbiAgICAnXFx1MDFGRCc6ICdhZScsXG4gICAgJ1xcdTAxRTMnOiAnYWUnLFxuICAgICdcXHVBNzM1JzogJ2FvJyxcbiAgICAnXFx1QTczNyc6ICdhdScsXG4gICAgJ1xcdUE3MzknOiAnYXYnLFxuICAgICdcXHVBNzNCJzogJ2F2JyxcbiAgICAnXFx1QTczRCc6ICdheScsXG4gICAgJ1xcdTI0RDEnOiAnYicsXG4gICAgJ1xcdUZGNDInOiAnYicsXG4gICAgJ1xcdTFFMDMnOiAnYicsXG4gICAgJ1xcdTFFMDUnOiAnYicsXG4gICAgJ1xcdTFFMDcnOiAnYicsXG4gICAgJ1xcdTAxODAnOiAnYicsXG4gICAgJ1xcdTAxODMnOiAnYicsXG4gICAgJ1xcdTAyNTMnOiAnYicsXG4gICAgJ1xcdTI0RDInOiAnYycsXG4gICAgJ1xcdUZGNDMnOiAnYycsXG4gICAgJ1xcdTAxMDcnOiAnYycsXG4gICAgJ1xcdTAxMDknOiAnYycsXG4gICAgJ1xcdTAxMEInOiAnYycsXG4gICAgJ1xcdTAxMEQnOiAnYycsXG4gICAgJ1xcdTAwRTcnOiAnYycsXG4gICAgJ1xcdTFFMDknOiAnYycsXG4gICAgJ1xcdTAxODgnOiAnYycsXG4gICAgJ1xcdTAyM0MnOiAnYycsXG4gICAgJ1xcdUE3M0YnOiAnYycsXG4gICAgJ1xcdTIxODQnOiAnYycsXG4gICAgJ1xcdTI0RDMnOiAnZCcsXG4gICAgJ1xcdUZGNDQnOiAnZCcsXG4gICAgJ1xcdTFFMEInOiAnZCcsXG4gICAgJ1xcdTAxMEYnOiAnZCcsXG4gICAgJ1xcdTFFMEQnOiAnZCcsXG4gICAgJ1xcdTFFMTEnOiAnZCcsXG4gICAgJ1xcdTFFMTMnOiAnZCcsXG4gICAgJ1xcdTFFMEYnOiAnZCcsXG4gICAgJ1xcdTAxMTEnOiAnZCcsXG4gICAgJ1xcdTAxOEMnOiAnZCcsXG4gICAgJ1xcdTAyNTYnOiAnZCcsXG4gICAgJ1xcdTAyNTcnOiAnZCcsXG4gICAgJ1xcdUE3N0EnOiAnZCcsXG4gICAgJ1xcdTAxRjMnOiAnZHonLFxuICAgICdcXHUwMUM2JzogJ2R6JyxcbiAgICAnXFx1MjRENCc6ICdlJyxcbiAgICAnXFx1RkY0NSc6ICdlJyxcbiAgICAnXFx1MDBFOCc6ICdlJyxcbiAgICAnXFx1MDBFOSc6ICdlJyxcbiAgICAnXFx1MDBFQSc6ICdlJyxcbiAgICAnXFx1MUVDMSc6ICdlJyxcbiAgICAnXFx1MUVCRic6ICdlJyxcbiAgICAnXFx1MUVDNSc6ICdlJyxcbiAgICAnXFx1MUVDMyc6ICdlJyxcbiAgICAnXFx1MUVCRCc6ICdlJyxcbiAgICAnXFx1MDExMyc6ICdlJyxcbiAgICAnXFx1MUUxNSc6ICdlJyxcbiAgICAnXFx1MUUxNyc6ICdlJyxcbiAgICAnXFx1MDExNSc6ICdlJyxcbiAgICAnXFx1MDExNyc6ICdlJyxcbiAgICAnXFx1MDBFQic6ICdlJyxcbiAgICAnXFx1MUVCQic6ICdlJyxcbiAgICAnXFx1MDExQic6ICdlJyxcbiAgICAnXFx1MDIwNSc6ICdlJyxcbiAgICAnXFx1MDIwNyc6ICdlJyxcbiAgICAnXFx1MUVCOSc6ICdlJyxcbiAgICAnXFx1MUVDNyc6ICdlJyxcbiAgICAnXFx1MDIyOSc6ICdlJyxcbiAgICAnXFx1MUUxRCc6ICdlJyxcbiAgICAnXFx1MDExOSc6ICdlJyxcbiAgICAnXFx1MUUxOSc6ICdlJyxcbiAgICAnXFx1MUUxQic6ICdlJyxcbiAgICAnXFx1MDI0Nyc6ICdlJyxcbiAgICAnXFx1MDI1Qic6ICdlJyxcbiAgICAnXFx1MDFERCc6ICdlJyxcbiAgICAnXFx1MjRENSc6ICdmJyxcbiAgICAnXFx1RkY0Nic6ICdmJyxcbiAgICAnXFx1MUUxRic6ICdmJyxcbiAgICAnXFx1MDE5Mic6ICdmJyxcbiAgICAnXFx1QTc3Qyc6ICdmJyxcbiAgICAnXFx1MjRENic6ICdnJyxcbiAgICAnXFx1RkY0Nyc6ICdnJyxcbiAgICAnXFx1MDFGNSc6ICdnJyxcbiAgICAnXFx1MDExRCc6ICdnJyxcbiAgICAnXFx1MUUyMSc6ICdnJyxcbiAgICAnXFx1MDExRic6ICdnJyxcbiAgICAnXFx1MDEyMSc6ICdnJyxcbiAgICAnXFx1MDFFNyc6ICdnJyxcbiAgICAnXFx1MDEyMyc6ICdnJyxcbiAgICAnXFx1MDFFNSc6ICdnJyxcbiAgICAnXFx1MDI2MCc6ICdnJyxcbiAgICAnXFx1QTdBMSc6ICdnJyxcbiAgICAnXFx1MUQ3OSc6ICdnJyxcbiAgICAnXFx1QTc3Ric6ICdnJyxcbiAgICAnXFx1MjRENyc6ICdoJyxcbiAgICAnXFx1RkY0OCc6ICdoJyxcbiAgICAnXFx1MDEyNSc6ICdoJyxcbiAgICAnXFx1MUUyMyc6ICdoJyxcbiAgICAnXFx1MUUyNyc6ICdoJyxcbiAgICAnXFx1MDIxRic6ICdoJyxcbiAgICAnXFx1MUUyNSc6ICdoJyxcbiAgICAnXFx1MUUyOSc6ICdoJyxcbiAgICAnXFx1MUUyQic6ICdoJyxcbiAgICAnXFx1MUU5Nic6ICdoJyxcbiAgICAnXFx1MDEyNyc6ICdoJyxcbiAgICAnXFx1MkM2OCc6ICdoJyxcbiAgICAnXFx1MkM3Nic6ICdoJyxcbiAgICAnXFx1MDI2NSc6ICdoJyxcbiAgICAnXFx1MDE5NSc6ICdodicsXG4gICAgJ1xcdTI0RDgnOiAnaScsXG4gICAgJ1xcdUZGNDknOiAnaScsXG4gICAgJ1xcdTAwRUMnOiAnaScsXG4gICAgJ1xcdTAwRUQnOiAnaScsXG4gICAgJ1xcdTAwRUUnOiAnaScsXG4gICAgJ1xcdTAxMjknOiAnaScsXG4gICAgJ1xcdTAxMkInOiAnaScsXG4gICAgJ1xcdTAxMkQnOiAnaScsXG4gICAgJ1xcdTAwRUYnOiAnaScsXG4gICAgJ1xcdTFFMkYnOiAnaScsXG4gICAgJ1xcdTFFQzknOiAnaScsXG4gICAgJ1xcdTAxRDAnOiAnaScsXG4gICAgJ1xcdTAyMDknOiAnaScsXG4gICAgJ1xcdTAyMEInOiAnaScsXG4gICAgJ1xcdTFFQ0InOiAnaScsXG4gICAgJ1xcdTAxMkYnOiAnaScsXG4gICAgJ1xcdTFFMkQnOiAnaScsXG4gICAgJ1xcdTAyNjgnOiAnaScsXG4gICAgJ1xcdTAxMzEnOiAnaScsXG4gICAgJ1xcdTI0RDknOiAnaicsXG4gICAgJ1xcdUZGNEEnOiAnaicsXG4gICAgJ1xcdTAxMzUnOiAnaicsXG4gICAgJ1xcdTAxRjAnOiAnaicsXG4gICAgJ1xcdTAyNDknOiAnaicsXG4gICAgJ1xcdTI0REEnOiAnaycsXG4gICAgJ1xcdUZGNEInOiAnaycsXG4gICAgJ1xcdTFFMzEnOiAnaycsXG4gICAgJ1xcdTAxRTknOiAnaycsXG4gICAgJ1xcdTFFMzMnOiAnaycsXG4gICAgJ1xcdTAxMzcnOiAnaycsXG4gICAgJ1xcdTFFMzUnOiAnaycsXG4gICAgJ1xcdTAxOTknOiAnaycsXG4gICAgJ1xcdTJDNkEnOiAnaycsXG4gICAgJ1xcdUE3NDEnOiAnaycsXG4gICAgJ1xcdUE3NDMnOiAnaycsXG4gICAgJ1xcdUE3NDUnOiAnaycsXG4gICAgJ1xcdUE3QTMnOiAnaycsXG4gICAgJ1xcdTI0REInOiAnbCcsXG4gICAgJ1xcdUZGNEMnOiAnbCcsXG4gICAgJ1xcdTAxNDAnOiAnbCcsXG4gICAgJ1xcdTAxM0EnOiAnbCcsXG4gICAgJ1xcdTAxM0UnOiAnbCcsXG4gICAgJ1xcdTFFMzcnOiAnbCcsXG4gICAgJ1xcdTFFMzknOiAnbCcsXG4gICAgJ1xcdTAxM0MnOiAnbCcsXG4gICAgJ1xcdTFFM0QnOiAnbCcsXG4gICAgJ1xcdTFFM0InOiAnbCcsXG4gICAgJ1xcdTAxN0YnOiAnbCcsXG4gICAgJ1xcdTAxNDInOiAnbCcsXG4gICAgJ1xcdTAxOUEnOiAnbCcsXG4gICAgJ1xcdTAyNkInOiAnbCcsXG4gICAgJ1xcdTJDNjEnOiAnbCcsXG4gICAgJ1xcdUE3NDknOiAnbCcsXG4gICAgJ1xcdUE3ODEnOiAnbCcsXG4gICAgJ1xcdUE3NDcnOiAnbCcsXG4gICAgJ1xcdTAxQzknOiAnbGonLFxuICAgICdcXHUyNERDJzogJ20nLFxuICAgICdcXHVGRjREJzogJ20nLFxuICAgICdcXHUxRTNGJzogJ20nLFxuICAgICdcXHUxRTQxJzogJ20nLFxuICAgICdcXHUxRTQzJzogJ20nLFxuICAgICdcXHUwMjcxJzogJ20nLFxuICAgICdcXHUwMjZGJzogJ20nLFxuICAgICdcXHUyNEREJzogJ24nLFxuICAgICdcXHVGRjRFJzogJ24nLFxuICAgICdcXHUwMUY5JzogJ24nLFxuICAgICdcXHUwMTQ0JzogJ24nLFxuICAgICdcXHUwMEYxJzogJ24nLFxuICAgICdcXHUxRTQ1JzogJ24nLFxuICAgICdcXHUwMTQ4JzogJ24nLFxuICAgICdcXHUxRTQ3JzogJ24nLFxuICAgICdcXHUwMTQ2JzogJ24nLFxuICAgICdcXHUxRTRCJzogJ24nLFxuICAgICdcXHUxRTQ5JzogJ24nLFxuICAgICdcXHUwMTlFJzogJ24nLFxuICAgICdcXHUwMjcyJzogJ24nLFxuICAgICdcXHUwMTQ5JzogJ24nLFxuICAgICdcXHVBNzkxJzogJ24nLFxuICAgICdcXHVBN0E1JzogJ24nLFxuICAgICdcXHUwMUNDJzogJ25qJyxcbiAgICAnXFx1MjRERSc6ICdvJyxcbiAgICAnXFx1RkY0Ric6ICdvJyxcbiAgICAnXFx1MDBGMic6ICdvJyxcbiAgICAnXFx1MDBGMyc6ICdvJyxcbiAgICAnXFx1MDBGNCc6ICdvJyxcbiAgICAnXFx1MUVEMyc6ICdvJyxcbiAgICAnXFx1MUVEMSc6ICdvJyxcbiAgICAnXFx1MUVENyc6ICdvJyxcbiAgICAnXFx1MUVENSc6ICdvJyxcbiAgICAnXFx1MDBGNSc6ICdvJyxcbiAgICAnXFx1MUU0RCc6ICdvJyxcbiAgICAnXFx1MDIyRCc6ICdvJyxcbiAgICAnXFx1MUU0Ric6ICdvJyxcbiAgICAnXFx1MDE0RCc6ICdvJyxcbiAgICAnXFx1MUU1MSc6ICdvJyxcbiAgICAnXFx1MUU1Myc6ICdvJyxcbiAgICAnXFx1MDE0Ric6ICdvJyxcbiAgICAnXFx1MDIyRic6ICdvJyxcbiAgICAnXFx1MDIzMSc6ICdvJyxcbiAgICAnXFx1MDBGNic6ICdvJyxcbiAgICAnXFx1MDIyQic6ICdvJyxcbiAgICAnXFx1MUVDRic6ICdvJyxcbiAgICAnXFx1MDE1MSc6ICdvJyxcbiAgICAnXFx1MDFEMic6ICdvJyxcbiAgICAnXFx1MDIwRCc6ICdvJyxcbiAgICAnXFx1MDIwRic6ICdvJyxcbiAgICAnXFx1MDFBMSc6ICdvJyxcbiAgICAnXFx1MUVERCc6ICdvJyxcbiAgICAnXFx1MUVEQic6ICdvJyxcbiAgICAnXFx1MUVFMSc6ICdvJyxcbiAgICAnXFx1MUVERic6ICdvJyxcbiAgICAnXFx1MUVFMyc6ICdvJyxcbiAgICAnXFx1MUVDRCc6ICdvJyxcbiAgICAnXFx1MUVEOSc6ICdvJyxcbiAgICAnXFx1MDFFQic6ICdvJyxcbiAgICAnXFx1MDFFRCc6ICdvJyxcbiAgICAnXFx1MDBGOCc6ICdvJyxcbiAgICAnXFx1MDFGRic6ICdvJyxcbiAgICAnXFx1MDI1NCc6ICdvJyxcbiAgICAnXFx1QTc0Qic6ICdvJyxcbiAgICAnXFx1QTc0RCc6ICdvJyxcbiAgICAnXFx1MDI3NSc6ICdvJyxcbiAgICAnXFx1MDFBMyc6ICdvaScsXG4gICAgJ1xcdTAyMjMnOiAnb3UnLFxuICAgICdcXHVBNzRGJzogJ29vJyxcbiAgICAnXFx1MjRERic6ICdwJyxcbiAgICAnXFx1RkY1MCc6ICdwJyxcbiAgICAnXFx1MUU1NSc6ICdwJyxcbiAgICAnXFx1MUU1Nyc6ICdwJyxcbiAgICAnXFx1MDFBNSc6ICdwJyxcbiAgICAnXFx1MUQ3RCc6ICdwJyxcbiAgICAnXFx1QTc1MSc6ICdwJyxcbiAgICAnXFx1QTc1Myc6ICdwJyxcbiAgICAnXFx1QTc1NSc6ICdwJyxcbiAgICAnXFx1MjRFMCc6ICdxJyxcbiAgICAnXFx1RkY1MSc6ICdxJyxcbiAgICAnXFx1MDI0Qic6ICdxJyxcbiAgICAnXFx1QTc1Nyc6ICdxJyxcbiAgICAnXFx1QTc1OSc6ICdxJyxcbiAgICAnXFx1MjRFMSc6ICdyJyxcbiAgICAnXFx1RkY1Mic6ICdyJyxcbiAgICAnXFx1MDE1NSc6ICdyJyxcbiAgICAnXFx1MUU1OSc6ICdyJyxcbiAgICAnXFx1MDE1OSc6ICdyJyxcbiAgICAnXFx1MDIxMSc6ICdyJyxcbiAgICAnXFx1MDIxMyc6ICdyJyxcbiAgICAnXFx1MUU1Qic6ICdyJyxcbiAgICAnXFx1MUU1RCc6ICdyJyxcbiAgICAnXFx1MDE1Nyc6ICdyJyxcbiAgICAnXFx1MUU1Ric6ICdyJyxcbiAgICAnXFx1MDI0RCc6ICdyJyxcbiAgICAnXFx1MDI3RCc6ICdyJyxcbiAgICAnXFx1QTc1Qic6ICdyJyxcbiAgICAnXFx1QTdBNyc6ICdyJyxcbiAgICAnXFx1QTc4Myc6ICdyJyxcbiAgICAnXFx1MjRFMic6ICdzJyxcbiAgICAnXFx1RkY1Myc6ICdzJyxcbiAgICAnXFx1MDBERic6ICdzJyxcbiAgICAnXFx1MDE1Qic6ICdzJyxcbiAgICAnXFx1MUU2NSc6ICdzJyxcbiAgICAnXFx1MDE1RCc6ICdzJyxcbiAgICAnXFx1MUU2MSc6ICdzJyxcbiAgICAnXFx1MDE2MSc6ICdzJyxcbiAgICAnXFx1MUU2Nyc6ICdzJyxcbiAgICAnXFx1MUU2Myc6ICdzJyxcbiAgICAnXFx1MUU2OSc6ICdzJyxcbiAgICAnXFx1MDIxOSc6ICdzJyxcbiAgICAnXFx1MDE1Ric6ICdzJyxcbiAgICAnXFx1MDIzRic6ICdzJyxcbiAgICAnXFx1QTdBOSc6ICdzJyxcbiAgICAnXFx1QTc4NSc6ICdzJyxcbiAgICAnXFx1MUU5Qic6ICdzJyxcbiAgICAnXFx1MjRFMyc6ICd0JyxcbiAgICAnXFx1RkY1NCc6ICd0JyxcbiAgICAnXFx1MUU2Qic6ICd0JyxcbiAgICAnXFx1MUU5Nyc6ICd0JyxcbiAgICAnXFx1MDE2NSc6ICd0JyxcbiAgICAnXFx1MUU2RCc6ICd0JyxcbiAgICAnXFx1MDIxQic6ICd0JyxcbiAgICAnXFx1MDE2Myc6ICd0JyxcbiAgICAnXFx1MUU3MSc6ICd0JyxcbiAgICAnXFx1MUU2Ric6ICd0JyxcbiAgICAnXFx1MDE2Nyc6ICd0JyxcbiAgICAnXFx1MDFBRCc6ICd0JyxcbiAgICAnXFx1MDI4OCc6ICd0JyxcbiAgICAnXFx1MkM2Nic6ICd0JyxcbiAgICAnXFx1QTc4Nyc6ICd0JyxcbiAgICAnXFx1QTcyOSc6ICd0eicsXG4gICAgJ1xcdTI0RTQnOiAndScsXG4gICAgJ1xcdUZGNTUnOiAndScsXG4gICAgJ1xcdTAwRjknOiAndScsXG4gICAgJ1xcdTAwRkEnOiAndScsXG4gICAgJ1xcdTAwRkInOiAndScsXG4gICAgJ1xcdTAxNjknOiAndScsXG4gICAgJ1xcdTFFNzknOiAndScsXG4gICAgJ1xcdTAxNkInOiAndScsXG4gICAgJ1xcdTFFN0InOiAndScsXG4gICAgJ1xcdTAxNkQnOiAndScsXG4gICAgJ1xcdTAwRkMnOiAndScsXG4gICAgJ1xcdTAxREMnOiAndScsXG4gICAgJ1xcdTAxRDgnOiAndScsXG4gICAgJ1xcdTAxRDYnOiAndScsXG4gICAgJ1xcdTAxREEnOiAndScsXG4gICAgJ1xcdTFFRTcnOiAndScsXG4gICAgJ1xcdTAxNkYnOiAndScsXG4gICAgJ1xcdTAxNzEnOiAndScsXG4gICAgJ1xcdTAxRDQnOiAndScsXG4gICAgJ1xcdTAyMTUnOiAndScsXG4gICAgJ1xcdTAyMTcnOiAndScsXG4gICAgJ1xcdTAxQjAnOiAndScsXG4gICAgJ1xcdTFFRUInOiAndScsXG4gICAgJ1xcdTFFRTknOiAndScsXG4gICAgJ1xcdTFFRUYnOiAndScsXG4gICAgJ1xcdTFFRUQnOiAndScsXG4gICAgJ1xcdTFFRjEnOiAndScsXG4gICAgJ1xcdTFFRTUnOiAndScsXG4gICAgJ1xcdTFFNzMnOiAndScsXG4gICAgJ1xcdTAxNzMnOiAndScsXG4gICAgJ1xcdTFFNzcnOiAndScsXG4gICAgJ1xcdTFFNzUnOiAndScsXG4gICAgJ1xcdTAyODknOiAndScsXG4gICAgJ1xcdTI0RTUnOiAndicsXG4gICAgJ1xcdUZGNTYnOiAndicsXG4gICAgJ1xcdTFFN0QnOiAndicsXG4gICAgJ1xcdTFFN0YnOiAndicsXG4gICAgJ1xcdTAyOEInOiAndicsXG4gICAgJ1xcdUE3NUYnOiAndicsXG4gICAgJ1xcdTAyOEMnOiAndicsXG4gICAgJ1xcdUE3NjEnOiAndnknLFxuICAgICdcXHUyNEU2JzogJ3cnLFxuICAgICdcXHVGRjU3JzogJ3cnLFxuICAgICdcXHUxRTgxJzogJ3cnLFxuICAgICdcXHUxRTgzJzogJ3cnLFxuICAgICdcXHUwMTc1JzogJ3cnLFxuICAgICdcXHUxRTg3JzogJ3cnLFxuICAgICdcXHUxRTg1JzogJ3cnLFxuICAgICdcXHUxRTk4JzogJ3cnLFxuICAgICdcXHUxRTg5JzogJ3cnLFxuICAgICdcXHUyQzczJzogJ3cnLFxuICAgICdcXHUyNEU3JzogJ3gnLFxuICAgICdcXHVGRjU4JzogJ3gnLFxuICAgICdcXHUxRThCJzogJ3gnLFxuICAgICdcXHUxRThEJzogJ3gnLFxuICAgICdcXHUyNEU4JzogJ3knLFxuICAgICdcXHVGRjU5JzogJ3knLFxuICAgICdcXHUxRUYzJzogJ3knLFxuICAgICdcXHUwMEZEJzogJ3knLFxuICAgICdcXHUwMTc3JzogJ3knLFxuICAgICdcXHUxRUY5JzogJ3knLFxuICAgICdcXHUwMjMzJzogJ3knLFxuICAgICdcXHUxRThGJzogJ3knLFxuICAgICdcXHUwMEZGJzogJ3knLFxuICAgICdcXHUxRUY3JzogJ3knLFxuICAgICdcXHUxRTk5JzogJ3knLFxuICAgICdcXHUxRUY1JzogJ3knLFxuICAgICdcXHUwMUI0JzogJ3knLFxuICAgICdcXHUwMjRGJzogJ3knLFxuICAgICdcXHUxRUZGJzogJ3knLFxuICAgICdcXHUyNEU5JzogJ3onLFxuICAgICdcXHVGRjVBJzogJ3onLFxuICAgICdcXHUwMTdBJzogJ3onLFxuICAgICdcXHUxRTkxJzogJ3onLFxuICAgICdcXHUwMTdDJzogJ3onLFxuICAgICdcXHUwMTdFJzogJ3onLFxuICAgICdcXHUxRTkzJzogJ3onLFxuICAgICdcXHUxRTk1JzogJ3onLFxuICAgICdcXHUwMUI2JzogJ3onLFxuICAgICdcXHUwMjI1JzogJ3onLFxuICAgICdcXHUwMjQwJzogJ3onLFxuICAgICdcXHUyQzZDJzogJ3onLFxuICAgICdcXHVBNzYzJzogJ3onLFxuICAgICdcXHUwMzg2JzogJ1xcdTAzOTEnLFxuICAgICdcXHUwMzg4JzogJ1xcdTAzOTUnLFxuICAgICdcXHUwMzg5JzogJ1xcdTAzOTcnLFxuICAgICdcXHUwMzhBJzogJ1xcdTAzOTknLFxuICAgICdcXHUwM0FBJzogJ1xcdTAzOTknLFxuICAgICdcXHUwMzhDJzogJ1xcdTAzOUYnLFxuICAgICdcXHUwMzhFJzogJ1xcdTAzQTUnLFxuICAgICdcXHUwM0FCJzogJ1xcdTAzQTUnLFxuICAgICdcXHUwMzhGJzogJ1xcdTAzQTknLFxuICAgICdcXHUwM0FDJzogJ1xcdTAzQjEnLFxuICAgICdcXHUwM0FEJzogJ1xcdTAzQjUnLFxuICAgICdcXHUwM0FFJzogJ1xcdTAzQjcnLFxuICAgICdcXHUwM0FGJzogJ1xcdTAzQjknLFxuICAgICdcXHUwM0NBJzogJ1xcdTAzQjknLFxuICAgICdcXHUwMzkwJzogJ1xcdTAzQjknLFxuICAgICdcXHUwM0NDJzogJ1xcdTAzQkYnLFxuICAgICdcXHUwM0NEJzogJ1xcdTAzQzUnLFxuICAgICdcXHUwM0NCJzogJ1xcdTAzQzUnLFxuICAgICdcXHUwM0IwJzogJ1xcdTAzQzUnLFxuICAgICdcXHUwM0M5JzogJ1xcdTAzQzknLFxuICAgICdcXHUwM0MyJzogJ1xcdTAzQzMnXG4gIH07XG5cbiAgcmV0dXJuIGRpYWNyaXRpY3M7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2RhdGEvYmFzZScsW1xuICAnLi4vdXRpbHMnXG5dLCBmdW5jdGlvbiAoVXRpbHMpIHtcbiAgZnVuY3Rpb24gQmFzZUFkYXB0ZXIgKCRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgQmFzZUFkYXB0ZXIuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcyk7XG4gIH1cblxuICBVdGlscy5FeHRlbmQoQmFzZUFkYXB0ZXIsIFV0aWxzLk9ic2VydmFibGUpO1xuXG4gIEJhc2VBZGFwdGVyLnByb3RvdHlwZS5jdXJyZW50ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgYGN1cnJlbnRgIG1ldGhvZCBtdXN0IGJlIGRlZmluZWQgaW4gY2hpbGQgY2xhc3Nlcy4nKTtcbiAgfTtcblxuICBCYXNlQWRhcHRlci5wcm90b3R5cGUucXVlcnkgPSBmdW5jdGlvbiAocGFyYW1zLCBjYWxsYmFjaykge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlIGBxdWVyeWAgbWV0aG9kIG11c3QgYmUgZGVmaW5lZCBpbiBjaGlsZCBjbGFzc2VzLicpO1xuICB9O1xuXG4gIEJhc2VBZGFwdGVyLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgIC8vIENhbiBiZSBpbXBsZW1lbnRlZCBpbiBzdWJjbGFzc2VzXG4gIH07XG5cbiAgQmFzZUFkYXB0ZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gQ2FuIGJlIGltcGxlbWVudGVkIGluIHN1YmNsYXNzZXNcbiAgfTtcblxuICBCYXNlQWRhcHRlci5wcm90b3R5cGUuZ2VuZXJhdGVSZXN1bHRJZCA9IGZ1bmN0aW9uIChjb250YWluZXIsIGRhdGEpIHtcbiAgICB2YXIgaWQgPSBjb250YWluZXIuaWQgKyAnLXJlc3VsdC0nO1xuXG4gICAgaWQgKz0gVXRpbHMuZ2VuZXJhdGVDaGFycyg0KTtcblxuICAgIGlmIChkYXRhLmlkICE9IG51bGwpIHtcbiAgICAgIGlkICs9ICctJyArIGRhdGEuaWQudG9TdHJpbmcoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWQgKz0gJy0nICsgVXRpbHMuZ2VuZXJhdGVDaGFycyg0KTtcbiAgICB9XG4gICAgcmV0dXJuIGlkO1xuICB9O1xuXG4gIHJldHVybiBCYXNlQWRhcHRlcjtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZGF0YS9zZWxlY3QnLFtcbiAgJy4vYmFzZScsXG4gICcuLi91dGlscycsXG4gICdqcXVlcnknXG5dLCBmdW5jdGlvbiAoQmFzZUFkYXB0ZXIsIFV0aWxzLCAkKSB7XG4gIGZ1bmN0aW9uIFNlbGVjdEFkYXB0ZXIgKCRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy4kZWxlbWVudCA9ICRlbGVtZW50O1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICBTZWxlY3RBZGFwdGVyLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMpO1xuICB9XG5cbiAgVXRpbHMuRXh0ZW5kKFNlbGVjdEFkYXB0ZXIsIEJhc2VBZGFwdGVyKTtcblxuICBTZWxlY3RBZGFwdGVyLnByb3RvdHlwZS5jdXJyZW50ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgdmFyIGRhdGEgPSBbXTtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB0aGlzLiRlbGVtZW50LmZpbmQoJzpzZWxlY3RlZCcpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICRvcHRpb24gPSAkKHRoaXMpO1xuXG4gICAgICB2YXIgb3B0aW9uID0gc2VsZi5pdGVtKCRvcHRpb24pO1xuXG4gICAgICBkYXRhLnB1c2gob3B0aW9uKTtcbiAgICB9KTtcblxuICAgIGNhbGxiYWNrKGRhdGEpO1xuICB9O1xuXG4gIFNlbGVjdEFkYXB0ZXIucHJvdG90eXBlLnNlbGVjdCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgZGF0YS5zZWxlY3RlZCA9IHRydWU7XG5cbiAgICAvLyBJZiBkYXRhLmVsZW1lbnQgaXMgYSBET00gbm9kZSwgdXNlIGl0IGluc3RlYWRcbiAgICBpZiAoJChkYXRhLmVsZW1lbnQpLmlzKCdvcHRpb24nKSkge1xuICAgICAgZGF0YS5lbGVtZW50LnNlbGVjdGVkID0gdHJ1ZTtcblxuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2UnKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLiRlbGVtZW50LnByb3AoJ211bHRpcGxlJykpIHtcbiAgICAgIHRoaXMuY3VycmVudChmdW5jdGlvbiAoY3VycmVudERhdGEpIHtcbiAgICAgICAgdmFyIHZhbCA9IFtdO1xuXG4gICAgICAgIGRhdGEgPSBbZGF0YV07XG4gICAgICAgIGRhdGEucHVzaC5hcHBseShkYXRhLCBjdXJyZW50RGF0YSk7XG5cbiAgICAgICAgZm9yICh2YXIgZCA9IDA7IGQgPCBkYXRhLmxlbmd0aDsgZCsrKSB7XG4gICAgICAgICAgdmFyIGlkID0gZGF0YVtkXS5pZDtcblxuICAgICAgICAgIGlmICgkLmluQXJyYXkoaWQsIHZhbCkgPT09IC0xKSB7XG4gICAgICAgICAgICB2YWwucHVzaChpZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi4kZWxlbWVudC52YWwodmFsKTtcbiAgICAgICAgc2VsZi4kZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdmFsID0gZGF0YS5pZDtcblxuICAgICAgdGhpcy4kZWxlbWVudC52YWwodmFsKTtcbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignY2hhbmdlJyk7XG4gICAgfVxuICB9O1xuXG4gIFNlbGVjdEFkYXB0ZXIucHJvdG90eXBlLnVuc2VsZWN0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoIXRoaXMuJGVsZW1lbnQucHJvcCgnbXVsdGlwbGUnKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGRhdGEuc2VsZWN0ZWQgPSBmYWxzZTtcblxuICAgIGlmICgkKGRhdGEuZWxlbWVudCkuaXMoJ29wdGlvbicpKSB7XG4gICAgICBkYXRhLmVsZW1lbnQuc2VsZWN0ZWQgPSBmYWxzZTtcblxuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2UnKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY3VycmVudChmdW5jdGlvbiAoY3VycmVudERhdGEpIHtcbiAgICAgIHZhciB2YWwgPSBbXTtcblxuICAgICAgZm9yICh2YXIgZCA9IDA7IGQgPCBjdXJyZW50RGF0YS5sZW5ndGg7IGQrKykge1xuICAgICAgICB2YXIgaWQgPSBjdXJyZW50RGF0YVtkXS5pZDtcblxuICAgICAgICBpZiAoaWQgIT09IGRhdGEuaWQgJiYgJC5pbkFycmF5KGlkLCB2YWwpID09PSAtMSkge1xuICAgICAgICAgIHZhbC5wdXNoKGlkKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzZWxmLiRlbGVtZW50LnZhbCh2YWwpO1xuXG4gICAgICBzZWxmLiRlbGVtZW50LnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgIH0pO1xuICB9O1xuXG4gIFNlbGVjdEFkYXB0ZXIucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoY29udGFpbmVyLCAkY29udGFpbmVyKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG5cbiAgICBjb250YWluZXIub24oJ3NlbGVjdCcsIGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgIHNlbGYuc2VsZWN0KHBhcmFtcy5kYXRhKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbigndW5zZWxlY3QnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICBzZWxmLnVuc2VsZWN0KHBhcmFtcy5kYXRhKTtcbiAgICB9KTtcbiAgfTtcblxuICBTZWxlY3RBZGFwdGVyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIFJlbW92ZSBhbnl0aGluZyBhZGRlZCB0byBjaGlsZCBlbGVtZW50c1xuICAgIHRoaXMuJGVsZW1lbnQuZmluZCgnKicpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgLy8gUmVtb3ZlIGFueSBjdXN0b20gZGF0YSBzZXQgYnkgU2VsZWN0MlxuICAgICAgJC5yZW1vdmVEYXRhKHRoaXMsICdkYXRhJyk7XG4gICAgfSk7XG4gIH07XG5cbiAgU2VsZWN0QWRhcHRlci5wcm90b3R5cGUucXVlcnkgPSBmdW5jdGlvbiAocGFyYW1zLCBjYWxsYmFjaykge1xuICAgIHZhciBkYXRhID0gW107XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdmFyICRvcHRpb25zID0gdGhpcy4kZWxlbWVudC5jaGlsZHJlbigpO1xuXG4gICAgJG9wdGlvbnMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJG9wdGlvbiA9ICQodGhpcyk7XG5cbiAgICAgIGlmICghJG9wdGlvbi5pcygnb3B0aW9uJykgJiYgISRvcHRpb24uaXMoJ29wdGdyb3VwJykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgb3B0aW9uID0gc2VsZi5pdGVtKCRvcHRpb24pO1xuXG4gICAgICB2YXIgbWF0Y2hlcyA9IHNlbGYubWF0Y2hlcyhwYXJhbXMsIG9wdGlvbik7XG5cbiAgICAgIGlmIChtYXRjaGVzICE9PSBudWxsKSB7XG4gICAgICAgIGRhdGEucHVzaChtYXRjaGVzKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNhbGxiYWNrKHtcbiAgICAgIHJlc3VsdHM6IGRhdGFcbiAgICB9KTtcbiAgfTtcblxuICBTZWxlY3RBZGFwdGVyLnByb3RvdHlwZS5hZGRPcHRpb25zID0gZnVuY3Rpb24gKCRvcHRpb25zKSB7XG4gICAgVXRpbHMuYXBwZW5kTWFueSh0aGlzLiRlbGVtZW50LCAkb3B0aW9ucyk7XG4gIH07XG5cbiAgU2VsZWN0QWRhcHRlci5wcm90b3R5cGUub3B0aW9uID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgb3B0aW9uO1xuXG4gICAgaWYgKGRhdGEuY2hpbGRyZW4pIHtcbiAgICAgIG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGdyb3VwJyk7XG4gICAgICBvcHRpb24ubGFiZWwgPSBkYXRhLnRleHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuXG4gICAgICBpZiAob3B0aW9uLnRleHRDb250ZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgb3B0aW9uLnRleHRDb250ZW50ID0gZGF0YS50ZXh0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3B0aW9uLmlubmVyVGV4dCA9IGRhdGEudGV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZGF0YS5pZCkge1xuICAgICAgb3B0aW9uLnZhbHVlID0gZGF0YS5pZDtcbiAgICB9XG5cbiAgICBpZiAoZGF0YS5kaXNhYmxlZCkge1xuICAgICAgb3B0aW9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YS5zZWxlY3RlZCkge1xuICAgICAgb3B0aW9uLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YS50aXRsZSkge1xuICAgICAgb3B0aW9uLnRpdGxlID0gZGF0YS50aXRsZTtcbiAgICB9XG5cbiAgICB2YXIgJG9wdGlvbiA9ICQob3B0aW9uKTtcblxuICAgIHZhciBub3JtYWxpemVkRGF0YSA9IHRoaXMuX25vcm1hbGl6ZUl0ZW0oZGF0YSk7XG4gICAgbm9ybWFsaXplZERhdGEuZWxlbWVudCA9IG9wdGlvbjtcblxuICAgIC8vIE92ZXJyaWRlIHRoZSBvcHRpb24ncyBkYXRhIHdpdGggdGhlIGNvbWJpbmVkIGRhdGFcbiAgICAkLmRhdGEob3B0aW9uLCAnZGF0YScsIG5vcm1hbGl6ZWREYXRhKTtcblxuICAgIHJldHVybiAkb3B0aW9uO1xuICB9O1xuXG4gIFNlbGVjdEFkYXB0ZXIucHJvdG90eXBlLml0ZW0gPSBmdW5jdGlvbiAoJG9wdGlvbikge1xuICAgIHZhciBkYXRhID0ge307XG5cbiAgICBkYXRhID0gJC5kYXRhKCRvcHRpb25bMF0sICdkYXRhJyk7XG5cbiAgICBpZiAoZGF0YSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICBpZiAoJG9wdGlvbi5pcygnb3B0aW9uJykpIHtcbiAgICAgIGRhdGEgPSB7XG4gICAgICAgIGlkOiAkb3B0aW9uLnZhbCgpLFxuICAgICAgICB0ZXh0OiAkb3B0aW9uLnRleHQoKSxcbiAgICAgICAgZGlzYWJsZWQ6ICRvcHRpb24ucHJvcCgnZGlzYWJsZWQnKSxcbiAgICAgICAgc2VsZWN0ZWQ6ICRvcHRpb24ucHJvcCgnc2VsZWN0ZWQnKSxcbiAgICAgICAgdGl0bGU6ICRvcHRpb24ucHJvcCgndGl0bGUnKVxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKCRvcHRpb24uaXMoJ29wdGdyb3VwJykpIHtcbiAgICAgIGRhdGEgPSB7XG4gICAgICAgIHRleHQ6ICRvcHRpb24ucHJvcCgnbGFiZWwnKSxcbiAgICAgICAgY2hpbGRyZW46IFtdLFxuICAgICAgICB0aXRsZTogJG9wdGlvbi5wcm9wKCd0aXRsZScpXG4gICAgICB9O1xuXG4gICAgICB2YXIgJGNoaWxkcmVuID0gJG9wdGlvbi5jaGlsZHJlbignb3B0aW9uJyk7XG4gICAgICB2YXIgY2hpbGRyZW4gPSBbXTtcblxuICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCAkY2hpbGRyZW4ubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgdmFyICRjaGlsZCA9ICQoJGNoaWxkcmVuW2NdKTtcblxuICAgICAgICB2YXIgY2hpbGQgPSB0aGlzLml0ZW0oJGNoaWxkKTtcblxuICAgICAgICBjaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICAgIH1cblxuICAgICAgZGF0YS5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgIH1cblxuICAgIGRhdGEgPSB0aGlzLl9ub3JtYWxpemVJdGVtKGRhdGEpO1xuICAgIGRhdGEuZWxlbWVudCA9ICRvcHRpb25bMF07XG5cbiAgICAkLmRhdGEoJG9wdGlvblswXSwgJ2RhdGEnLCBkYXRhKTtcblxuICAgIHJldHVybiBkYXRhO1xuICB9O1xuXG4gIFNlbGVjdEFkYXB0ZXIucHJvdG90eXBlLl9ub3JtYWxpemVJdGVtID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICBpZiAoISQuaXNQbGFpbk9iamVjdChpdGVtKSkge1xuICAgICAgaXRlbSA9IHtcbiAgICAgICAgaWQ6IGl0ZW0sXG4gICAgICAgIHRleHQ6IGl0ZW1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgaXRlbSA9ICQuZXh0ZW5kKHt9LCB7XG4gICAgICB0ZXh0OiAnJ1xuICAgIH0sIGl0ZW0pO1xuXG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgZGlzYWJsZWQ6IGZhbHNlXG4gICAgfTtcblxuICAgIGlmIChpdGVtLmlkICE9IG51bGwpIHtcbiAgICAgIGl0ZW0uaWQgPSBpdGVtLmlkLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgaWYgKGl0ZW0udGV4dCAhPSBudWxsKSB7XG4gICAgICBpdGVtLnRleHQgPSBpdGVtLnRleHQudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBpZiAoaXRlbS5fcmVzdWx0SWQgPT0gbnVsbCAmJiBpdGVtLmlkICYmIHRoaXMuY29udGFpbmVyICE9IG51bGwpIHtcbiAgICAgIGl0ZW0uX3Jlc3VsdElkID0gdGhpcy5nZW5lcmF0ZVJlc3VsdElkKHRoaXMuY29udGFpbmVyLCBpdGVtKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJC5leHRlbmQoe30sIGRlZmF1bHRzLCBpdGVtKTtcbiAgfTtcblxuICBTZWxlY3RBZGFwdGVyLnByb3RvdHlwZS5tYXRjaGVzID0gZnVuY3Rpb24gKHBhcmFtcywgZGF0YSkge1xuICAgIHZhciBtYXRjaGVyID0gdGhpcy5vcHRpb25zLmdldCgnbWF0Y2hlcicpO1xuXG4gICAgcmV0dXJuIG1hdGNoZXIocGFyYW1zLCBkYXRhKTtcbiAgfTtcblxuICByZXR1cm4gU2VsZWN0QWRhcHRlcjtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZGF0YS9hcnJheScsW1xuICAnLi9zZWxlY3QnLFxuICAnLi4vdXRpbHMnLFxuICAnanF1ZXJ5J1xuXSwgZnVuY3Rpb24gKFNlbGVjdEFkYXB0ZXIsIFV0aWxzLCAkKSB7XG4gIGZ1bmN0aW9uIEFycmF5QWRhcHRlciAoJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB2YXIgZGF0YSA9IG9wdGlvbnMuZ2V0KCdkYXRhJykgfHwgW107XG5cbiAgICBBcnJheUFkYXB0ZXIuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgJGVsZW1lbnQsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5hZGRPcHRpb25zKHRoaXMuY29udmVydFRvT3B0aW9ucyhkYXRhKSk7XG4gIH1cblxuICBVdGlscy5FeHRlbmQoQXJyYXlBZGFwdGVyLCBTZWxlY3RBZGFwdGVyKTtcblxuICBBcnJheUFkYXB0ZXIucHJvdG90eXBlLnNlbGVjdCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyICRvcHRpb24gPSB0aGlzLiRlbGVtZW50LmZpbmQoJ29wdGlvbicpLmZpbHRlcihmdW5jdGlvbiAoaSwgZWxtKSB7XG4gICAgICByZXR1cm4gZWxtLnZhbHVlID09IGRhdGEuaWQudG9TdHJpbmcoKTtcbiAgICB9KTtcblxuICAgIGlmICgkb3B0aW9uLmxlbmd0aCA9PT0gMCkge1xuICAgICAgJG9wdGlvbiA9IHRoaXMub3B0aW9uKGRhdGEpO1xuXG4gICAgICB0aGlzLmFkZE9wdGlvbnMoJG9wdGlvbik7XG4gICAgfVxuXG4gICAgQXJyYXlBZGFwdGVyLl9fc3VwZXJfXy5zZWxlY3QuY2FsbCh0aGlzLCBkYXRhKTtcbiAgfTtcblxuICBBcnJheUFkYXB0ZXIucHJvdG90eXBlLmNvbnZlcnRUb09wdGlvbnMgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHZhciAkZXhpc3RpbmcgPSB0aGlzLiRlbGVtZW50LmZpbmQoJ29wdGlvbicpO1xuICAgIHZhciBleGlzdGluZ0lkcyA9ICRleGlzdGluZy5tYXAoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHNlbGYuaXRlbSgkKHRoaXMpKS5pZDtcbiAgICB9KS5nZXQoKTtcblxuICAgIHZhciAkb3B0aW9ucyA9IFtdO1xuXG4gICAgLy8gRmlsdGVyIG91dCBhbGwgaXRlbXMgZXhjZXB0IGZvciB0aGUgb25lIHBhc3NlZCBpbiB0aGUgYXJndW1lbnRcbiAgICBmdW5jdGlvbiBvbmx5SXRlbSAoaXRlbSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICQodGhpcykudmFsKCkgPT0gaXRlbS5pZDtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZm9yICh2YXIgZCA9IDA7IGQgPCBkYXRhLmxlbmd0aDsgZCsrKSB7XG4gICAgICB2YXIgaXRlbSA9IHRoaXMuX25vcm1hbGl6ZUl0ZW0oZGF0YVtkXSk7XG5cbiAgICAgIC8vIFNraXAgaXRlbXMgd2hpY2ggd2VyZSBwcmUtbG9hZGVkLCBvbmx5IG1lcmdlIHRoZSBkYXRhXG4gICAgICBpZiAoJC5pbkFycmF5KGl0ZW0uaWQsIGV4aXN0aW5nSWRzKSA+PSAwKSB7XG4gICAgICAgIHZhciAkZXhpc3RpbmdPcHRpb24gPSAkZXhpc3RpbmcuZmlsdGVyKG9ubHlJdGVtKGl0ZW0pKTtcblxuICAgICAgICB2YXIgZXhpc3RpbmdEYXRhID0gdGhpcy5pdGVtKCRleGlzdGluZ09wdGlvbik7XG4gICAgICAgIHZhciBuZXdEYXRhID0gJC5leHRlbmQodHJ1ZSwge30sIGl0ZW0sIGV4aXN0aW5nRGF0YSk7XG5cbiAgICAgICAgdmFyICRuZXdPcHRpb24gPSB0aGlzLm9wdGlvbihuZXdEYXRhKTtcblxuICAgICAgICAkZXhpc3RpbmdPcHRpb24ucmVwbGFjZVdpdGgoJG5ld09wdGlvbik7XG5cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHZhciAkb3B0aW9uID0gdGhpcy5vcHRpb24oaXRlbSk7XG5cbiAgICAgIGlmIChpdGVtLmNoaWxkcmVuKSB7XG4gICAgICAgIHZhciAkY2hpbGRyZW4gPSB0aGlzLmNvbnZlcnRUb09wdGlvbnMoaXRlbS5jaGlsZHJlbik7XG5cbiAgICAgICAgVXRpbHMuYXBwZW5kTWFueSgkb3B0aW9uLCAkY2hpbGRyZW4pO1xuICAgICAgfVxuXG4gICAgICAkb3B0aW9ucy5wdXNoKCRvcHRpb24pO1xuICAgIH1cblxuICAgIHJldHVybiAkb3B0aW9ucztcbiAgfTtcblxuICByZXR1cm4gQXJyYXlBZGFwdGVyO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9kYXRhL2FqYXgnLFtcbiAgJy4vYXJyYXknLFxuICAnLi4vdXRpbHMnLFxuICAnanF1ZXJ5J1xuXSwgZnVuY3Rpb24gKEFycmF5QWRhcHRlciwgVXRpbHMsICQpIHtcbiAgZnVuY3Rpb24gQWpheEFkYXB0ZXIgKCRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5hamF4T3B0aW9ucyA9IHRoaXMuX2FwcGx5RGVmYXVsdHMob3B0aW9ucy5nZXQoJ2FqYXgnKSk7XG5cbiAgICBpZiAodGhpcy5hamF4T3B0aW9ucy5wcm9jZXNzUmVzdWx0cyAhPSBudWxsKSB7XG4gICAgICB0aGlzLnByb2Nlc3NSZXN1bHRzID0gdGhpcy5hamF4T3B0aW9ucy5wcm9jZXNzUmVzdWx0cztcbiAgICB9XG5cbiAgICBBamF4QWRhcHRlci5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCAkZWxlbWVudCwgb3B0aW9ucyk7XG4gIH1cblxuICBVdGlscy5FeHRlbmQoQWpheEFkYXB0ZXIsIEFycmF5QWRhcHRlcik7XG5cbiAgQWpheEFkYXB0ZXIucHJvdG90eXBlLl9hcHBseURlZmF1bHRzID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICBkYXRhOiBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIHJldHVybiAkLmV4dGVuZCh7fSwgcGFyYW1zLCB7XG4gICAgICAgICAgcTogcGFyYW1zLnRlcm1cbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgdHJhbnNwb3J0OiBmdW5jdGlvbiAocGFyYW1zLCBzdWNjZXNzLCBmYWlsdXJlKSB7XG4gICAgICAgIHZhciAkcmVxdWVzdCA9ICQuYWpheChwYXJhbXMpO1xuXG4gICAgICAgICRyZXF1ZXN0LnRoZW4oc3VjY2Vzcyk7XG4gICAgICAgICRyZXF1ZXN0LmZhaWwoZmFpbHVyZSk7XG5cbiAgICAgICAgcmV0dXJuICRyZXF1ZXN0O1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gJC5leHRlbmQoe30sIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlKTtcbiAgfTtcblxuICBBamF4QWRhcHRlci5wcm90b3R5cGUucHJvY2Vzc1Jlc3VsdHMgPSBmdW5jdGlvbiAocmVzdWx0cykge1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIEFqYXhBZGFwdGVyLnByb3RvdHlwZS5xdWVyeSA9IGZ1bmN0aW9uIChwYXJhbXMsIGNhbGxiYWNrKSB7XG4gICAgdmFyIG1hdGNoZXMgPSBbXTtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAodGhpcy5fcmVxdWVzdCAhPSBudWxsKSB7XG4gICAgICAvLyBKU09OUCByZXF1ZXN0cyBjYW5ub3QgYWx3YXlzIGJlIGFib3J0ZWRcbiAgICAgIGlmICgkLmlzRnVuY3Rpb24odGhpcy5fcmVxdWVzdC5hYm9ydCkpIHtcbiAgICAgICAgdGhpcy5fcmVxdWVzdC5hYm9ydCgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9yZXF1ZXN0ID0gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgb3B0aW9ucyA9ICQuZXh0ZW5kKHtcbiAgICAgIHR5cGU6ICdHRVQnXG4gICAgfSwgdGhpcy5hamF4T3B0aW9ucyk7XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMudXJsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBvcHRpb25zLnVybCA9IG9wdGlvbnMudXJsLmNhbGwodGhpcy4kZWxlbWVudCwgcGFyYW1zKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuZGF0YSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgb3B0aW9ucy5kYXRhID0gb3B0aW9ucy5kYXRhLmNhbGwodGhpcy4kZWxlbWVudCwgcGFyYW1zKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXF1ZXN0ICgpIHtcbiAgICAgIHZhciAkcmVxdWVzdCA9IG9wdGlvbnMudHJhbnNwb3J0KG9wdGlvbnMsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHZhciByZXN1bHRzID0gc2VsZi5wcm9jZXNzUmVzdWx0cyhkYXRhLCBwYXJhbXMpO1xuXG4gICAgICAgIGlmIChzZWxmLm9wdGlvbnMuZ2V0KCdkZWJ1ZycpICYmIHdpbmRvdy5jb25zb2xlICYmIGNvbnNvbGUuZXJyb3IpIHtcbiAgICAgICAgICAvLyBDaGVjayB0byBtYWtlIHN1cmUgdGhhdCB0aGUgcmVzcG9uc2UgaW5jbHVkZWQgYSBgcmVzdWx0c2Aga2V5LlxuICAgICAgICAgIGlmICghcmVzdWx0cyB8fCAhcmVzdWx0cy5yZXN1bHRzIHx8ICEkLmlzQXJyYXkocmVzdWx0cy5yZXN1bHRzKSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgJ1NlbGVjdDI6IFRoZSBBSkFYIHJlc3VsdHMgZGlkIG5vdCByZXR1cm4gYW4gYXJyYXkgaW4gdGhlICcgK1xuICAgICAgICAgICAgICAnYHJlc3VsdHNgIGtleSBvZiB0aGUgcmVzcG9uc2UuJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjYWxsYmFjayhyZXN1bHRzKTtcbiAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gQXR0ZW1wdCB0byBkZXRlY3QgaWYgYSByZXF1ZXN0IHdhcyBhYm9ydGVkXG4gICAgICAgIC8vIE9ubHkgd29ya3MgaWYgdGhlIHRyYW5zcG9ydCBleHBvc2VzIGEgc3RhdHVzIHByb3BlcnR5XG4gICAgICAgIGlmICgkcmVxdWVzdC5zdGF0dXMgJiYgJHJlcXVlc3Quc3RhdHVzID09PSAnMCcpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLnRyaWdnZXIoJ3Jlc3VsdHM6bWVzc2FnZScsIHtcbiAgICAgICAgICBtZXNzYWdlOiAnZXJyb3JMb2FkaW5nJ1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBzZWxmLl9yZXF1ZXN0ID0gJHJlcXVlc3Q7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYWpheE9wdGlvbnMuZGVsYXkgJiYgcGFyYW1zLnRlcm0gIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuX3F1ZXJ5VGltZW91dCkge1xuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuX3F1ZXJ5VGltZW91dCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3F1ZXJ5VGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KHJlcXVlc3QsIHRoaXMuYWpheE9wdGlvbnMuZGVsYXkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXF1ZXN0KCk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBBamF4QWRhcHRlcjtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZGF0YS90YWdzJyxbXG4gICdqcXVlcnknXG5dLCBmdW5jdGlvbiAoJCkge1xuICBmdW5jdGlvbiBUYWdzIChkZWNvcmF0ZWQsICRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdmFyIHRhZ3MgPSBvcHRpb25zLmdldCgndGFncycpO1xuXG4gICAgdmFyIGNyZWF0ZVRhZyA9IG9wdGlvbnMuZ2V0KCdjcmVhdGVUYWcnKTtcblxuICAgIGlmIChjcmVhdGVUYWcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5jcmVhdGVUYWcgPSBjcmVhdGVUYWc7XG4gICAgfVxuXG4gICAgdmFyIGluc2VydFRhZyA9IG9wdGlvbnMuZ2V0KCdpbnNlcnRUYWcnKTtcblxuICAgIGlmIChpbnNlcnRUYWcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmluc2VydFRhZyA9IGluc2VydFRhZztcbiAgICB9XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCAkZWxlbWVudCwgb3B0aW9ucyk7XG5cbiAgICBpZiAoJC5pc0FycmF5KHRhZ3MpKSB7XG4gICAgICBmb3IgKHZhciB0ID0gMDsgdCA8IHRhZ3MubGVuZ3RoOyB0KyspIHtcbiAgICAgICAgdmFyIHRhZyA9IHRhZ3NbdF07XG4gICAgICAgIHZhciBpdGVtID0gdGhpcy5fbm9ybWFsaXplSXRlbSh0YWcpO1xuXG4gICAgICAgIHZhciAkb3B0aW9uID0gdGhpcy5vcHRpb24oaXRlbSk7XG5cbiAgICAgICAgdGhpcy4kZWxlbWVudC5hcHBlbmQoJG9wdGlvbik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgVGFncy5wcm90b3R5cGUucXVlcnkgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBwYXJhbXMsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdGhpcy5fcmVtb3ZlT2xkVGFncygpO1xuXG4gICAgaWYgKHBhcmFtcy50ZXJtID09IG51bGwgfHwgcGFyYW1zLnBhZ2UgIT0gbnVsbCkge1xuICAgICAgZGVjb3JhdGVkLmNhbGwodGhpcywgcGFyYW1zLCBjYWxsYmFjayk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd3JhcHBlciAob2JqLCBjaGlsZCkge1xuICAgICAgdmFyIGRhdGEgPSBvYmoucmVzdWx0cztcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBvcHRpb24gPSBkYXRhW2ldO1xuXG4gICAgICAgIHZhciBjaGVja0NoaWxkcmVuID0gKFxuICAgICAgICAgIG9wdGlvbi5jaGlsZHJlbiAhPSBudWxsICYmXG4gICAgICAgICAgIXdyYXBwZXIoe1xuICAgICAgICAgICAgcmVzdWx0czogb3B0aW9uLmNoaWxkcmVuXG4gICAgICAgICAgfSwgdHJ1ZSlcbiAgICAgICAgKTtcblxuICAgICAgICB2YXIgY2hlY2tUZXh0ID0gb3B0aW9uLnRleHQgPT09IHBhcmFtcy50ZXJtO1xuXG4gICAgICAgIGlmIChjaGVja1RleHQgfHwgY2hlY2tDaGlsZHJlbikge1xuICAgICAgICAgIGlmIChjaGlsZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG9iai5kYXRhID0gZGF0YTtcbiAgICAgICAgICBjYWxsYmFjayhvYmopO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChjaGlsZCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIHRhZyA9IHNlbGYuY3JlYXRlVGFnKHBhcmFtcyk7XG5cbiAgICAgIGlmICh0YWcgIT0gbnVsbCkge1xuICAgICAgICB2YXIgJG9wdGlvbiA9IHNlbGYub3B0aW9uKHRhZyk7XG4gICAgICAgICRvcHRpb24uYXR0cignZGF0YS1zZWxlY3QyLXRhZycsIHRydWUpO1xuXG4gICAgICAgIHNlbGYuYWRkT3B0aW9ucyhbJG9wdGlvbl0pO1xuXG4gICAgICAgIHNlbGYuaW5zZXJ0VGFnKGRhdGEsIHRhZyk7XG4gICAgICB9XG5cbiAgICAgIG9iai5yZXN1bHRzID0gZGF0YTtcblxuICAgICAgY2FsbGJhY2sob2JqKTtcbiAgICB9XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBwYXJhbXMsIHdyYXBwZXIpO1xuICB9O1xuXG4gIFRhZ3MucHJvdG90eXBlLmNyZWF0ZVRhZyA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIHBhcmFtcykge1xuICAgIHZhciB0ZXJtID0gJC50cmltKHBhcmFtcy50ZXJtKTtcblxuICAgIGlmICh0ZXJtID09PSAnJykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiB0ZXJtLFxuICAgICAgdGV4dDogdGVybVxuICAgIH07XG4gIH07XG5cbiAgVGFncy5wcm90b3R5cGUuaW5zZXJ0VGFnID0gZnVuY3Rpb24gKF8sIGRhdGEsIHRhZykge1xuICAgIGRhdGEudW5zaGlmdCh0YWcpO1xuICB9O1xuXG4gIFRhZ3MucHJvdG90eXBlLl9yZW1vdmVPbGRUYWdzID0gZnVuY3Rpb24gKF8pIHtcbiAgICB2YXIgdGFnID0gdGhpcy5fbGFzdFRhZztcblxuICAgIHZhciAkb3B0aW9ucyA9IHRoaXMuJGVsZW1lbnQuZmluZCgnb3B0aW9uW2RhdGEtc2VsZWN0Mi10YWddJyk7XG5cbiAgICAkb3B0aW9ucy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgJCh0aGlzKS5yZW1vdmUoKTtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gVGFncztcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZGF0YS90b2tlbml6ZXInLFtcbiAgJ2pxdWVyeSdcbl0sIGZ1bmN0aW9uICgkKSB7XG4gIGZ1bmN0aW9uIFRva2VuaXplciAoZGVjb3JhdGVkLCAkZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHZhciB0b2tlbml6ZXIgPSBvcHRpb25zLmdldCgndG9rZW5pemVyJyk7XG5cbiAgICBpZiAodG9rZW5pemVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMudG9rZW5pemVyID0gdG9rZW5pemVyO1xuICAgIH1cblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsICRlbGVtZW50LCBvcHRpb25zKTtcbiAgfVxuXG4gIFRva2VuaXplci5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGNvbnRhaW5lciwgJGNvbnRhaW5lcik7XG5cbiAgICB0aGlzLiRzZWFyY2ggPSAgY29udGFpbmVyLmRyb3Bkb3duLiRzZWFyY2ggfHwgY29udGFpbmVyLnNlbGVjdGlvbi4kc2VhcmNoIHx8XG4gICAgICAkY29udGFpbmVyLmZpbmQoJy5zZWxlY3QyLXNlYXJjaF9fZmllbGQnKTtcbiAgfTtcblxuICBUb2tlbml6ZXIucHJvdG90eXBlLnF1ZXJ5ID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgcGFyYW1zLCBjYWxsYmFjaykge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUFuZFNlbGVjdCAoZGF0YSkge1xuICAgICAgLy8gTm9ybWFsaXplIHRoZSBkYXRhIG9iamVjdCBzbyB3ZSBjYW4gdXNlIGl0IGZvciBjaGVja3NcbiAgICAgIHZhciBpdGVtID0gc2VsZi5fbm9ybWFsaXplSXRlbShkYXRhKTtcblxuICAgICAgLy8gQ2hlY2sgaWYgdGhlIGRhdGEgb2JqZWN0IGFscmVhZHkgZXhpc3RzIGFzIGEgdGFnXG4gICAgICAvLyBTZWxlY3QgaXQgaWYgaXQgZG9lc24ndFxuICAgICAgdmFyICRleGlzdGluZ09wdGlvbnMgPSBzZWxmLiRlbGVtZW50LmZpbmQoJ29wdGlvbicpLmZpbHRlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAkKHRoaXMpLnZhbCgpID09PSBpdGVtLmlkO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIElmIGFuIGV4aXN0aW5nIG9wdGlvbiB3YXNuJ3QgZm91bmQgZm9yIGl0LCBjcmVhdGUgdGhlIG9wdGlvblxuICAgICAgaWYgKCEkZXhpc3RpbmdPcHRpb25zLmxlbmd0aCkge1xuICAgICAgICB2YXIgJG9wdGlvbiA9IHNlbGYub3B0aW9uKGl0ZW0pO1xuICAgICAgICAkb3B0aW9uLmF0dHIoJ2RhdGEtc2VsZWN0Mi10YWcnLCB0cnVlKTtcblxuICAgICAgICBzZWxmLl9yZW1vdmVPbGRUYWdzKCk7XG4gICAgICAgIHNlbGYuYWRkT3B0aW9ucyhbJG9wdGlvbl0pO1xuICAgICAgfVxuXG4gICAgICAvLyBTZWxlY3QgdGhlIGl0ZW0sIG5vdyB0aGF0IHdlIGtub3cgdGhlcmUgaXMgYW4gb3B0aW9uIGZvciBpdFxuICAgICAgc2VsZWN0KGl0ZW0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNlbGVjdCAoZGF0YSkge1xuICAgICAgc2VsZi50cmlnZ2VyKCdzZWxlY3QnLCB7XG4gICAgICAgIGRhdGE6IGRhdGFcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHBhcmFtcy50ZXJtID0gcGFyYW1zLnRlcm0gfHwgJyc7XG5cbiAgICB2YXIgdG9rZW5EYXRhID0gdGhpcy50b2tlbml6ZXIocGFyYW1zLCB0aGlzLm9wdGlvbnMsIGNyZWF0ZUFuZFNlbGVjdCk7XG5cbiAgICBpZiAodG9rZW5EYXRhLnRlcm0gIT09IHBhcmFtcy50ZXJtKSB7XG4gICAgICAvLyBSZXBsYWNlIHRoZSBzZWFyY2ggdGVybSBpZiB3ZSBoYXZlIHRoZSBzZWFyY2ggYm94XG4gICAgICBpZiAodGhpcy4kc2VhcmNoLmxlbmd0aCkge1xuICAgICAgICB0aGlzLiRzZWFyY2gudmFsKHRva2VuRGF0YS50ZXJtKTtcbiAgICAgICAgdGhpcy4kc2VhcmNoLmZvY3VzKCk7XG4gICAgICB9XG5cbiAgICAgIHBhcmFtcy50ZXJtID0gdG9rZW5EYXRhLnRlcm07XG4gICAgfVxuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgcGFyYW1zLCBjYWxsYmFjayk7XG4gIH07XG5cbiAgVG9rZW5pemVyLnByb3RvdHlwZS50b2tlbml6ZXIgPSBmdW5jdGlvbiAoXywgcGFyYW1zLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIHZhciBzZXBhcmF0b3JzID0gb3B0aW9ucy5nZXQoJ3Rva2VuU2VwYXJhdG9ycycpIHx8IFtdO1xuICAgIHZhciB0ZXJtID0gcGFyYW1zLnRlcm07XG4gICAgdmFyIGkgPSAwO1xuXG4gICAgdmFyIGNyZWF0ZVRhZyA9IHRoaXMuY3JlYXRlVGFnIHx8IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkOiBwYXJhbXMudGVybSxcbiAgICAgICAgdGV4dDogcGFyYW1zLnRlcm1cbiAgICAgIH07XG4gICAgfTtcblxuICAgIHdoaWxlIChpIDwgdGVybS5sZW5ndGgpIHtcbiAgICAgIHZhciB0ZXJtQ2hhciA9IHRlcm1baV07XG5cbiAgICAgIGlmICgkLmluQXJyYXkodGVybUNoYXIsIHNlcGFyYXRvcnMpID09PSAtMSkge1xuICAgICAgICBpKys7XG5cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHZhciBwYXJ0ID0gdGVybS5zdWJzdHIoMCwgaSk7XG4gICAgICB2YXIgcGFydFBhcmFtcyA9ICQuZXh0ZW5kKHt9LCBwYXJhbXMsIHtcbiAgICAgICAgdGVybTogcGFydFxuICAgICAgfSk7XG5cbiAgICAgIHZhciBkYXRhID0gY3JlYXRlVGFnKHBhcnRQYXJhbXMpO1xuXG4gICAgICBpZiAoZGF0YSA9PSBudWxsKSB7XG4gICAgICAgIGkrKztcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNhbGxiYWNrKGRhdGEpO1xuXG4gICAgICAvLyBSZXNldCB0aGUgdGVybSB0byBub3QgaW5jbHVkZSB0aGUgdG9rZW5pemVkIHBvcnRpb25cbiAgICAgIHRlcm0gPSB0ZXJtLnN1YnN0cihpICsgMSkgfHwgJyc7XG4gICAgICBpID0gMDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdGVybTogdGVybVxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIFRva2VuaXplcjtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZGF0YS9taW5pbXVtSW5wdXRMZW5ndGgnLFtcblxuXSwgZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBNaW5pbXVtSW5wdXRMZW5ndGggKGRlY29yYXRlZCwgJGUsIG9wdGlvbnMpIHtcbiAgICB0aGlzLm1pbmltdW1JbnB1dExlbmd0aCA9IG9wdGlvbnMuZ2V0KCdtaW5pbXVtSW5wdXRMZW5ndGgnKTtcblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsICRlLCBvcHRpb25zKTtcbiAgfVxuXG4gIE1pbmltdW1JbnB1dExlbmd0aC5wcm90b3R5cGUucXVlcnkgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBwYXJhbXMsIGNhbGxiYWNrKSB7XG4gICAgcGFyYW1zLnRlcm0gPSBwYXJhbXMudGVybSB8fCAnJztcblxuICAgIGlmIChwYXJhbXMudGVybS5sZW5ndGggPCB0aGlzLm1pbmltdW1JbnB1dExlbmd0aCkge1xuICAgICAgdGhpcy50cmlnZ2VyKCdyZXN1bHRzOm1lc3NhZ2UnLCB7XG4gICAgICAgIG1lc3NhZ2U6ICdpbnB1dFRvb1Nob3J0JyxcbiAgICAgICAgYXJnczoge1xuICAgICAgICAgIG1pbmltdW06IHRoaXMubWluaW11bUlucHV0TGVuZ3RoLFxuICAgICAgICAgIGlucHV0OiBwYXJhbXMudGVybSxcbiAgICAgICAgICBwYXJhbXM6IHBhcmFtc1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIHBhcmFtcywgY2FsbGJhY2spO1xuICB9O1xuXG4gIHJldHVybiBNaW5pbXVtSW5wdXRMZW5ndGg7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2RhdGEvbWF4aW11bUlucHV0TGVuZ3RoJyxbXG5cbl0sIGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gTWF4aW11bUlucHV0TGVuZ3RoIChkZWNvcmF0ZWQsICRlLCBvcHRpb25zKSB7XG4gICAgdGhpcy5tYXhpbXVtSW5wdXRMZW5ndGggPSBvcHRpb25zLmdldCgnbWF4aW11bUlucHV0TGVuZ3RoJyk7XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCAkZSwgb3B0aW9ucyk7XG4gIH1cblxuICBNYXhpbXVtSW5wdXRMZW5ndGgucHJvdG90eXBlLnF1ZXJ5ID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgcGFyYW1zLCBjYWxsYmFjaykge1xuICAgIHBhcmFtcy50ZXJtID0gcGFyYW1zLnRlcm0gfHwgJyc7XG5cbiAgICBpZiAodGhpcy5tYXhpbXVtSW5wdXRMZW5ndGggPiAwICYmXG4gICAgICAgIHBhcmFtcy50ZXJtLmxlbmd0aCA+IHRoaXMubWF4aW11bUlucHV0TGVuZ3RoKSB7XG4gICAgICB0aGlzLnRyaWdnZXIoJ3Jlc3VsdHM6bWVzc2FnZScsIHtcbiAgICAgICAgbWVzc2FnZTogJ2lucHV0VG9vTG9uZycsXG4gICAgICAgIGFyZ3M6IHtcbiAgICAgICAgICBtYXhpbXVtOiB0aGlzLm1heGltdW1JbnB1dExlbmd0aCxcbiAgICAgICAgICBpbnB1dDogcGFyYW1zLnRlcm0sXG4gICAgICAgICAgcGFyYW1zOiBwYXJhbXNcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBwYXJhbXMsIGNhbGxiYWNrKTtcbiAgfTtcblxuICByZXR1cm4gTWF4aW11bUlucHV0TGVuZ3RoO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9kYXRhL21heGltdW1TZWxlY3Rpb25MZW5ndGgnLFtcblxuXSwgZnVuY3Rpb24gKCl7XG4gIGZ1bmN0aW9uIE1heGltdW1TZWxlY3Rpb25MZW5ndGggKGRlY29yYXRlZCwgJGUsIG9wdGlvbnMpIHtcbiAgICB0aGlzLm1heGltdW1TZWxlY3Rpb25MZW5ndGggPSBvcHRpb25zLmdldCgnbWF4aW11bVNlbGVjdGlvbkxlbmd0aCcpO1xuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgJGUsIG9wdGlvbnMpO1xuICB9XG5cbiAgTWF4aW11bVNlbGVjdGlvbkxlbmd0aC5wcm90b3R5cGUucXVlcnkgPVxuICAgIGZ1bmN0aW9uIChkZWNvcmF0ZWQsIHBhcmFtcywgY2FsbGJhY2spIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgdGhpcy5jdXJyZW50KGZ1bmN0aW9uIChjdXJyZW50RGF0YSkge1xuICAgICAgICB2YXIgY291bnQgPSBjdXJyZW50RGF0YSAhPSBudWxsID8gY3VycmVudERhdGEubGVuZ3RoIDogMDtcbiAgICAgICAgaWYgKHNlbGYubWF4aW11bVNlbGVjdGlvbkxlbmd0aCA+IDAgJiZcbiAgICAgICAgICBjb3VudCA+PSBzZWxmLm1heGltdW1TZWxlY3Rpb25MZW5ndGgpIHtcbiAgICAgICAgICBzZWxmLnRyaWdnZXIoJ3Jlc3VsdHM6bWVzc2FnZScsIHtcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdtYXhpbXVtU2VsZWN0ZWQnLFxuICAgICAgICAgICAgYXJnczoge1xuICAgICAgICAgICAgICBtYXhpbXVtOiBzZWxmLm1heGltdW1TZWxlY3Rpb25MZW5ndGhcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZGVjb3JhdGVkLmNhbGwoc2VsZiwgcGFyYW1zLCBjYWxsYmFjayk7XG4gICAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gTWF4aW11bVNlbGVjdGlvbkxlbmd0aDtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZHJvcGRvd24nLFtcbiAgJ2pxdWVyeScsXG4gICcuL3V0aWxzJ1xuXSwgZnVuY3Rpb24gKCQsIFV0aWxzKSB7XG4gIGZ1bmN0aW9uIERyb3Bkb3duICgkZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuJGVsZW1lbnQgPSAkZWxlbWVudDtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgRHJvcGRvd24uX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcyk7XG4gIH1cblxuICBVdGlscy5FeHRlbmQoRHJvcGRvd24sIFV0aWxzLk9ic2VydmFibGUpO1xuXG4gIERyb3Bkb3duLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRkcm9wZG93biA9ICQoXG4gICAgICAnPHNwYW4gY2xhc3M9XCJzZWxlY3QyLWRyb3Bkb3duXCI+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cInNlbGVjdDItcmVzdWx0c1wiPjwvc3Bhbj4nICtcbiAgICAgICc8L3NwYW4+J1xuICAgICk7XG5cbiAgICAkZHJvcGRvd24uYXR0cignZGlyJywgdGhpcy5vcHRpb25zLmdldCgnZGlyJykpO1xuXG4gICAgdGhpcy4kZHJvcGRvd24gPSAkZHJvcGRvd247XG5cbiAgICByZXR1cm4gJGRyb3Bkb3duO1xuICB9O1xuXG4gIERyb3Bkb3duLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIFNob3VsZCBiZSBpbXBsZW1lbnRlZCBpbiBzdWJjbGFzc2VzXG4gIH07XG5cbiAgRHJvcGRvd24ucHJvdG90eXBlLnBvc2l0aW9uID0gZnVuY3Rpb24gKCRkcm9wZG93biwgJGNvbnRhaW5lcikge1xuICAgIC8vIFNob3VsZCBiZSBpbXBsbWVudGVkIGluIHN1YmNsYXNzZXNcbiAgfTtcblxuICBEcm9wZG93bi5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBSZW1vdmUgdGhlIGRyb3Bkb3duIGZyb20gdGhlIERPTVxuICAgIHRoaXMuJGRyb3Bkb3duLnJlbW92ZSgpO1xuICB9O1xuXG4gIHJldHVybiBEcm9wZG93bjtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZHJvcGRvd24vc2VhcmNoJyxbXG4gICdqcXVlcnknLFxuICAnLi4vdXRpbHMnXG5dLCBmdW5jdGlvbiAoJCwgVXRpbHMpIHtcbiAgZnVuY3Rpb24gU2VhcmNoICgpIHsgfVxuXG4gIFNlYXJjaC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKGRlY29yYXRlZCkge1xuICAgIHZhciAkcmVuZGVyZWQgPSBkZWNvcmF0ZWQuY2FsbCh0aGlzKTtcblxuICAgIHZhciAkc2VhcmNoID0gJChcbiAgICAgICc8c3BhbiBjbGFzcz1cInNlbGVjdDItc2VhcmNoIHNlbGVjdDItc2VhcmNoLS1kcm9wZG93blwiPicgK1xuICAgICAgICAnPGlucHV0IGNsYXNzPVwic2VsZWN0Mi1zZWFyY2hfX2ZpZWxkXCIgdHlwZT1cInNlYXJjaFwiIHRhYmluZGV4PVwiLTFcIicgK1xuICAgICAgICAnIGF1dG9jb21wbGV0ZT1cIm9mZlwiIGF1dG9jb3JyZWN0PVwib2ZmXCIgYXV0b2NhcGl0YWxpemU9XCJvZmZcIicgK1xuICAgICAgICAnIHNwZWxsY2hlY2s9XCJmYWxzZVwiIHJvbGU9XCJ0ZXh0Ym94XCIgLz4nICtcbiAgICAgICc8L3NwYW4+J1xuICAgICk7XG5cbiAgICB0aGlzLiRzZWFyY2hDb250YWluZXIgPSAkc2VhcmNoO1xuICAgIHRoaXMuJHNlYXJjaCA9ICRzZWFyY2guZmluZCgnaW5wdXQnKTtcblxuICAgICRyZW5kZXJlZC5wcmVwZW5kKCRzZWFyY2gpO1xuXG4gICAgcmV0dXJuICRyZW5kZXJlZDtcbiAgfTtcblxuICBTZWFyY2gucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBjb250YWluZXIsICRjb250YWluZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBjb250YWluZXIsICRjb250YWluZXIpO1xuXG4gICAgdGhpcy4kc2VhcmNoLm9uKCdrZXlkb3duJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgc2VsZi50cmlnZ2VyKCdrZXlwcmVzcycsIGV2dCk7XG5cbiAgICAgIHNlbGYuX2tleVVwUHJldmVudGVkID0gZXZ0LmlzRGVmYXVsdFByZXZlbnRlZCgpO1xuICAgIH0pO1xuXG4gICAgLy8gV29ya2Fyb3VuZCBmb3IgYnJvd3NlcnMgd2hpY2ggZG8gbm90IHN1cHBvcnQgdGhlIGBpbnB1dGAgZXZlbnRcbiAgICAvLyBUaGlzIHdpbGwgcHJldmVudCBkb3VibGUtdHJpZ2dlcmluZyBvZiBldmVudHMgZm9yIGJyb3dzZXJzIHdoaWNoIHN1cHBvcnRcbiAgICAvLyBib3RoIHRoZSBga2V5dXBgIGFuZCBgaW5wdXRgIGV2ZW50cy5cbiAgICB0aGlzLiRzZWFyY2gub24oJ2lucHV0JywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgLy8gVW5iaW5kIHRoZSBkdXBsaWNhdGVkIGBrZXl1cGAgZXZlbnRcbiAgICAgICQodGhpcykub2ZmKCdrZXl1cCcpO1xuICAgIH0pO1xuXG4gICAgdGhpcy4kc2VhcmNoLm9uKCdrZXl1cCBpbnB1dCcsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIHNlbGYuaGFuZGxlU2VhcmNoKGV2dCk7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ29wZW4nLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLiRzZWFyY2guYXR0cigndGFiaW5kZXgnLCAwKTtcblxuICAgICAgc2VsZi4kc2VhcmNoLmZvY3VzKCk7XG5cbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi4kc2VhcmNoLmZvY3VzKCk7XG4gICAgICB9LCAwKTtcbiAgICB9KTtcblxuICAgIGNvbnRhaW5lci5vbignY2xvc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLiRzZWFyY2guYXR0cigndGFiaW5kZXgnLCAtMSk7XG5cbiAgICAgIHNlbGYuJHNlYXJjaC52YWwoJycpO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdmb2N1cycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChjb250YWluZXIuaXNPcGVuKCkpIHtcbiAgICAgICAgc2VsZi4kc2VhcmNoLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ3Jlc3VsdHM6YWxsJywgZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgaWYgKHBhcmFtcy5xdWVyeS50ZXJtID09IG51bGwgfHwgcGFyYW1zLnF1ZXJ5LnRlcm0gPT09ICcnKSB7XG4gICAgICAgIHZhciBzaG93U2VhcmNoID0gc2VsZi5zaG93U2VhcmNoKHBhcmFtcyk7XG5cbiAgICAgICAgaWYgKHNob3dTZWFyY2gpIHtcbiAgICAgICAgICBzZWxmLiRzZWFyY2hDb250YWluZXIucmVtb3ZlQ2xhc3MoJ3NlbGVjdDItc2VhcmNoLS1oaWRlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VsZi4kc2VhcmNoQ29udGFpbmVyLmFkZENsYXNzKCdzZWxlY3QyLXNlYXJjaC0taGlkZScpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgU2VhcmNoLnByb3RvdHlwZS5oYW5kbGVTZWFyY2ggPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgaWYgKCF0aGlzLl9rZXlVcFByZXZlbnRlZCkge1xuICAgICAgdmFyIGlucHV0ID0gdGhpcy4kc2VhcmNoLnZhbCgpO1xuXG4gICAgICB0aGlzLnRyaWdnZXIoJ3F1ZXJ5Jywge1xuICAgICAgICB0ZXJtOiBpbnB1dFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5fa2V5VXBQcmV2ZW50ZWQgPSBmYWxzZTtcbiAgfTtcblxuICBTZWFyY2gucHJvdG90eXBlLnNob3dTZWFyY2ggPSBmdW5jdGlvbiAoXywgcGFyYW1zKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgcmV0dXJuIFNlYXJjaDtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZHJvcGRvd24vaGlkZVBsYWNlaG9sZGVyJyxbXG5cbl0sIGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gSGlkZVBsYWNlaG9sZGVyIChkZWNvcmF0ZWQsICRlbGVtZW50LCBvcHRpb25zLCBkYXRhQWRhcHRlcikge1xuICAgIHRoaXMucGxhY2Vob2xkZXIgPSB0aGlzLm5vcm1hbGl6ZVBsYWNlaG9sZGVyKG9wdGlvbnMuZ2V0KCdwbGFjZWhvbGRlcicpKTtcblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsICRlbGVtZW50LCBvcHRpb25zLCBkYXRhQWRhcHRlcik7XG4gIH1cblxuICBIaWRlUGxhY2Vob2xkZXIucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGRhdGEpIHtcbiAgICBkYXRhLnJlc3VsdHMgPSB0aGlzLnJlbW92ZVBsYWNlaG9sZGVyKGRhdGEucmVzdWx0cyk7XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBkYXRhKTtcbiAgfTtcblxuICBIaWRlUGxhY2Vob2xkZXIucHJvdG90eXBlLm5vcm1hbGl6ZVBsYWNlaG9sZGVyID0gZnVuY3Rpb24gKF8sIHBsYWNlaG9sZGVyKSB7XG4gICAgaWYgKHR5cGVvZiBwbGFjZWhvbGRlciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHBsYWNlaG9sZGVyID0ge1xuICAgICAgICBpZDogJycsXG4gICAgICAgIHRleHQ6IHBsYWNlaG9sZGVyXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBwbGFjZWhvbGRlcjtcbiAgfTtcblxuICBIaWRlUGxhY2Vob2xkZXIucHJvdG90eXBlLnJlbW92ZVBsYWNlaG9sZGVyID0gZnVuY3Rpb24gKF8sIGRhdGEpIHtcbiAgICB2YXIgbW9kaWZpZWREYXRhID0gZGF0YS5zbGljZSgwKTtcblxuICAgIGZvciAodmFyIGQgPSBkYXRhLmxlbmd0aCAtIDE7IGQgPj0gMDsgZC0tKSB7XG4gICAgICB2YXIgaXRlbSA9IGRhdGFbZF07XG5cbiAgICAgIGlmICh0aGlzLnBsYWNlaG9sZGVyLmlkID09PSBpdGVtLmlkKSB7XG4gICAgICAgIG1vZGlmaWVkRGF0YS5zcGxpY2UoZCwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vZGlmaWVkRGF0YTtcbiAgfTtcblxuICByZXR1cm4gSGlkZVBsYWNlaG9sZGVyO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9kcm9wZG93bi9pbmZpbml0ZVNjcm9sbCcsW1xuICAnanF1ZXJ5J1xuXSwgZnVuY3Rpb24gKCQpIHtcbiAgZnVuY3Rpb24gSW5maW5pdGVTY3JvbGwgKGRlY29yYXRlZCwgJGVsZW1lbnQsIG9wdGlvbnMsIGRhdGFBZGFwdGVyKSB7XG4gICAgdGhpcy5sYXN0UGFyYW1zID0ge307XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCAkZWxlbWVudCwgb3B0aW9ucywgZGF0YUFkYXB0ZXIpO1xuXG4gICAgdGhpcy4kbG9hZGluZ01vcmUgPSB0aGlzLmNyZWF0ZUxvYWRpbmdNb3JlKCk7XG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gIH1cblxuICBJbmZpbml0ZVNjcm9sbC5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgZGF0YSkge1xuICAgIHRoaXMuJGxvYWRpbmdNb3JlLnJlbW92ZSgpO1xuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgZGF0YSk7XG5cbiAgICBpZiAodGhpcy5zaG93TG9hZGluZ01vcmUoZGF0YSkpIHtcbiAgICAgIHRoaXMuJHJlc3VsdHMuYXBwZW5kKHRoaXMuJGxvYWRpbmdNb3JlKTtcbiAgICB9XG4gIH07XG5cbiAgSW5maW5pdGVTY3JvbGwucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBjb250YWluZXIsICRjb250YWluZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBjb250YWluZXIsICRjb250YWluZXIpO1xuXG4gICAgY29udGFpbmVyLm9uKCdxdWVyeScsIGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgIHNlbGYubGFzdFBhcmFtcyA9IHBhcmFtcztcbiAgICAgIHNlbGYubG9hZGluZyA9IHRydWU7XG4gICAgfSk7XG5cbiAgICBjb250YWluZXIub24oJ3F1ZXJ5OmFwcGVuZCcsIGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgIHNlbGYubGFzdFBhcmFtcyA9IHBhcmFtcztcbiAgICAgIHNlbGYubG9hZGluZyA9IHRydWU7XG4gICAgfSk7XG5cbiAgICB0aGlzLiRyZXN1bHRzLm9uKCdzY3JvbGwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgaXNMb2FkTW9yZVZpc2libGUgPSAkLmNvbnRhaW5zKFxuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG4gICAgICAgIHNlbGYuJGxvYWRpbmdNb3JlWzBdXG4gICAgICApO1xuXG4gICAgICBpZiAoc2VsZi5sb2FkaW5nIHx8ICFpc0xvYWRNb3JlVmlzaWJsZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBjdXJyZW50T2Zmc2V0ID0gc2VsZi4kcmVzdWx0cy5vZmZzZXQoKS50b3AgK1xuICAgICAgICBzZWxmLiRyZXN1bHRzLm91dGVySGVpZ2h0KGZhbHNlKTtcbiAgICAgIHZhciBsb2FkaW5nTW9yZU9mZnNldCA9IHNlbGYuJGxvYWRpbmdNb3JlLm9mZnNldCgpLnRvcCArXG4gICAgICAgIHNlbGYuJGxvYWRpbmdNb3JlLm91dGVySGVpZ2h0KGZhbHNlKTtcblxuICAgICAgaWYgKGN1cnJlbnRPZmZzZXQgKyA1MCA+PSBsb2FkaW5nTW9yZU9mZnNldCkge1xuICAgICAgICBzZWxmLmxvYWRNb3JlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgSW5maW5pdGVTY3JvbGwucHJvdG90eXBlLmxvYWRNb3JlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubG9hZGluZyA9IHRydWU7XG5cbiAgICB2YXIgcGFyYW1zID0gJC5leHRlbmQoe30sIHtwYWdlOiAxfSwgdGhpcy5sYXN0UGFyYW1zKTtcblxuICAgIHBhcmFtcy5wYWdlKys7XG5cbiAgICB0aGlzLnRyaWdnZXIoJ3F1ZXJ5OmFwcGVuZCcsIHBhcmFtcyk7XG4gIH07XG5cbiAgSW5maW5pdGVTY3JvbGwucHJvdG90eXBlLnNob3dMb2FkaW5nTW9yZSA9IGZ1bmN0aW9uIChfLCBkYXRhKSB7XG4gICAgcmV0dXJuIGRhdGEucGFnaW5hdGlvbiAmJiBkYXRhLnBhZ2luYXRpb24ubW9yZTtcbiAgfTtcblxuICBJbmZpbml0ZVNjcm9sbC5wcm90b3R5cGUuY3JlYXRlTG9hZGluZ01vcmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRvcHRpb24gPSAkKFxuICAgICAgJzxsaSAnICtcbiAgICAgICdjbGFzcz1cInNlbGVjdDItcmVzdWx0c19fb3B0aW9uIHNlbGVjdDItcmVzdWx0c19fb3B0aW9uLS1sb2FkLW1vcmVcIicgK1xuICAgICAgJ3JvbGU9XCJ0cmVlaXRlbVwiIGFyaWEtZGlzYWJsZWQ9XCJ0cnVlXCI+PC9saT4nXG4gICAgKTtcblxuICAgIHZhciBtZXNzYWdlID0gdGhpcy5vcHRpb25zLmdldCgndHJhbnNsYXRpb25zJykuZ2V0KCdsb2FkaW5nTW9yZScpO1xuXG4gICAgJG9wdGlvbi5odG1sKG1lc3NhZ2UodGhpcy5sYXN0UGFyYW1zKSk7XG5cbiAgICByZXR1cm4gJG9wdGlvbjtcbiAgfTtcblxuICByZXR1cm4gSW5maW5pdGVTY3JvbGw7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2Ryb3Bkb3duL2F0dGFjaEJvZHknLFtcbiAgJ2pxdWVyeScsXG4gICcuLi91dGlscydcbl0sIGZ1bmN0aW9uICgkLCBVdGlscykge1xuICBmdW5jdGlvbiBBdHRhY2hCb2R5IChkZWNvcmF0ZWQsICRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy4kZHJvcGRvd25QYXJlbnQgPSBvcHRpb25zLmdldCgnZHJvcGRvd25QYXJlbnQnKSB8fCAkKGRvY3VtZW50LmJvZHkpO1xuXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgJGVsZW1lbnQsIG9wdGlvbnMpO1xuICB9XG5cbiAgQXR0YWNoQm9keS5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHZhciBzZXR1cFJlc3VsdHNFdmVudHMgPSBmYWxzZTtcblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGNvbnRhaW5lciwgJGNvbnRhaW5lcik7XG5cbiAgICBjb250YWluZXIub24oJ29wZW4nLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl9zaG93RHJvcGRvd24oKTtcbiAgICAgIHNlbGYuX2F0dGFjaFBvc2l0aW9uaW5nSGFuZGxlcihjb250YWluZXIpO1xuXG4gICAgICBpZiAoIXNldHVwUmVzdWx0c0V2ZW50cykge1xuICAgICAgICBzZXR1cFJlc3VsdHNFdmVudHMgPSB0cnVlO1xuXG4gICAgICAgIGNvbnRhaW5lci5vbigncmVzdWx0czphbGwnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2VsZi5fcG9zaXRpb25Ecm9wZG93bigpO1xuICAgICAgICAgIHNlbGYuX3Jlc2l6ZURyb3Bkb3duKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnRhaW5lci5vbigncmVzdWx0czphcHBlbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2VsZi5fcG9zaXRpb25Ecm9wZG93bigpO1xuICAgICAgICAgIHNlbGYuX3Jlc2l6ZURyb3Bkb3duKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCdjbG9zZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX2hpZGVEcm9wZG93bigpO1xuICAgICAgc2VsZi5fZGV0YWNoUG9zaXRpb25pbmdIYW5kbGVyKGNvbnRhaW5lcik7XG4gICAgfSk7XG5cbiAgICB0aGlzLiRkcm9wZG93bkNvbnRhaW5lci5vbignbW91c2Vkb3duJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0pO1xuICB9O1xuXG4gIEF0dGFjaEJvZHkucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoZGVjb3JhdGVkKSB7XG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLiRkcm9wZG93bkNvbnRhaW5lci5yZW1vdmUoKTtcbiAgfTtcblxuICBBdHRhY2hCb2R5LnByb3RvdHlwZS5wb3NpdGlvbiA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsICRkcm9wZG93biwgJGNvbnRhaW5lcikge1xuICAgIC8vIENsb25lIGFsbCBvZiB0aGUgY29udGFpbmVyIGNsYXNzZXNcbiAgICAkZHJvcGRvd24uYXR0cignY2xhc3MnLCAkY29udGFpbmVyLmF0dHIoJ2NsYXNzJykpO1xuXG4gICAgJGRyb3Bkb3duLnJlbW92ZUNsYXNzKCdzZWxlY3QyJyk7XG4gICAgJGRyb3Bkb3duLmFkZENsYXNzKCdzZWxlY3QyLWNvbnRhaW5lci0tb3BlbicpO1xuXG4gICAgJGRyb3Bkb3duLmNzcyh7XG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIHRvcDogLTk5OTk5OVxuICAgIH0pO1xuXG4gICAgdGhpcy4kY29udGFpbmVyID0gJGNvbnRhaW5lcjtcbiAgfTtcblxuICBBdHRhY2hCb2R5LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoZGVjb3JhdGVkKSB7XG4gICAgdmFyICRjb250YWluZXIgPSAkKCc8c3Bhbj48L3NwYW4+Jyk7XG5cbiAgICB2YXIgJGRyb3Bkb3duID0gZGVjb3JhdGVkLmNhbGwodGhpcyk7XG4gICAgJGNvbnRhaW5lci5hcHBlbmQoJGRyb3Bkb3duKTtcblxuICAgIHRoaXMuJGRyb3Bkb3duQ29udGFpbmVyID0gJGNvbnRhaW5lcjtcblxuICAgIHJldHVybiAkY29udGFpbmVyO1xuICB9O1xuXG4gIEF0dGFjaEJvZHkucHJvdG90eXBlLl9oaWRlRHJvcGRvd24gPSBmdW5jdGlvbiAoZGVjb3JhdGVkKSB7XG4gICAgdGhpcy4kZHJvcGRvd25Db250YWluZXIuZGV0YWNoKCk7XG4gIH07XG5cbiAgQXR0YWNoQm9keS5wcm90b3R5cGUuX2F0dGFjaFBvc2l0aW9uaW5nSGFuZGxlciA9XG4gICAgICBmdW5jdGlvbiAoZGVjb3JhdGVkLCBjb250YWluZXIpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgc2Nyb2xsRXZlbnQgPSAnc2Nyb2xsLnNlbGVjdDIuJyArIGNvbnRhaW5lci5pZDtcbiAgICB2YXIgcmVzaXplRXZlbnQgPSAncmVzaXplLnNlbGVjdDIuJyArIGNvbnRhaW5lci5pZDtcbiAgICB2YXIgb3JpZW50YXRpb25FdmVudCA9ICdvcmllbnRhdGlvbmNoYW5nZS5zZWxlY3QyLicgKyBjb250YWluZXIuaWQ7XG5cbiAgICB2YXIgJHdhdGNoZXJzID0gdGhpcy4kY29udGFpbmVyLnBhcmVudHMoKS5maWx0ZXIoVXRpbHMuaGFzU2Nyb2xsKTtcbiAgICAkd2F0Y2hlcnMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAkKHRoaXMpLmRhdGEoJ3NlbGVjdDItc2Nyb2xsLXBvc2l0aW9uJywge1xuICAgICAgICB4OiAkKHRoaXMpLnNjcm9sbExlZnQoKSxcbiAgICAgICAgeTogJCh0aGlzKS5zY3JvbGxUb3AoKVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAkd2F0Y2hlcnMub24oc2Nyb2xsRXZlbnQsIGZ1bmN0aW9uIChldikge1xuICAgICAgdmFyIHBvc2l0aW9uID0gJCh0aGlzKS5kYXRhKCdzZWxlY3QyLXNjcm9sbC1wb3NpdGlvbicpO1xuICAgICAgJCh0aGlzKS5zY3JvbGxUb3AocG9zaXRpb24ueSk7XG4gICAgfSk7XG5cbiAgICAkKHdpbmRvdykub24oc2Nyb2xsRXZlbnQgKyAnICcgKyByZXNpemVFdmVudCArICcgJyArIG9yaWVudGF0aW9uRXZlbnQsXG4gICAgICBmdW5jdGlvbiAoZSkge1xuICAgICAgc2VsZi5fcG9zaXRpb25Ecm9wZG93bigpO1xuICAgICAgc2VsZi5fcmVzaXplRHJvcGRvd24oKTtcbiAgICB9KTtcbiAgfTtcblxuICBBdHRhY2hCb2R5LnByb3RvdHlwZS5fZGV0YWNoUG9zaXRpb25pbmdIYW5kbGVyID1cbiAgICAgIGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGNvbnRhaW5lcikge1xuICAgIHZhciBzY3JvbGxFdmVudCA9ICdzY3JvbGwuc2VsZWN0Mi4nICsgY29udGFpbmVyLmlkO1xuICAgIHZhciByZXNpemVFdmVudCA9ICdyZXNpemUuc2VsZWN0Mi4nICsgY29udGFpbmVyLmlkO1xuICAgIHZhciBvcmllbnRhdGlvbkV2ZW50ID0gJ29yaWVudGF0aW9uY2hhbmdlLnNlbGVjdDIuJyArIGNvbnRhaW5lci5pZDtcblxuICAgIHZhciAkd2F0Y2hlcnMgPSB0aGlzLiRjb250YWluZXIucGFyZW50cygpLmZpbHRlcihVdGlscy5oYXNTY3JvbGwpO1xuICAgICR3YXRjaGVycy5vZmYoc2Nyb2xsRXZlbnQpO1xuXG4gICAgJCh3aW5kb3cpLm9mZihzY3JvbGxFdmVudCArICcgJyArIHJlc2l6ZUV2ZW50ICsgJyAnICsgb3JpZW50YXRpb25FdmVudCk7XG4gIH07XG5cbiAgQXR0YWNoQm9keS5wcm90b3R5cGUuX3Bvc2l0aW9uRHJvcGRvd24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICR3aW5kb3cgPSAkKHdpbmRvdyk7XG5cbiAgICB2YXIgaXNDdXJyZW50bHlBYm92ZSA9IHRoaXMuJGRyb3Bkb3duLmhhc0NsYXNzKCdzZWxlY3QyLWRyb3Bkb3duLS1hYm92ZScpO1xuICAgIHZhciBpc0N1cnJlbnRseUJlbG93ID0gdGhpcy4kZHJvcGRvd24uaGFzQ2xhc3MoJ3NlbGVjdDItZHJvcGRvd24tLWJlbG93Jyk7XG5cbiAgICB2YXIgbmV3RGlyZWN0aW9uID0gbnVsbDtcblxuICAgIHZhciBvZmZzZXQgPSB0aGlzLiRjb250YWluZXIub2Zmc2V0KCk7XG5cbiAgICBvZmZzZXQuYm90dG9tID0gb2Zmc2V0LnRvcCArIHRoaXMuJGNvbnRhaW5lci5vdXRlckhlaWdodChmYWxzZSk7XG5cbiAgICB2YXIgY29udGFpbmVyID0ge1xuICAgICAgaGVpZ2h0OiB0aGlzLiRjb250YWluZXIub3V0ZXJIZWlnaHQoZmFsc2UpXG4gICAgfTtcblxuICAgIGNvbnRhaW5lci50b3AgPSBvZmZzZXQudG9wO1xuICAgIGNvbnRhaW5lci5ib3R0b20gPSBvZmZzZXQudG9wICsgY29udGFpbmVyLmhlaWdodDtcblxuICAgIHZhciBkcm9wZG93biA9IHtcbiAgICAgIGhlaWdodDogdGhpcy4kZHJvcGRvd24ub3V0ZXJIZWlnaHQoZmFsc2UpXG4gICAgfTtcblxuICAgIHZhciB2aWV3cG9ydCA9IHtcbiAgICAgIHRvcDogJHdpbmRvdy5zY3JvbGxUb3AoKSxcbiAgICAgIGJvdHRvbTogJHdpbmRvdy5zY3JvbGxUb3AoKSArICR3aW5kb3cuaGVpZ2h0KClcbiAgICB9O1xuXG4gICAgdmFyIGVub3VnaFJvb21BYm92ZSA9IHZpZXdwb3J0LnRvcCA8IChvZmZzZXQudG9wIC0gZHJvcGRvd24uaGVpZ2h0KTtcbiAgICB2YXIgZW5vdWdoUm9vbUJlbG93ID0gdmlld3BvcnQuYm90dG9tID4gKG9mZnNldC5ib3R0b20gKyBkcm9wZG93bi5oZWlnaHQpO1xuXG4gICAgdmFyIGNzcyA9IHtcbiAgICAgIGxlZnQ6IG9mZnNldC5sZWZ0LFxuICAgICAgdG9wOiBjb250YWluZXIuYm90dG9tXG4gICAgfTtcblxuICAgIC8vIERldGVybWluZSB3aGF0IHRoZSBwYXJlbnQgZWxlbWVudCBpcyB0byB1c2UgZm9yIGNhbGNpdWxhdGluZyB0aGUgb2Zmc2V0XG4gICAgdmFyICRvZmZzZXRQYXJlbnQgPSB0aGlzLiRkcm9wZG93blBhcmVudDtcblxuICAgIC8vIEZvciBzdGF0aWNhbGx5IHBvc2l0b25lZCBlbGVtZW50cywgd2UgbmVlZCB0byBnZXQgdGhlIGVsZW1lbnRcbiAgICAvLyB0aGF0IGlzIGRldGVybWluaW5nIHRoZSBvZmZzZXRcbiAgICBpZiAoJG9mZnNldFBhcmVudC5jc3MoJ3Bvc2l0aW9uJykgPT09ICdzdGF0aWMnKSB7XG4gICAgICAkb2Zmc2V0UGFyZW50ID0gJG9mZnNldFBhcmVudC5vZmZzZXRQYXJlbnQoKTtcbiAgICB9XG5cbiAgICB2YXIgcGFyZW50T2Zmc2V0ID0gJG9mZnNldFBhcmVudC5vZmZzZXQoKTtcblxuICAgIGNzcy50b3AgLT0gcGFyZW50T2Zmc2V0LnRvcDtcbiAgICBjc3MubGVmdCAtPSBwYXJlbnRPZmZzZXQubGVmdDtcblxuICAgIGlmICghaXNDdXJyZW50bHlBYm92ZSAmJiAhaXNDdXJyZW50bHlCZWxvdykge1xuICAgICAgbmV3RGlyZWN0aW9uID0gJ2JlbG93JztcbiAgICB9XG5cbiAgICBpZiAoIWVub3VnaFJvb21CZWxvdyAmJiBlbm91Z2hSb29tQWJvdmUgJiYgIWlzQ3VycmVudGx5QWJvdmUpIHtcbiAgICAgIG5ld0RpcmVjdGlvbiA9ICdhYm92ZSc7XG4gICAgfSBlbHNlIGlmICghZW5vdWdoUm9vbUFib3ZlICYmIGVub3VnaFJvb21CZWxvdyAmJiBpc0N1cnJlbnRseUFib3ZlKSB7XG4gICAgICBuZXdEaXJlY3Rpb24gPSAnYmVsb3cnO1xuICAgIH1cblxuICAgIGlmIChuZXdEaXJlY3Rpb24gPT0gJ2Fib3ZlJyB8fFxuICAgICAgKGlzQ3VycmVudGx5QWJvdmUgJiYgbmV3RGlyZWN0aW9uICE9PSAnYmVsb3cnKSkge1xuICAgICAgY3NzLnRvcCA9IGNvbnRhaW5lci50b3AgLSBwYXJlbnRPZmZzZXQudG9wIC0gZHJvcGRvd24uaGVpZ2h0O1xuICAgIH1cblxuICAgIGlmIChuZXdEaXJlY3Rpb24gIT0gbnVsbCkge1xuICAgICAgdGhpcy4kZHJvcGRvd25cbiAgICAgICAgLnJlbW92ZUNsYXNzKCdzZWxlY3QyLWRyb3Bkb3duLS1iZWxvdyBzZWxlY3QyLWRyb3Bkb3duLS1hYm92ZScpXG4gICAgICAgIC5hZGRDbGFzcygnc2VsZWN0Mi1kcm9wZG93bi0tJyArIG5ld0RpcmVjdGlvbik7XG4gICAgICB0aGlzLiRjb250YWluZXJcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdzZWxlY3QyLWNvbnRhaW5lci0tYmVsb3cgc2VsZWN0Mi1jb250YWluZXItLWFib3ZlJylcbiAgICAgICAgLmFkZENsYXNzKCdzZWxlY3QyLWNvbnRhaW5lci0tJyArIG5ld0RpcmVjdGlvbik7XG4gICAgfVxuXG4gICAgdGhpcy4kZHJvcGRvd25Db250YWluZXIuY3NzKGNzcyk7XG4gIH07XG5cbiAgQXR0YWNoQm9keS5wcm90b3R5cGUuX3Jlc2l6ZURyb3Bkb3duID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjc3MgPSB7XG4gICAgICB3aWR0aDogdGhpcy4kY29udGFpbmVyLm91dGVyV2lkdGgoZmFsc2UpICsgJ3B4J1xuICAgIH07XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmdldCgnZHJvcGRvd25BdXRvV2lkdGgnKSkge1xuICAgICAgY3NzLm1pbldpZHRoID0gY3NzLndpZHRoO1xuICAgICAgY3NzLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICAgIGNzcy53aWR0aCA9ICdhdXRvJztcbiAgICB9XG5cbiAgICB0aGlzLiRkcm9wZG93bi5jc3MoY3NzKTtcbiAgfTtcblxuICBBdHRhY2hCb2R5LnByb3RvdHlwZS5fc2hvd0Ryb3Bkb3duID0gZnVuY3Rpb24gKGRlY29yYXRlZCkge1xuICAgIHRoaXMuJGRyb3Bkb3duQ29udGFpbmVyLmFwcGVuZFRvKHRoaXMuJGRyb3Bkb3duUGFyZW50KTtcblxuICAgIHRoaXMuX3Bvc2l0aW9uRHJvcGRvd24oKTtcbiAgICB0aGlzLl9yZXNpemVEcm9wZG93bigpO1xuICB9O1xuXG4gIHJldHVybiBBdHRhY2hCb2R5O1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9kcm9wZG93bi9taW5pbXVtUmVzdWx0c0ZvclNlYXJjaCcsW1xuXG5dLCBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIGNvdW50UmVzdWx0cyAoZGF0YSkge1xuICAgIHZhciBjb3VudCA9IDA7XG5cbiAgICBmb3IgKHZhciBkID0gMDsgZCA8IGRhdGEubGVuZ3RoOyBkKyspIHtcbiAgICAgIHZhciBpdGVtID0gZGF0YVtkXTtcblxuICAgICAgaWYgKGl0ZW0uY2hpbGRyZW4pIHtcbiAgICAgICAgY291bnQgKz0gY291bnRSZXN1bHRzKGl0ZW0uY2hpbGRyZW4pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY291bnQrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY291bnQ7XG4gIH1cblxuICBmdW5jdGlvbiBNaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCAoZGVjb3JhdGVkLCAkZWxlbWVudCwgb3B0aW9ucywgZGF0YUFkYXB0ZXIpIHtcbiAgICB0aGlzLm1pbmltdW1SZXN1bHRzRm9yU2VhcmNoID0gb3B0aW9ucy5nZXQoJ21pbmltdW1SZXN1bHRzRm9yU2VhcmNoJyk7XG5cbiAgICBpZiAodGhpcy5taW5pbXVtUmVzdWx0c0ZvclNlYXJjaCA8IDApIHtcbiAgICAgIHRoaXMubWluaW11bVJlc3VsdHNGb3JTZWFyY2ggPSBJbmZpbml0eTtcbiAgICB9XG5cbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCAkZWxlbWVudCwgb3B0aW9ucywgZGF0YUFkYXB0ZXIpO1xuICB9XG5cbiAgTWluaW11bVJlc3VsdHNGb3JTZWFyY2gucHJvdG90eXBlLnNob3dTZWFyY2ggPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBwYXJhbXMpIHtcbiAgICBpZiAoY291bnRSZXN1bHRzKHBhcmFtcy5kYXRhLnJlc3VsdHMpIDwgdGhpcy5taW5pbXVtUmVzdWx0c0ZvclNlYXJjaCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBwYXJhbXMpO1xuICB9O1xuXG4gIHJldHVybiBNaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZHJvcGRvd24vc2VsZWN0T25DbG9zZScsW1xuXG5dLCBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFNlbGVjdE9uQ2xvc2UgKCkgeyB9XG5cbiAgU2VsZWN0T25DbG9zZS5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGNvbnRhaW5lciwgJGNvbnRhaW5lcik7XG5cbiAgICBjb250YWluZXIub24oJ2Nsb3NlJywgZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgc2VsZi5faGFuZGxlU2VsZWN0T25DbG9zZShwYXJhbXMpO1xuICAgIH0pO1xuICB9O1xuXG4gIFNlbGVjdE9uQ2xvc2UucHJvdG90eXBlLl9oYW5kbGVTZWxlY3RPbkNsb3NlID0gZnVuY3Rpb24gKF8sIHBhcmFtcykge1xuICAgIGlmIChwYXJhbXMgJiYgcGFyYW1zLm9yaWdpbmFsU2VsZWN0MkV2ZW50ICE9IG51bGwpIHtcbiAgICAgIHZhciBldmVudCA9IHBhcmFtcy5vcmlnaW5hbFNlbGVjdDJFdmVudDtcblxuICAgICAgLy8gRG9uJ3Qgc2VsZWN0IGFuIGl0ZW0gaWYgdGhlIGNsb3NlIGV2ZW50IHdhcyB0cmlnZ2VyZWQgZnJvbSBhIHNlbGVjdCBvclxuICAgICAgLy8gdW5zZWxlY3QgZXZlbnRcbiAgICAgIGlmIChldmVudC5fdHlwZSA9PT0gJ3NlbGVjdCcgfHwgZXZlbnQuX3R5cGUgPT09ICd1bnNlbGVjdCcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciAkaGlnaGxpZ2h0ZWRSZXN1bHRzID0gdGhpcy5nZXRIaWdobGlnaHRlZFJlc3VsdHMoKTtcblxuICAgIC8vIE9ubHkgc2VsZWN0IGhpZ2hsaWdodGVkIHJlc3VsdHNcbiAgICBpZiAoJGhpZ2hsaWdodGVkUmVzdWx0cy5sZW5ndGggPCAxKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGRhdGEgPSAkaGlnaGxpZ2h0ZWRSZXN1bHRzLmRhdGEoJ2RhdGEnKTtcblxuICAgIC8vIERvbid0IHJlLXNlbGVjdCBhbHJlYWR5IHNlbGVjdGVkIHJlc3VsdGVcbiAgICBpZiAoXG4gICAgICAoZGF0YS5lbGVtZW50ICE9IG51bGwgJiYgZGF0YS5lbGVtZW50LnNlbGVjdGVkKSB8fFxuICAgICAgKGRhdGEuZWxlbWVudCA9PSBudWxsICYmIGRhdGEuc2VsZWN0ZWQpXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy50cmlnZ2VyKCdzZWxlY3QnLCB7XG4gICAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gU2VsZWN0T25DbG9zZTtcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZHJvcGRvd24vY2xvc2VPblNlbGVjdCcsW1xuXG5dLCBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIENsb3NlT25TZWxlY3QgKCkgeyB9XG5cbiAgQ2xvc2VPblNlbGVjdC5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGNvbnRhaW5lciwgJGNvbnRhaW5lcik7XG5cbiAgICBjb250YWluZXIub24oJ3NlbGVjdCcsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIHNlbGYuX3NlbGVjdFRyaWdnZXJlZChldnQpO1xuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLm9uKCd1bnNlbGVjdCcsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgIHNlbGYuX3NlbGVjdFRyaWdnZXJlZChldnQpO1xuICAgIH0pO1xuICB9O1xuXG4gIENsb3NlT25TZWxlY3QucHJvdG90eXBlLl9zZWxlY3RUcmlnZ2VyZWQgPSBmdW5jdGlvbiAoXywgZXZ0KSB7XG4gICAgdmFyIG9yaWdpbmFsRXZlbnQgPSBldnQub3JpZ2luYWxFdmVudDtcblxuICAgIC8vIERvbid0IGNsb3NlIGlmIHRoZSBjb250cm9sIGtleSBpcyBiZWluZyBoZWxkXG4gICAgaWYgKG9yaWdpbmFsRXZlbnQgJiYgb3JpZ2luYWxFdmVudC5jdHJsS2V5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy50cmlnZ2VyKCdjbG9zZScsIHtcbiAgICAgIG9yaWdpbmFsRXZlbnQ6IG9yaWdpbmFsRXZlbnQsXG4gICAgICBvcmlnaW5hbFNlbGVjdDJFdmVudDogZXZ0XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIENsb3NlT25TZWxlY3Q7XG59KTtcblxuUzIuZGVmaW5lKCdzZWxlY3QyL2kxOG4vZW4nLFtdLGZ1bmN0aW9uICgpIHtcbiAgLy8gRW5nbGlzaFxuICByZXR1cm4ge1xuICAgIGVycm9yTG9hZGluZzogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICdUaGUgcmVzdWx0cyBjb3VsZCBub3QgYmUgbG9hZGVkLic7XG4gICAgfSxcbiAgICBpbnB1dFRvb0xvbmc6IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICB2YXIgb3ZlckNoYXJzID0gYXJncy5pbnB1dC5sZW5ndGggLSBhcmdzLm1heGltdW07XG5cbiAgICAgIHZhciBtZXNzYWdlID0gJ1BsZWFzZSBkZWxldGUgJyArIG92ZXJDaGFycyArICcgY2hhcmFjdGVyJztcblxuICAgICAgaWYgKG92ZXJDaGFycyAhPSAxKSB7XG4gICAgICAgIG1lc3NhZ2UgKz0gJ3MnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICB9LFxuICAgIGlucHV0VG9vU2hvcnQ6IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICB2YXIgcmVtYWluaW5nQ2hhcnMgPSBhcmdzLm1pbmltdW0gLSBhcmdzLmlucHV0Lmxlbmd0aDtcblxuICAgICAgdmFyIG1lc3NhZ2UgPSAnUGxlYXNlIGVudGVyICcgKyByZW1haW5pbmdDaGFycyArICcgb3IgbW9yZSBjaGFyYWN0ZXJzJztcblxuICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgfSxcbiAgICBsb2FkaW5nTW9yZTogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICdMb2FkaW5nIG1vcmUgcmVzdWx0c+KApic7XG4gICAgfSxcbiAgICBtYXhpbXVtU2VsZWN0ZWQ6IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICB2YXIgbWVzc2FnZSA9ICdZb3UgY2FuIG9ubHkgc2VsZWN0ICcgKyBhcmdzLm1heGltdW0gKyAnIGl0ZW0nO1xuXG4gICAgICBpZiAoYXJncy5tYXhpbXVtICE9IDEpIHtcbiAgICAgICAgbWVzc2FnZSArPSAncyc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBtZXNzYWdlO1xuICAgIH0sXG4gICAgbm9SZXN1bHRzOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJ05vIHJlc3VsdHMgZm91bmQnO1xuICAgIH0sXG4gICAgc2VhcmNoaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gJ1NlYXJjaGluZ+KApic7XG4gICAgfVxuICB9O1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9kZWZhdWx0cycsW1xuICAnanF1ZXJ5JyxcbiAgJ3JlcXVpcmUnLFxuXG4gICcuL3Jlc3VsdHMnLFxuXG4gICcuL3NlbGVjdGlvbi9zaW5nbGUnLFxuICAnLi9zZWxlY3Rpb24vbXVsdGlwbGUnLFxuICAnLi9zZWxlY3Rpb24vcGxhY2Vob2xkZXInLFxuICAnLi9zZWxlY3Rpb24vYWxsb3dDbGVhcicsXG4gICcuL3NlbGVjdGlvbi9zZWFyY2gnLFxuICAnLi9zZWxlY3Rpb24vZXZlbnRSZWxheScsXG5cbiAgJy4vdXRpbHMnLFxuICAnLi90cmFuc2xhdGlvbicsXG4gICcuL2RpYWNyaXRpY3MnLFxuXG4gICcuL2RhdGEvc2VsZWN0JyxcbiAgJy4vZGF0YS9hcnJheScsXG4gICcuL2RhdGEvYWpheCcsXG4gICcuL2RhdGEvdGFncycsXG4gICcuL2RhdGEvdG9rZW5pemVyJyxcbiAgJy4vZGF0YS9taW5pbXVtSW5wdXRMZW5ndGgnLFxuICAnLi9kYXRhL21heGltdW1JbnB1dExlbmd0aCcsXG4gICcuL2RhdGEvbWF4aW11bVNlbGVjdGlvbkxlbmd0aCcsXG5cbiAgJy4vZHJvcGRvd24nLFxuICAnLi9kcm9wZG93bi9zZWFyY2gnLFxuICAnLi9kcm9wZG93bi9oaWRlUGxhY2Vob2xkZXInLFxuICAnLi9kcm9wZG93bi9pbmZpbml0ZVNjcm9sbCcsXG4gICcuL2Ryb3Bkb3duL2F0dGFjaEJvZHknLFxuICAnLi9kcm9wZG93bi9taW5pbXVtUmVzdWx0c0ZvclNlYXJjaCcsXG4gICcuL2Ryb3Bkb3duL3NlbGVjdE9uQ2xvc2UnLFxuICAnLi9kcm9wZG93bi9jbG9zZU9uU2VsZWN0JyxcblxuICAnLi9pMThuL2VuJ1xuXSwgZnVuY3Rpb24gKCQsIHJlcXVpcmUsXG5cbiAgICAgICAgICAgICBSZXN1bHRzTGlzdCxcblxuICAgICAgICAgICAgIFNpbmdsZVNlbGVjdGlvbiwgTXVsdGlwbGVTZWxlY3Rpb24sIFBsYWNlaG9sZGVyLCBBbGxvd0NsZWFyLFxuICAgICAgICAgICAgIFNlbGVjdGlvblNlYXJjaCwgRXZlbnRSZWxheSxcblxuICAgICAgICAgICAgIFV0aWxzLCBUcmFuc2xhdGlvbiwgRElBQ1JJVElDUyxcblxuICAgICAgICAgICAgIFNlbGVjdERhdGEsIEFycmF5RGF0YSwgQWpheERhdGEsIFRhZ3MsIFRva2VuaXplcixcbiAgICAgICAgICAgICBNaW5pbXVtSW5wdXRMZW5ndGgsIE1heGltdW1JbnB1dExlbmd0aCwgTWF4aW11bVNlbGVjdGlvbkxlbmd0aCxcblxuICAgICAgICAgICAgIERyb3Bkb3duLCBEcm9wZG93blNlYXJjaCwgSGlkZVBsYWNlaG9sZGVyLCBJbmZpbml0ZVNjcm9sbCxcbiAgICAgICAgICAgICBBdHRhY2hCb2R5LCBNaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCwgU2VsZWN0T25DbG9zZSwgQ2xvc2VPblNlbGVjdCxcblxuICAgICAgICAgICAgIEVuZ2xpc2hUcmFuc2xhdGlvbikge1xuICBmdW5jdGlvbiBEZWZhdWx0cyAoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgRGVmYXVsdHMucHJvdG90eXBlLmFwcGx5ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIHRoaXMuZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgaWYgKG9wdGlvbnMuZGF0YUFkYXB0ZXIgPT0gbnVsbCkge1xuICAgICAgaWYgKG9wdGlvbnMuYWpheCAhPSBudWxsKSB7XG4gICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIgPSBBamF4RGF0YTtcbiAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5kYXRhICE9IG51bGwpIHtcbiAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlciA9IEFycmF5RGF0YTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIgPSBTZWxlY3REYXRhO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5taW5pbXVtSW5wdXRMZW5ndGggPiAwKSB7XG4gICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcbiAgICAgICAgICBvcHRpb25zLmRhdGFBZGFwdGVyLFxuICAgICAgICAgIE1pbmltdW1JbnB1dExlbmd0aFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5tYXhpbXVtSW5wdXRMZW5ndGggPiAwKSB7XG4gICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcbiAgICAgICAgICBvcHRpb25zLmRhdGFBZGFwdGVyLFxuICAgICAgICAgIE1heGltdW1JbnB1dExlbmd0aFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5tYXhpbXVtU2VsZWN0aW9uTGVuZ3RoID4gMCkge1xuICAgICAgICBvcHRpb25zLmRhdGFBZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXG4gICAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlcixcbiAgICAgICAgICBNYXhpbXVtU2VsZWN0aW9uTGVuZ3RoXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLnRhZ3MpIHtcbiAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKG9wdGlvbnMuZGF0YUFkYXB0ZXIsIFRhZ3MpO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy50b2tlblNlcGFyYXRvcnMgIT0gbnVsbCB8fCBvcHRpb25zLnRva2VuaXplciAhPSBudWxsKSB7XG4gICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcbiAgICAgICAgICBvcHRpb25zLmRhdGFBZGFwdGVyLFxuICAgICAgICAgIFRva2VuaXplclxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5xdWVyeSAhPSBudWxsKSB7XG4gICAgICAgIHZhciBRdWVyeSA9IHJlcXVpcmUob3B0aW9ucy5hbWRCYXNlICsgJ2NvbXBhdC9xdWVyeScpO1xuXG4gICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcbiAgICAgICAgICBvcHRpb25zLmRhdGFBZGFwdGVyLFxuICAgICAgICAgIFF1ZXJ5XG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLmluaXRTZWxlY3Rpb24gIT0gbnVsbCkge1xuICAgICAgICB2YXIgSW5pdFNlbGVjdGlvbiA9IHJlcXVpcmUob3B0aW9ucy5hbWRCYXNlICsgJ2NvbXBhdC9pbml0U2VsZWN0aW9uJyk7XG5cbiAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxuICAgICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIsXG4gICAgICAgICAgSW5pdFNlbGVjdGlvblxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnJlc3VsdHNBZGFwdGVyID09IG51bGwpIHtcbiAgICAgIG9wdGlvbnMucmVzdWx0c0FkYXB0ZXIgPSBSZXN1bHRzTGlzdDtcblxuICAgICAgaWYgKG9wdGlvbnMuYWpheCAhPSBudWxsKSB7XG4gICAgICAgIG9wdGlvbnMucmVzdWx0c0FkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcbiAgICAgICAgICBvcHRpb25zLnJlc3VsdHNBZGFwdGVyLFxuICAgICAgICAgIEluZmluaXRlU2Nyb2xsXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLnBsYWNlaG9sZGVyICE9IG51bGwpIHtcbiAgICAgICAgb3B0aW9ucy5yZXN1bHRzQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxuICAgICAgICAgIG9wdGlvbnMucmVzdWx0c0FkYXB0ZXIsXG4gICAgICAgICAgSGlkZVBsYWNlaG9sZGVyXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLnNlbGVjdE9uQ2xvc2UpIHtcbiAgICAgICAgb3B0aW9ucy5yZXN1bHRzQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxuICAgICAgICAgIG9wdGlvbnMucmVzdWx0c0FkYXB0ZXIsXG4gICAgICAgICAgU2VsZWN0T25DbG9zZVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmRyb3Bkb3duQWRhcHRlciA9PSBudWxsKSB7XG4gICAgICBpZiAob3B0aW9ucy5tdWx0aXBsZSkge1xuICAgICAgICBvcHRpb25zLmRyb3Bkb3duQWRhcHRlciA9IERyb3Bkb3duO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIFNlYXJjaGFibGVEcm9wZG93biA9IFV0aWxzLkRlY29yYXRlKERyb3Bkb3duLCBEcm9wZG93blNlYXJjaCk7XG5cbiAgICAgICAgb3B0aW9ucy5kcm9wZG93bkFkYXB0ZXIgPSBTZWFyY2hhYmxlRHJvcGRvd247XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLm1pbmltdW1SZXN1bHRzRm9yU2VhcmNoICE9PSAwKSB7XG4gICAgICAgIG9wdGlvbnMuZHJvcGRvd25BZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXG4gICAgICAgICAgb3B0aW9ucy5kcm9wZG93bkFkYXB0ZXIsXG4gICAgICAgICAgTWluaW11bVJlc3VsdHNGb3JTZWFyY2hcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMuY2xvc2VPblNlbGVjdCkge1xuICAgICAgICBvcHRpb25zLmRyb3Bkb3duQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxuICAgICAgICAgIG9wdGlvbnMuZHJvcGRvd25BZGFwdGVyLFxuICAgICAgICAgIENsb3NlT25TZWxlY3RcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICBvcHRpb25zLmRyb3Bkb3duQ3NzQ2xhc3MgIT0gbnVsbCB8fFxuICAgICAgICBvcHRpb25zLmRyb3Bkb3duQ3NzICE9IG51bGwgfHxcbiAgICAgICAgb3B0aW9ucy5hZGFwdERyb3Bkb3duQ3NzQ2xhc3MgIT0gbnVsbFxuICAgICAgKSB7XG4gICAgICAgIHZhciBEcm9wZG93bkNTUyA9IHJlcXVpcmUob3B0aW9ucy5hbWRCYXNlICsgJ2NvbXBhdC9kcm9wZG93bkNzcycpO1xuXG4gICAgICAgIG9wdGlvbnMuZHJvcGRvd25BZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXG4gICAgICAgICAgb3B0aW9ucy5kcm9wZG93bkFkYXB0ZXIsXG4gICAgICAgICAgRHJvcGRvd25DU1NcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucy5kcm9wZG93bkFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcbiAgICAgICAgb3B0aW9ucy5kcm9wZG93bkFkYXB0ZXIsXG4gICAgICAgIEF0dGFjaEJvZHlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuc2VsZWN0aW9uQWRhcHRlciA9PSBudWxsKSB7XG4gICAgICBpZiAob3B0aW9ucy5tdWx0aXBsZSkge1xuICAgICAgICBvcHRpb25zLnNlbGVjdGlvbkFkYXB0ZXIgPSBNdWx0aXBsZVNlbGVjdGlvbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wdGlvbnMuc2VsZWN0aW9uQWRhcHRlciA9IFNpbmdsZVNlbGVjdGlvbjtcbiAgICAgIH1cblxuICAgICAgLy8gQWRkIHRoZSBwbGFjZWhvbGRlciBtaXhpbiBpZiBhIHBsYWNlaG9sZGVyIHdhcyBzcGVjaWZpZWRcbiAgICAgIGlmIChvcHRpb25zLnBsYWNlaG9sZGVyICE9IG51bGwpIHtcbiAgICAgICAgb3B0aW9ucy5zZWxlY3Rpb25BZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXG4gICAgICAgICAgb3B0aW9ucy5zZWxlY3Rpb25BZGFwdGVyLFxuICAgICAgICAgIFBsYWNlaG9sZGVyXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLmFsbG93Q2xlYXIpIHtcbiAgICAgICAgb3B0aW9ucy5zZWxlY3Rpb25BZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXG4gICAgICAgICAgb3B0aW9ucy5zZWxlY3Rpb25BZGFwdGVyLFxuICAgICAgICAgIEFsbG93Q2xlYXJcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMubXVsdGlwbGUpIHtcbiAgICAgICAgb3B0aW9ucy5zZWxlY3Rpb25BZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXG4gICAgICAgICAgb3B0aW9ucy5zZWxlY3Rpb25BZGFwdGVyLFxuICAgICAgICAgIFNlbGVjdGlvblNlYXJjaFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgIG9wdGlvbnMuY29udGFpbmVyQ3NzQ2xhc3MgIT0gbnVsbCB8fFxuICAgICAgICBvcHRpb25zLmNvbnRhaW5lckNzcyAhPSBudWxsIHx8XG4gICAgICAgIG9wdGlvbnMuYWRhcHRDb250YWluZXJDc3NDbGFzcyAhPSBudWxsXG4gICAgICApIHtcbiAgICAgICAgdmFyIENvbnRhaW5lckNTUyA9IHJlcXVpcmUob3B0aW9ucy5hbWRCYXNlICsgJ2NvbXBhdC9jb250YWluZXJDc3MnKTtcblxuICAgICAgICBvcHRpb25zLnNlbGVjdGlvbkFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcbiAgICAgICAgICBvcHRpb25zLnNlbGVjdGlvbkFkYXB0ZXIsXG4gICAgICAgICAgQ29udGFpbmVyQ1NTXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMuc2VsZWN0aW9uQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxuICAgICAgICBvcHRpb25zLnNlbGVjdGlvbkFkYXB0ZXIsXG4gICAgICAgIEV2ZW50UmVsYXlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLmxhbmd1YWdlID09PSAnc3RyaW5nJykge1xuICAgICAgLy8gQ2hlY2sgaWYgdGhlIGxhbmd1YWdlIGlzIHNwZWNpZmllZCB3aXRoIGEgcmVnaW9uXG4gICAgICBpZiAob3B0aW9ucy5sYW5ndWFnZS5pbmRleE9mKCctJykgPiAwKSB7XG4gICAgICAgIC8vIEV4dHJhY3QgdGhlIHJlZ2lvbiBpbmZvcm1hdGlvbiBpZiBpdCBpcyBpbmNsdWRlZFxuICAgICAgICB2YXIgbGFuZ3VhZ2VQYXJ0cyA9IG9wdGlvbnMubGFuZ3VhZ2Uuc3BsaXQoJy0nKTtcbiAgICAgICAgdmFyIGJhc2VMYW5ndWFnZSA9IGxhbmd1YWdlUGFydHNbMF07XG5cbiAgICAgICAgb3B0aW9ucy5sYW5ndWFnZSA9IFtvcHRpb25zLmxhbmd1YWdlLCBiYXNlTGFuZ3VhZ2VdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3B0aW9ucy5sYW5ndWFnZSA9IFtvcHRpb25zLmxhbmd1YWdlXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoJC5pc0FycmF5KG9wdGlvbnMubGFuZ3VhZ2UpKSB7XG4gICAgICB2YXIgbGFuZ3VhZ2VzID0gbmV3IFRyYW5zbGF0aW9uKCk7XG4gICAgICBvcHRpb25zLmxhbmd1YWdlLnB1c2goJ2VuJyk7XG5cbiAgICAgIHZhciBsYW5ndWFnZU5hbWVzID0gb3B0aW9ucy5sYW5ndWFnZTtcblxuICAgICAgZm9yICh2YXIgbCA9IDA7IGwgPCBsYW5ndWFnZU5hbWVzLmxlbmd0aDsgbCsrKSB7XG4gICAgICAgIHZhciBuYW1lID0gbGFuZ3VhZ2VOYW1lc1tsXTtcbiAgICAgICAgdmFyIGxhbmd1YWdlID0ge307XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyBUcnkgdG8gbG9hZCBpdCB3aXRoIHRoZSBvcmlnaW5hbCBuYW1lXG4gICAgICAgICAgbGFuZ3VhZ2UgPSBUcmFuc2xhdGlvbi5sb2FkUGF0aChuYW1lKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBJZiB3ZSBjb3VsZG4ndCBsb2FkIGl0LCBjaGVjayBpZiBpdCB3YXNuJ3QgdGhlIGZ1bGwgcGF0aFxuICAgICAgICAgICAgbmFtZSA9IHRoaXMuZGVmYXVsdHMuYW1kTGFuZ3VhZ2VCYXNlICsgbmFtZTtcbiAgICAgICAgICAgIGxhbmd1YWdlID0gVHJhbnNsYXRpb24ubG9hZFBhdGgobmFtZSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgIC8vIFRoZSB0cmFuc2xhdGlvbiBjb3VsZCBub3QgYmUgbG9hZGVkIGF0IGFsbC4gU29tZXRpbWVzIHRoaXMgaXNcbiAgICAgICAgICAgIC8vIGJlY2F1c2Ugb2YgYSBjb25maWd1cmF0aW9uIHByb2JsZW0sIG90aGVyIHRpbWVzIHRoaXMgY2FuIGJlXG4gICAgICAgICAgICAvLyBiZWNhdXNlIG9mIGhvdyBTZWxlY3QyIGhlbHBzIGxvYWQgYWxsIHBvc3NpYmxlIHRyYW5zbGF0aW9uIGZpbGVzLlxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZGVidWcgJiYgd2luZG93LmNvbnNvbGUgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgICAgICAnU2VsZWN0MjogVGhlIGxhbmd1YWdlIGZpbGUgZm9yIFwiJyArIG5hbWUgKyAnXCIgY291bGQgbm90IGJlICcgK1xuICAgICAgICAgICAgICAgICdhdXRvbWF0aWNhbGx5IGxvYWRlZC4gQSBmYWxsYmFjayB3aWxsIGJlIHVzZWQgaW5zdGVhZC4nXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxhbmd1YWdlcy5leHRlbmQobGFuZ3VhZ2UpO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zLnRyYW5zbGF0aW9ucyA9IGxhbmd1YWdlcztcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGJhc2VUcmFuc2xhdGlvbiA9IFRyYW5zbGF0aW9uLmxvYWRQYXRoKFxuICAgICAgICB0aGlzLmRlZmF1bHRzLmFtZExhbmd1YWdlQmFzZSArICdlbidcbiAgICAgICk7XG4gICAgICB2YXIgY3VzdG9tVHJhbnNsYXRpb24gPSBuZXcgVHJhbnNsYXRpb24ob3B0aW9ucy5sYW5ndWFnZSk7XG5cbiAgICAgIGN1c3RvbVRyYW5zbGF0aW9uLmV4dGVuZChiYXNlVHJhbnNsYXRpb24pO1xuXG4gICAgICBvcHRpb25zLnRyYW5zbGF0aW9ucyA9IGN1c3RvbVRyYW5zbGF0aW9uO1xuICAgIH1cblxuICAgIHJldHVybiBvcHRpb25zO1xuICB9O1xuXG4gIERlZmF1bHRzLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBzdHJpcERpYWNyaXRpY3MgKHRleHQpIHtcbiAgICAgIC8vIFVzZWQgJ3VuaSByYW5nZSArIG5hbWVkIGZ1bmN0aW9uJyBmcm9tIGh0dHA6Ly9qc3BlcmYuY29tL2RpYWNyaXRpY3MvMThcbiAgICAgIGZ1bmN0aW9uIG1hdGNoKGEpIHtcbiAgICAgICAgcmV0dXJuIERJQUNSSVRJQ1NbYV0gfHwgYTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRleHQucmVwbGFjZSgvW15cXHUwMDAwLVxcdTAwN0VdL2csIG1hdGNoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYXRjaGVyIChwYXJhbXMsIGRhdGEpIHtcbiAgICAgIC8vIEFsd2F5cyByZXR1cm4gdGhlIG9iamVjdCBpZiB0aGVyZSBpcyBub3RoaW5nIHRvIGNvbXBhcmVcbiAgICAgIGlmICgkLnRyaW0ocGFyYW1zLnRlcm0pID09PSAnJykge1xuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgIH1cblxuICAgICAgLy8gRG8gYSByZWN1cnNpdmUgY2hlY2sgZm9yIG9wdGlvbnMgd2l0aCBjaGlsZHJlblxuICAgICAgaWYgKGRhdGEuY2hpbGRyZW4gJiYgZGF0YS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vIENsb25lIHRoZSBkYXRhIG9iamVjdCBpZiB0aGVyZSBhcmUgY2hpbGRyZW5cbiAgICAgICAgLy8gVGhpcyBpcyByZXF1aXJlZCBhcyB3ZSBtb2RpZnkgdGhlIG9iamVjdCB0byByZW1vdmUgYW55IG5vbi1tYXRjaGVzXG4gICAgICAgIHZhciBtYXRjaCA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkYXRhKTtcblxuICAgICAgICAvLyBDaGVjayBlYWNoIGNoaWxkIG9mIHRoZSBvcHRpb25cbiAgICAgICAgZm9yICh2YXIgYyA9IGRhdGEuY2hpbGRyZW4ubGVuZ3RoIC0gMTsgYyA+PSAwOyBjLS0pIHtcbiAgICAgICAgICB2YXIgY2hpbGQgPSBkYXRhLmNoaWxkcmVuW2NdO1xuXG4gICAgICAgICAgdmFyIG1hdGNoZXMgPSBtYXRjaGVyKHBhcmFtcywgY2hpbGQpO1xuXG4gICAgICAgICAgLy8gSWYgdGhlcmUgd2Fzbid0IGEgbWF0Y2gsIHJlbW92ZSB0aGUgb2JqZWN0IGluIHRoZSBhcnJheVxuICAgICAgICAgIGlmIChtYXRjaGVzID09IG51bGwpIHtcbiAgICAgICAgICAgIG1hdGNoLmNoaWxkcmVuLnNwbGljZShjLCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBhbnkgY2hpbGRyZW4gbWF0Y2hlZCwgcmV0dXJuIHRoZSBuZXcgb2JqZWN0XG4gICAgICAgIGlmIChtYXRjaC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhlcmUgd2VyZSBubyBtYXRjaGluZyBjaGlsZHJlbiwgY2hlY2sganVzdCB0aGUgcGxhaW4gb2JqZWN0XG4gICAgICAgIHJldHVybiBtYXRjaGVyKHBhcmFtcywgbWF0Y2gpO1xuICAgICAgfVxuXG4gICAgICB2YXIgb3JpZ2luYWwgPSBzdHJpcERpYWNyaXRpY3MoZGF0YS50ZXh0KS50b1VwcGVyQ2FzZSgpO1xuICAgICAgdmFyIHRlcm0gPSBzdHJpcERpYWNyaXRpY3MocGFyYW1zLnRlcm0pLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgIC8vIENoZWNrIGlmIHRoZSB0ZXh0IGNvbnRhaW5zIHRoZSB0ZXJtXG4gICAgICBpZiAob3JpZ2luYWwuaW5kZXhPZih0ZXJtKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiBpdCBkb2Vzbid0IGNvbnRhaW4gdGhlIHRlcm0sIGRvbid0IHJldHVybiBhbnl0aGluZ1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5kZWZhdWx0cyA9IHtcbiAgICAgIGFtZEJhc2U6ICcuLycsXG4gICAgICBhbWRMYW5ndWFnZUJhc2U6ICcuL2kxOG4vJyxcbiAgICAgIGNsb3NlT25TZWxlY3Q6IHRydWUsXG4gICAgICBkZWJ1ZzogZmFsc2UsXG4gICAgICBkcm9wZG93bkF1dG9XaWR0aDogZmFsc2UsXG4gICAgICBlc2NhcGVNYXJrdXA6IFV0aWxzLmVzY2FwZU1hcmt1cCxcbiAgICAgIGxhbmd1YWdlOiBFbmdsaXNoVHJhbnNsYXRpb24sXG4gICAgICBtYXRjaGVyOiBtYXRjaGVyLFxuICAgICAgbWluaW11bUlucHV0TGVuZ3RoOiAwLFxuICAgICAgbWF4aW11bUlucHV0TGVuZ3RoOiAwLFxuICAgICAgbWF4aW11bVNlbGVjdGlvbkxlbmd0aDogMCxcbiAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiAwLFxuICAgICAgc2VsZWN0T25DbG9zZTogZmFsc2UsXG4gICAgICBzb3J0ZXI6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgfSxcbiAgICAgIHRlbXBsYXRlUmVzdWx0OiBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIHJldHVybiByZXN1bHQudGV4dDtcbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZVNlbGVjdGlvbjogZnVuY3Rpb24gKHNlbGVjdGlvbikge1xuICAgICAgICByZXR1cm4gc2VsZWN0aW9uLnRleHQ7XG4gICAgICB9LFxuICAgICAgdGhlbWU6ICdkZWZhdWx0JyxcbiAgICAgIHdpZHRoOiAncmVzb2x2ZSdcbiAgICB9O1xuICB9O1xuXG4gIERlZmF1bHRzLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgIHZhciBjYW1lbEtleSA9ICQuY2FtZWxDYXNlKGtleSk7XG5cbiAgICB2YXIgZGF0YSA9IHt9O1xuICAgIGRhdGFbY2FtZWxLZXldID0gdmFsdWU7XG5cbiAgICB2YXIgY29udmVydGVkRGF0YSA9IFV0aWxzLl9jb252ZXJ0RGF0YShkYXRhKTtcblxuICAgICQuZXh0ZW5kKHRoaXMuZGVmYXVsdHMsIGNvbnZlcnRlZERhdGEpO1xuICB9O1xuXG4gIHZhciBkZWZhdWx0cyA9IG5ldyBEZWZhdWx0cygpO1xuXG4gIHJldHVybiBkZWZhdWx0cztcbn0pO1xuXG5TMi5kZWZpbmUoJ3NlbGVjdDIvb3B0aW9ucycsW1xuICAncmVxdWlyZScsXG4gICdqcXVlcnknLFxuICAnLi9kZWZhdWx0cycsXG4gICcuL3V0aWxzJ1xuXSwgZnVuY3Rpb24gKHJlcXVpcmUsICQsIERlZmF1bHRzLCBVdGlscykge1xuICBmdW5jdGlvbiBPcHRpb25zIChvcHRpb25zLCAkZWxlbWVudCkge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICBpZiAoJGVsZW1lbnQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5mcm9tRWxlbWVudCgkZWxlbWVudCk7XG4gICAgfVxuXG4gICAgdGhpcy5vcHRpb25zID0gRGVmYXVsdHMuYXBwbHkodGhpcy5vcHRpb25zKTtcblxuICAgIGlmICgkZWxlbWVudCAmJiAkZWxlbWVudC5pcygnaW5wdXQnKSkge1xuICAgICAgdmFyIElucHV0Q29tcGF0ID0gcmVxdWlyZSh0aGlzLmdldCgnYW1kQmFzZScpICsgJ2NvbXBhdC9pbnB1dERhdGEnKTtcblxuICAgICAgdGhpcy5vcHRpb25zLmRhdGFBZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXG4gICAgICAgIHRoaXMub3B0aW9ucy5kYXRhQWRhcHRlcixcbiAgICAgICAgSW5wdXRDb21wYXRcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgT3B0aW9ucy5wcm90b3R5cGUuZnJvbUVsZW1lbnQgPSBmdW5jdGlvbiAoJGUpIHtcbiAgICB2YXIgZXhjbHVkZWREYXRhID0gWydzZWxlY3QyJ107XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLm11bHRpcGxlID09IG51bGwpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5tdWx0aXBsZSA9ICRlLnByb3AoJ211bHRpcGxlJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5kaXNhYmxlZCA9PSBudWxsKSB7XG4gICAgICB0aGlzLm9wdGlvbnMuZGlzYWJsZWQgPSAkZS5wcm9wKCdkaXNhYmxlZCcpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMubGFuZ3VhZ2UgPT0gbnVsbCkge1xuICAgICAgaWYgKCRlLnByb3AoJ2xhbmcnKSkge1xuICAgICAgICB0aGlzLm9wdGlvbnMubGFuZ3VhZ2UgPSAkZS5wcm9wKCdsYW5nJykudG9Mb3dlckNhc2UoKTtcbiAgICAgIH0gZWxzZSBpZiAoJGUuY2xvc2VzdCgnW2xhbmddJykucHJvcCgnbGFuZycpKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5sYW5ndWFnZSA9ICRlLmNsb3Nlc3QoJ1tsYW5nXScpLnByb3AoJ2xhbmcnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmRpciA9PSBudWxsKSB7XG4gICAgICBpZiAoJGUucHJvcCgnZGlyJykpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmRpciA9ICRlLnByb3AoJ2RpcicpO1xuICAgICAgfSBlbHNlIGlmICgkZS5jbG9zZXN0KCdbZGlyXScpLnByb3AoJ2RpcicpKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5kaXIgPSAkZS5jbG9zZXN0KCdbZGlyXScpLnByb3AoJ2RpcicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmRpciA9ICdsdHInO1xuICAgICAgfVxuICAgIH1cblxuICAgICRlLnByb3AoJ2Rpc2FibGVkJywgdGhpcy5vcHRpb25zLmRpc2FibGVkKTtcbiAgICAkZS5wcm9wKCdtdWx0aXBsZScsIHRoaXMub3B0aW9ucy5tdWx0aXBsZSk7XG5cbiAgICBpZiAoJGUuZGF0YSgnc2VsZWN0MlRhZ3MnKSkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZyAmJiB3aW5kb3cuY29uc29sZSAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICdTZWxlY3QyOiBUaGUgYGRhdGEtc2VsZWN0Mi10YWdzYCBhdHRyaWJ1dGUgaGFzIGJlZW4gY2hhbmdlZCB0byAnICtcbiAgICAgICAgICAndXNlIHRoZSBgZGF0YS1kYXRhYCBhbmQgYGRhdGEtdGFncz1cInRydWVcImAgYXR0cmlidXRlcyBhbmQgd2lsbCBiZSAnICtcbiAgICAgICAgICAncmVtb3ZlZCBpbiBmdXR1cmUgdmVyc2lvbnMgb2YgU2VsZWN0Mi4nXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgICRlLmRhdGEoJ2RhdGEnLCAkZS5kYXRhKCdzZWxlY3QyVGFncycpKTtcbiAgICAgICRlLmRhdGEoJ3RhZ3MnLCB0cnVlKTtcbiAgICB9XG5cbiAgICBpZiAoJGUuZGF0YSgnYWpheFVybCcpKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnICYmIHdpbmRvdy5jb25zb2xlICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgJ1NlbGVjdDI6IFRoZSBgZGF0YS1hamF4LXVybGAgYXR0cmlidXRlIGhhcyBiZWVuIGNoYW5nZWQgdG8gJyArXG4gICAgICAgICAgJ2BkYXRhLWFqYXgtLXVybGAgYW5kIHN1cHBvcnQgZm9yIHRoZSBvbGQgYXR0cmlidXRlIHdpbGwgYmUgcmVtb3ZlZCcgK1xuICAgICAgICAgICcgaW4gZnV0dXJlIHZlcnNpb25zIG9mIFNlbGVjdDIuJ1xuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICAkZS5hdHRyKCdhamF4LS11cmwnLCAkZS5kYXRhKCdhamF4VXJsJykpO1xuICAgICAgJGUuZGF0YSgnYWpheC0tdXJsJywgJGUuZGF0YSgnYWpheFVybCcpKTtcbiAgICB9XG5cbiAgICB2YXIgZGF0YXNldCA9IHt9O1xuXG4gICAgLy8gUHJlZmVyIHRoZSBlbGVtZW50J3MgYGRhdGFzZXRgIGF0dHJpYnV0ZSBpZiBpdCBleGlzdHNcbiAgICAvLyBqUXVlcnkgMS54IGRvZXMgbm90IGNvcnJlY3RseSBoYW5kbGUgZGF0YSBhdHRyaWJ1dGVzIHdpdGggbXVsdGlwbGUgZGFzaGVzXG4gICAgaWYgKCQuZm4uanF1ZXJ5ICYmICQuZm4uanF1ZXJ5LnN1YnN0cigwLCAyKSA9PSAnMS4nICYmICRlWzBdLmRhdGFzZXQpIHtcbiAgICAgIGRhdGFzZXQgPSAkLmV4dGVuZCh0cnVlLCB7fSwgJGVbMF0uZGF0YXNldCwgJGUuZGF0YSgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YXNldCA9ICRlLmRhdGEoKTtcbiAgICB9XG5cbiAgICB2YXIgZGF0YSA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkYXRhc2V0KTtcblxuICAgIGRhdGEgPSBVdGlscy5fY29udmVydERhdGEoZGF0YSk7XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gZGF0YSkge1xuICAgICAgaWYgKCQuaW5BcnJheShrZXksIGV4Y2x1ZGVkRGF0YSkgPiAtMSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCQuaXNQbGFpbk9iamVjdCh0aGlzLm9wdGlvbnNba2V5XSkpIHtcbiAgICAgICAgJC5leHRlbmQodGhpcy5vcHRpb25zW2tleV0sIGRhdGFba2V5XSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9wdGlvbnNba2V5XSA9IGRhdGFba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBPcHRpb25zLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9uc1trZXldO1xuICB9O1xuXG4gIE9wdGlvbnMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChrZXksIHZhbCkge1xuICAgIHRoaXMub3B0aW9uc1trZXldID0gdmFsO1xuICB9O1xuXG4gIHJldHVybiBPcHRpb25zO1xufSk7XG5cblMyLmRlZmluZSgnc2VsZWN0Mi9jb3JlJyxbXG4gICdqcXVlcnknLFxuICAnLi9vcHRpb25zJyxcbiAgJy4vdXRpbHMnLFxuICAnLi9rZXlzJ1xuXSwgZnVuY3Rpb24gKCQsIE9wdGlvbnMsIFV0aWxzLCBLRVlTKSB7XG4gIHZhciBTZWxlY3QyID0gZnVuY3Rpb24gKCRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgaWYgKCRlbGVtZW50LmRhdGEoJ3NlbGVjdDInKSAhPSBudWxsKSB7XG4gICAgICAkZWxlbWVudC5kYXRhKCdzZWxlY3QyJykuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHRoaXMuJGVsZW1lbnQgPSAkZWxlbWVudDtcblxuICAgIHRoaXMuaWQgPSB0aGlzLl9nZW5lcmF0ZUlkKCRlbGVtZW50KTtcblxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgdGhpcy5vcHRpb25zID0gbmV3IE9wdGlvbnMob3B0aW9ucywgJGVsZW1lbnQpO1xuXG4gICAgU2VsZWN0Mi5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzKTtcblxuICAgIC8vIFNldCB1cCB0aGUgdGFiaW5kZXhcblxuICAgIHZhciB0YWJpbmRleCA9ICRlbGVtZW50LmF0dHIoJ3RhYmluZGV4JykgfHwgMDtcbiAgICAkZWxlbWVudC5kYXRhKCdvbGQtdGFiaW5kZXgnLCB0YWJpbmRleCk7XG4gICAgJGVsZW1lbnQuYXR0cigndGFiaW5kZXgnLCAnLTEnKTtcblxuICAgIC8vIFNldCB1cCBjb250YWluZXJzIGFuZCBhZGFwdGVyc1xuXG4gICAgdmFyIERhdGFBZGFwdGVyID0gdGhpcy5vcHRpb25zLmdldCgnZGF0YUFkYXB0ZXInKTtcbiAgICB0aGlzLmRhdGFBZGFwdGVyID0gbmV3IERhdGFBZGFwdGVyKCRlbGVtZW50LCB0aGlzLm9wdGlvbnMpO1xuXG4gICAgdmFyICRjb250YWluZXIgPSB0aGlzLnJlbmRlcigpO1xuXG4gICAgdGhpcy5fcGxhY2VDb250YWluZXIoJGNvbnRhaW5lcik7XG5cbiAgICB2YXIgU2VsZWN0aW9uQWRhcHRlciA9IHRoaXMub3B0aW9ucy5nZXQoJ3NlbGVjdGlvbkFkYXB0ZXInKTtcbiAgICB0aGlzLnNlbGVjdGlvbiA9IG5ldyBTZWxlY3Rpb25BZGFwdGVyKCRlbGVtZW50LCB0aGlzLm9wdGlvbnMpO1xuICAgIHRoaXMuJHNlbGVjdGlvbiA9IHRoaXMuc2VsZWN0aW9uLnJlbmRlcigpO1xuXG4gICAgdGhpcy5zZWxlY3Rpb24ucG9zaXRpb24odGhpcy4kc2VsZWN0aW9uLCAkY29udGFpbmVyKTtcblxuICAgIHZhciBEcm9wZG93bkFkYXB0ZXIgPSB0aGlzLm9wdGlvbnMuZ2V0KCdkcm9wZG93bkFkYXB0ZXInKTtcbiAgICB0aGlzLmRyb3Bkb3duID0gbmV3IERyb3Bkb3duQWRhcHRlcigkZWxlbWVudCwgdGhpcy5vcHRpb25zKTtcbiAgICB0aGlzLiRkcm9wZG93biA9IHRoaXMuZHJvcGRvd24ucmVuZGVyKCk7XG5cbiAgICB0aGlzLmRyb3Bkb3duLnBvc2l0aW9uKHRoaXMuJGRyb3Bkb3duLCAkY29udGFpbmVyKTtcblxuICAgIHZhciBSZXN1bHRzQWRhcHRlciA9IHRoaXMub3B0aW9ucy5nZXQoJ3Jlc3VsdHNBZGFwdGVyJyk7XG4gICAgdGhpcy5yZXN1bHRzID0gbmV3IFJlc3VsdHNBZGFwdGVyKCRlbGVtZW50LCB0aGlzLm9wdGlvbnMsIHRoaXMuZGF0YUFkYXB0ZXIpO1xuICAgIHRoaXMuJHJlc3VsdHMgPSB0aGlzLnJlc3VsdHMucmVuZGVyKCk7XG5cbiAgICB0aGlzLnJlc3VsdHMucG9zaXRpb24odGhpcy4kcmVzdWx0cywgdGhpcy4kZHJvcGRvd24pO1xuXG4gICAgLy8gQmluZCBldmVudHNcblxuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIC8vIEJpbmQgdGhlIGNvbnRhaW5lciB0byBhbGwgb2YgdGhlIGFkYXB0ZXJzXG4gICAgdGhpcy5fYmluZEFkYXB0ZXJzKCk7XG5cbiAgICAvLyBSZWdpc3RlciBhbnkgRE9NIGV2ZW50IGhhbmRsZXJzXG4gICAgdGhpcy5fcmVnaXN0ZXJEb21FdmVudHMoKTtcblxuICAgIC8vIFJlZ2lzdGVyIGFueSBpbnRlcm5hbCBldmVudCBoYW5kbGVyc1xuICAgIHRoaXMuX3JlZ2lzdGVyRGF0YUV2ZW50cygpO1xuICAgIHRoaXMuX3JlZ2lzdGVyU2VsZWN0aW9uRXZlbnRzKCk7XG4gICAgdGhpcy5fcmVnaXN0ZXJEcm9wZG93bkV2ZW50cygpO1xuICAgIHRoaXMuX3JlZ2lzdGVyUmVzdWx0c0V2ZW50cygpO1xuICAgIHRoaXMuX3JlZ2lzdGVyRXZlbnRzKCk7XG5cbiAgICAvLyBTZXQgdGhlIGluaXRpYWwgc3RhdGVcbiAgICB0aGlzLmRhdGFBZGFwdGVyLmN1cnJlbnQoZnVuY3Rpb24gKGluaXRpYWxEYXRhKSB7XG4gICAgICBzZWxmLnRyaWdnZXIoJ3NlbGVjdGlvbjp1cGRhdGUnLCB7XG4gICAgICAgIGRhdGE6IGluaXRpYWxEYXRhXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIEhpZGUgdGhlIG9yaWdpbmFsIHNlbGVjdFxuICAgICRlbGVtZW50LmFkZENsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJyk7XG4gICAgJGVsZW1lbnQuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuXG4gICAgLy8gU3luY2hyb25pemUgYW55IG1vbml0b3JlZCBhdHRyaWJ1dGVzXG4gICAgdGhpcy5fc3luY0F0dHJpYnV0ZXMoKTtcblxuICAgICRlbGVtZW50LmRhdGEoJ3NlbGVjdDInLCB0aGlzKTtcbiAgfTtcblxuICBVdGlscy5FeHRlbmQoU2VsZWN0MiwgVXRpbHMuT2JzZXJ2YWJsZSk7XG5cbiAgU2VsZWN0Mi5wcm90b3R5cGUuX2dlbmVyYXRlSWQgPSBmdW5jdGlvbiAoJGVsZW1lbnQpIHtcbiAgICB2YXIgaWQgPSAnJztcblxuICAgIGlmICgkZWxlbWVudC5hdHRyKCdpZCcpICE9IG51bGwpIHtcbiAgICAgIGlkID0gJGVsZW1lbnQuYXR0cignaWQnKTtcbiAgICB9IGVsc2UgaWYgKCRlbGVtZW50LmF0dHIoJ25hbWUnKSAhPSBudWxsKSB7XG4gICAgICBpZCA9ICRlbGVtZW50LmF0dHIoJ25hbWUnKSArICctJyArIFV0aWxzLmdlbmVyYXRlQ2hhcnMoMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlkID0gVXRpbHMuZ2VuZXJhdGVDaGFycyg0KTtcbiAgICB9XG5cbiAgICBpZCA9IGlkLnJlcGxhY2UoLyg6fFxcLnxcXFt8XFxdfCwpL2csICcnKTtcbiAgICBpZCA9ICdzZWxlY3QyLScgKyBpZDtcblxuICAgIHJldHVybiBpZDtcbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5fcGxhY2VDb250YWluZXIgPSBmdW5jdGlvbiAoJGNvbnRhaW5lcikge1xuICAgICRjb250YWluZXIuaW5zZXJ0QWZ0ZXIodGhpcy4kZWxlbWVudCk7XG5cbiAgICB2YXIgd2lkdGggPSB0aGlzLl9yZXNvbHZlV2lkdGgodGhpcy4kZWxlbWVudCwgdGhpcy5vcHRpb25zLmdldCgnd2lkdGgnKSk7XG5cbiAgICBpZiAod2lkdGggIT0gbnVsbCkge1xuICAgICAgJGNvbnRhaW5lci5jc3MoJ3dpZHRoJywgd2lkdGgpO1xuICAgIH1cbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5fcmVzb2x2ZVdpZHRoID0gZnVuY3Rpb24gKCRlbGVtZW50LCBtZXRob2QpIHtcbiAgICB2YXIgV0lEVEggPSAvXndpZHRoOigoWy0rXT8oWzAtOV0qXFwuKT9bMC05XSspKHB4fGVtfGV4fCV8aW58Y218bW18cHR8cGMpKS9pO1xuXG4gICAgaWYgKG1ldGhvZCA9PSAncmVzb2x2ZScpIHtcbiAgICAgIHZhciBzdHlsZVdpZHRoID0gdGhpcy5fcmVzb2x2ZVdpZHRoKCRlbGVtZW50LCAnc3R5bGUnKTtcblxuICAgICAgaWYgKHN0eWxlV2lkdGggIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gc3R5bGVXaWR0aDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX3Jlc29sdmVXaWR0aCgkZWxlbWVudCwgJ2VsZW1lbnQnKTtcbiAgICB9XG5cbiAgICBpZiAobWV0aG9kID09ICdlbGVtZW50Jykge1xuICAgICAgdmFyIGVsZW1lbnRXaWR0aCA9ICRlbGVtZW50Lm91dGVyV2lkdGgoZmFsc2UpO1xuXG4gICAgICBpZiAoZWxlbWVudFdpZHRoIDw9IDApIHtcbiAgICAgICAgcmV0dXJuICdhdXRvJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGVsZW1lbnRXaWR0aCArICdweCc7XG4gICAgfVxuXG4gICAgaWYgKG1ldGhvZCA9PSAnc3R5bGUnKSB7XG4gICAgICB2YXIgc3R5bGUgPSAkZWxlbWVudC5hdHRyKCdzdHlsZScpO1xuXG4gICAgICBpZiAodHlwZW9mKHN0eWxlKSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciBhdHRycyA9IHN0eWxlLnNwbGl0KCc7Jyk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gYXR0cnMubGVuZ3RoOyBpIDwgbDsgaSA9IGkgKyAxKSB7XG4gICAgICAgIHZhciBhdHRyID0gYXR0cnNbaV0ucmVwbGFjZSgvXFxzL2csICcnKTtcbiAgICAgICAgdmFyIG1hdGNoZXMgPSBhdHRyLm1hdGNoKFdJRFRIKTtcblxuICAgICAgICBpZiAobWF0Y2hlcyAhPT0gbnVsbCAmJiBtYXRjaGVzLmxlbmd0aCA+PSAxKSB7XG4gICAgICAgICAgcmV0dXJuIG1hdGNoZXNbMV07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1ldGhvZDtcbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5fYmluZEFkYXB0ZXJzID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZGF0YUFkYXB0ZXIuYmluZCh0aGlzLCB0aGlzLiRjb250YWluZXIpO1xuICAgIHRoaXMuc2VsZWN0aW9uLmJpbmQodGhpcywgdGhpcy4kY29udGFpbmVyKTtcblxuICAgIHRoaXMuZHJvcGRvd24uYmluZCh0aGlzLCB0aGlzLiRjb250YWluZXIpO1xuICAgIHRoaXMucmVzdWx0cy5iaW5kKHRoaXMsIHRoaXMuJGNvbnRhaW5lcik7XG4gIH07XG5cbiAgU2VsZWN0Mi5wcm90b3R5cGUuX3JlZ2lzdGVyRG9tRXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHRoaXMuJGVsZW1lbnQub24oJ2NoYW5nZS5zZWxlY3QyJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5kYXRhQWRhcHRlci5jdXJyZW50KGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHNlbGYudHJpZ2dlcignc2VsZWN0aW9uOnVwZGF0ZScsIHtcbiAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLiRlbGVtZW50Lm9uKCdmb2N1cy5zZWxlY3QyJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgc2VsZi50cmlnZ2VyKCdmb2N1cycsIGV2dCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9zeW5jQSA9IFV0aWxzLmJpbmQodGhpcy5fc3luY0F0dHJpYnV0ZXMsIHRoaXMpO1xuICAgIHRoaXMuX3N5bmNTID0gVXRpbHMuYmluZCh0aGlzLl9zeW5jU3VidHJlZSwgdGhpcyk7XG5cbiAgICBpZiAodGhpcy4kZWxlbWVudFswXS5hdHRhY2hFdmVudCkge1xuICAgICAgdGhpcy4kZWxlbWVudFswXS5hdHRhY2hFdmVudCgnb25wcm9wZXJ0eWNoYW5nZScsIHRoaXMuX3N5bmNBKTtcbiAgICB9XG5cbiAgICB2YXIgb2JzZXJ2ZXIgPSB3aW5kb3cuTXV0YXRpb25PYnNlcnZlciB8fFxuICAgICAgd2luZG93LldlYktpdE11dGF0aW9uT2JzZXJ2ZXIgfHxcbiAgICAgIHdpbmRvdy5Nb3pNdXRhdGlvbk9ic2VydmVyXG4gICAgO1xuXG4gICAgaWYgKG9ic2VydmVyICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX29ic2VydmVyID0gbmV3IG9ic2VydmVyKGZ1bmN0aW9uIChtdXRhdGlvbnMpIHtcbiAgICAgICAgJC5lYWNoKG11dGF0aW9ucywgc2VsZi5fc3luY0EpO1xuICAgICAgICAkLmVhY2gobXV0YXRpb25zLCBzZWxmLl9zeW5jUyk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX29ic2VydmVyLm9ic2VydmUodGhpcy4kZWxlbWVudFswXSwge1xuICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgIHN1YnRyZWU6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuJGVsZW1lbnRbMF0uYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgdGhpcy4kZWxlbWVudFswXS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAnRE9NQXR0ck1vZGlmaWVkJyxcbiAgICAgICAgc2VsZi5fc3luY0EsXG4gICAgICAgIGZhbHNlXG4gICAgICApO1xuICAgICAgdGhpcy4kZWxlbWVudFswXS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAnRE9NTm9kZUluc2VydGVkJyxcbiAgICAgICAgc2VsZi5fc3luY1MsXG4gICAgICAgIGZhbHNlXG4gICAgICApO1xuICAgICAgdGhpcy4kZWxlbWVudFswXS5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAnRE9NTm9kZVJlbW92ZWQnLFxuICAgICAgICBzZWxmLl9zeW5jUyxcbiAgICAgICAgZmFsc2VcbiAgICAgICk7XG4gICAgfVxuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLl9yZWdpc3RlckRhdGFFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdGhpcy5kYXRhQWRhcHRlci5vbignKicsIGZ1bmN0aW9uIChuYW1lLCBwYXJhbXMpIHtcbiAgICAgIHNlbGYudHJpZ2dlcihuYW1lLCBwYXJhbXMpO1xuICAgIH0pO1xuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLl9yZWdpc3RlclNlbGVjdGlvbkV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG5vblJlbGF5RXZlbnRzID0gWyd0b2dnbGUnLCAnZm9jdXMnXTtcblxuICAgIHRoaXMuc2VsZWN0aW9uLm9uKCd0b2dnbGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLnRvZ2dsZURyb3Bkb3duKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnNlbGVjdGlvbi5vbignZm9jdXMnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICBzZWxmLmZvY3VzKHBhcmFtcyk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnNlbGVjdGlvbi5vbignKicsIGZ1bmN0aW9uIChuYW1lLCBwYXJhbXMpIHtcbiAgICAgIGlmICgkLmluQXJyYXkobmFtZSwgbm9uUmVsYXlFdmVudHMpICE9PSAtMSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNlbGYudHJpZ2dlcihuYW1lLCBwYXJhbXMpO1xuICAgIH0pO1xuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLl9yZWdpc3RlckRyb3Bkb3duRXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHRoaXMuZHJvcGRvd24ub24oJyonLCBmdW5jdGlvbiAobmFtZSwgcGFyYW1zKSB7XG4gICAgICBzZWxmLnRyaWdnZXIobmFtZSwgcGFyYW1zKTtcbiAgICB9KTtcbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5fcmVnaXN0ZXJSZXN1bHRzRXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHRoaXMucmVzdWx0cy5vbignKicsIGZ1bmN0aW9uIChuYW1lLCBwYXJhbXMpIHtcbiAgICAgIHNlbGYudHJpZ2dlcihuYW1lLCBwYXJhbXMpO1xuICAgIH0pO1xuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLl9yZWdpc3RlckV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB0aGlzLm9uKCdvcGVuJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi4kY29udGFpbmVyLmFkZENsYXNzKCdzZWxlY3QyLWNvbnRhaW5lci0tb3BlbicpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vbignY2xvc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLiRjb250YWluZXIucmVtb3ZlQ2xhc3MoJ3NlbGVjdDItY29udGFpbmVyLS1vcGVuJyk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9uKCdlbmFibGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLiRjb250YWluZXIucmVtb3ZlQ2xhc3MoJ3NlbGVjdDItY29udGFpbmVyLS1kaXNhYmxlZCcpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vbignZGlzYWJsZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuJGNvbnRhaW5lci5hZGRDbGFzcygnc2VsZWN0Mi1jb250YWluZXItLWRpc2FibGVkJyk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9uKCdibHVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi4kY29udGFpbmVyLnJlbW92ZUNsYXNzKCdzZWxlY3QyLWNvbnRhaW5lci0tZm9jdXMnKTtcbiAgICB9KTtcblxuICAgIHRoaXMub24oJ3F1ZXJ5JywgZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgaWYgKCFzZWxmLmlzT3BlbigpKSB7XG4gICAgICAgIHNlbGYudHJpZ2dlcignb3BlbicsIHt9KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5kYXRhQWRhcHRlci5xdWVyeShwYXJhbXMsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHNlbGYudHJpZ2dlcigncmVzdWx0czphbGwnLCB7XG4gICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICBxdWVyeTogcGFyYW1zXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9uKCdxdWVyeTphcHBlbmQnLCBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICB0aGlzLmRhdGFBZGFwdGVyLnF1ZXJ5KHBhcmFtcywgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgc2VsZi50cmlnZ2VyKCdyZXN1bHRzOmFwcGVuZCcsIHtcbiAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgIHF1ZXJ5OiBwYXJhbXNcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMub24oJ2tleXByZXNzJywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgdmFyIGtleSA9IGV2dC53aGljaDtcblxuICAgICAgaWYgKHNlbGYuaXNPcGVuKCkpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gS0VZUy5FU0MgfHwga2V5ID09PSBLRVlTLlRBQiB8fFxuICAgICAgICAgICAgKGtleSA9PT0gS0VZUy5VUCAmJiBldnQuYWx0S2V5KSkge1xuICAgICAgICAgIHNlbGYuY2xvc2UoKTtcblxuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gS0VZUy5FTlRFUikge1xuICAgICAgICAgIHNlbGYudHJpZ2dlcigncmVzdWx0czpzZWxlY3QnLCB7fSk7XG5cbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSBlbHNlIGlmICgoa2V5ID09PSBLRVlTLlNQQUNFICYmIGV2dC5jdHJsS2V5KSkge1xuICAgICAgICAgIHNlbGYudHJpZ2dlcigncmVzdWx0czp0b2dnbGUnLCB7fSk7XG5cbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09IEtFWVMuVVApIHtcbiAgICAgICAgICBzZWxmLnRyaWdnZXIoJ3Jlc3VsdHM6cHJldmlvdXMnLCB7fSk7XG5cbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09IEtFWVMuRE9XTikge1xuICAgICAgICAgIHNlbGYudHJpZ2dlcigncmVzdWx0czpuZXh0Jywge30pO1xuXG4gICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChrZXkgPT09IEtFWVMuRU5URVIgfHwga2V5ID09PSBLRVlTLlNQQUNFIHx8XG4gICAgICAgICAgICAoa2V5ID09PSBLRVlTLkRPV04gJiYgZXZ0LmFsdEtleSkpIHtcbiAgICAgICAgICBzZWxmLm9wZW4oKTtcblxuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgU2VsZWN0Mi5wcm90b3R5cGUuX3N5bmNBdHRyaWJ1dGVzID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMub3B0aW9ucy5zZXQoJ2Rpc2FibGVkJywgdGhpcy4kZWxlbWVudC5wcm9wKCdkaXNhYmxlZCcpKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuZ2V0KCdkaXNhYmxlZCcpKSB7XG4gICAgICBpZiAodGhpcy5pc09wZW4oKSkge1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudHJpZ2dlcignZGlzYWJsZScsIHt9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50cmlnZ2VyKCdlbmFibGUnLCB7fSk7XG4gICAgfVxuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLl9zeW5jU3VidHJlZSA9IGZ1bmN0aW9uIChldnQsIG11dGF0aW9ucykge1xuICAgIHZhciBjaGFuZ2VkID0gZmFsc2U7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgLy8gSWdub3JlIGFueSBtdXRhdGlvbiBldmVudHMgcmFpc2VkIGZvciBlbGVtZW50cyB0aGF0IGFyZW4ndCBvcHRpb25zIG9yXG4gICAgLy8gb3B0Z3JvdXBzLiBUaGlzIGhhbmRsZXMgdGhlIGNhc2Ugd2hlbiB0aGUgc2VsZWN0IGVsZW1lbnQgaXMgZGVzdHJveWVkXG4gICAgaWYgKFxuICAgICAgZXZ0ICYmIGV2dC50YXJnZXQgJiYgKFxuICAgICAgICBldnQudGFyZ2V0Lm5vZGVOYW1lICE9PSAnT1BUSU9OJyAmJiBldnQudGFyZ2V0Lm5vZGVOYW1lICE9PSAnT1BUR1JPVVAnXG4gICAgICApXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFtdXRhdGlvbnMpIHtcbiAgICAgIC8vIElmIG11dGF0aW9uIGV2ZW50cyBhcmVuJ3Qgc3VwcG9ydGVkLCB0aGVuIHdlIGNhbiBvbmx5IGFzc3VtZSB0aGF0IHRoZVxuICAgICAgLy8gY2hhbmdlIGFmZmVjdGVkIHRoZSBzZWxlY3Rpb25zXG4gICAgICBjaGFuZ2VkID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKG11dGF0aW9ucy5hZGRlZE5vZGVzICYmIG11dGF0aW9ucy5hZGRlZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGZvciAodmFyIG4gPSAwOyBuIDwgbXV0YXRpb25zLmFkZGVkTm9kZXMubGVuZ3RoOyBuKyspIHtcbiAgICAgICAgdmFyIG5vZGUgPSBtdXRhdGlvbnMuYWRkZWROb2Rlc1tuXTtcblxuICAgICAgICBpZiAobm9kZS5zZWxlY3RlZCkge1xuICAgICAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChtdXRhdGlvbnMucmVtb3ZlZE5vZGVzICYmIG11dGF0aW9ucy5yZW1vdmVkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgY2hhbmdlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gT25seSByZS1wdWxsIHRoZSBkYXRhIGlmIHdlIHRoaW5rIHRoZXJlIGlzIGEgY2hhbmdlXG4gICAgaWYgKGNoYW5nZWQpIHtcbiAgICAgIHRoaXMuZGF0YUFkYXB0ZXIuY3VycmVudChmdW5jdGlvbiAoY3VycmVudERhdGEpIHtcbiAgICAgICAgc2VsZi50cmlnZ2VyKCdzZWxlY3Rpb246dXBkYXRlJywge1xuICAgICAgICAgIGRhdGE6IGN1cnJlbnREYXRhXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBPdmVycmlkZSB0aGUgdHJpZ2dlciBtZXRob2QgdG8gYXV0b21hdGljYWxseSB0cmlnZ2VyIHByZS1ldmVudHMgd2hlblxuICAgKiB0aGVyZSBhcmUgZXZlbnRzIHRoYXQgY2FuIGJlIHByZXZlbnRlZC5cbiAgICovXG4gIFNlbGVjdDIucHJvdG90eXBlLnRyaWdnZXIgPSBmdW5jdGlvbiAobmFtZSwgYXJncykge1xuICAgIHZhciBhY3R1YWxUcmlnZ2VyID0gU2VsZWN0Mi5fX3N1cGVyX18udHJpZ2dlcjtcbiAgICB2YXIgcHJlVHJpZ2dlck1hcCA9IHtcbiAgICAgICdvcGVuJzogJ29wZW5pbmcnLFxuICAgICAgJ2Nsb3NlJzogJ2Nsb3NpbmcnLFxuICAgICAgJ3NlbGVjdCc6ICdzZWxlY3RpbmcnLFxuICAgICAgJ3Vuc2VsZWN0JzogJ3Vuc2VsZWN0aW5nJ1xuICAgIH07XG5cbiAgICBpZiAoYXJncyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBhcmdzID0ge307XG4gICAgfVxuXG4gICAgaWYgKG5hbWUgaW4gcHJlVHJpZ2dlck1hcCkge1xuICAgICAgdmFyIHByZVRyaWdnZXJOYW1lID0gcHJlVHJpZ2dlck1hcFtuYW1lXTtcbiAgICAgIHZhciBwcmVUcmlnZ2VyQXJncyA9IHtcbiAgICAgICAgcHJldmVudGVkOiBmYWxzZSxcbiAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgYXJnczogYXJnc1xuICAgICAgfTtcblxuICAgICAgYWN0dWFsVHJpZ2dlci5jYWxsKHRoaXMsIHByZVRyaWdnZXJOYW1lLCBwcmVUcmlnZ2VyQXJncyk7XG5cbiAgICAgIGlmIChwcmVUcmlnZ2VyQXJncy5wcmV2ZW50ZWQpIHtcbiAgICAgICAgYXJncy5wcmV2ZW50ZWQgPSB0cnVlO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhY3R1YWxUcmlnZ2VyLmNhbGwodGhpcywgbmFtZSwgYXJncyk7XG4gIH07XG5cbiAgU2VsZWN0Mi5wcm90b3R5cGUudG9nZ2xlRHJvcGRvd24gPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5nZXQoJ2Rpc2FibGVkJykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc09wZW4oKSkge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wZW4oKTtcbiAgICB9XG4gIH07XG5cbiAgU2VsZWN0Mi5wcm90b3R5cGUub3BlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5pc09wZW4oKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMudHJpZ2dlcigncXVlcnknLCB7fSk7XG4gIH07XG5cbiAgU2VsZWN0Mi5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmlzT3BlbigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy50cmlnZ2VyKCdjbG9zZScsIHt9KTtcbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5pc09wZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuJGNvbnRhaW5lci5oYXNDbGFzcygnc2VsZWN0Mi1jb250YWluZXItLW9wZW4nKTtcbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5oYXNGb2N1cyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy4kY29udGFpbmVyLmhhc0NsYXNzKCdzZWxlY3QyLWNvbnRhaW5lci0tZm9jdXMnKTtcbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5mb2N1cyA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgLy8gTm8gbmVlZCB0byByZS10cmlnZ2VyIGZvY3VzIGV2ZW50cyBpZiB3ZSBhcmUgYWxyZWFkeSBmb2N1c2VkXG4gICAgaWYgKHRoaXMuaGFzRm9jdXMoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuJGNvbnRhaW5lci5hZGRDbGFzcygnc2VsZWN0Mi1jb250YWluZXItLWZvY3VzJyk7XG4gICAgdGhpcy50cmlnZ2VyKCdmb2N1cycsIHt9KTtcbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5lbmFibGUgPSBmdW5jdGlvbiAoYXJncykge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuZ2V0KCdkZWJ1ZycpICYmIHdpbmRvdy5jb25zb2xlICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAnU2VsZWN0MjogVGhlIGBzZWxlY3QyKFwiZW5hYmxlXCIpYCBtZXRob2QgaGFzIGJlZW4gZGVwcmVjYXRlZCBhbmQgd2lsbCcgK1xuICAgICAgICAnIGJlIHJlbW92ZWQgaW4gbGF0ZXIgU2VsZWN0MiB2ZXJzaW9ucy4gVXNlICRlbGVtZW50LnByb3AoXCJkaXNhYmxlZFwiKScgK1xuICAgICAgICAnIGluc3RlYWQuJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoYXJncyA9PSBudWxsIHx8IGFyZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICBhcmdzID0gW3RydWVdO1xuICAgIH1cblxuICAgIHZhciBkaXNhYmxlZCA9ICFhcmdzWzBdO1xuXG4gICAgdGhpcy4kZWxlbWVudC5wcm9wKCdkaXNhYmxlZCcsIGRpc2FibGVkKTtcbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5kYXRhID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuZ2V0KCdkZWJ1ZycpICYmXG4gICAgICAgIGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIHdpbmRvdy5jb25zb2xlICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAnU2VsZWN0MjogRGF0YSBjYW4gbm8gbG9uZ2VyIGJlIHNldCB1c2luZyBgc2VsZWN0MihcImRhdGFcIilgLiBZb3UgJyArXG4gICAgICAgICdzaG91bGQgY29uc2lkZXIgc2V0dGluZyB0aGUgdmFsdWUgaW5zdGVhZCB1c2luZyBgJGVsZW1lbnQudmFsKClgLidcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdmFyIGRhdGEgPSBbXTtcblxuICAgIHRoaXMuZGF0YUFkYXB0ZXIuY3VycmVudChmdW5jdGlvbiAoY3VycmVudERhdGEpIHtcbiAgICAgIGRhdGEgPSBjdXJyZW50RGF0YTtcbiAgICB9KTtcblxuICAgIHJldHVybiBkYXRhO1xuICB9O1xuXG4gIFNlbGVjdDIucHJvdG90eXBlLnZhbCA9IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5nZXQoJ2RlYnVnJykgJiYgd2luZG93LmNvbnNvbGUgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICdTZWxlY3QyOiBUaGUgYHNlbGVjdDIoXCJ2YWxcIilgIG1ldGhvZCBoYXMgYmVlbiBkZXByZWNhdGVkIGFuZCB3aWxsIGJlJyArXG4gICAgICAgICcgcmVtb3ZlZCBpbiBsYXRlciBTZWxlY3QyIHZlcnNpb25zLiBVc2UgJGVsZW1lbnQudmFsKCkgaW5zdGVhZC4nXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChhcmdzID09IG51bGwgfHwgYXJncy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzLiRlbGVtZW50LnZhbCgpO1xuICAgIH1cblxuICAgIHZhciBuZXdWYWwgPSBhcmdzWzBdO1xuXG4gICAgaWYgKCQuaXNBcnJheShuZXdWYWwpKSB7XG4gICAgICBuZXdWYWwgPSAkLm1hcChuZXdWYWwsIGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iai50b1N0cmluZygpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy4kZWxlbWVudC52YWwobmV3VmFsKS50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJGNvbnRhaW5lci5yZW1vdmUoKTtcblxuICAgIGlmICh0aGlzLiRlbGVtZW50WzBdLmRldGFjaEV2ZW50KSB7XG4gICAgICB0aGlzLiRlbGVtZW50WzBdLmRldGFjaEV2ZW50KCdvbnByb3BlcnR5Y2hhbmdlJywgdGhpcy5fc3luY0EpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9vYnNlcnZlciAhPSBudWxsKSB7XG4gICAgICB0aGlzLl9vYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICB0aGlzLl9vYnNlcnZlciA9IG51bGw7XG4gICAgfSBlbHNlIGlmICh0aGlzLiRlbGVtZW50WzBdLnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIHRoaXMuJGVsZW1lbnRbMF1cbiAgICAgICAgLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0RPTUF0dHJNb2RpZmllZCcsIHRoaXMuX3N5bmNBLCBmYWxzZSk7XG4gICAgICB0aGlzLiRlbGVtZW50WzBdXG4gICAgICAgIC5yZW1vdmVFdmVudExpc3RlbmVyKCdET01Ob2RlSW5zZXJ0ZWQnLCB0aGlzLl9zeW5jUywgZmFsc2UpO1xuICAgICAgdGhpcy4kZWxlbWVudFswXVxuICAgICAgICAucmVtb3ZlRXZlbnRMaXN0ZW5lcignRE9NTm9kZVJlbW92ZWQnLCB0aGlzLl9zeW5jUywgZmFsc2UpO1xuICAgIH1cblxuICAgIHRoaXMuX3N5bmNBID0gbnVsbDtcbiAgICB0aGlzLl9zeW5jUyA9IG51bGw7XG5cbiAgICB0aGlzLiRlbGVtZW50Lm9mZignLnNlbGVjdDInKTtcbiAgICB0aGlzLiRlbGVtZW50LmF0dHIoJ3RhYmluZGV4JywgdGhpcy4kZWxlbWVudC5kYXRhKCdvbGQtdGFiaW5kZXgnKSk7XG5cbiAgICB0aGlzLiRlbGVtZW50LnJlbW92ZUNsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJyk7XG4gICAgdGhpcy4kZWxlbWVudC5hdHRyKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlRGF0YSgnc2VsZWN0MicpO1xuXG4gICAgdGhpcy5kYXRhQWRhcHRlci5kZXN0cm95KCk7XG4gICAgdGhpcy5zZWxlY3Rpb24uZGVzdHJveSgpO1xuICAgIHRoaXMuZHJvcGRvd24uZGVzdHJveSgpO1xuICAgIHRoaXMucmVzdWx0cy5kZXN0cm95KCk7XG5cbiAgICB0aGlzLmRhdGFBZGFwdGVyID0gbnVsbDtcbiAgICB0aGlzLnNlbGVjdGlvbiA9IG51bGw7XG4gICAgdGhpcy5kcm9wZG93biA9IG51bGw7XG4gICAgdGhpcy5yZXN1bHRzID0gbnVsbDtcbiAgfTtcblxuICBTZWxlY3QyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyICRjb250YWluZXIgPSAkKFxuICAgICAgJzxzcGFuIGNsYXNzPVwic2VsZWN0MiBzZWxlY3QyLWNvbnRhaW5lclwiPicgK1xuICAgICAgICAnPHNwYW4gY2xhc3M9XCJzZWxlY3Rpb25cIj48L3NwYW4+JyArXG4gICAgICAgICc8c3BhbiBjbGFzcz1cImRyb3Bkb3duLXdyYXBwZXJcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+JyArXG4gICAgICAnPC9zcGFuPidcbiAgICApO1xuXG4gICAgJGNvbnRhaW5lci5hdHRyKCdkaXInLCB0aGlzLm9wdGlvbnMuZ2V0KCdkaXInKSk7XG5cbiAgICB0aGlzLiRjb250YWluZXIgPSAkY29udGFpbmVyO1xuXG4gICAgdGhpcy4kY29udGFpbmVyLmFkZENsYXNzKCdzZWxlY3QyLWNvbnRhaW5lci0tJyArIHRoaXMub3B0aW9ucy5nZXQoJ3RoZW1lJykpO1xuXG4gICAgJGNvbnRhaW5lci5kYXRhKCdlbGVtZW50JywgdGhpcy4kZWxlbWVudCk7XG5cbiAgICByZXR1cm4gJGNvbnRhaW5lcjtcbiAgfTtcblxuICByZXR1cm4gU2VsZWN0Mjtcbn0pO1xuXG5TMi5kZWZpbmUoJ2pxdWVyeS1tb3VzZXdoZWVsJyxbXG4gICdqcXVlcnknXG5dLCBmdW5jdGlvbiAoJCkge1xuICAvLyBVc2VkIHRvIHNoaW0galF1ZXJ5Lm1vdXNld2hlZWwgZm9yIG5vbi1mdWxsIGJ1aWxkcy5cbiAgcmV0dXJuICQ7XG59KTtcblxuUzIuZGVmaW5lKCdqcXVlcnkuc2VsZWN0MicsW1xuICAnanF1ZXJ5JyxcbiAgJ2pxdWVyeS1tb3VzZXdoZWVsJyxcblxuICAnLi9zZWxlY3QyL2NvcmUnLFxuICAnLi9zZWxlY3QyL2RlZmF1bHRzJ1xuXSwgZnVuY3Rpb24gKCQsIF8sIFNlbGVjdDIsIERlZmF1bHRzKSB7XG4gIGlmICgkLmZuLnNlbGVjdDIgPT0gbnVsbCkge1xuICAgIC8vIEFsbCBtZXRob2RzIHRoYXQgc2hvdWxkIHJldHVybiB0aGUgZWxlbWVudFxuICAgIHZhciB0aGlzTWV0aG9kcyA9IFsnb3BlbicsICdjbG9zZScsICdkZXN0cm95J107XG5cbiAgICAkLmZuLnNlbGVjdDIgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgaW5zdGFuY2VPcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIG9wdGlvbnMpO1xuXG4gICAgICAgICAgdmFyIGluc3RhbmNlID0gbmV3IFNlbGVjdDIoJCh0aGlzKSwgaW5zdGFuY2VPcHRpb25zKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJykge1xuICAgICAgICB2YXIgcmV0O1xuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgaW5zdGFuY2UgPSAkKHRoaXMpLmRhdGEoJ3NlbGVjdDInKTtcblxuICAgICAgICAgIGlmIChpbnN0YW5jZSA9PSBudWxsICYmIHdpbmRvdy5jb25zb2xlICYmIGNvbnNvbGUuZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICAgICdUaGUgc2VsZWN0MihcXCcnICsgb3B0aW9ucyArICdcXCcpIG1ldGhvZCB3YXMgY2FsbGVkIG9uIGFuICcgK1xuICAgICAgICAgICAgICAnZWxlbWVudCB0aGF0IGlzIG5vdCB1c2luZyBTZWxlY3QyLidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0ID0gaW5zdGFuY2Vbb3B0aW9uc10uYXBwbHkoaW5zdGFuY2UsIGFyZ3MpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBDaGVjayBpZiB3ZSBzaG91bGQgYmUgcmV0dXJuaW5nIGB0aGlzYFxuICAgICAgICBpZiAoJC5pbkFycmF5KG9wdGlvbnMsIHRoaXNNZXRob2RzKSA+IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGFyZ3VtZW50cyBmb3IgU2VsZWN0MjogJyArIG9wdGlvbnMpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBpZiAoJC5mbi5zZWxlY3QyLmRlZmF1bHRzID09IG51bGwpIHtcbiAgICAkLmZuLnNlbGVjdDIuZGVmYXVsdHMgPSBEZWZhdWx0cztcbiAgfVxuXG4gIHJldHVybiBTZWxlY3QyO1xufSk7XG5cbiAgLy8gUmV0dXJuIHRoZSBBTUQgbG9hZGVyIGNvbmZpZ3VyYXRpb24gc28gaXQgY2FuIGJlIHVzZWQgb3V0c2lkZSBvZiB0aGlzIGZpbGVcbiAgcmV0dXJuIHtcbiAgICBkZWZpbmU6IFMyLmRlZmluZSxcbiAgICByZXF1aXJlOiBTMi5yZXF1aXJlXG4gIH07XG59KCkpO1xuXG4gIC8vIEF1dG9sb2FkIHRoZSBqUXVlcnkgYmluZGluZ3NcbiAgLy8gV2Uga25vdyB0aGF0IGFsbCBvZiB0aGUgbW9kdWxlcyBleGlzdCBhYm92ZSB0aGlzLCBzbyB3ZSdyZSBzYWZlXG4gIHZhciBzZWxlY3QyID0gUzIucmVxdWlyZSgnanF1ZXJ5LnNlbGVjdDInKTtcblxuICAvLyBIb2xkIHRoZSBBTUQgbW9kdWxlIHJlZmVyZW5jZXMgb24gdGhlIGpRdWVyeSBmdW5jdGlvbiB0aGF0IHdhcyBqdXN0IGxvYWRlZFxuICAvLyBUaGlzIGFsbG93cyBTZWxlY3QyIHRvIHVzZSB0aGUgaW50ZXJuYWwgbG9hZGVyIG91dHNpZGUgb2YgdGhpcyBmaWxlLCBzdWNoXG4gIC8vIGFzIGluIHRoZSBsYW5ndWFnZSBmaWxlcy5cbiAgalF1ZXJ5LmZuLnNlbGVjdDIuYW1kID0gUzI7XG5cbiAgLy8gUmV0dXJuIHRoZSBTZWxlY3QyIGluc3RhbmNlIGZvciBhbnlvbmUgd2hvIGlzIGltcG9ydGluZyBpdC5cbiAgcmV0dXJuIHNlbGVjdDI7XG59KSk7XG4iLCIvKlxuICAgICBfIF8gICAgICBfICAgICAgIF9cbiBfX198IChfKSBfX198IHwgX18gIChfKV9fX1xuLyBfX3wgfCB8LyBfX3wgfC8gLyAgfCAvIF9ffFxuXFxfXyBcXCB8IHwgKF9ffCAgIDwgXyB8IFxcX18gXFxcbnxfX18vX3xffFxcX19ffF98XFxfKF8pLyB8X19fL1xuICAgICAgICAgICAgICAgICAgIHxfXy9cblxuIFZlcnNpb246IDEuNi4wXG4gIEF1dGhvcjogS2VuIFdoZWVsZXJcbiBXZWJzaXRlOiBodHRwOi8va2Vud2hlZWxlci5naXRodWIuaW9cbiAgICBEb2NzOiBodHRwOi8va2Vud2hlZWxlci5naXRodWIuaW8vc2xpY2tcbiAgICBSZXBvOiBodHRwOi8vZ2l0aHViLmNvbS9rZW53aGVlbGVyL3NsaWNrXG4gIElzc3VlczogaHR0cDovL2dpdGh1Yi5jb20va2Vud2hlZWxlci9zbGljay9pc3N1ZXNcblxuICovXG4vKiBnbG9iYWwgd2luZG93LCBkb2N1bWVudCwgZGVmaW5lLCBqUXVlcnksIHNldEludGVydmFsLCBjbGVhckludGVydmFsICovXG4oZnVuY3Rpb24oZmFjdG9yeSkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBmYWN0b3J5KGpRdWVyeSk7XG5cbn0oZnVuY3Rpb24oJCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgU2xpY2sgPSB3aW5kb3cuU2xpY2sgfHwge307XG5cbiAgICBTbGljayA9IChmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgaW5zdGFuY2VVaWQgPSAwO1xuXG4gICAgICAgIGZ1bmN0aW9uIFNsaWNrKGVsZW1lbnQsIHNldHRpbmdzKSB7XG5cbiAgICAgICAgICAgIHZhciBfID0gdGhpcywgZGF0YVNldHRpbmdzO1xuXG4gICAgICAgICAgICBfLmRlZmF1bHRzID0ge1xuICAgICAgICAgICAgICAgIGFjY2Vzc2liaWxpdHk6IHRydWUsXG4gICAgICAgICAgICAgICAgYWRhcHRpdmVIZWlnaHQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGFwcGVuZEFycm93czogJChlbGVtZW50KSxcbiAgICAgICAgICAgICAgICBhcHBlbmREb3RzOiAkKGVsZW1lbnQpLFxuICAgICAgICAgICAgICAgIGFycm93czogdHJ1ZSxcbiAgICAgICAgICAgICAgICBhc05hdkZvcjogbnVsbCxcbiAgICAgICAgICAgICAgICBwcmV2QXJyb3c6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXJvbGU9XCJub25lXCIgY2xhc3M9XCJzbGljay1wcmV2XCIgYXJpYS1sYWJlbD1cIlByZXZpb3VzXCIgdGFiaW5kZXg9XCIwXCIgcm9sZT1cImJ1dHRvblwiPlByZXZpb3VzPC9idXR0b24+JyxcbiAgICAgICAgICAgICAgICBuZXh0QXJyb3c6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXJvbGU9XCJub25lXCIgY2xhc3M9XCJzbGljay1uZXh0XCIgYXJpYS1sYWJlbD1cIk5leHRcIiB0YWJpbmRleD1cIjBcIiByb2xlPVwiYnV0dG9uXCI+TmV4dDwvYnV0dG9uPicsXG4gICAgICAgICAgICAgICAgYXV0b3BsYXk6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGF1dG9wbGF5U3BlZWQ6IDMwMDAsXG4gICAgICAgICAgICAgICAgY2VudGVyTW9kZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgY2VudGVyUGFkZGluZzogJzUwcHgnLFxuICAgICAgICAgICAgICAgIGNzc0Vhc2U6ICdlYXNlJyxcbiAgICAgICAgICAgICAgICBjdXN0b21QYWdpbmc6IGZ1bmN0aW9uKHNsaWRlciwgaSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJCgnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1yb2xlPVwibm9uZVwiIHJvbGU9XCJidXR0b25cIiB0YWJpbmRleD1cIjBcIiAvPicpLnRleHQoaSArIDEpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZG90czogZmFsc2UsXG4gICAgICAgICAgICAgICAgZG90c0NsYXNzOiAnc2xpY2stZG90cycsXG4gICAgICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGVhc2luZzogJ2xpbmVhcicsXG4gICAgICAgICAgICAgICAgZWRnZUZyaWN0aW9uOiAwLjM1LFxuICAgICAgICAgICAgICAgIGZhZGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGZvY3VzT25TZWxlY3Q6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGluZmluaXRlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGluaXRpYWxTbGlkZTogMCxcbiAgICAgICAgICAgICAgICBsYXp5TG9hZDogJ29uZGVtYW5kJyxcbiAgICAgICAgICAgICAgICBtb2JpbGVGaXJzdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgcGF1c2VPbkhvdmVyOiB0cnVlLFxuICAgICAgICAgICAgICAgIHBhdXNlT25Gb2N1czogdHJ1ZSxcbiAgICAgICAgICAgICAgICBwYXVzZU9uRG90c0hvdmVyOiBmYWxzZSxcbiAgICAgICAgICAgICAgICByZXNwb25kVG86ICd3aW5kb3cnLFxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IG51bGwsXG4gICAgICAgICAgICAgICAgcm93czogMSxcbiAgICAgICAgICAgICAgICBydGw6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNsaWRlOiAnJyxcbiAgICAgICAgICAgICAgICBzbGlkZXNQZXJSb3c6IDEsXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxuICAgICAgICAgICAgICAgIHNwZWVkOiA1MDAsXG4gICAgICAgICAgICAgICAgc3dpcGU6IHRydWUsXG4gICAgICAgICAgICAgICAgc3dpcGVUb1NsaWRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB0b3VjaE1vdmU6IHRydWUsXG4gICAgICAgICAgICAgICAgdG91Y2hUaHJlc2hvbGQ6IDUsXG4gICAgICAgICAgICAgICAgdXNlQ1NTOiB0cnVlLFxuICAgICAgICAgICAgICAgIHVzZVRyYW5zZm9ybTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB2YXJpYWJsZVdpZHRoOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbDogZmFsc2UsXG4gICAgICAgICAgICAgICAgdmVydGljYWxTd2lwaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB3YWl0Rm9yQW5pbWF0ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDEwMDBcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIF8uaW5pdGlhbHMgPSB7XG4gICAgICAgICAgICAgICAgYW5pbWF0aW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBkcmFnZ2luZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgYXV0b1BsYXlUaW1lcjogbnVsbCxcbiAgICAgICAgICAgICAgICBjdXJyZW50RGlyZWN0aW9uOiAwLFxuICAgICAgICAgICAgICAgIGN1cnJlbnRMZWZ0OiBudWxsLFxuICAgICAgICAgICAgICAgIGN1cnJlbnRTbGlkZTogMCxcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb246IDEsXG4gICAgICAgICAgICAgICAgJGRvdHM6IG51bGwsXG4gICAgICAgICAgICAgICAgbGlzdFdpZHRoOiBudWxsLFxuICAgICAgICAgICAgICAgIGxpc3RIZWlnaHQ6IG51bGwsXG4gICAgICAgICAgICAgICAgbG9hZEluZGV4OiAwLFxuICAgICAgICAgICAgICAgICRuZXh0QXJyb3c6IG51bGwsXG4gICAgICAgICAgICAgICAgJHByZXZBcnJvdzogbnVsbCxcbiAgICAgICAgICAgICAgICBzbGlkZUNvdW50OiBudWxsLFxuICAgICAgICAgICAgICAgIHNsaWRlV2lkdGg6IG51bGwsXG4gICAgICAgICAgICAgICAgJHNsaWRlVHJhY2s6IG51bGwsXG4gICAgICAgICAgICAgICAgJHNsaWRlczogbnVsbCxcbiAgICAgICAgICAgICAgICBzbGlkaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzbGlkZU9mZnNldDogMCxcbiAgICAgICAgICAgICAgICBzd2lwZUxlZnQ6IG51bGwsXG4gICAgICAgICAgICAgICAgJGxpc3Q6IG51bGwsXG4gICAgICAgICAgICAgICAgdG91Y2hPYmplY3Q6IHt9LFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybXNFbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB1bnNsaWNrZWQ6IGZhbHNlXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkLmV4dGVuZChfLCBfLmluaXRpYWxzKTtcblxuICAgICAgICAgICAgXy5hY3RpdmVCcmVha3BvaW50ID0gbnVsbDtcbiAgICAgICAgICAgIF8uYW5pbVR5cGUgPSBudWxsO1xuICAgICAgICAgICAgXy5hbmltUHJvcCA9IG51bGw7XG4gICAgICAgICAgICBfLmJyZWFrcG9pbnRzID0gW107XG4gICAgICAgICAgICBfLmJyZWFrcG9pbnRTZXR0aW5ncyA9IFtdO1xuICAgICAgICAgICAgXy5jc3NUcmFuc2l0aW9ucyA9IGZhbHNlO1xuICAgICAgICAgICAgXy5mb2N1c3NlZCA9IGZhbHNlO1xuICAgICAgICAgICAgXy5pbnRlcnJ1cHRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgXy5oaWRkZW4gPSAnaGlkZGVuJztcbiAgICAgICAgICAgIF8ucGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIF8ucG9zaXRpb25Qcm9wID0gbnVsbDtcbiAgICAgICAgICAgIF8ucmVzcG9uZFRvID0gbnVsbDtcbiAgICAgICAgICAgIF8ucm93Q291bnQgPSAxO1xuICAgICAgICAgICAgXy5zaG91bGRDbGljayA9IHRydWU7XG4gICAgICAgICAgICBfLiRzbGlkZXIgPSAkKGVsZW1lbnQpO1xuICAgICAgICAgICAgXy4kc2xpZGVzQ2FjaGUgPSBudWxsO1xuICAgICAgICAgICAgXy50cmFuc2Zvcm1UeXBlID0gbnVsbDtcbiAgICAgICAgICAgIF8udHJhbnNpdGlvblR5cGUgPSBudWxsO1xuICAgICAgICAgICAgXy52aXNpYmlsaXR5Q2hhbmdlID0gJ3Zpc2liaWxpdHljaGFuZ2UnO1xuICAgICAgICAgICAgXy53aW5kb3dXaWR0aCA9IDA7XG4gICAgICAgICAgICBfLndpbmRvd1RpbWVyID0gbnVsbDtcblxuICAgICAgICAgICAgZGF0YVNldHRpbmdzID0gJChlbGVtZW50KS5kYXRhKCdzbGljaycpIHx8IHt9O1xuXG4gICAgICAgICAgICBfLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgXy5kZWZhdWx0cywgc2V0dGluZ3MsIGRhdGFTZXR0aW5ncyk7XG5cbiAgICAgICAgICAgIF8uY3VycmVudFNsaWRlID0gXy5vcHRpb25zLmluaXRpYWxTbGlkZTtcblxuICAgICAgICAgICAgXy5vcmlnaW5hbFNldHRpbmdzID0gXy5vcHRpb25zO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGRvY3VtZW50Lm1vekhpZGRlbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBfLmhpZGRlbiA9ICdtb3pIaWRkZW4nO1xuICAgICAgICAgICAgICAgIF8udmlzaWJpbGl0eUNoYW5nZSA9ICdtb3p2aXNpYmlsaXR5Y2hhbmdlJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGRvY3VtZW50LndlYmtpdEhpZGRlbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBfLmhpZGRlbiA9ICd3ZWJraXRIaWRkZW4nO1xuICAgICAgICAgICAgICAgIF8udmlzaWJpbGl0eUNoYW5nZSA9ICd3ZWJraXR2aXNpYmlsaXR5Y2hhbmdlJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgXy5hdXRvUGxheSA9ICQucHJveHkoXy5hdXRvUGxheSwgXyk7XG4gICAgICAgICAgICBfLmF1dG9QbGF5Q2xlYXIgPSAkLnByb3h5KF8uYXV0b1BsYXlDbGVhciwgXyk7XG4gICAgICAgICAgICBfLmF1dG9QbGF5SXRlcmF0b3IgPSAkLnByb3h5KF8uYXV0b1BsYXlJdGVyYXRvciwgXyk7XG4gICAgICAgICAgICBfLmNoYW5nZVNsaWRlID0gJC5wcm94eShfLmNoYW5nZVNsaWRlLCBfKTtcbiAgICAgICAgICAgIF8uY2xpY2tIYW5kbGVyID0gJC5wcm94eShfLmNsaWNrSGFuZGxlciwgXyk7XG4gICAgICAgICAgICBfLnNlbGVjdEhhbmRsZXIgPSAkLnByb3h5KF8uc2VsZWN0SGFuZGxlciwgXyk7XG4gICAgICAgICAgICBfLnNldFBvc2l0aW9uID0gJC5wcm94eShfLnNldFBvc2l0aW9uLCBfKTtcbiAgICAgICAgICAgIF8uc3dpcGVIYW5kbGVyID0gJC5wcm94eShfLnN3aXBlSGFuZGxlciwgXyk7XG4gICAgICAgICAgICBfLmRyYWdIYW5kbGVyID0gJC5wcm94eShfLmRyYWdIYW5kbGVyLCBfKTtcbiAgICAgICAgICAgIF8ua2V5SGFuZGxlciA9ICQucHJveHkoXy5rZXlIYW5kbGVyLCBfKTtcblxuICAgICAgICAgICAgXy5pbnN0YW5jZVVpZCA9IGluc3RhbmNlVWlkKys7XG5cbiAgICAgICAgICAgIC8vIEEgc2ltcGxlIHdheSB0byBjaGVjayBmb3IgSFRNTCBzdHJpbmdzXG4gICAgICAgICAgICAvLyBTdHJpY3QgSFRNTCByZWNvZ25pdGlvbiAobXVzdCBzdGFydCB3aXRoIDwpXG4gICAgICAgICAgICAvLyBFeHRyYWN0ZWQgZnJvbSBqUXVlcnkgdjEuMTEgc291cmNlXG4gICAgICAgICAgICBfLmh0bWxFeHByID0gL14oPzpcXHMqKDxbXFx3XFxXXSs+KVtePl0qKSQvO1xuXG5cbiAgICAgICAgICAgIF8ucmVnaXN0ZXJCcmVha3BvaW50cygpO1xuICAgICAgICAgICAgXy5pbml0KHRydWUpO1xuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gU2xpY2s7XG5cbiAgICB9KCkpO1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmFjdGl2YXRlQURBID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBfLiRzbGlkZVRyYWNrLmZpbmQoJy5zbGljay1hY3RpdmUnKS5hdHRyKHtcbiAgICAgICAgICAgICdhcmlhLWhpZGRlbic6ICdmYWxzZSdcbiAgICAgICAgfSkuZmluZCgnYSwgaW5wdXQsIGJ1dHRvbiwgc2VsZWN0JykuYXR0cih7XG4gICAgICAgICAgICAndGFiaW5kZXgnOiAnMCdcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmFkZFNsaWRlID0gU2xpY2sucHJvdG90eXBlLnNsaWNrQWRkID0gZnVuY3Rpb24obWFya3VwLCBpbmRleCwgYWRkQmVmb3JlKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIGlmICh0eXBlb2YoaW5kZXgpID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIGFkZEJlZm9yZSA9IGluZGV4O1xuICAgICAgICAgICAgaW5kZXggPSBudWxsO1xuICAgICAgICB9IGVsc2UgaWYgKGluZGV4IDwgMCB8fCAoaW5kZXggPj0gXy5zbGlkZUNvdW50KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgXy51bmxvYWQoKTtcblxuICAgICAgICBpZiAodHlwZW9mKGluZGV4KSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMCAmJiBfLiRzbGlkZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgJChtYXJrdXApLmFwcGVuZFRvKF8uJHNsaWRlVHJhY2spO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhZGRCZWZvcmUpIHtcbiAgICAgICAgICAgICAgICAkKG1hcmt1cCkuaW5zZXJ0QmVmb3JlKF8uJHNsaWRlcy5lcShpbmRleCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKG1hcmt1cCkuaW5zZXJ0QWZ0ZXIoXy4kc2xpZGVzLmVxKGluZGV4KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoYWRkQmVmb3JlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgJChtYXJrdXApLnByZXBlbmRUbyhfLiRzbGlkZVRyYWNrKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJChtYXJrdXApLmFwcGVuZFRvKF8uJHNsaWRlVHJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgXy4kc2xpZGVzID0gXy4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpO1xuXG4gICAgICAgIF8uJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKS5kZXRhY2goKTtcblxuICAgICAgICBfLiRzbGlkZVRyYWNrLmFwcGVuZChfLiRzbGlkZXMpO1xuXG4gICAgICAgIF8uJHNsaWRlcy5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XG4gICAgICAgICAgICAkKGVsZW1lbnQpLmF0dHIoJ2RhdGEtc2xpY2staW5kZXgnLCBpbmRleCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIF8uJHNsaWRlc0NhY2hlID0gXy4kc2xpZGVzO1xuXG4gICAgICAgIF8ucmVpbml0KCk7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmFuaW1hdGVIZWlnaHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuICAgICAgICBpZiAoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyA9PT0gMSAmJiBfLm9wdGlvbnMuYWRhcHRpdmVIZWlnaHQgPT09IHRydWUgJiYgXy5vcHRpb25zLnZlcnRpY2FsID09PSBmYWxzZSkge1xuICAgICAgICAgICAgdmFyIHRhcmdldEhlaWdodCA9IF8uJHNsaWRlcy5lcShfLmN1cnJlbnRTbGlkZSkub3V0ZXJIZWlnaHQodHJ1ZSk7XG4gICAgICAgICAgICBfLiRsaXN0LmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIGhlaWdodDogdGFyZ2V0SGVpZ2h0XG4gICAgICAgICAgICB9LCBfLm9wdGlvbnMuc3BlZWQpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5hbmltYXRlU2xpZGUgPSBmdW5jdGlvbih0YXJnZXRMZWZ0LCBjYWxsYmFjaykge1xuXG4gICAgICAgIHZhciBhbmltUHJvcHMgPSB7fSxcbiAgICAgICAgICAgIF8gPSB0aGlzO1xuXG4gICAgICAgIF8uYW5pbWF0ZUhlaWdodCgpO1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMucnRsID09PSB0cnVlICYmIF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRhcmdldExlZnQgPSAtdGFyZ2V0TGVmdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXy50cmFuc2Zvcm1zRW5hYmxlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWwgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogdGFyZ2V0TGVmdFxuICAgICAgICAgICAgICAgIH0sIF8ub3B0aW9ucy5zcGVlZCwgXy5vcHRpb25zLmVhc2luZywgY2FsbGJhY2spO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICB0b3A6IHRhcmdldExlZnRcbiAgICAgICAgICAgICAgICB9LCBfLm9wdGlvbnMuc3BlZWQsIF8ub3B0aW9ucy5lYXNpbmcsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICBpZiAoXy5jc3NUcmFuc2l0aW9ucyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoXy5vcHRpb25zLnJ0bCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBfLmN1cnJlbnRMZWZ0ID0gLShfLmN1cnJlbnRMZWZ0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJCh7XG4gICAgICAgICAgICAgICAgICAgIGFuaW1TdGFydDogXy5jdXJyZW50TGVmdFxuICAgICAgICAgICAgICAgIH0pLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICBhbmltU3RhcnQ6IHRhcmdldExlZnRcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBfLm9wdGlvbnMuc3BlZWQsXG4gICAgICAgICAgICAgICAgICAgIGVhc2luZzogXy5vcHRpb25zLmVhc2luZyxcbiAgICAgICAgICAgICAgICAgICAgc3RlcDogZnVuY3Rpb24obm93KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub3cgPSBNYXRoLmNlaWwobm93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWwgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbVByb3BzW18uYW5pbVR5cGVdID0gJ3RyYW5zbGF0ZSgnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm93ICsgJ3B4LCAwcHgpJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNzcyhhbmltUHJvcHMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltUHJvcHNbXy5hbmltVHlwZV0gPSAndHJhbnNsYXRlKDBweCwnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm93ICsgJ3B4KSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jc3MoYW5pbVByb3BzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBfLmFwcGx5VHJhbnNpdGlvbigpO1xuICAgICAgICAgICAgICAgIHRhcmdldExlZnQgPSBNYXRoLmNlaWwodGFyZ2V0TGVmdCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBhbmltUHJvcHNbXy5hbmltVHlwZV0gPSAndHJhbnNsYXRlM2QoJyArIHRhcmdldExlZnQgKyAncHgsIDBweCwgMHB4KSc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYW5pbVByb3BzW18uYW5pbVR5cGVdID0gJ3RyYW5zbGF0ZTNkKDBweCwnICsgdGFyZ2V0TGVmdCArICdweCwgMHB4KSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY3NzKGFuaW1Qcm9wcyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgXy5kaXNhYmxlVHJhbnNpdGlvbigpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIF8ub3B0aW9ucy5zcGVlZCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5nZXROYXZUYXJnZXQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICBhc05hdkZvciA9IF8ub3B0aW9ucy5hc05hdkZvcjtcblxuICAgICAgICBpZiAoIGFzTmF2Rm9yICYmIGFzTmF2Rm9yICE9PSBudWxsICkge1xuICAgICAgICAgICAgYXNOYXZGb3IgPSAkKGFzTmF2Rm9yKS5ub3QoXy4kc2xpZGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhc05hdkZvcjtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuYXNOYXZGb3IgPSBmdW5jdGlvbihpbmRleCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgIGFzTmF2Rm9yID0gXy5nZXROYXZUYXJnZXQoKTtcblxuICAgICAgICBpZiAoIGFzTmF2Rm9yICE9PSBudWxsICYmIHR5cGVvZiBhc05hdkZvciA9PT0gJ29iamVjdCcgKSB7XG4gICAgICAgICAgICBhc05hdkZvci5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSAkKHRoaXMpLnNsaWNrKCdnZXRTbGljaycpO1xuICAgICAgICAgICAgICAgIGlmKCF0YXJnZXQudW5zbGlja2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldC5zbGlkZUhhbmRsZXIoaW5kZXgsIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmFwcGx5VHJhbnNpdGlvbiA9IGZ1bmN0aW9uKHNsaWRlKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgdHJhbnNpdGlvbiA9IHt9O1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZmFkZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRyYW5zaXRpb25bXy50cmFuc2l0aW9uVHlwZV0gPSBfLnRyYW5zZm9ybVR5cGUgKyAnICcgKyBfLm9wdGlvbnMuc3BlZWQgKyAnbXMgJyArIF8ub3B0aW9ucy5jc3NFYXNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHJhbnNpdGlvbltfLnRyYW5zaXRpb25UeXBlXSA9ICdvcGFjaXR5ICcgKyBfLm9wdGlvbnMuc3BlZWQgKyAnbXMgJyArIF8ub3B0aW9ucy5jc3NFYXNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jc3ModHJhbnNpdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfLiRzbGlkZXMuZXEoc2xpZGUpLmNzcyh0cmFuc2l0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5hdXRvUGxheSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBfLmF1dG9QbGF5Q2xlYXIoKTtcblxuICAgICAgICBpZiAoIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgKSB7XG4gICAgICAgICAgICBfLmF1dG9QbGF5VGltZXIgPSBzZXRJbnRlcnZhbCggXy5hdXRvUGxheUl0ZXJhdG9yLCBfLm9wdGlvbnMuYXV0b3BsYXlTcGVlZCApO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmF1dG9QbGF5Q2xlYXIgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgaWYgKF8uYXV0b1BsYXlUaW1lcikge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChfLmF1dG9QbGF5VGltZXIpO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmF1dG9QbGF5SXRlcmF0b3IgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICBzbGlkZVRvID0gXy5jdXJyZW50U2xpZGUgKyBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7XG5cbiAgICAgICAgaWYgKCAhXy5wYXVzZWQgJiYgIV8uaW50ZXJydXB0ZWQgJiYgIV8uZm9jdXNzZWQgKSB7XG5cbiAgICAgICAgICAgIGlmICggXy5vcHRpb25zLmluZmluaXRlID09PSBmYWxzZSApIHtcblxuICAgICAgICAgICAgICAgIGlmICggXy5kaXJlY3Rpb24gPT09IDEgJiYgKCBfLmN1cnJlbnRTbGlkZSArIDEgKSA9PT0gKCBfLnNsaWRlQ291bnQgLSAxICkpIHtcbiAgICAgICAgICAgICAgICAgICAgXy5kaXJlY3Rpb24gPSAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCBfLmRpcmVjdGlvbiA9PT0gMCApIHtcblxuICAgICAgICAgICAgICAgICAgICBzbGlkZVRvID0gXy5jdXJyZW50U2xpZGUgLSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCBfLmN1cnJlbnRTbGlkZSAtIDEgPT09IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfLmRpcmVjdGlvbiA9IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfLnNsaWRlSGFuZGxlciggc2xpZGVUbyApO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuYnVpbGRBcnJvd3MgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5hcnJvd3MgPT09IHRydWUgKSB7XG5cbiAgICAgICAgICAgIF8uJHByZXZBcnJvdyA9ICQoXy5vcHRpb25zLnByZXZBcnJvdykuYWRkQ2xhc3MoJ3NsaWNrLWFycm93Jyk7XG4gICAgICAgICAgICBfLiRuZXh0QXJyb3cgPSAkKF8ub3B0aW9ucy5uZXh0QXJyb3cpLmFkZENsYXNzKCdzbGljay1hcnJvdycpO1xuXG4gICAgICAgICAgICBpZiggXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyApIHtcblxuICAgICAgICAgICAgICAgIF8uJHByZXZBcnJvdy5yZW1vdmVDbGFzcygnc2xpY2staGlkZGVuJykucmVtb3ZlQXR0cignYXJpYS1oaWRkZW4gdGFiaW5kZXgnKTtcbiAgICAgICAgICAgICAgICBfLiRuZXh0QXJyb3cucmVtb3ZlQ2xhc3MoJ3NsaWNrLWhpZGRlbicpLnJlbW92ZUF0dHIoJ2FyaWEtaGlkZGVuIHRhYmluZGV4Jyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoXy5odG1sRXhwci50ZXN0KF8ub3B0aW9ucy5wcmV2QXJyb3cpKSB7XG4gICAgICAgICAgICAgICAgICAgIF8uJHByZXZBcnJvdy5wcmVwZW5kVG8oXy5vcHRpb25zLmFwcGVuZEFycm93cyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKF8uaHRtbEV4cHIudGVzdChfLm9wdGlvbnMubmV4dEFycm93KSkge1xuICAgICAgICAgICAgICAgICAgICBfLiRuZXh0QXJyb3cuYXBwZW5kVG8oXy5vcHRpb25zLmFwcGVuZEFycm93cyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5pbmZpbml0ZSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3dcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stZGlzYWJsZWQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtZGlzYWJsZWQnLCAndHJ1ZScpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIF8uJHByZXZBcnJvdy5hZGQoIF8uJG5leHRBcnJvdyApXG5cbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1oaWRkZW4nKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cih7XG4gICAgICAgICAgICAgICAgICAgICAgICAnYXJpYS1kaXNhYmxlZCc6ICd0cnVlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICd0YWJpbmRleCc6ICctMSdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmJ1aWxkRG90cyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgIGksIGRvdDtcblxuICAgICAgICBpZiAoXy5vcHRpb25zLmRvdHMgPT09IHRydWUgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuXG4gICAgICAgICAgICBfLiRzbGlkZXIuYWRkQ2xhc3MoJ3NsaWNrLWRvdHRlZCcpO1xuXG4gICAgICAgICAgICBkb3QgPSAkKCc8dWwgLz4nKS5hZGRDbGFzcyhfLm9wdGlvbnMuZG90c0NsYXNzKTtcblxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8PSBfLmdldERvdENvdW50KCk7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIGRvdC5hcHBlbmQoJCgnPGxpIC8+JykuYXBwZW5kKF8ub3B0aW9ucy5jdXN0b21QYWdpbmcuY2FsbCh0aGlzLCBfLCBpKSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfLiRkb3RzID0gZG90LmFwcGVuZFRvKF8ub3B0aW9ucy5hcHBlbmREb3RzKTtcblxuICAgICAgICAgICAgXy4kZG90cy5maW5kKCdsaScpLmZpcnN0KCkuYWRkQ2xhc3MoJ3NsaWNrLWFjdGl2ZScpLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5idWlsZE91dCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBfLiRzbGlkZXMgPVxuICAgICAgICAgICAgXy4kc2xpZGVyXG4gICAgICAgICAgICAgICAgLmNoaWxkcmVuKCBfLm9wdGlvbnMuc2xpZGUgKyAnOm5vdCguc2xpY2stY2xvbmVkKScpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1zbGlkZScpO1xuXG4gICAgICAgIF8uc2xpZGVDb3VudCA9IF8uJHNsaWRlcy5sZW5ndGg7XG5cbiAgICAgICAgXy4kc2xpZGVzLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICQoZWxlbWVudClcbiAgICAgICAgICAgICAgICAuYXR0cignZGF0YS1zbGljay1pbmRleCcsIGluZGV4KVxuICAgICAgICAgICAgICAgIC5kYXRhKCdvcmlnaW5hbFN0eWxpbmcnLCAkKGVsZW1lbnQpLmF0dHIoJ3N0eWxlJykgfHwgJycpO1xuICAgICAgICB9KTtcblxuICAgICAgICBfLiRzbGlkZXIuYWRkQ2xhc3MoJ3NsaWNrLXNsaWRlcicpO1xuXG4gICAgICAgIF8uJHNsaWRlVHJhY2sgPSAoXy5zbGlkZUNvdW50ID09PSAwKSA/XG4gICAgICAgICAgICAkKCc8ZGl2IGNsYXNzPVwic2xpY2stdHJhY2tcIi8+JykuYXBwZW5kVG8oXy4kc2xpZGVyKSA6XG4gICAgICAgICAgICBfLiRzbGlkZXMud3JhcEFsbCgnPGRpdiBjbGFzcz1cInNsaWNrLXRyYWNrXCIvPicpLnBhcmVudCgpO1xuXG4gICAgICAgIF8uJGxpc3QgPSBfLiRzbGlkZVRyYWNrLndyYXAoXG4gICAgICAgICAgICAnPGRpdiBhcmlhLWxpdmU9XCJwb2xpdGVcIiBjbGFzcz1cInNsaWNrLWxpc3RcIi8+JykucGFyZW50KCk7XG4gICAgICAgIF8uJHNsaWRlVHJhY2suY3NzKCdvcGFjaXR5JywgMCk7XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlIHx8IF8ub3B0aW9ucy5zd2lwZVRvU2xpZGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCA9IDE7XG4gICAgICAgIH1cblxuICAgICAgICAkKCdpbWdbZGF0YS1sYXp5XScsIF8uJHNsaWRlcikubm90KCdbc3JjXScpLmFkZENsYXNzKCdzbGljay1sb2FkaW5nJyk7XG5cbiAgICAgICAgXy5zZXR1cEluZmluaXRlKCk7XG5cbiAgICAgICAgXy5idWlsZEFycm93cygpO1xuXG4gICAgICAgIF8uYnVpbGREb3RzKCk7XG5cbiAgICAgICAgXy51cGRhdGVEb3RzKCk7XG5cblxuICAgICAgICBfLnNldFNsaWRlQ2xhc3Nlcyh0eXBlb2YgXy5jdXJyZW50U2xpZGUgPT09ICdudW1iZXInID8gXy5jdXJyZW50U2xpZGUgOiAwKTtcblxuICAgICAgICBpZiAoXy5vcHRpb25zLmRyYWdnYWJsZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgXy4kbGlzdC5hZGRDbGFzcygnZHJhZ2dhYmxlJyk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuYnVpbGRSb3dzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLCBhLCBiLCBjLCBuZXdTbGlkZXMsIG51bU9mU2xpZGVzLCBvcmlnaW5hbFNsaWRlcyxzbGlkZXNQZXJTZWN0aW9uO1xuXG4gICAgICAgIG5ld1NsaWRlcyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgb3JpZ2luYWxTbGlkZXMgPSBfLiRzbGlkZXIuY2hpbGRyZW4oKTtcblxuICAgICAgICBpZihfLm9wdGlvbnMucm93cyA+IDEpIHtcblxuICAgICAgICAgICAgc2xpZGVzUGVyU2VjdGlvbiA9IF8ub3B0aW9ucy5zbGlkZXNQZXJSb3cgKiBfLm9wdGlvbnMucm93cztcbiAgICAgICAgICAgIG51bU9mU2xpZGVzID0gTWF0aC5jZWlsKFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsU2xpZGVzLmxlbmd0aCAvIHNsaWRlc1BlclNlY3Rpb25cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGZvcihhID0gMDsgYSA8IG51bU9mU2xpZGVzOyBhKyspe1xuICAgICAgICAgICAgICAgIHZhciBzbGlkZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgIGZvcihiID0gMDsgYiA8IF8ub3B0aW9ucy5yb3dzOyBiKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgICAgICBmb3IoYyA9IDA7IGMgPCBfLm9wdGlvbnMuc2xpZGVzUGVyUm93OyBjKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSAoYSAqIHNsaWRlc1BlclNlY3Rpb24gKyAoKGIgKiBfLm9wdGlvbnMuc2xpZGVzUGVyUm93KSArIGMpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcmlnaW5hbFNsaWRlcy5nZXQodGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdy5hcHBlbmRDaGlsZChvcmlnaW5hbFNsaWRlcy5nZXQodGFyZ2V0KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2xpZGUuYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbmV3U2xpZGVzLmFwcGVuZENoaWxkKHNsaWRlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgXy4kc2xpZGVyLmVtcHR5KCkuYXBwZW5kKG5ld1NsaWRlcyk7XG4gICAgICAgICAgICBfLiRzbGlkZXIuY2hpbGRyZW4oKS5jaGlsZHJlbigpLmNoaWxkcmVuKClcbiAgICAgICAgICAgICAgICAuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzooMTAwIC8gXy5vcHRpb25zLnNsaWRlc1BlclJvdykgKyAnJScsXG4gICAgICAgICAgICAgICAgICAgICdkaXNwbGF5JzogJ2lubGluZS1ibG9jaydcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmNoZWNrUmVzcG9uc2l2ZSA9IGZ1bmN0aW9uKGluaXRpYWwsIGZvcmNlVXBkYXRlKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgYnJlYWtwb2ludCwgdGFyZ2V0QnJlYWtwb2ludCwgcmVzcG9uZFRvV2lkdGgsIHRyaWdnZXJCcmVha3BvaW50ID0gZmFsc2U7XG4gICAgICAgIHZhciBzbGlkZXJXaWR0aCA9IF8uJHNsaWRlci53aWR0aCgpO1xuICAgICAgICB2YXIgd2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCB8fCAkKHdpbmRvdykud2lkdGgoKTtcblxuICAgICAgICBpZiAoXy5yZXNwb25kVG8gPT09ICd3aW5kb3cnKSB7XG4gICAgICAgICAgICByZXNwb25kVG9XaWR0aCA9IHdpbmRvd1dpZHRoO1xuICAgICAgICB9IGVsc2UgaWYgKF8ucmVzcG9uZFRvID09PSAnc2xpZGVyJykge1xuICAgICAgICAgICAgcmVzcG9uZFRvV2lkdGggPSBzbGlkZXJXaWR0aDtcbiAgICAgICAgfSBlbHNlIGlmIChfLnJlc3BvbmRUbyA9PT0gJ21pbicpIHtcbiAgICAgICAgICAgIHJlc3BvbmRUb1dpZHRoID0gTWF0aC5taW4od2luZG93V2lkdGgsIHNsaWRlcldpZHRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggXy5vcHRpb25zLnJlc3BvbnNpdmUgJiZcbiAgICAgICAgICAgIF8ub3B0aW9ucy5yZXNwb25zaXZlLmxlbmd0aCAmJlxuICAgICAgICAgICAgXy5vcHRpb25zLnJlc3BvbnNpdmUgIT09IG51bGwpIHtcblxuICAgICAgICAgICAgdGFyZ2V0QnJlYWtwb2ludCA9IG51bGw7XG5cbiAgICAgICAgICAgIGZvciAoYnJlYWtwb2ludCBpbiBfLmJyZWFrcG9pbnRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKF8uYnJlYWtwb2ludHMuaGFzT3duUHJvcGVydHkoYnJlYWtwb2ludCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF8ub3JpZ2luYWxTZXR0aW5ncy5tb2JpbGVGaXJzdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25kVG9XaWR0aCA8IF8uYnJlYWtwb2ludHNbYnJlYWtwb2ludF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRCcmVha3BvaW50ID0gXy5icmVha3BvaW50c1ticmVha3BvaW50XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25kVG9XaWR0aCA+IF8uYnJlYWtwb2ludHNbYnJlYWtwb2ludF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRCcmVha3BvaW50ID0gXy5icmVha3BvaW50c1ticmVha3BvaW50XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRhcmdldEJyZWFrcG9pbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoXy5hY3RpdmVCcmVha3BvaW50ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRCcmVha3BvaW50ICE9PSBfLmFjdGl2ZUJyZWFrcG9pbnQgfHwgZm9yY2VVcGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uYWN0aXZlQnJlYWtwb2ludCA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0QnJlYWtwb2ludDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfLmJyZWFrcG9pbnRTZXR0aW5nc1t0YXJnZXRCcmVha3BvaW50XSA9PT0gJ3Vuc2xpY2snKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy51bnNsaWNrKHRhcmdldEJyZWFrcG9pbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgXy5vcmlnaW5hbFNldHRpbmdzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmJyZWFrcG9pbnRTZXR0aW5nc1tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEJyZWFrcG9pbnRdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmN1cnJlbnRTbGlkZSA9IF8ub3B0aW9ucy5pbml0aWFsU2xpZGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8ucmVmcmVzaChpbml0aWFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRyaWdnZXJCcmVha3BvaW50ID0gdGFyZ2V0QnJlYWtwb2ludDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIF8uYWN0aXZlQnJlYWtwb2ludCA9IHRhcmdldEJyZWFrcG9pbnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfLmJyZWFrcG9pbnRTZXR0aW5nc1t0YXJnZXRCcmVha3BvaW50XSA9PT0gJ3Vuc2xpY2snKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfLnVuc2xpY2sodGFyZ2V0QnJlYWtwb2ludCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgXy5vcmlnaW5hbFNldHRpbmdzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uYnJlYWtwb2ludFNldHRpbmdzW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRCcmVha3BvaW50XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uY3VycmVudFNsaWRlID0gXy5vcHRpb25zLmluaXRpYWxTbGlkZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF8ucmVmcmVzaChpbml0aWFsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyQnJlYWtwb2ludCA9IHRhcmdldEJyZWFrcG9pbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoXy5hY3RpdmVCcmVha3BvaW50ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIF8uYWN0aXZlQnJlYWtwb2ludCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIF8ub3B0aW9ucyA9IF8ub3JpZ2luYWxTZXR0aW5ncztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluaXRpYWwgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uY3VycmVudFNsaWRlID0gXy5vcHRpb25zLmluaXRpYWxTbGlkZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBfLnJlZnJlc2goaW5pdGlhbCk7XG4gICAgICAgICAgICAgICAgICAgIHRyaWdnZXJCcmVha3BvaW50ID0gdGFyZ2V0QnJlYWtwb2ludDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIG9ubHkgdHJpZ2dlciBicmVha3BvaW50cyBkdXJpbmcgYW4gYWN0dWFsIGJyZWFrLiBub3Qgb24gaW5pdGlhbGl6ZS5cbiAgICAgICAgICAgIGlmKCAhaW5pdGlhbCAmJiB0cmlnZ2VyQnJlYWtwb2ludCAhPT0gZmFsc2UgKSB7XG4gICAgICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ2JyZWFrcG9pbnQnLCBbXywgdHJpZ2dlckJyZWFrcG9pbnRdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5jaGFuZ2VTbGlkZSA9IGZ1bmN0aW9uKGV2ZW50LCBkb250QW5pbWF0ZSkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgICR0YXJnZXQgPSAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLFxuICAgICAgICAgICAgaW5kZXhPZmZzZXQsIHNsaWRlT2Zmc2V0LCB1bmV2ZW5PZmZzZXQ7XG5cbiAgICAgICAgLy8gSWYgdGFyZ2V0IGlzIGEgbGluaywgcHJldmVudCBkZWZhdWx0IGFjdGlvbi5cbiAgICAgICAgaWYoJHRhcmdldC5pcygnYScpKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGFyZ2V0IGlzIG5vdCB0aGUgPGxpPiBlbGVtZW50IChpZTogYSBjaGlsZCksIGZpbmQgdGhlIDxsaT4uXG4gICAgICAgIGlmKCEkdGFyZ2V0LmlzKCdsaScpKSB7XG4gICAgICAgICAgICAkdGFyZ2V0ID0gJHRhcmdldC5jbG9zZXN0KCdsaScpO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5ldmVuT2Zmc2V0ID0gKF8uc2xpZGVDb3VudCAlIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCAhPT0gMCk7XG4gICAgICAgIGluZGV4T2Zmc2V0ID0gdW5ldmVuT2Zmc2V0ID8gMCA6IChfLnNsaWRlQ291bnQgLSBfLmN1cnJlbnRTbGlkZSkgJSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7XG5cbiAgICAgICAgc3dpdGNoIChldmVudC5kYXRhLm1lc3NhZ2UpIHtcblxuICAgICAgICAgICAgY2FzZSAncHJldmlvdXMnOlxuICAgICAgICAgICAgICAgIHNsaWRlT2Zmc2V0ID0gaW5kZXhPZmZzZXQgPT09IDAgPyBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgOiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93IC0gaW5kZXhPZmZzZXQ7XG4gICAgICAgICAgICAgICAgaWYgKF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcbiAgICAgICAgICAgICAgICAgICAgXy5zbGlkZUhhbmRsZXIoXy5jdXJyZW50U2xpZGUgLSBzbGlkZU9mZnNldCwgZmFsc2UsIGRvbnRBbmltYXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ25leHQnOlxuICAgICAgICAgICAgICAgIHNsaWRlT2Zmc2V0ID0gaW5kZXhPZmZzZXQgPT09IDAgPyBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgOiBpbmRleE9mZnNldDtcbiAgICAgICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuICAgICAgICAgICAgICAgICAgICBfLnNsaWRlSGFuZGxlcihfLmN1cnJlbnRTbGlkZSArIHNsaWRlT2Zmc2V0LCBmYWxzZSwgZG9udEFuaW1hdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnaW5kZXgnOlxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IGV2ZW50LmRhdGEuaW5kZXggPT09IDAgPyAwIDpcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuZGF0YS5pbmRleCB8fCAkdGFyZ2V0LmluZGV4KCkgKiBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7XG5cbiAgICAgICAgICAgICAgICBfLnNsaWRlSGFuZGxlcihfLmNoZWNrTmF2aWdhYmxlKGluZGV4KSwgZmFsc2UsIGRvbnRBbmltYXRlKTtcbiAgICAgICAgICAgICAgICAkdGFyZ2V0LmNoaWxkcmVuKCkudHJpZ2dlcignZm9jdXMnKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuY2hlY2tOYXZpZ2FibGUgPSBmdW5jdGlvbihpbmRleCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgIG5hdmlnYWJsZXMsIHByZXZOYXZpZ2FibGU7XG5cbiAgICAgICAgbmF2aWdhYmxlcyA9IF8uZ2V0TmF2aWdhYmxlSW5kZXhlcygpO1xuICAgICAgICBwcmV2TmF2aWdhYmxlID0gMDtcbiAgICAgICAgaWYgKGluZGV4ID4gbmF2aWdhYmxlc1tuYXZpZ2FibGVzLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICBpbmRleCA9IG5hdmlnYWJsZXNbbmF2aWdhYmxlcy5sZW5ndGggLSAxXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAodmFyIG4gaW4gbmF2aWdhYmxlcykge1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IG5hdmlnYWJsZXNbbl0pIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBwcmV2TmF2aWdhYmxlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJldk5hdmlnYWJsZSA9IG5hdmlnYWJsZXNbbl07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5jbGVhblVwRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZG90cyAmJiBfLiRkb3RzICE9PSBudWxsKSB7XG5cbiAgICAgICAgICAgICQoJ2xpJywgXy4kZG90cylcbiAgICAgICAgICAgICAgICAub2ZmKCdjbGljay5zbGljaycsIF8uY2hhbmdlU2xpZGUpXG4gICAgICAgICAgICAgICAgLm9mZignbW91c2VlbnRlci5zbGljaycsICQucHJveHkoXy5pbnRlcnJ1cHQsIF8sIHRydWUpKVxuICAgICAgICAgICAgICAgIC5vZmYoJ21vdXNlbGVhdmUuc2xpY2snLCAkLnByb3h5KF8uaW50ZXJydXB0LCBfLCBmYWxzZSkpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBfLiRzbGlkZXIub2ZmKCdmb2N1cy5zbGljayBibHVyLnNsaWNrJyk7XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5hcnJvd3MgPT09IHRydWUgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuICAgICAgICAgICAgXy4kcHJldkFycm93ICYmIF8uJHByZXZBcnJvdy5vZmYoJ2NsaWNrLnNsaWNrJywgXy5jaGFuZ2VTbGlkZSk7XG4gICAgICAgICAgICBfLiRuZXh0QXJyb3cgJiYgXy4kbmV4dEFycm93Lm9mZignY2xpY2suc2xpY2snLCBfLmNoYW5nZVNsaWRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF8uJGxpc3Qub2ZmKCd0b3VjaHN0YXJ0LnNsaWNrIG1vdXNlZG93bi5zbGljaycsIF8uc3dpcGVIYW5kbGVyKTtcbiAgICAgICAgXy4kbGlzdC5vZmYoJ3RvdWNobW92ZS5zbGljayBtb3VzZW1vdmUuc2xpY2snLCBfLnN3aXBlSGFuZGxlcik7XG4gICAgICAgIF8uJGxpc3Qub2ZmKCd0b3VjaGVuZC5zbGljayBtb3VzZXVwLnNsaWNrJywgXy5zd2lwZUhhbmRsZXIpO1xuICAgICAgICBfLiRsaXN0Lm9mZigndG91Y2hjYW5jZWwuc2xpY2sgbW91c2VsZWF2ZS5zbGljaycsIF8uc3dpcGVIYW5kbGVyKTtcblxuICAgICAgICBfLiRsaXN0Lm9mZignY2xpY2suc2xpY2snLCBfLmNsaWNrSGFuZGxlcik7XG5cbiAgICAgICAgJChkb2N1bWVudCkub2ZmKF8udmlzaWJpbGl0eUNoYW5nZSwgXy52aXNpYmlsaXR5KTtcblxuICAgICAgICBfLmNsZWFuVXBTbGlkZUV2ZW50cygpO1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgXy4kbGlzdC5vZmYoJ2tleWRvd24uc2xpY2snLCBfLmtleUhhbmRsZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5mb2N1c09uU2VsZWN0ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAkKF8uJHNsaWRlVHJhY2spLmNoaWxkcmVuKCkub2ZmKCdjbGljay5zbGljaycsIF8uc2VsZWN0SGFuZGxlcik7XG4gICAgICAgIH1cblxuICAgICAgICAkKHdpbmRvdykub2ZmKCdvcmllbnRhdGlvbmNoYW5nZS5zbGljay5zbGljay0nICsgXy5pbnN0YW5jZVVpZCwgXy5vcmllbnRhdGlvbkNoYW5nZSk7XG5cbiAgICAgICAgJCh3aW5kb3cpLm9mZigncmVzaXplLnNsaWNrLnNsaWNrLScgKyBfLmluc3RhbmNlVWlkLCBfLnJlc2l6ZSk7XG5cbiAgICAgICAgJCgnW2RyYWdnYWJsZSE9dHJ1ZV0nLCBfLiRzbGlkZVRyYWNrKS5vZmYoJ2RyYWdzdGFydCcsIF8ucHJldmVudERlZmF1bHQpO1xuXG4gICAgICAgICQod2luZG93KS5vZmYoJ2xvYWQuc2xpY2suc2xpY2stJyArIF8uaW5zdGFuY2VVaWQsIF8uc2V0UG9zaXRpb24pO1xuICAgICAgICAkKGRvY3VtZW50KS5vZmYoJ3JlYWR5LnNsaWNrLnNsaWNrLScgKyBfLmluc3RhbmNlVWlkLCBfLnNldFBvc2l0aW9uKTtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuY2xlYW5VcFNsaWRlRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIF8uJGxpc3Qub2ZmKCdtb3VzZWVudGVyLnNsaWNrJywgJC5wcm94eShfLmludGVycnVwdCwgXywgdHJ1ZSkpO1xuICAgICAgICBfLiRsaXN0Lm9mZignbW91c2VsZWF2ZS5zbGljaycsICQucHJveHkoXy5pbnRlcnJ1cHQsIF8sIGZhbHNlKSk7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmNsZWFuVXBSb3dzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLCBvcmlnaW5hbFNsaWRlcztcblxuICAgICAgICBpZihfLm9wdGlvbnMucm93cyA+IDEpIHtcbiAgICAgICAgICAgIG9yaWdpbmFsU2xpZGVzID0gXy4kc2xpZGVzLmNoaWxkcmVuKCkuY2hpbGRyZW4oKTtcbiAgICAgICAgICAgIG9yaWdpbmFsU2xpZGVzLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XG4gICAgICAgICAgICBfLiRzbGlkZXIuZW1wdHkoKS5hcHBlbmQob3JpZ2luYWxTbGlkZXMpO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIGlmIChfLnNob3VsZENsaWNrID09PSBmYWxzZSkge1xuICAgICAgICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKHJlZnJlc2gpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgXy5hdXRvUGxheUNsZWFyKCk7XG5cbiAgICAgICAgXy50b3VjaE9iamVjdCA9IHt9O1xuXG4gICAgICAgIF8uY2xlYW5VcEV2ZW50cygpO1xuXG4gICAgICAgICQoJy5zbGljay1jbG9uZWQnLCBfLiRzbGlkZXIpLmRldGFjaCgpO1xuXG4gICAgICAgIGlmIChfLiRkb3RzKSB7XG4gICAgICAgICAgICBfLiRkb3RzLnJlbW92ZSgpO1xuICAgICAgICB9XG5cblxuICAgICAgICBpZiAoIF8uJHByZXZBcnJvdyAmJiBfLiRwcmV2QXJyb3cubGVuZ3RoICkge1xuXG4gICAgICAgICAgICBfLiRwcmV2QXJyb3dcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NsaWNrLWRpc2FibGVkIHNsaWNrLWFycm93IHNsaWNrLWhpZGRlbicpXG4gICAgICAgICAgICAgICAgLnJlbW92ZUF0dHIoJ2FyaWEtaGlkZGVuIGFyaWEtZGlzYWJsZWQgdGFiaW5kZXgnKVxuICAgICAgICAgICAgICAgIC5jc3MoJ2Rpc3BsYXknLCcnKTtcblxuICAgICAgICAgICAgaWYgKCBfLmh0bWxFeHByLnRlc3QoIF8ub3B0aW9ucy5wcmV2QXJyb3cgKSkge1xuICAgICAgICAgICAgICAgIF8uJHByZXZBcnJvdy5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggXy4kbmV4dEFycm93ICYmIF8uJG5leHRBcnJvdy5sZW5ndGggKSB7XG5cbiAgICAgICAgICAgIF8uJG5leHRBcnJvd1xuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnc2xpY2stZGlzYWJsZWQgc2xpY2stYXJyb3cgc2xpY2staGlkZGVuJylcbiAgICAgICAgICAgICAgICAucmVtb3ZlQXR0cignYXJpYS1oaWRkZW4gYXJpYS1kaXNhYmxlZCB0YWJpbmRleCcpXG4gICAgICAgICAgICAgICAgLmNzcygnZGlzcGxheScsJycpO1xuXG4gICAgICAgICAgICBpZiAoIF8uaHRtbEV4cHIudGVzdCggXy5vcHRpb25zLm5leHRBcnJvdyApKSB7XG4gICAgICAgICAgICAgICAgXy4kbmV4dEFycm93LnJlbW92ZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuXG4gICAgICAgIGlmIChfLiRzbGlkZXMpIHtcblxuICAgICAgICAgICAgXy4kc2xpZGVzXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdzbGljay1zbGlkZSBzbGljay1hY3RpdmUgc2xpY2stY2VudGVyIHNsaWNrLXZpc2libGUgc2xpY2stY3VycmVudCcpXG4gICAgICAgICAgICAgICAgLnJlbW92ZUF0dHIoJ2FyaWEtaGlkZGVuJylcbiAgICAgICAgICAgICAgICAucmVtb3ZlQXR0cignZGF0YS1zbGljay1pbmRleCcpXG4gICAgICAgICAgICAgICAgLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdzdHlsZScsICQodGhpcykuZGF0YSgnb3JpZ2luYWxTdHlsaW5nJykpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZGV0YWNoKCk7XG5cbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suZGV0YWNoKCk7XG5cbiAgICAgICAgICAgIF8uJGxpc3QuZGV0YWNoKCk7XG5cbiAgICAgICAgICAgIF8uJHNsaWRlci5hcHBlbmQoXy4kc2xpZGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF8uY2xlYW5VcFJvd3MoKTtcblxuICAgICAgICBfLiRzbGlkZXIucmVtb3ZlQ2xhc3MoJ3NsaWNrLXNsaWRlcicpO1xuICAgICAgICBfLiRzbGlkZXIucmVtb3ZlQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJyk7XG4gICAgICAgIF8uJHNsaWRlci5yZW1vdmVDbGFzcygnc2xpY2stZG90dGVkJyk7XG5cbiAgICAgICAgXy51bnNsaWNrZWQgPSB0cnVlO1xuXG4gICAgICAgIGlmKCFyZWZyZXNoKSB7XG4gICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignZGVzdHJveScsIFtfXSk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuZGlzYWJsZVRyYW5zaXRpb24gPSBmdW5jdGlvbihzbGlkZSkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgIHRyYW5zaXRpb24gPSB7fTtcblxuICAgICAgICB0cmFuc2l0aW9uW18udHJhbnNpdGlvblR5cGVdID0gJyc7XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jc3ModHJhbnNpdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfLiRzbGlkZXMuZXEoc2xpZGUpLmNzcyh0cmFuc2l0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5mYWRlU2xpZGUgPSBmdW5jdGlvbihzbGlkZUluZGV4LCBjYWxsYmFjaykge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBpZiAoXy5jc3NUcmFuc2l0aW9ucyA9PT0gZmFsc2UpIHtcblxuICAgICAgICAgICAgXy4kc2xpZGVzLmVxKHNsaWRlSW5kZXgpLmNzcyh7XG4gICAgICAgICAgICAgICAgekluZGV4OiBfLm9wdGlvbnMuekluZGV4XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgXy4kc2xpZGVzLmVxKHNsaWRlSW5kZXgpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgICAgIH0sIF8ub3B0aW9ucy5zcGVlZCwgXy5vcHRpb25zLmVhc2luZywgY2FsbGJhY2spO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIF8uYXBwbHlUcmFuc2l0aW9uKHNsaWRlSW5kZXgpO1xuXG4gICAgICAgICAgICBfLiRzbGlkZXMuZXEoc2xpZGVJbmRleCkuY3NzKHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgICAgIHpJbmRleDogXy5vcHRpb25zLnpJbmRleFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgXy5kaXNhYmxlVHJhbnNpdGlvbihzbGlkZUluZGV4KTtcblxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKCk7XG4gICAgICAgICAgICAgICAgfSwgXy5vcHRpb25zLnNwZWVkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmZhZGVTbGlkZU91dCA9IGZ1bmN0aW9uKHNsaWRlSW5kZXgpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgaWYgKF8uY3NzVHJhbnNpdGlvbnMgPT09IGZhbHNlKSB7XG5cbiAgICAgICAgICAgIF8uJHNsaWRlcy5lcShzbGlkZUluZGV4KS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICAgICAgICAgIHpJbmRleDogXy5vcHRpb25zLnpJbmRleCAtIDJcbiAgICAgICAgICAgIH0sIF8ub3B0aW9ucy5zcGVlZCwgXy5vcHRpb25zLmVhc2luZyk7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgXy5hcHBseVRyYW5zaXRpb24oc2xpZGVJbmRleCk7XG5cbiAgICAgICAgICAgIF8uJHNsaWRlcy5lcShzbGlkZUluZGV4KS5jc3Moe1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgICAgICAgICAgekluZGV4OiBfLm9wdGlvbnMuekluZGV4IC0gMlxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5maWx0ZXJTbGlkZXMgPSBTbGljay5wcm90b3R5cGUuc2xpY2tGaWx0ZXIgPSBmdW5jdGlvbihmaWx0ZXIpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgaWYgKGZpbHRlciAhPT0gbnVsbCkge1xuXG4gICAgICAgICAgICBfLiRzbGlkZXNDYWNoZSA9IF8uJHNsaWRlcztcblxuICAgICAgICAgICAgXy51bmxvYWQoKTtcblxuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmRldGFjaCgpO1xuXG4gICAgICAgICAgICBfLiRzbGlkZXNDYWNoZS5maWx0ZXIoZmlsdGVyKS5hcHBlbmRUbyhfLiRzbGlkZVRyYWNrKTtcblxuICAgICAgICAgICAgXy5yZWluaXQoKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmZvY3VzSGFuZGxlciA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBfLiRzbGlkZXJcbiAgICAgICAgICAgIC5vZmYoJ2ZvY3VzLnNsaWNrIGJsdXIuc2xpY2snKVxuICAgICAgICAgICAgLm9uKCdmb2N1cy5zbGljayBibHVyLnNsaWNrJyxcbiAgICAgICAgICAgICAgICAnKjpub3QoLnNsaWNrLWFycm93KScsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICAgICAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgdmFyICRzZiA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICBpZiggXy5vcHRpb25zLnBhdXNlT25Gb2N1cyApIHtcbiAgICAgICAgICAgICAgICAgICAgXy5mb2N1c3NlZCA9ICRzZi5pcygnOmZvY3VzJyk7XG4gICAgICAgICAgICAgICAgICAgIF8uYXV0b1BsYXkoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0sIDApO1xuXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuZ2V0Q3VycmVudCA9IFNsaWNrLnByb3RvdHlwZS5zbGlja0N1cnJlbnRTbGlkZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcbiAgICAgICAgcmV0dXJuIF8uY3VycmVudFNsaWRlO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5nZXREb3RDb3VudCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICB2YXIgYnJlYWtQb2ludCA9IDA7XG4gICAgICAgIHZhciBjb3VudGVyID0gMDtcbiAgICAgICAgdmFyIHBhZ2VyUXR5ID0gMDtcblxuICAgICAgICBpZiAoXy5vcHRpb25zLmluZmluaXRlID09PSB0cnVlKSB7XG4gICAgICAgICAgICB3aGlsZSAoYnJlYWtQb2ludCA8IF8uc2xpZGVDb3VudCkge1xuICAgICAgICAgICAgICAgICsrcGFnZXJRdHk7XG4gICAgICAgICAgICAgICAgYnJlYWtQb2ludCA9IGNvdW50ZXIgKyBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7XG4gICAgICAgICAgICAgICAgY291bnRlciArPSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyA/IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCA6IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3c7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHBhZ2VyUXR5ID0gXy5zbGlkZUNvdW50O1xuICAgICAgICB9IGVsc2UgaWYoIV8ub3B0aW9ucy5hc05hdkZvcikge1xuICAgICAgICAgICAgcGFnZXJRdHkgPSAxICsgTWF0aC5jZWlsKChfLnNsaWRlQ291bnQgLSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSAvIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCk7XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIHdoaWxlIChicmVha1BvaW50IDwgXy5zbGlkZUNvdW50KSB7XG4gICAgICAgICAgICAgICAgKytwYWdlclF0eTtcbiAgICAgICAgICAgICAgICBicmVha1BvaW50ID0gY291bnRlciArIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDtcbiAgICAgICAgICAgICAgICBjb3VudGVyICs9IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ID8gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIDogXy5vcHRpb25zLnNsaWRlc1RvU2hvdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYWdlclF0eSAtIDE7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmdldExlZnQgPSBmdW5jdGlvbihzbGlkZUluZGV4KSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgdGFyZ2V0TGVmdCxcbiAgICAgICAgICAgIHZlcnRpY2FsSGVpZ2h0LFxuICAgICAgICAgICAgdmVydGljYWxPZmZzZXQgPSAwLFxuICAgICAgICAgICAgdGFyZ2V0U2xpZGU7XG5cbiAgICAgICAgXy5zbGlkZU9mZnNldCA9IDA7XG4gICAgICAgIHZlcnRpY2FsSGVpZ2h0ID0gXy4kc2xpZGVzLmZpcnN0KCkub3V0ZXJIZWlnaHQodHJ1ZSk7XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgaWYgKF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcbiAgICAgICAgICAgICAgICBfLnNsaWRlT2Zmc2V0ID0gKF8uc2xpZGVXaWR0aCAqIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpICogLTE7XG4gICAgICAgICAgICAgICAgdmVydGljYWxPZmZzZXQgPSAodmVydGljYWxIZWlnaHQgKiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSAqIC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKF8uc2xpZGVDb3VudCAlIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGlmIChzbGlkZUluZGV4ICsgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsID4gXy5zbGlkZUNvdW50ICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNsaWRlSW5kZXggPiBfLnNsaWRlQ291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uc2xpZGVPZmZzZXQgPSAoKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLSAoc2xpZGVJbmRleCAtIF8uc2xpZGVDb3VudCkpICogXy5zbGlkZVdpZHRoKSAqIC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmVydGljYWxPZmZzZXQgPSAoKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLSAoc2xpZGVJbmRleCAtIF8uc2xpZGVDb3VudCkpICogdmVydGljYWxIZWlnaHQpICogLTE7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfLnNsaWRlT2Zmc2V0ID0gKChfLnNsaWRlQ291bnQgJSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpICogXy5zbGlkZVdpZHRoKSAqIC0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmVydGljYWxPZmZzZXQgPSAoKF8uc2xpZGVDb3VudCAlIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCkgKiB2ZXJ0aWNhbEhlaWdodCkgKiAtMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzbGlkZUluZGV4ICsgXy5vcHRpb25zLnNsaWRlc1RvU2hvdyA+IF8uc2xpZGVDb3VudCkge1xuICAgICAgICAgICAgICAgIF8uc2xpZGVPZmZzZXQgPSAoKHNsaWRlSW5kZXggKyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSAtIF8uc2xpZGVDb3VudCkgKiBfLnNsaWRlV2lkdGg7XG4gICAgICAgICAgICAgICAgdmVydGljYWxPZmZzZXQgPSAoKHNsaWRlSW5kZXggKyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSAtIF8uc2xpZGVDb3VudCkgKiB2ZXJ0aWNhbEhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLnNsaWRlQ291bnQgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuICAgICAgICAgICAgXy5zbGlkZU9mZnNldCA9IDA7XG4gICAgICAgICAgICB2ZXJ0aWNhbE9mZnNldCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUgJiYgXy5vcHRpb25zLmluZmluaXRlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBfLnNsaWRlT2Zmc2V0ICs9IF8uc2xpZGVXaWR0aCAqIE1hdGguZmxvb3IoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAvIDIpIC0gXy5zbGlkZVdpZHRoO1xuICAgICAgICB9IGVsc2UgaWYgKF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBfLnNsaWRlT2Zmc2V0ID0gMDtcbiAgICAgICAgICAgIF8uc2xpZGVPZmZzZXQgKz0gXy5zbGlkZVdpZHRoICogTWF0aC5mbG9vcihfLm9wdGlvbnMuc2xpZGVzVG9TaG93IC8gMik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsID09PSBmYWxzZSkge1xuICAgICAgICAgICAgdGFyZ2V0TGVmdCA9ICgoc2xpZGVJbmRleCAqIF8uc2xpZGVXaWR0aCkgKiAtMSkgKyBfLnNsaWRlT2Zmc2V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGFyZ2V0TGVmdCA9ICgoc2xpZGVJbmRleCAqIHZlcnRpY2FsSGVpZ2h0KSAqIC0xKSArIHZlcnRpY2FsT2Zmc2V0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy52YXJpYWJsZVdpZHRoID09PSB0cnVlKSB7XG5cbiAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyB8fCBfLm9wdGlvbnMuaW5maW5pdGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0U2xpZGUgPSBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKCcuc2xpY2stc2xpZGUnKS5lcShzbGlkZUluZGV4KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0U2xpZGUgPSBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKCcuc2xpY2stc2xpZGUnKS5lcShzbGlkZUluZGV4ICsgXy5vcHRpb25zLnNsaWRlc1RvU2hvdyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMucnRsID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldFNsaWRlWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldExlZnQgPSAoXy4kc2xpZGVUcmFjay53aWR0aCgpIC0gdGFyZ2V0U2xpZGVbMF0ub2Zmc2V0TGVmdCAtIHRhcmdldFNsaWRlLndpZHRoKCkpICogLTE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0TGVmdCA9ICAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0TGVmdCA9IHRhcmdldFNsaWRlWzBdID8gdGFyZ2V0U2xpZGVbMF0ub2Zmc2V0TGVmdCAqIC0xIDogMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKF8uc2xpZGVDb3VudCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93IHx8IF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0U2xpZGUgPSBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKCcuc2xpY2stc2xpZGUnKS5lcShzbGlkZUluZGV4KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRTbGlkZSA9IF8uJHNsaWRlVHJhY2suY2hpbGRyZW4oJy5zbGljay1zbGlkZScpLmVxKHNsaWRlSW5kZXggKyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICsgMSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5ydGwgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldFNsaWRlWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRMZWZ0ID0gKF8uJHNsaWRlVHJhY2sud2lkdGgoKSAtIHRhcmdldFNsaWRlWzBdLm9mZnNldExlZnQgLSB0YXJnZXRTbGlkZS53aWR0aCgpKSAqIC0xO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0TGVmdCA9ICAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0TGVmdCA9IHRhcmdldFNsaWRlWzBdID8gdGFyZ2V0U2xpZGVbMF0ub2Zmc2V0TGVmdCAqIC0xIDogMDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0YXJnZXRMZWZ0ICs9IChfLiRsaXN0LndpZHRoKCkgLSB0YXJnZXRTbGlkZS5vdXRlcldpZHRoKCkpIC8gMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0YXJnZXRMZWZ0O1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5nZXRPcHRpb24gPSBTbGljay5wcm90b3R5cGUuc2xpY2tHZXRPcHRpb24gPSBmdW5jdGlvbihvcHRpb24pIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgcmV0dXJuIF8ub3B0aW9uc1tvcHRpb25dO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5nZXROYXZpZ2FibGVJbmRleGVzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgYnJlYWtQb2ludCA9IDAsXG4gICAgICAgICAgICBjb3VudGVyID0gMCxcbiAgICAgICAgICAgIGluZGV4ZXMgPSBbXSxcbiAgICAgICAgICAgIG1heDtcblxuICAgICAgICBpZiAoXy5vcHRpb25zLmluZmluaXRlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgbWF4ID0gXy5zbGlkZUNvdW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYnJlYWtQb2ludCA9IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCAqIC0xO1xuICAgICAgICAgICAgY291bnRlciA9IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCAqIC0xO1xuICAgICAgICAgICAgbWF4ID0gXy5zbGlkZUNvdW50ICogMjtcbiAgICAgICAgfVxuXG4gICAgICAgIHdoaWxlIChicmVha1BvaW50IDwgbWF4KSB7XG4gICAgICAgICAgICBpbmRleGVzLnB1c2goYnJlYWtQb2ludCk7XG4gICAgICAgICAgICBicmVha1BvaW50ID0gY291bnRlciArIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDtcbiAgICAgICAgICAgIGNvdW50ZXIgKz0gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgPyBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgOiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGluZGV4ZXM7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmdldFNsaWNrID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmdldFNsaWRlQ291bnQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICBzbGlkZXNUcmF2ZXJzZWQsIHN3aXBlZFNsaWRlLCBjZW50ZXJPZmZzZXQ7XG5cbiAgICAgICAgY2VudGVyT2Zmc2V0ID0gXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUgPyBfLnNsaWRlV2lkdGggKiBNYXRoLmZsb29yKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLyAyKSA6IDA7XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5zd2lwZVRvU2xpZGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suZmluZCgnLnNsaWNrLXNsaWRlJykuZWFjaChmdW5jdGlvbihpbmRleCwgc2xpZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2xpZGUub2Zmc2V0TGVmdCAtIGNlbnRlck9mZnNldCArICgkKHNsaWRlKS5vdXRlcldpZHRoKCkgLyAyKSA+IChfLnN3aXBlTGVmdCAqIC0xKSkge1xuICAgICAgICAgICAgICAgICAgICBzd2lwZWRTbGlkZSA9IHNsaWRlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHNsaWRlc1RyYXZlcnNlZCA9IE1hdGguYWJzKCQoc3dpcGVkU2xpZGUpLmF0dHIoJ2RhdGEtc2xpY2staW5kZXgnKSAtIF8uY3VycmVudFNsaWRlKSB8fCAxO1xuXG4gICAgICAgICAgICByZXR1cm4gc2xpZGVzVHJhdmVyc2VkO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmdvVG8gPSBTbGljay5wcm90b3R5cGUuc2xpY2tHb1RvID0gZnVuY3Rpb24oc2xpZGUsIGRvbnRBbmltYXRlKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIF8uY2hhbmdlU2xpZGUoe1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdpbmRleCcsXG4gICAgICAgICAgICAgICAgaW5kZXg6IHBhcnNlSW50KHNsaWRlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCBkb250QW5pbWF0ZSk7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbihjcmVhdGlvbikge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBpZiAoISQoXy4kc2xpZGVyKS5oYXNDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKSkge1xuXG4gICAgICAgICAgICAkKF8uJHNsaWRlcikuYWRkQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJyk7XG5cbiAgICAgICAgICAgIF8uYnVpbGRSb3dzKCk7XG4gICAgICAgICAgICBfLmJ1aWxkT3V0KCk7XG4gICAgICAgICAgICBfLnNldFByb3BzKCk7XG4gICAgICAgICAgICBfLnN0YXJ0TG9hZCgpO1xuICAgICAgICAgICAgXy5sb2FkU2xpZGVyKCk7XG4gICAgICAgICAgICBfLmluaXRpYWxpemVFdmVudHMoKTtcbiAgICAgICAgICAgIF8udXBkYXRlQXJyb3dzKCk7XG4gICAgICAgICAgICBfLnVwZGF0ZURvdHMoKTtcbiAgICAgICAgICAgIF8uY2hlY2tSZXNwb25zaXZlKHRydWUpO1xuICAgICAgICAgICAgXy5mb2N1c0hhbmRsZXIoKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNyZWF0aW9uKSB7XG4gICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignaW5pdCcsIFtfXSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXy5vcHRpb25zLmFjY2Vzc2liaWxpdHkgPT09IHRydWUpIHtcbiAgICAgICAgICAgIF8uaW5pdEFEQSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCBfLm9wdGlvbnMuYXV0b3BsYXkgKSB7XG5cbiAgICAgICAgICAgIF8ucGF1c2VkID0gZmFsc2U7XG4gICAgICAgICAgICBfLmF1dG9QbGF5KCk7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5pbml0QURBID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfID0gdGhpcztcbiAgICAgICAgXy4kc2xpZGVzLmFkZChfLiRzbGlkZVRyYWNrLmZpbmQoJy5zbGljay1jbG9uZWQnKSkuYXR0cih7XG4gICAgICAgICAgICAnYXJpYS1oaWRkZW4nOiAndHJ1ZScsXG4gICAgICAgICAgICAndGFiaW5kZXgnOiAnLTEnXG4gICAgICAgIH0pLmZpbmQoJ2EsIGlucHV0LCBidXR0b24sIHNlbGVjdCcpLmF0dHIoe1xuICAgICAgICAgICAgJ3RhYmluZGV4JzogJy0xJ1xuICAgICAgICB9KTtcblxuICAgICAgICBfLiRzbGlkZVRyYWNrLmF0dHIoJ3JvbGUnLCAnbGlzdGJveCcpO1xuXG4gICAgICAgIF8uJHNsaWRlcy5ub3QoXy4kc2xpZGVUcmFjay5maW5kKCcuc2xpY2stY2xvbmVkJykpLmVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgJCh0aGlzKS5hdHRyKHtcbiAgICAgICAgICAgICAgICAncm9sZSc6ICdvcHRpb24nLFxuICAgICAgICAgICAgICAgICdhcmlhLWRlc2NyaWJlZGJ5JzogJ3NsaWNrLXNsaWRlJyArIF8uaW5zdGFuY2VVaWQgKyBpICsgJydcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoXy4kZG90cyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgXy4kZG90cy5hdHRyKCdyb2xlJywgJ3RhYmxpc3QnKS5maW5kKCdsaScpLmVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgICAgICQodGhpcykuYXR0cih7XG4gICAgICAgICAgICAgICAgICAgICdyb2xlJzogJ3ByZXNlbnRhdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICdhcmlhLXNlbGVjdGVkJzogJ2ZhbHNlJyxcbiAgICAgICAgICAgICAgICAgICAgJ2FyaWEtY29udHJvbHMnOiAnbmF2aWdhdGlvbicgKyBfLmluc3RhbmNlVWlkICsgaSArICcnLFxuICAgICAgICAgICAgICAgICAgICAnaWQnOiAnc2xpY2stc2xpZGUnICsgXy5pbnN0YW5jZVVpZCArIGkgKyAnJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZmlyc3QoKS5hdHRyKCdhcmlhLXNlbGVjdGVkJywgJ3RydWUnKS5lbmQoKVxuICAgICAgICAgICAgICAgIC5maW5kKCdidXR0b24nKS5hdHRyKCdyb2xlJywgJ2J1dHRvbicpLmVuZCgpXG4gICAgICAgICAgICAgICAgLmNsb3Nlc3QoJ2RpdicpLmF0dHIoJ3JvbGUnLCAndG9vbGJhcicpO1xuICAgICAgICB9XG4gICAgICAgIF8uYWN0aXZhdGVBREEoKTtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuaW5pdEFycm93RXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuYXJyb3dzID09PSB0cnVlICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcbiAgICAgICAgICAgIF8uJHByZXZBcnJvd1xuICAgICAgICAgICAgICAgLm9mZignY2xpY2suc2xpY2snKVxuICAgICAgICAgICAgICAgLm9uKCdjbGljay5zbGljaycsIHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ3ByZXZpb3VzJ1xuICAgICAgICAgICAgICAgfSwgXy5jaGFuZ2VTbGlkZSk7XG4gICAgICAgICAgICBfLiRuZXh0QXJyb3dcbiAgICAgICAgICAgICAgIC5vZmYoJ2NsaWNrLnNsaWNrJylcbiAgICAgICAgICAgICAgIC5vbignY2xpY2suc2xpY2snLCB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICduZXh0J1xuICAgICAgICAgICAgICAgfSwgXy5jaGFuZ2VTbGlkZSk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuaW5pdERvdEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBpZiAoXy5vcHRpb25zLmRvdHMgPT09IHRydWUgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuICAgICAgICAgICAgJCgnbGknLCBfLiRkb3RzKS5vbignY2xpY2suc2xpY2snLCB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ2luZGV4J1xuICAgICAgICAgICAgfSwgXy5jaGFuZ2VTbGlkZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIF8ub3B0aW9ucy5kb3RzID09PSB0cnVlICYmIF8ub3B0aW9ucy5wYXVzZU9uRG90c0hvdmVyID09PSB0cnVlICkge1xuXG4gICAgICAgICAgICAkKCdsaScsIF8uJGRvdHMpXG4gICAgICAgICAgICAgICAgLm9uKCdtb3VzZWVudGVyLnNsaWNrJywgJC5wcm94eShfLmludGVycnVwdCwgXywgdHJ1ZSkpXG4gICAgICAgICAgICAgICAgLm9uKCdtb3VzZWxlYXZlLnNsaWNrJywgJC5wcm94eShfLmludGVycnVwdCwgXywgZmFsc2UpKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmluaXRTbGlkZUV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBpZiAoIF8ub3B0aW9ucy5wYXVzZU9uSG92ZXIgKSB7XG5cbiAgICAgICAgICAgIF8uJGxpc3Qub24oJ21vdXNlZW50ZXIuc2xpY2snLCAkLnByb3h5KF8uaW50ZXJydXB0LCBfLCB0cnVlKSk7XG4gICAgICAgICAgICBfLiRsaXN0Lm9uKCdtb3VzZWxlYXZlLnNsaWNrJywgJC5wcm94eShfLmludGVycnVwdCwgXywgZmFsc2UpKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmluaXRpYWxpemVFdmVudHMgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgXy5pbml0QXJyb3dFdmVudHMoKTtcblxuICAgICAgICBfLmluaXREb3RFdmVudHMoKTtcbiAgICAgICAgXy5pbml0U2xpZGVFdmVudHMoKTtcblxuICAgICAgICBfLiRsaXN0Lm9uKCd0b3VjaHN0YXJ0LnNsaWNrIG1vdXNlZG93bi5zbGljaycsIHtcbiAgICAgICAgICAgIGFjdGlvbjogJ3N0YXJ0J1xuICAgICAgICB9LCBfLnN3aXBlSGFuZGxlcik7XG4gICAgICAgIF8uJGxpc3Qub24oJ3RvdWNobW92ZS5zbGljayBtb3VzZW1vdmUuc2xpY2snLCB7XG4gICAgICAgICAgICBhY3Rpb246ICdtb3ZlJ1xuICAgICAgICB9LCBfLnN3aXBlSGFuZGxlcik7XG4gICAgICAgIF8uJGxpc3Qub24oJ3RvdWNoZW5kLnNsaWNrIG1vdXNldXAuc2xpY2snLCB7XG4gICAgICAgICAgICBhY3Rpb246ICdlbmQnXG4gICAgICAgIH0sIF8uc3dpcGVIYW5kbGVyKTtcbiAgICAgICAgXy4kbGlzdC5vbigndG91Y2hjYW5jZWwuc2xpY2sgbW91c2VsZWF2ZS5zbGljaycsIHtcbiAgICAgICAgICAgIGFjdGlvbjogJ2VuZCdcbiAgICAgICAgfSwgXy5zd2lwZUhhbmRsZXIpO1xuXG4gICAgICAgIF8uJGxpc3Qub24oJ2NsaWNrLnNsaWNrJywgXy5jbGlja0hhbmRsZXIpO1xuXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKF8udmlzaWJpbGl0eUNoYW5nZSwgJC5wcm94eShfLnZpc2liaWxpdHksIF8pKTtcblxuICAgICAgICBpZiAoXy5vcHRpb25zLmFjY2Vzc2liaWxpdHkgPT09IHRydWUpIHtcbiAgICAgICAgICAgIF8uJGxpc3Qub24oJ2tleWRvd24uc2xpY2snLCBfLmtleUhhbmRsZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5mb2N1c09uU2VsZWN0ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAkKF8uJHNsaWRlVHJhY2spLmNoaWxkcmVuKCkub24oJ2NsaWNrLnNsaWNrJywgXy5zZWxlY3RIYW5kbGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgICQod2luZG93KS5vbignb3JpZW50YXRpb25jaGFuZ2Uuc2xpY2suc2xpY2stJyArIF8uaW5zdGFuY2VVaWQsICQucHJveHkoXy5vcmllbnRhdGlvbkNoYW5nZSwgXykpO1xuXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplLnNsaWNrLnNsaWNrLScgKyBfLmluc3RhbmNlVWlkLCAkLnByb3h5KF8ucmVzaXplLCBfKSk7XG5cbiAgICAgICAgJCgnW2RyYWdnYWJsZSE9dHJ1ZV0nLCBfLiRzbGlkZVRyYWNrKS5vbignZHJhZ3N0YXJ0JywgXy5wcmV2ZW50RGVmYXVsdCk7XG5cbiAgICAgICAgJCh3aW5kb3cpLm9uKCdsb2FkLnNsaWNrLnNsaWNrLScgKyBfLmluc3RhbmNlVWlkLCBfLnNldFBvc2l0aW9uKTtcbiAgICAgICAgJChkb2N1bWVudCkub24oJ3JlYWR5LnNsaWNrLnNsaWNrLScgKyBfLmluc3RhbmNlVWlkLCBfLnNldFBvc2l0aW9uKTtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuaW5pdFVJID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuYXJyb3dzID09PSB0cnVlICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcblxuICAgICAgICAgICAgXy4kcHJldkFycm93LnNob3coKTtcbiAgICAgICAgICAgIF8uJG5leHRBcnJvdy5zaG93KCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZG90cyA9PT0gdHJ1ZSAmJiBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG5cbiAgICAgICAgICAgIF8uJGRvdHMuc2hvdygpO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUua2V5SGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuICAgICAgICAgLy9Eb250IHNsaWRlIGlmIHRoZSBjdXJzb3IgaXMgaW5zaWRlIHRoZSBmb3JtIGZpZWxkcyBhbmQgYXJyb3cga2V5cyBhcmUgcHJlc3NlZFxuICAgICAgICBpZighZXZlbnQudGFyZ2V0LnRhZ05hbWUubWF0Y2goJ1RFWFRBUkVBfElOUFVUfFNFTEVDVCcpKSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzcgJiYgXy5vcHRpb25zLmFjY2Vzc2liaWxpdHkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBfLmNoYW5nZVNsaWRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXy5vcHRpb25zLnJ0bCA9PT0gdHJ1ZSA/ICduZXh0JyA6ICAncHJldmlvdXMnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzkgJiYgXy5vcHRpb25zLmFjY2Vzc2liaWxpdHkgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBfLmNoYW5nZVNsaWRlKHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXy5vcHRpb25zLnJ0bCA9PT0gdHJ1ZSA/ICdwcmV2aW91cycgOiAnbmV4dCdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmxhenlMb2FkID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgbG9hZFJhbmdlLCBjbG9uZVJhbmdlLCByYW5nZVN0YXJ0LCByYW5nZUVuZDtcblxuICAgICAgICBmdW5jdGlvbiBsb2FkSW1hZ2VzKGltYWdlc1Njb3BlKSB7XG5cbiAgICAgICAgICAgICQoJ2ltZ1tkYXRhLWxhenldJywgaW1hZ2VzU2NvcGUpLmVhY2goZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICBpbWFnZVNvdXJjZSA9ICQodGhpcykuYXR0cignZGF0YS1sYXp5JyksXG4gICAgICAgICAgICAgICAgICAgIGltYWdlVG9Mb2FkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG5cbiAgICAgICAgICAgICAgICBpbWFnZVRvTG9hZC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgICAgICBpbWFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFuaW1hdGUoeyBvcGFjaXR5OiAwIH0sIDEwMCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3NyYycsIGltYWdlU291cmNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYW5pbWF0ZSh7IG9wYWNpdHk6IDEgfSwgMjAwLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUF0dHIoJ2RhdGEtbGF6eScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdzbGljay1sb2FkaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdsYXp5TG9hZGVkJywgW18sIGltYWdlLCBpbWFnZVNvdXJjZV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgaW1hZ2VUb0xvYWQub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGltYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQXR0ciggJ2RhdGEtbGF6eScgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCAnc2xpY2stbG9hZGluZycgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCAnc2xpY2stbGF6eWxvYWQtZXJyb3InICk7XG5cbiAgICAgICAgICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ2xhenlMb2FkRXJyb3InLCBbIF8sIGltYWdlLCBpbWFnZVNvdXJjZSBdKTtcblxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBpbWFnZVRvTG9hZC5zcmMgPSBpbWFnZVNvdXJjZTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJhbmdlU3RhcnQgPSBfLmN1cnJlbnRTbGlkZSArIChfLm9wdGlvbnMuc2xpZGVzVG9TaG93IC8gMiArIDEpO1xuICAgICAgICAgICAgICAgIHJhbmdlRW5kID0gcmFuZ2VTdGFydCArIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgKyAyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByYW5nZVN0YXJ0ID0gTWF0aC5tYXgoMCwgXy5jdXJyZW50U2xpZGUgLSAoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAvIDIgKyAxKSk7XG4gICAgICAgICAgICAgICAgcmFuZ2VFbmQgPSAyICsgKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLyAyICsgMSkgKyBfLmN1cnJlbnRTbGlkZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJhbmdlU3RhcnQgPSBfLm9wdGlvbnMuaW5maW5pdGUgPyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICsgXy5jdXJyZW50U2xpZGUgOiBfLmN1cnJlbnRTbGlkZTtcbiAgICAgICAgICAgIHJhbmdlRW5kID0gTWF0aC5jZWlsKHJhbmdlU3RhcnQgKyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KTtcbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuZmFkZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChyYW5nZVN0YXJ0ID4gMCkgcmFuZ2VTdGFydC0tO1xuICAgICAgICAgICAgICAgIGlmIChyYW5nZUVuZCA8PSBfLnNsaWRlQ291bnQpIHJhbmdlRW5kKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsb2FkUmFuZ2UgPSBfLiRzbGlkZXIuZmluZCgnLnNsaWNrLXNsaWRlJykuc2xpY2UocmFuZ2VTdGFydCwgcmFuZ2VFbmQpO1xuICAgICAgICBsb2FkSW1hZ2VzKGxvYWRSYW5nZSk7XG5cbiAgICAgICAgaWYgKF8uc2xpZGVDb3VudCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG4gICAgICAgICAgICBjbG9uZVJhbmdlID0gXy4kc2xpZGVyLmZpbmQoJy5zbGljay1zbGlkZScpO1xuICAgICAgICAgICAgbG9hZEltYWdlcyhjbG9uZVJhbmdlKTtcbiAgICAgICAgfSBlbHNlXG4gICAgICAgIGlmIChfLmN1cnJlbnRTbGlkZSA+PSBfLnNsaWRlQ291bnQgLSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG4gICAgICAgICAgICBjbG9uZVJhbmdlID0gXy4kc2xpZGVyLmZpbmQoJy5zbGljay1jbG9uZWQnKS5zbGljZSgwLCBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KTtcbiAgICAgICAgICAgIGxvYWRJbWFnZXMoY2xvbmVSYW5nZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoXy5jdXJyZW50U2xpZGUgPT09IDApIHtcbiAgICAgICAgICAgIGNsb25lUmFuZ2UgPSBfLiRzbGlkZXIuZmluZCgnLnNsaWNrLWNsb25lZCcpLnNsaWNlKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgKiAtMSk7XG4gICAgICAgICAgICBsb2FkSW1hZ2VzKGNsb25lUmFuZ2UpO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLmxvYWRTbGlkZXIgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgXy5zZXRQb3NpdGlvbigpO1xuXG4gICAgICAgIF8uJHNsaWRlVHJhY2suY3NzKHtcbiAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgfSk7XG5cbiAgICAgICAgXy4kc2xpZGVyLnJlbW92ZUNsYXNzKCdzbGljay1sb2FkaW5nJyk7XG5cbiAgICAgICAgXy5pbml0VUkoKTtcblxuICAgICAgICBpZiAoXy5vcHRpb25zLmxhenlMb2FkID09PSAncHJvZ3Jlc3NpdmUnKSB7XG4gICAgICAgICAgICBfLnByb2dyZXNzaXZlTGF6eUxvYWQoKTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5uZXh0ID0gU2xpY2sucHJvdG90eXBlLnNsaWNrTmV4dCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBfLmNoYW5nZVNsaWRlKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnbmV4dCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLm9yaWVudGF0aW9uQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIF8uY2hlY2tSZXNwb25zaXZlKCk7XG4gICAgICAgIF8uc2V0UG9zaXRpb24oKTtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUucGF1c2UgPSBTbGljay5wcm90b3R5cGUuc2xpY2tQYXVzZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBfLmF1dG9QbGF5Q2xlYXIoKTtcbiAgICAgICAgXy5wYXVzZWQgPSB0cnVlO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5wbGF5ID0gU2xpY2sucHJvdG90eXBlLnNsaWNrUGxheSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBfLmF1dG9QbGF5KCk7XG4gICAgICAgIF8ub3B0aW9ucy5hdXRvcGxheSA9IHRydWU7XG4gICAgICAgIF8ucGF1c2VkID0gZmFsc2U7XG4gICAgICAgIF8uZm9jdXNzZWQgPSBmYWxzZTtcbiAgICAgICAgXy5pbnRlcnJ1cHRlZCA9IGZhbHNlO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5wb3N0U2xpZGUgPSBmdW5jdGlvbihpbmRleCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBpZiggIV8udW5zbGlja2VkICkge1xuXG4gICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignYWZ0ZXJDaGFuZ2UnLCBbXywgaW5kZXhdKTtcblxuICAgICAgICAgICAgXy5hbmltYXRpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgXy5zZXRQb3NpdGlvbigpO1xuXG4gICAgICAgICAgICBfLnN3aXBlTGVmdCA9IG51bGw7XG5cbiAgICAgICAgICAgIGlmICggXy5vcHRpb25zLmF1dG9wbGF5ICkge1xuICAgICAgICAgICAgICAgIF8uYXV0b1BsYXkoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5hY2Nlc3NpYmlsaXR5ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgXy5pbml0QURBKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5wcmV2ID0gU2xpY2sucHJvdG90eXBlLnNsaWNrUHJldiA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBfLmNoYW5nZVNsaWRlKHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAncHJldmlvdXMnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5wcmV2ZW50RGVmYXVsdCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUucHJvZ3Jlc3NpdmVMYXp5TG9hZCA9IGZ1bmN0aW9uKCB0cnlDb3VudCApIHtcblxuICAgICAgICB0cnlDb3VudCA9IHRyeUNvdW50IHx8IDE7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgJGltZ3NUb0xvYWQgPSAkKCAnaW1nW2RhdGEtbGF6eV0nLCBfLiRzbGlkZXIgKSxcbiAgICAgICAgICAgIGltYWdlLFxuICAgICAgICAgICAgaW1hZ2VTb3VyY2UsXG4gICAgICAgICAgICBpbWFnZVRvTG9hZDtcblxuICAgICAgICBpZiAoICRpbWdzVG9Mb2FkLmxlbmd0aCApIHtcblxuICAgICAgICAgICAgaW1hZ2UgPSAkaW1nc1RvTG9hZC5maXJzdCgpO1xuICAgICAgICAgICAgaW1hZ2VTb3VyY2UgPSBpbWFnZS5hdHRyKCdkYXRhLWxhenknKTtcbiAgICAgICAgICAgIGltYWdlVG9Mb2FkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG5cbiAgICAgICAgICAgIGltYWdlVG9Mb2FkLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgaW1hZ2VcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoICdzcmMnLCBpbWFnZVNvdXJjZSApXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCdkYXRhLWxhenknKVxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NsaWNrLWxvYWRpbmcnKTtcblxuICAgICAgICAgICAgICAgIGlmICggXy5vcHRpb25zLmFkYXB0aXZlSGVpZ2h0ID09PSB0cnVlICkge1xuICAgICAgICAgICAgICAgICAgICBfLnNldFBvc2l0aW9uKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ2xhenlMb2FkZWQnLCBbIF8sIGltYWdlLCBpbWFnZVNvdXJjZSBdKTtcbiAgICAgICAgICAgICAgICBfLnByb2dyZXNzaXZlTGF6eUxvYWQoKTtcblxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaW1hZ2VUb0xvYWQub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgaWYgKCB0cnlDb3VudCA8IDMgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAqIHRyeSB0byBsb2FkIHRoZSBpbWFnZSAzIHRpbWVzLFxuICAgICAgICAgICAgICAgICAgICAgKiBsZWF2ZSBhIHNsaWdodCBkZWxheSBzbyB3ZSBkb24ndCBnZXRcbiAgICAgICAgICAgICAgICAgICAgICogc2VydmVycyBibG9ja2luZyB0aGUgcmVxdWVzdC5cbiAgICAgICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgXy5wcm9ncmVzc2l2ZUxhenlMb2FkKCB0cnlDb3VudCArIDEgKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgNTAwICk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIGltYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQXR0ciggJ2RhdGEtbGF6eScgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCAnc2xpY2stbG9hZGluZycgKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCAnc2xpY2stbGF6eWxvYWQtZXJyb3InICk7XG5cbiAgICAgICAgICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ2xhenlMb2FkRXJyb3InLCBbIF8sIGltYWdlLCBpbWFnZVNvdXJjZSBdKTtcblxuICAgICAgICAgICAgICAgICAgICBfLnByb2dyZXNzaXZlTGF6eUxvYWQoKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaW1hZ2VUb0xvYWQuc3JjID0gaW1hZ2VTb3VyY2U7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ2FsbEltYWdlc0xvYWRlZCcsIFsgXyBdKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnJlZnJlc2ggPSBmdW5jdGlvbiggaW5pdGlhbGl6aW5nICkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcywgY3VycmVudFNsaWRlLCBsYXN0VmlzaWJsZUluZGV4O1xuXG4gICAgICAgIGxhc3RWaXNpYmxlSW5kZXggPSBfLnNsaWRlQ291bnQgLSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93O1xuXG4gICAgICAgIC8vIGluIG5vbi1pbmZpbml0ZSBzbGlkZXJzLCB3ZSBkb24ndCB3YW50IHRvIGdvIHBhc3QgdGhlXG4gICAgICAgIC8vIGxhc3QgdmlzaWJsZSBpbmRleC5cbiAgICAgICAgaWYoICFfLm9wdGlvbnMuaW5maW5pdGUgJiYgKCBfLmN1cnJlbnRTbGlkZSA+IGxhc3RWaXNpYmxlSW5kZXggKSkge1xuICAgICAgICAgICAgXy5jdXJyZW50U2xpZGUgPSBsYXN0VmlzaWJsZUluZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgbGVzcyBzbGlkZXMgdGhhbiB0byBzaG93LCBnbyB0byBzdGFydC5cbiAgICAgICAgaWYgKCBfLnNsaWRlQ291bnQgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyApIHtcbiAgICAgICAgICAgIF8uY3VycmVudFNsaWRlID0gMDtcblxuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudFNsaWRlID0gXy5jdXJyZW50U2xpZGU7XG5cbiAgICAgICAgXy5kZXN0cm95KHRydWUpO1xuXG4gICAgICAgICQuZXh0ZW5kKF8sIF8uaW5pdGlhbHMsIHsgY3VycmVudFNsaWRlOiBjdXJyZW50U2xpZGUgfSk7XG5cbiAgICAgICAgXy5pbml0KCk7XG5cbiAgICAgICAgaWYoICFpbml0aWFsaXppbmcgKSB7XG5cbiAgICAgICAgICAgIF8uY2hhbmdlU2xpZGUoe1xuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ2luZGV4JyxcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGN1cnJlbnRTbGlkZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGZhbHNlKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnJlZ2lzdGVyQnJlYWtwb2ludHMgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXMsIGJyZWFrcG9pbnQsIGN1cnJlbnRCcmVha3BvaW50LCBsLFxuICAgICAgICAgICAgcmVzcG9uc2l2ZVNldHRpbmdzID0gXy5vcHRpb25zLnJlc3BvbnNpdmUgfHwgbnVsbDtcblxuICAgICAgICBpZiAoICQudHlwZShyZXNwb25zaXZlU2V0dGluZ3MpID09PSAnYXJyYXknICYmIHJlc3BvbnNpdmVTZXR0aW5ncy5sZW5ndGggKSB7XG5cbiAgICAgICAgICAgIF8ucmVzcG9uZFRvID0gXy5vcHRpb25zLnJlc3BvbmRUbyB8fCAnd2luZG93JztcblxuICAgICAgICAgICAgZm9yICggYnJlYWtwb2ludCBpbiByZXNwb25zaXZlU2V0dGluZ3MgKSB7XG5cbiAgICAgICAgICAgICAgICBsID0gXy5icmVha3BvaW50cy5sZW5ndGgtMTtcbiAgICAgICAgICAgICAgICBjdXJyZW50QnJlYWtwb2ludCA9IHJlc3BvbnNpdmVTZXR0aW5nc1ticmVha3BvaW50XS5icmVha3BvaW50O1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNpdmVTZXR0aW5ncy5oYXNPd25Qcm9wZXJ0eShicmVha3BvaW50KSkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgYnJlYWtwb2ludHMgYW5kIGN1dCBvdXQgYW55IGV4aXN0aW5nXG4gICAgICAgICAgICAgICAgICAgIC8vIG9uZXMgd2l0aCB0aGUgc2FtZSBicmVha3BvaW50IG51bWJlciwgd2UgZG9uJ3Qgd2FudCBkdXBlcy5cbiAgICAgICAgICAgICAgICAgICAgd2hpbGUoIGwgPj0gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBfLmJyZWFrcG9pbnRzW2xdICYmIF8uYnJlYWtwb2ludHNbbF0gPT09IGN1cnJlbnRCcmVha3BvaW50ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uYnJlYWtwb2ludHMuc3BsaWNlKGwsMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBsLS07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBfLmJyZWFrcG9pbnRzLnB1c2goY3VycmVudEJyZWFrcG9pbnQpO1xuICAgICAgICAgICAgICAgICAgICBfLmJyZWFrcG9pbnRTZXR0aW5nc1tjdXJyZW50QnJlYWtwb2ludF0gPSByZXNwb25zaXZlU2V0dGluZ3NbYnJlYWtwb2ludF0uc2V0dGluZ3M7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgXy5icmVha3BvaW50cy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKCBfLm9wdGlvbnMubW9iaWxlRmlyc3QgKSA/IGEtYiA6IGItYTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUucmVpbml0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIF8uJHNsaWRlcyA9XG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrXG4gICAgICAgICAgICAgICAgLmNoaWxkcmVuKF8ub3B0aW9ucy5zbGlkZSlcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLXNsaWRlJyk7XG5cbiAgICAgICAgXy5zbGlkZUNvdW50ID0gXy4kc2xpZGVzLmxlbmd0aDtcblxuICAgICAgICBpZiAoXy5jdXJyZW50U2xpZGUgPj0gXy5zbGlkZUNvdW50ICYmIF8uY3VycmVudFNsaWRlICE9PSAwKSB7XG4gICAgICAgICAgICBfLmN1cnJlbnRTbGlkZSA9IF8uY3VycmVudFNsaWRlIC0gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF8uc2xpZGVDb3VudCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG4gICAgICAgICAgICBfLmN1cnJlbnRTbGlkZSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBfLnJlZ2lzdGVyQnJlYWtwb2ludHMoKTtcblxuICAgICAgICBfLnNldFByb3BzKCk7XG4gICAgICAgIF8uc2V0dXBJbmZpbml0ZSgpO1xuICAgICAgICBfLmJ1aWxkQXJyb3dzKCk7XG4gICAgICAgIF8udXBkYXRlQXJyb3dzKCk7XG4gICAgICAgIF8uaW5pdEFycm93RXZlbnRzKCk7XG4gICAgICAgIF8uYnVpbGREb3RzKCk7XG4gICAgICAgIF8udXBkYXRlRG90cygpO1xuICAgICAgICBfLmluaXREb3RFdmVudHMoKTtcbiAgICAgICAgXy5jbGVhblVwU2xpZGVFdmVudHMoKTtcbiAgICAgICAgXy5pbml0U2xpZGVFdmVudHMoKTtcblxuICAgICAgICBfLmNoZWNrUmVzcG9uc2l2ZShmYWxzZSwgdHJ1ZSk7XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5mb2N1c09uU2VsZWN0ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAkKF8uJHNsaWRlVHJhY2spLmNoaWxkcmVuKCkub24oJ2NsaWNrLnNsaWNrJywgXy5zZWxlY3RIYW5kbGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF8uc2V0U2xpZGVDbGFzc2VzKHR5cGVvZiBfLmN1cnJlbnRTbGlkZSA9PT0gJ251bWJlcicgPyBfLmN1cnJlbnRTbGlkZSA6IDApO1xuXG4gICAgICAgIF8uc2V0UG9zaXRpb24oKTtcbiAgICAgICAgXy5mb2N1c0hhbmRsZXIoKTtcblxuICAgICAgICBfLnBhdXNlZCA9ICFfLm9wdGlvbnMuYXV0b3BsYXk7XG4gICAgICAgIF8uYXV0b1BsYXkoKTtcblxuICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcigncmVJbml0JywgW19dKTtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSAhPT0gXy53aW5kb3dXaWR0aCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KF8ud2luZG93RGVsYXkpO1xuICAgICAgICAgICAgXy53aW5kb3dEZWxheSA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIF8ud2luZG93V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcbiAgICAgICAgICAgICAgICBfLmNoZWNrUmVzcG9uc2l2ZSgpO1xuICAgICAgICAgICAgICAgIGlmKCAhXy51bnNsaWNrZWQgKSB7IF8uc2V0UG9zaXRpb24oKTsgfVxuICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5yZW1vdmVTbGlkZSA9IFNsaWNrLnByb3RvdHlwZS5zbGlja1JlbW92ZSA9IGZ1bmN0aW9uKGluZGV4LCByZW1vdmVCZWZvcmUsIHJlbW92ZUFsbCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBpZiAodHlwZW9mKGluZGV4KSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICByZW1vdmVCZWZvcmUgPSBpbmRleDtcbiAgICAgICAgICAgIGluZGV4ID0gcmVtb3ZlQmVmb3JlID09PSB0cnVlID8gMCA6IF8uc2xpZGVDb3VudCAtIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbmRleCA9IHJlbW92ZUJlZm9yZSA9PT0gdHJ1ZSA/IC0taW5kZXggOiBpbmRleDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLnNsaWRlQ291bnQgPCAxIHx8IGluZGV4IDwgMCB8fCBpbmRleCA+IF8uc2xpZGVDb3VudCAtIDEpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIF8udW5sb2FkKCk7XG5cbiAgICAgICAgaWYgKHJlbW92ZUFsbCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jaGlsZHJlbigpLnJlbW92ZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmVxKGluZGV4KS5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF8uJHNsaWRlcyA9IF8uJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKTtcblxuICAgICAgICBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZGV0YWNoKCk7XG5cbiAgICAgICAgXy4kc2xpZGVUcmFjay5hcHBlbmQoXy4kc2xpZGVzKTtcblxuICAgICAgICBfLiRzbGlkZXNDYWNoZSA9IF8uJHNsaWRlcztcblxuICAgICAgICBfLnJlaW5pdCgpO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5zZXRDU1MgPSBmdW5jdGlvbihwb3NpdGlvbikge1xuXG4gICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgIHBvc2l0aW9uUHJvcHMgPSB7fSxcbiAgICAgICAgICAgIHgsIHk7XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5ydGwgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHBvc2l0aW9uID0gLXBvc2l0aW9uO1xuICAgICAgICB9XG4gICAgICAgIHggPSBfLnBvc2l0aW9uUHJvcCA9PSAnbGVmdCcgPyBNYXRoLmNlaWwocG9zaXRpb24pICsgJ3B4JyA6ICcwcHgnO1xuICAgICAgICB5ID0gXy5wb3NpdGlvblByb3AgPT0gJ3RvcCcgPyBNYXRoLmNlaWwocG9zaXRpb24pICsgJ3B4JyA6ICcwcHgnO1xuXG4gICAgICAgIHBvc2l0aW9uUHJvcHNbXy5wb3NpdGlvblByb3BdID0gcG9zaXRpb247XG5cbiAgICAgICAgaWYgKF8udHJhbnNmb3Jtc0VuYWJsZWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNzcyhwb3NpdGlvblByb3BzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBvc2l0aW9uUHJvcHMgPSB7fTtcbiAgICAgICAgICAgIGlmIChfLmNzc1RyYW5zaXRpb25zID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uUHJvcHNbXy5hbmltVHlwZV0gPSAndHJhbnNsYXRlKCcgKyB4ICsgJywgJyArIHkgKyAnKSc7XG4gICAgICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jc3MocG9zaXRpb25Qcm9wcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uUHJvcHNbXy5hbmltVHlwZV0gPSAndHJhbnNsYXRlM2QoJyArIHggKyAnLCAnICsgeSArICcsIDBweCknO1xuICAgICAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY3NzKHBvc2l0aW9uUHJvcHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnNldERpbWVuc2lvbnMgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIF8uJGxpc3QuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogKCcwcHggJyArIF8ub3B0aW9ucy5jZW50ZXJQYWRkaW5nKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgXy4kbGlzdC5oZWlnaHQoXy4kc2xpZGVzLmZpcnN0KCkub3V0ZXJIZWlnaHQodHJ1ZSkgKiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KTtcbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIF8uJGxpc3QuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogKF8ub3B0aW9ucy5jZW50ZXJQYWRkaW5nICsgJyAwcHgnKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgXy5saXN0V2lkdGggPSBfLiRsaXN0LndpZHRoKCk7XG4gICAgICAgIF8ubGlzdEhlaWdodCA9IF8uJGxpc3QuaGVpZ2h0KCk7XG5cblxuICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsID09PSBmYWxzZSAmJiBfLm9wdGlvbnMudmFyaWFibGVXaWR0aCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIF8uc2xpZGVXaWR0aCA9IE1hdGguY2VpbChfLmxpc3RXaWR0aCAvIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpO1xuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay53aWR0aChNYXRoLmNlaWwoKF8uc2xpZGVXaWR0aCAqIF8uJHNsaWRlVHJhY2suY2hpbGRyZW4oJy5zbGljay1zbGlkZScpLmxlbmd0aCkpKTtcblxuICAgICAgICB9IGVsc2UgaWYgKF8ub3B0aW9ucy52YXJpYWJsZVdpZHRoID09PSB0cnVlKSB7XG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLndpZHRoKDUwMDAgKiBfLnNsaWRlQ291bnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgXy5zbGlkZVdpZHRoID0gTWF0aC5jZWlsKF8ubGlzdFdpZHRoKTtcbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suaGVpZ2h0KE1hdGguY2VpbCgoXy4kc2xpZGVzLmZpcnN0KCkub3V0ZXJIZWlnaHQodHJ1ZSkgKiBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKCcuc2xpY2stc2xpZGUnKS5sZW5ndGgpKSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgb2Zmc2V0ID0gXy4kc2xpZGVzLmZpcnN0KCkub3V0ZXJXaWR0aCh0cnVlKSAtIF8uJHNsaWRlcy5maXJzdCgpLndpZHRoKCk7XG4gICAgICAgIGlmIChfLm9wdGlvbnMudmFyaWFibGVXaWR0aCA9PT0gZmFsc2UpIF8uJHNsaWRlVHJhY2suY2hpbGRyZW4oJy5zbGljay1zbGlkZScpLndpZHRoKF8uc2xpZGVXaWR0aCAtIG9mZnNldCk7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnNldEZhZGUgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICB0YXJnZXRMZWZ0O1xuXG4gICAgICAgIF8uJHNsaWRlcy5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XG4gICAgICAgICAgICB0YXJnZXRMZWZ0ID0gKF8uc2xpZGVXaWR0aCAqIGluZGV4KSAqIC0xO1xuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5ydGwgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICAgICAgICByaWdodDogdGFyZ2V0TGVmdCxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IF8ub3B0aW9ucy56SW5kZXggLSAyLFxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoZWxlbWVudCkuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IHRhcmdldExlZnQsXG4gICAgICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICAgICAgekluZGV4OiBfLm9wdGlvbnMuekluZGV4IC0gMixcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBfLiRzbGlkZXMuZXEoXy5jdXJyZW50U2xpZGUpLmNzcyh7XG4gICAgICAgICAgICB6SW5kZXg6IF8ub3B0aW9ucy56SW5kZXggLSAxLFxuICAgICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuc2V0SGVpZ2h0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuc2xpZGVzVG9TaG93ID09PSAxICYmIF8ub3B0aW9ucy5hZGFwdGl2ZUhlaWdodCA9PT0gdHJ1ZSAmJiBfLm9wdGlvbnMudmVydGljYWwgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0SGVpZ2h0ID0gXy4kc2xpZGVzLmVxKF8uY3VycmVudFNsaWRlKS5vdXRlckhlaWdodCh0cnVlKTtcbiAgICAgICAgICAgIF8uJGxpc3QuY3NzKCdoZWlnaHQnLCB0YXJnZXRIZWlnaHQpO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnNldE9wdGlvbiA9XG4gICAgU2xpY2sucHJvdG90eXBlLnNsaWNrU2V0T3B0aW9uID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGFjY2VwdHMgYXJndW1lbnRzIGluIGZvcm1hdCBvZjpcbiAgICAgICAgICpcbiAgICAgICAgICogIC0gZm9yIGNoYW5naW5nIGEgc2luZ2xlIG9wdGlvbidzIHZhbHVlOlxuICAgICAgICAgKiAgICAgLnNsaWNrKFwic2V0T3B0aW9uXCIsIG9wdGlvbiwgdmFsdWUsIHJlZnJlc2ggKVxuICAgICAgICAgKlxuICAgICAgICAgKiAgLSBmb3IgY2hhbmdpbmcgYSBzZXQgb2YgcmVzcG9uc2l2ZSBvcHRpb25zOlxuICAgICAgICAgKiAgICAgLnNsaWNrKFwic2V0T3B0aW9uXCIsICdyZXNwb25zaXZlJywgW3t9LCAuLi5dLCByZWZyZXNoIClcbiAgICAgICAgICpcbiAgICAgICAgICogIC0gZm9yIHVwZGF0aW5nIG11bHRpcGxlIHZhbHVlcyBhdCBvbmNlIChub3QgcmVzcG9uc2l2ZSlcbiAgICAgICAgICogICAgIC5zbGljayhcInNldE9wdGlvblwiLCB7ICdvcHRpb24nOiB2YWx1ZSwgLi4uIH0sIHJlZnJlc2ggKVxuICAgICAgICAgKi9cblxuICAgICAgICB2YXIgXyA9IHRoaXMsIGwsIGl0ZW0sIG9wdGlvbiwgdmFsdWUsIHJlZnJlc2ggPSBmYWxzZSwgdHlwZTtcblxuICAgICAgICBpZiggJC50eXBlKCBhcmd1bWVudHNbMF0gKSA9PT0gJ29iamVjdCcgKSB7XG5cbiAgICAgICAgICAgIG9wdGlvbiA9ICBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICByZWZyZXNoID0gYXJndW1lbnRzWzFdO1xuICAgICAgICAgICAgdHlwZSA9ICdtdWx0aXBsZSc7XG5cbiAgICAgICAgfSBlbHNlIGlmICggJC50eXBlKCBhcmd1bWVudHNbMF0gKSA9PT0gJ3N0cmluZycgKSB7XG5cbiAgICAgICAgICAgIG9wdGlvbiA9ICBhcmd1bWVudHNbMF07XG4gICAgICAgICAgICB2YWx1ZSA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICAgIHJlZnJlc2ggPSBhcmd1bWVudHNbMl07XG5cbiAgICAgICAgICAgIGlmICggYXJndW1lbnRzWzBdID09PSAncmVzcG9uc2l2ZScgJiYgJC50eXBlKCBhcmd1bWVudHNbMV0gKSA9PT0gJ2FycmF5JyApIHtcblxuICAgICAgICAgICAgICAgIHR5cGUgPSAncmVzcG9uc2l2ZSc7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGVvZiBhcmd1bWVudHNbMV0gIT09ICd1bmRlZmluZWQnICkge1xuXG4gICAgICAgICAgICAgICAgdHlwZSA9ICdzaW5nbGUnO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggdHlwZSA9PT0gJ3NpbmdsZScgKSB7XG5cbiAgICAgICAgICAgIF8ub3B0aW9uc1tvcHRpb25dID0gdmFsdWU7XG5cblxuICAgICAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAnbXVsdGlwbGUnICkge1xuXG4gICAgICAgICAgICAkLmVhY2goIG9wdGlvbiAsIGZ1bmN0aW9uKCBvcHQsIHZhbCApIHtcblxuICAgICAgICAgICAgICAgIF8ub3B0aW9uc1tvcHRdID0gdmFsO1xuXG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdyZXNwb25zaXZlJyApIHtcblxuICAgICAgICAgICAgZm9yICggaXRlbSBpbiB2YWx1ZSApIHtcblxuICAgICAgICAgICAgICAgIGlmKCAkLnR5cGUoIF8ub3B0aW9ucy5yZXNwb25zaXZlICkgIT09ICdhcnJheScgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgXy5vcHRpb25zLnJlc3BvbnNpdmUgPSBbIHZhbHVlW2l0ZW1dIF07XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIGwgPSBfLm9wdGlvbnMucmVzcG9uc2l2ZS5sZW5ndGgtMTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIHJlc3BvbnNpdmUgb2JqZWN0IGFuZCBzcGxpY2Ugb3V0IGR1cGxpY2F0ZXMuXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlKCBsID49IDAgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBfLm9wdGlvbnMucmVzcG9uc2l2ZVtsXS5icmVha3BvaW50ID09PSB2YWx1ZVtpdGVtXS5icmVha3BvaW50ICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5vcHRpb25zLnJlc3BvbnNpdmUuc3BsaWNlKGwsMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgbC0tO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBfLm9wdGlvbnMucmVzcG9uc2l2ZS5wdXNoKCB2YWx1ZVtpdGVtXSApO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggcmVmcmVzaCApIHtcblxuICAgICAgICAgICAgXy51bmxvYWQoKTtcbiAgICAgICAgICAgIF8ucmVpbml0KCk7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5zZXRQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBfLnNldERpbWVuc2lvbnMoKTtcblxuICAgICAgICBfLnNldEhlaWdodCgpO1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZmFkZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIF8uc2V0Q1NTKF8uZ2V0TGVmdChfLmN1cnJlbnRTbGlkZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgXy5zZXRGYWRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignc2V0UG9zaXRpb24nLCBbX10pO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5zZXRQcm9wcyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgIGJvZHlTdHlsZSA9IGRvY3VtZW50LmJvZHkuc3R5bGU7XG5cbiAgICAgICAgXy5wb3NpdGlvblByb3AgPSBfLm9wdGlvbnMudmVydGljYWwgPT09IHRydWUgPyAndG9wJyA6ICdsZWZ0JztcblxuICAgICAgICBpZiAoXy5wb3NpdGlvblByb3AgPT09ICd0b3AnKSB7XG4gICAgICAgICAgICBfLiRzbGlkZXIuYWRkQ2xhc3MoJ3NsaWNrLXZlcnRpY2FsJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfLiRzbGlkZXIucmVtb3ZlQ2xhc3MoJ3NsaWNrLXZlcnRpY2FsJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYm9keVN0eWxlLldlYmtpdFRyYW5zaXRpb24gIT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgYm9keVN0eWxlLk1velRyYW5zaXRpb24gIT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgYm9keVN0eWxlLm1zVHJhbnNpdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLnVzZUNTUyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIF8uY3NzVHJhbnNpdGlvbnMgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCBfLm9wdGlvbnMuZmFkZSApIHtcbiAgICAgICAgICAgIGlmICggdHlwZW9mIF8ub3B0aW9ucy56SW5kZXggPT09ICdudW1iZXInICkge1xuICAgICAgICAgICAgICAgIGlmKCBfLm9wdGlvbnMuekluZGV4IDwgMyApIHtcbiAgICAgICAgICAgICAgICAgICAgXy5vcHRpb25zLnpJbmRleCA9IDM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfLm9wdGlvbnMuekluZGV4ID0gXy5kZWZhdWx0cy56SW5kZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYm9keVN0eWxlLk9UcmFuc2Zvcm0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgXy5hbmltVHlwZSA9ICdPVHJhbnNmb3JtJztcbiAgICAgICAgICAgIF8udHJhbnNmb3JtVHlwZSA9ICctby10cmFuc2Zvcm0nO1xuICAgICAgICAgICAgXy50cmFuc2l0aW9uVHlwZSA9ICdPVHJhbnNpdGlvbic7XG4gICAgICAgICAgICBpZiAoYm9keVN0eWxlLnBlcnNwZWN0aXZlUHJvcGVydHkgPT09IHVuZGVmaW5lZCAmJiBib2R5U3R5bGUud2Via2l0UGVyc3BlY3RpdmUgPT09IHVuZGVmaW5lZCkgXy5hbmltVHlwZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChib2R5U3R5bGUuTW96VHJhbnNmb3JtICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIF8uYW5pbVR5cGUgPSAnTW96VHJhbnNmb3JtJztcbiAgICAgICAgICAgIF8udHJhbnNmb3JtVHlwZSA9ICctbW96LXRyYW5zZm9ybSc7XG4gICAgICAgICAgICBfLnRyYW5zaXRpb25UeXBlID0gJ01velRyYW5zaXRpb24nO1xuICAgICAgICAgICAgaWYgKGJvZHlTdHlsZS5wZXJzcGVjdGl2ZVByb3BlcnR5ID09PSB1bmRlZmluZWQgJiYgYm9keVN0eWxlLk1velBlcnNwZWN0aXZlID09PSB1bmRlZmluZWQpIF8uYW5pbVR5cGUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYm9keVN0eWxlLndlYmtpdFRyYW5zZm9ybSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBfLmFuaW1UeXBlID0gJ3dlYmtpdFRyYW5zZm9ybSc7XG4gICAgICAgICAgICBfLnRyYW5zZm9ybVR5cGUgPSAnLXdlYmtpdC10cmFuc2Zvcm0nO1xuICAgICAgICAgICAgXy50cmFuc2l0aW9uVHlwZSA9ICd3ZWJraXRUcmFuc2l0aW9uJztcbiAgICAgICAgICAgIGlmIChib2R5U3R5bGUucGVyc3BlY3RpdmVQcm9wZXJ0eSA9PT0gdW5kZWZpbmVkICYmIGJvZHlTdHlsZS53ZWJraXRQZXJzcGVjdGl2ZSA9PT0gdW5kZWZpbmVkKSBfLmFuaW1UeXBlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJvZHlTdHlsZS5tc1RyYW5zZm9ybSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBfLmFuaW1UeXBlID0gJ21zVHJhbnNmb3JtJztcbiAgICAgICAgICAgIF8udHJhbnNmb3JtVHlwZSA9ICctbXMtdHJhbnNmb3JtJztcbiAgICAgICAgICAgIF8udHJhbnNpdGlvblR5cGUgPSAnbXNUcmFuc2l0aW9uJztcbiAgICAgICAgICAgIGlmIChib2R5U3R5bGUubXNUcmFuc2Zvcm0gPT09IHVuZGVmaW5lZCkgXy5hbmltVHlwZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChib2R5U3R5bGUudHJhbnNmb3JtICE9PSB1bmRlZmluZWQgJiYgXy5hbmltVHlwZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIF8uYW5pbVR5cGUgPSAndHJhbnNmb3JtJztcbiAgICAgICAgICAgIF8udHJhbnNmb3JtVHlwZSA9ICd0cmFuc2Zvcm0nO1xuICAgICAgICAgICAgXy50cmFuc2l0aW9uVHlwZSA9ICd0cmFuc2l0aW9uJztcbiAgICAgICAgfVxuICAgICAgICBfLnRyYW5zZm9ybXNFbmFibGVkID0gXy5vcHRpb25zLnVzZVRyYW5zZm9ybSAmJiAoXy5hbmltVHlwZSAhPT0gbnVsbCAmJiBfLmFuaW1UeXBlICE9PSBmYWxzZSk7XG4gICAgfTtcblxuXG4gICAgU2xpY2sucHJvdG90eXBlLnNldFNsaWRlQ2xhc3NlcyA9IGZ1bmN0aW9uKGluZGV4KSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzLFxuICAgICAgICAgICAgY2VudGVyT2Zmc2V0LCBhbGxTbGlkZXMsIGluZGV4T2Zmc2V0LCByZW1haW5kZXI7XG5cbiAgICAgICAgYWxsU2xpZGVzID0gXy4kc2xpZGVyXG4gICAgICAgICAgICAuZmluZCgnLnNsaWNrLXNsaWRlJylcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnc2xpY2stYWN0aXZlIHNsaWNrLWNlbnRlciBzbGljay1jdXJyZW50JylcbiAgICAgICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cbiAgICAgICAgXy4kc2xpZGVzXG4gICAgICAgICAgICAuZXEoaW5kZXgpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWN1cnJlbnQnKTtcblxuICAgICAgICBpZiAoXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUpIHtcblxuICAgICAgICAgICAgY2VudGVyT2Zmc2V0ID0gTWF0aC5mbG9vcihfLm9wdGlvbnMuc2xpZGVzVG9TaG93IC8gMik7XG5cbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuaW5maW5pdGUgPT09IHRydWUpIHtcblxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+PSBjZW50ZXJPZmZzZXQgJiYgaW5kZXggPD0gKF8uc2xpZGVDb3VudCAtIDEpIC0gY2VudGVyT2Zmc2V0KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgXy4kc2xpZGVzXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2xpY2UoaW5kZXggLSBjZW50ZXJPZmZzZXQsIGluZGV4ICsgY2VudGVyT2Zmc2V0ICsgMSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stYWN0aXZlJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICBpbmRleE9mZnNldCA9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgKyBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgYWxsU2xpZGVzXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2xpY2UoaW5kZXhPZmZzZXQgLSBjZW50ZXJPZmZzZXQgKyAxLCBpbmRleE9mZnNldCArIGNlbnRlck9mZnNldCArIDIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWFjdGl2ZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGFsbFNsaWRlc1xuICAgICAgICAgICAgICAgICAgICAgICAgLmVxKGFsbFNsaWRlcy5sZW5ndGggLSAxIC0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stY2VudGVyJyk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGluZGV4ID09PSBfLnNsaWRlQ291bnQgLSAxKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgYWxsU2xpZGVzXG4gICAgICAgICAgICAgICAgICAgICAgICAuZXEoXy5vcHRpb25zLnNsaWRlc1RvU2hvdylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stY2VudGVyJyk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgXy4kc2xpZGVzXG4gICAgICAgICAgICAgICAgLmVxKGluZGV4KVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stY2VudGVyJyk7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgaWYgKGluZGV4ID49IDAgJiYgaW5kZXggPD0gKF8uc2xpZGVDb3VudCAtIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpKSB7XG5cbiAgICAgICAgICAgICAgICBfLiRzbGlkZXNcbiAgICAgICAgICAgICAgICAgICAgLnNsaWNlKGluZGV4LCBpbmRleCArIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stYWN0aXZlJylcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYWxsU2xpZGVzLmxlbmd0aCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG5cbiAgICAgICAgICAgICAgICBhbGxTbGlkZXNcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1hY3RpdmUnKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIHJlbWFpbmRlciA9IF8uc2xpZGVDb3VudCAlIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3c7XG4gICAgICAgICAgICAgICAgaW5kZXhPZmZzZXQgPSBfLm9wdGlvbnMuaW5maW5pdGUgPT09IHRydWUgPyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICsgaW5kZXggOiBpbmRleDtcblxuICAgICAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuc2xpZGVzVG9TaG93ID09IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCAmJiAoXy5zbGlkZUNvdW50IC0gaW5kZXgpIDwgXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuXG4gICAgICAgICAgICAgICAgICAgIGFsbFNsaWRlc1xuICAgICAgICAgICAgICAgICAgICAgICAgLnNsaWNlKGluZGV4T2Zmc2V0IC0gKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLSByZW1haW5kZXIpLCBpbmRleE9mZnNldCArIHJlbWFpbmRlcilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stYWN0aXZlJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICBhbGxTbGlkZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zbGljZShpbmRleE9mZnNldCwgaW5kZXhPZmZzZXQgKyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1hY3RpdmUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy5sYXp5TG9hZCA9PT0gJ29uZGVtYW5kJykge1xuICAgICAgICAgICAgXy5sYXp5TG9hZCgpO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnNldHVwSW5maW5pdGUgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICBpLCBzbGlkZUluZGV4LCBpbmZpbml0ZUNvdW50O1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZmFkZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgXy5vcHRpb25zLmNlbnRlck1vZGUgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuaW5maW5pdGUgPT09IHRydWUgJiYgXy5vcHRpb25zLmZhZGUgPT09IGZhbHNlKSB7XG5cbiAgICAgICAgICAgIHNsaWRlSW5kZXggPSBudWxsO1xuXG4gICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xuXG4gICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZmluaXRlQ291bnQgPSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICsgMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpbmZpbml0ZUNvdW50ID0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKGkgPSBfLnNsaWRlQ291bnQ7IGkgPiAoXy5zbGlkZUNvdW50IC1cbiAgICAgICAgICAgICAgICAgICAgICAgIGluZmluaXRlQ291bnQpOyBpIC09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVJbmRleCA9IGkgLSAxO1xuICAgICAgICAgICAgICAgICAgICAkKF8uJHNsaWRlc1tzbGlkZUluZGV4XSkuY2xvbmUodHJ1ZSkuYXR0cignaWQnLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXNsaWNrLWluZGV4Jywgc2xpZGVJbmRleCAtIF8uc2xpZGVDb3VudClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5wcmVwZW5kVG8oXy4kc2xpZGVUcmFjaykuYWRkQ2xhc3MoJ3NsaWNrLWNsb25lZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaW5maW5pdGVDb3VudDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHNsaWRlSW5kZXggPSBpO1xuICAgICAgICAgICAgICAgICAgICAkKF8uJHNsaWRlc1tzbGlkZUluZGV4XSkuY2xvbmUodHJ1ZSkuYXR0cignaWQnLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXNsaWNrLWluZGV4Jywgc2xpZGVJbmRleCArIF8uc2xpZGVDb3VudClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhfLiRzbGlkZVRyYWNrKS5hZGRDbGFzcygnc2xpY2stY2xvbmVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suZmluZCgnLnNsaWNrLWNsb25lZCcpLmZpbmQoJ1tpZF0nKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoJ2lkJywgJycpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5pbnRlcnJ1cHQgPSBmdW5jdGlvbiggdG9nZ2xlICkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBpZiggIXRvZ2dsZSApIHtcbiAgICAgICAgICAgIF8uYXV0b1BsYXkoKTtcbiAgICAgICAgfVxuICAgICAgICBfLmludGVycnVwdGVkID0gdG9nZ2xlO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5zZWxlY3RIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgdmFyIHRhcmdldEVsZW1lbnQgPVxuICAgICAgICAgICAgJChldmVudC50YXJnZXQpLmlzKCcuc2xpY2stc2xpZGUnKSA/XG4gICAgICAgICAgICAgICAgJChldmVudC50YXJnZXQpIDpcbiAgICAgICAgICAgICAgICAkKGV2ZW50LnRhcmdldCkucGFyZW50cygnLnNsaWNrLXNsaWRlJyk7XG5cbiAgICAgICAgdmFyIGluZGV4ID0gcGFyc2VJbnQodGFyZ2V0RWxlbWVudC5hdHRyKCdkYXRhLXNsaWNrLWluZGV4JykpO1xuXG4gICAgICAgIGlmICghaW5kZXgpIGluZGV4ID0gMDtcblxuICAgICAgICBpZiAoXy5zbGlkZUNvdW50IDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcblxuICAgICAgICAgICAgXy5zZXRTbGlkZUNsYXNzZXMoaW5kZXgpO1xuICAgICAgICAgICAgXy5hc05hdkZvcihpbmRleCk7XG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgfVxuXG4gICAgICAgIF8uc2xpZGVIYW5kbGVyKGluZGV4KTtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuc2xpZGVIYW5kbGVyID0gZnVuY3Rpb24oaW5kZXgsIHN5bmMsIGRvbnRBbmltYXRlKSB7XG5cbiAgICAgICAgdmFyIHRhcmdldFNsaWRlLCBhbmltU2xpZGUsIG9sZFNsaWRlLCBzbGlkZUxlZnQsIHRhcmdldExlZnQgPSBudWxsLFxuICAgICAgICAgICAgXyA9IHRoaXMsIG5hdlRhcmdldDtcblxuICAgICAgICBzeW5jID0gc3luYyB8fCBmYWxzZTtcblxuICAgICAgICBpZiAoXy5hbmltYXRpbmcgPT09IHRydWUgJiYgXy5vcHRpb25zLndhaXRGb3JBbmltYXRlID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IHRydWUgJiYgXy5jdXJyZW50U2xpZGUgPT09IGluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXy5zbGlkZUNvdW50IDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzeW5jID09PSBmYWxzZSkge1xuICAgICAgICAgICAgXy5hc05hdkZvcihpbmRleCk7XG4gICAgICAgIH1cblxuICAgICAgICB0YXJnZXRTbGlkZSA9IGluZGV4O1xuICAgICAgICB0YXJnZXRMZWZ0ID0gXy5nZXRMZWZ0KHRhcmdldFNsaWRlKTtcbiAgICAgICAgc2xpZGVMZWZ0ID0gXy5nZXRMZWZ0KF8uY3VycmVudFNsaWRlKTtcblxuICAgICAgICBfLmN1cnJlbnRMZWZ0ID0gXy5zd2lwZUxlZnQgPT09IG51bGwgPyBzbGlkZUxlZnQgOiBfLnN3aXBlTGVmdDtcblxuICAgICAgICBpZiAoXy5vcHRpb25zLmluZmluaXRlID09PSBmYWxzZSAmJiBfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gZmFsc2UgJiYgKGluZGV4IDwgMCB8fCBpbmRleCA+IF8uZ2V0RG90Q291bnQoKSAqIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCkpIHtcbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuZmFkZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRTbGlkZSA9IF8uY3VycmVudFNsaWRlO1xuICAgICAgICAgICAgICAgIGlmIChkb250QW5pbWF0ZSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBfLmFuaW1hdGVTbGlkZShzbGlkZUxlZnQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgXy5wb3N0U2xpZGUodGFyZ2V0U2xpZGUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfLnBvc3RTbGlkZSh0YXJnZXRTbGlkZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gZmFsc2UgJiYgXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUgJiYgKGluZGV4IDwgMCB8fCBpbmRleCA+IChfLnNsaWRlQ291bnQgLSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpKSkge1xuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHRhcmdldFNsaWRlID0gXy5jdXJyZW50U2xpZGU7XG4gICAgICAgICAgICAgICAgaWYgKGRvbnRBbmltYXRlICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIF8uYW5pbWF0ZVNsaWRlKHNsaWRlTGVmdCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfLnBvc3RTbGlkZSh0YXJnZXRTbGlkZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIF8ucG9zdFNsaWRlKHRhcmdldFNsaWRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIF8ub3B0aW9ucy5hdXRvcGxheSApIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoXy5hdXRvUGxheVRpbWVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0YXJnZXRTbGlkZSA8IDApIHtcbiAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgJSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgIT09IDApIHtcbiAgICAgICAgICAgICAgICBhbmltU2xpZGUgPSBfLnNsaWRlQ291bnQgLSAoXy5zbGlkZUNvdW50ICUgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYW5pbVNsaWRlID0gXy5zbGlkZUNvdW50ICsgdGFyZ2V0U2xpZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGFyZ2V0U2xpZGUgPj0gXy5zbGlkZUNvdW50KSB7XG4gICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50ICUgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgYW5pbVNsaWRlID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYW5pbVNsaWRlID0gdGFyZ2V0U2xpZGUgLSBfLnNsaWRlQ291bnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbmltU2xpZGUgPSB0YXJnZXRTbGlkZTtcbiAgICAgICAgfVxuXG4gICAgICAgIF8uYW5pbWF0aW5nID0gdHJ1ZTtcblxuICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignYmVmb3JlQ2hhbmdlJywgW18sIF8uY3VycmVudFNsaWRlLCBhbmltU2xpZGVdKTtcblxuICAgICAgICBvbGRTbGlkZSA9IF8uY3VycmVudFNsaWRlO1xuICAgICAgICBfLmN1cnJlbnRTbGlkZSA9IGFuaW1TbGlkZTtcblxuICAgICAgICBfLnNldFNsaWRlQ2xhc3NlcyhfLmN1cnJlbnRTbGlkZSk7XG5cbiAgICAgICAgaWYgKCBfLm9wdGlvbnMuYXNOYXZGb3IgKSB7XG5cbiAgICAgICAgICAgIG5hdlRhcmdldCA9IF8uZ2V0TmF2VGFyZ2V0KCk7XG4gICAgICAgICAgICBuYXZUYXJnZXQgPSBuYXZUYXJnZXQuc2xpY2soJ2dldFNsaWNrJyk7XG5cbiAgICAgICAgICAgIGlmICggbmF2VGFyZ2V0LnNsaWRlQ291bnQgPD0gbmF2VGFyZ2V0Lm9wdGlvbnMuc2xpZGVzVG9TaG93ICkge1xuICAgICAgICAgICAgICAgIG5hdlRhcmdldC5zZXRTbGlkZUNsYXNzZXMoXy5jdXJyZW50U2xpZGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBfLnVwZGF0ZURvdHMoKTtcbiAgICAgICAgXy51cGRhdGVBcnJvd3MoKTtcblxuICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGlmIChkb250QW5pbWF0ZSAhPT0gdHJ1ZSkge1xuXG4gICAgICAgICAgICAgICAgXy5mYWRlU2xpZGVPdXQob2xkU2xpZGUpO1xuXG4gICAgICAgICAgICAgICAgXy5mYWRlU2xpZGUoYW5pbVNsaWRlLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgXy5wb3N0U2xpZGUoYW5pbVNsaWRlKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfLnBvc3RTbGlkZShhbmltU2xpZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXy5hbmltYXRlSGVpZ2h0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZG9udEFuaW1hdGUgIT09IHRydWUpIHtcbiAgICAgICAgICAgIF8uYW5pbWF0ZVNsaWRlKHRhcmdldExlZnQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIF8ucG9zdFNsaWRlKGFuaW1TbGlkZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF8ucG9zdFNsaWRlKGFuaW1TbGlkZSk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuc3RhcnRMb2FkID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF8gPSB0aGlzO1xuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuYXJyb3dzID09PSB0cnVlICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcblxuICAgICAgICAgICAgXy4kcHJldkFycm93LmhpZGUoKTtcbiAgICAgICAgICAgIF8uJG5leHRBcnJvdy5oaWRlKCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZG90cyA9PT0gdHJ1ZSAmJiBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG5cbiAgICAgICAgICAgIF8uJGRvdHMuaGlkZSgpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBfLiRzbGlkZXIuYWRkQ2xhc3MoJ3NsaWNrLWxvYWRpbmcnKTtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuc3dpcGVEaXJlY3Rpb24gPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgeERpc3QsIHlEaXN0LCByLCBzd2lwZUFuZ2xlLCBfID0gdGhpcztcblxuICAgICAgICB4RGlzdCA9IF8udG91Y2hPYmplY3Quc3RhcnRYIC0gXy50b3VjaE9iamVjdC5jdXJYO1xuICAgICAgICB5RGlzdCA9IF8udG91Y2hPYmplY3Quc3RhcnRZIC0gXy50b3VjaE9iamVjdC5jdXJZO1xuICAgICAgICByID0gTWF0aC5hdGFuMih5RGlzdCwgeERpc3QpO1xuXG4gICAgICAgIHN3aXBlQW5nbGUgPSBNYXRoLnJvdW5kKHIgKiAxODAgLyBNYXRoLlBJKTtcbiAgICAgICAgaWYgKHN3aXBlQW5nbGUgPCAwKSB7XG4gICAgICAgICAgICBzd2lwZUFuZ2xlID0gMzYwIC0gTWF0aC5hYnMoc3dpcGVBbmdsZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoKHN3aXBlQW5nbGUgPD0gNDUpICYmIChzd2lwZUFuZ2xlID49IDApKSB7XG4gICAgICAgICAgICByZXR1cm4gKF8ub3B0aW9ucy5ydGwgPT09IGZhbHNlID8gJ2xlZnQnIDogJ3JpZ2h0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKChzd2lwZUFuZ2xlIDw9IDM2MCkgJiYgKHN3aXBlQW5nbGUgPj0gMzE1KSkge1xuICAgICAgICAgICAgcmV0dXJuIChfLm9wdGlvbnMucnRsID09PSBmYWxzZSA/ICdsZWZ0JyA6ICdyaWdodCcpO1xuICAgICAgICB9XG4gICAgICAgIGlmICgoc3dpcGVBbmdsZSA+PSAxMzUpICYmIChzd2lwZUFuZ2xlIDw9IDIyNSkpIHtcbiAgICAgICAgICAgIHJldHVybiAoXy5vcHRpb25zLnJ0bCA9PT0gZmFsc2UgPyAncmlnaHQnIDogJ2xlZnQnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsU3dpcGluZyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgaWYgKChzd2lwZUFuZ2xlID49IDM1KSAmJiAoc3dpcGVBbmdsZSA8PSAxMzUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdkb3duJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICd1cCc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gJ3ZlcnRpY2FsJztcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuc3dpcGVFbmQgPSBmdW5jdGlvbihldmVudCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgIHNsaWRlQ291bnQsXG4gICAgICAgICAgICBkaXJlY3Rpb247XG5cbiAgICAgICAgXy5kcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICBfLmludGVycnVwdGVkID0gZmFsc2U7XG4gICAgICAgIF8uc2hvdWxkQ2xpY2sgPSAoIF8udG91Y2hPYmplY3Quc3dpcGVMZW5ndGggPiAxMCApID8gZmFsc2UgOiB0cnVlO1xuXG4gICAgICAgIGlmICggXy50b3VjaE9iamVjdC5jdXJYID09PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIF8udG91Y2hPYmplY3QuZWRnZUhpdCA9PT0gdHJ1ZSApIHtcbiAgICAgICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdlZGdlJywgW18sIF8uc3dpcGVEaXJlY3Rpb24oKSBdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggXy50b3VjaE9iamVjdC5zd2lwZUxlbmd0aCA+PSBfLnRvdWNoT2JqZWN0Lm1pblN3aXBlICkge1xuXG4gICAgICAgICAgICBkaXJlY3Rpb24gPSBfLnN3aXBlRGlyZWN0aW9uKCk7XG5cbiAgICAgICAgICAgIHN3aXRjaCAoIGRpcmVjdGlvbiApIHtcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ2Rvd24nOlxuXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlQ291bnQgPVxuICAgICAgICAgICAgICAgICAgICAgICAgXy5vcHRpb25zLnN3aXBlVG9TbGlkZSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5jaGVja05hdmlnYWJsZSggXy5jdXJyZW50U2xpZGUgKyBfLmdldFNsaWRlQ291bnQoKSApIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmN1cnJlbnRTbGlkZSArIF8uZ2V0U2xpZGVDb3VudCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIF8uY3VycmVudERpcmVjdGlvbiA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICAgICAgY2FzZSAndXAnOlxuXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlQ291bnQgPVxuICAgICAgICAgICAgICAgICAgICAgICAgXy5vcHRpb25zLnN3aXBlVG9TbGlkZSA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5jaGVja05hdmlnYWJsZSggXy5jdXJyZW50U2xpZGUgLSBfLmdldFNsaWRlQ291bnQoKSApIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmN1cnJlbnRTbGlkZSAtIF8uZ2V0U2xpZGVDb3VudCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIF8uY3VycmVudERpcmVjdGlvbiA9IDE7XG5cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuXG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoIGRpcmVjdGlvbiAhPSAndmVydGljYWwnICkge1xuXG4gICAgICAgICAgICAgICAgXy5zbGlkZUhhbmRsZXIoIHNsaWRlQ291bnQgKTtcbiAgICAgICAgICAgICAgICBfLnRvdWNoT2JqZWN0ID0ge307XG4gICAgICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ3N3aXBlJywgW18sIGRpcmVjdGlvbiBdKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIGlmICggXy50b3VjaE9iamVjdC5zdGFydFggIT09IF8udG91Y2hPYmplY3QuY3VyWCApIHtcblxuICAgICAgICAgICAgICAgIF8uc2xpZGVIYW5kbGVyKCBfLmN1cnJlbnRTbGlkZSApO1xuICAgICAgICAgICAgICAgIF8udG91Y2hPYmplY3QgPSB7fTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUuc3dpcGVIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgaWYgKChfLm9wdGlvbnMuc3dpcGUgPT09IGZhbHNlKSB8fCAoJ29udG91Y2hlbmQnIGluIGRvY3VtZW50ICYmIF8ub3B0aW9ucy5zd2lwZSA9PT0gZmFsc2UpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAoXy5vcHRpb25zLmRyYWdnYWJsZSA9PT0gZmFsc2UgJiYgZXZlbnQudHlwZS5pbmRleE9mKCdtb3VzZScpICE9PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgXy50b3VjaE9iamVjdC5maW5nZXJDb3VudCA9IGV2ZW50Lm9yaWdpbmFsRXZlbnQgJiYgZXZlbnQub3JpZ2luYWxFdmVudC50b3VjaGVzICE9PSB1bmRlZmluZWQgP1xuICAgICAgICAgICAgZXZlbnQub3JpZ2luYWxFdmVudC50b3VjaGVzLmxlbmd0aCA6IDE7XG5cbiAgICAgICAgXy50b3VjaE9iamVjdC5taW5Td2lwZSA9IF8ubGlzdFdpZHRoIC8gXy5vcHRpb25zXG4gICAgICAgICAgICAudG91Y2hUaHJlc2hvbGQ7XG5cbiAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbFN3aXBpbmcgPT09IHRydWUpIHtcbiAgICAgICAgICAgIF8udG91Y2hPYmplY3QubWluU3dpcGUgPSBfLmxpc3RIZWlnaHQgLyBfLm9wdGlvbnNcbiAgICAgICAgICAgICAgICAudG91Y2hUaHJlc2hvbGQ7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKGV2ZW50LmRhdGEuYWN0aW9uKSB7XG5cbiAgICAgICAgICAgIGNhc2UgJ3N0YXJ0JzpcbiAgICAgICAgICAgICAgICBfLnN3aXBlU3RhcnQoZXZlbnQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdtb3ZlJzpcbiAgICAgICAgICAgICAgICBfLnN3aXBlTW92ZShldmVudCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2VuZCc6XG4gICAgICAgICAgICAgICAgXy5zd2lwZUVuZChldmVudCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5zd2lwZU1vdmUgPSBmdW5jdGlvbihldmVudCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgIGVkZ2VXYXNIaXQgPSBmYWxzZSxcbiAgICAgICAgICAgIGN1ckxlZnQsIHN3aXBlRGlyZWN0aW9uLCBzd2lwZUxlbmd0aCwgcG9zaXRpb25PZmZzZXQsIHRvdWNoZXM7XG5cbiAgICAgICAgdG91Y2hlcyA9IGV2ZW50Lm9yaWdpbmFsRXZlbnQgIT09IHVuZGVmaW5lZCA/IGV2ZW50Lm9yaWdpbmFsRXZlbnQudG91Y2hlcyA6IG51bGw7XG5cbiAgICAgICAgaWYgKCFfLmRyYWdnaW5nIHx8IHRvdWNoZXMgJiYgdG91Y2hlcy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1ckxlZnQgPSBfLmdldExlZnQoXy5jdXJyZW50U2xpZGUpO1xuXG4gICAgICAgIF8udG91Y2hPYmplY3QuY3VyWCA9IHRvdWNoZXMgIT09IHVuZGVmaW5lZCA/IHRvdWNoZXNbMF0ucGFnZVggOiBldmVudC5jbGllbnRYO1xuICAgICAgICBfLnRvdWNoT2JqZWN0LmN1clkgPSB0b3VjaGVzICE9PSB1bmRlZmluZWQgPyB0b3VjaGVzWzBdLnBhZ2VZIDogZXZlbnQuY2xpZW50WTtcblxuICAgICAgICBfLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoID0gTWF0aC5yb3VuZChNYXRoLnNxcnQoXG4gICAgICAgICAgICBNYXRoLnBvdyhfLnRvdWNoT2JqZWN0LmN1clggLSBfLnRvdWNoT2JqZWN0LnN0YXJ0WCwgMikpKTtcblxuICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsU3dpcGluZyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgXy50b3VjaE9iamVjdC5zd2lwZUxlbmd0aCA9IE1hdGgucm91bmQoTWF0aC5zcXJ0KFxuICAgICAgICAgICAgICAgIE1hdGgucG93KF8udG91Y2hPYmplY3QuY3VyWSAtIF8udG91Y2hPYmplY3Quc3RhcnRZLCAyKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpcGVEaXJlY3Rpb24gPSBfLnN3aXBlRGlyZWN0aW9uKCk7XG5cbiAgICAgICAgaWYgKHN3aXBlRGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXZlbnQub3JpZ2luYWxFdmVudCAhPT0gdW5kZWZpbmVkICYmIF8udG91Y2hPYmplY3Quc3dpcGVMZW5ndGggPiA0KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcG9zaXRpb25PZmZzZXQgPSAoXy5vcHRpb25zLnJ0bCA9PT0gZmFsc2UgPyAxIDogLTEpICogKF8udG91Y2hPYmplY3QuY3VyWCA+IF8udG91Y2hPYmplY3Quc3RhcnRYID8gMSA6IC0xKTtcbiAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbFN3aXBpbmcgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHBvc2l0aW9uT2Zmc2V0ID0gXy50b3VjaE9iamVjdC5jdXJZID4gXy50b3VjaE9iamVjdC5zdGFydFkgPyAxIDogLTE7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHN3aXBlTGVuZ3RoID0gXy50b3VjaE9iamVjdC5zd2lwZUxlbmd0aDtcblxuICAgICAgICBfLnRvdWNoT2JqZWN0LmVkZ2VIaXQgPSBmYWxzZTtcblxuICAgICAgICBpZiAoXy5vcHRpb25zLmluZmluaXRlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgaWYgKChfLmN1cnJlbnRTbGlkZSA9PT0gMCAmJiBzd2lwZURpcmVjdGlvbiA9PT0gJ3JpZ2h0JykgfHwgKF8uY3VycmVudFNsaWRlID49IF8uZ2V0RG90Q291bnQoKSAmJiBzd2lwZURpcmVjdGlvbiA9PT0gJ2xlZnQnKSkge1xuICAgICAgICAgICAgICAgIHN3aXBlTGVuZ3RoID0gXy50b3VjaE9iamVjdC5zd2lwZUxlbmd0aCAqIF8ub3B0aW9ucy5lZGdlRnJpY3Rpb247XG4gICAgICAgICAgICAgICAgXy50b3VjaE9iamVjdC5lZGdlSGl0ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWwgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBfLnN3aXBlTGVmdCA9IGN1ckxlZnQgKyBzd2lwZUxlbmd0aCAqIHBvc2l0aW9uT2Zmc2V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgXy5zd2lwZUxlZnQgPSBjdXJMZWZ0ICsgKHN3aXBlTGVuZ3RoICogKF8uJGxpc3QuaGVpZ2h0KCkgLyBfLmxpc3RXaWR0aCkpICogcG9zaXRpb25PZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbFN3aXBpbmcgPT09IHRydWUpIHtcbiAgICAgICAgICAgIF8uc3dpcGVMZWZ0ID0gY3VyTGVmdCArIHN3aXBlTGVuZ3RoICogcG9zaXRpb25PZmZzZXQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IHRydWUgfHwgXy5vcHRpb25zLnRvdWNoTW92ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLmFuaW1hdGluZyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgXy5zd2lwZUxlZnQgPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgXy5zZXRDU1MoXy5zd2lwZUxlZnQpO1xuXG4gICAgfTtcblxuICAgIFNsaWNrLnByb3RvdHlwZS5zd2lwZVN0YXJ0ID0gZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICB0b3VjaGVzO1xuXG4gICAgICAgIF8uaW50ZXJydXB0ZWQgPSB0cnVlO1xuXG4gICAgICAgIGlmIChfLnRvdWNoT2JqZWN0LmZpbmdlckNvdW50ICE9PSAxIHx8IF8uc2xpZGVDb3VudCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XG4gICAgICAgICAgICBfLnRvdWNoT2JqZWN0ID0ge307XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXZlbnQub3JpZ2luYWxFdmVudCAhPT0gdW5kZWZpbmVkICYmIGV2ZW50Lm9yaWdpbmFsRXZlbnQudG91Y2hlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0b3VjaGVzID0gZXZlbnQub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgXy50b3VjaE9iamVjdC5zdGFydFggPSBfLnRvdWNoT2JqZWN0LmN1clggPSB0b3VjaGVzICE9PSB1bmRlZmluZWQgPyB0b3VjaGVzLnBhZ2VYIDogZXZlbnQuY2xpZW50WDtcbiAgICAgICAgXy50b3VjaE9iamVjdC5zdGFydFkgPSBfLnRvdWNoT2JqZWN0LmN1clkgPSB0b3VjaGVzICE9PSB1bmRlZmluZWQgPyB0b3VjaGVzLnBhZ2VZIDogZXZlbnQuY2xpZW50WTtcblxuICAgICAgICBfLmRyYWdnaW5nID0gdHJ1ZTtcblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUudW5maWx0ZXJTbGlkZXMgPSBTbGljay5wcm90b3R5cGUuc2xpY2tVbmZpbHRlciA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBpZiAoXy4kc2xpZGVzQ2FjaGUgIT09IG51bGwpIHtcblxuICAgICAgICAgICAgXy51bmxvYWQoKTtcblxuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmRldGFjaCgpO1xuXG4gICAgICAgICAgICBfLiRzbGlkZXNDYWNoZS5hcHBlbmRUbyhfLiRzbGlkZVRyYWNrKTtcblxuICAgICAgICAgICAgXy5yZWluaXQoKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnVubG9hZCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICAkKCcuc2xpY2stY2xvbmVkJywgXy4kc2xpZGVyKS5yZW1vdmUoKTtcblxuICAgICAgICBpZiAoXy4kZG90cykge1xuICAgICAgICAgICAgXy4kZG90cy5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLiRwcmV2QXJyb3cgJiYgXy5odG1sRXhwci50ZXN0KF8ub3B0aW9ucy5wcmV2QXJyb3cpKSB7XG4gICAgICAgICAgICBfLiRwcmV2QXJyb3cucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXy4kbmV4dEFycm93ICYmIF8uaHRtbEV4cHIudGVzdChfLm9wdGlvbnMubmV4dEFycm93KSkge1xuICAgICAgICAgICAgXy4kbmV4dEFycm93LnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgXy4kc2xpZGVzXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NsaWNrLXNsaWRlIHNsaWNrLWFjdGl2ZSBzbGljay12aXNpYmxlIHNsaWNrLWN1cnJlbnQnKVxuICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKVxuICAgICAgICAgICAgLmNzcygnd2lkdGgnLCAnJyk7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnVuc2xpY2sgPSBmdW5jdGlvbihmcm9tQnJlYWtwb2ludCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcbiAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ3Vuc2xpY2snLCBbXywgZnJvbUJyZWFrcG9pbnRdKTtcbiAgICAgICAgXy5kZXN0cm95KCk7XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnVwZGF0ZUFycm93cyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcyxcbiAgICAgICAgICAgIGNlbnRlck9mZnNldDtcblxuICAgICAgICBjZW50ZXJPZmZzZXQgPSBNYXRoLmZsb29yKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLyAyKTtcblxuICAgICAgICBpZiAoIF8ub3B0aW9ucy5hcnJvd3MgPT09IHRydWUgJiZcbiAgICAgICAgICAgIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgJiZcbiAgICAgICAgICAgICFfLm9wdGlvbnMuaW5maW5pdGUgKSB7XG5cbiAgICAgICAgICAgIF8uJHByZXZBcnJvdy5yZW1vdmVDbGFzcygnc2xpY2stZGlzYWJsZWQnKS5hdHRyKCdhcmlhLWRpc2FibGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgICAgICBfLiRuZXh0QXJyb3cucmVtb3ZlQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICdmYWxzZScpO1xuXG4gICAgICAgICAgICBpZiAoXy5jdXJyZW50U2xpZGUgPT09IDApIHtcblxuICAgICAgICAgICAgICAgIF8uJHByZXZBcnJvdy5hZGRDbGFzcygnc2xpY2stZGlzYWJsZWQnKS5hdHRyKCdhcmlhLWRpc2FibGVkJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICBfLiRuZXh0QXJyb3cucmVtb3ZlQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICdmYWxzZScpO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKF8uY3VycmVudFNsaWRlID49IF8uc2xpZGVDb3VudCAtIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgJiYgXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IGZhbHNlKSB7XG5cbiAgICAgICAgICAgICAgICBfLiRuZXh0QXJyb3cuYWRkQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICd0cnVlJyk7XG4gICAgICAgICAgICAgICAgXy4kcHJldkFycm93LnJlbW92ZUNsYXNzKCdzbGljay1kaXNhYmxlZCcpLmF0dHIoJ2FyaWEtZGlzYWJsZWQnLCAnZmFsc2UnKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChfLmN1cnJlbnRTbGlkZSA+PSBfLnNsaWRlQ291bnQgLSAxICYmIF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlKSB7XG5cbiAgICAgICAgICAgICAgICBfLiRuZXh0QXJyb3cuYWRkQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICd0cnVlJyk7XG4gICAgICAgICAgICAgICAgXy4kcHJldkFycm93LnJlbW92ZUNsYXNzKCdzbGljay1kaXNhYmxlZCcpLmF0dHIoJ2FyaWEtZGlzYWJsZWQnLCAnZmFsc2UnKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBTbGljay5wcm90b3R5cGUudXBkYXRlRG90cyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfID0gdGhpcztcblxuICAgICAgICBpZiAoXy4kZG90cyAhPT0gbnVsbCkge1xuXG4gICAgICAgICAgICBfLiRkb3RzXG4gICAgICAgICAgICAgICAgLmZpbmQoJ2xpJylcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NsaWNrLWFjdGl2ZScpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcblxuICAgICAgICAgICAgXy4kZG90c1xuICAgICAgICAgICAgICAgIC5maW5kKCdsaScpXG4gICAgICAgICAgICAgICAgLmVxKE1hdGguZmxvb3IoXy5jdXJyZW50U2xpZGUgLyBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpKVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stYWN0aXZlJylcbiAgICAgICAgICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgU2xpY2sucHJvdG90eXBlLnZpc2liaWxpdHkgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgXyA9IHRoaXM7XG5cbiAgICAgICAgaWYgKCBfLm9wdGlvbnMuYXV0b3BsYXkgKSB7XG5cbiAgICAgICAgICAgIGlmICggZG9jdW1lbnRbXy5oaWRkZW5dICkge1xuXG4gICAgICAgICAgICAgICAgXy5pbnRlcnJ1cHRlZCA9IHRydWU7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBfLmludGVycnVwdGVkID0gZmFsc2U7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgJC5mbi5zbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgXyA9IHRoaXMsXG4gICAgICAgICAgICBvcHQgPSBhcmd1bWVudHNbMF0sXG4gICAgICAgICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSxcbiAgICAgICAgICAgIGwgPSBfLmxlbmd0aCxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICByZXQ7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0ID09ICdvYmplY3QnIHx8IHR5cGVvZiBvcHQgPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICAgICAgX1tpXS5zbGljayA9IG5ldyBTbGljayhfW2ldLCBvcHQpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldCA9IF9baV0uc2xpY2tbb3B0XS5hcHBseShfW2ldLnNsaWNrLCBhcmdzKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcmV0ICE9ICd1bmRlZmluZWQnKSByZXR1cm4gcmV0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfO1xuICAgIH07XG5cbn0pKTtcbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLnByb2plY3RWaWRlb0VtYmVkKCk7XG4gICAgfSxcblxuICAgIHByb2plY3RWaWRlb0VtYmVkKCkge1xuICAgICAgJC5nZXRTY3JpcHQoJ2h0dHA6Ly93d3cueW91dHViZS5jb20vaWZyYW1lX2FwaScpLmRvbmUoZnVuY3Rpb24oKSB7XG4gICAgICAgIGZ1bmN0aW9uIG9uUGxheWVyU3RhdGVDaGFuZ2UoZXZlbnQpIHtcbiAgICAgICAgICBzd2l0Y2goZXZlbnQuZGF0YSkge1xuICAgICAgICAgICAgY2FzZSBZVC5QbGF5ZXJTdGF0ZS5FTkRFRDpcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdWaWRlbyBoYXMgZW5kZWQuJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgWVQuUGxheWVyU3RhdGUuUExBWUlORzpcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdWaWRlbyBpcyBwbGF5aW5nLicpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFlULlBsYXllclN0YXRlLlBBVVNFRDpcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdWaWRlbyBpcyBwYXVzZWQuJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgWVQuUGxheWVyU3RhdGUuQlVGRkVSSU5HOlxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ1ZpZGVvIGlzIGJ1ZmZlcmluZy4nKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBZVC5QbGF5ZXJTdGF0ZS5DVUVEOlxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ1ZpZGVvIGlzIGN1ZWQuJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkKCcudmlkZW8td3JhcCAub3ZlcmxheScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB2aWRJZCA9ICQodGhpcykuYXR0cignZGF0YS1pZCcpO1xuICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICQodGhpcykucGFyZW50KCkuZmluZCgnLmlmcmFtZS1ib3gnKS5odG1sKCc8aWZyYW1lIGlkPVwicGxheWVyXycrdmlkSWQrJ1wiIHdpZHRoPVwiNDIwXCIgaGVpZ2h0PVwiMzE1XCIgc3JjPVwiaHR0cDovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC8nICsgdmlkSWQgKyAnP2VuYWJsZWpzYXBpPTEmYXV0b3BsYXk9MSZhdXRvaGlkZT0xJnNob3dpbmZvPTBcIiBmcmFtZWJvcmRlcj1cIjBcIiBhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+Jyk7XG5cbiAgICAgICAgICBuZXcgWVQuUGxheWVyKCdwbGF5ZXJfJyt2aWRJZCwge1xuICAgICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAgICdvblN0YXRlQ2hhbmdlJzogb25QbGF5ZXJTdGF0ZUNoYW5nZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgfSk7XG5cbiAgICB9XG59IiwiLy8gaW1wb3J0ICcuLi9saWJzL2pxdWVyeS52YWxpZGF0ZS5qcyc7XG5cbi8vIChmdW5jdGlvbigkKSB7XG4vLyAgICAgJC5mbi5mb3JtU3VibWl0ID0gZnVuY3Rpb24oKSB7XG4vLyAgICAgICAgICQodGhpcykuZWFjaChmdW5jdGlvbigpIHtcbi8vICAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbi8vICAgICAgICAgICAgICQodGhpcykudmFsaWRhdGUoe1xuLy8gICAgICAgICAgICAgICAgIHJ1bGVzOiB7XG4vLyAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicmVxdWlyZWRcIixcbi8vICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJyZXF1aXJlZFwiLFxuLy8gICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcInJlcXVpcmVkXCIsXG4vLyAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiB0cnVlXG4vLyAgICAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgICB9LFxuLy8gICAgICAgICAgICAgICAgIG1lc3NhZ2VzOiB7XG4vLyAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGZvcm1WYWxpZGF0ZVNldHRpbmdzLm5hbWUsXG4vLyAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGZvcm1WYWxpZGF0ZVNldHRpbmdzLm1lc3NhZ2VFbXB0eSxcbi8vICAgICAgICAgICAgICAgICAgICAgdGV4dDogZm9ybVZhbGlkYXRlU2V0dGluZ3MudGV4dEVtcHR5LFxuLy8gICAgICAgICAgICAgICAgICAgICBlbWFpbDoge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IGZvcm1WYWxpZGF0ZVNldHRpbmdzLmVtYWlsRW1wdHksXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogZm9ybVZhbGlkYXRlU2V0dGluZ3MuZW1haWxJbmNvcnJlY3Rcbi8vICAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgIH0sXG5cbi8vICAgICAgICAgICAgICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiBzdWJtaXRIYW5kbGVyKGZvcm0sIGUpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgICAgICAgICAgICAgICAgICB2YXIgJGZvcm0gPSAkKHRoYXQpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAkZm9ybS5hdHRyKCdtZXRob2QnKSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICRmb3JtLmF0dHIoJ2FjdGlvbicpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogJGZvcm0uc2VyaWFsaXplKClcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmRvbmUoZnVuY3Rpb24gKGRhdGEpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihkYXRhLnRpdGxlID09PSB1bmRlZmluZWQpIGRhdGEudGl0bGUgPSAnJztcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihkYXRhLm1lc3NhZ2UgPT09IHVuZGVmaW5lZCkgZGF0YS5tZXNzYWdlID0gJyc7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyA9PSB0cnVlKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLmhpZGUoMjAwKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm1bMF0ucmVzZXQoKTtcblxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZm9ybVN1Y2Nlc3MgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmb3JtLXN1Y2Nlc3MnKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybVN1Y2Nlc3MuaHRtbCgnPGRpdiBjbGFzcz1cInN0YXRlLWljb25cIj48L2Rpdj4gPGRpdiBjbGFzcz1cImZvcm0tdGl0bGVcIj4nICsgZGF0YS50aXRsZSArICc8L2Rpdj4gPGRpdiBjbGFzcz1cImZvcm0tZGVzY3JcIj4nICsgZGF0YS5tZXNzYWdlICsgJzwvZGl2PicpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5wYXJlbnQoKS5hcHBlbmQoZm9ybVN1Y2Nlc3MpO1xuXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0ucGFyZW50KCkuZmluZCgnLmZvcm0tc3VjY2VzcycpLnNob3coMjAwKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMjAwKTtcblxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLnBhcmVudCgpLmZpbmQoJy5mb3JtLXN1Y2Nlc3MnKS5oaWRlKDIwMCk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDMwMDApO1xuXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0ucGFyZW50KCkuZmluZCgnLmZvcm0tc3VjY2VzcycpLnJlbW92ZSgpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0ucGFyZW50KCkuZmluZCgnLmZvcm0tc3VjY2VzcycpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0uc2hvdygyMDApO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAzMjAwKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5oaWRlKDIwMCk7XG5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZvcm1FcnJvciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2Zvcm0tZXJyb3InKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybUVycm9yLmh0bWwoJzxkaXYgY2xhc3M9XCJzdGF0ZS1pY29uXCI+PC9kaXY+IDxkaXYgY2xhc3M9XCJmb3JtLXRpdGxlXCI+JyArIGRhdGEudGl0bGUgKyAnPC9kaXY+IDxkaXYgY2xhc3M9XCJmb3JtLWRlc2NyXCI+JyArIGRhdGEubWVzc2FnZSArICc8L2Rpdj48YSBocmVmPVwiI1wiIGNsYXNzPVwiYnRuXCI+JyArIGZvcm1WYWxpZGF0ZVNldHRpbmdzLnNlbmRfYWdhaW4gKyAnPC9hPicpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5wYXJlbnQoKS5hcHBlbmQoZm9ybUVycm9yKTtcblxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLnBhcmVudCgpLmZpbmQoJy5mb3JtLWVycm9yJykuc2hvdygyMDApO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAyMDApO1xuXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLnBhcmVudCgpLmZpbmQoJy5mb3JtLWVycm9yJykuZmluZCgnYScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5wYXJlbnQoKS5maW5kKCcuZm9ybS1lcnJvcicpLmhpZGUoMjAwKTtcblxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0ucGFyZW50KCkuZmluZCgnLmZvcm0tZXJyb3InKS5yZW1vdmUoKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5zaG93KDIwMCk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAyMDApO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICB9KS5mYWlsKGZ1bmN0aW9uICgpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5oaWRlKDIwMCk7XG5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZm9ybUVycm9yID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZm9ybS1lcnJvcicpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1FcnJvci5odG1sKCc8ZGl2IGNsYXNzPVwic3RhdGUtaWNvblwiPjwvZGl2PiA8ZGl2IGNsYXNzPVwiZm9ybS10aXRsZVwiPicgKyBmb3JtVmFsaWRhdGVTZXR0aW5ncy5zZW5kX2Vycm9yX3RpdGxlICsgJzwvZGl2PiA8ZGl2IGNsYXNzPVwiZm9ybS1kZXNjclwiPicgKyBmb3JtVmFsaWRhdGVTZXR0aW5ncy5zZW5kX2Vycm9yX21lc3NhZ2UgKyAnPC9kaXY+IDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJidG5cIj4nICsgZm9ybVZhbGlkYXRlU2V0dGluZ3Muc2VuZF9hZ2FpbiArICc8L2E+Jyk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0ucGFyZW50KCkuYXBwZW5kKGZvcm1FcnJvcik7XG5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0ucGFyZW50KCkuZmluZCgnLmZvcm0tZXJyb3InKS5zaG93KDIwMCk7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMjAwKTtcblxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLnBhcmVudCgpLmZpbmQoJy5mb3JtLWVycm9yJykuZmluZCgnYScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0ucGFyZW50KCkuZmluZCgnLmZvcm0tZXJyb3InKS5oaWRlKDIwMCk7XG5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5wYXJlbnQoKS5maW5kKCcuZm9ybS1lcnJvcicpLnJlbW92ZSgpO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0uc2hvdygyMDApO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAyMDApO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbi8vICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICB9KTtcbi8vICAgICAgICAgfSlcbi8vICAgICB9XG4vLyB9KShqUXVlcnkpO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy52YWxpZGF0aW9uKCk7XG4gICAgfSxcblxuICAgIHZhbGlkYXRpb24oKSB7XG4gICAgICAgIC8vICQoJ2Zvcm0nKS5mb3JtU3VibWl0KCk7XG5cbiAgICAgICAgJChcIi5tYXQtaW5wdXRcIikuZm9jdXMoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICQodGhpcykucGFyZW50KCkuYWRkQ2xhc3MoXCJpcy1hY3RpdmUgaXMtY29tcGxldGVkXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKFwiLm1hdC1pbnB1dFwiKS5mb2N1c291dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYoJCh0aGlzKS52YWwoKSA9PT0gXCJcIilcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLnJlbW92ZUNsYXNzKFwiaXMtY29tcGxldGVkXCIpO1xuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyhcImlzLWFjdGl2ZVwiKTtcbiAgICAgICAgfSk7XG4gICAgfVxufSIsImltcG9ydCBzZWxlY3QyIGZyb20gJy4uL2xpYnMvc2VsZWN0Mi5qcyc7XG5cblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gICAgaW5pdCgpe1xuICAgICAgICB0aGlzLmhlYWRlckZ1bmN0aW9ucygpO1xuICAgIH0sXG5cbiAgICBoZWFkZXJGdW5jdGlvbnMgKCkge1xuXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCgnLm1lbnUtYnV0dG9uJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgJCgnLnNpdGUtbmF2Jykuc2xpZGVVcCgnYWN0aXZlJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJy5tZW51LWJ1dHRvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAkKCcuc2l0ZS1uYXYnKS5zbGlkZVRvZ2dsZSgnYWN0aXZlJykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKCcuc2l0ZS1uYXYnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9KTtcblxuICAgICAgICBmdW5jdGlvbiBmb3JtYXRTdGF0ZSAoc3RhdGUpIHtcbiAgICAgICAgICAgIGlmICghc3RhdGUuaWQpIHsgcmV0dXJuIHN0YXRlLnRleHQ7IH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0YXRlLmVsZW1lbnQudmFsdWUuc3BsaXQoJ18nKVswXS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgICAgIHZhciAkc3RhdGUgPSAkKFxuICAgICAgICAgICAgICAgICc8c3Bhbj48aW1nIGNsYXNzPVwiY29udGV4dENoYW5nZVwiIHNyYz0gXCIuLi9pbWFnZXMvZmxhZ3MvJyArIHN0YXRlLmVsZW1lbnQudmFsdWUuc3BsaXQoJ18nKVswXS50b0xvd2VyQ2FzZSgpICsgJy5wbmdcIiBjbGFzcz1cImltZy1mbGFnXCIgLz4gJyArIHN0YXRlLnRleHQgKyAnPC9zcGFuPidcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuICRzdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgICQoXCIubGFuZ1wiKS5zZWxlY3QyKHtcbiAgICAgICAgICAgIC8vIHRlbXBsYXRlUmVzdWx0OiBmb3JtYXRTdGF0ZSxcbiAgICAgICAgICAgIC8vIHRlbXBsYXRlU2VsZWN0aW9uOiBmb3JtYXRTdGF0ZSxcbiAgICAgICAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyAkKCcubGFuZycpLm9uKFwic2VsZWN0MjpzZWxlY3RcIiwgZnVuY3Rpb24oZSl7XG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhlLnBhcmFtcyk7XG4gICAgICAgIC8vICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShlLnBhcmFtcy5kYXRhLmlkLnNwbGl0KCdfJylbMV0pO1xuICAgICAgICAvLyB9KTtcblxuICAgIH1cbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuXHRpbml0KCkge1xuXHRcdHRoaXMuaW5pdE1hcCgpO1xuXHR9LFxuXG5cdGluaXRNYXAoKSB7XG5cblx0XHRcdFx0JC5nZXRTY3JpcHQoXCJodHRwOi8vbWFwcy5nb29nbGUuY29tL21hcHMvYXBpL2pzP2tleT1BSXphU3lDMW11NXA3TDNLTUhuV1FYVGs0TFRXUjNCU2lhUXRkVzgmc2Vuc29yPXRydWVcIikuZG9uZShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRjb25zdCBtYXBJZCA9ICQoJyNtYXAnKTtcblx0XHRcdFx0XHRcdGNvbnN0IGRhdGFMYXQgPSBwYXJzZUZsb2F0KG1hcElkLmF0dHIoJ2RhdGEtbGF0JykpO1xuXHRcdFx0XHRcdFx0Y29uc3QgZGF0YUxuZyA9IHBhcnNlRmxvYXQobWFwSWQuYXR0cignZGF0YS1sbmcnKSk7XG5cdFx0XHRcdFx0XHRjb25zdCBjZW50ZXIgPSB7bGF0OiBkYXRhTGF0LCBsbmc6IGRhdGFMbmd9O1xuXG5cdFx0XHRcdFx0XHR2YXIgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1hcFwiKSwge1xuXHRcdFx0XHRcdFx0XHRcdHpvb206IDE2LFxuXHRcdFx0XHRcdFx0XHRcdGNlbnRlcjogY2VudGVyLFxuXHRcdFx0XHRcdFx0XHRcdHNjcm9sbHdoZWVsOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0XHRkcmFnZ2FibGU6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFx0em9vbUNvbnRyb2w6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRcdHpvb21Db250cm9sT3B0aW9uczoge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRwb3NpdGlvbjogZ29vZ2xlLm1hcHMuQ29udHJvbFBvc2l0aW9uLlRPUF9SSUdIVFxuXHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0cGFuQ29udHJvbDogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdFx0bWFwVHlwZUNvbnRyb2w6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRcdHN0cmVldFZpZXdDb250cm9sOiBmYWxzZVxuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcblx0XHRcdFx0XHRcdFx0XHRwb3NpdGlvbjogY2VudGVyLFxuXHRcdFx0XHRcdFx0XHRcdG1hcDogbWFwLFxuXHRcdFx0XHRcdFx0XHRcdHRpdGxlOiBcIm15IHBsYWNlXCJcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHR9XG59XG4iLCJpbXBvcnQgJy4uL2xpYnMvc2xpY2snO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJTbGlkZXIoKTtcbiAgICAgICAgdGhpcy5ob21lUHJvamVjdFNsaWRlcigpO1xuICAgICAgICB0aGlzLmhvbWVWZXJ0aWNhbFNsaWRlcigpO1xuICAgICAgICB0aGlzLmNlbnRlcmVkU2xpZGVyKCk7XG4gICAgICAgIHRoaXMuZG91YmxlU2xpZGVyKCk7XG4gICAgfSxcblxuICAgIGhlYWRlclNsaWRlcigpIHtcbiAgICAgICAgJCgnLnNpdGUtaGVhZGVyX3NsaWRlcicpLnNsaWNrKHtcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXG4gICAgICAgICAgICBhcnJvd3M6IGZhbHNlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIFxuICAgIH0sXG5cbiAgICBob21lUHJvamVjdFNsaWRlcigpIHtcbiAgICAgICQoJy5wcm9qZWN0cy1zbGlkZXInKS5zbGljayh7XG4gICAgICAgICAgY2VudGVyTW9kZTogdHJ1ZSxcbiAgICAgICAgICByZXNwb25zaXZlOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgYnJlYWtwb2ludDogMTAyMyxcbiAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgIGNlbnRlck1vZGU6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcblxuICAgICAgJCgnLnByb2plY3RzLXNsaWRlci1pbmZvIC5iLWluZm9faXRlbScpLmVxKDApLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgJCgnLnByb2plY3RzLXNsaWRlcicpLm9uKCdiZWZvcmVDaGFuZ2UnLCBmdW5jdGlvbihldmVudCwgc2xpY2ssIGN1cnJlbnRTbGlkZSwgbmV4dFNsaWRlKXtcbiAgICAgICAgJCgnLnByb2plY3RzLXNsaWRlci1pbmZvIC5iLWluZm9faXRlbScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICBpZiAoJCgnLnByb2plY3RzLXNsaWRlci1pbmZvIC5iLWluZm9faXRlbScpLmVxKG5leHRTbGlkZSkubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICAkKCcucHJvamVjdHMtc2xpZGVyLWluZm8gLmItaW5mb19pdGVtJykuZXEobmV4dFNsaWRlKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBob21lVmVydGljYWxTbGlkZXIoKSB7XG4gICAgICAkKCcuaG9tZS12ZXJpY2FsLXNsaWRlcicpLnNsaWNrKHtcbiAgICAgICAgZG90czogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSxcblxuICAgIGNlbnRlcmVkU2xpZGVyKCkge1xuICAgICAgJCgnLmNlbnRlci1zbGlkZXInKS5zbGljayh7XG4gICAgICAgIGNlbnRlck1vZGU6IHRydWUsXG4gICAgICAgIHNsaWRlc1RvU2hvdzogMyxcbiAgICAgICAgcmVzcG9uc2l2ZTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDEwMjMsXG4gICAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgICBjZW50ZXJNb2RlOiBmYWxzZSxcbiAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgZG91YmxlU2xpZGVyKCkge1xuICAgICAgJCgnLmRvdWJsZS1zbGlkZXInKS5zbGljayh7XG4gICAgICAgIGNlbnRlck1vZGU6IHRydWUsXG4gICAgICAgIHNsaWRlc1RvU2hvdzogMixcbiAgICAgICAgY2VudGVyUGFkZGluZzogJzgwcHgnLFxuICAgICAgICByZXNwb25zaXZlOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgYnJlYWtwb2ludDogMTAyMyxcbiAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgIGNlbnRlck1vZGU6IGZhbHNlLFxuICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXG4gICAgICAgICAgICAgIGNlbnRlclBhZGRpbmc6ICcwcHgnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9KTtcbiAgICB9XG59IiwiaW1wb3J0IEhlYWRlckZ1bmN0aW9ucyBmcm9tIFwiLi4vbW9kdWxlcy9oZWFkZXJGdW5jdGlvbnNcIjtcbmltcG9ydCBTbGlkZXJzIGZyb20gXCIuLi9tb2R1bGVzL3NsaWRlcnMuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGluaXQoKXtcbiAgICAgICAgSGVhZGVyRnVuY3Rpb25zLmluaXQoKTtcbiAgICAgICAgU2xpZGVycy5pbml0KCk7XG4gICAgfVxufTsiLCJpbXBvcnQgSGVhZGVyRnVuY3Rpb25zIGZyb20gXCIuLi9tb2R1bGVzL2hlYWRlckZ1bmN0aW9uc1wiO1xuaW1wb3J0IFNsaWRlcnMgZnJvbSBcIi4uL21vZHVsZXMvc2xpZGVycy5qc1wiO1xuaW1wb3J0IEZvcm1GdW5jdGlvbnMgZnJvbSBcIi4uL21vZHVsZXMvZm9ybUZ1bmN0aW9uc1wiO1xuaW1wb3J0IEdNYXAgZnJvbSAnLi4vbW9kdWxlcy9tYXAuanMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgaW5pdCgpe1xuICAgICAgICBIZWFkZXJGdW5jdGlvbnMuaW5pdCgpO1xuICAgICAgICBTbGlkZXJzLmluaXQoKTtcbiAgICAgICAgR01hcC5pbml0KCk7XG4gICAgICAgIEZvcm1GdW5jdGlvbnMuaW5pdCgpO1xuICAgIH1cbn07IiwiaW1wb3J0IEhlYWRlckZ1bmN0aW9ucyBmcm9tIFwiLi4vbW9kdWxlcy9oZWFkZXJGdW5jdGlvbnNcIjtcbmltcG9ydCBGb3JtRnVuY3Rpb25zIGZyb20gXCIuLi9tb2R1bGVzL2Zvcm1GdW5jdGlvbnNcIjtcbmltcG9ydCBTbGlkZXJzIGZyb20gXCIuLi9tb2R1bGVzL3NsaWRlcnMuanNcIjtcbmltcG9ydCBNYXBJbml0IGZyb20gXCIuLi9tb2R1bGVzL21hcC5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgaW5pdCgpe1xuICAgICAgICBIZWFkZXJGdW5jdGlvbnMuaW5pdCgpO1xuICAgICAgICBTbGlkZXJzLmluaXQoKTtcbiAgICAgICAgLy8gTWFwSW5pdC5pbml0KCk7XG4gICAgICAgIEZvcm1GdW5jdGlvbnMuaW5pdCgpO1xuICAgIH1cbn07IiwiaW1wb3J0IEhlYWRlckZ1bmN0aW9ucyBmcm9tIFwiLi4vbW9kdWxlcy9oZWFkZXJGdW5jdGlvbnNcIjtcbmltcG9ydCBTbGlkZXJzIGZyb20gXCIuLi9tb2R1bGVzL3NsaWRlcnMuanNcIjtcbmltcG9ydCBQTEFZRVIgZnJvbSAnLi4vbW9kdWxlcy9ZVGVtYmVkLmpzJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGluaXQoKXtcbiAgICAgICAgSGVhZGVyRnVuY3Rpb25zLmluaXQoKTtcbiAgICAgICAgU2xpZGVycy5pbml0KCk7XG4gICAgICAgIFBMQVlFUi5pbml0KCk7XG4gICAgfVxufTsiXX0=
