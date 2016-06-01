/**
 * Test for https://github.com/OOPMan/jquery-plugincreator/issues/2
 */
"use strict";

describe("issue000002", function () {
    var test = unitjs,
        assert = unitjs.assert,
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

        it("jQuery.addPlugin('testPlugin0002', defaults, members) should create jQuery.fn.testPlugin0002", function () {
            jQuery.addPlugin("testPlugin0002", defaults, members);
            test.function(jQuery.fn.testPlugin0002)
                .object(jQuery.fn.testPlugin0002.defaults)
                    .is(defaults)
                .function(jQuery.fn.testPlugin0002.updateDefaultsWith)
                .function(jQuery.fn.testPlugin0002.extendMembersWith)
                .function(jQuery.fn.testPlugin0002.cloneTo)
                .function(jQuery.fn.testPlugin0002.extendTo);
        });

        it("jQuery.fn.testPlugin0002.extendTo('childOfTestPlugin0002', childMembers) should create jQuery.fn.childOfTestPlugin0002", function () {
            jQuery.fn.testPlugin0002.extendTo("childOfTestPlugin0002", childMembers);
            test.function(jQuery.fn.childOfTestPlugin0002)
                .object(jQuery.fn.childOfTestPlugin0002.defaults)
                    .is(defaults)
                .function(jQuery.fn.childOfTestPlugin0002.updateDefaultsWith)
                .function(jQuery.fn.childOfTestPlugin0002.extendMembersWith)
                .function(jQuery.fn.childOfTestPlugin0002.cloneTo)
                .function(jQuery.fn.childOfTestPlugin0002.extendTo);
        });
    });

    describe("jQuery('#unique').testPlugin0002()", function () {
        it("should instantiate testPlugin0002 on #unique", function () {
            this.instance = unique.testPlugin0002();
            test.object(this.instance);
        });
        it("should copy the contents of `defaults` into the `options` member on the testPlugin0002 instance", function () {
            test.object(this.instance.options).is(defaults);
        });

        describe("jQuery('#unique').testPlugin0002('methodA')", function () {
            it("should call `methodA` on the testPlugin0002 instance, causing the `testNumber` in the `options` member on the testPlugin0002 to be incremened by 1", function () {
                unique.testPlugin0002("methodA");
                test.number(unique.testPlugin0002("getInstance").options.testNumber).is(1);
            });
        });
    });

    describe("jQuery('#unique').childOfTestPlugin0002()", function () {
        it("should instantiate childOfTestPlugin0002 on #unique", function () {
            this.instance = unique.childOfTestPlugin0002();
            test.object(this.instance);
        });
        it("should copy the contents of `defaults` into the `options` member on the childOfTestPlugin0002 instance", function () {
            test.object(this.instance.options).is(defaults);
        });

        describe("jQuery('#unique').childOfTestPlugin0002('methodA')", function () {
            it("should call `methodA` on the testPlugin0002 instance, causing the `testNumber` in the `options` member on the testPlugin0002 to be incremented by 1", function () {
                unique.childOfTestPlugin0002("methodA");
                test.number(unique.childOfTestPlugin0002("getInstance").options.testNumber).is(2);
            });
        });
    });
});
