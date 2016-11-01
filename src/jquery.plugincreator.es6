/*!
 * jQuery Plugin Creator v2.0.0
 * https://github.com/OOPMan/jquery-plugin-creator
 *
 * Copyright 2014 Adam Jorgensen
 * Released under the MIT license.
 * http://github.com/OOPMan/jquery-plugin-creator/LICENSE
 *
 */

import $ from "jquery";

let scopeName = "jquery-plugincreator-";

/**
 * Error class for jQuery PluginCreator errors
 */
export class jQueryPluginCreatorError extends Error {
    constructor(message, error) {
        super(message);
        this.message = message;
        this.error = error;
        this.name = "jQueryPluginCreatorError";
    }
}

/**
 * Base class for jQuery Plugins managed by jQuery Plugin Creator. If you want
 * to write a plugin that is compatible with this tool then this is the class
 * you need to extend.
 */
export class jQueryPlugin {
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
    constructor(element, defaults={}, options={}) {
        this.element = element;
        this.context = $(element).addClass(scopeName + this.constructor.name);
        this.options = Object.assign({}, defaults, options);
    }

    /**
     * Called once the constructor is done and the base plugin instance has
     * been configured. Receives the arguments passed into the the jQuery
     * plugin call the constructs the plugin instance.
     */
    init() { }

    /**
     * This helper function can be called to return a reference to the
     * plugin instance.
     *
     * @returns {Object}
     */
    getInstance() {
        return this;
    }

    /**
     * Update the options parameters associated with the class.
     *
     * @param {Object} options
     * @returns {Object}
     */
    update(options) {
        return $.extend(true, this.options, options);
    }

    /**
     * Destructor class that should be called to detach the plugin instance
     * from the DOM element it is associated with.
     */
    destroy() {
        this.context
            .trigger(`${scopeName}${this.constructor.name}.destroy`)
            .removeClass(scopeName + this.constructor.name)
            .removeData(scopeName + this.constructor.name)
            .removeAttr(`data-${scopeName}${this.constructor.name}`);
    }
}

/**
 * Adds a new stateful plugin to jQuery.
 *
 * @param {Class}  pluginClass An ES6 class the inherits from the jQueryPlugin
 *                             class exported by this module.
 * @param {Object} [defaults]  An optional plain object that defines the default
 *                             values to be placed in the options field on an
 *                             instance of pluginClass.
 */
export default function addPlugin(pluginClass, defaults={}) {
    let name = pluginClass.name;

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
        let $element = $(element),
            instance = $element.data(scopeName + name);
        if (instance instanceof pluginClass) {
            if (typeof method == "string" && typeof instance[method] == "function") {
                return instance[method](...args.slice(1));
            } else {
                throw new jQueryPluginCreatorError(`${method} is not a member of ${element}`);
            }
        } else if (typeof instance === "undefined") {
            let newInstance = new pluginClass(element, defaults, method);
            newInstance.init(...args);
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
    $.fn[name] = function (data) {
        var args = $.makeArray(arguments),
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

    $.fn[name].defaults = defaults;
    $.fn[name].pluginClass = pluginClass;

    return name;
}

$.addPlugin = addPlugin;
$.addPlugin.jQueryPlugin = jQueryPlugin;
