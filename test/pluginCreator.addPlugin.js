var test = require("unit.js"),
    assert = test.assert,
    common = require("./common.js");

describe("require('pluginCreator')", function () {
    common.withTestHtmlIt("should create jQuery.addPlugin", function (errors, window, jQuery, pluginCreator) {
        test.function(jQuery.addPlugin);

        describe("jQuery('#unique')", function () {
            it("should contain a single item", function () {
                var unique = jQuery("#unique");
                test.number(unique.length).is(1);

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
                        unique.test();
                        test.object(unique.data("jquery-plugincreator-test"));
                    });
                });

                describe("jQuery('#unique').test('destroy')", function () {
                    it("should destroy test on #unique", function () {
                        unique.test("destroy");
                        test.undefined(unique.data("jquery-plugincreator.test"));
                    });
                });

                describe("pluginCreator.addPlugin('test', constructorFunction)", function () {
                    it("should create jQuery.fn.test", function () {
                        pluginCreator.addPlugin("test", function () {
                            this.test = true;
                        });
                        test.function(jQuery.fn.test);
                    });
                });

                describe("jQuery('#unique').test()", function () {
                    it("should instantiate test on #unique", function () {
                        unique.test();
                    });
                    it("should call `constructorFunction` during instantiation", function () {
                        test.object(unique.data("jquery-plugincreator-test"))
                                .hasProperty("test", true);
                    });
                    after(function () {
                        unique.test("destroy");
                    });
                });

                describe("pluginCreator.addPlugin('test', null, defaults)", function () {
                    it("should create jQuery.fn.test", function () {
                        pluginCreator.addPlugin("test", null, {test: true});
                        test.function(jQuery.fn.test);
                    });
                });

                describe("jQuery('#unique').test()", function () {
                    it("should instantiate test on #unique", function () {
                        unique.test();
                    });
                    it("should make `defaults` available to the instance via the `options` member created during instantiation using the `defaults` supplied to pluginCreator.addPlugin('test', null, defaults)", function () {
                        var instance = unique.data("jquery-plugincreator-test");
                        test.object(instance)
                                .hasProperty("options")
                            .object(instance.options)
                                .hasProperty("test", true);
                    });
                    after(function () {
                        unique.test("destroy");
                    });
                });

                describe("pluginCreator.addPlugin('test', null, null, members)", function () {
                    it("should create jQuery.fn.test", function () {
                        pluginCreator.addPlugin("test", null, null, {
                            testValue: true,
                            testFunction1: function () {
                                this.testFunctionResult = true;
                            },
                            testFunction2: function (parameter) {
                                this.testFunctionResult = parameter;
                            }
                        });
                        test.function(jQuery.fn.test);
                    });
                });

                describe("jQuery('#unique').test()", function () {
                    it("should instantiate test on #unique", function () {
                        unique.test();
                    });
                    it("should make `members` available to the instance via the prototype created by calling pluginCreator.addPlugin('test', null, null, members)", function () {
                        var instance = unique.data("jquery-plugincreator-test");
                        test.object(instance)
                                .hasProperty("testValue", true)
                            .function(instance.testFunction1)
                            .function(instance.testFunction2);
                    });
                });

                describe("jQuery('#unique').test('testFunction1')", function () {
                    it("should set `testFunctionResult` on the instance to `true`", function () {
                        var instance = unique.data("jquery-plugincreator-test");
                        unique.test("testFunction1");
                        test.object(instance)
                                .hasProperty("testFunctionResult", true);
                    });
                });

                describe("jQuery('#unique').test('testFunction2', 'someValue')", function () {
                    it("should set `testFunctionResult` on the instance to `someValue`", function () {
                        var instance = unique.data("jquery-plugincreator-test");
                        unique.test("testFunction2", "someValue");
                        test.object(instance)
                                .hasProperty("testFunctionResult", "someValue");
                    });
                    after(function () {
                        unique.test("destroy");
                    });
                });

                describe("pluginCreator.addPlugin('test', null, null, null, prototypeFunction)", function () {
                    it("should create jQuery.fn.test", function () {
                        pluginCreator.addPlugin("test", null, null, null, function () {
                            this.testValue = true;
                        });
                    });
                });

                describe("jQuery('#unique').test()", function () {
                    it("should instantiate test on #unique", function () {
                        unique.test();
                    });
                    it("should set `testValue` on the instance to `true` as a result executing the prototype function", function () {
                        var instance = unique.data("jquery-plugincreator-test");
                        test.object(instance)
                                .hasProperty("testValue", true);
                    });
                    after(function () {
                        unique.test("destroy");
                    });
                });
            });
        });

        after(function () {
            window.close();
        });
    });
});



