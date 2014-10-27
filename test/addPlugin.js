var test = require("unit.js"),
    assert = test.assert,
    common = require("./common.js");

describe("require('pluginCreator')", function () {
    common.withTestHtmlIt("should create jQuery.addPlugin", function (errors, window, jQuery, pluginCreator) {
        describe("pluginCreator.addPlugin('test')", function () {
            it("should create jQuery.fn.test", function () {
                pluginCreator.addPlugin("test");
                test.function(jQuery.fn.test)
                    .object(jQuery.fn.test.defaults)
                    .function(jQuery.fn.test.updateDefaultsWith)
                    .function(jQuery.fn.test.extendMembersWith)
                    .function(jQuery.fn.test.cloneTo)
                    .function(jQuery.fn.test.extendTo);
            });
        });
        describe("jQuery('#unique').test()", function () {
            it("should instantiate test on #unique", function () {
                jQuery("#unique").test();
                test.number(jQuery("#unique").length).is(1);
                test.object(jQuery("#unique").data("test"));
            });
        });
        after(function () {
            window.close();
        });
    });
});



