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
 * TODO: Add ability to control whether extendPlugin calls parent constructor
 */
(function () {
    /**
     *
     * @param jQuery
     * @returns {{addPlugin: addPlugin, extendPlugin: extendPlugin}}
     */
    function pluginCreatorFactory(jQuery) {
        var $ = jQuery,
            plugins = {},
            pluginCreator = {
                /**
                 *
                 * @param name
                 * @param constructor
                 * @param defaults
                 * @param members
                 */
                addPlugin: function (name, constructor, defaults, members) {
                    var constructor = constructor || function () {},
                        defaults = $.extend({}, defaults || {}),
                        members = [$.extend({},members || {})],
                        readonlyMembers = {
                            update: function (options) {
                                this.options = $.extend(this.options, options);
                            },
                            extend: function (members) {
                                $.extend(this, members, readonlyMembers);
                            }
                        };

                    /**
                     *
                     * @param element
                     * @param options
                     */
                    function init(element, options) {
                        /**
                         *
                         */
                        var innerConstructor = function () {
                            this.element = $(element).addClass(name);
                            this.options = $.extend({}, $.fn[name].defaults, options);
                            constructor.apply(this);
                        };
                        $.extend(innerConstructor.prototype, members[0], readonlyMembers);
                        $.data(element, name, new innerConstructor());
                    }

                    // Add Plugin
                    /**
                     *
                     * @param options
                     * @returns {*}
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
                                init(this, options);
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
                     * @param members
                     * @returns {Number}
                     */
                    $.fn[name].extend = function(members) {
                        return members.unshift($.extend({}, members[0], members));
                    };
                    plugins[name] = {
                        constructor: constructor,
                        defaults: defaults,
                        members: members
                    };
                    return name;
                },
                /**
                 *
                 * @param name
                 * @param newName
                 * @param constructor
                 * @param defaults
                 * @param members
                 */
                extendPlugin: function (name, newName, constructor, defaults, members) {
                    var constructor = constructor || function () {},
                        defaults = $.extend({}, defaults || {}),
                        members = [$.extend({},members || {})];
                    return pluginCreator.addPlugin(
                        newName,
                        function() {
                            plugins[name].constructor.apply(this);
                            constructor.apply(this);
                        },
                        $.extend({}, plugins[name].defaults, defaults),
                        $.extend({}, plugins[name].members, members)
                    );
                }
        };
        return pluginCreator;
    }
    // Export jQuery Plugin Creator
    if (typeof define === "function" && define.amd) {
        define(["jquery"], pluginCreatorFactory);
    } else if (typeof jQuery !== "undefined")  {
        jQuery.extend(jQuery, pluginCreatorFactory(jQuery));
    } else {
        throw "jQuery not defined";
    }
})();

