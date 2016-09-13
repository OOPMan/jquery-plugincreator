import jQuery from "jQuery";
import test from "unitjs";

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

