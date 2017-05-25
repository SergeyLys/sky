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

        $('select.lang').on('change', function () {
            $(this).closest('form').submit();
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
						console.log('map initialize');
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
      arrows: false,
      autoplay: true,
      autoplaySpeed: 2000
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXGpzXFxhc3NldHNcXGpzXFxnbG9iYWwuanMiLCJhc3NldHNcXGpzXFxsaWJzXFxzZWxlY3QyLmpzIiwiYXNzZXRzXFxqc1xcbGlic1xcc2xpY2suanMiLCJhc3NldHNcXGpzXFxtb2R1bGVzXFxZVGVtYmVkLmpzIiwiYXNzZXRzXFxqc1xcbW9kdWxlc1xcZm9ybUZ1bmN0aW9ucy5qcyIsImFzc2V0c1xcanNcXG1vZHVsZXNcXGhlYWRlckZ1bmN0aW9ucy5qcyIsImFzc2V0c1xcanNcXG1vZHVsZXNcXG1hcC5qcyIsImFzc2V0c1xcanNcXG1vZHVsZXNcXHNsaWRlcnMuanMiLCJhc3NldHNcXGpzXFxwYWdlc1xcQ09NTU9OLmpzIiwiYXNzZXRzXFxqc1xccGFnZXNcXENPTlRBQ1RTLmpzIiwiYXNzZXRzXFxqc1xccGFnZXNcXEhPTUUuanMiLCJhc3NldHNcXGpzXFxwYWdlc1xcUFJPSkVDVFMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBSSxPQUFPLElBQVg7O0FBRUEsUUFBUSxPQUFPLElBQVAsQ0FBWSxJQUFwQjtBQUNJLFNBQUssV0FBTDtBQUNJLGVBQU8sZUFBSyxJQUFMLENBQVUsSUFBVixnQkFBUDtBQUNBO0FBQ0osU0FBSyxlQUFMO0FBQ0ksZUFBTyxtQkFBUyxJQUFULENBQWMsSUFBZCxvQkFBUDtBQUNBO0FBQ0osU0FBSyxhQUFMO0FBQ0ksZUFBTyxpQkFBTyxJQUFQLENBQVksSUFBWixrQkFBUDtBQUNBO0FBQ0osU0FBSyxlQUFMO0FBQ0ksZUFBTyxtQkFBUyxJQUFULENBQWMsSUFBZCxvQkFBUDtBQUNBO0FBQ0o7QUFDSSxlQUFPLGdCQUFNO0FBQ1Qsb0JBQVEsR0FBUixDQUFZLGNBQVo7QUFDSCxTQUZEO0FBZFI7O0FBbUJBLEVBQUUsUUFBRixFQUFZLEtBQVos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O0FBeURmLGdCQUFVLEdBekRLO0FBMERmLGtCQUFVLEdBMURLO0FBMkRmLGtCQUFVLEdBM0RLO0FBNERmLGtCQUFVLEdBNURLO0FBNkRmLGtCQUFVLEdBN0RLO0FBOERmLGtCQUFVLEdBOURLO0FBK0RmLGtCQUFVLEdBL0RLO0FBZ0VmLGtCQUFVLEdBaEVLO0FBaUVmLGtCQUFVLEdBakVLO0FBa0VmLGtCQUFVLEdBbEVLO0FBbUVmLGtCQUFVLEdBbkVLO0FBb0VmLGtCQUFVLEdBcEVLO0FBcUVmLGtCQUFVLEdBckVLO0FBc0VmLGtCQUFVLEdBdEVLO0FBdUVmLGtCQUFVLEdBdkVLO0FBd0VmLGtCQUFVLEdBeEVLO0FBeUVmLGtCQUFVLEdBekVLO0FBMEVmLGtCQUFVLEdBMUVLO0FBMkVmLGtCQUFVLElBM0VLO0FBNEVmLGtCQUFVLElBNUVLO0FBNkVmLGtCQUFVLElBN0VLO0FBOEVmLGtCQUFVLElBOUVLO0FBK0VmLGtCQUFVLEdBL0VLO0FBZ0ZmLGtCQUFVLEdBaEZLO0FBaUZmLGdCQUFVLEdBakZLO0FBa0ZmLGdCQUFVLEdBbEZLO0FBbUZmLGdCQUFVLEdBbkZLO0FBb0ZmLGtCQUFVLEdBcEZLO0FBcUZmLGtCQUFVLEdBckZLO0FBc0ZmLGtCQUFVLEdBdEZLO0FBdUZmLGtCQUFVLEdBdkZLO0FBd0ZmLGtCQUFVLEdBeEZLO0FBeUZmLGtCQUFVLEdBekZLO0FBMEZmLGtCQUFVLEdBMUZLO0FBMkZmLGtCQUFVLEdBM0ZLO0FBNEZmLGtCQUFVLEdBNUZLO0FBNkZmLGtCQUFVLEdBN0ZLO0FBOEZmLGdCQUFVLEdBOUZLO0FBK0ZmLGtCQUFVLEdBL0ZLO0FBZ0dmLGtCQUFVLEdBaEdLO0FBaUdmLGtCQUFVLEdBakdLO0FBa0dmLGtCQUFVLEdBbEdLO0FBbUdmLGtCQUFVLEdBbkdLO0FBb0dmLGtCQUFVLEdBcEdLO0FBcUdmLGtCQUFVLEdBckdLO0FBc0dmLGtCQUFVLEdBdEdLO0FBdUdmLGtCQUFVLEdBdkdLO0FBd0dmLGtCQUFVLEdBeEdLO0FBeUdmLGtCQUFVLEdBekdLO0FBMEdmLGtCQUFVLEdBMUdLO0FBMkdmLGtCQUFVLEdBM0dLO0FBNEdmLGtCQUFVLEdBNUdLO0FBNkdmLGtCQUFVLEdBN0dLO0FBOEdmLGtCQUFVLEdBOUdLO0FBK0dmLGtCQUFVLEdBL0dLO0FBZ0hmLGtCQUFVLEdBaEhLO0FBaUhmLGtCQUFVLEdBakhLO0FBa0hmLGtCQUFVLEdBbEhLO0FBbUhmLGtCQUFVLEdBbkhLO0FBb0hmLGtCQUFVLEdBcEhLO0FBcUhmLGtCQUFVLEdBckhLO0FBc0hmLGtCQUFVLEdBdEhLO0FBdUhmLGtCQUFVLEdBdkhLO0FBd0hmLGtCQUFVLEdBeEhLO0FBeUhmLGtCQUFVLEdBekhLO0FBMEhmLGtCQUFVLEdBMUhLO0FBMkhmLGtCQUFVLEdBM0hLO0FBNEhmLGtCQUFVLEdBNUhLO0FBNkhmLGtCQUFVLEdBN0hLO0FBOEhmLGtCQUFVLEdBOUhLO0FBK0hmLGtCQUFVLEdBL0hLO0FBZ0lmLGtCQUFVLEdBaElLO0FBaUlmLGtCQUFVLEdBaklLO0FBa0lmLGtCQUFVLEdBbElLO0FBbUlmLGtCQUFVLEdBbklLO0FBb0lmLGtCQUFVLEdBcElLO0FBcUlmLGtCQUFVLEdBcklLO0FBc0lmLGtCQUFVLEdBdElLO0FBdUlmLGtCQUFVLEdBdklLO0FBd0lmLGtCQUFVLEdBeElLO0FBeUlmLGtCQUFVLEdBeklLO0FBMElmLGtCQUFVLEdBMUlLO0FBMklmLGtCQUFVLEdBM0lLO0FBNElmLGtCQUFVLEdBNUlLO0FBNklmLGtCQUFVLEdBN0lLO0FBOElmLGdCQUFVLEdBOUlLO0FBK0lmLGdCQUFVLEdBL0lLO0FBZ0pmLGdCQUFVLEdBaEpLO0FBaUpmLGtCQUFVLEdBakpLO0FBa0pmLGtCQUFVLEdBbEpLO0FBbUpmLGtCQUFVLEdBbkpLO0FBb0pmLGtCQUFVLEdBcEpLO0FBcUpmLGdCQUFVLEdBckpLO0FBc0pmLGtCQUFVLEdBdEpLO0FBdUpmLGtCQUFVLEdBdkpLO0FBd0pmLGtCQUFVLEdBeEpLO0FBeUpmLGtCQUFVLEdBekpLO0FBMEpmLGtCQUFVLEdBMUpLO0FBMkpmLGtCQUFVLEdBM0pLO0FBNEpmLGtCQUFVLEdBNUpLO0FBNkpmLGtCQUFVLEdBN0pLO0FBOEpmLGtCQUFVLEdBOUpLO0FBK0pmLGtCQUFVLEdBL0pLO0FBZ0tmLGtCQUFVLEdBaEtLO0FBaUtmLGtCQUFVLEdBaktLO0FBa0tmLGtCQUFVLEdBbEtLO0FBbUtmLGtCQUFVLEdBbktLO0FBb0tmLGtCQUFVLEdBcEtLO0FBcUtmLGtCQUFVLEdBcktLO0FBc0tmLGtCQUFVLEdBdEtLO0FBdUtmLGtCQUFVLEdBdktLO0FBd0tmLGtCQUFVLEdBeEtLO0FBeUtmLGtCQUFVLEdBektLO0FBMEtmLGtCQUFVLEdBMUtLO0FBMktmLGtCQUFVLEdBM0tLO0FBNEtmLGtCQUFVLEdBNUtLO0FBNktmLGtCQUFVLEdBN0tLO0FBOEtmLGtCQUFVLEdBOUtLO0FBK0tmLGtCQUFVLEdBL0tLO0FBZ0xmLGtCQUFVLEdBaExLO0FBaUxmLGtCQUFVLEdBakxLO0FBa0xmLGtCQUFVLEdBbExLO0FBbUxmLGtCQUFVLEdBbkxLO0FBb0xmLGtCQUFVLEdBcExLO0FBcUxmLGtCQUFVLEdBckxLO0FBc0xmLGtCQUFVLEdBdExLO0FBdUxmLGtCQUFVLEdBdkxLO0FBd0xmLGtCQUFVLEdBeExLO0FBeUxmLGtCQUFVLEdBekxLO0FBMExmLGtCQUFVLEdBMUxLO0FBMkxmLGtCQUFVLEdBM0xLO0FBNExmLGtCQUFVLEdBNUxLO0FBNkxmLGtCQUFVLEdBN0xLO0FBOExmLGtCQUFVLEdBOUxLO0FBK0xmLGtCQUFVLEdBL0xLO0FBZ01mLGtCQUFVLEdBaE1LO0FBaU1mLGtCQUFVLElBak1LO0FBa01mLGtCQUFVLElBbE1LO0FBbU1mLGtCQUFVLEdBbk1LO0FBb01mLGtCQUFVLEdBcE1LO0FBcU1mLGtCQUFVLEdBck1LO0FBc01mLGtCQUFVLEdBdE1LO0FBdU1mLGtCQUFVLEdBdk1LO0FBd01mLGtCQUFVLEdBeE1LO0FBeU1mLGtCQUFVLEdBek1LO0FBME1mLGtCQUFVLEdBMU1LO0FBMk1mLGtCQUFVLEdBM01LO0FBNE1mLGtCQUFVLEdBNU1LO0FBNk1mLGtCQUFVLEdBN01LO0FBOE1mLGdCQUFVLEdBOU1LO0FBK01mLGtCQUFVLEdBL01LO0FBZ05mLGtCQUFVLEdBaE5LO0FBaU5mLGtCQUFVLEdBak5LO0FBa05mLGtCQUFVLEdBbE5LO0FBbU5mLGtCQUFVLEdBbk5LO0FBb05mLGtCQUFVLEdBcE5LO0FBcU5mLGtCQUFVLEdBck5LO0FBc05mLGtCQUFVLEdBdE5LO0FBdU5mLGtCQUFVLEdBdk5LO0FBd05mLGtCQUFVLEdBeE5LO0FBeU5mLGtCQUFVLElBek5LO0FBME5mLGtCQUFVLElBMU5LO0FBMk5mLGtCQUFVLEdBM05LO0FBNE5mLGtCQUFVLEdBNU5LO0FBNk5mLGdCQUFVLEdBN05LO0FBOE5mLGdCQUFVLEdBOU5LO0FBK05mLGdCQUFVLEdBL05LO0FBZ09mLGtCQUFVLEdBaE9LO0FBaU9mLGtCQUFVLEdBak9LO0FBa09mLGtCQUFVLEdBbE9LO0FBbU9mLGtCQUFVLEdBbk9LO0FBb09mLGdCQUFVLEdBcE9LO0FBcU9mLGtCQUFVLEdBck9LO0FBc09mLGtCQUFVLEdBdE9LO0FBdU9mLGtCQUFVLEdBdk9LO0FBd09mLGtCQUFVLEdBeE9LO0FBeU9mLGtCQUFVLEdBek9LO0FBME9mLGtCQUFVLEdBMU9LO0FBMk9mLGtCQUFVLEdBM09LO0FBNE9mLGtCQUFVLEdBNU9LO0FBNk9mLGtCQUFVLEdBN09LO0FBOE9mLGdCQUFVLEdBOU9LO0FBK09mLGtCQUFVLEdBL09LO0FBZ1BmLGtCQUFVLEdBaFBLO0FBaVBmLGtCQUFVLEdBalBLO0FBa1BmLGtCQUFVLEdBbFBLO0FBbVBmLGtCQUFVLEdBblBLO0FBb1BmLGtCQUFVLEdBcFBLO0FBcVBmLGtCQUFVLEdBclBLO0FBc1BmLGtCQUFVLEdBdFBLO0FBdVBmLGtCQUFVLEdBdlBLO0FBd1BmLGtCQUFVLEdBeFBLO0FBeVBmLGtCQUFVLEdBelBLO0FBMFBmLGtCQUFVLEdBMVBLO0FBMlBmLGtCQUFVLEdBM1BLO0FBNFBmLGtCQUFVLEdBNVBLO0FBNlBmLGtCQUFVLEdBN1BLO0FBOFBmLGtCQUFVLEdBOVBLO0FBK1BmLGdCQUFVLEdBL1BLO0FBZ1FmLGtCQUFVLEdBaFFLO0FBaVFmLGtCQUFVLEdBalFLO0FBa1FmLGtCQUFVLEdBbFFLO0FBbVFmLGtCQUFVLEdBblFLO0FBb1FmLGtCQUFVLEdBcFFLO0FBcVFmLGtCQUFVLElBclFLO0FBc1FmLGtCQUFVLElBdFFLO0FBdVFmLGtCQUFVLElBdlFLO0FBd1FmLGtCQUFVLEdBeFFLO0FBeVFmLGtCQUFVLEdBelFLO0FBMFFmLGtCQUFVLEdBMVFLO0FBMlFmLGtCQUFVLEdBM1FLO0FBNFFmLGtCQUFVLEdBNVFLO0FBNlFmLGtCQUFVLEdBN1FLO0FBOFFmLGtCQUFVLEdBOVFLO0FBK1FmLGtCQUFVLEdBL1FLO0FBZ1JmLGtCQUFVLEdBaFJLO0FBaVJmLGtCQUFVLEdBalJLO0FBa1JmLGtCQUFVLEdBbFJLO0FBbVJmLGtCQUFVLEdBblJLO0FBb1JmLGtCQUFVLEdBcFJLO0FBcVJmLGtCQUFVLEdBclJLO0FBc1JmLGtCQUFVLEdBdFJLO0FBdVJmLGtCQUFVLEdBdlJLO0FBd1JmLGtCQUFVLEdBeFJLO0FBeVJmLGtCQUFVLEdBelJLO0FBMFJmLGtCQUFVLEdBMVJLO0FBMlJmLGtCQUFVLEdBM1JLO0FBNFJmLGtCQUFVLEdBNVJLO0FBNlJmLGtCQUFVLEdBN1JLO0FBOFJmLGtCQUFVLEdBOVJLO0FBK1JmLGtCQUFVLEdBL1JLO0FBZ1NmLGtCQUFVLEdBaFNLO0FBaVNmLGtCQUFVLEdBalNLO0FBa1NmLGtCQUFVLEdBbFNLO0FBbVNmLGtCQUFVLEdBblNLO0FBb1NmLGtCQUFVLEdBcFNLO0FBcVNmLGtCQUFVLEdBclNLO0FBc1NmLGtCQUFVLEdBdFNLO0FBdVNmLGtCQUFVLEdBdlNLO0FBd1NmLGtCQUFVLEdBeFNLO0FBeVNmLGtCQUFVLEdBelNLO0FBMFNmLGtCQUFVLEdBMVNLO0FBMlNmLGtCQUFVLEdBM1NLO0FBNFNmLGtCQUFVLEdBNVNLO0FBNlNmLGtCQUFVLEdBN1NLO0FBOFNmLGtCQUFVLEdBOVNLO0FBK1NmLGtCQUFVLEdBL1NLO0FBZ1RmLGtCQUFVLEdBaFRLO0FBaVRmLGtCQUFVLEdBalRLO0FBa1RmLGtCQUFVLEdBbFRLO0FBbVRmLGtCQUFVLEdBblRLO0FBb1RmLGtCQUFVLEdBcFRLO0FBcVRmLGtCQUFVLEdBclRLO0FBc1RmLGtCQUFVLEdBdFRLO0FBdVRmLGtCQUFVLEdBdlRLO0FBd1RmLGtCQUFVLEdBeFRLO0FBeVRmLGtCQUFVLEdBelRLO0FBMFRmLGtCQUFVLEdBMVRLO0FBMlRmLGtCQUFVLEdBM1RLO0FBNFRmLGtCQUFVLEdBNVRLO0FBNlRmLGtCQUFVLEdBN1RLO0FBOFRmLGtCQUFVLEdBOVRLO0FBK1RmLGtCQUFVLEdBL1RLO0FBZ1VmLGtCQUFVLEdBaFVLO0FBaVVmLGtCQUFVLEdBalVLO0FBa1VmLGtCQUFVLEdBbFVLO0FBbVVmLGtCQUFVLEdBblVLO0FBb1VmLGtCQUFVLElBcFVLO0FBcVVmLGtCQUFVLEdBclVLO0FBc1VmLGtCQUFVLEdBdFVLO0FBdVVmLGdCQUFVLEdBdlVLO0FBd1VmLGdCQUFVLEdBeFVLO0FBeVVmLGdCQUFVLEdBelVLO0FBMFVmLGtCQUFVLEdBMVVLO0FBMlVmLGtCQUFVLEdBM1VLO0FBNFVmLGtCQUFVLEdBNVVLO0FBNlVmLGtCQUFVLEdBN1VLO0FBOFVmLGtCQUFVLEdBOVVLO0FBK1VmLGdCQUFVLEdBL1VLO0FBZ1ZmLGtCQUFVLEdBaFZLO0FBaVZmLGtCQUFVLEdBalZLO0FBa1ZmLGtCQUFVLEdBbFZLO0FBbVZmLGtCQUFVLEdBblZLO0FBb1ZmLGtCQUFVLEdBcFZLO0FBcVZmLGtCQUFVLEdBclZLO0FBc1ZmLGtCQUFVLEdBdFZLO0FBdVZmLGtCQUFVLEdBdlZLO0FBd1ZmLGtCQUFVLEdBeFZLO0FBeVZmLGtCQUFVLEdBelZLO0FBMFZmLGtCQUFVLEdBMVZLO0FBMlZmLGtCQUFVLEdBM1ZLO0FBNFZmLGtCQUFVLEdBNVZLO0FBNlZmLGtCQUFVLEdBN1ZLO0FBOFZmLGtCQUFVLEdBOVZLO0FBK1ZmLGtCQUFVLEdBL1ZLO0FBZ1dmLGtCQUFVLEdBaFdLO0FBaVdmLGtCQUFVLEdBaldLO0FBa1dmLGtCQUFVLEdBbFdLO0FBbVdmLGtCQUFVLEdBbldLO0FBb1dmLGtCQUFVLEdBcFdLO0FBcVdmLGtCQUFVLEdBcldLO0FBc1dmLGtCQUFVLEdBdFdLO0FBdVdmLGtCQUFVLEdBdldLO0FBd1dmLGtCQUFVLEdBeFdLO0FBeVdmLGtCQUFVLEdBeldLO0FBMFdmLGtCQUFVLEdBMVdLO0FBMldmLGtCQUFVLEdBM1dLO0FBNFdmLGtCQUFVLEdBNVdLO0FBNldmLGtCQUFVLElBN1dLO0FBOFdmLGtCQUFVLEdBOVdLO0FBK1dmLGtCQUFVLEdBL1dLO0FBZ1hmLGtCQUFVLEdBaFhLO0FBaVhmLGtCQUFVLEdBalhLO0FBa1hmLGtCQUFVLEdBbFhLO0FBbVhmLGtCQUFVLEdBblhLO0FBb1hmLGtCQUFVLEdBcFhLO0FBcVhmLGtCQUFVLEdBclhLO0FBc1hmLGtCQUFVLEdBdFhLO0FBdVhmLGtCQUFVLEdBdlhLO0FBd1hmLGtCQUFVLEdBeFhLO0FBeVhmLGtCQUFVLEdBelhLO0FBMFhmLGtCQUFVLEdBMVhLO0FBMlhmLGtCQUFVLEdBM1hLO0FBNFhmLGtCQUFVLEdBNVhLO0FBNlhmLGtCQUFVLEdBN1hLO0FBOFhmLGdCQUFVLEdBOVhLO0FBK1hmLGtCQUFVLEdBL1hLO0FBZ1lmLGtCQUFVLEdBaFlLO0FBaVlmLGtCQUFVLEdBallLO0FBa1lmLGtCQUFVLEdBbFlLO0FBbVlmLGtCQUFVLEdBbllLO0FBb1lmLGtCQUFVLEdBcFlLO0FBcVlmLGtCQUFVLEdBcllLO0FBc1lmLGtCQUFVLEdBdFlLO0FBdVlmLGtCQUFVLEdBdllLO0FBd1lmLGtCQUFVLEdBeFlLO0FBeVlmLGtCQUFVLEdBellLO0FBMFlmLGtCQUFVLEdBMVlLO0FBMllmLGtCQUFVLEdBM1lLO0FBNFlmLGtCQUFVLEdBNVlLO0FBNllmLGtCQUFVLEdBN1lLO0FBOFlmLGtCQUFVLEdBOVlLO0FBK1lmLGtCQUFVLEdBL1lLO0FBZ1pmLGtCQUFVLEdBaFpLO0FBaVpmLGtCQUFVLEdBalpLO0FBa1pmLGtCQUFVLEdBbFpLO0FBbVpmLGtCQUFVLEdBblpLO0FBb1pmLGtCQUFVLEdBcFpLO0FBcVpmLGtCQUFVLEdBclpLO0FBc1pmLGtCQUFVLEdBdFpLO0FBdVpmLGtCQUFVLEdBdlpLO0FBd1pmLGtCQUFVLEdBeFpLO0FBeVpmLGdCQUFVLEdBelpLO0FBMFpmLGdCQUFVLEdBMVpLO0FBMlpmLGdCQUFVLEdBM1pLO0FBNFpmLGtCQUFVLEdBNVpLO0FBNlpmLGtCQUFVLEdBN1pLO0FBOFpmLGtCQUFVLEdBOVpLO0FBK1pmLGtCQUFVLEdBL1pLO0FBZ2FmLGdCQUFVLEdBaGFLO0FBaWFmLGtCQUFVLEdBamFLO0FBa2FmLGtCQUFVLEdBbGFLO0FBbWFmLGtCQUFVLEdBbmFLO0FBb2FmLGtCQUFVLEdBcGFLO0FBcWFmLGtCQUFVLEdBcmFLO0FBc2FmLGtCQUFVLEdBdGFLO0FBdWFmLGtCQUFVLEdBdmFLO0FBd2FmLGtCQUFVLEdBeGFLO0FBeWFmLGdCQUFVLEdBemFLO0FBMGFmLGtCQUFVLEdBMWFLO0FBMmFmLGtCQUFVLEdBM2FLO0FBNGFmLGdCQUFVLEdBNWFLO0FBNmFmLGtCQUFVLEdBN2FLO0FBOGFmLGtCQUFVLEdBOWFLO0FBK2FmLGtCQUFVLEdBL2FLO0FBZ2JmLGtCQUFVLEdBaGJLO0FBaWJmLGtCQUFVLEdBamJLO0FBa2JmLGtCQUFVLEdBbGJLO0FBbWJmLGtCQUFVLEdBbmJLO0FBb2JmLGtCQUFVLEdBcGJLO0FBcWJmLGtCQUFVLEdBcmJLO0FBc2JmLGtCQUFVLEdBdGJLO0FBdWJmLGtCQUFVLEdBdmJLO0FBd2JmLGtCQUFVLElBeGJLO0FBeWJmLGdCQUFVLElBemJLO0FBMGJmLGtCQUFVLElBMWJLO0FBMmJmLGtCQUFVLElBM2JLO0FBNGJmLGtCQUFVLElBNWJLO0FBNmJmLGtCQUFVLElBN2JLO0FBOGJmLGtCQUFVLElBOWJLO0FBK2JmLGtCQUFVLElBL2JLO0FBZ2NmLGtCQUFVLElBaGNLO0FBaWNmLGtCQUFVLEdBamNLO0FBa2NmLGtCQUFVLEdBbGNLO0FBbWNmLGtCQUFVLEdBbmNLO0FBb2NmLGtCQUFVLEdBcGNLO0FBcWNmLGtCQUFVLEdBcmNLO0FBc2NmLGtCQUFVLEdBdGNLO0FBdWNmLGtCQUFVLEdBdmNLO0FBd2NmLGtCQUFVLEdBeGNLO0FBeWNmLGtCQUFVLEdBemNLO0FBMGNmLGtCQUFVLEdBMWNLO0FBMmNmLGtCQUFVLEdBM2NLO0FBNGNmLGtCQUFVLEdBNWNLO0FBNmNmLGtCQUFVLEdBN2NLO0FBOGNmLGtCQUFVLEdBOWNLO0FBK2NmLGdCQUFVLEdBL2NLO0FBZ2RmLGtCQUFVLEdBaGRLO0FBaWRmLGtCQUFVLEdBamRLO0FBa2RmLGtCQUFVLEdBbGRLO0FBbWRmLGtCQUFVLEdBbmRLO0FBb2RmLGtCQUFVLEdBcGRLO0FBcWRmLGtCQUFVLEdBcmRLO0FBc2RmLGtCQUFVLEdBdGRLO0FBdWRmLGtCQUFVLEdBdmRLO0FBd2RmLGtCQUFVLEdBeGRLO0FBeWRmLGtCQUFVLEdBemRLO0FBMGRmLGtCQUFVLEdBMWRLO0FBMmRmLGtCQUFVLEdBM2RLO0FBNGRmLGtCQUFVLEdBNWRLO0FBNmRmLGtCQUFVLEdBN2RLO0FBOGRmLGtCQUFVLEdBOWRLO0FBK2RmLGtCQUFVLEdBL2RLO0FBZ2VmLGtCQUFVLEdBaGVLO0FBaWVmLGtCQUFVLEdBamVLO0FBa2VmLGtCQUFVLElBbGVLO0FBbWVmLGtCQUFVLElBbmVLO0FBb2VmLGtCQUFVLEdBcGVLO0FBcWVmLGtCQUFVLEdBcmVLO0FBc2VmLGdCQUFVLEdBdGVLO0FBdWVmLGdCQUFVLEdBdmVLO0FBd2VmLGdCQUFVLEdBeGVLO0FBeWVmLGtCQUFVLEdBemVLO0FBMGVmLGtCQUFVLEdBMWVLO0FBMmVmLGtCQUFVLEdBM2VLO0FBNGVmLGtCQUFVLEdBNWVLO0FBNmVmLGtCQUFVLEdBN2VLO0FBOGVmLGtCQUFVLEdBOWVLO0FBK2VmLGtCQUFVLEdBL2VLO0FBZ2ZmLGtCQUFVLEdBaGZLO0FBaWZmLGtCQUFVLEdBamZLO0FBa2ZmLGtCQUFVLEdBbGZLO0FBbWZmLGdCQUFVLEdBbmZLO0FBb2ZmLGtCQUFVLEdBcGZLO0FBcWZmLGtCQUFVLEdBcmZLO0FBc2ZmLGtCQUFVLEdBdGZLO0FBdWZmLGtCQUFVLEdBdmZLO0FBd2ZmLGtCQUFVLEdBeGZLO0FBeWZmLGtCQUFVLEdBemZLO0FBMGZmLGtCQUFVLEdBMWZL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OztBQUNBOzs7Ozs7a0JBRWU7QUFDWCxRQURXLGtCQUNMO0FBQ0Ysa0NBQWdCLElBQWhCO0FBQ0EsMEJBQVEsSUFBUjtBQUNBO0FBQ0EsZ0NBQWMsSUFBZDtBQUNIO0FBTlUsQzs7Ozs7Ozs7O0FDTGY7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7a0JBRWU7QUFDWCxRQURXLGtCQUNMO0FBQ0Ysa0NBQWdCLElBQWhCO0FBQ0EsMEJBQVEsSUFBUjtBQUNBLDBCQUFPLElBQVA7QUFDSDtBQUxVLEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IENPTU1PTiBmcm9tICcuL3BhZ2VzL0NPTU1PTic7XHJcbmltcG9ydCBIT01FIGZyb20gXCIuL3BhZ2VzL0hPTUVcIjtcclxuaW1wb3J0IFBST0pFQ1RTIGZyb20gXCIuL3BhZ2VzL1BST0pFQ1RTXCI7XHJcbmltcG9ydCBDT05UQUNUUyBmcm9tIFwiLi9wYWdlcy9DT05UQUNUU1wiO1xyXG5cclxubGV0IGluaXQgPSBudWxsO1xyXG5cclxuc3dpdGNoIChnbG9iYWwudmFycy5wYWdlKSB7XHJcbiAgICBjYXNlICdob21lX3BhZ2UnOlxyXG4gICAgICAgIGluaXQgPSBIT01FLmluaXQuYmluZChIT01FKTtcclxuICAgICAgICBicmVhaztcclxuICAgIGNhc2UgJ3Byb2plY3RzX3BhZ2UnOlxyXG4gICAgICAgIGluaXQgPSBQUk9KRUNUUy5pbml0LmJpbmQoUFJPSkVDVFMpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnY29tbW9uX3BhZ2UnOlxyXG4gICAgICAgIGluaXQgPSBDT01NT04uaW5pdC5iaW5kKENPTU1PTik7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdjb250YWN0c19wYWdlJzpcclxuICAgICAgICBpbml0ID0gQ09OVEFDVFMuaW5pdC5iaW5kKENPTlRBQ1RTKTtcclxuICAgICAgICBicmVhaztcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgaW5pdCA9ICgpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2RlZmF1bHQgaW5pdCcpO1xyXG4gICAgICAgIH07XHJcbn1cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGluaXQoKSk7XHJcblxyXG4kKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xyXG5cclxufSk7XHJcblxyXG4kKHdpbmRvdykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xyXG5cclxufSk7XHJcblxyXG4kKHdpbmRvdykub24oJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XHJcblxyXG59KTsiLCIvKiFcclxuICogU2VsZWN0MiA0LjAuM1xyXG4gKiBodHRwczovL3NlbGVjdDIuZ2l0aHViLmlvXHJcbiAqXHJcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vc2VsZWN0Mi9zZWxlY3QyL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWRcclxuICovXHJcbihmdW5jdGlvbiAoZmFjdG9yeSkge1xyXG4gICAgZmFjdG9yeShqUXVlcnkpO1xyXG59KGZ1bmN0aW9uIChqUXVlcnkpIHtcclxuICAvLyBUaGlzIGlzIG5lZWRlZCBzbyB3ZSBjYW4gY2F0Y2ggdGhlIEFNRCBsb2FkZXIgY29uZmlndXJhdGlvbiBhbmQgdXNlIGl0XHJcbiAgLy8gVGhlIGlubmVyIGZpbGUgc2hvdWxkIGJlIHdyYXBwZWQgKGJ5IGBiYW5uZXIuc3RhcnQuanNgKSBpbiBhIGZ1bmN0aW9uIHRoYXRcclxuICAvLyByZXR1cm5zIHRoZSBBTUQgbG9hZGVyIHJlZmVyZW5jZXMuXHJcbiAgdmFyIFMyID1cclxuKGZ1bmN0aW9uICgpIHtcclxuICAvLyBSZXN0b3JlIHRoZSBTZWxlY3QyIEFNRCBsb2FkZXIgc28gaXQgY2FuIGJlIHVzZWRcclxuICAvLyBOZWVkZWQgbW9zdGx5IGluIHRoZSBsYW5ndWFnZSBmaWxlcywgd2hlcmUgdGhlIGxvYWRlciBpcyBub3QgaW5zZXJ0ZWRcclxuICBpZiAoalF1ZXJ5ICYmIGpRdWVyeS5mbiAmJiBqUXVlcnkuZm4uc2VsZWN0MiAmJiBqUXVlcnkuZm4uc2VsZWN0Mi5hbWQpIHtcclxuICAgIHZhciBTMiA9IGpRdWVyeS5mbi5zZWxlY3QyLmFtZDtcclxuICB9XHJcbnZhciBTMjsoZnVuY3Rpb24gKCkgeyBpZiAoIVMyIHx8ICFTMi5yZXF1aXJlanMpIHtcclxuaWYgKCFTMikgeyBTMiA9IHt9OyB9IGVsc2UgeyByZXF1aXJlID0gUzI7IH1cclxuLyoqXHJcbiAqIEBsaWNlbnNlIGFsbW9uZCAwLjMuMSBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxNCwgVGhlIERvam8gRm91bmRhdGlvbiBBbGwgUmlnaHRzIFJlc2VydmVkLlxyXG4gKiBBdmFpbGFibGUgdmlhIHRoZSBNSVQgb3IgbmV3IEJTRCBsaWNlbnNlLlxyXG4gKiBzZWU6IGh0dHA6Ly9naXRodWIuY29tL2pyYnVya2UvYWxtb25kIGZvciBkZXRhaWxzXHJcbiAqL1xyXG4vL0dvaW5nIHNsb3BweSB0byBhdm9pZCAndXNlIHN0cmljdCcgc3RyaW5nIGNvc3QsIGJ1dCBzdHJpY3QgcHJhY3RpY2VzIHNob3VsZFxyXG4vL2JlIGZvbGxvd2VkLlxyXG4vKmpzbGludCBzbG9wcHk6IHRydWUgKi9cclxuLypnbG9iYWwgc2V0VGltZW91dDogZmFsc2UgKi9cclxuXHJcbnZhciByZXF1aXJlanMsIHJlcXVpcmUsIGRlZmluZTtcclxuKGZ1bmN0aW9uICh1bmRlZikge1xyXG4gICAgdmFyIG1haW4sIHJlcSwgbWFrZU1hcCwgaGFuZGxlcnMsXHJcbiAgICAgICAgZGVmaW5lZCA9IHt9LFxyXG4gICAgICAgIHdhaXRpbmcgPSB7fSxcclxuICAgICAgICBjb25maWcgPSB7fSxcclxuICAgICAgICBkZWZpbmluZyA9IHt9LFxyXG4gICAgICAgIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHksXHJcbiAgICAgICAgYXBzID0gW10uc2xpY2UsXHJcbiAgICAgICAganNTdWZmaXhSZWdFeHAgPSAvXFwuanMkLztcclxuXHJcbiAgICBmdW5jdGlvbiBoYXNQcm9wKG9iaiwgcHJvcCkge1xyXG4gICAgICAgIHJldHVybiBoYXNPd24uY2FsbChvYmosIHByb3ApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2l2ZW4gYSByZWxhdGl2ZSBtb2R1bGUgbmFtZSwgbGlrZSAuL3NvbWV0aGluZywgbm9ybWFsaXplIGl0IHRvXHJcbiAgICAgKiBhIHJlYWwgbmFtZSB0aGF0IGNhbiBiZSBtYXBwZWQgdG8gYSBwYXRoLlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgdGhlIHJlbGF0aXZlIG5hbWVcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBiYXNlTmFtZSBhIHJlYWwgbmFtZSB0aGF0IHRoZSBuYW1lIGFyZyBpcyByZWxhdGl2ZVxyXG4gICAgICogdG8uXHJcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSBub3JtYWxpemVkIG5hbWVcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplKG5hbWUsIGJhc2VOYW1lKSB7XHJcbiAgICAgICAgdmFyIG5hbWVQYXJ0cywgbmFtZVNlZ21lbnQsIG1hcFZhbHVlLCBmb3VuZE1hcCwgbGFzdEluZGV4LFxyXG4gICAgICAgICAgICBmb3VuZEksIGZvdW5kU3Rhck1hcCwgc3RhckksIGksIGosIHBhcnQsXHJcbiAgICAgICAgICAgIGJhc2VQYXJ0cyA9IGJhc2VOYW1lICYmIGJhc2VOYW1lLnNwbGl0KFwiL1wiKSxcclxuICAgICAgICAgICAgbWFwID0gY29uZmlnLm1hcCxcclxuICAgICAgICAgICAgc3Rhck1hcCA9IChtYXAgJiYgbWFwWycqJ10pIHx8IHt9O1xyXG5cclxuICAgICAgICAvL0FkanVzdCBhbnkgcmVsYXRpdmUgcGF0aHMuXHJcbiAgICAgICAgaWYgKG5hbWUgJiYgbmFtZS5jaGFyQXQoMCkgPT09IFwiLlwiKSB7XHJcbiAgICAgICAgICAgIC8vSWYgaGF2ZSBhIGJhc2UgbmFtZSwgdHJ5IHRvIG5vcm1hbGl6ZSBhZ2FpbnN0IGl0LFxyXG4gICAgICAgICAgICAvL290aGVyd2lzZSwgYXNzdW1lIGl0IGlzIGEgdG9wLWxldmVsIHJlcXVpcmUgdGhhdCB3aWxsXHJcbiAgICAgICAgICAgIC8vYmUgcmVsYXRpdmUgdG8gYmFzZVVybCBpbiB0aGUgZW5kLlxyXG4gICAgICAgICAgICBpZiAoYmFzZU5hbWUpIHtcclxuICAgICAgICAgICAgICAgIG5hbWUgPSBuYW1lLnNwbGl0KCcvJyk7XHJcbiAgICAgICAgICAgICAgICBsYXN0SW5kZXggPSBuYW1lLmxlbmd0aCAtIDE7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTm9kZSAuanMgYWxsb3dhbmNlOlxyXG4gICAgICAgICAgICAgICAgaWYgKGNvbmZpZy5ub2RlSWRDb21wYXQgJiYganNTdWZmaXhSZWdFeHAudGVzdChuYW1lW2xhc3RJbmRleF0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZVtsYXN0SW5kZXhdID0gbmFtZVtsYXN0SW5kZXhdLnJlcGxhY2UoanNTdWZmaXhSZWdFeHAsICcnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvL0xvcCBvZmYgdGhlIGxhc3QgcGFydCBvZiBiYXNlUGFydHMsIHNvIHRoYXQgLiBtYXRjaGVzIHRoZVxyXG4gICAgICAgICAgICAgICAgLy9cImRpcmVjdG9yeVwiIGFuZCBub3QgbmFtZSBvZiB0aGUgYmFzZU5hbWUncyBtb2R1bGUuIEZvciBpbnN0YW5jZSxcclxuICAgICAgICAgICAgICAgIC8vYmFzZU5hbWUgb2YgXCJvbmUvdHdvL3RocmVlXCIsIG1hcHMgdG8gXCJvbmUvdHdvL3RocmVlLmpzXCIsIGJ1dCB3ZVxyXG4gICAgICAgICAgICAgICAgLy93YW50IHRoZSBkaXJlY3RvcnksIFwib25lL3R3b1wiIGZvciB0aGlzIG5vcm1hbGl6YXRpb24uXHJcbiAgICAgICAgICAgICAgICBuYW1lID0gYmFzZVBhcnRzLnNsaWNlKDAsIGJhc2VQYXJ0cy5sZW5ndGggLSAxKS5jb25jYXQobmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9zdGFydCB0cmltRG90c1xyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG5hbWUubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJ0ID0gbmFtZVtpXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGFydCA9PT0gXCIuXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZS5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgLT0gMTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBhcnQgPT09IFwiLi5cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMSAmJiAobmFtZVsyXSA9PT0gJy4uJyB8fCBuYW1lWzBdID09PSAnLi4nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9FbmQgb2YgdGhlIGxpbmUuIEtlZXAgYXQgbGVhc3Qgb25lIG5vbi1kb3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vcGF0aCBzZWdtZW50IGF0IHRoZSBmcm9udCBzbyBpdCBjYW4gYmUgbWFwcGVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvcnJlY3RseSB0byBkaXNrLiBPdGhlcndpc2UsIHRoZXJlIGlzIGxpa2VseVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9ubyBwYXRoIG1hcHBpbmcgZm9yIGEgcGF0aCBzdGFydGluZyB3aXRoICcuLicuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1RoaXMgY2FuIHN0aWxsIGZhaWwsIGJ1dCBjYXRjaGVzIHRoZSBtb3N0IHJlYXNvbmFibGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdXNlcyBvZiAuLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUuc3BsaWNlKGkgLSAxLCAyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkgLT0gMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vZW5kIHRyaW1Eb3RzXHJcblxyXG4gICAgICAgICAgICAgICAgbmFtZSA9IG5hbWUuam9pbihcIi9cIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobmFtZS5pbmRleE9mKCcuLycpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBObyBiYXNlTmFtZSwgc28gdGhpcyBpcyBJRCBpcyByZXNvbHZlZCByZWxhdGl2ZVxyXG4gICAgICAgICAgICAgICAgLy8gdG8gYmFzZVVybCwgcHVsbCBvZmYgdGhlIGxlYWRpbmcgZG90LlxyXG4gICAgICAgICAgICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyaW5nKDIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL0FwcGx5IG1hcCBjb25maWcgaWYgYXZhaWxhYmxlLlxyXG4gICAgICAgIGlmICgoYmFzZVBhcnRzIHx8IHN0YXJNYXApICYmIG1hcCkge1xyXG4gICAgICAgICAgICBuYW1lUGFydHMgPSBuYW1lLnNwbGl0KCcvJyk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGkgPSBuYW1lUGFydHMubGVuZ3RoOyBpID4gMDsgaSAtPSAxKSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lU2VnbWVudCA9IG5hbWVQYXJ0cy5zbGljZSgwLCBpKS5qb2luKFwiL1wiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoYmFzZVBhcnRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9GaW5kIHRoZSBsb25nZXN0IGJhc2VOYW1lIHNlZ21lbnQgbWF0Y2ggaW4gdGhlIGNvbmZpZy5cclxuICAgICAgICAgICAgICAgICAgICAvL1NvLCBkbyBqb2lucyBvbiB0aGUgYmlnZ2VzdCB0byBzbWFsbGVzdCBsZW5ndGhzIG9mIGJhc2VQYXJ0cy5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSBiYXNlUGFydHMubGVuZ3RoOyBqID4gMDsgaiAtPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcFZhbHVlID0gbWFwW2Jhc2VQYXJ0cy5zbGljZSgwLCBqKS5qb2luKCcvJyldO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9iYXNlTmFtZSBzZWdtZW50IGhhcyAgY29uZmlnLCBmaW5kIGlmIGl0IGhhcyBvbmUgZm9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhpcyBuYW1lLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFwVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcFZhbHVlID0gbWFwVmFsdWVbbmFtZVNlZ21lbnRdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hcFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9NYXRjaCwgdXBkYXRlIG5hbWUgdG8gdGhlIG5ldyB2YWx1ZS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZE1hcCA9IG1hcFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kSSA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGZvdW5kTWFwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy9DaGVjayBmb3IgYSBzdGFyIG1hcCBtYXRjaCwgYnV0IGp1c3QgaG9sZCBvbiB0byBpdCxcclxuICAgICAgICAgICAgICAgIC8vaWYgdGhlcmUgaXMgYSBzaG9ydGVyIHNlZ21lbnQgbWF0Y2ggbGF0ZXIgaW4gYSBtYXRjaGluZ1xyXG4gICAgICAgICAgICAgICAgLy9jb25maWcsIHRoZW4gZmF2b3Igb3ZlciB0aGlzIHN0YXIgbWFwLlxyXG4gICAgICAgICAgICAgICAgaWYgKCFmb3VuZFN0YXJNYXAgJiYgc3Rhck1hcCAmJiBzdGFyTWFwW25hbWVTZWdtZW50XSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvdW5kU3Rhck1hcCA9IHN0YXJNYXBbbmFtZVNlZ21lbnRdO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJJID0gaTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFmb3VuZE1hcCAmJiBmb3VuZFN0YXJNYXApIHtcclxuICAgICAgICAgICAgICAgIGZvdW5kTWFwID0gZm91bmRTdGFyTWFwO1xyXG4gICAgICAgICAgICAgICAgZm91bmRJID0gc3Rhckk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChmb3VuZE1hcCkge1xyXG4gICAgICAgICAgICAgICAgbmFtZVBhcnRzLnNwbGljZSgwLCBmb3VuZEksIGZvdW5kTWFwKTtcclxuICAgICAgICAgICAgICAgIG5hbWUgPSBuYW1lUGFydHMuam9pbignLycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBtYWtlUmVxdWlyZShyZWxOYW1lLCBmb3JjZVN5bmMpIHtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvL0EgdmVyc2lvbiBvZiBhIHJlcXVpcmUgZnVuY3Rpb24gdGhhdCBwYXNzZXMgYSBtb2R1bGVOYW1lXHJcbiAgICAgICAgICAgIC8vdmFsdWUgZm9yIGl0ZW1zIHRoYXQgbWF5IG5lZWQgdG9cclxuICAgICAgICAgICAgLy9sb29rIHVwIHBhdGhzIHJlbGF0aXZlIHRvIHRoZSBtb2R1bGVOYW1lXHJcbiAgICAgICAgICAgIHZhciBhcmdzID0gYXBzLmNhbGwoYXJndW1lbnRzLCAwKTtcclxuXHJcbiAgICAgICAgICAgIC8vSWYgZmlyc3QgYXJnIGlzIG5vdCByZXF1aXJlKCdzdHJpbmcnKSwgYW5kIHRoZXJlIGlzIG9ubHlcclxuICAgICAgICAgICAgLy9vbmUgYXJnLCBpdCBpcyB0aGUgYXJyYXkgZm9ybSB3aXRob3V0IGEgY2FsbGJhY2suIEluc2VydFxyXG4gICAgICAgICAgICAvL2EgbnVsbCBzbyB0aGF0IHRoZSBmb2xsb3dpbmcgY29uY2F0IGlzIGNvcnJlY3QuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXJnc1swXSAhPT0gJ3N0cmluZycgJiYgYXJncy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgIGFyZ3MucHVzaChudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVxLmFwcGx5KHVuZGVmLCBhcmdzLmNvbmNhdChbcmVsTmFtZSwgZm9yY2VTeW5jXSkpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbWFrZU5vcm1hbGl6ZShyZWxOYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBub3JtYWxpemUobmFtZSwgcmVsTmFtZSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBtYWtlTG9hZChkZXBOYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICBkZWZpbmVkW2RlcE5hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjYWxsRGVwKG5hbWUpIHtcclxuICAgICAgICBpZiAoaGFzUHJvcCh3YWl0aW5nLCBuYW1lKSkge1xyXG4gICAgICAgICAgICB2YXIgYXJncyA9IHdhaXRpbmdbbmFtZV07XHJcbiAgICAgICAgICAgIGRlbGV0ZSB3YWl0aW5nW25hbWVdO1xyXG4gICAgICAgICAgICBkZWZpbmluZ1tuYW1lXSA9IHRydWU7XHJcbiAgICAgICAgICAgIG1haW4uYXBwbHkodW5kZWYsIGFyZ3MpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFoYXNQcm9wKGRlZmluZWQsIG5hbWUpICYmICFoYXNQcm9wKGRlZmluaW5nLCBuYW1lKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vICcgKyBuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlZmluZWRbbmFtZV07XHJcbiAgICB9XHJcblxyXG4gICAgLy9UdXJucyBhIHBsdWdpbiFyZXNvdXJjZSB0byBbcGx1Z2luLCByZXNvdXJjZV1cclxuICAgIC8vd2l0aCB0aGUgcGx1Z2luIGJlaW5nIHVuZGVmaW5lZCBpZiB0aGUgbmFtZVxyXG4gICAgLy9kaWQgbm90IGhhdmUgYSBwbHVnaW4gcHJlZml4LlxyXG4gICAgZnVuY3Rpb24gc3BsaXRQcmVmaXgobmFtZSkge1xyXG4gICAgICAgIHZhciBwcmVmaXgsXHJcbiAgICAgICAgICAgIGluZGV4ID0gbmFtZSA/IG5hbWUuaW5kZXhPZignIScpIDogLTE7XHJcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgcHJlZml4ID0gbmFtZS5zdWJzdHJpbmcoMCwgaW5kZXgpO1xyXG4gICAgICAgICAgICBuYW1lID0gbmFtZS5zdWJzdHJpbmcoaW5kZXggKyAxLCBuYW1lLmxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbcHJlZml4LCBuYW1lXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1ha2VzIGEgbmFtZSBtYXAsIG5vcm1hbGl6aW5nIHRoZSBuYW1lLCBhbmQgdXNpbmcgYSBwbHVnaW5cclxuICAgICAqIGZvciBub3JtYWxpemF0aW9uIGlmIG5lY2Vzc2FyeS4gR3JhYnMgYSByZWYgdG8gcGx1Z2luXHJcbiAgICAgKiB0b28sIGFzIGFuIG9wdGltaXphdGlvbi5cclxuICAgICAqL1xyXG4gICAgbWFrZU1hcCA9IGZ1bmN0aW9uIChuYW1lLCByZWxOYW1lKSB7XHJcbiAgICAgICAgdmFyIHBsdWdpbixcclxuICAgICAgICAgICAgcGFydHMgPSBzcGxpdFByZWZpeChuYW1lKSxcclxuICAgICAgICAgICAgcHJlZml4ID0gcGFydHNbMF07XHJcblxyXG4gICAgICAgIG5hbWUgPSBwYXJ0c1sxXTtcclxuXHJcbiAgICAgICAgaWYgKHByZWZpeCkge1xyXG4gICAgICAgICAgICBwcmVmaXggPSBub3JtYWxpemUocHJlZml4LCByZWxOYW1lKTtcclxuICAgICAgICAgICAgcGx1Z2luID0gY2FsbERlcChwcmVmaXgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9Ob3JtYWxpemUgYWNjb3JkaW5nXHJcbiAgICAgICAgaWYgKHByZWZpeCkge1xyXG4gICAgICAgICAgICBpZiAocGx1Z2luICYmIHBsdWdpbi5ub3JtYWxpemUpIHtcclxuICAgICAgICAgICAgICAgIG5hbWUgPSBwbHVnaW4ubm9ybWFsaXplKG5hbWUsIG1ha2VOb3JtYWxpemUocmVsTmFtZSkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbmFtZSA9IG5vcm1hbGl6ZShuYW1lLCByZWxOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG5hbWUgPSBub3JtYWxpemUobmFtZSwgcmVsTmFtZSk7XHJcbiAgICAgICAgICAgIHBhcnRzID0gc3BsaXRQcmVmaXgobmFtZSk7XHJcbiAgICAgICAgICAgIHByZWZpeCA9IHBhcnRzWzBdO1xyXG4gICAgICAgICAgICBuYW1lID0gcGFydHNbMV07XHJcbiAgICAgICAgICAgIGlmIChwcmVmaXgpIHtcclxuICAgICAgICAgICAgICAgIHBsdWdpbiA9IGNhbGxEZXAocHJlZml4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9Vc2luZyByaWRpY3Vsb3VzIHByb3BlcnR5IG5hbWVzIGZvciBzcGFjZSByZWFzb25zXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZjogcHJlZml4ID8gcHJlZml4ICsgJyEnICsgbmFtZSA6IG5hbWUsIC8vZnVsbE5hbWVcclxuICAgICAgICAgICAgbjogbmFtZSxcclxuICAgICAgICAgICAgcHI6IHByZWZpeCxcclxuICAgICAgICAgICAgcDogcGx1Z2luXHJcbiAgICAgICAgfTtcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gbWFrZUNvbmZpZyhuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChjb25maWcgJiYgY29uZmlnLmNvbmZpZyAmJiBjb25maWcuY29uZmlnW25hbWVdKSB8fCB7fTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZXJzID0ge1xyXG4gICAgICAgIHJlcXVpcmU6IGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtYWtlUmVxdWlyZShuYW1lKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGV4cG9ydHM6IGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgICAgICAgIHZhciBlID0gZGVmaW5lZFtuYW1lXTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBlICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKGRlZmluZWRbbmFtZV0gPSB7fSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIG1vZHVsZTogZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGlkOiBuYW1lLFxyXG4gICAgICAgICAgICAgICAgdXJpOiAnJyxcclxuICAgICAgICAgICAgICAgIGV4cG9ydHM6IGRlZmluZWRbbmFtZV0sXHJcbiAgICAgICAgICAgICAgICBjb25maWc6IG1ha2VDb25maWcobmFtZSlcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIG1haW4gPSBmdW5jdGlvbiAobmFtZSwgZGVwcywgY2FsbGJhY2ssIHJlbE5hbWUpIHtcclxuICAgICAgICB2YXIgY2pzTW9kdWxlLCBkZXBOYW1lLCByZXQsIG1hcCwgaSxcclxuICAgICAgICAgICAgYXJncyA9IFtdLFxyXG4gICAgICAgICAgICBjYWxsYmFja1R5cGUgPSB0eXBlb2YgY2FsbGJhY2ssXHJcbiAgICAgICAgICAgIHVzaW5nRXhwb3J0cztcclxuXHJcbiAgICAgICAgLy9Vc2UgbmFtZSBpZiBubyByZWxOYW1lXHJcbiAgICAgICAgcmVsTmFtZSA9IHJlbE5hbWUgfHwgbmFtZTtcclxuXHJcbiAgICAgICAgLy9DYWxsIHRoZSBjYWxsYmFjayB0byBkZWZpbmUgdGhlIG1vZHVsZSwgaWYgbmVjZXNzYXJ5LlxyXG4gICAgICAgIGlmIChjYWxsYmFja1R5cGUgPT09ICd1bmRlZmluZWQnIHx8IGNhbGxiYWNrVHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAvL1B1bGwgb3V0IHRoZSBkZWZpbmVkIGRlcGVuZGVuY2llcyBhbmQgcGFzcyB0aGUgb3JkZXJlZFxyXG4gICAgICAgICAgICAvL3ZhbHVlcyB0byB0aGUgY2FsbGJhY2suXHJcbiAgICAgICAgICAgIC8vRGVmYXVsdCB0byBbcmVxdWlyZSwgZXhwb3J0cywgbW9kdWxlXSBpZiBubyBkZXBzXHJcbiAgICAgICAgICAgIGRlcHMgPSAhZGVwcy5sZW5ndGggJiYgY2FsbGJhY2subGVuZ3RoID8gWydyZXF1aXJlJywgJ2V4cG9ydHMnLCAnbW9kdWxlJ10gOiBkZXBzO1xyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZGVwcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgbWFwID0gbWFrZU1hcChkZXBzW2ldLCByZWxOYW1lKTtcclxuICAgICAgICAgICAgICAgIGRlcE5hbWUgPSBtYXAuZjtcclxuXHJcbiAgICAgICAgICAgICAgICAvL0Zhc3QgcGF0aCBDb21tb25KUyBzdGFuZGFyZCBkZXBlbmRlbmNpZXMuXHJcbiAgICAgICAgICAgICAgICBpZiAoZGVwTmFtZSA9PT0gXCJyZXF1aXJlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBhcmdzW2ldID0gaGFuZGxlcnMucmVxdWlyZShuYW1lKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVwTmFtZSA9PT0gXCJleHBvcnRzXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL0NvbW1vbkpTIG1vZHVsZSBzcGVjIDEuMVxyXG4gICAgICAgICAgICAgICAgICAgIGFyZ3NbaV0gPSBoYW5kbGVycy5leHBvcnRzKG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHVzaW5nRXhwb3J0cyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRlcE5hbWUgPT09IFwibW9kdWxlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL0NvbW1vbkpTIG1vZHVsZSBzcGVjIDEuMVxyXG4gICAgICAgICAgICAgICAgICAgIGNqc01vZHVsZSA9IGFyZ3NbaV0gPSBoYW5kbGVycy5tb2R1bGUobmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGhhc1Byb3AoZGVmaW5lZCwgZGVwTmFtZSkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzUHJvcCh3YWl0aW5nLCBkZXBOYW1lKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNQcm9wKGRlZmluaW5nLCBkZXBOYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFyZ3NbaV0gPSBjYWxsRGVwKGRlcE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtYXAucCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5wLmxvYWQobWFwLm4sIG1ha2VSZXF1aXJlKHJlbE5hbWUsIHRydWUpLCBtYWtlTG9hZChkZXBOYW1lKSwge30pO1xyXG4gICAgICAgICAgICAgICAgICAgIGFyZ3NbaV0gPSBkZWZpbmVkW2RlcE5hbWVdO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobmFtZSArICcgbWlzc2luZyAnICsgZGVwTmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldCA9IGNhbGxiYWNrID8gY2FsbGJhY2suYXBwbHkoZGVmaW5lZFtuYW1lXSwgYXJncykgOiB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgICAgICBpZiAobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgLy9JZiBzZXR0aW5nIGV4cG9ydHMgdmlhIFwibW9kdWxlXCIgaXMgaW4gcGxheSxcclxuICAgICAgICAgICAgICAgIC8vZmF2b3IgdGhhdCBvdmVyIHJldHVybiB2YWx1ZSBhbmQgZXhwb3J0cy4gQWZ0ZXIgdGhhdCxcclxuICAgICAgICAgICAgICAgIC8vZmF2b3IgYSBub24tdW5kZWZpbmVkIHJldHVybiB2YWx1ZSBvdmVyIGV4cG9ydHMgdXNlLlxyXG4gICAgICAgICAgICAgICAgaWYgKGNqc01vZHVsZSAmJiBjanNNb2R1bGUuZXhwb3J0cyAhPT0gdW5kZWYgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2pzTW9kdWxlLmV4cG9ydHMgIT09IGRlZmluZWRbbmFtZV0pIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZpbmVkW25hbWVdID0gY2pzTW9kdWxlLmV4cG9ydHM7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJldCAhPT0gdW5kZWYgfHwgIXVzaW5nRXhwb3J0cykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vVXNlIHRoZSByZXR1cm4gdmFsdWUgZnJvbSB0aGUgZnVuY3Rpb24uXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmaW5lZFtuYW1lXSA9IHJldDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAobmFtZSkge1xyXG4gICAgICAgICAgICAvL01heSBqdXN0IGJlIGFuIG9iamVjdCBkZWZpbml0aW9uIGZvciB0aGUgbW9kdWxlLiBPbmx5XHJcbiAgICAgICAgICAgIC8vd29ycnkgYWJvdXQgZGVmaW5pbmcgaWYgaGF2ZSBhIG1vZHVsZSBuYW1lLlxyXG4gICAgICAgICAgICBkZWZpbmVkW25hbWVdID0gY2FsbGJhY2s7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICByZXF1aXJlanMgPSByZXF1aXJlID0gcmVxID0gZnVuY3Rpb24gKGRlcHMsIGNhbGxiYWNrLCByZWxOYW1lLCBmb3JjZVN5bmMsIGFsdCkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgZGVwcyA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICBpZiAoaGFuZGxlcnNbZGVwc10pIHtcclxuICAgICAgICAgICAgICAgIC8vY2FsbGJhY2sgaW4gdGhpcyBjYXNlIGlzIHJlYWxseSByZWxOYW1lXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlcnNbZGVwc10oY2FsbGJhY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vSnVzdCByZXR1cm4gdGhlIG1vZHVsZSB3YW50ZWQuIEluIHRoaXMgc2NlbmFyaW8sIHRoZVxyXG4gICAgICAgICAgICAvL2RlcHMgYXJnIGlzIHRoZSBtb2R1bGUgbmFtZSwgYW5kIHNlY29uZCBhcmcgKGlmIHBhc3NlZClcclxuICAgICAgICAgICAgLy9pcyBqdXN0IHRoZSByZWxOYW1lLlxyXG4gICAgICAgICAgICAvL05vcm1hbGl6ZSBtb2R1bGUgbmFtZSwgaWYgaXQgY29udGFpbnMgLiBvciAuLlxyXG4gICAgICAgICAgICByZXR1cm4gY2FsbERlcChtYWtlTWFwKGRlcHMsIGNhbGxiYWNrKS5mKTtcclxuICAgICAgICB9IGVsc2UgaWYgKCFkZXBzLnNwbGljZSkge1xyXG4gICAgICAgICAgICAvL2RlcHMgaXMgYSBjb25maWcgb2JqZWN0LCBub3QgYW4gYXJyYXkuXHJcbiAgICAgICAgICAgIGNvbmZpZyA9IGRlcHM7XHJcbiAgICAgICAgICAgIGlmIChjb25maWcuZGVwcykge1xyXG4gICAgICAgICAgICAgICAgcmVxKGNvbmZpZy5kZXBzLCBjb25maWcuY2FsbGJhY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrLnNwbGljZSkge1xyXG4gICAgICAgICAgICAgICAgLy9jYWxsYmFjayBpcyBhbiBhcnJheSwgd2hpY2ggbWVhbnMgaXQgaXMgYSBkZXBlbmRlbmN5IGxpc3QuXHJcbiAgICAgICAgICAgICAgICAvL0FkanVzdCBhcmdzIGlmIHRoZXJlIGFyZSBkZXBlbmRlbmNpZXNcclxuICAgICAgICAgICAgICAgIGRlcHMgPSBjYWxsYmFjaztcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gcmVsTmFtZTtcclxuICAgICAgICAgICAgICAgIHJlbE5hbWUgPSBudWxsO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGVwcyA9IHVuZGVmO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL1N1cHBvcnQgcmVxdWlyZShbJ2EnXSlcclxuICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uICgpIHt9O1xyXG5cclxuICAgICAgICAvL0lmIHJlbE5hbWUgaXMgYSBmdW5jdGlvbiwgaXQgaXMgYW4gZXJyYmFjayBoYW5kbGVyLFxyXG4gICAgICAgIC8vc28gcmVtb3ZlIGl0LlxyXG4gICAgICAgIGlmICh0eXBlb2YgcmVsTmFtZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICByZWxOYW1lID0gZm9yY2VTeW5jO1xyXG4gICAgICAgICAgICBmb3JjZVN5bmMgPSBhbHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL1NpbXVsYXRlIGFzeW5jIGNhbGxiYWNrO1xyXG4gICAgICAgIGlmIChmb3JjZVN5bmMpIHtcclxuICAgICAgICAgICAgbWFpbih1bmRlZiwgZGVwcywgY2FsbGJhY2ssIHJlbE5hbWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vVXNpbmcgYSBub24temVybyB2YWx1ZSBiZWNhdXNlIG9mIGNvbmNlcm4gZm9yIHdoYXQgb2xkIGJyb3dzZXJzXHJcbiAgICAgICAgICAgIC8vZG8sIGFuZCBsYXRlc3QgYnJvd3NlcnMgXCJ1cGdyYWRlXCIgdG8gNCBpZiBsb3dlciB2YWx1ZSBpcyB1c2VkOlxyXG4gICAgICAgICAgICAvL2h0dHA6Ly93d3cud2hhdHdnLm9yZy9zcGVjcy93ZWItYXBwcy9jdXJyZW50LXdvcmsvbXVsdGlwYWdlL3RpbWVycy5odG1sI2RvbS13aW5kb3d0aW1lcnMtc2V0dGltZW91dDpcclxuICAgICAgICAgICAgLy9JZiB3YW50IGEgdmFsdWUgaW1tZWRpYXRlbHksIHVzZSByZXF1aXJlKCdpZCcpIGluc3RlYWQgLS0gc29tZXRoaW5nXHJcbiAgICAgICAgICAgIC8vdGhhdCB3b3JrcyBpbiBhbG1vbmQgb24gdGhlIGdsb2JhbCBsZXZlbCwgYnV0IG5vdCBndWFyYW50ZWVkIGFuZFxyXG4gICAgICAgICAgICAvL3VubGlrZWx5IHRvIHdvcmsgaW4gb3RoZXIgQU1EIGltcGxlbWVudGF0aW9ucy5cclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBtYWluKHVuZGVmLCBkZXBzLCBjYWxsYmFjaywgcmVsTmFtZSk7XHJcbiAgICAgICAgICAgIH0sIDQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlcTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBKdXN0IGRyb3BzIHRoZSBjb25maWcgb24gdGhlIGZsb29yLCBidXQgcmV0dXJucyByZXEgaW4gY2FzZVxyXG4gICAgICogdGhlIGNvbmZpZyByZXR1cm4gdmFsdWUgaXMgdXNlZC5cclxuICAgICAqL1xyXG4gICAgcmVxLmNvbmZpZyA9IGZ1bmN0aW9uIChjZmcpIHtcclxuICAgICAgICByZXR1cm4gcmVxKGNmZyk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXhwb3NlIG1vZHVsZSByZWdpc3RyeSBmb3IgZGVidWdnaW5nIGFuZCB0b29saW5nXHJcbiAgICAgKi9cclxuICAgIHJlcXVpcmVqcy5fZGVmaW5lZCA9IGRlZmluZWQ7XHJcblxyXG4gICAgZGVmaW5lID0gZnVuY3Rpb24gKG5hbWUsIGRlcHMsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NlZSBhbG1vbmQgUkVBRE1FOiBpbmNvcnJlY3QgbW9kdWxlIGJ1aWxkLCBubyBtb2R1bGUgbmFtZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9UaGlzIG1vZHVsZSBtYXkgbm90IGhhdmUgZGVwZW5kZW5jaWVzXHJcbiAgICAgICAgaWYgKCFkZXBzLnNwbGljZSkge1xyXG4gICAgICAgICAgICAvL2RlcHMgaXMgbm90IGFuIGFycmF5LCBzbyBwcm9iYWJseSBtZWFuc1xyXG4gICAgICAgICAgICAvL2FuIG9iamVjdCBsaXRlcmFsIG9yIGZhY3RvcnkgZnVuY3Rpb24gZm9yXHJcbiAgICAgICAgICAgIC8vdGhlIHZhbHVlLiBBZGp1c3QgYXJncy5cclxuICAgICAgICAgICAgY2FsbGJhY2sgPSBkZXBzO1xyXG4gICAgICAgICAgICBkZXBzID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWhhc1Byb3AoZGVmaW5lZCwgbmFtZSkgJiYgIWhhc1Byb3Aod2FpdGluZywgbmFtZSkpIHtcclxuICAgICAgICAgICAgd2FpdGluZ1tuYW1lXSA9IFtuYW1lLCBkZXBzLCBjYWxsYmFja107XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBkZWZpbmUuYW1kID0ge1xyXG4gICAgICAgIGpRdWVyeTogdHJ1ZVxyXG4gICAgfTtcclxufSgpKTtcclxuXHJcblMyLnJlcXVpcmVqcyA9IHJlcXVpcmVqcztTMi5yZXF1aXJlID0gcmVxdWlyZTtTMi5kZWZpbmUgPSBkZWZpbmU7XHJcbn1cclxufSgpKTtcclxuUzIuZGVmaW5lKFwiYWxtb25kXCIsIGZ1bmN0aW9uKCl7fSk7XHJcblxyXG4vKiBnbG9iYWwgalF1ZXJ5OmZhbHNlLCAkOmZhbHNlICovXHJcblMyLmRlZmluZSgnanF1ZXJ5JyxbXSxmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIF8kID0galF1ZXJ5IHx8ICQ7XHJcblxyXG4gIGlmIChfJCA9PSBudWxsICYmIGNvbnNvbGUgJiYgY29uc29sZS5lcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcclxuICAgICAgJ1NlbGVjdDI6IEFuIGluc3RhbmNlIG9mIGpRdWVyeSBvciBhIGpRdWVyeS1jb21wYXRpYmxlIGxpYnJhcnkgd2FzIG5vdCAnICtcclxuICAgICAgJ2ZvdW5kLiBNYWtlIHN1cmUgdGhhdCB5b3UgYXJlIGluY2x1ZGluZyBqUXVlcnkgYmVmb3JlIFNlbGVjdDIgb24geW91ciAnICtcclxuICAgICAgJ3dlYiBwYWdlLidcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gXyQ7XHJcbn0pO1xyXG5cclxuUzIuZGVmaW5lKCdzZWxlY3QyL3V0aWxzJyxbXHJcbiAgJ2pxdWVyeSdcclxuXSwgZnVuY3Rpb24gKCQpIHtcclxuICB2YXIgVXRpbHMgPSB7fTtcclxuXHJcbiAgVXRpbHMuRXh0ZW5kID0gZnVuY3Rpb24gKENoaWxkQ2xhc3MsIFN1cGVyQ2xhc3MpIHtcclxuICAgIHZhciBfX2hhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcclxuXHJcbiAgICBmdW5jdGlvbiBCYXNlQ29uc3RydWN0b3IgKCkge1xyXG4gICAgICB0aGlzLmNvbnN0cnVjdG9yID0gQ2hpbGRDbGFzcztcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKHZhciBrZXkgaW4gU3VwZXJDbGFzcykge1xyXG4gICAgICBpZiAoX19oYXNQcm9wLmNhbGwoU3VwZXJDbGFzcywga2V5KSkge1xyXG4gICAgICAgIENoaWxkQ2xhc3Nba2V5XSA9IFN1cGVyQ2xhc3Nba2V5XTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEJhc2VDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBTdXBlckNsYXNzLnByb3RvdHlwZTtcclxuICAgIENoaWxkQ2xhc3MucHJvdG90eXBlID0gbmV3IEJhc2VDb25zdHJ1Y3RvcigpO1xyXG4gICAgQ2hpbGRDbGFzcy5fX3N1cGVyX18gPSBTdXBlckNsYXNzLnByb3RvdHlwZTtcclxuXHJcbiAgICByZXR1cm4gQ2hpbGRDbGFzcztcclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiBnZXRNZXRob2RzICh0aGVDbGFzcykge1xyXG4gICAgdmFyIHByb3RvID0gdGhlQ2xhc3MucHJvdG90eXBlO1xyXG5cclxuICAgIHZhciBtZXRob2RzID0gW107XHJcblxyXG4gICAgZm9yICh2YXIgbWV0aG9kTmFtZSBpbiBwcm90bykge1xyXG4gICAgICB2YXIgbSA9IHByb3RvW21ldGhvZE5hbWVdO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiBtICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChtZXRob2ROYW1lID09PSAnY29uc3RydWN0b3InKSB7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG1ldGhvZHMucHVzaChtZXRob2ROYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbWV0aG9kcztcclxuICB9XHJcblxyXG4gIFV0aWxzLkRlY29yYXRlID0gZnVuY3Rpb24gKFN1cGVyQ2xhc3MsIERlY29yYXRvckNsYXNzKSB7XHJcbiAgICB2YXIgZGVjb3JhdGVkTWV0aG9kcyA9IGdldE1ldGhvZHMoRGVjb3JhdG9yQ2xhc3MpO1xyXG4gICAgdmFyIHN1cGVyTWV0aG9kcyA9IGdldE1ldGhvZHMoU3VwZXJDbGFzcyk7XHJcblxyXG4gICAgZnVuY3Rpb24gRGVjb3JhdGVkQ2xhc3MgKCkge1xyXG4gICAgICB2YXIgdW5zaGlmdCA9IEFycmF5LnByb3RvdHlwZS51bnNoaWZ0O1xyXG5cclxuICAgICAgdmFyIGFyZ0NvdW50ID0gRGVjb3JhdG9yQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yLmxlbmd0aDtcclxuXHJcbiAgICAgIHZhciBjYWxsZWRDb25zdHJ1Y3RvciA9IFN1cGVyQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yO1xyXG5cclxuICAgICAgaWYgKGFyZ0NvdW50ID4gMCkge1xyXG4gICAgICAgIHVuc2hpZnQuY2FsbChhcmd1bWVudHMsIFN1cGVyQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yKTtcclxuXHJcbiAgICAgICAgY2FsbGVkQ29uc3RydWN0b3IgPSBEZWNvcmF0b3JDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3I7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNhbGxlZENvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICB9XHJcblxyXG4gICAgRGVjb3JhdG9yQ2xhc3MuZGlzcGxheU5hbWUgPSBTdXBlckNsYXNzLmRpc3BsYXlOYW1lO1xyXG5cclxuICAgIGZ1bmN0aW9uIGN0ciAoKSB7XHJcbiAgICAgIHRoaXMuY29uc3RydWN0b3IgPSBEZWNvcmF0ZWRDbGFzcztcclxuICAgIH1cclxuXHJcbiAgICBEZWNvcmF0ZWRDbGFzcy5wcm90b3R5cGUgPSBuZXcgY3RyKCk7XHJcblxyXG4gICAgZm9yICh2YXIgbSA9IDA7IG0gPCBzdXBlck1ldGhvZHMubGVuZ3RoOyBtKyspIHtcclxuICAgICAgICB2YXIgc3VwZXJNZXRob2QgPSBzdXBlck1ldGhvZHNbbV07XHJcblxyXG4gICAgICAgIERlY29yYXRlZENsYXNzLnByb3RvdHlwZVtzdXBlck1ldGhvZF0gPVxyXG4gICAgICAgICAgU3VwZXJDbGFzcy5wcm90b3R5cGVbc3VwZXJNZXRob2RdO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBjYWxsZWRNZXRob2QgPSBmdW5jdGlvbiAobWV0aG9kTmFtZSkge1xyXG4gICAgICAvLyBTdHViIG91dCB0aGUgb3JpZ2luYWwgbWV0aG9kIGlmIGl0J3Mgbm90IGRlY29yYXRpbmcgYW4gYWN0dWFsIG1ldGhvZFxyXG4gICAgICB2YXIgb3JpZ2luYWxNZXRob2QgPSBmdW5jdGlvbiAoKSB7fTtcclxuXHJcbiAgICAgIGlmIChtZXRob2ROYW1lIGluIERlY29yYXRlZENsYXNzLnByb3RvdHlwZSkge1xyXG4gICAgICAgIG9yaWdpbmFsTWV0aG9kID0gRGVjb3JhdGVkQ2xhc3MucHJvdG90eXBlW21ldGhvZE5hbWVdO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgZGVjb3JhdGVkTWV0aG9kID0gRGVjb3JhdG9yQ2xhc3MucHJvdG90eXBlW21ldGhvZE5hbWVdO1xyXG5cclxuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdW5zaGlmdCA9IEFycmF5LnByb3RvdHlwZS51bnNoaWZ0O1xyXG5cclxuICAgICAgICB1bnNoaWZ0LmNhbGwoYXJndW1lbnRzLCBvcmlnaW5hbE1ldGhvZCk7XHJcblxyXG4gICAgICAgIHJldHVybiBkZWNvcmF0ZWRNZXRob2QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgfTtcclxuICAgIH07XHJcblxyXG4gICAgZm9yICh2YXIgZCA9IDA7IGQgPCBkZWNvcmF0ZWRNZXRob2RzLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgIHZhciBkZWNvcmF0ZWRNZXRob2QgPSBkZWNvcmF0ZWRNZXRob2RzW2RdO1xyXG5cclxuICAgICAgRGVjb3JhdGVkQ2xhc3MucHJvdG90eXBlW2RlY29yYXRlZE1ldGhvZF0gPSBjYWxsZWRNZXRob2QoZGVjb3JhdGVkTWV0aG9kKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gRGVjb3JhdGVkQ2xhc3M7XHJcbiAgfTtcclxuXHJcbiAgdmFyIE9ic2VydmFibGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmxpc3RlbmVycyA9IHt9O1xyXG4gIH07XHJcblxyXG4gIE9ic2VydmFibGUucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKGV2ZW50LCBjYWxsYmFjaykge1xyXG4gICAgdGhpcy5saXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVycyB8fCB7fTtcclxuXHJcbiAgICBpZiAoZXZlbnQgaW4gdGhpcy5saXN0ZW5lcnMpIHtcclxuICAgICAgdGhpcy5saXN0ZW5lcnNbZXZlbnRdLnB1c2goY2FsbGJhY2spO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5saXN0ZW5lcnNbZXZlbnRdID0gW2NhbGxiYWNrXTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBPYnNlcnZhYmxlLnByb3RvdHlwZS50cmlnZ2VyID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICB2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XHJcbiAgICB2YXIgcGFyYW1zID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xyXG5cclxuICAgIHRoaXMubGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnMgfHwge307XHJcblxyXG4gICAgLy8gUGFyYW1zIHNob3VsZCBhbHdheXMgY29tZSBpbiBhcyBhbiBhcnJheVxyXG4gICAgaWYgKHBhcmFtcyA9PSBudWxsKSB7XHJcbiAgICAgIHBhcmFtcyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIElmIHRoZXJlIGFyZSBubyBhcmd1bWVudHMgdG8gdGhlIGV2ZW50LCB1c2UgYSB0ZW1wb3Jhcnkgb2JqZWN0XHJcbiAgICBpZiAocGFyYW1zLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICBwYXJhbXMucHVzaCh7fSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gU2V0IHRoZSBgX3R5cGVgIG9mIHRoZSBmaXJzdCBvYmplY3QgdG8gdGhlIGV2ZW50XHJcbiAgICBwYXJhbXNbMF0uX3R5cGUgPSBldmVudDtcclxuXHJcbiAgICBpZiAoZXZlbnQgaW4gdGhpcy5saXN0ZW5lcnMpIHtcclxuICAgICAgdGhpcy5pbnZva2UodGhpcy5saXN0ZW5lcnNbZXZlbnRdLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgnKicgaW4gdGhpcy5saXN0ZW5lcnMpIHtcclxuICAgICAgdGhpcy5pbnZva2UodGhpcy5saXN0ZW5lcnNbJyonXSwgYXJndW1lbnRzKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBPYnNlcnZhYmxlLnByb3RvdHlwZS5pbnZva2UgPSBmdW5jdGlvbiAobGlzdGVuZXJzLCBwYXJhbXMpIHtcclxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIHBhcmFtcyk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgVXRpbHMuT2JzZXJ2YWJsZSA9IE9ic2VydmFibGU7XHJcblxyXG4gIFV0aWxzLmdlbmVyYXRlQ2hhcnMgPSBmdW5jdGlvbiAobGVuZ3RoKSB7XHJcbiAgICB2YXIgY2hhcnMgPSAnJztcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciByYW5kb21DaGFyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMzYpO1xyXG4gICAgICBjaGFycyArPSByYW5kb21DaGFyLnRvU3RyaW5nKDM2KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2hhcnM7XHJcbiAgfTtcclxuXHJcbiAgVXRpbHMuYmluZCA9IGZ1bmN0aW9uIChmdW5jLCBjb250ZXh0KSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50cyk7XHJcbiAgICB9O1xyXG4gIH07XHJcblxyXG4gIFV0aWxzLl9jb252ZXJ0RGF0YSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICBmb3IgKHZhciBvcmlnaW5hbEtleSBpbiBkYXRhKSB7XHJcbiAgICAgIHZhciBrZXlzID0gb3JpZ2luYWxLZXkuc3BsaXQoJy0nKTtcclxuXHJcbiAgICAgIHZhciBkYXRhTGV2ZWwgPSBkYXRhO1xyXG5cclxuICAgICAgaWYgKGtleXMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwga2V5cy5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgIHZhciBrZXkgPSBrZXlzW2tdO1xyXG5cclxuICAgICAgICAvLyBMb3dlcmNhc2UgdGhlIGZpcnN0IGxldHRlclxyXG4gICAgICAgIC8vIEJ5IGRlZmF1bHQsIGRhc2gtc2VwYXJhdGVkIGJlY29tZXMgY2FtZWxDYXNlXHJcbiAgICAgICAga2V5ID0ga2V5LnN1YnN0cmluZygwLCAxKS50b0xvd2VyQ2FzZSgpICsga2V5LnN1YnN0cmluZygxKTtcclxuXHJcbiAgICAgICAgaWYgKCEoa2V5IGluIGRhdGFMZXZlbCkpIHtcclxuICAgICAgICAgIGRhdGFMZXZlbFtrZXldID0ge307XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoayA9PSBrZXlzLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgIGRhdGFMZXZlbFtrZXldID0gZGF0YVtvcmlnaW5hbEtleV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkYXRhTGV2ZWwgPSBkYXRhTGV2ZWxba2V5XTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGVsZXRlIGRhdGFbb3JpZ2luYWxLZXldO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH07XHJcblxyXG4gIFV0aWxzLmhhc1Njcm9sbCA9IGZ1bmN0aW9uIChpbmRleCwgZWwpIHtcclxuICAgIC8vIEFkYXB0ZWQgZnJvbSB0aGUgZnVuY3Rpb24gY3JlYXRlZCBieSBAU2hhZG93U2NyaXB0ZXJcclxuICAgIC8vIGFuZCBhZGFwdGVkIGJ5IEBCaWxsQmFycnkgb24gdGhlIFN0YWNrIEV4Y2hhbmdlIENvZGUgUmV2aWV3IHdlYnNpdGUuXHJcbiAgICAvLyBUaGUgb3JpZ2luYWwgY29kZSBjYW4gYmUgZm91bmQgYXRcclxuICAgIC8vIGh0dHA6Ly9jb2RlcmV2aWV3LnN0YWNrZXhjaGFuZ2UuY29tL3EvMTMzMzhcclxuICAgIC8vIGFuZCB3YXMgZGVzaWduZWQgdG8gYmUgdXNlZCB3aXRoIHRoZSBTaXp6bGUgc2VsZWN0b3IgZW5naW5lLlxyXG5cclxuICAgIHZhciAkZWwgPSAkKGVsKTtcclxuICAgIHZhciBvdmVyZmxvd1ggPSBlbC5zdHlsZS5vdmVyZmxvd1g7XHJcbiAgICB2YXIgb3ZlcmZsb3dZID0gZWwuc3R5bGUub3ZlcmZsb3dZO1xyXG5cclxuICAgIC8vQ2hlY2sgYm90aCB4IGFuZCB5IGRlY2xhcmF0aW9uc1xyXG4gICAgaWYgKG92ZXJmbG93WCA9PT0gb3ZlcmZsb3dZICYmXHJcbiAgICAgICAgKG92ZXJmbG93WSA9PT0gJ2hpZGRlbicgfHwgb3ZlcmZsb3dZID09PSAndmlzaWJsZScpKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAob3ZlcmZsb3dYID09PSAnc2Nyb2xsJyB8fCBvdmVyZmxvd1kgPT09ICdzY3JvbGwnKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAoJGVsLmlubmVySGVpZ2h0KCkgPCBlbC5zY3JvbGxIZWlnaHQgfHxcclxuICAgICAgJGVsLmlubmVyV2lkdGgoKSA8IGVsLnNjcm9sbFdpZHRoKTtcclxuICB9O1xyXG5cclxuICBVdGlscy5lc2NhcGVNYXJrdXAgPSBmdW5jdGlvbiAobWFya3VwKSB7XHJcbiAgICB2YXIgcmVwbGFjZU1hcCA9IHtcclxuICAgICAgJ1xcXFwnOiAnJiM5MjsnLFxyXG4gICAgICAnJic6ICcmYW1wOycsXHJcbiAgICAgICc8JzogJyZsdDsnLFxyXG4gICAgICAnPic6ICcmZ3Q7JyxcclxuICAgICAgJ1wiJzogJyZxdW90OycsXHJcbiAgICAgICdcXCcnOiAnJiMzOTsnLFxyXG4gICAgICAnLyc6ICcmIzQ3OydcclxuICAgIH07XHJcblxyXG4gICAgLy8gRG8gbm90IHRyeSB0byBlc2NhcGUgdGhlIG1hcmt1cCBpZiBpdCdzIG5vdCBhIHN0cmluZ1xyXG4gICAgaWYgKHR5cGVvZiBtYXJrdXAgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHJldHVybiBtYXJrdXA7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIFN0cmluZyhtYXJrdXApLnJlcGxhY2UoL1smPD5cIidcXC9cXFxcXS9nLCBmdW5jdGlvbiAobWF0Y2gpIHtcclxuICAgICAgcmV0dXJuIHJlcGxhY2VNYXBbbWF0Y2hdO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgLy8gQXBwZW5kIGFuIGFycmF5IG9mIGpRdWVyeSBub2RlcyB0byBhIGdpdmVuIGVsZW1lbnQuXHJcbiAgVXRpbHMuYXBwZW5kTWFueSA9IGZ1bmN0aW9uICgkZWxlbWVudCwgJG5vZGVzKSB7XHJcbiAgICAvLyBqUXVlcnkgMS43LnggZG9lcyBub3Qgc3VwcG9ydCAkLmZuLmFwcGVuZCgpIHdpdGggYW4gYXJyYXlcclxuICAgIC8vIEZhbGwgYmFjayB0byBhIGpRdWVyeSBvYmplY3QgY29sbGVjdGlvbiB1c2luZyAkLmZuLmFkZCgpXHJcbiAgICBpZiAoJC5mbi5qcXVlcnkuc3Vic3RyKDAsIDMpID09PSAnMS43Jykge1xyXG4gICAgICB2YXIgJGpxTm9kZXMgPSAkKCk7XHJcblxyXG4gICAgICAkLm1hcCgkbm9kZXMsIGZ1bmN0aW9uIChub2RlKSB7XHJcbiAgICAgICAgJGpxTm9kZXMgPSAkanFOb2Rlcy5hZGQobm9kZSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgJG5vZGVzID0gJGpxTm9kZXM7XHJcbiAgICB9XHJcblxyXG4gICAgJGVsZW1lbnQuYXBwZW5kKCRub2Rlcyk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIFV0aWxzO1xyXG59KTtcclxuXHJcblMyLmRlZmluZSgnc2VsZWN0Mi9yZXN1bHRzJyxbXHJcbiAgJ2pxdWVyeScsXHJcbiAgJy4vdXRpbHMnXHJcbl0sIGZ1bmN0aW9uICgkLCBVdGlscykge1xyXG4gIGZ1bmN0aW9uIFJlc3VsdHMgKCRlbGVtZW50LCBvcHRpb25zLCBkYXRhQWRhcHRlcikge1xyXG4gICAgdGhpcy4kZWxlbWVudCA9ICRlbGVtZW50O1xyXG4gICAgdGhpcy5kYXRhID0gZGF0YUFkYXB0ZXI7XHJcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xyXG5cclxuICAgIFJlc3VsdHMuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcyk7XHJcbiAgfVxyXG5cclxuICBVdGlscy5FeHRlbmQoUmVzdWx0cywgVXRpbHMuT2JzZXJ2YWJsZSk7XHJcblxyXG4gIFJlc3VsdHMucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciAkcmVzdWx0cyA9ICQoXHJcbiAgICAgICc8dWwgY2xhc3M9XCJzZWxlY3QyLXJlc3VsdHNfX29wdGlvbnNcIiByb2xlPVwidHJlZVwiPjwvdWw+J1xyXG4gICAgKTtcclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLmdldCgnbXVsdGlwbGUnKSkge1xyXG4gICAgICAkcmVzdWx0cy5hdHRyKCdhcmlhLW11bHRpc2VsZWN0YWJsZScsICd0cnVlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy4kcmVzdWx0cyA9ICRyZXN1bHRzO1xyXG5cclxuICAgIHJldHVybiAkcmVzdWx0cztcclxuICB9O1xyXG5cclxuICBSZXN1bHRzLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuJHJlc3VsdHMuZW1wdHkoKTtcclxuICB9O1xyXG5cclxuICBSZXN1bHRzLnByb3RvdHlwZS5kaXNwbGF5TWVzc2FnZSA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgIHZhciBlc2NhcGVNYXJrdXAgPSB0aGlzLm9wdGlvbnMuZ2V0KCdlc2NhcGVNYXJrdXAnKTtcclxuXHJcbiAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICB0aGlzLmhpZGVMb2FkaW5nKCk7XHJcblxyXG4gICAgdmFyICRtZXNzYWdlID0gJChcclxuICAgICAgJzxsaSByb2xlPVwidHJlZWl0ZW1cIiBhcmlhLWxpdmU9XCJhc3NlcnRpdmVcIicgK1xyXG4gICAgICAnIGNsYXNzPVwic2VsZWN0Mi1yZXN1bHRzX19vcHRpb25cIj48L2xpPidcclxuICAgICk7XHJcblxyXG4gICAgdmFyIG1lc3NhZ2UgPSB0aGlzLm9wdGlvbnMuZ2V0KCd0cmFuc2xhdGlvbnMnKS5nZXQocGFyYW1zLm1lc3NhZ2UpO1xyXG5cclxuICAgICRtZXNzYWdlLmFwcGVuZChcclxuICAgICAgZXNjYXBlTWFya3VwKFxyXG4gICAgICAgIG1lc3NhZ2UocGFyYW1zLmFyZ3MpXHJcbiAgICAgIClcclxuICAgICk7XHJcblxyXG4gICAgJG1lc3NhZ2VbMF0uY2xhc3NOYW1lICs9ICcgc2VsZWN0Mi1yZXN1bHRzX19tZXNzYWdlJztcclxuXHJcbiAgICB0aGlzLiRyZXN1bHRzLmFwcGVuZCgkbWVzc2FnZSk7XHJcbiAgfTtcclxuXHJcbiAgUmVzdWx0cy5wcm90b3R5cGUuaGlkZU1lc3NhZ2VzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy4kcmVzdWx0cy5maW5kKCcuc2VsZWN0Mi1yZXN1bHRzX19tZXNzYWdlJykucmVtb3ZlKCk7XHJcbiAgfTtcclxuXHJcbiAgUmVzdWx0cy5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgIHRoaXMuaGlkZUxvYWRpbmcoKTtcclxuXHJcbiAgICB2YXIgJG9wdGlvbnMgPSBbXTtcclxuXHJcbiAgICBpZiAoZGF0YS5yZXN1bHRzID09IG51bGwgfHwgZGF0YS5yZXN1bHRzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICBpZiAodGhpcy4kcmVzdWx0cy5jaGlsZHJlbigpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHRoaXMudHJpZ2dlcigncmVzdWx0czptZXNzYWdlJywge1xyXG4gICAgICAgICAgbWVzc2FnZTogJ25vUmVzdWx0cydcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGRhdGEucmVzdWx0cyA9IHRoaXMuc29ydChkYXRhLnJlc3VsdHMpO1xyXG5cclxuICAgIGZvciAodmFyIGQgPSAwOyBkIDwgZGF0YS5yZXN1bHRzLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgIHZhciBpdGVtID0gZGF0YS5yZXN1bHRzW2RdO1xyXG5cclxuICAgICAgdmFyICRvcHRpb24gPSB0aGlzLm9wdGlvbihpdGVtKTtcclxuXHJcbiAgICAgICRvcHRpb25zLnB1c2goJG9wdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy4kcmVzdWx0cy5hcHBlbmQoJG9wdGlvbnMpO1xyXG4gIH07XHJcblxyXG4gIFJlc3VsdHMucHJvdG90eXBlLnBvc2l0aW9uID0gZnVuY3Rpb24gKCRyZXN1bHRzLCAkZHJvcGRvd24pIHtcclxuICAgIHZhciAkcmVzdWx0c0NvbnRhaW5lciA9ICRkcm9wZG93bi5maW5kKCcuc2VsZWN0Mi1yZXN1bHRzJyk7XHJcbiAgICAkcmVzdWx0c0NvbnRhaW5lci5hcHBlbmQoJHJlc3VsdHMpO1xyXG4gIH07XHJcblxyXG4gIFJlc3VsdHMucHJvdG90eXBlLnNvcnQgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgdmFyIHNvcnRlciA9IHRoaXMub3B0aW9ucy5nZXQoJ3NvcnRlcicpO1xyXG5cclxuICAgIHJldHVybiBzb3J0ZXIoZGF0YSk7XHJcbiAgfTtcclxuXHJcbiAgUmVzdWx0cy5wcm90b3R5cGUuaGlnaGxpZ2h0Rmlyc3RJdGVtID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyICRvcHRpb25zID0gdGhpcy4kcmVzdWx0c1xyXG4gICAgICAuZmluZCgnLnNlbGVjdDItcmVzdWx0c19fb3B0aW9uW2FyaWEtc2VsZWN0ZWRdJyk7XHJcblxyXG4gICAgdmFyICRzZWxlY3RlZCA9ICRvcHRpb25zLmZpbHRlcignW2FyaWEtc2VsZWN0ZWQ9dHJ1ZV0nKTtcclxuXHJcbiAgICAvLyBDaGVjayBpZiB0aGVyZSBhcmUgYW55IHNlbGVjdGVkIG9wdGlvbnNcclxuICAgIGlmICgkc2VsZWN0ZWQubGVuZ3RoID4gMCkge1xyXG4gICAgICAvLyBJZiB0aGVyZSBhcmUgc2VsZWN0ZWQgb3B0aW9ucywgaGlnaGxpZ2h0IHRoZSBmaXJzdFxyXG4gICAgICAkc2VsZWN0ZWQuZmlyc3QoKS50cmlnZ2VyKCdtb3VzZWVudGVyJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gc2VsZWN0ZWQgb3B0aW9ucywgaGlnaGxpZ2h0IHRoZSBmaXJzdCBvcHRpb25cclxuICAgICAgLy8gaW4gdGhlIGRyb3Bkb3duXHJcbiAgICAgICRvcHRpb25zLmZpcnN0KCkudHJpZ2dlcignbW91c2VlbnRlcicpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZW5zdXJlSGlnaGxpZ2h0VmlzaWJsZSgpO1xyXG4gIH07XHJcblxyXG4gIFJlc3VsdHMucHJvdG90eXBlLnNldENsYXNzZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgdGhpcy5kYXRhLmN1cnJlbnQoZnVuY3Rpb24gKHNlbGVjdGVkKSB7XHJcbiAgICAgIHZhciBzZWxlY3RlZElkcyA9ICQubWFwKHNlbGVjdGVkLCBmdW5jdGlvbiAocykge1xyXG4gICAgICAgIHJldHVybiBzLmlkLnRvU3RyaW5nKCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdmFyICRvcHRpb25zID0gc2VsZi4kcmVzdWx0c1xyXG4gICAgICAgIC5maW5kKCcuc2VsZWN0Mi1yZXN1bHRzX19vcHRpb25bYXJpYS1zZWxlY3RlZF0nKTtcclxuXHJcbiAgICAgICRvcHRpb25zLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciAkb3B0aW9uID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgdmFyIGl0ZW0gPSAkLmRhdGEodGhpcywgJ2RhdGEnKTtcclxuXHJcbiAgICAgICAgLy8gaWQgbmVlZHMgdG8gYmUgY29udmVydGVkIHRvIGEgc3RyaW5nIHdoZW4gY29tcGFyaW5nXHJcbiAgICAgICAgdmFyIGlkID0gJycgKyBpdGVtLmlkO1xyXG5cclxuICAgICAgICBpZiAoKGl0ZW0uZWxlbWVudCAhPSBudWxsICYmIGl0ZW0uZWxlbWVudC5zZWxlY3RlZCkgfHxcclxuICAgICAgICAgICAgKGl0ZW0uZWxlbWVudCA9PSBudWxsICYmICQuaW5BcnJheShpZCwgc2VsZWN0ZWRJZHMpID4gLTEpKSB7XHJcbiAgICAgICAgICAkb3B0aW9uLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCAndHJ1ZScpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkb3B0aW9uLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCAnZmFsc2UnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIFJlc3VsdHMucHJvdG90eXBlLnNob3dMb2FkaW5nID0gZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgdGhpcy5oaWRlTG9hZGluZygpO1xyXG5cclxuICAgIHZhciBsb2FkaW5nTW9yZSA9IHRoaXMub3B0aW9ucy5nZXQoJ3RyYW5zbGF0aW9ucycpLmdldCgnc2VhcmNoaW5nJyk7XHJcblxyXG4gICAgdmFyIGxvYWRpbmcgPSB7XHJcbiAgICAgIGRpc2FibGVkOiB0cnVlLFxyXG4gICAgICBsb2FkaW5nOiB0cnVlLFxyXG4gICAgICB0ZXh0OiBsb2FkaW5nTW9yZShwYXJhbXMpXHJcbiAgICB9O1xyXG4gICAgdmFyICRsb2FkaW5nID0gdGhpcy5vcHRpb24obG9hZGluZyk7XHJcbiAgICAkbG9hZGluZy5jbGFzc05hbWUgKz0gJyBsb2FkaW5nLXJlc3VsdHMnO1xyXG5cclxuICAgIHRoaXMuJHJlc3VsdHMucHJlcGVuZCgkbG9hZGluZyk7XHJcbiAgfTtcclxuXHJcbiAgUmVzdWx0cy5wcm90b3R5cGUuaGlkZUxvYWRpbmcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLiRyZXN1bHRzLmZpbmQoJy5sb2FkaW5nLXJlc3VsdHMnKS5yZW1vdmUoKTtcclxuICB9O1xyXG5cclxuICBSZXN1bHRzLnByb3RvdHlwZS5vcHRpb24gPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgdmFyIG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcbiAgICBvcHRpb24uY2xhc3NOYW1lID0gJ3NlbGVjdDItcmVzdWx0c19fb3B0aW9uJztcclxuXHJcbiAgICB2YXIgYXR0cnMgPSB7XHJcbiAgICAgICdyb2xlJzogJ3RyZWVpdGVtJyxcclxuICAgICAgJ2FyaWEtc2VsZWN0ZWQnOiAnZmFsc2UnXHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChkYXRhLmRpc2FibGVkKSB7XHJcbiAgICAgIGRlbGV0ZSBhdHRyc1snYXJpYS1zZWxlY3RlZCddO1xyXG4gICAgICBhdHRyc1snYXJpYS1kaXNhYmxlZCddID0gJ3RydWUnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkYXRhLmlkID09IG51bGwpIHtcclxuICAgICAgZGVsZXRlIGF0dHJzWydhcmlhLXNlbGVjdGVkJ107XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRhdGEuX3Jlc3VsdElkICE9IG51bGwpIHtcclxuICAgICAgb3B0aW9uLmlkID0gZGF0YS5fcmVzdWx0SWQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRhdGEudGl0bGUpIHtcclxuICAgICAgb3B0aW9uLnRpdGxlID0gZGF0YS50aXRsZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZGF0YS5jaGlsZHJlbikge1xyXG4gICAgICBhdHRycy5yb2xlID0gJ2dyb3VwJztcclxuICAgICAgYXR0cnNbJ2FyaWEtbGFiZWwnXSA9IGRhdGEudGV4dDtcclxuICAgICAgZGVsZXRlIGF0dHJzWydhcmlhLXNlbGVjdGVkJ107XHJcbiAgICB9XHJcblxyXG4gICAgZm9yICh2YXIgYXR0ciBpbiBhdHRycykge1xyXG4gICAgICB2YXIgdmFsID0gYXR0cnNbYXR0cl07XHJcblxyXG4gICAgICBvcHRpb24uc2V0QXR0cmlidXRlKGF0dHIsIHZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRhdGEuY2hpbGRyZW4pIHtcclxuICAgICAgdmFyICRvcHRpb24gPSAkKG9wdGlvbik7XHJcblxyXG4gICAgICB2YXIgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHJvbmcnKTtcclxuICAgICAgbGFiZWwuY2xhc3NOYW1lID0gJ3NlbGVjdDItcmVzdWx0c19fZ3JvdXAnO1xyXG5cclxuICAgICAgdmFyICRsYWJlbCA9ICQobGFiZWwpO1xyXG4gICAgICB0aGlzLnRlbXBsYXRlKGRhdGEsIGxhYmVsKTtcclxuXHJcbiAgICAgIHZhciAkY2hpbGRyZW4gPSBbXTtcclxuXHJcbiAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgZGF0YS5jaGlsZHJlbi5sZW5ndGg7IGMrKykge1xyXG4gICAgICAgIHZhciBjaGlsZCA9IGRhdGEuY2hpbGRyZW5bY107XHJcblxyXG4gICAgICAgIHZhciAkY2hpbGQgPSB0aGlzLm9wdGlvbihjaGlsZCk7XHJcblxyXG4gICAgICAgICRjaGlsZHJlbi5wdXNoKCRjaGlsZCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciAkY2hpbGRyZW5Db250YWluZXIgPSAkKCc8dWw+PC91bD4nLCB7XHJcbiAgICAgICAgJ2NsYXNzJzogJ3NlbGVjdDItcmVzdWx0c19fb3B0aW9ucyBzZWxlY3QyLXJlc3VsdHNfX29wdGlvbnMtLW5lc3RlZCdcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAkY2hpbGRyZW5Db250YWluZXIuYXBwZW5kKCRjaGlsZHJlbik7XHJcblxyXG4gICAgICAkb3B0aW9uLmFwcGVuZChsYWJlbCk7XHJcbiAgICAgICRvcHRpb24uYXBwZW5kKCRjaGlsZHJlbkNvbnRhaW5lcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnRlbXBsYXRlKGRhdGEsIG9wdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgJC5kYXRhKG9wdGlvbiwgJ2RhdGEnLCBkYXRhKTtcclxuXHJcbiAgICByZXR1cm4gb3B0aW9uO1xyXG4gIH07XHJcblxyXG4gIFJlc3VsdHMucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoY29udGFpbmVyLCAkY29udGFpbmVyKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgdmFyIGlkID0gY29udGFpbmVyLmlkICsgJy1yZXN1bHRzJztcclxuXHJcbiAgICB0aGlzLiRyZXN1bHRzLmF0dHIoJ2lkJywgaWQpO1xyXG5cclxuICAgIGNvbnRhaW5lci5vbigncmVzdWx0czphbGwnLCBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgIHNlbGYuY2xlYXIoKTtcclxuICAgICAgc2VsZi5hcHBlbmQocGFyYW1zLmRhdGEpO1xyXG5cclxuICAgICAgaWYgKGNvbnRhaW5lci5pc09wZW4oKSkge1xyXG4gICAgICAgIHNlbGYuc2V0Q2xhc3NlcygpO1xyXG4gICAgICAgIHNlbGYuaGlnaGxpZ2h0Rmlyc3RJdGVtKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRhaW5lci5vbigncmVzdWx0czphcHBlbmQnLCBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgIHNlbGYuYXBwZW5kKHBhcmFtcy5kYXRhKTtcclxuXHJcbiAgICAgIGlmIChjb250YWluZXIuaXNPcGVuKCkpIHtcclxuICAgICAgICBzZWxmLnNldENsYXNzZXMoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29udGFpbmVyLm9uKCdxdWVyeScsIGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgc2VsZi5oaWRlTWVzc2FnZXMoKTtcclxuICAgICAgc2VsZi5zaG93TG9hZGluZyhwYXJhbXMpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29udGFpbmVyLm9uKCdzZWxlY3QnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICghY29udGFpbmVyLmlzT3BlbigpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzZWxmLnNldENsYXNzZXMoKTtcclxuICAgICAgc2VsZi5oaWdobGlnaHRGaXJzdEl0ZW0oKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRhaW5lci5vbigndW5zZWxlY3QnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICghY29udGFpbmVyLmlzT3BlbigpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzZWxmLnNldENsYXNzZXMoKTtcclxuICAgICAgc2VsZi5oaWdobGlnaHRGaXJzdEl0ZW0oKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRhaW5lci5vbignb3BlbicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgLy8gV2hlbiB0aGUgZHJvcGRvd24gaXMgb3BlbiwgYXJpYS1leHBlbmRlZD1cInRydWVcIlxyXG4gICAgICBzZWxmLiRyZXN1bHRzLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xyXG4gICAgICBzZWxmLiRyZXN1bHRzLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcblxyXG4gICAgICBzZWxmLnNldENsYXNzZXMoKTtcclxuICAgICAgc2VsZi5lbnN1cmVIaWdobGlnaHRWaXNpYmxlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ2Nsb3NlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAvLyBXaGVuIHRoZSBkcm9wZG93biBpcyBjbG9zZWQsIGFyaWEtZXhwZW5kZWQ9XCJmYWxzZVwiXHJcbiAgICAgIHNlbGYuJHJlc3VsdHMuYXR0cignYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG4gICAgICBzZWxmLiRyZXN1bHRzLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuICAgICAgc2VsZi4kcmVzdWx0cy5yZW1vdmVBdHRyKCdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRhaW5lci5vbigncmVzdWx0czp0b2dnbGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciAkaGlnaGxpZ2h0ZWQgPSBzZWxmLmdldEhpZ2hsaWdodGVkUmVzdWx0cygpO1xyXG5cclxuICAgICAgaWYgKCRoaWdobGlnaHRlZC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRoaWdobGlnaHRlZC50cmlnZ2VyKCdtb3VzZXVwJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ3Jlc3VsdHM6c2VsZWN0JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgJGhpZ2hsaWdodGVkID0gc2VsZi5nZXRIaWdobGlnaHRlZFJlc3VsdHMoKTtcclxuXHJcbiAgICAgIGlmICgkaGlnaGxpZ2h0ZWQubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgZGF0YSA9ICRoaWdobGlnaHRlZC5kYXRhKCdkYXRhJyk7XHJcblxyXG4gICAgICBpZiAoJGhpZ2hsaWdodGVkLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnKSA9PSAndHJ1ZScpIHtcclxuICAgICAgICBzZWxmLnRyaWdnZXIoJ2Nsb3NlJywge30pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNlbGYudHJpZ2dlcignc2VsZWN0Jywge1xyXG4gICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ3Jlc3VsdHM6cHJldmlvdXMnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciAkaGlnaGxpZ2h0ZWQgPSBzZWxmLmdldEhpZ2hsaWdodGVkUmVzdWx0cygpO1xyXG5cclxuICAgICAgdmFyICRvcHRpb25zID0gc2VsZi4kcmVzdWx0cy5maW5kKCdbYXJpYS1zZWxlY3RlZF0nKTtcclxuXHJcbiAgICAgIHZhciBjdXJyZW50SW5kZXggPSAkb3B0aW9ucy5pbmRleCgkaGlnaGxpZ2h0ZWQpO1xyXG5cclxuICAgICAgLy8gSWYgd2UgYXJlIGFscmVhZHkgYXQgdGUgdG9wLCBkb24ndCBtb3ZlIGZ1cnRoZXJcclxuICAgICAgaWYgKGN1cnJlbnRJbmRleCA9PT0gMCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIG5leHRJbmRleCA9IGN1cnJlbnRJbmRleCAtIDE7XHJcblxyXG4gICAgICAvLyBJZiBub25lIGFyZSBoaWdobGlnaHRlZCwgaGlnaGxpZ2h0IHRoZSBmaXJzdFxyXG4gICAgICBpZiAoJGhpZ2hsaWdodGVkLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIG5leHRJbmRleCA9IDA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciAkbmV4dCA9ICRvcHRpb25zLmVxKG5leHRJbmRleCk7XHJcblxyXG4gICAgICAkbmV4dC50cmlnZ2VyKCdtb3VzZWVudGVyJyk7XHJcblxyXG4gICAgICB2YXIgY3VycmVudE9mZnNldCA9IHNlbGYuJHJlc3VsdHMub2Zmc2V0KCkudG9wO1xyXG4gICAgICB2YXIgbmV4dFRvcCA9ICRuZXh0Lm9mZnNldCgpLnRvcDtcclxuICAgICAgdmFyIG5leHRPZmZzZXQgPSBzZWxmLiRyZXN1bHRzLnNjcm9sbFRvcCgpICsgKG5leHRUb3AgLSBjdXJyZW50T2Zmc2V0KTtcclxuXHJcbiAgICAgIGlmIChuZXh0SW5kZXggPT09IDApIHtcclxuICAgICAgICBzZWxmLiRyZXN1bHRzLnNjcm9sbFRvcCgwKTtcclxuICAgICAgfSBlbHNlIGlmIChuZXh0VG9wIC0gY3VycmVudE9mZnNldCA8IDApIHtcclxuICAgICAgICBzZWxmLiRyZXN1bHRzLnNjcm9sbFRvcChuZXh0T2Zmc2V0KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29udGFpbmVyLm9uKCdyZXN1bHRzOm5leHQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciAkaGlnaGxpZ2h0ZWQgPSBzZWxmLmdldEhpZ2hsaWdodGVkUmVzdWx0cygpO1xyXG5cclxuICAgICAgdmFyICRvcHRpb25zID0gc2VsZi4kcmVzdWx0cy5maW5kKCdbYXJpYS1zZWxlY3RlZF0nKTtcclxuXHJcbiAgICAgIHZhciBjdXJyZW50SW5kZXggPSAkb3B0aW9ucy5pbmRleCgkaGlnaGxpZ2h0ZWQpO1xyXG5cclxuICAgICAgdmFyIG5leHRJbmRleCA9IGN1cnJlbnRJbmRleCArIDE7XHJcblxyXG4gICAgICAvLyBJZiB3ZSBhcmUgYXQgdGhlIGxhc3Qgb3B0aW9uLCBzdGF5IHRoZXJlXHJcbiAgICAgIGlmIChuZXh0SW5kZXggPj0gJG9wdGlvbnMubGVuZ3RoKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgJG5leHQgPSAkb3B0aW9ucy5lcShuZXh0SW5kZXgpO1xyXG5cclxuICAgICAgJG5leHQudHJpZ2dlcignbW91c2VlbnRlcicpO1xyXG5cclxuICAgICAgdmFyIGN1cnJlbnRPZmZzZXQgPSBzZWxmLiRyZXN1bHRzLm9mZnNldCgpLnRvcCArXHJcbiAgICAgICAgc2VsZi4kcmVzdWx0cy5vdXRlckhlaWdodChmYWxzZSk7XHJcbiAgICAgIHZhciBuZXh0Qm90dG9tID0gJG5leHQub2Zmc2V0KCkudG9wICsgJG5leHQub3V0ZXJIZWlnaHQoZmFsc2UpO1xyXG4gICAgICB2YXIgbmV4dE9mZnNldCA9IHNlbGYuJHJlc3VsdHMuc2Nyb2xsVG9wKCkgKyBuZXh0Qm90dG9tIC0gY3VycmVudE9mZnNldDtcclxuXHJcbiAgICAgIGlmIChuZXh0SW5kZXggPT09IDApIHtcclxuICAgICAgICBzZWxmLiRyZXN1bHRzLnNjcm9sbFRvcCgwKTtcclxuICAgICAgfSBlbHNlIGlmIChuZXh0Qm90dG9tID4gY3VycmVudE9mZnNldCkge1xyXG4gICAgICAgIHNlbGYuJHJlc3VsdHMuc2Nyb2xsVG9wKG5leHRPZmZzZXQpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ3Jlc3VsdHM6Zm9jdXMnLCBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgIHBhcmFtcy5lbGVtZW50LmFkZENsYXNzKCdzZWxlY3QyLXJlc3VsdHNfX29wdGlvbi0taGlnaGxpZ2h0ZWQnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRhaW5lci5vbigncmVzdWx0czptZXNzYWdlJywgZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICBzZWxmLmRpc3BsYXlNZXNzYWdlKHBhcmFtcyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoJC5mbi5tb3VzZXdoZWVsKSB7XHJcbiAgICAgIHRoaXMuJHJlc3VsdHMub24oJ21vdXNld2hlZWwnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHZhciB0b3AgPSBzZWxmLiRyZXN1bHRzLnNjcm9sbFRvcCgpO1xyXG5cclxuICAgICAgICB2YXIgYm90dG9tID0gc2VsZi4kcmVzdWx0cy5nZXQoMCkuc2Nyb2xsSGVpZ2h0IC0gdG9wICsgZS5kZWx0YVk7XHJcblxyXG4gICAgICAgIHZhciBpc0F0VG9wID0gZS5kZWx0YVkgPiAwICYmIHRvcCAtIGUuZGVsdGFZIDw9IDA7XHJcbiAgICAgICAgdmFyIGlzQXRCb3R0b20gPSBlLmRlbHRhWSA8IDAgJiYgYm90dG9tIDw9IHNlbGYuJHJlc3VsdHMuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIGlmIChpc0F0VG9wKSB7XHJcbiAgICAgICAgICBzZWxmLiRyZXN1bHRzLnNjcm9sbFRvcCgwKTtcclxuXHJcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaXNBdEJvdHRvbSkge1xyXG4gICAgICAgICAgc2VsZi4kcmVzdWx0cy5zY3JvbGxUb3AoXHJcbiAgICAgICAgICAgIHNlbGYuJHJlc3VsdHMuZ2V0KDApLnNjcm9sbEhlaWdodCAtIHNlbGYuJHJlc3VsdHMuaGVpZ2h0KClcclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuJHJlc3VsdHMub24oJ21vdXNldXAnLCAnLnNlbGVjdDItcmVzdWx0c19fb3B0aW9uW2FyaWEtc2VsZWN0ZWRdJyxcclxuICAgICAgZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgdmFyIGRhdGEgPSAkdGhpcy5kYXRhKCdkYXRhJyk7XHJcblxyXG4gICAgICBpZiAoJHRoaXMuYXR0cignYXJpYS1zZWxlY3RlZCcpID09PSAndHJ1ZScpIHtcclxuICAgICAgICBpZiAoc2VsZi5vcHRpb25zLmdldCgnbXVsdGlwbGUnKSkge1xyXG4gICAgICAgICAgc2VsZi50cmlnZ2VyKCd1bnNlbGVjdCcsIHtcclxuICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZ0LFxyXG4gICAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc2VsZi50cmlnZ2VyKCdjbG9zZScsIHt9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2VsZi50cmlnZ2VyKCdzZWxlY3QnLCB7XHJcbiAgICAgICAgb3JpZ2luYWxFdmVudDogZXZ0LFxyXG4gICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLiRyZXN1bHRzLm9uKCdtb3VzZWVudGVyJywgJy5zZWxlY3QyLXJlc3VsdHNfX29wdGlvblthcmlhLXNlbGVjdGVkXScsXHJcbiAgICAgIGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgdmFyIGRhdGEgPSAkKHRoaXMpLmRhdGEoJ2RhdGEnKTtcclxuXHJcbiAgICAgIHNlbGYuZ2V0SGlnaGxpZ2h0ZWRSZXN1bHRzKClcclxuICAgICAgICAgIC5yZW1vdmVDbGFzcygnc2VsZWN0Mi1yZXN1bHRzX19vcHRpb24tLWhpZ2hsaWdodGVkJyk7XHJcblxyXG4gICAgICBzZWxmLnRyaWdnZXIoJ3Jlc3VsdHM6Zm9jdXMnLCB7XHJcbiAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICBlbGVtZW50OiAkKHRoaXMpXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgUmVzdWx0cy5wcm90b3R5cGUuZ2V0SGlnaGxpZ2h0ZWRSZXN1bHRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyICRoaWdobGlnaHRlZCA9IHRoaXMuJHJlc3VsdHNcclxuICAgIC5maW5kKCcuc2VsZWN0Mi1yZXN1bHRzX19vcHRpb24tLWhpZ2hsaWdodGVkJyk7XHJcblxyXG4gICAgcmV0dXJuICRoaWdobGlnaHRlZDtcclxuICB9O1xyXG5cclxuICBSZXN1bHRzLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy4kcmVzdWx0cy5yZW1vdmUoKTtcclxuICB9O1xyXG5cclxuICBSZXN1bHRzLnByb3RvdHlwZS5lbnN1cmVIaWdobGlnaHRWaXNpYmxlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyICRoaWdobGlnaHRlZCA9IHRoaXMuZ2V0SGlnaGxpZ2h0ZWRSZXN1bHRzKCk7XHJcblxyXG4gICAgaWYgKCRoaWdobGlnaHRlZC5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciAkb3B0aW9ucyA9IHRoaXMuJHJlc3VsdHMuZmluZCgnW2FyaWEtc2VsZWN0ZWRdJyk7XHJcblxyXG4gICAgdmFyIGN1cnJlbnRJbmRleCA9ICRvcHRpb25zLmluZGV4KCRoaWdobGlnaHRlZCk7XHJcblxyXG4gICAgdmFyIGN1cnJlbnRPZmZzZXQgPSB0aGlzLiRyZXN1bHRzLm9mZnNldCgpLnRvcDtcclxuICAgIHZhciBuZXh0VG9wID0gJGhpZ2hsaWdodGVkLm9mZnNldCgpLnRvcDtcclxuICAgIHZhciBuZXh0T2Zmc2V0ID0gdGhpcy4kcmVzdWx0cy5zY3JvbGxUb3AoKSArIChuZXh0VG9wIC0gY3VycmVudE9mZnNldCk7XHJcblxyXG4gICAgdmFyIG9mZnNldERlbHRhID0gbmV4dFRvcCAtIGN1cnJlbnRPZmZzZXQ7XHJcbiAgICBuZXh0T2Zmc2V0IC09ICRoaWdobGlnaHRlZC5vdXRlckhlaWdodChmYWxzZSkgKiAyO1xyXG5cclxuICAgIGlmIChjdXJyZW50SW5kZXggPD0gMikge1xyXG4gICAgICB0aGlzLiRyZXN1bHRzLnNjcm9sbFRvcCgwKTtcclxuICAgIH0gZWxzZSBpZiAob2Zmc2V0RGVsdGEgPiB0aGlzLiRyZXN1bHRzLm91dGVySGVpZ2h0KCkgfHwgb2Zmc2V0RGVsdGEgPCAwKSB7XHJcbiAgICAgIHRoaXMuJHJlc3VsdHMuc2Nyb2xsVG9wKG5leHRPZmZzZXQpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIFJlc3VsdHMucHJvdG90eXBlLnRlbXBsYXRlID0gZnVuY3Rpb24gKHJlc3VsdCwgY29udGFpbmVyKSB7XHJcbiAgICB2YXIgdGVtcGxhdGUgPSB0aGlzLm9wdGlvbnMuZ2V0KCd0ZW1wbGF0ZVJlc3VsdCcpO1xyXG4gICAgdmFyIGVzY2FwZU1hcmt1cCA9IHRoaXMub3B0aW9ucy5nZXQoJ2VzY2FwZU1hcmt1cCcpO1xyXG5cclxuICAgIHZhciBjb250ZW50ID0gdGVtcGxhdGUocmVzdWx0LCBjb250YWluZXIpO1xyXG5cclxuICAgIGlmIChjb250ZW50ID09IG51bGwpIHtcclxuICAgICAgY29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykge1xyXG4gICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gZXNjYXBlTWFya3VwKGNvbnRlbnQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJChjb250YWluZXIpLmFwcGVuZChjb250ZW50KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICByZXR1cm4gUmVzdWx0cztcclxufSk7XHJcblxyXG5TMi5kZWZpbmUoJ3NlbGVjdDIva2V5cycsW1xyXG5cclxuXSwgZnVuY3Rpb24gKCkge1xyXG4gIHZhciBLRVlTID0ge1xyXG4gICAgQkFDS1NQQUNFOiA4LFxyXG4gICAgVEFCOiA5LFxyXG4gICAgRU5URVI6IDEzLFxyXG4gICAgU0hJRlQ6IDE2LFxyXG4gICAgQ1RSTDogMTcsXHJcbiAgICBBTFQ6IDE4LFxyXG4gICAgRVNDOiAyNyxcclxuICAgIFNQQUNFOiAzMixcclxuICAgIFBBR0VfVVA6IDMzLFxyXG4gICAgUEFHRV9ET1dOOiAzNCxcclxuICAgIEVORDogMzUsXHJcbiAgICBIT01FOiAzNixcclxuICAgIExFRlQ6IDM3LFxyXG4gICAgVVA6IDM4LFxyXG4gICAgUklHSFQ6IDM5LFxyXG4gICAgRE9XTjogNDAsXHJcbiAgICBERUxFVEU6IDQ2XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIEtFWVM7XHJcbn0pO1xyXG5cclxuUzIuZGVmaW5lKCdzZWxlY3QyL3NlbGVjdGlvbi9iYXNlJyxbXHJcbiAgJ2pxdWVyeScsXHJcbiAgJy4uL3V0aWxzJyxcclxuICAnLi4va2V5cydcclxuXSwgZnVuY3Rpb24gKCQsIFV0aWxzLCBLRVlTKSB7XHJcbiAgZnVuY3Rpb24gQmFzZVNlbGVjdGlvbiAoJGVsZW1lbnQsIG9wdGlvbnMpIHtcclxuICAgIHRoaXMuJGVsZW1lbnQgPSAkZWxlbWVudDtcclxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XHJcblxyXG4gICAgQmFzZVNlbGVjdGlvbi5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzKTtcclxuICB9XHJcblxyXG4gIFV0aWxzLkV4dGVuZChCYXNlU2VsZWN0aW9uLCBVdGlscy5PYnNlcnZhYmxlKTtcclxuXHJcbiAgQmFzZVNlbGVjdGlvbi5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyICRzZWxlY3Rpb24gPSAkKFxyXG4gICAgICAnPHNwYW4gY2xhc3M9XCJzZWxlY3QyLXNlbGVjdGlvblwiIHJvbGU9XCJjb21ib2JveFwiICcgK1xyXG4gICAgICAnIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+JyArXHJcbiAgICAgICc8L3NwYW4+J1xyXG4gICAgKTtcclxuXHJcbiAgICB0aGlzLl90YWJpbmRleCA9IDA7XHJcblxyXG4gICAgaWYgKHRoaXMuJGVsZW1lbnQuZGF0YSgnb2xkLXRhYmluZGV4JykgIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLl90YWJpbmRleCA9IHRoaXMuJGVsZW1lbnQuZGF0YSgnb2xkLXRhYmluZGV4Jyk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuJGVsZW1lbnQuYXR0cigndGFiaW5kZXgnKSAhPSBudWxsKSB7XHJcbiAgICAgIHRoaXMuX3RhYmluZGV4ID0gdGhpcy4kZWxlbWVudC5hdHRyKCd0YWJpbmRleCcpO1xyXG4gICAgfVxyXG5cclxuICAgICRzZWxlY3Rpb24uYXR0cigndGl0bGUnLCB0aGlzLiRlbGVtZW50LmF0dHIoJ3RpdGxlJykpO1xyXG4gICAgJHNlbGVjdGlvbi5hdHRyKCd0YWJpbmRleCcsIHRoaXMuX3RhYmluZGV4KTtcclxuXHJcbiAgICB0aGlzLiRzZWxlY3Rpb24gPSAkc2VsZWN0aW9uO1xyXG5cclxuICAgIHJldHVybiAkc2VsZWN0aW9uO1xyXG4gIH07XHJcblxyXG4gIEJhc2VTZWxlY3Rpb24ucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoY29udGFpbmVyLCAkY29udGFpbmVyKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgdmFyIGlkID0gY29udGFpbmVyLmlkICsgJy1jb250YWluZXInO1xyXG4gICAgdmFyIHJlc3VsdHNJZCA9IGNvbnRhaW5lci5pZCArICctcmVzdWx0cyc7XHJcblxyXG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcblxyXG4gICAgdGhpcy4kc2VsZWN0aW9uLm9uKCdmb2N1cycsIGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgc2VsZi50cmlnZ2VyKCdmb2N1cycsIGV2dCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLiRzZWxlY3Rpb24ub24oJ2JsdXInLCBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgIHNlbGYuX2hhbmRsZUJsdXIoZXZ0KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbigna2V5ZG93bicsIGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgc2VsZi50cmlnZ2VyKCdrZXlwcmVzcycsIGV2dCk7XHJcblxyXG4gICAgICBpZiAoZXZ0LndoaWNoID09PSBLRVlTLlNQQUNFKSB7XHJcbiAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRhaW5lci5vbigncmVzdWx0czpmb2N1cycsIGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgc2VsZi4kc2VsZWN0aW9uLmF0dHIoJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCcsIHBhcmFtcy5kYXRhLl9yZXN1bHRJZCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ3NlbGVjdGlvbjp1cGRhdGUnLCBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgIHNlbGYudXBkYXRlKHBhcmFtcy5kYXRhKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRhaW5lci5vbignb3BlbicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgLy8gV2hlbiB0aGUgZHJvcGRvd24gaXMgb3BlbiwgYXJpYS1leHBhbmRlZD1cInRydWVcIlxyXG4gICAgICBzZWxmLiRzZWxlY3Rpb24uYXR0cignYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XHJcbiAgICAgIHNlbGYuJHNlbGVjdGlvbi5hdHRyKCdhcmlhLW93bnMnLCByZXN1bHRzSWQpO1xyXG5cclxuICAgICAgc2VsZi5fYXR0YWNoQ2xvc2VIYW5kbGVyKGNvbnRhaW5lcik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ2Nsb3NlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAvLyBXaGVuIHRoZSBkcm9wZG93biBpcyBjbG9zZWQsIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiXHJcbiAgICAgIHNlbGYuJHNlbGVjdGlvbi5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgIHNlbGYuJHNlbGVjdGlvbi5yZW1vdmVBdHRyKCdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnKTtcclxuICAgICAgc2VsZi4kc2VsZWN0aW9uLnJlbW92ZUF0dHIoJ2FyaWEtb3ducycpO1xyXG5cclxuICAgICAgc2VsZi4kc2VsZWN0aW9uLmZvY3VzKCk7XHJcblxyXG4gICAgICBzZWxmLl9kZXRhY2hDbG9zZUhhbmRsZXIoY29udGFpbmVyKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRhaW5lci5vbignZW5hYmxlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICBzZWxmLiRzZWxlY3Rpb24uYXR0cigndGFiaW5kZXgnLCBzZWxmLl90YWJpbmRleCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ2Rpc2FibGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHNlbGYuJHNlbGVjdGlvbi5hdHRyKCd0YWJpbmRleCcsICctMScpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgQmFzZVNlbGVjdGlvbi5wcm90b3R5cGUuX2hhbmRsZUJsdXIgPSBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgLy8gVGhpcyBuZWVkcyB0byBiZSBkZWxheWVkIGFzIHRoZSBhY3RpdmUgZWxlbWVudCBpcyB0aGUgYm9keSB3aGVuIHRoZSB0YWJcclxuICAgIC8vIGtleSBpcyBwcmVzc2VkLCBwb3NzaWJseSBhbG9uZyB3aXRoIG90aGVycy5cclxuICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgLy8gRG9uJ3QgdHJpZ2dlciBgYmx1cmAgaWYgdGhlIGZvY3VzIGlzIHN0aWxsIGluIHRoZSBzZWxlY3Rpb25cclxuICAgICAgaWYgKFxyXG4gICAgICAgIChkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09IHNlbGYuJHNlbGVjdGlvblswXSkgfHxcclxuICAgICAgICAoJC5jb250YWlucyhzZWxmLiRzZWxlY3Rpb25bMF0sIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKVxyXG4gICAgICApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNlbGYudHJpZ2dlcignYmx1cicsIGV2dCk7XHJcbiAgICB9LCAxKTtcclxuICB9O1xyXG5cclxuICBCYXNlU2VsZWN0aW9uLnByb3RvdHlwZS5fYXR0YWNoQ2xvc2VIYW5kbGVyID0gZnVuY3Rpb24gKGNvbnRhaW5lcikge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICQoZG9jdW1lbnQuYm9keSkub24oJ21vdXNlZG93bi5zZWxlY3QyLicgKyBjb250YWluZXIuaWQsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIHZhciAkdGFyZ2V0ID0gJChlLnRhcmdldCk7XHJcblxyXG4gICAgICB2YXIgJHNlbGVjdCA9ICR0YXJnZXQuY2xvc2VzdCgnLnNlbGVjdDInKTtcclxuXHJcbiAgICAgIHZhciAkYWxsID0gJCgnLnNlbGVjdDIuc2VsZWN0Mi1jb250YWluZXItLW9wZW4nKTtcclxuXHJcbiAgICAgICRhbGwuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMgPT0gJHNlbGVjdFswXSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyICRlbGVtZW50ID0gJHRoaXMuZGF0YSgnZWxlbWVudCcpO1xyXG5cclxuICAgICAgICAkZWxlbWVudC5zZWxlY3QyKCdjbG9zZScpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIEJhc2VTZWxlY3Rpb24ucHJvdG90eXBlLl9kZXRhY2hDbG9zZUhhbmRsZXIgPSBmdW5jdGlvbiAoY29udGFpbmVyKSB7XHJcbiAgICAkKGRvY3VtZW50LmJvZHkpLm9mZignbW91c2Vkb3duLnNlbGVjdDIuJyArIGNvbnRhaW5lci5pZCk7XHJcbiAgfTtcclxuXHJcbiAgQmFzZVNlbGVjdGlvbi5wcm90b3R5cGUucG9zaXRpb24gPSBmdW5jdGlvbiAoJHNlbGVjdGlvbiwgJGNvbnRhaW5lcikge1xyXG4gICAgdmFyICRzZWxlY3Rpb25Db250YWluZXIgPSAkY29udGFpbmVyLmZpbmQoJy5zZWxlY3Rpb24nKTtcclxuICAgICRzZWxlY3Rpb25Db250YWluZXIuYXBwZW5kKCRzZWxlY3Rpb24pO1xyXG4gIH07XHJcblxyXG4gIEJhc2VTZWxlY3Rpb24ucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLl9kZXRhY2hDbG9zZUhhbmRsZXIodGhpcy5jb250YWluZXIpO1xyXG4gIH07XHJcblxyXG4gIEJhc2VTZWxlY3Rpb24ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBgdXBkYXRlYCBtZXRob2QgbXVzdCBiZSBkZWZpbmVkIGluIGNoaWxkIGNsYXNzZXMuJyk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIEJhc2VTZWxlY3Rpb247XHJcbn0pO1xyXG5cclxuUzIuZGVmaW5lKCdzZWxlY3QyL3NlbGVjdGlvbi9zaW5nbGUnLFtcclxuICAnanF1ZXJ5JyxcclxuICAnLi9iYXNlJyxcclxuICAnLi4vdXRpbHMnLFxyXG4gICcuLi9rZXlzJ1xyXG5dLCBmdW5jdGlvbiAoJCwgQmFzZVNlbGVjdGlvbiwgVXRpbHMsIEtFWVMpIHtcclxuICBmdW5jdGlvbiBTaW5nbGVTZWxlY3Rpb24gKCkge1xyXG4gICAgU2luZ2xlU2VsZWN0aW9uLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gIH1cclxuXHJcbiAgVXRpbHMuRXh0ZW5kKFNpbmdsZVNlbGVjdGlvbiwgQmFzZVNlbGVjdGlvbik7XHJcblxyXG4gIFNpbmdsZVNlbGVjdGlvbi5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyICRzZWxlY3Rpb24gPSBTaW5nbGVTZWxlY3Rpb24uX19zdXBlcl9fLnJlbmRlci5jYWxsKHRoaXMpO1xyXG5cclxuICAgICRzZWxlY3Rpb24uYWRkQ2xhc3MoJ3NlbGVjdDItc2VsZWN0aW9uLS1zaW5nbGUnKTtcclxuXHJcbiAgICAkc2VsZWN0aW9uLmh0bWwoXHJcbiAgICAgICc8c3BhbiBjbGFzcz1cInNlbGVjdDItc2VsZWN0aW9uX19yZW5kZXJlZFwiPjwvc3Bhbj4nICtcclxuICAgICAgJzxzcGFuIGNsYXNzPVwic2VsZWN0Mi1zZWxlY3Rpb25fX2Fycm93XCIgcm9sZT1cInByZXNlbnRhdGlvblwiPicgK1xyXG4gICAgICAgICc8YiByb2xlPVwicHJlc2VudGF0aW9uXCI+PC9iPicgK1xyXG4gICAgICAnPC9zcGFuPidcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuICRzZWxlY3Rpb247XHJcbiAgfTtcclxuXHJcbiAgU2luZ2xlU2VsZWN0aW9uLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIFNpbmdsZVNlbGVjdGlvbi5fX3N1cGVyX18uYmluZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cclxuICAgIHZhciBpZCA9IGNvbnRhaW5lci5pZCArICctY29udGFpbmVyJztcclxuXHJcbiAgICB0aGlzLiRzZWxlY3Rpb24uZmluZCgnLnNlbGVjdDItc2VsZWN0aW9uX19yZW5kZXJlZCcpLmF0dHIoJ2lkJywgaWQpO1xyXG4gICAgdGhpcy4kc2VsZWN0aW9uLmF0dHIoJ2FyaWEtbGFiZWxsZWRieScsIGlkKTtcclxuXHJcbiAgICB0aGlzLiRzZWxlY3Rpb24ub24oJ21vdXNlZG93bicsIGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgLy8gT25seSByZXNwb25kIHRvIGxlZnQgY2xpY2tzXHJcbiAgICAgIGlmIChldnQud2hpY2ggIT09IDEpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNlbGYudHJpZ2dlcigndG9nZ2xlJywge1xyXG4gICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dFxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbignZm9jdXMnLCBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgIC8vIFVzZXIgZm9jdXNlcyBvbiB0aGUgY29udGFpbmVyXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLiRzZWxlY3Rpb24ub24oJ2JsdXInLCBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgIC8vIFVzZXIgZXhpdHMgdGhlIGNvbnRhaW5lclxyXG4gICAgfSk7XHJcblxyXG4gICAgY29udGFpbmVyLm9uKCdmb2N1cycsIGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgaWYgKCFjb250YWluZXIuaXNPcGVuKCkpIHtcclxuICAgICAgICBzZWxmLiRzZWxlY3Rpb24uZm9jdXMoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29udGFpbmVyLm9uKCdzZWxlY3Rpb246dXBkYXRlJywgZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICBzZWxmLnVwZGF0ZShwYXJhbXMuZGF0YSk7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBTaW5nbGVTZWxlY3Rpb24ucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fcmVuZGVyZWQnKS5lbXB0eSgpO1xyXG4gIH07XHJcblxyXG4gIFNpbmdsZVNlbGVjdGlvbi5wcm90b3R5cGUuZGlzcGxheSA9IGZ1bmN0aW9uIChkYXRhLCBjb250YWluZXIpIHtcclxuICAgIHZhciB0ZW1wbGF0ZSA9IHRoaXMub3B0aW9ucy5nZXQoJ3RlbXBsYXRlU2VsZWN0aW9uJyk7XHJcbiAgICB2YXIgZXNjYXBlTWFya3VwID0gdGhpcy5vcHRpb25zLmdldCgnZXNjYXBlTWFya3VwJyk7XHJcblxyXG4gICAgcmV0dXJuIGVzY2FwZU1hcmt1cCh0ZW1wbGF0ZShkYXRhLCBjb250YWluZXIpKTtcclxuICB9O1xyXG5cclxuICBTaW5nbGVTZWxlY3Rpb24ucHJvdG90eXBlLnNlbGVjdGlvbkNvbnRhaW5lciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAkKCc8c3Bhbj48L3NwYW4+Jyk7XHJcbiAgfTtcclxuXHJcbiAgU2luZ2xlU2VsZWN0aW9uLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHRoaXMuY2xlYXIoKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBzZWxlY3Rpb24gPSBkYXRhWzBdO1xyXG5cclxuICAgIHZhciAkcmVuZGVyZWQgPSB0aGlzLiRzZWxlY3Rpb24uZmluZCgnLnNlbGVjdDItc2VsZWN0aW9uX19yZW5kZXJlZCcpO1xyXG4gICAgdmFyIGZvcm1hdHRlZCA9IHRoaXMuZGlzcGxheShzZWxlY3Rpb24sICRyZW5kZXJlZCk7XHJcblxyXG4gICAgJHJlbmRlcmVkLmVtcHR5KCkuYXBwZW5kKGZvcm1hdHRlZCk7XHJcbiAgICAkcmVuZGVyZWQucHJvcCgndGl0bGUnLCBzZWxlY3Rpb24udGl0bGUgfHwgc2VsZWN0aW9uLnRleHQpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBTaW5nbGVTZWxlY3Rpb247XHJcbn0pO1xyXG5cclxuUzIuZGVmaW5lKCdzZWxlY3QyL3NlbGVjdGlvbi9tdWx0aXBsZScsW1xyXG4gICdqcXVlcnknLFxyXG4gICcuL2Jhc2UnLFxyXG4gICcuLi91dGlscydcclxuXSwgZnVuY3Rpb24gKCQsIEJhc2VTZWxlY3Rpb24sIFV0aWxzKSB7XHJcbiAgZnVuY3Rpb24gTXVsdGlwbGVTZWxlY3Rpb24gKCRlbGVtZW50LCBvcHRpb25zKSB7XHJcbiAgICBNdWx0aXBsZVNlbGVjdGlvbi5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICB9XHJcblxyXG4gIFV0aWxzLkV4dGVuZChNdWx0aXBsZVNlbGVjdGlvbiwgQmFzZVNlbGVjdGlvbik7XHJcblxyXG4gIE11bHRpcGxlU2VsZWN0aW9uLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgJHNlbGVjdGlvbiA9IE11bHRpcGxlU2VsZWN0aW9uLl9fc3VwZXJfXy5yZW5kZXIuY2FsbCh0aGlzKTtcclxuXHJcbiAgICAkc2VsZWN0aW9uLmFkZENsYXNzKCdzZWxlY3QyLXNlbGVjdGlvbi0tbXVsdGlwbGUnKTtcclxuXHJcbiAgICAkc2VsZWN0aW9uLmh0bWwoXHJcbiAgICAgICc8dWwgY2xhc3M9XCJzZWxlY3QyLXNlbGVjdGlvbl9fcmVuZGVyZWRcIj48L3VsPidcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuICRzZWxlY3Rpb247XHJcbiAgfTtcclxuXHJcbiAgTXVsdGlwbGVTZWxlY3Rpb24ucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoY29udGFpbmVyLCAkY29udGFpbmVyKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgTXVsdGlwbGVTZWxlY3Rpb24uX19zdXBlcl9fLmJpbmQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHJcbiAgICB0aGlzLiRzZWxlY3Rpb24ub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICBzZWxmLnRyaWdnZXIoJ3RvZ2dsZScsIHtcclxuICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnRcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLiRzZWxlY3Rpb24ub24oXHJcbiAgICAgICdjbGljaycsXHJcbiAgICAgICcuc2VsZWN0Mi1zZWxlY3Rpb25fX2Nob2ljZV9fcmVtb3ZlJyxcclxuICAgICAgZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICAgIC8vIElnbm9yZSB0aGUgZXZlbnQgaWYgaXQgaXMgZGlzYWJsZWRcclxuICAgICAgICBpZiAoc2VsZi5vcHRpb25zLmdldCgnZGlzYWJsZWQnKSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyICRyZW1vdmUgPSAkKHRoaXMpO1xyXG4gICAgICAgIHZhciAkc2VsZWN0aW9uID0gJHJlbW92ZS5wYXJlbnQoKTtcclxuXHJcbiAgICAgICAgdmFyIGRhdGEgPSAkc2VsZWN0aW9uLmRhdGEoJ2RhdGEnKTtcclxuXHJcbiAgICAgICAgc2VsZi50cmlnZ2VyKCd1bnNlbGVjdCcsIHtcclxuICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dCxcclxuICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9O1xyXG5cclxuICBNdWx0aXBsZVNlbGVjdGlvbi5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLiRzZWxlY3Rpb24uZmluZCgnLnNlbGVjdDItc2VsZWN0aW9uX19yZW5kZXJlZCcpLmVtcHR5KCk7XHJcbiAgfTtcclxuXHJcbiAgTXVsdGlwbGVTZWxlY3Rpb24ucHJvdG90eXBlLmRpc3BsYXkgPSBmdW5jdGlvbiAoZGF0YSwgY29udGFpbmVyKSB7XHJcbiAgICB2YXIgdGVtcGxhdGUgPSB0aGlzLm9wdGlvbnMuZ2V0KCd0ZW1wbGF0ZVNlbGVjdGlvbicpO1xyXG4gICAgdmFyIGVzY2FwZU1hcmt1cCA9IHRoaXMub3B0aW9ucy5nZXQoJ2VzY2FwZU1hcmt1cCcpO1xyXG5cclxuICAgIHJldHVybiBlc2NhcGVNYXJrdXAodGVtcGxhdGUoZGF0YSwgY29udGFpbmVyKSk7XHJcbiAgfTtcclxuXHJcbiAgTXVsdGlwbGVTZWxlY3Rpb24ucHJvdG90eXBlLnNlbGVjdGlvbkNvbnRhaW5lciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciAkY29udGFpbmVyID0gJChcclxuICAgICAgJzxsaSBjbGFzcz1cInNlbGVjdDItc2VsZWN0aW9uX19jaG9pY2VcIj4nICtcclxuICAgICAgICAnPHNwYW4gY2xhc3M9XCJzZWxlY3QyLXNlbGVjdGlvbl9fY2hvaWNlX19yZW1vdmVcIiByb2xlPVwicHJlc2VudGF0aW9uXCI+JyArXHJcbiAgICAgICAgICAnJnRpbWVzOycgK1xyXG4gICAgICAgICc8L3NwYW4+JyArXHJcbiAgICAgICc8L2xpPidcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuICRjb250YWluZXI7XHJcbiAgfTtcclxuXHJcbiAgTXVsdGlwbGVTZWxlY3Rpb24ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICB0aGlzLmNsZWFyKCk7XHJcblxyXG4gICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgJHNlbGVjdGlvbnMgPSBbXTtcclxuXHJcbiAgICBmb3IgKHZhciBkID0gMDsgZCA8IGRhdGEubGVuZ3RoOyBkKyspIHtcclxuICAgICAgdmFyIHNlbGVjdGlvbiA9IGRhdGFbZF07XHJcblxyXG4gICAgICB2YXIgJHNlbGVjdGlvbiA9IHRoaXMuc2VsZWN0aW9uQ29udGFpbmVyKCk7XHJcbiAgICAgIHZhciBmb3JtYXR0ZWQgPSB0aGlzLmRpc3BsYXkoc2VsZWN0aW9uLCAkc2VsZWN0aW9uKTtcclxuXHJcbiAgICAgICRzZWxlY3Rpb24uYXBwZW5kKGZvcm1hdHRlZCk7XHJcbiAgICAgICRzZWxlY3Rpb24ucHJvcCgndGl0bGUnLCBzZWxlY3Rpb24udGl0bGUgfHwgc2VsZWN0aW9uLnRleHQpO1xyXG5cclxuICAgICAgJHNlbGVjdGlvbi5kYXRhKCdkYXRhJywgc2VsZWN0aW9uKTtcclxuXHJcbiAgICAgICRzZWxlY3Rpb25zLnB1c2goJHNlbGVjdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyICRyZW5kZXJlZCA9IHRoaXMuJHNlbGVjdGlvbi5maW5kKCcuc2VsZWN0Mi1zZWxlY3Rpb25fX3JlbmRlcmVkJyk7XHJcblxyXG4gICAgVXRpbHMuYXBwZW5kTWFueSgkcmVuZGVyZWQsICRzZWxlY3Rpb25zKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gTXVsdGlwbGVTZWxlY3Rpb247XHJcbn0pO1xyXG5cclxuUzIuZGVmaW5lKCdzZWxlY3QyL3NlbGVjdGlvbi9wbGFjZWhvbGRlcicsW1xyXG4gICcuLi91dGlscydcclxuXSwgZnVuY3Rpb24gKFV0aWxzKSB7XHJcbiAgZnVuY3Rpb24gUGxhY2Vob2xkZXIgKGRlY29yYXRlZCwgJGVsZW1lbnQsIG9wdGlvbnMpIHtcclxuICAgIHRoaXMucGxhY2Vob2xkZXIgPSB0aGlzLm5vcm1hbGl6ZVBsYWNlaG9sZGVyKG9wdGlvbnMuZ2V0KCdwbGFjZWhvbGRlcicpKTtcclxuXHJcbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCAkZWxlbWVudCwgb3B0aW9ucyk7XHJcbiAgfVxyXG5cclxuICBQbGFjZWhvbGRlci5wcm90b3R5cGUubm9ybWFsaXplUGxhY2Vob2xkZXIgPSBmdW5jdGlvbiAoXywgcGxhY2Vob2xkZXIpIHtcclxuICAgIGlmICh0eXBlb2YgcGxhY2Vob2xkZXIgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHBsYWNlaG9sZGVyID0ge1xyXG4gICAgICAgIGlkOiAnJyxcclxuICAgICAgICB0ZXh0OiBwbGFjZWhvbGRlclxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwbGFjZWhvbGRlcjtcclxuICB9O1xyXG5cclxuICBQbGFjZWhvbGRlci5wcm90b3R5cGUuY3JlYXRlUGxhY2Vob2xkZXIgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBwbGFjZWhvbGRlcikge1xyXG4gICAgdmFyICRwbGFjZWhvbGRlciA9IHRoaXMuc2VsZWN0aW9uQ29udGFpbmVyKCk7XHJcblxyXG4gICAgJHBsYWNlaG9sZGVyLmh0bWwodGhpcy5kaXNwbGF5KHBsYWNlaG9sZGVyKSk7XHJcbiAgICAkcGxhY2Vob2xkZXIuYWRkQ2xhc3MoJ3NlbGVjdDItc2VsZWN0aW9uX19wbGFjZWhvbGRlcicpXHJcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NlbGVjdDItc2VsZWN0aW9uX19jaG9pY2UnKTtcclxuXHJcbiAgICByZXR1cm4gJHBsYWNlaG9sZGVyO1xyXG4gIH07XHJcblxyXG4gIFBsYWNlaG9sZGVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBkYXRhKSB7XHJcbiAgICB2YXIgc2luZ2xlUGxhY2Vob2xkZXIgPSAoXHJcbiAgICAgIGRhdGEubGVuZ3RoID09IDEgJiYgZGF0YVswXS5pZCAhPSB0aGlzLnBsYWNlaG9sZGVyLmlkXHJcbiAgICApO1xyXG4gICAgdmFyIG11bHRpcGxlU2VsZWN0aW9ucyA9IGRhdGEubGVuZ3RoID4gMTtcclxuXHJcbiAgICBpZiAobXVsdGlwbGVTZWxlY3Rpb25zIHx8IHNpbmdsZVBsYWNlaG9sZGVyKSB7XHJcbiAgICAgIHJldHVybiBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNsZWFyKCk7XHJcblxyXG4gICAgdmFyICRwbGFjZWhvbGRlciA9IHRoaXMuY3JlYXRlUGxhY2Vob2xkZXIodGhpcy5wbGFjZWhvbGRlcik7XHJcblxyXG4gICAgdGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fcmVuZGVyZWQnKS5hcHBlbmQoJHBsYWNlaG9sZGVyKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gUGxhY2Vob2xkZXI7XHJcbn0pO1xyXG5cclxuUzIuZGVmaW5lKCdzZWxlY3QyL3NlbGVjdGlvbi9hbGxvd0NsZWFyJyxbXHJcbiAgJ2pxdWVyeScsXHJcbiAgJy4uL2tleXMnXHJcbl0sIGZ1bmN0aW9uICgkLCBLRVlTKSB7XHJcbiAgZnVuY3Rpb24gQWxsb3dDbGVhciAoKSB7IH1cclxuXHJcbiAgQWxsb3dDbGVhci5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGNvbnRhaW5lciwgJGNvbnRhaW5lcik7XHJcblxyXG4gICAgaWYgKHRoaXMucGxhY2Vob2xkZXIgPT0gbnVsbCkge1xyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmdldCgnZGVidWcnKSAmJiB3aW5kb3cuY29uc29sZSAmJiBjb25zb2xlLmVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcclxuICAgICAgICAgICdTZWxlY3QyOiBUaGUgYGFsbG93Q2xlYXJgIG9wdGlvbiBzaG91bGQgYmUgdXNlZCBpbiBjb21iaW5hdGlvbiAnICtcclxuICAgICAgICAgICd3aXRoIHRoZSBgcGxhY2Vob2xkZXJgIG9wdGlvbi4nXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbignbW91c2Vkb3duJywgJy5zZWxlY3QyLXNlbGVjdGlvbl9fY2xlYXInLFxyXG4gICAgICBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgICAgc2VsZi5faGFuZGxlQ2xlYXIoZXZ0KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRhaW5lci5vbigna2V5cHJlc3MnLCBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgIHNlbGYuX2hhbmRsZUtleWJvYXJkQ2xlYXIoZXZ0LCBjb250YWluZXIpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgQWxsb3dDbGVhci5wcm90b3R5cGUuX2hhbmRsZUNsZWFyID0gZnVuY3Rpb24gKF8sIGV2dCkge1xyXG4gICAgLy8gSWdub3JlIHRoZSBldmVudCBpZiBpdCBpcyBkaXNhYmxlZFxyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5nZXQoJ2Rpc2FibGVkJykpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciAkY2xlYXIgPSB0aGlzLiRzZWxlY3Rpb24uZmluZCgnLnNlbGVjdDItc2VsZWN0aW9uX19jbGVhcicpO1xyXG5cclxuICAgIC8vIElnbm9yZSB0aGUgZXZlbnQgaWYgbm90aGluZyBoYXMgYmVlbiBzZWxlY3RlZFxyXG4gICAgaWYgKCRjbGVhci5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICB2YXIgZGF0YSA9ICRjbGVhci5kYXRhKCdkYXRhJyk7XHJcblxyXG4gICAgZm9yICh2YXIgZCA9IDA7IGQgPCBkYXRhLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgIHZhciB1bnNlbGVjdERhdGEgPSB7XHJcbiAgICAgICAgZGF0YTogZGF0YVtkXVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gVHJpZ2dlciB0aGUgYHVuc2VsZWN0YCBldmVudCwgc28gcGVvcGxlIGNhbiBwcmV2ZW50IGl0IGZyb20gYmVpbmdcclxuICAgICAgLy8gY2xlYXJlZC5cclxuICAgICAgdGhpcy50cmlnZ2VyKCd1bnNlbGVjdCcsIHVuc2VsZWN0RGF0YSk7XHJcblxyXG4gICAgICAvLyBJZiB0aGUgZXZlbnQgd2FzIHByZXZlbnRlZCwgZG9uJ3QgY2xlYXIgaXQgb3V0LlxyXG4gICAgICBpZiAodW5zZWxlY3REYXRhLnByZXZlbnRlZCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuJGVsZW1lbnQudmFsKHRoaXMucGxhY2Vob2xkZXIuaWQpLnRyaWdnZXIoJ2NoYW5nZScpO1xyXG5cclxuICAgIHRoaXMudHJpZ2dlcigndG9nZ2xlJywge30pO1xyXG4gIH07XHJcblxyXG4gIEFsbG93Q2xlYXIucHJvdG90eXBlLl9oYW5kbGVLZXlib2FyZENsZWFyID0gZnVuY3Rpb24gKF8sIGV2dCwgY29udGFpbmVyKSB7XHJcbiAgICBpZiAoY29udGFpbmVyLmlzT3BlbigpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZXZ0LndoaWNoID09IEtFWVMuREVMRVRFIHx8IGV2dC53aGljaCA9PSBLRVlTLkJBQ0tTUEFDRSkge1xyXG4gICAgICB0aGlzLl9oYW5kbGVDbGVhcihldnQpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIEFsbG93Q2xlYXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGRhdGEpIHtcclxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGRhdGEpO1xyXG5cclxuICAgIGlmICh0aGlzLiRzZWxlY3Rpb24uZmluZCgnLnNlbGVjdDItc2VsZWN0aW9uX19wbGFjZWhvbGRlcicpLmxlbmd0aCA+IDAgfHxcclxuICAgICAgICBkYXRhLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdmFyICRyZW1vdmUgPSAkKFxyXG4gICAgICAnPHNwYW4gY2xhc3M9XCJzZWxlY3QyLXNlbGVjdGlvbl9fY2xlYXJcIj4nICtcclxuICAgICAgICAnJnRpbWVzOycgK1xyXG4gICAgICAnPC9zcGFuPidcclxuICAgICk7XHJcbiAgICAkcmVtb3ZlLmRhdGEoJ2RhdGEnLCBkYXRhKTtcclxuXHJcbiAgICB0aGlzLiRzZWxlY3Rpb24uZmluZCgnLnNlbGVjdDItc2VsZWN0aW9uX19yZW5kZXJlZCcpLnByZXBlbmQoJHJlbW92ZSk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIEFsbG93Q2xlYXI7XHJcbn0pO1xyXG5cclxuUzIuZGVmaW5lKCdzZWxlY3QyL3NlbGVjdGlvbi9zZWFyY2gnLFtcclxuICAnanF1ZXJ5JyxcclxuICAnLi4vdXRpbHMnLFxyXG4gICcuLi9rZXlzJ1xyXG5dLCBmdW5jdGlvbiAoJCwgVXRpbHMsIEtFWVMpIHtcclxuICBmdW5jdGlvbiBTZWFyY2ggKGRlY29yYXRlZCwgJGVsZW1lbnQsIG9wdGlvbnMpIHtcclxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsICRlbGVtZW50LCBvcHRpb25zKTtcclxuICB9XHJcblxyXG4gIFNlYXJjaC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKGRlY29yYXRlZCkge1xyXG4gICAgdmFyICRzZWFyY2ggPSAkKFxyXG4gICAgICAnPGxpIGNsYXNzPVwic2VsZWN0Mi1zZWFyY2ggc2VsZWN0Mi1zZWFyY2gtLWlubGluZVwiPicgK1xyXG4gICAgICAgICc8aW5wdXQgY2xhc3M9XCJzZWxlY3QyLXNlYXJjaF9fZmllbGRcIiB0eXBlPVwic2VhcmNoXCIgdGFiaW5kZXg9XCItMVwiJyArXHJcbiAgICAgICAgJyBhdXRvY29tcGxldGU9XCJvZmZcIiBhdXRvY29ycmVjdD1cIm9mZlwiIGF1dG9jYXBpdGFsaXplPVwib2ZmXCInICtcclxuICAgICAgICAnIHNwZWxsY2hlY2s9XCJmYWxzZVwiIHJvbGU9XCJ0ZXh0Ym94XCIgYXJpYS1hdXRvY29tcGxldGU9XCJsaXN0XCIgLz4nICtcclxuICAgICAgJzwvbGk+J1xyXG4gICAgKTtcclxuXHJcbiAgICB0aGlzLiRzZWFyY2hDb250YWluZXIgPSAkc2VhcmNoO1xyXG4gICAgdGhpcy4kc2VhcmNoID0gJHNlYXJjaC5maW5kKCdpbnB1dCcpO1xyXG5cclxuICAgIHZhciAkcmVuZGVyZWQgPSBkZWNvcmF0ZWQuY2FsbCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLl90cmFuc2ZlclRhYkluZGV4KCk7XHJcblxyXG4gICAgcmV0dXJuICRyZW5kZXJlZDtcclxuICB9O1xyXG5cclxuICBTZWFyY2gucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBjb250YWluZXIsICRjb250YWluZXIpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBjb250YWluZXIsICRjb250YWluZXIpO1xyXG5cclxuICAgIGNvbnRhaW5lci5vbignb3BlbicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgc2VsZi4kc2VhcmNoLnRyaWdnZXIoJ2ZvY3VzJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ2Nsb3NlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICBzZWxmLiRzZWFyY2gudmFsKCcnKTtcclxuICAgICAgc2VsZi4kc2VhcmNoLnJlbW92ZUF0dHIoJ2FyaWEtYWN0aXZlZGVzY2VuZGFudCcpO1xyXG4gICAgICBzZWxmLiRzZWFyY2gudHJpZ2dlcignZm9jdXMnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRhaW5lci5vbignZW5hYmxlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICBzZWxmLiRzZWFyY2gucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XHJcblxyXG4gICAgICBzZWxmLl90cmFuc2ZlclRhYkluZGV4KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ2Rpc2FibGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHNlbGYuJHNlYXJjaC5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29udGFpbmVyLm9uKCdmb2N1cycsIGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgc2VsZi4kc2VhcmNoLnRyaWdnZXIoJ2ZvY3VzJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ3Jlc3VsdHM6Zm9jdXMnLCBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgIHNlbGYuJHNlYXJjaC5hdHRyKCdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnLCBwYXJhbXMuaWQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy4kc2VsZWN0aW9uLm9uKCdmb2N1c2luJywgJy5zZWxlY3QyLXNlYXJjaC0taW5saW5lJywgZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICBzZWxmLnRyaWdnZXIoJ2ZvY3VzJywgZXZ0KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbignZm9jdXNvdXQnLCAnLnNlbGVjdDItc2VhcmNoLS1pbmxpbmUnLCBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgIHNlbGYuX2hhbmRsZUJsdXIoZXZ0KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbigna2V5ZG93bicsICcuc2VsZWN0Mi1zZWFyY2gtLWlubGluZScsIGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgc2VsZi50cmlnZ2VyKCdrZXlwcmVzcycsIGV2dCk7XHJcblxyXG4gICAgICBzZWxmLl9rZXlVcFByZXZlbnRlZCA9IGV2dC5pc0RlZmF1bHRQcmV2ZW50ZWQoKTtcclxuXHJcbiAgICAgIHZhciBrZXkgPSBldnQud2hpY2g7XHJcblxyXG4gICAgICBpZiAoa2V5ID09PSBLRVlTLkJBQ0tTUEFDRSAmJiBzZWxmLiRzZWFyY2gudmFsKCkgPT09ICcnKSB7XHJcbiAgICAgICAgdmFyICRwcmV2aW91c0Nob2ljZSA9IHNlbGYuJHNlYXJjaENvbnRhaW5lclxyXG4gICAgICAgICAgLnByZXYoJy5zZWxlY3QyLXNlbGVjdGlvbl9fY2hvaWNlJyk7XHJcblxyXG4gICAgICAgIGlmICgkcHJldmlvdXNDaG9pY2UubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgdmFyIGl0ZW0gPSAkcHJldmlvdXNDaG9pY2UuZGF0YSgnZGF0YScpO1xyXG5cclxuICAgICAgICAgIHNlbGYuc2VhcmNoUmVtb3ZlQ2hvaWNlKGl0ZW0pO1xyXG5cclxuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gVHJ5IHRvIGRldGVjdCB0aGUgSUUgdmVyc2lvbiBzaG91bGQgdGhlIGBkb2N1bWVudE1vZGVgIHByb3BlcnR5IHRoYXRcclxuICAgIC8vIGlzIHN0b3JlZCBvbiB0aGUgZG9jdW1lbnQuIFRoaXMgaXMgb25seSBpbXBsZW1lbnRlZCBpbiBJRSBhbmQgaXNcclxuICAgIC8vIHNsaWdodGx5IGNsZWFuZXIgdGhhbiBkb2luZyBhIHVzZXIgYWdlbnQgY2hlY2suXHJcbiAgICAvLyBUaGlzIHByb3BlcnR5IGlzIG5vdCBhdmFpbGFibGUgaW4gRWRnZSwgYnV0IEVkZ2UgYWxzbyBkb2Vzbid0IGhhdmVcclxuICAgIC8vIHRoaXMgYnVnLlxyXG4gICAgdmFyIG1zaWUgPSBkb2N1bWVudC5kb2N1bWVudE1vZGU7XHJcbiAgICB2YXIgZGlzYWJsZUlucHV0RXZlbnRzID0gbXNpZSAmJiBtc2llIDw9IDExO1xyXG5cclxuICAgIC8vIFdvcmthcm91bmQgZm9yIGJyb3dzZXJzIHdoaWNoIGRvIG5vdCBzdXBwb3J0IHRoZSBgaW5wdXRgIGV2ZW50XHJcbiAgICAvLyBUaGlzIHdpbGwgcHJldmVudCBkb3VibGUtdHJpZ2dlcmluZyBvZiBldmVudHMgZm9yIGJyb3dzZXJzIHdoaWNoIHN1cHBvcnRcclxuICAgIC8vIGJvdGggdGhlIGBrZXl1cGAgYW5kIGBpbnB1dGAgZXZlbnRzLlxyXG4gICAgdGhpcy4kc2VsZWN0aW9uLm9uKFxyXG4gICAgICAnaW5wdXQuc2VhcmNoY2hlY2snLFxyXG4gICAgICAnLnNlbGVjdDItc2VhcmNoLS1pbmxpbmUnLFxyXG4gICAgICBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgICAgLy8gSUUgd2lsbCB0cmlnZ2VyIHRoZSBgaW5wdXRgIGV2ZW50IHdoZW4gYSBwbGFjZWhvbGRlciBpcyB1c2VkIG9uIGFcclxuICAgICAgICAvLyBzZWFyY2ggYm94LiBUbyBnZXQgYXJvdW5kIHRoaXMgaXNzdWUsIHdlIGFyZSBmb3JjZWQgdG8gaWdub3JlIGFsbFxyXG4gICAgICAgIC8vIGBpbnB1dGAgZXZlbnRzIGluIElFIGFuZCBrZWVwIHVzaW5nIGBrZXl1cGAuXHJcbiAgICAgICAgaWYgKGRpc2FibGVJbnB1dEV2ZW50cykge1xyXG4gICAgICAgICAgc2VsZi4kc2VsZWN0aW9uLm9mZignaW5wdXQuc2VhcmNoIGlucHV0LnNlYXJjaGNoZWNrJyk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBVbmJpbmQgdGhlIGR1cGxpY2F0ZWQgYGtleXVwYCBldmVudFxyXG4gICAgICAgIHNlbGYuJHNlbGVjdGlvbi5vZmYoJ2tleXVwLnNlYXJjaCcpO1xyXG4gICAgICB9XHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbihcclxuICAgICAgJ2tleXVwLnNlYXJjaCBpbnB1dC5zZWFyY2gnLFxyXG4gICAgICAnLnNlbGVjdDItc2VhcmNoLS1pbmxpbmUnLFxyXG4gICAgICBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgICAgLy8gSUUgd2lsbCB0cmlnZ2VyIHRoZSBgaW5wdXRgIGV2ZW50IHdoZW4gYSBwbGFjZWhvbGRlciBpcyB1c2VkIG9uIGFcclxuICAgICAgICAvLyBzZWFyY2ggYm94LiBUbyBnZXQgYXJvdW5kIHRoaXMgaXNzdWUsIHdlIGFyZSBmb3JjZWQgdG8gaWdub3JlIGFsbFxyXG4gICAgICAgIC8vIGBpbnB1dGAgZXZlbnRzIGluIElFIGFuZCBrZWVwIHVzaW5nIGBrZXl1cGAuXHJcbiAgICAgICAgaWYgKGRpc2FibGVJbnB1dEV2ZW50cyAmJiBldnQudHlwZSA9PT0gJ2lucHV0Jykge1xyXG4gICAgICAgICAgc2VsZi4kc2VsZWN0aW9uLm9mZignaW5wdXQuc2VhcmNoIGlucHV0LnNlYXJjaGNoZWNrJyk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIga2V5ID0gZXZ0LndoaWNoO1xyXG5cclxuICAgICAgICAvLyBXZSBjYW4gZnJlZWx5IGlnbm9yZSBldmVudHMgZnJvbSBtb2RpZmllciBrZXlzXHJcbiAgICAgICAgaWYgKGtleSA9PSBLRVlTLlNISUZUIHx8IGtleSA9PSBLRVlTLkNUUkwgfHwga2V5ID09IEtFWVMuQUxUKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUYWJiaW5nIHdpbGwgYmUgaGFuZGxlZCBkdXJpbmcgdGhlIGBrZXlkb3duYCBwaGFzZVxyXG4gICAgICAgIGlmIChrZXkgPT0gS0VZUy5UQUIpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlbGYuaGFuZGxlU2VhcmNoKGV2dCk7XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogVGhpcyBtZXRob2Qgd2lsbCB0cmFuc2ZlciB0aGUgdGFiaW5kZXggYXR0cmlidXRlIGZyb20gdGhlIHJlbmRlcmVkXHJcbiAgICogc2VsZWN0aW9uIHRvIHRoZSBzZWFyY2ggYm94LiBUaGlzIGFsbG93cyBmb3IgdGhlIHNlYXJjaCBib3ggdG8gYmUgdXNlZCBhc1xyXG4gICAqIHRoZSBwcmltYXJ5IGZvY3VzIGluc3RlYWQgb2YgdGhlIHNlbGVjdGlvbiBjb250YWluZXIuXHJcbiAgICpcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqL1xyXG4gIFNlYXJjaC5wcm90b3R5cGUuX3RyYW5zZmVyVGFiSW5kZXggPSBmdW5jdGlvbiAoZGVjb3JhdGVkKSB7XHJcbiAgICB0aGlzLiRzZWFyY2guYXR0cigndGFiaW5kZXgnLCB0aGlzLiRzZWxlY3Rpb24uYXR0cigndGFiaW5kZXgnKSk7XHJcbiAgICB0aGlzLiRzZWxlY3Rpb24uYXR0cigndGFiaW5kZXgnLCAnLTEnKTtcclxuICB9O1xyXG5cclxuICBTZWFyY2gucHJvdG90eXBlLmNyZWF0ZVBsYWNlaG9sZGVyID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgcGxhY2Vob2xkZXIpIHtcclxuICAgIHRoaXMuJHNlYXJjaC5hdHRyKCdwbGFjZWhvbGRlcicsIHBsYWNlaG9sZGVyLnRleHQpO1xyXG4gIH07XHJcblxyXG4gIFNlYXJjaC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgZGF0YSkge1xyXG4gICAgdmFyIHNlYXJjaEhhZEZvY3VzID0gdGhpcy4kc2VhcmNoWzBdID09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XHJcblxyXG4gICAgdGhpcy4kc2VhcmNoLmF0dHIoJ3BsYWNlaG9sZGVyJywgJycpO1xyXG5cclxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGRhdGEpO1xyXG5cclxuICAgIHRoaXMuJHNlbGVjdGlvbi5maW5kKCcuc2VsZWN0Mi1zZWxlY3Rpb25fX3JlbmRlcmVkJylcclxuICAgICAgICAgICAgICAgICAgIC5hcHBlbmQodGhpcy4kc2VhcmNoQ29udGFpbmVyKTtcclxuXHJcbiAgICB0aGlzLnJlc2l6ZVNlYXJjaCgpO1xyXG4gICAgaWYgKHNlYXJjaEhhZEZvY3VzKSB7XHJcbiAgICAgIHRoaXMuJHNlYXJjaC5mb2N1cygpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIFNlYXJjaC5wcm90b3R5cGUuaGFuZGxlU2VhcmNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5yZXNpemVTZWFyY2goKTtcclxuXHJcbiAgICBpZiAoIXRoaXMuX2tleVVwUHJldmVudGVkKSB7XHJcbiAgICAgIHZhciBpbnB1dCA9IHRoaXMuJHNlYXJjaC52YWwoKTtcclxuXHJcbiAgICAgIHRoaXMudHJpZ2dlcigncXVlcnknLCB7XHJcbiAgICAgICAgdGVybTogaW5wdXRcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fa2V5VXBQcmV2ZW50ZWQgPSBmYWxzZTtcclxuICB9O1xyXG5cclxuICBTZWFyY2gucHJvdG90eXBlLnNlYXJjaFJlbW92ZUNob2ljZSA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGl0ZW0pIHtcclxuICAgIHRoaXMudHJpZ2dlcigndW5zZWxlY3QnLCB7XHJcbiAgICAgIGRhdGE6IGl0ZW1cclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuJHNlYXJjaC52YWwoaXRlbS50ZXh0KTtcclxuICAgIHRoaXMuaGFuZGxlU2VhcmNoKCk7XHJcbiAgfTtcclxuXHJcbiAgU2VhcmNoLnByb3RvdHlwZS5yZXNpemVTZWFyY2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLiRzZWFyY2guY3NzKCd3aWR0aCcsICcyNXB4Jyk7XHJcblxyXG4gICAgdmFyIHdpZHRoID0gJyc7XHJcblxyXG4gICAgaWYgKHRoaXMuJHNlYXJjaC5hdHRyKCdwbGFjZWhvbGRlcicpICE9PSAnJykge1xyXG4gICAgICB3aWR0aCA9IHRoaXMuJHNlbGVjdGlvbi5maW5kKCcuc2VsZWN0Mi1zZWxlY3Rpb25fX3JlbmRlcmVkJykuaW5uZXJXaWR0aCgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIG1pbmltdW1XaWR0aCA9IHRoaXMuJHNlYXJjaC52YWwoKS5sZW5ndGggKyAxO1xyXG5cclxuICAgICAgd2lkdGggPSAobWluaW11bVdpZHRoICogMC43NSkgKyAnZW0nO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuJHNlYXJjaC5jc3MoJ3dpZHRoJywgd2lkdGgpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBTZWFyY2g7XHJcbn0pO1xyXG5cclxuUzIuZGVmaW5lKCdzZWxlY3QyL3NlbGVjdGlvbi9ldmVudFJlbGF5JyxbXHJcbiAgJ2pxdWVyeSdcclxuXSwgZnVuY3Rpb24gKCQpIHtcclxuICBmdW5jdGlvbiBFdmVudFJlbGF5ICgpIHsgfVxyXG5cclxuICBFdmVudFJlbGF5LnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgY29udGFpbmVyLCAkY29udGFpbmVyKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB2YXIgcmVsYXlFdmVudHMgPSBbXHJcbiAgICAgICdvcGVuJywgJ29wZW5pbmcnLFxyXG4gICAgICAnY2xvc2UnLCAnY2xvc2luZycsXHJcbiAgICAgICdzZWxlY3QnLCAnc2VsZWN0aW5nJyxcclxuICAgICAgJ3Vuc2VsZWN0JywgJ3Vuc2VsZWN0aW5nJ1xyXG4gICAgXTtcclxuXHJcbiAgICB2YXIgcHJldmVudGFibGVFdmVudHMgPSBbJ29wZW5pbmcnLCAnY2xvc2luZycsICdzZWxlY3RpbmcnLCAndW5zZWxlY3RpbmcnXTtcclxuXHJcbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBjb250YWluZXIsICRjb250YWluZXIpO1xyXG5cclxuICAgIGNvbnRhaW5lci5vbignKicsIGZ1bmN0aW9uIChuYW1lLCBwYXJhbXMpIHtcclxuICAgICAgLy8gSWdub3JlIGV2ZW50cyB0aGF0IHNob3VsZCBub3QgYmUgcmVsYXllZFxyXG4gICAgICBpZiAoJC5pbkFycmF5KG5hbWUsIHJlbGF5RXZlbnRzKSA9PT0gLTEpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFRoZSBwYXJhbWV0ZXJzIHNob3VsZCBhbHdheXMgYmUgYW4gb2JqZWN0XHJcbiAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcclxuXHJcbiAgICAgIC8vIEdlbmVyYXRlIHRoZSBqUXVlcnkgZXZlbnQgZm9yIHRoZSBTZWxlY3QyIGV2ZW50XHJcbiAgICAgIHZhciBldnQgPSAkLkV2ZW50KCdzZWxlY3QyOicgKyBuYW1lLCB7XHJcbiAgICAgICAgcGFyYW1zOiBwYXJhbXNcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBzZWxmLiRlbGVtZW50LnRyaWdnZXIoZXZ0KTtcclxuXHJcbiAgICAgIC8vIE9ubHkgaGFuZGxlIHByZXZlbnRhYmxlIGV2ZW50cyBpZiBpdCB3YXMgb25lXHJcbiAgICAgIGlmICgkLmluQXJyYXkobmFtZSwgcHJldmVudGFibGVFdmVudHMpID09PSAtMSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgcGFyYW1zLnByZXZlbnRlZCA9IGV2dC5pc0RlZmF1bHRQcmV2ZW50ZWQoKTtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBFdmVudFJlbGF5O1xyXG59KTtcclxuXHJcblMyLmRlZmluZSgnc2VsZWN0Mi90cmFuc2xhdGlvbicsW1xyXG4gICdqcXVlcnknLFxyXG4gICdyZXF1aXJlJ1xyXG5dLCBmdW5jdGlvbiAoJCwgcmVxdWlyZSkge1xyXG4gIGZ1bmN0aW9uIFRyYW5zbGF0aW9uIChkaWN0KSB7XHJcbiAgICB0aGlzLmRpY3QgPSBkaWN0IHx8IHt9O1xyXG4gIH1cclxuXHJcbiAgVHJhbnNsYXRpb24ucHJvdG90eXBlLmFsbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB0aGlzLmRpY3Q7XHJcbiAgfTtcclxuXHJcbiAgVHJhbnNsYXRpb24ucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgIHJldHVybiB0aGlzLmRpY3Rba2V5XTtcclxuICB9O1xyXG5cclxuICBUcmFuc2xhdGlvbi5wcm90b3R5cGUuZXh0ZW5kID0gZnVuY3Rpb24gKHRyYW5zbGF0aW9uKSB7XHJcbiAgICB0aGlzLmRpY3QgPSAkLmV4dGVuZCh7fSwgdHJhbnNsYXRpb24uYWxsKCksIHRoaXMuZGljdCk7XHJcbiAgfTtcclxuXHJcbiAgLy8gU3RhdGljIGZ1bmN0aW9uc1xyXG5cclxuICBUcmFuc2xhdGlvbi5fY2FjaGUgPSB7fTtcclxuXHJcbiAgVHJhbnNsYXRpb24ubG9hZFBhdGggPSBmdW5jdGlvbiAocGF0aCkge1xyXG4gICAgaWYgKCEocGF0aCBpbiBUcmFuc2xhdGlvbi5fY2FjaGUpKSB7XHJcbiAgICAgIHZhciB0cmFuc2xhdGlvbnMgPSByZXF1aXJlKHBhdGgpO1xyXG5cclxuICAgICAgVHJhbnNsYXRpb24uX2NhY2hlW3BhdGhdID0gdHJhbnNsYXRpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBuZXcgVHJhbnNsYXRpb24oVHJhbnNsYXRpb24uX2NhY2hlW3BhdGhdKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gVHJhbnNsYXRpb247XHJcbn0pO1xyXG5cclxuUzIuZGVmaW5lKCdzZWxlY3QyL2RpYWNyaXRpY3MnLFtcclxuXHJcbl0sIGZ1bmN0aW9uICgpIHtcclxuICB2YXIgZGlhY3JpdGljcyA9IHtcclxuICAgICdcXHUyNEI2JzogJ0EnLFxyXG4gICAgJ1xcdUZGMjEnOiAnQScsXHJcbiAgICAnXFx1MDBDMCc6ICdBJyxcclxuICAgICdcXHUwMEMxJzogJ0EnLFxyXG4gICAgJ1xcdTAwQzInOiAnQScsXHJcbiAgICAnXFx1MUVBNic6ICdBJyxcclxuICAgICdcXHUxRUE0JzogJ0EnLFxyXG4gICAgJ1xcdTFFQUEnOiAnQScsXHJcbiAgICAnXFx1MUVBOCc6ICdBJyxcclxuICAgICdcXHUwMEMzJzogJ0EnLFxyXG4gICAgJ1xcdTAxMDAnOiAnQScsXHJcbiAgICAnXFx1MDEwMic6ICdBJyxcclxuICAgICdcXHUxRUIwJzogJ0EnLFxyXG4gICAgJ1xcdTFFQUUnOiAnQScsXHJcbiAgICAnXFx1MUVCNCc6ICdBJyxcclxuICAgICdcXHUxRUIyJzogJ0EnLFxyXG4gICAgJ1xcdTAyMjYnOiAnQScsXHJcbiAgICAnXFx1MDFFMCc6ICdBJyxcclxuICAgICdcXHUwMEM0JzogJ0EnLFxyXG4gICAgJ1xcdTAxREUnOiAnQScsXHJcbiAgICAnXFx1MUVBMic6ICdBJyxcclxuICAgICdcXHUwMEM1JzogJ0EnLFxyXG4gICAgJ1xcdTAxRkEnOiAnQScsXHJcbiAgICAnXFx1MDFDRCc6ICdBJyxcclxuICAgICdcXHUwMjAwJzogJ0EnLFxyXG4gICAgJ1xcdTAyMDInOiAnQScsXHJcbiAgICAnXFx1MUVBMCc6ICdBJyxcclxuICAgICdcXHUxRUFDJzogJ0EnLFxyXG4gICAgJ1xcdTFFQjYnOiAnQScsXHJcbiAgICAnXFx1MUUwMCc6ICdBJyxcclxuICAgICdcXHUwMTA0JzogJ0EnLFxyXG4gICAgJ1xcdTAyM0EnOiAnQScsXHJcbiAgICAnXFx1MkM2Ric6ICdBJyxcclxuICAgICdcXHVBNzMyJzogJ0FBJyxcclxuICAgICdcXHUwMEM2JzogJ0FFJyxcclxuICAgICdcXHUwMUZDJzogJ0FFJyxcclxuICAgICdcXHUwMUUyJzogJ0FFJyxcclxuICAgICdcXHVBNzM0JzogJ0FPJyxcclxuICAgICdcXHVBNzM2JzogJ0FVJyxcclxuICAgICdcXHVBNzM4JzogJ0FWJyxcclxuICAgICdcXHVBNzNBJzogJ0FWJyxcclxuICAgICdcXHVBNzNDJzogJ0FZJyxcclxuICAgICdcXHUyNEI3JzogJ0InLFxyXG4gICAgJ1xcdUZGMjInOiAnQicsXHJcbiAgICAnXFx1MUUwMic6ICdCJyxcclxuICAgICdcXHUxRTA0JzogJ0InLFxyXG4gICAgJ1xcdTFFMDYnOiAnQicsXHJcbiAgICAnXFx1MDI0Myc6ICdCJyxcclxuICAgICdcXHUwMTgyJzogJ0InLFxyXG4gICAgJ1xcdTAxODEnOiAnQicsXHJcbiAgICAnXFx1MjRCOCc6ICdDJyxcclxuICAgICdcXHVGRjIzJzogJ0MnLFxyXG4gICAgJ1xcdTAxMDYnOiAnQycsXHJcbiAgICAnXFx1MDEwOCc6ICdDJyxcclxuICAgICdcXHUwMTBBJzogJ0MnLFxyXG4gICAgJ1xcdTAxMEMnOiAnQycsXHJcbiAgICAnXFx1MDBDNyc6ICdDJyxcclxuICAgICdcXHUxRTA4JzogJ0MnLFxyXG4gICAgJ1xcdTAxODcnOiAnQycsXHJcbiAgICAnXFx1MDIzQic6ICdDJyxcclxuICAgICdcXHVBNzNFJzogJ0MnLFxyXG4gICAgJ1xcdTI0QjknOiAnRCcsXHJcbiAgICAnXFx1RkYyNCc6ICdEJyxcclxuICAgICdcXHUxRTBBJzogJ0QnLFxyXG4gICAgJ1xcdTAxMEUnOiAnRCcsXHJcbiAgICAnXFx1MUUwQyc6ICdEJyxcclxuICAgICdcXHUxRTEwJzogJ0QnLFxyXG4gICAgJ1xcdTFFMTInOiAnRCcsXHJcbiAgICAnXFx1MUUwRSc6ICdEJyxcclxuICAgICdcXHUwMTEwJzogJ0QnLFxyXG4gICAgJ1xcdTAxOEInOiAnRCcsXHJcbiAgICAnXFx1MDE4QSc6ICdEJyxcclxuICAgICdcXHUwMTg5JzogJ0QnLFxyXG4gICAgJ1xcdUE3NzknOiAnRCcsXHJcbiAgICAnXFx1MDFGMSc6ICdEWicsXHJcbiAgICAnXFx1MDFDNCc6ICdEWicsXHJcbiAgICAnXFx1MDFGMic6ICdEeicsXHJcbiAgICAnXFx1MDFDNSc6ICdEeicsXHJcbiAgICAnXFx1MjRCQSc6ICdFJyxcclxuICAgICdcXHVGRjI1JzogJ0UnLFxyXG4gICAgJ1xcdTAwQzgnOiAnRScsXHJcbiAgICAnXFx1MDBDOSc6ICdFJyxcclxuICAgICdcXHUwMENBJzogJ0UnLFxyXG4gICAgJ1xcdTFFQzAnOiAnRScsXHJcbiAgICAnXFx1MUVCRSc6ICdFJyxcclxuICAgICdcXHUxRUM0JzogJ0UnLFxyXG4gICAgJ1xcdTFFQzInOiAnRScsXHJcbiAgICAnXFx1MUVCQyc6ICdFJyxcclxuICAgICdcXHUwMTEyJzogJ0UnLFxyXG4gICAgJ1xcdTFFMTQnOiAnRScsXHJcbiAgICAnXFx1MUUxNic6ICdFJyxcclxuICAgICdcXHUwMTE0JzogJ0UnLFxyXG4gICAgJ1xcdTAxMTYnOiAnRScsXHJcbiAgICAnXFx1MDBDQic6ICdFJyxcclxuICAgICdcXHUxRUJBJzogJ0UnLFxyXG4gICAgJ1xcdTAxMUEnOiAnRScsXHJcbiAgICAnXFx1MDIwNCc6ICdFJyxcclxuICAgICdcXHUwMjA2JzogJ0UnLFxyXG4gICAgJ1xcdTFFQjgnOiAnRScsXHJcbiAgICAnXFx1MUVDNic6ICdFJyxcclxuICAgICdcXHUwMjI4JzogJ0UnLFxyXG4gICAgJ1xcdTFFMUMnOiAnRScsXHJcbiAgICAnXFx1MDExOCc6ICdFJyxcclxuICAgICdcXHUxRTE4JzogJ0UnLFxyXG4gICAgJ1xcdTFFMUEnOiAnRScsXHJcbiAgICAnXFx1MDE5MCc6ICdFJyxcclxuICAgICdcXHUwMThFJzogJ0UnLFxyXG4gICAgJ1xcdTI0QkInOiAnRicsXHJcbiAgICAnXFx1RkYyNic6ICdGJyxcclxuICAgICdcXHUxRTFFJzogJ0YnLFxyXG4gICAgJ1xcdTAxOTEnOiAnRicsXHJcbiAgICAnXFx1QTc3Qic6ICdGJyxcclxuICAgICdcXHUyNEJDJzogJ0cnLFxyXG4gICAgJ1xcdUZGMjcnOiAnRycsXHJcbiAgICAnXFx1MDFGNCc6ICdHJyxcclxuICAgICdcXHUwMTFDJzogJ0cnLFxyXG4gICAgJ1xcdTFFMjAnOiAnRycsXHJcbiAgICAnXFx1MDExRSc6ICdHJyxcclxuICAgICdcXHUwMTIwJzogJ0cnLFxyXG4gICAgJ1xcdTAxRTYnOiAnRycsXHJcbiAgICAnXFx1MDEyMic6ICdHJyxcclxuICAgICdcXHUwMUU0JzogJ0cnLFxyXG4gICAgJ1xcdTAxOTMnOiAnRycsXHJcbiAgICAnXFx1QTdBMCc6ICdHJyxcclxuICAgICdcXHVBNzdEJzogJ0cnLFxyXG4gICAgJ1xcdUE3N0UnOiAnRycsXHJcbiAgICAnXFx1MjRCRCc6ICdIJyxcclxuICAgICdcXHVGRjI4JzogJ0gnLFxyXG4gICAgJ1xcdTAxMjQnOiAnSCcsXHJcbiAgICAnXFx1MUUyMic6ICdIJyxcclxuICAgICdcXHUxRTI2JzogJ0gnLFxyXG4gICAgJ1xcdTAyMUUnOiAnSCcsXHJcbiAgICAnXFx1MUUyNCc6ICdIJyxcclxuICAgICdcXHUxRTI4JzogJ0gnLFxyXG4gICAgJ1xcdTFFMkEnOiAnSCcsXHJcbiAgICAnXFx1MDEyNic6ICdIJyxcclxuICAgICdcXHUyQzY3JzogJ0gnLFxyXG4gICAgJ1xcdTJDNzUnOiAnSCcsXHJcbiAgICAnXFx1QTc4RCc6ICdIJyxcclxuICAgICdcXHUyNEJFJzogJ0knLFxyXG4gICAgJ1xcdUZGMjknOiAnSScsXHJcbiAgICAnXFx1MDBDQyc6ICdJJyxcclxuICAgICdcXHUwMENEJzogJ0knLFxyXG4gICAgJ1xcdTAwQ0UnOiAnSScsXHJcbiAgICAnXFx1MDEyOCc6ICdJJyxcclxuICAgICdcXHUwMTJBJzogJ0knLFxyXG4gICAgJ1xcdTAxMkMnOiAnSScsXHJcbiAgICAnXFx1MDEzMCc6ICdJJyxcclxuICAgICdcXHUwMENGJzogJ0knLFxyXG4gICAgJ1xcdTFFMkUnOiAnSScsXHJcbiAgICAnXFx1MUVDOCc6ICdJJyxcclxuICAgICdcXHUwMUNGJzogJ0knLFxyXG4gICAgJ1xcdTAyMDgnOiAnSScsXHJcbiAgICAnXFx1MDIwQSc6ICdJJyxcclxuICAgICdcXHUxRUNBJzogJ0knLFxyXG4gICAgJ1xcdTAxMkUnOiAnSScsXHJcbiAgICAnXFx1MUUyQyc6ICdJJyxcclxuICAgICdcXHUwMTk3JzogJ0knLFxyXG4gICAgJ1xcdTI0QkYnOiAnSicsXHJcbiAgICAnXFx1RkYyQSc6ICdKJyxcclxuICAgICdcXHUwMTM0JzogJ0onLFxyXG4gICAgJ1xcdTAyNDgnOiAnSicsXHJcbiAgICAnXFx1MjRDMCc6ICdLJyxcclxuICAgICdcXHVGRjJCJzogJ0snLFxyXG4gICAgJ1xcdTFFMzAnOiAnSycsXHJcbiAgICAnXFx1MDFFOCc6ICdLJyxcclxuICAgICdcXHUxRTMyJzogJ0snLFxyXG4gICAgJ1xcdTAxMzYnOiAnSycsXHJcbiAgICAnXFx1MUUzNCc6ICdLJyxcclxuICAgICdcXHUwMTk4JzogJ0snLFxyXG4gICAgJ1xcdTJDNjknOiAnSycsXHJcbiAgICAnXFx1QTc0MCc6ICdLJyxcclxuICAgICdcXHVBNzQyJzogJ0snLFxyXG4gICAgJ1xcdUE3NDQnOiAnSycsXHJcbiAgICAnXFx1QTdBMic6ICdLJyxcclxuICAgICdcXHUyNEMxJzogJ0wnLFxyXG4gICAgJ1xcdUZGMkMnOiAnTCcsXHJcbiAgICAnXFx1MDEzRic6ICdMJyxcclxuICAgICdcXHUwMTM5JzogJ0wnLFxyXG4gICAgJ1xcdTAxM0QnOiAnTCcsXHJcbiAgICAnXFx1MUUzNic6ICdMJyxcclxuICAgICdcXHUxRTM4JzogJ0wnLFxyXG4gICAgJ1xcdTAxM0InOiAnTCcsXHJcbiAgICAnXFx1MUUzQyc6ICdMJyxcclxuICAgICdcXHUxRTNBJzogJ0wnLFxyXG4gICAgJ1xcdTAxNDEnOiAnTCcsXHJcbiAgICAnXFx1MDIzRCc6ICdMJyxcclxuICAgICdcXHUyQzYyJzogJ0wnLFxyXG4gICAgJ1xcdTJDNjAnOiAnTCcsXHJcbiAgICAnXFx1QTc0OCc6ICdMJyxcclxuICAgICdcXHVBNzQ2JzogJ0wnLFxyXG4gICAgJ1xcdUE3ODAnOiAnTCcsXHJcbiAgICAnXFx1MDFDNyc6ICdMSicsXHJcbiAgICAnXFx1MDFDOCc6ICdMaicsXHJcbiAgICAnXFx1MjRDMic6ICdNJyxcclxuICAgICdcXHVGRjJEJzogJ00nLFxyXG4gICAgJ1xcdTFFM0UnOiAnTScsXHJcbiAgICAnXFx1MUU0MCc6ICdNJyxcclxuICAgICdcXHUxRTQyJzogJ00nLFxyXG4gICAgJ1xcdTJDNkUnOiAnTScsXHJcbiAgICAnXFx1MDE5Qyc6ICdNJyxcclxuICAgICdcXHUyNEMzJzogJ04nLFxyXG4gICAgJ1xcdUZGMkUnOiAnTicsXHJcbiAgICAnXFx1MDFGOCc6ICdOJyxcclxuICAgICdcXHUwMTQzJzogJ04nLFxyXG4gICAgJ1xcdTAwRDEnOiAnTicsXHJcbiAgICAnXFx1MUU0NCc6ICdOJyxcclxuICAgICdcXHUwMTQ3JzogJ04nLFxyXG4gICAgJ1xcdTFFNDYnOiAnTicsXHJcbiAgICAnXFx1MDE0NSc6ICdOJyxcclxuICAgICdcXHUxRTRBJzogJ04nLFxyXG4gICAgJ1xcdTFFNDgnOiAnTicsXHJcbiAgICAnXFx1MDIyMCc6ICdOJyxcclxuICAgICdcXHUwMTlEJzogJ04nLFxyXG4gICAgJ1xcdUE3OTAnOiAnTicsXHJcbiAgICAnXFx1QTdBNCc6ICdOJyxcclxuICAgICdcXHUwMUNBJzogJ05KJyxcclxuICAgICdcXHUwMUNCJzogJ05qJyxcclxuICAgICdcXHUyNEM0JzogJ08nLFxyXG4gICAgJ1xcdUZGMkYnOiAnTycsXHJcbiAgICAnXFx1MDBEMic6ICdPJyxcclxuICAgICdcXHUwMEQzJzogJ08nLFxyXG4gICAgJ1xcdTAwRDQnOiAnTycsXHJcbiAgICAnXFx1MUVEMic6ICdPJyxcclxuICAgICdcXHUxRUQwJzogJ08nLFxyXG4gICAgJ1xcdTFFRDYnOiAnTycsXHJcbiAgICAnXFx1MUVENCc6ICdPJyxcclxuICAgICdcXHUwMEQ1JzogJ08nLFxyXG4gICAgJ1xcdTFFNEMnOiAnTycsXHJcbiAgICAnXFx1MDIyQyc6ICdPJyxcclxuICAgICdcXHUxRTRFJzogJ08nLFxyXG4gICAgJ1xcdTAxNEMnOiAnTycsXHJcbiAgICAnXFx1MUU1MCc6ICdPJyxcclxuICAgICdcXHUxRTUyJzogJ08nLFxyXG4gICAgJ1xcdTAxNEUnOiAnTycsXHJcbiAgICAnXFx1MDIyRSc6ICdPJyxcclxuICAgICdcXHUwMjMwJzogJ08nLFxyXG4gICAgJ1xcdTAwRDYnOiAnTycsXHJcbiAgICAnXFx1MDIyQSc6ICdPJyxcclxuICAgICdcXHUxRUNFJzogJ08nLFxyXG4gICAgJ1xcdTAxNTAnOiAnTycsXHJcbiAgICAnXFx1MDFEMSc6ICdPJyxcclxuICAgICdcXHUwMjBDJzogJ08nLFxyXG4gICAgJ1xcdTAyMEUnOiAnTycsXHJcbiAgICAnXFx1MDFBMCc6ICdPJyxcclxuICAgICdcXHUxRURDJzogJ08nLFxyXG4gICAgJ1xcdTFFREEnOiAnTycsXHJcbiAgICAnXFx1MUVFMCc6ICdPJyxcclxuICAgICdcXHUxRURFJzogJ08nLFxyXG4gICAgJ1xcdTFFRTInOiAnTycsXHJcbiAgICAnXFx1MUVDQyc6ICdPJyxcclxuICAgICdcXHUxRUQ4JzogJ08nLFxyXG4gICAgJ1xcdTAxRUEnOiAnTycsXHJcbiAgICAnXFx1MDFFQyc6ICdPJyxcclxuICAgICdcXHUwMEQ4JzogJ08nLFxyXG4gICAgJ1xcdTAxRkUnOiAnTycsXHJcbiAgICAnXFx1MDE4Nic6ICdPJyxcclxuICAgICdcXHUwMTlGJzogJ08nLFxyXG4gICAgJ1xcdUE3NEEnOiAnTycsXHJcbiAgICAnXFx1QTc0Qyc6ICdPJyxcclxuICAgICdcXHUwMUEyJzogJ09JJyxcclxuICAgICdcXHVBNzRFJzogJ09PJyxcclxuICAgICdcXHUwMjIyJzogJ09VJyxcclxuICAgICdcXHUyNEM1JzogJ1AnLFxyXG4gICAgJ1xcdUZGMzAnOiAnUCcsXHJcbiAgICAnXFx1MUU1NCc6ICdQJyxcclxuICAgICdcXHUxRTU2JzogJ1AnLFxyXG4gICAgJ1xcdTAxQTQnOiAnUCcsXHJcbiAgICAnXFx1MkM2Myc6ICdQJyxcclxuICAgICdcXHVBNzUwJzogJ1AnLFxyXG4gICAgJ1xcdUE3NTInOiAnUCcsXHJcbiAgICAnXFx1QTc1NCc6ICdQJyxcclxuICAgICdcXHUyNEM2JzogJ1EnLFxyXG4gICAgJ1xcdUZGMzEnOiAnUScsXHJcbiAgICAnXFx1QTc1Nic6ICdRJyxcclxuICAgICdcXHVBNzU4JzogJ1EnLFxyXG4gICAgJ1xcdTAyNEEnOiAnUScsXHJcbiAgICAnXFx1MjRDNyc6ICdSJyxcclxuICAgICdcXHVGRjMyJzogJ1InLFxyXG4gICAgJ1xcdTAxNTQnOiAnUicsXHJcbiAgICAnXFx1MUU1OCc6ICdSJyxcclxuICAgICdcXHUwMTU4JzogJ1InLFxyXG4gICAgJ1xcdTAyMTAnOiAnUicsXHJcbiAgICAnXFx1MDIxMic6ICdSJyxcclxuICAgICdcXHUxRTVBJzogJ1InLFxyXG4gICAgJ1xcdTFFNUMnOiAnUicsXHJcbiAgICAnXFx1MDE1Nic6ICdSJyxcclxuICAgICdcXHUxRTVFJzogJ1InLFxyXG4gICAgJ1xcdTAyNEMnOiAnUicsXHJcbiAgICAnXFx1MkM2NCc6ICdSJyxcclxuICAgICdcXHVBNzVBJzogJ1InLFxyXG4gICAgJ1xcdUE3QTYnOiAnUicsXHJcbiAgICAnXFx1QTc4Mic6ICdSJyxcclxuICAgICdcXHUyNEM4JzogJ1MnLFxyXG4gICAgJ1xcdUZGMzMnOiAnUycsXHJcbiAgICAnXFx1MUU5RSc6ICdTJyxcclxuICAgICdcXHUwMTVBJzogJ1MnLFxyXG4gICAgJ1xcdTFFNjQnOiAnUycsXHJcbiAgICAnXFx1MDE1Qyc6ICdTJyxcclxuICAgICdcXHUxRTYwJzogJ1MnLFxyXG4gICAgJ1xcdTAxNjAnOiAnUycsXHJcbiAgICAnXFx1MUU2Nic6ICdTJyxcclxuICAgICdcXHUxRTYyJzogJ1MnLFxyXG4gICAgJ1xcdTFFNjgnOiAnUycsXHJcbiAgICAnXFx1MDIxOCc6ICdTJyxcclxuICAgICdcXHUwMTVFJzogJ1MnLFxyXG4gICAgJ1xcdTJDN0UnOiAnUycsXHJcbiAgICAnXFx1QTdBOCc6ICdTJyxcclxuICAgICdcXHVBNzg0JzogJ1MnLFxyXG4gICAgJ1xcdTI0QzknOiAnVCcsXHJcbiAgICAnXFx1RkYzNCc6ICdUJyxcclxuICAgICdcXHUxRTZBJzogJ1QnLFxyXG4gICAgJ1xcdTAxNjQnOiAnVCcsXHJcbiAgICAnXFx1MUU2Qyc6ICdUJyxcclxuICAgICdcXHUwMjFBJzogJ1QnLFxyXG4gICAgJ1xcdTAxNjInOiAnVCcsXHJcbiAgICAnXFx1MUU3MCc6ICdUJyxcclxuICAgICdcXHUxRTZFJzogJ1QnLFxyXG4gICAgJ1xcdTAxNjYnOiAnVCcsXHJcbiAgICAnXFx1MDFBQyc6ICdUJyxcclxuICAgICdcXHUwMUFFJzogJ1QnLFxyXG4gICAgJ1xcdTAyM0UnOiAnVCcsXHJcbiAgICAnXFx1QTc4Nic6ICdUJyxcclxuICAgICdcXHVBNzI4JzogJ1RaJyxcclxuICAgICdcXHUyNENBJzogJ1UnLFxyXG4gICAgJ1xcdUZGMzUnOiAnVScsXHJcbiAgICAnXFx1MDBEOSc6ICdVJyxcclxuICAgICdcXHUwMERBJzogJ1UnLFxyXG4gICAgJ1xcdTAwREInOiAnVScsXHJcbiAgICAnXFx1MDE2OCc6ICdVJyxcclxuICAgICdcXHUxRTc4JzogJ1UnLFxyXG4gICAgJ1xcdTAxNkEnOiAnVScsXHJcbiAgICAnXFx1MUU3QSc6ICdVJyxcclxuICAgICdcXHUwMTZDJzogJ1UnLFxyXG4gICAgJ1xcdTAwREMnOiAnVScsXHJcbiAgICAnXFx1MDFEQic6ICdVJyxcclxuICAgICdcXHUwMUQ3JzogJ1UnLFxyXG4gICAgJ1xcdTAxRDUnOiAnVScsXHJcbiAgICAnXFx1MDFEOSc6ICdVJyxcclxuICAgICdcXHUxRUU2JzogJ1UnLFxyXG4gICAgJ1xcdTAxNkUnOiAnVScsXHJcbiAgICAnXFx1MDE3MCc6ICdVJyxcclxuICAgICdcXHUwMUQzJzogJ1UnLFxyXG4gICAgJ1xcdTAyMTQnOiAnVScsXHJcbiAgICAnXFx1MDIxNic6ICdVJyxcclxuICAgICdcXHUwMUFGJzogJ1UnLFxyXG4gICAgJ1xcdTFFRUEnOiAnVScsXHJcbiAgICAnXFx1MUVFOCc6ICdVJyxcclxuICAgICdcXHUxRUVFJzogJ1UnLFxyXG4gICAgJ1xcdTFFRUMnOiAnVScsXHJcbiAgICAnXFx1MUVGMCc6ICdVJyxcclxuICAgICdcXHUxRUU0JzogJ1UnLFxyXG4gICAgJ1xcdTFFNzInOiAnVScsXHJcbiAgICAnXFx1MDE3Mic6ICdVJyxcclxuICAgICdcXHUxRTc2JzogJ1UnLFxyXG4gICAgJ1xcdTFFNzQnOiAnVScsXHJcbiAgICAnXFx1MDI0NCc6ICdVJyxcclxuICAgICdcXHUyNENCJzogJ1YnLFxyXG4gICAgJ1xcdUZGMzYnOiAnVicsXHJcbiAgICAnXFx1MUU3Qyc6ICdWJyxcclxuICAgICdcXHUxRTdFJzogJ1YnLFxyXG4gICAgJ1xcdTAxQjInOiAnVicsXHJcbiAgICAnXFx1QTc1RSc6ICdWJyxcclxuICAgICdcXHUwMjQ1JzogJ1YnLFxyXG4gICAgJ1xcdUE3NjAnOiAnVlknLFxyXG4gICAgJ1xcdTI0Q0MnOiAnVycsXHJcbiAgICAnXFx1RkYzNyc6ICdXJyxcclxuICAgICdcXHUxRTgwJzogJ1cnLFxyXG4gICAgJ1xcdTFFODInOiAnVycsXHJcbiAgICAnXFx1MDE3NCc6ICdXJyxcclxuICAgICdcXHUxRTg2JzogJ1cnLFxyXG4gICAgJ1xcdTFFODQnOiAnVycsXHJcbiAgICAnXFx1MUU4OCc6ICdXJyxcclxuICAgICdcXHUyQzcyJzogJ1cnLFxyXG4gICAgJ1xcdTI0Q0QnOiAnWCcsXHJcbiAgICAnXFx1RkYzOCc6ICdYJyxcclxuICAgICdcXHUxRThBJzogJ1gnLFxyXG4gICAgJ1xcdTFFOEMnOiAnWCcsXHJcbiAgICAnXFx1MjRDRSc6ICdZJyxcclxuICAgICdcXHVGRjM5JzogJ1knLFxyXG4gICAgJ1xcdTFFRjInOiAnWScsXHJcbiAgICAnXFx1MDBERCc6ICdZJyxcclxuICAgICdcXHUwMTc2JzogJ1knLFxyXG4gICAgJ1xcdTFFRjgnOiAnWScsXHJcbiAgICAnXFx1MDIzMic6ICdZJyxcclxuICAgICdcXHUxRThFJzogJ1knLFxyXG4gICAgJ1xcdTAxNzgnOiAnWScsXHJcbiAgICAnXFx1MUVGNic6ICdZJyxcclxuICAgICdcXHUxRUY0JzogJ1knLFxyXG4gICAgJ1xcdTAxQjMnOiAnWScsXHJcbiAgICAnXFx1MDI0RSc6ICdZJyxcclxuICAgICdcXHUxRUZFJzogJ1knLFxyXG4gICAgJ1xcdTI0Q0YnOiAnWicsXHJcbiAgICAnXFx1RkYzQSc6ICdaJyxcclxuICAgICdcXHUwMTc5JzogJ1onLFxyXG4gICAgJ1xcdTFFOTAnOiAnWicsXHJcbiAgICAnXFx1MDE3Qic6ICdaJyxcclxuICAgICdcXHUwMTdEJzogJ1onLFxyXG4gICAgJ1xcdTFFOTInOiAnWicsXHJcbiAgICAnXFx1MUU5NCc6ICdaJyxcclxuICAgICdcXHUwMUI1JzogJ1onLFxyXG4gICAgJ1xcdTAyMjQnOiAnWicsXHJcbiAgICAnXFx1MkM3Ric6ICdaJyxcclxuICAgICdcXHUyQzZCJzogJ1onLFxyXG4gICAgJ1xcdUE3NjInOiAnWicsXHJcbiAgICAnXFx1MjREMCc6ICdhJyxcclxuICAgICdcXHVGRjQxJzogJ2EnLFxyXG4gICAgJ1xcdTFFOUEnOiAnYScsXHJcbiAgICAnXFx1MDBFMCc6ICdhJyxcclxuICAgICdcXHUwMEUxJzogJ2EnLFxyXG4gICAgJ1xcdTAwRTInOiAnYScsXHJcbiAgICAnXFx1MUVBNyc6ICdhJyxcclxuICAgICdcXHUxRUE1JzogJ2EnLFxyXG4gICAgJ1xcdTFFQUInOiAnYScsXHJcbiAgICAnXFx1MUVBOSc6ICdhJyxcclxuICAgICdcXHUwMEUzJzogJ2EnLFxyXG4gICAgJ1xcdTAxMDEnOiAnYScsXHJcbiAgICAnXFx1MDEwMyc6ICdhJyxcclxuICAgICdcXHUxRUIxJzogJ2EnLFxyXG4gICAgJ1xcdTFFQUYnOiAnYScsXHJcbiAgICAnXFx1MUVCNSc6ICdhJyxcclxuICAgICdcXHUxRUIzJzogJ2EnLFxyXG4gICAgJ1xcdTAyMjcnOiAnYScsXHJcbiAgICAnXFx1MDFFMSc6ICdhJyxcclxuICAgICdcXHUwMEU0JzogJ2EnLFxyXG4gICAgJ1xcdTAxREYnOiAnYScsXHJcbiAgICAnXFx1MUVBMyc6ICdhJyxcclxuICAgICdcXHUwMEU1JzogJ2EnLFxyXG4gICAgJ1xcdTAxRkInOiAnYScsXHJcbiAgICAnXFx1MDFDRSc6ICdhJyxcclxuICAgICdcXHUwMjAxJzogJ2EnLFxyXG4gICAgJ1xcdTAyMDMnOiAnYScsXHJcbiAgICAnXFx1MUVBMSc6ICdhJyxcclxuICAgICdcXHUxRUFEJzogJ2EnLFxyXG4gICAgJ1xcdTFFQjcnOiAnYScsXHJcbiAgICAnXFx1MUUwMSc6ICdhJyxcclxuICAgICdcXHUwMTA1JzogJ2EnLFxyXG4gICAgJ1xcdTJDNjUnOiAnYScsXHJcbiAgICAnXFx1MDI1MCc6ICdhJyxcclxuICAgICdcXHVBNzMzJzogJ2FhJyxcclxuICAgICdcXHUwMEU2JzogJ2FlJyxcclxuICAgICdcXHUwMUZEJzogJ2FlJyxcclxuICAgICdcXHUwMUUzJzogJ2FlJyxcclxuICAgICdcXHVBNzM1JzogJ2FvJyxcclxuICAgICdcXHVBNzM3JzogJ2F1JyxcclxuICAgICdcXHVBNzM5JzogJ2F2JyxcclxuICAgICdcXHVBNzNCJzogJ2F2JyxcclxuICAgICdcXHVBNzNEJzogJ2F5JyxcclxuICAgICdcXHUyNEQxJzogJ2InLFxyXG4gICAgJ1xcdUZGNDInOiAnYicsXHJcbiAgICAnXFx1MUUwMyc6ICdiJyxcclxuICAgICdcXHUxRTA1JzogJ2InLFxyXG4gICAgJ1xcdTFFMDcnOiAnYicsXHJcbiAgICAnXFx1MDE4MCc6ICdiJyxcclxuICAgICdcXHUwMTgzJzogJ2InLFxyXG4gICAgJ1xcdTAyNTMnOiAnYicsXHJcbiAgICAnXFx1MjREMic6ICdjJyxcclxuICAgICdcXHVGRjQzJzogJ2MnLFxyXG4gICAgJ1xcdTAxMDcnOiAnYycsXHJcbiAgICAnXFx1MDEwOSc6ICdjJyxcclxuICAgICdcXHUwMTBCJzogJ2MnLFxyXG4gICAgJ1xcdTAxMEQnOiAnYycsXHJcbiAgICAnXFx1MDBFNyc6ICdjJyxcclxuICAgICdcXHUxRTA5JzogJ2MnLFxyXG4gICAgJ1xcdTAxODgnOiAnYycsXHJcbiAgICAnXFx1MDIzQyc6ICdjJyxcclxuICAgICdcXHVBNzNGJzogJ2MnLFxyXG4gICAgJ1xcdTIxODQnOiAnYycsXHJcbiAgICAnXFx1MjREMyc6ICdkJyxcclxuICAgICdcXHVGRjQ0JzogJ2QnLFxyXG4gICAgJ1xcdTFFMEInOiAnZCcsXHJcbiAgICAnXFx1MDEwRic6ICdkJyxcclxuICAgICdcXHUxRTBEJzogJ2QnLFxyXG4gICAgJ1xcdTFFMTEnOiAnZCcsXHJcbiAgICAnXFx1MUUxMyc6ICdkJyxcclxuICAgICdcXHUxRTBGJzogJ2QnLFxyXG4gICAgJ1xcdTAxMTEnOiAnZCcsXHJcbiAgICAnXFx1MDE4Qyc6ICdkJyxcclxuICAgICdcXHUwMjU2JzogJ2QnLFxyXG4gICAgJ1xcdTAyNTcnOiAnZCcsXHJcbiAgICAnXFx1QTc3QSc6ICdkJyxcclxuICAgICdcXHUwMUYzJzogJ2R6JyxcclxuICAgICdcXHUwMUM2JzogJ2R6JyxcclxuICAgICdcXHUyNEQ0JzogJ2UnLFxyXG4gICAgJ1xcdUZGNDUnOiAnZScsXHJcbiAgICAnXFx1MDBFOCc6ICdlJyxcclxuICAgICdcXHUwMEU5JzogJ2UnLFxyXG4gICAgJ1xcdTAwRUEnOiAnZScsXHJcbiAgICAnXFx1MUVDMSc6ICdlJyxcclxuICAgICdcXHUxRUJGJzogJ2UnLFxyXG4gICAgJ1xcdTFFQzUnOiAnZScsXHJcbiAgICAnXFx1MUVDMyc6ICdlJyxcclxuICAgICdcXHUxRUJEJzogJ2UnLFxyXG4gICAgJ1xcdTAxMTMnOiAnZScsXHJcbiAgICAnXFx1MUUxNSc6ICdlJyxcclxuICAgICdcXHUxRTE3JzogJ2UnLFxyXG4gICAgJ1xcdTAxMTUnOiAnZScsXHJcbiAgICAnXFx1MDExNyc6ICdlJyxcclxuICAgICdcXHUwMEVCJzogJ2UnLFxyXG4gICAgJ1xcdTFFQkInOiAnZScsXHJcbiAgICAnXFx1MDExQic6ICdlJyxcclxuICAgICdcXHUwMjA1JzogJ2UnLFxyXG4gICAgJ1xcdTAyMDcnOiAnZScsXHJcbiAgICAnXFx1MUVCOSc6ICdlJyxcclxuICAgICdcXHUxRUM3JzogJ2UnLFxyXG4gICAgJ1xcdTAyMjknOiAnZScsXHJcbiAgICAnXFx1MUUxRCc6ICdlJyxcclxuICAgICdcXHUwMTE5JzogJ2UnLFxyXG4gICAgJ1xcdTFFMTknOiAnZScsXHJcbiAgICAnXFx1MUUxQic6ICdlJyxcclxuICAgICdcXHUwMjQ3JzogJ2UnLFxyXG4gICAgJ1xcdTAyNUInOiAnZScsXHJcbiAgICAnXFx1MDFERCc6ICdlJyxcclxuICAgICdcXHUyNEQ1JzogJ2YnLFxyXG4gICAgJ1xcdUZGNDYnOiAnZicsXHJcbiAgICAnXFx1MUUxRic6ICdmJyxcclxuICAgICdcXHUwMTkyJzogJ2YnLFxyXG4gICAgJ1xcdUE3N0MnOiAnZicsXHJcbiAgICAnXFx1MjRENic6ICdnJyxcclxuICAgICdcXHVGRjQ3JzogJ2cnLFxyXG4gICAgJ1xcdTAxRjUnOiAnZycsXHJcbiAgICAnXFx1MDExRCc6ICdnJyxcclxuICAgICdcXHUxRTIxJzogJ2cnLFxyXG4gICAgJ1xcdTAxMUYnOiAnZycsXHJcbiAgICAnXFx1MDEyMSc6ICdnJyxcclxuICAgICdcXHUwMUU3JzogJ2cnLFxyXG4gICAgJ1xcdTAxMjMnOiAnZycsXHJcbiAgICAnXFx1MDFFNSc6ICdnJyxcclxuICAgICdcXHUwMjYwJzogJ2cnLFxyXG4gICAgJ1xcdUE3QTEnOiAnZycsXHJcbiAgICAnXFx1MUQ3OSc6ICdnJyxcclxuICAgICdcXHVBNzdGJzogJ2cnLFxyXG4gICAgJ1xcdTI0RDcnOiAnaCcsXHJcbiAgICAnXFx1RkY0OCc6ICdoJyxcclxuICAgICdcXHUwMTI1JzogJ2gnLFxyXG4gICAgJ1xcdTFFMjMnOiAnaCcsXHJcbiAgICAnXFx1MUUyNyc6ICdoJyxcclxuICAgICdcXHUwMjFGJzogJ2gnLFxyXG4gICAgJ1xcdTFFMjUnOiAnaCcsXHJcbiAgICAnXFx1MUUyOSc6ICdoJyxcclxuICAgICdcXHUxRTJCJzogJ2gnLFxyXG4gICAgJ1xcdTFFOTYnOiAnaCcsXHJcbiAgICAnXFx1MDEyNyc6ICdoJyxcclxuICAgICdcXHUyQzY4JzogJ2gnLFxyXG4gICAgJ1xcdTJDNzYnOiAnaCcsXHJcbiAgICAnXFx1MDI2NSc6ICdoJyxcclxuICAgICdcXHUwMTk1JzogJ2h2JyxcclxuICAgICdcXHUyNEQ4JzogJ2knLFxyXG4gICAgJ1xcdUZGNDknOiAnaScsXHJcbiAgICAnXFx1MDBFQyc6ICdpJyxcclxuICAgICdcXHUwMEVEJzogJ2knLFxyXG4gICAgJ1xcdTAwRUUnOiAnaScsXHJcbiAgICAnXFx1MDEyOSc6ICdpJyxcclxuICAgICdcXHUwMTJCJzogJ2knLFxyXG4gICAgJ1xcdTAxMkQnOiAnaScsXHJcbiAgICAnXFx1MDBFRic6ICdpJyxcclxuICAgICdcXHUxRTJGJzogJ2knLFxyXG4gICAgJ1xcdTFFQzknOiAnaScsXHJcbiAgICAnXFx1MDFEMCc6ICdpJyxcclxuICAgICdcXHUwMjA5JzogJ2knLFxyXG4gICAgJ1xcdTAyMEInOiAnaScsXHJcbiAgICAnXFx1MUVDQic6ICdpJyxcclxuICAgICdcXHUwMTJGJzogJ2knLFxyXG4gICAgJ1xcdTFFMkQnOiAnaScsXHJcbiAgICAnXFx1MDI2OCc6ICdpJyxcclxuICAgICdcXHUwMTMxJzogJ2knLFxyXG4gICAgJ1xcdTI0RDknOiAnaicsXHJcbiAgICAnXFx1RkY0QSc6ICdqJyxcclxuICAgICdcXHUwMTM1JzogJ2onLFxyXG4gICAgJ1xcdTAxRjAnOiAnaicsXHJcbiAgICAnXFx1MDI0OSc6ICdqJyxcclxuICAgICdcXHUyNERBJzogJ2snLFxyXG4gICAgJ1xcdUZGNEInOiAnaycsXHJcbiAgICAnXFx1MUUzMSc6ICdrJyxcclxuICAgICdcXHUwMUU5JzogJ2snLFxyXG4gICAgJ1xcdTFFMzMnOiAnaycsXHJcbiAgICAnXFx1MDEzNyc6ICdrJyxcclxuICAgICdcXHUxRTM1JzogJ2snLFxyXG4gICAgJ1xcdTAxOTknOiAnaycsXHJcbiAgICAnXFx1MkM2QSc6ICdrJyxcclxuICAgICdcXHVBNzQxJzogJ2snLFxyXG4gICAgJ1xcdUE3NDMnOiAnaycsXHJcbiAgICAnXFx1QTc0NSc6ICdrJyxcclxuICAgICdcXHVBN0EzJzogJ2snLFxyXG4gICAgJ1xcdTI0REInOiAnbCcsXHJcbiAgICAnXFx1RkY0Qyc6ICdsJyxcclxuICAgICdcXHUwMTQwJzogJ2wnLFxyXG4gICAgJ1xcdTAxM0EnOiAnbCcsXHJcbiAgICAnXFx1MDEzRSc6ICdsJyxcclxuICAgICdcXHUxRTM3JzogJ2wnLFxyXG4gICAgJ1xcdTFFMzknOiAnbCcsXHJcbiAgICAnXFx1MDEzQyc6ICdsJyxcclxuICAgICdcXHUxRTNEJzogJ2wnLFxyXG4gICAgJ1xcdTFFM0InOiAnbCcsXHJcbiAgICAnXFx1MDE3Ric6ICdsJyxcclxuICAgICdcXHUwMTQyJzogJ2wnLFxyXG4gICAgJ1xcdTAxOUEnOiAnbCcsXHJcbiAgICAnXFx1MDI2Qic6ICdsJyxcclxuICAgICdcXHUyQzYxJzogJ2wnLFxyXG4gICAgJ1xcdUE3NDknOiAnbCcsXHJcbiAgICAnXFx1QTc4MSc6ICdsJyxcclxuICAgICdcXHVBNzQ3JzogJ2wnLFxyXG4gICAgJ1xcdTAxQzknOiAnbGonLFxyXG4gICAgJ1xcdTI0REMnOiAnbScsXHJcbiAgICAnXFx1RkY0RCc6ICdtJyxcclxuICAgICdcXHUxRTNGJzogJ20nLFxyXG4gICAgJ1xcdTFFNDEnOiAnbScsXHJcbiAgICAnXFx1MUU0Myc6ICdtJyxcclxuICAgICdcXHUwMjcxJzogJ20nLFxyXG4gICAgJ1xcdTAyNkYnOiAnbScsXHJcbiAgICAnXFx1MjRERCc6ICduJyxcclxuICAgICdcXHVGRjRFJzogJ24nLFxyXG4gICAgJ1xcdTAxRjknOiAnbicsXHJcbiAgICAnXFx1MDE0NCc6ICduJyxcclxuICAgICdcXHUwMEYxJzogJ24nLFxyXG4gICAgJ1xcdTFFNDUnOiAnbicsXHJcbiAgICAnXFx1MDE0OCc6ICduJyxcclxuICAgICdcXHUxRTQ3JzogJ24nLFxyXG4gICAgJ1xcdTAxNDYnOiAnbicsXHJcbiAgICAnXFx1MUU0Qic6ICduJyxcclxuICAgICdcXHUxRTQ5JzogJ24nLFxyXG4gICAgJ1xcdTAxOUUnOiAnbicsXHJcbiAgICAnXFx1MDI3Mic6ICduJyxcclxuICAgICdcXHUwMTQ5JzogJ24nLFxyXG4gICAgJ1xcdUE3OTEnOiAnbicsXHJcbiAgICAnXFx1QTdBNSc6ICduJyxcclxuICAgICdcXHUwMUNDJzogJ25qJyxcclxuICAgICdcXHUyNERFJzogJ28nLFxyXG4gICAgJ1xcdUZGNEYnOiAnbycsXHJcbiAgICAnXFx1MDBGMic6ICdvJyxcclxuICAgICdcXHUwMEYzJzogJ28nLFxyXG4gICAgJ1xcdTAwRjQnOiAnbycsXHJcbiAgICAnXFx1MUVEMyc6ICdvJyxcclxuICAgICdcXHUxRUQxJzogJ28nLFxyXG4gICAgJ1xcdTFFRDcnOiAnbycsXHJcbiAgICAnXFx1MUVENSc6ICdvJyxcclxuICAgICdcXHUwMEY1JzogJ28nLFxyXG4gICAgJ1xcdTFFNEQnOiAnbycsXHJcbiAgICAnXFx1MDIyRCc6ICdvJyxcclxuICAgICdcXHUxRTRGJzogJ28nLFxyXG4gICAgJ1xcdTAxNEQnOiAnbycsXHJcbiAgICAnXFx1MUU1MSc6ICdvJyxcclxuICAgICdcXHUxRTUzJzogJ28nLFxyXG4gICAgJ1xcdTAxNEYnOiAnbycsXHJcbiAgICAnXFx1MDIyRic6ICdvJyxcclxuICAgICdcXHUwMjMxJzogJ28nLFxyXG4gICAgJ1xcdTAwRjYnOiAnbycsXHJcbiAgICAnXFx1MDIyQic6ICdvJyxcclxuICAgICdcXHUxRUNGJzogJ28nLFxyXG4gICAgJ1xcdTAxNTEnOiAnbycsXHJcbiAgICAnXFx1MDFEMic6ICdvJyxcclxuICAgICdcXHUwMjBEJzogJ28nLFxyXG4gICAgJ1xcdTAyMEYnOiAnbycsXHJcbiAgICAnXFx1MDFBMSc6ICdvJyxcclxuICAgICdcXHUxRUREJzogJ28nLFxyXG4gICAgJ1xcdTFFREInOiAnbycsXHJcbiAgICAnXFx1MUVFMSc6ICdvJyxcclxuICAgICdcXHUxRURGJzogJ28nLFxyXG4gICAgJ1xcdTFFRTMnOiAnbycsXHJcbiAgICAnXFx1MUVDRCc6ICdvJyxcclxuICAgICdcXHUxRUQ5JzogJ28nLFxyXG4gICAgJ1xcdTAxRUInOiAnbycsXHJcbiAgICAnXFx1MDFFRCc6ICdvJyxcclxuICAgICdcXHUwMEY4JzogJ28nLFxyXG4gICAgJ1xcdTAxRkYnOiAnbycsXHJcbiAgICAnXFx1MDI1NCc6ICdvJyxcclxuICAgICdcXHVBNzRCJzogJ28nLFxyXG4gICAgJ1xcdUE3NEQnOiAnbycsXHJcbiAgICAnXFx1MDI3NSc6ICdvJyxcclxuICAgICdcXHUwMUEzJzogJ29pJyxcclxuICAgICdcXHUwMjIzJzogJ291JyxcclxuICAgICdcXHVBNzRGJzogJ29vJyxcclxuICAgICdcXHUyNERGJzogJ3AnLFxyXG4gICAgJ1xcdUZGNTAnOiAncCcsXHJcbiAgICAnXFx1MUU1NSc6ICdwJyxcclxuICAgICdcXHUxRTU3JzogJ3AnLFxyXG4gICAgJ1xcdTAxQTUnOiAncCcsXHJcbiAgICAnXFx1MUQ3RCc6ICdwJyxcclxuICAgICdcXHVBNzUxJzogJ3AnLFxyXG4gICAgJ1xcdUE3NTMnOiAncCcsXHJcbiAgICAnXFx1QTc1NSc6ICdwJyxcclxuICAgICdcXHUyNEUwJzogJ3EnLFxyXG4gICAgJ1xcdUZGNTEnOiAncScsXHJcbiAgICAnXFx1MDI0Qic6ICdxJyxcclxuICAgICdcXHVBNzU3JzogJ3EnLFxyXG4gICAgJ1xcdUE3NTknOiAncScsXHJcbiAgICAnXFx1MjRFMSc6ICdyJyxcclxuICAgICdcXHVGRjUyJzogJ3InLFxyXG4gICAgJ1xcdTAxNTUnOiAncicsXHJcbiAgICAnXFx1MUU1OSc6ICdyJyxcclxuICAgICdcXHUwMTU5JzogJ3InLFxyXG4gICAgJ1xcdTAyMTEnOiAncicsXHJcbiAgICAnXFx1MDIxMyc6ICdyJyxcclxuICAgICdcXHUxRTVCJzogJ3InLFxyXG4gICAgJ1xcdTFFNUQnOiAncicsXHJcbiAgICAnXFx1MDE1Nyc6ICdyJyxcclxuICAgICdcXHUxRTVGJzogJ3InLFxyXG4gICAgJ1xcdTAyNEQnOiAncicsXHJcbiAgICAnXFx1MDI3RCc6ICdyJyxcclxuICAgICdcXHVBNzVCJzogJ3InLFxyXG4gICAgJ1xcdUE3QTcnOiAncicsXHJcbiAgICAnXFx1QTc4Myc6ICdyJyxcclxuICAgICdcXHUyNEUyJzogJ3MnLFxyXG4gICAgJ1xcdUZGNTMnOiAncycsXHJcbiAgICAnXFx1MDBERic6ICdzJyxcclxuICAgICdcXHUwMTVCJzogJ3MnLFxyXG4gICAgJ1xcdTFFNjUnOiAncycsXHJcbiAgICAnXFx1MDE1RCc6ICdzJyxcclxuICAgICdcXHUxRTYxJzogJ3MnLFxyXG4gICAgJ1xcdTAxNjEnOiAncycsXHJcbiAgICAnXFx1MUU2Nyc6ICdzJyxcclxuICAgICdcXHUxRTYzJzogJ3MnLFxyXG4gICAgJ1xcdTFFNjknOiAncycsXHJcbiAgICAnXFx1MDIxOSc6ICdzJyxcclxuICAgICdcXHUwMTVGJzogJ3MnLFxyXG4gICAgJ1xcdTAyM0YnOiAncycsXHJcbiAgICAnXFx1QTdBOSc6ICdzJyxcclxuICAgICdcXHVBNzg1JzogJ3MnLFxyXG4gICAgJ1xcdTFFOUInOiAncycsXHJcbiAgICAnXFx1MjRFMyc6ICd0JyxcclxuICAgICdcXHVGRjU0JzogJ3QnLFxyXG4gICAgJ1xcdTFFNkInOiAndCcsXHJcbiAgICAnXFx1MUU5Nyc6ICd0JyxcclxuICAgICdcXHUwMTY1JzogJ3QnLFxyXG4gICAgJ1xcdTFFNkQnOiAndCcsXHJcbiAgICAnXFx1MDIxQic6ICd0JyxcclxuICAgICdcXHUwMTYzJzogJ3QnLFxyXG4gICAgJ1xcdTFFNzEnOiAndCcsXHJcbiAgICAnXFx1MUU2Ric6ICd0JyxcclxuICAgICdcXHUwMTY3JzogJ3QnLFxyXG4gICAgJ1xcdTAxQUQnOiAndCcsXHJcbiAgICAnXFx1MDI4OCc6ICd0JyxcclxuICAgICdcXHUyQzY2JzogJ3QnLFxyXG4gICAgJ1xcdUE3ODcnOiAndCcsXHJcbiAgICAnXFx1QTcyOSc6ICd0eicsXHJcbiAgICAnXFx1MjRFNCc6ICd1JyxcclxuICAgICdcXHVGRjU1JzogJ3UnLFxyXG4gICAgJ1xcdTAwRjknOiAndScsXHJcbiAgICAnXFx1MDBGQSc6ICd1JyxcclxuICAgICdcXHUwMEZCJzogJ3UnLFxyXG4gICAgJ1xcdTAxNjknOiAndScsXHJcbiAgICAnXFx1MUU3OSc6ICd1JyxcclxuICAgICdcXHUwMTZCJzogJ3UnLFxyXG4gICAgJ1xcdTFFN0InOiAndScsXHJcbiAgICAnXFx1MDE2RCc6ICd1JyxcclxuICAgICdcXHUwMEZDJzogJ3UnLFxyXG4gICAgJ1xcdTAxREMnOiAndScsXHJcbiAgICAnXFx1MDFEOCc6ICd1JyxcclxuICAgICdcXHUwMUQ2JzogJ3UnLFxyXG4gICAgJ1xcdTAxREEnOiAndScsXHJcbiAgICAnXFx1MUVFNyc6ICd1JyxcclxuICAgICdcXHUwMTZGJzogJ3UnLFxyXG4gICAgJ1xcdTAxNzEnOiAndScsXHJcbiAgICAnXFx1MDFENCc6ICd1JyxcclxuICAgICdcXHUwMjE1JzogJ3UnLFxyXG4gICAgJ1xcdTAyMTcnOiAndScsXHJcbiAgICAnXFx1MDFCMCc6ICd1JyxcclxuICAgICdcXHUxRUVCJzogJ3UnLFxyXG4gICAgJ1xcdTFFRTknOiAndScsXHJcbiAgICAnXFx1MUVFRic6ICd1JyxcclxuICAgICdcXHUxRUVEJzogJ3UnLFxyXG4gICAgJ1xcdTFFRjEnOiAndScsXHJcbiAgICAnXFx1MUVFNSc6ICd1JyxcclxuICAgICdcXHUxRTczJzogJ3UnLFxyXG4gICAgJ1xcdTAxNzMnOiAndScsXHJcbiAgICAnXFx1MUU3Nyc6ICd1JyxcclxuICAgICdcXHUxRTc1JzogJ3UnLFxyXG4gICAgJ1xcdTAyODknOiAndScsXHJcbiAgICAnXFx1MjRFNSc6ICd2JyxcclxuICAgICdcXHVGRjU2JzogJ3YnLFxyXG4gICAgJ1xcdTFFN0QnOiAndicsXHJcbiAgICAnXFx1MUU3Ric6ICd2JyxcclxuICAgICdcXHUwMjhCJzogJ3YnLFxyXG4gICAgJ1xcdUE3NUYnOiAndicsXHJcbiAgICAnXFx1MDI4Qyc6ICd2JyxcclxuICAgICdcXHVBNzYxJzogJ3Z5JyxcclxuICAgICdcXHUyNEU2JzogJ3cnLFxyXG4gICAgJ1xcdUZGNTcnOiAndycsXHJcbiAgICAnXFx1MUU4MSc6ICd3JyxcclxuICAgICdcXHUxRTgzJzogJ3cnLFxyXG4gICAgJ1xcdTAxNzUnOiAndycsXHJcbiAgICAnXFx1MUU4Nyc6ICd3JyxcclxuICAgICdcXHUxRTg1JzogJ3cnLFxyXG4gICAgJ1xcdTFFOTgnOiAndycsXHJcbiAgICAnXFx1MUU4OSc6ICd3JyxcclxuICAgICdcXHUyQzczJzogJ3cnLFxyXG4gICAgJ1xcdTI0RTcnOiAneCcsXHJcbiAgICAnXFx1RkY1OCc6ICd4JyxcclxuICAgICdcXHUxRThCJzogJ3gnLFxyXG4gICAgJ1xcdTFFOEQnOiAneCcsXHJcbiAgICAnXFx1MjRFOCc6ICd5JyxcclxuICAgICdcXHVGRjU5JzogJ3knLFxyXG4gICAgJ1xcdTFFRjMnOiAneScsXHJcbiAgICAnXFx1MDBGRCc6ICd5JyxcclxuICAgICdcXHUwMTc3JzogJ3knLFxyXG4gICAgJ1xcdTFFRjknOiAneScsXHJcbiAgICAnXFx1MDIzMyc6ICd5JyxcclxuICAgICdcXHUxRThGJzogJ3knLFxyXG4gICAgJ1xcdTAwRkYnOiAneScsXHJcbiAgICAnXFx1MUVGNyc6ICd5JyxcclxuICAgICdcXHUxRTk5JzogJ3knLFxyXG4gICAgJ1xcdTFFRjUnOiAneScsXHJcbiAgICAnXFx1MDFCNCc6ICd5JyxcclxuICAgICdcXHUwMjRGJzogJ3knLFxyXG4gICAgJ1xcdTFFRkYnOiAneScsXHJcbiAgICAnXFx1MjRFOSc6ICd6JyxcclxuICAgICdcXHVGRjVBJzogJ3onLFxyXG4gICAgJ1xcdTAxN0EnOiAneicsXHJcbiAgICAnXFx1MUU5MSc6ICd6JyxcclxuICAgICdcXHUwMTdDJzogJ3onLFxyXG4gICAgJ1xcdTAxN0UnOiAneicsXHJcbiAgICAnXFx1MUU5Myc6ICd6JyxcclxuICAgICdcXHUxRTk1JzogJ3onLFxyXG4gICAgJ1xcdTAxQjYnOiAneicsXHJcbiAgICAnXFx1MDIyNSc6ICd6JyxcclxuICAgICdcXHUwMjQwJzogJ3onLFxyXG4gICAgJ1xcdTJDNkMnOiAneicsXHJcbiAgICAnXFx1QTc2Myc6ICd6JyxcclxuICAgICdcXHUwMzg2JzogJ1xcdTAzOTEnLFxyXG4gICAgJ1xcdTAzODgnOiAnXFx1MDM5NScsXHJcbiAgICAnXFx1MDM4OSc6ICdcXHUwMzk3JyxcclxuICAgICdcXHUwMzhBJzogJ1xcdTAzOTknLFxyXG4gICAgJ1xcdTAzQUEnOiAnXFx1MDM5OScsXHJcbiAgICAnXFx1MDM4Qyc6ICdcXHUwMzlGJyxcclxuICAgICdcXHUwMzhFJzogJ1xcdTAzQTUnLFxyXG4gICAgJ1xcdTAzQUInOiAnXFx1MDNBNScsXHJcbiAgICAnXFx1MDM4Ric6ICdcXHUwM0E5JyxcclxuICAgICdcXHUwM0FDJzogJ1xcdTAzQjEnLFxyXG4gICAgJ1xcdTAzQUQnOiAnXFx1MDNCNScsXHJcbiAgICAnXFx1MDNBRSc6ICdcXHUwM0I3JyxcclxuICAgICdcXHUwM0FGJzogJ1xcdTAzQjknLFxyXG4gICAgJ1xcdTAzQ0EnOiAnXFx1MDNCOScsXHJcbiAgICAnXFx1MDM5MCc6ICdcXHUwM0I5JyxcclxuICAgICdcXHUwM0NDJzogJ1xcdTAzQkYnLFxyXG4gICAgJ1xcdTAzQ0QnOiAnXFx1MDNDNScsXHJcbiAgICAnXFx1MDNDQic6ICdcXHUwM0M1JyxcclxuICAgICdcXHUwM0IwJzogJ1xcdTAzQzUnLFxyXG4gICAgJ1xcdTAzQzknOiAnXFx1MDNDOScsXHJcbiAgICAnXFx1MDNDMic6ICdcXHUwM0MzJ1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBkaWFjcml0aWNzO1xyXG59KTtcclxuXHJcblMyLmRlZmluZSgnc2VsZWN0Mi9kYXRhL2Jhc2UnLFtcclxuICAnLi4vdXRpbHMnXHJcbl0sIGZ1bmN0aW9uIChVdGlscykge1xyXG4gIGZ1bmN0aW9uIEJhc2VBZGFwdGVyICgkZWxlbWVudCwgb3B0aW9ucykge1xyXG4gICAgQmFzZUFkYXB0ZXIuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcyk7XHJcbiAgfVxyXG5cclxuICBVdGlscy5FeHRlbmQoQmFzZUFkYXB0ZXIsIFV0aWxzLk9ic2VydmFibGUpO1xyXG5cclxuICBCYXNlQWRhcHRlci5wcm90b3R5cGUuY3VycmVudCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgYGN1cnJlbnRgIG1ldGhvZCBtdXN0IGJlIGRlZmluZWQgaW4gY2hpbGQgY2xhc3Nlcy4nKTtcclxuICB9O1xyXG5cclxuICBCYXNlQWRhcHRlci5wcm90b3R5cGUucXVlcnkgPSBmdW5jdGlvbiAocGFyYW1zLCBjYWxsYmFjaykge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgYHF1ZXJ5YCBtZXRob2QgbXVzdCBiZSBkZWZpbmVkIGluIGNoaWxkIGNsYXNzZXMuJyk7XHJcbiAgfTtcclxuXHJcbiAgQmFzZUFkYXB0ZXIucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoY29udGFpbmVyLCAkY29udGFpbmVyKSB7XHJcbiAgICAvLyBDYW4gYmUgaW1wbGVtZW50ZWQgaW4gc3ViY2xhc3Nlc1xyXG4gIH07XHJcblxyXG4gIEJhc2VBZGFwdGVyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gQ2FuIGJlIGltcGxlbWVudGVkIGluIHN1YmNsYXNzZXNcclxuICB9O1xyXG5cclxuICBCYXNlQWRhcHRlci5wcm90b3R5cGUuZ2VuZXJhdGVSZXN1bHRJZCA9IGZ1bmN0aW9uIChjb250YWluZXIsIGRhdGEpIHtcclxuICAgIHZhciBpZCA9IGNvbnRhaW5lci5pZCArICctcmVzdWx0LSc7XHJcblxyXG4gICAgaWQgKz0gVXRpbHMuZ2VuZXJhdGVDaGFycyg0KTtcclxuXHJcbiAgICBpZiAoZGF0YS5pZCAhPSBudWxsKSB7XHJcbiAgICAgIGlkICs9ICctJyArIGRhdGEuaWQudG9TdHJpbmcoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlkICs9ICctJyArIFV0aWxzLmdlbmVyYXRlQ2hhcnMoNCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaWQ7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIEJhc2VBZGFwdGVyO1xyXG59KTtcclxuXHJcblMyLmRlZmluZSgnc2VsZWN0Mi9kYXRhL3NlbGVjdCcsW1xyXG4gICcuL2Jhc2UnLFxyXG4gICcuLi91dGlscycsXHJcbiAgJ2pxdWVyeSdcclxuXSwgZnVuY3Rpb24gKEJhc2VBZGFwdGVyLCBVdGlscywgJCkge1xyXG4gIGZ1bmN0aW9uIFNlbGVjdEFkYXB0ZXIgKCRlbGVtZW50LCBvcHRpb25zKSB7XHJcbiAgICB0aGlzLiRlbGVtZW50ID0gJGVsZW1lbnQ7XHJcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xyXG5cclxuICAgIFNlbGVjdEFkYXB0ZXIuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcyk7XHJcbiAgfVxyXG5cclxuICBVdGlscy5FeHRlbmQoU2VsZWN0QWRhcHRlciwgQmFzZUFkYXB0ZXIpO1xyXG5cclxuICBTZWxlY3RBZGFwdGVyLnByb3RvdHlwZS5jdXJyZW50ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgZGF0YSA9IFtdO1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHRoaXMuJGVsZW1lbnQuZmluZCgnOnNlbGVjdGVkJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciAkb3B0aW9uID0gJCh0aGlzKTtcclxuXHJcbiAgICAgIHZhciBvcHRpb24gPSBzZWxmLml0ZW0oJG9wdGlvbik7XHJcblxyXG4gICAgICBkYXRhLnB1c2gob3B0aW9uKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNhbGxiYWNrKGRhdGEpO1xyXG4gIH07XHJcblxyXG4gIFNlbGVjdEFkYXB0ZXIucHJvdG90eXBlLnNlbGVjdCA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgZGF0YS5zZWxlY3RlZCA9IHRydWU7XHJcblxyXG4gICAgLy8gSWYgZGF0YS5lbGVtZW50IGlzIGEgRE9NIG5vZGUsIHVzZSBpdCBpbnN0ZWFkXHJcbiAgICBpZiAoJChkYXRhLmVsZW1lbnQpLmlzKCdvcHRpb24nKSkge1xyXG4gICAgICBkYXRhLmVsZW1lbnQuc2VsZWN0ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2UnKTtcclxuXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy4kZWxlbWVudC5wcm9wKCdtdWx0aXBsZScpKSB7XHJcbiAgICAgIHRoaXMuY3VycmVudChmdW5jdGlvbiAoY3VycmVudERhdGEpIHtcclxuICAgICAgICB2YXIgdmFsID0gW107XHJcblxyXG4gICAgICAgIGRhdGEgPSBbZGF0YV07XHJcbiAgICAgICAgZGF0YS5wdXNoLmFwcGx5KGRhdGEsIGN1cnJlbnREYXRhKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgZCA9IDA7IGQgPCBkYXRhLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgICAgICB2YXIgaWQgPSBkYXRhW2RdLmlkO1xyXG5cclxuICAgICAgICAgIGlmICgkLmluQXJyYXkoaWQsIHZhbCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgIHZhbC5wdXNoKGlkKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlbGYuJGVsZW1lbnQudmFsKHZhbCk7XHJcbiAgICAgICAgc2VsZi4kZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2UnKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgdmFsID0gZGF0YS5pZDtcclxuXHJcbiAgICAgIHRoaXMuJGVsZW1lbnQudmFsKHZhbCk7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignY2hhbmdlJyk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgU2VsZWN0QWRhcHRlci5wcm90b3R5cGUudW5zZWxlY3QgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIGlmICghdGhpcy4kZWxlbWVudC5wcm9wKCdtdWx0aXBsZScpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBkYXRhLnNlbGVjdGVkID0gZmFsc2U7XHJcblxyXG4gICAgaWYgKCQoZGF0YS5lbGVtZW50KS5pcygnb3B0aW9uJykpIHtcclxuICAgICAgZGF0YS5lbGVtZW50LnNlbGVjdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2NoYW5nZScpO1xyXG5cclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY3VycmVudChmdW5jdGlvbiAoY3VycmVudERhdGEpIHtcclxuICAgICAgdmFyIHZhbCA9IFtdO1xyXG5cclxuICAgICAgZm9yICh2YXIgZCA9IDA7IGQgPCBjdXJyZW50RGF0YS5sZW5ndGg7IGQrKykge1xyXG4gICAgICAgIHZhciBpZCA9IGN1cnJlbnREYXRhW2RdLmlkO1xyXG5cclxuICAgICAgICBpZiAoaWQgIT09IGRhdGEuaWQgJiYgJC5pbkFycmF5KGlkLCB2YWwpID09PSAtMSkge1xyXG4gICAgICAgICAgdmFsLnB1c2goaWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgc2VsZi4kZWxlbWVudC52YWwodmFsKTtcclxuXHJcbiAgICAgIHNlbGYuJGVsZW1lbnQudHJpZ2dlcignY2hhbmdlJyk7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBTZWxlY3RBZGFwdGVyLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG5cclxuICAgIGNvbnRhaW5lci5vbignc2VsZWN0JywgZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICBzZWxmLnNlbGVjdChwYXJhbXMuZGF0YSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ3Vuc2VsZWN0JywgZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICBzZWxmLnVuc2VsZWN0KHBhcmFtcy5kYXRhKTtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIFNlbGVjdEFkYXB0ZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyBSZW1vdmUgYW55dGhpbmcgYWRkZWQgdG8gY2hpbGQgZWxlbWVudHNcclxuICAgIHRoaXMuJGVsZW1lbnQuZmluZCgnKicpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAvLyBSZW1vdmUgYW55IGN1c3RvbSBkYXRhIHNldCBieSBTZWxlY3QyXHJcbiAgICAgICQucmVtb3ZlRGF0YSh0aGlzLCAnZGF0YScpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgU2VsZWN0QWRhcHRlci5wcm90b3R5cGUucXVlcnkgPSBmdW5jdGlvbiAocGFyYW1zLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIGRhdGEgPSBbXTtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICB2YXIgJG9wdGlvbnMgPSB0aGlzLiRlbGVtZW50LmNoaWxkcmVuKCk7XHJcblxyXG4gICAgJG9wdGlvbnMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciAkb3B0aW9uID0gJCh0aGlzKTtcclxuXHJcbiAgICAgIGlmICghJG9wdGlvbi5pcygnb3B0aW9uJykgJiYgISRvcHRpb24uaXMoJ29wdGdyb3VwJykpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBvcHRpb24gPSBzZWxmLml0ZW0oJG9wdGlvbik7XHJcblxyXG4gICAgICB2YXIgbWF0Y2hlcyA9IHNlbGYubWF0Y2hlcyhwYXJhbXMsIG9wdGlvbik7XHJcblxyXG4gICAgICBpZiAobWF0Y2hlcyAhPT0gbnVsbCkge1xyXG4gICAgICAgIGRhdGEucHVzaChtYXRjaGVzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgY2FsbGJhY2soe1xyXG4gICAgICByZXN1bHRzOiBkYXRhXHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBTZWxlY3RBZGFwdGVyLnByb3RvdHlwZS5hZGRPcHRpb25zID0gZnVuY3Rpb24gKCRvcHRpb25zKSB7XHJcbiAgICBVdGlscy5hcHBlbmRNYW55KHRoaXMuJGVsZW1lbnQsICRvcHRpb25zKTtcclxuICB9O1xyXG5cclxuICBTZWxlY3RBZGFwdGVyLnByb3RvdHlwZS5vcHRpb24gPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgdmFyIG9wdGlvbjtcclxuXHJcbiAgICBpZiAoZGF0YS5jaGlsZHJlbikge1xyXG4gICAgICBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRncm91cCcpO1xyXG4gICAgICBvcHRpb24ubGFiZWwgPSBkYXRhLnRleHQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuXHJcbiAgICAgIGlmIChvcHRpb24udGV4dENvbnRlbnQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIG9wdGlvbi50ZXh0Q29udGVudCA9IGRhdGEudGV4dDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvcHRpb24uaW5uZXJUZXh0ID0gZGF0YS50ZXh0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRhdGEuaWQpIHtcclxuICAgICAgb3B0aW9uLnZhbHVlID0gZGF0YS5pZDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZGF0YS5kaXNhYmxlZCkge1xyXG4gICAgICBvcHRpb24uZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkYXRhLnNlbGVjdGVkKSB7XHJcbiAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRhdGEudGl0bGUpIHtcclxuICAgICAgb3B0aW9uLnRpdGxlID0gZGF0YS50aXRsZTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgJG9wdGlvbiA9ICQob3B0aW9uKTtcclxuXHJcbiAgICB2YXIgbm9ybWFsaXplZERhdGEgPSB0aGlzLl9ub3JtYWxpemVJdGVtKGRhdGEpO1xyXG4gICAgbm9ybWFsaXplZERhdGEuZWxlbWVudCA9IG9wdGlvbjtcclxuXHJcbiAgICAvLyBPdmVycmlkZSB0aGUgb3B0aW9uJ3MgZGF0YSB3aXRoIHRoZSBjb21iaW5lZCBkYXRhXHJcbiAgICAkLmRhdGEob3B0aW9uLCAnZGF0YScsIG5vcm1hbGl6ZWREYXRhKTtcclxuXHJcbiAgICByZXR1cm4gJG9wdGlvbjtcclxuICB9O1xyXG5cclxuICBTZWxlY3RBZGFwdGVyLnByb3RvdHlwZS5pdGVtID0gZnVuY3Rpb24gKCRvcHRpb24pIHtcclxuICAgIHZhciBkYXRhID0ge307XHJcblxyXG4gICAgZGF0YSA9ICQuZGF0YSgkb3B0aW9uWzBdLCAnZGF0YScpO1xyXG5cclxuICAgIGlmIChkYXRhICE9IG51bGwpIHtcclxuICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCRvcHRpb24uaXMoJ29wdGlvbicpKSB7XHJcbiAgICAgIGRhdGEgPSB7XHJcbiAgICAgICAgaWQ6ICRvcHRpb24udmFsKCksXHJcbiAgICAgICAgdGV4dDogJG9wdGlvbi50ZXh0KCksXHJcbiAgICAgICAgZGlzYWJsZWQ6ICRvcHRpb24ucHJvcCgnZGlzYWJsZWQnKSxcclxuICAgICAgICBzZWxlY3RlZDogJG9wdGlvbi5wcm9wKCdzZWxlY3RlZCcpLFxyXG4gICAgICAgIHRpdGxlOiAkb3B0aW9uLnByb3AoJ3RpdGxlJylcclxuICAgICAgfTtcclxuICAgIH0gZWxzZSBpZiAoJG9wdGlvbi5pcygnb3B0Z3JvdXAnKSkge1xyXG4gICAgICBkYXRhID0ge1xyXG4gICAgICAgIHRleHQ6ICRvcHRpb24ucHJvcCgnbGFiZWwnKSxcclxuICAgICAgICBjaGlsZHJlbjogW10sXHJcbiAgICAgICAgdGl0bGU6ICRvcHRpb24ucHJvcCgndGl0bGUnKVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgdmFyICRjaGlsZHJlbiA9ICRvcHRpb24uY2hpbGRyZW4oJ29wdGlvbicpO1xyXG4gICAgICB2YXIgY2hpbGRyZW4gPSBbXTtcclxuXHJcbiAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgJGNoaWxkcmVuLmxlbmd0aDsgYysrKSB7XHJcbiAgICAgICAgdmFyICRjaGlsZCA9ICQoJGNoaWxkcmVuW2NdKTtcclxuXHJcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5pdGVtKCRjaGlsZCk7XHJcblxyXG4gICAgICAgIGNoaWxkcmVuLnB1c2goY2hpbGQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkYXRhLmNoaWxkcmVuID0gY2hpbGRyZW47XHJcbiAgICB9XHJcblxyXG4gICAgZGF0YSA9IHRoaXMuX25vcm1hbGl6ZUl0ZW0oZGF0YSk7XHJcbiAgICBkYXRhLmVsZW1lbnQgPSAkb3B0aW9uWzBdO1xyXG5cclxuICAgICQuZGF0YSgkb3B0aW9uWzBdLCAnZGF0YScsIGRhdGEpO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH07XHJcblxyXG4gIFNlbGVjdEFkYXB0ZXIucHJvdG90eXBlLl9ub3JtYWxpemVJdGVtID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgIGlmICghJC5pc1BsYWluT2JqZWN0KGl0ZW0pKSB7XHJcbiAgICAgIGl0ZW0gPSB7XHJcbiAgICAgICAgaWQ6IGl0ZW0sXHJcbiAgICAgICAgdGV4dDogaXRlbVxyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGl0ZW0gPSAkLmV4dGVuZCh7fSwge1xyXG4gICAgICB0ZXh0OiAnJ1xyXG4gICAgfSwgaXRlbSk7XHJcblxyXG4gICAgdmFyIGRlZmF1bHRzID0ge1xyXG4gICAgICBzZWxlY3RlZDogZmFsc2UsXHJcbiAgICAgIGRpc2FibGVkOiBmYWxzZVxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoaXRlbS5pZCAhPSBudWxsKSB7XHJcbiAgICAgIGl0ZW0uaWQgPSBpdGVtLmlkLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGl0ZW0udGV4dCAhPSBudWxsKSB7XHJcbiAgICAgIGl0ZW0udGV4dCA9IGl0ZW0udGV4dC50b1N0cmluZygpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpdGVtLl9yZXN1bHRJZCA9PSBudWxsICYmIGl0ZW0uaWQgJiYgdGhpcy5jb250YWluZXIgIT0gbnVsbCkge1xyXG4gICAgICBpdGVtLl9yZXN1bHRJZCA9IHRoaXMuZ2VuZXJhdGVSZXN1bHRJZCh0aGlzLmNvbnRhaW5lciwgaXRlbSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuICQuZXh0ZW5kKHt9LCBkZWZhdWx0cywgaXRlbSk7XHJcbiAgfTtcclxuXHJcbiAgU2VsZWN0QWRhcHRlci5wcm90b3R5cGUubWF0Y2hlcyA9IGZ1bmN0aW9uIChwYXJhbXMsIGRhdGEpIHtcclxuICAgIHZhciBtYXRjaGVyID0gdGhpcy5vcHRpb25zLmdldCgnbWF0Y2hlcicpO1xyXG5cclxuICAgIHJldHVybiBtYXRjaGVyKHBhcmFtcywgZGF0YSk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIFNlbGVjdEFkYXB0ZXI7XHJcbn0pO1xyXG5cclxuUzIuZGVmaW5lKCdzZWxlY3QyL2RhdGEvYXJyYXknLFtcclxuICAnLi9zZWxlY3QnLFxyXG4gICcuLi91dGlscycsXHJcbiAgJ2pxdWVyeSdcclxuXSwgZnVuY3Rpb24gKFNlbGVjdEFkYXB0ZXIsIFV0aWxzLCAkKSB7XHJcbiAgZnVuY3Rpb24gQXJyYXlBZGFwdGVyICgkZWxlbWVudCwgb3B0aW9ucykge1xyXG4gICAgdmFyIGRhdGEgPSBvcHRpb25zLmdldCgnZGF0YScpIHx8IFtdO1xyXG5cclxuICAgIEFycmF5QWRhcHRlci5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCAkZWxlbWVudCwgb3B0aW9ucyk7XHJcblxyXG4gICAgdGhpcy5hZGRPcHRpb25zKHRoaXMuY29udmVydFRvT3B0aW9ucyhkYXRhKSk7XHJcbiAgfVxyXG5cclxuICBVdGlscy5FeHRlbmQoQXJyYXlBZGFwdGVyLCBTZWxlY3RBZGFwdGVyKTtcclxuXHJcbiAgQXJyYXlBZGFwdGVyLnByb3RvdHlwZS5zZWxlY3QgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgdmFyICRvcHRpb24gPSB0aGlzLiRlbGVtZW50LmZpbmQoJ29wdGlvbicpLmZpbHRlcihmdW5jdGlvbiAoaSwgZWxtKSB7XHJcbiAgICAgIHJldHVybiBlbG0udmFsdWUgPT0gZGF0YS5pZC50b1N0cmluZygpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKCRvcHRpb24ubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICRvcHRpb24gPSB0aGlzLm9wdGlvbihkYXRhKTtcclxuXHJcbiAgICAgIHRoaXMuYWRkT3B0aW9ucygkb3B0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBBcnJheUFkYXB0ZXIuX19zdXBlcl9fLnNlbGVjdC5jYWxsKHRoaXMsIGRhdGEpO1xyXG4gIH07XHJcblxyXG4gIEFycmF5QWRhcHRlci5wcm90b3R5cGUuY29udmVydFRvT3B0aW9ucyA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgdmFyICRleGlzdGluZyA9IHRoaXMuJGVsZW1lbnQuZmluZCgnb3B0aW9uJyk7XHJcbiAgICB2YXIgZXhpc3RpbmdJZHMgPSAkZXhpc3RpbmcubWFwKGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHNlbGYuaXRlbSgkKHRoaXMpKS5pZDtcclxuICAgIH0pLmdldCgpO1xyXG5cclxuICAgIHZhciAkb3B0aW9ucyA9IFtdO1xyXG5cclxuICAgIC8vIEZpbHRlciBvdXQgYWxsIGl0ZW1zIGV4Y2VwdCBmb3IgdGhlIG9uZSBwYXNzZWQgaW4gdGhlIGFyZ3VtZW50XHJcbiAgICBmdW5jdGlvbiBvbmx5SXRlbSAoaXRlbSkge1xyXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiAkKHRoaXMpLnZhbCgpID09IGl0ZW0uaWQ7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgZm9yICh2YXIgZCA9IDA7IGQgPCBkYXRhLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgIHZhciBpdGVtID0gdGhpcy5fbm9ybWFsaXplSXRlbShkYXRhW2RdKTtcclxuXHJcbiAgICAgIC8vIFNraXAgaXRlbXMgd2hpY2ggd2VyZSBwcmUtbG9hZGVkLCBvbmx5IG1lcmdlIHRoZSBkYXRhXHJcbiAgICAgIGlmICgkLmluQXJyYXkoaXRlbS5pZCwgZXhpc3RpbmdJZHMpID49IDApIHtcclxuICAgICAgICB2YXIgJGV4aXN0aW5nT3B0aW9uID0gJGV4aXN0aW5nLmZpbHRlcihvbmx5SXRlbShpdGVtKSk7XHJcblxyXG4gICAgICAgIHZhciBleGlzdGluZ0RhdGEgPSB0aGlzLml0ZW0oJGV4aXN0aW5nT3B0aW9uKTtcclxuICAgICAgICB2YXIgbmV3RGF0YSA9ICQuZXh0ZW5kKHRydWUsIHt9LCBpdGVtLCBleGlzdGluZ0RhdGEpO1xyXG5cclxuICAgICAgICB2YXIgJG5ld09wdGlvbiA9IHRoaXMub3B0aW9uKG5ld0RhdGEpO1xyXG5cclxuICAgICAgICAkZXhpc3RpbmdPcHRpb24ucmVwbGFjZVdpdGgoJG5ld09wdGlvbik7XHJcblxyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgJG9wdGlvbiA9IHRoaXMub3B0aW9uKGl0ZW0pO1xyXG5cclxuICAgICAgaWYgKGl0ZW0uY2hpbGRyZW4pIHtcclxuICAgICAgICB2YXIgJGNoaWxkcmVuID0gdGhpcy5jb252ZXJ0VG9PcHRpb25zKGl0ZW0uY2hpbGRyZW4pO1xyXG5cclxuICAgICAgICBVdGlscy5hcHBlbmRNYW55KCRvcHRpb24sICRjaGlsZHJlbik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRvcHRpb25zLnB1c2goJG9wdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuICRvcHRpb25zO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBBcnJheUFkYXB0ZXI7XHJcbn0pO1xyXG5cclxuUzIuZGVmaW5lKCdzZWxlY3QyL2RhdGEvYWpheCcsW1xyXG4gICcuL2FycmF5JyxcclxuICAnLi4vdXRpbHMnLFxyXG4gICdqcXVlcnknXHJcbl0sIGZ1bmN0aW9uIChBcnJheUFkYXB0ZXIsIFV0aWxzLCAkKSB7XHJcbiAgZnVuY3Rpb24gQWpheEFkYXB0ZXIgKCRlbGVtZW50LCBvcHRpb25zKSB7XHJcbiAgICB0aGlzLmFqYXhPcHRpb25zID0gdGhpcy5fYXBwbHlEZWZhdWx0cyhvcHRpb25zLmdldCgnYWpheCcpKTtcclxuXHJcbiAgICBpZiAodGhpcy5hamF4T3B0aW9ucy5wcm9jZXNzUmVzdWx0cyAhPSBudWxsKSB7XHJcbiAgICAgIHRoaXMucHJvY2Vzc1Jlc3VsdHMgPSB0aGlzLmFqYXhPcHRpb25zLnByb2Nlc3NSZXN1bHRzO1xyXG4gICAgfVxyXG5cclxuICAgIEFqYXhBZGFwdGVyLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsICRlbGVtZW50LCBvcHRpb25zKTtcclxuICB9XHJcblxyXG4gIFV0aWxzLkV4dGVuZChBamF4QWRhcHRlciwgQXJyYXlBZGFwdGVyKTtcclxuXHJcbiAgQWpheEFkYXB0ZXIucHJvdG90eXBlLl9hcHBseURlZmF1bHRzID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIHZhciBkZWZhdWx0cyA9IHtcclxuICAgICAgZGF0YTogZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICAgIHJldHVybiAkLmV4dGVuZCh7fSwgcGFyYW1zLCB7XHJcbiAgICAgICAgICBxOiBwYXJhbXMudGVybVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG4gICAgICB0cmFuc3BvcnQ6IGZ1bmN0aW9uIChwYXJhbXMsIHN1Y2Nlc3MsIGZhaWx1cmUpIHtcclxuICAgICAgICB2YXIgJHJlcXVlc3QgPSAkLmFqYXgocGFyYW1zKTtcclxuXHJcbiAgICAgICAgJHJlcXVlc3QudGhlbihzdWNjZXNzKTtcclxuICAgICAgICAkcmVxdWVzdC5mYWlsKGZhaWx1cmUpO1xyXG5cclxuICAgICAgICByZXR1cm4gJHJlcXVlc3Q7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuICQuZXh0ZW5kKHt9LCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZSk7XHJcbiAgfTtcclxuXHJcbiAgQWpheEFkYXB0ZXIucHJvdG90eXBlLnByb2Nlc3NSZXN1bHRzID0gZnVuY3Rpb24gKHJlc3VsdHMpIHtcclxuICAgIHJldHVybiByZXN1bHRzO1xyXG4gIH07XHJcblxyXG4gIEFqYXhBZGFwdGVyLnByb3RvdHlwZS5xdWVyeSA9IGZ1bmN0aW9uIChwYXJhbXMsIGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgbWF0Y2hlcyA9IFtdO1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIGlmICh0aGlzLl9yZXF1ZXN0ICE9IG51bGwpIHtcclxuICAgICAgLy8gSlNPTlAgcmVxdWVzdHMgY2Fubm90IGFsd2F5cyBiZSBhYm9ydGVkXHJcbiAgICAgIGlmICgkLmlzRnVuY3Rpb24odGhpcy5fcmVxdWVzdC5hYm9ydCkpIHtcclxuICAgICAgICB0aGlzLl9yZXF1ZXN0LmFib3J0KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuX3JlcXVlc3QgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBvcHRpb25zID0gJC5leHRlbmQoe1xyXG4gICAgICB0eXBlOiAnR0VUJ1xyXG4gICAgfSwgdGhpcy5hamF4T3B0aW9ucyk7XHJcblxyXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLnVybCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICBvcHRpb25zLnVybCA9IG9wdGlvbnMudXJsLmNhbGwodGhpcy4kZWxlbWVudCwgcGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMuZGF0YSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICBvcHRpb25zLmRhdGEgPSBvcHRpb25zLmRhdGEuY2FsbCh0aGlzLiRlbGVtZW50LCBwYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHJlcXVlc3QgKCkge1xyXG4gICAgICB2YXIgJHJlcXVlc3QgPSBvcHRpb25zLnRyYW5zcG9ydChvcHRpb25zLCBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgIHZhciByZXN1bHRzID0gc2VsZi5wcm9jZXNzUmVzdWx0cyhkYXRhLCBwYXJhbXMpO1xyXG5cclxuICAgICAgICBpZiAoc2VsZi5vcHRpb25zLmdldCgnZGVidWcnKSAmJiB3aW5kb3cuY29uc29sZSAmJiBjb25zb2xlLmVycm9yKSB7XHJcbiAgICAgICAgICAvLyBDaGVjayB0byBtYWtlIHN1cmUgdGhhdCB0aGUgcmVzcG9uc2UgaW5jbHVkZWQgYSBgcmVzdWx0c2Aga2V5LlxyXG4gICAgICAgICAgaWYgKCFyZXN1bHRzIHx8ICFyZXN1bHRzLnJlc3VsdHMgfHwgISQuaXNBcnJheShyZXN1bHRzLnJlc3VsdHMpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXHJcbiAgICAgICAgICAgICAgJ1NlbGVjdDI6IFRoZSBBSkFYIHJlc3VsdHMgZGlkIG5vdCByZXR1cm4gYW4gYXJyYXkgaW4gdGhlICcgK1xyXG4gICAgICAgICAgICAgICdgcmVzdWx0c2Aga2V5IG9mIHRoZSByZXNwb25zZS4nXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjYWxsYmFjayhyZXN1bHRzKTtcclxuICAgICAgfSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vIEF0dGVtcHQgdG8gZGV0ZWN0IGlmIGEgcmVxdWVzdCB3YXMgYWJvcnRlZFxyXG4gICAgICAgIC8vIE9ubHkgd29ya3MgaWYgdGhlIHRyYW5zcG9ydCBleHBvc2VzIGEgc3RhdHVzIHByb3BlcnR5XHJcbiAgICAgICAgaWYgKCRyZXF1ZXN0LnN0YXR1cyAmJiAkcmVxdWVzdC5zdGF0dXMgPT09ICcwJykge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2VsZi50cmlnZ2VyKCdyZXN1bHRzOm1lc3NhZ2UnLCB7XHJcbiAgICAgICAgICBtZXNzYWdlOiAnZXJyb3JMb2FkaW5nJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHNlbGYuX3JlcXVlc3QgPSAkcmVxdWVzdDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5hamF4T3B0aW9ucy5kZWxheSAmJiBwYXJhbXMudGVybSAhPSBudWxsKSB7XHJcbiAgICAgIGlmICh0aGlzLl9xdWVyeVRpbWVvdXQpIHtcclxuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuX3F1ZXJ5VGltZW91dCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuX3F1ZXJ5VGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KHJlcXVlc3QsIHRoaXMuYWpheE9wdGlvbnMuZGVsYXkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVxdWVzdCgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHJldHVybiBBamF4QWRhcHRlcjtcclxufSk7XHJcblxyXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZGF0YS90YWdzJyxbXHJcbiAgJ2pxdWVyeSdcclxuXSwgZnVuY3Rpb24gKCQpIHtcclxuICBmdW5jdGlvbiBUYWdzIChkZWNvcmF0ZWQsICRlbGVtZW50LCBvcHRpb25zKSB7XHJcbiAgICB2YXIgdGFncyA9IG9wdGlvbnMuZ2V0KCd0YWdzJyk7XHJcblxyXG4gICAgdmFyIGNyZWF0ZVRhZyA9IG9wdGlvbnMuZ2V0KCdjcmVhdGVUYWcnKTtcclxuXHJcbiAgICBpZiAoY3JlYXRlVGFnICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy5jcmVhdGVUYWcgPSBjcmVhdGVUYWc7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGluc2VydFRhZyA9IG9wdGlvbnMuZ2V0KCdpbnNlcnRUYWcnKTtcclxuXHJcbiAgICBpZiAoaW5zZXJ0VGFnICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLmluc2VydFRhZyA9IGluc2VydFRhZztcclxuICAgIH1cclxuXHJcbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCAkZWxlbWVudCwgb3B0aW9ucyk7XHJcblxyXG4gICAgaWYgKCQuaXNBcnJheSh0YWdzKSkge1xyXG4gICAgICBmb3IgKHZhciB0ID0gMDsgdCA8IHRhZ3MubGVuZ3RoOyB0KyspIHtcclxuICAgICAgICB2YXIgdGFnID0gdGFnc1t0XTtcclxuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuX25vcm1hbGl6ZUl0ZW0odGFnKTtcclxuXHJcbiAgICAgICAgdmFyICRvcHRpb24gPSB0aGlzLm9wdGlvbihpdGVtKTtcclxuXHJcbiAgICAgICAgdGhpcy4kZWxlbWVudC5hcHBlbmQoJG9wdGlvbik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIFRhZ3MucHJvdG90eXBlLnF1ZXJ5ID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgcGFyYW1zLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHRoaXMuX3JlbW92ZU9sZFRhZ3MoKTtcclxuXHJcbiAgICBpZiAocGFyYW1zLnRlcm0gPT0gbnVsbCB8fCBwYXJhbXMucGFnZSAhPSBudWxsKSB7XHJcbiAgICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIHBhcmFtcywgY2FsbGJhY2spO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gd3JhcHBlciAob2JqLCBjaGlsZCkge1xyXG4gICAgICB2YXIgZGF0YSA9IG9iai5yZXN1bHRzO1xyXG5cclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIG9wdGlvbiA9IGRhdGFbaV07XHJcblxyXG4gICAgICAgIHZhciBjaGVja0NoaWxkcmVuID0gKFxyXG4gICAgICAgICAgb3B0aW9uLmNoaWxkcmVuICE9IG51bGwgJiZcclxuICAgICAgICAgICF3cmFwcGVyKHtcclxuICAgICAgICAgICAgcmVzdWx0czogb3B0aW9uLmNoaWxkcmVuXHJcbiAgICAgICAgICB9LCB0cnVlKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHZhciBjaGVja1RleHQgPSBvcHRpb24udGV4dCA9PT0gcGFyYW1zLnRlcm07XHJcblxyXG4gICAgICAgIGlmIChjaGVja1RleHQgfHwgY2hlY2tDaGlsZHJlbikge1xyXG4gICAgICAgICAgaWYgKGNoaWxkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBvYmouZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgICBjYWxsYmFjayhvYmopO1xyXG5cclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChjaGlsZCkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgdGFnID0gc2VsZi5jcmVhdGVUYWcocGFyYW1zKTtcclxuXHJcbiAgICAgIGlmICh0YWcgIT0gbnVsbCkge1xyXG4gICAgICAgIHZhciAkb3B0aW9uID0gc2VsZi5vcHRpb24odGFnKTtcclxuICAgICAgICAkb3B0aW9uLmF0dHIoJ2RhdGEtc2VsZWN0Mi10YWcnLCB0cnVlKTtcclxuXHJcbiAgICAgICAgc2VsZi5hZGRPcHRpb25zKFskb3B0aW9uXSk7XHJcblxyXG4gICAgICAgIHNlbGYuaW5zZXJ0VGFnKGRhdGEsIHRhZyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG9iai5yZXN1bHRzID0gZGF0YTtcclxuXHJcbiAgICAgIGNhbGxiYWNrKG9iaik7XHJcbiAgICB9XHJcblxyXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgcGFyYW1zLCB3cmFwcGVyKTtcclxuICB9O1xyXG5cclxuICBUYWdzLnByb3RvdHlwZS5jcmVhdGVUYWcgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBwYXJhbXMpIHtcclxuICAgIHZhciB0ZXJtID0gJC50cmltKHBhcmFtcy50ZXJtKTtcclxuXHJcbiAgICBpZiAodGVybSA9PT0gJycpIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgaWQ6IHRlcm0sXHJcbiAgICAgIHRleHQ6IHRlcm1cclxuICAgIH07XHJcbiAgfTtcclxuXHJcbiAgVGFncy5wcm90b3R5cGUuaW5zZXJ0VGFnID0gZnVuY3Rpb24gKF8sIGRhdGEsIHRhZykge1xyXG4gICAgZGF0YS51bnNoaWZ0KHRhZyk7XHJcbiAgfTtcclxuXHJcbiAgVGFncy5wcm90b3R5cGUuX3JlbW92ZU9sZFRhZ3MgPSBmdW5jdGlvbiAoXykge1xyXG4gICAgdmFyIHRhZyA9IHRoaXMuX2xhc3RUYWc7XHJcblxyXG4gICAgdmFyICRvcHRpb25zID0gdGhpcy4kZWxlbWVudC5maW5kKCdvcHRpb25bZGF0YS1zZWxlY3QyLXRhZ10nKTtcclxuXHJcbiAgICAkb3B0aW9ucy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICQodGhpcykucmVtb3ZlKCk7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gVGFncztcclxufSk7XHJcblxyXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZGF0YS90b2tlbml6ZXInLFtcclxuICAnanF1ZXJ5J1xyXG5dLCBmdW5jdGlvbiAoJCkge1xyXG4gIGZ1bmN0aW9uIFRva2VuaXplciAoZGVjb3JhdGVkLCAkZWxlbWVudCwgb3B0aW9ucykge1xyXG4gICAgdmFyIHRva2VuaXplciA9IG9wdGlvbnMuZ2V0KCd0b2tlbml6ZXInKTtcclxuXHJcbiAgICBpZiAodG9rZW5pemVyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy50b2tlbml6ZXIgPSB0b2tlbml6ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgJGVsZW1lbnQsIG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgVG9rZW5pemVyLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgY29udGFpbmVyLCAkY29udGFpbmVyKSB7XHJcbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBjb250YWluZXIsICRjb250YWluZXIpO1xyXG5cclxuICAgIHRoaXMuJHNlYXJjaCA9ICBjb250YWluZXIuZHJvcGRvd24uJHNlYXJjaCB8fCBjb250YWluZXIuc2VsZWN0aW9uLiRzZWFyY2ggfHxcclxuICAgICAgJGNvbnRhaW5lci5maW5kKCcuc2VsZWN0Mi1zZWFyY2hfX2ZpZWxkJyk7XHJcbiAgfTtcclxuXHJcbiAgVG9rZW5pemVyLnByb3RvdHlwZS5xdWVyeSA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIHBhcmFtcywgY2FsbGJhY2spIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICBmdW5jdGlvbiBjcmVhdGVBbmRTZWxlY3QgKGRhdGEpIHtcclxuICAgICAgLy8gTm9ybWFsaXplIHRoZSBkYXRhIG9iamVjdCBzbyB3ZSBjYW4gdXNlIGl0IGZvciBjaGVja3NcclxuICAgICAgdmFyIGl0ZW0gPSBzZWxmLl9ub3JtYWxpemVJdGVtKGRhdGEpO1xyXG5cclxuICAgICAgLy8gQ2hlY2sgaWYgdGhlIGRhdGEgb2JqZWN0IGFscmVhZHkgZXhpc3RzIGFzIGEgdGFnXHJcbiAgICAgIC8vIFNlbGVjdCBpdCBpZiBpdCBkb2Vzbid0XHJcbiAgICAgIHZhciAkZXhpc3RpbmdPcHRpb25zID0gc2VsZi4kZWxlbWVudC5maW5kKCdvcHRpb24nKS5maWx0ZXIoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiAkKHRoaXMpLnZhbCgpID09PSBpdGVtLmlkO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIElmIGFuIGV4aXN0aW5nIG9wdGlvbiB3YXNuJ3QgZm91bmQgZm9yIGl0LCBjcmVhdGUgdGhlIG9wdGlvblxyXG4gICAgICBpZiAoISRleGlzdGluZ09wdGlvbnMubGVuZ3RoKSB7XHJcbiAgICAgICAgdmFyICRvcHRpb24gPSBzZWxmLm9wdGlvbihpdGVtKTtcclxuICAgICAgICAkb3B0aW9uLmF0dHIoJ2RhdGEtc2VsZWN0Mi10YWcnLCB0cnVlKTtcclxuXHJcbiAgICAgICAgc2VsZi5fcmVtb3ZlT2xkVGFncygpO1xyXG4gICAgICAgIHNlbGYuYWRkT3B0aW9ucyhbJG9wdGlvbl0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBTZWxlY3QgdGhlIGl0ZW0sIG5vdyB0aGF0IHdlIGtub3cgdGhlcmUgaXMgYW4gb3B0aW9uIGZvciBpdFxyXG4gICAgICBzZWxlY3QoaXRlbSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2VsZWN0IChkYXRhKSB7XHJcbiAgICAgIHNlbGYudHJpZ2dlcignc2VsZWN0Jywge1xyXG4gICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcGFyYW1zLnRlcm0gPSBwYXJhbXMudGVybSB8fCAnJztcclxuXHJcbiAgICB2YXIgdG9rZW5EYXRhID0gdGhpcy50b2tlbml6ZXIocGFyYW1zLCB0aGlzLm9wdGlvbnMsIGNyZWF0ZUFuZFNlbGVjdCk7XHJcblxyXG4gICAgaWYgKHRva2VuRGF0YS50ZXJtICE9PSBwYXJhbXMudGVybSkge1xyXG4gICAgICAvLyBSZXBsYWNlIHRoZSBzZWFyY2ggdGVybSBpZiB3ZSBoYXZlIHRoZSBzZWFyY2ggYm94XHJcbiAgICAgIGlmICh0aGlzLiRzZWFyY2gubGVuZ3RoKSB7XHJcbiAgICAgICAgdGhpcy4kc2VhcmNoLnZhbCh0b2tlbkRhdGEudGVybSk7XHJcbiAgICAgICAgdGhpcy4kc2VhcmNoLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHBhcmFtcy50ZXJtID0gdG9rZW5EYXRhLnRlcm07XHJcbiAgICB9XHJcblxyXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgVG9rZW5pemVyLnByb3RvdHlwZS50b2tlbml6ZXIgPSBmdW5jdGlvbiAoXywgcGFyYW1zLCBvcHRpb25zLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIHNlcGFyYXRvcnMgPSBvcHRpb25zLmdldCgndG9rZW5TZXBhcmF0b3JzJykgfHwgW107XHJcbiAgICB2YXIgdGVybSA9IHBhcmFtcy50ZXJtO1xyXG4gICAgdmFyIGkgPSAwO1xyXG5cclxuICAgIHZhciBjcmVhdGVUYWcgPSB0aGlzLmNyZWF0ZVRhZyB8fCBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgaWQ6IHBhcmFtcy50ZXJtLFxyXG4gICAgICAgIHRleHQ6IHBhcmFtcy50ZXJtXHJcbiAgICAgIH07XHJcbiAgICB9O1xyXG5cclxuICAgIHdoaWxlIChpIDwgdGVybS5sZW5ndGgpIHtcclxuICAgICAgdmFyIHRlcm1DaGFyID0gdGVybVtpXTtcclxuXHJcbiAgICAgIGlmICgkLmluQXJyYXkodGVybUNoYXIsIHNlcGFyYXRvcnMpID09PSAtMSkge1xyXG4gICAgICAgIGkrKztcclxuXHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBwYXJ0ID0gdGVybS5zdWJzdHIoMCwgaSk7XHJcbiAgICAgIHZhciBwYXJ0UGFyYW1zID0gJC5leHRlbmQoe30sIHBhcmFtcywge1xyXG4gICAgICAgIHRlcm06IHBhcnRcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB2YXIgZGF0YSA9IGNyZWF0ZVRhZyhwYXJ0UGFyYW1zKTtcclxuXHJcbiAgICAgIGlmIChkYXRhID09IG51bGwpIHtcclxuICAgICAgICBpKys7XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNhbGxiYWNrKGRhdGEpO1xyXG5cclxuICAgICAgLy8gUmVzZXQgdGhlIHRlcm0gdG8gbm90IGluY2x1ZGUgdGhlIHRva2VuaXplZCBwb3J0aW9uXHJcbiAgICAgIHRlcm0gPSB0ZXJtLnN1YnN0cihpICsgMSkgfHwgJyc7XHJcbiAgICAgIGkgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHRlcm06IHRlcm1cclxuICAgIH07XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIFRva2VuaXplcjtcclxufSk7XHJcblxyXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZGF0YS9taW5pbXVtSW5wdXRMZW5ndGgnLFtcclxuXHJcbl0sIGZ1bmN0aW9uICgpIHtcclxuICBmdW5jdGlvbiBNaW5pbXVtSW5wdXRMZW5ndGggKGRlY29yYXRlZCwgJGUsIG9wdGlvbnMpIHtcclxuICAgIHRoaXMubWluaW11bUlucHV0TGVuZ3RoID0gb3B0aW9ucy5nZXQoJ21pbmltdW1JbnB1dExlbmd0aCcpO1xyXG5cclxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsICRlLCBvcHRpb25zKTtcclxuICB9XHJcblxyXG4gIE1pbmltdW1JbnB1dExlbmd0aC5wcm90b3R5cGUucXVlcnkgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBwYXJhbXMsIGNhbGxiYWNrKSB7XHJcbiAgICBwYXJhbXMudGVybSA9IHBhcmFtcy50ZXJtIHx8ICcnO1xyXG5cclxuICAgIGlmIChwYXJhbXMudGVybS5sZW5ndGggPCB0aGlzLm1pbmltdW1JbnB1dExlbmd0aCkge1xyXG4gICAgICB0aGlzLnRyaWdnZXIoJ3Jlc3VsdHM6bWVzc2FnZScsIHtcclxuICAgICAgICBtZXNzYWdlOiAnaW5wdXRUb29TaG9ydCcsXHJcbiAgICAgICAgYXJnczoge1xyXG4gICAgICAgICAgbWluaW11bTogdGhpcy5taW5pbXVtSW5wdXRMZW5ndGgsXHJcbiAgICAgICAgICBpbnB1dDogcGFyYW1zLnRlcm0sXHJcbiAgICAgICAgICBwYXJhbXM6IHBhcmFtc1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIE1pbmltdW1JbnB1dExlbmd0aDtcclxufSk7XHJcblxyXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZGF0YS9tYXhpbXVtSW5wdXRMZW5ndGgnLFtcclxuXHJcbl0sIGZ1bmN0aW9uICgpIHtcclxuICBmdW5jdGlvbiBNYXhpbXVtSW5wdXRMZW5ndGggKGRlY29yYXRlZCwgJGUsIG9wdGlvbnMpIHtcclxuICAgIHRoaXMubWF4aW11bUlucHV0TGVuZ3RoID0gb3B0aW9ucy5nZXQoJ21heGltdW1JbnB1dExlbmd0aCcpO1xyXG5cclxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsICRlLCBvcHRpb25zKTtcclxuICB9XHJcblxyXG4gIE1heGltdW1JbnB1dExlbmd0aC5wcm90b3R5cGUucXVlcnkgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBwYXJhbXMsIGNhbGxiYWNrKSB7XHJcbiAgICBwYXJhbXMudGVybSA9IHBhcmFtcy50ZXJtIHx8ICcnO1xyXG5cclxuICAgIGlmICh0aGlzLm1heGltdW1JbnB1dExlbmd0aCA+IDAgJiZcclxuICAgICAgICBwYXJhbXMudGVybS5sZW5ndGggPiB0aGlzLm1heGltdW1JbnB1dExlbmd0aCkge1xyXG4gICAgICB0aGlzLnRyaWdnZXIoJ3Jlc3VsdHM6bWVzc2FnZScsIHtcclxuICAgICAgICBtZXNzYWdlOiAnaW5wdXRUb29Mb25nJyxcclxuICAgICAgICBhcmdzOiB7XHJcbiAgICAgICAgICBtYXhpbXVtOiB0aGlzLm1heGltdW1JbnB1dExlbmd0aCxcclxuICAgICAgICAgIGlucHV0OiBwYXJhbXMudGVybSxcclxuICAgICAgICAgIHBhcmFtczogcGFyYW1zXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gTWF4aW11bUlucHV0TGVuZ3RoO1xyXG59KTtcclxuXHJcblMyLmRlZmluZSgnc2VsZWN0Mi9kYXRhL21heGltdW1TZWxlY3Rpb25MZW5ndGgnLFtcclxuXHJcbl0sIGZ1bmN0aW9uICgpe1xyXG4gIGZ1bmN0aW9uIE1heGltdW1TZWxlY3Rpb25MZW5ndGggKGRlY29yYXRlZCwgJGUsIG9wdGlvbnMpIHtcclxuICAgIHRoaXMubWF4aW11bVNlbGVjdGlvbkxlbmd0aCA9IG9wdGlvbnMuZ2V0KCdtYXhpbXVtU2VsZWN0aW9uTGVuZ3RoJyk7XHJcblxyXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgJGUsIG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgTWF4aW11bVNlbGVjdGlvbkxlbmd0aC5wcm90b3R5cGUucXVlcnkgPVxyXG4gICAgZnVuY3Rpb24gKGRlY29yYXRlZCwgcGFyYW1zLCBjYWxsYmFjaykge1xyXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICB0aGlzLmN1cnJlbnQoZnVuY3Rpb24gKGN1cnJlbnREYXRhKSB7XHJcbiAgICAgICAgdmFyIGNvdW50ID0gY3VycmVudERhdGEgIT0gbnVsbCA/IGN1cnJlbnREYXRhLmxlbmd0aCA6IDA7XHJcbiAgICAgICAgaWYgKHNlbGYubWF4aW11bVNlbGVjdGlvbkxlbmd0aCA+IDAgJiZcclxuICAgICAgICAgIGNvdW50ID49IHNlbGYubWF4aW11bVNlbGVjdGlvbkxlbmd0aCkge1xyXG4gICAgICAgICAgc2VsZi50cmlnZ2VyKCdyZXN1bHRzOm1lc3NhZ2UnLCB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdtYXhpbXVtU2VsZWN0ZWQnLFxyXG4gICAgICAgICAgICBhcmdzOiB7XHJcbiAgICAgICAgICAgICAgbWF4aW11bTogc2VsZi5tYXhpbXVtU2VsZWN0aW9uTGVuZ3RoXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkZWNvcmF0ZWQuY2FsbChzZWxmLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxuICAgICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIE1heGltdW1TZWxlY3Rpb25MZW5ndGg7XHJcbn0pO1xyXG5cclxuUzIuZGVmaW5lKCdzZWxlY3QyL2Ryb3Bkb3duJyxbXHJcbiAgJ2pxdWVyeScsXHJcbiAgJy4vdXRpbHMnXHJcbl0sIGZ1bmN0aW9uICgkLCBVdGlscykge1xyXG4gIGZ1bmN0aW9uIERyb3Bkb3duICgkZWxlbWVudCwgb3B0aW9ucykge1xyXG4gICAgdGhpcy4kZWxlbWVudCA9ICRlbGVtZW50O1xyXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcclxuXHJcbiAgICBEcm9wZG93bi5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzKTtcclxuICB9XHJcblxyXG4gIFV0aWxzLkV4dGVuZChEcm9wZG93biwgVXRpbHMuT2JzZXJ2YWJsZSk7XHJcblxyXG4gIERyb3Bkb3duLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgJGRyb3Bkb3duID0gJChcclxuICAgICAgJzxzcGFuIGNsYXNzPVwic2VsZWN0Mi1kcm9wZG93blwiPicgK1xyXG4gICAgICAgICc8c3BhbiBjbGFzcz1cInNlbGVjdDItcmVzdWx0c1wiPjwvc3Bhbj4nICtcclxuICAgICAgJzwvc3Bhbj4nXHJcbiAgICApO1xyXG5cclxuICAgICRkcm9wZG93bi5hdHRyKCdkaXInLCB0aGlzLm9wdGlvbnMuZ2V0KCdkaXInKSk7XHJcblxyXG4gICAgdGhpcy4kZHJvcGRvd24gPSAkZHJvcGRvd247XHJcblxyXG4gICAgcmV0dXJuICRkcm9wZG93bjtcclxuICB9O1xyXG5cclxuICBEcm9wZG93bi5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIFNob3VsZCBiZSBpbXBsZW1lbnRlZCBpbiBzdWJjbGFzc2VzXHJcbiAgfTtcclxuXHJcbiAgRHJvcGRvd24ucHJvdG90eXBlLnBvc2l0aW9uID0gZnVuY3Rpb24gKCRkcm9wZG93biwgJGNvbnRhaW5lcikge1xyXG4gICAgLy8gU2hvdWxkIGJlIGltcGxtZW50ZWQgaW4gc3ViY2xhc3Nlc1xyXG4gIH07XHJcblxyXG4gIERyb3Bkb3duLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gUmVtb3ZlIHRoZSBkcm9wZG93biBmcm9tIHRoZSBET01cclxuICAgIHRoaXMuJGRyb3Bkb3duLnJlbW92ZSgpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBEcm9wZG93bjtcclxufSk7XHJcblxyXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZHJvcGRvd24vc2VhcmNoJyxbXHJcbiAgJ2pxdWVyeScsXHJcbiAgJy4uL3V0aWxzJ1xyXG5dLCBmdW5jdGlvbiAoJCwgVXRpbHMpIHtcclxuICBmdW5jdGlvbiBTZWFyY2ggKCkgeyB9XHJcblxyXG4gIFNlYXJjaC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKGRlY29yYXRlZCkge1xyXG4gICAgdmFyICRyZW5kZXJlZCA9IGRlY29yYXRlZC5jYWxsKHRoaXMpO1xyXG5cclxuICAgIHZhciAkc2VhcmNoID0gJChcclxuICAgICAgJzxzcGFuIGNsYXNzPVwic2VsZWN0Mi1zZWFyY2ggc2VsZWN0Mi1zZWFyY2gtLWRyb3Bkb3duXCI+JyArXHJcbiAgICAgICAgJzxpbnB1dCBjbGFzcz1cInNlbGVjdDItc2VhcmNoX19maWVsZFwiIHR5cGU9XCJzZWFyY2hcIiB0YWJpbmRleD1cIi0xXCInICtcclxuICAgICAgICAnIGF1dG9jb21wbGV0ZT1cIm9mZlwiIGF1dG9jb3JyZWN0PVwib2ZmXCIgYXV0b2NhcGl0YWxpemU9XCJvZmZcIicgK1xyXG4gICAgICAgICcgc3BlbGxjaGVjaz1cImZhbHNlXCIgcm9sZT1cInRleHRib3hcIiAvPicgK1xyXG4gICAgICAnPC9zcGFuPidcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy4kc2VhcmNoQ29udGFpbmVyID0gJHNlYXJjaDtcclxuICAgIHRoaXMuJHNlYXJjaCA9ICRzZWFyY2guZmluZCgnaW5wdXQnKTtcclxuXHJcbiAgICAkcmVuZGVyZWQucHJlcGVuZCgkc2VhcmNoKTtcclxuXHJcbiAgICByZXR1cm4gJHJlbmRlcmVkO1xyXG4gIH07XHJcblxyXG4gIFNlYXJjaC5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGNvbnRhaW5lciwgJGNvbnRhaW5lcik7XHJcblxyXG4gICAgdGhpcy4kc2VhcmNoLm9uKCdrZXlkb3duJywgZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICBzZWxmLnRyaWdnZXIoJ2tleXByZXNzJywgZXZ0KTtcclxuXHJcbiAgICAgIHNlbGYuX2tleVVwUHJldmVudGVkID0gZXZ0LmlzRGVmYXVsdFByZXZlbnRlZCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gV29ya2Fyb3VuZCBmb3IgYnJvd3NlcnMgd2hpY2ggZG8gbm90IHN1cHBvcnQgdGhlIGBpbnB1dGAgZXZlbnRcclxuICAgIC8vIFRoaXMgd2lsbCBwcmV2ZW50IGRvdWJsZS10cmlnZ2VyaW5nIG9mIGV2ZW50cyBmb3IgYnJvd3NlcnMgd2hpY2ggc3VwcG9ydFxyXG4gICAgLy8gYm90aCB0aGUgYGtleXVwYCBhbmQgYGlucHV0YCBldmVudHMuXHJcbiAgICB0aGlzLiRzZWFyY2gub24oJ2lucHV0JywgZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICAvLyBVbmJpbmQgdGhlIGR1cGxpY2F0ZWQgYGtleXVwYCBldmVudFxyXG4gICAgICAkKHRoaXMpLm9mZigna2V5dXAnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuJHNlYXJjaC5vbigna2V5dXAgaW5wdXQnLCBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgIHNlbGYuaGFuZGxlU2VhcmNoKGV2dCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ29wZW4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHNlbGYuJHNlYXJjaC5hdHRyKCd0YWJpbmRleCcsIDApO1xyXG5cclxuICAgICAgc2VsZi4kc2VhcmNoLmZvY3VzKCk7XHJcblxyXG4gICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgc2VsZi4kc2VhcmNoLmZvY3VzKCk7XHJcbiAgICAgIH0sIDApO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29udGFpbmVyLm9uKCdjbG9zZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgc2VsZi4kc2VhcmNoLmF0dHIoJ3RhYmluZGV4JywgLTEpO1xyXG5cclxuICAgICAgc2VsZi4kc2VhcmNoLnZhbCgnJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ2ZvY3VzJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoY29udGFpbmVyLmlzT3BlbigpKSB7XHJcbiAgICAgICAgc2VsZi4kc2VhcmNoLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRhaW5lci5vbigncmVzdWx0czphbGwnLCBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgIGlmIChwYXJhbXMucXVlcnkudGVybSA9PSBudWxsIHx8IHBhcmFtcy5xdWVyeS50ZXJtID09PSAnJykge1xyXG4gICAgICAgIHZhciBzaG93U2VhcmNoID0gc2VsZi5zaG93U2VhcmNoKHBhcmFtcyk7XHJcblxyXG4gICAgICAgIGlmIChzaG93U2VhcmNoKSB7XHJcbiAgICAgICAgICBzZWxmLiRzZWFyY2hDb250YWluZXIucmVtb3ZlQ2xhc3MoJ3NlbGVjdDItc2VhcmNoLS1oaWRlJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHNlbGYuJHNlYXJjaENvbnRhaW5lci5hZGRDbGFzcygnc2VsZWN0Mi1zZWFyY2gtLWhpZGUnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIFNlYXJjaC5wcm90b3R5cGUuaGFuZGxlU2VhcmNoID0gZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgaWYgKCF0aGlzLl9rZXlVcFByZXZlbnRlZCkge1xyXG4gICAgICB2YXIgaW5wdXQgPSB0aGlzLiRzZWFyY2gudmFsKCk7XHJcblxyXG4gICAgICB0aGlzLnRyaWdnZXIoJ3F1ZXJ5Jywge1xyXG4gICAgICAgIHRlcm06IGlucHV0XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX2tleVVwUHJldmVudGVkID0gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgU2VhcmNoLnByb3RvdHlwZS5zaG93U2VhcmNoID0gZnVuY3Rpb24gKF8sIHBhcmFtcykge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIFNlYXJjaDtcclxufSk7XHJcblxyXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZHJvcGRvd24vaGlkZVBsYWNlaG9sZGVyJyxbXHJcblxyXG5dLCBmdW5jdGlvbiAoKSB7XHJcbiAgZnVuY3Rpb24gSGlkZVBsYWNlaG9sZGVyIChkZWNvcmF0ZWQsICRlbGVtZW50LCBvcHRpb25zLCBkYXRhQWRhcHRlcikge1xyXG4gICAgdGhpcy5wbGFjZWhvbGRlciA9IHRoaXMubm9ybWFsaXplUGxhY2Vob2xkZXIob3B0aW9ucy5nZXQoJ3BsYWNlaG9sZGVyJykpO1xyXG5cclxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsICRlbGVtZW50LCBvcHRpb25zLCBkYXRhQWRhcHRlcik7XHJcbiAgfVxyXG5cclxuICBIaWRlUGxhY2Vob2xkZXIucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGRhdGEpIHtcclxuICAgIGRhdGEucmVzdWx0cyA9IHRoaXMucmVtb3ZlUGxhY2Vob2xkZXIoZGF0YS5yZXN1bHRzKTtcclxuXHJcbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBkYXRhKTtcclxuICB9O1xyXG5cclxuICBIaWRlUGxhY2Vob2xkZXIucHJvdG90eXBlLm5vcm1hbGl6ZVBsYWNlaG9sZGVyID0gZnVuY3Rpb24gKF8sIHBsYWNlaG9sZGVyKSB7XHJcbiAgICBpZiAodHlwZW9mIHBsYWNlaG9sZGVyID09PSAnc3RyaW5nJykge1xyXG4gICAgICBwbGFjZWhvbGRlciA9IHtcclxuICAgICAgICBpZDogJycsXHJcbiAgICAgICAgdGV4dDogcGxhY2Vob2xkZXJcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGxhY2Vob2xkZXI7XHJcbiAgfTtcclxuXHJcbiAgSGlkZVBsYWNlaG9sZGVyLnByb3RvdHlwZS5yZW1vdmVQbGFjZWhvbGRlciA9IGZ1bmN0aW9uIChfLCBkYXRhKSB7XHJcbiAgICB2YXIgbW9kaWZpZWREYXRhID0gZGF0YS5zbGljZSgwKTtcclxuXHJcbiAgICBmb3IgKHZhciBkID0gZGF0YS5sZW5ndGggLSAxOyBkID49IDA7IGQtLSkge1xyXG4gICAgICB2YXIgaXRlbSA9IGRhdGFbZF07XHJcblxyXG4gICAgICBpZiAodGhpcy5wbGFjZWhvbGRlci5pZCA9PT0gaXRlbS5pZCkge1xyXG4gICAgICAgIG1vZGlmaWVkRGF0YS5zcGxpY2UoZCwgMSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbW9kaWZpZWREYXRhO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBIaWRlUGxhY2Vob2xkZXI7XHJcbn0pO1xyXG5cclxuUzIuZGVmaW5lKCdzZWxlY3QyL2Ryb3Bkb3duL2luZmluaXRlU2Nyb2xsJyxbXHJcbiAgJ2pxdWVyeSdcclxuXSwgZnVuY3Rpb24gKCQpIHtcclxuICBmdW5jdGlvbiBJbmZpbml0ZVNjcm9sbCAoZGVjb3JhdGVkLCAkZWxlbWVudCwgb3B0aW9ucywgZGF0YUFkYXB0ZXIpIHtcclxuICAgIHRoaXMubGFzdFBhcmFtcyA9IHt9O1xyXG5cclxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsICRlbGVtZW50LCBvcHRpb25zLCBkYXRhQWRhcHRlcik7XHJcblxyXG4gICAgdGhpcy4kbG9hZGluZ01vcmUgPSB0aGlzLmNyZWF0ZUxvYWRpbmdNb3JlKCk7XHJcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIEluZmluaXRlU2Nyb2xsLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBkYXRhKSB7XHJcbiAgICB0aGlzLiRsb2FkaW5nTW9yZS5yZW1vdmUoKTtcclxuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xyXG5cclxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGRhdGEpO1xyXG5cclxuICAgIGlmICh0aGlzLnNob3dMb2FkaW5nTW9yZShkYXRhKSkge1xyXG4gICAgICB0aGlzLiRyZXN1bHRzLmFwcGVuZCh0aGlzLiRsb2FkaW5nTW9yZSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgSW5maW5pdGVTY3JvbGwucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBjb250YWluZXIsICRjb250YWluZXIpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBjb250YWluZXIsICRjb250YWluZXIpO1xyXG5cclxuICAgIGNvbnRhaW5lci5vbigncXVlcnknLCBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgIHNlbGYubGFzdFBhcmFtcyA9IHBhcmFtcztcclxuICAgICAgc2VsZi5sb2FkaW5nID0gdHJ1ZTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRhaW5lci5vbigncXVlcnk6YXBwZW5kJywgZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICBzZWxmLmxhc3RQYXJhbXMgPSBwYXJhbXM7XHJcbiAgICAgIHNlbGYubG9hZGluZyA9IHRydWU7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLiRyZXN1bHRzLm9uKCdzY3JvbGwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBpc0xvYWRNb3JlVmlzaWJsZSA9ICQuY29udGFpbnMoXHJcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxyXG4gICAgICAgIHNlbGYuJGxvYWRpbmdNb3JlWzBdXHJcbiAgICAgICk7XHJcblxyXG4gICAgICBpZiAoc2VsZi5sb2FkaW5nIHx8ICFpc0xvYWRNb3JlVmlzaWJsZSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGN1cnJlbnRPZmZzZXQgPSBzZWxmLiRyZXN1bHRzLm9mZnNldCgpLnRvcCArXHJcbiAgICAgICAgc2VsZi4kcmVzdWx0cy5vdXRlckhlaWdodChmYWxzZSk7XHJcbiAgICAgIHZhciBsb2FkaW5nTW9yZU9mZnNldCA9IHNlbGYuJGxvYWRpbmdNb3JlLm9mZnNldCgpLnRvcCArXHJcbiAgICAgICAgc2VsZi4kbG9hZGluZ01vcmUub3V0ZXJIZWlnaHQoZmFsc2UpO1xyXG5cclxuICAgICAgaWYgKGN1cnJlbnRPZmZzZXQgKyA1MCA+PSBsb2FkaW5nTW9yZU9mZnNldCkge1xyXG4gICAgICAgIHNlbGYubG9hZE1vcmUoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgSW5maW5pdGVTY3JvbGwucHJvdG90eXBlLmxvYWRNb3JlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcclxuXHJcbiAgICB2YXIgcGFyYW1zID0gJC5leHRlbmQoe30sIHtwYWdlOiAxfSwgdGhpcy5sYXN0UGFyYW1zKTtcclxuXHJcbiAgICBwYXJhbXMucGFnZSsrO1xyXG5cclxuICAgIHRoaXMudHJpZ2dlcigncXVlcnk6YXBwZW5kJywgcGFyYW1zKTtcclxuICB9O1xyXG5cclxuICBJbmZpbml0ZVNjcm9sbC5wcm90b3R5cGUuc2hvd0xvYWRpbmdNb3JlID0gZnVuY3Rpb24gKF8sIGRhdGEpIHtcclxuICAgIHJldHVybiBkYXRhLnBhZ2luYXRpb24gJiYgZGF0YS5wYWdpbmF0aW9uLm1vcmU7XHJcbiAgfTtcclxuXHJcbiAgSW5maW5pdGVTY3JvbGwucHJvdG90eXBlLmNyZWF0ZUxvYWRpbmdNb3JlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyICRvcHRpb24gPSAkKFxyXG4gICAgICAnPGxpICcgK1xyXG4gICAgICAnY2xhc3M9XCJzZWxlY3QyLXJlc3VsdHNfX29wdGlvbiBzZWxlY3QyLXJlc3VsdHNfX29wdGlvbi0tbG9hZC1tb3JlXCInICtcclxuICAgICAgJ3JvbGU9XCJ0cmVlaXRlbVwiIGFyaWEtZGlzYWJsZWQ9XCJ0cnVlXCI+PC9saT4nXHJcbiAgICApO1xyXG5cclxuICAgIHZhciBtZXNzYWdlID0gdGhpcy5vcHRpb25zLmdldCgndHJhbnNsYXRpb25zJykuZ2V0KCdsb2FkaW5nTW9yZScpO1xyXG5cclxuICAgICRvcHRpb24uaHRtbChtZXNzYWdlKHRoaXMubGFzdFBhcmFtcykpO1xyXG5cclxuICAgIHJldHVybiAkb3B0aW9uO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBJbmZpbml0ZVNjcm9sbDtcclxufSk7XHJcblxyXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZHJvcGRvd24vYXR0YWNoQm9keScsW1xyXG4gICdqcXVlcnknLFxyXG4gICcuLi91dGlscydcclxuXSwgZnVuY3Rpb24gKCQsIFV0aWxzKSB7XHJcbiAgZnVuY3Rpb24gQXR0YWNoQm9keSAoZGVjb3JhdGVkLCAkZWxlbWVudCwgb3B0aW9ucykge1xyXG4gICAgdGhpcy4kZHJvcGRvd25QYXJlbnQgPSBvcHRpb25zLmdldCgnZHJvcGRvd25QYXJlbnQnKSB8fCAkKGRvY3VtZW50LmJvZHkpO1xyXG5cclxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsICRlbGVtZW50LCBvcHRpb25zKTtcclxuICB9XHJcblxyXG4gIEF0dGFjaEJvZHkucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBjb250YWluZXIsICRjb250YWluZXIpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICB2YXIgc2V0dXBSZXN1bHRzRXZlbnRzID0gZmFsc2U7XHJcblxyXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgY29udGFpbmVyLCAkY29udGFpbmVyKTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ29wZW4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHNlbGYuX3Nob3dEcm9wZG93bigpO1xyXG4gICAgICBzZWxmLl9hdHRhY2hQb3NpdGlvbmluZ0hhbmRsZXIoY29udGFpbmVyKTtcclxuXHJcbiAgICAgIGlmICghc2V0dXBSZXN1bHRzRXZlbnRzKSB7XHJcbiAgICAgICAgc2V0dXBSZXN1bHRzRXZlbnRzID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgY29udGFpbmVyLm9uKCdyZXN1bHRzOmFsbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHNlbGYuX3Bvc2l0aW9uRHJvcGRvd24oKTtcclxuICAgICAgICAgIHNlbGYuX3Jlc2l6ZURyb3Bkb3duKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5vbigncmVzdWx0czphcHBlbmQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBzZWxmLl9wb3NpdGlvbkRyb3Bkb3duKCk7XHJcbiAgICAgICAgICBzZWxmLl9yZXNpemVEcm9wZG93bigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ2Nsb3NlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICBzZWxmLl9oaWRlRHJvcGRvd24oKTtcclxuICAgICAgc2VsZi5fZGV0YWNoUG9zaXRpb25pbmdIYW5kbGVyKGNvbnRhaW5lcik7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLiRkcm9wZG93bkNvbnRhaW5lci5vbignbW91c2Vkb3duJywgZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBBdHRhY2hCb2R5LnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKGRlY29yYXRlZCkge1xyXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcyk7XHJcblxyXG4gICAgdGhpcy4kZHJvcGRvd25Db250YWluZXIucmVtb3ZlKCk7XHJcbiAgfTtcclxuXHJcbiAgQXR0YWNoQm9keS5wcm90b3R5cGUucG9zaXRpb24gPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCAkZHJvcGRvd24sICRjb250YWluZXIpIHtcclxuICAgIC8vIENsb25lIGFsbCBvZiB0aGUgY29udGFpbmVyIGNsYXNzZXNcclxuICAgICRkcm9wZG93bi5hdHRyKCdjbGFzcycsICRjb250YWluZXIuYXR0cignY2xhc3MnKSk7XHJcblxyXG4gICAgJGRyb3Bkb3duLnJlbW92ZUNsYXNzKCdzZWxlY3QyJyk7XHJcbiAgICAkZHJvcGRvd24uYWRkQ2xhc3MoJ3NlbGVjdDItY29udGFpbmVyLS1vcGVuJyk7XHJcblxyXG4gICAgJGRyb3Bkb3duLmNzcyh7XHJcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG4gICAgICB0b3A6IC05OTk5OTlcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuJGNvbnRhaW5lciA9ICRjb250YWluZXI7XHJcbiAgfTtcclxuXHJcbiAgQXR0YWNoQm9keS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKGRlY29yYXRlZCkge1xyXG4gICAgdmFyICRjb250YWluZXIgPSAkKCc8c3Bhbj48L3NwYW4+Jyk7XHJcblxyXG4gICAgdmFyICRkcm9wZG93biA9IGRlY29yYXRlZC5jYWxsKHRoaXMpO1xyXG4gICAgJGNvbnRhaW5lci5hcHBlbmQoJGRyb3Bkb3duKTtcclxuXHJcbiAgICB0aGlzLiRkcm9wZG93bkNvbnRhaW5lciA9ICRjb250YWluZXI7XHJcblxyXG4gICAgcmV0dXJuICRjb250YWluZXI7XHJcbiAgfTtcclxuXHJcbiAgQXR0YWNoQm9keS5wcm90b3R5cGUuX2hpZGVEcm9wZG93biA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQpIHtcclxuICAgIHRoaXMuJGRyb3Bkb3duQ29udGFpbmVyLmRldGFjaCgpO1xyXG4gIH07XHJcblxyXG4gIEF0dGFjaEJvZHkucHJvdG90eXBlLl9hdHRhY2hQb3NpdGlvbmluZ0hhbmRsZXIgPVxyXG4gICAgICBmdW5jdGlvbiAoZGVjb3JhdGVkLCBjb250YWluZXIpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICB2YXIgc2Nyb2xsRXZlbnQgPSAnc2Nyb2xsLnNlbGVjdDIuJyArIGNvbnRhaW5lci5pZDtcclxuICAgIHZhciByZXNpemVFdmVudCA9ICdyZXNpemUuc2VsZWN0Mi4nICsgY29udGFpbmVyLmlkO1xyXG4gICAgdmFyIG9yaWVudGF0aW9uRXZlbnQgPSAnb3JpZW50YXRpb25jaGFuZ2Uuc2VsZWN0Mi4nICsgY29udGFpbmVyLmlkO1xyXG5cclxuICAgIHZhciAkd2F0Y2hlcnMgPSB0aGlzLiRjb250YWluZXIucGFyZW50cygpLmZpbHRlcihVdGlscy5oYXNTY3JvbGwpO1xyXG4gICAgJHdhdGNoZXJzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAkKHRoaXMpLmRhdGEoJ3NlbGVjdDItc2Nyb2xsLXBvc2l0aW9uJywge1xyXG4gICAgICAgIHg6ICQodGhpcykuc2Nyb2xsTGVmdCgpLFxyXG4gICAgICAgIHk6ICQodGhpcykuc2Nyb2xsVG9wKClcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkd2F0Y2hlcnMub24oc2Nyb2xsRXZlbnQsIGZ1bmN0aW9uIChldikge1xyXG4gICAgICB2YXIgcG9zaXRpb24gPSAkKHRoaXMpLmRhdGEoJ3NlbGVjdDItc2Nyb2xsLXBvc2l0aW9uJyk7XHJcbiAgICAgICQodGhpcykuc2Nyb2xsVG9wKHBvc2l0aW9uLnkpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJCh3aW5kb3cpLm9uKHNjcm9sbEV2ZW50ICsgJyAnICsgcmVzaXplRXZlbnQgKyAnICcgKyBvcmllbnRhdGlvbkV2ZW50LFxyXG4gICAgICBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBzZWxmLl9wb3NpdGlvbkRyb3Bkb3duKCk7XHJcbiAgICAgIHNlbGYuX3Jlc2l6ZURyb3Bkb3duKCk7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBBdHRhY2hCb2R5LnByb3RvdHlwZS5fZGV0YWNoUG9zaXRpb25pbmdIYW5kbGVyID1cclxuICAgICAgZnVuY3Rpb24gKGRlY29yYXRlZCwgY29udGFpbmVyKSB7XHJcbiAgICB2YXIgc2Nyb2xsRXZlbnQgPSAnc2Nyb2xsLnNlbGVjdDIuJyArIGNvbnRhaW5lci5pZDtcclxuICAgIHZhciByZXNpemVFdmVudCA9ICdyZXNpemUuc2VsZWN0Mi4nICsgY29udGFpbmVyLmlkO1xyXG4gICAgdmFyIG9yaWVudGF0aW9uRXZlbnQgPSAnb3JpZW50YXRpb25jaGFuZ2Uuc2VsZWN0Mi4nICsgY29udGFpbmVyLmlkO1xyXG5cclxuICAgIHZhciAkd2F0Y2hlcnMgPSB0aGlzLiRjb250YWluZXIucGFyZW50cygpLmZpbHRlcihVdGlscy5oYXNTY3JvbGwpO1xyXG4gICAgJHdhdGNoZXJzLm9mZihzY3JvbGxFdmVudCk7XHJcblxyXG4gICAgJCh3aW5kb3cpLm9mZihzY3JvbGxFdmVudCArICcgJyArIHJlc2l6ZUV2ZW50ICsgJyAnICsgb3JpZW50YXRpb25FdmVudCk7XHJcbiAgfTtcclxuXHJcbiAgQXR0YWNoQm9keS5wcm90b3R5cGUuX3Bvc2l0aW9uRHJvcGRvd24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgJHdpbmRvdyA9ICQod2luZG93KTtcclxuXHJcbiAgICB2YXIgaXNDdXJyZW50bHlBYm92ZSA9IHRoaXMuJGRyb3Bkb3duLmhhc0NsYXNzKCdzZWxlY3QyLWRyb3Bkb3duLS1hYm92ZScpO1xyXG4gICAgdmFyIGlzQ3VycmVudGx5QmVsb3cgPSB0aGlzLiRkcm9wZG93bi5oYXNDbGFzcygnc2VsZWN0Mi1kcm9wZG93bi0tYmVsb3cnKTtcclxuXHJcbiAgICB2YXIgbmV3RGlyZWN0aW9uID0gbnVsbDtcclxuXHJcbiAgICB2YXIgb2Zmc2V0ID0gdGhpcy4kY29udGFpbmVyLm9mZnNldCgpO1xyXG5cclxuICAgIG9mZnNldC5ib3R0b20gPSBvZmZzZXQudG9wICsgdGhpcy4kY29udGFpbmVyLm91dGVySGVpZ2h0KGZhbHNlKTtcclxuXHJcbiAgICB2YXIgY29udGFpbmVyID0ge1xyXG4gICAgICBoZWlnaHQ6IHRoaXMuJGNvbnRhaW5lci5vdXRlckhlaWdodChmYWxzZSlcclxuICAgIH07XHJcblxyXG4gICAgY29udGFpbmVyLnRvcCA9IG9mZnNldC50b3A7XHJcbiAgICBjb250YWluZXIuYm90dG9tID0gb2Zmc2V0LnRvcCArIGNvbnRhaW5lci5oZWlnaHQ7XHJcblxyXG4gICAgdmFyIGRyb3Bkb3duID0ge1xyXG4gICAgICBoZWlnaHQ6IHRoaXMuJGRyb3Bkb3duLm91dGVySGVpZ2h0KGZhbHNlKVxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgdmlld3BvcnQgPSB7XHJcbiAgICAgIHRvcDogJHdpbmRvdy5zY3JvbGxUb3AoKSxcclxuICAgICAgYm90dG9tOiAkd2luZG93LnNjcm9sbFRvcCgpICsgJHdpbmRvdy5oZWlnaHQoKVxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgZW5vdWdoUm9vbUFib3ZlID0gdmlld3BvcnQudG9wIDwgKG9mZnNldC50b3AgLSBkcm9wZG93bi5oZWlnaHQpO1xyXG4gICAgdmFyIGVub3VnaFJvb21CZWxvdyA9IHZpZXdwb3J0LmJvdHRvbSA+IChvZmZzZXQuYm90dG9tICsgZHJvcGRvd24uaGVpZ2h0KTtcclxuXHJcbiAgICB2YXIgY3NzID0ge1xyXG4gICAgICBsZWZ0OiBvZmZzZXQubGVmdCxcclxuICAgICAgdG9wOiBjb250YWluZXIuYm90dG9tXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIERldGVybWluZSB3aGF0IHRoZSBwYXJlbnQgZWxlbWVudCBpcyB0byB1c2UgZm9yIGNhbGNpdWxhdGluZyB0aGUgb2Zmc2V0XHJcbiAgICB2YXIgJG9mZnNldFBhcmVudCA9IHRoaXMuJGRyb3Bkb3duUGFyZW50O1xyXG5cclxuICAgIC8vIEZvciBzdGF0aWNhbGx5IHBvc2l0b25lZCBlbGVtZW50cywgd2UgbmVlZCB0byBnZXQgdGhlIGVsZW1lbnRcclxuICAgIC8vIHRoYXQgaXMgZGV0ZXJtaW5pbmcgdGhlIG9mZnNldFxyXG4gICAgaWYgKCRvZmZzZXRQYXJlbnQuY3NzKCdwb3NpdGlvbicpID09PSAnc3RhdGljJykge1xyXG4gICAgICAkb2Zmc2V0UGFyZW50ID0gJG9mZnNldFBhcmVudC5vZmZzZXRQYXJlbnQoKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgcGFyZW50T2Zmc2V0ID0gJG9mZnNldFBhcmVudC5vZmZzZXQoKTtcclxuXHJcbiAgICBjc3MudG9wIC09IHBhcmVudE9mZnNldC50b3A7XHJcbiAgICBjc3MubGVmdCAtPSBwYXJlbnRPZmZzZXQubGVmdDtcclxuXHJcbiAgICBpZiAoIWlzQ3VycmVudGx5QWJvdmUgJiYgIWlzQ3VycmVudGx5QmVsb3cpIHtcclxuICAgICAgbmV3RGlyZWN0aW9uID0gJ2JlbG93JztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWVub3VnaFJvb21CZWxvdyAmJiBlbm91Z2hSb29tQWJvdmUgJiYgIWlzQ3VycmVudGx5QWJvdmUpIHtcclxuICAgICAgbmV3RGlyZWN0aW9uID0gJ2Fib3ZlJztcclxuICAgIH0gZWxzZSBpZiAoIWVub3VnaFJvb21BYm92ZSAmJiBlbm91Z2hSb29tQmVsb3cgJiYgaXNDdXJyZW50bHlBYm92ZSkge1xyXG4gICAgICBuZXdEaXJlY3Rpb24gPSAnYmVsb3cnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChuZXdEaXJlY3Rpb24gPT0gJ2Fib3ZlJyB8fFxyXG4gICAgICAoaXNDdXJyZW50bHlBYm92ZSAmJiBuZXdEaXJlY3Rpb24gIT09ICdiZWxvdycpKSB7XHJcbiAgICAgIGNzcy50b3AgPSBjb250YWluZXIudG9wIC0gcGFyZW50T2Zmc2V0LnRvcCAtIGRyb3Bkb3duLmhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAobmV3RGlyZWN0aW9uICE9IG51bGwpIHtcclxuICAgICAgdGhpcy4kZHJvcGRvd25cclxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NlbGVjdDItZHJvcGRvd24tLWJlbG93IHNlbGVjdDItZHJvcGRvd24tLWFib3ZlJylcclxuICAgICAgICAuYWRkQ2xhc3MoJ3NlbGVjdDItZHJvcGRvd24tLScgKyBuZXdEaXJlY3Rpb24pO1xyXG4gICAgICB0aGlzLiRjb250YWluZXJcclxuICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NlbGVjdDItY29udGFpbmVyLS1iZWxvdyBzZWxlY3QyLWNvbnRhaW5lci0tYWJvdmUnKVxyXG4gICAgICAgIC5hZGRDbGFzcygnc2VsZWN0Mi1jb250YWluZXItLScgKyBuZXdEaXJlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuJGRyb3Bkb3duQ29udGFpbmVyLmNzcyhjc3MpO1xyXG4gIH07XHJcblxyXG4gIEF0dGFjaEJvZHkucHJvdG90eXBlLl9yZXNpemVEcm9wZG93biA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBjc3MgPSB7XHJcbiAgICAgIHdpZHRoOiB0aGlzLiRjb250YWluZXIub3V0ZXJXaWR0aChmYWxzZSkgKyAncHgnXHJcbiAgICB9O1xyXG5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMuZ2V0KCdkcm9wZG93bkF1dG9XaWR0aCcpKSB7XHJcbiAgICAgIGNzcy5taW5XaWR0aCA9IGNzcy53aWR0aDtcclxuICAgICAgY3NzLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcclxuICAgICAgY3NzLndpZHRoID0gJ2F1dG8nO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuJGRyb3Bkb3duLmNzcyhjc3MpO1xyXG4gIH07XHJcblxyXG4gIEF0dGFjaEJvZHkucHJvdG90eXBlLl9zaG93RHJvcGRvd24gPSBmdW5jdGlvbiAoZGVjb3JhdGVkKSB7XHJcbiAgICB0aGlzLiRkcm9wZG93bkNvbnRhaW5lci5hcHBlbmRUbyh0aGlzLiRkcm9wZG93blBhcmVudCk7XHJcblxyXG4gICAgdGhpcy5fcG9zaXRpb25Ecm9wZG93bigpO1xyXG4gICAgdGhpcy5fcmVzaXplRHJvcGRvd24oKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gQXR0YWNoQm9keTtcclxufSk7XHJcblxyXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZHJvcGRvd24vbWluaW11bVJlc3VsdHNGb3JTZWFyY2gnLFtcclxuXHJcbl0sIGZ1bmN0aW9uICgpIHtcclxuICBmdW5jdGlvbiBjb3VudFJlc3VsdHMgKGRhdGEpIHtcclxuICAgIHZhciBjb3VudCA9IDA7XHJcblxyXG4gICAgZm9yICh2YXIgZCA9IDA7IGQgPCBkYXRhLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgIHZhciBpdGVtID0gZGF0YVtkXTtcclxuXHJcbiAgICAgIGlmIChpdGVtLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgY291bnQgKz0gY291bnRSZXN1bHRzKGl0ZW0uY2hpbGRyZW4pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvdW50Kys7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY291bnQ7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBNaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCAoZGVjb3JhdGVkLCAkZWxlbWVudCwgb3B0aW9ucywgZGF0YUFkYXB0ZXIpIHtcclxuICAgIHRoaXMubWluaW11bVJlc3VsdHNGb3JTZWFyY2ggPSBvcHRpb25zLmdldCgnbWluaW11bVJlc3VsdHNGb3JTZWFyY2gnKTtcclxuXHJcbiAgICBpZiAodGhpcy5taW5pbXVtUmVzdWx0c0ZvclNlYXJjaCA8IDApIHtcclxuICAgICAgdGhpcy5taW5pbXVtUmVzdWx0c0ZvclNlYXJjaCA9IEluZmluaXR5O1xyXG4gICAgfVxyXG5cclxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsICRlbGVtZW50LCBvcHRpb25zLCBkYXRhQWRhcHRlcik7XHJcbiAgfVxyXG5cclxuICBNaW5pbXVtUmVzdWx0c0ZvclNlYXJjaC5wcm90b3R5cGUuc2hvd1NlYXJjaCA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIHBhcmFtcykge1xyXG4gICAgaWYgKGNvdW50UmVzdWx0cyhwYXJhbXMuZGF0YS5yZXN1bHRzKSA8IHRoaXMubWluaW11bVJlc3VsdHNGb3JTZWFyY2gpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBwYXJhbXMpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBNaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDtcclxufSk7XHJcblxyXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZHJvcGRvd24vc2VsZWN0T25DbG9zZScsW1xyXG5cclxuXSwgZnVuY3Rpb24gKCkge1xyXG4gIGZ1bmN0aW9uIFNlbGVjdE9uQ2xvc2UgKCkgeyB9XHJcblxyXG4gIFNlbGVjdE9uQ2xvc2UucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBjb250YWluZXIsICRjb250YWluZXIpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBjb250YWluZXIsICRjb250YWluZXIpO1xyXG5cclxuICAgIGNvbnRhaW5lci5vbignY2xvc2UnLCBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgIHNlbGYuX2hhbmRsZVNlbGVjdE9uQ2xvc2UocGFyYW1zKTtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIFNlbGVjdE9uQ2xvc2UucHJvdG90eXBlLl9oYW5kbGVTZWxlY3RPbkNsb3NlID0gZnVuY3Rpb24gKF8sIHBhcmFtcykge1xyXG4gICAgaWYgKHBhcmFtcyAmJiBwYXJhbXMub3JpZ2luYWxTZWxlY3QyRXZlbnQgIT0gbnVsbCkge1xyXG4gICAgICB2YXIgZXZlbnQgPSBwYXJhbXMub3JpZ2luYWxTZWxlY3QyRXZlbnQ7XHJcblxyXG4gICAgICAvLyBEb24ndCBzZWxlY3QgYW4gaXRlbSBpZiB0aGUgY2xvc2UgZXZlbnQgd2FzIHRyaWdnZXJlZCBmcm9tIGEgc2VsZWN0IG9yXHJcbiAgICAgIC8vIHVuc2VsZWN0IGV2ZW50XHJcbiAgICAgIGlmIChldmVudC5fdHlwZSA9PT0gJ3NlbGVjdCcgfHwgZXZlbnQuX3R5cGUgPT09ICd1bnNlbGVjdCcpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgJGhpZ2hsaWdodGVkUmVzdWx0cyA9IHRoaXMuZ2V0SGlnaGxpZ2h0ZWRSZXN1bHRzKCk7XHJcblxyXG4gICAgLy8gT25seSBzZWxlY3QgaGlnaGxpZ2h0ZWQgcmVzdWx0c1xyXG4gICAgaWYgKCRoaWdobGlnaHRlZFJlc3VsdHMubGVuZ3RoIDwgMSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGRhdGEgPSAkaGlnaGxpZ2h0ZWRSZXN1bHRzLmRhdGEoJ2RhdGEnKTtcclxuXHJcbiAgICAvLyBEb24ndCByZS1zZWxlY3QgYWxyZWFkeSBzZWxlY3RlZCByZXN1bHRlXHJcbiAgICBpZiAoXHJcbiAgICAgIChkYXRhLmVsZW1lbnQgIT0gbnVsbCAmJiBkYXRhLmVsZW1lbnQuc2VsZWN0ZWQpIHx8XHJcbiAgICAgIChkYXRhLmVsZW1lbnQgPT0gbnVsbCAmJiBkYXRhLnNlbGVjdGVkKVxyXG4gICAgKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnRyaWdnZXIoJ3NlbGVjdCcsIHtcclxuICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gU2VsZWN0T25DbG9zZTtcclxufSk7XHJcblxyXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZHJvcGRvd24vY2xvc2VPblNlbGVjdCcsW1xyXG5cclxuXSwgZnVuY3Rpb24gKCkge1xyXG4gIGZ1bmN0aW9uIENsb3NlT25TZWxlY3QgKCkgeyB9XHJcblxyXG4gIENsb3NlT25TZWxlY3QucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBjb250YWluZXIsICRjb250YWluZXIpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBjb250YWluZXIsICRjb250YWluZXIpO1xyXG5cclxuICAgIGNvbnRhaW5lci5vbignc2VsZWN0JywgZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICBzZWxmLl9zZWxlY3RUcmlnZ2VyZWQoZXZ0KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRhaW5lci5vbigndW5zZWxlY3QnLCBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgIHNlbGYuX3NlbGVjdFRyaWdnZXJlZChldnQpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgQ2xvc2VPblNlbGVjdC5wcm90b3R5cGUuX3NlbGVjdFRyaWdnZXJlZCA9IGZ1bmN0aW9uIChfLCBldnQpIHtcclxuICAgIHZhciBvcmlnaW5hbEV2ZW50ID0gZXZ0Lm9yaWdpbmFsRXZlbnQ7XHJcblxyXG4gICAgLy8gRG9uJ3QgY2xvc2UgaWYgdGhlIGNvbnRyb2wga2V5IGlzIGJlaW5nIGhlbGRcclxuICAgIGlmIChvcmlnaW5hbEV2ZW50ICYmIG9yaWdpbmFsRXZlbnQuY3RybEtleSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy50cmlnZ2VyKCdjbG9zZScsIHtcclxuICAgICAgb3JpZ2luYWxFdmVudDogb3JpZ2luYWxFdmVudCxcclxuICAgICAgb3JpZ2luYWxTZWxlY3QyRXZlbnQ6IGV2dFxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIENsb3NlT25TZWxlY3Q7XHJcbn0pO1xyXG5cclxuUzIuZGVmaW5lKCdzZWxlY3QyL2kxOG4vZW4nLFtdLGZ1bmN0aW9uICgpIHtcclxuICAvLyBFbmdsaXNoXHJcbiAgcmV0dXJuIHtcclxuICAgIGVycm9yTG9hZGluZzogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gJ1RoZSByZXN1bHRzIGNvdWxkIG5vdCBiZSBsb2FkZWQuJztcclxuICAgIH0sXHJcbiAgICBpbnB1dFRvb0xvbmc6IGZ1bmN0aW9uIChhcmdzKSB7XHJcbiAgICAgIHZhciBvdmVyQ2hhcnMgPSBhcmdzLmlucHV0Lmxlbmd0aCAtIGFyZ3MubWF4aW11bTtcclxuXHJcbiAgICAgIHZhciBtZXNzYWdlID0gJ1BsZWFzZSBkZWxldGUgJyArIG92ZXJDaGFycyArICcgY2hhcmFjdGVyJztcclxuXHJcbiAgICAgIGlmIChvdmVyQ2hhcnMgIT0gMSkge1xyXG4gICAgICAgIG1lc3NhZ2UgKz0gJ3MnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbWVzc2FnZTtcclxuICAgIH0sXHJcbiAgICBpbnB1dFRvb1Nob3J0OiBmdW5jdGlvbiAoYXJncykge1xyXG4gICAgICB2YXIgcmVtYWluaW5nQ2hhcnMgPSBhcmdzLm1pbmltdW0gLSBhcmdzLmlucHV0Lmxlbmd0aDtcclxuXHJcbiAgICAgIHZhciBtZXNzYWdlID0gJ1BsZWFzZSBlbnRlciAnICsgcmVtYWluaW5nQ2hhcnMgKyAnIG9yIG1vcmUgY2hhcmFjdGVycyc7XHJcblxyXG4gICAgICByZXR1cm4gbWVzc2FnZTtcclxuICAgIH0sXHJcbiAgICBsb2FkaW5nTW9yZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gJ0xvYWRpbmcgbW9yZSByZXN1bHRz4oCmJztcclxuICAgIH0sXHJcbiAgICBtYXhpbXVtU2VsZWN0ZWQ6IGZ1bmN0aW9uIChhcmdzKSB7XHJcbiAgICAgIHZhciBtZXNzYWdlID0gJ1lvdSBjYW4gb25seSBzZWxlY3QgJyArIGFyZ3MubWF4aW11bSArICcgaXRlbSc7XHJcblxyXG4gICAgICBpZiAoYXJncy5tYXhpbXVtICE9IDEpIHtcclxuICAgICAgICBtZXNzYWdlICs9ICdzJztcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIG1lc3NhZ2U7XHJcbiAgICB9LFxyXG4gICAgbm9SZXN1bHRzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiAnTm8gcmVzdWx0cyBmb3VuZCc7XHJcbiAgICB9LFxyXG4gICAgc2VhcmNoaW5nOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiAnU2VhcmNoaW5n4oCmJztcclxuICAgIH1cclxuICB9O1xyXG59KTtcclxuXHJcblMyLmRlZmluZSgnc2VsZWN0Mi9kZWZhdWx0cycsW1xyXG4gICdqcXVlcnknLFxyXG4gICdyZXF1aXJlJyxcclxuXHJcbiAgJy4vcmVzdWx0cycsXHJcblxyXG4gICcuL3NlbGVjdGlvbi9zaW5nbGUnLFxyXG4gICcuL3NlbGVjdGlvbi9tdWx0aXBsZScsXHJcbiAgJy4vc2VsZWN0aW9uL3BsYWNlaG9sZGVyJyxcclxuICAnLi9zZWxlY3Rpb24vYWxsb3dDbGVhcicsXHJcbiAgJy4vc2VsZWN0aW9uL3NlYXJjaCcsXHJcbiAgJy4vc2VsZWN0aW9uL2V2ZW50UmVsYXknLFxyXG5cclxuICAnLi91dGlscycsXHJcbiAgJy4vdHJhbnNsYXRpb24nLFxyXG4gICcuL2RpYWNyaXRpY3MnLFxyXG5cclxuICAnLi9kYXRhL3NlbGVjdCcsXHJcbiAgJy4vZGF0YS9hcnJheScsXHJcbiAgJy4vZGF0YS9hamF4JyxcclxuICAnLi9kYXRhL3RhZ3MnLFxyXG4gICcuL2RhdGEvdG9rZW5pemVyJyxcclxuICAnLi9kYXRhL21pbmltdW1JbnB1dExlbmd0aCcsXHJcbiAgJy4vZGF0YS9tYXhpbXVtSW5wdXRMZW5ndGgnLFxyXG4gICcuL2RhdGEvbWF4aW11bVNlbGVjdGlvbkxlbmd0aCcsXHJcblxyXG4gICcuL2Ryb3Bkb3duJyxcclxuICAnLi9kcm9wZG93bi9zZWFyY2gnLFxyXG4gICcuL2Ryb3Bkb3duL2hpZGVQbGFjZWhvbGRlcicsXHJcbiAgJy4vZHJvcGRvd24vaW5maW5pdGVTY3JvbGwnLFxyXG4gICcuL2Ryb3Bkb3duL2F0dGFjaEJvZHknLFxyXG4gICcuL2Ryb3Bkb3duL21pbmltdW1SZXN1bHRzRm9yU2VhcmNoJyxcclxuICAnLi9kcm9wZG93bi9zZWxlY3RPbkNsb3NlJyxcclxuICAnLi9kcm9wZG93bi9jbG9zZU9uU2VsZWN0JyxcclxuXHJcbiAgJy4vaTE4bi9lbidcclxuXSwgZnVuY3Rpb24gKCQsIHJlcXVpcmUsXHJcblxyXG4gICAgICAgICAgICAgUmVzdWx0c0xpc3QsXHJcblxyXG4gICAgICAgICAgICAgU2luZ2xlU2VsZWN0aW9uLCBNdWx0aXBsZVNlbGVjdGlvbiwgUGxhY2Vob2xkZXIsIEFsbG93Q2xlYXIsXHJcbiAgICAgICAgICAgICBTZWxlY3Rpb25TZWFyY2gsIEV2ZW50UmVsYXksXHJcblxyXG4gICAgICAgICAgICAgVXRpbHMsIFRyYW5zbGF0aW9uLCBESUFDUklUSUNTLFxyXG5cclxuICAgICAgICAgICAgIFNlbGVjdERhdGEsIEFycmF5RGF0YSwgQWpheERhdGEsIFRhZ3MsIFRva2VuaXplcixcclxuICAgICAgICAgICAgIE1pbmltdW1JbnB1dExlbmd0aCwgTWF4aW11bUlucHV0TGVuZ3RoLCBNYXhpbXVtU2VsZWN0aW9uTGVuZ3RoLFxyXG5cclxuICAgICAgICAgICAgIERyb3Bkb3duLCBEcm9wZG93blNlYXJjaCwgSGlkZVBsYWNlaG9sZGVyLCBJbmZpbml0ZVNjcm9sbCxcclxuICAgICAgICAgICAgIEF0dGFjaEJvZHksIE1pbmltdW1SZXN1bHRzRm9yU2VhcmNoLCBTZWxlY3RPbkNsb3NlLCBDbG9zZU9uU2VsZWN0LFxyXG5cclxuICAgICAgICAgICAgIEVuZ2xpc2hUcmFuc2xhdGlvbikge1xyXG4gIGZ1bmN0aW9uIERlZmF1bHRzICgpIHtcclxuICAgIHRoaXMucmVzZXQoKTtcclxuICB9XHJcblxyXG4gIERlZmF1bHRzLnByb3RvdHlwZS5hcHBseSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIHRoaXMuZGVmYXVsdHMsIG9wdGlvbnMpO1xyXG5cclxuICAgIGlmIChvcHRpb25zLmRhdGFBZGFwdGVyID09IG51bGwpIHtcclxuICAgICAgaWYgKG9wdGlvbnMuYWpheCAhPSBudWxsKSB7XHJcbiAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlciA9IEFqYXhEYXRhO1xyXG4gICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlciA9IEFycmF5RGF0YTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvcHRpb25zLmRhdGFBZGFwdGVyID0gU2VsZWN0RGF0YTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG9wdGlvbnMubWluaW11bUlucHV0TGVuZ3RoID4gMCkge1xyXG4gICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcclxuICAgICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIsXHJcbiAgICAgICAgICBNaW5pbXVtSW5wdXRMZW5ndGhcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5tYXhpbXVtSW5wdXRMZW5ndGggPiAwKSB7XHJcbiAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxyXG4gICAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlcixcclxuICAgICAgICAgIE1heGltdW1JbnB1dExlbmd0aFxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChvcHRpb25zLm1heGltdW1TZWxlY3Rpb25MZW5ndGggPiAwKSB7XHJcbiAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxyXG4gICAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlcixcclxuICAgICAgICAgIE1heGltdW1TZWxlY3Rpb25MZW5ndGhcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy50YWdzKSB7XHJcbiAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKG9wdGlvbnMuZGF0YUFkYXB0ZXIsIFRhZ3MpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy50b2tlblNlcGFyYXRvcnMgIT0gbnVsbCB8fCBvcHRpb25zLnRva2VuaXplciAhPSBudWxsKSB7XHJcbiAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxyXG4gICAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlcixcclxuICAgICAgICAgIFRva2VuaXplclxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChvcHRpb25zLnF1ZXJ5ICE9IG51bGwpIHtcclxuICAgICAgICB2YXIgUXVlcnkgPSByZXF1aXJlKG9wdGlvbnMuYW1kQmFzZSArICdjb21wYXQvcXVlcnknKTtcclxuXHJcbiAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxyXG4gICAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlcixcclxuICAgICAgICAgIFF1ZXJ5XHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG9wdGlvbnMuaW5pdFNlbGVjdGlvbiAhPSBudWxsKSB7XHJcbiAgICAgICAgdmFyIEluaXRTZWxlY3Rpb24gPSByZXF1aXJlKG9wdGlvbnMuYW1kQmFzZSArICdjb21wYXQvaW5pdFNlbGVjdGlvbicpO1xyXG5cclxuICAgICAgICBvcHRpb25zLmRhdGFBZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXHJcbiAgICAgICAgICBvcHRpb25zLmRhdGFBZGFwdGVyLFxyXG4gICAgICAgICAgSW5pdFNlbGVjdGlvblxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAob3B0aW9ucy5yZXN1bHRzQWRhcHRlciA9PSBudWxsKSB7XHJcbiAgICAgIG9wdGlvbnMucmVzdWx0c0FkYXB0ZXIgPSBSZXN1bHRzTGlzdDtcclxuXHJcbiAgICAgIGlmIChvcHRpb25zLmFqYXggIT0gbnVsbCkge1xyXG4gICAgICAgIG9wdGlvbnMucmVzdWx0c0FkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcclxuICAgICAgICAgIG9wdGlvbnMucmVzdWx0c0FkYXB0ZXIsXHJcbiAgICAgICAgICBJbmZpbml0ZVNjcm9sbFxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChvcHRpb25zLnBsYWNlaG9sZGVyICE9IG51bGwpIHtcclxuICAgICAgICBvcHRpb25zLnJlc3VsdHNBZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXHJcbiAgICAgICAgICBvcHRpb25zLnJlc3VsdHNBZGFwdGVyLFxyXG4gICAgICAgICAgSGlkZVBsYWNlaG9sZGVyXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG9wdGlvbnMuc2VsZWN0T25DbG9zZSkge1xyXG4gICAgICAgIG9wdGlvbnMucmVzdWx0c0FkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcclxuICAgICAgICAgIG9wdGlvbnMucmVzdWx0c0FkYXB0ZXIsXHJcbiAgICAgICAgICBTZWxlY3RPbkNsb3NlXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRpb25zLmRyb3Bkb3duQWRhcHRlciA9PSBudWxsKSB7XHJcbiAgICAgIGlmIChvcHRpb25zLm11bHRpcGxlKSB7XHJcbiAgICAgICAgb3B0aW9ucy5kcm9wZG93bkFkYXB0ZXIgPSBEcm9wZG93bjtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgU2VhcmNoYWJsZURyb3Bkb3duID0gVXRpbHMuRGVjb3JhdGUoRHJvcGRvd24sIERyb3Bkb3duU2VhcmNoKTtcclxuXHJcbiAgICAgICAgb3B0aW9ucy5kcm9wZG93bkFkYXB0ZXIgPSBTZWFyY2hhYmxlRHJvcGRvd247XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChvcHRpb25zLm1pbmltdW1SZXN1bHRzRm9yU2VhcmNoICE9PSAwKSB7XHJcbiAgICAgICAgb3B0aW9ucy5kcm9wZG93bkFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcclxuICAgICAgICAgIG9wdGlvbnMuZHJvcGRvd25BZGFwdGVyLFxyXG4gICAgICAgICAgTWluaW11bVJlc3VsdHNGb3JTZWFyY2hcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5jbG9zZU9uU2VsZWN0KSB7XHJcbiAgICAgICAgb3B0aW9ucy5kcm9wZG93bkFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcclxuICAgICAgICAgIG9wdGlvbnMuZHJvcGRvd25BZGFwdGVyLFxyXG4gICAgICAgICAgQ2xvc2VPblNlbGVjdFxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChcclxuICAgICAgICBvcHRpb25zLmRyb3Bkb3duQ3NzQ2xhc3MgIT0gbnVsbCB8fFxyXG4gICAgICAgIG9wdGlvbnMuZHJvcGRvd25Dc3MgIT0gbnVsbCB8fFxyXG4gICAgICAgIG9wdGlvbnMuYWRhcHREcm9wZG93bkNzc0NsYXNzICE9IG51bGxcclxuICAgICAgKSB7XHJcbiAgICAgICAgdmFyIERyb3Bkb3duQ1NTID0gcmVxdWlyZShvcHRpb25zLmFtZEJhc2UgKyAnY29tcGF0L2Ryb3Bkb3duQ3NzJyk7XHJcblxyXG4gICAgICAgIG9wdGlvbnMuZHJvcGRvd25BZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXHJcbiAgICAgICAgICBvcHRpb25zLmRyb3Bkb3duQWRhcHRlcixcclxuICAgICAgICAgIERyb3Bkb3duQ1NTXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgb3B0aW9ucy5kcm9wZG93bkFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcclxuICAgICAgICBvcHRpb25zLmRyb3Bkb3duQWRhcHRlcixcclxuICAgICAgICBBdHRhY2hCb2R5XHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9wdGlvbnMuc2VsZWN0aW9uQWRhcHRlciA9PSBudWxsKSB7XHJcbiAgICAgIGlmIChvcHRpb25zLm11bHRpcGxlKSB7XHJcbiAgICAgICAgb3B0aW9ucy5zZWxlY3Rpb25BZGFwdGVyID0gTXVsdGlwbGVTZWxlY3Rpb247XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb3B0aW9ucy5zZWxlY3Rpb25BZGFwdGVyID0gU2luZ2xlU2VsZWN0aW9uO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBBZGQgdGhlIHBsYWNlaG9sZGVyIG1peGluIGlmIGEgcGxhY2Vob2xkZXIgd2FzIHNwZWNpZmllZFxyXG4gICAgICBpZiAob3B0aW9ucy5wbGFjZWhvbGRlciAhPSBudWxsKSB7XHJcbiAgICAgICAgb3B0aW9ucy5zZWxlY3Rpb25BZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXHJcbiAgICAgICAgICBvcHRpb25zLnNlbGVjdGlvbkFkYXB0ZXIsXHJcbiAgICAgICAgICBQbGFjZWhvbGRlclxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChvcHRpb25zLmFsbG93Q2xlYXIpIHtcclxuICAgICAgICBvcHRpb25zLnNlbGVjdGlvbkFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcclxuICAgICAgICAgIG9wdGlvbnMuc2VsZWN0aW9uQWRhcHRlcixcclxuICAgICAgICAgIEFsbG93Q2xlYXJcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5tdWx0aXBsZSkge1xyXG4gICAgICAgIG9wdGlvbnMuc2VsZWN0aW9uQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxyXG4gICAgICAgICAgb3B0aW9ucy5zZWxlY3Rpb25BZGFwdGVyLFxyXG4gICAgICAgICAgU2VsZWN0aW9uU2VhcmNoXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKFxyXG4gICAgICAgIG9wdGlvbnMuY29udGFpbmVyQ3NzQ2xhc3MgIT0gbnVsbCB8fFxyXG4gICAgICAgIG9wdGlvbnMuY29udGFpbmVyQ3NzICE9IG51bGwgfHxcclxuICAgICAgICBvcHRpb25zLmFkYXB0Q29udGFpbmVyQ3NzQ2xhc3MgIT0gbnVsbFxyXG4gICAgICApIHtcclxuICAgICAgICB2YXIgQ29udGFpbmVyQ1NTID0gcmVxdWlyZShvcHRpb25zLmFtZEJhc2UgKyAnY29tcGF0L2NvbnRhaW5lckNzcycpO1xyXG5cclxuICAgICAgICBvcHRpb25zLnNlbGVjdGlvbkFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcclxuICAgICAgICAgIG9wdGlvbnMuc2VsZWN0aW9uQWRhcHRlcixcclxuICAgICAgICAgIENvbnRhaW5lckNTU1xyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG9wdGlvbnMuc2VsZWN0aW9uQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxyXG4gICAgICAgIG9wdGlvbnMuc2VsZWN0aW9uQWRhcHRlcixcclxuICAgICAgICBFdmVudFJlbGF5XHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLmxhbmd1YWdlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAvLyBDaGVjayBpZiB0aGUgbGFuZ3VhZ2UgaXMgc3BlY2lmaWVkIHdpdGggYSByZWdpb25cclxuICAgICAgaWYgKG9wdGlvbnMubGFuZ3VhZ2UuaW5kZXhPZignLScpID4gMCkge1xyXG4gICAgICAgIC8vIEV4dHJhY3QgdGhlIHJlZ2lvbiBpbmZvcm1hdGlvbiBpZiBpdCBpcyBpbmNsdWRlZFxyXG4gICAgICAgIHZhciBsYW5ndWFnZVBhcnRzID0gb3B0aW9ucy5sYW5ndWFnZS5zcGxpdCgnLScpO1xyXG4gICAgICAgIHZhciBiYXNlTGFuZ3VhZ2UgPSBsYW5ndWFnZVBhcnRzWzBdO1xyXG5cclxuICAgICAgICBvcHRpb25zLmxhbmd1YWdlID0gW29wdGlvbnMubGFuZ3VhZ2UsIGJhc2VMYW5ndWFnZV07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb3B0aW9ucy5sYW5ndWFnZSA9IFtvcHRpb25zLmxhbmd1YWdlXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICgkLmlzQXJyYXkob3B0aW9ucy5sYW5ndWFnZSkpIHtcclxuICAgICAgdmFyIGxhbmd1YWdlcyA9IG5ldyBUcmFuc2xhdGlvbigpO1xyXG4gICAgICBvcHRpb25zLmxhbmd1YWdlLnB1c2goJ2VuJyk7XHJcblxyXG4gICAgICB2YXIgbGFuZ3VhZ2VOYW1lcyA9IG9wdGlvbnMubGFuZ3VhZ2U7XHJcblxyXG4gICAgICBmb3IgKHZhciBsID0gMDsgbCA8IGxhbmd1YWdlTmFtZXMubGVuZ3RoOyBsKyspIHtcclxuICAgICAgICB2YXIgbmFtZSA9IGxhbmd1YWdlTmFtZXNbbF07XHJcbiAgICAgICAgdmFyIGxhbmd1YWdlID0ge307XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAvLyBUcnkgdG8gbG9hZCBpdCB3aXRoIHRoZSBvcmlnaW5hbCBuYW1lXHJcbiAgICAgICAgICBsYW5ndWFnZSA9IFRyYW5zbGF0aW9uLmxvYWRQYXRoKG5hbWUpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8vIElmIHdlIGNvdWxkbid0IGxvYWQgaXQsIGNoZWNrIGlmIGl0IHdhc24ndCB0aGUgZnVsbCBwYXRoXHJcbiAgICAgICAgICAgIG5hbWUgPSB0aGlzLmRlZmF1bHRzLmFtZExhbmd1YWdlQmFzZSArIG5hbWU7XHJcbiAgICAgICAgICAgIGxhbmd1YWdlID0gVHJhbnNsYXRpb24ubG9hZFBhdGgobmFtZSk7XHJcbiAgICAgICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAvLyBUaGUgdHJhbnNsYXRpb24gY291bGQgbm90IGJlIGxvYWRlZCBhdCBhbGwuIFNvbWV0aW1lcyB0aGlzIGlzXHJcbiAgICAgICAgICAgIC8vIGJlY2F1c2Ugb2YgYSBjb25maWd1cmF0aW9uIHByb2JsZW0sIG90aGVyIHRpbWVzIHRoaXMgY2FuIGJlXHJcbiAgICAgICAgICAgIC8vIGJlY2F1c2Ugb2YgaG93IFNlbGVjdDIgaGVscHMgbG9hZCBhbGwgcG9zc2libGUgdHJhbnNsYXRpb24gZmlsZXMuXHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmRlYnVnICYmIHdpbmRvdy5jb25zb2xlICYmIGNvbnNvbGUud2Fybikge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybihcclxuICAgICAgICAgICAgICAgICdTZWxlY3QyOiBUaGUgbGFuZ3VhZ2UgZmlsZSBmb3IgXCInICsgbmFtZSArICdcIiBjb3VsZCBub3QgYmUgJyArXHJcbiAgICAgICAgICAgICAgICAnYXV0b21hdGljYWxseSBsb2FkZWQuIEEgZmFsbGJhY2sgd2lsbCBiZSB1c2VkIGluc3RlYWQuJ1xyXG4gICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGFuZ3VhZ2VzLmV4dGVuZChsYW5ndWFnZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG9wdGlvbnMudHJhbnNsYXRpb25zID0gbGFuZ3VhZ2VzO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIGJhc2VUcmFuc2xhdGlvbiA9IFRyYW5zbGF0aW9uLmxvYWRQYXRoKFxyXG4gICAgICAgIHRoaXMuZGVmYXVsdHMuYW1kTGFuZ3VhZ2VCYXNlICsgJ2VuJ1xyXG4gICAgICApO1xyXG4gICAgICB2YXIgY3VzdG9tVHJhbnNsYXRpb24gPSBuZXcgVHJhbnNsYXRpb24ob3B0aW9ucy5sYW5ndWFnZSk7XHJcblxyXG4gICAgICBjdXN0b21UcmFuc2xhdGlvbi5leHRlbmQoYmFzZVRyYW5zbGF0aW9uKTtcclxuXHJcbiAgICAgIG9wdGlvbnMudHJhbnNsYXRpb25zID0gY3VzdG9tVHJhbnNsYXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG9wdGlvbnM7XHJcbiAgfTtcclxuXHJcbiAgRGVmYXVsdHMucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gc3RyaXBEaWFjcml0aWNzICh0ZXh0KSB7XHJcbiAgICAgIC8vIFVzZWQgJ3VuaSByYW5nZSArIG5hbWVkIGZ1bmN0aW9uJyBmcm9tIGh0dHA6Ly9qc3BlcmYuY29tL2RpYWNyaXRpY3MvMThcclxuICAgICAgZnVuY3Rpb24gbWF0Y2goYSkge1xyXG4gICAgICAgIHJldHVybiBESUFDUklUSUNTW2FdIHx8IGE7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1teXFx1MDAwMC1cXHUwMDdFXS9nLCBtYXRjaCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbWF0Y2hlciAocGFyYW1zLCBkYXRhKSB7XHJcbiAgICAgIC8vIEFsd2F5cyByZXR1cm4gdGhlIG9iamVjdCBpZiB0aGVyZSBpcyBub3RoaW5nIHRvIGNvbXBhcmVcclxuICAgICAgaWYgKCQudHJpbShwYXJhbXMudGVybSkgPT09ICcnKSB7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIERvIGEgcmVjdXJzaXZlIGNoZWNrIGZvciBvcHRpb25zIHdpdGggY2hpbGRyZW5cclxuICAgICAgaWYgKGRhdGEuY2hpbGRyZW4gJiYgZGF0YS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgLy8gQ2xvbmUgdGhlIGRhdGEgb2JqZWN0IGlmIHRoZXJlIGFyZSBjaGlsZHJlblxyXG4gICAgICAgIC8vIFRoaXMgaXMgcmVxdWlyZWQgYXMgd2UgbW9kaWZ5IHRoZSBvYmplY3QgdG8gcmVtb3ZlIGFueSBub24tbWF0Y2hlc1xyXG4gICAgICAgIHZhciBtYXRjaCA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkYXRhKTtcclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgZWFjaCBjaGlsZCBvZiB0aGUgb3B0aW9uXHJcbiAgICAgICAgZm9yICh2YXIgYyA9IGRhdGEuY2hpbGRyZW4ubGVuZ3RoIC0gMTsgYyA+PSAwOyBjLS0pIHtcclxuICAgICAgICAgIHZhciBjaGlsZCA9IGRhdGEuY2hpbGRyZW5bY107XHJcblxyXG4gICAgICAgICAgdmFyIG1hdGNoZXMgPSBtYXRjaGVyKHBhcmFtcywgY2hpbGQpO1xyXG5cclxuICAgICAgICAgIC8vIElmIHRoZXJlIHdhc24ndCBhIG1hdGNoLCByZW1vdmUgdGhlIG9iamVjdCBpbiB0aGUgYXJyYXlcclxuICAgICAgICAgIGlmIChtYXRjaGVzID09IG51bGwpIHtcclxuICAgICAgICAgICAgbWF0Y2guY2hpbGRyZW4uc3BsaWNlKGMsIDEpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSWYgYW55IGNoaWxkcmVuIG1hdGNoZWQsIHJldHVybiB0aGUgbmV3IG9iamVjdFxyXG4gICAgICAgIGlmIChtYXRjaC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gbWF0Y2g7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBJZiB0aGVyZSB3ZXJlIG5vIG1hdGNoaW5nIGNoaWxkcmVuLCBjaGVjayBqdXN0IHRoZSBwbGFpbiBvYmplY3RcclxuICAgICAgICByZXR1cm4gbWF0Y2hlcihwYXJhbXMsIG1hdGNoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIG9yaWdpbmFsID0gc3RyaXBEaWFjcml0aWNzKGRhdGEudGV4dCkudG9VcHBlckNhc2UoKTtcclxuICAgICAgdmFyIHRlcm0gPSBzdHJpcERpYWNyaXRpY3MocGFyYW1zLnRlcm0pLnRvVXBwZXJDYXNlKCk7XHJcblxyXG4gICAgICAvLyBDaGVjayBpZiB0aGUgdGV4dCBjb250YWlucyB0aGUgdGVybVxyXG4gICAgICBpZiAob3JpZ2luYWwuaW5kZXhPZih0ZXJtKSA+IC0xKSB7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIElmIGl0IGRvZXNuJ3QgY29udGFpbiB0aGUgdGVybSwgZG9uJ3QgcmV0dXJuIGFueXRoaW5nXHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZGVmYXVsdHMgPSB7XHJcbiAgICAgIGFtZEJhc2U6ICcuLycsXHJcbiAgICAgIGFtZExhbmd1YWdlQmFzZTogJy4vaTE4bi8nLFxyXG4gICAgICBjbG9zZU9uU2VsZWN0OiB0cnVlLFxyXG4gICAgICBkZWJ1ZzogZmFsc2UsXHJcbiAgICAgIGRyb3Bkb3duQXV0b1dpZHRoOiBmYWxzZSxcclxuICAgICAgZXNjYXBlTWFya3VwOiBVdGlscy5lc2NhcGVNYXJrdXAsXHJcbiAgICAgIGxhbmd1YWdlOiBFbmdsaXNoVHJhbnNsYXRpb24sXHJcbiAgICAgIG1hdGNoZXI6IG1hdGNoZXIsXHJcbiAgICAgIG1pbmltdW1JbnB1dExlbmd0aDogMCxcclxuICAgICAgbWF4aW11bUlucHV0TGVuZ3RoOiAwLFxyXG4gICAgICBtYXhpbXVtU2VsZWN0aW9uTGVuZ3RoOiAwLFxyXG4gICAgICBtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaDogMCxcclxuICAgICAgc2VsZWN0T25DbG9zZTogZmFsc2UsXHJcbiAgICAgIHNvcnRlcjogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgfSxcclxuICAgICAgdGVtcGxhdGVSZXN1bHQ6IGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICByZXR1cm4gcmVzdWx0LnRleHQ7XHJcbiAgICAgIH0sXHJcbiAgICAgIHRlbXBsYXRlU2VsZWN0aW9uOiBmdW5jdGlvbiAoc2VsZWN0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIHNlbGVjdGlvbi50ZXh0O1xyXG4gICAgICB9LFxyXG4gICAgICB0aGVtZTogJ2RlZmF1bHQnLFxyXG4gICAgICB3aWR0aDogJ3Jlc29sdmUnXHJcbiAgICB9O1xyXG4gIH07XHJcblxyXG4gIERlZmF1bHRzLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgdmFyIGNhbWVsS2V5ID0gJC5jYW1lbENhc2Uoa2V5KTtcclxuXHJcbiAgICB2YXIgZGF0YSA9IHt9O1xyXG4gICAgZGF0YVtjYW1lbEtleV0gPSB2YWx1ZTtcclxuXHJcbiAgICB2YXIgY29udmVydGVkRGF0YSA9IFV0aWxzLl9jb252ZXJ0RGF0YShkYXRhKTtcclxuXHJcbiAgICAkLmV4dGVuZCh0aGlzLmRlZmF1bHRzLCBjb252ZXJ0ZWREYXRhKTtcclxuICB9O1xyXG5cclxuICB2YXIgZGVmYXVsdHMgPSBuZXcgRGVmYXVsdHMoKTtcclxuXHJcbiAgcmV0dXJuIGRlZmF1bHRzO1xyXG59KTtcclxuXHJcblMyLmRlZmluZSgnc2VsZWN0Mi9vcHRpb25zJyxbXHJcbiAgJ3JlcXVpcmUnLFxyXG4gICdqcXVlcnknLFxyXG4gICcuL2RlZmF1bHRzJyxcclxuICAnLi91dGlscydcclxuXSwgZnVuY3Rpb24gKHJlcXVpcmUsICQsIERlZmF1bHRzLCBVdGlscykge1xyXG4gIGZ1bmN0aW9uIE9wdGlvbnMgKG9wdGlvbnMsICRlbGVtZW50KSB7XHJcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xyXG5cclxuICAgIGlmICgkZWxlbWVudCAhPSBudWxsKSB7XHJcbiAgICAgIHRoaXMuZnJvbUVsZW1lbnQoJGVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub3B0aW9ucyA9IERlZmF1bHRzLmFwcGx5KHRoaXMub3B0aW9ucyk7XHJcblxyXG4gICAgaWYgKCRlbGVtZW50ICYmICRlbGVtZW50LmlzKCdpbnB1dCcpKSB7XHJcbiAgICAgIHZhciBJbnB1dENvbXBhdCA9IHJlcXVpcmUodGhpcy5nZXQoJ2FtZEJhc2UnKSArICdjb21wYXQvaW5wdXREYXRhJyk7XHJcblxyXG4gICAgICB0aGlzLm9wdGlvbnMuZGF0YUFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcclxuICAgICAgICB0aGlzLm9wdGlvbnMuZGF0YUFkYXB0ZXIsXHJcbiAgICAgICAgSW5wdXRDb21wYXRcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIE9wdGlvbnMucHJvdG90eXBlLmZyb21FbGVtZW50ID0gZnVuY3Rpb24gKCRlKSB7XHJcbiAgICB2YXIgZXhjbHVkZWREYXRhID0gWydzZWxlY3QyJ107XHJcblxyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5tdWx0aXBsZSA9PSBudWxsKSB7XHJcbiAgICAgIHRoaXMub3B0aW9ucy5tdWx0aXBsZSA9ICRlLnByb3AoJ211bHRpcGxlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5kaXNhYmxlZCA9PSBudWxsKSB7XHJcbiAgICAgIHRoaXMub3B0aW9ucy5kaXNhYmxlZCA9ICRlLnByb3AoJ2Rpc2FibGVkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5sYW5ndWFnZSA9PSBudWxsKSB7XHJcbiAgICAgIGlmICgkZS5wcm9wKCdsYW5nJykpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMubGFuZ3VhZ2UgPSAkZS5wcm9wKCdsYW5nJykudG9Mb3dlckNhc2UoKTtcclxuICAgICAgfSBlbHNlIGlmICgkZS5jbG9zZXN0KCdbbGFuZ10nKS5wcm9wKCdsYW5nJykpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMubGFuZ3VhZ2UgPSAkZS5jbG9zZXN0KCdbbGFuZ10nKS5wcm9wKCdsYW5nJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLmRpciA9PSBudWxsKSB7XHJcbiAgICAgIGlmICgkZS5wcm9wKCdkaXInKSkge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5kaXIgPSAkZS5wcm9wKCdkaXInKTtcclxuICAgICAgfSBlbHNlIGlmICgkZS5jbG9zZXN0KCdbZGlyXScpLnByb3AoJ2RpcicpKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmRpciA9ICRlLmNsb3Nlc3QoJ1tkaXJdJykucHJvcCgnZGlyJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmRpciA9ICdsdHInO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJGUucHJvcCgnZGlzYWJsZWQnLCB0aGlzLm9wdGlvbnMuZGlzYWJsZWQpO1xyXG4gICAgJGUucHJvcCgnbXVsdGlwbGUnLCB0aGlzLm9wdGlvbnMubXVsdGlwbGUpO1xyXG5cclxuICAgIGlmICgkZS5kYXRhKCdzZWxlY3QyVGFncycpKSB7XHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWcgJiYgd2luZG93LmNvbnNvbGUgJiYgY29uc29sZS53YXJuKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKFxyXG4gICAgICAgICAgJ1NlbGVjdDI6IFRoZSBgZGF0YS1zZWxlY3QyLXRhZ3NgIGF0dHJpYnV0ZSBoYXMgYmVlbiBjaGFuZ2VkIHRvICcgK1xyXG4gICAgICAgICAgJ3VzZSB0aGUgYGRhdGEtZGF0YWAgYW5kIGBkYXRhLXRhZ3M9XCJ0cnVlXCJgIGF0dHJpYnV0ZXMgYW5kIHdpbGwgYmUgJyArXHJcbiAgICAgICAgICAncmVtb3ZlZCBpbiBmdXR1cmUgdmVyc2lvbnMgb2YgU2VsZWN0Mi4nXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgJGUuZGF0YSgnZGF0YScsICRlLmRhdGEoJ3NlbGVjdDJUYWdzJykpO1xyXG4gICAgICAkZS5kYXRhKCd0YWdzJywgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCRlLmRhdGEoJ2FqYXhVcmwnKSkge1xyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnICYmIHdpbmRvdy5jb25zb2xlICYmIGNvbnNvbGUud2Fybikge1xyXG4gICAgICAgIGNvbnNvbGUud2FybihcclxuICAgICAgICAgICdTZWxlY3QyOiBUaGUgYGRhdGEtYWpheC11cmxgIGF0dHJpYnV0ZSBoYXMgYmVlbiBjaGFuZ2VkIHRvICcgK1xyXG4gICAgICAgICAgJ2BkYXRhLWFqYXgtLXVybGAgYW5kIHN1cHBvcnQgZm9yIHRoZSBvbGQgYXR0cmlidXRlIHdpbGwgYmUgcmVtb3ZlZCcgK1xyXG4gICAgICAgICAgJyBpbiBmdXR1cmUgdmVyc2lvbnMgb2YgU2VsZWN0Mi4nXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgJGUuYXR0cignYWpheC0tdXJsJywgJGUuZGF0YSgnYWpheFVybCcpKTtcclxuICAgICAgJGUuZGF0YSgnYWpheC0tdXJsJywgJGUuZGF0YSgnYWpheFVybCcpKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZGF0YXNldCA9IHt9O1xyXG5cclxuICAgIC8vIFByZWZlciB0aGUgZWxlbWVudCdzIGBkYXRhc2V0YCBhdHRyaWJ1dGUgaWYgaXQgZXhpc3RzXHJcbiAgICAvLyBqUXVlcnkgMS54IGRvZXMgbm90IGNvcnJlY3RseSBoYW5kbGUgZGF0YSBhdHRyaWJ1dGVzIHdpdGggbXVsdGlwbGUgZGFzaGVzXHJcbiAgICBpZiAoJC5mbi5qcXVlcnkgJiYgJC5mbi5qcXVlcnkuc3Vic3RyKDAsIDIpID09ICcxLicgJiYgJGVbMF0uZGF0YXNldCkge1xyXG4gICAgICBkYXRhc2V0ID0gJC5leHRlbmQodHJ1ZSwge30sICRlWzBdLmRhdGFzZXQsICRlLmRhdGEoKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkYXRhc2V0ID0gJGUuZGF0YSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBkYXRhID0gJC5leHRlbmQodHJ1ZSwge30sIGRhdGFzZXQpO1xyXG5cclxuICAgIGRhdGEgPSBVdGlscy5fY29udmVydERhdGEoZGF0YSk7XHJcblxyXG4gICAgZm9yICh2YXIga2V5IGluIGRhdGEpIHtcclxuICAgICAgaWYgKCQuaW5BcnJheShrZXksIGV4Y2x1ZGVkRGF0YSkgPiAtMSkge1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoJC5pc1BsYWluT2JqZWN0KHRoaXMub3B0aW9uc1trZXldKSkge1xyXG4gICAgICAgICQuZXh0ZW5kKHRoaXMub3B0aW9uc1trZXldLCBkYXRhW2tleV0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMub3B0aW9uc1trZXldID0gZGF0YVtrZXldO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfTtcclxuXHJcbiAgT3B0aW9ucy5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgcmV0dXJuIHRoaXMub3B0aW9uc1trZXldO1xyXG4gIH07XHJcblxyXG4gIE9wdGlvbnMucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChrZXksIHZhbCkge1xyXG4gICAgdGhpcy5vcHRpb25zW2tleV0gPSB2YWw7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIE9wdGlvbnM7XHJcbn0pO1xyXG5cclxuUzIuZGVmaW5lKCdzZWxlY3QyL2NvcmUnLFtcclxuICAnanF1ZXJ5JyxcclxuICAnLi9vcHRpb25zJyxcclxuICAnLi91dGlscycsXHJcbiAgJy4va2V5cydcclxuXSwgZnVuY3Rpb24gKCQsIE9wdGlvbnMsIFV0aWxzLCBLRVlTKSB7XHJcbiAgdmFyIFNlbGVjdDIgPSBmdW5jdGlvbiAoJGVsZW1lbnQsIG9wdGlvbnMpIHtcclxuICAgIGlmICgkZWxlbWVudC5kYXRhKCdzZWxlY3QyJykgIT0gbnVsbCkge1xyXG4gICAgICAkZWxlbWVudC5kYXRhKCdzZWxlY3QyJykuZGVzdHJveSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuJGVsZW1lbnQgPSAkZWxlbWVudDtcclxuXHJcbiAgICB0aGlzLmlkID0gdGhpcy5fZ2VuZXJhdGVJZCgkZWxlbWVudCk7XHJcblxyXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblxyXG4gICAgdGhpcy5vcHRpb25zID0gbmV3IE9wdGlvbnMob3B0aW9ucywgJGVsZW1lbnQpO1xyXG5cclxuICAgIFNlbGVjdDIuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcyk7XHJcblxyXG4gICAgLy8gU2V0IHVwIHRoZSB0YWJpbmRleFxyXG5cclxuICAgIHZhciB0YWJpbmRleCA9ICRlbGVtZW50LmF0dHIoJ3RhYmluZGV4JykgfHwgMDtcclxuICAgICRlbGVtZW50LmRhdGEoJ29sZC10YWJpbmRleCcsIHRhYmluZGV4KTtcclxuICAgICRlbGVtZW50LmF0dHIoJ3RhYmluZGV4JywgJy0xJyk7XHJcblxyXG4gICAgLy8gU2V0IHVwIGNvbnRhaW5lcnMgYW5kIGFkYXB0ZXJzXHJcblxyXG4gICAgdmFyIERhdGFBZGFwdGVyID0gdGhpcy5vcHRpb25zLmdldCgnZGF0YUFkYXB0ZXInKTtcclxuICAgIHRoaXMuZGF0YUFkYXB0ZXIgPSBuZXcgRGF0YUFkYXB0ZXIoJGVsZW1lbnQsIHRoaXMub3B0aW9ucyk7XHJcblxyXG4gICAgdmFyICRjb250YWluZXIgPSB0aGlzLnJlbmRlcigpO1xyXG5cclxuICAgIHRoaXMuX3BsYWNlQ29udGFpbmVyKCRjb250YWluZXIpO1xyXG5cclxuICAgIHZhciBTZWxlY3Rpb25BZGFwdGVyID0gdGhpcy5vcHRpb25zLmdldCgnc2VsZWN0aW9uQWRhcHRlcicpO1xyXG4gICAgdGhpcy5zZWxlY3Rpb24gPSBuZXcgU2VsZWN0aW9uQWRhcHRlcigkZWxlbWVudCwgdGhpcy5vcHRpb25zKTtcclxuICAgIHRoaXMuJHNlbGVjdGlvbiA9IHRoaXMuc2VsZWN0aW9uLnJlbmRlcigpO1xyXG5cclxuICAgIHRoaXMuc2VsZWN0aW9uLnBvc2l0aW9uKHRoaXMuJHNlbGVjdGlvbiwgJGNvbnRhaW5lcik7XHJcblxyXG4gICAgdmFyIERyb3Bkb3duQWRhcHRlciA9IHRoaXMub3B0aW9ucy5nZXQoJ2Ryb3Bkb3duQWRhcHRlcicpO1xyXG4gICAgdGhpcy5kcm9wZG93biA9IG5ldyBEcm9wZG93bkFkYXB0ZXIoJGVsZW1lbnQsIHRoaXMub3B0aW9ucyk7XHJcbiAgICB0aGlzLiRkcm9wZG93biA9IHRoaXMuZHJvcGRvd24ucmVuZGVyKCk7XHJcblxyXG4gICAgdGhpcy5kcm9wZG93bi5wb3NpdGlvbih0aGlzLiRkcm9wZG93biwgJGNvbnRhaW5lcik7XHJcblxyXG4gICAgdmFyIFJlc3VsdHNBZGFwdGVyID0gdGhpcy5vcHRpb25zLmdldCgncmVzdWx0c0FkYXB0ZXInKTtcclxuICAgIHRoaXMucmVzdWx0cyA9IG5ldyBSZXN1bHRzQWRhcHRlcigkZWxlbWVudCwgdGhpcy5vcHRpb25zLCB0aGlzLmRhdGFBZGFwdGVyKTtcclxuICAgIHRoaXMuJHJlc3VsdHMgPSB0aGlzLnJlc3VsdHMucmVuZGVyKCk7XHJcblxyXG4gICAgdGhpcy5yZXN1bHRzLnBvc2l0aW9uKHRoaXMuJHJlc3VsdHMsIHRoaXMuJGRyb3Bkb3duKTtcclxuXHJcbiAgICAvLyBCaW5kIGV2ZW50c1xyXG5cclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAvLyBCaW5kIHRoZSBjb250YWluZXIgdG8gYWxsIG9mIHRoZSBhZGFwdGVyc1xyXG4gICAgdGhpcy5fYmluZEFkYXB0ZXJzKCk7XHJcblxyXG4gICAgLy8gUmVnaXN0ZXIgYW55IERPTSBldmVudCBoYW5kbGVyc1xyXG4gICAgdGhpcy5fcmVnaXN0ZXJEb21FdmVudHMoKTtcclxuXHJcbiAgICAvLyBSZWdpc3RlciBhbnkgaW50ZXJuYWwgZXZlbnQgaGFuZGxlcnNcclxuICAgIHRoaXMuX3JlZ2lzdGVyRGF0YUV2ZW50cygpO1xyXG4gICAgdGhpcy5fcmVnaXN0ZXJTZWxlY3Rpb25FdmVudHMoKTtcclxuICAgIHRoaXMuX3JlZ2lzdGVyRHJvcGRvd25FdmVudHMoKTtcclxuICAgIHRoaXMuX3JlZ2lzdGVyUmVzdWx0c0V2ZW50cygpO1xyXG4gICAgdGhpcy5fcmVnaXN0ZXJFdmVudHMoKTtcclxuXHJcbiAgICAvLyBTZXQgdGhlIGluaXRpYWwgc3RhdGVcclxuICAgIHRoaXMuZGF0YUFkYXB0ZXIuY3VycmVudChmdW5jdGlvbiAoaW5pdGlhbERhdGEpIHtcclxuICAgICAgc2VsZi50cmlnZ2VyKCdzZWxlY3Rpb246dXBkYXRlJywge1xyXG4gICAgICAgIGRhdGE6IGluaXRpYWxEYXRhXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gSGlkZSB0aGUgb3JpZ2luYWwgc2VsZWN0XHJcbiAgICAkZWxlbWVudC5hZGRDbGFzcygnc2VsZWN0Mi1oaWRkZW4tYWNjZXNzaWJsZScpO1xyXG4gICAgJGVsZW1lbnQuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG5cclxuICAgIC8vIFN5bmNocm9uaXplIGFueSBtb25pdG9yZWQgYXR0cmlidXRlc1xyXG4gICAgdGhpcy5fc3luY0F0dHJpYnV0ZXMoKTtcclxuXHJcbiAgICAkZWxlbWVudC5kYXRhKCdzZWxlY3QyJywgdGhpcyk7XHJcbiAgfTtcclxuXHJcbiAgVXRpbHMuRXh0ZW5kKFNlbGVjdDIsIFV0aWxzLk9ic2VydmFibGUpO1xyXG5cclxuICBTZWxlY3QyLnByb3RvdHlwZS5fZ2VuZXJhdGVJZCA9IGZ1bmN0aW9uICgkZWxlbWVudCkge1xyXG4gICAgdmFyIGlkID0gJyc7XHJcblxyXG4gICAgaWYgKCRlbGVtZW50LmF0dHIoJ2lkJykgIT0gbnVsbCkge1xyXG4gICAgICBpZCA9ICRlbGVtZW50LmF0dHIoJ2lkJyk7XHJcbiAgICB9IGVsc2UgaWYgKCRlbGVtZW50LmF0dHIoJ25hbWUnKSAhPSBudWxsKSB7XHJcbiAgICAgIGlkID0gJGVsZW1lbnQuYXR0cignbmFtZScpICsgJy0nICsgVXRpbHMuZ2VuZXJhdGVDaGFycygyKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlkID0gVXRpbHMuZ2VuZXJhdGVDaGFycyg0KTtcclxuICAgIH1cclxuXHJcbiAgICBpZCA9IGlkLnJlcGxhY2UoLyg6fFxcLnxcXFt8XFxdfCwpL2csICcnKTtcclxuICAgIGlkID0gJ3NlbGVjdDItJyArIGlkO1xyXG5cclxuICAgIHJldHVybiBpZDtcclxuICB9O1xyXG5cclxuICBTZWxlY3QyLnByb3RvdHlwZS5fcGxhY2VDb250YWluZXIgPSBmdW5jdGlvbiAoJGNvbnRhaW5lcikge1xyXG4gICAgJGNvbnRhaW5lci5pbnNlcnRBZnRlcih0aGlzLiRlbGVtZW50KTtcclxuXHJcbiAgICB2YXIgd2lkdGggPSB0aGlzLl9yZXNvbHZlV2lkdGgodGhpcy4kZWxlbWVudCwgdGhpcy5vcHRpb25zLmdldCgnd2lkdGgnKSk7XHJcblxyXG4gICAgaWYgKHdpZHRoICE9IG51bGwpIHtcclxuICAgICAgJGNvbnRhaW5lci5jc3MoJ3dpZHRoJywgd2lkdGgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIFNlbGVjdDIucHJvdG90eXBlLl9yZXNvbHZlV2lkdGggPSBmdW5jdGlvbiAoJGVsZW1lbnQsIG1ldGhvZCkge1xyXG4gICAgdmFyIFdJRFRIID0gL153aWR0aDooKFstK10/KFswLTldKlxcLik/WzAtOV0rKShweHxlbXxleHwlfGlufGNtfG1tfHB0fHBjKSkvaTtcclxuXHJcbiAgICBpZiAobWV0aG9kID09ICdyZXNvbHZlJykge1xyXG4gICAgICB2YXIgc3R5bGVXaWR0aCA9IHRoaXMuX3Jlc29sdmVXaWR0aCgkZWxlbWVudCwgJ3N0eWxlJyk7XHJcblxyXG4gICAgICBpZiAoc3R5bGVXaWR0aCAhPSBudWxsKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0eWxlV2lkdGg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNvbHZlV2lkdGgoJGVsZW1lbnQsICdlbGVtZW50Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1ldGhvZCA9PSAnZWxlbWVudCcpIHtcclxuICAgICAgdmFyIGVsZW1lbnRXaWR0aCA9ICRlbGVtZW50Lm91dGVyV2lkdGgoZmFsc2UpO1xyXG5cclxuICAgICAgaWYgKGVsZW1lbnRXaWR0aCA8PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuICdhdXRvJztcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGVsZW1lbnRXaWR0aCArICdweCc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1ldGhvZCA9PSAnc3R5bGUnKSB7XHJcbiAgICAgIHZhciBzdHlsZSA9ICRlbGVtZW50LmF0dHIoJ3N0eWxlJyk7XHJcblxyXG4gICAgICBpZiAodHlwZW9mKHN0eWxlKSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGF0dHJzID0gc3R5bGUuc3BsaXQoJzsnKTtcclxuXHJcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gYXR0cnMubGVuZ3RoOyBpIDwgbDsgaSA9IGkgKyAxKSB7XHJcbiAgICAgICAgdmFyIGF0dHIgPSBhdHRyc1tpXS5yZXBsYWNlKC9cXHMvZywgJycpO1xyXG4gICAgICAgIHZhciBtYXRjaGVzID0gYXR0ci5tYXRjaChXSURUSCk7XHJcblxyXG4gICAgICAgIGlmIChtYXRjaGVzICE9PSBudWxsICYmIG1hdGNoZXMubGVuZ3RoID49IDEpIHtcclxuICAgICAgICAgIHJldHVybiBtYXRjaGVzWzFdO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1ldGhvZDtcclxuICB9O1xyXG5cclxuICBTZWxlY3QyLnByb3RvdHlwZS5fYmluZEFkYXB0ZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5kYXRhQWRhcHRlci5iaW5kKHRoaXMsIHRoaXMuJGNvbnRhaW5lcik7XHJcbiAgICB0aGlzLnNlbGVjdGlvbi5iaW5kKHRoaXMsIHRoaXMuJGNvbnRhaW5lcik7XHJcblxyXG4gICAgdGhpcy5kcm9wZG93bi5iaW5kKHRoaXMsIHRoaXMuJGNvbnRhaW5lcik7XHJcbiAgICB0aGlzLnJlc3VsdHMuYmluZCh0aGlzLCB0aGlzLiRjb250YWluZXIpO1xyXG4gIH07XHJcblxyXG4gIFNlbGVjdDIucHJvdG90eXBlLl9yZWdpc3RlckRvbUV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICB0aGlzLiRlbGVtZW50Lm9uKCdjaGFuZ2Uuc2VsZWN0MicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgc2VsZi5kYXRhQWRhcHRlci5jdXJyZW50KGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgc2VsZi50cmlnZ2VyKCdzZWxlY3Rpb246dXBkYXRlJywge1xyXG4gICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuJGVsZW1lbnQub24oJ2ZvY3VzLnNlbGVjdDInLCBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgIHNlbGYudHJpZ2dlcignZm9jdXMnLCBldnQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5fc3luY0EgPSBVdGlscy5iaW5kKHRoaXMuX3N5bmNBdHRyaWJ1dGVzLCB0aGlzKTtcclxuICAgIHRoaXMuX3N5bmNTID0gVXRpbHMuYmluZCh0aGlzLl9zeW5jU3VidHJlZSwgdGhpcyk7XHJcblxyXG4gICAgaWYgKHRoaXMuJGVsZW1lbnRbMF0uYXR0YWNoRXZlbnQpIHtcclxuICAgICAgdGhpcy4kZWxlbWVudFswXS5hdHRhY2hFdmVudCgnb25wcm9wZXJ0eWNoYW5nZScsIHRoaXMuX3N5bmNBKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgb2JzZXJ2ZXIgPSB3aW5kb3cuTXV0YXRpb25PYnNlcnZlciB8fFxyXG4gICAgICB3aW5kb3cuV2ViS2l0TXV0YXRpb25PYnNlcnZlciB8fFxyXG4gICAgICB3aW5kb3cuTW96TXV0YXRpb25PYnNlcnZlclxyXG4gICAgO1xyXG5cclxuICAgIGlmIChvYnNlcnZlciAhPSBudWxsKSB7XHJcbiAgICAgIHRoaXMuX29ic2VydmVyID0gbmV3IG9ic2VydmVyKGZ1bmN0aW9uIChtdXRhdGlvbnMpIHtcclxuICAgICAgICAkLmVhY2gobXV0YXRpb25zLCBzZWxmLl9zeW5jQSk7XHJcbiAgICAgICAgJC5lYWNoKG11dGF0aW9ucywgc2VsZi5fc3luY1MpO1xyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy5fb2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLiRlbGVtZW50WzBdLCB7XHJcbiAgICAgICAgYXR0cmlidXRlczogdHJ1ZSxcclxuICAgICAgICBjaGlsZExpc3Q6IHRydWUsXHJcbiAgICAgICAgc3VidHJlZTogZmFsc2VcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuJGVsZW1lbnRbMF0uYWRkRXZlbnRMaXN0ZW5lcikge1xyXG4gICAgICB0aGlzLiRlbGVtZW50WzBdLmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgICAgJ0RPTUF0dHJNb2RpZmllZCcsXHJcbiAgICAgICAgc2VsZi5fc3luY0EsXHJcbiAgICAgICAgZmFsc2VcclxuICAgICAgKTtcclxuICAgICAgdGhpcy4kZWxlbWVudFswXS5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICAgICdET01Ob2RlSW5zZXJ0ZWQnLFxyXG4gICAgICAgIHNlbGYuX3N5bmNTLFxyXG4gICAgICAgIGZhbHNlXHJcbiAgICAgICk7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnRbMF0uYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgICAnRE9NTm9kZVJlbW92ZWQnLFxyXG4gICAgICAgIHNlbGYuX3N5bmNTLFxyXG4gICAgICAgIGZhbHNlXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgU2VsZWN0Mi5wcm90b3R5cGUuX3JlZ2lzdGVyRGF0YUV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICB0aGlzLmRhdGFBZGFwdGVyLm9uKCcqJywgZnVuY3Rpb24gKG5hbWUsIHBhcmFtcykge1xyXG4gICAgICBzZWxmLnRyaWdnZXIobmFtZSwgcGFyYW1zKTtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIFNlbGVjdDIucHJvdG90eXBlLl9yZWdpc3RlclNlbGVjdGlvbkV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHZhciBub25SZWxheUV2ZW50cyA9IFsndG9nZ2xlJywgJ2ZvY3VzJ107XHJcblxyXG4gICAgdGhpcy5zZWxlY3Rpb24ub24oJ3RvZ2dsZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgc2VsZi50b2dnbGVEcm9wZG93bigpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5zZWxlY3Rpb24ub24oJ2ZvY3VzJywgZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICBzZWxmLmZvY3VzKHBhcmFtcyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnNlbGVjdGlvbi5vbignKicsIGZ1bmN0aW9uIChuYW1lLCBwYXJhbXMpIHtcclxuICAgICAgaWYgKCQuaW5BcnJheShuYW1lLCBub25SZWxheUV2ZW50cykgIT09IC0xKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzZWxmLnRyaWdnZXIobmFtZSwgcGFyYW1zKTtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIFNlbGVjdDIucHJvdG90eXBlLl9yZWdpc3RlckRyb3Bkb3duRXZlbnRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHRoaXMuZHJvcGRvd24ub24oJyonLCBmdW5jdGlvbiAobmFtZSwgcGFyYW1zKSB7XHJcbiAgICAgIHNlbGYudHJpZ2dlcihuYW1lLCBwYXJhbXMpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgU2VsZWN0Mi5wcm90b3R5cGUuX3JlZ2lzdGVyUmVzdWx0c0V2ZW50cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICB0aGlzLnJlc3VsdHMub24oJyonLCBmdW5jdGlvbiAobmFtZSwgcGFyYW1zKSB7XHJcbiAgICAgIHNlbGYudHJpZ2dlcihuYW1lLCBwYXJhbXMpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgU2VsZWN0Mi5wcm90b3R5cGUuX3JlZ2lzdGVyRXZlbnRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHRoaXMub24oJ29wZW4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHNlbGYuJGNvbnRhaW5lci5hZGRDbGFzcygnc2VsZWN0Mi1jb250YWluZXItLW9wZW4nKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMub24oJ2Nsb3NlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICBzZWxmLiRjb250YWluZXIucmVtb3ZlQ2xhc3MoJ3NlbGVjdDItY29udGFpbmVyLS1vcGVuJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLm9uKCdlbmFibGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHNlbGYuJGNvbnRhaW5lci5yZW1vdmVDbGFzcygnc2VsZWN0Mi1jb250YWluZXItLWRpc2FibGVkJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLm9uKCdkaXNhYmxlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICBzZWxmLiRjb250YWluZXIuYWRkQ2xhc3MoJ3NlbGVjdDItY29udGFpbmVyLS1kaXNhYmxlZCcpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5vbignYmx1cicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgc2VsZi4kY29udGFpbmVyLnJlbW92ZUNsYXNzKCdzZWxlY3QyLWNvbnRhaW5lci0tZm9jdXMnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMub24oJ3F1ZXJ5JywgZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICBpZiAoIXNlbGYuaXNPcGVuKCkpIHtcclxuICAgICAgICBzZWxmLnRyaWdnZXIoJ29wZW4nLCB7fSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuZGF0YUFkYXB0ZXIucXVlcnkocGFyYW1zLCBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgIHNlbGYudHJpZ2dlcigncmVzdWx0czphbGwnLCB7XHJcbiAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgcXVlcnk6IHBhcmFtc1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMub24oJ3F1ZXJ5OmFwcGVuZCcsIGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgdGhpcy5kYXRhQWRhcHRlci5xdWVyeShwYXJhbXMsIGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgc2VsZi50cmlnZ2VyKCdyZXN1bHRzOmFwcGVuZCcsIHtcclxuICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICBxdWVyeTogcGFyYW1zXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5vbigna2V5cHJlc3MnLCBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgIHZhciBrZXkgPSBldnQud2hpY2g7XHJcblxyXG4gICAgICBpZiAoc2VsZi5pc09wZW4oKSkge1xyXG4gICAgICAgIGlmIChrZXkgPT09IEtFWVMuRVNDIHx8IGtleSA9PT0gS0VZUy5UQUIgfHxcclxuICAgICAgICAgICAgKGtleSA9PT0gS0VZUy5VUCAmJiBldnQuYWx0S2V5KSkge1xyXG4gICAgICAgICAgc2VsZi5jbG9zZSgpO1xyXG5cclxuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSBLRVlTLkVOVEVSKSB7XHJcbiAgICAgICAgICBzZWxmLnRyaWdnZXIoJ3Jlc3VsdHM6c2VsZWN0Jywge30pO1xyXG5cclxuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoKGtleSA9PT0gS0VZUy5TUEFDRSAmJiBldnQuY3RybEtleSkpIHtcclxuICAgICAgICAgIHNlbGYudHJpZ2dlcigncmVzdWx0czp0b2dnbGUnLCB7fSk7XHJcblxyXG4gICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09IEtFWVMuVVApIHtcclxuICAgICAgICAgIHNlbGYudHJpZ2dlcigncmVzdWx0czpwcmV2aW91cycsIHt9KTtcclxuXHJcbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gS0VZUy5ET1dOKSB7XHJcbiAgICAgICAgICBzZWxmLnRyaWdnZXIoJ3Jlc3VsdHM6bmV4dCcsIHt9KTtcclxuXHJcbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKGtleSA9PT0gS0VZUy5FTlRFUiB8fCBrZXkgPT09IEtFWVMuU1BBQ0UgfHxcclxuICAgICAgICAgICAgKGtleSA9PT0gS0VZUy5ET1dOICYmIGV2dC5hbHRLZXkpKSB7XHJcbiAgICAgICAgICBzZWxmLm9wZW4oKTtcclxuXHJcbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIFNlbGVjdDIucHJvdG90eXBlLl9zeW5jQXR0cmlidXRlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMub3B0aW9ucy5zZXQoJ2Rpc2FibGVkJywgdGhpcy4kZWxlbWVudC5wcm9wKCdkaXNhYmxlZCcpKTtcclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLmdldCgnZGlzYWJsZWQnKSkge1xyXG4gICAgICBpZiAodGhpcy5pc09wZW4oKSkge1xyXG4gICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy50cmlnZ2VyKCdkaXNhYmxlJywge30pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy50cmlnZ2VyKCdlbmFibGUnLCB7fSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgU2VsZWN0Mi5wcm90b3R5cGUuX3N5bmNTdWJ0cmVlID0gZnVuY3Rpb24gKGV2dCwgbXV0YXRpb25zKSB7XHJcbiAgICB2YXIgY2hhbmdlZCA9IGZhbHNlO1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIC8vIElnbm9yZSBhbnkgbXV0YXRpb24gZXZlbnRzIHJhaXNlZCBmb3IgZWxlbWVudHMgdGhhdCBhcmVuJ3Qgb3B0aW9ucyBvclxyXG4gICAgLy8gb3B0Z3JvdXBzLiBUaGlzIGhhbmRsZXMgdGhlIGNhc2Ugd2hlbiB0aGUgc2VsZWN0IGVsZW1lbnQgaXMgZGVzdHJveWVkXHJcbiAgICBpZiAoXHJcbiAgICAgIGV2dCAmJiBldnQudGFyZ2V0ICYmIChcclxuICAgICAgICBldnQudGFyZ2V0Lm5vZGVOYW1lICE9PSAnT1BUSU9OJyAmJiBldnQudGFyZ2V0Lm5vZGVOYW1lICE9PSAnT1BUR1JPVVAnXHJcbiAgICAgIClcclxuICAgICkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFtdXRhdGlvbnMpIHtcclxuICAgICAgLy8gSWYgbXV0YXRpb24gZXZlbnRzIGFyZW4ndCBzdXBwb3J0ZWQsIHRoZW4gd2UgY2FuIG9ubHkgYXNzdW1lIHRoYXQgdGhlXHJcbiAgICAgIC8vIGNoYW5nZSBhZmZlY3RlZCB0aGUgc2VsZWN0aW9uc1xyXG4gICAgICBjaGFuZ2VkID0gdHJ1ZTtcclxuICAgIH0gZWxzZSBpZiAobXV0YXRpb25zLmFkZGVkTm9kZXMgJiYgbXV0YXRpb25zLmFkZGVkTm9kZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICBmb3IgKHZhciBuID0gMDsgbiA8IG11dGF0aW9ucy5hZGRlZE5vZGVzLmxlbmd0aDsgbisrKSB7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBtdXRhdGlvbnMuYWRkZWROb2Rlc1tuXTtcclxuXHJcbiAgICAgICAgaWYgKG5vZGUuc2VsZWN0ZWQpIHtcclxuICAgICAgICAgIGNoYW5nZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChtdXRhdGlvbnMucmVtb3ZlZE5vZGVzICYmIG11dGF0aW9ucy5yZW1vdmVkTm9kZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICBjaGFuZ2VkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBPbmx5IHJlLXB1bGwgdGhlIGRhdGEgaWYgd2UgdGhpbmsgdGhlcmUgaXMgYSBjaGFuZ2VcclxuICAgIGlmIChjaGFuZ2VkKSB7XHJcbiAgICAgIHRoaXMuZGF0YUFkYXB0ZXIuY3VycmVudChmdW5jdGlvbiAoY3VycmVudERhdGEpIHtcclxuICAgICAgICBzZWxmLnRyaWdnZXIoJ3NlbGVjdGlvbjp1cGRhdGUnLCB7XHJcbiAgICAgICAgICBkYXRhOiBjdXJyZW50RGF0YVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBPdmVycmlkZSB0aGUgdHJpZ2dlciBtZXRob2QgdG8gYXV0b21hdGljYWxseSB0cmlnZ2VyIHByZS1ldmVudHMgd2hlblxyXG4gICAqIHRoZXJlIGFyZSBldmVudHMgdGhhdCBjYW4gYmUgcHJldmVudGVkLlxyXG4gICAqL1xyXG4gIFNlbGVjdDIucHJvdG90eXBlLnRyaWdnZXIgPSBmdW5jdGlvbiAobmFtZSwgYXJncykge1xyXG4gICAgdmFyIGFjdHVhbFRyaWdnZXIgPSBTZWxlY3QyLl9fc3VwZXJfXy50cmlnZ2VyO1xyXG4gICAgdmFyIHByZVRyaWdnZXJNYXAgPSB7XHJcbiAgICAgICdvcGVuJzogJ29wZW5pbmcnLFxyXG4gICAgICAnY2xvc2UnOiAnY2xvc2luZycsXHJcbiAgICAgICdzZWxlY3QnOiAnc2VsZWN0aW5nJyxcclxuICAgICAgJ3Vuc2VsZWN0JzogJ3Vuc2VsZWN0aW5nJ1xyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoYXJncyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGFyZ3MgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAobmFtZSBpbiBwcmVUcmlnZ2VyTWFwKSB7XHJcbiAgICAgIHZhciBwcmVUcmlnZ2VyTmFtZSA9IHByZVRyaWdnZXJNYXBbbmFtZV07XHJcbiAgICAgIHZhciBwcmVUcmlnZ2VyQXJncyA9IHtcclxuICAgICAgICBwcmV2ZW50ZWQ6IGZhbHNlLFxyXG4gICAgICAgIG5hbWU6IG5hbWUsXHJcbiAgICAgICAgYXJnczogYXJnc1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgYWN0dWFsVHJpZ2dlci5jYWxsKHRoaXMsIHByZVRyaWdnZXJOYW1lLCBwcmVUcmlnZ2VyQXJncyk7XHJcblxyXG4gICAgICBpZiAocHJlVHJpZ2dlckFyZ3MucHJldmVudGVkKSB7XHJcbiAgICAgICAgYXJncy5wcmV2ZW50ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhY3R1YWxUcmlnZ2VyLmNhbGwodGhpcywgbmFtZSwgYXJncyk7XHJcbiAgfTtcclxuXHJcbiAgU2VsZWN0Mi5wcm90b3R5cGUudG9nZ2xlRHJvcGRvd24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5vcHRpb25zLmdldCgnZGlzYWJsZWQnKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuaXNPcGVuKCkpIHtcclxuICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5vcGVuKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgU2VsZWN0Mi5wcm90b3R5cGUub3BlbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLmlzT3BlbigpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnRyaWdnZXIoJ3F1ZXJ5Jywge30pO1xyXG4gIH07XHJcblxyXG4gIFNlbGVjdDIucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKCF0aGlzLmlzT3BlbigpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnRyaWdnZXIoJ2Nsb3NlJywge30pO1xyXG4gIH07XHJcblxyXG4gIFNlbGVjdDIucHJvdG90eXBlLmlzT3BlbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB0aGlzLiRjb250YWluZXIuaGFzQ2xhc3MoJ3NlbGVjdDItY29udGFpbmVyLS1vcGVuJyk7XHJcbiAgfTtcclxuXHJcbiAgU2VsZWN0Mi5wcm90b3R5cGUuaGFzRm9jdXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gdGhpcy4kY29udGFpbmVyLmhhc0NsYXNzKCdzZWxlY3QyLWNvbnRhaW5lci0tZm9jdXMnKTtcclxuICB9O1xyXG5cclxuICBTZWxlY3QyLnByb3RvdHlwZS5mb2N1cyA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAvLyBObyBuZWVkIHRvIHJlLXRyaWdnZXIgZm9jdXMgZXZlbnRzIGlmIHdlIGFyZSBhbHJlYWR5IGZvY3VzZWRcclxuICAgIGlmICh0aGlzLmhhc0ZvY3VzKCkpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuJGNvbnRhaW5lci5hZGRDbGFzcygnc2VsZWN0Mi1jb250YWluZXItLWZvY3VzJyk7XHJcbiAgICB0aGlzLnRyaWdnZXIoJ2ZvY3VzJywge30pO1xyXG4gIH07XHJcblxyXG4gIFNlbGVjdDIucHJvdG90eXBlLmVuYWJsZSA9IGZ1bmN0aW9uIChhcmdzKSB7XHJcbiAgICBpZiAodGhpcy5vcHRpb25zLmdldCgnZGVidWcnKSAmJiB3aW5kb3cuY29uc29sZSAmJiBjb25zb2xlLndhcm4pIHtcclxuICAgICAgY29uc29sZS53YXJuKFxyXG4gICAgICAgICdTZWxlY3QyOiBUaGUgYHNlbGVjdDIoXCJlbmFibGVcIilgIG1ldGhvZCBoYXMgYmVlbiBkZXByZWNhdGVkIGFuZCB3aWxsJyArXHJcbiAgICAgICAgJyBiZSByZW1vdmVkIGluIGxhdGVyIFNlbGVjdDIgdmVyc2lvbnMuIFVzZSAkZWxlbWVudC5wcm9wKFwiZGlzYWJsZWRcIiknICtcclxuICAgICAgICAnIGluc3RlYWQuJ1xyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChhcmdzID09IG51bGwgfHwgYXJncy5sZW5ndGggPT09IDApIHtcclxuICAgICAgYXJncyA9IFt0cnVlXTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZGlzYWJsZWQgPSAhYXJnc1swXTtcclxuXHJcbiAgICB0aGlzLiRlbGVtZW50LnByb3AoJ2Rpc2FibGVkJywgZGlzYWJsZWQpO1xyXG4gIH07XHJcblxyXG4gIFNlbGVjdDIucHJvdG90eXBlLmRhdGEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5vcHRpb25zLmdldCgnZGVidWcnKSAmJlxyXG4gICAgICAgIGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIHdpbmRvdy5jb25zb2xlICYmIGNvbnNvbGUud2Fybikge1xyXG4gICAgICBjb25zb2xlLndhcm4oXHJcbiAgICAgICAgJ1NlbGVjdDI6IERhdGEgY2FuIG5vIGxvbmdlciBiZSBzZXQgdXNpbmcgYHNlbGVjdDIoXCJkYXRhXCIpYC4gWW91ICcgK1xyXG4gICAgICAgICdzaG91bGQgY29uc2lkZXIgc2V0dGluZyB0aGUgdmFsdWUgaW5zdGVhZCB1c2luZyBgJGVsZW1lbnQudmFsKClgLidcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZGF0YSA9IFtdO1xyXG5cclxuICAgIHRoaXMuZGF0YUFkYXB0ZXIuY3VycmVudChmdW5jdGlvbiAoY3VycmVudERhdGEpIHtcclxuICAgICAgZGF0YSA9IGN1cnJlbnREYXRhO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbiAgfTtcclxuXHJcbiAgU2VsZWN0Mi5wcm90b3R5cGUudmFsID0gZnVuY3Rpb24gKGFyZ3MpIHtcclxuICAgIGlmICh0aGlzLm9wdGlvbnMuZ2V0KCdkZWJ1ZycpICYmIHdpbmRvdy5jb25zb2xlICYmIGNvbnNvbGUud2Fybikge1xyXG4gICAgICBjb25zb2xlLndhcm4oXHJcbiAgICAgICAgJ1NlbGVjdDI6IFRoZSBgc2VsZWN0MihcInZhbFwiKWAgbWV0aG9kIGhhcyBiZWVuIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUnICtcclxuICAgICAgICAnIHJlbW92ZWQgaW4gbGF0ZXIgU2VsZWN0MiB2ZXJzaW9ucy4gVXNlICRlbGVtZW50LnZhbCgpIGluc3RlYWQuJ1xyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChhcmdzID09IG51bGwgfHwgYXJncy5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuIHRoaXMuJGVsZW1lbnQudmFsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIG5ld1ZhbCA9IGFyZ3NbMF07XHJcblxyXG4gICAgaWYgKCQuaXNBcnJheShuZXdWYWwpKSB7XHJcbiAgICAgIG5ld1ZhbCA9ICQubWFwKG5ld1ZhbCwgZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICAgIHJldHVybiBvYmoudG9TdHJpbmcoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy4kZWxlbWVudC52YWwobmV3VmFsKS50cmlnZ2VyKCdjaGFuZ2UnKTtcclxuICB9O1xyXG5cclxuICBTZWxlY3QyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy4kY29udGFpbmVyLnJlbW92ZSgpO1xyXG5cclxuICAgIGlmICh0aGlzLiRlbGVtZW50WzBdLmRldGFjaEV2ZW50KSB7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnRbMF0uZGV0YWNoRXZlbnQoJ29ucHJvcGVydHljaGFuZ2UnLCB0aGlzLl9zeW5jQSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuX29ic2VydmVyICE9IG51bGwpIHtcclxuICAgICAgdGhpcy5fb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xyXG4gICAgICB0aGlzLl9vYnNlcnZlciA9IG51bGw7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuJGVsZW1lbnRbMF0ucmVtb3ZlRXZlbnRMaXN0ZW5lcikge1xyXG4gICAgICB0aGlzLiRlbGVtZW50WzBdXHJcbiAgICAgICAgLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0RPTUF0dHJNb2RpZmllZCcsIHRoaXMuX3N5bmNBLCBmYWxzZSk7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnRbMF1cclxuICAgICAgICAucmVtb3ZlRXZlbnRMaXN0ZW5lcignRE9NTm9kZUluc2VydGVkJywgdGhpcy5fc3luY1MsIGZhbHNlKTtcclxuICAgICAgdGhpcy4kZWxlbWVudFswXVxyXG4gICAgICAgIC5yZW1vdmVFdmVudExpc3RlbmVyKCdET01Ob2RlUmVtb3ZlZCcsIHRoaXMuX3N5bmNTLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fc3luY0EgPSBudWxsO1xyXG4gICAgdGhpcy5fc3luY1MgPSBudWxsO1xyXG5cclxuICAgIHRoaXMuJGVsZW1lbnQub2ZmKCcuc2VsZWN0MicpO1xyXG4gICAgdGhpcy4kZWxlbWVudC5hdHRyKCd0YWJpbmRleCcsIHRoaXMuJGVsZW1lbnQuZGF0YSgnb2xkLXRhYmluZGV4JykpO1xyXG5cclxuICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ3NlbGVjdDItaGlkZGVuLWFjY2Vzc2libGUnKTtcclxuICAgIHRoaXMuJGVsZW1lbnQuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlRGF0YSgnc2VsZWN0MicpO1xyXG5cclxuICAgIHRoaXMuZGF0YUFkYXB0ZXIuZGVzdHJveSgpO1xyXG4gICAgdGhpcy5zZWxlY3Rpb24uZGVzdHJveSgpO1xyXG4gICAgdGhpcy5kcm9wZG93bi5kZXN0cm95KCk7XHJcbiAgICB0aGlzLnJlc3VsdHMuZGVzdHJveSgpO1xyXG5cclxuICAgIHRoaXMuZGF0YUFkYXB0ZXIgPSBudWxsO1xyXG4gICAgdGhpcy5zZWxlY3Rpb24gPSBudWxsO1xyXG4gICAgdGhpcy5kcm9wZG93biA9IG51bGw7XHJcbiAgICB0aGlzLnJlc3VsdHMgPSBudWxsO1xyXG4gIH07XHJcblxyXG4gIFNlbGVjdDIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciAkY29udGFpbmVyID0gJChcclxuICAgICAgJzxzcGFuIGNsYXNzPVwic2VsZWN0MiBzZWxlY3QyLWNvbnRhaW5lclwiPicgK1xyXG4gICAgICAgICc8c3BhbiBjbGFzcz1cInNlbGVjdGlvblwiPjwvc3Bhbj4nICtcclxuICAgICAgICAnPHNwYW4gY2xhc3M9XCJkcm9wZG93bi13cmFwcGVyXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPicgK1xyXG4gICAgICAnPC9zcGFuPidcclxuICAgICk7XHJcblxyXG4gICAgJGNvbnRhaW5lci5hdHRyKCdkaXInLCB0aGlzLm9wdGlvbnMuZ2V0KCdkaXInKSk7XHJcblxyXG4gICAgdGhpcy4kY29udGFpbmVyID0gJGNvbnRhaW5lcjtcclxuXHJcbiAgICB0aGlzLiRjb250YWluZXIuYWRkQ2xhc3MoJ3NlbGVjdDItY29udGFpbmVyLS0nICsgdGhpcy5vcHRpb25zLmdldCgndGhlbWUnKSk7XHJcblxyXG4gICAgJGNvbnRhaW5lci5kYXRhKCdlbGVtZW50JywgdGhpcy4kZWxlbWVudCk7XHJcblxyXG4gICAgcmV0dXJuICRjb250YWluZXI7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIFNlbGVjdDI7XHJcbn0pO1xyXG5cclxuUzIuZGVmaW5lKCdqcXVlcnktbW91c2V3aGVlbCcsW1xyXG4gICdqcXVlcnknXHJcbl0sIGZ1bmN0aW9uICgkKSB7XHJcbiAgLy8gVXNlZCB0byBzaGltIGpRdWVyeS5tb3VzZXdoZWVsIGZvciBub24tZnVsbCBidWlsZHMuXHJcbiAgcmV0dXJuICQ7XHJcbn0pO1xyXG5cclxuUzIuZGVmaW5lKCdqcXVlcnkuc2VsZWN0MicsW1xyXG4gICdqcXVlcnknLFxyXG4gICdqcXVlcnktbW91c2V3aGVlbCcsXHJcblxyXG4gICcuL3NlbGVjdDIvY29yZScsXHJcbiAgJy4vc2VsZWN0Mi9kZWZhdWx0cydcclxuXSwgZnVuY3Rpb24gKCQsIF8sIFNlbGVjdDIsIERlZmF1bHRzKSB7XHJcbiAgaWYgKCQuZm4uc2VsZWN0MiA9PSBudWxsKSB7XHJcbiAgICAvLyBBbGwgbWV0aG9kcyB0aGF0IHNob3VsZCByZXR1cm4gdGhlIGVsZW1lbnRcclxuICAgIHZhciB0aGlzTWV0aG9kcyA9IFsnb3BlbicsICdjbG9zZScsICdkZXN0cm95J107XHJcblxyXG4gICAgJC5mbi5zZWxlY3QyID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblxyXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZhciBpbnN0YW5jZU9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgdmFyIGluc3RhbmNlID0gbmV3IFNlbGVjdDIoJCh0aGlzKSwgaW5zdGFuY2VPcHRpb25zKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgdmFyIHJldDtcclxuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XHJcblxyXG4gICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICB2YXIgaW5zdGFuY2UgPSAkKHRoaXMpLmRhdGEoJ3NlbGVjdDInKTtcclxuXHJcbiAgICAgICAgICBpZiAoaW5zdGFuY2UgPT0gbnVsbCAmJiB3aW5kb3cuY29uc29sZSAmJiBjb25zb2xlLmVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXHJcbiAgICAgICAgICAgICAgJ1RoZSBzZWxlY3QyKFxcJycgKyBvcHRpb25zICsgJ1xcJykgbWV0aG9kIHdhcyBjYWxsZWQgb24gYW4gJyArXHJcbiAgICAgICAgICAgICAgJ2VsZW1lbnQgdGhhdCBpcyBub3QgdXNpbmcgU2VsZWN0Mi4nXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgcmV0ID0gaW5zdGFuY2Vbb3B0aW9uc10uYXBwbHkoaW5zdGFuY2UsIGFyZ3MpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBDaGVjayBpZiB3ZSBzaG91bGQgYmUgcmV0dXJuaW5nIGB0aGlzYFxyXG4gICAgICAgIGlmICgkLmluQXJyYXkob3B0aW9ucywgdGhpc01ldGhvZHMpID4gLTEpIHtcclxuICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYXJndW1lbnRzIGZvciBTZWxlY3QyOiAnICsgb3B0aW9ucyk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBpZiAoJC5mbi5zZWxlY3QyLmRlZmF1bHRzID09IG51bGwpIHtcclxuICAgICQuZm4uc2VsZWN0Mi5kZWZhdWx0cyA9IERlZmF1bHRzO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIFNlbGVjdDI7XHJcbn0pO1xyXG5cclxuICAvLyBSZXR1cm4gdGhlIEFNRCBsb2FkZXIgY29uZmlndXJhdGlvbiBzbyBpdCBjYW4gYmUgdXNlZCBvdXRzaWRlIG9mIHRoaXMgZmlsZVxyXG4gIHJldHVybiB7XHJcbiAgICBkZWZpbmU6IFMyLmRlZmluZSxcclxuICAgIHJlcXVpcmU6IFMyLnJlcXVpcmVcclxuICB9O1xyXG59KCkpO1xyXG5cclxuICAvLyBBdXRvbG9hZCB0aGUgalF1ZXJ5IGJpbmRpbmdzXHJcbiAgLy8gV2Uga25vdyB0aGF0IGFsbCBvZiB0aGUgbW9kdWxlcyBleGlzdCBhYm92ZSB0aGlzLCBzbyB3ZSdyZSBzYWZlXHJcbiAgdmFyIHNlbGVjdDIgPSBTMi5yZXF1aXJlKCdqcXVlcnkuc2VsZWN0MicpO1xyXG5cclxuICAvLyBIb2xkIHRoZSBBTUQgbW9kdWxlIHJlZmVyZW5jZXMgb24gdGhlIGpRdWVyeSBmdW5jdGlvbiB0aGF0IHdhcyBqdXN0IGxvYWRlZFxyXG4gIC8vIFRoaXMgYWxsb3dzIFNlbGVjdDIgdG8gdXNlIHRoZSBpbnRlcm5hbCBsb2FkZXIgb3V0c2lkZSBvZiB0aGlzIGZpbGUsIHN1Y2hcclxuICAvLyBhcyBpbiB0aGUgbGFuZ3VhZ2UgZmlsZXMuXHJcbiAgalF1ZXJ5LmZuLnNlbGVjdDIuYW1kID0gUzI7XHJcblxyXG4gIC8vIFJldHVybiB0aGUgU2VsZWN0MiBpbnN0YW5jZSBmb3IgYW55b25lIHdobyBpcyBpbXBvcnRpbmcgaXQuXHJcbiAgcmV0dXJuIHNlbGVjdDI7XHJcbn0pKTtcclxuIiwiLypcclxuICAgICBfIF8gICAgICBfICAgICAgIF9cclxuIF9fX3wgKF8pIF9fX3wgfCBfXyAgKF8pX19fXHJcbi8gX198IHwgfC8gX198IHwvIC8gIHwgLyBfX3xcclxuXFxfXyBcXCB8IHwgKF9ffCAgIDwgXyB8IFxcX18gXFxcclxufF9fXy9ffF98XFxfX198X3xcXF8oXykvIHxfX18vXHJcbiAgICAgICAgICAgICAgICAgICB8X18vXHJcblxyXG4gVmVyc2lvbjogMS42LjBcclxuICBBdXRob3I6IEtlbiBXaGVlbGVyXHJcbiBXZWJzaXRlOiBodHRwOi8va2Vud2hlZWxlci5naXRodWIuaW9cclxuICAgIERvY3M6IGh0dHA6Ly9rZW53aGVlbGVyLmdpdGh1Yi5pby9zbGlja1xyXG4gICAgUmVwbzogaHR0cDovL2dpdGh1Yi5jb20va2Vud2hlZWxlci9zbGlja1xyXG4gIElzc3VlczogaHR0cDovL2dpdGh1Yi5jb20va2Vud2hlZWxlci9zbGljay9pc3N1ZXNcclxuXHJcbiAqL1xyXG4vKiBnbG9iYWwgd2luZG93LCBkb2N1bWVudCwgZGVmaW5lLCBqUXVlcnksIHNldEludGVydmFsLCBjbGVhckludGVydmFsICovXHJcbihmdW5jdGlvbihmYWN0b3J5KSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBmYWN0b3J5KGpRdWVyeSk7XHJcblxyXG59KGZ1bmN0aW9uKCQpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIHZhciBTbGljayA9IHdpbmRvdy5TbGljayB8fCB7fTtcclxuXHJcbiAgICBTbGljayA9IChmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIGluc3RhbmNlVWlkID0gMDtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gU2xpY2soZWxlbWVudCwgc2V0dGluZ3MpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBfID0gdGhpcywgZGF0YVNldHRpbmdzO1xyXG5cclxuICAgICAgICAgICAgXy5kZWZhdWx0cyA9IHtcclxuICAgICAgICAgICAgICAgIGFjY2Vzc2liaWxpdHk6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBhZGFwdGl2ZUhlaWdodDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBhcHBlbmRBcnJvd3M6ICQoZWxlbWVudCksXHJcbiAgICAgICAgICAgICAgICBhcHBlbmREb3RzOiAkKGVsZW1lbnQpLFxyXG4gICAgICAgICAgICAgICAgYXJyb3dzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYXNOYXZGb3I6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBwcmV2QXJyb3c6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXJvbGU9XCJub25lXCIgY2xhc3M9XCJzbGljay1wcmV2XCIgYXJpYS1sYWJlbD1cIlByZXZpb3VzXCIgdGFiaW5kZXg9XCIwXCIgcm9sZT1cImJ1dHRvblwiPlByZXZpb3VzPC9idXR0b24+JyxcclxuICAgICAgICAgICAgICAgIG5leHRBcnJvdzogJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtcm9sZT1cIm5vbmVcIiBjbGFzcz1cInNsaWNrLW5leHRcIiBhcmlhLWxhYmVsPVwiTmV4dFwiIHRhYmluZGV4PVwiMFwiIHJvbGU9XCJidXR0b25cIj5OZXh0PC9idXR0b24+JyxcclxuICAgICAgICAgICAgICAgIGF1dG9wbGF5OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGF1dG9wbGF5U3BlZWQ6IDMwMDAsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJNb2RlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNlbnRlclBhZGRpbmc6ICc1MHB4JyxcclxuICAgICAgICAgICAgICAgIGNzc0Vhc2U6ICdlYXNlJyxcclxuICAgICAgICAgICAgICAgIGN1c3RvbVBhZ2luZzogZnVuY3Rpb24oc2xpZGVyLCBpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQoJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtcm9sZT1cIm5vbmVcIiByb2xlPVwiYnV0dG9uXCIgdGFiaW5kZXg9XCIwXCIgLz4nKS50ZXh0KGkgKyAxKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGRvdHNDbGFzczogJ3NsaWNrLWRvdHMnLFxyXG4gICAgICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZWFzaW5nOiAnbGluZWFyJyxcclxuICAgICAgICAgICAgICAgIGVkZ2VGcmljdGlvbjogMC4zNSxcclxuICAgICAgICAgICAgICAgIGZhZGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZm9jdXNPblNlbGVjdDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGluaXRpYWxTbGlkZTogMCxcclxuICAgICAgICAgICAgICAgIGxhenlMb2FkOiAnb25kZW1hbmQnLFxyXG4gICAgICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcGF1c2VPbkhvdmVyOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcGF1c2VPbkZvY3VzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcGF1c2VPbkRvdHNIb3ZlcjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICByZXNwb25kVG86ICd3aW5kb3cnLFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTogbnVsbCxcclxuICAgICAgICAgICAgICAgIHJvd3M6IDEsXHJcbiAgICAgICAgICAgICAgICBydGw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc2xpZGU6ICcnLFxyXG4gICAgICAgICAgICAgICAgc2xpZGVzUGVyUm93OiAxLFxyXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXHJcbiAgICAgICAgICAgICAgICBzcGVlZDogNTAwLFxyXG4gICAgICAgICAgICAgICAgc3dpcGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBzd2lwZVRvU2xpZGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdG91Y2hNb3ZlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdG91Y2hUaHJlc2hvbGQ6IDUsXHJcbiAgICAgICAgICAgICAgICB1c2VDU1M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB1c2VUcmFuc2Zvcm06IHRydWUsXHJcbiAgICAgICAgICAgICAgICB2YXJpYWJsZVdpZHRoOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHZlcnRpY2FsOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHZlcnRpY2FsU3dpcGluZzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB3YWl0Rm9yQW5pbWF0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHpJbmRleDogMTAwMFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgXy5pbml0aWFscyA9IHtcclxuICAgICAgICAgICAgICAgIGFuaW1hdGluZzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBkcmFnZ2luZzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBhdXRvUGxheVRpbWVyOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudERpcmVjdGlvbjogMCxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRMZWZ0OiBudWxsLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudFNsaWRlOiAwLFxyXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uOiAxLFxyXG4gICAgICAgICAgICAgICAgJGRvdHM6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBsaXN0V2lkdGg6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBsaXN0SGVpZ2h0OiBudWxsLFxyXG4gICAgICAgICAgICAgICAgbG9hZEluZGV4OiAwLFxyXG4gICAgICAgICAgICAgICAgJG5leHRBcnJvdzogbnVsbCxcclxuICAgICAgICAgICAgICAgICRwcmV2QXJyb3c6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBzbGlkZUNvdW50OiBudWxsLFxyXG4gICAgICAgICAgICAgICAgc2xpZGVXaWR0aDogbnVsbCxcclxuICAgICAgICAgICAgICAgICRzbGlkZVRyYWNrOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgJHNsaWRlczogbnVsbCxcclxuICAgICAgICAgICAgICAgIHNsaWRpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc2xpZGVPZmZzZXQ6IDAsXHJcbiAgICAgICAgICAgICAgICBzd2lwZUxlZnQ6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAkbGlzdDogbnVsbCxcclxuICAgICAgICAgICAgICAgIHRvdWNoT2JqZWN0OiB7fSxcclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybXNFbmFibGVkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHVuc2xpY2tlZDogZmFsc2VcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICQuZXh0ZW5kKF8sIF8uaW5pdGlhbHMpO1xyXG5cclxuICAgICAgICAgICAgXy5hY3RpdmVCcmVha3BvaW50ID0gbnVsbDtcclxuICAgICAgICAgICAgXy5hbmltVHlwZSA9IG51bGw7XHJcbiAgICAgICAgICAgIF8uYW5pbVByb3AgPSBudWxsO1xyXG4gICAgICAgICAgICBfLmJyZWFrcG9pbnRzID0gW107XHJcbiAgICAgICAgICAgIF8uYnJlYWtwb2ludFNldHRpbmdzID0gW107XHJcbiAgICAgICAgICAgIF8uY3NzVHJhbnNpdGlvbnMgPSBmYWxzZTtcclxuICAgICAgICAgICAgXy5mb2N1c3NlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBfLmludGVycnVwdGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIF8uaGlkZGVuID0gJ2hpZGRlbic7XHJcbiAgICAgICAgICAgIF8ucGF1c2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgXy5wb3NpdGlvblByb3AgPSBudWxsO1xyXG4gICAgICAgICAgICBfLnJlc3BvbmRUbyA9IG51bGw7XHJcbiAgICAgICAgICAgIF8ucm93Q291bnQgPSAxO1xyXG4gICAgICAgICAgICBfLnNob3VsZENsaWNrID0gdHJ1ZTtcclxuICAgICAgICAgICAgXy4kc2xpZGVyID0gJChlbGVtZW50KTtcclxuICAgICAgICAgICAgXy4kc2xpZGVzQ2FjaGUgPSBudWxsO1xyXG4gICAgICAgICAgICBfLnRyYW5zZm9ybVR5cGUgPSBudWxsO1xyXG4gICAgICAgICAgICBfLnRyYW5zaXRpb25UeXBlID0gbnVsbDtcclxuICAgICAgICAgICAgXy52aXNpYmlsaXR5Q2hhbmdlID0gJ3Zpc2liaWxpdHljaGFuZ2UnO1xyXG4gICAgICAgICAgICBfLndpbmRvd1dpZHRoID0gMDtcclxuICAgICAgICAgICAgXy53aW5kb3dUaW1lciA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBkYXRhU2V0dGluZ3MgPSAkKGVsZW1lbnQpLmRhdGEoJ3NsaWNrJykgfHwge307XHJcblxyXG4gICAgICAgICAgICBfLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgXy5kZWZhdWx0cywgc2V0dGluZ3MsIGRhdGFTZXR0aW5ncyk7XHJcblxyXG4gICAgICAgICAgICBfLmN1cnJlbnRTbGlkZSA9IF8ub3B0aW9ucy5pbml0aWFsU2xpZGU7XHJcblxyXG4gICAgICAgICAgICBfLm9yaWdpbmFsU2V0dGluZ3MgPSBfLm9wdGlvbnM7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGRvY3VtZW50Lm1vekhpZGRlbiAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIF8uaGlkZGVuID0gJ21vekhpZGRlbic7XHJcbiAgICAgICAgICAgICAgICBfLnZpc2liaWxpdHlDaGFuZ2UgPSAnbW96dmlzaWJpbGl0eWNoYW5nZSc7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGRvY3VtZW50LndlYmtpdEhpZGRlbiAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIF8uaGlkZGVuID0gJ3dlYmtpdEhpZGRlbic7XHJcbiAgICAgICAgICAgICAgICBfLnZpc2liaWxpdHlDaGFuZ2UgPSAnd2Via2l0dmlzaWJpbGl0eWNoYW5nZSc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIF8uYXV0b1BsYXkgPSAkLnByb3h5KF8uYXV0b1BsYXksIF8pO1xyXG4gICAgICAgICAgICBfLmF1dG9QbGF5Q2xlYXIgPSAkLnByb3h5KF8uYXV0b1BsYXlDbGVhciwgXyk7XHJcbiAgICAgICAgICAgIF8uYXV0b1BsYXlJdGVyYXRvciA9ICQucHJveHkoXy5hdXRvUGxheUl0ZXJhdG9yLCBfKTtcclxuICAgICAgICAgICAgXy5jaGFuZ2VTbGlkZSA9ICQucHJveHkoXy5jaGFuZ2VTbGlkZSwgXyk7XHJcbiAgICAgICAgICAgIF8uY2xpY2tIYW5kbGVyID0gJC5wcm94eShfLmNsaWNrSGFuZGxlciwgXyk7XHJcbiAgICAgICAgICAgIF8uc2VsZWN0SGFuZGxlciA9ICQucHJveHkoXy5zZWxlY3RIYW5kbGVyLCBfKTtcclxuICAgICAgICAgICAgXy5zZXRQb3NpdGlvbiA9ICQucHJveHkoXy5zZXRQb3NpdGlvbiwgXyk7XHJcbiAgICAgICAgICAgIF8uc3dpcGVIYW5kbGVyID0gJC5wcm94eShfLnN3aXBlSGFuZGxlciwgXyk7XHJcbiAgICAgICAgICAgIF8uZHJhZ0hhbmRsZXIgPSAkLnByb3h5KF8uZHJhZ0hhbmRsZXIsIF8pO1xyXG4gICAgICAgICAgICBfLmtleUhhbmRsZXIgPSAkLnByb3h5KF8ua2V5SGFuZGxlciwgXyk7XHJcblxyXG4gICAgICAgICAgICBfLmluc3RhbmNlVWlkID0gaW5zdGFuY2VVaWQrKztcclxuXHJcbiAgICAgICAgICAgIC8vIEEgc2ltcGxlIHdheSB0byBjaGVjayBmb3IgSFRNTCBzdHJpbmdzXHJcbiAgICAgICAgICAgIC8vIFN0cmljdCBIVE1MIHJlY29nbml0aW9uIChtdXN0IHN0YXJ0IHdpdGggPClcclxuICAgICAgICAgICAgLy8gRXh0cmFjdGVkIGZyb20galF1ZXJ5IHYxLjExIHNvdXJjZVxyXG4gICAgICAgICAgICBfLmh0bWxFeHByID0gL14oPzpcXHMqKDxbXFx3XFxXXSs+KVtePl0qKSQvO1xyXG5cclxuXHJcbiAgICAgICAgICAgIF8ucmVnaXN0ZXJCcmVha3BvaW50cygpO1xyXG4gICAgICAgICAgICBfLmluaXQodHJ1ZSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIFNsaWNrO1xyXG5cclxuICAgIH0oKSk7XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmFjdGl2YXRlQURBID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBfLiRzbGlkZVRyYWNrLmZpbmQoJy5zbGljay1hY3RpdmUnKS5hdHRyKHtcclxuICAgICAgICAgICAgJ2FyaWEtaGlkZGVuJzogJ2ZhbHNlJ1xyXG4gICAgICAgIH0pLmZpbmQoJ2EsIGlucHV0LCBidXR0b24sIHNlbGVjdCcpLmF0dHIoe1xyXG4gICAgICAgICAgICAndGFiaW5kZXgnOiAnMCdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5hZGRTbGlkZSA9IFNsaWNrLnByb3RvdHlwZS5zbGlja0FkZCA9IGZ1bmN0aW9uKG1hcmt1cCwgaW5kZXgsIGFkZEJlZm9yZSkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YoaW5kZXgpID09PSAnYm9vbGVhbicpIHtcclxuICAgICAgICAgICAgYWRkQmVmb3JlID0gaW5kZXg7XHJcbiAgICAgICAgICAgIGluZGV4ID0gbnVsbDtcclxuICAgICAgICB9IGVsc2UgaWYgKGluZGV4IDwgMCB8fCAoaW5kZXggPj0gXy5zbGlkZUNvdW50KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfLnVubG9hZCgpO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mKGluZGV4KSA9PT0gJ251bWJlcicpIHtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID09PSAwICYmIF8uJHNsaWRlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICQobWFya3VwKS5hcHBlbmRUbyhfLiRzbGlkZVRyYWNrKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChhZGRCZWZvcmUpIHtcclxuICAgICAgICAgICAgICAgICQobWFya3VwKS5pbnNlcnRCZWZvcmUoXy4kc2xpZGVzLmVxKGluZGV4KSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKG1hcmt1cCkuaW5zZXJ0QWZ0ZXIoXy4kc2xpZGVzLmVxKGluZGV4KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoYWRkQmVmb3JlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAkKG1hcmt1cCkucHJlcGVuZFRvKF8uJHNsaWRlVHJhY2spO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJChtYXJrdXApLmFwcGVuZFRvKF8uJHNsaWRlVHJhY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfLiRzbGlkZXMgPSBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSk7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKS5kZXRhY2goKTtcclxuXHJcbiAgICAgICAgXy4kc2xpZGVUcmFjay5hcHBlbmQoXy4kc2xpZGVzKTtcclxuXHJcbiAgICAgICAgXy4kc2xpZGVzLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgJChlbGVtZW50KS5hdHRyKCdkYXRhLXNsaWNrLWluZGV4JywgaW5kZXgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBfLiRzbGlkZXNDYWNoZSA9IF8uJHNsaWRlcztcclxuXHJcbiAgICAgICAgXy5yZWluaXQoKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5hbmltYXRlSGVpZ2h0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuc2xpZGVzVG9TaG93ID09PSAxICYmIF8ub3B0aW9ucy5hZGFwdGl2ZUhlaWdodCA9PT0gdHJ1ZSAmJiBfLm9wdGlvbnMudmVydGljYWwgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXRIZWlnaHQgPSBfLiRzbGlkZXMuZXEoXy5jdXJyZW50U2xpZGUpLm91dGVySGVpZ2h0KHRydWUpO1xyXG4gICAgICAgICAgICBfLiRsaXN0LmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0YXJnZXRIZWlnaHRcclxuICAgICAgICAgICAgfSwgXy5vcHRpb25zLnNwZWVkKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5hbmltYXRlU2xpZGUgPSBmdW5jdGlvbih0YXJnZXRMZWZ0LCBjYWxsYmFjaykge1xyXG5cclxuICAgICAgICB2YXIgYW5pbVByb3BzID0ge30sXHJcbiAgICAgICAgICAgIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBfLmFuaW1hdGVIZWlnaHQoKTtcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5ydGwgPT09IHRydWUgJiYgXy5vcHRpb25zLnZlcnRpY2FsID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICB0YXJnZXRMZWZ0ID0gLXRhcmdldExlZnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChfLnRyYW5zZm9ybXNFbmFibGVkID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiB0YXJnZXRMZWZ0XHJcbiAgICAgICAgICAgICAgICB9LCBfLm9wdGlvbnMuc3BlZWQsIF8ub3B0aW9ucy5lYXNpbmcsIGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9wOiB0YXJnZXRMZWZ0XHJcbiAgICAgICAgICAgICAgICB9LCBfLm9wdGlvbnMuc3BlZWQsIF8ub3B0aW9ucy5lYXNpbmcsIGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgaWYgKF8uY3NzVHJhbnNpdGlvbnMgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoXy5vcHRpb25zLnJ0bCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIF8uY3VycmVudExlZnQgPSAtKF8uY3VycmVudExlZnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgJCh7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbVN0YXJ0OiBfLmN1cnJlbnRMZWZ0XHJcbiAgICAgICAgICAgICAgICB9KS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICBhbmltU3RhcnQ6IHRhcmdldExlZnRcclxuICAgICAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogXy5vcHRpb25zLnNwZWVkLFxyXG4gICAgICAgICAgICAgICAgICAgIGVhc2luZzogXy5vcHRpb25zLmVhc2luZyxcclxuICAgICAgICAgICAgICAgICAgICBzdGVwOiBmdW5jdGlvbihub3cpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm93ID0gTWF0aC5jZWlsKG5vdyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWwgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltUHJvcHNbXy5hbmltVHlwZV0gPSAndHJhbnNsYXRlKCcgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdyArICdweCwgMHB4KSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNzcyhhbmltUHJvcHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbVByb3BzW18uYW5pbVR5cGVdID0gJ3RyYW5zbGF0ZSgwcHgsJyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm93ICsgJ3B4KSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNzcyhhbmltUHJvcHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIF8uYXBwbHlUcmFuc2l0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRMZWZ0ID0gTWF0aC5jZWlsKHRhcmdldExlZnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWwgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbVByb3BzW18uYW5pbVR5cGVdID0gJ3RyYW5zbGF0ZTNkKCcgKyB0YXJnZXRMZWZ0ICsgJ3B4LCAwcHgsIDBweCknO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhbmltUHJvcHNbXy5hbmltVHlwZV0gPSAndHJhbnNsYXRlM2QoMHB4LCcgKyB0YXJnZXRMZWZ0ICsgJ3B4LCAwcHgpJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY3NzKGFuaW1Qcm9wcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZGlzYWJsZVRyYW5zaXRpb24oKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCBfLm9wdGlvbnMuc3BlZWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuZ2V0TmF2VGFyZ2V0ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgYXNOYXZGb3IgPSBfLm9wdGlvbnMuYXNOYXZGb3I7XHJcblxyXG4gICAgICAgIGlmICggYXNOYXZGb3IgJiYgYXNOYXZGb3IgIT09IG51bGwgKSB7XHJcbiAgICAgICAgICAgIGFzTmF2Rm9yID0gJChhc05hdkZvcikubm90KF8uJHNsaWRlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYXNOYXZGb3I7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuYXNOYXZGb3IgPSBmdW5jdGlvbihpbmRleCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgIGFzTmF2Rm9yID0gXy5nZXROYXZUYXJnZXQoKTtcclxuXHJcbiAgICAgICAgaWYgKCBhc05hdkZvciAhPT0gbnVsbCAmJiB0eXBlb2YgYXNOYXZGb3IgPT09ICdvYmplY3QnICkge1xyXG4gICAgICAgICAgICBhc05hdkZvci5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9ICQodGhpcykuc2xpY2soJ2dldFNsaWNrJyk7XHJcbiAgICAgICAgICAgICAgICBpZighdGFyZ2V0LnVuc2xpY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldC5zbGlkZUhhbmRsZXIoaW5kZXgsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuYXBwbHlUcmFuc2l0aW9uID0gZnVuY3Rpb24oc2xpZGUpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLFxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uID0ge307XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZmFkZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdHJhbnNpdGlvbltfLnRyYW5zaXRpb25UeXBlXSA9IF8udHJhbnNmb3JtVHlwZSArICcgJyArIF8ub3B0aW9ucy5zcGVlZCArICdtcyAnICsgXy5vcHRpb25zLmNzc0Vhc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdHJhbnNpdGlvbltfLnRyYW5zaXRpb25UeXBlXSA9ICdvcGFjaXR5ICcgKyBfLm9wdGlvbnMuc3BlZWQgKyAnbXMgJyArIF8ub3B0aW9ucy5jc3NFYXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNzcyh0cmFuc2l0aW9uKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBfLiRzbGlkZXMuZXEoc2xpZGUpLmNzcyh0cmFuc2l0aW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuYXV0b1BsYXkgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBfLmF1dG9QbGF5Q2xlYXIoKTtcclxuXHJcbiAgICAgICAgaWYgKCBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICkge1xyXG4gICAgICAgICAgICBfLmF1dG9QbGF5VGltZXIgPSBzZXRJbnRlcnZhbCggXy5hdXRvUGxheUl0ZXJhdG9yLCBfLm9wdGlvbnMuYXV0b3BsYXlTcGVlZCApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5hdXRvUGxheUNsZWFyID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKF8uYXV0b1BsYXlUaW1lcikge1xyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKF8uYXV0b1BsYXlUaW1lcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmF1dG9QbGF5SXRlcmF0b3IgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLFxyXG4gICAgICAgICAgICBzbGlkZVRvID0gXy5jdXJyZW50U2xpZGUgKyBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7XHJcblxyXG4gICAgICAgIGlmICggIV8ucGF1c2VkICYmICFfLmludGVycnVwdGVkICYmICFfLmZvY3Vzc2VkICkge1xyXG5cclxuICAgICAgICAgICAgaWYgKCBfLm9wdGlvbnMuaW5maW5pdGUgPT09IGZhbHNlICkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggXy5kaXJlY3Rpb24gPT09IDEgJiYgKCBfLmN1cnJlbnRTbGlkZSArIDEgKSA9PT0gKCBfLnNsaWRlQ291bnQgLSAxICkpIHtcclxuICAgICAgICAgICAgICAgICAgICBfLmRpcmVjdGlvbiA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoIF8uZGlyZWN0aW9uID09PSAwICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzbGlkZVRvID0gXy5jdXJyZW50U2xpZGUgLSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICggXy5jdXJyZW50U2xpZGUgLSAxID09PSAwICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfLmRpcmVjdGlvbiA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIF8uc2xpZGVIYW5kbGVyKCBzbGlkZVRvICk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5idWlsZEFycm93cyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuYXJyb3dzID09PSB0cnVlICkge1xyXG5cclxuICAgICAgICAgICAgXy4kcHJldkFycm93ID0gJChfLm9wdGlvbnMucHJldkFycm93KS5hZGRDbGFzcygnc2xpY2stYXJyb3cnKTtcclxuICAgICAgICAgICAgXy4kbmV4dEFycm93ID0gJChfLm9wdGlvbnMubmV4dEFycm93KS5hZGRDbGFzcygnc2xpY2stYXJyb3cnKTtcclxuXHJcbiAgICAgICAgICAgIGlmKCBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICkge1xyXG5cclxuICAgICAgICAgICAgICAgIF8uJHByZXZBcnJvdy5yZW1vdmVDbGFzcygnc2xpY2staGlkZGVuJykucmVtb3ZlQXR0cignYXJpYS1oaWRkZW4gdGFiaW5kZXgnKTtcclxuICAgICAgICAgICAgICAgIF8uJG5leHRBcnJvdy5yZW1vdmVDbGFzcygnc2xpY2staGlkZGVuJykucmVtb3ZlQXR0cignYXJpYS1oaWRkZW4gdGFiaW5kZXgnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoXy5odG1sRXhwci50ZXN0KF8ub3B0aW9ucy5wcmV2QXJyb3cpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy4kcHJldkFycm93LnByZXBlbmRUbyhfLm9wdGlvbnMuYXBwZW5kQXJyb3dzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoXy5odG1sRXhwci50ZXN0KF8ub3B0aW9ucy5uZXh0QXJyb3cpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy4kbmV4dEFycm93LmFwcGVuZFRvKF8ub3B0aW9ucy5hcHBlbmRBcnJvd3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuaW5maW5pdGUgIT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3dcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1kaXNhYmxlZCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdhcmlhLWRpc2FibGVkJywgJ3RydWUnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgXy4kcHJldkFycm93LmFkZCggXy4kbmV4dEFycm93IClcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1oaWRkZW4nKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2FyaWEtZGlzYWJsZWQnOiAndHJ1ZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICd0YWJpbmRleCc6ICctMSdcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmJ1aWxkRG90cyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgIGksIGRvdDtcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5kb3RzID09PSB0cnVlICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcclxuXHJcbiAgICAgICAgICAgIF8uJHNsaWRlci5hZGRDbGFzcygnc2xpY2stZG90dGVkJyk7XHJcblxyXG4gICAgICAgICAgICBkb3QgPSAkKCc8dWwgLz4nKS5hZGRDbGFzcyhfLm9wdGlvbnMuZG90c0NsYXNzKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPD0gXy5nZXREb3RDb3VudCgpOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgICAgIGRvdC5hcHBlbmQoJCgnPGxpIC8+JykuYXBwZW5kKF8ub3B0aW9ucy5jdXN0b21QYWdpbmcuY2FsbCh0aGlzLCBfLCBpKSkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBfLiRkb3RzID0gZG90LmFwcGVuZFRvKF8ub3B0aW9ucy5hcHBlbmREb3RzKTtcclxuXHJcbiAgICAgICAgICAgIF8uJGRvdHMuZmluZCgnbGknKS5maXJzdCgpLmFkZENsYXNzKCdzbGljay1hY3RpdmUnKS5hdHRyKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuYnVpbGRPdXQgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBfLiRzbGlkZXMgPVxyXG4gICAgICAgICAgICBfLiRzbGlkZXJcclxuICAgICAgICAgICAgICAgIC5jaGlsZHJlbiggXy5vcHRpb25zLnNsaWRlICsgJzpub3QoLnNsaWNrLWNsb25lZCknKVxyXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1zbGlkZScpO1xyXG5cclxuICAgICAgICBfLnNsaWRlQ291bnQgPSBfLiRzbGlkZXMubGVuZ3RoO1xyXG5cclxuICAgICAgICBfLiRzbGlkZXMuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xyXG4gICAgICAgICAgICAkKGVsZW1lbnQpXHJcbiAgICAgICAgICAgICAgICAuYXR0cignZGF0YS1zbGljay1pbmRleCcsIGluZGV4KVxyXG4gICAgICAgICAgICAgICAgLmRhdGEoJ29yaWdpbmFsU3R5bGluZycsICQoZWxlbWVudCkuYXR0cignc3R5bGUnKSB8fCAnJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlci5hZGRDbGFzcygnc2xpY2stc2xpZGVyJyk7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlVHJhY2sgPSAoXy5zbGlkZUNvdW50ID09PSAwKSA/XHJcbiAgICAgICAgICAgICQoJzxkaXYgY2xhc3M9XCJzbGljay10cmFja1wiLz4nKS5hcHBlbmRUbyhfLiRzbGlkZXIpIDpcclxuICAgICAgICAgICAgXy4kc2xpZGVzLndyYXBBbGwoJzxkaXYgY2xhc3M9XCJzbGljay10cmFja1wiLz4nKS5wYXJlbnQoKTtcclxuXHJcbiAgICAgICAgXy4kbGlzdCA9IF8uJHNsaWRlVHJhY2sud3JhcChcclxuICAgICAgICAgICAgJzxkaXYgYXJpYS1saXZlPVwicG9saXRlXCIgY2xhc3M9XCJzbGljay1saXN0XCIvPicpLnBhcmVudCgpO1xyXG4gICAgICAgIF8uJHNsaWRlVHJhY2suY3NzKCdvcGFjaXR5JywgMCk7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSB8fCBfLm9wdGlvbnMuc3dpcGVUb1NsaWRlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCA9IDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKCdpbWdbZGF0YS1sYXp5XScsIF8uJHNsaWRlcikubm90KCdbc3JjXScpLmFkZENsYXNzKCdzbGljay1sb2FkaW5nJyk7XHJcblxyXG4gICAgICAgIF8uc2V0dXBJbmZpbml0ZSgpO1xyXG5cclxuICAgICAgICBfLmJ1aWxkQXJyb3dzKCk7XHJcblxyXG4gICAgICAgIF8uYnVpbGREb3RzKCk7XHJcblxyXG4gICAgICAgIF8udXBkYXRlRG90cygpO1xyXG5cclxuXHJcbiAgICAgICAgXy5zZXRTbGlkZUNsYXNzZXModHlwZW9mIF8uY3VycmVudFNsaWRlID09PSAnbnVtYmVyJyA/IF8uY3VycmVudFNsaWRlIDogMCk7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZHJhZ2dhYmxlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIF8uJGxpc3QuYWRkQ2xhc3MoJ2RyYWdnYWJsZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5idWlsZFJvd3MgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLCBhLCBiLCBjLCBuZXdTbGlkZXMsIG51bU9mU2xpZGVzLCBvcmlnaW5hbFNsaWRlcyxzbGlkZXNQZXJTZWN0aW9uO1xyXG5cclxuICAgICAgICBuZXdTbGlkZXMgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XHJcbiAgICAgICAgb3JpZ2luYWxTbGlkZXMgPSBfLiRzbGlkZXIuY2hpbGRyZW4oKTtcclxuXHJcbiAgICAgICAgaWYoXy5vcHRpb25zLnJvd3MgPiAxKSB7XHJcblxyXG4gICAgICAgICAgICBzbGlkZXNQZXJTZWN0aW9uID0gXy5vcHRpb25zLnNsaWRlc1BlclJvdyAqIF8ub3B0aW9ucy5yb3dzO1xyXG4gICAgICAgICAgICBudW1PZlNsaWRlcyA9IE1hdGguY2VpbChcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsU2xpZGVzLmxlbmd0aCAvIHNsaWRlc1BlclNlY3Rpb25cclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGZvcihhID0gMDsgYSA8IG51bU9mU2xpZGVzOyBhKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIHNsaWRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgICAgICBmb3IoYiA9IDA7IGIgPCBfLm9wdGlvbnMucm93czsgYisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcihjID0gMDsgYyA8IF8ub3B0aW9ucy5zbGlkZXNQZXJSb3c7IGMrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gKGEgKiBzbGlkZXNQZXJTZWN0aW9uICsgKChiICogXy5vcHRpb25zLnNsaWRlc1BlclJvdykgKyBjKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcmlnaW5hbFNsaWRlcy5nZXQodGFyZ2V0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93LmFwcGVuZENoaWxkKG9yaWdpbmFsU2xpZGVzLmdldCh0YXJnZXQpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBzbGlkZS5hcHBlbmRDaGlsZChyb3cpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbmV3U2xpZGVzLmFwcGVuZENoaWxkKHNsaWRlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgXy4kc2xpZGVyLmVtcHR5KCkuYXBwZW5kKG5ld1NsaWRlcyk7XHJcbiAgICAgICAgICAgIF8uJHNsaWRlci5jaGlsZHJlbigpLmNoaWxkcmVuKCkuY2hpbGRyZW4oKVxyXG4gICAgICAgICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzooMTAwIC8gXy5vcHRpb25zLnNsaWRlc1BlclJvdykgKyAnJScsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2Rpc3BsYXknOiAnaW5saW5lLWJsb2NrJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5jaGVja1Jlc3BvbnNpdmUgPSBmdW5jdGlvbihpbml0aWFsLCBmb3JjZVVwZGF0ZSkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgIGJyZWFrcG9pbnQsIHRhcmdldEJyZWFrcG9pbnQsIHJlc3BvbmRUb1dpZHRoLCB0cmlnZ2VyQnJlYWtwb2ludCA9IGZhbHNlO1xyXG4gICAgICAgIHZhciBzbGlkZXJXaWR0aCA9IF8uJHNsaWRlci53aWR0aCgpO1xyXG4gICAgICAgIHZhciB3aW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoIHx8ICQod2luZG93KS53aWR0aCgpO1xyXG5cclxuICAgICAgICBpZiAoXy5yZXNwb25kVG8gPT09ICd3aW5kb3cnKSB7XHJcbiAgICAgICAgICAgIHJlc3BvbmRUb1dpZHRoID0gd2luZG93V2lkdGg7XHJcbiAgICAgICAgfSBlbHNlIGlmIChfLnJlc3BvbmRUbyA9PT0gJ3NsaWRlcicpIHtcclxuICAgICAgICAgICAgcmVzcG9uZFRvV2lkdGggPSBzbGlkZXJXaWR0aDtcclxuICAgICAgICB9IGVsc2UgaWYgKF8ucmVzcG9uZFRvID09PSAnbWluJykge1xyXG4gICAgICAgICAgICByZXNwb25kVG9XaWR0aCA9IE1hdGgubWluKHdpbmRvd1dpZHRoLCBzbGlkZXJXaWR0aCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIF8ub3B0aW9ucy5yZXNwb25zaXZlICYmXHJcbiAgICAgICAgICAgIF8ub3B0aW9ucy5yZXNwb25zaXZlLmxlbmd0aCAmJlxyXG4gICAgICAgICAgICBfLm9wdGlvbnMucmVzcG9uc2l2ZSAhPT0gbnVsbCkge1xyXG5cclxuICAgICAgICAgICAgdGFyZ2V0QnJlYWtwb2ludCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGJyZWFrcG9pbnQgaW4gXy5icmVha3BvaW50cykge1xyXG4gICAgICAgICAgICAgICAgaWYgKF8uYnJlYWtwb2ludHMuaGFzT3duUHJvcGVydHkoYnJlYWtwb2ludCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXy5vcmlnaW5hbFNldHRpbmdzLm1vYmlsZUZpcnN0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uZFRvV2lkdGggPCBfLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRCcmVha3BvaW50ID0gXy5icmVha3BvaW50c1ticmVha3BvaW50XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25kVG9XaWR0aCA+IF8uYnJlYWtwb2ludHNbYnJlYWtwb2ludF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEJyZWFrcG9pbnQgPSBfLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0QnJlYWtwb2ludCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKF8uYWN0aXZlQnJlYWtwb2ludCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRCcmVha3BvaW50ICE9PSBfLmFjdGl2ZUJyZWFrcG9pbnQgfHwgZm9yY2VVcGRhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXy5hY3RpdmVCcmVha3BvaW50ID1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEJyZWFrcG9pbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfLmJyZWFrcG9pbnRTZXR0aW5nc1t0YXJnZXRCcmVha3BvaW50XSA9PT0gJ3Vuc2xpY2snKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLnVuc2xpY2sodGFyZ2V0QnJlYWtwb2ludCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgXy5vcmlnaW5hbFNldHRpbmdzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uYnJlYWtwb2ludFNldHRpbmdzW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRCcmVha3BvaW50XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uY3VycmVudFNsaWRlID0gXy5vcHRpb25zLmluaXRpYWxTbGlkZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8ucmVmcmVzaChpbml0aWFsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyQnJlYWtwb2ludCA9IHRhcmdldEJyZWFrcG9pbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBfLmFjdGl2ZUJyZWFrcG9pbnQgPSB0YXJnZXRCcmVha3BvaW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChfLmJyZWFrcG9pbnRTZXR0aW5nc1t0YXJnZXRCcmVha3BvaW50XSA9PT0gJ3Vuc2xpY2snKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8udW5zbGljayh0YXJnZXRCcmVha3BvaW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgXy5vcmlnaW5hbFNldHRpbmdzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5icmVha3BvaW50U2V0dGluZ3NbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0QnJlYWtwb2ludF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5jdXJyZW50U2xpZGUgPSBfLm9wdGlvbnMuaW5pdGlhbFNsaWRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8ucmVmcmVzaChpbml0aWFsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdHJpZ2dlckJyZWFrcG9pbnQgPSB0YXJnZXRCcmVha3BvaW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKF8uYWN0aXZlQnJlYWtwb2ludCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIF8uYWN0aXZlQnJlYWtwb2ludCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5vcHRpb25zID0gXy5vcmlnaW5hbFNldHRpbmdzO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbml0aWFsID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uY3VycmVudFNsaWRlID0gXy5vcHRpb25zLmluaXRpYWxTbGlkZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXy5yZWZyZXNoKGluaXRpYWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRyaWdnZXJCcmVha3BvaW50ID0gdGFyZ2V0QnJlYWtwb2ludDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gb25seSB0cmlnZ2VyIGJyZWFrcG9pbnRzIGR1cmluZyBhbiBhY3R1YWwgYnJlYWsuIG5vdCBvbiBpbml0aWFsaXplLlxyXG4gICAgICAgICAgICBpZiggIWluaXRpYWwgJiYgdHJpZ2dlckJyZWFrcG9pbnQgIT09IGZhbHNlICkge1xyXG4gICAgICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ2JyZWFrcG9pbnQnLCBbXywgdHJpZ2dlckJyZWFrcG9pbnRdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5jaGFuZ2VTbGlkZSA9IGZ1bmN0aW9uKGV2ZW50LCBkb250QW5pbWF0ZSkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgICR0YXJnZXQgPSAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpLFxyXG4gICAgICAgICAgICBpbmRleE9mZnNldCwgc2xpZGVPZmZzZXQsIHVuZXZlbk9mZnNldDtcclxuXHJcbiAgICAgICAgLy8gSWYgdGFyZ2V0IGlzIGEgbGluaywgcHJldmVudCBkZWZhdWx0IGFjdGlvbi5cclxuICAgICAgICBpZigkdGFyZ2V0LmlzKCdhJykpIHtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIElmIHRhcmdldCBpcyBub3QgdGhlIDxsaT4gZWxlbWVudCAoaWU6IGEgY2hpbGQpLCBmaW5kIHRoZSA8bGk+LlxyXG4gICAgICAgIGlmKCEkdGFyZ2V0LmlzKCdsaScpKSB7XHJcbiAgICAgICAgICAgICR0YXJnZXQgPSAkdGFyZ2V0LmNsb3Nlc3QoJ2xpJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1bmV2ZW5PZmZzZXQgPSAoXy5zbGlkZUNvdW50ICUgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsICE9PSAwKTtcclxuICAgICAgICBpbmRleE9mZnNldCA9IHVuZXZlbk9mZnNldCA/IDAgOiAoXy5zbGlkZUNvdW50IC0gXy5jdXJyZW50U2xpZGUpICUgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGV2ZW50LmRhdGEubWVzc2FnZSkge1xyXG5cclxuICAgICAgICAgICAgY2FzZSAncHJldmlvdXMnOlxyXG4gICAgICAgICAgICAgICAgc2xpZGVPZmZzZXQgPSBpbmRleE9mZnNldCA9PT0gMCA/IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCA6IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLSBpbmRleE9mZnNldDtcclxuICAgICAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5zbGlkZUhhbmRsZXIoXy5jdXJyZW50U2xpZGUgLSBzbGlkZU9mZnNldCwgZmFsc2UsIGRvbnRBbmltYXRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAnbmV4dCc6XHJcbiAgICAgICAgICAgICAgICBzbGlkZU9mZnNldCA9IGluZGV4T2Zmc2V0ID09PSAwID8gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIDogaW5kZXhPZmZzZXQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG4gICAgICAgICAgICAgICAgICAgIF8uc2xpZGVIYW5kbGVyKF8uY3VycmVudFNsaWRlICsgc2xpZGVPZmZzZXQsIGZhbHNlLCBkb250QW5pbWF0ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ2luZGV4JzpcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IGV2ZW50LmRhdGEuaW5kZXggPT09IDAgPyAwIDpcclxuICAgICAgICAgICAgICAgICAgICBldmVudC5kYXRhLmluZGV4IHx8ICR0YXJnZXQuaW5kZXgoKSAqIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDtcclxuXHJcbiAgICAgICAgICAgICAgICBfLnNsaWRlSGFuZGxlcihfLmNoZWNrTmF2aWdhYmxlKGluZGV4KSwgZmFsc2UsIGRvbnRBbmltYXRlKTtcclxuICAgICAgICAgICAgICAgICR0YXJnZXQuY2hpbGRyZW4oKS50cmlnZ2VyKCdmb2N1cycpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5jaGVja05hdmlnYWJsZSA9IGZ1bmN0aW9uKGluZGV4KSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgbmF2aWdhYmxlcywgcHJldk5hdmlnYWJsZTtcclxuXHJcbiAgICAgICAgbmF2aWdhYmxlcyA9IF8uZ2V0TmF2aWdhYmxlSW5kZXhlcygpO1xyXG4gICAgICAgIHByZXZOYXZpZ2FibGUgPSAwO1xyXG4gICAgICAgIGlmIChpbmRleCA+IG5hdmlnYWJsZXNbbmF2aWdhYmxlcy5sZW5ndGggLSAxXSkge1xyXG4gICAgICAgICAgICBpbmRleCA9IG5hdmlnYWJsZXNbbmF2aWdhYmxlcy5sZW5ndGggLSAxXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBuIGluIG5hdmlnYWJsZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IG5hdmlnYWJsZXNbbl0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IHByZXZOYXZpZ2FibGU7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBwcmV2TmF2aWdhYmxlID0gbmF2aWdhYmxlc1tuXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGluZGV4O1xyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuY2xlYW5VcEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZG90cyAmJiBfLiRkb3RzICE9PSBudWxsKSB7XHJcblxyXG4gICAgICAgICAgICAkKCdsaScsIF8uJGRvdHMpXHJcbiAgICAgICAgICAgICAgICAub2ZmKCdjbGljay5zbGljaycsIF8uY2hhbmdlU2xpZGUpXHJcbiAgICAgICAgICAgICAgICAub2ZmKCdtb3VzZWVudGVyLnNsaWNrJywgJC5wcm94eShfLmludGVycnVwdCwgXywgdHJ1ZSkpXHJcbiAgICAgICAgICAgICAgICAub2ZmKCdtb3VzZWxlYXZlLnNsaWNrJywgJC5wcm94eShfLmludGVycnVwdCwgXywgZmFsc2UpKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfLiRzbGlkZXIub2ZmKCdmb2N1cy5zbGljayBibHVyLnNsaWNrJyk7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuYXJyb3dzID09PSB0cnVlICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcclxuICAgICAgICAgICAgXy4kcHJldkFycm93ICYmIF8uJHByZXZBcnJvdy5vZmYoJ2NsaWNrLnNsaWNrJywgXy5jaGFuZ2VTbGlkZSk7XHJcbiAgICAgICAgICAgIF8uJG5leHRBcnJvdyAmJiBfLiRuZXh0QXJyb3cub2ZmKCdjbGljay5zbGljaycsIF8uY2hhbmdlU2xpZGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy4kbGlzdC5vZmYoJ3RvdWNoc3RhcnQuc2xpY2sgbW91c2Vkb3duLnNsaWNrJywgXy5zd2lwZUhhbmRsZXIpO1xyXG4gICAgICAgIF8uJGxpc3Qub2ZmKCd0b3VjaG1vdmUuc2xpY2sgbW91c2Vtb3ZlLnNsaWNrJywgXy5zd2lwZUhhbmRsZXIpO1xyXG4gICAgICAgIF8uJGxpc3Qub2ZmKCd0b3VjaGVuZC5zbGljayBtb3VzZXVwLnNsaWNrJywgXy5zd2lwZUhhbmRsZXIpO1xyXG4gICAgICAgIF8uJGxpc3Qub2ZmKCd0b3VjaGNhbmNlbC5zbGljayBtb3VzZWxlYXZlLnNsaWNrJywgXy5zd2lwZUhhbmRsZXIpO1xyXG5cclxuICAgICAgICBfLiRsaXN0Lm9mZignY2xpY2suc2xpY2snLCBfLmNsaWNrSGFuZGxlcik7XHJcblxyXG4gICAgICAgICQoZG9jdW1lbnQpLm9mZihfLnZpc2liaWxpdHlDaGFuZ2UsIF8udmlzaWJpbGl0eSk7XHJcblxyXG4gICAgICAgIF8uY2xlYW5VcFNsaWRlRXZlbnRzKCk7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBfLiRsaXN0Lm9mZigna2V5ZG93bi5zbGljaycsIF8ua2V5SGFuZGxlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmZvY3VzT25TZWxlY3QgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgJChfLiRzbGlkZVRyYWNrKS5jaGlsZHJlbigpLm9mZignY2xpY2suc2xpY2snLCBfLnNlbGVjdEhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLm9mZignb3JpZW50YXRpb25jaGFuZ2Uuc2xpY2suc2xpY2stJyArIF8uaW5zdGFuY2VVaWQsIF8ub3JpZW50YXRpb25DaGFuZ2UpO1xyXG5cclxuICAgICAgICAkKHdpbmRvdykub2ZmKCdyZXNpemUuc2xpY2suc2xpY2stJyArIF8uaW5zdGFuY2VVaWQsIF8ucmVzaXplKTtcclxuXHJcbiAgICAgICAgJCgnW2RyYWdnYWJsZSE9dHJ1ZV0nLCBfLiRzbGlkZVRyYWNrKS5vZmYoJ2RyYWdzdGFydCcsIF8ucHJldmVudERlZmF1bHQpO1xyXG5cclxuICAgICAgICAkKHdpbmRvdykub2ZmKCdsb2FkLnNsaWNrLnNsaWNrLScgKyBfLmluc3RhbmNlVWlkLCBfLnNldFBvc2l0aW9uKTtcclxuICAgICAgICAkKGRvY3VtZW50KS5vZmYoJ3JlYWR5LnNsaWNrLnNsaWNrLScgKyBfLmluc3RhbmNlVWlkLCBfLnNldFBvc2l0aW9uKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5jbGVhblVwU2xpZGVFdmVudHMgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBfLiRsaXN0Lm9mZignbW91c2VlbnRlci5zbGljaycsICQucHJveHkoXy5pbnRlcnJ1cHQsIF8sIHRydWUpKTtcclxuICAgICAgICBfLiRsaXN0Lm9mZignbW91c2VsZWF2ZS5zbGljaycsICQucHJveHkoXy5pbnRlcnJ1cHQsIF8sIGZhbHNlKSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuY2xlYW5VcFJvd3MgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLCBvcmlnaW5hbFNsaWRlcztcclxuXHJcbiAgICAgICAgaWYoXy5vcHRpb25zLnJvd3MgPiAxKSB7XHJcbiAgICAgICAgICAgIG9yaWdpbmFsU2xpZGVzID0gXy4kc2xpZGVzLmNoaWxkcmVuKCkuY2hpbGRyZW4oKTtcclxuICAgICAgICAgICAgb3JpZ2luYWxTbGlkZXMucmVtb3ZlQXR0cignc3R5bGUnKTtcclxuICAgICAgICAgICAgXy4kc2xpZGVyLmVtcHR5KCkuYXBwZW5kKG9yaWdpbmFsU2xpZGVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuY2xpY2tIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoXy5zaG91bGRDbGljayA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24ocmVmcmVzaCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIF8uYXV0b1BsYXlDbGVhcigpO1xyXG5cclxuICAgICAgICBfLnRvdWNoT2JqZWN0ID0ge307XHJcblxyXG4gICAgICAgIF8uY2xlYW5VcEV2ZW50cygpO1xyXG5cclxuICAgICAgICAkKCcuc2xpY2stY2xvbmVkJywgXy4kc2xpZGVyKS5kZXRhY2goKTtcclxuXHJcbiAgICAgICAgaWYgKF8uJGRvdHMpIHtcclxuICAgICAgICAgICAgXy4kZG90cy5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBpZiAoIF8uJHByZXZBcnJvdyAmJiBfLiRwcmV2QXJyb3cubGVuZ3RoICkge1xyXG5cclxuICAgICAgICAgICAgXy4kcHJldkFycm93XHJcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NsaWNrLWRpc2FibGVkIHNsaWNrLWFycm93IHNsaWNrLWhpZGRlbicpXHJcbiAgICAgICAgICAgICAgICAucmVtb3ZlQXR0cignYXJpYS1oaWRkZW4gYXJpYS1kaXNhYmxlZCB0YWJpbmRleCcpXHJcbiAgICAgICAgICAgICAgICAuY3NzKCdkaXNwbGF5JywnJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIF8uaHRtbEV4cHIudGVzdCggXy5vcHRpb25zLnByZXZBcnJvdyApKSB7XHJcbiAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggXy4kbmV4dEFycm93ICYmIF8uJG5leHRBcnJvdy5sZW5ndGggKSB7XHJcblxyXG4gICAgICAgICAgICBfLiRuZXh0QXJyb3dcclxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnc2xpY2stZGlzYWJsZWQgc2xpY2stYXJyb3cgc2xpY2staGlkZGVuJylcclxuICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCdhcmlhLWhpZGRlbiBhcmlhLWRpc2FibGVkIHRhYmluZGV4JylcclxuICAgICAgICAgICAgICAgIC5jc3MoJ2Rpc3BsYXknLCcnKTtcclxuXHJcbiAgICAgICAgICAgIGlmICggXy5odG1sRXhwci50ZXN0KCBfLm9wdGlvbnMubmV4dEFycm93ICkpIHtcclxuICAgICAgICAgICAgICAgIF8uJG5leHRBcnJvdy5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBpZiAoXy4kc2xpZGVzKSB7XHJcblxyXG4gICAgICAgICAgICBfLiRzbGlkZXNcclxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnc2xpY2stc2xpZGUgc2xpY2stYWN0aXZlIHNsaWNrLWNlbnRlciBzbGljay12aXNpYmxlIHNsaWNrLWN1cnJlbnQnKVxyXG4gICAgICAgICAgICAgICAgLnJlbW92ZUF0dHIoJ2FyaWEtaGlkZGVuJylcclxuICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCdkYXRhLXNsaWNrLWluZGV4JylcclxuICAgICAgICAgICAgICAgIC5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdzdHlsZScsICQodGhpcykuZGF0YSgnb3JpZ2luYWxTdHlsaW5nJykpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZGV0YWNoKCk7XHJcblxyXG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmRldGFjaCgpO1xyXG5cclxuICAgICAgICAgICAgXy4kbGlzdC5kZXRhY2goKTtcclxuXHJcbiAgICAgICAgICAgIF8uJHNsaWRlci5hcHBlbmQoXy4kc2xpZGVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF8uY2xlYW5VcFJvd3MoKTtcclxuXHJcbiAgICAgICAgXy4kc2xpZGVyLnJlbW92ZUNsYXNzKCdzbGljay1zbGlkZXInKTtcclxuICAgICAgICBfLiRzbGlkZXIucmVtb3ZlQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJyk7XHJcbiAgICAgICAgXy4kc2xpZGVyLnJlbW92ZUNsYXNzKCdzbGljay1kb3R0ZWQnKTtcclxuXHJcbiAgICAgICAgXy51bnNsaWNrZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICBpZighcmVmcmVzaCkge1xyXG4gICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignZGVzdHJveScsIFtfXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmRpc2FibGVUcmFuc2l0aW9uID0gZnVuY3Rpb24oc2xpZGUpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLFxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uID0ge307XHJcblxyXG4gICAgICAgIHRyYW5zaXRpb25bXy50cmFuc2l0aW9uVHlwZV0gPSAnJztcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNzcyh0cmFuc2l0aW9uKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBfLiRzbGlkZXMuZXEoc2xpZGUpLmNzcyh0cmFuc2l0aW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuZmFkZVNsaWRlID0gZnVuY3Rpb24oc2xpZGVJbmRleCwgY2FsbGJhY2spIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoXy5jc3NUcmFuc2l0aW9ucyA9PT0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgICAgIF8uJHNsaWRlcy5lcShzbGlkZUluZGV4KS5jc3Moe1xyXG4gICAgICAgICAgICAgICAgekluZGV4OiBfLm9wdGlvbnMuekluZGV4XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgXy4kc2xpZGVzLmVxKHNsaWRlSW5kZXgpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMVxyXG4gICAgICAgICAgICB9LCBfLm9wdGlvbnMuc3BlZWQsIF8ub3B0aW9ucy5lYXNpbmcsIGNhbGxiYWNrKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIF8uYXBwbHlUcmFuc2l0aW9uKHNsaWRlSW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgXy4kc2xpZGVzLmVxKHNsaWRlSW5kZXgpLmNzcyh7XHJcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAxLFxyXG4gICAgICAgICAgICAgICAgekluZGV4OiBfLm9wdGlvbnMuekluZGV4XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBfLmRpc2FibGVUcmFuc2l0aW9uKHNsaWRlSW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKCk7XHJcbiAgICAgICAgICAgICAgICB9LCBfLm9wdGlvbnMuc3BlZWQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5mYWRlU2xpZGVPdXQgPSBmdW5jdGlvbihzbGlkZUluZGV4KSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKF8uY3NzVHJhbnNpdGlvbnMgPT09IGZhbHNlKSB7XHJcblxyXG4gICAgICAgICAgICBfLiRzbGlkZXMuZXEoc2xpZGVJbmRleCkuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLFxyXG4gICAgICAgICAgICAgICAgekluZGV4OiBfLm9wdGlvbnMuekluZGV4IC0gMlxyXG4gICAgICAgICAgICB9LCBfLm9wdGlvbnMuc3BlZWQsIF8ub3B0aW9ucy5lYXNpbmcpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgXy5hcHBseVRyYW5zaXRpb24oc2xpZGVJbmRleCk7XHJcblxyXG4gICAgICAgICAgICBfLiRzbGlkZXMuZXEoc2xpZGVJbmRleCkuY3NzKHtcclxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAsXHJcbiAgICAgICAgICAgICAgICB6SW5kZXg6IF8ub3B0aW9ucy56SW5kZXggLSAyXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuZmlsdGVyU2xpZGVzID0gU2xpY2sucHJvdG90eXBlLnNsaWNrRmlsdGVyID0gZnVuY3Rpb24oZmlsdGVyKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKGZpbHRlciAhPT0gbnVsbCkge1xyXG5cclxuICAgICAgICAgICAgXy4kc2xpZGVzQ2FjaGUgPSBfLiRzbGlkZXM7XHJcblxyXG4gICAgICAgICAgICBfLnVubG9hZCgpO1xyXG5cclxuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmRldGFjaCgpO1xyXG5cclxuICAgICAgICAgICAgXy4kc2xpZGVzQ2FjaGUuZmlsdGVyKGZpbHRlcikuYXBwZW5kVG8oXy4kc2xpZGVUcmFjayk7XHJcblxyXG4gICAgICAgICAgICBfLnJlaW5pdCgpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuZm9jdXNIYW5kbGVyID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgXy4kc2xpZGVyXHJcbiAgICAgICAgICAgIC5vZmYoJ2ZvY3VzLnNsaWNrIGJsdXIuc2xpY2snKVxyXG4gICAgICAgICAgICAub24oJ2ZvY3VzLnNsaWNrIGJsdXIuc2xpY2snLFxyXG4gICAgICAgICAgICAgICAgJyo6bm90KC5zbGljay1hcnJvdyknLCBmdW5jdGlvbihldmVudCkge1xyXG5cclxuICAgICAgICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIHZhciAkc2YgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiggXy5vcHRpb25zLnBhdXNlT25Gb2N1cyApIHtcclxuICAgICAgICAgICAgICAgICAgICBfLmZvY3Vzc2VkID0gJHNmLmlzKCc6Zm9jdXMnKTtcclxuICAgICAgICAgICAgICAgICAgICBfLmF1dG9QbGF5KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9LCAwKTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5nZXRDdXJyZW50ID0gU2xpY2sucHJvdG90eXBlLnNsaWNrQ3VycmVudFNsaWRlID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuICAgICAgICByZXR1cm4gXy5jdXJyZW50U2xpZGU7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuZ2V0RG90Q291bnQgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgYnJlYWtQb2ludCA9IDA7XHJcbiAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xyXG4gICAgICAgIHZhciBwYWdlclF0eSA9IDA7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuaW5maW5pdGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgd2hpbGUgKGJyZWFrUG9pbnQgPCBfLnNsaWRlQ291bnQpIHtcclxuICAgICAgICAgICAgICAgICsrcGFnZXJRdHk7XHJcbiAgICAgICAgICAgICAgICBicmVha1BvaW50ID0gY291bnRlciArIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDtcclxuICAgICAgICAgICAgICAgIGNvdW50ZXIgKz0gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgPyBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgOiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBwYWdlclF0eSA9IF8uc2xpZGVDb3VudDtcclxuICAgICAgICB9IGVsc2UgaWYoIV8ub3B0aW9ucy5hc05hdkZvcikge1xyXG4gICAgICAgICAgICBwYWdlclF0eSA9IDEgKyBNYXRoLmNlaWwoKF8uc2xpZGVDb3VudCAtIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIC8gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKTtcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIHdoaWxlIChicmVha1BvaW50IDwgXy5zbGlkZUNvdW50KSB7XHJcbiAgICAgICAgICAgICAgICArK3BhZ2VyUXR5O1xyXG4gICAgICAgICAgICAgICAgYnJlYWtQb2ludCA9IGNvdW50ZXIgKyBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7XHJcbiAgICAgICAgICAgICAgICBjb3VudGVyICs9IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ID8gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIDogXy5vcHRpb25zLnNsaWRlc1RvU2hvdztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHBhZ2VyUXR5IC0gMTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5nZXRMZWZ0ID0gZnVuY3Rpb24oc2xpZGVJbmRleCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgIHRhcmdldExlZnQsXHJcbiAgICAgICAgICAgIHZlcnRpY2FsSGVpZ2h0LFxyXG4gICAgICAgICAgICB2ZXJ0aWNhbE9mZnNldCA9IDAsXHJcbiAgICAgICAgICAgIHRhcmdldFNsaWRlO1xyXG5cclxuICAgICAgICBfLnNsaWRlT2Zmc2V0ID0gMDtcclxuICAgICAgICB2ZXJ0aWNhbEhlaWdodCA9IF8uJHNsaWRlcy5maXJzdCgpLm91dGVySGVpZ2h0KHRydWUpO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmluZmluaXRlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcbiAgICAgICAgICAgICAgICBfLnNsaWRlT2Zmc2V0ID0gKF8uc2xpZGVXaWR0aCAqIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpICogLTE7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbE9mZnNldCA9ICh2ZXJ0aWNhbEhlaWdodCAqIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpICogLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKF8uc2xpZGVDb3VudCAlIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNsaWRlSW5kZXggKyBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgPiBfLnNsaWRlQ291bnQgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzbGlkZUluZGV4ID4gXy5zbGlkZUNvdW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uc2xpZGVPZmZzZXQgPSAoKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLSAoc2xpZGVJbmRleCAtIF8uc2xpZGVDb3VudCkpICogXy5zbGlkZVdpZHRoKSAqIC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbE9mZnNldCA9ICgoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAtIChzbGlkZUluZGV4IC0gXy5zbGlkZUNvdW50KSkgKiB2ZXJ0aWNhbEhlaWdodCkgKiAtMTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfLnNsaWRlT2Zmc2V0ID0gKChfLnNsaWRlQ291bnQgJSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpICogXy5zbGlkZVdpZHRoKSAqIC0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbE9mZnNldCA9ICgoXy5zbGlkZUNvdW50ICUgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKSAqIHZlcnRpY2FsSGVpZ2h0KSAqIC0xO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChzbGlkZUluZGV4ICsgXy5vcHRpb25zLnNsaWRlc1RvU2hvdyA+IF8uc2xpZGVDb3VudCkge1xyXG4gICAgICAgICAgICAgICAgXy5zbGlkZU9mZnNldCA9ICgoc2xpZGVJbmRleCArIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIC0gXy5zbGlkZUNvdW50KSAqIF8uc2xpZGVXaWR0aDtcclxuICAgICAgICAgICAgICAgIHZlcnRpY2FsT2Zmc2V0ID0gKChzbGlkZUluZGV4ICsgXy5vcHRpb25zLnNsaWRlc1RvU2hvdykgLSBfLnNsaWRlQ291bnQpICogdmVydGljYWxIZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfLnNsaWRlQ291bnQgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG4gICAgICAgICAgICBfLnNsaWRlT2Zmc2V0ID0gMDtcclxuICAgICAgICAgICAgdmVydGljYWxPZmZzZXQgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlICYmIF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBfLnNsaWRlT2Zmc2V0ICs9IF8uc2xpZGVXaWR0aCAqIE1hdGguZmxvb3IoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAvIDIpIC0gXy5zbGlkZVdpZHRoO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgXy5zbGlkZU9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgIF8uc2xpZGVPZmZzZXQgKz0gXy5zbGlkZVdpZHRoICogTWF0aC5mbG9vcihfLm9wdGlvbnMuc2xpZGVzVG9TaG93IC8gMik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICB0YXJnZXRMZWZ0ID0gKChzbGlkZUluZGV4ICogXy5zbGlkZVdpZHRoKSAqIC0xKSArIF8uc2xpZGVPZmZzZXQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGFyZ2V0TGVmdCA9ICgoc2xpZGVJbmRleCAqIHZlcnRpY2FsSGVpZ2h0KSAqIC0xKSArIHZlcnRpY2FsT2Zmc2V0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy52YXJpYWJsZVdpZHRoID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50IDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgfHwgXy5vcHRpb25zLmluZmluaXRlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0U2xpZGUgPSBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKCcuc2xpY2stc2xpZGUnKS5lcShzbGlkZUluZGV4KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldFNsaWRlID0gXy4kc2xpZGVUcmFjay5jaGlsZHJlbignLnNsaWNrLXNsaWRlJykuZXEoc2xpZGVJbmRleCArIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLnJ0bCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldFNsaWRlWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0TGVmdCA9IChfLiRzbGlkZVRyYWNrLndpZHRoKCkgLSB0YXJnZXRTbGlkZVswXS5vZmZzZXRMZWZ0IC0gdGFyZ2V0U2xpZGUud2lkdGgoKSkgKiAtMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0TGVmdCA9ICAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0TGVmdCA9IHRhcmdldFNsaWRlWzBdID8gdGFyZ2V0U2xpZGVbMF0ub2Zmc2V0TGVmdCAqIC0xIDogMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50IDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgfHwgXy5vcHRpb25zLmluZmluaXRlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFNsaWRlID0gXy4kc2xpZGVUcmFjay5jaGlsZHJlbignLnNsaWNrLXNsaWRlJykuZXEoc2xpZGVJbmRleCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFNsaWRlID0gXy4kc2xpZGVUcmFjay5jaGlsZHJlbignLnNsaWNrLXNsaWRlJykuZXEoc2xpZGVJbmRleCArIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgKyAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoXy5vcHRpb25zLnJ0bCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRTbGlkZVswXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRMZWZ0ID0gKF8uJHNsaWRlVHJhY2sud2lkdGgoKSAtIHRhcmdldFNsaWRlWzBdLm9mZnNldExlZnQgLSB0YXJnZXRTbGlkZS53aWR0aCgpKSAqIC0xO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldExlZnQgPSAgMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldExlZnQgPSB0YXJnZXRTbGlkZVswXSA/IHRhcmdldFNsaWRlWzBdLm9mZnNldExlZnQgKiAtMSA6IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0TGVmdCArPSAoXy4kbGlzdC53aWR0aCgpIC0gdGFyZ2V0U2xpZGUub3V0ZXJXaWR0aCgpKSAvIDI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0YXJnZXRMZWZ0O1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmdldE9wdGlvbiA9IFNsaWNrLnByb3RvdHlwZS5zbGlja0dldE9wdGlvbiA9IGZ1bmN0aW9uKG9wdGlvbikge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIHJldHVybiBfLm9wdGlvbnNbb3B0aW9uXTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5nZXROYXZpZ2FibGVJbmRleGVzID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgYnJlYWtQb2ludCA9IDAsXHJcbiAgICAgICAgICAgIGNvdW50ZXIgPSAwLFxyXG4gICAgICAgICAgICBpbmRleGVzID0gW10sXHJcbiAgICAgICAgICAgIG1heDtcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgbWF4ID0gXy5zbGlkZUNvdW50O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGJyZWFrUG9pbnQgPSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgKiAtMTtcclxuICAgICAgICAgICAgY291bnRlciA9IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCAqIC0xO1xyXG4gICAgICAgICAgICBtYXggPSBfLnNsaWRlQ291bnQgKiAyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgd2hpbGUgKGJyZWFrUG9pbnQgPCBtYXgpIHtcclxuICAgICAgICAgICAgaW5kZXhlcy5wdXNoKGJyZWFrUG9pbnQpO1xyXG4gICAgICAgICAgICBicmVha1BvaW50ID0gY291bnRlciArIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDtcclxuICAgICAgICAgICAgY291bnRlciArPSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyA/IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCA6IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3c7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaW5kZXhlcztcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5nZXRTbGljayA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5nZXRTbGlkZUNvdW50ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgc2xpZGVzVHJhdmVyc2VkLCBzd2lwZWRTbGlkZSwgY2VudGVyT2Zmc2V0O1xyXG5cclxuICAgICAgICBjZW50ZXJPZmZzZXQgPSBfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSA/IF8uc2xpZGVXaWR0aCAqIE1hdGguZmxvb3IoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAvIDIpIDogMDtcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5zd2lwZVRvU2xpZGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5maW5kKCcuc2xpY2stc2xpZGUnKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCBzbGlkZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNsaWRlLm9mZnNldExlZnQgLSBjZW50ZXJPZmZzZXQgKyAoJChzbGlkZSkub3V0ZXJXaWR0aCgpIC8gMikgPiAoXy5zd2lwZUxlZnQgKiAtMSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzd2lwZWRTbGlkZSA9IHNsaWRlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzbGlkZXNUcmF2ZXJzZWQgPSBNYXRoLmFicygkKHN3aXBlZFNsaWRlKS5hdHRyKCdkYXRhLXNsaWNrLWluZGV4JykgLSBfLmN1cnJlbnRTbGlkZSkgfHwgMTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzbGlkZXNUcmF2ZXJzZWQ7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmdvVG8gPSBTbGljay5wcm90b3R5cGUuc2xpY2tHb1RvID0gZnVuY3Rpb24oc2xpZGUsIGRvbnRBbmltYXRlKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgXy5jaGFuZ2VTbGlkZSh7XHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdpbmRleCcsXHJcbiAgICAgICAgICAgICAgICBpbmRleDogcGFyc2VJbnQoc2xpZGUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBkb250QW5pbWF0ZSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKGNyZWF0aW9uKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKCEkKF8uJHNsaWRlcikuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcclxuXHJcbiAgICAgICAgICAgICQoXy4kc2xpZGVyKS5hZGRDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKTtcclxuXHJcbiAgICAgICAgICAgIF8uYnVpbGRSb3dzKCk7XHJcbiAgICAgICAgICAgIF8uYnVpbGRPdXQoKTtcclxuICAgICAgICAgICAgXy5zZXRQcm9wcygpO1xyXG4gICAgICAgICAgICBfLnN0YXJ0TG9hZCgpO1xyXG4gICAgICAgICAgICBfLmxvYWRTbGlkZXIoKTtcclxuICAgICAgICAgICAgXy5pbml0aWFsaXplRXZlbnRzKCk7XHJcbiAgICAgICAgICAgIF8udXBkYXRlQXJyb3dzKCk7XHJcbiAgICAgICAgICAgIF8udXBkYXRlRG90cygpO1xyXG4gICAgICAgICAgICBfLmNoZWNrUmVzcG9uc2l2ZSh0cnVlKTtcclxuICAgICAgICAgICAgXy5mb2N1c0hhbmRsZXIoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY3JlYXRpb24pIHtcclxuICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ2luaXQnLCBbX10pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5hY2Nlc3NpYmlsaXR5ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIF8uaW5pdEFEQSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCBfLm9wdGlvbnMuYXV0b3BsYXkgKSB7XHJcblxyXG4gICAgICAgICAgICBfLnBhdXNlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBfLmF1dG9QbGF5KCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5pbml0QURBID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG4gICAgICAgIF8uJHNsaWRlcy5hZGQoXy4kc2xpZGVUcmFjay5maW5kKCcuc2xpY2stY2xvbmVkJykpLmF0dHIoe1xyXG4gICAgICAgICAgICAnYXJpYS1oaWRkZW4nOiAndHJ1ZScsXHJcbiAgICAgICAgICAgICd0YWJpbmRleCc6ICctMSdcclxuICAgICAgICB9KS5maW5kKCdhLCBpbnB1dCwgYnV0dG9uLCBzZWxlY3QnKS5hdHRyKHtcclxuICAgICAgICAgICAgJ3RhYmluZGV4JzogJy0xJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBfLiRzbGlkZVRyYWNrLmF0dHIoJ3JvbGUnLCAnbGlzdGJveCcpO1xyXG5cclxuICAgICAgICBfLiRzbGlkZXMubm90KF8uJHNsaWRlVHJhY2suZmluZCgnLnNsaWNrLWNsb25lZCcpKS5lYWNoKGZ1bmN0aW9uKGkpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5hdHRyKHtcclxuICAgICAgICAgICAgICAgICdyb2xlJzogJ29wdGlvbicsXHJcbiAgICAgICAgICAgICAgICAnYXJpYS1kZXNjcmliZWRieSc6ICdzbGljay1zbGlkZScgKyBfLmluc3RhbmNlVWlkICsgaSArICcnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoXy4kZG90cyAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBfLiRkb3RzLmF0dHIoJ3JvbGUnLCAndGFibGlzdCcpLmZpbmQoJ2xpJykuZWFjaChmdW5jdGlvbihpKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgICAgICdyb2xlJzogJ3ByZXNlbnRhdGlvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2FyaWEtc2VsZWN0ZWQnOiAnZmFsc2UnLFxyXG4gICAgICAgICAgICAgICAgICAgICdhcmlhLWNvbnRyb2xzJzogJ25hdmlnYXRpb24nICsgXy5pbnN0YW5jZVVpZCArIGkgKyAnJyxcclxuICAgICAgICAgICAgICAgICAgICAnaWQnOiAnc2xpY2stc2xpZGUnICsgXy5pbnN0YW5jZVVpZCArIGkgKyAnJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuZmlyc3QoKS5hdHRyKCdhcmlhLXNlbGVjdGVkJywgJ3RydWUnKS5lbmQoKVxyXG4gICAgICAgICAgICAgICAgLmZpbmQoJ2J1dHRvbicpLmF0dHIoJ3JvbGUnLCAnYnV0dG9uJykuZW5kKClcclxuICAgICAgICAgICAgICAgIC5jbG9zZXN0KCdkaXYnKS5hdHRyKCdyb2xlJywgJ3Rvb2xiYXInKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXy5hY3RpdmF0ZUFEQSgpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmluaXRBcnJvd0V2ZW50cyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuYXJyb3dzID09PSB0cnVlICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcclxuICAgICAgICAgICAgXy4kcHJldkFycm93XHJcbiAgICAgICAgICAgICAgIC5vZmYoJ2NsaWNrLnNsaWNrJylcclxuICAgICAgICAgICAgICAgLm9uKCdjbGljay5zbGljaycsIHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAncHJldmlvdXMnXHJcbiAgICAgICAgICAgICAgIH0sIF8uY2hhbmdlU2xpZGUpO1xyXG4gICAgICAgICAgICBfLiRuZXh0QXJyb3dcclxuICAgICAgICAgICAgICAgLm9mZignY2xpY2suc2xpY2snKVxyXG4gICAgICAgICAgICAgICAub24oJ2NsaWNrLnNsaWNrJywge1xyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICduZXh0J1xyXG4gICAgICAgICAgICAgICB9LCBfLmNoYW5nZVNsaWRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuaW5pdERvdEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZG90cyA9PT0gdHJ1ZSAmJiBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcbiAgICAgICAgICAgICQoJ2xpJywgXy4kZG90cykub24oJ2NsaWNrLnNsaWNrJywge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ2luZGV4J1xyXG4gICAgICAgICAgICB9LCBfLmNoYW5nZVNsaWRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggXy5vcHRpb25zLmRvdHMgPT09IHRydWUgJiYgXy5vcHRpb25zLnBhdXNlT25Eb3RzSG92ZXIgPT09IHRydWUgKSB7XHJcblxyXG4gICAgICAgICAgICAkKCdsaScsIF8uJGRvdHMpXHJcbiAgICAgICAgICAgICAgICAub24oJ21vdXNlZW50ZXIuc2xpY2snLCAkLnByb3h5KF8uaW50ZXJydXB0LCBfLCB0cnVlKSlcclxuICAgICAgICAgICAgICAgIC5vbignbW91c2VsZWF2ZS5zbGljaycsICQucHJveHkoXy5pbnRlcnJ1cHQsIF8sIGZhbHNlKSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5pbml0U2xpZGVFdmVudHMgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoIF8ub3B0aW9ucy5wYXVzZU9uSG92ZXIgKSB7XHJcblxyXG4gICAgICAgICAgICBfLiRsaXN0Lm9uKCdtb3VzZWVudGVyLnNsaWNrJywgJC5wcm94eShfLmludGVycnVwdCwgXywgdHJ1ZSkpO1xyXG4gICAgICAgICAgICBfLiRsaXN0Lm9uKCdtb3VzZWxlYXZlLnNsaWNrJywgJC5wcm94eShfLmludGVycnVwdCwgXywgZmFsc2UpKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmluaXRpYWxpemVFdmVudHMgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBfLmluaXRBcnJvd0V2ZW50cygpO1xyXG5cclxuICAgICAgICBfLmluaXREb3RFdmVudHMoKTtcclxuICAgICAgICBfLmluaXRTbGlkZUV2ZW50cygpO1xyXG5cclxuICAgICAgICBfLiRsaXN0Lm9uKCd0b3VjaHN0YXJ0LnNsaWNrIG1vdXNlZG93bi5zbGljaycsIHtcclxuICAgICAgICAgICAgYWN0aW9uOiAnc3RhcnQnXHJcbiAgICAgICAgfSwgXy5zd2lwZUhhbmRsZXIpO1xyXG4gICAgICAgIF8uJGxpc3Qub24oJ3RvdWNobW92ZS5zbGljayBtb3VzZW1vdmUuc2xpY2snLCB7XHJcbiAgICAgICAgICAgIGFjdGlvbjogJ21vdmUnXHJcbiAgICAgICAgfSwgXy5zd2lwZUhhbmRsZXIpO1xyXG4gICAgICAgIF8uJGxpc3Qub24oJ3RvdWNoZW5kLnNsaWNrIG1vdXNldXAuc2xpY2snLCB7XHJcbiAgICAgICAgICAgIGFjdGlvbjogJ2VuZCdcclxuICAgICAgICB9LCBfLnN3aXBlSGFuZGxlcik7XHJcbiAgICAgICAgXy4kbGlzdC5vbigndG91Y2hjYW5jZWwuc2xpY2sgbW91c2VsZWF2ZS5zbGljaycsIHtcclxuICAgICAgICAgICAgYWN0aW9uOiAnZW5kJ1xyXG4gICAgICAgIH0sIF8uc3dpcGVIYW5kbGVyKTtcclxuXHJcbiAgICAgICAgXy4kbGlzdC5vbignY2xpY2suc2xpY2snLCBfLmNsaWNrSGFuZGxlcik7XHJcblxyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKF8udmlzaWJpbGl0eUNoYW5nZSwgJC5wcm94eShfLnZpc2liaWxpdHksIF8pKTtcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5hY2Nlc3NpYmlsaXR5ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIF8uJGxpc3Qub24oJ2tleWRvd24uc2xpY2snLCBfLmtleUhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5mb2N1c09uU2VsZWN0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICQoXy4kc2xpZGVUcmFjaykuY2hpbGRyZW4oKS5vbignY2xpY2suc2xpY2snLCBfLnNlbGVjdEhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdvcmllbnRhdGlvbmNoYW5nZS5zbGljay5zbGljay0nICsgXy5pbnN0YW5jZVVpZCwgJC5wcm94eShfLm9yaWVudGF0aW9uQ2hhbmdlLCBfKSk7XHJcblxyXG4gICAgICAgICQod2luZG93KS5vbigncmVzaXplLnNsaWNrLnNsaWNrLScgKyBfLmluc3RhbmNlVWlkLCAkLnByb3h5KF8ucmVzaXplLCBfKSk7XHJcblxyXG4gICAgICAgICQoJ1tkcmFnZ2FibGUhPXRydWVdJywgXy4kc2xpZGVUcmFjaykub24oJ2RyYWdzdGFydCcsIF8ucHJldmVudERlZmF1bHQpO1xyXG5cclxuICAgICAgICAkKHdpbmRvdykub24oJ2xvYWQuc2xpY2suc2xpY2stJyArIF8uaW5zdGFuY2VVaWQsIF8uc2V0UG9zaXRpb24pO1xyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdyZWFkeS5zbGljay5zbGljay0nICsgXy5pbnN0YW5jZVVpZCwgXy5zZXRQb3NpdGlvbik7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuaW5pdFVJID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5hcnJvd3MgPT09IHRydWUgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG5cclxuICAgICAgICAgICAgXy4kcHJldkFycm93LnNob3coKTtcclxuICAgICAgICAgICAgXy4kbmV4dEFycm93LnNob3coKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmRvdHMgPT09IHRydWUgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG5cclxuICAgICAgICAgICAgXy4kZG90cy5zaG93KCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5rZXlIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG4gICAgICAgICAvL0RvbnQgc2xpZGUgaWYgdGhlIGN1cnNvciBpcyBpbnNpZGUgdGhlIGZvcm0gZmllbGRzIGFuZCBhcnJvdyBrZXlzIGFyZSBwcmVzc2VkXHJcbiAgICAgICAgaWYoIWV2ZW50LnRhcmdldC50YWdOYW1lLm1hdGNoKCdURVhUQVJFQXxJTlBVVHxTRUxFQ1QnKSkge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzcgJiYgXy5vcHRpb25zLmFjY2Vzc2liaWxpdHkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIF8uY2hhbmdlU2xpZGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXy5vcHRpb25zLnJ0bCA9PT0gdHJ1ZSA/ICduZXh0JyA6ICAncHJldmlvdXMnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzkgJiYgXy5vcHRpb25zLmFjY2Vzc2liaWxpdHkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIF8uY2hhbmdlU2xpZGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXy5vcHRpb25zLnJ0bCA9PT0gdHJ1ZSA/ICdwcmV2aW91cycgOiAnbmV4dCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5sYXp5TG9hZCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgIGxvYWRSYW5nZSwgY2xvbmVSYW5nZSwgcmFuZ2VTdGFydCwgcmFuZ2VFbmQ7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvYWRJbWFnZXMoaW1hZ2VzU2NvcGUpIHtcclxuXHJcbiAgICAgICAgICAgICQoJ2ltZ1tkYXRhLWxhenldJywgaW1hZ2VzU2NvcGUpLmVhY2goZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGltYWdlID0gJCh0aGlzKSxcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZVNvdXJjZSA9ICQodGhpcykuYXR0cignZGF0YS1sYXp5JyksXHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VUb0xvYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbWFnZVRvTG9hZC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFuaW1hdGUoeyBvcGFjaXR5OiAwIH0sIDEwMCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdzcmMnLCBpbWFnZVNvdXJjZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYW5pbWF0ZSh7IG9wYWNpdHk6IDEgfSwgMjAwLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCdkYXRhLWxhenknKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdzbGljay1sb2FkaW5nJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignbGF6eUxvYWRlZCcsIFtfLCBpbWFnZSwgaW1hZ2VTb3VyY2VdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbWFnZVRvTG9hZC5vbmVycm9yID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCAnZGF0YS1sYXp5JyApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcyggJ3NsaWNrLWxvYWRpbmcnIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCAnc2xpY2stbGF6eWxvYWQtZXJyb3InICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdsYXp5TG9hZEVycm9yJywgWyBfLCBpbWFnZSwgaW1hZ2VTb3VyY2UgXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbWFnZVRvTG9hZC5zcmMgPSBpbWFnZVNvdXJjZTtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmluZmluaXRlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICByYW5nZVN0YXJ0ID0gXy5jdXJyZW50U2xpZGUgKyAoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAvIDIgKyAxKTtcclxuICAgICAgICAgICAgICAgIHJhbmdlRW5kID0gcmFuZ2VTdGFydCArIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgKyAyO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmFuZ2VTdGFydCA9IE1hdGgubWF4KDAsIF8uY3VycmVudFNsaWRlIC0gKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLyAyICsgMSkpO1xyXG4gICAgICAgICAgICAgICAgcmFuZ2VFbmQgPSAyICsgKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLyAyICsgMSkgKyBfLmN1cnJlbnRTbGlkZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJhbmdlU3RhcnQgPSBfLm9wdGlvbnMuaW5maW5pdGUgPyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICsgXy5jdXJyZW50U2xpZGUgOiBfLmN1cnJlbnRTbGlkZTtcclxuICAgICAgICAgICAgcmFuZ2VFbmQgPSBNYXRoLmNlaWwocmFuZ2VTdGFydCArIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpO1xyXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyYW5nZVN0YXJ0ID4gMCkgcmFuZ2VTdGFydC0tO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJhbmdlRW5kIDw9IF8uc2xpZGVDb3VudCkgcmFuZ2VFbmQrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbG9hZFJhbmdlID0gXy4kc2xpZGVyLmZpbmQoJy5zbGljay1zbGlkZScpLnNsaWNlKHJhbmdlU3RhcnQsIHJhbmdlRW5kKTtcclxuICAgICAgICBsb2FkSW1hZ2VzKGxvYWRSYW5nZSk7XHJcblxyXG4gICAgICAgIGlmIChfLnNsaWRlQ291bnQgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG4gICAgICAgICAgICBjbG9uZVJhbmdlID0gXy4kc2xpZGVyLmZpbmQoJy5zbGljay1zbGlkZScpO1xyXG4gICAgICAgICAgICBsb2FkSW1hZ2VzKGNsb25lUmFuZ2UpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgIGlmIChfLmN1cnJlbnRTbGlkZSA+PSBfLnNsaWRlQ291bnQgLSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcbiAgICAgICAgICAgIGNsb25lUmFuZ2UgPSBfLiRzbGlkZXIuZmluZCgnLnNsaWNrLWNsb25lZCcpLnNsaWNlKDAsIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpO1xyXG4gICAgICAgICAgICBsb2FkSW1hZ2VzKGNsb25lUmFuZ2UpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoXy5jdXJyZW50U2xpZGUgPT09IDApIHtcclxuICAgICAgICAgICAgY2xvbmVSYW5nZSA9IF8uJHNsaWRlci5maW5kKCcuc2xpY2stY2xvbmVkJykuc2xpY2UoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAqIC0xKTtcclxuICAgICAgICAgICAgbG9hZEltYWdlcyhjbG9uZVJhbmdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUubG9hZFNsaWRlciA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIF8uc2V0UG9zaXRpb24oKTtcclxuXHJcbiAgICAgICAgXy4kc2xpZGVUcmFjay5jc3Moe1xyXG4gICAgICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlci5yZW1vdmVDbGFzcygnc2xpY2stbG9hZGluZycpO1xyXG5cclxuICAgICAgICBfLmluaXRVSSgpO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmxhenlMb2FkID09PSAncHJvZ3Jlc3NpdmUnKSB7XHJcbiAgICAgICAgICAgIF8ucHJvZ3Jlc3NpdmVMYXp5TG9hZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5uZXh0ID0gU2xpY2sucHJvdG90eXBlLnNsaWNrTmV4dCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIF8uY2hhbmdlU2xpZGUoe1xyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnbmV4dCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLm9yaWVudGF0aW9uQ2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgXy5jaGVja1Jlc3BvbnNpdmUoKTtcclxuICAgICAgICBfLnNldFBvc2l0aW9uKCk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUucGF1c2UgPSBTbGljay5wcm90b3R5cGUuc2xpY2tQYXVzZSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIF8uYXV0b1BsYXlDbGVhcigpO1xyXG4gICAgICAgIF8ucGF1c2VkID0gdHJ1ZTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5wbGF5ID0gU2xpY2sucHJvdG90eXBlLnNsaWNrUGxheSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIF8uYXV0b1BsYXkoKTtcclxuICAgICAgICBfLm9wdGlvbnMuYXV0b3BsYXkgPSB0cnVlO1xyXG4gICAgICAgIF8ucGF1c2VkID0gZmFsc2U7XHJcbiAgICAgICAgXy5mb2N1c3NlZCA9IGZhbHNlO1xyXG4gICAgICAgIF8uaW50ZXJydXB0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5wb3N0U2xpZGUgPSBmdW5jdGlvbihpbmRleCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmKCAhXy51bnNsaWNrZWQgKSB7XHJcblxyXG4gICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignYWZ0ZXJDaGFuZ2UnLCBbXywgaW5kZXhdKTtcclxuXHJcbiAgICAgICAgICAgIF8uYW5pbWF0aW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBfLnNldFBvc2l0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICBfLnN3aXBlTGVmdCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpZiAoIF8ub3B0aW9ucy5hdXRvcGxheSApIHtcclxuICAgICAgICAgICAgICAgIF8uYXV0b1BsYXkoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5hY2Nlc3NpYmlsaXR5ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBfLmluaXRBREEoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUucHJldiA9IFNsaWNrLnByb3RvdHlwZS5zbGlja1ByZXYgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBfLmNoYW5nZVNsaWRlKHtcclxuICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ3ByZXZpb3VzJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUucHJldmVudERlZmF1bHQgPSBmdW5jdGlvbihldmVudCkge1xyXG5cclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnByb2dyZXNzaXZlTGF6eUxvYWQgPSBmdW5jdGlvbiggdHJ5Q291bnQgKSB7XHJcblxyXG4gICAgICAgIHRyeUNvdW50ID0gdHJ5Q291bnQgfHwgMTtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLFxyXG4gICAgICAgICAgICAkaW1nc1RvTG9hZCA9ICQoICdpbWdbZGF0YS1sYXp5XScsIF8uJHNsaWRlciApLFxyXG4gICAgICAgICAgICBpbWFnZSxcclxuICAgICAgICAgICAgaW1hZ2VTb3VyY2UsXHJcbiAgICAgICAgICAgIGltYWdlVG9Mb2FkO1xyXG5cclxuICAgICAgICBpZiAoICRpbWdzVG9Mb2FkLmxlbmd0aCApIHtcclxuXHJcbiAgICAgICAgICAgIGltYWdlID0gJGltZ3NUb0xvYWQuZmlyc3QoKTtcclxuICAgICAgICAgICAgaW1hZ2VTb3VyY2UgPSBpbWFnZS5hdHRyKCdkYXRhLWxhenknKTtcclxuICAgICAgICAgICAgaW1hZ2VUb0xvYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuXHJcbiAgICAgICAgICAgIGltYWdlVG9Mb2FkLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGltYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoICdzcmMnLCBpbWFnZVNvdXJjZSApXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUF0dHIoJ2RhdGEtbGF6eScpXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdzbGljay1sb2FkaW5nJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCBfLm9wdGlvbnMuYWRhcHRpdmVIZWlnaHQgPT09IHRydWUgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5zZXRQb3NpdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdsYXp5TG9hZGVkJywgWyBfLCBpbWFnZSwgaW1hZ2VTb3VyY2UgXSk7XHJcbiAgICAgICAgICAgICAgICBfLnByb2dyZXNzaXZlTGF6eUxvYWQoKTtcclxuXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpbWFnZVRvTG9hZC5vbmVycm9yID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCB0cnlDb3VudCA8IDMgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIHRyeSB0byBsb2FkIHRoZSBpbWFnZSAzIHRpbWVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAqIGxlYXZlIGEgc2xpZ2h0IGRlbGF5IHNvIHdlIGRvbid0IGdldFxyXG4gICAgICAgICAgICAgICAgICAgICAqIHNlcnZlcnMgYmxvY2tpbmcgdGhlIHJlcXVlc3QuXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8ucHJvZ3Jlc3NpdmVMYXp5TG9hZCggdHJ5Q291bnQgKyAxICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgNTAwICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUF0dHIoICdkYXRhLWxhenknIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCAnc2xpY2stbG9hZGluZycgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoICdzbGljay1sYXp5bG9hZC1lcnJvcicgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ2xhenlMb2FkRXJyb3InLCBbIF8sIGltYWdlLCBpbWFnZVNvdXJjZSBdKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgXy5wcm9ncmVzc2l2ZUxhenlMb2FkKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGltYWdlVG9Mb2FkLnNyYyA9IGltYWdlU291cmNlO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ2FsbEltYWdlc0xvYWRlZCcsIFsgXyBdKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnJlZnJlc2ggPSBmdW5jdGlvbiggaW5pdGlhbGl6aW5nICkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsIGN1cnJlbnRTbGlkZSwgbGFzdFZpc2libGVJbmRleDtcclxuXHJcbiAgICAgICAgbGFzdFZpc2libGVJbmRleCA9IF8uc2xpZGVDb3VudCAtIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3c7XHJcblxyXG4gICAgICAgIC8vIGluIG5vbi1pbmZpbml0ZSBzbGlkZXJzLCB3ZSBkb24ndCB3YW50IHRvIGdvIHBhc3QgdGhlXHJcbiAgICAgICAgLy8gbGFzdCB2aXNpYmxlIGluZGV4LlxyXG4gICAgICAgIGlmKCAhXy5vcHRpb25zLmluZmluaXRlICYmICggXy5jdXJyZW50U2xpZGUgPiBsYXN0VmlzaWJsZUluZGV4ICkpIHtcclxuICAgICAgICAgICAgXy5jdXJyZW50U2xpZGUgPSBsYXN0VmlzaWJsZUluZGV4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gaWYgbGVzcyBzbGlkZXMgdGhhbiB0byBzaG93LCBnbyB0byBzdGFydC5cclxuICAgICAgICBpZiAoIF8uc2xpZGVDb3VudCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICkge1xyXG4gICAgICAgICAgICBfLmN1cnJlbnRTbGlkZSA9IDA7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3VycmVudFNsaWRlID0gXy5jdXJyZW50U2xpZGU7XHJcblxyXG4gICAgICAgIF8uZGVzdHJveSh0cnVlKTtcclxuXHJcbiAgICAgICAgJC5leHRlbmQoXywgXy5pbml0aWFscywgeyBjdXJyZW50U2xpZGU6IGN1cnJlbnRTbGlkZSB9KTtcclxuXHJcbiAgICAgICAgXy5pbml0KCk7XHJcblxyXG4gICAgICAgIGlmKCAhaW5pdGlhbGl6aW5nICkge1xyXG5cclxuICAgICAgICAgICAgXy5jaGFuZ2VTbGlkZSh7XHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ2luZGV4JyxcclxuICAgICAgICAgICAgICAgICAgICBpbmRleDogY3VycmVudFNsaWRlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnJlZ2lzdGVyQnJlYWtwb2ludHMgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLCBicmVha3BvaW50LCBjdXJyZW50QnJlYWtwb2ludCwgbCxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZVNldHRpbmdzID0gXy5vcHRpb25zLnJlc3BvbnNpdmUgfHwgbnVsbDtcclxuXHJcbiAgICAgICAgaWYgKCAkLnR5cGUocmVzcG9uc2l2ZVNldHRpbmdzKSA9PT0gJ2FycmF5JyAmJiByZXNwb25zaXZlU2V0dGluZ3MubGVuZ3RoICkge1xyXG5cclxuICAgICAgICAgICAgXy5yZXNwb25kVG8gPSBfLm9wdGlvbnMucmVzcG9uZFRvIHx8ICd3aW5kb3cnO1xyXG5cclxuICAgICAgICAgICAgZm9yICggYnJlYWtwb2ludCBpbiByZXNwb25zaXZlU2V0dGluZ3MgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbCA9IF8uYnJlYWtwb2ludHMubGVuZ3RoLTE7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50QnJlYWtwb2ludCA9IHJlc3BvbnNpdmVTZXR0aW5nc1ticmVha3BvaW50XS5icmVha3BvaW50O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zaXZlU2V0dGluZ3MuaGFzT3duUHJvcGVydHkoYnJlYWtwb2ludCkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBicmVha3BvaW50cyBhbmQgY3V0IG91dCBhbnkgZXhpc3RpbmdcclxuICAgICAgICAgICAgICAgICAgICAvLyBvbmVzIHdpdGggdGhlIHNhbWUgYnJlYWtwb2ludCBudW1iZXIsIHdlIGRvbid0IHdhbnQgZHVwZXMuXHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUoIGwgPj0gMCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIF8uYnJlYWtwb2ludHNbbF0gJiYgXy5icmVha3BvaW50c1tsXSA9PT0gY3VycmVudEJyZWFrcG9pbnQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmJyZWFrcG9pbnRzLnNwbGljZShsLDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGwtLTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIF8uYnJlYWtwb2ludHMucHVzaChjdXJyZW50QnJlYWtwb2ludCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5icmVha3BvaW50U2V0dGluZ3NbY3VycmVudEJyZWFrcG9pbnRdID0gcmVzcG9uc2l2ZVNldHRpbmdzW2JyZWFrcG9pbnRdLnNldHRpbmdzO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIF8uYnJlYWtwb2ludHMuc29ydChmdW5jdGlvbihhLCBiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKCBfLm9wdGlvbnMubW9iaWxlRmlyc3QgKSA/IGEtYiA6IGItYTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5yZWluaXQgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBfLiRzbGlkZXMgPVxyXG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrXHJcbiAgICAgICAgICAgICAgICAuY2hpbGRyZW4oXy5vcHRpb25zLnNsaWRlKVxyXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1zbGlkZScpO1xyXG5cclxuICAgICAgICBfLnNsaWRlQ291bnQgPSBfLiRzbGlkZXMubGVuZ3RoO1xyXG5cclxuICAgICAgICBpZiAoXy5jdXJyZW50U2xpZGUgPj0gXy5zbGlkZUNvdW50ICYmIF8uY3VycmVudFNsaWRlICE9PSAwKSB7XHJcbiAgICAgICAgICAgIF8uY3VycmVudFNsaWRlID0gXy5jdXJyZW50U2xpZGUgLSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy5zbGlkZUNvdW50IDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcclxuICAgICAgICAgICAgXy5jdXJyZW50U2xpZGUgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy5yZWdpc3RlckJyZWFrcG9pbnRzKCk7XHJcblxyXG4gICAgICAgIF8uc2V0UHJvcHMoKTtcclxuICAgICAgICBfLnNldHVwSW5maW5pdGUoKTtcclxuICAgICAgICBfLmJ1aWxkQXJyb3dzKCk7XHJcbiAgICAgICAgXy51cGRhdGVBcnJvd3MoKTtcclxuICAgICAgICBfLmluaXRBcnJvd0V2ZW50cygpO1xyXG4gICAgICAgIF8uYnVpbGREb3RzKCk7XHJcbiAgICAgICAgXy51cGRhdGVEb3RzKCk7XHJcbiAgICAgICAgXy5pbml0RG90RXZlbnRzKCk7XHJcbiAgICAgICAgXy5jbGVhblVwU2xpZGVFdmVudHMoKTtcclxuICAgICAgICBfLmluaXRTbGlkZUV2ZW50cygpO1xyXG5cclxuICAgICAgICBfLmNoZWNrUmVzcG9uc2l2ZShmYWxzZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZm9jdXNPblNlbGVjdCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAkKF8uJHNsaWRlVHJhY2spLmNoaWxkcmVuKCkub24oJ2NsaWNrLnNsaWNrJywgXy5zZWxlY3RIYW5kbGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF8uc2V0U2xpZGVDbGFzc2VzKHR5cGVvZiBfLmN1cnJlbnRTbGlkZSA9PT0gJ251bWJlcicgPyBfLmN1cnJlbnRTbGlkZSA6IDApO1xyXG5cclxuICAgICAgICBfLnNldFBvc2l0aW9uKCk7XHJcbiAgICAgICAgXy5mb2N1c0hhbmRsZXIoKTtcclxuXHJcbiAgICAgICAgXy5wYXVzZWQgPSAhXy5vcHRpb25zLmF1dG9wbGF5O1xyXG4gICAgICAgIF8uYXV0b1BsYXkoKTtcclxuXHJcbiAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ3JlSW5pdCcsIFtfXSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpICE9PSBfLndpbmRvd1dpZHRoKSB7XHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChfLndpbmRvd0RlbGF5KTtcclxuICAgICAgICAgICAgXy53aW5kb3dEZWxheSA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgXy53aW5kb3dXaWR0aCA9ICQod2luZG93KS53aWR0aCgpO1xyXG4gICAgICAgICAgICAgICAgXy5jaGVja1Jlc3BvbnNpdmUoKTtcclxuICAgICAgICAgICAgICAgIGlmKCAhXy51bnNsaWNrZWQgKSB7IF8uc2V0UG9zaXRpb24oKTsgfVxyXG4gICAgICAgICAgICB9LCA1MCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUucmVtb3ZlU2xpZGUgPSBTbGljay5wcm90b3R5cGUuc2xpY2tSZW1vdmUgPSBmdW5jdGlvbihpbmRleCwgcmVtb3ZlQmVmb3JlLCByZW1vdmVBbGwpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mKGluZGV4KSA9PT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICAgICAgICAgIHJlbW92ZUJlZm9yZSA9IGluZGV4O1xyXG4gICAgICAgICAgICBpbmRleCA9IHJlbW92ZUJlZm9yZSA9PT0gdHJ1ZSA/IDAgOiBfLnNsaWRlQ291bnQgLSAxO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGluZGV4ID0gcmVtb3ZlQmVmb3JlID09PSB0cnVlID8gLS1pbmRleCA6IGluZGV4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8uc2xpZGVDb3VudCA8IDEgfHwgaW5kZXggPCAwIHx8IGluZGV4ID4gXy5zbGlkZUNvdW50IC0gMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfLnVubG9hZCgpO1xyXG5cclxuICAgICAgICBpZiAocmVtb3ZlQWxsID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY2hpbGRyZW4oKS5yZW1vdmUoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZXEoaW5kZXgpLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy4kc2xpZGVzID0gXy4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpO1xyXG5cclxuICAgICAgICBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZGV0YWNoKCk7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlVHJhY2suYXBwZW5kKF8uJHNsaWRlcyk7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlc0NhY2hlID0gXy4kc2xpZGVzO1xyXG5cclxuICAgICAgICBfLnJlaW5pdCgpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnNldENTUyA9IGZ1bmN0aW9uKHBvc2l0aW9uKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgcG9zaXRpb25Qcm9wcyA9IHt9LFxyXG4gICAgICAgICAgICB4LCB5O1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLnJ0bCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBwb3NpdGlvbiA9IC1wb3NpdGlvbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgeCA9IF8ucG9zaXRpb25Qcm9wID09ICdsZWZ0JyA/IE1hdGguY2VpbChwb3NpdGlvbikgKyAncHgnIDogJzBweCc7XHJcbiAgICAgICAgeSA9IF8ucG9zaXRpb25Qcm9wID09ICd0b3AnID8gTWF0aC5jZWlsKHBvc2l0aW9uKSArICdweCcgOiAnMHB4JztcclxuXHJcbiAgICAgICAgcG9zaXRpb25Qcm9wc1tfLnBvc2l0aW9uUHJvcF0gPSBwb3NpdGlvbjtcclxuXHJcbiAgICAgICAgaWYgKF8udHJhbnNmb3Jtc0VuYWJsZWQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY3NzKHBvc2l0aW9uUHJvcHMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uUHJvcHMgPSB7fTtcclxuICAgICAgICAgICAgaWYgKF8uY3NzVHJhbnNpdGlvbnMgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvblByb3BzW18uYW5pbVR5cGVdID0gJ3RyYW5zbGF0ZSgnICsgeCArICcsICcgKyB5ICsgJyknO1xyXG4gICAgICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jc3MocG9zaXRpb25Qcm9wcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvblByb3BzW18uYW5pbVR5cGVdID0gJ3RyYW5zbGF0ZTNkKCcgKyB4ICsgJywgJyArIHkgKyAnLCAwcHgpJztcclxuICAgICAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY3NzKHBvc2l0aW9uUHJvcHMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnNldERpbWVuc2lvbnMgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIF8uJGxpc3QuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAoJzBweCAnICsgXy5vcHRpb25zLmNlbnRlclBhZGRpbmcpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIF8uJGxpc3QuaGVpZ2h0KF8uJHNsaWRlcy5maXJzdCgpLm91dGVySGVpZ2h0KHRydWUpICogXy5vcHRpb25zLnNsaWRlc1RvU2hvdyk7XHJcbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgXy4kbGlzdC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IChfLm9wdGlvbnMuY2VudGVyUGFkZGluZyArICcgMHB4JylcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfLmxpc3RXaWR0aCA9IF8uJGxpc3Qud2lkdGgoKTtcclxuICAgICAgICBfLmxpc3RIZWlnaHQgPSBfLiRsaXN0LmhlaWdodCgpO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gZmFsc2UgJiYgXy5vcHRpb25zLnZhcmlhYmxlV2lkdGggPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIF8uc2xpZGVXaWR0aCA9IE1hdGguY2VpbChfLmxpc3RXaWR0aCAvIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpO1xyXG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLndpZHRoKE1hdGguY2VpbCgoXy5zbGlkZVdpZHRoICogXy4kc2xpZGVUcmFjay5jaGlsZHJlbignLnNsaWNrLXNsaWRlJykubGVuZ3RoKSkpO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKF8ub3B0aW9ucy52YXJpYWJsZVdpZHRoID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2sud2lkdGgoNTAwMCAqIF8uc2xpZGVDb3VudCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgXy5zbGlkZVdpZHRoID0gTWF0aC5jZWlsKF8ubGlzdFdpZHRoKTtcclxuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5oZWlnaHQoTWF0aC5jZWlsKChfLiRzbGlkZXMuZmlyc3QoKS5vdXRlckhlaWdodCh0cnVlKSAqIF8uJHNsaWRlVHJhY2suY2hpbGRyZW4oJy5zbGljay1zbGlkZScpLmxlbmd0aCkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBvZmZzZXQgPSBfLiRzbGlkZXMuZmlyc3QoKS5vdXRlcldpZHRoKHRydWUpIC0gXy4kc2xpZGVzLmZpcnN0KCkud2lkdGgoKTtcclxuICAgICAgICBpZiAoXy5vcHRpb25zLnZhcmlhYmxlV2lkdGggPT09IGZhbHNlKSBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKCcuc2xpY2stc2xpZGUnKS53aWR0aChfLnNsaWRlV2lkdGggLSBvZmZzZXQpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnNldEZhZGUgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLFxyXG4gICAgICAgICAgICB0YXJnZXRMZWZ0O1xyXG5cclxuICAgICAgICBfLiRzbGlkZXMuZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbWVudCkge1xyXG4gICAgICAgICAgICB0YXJnZXRMZWZ0ID0gKF8uc2xpZGVXaWR0aCAqIGluZGV4KSAqIC0xO1xyXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLnJ0bCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgJChlbGVtZW50KS5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxyXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0OiB0YXJnZXRMZWZ0LFxyXG4gICAgICAgICAgICAgICAgICAgIHRvcDogMCxcclxuICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IF8ub3B0aW9ucy56SW5kZXggLSAyLFxyXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJChlbGVtZW50KS5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IHRhcmdldExlZnQsXHJcbiAgICAgICAgICAgICAgICAgICAgdG9wOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIHpJbmRleDogXy5vcHRpb25zLnpJbmRleCAtIDIsXHJcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgXy4kc2xpZGVzLmVxKF8uY3VycmVudFNsaWRlKS5jc3Moe1xyXG4gICAgICAgICAgICB6SW5kZXg6IF8ub3B0aW9ucy56SW5kZXggLSAxLFxyXG4gICAgICAgICAgICBvcGFjaXR5OiAxXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuc2V0SGVpZ2h0ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgPT09IDEgJiYgXy5vcHRpb25zLmFkYXB0aXZlSGVpZ2h0ID09PSB0cnVlICYmIF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdmFyIHRhcmdldEhlaWdodCA9IF8uJHNsaWRlcy5lcShfLmN1cnJlbnRTbGlkZSkub3V0ZXJIZWlnaHQodHJ1ZSk7XHJcbiAgICAgICAgICAgIF8uJGxpc3QuY3NzKCdoZWlnaHQnLCB0YXJnZXRIZWlnaHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5zZXRPcHRpb24gPVxyXG4gICAgU2xpY2sucHJvdG90eXBlLnNsaWNrU2V0T3B0aW9uID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGFjY2VwdHMgYXJndW1lbnRzIGluIGZvcm1hdCBvZjpcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqICAtIGZvciBjaGFuZ2luZyBhIHNpbmdsZSBvcHRpb24ncyB2YWx1ZTpcclxuICAgICAgICAgKiAgICAgLnNsaWNrKFwic2V0T3B0aW9uXCIsIG9wdGlvbiwgdmFsdWUsIHJlZnJlc2ggKVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogIC0gZm9yIGNoYW5naW5nIGEgc2V0IG9mIHJlc3BvbnNpdmUgb3B0aW9uczpcclxuICAgICAgICAgKiAgICAgLnNsaWNrKFwic2V0T3B0aW9uXCIsICdyZXNwb25zaXZlJywgW3t9LCAuLi5dLCByZWZyZXNoIClcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqICAtIGZvciB1cGRhdGluZyBtdWx0aXBsZSB2YWx1ZXMgYXQgb25jZSAobm90IHJlc3BvbnNpdmUpXHJcbiAgICAgICAgICogICAgIC5zbGljayhcInNldE9wdGlvblwiLCB7ICdvcHRpb24nOiB2YWx1ZSwgLi4uIH0sIHJlZnJlc2ggKVxyXG4gICAgICAgICAqL1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsIGwsIGl0ZW0sIG9wdGlvbiwgdmFsdWUsIHJlZnJlc2ggPSBmYWxzZSwgdHlwZTtcclxuXHJcbiAgICAgICAgaWYoICQudHlwZSggYXJndW1lbnRzWzBdICkgPT09ICdvYmplY3QnICkge1xyXG5cclxuICAgICAgICAgICAgb3B0aW9uID0gIGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgcmVmcmVzaCA9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgdHlwZSA9ICdtdWx0aXBsZSc7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAoICQudHlwZSggYXJndW1lbnRzWzBdICkgPT09ICdzdHJpbmcnICkge1xyXG5cclxuICAgICAgICAgICAgb3B0aW9uID0gIGFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgdmFsdWUgPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgICAgIHJlZnJlc2ggPSBhcmd1bWVudHNbMl07XHJcblxyXG4gICAgICAgICAgICBpZiAoIGFyZ3VtZW50c1swXSA9PT0gJ3Jlc3BvbnNpdmUnICYmICQudHlwZSggYXJndW1lbnRzWzFdICkgPT09ICdhcnJheScgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdHlwZSA9ICdyZXNwb25zaXZlJztcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHR5cGVvZiBhcmd1bWVudHNbMV0gIT09ICd1bmRlZmluZWQnICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHR5cGUgPSAnc2luZ2xlJztcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIHR5cGUgPT09ICdzaW5nbGUnICkge1xyXG5cclxuICAgICAgICAgICAgXy5vcHRpb25zW29wdGlvbl0gPSB2YWx1ZTtcclxuXHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdtdWx0aXBsZScgKSB7XHJcblxyXG4gICAgICAgICAgICAkLmVhY2goIG9wdGlvbiAsIGZ1bmN0aW9uKCBvcHQsIHZhbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBfLm9wdGlvbnNbb3B0XSA9IHZhbDtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ3Jlc3BvbnNpdmUnICkge1xyXG5cclxuICAgICAgICAgICAgZm9yICggaXRlbSBpbiB2YWx1ZSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiggJC50eXBlKCBfLm9wdGlvbnMucmVzcG9uc2l2ZSApICE9PSAnYXJyYXknICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBfLm9wdGlvbnMucmVzcG9uc2l2ZSA9IFsgdmFsdWVbaXRlbV0gXTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsID0gXy5vcHRpb25zLnJlc3BvbnNpdmUubGVuZ3RoLTE7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgcmVzcG9uc2l2ZSBvYmplY3QgYW5kIHNwbGljZSBvdXQgZHVwbGljYXRlcy5cclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSggbCA+PSAwICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIF8ub3B0aW9ucy5yZXNwb25zaXZlW2xdLmJyZWFrcG9pbnQgPT09IHZhbHVlW2l0ZW1dLmJyZWFrcG9pbnQgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5vcHRpb25zLnJlc3BvbnNpdmUuc3BsaWNlKGwsMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsLS07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgXy5vcHRpb25zLnJlc3BvbnNpdmUucHVzaCggdmFsdWVbaXRlbV0gKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCByZWZyZXNoICkge1xyXG5cclxuICAgICAgICAgICAgXy51bmxvYWQoKTtcclxuICAgICAgICAgICAgXy5yZWluaXQoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnNldFBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgXy5zZXREaW1lbnNpb25zKCk7XHJcblxyXG4gICAgICAgIF8uc2V0SGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZmFkZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgXy5zZXRDU1MoXy5nZXRMZWZ0KF8uY3VycmVudFNsaWRlKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgXy5zZXRGYWRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignc2V0UG9zaXRpb24nLCBbX10pO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnNldFByb3BzID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgYm9keVN0eWxlID0gZG9jdW1lbnQuYm9keS5zdHlsZTtcclxuXHJcbiAgICAgICAgXy5wb3NpdGlvblByb3AgPSBfLm9wdGlvbnMudmVydGljYWwgPT09IHRydWUgPyAndG9wJyA6ICdsZWZ0JztcclxuXHJcbiAgICAgICAgaWYgKF8ucG9zaXRpb25Qcm9wID09PSAndG9wJykge1xyXG4gICAgICAgICAgICBfLiRzbGlkZXIuYWRkQ2xhc3MoJ3NsaWNrLXZlcnRpY2FsJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgXy4kc2xpZGVyLnJlbW92ZUNsYXNzKCdzbGljay12ZXJ0aWNhbCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGJvZHlTdHlsZS5XZWJraXRUcmFuc2l0aW9uICE9PSB1bmRlZmluZWQgfHxcclxuICAgICAgICAgICAgYm9keVN0eWxlLk1velRyYW5zaXRpb24gIT09IHVuZGVmaW5lZCB8fFxyXG4gICAgICAgICAgICBib2R5U3R5bGUubXNUcmFuc2l0aW9uICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy51c2VDU1MgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIF8uY3NzVHJhbnNpdGlvbnMgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIF8ub3B0aW9ucy5mYWRlICkge1xyXG4gICAgICAgICAgICBpZiAoIHR5cGVvZiBfLm9wdGlvbnMuekluZGV4ID09PSAnbnVtYmVyJyApIHtcclxuICAgICAgICAgICAgICAgIGlmKCBfLm9wdGlvbnMuekluZGV4IDwgMyApIHtcclxuICAgICAgICAgICAgICAgICAgICBfLm9wdGlvbnMuekluZGV4ID0gMztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIF8ub3B0aW9ucy56SW5kZXggPSBfLmRlZmF1bHRzLnpJbmRleDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGJvZHlTdHlsZS5PVHJhbnNmb3JtICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgXy5hbmltVHlwZSA9ICdPVHJhbnNmb3JtJztcclxuICAgICAgICAgICAgXy50cmFuc2Zvcm1UeXBlID0gJy1vLXRyYW5zZm9ybSc7XHJcbiAgICAgICAgICAgIF8udHJhbnNpdGlvblR5cGUgPSAnT1RyYW5zaXRpb24nO1xyXG4gICAgICAgICAgICBpZiAoYm9keVN0eWxlLnBlcnNwZWN0aXZlUHJvcGVydHkgPT09IHVuZGVmaW5lZCAmJiBib2R5U3R5bGUud2Via2l0UGVyc3BlY3RpdmUgPT09IHVuZGVmaW5lZCkgXy5hbmltVHlwZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYm9keVN0eWxlLk1velRyYW5zZm9ybSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIF8uYW5pbVR5cGUgPSAnTW96VHJhbnNmb3JtJztcclxuICAgICAgICAgICAgXy50cmFuc2Zvcm1UeXBlID0gJy1tb3otdHJhbnNmb3JtJztcclxuICAgICAgICAgICAgXy50cmFuc2l0aW9uVHlwZSA9ICdNb3pUcmFuc2l0aW9uJztcclxuICAgICAgICAgICAgaWYgKGJvZHlTdHlsZS5wZXJzcGVjdGl2ZVByb3BlcnR5ID09PSB1bmRlZmluZWQgJiYgYm9keVN0eWxlLk1velBlcnNwZWN0aXZlID09PSB1bmRlZmluZWQpIF8uYW5pbVR5cGUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGJvZHlTdHlsZS53ZWJraXRUcmFuc2Zvcm0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBfLmFuaW1UeXBlID0gJ3dlYmtpdFRyYW5zZm9ybSc7XHJcbiAgICAgICAgICAgIF8udHJhbnNmb3JtVHlwZSA9ICctd2Via2l0LXRyYW5zZm9ybSc7XHJcbiAgICAgICAgICAgIF8udHJhbnNpdGlvblR5cGUgPSAnd2Via2l0VHJhbnNpdGlvbic7XHJcbiAgICAgICAgICAgIGlmIChib2R5U3R5bGUucGVyc3BlY3RpdmVQcm9wZXJ0eSA9PT0gdW5kZWZpbmVkICYmIGJvZHlTdHlsZS53ZWJraXRQZXJzcGVjdGl2ZSA9PT0gdW5kZWZpbmVkKSBfLmFuaW1UeXBlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChib2R5U3R5bGUubXNUcmFuc2Zvcm0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBfLmFuaW1UeXBlID0gJ21zVHJhbnNmb3JtJztcclxuICAgICAgICAgICAgXy50cmFuc2Zvcm1UeXBlID0gJy1tcy10cmFuc2Zvcm0nO1xyXG4gICAgICAgICAgICBfLnRyYW5zaXRpb25UeXBlID0gJ21zVHJhbnNpdGlvbic7XHJcbiAgICAgICAgICAgIGlmIChib2R5U3R5bGUubXNUcmFuc2Zvcm0gPT09IHVuZGVmaW5lZCkgXy5hbmltVHlwZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYm9keVN0eWxlLnRyYW5zZm9ybSAhPT0gdW5kZWZpbmVkICYmIF8uYW5pbVR5cGUgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIF8uYW5pbVR5cGUgPSAndHJhbnNmb3JtJztcclxuICAgICAgICAgICAgXy50cmFuc2Zvcm1UeXBlID0gJ3RyYW5zZm9ybSc7XHJcbiAgICAgICAgICAgIF8udHJhbnNpdGlvblR5cGUgPSAndHJhbnNpdGlvbic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIF8udHJhbnNmb3Jtc0VuYWJsZWQgPSBfLm9wdGlvbnMudXNlVHJhbnNmb3JtICYmIChfLmFuaW1UeXBlICE9PSBudWxsICYmIF8uYW5pbVR5cGUgIT09IGZhbHNlKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5zZXRTbGlkZUNsYXNzZXMgPSBmdW5jdGlvbihpbmRleCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgIGNlbnRlck9mZnNldCwgYWxsU2xpZGVzLCBpbmRleE9mZnNldCwgcmVtYWluZGVyO1xyXG5cclxuICAgICAgICBhbGxTbGlkZXMgPSBfLiRzbGlkZXJcclxuICAgICAgICAgICAgLmZpbmQoJy5zbGljay1zbGlkZScpXHJcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnc2xpY2stYWN0aXZlIHNsaWNrLWNlbnRlciBzbGljay1jdXJyZW50JylcclxuICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuXHJcbiAgICAgICAgXy4kc2xpZGVzXHJcbiAgICAgICAgICAgIC5lcShpbmRleClcclxuICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1jdXJyZW50Jyk7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgY2VudGVyT2Zmc2V0ID0gTWF0aC5mbG9vcihfLm9wdGlvbnMuc2xpZGVzVG9TaG93IC8gMik7XHJcblxyXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmluZmluaXRlID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID49IGNlbnRlck9mZnNldCAmJiBpbmRleCA8PSAoXy5zbGlkZUNvdW50IC0gMSkgLSBjZW50ZXJPZmZzZXQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgXy4kc2xpZGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zbGljZShpbmRleCAtIGNlbnRlck9mZnNldCwgaW5kZXggKyBjZW50ZXJPZmZzZXQgKyAxKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWFjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4T2Zmc2V0ID0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyArIGluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIGFsbFNsaWRlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2xpY2UoaW5kZXhPZmZzZXQgLSBjZW50ZXJPZmZzZXQgKyAxLCBpbmRleE9mZnNldCArIGNlbnRlck9mZnNldCArIDIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stYWN0aXZlJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBhbGxTbGlkZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmVxKGFsbFNsaWRlcy5sZW5ndGggLSAxIC0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1jZW50ZXInKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGluZGV4ID09PSBfLnNsaWRlQ291bnQgLSAxKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGFsbFNsaWRlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZXEoXy5vcHRpb25zLnNsaWRlc1RvU2hvdylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1jZW50ZXInKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBfLiRzbGlkZXNcclxuICAgICAgICAgICAgICAgIC5lcShpbmRleClcclxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stY2VudGVyJyk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoaW5kZXggPj0gMCAmJiBpbmRleCA8PSAoXy5zbGlkZUNvdW50IC0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBfLiRzbGlkZXNcclxuICAgICAgICAgICAgICAgICAgICAuc2xpY2UoaW5kZXgsIGluZGV4ICsgXy5vcHRpb25zLnNsaWRlc1RvU2hvdylcclxuICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWFjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFsbFNsaWRlcy5sZW5ndGggPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG5cclxuICAgICAgICAgICAgICAgIGFsbFNsaWRlc1xyXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stYWN0aXZlJylcclxuICAgICAgICAgICAgICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVtYWluZGVyID0gXy5zbGlkZUNvdW50ICUgXy5vcHRpb25zLnNsaWRlc1RvU2hvdztcclxuICAgICAgICAgICAgICAgIGluZGV4T2Zmc2V0ID0gXy5vcHRpb25zLmluZmluaXRlID09PSB0cnVlID8gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyArIGluZGV4IDogaW5kZXg7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgPT0gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsICYmIChfLnNsaWRlQ291bnQgLSBpbmRleCkgPCBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGFsbFNsaWRlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2xpY2UoaW5kZXhPZmZzZXQgLSAoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAtIHJlbWFpbmRlciksIGluZGV4T2Zmc2V0ICsgcmVtYWluZGVyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWFjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGFsbFNsaWRlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2xpY2UoaW5kZXhPZmZzZXQsIGluZGV4T2Zmc2V0ICsgXy5vcHRpb25zLnNsaWRlc1RvU2hvdylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1hY3RpdmUnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5sYXp5TG9hZCA9PT0gJ29uZGVtYW5kJykge1xyXG4gICAgICAgICAgICBfLmxhenlMb2FkKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnNldHVwSW5maW5pdGUgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLFxyXG4gICAgICAgICAgICBpLCBzbGlkZUluZGV4LCBpbmZpbml0ZUNvdW50O1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgXy5vcHRpb25zLmNlbnRlck1vZGUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuaW5maW5pdGUgPT09IHRydWUgJiYgXy5vcHRpb25zLmZhZGUgPT09IGZhbHNlKSB7XHJcblxyXG4gICAgICAgICAgICBzbGlkZUluZGV4ID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5maW5pdGVDb3VudCA9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgKyAxO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmZpbml0ZUNvdW50ID0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSBfLnNsaWRlQ291bnQ7IGkgPiAoXy5zbGlkZUNvdW50IC1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5maW5pdGVDb3VudCk7IGkgLT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlSW5kZXggPSBpIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICAkKF8uJHNsaWRlc1tzbGlkZUluZGV4XSkuY2xvbmUodHJ1ZSkuYXR0cignaWQnLCAnJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2RhdGEtc2xpY2staW5kZXgnLCBzbGlkZUluZGV4IC0gXy5zbGlkZUNvdW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAucHJlcGVuZFRvKF8uJHNsaWRlVHJhY2spLmFkZENsYXNzKCdzbGljay1jbG9uZWQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBpbmZpbml0ZUNvdW50OyBpICs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZUluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgICAkKF8uJHNsaWRlc1tzbGlkZUluZGV4XSkuY2xvbmUodHJ1ZSkuYXR0cignaWQnLCAnJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2RhdGEtc2xpY2staW5kZXgnLCBzbGlkZUluZGV4ICsgXy5zbGlkZUNvdW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8oXy4kc2xpZGVUcmFjaykuYWRkQ2xhc3MoJ3NsaWNrLWNsb25lZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5maW5kKCcuc2xpY2stY2xvbmVkJykuZmluZCgnW2lkXScpLmVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdpZCcsICcnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuaW50ZXJydXB0ID0gZnVuY3Rpb24oIHRvZ2dsZSApIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiggIXRvZ2dsZSApIHtcclxuICAgICAgICAgICAgXy5hdXRvUGxheSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBfLmludGVycnVwdGVkID0gdG9nZ2xlO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnNlbGVjdEhhbmRsZXIgPSBmdW5jdGlvbihldmVudCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciB0YXJnZXRFbGVtZW50ID1cclxuICAgICAgICAgICAgJChldmVudC50YXJnZXQpLmlzKCcuc2xpY2stc2xpZGUnKSA/XHJcbiAgICAgICAgICAgICAgICAkKGV2ZW50LnRhcmdldCkgOlxyXG4gICAgICAgICAgICAgICAgJChldmVudC50YXJnZXQpLnBhcmVudHMoJy5zbGljay1zbGlkZScpO1xyXG5cclxuICAgICAgICB2YXIgaW5kZXggPSBwYXJzZUludCh0YXJnZXRFbGVtZW50LmF0dHIoJ2RhdGEtc2xpY2staW5kZXgnKSk7XHJcblxyXG4gICAgICAgIGlmICghaW5kZXgpIGluZGV4ID0gMDtcclxuXHJcbiAgICAgICAgaWYgKF8uc2xpZGVDb3VudCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcblxyXG4gICAgICAgICAgICBfLnNldFNsaWRlQ2xhc3NlcyhpbmRleCk7XHJcbiAgICAgICAgICAgIF8uYXNOYXZGb3IoaW5kZXgpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy5zbGlkZUhhbmRsZXIoaW5kZXgpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnNsaWRlSGFuZGxlciA9IGZ1bmN0aW9uKGluZGV4LCBzeW5jLCBkb250QW5pbWF0ZSkge1xyXG5cclxuICAgICAgICB2YXIgdGFyZ2V0U2xpZGUsIGFuaW1TbGlkZSwgb2xkU2xpZGUsIHNsaWRlTGVmdCwgdGFyZ2V0TGVmdCA9IG51bGwsXHJcbiAgICAgICAgICAgIF8gPSB0aGlzLCBuYXZUYXJnZXQ7XHJcblxyXG4gICAgICAgIHN5bmMgPSBzeW5jIHx8IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAoXy5hbmltYXRpbmcgPT09IHRydWUgJiYgXy5vcHRpb25zLndhaXRGb3JBbmltYXRlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZmFkZSA9PT0gdHJ1ZSAmJiBfLmN1cnJlbnRTbGlkZSA9PT0gaW5kZXgpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8uc2xpZGVDb3VudCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzeW5jID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBfLmFzTmF2Rm9yKGluZGV4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRhcmdldFNsaWRlID0gaW5kZXg7XHJcbiAgICAgICAgdGFyZ2V0TGVmdCA9IF8uZ2V0TGVmdCh0YXJnZXRTbGlkZSk7XHJcbiAgICAgICAgc2xpZGVMZWZ0ID0gXy5nZXRMZWZ0KF8uY3VycmVudFNsaWRlKTtcclxuXHJcbiAgICAgICAgXy5jdXJyZW50TGVmdCA9IF8uc3dpcGVMZWZ0ID09PSBudWxsID8gc2xpZGVMZWZ0IDogXy5zd2lwZUxlZnQ7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuaW5maW5pdGUgPT09IGZhbHNlICYmIF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSBmYWxzZSAmJiAoaW5kZXggPCAwIHx8IGluZGV4ID4gXy5nZXREb3RDb3VudCgpICogXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKSkge1xyXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRTbGlkZSA9IF8uY3VycmVudFNsaWRlO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRvbnRBbmltYXRlICE9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5hbmltYXRlU2xpZGUoc2xpZGVMZWZ0LCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXy5wb3N0U2xpZGUodGFyZ2V0U2xpZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBfLnBvc3RTbGlkZSh0YXJnZXRTbGlkZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoXy5vcHRpb25zLmluZmluaXRlID09PSBmYWxzZSAmJiBfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSAmJiAoaW5kZXggPCAwIHx8IGluZGV4ID4gKF8uc2xpZGVDb3VudCAtIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCkpKSB7XHJcbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuZmFkZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldFNsaWRlID0gXy5jdXJyZW50U2xpZGU7XHJcbiAgICAgICAgICAgICAgICBpZiAoZG9udEFuaW1hdGUgIT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBfLmFuaW1hdGVTbGlkZShzbGlkZUxlZnQsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfLnBvc3RTbGlkZSh0YXJnZXRTbGlkZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIF8ucG9zdFNsaWRlKHRhcmdldFNsaWRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIF8ub3B0aW9ucy5hdXRvcGxheSApIHtcclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChfLmF1dG9QbGF5VGltZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRhcmdldFNsaWRlIDwgMCkge1xyXG4gICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50ICUgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBhbmltU2xpZGUgPSBfLnNsaWRlQ291bnQgLSAoXy5zbGlkZUNvdW50ICUgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFuaW1TbGlkZSA9IF8uc2xpZGVDb3VudCArIHRhcmdldFNsaWRlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh0YXJnZXRTbGlkZSA+PSBfLnNsaWRlQ291bnQpIHtcclxuICAgICAgICAgICAgaWYgKF8uc2xpZGVDb3VudCAlIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgYW5pbVNsaWRlID0gMDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFuaW1TbGlkZSA9IHRhcmdldFNsaWRlIC0gXy5zbGlkZUNvdW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYW5pbVNsaWRlID0gdGFyZ2V0U2xpZGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfLmFuaW1hdGluZyA9IHRydWU7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdiZWZvcmVDaGFuZ2UnLCBbXywgXy5jdXJyZW50U2xpZGUsIGFuaW1TbGlkZV0pO1xyXG5cclxuICAgICAgICBvbGRTbGlkZSA9IF8uY3VycmVudFNsaWRlO1xyXG4gICAgICAgIF8uY3VycmVudFNsaWRlID0gYW5pbVNsaWRlO1xyXG5cclxuICAgICAgICBfLnNldFNsaWRlQ2xhc3NlcyhfLmN1cnJlbnRTbGlkZSk7XHJcblxyXG4gICAgICAgIGlmICggXy5vcHRpb25zLmFzTmF2Rm9yICkge1xyXG5cclxuICAgICAgICAgICAgbmF2VGFyZ2V0ID0gXy5nZXROYXZUYXJnZXQoKTtcclxuICAgICAgICAgICAgbmF2VGFyZ2V0ID0gbmF2VGFyZ2V0LnNsaWNrKCdnZXRTbGljaycpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBuYXZUYXJnZXQuc2xpZGVDb3VudCA8PSBuYXZUYXJnZXQub3B0aW9ucy5zbGlkZXNUb1Nob3cgKSB7XHJcbiAgICAgICAgICAgICAgICBuYXZUYXJnZXQuc2V0U2xpZGVDbGFzc2VzKF8uY3VycmVudFNsaWRlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF8udXBkYXRlRG90cygpO1xyXG4gICAgICAgIF8udXBkYXRlQXJyb3dzKCk7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZmFkZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBpZiAoZG9udEFuaW1hdGUgIT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBfLmZhZGVTbGlkZU91dChvbGRTbGlkZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgXy5mYWRlU2xpZGUoYW5pbVNsaWRlLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBfLnBvc3RTbGlkZShhbmltU2xpZGUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgXy5wb3N0U2xpZGUoYW5pbVNsaWRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBfLmFuaW1hdGVIZWlnaHQoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRvbnRBbmltYXRlICE9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIF8uYW5pbWF0ZVNsaWRlKHRhcmdldExlZnQsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgXy5wb3N0U2xpZGUoYW5pbVNsaWRlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgXy5wb3N0U2xpZGUoYW5pbVNsaWRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuc3RhcnRMb2FkID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5hcnJvd3MgPT09IHRydWUgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG5cclxuICAgICAgICAgICAgXy4kcHJldkFycm93LmhpZGUoKTtcclxuICAgICAgICAgICAgXy4kbmV4dEFycm93LmhpZGUoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmRvdHMgPT09IHRydWUgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG5cclxuICAgICAgICAgICAgXy4kZG90cy5oaWRlKCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy4kc2xpZGVyLmFkZENsYXNzKCdzbGljay1sb2FkaW5nJyk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuc3dpcGVEaXJlY3Rpb24gPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIHhEaXN0LCB5RGlzdCwgciwgc3dpcGVBbmdsZSwgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIHhEaXN0ID0gXy50b3VjaE9iamVjdC5zdGFydFggLSBfLnRvdWNoT2JqZWN0LmN1clg7XHJcbiAgICAgICAgeURpc3QgPSBfLnRvdWNoT2JqZWN0LnN0YXJ0WSAtIF8udG91Y2hPYmplY3QuY3VyWTtcclxuICAgICAgICByID0gTWF0aC5hdGFuMih5RGlzdCwgeERpc3QpO1xyXG5cclxuICAgICAgICBzd2lwZUFuZ2xlID0gTWF0aC5yb3VuZChyICogMTgwIC8gTWF0aC5QSSk7XHJcbiAgICAgICAgaWYgKHN3aXBlQW5nbGUgPCAwKSB7XHJcbiAgICAgICAgICAgIHN3aXBlQW5nbGUgPSAzNjAgLSBNYXRoLmFicyhzd2lwZUFuZ2xlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgoc3dpcGVBbmdsZSA8PSA0NSkgJiYgKHN3aXBlQW5nbGUgPj0gMCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChfLm9wdGlvbnMucnRsID09PSBmYWxzZSA/ICdsZWZ0JyA6ICdyaWdodCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoKHN3aXBlQW5nbGUgPD0gMzYwKSAmJiAoc3dpcGVBbmdsZSA+PSAzMTUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoXy5vcHRpb25zLnJ0bCA9PT0gZmFsc2UgPyAnbGVmdCcgOiAncmlnaHQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKChzd2lwZUFuZ2xlID49IDEzNSkgJiYgKHN3aXBlQW5nbGUgPD0gMjI1KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gKF8ub3B0aW9ucy5ydGwgPT09IGZhbHNlID8gJ3JpZ2h0JyA6ICdsZWZ0Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWxTd2lwaW5nID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGlmICgoc3dpcGVBbmdsZSA+PSAzNSkgJiYgKHN3aXBlQW5nbGUgPD0gMTM1KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICdkb3duJztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAndXAnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gJ3ZlcnRpY2FsJztcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5zd2lwZUVuZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgc2xpZGVDb3VudCxcclxuICAgICAgICAgICAgZGlyZWN0aW9uO1xyXG5cclxuICAgICAgICBfLmRyYWdnaW5nID0gZmFsc2U7XHJcbiAgICAgICAgXy5pbnRlcnJ1cHRlZCA9IGZhbHNlO1xyXG4gICAgICAgIF8uc2hvdWxkQ2xpY2sgPSAoIF8udG91Y2hPYmplY3Quc3dpcGVMZW5ndGggPiAxMCApID8gZmFsc2UgOiB0cnVlO1xyXG5cclxuICAgICAgICBpZiAoIF8udG91Y2hPYmplY3QuY3VyWCA9PT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIF8udG91Y2hPYmplY3QuZWRnZUhpdCA9PT0gdHJ1ZSApIHtcclxuICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ2VkZ2UnLCBbXywgXy5zd2lwZURpcmVjdGlvbigpIF0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCBfLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoID49IF8udG91Y2hPYmplY3QubWluU3dpcGUgKSB7XHJcblxyXG4gICAgICAgICAgICBkaXJlY3Rpb24gPSBfLnN3aXBlRGlyZWN0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKCBkaXJlY3Rpb24gKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAnbGVmdCc6XHJcbiAgICAgICAgICAgICAgICBjYXNlICdkb3duJzpcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVDb3VudCA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8ub3B0aW9ucy5zd2lwZVRvU2xpZGUgP1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5jaGVja05hdmlnYWJsZSggXy5jdXJyZW50U2xpZGUgKyBfLmdldFNsaWRlQ291bnQoKSApIDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uY3VycmVudFNsaWRlICsgXy5nZXRTbGlkZUNvdW50KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIF8uY3VycmVudERpcmVjdGlvbiA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ3JpZ2h0JzpcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3VwJzpcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVDb3VudCA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8ub3B0aW9ucy5zd2lwZVRvU2xpZGUgP1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5jaGVja05hdmlnYWJsZSggXy5jdXJyZW50U2xpZGUgLSBfLmdldFNsaWRlQ291bnQoKSApIDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uY3VycmVudFNsaWRlIC0gXy5nZXRTbGlkZUNvdW50KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIF8uY3VycmVudERpcmVjdGlvbiA9IDE7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcblxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoIGRpcmVjdGlvbiAhPSAndmVydGljYWwnICkge1xyXG5cclxuICAgICAgICAgICAgICAgIF8uc2xpZGVIYW5kbGVyKCBzbGlkZUNvdW50ICk7XHJcbiAgICAgICAgICAgICAgICBfLnRvdWNoT2JqZWN0ID0ge307XHJcbiAgICAgICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignc3dpcGUnLCBbXywgZGlyZWN0aW9uIF0pO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgaWYgKCBfLnRvdWNoT2JqZWN0LnN0YXJ0WCAhPT0gXy50b3VjaE9iamVjdC5jdXJYICkge1xyXG5cclxuICAgICAgICAgICAgICAgIF8uc2xpZGVIYW5kbGVyKCBfLmN1cnJlbnRTbGlkZSApO1xyXG4gICAgICAgICAgICAgICAgXy50b3VjaE9iamVjdCA9IHt9O1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuc3dpcGVIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoKF8ub3B0aW9ucy5zd2lwZSA9PT0gZmFsc2UpIHx8ICgnb250b3VjaGVuZCcgaW4gZG9jdW1lbnQgJiYgXy5vcHRpb25zLnN3aXBlID09PSBmYWxzZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoXy5vcHRpb25zLmRyYWdnYWJsZSA9PT0gZmFsc2UgJiYgZXZlbnQudHlwZS5pbmRleE9mKCdtb3VzZScpICE9PSAtMSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfLnRvdWNoT2JqZWN0LmZpbmdlckNvdW50ID0gZXZlbnQub3JpZ2luYWxFdmVudCAmJiBldmVudC5vcmlnaW5hbEV2ZW50LnRvdWNoZXMgIT09IHVuZGVmaW5lZCA/XHJcbiAgICAgICAgICAgIGV2ZW50Lm9yaWdpbmFsRXZlbnQudG91Y2hlcy5sZW5ndGggOiAxO1xyXG5cclxuICAgICAgICBfLnRvdWNoT2JqZWN0Lm1pblN3aXBlID0gXy5saXN0V2lkdGggLyBfLm9wdGlvbnNcclxuICAgICAgICAgICAgLnRvdWNoVGhyZXNob2xkO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsU3dpcGluZyA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBfLnRvdWNoT2JqZWN0Lm1pblN3aXBlID0gXy5saXN0SGVpZ2h0IC8gXy5vcHRpb25zXHJcbiAgICAgICAgICAgICAgICAudG91Y2hUaHJlc2hvbGQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2l0Y2ggKGV2ZW50LmRhdGEuYWN0aW9uKSB7XHJcblxyXG4gICAgICAgICAgICBjYXNlICdzdGFydCc6XHJcbiAgICAgICAgICAgICAgICBfLnN3aXBlU3RhcnQoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlICdtb3ZlJzpcclxuICAgICAgICAgICAgICAgIF8uc3dpcGVNb3ZlKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAnZW5kJzpcclxuICAgICAgICAgICAgICAgIF8uc3dpcGVFbmQoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5zd2lwZU1vdmUgPSBmdW5jdGlvbihldmVudCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgIGVkZ2VXYXNIaXQgPSBmYWxzZSxcclxuICAgICAgICAgICAgY3VyTGVmdCwgc3dpcGVEaXJlY3Rpb24sIHN3aXBlTGVuZ3RoLCBwb3NpdGlvbk9mZnNldCwgdG91Y2hlcztcclxuXHJcbiAgICAgICAgdG91Y2hlcyA9IGV2ZW50Lm9yaWdpbmFsRXZlbnQgIT09IHVuZGVmaW5lZCA/IGV2ZW50Lm9yaWdpbmFsRXZlbnQudG91Y2hlcyA6IG51bGw7XHJcblxyXG4gICAgICAgIGlmICghXy5kcmFnZ2luZyB8fCB0b3VjaGVzICYmIHRvdWNoZXMubGVuZ3RoICE9PSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGN1ckxlZnQgPSBfLmdldExlZnQoXy5jdXJyZW50U2xpZGUpO1xyXG5cclxuICAgICAgICBfLnRvdWNoT2JqZWN0LmN1clggPSB0b3VjaGVzICE9PSB1bmRlZmluZWQgPyB0b3VjaGVzWzBdLnBhZ2VYIDogZXZlbnQuY2xpZW50WDtcclxuICAgICAgICBfLnRvdWNoT2JqZWN0LmN1clkgPSB0b3VjaGVzICE9PSB1bmRlZmluZWQgPyB0b3VjaGVzWzBdLnBhZ2VZIDogZXZlbnQuY2xpZW50WTtcclxuXHJcbiAgICAgICAgXy50b3VjaE9iamVjdC5zd2lwZUxlbmd0aCA9IE1hdGgucm91bmQoTWF0aC5zcXJ0KFxyXG4gICAgICAgICAgICBNYXRoLnBvdyhfLnRvdWNoT2JqZWN0LmN1clggLSBfLnRvdWNoT2JqZWN0LnN0YXJ0WCwgMikpKTtcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbFN3aXBpbmcgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgXy50b3VjaE9iamVjdC5zd2lwZUxlbmd0aCA9IE1hdGgucm91bmQoTWF0aC5zcXJ0KFxyXG4gICAgICAgICAgICAgICAgTWF0aC5wb3coXy50b3VjaE9iamVjdC5jdXJZIC0gXy50b3VjaE9iamVjdC5zdGFydFksIDIpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2lwZURpcmVjdGlvbiA9IF8uc3dpcGVEaXJlY3Rpb24oKTtcclxuXHJcbiAgICAgICAgaWYgKHN3aXBlRGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChldmVudC5vcmlnaW5hbEV2ZW50ICE9PSB1bmRlZmluZWQgJiYgXy50b3VjaE9iamVjdC5zd2lwZUxlbmd0aCA+IDQpIHtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBvc2l0aW9uT2Zmc2V0ID0gKF8ub3B0aW9ucy5ydGwgPT09IGZhbHNlID8gMSA6IC0xKSAqIChfLnRvdWNoT2JqZWN0LmN1clggPiBfLnRvdWNoT2JqZWN0LnN0YXJ0WCA/IDEgOiAtMSk7XHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbFN3aXBpbmcgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgcG9zaXRpb25PZmZzZXQgPSBfLnRvdWNoT2JqZWN0LmN1clkgPiBfLnRvdWNoT2JqZWN0LnN0YXJ0WSA/IDEgOiAtMTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBzd2lwZUxlbmd0aCA9IF8udG91Y2hPYmplY3Quc3dpcGVMZW5ndGg7XHJcblxyXG4gICAgICAgIF8udG91Y2hPYmplY3QuZWRnZUhpdCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmluZmluaXRlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBpZiAoKF8uY3VycmVudFNsaWRlID09PSAwICYmIHN3aXBlRGlyZWN0aW9uID09PSAncmlnaHQnKSB8fCAoXy5jdXJyZW50U2xpZGUgPj0gXy5nZXREb3RDb3VudCgpICYmIHN3aXBlRGlyZWN0aW9uID09PSAnbGVmdCcpKSB7XHJcbiAgICAgICAgICAgICAgICBzd2lwZUxlbmd0aCA9IF8udG91Y2hPYmplY3Quc3dpcGVMZW5ndGggKiBfLm9wdGlvbnMuZWRnZUZyaWN0aW9uO1xyXG4gICAgICAgICAgICAgICAgXy50b3VjaE9iamVjdC5lZGdlSGl0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgXy5zd2lwZUxlZnQgPSBjdXJMZWZ0ICsgc3dpcGVMZW5ndGggKiBwb3NpdGlvbk9mZnNldDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBfLnN3aXBlTGVmdCA9IGN1ckxlZnQgKyAoc3dpcGVMZW5ndGggKiAoXy4kbGlzdC5oZWlnaHQoKSAvIF8ubGlzdFdpZHRoKSkgKiBwb3NpdGlvbk9mZnNldDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbFN3aXBpbmcgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgXy5zd2lwZUxlZnQgPSBjdXJMZWZ0ICsgc3dpcGVMZW5ndGggKiBwb3NpdGlvbk9mZnNldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZmFkZSA9PT0gdHJ1ZSB8fCBfLm9wdGlvbnMudG91Y2hNb3ZlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy5hbmltYXRpbmcgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgXy5zd2lwZUxlZnQgPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfLnNldENTUyhfLnN3aXBlTGVmdCk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuc3dpcGVTdGFydCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgdG91Y2hlcztcclxuXHJcbiAgICAgICAgXy5pbnRlcnJ1cHRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgIGlmIChfLnRvdWNoT2JqZWN0LmZpbmdlckNvdW50ICE9PSAxIHx8IF8uc2xpZGVDb3VudCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcbiAgICAgICAgICAgIF8udG91Y2hPYmplY3QgPSB7fTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGV2ZW50Lm9yaWdpbmFsRXZlbnQgIT09IHVuZGVmaW5lZCAmJiBldmVudC5vcmlnaW5hbEV2ZW50LnRvdWNoZXMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0b3VjaGVzID0gZXZlbnQub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy50b3VjaE9iamVjdC5zdGFydFggPSBfLnRvdWNoT2JqZWN0LmN1clggPSB0b3VjaGVzICE9PSB1bmRlZmluZWQgPyB0b3VjaGVzLnBhZ2VYIDogZXZlbnQuY2xpZW50WDtcclxuICAgICAgICBfLnRvdWNoT2JqZWN0LnN0YXJ0WSA9IF8udG91Y2hPYmplY3QuY3VyWSA9IHRvdWNoZXMgIT09IHVuZGVmaW5lZCA/IHRvdWNoZXMucGFnZVkgOiBldmVudC5jbGllbnRZO1xyXG5cclxuICAgICAgICBfLmRyYWdnaW5nID0gdHJ1ZTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS51bmZpbHRlclNsaWRlcyA9IFNsaWNrLnByb3RvdHlwZS5zbGlja1VuZmlsdGVyID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKF8uJHNsaWRlc0NhY2hlICE9PSBudWxsKSB7XHJcblxyXG4gICAgICAgICAgICBfLnVubG9hZCgpO1xyXG5cclxuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmRldGFjaCgpO1xyXG5cclxuICAgICAgICAgICAgXy4kc2xpZGVzQ2FjaGUuYXBwZW5kVG8oXy4kc2xpZGVUcmFjayk7XHJcblxyXG4gICAgICAgICAgICBfLnJlaW5pdCgpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUudW5sb2FkID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgJCgnLnNsaWNrLWNsb25lZCcsIF8uJHNsaWRlcikucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIGlmIChfLiRkb3RzKSB7XHJcbiAgICAgICAgICAgIF8uJGRvdHMucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy4kcHJldkFycm93ICYmIF8uaHRtbEV4cHIudGVzdChfLm9wdGlvbnMucHJldkFycm93KSkge1xyXG4gICAgICAgICAgICBfLiRwcmV2QXJyb3cucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy4kbmV4dEFycm93ICYmIF8uaHRtbEV4cHIudGVzdChfLm9wdGlvbnMubmV4dEFycm93KSkge1xyXG4gICAgICAgICAgICBfLiRuZXh0QXJyb3cucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfLiRzbGlkZXNcclxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdzbGljay1zbGlkZSBzbGljay1hY3RpdmUgc2xpY2stdmlzaWJsZSBzbGljay1jdXJyZW50JylcclxuICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKVxyXG4gICAgICAgICAgICAuY3NzKCd3aWR0aCcsICcnKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS51bnNsaWNrID0gZnVuY3Rpb24oZnJvbUJyZWFrcG9pbnQpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG4gICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCd1bnNsaWNrJywgW18sIGZyb21CcmVha3BvaW50XSk7XHJcbiAgICAgICAgXy5kZXN0cm95KCk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUudXBkYXRlQXJyb3dzID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgY2VudGVyT2Zmc2V0O1xyXG5cclxuICAgICAgICBjZW50ZXJPZmZzZXQgPSBNYXRoLmZsb29yKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLyAyKTtcclxuXHJcbiAgICAgICAgaWYgKCBfLm9wdGlvbnMuYXJyb3dzID09PSB0cnVlICYmXHJcbiAgICAgICAgICAgIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgJiZcclxuICAgICAgICAgICAgIV8ub3B0aW9ucy5pbmZpbml0ZSApIHtcclxuXHJcbiAgICAgICAgICAgIF8uJHByZXZBcnJvdy5yZW1vdmVDbGFzcygnc2xpY2stZGlzYWJsZWQnKS5hdHRyKCdhcmlhLWRpc2FibGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgICAgIF8uJG5leHRBcnJvdy5yZW1vdmVDbGFzcygnc2xpY2stZGlzYWJsZWQnKS5hdHRyKCdhcmlhLWRpc2FibGVkJywgJ2ZhbHNlJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoXy5jdXJyZW50U2xpZGUgPT09IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cuYWRkQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICd0cnVlJyk7XHJcbiAgICAgICAgICAgICAgICBfLiRuZXh0QXJyb3cucmVtb3ZlQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICdmYWxzZScpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChfLmN1cnJlbnRTbGlkZSA+PSBfLnNsaWRlQ291bnQgLSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICYmIF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSBmYWxzZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIF8uJG5leHRBcnJvdy5hZGRDbGFzcygnc2xpY2stZGlzYWJsZWQnKS5hdHRyKCdhcmlhLWRpc2FibGVkJywgJ3RydWUnKTtcclxuICAgICAgICAgICAgICAgIF8uJHByZXZBcnJvdy5yZW1vdmVDbGFzcygnc2xpY2stZGlzYWJsZWQnKS5hdHRyKCdhcmlhLWRpc2FibGVkJywgJ2ZhbHNlJyk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKF8uY3VycmVudFNsaWRlID49IF8uc2xpZGVDb3VudCAtIDEgJiYgXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBfLiRuZXh0QXJyb3cuYWRkQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICd0cnVlJyk7XHJcbiAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cucmVtb3ZlQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICdmYWxzZScpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUudXBkYXRlRG90cyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmIChfLiRkb3RzICE9PSBudWxsKSB7XHJcblxyXG4gICAgICAgICAgICBfLiRkb3RzXHJcbiAgICAgICAgICAgICAgICAuZmluZCgnbGknKVxyXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdzbGljay1hY3RpdmUnKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuXHJcbiAgICAgICAgICAgIF8uJGRvdHNcclxuICAgICAgICAgICAgICAgIC5maW5kKCdsaScpXHJcbiAgICAgICAgICAgICAgICAuZXEoTWF0aC5mbG9vcihfLmN1cnJlbnRTbGlkZSAvIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCkpXHJcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWFjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnZpc2liaWxpdHkgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoIF8ub3B0aW9ucy5hdXRvcGxheSApIHtcclxuXHJcbiAgICAgICAgICAgIGlmICggZG9jdW1lbnRbXy5oaWRkZW5dICkge1xyXG5cclxuICAgICAgICAgICAgICAgIF8uaW50ZXJydXB0ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICBfLmludGVycnVwdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgICQuZm4uc2xpY2sgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgIG9wdCA9IGFyZ3VtZW50c1swXSxcclxuICAgICAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSksXHJcbiAgICAgICAgICAgIGwgPSBfLmxlbmd0aCxcclxuICAgICAgICAgICAgaSxcclxuICAgICAgICAgICAgcmV0O1xyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHQgPT0gJ29iamVjdCcgfHwgdHlwZW9mIG9wdCA9PSAndW5kZWZpbmVkJylcclxuICAgICAgICAgICAgICAgIF9baV0uc2xpY2sgPSBuZXcgU2xpY2soX1tpXSwgb3B0KTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmV0ID0gX1tpXS5zbGlja1tvcHRdLmFwcGx5KF9baV0uc2xpY2ssIGFyZ3MpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHJldCAhPSAndW5kZWZpbmVkJykgcmV0dXJuIHJldDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIF87XHJcbiAgICB9O1xyXG5cclxufSkpO1xyXG4iLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHRoaXMucHJvamVjdFZpZGVvRW1iZWQoKTtcclxuICAgIH0sXHJcblxyXG4gICAgcHJvamVjdFZpZGVvRW1iZWQoKSB7XHJcbiAgICAgICQuZ2V0U2NyaXB0KCdodHRwOi8vd3d3LnlvdXR1YmUuY29tL2lmcmFtZV9hcGknKS5kb25lKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIG9uUGxheWVyU3RhdGVDaGFuZ2UoZXZlbnQpIHtcclxuICAgICAgICAgIHN3aXRjaChldmVudC5kYXRhKSB7XHJcbiAgICAgICAgICAgIGNhc2UgWVQuUGxheWVyU3RhdGUuRU5ERUQ6XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdWaWRlbyBoYXMgZW5kZWQuJyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFlULlBsYXllclN0YXRlLlBMQVlJTkc6XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdWaWRlbyBpcyBwbGF5aW5nLicpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBZVC5QbGF5ZXJTdGF0ZS5QQVVTRUQ6XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdWaWRlbyBpcyBwYXVzZWQuJyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFlULlBsYXllclN0YXRlLkJVRkZFUklORzpcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ1ZpZGVvIGlzIGJ1ZmZlcmluZy4nKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgWVQuUGxheWVyU3RhdGUuQ1VFRDpcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ1ZpZGVvIGlzIGN1ZWQuJyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCgnLnZpZGVvLXdyYXAgLm92ZXJsYXknKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHZhciB2aWRJZCA9ICQodGhpcykuYXR0cignZGF0YS1pZCcpO1xyXG4gICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnaGlkZGVuJyk7XHJcbiAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLmZpbmQoJy5pZnJhbWUtYm94JykuaHRtbCgnPGlmcmFtZSBpZD1cInBsYXllcl8nK3ZpZElkKydcIiB3aWR0aD1cIjQyMFwiIGhlaWdodD1cIjMxNVwiIHNyYz1cImh0dHA6Ly93d3cueW91dHViZS5jb20vZW1iZWQvJyArIHZpZElkICsgJz9lbmFibGVqc2FwaT0xJmF1dG9wbGF5PTEmYXV0b2hpZGU9MSZzaG93aW5mbz0wXCIgZnJhbWVib3JkZXI9XCIwXCIgYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPicpO1xyXG5cclxuICAgICAgICAgIG5ldyBZVC5QbGF5ZXIoJ3BsYXllcl8nK3ZpZElkLCB7XHJcbiAgICAgICAgICAgIGV2ZW50czoge1xyXG4gICAgICAgICAgICAgICdvblN0YXRlQ2hhbmdlJzogb25QbGF5ZXJTdGF0ZUNoYW5nZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH1cclxufSIsIi8vIGltcG9ydCAnLi4vbGlicy9qcXVlcnkudmFsaWRhdGUuanMnO1xyXG5cclxuLy8gKGZ1bmN0aW9uKCQpIHtcclxuLy8gICAgICQuZm4uZm9ybVN1Ym1pdCA9IGZ1bmN0aW9uKCkge1xyXG4vLyAgICAgICAgICQodGhpcykuZWFjaChmdW5jdGlvbigpIHtcclxuLy8gICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4vLyAgICAgICAgICAgICAkKHRoaXMpLnZhbGlkYXRlKHtcclxuLy8gICAgICAgICAgICAgICAgIHJ1bGVzOiB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJyZXF1aXJlZFwiLFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwicmVxdWlyZWRcIixcclxuLy8gICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcInJlcXVpcmVkXCIsXHJcbi8vICAgICAgICAgICAgICAgICAgICAgZW1haWw6IHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiB0cnVlXHJcbi8vICAgICAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICAgICAgfSxcclxuLy8gICAgICAgICAgICAgICAgIG1lc3NhZ2VzOiB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgbmFtZTogZm9ybVZhbGlkYXRlU2V0dGluZ3MubmFtZSxcclxuLy8gICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBmb3JtVmFsaWRhdGVTZXR0aW5ncy5tZXNzYWdlRW1wdHksXHJcbi8vICAgICAgICAgICAgICAgICAgICAgdGV4dDogZm9ybVZhbGlkYXRlU2V0dGluZ3MudGV4dEVtcHR5LFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkOiBmb3JtVmFsaWRhdGVTZXR0aW5ncy5lbWFpbEVtcHR5LFxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogZm9ybVZhbGlkYXRlU2V0dGluZ3MuZW1haWxJbmNvcnJlY3RcclxuLy8gICAgICAgICAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgICAgICAgICB9LFxyXG5cclxuLy8gICAgICAgICAgICAgICAgIHN1Ym1pdEhhbmRsZXI6IGZ1bmN0aW9uIHN1Ym1pdEhhbmRsZXIoZm9ybSwgZSkge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICB2YXIgJGZvcm0gPSAkKHRoYXQpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJGZvcm0uYXR0cignbWV0aG9kJyksXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICRmb3JtLmF0dHIoJ2FjdGlvbicpLFxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6ICRmb3JtLnNlcmlhbGl6ZSgpXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmRvbmUoZnVuY3Rpb24gKGRhdGEpIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGRhdGEudGl0bGUgPT09IHVuZGVmaW5lZCkgZGF0YS50aXRsZSA9ICcnO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS5tZXNzYWdlID09PSB1bmRlZmluZWQpIGRhdGEubWVzc2FnZSA9ICcnO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyA9PSB0cnVlKSB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0uaGlkZSgyMDApO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtWzBdLnJlc2V0KCk7XHJcblxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmb3JtU3VjY2VzcyA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2Zvcm0tc3VjY2VzcycpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1TdWNjZXNzLmh0bWwoJzxkaXYgY2xhc3M9XCJzdGF0ZS1pY29uXCI+PC9kaXY+IDxkaXYgY2xhc3M9XCJmb3JtLXRpdGxlXCI+JyArIGRhdGEudGl0bGUgKyAnPC9kaXY+IDxkaXYgY2xhc3M9XCJmb3JtLWRlc2NyXCI+JyArIGRhdGEubWVzc2FnZSArICc8L2Rpdj4nKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5wYXJlbnQoKS5hcHBlbmQoZm9ybVN1Y2Nlc3MpO1xyXG5cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0ucGFyZW50KCkuZmluZCgnLmZvcm0tc3VjY2VzcycpLnNob3coMjAwKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAyMDApO1xyXG5cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0ucGFyZW50KCkuZmluZCgnLmZvcm0tc3VjY2VzcycpLmhpZGUoMjAwKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAzMDAwKTtcclxuXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLnBhcmVudCgpLmZpbmQoJy5mb3JtLXN1Y2Nlc3MnKS5yZW1vdmUoKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0ucGFyZW50KCkuZmluZCgnLmZvcm0tc3VjY2VzcycpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5zaG93KDIwMCk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMzIwMCk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLmhpZGUoMjAwKTtcclxuXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZvcm1FcnJvciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2Zvcm0tZXJyb3InKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtRXJyb3IuaHRtbCgnPGRpdiBjbGFzcz1cInN0YXRlLWljb25cIj48L2Rpdj4gPGRpdiBjbGFzcz1cImZvcm0tdGl0bGVcIj4nICsgZGF0YS50aXRsZSArICc8L2Rpdj4gPGRpdiBjbGFzcz1cImZvcm0tZGVzY3JcIj4nICsgZGF0YS5tZXNzYWdlICsgJzwvZGl2PjxhIGhyZWY9XCIjXCIgY2xhc3M9XCJidG5cIj4nICsgZm9ybVZhbGlkYXRlU2V0dGluZ3Muc2VuZF9hZ2FpbiArICc8L2E+Jyk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0ucGFyZW50KCkuYXBwZW5kKGZvcm1FcnJvcik7XHJcblxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5wYXJlbnQoKS5maW5kKCcuZm9ybS1lcnJvcicpLnNob3coMjAwKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAyMDApO1xyXG5cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5wYXJlbnQoKS5maW5kKCcuZm9ybS1lcnJvcicpLmZpbmQoJ2EnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLnBhcmVudCgpLmZpbmQoJy5mb3JtLWVycm9yJykuaGlkZSgyMDApO1xyXG5cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5wYXJlbnQoKS5maW5kKCcuZm9ybS1lcnJvcicpLnJlbW92ZSgpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0uc2hvdygyMDApO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAyMDApO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICB9KS5mYWlsKGZ1bmN0aW9uICgpIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLmhpZGUoMjAwKTtcclxuXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZm9ybUVycm9yID0gJCgnPGRpdj48L2Rpdj4nKS5hZGRDbGFzcygnZm9ybS1lcnJvcicpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybUVycm9yLmh0bWwoJzxkaXYgY2xhc3M9XCJzdGF0ZS1pY29uXCI+PC9kaXY+IDxkaXYgY2xhc3M9XCJmb3JtLXRpdGxlXCI+JyArIGZvcm1WYWxpZGF0ZVNldHRpbmdzLnNlbmRfZXJyb3JfdGl0bGUgKyAnPC9kaXY+IDxkaXYgY2xhc3M9XCJmb3JtLWRlc2NyXCI+JyArIGZvcm1WYWxpZGF0ZVNldHRpbmdzLnNlbmRfZXJyb3JfbWVzc2FnZSArICc8L2Rpdj4gPGEgaHJlZj1cIiNcIiBjbGFzcz1cImJ0blwiPicgKyBmb3JtVmFsaWRhdGVTZXR0aW5ncy5zZW5kX2FnYWluICsgJzwvYT4nKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLnBhcmVudCgpLmFwcGVuZChmb3JtRXJyb3IpO1xyXG5cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLnBhcmVudCgpLmZpbmQoJy5mb3JtLWVycm9yJykuc2hvdygyMDApO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMjAwKTtcclxuXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5wYXJlbnQoKS5maW5kKCcuZm9ybS1lcnJvcicpLmZpbmQoJ2EnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5wYXJlbnQoKS5maW5kKCcuZm9ybS1lcnJvcicpLmhpZGUoMjAwKTtcclxuXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLnBhcmVudCgpLmZpbmQoJy5mb3JtLWVycm9yJykucmVtb3ZlKCk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLnNob3coMjAwKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAyMDApO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuLy8gICAgICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICAgICAgfSk7XHJcbi8vICAgICAgICAgfSlcclxuLy8gICAgIH1cclxuLy8gfSkoalF1ZXJ5KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgdGhpcy52YWxpZGF0aW9uKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHZhbGlkYXRpb24oKSB7XHJcbiAgICAgICAgLy8gJCgnZm9ybScpLmZvcm1TdWJtaXQoKTtcclxuXHJcbiAgICAgICAgJChcIi5tYXQtaW5wdXRcIikuZm9jdXMoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5hZGRDbGFzcyhcImlzLWFjdGl2ZSBpcy1jb21wbGV0ZWRcIik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoXCIubWF0LWlucHV0XCIpLmZvY3Vzb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGlmKCQodGhpcykudmFsKCkgPT09IFwiXCIpXHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLnJlbW92ZUNsYXNzKFwiaXMtY29tcGxldGVkXCIpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLnJlbW92ZUNsYXNzKFwiaXMtYWN0aXZlXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHNlbGVjdDIgZnJvbSAnLi4vbGlicy9zZWxlY3QyLmpzJztcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcblxyXG4gICAgaW5pdCgpe1xyXG4gICAgICAgIHRoaXMuaGVhZGVyRnVuY3Rpb25zKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGhlYWRlckZ1bmN0aW9ucyAoKSB7XHJcblxyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKCcubWVudS1idXR0b24nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICQoJy5zaXRlLW5hdicpLnNsaWRlVXAoJ2FjdGl2ZScpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCcubWVudS1idXR0b24nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgJCgnLnNpdGUtbmF2Jykuc2xpZGVUb2dnbGUoJ2FjdGl2ZScpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCgnLnNpdGUtbmF2Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBmb3JtYXRTdGF0ZSAoc3RhdGUpIHtcclxuICAgICAgICAgICAgaWYgKCFzdGF0ZS5pZCkgeyByZXR1cm4gc3RhdGUudGV4dDsgfVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzdGF0ZS5lbGVtZW50LnZhbHVlLnNwbGl0KCdfJylbMF0udG9Mb3dlckNhc2UoKSk7XHJcbiAgICAgICAgICAgIHZhciAkc3RhdGUgPSAkKFxyXG4gICAgICAgICAgICAgICAgJzxzcGFuPjxpbWcgY2xhc3M9XCJjb250ZXh0Q2hhbmdlXCIgc3JjPSBcIi4uL2ltYWdlcy9mbGFncy8nICsgc3RhdGUuZWxlbWVudC52YWx1ZS5zcGxpdCgnXycpWzBdLnRvTG93ZXJDYXNlKCkgKyAnLnBuZ1wiIGNsYXNzPVwiaW1nLWZsYWdcIiAvPiAnICsgc3RhdGUudGV4dCArICc8L3NwYW4+J1xyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgcmV0dXJuICRzdGF0ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoXCIubGFuZ1wiKS5zZWxlY3QyKHtcclxuICAgICAgICAgICAgLy8gdGVtcGxhdGVSZXN1bHQ6IGZvcm1hdFN0YXRlLFxyXG4gICAgICAgICAgICAvLyB0ZW1wbGF0ZVNlbGVjdGlvbjogZm9ybWF0U3RhdGUsXHJcbiAgICAgICAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiBJbmZpbml0eVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCdzZWxlY3QubGFuZycpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCdmb3JtJykuc3VibWl0KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vICQoJy5sYW5nJykub24oXCJzZWxlY3QyOnNlbGVjdFwiLCBmdW5jdGlvbihlKXtcclxuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coZS5wYXJhbXMpO1xyXG4gICAgICAgIC8vICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShlLnBhcmFtcy5kYXRhLmlkLnNwbGl0KCdfJylbMV0pO1xyXG4gICAgICAgIC8vIH0pO1xyXG5cclxuICAgIH1cclxufTsiLCJleHBvcnQgZGVmYXVsdCB7XHJcblx0aW5pdCgpIHtcclxuXHRcdHRoaXMuaW5pdE1hcCgpO1xyXG5cdH0sXHJcblxyXG5cdGluaXRNYXAoKSB7XHJcblxyXG5cdFx0XHRcdCQuZ2V0U2NyaXB0KFwiaHR0cDovL21hcHMuZ29vZ2xlLmNvbS9tYXBzL2FwaS9qcz9rZXk9QUl6YVN5QzFtdTVwN0wzS01IbldRWFRrNExUV1IzQlNpYVF0ZFc4JnNlbnNvcj10cnVlXCIpLmRvbmUoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHRjb25zdCBtYXBJZCA9ICQoJyNtYXAnKTtcclxuXHRcdFx0XHRcdFx0Y29uc3QgZGF0YUxhdCA9IHBhcnNlRmxvYXQobWFwSWQuYXR0cignZGF0YS1sYXQnKSk7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGRhdGFMbmcgPSBwYXJzZUZsb2F0KG1hcElkLmF0dHIoJ2RhdGEtbG5nJykpO1xyXG5cdFx0XHRcdFx0XHRjb25zdCBjZW50ZXIgPSB7bGF0OiBkYXRhTGF0LCBsbmc6IGRhdGFMbmd9O1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnbWFwIGluaXRpYWxpemUnKTtcclxuXHRcdFx0XHRcdFx0dmFyIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYXBcIiksIHtcclxuXHRcdFx0XHRcdFx0XHRcdHpvb206IDE2LFxyXG5cdFx0XHRcdFx0XHRcdFx0Y2VudGVyOiBjZW50ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRzY3JvbGx3aGVlbDogZmFsc2UsXHJcblx0XHRcdFx0XHRcdFx0XHRkcmFnZ2FibGU6IHRydWUsXHJcblx0XHRcdFx0XHRcdFx0XHR6b29tQ29udHJvbDogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0XHRcdHpvb21Db250cm9sT3B0aW9uczoge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHBvc2l0aW9uOiBnb29nbGUubWFwcy5Db250cm9sUG9zaXRpb24uVE9QX1JJR0hUXHJcblx0XHRcdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHRcdFx0cGFuQ29udHJvbDogZmFsc2UsXHJcblx0XHRcdFx0XHRcdFx0XHRtYXBUeXBlQ29udHJvbDogZmFsc2UsXHJcblx0XHRcdFx0XHRcdFx0XHRzdHJlZXRWaWV3Q29udHJvbDogZmFsc2VcclxuXHRcdFx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdFx0XHR2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XHJcblx0XHRcdFx0XHRcdFx0XHRwb3NpdGlvbjogY2VudGVyLFxyXG5cdFx0XHRcdFx0XHRcdFx0bWFwOiBtYXAsXHJcblx0XHRcdFx0XHRcdFx0XHRpY29uOiAkKCcjbWFwJykuYXR0cignZGF0YS1waW4nKSxcclxuXHRcdFx0XHRcdFx0XHRcdHRpdGxlOiBcIm15IHBsYWNlXCJcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9XHJcbn1cclxuIiwiaW1wb3J0ICcuLi9saWJzL3NsaWNrJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgdGhpcy5oZWFkZXJTbGlkZXIoKTtcclxuICAgICAgICB0aGlzLmhvbWVQcm9qZWN0U2xpZGVyKCk7XHJcbiAgICAgICAgdGhpcy5ob21lVmVydGljYWxTbGlkZXIoKTtcclxuICAgICAgICB0aGlzLmNlbnRlcmVkU2xpZGVyKCk7XHJcbiAgICAgICAgdGhpcy5kb3VibGVTbGlkZXIoKTtcclxuICAgIH0sXHJcblxyXG4gICAgaGVhZGVyU2xpZGVyKCkge1xyXG4gICAgICAgICQoJy5zaXRlLWhlYWRlcl9zbGlkZXInKS5zbGljayh7XHJcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgICAgIGFycm93czogZmFsc2UsXHJcbiAgICAgICAgICAgIGF1dG9wbGF5OiB0cnVlLFxyXG4gICAgICAgICAgICBhdXRvcGxheVNwZWVkOiAyMDAwXHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGhvbWVQcm9qZWN0U2xpZGVyKCkge1xyXG4gICAgICAkKCcucHJvamVjdHMtc2xpZGVyJykuc2xpY2soe1xyXG4gICAgICAgICAgY2VudGVyTW9kZTogdHJ1ZSxcclxuICAgICAgICAgIHJlc3BvbnNpdmU6IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgYnJlYWtwb2ludDogMTAyMyxcclxuICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICBjZW50ZXJNb2RlOiBmYWxzZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICQoJy5wcm9qZWN0cy1zbGlkZXItaW5mbyAuYi1pbmZvX2l0ZW0nKS5lcSgwKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblxyXG4gICAgICAkKCcucHJvamVjdHMtc2xpZGVyJykub24oJ2JlZm9yZUNoYW5nZScsIGZ1bmN0aW9uKGV2ZW50LCBzbGljaywgY3VycmVudFNsaWRlLCBuZXh0U2xpZGUpe1xyXG4gICAgICAgICQoJy5wcm9qZWN0cy1zbGlkZXItaW5mbyAuYi1pbmZvX2l0ZW0nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblxyXG4gICAgICAgIGlmICgkKCcucHJvamVjdHMtc2xpZGVyLWluZm8gLmItaW5mb19pdGVtJykuZXEobmV4dFNsaWRlKS5sZW5ndGggIT0gMCkge1xyXG4gICAgICAgICAgJCgnLnByb2plY3RzLXNsaWRlci1pbmZvIC5iLWluZm9faXRlbScpLmVxKG5leHRTbGlkZSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGhvbWVWZXJ0aWNhbFNsaWRlcigpIHtcclxuICAgICAgJCgnLmhvbWUtdmVyaWNhbC1zbGlkZXInKS5zbGljayh7XHJcbiAgICAgICAgZG90czogdHJ1ZVxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgY2VudGVyZWRTbGlkZXIoKSB7XHJcbiAgICAgICQoJy5jZW50ZXItc2xpZGVyJykuc2xpY2soe1xyXG4gICAgICAgIGNlbnRlck1vZGU6IHRydWUsXHJcbiAgICAgICAgc2xpZGVzVG9TaG93OiAzLFxyXG4gICAgICAgIHJlc3BvbnNpdmU6IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgYnJlYWtwb2ludDogMTAyMyxcclxuICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICBjZW50ZXJNb2RlOiBmYWxzZSxcclxuICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDFcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGRvdWJsZVNsaWRlcigpIHtcclxuICAgICAgJCgnLmRvdWJsZS1zbGlkZXInKS5zbGljayh7XHJcbiAgICAgICAgY2VudGVyTW9kZTogdHJ1ZSxcclxuICAgICAgICBzbGlkZXNUb1Nob3c6IDIsXHJcbiAgICAgICAgY2VudGVyUGFkZGluZzogJzgwcHgnLFxyXG4gICAgICAgIHJlc3BvbnNpdmU6IFtcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgYnJlYWtwb2ludDogMTAyMyxcclxuICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICBjZW50ZXJNb2RlOiBmYWxzZSxcclxuICAgICAgICAgICAgICBzbGlkZXNUb1Nob3c6IDEsXHJcbiAgICAgICAgICAgICAgY2VudGVyUGFkZGluZzogJzBweCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgSGVhZGVyRnVuY3Rpb25zIGZyb20gXCIuLi9tb2R1bGVzL2hlYWRlckZ1bmN0aW9uc1wiO1xyXG5pbXBvcnQgU2xpZGVycyBmcm9tIFwiLi4vbW9kdWxlcy9zbGlkZXJzLmpzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgICBpbml0KCl7XHJcbiAgICAgICAgSGVhZGVyRnVuY3Rpb25zLmluaXQoKTtcclxuICAgICAgICBTbGlkZXJzLmluaXQoKTtcclxuICAgIH1cclxufTsiLCJpbXBvcnQgSGVhZGVyRnVuY3Rpb25zIGZyb20gXCIuLi9tb2R1bGVzL2hlYWRlckZ1bmN0aW9uc1wiO1xyXG5pbXBvcnQgU2xpZGVycyBmcm9tIFwiLi4vbW9kdWxlcy9zbGlkZXJzLmpzXCI7XHJcbmltcG9ydCBGb3JtRnVuY3Rpb25zIGZyb20gXCIuLi9tb2R1bGVzL2Zvcm1GdW5jdGlvbnNcIjtcclxuaW1wb3J0IEdNYXAgZnJvbSAnLi4vbW9kdWxlcy9tYXAuanMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgaW5pdCgpe1xyXG4gICAgICAgIEhlYWRlckZ1bmN0aW9ucy5pbml0KCk7XHJcbiAgICAgICAgU2xpZGVycy5pbml0KCk7XHJcbiAgICAgICAgR01hcC5pbml0KCk7XHJcbiAgICAgICAgRm9ybUZ1bmN0aW9ucy5pbml0KCk7XHJcbiAgICB9XHJcbn07IiwiaW1wb3J0IEhlYWRlckZ1bmN0aW9ucyBmcm9tIFwiLi4vbW9kdWxlcy9oZWFkZXJGdW5jdGlvbnNcIjtcclxuaW1wb3J0IEZvcm1GdW5jdGlvbnMgZnJvbSBcIi4uL21vZHVsZXMvZm9ybUZ1bmN0aW9uc1wiO1xyXG5pbXBvcnQgU2xpZGVycyBmcm9tIFwiLi4vbW9kdWxlcy9zbGlkZXJzLmpzXCI7XHJcbmltcG9ydCBNYXBJbml0IGZyb20gXCIuLi9tb2R1bGVzL21hcC5qc1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgaW5pdCgpe1xyXG4gICAgICAgIEhlYWRlckZ1bmN0aW9ucy5pbml0KCk7XHJcbiAgICAgICAgU2xpZGVycy5pbml0KCk7XHJcbiAgICAgICAgLy8gTWFwSW5pdC5pbml0KCk7XHJcbiAgICAgICAgRm9ybUZ1bmN0aW9ucy5pbml0KCk7XHJcbiAgICB9XHJcbn07IiwiaW1wb3J0IEhlYWRlckZ1bmN0aW9ucyBmcm9tIFwiLi4vbW9kdWxlcy9oZWFkZXJGdW5jdGlvbnNcIjtcclxuaW1wb3J0IFNsaWRlcnMgZnJvbSBcIi4uL21vZHVsZXMvc2xpZGVycy5qc1wiO1xyXG5pbXBvcnQgUExBWUVSIGZyb20gJy4uL21vZHVsZXMvWVRlbWJlZC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgICBpbml0KCl7XHJcbiAgICAgICAgSGVhZGVyRnVuY3Rpb25zLmluaXQoKTtcclxuICAgICAgICBTbGlkZXJzLmluaXQoKTtcclxuICAgICAgICBQTEFZRVIuaW5pdCgpO1xyXG4gICAgfVxyXG59OyJdfQ==
