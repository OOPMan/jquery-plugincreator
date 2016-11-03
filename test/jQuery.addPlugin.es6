/**
 * You may be looking at these imports and going:
 *
 * "Hey, that's not right. jQuery comes from the 'jquery' NPM module while
 *  Unit.JS comes from the 'unit.js' NPM module"
 *
 *  You are correct in thinking this and when using jQuery Plugin Creator in
 *  a proper ES6 environment that supports modules (E.g. Webpack + Babel) you
 *  should import stuff the right way.
 *
 *  In the case of these tests, however, the code is written such that it is
 *  compatible with being run in a global browser environment. As the
 *  babel-plugin-transform-es2015-modules-umd module does not allow for
 *  customisation of the global imports it is thus
 */
import jQuery from "jquery";
import addPlugin, {jQueryPlugin} from "../dist/jquery.plugincreator";
import test from "unit.js";

describe("jQuery.addPlugin", function () {
    var unique = jQuery("#unique"),
        assert = test.assert;

    describe("Pre-flight checks", function () {
        it("jQuery.addPlugin should be a function", function() {
            test.function(jQuery.addPlugin).is(jQuery.addPlugin);
        });

        it("jQuery.addPlugin.jQueryPlugin should be a function", function () {
            test.function(jQuery.addPlugin.jQueryPlugin).is(jQuery.addPlugin.jQueryPlugin);
        });

        it("jQuery('#unique') should contain a single item", function () {
            test.number(unique.length).is(1);
        });
    });

    describe("jQuery.addPlugin(testPlugin)", function () {
        class testPlugin extends jQuery.addPlugin.jQueryPlugin {}

        it("should create jQuery.fn.testPlugin", function () {
            jQuery.addPlugin(testPlugin);
            test.function(jQuery.fn.testPlugin)
                .object(jQuery.fn.testPlugin.defaults);
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

    describe("jQuery.addPlugin(testPlugin1, defaults)", function () {
        class testPlugin1 extends jQuery.addPlugin.jQueryPlugin {}

        it("should create jQuery.fn.testPlugin1", function () {
            jQuery.addPlugin(testPlugin1, {
                test: true
            });
            test.function(jQuery.fn.testPlugin1);
        });

        describe("jQuery('#unique').testPlugin1()", function () {
            it("should instantiate testPlugin1 on #unique", function () {
                unique.testPlugin1();
            });
            it("should make `defaults` available to the instance via the `options` member created during instantiation", function () {
                var instance = unique.data("jquery-plugincreator-testPlugin1");
                test.object(instance)
                    .hasProperty("options")
                    .object(instance.options)
                    .hasProperty("test", true);
            });
            after(function () {
                unique.testPlugin1("destroy");
            });
        });
    });

    describe("jQuery.addPlugin(testPlugin2)", function () {
        class testPlugin2 extends jQuery.addPlugin.jQueryPlugin {
            init(arg) {
                this.initCalled = true;
                this.testValue = true;
                this.argValue = arg;
            }
            testFunction1() {
                this.testFunctionResult = true;
            }
            testFunction2(parameter) {
                this.testFunctionResult = parameter;
            }
        }

        it("should create jQuery.fn.testPlugin2", function () {
            jQuery.addPlugin(testPlugin2);
            test.function(jQuery.fn.testPlugin2);
        });

        describe("jQuery('#unique').testPlugin2()", function () {
            it("should instantiate testPlugin2 on #unique", function () {
                unique.testPlugin2({}, "yes");
                this.instance = unique.data("jquery-plugincreator-testPlugin2");
            });
            it("should make `members` available to the instance via the prototype", function () {
                test.object(this.instance)
                        .hasProperty("testValue", true)
                        .hasProperty("argValue", "yes")
                    .function(this.instance.testFunction1)
                    .function(this.instance.testFunction2);
            });
            it("should call the `init` member on the instance if it exists", function () {
                test.object(this.instance)
                        .hasProperty("initCalled", true);
            });
        });

        describe("jQuery('#unique').testPlugin2('testFunction1')", function () {
            it("should set `testFunctionResult` on the instance to `true`", function () {
                var instance = unique.data("jquery-plugincreator-testPlugin2");
                unique.testPlugin2("testFunction1");
                test.object(instance)
                        .hasProperty("testFunctionResult", true);
            });
        });

        describe("jQuery('#unique').testPlugin2('testFunction2', 'someValue')", function () {
            it("should set `testFunctionResult` on the instance to `someValue`", function () {
                var instance = unique.data("jquery-plugincreator-testPlugin2");
                unique.testPlugin2("testFunction2", "someValue");
                test.object(instance)
                        .hasProperty("testFunctionResult", "someValue");
            });
            after(function () {
                unique.testPlugin2("destroy");
            });
        });
    });
});

