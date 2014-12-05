/**
 * Test for https://github.com/OOPMan/jquery-plugincreator/issues/1
 *
 * _super method injection fails with functions expected to handle variable-length/optional argument lists
 */
"use strict";
var test = require("unit.js"),
    assert = test.assert,
    common = require("./common.js");

describe("issue000001", function () {
    var window = common.getWindow(),
        jQuery = common.getjQuery(window),
        unique = jQuery("#unique"),
        nonUnique = jQuery(".non-unique"),
        defaults = {
            testNumber: 1
        },
        members = {
            methodA: function () {
                this.options.testNumber += 1;
            },
            methodB: function () {
                this.options.testNumber -= 1;
            },
            methodC: function () {
                this.options.testNumber = 100;
            }
        },
        childMembers = {
            /**
             * This function will override the methodA function in members.
             *
             * If the jQuery-PluginCreator inheritance system is working correctly then the function should execute
             * correctly if the optional parameter is omitted. In such an event:
             *
             * optionalParameter will be undefined
             * _super will be a reference to the methodA function in members.
             * *
             * @param {number} [optionalParameter]
             * @param {Function} _super
             */
            methodA: function (optionalParameter, _super) {
                if (typeof optionalParameter != "undefined" && typeof optionalParameter != "function") this.options.testNumber += optionalParameter;
                if (typeof _super == "function") _super();
            },
            /**
             * This function will override the methodB function in members.
             *
             * If the jQuery-PluginCreator inheritance system is working correctly then the function should execute
             * correctly if the optional parameter is omitted. In such an event:
             *
             * optionalParameter will be undefined
             * _super will NOT be injected into the arguments list
             *
             * @param {number} [optionalParameter]
             */
            methodB: function (optionalParameter) {
                if (typeof optionalParameter != "undefined" && typeof optionalParameter != "function") this.options.testNumber -= optionalParameter;
                else if (typeof optionalParameter == "function") this.options.testNumber -= 2;
                else this.options.testNumber -= 1;
            },
            /**
             * This function will override the methodC function in members.
             *
             * If the jQuery-PluginCreator inheritance system is working correctly then the function the _super parameter
             * will be populated.
             *
             * @param _super
             */
            methodC: function (_super) {
                if (typeof _super == "function") this.options.testNumber = -100;
            }
        };

    describe("Pre-flight checks", function () {
        it("jQuery.addPlugin should be a function", function () {
            test.function(jQuery.addPlugin);
        });

        it("jQuery('#unique') should contain a single item", function () {
            test.number(unique.length).is(1);
        });

        it("jQuery('.non-unique') should contain 4 items", function () {
            test.number(nonUnique.length).is(4);
        });

        it("jQuery.addPlugin('testPlugin', defaults, members) should create jQuery.fn.testPlugin", function () {
            jQuery.addPlugin("testPlugin", defaults, members);
            test.function(jQuery.fn.testPlugin)
                .object(jQuery.fn.testPlugin.defaults)
                    .is(defaults)
                .function(jQuery.fn.testPlugin.updateDefaultsWith)
                .function(jQuery.fn.testPlugin.extendMembersWith)
                .function(jQuery.fn.testPlugin.cloneTo)
                .function(jQuery.fn.testPlugin.extendTo);
        });

        it("jQuery.fn.testPlugin.extendTo('childOfTestPlugin', childMembers) should create jQuery.fn.childOfTestPlugin", function () {
            jQuery.fn.testPlugin.extendTo("childOfTestPlugin", childMembers);
            test.function(jQuery.fn.childOfTestPlugin)
                .object(jQuery.fn.childOfTestPlugin.defaults)
                    .is(defaults)
                .function(jQuery.fn.childOfTestPlugin.updateDefaultsWith)
                .function(jQuery.fn.childOfTestPlugin.extendMembersWith)
                .function(jQuery.fn.childOfTestPlugin.cloneTo)
                .function(jQuery.fn.childOfTestPlugin.extendTo);
        });


    });

    describe("jQuery('#unique').testPlugin()", function () {
        it("should instantiate testPlugin on #unique", function () {
            this.instance = unique.testPlugin();
            test.object(this.instance);
        });
        it("should copy the contents of `defaults` into the `options` member on the testPlugin instance", function () {
            test.object(this.instance.options).is(defaults);
        });

        describe("jQuery('#unique').testPlugin('methodA')", function () {
            it("should call `methodA` on the testPlugin instance, causing the `testNumber` in the `options` member on the testPlugin to be incremented by 1", function () {
                unique.testPlugin("methodA");
                test.number(unique.testPlugin("getInstance").options.testNumber).is(2);
            });
        });

        describe("jQuery('#unique').testPlugin('methodB')", function () {
            it("should call `methodB` on the testPlugin instance, causing the `testNumber` in the `options` member on the testPlugin to be decremented by 1", function () {
                unique.testPlugin("methodB");
                test.number(unique.testPlugin("getInstance").options.testNumber).is(1);
            });
        });

        describe("jQuery('#unique').testPlugin('methodC')", function () {
            it("should call `methodC` on the testPlugin instance, causing the `testNumber` in the `options` member on the testPlugin to be set to 100", function () {
                unique.testPlugin("methodC");
                test.number(unique.testPlugin("getInstance").options.testNumber).is(100);
            });
        });
    });

    describe("jQuery('#unique').childOfTestPlugin()", function () {
        it("should instantiate childOfTestPlugin on #unique", function () {
            this.instance = unique.childOfTestPlugin();
            test.object(this.instance);
        });
        it("should copy the contents of `defaults` into the `options` member on the childOfTestPlugin instance", function () {
            test.object(this.instance.options).is(defaults);
        });

        describe("jQuery('#unique').childOfTestPlugin('methodA', 2)", function () {
            it("should call `methodA` on the testPlugin instance, causing the `testNumber` in the `options` member on the testPlugin to be incremented by 3 in total", function () {
                unique.childOfTestPlugin("methodA", 2);
                test.number(unique.childOfTestPlugin("getInstance").options.testNumber).is(4);
            });
        });

        describe("jQuery('#unique').childOfTestPlugin('methodA')", function () {
            it("should call `methodA` on the testPlugin instance, causing the `testNumber` in the `options` member on the testPlugin to be incremented by 1 in total", function () {
                unique.childOfTestPlugin("methodA");
                test.number(unique.childOfTestPlugin("getInstance").options.testNumber).is(5);
            });
        });

        describe("jQuery('#unique').childOfTestPlugin('methodB', 2)", function () {
            it("should call `methodB` on the testPlugin instance, causing the `testNumber` in the `options` member on the testPlugin to be decremented by 2", function () {
                unique.childOfTestPlugin("methodB", 2);
                test.number(unique.childOfTestPlugin("getInstance").options.testNumber).is(3);
            });
        });

        describe("jQuery('#unique').childOfTestPlugin('methodB')", function () {
            it("should call `methodB` on the testPlugin instance, causing the `testNumber` in the `options` member on the testPlugin to be decremented by 1", function () {
                unique.childOfTestPlugin("methodB");
                test.number(unique.childOfTestPlugin("getInstance").options.testNumber).is(2);
            });
        });

        describe("jQuery('#unique').childOfTestPlugin('methodC')", function () {
            it("should call `methodC` on the testPlugin instance, causing the `testNumber` in the `options` member on the testPlugin to be set to -100", function () {
                unique.childOfTestPlugin("methodC");
                test.number(unique.childOfTestPlugin("getInstance").options.testNumber).is(-100);
            });
        });
    });
});
