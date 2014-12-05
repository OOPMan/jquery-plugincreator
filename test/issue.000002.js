/**
 * Test for https://github.com/OOPMan/jquery-plugincreator/issues/2
 */
"use strict";
var test = require("unit.js"),
    assert = test.assert,
    common = require("./common.js");

describe("issue000002", function () {
    var window = common.getWindow(),
        jQuery = common.getjQuery(window),
        unique = jQuery("#unique"),
        nonUnique = jQuery(".non-unique"),
        defaults = {
            testNumber: 0
        },
        members = {
            methodA: function () {
                this.options.testNumber = 1;
            }
        },
        childMembers = {
            methodA: function () {
                this.options.testNumber = 2;
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
            it("should call `methodA` on the testPlugin instance, causing the `testNumber` in the `options` member on the testPlugin to be incremened by 1", function () {
                unique.testPlugin("methodA");
                test.number(unique.testPlugin("getInstance").options.testNumber).is(1);
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

        describe("jQuery('#unique').childOfTestPlugin('methodA')", function () {
            it("should call `methodA` on the testPlugin instance, causing the `testNumber` in the `options` member on the testPlugin to be incremented by 1", function () {
                unique.childOfTestPlugin("methodA");
                test.number(unique.childOfTestPlugin("getInstance").options.testNumber).is(2);
            });
        });
    });
});
