var test = require("unit.js"),
    assert = test.assert,
    common = require("./common.js");

describe("require('pluginCreator')", function () {
    common.withTestHtmlIt("should create jQuery.addPlugin", function (errors, window, jQuery, pluginCreator) {
        describe("pluginCreator.addPlugin('test1')", function () {
            it("should create jQuery.fn.test1", function () {
                pluginCreator.addPlugin("test1");
                test.function(jQuery.fn.test1)
                    .object(jQuery.fn.test1.defaults)
                    .function(jQuery.fn.test1.updateDefaultsWith)
                    .function(jQuery.fn.test1.extendMembersWith)
                    .function(jQuery.fn.test1.cloneTo)
                    .function(jQuery.fn.test1.extendTo);
            });
        });
        describe("jQuery('#unique').test1()", function () {
            it("should instantiate test1 on #unique", function () {
                test.number(jQuery("#unique").length).is(1);
                jQuery("#unique").test1();
                test.object(jQuery("#unique").data("jquery-plugincreator-test1"));
            });
        });
        describe("pluginCreator.addPlugin('test2', constructorFunction)", function () {
            it("should create jQuery.fn.test2", function () {
                pluginCreator.addPlugin("test2", function () {
                    this.test2 = true;
                });
                test.function(jQuery.fn.test2);
            });
        });
        describe("jQuery('#unique').test2()", function () {
            it("should instantiate test2 on #unique, calling constructorFunction in the process", function () {
                test.number(jQuery("#unique").length).is(1);
                jQuery("#unique").test2();
                test.object(jQuery("#unique").data("jquery-plugincreator-test2"))
                        .hasProperty("test2", true);
            });
        });
        after(function () {
            window.close();
        });
    });
});



