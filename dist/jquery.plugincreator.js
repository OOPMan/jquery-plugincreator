(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "jquery"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require("jquery"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.jquery);
        global.jqueryPlugincreator = mod.exports;
    }
})(this, function (exports, _jquery) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.jQueryPlugin = exports.jQueryPluginCreatorError = undefined;
    exports.default = addPlugin;

    var _jquery2 = _interopRequireDefault(_jquery);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                arr2[i] = arr[i];
            }

            return arr2;
        } else {
            return Array.from(arr);
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var scopeName = "jquery-plugincreator-";

    /**
     * Error class for jQuery PluginCreator errors
     */

    var jQueryPluginCreatorError = exports.jQueryPluginCreatorError = function (_Error) {
        _inherits(jQueryPluginCreatorError, _Error);

        function jQueryPluginCreatorError(message, error) {
            _classCallCheck(this, jQueryPluginCreatorError);

            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(jQueryPluginCreatorError).call(this, message));

            _this.message = message;
            _this.error = error;
            _this.name = "jQueryPluginCreatorError";
            return _this;
        }

        return jQueryPluginCreatorError;
    }(Error);

    var jQueryPlugin = exports.jQueryPlugin = function () {
        /**
         * The constructor handles set-up of the plugin instance. Rather than
         * overriding this function to perform plugin instance setup, you should
         * override the init function as it will be called automatically with any
         * additional parameters you passed in once the core work of setting up
         * the plugin instance has been done.
         *
         * @param {Element} element
         * @param {Object}     defaults
         * @param {Object}     options
         */

        function jQueryPlugin(element) {
            var defaults = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
            var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

            _classCallCheck(this, jQueryPlugin);

            this.element = element;
            this.context = (0, _jquery2.default)(element).addClass(scopeName + this.constructor.name);
            this.options = Object.assign({}, defaults, options);
        }

        /**
         * Called once the constructor is done and the base plugin instance has
         * been configured. Receives the arguments passed into the the jQuery
         * plugin call the constructs the plugin instance.
         */


        _createClass(jQueryPlugin, [{
            key: "init",
            value: function init() {}

            /**
             * This helper function can be called to return a reference to the
             * plugin instance.
             *
             * @returns {Object}
             */

        }, {
            key: "getInstance",
            value: function getInstance() {
                return this;
            }

            /**
             * Update the options parameters associated with the class.
             *
             * @param {Object} options
             * @returns {Object}
             */

        }, {
            key: "update",
            value: function update(options) {
                return _jquery2.default.extend(true, this.options, options);
            }

            /**
             * Destructor class that should be called to detach the plugin instance
             * from the DOM element it is associated with.
             */

        }, {
            key: "destroy",
            value: function destroy() {
                this.context.trigger("" + scopeName + this.constructor.name + ".destroy").removeClass(scopeName + this.constructor.name).removeData(scopeName + this.constructor.name).removeAttr("data-" + scopeName + this.constructor.name);
            }
        }]);

        return jQueryPlugin;
    }();

    /**
     * Adds a new stateful plugin to jQuery.
     *
     * @param {Class}  pluginClass An ES6 class the inherits from the jQueryPlugin
     *                             class exported by this module.
     * @param {Object} [defaults]  An optional plain object that defines the default
     *                             values to be placed in the options field on an
     *                             instance of pluginClass.
     */
    function addPlugin(pluginClass) {
        var defaults = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var name = pluginClass.name;

        /**
         * A function to handle the actual process of instantiating a plugin instance or calling a method on
         * a given plugin instance.
         *
         * @param {Object} element          DOM Element
         * @param {*}      method           Potential a string, otherwise ignored
         * @param {Array}  args             Array of arguments, includes the value
         *                                  the for method parameter
         * @returns {*}
         */
        function processPluginCall(element, method, args) {
            var $element = (0, _jquery2.default)(element),
                instance = $element.data(scopeName + name);
            if (instance instanceof pluginClass) {
                if (typeof method == "string" && typeof instance[method] == "function") {
                    return instance[method].apply(instance, _toConsumableArray(args.slice(1)));
                } else {
                    throw new jQueryPluginCreatorError(method + " is not a member of " + element);
                }
            } else if (typeof instance === "undefined") {
                var newInstance = new pluginClass(element, defaults, method);
                newInstance.init.apply(newInstance, _toConsumableArray(args));
                $element.data(scopeName + name, newInstance);
                return newInstance;
            } else {
                throw new jQueryPluginCreatorError("Namespace conflict on element");
            }
        }

        /**
         * TODO: Document
         *
         * @param {*} data
         * @returns {jQuery|*}
         */
        _jquery2.default.fn[name] = function (data) {
            var args = _jquery2.default.makeArray(arguments),
                result = this;
            if (this.length === 1) {
                result = processPluginCall(this[0], data, args);
            } else {
                if (data === "map") {
                    result = this.map(function () {
                        return processPluginCall(this, args[1], args.slice(2));
                    });
                } else {
                    result = this.each(function () {
                        processPluginCall(this, data, args);
                    });
                }
            }
            if (typeof result === "undefined") result = this;
            return result;
        };

        _jquery2.default.fn[name].defaults = defaults;
        _jquery2.default.fn[name].pluginClass = pluginClass;

        return name;
    }

    _jquery2.default.addPlugin = addPlugin;
    _jquery2.default.addPlugin.jQueryPlugin = jQueryPlugin;
});