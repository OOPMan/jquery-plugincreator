/*!
 * jQuery Plugin Creator 0.3.0
 * https://github.com/OOPMan/jquery-plugin-creator
 *
 * Copyright 2014 Adam Jorgensen
 * Released under the MIT license.
 * http://github.com/OOPMan/jquery-plugin-creator/LICENSE
 *
 */
/**
 * TODO: Add checks to prevent over-writing plugins
 * TODO: Add ability to not specify plugin name and have a randomly generated name assigned
 */

import jQuery from "jQuery";
import esprima from "esprima";

let $ = jQuery,
    noOp = jQuery.noop,
    scopeName = "jquery-plugincreator-",
    /**
     * Given a function parameter name and a function, determines whether the function in question accepts the
     * named parameter.
     *
     * As this function is used internally to detect whether a function defines the _super parameter and given
     * that the _super parameter will always be the last parameter IF it is defined, the search is restricted
     * to the very last parameter defined for a given function.
     *
     * @param {function} inputFunction
     * @returns {boolean}
     */
    isSuperParameterDefinedForFunction = function (inputFunction) {
        var inputFunctionAST = esprima.parse("f = " + inputFunction.toString()),
            inputFunctionParams = inputFunctionAST.body[0].expression.right.params,
            firstInputFunctionParam = inputFunctionParams.shift();
        if (typeof firstInputFunctionParam == "undefined") return false;
        return firstInputFunctionParam.name == "_super";
    },
    /**
     *
     * @param {function} childMember
     * @param {function} parentMember
     * @returns {function}
     */
    parentWrapper = function (childMember, parentMember) {
        var parentMember = (parentMember == childMember ? noOp : parentMember),
            childMemberExpectsSuper = isSuperParameterDefinedForFunction(childMember);

        function parentGenerator(self) {
            var _super = parentMember;
            if (_super._isParentGenerator) _super = _super(self);
            else _super = function () {
                return parentMember.apply(self, arguments);
            };
            return function () {
                var args = $.makeArray(arguments);
                if (childMemberExpectsSuper) args.unshift(_super);
                return childMember.apply(self, args);
            };
        }

        parentGenerator._isParentGenerator = true;
        return parentGenerator;
    },
    /**
     *
     * @param {Object} childMembers
     * @param {Object} parentMembers
     * @param {Object} [self]
     * @returns {Object}
     */
    wrapParents = function (childMembers, parentMembers, self) {
        var childMembers = $.extend(true, {}, childMembers),
            parentMembers = $.extend(true, {}, parentMembers);
        for (var memberName in parentMembers) {
            if (childMembers[memberName]) {
                if (typeof childMembers[memberName] == "function" && !childMembers[memberName]._isParentGenerator) {
                    childMembers[memberName] = parentWrapper(childMembers[memberName], parentMembers[memberName]);
                    if (self) childMembers[memberName] = childMembers[memberName](self);
                }
            } else {
                childMembers[memberName] = parentMembers[memberName];
            }
        }
        return childMembers;
    },
    /**
     *
     * @type {{addPlugin: pluginCreator.addPlugin}}
     */
    pluginCreator = {
        /**
         * Adds a new stateful plugin to jQuery.
         *
         * A stateful plugin consists of the following optional components:
         * - An object defining default properties to be associated with a plugin instance via its options member
         * - An object defining member functions and values to be associated with a plugin instances prototype.
         *
         * @param {string} name
         * @param {Object} [defaults]
         * @param {Object} [members]
         * @return {string}
         */
        addPlugin: function (name, defaults, members) {
            var defaults = $.extend(true, {}, defaults || {}),
                baseMembers = {
                    /**
                     * Default init function. Does nothing.
                     */
                    init: noOp,
                    /**
                     *
                     * @returns {Object}
                     */
                    getInstance: function () {
                        return this;
                    },
                    /**
                     *
                     * @param {Object} [options]
                     * @returns {Object}
                     */
                    update: function (options) {
                        $.extend(true, this.options, options || {});
                    },
                    /**
                     *
                     * @param {Object} members
                     * @returns {boolean}
                     */
                    extend: function (members) {
                        $.extend(true, this, wrapParents(members, this, this));
                    },
                    /**
                     * Destructor function, performs the following:
                     *
                     * 1: Triggers a scopeName + name + ".destroy" (E.g. "jquery-plugincreator-myPlugin.destroy") event on the jQuery context (I.e. $(this) ) for the plugin instance.
                     * 2: Removes the scopeName + name (E.g. "jquery-plugincreator-myPlugin") class from the element linked to the plugin instance.
                     * 3: Removes the scopeName + name (E.g. "jquery-plugincreator-myPlugin") data value from the element linked to the plugin instance.
                     * 4: Removes the "data-" + scopeName + name (E.g. "data-jquery-plugincreator-myPlugin") attribute from the element linked to the plugin instance.
                     */
                    destroy: function () {
                        this.context
                            .trigger(scopeName + name + ".destroy")
                            .removeClass(scopeName + name)
                            .removeData(scopeName + name)
                            .removeAttr("data-" + scopeName + name);
                    }
                },
                members = $.isArray(members) ? members : [wrapParents(members, wrapParents(baseMembers, baseMembers))];

            /**
             * This function is used to instantiate an instance of the plugin on a given element.
             *
             * @param {Object} element
             * @param {Object} [options]
             * @param {Array} [initArguments]
             */
            function instantiatePlugin(element, options, initArguments) {
                var options = options || {},
                    prototype = $.extend(true, {}, members[0]),
                    instance = null;

                function pluginConstructor() {
                    this.instanceOf = name;
                    this.element = element;
                    this.context = $(element).addClass(scopeName + name);
                    this.options = $.extend(true, {}, defaults, options);
                    for (var memberName in prototype) {
                        if (typeof prototype[memberName] == "function" && prototype[memberName]._isParentGenerator) {
                            prototype[memberName] = prototype[memberName](this);
                        }
                    }
                    $.extend(true, this, prototype);
                    this.init.apply(this, initArguments);
                }

                instance = new pluginConstructor();
                $.data(element, scopeName + name, instance);
                return instance;
            }

            /**
             * A function to handle the actual process of instantiating a plugin instance or calling a method on
             * a given plugin instance.
             *
             * @param {Object} self
             * @param {Object|String} options
             * @param {Array} args
             * @returns {*}
             */
            function processPluginCall(self, options, args) {
                var instance = $.data(self, scopeName + name);
                if (instance) {
                    if (typeof options == "string" && typeof instance[options] == "function") { // call a method on the instance
                        return instance[options].apply(instance, args.slice(1));
                    } else if (typeof instance.update == "function" && $.isPlainObject(options)) { // call update on the instance
                        return instance.update.apply(instance, args);
                    } else {
                        throw options + " is not a member of " + self;
                    }
                } else {
                    return instantiatePlugin(self, options, args.slice(1));
                }
            }

            /**
             *
             * @param {Object|string} options
             * @returns {jQuery}
             */
            $.fn[name] = function (options) {
                var args = $.makeArray(arguments),
                    result = this;
                if (this.length === 1) {
                    result = processPluginCall(this[0], options, args);
                } else {
                    if (options === "map") {
                        result = this.map(function () {
                            return processPluginCall(this, args[1], args.slice(2));
                        });
                    } else {
                        result = this.each(function () {
                            processPluginCall(this, options, args);
                        });
                    }
                }
                if (typeof result == "undefined") result = this;
                return result;
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
            $.fn[name].updateDefaultsWith = function (options) {
                $.extend(true, defaults, options);
                return defaults;
            };

            /**
             *
             * @param {Object} childMembers
             * @returns {function}
             */
            $.fn[name].extendMembersWith = function (childMembers) {
                members.unshift(wrapParents(childMembers, members[0]));
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
                return pluginCreator.addPlugin(newName, defaults, $.extend(true, [], members));
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
             * @param {Object} [childMembers]
             * @return {string}
             */
            $.fn[name].extendTo = function (newName, childMembers) {
                $.fn[name].cloneTo(newName);
                $.fn[newName].extendMembersWith(childMembers);
            };

            return name;
        }
    };

jQuery.extend(jQuery, pluginCreator);

export default pluginCreator.addPlugin
