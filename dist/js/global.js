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
        };

        $(".lang").select2({
            templateResult: formatState,
            templateSelection: formatState,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXGpzXFxhc3NldHNcXGpzXFxnbG9iYWwuanMiLCJhc3NldHNcXGpzXFxsaWJzXFxzZWxlY3QyLmpzIiwiYXNzZXRzXFxqc1xcbGlic1xcc2xpY2suanMiLCJhc3NldHNcXGpzXFxtb2R1bGVzXFxZVGVtYmVkLmpzIiwiYXNzZXRzXFxqc1xcbW9kdWxlc1xcZm9ybUZ1bmN0aW9ucy5qcyIsImFzc2V0c1xcanNcXG1vZHVsZXNcXGhlYWRlckZ1bmN0aW9ucy5qcyIsImFzc2V0c1xcanNcXG1vZHVsZXNcXG1hcC5qcyIsImFzc2V0c1xcanNcXG1vZHVsZXNcXHNsaWRlcnMuanMiLCJhc3NldHNcXGpzXFxwYWdlc1xcQ09NTU9OLmpzIiwiYXNzZXRzXFxqc1xccGFnZXNcXENPTlRBQ1RTLmpzIiwiYXNzZXRzXFxqc1xccGFnZXNcXEhPTUUuanMiLCJhc3NldHNcXGpzXFxwYWdlc1xcUFJPSkVDVFMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBSSxPQUFPLElBQVg7O0FBRUEsUUFBUSxPQUFPLElBQVAsQ0FBWSxJQUFwQjtBQUNJLFNBQUssV0FBTDtBQUNJLGVBQU8sZUFBSyxJQUFMLENBQVUsSUFBVixnQkFBUDtBQUNBO0FBQ0osU0FBSyxlQUFMO0FBQ0ksZUFBTyxtQkFBUyxJQUFULENBQWMsSUFBZCxvQkFBUDtBQUNBO0FBQ0osU0FBSyxhQUFMO0FBQ0ksZUFBTyxpQkFBTyxJQUFQLENBQVksSUFBWixrQkFBUDtBQUNBO0FBQ0osU0FBSyxlQUFMO0FBQ0ksZUFBTyxtQkFBUyxJQUFULENBQWMsSUFBZCxvQkFBUDtBQUNBO0FBQ0o7QUFDSSxlQUFPLGdCQUFNO0FBQ1Qsb0JBQVEsR0FBUixDQUFZLGNBQVo7QUFDSCxTQUZEO0FBZFI7O0FBbUJBLEVBQUUsUUFBRixFQUFZLEtBQVos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O0FBeURmLGdCQUFVLEdBekRLO0FBMERmLGtCQUFVLEdBMURLO0FBMkRmLGtCQUFVLEdBM0RLO0FBNERmLGtCQUFVLEdBNURLO0FBNkRmLGtCQUFVLEdBN0RLO0FBOERmLGtCQUFVLEdBOURLO0FBK0RmLGtCQUFVLEdBL0RLO0FBZ0VmLGtCQUFVLEdBaEVLO0FBaUVmLGtCQUFVLEdBakVLO0FBa0VmLGtCQUFVLEdBbEVLO0FBbUVmLGtCQUFVLEdBbkVLO0FBb0VmLGtCQUFVLEdBcEVLO0FBcUVmLGtCQUFVLEdBckVLO0FBc0VmLGtCQUFVLEdBdEVLO0FBdUVmLGtCQUFVLEdBdkVLO0FBd0VmLGtCQUFVLEdBeEVLO0FBeUVmLGtCQUFVLEdBekVLO0FBMEVmLGtCQUFVLEdBMUVLO0FBMkVmLGtCQUFVLElBM0VLO0FBNEVmLGtCQUFVLElBNUVLO0FBNkVmLGtCQUFVLElBN0VLO0FBOEVmLGtCQUFVLElBOUVLO0FBK0VmLGtCQUFVLEdBL0VLO0FBZ0ZmLGtCQUFVLEdBaEZLO0FBaUZmLGdCQUFVLEdBakZLO0FBa0ZmLGdCQUFVLEdBbEZLO0FBbUZmLGdCQUFVLEdBbkZLO0FBb0ZmLGtCQUFVLEdBcEZLO0FBcUZmLGtCQUFVLEdBckZLO0FBc0ZmLGtCQUFVLEdBdEZLO0FBdUZmLGtCQUFVLEdBdkZLO0FBd0ZmLGtCQUFVLEdBeEZLO0FBeUZmLGtCQUFVLEdBekZLO0FBMEZmLGtCQUFVLEdBMUZLO0FBMkZmLGtCQUFVLEdBM0ZLO0FBNEZmLGtCQUFVLEdBNUZLO0FBNkZmLGtCQUFVLEdBN0ZLO0FBOEZmLGdCQUFVLEdBOUZLO0FBK0ZmLGtCQUFVLEdBL0ZLO0FBZ0dmLGtCQUFVLEdBaEdLO0FBaUdmLGtCQUFVLEdBakdLO0FBa0dmLGtCQUFVLEdBbEdLO0FBbUdmLGtCQUFVLEdBbkdLO0FBb0dmLGtCQUFVLEdBcEdLO0FBcUdmLGtCQUFVLEdBckdLO0FBc0dmLGtCQUFVLEdBdEdLO0FBdUdmLGtCQUFVLEdBdkdLO0FBd0dmLGtCQUFVLEdBeEdLO0FBeUdmLGtCQUFVLEdBekdLO0FBMEdmLGtCQUFVLEdBMUdLO0FBMkdmLGtCQUFVLEdBM0dLO0FBNEdmLGtCQUFVLEdBNUdLO0FBNkdmLGtCQUFVLEdBN0dLO0FBOEdmLGtCQUFVLEdBOUdLO0FBK0dmLGtCQUFVLEdBL0dLO0FBZ0hmLGtCQUFVLEdBaEhLO0FBaUhmLGtCQUFVLEdBakhLO0FBa0hmLGtCQUFVLEdBbEhLO0FBbUhmLGtCQUFVLEdBbkhLO0FBb0hmLGtCQUFVLEdBcEhLO0FBcUhmLGtCQUFVLEdBckhLO0FBc0hmLGtCQUFVLEdBdEhLO0FBdUhmLGtCQUFVLEdBdkhLO0FBd0hmLGtCQUFVLEdBeEhLO0FBeUhmLGtCQUFVLEdBekhLO0FBMEhmLGtCQUFVLEdBMUhLO0FBMkhmLGtCQUFVLEdBM0hLO0FBNEhmLGtCQUFVLEdBNUhLO0FBNkhmLGtCQUFVLEdBN0hLO0FBOEhmLGtCQUFVLEdBOUhLO0FBK0hmLGtCQUFVLEdBL0hLO0FBZ0lmLGtCQUFVLEdBaElLO0FBaUlmLGtCQUFVLEdBaklLO0FBa0lmLGtCQUFVLEdBbElLO0FBbUlmLGtCQUFVLEdBbklLO0FBb0lmLGtCQUFVLEdBcElLO0FBcUlmLGtCQUFVLEdBcklLO0FBc0lmLGtCQUFVLEdBdElLO0FBdUlmLGtCQUFVLEdBdklLO0FBd0lmLGtCQUFVLEdBeElLO0FBeUlmLGtCQUFVLEdBeklLO0FBMElmLGtCQUFVLEdBMUlLO0FBMklmLGtCQUFVLEdBM0lLO0FBNElmLGtCQUFVLEdBNUlLO0FBNklmLGtCQUFVLEdBN0lLO0FBOElmLGdCQUFVLEdBOUlLO0FBK0lmLGdCQUFVLEdBL0lLO0FBZ0pmLGdCQUFVLEdBaEpLO0FBaUpmLGtCQUFVLEdBakpLO0FBa0pmLGtCQUFVLEdBbEpLO0FBbUpmLGtCQUFVLEdBbkpLO0FBb0pmLGtCQUFVLEdBcEpLO0FBcUpmLGdCQUFVLEdBckpLO0FBc0pmLGtCQUFVLEdBdEpLO0FBdUpmLGtCQUFVLEdBdkpLO0FBd0pmLGtCQUFVLEdBeEpLO0FBeUpmLGtCQUFVLEdBekpLO0FBMEpmLGtCQUFVLEdBMUpLO0FBMkpmLGtCQUFVLEdBM0pLO0FBNEpmLGtCQUFVLEdBNUpLO0FBNkpmLGtCQUFVLEdBN0pLO0FBOEpmLGtCQUFVLEdBOUpLO0FBK0pmLGtCQUFVLEdBL0pLO0FBZ0tmLGtCQUFVLEdBaEtLO0FBaUtmLGtCQUFVLEdBaktLO0FBa0tmLGtCQUFVLEdBbEtLO0FBbUtmLGtCQUFVLEdBbktLO0FBb0tmLGtCQUFVLEdBcEtLO0FBcUtmLGtCQUFVLEdBcktLO0FBc0tmLGtCQUFVLEdBdEtLO0FBdUtmLGtCQUFVLEdBdktLO0FBd0tmLGtCQUFVLEdBeEtLO0FBeUtmLGtCQUFVLEdBektLO0FBMEtmLGtCQUFVLEdBMUtLO0FBMktmLGtCQUFVLEdBM0tLO0FBNEtmLGtCQUFVLEdBNUtLO0FBNktmLGtCQUFVLEdBN0tLO0FBOEtmLGtCQUFVLEdBOUtLO0FBK0tmLGtCQUFVLEdBL0tLO0FBZ0xmLGtCQUFVLEdBaExLO0FBaUxmLGtCQUFVLEdBakxLO0FBa0xmLGtCQUFVLEdBbExLO0FBbUxmLGtCQUFVLEdBbkxLO0FBb0xmLGtCQUFVLEdBcExLO0FBcUxmLGtCQUFVLEdBckxLO0FBc0xmLGtCQUFVLEdBdExLO0FBdUxmLGtCQUFVLEdBdkxLO0FBd0xmLGtCQUFVLEdBeExLO0FBeUxmLGtCQUFVLEdBekxLO0FBMExmLGtCQUFVLEdBMUxLO0FBMkxmLGtCQUFVLEdBM0xLO0FBNExmLGtCQUFVLEdBNUxLO0FBNkxmLGtCQUFVLEdBN0xLO0FBOExmLGtCQUFVLEdBOUxLO0FBK0xmLGtCQUFVLEdBL0xLO0FBZ01mLGtCQUFVLEdBaE1LO0FBaU1mLGtCQUFVLElBak1LO0FBa01mLGtCQUFVLElBbE1LO0FBbU1mLGtCQUFVLEdBbk1LO0FBb01mLGtCQUFVLEdBcE1LO0FBcU1mLGtCQUFVLEdBck1LO0FBc01mLGtCQUFVLEdBdE1LO0FBdU1mLGtCQUFVLEdBdk1LO0FBd01mLGtCQUFVLEdBeE1LO0FBeU1mLGtCQUFVLEdBek1LO0FBME1mLGtCQUFVLEdBMU1LO0FBMk1mLGtCQUFVLEdBM01LO0FBNE1mLGtCQUFVLEdBNU1LO0FBNk1mLGtCQUFVLEdBN01LO0FBOE1mLGdCQUFVLEdBOU1LO0FBK01mLGtCQUFVLEdBL01LO0FBZ05mLGtCQUFVLEdBaE5LO0FBaU5mLGtCQUFVLEdBak5LO0FBa05mLGtCQUFVLEdBbE5LO0FBbU5mLGtCQUFVLEdBbk5LO0FBb05mLGtCQUFVLEdBcE5LO0FBcU5mLGtCQUFVLEdBck5LO0FBc05mLGtCQUFVLEdBdE5LO0FBdU5mLGtCQUFVLEdBdk5LO0FBd05mLGtCQUFVLEdBeE5LO0FBeU5mLGtCQUFVLElBek5LO0FBME5mLGtCQUFVLElBMU5LO0FBMk5mLGtCQUFVLEdBM05LO0FBNE5mLGtCQUFVLEdBNU5LO0FBNk5mLGdCQUFVLEdBN05LO0FBOE5mLGdCQUFVLEdBOU5LO0FBK05mLGdCQUFVLEdBL05LO0FBZ09mLGtCQUFVLEdBaE9LO0FBaU9mLGtCQUFVLEdBak9LO0FBa09mLGtCQUFVLEdBbE9LO0FBbU9mLGtCQUFVLEdBbk9LO0FBb09mLGdCQUFVLEdBcE9LO0FBcU9mLGtCQUFVLEdBck9LO0FBc09mLGtCQUFVLEdBdE9LO0FBdU9mLGtCQUFVLEdBdk9LO0FBd09mLGtCQUFVLEdBeE9LO0FBeU9mLGtCQUFVLEdBek9LO0FBME9mLGtCQUFVLEdBMU9LO0FBMk9mLGtCQUFVLEdBM09LO0FBNE9mLGtCQUFVLEdBNU9LO0FBNk9mLGtCQUFVLEdBN09LO0FBOE9mLGdCQUFVLEdBOU9LO0FBK09mLGtCQUFVLEdBL09LO0FBZ1BmLGtCQUFVLEdBaFBLO0FBaVBmLGtCQUFVLEdBalBLO0FBa1BmLGtCQUFVLEdBbFBLO0FBbVBmLGtCQUFVLEdBblBLO0FBb1BmLGtCQUFVLEdBcFBLO0FBcVBmLGtCQUFVLEdBclBLO0FBc1BmLGtCQUFVLEdBdFBLO0FBdVBmLGtCQUFVLEdBdlBLO0FBd1BmLGtCQUFVLEdBeFBLO0FBeVBmLGtCQUFVLEdBelBLO0FBMFBmLGtCQUFVLEdBMVBLO0FBMlBmLGtCQUFVLEdBM1BLO0FBNFBmLGtCQUFVLEdBNVBLO0FBNlBmLGtCQUFVLEdBN1BLO0FBOFBmLGtCQUFVLEdBOVBLO0FBK1BmLGdCQUFVLEdBL1BLO0FBZ1FmLGtCQUFVLEdBaFFLO0FBaVFmLGtCQUFVLEdBalFLO0FBa1FmLGtCQUFVLEdBbFFLO0FBbVFmLGtCQUFVLEdBblFLO0FBb1FmLGtCQUFVLEdBcFFLO0FBcVFmLGtCQUFVLElBclFLO0FBc1FmLGtCQUFVLElBdFFLO0FBdVFmLGtCQUFVLElBdlFLO0FBd1FmLGtCQUFVLEdBeFFLO0FBeVFmLGtCQUFVLEdBelFLO0FBMFFmLGtCQUFVLEdBMVFLO0FBMlFmLGtCQUFVLEdBM1FLO0FBNFFmLGtCQUFVLEdBNVFLO0FBNlFmLGtCQUFVLEdBN1FLO0FBOFFmLGtCQUFVLEdBOVFLO0FBK1FmLGtCQUFVLEdBL1FLO0FBZ1JmLGtCQUFVLEdBaFJLO0FBaVJmLGtCQUFVLEdBalJLO0FBa1JmLGtCQUFVLEdBbFJLO0FBbVJmLGtCQUFVLEdBblJLO0FBb1JmLGtCQUFVLEdBcFJLO0FBcVJmLGtCQUFVLEdBclJLO0FBc1JmLGtCQUFVLEdBdFJLO0FBdVJmLGtCQUFVLEdBdlJLO0FBd1JmLGtCQUFVLEdBeFJLO0FBeVJmLGtCQUFVLEdBelJLO0FBMFJmLGtCQUFVLEdBMVJLO0FBMlJmLGtCQUFVLEdBM1JLO0FBNFJmLGtCQUFVLEdBNVJLO0FBNlJmLGtCQUFVLEdBN1JLO0FBOFJmLGtCQUFVLEdBOVJLO0FBK1JmLGtCQUFVLEdBL1JLO0FBZ1NmLGtCQUFVLEdBaFNLO0FBaVNmLGtCQUFVLEdBalNLO0FBa1NmLGtCQUFVLEdBbFNLO0FBbVNmLGtCQUFVLEdBblNLO0FBb1NmLGtCQUFVLEdBcFNLO0FBcVNmLGtCQUFVLEdBclNLO0FBc1NmLGtCQUFVLEdBdFNLO0FBdVNmLGtCQUFVLEdBdlNLO0FBd1NmLGtCQUFVLEdBeFNLO0FBeVNmLGtCQUFVLEdBelNLO0FBMFNmLGtCQUFVLEdBMVNLO0FBMlNmLGtCQUFVLEdBM1NLO0FBNFNmLGtCQUFVLEdBNVNLO0FBNlNmLGtCQUFVLEdBN1NLO0FBOFNmLGtCQUFVLEdBOVNLO0FBK1NmLGtCQUFVLEdBL1NLO0FBZ1RmLGtCQUFVLEdBaFRLO0FBaVRmLGtCQUFVLEdBalRLO0FBa1RmLGtCQUFVLEdBbFRLO0FBbVRmLGtCQUFVLEdBblRLO0FBb1RmLGtCQUFVLEdBcFRLO0FBcVRmLGtCQUFVLEdBclRLO0FBc1RmLGtCQUFVLEdBdFRLO0FBdVRmLGtCQUFVLEdBdlRLO0FBd1RmLGtCQUFVLEdBeFRLO0FBeVRmLGtCQUFVLEdBelRLO0FBMFRmLGtCQUFVLEdBMVRLO0FBMlRmLGtCQUFVLEdBM1RLO0FBNFRmLGtCQUFVLEdBNVRLO0FBNlRmLGtCQUFVLEdBN1RLO0FBOFRmLGtCQUFVLEdBOVRLO0FBK1RmLGtCQUFVLEdBL1RLO0FBZ1VmLGtCQUFVLEdBaFVLO0FBaVVmLGtCQUFVLEdBalVLO0FBa1VmLGtCQUFVLEdBbFVLO0FBbVVmLGtCQUFVLEdBblVLO0FBb1VmLGtCQUFVLElBcFVLO0FBcVVmLGtCQUFVLEdBclVLO0FBc1VmLGtCQUFVLEdBdFVLO0FBdVVmLGdCQUFVLEdBdlVLO0FBd1VmLGdCQUFVLEdBeFVLO0FBeVVmLGdCQUFVLEdBelVLO0FBMFVmLGtCQUFVLEdBMVVLO0FBMlVmLGtCQUFVLEdBM1VLO0FBNFVmLGtCQUFVLEdBNVVLO0FBNlVmLGtCQUFVLEdBN1VLO0FBOFVmLGtCQUFVLEdBOVVLO0FBK1VmLGdCQUFVLEdBL1VLO0FBZ1ZmLGtCQUFVLEdBaFZLO0FBaVZmLGtCQUFVLEdBalZLO0FBa1ZmLGtCQUFVLEdBbFZLO0FBbVZmLGtCQUFVLEdBblZLO0FBb1ZmLGtCQUFVLEdBcFZLO0FBcVZmLGtCQUFVLEdBclZLO0FBc1ZmLGtCQUFVLEdBdFZLO0FBdVZmLGtCQUFVLEdBdlZLO0FBd1ZmLGtCQUFVLEdBeFZLO0FBeVZmLGtCQUFVLEdBelZLO0FBMFZmLGtCQUFVLEdBMVZLO0FBMlZmLGtCQUFVLEdBM1ZLO0FBNFZmLGtCQUFVLEdBNVZLO0FBNlZmLGtCQUFVLEdBN1ZLO0FBOFZmLGtCQUFVLEdBOVZLO0FBK1ZmLGtCQUFVLEdBL1ZLO0FBZ1dmLGtCQUFVLEdBaFdLO0FBaVdmLGtCQUFVLEdBaldLO0FBa1dmLGtCQUFVLEdBbFdLO0FBbVdmLGtCQUFVLEdBbldLO0FBb1dmLGtCQUFVLEdBcFdLO0FBcVdmLGtCQUFVLEdBcldLO0FBc1dmLGtCQUFVLEdBdFdLO0FBdVdmLGtCQUFVLEdBdldLO0FBd1dmLGtCQUFVLEdBeFdLO0FBeVdmLGtCQUFVLEdBeldLO0FBMFdmLGtCQUFVLEdBMVdLO0FBMldmLGtCQUFVLEdBM1dLO0FBNFdmLGtCQUFVLEdBNVdLO0FBNldmLGtCQUFVLElBN1dLO0FBOFdmLGtCQUFVLEdBOVdLO0FBK1dmLGtCQUFVLEdBL1dLO0FBZ1hmLGtCQUFVLEdBaFhLO0FBaVhmLGtCQUFVLEdBalhLO0FBa1hmLGtCQUFVLEdBbFhLO0FBbVhmLGtCQUFVLEdBblhLO0FBb1hmLGtCQUFVLEdBcFhLO0FBcVhmLGtCQUFVLEdBclhLO0FBc1hmLGtCQUFVLEdBdFhLO0FBdVhmLGtCQUFVLEdBdlhLO0FBd1hmLGtCQUFVLEdBeFhLO0FBeVhmLGtCQUFVLEdBelhLO0FBMFhmLGtCQUFVLEdBMVhLO0FBMlhmLGtCQUFVLEdBM1hLO0FBNFhmLGtCQUFVLEdBNVhLO0FBNlhmLGtCQUFVLEdBN1hLO0FBOFhmLGdCQUFVLEdBOVhLO0FBK1hmLGtCQUFVLEdBL1hLO0FBZ1lmLGtCQUFVLEdBaFlLO0FBaVlmLGtCQUFVLEdBallLO0FBa1lmLGtCQUFVLEdBbFlLO0FBbVlmLGtCQUFVLEdBbllLO0FBb1lmLGtCQUFVLEdBcFlLO0FBcVlmLGtCQUFVLEdBcllLO0FBc1lmLGtCQUFVLEdBdFlLO0FBdVlmLGtCQUFVLEdBdllLO0FBd1lmLGtCQUFVLEdBeFlLO0FBeVlmLGtCQUFVLEdBellLO0FBMFlmLGtCQUFVLEdBMVlLO0FBMllmLGtCQUFVLEdBM1lLO0FBNFlmLGtCQUFVLEdBNVlLO0FBNllmLGtCQUFVLEdBN1lLO0FBOFlmLGtCQUFVLEdBOVlLO0FBK1lmLGtCQUFVLEdBL1lLO0FBZ1pmLGtCQUFVLEdBaFpLO0FBaVpmLGtCQUFVLEdBalpLO0FBa1pmLGtCQUFVLEdBbFpLO0FBbVpmLGtCQUFVLEdBblpLO0FBb1pmLGtCQUFVLEdBcFpLO0FBcVpmLGtCQUFVLEdBclpLO0FBc1pmLGtCQUFVLEdBdFpLO0FBdVpmLGtCQUFVLEdBdlpLO0FBd1pmLGtCQUFVLEdBeFpLO0FBeVpmLGdCQUFVLEdBelpLO0FBMFpmLGdCQUFVLEdBMVpLO0FBMlpmLGdCQUFVLEdBM1pLO0FBNFpmLGtCQUFVLEdBNVpLO0FBNlpmLGtCQUFVLEdBN1pLO0FBOFpmLGtCQUFVLEdBOVpLO0FBK1pmLGtCQUFVLEdBL1pLO0FBZ2FmLGdCQUFVLEdBaGFLO0FBaWFmLGtCQUFVLEdBamFLO0FBa2FmLGtCQUFVLEdBbGFLO0FBbWFmLGtCQUFVLEdBbmFLO0FBb2FmLGtCQUFVLEdBcGFLO0FBcWFmLGtCQUFVLEdBcmFLO0FBc2FmLGtCQUFVLEdBdGFLO0FBdWFmLGtCQUFVLEdBdmFLO0FBd2FmLGtCQUFVLEdBeGFLO0FBeWFmLGdCQUFVLEdBemFLO0FBMGFmLGtCQUFVLEdBMWFLO0FBMmFmLGtCQUFVLEdBM2FLO0FBNGFmLGdCQUFVLEdBNWFLO0FBNmFmLGtCQUFVLEdBN2FLO0FBOGFmLGtCQUFVLEdBOWFLO0FBK2FmLGtCQUFVLEdBL2FLO0FBZ2JmLGtCQUFVLEdBaGJLO0FBaWJmLGtCQUFVLEdBamJLO0FBa2JmLGtCQUFVLEdBbGJLO0FBbWJmLGtCQUFVLEdBbmJLO0FBb2JmLGtCQUFVLEdBcGJLO0FBcWJmLGtCQUFVLEdBcmJLO0FBc2JmLGtCQUFVLEdBdGJLO0FBdWJmLGtCQUFVLEdBdmJLO0FBd2JmLGtCQUFVLElBeGJLO0FBeWJmLGdCQUFVLElBemJLO0FBMGJmLGtCQUFVLElBMWJLO0FBMmJmLGtCQUFVLElBM2JLO0FBNGJmLGtCQUFVLElBNWJLO0FBNmJmLGtCQUFVLElBN2JLO0FBOGJmLGtCQUFVLElBOWJLO0FBK2JmLGtCQUFVLElBL2JLO0FBZ2NmLGtCQUFVLElBaGNLO0FBaWNmLGtCQUFVLEdBamNLO0FBa2NmLGtCQUFVLEdBbGNLO0FBbWNmLGtCQUFVLEdBbmNLO0FBb2NmLGtCQUFVLEdBcGNLO0FBcWNmLGtCQUFVLEdBcmNLO0FBc2NmLGtCQUFVLEdBdGNLO0FBdWNmLGtCQUFVLEdBdmNLO0FBd2NmLGtCQUFVLEdBeGNLO0FBeWNmLGtCQUFVLEdBemNLO0FBMGNmLGtCQUFVLEdBMWNLO0FBMmNmLGtCQUFVLEdBM2NLO0FBNGNmLGtCQUFVLEdBNWNLO0FBNmNmLGtCQUFVLEdBN2NLO0FBOGNmLGtCQUFVLEdBOWNLO0FBK2NmLGdCQUFVLEdBL2NLO0FBZ2RmLGtCQUFVLEdBaGRLO0FBaWRmLGtCQUFVLEdBamRLO0FBa2RmLGtCQUFVLEdBbGRLO0FBbWRmLGtCQUFVLEdBbmRLO0FBb2RmLGtCQUFVLEdBcGRLO0FBcWRmLGtCQUFVLEdBcmRLO0FBc2RmLGtCQUFVLEdBdGRLO0FBdWRmLGtCQUFVLEdBdmRLO0FBd2RmLGtCQUFVLEdBeGRLO0FBeWRmLGtCQUFVLEdBemRLO0FBMGRmLGtCQUFVLEdBMWRLO0FBMmRmLGtCQUFVLEdBM2RLO0FBNGRmLGtCQUFVLEdBNWRLO0FBNmRmLGtCQUFVLEdBN2RLO0FBOGRmLGtCQUFVLEdBOWRLO0FBK2RmLGtCQUFVLEdBL2RLO0FBZ2VmLGtCQUFVLEdBaGVLO0FBaWVmLGtCQUFVLEdBamVLO0FBa2VmLGtCQUFVLElBbGVLO0FBbWVmLGtCQUFVLElBbmVLO0FBb2VmLGtCQUFVLEdBcGVLO0FBcWVmLGtCQUFVLEdBcmVLO0FBc2VmLGdCQUFVLEdBdGVLO0FBdWVmLGdCQUFVLEdBdmVLO0FBd2VmLGdCQUFVLEdBeGVLO0FBeWVmLGtCQUFVLEdBemVLO0FBMGVmLGtCQUFVLEdBMWVLO0FBMmVmLGtCQUFVLEdBM2VLO0FBNGVmLGtCQUFVLEdBNWVLO0FBNmVmLGtCQUFVLEdBN2VLO0FBOGVmLGtCQUFVLEdBOWVLO0FBK2VmLGtCQUFVLEdBL2VLO0FBZ2ZmLGtCQUFVLEdBaGZLO0FBaWZmLGtCQUFVLEdBamZLO0FBa2ZmLGtCQUFVLEdBbGZLO0FBbWZmLGdCQUFVLEdBbmZLO0FBb2ZmLGtCQUFVLEdBcGZLO0FBcWZmLGtCQUFVLEdBcmZLO0FBc2ZmLGtCQUFVLEdBdGZLO0FBdWZmLGtCQUFVLEdBdmZLO0FBd2ZmLGtCQUFVLEdBeGZLO0FBeWZmLGtCQUFVLEdBemZLO0FBMGZmLGtCQUFVLEdBMWZL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QSwwQkFBTyxJQUFQO0FBQ0g7QUFMVSxDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBDT01NT04gZnJvbSAnLi9wYWdlcy9DT01NT04nO1xyXG5pbXBvcnQgSE9NRSBmcm9tIFwiLi9wYWdlcy9IT01FXCI7XHJcbmltcG9ydCBQUk9KRUNUUyBmcm9tIFwiLi9wYWdlcy9QUk9KRUNUU1wiO1xyXG5pbXBvcnQgQ09OVEFDVFMgZnJvbSBcIi4vcGFnZXMvQ09OVEFDVFNcIjtcclxuXHJcbmxldCBpbml0ID0gbnVsbDtcclxuXHJcbnN3aXRjaCAoZ2xvYmFsLnZhcnMucGFnZSkge1xyXG4gICAgY2FzZSAnaG9tZV9wYWdlJzpcclxuICAgICAgICBpbml0ID0gSE9NRS5pbml0LmJpbmQoSE9NRSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdwcm9qZWN0c19wYWdlJzpcclxuICAgICAgICBpbml0ID0gUFJPSkVDVFMuaW5pdC5iaW5kKFBST0pFQ1RTKTtcclxuICAgICAgICBicmVhaztcclxuICAgIGNhc2UgJ2NvbW1vbl9wYWdlJzpcclxuICAgICAgICBpbml0ID0gQ09NTU9OLmluaXQuYmluZChDT01NT04pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnY29udGFjdHNfcGFnZSc6XHJcbiAgICAgICAgaW5pdCA9IENPTlRBQ1RTLmluaXQuYmluZChDT05UQUNUUyk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICAgIGluaXQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkZWZhdWx0IGluaXQnKTtcclxuICAgICAgICB9O1xyXG59XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShpbml0KCkpO1xyXG5cclxuJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbigpIHtcclxuXHJcbn0pO1xyXG5cclxuJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcclxuXHJcbn0pO1xyXG5cclxuJCh3aW5kb3cpLm9uKCdsb2FkJywgZnVuY3Rpb24gKCkge1xyXG5cclxufSk7IiwiLyohXHJcbiAqIFNlbGVjdDIgNC4wLjNcclxuICogaHR0cHM6Ly9zZWxlY3QyLmdpdGh1Yi5pb1xyXG4gKlxyXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcclxuICogaHR0cHM6Ly9naXRodWIuY29tL3NlbGVjdDIvc2VsZWN0Mi9ibG9iL21hc3Rlci9MSUNFTlNFLm1kXHJcbiAqL1xyXG4oZnVuY3Rpb24gKGZhY3RvcnkpIHtcclxuICAgIGZhY3RvcnkoalF1ZXJ5KTtcclxufShmdW5jdGlvbiAoalF1ZXJ5KSB7XHJcbiAgLy8gVGhpcyBpcyBuZWVkZWQgc28gd2UgY2FuIGNhdGNoIHRoZSBBTUQgbG9hZGVyIGNvbmZpZ3VyYXRpb24gYW5kIHVzZSBpdFxyXG4gIC8vIFRoZSBpbm5lciBmaWxlIHNob3VsZCBiZSB3cmFwcGVkIChieSBgYmFubmVyLnN0YXJ0LmpzYCkgaW4gYSBmdW5jdGlvbiB0aGF0XHJcbiAgLy8gcmV0dXJucyB0aGUgQU1EIGxvYWRlciByZWZlcmVuY2VzLlxyXG4gIHZhciBTMiA9XHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgLy8gUmVzdG9yZSB0aGUgU2VsZWN0MiBBTUQgbG9hZGVyIHNvIGl0IGNhbiBiZSB1c2VkXHJcbiAgLy8gTmVlZGVkIG1vc3RseSBpbiB0aGUgbGFuZ3VhZ2UgZmlsZXMsIHdoZXJlIHRoZSBsb2FkZXIgaXMgbm90IGluc2VydGVkXHJcbiAgaWYgKGpRdWVyeSAmJiBqUXVlcnkuZm4gJiYgalF1ZXJ5LmZuLnNlbGVjdDIgJiYgalF1ZXJ5LmZuLnNlbGVjdDIuYW1kKSB7XHJcbiAgICB2YXIgUzIgPSBqUXVlcnkuZm4uc2VsZWN0Mi5hbWQ7XHJcbiAgfVxyXG52YXIgUzI7KGZ1bmN0aW9uICgpIHsgaWYgKCFTMiB8fCAhUzIucmVxdWlyZWpzKSB7XHJcbmlmICghUzIpIHsgUzIgPSB7fTsgfSBlbHNlIHsgcmVxdWlyZSA9IFMyOyB9XHJcbi8qKlxyXG4gKiBAbGljZW5zZSBhbG1vbmQgMC4zLjEgQ29weXJpZ2h0IChjKSAyMDExLTIwMTQsIFRoZSBEb2pvIEZvdW5kYXRpb24gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cclxuICogQXZhaWxhYmxlIHZpYSB0aGUgTUlUIG9yIG5ldyBCU0QgbGljZW5zZS5cclxuICogc2VlOiBodHRwOi8vZ2l0aHViLmNvbS9qcmJ1cmtlL2FsbW9uZCBmb3IgZGV0YWlsc1xyXG4gKi9cclxuLy9Hb2luZyBzbG9wcHkgdG8gYXZvaWQgJ3VzZSBzdHJpY3QnIHN0cmluZyBjb3N0LCBidXQgc3RyaWN0IHByYWN0aWNlcyBzaG91bGRcclxuLy9iZSBmb2xsb3dlZC5cclxuLypqc2xpbnQgc2xvcHB5OiB0cnVlICovXHJcbi8qZ2xvYmFsIHNldFRpbWVvdXQ6IGZhbHNlICovXHJcblxyXG52YXIgcmVxdWlyZWpzLCByZXF1aXJlLCBkZWZpbmU7XHJcbihmdW5jdGlvbiAodW5kZWYpIHtcclxuICAgIHZhciBtYWluLCByZXEsIG1ha2VNYXAsIGhhbmRsZXJzLFxyXG4gICAgICAgIGRlZmluZWQgPSB7fSxcclxuICAgICAgICB3YWl0aW5nID0ge30sXHJcbiAgICAgICAgY29uZmlnID0ge30sXHJcbiAgICAgICAgZGVmaW5pbmcgPSB7fSxcclxuICAgICAgICBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LFxyXG4gICAgICAgIGFwcyA9IFtdLnNsaWNlLFxyXG4gICAgICAgIGpzU3VmZml4UmVnRXhwID0gL1xcLmpzJC87XHJcblxyXG4gICAgZnVuY3Rpb24gaGFzUHJvcChvYmosIHByb3ApIHtcclxuICAgICAgICByZXR1cm4gaGFzT3duLmNhbGwob2JqLCBwcm9wKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdpdmVuIGEgcmVsYXRpdmUgbW9kdWxlIG5hbWUsIGxpa2UgLi9zb21ldGhpbmcsIG5vcm1hbGl6ZSBpdCB0b1xyXG4gICAgICogYSByZWFsIG5hbWUgdGhhdCBjYW4gYmUgbWFwcGVkIHRvIGEgcGF0aC5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIHRoZSByZWxhdGl2ZSBuYW1lXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYmFzZU5hbWUgYSByZWFsIG5hbWUgdGhhdCB0aGUgbmFtZSBhcmcgaXMgcmVsYXRpdmVcclxuICAgICAqIHRvLlxyXG4gICAgICogQHJldHVybnMge1N0cmluZ30gbm9ybWFsaXplZCBuYW1lXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZShuYW1lLCBiYXNlTmFtZSkge1xyXG4gICAgICAgIHZhciBuYW1lUGFydHMsIG5hbWVTZWdtZW50LCBtYXBWYWx1ZSwgZm91bmRNYXAsIGxhc3RJbmRleCxcclxuICAgICAgICAgICAgZm91bmRJLCBmb3VuZFN0YXJNYXAsIHN0YXJJLCBpLCBqLCBwYXJ0LFxyXG4gICAgICAgICAgICBiYXNlUGFydHMgPSBiYXNlTmFtZSAmJiBiYXNlTmFtZS5zcGxpdChcIi9cIiksXHJcbiAgICAgICAgICAgIG1hcCA9IGNvbmZpZy5tYXAsXHJcbiAgICAgICAgICAgIHN0YXJNYXAgPSAobWFwICYmIG1hcFsnKiddKSB8fCB7fTtcclxuXHJcbiAgICAgICAgLy9BZGp1c3QgYW55IHJlbGF0aXZlIHBhdGhzLlxyXG4gICAgICAgIGlmIChuYW1lICYmIG5hbWUuY2hhckF0KDApID09PSBcIi5cIikge1xyXG4gICAgICAgICAgICAvL0lmIGhhdmUgYSBiYXNlIG5hbWUsIHRyeSB0byBub3JtYWxpemUgYWdhaW5zdCBpdCxcclxuICAgICAgICAgICAgLy9vdGhlcndpc2UsIGFzc3VtZSBpdCBpcyBhIHRvcC1sZXZlbCByZXF1aXJlIHRoYXQgd2lsbFxyXG4gICAgICAgICAgICAvL2JlIHJlbGF0aXZlIHRvIGJhc2VVcmwgaW4gdGhlIGVuZC5cclxuICAgICAgICAgICAgaWYgKGJhc2VOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lID0gbmFtZS5zcGxpdCgnLycpO1xyXG4gICAgICAgICAgICAgICAgbGFzdEluZGV4ID0gbmFtZS5sZW5ndGggLSAxO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIE5vZGUgLmpzIGFsbG93YW5jZTpcclxuICAgICAgICAgICAgICAgIGlmIChjb25maWcubm9kZUlkQ29tcGF0ICYmIGpzU3VmZml4UmVnRXhwLnRlc3QobmFtZVtsYXN0SW5kZXhdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWVbbGFzdEluZGV4XSA9IG5hbWVbbGFzdEluZGV4XS5yZXBsYWNlKGpzU3VmZml4UmVnRXhwLCAnJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy9Mb3Agb2ZmIHRoZSBsYXN0IHBhcnQgb2YgYmFzZVBhcnRzLCBzbyB0aGF0IC4gbWF0Y2hlcyB0aGVcclxuICAgICAgICAgICAgICAgIC8vXCJkaXJlY3RvcnlcIiBhbmQgbm90IG5hbWUgb2YgdGhlIGJhc2VOYW1lJ3MgbW9kdWxlLiBGb3IgaW5zdGFuY2UsXHJcbiAgICAgICAgICAgICAgICAvL2Jhc2VOYW1lIG9mIFwib25lL3R3by90aHJlZVwiLCBtYXBzIHRvIFwib25lL3R3by90aHJlZS5qc1wiLCBidXQgd2VcclxuICAgICAgICAgICAgICAgIC8vd2FudCB0aGUgZGlyZWN0b3J5LCBcIm9uZS90d29cIiBmb3IgdGhpcyBub3JtYWxpemF0aW9uLlxyXG4gICAgICAgICAgICAgICAgbmFtZSA9IGJhc2VQYXJ0cy5zbGljZSgwLCBiYXNlUGFydHMubGVuZ3RoIC0gMSkuY29uY2F0KG5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vc3RhcnQgdHJpbURvdHNcclxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBuYW1lLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFydCA9IG5hbWVbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnQgPT09IFwiLlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWUuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpIC09IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChwYXJ0ID09PSBcIi4uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT09IDEgJiYgKG5hbWVbMl0gPT09ICcuLicgfHwgbmFtZVswXSA9PT0gJy4uJykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vRW5kIG9mIHRoZSBsaW5lLiBLZWVwIGF0IGxlYXN0IG9uZSBub24tZG90XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3BhdGggc2VnbWVudCBhdCB0aGUgZnJvbnQgc28gaXQgY2FuIGJlIG1hcHBlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb3JyZWN0bHkgdG8gZGlzay4gT3RoZXJ3aXNlLCB0aGVyZSBpcyBsaWtlbHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vbm8gcGF0aCBtYXBwaW5nIGZvciBhIHBhdGggc3RhcnRpbmcgd2l0aCAnLi4nLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9UaGlzIGNhbiBzdGlsbCBmYWlsLCBidXQgY2F0Y2hlcyB0aGUgbW9zdCByZWFzb25hYmxlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3VzZXMgb2YgLi5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lLnNwbGljZShpIC0gMSwgMik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpIC09IDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvL2VuZCB0cmltRG90c1xyXG5cclxuICAgICAgICAgICAgICAgIG5hbWUgPSBuYW1lLmpvaW4oXCIvXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5hbWUuaW5kZXhPZignLi8nKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgLy8gTm8gYmFzZU5hbWUsIHNvIHRoaXMgaXMgSUQgaXMgcmVzb2x2ZWQgcmVsYXRpdmVcclxuICAgICAgICAgICAgICAgIC8vIHRvIGJhc2VVcmwsIHB1bGwgb2ZmIHRoZSBsZWFkaW5nIGRvdC5cclxuICAgICAgICAgICAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cmluZygyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9BcHBseSBtYXAgY29uZmlnIGlmIGF2YWlsYWJsZS5cclxuICAgICAgICBpZiAoKGJhc2VQYXJ0cyB8fCBzdGFyTWFwKSAmJiBtYXApIHtcclxuICAgICAgICAgICAgbmFtZVBhcnRzID0gbmFtZS5zcGxpdCgnLycpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChpID0gbmFtZVBhcnRzLmxlbmd0aDsgaSA+IDA7IGkgLT0gMSkge1xyXG4gICAgICAgICAgICAgICAgbmFtZVNlZ21lbnQgPSBuYW1lUGFydHMuc2xpY2UoMCwgaSkuam9pbihcIi9cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGJhc2VQYXJ0cykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vRmluZCB0aGUgbG9uZ2VzdCBiYXNlTmFtZSBzZWdtZW50IG1hdGNoIGluIHRoZSBjb25maWcuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9TbywgZG8gam9pbnMgb24gdGhlIGJpZ2dlc3QgdG8gc21hbGxlc3QgbGVuZ3RocyBvZiBiYXNlUGFydHMuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gYmFzZVBhcnRzLmxlbmd0aDsgaiA+IDA7IGogLT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBWYWx1ZSA9IG1hcFtiYXNlUGFydHMuc2xpY2UoMCwgaikuam9pbignLycpXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vYmFzZU5hbWUgc2VnbWVudCBoYXMgIGNvbmZpZywgZmluZCBpZiBpdCBoYXMgb25lIGZvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3RoaXMgbmFtZS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hcFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBWYWx1ZSA9IG1hcFZhbHVlW25hbWVTZWdtZW50XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXBWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vTWF0Y2gsIHVwZGF0ZSBuYW1lIHRvIHRoZSBuZXcgdmFsdWUuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRNYXAgPSBtYXBWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZEkgPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChmb3VuZE1hcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vQ2hlY2sgZm9yIGEgc3RhciBtYXAgbWF0Y2gsIGJ1dCBqdXN0IGhvbGQgb24gdG8gaXQsXHJcbiAgICAgICAgICAgICAgICAvL2lmIHRoZXJlIGlzIGEgc2hvcnRlciBzZWdtZW50IG1hdGNoIGxhdGVyIGluIGEgbWF0Y2hpbmdcclxuICAgICAgICAgICAgICAgIC8vY29uZmlnLCB0aGVuIGZhdm9yIG92ZXIgdGhpcyBzdGFyIG1hcC5cclxuICAgICAgICAgICAgICAgIGlmICghZm91bmRTdGFyTWFwICYmIHN0YXJNYXAgJiYgc3Rhck1hcFtuYW1lU2VnbWVudF0pIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3VuZFN0YXJNYXAgPSBzdGFyTWFwW25hbWVTZWdtZW50XTtcclxuICAgICAgICAgICAgICAgICAgICBzdGFySSA9IGk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghZm91bmRNYXAgJiYgZm91bmRTdGFyTWFwKSB7XHJcbiAgICAgICAgICAgICAgICBmb3VuZE1hcCA9IGZvdW5kU3Rhck1hcDtcclxuICAgICAgICAgICAgICAgIGZvdW5kSSA9IHN0YXJJO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZm91bmRNYXApIHtcclxuICAgICAgICAgICAgICAgIG5hbWVQYXJ0cy5zcGxpY2UoMCwgZm91bmRJLCBmb3VuZE1hcCk7XHJcbiAgICAgICAgICAgICAgICBuYW1lID0gbmFtZVBhcnRzLmpvaW4oJy8nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbWFrZVJlcXVpcmUocmVsTmFtZSwgZm9yY2VTeW5jKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy9BIHZlcnNpb24gb2YgYSByZXF1aXJlIGZ1bmN0aW9uIHRoYXQgcGFzc2VzIGEgbW9kdWxlTmFtZVxyXG4gICAgICAgICAgICAvL3ZhbHVlIGZvciBpdGVtcyB0aGF0IG1heSBuZWVkIHRvXHJcbiAgICAgICAgICAgIC8vbG9vayB1cCBwYXRocyByZWxhdGl2ZSB0byB0aGUgbW9kdWxlTmFtZVxyXG4gICAgICAgICAgICB2YXIgYXJncyA9IGFwcy5jYWxsKGFyZ3VtZW50cywgMCk7XHJcblxyXG4gICAgICAgICAgICAvL0lmIGZpcnN0IGFyZyBpcyBub3QgcmVxdWlyZSgnc3RyaW5nJyksIGFuZCB0aGVyZSBpcyBvbmx5XHJcbiAgICAgICAgICAgIC8vb25lIGFyZywgaXQgaXMgdGhlIGFycmF5IGZvcm0gd2l0aG91dCBhIGNhbGxiYWNrLiBJbnNlcnRcclxuICAgICAgICAgICAgLy9hIG51bGwgc28gdGhhdCB0aGUgZm9sbG93aW5nIGNvbmNhdCBpcyBjb3JyZWN0LlxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3NbMF0gIT09ICdzdHJpbmcnICYmIGFyZ3MubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICBhcmdzLnB1c2gobnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlcS5hcHBseSh1bmRlZiwgYXJncy5jb25jYXQoW3JlbE5hbWUsIGZvcmNlU3luY10pKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG1ha2VOb3JtYWxpemUocmVsTmFtZSkge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAobmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbm9ybWFsaXplKG5hbWUsIHJlbE5hbWUpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbWFrZUxvYWQoZGVwTmFtZSkge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgZGVmaW5lZFtkZXBOYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2FsbERlcChuYW1lKSB7XHJcbiAgICAgICAgaWYgKGhhc1Byb3Aod2FpdGluZywgbmFtZSkpIHtcclxuICAgICAgICAgICAgdmFyIGFyZ3MgPSB3YWl0aW5nW25hbWVdO1xyXG4gICAgICAgICAgICBkZWxldGUgd2FpdGluZ1tuYW1lXTtcclxuICAgICAgICAgICAgZGVmaW5pbmdbbmFtZV0gPSB0cnVlO1xyXG4gICAgICAgICAgICBtYWluLmFwcGx5KHVuZGVmLCBhcmdzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghaGFzUHJvcChkZWZpbmVkLCBuYW1lKSAmJiAhaGFzUHJvcChkZWZpbmluZywgbmFtZSkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyAnICsgbmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkZWZpbmVkW25hbWVdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vVHVybnMgYSBwbHVnaW4hcmVzb3VyY2UgdG8gW3BsdWdpbiwgcmVzb3VyY2VdXHJcbiAgICAvL3dpdGggdGhlIHBsdWdpbiBiZWluZyB1bmRlZmluZWQgaWYgdGhlIG5hbWVcclxuICAgIC8vZGlkIG5vdCBoYXZlIGEgcGx1Z2luIHByZWZpeC5cclxuICAgIGZ1bmN0aW9uIHNwbGl0UHJlZml4KG5hbWUpIHtcclxuICAgICAgICB2YXIgcHJlZml4LFxyXG4gICAgICAgICAgICBpbmRleCA9IG5hbWUgPyBuYW1lLmluZGV4T2YoJyEnKSA6IC0xO1xyXG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgIHByZWZpeCA9IG5hbWUuc3Vic3RyaW5nKDAsIGluZGV4KTtcclxuICAgICAgICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyaW5nKGluZGV4ICsgMSwgbmFtZS5sZW5ndGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW3ByZWZpeCwgbmFtZV07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYWtlcyBhIG5hbWUgbWFwLCBub3JtYWxpemluZyB0aGUgbmFtZSwgYW5kIHVzaW5nIGEgcGx1Z2luXHJcbiAgICAgKiBmb3Igbm9ybWFsaXphdGlvbiBpZiBuZWNlc3NhcnkuIEdyYWJzIGEgcmVmIHRvIHBsdWdpblxyXG4gICAgICogdG9vLCBhcyBhbiBvcHRpbWl6YXRpb24uXHJcbiAgICAgKi9cclxuICAgIG1ha2VNYXAgPSBmdW5jdGlvbiAobmFtZSwgcmVsTmFtZSkge1xyXG4gICAgICAgIHZhciBwbHVnaW4sXHJcbiAgICAgICAgICAgIHBhcnRzID0gc3BsaXRQcmVmaXgobmFtZSksXHJcbiAgICAgICAgICAgIHByZWZpeCA9IHBhcnRzWzBdO1xyXG5cclxuICAgICAgICBuYW1lID0gcGFydHNbMV07XHJcblxyXG4gICAgICAgIGlmIChwcmVmaXgpIHtcclxuICAgICAgICAgICAgcHJlZml4ID0gbm9ybWFsaXplKHByZWZpeCwgcmVsTmFtZSk7XHJcbiAgICAgICAgICAgIHBsdWdpbiA9IGNhbGxEZXAocHJlZml4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vTm9ybWFsaXplIGFjY29yZGluZ1xyXG4gICAgICAgIGlmIChwcmVmaXgpIHtcclxuICAgICAgICAgICAgaWYgKHBsdWdpbiAmJiBwbHVnaW4ubm9ybWFsaXplKSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lID0gcGx1Z2luLm5vcm1hbGl6ZShuYW1lLCBtYWtlTm9ybWFsaXplKHJlbE5hbWUpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG5hbWUgPSBub3JtYWxpemUobmFtZSwgcmVsTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBuYW1lID0gbm9ybWFsaXplKG5hbWUsIHJlbE5hbWUpO1xyXG4gICAgICAgICAgICBwYXJ0cyA9IHNwbGl0UHJlZml4KG5hbWUpO1xyXG4gICAgICAgICAgICBwcmVmaXggPSBwYXJ0c1swXTtcclxuICAgICAgICAgICAgbmFtZSA9IHBhcnRzWzFdO1xyXG4gICAgICAgICAgICBpZiAocHJlZml4KSB7XHJcbiAgICAgICAgICAgICAgICBwbHVnaW4gPSBjYWxsRGVwKHByZWZpeCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vVXNpbmcgcmlkaWN1bG91cyBwcm9wZXJ0eSBuYW1lcyBmb3Igc3BhY2UgcmVhc29uc1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGY6IHByZWZpeCA/IHByZWZpeCArICchJyArIG5hbWUgOiBuYW1lLCAvL2Z1bGxOYW1lXHJcbiAgICAgICAgICAgIG46IG5hbWUsXHJcbiAgICAgICAgICAgIHByOiBwcmVmaXgsXHJcbiAgICAgICAgICAgIHA6IHBsdWdpblxyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIG1ha2VDb25maWcobmFtZSkge1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoY29uZmlnICYmIGNvbmZpZy5jb25maWcgJiYgY29uZmlnLmNvbmZpZ1tuYW1lXSkgfHwge307XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVycyA9IHtcclxuICAgICAgICByZXF1aXJlOiBmdW5jdGlvbiAobmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbWFrZVJlcXVpcmUobmFtZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBleHBvcnRzOiBmdW5jdGlvbiAobmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgZSA9IGRlZmluZWRbbmFtZV07XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChkZWZpbmVkW25hbWVdID0ge30pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtb2R1bGU6IGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBpZDogbmFtZSxcclxuICAgICAgICAgICAgICAgIHVyaTogJycsXHJcbiAgICAgICAgICAgICAgICBleHBvcnRzOiBkZWZpbmVkW25hbWVdLFxyXG4gICAgICAgICAgICAgICAgY29uZmlnOiBtYWtlQ29uZmlnKG5hbWUpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBtYWluID0gZnVuY3Rpb24gKG5hbWUsIGRlcHMsIGNhbGxiYWNrLCByZWxOYW1lKSB7XHJcbiAgICAgICAgdmFyIGNqc01vZHVsZSwgZGVwTmFtZSwgcmV0LCBtYXAsIGksXHJcbiAgICAgICAgICAgIGFyZ3MgPSBbXSxcclxuICAgICAgICAgICAgY2FsbGJhY2tUeXBlID0gdHlwZW9mIGNhbGxiYWNrLFxyXG4gICAgICAgICAgICB1c2luZ0V4cG9ydHM7XHJcblxyXG4gICAgICAgIC8vVXNlIG5hbWUgaWYgbm8gcmVsTmFtZVxyXG4gICAgICAgIHJlbE5hbWUgPSByZWxOYW1lIHx8IG5hbWU7XHJcblxyXG4gICAgICAgIC8vQ2FsbCB0aGUgY2FsbGJhY2sgdG8gZGVmaW5lIHRoZSBtb2R1bGUsIGlmIG5lY2Vzc2FyeS5cclxuICAgICAgICBpZiAoY2FsbGJhY2tUeXBlID09PSAndW5kZWZpbmVkJyB8fCBjYWxsYmFja1R5cGUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgLy9QdWxsIG91dCB0aGUgZGVmaW5lZCBkZXBlbmRlbmNpZXMgYW5kIHBhc3MgdGhlIG9yZGVyZWRcclxuICAgICAgICAgICAgLy92YWx1ZXMgdG8gdGhlIGNhbGxiYWNrLlxyXG4gICAgICAgICAgICAvL0RlZmF1bHQgdG8gW3JlcXVpcmUsIGV4cG9ydHMsIG1vZHVsZV0gaWYgbm8gZGVwc1xyXG4gICAgICAgICAgICBkZXBzID0gIWRlcHMubGVuZ3RoICYmIGNhbGxiYWNrLmxlbmd0aCA/IFsncmVxdWlyZScsICdleHBvcnRzJywgJ21vZHVsZSddIDogZGVwcztcclxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGRlcHMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICAgICAgICAgIG1hcCA9IG1ha2VNYXAoZGVwc1tpXSwgcmVsTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBkZXBOYW1lID0gbWFwLmY7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9GYXN0IHBhdGggQ29tbW9uSlMgc3RhbmRhcmQgZGVwZW5kZW5jaWVzLlxyXG4gICAgICAgICAgICAgICAgaWYgKGRlcE5hbWUgPT09IFwicmVxdWlyZVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJnc1tpXSA9IGhhbmRsZXJzLnJlcXVpcmUobmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRlcE5hbWUgPT09IFwiZXhwb3J0c1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9Db21tb25KUyBtb2R1bGUgc3BlYyAxLjFcclxuICAgICAgICAgICAgICAgICAgICBhcmdzW2ldID0gaGFuZGxlcnMuZXhwb3J0cyhuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB1c2luZ0V4cG9ydHMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkZXBOYW1lID09PSBcIm1vZHVsZVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9Db21tb25KUyBtb2R1bGUgc3BlYyAxLjFcclxuICAgICAgICAgICAgICAgICAgICBjanNNb2R1bGUgPSBhcmdzW2ldID0gaGFuZGxlcnMubW9kdWxlKG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChoYXNQcm9wKGRlZmluZWQsIGRlcE5hbWUpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc1Byb3Aod2FpdGluZywgZGVwTmFtZSkgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzUHJvcChkZWZpbmluZywgZGVwTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBhcmdzW2ldID0gY2FsbERlcChkZXBOYW1lKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWFwLnApIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXAucC5sb2FkKG1hcC5uLCBtYWtlUmVxdWlyZShyZWxOYW1lLCB0cnVlKSwgbWFrZUxvYWQoZGVwTmFtZSksIHt9KTtcclxuICAgICAgICAgICAgICAgICAgICBhcmdzW2ldID0gZGVmaW5lZFtkZXBOYW1lXTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG5hbWUgKyAnIG1pc3NpbmcgJyArIGRlcE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXQgPSBjYWxsYmFjayA/IGNhbGxiYWNrLmFwcGx5KGRlZmluZWRbbmFtZV0sIGFyZ3MpIDogdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIC8vSWYgc2V0dGluZyBleHBvcnRzIHZpYSBcIm1vZHVsZVwiIGlzIGluIHBsYXksXHJcbiAgICAgICAgICAgICAgICAvL2Zhdm9yIHRoYXQgb3ZlciByZXR1cm4gdmFsdWUgYW5kIGV4cG9ydHMuIEFmdGVyIHRoYXQsXHJcbiAgICAgICAgICAgICAgICAvL2Zhdm9yIGEgbm9uLXVuZGVmaW5lZCByZXR1cm4gdmFsdWUgb3ZlciBleHBvcnRzIHVzZS5cclxuICAgICAgICAgICAgICAgIGlmIChjanNNb2R1bGUgJiYgY2pzTW9kdWxlLmV4cG9ydHMgIT09IHVuZGVmICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNqc01vZHVsZS5leHBvcnRzICE9PSBkZWZpbmVkW25hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmaW5lZFtuYW1lXSA9IGNqc01vZHVsZS5leHBvcnRzO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXQgIT09IHVuZGVmIHx8ICF1c2luZ0V4cG9ydHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL1VzZSB0aGUgcmV0dXJuIHZhbHVlIGZyb20gdGhlIGZ1bmN0aW9uLlxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmluZWRbbmFtZV0gPSByZXQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKG5hbWUpIHtcclxuICAgICAgICAgICAgLy9NYXkganVzdCBiZSBhbiBvYmplY3QgZGVmaW5pdGlvbiBmb3IgdGhlIG1vZHVsZS4gT25seVxyXG4gICAgICAgICAgICAvL3dvcnJ5IGFib3V0IGRlZmluaW5nIGlmIGhhdmUgYSBtb2R1bGUgbmFtZS5cclxuICAgICAgICAgICAgZGVmaW5lZFtuYW1lXSA9IGNhbGxiYWNrO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcmVxdWlyZWpzID0gcmVxdWlyZSA9IHJlcSA9IGZ1bmN0aW9uIChkZXBzLCBjYWxsYmFjaywgcmVsTmFtZSwgZm9yY2VTeW5jLCBhbHQpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGRlcHMgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgaWYgKGhhbmRsZXJzW2RlcHNdKSB7XHJcbiAgICAgICAgICAgICAgICAvL2NhbGxiYWNrIGluIHRoaXMgY2FzZSBpcyByZWFsbHkgcmVsTmFtZVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZXJzW2RlcHNdKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL0p1c3QgcmV0dXJuIHRoZSBtb2R1bGUgd2FudGVkLiBJbiB0aGlzIHNjZW5hcmlvLCB0aGVcclxuICAgICAgICAgICAgLy9kZXBzIGFyZyBpcyB0aGUgbW9kdWxlIG5hbWUsIGFuZCBzZWNvbmQgYXJnIChpZiBwYXNzZWQpXHJcbiAgICAgICAgICAgIC8vaXMganVzdCB0aGUgcmVsTmFtZS5cclxuICAgICAgICAgICAgLy9Ob3JtYWxpemUgbW9kdWxlIG5hbWUsIGlmIGl0IGNvbnRhaW5zIC4gb3IgLi5cclxuICAgICAgICAgICAgcmV0dXJuIGNhbGxEZXAobWFrZU1hcChkZXBzLCBjYWxsYmFjaykuZik7XHJcbiAgICAgICAgfSBlbHNlIGlmICghZGVwcy5zcGxpY2UpIHtcclxuICAgICAgICAgICAgLy9kZXBzIGlzIGEgY29uZmlnIG9iamVjdCwgbm90IGFuIGFycmF5LlxyXG4gICAgICAgICAgICBjb25maWcgPSBkZXBzO1xyXG4gICAgICAgICAgICBpZiAoY29uZmlnLmRlcHMpIHtcclxuICAgICAgICAgICAgICAgIHJlcShjb25maWcuZGVwcywgY29uZmlnLmNhbGxiYWNrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjay5zcGxpY2UpIHtcclxuICAgICAgICAgICAgICAgIC8vY2FsbGJhY2sgaXMgYW4gYXJyYXksIHdoaWNoIG1lYW5zIGl0IGlzIGEgZGVwZW5kZW5jeSBsaXN0LlxyXG4gICAgICAgICAgICAgICAgLy9BZGp1c3QgYXJncyBpZiB0aGVyZSBhcmUgZGVwZW5kZW5jaWVzXHJcbiAgICAgICAgICAgICAgICBkZXBzID0gY2FsbGJhY2s7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IHJlbE5hbWU7XHJcbiAgICAgICAgICAgICAgICByZWxOYW1lID0gbnVsbDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRlcHMgPSB1bmRlZjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9TdXBwb3J0IHJlcXVpcmUoWydhJ10pXHJcbiAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbiAoKSB7fTtcclxuXHJcbiAgICAgICAgLy9JZiByZWxOYW1lIGlzIGEgZnVuY3Rpb24sIGl0IGlzIGFuIGVycmJhY2sgaGFuZGxlcixcclxuICAgICAgICAvL3NvIHJlbW92ZSBpdC5cclxuICAgICAgICBpZiAodHlwZW9mIHJlbE5hbWUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgcmVsTmFtZSA9IGZvcmNlU3luYztcclxuICAgICAgICAgICAgZm9yY2VTeW5jID0gYWx0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9TaW11bGF0ZSBhc3luYyBjYWxsYmFjaztcclxuICAgICAgICBpZiAoZm9yY2VTeW5jKSB7XHJcbiAgICAgICAgICAgIG1haW4odW5kZWYsIGRlcHMsIGNhbGxiYWNrLCByZWxOYW1lKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvL1VzaW5nIGEgbm9uLXplcm8gdmFsdWUgYmVjYXVzZSBvZiBjb25jZXJuIGZvciB3aGF0IG9sZCBicm93c2Vyc1xyXG4gICAgICAgICAgICAvL2RvLCBhbmQgbGF0ZXN0IGJyb3dzZXJzIFwidXBncmFkZVwiIHRvIDQgaWYgbG93ZXIgdmFsdWUgaXMgdXNlZDpcclxuICAgICAgICAgICAgLy9odHRwOi8vd3d3LndoYXR3Zy5vcmcvc3BlY3Mvd2ViLWFwcHMvY3VycmVudC13b3JrL211bHRpcGFnZS90aW1lcnMuaHRtbCNkb20td2luZG93dGltZXJzLXNldHRpbWVvdXQ6XHJcbiAgICAgICAgICAgIC8vSWYgd2FudCBhIHZhbHVlIGltbWVkaWF0ZWx5LCB1c2UgcmVxdWlyZSgnaWQnKSBpbnN0ZWFkIC0tIHNvbWV0aGluZ1xyXG4gICAgICAgICAgICAvL3RoYXQgd29ya3MgaW4gYWxtb25kIG9uIHRoZSBnbG9iYWwgbGV2ZWwsIGJ1dCBub3QgZ3VhcmFudGVlZCBhbmRcclxuICAgICAgICAgICAgLy91bmxpa2VseSB0byB3b3JrIGluIG90aGVyIEFNRCBpbXBsZW1lbnRhdGlvbnMuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgbWFpbih1bmRlZiwgZGVwcywgY2FsbGJhY2ssIHJlbE5hbWUpO1xyXG4gICAgICAgICAgICB9LCA0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXE7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSnVzdCBkcm9wcyB0aGUgY29uZmlnIG9uIHRoZSBmbG9vciwgYnV0IHJldHVybnMgcmVxIGluIGNhc2VcclxuICAgICAqIHRoZSBjb25maWcgcmV0dXJuIHZhbHVlIGlzIHVzZWQuXHJcbiAgICAgKi9cclxuICAgIHJlcS5jb25maWcgPSBmdW5jdGlvbiAoY2ZnKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlcShjZmcpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEV4cG9zZSBtb2R1bGUgcmVnaXN0cnkgZm9yIGRlYnVnZ2luZyBhbmQgdG9vbGluZ1xyXG4gICAgICovXHJcbiAgICByZXF1aXJlanMuX2RlZmluZWQgPSBkZWZpbmVkO1xyXG5cclxuICAgIGRlZmluZSA9IGZ1bmN0aW9uIChuYW1lLCBkZXBzLCBjYWxsYmFjaykge1xyXG4gICAgICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTZWUgYWxtb25kIFJFQURNRTogaW5jb3JyZWN0IG1vZHVsZSBidWlsZCwgbm8gbW9kdWxlIG5hbWUnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vVGhpcyBtb2R1bGUgbWF5IG5vdCBoYXZlIGRlcGVuZGVuY2llc1xyXG4gICAgICAgIGlmICghZGVwcy5zcGxpY2UpIHtcclxuICAgICAgICAgICAgLy9kZXBzIGlzIG5vdCBhbiBhcnJheSwgc28gcHJvYmFibHkgbWVhbnNcclxuICAgICAgICAgICAgLy9hbiBvYmplY3QgbGl0ZXJhbCBvciBmYWN0b3J5IGZ1bmN0aW9uIGZvclxyXG4gICAgICAgICAgICAvL3RoZSB2YWx1ZS4gQWRqdXN0IGFyZ3MuXHJcbiAgICAgICAgICAgIGNhbGxiYWNrID0gZGVwcztcclxuICAgICAgICAgICAgZGVwcyA9IFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFoYXNQcm9wKGRlZmluZWQsIG5hbWUpICYmICFoYXNQcm9wKHdhaXRpbmcsIG5hbWUpKSB7XHJcbiAgICAgICAgICAgIHdhaXRpbmdbbmFtZV0gPSBbbmFtZSwgZGVwcywgY2FsbGJhY2tdO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgZGVmaW5lLmFtZCA9IHtcclxuICAgICAgICBqUXVlcnk6IHRydWVcclxuICAgIH07XHJcbn0oKSk7XHJcblxyXG5TMi5yZXF1aXJlanMgPSByZXF1aXJlanM7UzIucmVxdWlyZSA9IHJlcXVpcmU7UzIuZGVmaW5lID0gZGVmaW5lO1xyXG59XHJcbn0oKSk7XHJcblMyLmRlZmluZShcImFsbW9uZFwiLCBmdW5jdGlvbigpe30pO1xyXG5cclxuLyogZ2xvYmFsIGpRdWVyeTpmYWxzZSwgJDpmYWxzZSAqL1xyXG5TMi5kZWZpbmUoJ2pxdWVyeScsW10sZnVuY3Rpb24gKCkge1xyXG4gIHZhciBfJCA9IGpRdWVyeSB8fCAkO1xyXG5cclxuICBpZiAoXyQgPT0gbnVsbCAmJiBjb25zb2xlICYmIGNvbnNvbGUuZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXHJcbiAgICAgICdTZWxlY3QyOiBBbiBpbnN0YW5jZSBvZiBqUXVlcnkgb3IgYSBqUXVlcnktY29tcGF0aWJsZSBsaWJyYXJ5IHdhcyBub3QgJyArXHJcbiAgICAgICdmb3VuZC4gTWFrZSBzdXJlIHRoYXQgeW91IGFyZSBpbmNsdWRpbmcgalF1ZXJ5IGJlZm9yZSBTZWxlY3QyIG9uIHlvdXIgJyArXHJcbiAgICAgICd3ZWIgcGFnZS4nXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIF8kO1xyXG59KTtcclxuXHJcblMyLmRlZmluZSgnc2VsZWN0Mi91dGlscycsW1xyXG4gICdqcXVlcnknXHJcbl0sIGZ1bmN0aW9uICgkKSB7XHJcbiAgdmFyIFV0aWxzID0ge307XHJcblxyXG4gIFV0aWxzLkV4dGVuZCA9IGZ1bmN0aW9uIChDaGlsZENsYXNzLCBTdXBlckNsYXNzKSB7XHJcbiAgICB2YXIgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XHJcblxyXG4gICAgZnVuY3Rpb24gQmFzZUNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgdGhpcy5jb25zdHJ1Y3RvciA9IENoaWxkQ2xhc3M7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yICh2YXIga2V5IGluIFN1cGVyQ2xhc3MpIHtcclxuICAgICAgaWYgKF9faGFzUHJvcC5jYWxsKFN1cGVyQ2xhc3MsIGtleSkpIHtcclxuICAgICAgICBDaGlsZENsYXNzW2tleV0gPSBTdXBlckNsYXNzW2tleV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBCYXNlQ29uc3RydWN0b3IucHJvdG90eXBlID0gU3VwZXJDbGFzcy5wcm90b3R5cGU7XHJcbiAgICBDaGlsZENsYXNzLnByb3RvdHlwZSA9IG5ldyBCYXNlQ29uc3RydWN0b3IoKTtcclxuICAgIENoaWxkQ2xhc3MuX19zdXBlcl9fID0gU3VwZXJDbGFzcy5wcm90b3R5cGU7XHJcblxyXG4gICAgcmV0dXJuIENoaWxkQ2xhc3M7XHJcbiAgfTtcclxuXHJcbiAgZnVuY3Rpb24gZ2V0TWV0aG9kcyAodGhlQ2xhc3MpIHtcclxuICAgIHZhciBwcm90byA9IHRoZUNsYXNzLnByb3RvdHlwZTtcclxuXHJcbiAgICB2YXIgbWV0aG9kcyA9IFtdO1xyXG5cclxuICAgIGZvciAodmFyIG1ldGhvZE5hbWUgaW4gcHJvdG8pIHtcclxuICAgICAgdmFyIG0gPSBwcm90b1ttZXRob2ROYW1lXTtcclxuXHJcbiAgICAgIGlmICh0eXBlb2YgbSAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAobWV0aG9kTmFtZSA9PT0gJ2NvbnN0cnVjdG9yJykge1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBtZXRob2RzLnB1c2gobWV0aG9kTmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1ldGhvZHM7XHJcbiAgfVxyXG5cclxuICBVdGlscy5EZWNvcmF0ZSA9IGZ1bmN0aW9uIChTdXBlckNsYXNzLCBEZWNvcmF0b3JDbGFzcykge1xyXG4gICAgdmFyIGRlY29yYXRlZE1ldGhvZHMgPSBnZXRNZXRob2RzKERlY29yYXRvckNsYXNzKTtcclxuICAgIHZhciBzdXBlck1ldGhvZHMgPSBnZXRNZXRob2RzKFN1cGVyQ2xhc3MpO1xyXG5cclxuICAgIGZ1bmN0aW9uIERlY29yYXRlZENsYXNzICgpIHtcclxuICAgICAgdmFyIHVuc2hpZnQgPSBBcnJheS5wcm90b3R5cGUudW5zaGlmdDtcclxuXHJcbiAgICAgIHZhciBhcmdDb3VudCA9IERlY29yYXRvckNsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5sZW5ndGg7XHJcblxyXG4gICAgICB2YXIgY2FsbGVkQ29uc3RydWN0b3IgPSBTdXBlckNsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3RvcjtcclxuXHJcbiAgICAgIGlmIChhcmdDb3VudCA+IDApIHtcclxuICAgICAgICB1bnNoaWZ0LmNhbGwoYXJndW1lbnRzLCBTdXBlckNsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcik7XHJcblxyXG4gICAgICAgIGNhbGxlZENvbnN0cnVjdG9yID0gRGVjb3JhdG9yQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjYWxsZWRDb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgfVxyXG5cclxuICAgIERlY29yYXRvckNsYXNzLmRpc3BsYXlOYW1lID0gU3VwZXJDbGFzcy5kaXNwbGF5TmFtZTtcclxuXHJcbiAgICBmdW5jdGlvbiBjdHIgKCkge1xyXG4gICAgICB0aGlzLmNvbnN0cnVjdG9yID0gRGVjb3JhdGVkQ2xhc3M7XHJcbiAgICB9XHJcblxyXG4gICAgRGVjb3JhdGVkQ2xhc3MucHJvdG90eXBlID0gbmV3IGN0cigpO1xyXG5cclxuICAgIGZvciAodmFyIG0gPSAwOyBtIDwgc3VwZXJNZXRob2RzLmxlbmd0aDsgbSsrKSB7XHJcbiAgICAgICAgdmFyIHN1cGVyTWV0aG9kID0gc3VwZXJNZXRob2RzW21dO1xyXG5cclxuICAgICAgICBEZWNvcmF0ZWRDbGFzcy5wcm90b3R5cGVbc3VwZXJNZXRob2RdID1cclxuICAgICAgICAgIFN1cGVyQ2xhc3MucHJvdG90eXBlW3N1cGVyTWV0aG9kXTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgY2FsbGVkTWV0aG9kID0gZnVuY3Rpb24gKG1ldGhvZE5hbWUpIHtcclxuICAgICAgLy8gU3R1YiBvdXQgdGhlIG9yaWdpbmFsIG1ldGhvZCBpZiBpdCdzIG5vdCBkZWNvcmF0aW5nIGFuIGFjdHVhbCBtZXRob2RcclxuICAgICAgdmFyIG9yaWdpbmFsTWV0aG9kID0gZnVuY3Rpb24gKCkge307XHJcblxyXG4gICAgICBpZiAobWV0aG9kTmFtZSBpbiBEZWNvcmF0ZWRDbGFzcy5wcm90b3R5cGUpIHtcclxuICAgICAgICBvcmlnaW5hbE1ldGhvZCA9IERlY29yYXRlZENsYXNzLnByb3RvdHlwZVttZXRob2ROYW1lXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGRlY29yYXRlZE1ldGhvZCA9IERlY29yYXRvckNsYXNzLnByb3RvdHlwZVttZXRob2ROYW1lXTtcclxuXHJcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHVuc2hpZnQgPSBBcnJheS5wcm90b3R5cGUudW5zaGlmdDtcclxuXHJcbiAgICAgICAgdW5zaGlmdC5jYWxsKGFyZ3VtZW50cywgb3JpZ2luYWxNZXRob2QpO1xyXG5cclxuICAgICAgICByZXR1cm4gZGVjb3JhdGVkTWV0aG9kLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgIH07XHJcbiAgICB9O1xyXG5cclxuICAgIGZvciAodmFyIGQgPSAwOyBkIDwgZGVjb3JhdGVkTWV0aG9kcy5sZW5ndGg7IGQrKykge1xyXG4gICAgICB2YXIgZGVjb3JhdGVkTWV0aG9kID0gZGVjb3JhdGVkTWV0aG9kc1tkXTtcclxuXHJcbiAgICAgIERlY29yYXRlZENsYXNzLnByb3RvdHlwZVtkZWNvcmF0ZWRNZXRob2RdID0gY2FsbGVkTWV0aG9kKGRlY29yYXRlZE1ldGhvZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIERlY29yYXRlZENsYXNzO1xyXG4gIH07XHJcblxyXG4gIHZhciBPYnNlcnZhYmxlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5saXN0ZW5lcnMgPSB7fTtcclxuICB9O1xyXG5cclxuICBPYnNlcnZhYmxlLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIChldmVudCwgY2FsbGJhY2spIHtcclxuICAgIHRoaXMubGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnMgfHwge307XHJcblxyXG4gICAgaWYgKGV2ZW50IGluIHRoaXMubGlzdGVuZXJzKSB7XHJcbiAgICAgIHRoaXMubGlzdGVuZXJzW2V2ZW50XS5wdXNoKGNhbGxiYWNrKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubGlzdGVuZXJzW2V2ZW50XSA9IFtjYWxsYmFja107XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgT2JzZXJ2YWJsZS5wcm90b3R5cGUudHJpZ2dlciA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgdmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xyXG4gICAgdmFyIHBhcmFtcyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcclxuXHJcbiAgICB0aGlzLmxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzIHx8IHt9O1xyXG5cclxuICAgIC8vIFBhcmFtcyBzaG91bGQgYWx3YXlzIGNvbWUgaW4gYXMgYW4gYXJyYXlcclxuICAgIGlmIChwYXJhbXMgPT0gbnVsbCkge1xyXG4gICAgICBwYXJhbXMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBJZiB0aGVyZSBhcmUgbm8gYXJndW1lbnRzIHRvIHRoZSBldmVudCwgdXNlIGEgdGVtcG9yYXJ5IG9iamVjdFxyXG4gICAgaWYgKHBhcmFtcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgcGFyYW1zLnB1c2goe30pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFNldCB0aGUgYF90eXBlYCBvZiB0aGUgZmlyc3Qgb2JqZWN0IHRvIHRoZSBldmVudFxyXG4gICAgcGFyYW1zWzBdLl90eXBlID0gZXZlbnQ7XHJcblxyXG4gICAgaWYgKGV2ZW50IGluIHRoaXMubGlzdGVuZXJzKSB7XHJcbiAgICAgIHRoaXMuaW52b2tlKHRoaXMubGlzdGVuZXJzW2V2ZW50XSwgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJyonIGluIHRoaXMubGlzdGVuZXJzKSB7XHJcbiAgICAgIHRoaXMuaW52b2tlKHRoaXMubGlzdGVuZXJzWycqJ10sIGFyZ3VtZW50cyk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgT2JzZXJ2YWJsZS5wcm90b3R5cGUuaW52b2tlID0gZnVuY3Rpb24gKGxpc3RlbmVycywgcGFyYW1zKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBwYXJhbXMpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIFV0aWxzLk9ic2VydmFibGUgPSBPYnNlcnZhYmxlO1xyXG5cclxuICBVdGlscy5nZW5lcmF0ZUNoYXJzID0gZnVuY3Rpb24gKGxlbmd0aCkge1xyXG4gICAgdmFyIGNoYXJzID0gJyc7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgcmFuZG9tQ2hhciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDM2KTtcclxuICAgICAgY2hhcnMgKz0gcmFuZG9tQ2hhci50b1N0cmluZygzNik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNoYXJzO1xyXG4gIH07XHJcblxyXG4gIFV0aWxzLmJpbmQgPSBmdW5jdGlvbiAoZnVuYywgY29udGV4dCkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgZnVuYy5hcHBseShjb250ZXh0LCBhcmd1bWVudHMpO1xyXG4gICAgfTtcclxuICB9O1xyXG5cclxuICBVdGlscy5fY29udmVydERhdGEgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgZm9yICh2YXIgb3JpZ2luYWxLZXkgaW4gZGF0YSkge1xyXG4gICAgICB2YXIga2V5cyA9IG9yaWdpbmFsS2V5LnNwbGl0KCctJyk7XHJcblxyXG4gICAgICB2YXIgZGF0YUxldmVsID0gZGF0YTtcclxuXHJcbiAgICAgIGlmIChrZXlzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IGtleXMubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICB2YXIga2V5ID0ga2V5c1trXTtcclxuXHJcbiAgICAgICAgLy8gTG93ZXJjYXNlIHRoZSBmaXJzdCBsZXR0ZXJcclxuICAgICAgICAvLyBCeSBkZWZhdWx0LCBkYXNoLXNlcGFyYXRlZCBiZWNvbWVzIGNhbWVsQ2FzZVxyXG4gICAgICAgIGtleSA9IGtleS5zdWJzdHJpbmcoMCwgMSkudG9Mb3dlckNhc2UoKSArIGtleS5zdWJzdHJpbmcoMSk7XHJcblxyXG4gICAgICAgIGlmICghKGtleSBpbiBkYXRhTGV2ZWwpKSB7XHJcbiAgICAgICAgICBkYXRhTGV2ZWxba2V5XSA9IHt9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGsgPT0ga2V5cy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICBkYXRhTGV2ZWxba2V5XSA9IGRhdGFbb3JpZ2luYWxLZXldO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGF0YUxldmVsID0gZGF0YUxldmVsW2tleV07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRlbGV0ZSBkYXRhW29yaWdpbmFsS2V5XTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9O1xyXG5cclxuICBVdGlscy5oYXNTY3JvbGwgPSBmdW5jdGlvbiAoaW5kZXgsIGVsKSB7XHJcbiAgICAvLyBBZGFwdGVkIGZyb20gdGhlIGZ1bmN0aW9uIGNyZWF0ZWQgYnkgQFNoYWRvd1NjcmlwdGVyXHJcbiAgICAvLyBhbmQgYWRhcHRlZCBieSBAQmlsbEJhcnJ5IG9uIHRoZSBTdGFjayBFeGNoYW5nZSBDb2RlIFJldmlldyB3ZWJzaXRlLlxyXG4gICAgLy8gVGhlIG9yaWdpbmFsIGNvZGUgY2FuIGJlIGZvdW5kIGF0XHJcbiAgICAvLyBodHRwOi8vY29kZXJldmlldy5zdGFja2V4Y2hhbmdlLmNvbS9xLzEzMzM4XHJcbiAgICAvLyBhbmQgd2FzIGRlc2lnbmVkIHRvIGJlIHVzZWQgd2l0aCB0aGUgU2l6emxlIHNlbGVjdG9yIGVuZ2luZS5cclxuXHJcbiAgICB2YXIgJGVsID0gJChlbCk7XHJcbiAgICB2YXIgb3ZlcmZsb3dYID0gZWwuc3R5bGUub3ZlcmZsb3dYO1xyXG4gICAgdmFyIG92ZXJmbG93WSA9IGVsLnN0eWxlLm92ZXJmbG93WTtcclxuXHJcbiAgICAvL0NoZWNrIGJvdGggeCBhbmQgeSBkZWNsYXJhdGlvbnNcclxuICAgIGlmIChvdmVyZmxvd1ggPT09IG92ZXJmbG93WSAmJlxyXG4gICAgICAgIChvdmVyZmxvd1kgPT09ICdoaWRkZW4nIHx8IG92ZXJmbG93WSA9PT0gJ3Zpc2libGUnKSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG92ZXJmbG93WCA9PT0gJ3Njcm9sbCcgfHwgb3ZlcmZsb3dZID09PSAnc2Nyb2xsJykge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gKCRlbC5pbm5lckhlaWdodCgpIDwgZWwuc2Nyb2xsSGVpZ2h0IHx8XHJcbiAgICAgICRlbC5pbm5lcldpZHRoKCkgPCBlbC5zY3JvbGxXaWR0aCk7XHJcbiAgfTtcclxuXHJcbiAgVXRpbHMuZXNjYXBlTWFya3VwID0gZnVuY3Rpb24gKG1hcmt1cCkge1xyXG4gICAgdmFyIHJlcGxhY2VNYXAgPSB7XHJcbiAgICAgICdcXFxcJzogJyYjOTI7JyxcclxuICAgICAgJyYnOiAnJmFtcDsnLFxyXG4gICAgICAnPCc6ICcmbHQ7JyxcclxuICAgICAgJz4nOiAnJmd0OycsXHJcbiAgICAgICdcIic6ICcmcXVvdDsnLFxyXG4gICAgICAnXFwnJzogJyYjMzk7JyxcclxuICAgICAgJy8nOiAnJiM0NzsnXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIERvIG5vdCB0cnkgdG8gZXNjYXBlIHRoZSBtYXJrdXAgaWYgaXQncyBub3QgYSBzdHJpbmdcclxuICAgIGlmICh0eXBlb2YgbWFya3VwICE9PSAnc3RyaW5nJykge1xyXG4gICAgICByZXR1cm4gbWFya3VwO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBTdHJpbmcobWFya3VwKS5yZXBsYWNlKC9bJjw+XCInXFwvXFxcXF0vZywgZnVuY3Rpb24gKG1hdGNoKSB7XHJcbiAgICAgIHJldHVybiByZXBsYWNlTWFwW21hdGNoXTtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIC8vIEFwcGVuZCBhbiBhcnJheSBvZiBqUXVlcnkgbm9kZXMgdG8gYSBnaXZlbiBlbGVtZW50LlxyXG4gIFV0aWxzLmFwcGVuZE1hbnkgPSBmdW5jdGlvbiAoJGVsZW1lbnQsICRub2Rlcykge1xyXG4gICAgLy8galF1ZXJ5IDEuNy54IGRvZXMgbm90IHN1cHBvcnQgJC5mbi5hcHBlbmQoKSB3aXRoIGFuIGFycmF5XHJcbiAgICAvLyBGYWxsIGJhY2sgdG8gYSBqUXVlcnkgb2JqZWN0IGNvbGxlY3Rpb24gdXNpbmcgJC5mbi5hZGQoKVxyXG4gICAgaWYgKCQuZm4uanF1ZXJ5LnN1YnN0cigwLCAzKSA9PT0gJzEuNycpIHtcclxuICAgICAgdmFyICRqcU5vZGVzID0gJCgpO1xyXG5cclxuICAgICAgJC5tYXAoJG5vZGVzLCBmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgICAgICRqcU5vZGVzID0gJGpxTm9kZXMuYWRkKG5vZGUpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICRub2RlcyA9ICRqcU5vZGVzO1xyXG4gICAgfVxyXG5cclxuICAgICRlbGVtZW50LmFwcGVuZCgkbm9kZXMpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBVdGlscztcclxufSk7XHJcblxyXG5TMi5kZWZpbmUoJ3NlbGVjdDIvcmVzdWx0cycsW1xyXG4gICdqcXVlcnknLFxyXG4gICcuL3V0aWxzJ1xyXG5dLCBmdW5jdGlvbiAoJCwgVXRpbHMpIHtcclxuICBmdW5jdGlvbiBSZXN1bHRzICgkZWxlbWVudCwgb3B0aW9ucywgZGF0YUFkYXB0ZXIpIHtcclxuICAgIHRoaXMuJGVsZW1lbnQgPSAkZWxlbWVudDtcclxuICAgIHRoaXMuZGF0YSA9IGRhdGFBZGFwdGVyO1xyXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcclxuXHJcbiAgICBSZXN1bHRzLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgVXRpbHMuRXh0ZW5kKFJlc3VsdHMsIFV0aWxzLk9ic2VydmFibGUpO1xyXG5cclxuICBSZXN1bHRzLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgJHJlc3VsdHMgPSAkKFxyXG4gICAgICAnPHVsIGNsYXNzPVwic2VsZWN0Mi1yZXN1bHRzX19vcHRpb25zXCIgcm9sZT1cInRyZWVcIj48L3VsPidcclxuICAgICk7XHJcblxyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5nZXQoJ211bHRpcGxlJykpIHtcclxuICAgICAgJHJlc3VsdHMuYXR0cignYXJpYS1tdWx0aXNlbGVjdGFibGUnLCAndHJ1ZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuJHJlc3VsdHMgPSAkcmVzdWx0cztcclxuXHJcbiAgICByZXR1cm4gJHJlc3VsdHM7XHJcbiAgfTtcclxuXHJcbiAgUmVzdWx0cy5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLiRyZXN1bHRzLmVtcHR5KCk7XHJcbiAgfTtcclxuXHJcbiAgUmVzdWx0cy5wcm90b3R5cGUuZGlzcGxheU1lc3NhZ2UgPSBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICB2YXIgZXNjYXBlTWFya3VwID0gdGhpcy5vcHRpb25zLmdldCgnZXNjYXBlTWFya3VwJyk7XHJcblxyXG4gICAgdGhpcy5jbGVhcigpO1xyXG4gICAgdGhpcy5oaWRlTG9hZGluZygpO1xyXG5cclxuICAgIHZhciAkbWVzc2FnZSA9ICQoXHJcbiAgICAgICc8bGkgcm9sZT1cInRyZWVpdGVtXCIgYXJpYS1saXZlPVwiYXNzZXJ0aXZlXCInICtcclxuICAgICAgJyBjbGFzcz1cInNlbGVjdDItcmVzdWx0c19fb3B0aW9uXCI+PC9saT4nXHJcbiAgICApO1xyXG5cclxuICAgIHZhciBtZXNzYWdlID0gdGhpcy5vcHRpb25zLmdldCgndHJhbnNsYXRpb25zJykuZ2V0KHBhcmFtcy5tZXNzYWdlKTtcclxuXHJcbiAgICAkbWVzc2FnZS5hcHBlbmQoXHJcbiAgICAgIGVzY2FwZU1hcmt1cChcclxuICAgICAgICBtZXNzYWdlKHBhcmFtcy5hcmdzKVxyXG4gICAgICApXHJcbiAgICApO1xyXG5cclxuICAgICRtZXNzYWdlWzBdLmNsYXNzTmFtZSArPSAnIHNlbGVjdDItcmVzdWx0c19fbWVzc2FnZSc7XHJcblxyXG4gICAgdGhpcy4kcmVzdWx0cy5hcHBlbmQoJG1lc3NhZ2UpO1xyXG4gIH07XHJcblxyXG4gIFJlc3VsdHMucHJvdG90eXBlLmhpZGVNZXNzYWdlcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuJHJlc3VsdHMuZmluZCgnLnNlbGVjdDItcmVzdWx0c19fbWVzc2FnZScpLnJlbW92ZSgpO1xyXG4gIH07XHJcblxyXG4gIFJlc3VsdHMucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICB0aGlzLmhpZGVMb2FkaW5nKCk7XHJcblxyXG4gICAgdmFyICRvcHRpb25zID0gW107XHJcblxyXG4gICAgaWYgKGRhdGEucmVzdWx0cyA9PSBudWxsIHx8IGRhdGEucmVzdWx0cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgaWYgKHRoaXMuJHJlc3VsdHMuY2hpbGRyZW4oKS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICB0aGlzLnRyaWdnZXIoJ3Jlc3VsdHM6bWVzc2FnZScsIHtcclxuICAgICAgICAgIG1lc3NhZ2U6ICdub1Jlc3VsdHMnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBkYXRhLnJlc3VsdHMgPSB0aGlzLnNvcnQoZGF0YS5yZXN1bHRzKTtcclxuXHJcbiAgICBmb3IgKHZhciBkID0gMDsgZCA8IGRhdGEucmVzdWx0cy5sZW5ndGg7IGQrKykge1xyXG4gICAgICB2YXIgaXRlbSA9IGRhdGEucmVzdWx0c1tkXTtcclxuXHJcbiAgICAgIHZhciAkb3B0aW9uID0gdGhpcy5vcHRpb24oaXRlbSk7XHJcblxyXG4gICAgICAkb3B0aW9ucy5wdXNoKCRvcHRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuJHJlc3VsdHMuYXBwZW5kKCRvcHRpb25zKTtcclxuICB9O1xyXG5cclxuICBSZXN1bHRzLnByb3RvdHlwZS5wb3NpdGlvbiA9IGZ1bmN0aW9uICgkcmVzdWx0cywgJGRyb3Bkb3duKSB7XHJcbiAgICB2YXIgJHJlc3VsdHNDb250YWluZXIgPSAkZHJvcGRvd24uZmluZCgnLnNlbGVjdDItcmVzdWx0cycpO1xyXG4gICAgJHJlc3VsdHNDb250YWluZXIuYXBwZW5kKCRyZXN1bHRzKTtcclxuICB9O1xyXG5cclxuICBSZXN1bHRzLnByb3RvdHlwZS5zb3J0ID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgIHZhciBzb3J0ZXIgPSB0aGlzLm9wdGlvbnMuZ2V0KCdzb3J0ZXInKTtcclxuXHJcbiAgICByZXR1cm4gc29ydGVyKGRhdGEpO1xyXG4gIH07XHJcblxyXG4gIFJlc3VsdHMucHJvdG90eXBlLmhpZ2hsaWdodEZpcnN0SXRlbSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciAkb3B0aW9ucyA9IHRoaXMuJHJlc3VsdHNcclxuICAgICAgLmZpbmQoJy5zZWxlY3QyLXJlc3VsdHNfX29wdGlvblthcmlhLXNlbGVjdGVkXScpO1xyXG5cclxuICAgIHZhciAkc2VsZWN0ZWQgPSAkb3B0aW9ucy5maWx0ZXIoJ1thcmlhLXNlbGVjdGVkPXRydWVdJyk7XHJcblxyXG4gICAgLy8gQ2hlY2sgaWYgdGhlcmUgYXJlIGFueSBzZWxlY3RlZCBvcHRpb25zXHJcbiAgICBpZiAoJHNlbGVjdGVkLmxlbmd0aCA+IDApIHtcclxuICAgICAgLy8gSWYgdGhlcmUgYXJlIHNlbGVjdGVkIG9wdGlvbnMsIGhpZ2hsaWdodCB0aGUgZmlyc3RcclxuICAgICAgJHNlbGVjdGVkLmZpcnN0KCkudHJpZ2dlcignbW91c2VlbnRlcicpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIHNlbGVjdGVkIG9wdGlvbnMsIGhpZ2hsaWdodCB0aGUgZmlyc3Qgb3B0aW9uXHJcbiAgICAgIC8vIGluIHRoZSBkcm9wZG93blxyXG4gICAgICAkb3B0aW9ucy5maXJzdCgpLnRyaWdnZXIoJ21vdXNlZW50ZXInKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmVuc3VyZUhpZ2hsaWdodFZpc2libGUoKTtcclxuICB9O1xyXG5cclxuICBSZXN1bHRzLnByb3RvdHlwZS5zZXRDbGFzc2VzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHRoaXMuZGF0YS5jdXJyZW50KGZ1bmN0aW9uIChzZWxlY3RlZCkge1xyXG4gICAgICB2YXIgc2VsZWN0ZWRJZHMgPSAkLm1hcChzZWxlY3RlZCwgZnVuY3Rpb24gKHMpIHtcclxuICAgICAgICByZXR1cm4gcy5pZC50b1N0cmluZygpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHZhciAkb3B0aW9ucyA9IHNlbGYuJHJlc3VsdHNcclxuICAgICAgICAuZmluZCgnLnNlbGVjdDItcmVzdWx0c19fb3B0aW9uW2FyaWEtc2VsZWN0ZWRdJyk7XHJcblxyXG4gICAgICAkb3B0aW9ucy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgJG9wdGlvbiA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgIHZhciBpdGVtID0gJC5kYXRhKHRoaXMsICdkYXRhJyk7XHJcblxyXG4gICAgICAgIC8vIGlkIG5lZWRzIHRvIGJlIGNvbnZlcnRlZCB0byBhIHN0cmluZyB3aGVuIGNvbXBhcmluZ1xyXG4gICAgICAgIHZhciBpZCA9ICcnICsgaXRlbS5pZDtcclxuXHJcbiAgICAgICAgaWYgKChpdGVtLmVsZW1lbnQgIT0gbnVsbCAmJiBpdGVtLmVsZW1lbnQuc2VsZWN0ZWQpIHx8XHJcbiAgICAgICAgICAgIChpdGVtLmVsZW1lbnQgPT0gbnVsbCAmJiAkLmluQXJyYXkoaWQsIHNlbGVjdGVkSWRzKSA+IC0xKSkge1xyXG4gICAgICAgICAgJG9wdGlvbi5hdHRyKCdhcmlhLXNlbGVjdGVkJywgJ3RydWUnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJG9wdGlvbi5hdHRyKCdhcmlhLXNlbGVjdGVkJywgJ2ZhbHNlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBSZXN1bHRzLnByb3RvdHlwZS5zaG93TG9hZGluZyA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgIHRoaXMuaGlkZUxvYWRpbmcoKTtcclxuXHJcbiAgICB2YXIgbG9hZGluZ01vcmUgPSB0aGlzLm9wdGlvbnMuZ2V0KCd0cmFuc2xhdGlvbnMnKS5nZXQoJ3NlYXJjaGluZycpO1xyXG5cclxuICAgIHZhciBsb2FkaW5nID0ge1xyXG4gICAgICBkaXNhYmxlZDogdHJ1ZSxcclxuICAgICAgbG9hZGluZzogdHJ1ZSxcclxuICAgICAgdGV4dDogbG9hZGluZ01vcmUocGFyYW1zKVxyXG4gICAgfTtcclxuICAgIHZhciAkbG9hZGluZyA9IHRoaXMub3B0aW9uKGxvYWRpbmcpO1xyXG4gICAgJGxvYWRpbmcuY2xhc3NOYW1lICs9ICcgbG9hZGluZy1yZXN1bHRzJztcclxuXHJcbiAgICB0aGlzLiRyZXN1bHRzLnByZXBlbmQoJGxvYWRpbmcpO1xyXG4gIH07XHJcblxyXG4gIFJlc3VsdHMucHJvdG90eXBlLmhpZGVMb2FkaW5nID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy4kcmVzdWx0cy5maW5kKCcubG9hZGluZy1yZXN1bHRzJykucmVtb3ZlKCk7XHJcbiAgfTtcclxuXHJcbiAgUmVzdWx0cy5wcm90b3R5cGUub3B0aW9uID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgIHZhciBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xyXG4gICAgb3B0aW9uLmNsYXNzTmFtZSA9ICdzZWxlY3QyLXJlc3VsdHNfX29wdGlvbic7XHJcblxyXG4gICAgdmFyIGF0dHJzID0ge1xyXG4gICAgICAncm9sZSc6ICd0cmVlaXRlbScsXHJcbiAgICAgICdhcmlhLXNlbGVjdGVkJzogJ2ZhbHNlJ1xyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoZGF0YS5kaXNhYmxlZCkge1xyXG4gICAgICBkZWxldGUgYXR0cnNbJ2FyaWEtc2VsZWN0ZWQnXTtcclxuICAgICAgYXR0cnNbJ2FyaWEtZGlzYWJsZWQnXSA9ICd0cnVlJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZGF0YS5pZCA9PSBudWxsKSB7XHJcbiAgICAgIGRlbGV0ZSBhdHRyc1snYXJpYS1zZWxlY3RlZCddO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkYXRhLl9yZXN1bHRJZCAhPSBudWxsKSB7XHJcbiAgICAgIG9wdGlvbi5pZCA9IGRhdGEuX3Jlc3VsdElkO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkYXRhLnRpdGxlKSB7XHJcbiAgICAgIG9wdGlvbi50aXRsZSA9IGRhdGEudGl0bGU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRhdGEuY2hpbGRyZW4pIHtcclxuICAgICAgYXR0cnMucm9sZSA9ICdncm91cCc7XHJcbiAgICAgIGF0dHJzWydhcmlhLWxhYmVsJ10gPSBkYXRhLnRleHQ7XHJcbiAgICAgIGRlbGV0ZSBhdHRyc1snYXJpYS1zZWxlY3RlZCddO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAodmFyIGF0dHIgaW4gYXR0cnMpIHtcclxuICAgICAgdmFyIHZhbCA9IGF0dHJzW2F0dHJdO1xyXG5cclxuICAgICAgb3B0aW9uLnNldEF0dHJpYnV0ZShhdHRyLCB2YWwpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkYXRhLmNoaWxkcmVuKSB7XHJcbiAgICAgIHZhciAkb3B0aW9uID0gJChvcHRpb24pO1xyXG5cclxuICAgICAgdmFyIGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3Ryb25nJyk7XHJcbiAgICAgIGxhYmVsLmNsYXNzTmFtZSA9ICdzZWxlY3QyLXJlc3VsdHNfX2dyb3VwJztcclxuXHJcbiAgICAgIHZhciAkbGFiZWwgPSAkKGxhYmVsKTtcclxuICAgICAgdGhpcy50ZW1wbGF0ZShkYXRhLCBsYWJlbCk7XHJcblxyXG4gICAgICB2YXIgJGNoaWxkcmVuID0gW107XHJcblxyXG4gICAgICBmb3IgKHZhciBjID0gMDsgYyA8IGRhdGEuY2hpbGRyZW4ubGVuZ3RoOyBjKyspIHtcclxuICAgICAgICB2YXIgY2hpbGQgPSBkYXRhLmNoaWxkcmVuW2NdO1xyXG5cclxuICAgICAgICB2YXIgJGNoaWxkID0gdGhpcy5vcHRpb24oY2hpbGQpO1xyXG5cclxuICAgICAgICAkY2hpbGRyZW4ucHVzaCgkY2hpbGQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgJGNoaWxkcmVuQ29udGFpbmVyID0gJCgnPHVsPjwvdWw+Jywge1xyXG4gICAgICAgICdjbGFzcyc6ICdzZWxlY3QyLXJlc3VsdHNfX29wdGlvbnMgc2VsZWN0Mi1yZXN1bHRzX19vcHRpb25zLS1uZXN0ZWQnXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgJGNoaWxkcmVuQ29udGFpbmVyLmFwcGVuZCgkY2hpbGRyZW4pO1xyXG5cclxuICAgICAgJG9wdGlvbi5hcHBlbmQobGFiZWwpO1xyXG4gICAgICAkb3B0aW9uLmFwcGVuZCgkY2hpbGRyZW5Db250YWluZXIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy50ZW1wbGF0ZShkYXRhLCBvcHRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgICQuZGF0YShvcHRpb24sICdkYXRhJywgZGF0YSk7XHJcblxyXG4gICAgcmV0dXJuIG9wdGlvbjtcclxuICB9O1xyXG5cclxuICBSZXN1bHRzLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHZhciBpZCA9IGNvbnRhaW5lci5pZCArICctcmVzdWx0cyc7XHJcblxyXG4gICAgdGhpcy4kcmVzdWx0cy5hdHRyKCdpZCcsIGlkKTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ3Jlc3VsdHM6YWxsJywgZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICBzZWxmLmNsZWFyKCk7XHJcbiAgICAgIHNlbGYuYXBwZW5kKHBhcmFtcy5kYXRhKTtcclxuXHJcbiAgICAgIGlmIChjb250YWluZXIuaXNPcGVuKCkpIHtcclxuICAgICAgICBzZWxmLnNldENsYXNzZXMoKTtcclxuICAgICAgICBzZWxmLmhpZ2hsaWdodEZpcnN0SXRlbSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ3Jlc3VsdHM6YXBwZW5kJywgZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICBzZWxmLmFwcGVuZChwYXJhbXMuZGF0YSk7XHJcblxyXG4gICAgICBpZiAoY29udGFpbmVyLmlzT3BlbigpKSB7XHJcbiAgICAgICAgc2VsZi5zZXRDbGFzc2VzKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRhaW5lci5vbigncXVlcnknLCBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgIHNlbGYuaGlkZU1lc3NhZ2VzKCk7XHJcbiAgICAgIHNlbGYuc2hvd0xvYWRpbmcocGFyYW1zKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRhaW5lci5vbignc2VsZWN0JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoIWNvbnRhaW5lci5pc09wZW4oKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2VsZi5zZXRDbGFzc2VzKCk7XHJcbiAgICAgIHNlbGYuaGlnaGxpZ2h0Rmlyc3RJdGVtKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ3Vuc2VsZWN0JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoIWNvbnRhaW5lci5pc09wZW4oKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2VsZi5zZXRDbGFzc2VzKCk7XHJcbiAgICAgIHNlbGYuaGlnaGxpZ2h0Rmlyc3RJdGVtKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ29wZW4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIC8vIFdoZW4gdGhlIGRyb3Bkb3duIGlzIG9wZW4sIGFyaWEtZXhwZW5kZWQ9XCJ0cnVlXCJcclxuICAgICAgc2VsZi4kcmVzdWx0cy5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcclxuICAgICAgc2VsZi4kcmVzdWx0cy5hdHRyKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG5cclxuICAgICAgc2VsZi5zZXRDbGFzc2VzKCk7XHJcbiAgICAgIHNlbGYuZW5zdXJlSGlnaGxpZ2h0VmlzaWJsZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29udGFpbmVyLm9uKCdjbG9zZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgLy8gV2hlbiB0aGUgZHJvcGRvd24gaXMgY2xvc2VkLCBhcmlhLWV4cGVuZGVkPVwiZmFsc2VcIlxyXG4gICAgICBzZWxmLiRyZXN1bHRzLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcclxuICAgICAgc2VsZi4kcmVzdWx0cy5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcbiAgICAgIHNlbGYuJHJlc3VsdHMucmVtb3ZlQXR0cignYXJpYS1hY3RpdmVkZXNjZW5kYW50Jyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ3Jlc3VsdHM6dG9nZ2xlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgJGhpZ2hsaWdodGVkID0gc2VsZi5nZXRIaWdobGlnaHRlZFJlc3VsdHMoKTtcclxuXHJcbiAgICAgIGlmICgkaGlnaGxpZ2h0ZWQubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkaGlnaGxpZ2h0ZWQudHJpZ2dlcignbW91c2V1cCcpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29udGFpbmVyLm9uKCdyZXN1bHRzOnNlbGVjdCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyICRoaWdobGlnaHRlZCA9IHNlbGYuZ2V0SGlnaGxpZ2h0ZWRSZXN1bHRzKCk7XHJcblxyXG4gICAgICBpZiAoJGhpZ2hsaWdodGVkLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGRhdGEgPSAkaGlnaGxpZ2h0ZWQuZGF0YSgnZGF0YScpO1xyXG5cclxuICAgICAgaWYgKCRoaWdobGlnaHRlZC5hdHRyKCdhcmlhLXNlbGVjdGVkJykgPT0gJ3RydWUnKSB7XHJcbiAgICAgICAgc2VsZi50cmlnZ2VyKCdjbG9zZScsIHt9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzZWxmLnRyaWdnZXIoJ3NlbGVjdCcsIHtcclxuICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29udGFpbmVyLm9uKCdyZXN1bHRzOnByZXZpb3VzJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgJGhpZ2hsaWdodGVkID0gc2VsZi5nZXRIaWdobGlnaHRlZFJlc3VsdHMoKTtcclxuXHJcbiAgICAgIHZhciAkb3B0aW9ucyA9IHNlbGYuJHJlc3VsdHMuZmluZCgnW2FyaWEtc2VsZWN0ZWRdJyk7XHJcblxyXG4gICAgICB2YXIgY3VycmVudEluZGV4ID0gJG9wdGlvbnMuaW5kZXgoJGhpZ2hsaWdodGVkKTtcclxuXHJcbiAgICAgIC8vIElmIHdlIGFyZSBhbHJlYWR5IGF0IHRlIHRvcCwgZG9uJ3QgbW92ZSBmdXJ0aGVyXHJcbiAgICAgIGlmIChjdXJyZW50SW5kZXggPT09IDApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBuZXh0SW5kZXggPSBjdXJyZW50SW5kZXggLSAxO1xyXG5cclxuICAgICAgLy8gSWYgbm9uZSBhcmUgaGlnaGxpZ2h0ZWQsIGhpZ2hsaWdodCB0aGUgZmlyc3RcclxuICAgICAgaWYgKCRoaWdobGlnaHRlZC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBuZXh0SW5kZXggPSAwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgJG5leHQgPSAkb3B0aW9ucy5lcShuZXh0SW5kZXgpO1xyXG5cclxuICAgICAgJG5leHQudHJpZ2dlcignbW91c2VlbnRlcicpO1xyXG5cclxuICAgICAgdmFyIGN1cnJlbnRPZmZzZXQgPSBzZWxmLiRyZXN1bHRzLm9mZnNldCgpLnRvcDtcclxuICAgICAgdmFyIG5leHRUb3AgPSAkbmV4dC5vZmZzZXQoKS50b3A7XHJcbiAgICAgIHZhciBuZXh0T2Zmc2V0ID0gc2VsZi4kcmVzdWx0cy5zY3JvbGxUb3AoKSArIChuZXh0VG9wIC0gY3VycmVudE9mZnNldCk7XHJcblxyXG4gICAgICBpZiAobmV4dEluZGV4ID09PSAwKSB7XHJcbiAgICAgICAgc2VsZi4kcmVzdWx0cy5zY3JvbGxUb3AoMCk7XHJcbiAgICAgIH0gZWxzZSBpZiAobmV4dFRvcCAtIGN1cnJlbnRPZmZzZXQgPCAwKSB7XHJcbiAgICAgICAgc2VsZi4kcmVzdWx0cy5zY3JvbGxUb3AobmV4dE9mZnNldCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRhaW5lci5vbigncmVzdWx0czpuZXh0JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgJGhpZ2hsaWdodGVkID0gc2VsZi5nZXRIaWdobGlnaHRlZFJlc3VsdHMoKTtcclxuXHJcbiAgICAgIHZhciAkb3B0aW9ucyA9IHNlbGYuJHJlc3VsdHMuZmluZCgnW2FyaWEtc2VsZWN0ZWRdJyk7XHJcblxyXG4gICAgICB2YXIgY3VycmVudEluZGV4ID0gJG9wdGlvbnMuaW5kZXgoJGhpZ2hsaWdodGVkKTtcclxuXHJcbiAgICAgIHZhciBuZXh0SW5kZXggPSBjdXJyZW50SW5kZXggKyAxO1xyXG5cclxuICAgICAgLy8gSWYgd2UgYXJlIGF0IHRoZSBsYXN0IG9wdGlvbiwgc3RheSB0aGVyZVxyXG4gICAgICBpZiAobmV4dEluZGV4ID49ICRvcHRpb25zLmxlbmd0aCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyICRuZXh0ID0gJG9wdGlvbnMuZXEobmV4dEluZGV4KTtcclxuXHJcbiAgICAgICRuZXh0LnRyaWdnZXIoJ21vdXNlZW50ZXInKTtcclxuXHJcbiAgICAgIHZhciBjdXJyZW50T2Zmc2V0ID0gc2VsZi4kcmVzdWx0cy5vZmZzZXQoKS50b3AgK1xyXG4gICAgICAgIHNlbGYuJHJlc3VsdHMub3V0ZXJIZWlnaHQoZmFsc2UpO1xyXG4gICAgICB2YXIgbmV4dEJvdHRvbSA9ICRuZXh0Lm9mZnNldCgpLnRvcCArICRuZXh0Lm91dGVySGVpZ2h0KGZhbHNlKTtcclxuICAgICAgdmFyIG5leHRPZmZzZXQgPSBzZWxmLiRyZXN1bHRzLnNjcm9sbFRvcCgpICsgbmV4dEJvdHRvbSAtIGN1cnJlbnRPZmZzZXQ7XHJcblxyXG4gICAgICBpZiAobmV4dEluZGV4ID09PSAwKSB7XHJcbiAgICAgICAgc2VsZi4kcmVzdWx0cy5zY3JvbGxUb3AoMCk7XHJcbiAgICAgIH0gZWxzZSBpZiAobmV4dEJvdHRvbSA+IGN1cnJlbnRPZmZzZXQpIHtcclxuICAgICAgICBzZWxmLiRyZXN1bHRzLnNjcm9sbFRvcChuZXh0T2Zmc2V0KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29udGFpbmVyLm9uKCdyZXN1bHRzOmZvY3VzJywgZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICBwYXJhbXMuZWxlbWVudC5hZGRDbGFzcygnc2VsZWN0Mi1yZXN1bHRzX19vcHRpb24tLWhpZ2hsaWdodGVkJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ3Jlc3VsdHM6bWVzc2FnZScsIGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgc2VsZi5kaXNwbGF5TWVzc2FnZShwYXJhbXMpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKCQuZm4ubW91c2V3aGVlbCkge1xyXG4gICAgICB0aGlzLiRyZXN1bHRzLm9uKCdtb3VzZXdoZWVsJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICB2YXIgdG9wID0gc2VsZi4kcmVzdWx0cy5zY3JvbGxUb3AoKTtcclxuXHJcbiAgICAgICAgdmFyIGJvdHRvbSA9IHNlbGYuJHJlc3VsdHMuZ2V0KDApLnNjcm9sbEhlaWdodCAtIHRvcCArIGUuZGVsdGFZO1xyXG5cclxuICAgICAgICB2YXIgaXNBdFRvcCA9IGUuZGVsdGFZID4gMCAmJiB0b3AgLSBlLmRlbHRhWSA8PSAwO1xyXG4gICAgICAgIHZhciBpc0F0Qm90dG9tID0gZS5kZWx0YVkgPCAwICYmIGJvdHRvbSA8PSBzZWxmLiRyZXN1bHRzLmhlaWdodCgpO1xyXG5cclxuICAgICAgICBpZiAoaXNBdFRvcCkge1xyXG4gICAgICAgICAgc2VsZi4kcmVzdWx0cy5zY3JvbGxUb3AoMCk7XHJcblxyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGlzQXRCb3R0b20pIHtcclxuICAgICAgICAgIHNlbGYuJHJlc3VsdHMuc2Nyb2xsVG9wKFxyXG4gICAgICAgICAgICBzZWxmLiRyZXN1bHRzLmdldCgwKS5zY3JvbGxIZWlnaHQgLSBzZWxmLiRyZXN1bHRzLmhlaWdodCgpXHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiRyZXN1bHRzLm9uKCdtb3VzZXVwJywgJy5zZWxlY3QyLXJlc3VsdHNfX29wdGlvblthcmlhLXNlbGVjdGVkXScsXHJcbiAgICAgIGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHJcbiAgICAgIHZhciBkYXRhID0gJHRoaXMuZGF0YSgnZGF0YScpO1xyXG5cclxuICAgICAgaWYgKCR0aGlzLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnKSA9PT0gJ3RydWUnKSB7XHJcbiAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5nZXQoJ211bHRpcGxlJykpIHtcclxuICAgICAgICAgIHNlbGYudHJpZ2dlcigndW5zZWxlY3QnLCB7XHJcbiAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dCxcclxuICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHNlbGYudHJpZ2dlcignY2xvc2UnLCB7fSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNlbGYudHJpZ2dlcignc2VsZWN0Jywge1xyXG4gICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2dCxcclxuICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy4kcmVzdWx0cy5vbignbW91c2VlbnRlcicsICcuc2VsZWN0Mi1yZXN1bHRzX19vcHRpb25bYXJpYS1zZWxlY3RlZF0nLFxyXG4gICAgICBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgIHZhciBkYXRhID0gJCh0aGlzKS5kYXRhKCdkYXRhJyk7XHJcblxyXG4gICAgICBzZWxmLmdldEhpZ2hsaWdodGVkUmVzdWx0cygpXHJcbiAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NlbGVjdDItcmVzdWx0c19fb3B0aW9uLS1oaWdobGlnaHRlZCcpO1xyXG5cclxuICAgICAgc2VsZi50cmlnZ2VyKCdyZXN1bHRzOmZvY3VzJywge1xyXG4gICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgZWxlbWVudDogJCh0aGlzKVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIFJlc3VsdHMucHJvdG90eXBlLmdldEhpZ2hsaWdodGVkUmVzdWx0cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciAkaGlnaGxpZ2h0ZWQgPSB0aGlzLiRyZXN1bHRzXHJcbiAgICAuZmluZCgnLnNlbGVjdDItcmVzdWx0c19fb3B0aW9uLS1oaWdobGlnaHRlZCcpO1xyXG5cclxuICAgIHJldHVybiAkaGlnaGxpZ2h0ZWQ7XHJcbiAgfTtcclxuXHJcbiAgUmVzdWx0cy5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuJHJlc3VsdHMucmVtb3ZlKCk7XHJcbiAgfTtcclxuXHJcbiAgUmVzdWx0cy5wcm90b3R5cGUuZW5zdXJlSGlnaGxpZ2h0VmlzaWJsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciAkaGlnaGxpZ2h0ZWQgPSB0aGlzLmdldEhpZ2hsaWdodGVkUmVzdWx0cygpO1xyXG5cclxuICAgIGlmICgkaGlnaGxpZ2h0ZWQubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgJG9wdGlvbnMgPSB0aGlzLiRyZXN1bHRzLmZpbmQoJ1thcmlhLXNlbGVjdGVkXScpO1xyXG5cclxuICAgIHZhciBjdXJyZW50SW5kZXggPSAkb3B0aW9ucy5pbmRleCgkaGlnaGxpZ2h0ZWQpO1xyXG5cclxuICAgIHZhciBjdXJyZW50T2Zmc2V0ID0gdGhpcy4kcmVzdWx0cy5vZmZzZXQoKS50b3A7XHJcbiAgICB2YXIgbmV4dFRvcCA9ICRoaWdobGlnaHRlZC5vZmZzZXQoKS50b3A7XHJcbiAgICB2YXIgbmV4dE9mZnNldCA9IHRoaXMuJHJlc3VsdHMuc2Nyb2xsVG9wKCkgKyAobmV4dFRvcCAtIGN1cnJlbnRPZmZzZXQpO1xyXG5cclxuICAgIHZhciBvZmZzZXREZWx0YSA9IG5leHRUb3AgLSBjdXJyZW50T2Zmc2V0O1xyXG4gICAgbmV4dE9mZnNldCAtPSAkaGlnaGxpZ2h0ZWQub3V0ZXJIZWlnaHQoZmFsc2UpICogMjtcclxuXHJcbiAgICBpZiAoY3VycmVudEluZGV4IDw9IDIpIHtcclxuICAgICAgdGhpcy4kcmVzdWx0cy5zY3JvbGxUb3AoMCk7XHJcbiAgICB9IGVsc2UgaWYgKG9mZnNldERlbHRhID4gdGhpcy4kcmVzdWx0cy5vdXRlckhlaWdodCgpIHx8IG9mZnNldERlbHRhIDwgMCkge1xyXG4gICAgICB0aGlzLiRyZXN1bHRzLnNjcm9sbFRvcChuZXh0T2Zmc2V0KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBSZXN1bHRzLnByb3RvdHlwZS50ZW1wbGF0ZSA9IGZ1bmN0aW9uIChyZXN1bHQsIGNvbnRhaW5lcikge1xyXG4gICAgdmFyIHRlbXBsYXRlID0gdGhpcy5vcHRpb25zLmdldCgndGVtcGxhdGVSZXN1bHQnKTtcclxuICAgIHZhciBlc2NhcGVNYXJrdXAgPSB0aGlzLm9wdGlvbnMuZ2V0KCdlc2NhcGVNYXJrdXAnKTtcclxuXHJcbiAgICB2YXIgY29udGVudCA9IHRlbXBsYXRlKHJlc3VsdCwgY29udGFpbmVyKTtcclxuXHJcbiAgICBpZiAoY29udGVudCA9PSBudWxsKSB7XHJcbiAgICAgIGNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9IGVzY2FwZU1hcmt1cChjb250ZW50KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQoY29udGFpbmVyKS5hcHBlbmQoY29udGVudCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIFJlc3VsdHM7XHJcbn0pO1xyXG5cclxuUzIuZGVmaW5lKCdzZWxlY3QyL2tleXMnLFtcclxuXHJcbl0sIGZ1bmN0aW9uICgpIHtcclxuICB2YXIgS0VZUyA9IHtcclxuICAgIEJBQ0tTUEFDRTogOCxcclxuICAgIFRBQjogOSxcclxuICAgIEVOVEVSOiAxMyxcclxuICAgIFNISUZUOiAxNixcclxuICAgIENUUkw6IDE3LFxyXG4gICAgQUxUOiAxOCxcclxuICAgIEVTQzogMjcsXHJcbiAgICBTUEFDRTogMzIsXHJcbiAgICBQQUdFX1VQOiAzMyxcclxuICAgIFBBR0VfRE9XTjogMzQsXHJcbiAgICBFTkQ6IDM1LFxyXG4gICAgSE9NRTogMzYsXHJcbiAgICBMRUZUOiAzNyxcclxuICAgIFVQOiAzOCxcclxuICAgIFJJR0hUOiAzOSxcclxuICAgIERPV046IDQwLFxyXG4gICAgREVMRVRFOiA0NlxyXG4gIH07XHJcblxyXG4gIHJldHVybiBLRVlTO1xyXG59KTtcclxuXHJcblMyLmRlZmluZSgnc2VsZWN0Mi9zZWxlY3Rpb24vYmFzZScsW1xyXG4gICdqcXVlcnknLFxyXG4gICcuLi91dGlscycsXHJcbiAgJy4uL2tleXMnXHJcbl0sIGZ1bmN0aW9uICgkLCBVdGlscywgS0VZUykge1xyXG4gIGZ1bmN0aW9uIEJhc2VTZWxlY3Rpb24gKCRlbGVtZW50LCBvcHRpb25zKSB7XHJcbiAgICB0aGlzLiRlbGVtZW50ID0gJGVsZW1lbnQ7XHJcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xyXG5cclxuICAgIEJhc2VTZWxlY3Rpb24uX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcyk7XHJcbiAgfVxyXG5cclxuICBVdGlscy5FeHRlbmQoQmFzZVNlbGVjdGlvbiwgVXRpbHMuT2JzZXJ2YWJsZSk7XHJcblxyXG4gIEJhc2VTZWxlY3Rpb24ucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciAkc2VsZWN0aW9uID0gJChcclxuICAgICAgJzxzcGFuIGNsYXNzPVwic2VsZWN0Mi1zZWxlY3Rpb25cIiByb2xlPVwiY29tYm9ib3hcIiAnICtcclxuICAgICAgJyBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiPicgK1xyXG4gICAgICAnPC9zcGFuPidcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5fdGFiaW5kZXggPSAwO1xyXG5cclxuICAgIGlmICh0aGlzLiRlbGVtZW50LmRhdGEoJ29sZC10YWJpbmRleCcpICE9IG51bGwpIHtcclxuICAgICAgdGhpcy5fdGFiaW5kZXggPSB0aGlzLiRlbGVtZW50LmRhdGEoJ29sZC10YWJpbmRleCcpO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLiRlbGVtZW50LmF0dHIoJ3RhYmluZGV4JykgIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLl90YWJpbmRleCA9IHRoaXMuJGVsZW1lbnQuYXR0cigndGFiaW5kZXgnKTtcclxuICAgIH1cclxuXHJcbiAgICAkc2VsZWN0aW9uLmF0dHIoJ3RpdGxlJywgdGhpcy4kZWxlbWVudC5hdHRyKCd0aXRsZScpKTtcclxuICAgICRzZWxlY3Rpb24uYXR0cigndGFiaW5kZXgnLCB0aGlzLl90YWJpbmRleCk7XHJcblxyXG4gICAgdGhpcy4kc2VsZWN0aW9uID0gJHNlbGVjdGlvbjtcclxuXHJcbiAgICByZXR1cm4gJHNlbGVjdGlvbjtcclxuICB9O1xyXG5cclxuICBCYXNlU2VsZWN0aW9uLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHZhciBpZCA9IGNvbnRhaW5lci5pZCArICctY29udGFpbmVyJztcclxuICAgIHZhciByZXN1bHRzSWQgPSBjb250YWluZXIuaWQgKyAnLXJlc3VsdHMnO1xyXG5cclxuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG5cclxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbignZm9jdXMnLCBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgIHNlbGYudHJpZ2dlcignZm9jdXMnLCBldnQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy4kc2VsZWN0aW9uLm9uKCdibHVyJywgZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICBzZWxmLl9oYW5kbGVCbHVyKGV2dCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLiRzZWxlY3Rpb24ub24oJ2tleWRvd24nLCBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgIHNlbGYudHJpZ2dlcigna2V5cHJlc3MnLCBldnQpO1xyXG5cclxuICAgICAgaWYgKGV2dC53aGljaCA9PT0gS0VZUy5TUEFDRSkge1xyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ3Jlc3VsdHM6Zm9jdXMnLCBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgIHNlbGYuJHNlbGVjdGlvbi5hdHRyKCdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnLCBwYXJhbXMuZGF0YS5fcmVzdWx0SWQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29udGFpbmVyLm9uKCdzZWxlY3Rpb246dXBkYXRlJywgZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICBzZWxmLnVwZGF0ZShwYXJhbXMuZGF0YSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ29wZW4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIC8vIFdoZW4gdGhlIGRyb3Bkb3duIGlzIG9wZW4sIGFyaWEtZXhwYW5kZWQ9XCJ0cnVlXCJcclxuICAgICAgc2VsZi4kc2VsZWN0aW9uLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xyXG4gICAgICBzZWxmLiRzZWxlY3Rpb24uYXR0cignYXJpYS1vd25zJywgcmVzdWx0c0lkKTtcclxuXHJcbiAgICAgIHNlbGYuX2F0dGFjaENsb3NlSGFuZGxlcihjb250YWluZXIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29udGFpbmVyLm9uKCdjbG9zZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgLy8gV2hlbiB0aGUgZHJvcGRvd24gaXMgY2xvc2VkLCBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIlxyXG4gICAgICBzZWxmLiRzZWxlY3Rpb24uYXR0cignYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xyXG4gICAgICBzZWxmLiRzZWxlY3Rpb24ucmVtb3ZlQXR0cignYXJpYS1hY3RpdmVkZXNjZW5kYW50Jyk7XHJcbiAgICAgIHNlbGYuJHNlbGVjdGlvbi5yZW1vdmVBdHRyKCdhcmlhLW93bnMnKTtcclxuXHJcbiAgICAgIHNlbGYuJHNlbGVjdGlvbi5mb2N1cygpO1xyXG5cclxuICAgICAgc2VsZi5fZGV0YWNoQ2xvc2VIYW5kbGVyKGNvbnRhaW5lcik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ2VuYWJsZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgc2VsZi4kc2VsZWN0aW9uLmF0dHIoJ3RhYmluZGV4Jywgc2VsZi5fdGFiaW5kZXgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29udGFpbmVyLm9uKCdkaXNhYmxlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICBzZWxmLiRzZWxlY3Rpb24uYXR0cigndGFiaW5kZXgnLCAnLTEnKTtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIEJhc2VTZWxlY3Rpb24ucHJvdG90eXBlLl9oYW5kbGVCbHVyID0gZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIC8vIFRoaXMgbmVlZHMgdG8gYmUgZGVsYXllZCBhcyB0aGUgYWN0aXZlIGVsZW1lbnQgaXMgdGhlIGJvZHkgd2hlbiB0aGUgdGFiXHJcbiAgICAvLyBrZXkgaXMgcHJlc3NlZCwgcG9zc2libHkgYWxvbmcgd2l0aCBvdGhlcnMuXHJcbiAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIC8vIERvbid0IHRyaWdnZXIgYGJsdXJgIGlmIHRoZSBmb2N1cyBpcyBzdGlsbCBpbiB0aGUgc2VsZWN0aW9uXHJcbiAgICAgIGlmIChcclxuICAgICAgICAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PSBzZWxmLiRzZWxlY3Rpb25bMF0pIHx8XHJcbiAgICAgICAgKCQuY29udGFpbnMoc2VsZi4kc2VsZWN0aW9uWzBdLCBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSlcclxuICAgICAgKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzZWxmLnRyaWdnZXIoJ2JsdXInLCBldnQpO1xyXG4gICAgfSwgMSk7XHJcbiAgfTtcclxuXHJcbiAgQmFzZVNlbGVjdGlvbi5wcm90b3R5cGUuX2F0dGFjaENsb3NlSGFuZGxlciA9IGZ1bmN0aW9uIChjb250YWluZXIpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAkKGRvY3VtZW50LmJvZHkpLm9uKCdtb3VzZWRvd24uc2VsZWN0Mi4nICsgY29udGFpbmVyLmlkLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICB2YXIgJHRhcmdldCA9ICQoZS50YXJnZXQpO1xyXG5cclxuICAgICAgdmFyICRzZWxlY3QgPSAkdGFyZ2V0LmNsb3Nlc3QoJy5zZWxlY3QyJyk7XHJcblxyXG4gICAgICB2YXIgJGFsbCA9ICQoJy5zZWxlY3QyLnNlbGVjdDItY29udGFpbmVyLS1vcGVuJyk7XHJcblxyXG4gICAgICAkYWxsLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzID09ICRzZWxlY3RbMF0pIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciAkZWxlbWVudCA9ICR0aGlzLmRhdGEoJ2VsZW1lbnQnKTtcclxuXHJcbiAgICAgICAgJGVsZW1lbnQuc2VsZWN0MignY2xvc2UnKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBCYXNlU2VsZWN0aW9uLnByb3RvdHlwZS5fZGV0YWNoQ2xvc2VIYW5kbGVyID0gZnVuY3Rpb24gKGNvbnRhaW5lcikge1xyXG4gICAgJChkb2N1bWVudC5ib2R5KS5vZmYoJ21vdXNlZG93bi5zZWxlY3QyLicgKyBjb250YWluZXIuaWQpO1xyXG4gIH07XHJcblxyXG4gIEJhc2VTZWxlY3Rpb24ucHJvdG90eXBlLnBvc2l0aW9uID0gZnVuY3Rpb24gKCRzZWxlY3Rpb24sICRjb250YWluZXIpIHtcclxuICAgIHZhciAkc2VsZWN0aW9uQ29udGFpbmVyID0gJGNvbnRhaW5lci5maW5kKCcuc2VsZWN0aW9uJyk7XHJcbiAgICAkc2VsZWN0aW9uQ29udGFpbmVyLmFwcGVuZCgkc2VsZWN0aW9uKTtcclxuICB9O1xyXG5cclxuICBCYXNlU2VsZWN0aW9uLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5fZGV0YWNoQ2xvc2VIYW5kbGVyKHRoaXMuY29udGFpbmVyKTtcclxuICB9O1xyXG5cclxuICBCYXNlU2VsZWN0aW9uLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgYHVwZGF0ZWAgbWV0aG9kIG11c3QgYmUgZGVmaW5lZCBpbiBjaGlsZCBjbGFzc2VzLicpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBCYXNlU2VsZWN0aW9uO1xyXG59KTtcclxuXHJcblMyLmRlZmluZSgnc2VsZWN0Mi9zZWxlY3Rpb24vc2luZ2xlJyxbXHJcbiAgJ2pxdWVyeScsXHJcbiAgJy4vYmFzZScsXHJcbiAgJy4uL3V0aWxzJyxcclxuICAnLi4va2V5cydcclxuXSwgZnVuY3Rpb24gKCQsIEJhc2VTZWxlY3Rpb24sIFV0aWxzLCBLRVlTKSB7XHJcbiAgZnVuY3Rpb24gU2luZ2xlU2VsZWN0aW9uICgpIHtcclxuICAgIFNpbmdsZVNlbGVjdGlvbi5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICB9XHJcblxyXG4gIFV0aWxzLkV4dGVuZChTaW5nbGVTZWxlY3Rpb24sIEJhc2VTZWxlY3Rpb24pO1xyXG5cclxuICBTaW5nbGVTZWxlY3Rpb24ucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciAkc2VsZWN0aW9uID0gU2luZ2xlU2VsZWN0aW9uLl9fc3VwZXJfXy5yZW5kZXIuY2FsbCh0aGlzKTtcclxuXHJcbiAgICAkc2VsZWN0aW9uLmFkZENsYXNzKCdzZWxlY3QyLXNlbGVjdGlvbi0tc2luZ2xlJyk7XHJcblxyXG4gICAgJHNlbGVjdGlvbi5odG1sKFxyXG4gICAgICAnPHNwYW4gY2xhc3M9XCJzZWxlY3QyLXNlbGVjdGlvbl9fcmVuZGVyZWRcIj48L3NwYW4+JyArXHJcbiAgICAgICc8c3BhbiBjbGFzcz1cInNlbGVjdDItc2VsZWN0aW9uX19hcnJvd1wiIHJvbGU9XCJwcmVzZW50YXRpb25cIj4nICtcclxuICAgICAgICAnPGIgcm9sZT1cInByZXNlbnRhdGlvblwiPjwvYj4nICtcclxuICAgICAgJzwvc3Bhbj4nXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiAkc2VsZWN0aW9uO1xyXG4gIH07XHJcblxyXG4gIFNpbmdsZVNlbGVjdGlvbi5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChjb250YWluZXIsICRjb250YWluZXIpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICBTaW5nbGVTZWxlY3Rpb24uX19zdXBlcl9fLmJpbmQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHJcbiAgICB2YXIgaWQgPSBjb250YWluZXIuaWQgKyAnLWNvbnRhaW5lcic7XHJcblxyXG4gICAgdGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fcmVuZGVyZWQnKS5hdHRyKCdpZCcsIGlkKTtcclxuICAgIHRoaXMuJHNlbGVjdGlvbi5hdHRyKCdhcmlhLWxhYmVsbGVkYnknLCBpZCk7XHJcblxyXG4gICAgdGhpcy4kc2VsZWN0aW9uLm9uKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgIC8vIE9ubHkgcmVzcG9uZCB0byBsZWZ0IGNsaWNrc1xyXG4gICAgICBpZiAoZXZ0LndoaWNoICE9PSAxKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzZWxmLnRyaWdnZXIoJ3RvZ2dsZScsIHtcclxuICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnRcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLiRzZWxlY3Rpb24ub24oJ2ZvY3VzJywgZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICAvLyBVc2VyIGZvY3VzZXMgb24gdGhlIGNvbnRhaW5lclxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy4kc2VsZWN0aW9uLm9uKCdibHVyJywgZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICAvLyBVc2VyIGV4aXRzIHRoZSBjb250YWluZXJcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRhaW5lci5vbignZm9jdXMnLCBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgIGlmICghY29udGFpbmVyLmlzT3BlbigpKSB7XHJcbiAgICAgICAgc2VsZi4kc2VsZWN0aW9uLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRhaW5lci5vbignc2VsZWN0aW9uOnVwZGF0ZScsIGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgc2VsZi51cGRhdGUocGFyYW1zLmRhdGEpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgU2luZ2xlU2VsZWN0aW9uLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuJHNlbGVjdGlvbi5maW5kKCcuc2VsZWN0Mi1zZWxlY3Rpb25fX3JlbmRlcmVkJykuZW1wdHkoKTtcclxuICB9O1xyXG5cclxuICBTaW5nbGVTZWxlY3Rpb24ucHJvdG90eXBlLmRpc3BsYXkgPSBmdW5jdGlvbiAoZGF0YSwgY29udGFpbmVyKSB7XHJcbiAgICB2YXIgdGVtcGxhdGUgPSB0aGlzLm9wdGlvbnMuZ2V0KCd0ZW1wbGF0ZVNlbGVjdGlvbicpO1xyXG4gICAgdmFyIGVzY2FwZU1hcmt1cCA9IHRoaXMub3B0aW9ucy5nZXQoJ2VzY2FwZU1hcmt1cCcpO1xyXG5cclxuICAgIHJldHVybiBlc2NhcGVNYXJrdXAodGVtcGxhdGUoZGF0YSwgY29udGFpbmVyKSk7XHJcbiAgfTtcclxuXHJcbiAgU2luZ2xlU2VsZWN0aW9uLnByb3RvdHlwZS5zZWxlY3Rpb25Db250YWluZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gJCgnPHNwYW4+PC9zcGFuPicpO1xyXG4gIH07XHJcblxyXG4gIFNpbmdsZVNlbGVjdGlvbi5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgc2VsZWN0aW9uID0gZGF0YVswXTtcclxuXHJcbiAgICB2YXIgJHJlbmRlcmVkID0gdGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fcmVuZGVyZWQnKTtcclxuICAgIHZhciBmb3JtYXR0ZWQgPSB0aGlzLmRpc3BsYXkoc2VsZWN0aW9uLCAkcmVuZGVyZWQpO1xyXG5cclxuICAgICRyZW5kZXJlZC5lbXB0eSgpLmFwcGVuZChmb3JtYXR0ZWQpO1xyXG4gICAgJHJlbmRlcmVkLnByb3AoJ3RpdGxlJywgc2VsZWN0aW9uLnRpdGxlIHx8IHNlbGVjdGlvbi50ZXh0KTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gU2luZ2xlU2VsZWN0aW9uO1xyXG59KTtcclxuXHJcblMyLmRlZmluZSgnc2VsZWN0Mi9zZWxlY3Rpb24vbXVsdGlwbGUnLFtcclxuICAnanF1ZXJ5JyxcclxuICAnLi9iYXNlJyxcclxuICAnLi4vdXRpbHMnXHJcbl0sIGZ1bmN0aW9uICgkLCBCYXNlU2VsZWN0aW9uLCBVdGlscykge1xyXG4gIGZ1bmN0aW9uIE11bHRpcGxlU2VsZWN0aW9uICgkZWxlbWVudCwgb3B0aW9ucykge1xyXG4gICAgTXVsdGlwbGVTZWxlY3Rpb24uX19zdXBlcl9fLmNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgfVxyXG5cclxuICBVdGlscy5FeHRlbmQoTXVsdGlwbGVTZWxlY3Rpb24sIEJhc2VTZWxlY3Rpb24pO1xyXG5cclxuICBNdWx0aXBsZVNlbGVjdGlvbi5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyICRzZWxlY3Rpb24gPSBNdWx0aXBsZVNlbGVjdGlvbi5fX3N1cGVyX18ucmVuZGVyLmNhbGwodGhpcyk7XHJcblxyXG4gICAgJHNlbGVjdGlvbi5hZGRDbGFzcygnc2VsZWN0Mi1zZWxlY3Rpb24tLW11bHRpcGxlJyk7XHJcblxyXG4gICAgJHNlbGVjdGlvbi5odG1sKFxyXG4gICAgICAnPHVsIGNsYXNzPVwic2VsZWN0Mi1zZWxlY3Rpb25fX3JlbmRlcmVkXCI+PC91bD4nXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiAkc2VsZWN0aW9uO1xyXG4gIH07XHJcblxyXG4gIE11bHRpcGxlU2VsZWN0aW9uLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIE11bHRpcGxlU2VsZWN0aW9uLl9fc3VwZXJfXy5iaW5kLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblxyXG4gICAgdGhpcy4kc2VsZWN0aW9uLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgc2VsZi50cmlnZ2VyKCd0b2dnbGUnLCB7XHJcbiAgICAgICAgb3JpZ2luYWxFdmVudDogZXZ0XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy4kc2VsZWN0aW9uLm9uKFxyXG4gICAgICAnY2xpY2snLFxyXG4gICAgICAnLnNlbGVjdDItc2VsZWN0aW9uX19jaG9pY2VfX3JlbW92ZScsXHJcbiAgICAgIGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgICAvLyBJZ25vcmUgdGhlIGV2ZW50IGlmIGl0IGlzIGRpc2FibGVkXHJcbiAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5nZXQoJ2Rpc2FibGVkJykpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciAkcmVtb3ZlID0gJCh0aGlzKTtcclxuICAgICAgICB2YXIgJHNlbGVjdGlvbiA9ICRyZW1vdmUucGFyZW50KCk7XHJcblxyXG4gICAgICAgIHZhciBkYXRhID0gJHNlbGVjdGlvbi5kYXRhKCdkYXRhJyk7XHJcblxyXG4gICAgICAgIHNlbGYudHJpZ2dlcigndW5zZWxlY3QnLCB7XHJcbiAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldnQsXHJcbiAgICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgfTtcclxuXHJcbiAgTXVsdGlwbGVTZWxlY3Rpb24ucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fcmVuZGVyZWQnKS5lbXB0eSgpO1xyXG4gIH07XHJcblxyXG4gIE11bHRpcGxlU2VsZWN0aW9uLnByb3RvdHlwZS5kaXNwbGF5ID0gZnVuY3Rpb24gKGRhdGEsIGNvbnRhaW5lcikge1xyXG4gICAgdmFyIHRlbXBsYXRlID0gdGhpcy5vcHRpb25zLmdldCgndGVtcGxhdGVTZWxlY3Rpb24nKTtcclxuICAgIHZhciBlc2NhcGVNYXJrdXAgPSB0aGlzLm9wdGlvbnMuZ2V0KCdlc2NhcGVNYXJrdXAnKTtcclxuXHJcbiAgICByZXR1cm4gZXNjYXBlTWFya3VwKHRlbXBsYXRlKGRhdGEsIGNvbnRhaW5lcikpO1xyXG4gIH07XHJcblxyXG4gIE11bHRpcGxlU2VsZWN0aW9uLnByb3RvdHlwZS5zZWxlY3Rpb25Db250YWluZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgJGNvbnRhaW5lciA9ICQoXHJcbiAgICAgICc8bGkgY2xhc3M9XCJzZWxlY3QyLXNlbGVjdGlvbl9fY2hvaWNlXCI+JyArXHJcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwic2VsZWN0Mi1zZWxlY3Rpb25fX2Nob2ljZV9fcmVtb3ZlXCIgcm9sZT1cInByZXNlbnRhdGlvblwiPicgK1xyXG4gICAgICAgICAgJyZ0aW1lczsnICtcclxuICAgICAgICAnPC9zcGFuPicgK1xyXG4gICAgICAnPC9saT4nXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiAkY29udGFpbmVyO1xyXG4gIH07XHJcblxyXG4gIE11bHRpcGxlU2VsZWN0aW9uLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgdGhpcy5jbGVhcigpO1xyXG5cclxuICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdmFyICRzZWxlY3Rpb25zID0gW107XHJcblxyXG4gICAgZm9yICh2YXIgZCA9IDA7IGQgPCBkYXRhLmxlbmd0aDsgZCsrKSB7XHJcbiAgICAgIHZhciBzZWxlY3Rpb24gPSBkYXRhW2RdO1xyXG5cclxuICAgICAgdmFyICRzZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvbkNvbnRhaW5lcigpO1xyXG4gICAgICB2YXIgZm9ybWF0dGVkID0gdGhpcy5kaXNwbGF5KHNlbGVjdGlvbiwgJHNlbGVjdGlvbik7XHJcblxyXG4gICAgICAkc2VsZWN0aW9uLmFwcGVuZChmb3JtYXR0ZWQpO1xyXG4gICAgICAkc2VsZWN0aW9uLnByb3AoJ3RpdGxlJywgc2VsZWN0aW9uLnRpdGxlIHx8IHNlbGVjdGlvbi50ZXh0KTtcclxuXHJcbiAgICAgICRzZWxlY3Rpb24uZGF0YSgnZGF0YScsIHNlbGVjdGlvbik7XHJcblxyXG4gICAgICAkc2VsZWN0aW9ucy5wdXNoKCRzZWxlY3Rpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciAkcmVuZGVyZWQgPSB0aGlzLiRzZWxlY3Rpb24uZmluZCgnLnNlbGVjdDItc2VsZWN0aW9uX19yZW5kZXJlZCcpO1xyXG5cclxuICAgIFV0aWxzLmFwcGVuZE1hbnkoJHJlbmRlcmVkLCAkc2VsZWN0aW9ucyk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIE11bHRpcGxlU2VsZWN0aW9uO1xyXG59KTtcclxuXHJcblMyLmRlZmluZSgnc2VsZWN0Mi9zZWxlY3Rpb24vcGxhY2Vob2xkZXInLFtcclxuICAnLi4vdXRpbHMnXHJcbl0sIGZ1bmN0aW9uIChVdGlscykge1xyXG4gIGZ1bmN0aW9uIFBsYWNlaG9sZGVyIChkZWNvcmF0ZWQsICRlbGVtZW50LCBvcHRpb25zKSB7XHJcbiAgICB0aGlzLnBsYWNlaG9sZGVyID0gdGhpcy5ub3JtYWxpemVQbGFjZWhvbGRlcihvcHRpb25zLmdldCgncGxhY2Vob2xkZXInKSk7XHJcblxyXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgJGVsZW1lbnQsIG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgUGxhY2Vob2xkZXIucHJvdG90eXBlLm5vcm1hbGl6ZVBsYWNlaG9sZGVyID0gZnVuY3Rpb24gKF8sIHBsYWNlaG9sZGVyKSB7XHJcbiAgICBpZiAodHlwZW9mIHBsYWNlaG9sZGVyID09PSAnc3RyaW5nJykge1xyXG4gICAgICBwbGFjZWhvbGRlciA9IHtcclxuICAgICAgICBpZDogJycsXHJcbiAgICAgICAgdGV4dDogcGxhY2Vob2xkZXJcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGxhY2Vob2xkZXI7XHJcbiAgfTtcclxuXHJcbiAgUGxhY2Vob2xkZXIucHJvdG90eXBlLmNyZWF0ZVBsYWNlaG9sZGVyID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgcGxhY2Vob2xkZXIpIHtcclxuICAgIHZhciAkcGxhY2Vob2xkZXIgPSB0aGlzLnNlbGVjdGlvbkNvbnRhaW5lcigpO1xyXG5cclxuICAgICRwbGFjZWhvbGRlci5odG1sKHRoaXMuZGlzcGxheShwbGFjZWhvbGRlcikpO1xyXG4gICAgJHBsYWNlaG9sZGVyLmFkZENsYXNzKCdzZWxlY3QyLXNlbGVjdGlvbl9fcGxhY2Vob2xkZXInKVxyXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdzZWxlY3QyLXNlbGVjdGlvbl9fY2hvaWNlJyk7XHJcblxyXG4gICAgcmV0dXJuICRwbGFjZWhvbGRlcjtcclxuICB9O1xyXG5cclxuICBQbGFjZWhvbGRlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgZGF0YSkge1xyXG4gICAgdmFyIHNpbmdsZVBsYWNlaG9sZGVyID0gKFxyXG4gICAgICBkYXRhLmxlbmd0aCA9PSAxICYmIGRhdGFbMF0uaWQgIT0gdGhpcy5wbGFjZWhvbGRlci5pZFxyXG4gICAgKTtcclxuICAgIHZhciBtdWx0aXBsZVNlbGVjdGlvbnMgPSBkYXRhLmxlbmd0aCA+IDE7XHJcblxyXG4gICAgaWYgKG11bHRpcGxlU2VsZWN0aW9ucyB8fCBzaW5nbGVQbGFjZWhvbGRlcikge1xyXG4gICAgICByZXR1cm4gZGVjb3JhdGVkLmNhbGwodGhpcywgZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jbGVhcigpO1xyXG5cclxuICAgIHZhciAkcGxhY2Vob2xkZXIgPSB0aGlzLmNyZWF0ZVBsYWNlaG9sZGVyKHRoaXMucGxhY2Vob2xkZXIpO1xyXG5cclxuICAgIHRoaXMuJHNlbGVjdGlvbi5maW5kKCcuc2VsZWN0Mi1zZWxlY3Rpb25fX3JlbmRlcmVkJykuYXBwZW5kKCRwbGFjZWhvbGRlcik7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIFBsYWNlaG9sZGVyO1xyXG59KTtcclxuXHJcblMyLmRlZmluZSgnc2VsZWN0Mi9zZWxlY3Rpb24vYWxsb3dDbGVhcicsW1xyXG4gICdqcXVlcnknLFxyXG4gICcuLi9rZXlzJ1xyXG5dLCBmdW5jdGlvbiAoJCwgS0VZUykge1xyXG4gIGZ1bmN0aW9uIEFsbG93Q2xlYXIgKCkgeyB9XHJcblxyXG4gIEFsbG93Q2xlYXIucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBjb250YWluZXIsICRjb250YWluZXIpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBjb250YWluZXIsICRjb250YWluZXIpO1xyXG5cclxuICAgIGlmICh0aGlzLnBsYWNlaG9sZGVyID09IG51bGwpIHtcclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5nZXQoJ2RlYnVnJykgJiYgd2luZG93LmNvbnNvbGUgJiYgY29uc29sZS5lcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXHJcbiAgICAgICAgICAnU2VsZWN0MjogVGhlIGBhbGxvd0NsZWFyYCBvcHRpb24gc2hvdWxkIGJlIHVzZWQgaW4gY29tYmluYXRpb24gJyArXHJcbiAgICAgICAgICAnd2l0aCB0aGUgYHBsYWNlaG9sZGVyYCBvcHRpb24uJ1xyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiRzZWxlY3Rpb24ub24oJ21vdXNlZG93bicsICcuc2VsZWN0Mi1zZWxlY3Rpb25fX2NsZWFyJyxcclxuICAgICAgZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICAgIHNlbGYuX2hhbmRsZUNsZWFyKGV2dCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ2tleXByZXNzJywgZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICBzZWxmLl9oYW5kbGVLZXlib2FyZENsZWFyKGV2dCwgY29udGFpbmVyKTtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIEFsbG93Q2xlYXIucHJvdG90eXBlLl9oYW5kbGVDbGVhciA9IGZ1bmN0aW9uIChfLCBldnQpIHtcclxuICAgIC8vIElnbm9yZSB0aGUgZXZlbnQgaWYgaXQgaXMgZGlzYWJsZWRcclxuICAgIGlmICh0aGlzLm9wdGlvbnMuZ2V0KCdkaXNhYmxlZCcpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgJGNsZWFyID0gdGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fY2xlYXInKTtcclxuXHJcbiAgICAvLyBJZ25vcmUgdGhlIGV2ZW50IGlmIG5vdGhpbmcgaGFzIGJlZW4gc2VsZWN0ZWRcclxuICAgIGlmICgkY2xlYXIubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgdmFyIGRhdGEgPSAkY2xlYXIuZGF0YSgnZGF0YScpO1xyXG5cclxuICAgIGZvciAodmFyIGQgPSAwOyBkIDwgZGF0YS5sZW5ndGg7IGQrKykge1xyXG4gICAgICB2YXIgdW5zZWxlY3REYXRhID0ge1xyXG4gICAgICAgIGRhdGE6IGRhdGFbZF1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIFRyaWdnZXIgdGhlIGB1bnNlbGVjdGAgZXZlbnQsIHNvIHBlb3BsZSBjYW4gcHJldmVudCBpdCBmcm9tIGJlaW5nXHJcbiAgICAgIC8vIGNsZWFyZWQuXHJcbiAgICAgIHRoaXMudHJpZ2dlcigndW5zZWxlY3QnLCB1bnNlbGVjdERhdGEpO1xyXG5cclxuICAgICAgLy8gSWYgdGhlIGV2ZW50IHdhcyBwcmV2ZW50ZWQsIGRvbid0IGNsZWFyIGl0IG91dC5cclxuICAgICAgaWYgKHVuc2VsZWN0RGF0YS5wcmV2ZW50ZWQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiRlbGVtZW50LnZhbCh0aGlzLnBsYWNlaG9sZGVyLmlkKS50cmlnZ2VyKCdjaGFuZ2UnKTtcclxuXHJcbiAgICB0aGlzLnRyaWdnZXIoJ3RvZ2dsZScsIHt9KTtcclxuICB9O1xyXG5cclxuICBBbGxvd0NsZWFyLnByb3RvdHlwZS5faGFuZGxlS2V5Ym9hcmRDbGVhciA9IGZ1bmN0aW9uIChfLCBldnQsIGNvbnRhaW5lcikge1xyXG4gICAgaWYgKGNvbnRhaW5lci5pc09wZW4oKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGV2dC53aGljaCA9PSBLRVlTLkRFTEVURSB8fCBldnQud2hpY2ggPT0gS0VZUy5CQUNLU1BBQ0UpIHtcclxuICAgICAgdGhpcy5faGFuZGxlQ2xlYXIoZXZ0KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBBbGxvd0NsZWFyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBkYXRhKSB7XHJcbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBkYXRhKTtcclxuXHJcbiAgICBpZiAodGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fcGxhY2Vob2xkZXInKS5sZW5ndGggPiAwIHx8XHJcbiAgICAgICAgZGF0YS5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciAkcmVtb3ZlID0gJChcclxuICAgICAgJzxzcGFuIGNsYXNzPVwic2VsZWN0Mi1zZWxlY3Rpb25fX2NsZWFyXCI+JyArXHJcbiAgICAgICAgJyZ0aW1lczsnICtcclxuICAgICAgJzwvc3Bhbj4nXHJcbiAgICApO1xyXG4gICAgJHJlbW92ZS5kYXRhKCdkYXRhJywgZGF0YSk7XHJcblxyXG4gICAgdGhpcy4kc2VsZWN0aW9uLmZpbmQoJy5zZWxlY3QyLXNlbGVjdGlvbl9fcmVuZGVyZWQnKS5wcmVwZW5kKCRyZW1vdmUpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBBbGxvd0NsZWFyO1xyXG59KTtcclxuXHJcblMyLmRlZmluZSgnc2VsZWN0Mi9zZWxlY3Rpb24vc2VhcmNoJyxbXHJcbiAgJ2pxdWVyeScsXHJcbiAgJy4uL3V0aWxzJyxcclxuICAnLi4va2V5cydcclxuXSwgZnVuY3Rpb24gKCQsIFV0aWxzLCBLRVlTKSB7XHJcbiAgZnVuY3Rpb24gU2VhcmNoIChkZWNvcmF0ZWQsICRlbGVtZW50LCBvcHRpb25zKSB7XHJcbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCAkZWxlbWVudCwgb3B0aW9ucyk7XHJcbiAgfVxyXG5cclxuICBTZWFyY2gucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQpIHtcclxuICAgIHZhciAkc2VhcmNoID0gJChcclxuICAgICAgJzxsaSBjbGFzcz1cInNlbGVjdDItc2VhcmNoIHNlbGVjdDItc2VhcmNoLS1pbmxpbmVcIj4nICtcclxuICAgICAgICAnPGlucHV0IGNsYXNzPVwic2VsZWN0Mi1zZWFyY2hfX2ZpZWxkXCIgdHlwZT1cInNlYXJjaFwiIHRhYmluZGV4PVwiLTFcIicgK1xyXG4gICAgICAgICcgYXV0b2NvbXBsZXRlPVwib2ZmXCIgYXV0b2NvcnJlY3Q9XCJvZmZcIiBhdXRvY2FwaXRhbGl6ZT1cIm9mZlwiJyArXHJcbiAgICAgICAgJyBzcGVsbGNoZWNrPVwiZmFsc2VcIiByb2xlPVwidGV4dGJveFwiIGFyaWEtYXV0b2NvbXBsZXRlPVwibGlzdFwiIC8+JyArXHJcbiAgICAgICc8L2xpPidcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy4kc2VhcmNoQ29udGFpbmVyID0gJHNlYXJjaDtcclxuICAgIHRoaXMuJHNlYXJjaCA9ICRzZWFyY2guZmluZCgnaW5wdXQnKTtcclxuXHJcbiAgICB2YXIgJHJlbmRlcmVkID0gZGVjb3JhdGVkLmNhbGwodGhpcyk7XHJcblxyXG4gICAgdGhpcy5fdHJhbnNmZXJUYWJJbmRleCgpO1xyXG5cclxuICAgIHJldHVybiAkcmVuZGVyZWQ7XHJcbiAgfTtcclxuXHJcbiAgU2VhcmNoLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgY29udGFpbmVyLCAkY29udGFpbmVyKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgY29udGFpbmVyLCAkY29udGFpbmVyKTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ29wZW4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHNlbGYuJHNlYXJjaC50cmlnZ2VyKCdmb2N1cycpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29udGFpbmVyLm9uKCdjbG9zZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgc2VsZi4kc2VhcmNoLnZhbCgnJyk7XHJcbiAgICAgIHNlbGYuJHNlYXJjaC5yZW1vdmVBdHRyKCdhcmlhLWFjdGl2ZWRlc2NlbmRhbnQnKTtcclxuICAgICAgc2VsZi4kc2VhcmNoLnRyaWdnZXIoJ2ZvY3VzJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ2VuYWJsZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgc2VsZi4kc2VhcmNoLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xyXG5cclxuICAgICAgc2VsZi5fdHJhbnNmZXJUYWJJbmRleCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29udGFpbmVyLm9uKCdkaXNhYmxlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICBzZWxmLiRzZWFyY2gucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRhaW5lci5vbignZm9jdXMnLCBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgIHNlbGYuJHNlYXJjaC50cmlnZ2VyKCdmb2N1cycpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29udGFpbmVyLm9uKCdyZXN1bHRzOmZvY3VzJywgZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICBzZWxmLiRzZWFyY2guYXR0cignYXJpYS1hY3RpdmVkZXNjZW5kYW50JywgcGFyYW1zLmlkKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbignZm9jdXNpbicsICcuc2VsZWN0Mi1zZWFyY2gtLWlubGluZScsIGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgc2VsZi50cmlnZ2VyKCdmb2N1cycsIGV2dCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLiRzZWxlY3Rpb24ub24oJ2ZvY3Vzb3V0JywgJy5zZWxlY3QyLXNlYXJjaC0taW5saW5lJywgZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICBzZWxmLl9oYW5kbGVCbHVyKGV2dCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLiRzZWxlY3Rpb24ub24oJ2tleWRvd24nLCAnLnNlbGVjdDItc2VhcmNoLS1pbmxpbmUnLCBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgIHNlbGYudHJpZ2dlcigna2V5cHJlc3MnLCBldnQpO1xyXG5cclxuICAgICAgc2VsZi5fa2V5VXBQcmV2ZW50ZWQgPSBldnQuaXNEZWZhdWx0UHJldmVudGVkKCk7XHJcblxyXG4gICAgICB2YXIga2V5ID0gZXZ0LndoaWNoO1xyXG5cclxuICAgICAgaWYgKGtleSA9PT0gS0VZUy5CQUNLU1BBQ0UgJiYgc2VsZi4kc2VhcmNoLnZhbCgpID09PSAnJykge1xyXG4gICAgICAgIHZhciAkcHJldmlvdXNDaG9pY2UgPSBzZWxmLiRzZWFyY2hDb250YWluZXJcclxuICAgICAgICAgIC5wcmV2KCcuc2VsZWN0Mi1zZWxlY3Rpb25fX2Nob2ljZScpO1xyXG5cclxuICAgICAgICBpZiAoJHByZXZpb3VzQ2hvaWNlLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHZhciBpdGVtID0gJHByZXZpb3VzQ2hvaWNlLmRhdGEoJ2RhdGEnKTtcclxuXHJcbiAgICAgICAgICBzZWxmLnNlYXJjaFJlbW92ZUNob2ljZShpdGVtKTtcclxuXHJcbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFRyeSB0byBkZXRlY3QgdGhlIElFIHZlcnNpb24gc2hvdWxkIHRoZSBgZG9jdW1lbnRNb2RlYCBwcm9wZXJ0eSB0aGF0XHJcbiAgICAvLyBpcyBzdG9yZWQgb24gdGhlIGRvY3VtZW50LiBUaGlzIGlzIG9ubHkgaW1wbGVtZW50ZWQgaW4gSUUgYW5kIGlzXHJcbiAgICAvLyBzbGlnaHRseSBjbGVhbmVyIHRoYW4gZG9pbmcgYSB1c2VyIGFnZW50IGNoZWNrLlxyXG4gICAgLy8gVGhpcyBwcm9wZXJ0eSBpcyBub3QgYXZhaWxhYmxlIGluIEVkZ2UsIGJ1dCBFZGdlIGFsc28gZG9lc24ndCBoYXZlXHJcbiAgICAvLyB0aGlzIGJ1Zy5cclxuICAgIHZhciBtc2llID0gZG9jdW1lbnQuZG9jdW1lbnRNb2RlO1xyXG4gICAgdmFyIGRpc2FibGVJbnB1dEV2ZW50cyA9IG1zaWUgJiYgbXNpZSA8PSAxMTtcclxuXHJcbiAgICAvLyBXb3JrYXJvdW5kIGZvciBicm93c2VycyB3aGljaCBkbyBub3Qgc3VwcG9ydCB0aGUgYGlucHV0YCBldmVudFxyXG4gICAgLy8gVGhpcyB3aWxsIHByZXZlbnQgZG91YmxlLXRyaWdnZXJpbmcgb2YgZXZlbnRzIGZvciBicm93c2VycyB3aGljaCBzdXBwb3J0XHJcbiAgICAvLyBib3RoIHRoZSBga2V5dXBgIGFuZCBgaW5wdXRgIGV2ZW50cy5cclxuICAgIHRoaXMuJHNlbGVjdGlvbi5vbihcclxuICAgICAgJ2lucHV0LnNlYXJjaGNoZWNrJyxcclxuICAgICAgJy5zZWxlY3QyLXNlYXJjaC0taW5saW5lJyxcclxuICAgICAgZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICAgIC8vIElFIHdpbGwgdHJpZ2dlciB0aGUgYGlucHV0YCBldmVudCB3aGVuIGEgcGxhY2Vob2xkZXIgaXMgdXNlZCBvbiBhXHJcbiAgICAgICAgLy8gc2VhcmNoIGJveC4gVG8gZ2V0IGFyb3VuZCB0aGlzIGlzc3VlLCB3ZSBhcmUgZm9yY2VkIHRvIGlnbm9yZSBhbGxcclxuICAgICAgICAvLyBgaW5wdXRgIGV2ZW50cyBpbiBJRSBhbmQga2VlcCB1c2luZyBga2V5dXBgLlxyXG4gICAgICAgIGlmIChkaXNhYmxlSW5wdXRFdmVudHMpIHtcclxuICAgICAgICAgIHNlbGYuJHNlbGVjdGlvbi5vZmYoJ2lucHV0LnNlYXJjaCBpbnB1dC5zZWFyY2hjaGVjaycpO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVW5iaW5kIHRoZSBkdXBsaWNhdGVkIGBrZXl1cGAgZXZlbnRcclxuICAgICAgICBzZWxmLiRzZWxlY3Rpb24ub2ZmKCdrZXl1cC5zZWFyY2gnKTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuXHJcbiAgICB0aGlzLiRzZWxlY3Rpb24ub24oXHJcbiAgICAgICdrZXl1cC5zZWFyY2ggaW5wdXQuc2VhcmNoJyxcclxuICAgICAgJy5zZWxlY3QyLXNlYXJjaC0taW5saW5lJyxcclxuICAgICAgZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICAgIC8vIElFIHdpbGwgdHJpZ2dlciB0aGUgYGlucHV0YCBldmVudCB3aGVuIGEgcGxhY2Vob2xkZXIgaXMgdXNlZCBvbiBhXHJcbiAgICAgICAgLy8gc2VhcmNoIGJveC4gVG8gZ2V0IGFyb3VuZCB0aGlzIGlzc3VlLCB3ZSBhcmUgZm9yY2VkIHRvIGlnbm9yZSBhbGxcclxuICAgICAgICAvLyBgaW5wdXRgIGV2ZW50cyBpbiBJRSBhbmQga2VlcCB1c2luZyBga2V5dXBgLlxyXG4gICAgICAgIGlmIChkaXNhYmxlSW5wdXRFdmVudHMgJiYgZXZ0LnR5cGUgPT09ICdpbnB1dCcpIHtcclxuICAgICAgICAgIHNlbGYuJHNlbGVjdGlvbi5vZmYoJ2lucHV0LnNlYXJjaCBpbnB1dC5zZWFyY2hjaGVjaycpO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGtleSA9IGV2dC53aGljaDtcclxuXHJcbiAgICAgICAgLy8gV2UgY2FuIGZyZWVseSBpZ25vcmUgZXZlbnRzIGZyb20gbW9kaWZpZXIga2V5c1xyXG4gICAgICAgIGlmIChrZXkgPT0gS0VZUy5TSElGVCB8fCBrZXkgPT0gS0VZUy5DVFJMIHx8IGtleSA9PSBLRVlTLkFMVCkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVGFiYmluZyB3aWxsIGJlIGhhbmRsZWQgZHVyaW5nIHRoZSBga2V5ZG93bmAgcGhhc2VcclxuICAgICAgICBpZiAoa2V5ID09IEtFWVMuVEFCKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWxmLmhhbmRsZVNlYXJjaChldnQpO1xyXG4gICAgICB9XHJcbiAgICApO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIFRoaXMgbWV0aG9kIHdpbGwgdHJhbnNmZXIgdGhlIHRhYmluZGV4IGF0dHJpYnV0ZSBmcm9tIHRoZSByZW5kZXJlZFxyXG4gICAqIHNlbGVjdGlvbiB0byB0aGUgc2VhcmNoIGJveC4gVGhpcyBhbGxvd3MgZm9yIHRoZSBzZWFyY2ggYm94IHRvIGJlIHVzZWQgYXNcclxuICAgKiB0aGUgcHJpbWFyeSBmb2N1cyBpbnN0ZWFkIG9mIHRoZSBzZWxlY3Rpb24gY29udGFpbmVyLlxyXG4gICAqXHJcbiAgICogQHByaXZhdGVcclxuICAgKi9cclxuICBTZWFyY2gucHJvdG90eXBlLl90cmFuc2ZlclRhYkluZGV4ID0gZnVuY3Rpb24gKGRlY29yYXRlZCkge1xyXG4gICAgdGhpcy4kc2VhcmNoLmF0dHIoJ3RhYmluZGV4JywgdGhpcy4kc2VsZWN0aW9uLmF0dHIoJ3RhYmluZGV4JykpO1xyXG4gICAgdGhpcy4kc2VsZWN0aW9uLmF0dHIoJ3RhYmluZGV4JywgJy0xJyk7XHJcbiAgfTtcclxuXHJcbiAgU2VhcmNoLnByb3RvdHlwZS5jcmVhdGVQbGFjZWhvbGRlciA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIHBsYWNlaG9sZGVyKSB7XHJcbiAgICB0aGlzLiRzZWFyY2guYXR0cigncGxhY2Vob2xkZXInLCBwbGFjZWhvbGRlci50ZXh0KTtcclxuICB9O1xyXG5cclxuICBTZWFyY2gucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGRhdGEpIHtcclxuICAgIHZhciBzZWFyY2hIYWRGb2N1cyA9IHRoaXMuJHNlYXJjaFswXSA9PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG5cclxuICAgIHRoaXMuJHNlYXJjaC5hdHRyKCdwbGFjZWhvbGRlcicsICcnKTtcclxuXHJcbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBkYXRhKTtcclxuXHJcbiAgICB0aGlzLiRzZWxlY3Rpb24uZmluZCgnLnNlbGVjdDItc2VsZWN0aW9uX19yZW5kZXJlZCcpXHJcbiAgICAgICAgICAgICAgICAgICAuYXBwZW5kKHRoaXMuJHNlYXJjaENvbnRhaW5lcik7XHJcblxyXG4gICAgdGhpcy5yZXNpemVTZWFyY2goKTtcclxuICAgIGlmIChzZWFyY2hIYWRGb2N1cykge1xyXG4gICAgICB0aGlzLiRzZWFyY2guZm9jdXMoKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBTZWFyY2gucHJvdG90eXBlLmhhbmRsZVNlYXJjaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMucmVzaXplU2VhcmNoKCk7XHJcblxyXG4gICAgaWYgKCF0aGlzLl9rZXlVcFByZXZlbnRlZCkge1xyXG4gICAgICB2YXIgaW5wdXQgPSB0aGlzLiRzZWFyY2gudmFsKCk7XHJcblxyXG4gICAgICB0aGlzLnRyaWdnZXIoJ3F1ZXJ5Jywge1xyXG4gICAgICAgIHRlcm06IGlucHV0XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX2tleVVwUHJldmVudGVkID0gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgU2VhcmNoLnByb3RvdHlwZS5zZWFyY2hSZW1vdmVDaG9pY2UgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBpdGVtKSB7XHJcbiAgICB0aGlzLnRyaWdnZXIoJ3Vuc2VsZWN0Jywge1xyXG4gICAgICBkYXRhOiBpdGVtXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLiRzZWFyY2gudmFsKGl0ZW0udGV4dCk7XHJcbiAgICB0aGlzLmhhbmRsZVNlYXJjaCgpO1xyXG4gIH07XHJcblxyXG4gIFNlYXJjaC5wcm90b3R5cGUucmVzaXplU2VhcmNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy4kc2VhcmNoLmNzcygnd2lkdGgnLCAnMjVweCcpO1xyXG5cclxuICAgIHZhciB3aWR0aCA9ICcnO1xyXG5cclxuICAgIGlmICh0aGlzLiRzZWFyY2guYXR0cigncGxhY2Vob2xkZXInKSAhPT0gJycpIHtcclxuICAgICAgd2lkdGggPSB0aGlzLiRzZWxlY3Rpb24uZmluZCgnLnNlbGVjdDItc2VsZWN0aW9uX19yZW5kZXJlZCcpLmlubmVyV2lkdGgoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBtaW5pbXVtV2lkdGggPSB0aGlzLiRzZWFyY2gudmFsKCkubGVuZ3RoICsgMTtcclxuXHJcbiAgICAgIHdpZHRoID0gKG1pbmltdW1XaWR0aCAqIDAuNzUpICsgJ2VtJztcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiRzZWFyY2guY3NzKCd3aWR0aCcsIHdpZHRoKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gU2VhcmNoO1xyXG59KTtcclxuXHJcblMyLmRlZmluZSgnc2VsZWN0Mi9zZWxlY3Rpb24vZXZlbnRSZWxheScsW1xyXG4gICdqcXVlcnknXHJcbl0sIGZ1bmN0aW9uICgkKSB7XHJcbiAgZnVuY3Rpb24gRXZlbnRSZWxheSAoKSB7IH1cclxuXHJcbiAgRXZlbnRSZWxheS5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdmFyIHJlbGF5RXZlbnRzID0gW1xyXG4gICAgICAnb3BlbicsICdvcGVuaW5nJyxcclxuICAgICAgJ2Nsb3NlJywgJ2Nsb3NpbmcnLFxyXG4gICAgICAnc2VsZWN0JywgJ3NlbGVjdGluZycsXHJcbiAgICAgICd1bnNlbGVjdCcsICd1bnNlbGVjdGluZydcclxuICAgIF07XHJcblxyXG4gICAgdmFyIHByZXZlbnRhYmxlRXZlbnRzID0gWydvcGVuaW5nJywgJ2Nsb3NpbmcnLCAnc2VsZWN0aW5nJywgJ3Vuc2VsZWN0aW5nJ107XHJcblxyXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgY29udGFpbmVyLCAkY29udGFpbmVyKTtcclxuXHJcbiAgICBjb250YWluZXIub24oJyonLCBmdW5jdGlvbiAobmFtZSwgcGFyYW1zKSB7XHJcbiAgICAgIC8vIElnbm9yZSBldmVudHMgdGhhdCBzaG91bGQgbm90IGJlIHJlbGF5ZWRcclxuICAgICAgaWYgKCQuaW5BcnJheShuYW1lLCByZWxheUV2ZW50cykgPT09IC0xKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBUaGUgcGFyYW1ldGVycyBzaG91bGQgYWx3YXlzIGJlIGFuIG9iamVjdFxyXG4gICAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XHJcblxyXG4gICAgICAvLyBHZW5lcmF0ZSB0aGUgalF1ZXJ5IGV2ZW50IGZvciB0aGUgU2VsZWN0MiBldmVudFxyXG4gICAgICB2YXIgZXZ0ID0gJC5FdmVudCgnc2VsZWN0MjonICsgbmFtZSwge1xyXG4gICAgICAgIHBhcmFtczogcGFyYW1zXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgc2VsZi4kZWxlbWVudC50cmlnZ2VyKGV2dCk7XHJcblxyXG4gICAgICAvLyBPbmx5IGhhbmRsZSBwcmV2ZW50YWJsZSBldmVudHMgaWYgaXQgd2FzIG9uZVxyXG4gICAgICBpZiAoJC5pbkFycmF5KG5hbWUsIHByZXZlbnRhYmxlRXZlbnRzKSA9PT0gLTEpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHBhcmFtcy5wcmV2ZW50ZWQgPSBldnQuaXNEZWZhdWx0UHJldmVudGVkKCk7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gRXZlbnRSZWxheTtcclxufSk7XHJcblxyXG5TMi5kZWZpbmUoJ3NlbGVjdDIvdHJhbnNsYXRpb24nLFtcclxuICAnanF1ZXJ5JyxcclxuICAncmVxdWlyZSdcclxuXSwgZnVuY3Rpb24gKCQsIHJlcXVpcmUpIHtcclxuICBmdW5jdGlvbiBUcmFuc2xhdGlvbiAoZGljdCkge1xyXG4gICAgdGhpcy5kaWN0ID0gZGljdCB8fCB7fTtcclxuICB9XHJcblxyXG4gIFRyYW5zbGF0aW9uLnByb3RvdHlwZS5hbGwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kaWN0O1xyXG4gIH07XHJcblxyXG4gIFRyYW5zbGF0aW9uLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5kaWN0W2tleV07XHJcbiAgfTtcclxuXHJcbiAgVHJhbnNsYXRpb24ucHJvdG90eXBlLmV4dGVuZCA9IGZ1bmN0aW9uICh0cmFuc2xhdGlvbikge1xyXG4gICAgdGhpcy5kaWN0ID0gJC5leHRlbmQoe30sIHRyYW5zbGF0aW9uLmFsbCgpLCB0aGlzLmRpY3QpO1xyXG4gIH07XHJcblxyXG4gIC8vIFN0YXRpYyBmdW5jdGlvbnNcclxuXHJcbiAgVHJhbnNsYXRpb24uX2NhY2hlID0ge307XHJcblxyXG4gIFRyYW5zbGF0aW9uLmxvYWRQYXRoID0gZnVuY3Rpb24gKHBhdGgpIHtcclxuICAgIGlmICghKHBhdGggaW4gVHJhbnNsYXRpb24uX2NhY2hlKSkge1xyXG4gICAgICB2YXIgdHJhbnNsYXRpb25zID0gcmVxdWlyZShwYXRoKTtcclxuXHJcbiAgICAgIFRyYW5zbGF0aW9uLl9jYWNoZVtwYXRoXSA9IHRyYW5zbGF0aW9ucztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3IFRyYW5zbGF0aW9uKFRyYW5zbGF0aW9uLl9jYWNoZVtwYXRoXSk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIFRyYW5zbGF0aW9uO1xyXG59KTtcclxuXHJcblMyLmRlZmluZSgnc2VsZWN0Mi9kaWFjcml0aWNzJyxbXHJcblxyXG5dLCBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIGRpYWNyaXRpY3MgPSB7XHJcbiAgICAnXFx1MjRCNic6ICdBJyxcclxuICAgICdcXHVGRjIxJzogJ0EnLFxyXG4gICAgJ1xcdTAwQzAnOiAnQScsXHJcbiAgICAnXFx1MDBDMSc6ICdBJyxcclxuICAgICdcXHUwMEMyJzogJ0EnLFxyXG4gICAgJ1xcdTFFQTYnOiAnQScsXHJcbiAgICAnXFx1MUVBNCc6ICdBJyxcclxuICAgICdcXHUxRUFBJzogJ0EnLFxyXG4gICAgJ1xcdTFFQTgnOiAnQScsXHJcbiAgICAnXFx1MDBDMyc6ICdBJyxcclxuICAgICdcXHUwMTAwJzogJ0EnLFxyXG4gICAgJ1xcdTAxMDInOiAnQScsXHJcbiAgICAnXFx1MUVCMCc6ICdBJyxcclxuICAgICdcXHUxRUFFJzogJ0EnLFxyXG4gICAgJ1xcdTFFQjQnOiAnQScsXHJcbiAgICAnXFx1MUVCMic6ICdBJyxcclxuICAgICdcXHUwMjI2JzogJ0EnLFxyXG4gICAgJ1xcdTAxRTAnOiAnQScsXHJcbiAgICAnXFx1MDBDNCc6ICdBJyxcclxuICAgICdcXHUwMURFJzogJ0EnLFxyXG4gICAgJ1xcdTFFQTInOiAnQScsXHJcbiAgICAnXFx1MDBDNSc6ICdBJyxcclxuICAgICdcXHUwMUZBJzogJ0EnLFxyXG4gICAgJ1xcdTAxQ0QnOiAnQScsXHJcbiAgICAnXFx1MDIwMCc6ICdBJyxcclxuICAgICdcXHUwMjAyJzogJ0EnLFxyXG4gICAgJ1xcdTFFQTAnOiAnQScsXHJcbiAgICAnXFx1MUVBQyc6ICdBJyxcclxuICAgICdcXHUxRUI2JzogJ0EnLFxyXG4gICAgJ1xcdTFFMDAnOiAnQScsXHJcbiAgICAnXFx1MDEwNCc6ICdBJyxcclxuICAgICdcXHUwMjNBJzogJ0EnLFxyXG4gICAgJ1xcdTJDNkYnOiAnQScsXHJcbiAgICAnXFx1QTczMic6ICdBQScsXHJcbiAgICAnXFx1MDBDNic6ICdBRScsXHJcbiAgICAnXFx1MDFGQyc6ICdBRScsXHJcbiAgICAnXFx1MDFFMic6ICdBRScsXHJcbiAgICAnXFx1QTczNCc6ICdBTycsXHJcbiAgICAnXFx1QTczNic6ICdBVScsXHJcbiAgICAnXFx1QTczOCc6ICdBVicsXHJcbiAgICAnXFx1QTczQSc6ICdBVicsXHJcbiAgICAnXFx1QTczQyc6ICdBWScsXHJcbiAgICAnXFx1MjRCNyc6ICdCJyxcclxuICAgICdcXHVGRjIyJzogJ0InLFxyXG4gICAgJ1xcdTFFMDInOiAnQicsXHJcbiAgICAnXFx1MUUwNCc6ICdCJyxcclxuICAgICdcXHUxRTA2JzogJ0InLFxyXG4gICAgJ1xcdTAyNDMnOiAnQicsXHJcbiAgICAnXFx1MDE4Mic6ICdCJyxcclxuICAgICdcXHUwMTgxJzogJ0InLFxyXG4gICAgJ1xcdTI0QjgnOiAnQycsXHJcbiAgICAnXFx1RkYyMyc6ICdDJyxcclxuICAgICdcXHUwMTA2JzogJ0MnLFxyXG4gICAgJ1xcdTAxMDgnOiAnQycsXHJcbiAgICAnXFx1MDEwQSc6ICdDJyxcclxuICAgICdcXHUwMTBDJzogJ0MnLFxyXG4gICAgJ1xcdTAwQzcnOiAnQycsXHJcbiAgICAnXFx1MUUwOCc6ICdDJyxcclxuICAgICdcXHUwMTg3JzogJ0MnLFxyXG4gICAgJ1xcdTAyM0InOiAnQycsXHJcbiAgICAnXFx1QTczRSc6ICdDJyxcclxuICAgICdcXHUyNEI5JzogJ0QnLFxyXG4gICAgJ1xcdUZGMjQnOiAnRCcsXHJcbiAgICAnXFx1MUUwQSc6ICdEJyxcclxuICAgICdcXHUwMTBFJzogJ0QnLFxyXG4gICAgJ1xcdTFFMEMnOiAnRCcsXHJcbiAgICAnXFx1MUUxMCc6ICdEJyxcclxuICAgICdcXHUxRTEyJzogJ0QnLFxyXG4gICAgJ1xcdTFFMEUnOiAnRCcsXHJcbiAgICAnXFx1MDExMCc6ICdEJyxcclxuICAgICdcXHUwMThCJzogJ0QnLFxyXG4gICAgJ1xcdTAxOEEnOiAnRCcsXHJcbiAgICAnXFx1MDE4OSc6ICdEJyxcclxuICAgICdcXHVBNzc5JzogJ0QnLFxyXG4gICAgJ1xcdTAxRjEnOiAnRFonLFxyXG4gICAgJ1xcdTAxQzQnOiAnRFonLFxyXG4gICAgJ1xcdTAxRjInOiAnRHonLFxyXG4gICAgJ1xcdTAxQzUnOiAnRHonLFxyXG4gICAgJ1xcdTI0QkEnOiAnRScsXHJcbiAgICAnXFx1RkYyNSc6ICdFJyxcclxuICAgICdcXHUwMEM4JzogJ0UnLFxyXG4gICAgJ1xcdTAwQzknOiAnRScsXHJcbiAgICAnXFx1MDBDQSc6ICdFJyxcclxuICAgICdcXHUxRUMwJzogJ0UnLFxyXG4gICAgJ1xcdTFFQkUnOiAnRScsXHJcbiAgICAnXFx1MUVDNCc6ICdFJyxcclxuICAgICdcXHUxRUMyJzogJ0UnLFxyXG4gICAgJ1xcdTFFQkMnOiAnRScsXHJcbiAgICAnXFx1MDExMic6ICdFJyxcclxuICAgICdcXHUxRTE0JzogJ0UnLFxyXG4gICAgJ1xcdTFFMTYnOiAnRScsXHJcbiAgICAnXFx1MDExNCc6ICdFJyxcclxuICAgICdcXHUwMTE2JzogJ0UnLFxyXG4gICAgJ1xcdTAwQ0InOiAnRScsXHJcbiAgICAnXFx1MUVCQSc6ICdFJyxcclxuICAgICdcXHUwMTFBJzogJ0UnLFxyXG4gICAgJ1xcdTAyMDQnOiAnRScsXHJcbiAgICAnXFx1MDIwNic6ICdFJyxcclxuICAgICdcXHUxRUI4JzogJ0UnLFxyXG4gICAgJ1xcdTFFQzYnOiAnRScsXHJcbiAgICAnXFx1MDIyOCc6ICdFJyxcclxuICAgICdcXHUxRTFDJzogJ0UnLFxyXG4gICAgJ1xcdTAxMTgnOiAnRScsXHJcbiAgICAnXFx1MUUxOCc6ICdFJyxcclxuICAgICdcXHUxRTFBJzogJ0UnLFxyXG4gICAgJ1xcdTAxOTAnOiAnRScsXHJcbiAgICAnXFx1MDE4RSc6ICdFJyxcclxuICAgICdcXHUyNEJCJzogJ0YnLFxyXG4gICAgJ1xcdUZGMjYnOiAnRicsXHJcbiAgICAnXFx1MUUxRSc6ICdGJyxcclxuICAgICdcXHUwMTkxJzogJ0YnLFxyXG4gICAgJ1xcdUE3N0InOiAnRicsXHJcbiAgICAnXFx1MjRCQyc6ICdHJyxcclxuICAgICdcXHVGRjI3JzogJ0cnLFxyXG4gICAgJ1xcdTAxRjQnOiAnRycsXHJcbiAgICAnXFx1MDExQyc6ICdHJyxcclxuICAgICdcXHUxRTIwJzogJ0cnLFxyXG4gICAgJ1xcdTAxMUUnOiAnRycsXHJcbiAgICAnXFx1MDEyMCc6ICdHJyxcclxuICAgICdcXHUwMUU2JzogJ0cnLFxyXG4gICAgJ1xcdTAxMjInOiAnRycsXHJcbiAgICAnXFx1MDFFNCc6ICdHJyxcclxuICAgICdcXHUwMTkzJzogJ0cnLFxyXG4gICAgJ1xcdUE3QTAnOiAnRycsXHJcbiAgICAnXFx1QTc3RCc6ICdHJyxcclxuICAgICdcXHVBNzdFJzogJ0cnLFxyXG4gICAgJ1xcdTI0QkQnOiAnSCcsXHJcbiAgICAnXFx1RkYyOCc6ICdIJyxcclxuICAgICdcXHUwMTI0JzogJ0gnLFxyXG4gICAgJ1xcdTFFMjInOiAnSCcsXHJcbiAgICAnXFx1MUUyNic6ICdIJyxcclxuICAgICdcXHUwMjFFJzogJ0gnLFxyXG4gICAgJ1xcdTFFMjQnOiAnSCcsXHJcbiAgICAnXFx1MUUyOCc6ICdIJyxcclxuICAgICdcXHUxRTJBJzogJ0gnLFxyXG4gICAgJ1xcdTAxMjYnOiAnSCcsXHJcbiAgICAnXFx1MkM2Nyc6ICdIJyxcclxuICAgICdcXHUyQzc1JzogJ0gnLFxyXG4gICAgJ1xcdUE3OEQnOiAnSCcsXHJcbiAgICAnXFx1MjRCRSc6ICdJJyxcclxuICAgICdcXHVGRjI5JzogJ0knLFxyXG4gICAgJ1xcdTAwQ0MnOiAnSScsXHJcbiAgICAnXFx1MDBDRCc6ICdJJyxcclxuICAgICdcXHUwMENFJzogJ0knLFxyXG4gICAgJ1xcdTAxMjgnOiAnSScsXHJcbiAgICAnXFx1MDEyQSc6ICdJJyxcclxuICAgICdcXHUwMTJDJzogJ0knLFxyXG4gICAgJ1xcdTAxMzAnOiAnSScsXHJcbiAgICAnXFx1MDBDRic6ICdJJyxcclxuICAgICdcXHUxRTJFJzogJ0knLFxyXG4gICAgJ1xcdTFFQzgnOiAnSScsXHJcbiAgICAnXFx1MDFDRic6ICdJJyxcclxuICAgICdcXHUwMjA4JzogJ0knLFxyXG4gICAgJ1xcdTAyMEEnOiAnSScsXHJcbiAgICAnXFx1MUVDQSc6ICdJJyxcclxuICAgICdcXHUwMTJFJzogJ0knLFxyXG4gICAgJ1xcdTFFMkMnOiAnSScsXHJcbiAgICAnXFx1MDE5Nyc6ICdJJyxcclxuICAgICdcXHUyNEJGJzogJ0onLFxyXG4gICAgJ1xcdUZGMkEnOiAnSicsXHJcbiAgICAnXFx1MDEzNCc6ICdKJyxcclxuICAgICdcXHUwMjQ4JzogJ0onLFxyXG4gICAgJ1xcdTI0QzAnOiAnSycsXHJcbiAgICAnXFx1RkYyQic6ICdLJyxcclxuICAgICdcXHUxRTMwJzogJ0snLFxyXG4gICAgJ1xcdTAxRTgnOiAnSycsXHJcbiAgICAnXFx1MUUzMic6ICdLJyxcclxuICAgICdcXHUwMTM2JzogJ0snLFxyXG4gICAgJ1xcdTFFMzQnOiAnSycsXHJcbiAgICAnXFx1MDE5OCc6ICdLJyxcclxuICAgICdcXHUyQzY5JzogJ0snLFxyXG4gICAgJ1xcdUE3NDAnOiAnSycsXHJcbiAgICAnXFx1QTc0Mic6ICdLJyxcclxuICAgICdcXHVBNzQ0JzogJ0snLFxyXG4gICAgJ1xcdUE3QTInOiAnSycsXHJcbiAgICAnXFx1MjRDMSc6ICdMJyxcclxuICAgICdcXHVGRjJDJzogJ0wnLFxyXG4gICAgJ1xcdTAxM0YnOiAnTCcsXHJcbiAgICAnXFx1MDEzOSc6ICdMJyxcclxuICAgICdcXHUwMTNEJzogJ0wnLFxyXG4gICAgJ1xcdTFFMzYnOiAnTCcsXHJcbiAgICAnXFx1MUUzOCc6ICdMJyxcclxuICAgICdcXHUwMTNCJzogJ0wnLFxyXG4gICAgJ1xcdTFFM0MnOiAnTCcsXHJcbiAgICAnXFx1MUUzQSc6ICdMJyxcclxuICAgICdcXHUwMTQxJzogJ0wnLFxyXG4gICAgJ1xcdTAyM0QnOiAnTCcsXHJcbiAgICAnXFx1MkM2Mic6ICdMJyxcclxuICAgICdcXHUyQzYwJzogJ0wnLFxyXG4gICAgJ1xcdUE3NDgnOiAnTCcsXHJcbiAgICAnXFx1QTc0Nic6ICdMJyxcclxuICAgICdcXHVBNzgwJzogJ0wnLFxyXG4gICAgJ1xcdTAxQzcnOiAnTEonLFxyXG4gICAgJ1xcdTAxQzgnOiAnTGonLFxyXG4gICAgJ1xcdTI0QzInOiAnTScsXHJcbiAgICAnXFx1RkYyRCc6ICdNJyxcclxuICAgICdcXHUxRTNFJzogJ00nLFxyXG4gICAgJ1xcdTFFNDAnOiAnTScsXHJcbiAgICAnXFx1MUU0Mic6ICdNJyxcclxuICAgICdcXHUyQzZFJzogJ00nLFxyXG4gICAgJ1xcdTAxOUMnOiAnTScsXHJcbiAgICAnXFx1MjRDMyc6ICdOJyxcclxuICAgICdcXHVGRjJFJzogJ04nLFxyXG4gICAgJ1xcdTAxRjgnOiAnTicsXHJcbiAgICAnXFx1MDE0Myc6ICdOJyxcclxuICAgICdcXHUwMEQxJzogJ04nLFxyXG4gICAgJ1xcdTFFNDQnOiAnTicsXHJcbiAgICAnXFx1MDE0Nyc6ICdOJyxcclxuICAgICdcXHUxRTQ2JzogJ04nLFxyXG4gICAgJ1xcdTAxNDUnOiAnTicsXHJcbiAgICAnXFx1MUU0QSc6ICdOJyxcclxuICAgICdcXHUxRTQ4JzogJ04nLFxyXG4gICAgJ1xcdTAyMjAnOiAnTicsXHJcbiAgICAnXFx1MDE5RCc6ICdOJyxcclxuICAgICdcXHVBNzkwJzogJ04nLFxyXG4gICAgJ1xcdUE3QTQnOiAnTicsXHJcbiAgICAnXFx1MDFDQSc6ICdOSicsXHJcbiAgICAnXFx1MDFDQic6ICdOaicsXHJcbiAgICAnXFx1MjRDNCc6ICdPJyxcclxuICAgICdcXHVGRjJGJzogJ08nLFxyXG4gICAgJ1xcdTAwRDInOiAnTycsXHJcbiAgICAnXFx1MDBEMyc6ICdPJyxcclxuICAgICdcXHUwMEQ0JzogJ08nLFxyXG4gICAgJ1xcdTFFRDInOiAnTycsXHJcbiAgICAnXFx1MUVEMCc6ICdPJyxcclxuICAgICdcXHUxRUQ2JzogJ08nLFxyXG4gICAgJ1xcdTFFRDQnOiAnTycsXHJcbiAgICAnXFx1MDBENSc6ICdPJyxcclxuICAgICdcXHUxRTRDJzogJ08nLFxyXG4gICAgJ1xcdTAyMkMnOiAnTycsXHJcbiAgICAnXFx1MUU0RSc6ICdPJyxcclxuICAgICdcXHUwMTRDJzogJ08nLFxyXG4gICAgJ1xcdTFFNTAnOiAnTycsXHJcbiAgICAnXFx1MUU1Mic6ICdPJyxcclxuICAgICdcXHUwMTRFJzogJ08nLFxyXG4gICAgJ1xcdTAyMkUnOiAnTycsXHJcbiAgICAnXFx1MDIzMCc6ICdPJyxcclxuICAgICdcXHUwMEQ2JzogJ08nLFxyXG4gICAgJ1xcdTAyMkEnOiAnTycsXHJcbiAgICAnXFx1MUVDRSc6ICdPJyxcclxuICAgICdcXHUwMTUwJzogJ08nLFxyXG4gICAgJ1xcdTAxRDEnOiAnTycsXHJcbiAgICAnXFx1MDIwQyc6ICdPJyxcclxuICAgICdcXHUwMjBFJzogJ08nLFxyXG4gICAgJ1xcdTAxQTAnOiAnTycsXHJcbiAgICAnXFx1MUVEQyc6ICdPJyxcclxuICAgICdcXHUxRURBJzogJ08nLFxyXG4gICAgJ1xcdTFFRTAnOiAnTycsXHJcbiAgICAnXFx1MUVERSc6ICdPJyxcclxuICAgICdcXHUxRUUyJzogJ08nLFxyXG4gICAgJ1xcdTFFQ0MnOiAnTycsXHJcbiAgICAnXFx1MUVEOCc6ICdPJyxcclxuICAgICdcXHUwMUVBJzogJ08nLFxyXG4gICAgJ1xcdTAxRUMnOiAnTycsXHJcbiAgICAnXFx1MDBEOCc6ICdPJyxcclxuICAgICdcXHUwMUZFJzogJ08nLFxyXG4gICAgJ1xcdTAxODYnOiAnTycsXHJcbiAgICAnXFx1MDE5Ric6ICdPJyxcclxuICAgICdcXHVBNzRBJzogJ08nLFxyXG4gICAgJ1xcdUE3NEMnOiAnTycsXHJcbiAgICAnXFx1MDFBMic6ICdPSScsXHJcbiAgICAnXFx1QTc0RSc6ICdPTycsXHJcbiAgICAnXFx1MDIyMic6ICdPVScsXHJcbiAgICAnXFx1MjRDNSc6ICdQJyxcclxuICAgICdcXHVGRjMwJzogJ1AnLFxyXG4gICAgJ1xcdTFFNTQnOiAnUCcsXHJcbiAgICAnXFx1MUU1Nic6ICdQJyxcclxuICAgICdcXHUwMUE0JzogJ1AnLFxyXG4gICAgJ1xcdTJDNjMnOiAnUCcsXHJcbiAgICAnXFx1QTc1MCc6ICdQJyxcclxuICAgICdcXHVBNzUyJzogJ1AnLFxyXG4gICAgJ1xcdUE3NTQnOiAnUCcsXHJcbiAgICAnXFx1MjRDNic6ICdRJyxcclxuICAgICdcXHVGRjMxJzogJ1EnLFxyXG4gICAgJ1xcdUE3NTYnOiAnUScsXHJcbiAgICAnXFx1QTc1OCc6ICdRJyxcclxuICAgICdcXHUwMjRBJzogJ1EnLFxyXG4gICAgJ1xcdTI0QzcnOiAnUicsXHJcbiAgICAnXFx1RkYzMic6ICdSJyxcclxuICAgICdcXHUwMTU0JzogJ1InLFxyXG4gICAgJ1xcdTFFNTgnOiAnUicsXHJcbiAgICAnXFx1MDE1OCc6ICdSJyxcclxuICAgICdcXHUwMjEwJzogJ1InLFxyXG4gICAgJ1xcdTAyMTInOiAnUicsXHJcbiAgICAnXFx1MUU1QSc6ICdSJyxcclxuICAgICdcXHUxRTVDJzogJ1InLFxyXG4gICAgJ1xcdTAxNTYnOiAnUicsXHJcbiAgICAnXFx1MUU1RSc6ICdSJyxcclxuICAgICdcXHUwMjRDJzogJ1InLFxyXG4gICAgJ1xcdTJDNjQnOiAnUicsXHJcbiAgICAnXFx1QTc1QSc6ICdSJyxcclxuICAgICdcXHVBN0E2JzogJ1InLFxyXG4gICAgJ1xcdUE3ODInOiAnUicsXHJcbiAgICAnXFx1MjRDOCc6ICdTJyxcclxuICAgICdcXHVGRjMzJzogJ1MnLFxyXG4gICAgJ1xcdTFFOUUnOiAnUycsXHJcbiAgICAnXFx1MDE1QSc6ICdTJyxcclxuICAgICdcXHUxRTY0JzogJ1MnLFxyXG4gICAgJ1xcdTAxNUMnOiAnUycsXHJcbiAgICAnXFx1MUU2MCc6ICdTJyxcclxuICAgICdcXHUwMTYwJzogJ1MnLFxyXG4gICAgJ1xcdTFFNjYnOiAnUycsXHJcbiAgICAnXFx1MUU2Mic6ICdTJyxcclxuICAgICdcXHUxRTY4JzogJ1MnLFxyXG4gICAgJ1xcdTAyMTgnOiAnUycsXHJcbiAgICAnXFx1MDE1RSc6ICdTJyxcclxuICAgICdcXHUyQzdFJzogJ1MnLFxyXG4gICAgJ1xcdUE3QTgnOiAnUycsXHJcbiAgICAnXFx1QTc4NCc6ICdTJyxcclxuICAgICdcXHUyNEM5JzogJ1QnLFxyXG4gICAgJ1xcdUZGMzQnOiAnVCcsXHJcbiAgICAnXFx1MUU2QSc6ICdUJyxcclxuICAgICdcXHUwMTY0JzogJ1QnLFxyXG4gICAgJ1xcdTFFNkMnOiAnVCcsXHJcbiAgICAnXFx1MDIxQSc6ICdUJyxcclxuICAgICdcXHUwMTYyJzogJ1QnLFxyXG4gICAgJ1xcdTFFNzAnOiAnVCcsXHJcbiAgICAnXFx1MUU2RSc6ICdUJyxcclxuICAgICdcXHUwMTY2JzogJ1QnLFxyXG4gICAgJ1xcdTAxQUMnOiAnVCcsXHJcbiAgICAnXFx1MDFBRSc6ICdUJyxcclxuICAgICdcXHUwMjNFJzogJ1QnLFxyXG4gICAgJ1xcdUE3ODYnOiAnVCcsXHJcbiAgICAnXFx1QTcyOCc6ICdUWicsXHJcbiAgICAnXFx1MjRDQSc6ICdVJyxcclxuICAgICdcXHVGRjM1JzogJ1UnLFxyXG4gICAgJ1xcdTAwRDknOiAnVScsXHJcbiAgICAnXFx1MDBEQSc6ICdVJyxcclxuICAgICdcXHUwMERCJzogJ1UnLFxyXG4gICAgJ1xcdTAxNjgnOiAnVScsXHJcbiAgICAnXFx1MUU3OCc6ICdVJyxcclxuICAgICdcXHUwMTZBJzogJ1UnLFxyXG4gICAgJ1xcdTFFN0EnOiAnVScsXHJcbiAgICAnXFx1MDE2Qyc6ICdVJyxcclxuICAgICdcXHUwMERDJzogJ1UnLFxyXG4gICAgJ1xcdTAxREInOiAnVScsXHJcbiAgICAnXFx1MDFENyc6ICdVJyxcclxuICAgICdcXHUwMUQ1JzogJ1UnLFxyXG4gICAgJ1xcdTAxRDknOiAnVScsXHJcbiAgICAnXFx1MUVFNic6ICdVJyxcclxuICAgICdcXHUwMTZFJzogJ1UnLFxyXG4gICAgJ1xcdTAxNzAnOiAnVScsXHJcbiAgICAnXFx1MDFEMyc6ICdVJyxcclxuICAgICdcXHUwMjE0JzogJ1UnLFxyXG4gICAgJ1xcdTAyMTYnOiAnVScsXHJcbiAgICAnXFx1MDFBRic6ICdVJyxcclxuICAgICdcXHUxRUVBJzogJ1UnLFxyXG4gICAgJ1xcdTFFRTgnOiAnVScsXHJcbiAgICAnXFx1MUVFRSc6ICdVJyxcclxuICAgICdcXHUxRUVDJzogJ1UnLFxyXG4gICAgJ1xcdTFFRjAnOiAnVScsXHJcbiAgICAnXFx1MUVFNCc6ICdVJyxcclxuICAgICdcXHUxRTcyJzogJ1UnLFxyXG4gICAgJ1xcdTAxNzInOiAnVScsXHJcbiAgICAnXFx1MUU3Nic6ICdVJyxcclxuICAgICdcXHUxRTc0JzogJ1UnLFxyXG4gICAgJ1xcdTAyNDQnOiAnVScsXHJcbiAgICAnXFx1MjRDQic6ICdWJyxcclxuICAgICdcXHVGRjM2JzogJ1YnLFxyXG4gICAgJ1xcdTFFN0MnOiAnVicsXHJcbiAgICAnXFx1MUU3RSc6ICdWJyxcclxuICAgICdcXHUwMUIyJzogJ1YnLFxyXG4gICAgJ1xcdUE3NUUnOiAnVicsXHJcbiAgICAnXFx1MDI0NSc6ICdWJyxcclxuICAgICdcXHVBNzYwJzogJ1ZZJyxcclxuICAgICdcXHUyNENDJzogJ1cnLFxyXG4gICAgJ1xcdUZGMzcnOiAnVycsXHJcbiAgICAnXFx1MUU4MCc6ICdXJyxcclxuICAgICdcXHUxRTgyJzogJ1cnLFxyXG4gICAgJ1xcdTAxNzQnOiAnVycsXHJcbiAgICAnXFx1MUU4Nic6ICdXJyxcclxuICAgICdcXHUxRTg0JzogJ1cnLFxyXG4gICAgJ1xcdTFFODgnOiAnVycsXHJcbiAgICAnXFx1MkM3Mic6ICdXJyxcclxuICAgICdcXHUyNENEJzogJ1gnLFxyXG4gICAgJ1xcdUZGMzgnOiAnWCcsXHJcbiAgICAnXFx1MUU4QSc6ICdYJyxcclxuICAgICdcXHUxRThDJzogJ1gnLFxyXG4gICAgJ1xcdTI0Q0UnOiAnWScsXHJcbiAgICAnXFx1RkYzOSc6ICdZJyxcclxuICAgICdcXHUxRUYyJzogJ1knLFxyXG4gICAgJ1xcdTAwREQnOiAnWScsXHJcbiAgICAnXFx1MDE3Nic6ICdZJyxcclxuICAgICdcXHUxRUY4JzogJ1knLFxyXG4gICAgJ1xcdTAyMzInOiAnWScsXHJcbiAgICAnXFx1MUU4RSc6ICdZJyxcclxuICAgICdcXHUwMTc4JzogJ1knLFxyXG4gICAgJ1xcdTFFRjYnOiAnWScsXHJcbiAgICAnXFx1MUVGNCc6ICdZJyxcclxuICAgICdcXHUwMUIzJzogJ1knLFxyXG4gICAgJ1xcdTAyNEUnOiAnWScsXHJcbiAgICAnXFx1MUVGRSc6ICdZJyxcclxuICAgICdcXHUyNENGJzogJ1onLFxyXG4gICAgJ1xcdUZGM0EnOiAnWicsXHJcbiAgICAnXFx1MDE3OSc6ICdaJyxcclxuICAgICdcXHUxRTkwJzogJ1onLFxyXG4gICAgJ1xcdTAxN0InOiAnWicsXHJcbiAgICAnXFx1MDE3RCc6ICdaJyxcclxuICAgICdcXHUxRTkyJzogJ1onLFxyXG4gICAgJ1xcdTFFOTQnOiAnWicsXHJcbiAgICAnXFx1MDFCNSc6ICdaJyxcclxuICAgICdcXHUwMjI0JzogJ1onLFxyXG4gICAgJ1xcdTJDN0YnOiAnWicsXHJcbiAgICAnXFx1MkM2Qic6ICdaJyxcclxuICAgICdcXHVBNzYyJzogJ1onLFxyXG4gICAgJ1xcdTI0RDAnOiAnYScsXHJcbiAgICAnXFx1RkY0MSc6ICdhJyxcclxuICAgICdcXHUxRTlBJzogJ2EnLFxyXG4gICAgJ1xcdTAwRTAnOiAnYScsXHJcbiAgICAnXFx1MDBFMSc6ICdhJyxcclxuICAgICdcXHUwMEUyJzogJ2EnLFxyXG4gICAgJ1xcdTFFQTcnOiAnYScsXHJcbiAgICAnXFx1MUVBNSc6ICdhJyxcclxuICAgICdcXHUxRUFCJzogJ2EnLFxyXG4gICAgJ1xcdTFFQTknOiAnYScsXHJcbiAgICAnXFx1MDBFMyc6ICdhJyxcclxuICAgICdcXHUwMTAxJzogJ2EnLFxyXG4gICAgJ1xcdTAxMDMnOiAnYScsXHJcbiAgICAnXFx1MUVCMSc6ICdhJyxcclxuICAgICdcXHUxRUFGJzogJ2EnLFxyXG4gICAgJ1xcdTFFQjUnOiAnYScsXHJcbiAgICAnXFx1MUVCMyc6ICdhJyxcclxuICAgICdcXHUwMjI3JzogJ2EnLFxyXG4gICAgJ1xcdTAxRTEnOiAnYScsXHJcbiAgICAnXFx1MDBFNCc6ICdhJyxcclxuICAgICdcXHUwMURGJzogJ2EnLFxyXG4gICAgJ1xcdTFFQTMnOiAnYScsXHJcbiAgICAnXFx1MDBFNSc6ICdhJyxcclxuICAgICdcXHUwMUZCJzogJ2EnLFxyXG4gICAgJ1xcdTAxQ0UnOiAnYScsXHJcbiAgICAnXFx1MDIwMSc6ICdhJyxcclxuICAgICdcXHUwMjAzJzogJ2EnLFxyXG4gICAgJ1xcdTFFQTEnOiAnYScsXHJcbiAgICAnXFx1MUVBRCc6ICdhJyxcclxuICAgICdcXHUxRUI3JzogJ2EnLFxyXG4gICAgJ1xcdTFFMDEnOiAnYScsXHJcbiAgICAnXFx1MDEwNSc6ICdhJyxcclxuICAgICdcXHUyQzY1JzogJ2EnLFxyXG4gICAgJ1xcdTAyNTAnOiAnYScsXHJcbiAgICAnXFx1QTczMyc6ICdhYScsXHJcbiAgICAnXFx1MDBFNic6ICdhZScsXHJcbiAgICAnXFx1MDFGRCc6ICdhZScsXHJcbiAgICAnXFx1MDFFMyc6ICdhZScsXHJcbiAgICAnXFx1QTczNSc6ICdhbycsXHJcbiAgICAnXFx1QTczNyc6ICdhdScsXHJcbiAgICAnXFx1QTczOSc6ICdhdicsXHJcbiAgICAnXFx1QTczQic6ICdhdicsXHJcbiAgICAnXFx1QTczRCc6ICdheScsXHJcbiAgICAnXFx1MjREMSc6ICdiJyxcclxuICAgICdcXHVGRjQyJzogJ2InLFxyXG4gICAgJ1xcdTFFMDMnOiAnYicsXHJcbiAgICAnXFx1MUUwNSc6ICdiJyxcclxuICAgICdcXHUxRTA3JzogJ2InLFxyXG4gICAgJ1xcdTAxODAnOiAnYicsXHJcbiAgICAnXFx1MDE4Myc6ICdiJyxcclxuICAgICdcXHUwMjUzJzogJ2InLFxyXG4gICAgJ1xcdTI0RDInOiAnYycsXHJcbiAgICAnXFx1RkY0Myc6ICdjJyxcclxuICAgICdcXHUwMTA3JzogJ2MnLFxyXG4gICAgJ1xcdTAxMDknOiAnYycsXHJcbiAgICAnXFx1MDEwQic6ICdjJyxcclxuICAgICdcXHUwMTBEJzogJ2MnLFxyXG4gICAgJ1xcdTAwRTcnOiAnYycsXHJcbiAgICAnXFx1MUUwOSc6ICdjJyxcclxuICAgICdcXHUwMTg4JzogJ2MnLFxyXG4gICAgJ1xcdTAyM0MnOiAnYycsXHJcbiAgICAnXFx1QTczRic6ICdjJyxcclxuICAgICdcXHUyMTg0JzogJ2MnLFxyXG4gICAgJ1xcdTI0RDMnOiAnZCcsXHJcbiAgICAnXFx1RkY0NCc6ICdkJyxcclxuICAgICdcXHUxRTBCJzogJ2QnLFxyXG4gICAgJ1xcdTAxMEYnOiAnZCcsXHJcbiAgICAnXFx1MUUwRCc6ICdkJyxcclxuICAgICdcXHUxRTExJzogJ2QnLFxyXG4gICAgJ1xcdTFFMTMnOiAnZCcsXHJcbiAgICAnXFx1MUUwRic6ICdkJyxcclxuICAgICdcXHUwMTExJzogJ2QnLFxyXG4gICAgJ1xcdTAxOEMnOiAnZCcsXHJcbiAgICAnXFx1MDI1Nic6ICdkJyxcclxuICAgICdcXHUwMjU3JzogJ2QnLFxyXG4gICAgJ1xcdUE3N0EnOiAnZCcsXHJcbiAgICAnXFx1MDFGMyc6ICdkeicsXHJcbiAgICAnXFx1MDFDNic6ICdkeicsXHJcbiAgICAnXFx1MjRENCc6ICdlJyxcclxuICAgICdcXHVGRjQ1JzogJ2UnLFxyXG4gICAgJ1xcdTAwRTgnOiAnZScsXHJcbiAgICAnXFx1MDBFOSc6ICdlJyxcclxuICAgICdcXHUwMEVBJzogJ2UnLFxyXG4gICAgJ1xcdTFFQzEnOiAnZScsXHJcbiAgICAnXFx1MUVCRic6ICdlJyxcclxuICAgICdcXHUxRUM1JzogJ2UnLFxyXG4gICAgJ1xcdTFFQzMnOiAnZScsXHJcbiAgICAnXFx1MUVCRCc6ICdlJyxcclxuICAgICdcXHUwMTEzJzogJ2UnLFxyXG4gICAgJ1xcdTFFMTUnOiAnZScsXHJcbiAgICAnXFx1MUUxNyc6ICdlJyxcclxuICAgICdcXHUwMTE1JzogJ2UnLFxyXG4gICAgJ1xcdTAxMTcnOiAnZScsXHJcbiAgICAnXFx1MDBFQic6ICdlJyxcclxuICAgICdcXHUxRUJCJzogJ2UnLFxyXG4gICAgJ1xcdTAxMUInOiAnZScsXHJcbiAgICAnXFx1MDIwNSc6ICdlJyxcclxuICAgICdcXHUwMjA3JzogJ2UnLFxyXG4gICAgJ1xcdTFFQjknOiAnZScsXHJcbiAgICAnXFx1MUVDNyc6ICdlJyxcclxuICAgICdcXHUwMjI5JzogJ2UnLFxyXG4gICAgJ1xcdTFFMUQnOiAnZScsXHJcbiAgICAnXFx1MDExOSc6ICdlJyxcclxuICAgICdcXHUxRTE5JzogJ2UnLFxyXG4gICAgJ1xcdTFFMUInOiAnZScsXHJcbiAgICAnXFx1MDI0Nyc6ICdlJyxcclxuICAgICdcXHUwMjVCJzogJ2UnLFxyXG4gICAgJ1xcdTAxREQnOiAnZScsXHJcbiAgICAnXFx1MjRENSc6ICdmJyxcclxuICAgICdcXHVGRjQ2JzogJ2YnLFxyXG4gICAgJ1xcdTFFMUYnOiAnZicsXHJcbiAgICAnXFx1MDE5Mic6ICdmJyxcclxuICAgICdcXHVBNzdDJzogJ2YnLFxyXG4gICAgJ1xcdTI0RDYnOiAnZycsXHJcbiAgICAnXFx1RkY0Nyc6ICdnJyxcclxuICAgICdcXHUwMUY1JzogJ2cnLFxyXG4gICAgJ1xcdTAxMUQnOiAnZycsXHJcbiAgICAnXFx1MUUyMSc6ICdnJyxcclxuICAgICdcXHUwMTFGJzogJ2cnLFxyXG4gICAgJ1xcdTAxMjEnOiAnZycsXHJcbiAgICAnXFx1MDFFNyc6ICdnJyxcclxuICAgICdcXHUwMTIzJzogJ2cnLFxyXG4gICAgJ1xcdTAxRTUnOiAnZycsXHJcbiAgICAnXFx1MDI2MCc6ICdnJyxcclxuICAgICdcXHVBN0ExJzogJ2cnLFxyXG4gICAgJ1xcdTFENzknOiAnZycsXHJcbiAgICAnXFx1QTc3Ric6ICdnJyxcclxuICAgICdcXHUyNEQ3JzogJ2gnLFxyXG4gICAgJ1xcdUZGNDgnOiAnaCcsXHJcbiAgICAnXFx1MDEyNSc6ICdoJyxcclxuICAgICdcXHUxRTIzJzogJ2gnLFxyXG4gICAgJ1xcdTFFMjcnOiAnaCcsXHJcbiAgICAnXFx1MDIxRic6ICdoJyxcclxuICAgICdcXHUxRTI1JzogJ2gnLFxyXG4gICAgJ1xcdTFFMjknOiAnaCcsXHJcbiAgICAnXFx1MUUyQic6ICdoJyxcclxuICAgICdcXHUxRTk2JzogJ2gnLFxyXG4gICAgJ1xcdTAxMjcnOiAnaCcsXHJcbiAgICAnXFx1MkM2OCc6ICdoJyxcclxuICAgICdcXHUyQzc2JzogJ2gnLFxyXG4gICAgJ1xcdTAyNjUnOiAnaCcsXHJcbiAgICAnXFx1MDE5NSc6ICdodicsXHJcbiAgICAnXFx1MjREOCc6ICdpJyxcclxuICAgICdcXHVGRjQ5JzogJ2knLFxyXG4gICAgJ1xcdTAwRUMnOiAnaScsXHJcbiAgICAnXFx1MDBFRCc6ICdpJyxcclxuICAgICdcXHUwMEVFJzogJ2knLFxyXG4gICAgJ1xcdTAxMjknOiAnaScsXHJcbiAgICAnXFx1MDEyQic6ICdpJyxcclxuICAgICdcXHUwMTJEJzogJ2knLFxyXG4gICAgJ1xcdTAwRUYnOiAnaScsXHJcbiAgICAnXFx1MUUyRic6ICdpJyxcclxuICAgICdcXHUxRUM5JzogJ2knLFxyXG4gICAgJ1xcdTAxRDAnOiAnaScsXHJcbiAgICAnXFx1MDIwOSc6ICdpJyxcclxuICAgICdcXHUwMjBCJzogJ2knLFxyXG4gICAgJ1xcdTFFQ0InOiAnaScsXHJcbiAgICAnXFx1MDEyRic6ICdpJyxcclxuICAgICdcXHUxRTJEJzogJ2knLFxyXG4gICAgJ1xcdTAyNjgnOiAnaScsXHJcbiAgICAnXFx1MDEzMSc6ICdpJyxcclxuICAgICdcXHUyNEQ5JzogJ2onLFxyXG4gICAgJ1xcdUZGNEEnOiAnaicsXHJcbiAgICAnXFx1MDEzNSc6ICdqJyxcclxuICAgICdcXHUwMUYwJzogJ2onLFxyXG4gICAgJ1xcdTAyNDknOiAnaicsXHJcbiAgICAnXFx1MjREQSc6ICdrJyxcclxuICAgICdcXHVGRjRCJzogJ2snLFxyXG4gICAgJ1xcdTFFMzEnOiAnaycsXHJcbiAgICAnXFx1MDFFOSc6ICdrJyxcclxuICAgICdcXHUxRTMzJzogJ2snLFxyXG4gICAgJ1xcdTAxMzcnOiAnaycsXHJcbiAgICAnXFx1MUUzNSc6ICdrJyxcclxuICAgICdcXHUwMTk5JzogJ2snLFxyXG4gICAgJ1xcdTJDNkEnOiAnaycsXHJcbiAgICAnXFx1QTc0MSc6ICdrJyxcclxuICAgICdcXHVBNzQzJzogJ2snLFxyXG4gICAgJ1xcdUE3NDUnOiAnaycsXHJcbiAgICAnXFx1QTdBMyc6ICdrJyxcclxuICAgICdcXHUyNERCJzogJ2wnLFxyXG4gICAgJ1xcdUZGNEMnOiAnbCcsXHJcbiAgICAnXFx1MDE0MCc6ICdsJyxcclxuICAgICdcXHUwMTNBJzogJ2wnLFxyXG4gICAgJ1xcdTAxM0UnOiAnbCcsXHJcbiAgICAnXFx1MUUzNyc6ICdsJyxcclxuICAgICdcXHUxRTM5JzogJ2wnLFxyXG4gICAgJ1xcdTAxM0MnOiAnbCcsXHJcbiAgICAnXFx1MUUzRCc6ICdsJyxcclxuICAgICdcXHUxRTNCJzogJ2wnLFxyXG4gICAgJ1xcdTAxN0YnOiAnbCcsXHJcbiAgICAnXFx1MDE0Mic6ICdsJyxcclxuICAgICdcXHUwMTlBJzogJ2wnLFxyXG4gICAgJ1xcdTAyNkInOiAnbCcsXHJcbiAgICAnXFx1MkM2MSc6ICdsJyxcclxuICAgICdcXHVBNzQ5JzogJ2wnLFxyXG4gICAgJ1xcdUE3ODEnOiAnbCcsXHJcbiAgICAnXFx1QTc0Nyc6ICdsJyxcclxuICAgICdcXHUwMUM5JzogJ2xqJyxcclxuICAgICdcXHUyNERDJzogJ20nLFxyXG4gICAgJ1xcdUZGNEQnOiAnbScsXHJcbiAgICAnXFx1MUUzRic6ICdtJyxcclxuICAgICdcXHUxRTQxJzogJ20nLFxyXG4gICAgJ1xcdTFFNDMnOiAnbScsXHJcbiAgICAnXFx1MDI3MSc6ICdtJyxcclxuICAgICdcXHUwMjZGJzogJ20nLFxyXG4gICAgJ1xcdTI0REQnOiAnbicsXHJcbiAgICAnXFx1RkY0RSc6ICduJyxcclxuICAgICdcXHUwMUY5JzogJ24nLFxyXG4gICAgJ1xcdTAxNDQnOiAnbicsXHJcbiAgICAnXFx1MDBGMSc6ICduJyxcclxuICAgICdcXHUxRTQ1JzogJ24nLFxyXG4gICAgJ1xcdTAxNDgnOiAnbicsXHJcbiAgICAnXFx1MUU0Nyc6ICduJyxcclxuICAgICdcXHUwMTQ2JzogJ24nLFxyXG4gICAgJ1xcdTFFNEInOiAnbicsXHJcbiAgICAnXFx1MUU0OSc6ICduJyxcclxuICAgICdcXHUwMTlFJzogJ24nLFxyXG4gICAgJ1xcdTAyNzInOiAnbicsXHJcbiAgICAnXFx1MDE0OSc6ICduJyxcclxuICAgICdcXHVBNzkxJzogJ24nLFxyXG4gICAgJ1xcdUE3QTUnOiAnbicsXHJcbiAgICAnXFx1MDFDQyc6ICduaicsXHJcbiAgICAnXFx1MjRERSc6ICdvJyxcclxuICAgICdcXHVGRjRGJzogJ28nLFxyXG4gICAgJ1xcdTAwRjInOiAnbycsXHJcbiAgICAnXFx1MDBGMyc6ICdvJyxcclxuICAgICdcXHUwMEY0JzogJ28nLFxyXG4gICAgJ1xcdTFFRDMnOiAnbycsXHJcbiAgICAnXFx1MUVEMSc6ICdvJyxcclxuICAgICdcXHUxRUQ3JzogJ28nLFxyXG4gICAgJ1xcdTFFRDUnOiAnbycsXHJcbiAgICAnXFx1MDBGNSc6ICdvJyxcclxuICAgICdcXHUxRTREJzogJ28nLFxyXG4gICAgJ1xcdTAyMkQnOiAnbycsXHJcbiAgICAnXFx1MUU0Ric6ICdvJyxcclxuICAgICdcXHUwMTREJzogJ28nLFxyXG4gICAgJ1xcdTFFNTEnOiAnbycsXHJcbiAgICAnXFx1MUU1Myc6ICdvJyxcclxuICAgICdcXHUwMTRGJzogJ28nLFxyXG4gICAgJ1xcdTAyMkYnOiAnbycsXHJcbiAgICAnXFx1MDIzMSc6ICdvJyxcclxuICAgICdcXHUwMEY2JzogJ28nLFxyXG4gICAgJ1xcdTAyMkInOiAnbycsXHJcbiAgICAnXFx1MUVDRic6ICdvJyxcclxuICAgICdcXHUwMTUxJzogJ28nLFxyXG4gICAgJ1xcdTAxRDInOiAnbycsXHJcbiAgICAnXFx1MDIwRCc6ICdvJyxcclxuICAgICdcXHUwMjBGJzogJ28nLFxyXG4gICAgJ1xcdTAxQTEnOiAnbycsXHJcbiAgICAnXFx1MUVERCc6ICdvJyxcclxuICAgICdcXHUxRURCJzogJ28nLFxyXG4gICAgJ1xcdTFFRTEnOiAnbycsXHJcbiAgICAnXFx1MUVERic6ICdvJyxcclxuICAgICdcXHUxRUUzJzogJ28nLFxyXG4gICAgJ1xcdTFFQ0QnOiAnbycsXHJcbiAgICAnXFx1MUVEOSc6ICdvJyxcclxuICAgICdcXHUwMUVCJzogJ28nLFxyXG4gICAgJ1xcdTAxRUQnOiAnbycsXHJcbiAgICAnXFx1MDBGOCc6ICdvJyxcclxuICAgICdcXHUwMUZGJzogJ28nLFxyXG4gICAgJ1xcdTAyNTQnOiAnbycsXHJcbiAgICAnXFx1QTc0Qic6ICdvJyxcclxuICAgICdcXHVBNzREJzogJ28nLFxyXG4gICAgJ1xcdTAyNzUnOiAnbycsXHJcbiAgICAnXFx1MDFBMyc6ICdvaScsXHJcbiAgICAnXFx1MDIyMyc6ICdvdScsXHJcbiAgICAnXFx1QTc0Ric6ICdvbycsXHJcbiAgICAnXFx1MjRERic6ICdwJyxcclxuICAgICdcXHVGRjUwJzogJ3AnLFxyXG4gICAgJ1xcdTFFNTUnOiAncCcsXHJcbiAgICAnXFx1MUU1Nyc6ICdwJyxcclxuICAgICdcXHUwMUE1JzogJ3AnLFxyXG4gICAgJ1xcdTFEN0QnOiAncCcsXHJcbiAgICAnXFx1QTc1MSc6ICdwJyxcclxuICAgICdcXHVBNzUzJzogJ3AnLFxyXG4gICAgJ1xcdUE3NTUnOiAncCcsXHJcbiAgICAnXFx1MjRFMCc6ICdxJyxcclxuICAgICdcXHVGRjUxJzogJ3EnLFxyXG4gICAgJ1xcdTAyNEInOiAncScsXHJcbiAgICAnXFx1QTc1Nyc6ICdxJyxcclxuICAgICdcXHVBNzU5JzogJ3EnLFxyXG4gICAgJ1xcdTI0RTEnOiAncicsXHJcbiAgICAnXFx1RkY1Mic6ICdyJyxcclxuICAgICdcXHUwMTU1JzogJ3InLFxyXG4gICAgJ1xcdTFFNTknOiAncicsXHJcbiAgICAnXFx1MDE1OSc6ICdyJyxcclxuICAgICdcXHUwMjExJzogJ3InLFxyXG4gICAgJ1xcdTAyMTMnOiAncicsXHJcbiAgICAnXFx1MUU1Qic6ICdyJyxcclxuICAgICdcXHUxRTVEJzogJ3InLFxyXG4gICAgJ1xcdTAxNTcnOiAncicsXHJcbiAgICAnXFx1MUU1Ric6ICdyJyxcclxuICAgICdcXHUwMjREJzogJ3InLFxyXG4gICAgJ1xcdTAyN0QnOiAncicsXHJcbiAgICAnXFx1QTc1Qic6ICdyJyxcclxuICAgICdcXHVBN0E3JzogJ3InLFxyXG4gICAgJ1xcdUE3ODMnOiAncicsXHJcbiAgICAnXFx1MjRFMic6ICdzJyxcclxuICAgICdcXHVGRjUzJzogJ3MnLFxyXG4gICAgJ1xcdTAwREYnOiAncycsXHJcbiAgICAnXFx1MDE1Qic6ICdzJyxcclxuICAgICdcXHUxRTY1JzogJ3MnLFxyXG4gICAgJ1xcdTAxNUQnOiAncycsXHJcbiAgICAnXFx1MUU2MSc6ICdzJyxcclxuICAgICdcXHUwMTYxJzogJ3MnLFxyXG4gICAgJ1xcdTFFNjcnOiAncycsXHJcbiAgICAnXFx1MUU2Myc6ICdzJyxcclxuICAgICdcXHUxRTY5JzogJ3MnLFxyXG4gICAgJ1xcdTAyMTknOiAncycsXHJcbiAgICAnXFx1MDE1Ric6ICdzJyxcclxuICAgICdcXHUwMjNGJzogJ3MnLFxyXG4gICAgJ1xcdUE3QTknOiAncycsXHJcbiAgICAnXFx1QTc4NSc6ICdzJyxcclxuICAgICdcXHUxRTlCJzogJ3MnLFxyXG4gICAgJ1xcdTI0RTMnOiAndCcsXHJcbiAgICAnXFx1RkY1NCc6ICd0JyxcclxuICAgICdcXHUxRTZCJzogJ3QnLFxyXG4gICAgJ1xcdTFFOTcnOiAndCcsXHJcbiAgICAnXFx1MDE2NSc6ICd0JyxcclxuICAgICdcXHUxRTZEJzogJ3QnLFxyXG4gICAgJ1xcdTAyMUInOiAndCcsXHJcbiAgICAnXFx1MDE2Myc6ICd0JyxcclxuICAgICdcXHUxRTcxJzogJ3QnLFxyXG4gICAgJ1xcdTFFNkYnOiAndCcsXHJcbiAgICAnXFx1MDE2Nyc6ICd0JyxcclxuICAgICdcXHUwMUFEJzogJ3QnLFxyXG4gICAgJ1xcdTAyODgnOiAndCcsXHJcbiAgICAnXFx1MkM2Nic6ICd0JyxcclxuICAgICdcXHVBNzg3JzogJ3QnLFxyXG4gICAgJ1xcdUE3MjknOiAndHonLFxyXG4gICAgJ1xcdTI0RTQnOiAndScsXHJcbiAgICAnXFx1RkY1NSc6ICd1JyxcclxuICAgICdcXHUwMEY5JzogJ3UnLFxyXG4gICAgJ1xcdTAwRkEnOiAndScsXHJcbiAgICAnXFx1MDBGQic6ICd1JyxcclxuICAgICdcXHUwMTY5JzogJ3UnLFxyXG4gICAgJ1xcdTFFNzknOiAndScsXHJcbiAgICAnXFx1MDE2Qic6ICd1JyxcclxuICAgICdcXHUxRTdCJzogJ3UnLFxyXG4gICAgJ1xcdTAxNkQnOiAndScsXHJcbiAgICAnXFx1MDBGQyc6ICd1JyxcclxuICAgICdcXHUwMURDJzogJ3UnLFxyXG4gICAgJ1xcdTAxRDgnOiAndScsXHJcbiAgICAnXFx1MDFENic6ICd1JyxcclxuICAgICdcXHUwMURBJzogJ3UnLFxyXG4gICAgJ1xcdTFFRTcnOiAndScsXHJcbiAgICAnXFx1MDE2Ric6ICd1JyxcclxuICAgICdcXHUwMTcxJzogJ3UnLFxyXG4gICAgJ1xcdTAxRDQnOiAndScsXHJcbiAgICAnXFx1MDIxNSc6ICd1JyxcclxuICAgICdcXHUwMjE3JzogJ3UnLFxyXG4gICAgJ1xcdTAxQjAnOiAndScsXHJcbiAgICAnXFx1MUVFQic6ICd1JyxcclxuICAgICdcXHUxRUU5JzogJ3UnLFxyXG4gICAgJ1xcdTFFRUYnOiAndScsXHJcbiAgICAnXFx1MUVFRCc6ICd1JyxcclxuICAgICdcXHUxRUYxJzogJ3UnLFxyXG4gICAgJ1xcdTFFRTUnOiAndScsXHJcbiAgICAnXFx1MUU3Myc6ICd1JyxcclxuICAgICdcXHUwMTczJzogJ3UnLFxyXG4gICAgJ1xcdTFFNzcnOiAndScsXHJcbiAgICAnXFx1MUU3NSc6ICd1JyxcclxuICAgICdcXHUwMjg5JzogJ3UnLFxyXG4gICAgJ1xcdTI0RTUnOiAndicsXHJcbiAgICAnXFx1RkY1Nic6ICd2JyxcclxuICAgICdcXHUxRTdEJzogJ3YnLFxyXG4gICAgJ1xcdTFFN0YnOiAndicsXHJcbiAgICAnXFx1MDI4Qic6ICd2JyxcclxuICAgICdcXHVBNzVGJzogJ3YnLFxyXG4gICAgJ1xcdTAyOEMnOiAndicsXHJcbiAgICAnXFx1QTc2MSc6ICd2eScsXHJcbiAgICAnXFx1MjRFNic6ICd3JyxcclxuICAgICdcXHVGRjU3JzogJ3cnLFxyXG4gICAgJ1xcdTFFODEnOiAndycsXHJcbiAgICAnXFx1MUU4Myc6ICd3JyxcclxuICAgICdcXHUwMTc1JzogJ3cnLFxyXG4gICAgJ1xcdTFFODcnOiAndycsXHJcbiAgICAnXFx1MUU4NSc6ICd3JyxcclxuICAgICdcXHUxRTk4JzogJ3cnLFxyXG4gICAgJ1xcdTFFODknOiAndycsXHJcbiAgICAnXFx1MkM3Myc6ICd3JyxcclxuICAgICdcXHUyNEU3JzogJ3gnLFxyXG4gICAgJ1xcdUZGNTgnOiAneCcsXHJcbiAgICAnXFx1MUU4Qic6ICd4JyxcclxuICAgICdcXHUxRThEJzogJ3gnLFxyXG4gICAgJ1xcdTI0RTgnOiAneScsXHJcbiAgICAnXFx1RkY1OSc6ICd5JyxcclxuICAgICdcXHUxRUYzJzogJ3knLFxyXG4gICAgJ1xcdTAwRkQnOiAneScsXHJcbiAgICAnXFx1MDE3Nyc6ICd5JyxcclxuICAgICdcXHUxRUY5JzogJ3knLFxyXG4gICAgJ1xcdTAyMzMnOiAneScsXHJcbiAgICAnXFx1MUU4Ric6ICd5JyxcclxuICAgICdcXHUwMEZGJzogJ3knLFxyXG4gICAgJ1xcdTFFRjcnOiAneScsXHJcbiAgICAnXFx1MUU5OSc6ICd5JyxcclxuICAgICdcXHUxRUY1JzogJ3knLFxyXG4gICAgJ1xcdTAxQjQnOiAneScsXHJcbiAgICAnXFx1MDI0Ric6ICd5JyxcclxuICAgICdcXHUxRUZGJzogJ3knLFxyXG4gICAgJ1xcdTI0RTknOiAneicsXHJcbiAgICAnXFx1RkY1QSc6ICd6JyxcclxuICAgICdcXHUwMTdBJzogJ3onLFxyXG4gICAgJ1xcdTFFOTEnOiAneicsXHJcbiAgICAnXFx1MDE3Qyc6ICd6JyxcclxuICAgICdcXHUwMTdFJzogJ3onLFxyXG4gICAgJ1xcdTFFOTMnOiAneicsXHJcbiAgICAnXFx1MUU5NSc6ICd6JyxcclxuICAgICdcXHUwMUI2JzogJ3onLFxyXG4gICAgJ1xcdTAyMjUnOiAneicsXHJcbiAgICAnXFx1MDI0MCc6ICd6JyxcclxuICAgICdcXHUyQzZDJzogJ3onLFxyXG4gICAgJ1xcdUE3NjMnOiAneicsXHJcbiAgICAnXFx1MDM4Nic6ICdcXHUwMzkxJyxcclxuICAgICdcXHUwMzg4JzogJ1xcdTAzOTUnLFxyXG4gICAgJ1xcdTAzODknOiAnXFx1MDM5NycsXHJcbiAgICAnXFx1MDM4QSc6ICdcXHUwMzk5JyxcclxuICAgICdcXHUwM0FBJzogJ1xcdTAzOTknLFxyXG4gICAgJ1xcdTAzOEMnOiAnXFx1MDM5RicsXHJcbiAgICAnXFx1MDM4RSc6ICdcXHUwM0E1JyxcclxuICAgICdcXHUwM0FCJzogJ1xcdTAzQTUnLFxyXG4gICAgJ1xcdTAzOEYnOiAnXFx1MDNBOScsXHJcbiAgICAnXFx1MDNBQyc6ICdcXHUwM0IxJyxcclxuICAgICdcXHUwM0FEJzogJ1xcdTAzQjUnLFxyXG4gICAgJ1xcdTAzQUUnOiAnXFx1MDNCNycsXHJcbiAgICAnXFx1MDNBRic6ICdcXHUwM0I5JyxcclxuICAgICdcXHUwM0NBJzogJ1xcdTAzQjknLFxyXG4gICAgJ1xcdTAzOTAnOiAnXFx1MDNCOScsXHJcbiAgICAnXFx1MDNDQyc6ICdcXHUwM0JGJyxcclxuICAgICdcXHUwM0NEJzogJ1xcdTAzQzUnLFxyXG4gICAgJ1xcdTAzQ0InOiAnXFx1MDNDNScsXHJcbiAgICAnXFx1MDNCMCc6ICdcXHUwM0M1JyxcclxuICAgICdcXHUwM0M5JzogJ1xcdTAzQzknLFxyXG4gICAgJ1xcdTAzQzInOiAnXFx1MDNDMydcclxuICB9O1xyXG5cclxuICByZXR1cm4gZGlhY3JpdGljcztcclxufSk7XHJcblxyXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZGF0YS9iYXNlJyxbXHJcbiAgJy4uL3V0aWxzJ1xyXG5dLCBmdW5jdGlvbiAoVXRpbHMpIHtcclxuICBmdW5jdGlvbiBCYXNlQWRhcHRlciAoJGVsZW1lbnQsIG9wdGlvbnMpIHtcclxuICAgIEJhc2VBZGFwdGVyLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgVXRpbHMuRXh0ZW5kKEJhc2VBZGFwdGVyLCBVdGlscy5PYnNlcnZhYmxlKTtcclxuXHJcbiAgQmFzZUFkYXB0ZXIucHJvdG90eXBlLmN1cnJlbnQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignVGhlIGBjdXJyZW50YCBtZXRob2QgbXVzdCBiZSBkZWZpbmVkIGluIGNoaWxkIGNsYXNzZXMuJyk7XHJcbiAgfTtcclxuXHJcbiAgQmFzZUFkYXB0ZXIucHJvdG90eXBlLnF1ZXJ5ID0gZnVuY3Rpb24gKHBhcmFtcywgY2FsbGJhY2spIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignVGhlIGBxdWVyeWAgbWV0aG9kIG11c3QgYmUgZGVmaW5lZCBpbiBjaGlsZCBjbGFzc2VzLicpO1xyXG4gIH07XHJcblxyXG4gIEJhc2VBZGFwdGVyLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xyXG4gICAgLy8gQ2FuIGJlIGltcGxlbWVudGVkIGluIHN1YmNsYXNzZXNcclxuICB9O1xyXG5cclxuICBCYXNlQWRhcHRlci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIENhbiBiZSBpbXBsZW1lbnRlZCBpbiBzdWJjbGFzc2VzXHJcbiAgfTtcclxuXHJcbiAgQmFzZUFkYXB0ZXIucHJvdG90eXBlLmdlbmVyYXRlUmVzdWx0SWQgPSBmdW5jdGlvbiAoY29udGFpbmVyLCBkYXRhKSB7XHJcbiAgICB2YXIgaWQgPSBjb250YWluZXIuaWQgKyAnLXJlc3VsdC0nO1xyXG5cclxuICAgIGlkICs9IFV0aWxzLmdlbmVyYXRlQ2hhcnMoNCk7XHJcblxyXG4gICAgaWYgKGRhdGEuaWQgIT0gbnVsbCkge1xyXG4gICAgICBpZCArPSAnLScgKyBkYXRhLmlkLnRvU3RyaW5nKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZCArPSAnLScgKyBVdGlscy5nZW5lcmF0ZUNoYXJzKDQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGlkO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBCYXNlQWRhcHRlcjtcclxufSk7XHJcblxyXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZGF0YS9zZWxlY3QnLFtcclxuICAnLi9iYXNlJyxcclxuICAnLi4vdXRpbHMnLFxyXG4gICdqcXVlcnknXHJcbl0sIGZ1bmN0aW9uIChCYXNlQWRhcHRlciwgVXRpbHMsICQpIHtcclxuICBmdW5jdGlvbiBTZWxlY3RBZGFwdGVyICgkZWxlbWVudCwgb3B0aW9ucykge1xyXG4gICAgdGhpcy4kZWxlbWVudCA9ICRlbGVtZW50O1xyXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcclxuXHJcbiAgICBTZWxlY3RBZGFwdGVyLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgVXRpbHMuRXh0ZW5kKFNlbGVjdEFkYXB0ZXIsIEJhc2VBZGFwdGVyKTtcclxuXHJcbiAgU2VsZWN0QWRhcHRlci5wcm90b3R5cGUuY3VycmVudCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgdmFyIGRhdGEgPSBbXTtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICB0aGlzLiRlbGVtZW50LmZpbmQoJzpzZWxlY3RlZCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgJG9wdGlvbiA9ICQodGhpcyk7XHJcblxyXG4gICAgICB2YXIgb3B0aW9uID0gc2VsZi5pdGVtKCRvcHRpb24pO1xyXG5cclxuICAgICAgZGF0YS5wdXNoKG9wdGlvbik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjYWxsYmFjayhkYXRhKTtcclxuICB9O1xyXG5cclxuICBTZWxlY3RBZGFwdGVyLnByb3RvdHlwZS5zZWxlY3QgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIGRhdGEuc2VsZWN0ZWQgPSB0cnVlO1xyXG5cclxuICAgIC8vIElmIGRhdGEuZWxlbWVudCBpcyBhIERPTSBub2RlLCB1c2UgaXQgaW5zdGVhZFxyXG4gICAgaWYgKCQoZGF0YS5lbGVtZW50KS5pcygnb3B0aW9uJykpIHtcclxuICAgICAgZGF0YS5lbGVtZW50LnNlbGVjdGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignY2hhbmdlJyk7XHJcblxyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuJGVsZW1lbnQucHJvcCgnbXVsdGlwbGUnKSkge1xyXG4gICAgICB0aGlzLmN1cnJlbnQoZnVuY3Rpb24gKGN1cnJlbnREYXRhKSB7XHJcbiAgICAgICAgdmFyIHZhbCA9IFtdO1xyXG5cclxuICAgICAgICBkYXRhID0gW2RhdGFdO1xyXG4gICAgICAgIGRhdGEucHVzaC5hcHBseShkYXRhLCBjdXJyZW50RGF0YSk7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGQgPSAwOyBkIDwgZGF0YS5sZW5ndGg7IGQrKykge1xyXG4gICAgICAgICAgdmFyIGlkID0gZGF0YVtkXS5pZDtcclxuXHJcbiAgICAgICAgICBpZiAoJC5pbkFycmF5KGlkLCB2YWwpID09PSAtMSkge1xyXG4gICAgICAgICAgICB2YWwucHVzaChpZCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZWxmLiRlbGVtZW50LnZhbCh2YWwpO1xyXG4gICAgICAgIHNlbGYuJGVsZW1lbnQudHJpZ2dlcignY2hhbmdlJyk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmFyIHZhbCA9IGRhdGEuaWQ7XHJcblxyXG4gICAgICB0aGlzLiRlbGVtZW50LnZhbCh2YWwpO1xyXG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2NoYW5nZScpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIFNlbGVjdEFkYXB0ZXIucHJvdG90eXBlLnVuc2VsZWN0ID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICBpZiAoIXRoaXMuJGVsZW1lbnQucHJvcCgnbXVsdGlwbGUnKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZGF0YS5zZWxlY3RlZCA9IGZhbHNlO1xyXG5cclxuICAgIGlmICgkKGRhdGEuZWxlbWVudCkuaXMoJ29wdGlvbicpKSB7XHJcbiAgICAgIGRhdGEuZWxlbWVudC5zZWxlY3RlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdjaGFuZ2UnKTtcclxuXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmN1cnJlbnQoZnVuY3Rpb24gKGN1cnJlbnREYXRhKSB7XHJcbiAgICAgIHZhciB2YWwgPSBbXTtcclxuXHJcbiAgICAgIGZvciAodmFyIGQgPSAwOyBkIDwgY3VycmVudERhdGEubGVuZ3RoOyBkKyspIHtcclxuICAgICAgICB2YXIgaWQgPSBjdXJyZW50RGF0YVtkXS5pZDtcclxuXHJcbiAgICAgICAgaWYgKGlkICE9PSBkYXRhLmlkICYmICQuaW5BcnJheShpZCwgdmFsKSA9PT0gLTEpIHtcclxuICAgICAgICAgIHZhbC5wdXNoKGlkKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNlbGYuJGVsZW1lbnQudmFsKHZhbCk7XHJcblxyXG4gICAgICBzZWxmLiRlbGVtZW50LnRyaWdnZXIoJ2NoYW5nZScpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgU2VsZWN0QWRhcHRlci5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChjb250YWluZXIsICRjb250YWluZXIpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuXHJcbiAgICBjb250YWluZXIub24oJ3NlbGVjdCcsIGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgc2VsZi5zZWxlY3QocGFyYW1zLmRhdGEpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29udGFpbmVyLm9uKCd1bnNlbGVjdCcsIGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgc2VsZi51bnNlbGVjdChwYXJhbXMuZGF0YSk7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBTZWxlY3RBZGFwdGVyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gUmVtb3ZlIGFueXRoaW5nIGFkZGVkIHRvIGNoaWxkIGVsZW1lbnRzXHJcbiAgICB0aGlzLiRlbGVtZW50LmZpbmQoJyonKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgLy8gUmVtb3ZlIGFueSBjdXN0b20gZGF0YSBzZXQgYnkgU2VsZWN0MlxyXG4gICAgICAkLnJlbW92ZURhdGEodGhpcywgJ2RhdGEnKTtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIFNlbGVjdEFkYXB0ZXIucHJvdG90eXBlLnF1ZXJ5ID0gZnVuY3Rpb24gKHBhcmFtcywgY2FsbGJhY2spIHtcclxuICAgIHZhciBkYXRhID0gW107XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgdmFyICRvcHRpb25zID0gdGhpcy4kZWxlbWVudC5jaGlsZHJlbigpO1xyXG5cclxuICAgICRvcHRpb25zLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgJG9wdGlvbiA9ICQodGhpcyk7XHJcblxyXG4gICAgICBpZiAoISRvcHRpb24uaXMoJ29wdGlvbicpICYmICEkb3B0aW9uLmlzKCdvcHRncm91cCcpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgb3B0aW9uID0gc2VsZi5pdGVtKCRvcHRpb24pO1xyXG5cclxuICAgICAgdmFyIG1hdGNoZXMgPSBzZWxmLm1hdGNoZXMocGFyYW1zLCBvcHRpb24pO1xyXG5cclxuICAgICAgaWYgKG1hdGNoZXMgIT09IG51bGwpIHtcclxuICAgICAgICBkYXRhLnB1c2gobWF0Y2hlcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGNhbGxiYWNrKHtcclxuICAgICAgcmVzdWx0czogZGF0YVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgU2VsZWN0QWRhcHRlci5wcm90b3R5cGUuYWRkT3B0aW9ucyA9IGZ1bmN0aW9uICgkb3B0aW9ucykge1xyXG4gICAgVXRpbHMuYXBwZW5kTWFueSh0aGlzLiRlbGVtZW50LCAkb3B0aW9ucyk7XHJcbiAgfTtcclxuXHJcbiAgU2VsZWN0QWRhcHRlci5wcm90b3R5cGUub3B0aW9uID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgIHZhciBvcHRpb247XHJcblxyXG4gICAgaWYgKGRhdGEuY2hpbGRyZW4pIHtcclxuICAgICAgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0Z3JvdXAnKTtcclxuICAgICAgb3B0aW9uLmxhYmVsID0gZGF0YS50ZXh0O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcblxyXG4gICAgICBpZiAob3B0aW9uLnRleHRDb250ZW50ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBvcHRpb24udGV4dENvbnRlbnQgPSBkYXRhLnRleHQ7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb3B0aW9uLmlubmVyVGV4dCA9IGRhdGEudGV4dDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChkYXRhLmlkKSB7XHJcbiAgICAgIG9wdGlvbi52YWx1ZSA9IGRhdGEuaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRhdGEuZGlzYWJsZWQpIHtcclxuICAgICAgb3B0aW9uLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZGF0YS5zZWxlY3RlZCkge1xyXG4gICAgICBvcHRpb24uc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkYXRhLnRpdGxlKSB7XHJcbiAgICAgIG9wdGlvbi50aXRsZSA9IGRhdGEudGl0bGU7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyICRvcHRpb24gPSAkKG9wdGlvbik7XHJcblxyXG4gICAgdmFyIG5vcm1hbGl6ZWREYXRhID0gdGhpcy5fbm9ybWFsaXplSXRlbShkYXRhKTtcclxuICAgIG5vcm1hbGl6ZWREYXRhLmVsZW1lbnQgPSBvcHRpb247XHJcblxyXG4gICAgLy8gT3ZlcnJpZGUgdGhlIG9wdGlvbidzIGRhdGEgd2l0aCB0aGUgY29tYmluZWQgZGF0YVxyXG4gICAgJC5kYXRhKG9wdGlvbiwgJ2RhdGEnLCBub3JtYWxpemVkRGF0YSk7XHJcblxyXG4gICAgcmV0dXJuICRvcHRpb247XHJcbiAgfTtcclxuXHJcbiAgU2VsZWN0QWRhcHRlci5wcm90b3R5cGUuaXRlbSA9IGZ1bmN0aW9uICgkb3B0aW9uKSB7XHJcbiAgICB2YXIgZGF0YSA9IHt9O1xyXG5cclxuICAgIGRhdGEgPSAkLmRhdGEoJG9wdGlvblswXSwgJ2RhdGEnKTtcclxuXHJcbiAgICBpZiAoZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkb3B0aW9uLmlzKCdvcHRpb24nKSkge1xyXG4gICAgICBkYXRhID0ge1xyXG4gICAgICAgIGlkOiAkb3B0aW9uLnZhbCgpLFxyXG4gICAgICAgIHRleHQ6ICRvcHRpb24udGV4dCgpLFxyXG4gICAgICAgIGRpc2FibGVkOiAkb3B0aW9uLnByb3AoJ2Rpc2FibGVkJyksXHJcbiAgICAgICAgc2VsZWN0ZWQ6ICRvcHRpb24ucHJvcCgnc2VsZWN0ZWQnKSxcclxuICAgICAgICB0aXRsZTogJG9wdGlvbi5wcm9wKCd0aXRsZScpXHJcbiAgICAgIH07XHJcbiAgICB9IGVsc2UgaWYgKCRvcHRpb24uaXMoJ29wdGdyb3VwJykpIHtcclxuICAgICAgZGF0YSA9IHtcclxuICAgICAgICB0ZXh0OiAkb3B0aW9uLnByb3AoJ2xhYmVsJyksXHJcbiAgICAgICAgY2hpbGRyZW46IFtdLFxyXG4gICAgICAgIHRpdGxlOiAkb3B0aW9uLnByb3AoJ3RpdGxlJylcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHZhciAkY2hpbGRyZW4gPSAkb3B0aW9uLmNoaWxkcmVuKCdvcHRpb24nKTtcclxuICAgICAgdmFyIGNoaWxkcmVuID0gW107XHJcblxyXG4gICAgICBmb3IgKHZhciBjID0gMDsgYyA8ICRjaGlsZHJlbi5sZW5ndGg7IGMrKykge1xyXG4gICAgICAgIHZhciAkY2hpbGQgPSAkKCRjaGlsZHJlbltjXSk7XHJcblxyXG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuaXRlbSgkY2hpbGQpO1xyXG5cclxuICAgICAgICBjaGlsZHJlbi5wdXNoKGNoaWxkKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YS5jaGlsZHJlbiA9IGNoaWxkcmVuO1xyXG4gICAgfVxyXG5cclxuICAgIGRhdGEgPSB0aGlzLl9ub3JtYWxpemVJdGVtKGRhdGEpO1xyXG4gICAgZGF0YS5lbGVtZW50ID0gJG9wdGlvblswXTtcclxuXHJcbiAgICAkLmRhdGEoJG9wdGlvblswXSwgJ2RhdGEnLCBkYXRhKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9O1xyXG5cclxuICBTZWxlY3RBZGFwdGVyLnByb3RvdHlwZS5fbm9ybWFsaXplSXRlbSA9IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICBpZiAoISQuaXNQbGFpbk9iamVjdChpdGVtKSkge1xyXG4gICAgICBpdGVtID0ge1xyXG4gICAgICAgIGlkOiBpdGVtLFxyXG4gICAgICAgIHRleHQ6IGl0ZW1cclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBpdGVtID0gJC5leHRlbmQoe30sIHtcclxuICAgICAgdGV4dDogJydcclxuICAgIH0sIGl0ZW0pO1xyXG5cclxuICAgIHZhciBkZWZhdWx0cyA9IHtcclxuICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxyXG4gICAgICBkaXNhYmxlZDogZmFsc2VcclxuICAgIH07XHJcblxyXG4gICAgaWYgKGl0ZW0uaWQgIT0gbnVsbCkge1xyXG4gICAgICBpdGVtLmlkID0gaXRlbS5pZC50b1N0cmluZygpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpdGVtLnRleHQgIT0gbnVsbCkge1xyXG4gICAgICBpdGVtLnRleHQgPSBpdGVtLnRleHQudG9TdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXRlbS5fcmVzdWx0SWQgPT0gbnVsbCAmJiBpdGVtLmlkICYmIHRoaXMuY29udGFpbmVyICE9IG51bGwpIHtcclxuICAgICAgaXRlbS5fcmVzdWx0SWQgPSB0aGlzLmdlbmVyYXRlUmVzdWx0SWQodGhpcy5jb250YWluZXIsIGl0ZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsIGl0ZW0pO1xyXG4gIH07XHJcblxyXG4gIFNlbGVjdEFkYXB0ZXIucHJvdG90eXBlLm1hdGNoZXMgPSBmdW5jdGlvbiAocGFyYW1zLCBkYXRhKSB7XHJcbiAgICB2YXIgbWF0Y2hlciA9IHRoaXMub3B0aW9ucy5nZXQoJ21hdGNoZXInKTtcclxuXHJcbiAgICByZXR1cm4gbWF0Y2hlcihwYXJhbXMsIGRhdGEpO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBTZWxlY3RBZGFwdGVyO1xyXG59KTtcclxuXHJcblMyLmRlZmluZSgnc2VsZWN0Mi9kYXRhL2FycmF5JyxbXHJcbiAgJy4vc2VsZWN0JyxcclxuICAnLi4vdXRpbHMnLFxyXG4gICdqcXVlcnknXHJcbl0sIGZ1bmN0aW9uIChTZWxlY3RBZGFwdGVyLCBVdGlscywgJCkge1xyXG4gIGZ1bmN0aW9uIEFycmF5QWRhcHRlciAoJGVsZW1lbnQsIG9wdGlvbnMpIHtcclxuICAgIHZhciBkYXRhID0gb3B0aW9ucy5nZXQoJ2RhdGEnKSB8fCBbXTtcclxuXHJcbiAgICBBcnJheUFkYXB0ZXIuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgJGVsZW1lbnQsIG9wdGlvbnMpO1xyXG5cclxuICAgIHRoaXMuYWRkT3B0aW9ucyh0aGlzLmNvbnZlcnRUb09wdGlvbnMoZGF0YSkpO1xyXG4gIH1cclxuXHJcbiAgVXRpbHMuRXh0ZW5kKEFycmF5QWRhcHRlciwgU2VsZWN0QWRhcHRlcik7XHJcblxyXG4gIEFycmF5QWRhcHRlci5wcm90b3R5cGUuc2VsZWN0ID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgIHZhciAkb3B0aW9uID0gdGhpcy4kZWxlbWVudC5maW5kKCdvcHRpb24nKS5maWx0ZXIoZnVuY3Rpb24gKGksIGVsbSkge1xyXG4gICAgICByZXR1cm4gZWxtLnZhbHVlID09IGRhdGEuaWQudG9TdHJpbmcoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGlmICgkb3B0aW9uLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAkb3B0aW9uID0gdGhpcy5vcHRpb24oZGF0YSk7XHJcblxyXG4gICAgICB0aGlzLmFkZE9wdGlvbnMoJG9wdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgQXJyYXlBZGFwdGVyLl9fc3VwZXJfXy5zZWxlY3QuY2FsbCh0aGlzLCBkYXRhKTtcclxuICB9O1xyXG5cclxuICBBcnJheUFkYXB0ZXIucHJvdG90eXBlLmNvbnZlcnRUb09wdGlvbnMgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHZhciAkZXhpc3RpbmcgPSB0aGlzLiRlbGVtZW50LmZpbmQoJ29wdGlvbicpO1xyXG4gICAgdmFyIGV4aXN0aW5nSWRzID0gJGV4aXN0aW5nLm1hcChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiBzZWxmLml0ZW0oJCh0aGlzKSkuaWQ7XHJcbiAgICB9KS5nZXQoKTtcclxuXHJcbiAgICB2YXIgJG9wdGlvbnMgPSBbXTtcclxuXHJcbiAgICAvLyBGaWx0ZXIgb3V0IGFsbCBpdGVtcyBleGNlcHQgZm9yIHRoZSBvbmUgcGFzc2VkIGluIHRoZSBhcmd1bWVudFxyXG4gICAgZnVuY3Rpb24gb25seUl0ZW0gKGl0ZW0pIHtcclxuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gJCh0aGlzKS52YWwoKSA9PSBpdGVtLmlkO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAodmFyIGQgPSAwOyBkIDwgZGF0YS5sZW5ndGg7IGQrKykge1xyXG4gICAgICB2YXIgaXRlbSA9IHRoaXMuX25vcm1hbGl6ZUl0ZW0oZGF0YVtkXSk7XHJcblxyXG4gICAgICAvLyBTa2lwIGl0ZW1zIHdoaWNoIHdlcmUgcHJlLWxvYWRlZCwgb25seSBtZXJnZSB0aGUgZGF0YVxyXG4gICAgICBpZiAoJC5pbkFycmF5KGl0ZW0uaWQsIGV4aXN0aW5nSWRzKSA+PSAwKSB7XHJcbiAgICAgICAgdmFyICRleGlzdGluZ09wdGlvbiA9ICRleGlzdGluZy5maWx0ZXIob25seUl0ZW0oaXRlbSkpO1xyXG5cclxuICAgICAgICB2YXIgZXhpc3RpbmdEYXRhID0gdGhpcy5pdGVtKCRleGlzdGluZ09wdGlvbik7XHJcbiAgICAgICAgdmFyIG5ld0RhdGEgPSAkLmV4dGVuZCh0cnVlLCB7fSwgaXRlbSwgZXhpc3RpbmdEYXRhKTtcclxuXHJcbiAgICAgICAgdmFyICRuZXdPcHRpb24gPSB0aGlzLm9wdGlvbihuZXdEYXRhKTtcclxuXHJcbiAgICAgICAgJGV4aXN0aW5nT3B0aW9uLnJlcGxhY2VXaXRoKCRuZXdPcHRpb24pO1xyXG5cclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyICRvcHRpb24gPSB0aGlzLm9wdGlvbihpdGVtKTtcclxuXHJcbiAgICAgIGlmIChpdGVtLmNoaWxkcmVuKSB7XHJcbiAgICAgICAgdmFyICRjaGlsZHJlbiA9IHRoaXMuY29udmVydFRvT3B0aW9ucyhpdGVtLmNoaWxkcmVuKTtcclxuXHJcbiAgICAgICAgVXRpbHMuYXBwZW5kTWFueSgkb3B0aW9uLCAkY2hpbGRyZW4pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkb3B0aW9ucy5wdXNoKCRvcHRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAkb3B0aW9ucztcclxuICB9O1xyXG5cclxuICByZXR1cm4gQXJyYXlBZGFwdGVyO1xyXG59KTtcclxuXHJcblMyLmRlZmluZSgnc2VsZWN0Mi9kYXRhL2FqYXgnLFtcclxuICAnLi9hcnJheScsXHJcbiAgJy4uL3V0aWxzJyxcclxuICAnanF1ZXJ5J1xyXG5dLCBmdW5jdGlvbiAoQXJyYXlBZGFwdGVyLCBVdGlscywgJCkge1xyXG4gIGZ1bmN0aW9uIEFqYXhBZGFwdGVyICgkZWxlbWVudCwgb3B0aW9ucykge1xyXG4gICAgdGhpcy5hamF4T3B0aW9ucyA9IHRoaXMuX2FwcGx5RGVmYXVsdHMob3B0aW9ucy5nZXQoJ2FqYXgnKSk7XHJcblxyXG4gICAgaWYgKHRoaXMuYWpheE9wdGlvbnMucHJvY2Vzc1Jlc3VsdHMgIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLnByb2Nlc3NSZXN1bHRzID0gdGhpcy5hamF4T3B0aW9ucy5wcm9jZXNzUmVzdWx0cztcclxuICAgIH1cclxuXHJcbiAgICBBamF4QWRhcHRlci5fX3N1cGVyX18uY29uc3RydWN0b3IuY2FsbCh0aGlzLCAkZWxlbWVudCwgb3B0aW9ucyk7XHJcbiAgfVxyXG5cclxuICBVdGlscy5FeHRlbmQoQWpheEFkYXB0ZXIsIEFycmF5QWRhcHRlcik7XHJcblxyXG4gIEFqYXhBZGFwdGVyLnByb3RvdHlwZS5fYXBwbHlEZWZhdWx0cyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB2YXIgZGVmYXVsdHMgPSB7XHJcbiAgICAgIGRhdGE6IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgICByZXR1cm4gJC5leHRlbmQoe30sIHBhcmFtcywge1xyXG4gICAgICAgICAgcTogcGFyYW1zLnRlcm1cclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuICAgICAgdHJhbnNwb3J0OiBmdW5jdGlvbiAocGFyYW1zLCBzdWNjZXNzLCBmYWlsdXJlKSB7XHJcbiAgICAgICAgdmFyICRyZXF1ZXN0ID0gJC5hamF4KHBhcmFtcyk7XHJcblxyXG4gICAgICAgICRyZXF1ZXN0LnRoZW4oc3VjY2Vzcyk7XHJcbiAgICAgICAgJHJlcXVlc3QuZmFpbChmYWlsdXJlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuICRyZXF1ZXN0O1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWUpO1xyXG4gIH07XHJcblxyXG4gIEFqYXhBZGFwdGVyLnByb3RvdHlwZS5wcm9jZXNzUmVzdWx0cyA9IGZ1bmN0aW9uIChyZXN1bHRzKSB7XHJcbiAgICByZXR1cm4gcmVzdWx0cztcclxuICB9O1xyXG5cclxuICBBamF4QWRhcHRlci5wcm90b3R5cGUucXVlcnkgPSBmdW5jdGlvbiAocGFyYW1zLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIG1hdGNoZXMgPSBbXTtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICBpZiAodGhpcy5fcmVxdWVzdCAhPSBudWxsKSB7XHJcbiAgICAgIC8vIEpTT05QIHJlcXVlc3RzIGNhbm5vdCBhbHdheXMgYmUgYWJvcnRlZFxyXG4gICAgICBpZiAoJC5pc0Z1bmN0aW9uKHRoaXMuX3JlcXVlc3QuYWJvcnQpKSB7XHJcbiAgICAgICAgdGhpcy5fcmVxdWVzdC5hYm9ydCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLl9yZXF1ZXN0ID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgb3B0aW9ucyA9ICQuZXh0ZW5kKHtcclxuICAgICAgdHlwZTogJ0dFVCdcclxuICAgIH0sIHRoaXMuYWpheE9wdGlvbnMpO1xyXG5cclxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy51cmwgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgb3B0aW9ucy51cmwgPSBvcHRpb25zLnVybC5jYWxsKHRoaXMuJGVsZW1lbnQsIHBhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLmRhdGEgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgb3B0aW9ucy5kYXRhID0gb3B0aW9ucy5kYXRhLmNhbGwodGhpcy4kZWxlbWVudCwgcGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZXF1ZXN0ICgpIHtcclxuICAgICAgdmFyICRyZXF1ZXN0ID0gb3B0aW9ucy50cmFuc3BvcnQob3B0aW9ucywgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICB2YXIgcmVzdWx0cyA9IHNlbGYucHJvY2Vzc1Jlc3VsdHMoZGF0YSwgcGFyYW1zKTtcclxuXHJcbiAgICAgICAgaWYgKHNlbGYub3B0aW9ucy5nZXQoJ2RlYnVnJykgJiYgd2luZG93LmNvbnNvbGUgJiYgY29uc29sZS5lcnJvcikge1xyXG4gICAgICAgICAgLy8gQ2hlY2sgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIHJlc3BvbnNlIGluY2x1ZGVkIGEgYHJlc3VsdHNgIGtleS5cclxuICAgICAgICAgIGlmICghcmVzdWx0cyB8fCAhcmVzdWx0cy5yZXN1bHRzIHx8ICEkLmlzQXJyYXkocmVzdWx0cy5yZXN1bHRzKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFxyXG4gICAgICAgICAgICAgICdTZWxlY3QyOiBUaGUgQUpBWCByZXN1bHRzIGRpZCBub3QgcmV0dXJuIGFuIGFycmF5IGluIHRoZSAnICtcclxuICAgICAgICAgICAgICAnYHJlc3VsdHNgIGtleSBvZiB0aGUgcmVzcG9uc2UuJ1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2FsbGJhY2socmVzdWx0cyk7XHJcbiAgICAgIH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyBBdHRlbXB0IHRvIGRldGVjdCBpZiBhIHJlcXVlc3Qgd2FzIGFib3J0ZWRcclxuICAgICAgICAvLyBPbmx5IHdvcmtzIGlmIHRoZSB0cmFuc3BvcnQgZXhwb3NlcyBhIHN0YXR1cyBwcm9wZXJ0eVxyXG4gICAgICAgIGlmICgkcmVxdWVzdC5zdGF0dXMgJiYgJHJlcXVlc3Quc3RhdHVzID09PSAnMCcpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlbGYudHJpZ2dlcigncmVzdWx0czptZXNzYWdlJywge1xyXG4gICAgICAgICAgbWVzc2FnZTogJ2Vycm9yTG9hZGluZydcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBzZWxmLl9yZXF1ZXN0ID0gJHJlcXVlc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuYWpheE9wdGlvbnMuZGVsYXkgJiYgcGFyYW1zLnRlcm0gIT0gbnVsbCkge1xyXG4gICAgICBpZiAodGhpcy5fcXVlcnlUaW1lb3V0KSB7XHJcbiAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLl9xdWVyeVRpbWVvdXQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLl9xdWVyeVRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dChyZXF1ZXN0LCB0aGlzLmFqYXhPcHRpb25zLmRlbGF5KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlcXVlc3QoKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICByZXR1cm4gQWpheEFkYXB0ZXI7XHJcbn0pO1xyXG5cclxuUzIuZGVmaW5lKCdzZWxlY3QyL2RhdGEvdGFncycsW1xyXG4gICdqcXVlcnknXHJcbl0sIGZ1bmN0aW9uICgkKSB7XHJcbiAgZnVuY3Rpb24gVGFncyAoZGVjb3JhdGVkLCAkZWxlbWVudCwgb3B0aW9ucykge1xyXG4gICAgdmFyIHRhZ3MgPSBvcHRpb25zLmdldCgndGFncycpO1xyXG5cclxuICAgIHZhciBjcmVhdGVUYWcgPSBvcHRpb25zLmdldCgnY3JlYXRlVGFnJyk7XHJcblxyXG4gICAgaWYgKGNyZWF0ZVRhZyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMuY3JlYXRlVGFnID0gY3JlYXRlVGFnO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBpbnNlcnRUYWcgPSBvcHRpb25zLmdldCgnaW5zZXJ0VGFnJyk7XHJcblxyXG4gICAgaWYgKGluc2VydFRhZyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdGhpcy5pbnNlcnRUYWcgPSBpbnNlcnRUYWc7XHJcbiAgICB9XHJcblxyXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgJGVsZW1lbnQsIG9wdGlvbnMpO1xyXG5cclxuICAgIGlmICgkLmlzQXJyYXkodGFncykpIHtcclxuICAgICAgZm9yICh2YXIgdCA9IDA7IHQgPCB0YWdzLmxlbmd0aDsgdCsrKSB7XHJcbiAgICAgICAgdmFyIHRhZyA9IHRhZ3NbdF07XHJcbiAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLl9ub3JtYWxpemVJdGVtKHRhZyk7XHJcblxyXG4gICAgICAgIHZhciAkb3B0aW9uID0gdGhpcy5vcHRpb24oaXRlbSk7XHJcblxyXG4gICAgICAgIHRoaXMuJGVsZW1lbnQuYXBwZW5kKCRvcHRpb24pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBUYWdzLnByb3RvdHlwZS5xdWVyeSA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIHBhcmFtcywgY2FsbGJhY2spIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICB0aGlzLl9yZW1vdmVPbGRUYWdzKCk7XHJcblxyXG4gICAgaWYgKHBhcmFtcy50ZXJtID09IG51bGwgfHwgcGFyYW1zLnBhZ2UgIT0gbnVsbCkge1xyXG4gICAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBwYXJhbXMsIGNhbGxiYWNrKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHdyYXBwZXIgKG9iaiwgY2hpbGQpIHtcclxuICAgICAgdmFyIGRhdGEgPSBvYmoucmVzdWx0cztcclxuXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBvcHRpb24gPSBkYXRhW2ldO1xyXG5cclxuICAgICAgICB2YXIgY2hlY2tDaGlsZHJlbiA9IChcclxuICAgICAgICAgIG9wdGlvbi5jaGlsZHJlbiAhPSBudWxsICYmXHJcbiAgICAgICAgICAhd3JhcHBlcih7XHJcbiAgICAgICAgICAgIHJlc3VsdHM6IG9wdGlvbi5jaGlsZHJlblxyXG4gICAgICAgICAgfSwgdHJ1ZSlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB2YXIgY2hlY2tUZXh0ID0gb3B0aW9uLnRleHQgPT09IHBhcmFtcy50ZXJtO1xyXG5cclxuICAgICAgICBpZiAoY2hlY2tUZXh0IHx8IGNoZWNrQ2hpbGRyZW4pIHtcclxuICAgICAgICAgIGlmIChjaGlsZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgb2JqLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgY2FsbGJhY2sob2JqKTtcclxuXHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoY2hpbGQpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIHRhZyA9IHNlbGYuY3JlYXRlVGFnKHBhcmFtcyk7XHJcblxyXG4gICAgICBpZiAodGFnICE9IG51bGwpIHtcclxuICAgICAgICB2YXIgJG9wdGlvbiA9IHNlbGYub3B0aW9uKHRhZyk7XHJcbiAgICAgICAgJG9wdGlvbi5hdHRyKCdkYXRhLXNlbGVjdDItdGFnJywgdHJ1ZSk7XHJcblxyXG4gICAgICAgIHNlbGYuYWRkT3B0aW9ucyhbJG9wdGlvbl0pO1xyXG5cclxuICAgICAgICBzZWxmLmluc2VydFRhZyhkYXRhLCB0YWcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBvYmoucmVzdWx0cyA9IGRhdGE7XHJcblxyXG4gICAgICBjYWxsYmFjayhvYmopO1xyXG4gICAgfVxyXG5cclxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIHBhcmFtcywgd3JhcHBlcik7XHJcbiAgfTtcclxuXHJcbiAgVGFncy5wcm90b3R5cGUuY3JlYXRlVGFnID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgcGFyYW1zKSB7XHJcbiAgICB2YXIgdGVybSA9ICQudHJpbShwYXJhbXMudGVybSk7XHJcblxyXG4gICAgaWYgKHRlcm0gPT09ICcnKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGlkOiB0ZXJtLFxyXG4gICAgICB0ZXh0OiB0ZXJtXHJcbiAgICB9O1xyXG4gIH07XHJcblxyXG4gIFRhZ3MucHJvdG90eXBlLmluc2VydFRhZyA9IGZ1bmN0aW9uIChfLCBkYXRhLCB0YWcpIHtcclxuICAgIGRhdGEudW5zaGlmdCh0YWcpO1xyXG4gIH07XHJcblxyXG4gIFRhZ3MucHJvdG90eXBlLl9yZW1vdmVPbGRUYWdzID0gZnVuY3Rpb24gKF8pIHtcclxuICAgIHZhciB0YWcgPSB0aGlzLl9sYXN0VGFnO1xyXG5cclxuICAgIHZhciAkb3B0aW9ucyA9IHRoaXMuJGVsZW1lbnQuZmluZCgnb3B0aW9uW2RhdGEtc2VsZWN0Mi10YWddJyk7XHJcblxyXG4gICAgJG9wdGlvbnMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkKHRoaXMpLnJlbW92ZSgpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIFRhZ3M7XHJcbn0pO1xyXG5cclxuUzIuZGVmaW5lKCdzZWxlY3QyL2RhdGEvdG9rZW5pemVyJyxbXHJcbiAgJ2pxdWVyeSdcclxuXSwgZnVuY3Rpb24gKCQpIHtcclxuICBmdW5jdGlvbiBUb2tlbml6ZXIgKGRlY29yYXRlZCwgJGVsZW1lbnQsIG9wdGlvbnMpIHtcclxuICAgIHZhciB0b2tlbml6ZXIgPSBvcHRpb25zLmdldCgndG9rZW5pemVyJyk7XHJcblxyXG4gICAgaWYgKHRva2VuaXplciAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMudG9rZW5pemVyID0gdG9rZW5pemVyO1xyXG4gICAgfVxyXG5cclxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsICRlbGVtZW50LCBvcHRpb25zKTtcclxuICB9XHJcblxyXG4gIFRva2VuaXplci5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGNvbnRhaW5lciwgJGNvbnRhaW5lcikge1xyXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgY29udGFpbmVyLCAkY29udGFpbmVyKTtcclxuXHJcbiAgICB0aGlzLiRzZWFyY2ggPSAgY29udGFpbmVyLmRyb3Bkb3duLiRzZWFyY2ggfHwgY29udGFpbmVyLnNlbGVjdGlvbi4kc2VhcmNoIHx8XHJcbiAgICAgICRjb250YWluZXIuZmluZCgnLnNlbGVjdDItc2VhcmNoX19maWVsZCcpO1xyXG4gIH07XHJcblxyXG4gIFRva2VuaXplci5wcm90b3R5cGUucXVlcnkgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBwYXJhbXMsIGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlQW5kU2VsZWN0IChkYXRhKSB7XHJcbiAgICAgIC8vIE5vcm1hbGl6ZSB0aGUgZGF0YSBvYmplY3Qgc28gd2UgY2FuIHVzZSBpdCBmb3IgY2hlY2tzXHJcbiAgICAgIHZhciBpdGVtID0gc2VsZi5fbm9ybWFsaXplSXRlbShkYXRhKTtcclxuXHJcbiAgICAgIC8vIENoZWNrIGlmIHRoZSBkYXRhIG9iamVjdCBhbHJlYWR5IGV4aXN0cyBhcyBhIHRhZ1xyXG4gICAgICAvLyBTZWxlY3QgaXQgaWYgaXQgZG9lc24ndFxyXG4gICAgICB2YXIgJGV4aXN0aW5nT3B0aW9ucyA9IHNlbGYuJGVsZW1lbnQuZmluZCgnb3B0aW9uJykuZmlsdGVyKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gJCh0aGlzKS52YWwoKSA9PT0gaXRlbS5pZDtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBJZiBhbiBleGlzdGluZyBvcHRpb24gd2Fzbid0IGZvdW5kIGZvciBpdCwgY3JlYXRlIHRoZSBvcHRpb25cclxuICAgICAgaWYgKCEkZXhpc3RpbmdPcHRpb25zLmxlbmd0aCkge1xyXG4gICAgICAgIHZhciAkb3B0aW9uID0gc2VsZi5vcHRpb24oaXRlbSk7XHJcbiAgICAgICAgJG9wdGlvbi5hdHRyKCdkYXRhLXNlbGVjdDItdGFnJywgdHJ1ZSk7XHJcblxyXG4gICAgICAgIHNlbGYuX3JlbW92ZU9sZFRhZ3MoKTtcclxuICAgICAgICBzZWxmLmFkZE9wdGlvbnMoWyRvcHRpb25dKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gU2VsZWN0IHRoZSBpdGVtLCBub3cgdGhhdCB3ZSBrbm93IHRoZXJlIGlzIGFuIG9wdGlvbiBmb3IgaXRcclxuICAgICAgc2VsZWN0KGl0ZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNlbGVjdCAoZGF0YSkge1xyXG4gICAgICBzZWxmLnRyaWdnZXIoJ3NlbGVjdCcsIHtcclxuICAgICAgICBkYXRhOiBkYXRhXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHBhcmFtcy50ZXJtID0gcGFyYW1zLnRlcm0gfHwgJyc7XHJcblxyXG4gICAgdmFyIHRva2VuRGF0YSA9IHRoaXMudG9rZW5pemVyKHBhcmFtcywgdGhpcy5vcHRpb25zLCBjcmVhdGVBbmRTZWxlY3QpO1xyXG5cclxuICAgIGlmICh0b2tlbkRhdGEudGVybSAhPT0gcGFyYW1zLnRlcm0pIHtcclxuICAgICAgLy8gUmVwbGFjZSB0aGUgc2VhcmNoIHRlcm0gaWYgd2UgaGF2ZSB0aGUgc2VhcmNoIGJveFxyXG4gICAgICBpZiAodGhpcy4kc2VhcmNoLmxlbmd0aCkge1xyXG4gICAgICAgIHRoaXMuJHNlYXJjaC52YWwodG9rZW5EYXRhLnRlcm0pO1xyXG4gICAgICAgIHRoaXMuJHNlYXJjaC5mb2N1cygpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBwYXJhbXMudGVybSA9IHRva2VuRGF0YS50ZXJtO1xyXG4gICAgfVxyXG5cclxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIHBhcmFtcywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIFRva2VuaXplci5wcm90b3R5cGUudG9rZW5pemVyID0gZnVuY3Rpb24gKF8sIHBhcmFtcywgb3B0aW9ucywgY2FsbGJhY2spIHtcclxuICAgIHZhciBzZXBhcmF0b3JzID0gb3B0aW9ucy5nZXQoJ3Rva2VuU2VwYXJhdG9ycycpIHx8IFtdO1xyXG4gICAgdmFyIHRlcm0gPSBwYXJhbXMudGVybTtcclxuICAgIHZhciBpID0gMDtcclxuXHJcbiAgICB2YXIgY3JlYXRlVGFnID0gdGhpcy5jcmVhdGVUYWcgfHwgZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGlkOiBwYXJhbXMudGVybSxcclxuICAgICAgICB0ZXh0OiBwYXJhbXMudGVybVxyXG4gICAgICB9O1xyXG4gICAgfTtcclxuXHJcbiAgICB3aGlsZSAoaSA8IHRlcm0ubGVuZ3RoKSB7XHJcbiAgICAgIHZhciB0ZXJtQ2hhciA9IHRlcm1baV07XHJcblxyXG4gICAgICBpZiAoJC5pbkFycmF5KHRlcm1DaGFyLCBzZXBhcmF0b3JzKSA9PT0gLTEpIHtcclxuICAgICAgICBpKys7XHJcblxyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgcGFydCA9IHRlcm0uc3Vic3RyKDAsIGkpO1xyXG4gICAgICB2YXIgcGFydFBhcmFtcyA9ICQuZXh0ZW5kKHt9LCBwYXJhbXMsIHtcclxuICAgICAgICB0ZXJtOiBwYXJ0XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdmFyIGRhdGEgPSBjcmVhdGVUYWcocGFydFBhcmFtcyk7XHJcblxyXG4gICAgICBpZiAoZGF0YSA9PSBudWxsKSB7XHJcbiAgICAgICAgaSsrO1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjYWxsYmFjayhkYXRhKTtcclxuXHJcbiAgICAgIC8vIFJlc2V0IHRoZSB0ZXJtIHRvIG5vdCBpbmNsdWRlIHRoZSB0b2tlbml6ZWQgcG9ydGlvblxyXG4gICAgICB0ZXJtID0gdGVybS5zdWJzdHIoaSArIDEpIHx8ICcnO1xyXG4gICAgICBpID0gMDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0ZXJtOiB0ZXJtXHJcbiAgICB9O1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBUb2tlbml6ZXI7XHJcbn0pO1xyXG5cclxuUzIuZGVmaW5lKCdzZWxlY3QyL2RhdGEvbWluaW11bUlucHV0TGVuZ3RoJyxbXHJcblxyXG5dLCBmdW5jdGlvbiAoKSB7XHJcbiAgZnVuY3Rpb24gTWluaW11bUlucHV0TGVuZ3RoIChkZWNvcmF0ZWQsICRlLCBvcHRpb25zKSB7XHJcbiAgICB0aGlzLm1pbmltdW1JbnB1dExlbmd0aCA9IG9wdGlvbnMuZ2V0KCdtaW5pbXVtSW5wdXRMZW5ndGgnKTtcclxuXHJcbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCAkZSwgb3B0aW9ucyk7XHJcbiAgfVxyXG5cclxuICBNaW5pbXVtSW5wdXRMZW5ndGgucHJvdG90eXBlLnF1ZXJ5ID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgcGFyYW1zLCBjYWxsYmFjaykge1xyXG4gICAgcGFyYW1zLnRlcm0gPSBwYXJhbXMudGVybSB8fCAnJztcclxuXHJcbiAgICBpZiAocGFyYW1zLnRlcm0ubGVuZ3RoIDwgdGhpcy5taW5pbXVtSW5wdXRMZW5ndGgpIHtcclxuICAgICAgdGhpcy50cmlnZ2VyKCdyZXN1bHRzOm1lc3NhZ2UnLCB7XHJcbiAgICAgICAgbWVzc2FnZTogJ2lucHV0VG9vU2hvcnQnLFxyXG4gICAgICAgIGFyZ3M6IHtcclxuICAgICAgICAgIG1pbmltdW06IHRoaXMubWluaW11bUlucHV0TGVuZ3RoLFxyXG4gICAgICAgICAgaW5wdXQ6IHBhcmFtcy50ZXJtLFxyXG4gICAgICAgICAgcGFyYW1zOiBwYXJhbXNcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIHBhcmFtcywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBNaW5pbXVtSW5wdXRMZW5ndGg7XHJcbn0pO1xyXG5cclxuUzIuZGVmaW5lKCdzZWxlY3QyL2RhdGEvbWF4aW11bUlucHV0TGVuZ3RoJyxbXHJcblxyXG5dLCBmdW5jdGlvbiAoKSB7XHJcbiAgZnVuY3Rpb24gTWF4aW11bUlucHV0TGVuZ3RoIChkZWNvcmF0ZWQsICRlLCBvcHRpb25zKSB7XHJcbiAgICB0aGlzLm1heGltdW1JbnB1dExlbmd0aCA9IG9wdGlvbnMuZ2V0KCdtYXhpbXVtSW5wdXRMZW5ndGgnKTtcclxuXHJcbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCAkZSwgb3B0aW9ucyk7XHJcbiAgfVxyXG5cclxuICBNYXhpbXVtSW5wdXRMZW5ndGgucHJvdG90eXBlLnF1ZXJ5ID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgcGFyYW1zLCBjYWxsYmFjaykge1xyXG4gICAgcGFyYW1zLnRlcm0gPSBwYXJhbXMudGVybSB8fCAnJztcclxuXHJcbiAgICBpZiAodGhpcy5tYXhpbXVtSW5wdXRMZW5ndGggPiAwICYmXHJcbiAgICAgICAgcGFyYW1zLnRlcm0ubGVuZ3RoID4gdGhpcy5tYXhpbXVtSW5wdXRMZW5ndGgpIHtcclxuICAgICAgdGhpcy50cmlnZ2VyKCdyZXN1bHRzOm1lc3NhZ2UnLCB7XHJcbiAgICAgICAgbWVzc2FnZTogJ2lucHV0VG9vTG9uZycsXHJcbiAgICAgICAgYXJnczoge1xyXG4gICAgICAgICAgbWF4aW11bTogdGhpcy5tYXhpbXVtSW5wdXRMZW5ndGgsXHJcbiAgICAgICAgICBpbnB1dDogcGFyYW1zLnRlcm0sXHJcbiAgICAgICAgICBwYXJhbXM6IHBhcmFtc1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgcGFyYW1zLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIE1heGltdW1JbnB1dExlbmd0aDtcclxufSk7XHJcblxyXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZGF0YS9tYXhpbXVtU2VsZWN0aW9uTGVuZ3RoJyxbXHJcblxyXG5dLCBmdW5jdGlvbiAoKXtcclxuICBmdW5jdGlvbiBNYXhpbXVtU2VsZWN0aW9uTGVuZ3RoIChkZWNvcmF0ZWQsICRlLCBvcHRpb25zKSB7XHJcbiAgICB0aGlzLm1heGltdW1TZWxlY3Rpb25MZW5ndGggPSBvcHRpb25zLmdldCgnbWF4aW11bVNlbGVjdGlvbkxlbmd0aCcpO1xyXG5cclxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsICRlLCBvcHRpb25zKTtcclxuICB9XHJcblxyXG4gIE1heGltdW1TZWxlY3Rpb25MZW5ndGgucHJvdG90eXBlLnF1ZXJ5ID1cclxuICAgIGZ1bmN0aW9uIChkZWNvcmF0ZWQsIHBhcmFtcywgY2FsbGJhY2spIHtcclxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgdGhpcy5jdXJyZW50KGZ1bmN0aW9uIChjdXJyZW50RGF0YSkge1xyXG4gICAgICAgIHZhciBjb3VudCA9IGN1cnJlbnREYXRhICE9IG51bGwgPyBjdXJyZW50RGF0YS5sZW5ndGggOiAwO1xyXG4gICAgICAgIGlmIChzZWxmLm1heGltdW1TZWxlY3Rpb25MZW5ndGggPiAwICYmXHJcbiAgICAgICAgICBjb3VudCA+PSBzZWxmLm1heGltdW1TZWxlY3Rpb25MZW5ndGgpIHtcclxuICAgICAgICAgIHNlbGYudHJpZ2dlcigncmVzdWx0czptZXNzYWdlJywge1xyXG4gICAgICAgICAgICBtZXNzYWdlOiAnbWF4aW11bVNlbGVjdGVkJyxcclxuICAgICAgICAgICAgYXJnczoge1xyXG4gICAgICAgICAgICAgIG1heGltdW06IHNlbGYubWF4aW11bVNlbGVjdGlvbkxlbmd0aFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGVjb3JhdGVkLmNhbGwoc2VsZiwgcGFyYW1zLCBjYWxsYmFjayk7XHJcbiAgICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBNYXhpbXVtU2VsZWN0aW9uTGVuZ3RoO1xyXG59KTtcclxuXHJcblMyLmRlZmluZSgnc2VsZWN0Mi9kcm9wZG93bicsW1xyXG4gICdqcXVlcnknLFxyXG4gICcuL3V0aWxzJ1xyXG5dLCBmdW5jdGlvbiAoJCwgVXRpbHMpIHtcclxuICBmdW5jdGlvbiBEcm9wZG93biAoJGVsZW1lbnQsIG9wdGlvbnMpIHtcclxuICAgIHRoaXMuJGVsZW1lbnQgPSAkZWxlbWVudDtcclxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XHJcblxyXG4gICAgRHJvcGRvd24uX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcyk7XHJcbiAgfVxyXG5cclxuICBVdGlscy5FeHRlbmQoRHJvcGRvd24sIFV0aWxzLk9ic2VydmFibGUpO1xyXG5cclxuICBEcm9wZG93bi5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyICRkcm9wZG93biA9ICQoXHJcbiAgICAgICc8c3BhbiBjbGFzcz1cInNlbGVjdDItZHJvcGRvd25cIj4nICtcclxuICAgICAgICAnPHNwYW4gY2xhc3M9XCJzZWxlY3QyLXJlc3VsdHNcIj48L3NwYW4+JyArXHJcbiAgICAgICc8L3NwYW4+J1xyXG4gICAgKTtcclxuXHJcbiAgICAkZHJvcGRvd24uYXR0cignZGlyJywgdGhpcy5vcHRpb25zLmdldCgnZGlyJykpO1xyXG5cclxuICAgIHRoaXMuJGRyb3Bkb3duID0gJGRyb3Bkb3duO1xyXG5cclxuICAgIHJldHVybiAkZHJvcGRvd247XHJcbiAgfTtcclxuXHJcbiAgRHJvcGRvd24ucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyBTaG91bGQgYmUgaW1wbGVtZW50ZWQgaW4gc3ViY2xhc3Nlc1xyXG4gIH07XHJcblxyXG4gIERyb3Bkb3duLnByb3RvdHlwZS5wb3NpdGlvbiA9IGZ1bmN0aW9uICgkZHJvcGRvd24sICRjb250YWluZXIpIHtcclxuICAgIC8vIFNob3VsZCBiZSBpbXBsbWVudGVkIGluIHN1YmNsYXNzZXNcclxuICB9O1xyXG5cclxuICBEcm9wZG93bi5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIFJlbW92ZSB0aGUgZHJvcGRvd24gZnJvbSB0aGUgRE9NXHJcbiAgICB0aGlzLiRkcm9wZG93bi5yZW1vdmUoKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gRHJvcGRvd247XHJcbn0pO1xyXG5cclxuUzIuZGVmaW5lKCdzZWxlY3QyL2Ryb3Bkb3duL3NlYXJjaCcsW1xyXG4gICdqcXVlcnknLFxyXG4gICcuLi91dGlscydcclxuXSwgZnVuY3Rpb24gKCQsIFV0aWxzKSB7XHJcbiAgZnVuY3Rpb24gU2VhcmNoICgpIHsgfVxyXG5cclxuICBTZWFyY2gucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQpIHtcclxuICAgIHZhciAkcmVuZGVyZWQgPSBkZWNvcmF0ZWQuY2FsbCh0aGlzKTtcclxuXHJcbiAgICB2YXIgJHNlYXJjaCA9ICQoXHJcbiAgICAgICc8c3BhbiBjbGFzcz1cInNlbGVjdDItc2VhcmNoIHNlbGVjdDItc2VhcmNoLS1kcm9wZG93blwiPicgK1xyXG4gICAgICAgICc8aW5wdXQgY2xhc3M9XCJzZWxlY3QyLXNlYXJjaF9fZmllbGRcIiB0eXBlPVwic2VhcmNoXCIgdGFiaW5kZXg9XCItMVwiJyArXHJcbiAgICAgICAgJyBhdXRvY29tcGxldGU9XCJvZmZcIiBhdXRvY29ycmVjdD1cIm9mZlwiIGF1dG9jYXBpdGFsaXplPVwib2ZmXCInICtcclxuICAgICAgICAnIHNwZWxsY2hlY2s9XCJmYWxzZVwiIHJvbGU9XCJ0ZXh0Ym94XCIgLz4nICtcclxuICAgICAgJzwvc3Bhbj4nXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuJHNlYXJjaENvbnRhaW5lciA9ICRzZWFyY2g7XHJcbiAgICB0aGlzLiRzZWFyY2ggPSAkc2VhcmNoLmZpbmQoJ2lucHV0Jyk7XHJcblxyXG4gICAgJHJlbmRlcmVkLnByZXBlbmQoJHNlYXJjaCk7XHJcblxyXG4gICAgcmV0dXJuICRyZW5kZXJlZDtcclxuICB9O1xyXG5cclxuICBTZWFyY2gucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBjb250YWluZXIsICRjb250YWluZXIpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBjb250YWluZXIsICRjb250YWluZXIpO1xyXG5cclxuICAgIHRoaXMuJHNlYXJjaC5vbigna2V5ZG93bicsIGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgc2VsZi50cmlnZ2VyKCdrZXlwcmVzcycsIGV2dCk7XHJcblxyXG4gICAgICBzZWxmLl9rZXlVcFByZXZlbnRlZCA9IGV2dC5pc0RlZmF1bHRQcmV2ZW50ZWQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFdvcmthcm91bmQgZm9yIGJyb3dzZXJzIHdoaWNoIGRvIG5vdCBzdXBwb3J0IHRoZSBgaW5wdXRgIGV2ZW50XHJcbiAgICAvLyBUaGlzIHdpbGwgcHJldmVudCBkb3VibGUtdHJpZ2dlcmluZyBvZiBldmVudHMgZm9yIGJyb3dzZXJzIHdoaWNoIHN1cHBvcnRcclxuICAgIC8vIGJvdGggdGhlIGBrZXl1cGAgYW5kIGBpbnB1dGAgZXZlbnRzLlxyXG4gICAgdGhpcy4kc2VhcmNoLm9uKCdpbnB1dCcsIGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgLy8gVW5iaW5kIHRoZSBkdXBsaWNhdGVkIGBrZXl1cGAgZXZlbnRcclxuICAgICAgJCh0aGlzKS5vZmYoJ2tleXVwJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLiRzZWFyY2gub24oJ2tleXVwIGlucHV0JywgZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICBzZWxmLmhhbmRsZVNlYXJjaChldnQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29udGFpbmVyLm9uKCdvcGVuJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICBzZWxmLiRzZWFyY2guYXR0cigndGFiaW5kZXgnLCAwKTtcclxuXHJcbiAgICAgIHNlbGYuJHNlYXJjaC5mb2N1cygpO1xyXG5cclxuICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHNlbGYuJHNlYXJjaC5mb2N1cygpO1xyXG4gICAgICB9LCAwKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnRhaW5lci5vbignY2xvc2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHNlbGYuJHNlYXJjaC5hdHRyKCd0YWJpbmRleCcsIC0xKTtcclxuXHJcbiAgICAgIHNlbGYuJHNlYXJjaC52YWwoJycpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29udGFpbmVyLm9uKCdmb2N1cycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKGNvbnRhaW5lci5pc09wZW4oKSkge1xyXG4gICAgICAgIHNlbGYuJHNlYXJjaC5mb2N1cygpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ3Jlc3VsdHM6YWxsJywgZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICBpZiAocGFyYW1zLnF1ZXJ5LnRlcm0gPT0gbnVsbCB8fCBwYXJhbXMucXVlcnkudGVybSA9PT0gJycpIHtcclxuICAgICAgICB2YXIgc2hvd1NlYXJjaCA9IHNlbGYuc2hvd1NlYXJjaChwYXJhbXMpO1xyXG5cclxuICAgICAgICBpZiAoc2hvd1NlYXJjaCkge1xyXG4gICAgICAgICAgc2VsZi4kc2VhcmNoQ29udGFpbmVyLnJlbW92ZUNsYXNzKCdzZWxlY3QyLXNlYXJjaC0taGlkZScpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzZWxmLiRzZWFyY2hDb250YWluZXIuYWRkQ2xhc3MoJ3NlbGVjdDItc2VhcmNoLS1oaWRlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBTZWFyY2gucHJvdG90eXBlLmhhbmRsZVNlYXJjaCA9IGZ1bmN0aW9uIChldnQpIHtcclxuICAgIGlmICghdGhpcy5fa2V5VXBQcmV2ZW50ZWQpIHtcclxuICAgICAgdmFyIGlucHV0ID0gdGhpcy4kc2VhcmNoLnZhbCgpO1xyXG5cclxuICAgICAgdGhpcy50cmlnZ2VyKCdxdWVyeScsIHtcclxuICAgICAgICB0ZXJtOiBpbnB1dFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9rZXlVcFByZXZlbnRlZCA9IGZhbHNlO1xyXG4gIH07XHJcblxyXG4gIFNlYXJjaC5wcm90b3R5cGUuc2hvd1NlYXJjaCA9IGZ1bmN0aW9uIChfLCBwYXJhbXMpIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBTZWFyY2g7XHJcbn0pO1xyXG5cclxuUzIuZGVmaW5lKCdzZWxlY3QyL2Ryb3Bkb3duL2hpZGVQbGFjZWhvbGRlcicsW1xyXG5cclxuXSwgZnVuY3Rpb24gKCkge1xyXG4gIGZ1bmN0aW9uIEhpZGVQbGFjZWhvbGRlciAoZGVjb3JhdGVkLCAkZWxlbWVudCwgb3B0aW9ucywgZGF0YUFkYXB0ZXIpIHtcclxuICAgIHRoaXMucGxhY2Vob2xkZXIgPSB0aGlzLm5vcm1hbGl6ZVBsYWNlaG9sZGVyKG9wdGlvbnMuZ2V0KCdwbGFjZWhvbGRlcicpKTtcclxuXHJcbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCAkZWxlbWVudCwgb3B0aW9ucywgZGF0YUFkYXB0ZXIpO1xyXG4gIH1cclxuXHJcbiAgSGlkZVBsYWNlaG9sZGVyLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBkYXRhKSB7XHJcbiAgICBkYXRhLnJlc3VsdHMgPSB0aGlzLnJlbW92ZVBsYWNlaG9sZGVyKGRhdGEucmVzdWx0cyk7XHJcblxyXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgZGF0YSk7XHJcbiAgfTtcclxuXHJcbiAgSGlkZVBsYWNlaG9sZGVyLnByb3RvdHlwZS5ub3JtYWxpemVQbGFjZWhvbGRlciA9IGZ1bmN0aW9uIChfLCBwbGFjZWhvbGRlcikge1xyXG4gICAgaWYgKHR5cGVvZiBwbGFjZWhvbGRlciA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgcGxhY2Vob2xkZXIgPSB7XHJcbiAgICAgICAgaWQ6ICcnLFxyXG4gICAgICAgIHRleHQ6IHBsYWNlaG9sZGVyXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHBsYWNlaG9sZGVyO1xyXG4gIH07XHJcblxyXG4gIEhpZGVQbGFjZWhvbGRlci5wcm90b3R5cGUucmVtb3ZlUGxhY2Vob2xkZXIgPSBmdW5jdGlvbiAoXywgZGF0YSkge1xyXG4gICAgdmFyIG1vZGlmaWVkRGF0YSA9IGRhdGEuc2xpY2UoMCk7XHJcblxyXG4gICAgZm9yICh2YXIgZCA9IGRhdGEubGVuZ3RoIC0gMTsgZCA+PSAwOyBkLS0pIHtcclxuICAgICAgdmFyIGl0ZW0gPSBkYXRhW2RdO1xyXG5cclxuICAgICAgaWYgKHRoaXMucGxhY2Vob2xkZXIuaWQgPT09IGl0ZW0uaWQpIHtcclxuICAgICAgICBtb2RpZmllZERhdGEuc3BsaWNlKGQsIDEpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1vZGlmaWVkRGF0YTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gSGlkZVBsYWNlaG9sZGVyO1xyXG59KTtcclxuXHJcblMyLmRlZmluZSgnc2VsZWN0Mi9kcm9wZG93bi9pbmZpbml0ZVNjcm9sbCcsW1xyXG4gICdqcXVlcnknXHJcbl0sIGZ1bmN0aW9uICgkKSB7XHJcbiAgZnVuY3Rpb24gSW5maW5pdGVTY3JvbGwgKGRlY29yYXRlZCwgJGVsZW1lbnQsIG9wdGlvbnMsIGRhdGFBZGFwdGVyKSB7XHJcbiAgICB0aGlzLmxhc3RQYXJhbXMgPSB7fTtcclxuXHJcbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCAkZWxlbWVudCwgb3B0aW9ucywgZGF0YUFkYXB0ZXIpO1xyXG5cclxuICAgIHRoaXMuJGxvYWRpbmdNb3JlID0gdGhpcy5jcmVhdGVMb2FkaW5nTW9yZSgpO1xyXG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBJbmZpbml0ZVNjcm9sbC5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgZGF0YSkge1xyXG4gICAgdGhpcy4kbG9hZGluZ01vcmUucmVtb3ZlKCk7XHJcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCBkYXRhKTtcclxuXHJcbiAgICBpZiAodGhpcy5zaG93TG9hZGluZ01vcmUoZGF0YSkpIHtcclxuICAgICAgdGhpcy4kcmVzdWx0cy5hcHBlbmQodGhpcy4kbG9hZGluZ01vcmUpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIEluZmluaXRlU2Nyb2xsLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgY29udGFpbmVyLCAkY29udGFpbmVyKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgY29udGFpbmVyLCAkY29udGFpbmVyKTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ3F1ZXJ5JywgZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICBzZWxmLmxhc3RQYXJhbXMgPSBwYXJhbXM7XHJcbiAgICAgIHNlbGYubG9hZGluZyA9IHRydWU7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ3F1ZXJ5OmFwcGVuZCcsIGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgc2VsZi5sYXN0UGFyYW1zID0gcGFyYW1zO1xyXG4gICAgICBzZWxmLmxvYWRpbmcgPSB0cnVlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy4kcmVzdWx0cy5vbignc2Nyb2xsJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgaXNMb2FkTW9yZVZpc2libGUgPSAkLmNvbnRhaW5zKFxyXG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcclxuICAgICAgICBzZWxmLiRsb2FkaW5nTW9yZVswXVxyXG4gICAgICApO1xyXG5cclxuICAgICAgaWYgKHNlbGYubG9hZGluZyB8fCAhaXNMb2FkTW9yZVZpc2libGUpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBjdXJyZW50T2Zmc2V0ID0gc2VsZi4kcmVzdWx0cy5vZmZzZXQoKS50b3AgK1xyXG4gICAgICAgIHNlbGYuJHJlc3VsdHMub3V0ZXJIZWlnaHQoZmFsc2UpO1xyXG4gICAgICB2YXIgbG9hZGluZ01vcmVPZmZzZXQgPSBzZWxmLiRsb2FkaW5nTW9yZS5vZmZzZXQoKS50b3AgK1xyXG4gICAgICAgIHNlbGYuJGxvYWRpbmdNb3JlLm91dGVySGVpZ2h0KGZhbHNlKTtcclxuXHJcbiAgICAgIGlmIChjdXJyZW50T2Zmc2V0ICsgNTAgPj0gbG9hZGluZ01vcmVPZmZzZXQpIHtcclxuICAgICAgICBzZWxmLmxvYWRNb3JlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIEluZmluaXRlU2Nyb2xsLnByb3RvdHlwZS5sb2FkTW9yZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMubG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgdmFyIHBhcmFtcyA9ICQuZXh0ZW5kKHt9LCB7cGFnZTogMX0sIHRoaXMubGFzdFBhcmFtcyk7XHJcblxyXG4gICAgcGFyYW1zLnBhZ2UrKztcclxuXHJcbiAgICB0aGlzLnRyaWdnZXIoJ3F1ZXJ5OmFwcGVuZCcsIHBhcmFtcyk7XHJcbiAgfTtcclxuXHJcbiAgSW5maW5pdGVTY3JvbGwucHJvdG90eXBlLnNob3dMb2FkaW5nTW9yZSA9IGZ1bmN0aW9uIChfLCBkYXRhKSB7XHJcbiAgICByZXR1cm4gZGF0YS5wYWdpbmF0aW9uICYmIGRhdGEucGFnaW5hdGlvbi5tb3JlO1xyXG4gIH07XHJcblxyXG4gIEluZmluaXRlU2Nyb2xsLnByb3RvdHlwZS5jcmVhdGVMb2FkaW5nTW9yZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciAkb3B0aW9uID0gJChcclxuICAgICAgJzxsaSAnICtcclxuICAgICAgJ2NsYXNzPVwic2VsZWN0Mi1yZXN1bHRzX19vcHRpb24gc2VsZWN0Mi1yZXN1bHRzX19vcHRpb24tLWxvYWQtbW9yZVwiJyArXHJcbiAgICAgICdyb2xlPVwidHJlZWl0ZW1cIiBhcmlhLWRpc2FibGVkPVwidHJ1ZVwiPjwvbGk+J1xyXG4gICAgKTtcclxuXHJcbiAgICB2YXIgbWVzc2FnZSA9IHRoaXMub3B0aW9ucy5nZXQoJ3RyYW5zbGF0aW9ucycpLmdldCgnbG9hZGluZ01vcmUnKTtcclxuXHJcbiAgICAkb3B0aW9uLmh0bWwobWVzc2FnZSh0aGlzLmxhc3RQYXJhbXMpKTtcclxuXHJcbiAgICByZXR1cm4gJG9wdGlvbjtcclxuICB9O1xyXG5cclxuICByZXR1cm4gSW5maW5pdGVTY3JvbGw7XHJcbn0pO1xyXG5cclxuUzIuZGVmaW5lKCdzZWxlY3QyL2Ryb3Bkb3duL2F0dGFjaEJvZHknLFtcclxuICAnanF1ZXJ5JyxcclxuICAnLi4vdXRpbHMnXHJcbl0sIGZ1bmN0aW9uICgkLCBVdGlscykge1xyXG4gIGZ1bmN0aW9uIEF0dGFjaEJvZHkgKGRlY29yYXRlZCwgJGVsZW1lbnQsIG9wdGlvbnMpIHtcclxuICAgIHRoaXMuJGRyb3Bkb3duUGFyZW50ID0gb3B0aW9ucy5nZXQoJ2Ryb3Bkb3duUGFyZW50JykgfHwgJChkb2N1bWVudC5ib2R5KTtcclxuXHJcbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCAkZWxlbWVudCwgb3B0aW9ucyk7XHJcbiAgfVxyXG5cclxuICBBdHRhY2hCb2R5LnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgY29udGFpbmVyLCAkY29udGFpbmVyKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgdmFyIHNldHVwUmVzdWx0c0V2ZW50cyA9IGZhbHNlO1xyXG5cclxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMsIGNvbnRhaW5lciwgJGNvbnRhaW5lcik7XHJcblxyXG4gICAgY29udGFpbmVyLm9uKCdvcGVuJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICBzZWxmLl9zaG93RHJvcGRvd24oKTtcclxuICAgICAgc2VsZi5fYXR0YWNoUG9zaXRpb25pbmdIYW5kbGVyKGNvbnRhaW5lcik7XHJcblxyXG4gICAgICBpZiAoIXNldHVwUmVzdWx0c0V2ZW50cykge1xyXG4gICAgICAgIHNldHVwUmVzdWx0c0V2ZW50cyA9IHRydWU7XHJcblxyXG4gICAgICAgIGNvbnRhaW5lci5vbigncmVzdWx0czphbGwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBzZWxmLl9wb3NpdGlvbkRyb3Bkb3duKCk7XHJcbiAgICAgICAgICBzZWxmLl9yZXNpemVEcm9wZG93bigpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb250YWluZXIub24oJ3Jlc3VsdHM6YXBwZW5kJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgc2VsZi5fcG9zaXRpb25Ecm9wZG93bigpO1xyXG4gICAgICAgICAgc2VsZi5fcmVzaXplRHJvcGRvd24oKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29udGFpbmVyLm9uKCdjbG9zZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgc2VsZi5faGlkZURyb3Bkb3duKCk7XHJcbiAgICAgIHNlbGYuX2RldGFjaFBvc2l0aW9uaW5nSGFuZGxlcihjb250YWluZXIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy4kZHJvcGRvd25Db250YWluZXIub24oJ21vdXNlZG93bicsIGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgQXR0YWNoQm9keS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQpIHtcclxuICAgIGRlY29yYXRlZC5jYWxsKHRoaXMpO1xyXG5cclxuICAgIHRoaXMuJGRyb3Bkb3duQ29udGFpbmVyLnJlbW92ZSgpO1xyXG4gIH07XHJcblxyXG4gIEF0dGFjaEJvZHkucHJvdG90eXBlLnBvc2l0aW9uID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgJGRyb3Bkb3duLCAkY29udGFpbmVyKSB7XHJcbiAgICAvLyBDbG9uZSBhbGwgb2YgdGhlIGNvbnRhaW5lciBjbGFzc2VzXHJcbiAgICAkZHJvcGRvd24uYXR0cignY2xhc3MnLCAkY29udGFpbmVyLmF0dHIoJ2NsYXNzJykpO1xyXG5cclxuICAgICRkcm9wZG93bi5yZW1vdmVDbGFzcygnc2VsZWN0MicpO1xyXG4gICAgJGRyb3Bkb3duLmFkZENsYXNzKCdzZWxlY3QyLWNvbnRhaW5lci0tb3BlbicpO1xyXG5cclxuICAgICRkcm9wZG93bi5jc3Moe1xyXG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcclxuICAgICAgdG9wOiAtOTk5OTk5XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLiRjb250YWluZXIgPSAkY29udGFpbmVyO1xyXG4gIH07XHJcblxyXG4gIEF0dGFjaEJvZHkucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChkZWNvcmF0ZWQpIHtcclxuICAgIHZhciAkY29udGFpbmVyID0gJCgnPHNwYW4+PC9zcGFuPicpO1xyXG5cclxuICAgIHZhciAkZHJvcGRvd24gPSBkZWNvcmF0ZWQuY2FsbCh0aGlzKTtcclxuICAgICRjb250YWluZXIuYXBwZW5kKCRkcm9wZG93bik7XHJcblxyXG4gICAgdGhpcy4kZHJvcGRvd25Db250YWluZXIgPSAkY29udGFpbmVyO1xyXG5cclxuICAgIHJldHVybiAkY29udGFpbmVyO1xyXG4gIH07XHJcblxyXG4gIEF0dGFjaEJvZHkucHJvdG90eXBlLl9oaWRlRHJvcGRvd24gPSBmdW5jdGlvbiAoZGVjb3JhdGVkKSB7XHJcbiAgICB0aGlzLiRkcm9wZG93bkNvbnRhaW5lci5kZXRhY2goKTtcclxuICB9O1xyXG5cclxuICBBdHRhY2hCb2R5LnByb3RvdHlwZS5fYXR0YWNoUG9zaXRpb25pbmdIYW5kbGVyID1cclxuICAgICAgZnVuY3Rpb24gKGRlY29yYXRlZCwgY29udGFpbmVyKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgdmFyIHNjcm9sbEV2ZW50ID0gJ3Njcm9sbC5zZWxlY3QyLicgKyBjb250YWluZXIuaWQ7XHJcbiAgICB2YXIgcmVzaXplRXZlbnQgPSAncmVzaXplLnNlbGVjdDIuJyArIGNvbnRhaW5lci5pZDtcclxuICAgIHZhciBvcmllbnRhdGlvbkV2ZW50ID0gJ29yaWVudGF0aW9uY2hhbmdlLnNlbGVjdDIuJyArIGNvbnRhaW5lci5pZDtcclxuXHJcbiAgICB2YXIgJHdhdGNoZXJzID0gdGhpcy4kY29udGFpbmVyLnBhcmVudHMoKS5maWx0ZXIoVXRpbHMuaGFzU2Nyb2xsKTtcclxuICAgICR3YXRjaGVycy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgJCh0aGlzKS5kYXRhKCdzZWxlY3QyLXNjcm9sbC1wb3NpdGlvbicsIHtcclxuICAgICAgICB4OiAkKHRoaXMpLnNjcm9sbExlZnQoKSxcclxuICAgICAgICB5OiAkKHRoaXMpLnNjcm9sbFRvcCgpXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJHdhdGNoZXJzLm9uKHNjcm9sbEV2ZW50LCBmdW5jdGlvbiAoZXYpIHtcclxuICAgICAgdmFyIHBvc2l0aW9uID0gJCh0aGlzKS5kYXRhKCdzZWxlY3QyLXNjcm9sbC1wb3NpdGlvbicpO1xyXG4gICAgICAkKHRoaXMpLnNjcm9sbFRvcChwb3NpdGlvbi55KTtcclxuICAgIH0pO1xyXG5cclxuICAgICQod2luZG93KS5vbihzY3JvbGxFdmVudCArICcgJyArIHJlc2l6ZUV2ZW50ICsgJyAnICsgb3JpZW50YXRpb25FdmVudCxcclxuICAgICAgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgc2VsZi5fcG9zaXRpb25Ecm9wZG93bigpO1xyXG4gICAgICBzZWxmLl9yZXNpemVEcm9wZG93bigpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgQXR0YWNoQm9keS5wcm90b3R5cGUuX2RldGFjaFBvc2l0aW9uaW5nSGFuZGxlciA9XHJcbiAgICAgIGZ1bmN0aW9uIChkZWNvcmF0ZWQsIGNvbnRhaW5lcikge1xyXG4gICAgdmFyIHNjcm9sbEV2ZW50ID0gJ3Njcm9sbC5zZWxlY3QyLicgKyBjb250YWluZXIuaWQ7XHJcbiAgICB2YXIgcmVzaXplRXZlbnQgPSAncmVzaXplLnNlbGVjdDIuJyArIGNvbnRhaW5lci5pZDtcclxuICAgIHZhciBvcmllbnRhdGlvbkV2ZW50ID0gJ29yaWVudGF0aW9uY2hhbmdlLnNlbGVjdDIuJyArIGNvbnRhaW5lci5pZDtcclxuXHJcbiAgICB2YXIgJHdhdGNoZXJzID0gdGhpcy4kY29udGFpbmVyLnBhcmVudHMoKS5maWx0ZXIoVXRpbHMuaGFzU2Nyb2xsKTtcclxuICAgICR3YXRjaGVycy5vZmYoc2Nyb2xsRXZlbnQpO1xyXG5cclxuICAgICQod2luZG93KS5vZmYoc2Nyb2xsRXZlbnQgKyAnICcgKyByZXNpemVFdmVudCArICcgJyArIG9yaWVudGF0aW9uRXZlbnQpO1xyXG4gIH07XHJcblxyXG4gIEF0dGFjaEJvZHkucHJvdG90eXBlLl9wb3NpdGlvbkRyb3Bkb3duID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyICR3aW5kb3cgPSAkKHdpbmRvdyk7XHJcblxyXG4gICAgdmFyIGlzQ3VycmVudGx5QWJvdmUgPSB0aGlzLiRkcm9wZG93bi5oYXNDbGFzcygnc2VsZWN0Mi1kcm9wZG93bi0tYWJvdmUnKTtcclxuICAgIHZhciBpc0N1cnJlbnRseUJlbG93ID0gdGhpcy4kZHJvcGRvd24uaGFzQ2xhc3MoJ3NlbGVjdDItZHJvcGRvd24tLWJlbG93Jyk7XHJcblxyXG4gICAgdmFyIG5ld0RpcmVjdGlvbiA9IG51bGw7XHJcblxyXG4gICAgdmFyIG9mZnNldCA9IHRoaXMuJGNvbnRhaW5lci5vZmZzZXQoKTtcclxuXHJcbiAgICBvZmZzZXQuYm90dG9tID0gb2Zmc2V0LnRvcCArIHRoaXMuJGNvbnRhaW5lci5vdXRlckhlaWdodChmYWxzZSk7XHJcblxyXG4gICAgdmFyIGNvbnRhaW5lciA9IHtcclxuICAgICAgaGVpZ2h0OiB0aGlzLiRjb250YWluZXIub3V0ZXJIZWlnaHQoZmFsc2UpXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnRhaW5lci50b3AgPSBvZmZzZXQudG9wO1xyXG4gICAgY29udGFpbmVyLmJvdHRvbSA9IG9mZnNldC50b3AgKyBjb250YWluZXIuaGVpZ2h0O1xyXG5cclxuICAgIHZhciBkcm9wZG93biA9IHtcclxuICAgICAgaGVpZ2h0OiB0aGlzLiRkcm9wZG93bi5vdXRlckhlaWdodChmYWxzZSlcclxuICAgIH07XHJcblxyXG4gICAgdmFyIHZpZXdwb3J0ID0ge1xyXG4gICAgICB0b3A6ICR3aW5kb3cuc2Nyb2xsVG9wKCksXHJcbiAgICAgIGJvdHRvbTogJHdpbmRvdy5zY3JvbGxUb3AoKSArICR3aW5kb3cuaGVpZ2h0KClcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGVub3VnaFJvb21BYm92ZSA9IHZpZXdwb3J0LnRvcCA8IChvZmZzZXQudG9wIC0gZHJvcGRvd24uaGVpZ2h0KTtcclxuICAgIHZhciBlbm91Z2hSb29tQmVsb3cgPSB2aWV3cG9ydC5ib3R0b20gPiAob2Zmc2V0LmJvdHRvbSArIGRyb3Bkb3duLmhlaWdodCk7XHJcblxyXG4gICAgdmFyIGNzcyA9IHtcclxuICAgICAgbGVmdDogb2Zmc2V0LmxlZnQsXHJcbiAgICAgIHRvcDogY29udGFpbmVyLmJvdHRvbVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBEZXRlcm1pbmUgd2hhdCB0aGUgcGFyZW50IGVsZW1lbnQgaXMgdG8gdXNlIGZvciBjYWxjaXVsYXRpbmcgdGhlIG9mZnNldFxyXG4gICAgdmFyICRvZmZzZXRQYXJlbnQgPSB0aGlzLiRkcm9wZG93blBhcmVudDtcclxuXHJcbiAgICAvLyBGb3Igc3RhdGljYWxseSBwb3NpdG9uZWQgZWxlbWVudHMsIHdlIG5lZWQgdG8gZ2V0IHRoZSBlbGVtZW50XHJcbiAgICAvLyB0aGF0IGlzIGRldGVybWluaW5nIHRoZSBvZmZzZXRcclxuICAgIGlmICgkb2Zmc2V0UGFyZW50LmNzcygncG9zaXRpb24nKSA9PT0gJ3N0YXRpYycpIHtcclxuICAgICAgJG9mZnNldFBhcmVudCA9ICRvZmZzZXRQYXJlbnQub2Zmc2V0UGFyZW50KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHBhcmVudE9mZnNldCA9ICRvZmZzZXRQYXJlbnQub2Zmc2V0KCk7XHJcblxyXG4gICAgY3NzLnRvcCAtPSBwYXJlbnRPZmZzZXQudG9wO1xyXG4gICAgY3NzLmxlZnQgLT0gcGFyZW50T2Zmc2V0LmxlZnQ7XHJcblxyXG4gICAgaWYgKCFpc0N1cnJlbnRseUFib3ZlICYmICFpc0N1cnJlbnRseUJlbG93KSB7XHJcbiAgICAgIG5ld0RpcmVjdGlvbiA9ICdiZWxvdyc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFlbm91Z2hSb29tQmVsb3cgJiYgZW5vdWdoUm9vbUFib3ZlICYmICFpc0N1cnJlbnRseUFib3ZlKSB7XHJcbiAgICAgIG5ld0RpcmVjdGlvbiA9ICdhYm92ZSc7XHJcbiAgICB9IGVsc2UgaWYgKCFlbm91Z2hSb29tQWJvdmUgJiYgZW5vdWdoUm9vbUJlbG93ICYmIGlzQ3VycmVudGx5QWJvdmUpIHtcclxuICAgICAgbmV3RGlyZWN0aW9uID0gJ2JlbG93JztcclxuICAgIH1cclxuXHJcbiAgICBpZiAobmV3RGlyZWN0aW9uID09ICdhYm92ZScgfHxcclxuICAgICAgKGlzQ3VycmVudGx5QWJvdmUgJiYgbmV3RGlyZWN0aW9uICE9PSAnYmVsb3cnKSkge1xyXG4gICAgICBjc3MudG9wID0gY29udGFpbmVyLnRvcCAtIHBhcmVudE9mZnNldC50b3AgLSBkcm9wZG93bi5oZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG5ld0RpcmVjdGlvbiAhPSBudWxsKSB7XHJcbiAgICAgIHRoaXMuJGRyb3Bkb3duXHJcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdzZWxlY3QyLWRyb3Bkb3duLS1iZWxvdyBzZWxlY3QyLWRyb3Bkb3duLS1hYm92ZScpXHJcbiAgICAgICAgLmFkZENsYXNzKCdzZWxlY3QyLWRyb3Bkb3duLS0nICsgbmV3RGlyZWN0aW9uKTtcclxuICAgICAgdGhpcy4kY29udGFpbmVyXHJcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdzZWxlY3QyLWNvbnRhaW5lci0tYmVsb3cgc2VsZWN0Mi1jb250YWluZXItLWFib3ZlJylcclxuICAgICAgICAuYWRkQ2xhc3MoJ3NlbGVjdDItY29udGFpbmVyLS0nICsgbmV3RGlyZWN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiRkcm9wZG93bkNvbnRhaW5lci5jc3MoY3NzKTtcclxuICB9O1xyXG5cclxuICBBdHRhY2hCb2R5LnByb3RvdHlwZS5fcmVzaXplRHJvcGRvd24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgY3NzID0ge1xyXG4gICAgICB3aWR0aDogdGhpcy4kY29udGFpbmVyLm91dGVyV2lkdGgoZmFsc2UpICsgJ3B4J1xyXG4gICAgfTtcclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLmdldCgnZHJvcGRvd25BdXRvV2lkdGgnKSkge1xyXG4gICAgICBjc3MubWluV2lkdGggPSBjc3Mud2lkdGg7XHJcbiAgICAgIGNzcy5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XHJcbiAgICAgIGNzcy53aWR0aCA9ICdhdXRvJztcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiRkcm9wZG93bi5jc3MoY3NzKTtcclxuICB9O1xyXG5cclxuICBBdHRhY2hCb2R5LnByb3RvdHlwZS5fc2hvd0Ryb3Bkb3duID0gZnVuY3Rpb24gKGRlY29yYXRlZCkge1xyXG4gICAgdGhpcy4kZHJvcGRvd25Db250YWluZXIuYXBwZW5kVG8odGhpcy4kZHJvcGRvd25QYXJlbnQpO1xyXG5cclxuICAgIHRoaXMuX3Bvc2l0aW9uRHJvcGRvd24oKTtcclxuICAgIHRoaXMuX3Jlc2l6ZURyb3Bkb3duKCk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIEF0dGFjaEJvZHk7XHJcbn0pO1xyXG5cclxuUzIuZGVmaW5lKCdzZWxlY3QyL2Ryb3Bkb3duL21pbmltdW1SZXN1bHRzRm9yU2VhcmNoJyxbXHJcblxyXG5dLCBmdW5jdGlvbiAoKSB7XHJcbiAgZnVuY3Rpb24gY291bnRSZXN1bHRzIChkYXRhKSB7XHJcbiAgICB2YXIgY291bnQgPSAwO1xyXG5cclxuICAgIGZvciAodmFyIGQgPSAwOyBkIDwgZGF0YS5sZW5ndGg7IGQrKykge1xyXG4gICAgICB2YXIgaXRlbSA9IGRhdGFbZF07XHJcblxyXG4gICAgICBpZiAoaXRlbS5jaGlsZHJlbikge1xyXG4gICAgICAgIGNvdW50ICs9IGNvdW50UmVzdWx0cyhpdGVtLmNoaWxkcmVuKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb3VudCsrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNvdW50O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gTWluaW11bVJlc3VsdHNGb3JTZWFyY2ggKGRlY29yYXRlZCwgJGVsZW1lbnQsIG9wdGlvbnMsIGRhdGFBZGFwdGVyKSB7XHJcbiAgICB0aGlzLm1pbmltdW1SZXN1bHRzRm9yU2VhcmNoID0gb3B0aW9ucy5nZXQoJ21pbmltdW1SZXN1bHRzRm9yU2VhcmNoJyk7XHJcblxyXG4gICAgaWYgKHRoaXMubWluaW11bVJlc3VsdHNGb3JTZWFyY2ggPCAwKSB7XHJcbiAgICAgIHRoaXMubWluaW11bVJlc3VsdHNGb3JTZWFyY2ggPSBJbmZpbml0eTtcclxuICAgIH1cclxuXHJcbiAgICBkZWNvcmF0ZWQuY2FsbCh0aGlzLCAkZWxlbWVudCwgb3B0aW9ucywgZGF0YUFkYXB0ZXIpO1xyXG4gIH1cclxuXHJcbiAgTWluaW11bVJlc3VsdHNGb3JTZWFyY2gucHJvdG90eXBlLnNob3dTZWFyY2ggPSBmdW5jdGlvbiAoZGVjb3JhdGVkLCBwYXJhbXMpIHtcclxuICAgIGlmIChjb3VudFJlc3VsdHMocGFyYW1zLmRhdGEucmVzdWx0cykgPCB0aGlzLm1pbmltdW1SZXN1bHRzRm9yU2VhcmNoKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZGVjb3JhdGVkLmNhbGwodGhpcywgcGFyYW1zKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gTWluaW11bVJlc3VsdHNGb3JTZWFyY2g7XHJcbn0pO1xyXG5cclxuUzIuZGVmaW5lKCdzZWxlY3QyL2Ryb3Bkb3duL3NlbGVjdE9uQ2xvc2UnLFtcclxuXHJcbl0sIGZ1bmN0aW9uICgpIHtcclxuICBmdW5jdGlvbiBTZWxlY3RPbkNsb3NlICgpIHsgfVxyXG5cclxuICBTZWxlY3RPbkNsb3NlLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgY29udGFpbmVyLCAkY29udGFpbmVyKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgY29udGFpbmVyLCAkY29udGFpbmVyKTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ2Nsb3NlJywgZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICBzZWxmLl9oYW5kbGVTZWxlY3RPbkNsb3NlKHBhcmFtcyk7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBTZWxlY3RPbkNsb3NlLnByb3RvdHlwZS5faGFuZGxlU2VsZWN0T25DbG9zZSA9IGZ1bmN0aW9uIChfLCBwYXJhbXMpIHtcclxuICAgIGlmIChwYXJhbXMgJiYgcGFyYW1zLm9yaWdpbmFsU2VsZWN0MkV2ZW50ICE9IG51bGwpIHtcclxuICAgICAgdmFyIGV2ZW50ID0gcGFyYW1zLm9yaWdpbmFsU2VsZWN0MkV2ZW50O1xyXG5cclxuICAgICAgLy8gRG9uJ3Qgc2VsZWN0IGFuIGl0ZW0gaWYgdGhlIGNsb3NlIGV2ZW50IHdhcyB0cmlnZ2VyZWQgZnJvbSBhIHNlbGVjdCBvclxyXG4gICAgICAvLyB1bnNlbGVjdCBldmVudFxyXG4gICAgICBpZiAoZXZlbnQuX3R5cGUgPT09ICdzZWxlY3QnIHx8IGV2ZW50Ll90eXBlID09PSAndW5zZWxlY3QnKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyICRoaWdobGlnaHRlZFJlc3VsdHMgPSB0aGlzLmdldEhpZ2hsaWdodGVkUmVzdWx0cygpO1xyXG5cclxuICAgIC8vIE9ubHkgc2VsZWN0IGhpZ2hsaWdodGVkIHJlc3VsdHNcclxuICAgIGlmICgkaGlnaGxpZ2h0ZWRSZXN1bHRzLmxlbmd0aCA8IDEpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBkYXRhID0gJGhpZ2hsaWdodGVkUmVzdWx0cy5kYXRhKCdkYXRhJyk7XHJcblxyXG4gICAgLy8gRG9uJ3QgcmUtc2VsZWN0IGFscmVhZHkgc2VsZWN0ZWQgcmVzdWx0ZVxyXG4gICAgaWYgKFxyXG4gICAgICAoZGF0YS5lbGVtZW50ICE9IG51bGwgJiYgZGF0YS5lbGVtZW50LnNlbGVjdGVkKSB8fFxyXG4gICAgICAoZGF0YS5lbGVtZW50ID09IG51bGwgJiYgZGF0YS5zZWxlY3RlZClcclxuICAgICkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy50cmlnZ2VyKCdzZWxlY3QnLCB7XHJcbiAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIFNlbGVjdE9uQ2xvc2U7XHJcbn0pO1xyXG5cclxuUzIuZGVmaW5lKCdzZWxlY3QyL2Ryb3Bkb3duL2Nsb3NlT25TZWxlY3QnLFtcclxuXHJcbl0sIGZ1bmN0aW9uICgpIHtcclxuICBmdW5jdGlvbiBDbG9zZU9uU2VsZWN0ICgpIHsgfVxyXG5cclxuICBDbG9zZU9uU2VsZWN0LnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKGRlY29yYXRlZCwgY29udGFpbmVyLCAkY29udGFpbmVyKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgZGVjb3JhdGVkLmNhbGwodGhpcywgY29udGFpbmVyLCAkY29udGFpbmVyKTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ3NlbGVjdCcsIGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgc2VsZi5fc2VsZWN0VHJpZ2dlcmVkKGV2dCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb250YWluZXIub24oJ3Vuc2VsZWN0JywgZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICBzZWxmLl9zZWxlY3RUcmlnZ2VyZWQoZXZ0KTtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIENsb3NlT25TZWxlY3QucHJvdG90eXBlLl9zZWxlY3RUcmlnZ2VyZWQgPSBmdW5jdGlvbiAoXywgZXZ0KSB7XHJcbiAgICB2YXIgb3JpZ2luYWxFdmVudCA9IGV2dC5vcmlnaW5hbEV2ZW50O1xyXG5cclxuICAgIC8vIERvbid0IGNsb3NlIGlmIHRoZSBjb250cm9sIGtleSBpcyBiZWluZyBoZWxkXHJcbiAgICBpZiAob3JpZ2luYWxFdmVudCAmJiBvcmlnaW5hbEV2ZW50LmN0cmxLZXkpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudHJpZ2dlcignY2xvc2UnLCB7XHJcbiAgICAgIG9yaWdpbmFsRXZlbnQ6IG9yaWdpbmFsRXZlbnQsXHJcbiAgICAgIG9yaWdpbmFsU2VsZWN0MkV2ZW50OiBldnRcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBDbG9zZU9uU2VsZWN0O1xyXG59KTtcclxuXHJcblMyLmRlZmluZSgnc2VsZWN0Mi9pMThuL2VuJyxbXSxmdW5jdGlvbiAoKSB7XHJcbiAgLy8gRW5nbGlzaFxyXG4gIHJldHVybiB7XHJcbiAgICBlcnJvckxvYWRpbmc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuICdUaGUgcmVzdWx0cyBjb3VsZCBub3QgYmUgbG9hZGVkLic7XHJcbiAgICB9LFxyXG4gICAgaW5wdXRUb29Mb25nOiBmdW5jdGlvbiAoYXJncykge1xyXG4gICAgICB2YXIgb3ZlckNoYXJzID0gYXJncy5pbnB1dC5sZW5ndGggLSBhcmdzLm1heGltdW07XHJcblxyXG4gICAgICB2YXIgbWVzc2FnZSA9ICdQbGVhc2UgZGVsZXRlICcgKyBvdmVyQ2hhcnMgKyAnIGNoYXJhY3Rlcic7XHJcblxyXG4gICAgICBpZiAob3ZlckNoYXJzICE9IDEpIHtcclxuICAgICAgICBtZXNzYWdlICs9ICdzJztcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIG1lc3NhZ2U7XHJcbiAgICB9LFxyXG4gICAgaW5wdXRUb29TaG9ydDogZnVuY3Rpb24gKGFyZ3MpIHtcclxuICAgICAgdmFyIHJlbWFpbmluZ0NoYXJzID0gYXJncy5taW5pbXVtIC0gYXJncy5pbnB1dC5sZW5ndGg7XHJcblxyXG4gICAgICB2YXIgbWVzc2FnZSA9ICdQbGVhc2UgZW50ZXIgJyArIHJlbWFpbmluZ0NoYXJzICsgJyBvciBtb3JlIGNoYXJhY3RlcnMnO1xyXG5cclxuICAgICAgcmV0dXJuIG1lc3NhZ2U7XHJcbiAgICB9LFxyXG4gICAgbG9hZGluZ01vcmU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuICdMb2FkaW5nIG1vcmUgcmVzdWx0c+KApic7XHJcbiAgICB9LFxyXG4gICAgbWF4aW11bVNlbGVjdGVkOiBmdW5jdGlvbiAoYXJncykge1xyXG4gICAgICB2YXIgbWVzc2FnZSA9ICdZb3UgY2FuIG9ubHkgc2VsZWN0ICcgKyBhcmdzLm1heGltdW0gKyAnIGl0ZW0nO1xyXG5cclxuICAgICAgaWYgKGFyZ3MubWF4aW11bSAhPSAxKSB7XHJcbiAgICAgICAgbWVzc2FnZSArPSAncyc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBtZXNzYWdlO1xyXG4gICAgfSxcclxuICAgIG5vUmVzdWx0czogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gJ05vIHJlc3VsdHMgZm91bmQnO1xyXG4gICAgfSxcclxuICAgIHNlYXJjaGluZzogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gJ1NlYXJjaGluZ+KApic7XHJcbiAgICB9XHJcbiAgfTtcclxufSk7XHJcblxyXG5TMi5kZWZpbmUoJ3NlbGVjdDIvZGVmYXVsdHMnLFtcclxuICAnanF1ZXJ5JyxcclxuICAncmVxdWlyZScsXHJcblxyXG4gICcuL3Jlc3VsdHMnLFxyXG5cclxuICAnLi9zZWxlY3Rpb24vc2luZ2xlJyxcclxuICAnLi9zZWxlY3Rpb24vbXVsdGlwbGUnLFxyXG4gICcuL3NlbGVjdGlvbi9wbGFjZWhvbGRlcicsXHJcbiAgJy4vc2VsZWN0aW9uL2FsbG93Q2xlYXInLFxyXG4gICcuL3NlbGVjdGlvbi9zZWFyY2gnLFxyXG4gICcuL3NlbGVjdGlvbi9ldmVudFJlbGF5JyxcclxuXHJcbiAgJy4vdXRpbHMnLFxyXG4gICcuL3RyYW5zbGF0aW9uJyxcclxuICAnLi9kaWFjcml0aWNzJyxcclxuXHJcbiAgJy4vZGF0YS9zZWxlY3QnLFxyXG4gICcuL2RhdGEvYXJyYXknLFxyXG4gICcuL2RhdGEvYWpheCcsXHJcbiAgJy4vZGF0YS90YWdzJyxcclxuICAnLi9kYXRhL3Rva2VuaXplcicsXHJcbiAgJy4vZGF0YS9taW5pbXVtSW5wdXRMZW5ndGgnLFxyXG4gICcuL2RhdGEvbWF4aW11bUlucHV0TGVuZ3RoJyxcclxuICAnLi9kYXRhL21heGltdW1TZWxlY3Rpb25MZW5ndGgnLFxyXG5cclxuICAnLi9kcm9wZG93bicsXHJcbiAgJy4vZHJvcGRvd24vc2VhcmNoJyxcclxuICAnLi9kcm9wZG93bi9oaWRlUGxhY2Vob2xkZXInLFxyXG4gICcuL2Ryb3Bkb3duL2luZmluaXRlU2Nyb2xsJyxcclxuICAnLi9kcm9wZG93bi9hdHRhY2hCb2R5JyxcclxuICAnLi9kcm9wZG93bi9taW5pbXVtUmVzdWx0c0ZvclNlYXJjaCcsXHJcbiAgJy4vZHJvcGRvd24vc2VsZWN0T25DbG9zZScsXHJcbiAgJy4vZHJvcGRvd24vY2xvc2VPblNlbGVjdCcsXHJcblxyXG4gICcuL2kxOG4vZW4nXHJcbl0sIGZ1bmN0aW9uICgkLCByZXF1aXJlLFxyXG5cclxuICAgICAgICAgICAgIFJlc3VsdHNMaXN0LFxyXG5cclxuICAgICAgICAgICAgIFNpbmdsZVNlbGVjdGlvbiwgTXVsdGlwbGVTZWxlY3Rpb24sIFBsYWNlaG9sZGVyLCBBbGxvd0NsZWFyLFxyXG4gICAgICAgICAgICAgU2VsZWN0aW9uU2VhcmNoLCBFdmVudFJlbGF5LFxyXG5cclxuICAgICAgICAgICAgIFV0aWxzLCBUcmFuc2xhdGlvbiwgRElBQ1JJVElDUyxcclxuXHJcbiAgICAgICAgICAgICBTZWxlY3REYXRhLCBBcnJheURhdGEsIEFqYXhEYXRhLCBUYWdzLCBUb2tlbml6ZXIsXHJcbiAgICAgICAgICAgICBNaW5pbXVtSW5wdXRMZW5ndGgsIE1heGltdW1JbnB1dExlbmd0aCwgTWF4aW11bVNlbGVjdGlvbkxlbmd0aCxcclxuXHJcbiAgICAgICAgICAgICBEcm9wZG93biwgRHJvcGRvd25TZWFyY2gsIEhpZGVQbGFjZWhvbGRlciwgSW5maW5pdGVTY3JvbGwsXHJcbiAgICAgICAgICAgICBBdHRhY2hCb2R5LCBNaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCwgU2VsZWN0T25DbG9zZSwgQ2xvc2VPblNlbGVjdCxcclxuXHJcbiAgICAgICAgICAgICBFbmdsaXNoVHJhbnNsYXRpb24pIHtcclxuICBmdW5jdGlvbiBEZWZhdWx0cyAoKSB7XHJcbiAgICB0aGlzLnJlc2V0KCk7XHJcbiAgfVxyXG5cclxuICBEZWZhdWx0cy5wcm90b3R5cGUuYXBwbHkgPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCB0aGlzLmRlZmF1bHRzLCBvcHRpb25zKTtcclxuXHJcbiAgICBpZiAob3B0aW9ucy5kYXRhQWRhcHRlciA9PSBudWxsKSB7XHJcbiAgICAgIGlmIChvcHRpb25zLmFqYXggIT0gbnVsbCkge1xyXG4gICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIgPSBBamF4RGF0YTtcclxuICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmRhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIgPSBBcnJheURhdGE7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlciA9IFNlbGVjdERhdGE7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChvcHRpb25zLm1pbmltdW1JbnB1dExlbmd0aCA+IDApIHtcclxuICAgICAgICBvcHRpb25zLmRhdGFBZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXHJcbiAgICAgICAgICBvcHRpb25zLmRhdGFBZGFwdGVyLFxyXG4gICAgICAgICAgTWluaW11bUlucHV0TGVuZ3RoXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG9wdGlvbnMubWF4aW11bUlucHV0TGVuZ3RoID4gMCkge1xyXG4gICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcclxuICAgICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIsXHJcbiAgICAgICAgICBNYXhpbXVtSW5wdXRMZW5ndGhcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5tYXhpbXVtU2VsZWN0aW9uTGVuZ3RoID4gMCkge1xyXG4gICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcclxuICAgICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIsXHJcbiAgICAgICAgICBNYXhpbXVtU2VsZWN0aW9uTGVuZ3RoXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG9wdGlvbnMudGFncykge1xyXG4gICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShvcHRpb25zLmRhdGFBZGFwdGVyLCBUYWdzKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG9wdGlvbnMudG9rZW5TZXBhcmF0b3JzICE9IG51bGwgfHwgb3B0aW9ucy50b2tlbml6ZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcclxuICAgICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIsXHJcbiAgICAgICAgICBUb2tlbml6ZXJcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5xdWVyeSAhPSBudWxsKSB7XHJcbiAgICAgICAgdmFyIFF1ZXJ5ID0gcmVxdWlyZShvcHRpb25zLmFtZEJhc2UgKyAnY29tcGF0L3F1ZXJ5Jyk7XHJcblxyXG4gICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcclxuICAgICAgICAgIG9wdGlvbnMuZGF0YUFkYXB0ZXIsXHJcbiAgICAgICAgICBRdWVyeVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChvcHRpb25zLmluaXRTZWxlY3Rpb24gIT0gbnVsbCkge1xyXG4gICAgICAgIHZhciBJbml0U2VsZWN0aW9uID0gcmVxdWlyZShvcHRpb25zLmFtZEJhc2UgKyAnY29tcGF0L2luaXRTZWxlY3Rpb24nKTtcclxuXHJcbiAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxyXG4gICAgICAgICAgb3B0aW9ucy5kYXRhQWRhcHRlcixcclxuICAgICAgICAgIEluaXRTZWxlY3Rpb25cclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9wdGlvbnMucmVzdWx0c0FkYXB0ZXIgPT0gbnVsbCkge1xyXG4gICAgICBvcHRpb25zLnJlc3VsdHNBZGFwdGVyID0gUmVzdWx0c0xpc3Q7XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5hamF4ICE9IG51bGwpIHtcclxuICAgICAgICBvcHRpb25zLnJlc3VsdHNBZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXHJcbiAgICAgICAgICBvcHRpb25zLnJlc3VsdHNBZGFwdGVyLFxyXG4gICAgICAgICAgSW5maW5pdGVTY3JvbGxcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5wbGFjZWhvbGRlciAhPSBudWxsKSB7XHJcbiAgICAgICAgb3B0aW9ucy5yZXN1bHRzQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxyXG4gICAgICAgICAgb3B0aW9ucy5yZXN1bHRzQWRhcHRlcixcclxuICAgICAgICAgIEhpZGVQbGFjZWhvbGRlclxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChvcHRpb25zLnNlbGVjdE9uQ2xvc2UpIHtcclxuICAgICAgICBvcHRpb25zLnJlc3VsdHNBZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXHJcbiAgICAgICAgICBvcHRpb25zLnJlc3VsdHNBZGFwdGVyLFxyXG4gICAgICAgICAgU2VsZWN0T25DbG9zZVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAob3B0aW9ucy5kcm9wZG93bkFkYXB0ZXIgPT0gbnVsbCkge1xyXG4gICAgICBpZiAob3B0aW9ucy5tdWx0aXBsZSkge1xyXG4gICAgICAgIG9wdGlvbnMuZHJvcGRvd25BZGFwdGVyID0gRHJvcGRvd247XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIFNlYXJjaGFibGVEcm9wZG93biA9IFV0aWxzLkRlY29yYXRlKERyb3Bkb3duLCBEcm9wZG93blNlYXJjaCk7XHJcblxyXG4gICAgICAgIG9wdGlvbnMuZHJvcGRvd25BZGFwdGVyID0gU2VhcmNoYWJsZURyb3Bkb3duO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5taW5pbXVtUmVzdWx0c0ZvclNlYXJjaCAhPT0gMCkge1xyXG4gICAgICAgIG9wdGlvbnMuZHJvcGRvd25BZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXHJcbiAgICAgICAgICBvcHRpb25zLmRyb3Bkb3duQWRhcHRlcixcclxuICAgICAgICAgIE1pbmltdW1SZXN1bHRzRm9yU2VhcmNoXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG9wdGlvbnMuY2xvc2VPblNlbGVjdCkge1xyXG4gICAgICAgIG9wdGlvbnMuZHJvcGRvd25BZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXHJcbiAgICAgICAgICBvcHRpb25zLmRyb3Bkb3duQWRhcHRlcixcclxuICAgICAgICAgIENsb3NlT25TZWxlY3RcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgb3B0aW9ucy5kcm9wZG93bkNzc0NsYXNzICE9IG51bGwgfHxcclxuICAgICAgICBvcHRpb25zLmRyb3Bkb3duQ3NzICE9IG51bGwgfHxcclxuICAgICAgICBvcHRpb25zLmFkYXB0RHJvcGRvd25Dc3NDbGFzcyAhPSBudWxsXHJcbiAgICAgICkge1xyXG4gICAgICAgIHZhciBEcm9wZG93bkNTUyA9IHJlcXVpcmUob3B0aW9ucy5hbWRCYXNlICsgJ2NvbXBhdC9kcm9wZG93bkNzcycpO1xyXG5cclxuICAgICAgICBvcHRpb25zLmRyb3Bkb3duQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxyXG4gICAgICAgICAgb3B0aW9ucy5kcm9wZG93bkFkYXB0ZXIsXHJcbiAgICAgICAgICBEcm9wZG93bkNTU1xyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG9wdGlvbnMuZHJvcGRvd25BZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXHJcbiAgICAgICAgb3B0aW9ucy5kcm9wZG93bkFkYXB0ZXIsXHJcbiAgICAgICAgQXR0YWNoQm9keVxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRpb25zLnNlbGVjdGlvbkFkYXB0ZXIgPT0gbnVsbCkge1xyXG4gICAgICBpZiAob3B0aW9ucy5tdWx0aXBsZSkge1xyXG4gICAgICAgIG9wdGlvbnMuc2VsZWN0aW9uQWRhcHRlciA9IE11bHRpcGxlU2VsZWN0aW9uO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG9wdGlvbnMuc2VsZWN0aW9uQWRhcHRlciA9IFNpbmdsZVNlbGVjdGlvbjtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gQWRkIHRoZSBwbGFjZWhvbGRlciBtaXhpbiBpZiBhIHBsYWNlaG9sZGVyIHdhcyBzcGVjaWZpZWRcclxuICAgICAgaWYgKG9wdGlvbnMucGxhY2Vob2xkZXIgIT0gbnVsbCkge1xyXG4gICAgICAgIG9wdGlvbnMuc2VsZWN0aW9uQWRhcHRlciA9IFV0aWxzLkRlY29yYXRlKFxyXG4gICAgICAgICAgb3B0aW9ucy5zZWxlY3Rpb25BZGFwdGVyLFxyXG4gICAgICAgICAgUGxhY2Vob2xkZXJcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5hbGxvd0NsZWFyKSB7XHJcbiAgICAgICAgb3B0aW9ucy5zZWxlY3Rpb25BZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXHJcbiAgICAgICAgICBvcHRpb25zLnNlbGVjdGlvbkFkYXB0ZXIsXHJcbiAgICAgICAgICBBbGxvd0NsZWFyXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG9wdGlvbnMubXVsdGlwbGUpIHtcclxuICAgICAgICBvcHRpb25zLnNlbGVjdGlvbkFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcclxuICAgICAgICAgIG9wdGlvbnMuc2VsZWN0aW9uQWRhcHRlcixcclxuICAgICAgICAgIFNlbGVjdGlvblNlYXJjaFxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChcclxuICAgICAgICBvcHRpb25zLmNvbnRhaW5lckNzc0NsYXNzICE9IG51bGwgfHxcclxuICAgICAgICBvcHRpb25zLmNvbnRhaW5lckNzcyAhPSBudWxsIHx8XHJcbiAgICAgICAgb3B0aW9ucy5hZGFwdENvbnRhaW5lckNzc0NsYXNzICE9IG51bGxcclxuICAgICAgKSB7XHJcbiAgICAgICAgdmFyIENvbnRhaW5lckNTUyA9IHJlcXVpcmUob3B0aW9ucy5hbWRCYXNlICsgJ2NvbXBhdC9jb250YWluZXJDc3MnKTtcclxuXHJcbiAgICAgICAgb3B0aW9ucy5zZWxlY3Rpb25BZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXHJcbiAgICAgICAgICBvcHRpb25zLnNlbGVjdGlvbkFkYXB0ZXIsXHJcbiAgICAgICAgICBDb250YWluZXJDU1NcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBvcHRpb25zLnNlbGVjdGlvbkFkYXB0ZXIgPSBVdGlscy5EZWNvcmF0ZShcclxuICAgICAgICBvcHRpb25zLnNlbGVjdGlvbkFkYXB0ZXIsXHJcbiAgICAgICAgRXZlbnRSZWxheVxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5sYW5ndWFnZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgLy8gQ2hlY2sgaWYgdGhlIGxhbmd1YWdlIGlzIHNwZWNpZmllZCB3aXRoIGEgcmVnaW9uXHJcbiAgICAgIGlmIChvcHRpb25zLmxhbmd1YWdlLmluZGV4T2YoJy0nKSA+IDApIHtcclxuICAgICAgICAvLyBFeHRyYWN0IHRoZSByZWdpb24gaW5mb3JtYXRpb24gaWYgaXQgaXMgaW5jbHVkZWRcclxuICAgICAgICB2YXIgbGFuZ3VhZ2VQYXJ0cyA9IG9wdGlvbnMubGFuZ3VhZ2Uuc3BsaXQoJy0nKTtcclxuICAgICAgICB2YXIgYmFzZUxhbmd1YWdlID0gbGFuZ3VhZ2VQYXJ0c1swXTtcclxuXHJcbiAgICAgICAgb3B0aW9ucy5sYW5ndWFnZSA9IFtvcHRpb25zLmxhbmd1YWdlLCBiYXNlTGFuZ3VhZ2VdO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG9wdGlvbnMubGFuZ3VhZ2UgPSBbb3B0aW9ucy5sYW5ndWFnZV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoJC5pc0FycmF5KG9wdGlvbnMubGFuZ3VhZ2UpKSB7XHJcbiAgICAgIHZhciBsYW5ndWFnZXMgPSBuZXcgVHJhbnNsYXRpb24oKTtcclxuICAgICAgb3B0aW9ucy5sYW5ndWFnZS5wdXNoKCdlbicpO1xyXG5cclxuICAgICAgdmFyIGxhbmd1YWdlTmFtZXMgPSBvcHRpb25zLmxhbmd1YWdlO1xyXG5cclxuICAgICAgZm9yICh2YXIgbCA9IDA7IGwgPCBsYW5ndWFnZU5hbWVzLmxlbmd0aDsgbCsrKSB7XHJcbiAgICAgICAgdmFyIG5hbWUgPSBsYW5ndWFnZU5hbWVzW2xdO1xyXG4gICAgICAgIHZhciBsYW5ndWFnZSA9IHt9O1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgLy8gVHJ5IHRvIGxvYWQgaXQgd2l0aCB0aGUgb3JpZ2luYWwgbmFtZVxyXG4gICAgICAgICAgbGFuZ3VhZ2UgPSBUcmFuc2xhdGlvbi5sb2FkUGF0aChuYW1lKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvLyBJZiB3ZSBjb3VsZG4ndCBsb2FkIGl0LCBjaGVjayBpZiBpdCB3YXNuJ3QgdGhlIGZ1bGwgcGF0aFxyXG4gICAgICAgICAgICBuYW1lID0gdGhpcy5kZWZhdWx0cy5hbWRMYW5ndWFnZUJhc2UgKyBuYW1lO1xyXG4gICAgICAgICAgICBsYW5ndWFnZSA9IFRyYW5zbGF0aW9uLmxvYWRQYXRoKG5hbWUpO1xyXG4gICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgLy8gVGhlIHRyYW5zbGF0aW9uIGNvdWxkIG5vdCBiZSBsb2FkZWQgYXQgYWxsLiBTb21ldGltZXMgdGhpcyBpc1xyXG4gICAgICAgICAgICAvLyBiZWNhdXNlIG9mIGEgY29uZmlndXJhdGlvbiBwcm9ibGVtLCBvdGhlciB0aW1lcyB0aGlzIGNhbiBiZVxyXG4gICAgICAgICAgICAvLyBiZWNhdXNlIG9mIGhvdyBTZWxlY3QyIGhlbHBzIGxvYWQgYWxsIHBvc3NpYmxlIHRyYW5zbGF0aW9uIGZpbGVzLlxyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5kZWJ1ZyAmJiB3aW5kb3cuY29uc29sZSAmJiBjb25zb2xlLndhcm4pIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXHJcbiAgICAgICAgICAgICAgICAnU2VsZWN0MjogVGhlIGxhbmd1YWdlIGZpbGUgZm9yIFwiJyArIG5hbWUgKyAnXCIgY291bGQgbm90IGJlICcgK1xyXG4gICAgICAgICAgICAgICAgJ2F1dG9tYXRpY2FsbHkgbG9hZGVkLiBBIGZhbGxiYWNrIHdpbGwgYmUgdXNlZCBpbnN0ZWFkLidcclxuICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxhbmd1YWdlcy5leHRlbmQobGFuZ3VhZ2UpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBvcHRpb25zLnRyYW5zbGF0aW9ucyA9IGxhbmd1YWdlcztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBiYXNlVHJhbnNsYXRpb24gPSBUcmFuc2xhdGlvbi5sb2FkUGF0aChcclxuICAgICAgICB0aGlzLmRlZmF1bHRzLmFtZExhbmd1YWdlQmFzZSArICdlbidcclxuICAgICAgKTtcclxuICAgICAgdmFyIGN1c3RvbVRyYW5zbGF0aW9uID0gbmV3IFRyYW5zbGF0aW9uKG9wdGlvbnMubGFuZ3VhZ2UpO1xyXG5cclxuICAgICAgY3VzdG9tVHJhbnNsYXRpb24uZXh0ZW5kKGJhc2VUcmFuc2xhdGlvbik7XHJcblxyXG4gICAgICBvcHRpb25zLnRyYW5zbGF0aW9ucyA9IGN1c3RvbVRyYW5zbGF0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcHRpb25zO1xyXG4gIH07XHJcblxyXG4gIERlZmF1bHRzLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIHN0cmlwRGlhY3JpdGljcyAodGV4dCkge1xyXG4gICAgICAvLyBVc2VkICd1bmkgcmFuZ2UgKyBuYW1lZCBmdW5jdGlvbicgZnJvbSBodHRwOi8vanNwZXJmLmNvbS9kaWFjcml0aWNzLzE4XHJcbiAgICAgIGZ1bmN0aW9uIG1hdGNoKGEpIHtcclxuICAgICAgICByZXR1cm4gRElBQ1JJVElDU1thXSB8fCBhO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGV4dC5yZXBsYWNlKC9bXlxcdTAwMDAtXFx1MDA3RV0vZywgbWF0Y2gpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG1hdGNoZXIgKHBhcmFtcywgZGF0YSkge1xyXG4gICAgICAvLyBBbHdheXMgcmV0dXJuIHRoZSBvYmplY3QgaWYgdGhlcmUgaXMgbm90aGluZyB0byBjb21wYXJlXHJcbiAgICAgIGlmICgkLnRyaW0ocGFyYW1zLnRlcm0pID09PSAnJykge1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBEbyBhIHJlY3Vyc2l2ZSBjaGVjayBmb3Igb3B0aW9ucyB3aXRoIGNoaWxkcmVuXHJcbiAgICAgIGlmIChkYXRhLmNoaWxkcmVuICYmIGRhdGEuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIC8vIENsb25lIHRoZSBkYXRhIG9iamVjdCBpZiB0aGVyZSBhcmUgY2hpbGRyZW5cclxuICAgICAgICAvLyBUaGlzIGlzIHJlcXVpcmVkIGFzIHdlIG1vZGlmeSB0aGUgb2JqZWN0IHRvIHJlbW92ZSBhbnkgbm9uLW1hdGNoZXNcclxuICAgICAgICB2YXIgbWF0Y2ggPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGF0YSk7XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGVhY2ggY2hpbGQgb2YgdGhlIG9wdGlvblxyXG4gICAgICAgIGZvciAodmFyIGMgPSBkYXRhLmNoaWxkcmVuLmxlbmd0aCAtIDE7IGMgPj0gMDsgYy0tKSB7XHJcbiAgICAgICAgICB2YXIgY2hpbGQgPSBkYXRhLmNoaWxkcmVuW2NdO1xyXG5cclxuICAgICAgICAgIHZhciBtYXRjaGVzID0gbWF0Y2hlcihwYXJhbXMsIGNoaWxkKTtcclxuXHJcbiAgICAgICAgICAvLyBJZiB0aGVyZSB3YXNuJ3QgYSBtYXRjaCwgcmVtb3ZlIHRoZSBvYmplY3QgaW4gdGhlIGFycmF5XHJcbiAgICAgICAgICBpZiAobWF0Y2hlcyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIG1hdGNoLmNoaWxkcmVuLnNwbGljZShjLCAxKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIElmIGFueSBjaGlsZHJlbiBtYXRjaGVkLCByZXR1cm4gdGhlIG5ldyBvYmplY3RcclxuICAgICAgICBpZiAobWF0Y2guY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgcmV0dXJuIG1hdGNoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSWYgdGhlcmUgd2VyZSBubyBtYXRjaGluZyBjaGlsZHJlbiwgY2hlY2sganVzdCB0aGUgcGxhaW4gb2JqZWN0XHJcbiAgICAgICAgcmV0dXJuIG1hdGNoZXIocGFyYW1zLCBtYXRjaCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBvcmlnaW5hbCA9IHN0cmlwRGlhY3JpdGljcyhkYXRhLnRleHQpLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgIHZhciB0ZXJtID0gc3RyaXBEaWFjcml0aWNzKHBhcmFtcy50ZXJtKS50b1VwcGVyQ2FzZSgpO1xyXG5cclxuICAgICAgLy8gQ2hlY2sgaWYgdGhlIHRleHQgY29udGFpbnMgdGhlIHRlcm1cclxuICAgICAgaWYgKG9yaWdpbmFsLmluZGV4T2YodGVybSkgPiAtMSkge1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBJZiBpdCBkb2Vzbid0IGNvbnRhaW4gdGhlIHRlcm0sIGRvbid0IHJldHVybiBhbnl0aGluZ1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmRlZmF1bHRzID0ge1xyXG4gICAgICBhbWRCYXNlOiAnLi8nLFxyXG4gICAgICBhbWRMYW5ndWFnZUJhc2U6ICcuL2kxOG4vJyxcclxuICAgICAgY2xvc2VPblNlbGVjdDogdHJ1ZSxcclxuICAgICAgZGVidWc6IGZhbHNlLFxyXG4gICAgICBkcm9wZG93bkF1dG9XaWR0aDogZmFsc2UsXHJcbiAgICAgIGVzY2FwZU1hcmt1cDogVXRpbHMuZXNjYXBlTWFya3VwLFxyXG4gICAgICBsYW5ndWFnZTogRW5nbGlzaFRyYW5zbGF0aW9uLFxyXG4gICAgICBtYXRjaGVyOiBtYXRjaGVyLFxyXG4gICAgICBtaW5pbXVtSW5wdXRMZW5ndGg6IDAsXHJcbiAgICAgIG1heGltdW1JbnB1dExlbmd0aDogMCxcclxuICAgICAgbWF4aW11bVNlbGVjdGlvbkxlbmd0aDogMCxcclxuICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IDAsXHJcbiAgICAgIHNlbGVjdE9uQ2xvc2U6IGZhbHNlLFxyXG4gICAgICBzb3J0ZXI6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgIH0sXHJcbiAgICAgIHRlbXBsYXRlUmVzdWx0OiBmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdC50ZXh0O1xyXG4gICAgICB9LFxyXG4gICAgICB0ZW1wbGF0ZVNlbGVjdGlvbjogZnVuY3Rpb24gKHNlbGVjdGlvbikge1xyXG4gICAgICAgIHJldHVybiBzZWxlY3Rpb24udGV4dDtcclxuICAgICAgfSxcclxuICAgICAgdGhlbWU6ICdkZWZhdWx0JyxcclxuICAgICAgd2lkdGg6ICdyZXNvbHZlJ1xyXG4gICAgfTtcclxuICB9O1xyXG5cclxuICBEZWZhdWx0cy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuICAgIHZhciBjYW1lbEtleSA9ICQuY2FtZWxDYXNlKGtleSk7XHJcblxyXG4gICAgdmFyIGRhdGEgPSB7fTtcclxuICAgIGRhdGFbY2FtZWxLZXldID0gdmFsdWU7XHJcblxyXG4gICAgdmFyIGNvbnZlcnRlZERhdGEgPSBVdGlscy5fY29udmVydERhdGEoZGF0YSk7XHJcblxyXG4gICAgJC5leHRlbmQodGhpcy5kZWZhdWx0cywgY29udmVydGVkRGF0YSk7XHJcbiAgfTtcclxuXHJcbiAgdmFyIGRlZmF1bHRzID0gbmV3IERlZmF1bHRzKCk7XHJcblxyXG4gIHJldHVybiBkZWZhdWx0cztcclxufSk7XHJcblxyXG5TMi5kZWZpbmUoJ3NlbGVjdDIvb3B0aW9ucycsW1xyXG4gICdyZXF1aXJlJyxcclxuICAnanF1ZXJ5JyxcclxuICAnLi9kZWZhdWx0cycsXHJcbiAgJy4vdXRpbHMnXHJcbl0sIGZ1bmN0aW9uIChyZXF1aXJlLCAkLCBEZWZhdWx0cywgVXRpbHMpIHtcclxuICBmdW5jdGlvbiBPcHRpb25zIChvcHRpb25zLCAkZWxlbWVudCkge1xyXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcclxuXHJcbiAgICBpZiAoJGVsZW1lbnQgIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLmZyb21FbGVtZW50KCRlbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9wdGlvbnMgPSBEZWZhdWx0cy5hcHBseSh0aGlzLm9wdGlvbnMpO1xyXG5cclxuICAgIGlmICgkZWxlbWVudCAmJiAkZWxlbWVudC5pcygnaW5wdXQnKSkge1xyXG4gICAgICB2YXIgSW5wdXRDb21wYXQgPSByZXF1aXJlKHRoaXMuZ2V0KCdhbWRCYXNlJykgKyAnY29tcGF0L2lucHV0RGF0YScpO1xyXG5cclxuICAgICAgdGhpcy5vcHRpb25zLmRhdGFBZGFwdGVyID0gVXRpbHMuRGVjb3JhdGUoXHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmRhdGFBZGFwdGVyLFxyXG4gICAgICAgIElucHV0Q29tcGF0XHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBPcHRpb25zLnByb3RvdHlwZS5mcm9tRWxlbWVudCA9IGZ1bmN0aW9uICgkZSkge1xyXG4gICAgdmFyIGV4Y2x1ZGVkRGF0YSA9IFsnc2VsZWN0MiddO1xyXG5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMubXVsdGlwbGUgPT0gbnVsbCkge1xyXG4gICAgICB0aGlzLm9wdGlvbnMubXVsdGlwbGUgPSAkZS5wcm9wKCdtdWx0aXBsZScpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMuZGlzYWJsZWQgPT0gbnVsbCkge1xyXG4gICAgICB0aGlzLm9wdGlvbnMuZGlzYWJsZWQgPSAkZS5wcm9wKCdkaXNhYmxlZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMubGFuZ3VhZ2UgPT0gbnVsbCkge1xyXG4gICAgICBpZiAoJGUucHJvcCgnbGFuZycpKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmxhbmd1YWdlID0gJGUucHJvcCgnbGFuZycpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoJGUuY2xvc2VzdCgnW2xhbmddJykucHJvcCgnbGFuZycpKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmxhbmd1YWdlID0gJGUuY2xvc2VzdCgnW2xhbmddJykucHJvcCgnbGFuZycpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5kaXIgPT0gbnVsbCkge1xyXG4gICAgICBpZiAoJGUucHJvcCgnZGlyJykpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuZGlyID0gJGUucHJvcCgnZGlyJyk7XHJcbiAgICAgIH0gZWxzZSBpZiAoJGUuY2xvc2VzdCgnW2Rpcl0nKS5wcm9wKCdkaXInKSkge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5kaXIgPSAkZS5jbG9zZXN0KCdbZGlyXScpLnByb3AoJ2RpcicpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5kaXIgPSAnbHRyJztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICRlLnByb3AoJ2Rpc2FibGVkJywgdGhpcy5vcHRpb25zLmRpc2FibGVkKTtcclxuICAgICRlLnByb3AoJ211bHRpcGxlJywgdGhpcy5vcHRpb25zLm11bHRpcGxlKTtcclxuXHJcbiAgICBpZiAoJGUuZGF0YSgnc2VsZWN0MlRhZ3MnKSkge1xyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmRlYnVnICYmIHdpbmRvdy5jb25zb2xlICYmIGNvbnNvbGUud2Fybikge1xyXG4gICAgICAgIGNvbnNvbGUud2FybihcclxuICAgICAgICAgICdTZWxlY3QyOiBUaGUgYGRhdGEtc2VsZWN0Mi10YWdzYCBhdHRyaWJ1dGUgaGFzIGJlZW4gY2hhbmdlZCB0byAnICtcclxuICAgICAgICAgICd1c2UgdGhlIGBkYXRhLWRhdGFgIGFuZCBgZGF0YS10YWdzPVwidHJ1ZVwiYCBhdHRyaWJ1dGVzIGFuZCB3aWxsIGJlICcgK1xyXG4gICAgICAgICAgJ3JlbW92ZWQgaW4gZnV0dXJlIHZlcnNpb25zIG9mIFNlbGVjdDIuJ1xyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRlLmRhdGEoJ2RhdGEnLCAkZS5kYXRhKCdzZWxlY3QyVGFncycpKTtcclxuICAgICAgJGUuZGF0YSgndGFncycsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkZS5kYXRhKCdhamF4VXJsJykpIHtcclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1ZyAmJiB3aW5kb3cuY29uc29sZSAmJiBjb25zb2xlLndhcm4pIHtcclxuICAgICAgICBjb25zb2xlLndhcm4oXHJcbiAgICAgICAgICAnU2VsZWN0MjogVGhlIGBkYXRhLWFqYXgtdXJsYCBhdHRyaWJ1dGUgaGFzIGJlZW4gY2hhbmdlZCB0byAnICtcclxuICAgICAgICAgICdgZGF0YS1hamF4LS11cmxgIGFuZCBzdXBwb3J0IGZvciB0aGUgb2xkIGF0dHJpYnV0ZSB3aWxsIGJlIHJlbW92ZWQnICtcclxuICAgICAgICAgICcgaW4gZnV0dXJlIHZlcnNpb25zIG9mIFNlbGVjdDIuJ1xyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRlLmF0dHIoJ2FqYXgtLXVybCcsICRlLmRhdGEoJ2FqYXhVcmwnKSk7XHJcbiAgICAgICRlLmRhdGEoJ2FqYXgtLXVybCcsICRlLmRhdGEoJ2FqYXhVcmwnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGRhdGFzZXQgPSB7fTtcclxuXHJcbiAgICAvLyBQcmVmZXIgdGhlIGVsZW1lbnQncyBgZGF0YXNldGAgYXR0cmlidXRlIGlmIGl0IGV4aXN0c1xyXG4gICAgLy8galF1ZXJ5IDEueCBkb2VzIG5vdCBjb3JyZWN0bHkgaGFuZGxlIGRhdGEgYXR0cmlidXRlcyB3aXRoIG11bHRpcGxlIGRhc2hlc1xyXG4gICAgaWYgKCQuZm4uanF1ZXJ5ICYmICQuZm4uanF1ZXJ5LnN1YnN0cigwLCAyKSA9PSAnMS4nICYmICRlWzBdLmRhdGFzZXQpIHtcclxuICAgICAgZGF0YXNldCA9ICQuZXh0ZW5kKHRydWUsIHt9LCAkZVswXS5kYXRhc2V0LCAkZS5kYXRhKCkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZGF0YXNldCA9ICRlLmRhdGEoKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZGF0YSA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkYXRhc2V0KTtcclxuXHJcbiAgICBkYXRhID0gVXRpbHMuX2NvbnZlcnREYXRhKGRhdGEpO1xyXG5cclxuICAgIGZvciAodmFyIGtleSBpbiBkYXRhKSB7XHJcbiAgICAgIGlmICgkLmluQXJyYXkoa2V5LCBleGNsdWRlZERhdGEpID4gLTEpIHtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCQuaXNQbGFpbk9iamVjdCh0aGlzLm9wdGlvbnNba2V5XSkpIHtcclxuICAgICAgICAkLmV4dGVuZCh0aGlzLm9wdGlvbnNba2V5XSwgZGF0YVtrZXldKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnNba2V5XSA9IGRhdGFba2V5XTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH07XHJcblxyXG4gIE9wdGlvbnMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgIHJldHVybiB0aGlzLm9wdGlvbnNba2V5XTtcclxuICB9O1xyXG5cclxuICBPcHRpb25zLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcclxuICAgIHRoaXMub3B0aW9uc1trZXldID0gdmFsO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBPcHRpb25zO1xyXG59KTtcclxuXHJcblMyLmRlZmluZSgnc2VsZWN0Mi9jb3JlJyxbXHJcbiAgJ2pxdWVyeScsXHJcbiAgJy4vb3B0aW9ucycsXHJcbiAgJy4vdXRpbHMnLFxyXG4gICcuL2tleXMnXHJcbl0sIGZ1bmN0aW9uICgkLCBPcHRpb25zLCBVdGlscywgS0VZUykge1xyXG4gIHZhciBTZWxlY3QyID0gZnVuY3Rpb24gKCRlbGVtZW50LCBvcHRpb25zKSB7XHJcbiAgICBpZiAoJGVsZW1lbnQuZGF0YSgnc2VsZWN0MicpICE9IG51bGwpIHtcclxuICAgICAgJGVsZW1lbnQuZGF0YSgnc2VsZWN0MicpLmRlc3Ryb3koKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiRlbGVtZW50ID0gJGVsZW1lbnQ7XHJcblxyXG4gICAgdGhpcy5pZCA9IHRoaXMuX2dlbmVyYXRlSWQoJGVsZW1lbnQpO1xyXG5cclxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cclxuICAgIHRoaXMub3B0aW9ucyA9IG5ldyBPcHRpb25zKG9wdGlvbnMsICRlbGVtZW50KTtcclxuXHJcbiAgICBTZWxlY3QyLl9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMpO1xyXG5cclxuICAgIC8vIFNldCB1cCB0aGUgdGFiaW5kZXhcclxuXHJcbiAgICB2YXIgdGFiaW5kZXggPSAkZWxlbWVudC5hdHRyKCd0YWJpbmRleCcpIHx8IDA7XHJcbiAgICAkZWxlbWVudC5kYXRhKCdvbGQtdGFiaW5kZXgnLCB0YWJpbmRleCk7XHJcbiAgICAkZWxlbWVudC5hdHRyKCd0YWJpbmRleCcsICctMScpO1xyXG5cclxuICAgIC8vIFNldCB1cCBjb250YWluZXJzIGFuZCBhZGFwdGVyc1xyXG5cclxuICAgIHZhciBEYXRhQWRhcHRlciA9IHRoaXMub3B0aW9ucy5nZXQoJ2RhdGFBZGFwdGVyJyk7XHJcbiAgICB0aGlzLmRhdGFBZGFwdGVyID0gbmV3IERhdGFBZGFwdGVyKCRlbGVtZW50LCB0aGlzLm9wdGlvbnMpO1xyXG5cclxuICAgIHZhciAkY29udGFpbmVyID0gdGhpcy5yZW5kZXIoKTtcclxuXHJcbiAgICB0aGlzLl9wbGFjZUNvbnRhaW5lcigkY29udGFpbmVyKTtcclxuXHJcbiAgICB2YXIgU2VsZWN0aW9uQWRhcHRlciA9IHRoaXMub3B0aW9ucy5nZXQoJ3NlbGVjdGlvbkFkYXB0ZXInKTtcclxuICAgIHRoaXMuc2VsZWN0aW9uID0gbmV3IFNlbGVjdGlvbkFkYXB0ZXIoJGVsZW1lbnQsIHRoaXMub3B0aW9ucyk7XHJcbiAgICB0aGlzLiRzZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvbi5yZW5kZXIoKTtcclxuXHJcbiAgICB0aGlzLnNlbGVjdGlvbi5wb3NpdGlvbih0aGlzLiRzZWxlY3Rpb24sICRjb250YWluZXIpO1xyXG5cclxuICAgIHZhciBEcm9wZG93bkFkYXB0ZXIgPSB0aGlzLm9wdGlvbnMuZ2V0KCdkcm9wZG93bkFkYXB0ZXInKTtcclxuICAgIHRoaXMuZHJvcGRvd24gPSBuZXcgRHJvcGRvd25BZGFwdGVyKCRlbGVtZW50LCB0aGlzLm9wdGlvbnMpO1xyXG4gICAgdGhpcy4kZHJvcGRvd24gPSB0aGlzLmRyb3Bkb3duLnJlbmRlcigpO1xyXG5cclxuICAgIHRoaXMuZHJvcGRvd24ucG9zaXRpb24odGhpcy4kZHJvcGRvd24sICRjb250YWluZXIpO1xyXG5cclxuICAgIHZhciBSZXN1bHRzQWRhcHRlciA9IHRoaXMub3B0aW9ucy5nZXQoJ3Jlc3VsdHNBZGFwdGVyJyk7XHJcbiAgICB0aGlzLnJlc3VsdHMgPSBuZXcgUmVzdWx0c0FkYXB0ZXIoJGVsZW1lbnQsIHRoaXMub3B0aW9ucywgdGhpcy5kYXRhQWRhcHRlcik7XHJcbiAgICB0aGlzLiRyZXN1bHRzID0gdGhpcy5yZXN1bHRzLnJlbmRlcigpO1xyXG5cclxuICAgIHRoaXMucmVzdWx0cy5wb3NpdGlvbih0aGlzLiRyZXN1bHRzLCB0aGlzLiRkcm9wZG93bik7XHJcblxyXG4gICAgLy8gQmluZCBldmVudHNcclxuXHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgLy8gQmluZCB0aGUgY29udGFpbmVyIHRvIGFsbCBvZiB0aGUgYWRhcHRlcnNcclxuICAgIHRoaXMuX2JpbmRBZGFwdGVycygpO1xyXG5cclxuICAgIC8vIFJlZ2lzdGVyIGFueSBET00gZXZlbnQgaGFuZGxlcnNcclxuICAgIHRoaXMuX3JlZ2lzdGVyRG9tRXZlbnRzKCk7XHJcblxyXG4gICAgLy8gUmVnaXN0ZXIgYW55IGludGVybmFsIGV2ZW50IGhhbmRsZXJzXHJcbiAgICB0aGlzLl9yZWdpc3RlckRhdGFFdmVudHMoKTtcclxuICAgIHRoaXMuX3JlZ2lzdGVyU2VsZWN0aW9uRXZlbnRzKCk7XHJcbiAgICB0aGlzLl9yZWdpc3RlckRyb3Bkb3duRXZlbnRzKCk7XHJcbiAgICB0aGlzLl9yZWdpc3RlclJlc3VsdHNFdmVudHMoKTtcclxuICAgIHRoaXMuX3JlZ2lzdGVyRXZlbnRzKCk7XHJcblxyXG4gICAgLy8gU2V0IHRoZSBpbml0aWFsIHN0YXRlXHJcbiAgICB0aGlzLmRhdGFBZGFwdGVyLmN1cnJlbnQoZnVuY3Rpb24gKGluaXRpYWxEYXRhKSB7XHJcbiAgICAgIHNlbGYudHJpZ2dlcignc2VsZWN0aW9uOnVwZGF0ZScsIHtcclxuICAgICAgICBkYXRhOiBpbml0aWFsRGF0YVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEhpZGUgdGhlIG9yaWdpbmFsIHNlbGVjdFxyXG4gICAgJGVsZW1lbnQuYWRkQ2xhc3MoJ3NlbGVjdDItaGlkZGVuLWFjY2Vzc2libGUnKTtcclxuICAgICRlbGVtZW50LmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuXHJcbiAgICAvLyBTeW5jaHJvbml6ZSBhbnkgbW9uaXRvcmVkIGF0dHJpYnV0ZXNcclxuICAgIHRoaXMuX3N5bmNBdHRyaWJ1dGVzKCk7XHJcblxyXG4gICAgJGVsZW1lbnQuZGF0YSgnc2VsZWN0MicsIHRoaXMpO1xyXG4gIH07XHJcblxyXG4gIFV0aWxzLkV4dGVuZChTZWxlY3QyLCBVdGlscy5PYnNlcnZhYmxlKTtcclxuXHJcbiAgU2VsZWN0Mi5wcm90b3R5cGUuX2dlbmVyYXRlSWQgPSBmdW5jdGlvbiAoJGVsZW1lbnQpIHtcclxuICAgIHZhciBpZCA9ICcnO1xyXG5cclxuICAgIGlmICgkZWxlbWVudC5hdHRyKCdpZCcpICE9IG51bGwpIHtcclxuICAgICAgaWQgPSAkZWxlbWVudC5hdHRyKCdpZCcpO1xyXG4gICAgfSBlbHNlIGlmICgkZWxlbWVudC5hdHRyKCduYW1lJykgIT0gbnVsbCkge1xyXG4gICAgICBpZCA9ICRlbGVtZW50LmF0dHIoJ25hbWUnKSArICctJyArIFV0aWxzLmdlbmVyYXRlQ2hhcnMoMik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZCA9IFV0aWxzLmdlbmVyYXRlQ2hhcnMoNCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWQgPSBpZC5yZXBsYWNlKC8oOnxcXC58XFxbfFxcXXwsKS9nLCAnJyk7XHJcbiAgICBpZCA9ICdzZWxlY3QyLScgKyBpZDtcclxuXHJcbiAgICByZXR1cm4gaWQ7XHJcbiAgfTtcclxuXHJcbiAgU2VsZWN0Mi5wcm90b3R5cGUuX3BsYWNlQ29udGFpbmVyID0gZnVuY3Rpb24gKCRjb250YWluZXIpIHtcclxuICAgICRjb250YWluZXIuaW5zZXJ0QWZ0ZXIodGhpcy4kZWxlbWVudCk7XHJcblxyXG4gICAgdmFyIHdpZHRoID0gdGhpcy5fcmVzb2x2ZVdpZHRoKHRoaXMuJGVsZW1lbnQsIHRoaXMub3B0aW9ucy5nZXQoJ3dpZHRoJykpO1xyXG5cclxuICAgIGlmICh3aWR0aCAhPSBudWxsKSB7XHJcbiAgICAgICRjb250YWluZXIuY3NzKCd3aWR0aCcsIHdpZHRoKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBTZWxlY3QyLnByb3RvdHlwZS5fcmVzb2x2ZVdpZHRoID0gZnVuY3Rpb24gKCRlbGVtZW50LCBtZXRob2QpIHtcclxuICAgIHZhciBXSURUSCA9IC9ed2lkdGg6KChbLStdPyhbMC05XSpcXC4pP1swLTldKykocHh8ZW18ZXh8JXxpbnxjbXxtbXxwdHxwYykpL2k7XHJcblxyXG4gICAgaWYgKG1ldGhvZCA9PSAncmVzb2x2ZScpIHtcclxuICAgICAgdmFyIHN0eWxlV2lkdGggPSB0aGlzLl9yZXNvbHZlV2lkdGgoJGVsZW1lbnQsICdzdHlsZScpO1xyXG5cclxuICAgICAgaWYgKHN0eWxlV2lkdGggIT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiBzdHlsZVdpZHRoO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5fcmVzb2x2ZVdpZHRoKCRlbGVtZW50LCAnZWxlbWVudCcpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChtZXRob2QgPT0gJ2VsZW1lbnQnKSB7XHJcbiAgICAgIHZhciBlbGVtZW50V2lkdGggPSAkZWxlbWVudC5vdXRlcldpZHRoKGZhbHNlKTtcclxuXHJcbiAgICAgIGlmIChlbGVtZW50V2lkdGggPD0gMCkge1xyXG4gICAgICAgIHJldHVybiAnYXV0byc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBlbGVtZW50V2lkdGggKyAncHgnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChtZXRob2QgPT0gJ3N0eWxlJykge1xyXG4gICAgICB2YXIgc3R5bGUgPSAkZWxlbWVudC5hdHRyKCdzdHlsZScpO1xyXG5cclxuICAgICAgaWYgKHR5cGVvZihzdHlsZSkgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBhdHRycyA9IHN0eWxlLnNwbGl0KCc7Jyk7XHJcblxyXG4gICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGF0dHJzLmxlbmd0aDsgaSA8IGw7IGkgPSBpICsgMSkge1xyXG4gICAgICAgIHZhciBhdHRyID0gYXR0cnNbaV0ucmVwbGFjZSgvXFxzL2csICcnKTtcclxuICAgICAgICB2YXIgbWF0Y2hlcyA9IGF0dHIubWF0Y2goV0lEVEgpO1xyXG5cclxuICAgICAgICBpZiAobWF0Y2hlcyAhPT0gbnVsbCAmJiBtYXRjaGVzLmxlbmd0aCA+PSAxKSB7XHJcbiAgICAgICAgICByZXR1cm4gbWF0Y2hlc1sxXTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBtZXRob2Q7XHJcbiAgfTtcclxuXHJcbiAgU2VsZWN0Mi5wcm90b3R5cGUuX2JpbmRBZGFwdGVycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZGF0YUFkYXB0ZXIuYmluZCh0aGlzLCB0aGlzLiRjb250YWluZXIpO1xyXG4gICAgdGhpcy5zZWxlY3Rpb24uYmluZCh0aGlzLCB0aGlzLiRjb250YWluZXIpO1xyXG5cclxuICAgIHRoaXMuZHJvcGRvd24uYmluZCh0aGlzLCB0aGlzLiRjb250YWluZXIpO1xyXG4gICAgdGhpcy5yZXN1bHRzLmJpbmQodGhpcywgdGhpcy4kY29udGFpbmVyKTtcclxuICB9O1xyXG5cclxuICBTZWxlY3QyLnByb3RvdHlwZS5fcmVnaXN0ZXJEb21FdmVudHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgdGhpcy4kZWxlbWVudC5vbignY2hhbmdlLnNlbGVjdDInLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHNlbGYuZGF0YUFkYXB0ZXIuY3VycmVudChmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgIHNlbGYudHJpZ2dlcignc2VsZWN0aW9uOnVwZGF0ZScsIHtcclxuICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLiRlbGVtZW50Lm9uKCdmb2N1cy5zZWxlY3QyJywgZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICBzZWxmLnRyaWdnZXIoJ2ZvY3VzJywgZXZ0KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuX3N5bmNBID0gVXRpbHMuYmluZCh0aGlzLl9zeW5jQXR0cmlidXRlcywgdGhpcyk7XHJcbiAgICB0aGlzLl9zeW5jUyA9IFV0aWxzLmJpbmQodGhpcy5fc3luY1N1YnRyZWUsIHRoaXMpO1xyXG5cclxuICAgIGlmICh0aGlzLiRlbGVtZW50WzBdLmF0dGFjaEV2ZW50KSB7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnRbMF0uYXR0YWNoRXZlbnQoJ29ucHJvcGVydHljaGFuZ2UnLCB0aGlzLl9zeW5jQSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIG9ic2VydmVyID0gd2luZG93Lk11dGF0aW9uT2JzZXJ2ZXIgfHxcclxuICAgICAgd2luZG93LldlYktpdE11dGF0aW9uT2JzZXJ2ZXIgfHxcclxuICAgICAgd2luZG93Lk1vek11dGF0aW9uT2JzZXJ2ZXJcclxuICAgIDtcclxuXHJcbiAgICBpZiAob2JzZXJ2ZXIgIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLl9vYnNlcnZlciA9IG5ldyBvYnNlcnZlcihmdW5jdGlvbiAobXV0YXRpb25zKSB7XHJcbiAgICAgICAgJC5lYWNoKG11dGF0aW9ucywgc2VsZi5fc3luY0EpO1xyXG4gICAgICAgICQuZWFjaChtdXRhdGlvbnMsIHNlbGYuX3N5bmNTKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMuX29ic2VydmVyLm9ic2VydmUodGhpcy4kZWxlbWVudFswXSwge1xyXG4gICAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXHJcbiAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxyXG4gICAgICAgIHN1YnRyZWU6IGZhbHNlXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLiRlbGVtZW50WzBdLmFkZEV2ZW50TGlzdGVuZXIpIHtcclxuICAgICAgdGhpcy4kZWxlbWVudFswXS5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICAgICdET01BdHRyTW9kaWZpZWQnLFxyXG4gICAgICAgIHNlbGYuX3N5bmNBLFxyXG4gICAgICAgIGZhbHNlXHJcbiAgICAgICk7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnRbMF0uYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgICAnRE9NTm9kZUluc2VydGVkJyxcclxuICAgICAgICBzZWxmLl9zeW5jUyxcclxuICAgICAgICBmYWxzZVxyXG4gICAgICApO1xyXG4gICAgICB0aGlzLiRlbGVtZW50WzBdLmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgICAgJ0RPTU5vZGVSZW1vdmVkJyxcclxuICAgICAgICBzZWxmLl9zeW5jUyxcclxuICAgICAgICBmYWxzZVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIFNlbGVjdDIucHJvdG90eXBlLl9yZWdpc3RlckRhdGFFdmVudHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgdGhpcy5kYXRhQWRhcHRlci5vbignKicsIGZ1bmN0aW9uIChuYW1lLCBwYXJhbXMpIHtcclxuICAgICAgc2VsZi50cmlnZ2VyKG5hbWUsIHBhcmFtcyk7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBTZWxlY3QyLnByb3RvdHlwZS5fcmVnaXN0ZXJTZWxlY3Rpb25FdmVudHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB2YXIgbm9uUmVsYXlFdmVudHMgPSBbJ3RvZ2dsZScsICdmb2N1cyddO1xyXG5cclxuICAgIHRoaXMuc2VsZWN0aW9uLm9uKCd0b2dnbGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHNlbGYudG9nZ2xlRHJvcGRvd24oKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuc2VsZWN0aW9uLm9uKCdmb2N1cycsIGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgc2VsZi5mb2N1cyhwYXJhbXMpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5zZWxlY3Rpb24ub24oJyonLCBmdW5jdGlvbiAobmFtZSwgcGFyYW1zKSB7XHJcbiAgICAgIGlmICgkLmluQXJyYXkobmFtZSwgbm9uUmVsYXlFdmVudHMpICE9PSAtMSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgc2VsZi50cmlnZ2VyKG5hbWUsIHBhcmFtcyk7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBTZWxlY3QyLnByb3RvdHlwZS5fcmVnaXN0ZXJEcm9wZG93bkV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICB0aGlzLmRyb3Bkb3duLm9uKCcqJywgZnVuY3Rpb24gKG5hbWUsIHBhcmFtcykge1xyXG4gICAgICBzZWxmLnRyaWdnZXIobmFtZSwgcGFyYW1zKTtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIFNlbGVjdDIucHJvdG90eXBlLl9yZWdpc3RlclJlc3VsdHNFdmVudHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgdGhpcy5yZXN1bHRzLm9uKCcqJywgZnVuY3Rpb24gKG5hbWUsIHBhcmFtcykge1xyXG4gICAgICBzZWxmLnRyaWdnZXIobmFtZSwgcGFyYW1zKTtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIFNlbGVjdDIucHJvdG90eXBlLl9yZWdpc3RlckV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICB0aGlzLm9uKCdvcGVuJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICBzZWxmLiRjb250YWluZXIuYWRkQ2xhc3MoJ3NlbGVjdDItY29udGFpbmVyLS1vcGVuJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLm9uKCdjbG9zZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgc2VsZi4kY29udGFpbmVyLnJlbW92ZUNsYXNzKCdzZWxlY3QyLWNvbnRhaW5lci0tb3BlbicpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5vbignZW5hYmxlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICBzZWxmLiRjb250YWluZXIucmVtb3ZlQ2xhc3MoJ3NlbGVjdDItY29udGFpbmVyLS1kaXNhYmxlZCcpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5vbignZGlzYWJsZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgc2VsZi4kY29udGFpbmVyLmFkZENsYXNzKCdzZWxlY3QyLWNvbnRhaW5lci0tZGlzYWJsZWQnKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMub24oJ2JsdXInLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHNlbGYuJGNvbnRhaW5lci5yZW1vdmVDbGFzcygnc2VsZWN0Mi1jb250YWluZXItLWZvY3VzJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLm9uKCdxdWVyeScsIGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgaWYgKCFzZWxmLmlzT3BlbigpKSB7XHJcbiAgICAgICAgc2VsZi50cmlnZ2VyKCdvcGVuJywge30pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmRhdGFBZGFwdGVyLnF1ZXJ5KHBhcmFtcywgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICBzZWxmLnRyaWdnZXIoJ3Jlc3VsdHM6YWxsJywge1xyXG4gICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgIHF1ZXJ5OiBwYXJhbXNcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLm9uKCdxdWVyeTphcHBlbmQnLCBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgIHRoaXMuZGF0YUFkYXB0ZXIucXVlcnkocGFyYW1zLCBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgIHNlbGYudHJpZ2dlcigncmVzdWx0czphcHBlbmQnLCB7XHJcbiAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgcXVlcnk6IHBhcmFtc1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMub24oJ2tleXByZXNzJywgZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICB2YXIga2V5ID0gZXZ0LndoaWNoO1xyXG5cclxuICAgICAgaWYgKHNlbGYuaXNPcGVuKCkpIHtcclxuICAgICAgICBpZiAoa2V5ID09PSBLRVlTLkVTQyB8fCBrZXkgPT09IEtFWVMuVEFCIHx8XHJcbiAgICAgICAgICAgIChrZXkgPT09IEtFWVMuVVAgJiYgZXZ0LmFsdEtleSkpIHtcclxuICAgICAgICAgIHNlbGYuY2xvc2UoKTtcclxuXHJcbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gS0VZUy5FTlRFUikge1xyXG4gICAgICAgICAgc2VsZi50cmlnZ2VyKCdyZXN1bHRzOnNlbGVjdCcsIHt9KTtcclxuXHJcbiAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9IGVsc2UgaWYgKChrZXkgPT09IEtFWVMuU1BBQ0UgJiYgZXZ0LmN0cmxLZXkpKSB7XHJcbiAgICAgICAgICBzZWxmLnRyaWdnZXIoJ3Jlc3VsdHM6dG9nZ2xlJywge30pO1xyXG5cclxuICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSBLRVlTLlVQKSB7XHJcbiAgICAgICAgICBzZWxmLnRyaWdnZXIoJ3Jlc3VsdHM6cHJldmlvdXMnLCB7fSk7XHJcblxyXG4gICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09IEtFWVMuRE9XTikge1xyXG4gICAgICAgICAgc2VsZi50cmlnZ2VyKCdyZXN1bHRzOm5leHQnLCB7fSk7XHJcblxyXG4gICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChrZXkgPT09IEtFWVMuRU5URVIgfHwga2V5ID09PSBLRVlTLlNQQUNFIHx8XHJcbiAgICAgICAgICAgIChrZXkgPT09IEtFWVMuRE9XTiAmJiBldnQuYWx0S2V5KSkge1xyXG4gICAgICAgICAgc2VsZi5vcGVuKCk7XHJcblxyXG4gICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBTZWxlY3QyLnByb3RvdHlwZS5fc3luY0F0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLm9wdGlvbnMuc2V0KCdkaXNhYmxlZCcsIHRoaXMuJGVsZW1lbnQucHJvcCgnZGlzYWJsZWQnKSk7XHJcblxyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5nZXQoJ2Rpc2FibGVkJykpIHtcclxuICAgICAgaWYgKHRoaXMuaXNPcGVuKCkpIHtcclxuICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMudHJpZ2dlcignZGlzYWJsZScsIHt9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudHJpZ2dlcignZW5hYmxlJywge30pO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIFNlbGVjdDIucHJvdG90eXBlLl9zeW5jU3VidHJlZSA9IGZ1bmN0aW9uIChldnQsIG11dGF0aW9ucykge1xyXG4gICAgdmFyIGNoYW5nZWQgPSBmYWxzZTtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAvLyBJZ25vcmUgYW55IG11dGF0aW9uIGV2ZW50cyByYWlzZWQgZm9yIGVsZW1lbnRzIHRoYXQgYXJlbid0IG9wdGlvbnMgb3JcclxuICAgIC8vIG9wdGdyb3Vwcy4gVGhpcyBoYW5kbGVzIHRoZSBjYXNlIHdoZW4gdGhlIHNlbGVjdCBlbGVtZW50IGlzIGRlc3Ryb3llZFxyXG4gICAgaWYgKFxyXG4gICAgICBldnQgJiYgZXZ0LnRhcmdldCAmJiAoXHJcbiAgICAgICAgZXZ0LnRhcmdldC5ub2RlTmFtZSAhPT0gJ09QVElPTicgJiYgZXZ0LnRhcmdldC5ub2RlTmFtZSAhPT0gJ09QVEdST1VQJ1xyXG4gICAgICApXHJcbiAgICApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghbXV0YXRpb25zKSB7XHJcbiAgICAgIC8vIElmIG11dGF0aW9uIGV2ZW50cyBhcmVuJ3Qgc3VwcG9ydGVkLCB0aGVuIHdlIGNhbiBvbmx5IGFzc3VtZSB0aGF0IHRoZVxyXG4gICAgICAvLyBjaGFuZ2UgYWZmZWN0ZWQgdGhlIHNlbGVjdGlvbnNcclxuICAgICAgY2hhbmdlZCA9IHRydWU7XHJcbiAgICB9IGVsc2UgaWYgKG11dGF0aW9ucy5hZGRlZE5vZGVzICYmIG11dGF0aW9ucy5hZGRlZE5vZGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgZm9yICh2YXIgbiA9IDA7IG4gPCBtdXRhdGlvbnMuYWRkZWROb2Rlcy5sZW5ndGg7IG4rKykge1xyXG4gICAgICAgIHZhciBub2RlID0gbXV0YXRpb25zLmFkZGVkTm9kZXNbbl07XHJcblxyXG4gICAgICAgIGlmIChub2RlLnNlbGVjdGVkKSB7XHJcbiAgICAgICAgICBjaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAobXV0YXRpb25zLnJlbW92ZWROb2RlcyAmJiBtdXRhdGlvbnMucmVtb3ZlZE5vZGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgY2hhbmdlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gT25seSByZS1wdWxsIHRoZSBkYXRhIGlmIHdlIHRoaW5rIHRoZXJlIGlzIGEgY2hhbmdlXHJcbiAgICBpZiAoY2hhbmdlZCkge1xyXG4gICAgICB0aGlzLmRhdGFBZGFwdGVyLmN1cnJlbnQoZnVuY3Rpb24gKGN1cnJlbnREYXRhKSB7XHJcbiAgICAgICAgc2VsZi50cmlnZ2VyKCdzZWxlY3Rpb246dXBkYXRlJywge1xyXG4gICAgICAgICAgZGF0YTogY3VycmVudERhdGFcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogT3ZlcnJpZGUgdGhlIHRyaWdnZXIgbWV0aG9kIHRvIGF1dG9tYXRpY2FsbHkgdHJpZ2dlciBwcmUtZXZlbnRzIHdoZW5cclxuICAgKiB0aGVyZSBhcmUgZXZlbnRzIHRoYXQgY2FuIGJlIHByZXZlbnRlZC5cclxuICAgKi9cclxuICBTZWxlY3QyLnByb3RvdHlwZS50cmlnZ2VyID0gZnVuY3Rpb24gKG5hbWUsIGFyZ3MpIHtcclxuICAgIHZhciBhY3R1YWxUcmlnZ2VyID0gU2VsZWN0Mi5fX3N1cGVyX18udHJpZ2dlcjtcclxuICAgIHZhciBwcmVUcmlnZ2VyTWFwID0ge1xyXG4gICAgICAnb3Blbic6ICdvcGVuaW5nJyxcclxuICAgICAgJ2Nsb3NlJzogJ2Nsb3NpbmcnLFxyXG4gICAgICAnc2VsZWN0JzogJ3NlbGVjdGluZycsXHJcbiAgICAgICd1bnNlbGVjdCc6ICd1bnNlbGVjdGluZydcclxuICAgIH07XHJcblxyXG4gICAgaWYgKGFyZ3MgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBhcmdzID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG5hbWUgaW4gcHJlVHJpZ2dlck1hcCkge1xyXG4gICAgICB2YXIgcHJlVHJpZ2dlck5hbWUgPSBwcmVUcmlnZ2VyTWFwW25hbWVdO1xyXG4gICAgICB2YXIgcHJlVHJpZ2dlckFyZ3MgPSB7XHJcbiAgICAgICAgcHJldmVudGVkOiBmYWxzZSxcclxuICAgICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICAgIGFyZ3M6IGFyZ3NcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGFjdHVhbFRyaWdnZXIuY2FsbCh0aGlzLCBwcmVUcmlnZ2VyTmFtZSwgcHJlVHJpZ2dlckFyZ3MpO1xyXG5cclxuICAgICAgaWYgKHByZVRyaWdnZXJBcmdzLnByZXZlbnRlZCkge1xyXG4gICAgICAgIGFyZ3MucHJldmVudGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWN0dWFsVHJpZ2dlci5jYWxsKHRoaXMsIG5hbWUsIGFyZ3MpO1xyXG4gIH07XHJcblxyXG4gIFNlbGVjdDIucHJvdG90eXBlLnRvZ2dsZURyb3Bkb3duID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5nZXQoJ2Rpc2FibGVkJykpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmlzT3BlbigpKSB7XHJcbiAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMub3BlbigpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIFNlbGVjdDIucHJvdG90eXBlLm9wZW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5pc09wZW4oKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy50cmlnZ2VyKCdxdWVyeScsIHt9KTtcclxuICB9O1xyXG5cclxuICBTZWxlY3QyLnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICghdGhpcy5pc09wZW4oKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy50cmlnZ2VyKCdjbG9zZScsIHt9KTtcclxuICB9O1xyXG5cclxuICBTZWxlY3QyLnByb3RvdHlwZS5pc09wZW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gdGhpcy4kY29udGFpbmVyLmhhc0NsYXNzKCdzZWxlY3QyLWNvbnRhaW5lci0tb3BlbicpO1xyXG4gIH07XHJcblxyXG4gIFNlbGVjdDIucHJvdG90eXBlLmhhc0ZvY3VzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuJGNvbnRhaW5lci5oYXNDbGFzcygnc2VsZWN0Mi1jb250YWluZXItLWZvY3VzJyk7XHJcbiAgfTtcclxuXHJcbiAgU2VsZWN0Mi5wcm90b3R5cGUuZm9jdXMgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgLy8gTm8gbmVlZCB0byByZS10cmlnZ2VyIGZvY3VzIGV2ZW50cyBpZiB3ZSBhcmUgYWxyZWFkeSBmb2N1c2VkXHJcbiAgICBpZiAodGhpcy5oYXNGb2N1cygpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLiRjb250YWluZXIuYWRkQ2xhc3MoJ3NlbGVjdDItY29udGFpbmVyLS1mb2N1cycpO1xyXG4gICAgdGhpcy50cmlnZ2VyKCdmb2N1cycsIHt9KTtcclxuICB9O1xyXG5cclxuICBTZWxlY3QyLnByb3RvdHlwZS5lbmFibGUgPSBmdW5jdGlvbiAoYXJncykge1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5nZXQoJ2RlYnVnJykgJiYgd2luZG93LmNvbnNvbGUgJiYgY29uc29sZS53YXJuKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybihcclxuICAgICAgICAnU2VsZWN0MjogVGhlIGBzZWxlY3QyKFwiZW5hYmxlXCIpYCBtZXRob2QgaGFzIGJlZW4gZGVwcmVjYXRlZCBhbmQgd2lsbCcgK1xyXG4gICAgICAgICcgYmUgcmVtb3ZlZCBpbiBsYXRlciBTZWxlY3QyIHZlcnNpb25zLiBVc2UgJGVsZW1lbnQucHJvcChcImRpc2FibGVkXCIpJyArXHJcbiAgICAgICAgJyBpbnN0ZWFkLidcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoYXJncyA9PSBudWxsIHx8IGFyZ3MubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIGFyZ3MgPSBbdHJ1ZV07XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGRpc2FibGVkID0gIWFyZ3NbMF07XHJcblxyXG4gICAgdGhpcy4kZWxlbWVudC5wcm9wKCdkaXNhYmxlZCcsIGRpc2FibGVkKTtcclxuICB9O1xyXG5cclxuICBTZWxlY3QyLnByb3RvdHlwZS5kYXRhID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5nZXQoJ2RlYnVnJykgJiZcclxuICAgICAgICBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiB3aW5kb3cuY29uc29sZSAmJiBjb25zb2xlLndhcm4pIHtcclxuICAgICAgY29uc29sZS53YXJuKFxyXG4gICAgICAgICdTZWxlY3QyOiBEYXRhIGNhbiBubyBsb25nZXIgYmUgc2V0IHVzaW5nIGBzZWxlY3QyKFwiZGF0YVwiKWAuIFlvdSAnICtcclxuICAgICAgICAnc2hvdWxkIGNvbnNpZGVyIHNldHRpbmcgdGhlIHZhbHVlIGluc3RlYWQgdXNpbmcgYCRlbGVtZW50LnZhbCgpYC4nXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGRhdGEgPSBbXTtcclxuXHJcbiAgICB0aGlzLmRhdGFBZGFwdGVyLmN1cnJlbnQoZnVuY3Rpb24gKGN1cnJlbnREYXRhKSB7XHJcbiAgICAgIGRhdGEgPSBjdXJyZW50RGF0YTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH07XHJcblxyXG4gIFNlbGVjdDIucHJvdG90eXBlLnZhbCA9IGZ1bmN0aW9uIChhcmdzKSB7XHJcbiAgICBpZiAodGhpcy5vcHRpb25zLmdldCgnZGVidWcnKSAmJiB3aW5kb3cuY29uc29sZSAmJiBjb25zb2xlLndhcm4pIHtcclxuICAgICAgY29uc29sZS53YXJuKFxyXG4gICAgICAgICdTZWxlY3QyOiBUaGUgYHNlbGVjdDIoXCJ2YWxcIilgIG1ldGhvZCBoYXMgYmVlbiBkZXByZWNhdGVkIGFuZCB3aWxsIGJlJyArXHJcbiAgICAgICAgJyByZW1vdmVkIGluIGxhdGVyIFNlbGVjdDIgdmVyc2lvbnMuIFVzZSAkZWxlbWVudC52YWwoKSBpbnN0ZWFkLidcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoYXJncyA9PSBudWxsIHx8IGFyZ3MubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLiRlbGVtZW50LnZhbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBuZXdWYWwgPSBhcmdzWzBdO1xyXG5cclxuICAgIGlmICgkLmlzQXJyYXkobmV3VmFsKSkge1xyXG4gICAgICBuZXdWYWwgPSAkLm1hcChuZXdWYWwsIGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICByZXR1cm4gb2JqLnRvU3RyaW5nKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuJGVsZW1lbnQudmFsKG5ld1ZhbCkudHJpZ2dlcignY2hhbmdlJyk7XHJcbiAgfTtcclxuXHJcbiAgU2VsZWN0Mi5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuJGNvbnRhaW5lci5yZW1vdmUoKTtcclxuXHJcbiAgICBpZiAodGhpcy4kZWxlbWVudFswXS5kZXRhY2hFdmVudCkge1xyXG4gICAgICB0aGlzLiRlbGVtZW50WzBdLmRldGFjaEV2ZW50KCdvbnByb3BlcnR5Y2hhbmdlJywgdGhpcy5fc3luY0EpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl9vYnNlcnZlciAhPSBudWxsKSB7XHJcbiAgICAgIHRoaXMuX29ic2VydmVyLmRpc2Nvbm5lY3QoKTtcclxuICAgICAgdGhpcy5fb2JzZXJ2ZXIgPSBudWxsO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLiRlbGVtZW50WzBdLnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcclxuICAgICAgdGhpcy4kZWxlbWVudFswXVxyXG4gICAgICAgIC5yZW1vdmVFdmVudExpc3RlbmVyKCdET01BdHRyTW9kaWZpZWQnLCB0aGlzLl9zeW5jQSwgZmFsc2UpO1xyXG4gICAgICB0aGlzLiRlbGVtZW50WzBdXHJcbiAgICAgICAgLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0RPTU5vZGVJbnNlcnRlZCcsIHRoaXMuX3N5bmNTLCBmYWxzZSk7XHJcbiAgICAgIHRoaXMuJGVsZW1lbnRbMF1cclxuICAgICAgICAucmVtb3ZlRXZlbnRMaXN0ZW5lcignRE9NTm9kZVJlbW92ZWQnLCB0aGlzLl9zeW5jUywgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX3N5bmNBID0gbnVsbDtcclxuICAgIHRoaXMuX3N5bmNTID0gbnVsbDtcclxuXHJcbiAgICB0aGlzLiRlbGVtZW50Lm9mZignLnNlbGVjdDInKTtcclxuICAgIHRoaXMuJGVsZW1lbnQuYXR0cigndGFiaW5kZXgnLCB0aGlzLiRlbGVtZW50LmRhdGEoJ29sZC10YWJpbmRleCcpKTtcclxuXHJcbiAgICB0aGlzLiRlbGVtZW50LnJlbW92ZUNsYXNzKCdzZWxlY3QyLWhpZGRlbi1hY2Nlc3NpYmxlJyk7XHJcbiAgICB0aGlzLiRlbGVtZW50LmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcbiAgICB0aGlzLiRlbGVtZW50LnJlbW92ZURhdGEoJ3NlbGVjdDInKTtcclxuXHJcbiAgICB0aGlzLmRhdGFBZGFwdGVyLmRlc3Ryb3koKTtcclxuICAgIHRoaXMuc2VsZWN0aW9uLmRlc3Ryb3koKTtcclxuICAgIHRoaXMuZHJvcGRvd24uZGVzdHJveSgpO1xyXG4gICAgdGhpcy5yZXN1bHRzLmRlc3Ryb3koKTtcclxuXHJcbiAgICB0aGlzLmRhdGFBZGFwdGVyID0gbnVsbDtcclxuICAgIHRoaXMuc2VsZWN0aW9uID0gbnVsbDtcclxuICAgIHRoaXMuZHJvcGRvd24gPSBudWxsO1xyXG4gICAgdGhpcy5yZXN1bHRzID0gbnVsbDtcclxuICB9O1xyXG5cclxuICBTZWxlY3QyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgJGNvbnRhaW5lciA9ICQoXHJcbiAgICAgICc8c3BhbiBjbGFzcz1cInNlbGVjdDIgc2VsZWN0Mi1jb250YWluZXJcIj4nICtcclxuICAgICAgICAnPHNwYW4gY2xhc3M9XCJzZWxlY3Rpb25cIj48L3NwYW4+JyArXHJcbiAgICAgICAgJzxzcGFuIGNsYXNzPVwiZHJvcGRvd24td3JhcHBlclwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4nICtcclxuICAgICAgJzwvc3Bhbj4nXHJcbiAgICApO1xyXG5cclxuICAgICRjb250YWluZXIuYXR0cignZGlyJywgdGhpcy5vcHRpb25zLmdldCgnZGlyJykpO1xyXG5cclxuICAgIHRoaXMuJGNvbnRhaW5lciA9ICRjb250YWluZXI7XHJcblxyXG4gICAgdGhpcy4kY29udGFpbmVyLmFkZENsYXNzKCdzZWxlY3QyLWNvbnRhaW5lci0tJyArIHRoaXMub3B0aW9ucy5nZXQoJ3RoZW1lJykpO1xyXG5cclxuICAgICRjb250YWluZXIuZGF0YSgnZWxlbWVudCcsIHRoaXMuJGVsZW1lbnQpO1xyXG5cclxuICAgIHJldHVybiAkY29udGFpbmVyO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiBTZWxlY3QyO1xyXG59KTtcclxuXHJcblMyLmRlZmluZSgnanF1ZXJ5LW1vdXNld2hlZWwnLFtcclxuICAnanF1ZXJ5J1xyXG5dLCBmdW5jdGlvbiAoJCkge1xyXG4gIC8vIFVzZWQgdG8gc2hpbSBqUXVlcnkubW91c2V3aGVlbCBmb3Igbm9uLWZ1bGwgYnVpbGRzLlxyXG4gIHJldHVybiAkO1xyXG59KTtcclxuXHJcblMyLmRlZmluZSgnanF1ZXJ5LnNlbGVjdDInLFtcclxuICAnanF1ZXJ5JyxcclxuICAnanF1ZXJ5LW1vdXNld2hlZWwnLFxyXG5cclxuICAnLi9zZWxlY3QyL2NvcmUnLFxyXG4gICcuL3NlbGVjdDIvZGVmYXVsdHMnXHJcbl0sIGZ1bmN0aW9uICgkLCBfLCBTZWxlY3QyLCBEZWZhdWx0cykge1xyXG4gIGlmICgkLmZuLnNlbGVjdDIgPT0gbnVsbCkge1xyXG4gICAgLy8gQWxsIG1ldGhvZHMgdGhhdCBzaG91bGQgcmV0dXJuIHRoZSBlbGVtZW50XHJcbiAgICB2YXIgdGhpc01ldGhvZHMgPSBbJ29wZW4nLCAnY2xvc2UnLCAnZGVzdHJveSddO1xyXG5cclxuICAgICQuZm4uc2VsZWN0MiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICB2YXIgaW5zdGFuY2VPcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgIHZhciBpbnN0YW5jZSA9IG5ldyBTZWxlY3QyKCQodGhpcyksIGluc3RhbmNlT3B0aW9ucyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHZhciByZXQ7XHJcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xyXG5cclxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdmFyIGluc3RhbmNlID0gJCh0aGlzKS5kYXRhKCdzZWxlY3QyJyk7XHJcblxyXG4gICAgICAgICAgaWYgKGluc3RhbmNlID09IG51bGwgJiYgd2luZG93LmNvbnNvbGUgJiYgY29uc29sZS5lcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFxyXG4gICAgICAgICAgICAgICdUaGUgc2VsZWN0MihcXCcnICsgb3B0aW9ucyArICdcXCcpIG1ldGhvZCB3YXMgY2FsbGVkIG9uIGFuICcgK1xyXG4gICAgICAgICAgICAgICdlbGVtZW50IHRoYXQgaXMgbm90IHVzaW5nIFNlbGVjdDIuJ1xyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJldCA9IGluc3RhbmNlW29wdGlvbnNdLmFwcGx5KGluc3RhbmNlLCBhcmdzKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgd2Ugc2hvdWxkIGJlIHJldHVybmluZyBgdGhpc2BcclxuICAgICAgICBpZiAoJC5pbkFycmF5KG9wdGlvbnMsIHRoaXNNZXRob2RzKSA+IC0xKSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGFyZ3VtZW50cyBmb3IgU2VsZWN0MjogJyArIG9wdGlvbnMpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgaWYgKCQuZm4uc2VsZWN0Mi5kZWZhdWx0cyA9PSBudWxsKSB7XHJcbiAgICAkLmZuLnNlbGVjdDIuZGVmYXVsdHMgPSBEZWZhdWx0cztcclxuICB9XHJcblxyXG4gIHJldHVybiBTZWxlY3QyO1xyXG59KTtcclxuXHJcbiAgLy8gUmV0dXJuIHRoZSBBTUQgbG9hZGVyIGNvbmZpZ3VyYXRpb24gc28gaXQgY2FuIGJlIHVzZWQgb3V0c2lkZSBvZiB0aGlzIGZpbGVcclxuICByZXR1cm4ge1xyXG4gICAgZGVmaW5lOiBTMi5kZWZpbmUsXHJcbiAgICByZXF1aXJlOiBTMi5yZXF1aXJlXHJcbiAgfTtcclxufSgpKTtcclxuXHJcbiAgLy8gQXV0b2xvYWQgdGhlIGpRdWVyeSBiaW5kaW5nc1xyXG4gIC8vIFdlIGtub3cgdGhhdCBhbGwgb2YgdGhlIG1vZHVsZXMgZXhpc3QgYWJvdmUgdGhpcywgc28gd2UncmUgc2FmZVxyXG4gIHZhciBzZWxlY3QyID0gUzIucmVxdWlyZSgnanF1ZXJ5LnNlbGVjdDInKTtcclxuXHJcbiAgLy8gSG9sZCB0aGUgQU1EIG1vZHVsZSByZWZlcmVuY2VzIG9uIHRoZSBqUXVlcnkgZnVuY3Rpb24gdGhhdCB3YXMganVzdCBsb2FkZWRcclxuICAvLyBUaGlzIGFsbG93cyBTZWxlY3QyIHRvIHVzZSB0aGUgaW50ZXJuYWwgbG9hZGVyIG91dHNpZGUgb2YgdGhpcyBmaWxlLCBzdWNoXHJcbiAgLy8gYXMgaW4gdGhlIGxhbmd1YWdlIGZpbGVzLlxyXG4gIGpRdWVyeS5mbi5zZWxlY3QyLmFtZCA9IFMyO1xyXG5cclxuICAvLyBSZXR1cm4gdGhlIFNlbGVjdDIgaW5zdGFuY2UgZm9yIGFueW9uZSB3aG8gaXMgaW1wb3J0aW5nIGl0LlxyXG4gIHJldHVybiBzZWxlY3QyO1xyXG59KSk7XHJcbiIsIi8qXHJcbiAgICAgXyBfICAgICAgXyAgICAgICBfXHJcbiBfX198IChfKSBfX198IHwgX18gIChfKV9fX1xyXG4vIF9ffCB8IHwvIF9ffCB8LyAvICB8IC8gX198XHJcblxcX18gXFwgfCB8IChfX3wgICA8IF8gfCBcXF9fIFxcXHJcbnxfX18vX3xffFxcX19ffF98XFxfKF8pLyB8X19fL1xyXG4gICAgICAgICAgICAgICAgICAgfF9fL1xyXG5cclxuIFZlcnNpb246IDEuNi4wXHJcbiAgQXV0aG9yOiBLZW4gV2hlZWxlclxyXG4gV2Vic2l0ZTogaHR0cDovL2tlbndoZWVsZXIuZ2l0aHViLmlvXHJcbiAgICBEb2NzOiBodHRwOi8va2Vud2hlZWxlci5naXRodWIuaW8vc2xpY2tcclxuICAgIFJlcG86IGh0dHA6Ly9naXRodWIuY29tL2tlbndoZWVsZXIvc2xpY2tcclxuICBJc3N1ZXM6IGh0dHA6Ly9naXRodWIuY29tL2tlbndoZWVsZXIvc2xpY2svaXNzdWVzXHJcblxyXG4gKi9cclxuLyogZ2xvYmFsIHdpbmRvdywgZG9jdW1lbnQsIGRlZmluZSwgalF1ZXJ5LCBzZXRJbnRlcnZhbCwgY2xlYXJJbnRlcnZhbCAqL1xyXG4oZnVuY3Rpb24oZmFjdG9yeSkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgZmFjdG9yeShqUXVlcnkpO1xyXG5cclxufShmdW5jdGlvbigkKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICB2YXIgU2xpY2sgPSB3aW5kb3cuU2xpY2sgfHwge307XHJcblxyXG4gICAgU2xpY2sgPSAoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBpbnN0YW5jZVVpZCA9IDA7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIFNsaWNrKGVsZW1lbnQsIHNldHRpbmdzKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgXyA9IHRoaXMsIGRhdGFTZXR0aW5ncztcclxuXHJcbiAgICAgICAgICAgIF8uZGVmYXVsdHMgPSB7XHJcbiAgICAgICAgICAgICAgICBhY2Nlc3NpYmlsaXR5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYWRhcHRpdmVIZWlnaHQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgYXBwZW5kQXJyb3dzOiAkKGVsZW1lbnQpLFxyXG4gICAgICAgICAgICAgICAgYXBwZW5kRG90czogJChlbGVtZW50KSxcclxuICAgICAgICAgICAgICAgIGFycm93czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGFzTmF2Rm9yOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgcHJldkFycm93OiAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1yb2xlPVwibm9uZVwiIGNsYXNzPVwic2xpY2stcHJldlwiIGFyaWEtbGFiZWw9XCJQcmV2aW91c1wiIHRhYmluZGV4PVwiMFwiIHJvbGU9XCJidXR0b25cIj5QcmV2aW91czwvYnV0dG9uPicsXHJcbiAgICAgICAgICAgICAgICBuZXh0QXJyb3c6ICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXJvbGU9XCJub25lXCIgY2xhc3M9XCJzbGljay1uZXh0XCIgYXJpYS1sYWJlbD1cIk5leHRcIiB0YWJpbmRleD1cIjBcIiByb2xlPVwiYnV0dG9uXCI+TmV4dDwvYnV0dG9uPicsXHJcbiAgICAgICAgICAgICAgICBhdXRvcGxheTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBhdXRvcGxheVNwZWVkOiAzMDAwLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyTW9kZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBjZW50ZXJQYWRkaW5nOiAnNTBweCcsXHJcbiAgICAgICAgICAgICAgICBjc3NFYXNlOiAnZWFzZScsXHJcbiAgICAgICAgICAgICAgICBjdXN0b21QYWdpbmc6IGZ1bmN0aW9uKHNsaWRlciwgaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkKCc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXJvbGU9XCJub25lXCIgcm9sZT1cImJ1dHRvblwiIHRhYmluZGV4PVwiMFwiIC8+JykudGV4dChpICsgMSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBkb3RzQ2xhc3M6ICdzbGljay1kb3RzJyxcclxuICAgICAgICAgICAgICAgIGRyYWdnYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGVhc2luZzogJ2xpbmVhcicsXHJcbiAgICAgICAgICAgICAgICBlZGdlRnJpY3Rpb246IDAuMzUsXHJcbiAgICAgICAgICAgICAgICBmYWRlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGZvY3VzT25TZWxlY3Q6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgaW5maW5pdGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBpbml0aWFsU2xpZGU6IDAsXHJcbiAgICAgICAgICAgICAgICBsYXp5TG9hZDogJ29uZGVtYW5kJyxcclxuICAgICAgICAgICAgICAgIG1vYmlsZUZpcnN0OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHBhdXNlT25Ib3ZlcjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHBhdXNlT25Gb2N1czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHBhdXNlT25Eb3RzSG92ZXI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uZFRvOiAnd2luZG93JyxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNpdmU6IG51bGwsXHJcbiAgICAgICAgICAgICAgICByb3dzOiAxLFxyXG4gICAgICAgICAgICAgICAgcnRsOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHNsaWRlOiAnJyxcclxuICAgICAgICAgICAgICAgIHNsaWRlc1BlclJvdzogMSxcclxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcclxuICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxyXG4gICAgICAgICAgICAgICAgc3BlZWQ6IDUwMCxcclxuICAgICAgICAgICAgICAgIHN3aXBlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc3dpcGVUb1NsaWRlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHRvdWNoTW92ZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHRvdWNoVGhyZXNob2xkOiA1LFxyXG4gICAgICAgICAgICAgICAgdXNlQ1NTOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdXNlVHJhbnNmb3JtOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbFN3aXBpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgd2FpdEZvckFuaW1hdGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDEwMDBcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIF8uaW5pdGlhbHMgPSB7XHJcbiAgICAgICAgICAgICAgICBhbmltYXRpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZHJhZ2dpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgYXV0b1BsYXlUaW1lcjogbnVsbCxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnREaXJlY3Rpb246IDAsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50TGVmdDogbnVsbCxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTbGlkZTogMCxcclxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogMSxcclxuICAgICAgICAgICAgICAgICRkb3RzOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgbGlzdFdpZHRoOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgbGlzdEhlaWdodDogbnVsbCxcclxuICAgICAgICAgICAgICAgIGxvYWRJbmRleDogMCxcclxuICAgICAgICAgICAgICAgICRuZXh0QXJyb3c6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAkcHJldkFycm93OiBudWxsLFxyXG4gICAgICAgICAgICAgICAgc2xpZGVDb3VudDogbnVsbCxcclxuICAgICAgICAgICAgICAgIHNsaWRlV2lkdGg6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAkc2xpZGVUcmFjazogbnVsbCxcclxuICAgICAgICAgICAgICAgICRzbGlkZXM6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBzbGlkaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHNsaWRlT2Zmc2V0OiAwLFxyXG4gICAgICAgICAgICAgICAgc3dpcGVMZWZ0OiBudWxsLFxyXG4gICAgICAgICAgICAgICAgJGxpc3Q6IG51bGwsXHJcbiAgICAgICAgICAgICAgICB0b3VjaE9iamVjdDoge30sXHJcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1zRW5hYmxlZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB1bnNsaWNrZWQ6IGZhbHNlXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkLmV4dGVuZChfLCBfLmluaXRpYWxzKTtcclxuXHJcbiAgICAgICAgICAgIF8uYWN0aXZlQnJlYWtwb2ludCA9IG51bGw7XHJcbiAgICAgICAgICAgIF8uYW5pbVR5cGUgPSBudWxsO1xyXG4gICAgICAgICAgICBfLmFuaW1Qcm9wID0gbnVsbDtcclxuICAgICAgICAgICAgXy5icmVha3BvaW50cyA9IFtdO1xyXG4gICAgICAgICAgICBfLmJyZWFrcG9pbnRTZXR0aW5ncyA9IFtdO1xyXG4gICAgICAgICAgICBfLmNzc1RyYW5zaXRpb25zID0gZmFsc2U7XHJcbiAgICAgICAgICAgIF8uZm9jdXNzZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgXy5pbnRlcnJ1cHRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBfLmhpZGRlbiA9ICdoaWRkZW4nO1xyXG4gICAgICAgICAgICBfLnBhdXNlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIF8ucG9zaXRpb25Qcm9wID0gbnVsbDtcclxuICAgICAgICAgICAgXy5yZXNwb25kVG8gPSBudWxsO1xyXG4gICAgICAgICAgICBfLnJvd0NvdW50ID0gMTtcclxuICAgICAgICAgICAgXy5zaG91bGRDbGljayA9IHRydWU7XHJcbiAgICAgICAgICAgIF8uJHNsaWRlciA9ICQoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIF8uJHNsaWRlc0NhY2hlID0gbnVsbDtcclxuICAgICAgICAgICAgXy50cmFuc2Zvcm1UeXBlID0gbnVsbDtcclxuICAgICAgICAgICAgXy50cmFuc2l0aW9uVHlwZSA9IG51bGw7XHJcbiAgICAgICAgICAgIF8udmlzaWJpbGl0eUNoYW5nZSA9ICd2aXNpYmlsaXR5Y2hhbmdlJztcclxuICAgICAgICAgICAgXy53aW5kb3dXaWR0aCA9IDA7XHJcbiAgICAgICAgICAgIF8ud2luZG93VGltZXIgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgZGF0YVNldHRpbmdzID0gJChlbGVtZW50KS5kYXRhKCdzbGljaycpIHx8IHt9O1xyXG5cclxuICAgICAgICAgICAgXy5vcHRpb25zID0gJC5leHRlbmQoe30sIF8uZGVmYXVsdHMsIHNldHRpbmdzLCBkYXRhU2V0dGluZ3MpO1xyXG5cclxuICAgICAgICAgICAgXy5jdXJyZW50U2xpZGUgPSBfLm9wdGlvbnMuaW5pdGlhbFNsaWRlO1xyXG5cclxuICAgICAgICAgICAgXy5vcmlnaW5hbFNldHRpbmdzID0gXy5vcHRpb25zO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudC5tb3pIaWRkZW4gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICBfLmhpZGRlbiA9ICdtb3pIaWRkZW4nO1xyXG4gICAgICAgICAgICAgICAgXy52aXNpYmlsaXR5Q2hhbmdlID0gJ21venZpc2liaWxpdHljaGFuZ2UnO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkb2N1bWVudC53ZWJraXRIaWRkZW4gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICBfLmhpZGRlbiA9ICd3ZWJraXRIaWRkZW4nO1xyXG4gICAgICAgICAgICAgICAgXy52aXNpYmlsaXR5Q2hhbmdlID0gJ3dlYmtpdHZpc2liaWxpdHljaGFuZ2UnO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBfLmF1dG9QbGF5ID0gJC5wcm94eShfLmF1dG9QbGF5LCBfKTtcclxuICAgICAgICAgICAgXy5hdXRvUGxheUNsZWFyID0gJC5wcm94eShfLmF1dG9QbGF5Q2xlYXIsIF8pO1xyXG4gICAgICAgICAgICBfLmF1dG9QbGF5SXRlcmF0b3IgPSAkLnByb3h5KF8uYXV0b1BsYXlJdGVyYXRvciwgXyk7XHJcbiAgICAgICAgICAgIF8uY2hhbmdlU2xpZGUgPSAkLnByb3h5KF8uY2hhbmdlU2xpZGUsIF8pO1xyXG4gICAgICAgICAgICBfLmNsaWNrSGFuZGxlciA9ICQucHJveHkoXy5jbGlja0hhbmRsZXIsIF8pO1xyXG4gICAgICAgICAgICBfLnNlbGVjdEhhbmRsZXIgPSAkLnByb3h5KF8uc2VsZWN0SGFuZGxlciwgXyk7XHJcbiAgICAgICAgICAgIF8uc2V0UG9zaXRpb24gPSAkLnByb3h5KF8uc2V0UG9zaXRpb24sIF8pO1xyXG4gICAgICAgICAgICBfLnN3aXBlSGFuZGxlciA9ICQucHJveHkoXy5zd2lwZUhhbmRsZXIsIF8pO1xyXG4gICAgICAgICAgICBfLmRyYWdIYW5kbGVyID0gJC5wcm94eShfLmRyYWdIYW5kbGVyLCBfKTtcclxuICAgICAgICAgICAgXy5rZXlIYW5kbGVyID0gJC5wcm94eShfLmtleUhhbmRsZXIsIF8pO1xyXG5cclxuICAgICAgICAgICAgXy5pbnN0YW5jZVVpZCA9IGluc3RhbmNlVWlkKys7XHJcblxyXG4gICAgICAgICAgICAvLyBBIHNpbXBsZSB3YXkgdG8gY2hlY2sgZm9yIEhUTUwgc3RyaW5nc1xyXG4gICAgICAgICAgICAvLyBTdHJpY3QgSFRNTCByZWNvZ25pdGlvbiAobXVzdCBzdGFydCB3aXRoIDwpXHJcbiAgICAgICAgICAgIC8vIEV4dHJhY3RlZCBmcm9tIGpRdWVyeSB2MS4xMSBzb3VyY2VcclxuICAgICAgICAgICAgXy5odG1sRXhwciA9IC9eKD86XFxzKig8W1xcd1xcV10rPilbXj5dKikkLztcclxuXHJcblxyXG4gICAgICAgICAgICBfLnJlZ2lzdGVyQnJlYWtwb2ludHMoKTtcclxuICAgICAgICAgICAgXy5pbml0KHRydWUpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBTbGljaztcclxuXHJcbiAgICB9KCkpO1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5hY3RpdmF0ZUFEQSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgXy4kc2xpZGVUcmFjay5maW5kKCcuc2xpY2stYWN0aXZlJykuYXR0cih7XHJcbiAgICAgICAgICAgICdhcmlhLWhpZGRlbic6ICdmYWxzZSdcclxuICAgICAgICB9KS5maW5kKCdhLCBpbnB1dCwgYnV0dG9uLCBzZWxlY3QnKS5hdHRyKHtcclxuICAgICAgICAgICAgJ3RhYmluZGV4JzogJzAnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuYWRkU2xpZGUgPSBTbGljay5wcm90b3R5cGUuc2xpY2tBZGQgPSBmdW5jdGlvbihtYXJrdXAsIGluZGV4LCBhZGRCZWZvcmUpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mKGluZGV4KSA9PT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICAgICAgICAgIGFkZEJlZm9yZSA9IGluZGV4O1xyXG4gICAgICAgICAgICBpbmRleCA9IG51bGw7XHJcbiAgICAgICAgfSBlbHNlIGlmIChpbmRleCA8IDAgfHwgKGluZGV4ID49IF8uc2xpZGVDb3VudCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy51bmxvYWQoKTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZihpbmRleCkgPT09ICdudW1iZXInKSB7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMCAmJiBfLiRzbGlkZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAkKG1hcmt1cCkuYXBwZW5kVG8oXy4kc2xpZGVUcmFjayk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYWRkQmVmb3JlKSB7XHJcbiAgICAgICAgICAgICAgICAkKG1hcmt1cCkuaW5zZXJ0QmVmb3JlKF8uJHNsaWRlcy5lcShpbmRleCkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJChtYXJrdXApLmluc2VydEFmdGVyKF8uJHNsaWRlcy5lcShpbmRleCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGFkZEJlZm9yZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgJChtYXJrdXApLnByZXBlbmRUbyhfLiRzbGlkZVRyYWNrKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQobWFya3VwKS5hcHBlbmRUbyhfLiRzbGlkZVRyYWNrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy4kc2xpZGVzID0gXy4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpO1xyXG5cclxuICAgICAgICBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5zbGlkZSkuZGV0YWNoKCk7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlVHJhY2suYXBwZW5kKF8uJHNsaWRlcyk7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlcy5lYWNoKGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICQoZWxlbWVudCkuYXR0cignZGF0YS1zbGljay1pbmRleCcsIGluZGV4KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgXy4kc2xpZGVzQ2FjaGUgPSBfLiRzbGlkZXM7XHJcblxyXG4gICAgICAgIF8ucmVpbml0KCk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuYW5pbWF0ZUhlaWdodCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuICAgICAgICBpZiAoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyA9PT0gMSAmJiBfLm9wdGlvbnMuYWRhcHRpdmVIZWlnaHQgPT09IHRydWUgJiYgXy5vcHRpb25zLnZlcnRpY2FsID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0SGVpZ2h0ID0gXy4kc2xpZGVzLmVxKF8uY3VycmVudFNsaWRlKS5vdXRlckhlaWdodCh0cnVlKTtcclxuICAgICAgICAgICAgXy4kbGlzdC5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIGhlaWdodDogdGFyZ2V0SGVpZ2h0XHJcbiAgICAgICAgICAgIH0sIF8ub3B0aW9ucy5zcGVlZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuYW5pbWF0ZVNsaWRlID0gZnVuY3Rpb24odGFyZ2V0TGVmdCwgY2FsbGJhY2spIHtcclxuXHJcbiAgICAgICAgdmFyIGFuaW1Qcm9wcyA9IHt9LFxyXG4gICAgICAgICAgICBfID0gdGhpcztcclxuXHJcbiAgICAgICAgXy5hbmltYXRlSGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMucnRsID09PSB0cnVlICYmIF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdGFyZ2V0TGVmdCA9IC10YXJnZXRMZWZ0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoXy50cmFuc2Zvcm1zRW5hYmxlZCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgbGVmdDogdGFyZ2V0TGVmdFxyXG4gICAgICAgICAgICAgICAgfSwgXy5vcHRpb25zLnNwZWVkLCBfLm9wdGlvbnMuZWFzaW5nLCBjYWxsYmFjayk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRvcDogdGFyZ2V0TGVmdFxyXG4gICAgICAgICAgICAgICAgfSwgXy5vcHRpb25zLnNwZWVkLCBfLm9wdGlvbnMuZWFzaW5nLCBjYWxsYmFjayk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChfLmNzc1RyYW5zaXRpb25zID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5ydGwgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBfLmN1cnJlbnRMZWZ0ID0gLShfLmN1cnJlbnRMZWZ0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICQoe1xyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1TdGFydDogXy5jdXJyZW50TGVmdFxyXG4gICAgICAgICAgICAgICAgfSkuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbVN0YXJ0OiB0YXJnZXRMZWZ0XHJcbiAgICAgICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IF8ub3B0aW9ucy5zcGVlZCxcclxuICAgICAgICAgICAgICAgICAgICBlYXNpbmc6IF8ub3B0aW9ucy5lYXNpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RlcDogZnVuY3Rpb24obm93KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdyA9IE1hdGguY2VpbChub3cpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbVByb3BzW18uYW5pbVR5cGVdID0gJ3RyYW5zbGF0ZSgnICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3cgKyAncHgsIDBweCknO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jc3MoYW5pbVByb3BzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1Qcm9wc1tfLmFuaW1UeXBlXSA9ICd0cmFuc2xhdGUoMHB4LCcgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdyArICdweCknO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jc3MoYW5pbVByb3BzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICBfLmFwcGx5VHJhbnNpdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0TGVmdCA9IE1hdGguY2VpbCh0YXJnZXRMZWZ0KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1Qcm9wc1tfLmFuaW1UeXBlXSA9ICd0cmFuc2xhdGUzZCgnICsgdGFyZ2V0TGVmdCArICdweCwgMHB4LCAwcHgpJztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbVByb3BzW18uYW5pbVR5cGVdID0gJ3RyYW5zbGF0ZTNkKDBweCwnICsgdGFyZ2V0TGVmdCArICdweCwgMHB4KSc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNzcyhhbmltUHJvcHMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfLmRpc2FibGVUcmFuc2l0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgXy5vcHRpb25zLnNwZWVkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmdldE5hdlRhcmdldCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgIGFzTmF2Rm9yID0gXy5vcHRpb25zLmFzTmF2Rm9yO1xyXG5cclxuICAgICAgICBpZiAoIGFzTmF2Rm9yICYmIGFzTmF2Rm9yICE9PSBudWxsICkge1xyXG4gICAgICAgICAgICBhc05hdkZvciA9ICQoYXNOYXZGb3IpLm5vdChfLiRzbGlkZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFzTmF2Rm9yO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmFzTmF2Rm9yID0gZnVuY3Rpb24oaW5kZXgpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLFxyXG4gICAgICAgICAgICBhc05hdkZvciA9IF8uZ2V0TmF2VGFyZ2V0KCk7XHJcblxyXG4gICAgICAgIGlmICggYXNOYXZGb3IgIT09IG51bGwgJiYgdHlwZW9mIGFzTmF2Rm9yID09PSAnb2JqZWN0JyApIHtcclxuICAgICAgICAgICAgYXNOYXZGb3IuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSAkKHRoaXMpLnNsaWNrKCdnZXRTbGljaycpO1xyXG4gICAgICAgICAgICAgICAgaWYoIXRhcmdldC51bnNsaWNrZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc2xpZGVIYW5kbGVyKGluZGV4LCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmFwcGx5VHJhbnNpdGlvbiA9IGZ1bmN0aW9uKHNsaWRlKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgdHJhbnNpdGlvbiA9IHt9O1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHRyYW5zaXRpb25bXy50cmFuc2l0aW9uVHlwZV0gPSBfLnRyYW5zZm9ybVR5cGUgKyAnICcgKyBfLm9wdGlvbnMuc3BlZWQgKyAnbXMgJyArIF8ub3B0aW9ucy5jc3NFYXNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRyYW5zaXRpb25bXy50cmFuc2l0aW9uVHlwZV0gPSAnb3BhY2l0eSAnICsgXy5vcHRpb25zLnNwZWVkICsgJ21zICcgKyBfLm9wdGlvbnMuY3NzRWFzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZmFkZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jc3ModHJhbnNpdGlvbik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgXy4kc2xpZGVzLmVxKHNsaWRlKS5jc3ModHJhbnNpdGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmF1dG9QbGF5ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgXy5hdXRvUGxheUNsZWFyKCk7XHJcblxyXG4gICAgICAgIGlmICggXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyApIHtcclxuICAgICAgICAgICAgXy5hdXRvUGxheVRpbWVyID0gc2V0SW50ZXJ2YWwoIF8uYXV0b1BsYXlJdGVyYXRvciwgXy5vcHRpb25zLmF1dG9wbGF5U3BlZWQgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuYXV0b1BsYXlDbGVhciA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmIChfLmF1dG9QbGF5VGltZXIpIHtcclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChfLmF1dG9QbGF5VGltZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5hdXRvUGxheUl0ZXJhdG9yID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgc2xpZGVUbyA9IF8uY3VycmVudFNsaWRlICsgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsO1xyXG5cclxuICAgICAgICBpZiAoICFfLnBhdXNlZCAmJiAhXy5pbnRlcnJ1cHRlZCAmJiAhXy5mb2N1c3NlZCApIHtcclxuXHJcbiAgICAgICAgICAgIGlmICggXy5vcHRpb25zLmluZmluaXRlID09PSBmYWxzZSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIF8uZGlyZWN0aW9uID09PSAxICYmICggXy5jdXJyZW50U2xpZGUgKyAxICkgPT09ICggXy5zbGlkZUNvdW50IC0gMSApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5kaXJlY3Rpb24gPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCBfLmRpcmVjdGlvbiA9PT0gMCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVUbyA9IF8uY3VycmVudFNsaWRlIC0gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIF8uY3VycmVudFNsaWRlIC0gMSA9PT0gMCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXy5kaXJlY3Rpb24gPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBfLnNsaWRlSGFuZGxlciggc2xpZGVUbyApO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuYnVpbGRBcnJvd3MgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmFycm93cyA9PT0gdHJ1ZSApIHtcclxuXHJcbiAgICAgICAgICAgIF8uJHByZXZBcnJvdyA9ICQoXy5vcHRpb25zLnByZXZBcnJvdykuYWRkQ2xhc3MoJ3NsaWNrLWFycm93Jyk7XHJcbiAgICAgICAgICAgIF8uJG5leHRBcnJvdyA9ICQoXy5vcHRpb25zLm5leHRBcnJvdykuYWRkQ2xhc3MoJ3NsaWNrLWFycm93Jyk7XHJcblxyXG4gICAgICAgICAgICBpZiggXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cucmVtb3ZlQ2xhc3MoJ3NsaWNrLWhpZGRlbicpLnJlbW92ZUF0dHIoJ2FyaWEtaGlkZGVuIHRhYmluZGV4Jyk7XHJcbiAgICAgICAgICAgICAgICBfLiRuZXh0QXJyb3cucmVtb3ZlQ2xhc3MoJ3NsaWNrLWhpZGRlbicpLnJlbW92ZUF0dHIoJ2FyaWEtaGlkZGVuIHRhYmluZGV4Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKF8uaHRtbEV4cHIudGVzdChfLm9wdGlvbnMucHJldkFycm93KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIF8uJHByZXZBcnJvdy5wcmVwZW5kVG8oXy5vcHRpb25zLmFwcGVuZEFycm93cyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKF8uaHRtbEV4cHIudGVzdChfLm9wdGlvbnMubmV4dEFycm93KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIF8uJG5leHRBcnJvdy5hcHBlbmRUbyhfLm9wdGlvbnMuYXBwZW5kQXJyb3dzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoXy5vcHRpb25zLmluZmluaXRlICE9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy4kcHJldkFycm93XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stZGlzYWJsZWQnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignYXJpYS1kaXNhYmxlZCcsICd0cnVlJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIF8uJHByZXZBcnJvdy5hZGQoIF8uJG5leHRBcnJvdyApXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2staGlkZGVuJylcclxuICAgICAgICAgICAgICAgICAgICAuYXR0cih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdhcmlhLWRpc2FibGVkJzogJ3RydWUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAndGFiaW5kZXgnOiAnLTEnXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5idWlsZERvdHMgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLFxyXG4gICAgICAgICAgICBpLCBkb3Q7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZG90cyA9PT0gdHJ1ZSAmJiBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcblxyXG4gICAgICAgICAgICBfLiRzbGlkZXIuYWRkQ2xhc3MoJ3NsaWNrLWRvdHRlZCcpO1xyXG5cclxuICAgICAgICAgICAgZG90ID0gJCgnPHVsIC8+JykuYWRkQ2xhc3MoXy5vcHRpb25zLmRvdHNDbGFzcyk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDw9IF8uZ2V0RG90Q291bnQoKTsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICBkb3QuYXBwZW5kKCQoJzxsaSAvPicpLmFwcGVuZChfLm9wdGlvbnMuY3VzdG9tUGFnaW5nLmNhbGwodGhpcywgXywgaSkpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgXy4kZG90cyA9IGRvdC5hcHBlbmRUbyhfLm9wdGlvbnMuYXBwZW5kRG90cyk7XHJcblxyXG4gICAgICAgICAgICBfLiRkb3RzLmZpbmQoJ2xpJykuZmlyc3QoKS5hZGRDbGFzcygnc2xpY2stYWN0aXZlJykuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmJ1aWxkT3V0ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgXy4kc2xpZGVzID1cclxuICAgICAgICAgICAgXy4kc2xpZGVyXHJcbiAgICAgICAgICAgICAgICAuY2hpbGRyZW4oIF8ub3B0aW9ucy5zbGlkZSArICc6bm90KC5zbGljay1jbG9uZWQpJylcclxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stc2xpZGUnKTtcclxuXHJcbiAgICAgICAgXy5zbGlkZUNvdW50ID0gXy4kc2xpZGVzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgXy4kc2xpZGVzLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgJChlbGVtZW50KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2RhdGEtc2xpY2staW5kZXgnLCBpbmRleClcclxuICAgICAgICAgICAgICAgIC5kYXRhKCdvcmlnaW5hbFN0eWxpbmcnLCAkKGVsZW1lbnQpLmF0dHIoJ3N0eWxlJykgfHwgJycpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBfLiRzbGlkZXIuYWRkQ2xhc3MoJ3NsaWNrLXNsaWRlcicpO1xyXG5cclxuICAgICAgICBfLiRzbGlkZVRyYWNrID0gKF8uc2xpZGVDb3VudCA9PT0gMCkgP1xyXG4gICAgICAgICAgICAkKCc8ZGl2IGNsYXNzPVwic2xpY2stdHJhY2tcIi8+JykuYXBwZW5kVG8oXy4kc2xpZGVyKSA6XHJcbiAgICAgICAgICAgIF8uJHNsaWRlcy53cmFwQWxsKCc8ZGl2IGNsYXNzPVwic2xpY2stdHJhY2tcIi8+JykucGFyZW50KCk7XHJcblxyXG4gICAgICAgIF8uJGxpc3QgPSBfLiRzbGlkZVRyYWNrLndyYXAoXHJcbiAgICAgICAgICAgICc8ZGl2IGFyaWEtbGl2ZT1cInBvbGl0ZVwiIGNsYXNzPVwic2xpY2stbGlzdFwiLz4nKS5wYXJlbnQoKTtcclxuICAgICAgICBfLiRzbGlkZVRyYWNrLmNzcygnb3BhY2l0eScsIDApO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUgfHwgXy5vcHRpb25zLnN3aXBlVG9TbGlkZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgPSAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCgnaW1nW2RhdGEtbGF6eV0nLCBfLiRzbGlkZXIpLm5vdCgnW3NyY10nKS5hZGRDbGFzcygnc2xpY2stbG9hZGluZycpO1xyXG5cclxuICAgICAgICBfLnNldHVwSW5maW5pdGUoKTtcclxuXHJcbiAgICAgICAgXy5idWlsZEFycm93cygpO1xyXG5cclxuICAgICAgICBfLmJ1aWxkRG90cygpO1xyXG5cclxuICAgICAgICBfLnVwZGF0ZURvdHMoKTtcclxuXHJcblxyXG4gICAgICAgIF8uc2V0U2xpZGVDbGFzc2VzKHR5cGVvZiBfLmN1cnJlbnRTbGlkZSA9PT0gJ251bWJlcicgPyBfLmN1cnJlbnRTbGlkZSA6IDApO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmRyYWdnYWJsZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBfLiRsaXN0LmFkZENsYXNzKCdkcmFnZ2FibGUnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuYnVpbGRSb3dzID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcywgYSwgYiwgYywgbmV3U2xpZGVzLCBudW1PZlNsaWRlcywgb3JpZ2luYWxTbGlkZXMsc2xpZGVzUGVyU2VjdGlvbjtcclxuXHJcbiAgICAgICAgbmV3U2xpZGVzID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG4gICAgICAgIG9yaWdpbmFsU2xpZGVzID0gXy4kc2xpZGVyLmNoaWxkcmVuKCk7XHJcblxyXG4gICAgICAgIGlmKF8ub3B0aW9ucy5yb3dzID4gMSkge1xyXG5cclxuICAgICAgICAgICAgc2xpZGVzUGVyU2VjdGlvbiA9IF8ub3B0aW9ucy5zbGlkZXNQZXJSb3cgKiBfLm9wdGlvbnMucm93cztcclxuICAgICAgICAgICAgbnVtT2ZTbGlkZXMgPSBNYXRoLmNlaWwoXHJcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFNsaWRlcy5sZW5ndGggLyBzbGlkZXNQZXJTZWN0aW9uXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBmb3IoYSA9IDA7IGEgPCBudW1PZlNsaWRlczsgYSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBzbGlkZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICAgICAgZm9yKGIgPSAwOyBiIDwgXy5vcHRpb25zLnJvd3M7IGIrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IoYyA9IDA7IGMgPCBfLm9wdGlvbnMuc2xpZGVzUGVyUm93OyBjKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IChhICogc2xpZGVzUGVyU2VjdGlvbiArICgoYiAqIF8ub3B0aW9ucy5zbGlkZXNQZXJSb3cpICsgYykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3JpZ2luYWxTbGlkZXMuZ2V0KHRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdy5hcHBlbmRDaGlsZChvcmlnaW5hbFNsaWRlcy5nZXQodGFyZ2V0KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGUuYXBwZW5kQ2hpbGQocm93KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG5ld1NsaWRlcy5hcHBlbmRDaGlsZChzbGlkZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIF8uJHNsaWRlci5lbXB0eSgpLmFwcGVuZChuZXdTbGlkZXMpO1xyXG4gICAgICAgICAgICBfLiRzbGlkZXIuY2hpbGRyZW4oKS5jaGlsZHJlbigpLmNoaWxkcmVuKClcclxuICAgICAgICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICd3aWR0aCc6KDEwMCAvIF8ub3B0aW9ucy5zbGlkZXNQZXJSb3cpICsgJyUnLFxyXG4gICAgICAgICAgICAgICAgICAgICdkaXNwbGF5JzogJ2lubGluZS1ibG9jaydcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuY2hlY2tSZXNwb25zaXZlID0gZnVuY3Rpb24oaW5pdGlhbCwgZm9yY2VVcGRhdGUpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLFxyXG4gICAgICAgICAgICBicmVha3BvaW50LCB0YXJnZXRCcmVha3BvaW50LCByZXNwb25kVG9XaWR0aCwgdHJpZ2dlckJyZWFrcG9pbnQgPSBmYWxzZTtcclxuICAgICAgICB2YXIgc2xpZGVyV2lkdGggPSBfLiRzbGlkZXIud2lkdGgoKTtcclxuICAgICAgICB2YXIgd2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCB8fCAkKHdpbmRvdykud2lkdGgoKTtcclxuXHJcbiAgICAgICAgaWYgKF8ucmVzcG9uZFRvID09PSAnd2luZG93Jykge1xyXG4gICAgICAgICAgICByZXNwb25kVG9XaWR0aCA9IHdpbmRvd1dpZHRoO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoXy5yZXNwb25kVG8gPT09ICdzbGlkZXInKSB7XHJcbiAgICAgICAgICAgIHJlc3BvbmRUb1dpZHRoID0gc2xpZGVyV2lkdGg7XHJcbiAgICAgICAgfSBlbHNlIGlmIChfLnJlc3BvbmRUbyA9PT0gJ21pbicpIHtcclxuICAgICAgICAgICAgcmVzcG9uZFRvV2lkdGggPSBNYXRoLm1pbih3aW5kb3dXaWR0aCwgc2xpZGVyV2lkdGgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCBfLm9wdGlvbnMucmVzcG9uc2l2ZSAmJlxyXG4gICAgICAgICAgICBfLm9wdGlvbnMucmVzcG9uc2l2ZS5sZW5ndGggJiZcclxuICAgICAgICAgICAgXy5vcHRpb25zLnJlc3BvbnNpdmUgIT09IG51bGwpIHtcclxuXHJcbiAgICAgICAgICAgIHRhcmdldEJyZWFrcG9pbnQgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgZm9yIChicmVha3BvaW50IGluIF8uYnJlYWtwb2ludHMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChfLmJyZWFrcG9pbnRzLmhhc093blByb3BlcnR5KGJyZWFrcG9pbnQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKF8ub3JpZ2luYWxTZXR0aW5ncy5tb2JpbGVGaXJzdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbmRUb1dpZHRoIDwgXy5icmVha3BvaW50c1ticmVha3BvaW50XSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0QnJlYWtwb2ludCA9IF8uYnJlYWtwb2ludHNbYnJlYWtwb2ludF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uZFRvV2lkdGggPiBfLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRCcmVha3BvaW50ID0gXy5icmVha3BvaW50c1ticmVha3BvaW50XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRhcmdldEJyZWFrcG9pbnQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGlmIChfLmFjdGl2ZUJyZWFrcG9pbnQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0QnJlYWtwb2ludCAhPT0gXy5hY3RpdmVCcmVha3BvaW50IHx8IGZvcmNlVXBkYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uYWN0aXZlQnJlYWtwb2ludCA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRCcmVha3BvaW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXy5icmVha3BvaW50U2V0dGluZ3NbdGFyZ2V0QnJlYWtwb2ludF0gPT09ICd1bnNsaWNrJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy51bnNsaWNrKHRhcmdldEJyZWFrcG9pbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5vcHRpb25zID0gJC5leHRlbmQoe30sIF8ub3JpZ2luYWxTZXR0aW5ncyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmJyZWFrcG9pbnRTZXR0aW5nc1tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0QnJlYWtwb2ludF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluaXRpYWwgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmN1cnJlbnRTbGlkZSA9IF8ub3B0aW9ucy5pbml0aWFsU2xpZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLnJlZnJlc2goaW5pdGlhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJpZ2dlckJyZWFrcG9pbnQgPSB0YXJnZXRCcmVha3BvaW50O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5hY3RpdmVCcmVha3BvaW50ID0gdGFyZ2V0QnJlYWtwb2ludDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXy5icmVha3BvaW50U2V0dGluZ3NbdGFyZ2V0QnJlYWtwb2ludF0gPT09ICd1bnNsaWNrJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfLnVuc2xpY2sodGFyZ2V0QnJlYWtwb2ludCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXy5vcHRpb25zID0gJC5leHRlbmQoe30sIF8ub3JpZ2luYWxTZXR0aW5ncyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uYnJlYWtwb2ludFNldHRpbmdzW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEJyZWFrcG9pbnRdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluaXRpYWwgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uY3VycmVudFNsaWRlID0gXy5vcHRpb25zLmluaXRpYWxTbGlkZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfLnJlZnJlc2goaW5pdGlhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRyaWdnZXJCcmVha3BvaW50ID0gdGFyZ2V0QnJlYWtwb2ludDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChfLmFjdGl2ZUJyZWFrcG9pbnQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBfLmFjdGl2ZUJyZWFrcG9pbnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIF8ub3B0aW9ucyA9IF8ub3JpZ2luYWxTZXR0aW5ncztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5pdGlhbCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfLmN1cnJlbnRTbGlkZSA9IF8ub3B0aW9ucy5pbml0aWFsU2xpZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIF8ucmVmcmVzaChpbml0aWFsKTtcclxuICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyQnJlYWtwb2ludCA9IHRhcmdldEJyZWFrcG9pbnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIG9ubHkgdHJpZ2dlciBicmVha3BvaW50cyBkdXJpbmcgYW4gYWN0dWFsIGJyZWFrLiBub3Qgb24gaW5pdGlhbGl6ZS5cclxuICAgICAgICAgICAgaWYoICFpbml0aWFsICYmIHRyaWdnZXJCcmVha3BvaW50ICE9PSBmYWxzZSApIHtcclxuICAgICAgICAgICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdicmVha3BvaW50JywgW18sIHRyaWdnZXJCcmVha3BvaW50XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuY2hhbmdlU2xpZGUgPSBmdW5jdGlvbihldmVudCwgZG9udEFuaW1hdGUpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLFxyXG4gICAgICAgICAgICAkdGFyZ2V0ID0gJChldmVudC5jdXJyZW50VGFyZ2V0KSxcclxuICAgICAgICAgICAgaW5kZXhPZmZzZXQsIHNsaWRlT2Zmc2V0LCB1bmV2ZW5PZmZzZXQ7XHJcblxyXG4gICAgICAgIC8vIElmIHRhcmdldCBpcyBhIGxpbmssIHByZXZlbnQgZGVmYXVsdCBhY3Rpb24uXHJcbiAgICAgICAgaWYoJHRhcmdldC5pcygnYScpKSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBJZiB0YXJnZXQgaXMgbm90IHRoZSA8bGk+IGVsZW1lbnQgKGllOiBhIGNoaWxkKSwgZmluZCB0aGUgPGxpPi5cclxuICAgICAgICBpZighJHRhcmdldC5pcygnbGknKSkge1xyXG4gICAgICAgICAgICAkdGFyZ2V0ID0gJHRhcmdldC5jbG9zZXN0KCdsaScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdW5ldmVuT2Zmc2V0ID0gKF8uc2xpZGVDb3VudCAlIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCAhPT0gMCk7XHJcbiAgICAgICAgaW5kZXhPZmZzZXQgPSB1bmV2ZW5PZmZzZXQgPyAwIDogKF8uc2xpZGVDb3VudCAtIF8uY3VycmVudFNsaWRlKSAlIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbDtcclxuXHJcbiAgICAgICAgc3dpdGNoIChldmVudC5kYXRhLm1lc3NhZ2UpIHtcclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ3ByZXZpb3VzJzpcclxuICAgICAgICAgICAgICAgIHNsaWRlT2Zmc2V0ID0gaW5kZXhPZmZzZXQgPT09IDAgPyBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgOiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93IC0gaW5kZXhPZmZzZXQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG4gICAgICAgICAgICAgICAgICAgIF8uc2xpZGVIYW5kbGVyKF8uY3VycmVudFNsaWRlIC0gc2xpZGVPZmZzZXQsIGZhbHNlLCBkb250QW5pbWF0ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ25leHQnOlxyXG4gICAgICAgICAgICAgICAgc2xpZGVPZmZzZXQgPSBpbmRleE9mZnNldCA9PT0gMCA/IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCA6IGluZGV4T2Zmc2V0O1xyXG4gICAgICAgICAgICAgICAgaWYgKF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcclxuICAgICAgICAgICAgICAgICAgICBfLnNsaWRlSGFuZGxlcihfLmN1cnJlbnRTbGlkZSArIHNsaWRlT2Zmc2V0LCBmYWxzZSwgZG9udEFuaW1hdGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlICdpbmRleCc6XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBldmVudC5kYXRhLmluZGV4ID09PSAwID8gMCA6XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuZGF0YS5pbmRleCB8fCAkdGFyZ2V0LmluZGV4KCkgKiBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7XHJcblxyXG4gICAgICAgICAgICAgICAgXy5zbGlkZUhhbmRsZXIoXy5jaGVja05hdmlnYWJsZShpbmRleCksIGZhbHNlLCBkb250QW5pbWF0ZSk7XHJcbiAgICAgICAgICAgICAgICAkdGFyZ2V0LmNoaWxkcmVuKCkudHJpZ2dlcignZm9jdXMnKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuY2hlY2tOYXZpZ2FibGUgPSBmdW5jdGlvbihpbmRleCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgIG5hdmlnYWJsZXMsIHByZXZOYXZpZ2FibGU7XHJcblxyXG4gICAgICAgIG5hdmlnYWJsZXMgPSBfLmdldE5hdmlnYWJsZUluZGV4ZXMoKTtcclxuICAgICAgICBwcmV2TmF2aWdhYmxlID0gMDtcclxuICAgICAgICBpZiAoaW5kZXggPiBuYXZpZ2FibGVzW25hdmlnYWJsZXMubGVuZ3RoIC0gMV0pIHtcclxuICAgICAgICAgICAgaW5kZXggPSBuYXZpZ2FibGVzW25hdmlnYWJsZXMubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgbiBpbiBuYXZpZ2FibGVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPCBuYXZpZ2FibGVzW25dKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBwcmV2TmF2aWdhYmxlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcHJldk5hdmlnYWJsZSA9IG5hdmlnYWJsZXNbbl07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBpbmRleDtcclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmNsZWFuVXBFdmVudHMgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmRvdHMgJiYgXy4kZG90cyAhPT0gbnVsbCkge1xyXG5cclxuICAgICAgICAgICAgJCgnbGknLCBfLiRkb3RzKVxyXG4gICAgICAgICAgICAgICAgLm9mZignY2xpY2suc2xpY2snLCBfLmNoYW5nZVNsaWRlKVxyXG4gICAgICAgICAgICAgICAgLm9mZignbW91c2VlbnRlci5zbGljaycsICQucHJveHkoXy5pbnRlcnJ1cHQsIF8sIHRydWUpKVxyXG4gICAgICAgICAgICAgICAgLm9mZignbW91c2VsZWF2ZS5zbGljaycsICQucHJveHkoXy5pbnRlcnJ1cHQsIF8sIGZhbHNlKSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy4kc2xpZGVyLm9mZignZm9jdXMuc2xpY2sgYmx1ci5zbGljaycpO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmFycm93cyA9PT0gdHJ1ZSAmJiBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcbiAgICAgICAgICAgIF8uJHByZXZBcnJvdyAmJiBfLiRwcmV2QXJyb3cub2ZmKCdjbGljay5zbGljaycsIF8uY2hhbmdlU2xpZGUpO1xyXG4gICAgICAgICAgICBfLiRuZXh0QXJyb3cgJiYgXy4kbmV4dEFycm93Lm9mZignY2xpY2suc2xpY2snLCBfLmNoYW5nZVNsaWRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF8uJGxpc3Qub2ZmKCd0b3VjaHN0YXJ0LnNsaWNrIG1vdXNlZG93bi5zbGljaycsIF8uc3dpcGVIYW5kbGVyKTtcclxuICAgICAgICBfLiRsaXN0Lm9mZigndG91Y2htb3ZlLnNsaWNrIG1vdXNlbW92ZS5zbGljaycsIF8uc3dpcGVIYW5kbGVyKTtcclxuICAgICAgICBfLiRsaXN0Lm9mZigndG91Y2hlbmQuc2xpY2sgbW91c2V1cC5zbGljaycsIF8uc3dpcGVIYW5kbGVyKTtcclxuICAgICAgICBfLiRsaXN0Lm9mZigndG91Y2hjYW5jZWwuc2xpY2sgbW91c2VsZWF2ZS5zbGljaycsIF8uc3dpcGVIYW5kbGVyKTtcclxuXHJcbiAgICAgICAgXy4kbGlzdC5vZmYoJ2NsaWNrLnNsaWNrJywgXy5jbGlja0hhbmRsZXIpO1xyXG5cclxuICAgICAgICAkKGRvY3VtZW50KS5vZmYoXy52aXNpYmlsaXR5Q2hhbmdlLCBfLnZpc2liaWxpdHkpO1xyXG5cclxuICAgICAgICBfLmNsZWFuVXBTbGlkZUV2ZW50cygpO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmFjY2Vzc2liaWxpdHkgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgXy4kbGlzdC5vZmYoJ2tleWRvd24uc2xpY2snLCBfLmtleUhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5mb2N1c09uU2VsZWN0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICQoXy4kc2xpZGVUcmFjaykuY2hpbGRyZW4oKS5vZmYoJ2NsaWNrLnNsaWNrJywgXy5zZWxlY3RIYW5kbGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQod2luZG93KS5vZmYoJ29yaWVudGF0aW9uY2hhbmdlLnNsaWNrLnNsaWNrLScgKyBfLmluc3RhbmNlVWlkLCBfLm9yaWVudGF0aW9uQ2hhbmdlKTtcclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLm9mZigncmVzaXplLnNsaWNrLnNsaWNrLScgKyBfLmluc3RhbmNlVWlkLCBfLnJlc2l6ZSk7XHJcblxyXG4gICAgICAgICQoJ1tkcmFnZ2FibGUhPXRydWVdJywgXy4kc2xpZGVUcmFjaykub2ZmKCdkcmFnc3RhcnQnLCBfLnByZXZlbnREZWZhdWx0KTtcclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLm9mZignbG9hZC5zbGljay5zbGljay0nICsgXy5pbnN0YW5jZVVpZCwgXy5zZXRQb3NpdGlvbik7XHJcbiAgICAgICAgJChkb2N1bWVudCkub2ZmKCdyZWFkeS5zbGljay5zbGljay0nICsgXy5pbnN0YW5jZVVpZCwgXy5zZXRQb3NpdGlvbik7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuY2xlYW5VcFNsaWRlRXZlbnRzID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgXy4kbGlzdC5vZmYoJ21vdXNlZW50ZXIuc2xpY2snLCAkLnByb3h5KF8uaW50ZXJydXB0LCBfLCB0cnVlKSk7XHJcbiAgICAgICAgXy4kbGlzdC5vZmYoJ21vdXNlbGVhdmUuc2xpY2snLCAkLnByb3h5KF8uaW50ZXJydXB0LCBfLCBmYWxzZSkpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmNsZWFuVXBSb3dzID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcywgb3JpZ2luYWxTbGlkZXM7XHJcblxyXG4gICAgICAgIGlmKF8ub3B0aW9ucy5yb3dzID4gMSkge1xyXG4gICAgICAgICAgICBvcmlnaW5hbFNsaWRlcyA9IF8uJHNsaWRlcy5jaGlsZHJlbigpLmNoaWxkcmVuKCk7XHJcbiAgICAgICAgICAgIG9yaWdpbmFsU2xpZGVzLnJlbW92ZUF0dHIoJ3N0eWxlJyk7XHJcbiAgICAgICAgICAgIF8uJHNsaWRlci5lbXB0eSgpLmFwcGVuZChvcmlnaW5hbFNsaWRlcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmNsaWNrSGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKF8uc2hvdWxkQ2xpY2sgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKHJlZnJlc2gpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBfLmF1dG9QbGF5Q2xlYXIoKTtcclxuXHJcbiAgICAgICAgXy50b3VjaE9iamVjdCA9IHt9O1xyXG5cclxuICAgICAgICBfLmNsZWFuVXBFdmVudHMoKTtcclxuXHJcbiAgICAgICAgJCgnLnNsaWNrLWNsb25lZCcsIF8uJHNsaWRlcikuZGV0YWNoKCk7XHJcblxyXG4gICAgICAgIGlmIChfLiRkb3RzKSB7XHJcbiAgICAgICAgICAgIF8uJGRvdHMucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgaWYgKCBfLiRwcmV2QXJyb3cgJiYgXy4kcHJldkFycm93Lmxlbmd0aCApIHtcclxuXHJcbiAgICAgICAgICAgIF8uJHByZXZBcnJvd1xyXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdzbGljay1kaXNhYmxlZCBzbGljay1hcnJvdyBzbGljay1oaWRkZW4nKVxyXG4gICAgICAgICAgICAgICAgLnJlbW92ZUF0dHIoJ2FyaWEtaGlkZGVuIGFyaWEtZGlzYWJsZWQgdGFiaW5kZXgnKVxyXG4gICAgICAgICAgICAgICAgLmNzcygnZGlzcGxheScsJycpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBfLmh0bWxFeHByLnRlc3QoIF8ub3B0aW9ucy5wcmV2QXJyb3cgKSkge1xyXG4gICAgICAgICAgICAgICAgXy4kcHJldkFycm93LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIF8uJG5leHRBcnJvdyAmJiBfLiRuZXh0QXJyb3cubGVuZ3RoICkge1xyXG5cclxuICAgICAgICAgICAgXy4kbmV4dEFycm93XHJcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NsaWNrLWRpc2FibGVkIHNsaWNrLWFycm93IHNsaWNrLWhpZGRlbicpXHJcbiAgICAgICAgICAgICAgICAucmVtb3ZlQXR0cignYXJpYS1oaWRkZW4gYXJpYS1kaXNhYmxlZCB0YWJpbmRleCcpXHJcbiAgICAgICAgICAgICAgICAuY3NzKCdkaXNwbGF5JywnJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIF8uaHRtbEV4cHIudGVzdCggXy5vcHRpb25zLm5leHRBcnJvdyApKSB7XHJcbiAgICAgICAgICAgICAgICBfLiRuZXh0QXJyb3cucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgaWYgKF8uJHNsaWRlcykge1xyXG5cclxuICAgICAgICAgICAgXy4kc2xpZGVzXHJcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NsaWNrLXNsaWRlIHNsaWNrLWFjdGl2ZSBzbGljay1jZW50ZXIgc2xpY2stdmlzaWJsZSBzbGljay1jdXJyZW50JylcclxuICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCdhcmlhLWhpZGRlbicpXHJcbiAgICAgICAgICAgICAgICAucmVtb3ZlQXR0cignZGF0YS1zbGljay1pbmRleCcpXHJcbiAgICAgICAgICAgICAgICAuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignc3R5bGUnLCAkKHRoaXMpLmRhdGEoJ29yaWdpbmFsU3R5bGluZycpKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmRldGFjaCgpO1xyXG5cclxuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5kZXRhY2goKTtcclxuXHJcbiAgICAgICAgICAgIF8uJGxpc3QuZGV0YWNoKCk7XHJcblxyXG4gICAgICAgICAgICBfLiRzbGlkZXIuYXBwZW5kKF8uJHNsaWRlcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfLmNsZWFuVXBSb3dzKCk7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlci5yZW1vdmVDbGFzcygnc2xpY2stc2xpZGVyJyk7XHJcbiAgICAgICAgXy4kc2xpZGVyLnJlbW92ZUNsYXNzKCdzbGljay1pbml0aWFsaXplZCcpO1xyXG4gICAgICAgIF8uJHNsaWRlci5yZW1vdmVDbGFzcygnc2xpY2stZG90dGVkJyk7XHJcblxyXG4gICAgICAgIF8udW5zbGlja2VkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYoIXJlZnJlc2gpIHtcclxuICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ2Rlc3Ryb3knLCBbX10pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5kaXNhYmxlVHJhbnNpdGlvbiA9IGZ1bmN0aW9uKHNsaWRlKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgdHJhbnNpdGlvbiA9IHt9O1xyXG5cclxuICAgICAgICB0cmFuc2l0aW9uW18udHJhbnNpdGlvblR5cGVdID0gJyc7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZmFkZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jc3ModHJhbnNpdGlvbik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgXy4kc2xpZGVzLmVxKHNsaWRlKS5jc3ModHJhbnNpdGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmZhZGVTbGlkZSA9IGZ1bmN0aW9uKHNsaWRlSW5kZXgsIGNhbGxiYWNrKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKF8uY3NzVHJhbnNpdGlvbnMgPT09IGZhbHNlKSB7XHJcblxyXG4gICAgICAgICAgICBfLiRzbGlkZXMuZXEoc2xpZGVJbmRleCkuY3NzKHtcclxuICAgICAgICAgICAgICAgIHpJbmRleDogXy5vcHRpb25zLnpJbmRleFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIF8uJHNsaWRlcy5lcShzbGlkZUluZGV4KS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDFcclxuICAgICAgICAgICAgfSwgXy5vcHRpb25zLnNwZWVkLCBfLm9wdGlvbnMuZWFzaW5nLCBjYWxsYmFjayk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBfLmFwcGx5VHJhbnNpdGlvbihzbGlkZUluZGV4KTtcclxuXHJcbiAgICAgICAgICAgIF8uJHNsaWRlcy5lcShzbGlkZUluZGV4KS5jc3Moe1xyXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMSxcclxuICAgICAgICAgICAgICAgIHpJbmRleDogXy5vcHRpb25zLnpJbmRleFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgXy5kaXNhYmxlVHJhbnNpdGlvbihzbGlkZUluZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbCgpO1xyXG4gICAgICAgICAgICAgICAgfSwgXy5vcHRpb25zLnNwZWVkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuZmFkZVNsaWRlT3V0ID0gZnVuY3Rpb24oc2xpZGVJbmRleCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmIChfLmNzc1RyYW5zaXRpb25zID09PSBmYWxzZSkge1xyXG5cclxuICAgICAgICAgICAgXy4kc2xpZGVzLmVxKHNsaWRlSW5kZXgpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMCxcclxuICAgICAgICAgICAgICAgIHpJbmRleDogXy5vcHRpb25zLnpJbmRleCAtIDJcclxuICAgICAgICAgICAgfSwgXy5vcHRpb25zLnNwZWVkLCBfLm9wdGlvbnMuZWFzaW5nKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIF8uYXBwbHlUcmFuc2l0aW9uKHNsaWRlSW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgXy4kc2xpZGVzLmVxKHNsaWRlSW5kZXgpLmNzcyh7XHJcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLFxyXG4gICAgICAgICAgICAgICAgekluZGV4OiBfLm9wdGlvbnMuekluZGV4IC0gMlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmZpbHRlclNsaWRlcyA9IFNsaWNrLnByb3RvdHlwZS5zbGlja0ZpbHRlciA9IGZ1bmN0aW9uKGZpbHRlcikge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmIChmaWx0ZXIgIT09IG51bGwpIHtcclxuXHJcbiAgICAgICAgICAgIF8uJHNsaWRlc0NhY2hlID0gXy4kc2xpZGVzO1xyXG5cclxuICAgICAgICAgICAgXy51bmxvYWQoKTtcclxuXHJcbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKS5kZXRhY2goKTtcclxuXHJcbiAgICAgICAgICAgIF8uJHNsaWRlc0NhY2hlLmZpbHRlcihmaWx0ZXIpLmFwcGVuZFRvKF8uJHNsaWRlVHJhY2spO1xyXG5cclxuICAgICAgICAgICAgXy5yZWluaXQoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmZvY3VzSGFuZGxlciA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlclxyXG4gICAgICAgICAgICAub2ZmKCdmb2N1cy5zbGljayBibHVyLnNsaWNrJylcclxuICAgICAgICAgICAgLm9uKCdmb2N1cy5zbGljayBibHVyLnNsaWNrJyxcclxuICAgICAgICAgICAgICAgICcqOm5vdCguc2xpY2stYXJyb3cpJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcbiAgICAgICAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICB2YXIgJHNmID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoIF8ub3B0aW9ucy5wYXVzZU9uRm9jdXMgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5mb2N1c3NlZCA9ICRzZi5pcygnOmZvY3VzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5hdXRvUGxheSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSwgMCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuZ2V0Q3VycmVudCA9IFNsaWNrLnByb3RvdHlwZS5zbGlja0N1cnJlbnRTbGlkZSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIF8uY3VycmVudFNsaWRlO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmdldERvdENvdW50ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgdmFyIGJyZWFrUG9pbnQgPSAwO1xyXG4gICAgICAgIHZhciBjb3VudGVyID0gMDtcclxuICAgICAgICB2YXIgcGFnZXJRdHkgPSAwO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmluZmluaXRlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHdoaWxlIChicmVha1BvaW50IDwgXy5zbGlkZUNvdW50KSB7XHJcbiAgICAgICAgICAgICAgICArK3BhZ2VyUXR5O1xyXG4gICAgICAgICAgICAgICAgYnJlYWtQb2ludCA9IGNvdW50ZXIgKyBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7XHJcbiAgICAgICAgICAgICAgICBjb3VudGVyICs9IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ID8gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIDogXy5vcHRpb25zLnNsaWRlc1RvU2hvdztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgcGFnZXJRdHkgPSBfLnNsaWRlQ291bnQ7XHJcbiAgICAgICAgfSBlbHNlIGlmKCFfLm9wdGlvbnMuYXNOYXZGb3IpIHtcclxuICAgICAgICAgICAgcGFnZXJRdHkgPSAxICsgTWF0aC5jZWlsKChfLnNsaWRlQ291bnQgLSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSAvIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCk7XHJcbiAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICB3aGlsZSAoYnJlYWtQb2ludCA8IF8uc2xpZGVDb3VudCkge1xyXG4gICAgICAgICAgICAgICAgKytwYWdlclF0eTtcclxuICAgICAgICAgICAgICAgIGJyZWFrUG9pbnQgPSBjb3VudGVyICsgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsO1xyXG4gICAgICAgICAgICAgICAgY291bnRlciArPSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyA/IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCA6IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3c7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwYWdlclF0eSAtIDE7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuZ2V0TGVmdCA9IGZ1bmN0aW9uKHNsaWRlSW5kZXgpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLFxyXG4gICAgICAgICAgICB0YXJnZXRMZWZ0LFxyXG4gICAgICAgICAgICB2ZXJ0aWNhbEhlaWdodCxcclxuICAgICAgICAgICAgdmVydGljYWxPZmZzZXQgPSAwLFxyXG4gICAgICAgICAgICB0YXJnZXRTbGlkZTtcclxuXHJcbiAgICAgICAgXy5zbGlkZU9mZnNldCA9IDA7XHJcbiAgICAgICAgdmVydGljYWxIZWlnaHQgPSBfLiRzbGlkZXMuZmlyc3QoKS5vdXRlckhlaWdodCh0cnVlKTtcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG4gICAgICAgICAgICAgICAgXy5zbGlkZU9mZnNldCA9IChfLnNsaWRlV2lkdGggKiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSAqIC0xO1xyXG4gICAgICAgICAgICAgICAgdmVydGljYWxPZmZzZXQgPSAodmVydGljYWxIZWlnaHQgKiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSAqIC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgJSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIGlmIChzbGlkZUluZGV4ICsgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsID4gXy5zbGlkZUNvdW50ICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2xpZGVJbmRleCA+IF8uc2xpZGVDb3VudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfLnNsaWRlT2Zmc2V0ID0gKChfLm9wdGlvbnMuc2xpZGVzVG9TaG93IC0gKHNsaWRlSW5kZXggLSBfLnNsaWRlQ291bnQpKSAqIF8uc2xpZGVXaWR0aCkgKiAtMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmVydGljYWxPZmZzZXQgPSAoKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLSAoc2xpZGVJbmRleCAtIF8uc2xpZGVDb3VudCkpICogdmVydGljYWxIZWlnaHQpICogLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXy5zbGlkZU9mZnNldCA9ICgoXy5zbGlkZUNvdW50ICUgXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsKSAqIF8uc2xpZGVXaWR0aCkgKiAtMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmVydGljYWxPZmZzZXQgPSAoKF8uc2xpZGVDb3VudCAlIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCkgKiB2ZXJ0aWNhbEhlaWdodCkgKiAtMTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoc2xpZGVJbmRleCArIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgPiBfLnNsaWRlQ291bnQpIHtcclxuICAgICAgICAgICAgICAgIF8uc2xpZGVPZmZzZXQgPSAoKHNsaWRlSW5kZXggKyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSAtIF8uc2xpZGVDb3VudCkgKiBfLnNsaWRlV2lkdGg7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbE9mZnNldCA9ICgoc2xpZGVJbmRleCArIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIC0gXy5zbGlkZUNvdW50KSAqIHZlcnRpY2FsSGVpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy5zbGlkZUNvdW50IDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcclxuICAgICAgICAgICAgXy5zbGlkZU9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgIHZlcnRpY2FsT2Zmc2V0ID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSAmJiBfLm9wdGlvbnMuaW5maW5pdGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgXy5zbGlkZU9mZnNldCArPSBfLnNsaWRlV2lkdGggKiBNYXRoLmZsb29yKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLyAyKSAtIF8uc2xpZGVXaWR0aDtcclxuICAgICAgICB9IGVsc2UgaWYgKF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIF8uc2xpZGVPZmZzZXQgPSAwO1xyXG4gICAgICAgICAgICBfLnNsaWRlT2Zmc2V0ICs9IF8uc2xpZGVXaWR0aCAqIE1hdGguZmxvb3IoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAvIDIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdGFyZ2V0TGVmdCA9ICgoc2xpZGVJbmRleCAqIF8uc2xpZGVXaWR0aCkgKiAtMSkgKyBfLnNsaWRlT2Zmc2V0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRhcmdldExlZnQgPSAoKHNsaWRlSW5kZXggKiB2ZXJ0aWNhbEhlaWdodCkgKiAtMSkgKyB2ZXJ0aWNhbE9mZnNldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMudmFyaWFibGVXaWR0aCA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgaWYgKF8uc2xpZGVDb3VudCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93IHx8IF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldFNsaWRlID0gXy4kc2xpZGVUcmFjay5jaGlsZHJlbignLnNsaWNrLXNsaWRlJykuZXEoc2xpZGVJbmRleCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRTbGlkZSA9IF8uJHNsaWRlVHJhY2suY2hpbGRyZW4oJy5zbGljay1zbGlkZScpLmVxKHNsaWRlSW5kZXggKyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5ydGwgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXRTbGlkZVswXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldExlZnQgPSAoXy4kc2xpZGVUcmFjay53aWR0aCgpIC0gdGFyZ2V0U2xpZGVbMF0ub2Zmc2V0TGVmdCAtIHRhcmdldFNsaWRlLndpZHRoKCkpICogLTE7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldExlZnQgPSAgMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldExlZnQgPSB0YXJnZXRTbGlkZVswXSA/IHRhcmdldFNsaWRlWzBdLm9mZnNldExlZnQgKiAtMSA6IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKF8uc2xpZGVDb3VudCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93IHx8IF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRTbGlkZSA9IF8uJHNsaWRlVHJhY2suY2hpbGRyZW4oJy5zbGljay1zbGlkZScpLmVxKHNsaWRlSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRTbGlkZSA9IF8uJHNsaWRlVHJhY2suY2hpbGRyZW4oJy5zbGljay1zbGlkZScpLmVxKHNsaWRlSW5kZXggKyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICsgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5ydGwgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0U2xpZGVbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0TGVmdCA9IChfLiRzbGlkZVRyYWNrLndpZHRoKCkgLSB0YXJnZXRTbGlkZVswXS5vZmZzZXRMZWZ0IC0gdGFyZ2V0U2xpZGUud2lkdGgoKSkgKiAtMTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRMZWZ0ID0gIDA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRMZWZ0ID0gdGFyZ2V0U2xpZGVbMF0gPyB0YXJnZXRTbGlkZVswXS5vZmZzZXRMZWZ0ICogLTEgOiAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRhcmdldExlZnQgKz0gKF8uJGxpc3Qud2lkdGgoKSAtIHRhcmdldFNsaWRlLm91dGVyV2lkdGgoKSkgLyAyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGFyZ2V0TGVmdDtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5nZXRPcHRpb24gPSBTbGljay5wcm90b3R5cGUuc2xpY2tHZXRPcHRpb24gPSBmdW5jdGlvbihvcHRpb24pIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICByZXR1cm4gXy5vcHRpb25zW29wdGlvbl07XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuZ2V0TmF2aWdhYmxlSW5kZXhlcyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgIGJyZWFrUG9pbnQgPSAwLFxyXG4gICAgICAgICAgICBjb3VudGVyID0gMCxcclxuICAgICAgICAgICAgaW5kZXhlcyA9IFtdLFxyXG4gICAgICAgICAgICBtYXg7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuaW5maW5pdGUgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIG1heCA9IF8uc2xpZGVDb3VudDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBicmVha1BvaW50ID0gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsICogLTE7XHJcbiAgICAgICAgICAgIGNvdW50ZXIgPSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgKiAtMTtcclxuICAgICAgICAgICAgbWF4ID0gXy5zbGlkZUNvdW50ICogMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHdoaWxlIChicmVha1BvaW50IDwgbWF4KSB7XHJcbiAgICAgICAgICAgIGluZGV4ZXMucHVzaChicmVha1BvaW50KTtcclxuICAgICAgICAgICAgYnJlYWtQb2ludCA9IGNvdW50ZXIgKyBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGw7XHJcbiAgICAgICAgICAgIGNvdW50ZXIgKz0gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsIDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgPyBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgOiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGluZGV4ZXM7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuZ2V0U2xpY2sgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuZ2V0U2xpZGVDb3VudCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgIHNsaWRlc1RyYXZlcnNlZCwgc3dpcGVkU2xpZGUsIGNlbnRlck9mZnNldDtcclxuXHJcbiAgICAgICAgY2VudGVyT2Zmc2V0ID0gXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUgPyBfLnNsaWRlV2lkdGggKiBNYXRoLmZsb29yKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLyAyKSA6IDA7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuc3dpcGVUb1NsaWRlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suZmluZCgnLnNsaWNrLXNsaWRlJykuZWFjaChmdW5jdGlvbihpbmRleCwgc2xpZGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzbGlkZS5vZmZzZXRMZWZ0IC0gY2VudGVyT2Zmc2V0ICsgKCQoc2xpZGUpLm91dGVyV2lkdGgoKSAvIDIpID4gKF8uc3dpcGVMZWZ0ICogLTEpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3dpcGVkU2xpZGUgPSBzbGlkZTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc2xpZGVzVHJhdmVyc2VkID0gTWF0aC5hYnMoJChzd2lwZWRTbGlkZSkuYXR0cignZGF0YS1zbGljay1pbmRleCcpIC0gXy5jdXJyZW50U2xpZGUpIHx8IDE7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc2xpZGVzVHJhdmVyc2VkO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5nb1RvID0gU2xpY2sucHJvdG90eXBlLnNsaWNrR29UbyA9IGZ1bmN0aW9uKHNsaWRlLCBkb250QW5pbWF0ZSkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIF8uY2hhbmdlU2xpZGUoe1xyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiAnaW5kZXgnLFxyXG4gICAgICAgICAgICAgICAgaW5kZXg6IHBhcnNlSW50KHNsaWRlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgZG9udEFuaW1hdGUpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbihjcmVhdGlvbikge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmICghJChfLiRzbGlkZXIpLmhhc0NsYXNzKCdzbGljay1pbml0aWFsaXplZCcpKSB7XHJcblxyXG4gICAgICAgICAgICAkKF8uJHNsaWRlcikuYWRkQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJyk7XHJcblxyXG4gICAgICAgICAgICBfLmJ1aWxkUm93cygpO1xyXG4gICAgICAgICAgICBfLmJ1aWxkT3V0KCk7XHJcbiAgICAgICAgICAgIF8uc2V0UHJvcHMoKTtcclxuICAgICAgICAgICAgXy5zdGFydExvYWQoKTtcclxuICAgICAgICAgICAgXy5sb2FkU2xpZGVyKCk7XHJcbiAgICAgICAgICAgIF8uaW5pdGlhbGl6ZUV2ZW50cygpO1xyXG4gICAgICAgICAgICBfLnVwZGF0ZUFycm93cygpO1xyXG4gICAgICAgICAgICBfLnVwZGF0ZURvdHMoKTtcclxuICAgICAgICAgICAgXy5jaGVja1Jlc3BvbnNpdmUodHJ1ZSk7XHJcbiAgICAgICAgICAgIF8uZm9jdXNIYW5kbGVyKCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNyZWF0aW9uKSB7XHJcbiAgICAgICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdpbml0JywgW19dKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBfLmluaXRBREEoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggXy5vcHRpb25zLmF1dG9wbGF5ICkge1xyXG5cclxuICAgICAgICAgICAgXy5wYXVzZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgXy5hdXRvUGxheSgpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuaW5pdEFEQSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuICAgICAgICBfLiRzbGlkZXMuYWRkKF8uJHNsaWRlVHJhY2suZmluZCgnLnNsaWNrLWNsb25lZCcpKS5hdHRyKHtcclxuICAgICAgICAgICAgJ2FyaWEtaGlkZGVuJzogJ3RydWUnLFxyXG4gICAgICAgICAgICAndGFiaW5kZXgnOiAnLTEnXHJcbiAgICAgICAgfSkuZmluZCgnYSwgaW5wdXQsIGJ1dHRvbiwgc2VsZWN0JykuYXR0cih7XHJcbiAgICAgICAgICAgICd0YWJpbmRleCc6ICctMSdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgXy4kc2xpZGVUcmFjay5hdHRyKCdyb2xlJywgJ2xpc3Rib3gnKTtcclxuXHJcbiAgICAgICAgXy4kc2xpZGVzLm5vdChfLiRzbGlkZVRyYWNrLmZpbmQoJy5zbGljay1jbG9uZWQnKSkuZWFjaChmdW5jdGlvbihpKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuYXR0cih7XHJcbiAgICAgICAgICAgICAgICAncm9sZSc6ICdvcHRpb24nLFxyXG4gICAgICAgICAgICAgICAgJ2FyaWEtZGVzY3JpYmVkYnknOiAnc2xpY2stc2xpZGUnICsgXy5pbnN0YW5jZVVpZCArIGkgKyAnJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKF8uJGRvdHMgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgXy4kZG90cy5hdHRyKCdyb2xlJywgJ3RhYmxpc3QnKS5maW5kKCdsaScpLmVhY2goZnVuY3Rpb24oaSkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKHtcclxuICAgICAgICAgICAgICAgICAgICAncm9sZSc6ICdwcmVzZW50YXRpb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICdhcmlhLXNlbGVjdGVkJzogJ2ZhbHNlJyxcclxuICAgICAgICAgICAgICAgICAgICAnYXJpYS1jb250cm9scyc6ICduYXZpZ2F0aW9uJyArIF8uaW5zdGFuY2VVaWQgKyBpICsgJycsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2lkJzogJ3NsaWNrLXNsaWRlJyArIF8uaW5zdGFuY2VVaWQgKyBpICsgJydcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmZpcnN0KCkuYXR0cignYXJpYS1zZWxlY3RlZCcsICd0cnVlJykuZW5kKClcclxuICAgICAgICAgICAgICAgIC5maW5kKCdidXR0b24nKS5hdHRyKCdyb2xlJywgJ2J1dHRvbicpLmVuZCgpXHJcbiAgICAgICAgICAgICAgICAuY2xvc2VzdCgnZGl2JykuYXR0cigncm9sZScsICd0b29sYmFyJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIF8uYWN0aXZhdGVBREEoKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5pbml0QXJyb3dFdmVudHMgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmFycm93cyA9PT0gdHJ1ZSAmJiBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcbiAgICAgICAgICAgIF8uJHByZXZBcnJvd1xyXG4gICAgICAgICAgICAgICAub2ZmKCdjbGljay5zbGljaycpXHJcbiAgICAgICAgICAgICAgIC5vbignY2xpY2suc2xpY2snLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ3ByZXZpb3VzJ1xyXG4gICAgICAgICAgICAgICB9LCBfLmNoYW5nZVNsaWRlKTtcclxuICAgICAgICAgICAgXy4kbmV4dEFycm93XHJcbiAgICAgICAgICAgICAgIC5vZmYoJ2NsaWNrLnNsaWNrJylcclxuICAgICAgICAgICAgICAgLm9uKCdjbGljay5zbGljaycsIHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnbmV4dCdcclxuICAgICAgICAgICAgICAgfSwgXy5jaGFuZ2VTbGlkZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmluaXREb3RFdmVudHMgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmRvdHMgPT09IHRydWUgJiYgXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG4gICAgICAgICAgICAkKCdsaScsIF8uJGRvdHMpLm9uKCdjbGljay5zbGljaycsIHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdpbmRleCdcclxuICAgICAgICAgICAgfSwgXy5jaGFuZ2VTbGlkZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIF8ub3B0aW9ucy5kb3RzID09PSB0cnVlICYmIF8ub3B0aW9ucy5wYXVzZU9uRG90c0hvdmVyID09PSB0cnVlICkge1xyXG5cclxuICAgICAgICAgICAgJCgnbGknLCBfLiRkb3RzKVxyXG4gICAgICAgICAgICAgICAgLm9uKCdtb3VzZWVudGVyLnNsaWNrJywgJC5wcm94eShfLmludGVycnVwdCwgXywgdHJ1ZSkpXHJcbiAgICAgICAgICAgICAgICAub24oJ21vdXNlbGVhdmUuc2xpY2snLCAkLnByb3h5KF8uaW50ZXJydXB0LCBfLCBmYWxzZSkpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuaW5pdFNsaWRlRXZlbnRzID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKCBfLm9wdGlvbnMucGF1c2VPbkhvdmVyICkge1xyXG5cclxuICAgICAgICAgICAgXy4kbGlzdC5vbignbW91c2VlbnRlci5zbGljaycsICQucHJveHkoXy5pbnRlcnJ1cHQsIF8sIHRydWUpKTtcclxuICAgICAgICAgICAgXy4kbGlzdC5vbignbW91c2VsZWF2ZS5zbGljaycsICQucHJveHkoXy5pbnRlcnJ1cHQsIF8sIGZhbHNlKSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5pbml0aWFsaXplRXZlbnRzID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgXy5pbml0QXJyb3dFdmVudHMoKTtcclxuXHJcbiAgICAgICAgXy5pbml0RG90RXZlbnRzKCk7XHJcbiAgICAgICAgXy5pbml0U2xpZGVFdmVudHMoKTtcclxuXHJcbiAgICAgICAgXy4kbGlzdC5vbigndG91Y2hzdGFydC5zbGljayBtb3VzZWRvd24uc2xpY2snLCB7XHJcbiAgICAgICAgICAgIGFjdGlvbjogJ3N0YXJ0J1xyXG4gICAgICAgIH0sIF8uc3dpcGVIYW5kbGVyKTtcclxuICAgICAgICBfLiRsaXN0Lm9uKCd0b3VjaG1vdmUuc2xpY2sgbW91c2Vtb3ZlLnNsaWNrJywge1xyXG4gICAgICAgICAgICBhY3Rpb246ICdtb3ZlJ1xyXG4gICAgICAgIH0sIF8uc3dpcGVIYW5kbGVyKTtcclxuICAgICAgICBfLiRsaXN0Lm9uKCd0b3VjaGVuZC5zbGljayBtb3VzZXVwLnNsaWNrJywge1xyXG4gICAgICAgICAgICBhY3Rpb246ICdlbmQnXHJcbiAgICAgICAgfSwgXy5zd2lwZUhhbmRsZXIpO1xyXG4gICAgICAgIF8uJGxpc3Qub24oJ3RvdWNoY2FuY2VsLnNsaWNrIG1vdXNlbGVhdmUuc2xpY2snLCB7XHJcbiAgICAgICAgICAgIGFjdGlvbjogJ2VuZCdcclxuICAgICAgICB9LCBfLnN3aXBlSGFuZGxlcik7XHJcblxyXG4gICAgICAgIF8uJGxpc3Qub24oJ2NsaWNrLnNsaWNrJywgXy5jbGlja0hhbmRsZXIpO1xyXG5cclxuICAgICAgICAkKGRvY3VtZW50KS5vbihfLnZpc2liaWxpdHlDaGFuZ2UsICQucHJveHkoXy52aXNpYmlsaXR5LCBfKSk7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBfLiRsaXN0Lm9uKCdrZXlkb3duLnNsaWNrJywgXy5rZXlIYW5kbGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuZm9jdXNPblNlbGVjdCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAkKF8uJHNsaWRlVHJhY2spLmNoaWxkcmVuKCkub24oJ2NsaWNrLnNsaWNrJywgXy5zZWxlY3RIYW5kbGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQod2luZG93KS5vbignb3JpZW50YXRpb25jaGFuZ2Uuc2xpY2suc2xpY2stJyArIF8uaW5zdGFuY2VVaWQsICQucHJveHkoXy5vcmllbnRhdGlvbkNoYW5nZSwgXykpO1xyXG5cclxuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZS5zbGljay5zbGljay0nICsgXy5pbnN0YW5jZVVpZCwgJC5wcm94eShfLnJlc2l6ZSwgXykpO1xyXG5cclxuICAgICAgICAkKCdbZHJhZ2dhYmxlIT10cnVlXScsIF8uJHNsaWRlVHJhY2spLm9uKCdkcmFnc3RhcnQnLCBfLnByZXZlbnREZWZhdWx0KTtcclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdsb2FkLnNsaWNrLnNsaWNrLScgKyBfLmluc3RhbmNlVWlkLCBfLnNldFBvc2l0aW9uKTtcclxuICAgICAgICAkKGRvY3VtZW50KS5vbigncmVhZHkuc2xpY2suc2xpY2stJyArIF8uaW5zdGFuY2VVaWQsIF8uc2V0UG9zaXRpb24pO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmluaXRVSSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuYXJyb3dzID09PSB0cnVlICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcclxuXHJcbiAgICAgICAgICAgIF8uJHByZXZBcnJvdy5zaG93KCk7XHJcbiAgICAgICAgICAgIF8uJG5leHRBcnJvdy5zaG93KCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5kb3RzID09PSB0cnVlICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcclxuXHJcbiAgICAgICAgICAgIF8uJGRvdHMuc2hvdygpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUua2V5SGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuICAgICAgICAgLy9Eb250IHNsaWRlIGlmIHRoZSBjdXJzb3IgaXMgaW5zaWRlIHRoZSBmb3JtIGZpZWxkcyBhbmQgYXJyb3cga2V5cyBhcmUgcHJlc3NlZFxyXG4gICAgICAgIGlmKCFldmVudC50YXJnZXQudGFnTmFtZS5tYXRjaCgnVEVYVEFSRUF8SU5QVVR8U0VMRUNUJykpIHtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDM3ICYmIF8ub3B0aW9ucy5hY2Nlc3NpYmlsaXR5ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBfLmNoYW5nZVNsaWRlKHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IF8ub3B0aW9ucy5ydGwgPT09IHRydWUgPyAnbmV4dCcgOiAgJ3ByZXZpb3VzJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleUNvZGUgPT09IDM5ICYmIF8ub3B0aW9ucy5hY2Nlc3NpYmlsaXR5ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBfLmNoYW5nZVNsaWRlKHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IF8ub3B0aW9ucy5ydGwgPT09IHRydWUgPyAncHJldmlvdXMnIDogJ25leHQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUubGF6eUxvYWQgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLFxyXG4gICAgICAgICAgICBsb2FkUmFuZ2UsIGNsb25lUmFuZ2UsIHJhbmdlU3RhcnQsIHJhbmdlRW5kO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2FkSW1hZ2VzKGltYWdlc1Njb3BlKSB7XHJcblxyXG4gICAgICAgICAgICAkKCdpbWdbZGF0YS1sYXp5XScsIGltYWdlc1Njb3BlKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpbWFnZSA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VTb3VyY2UgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtbGF6eScpLFxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlVG9Mb2FkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaW1hZ2VUb0xvYWQub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hbmltYXRlKHsgb3BhY2l0eTogMCB9LCAxMDAsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignc3JjJywgaW1hZ2VTb3VyY2UpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFuaW1hdGUoeyBvcGFjaXR5OiAxIH0sIDIwMCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQXR0cignZGF0YS1sYXp5JylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnc2xpY2stbG9hZGluZycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ2xhenlMb2FkZWQnLCBbXywgaW1hZ2UsIGltYWdlU291cmNlXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgaW1hZ2VUb0xvYWQub25lcnJvciA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpbWFnZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQXR0ciggJ2RhdGEtbGF6eScgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoICdzbGljay1sb2FkaW5nJyApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcyggJ3NsaWNrLWxhenlsb2FkLWVycm9yJyApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignbGF6eUxvYWRFcnJvcicsIFsgXywgaW1hZ2UsIGltYWdlU291cmNlIF0pO1xyXG5cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgaW1hZ2VUb0xvYWQuc3JjID0gaW1hZ2VTb3VyY2U7XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmFuZ2VTdGFydCA9IF8uY3VycmVudFNsaWRlICsgKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLyAyICsgMSk7XHJcbiAgICAgICAgICAgICAgICByYW5nZUVuZCA9IHJhbmdlU3RhcnQgKyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICsgMjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJhbmdlU3RhcnQgPSBNYXRoLm1heCgwLCBfLmN1cnJlbnRTbGlkZSAtIChfLm9wdGlvbnMuc2xpZGVzVG9TaG93IC8gMiArIDEpKTtcclxuICAgICAgICAgICAgICAgIHJhbmdlRW5kID0gMiArIChfLm9wdGlvbnMuc2xpZGVzVG9TaG93IC8gMiArIDEpICsgXy5jdXJyZW50U2xpZGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByYW5nZVN0YXJ0ID0gXy5vcHRpb25zLmluZmluaXRlID8gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyArIF8uY3VycmVudFNsaWRlIDogXy5jdXJyZW50U2xpZGU7XHJcbiAgICAgICAgICAgIHJhbmdlRW5kID0gTWF0aC5jZWlsKHJhbmdlU3RhcnQgKyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KTtcclxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmFuZ2VTdGFydCA+IDApIHJhbmdlU3RhcnQtLTtcclxuICAgICAgICAgICAgICAgIGlmIChyYW5nZUVuZCA8PSBfLnNsaWRlQ291bnQpIHJhbmdlRW5kKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxvYWRSYW5nZSA9IF8uJHNsaWRlci5maW5kKCcuc2xpY2stc2xpZGUnKS5zbGljZShyYW5nZVN0YXJ0LCByYW5nZUVuZCk7XHJcbiAgICAgICAgbG9hZEltYWdlcyhsb2FkUmFuZ2UpO1xyXG5cclxuICAgICAgICBpZiAoXy5zbGlkZUNvdW50IDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcclxuICAgICAgICAgICAgY2xvbmVSYW5nZSA9IF8uJHNsaWRlci5maW5kKCcuc2xpY2stc2xpZGUnKTtcclxuICAgICAgICAgICAgbG9hZEltYWdlcyhjbG9uZVJhbmdlKTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICBpZiAoXy5jdXJyZW50U2xpZGUgPj0gXy5zbGlkZUNvdW50IC0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG4gICAgICAgICAgICBjbG9uZVJhbmdlID0gXy4kc2xpZGVyLmZpbmQoJy5zbGljay1jbG9uZWQnKS5zbGljZSgwLCBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KTtcclxuICAgICAgICAgICAgbG9hZEltYWdlcyhjbG9uZVJhbmdlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKF8uY3VycmVudFNsaWRlID09PSAwKSB7XHJcbiAgICAgICAgICAgIGNsb25lUmFuZ2UgPSBfLiRzbGlkZXIuZmluZCgnLnNsaWNrLWNsb25lZCcpLnNsaWNlKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgKiAtMSk7XHJcbiAgICAgICAgICAgIGxvYWRJbWFnZXMoY2xvbmVSYW5nZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmxvYWRTbGlkZXIgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBfLnNldFBvc2l0aW9uKCk7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlVHJhY2suY3NzKHtcclxuICAgICAgICAgICAgb3BhY2l0eTogMVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBfLiRzbGlkZXIucmVtb3ZlQ2xhc3MoJ3NsaWNrLWxvYWRpbmcnKTtcclxuXHJcbiAgICAgICAgXy5pbml0VUkoKTtcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5sYXp5TG9hZCA9PT0gJ3Byb2dyZXNzaXZlJykge1xyXG4gICAgICAgICAgICBfLnByb2dyZXNzaXZlTGF6eUxvYWQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUubmV4dCA9IFNsaWNrLnByb3RvdHlwZS5zbGlja05leHQgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBfLmNoYW5nZVNsaWRlKHtcclxuICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ25leHQnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5vcmllbnRhdGlvbkNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIF8uY2hlY2tSZXNwb25zaXZlKCk7XHJcbiAgICAgICAgXy5zZXRQb3NpdGlvbigpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnBhdXNlID0gU2xpY2sucHJvdG90eXBlLnNsaWNrUGF1c2UgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBfLmF1dG9QbGF5Q2xlYXIoKTtcclxuICAgICAgICBfLnBhdXNlZCA9IHRydWU7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUucGxheSA9IFNsaWNrLnByb3RvdHlwZS5zbGlja1BsYXkgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBfLmF1dG9QbGF5KCk7XHJcbiAgICAgICAgXy5vcHRpb25zLmF1dG9wbGF5ID0gdHJ1ZTtcclxuICAgICAgICBfLnBhdXNlZCA9IGZhbHNlO1xyXG4gICAgICAgIF8uZm9jdXNzZWQgPSBmYWxzZTtcclxuICAgICAgICBfLmludGVycnVwdGVkID0gZmFsc2U7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUucG9zdFNsaWRlID0gZnVuY3Rpb24oaW5kZXgpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiggIV8udW5zbGlja2VkICkge1xyXG5cclxuICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ2FmdGVyQ2hhbmdlJywgW18sIGluZGV4XSk7XHJcblxyXG4gICAgICAgICAgICBfLmFuaW1hdGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgXy5zZXRQb3NpdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgXy5zd2lwZUxlZnQgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBfLm9wdGlvbnMuYXV0b3BsYXkgKSB7XHJcbiAgICAgICAgICAgICAgICBfLmF1dG9QbGF5KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuYWNjZXNzaWJpbGl0eSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgXy5pbml0QURBKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnByZXYgPSBTbGljay5wcm90b3R5cGUuc2xpY2tQcmV2ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgXy5jaGFuZ2VTbGlkZSh7XHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdwcmV2aW91cydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnByZXZlbnREZWZhdWx0ID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5wcm9ncmVzc2l2ZUxhenlMb2FkID0gZnVuY3Rpb24oIHRyeUNvdW50ICkge1xyXG5cclxuICAgICAgICB0cnlDb3VudCA9IHRyeUNvdW50IHx8IDE7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgJGltZ3NUb0xvYWQgPSAkKCAnaW1nW2RhdGEtbGF6eV0nLCBfLiRzbGlkZXIgKSxcclxuICAgICAgICAgICAgaW1hZ2UsXHJcbiAgICAgICAgICAgIGltYWdlU291cmNlLFxyXG4gICAgICAgICAgICBpbWFnZVRvTG9hZDtcclxuXHJcbiAgICAgICAgaWYgKCAkaW1nc1RvTG9hZC5sZW5ndGggKSB7XHJcblxyXG4gICAgICAgICAgICBpbWFnZSA9ICRpbWdzVG9Mb2FkLmZpcnN0KCk7XHJcbiAgICAgICAgICAgIGltYWdlU291cmNlID0gaW1hZ2UuYXR0cignZGF0YS1sYXp5Jyk7XHJcbiAgICAgICAgICAgIGltYWdlVG9Mb2FkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcblxyXG4gICAgICAgICAgICBpbWFnZVRvTG9hZC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpbWFnZVxyXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCAnc3JjJywgaW1hZ2VTb3VyY2UgKVxyXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCdkYXRhLWxhenknKVxyXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnc2xpY2stbG9hZGluZycpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggXy5vcHRpb25zLmFkYXB0aXZlSGVpZ2h0ID09PSB0cnVlICkge1xyXG4gICAgICAgICAgICAgICAgICAgIF8uc2V0UG9zaXRpb24oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignbGF6eUxvYWRlZCcsIFsgXywgaW1hZ2UsIGltYWdlU291cmNlIF0pO1xyXG4gICAgICAgICAgICAgICAgXy5wcm9ncmVzc2l2ZUxhenlMb2FkKCk7XHJcblxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaW1hZ2VUb0xvYWQub25lcnJvciA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggdHJ5Q291bnQgPCAzICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAgICAgKiB0cnkgdG8gbG9hZCB0aGUgaW1hZ2UgMyB0aW1lcyxcclxuICAgICAgICAgICAgICAgICAgICAgKiBsZWF2ZSBhIHNsaWdodCBkZWxheSBzbyB3ZSBkb24ndCBnZXRcclxuICAgICAgICAgICAgICAgICAgICAgKiBzZXJ2ZXJzIGJsb2NraW5nIHRoZSByZXF1ZXN0LlxyXG4gICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfLnByb2dyZXNzaXZlTGF6eUxvYWQoIHRyeUNvdW50ICsgMSApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIDUwMCApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVBdHRyKCAnZGF0YS1sYXp5JyApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcyggJ3NsaWNrLWxvYWRpbmcnIClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCAnc2xpY2stbGF6eWxvYWQtZXJyb3InICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdsYXp5TG9hZEVycm9yJywgWyBfLCBpbWFnZSwgaW1hZ2VTb3VyY2UgXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIF8ucHJvZ3Jlc3NpdmVMYXp5TG9hZCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpbWFnZVRvTG9hZC5zcmMgPSBpbWFnZVNvdXJjZTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdhbGxJbWFnZXNMb2FkZWQnLCBbIF8gXSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5yZWZyZXNoID0gZnVuY3Rpb24oIGluaXRpYWxpemluZyApIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLCBjdXJyZW50U2xpZGUsIGxhc3RWaXNpYmxlSW5kZXg7XHJcblxyXG4gICAgICAgIGxhc3RWaXNpYmxlSW5kZXggPSBfLnNsaWRlQ291bnQgLSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93O1xyXG5cclxuICAgICAgICAvLyBpbiBub24taW5maW5pdGUgc2xpZGVycywgd2UgZG9uJ3Qgd2FudCB0byBnbyBwYXN0IHRoZVxyXG4gICAgICAgIC8vIGxhc3QgdmlzaWJsZSBpbmRleC5cclxuICAgICAgICBpZiggIV8ub3B0aW9ucy5pbmZpbml0ZSAmJiAoIF8uY3VycmVudFNsaWRlID4gbGFzdFZpc2libGVJbmRleCApKSB7XHJcbiAgICAgICAgICAgIF8uY3VycmVudFNsaWRlID0gbGFzdFZpc2libGVJbmRleDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGlmIGxlc3Mgc2xpZGVzIHRoYW4gdG8gc2hvdywgZ28gdG8gc3RhcnQuXHJcbiAgICAgICAgaWYgKCBfLnNsaWRlQ291bnQgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyApIHtcclxuICAgICAgICAgICAgXy5jdXJyZW50U2xpZGUgPSAwO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGN1cnJlbnRTbGlkZSA9IF8uY3VycmVudFNsaWRlO1xyXG5cclxuICAgICAgICBfLmRlc3Ryb3kodHJ1ZSk7XHJcblxyXG4gICAgICAgICQuZXh0ZW5kKF8sIF8uaW5pdGlhbHMsIHsgY3VycmVudFNsaWRlOiBjdXJyZW50U2xpZGUgfSk7XHJcblxyXG4gICAgICAgIF8uaW5pdCgpO1xyXG5cclxuICAgICAgICBpZiggIWluaXRpYWxpemluZyApIHtcclxuXHJcbiAgICAgICAgICAgIF8uY2hhbmdlU2xpZGUoe1xyXG4gICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdpbmRleCcsXHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXg6IGN1cnJlbnRTbGlkZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCBmYWxzZSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5yZWdpc3RlckJyZWFrcG9pbnRzID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcywgYnJlYWtwb2ludCwgY3VycmVudEJyZWFrcG9pbnQsIGwsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmVTZXR0aW5ncyA9IF8ub3B0aW9ucy5yZXNwb25zaXZlIHx8IG51bGw7XHJcblxyXG4gICAgICAgIGlmICggJC50eXBlKHJlc3BvbnNpdmVTZXR0aW5ncykgPT09ICdhcnJheScgJiYgcmVzcG9uc2l2ZVNldHRpbmdzLmxlbmd0aCApIHtcclxuXHJcbiAgICAgICAgICAgIF8ucmVzcG9uZFRvID0gXy5vcHRpb25zLnJlc3BvbmRUbyB8fCAnd2luZG93JztcclxuXHJcbiAgICAgICAgICAgIGZvciAoIGJyZWFrcG9pbnQgaW4gcmVzcG9uc2l2ZVNldHRpbmdzICkge1xyXG5cclxuICAgICAgICAgICAgICAgIGwgPSBfLmJyZWFrcG9pbnRzLmxlbmd0aC0xO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudEJyZWFrcG9pbnQgPSByZXNwb25zaXZlU2V0dGluZ3NbYnJlYWtwb2ludF0uYnJlYWtwb2ludDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2l2ZVNldHRpbmdzLmhhc093blByb3BlcnR5KGJyZWFrcG9pbnQpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgYnJlYWtwb2ludHMgYW5kIGN1dCBvdXQgYW55IGV4aXN0aW5nXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gb25lcyB3aXRoIHRoZSBzYW1lIGJyZWFrcG9pbnQgbnVtYmVyLCB3ZSBkb24ndCB3YW50IGR1cGVzLlxyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlKCBsID49IDAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBfLmJyZWFrcG9pbnRzW2xdICYmIF8uYnJlYWtwb2ludHNbbF0gPT09IGN1cnJlbnRCcmVha3BvaW50ICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5icmVha3BvaW50cy5zcGxpY2UobCwxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsLS07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBfLmJyZWFrcG9pbnRzLnB1c2goY3VycmVudEJyZWFrcG9pbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8uYnJlYWtwb2ludFNldHRpbmdzW2N1cnJlbnRCcmVha3BvaW50XSA9IHJlc3BvbnNpdmVTZXR0aW5nc1ticmVha3BvaW50XS5zZXR0aW5ncztcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBfLmJyZWFrcG9pbnRzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICggXy5vcHRpb25zLm1vYmlsZUZpcnN0ICkgPyBhLWIgOiBiLWE7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUucmVpbml0ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgXy4kc2xpZGVzID1cclxuICAgICAgICAgICAgXy4kc2xpZGVUcmFja1xyXG4gICAgICAgICAgICAgICAgLmNoaWxkcmVuKF8ub3B0aW9ucy5zbGlkZSlcclxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stc2xpZGUnKTtcclxuXHJcbiAgICAgICAgXy5zbGlkZUNvdW50ID0gXy4kc2xpZGVzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgaWYgKF8uY3VycmVudFNsaWRlID49IF8uc2xpZGVDb3VudCAmJiBfLmN1cnJlbnRTbGlkZSAhPT0gMCkge1xyXG4gICAgICAgICAgICBfLmN1cnJlbnRTbGlkZSA9IF8uY3VycmVudFNsaWRlIC0gXy5vcHRpb25zLnNsaWRlc1RvU2Nyb2xsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8uc2xpZGVDb3VudCA8PSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KSB7XHJcbiAgICAgICAgICAgIF8uY3VycmVudFNsaWRlID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF8ucmVnaXN0ZXJCcmVha3BvaW50cygpO1xyXG5cclxuICAgICAgICBfLnNldFByb3BzKCk7XHJcbiAgICAgICAgXy5zZXR1cEluZmluaXRlKCk7XHJcbiAgICAgICAgXy5idWlsZEFycm93cygpO1xyXG4gICAgICAgIF8udXBkYXRlQXJyb3dzKCk7XHJcbiAgICAgICAgXy5pbml0QXJyb3dFdmVudHMoKTtcclxuICAgICAgICBfLmJ1aWxkRG90cygpO1xyXG4gICAgICAgIF8udXBkYXRlRG90cygpO1xyXG4gICAgICAgIF8uaW5pdERvdEV2ZW50cygpO1xyXG4gICAgICAgIF8uY2xlYW5VcFNsaWRlRXZlbnRzKCk7XHJcbiAgICAgICAgXy5pbml0U2xpZGVFdmVudHMoKTtcclxuXHJcbiAgICAgICAgXy5jaGVja1Jlc3BvbnNpdmUoZmFsc2UsIHRydWUpO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmZvY3VzT25TZWxlY3QgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgJChfLiRzbGlkZVRyYWNrKS5jaGlsZHJlbigpLm9uKCdjbGljay5zbGljaycsIF8uc2VsZWN0SGFuZGxlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfLnNldFNsaWRlQ2xhc3Nlcyh0eXBlb2YgXy5jdXJyZW50U2xpZGUgPT09ICdudW1iZXInID8gXy5jdXJyZW50U2xpZGUgOiAwKTtcclxuXHJcbiAgICAgICAgXy5zZXRQb3NpdGlvbigpO1xyXG4gICAgICAgIF8uZm9jdXNIYW5kbGVyKCk7XHJcblxyXG4gICAgICAgIF8ucGF1c2VkID0gIV8ub3B0aW9ucy5hdXRvcGxheTtcclxuICAgICAgICBfLmF1dG9QbGF5KCk7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdyZUluaXQnLCBbX10pO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSAhPT0gXy53aW5kb3dXaWR0aCkge1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoXy53aW5kb3dEZWxheSk7XHJcbiAgICAgICAgICAgIF8ud2luZG93RGVsYXkgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIF8ud2luZG93V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuICAgICAgICAgICAgICAgIF8uY2hlY2tSZXNwb25zaXZlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiggIV8udW5zbGlja2VkICkgeyBfLnNldFBvc2l0aW9uKCk7IH1cclxuICAgICAgICAgICAgfSwgNTApO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnJlbW92ZVNsaWRlID0gU2xpY2sucHJvdG90eXBlLnNsaWNrUmVtb3ZlID0gZnVuY3Rpb24oaW5kZXgsIHJlbW92ZUJlZm9yZSwgcmVtb3ZlQWxsKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZihpbmRleCkgPT09ICdib29sZWFuJykge1xyXG4gICAgICAgICAgICByZW1vdmVCZWZvcmUgPSBpbmRleDtcclxuICAgICAgICAgICAgaW5kZXggPSByZW1vdmVCZWZvcmUgPT09IHRydWUgPyAwIDogXy5zbGlkZUNvdW50IC0gMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpbmRleCA9IHJlbW92ZUJlZm9yZSA9PT0gdHJ1ZSA/IC0taW5kZXggOiBpbmRleDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfLnNsaWRlQ291bnQgPCAxIHx8IGluZGV4IDwgMCB8fCBpbmRleCA+IF8uc2xpZGVDb3VudCAtIDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy51bmxvYWQoKTtcclxuXHJcbiAgICAgICAgaWYgKHJlbW92ZUFsbCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKCkucmVtb3ZlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmVxKGluZGV4KS5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF8uJHNsaWRlcyA9IF8uJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKTtcclxuXHJcbiAgICAgICAgXy4kc2xpZGVUcmFjay5jaGlsZHJlbih0aGlzLm9wdGlvbnMuc2xpZGUpLmRldGFjaCgpO1xyXG5cclxuICAgICAgICBfLiRzbGlkZVRyYWNrLmFwcGVuZChfLiRzbGlkZXMpO1xyXG5cclxuICAgICAgICBfLiRzbGlkZXNDYWNoZSA9IF8uJHNsaWRlcztcclxuXHJcbiAgICAgICAgXy5yZWluaXQoKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5zZXRDU1MgPSBmdW5jdGlvbihwb3NpdGlvbikge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgIHBvc2l0aW9uUHJvcHMgPSB7fSxcclxuICAgICAgICAgICAgeCwgeTtcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5ydGwgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgcG9zaXRpb24gPSAtcG9zaXRpb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHggPSBfLnBvc2l0aW9uUHJvcCA9PSAnbGVmdCcgPyBNYXRoLmNlaWwocG9zaXRpb24pICsgJ3B4JyA6ICcwcHgnO1xyXG4gICAgICAgIHkgPSBfLnBvc2l0aW9uUHJvcCA9PSAndG9wJyA/IE1hdGguY2VpbChwb3NpdGlvbikgKyAncHgnIDogJzBweCc7XHJcblxyXG4gICAgICAgIHBvc2l0aW9uUHJvcHNbXy5wb3NpdGlvblByb3BdID0gcG9zaXRpb247XHJcblxyXG4gICAgICAgIGlmIChfLnRyYW5zZm9ybXNFbmFibGVkID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNzcyhwb3NpdGlvblByb3BzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBwb3NpdGlvblByb3BzID0ge307XHJcbiAgICAgICAgICAgIGlmIChfLmNzc1RyYW5zaXRpb25zID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb25Qcm9wc1tfLmFuaW1UeXBlXSA9ICd0cmFuc2xhdGUoJyArIHggKyAnLCAnICsgeSArICcpJztcclxuICAgICAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY3NzKHBvc2l0aW9uUHJvcHMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb25Qcm9wc1tfLmFuaW1UeXBlXSA9ICd0cmFuc2xhdGUzZCgnICsgeCArICcsICcgKyB5ICsgJywgMHB4KSc7XHJcbiAgICAgICAgICAgICAgICBfLiRzbGlkZVRyYWNrLmNzcyhwb3NpdGlvblByb3BzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5zZXREaW1lbnNpb25zID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBfLiRsaXN0LmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogKCcwcHggJyArIF8ub3B0aW9ucy5jZW50ZXJQYWRkaW5nKVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBfLiRsaXN0LmhlaWdodChfLiRzbGlkZXMuZmlyc3QoKS5vdXRlckhlaWdodCh0cnVlKSAqIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpO1xyXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIF8uJGxpc3QuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAoXy5vcHRpb25zLmNlbnRlclBhZGRpbmcgKyAnIDBweCcpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy5saXN0V2lkdGggPSBfLiRsaXN0LndpZHRoKCk7XHJcbiAgICAgICAgXy5saXN0SGVpZ2h0ID0gXy4kbGlzdC5oZWlnaHQoKTtcclxuXHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWwgPT09IGZhbHNlICYmIF8ub3B0aW9ucy52YXJpYWJsZVdpZHRoID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBfLnNsaWRlV2lkdGggPSBNYXRoLmNlaWwoXy5saXN0V2lkdGggLyBfLm9wdGlvbnMuc2xpZGVzVG9TaG93KTtcclxuICAgICAgICAgICAgXy4kc2xpZGVUcmFjay53aWR0aChNYXRoLmNlaWwoKF8uc2xpZGVXaWR0aCAqIF8uJHNsaWRlVHJhY2suY2hpbGRyZW4oJy5zbGljay1zbGlkZScpLmxlbmd0aCkpKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmIChfLm9wdGlvbnMudmFyaWFibGVXaWR0aCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBfLiRzbGlkZVRyYWNrLndpZHRoKDUwMDAgKiBfLnNsaWRlQ291bnQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIF8uc2xpZGVXaWR0aCA9IE1hdGguY2VpbChfLmxpc3RXaWR0aCk7XHJcbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suaGVpZ2h0KE1hdGguY2VpbCgoXy4kc2xpZGVzLmZpcnN0KCkub3V0ZXJIZWlnaHQodHJ1ZSkgKiBfLiRzbGlkZVRyYWNrLmNoaWxkcmVuKCcuc2xpY2stc2xpZGUnKS5sZW5ndGgpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgb2Zmc2V0ID0gXy4kc2xpZGVzLmZpcnN0KCkub3V0ZXJXaWR0aCh0cnVlKSAtIF8uJHNsaWRlcy5maXJzdCgpLndpZHRoKCk7XHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy52YXJpYWJsZVdpZHRoID09PSBmYWxzZSkgXy4kc2xpZGVUcmFjay5jaGlsZHJlbignLnNsaWNrLXNsaWRlJykud2lkdGgoXy5zbGlkZVdpZHRoIC0gb2Zmc2V0KTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5zZXRGYWRlID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgdGFyZ2V0TGVmdDtcclxuXHJcbiAgICAgICAgXy4kc2xpZGVzLmVhY2goZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdGFyZ2V0TGVmdCA9IChfLnNsaWRlV2lkdGggKiBpbmRleCkgKiAtMTtcclxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5ydGwgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICQoZWxlbWVudCkuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcclxuICAgICAgICAgICAgICAgICAgICByaWdodDogdGFyZ2V0TGVmdCxcclxuICAgICAgICAgICAgICAgICAgICB0b3A6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgekluZGV4OiBfLm9wdGlvbnMuekluZGV4IC0gMixcclxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoZWxlbWVudCkuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0OiB0YXJnZXRMZWZ0LFxyXG4gICAgICAgICAgICAgICAgICAgIHRvcDogMCxcclxuICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IF8ub3B0aW9ucy56SW5kZXggLSAyLFxyXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlcy5lcShfLmN1cnJlbnRTbGlkZSkuY3NzKHtcclxuICAgICAgICAgICAgekluZGV4OiBfLm9wdGlvbnMuekluZGV4IC0gMSxcclxuICAgICAgICAgICAgb3BhY2l0eTogMVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnNldEhlaWdodCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuc2xpZGVzVG9TaG93ID09PSAxICYmIF8ub3B0aW9ucy5hZGFwdGl2ZUhlaWdodCA9PT0gdHJ1ZSAmJiBfLm9wdGlvbnMudmVydGljYWwgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXRIZWlnaHQgPSBfLiRzbGlkZXMuZXEoXy5jdXJyZW50U2xpZGUpLm91dGVySGVpZ2h0KHRydWUpO1xyXG4gICAgICAgICAgICBfLiRsaXN0LmNzcygnaGVpZ2h0JywgdGFyZ2V0SGVpZ2h0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuc2V0T3B0aW9uID1cclxuICAgIFNsaWNrLnByb3RvdHlwZS5zbGlja1NldE9wdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBhY2NlcHRzIGFyZ3VtZW50cyBpbiBmb3JtYXQgb2Y6XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiAgLSBmb3IgY2hhbmdpbmcgYSBzaW5nbGUgb3B0aW9uJ3MgdmFsdWU6XHJcbiAgICAgICAgICogICAgIC5zbGljayhcInNldE9wdGlvblwiLCBvcHRpb24sIHZhbHVlLCByZWZyZXNoIClcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqICAtIGZvciBjaGFuZ2luZyBhIHNldCBvZiByZXNwb25zaXZlIG9wdGlvbnM6XHJcbiAgICAgICAgICogICAgIC5zbGljayhcInNldE9wdGlvblwiLCAncmVzcG9uc2l2ZScsIFt7fSwgLi4uXSwgcmVmcmVzaCApXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiAgLSBmb3IgdXBkYXRpbmcgbXVsdGlwbGUgdmFsdWVzIGF0IG9uY2UgKG5vdCByZXNwb25zaXZlKVxyXG4gICAgICAgICAqICAgICAuc2xpY2soXCJzZXRPcHRpb25cIiwgeyAnb3B0aW9uJzogdmFsdWUsIC4uLiB9LCByZWZyZXNoIClcclxuICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLCBsLCBpdGVtLCBvcHRpb24sIHZhbHVlLCByZWZyZXNoID0gZmFsc2UsIHR5cGU7XHJcblxyXG4gICAgICAgIGlmKCAkLnR5cGUoIGFyZ3VtZW50c1swXSApID09PSAnb2JqZWN0JyApIHtcclxuXHJcbiAgICAgICAgICAgIG9wdGlvbiA9ICBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHJlZnJlc2ggPSBhcmd1bWVudHNbMV07XHJcbiAgICAgICAgICAgIHR5cGUgPSAnbXVsdGlwbGUnO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKCAkLnR5cGUoIGFyZ3VtZW50c1swXSApID09PSAnc3RyaW5nJyApIHtcclxuXHJcbiAgICAgICAgICAgIG9wdGlvbiA9ICBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIHZhbHVlID0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgICAgICByZWZyZXNoID0gYXJndW1lbnRzWzJdO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBhcmd1bWVudHNbMF0gPT09ICdyZXNwb25zaXZlJyAmJiAkLnR5cGUoIGFyZ3VtZW50c1sxXSApID09PSAnYXJyYXknICkge1xyXG5cclxuICAgICAgICAgICAgICAgIHR5cGUgPSAncmVzcG9uc2l2ZSc7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlb2YgYXJndW1lbnRzWzFdICE9PSAndW5kZWZpbmVkJyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICB0eXBlID0gJ3NpbmdsZSc7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCB0eXBlID09PSAnc2luZ2xlJyApIHtcclxuXHJcbiAgICAgICAgICAgIF8ub3B0aW9uc1tvcHRpb25dID0gdmFsdWU7XHJcblxyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKCB0eXBlID09PSAnbXVsdGlwbGUnICkge1xyXG5cclxuICAgICAgICAgICAgJC5lYWNoKCBvcHRpb24gLCBmdW5jdGlvbiggb3B0LCB2YWwgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgXy5vcHRpb25zW29wdF0gPSB2YWw7XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAoIHR5cGUgPT09ICdyZXNwb25zaXZlJyApIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAoIGl0ZW0gaW4gdmFsdWUgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoICQudHlwZSggXy5vcHRpb25zLnJlc3BvbnNpdmUgKSAhPT0gJ2FycmF5JyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgXy5vcHRpb25zLnJlc3BvbnNpdmUgPSBbIHZhbHVlW2l0ZW1dIF07XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbCA9IF8ub3B0aW9ucy5yZXNwb25zaXZlLmxlbmd0aC0xO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIHJlc3BvbnNpdmUgb2JqZWN0IGFuZCBzcGxpY2Ugb3V0IGR1cGxpY2F0ZXMuXHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUoIGwgPj0gMCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBfLm9wdGlvbnMucmVzcG9uc2l2ZVtsXS5icmVha3BvaW50ID09PSB2YWx1ZVtpdGVtXS5icmVha3BvaW50ICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8ub3B0aW9ucy5yZXNwb25zaXZlLnNwbGljZShsLDEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgbC0tO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIF8ub3B0aW9ucy5yZXNwb25zaXZlLnB1c2goIHZhbHVlW2l0ZW1dICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggcmVmcmVzaCApIHtcclxuXHJcbiAgICAgICAgICAgIF8udW5sb2FkKCk7XHJcbiAgICAgICAgICAgIF8ucmVpbml0KCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5zZXRQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIF8uc2V0RGltZW5zaW9ucygpO1xyXG5cclxuICAgICAgICBfLnNldEhlaWdodCgpO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIF8uc2V0Q1NTKF8uZ2V0TGVmdChfLmN1cnJlbnRTbGlkZSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIF8uc2V0RmFkZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ3NldFBvc2l0aW9uJywgW19dKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5zZXRQcm9wcyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgIGJvZHlTdHlsZSA9IGRvY3VtZW50LmJvZHkuc3R5bGU7XHJcblxyXG4gICAgICAgIF8ucG9zaXRpb25Qcm9wID0gXy5vcHRpb25zLnZlcnRpY2FsID09PSB0cnVlID8gJ3RvcCcgOiAnbGVmdCc7XHJcblxyXG4gICAgICAgIGlmIChfLnBvc2l0aW9uUHJvcCA9PT0gJ3RvcCcpIHtcclxuICAgICAgICAgICAgXy4kc2xpZGVyLmFkZENsYXNzKCdzbGljay12ZXJ0aWNhbCcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIF8uJHNsaWRlci5yZW1vdmVDbGFzcygnc2xpY2stdmVydGljYWwnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChib2R5U3R5bGUuV2Via2l0VHJhbnNpdGlvbiAhPT0gdW5kZWZpbmVkIHx8XHJcbiAgICAgICAgICAgIGJvZHlTdHlsZS5Nb3pUcmFuc2l0aW9uICE9PSB1bmRlZmluZWQgfHxcclxuICAgICAgICAgICAgYm9keVN0eWxlLm1zVHJhbnNpdGlvbiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmIChfLm9wdGlvbnMudXNlQ1NTID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBfLmNzc1RyYW5zaXRpb25zID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCBfLm9wdGlvbnMuZmFkZSApIHtcclxuICAgICAgICAgICAgaWYgKCB0eXBlb2YgXy5vcHRpb25zLnpJbmRleCA9PT0gJ251bWJlcicgKSB7XHJcbiAgICAgICAgICAgICAgICBpZiggXy5vcHRpb25zLnpJbmRleCA8IDMgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5vcHRpb25zLnpJbmRleCA9IDM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBfLm9wdGlvbnMuekluZGV4ID0gXy5kZWZhdWx0cy56SW5kZXg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChib2R5U3R5bGUuT1RyYW5zZm9ybSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIF8uYW5pbVR5cGUgPSAnT1RyYW5zZm9ybSc7XHJcbiAgICAgICAgICAgIF8udHJhbnNmb3JtVHlwZSA9ICctby10cmFuc2Zvcm0nO1xyXG4gICAgICAgICAgICBfLnRyYW5zaXRpb25UeXBlID0gJ09UcmFuc2l0aW9uJztcclxuICAgICAgICAgICAgaWYgKGJvZHlTdHlsZS5wZXJzcGVjdGl2ZVByb3BlcnR5ID09PSB1bmRlZmluZWQgJiYgYm9keVN0eWxlLndlYmtpdFBlcnNwZWN0aXZlID09PSB1bmRlZmluZWQpIF8uYW5pbVR5cGUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGJvZHlTdHlsZS5Nb3pUcmFuc2Zvcm0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBfLmFuaW1UeXBlID0gJ01velRyYW5zZm9ybSc7XHJcbiAgICAgICAgICAgIF8udHJhbnNmb3JtVHlwZSA9ICctbW96LXRyYW5zZm9ybSc7XHJcbiAgICAgICAgICAgIF8udHJhbnNpdGlvblR5cGUgPSAnTW96VHJhbnNpdGlvbic7XHJcbiAgICAgICAgICAgIGlmIChib2R5U3R5bGUucGVyc3BlY3RpdmVQcm9wZXJ0eSA9PT0gdW5kZWZpbmVkICYmIGJvZHlTdHlsZS5Nb3pQZXJzcGVjdGl2ZSA9PT0gdW5kZWZpbmVkKSBfLmFuaW1UeXBlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChib2R5U3R5bGUud2Via2l0VHJhbnNmb3JtICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgXy5hbmltVHlwZSA9ICd3ZWJraXRUcmFuc2Zvcm0nO1xyXG4gICAgICAgICAgICBfLnRyYW5zZm9ybVR5cGUgPSAnLXdlYmtpdC10cmFuc2Zvcm0nO1xyXG4gICAgICAgICAgICBfLnRyYW5zaXRpb25UeXBlID0gJ3dlYmtpdFRyYW5zaXRpb24nO1xyXG4gICAgICAgICAgICBpZiAoYm9keVN0eWxlLnBlcnNwZWN0aXZlUHJvcGVydHkgPT09IHVuZGVmaW5lZCAmJiBib2R5U3R5bGUud2Via2l0UGVyc3BlY3RpdmUgPT09IHVuZGVmaW5lZCkgXy5hbmltVHlwZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYm9keVN0eWxlLm1zVHJhbnNmb3JtICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgXy5hbmltVHlwZSA9ICdtc1RyYW5zZm9ybSc7XHJcbiAgICAgICAgICAgIF8udHJhbnNmb3JtVHlwZSA9ICctbXMtdHJhbnNmb3JtJztcclxuICAgICAgICAgICAgXy50cmFuc2l0aW9uVHlwZSA9ICdtc1RyYW5zaXRpb24nO1xyXG4gICAgICAgICAgICBpZiAoYm9keVN0eWxlLm1zVHJhbnNmb3JtID09PSB1bmRlZmluZWQpIF8uYW5pbVR5cGUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGJvZHlTdHlsZS50cmFuc2Zvcm0gIT09IHVuZGVmaW5lZCAmJiBfLmFuaW1UeXBlICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBfLmFuaW1UeXBlID0gJ3RyYW5zZm9ybSc7XHJcbiAgICAgICAgICAgIF8udHJhbnNmb3JtVHlwZSA9ICd0cmFuc2Zvcm0nO1xyXG4gICAgICAgICAgICBfLnRyYW5zaXRpb25UeXBlID0gJ3RyYW5zaXRpb24nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBfLnRyYW5zZm9ybXNFbmFibGVkID0gXy5vcHRpb25zLnVzZVRyYW5zZm9ybSAmJiAoXy5hbmltVHlwZSAhPT0gbnVsbCAmJiBfLmFuaW1UeXBlICE9PSBmYWxzZSk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuc2V0U2xpZGVDbGFzc2VzID0gZnVuY3Rpb24oaW5kZXgpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLFxyXG4gICAgICAgICAgICBjZW50ZXJPZmZzZXQsIGFsbFNsaWRlcywgaW5kZXhPZmZzZXQsIHJlbWFpbmRlcjtcclxuXHJcbiAgICAgICAgYWxsU2xpZGVzID0gXy4kc2xpZGVyXHJcbiAgICAgICAgICAgIC5maW5kKCcuc2xpY2stc2xpZGUnKVxyXG4gICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ3NsaWNrLWFjdGl2ZSBzbGljay1jZW50ZXIgc2xpY2stY3VycmVudCcpXHJcbiAgICAgICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcblxyXG4gICAgICAgIF8uJHNsaWRlc1xyXG4gICAgICAgICAgICAuZXEoaW5kZXgpXHJcbiAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stY3VycmVudCcpO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgICAgIGNlbnRlck9mZnNldCA9IE1hdGguZmxvb3IoXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAvIDIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA+PSBjZW50ZXJPZmZzZXQgJiYgaW5kZXggPD0gKF8uc2xpZGVDb3VudCAtIDEpIC0gY2VudGVyT2Zmc2V0KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIF8uJHNsaWRlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc2xpY2UoaW5kZXggLSBjZW50ZXJPZmZzZXQsIGluZGV4ICsgY2VudGVyT2Zmc2V0ICsgMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1hY3RpdmUnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpbmRleE9mZnNldCA9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgKyBpbmRleDtcclxuICAgICAgICAgICAgICAgICAgICBhbGxTbGlkZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnNsaWNlKGluZGV4T2Zmc2V0IC0gY2VudGVyT2Zmc2V0ICsgMSwgaW5kZXhPZmZzZXQgKyBjZW50ZXJPZmZzZXQgKyAyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWFjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYWxsU2xpZGVzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5lcShhbGxTbGlkZXMubGVuZ3RoIC0gMSAtIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stY2VudGVyJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbmRleCA9PT0gXy5zbGlkZUNvdW50IC0gMSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBhbGxTbGlkZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmVxKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stY2VudGVyJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgXy4kc2xpZGVzXHJcbiAgICAgICAgICAgICAgICAuZXEoaW5kZXgpXHJcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWNlbnRlcicpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgaWYgKGluZGV4ID49IDAgJiYgaW5kZXggPD0gKF8uc2xpZGVDb3VudCAtIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgXy4kc2xpZGVzXHJcbiAgICAgICAgICAgICAgICAgICAgLnNsaWNlKGluZGV4LCBpbmRleCArIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpXHJcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1hY3RpdmUnKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICdmYWxzZScpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChhbGxTbGlkZXMubGVuZ3RoIDw9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBhbGxTbGlkZXNcclxuICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ3NsaWNrLWFjdGl2ZScpXHJcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIHJlbWFpbmRlciA9IF8uc2xpZGVDb3VudCAlIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3c7XHJcbiAgICAgICAgICAgICAgICBpbmRleE9mZnNldCA9IF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gdHJ1ZSA/IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgKyBpbmRleCA6IGluZGV4O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuc2xpZGVzVG9TaG93ID09IF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCAmJiAoXy5zbGlkZUNvdW50IC0gaW5kZXgpIDwgXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBhbGxTbGlkZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnNsaWNlKGluZGV4T2Zmc2V0IC0gKF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cgLSByZW1haW5kZXIpLCBpbmRleE9mZnNldCArIHJlbWFpbmRlcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1hY3RpdmUnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBhbGxTbGlkZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnNsaWNlKGluZGV4T2Zmc2V0LCBpbmRleE9mZnNldCArIF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnc2xpY2stYWN0aXZlJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMubGF6eUxvYWQgPT09ICdvbmRlbWFuZCcpIHtcclxuICAgICAgICAgICAgXy5sYXp5TG9hZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5zZXR1cEluZmluaXRlID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcyxcclxuICAgICAgICAgICAgaSwgc2xpZGVJbmRleCwgaW5maW5pdGVDb3VudDtcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIF8ub3B0aW9ucy5jZW50ZXJNb2RlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmluZmluaXRlID09PSB0cnVlICYmIF8ub3B0aW9ucy5mYWRlID09PSBmYWxzZSkge1xyXG5cclxuICAgICAgICAgICAgc2xpZGVJbmRleCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpZiAoXy5zbGlkZUNvdW50ID4gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZmluaXRlQ291bnQgPSBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICsgMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5maW5pdGVDb3VudCA9IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3c7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gXy5zbGlkZUNvdW50OyBpID4gKF8uc2xpZGVDb3VudCAtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZmluaXRlQ291bnQpOyBpIC09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZUluZGV4ID0gaSAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgJChfLiRzbGlkZXNbc2xpZGVJbmRleF0pLmNsb25lKHRydWUpLmF0dHIoJ2lkJywgJycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXNsaWNrLWluZGV4Jywgc2xpZGVJbmRleCAtIF8uc2xpZGVDb3VudClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnByZXBlbmRUbyhfLiRzbGlkZVRyYWNrKS5hZGRDbGFzcygnc2xpY2stY2xvbmVkJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaW5maW5pdGVDb3VudDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVJbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgJChfLiRzbGlkZXNbc2xpZGVJbmRleF0pLmNsb25lKHRydWUpLmF0dHIoJ2lkJywgJycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXNsaWNrLWluZGV4Jywgc2xpZGVJbmRleCArIF8uc2xpZGVDb3VudClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKF8uJHNsaWRlVHJhY2spLmFkZENsYXNzKCdzbGljay1jbG9uZWQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suZmluZCgnLnNsaWNrLWNsb25lZCcpLmZpbmQoJ1tpZF0nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cignaWQnLCAnJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLmludGVycnVwdCA9IGZ1bmN0aW9uKCB0b2dnbGUgKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYoICF0b2dnbGUgKSB7XHJcbiAgICAgICAgICAgIF8uYXV0b1BsYXkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXy5pbnRlcnJ1cHRlZCA9IHRvZ2dsZTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5zZWxlY3RIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgdGFyZ2V0RWxlbWVudCA9XHJcbiAgICAgICAgICAgICQoZXZlbnQudGFyZ2V0KS5pcygnLnNsaWNrLXNsaWRlJykgP1xyXG4gICAgICAgICAgICAgICAgJChldmVudC50YXJnZXQpIDpcclxuICAgICAgICAgICAgICAgICQoZXZlbnQudGFyZ2V0KS5wYXJlbnRzKCcuc2xpY2stc2xpZGUnKTtcclxuXHJcbiAgICAgICAgdmFyIGluZGV4ID0gcGFyc2VJbnQodGFyZ2V0RWxlbWVudC5hdHRyKCdkYXRhLXNsaWNrLWluZGV4JykpO1xyXG5cclxuICAgICAgICBpZiAoIWluZGV4KSBpbmRleCA9IDA7XHJcblxyXG4gICAgICAgIGlmIChfLnNsaWRlQ291bnQgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG5cclxuICAgICAgICAgICAgXy5zZXRTbGlkZUNsYXNzZXMoaW5kZXgpO1xyXG4gICAgICAgICAgICBfLmFzTmF2Rm9yKGluZGV4KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF8uc2xpZGVIYW5kbGVyKGluZGV4KTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS5zbGlkZUhhbmRsZXIgPSBmdW5jdGlvbihpbmRleCwgc3luYywgZG9udEFuaW1hdGUpIHtcclxuXHJcbiAgICAgICAgdmFyIHRhcmdldFNsaWRlLCBhbmltU2xpZGUsIG9sZFNsaWRlLCBzbGlkZUxlZnQsIHRhcmdldExlZnQgPSBudWxsLFxyXG4gICAgICAgICAgICBfID0gdGhpcywgbmF2VGFyZ2V0O1xyXG5cclxuICAgICAgICBzeW5jID0gc3luYyB8fCBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKF8uYW5pbWF0aW5nID09PSB0cnVlICYmIF8ub3B0aW9ucy53YWl0Rm9yQW5pbWF0ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IHRydWUgJiYgXy5jdXJyZW50U2xpZGUgPT09IGluZGV4KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfLnNsaWRlQ291bnQgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc3luYyA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgXy5hc05hdkZvcihpbmRleCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0YXJnZXRTbGlkZSA9IGluZGV4O1xyXG4gICAgICAgIHRhcmdldExlZnQgPSBfLmdldExlZnQodGFyZ2V0U2xpZGUpO1xyXG4gICAgICAgIHNsaWRlTGVmdCA9IF8uZ2V0TGVmdChfLmN1cnJlbnRTbGlkZSk7XHJcblxyXG4gICAgICAgIF8uY3VycmVudExlZnQgPSBfLnN3aXBlTGVmdCA9PT0gbnVsbCA/IHNsaWRlTGVmdCA6IF8uc3dpcGVMZWZ0O1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmluZmluaXRlID09PSBmYWxzZSAmJiBfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gZmFsc2UgJiYgKGluZGV4IDwgMCB8fCBpbmRleCA+IF8uZ2V0RG90Q291bnQoKSAqIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCkpIHtcclxuICAgICAgICAgICAgaWYgKF8ub3B0aW9ucy5mYWRlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0U2xpZGUgPSBfLmN1cnJlbnRTbGlkZTtcclxuICAgICAgICAgICAgICAgIGlmIChkb250QW5pbWF0ZSAhPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIF8uYW5pbWF0ZVNsaWRlKHNsaWRlTGVmdCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8ucG9zdFNsaWRlKHRhcmdldFNsaWRlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5wb3N0U2xpZGUodGFyZ2V0U2xpZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2UgaWYgKF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gZmFsc2UgJiYgXy5vcHRpb25zLmNlbnRlck1vZGUgPT09IHRydWUgJiYgKGluZGV4IDwgMCB8fCBpbmRleCA+IChfLnNsaWRlQ291bnQgLSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpKSkge1xyXG4gICAgICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRTbGlkZSA9IF8uY3VycmVudFNsaWRlO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRvbnRBbmltYXRlICE9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5hbmltYXRlU2xpZGUoc2xpZGVMZWZ0LCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXy5wb3N0U2xpZGUodGFyZ2V0U2xpZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBfLnBvc3RTbGlkZSh0YXJnZXRTbGlkZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCBfLm9wdGlvbnMuYXV0b3BsYXkgKSB7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoXy5hdXRvUGxheVRpbWVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0YXJnZXRTbGlkZSA8IDApIHtcclxuICAgICAgICAgICAgaWYgKF8uc2xpZGVDb3VudCAlIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgYW5pbVNsaWRlID0gXy5zbGlkZUNvdW50IC0gKF8uc2xpZGVDb3VudCAlIF8ub3B0aW9ucy5zbGlkZXNUb1Njcm9sbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhbmltU2xpZGUgPSBfLnNsaWRlQ291bnQgKyB0YXJnZXRTbGlkZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAodGFyZ2V0U2xpZGUgPj0gXy5zbGlkZUNvdW50KSB7XHJcbiAgICAgICAgICAgIGlmIChfLnNsaWRlQ291bnQgJSBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgIT09IDApIHtcclxuICAgICAgICAgICAgICAgIGFuaW1TbGlkZSA9IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhbmltU2xpZGUgPSB0YXJnZXRTbGlkZSAtIF8uc2xpZGVDb3VudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFuaW1TbGlkZSA9IHRhcmdldFNsaWRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy5hbmltYXRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcignYmVmb3JlQ2hhbmdlJywgW18sIF8uY3VycmVudFNsaWRlLCBhbmltU2xpZGVdKTtcclxuXHJcbiAgICAgICAgb2xkU2xpZGUgPSBfLmN1cnJlbnRTbGlkZTtcclxuICAgICAgICBfLmN1cnJlbnRTbGlkZSA9IGFuaW1TbGlkZTtcclxuXHJcbiAgICAgICAgXy5zZXRTbGlkZUNsYXNzZXMoXy5jdXJyZW50U2xpZGUpO1xyXG5cclxuICAgICAgICBpZiAoIF8ub3B0aW9ucy5hc05hdkZvciApIHtcclxuXHJcbiAgICAgICAgICAgIG5hdlRhcmdldCA9IF8uZ2V0TmF2VGFyZ2V0KCk7XHJcbiAgICAgICAgICAgIG5hdlRhcmdldCA9IG5hdlRhcmdldC5zbGljaygnZ2V0U2xpY2snKTtcclxuXHJcbiAgICAgICAgICAgIGlmICggbmF2VGFyZ2V0LnNsaWRlQ291bnQgPD0gbmF2VGFyZ2V0Lm9wdGlvbnMuc2xpZGVzVG9TaG93ICkge1xyXG4gICAgICAgICAgICAgICAgbmF2VGFyZ2V0LnNldFNsaWRlQ2xhc3NlcyhfLmN1cnJlbnRTbGlkZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfLnVwZGF0ZURvdHMoKTtcclxuICAgICAgICBfLnVwZGF0ZUFycm93cygpO1xyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgaWYgKGRvbnRBbmltYXRlICE9PSB0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgXy5mYWRlU2xpZGVPdXQob2xkU2xpZGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIF8uZmFkZVNsaWRlKGFuaW1TbGlkZSwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXy5wb3N0U2xpZGUoYW5pbVNsaWRlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIF8ucG9zdFNsaWRlKGFuaW1TbGlkZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXy5hbmltYXRlSGVpZ2h0KCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkb250QW5pbWF0ZSAhPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBfLmFuaW1hdGVTbGlkZSh0YXJnZXRMZWZ0LCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIF8ucG9zdFNsaWRlKGFuaW1TbGlkZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIF8ucG9zdFNsaWRlKGFuaW1TbGlkZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnN0YXJ0TG9hZCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMuYXJyb3dzID09PSB0cnVlICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcclxuXHJcbiAgICAgICAgICAgIF8uJHByZXZBcnJvdy5oaWRlKCk7XHJcbiAgICAgICAgICAgIF8uJG5leHRBcnJvdy5oaWRlKCk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5kb3RzID09PSB0cnVlICYmIF8uc2xpZGVDb3VudCA+IF8ub3B0aW9ucy5zbGlkZXNUb1Nob3cpIHtcclxuXHJcbiAgICAgICAgICAgIF8uJGRvdHMuaGlkZSgpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF8uJHNsaWRlci5hZGRDbGFzcygnc2xpY2stbG9hZGluZycpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnN3aXBlRGlyZWN0aW9uID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciB4RGlzdCwgeURpc3QsIHIsIHN3aXBlQW5nbGUsIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICB4RGlzdCA9IF8udG91Y2hPYmplY3Quc3RhcnRYIC0gXy50b3VjaE9iamVjdC5jdXJYO1xyXG4gICAgICAgIHlEaXN0ID0gXy50b3VjaE9iamVjdC5zdGFydFkgLSBfLnRvdWNoT2JqZWN0LmN1clk7XHJcbiAgICAgICAgciA9IE1hdGguYXRhbjIoeURpc3QsIHhEaXN0KTtcclxuXHJcbiAgICAgICAgc3dpcGVBbmdsZSA9IE1hdGgucm91bmQociAqIDE4MCAvIE1hdGguUEkpO1xyXG4gICAgICAgIGlmIChzd2lwZUFuZ2xlIDwgMCkge1xyXG4gICAgICAgICAgICBzd2lwZUFuZ2xlID0gMzYwIC0gTWF0aC5hYnMoc3dpcGVBbmdsZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoKHN3aXBlQW5nbGUgPD0gNDUpICYmIChzd2lwZUFuZ2xlID49IDApKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoXy5vcHRpb25zLnJ0bCA9PT0gZmFsc2UgPyAnbGVmdCcgOiAncmlnaHQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKChzd2lwZUFuZ2xlIDw9IDM2MCkgJiYgKHN3aXBlQW5nbGUgPj0gMzE1KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gKF8ub3B0aW9ucy5ydGwgPT09IGZhbHNlID8gJ2xlZnQnIDogJ3JpZ2h0Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgoc3dpcGVBbmdsZSA+PSAxMzUpICYmIChzd2lwZUFuZ2xlIDw9IDIyNSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChfLm9wdGlvbnMucnRsID09PSBmYWxzZSA/ICdyaWdodCcgOiAnbGVmdCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoXy5vcHRpb25zLnZlcnRpY2FsU3dpcGluZyA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBpZiAoKHN3aXBlQW5nbGUgPj0gMzUpICYmIChzd2lwZUFuZ2xlIDw9IDEzNSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnZG93bic7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3VwJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICd2ZXJ0aWNhbCc7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuc3dpcGVFbmQgPSBmdW5jdGlvbihldmVudCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgIHNsaWRlQ291bnQsXHJcbiAgICAgICAgICAgIGRpcmVjdGlvbjtcclxuXHJcbiAgICAgICAgXy5kcmFnZ2luZyA9IGZhbHNlO1xyXG4gICAgICAgIF8uaW50ZXJydXB0ZWQgPSBmYWxzZTtcclxuICAgICAgICBfLnNob3VsZENsaWNrID0gKCBfLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoID4gMTAgKSA/IGZhbHNlIDogdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYgKCBfLnRvdWNoT2JqZWN0LmN1clggPT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCBfLnRvdWNoT2JqZWN0LmVkZ2VIaXQgPT09IHRydWUgKSB7XHJcbiAgICAgICAgICAgIF8uJHNsaWRlci50cmlnZ2VyKCdlZGdlJywgW18sIF8uc3dpcGVEaXJlY3Rpb24oKSBdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICggXy50b3VjaE9iamVjdC5zd2lwZUxlbmd0aCA+PSBfLnRvdWNoT2JqZWN0Lm1pblN3aXBlICkge1xyXG5cclxuICAgICAgICAgICAgZGlyZWN0aW9uID0gXy5zd2lwZURpcmVjdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgc3dpdGNoICggZGlyZWN0aW9uICkge1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ2xlZnQnOlxyXG4gICAgICAgICAgICAgICAgY2FzZSAnZG93bic6XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlQ291bnQgPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfLm9wdGlvbnMuc3dpcGVUb1NsaWRlID9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uY2hlY2tOYXZpZ2FibGUoIF8uY3VycmVudFNsaWRlICsgXy5nZXRTbGlkZUNvdW50KCkgKSA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmN1cnJlbnRTbGlkZSArIF8uZ2V0U2xpZGVDb3VudCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBfLmN1cnJlbnREaXJlY3Rpb24gPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlICdyaWdodCc6XHJcbiAgICAgICAgICAgICAgICBjYXNlICd1cCc6XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlQ291bnQgPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfLm9wdGlvbnMuc3dpcGVUb1NsaWRlID9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uY2hlY2tOYXZpZ2FibGUoIF8uY3VycmVudFNsaWRlIC0gXy5nZXRTbGlkZUNvdW50KCkgKSA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmN1cnJlbnRTbGlkZSAtIF8uZ2V0U2xpZGVDb3VudCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBfLmN1cnJlbnREaXJlY3Rpb24gPSAxO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG5cclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKCBkaXJlY3Rpb24gIT0gJ3ZlcnRpY2FsJyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBfLnNsaWRlSGFuZGxlciggc2xpZGVDb3VudCApO1xyXG4gICAgICAgICAgICAgICAgXy50b3VjaE9iamVjdCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgXy4kc2xpZGVyLnRyaWdnZXIoJ3N3aXBlJywgW18sIGRpcmVjdGlvbiBdKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGlmICggXy50b3VjaE9iamVjdC5zdGFydFggIT09IF8udG91Y2hPYmplY3QuY3VyWCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBfLnNsaWRlSGFuZGxlciggXy5jdXJyZW50U2xpZGUgKTtcclxuICAgICAgICAgICAgICAgIF8udG91Y2hPYmplY3QgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnN3aXBlSGFuZGxlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKChfLm9wdGlvbnMuc3dpcGUgPT09IGZhbHNlKSB8fCAoJ29udG91Y2hlbmQnIGluIGRvY3VtZW50ICYmIF8ub3B0aW9ucy5zd2lwZSA9PT0gZmFsc2UpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2UgaWYgKF8ub3B0aW9ucy5kcmFnZ2FibGUgPT09IGZhbHNlICYmIGV2ZW50LnR5cGUuaW5kZXhPZignbW91c2UnKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy50b3VjaE9iamVjdC5maW5nZXJDb3VudCA9IGV2ZW50Lm9yaWdpbmFsRXZlbnQgJiYgZXZlbnQub3JpZ2luYWxFdmVudC50b3VjaGVzICE9PSB1bmRlZmluZWQgP1xyXG4gICAgICAgICAgICBldmVudC5vcmlnaW5hbEV2ZW50LnRvdWNoZXMubGVuZ3RoIDogMTtcclxuXHJcbiAgICAgICAgXy50b3VjaE9iamVjdC5taW5Td2lwZSA9IF8ubGlzdFdpZHRoIC8gXy5vcHRpb25zXHJcbiAgICAgICAgICAgIC50b3VjaFRocmVzaG9sZDtcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy52ZXJ0aWNhbFN3aXBpbmcgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgXy50b3VjaE9iamVjdC5taW5Td2lwZSA9IF8ubGlzdEhlaWdodCAvIF8ub3B0aW9uc1xyXG4gICAgICAgICAgICAgICAgLnRvdWNoVGhyZXNob2xkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3dpdGNoIChldmVudC5kYXRhLmFjdGlvbikge1xyXG5cclxuICAgICAgICAgICAgY2FzZSAnc3RhcnQnOlxyXG4gICAgICAgICAgICAgICAgXy5zd2lwZVN0YXJ0KGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAnbW92ZSc6XHJcbiAgICAgICAgICAgICAgICBfLnN3aXBlTW92ZShldmVudCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ2VuZCc6XHJcbiAgICAgICAgICAgICAgICBfLnN3aXBlRW5kKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUuc3dpcGVNb3ZlID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLFxyXG4gICAgICAgICAgICBlZGdlV2FzSGl0ID0gZmFsc2UsXHJcbiAgICAgICAgICAgIGN1ckxlZnQsIHN3aXBlRGlyZWN0aW9uLCBzd2lwZUxlbmd0aCwgcG9zaXRpb25PZmZzZXQsIHRvdWNoZXM7XHJcblxyXG4gICAgICAgIHRvdWNoZXMgPSBldmVudC5vcmlnaW5hbEV2ZW50ICE9PSB1bmRlZmluZWQgPyBldmVudC5vcmlnaW5hbEV2ZW50LnRvdWNoZXMgOiBudWxsO1xyXG5cclxuICAgICAgICBpZiAoIV8uZHJhZ2dpbmcgfHwgdG91Y2hlcyAmJiB0b3VjaGVzLmxlbmd0aCAhPT0gMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjdXJMZWZ0ID0gXy5nZXRMZWZ0KF8uY3VycmVudFNsaWRlKTtcclxuXHJcbiAgICAgICAgXy50b3VjaE9iamVjdC5jdXJYID0gdG91Y2hlcyAhPT0gdW5kZWZpbmVkID8gdG91Y2hlc1swXS5wYWdlWCA6IGV2ZW50LmNsaWVudFg7XHJcbiAgICAgICAgXy50b3VjaE9iamVjdC5jdXJZID0gdG91Y2hlcyAhPT0gdW5kZWZpbmVkID8gdG91Y2hlc1swXS5wYWdlWSA6IGV2ZW50LmNsaWVudFk7XHJcblxyXG4gICAgICAgIF8udG91Y2hPYmplY3Quc3dpcGVMZW5ndGggPSBNYXRoLnJvdW5kKE1hdGguc3FydChcclxuICAgICAgICAgICAgTWF0aC5wb3coXy50b3VjaE9iamVjdC5jdXJYIC0gXy50b3VjaE9iamVjdC5zdGFydFgsIDIpKSk7XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWxTd2lwaW5nID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIF8udG91Y2hPYmplY3Quc3dpcGVMZW5ndGggPSBNYXRoLnJvdW5kKE1hdGguc3FydChcclxuICAgICAgICAgICAgICAgIE1hdGgucG93KF8udG91Y2hPYmplY3QuY3VyWSAtIF8udG91Y2hPYmplY3Quc3RhcnRZLCAyKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3dpcGVEaXJlY3Rpb24gPSBfLnN3aXBlRGlyZWN0aW9uKCk7XHJcblxyXG4gICAgICAgIGlmIChzd2lwZURpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZXZlbnQub3JpZ2luYWxFdmVudCAhPT0gdW5kZWZpbmVkICYmIF8udG91Y2hPYmplY3Quc3dpcGVMZW5ndGggPiA0KSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwb3NpdGlvbk9mZnNldCA9IChfLm9wdGlvbnMucnRsID09PSBmYWxzZSA/IDEgOiAtMSkgKiAoXy50b3VjaE9iamVjdC5jdXJYID4gXy50b3VjaE9iamVjdC5zdGFydFggPyAxIDogLTEpO1xyXG4gICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWxTd2lwaW5nID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uT2Zmc2V0ID0gXy50b3VjaE9iamVjdC5jdXJZID4gXy50b3VjaE9iamVjdC5zdGFydFkgPyAxIDogLTE7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgc3dpcGVMZW5ndGggPSBfLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoO1xyXG5cclxuICAgICAgICBfLnRvdWNoT2JqZWN0LmVkZ2VIaXQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKF8ub3B0aW9ucy5pbmZpbml0ZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgaWYgKChfLmN1cnJlbnRTbGlkZSA9PT0gMCAmJiBzd2lwZURpcmVjdGlvbiA9PT0gJ3JpZ2h0JykgfHwgKF8uY3VycmVudFNsaWRlID49IF8uZ2V0RG90Q291bnQoKSAmJiBzd2lwZURpcmVjdGlvbiA9PT0gJ2xlZnQnKSkge1xyXG4gICAgICAgICAgICAgICAgc3dpcGVMZW5ndGggPSBfLnRvdWNoT2JqZWN0LnN3aXBlTGVuZ3RoICogXy5vcHRpb25zLmVkZ2VGcmljdGlvbjtcclxuICAgICAgICAgICAgICAgIF8udG91Y2hPYmplY3QuZWRnZUhpdCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWwgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIF8uc3dpcGVMZWZ0ID0gY3VyTGVmdCArIHN3aXBlTGVuZ3RoICogcG9zaXRpb25PZmZzZXQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgXy5zd2lwZUxlZnQgPSBjdXJMZWZ0ICsgKHN3aXBlTGVuZ3RoICogKF8uJGxpc3QuaGVpZ2h0KCkgLyBfLmxpc3RXaWR0aCkpICogcG9zaXRpb25PZmZzZXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChfLm9wdGlvbnMudmVydGljYWxTd2lwaW5nID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIF8uc3dpcGVMZWZ0ID0gY3VyTGVmdCArIHN3aXBlTGVuZ3RoICogcG9zaXRpb25PZmZzZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXy5vcHRpb25zLmZhZGUgPT09IHRydWUgfHwgXy5vcHRpb25zLnRvdWNoTW92ZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8uYW5pbWF0aW5nID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIF8uc3dpcGVMZWZ0ID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy5zZXRDU1MoXy5zd2lwZUxlZnQpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnN3aXBlU3RhcnQgPSBmdW5jdGlvbihldmVudCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgIHRvdWNoZXM7XHJcblxyXG4gICAgICAgIF8uaW50ZXJydXB0ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICBpZiAoXy50b3VjaE9iamVjdC5maW5nZXJDb3VudCAhPT0gMSB8fCBfLnNsaWRlQ291bnQgPD0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdykge1xyXG4gICAgICAgICAgICBfLnRvdWNoT2JqZWN0ID0ge307XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChldmVudC5vcmlnaW5hbEV2ZW50ICE9PSB1bmRlZmluZWQgJiYgZXZlbnQub3JpZ2luYWxFdmVudC50b3VjaGVzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdG91Y2hlcyA9IGV2ZW50Lm9yaWdpbmFsRXZlbnQudG91Y2hlc1swXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF8udG91Y2hPYmplY3Quc3RhcnRYID0gXy50b3VjaE9iamVjdC5jdXJYID0gdG91Y2hlcyAhPT0gdW5kZWZpbmVkID8gdG91Y2hlcy5wYWdlWCA6IGV2ZW50LmNsaWVudFg7XHJcbiAgICAgICAgXy50b3VjaE9iamVjdC5zdGFydFkgPSBfLnRvdWNoT2JqZWN0LmN1clkgPSB0b3VjaGVzICE9PSB1bmRlZmluZWQgPyB0b3VjaGVzLnBhZ2VZIDogZXZlbnQuY2xpZW50WTtcclxuXHJcbiAgICAgICAgXy5kcmFnZ2luZyA9IHRydWU7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUudW5maWx0ZXJTbGlkZXMgPSBTbGljay5wcm90b3R5cGUuc2xpY2tVbmZpbHRlciA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgIGlmIChfLiRzbGlkZXNDYWNoZSAhPT0gbnVsbCkge1xyXG5cclxuICAgICAgICAgICAgXy51bmxvYWQoKTtcclxuXHJcbiAgICAgICAgICAgIF8uJHNsaWRlVHJhY2suY2hpbGRyZW4odGhpcy5vcHRpb25zLnNsaWRlKS5kZXRhY2goKTtcclxuXHJcbiAgICAgICAgICAgIF8uJHNsaWRlc0NhY2hlLmFwcGVuZFRvKF8uJHNsaWRlVHJhY2spO1xyXG5cclxuICAgICAgICAgICAgXy5yZWluaXQoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnVubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXM7XHJcblxyXG4gICAgICAgICQoJy5zbGljay1jbG9uZWQnLCBfLiRzbGlkZXIpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICBpZiAoXy4kZG90cykge1xyXG4gICAgICAgICAgICBfLiRkb3RzLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8uJHByZXZBcnJvdyAmJiBfLmh0bWxFeHByLnRlc3QoXy5vcHRpb25zLnByZXZBcnJvdykpIHtcclxuICAgICAgICAgICAgXy4kcHJldkFycm93LnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF8uJG5leHRBcnJvdyAmJiBfLmh0bWxFeHByLnRlc3QoXy5vcHRpb25zLm5leHRBcnJvdykpIHtcclxuICAgICAgICAgICAgXy4kbmV4dEFycm93LnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXy4kc2xpZGVzXHJcbiAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnc2xpY2stc2xpZGUgc2xpY2stYWN0aXZlIHNsaWNrLXZpc2libGUgc2xpY2stY3VycmVudCcpXHJcbiAgICAgICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJylcclxuICAgICAgICAgICAgLmNzcygnd2lkdGgnLCAnJyk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBTbGljay5wcm90b3R5cGUudW5zbGljayA9IGZ1bmN0aW9uKGZyb21CcmVha3BvaW50KSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuICAgICAgICBfLiRzbGlkZXIudHJpZ2dlcigndW5zbGljaycsIFtfLCBmcm9tQnJlYWtwb2ludF0pO1xyXG4gICAgICAgIF8uZGVzdHJveSgpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnVwZGF0ZUFycm93cyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICB2YXIgXyA9IHRoaXMsXHJcbiAgICAgICAgICAgIGNlbnRlck9mZnNldDtcclxuXHJcbiAgICAgICAgY2VudGVyT2Zmc2V0ID0gTWF0aC5mbG9vcihfLm9wdGlvbnMuc2xpZGVzVG9TaG93IC8gMik7XHJcblxyXG4gICAgICAgIGlmICggXy5vcHRpb25zLmFycm93cyA9PT0gdHJ1ZSAmJlxyXG4gICAgICAgICAgICBfLnNsaWRlQ291bnQgPiBfLm9wdGlvbnMuc2xpZGVzVG9TaG93ICYmXHJcbiAgICAgICAgICAgICFfLm9wdGlvbnMuaW5maW5pdGUgKSB7XHJcblxyXG4gICAgICAgICAgICBfLiRwcmV2QXJyb3cucmVtb3ZlQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICdmYWxzZScpO1xyXG4gICAgICAgICAgICBfLiRuZXh0QXJyb3cucmVtb3ZlQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICdmYWxzZScpO1xyXG5cclxuICAgICAgICAgICAgaWYgKF8uY3VycmVudFNsaWRlID09PSAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgXy4kcHJldkFycm93LmFkZENsYXNzKCdzbGljay1kaXNhYmxlZCcpLmF0dHIoJ2FyaWEtZGlzYWJsZWQnLCAndHJ1ZScpO1xyXG4gICAgICAgICAgICAgICAgXy4kbmV4dEFycm93LnJlbW92ZUNsYXNzKCdzbGljay1kaXNhYmxlZCcpLmF0dHIoJ2FyaWEtZGlzYWJsZWQnLCAnZmFsc2UnKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5jdXJyZW50U2xpZGUgPj0gXy5zbGlkZUNvdW50IC0gXy5vcHRpb25zLnNsaWRlc1RvU2hvdyAmJiBfLm9wdGlvbnMuY2VudGVyTW9kZSA9PT0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBfLiRuZXh0QXJyb3cuYWRkQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICd0cnVlJyk7XHJcbiAgICAgICAgICAgICAgICBfLiRwcmV2QXJyb3cucmVtb3ZlQ2xhc3MoJ3NsaWNrLWRpc2FibGVkJykuYXR0cignYXJpYS1kaXNhYmxlZCcsICdmYWxzZScpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChfLmN1cnJlbnRTbGlkZSA+PSBfLnNsaWRlQ291bnQgLSAxICYmIF8ub3B0aW9ucy5jZW50ZXJNb2RlID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgXy4kbmV4dEFycm93LmFkZENsYXNzKCdzbGljay1kaXNhYmxlZCcpLmF0dHIoJ2FyaWEtZGlzYWJsZWQnLCAndHJ1ZScpO1xyXG4gICAgICAgICAgICAgICAgXy4kcHJldkFycm93LnJlbW92ZUNsYXNzKCdzbGljay1kaXNhYmxlZCcpLmF0dHIoJ2FyaWEtZGlzYWJsZWQnLCAnZmFsc2UnKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgU2xpY2sucHJvdG90eXBlLnVwZGF0ZURvdHMgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdmFyIF8gPSB0aGlzO1xyXG5cclxuICAgICAgICBpZiAoXy4kZG90cyAhPT0gbnVsbCkge1xyXG5cclxuICAgICAgICAgICAgXy4kZG90c1xyXG4gICAgICAgICAgICAgICAgLmZpbmQoJ2xpJylcclxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnc2xpY2stYWN0aXZlJylcclxuICAgICAgICAgICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcblxyXG4gICAgICAgICAgICBfLiRkb3RzXHJcbiAgICAgICAgICAgICAgICAuZmluZCgnbGknKVxyXG4gICAgICAgICAgICAgICAgLmVxKE1hdGguZmxvb3IoXy5jdXJyZW50U2xpZGUgLyBfLm9wdGlvbnMuc2xpZGVzVG9TY3JvbGwpKVxyXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdzbGljay1hY3RpdmUnKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIFNsaWNrLnByb3RvdHlwZS52aXNpYmlsaXR5ID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBfID0gdGhpcztcclxuXHJcbiAgICAgICAgaWYgKCBfLm9wdGlvbnMuYXV0b3BsYXkgKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIGRvY3VtZW50W18uaGlkZGVuXSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBfLmludGVycnVwdGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgXy5pbnRlcnJ1cHRlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICAkLmZuLnNsaWNrID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIF8gPSB0aGlzLFxyXG4gICAgICAgICAgICBvcHQgPSBhcmd1bWVudHNbMF0sXHJcbiAgICAgICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLFxyXG4gICAgICAgICAgICBsID0gXy5sZW5ndGgsXHJcbiAgICAgICAgICAgIGksXHJcbiAgICAgICAgICAgIHJldDtcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0ID09ICdvYmplY3QnIHx8IHR5cGVvZiBvcHQgPT0gJ3VuZGVmaW5lZCcpXHJcbiAgICAgICAgICAgICAgICBfW2ldLnNsaWNrID0gbmV3IFNsaWNrKF9baV0sIG9wdCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJldCA9IF9baV0uc2xpY2tbb3B0XS5hcHBseShfW2ldLnNsaWNrLCBhcmdzKTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiByZXQgIT0gJ3VuZGVmaW5lZCcpIHJldHVybiByZXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBfO1xyXG4gICAgfTtcclxuXHJcbn0pKTtcclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICB0aGlzLnByb2plY3RWaWRlb0VtYmVkKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHByb2plY3RWaWRlb0VtYmVkKCkge1xyXG4gICAgICAkLmdldFNjcmlwdCgnaHR0cDovL3d3dy55b3V0dWJlLmNvbS9pZnJhbWVfYXBpJykuZG9uZShmdW5jdGlvbigpIHtcclxuICAgICAgICBmdW5jdGlvbiBvblBsYXllclN0YXRlQ2hhbmdlKGV2ZW50KSB7XHJcbiAgICAgICAgICBzd2l0Y2goZXZlbnQuZGF0YSkge1xyXG4gICAgICAgICAgICBjYXNlIFlULlBsYXllclN0YXRlLkVOREVEOlxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnVmlkZW8gaGFzIGVuZGVkLicpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBZVC5QbGF5ZXJTdGF0ZS5QTEFZSU5HOlxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnVmlkZW8gaXMgcGxheWluZy4nKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgWVQuUGxheWVyU3RhdGUuUEFVU0VEOlxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnVmlkZW8gaXMgcGF1c2VkLicpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBZVC5QbGF5ZXJTdGF0ZS5CVUZGRVJJTkc6XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdWaWRlbyBpcyBidWZmZXJpbmcuJyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFlULlBsYXllclN0YXRlLkNVRUQ6XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdWaWRlbyBpcyBjdWVkLicpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoJy52aWRlby13cmFwIC5vdmVybGF5Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICB2YXIgdmlkSWQgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtaWQnKTtcclxuICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xyXG4gICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5maW5kKCcuaWZyYW1lLWJveCcpLmh0bWwoJzxpZnJhbWUgaWQ9XCJwbGF5ZXJfJyt2aWRJZCsnXCIgd2lkdGg9XCI0MjBcIiBoZWlnaHQ9XCIzMTVcIiBzcmM9XCJodHRwOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkLycgKyB2aWRJZCArICc/ZW5hYmxlanNhcGk9MSZhdXRvcGxheT0xJmF1dG9oaWRlPTEmc2hvd2luZm89MFwiIGZyYW1lYm9yZGVyPVwiMFwiIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT4nKTtcclxuXHJcbiAgICAgICAgICBuZXcgWVQuUGxheWVyKCdwbGF5ZXJfJyt2aWRJZCwge1xyXG4gICAgICAgICAgICBldmVudHM6IHtcclxuICAgICAgICAgICAgICAnb25TdGF0ZUNoYW5nZSc6IG9uUGxheWVyU3RhdGVDaGFuZ2VcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICB9KTtcclxuXHJcbiAgICB9XHJcbn0iLCIvLyBpbXBvcnQgJy4uL2xpYnMvanF1ZXJ5LnZhbGlkYXRlLmpzJztcclxuXHJcbi8vIChmdW5jdGlvbigkKSB7XHJcbi8vICAgICAkLmZuLmZvcm1TdWJtaXQgPSBmdW5jdGlvbigpIHtcclxuLy8gICAgICAgICAkKHRoaXMpLmVhY2goZnVuY3Rpb24oKSB7XHJcbi8vICAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuLy8gICAgICAgICAgICAgJCh0aGlzKS52YWxpZGF0ZSh7XHJcbi8vICAgICAgICAgICAgICAgICBydWxlczoge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwicmVxdWlyZWRcIixcclxuLy8gICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcInJlcXVpcmVkXCIsXHJcbi8vICAgICAgICAgICAgICAgICAgICAgdGV4dDogXCJyZXF1aXJlZFwiLFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogdHJ1ZVxyXG4vLyAgICAgICAgICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICAgICAgICAgIH0sXHJcbi8vICAgICAgICAgICAgICAgICBtZXNzYWdlczoge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGZvcm1WYWxpZGF0ZVNldHRpbmdzLm5hbWUsXHJcbi8vICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogZm9ybVZhbGlkYXRlU2V0dGluZ3MubWVzc2FnZUVtcHR5LFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGZvcm1WYWxpZGF0ZVNldHRpbmdzLnRleHRFbXB0eSxcclxuLy8gICAgICAgICAgICAgICAgICAgICBlbWFpbDoge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogZm9ybVZhbGlkYXRlU2V0dGluZ3MuZW1haWxFbXB0eSxcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IGZvcm1WYWxpZGF0ZVNldHRpbmdzLmVtYWlsSW5jb3JyZWN0XHJcbi8vICAgICAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICAgICAgfSxcclxuXHJcbi8vICAgICAgICAgICAgICAgICBzdWJtaXRIYW5kbGVyOiBmdW5jdGlvbiBzdWJtaXRIYW5kbGVyKGZvcm0sIGUpIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgdmFyICRmb3JtID0gJCh0aGF0KTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICRmb3JtLmF0dHIoJ21ldGhvZCcpLFxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAkZm9ybS5hdHRyKCdhY3Rpb24nKSxcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiAkZm9ybS5zZXJpYWxpemUoKVxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICB9KS5kb25lKGZ1bmN0aW9uIChkYXRhKSB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihkYXRhLnRpdGxlID09PSB1bmRlZmluZWQpIGRhdGEudGl0bGUgPSAnJztcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGRhdGEubWVzc2FnZSA9PT0gdW5kZWZpbmVkKSBkYXRhLm1lc3NhZ2UgPSAnJztcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgPT0gdHJ1ZSkge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLmhpZGUoMjAwKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybVswXS5yZXNldCgpO1xyXG5cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZm9ybVN1Y2Nlc3MgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmb3JtLXN1Y2Nlc3MnKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3JtU3VjY2Vzcy5odG1sKCc8ZGl2IGNsYXNzPVwic3RhdGUtaWNvblwiPjwvZGl2PiA8ZGl2IGNsYXNzPVwiZm9ybS10aXRsZVwiPicgKyBkYXRhLnRpdGxlICsgJzwvZGl2PiA8ZGl2IGNsYXNzPVwiZm9ybS1kZXNjclwiPicgKyBkYXRhLm1lc3NhZ2UgKyAnPC9kaXY+Jyk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0ucGFyZW50KCkuYXBwZW5kKGZvcm1TdWNjZXNzKTtcclxuXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLnBhcmVudCgpLmZpbmQoJy5mb3JtLXN1Y2Nlc3MnKS5zaG93KDIwMCk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMjAwKTtcclxuXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLnBhcmVudCgpLmZpbmQoJy5mb3JtLXN1Y2Nlc3MnKS5oaWRlKDIwMCk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMzAwMCk7XHJcblxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5wYXJlbnQoKS5maW5kKCcuZm9ybS1zdWNjZXNzJykucmVtb3ZlKCk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLnBhcmVudCgpLmZpbmQoJy5mb3JtLXN1Y2Nlc3MnKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0uc2hvdygyMDApO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDMyMDApO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5oaWRlKDIwMCk7XHJcblxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmb3JtRXJyb3IgPSAkKCc8ZGl2PjwvZGl2PicpLmFkZENsYXNzKCdmb3JtLWVycm9yJyk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybUVycm9yLmh0bWwoJzxkaXYgY2xhc3M9XCJzdGF0ZS1pY29uXCI+PC9kaXY+IDxkaXYgY2xhc3M9XCJmb3JtLXRpdGxlXCI+JyArIGRhdGEudGl0bGUgKyAnPC9kaXY+IDxkaXYgY2xhc3M9XCJmb3JtLWRlc2NyXCI+JyArIGRhdGEubWVzc2FnZSArICc8L2Rpdj48YSBocmVmPVwiI1wiIGNsYXNzPVwiYnRuXCI+JyArIGZvcm1WYWxpZGF0ZVNldHRpbmdzLnNlbmRfYWdhaW4gKyAnPC9hPicpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLnBhcmVudCgpLmFwcGVuZChmb3JtRXJyb3IpO1xyXG5cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0ucGFyZW50KCkuZmluZCgnLmZvcm0tZXJyb3InKS5zaG93KDIwMCk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMjAwKTtcclxuXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0ucGFyZW50KCkuZmluZCgnLmZvcm0tZXJyb3InKS5maW5kKCdhJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5wYXJlbnQoKS5maW5kKCcuZm9ybS1lcnJvcicpLmhpZGUoMjAwKTtcclxuXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0ucGFyZW50KCkuZmluZCgnLmZvcm0tZXJyb3InKS5yZW1vdmUoKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLnNob3coMjAwKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMjAwKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgfSkuZmFpbChmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5oaWRlKDIwMCk7XHJcblxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZvcm1FcnJvciA9ICQoJzxkaXY+PC9kaXY+JykuYWRkQ2xhc3MoJ2Zvcm0tZXJyb3InKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1FcnJvci5odG1sKCc8ZGl2IGNsYXNzPVwic3RhdGUtaWNvblwiPjwvZGl2PiA8ZGl2IGNsYXNzPVwiZm9ybS10aXRsZVwiPicgKyBmb3JtVmFsaWRhdGVTZXR0aW5ncy5zZW5kX2Vycm9yX3RpdGxlICsgJzwvZGl2PiA8ZGl2IGNsYXNzPVwiZm9ybS1kZXNjclwiPicgKyBmb3JtVmFsaWRhdGVTZXR0aW5ncy5zZW5kX2Vycm9yX21lc3NhZ2UgKyAnPC9kaXY+IDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJidG5cIj4nICsgZm9ybVZhbGlkYXRlU2V0dGluZ3Muc2VuZF9hZ2FpbiArICc8L2E+Jyk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5wYXJlbnQoKS5hcHBlbmQoZm9ybUVycm9yKTtcclxuXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5wYXJlbnQoKS5maW5kKCcuZm9ybS1lcnJvcicpLnNob3coMjAwKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDIwMCk7XHJcblxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0ucGFyZW50KCkuZmluZCgnLmZvcm0tZXJyb3InKS5maW5kKCdhJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0ucGFyZW50KCkuZmluZCgnLmZvcm0tZXJyb3InKS5oaWRlKDIwMCk7XHJcblxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5wYXJlbnQoKS5maW5kKCcuZm9ybS1lcnJvcicpLnJlbW92ZSgpO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5zaG93KDIwMCk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMjAwKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbi8vICAgICAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgICAgIH0pO1xyXG4vLyAgICAgICAgIH0pXHJcbi8vICAgICB9XHJcbi8vIH0pKGpRdWVyeSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHRoaXMudmFsaWRhdGlvbigpO1xyXG4gICAgfSxcclxuXHJcbiAgICB2YWxpZGF0aW9uKCkge1xyXG4gICAgICAgIC8vICQoJ2Zvcm0nKS5mb3JtU3VibWl0KCk7XHJcblxyXG4gICAgICAgICQoXCIubWF0LWlucHV0XCIpLmZvY3VzKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICQodGhpcykucGFyZW50KCkuYWRkQ2xhc3MoXCJpcy1hY3RpdmUgaXMtY29tcGxldGVkXCIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiLm1hdC1pbnB1dFwiKS5mb2N1c291dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBpZigkKHRoaXMpLnZhbCgpID09PSBcIlwiKVxyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyhcImlzLWNvbXBsZXRlZFwiKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyhcImlzLWFjdGl2ZVwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImltcG9ydCBzZWxlY3QyIGZyb20gJy4uL2xpYnMvc2VsZWN0Mi5qcyc7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG5cclxuICAgIGluaXQoKXtcclxuICAgICAgICB0aGlzLmhlYWRlckZ1bmN0aW9ucygpO1xyXG4gICAgfSxcclxuXHJcbiAgICBoZWFkZXJGdW5jdGlvbnMgKCkge1xyXG5cclxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgJCgnLm1lbnUtYnV0dG9uJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAkKCcuc2l0ZS1uYXYnKS5zbGlkZVVwKCdhY3RpdmUnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCgnLm1lbnUtYnV0dG9uJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICQoJy5zaXRlLW5hdicpLnNsaWRlVG9nZ2xlKCdhY3RpdmUnKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoJy5zaXRlLW5hdicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZm9ybWF0U3RhdGUgKHN0YXRlKSB7XHJcbiAgICAgICAgICAgIGlmICghc3RhdGUuaWQpIHsgcmV0dXJuIHN0YXRlLnRleHQ7IH1cclxuICAgICAgICAgICAgY29uc29sZS5sb2coc3RhdGUuZWxlbWVudC52YWx1ZS5zcGxpdCgnXycpWzBdLnRvTG93ZXJDYXNlKCkpO1xyXG4gICAgICAgICAgICB2YXIgJHN0YXRlID0gJChcclxuICAgICAgICAgICAgICAgICc8c3Bhbj48aW1nIGNsYXNzPVwiY29udGV4dENoYW5nZVwiIHNyYz0gXCIuLi9pbWFnZXMvZmxhZ3MvJyArIHN0YXRlLmVsZW1lbnQudmFsdWUuc3BsaXQoJ18nKVswXS50b0xvd2VyQ2FzZSgpICsgJy5wbmdcIiBjbGFzcz1cImltZy1mbGFnXCIgLz4gJyArIHN0YXRlLnRleHQgKyAnPC9zcGFuPidcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHJldHVybiAkc3RhdGU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJChcIi5sYW5nXCIpLnNlbGVjdDIoe1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVJlc3VsdDogZm9ybWF0U3RhdGUsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlU2VsZWN0aW9uOiBmb3JtYXRTdGF0ZSxcclxuICAgICAgICAgICAgbWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IEluZmluaXR5XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vICQoJy5sYW5nJykub24oXCJzZWxlY3QyOnNlbGVjdFwiLCBmdW5jdGlvbihlKXtcclxuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coZS5wYXJhbXMpO1xyXG4gICAgICAgIC8vICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShlLnBhcmFtcy5kYXRhLmlkLnNwbGl0KCdfJylbMV0pO1xyXG4gICAgICAgIC8vIH0pO1xyXG5cclxuICAgIH1cclxufTsiLCJleHBvcnQgZGVmYXVsdCB7XHJcblx0aW5pdCgpIHtcclxuXHRcdHRoaXMuaW5pdE1hcCgpO1xyXG5cdH0sXHJcblxyXG5cdGluaXRNYXAoKSB7XHJcblxyXG5cdFx0XHRcdCQuZ2V0U2NyaXB0KFwiaHR0cDovL21hcHMuZ29vZ2xlLmNvbS9tYXBzL2FwaS9qcz9rZXk9QUl6YVN5QzFtdTVwN0wzS01IbldRWFRrNExUV1IzQlNpYVF0ZFc4JnNlbnNvcj10cnVlXCIpLmRvbmUoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHRjb25zdCBtYXBJZCA9ICQoJyNtYXAnKTtcclxuXHRcdFx0XHRcdFx0Y29uc3QgZGF0YUxhdCA9IHBhcnNlRmxvYXQobWFwSWQuYXR0cignZGF0YS1sYXQnKSk7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGRhdGFMbmcgPSBwYXJzZUZsb2F0KG1hcElkLmF0dHIoJ2RhdGEtbG5nJykpO1xyXG5cdFx0XHRcdFx0XHRjb25zdCBjZW50ZXIgPSB7bGF0OiBkYXRhTGF0LCBsbmc6IGRhdGFMbmd9O1xyXG5cclxuXHRcdFx0XHRcdFx0dmFyIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYXBcIiksIHtcclxuXHRcdFx0XHRcdFx0XHRcdHpvb206IDE2LFxyXG5cdFx0XHRcdFx0XHRcdFx0Y2VudGVyOiBjZW50ZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRzY3JvbGx3aGVlbDogZmFsc2UsXHJcblx0XHRcdFx0XHRcdFx0XHRkcmFnZ2FibGU6IHRydWUsXHJcblx0XHRcdFx0XHRcdFx0XHR6b29tQ29udHJvbDogZmFsc2UsXHJcblx0XHRcdFx0XHRcdFx0XHR6b29tQ29udHJvbE9wdGlvbnM6IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRwb3NpdGlvbjogZ29vZ2xlLm1hcHMuQ29udHJvbFBvc2l0aW9uLlRPUF9SSUdIVFxyXG5cdFx0XHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0XHRcdHBhbkNvbnRyb2w6IGZhbHNlLFxyXG5cdFx0XHRcdFx0XHRcdFx0bWFwVHlwZUNvbnRyb2w6IGZhbHNlLFxyXG5cdFx0XHRcdFx0XHRcdFx0c3RyZWV0Vmlld0NvbnRyb2w6IGZhbHNlXHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdFx0dmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xyXG5cdFx0XHRcdFx0XHRcdFx0cG9zaXRpb246IGNlbnRlcixcclxuXHRcdFx0XHRcdFx0XHRcdG1hcDogbWFwLFxyXG5cdFx0XHRcdFx0XHRcdFx0dGl0bGU6IFwibXkgcGxhY2VcIlxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH1cclxufVxyXG4iLCJpbXBvcnQgJy4uL2xpYnMvc2xpY2snO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICB0aGlzLmhlYWRlclNsaWRlcigpO1xyXG4gICAgICAgIHRoaXMuaG9tZVByb2plY3RTbGlkZXIoKTtcclxuICAgICAgICB0aGlzLmhvbWVWZXJ0aWNhbFNsaWRlcigpO1xyXG4gICAgICAgIHRoaXMuY2VudGVyZWRTbGlkZXIoKTtcclxuICAgICAgICB0aGlzLmRvdWJsZVNsaWRlcigpO1xyXG4gICAgfSxcclxuXHJcbiAgICBoZWFkZXJTbGlkZXIoKSB7XHJcbiAgICAgICAgJCgnLnNpdGUtaGVhZGVyX3NsaWRlcicpLnNsaWNrKHtcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgYXJyb3dzOiBmYWxzZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBcclxuICAgIH0sXHJcblxyXG4gICAgaG9tZVByb2plY3RTbGlkZXIoKSB7XHJcbiAgICAgICQoJy5wcm9qZWN0cy1zbGlkZXInKS5zbGljayh7XHJcbiAgICAgICAgICBjZW50ZXJNb2RlOiB0cnVlLFxyXG4gICAgICAgICAgcmVzcG9uc2l2ZTogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBicmVha3BvaW50OiAxMDIzLFxyXG4gICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgIGNlbnRlck1vZGU6IGZhbHNlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgJCgnLnByb2plY3RzLXNsaWRlci1pbmZvIC5iLWluZm9faXRlbScpLmVxKDApLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHJcbiAgICAgICQoJy5wcm9qZWN0cy1zbGlkZXInKS5vbignYmVmb3JlQ2hhbmdlJywgZnVuY3Rpb24oZXZlbnQsIHNsaWNrLCBjdXJyZW50U2xpZGUsIG5leHRTbGlkZSl7XHJcbiAgICAgICAgJCgnLnByb2plY3RzLXNsaWRlci1pbmZvIC5iLWluZm9faXRlbScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHJcbiAgICAgICAgaWYgKCQoJy5wcm9qZWN0cy1zbGlkZXItaW5mbyAuYi1pbmZvX2l0ZW0nKS5lcShuZXh0U2xpZGUpLmxlbmd0aCAhPSAwKSB7XHJcbiAgICAgICAgICAkKCcucHJvamVjdHMtc2xpZGVyLWluZm8gLmItaW5mb19pdGVtJykuZXEobmV4dFNsaWRlKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgaG9tZVZlcnRpY2FsU2xpZGVyKCkge1xyXG4gICAgICAkKCcuaG9tZS12ZXJpY2FsLXNsaWRlcicpLnNsaWNrKHtcclxuICAgICAgICBkb3RzOiB0cnVlXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBjZW50ZXJlZFNsaWRlcigpIHtcclxuICAgICAgJCgnLmNlbnRlci1zbGlkZXInKS5zbGljayh7XHJcbiAgICAgICAgY2VudGVyTW9kZTogdHJ1ZSxcclxuICAgICAgICBzbGlkZXNUb1Nob3c6IDMsXHJcbiAgICAgICAgcmVzcG9uc2l2ZTogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBicmVha3BvaW50OiAxMDIzLFxyXG4gICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgIGNlbnRlck1vZGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgZG91YmxlU2xpZGVyKCkge1xyXG4gICAgICAkKCcuZG91YmxlLXNsaWRlcicpLnNsaWNrKHtcclxuICAgICAgICBjZW50ZXJNb2RlOiB0cnVlLFxyXG4gICAgICAgIHNsaWRlc1RvU2hvdzogMixcclxuICAgICAgICBjZW50ZXJQYWRkaW5nOiAnODBweCcsXHJcbiAgICAgICAgcmVzcG9uc2l2ZTogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBicmVha3BvaW50OiAxMDIzLFxyXG4gICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgIGNlbnRlck1vZGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIHNsaWRlc1RvU2hvdzogMSxcclxuICAgICAgICAgICAgICBjZW50ZXJQYWRkaW5nOiAnMHB4J1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgICB9KTtcclxuICAgIH1cclxufSIsImltcG9ydCBIZWFkZXJGdW5jdGlvbnMgZnJvbSBcIi4uL21vZHVsZXMvaGVhZGVyRnVuY3Rpb25zXCI7XHJcbmltcG9ydCBTbGlkZXJzIGZyb20gXCIuLi9tb2R1bGVzL3NsaWRlcnMuanNcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIGluaXQoKXtcclxuICAgICAgICBIZWFkZXJGdW5jdGlvbnMuaW5pdCgpO1xyXG4gICAgICAgIFNsaWRlcnMuaW5pdCgpO1xyXG4gICAgfVxyXG59OyIsImltcG9ydCBIZWFkZXJGdW5jdGlvbnMgZnJvbSBcIi4uL21vZHVsZXMvaGVhZGVyRnVuY3Rpb25zXCI7XHJcbmltcG9ydCBTbGlkZXJzIGZyb20gXCIuLi9tb2R1bGVzL3NsaWRlcnMuanNcIjtcclxuaW1wb3J0IEZvcm1GdW5jdGlvbnMgZnJvbSBcIi4uL21vZHVsZXMvZm9ybUZ1bmN0aW9uc1wiO1xyXG5pbXBvcnQgR01hcCBmcm9tICcuLi9tb2R1bGVzL21hcC5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgICBpbml0KCl7XHJcbiAgICAgICAgSGVhZGVyRnVuY3Rpb25zLmluaXQoKTtcclxuICAgICAgICBTbGlkZXJzLmluaXQoKTtcclxuICAgICAgICBHTWFwLmluaXQoKTtcclxuICAgICAgICBGb3JtRnVuY3Rpb25zLmluaXQoKTtcclxuICAgIH1cclxufTsiLCJpbXBvcnQgSGVhZGVyRnVuY3Rpb25zIGZyb20gXCIuLi9tb2R1bGVzL2hlYWRlckZ1bmN0aW9uc1wiO1xyXG5pbXBvcnQgRm9ybUZ1bmN0aW9ucyBmcm9tIFwiLi4vbW9kdWxlcy9mb3JtRnVuY3Rpb25zXCI7XHJcbmltcG9ydCBTbGlkZXJzIGZyb20gXCIuLi9tb2R1bGVzL3NsaWRlcnMuanNcIjtcclxuaW1wb3J0IE1hcEluaXQgZnJvbSBcIi4uL21vZHVsZXMvbWFwLmpzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgICBpbml0KCl7XHJcbiAgICAgICAgSGVhZGVyRnVuY3Rpb25zLmluaXQoKTtcclxuICAgICAgICBTbGlkZXJzLmluaXQoKTtcclxuICAgICAgICAvLyBNYXBJbml0LmluaXQoKTtcclxuICAgICAgICBGb3JtRnVuY3Rpb25zLmluaXQoKTtcclxuICAgIH1cclxufTsiLCJpbXBvcnQgSGVhZGVyRnVuY3Rpb25zIGZyb20gXCIuLi9tb2R1bGVzL2hlYWRlckZ1bmN0aW9uc1wiO1xyXG5pbXBvcnQgU2xpZGVycyBmcm9tIFwiLi4vbW9kdWxlcy9zbGlkZXJzLmpzXCI7XHJcbmltcG9ydCBQTEFZRVIgZnJvbSAnLi4vbW9kdWxlcy9ZVGVtYmVkLmpzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIGluaXQoKXtcclxuICAgICAgICBIZWFkZXJGdW5jdGlvbnMuaW5pdCgpO1xyXG4gICAgICAgIFNsaWRlcnMuaW5pdCgpO1xyXG4gICAgICAgIFBMQVlFUi5pbml0KCk7XHJcbiAgICB9XHJcbn07Il19
