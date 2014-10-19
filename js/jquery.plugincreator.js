/*!
 * jQuery Plugin Creator @VERSION
 * https://github.com/OOPMan/jquery-plugin-creator
 *
 * Copyright 2014 Adam Jorgensen
 * Released under the MIT license.
 * http://github.com/OOPMan/jquery-plugin-creator/LICENSE
 *
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
                    var defaults = $.extend({}, defaults || {}),
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
                        function innerConstructor () {
                            this.element = $(element).addClass("test");
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
                    $.fn.test.extend = function(members) {
                        return members.unshift($.extend({}, members[0], members));
                    };
                },
                /**
                 *
                 * @param name
                 */
                extendPlugin: function (name) {

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

