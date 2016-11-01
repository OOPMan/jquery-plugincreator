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


});

