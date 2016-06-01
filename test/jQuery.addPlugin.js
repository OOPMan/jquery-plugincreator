"use strict";

describe("jQuery.addPlugin", function () {
    var unique = jQuery("#unique"),
        test = unitjs,
        assert = unitjs.assert;
    
    describe("Pre-flight checks", function () {
        it("jQuery.addPlugin should be a function", function() {
            test.function(jQuery.addPlugin);
        });

        it("jQuery('#unique') should contain a single item", function () {
            test.number(unique.length).is(1);
        });
    });

    describe("jQuery.addPlugin('testPlugin')", function () {
        it("should create jQuery.fn.testPlugin", function () {
            jQuery.addPlugin("testPlugin");
            test.function(jQuery.fn.testPlugin)
                .object(jQuery.fn.testPlugin.defaults)
                .function(jQuery.fn.testPlugin.updateDefaultsWith)
                .function(jQuery.fn.testPlugin.extendMembersWith)
                .function(jQuery.fn.testPlugin.cloneTo)
                .function(jQuery.fn.testPlugin.extendTo);
        });

        describe("jQuery('#unique').testPlugin()", function () {
            it("should instantiate testPlugin on #unique", function () {
                unique.testPlugin();
                test.object(unique.data("jquery-plugincreator-testPlugin"));
            });
        });

        describe("jQuery('#unique').testPlugin('destroy')", function () {
            it("should destroy testPlugin on #unique", function () {
                unique.testPlugin("destroy");
                test.undefined(unique.data("jquery-plugincreator-testPlugin"));
            });
        });
    });

    describe("jQuery.addPlugin('testPlugin', defaults)", function () {
        it("should create jQuery.fn.testPlugin", function () {
            jQuery.addPlugin("testPlugin", {
                test: true
            });
            test.function(jQuery.fn.testPlugin);
        });

        describe("jQuery('#unique').testPlugin()", function () {
            it("should instantiate testPlugin on #unique", function () {
                unique.testPlugin();
            });
            it("should make `defaults` available to the instance via the `options` member created during instantiation", function () {
                var instance = unique.data("jquery-plugincreator-testPlugin");
                test.object(instance)
                    .hasProperty("options")
                    .object(instance.options)
                    .hasProperty("test", true);
            });
            after(function () {
                unique.testPlugin("destroy");
            });
        });
    });

    describe("jQuery.addPlugin('testPlugin', null, members)", function () {
        it("should create jQuery.fn.testPlugin", function () {
            jQuery.addPlugin("testPlugin", null, {
                init: function () {
                    this.initCalled = true;
                },
                testValue: true,
                testFunction1: function () {
                    this.testFunctionResult = true;
                },
                testFunction2: function (parameter) {
                    this.testFunctionResult = parameter;
                }
            });
            test.function(jQuery.fn.testPlugin);
        });

        describe("jQuery('#unique').testPlugin()", function () {
            it("should instantiate testPlugin on #unique", function () {
                unique.testPlugin();
                this.instance = unique.data("jquery-plugincreator-testPlugin");
            });
            it("should make `members` available to the instance via the prototype", function () {
                test.object(this.instance)
                        .hasProperty("testValue", true)
                    .function(this.instance.testFunction1)
                    .function(this.instance.testFunction2);
            });
            it("should call the `_init` member on the instance if it exists", function () {
                test.object(this.instance)
                        .hasProperty("initCalled", true);
            });
        });

        describe("jQuery('#unique').test('testFunction1')", function () {
            it("should set `testFunctionResult` on the instance to `true`", function () {
                var instance = unique.data("jquery-plugincreator-testPlugin");
                unique.testPlugin("testFunction1");
                test.object(instance)
                        .hasProperty("testFunctionResult", true);
            });
        });

        describe("jQuery('#unique').test('testFunction2', 'someValue')", function () {
            it("should set `testFunctionResult` on the instance to `someValue`", function () {
                var instance = unique.data("jquery-plugincreator-testPlugin");
                unique.testPlugin("testFunction2", "someValue");
                test.object(instance)
                        .hasProperty("testFunctionResult", "someValue");
            });
            after(function () {
                unique.testPlugin("destroy");
            });
        });
    });
});


