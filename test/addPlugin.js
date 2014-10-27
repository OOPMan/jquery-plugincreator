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
            it("should instantiate test2 on #unique", function () {
                test.number(jQuery("#unique").length).is(1);
                jQuery("#unique").test2();
            });
            it("should have called `constructorFunction` during instantiation", function () {
                test.object(jQuery("#unique").data("jquery-plugincreator-test2"))
                        .hasProperty("test2", true);
            });
        });
        describe("pluginCreator.addPlugin('test3', null, defaults)", function () {
            it("should create jQuery.fn.test3", function () {
                pluginCreator.addPlugin("test3", null, {test3: true});
                test.function(jQuery.fn.test3);
            });
        });
        describe("jQuery('#unique').test3()", function () {
            it("should instantiate test3 on #unique", function () {
                test.number(jQuery("#unique").length).is(1);
                jQuery("#unique").test3();
            });
            it("should make `defaults` available to the instance via the `options` member created during instantiation using the `defaults` supplied to pluginCreator.addPlugin('test3', null, defaults)", function () {
                var instance = jQuery("#unique").data("jquery-plugincreator-test3");
                test.object(instance)
                        .hasProperty("options")
                    .object(instance.options)
                        .hasProperty("test3", true);
            });
        });
        var test4FunctionResult = null;
        describe("pluginCreator.addPlugin('test4', null, null, members)", function () {
            it("should create jQuery.fn.test4", function () {
                pluginCreator.addPlugin("test4", null, null, {
                    test4Value: true,
                    test4Function1: function () {
                        test4FunctionResult = true;
                    },
                    test4Function2: function(parameter) {
                        test4FunctionResult = parameter;
                    }
                });
                test.function(jQuery.fn.test4);
            });
        });
        describe("jQuery('#unique').test4()", function () {
            it("should instantiate test4 on #unique", function () {
                test.number(jQuery("#unique").length).is(1);
                jQuery("#unique").test4();
            });
            it("should make `members` available to the instance via the prototype created by calling pluginCreator.addPlugin('test4', null, null, members)", function() {
                var instance = jQuery("#unique").data("jquery-plugincreator-test4");
                test.object(instance)
                        .hasProperty("test4Value", true)
                    .function(instance.test4Function1)
                    .function(instance.test4Function2);
            });
        });
        after(function () {
            window.close();
        });
    });
});



