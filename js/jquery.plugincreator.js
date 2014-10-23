/*!
 * jQuery Plugin Creator @VERSION
 * https://github.com/OOPMan/jquery-plugin-creator
 *
 * Copyright 2014 Adam Jorgensen
 * Released under the MIT license.
 * http://github.com/OOPMan/jquery-plugin-creator/LICENSE
 *
 */
/**
 * TODO: Add checks to prevent over-writing plugins
 * TODO: Add checks to prevent re-instantating plugins
 * TODO: Add plugin destruction handling
 * TODO: Add ability to control whether extendPlugin calls parent constructor
 * TODO: Add ability to not specify plugin name and have a randomly generated name assigned
 */
"use strict";
(function () {
    /**
     *
     * @param {jQuery} jQuery
     * @returns {{addPlugin: addPlugin}}
     */
    function pluginCreatorFactory(jQuery) {
        var $ = jQuery,
            /**
             *
             * @type {{addPlugin: addPlugin}}
             */
            pluginCreator = {
                /**
                 * Adds a new stateful plugin to jQuery.
                 *
                 * A stateful plugin consists of the following optional components:
                 * - A constructor function to be executed when the plugin is instantiated on a given element.
                 * - An object defining default properties to be associated with a plugin instance via its options member
                 * - An object defining member functions and values to be associated with a plugin instances prototype.
                 * - A prototype function to be used as the plugin instances prototype when the plugin is instantiate on a given element.
                 *
                 * @param {string} name
                 * @param {function} [constructor]
                 * @param {Object} [defaults]
                 * @param {Object} [members]
                 * @param {function} [prototype]
                 * @return {string}
                 */
                addPlugin: function (name, constructor, defaults, members, prototype) {
                    var constructor = constructor || function () {},
                        defaults = $.extend({}, defaults || {}),
                        members = $.extend({}, members || {}),
                        prototype = prototype || function () {},
                        prototypes = [prototype],
                        readonlyMembers = {
                            /**
                             *
                             * @param {Object} options
                             * @returns {Object}
                             */
                            update: function (options) {
                                $.extend(true, this.options, options);
                                return this.options;
                            },
                            /**
                             *
                             * @param {Object} members
                             * @returns {boolean}
                             */
                            extend: function (members) {
                                $.extend(true, this, attachSuperFunctions(this, members), readonlyMembers);
                                return true;
                            }
                        };
                    $.extend(true, prototype, members, readonlyMembers);

                    /**
                     * This function is used to instantiate an instance of the plugin on a given element.
                     *
                     * @param {Object} element
                     * @param {Object} [options]
                     * @param {Array} [constructorArguments]
                     */
                    function instantiatePlugin(element, options, constructorArguments) {
                        var options = options || {},
                            innerConstructor = function () {
                                this.element = element;
                                this.context = $(element).addClass(name);
                                this.options = $.extend(true, {}, $.fn[name].defaults, options);
                                constructor.apply(this, constructorArguments);
                            };
                        innerConstructor.prototype = new prototypes[0]();
                        $.data(element, name, new innerConstructor());
                    }

                    // Add Plugin
                    /**
                     *
                     * @param {Object|string} options
                     * @returns {jQuery}
                     */
                    $.fn[name] = function(options) {
                        var args = $.makeArray(arguments);
                        return this.each(function() {
                            var instance = $.data(this, name);
                            if (instance) {
                                if (typeof options == "string") { // call a method on the instance
                                    instance[options].apply(instance, args.slice(1));
                                } else if (instance.update) { // call update on the instance
                                    instance.update.apply(instance, args);
                                }
                            } else {
                                instantiatePlugin(this, options, args.slice(1));
                            }
                        })
                    };
                    /**
                     *
                     * @type {Object}
                     */
                    $.fn[name].defaults = defaults;
                    /**
                     *
                     * @param {Object} options
                     * @returns {Object}
                     */
                    $.fn[name].updateDefaultsWith = function(options) {
                        $.extend(true, $.fn[name].defaults, options);
                        return $.fn[name].defaults;
                    };
                    /**
                     *
                     * @param {Object} members
                     * @param {function} [prototype]
                     * @returns {function}
                     */
                    $.fn[name].extendMembersWith = function(members, prototype) {
                        var prototype = prototype || function prototype() {};
                        prototype.prototype = new prototypes[0]();
                        $.extend(true, prototype, members, readonlyMembers);
                        prototypes.unshift(prototype);
                        return prototype;
                    };
                    /**
                     * Clones a plugin added using jQuery PluginCreator.
                     *
                     * While the defaults and members are cloned completely and are independent, the constructor is shared.
                     *
                     * @param {string} name
                     * @param {string} newName
                     * @returns {string}
                     */
                    $.fn[name].cloneTo = function (newName) {
                        return pluginCreator.addPlugin(newName, constructor, defaults, members, prototype);
                    };
                    /**
                     * Extends a plugin added using jQuery PluginCreator.
                     *
                     * Defaults and members are cloned and extended from the original plugin while the extended constructor
                     * functions such that the constructor for the original plugin is called first, then new new
                     * constructor, if present.
                     *
                     * @param {string} name
                     * @param {string} newName
                     * @param {function()} [constructor]
                     * @param {Object} [defaults]
                     * @param {Object} [members]
                     * @return {string}
                     */
                     $.fn[name].extendTo = function (newName, members, prototype) {
                        var prototype = prototype || function () {};
                        $.fn[name].cloneTo(newName);
                        $.fn[newName].extendMembersWith(members, prototype);
                     };
                    return name;
                }
        };
        return pluginCreator;
    }
    // Export jQuery Plugin Creator
    if (typeof define === "function" && define.amd) {
        define(["jquery"], function(jQuery) {
            var pluginCreator = pluginCreatorFactory(jQuery);
            jQuery.extend(jQuery, pluginCreator);
            return pluginCreator;
        });
    } else if (typeof jQuery !== "undefined")  {
        jQuery.extend(jQuery, pluginCreatorFactory(jQuery));
    } else {
        throw "jQuery not defined";
    }
})();

