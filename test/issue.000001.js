/**
 * Test for https://github.com/OOPMan/jquery-plugincreator/issues/1
 *
 * _super method injection fails with functions expected to handle variable-length/optional argument lists
 */
"use strict";

describe("issue000001", function () {
    var test = unitjs,
        assert = unitjs.assert,
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
            },
            methodD: function () {
                this.options.testNumber = 0;
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
            methodA: function (_super, optionalParameter) {
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
            },
            methodD: function (_super, optionalParameter) {
                var args = jQuery.makeArray(arguments).slice(1);
                if (typeof _super == "function") _super();
                for (var i = 0; i < args.length; i ++) this.options.testNumber += args[i];
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

        it("jQuery.addPlugin('testPlugin0001', defaults, members) should create jQuery.fn.testPlugin0001", function () {
            jQuery.addPlugin("testPlugin0001", defaults, members);
            test.function(jQuery.fn.testPlugin0001)
                .object(jQuery.fn.testPlugin0001.defaults)
                    .is(defaults)
                .function(jQuery.fn.testPlugin0001.updateDefaultsWith)
                .function(jQuery.fn.testPlugin0001.extendMembersWith)
                .function(jQuery.fn.testPlugin0001.cloneTo)
                .function(jQuery.fn.testPlugin0001.extendTo);
        });

        it("jQuery.fn.testPlugin0001.extendTo('childOfTestPlugin0001', childMembers) should create jQuery.fn.childOfTestPlugin0001", function () {
            jQuery.fn.testPlugin0001.extendTo("childOfTestPlugin0001", childMembers);
            test.function(jQuery.fn.childOfTestPlugin0001)
                .object(jQuery.fn.childOfTestPlugin0001.defaults)
                    .is(defaults)
                .function(jQuery.fn.childOfTestPlugin0001.updateDefaultsWith)
                .function(jQuery.fn.childOfTestPlugin0001.extendMembersWith)
                .function(jQuery.fn.childOfTestPlugin0001.cloneTo)
                .function(jQuery.fn.childOfTestPlugin0001.extendTo);
        });


    });

    describe("jQuery('#unique').testPlugin0001()", function () {
        it("should instantiate testPlugin0001 on #unique", function () {
            this.instance = unique.testPlugin0001();
            test.object(this.instance);
        });
        it("should copy the contents of `defaults` into the `options` member on the testPlugin0001 instance", function () {
            test.object(this.instance.options).is(defaults);
        });

        describe("jQuery('#unique').testPlugin0001('methodA')", function () {
            it("should call `methodA` on the testPlugin0001 instance, causing the `testNumber` in the `options` member on the testPlugin0001 to be incremented by 1", function () {
                unique.testPlugin0001("methodA");
                test.number(unique.testPlugin0001("getInstance").options.testNumber).is(2);
            });
        });

        describe("jQuery('#unique').testPlugin0001('methodB')", function () {
            it("should call `methodB` on the testPlugin0001 instance, causing the `testNumber` in the `options` member on the testPlugin0001 to be decremented by 1", function () {
                unique.testPlugin0001("methodB");
                test.number(unique.testPlugin0001("getInstance").options.testNumber).is(1);
            });
        });

        describe("jQuery('#unique').testPlugin0001('methodC')", function () {
            it("should call `methodC` on the testPlugin0001 instance, causing the `testNumber` in the `options` member on the testPlugin0001 to be set to 100", function () {
                unique.testPlugin0001("methodC");
                test.number(unique.testPlugin0001("getInstance").options.testNumber).is(100);
            });
        });

        describe("jQuery('#unique').testPlugin0001('methodD')", function () {
            it("should call `methodD` on the testPlugin0001 instance, causing the `testNumber` in the `options` member on the testPlugin0001 to be set to 0", function () {
                unique.testPlugin0001("methodD");
                test.number(unique.testPlugin0001("getInstance").options.testNumber).is(0);
            });
        });
    });

    describe("jQuery('#unique').childOfTestPlugin0001()", function () {
        it("should instantiate childOfTestPlugin0001 on #unique", function () {
            this.instance = unique.childOfTestPlugin0001();
            test.object(this.instance);
        });
        it("should copy the contents of `defaults` into the `options` member on the childOfTestPlugin0001 instance", function () {
            test.object(this.instance.options).is(defaults);
        });

        describe("jQuery('#unique').childOfTestPlugin0001('methodA', 2)", function () {
            it("should call `methodA` on the testPlugin0001 instance, causing the `testNumber` in the `options` member on the testPlugin0001 to be incremented by 3 in total", function () {
                unique.childOfTestPlugin0001("methodA", 2);
                test.number(unique.childOfTestPlugin0001("getInstance").options.testNumber).is(4);
            });
        });

        describe("jQuery('#unique').childOfTestPlugin0001('methodA')", function () {
            it("should call `methodA` on the testPlugin0001 instance, causing the `testNumber` in the `options` member on the testPlugin0001 to be incremented by 1 in total", function () {
                unique.childOfTestPlugin0001("methodA");
                test.number(unique.childOfTestPlugin0001("getInstance").options.testNumber).is(5);
            });
        });

        describe("jQuery('#unique').childOfTestPlugin0001('methodB', 2)", function () {
            it("should call `methodB` on the testPlugin0001 instance, causing the `testNumber` in the `options` member on the testPlugin0001 to be decremented by 2", function () {
                unique.childOfTestPlugin0001("methodB", 2);
                test.number(unique.childOfTestPlugin0001("getInstance").options.testNumber).is(3);
            });
        });

        describe("jQuery('#unique').childOfTestPlugin0001('methodB')", function () {
            it("should call `methodB` on the testPlugin0001 instance, causing the `testNumber` in the `options` member on the testPlugin0001 to be decremented by 1", function () {
                unique.childOfTestPlugin0001("methodB");
                test.number(unique.childOfTestPlugin0001("getInstance").options.testNumber).is(2);
            });
        });

        describe("jQuery('#unique').childOfTestPlugin0001('methodC')", function () {
            it("should call `methodC` on the testPlugin0001 instance, causing the `testNumber` in the `options` member on the testPlugin0001 to be set to -100", function () {
                unique.childOfTestPlugin0001("methodC");
                test.number(unique.childOfTestPlugin0001("getInstance").options.testNumber).is(-100);
            });
        });

        describe("jQuery('#unique').childOfTestPlugin0001('methodD')", function () {
            it("should call `methodD` on the testPlugin0001 instance, causing the `testNumber` in the `options` member on the testPlugin0001 to be set to 10", function () {
                unique.childOfTestPlugin0001("methodD", 1, 2, 3, 4);
                test.number(unique.childOfTestPlugin0001("getInstance").options.testNumber).is(10);
            });
        });
    });
});
