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
     * Where a member exists in both hostObject and members, attaches a super function to
     * the member within members enabling it to call the associated member within hostObject.
     *
     * For example:
     *
     * hostObject.a = function (text) {
     *  alert(text);
     * }
     *
     * members.a = function (text) {
     *  alert(text);
     *  this.a.super(this, text);
     * };
     *
     * attachSuperFunctions(hostObject, members);
     *
     * @param {Object|function} hostObject
     * @param {Object} members
     * @returns {*}
     */
    function attachSuperFunctions(hostObject, members) {
        $.each(members, function (memberName, member) {
            if ($.isFunction(hostObject[memberName])) {
                var superMember = hostObject[memberName];
                member.super = function(thiz) {
                    return superMember.apply(thiz, $.makeArray(arguments).slice(1));
                };
            }
        });
        return members;
    }
    /**
     *
     * @param {jQuery} jQuery
     * @returns {{addPlugin: addPlugin, extendPlugin: extendPlugin}}
     */
    function pluginCreatorFactory(jQuery) {
        var $ = jQuery,
            /**
             *
             * @type {Object}
             */
            plugins = {},
            /**
             *
             * @type {{addPlugin: addPlugin, clonePlugin: clonePlugin, extendPlugin: extendPlugin}}
             */
            pluginCreator = {
                /**
                 * Adds a new stateful plugin to jQuery.
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
                        members = [$.extend({}, members || {})],
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

                    /**
                     * This function is used to instantiate an instance of the plugin on a given element.
                     *
                     * @param {Object} element
                     * @param {Object} options
                     * @param {Array} constructorArguments
                     */
                    function instantiatePlugin(element, options, constructorArguments) {
                        /**
                         *
                         */
                        var innerConstructor = function () {
                            this.element = element;
                            this.context = $(element).addClass(name);
                            this.options = $.extend(true, {}, $.fn[name].defaults, options);
                            constructor.apply(this, constructorArguments);
                        };
                        if (prototype) innerConstructor.prototype = prototype();
                        $.extend(true, innerConstructor.prototype, members[0], readonlyMembers);
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
                    $.fn[name].update = function(options) {
                        $.extend(true, $.fn[name].defaults, options);
                        return $.fn[name].defaults;
                    };
                    /**
                     *
                     * @param {Object} newMembers
                     * @returns {boolean}
                     */
                    $.fn[name].extend = function(newMembers) {
                        members.unshift($.extend(true, {}, members[0], attachSuperFunctions(members[0], newMembers)));
                        return true;
                    };
                    plugins[name] = {
                        constructor: constructor,
                        defaults: $.fn[name].defaults,
                        members: members,
                        prototype: prototype
                    };
                    return name;
                },
                /**
                 * Clones a plugin added using jQuery PluginCreator.
                 *
                 * While the defaults and members are cloned completely and are independent, the constructor is shared.
                 *
                 * @param {string} name
                 * @param {string} newName
                 * @returns {string}
                 */
                clonePlugin: function(name, newName) {
                    return pluginCreator.addPlugin(
                        newName,
                        plugins[name].constructor,
                        $.extend(true, {}, plugins[name].defaults),
                        $.extend(true, {}, plugins[name].members[0]),
                        plugins[name].prototype
                    );

                },
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
                extendPlugin: function(name, newName, constructor, defaults, members) {
                    var constructor = constructor || function () {},
                        defaults = $.extend(true, {}, defaults || {}),
                        members = $.extend(true, {}, members || {});
                    return pluginCreator.addPlugin(
                        newName,
                        function() {
                            plugins[name].constructor.apply(this, arguments);
                            constructor.apply(this, arguments);
                        },
                        $.extend(true, {}, plugins[name].defaults, defaults),
                        $.extend(true, {}, plugins[name].members[0], attachSuperFunctions(plugins[name].members[0], members)),
                        plugins[name].prototype
                    );
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

