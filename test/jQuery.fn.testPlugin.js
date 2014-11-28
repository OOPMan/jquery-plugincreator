"use strict";
var test = require("unit.js"),
    assert = test.assert,
    common = require("./common.js");

describe("jQuery.fn.testPlugin", function () {
    var window = common.getWindow(),
        jQuery = common.getjQuery(window),
        unique = jQuery("#unique"),
        nonUnique = jQuery(".non-unique"),
        defaults = {
            testNumber: 123,
            testBoolean: true,
            testString: "A string"
        },
        members = {
            initCalled: false,
            init: function () {
                this.initCalled = true;
            },
            _setOption: function (option, value) {
                this.options[option] = value;
            },
            _getOption: function (option) {
                return this.options[option];
            },
            setTestNumber: function (value) {
                if (typeof value == "number") this._setOption("testNumber", value);
                else throw value + " is not a number";
            },
            getTestNumber: function () {
                return this._getOption("testNumber");
            },
            setTestBoolean: function (value) {
                if (typeof value == "boolean") this._setOption("testBoolean", value);
                else throw value + " is not a boolean";
            },
            getTestBoolean: function () {
                return this._getOption("testBoolean");
            },
            setTestString: function (value) {
                if (typeof value == "string") this._setOption("testString", value);
                else throw value + " is not a string";
            },
            getTestString: function () {
                return this._getOption("testString");
            }
        },
        childMembers = {
            setTestNumber: function (value) {
                if (typeof value == "number") this._setOption("testNumber", -value);
                else throw value + " is not a number";
            },
            setTestBoolean: function (value) {
                if (typeof value == "boolean") this._setOption("testBoolean", !value);
                else throw value + " is not a boolean";
            },
            setTestString: function (value, _super) {
                _super(value + value);
            }
        },
        grandChildMembers = {
            _setOption: function (option, value, _super) {
                _super(option, value);
                _super(option + option, value);
            },
            setTestString: function (value, _super) {
                _super(value + value);
            }
        },
        grandChildInstanceMembers = {
            _setOption: members._setOption,
            setTestString: members.setTestString
        };

    describe("Pre-flight checks", function () {
        it("jQuery.addPlugin should be a function", function() {
            test.function(jQuery.addPlugin);
        });

        it("jQuery('#unique') should contain a single item", function () {
            test.number(unique.length).is(1);
        });

        it("jQuery('.non-unique') should contain 4 items", function () {
            test.number(nonUnique.length).is(4);
        });

        it("jQuery.addPlugin('testPlugin', defaults, members) should create jQuery.fn.testPlugin", function () {
            jQuery.addPlugin("testPlugin", defaults, members);
            test.function(jQuery.fn.testPlugin)
                .object(jQuery.fn.testPlugin.defaults)
                    .is(defaults)
                .function(jQuery.fn.testPlugin.updateDefaultsWith)
                .function(jQuery.fn.testPlugin.extendMembersWith)
                .function(jQuery.fn.testPlugin.cloneTo)
                .function(jQuery.fn.testPlugin.extendTo);
        });
    });

    describe("jQuery('#unique').testPlugin()", function () {
        it("should instantiate testPlugin on #unique", function () {
            unique.testPlugin();
            this.instance = unique.data("jquery-plugincreator-testPlugin");
            test.object(this.instance);
        });
        it("should copy the contents of `defaults` into the `options` member on the testPlugin instance", function () {
            test.object(this.instance.options).is(defaults);
        });
        it("should call `constructor` during instantiation and set the `initCalled` member to true", function () {
            test.bool(this.instance.initCalled).isTrue();
        });

        describe("jQuery('#unqiue').testPlugin('getInstance')", function () {
            it("should call `getInstance` on the testPlugin instance and return a reference to the testPlugin instance", function () {
                test.bool(this.instance == unique.testPlugin("getInstance"));
            });
        });

        describe("jQuery('#unique').testPlugin('setTestNumber', 321)", function () {
            it("should call `setTestNumber` on the testPlugin instance", function () {
                unique.testPlugin("setTestNumber", 321);
            });
            it("should set the `testNumber` key in the `options` member on the testPlugin instance to 321", function () {
                test.number(this.instance.options.testNumber).is(321);
            });
        });

        describe("jQuery('#unique').testPlugin('getTestNumber')", function () {
            it("should call `getTestNumber` on the testPlugin instance and the number 321 should be returned", function () {
                test.number(unique.testPlugin("getTestNumber")).is(321);
            });
        });

        describe("jQuery('#unique').testPlugin('setTestNumber', 'a string')", function () {
            it("should trigger an exception when trying to call `setTestNumber` on the testPlugin instance", function () {
                test.exception(function () {
                    unique.testPlugin("setTestNumber", "a string");
                });
            });
        });

        describe("jQuery('#unique').testPlugin('setTestBoolean', false)", function () {
            it("should call `setTestBoolean` on the testPlugin instance", function () {
                unique.testPlugin("setTestBoolean", false);
            });
            it("should set the `testBoolean` key in the `options` member on the testPlugin instance to false", function () {
                test.bool(this.instance.options.testBoolean).isFalse();
            });
        });

        describe("jQuery('#unique').testPlugin('getTestBoolean')", function () {
            it("should call `getTestBoolean` on the testPlugin instance and the boolean false should be returned", function () {
                test.bool(unique.testPlugin("getTestBoolean")).isFalse();
            });
        });

        describe("jQuery('#unique').testPlugin('setTestBoolean', 'a string')", function () {
            it("should trigger an exception when trying to call `setTestBoolean` on the testPlugin instance", function () {
                test.exception(function () {
                    unique.testPlugin("setTestBoolean", "a string");
                });
            });
        });

        describe("jQuery('#unique').testPlugin('setTestString', 'Hello World')", function () {
            it("should call `setTestString` on the testPlugin instance", function () {
                unique.testPlugin("setTestString", "Hello World");
            });
            it("should set the `testBoolean` key in the `options` member on the testPlugin instance to 'Hello World'", function () {
                test.string(this.instance.options.testString).is("Hello World");
            });
        });

        describe("jQuery('#unique').testPlugin('getTestString')", function () {
            it("should call `getTestString` on the testPlugin instance and the value 'Hello World' should be returned", function () {
                test.string(unique.testPlugin("getTestString")).is("Hello World");
            });
        });

        describe("jQuery('#unique').testPlugin('setTestString', 321)", function () {
            it("should trigger an exception when trying to call `setTestString` on the testPlugin instance", function () {
                test.exception(function () {
                    unique.testPlugin("setTestString", 321);
                });
            });
        });
    });

    describe("jQuery.fn.testPlugin.cloneTo('cloneOfTestPlugin')", function () {
        it("should create jQuery.fn.cloneOfTestPlugin", function () {
            jQuery.fn.testPlugin.cloneTo("cloneOfTestPlugin");
            test.function(jQuery.fn.cloneOfTestPlugin)
                .object(jQuery.fn.cloneOfTestPlugin.defaults)
                    .is(defaults)
                .function(jQuery.fn.cloneOfTestPlugin.updateDefaultsWith)
                .function(jQuery.fn.cloneOfTestPlugin.extendMembersWith)
                .function(jQuery.fn.cloneOfTestPlugin.cloneTo)
                .function(jQuery.fn.cloneOfTestPlugin.extendTo);
        });

        describe("jQuery('#unique').cloneOfTestPlugin()", function () {
            it("should instantiate cloneOfTestPlugin on #unique", function () {
                unique.cloneOfTestPlugin();
                this.instance = unique.cloneOfTestPlugin("getInstance");
                test.object(this.instance);
            });
            it("should copy the contents of `defaults` into the `options` member on the cloneOfTestPlugin instance", function () {
                test.object(this.instance.options).is(defaults);
            });
            it("should call `constructor` during instantiation and set the `initCalled` member to true", function () {
                test.bool(this.instance.initCalled).isTrue();
            });

            describe("jQuery('#unique').cloneOfTestPlugin('setTestNumber', 321)", function () {
                it("should call `setTestNumber` on the cloneOfTestPlugin instance", function () {
                    unique.cloneOfTestPlugin("setTestNumber", 321);
                });
                it("should set the `testNumber` key in the `options` member on the cloneOfTestPlugin instance to 321", function () {
                    test.number(this.instance.options.testNumber).is(321);
                });
            });

            describe("jQuery('#unique').cloneOfTestPlugin('setTestNumber', 'a string')", function () {
                it("should trigger an exception when trying to call `setTestNumber` on the cloneOfTestPlugin instance", function () {
                    test.exception(function () {
                        unique.cloneOfTestPlugin("setTestNumber", "a string");
                    });
                });
            });

            describe("jQuery('#unique').cloneOfTestPlugin('setTestBoolean', false)", function () {
                it("should call `setTestBoolean` on the cloneOfTestPlugin instance", function () {
                    unique.cloneOfTestPlugin("setTestBoolean", false);
                });
                it("should set the `testBoolean` key in the `options` member on the cloneOfTestPlugin instance to false", function () {
                    test.bool(this.instance.options.testBoolean).isFalse();
                });
            });

            describe("jQuery('#unique').cloneOfTestPlugin('setTestBoolean', 'a string')", function () {
                it("should trigger an exception when trying to call `setTestBoolean` on the cloneOfTestPlugin instance", function () {
                    test.exception(function () {
                        unique.cloneOfTestPlugin("setTestBoolean", "a string");
                    });
                });
            });

            describe("jQuery('#unique').cloneOfTestPlugin('setTestString', 'Hello World')", function () {
                it("should call `setTestString` on the cloneOfTestPlugin instance", function () {
                    unique.cloneOfTestPlugin("setTestString", "Hello World");
                });
                it("should set the `testBoolean` key in the `options` member on the cloneOfTestPlugin instance to 'Hello World'", function () {
                    test.string(this.instance.options.testString).is("Hello World");
                });
            });

            describe("jQuery('#unique').cloneOfTestPlugin('setTestString', 321)", function () {
                it("should trigger an exception when trying to call `setTestString` on the cloneOfTestPlugin instance", function () {
                    test.exception(function () {
                        unique.cloneOfTestPlugin("setTestString", 321);
                    });
                });
            });
        });
    });

    describe("jQuery.fn.testPlugin.extendTo('childOfTestPlugin', childMembers)", function () {
        it("should create jQuery.fn.childOfTestPlugin", function () {
            jQuery.fn.testPlugin.extendTo("childOfTestPlugin", childMembers);
            test.function(jQuery.fn.childOfTestPlugin)
                .object(jQuery.fn.childOfTestPlugin.defaults)
                    .is(defaults)
                .function(jQuery.fn.childOfTestPlugin.updateDefaultsWith)
                .function(jQuery.fn.childOfTestPlugin.extendMembersWith)
                .function(jQuery.fn.childOfTestPlugin.cloneTo)
                .function(jQuery.fn.childOfTestPlugin.extendTo);
        });

        describe("jQuery('#unique').childOfTestPlugin()", function () {
            it("should instantiate childOfTestPlugin on #unique", function () {
                unique.childOfTestPlugin();
                this.instance = unique.childOfTestPlugin("getInstance");
                test.object(this.instance);
            });
            it("should copy the contents of `defaults` into the `options` member on the childOfTestPlugin instance", function () {
                test.object(this.instance.options).is(defaults);
            });
            it("should call `constructor` during instantiation and set the `initCalled` member to true", function () {
                test.bool(this.instance.initCalled).isTrue();
            });

            describe("jQuery('#unique').childOfTestPlugin('setTestNumber', 321)", function () {
                it("should call `setTestNumber` on the childOfTestPlugin instance", function () {
                    unique.childOfTestPlugin("setTestNumber", 321);
                });
                it("should set the `testNumber` key in the `options` member on the childOfTestPlugin instance to -321", function () {
                    test.number(this.instance.options.testNumber).is(-321);
                });
            });

            describe("jQuery('#unique').childOfTestPlugin('setTestNumber', 'a string')", function () {
                it("should trigger an exception when trying to call `setTestNumber` on the childOfTestPlugin instance", function () {
                    test.exception(function () {
                        unique.childOfTestPlugin("setTestNumber", "a string");
                    });
                });
            });

            describe("jQuery('#unique').childOfTestPlugin('setTestBoolean', false)", function () {
                it("should call `setTestBoolean` on the childOfTestPlugin instance", function () {
                    unique.childOfTestPlugin("setTestBoolean", false);
                });
                it("should set the `testBoolean` key in the `options` member on the childOfTestPlugin instance to true", function () {
                    test.bool(this.instance.options.testBoolean).isTrue();
                });
            });

            describe("jQuery('#unique').childOfTestPlugin('setTestBoolean', 'a string')", function () {
                it("should trigger an exception when trying to call `setTestBoolean` on the childOfTestPlugin instance", function () {
                    test.exception(function () {
                        unique.childOfTestPlugin("setTestBoolean", "a string");
                    });
                });
            });

            describe("jQuery('#unique').childOfTestPlugin('setTestString', 'Hello World')", function () {
                var testString = "Hello World";
                it("should call `setTestString` on the childOfTestPlugin instance", function () {
                    unique.childOfTestPlugin("setTestString", testString);
                });
                it("should set the `testString` key in the `options` member on the childOfTestPlugin instance to 'Hello World'", function () {
                    test.string(this.instance.options.testString).is(testString + testString);
                });
            });

            describe("jQuery('#unique').childOfTestPlugin('setTestString', 321)", function () {
                it("should trigger an exception when trying to call `setTestString` on the childOfTestPlugin instance", function () {
                    test.exception(function () {
                        unique.childOfTestPlugin("setTestString", 321);
                    });
                });
            });
        });
    });

    describe("jQuery.fn.childOfTestPlugin.extendTo('grandChildOfTestPlugin', grandChildMembers)", function () {
        it("should create jQuery.fn.grandChildOfTestPlugin", function () {
            jQuery.fn.childOfTestPlugin.extendTo("grandChildOfTestPlugin", grandChildMembers);
            test.function(jQuery.fn.grandChildOfTestPlugin)
                .object(jQuery.fn.grandChildOfTestPlugin.defaults)
                    .is(defaults)
                .function(jQuery.fn.grandChildOfTestPlugin.updateDefaultsWith)
                .function(jQuery.fn.grandChildOfTestPlugin.extendMembersWith)
                .function(jQuery.fn.grandChildOfTestPlugin.cloneTo)
                .function(jQuery.fn.grandChildOfTestPlugin.extendTo);
        });

        describe("jQuery('#unique').grandChildOfTestPlugin()", function () {
            it("should instantiate grandChildOfTestPlugin on #unique", function () {
                unique.grandChildOfTestPlugin();
                this.instance = unique.grandChildOfTestPlugin("getInstance");
                test.object(this.instance);
            });
            it("should copy the contents of `defaults` into the `options` member on the grandChildOfTestPlugin instance", function () {
                test.object(this.instance.options).is(defaults);
            });
            it("should call `constructor` during instantiation and set the `initCalled` member to true", function () {
                test.bool(this.instance.initCalled).isTrue();
            });

            describe("jQuery('#unique').grandChildOfTestPlugin('setTestNumber', 321)", function () {
                it("should call `setTestNumber` on the grandChildOfTestPlugin instance", function () {
                    unique.grandChildOfTestPlugin("setTestNumber", 321);
                });
                it("should set the `testNumber` key in the `options` member on the grandChildOfTestPlugin instance to -321", function () {
                    test.number(this.instance.options.testNumber).is(-321);
                });
                it("should set the `testNumbertestNumber` key in the `options` member on the grandChildOfTestPlugin instance to -321", function () {
                    test.number(this.instance.options.testNumbertestNumber).is(-321);
                });
            });

            describe("jQuery('#unique').grandChildOfTestPlugin('setTestNumber', 'a string')", function () {
                it("should trigger an exception when trying to call `setTestNumber` on the grandChildOfTestPlugin instance", function () {
                    test.exception(function () {
                        unique.grandChildOfTestPlugin("setTestNumber", "a string");
                    });
                });
            });

            describe("jQuery('#unique').grandChildOfTestPlugin('setTestBoolean', false)", function () {
                it("should call `setTestBoolean` on the grandChildOfTestPlugin instance", function () {
                    unique.grandChildOfTestPlugin("setTestBoolean", false);
                });
                it("should set the `testBoolean` key in the `options` member on the grandChildOfTestPlugin instance to true", function () {
                    test.bool(this.instance.options.testBoolean).isTrue();
                });
                it("should set the `testBooleantestBoolean` key in the `options` member on the grandChildOfTestPlugin instance to true", function () {
                    test.bool(this.instance.options.testBooleantestBoolean).isTrue();
                });
            });

            describe("jQuery('#unique').grandChildOfTestPlugin('setTestBoolean', 'a string')", function () {
                it("should trigger an exception when trying to call `setTestBoolean` on the grandChildOfTestPlugin instance", function () {
                    test.exception(function () {
                        unique.grandChildOfTestPlugin("setTestBoolean", "a string");
                    });
                });
            });

            describe("jQuery('#unique').grandChildOfTestPlugin('setTestString', 'Hello World')", function () {
                var testString = "Hello World";
                it("should call `setTestString` on the grandChildOfTestPlugin instance", function () {
                    unique.grandChildOfTestPlugin("setTestString", testString);
                });
                it("should set the `testString` key in the `options` member on the grandChildOfTestPlugin instance to 'Hello WorldHello WorldHello WorldHello World'", function () {
                    test.string(this.instance.options.testString).is(testString + testString + testString + testString);
                    test.string(this.instance.options.testStringtestString).is(testString + testString + testString + testString);
                });
                it("should set the `testStringtestString` key in the `options` member on the grandChildOfTestPlugin instance to 'Hello WorldHello WorldHello WorldHello World'", function () {
                    test.string(this.instance.options.testStringtestString).is(testString + testString + testString + testString);
                });
            });

            describe("jQuery('#unique').grandChildOfTestPlugin('setTestString', 321)", function () {
                it("should trigger an exception when trying to call `setTestString` on the grandChildOfTestPlugin instance", function () {
                    test.exception(function () {
                        unique.grandChildOfTestPlugin("setTestString", 321);
                    });
                });
            });
        });

        describe("jQuery('.non-unique').grandChildOfTestPlugin()", function () {
            it("should instantiate grandChildOfTestPlugin on each .non-unique", function () {
                nonUnique.grandChildOfTestPlugin();
                nonUnique.each(function () {
                    test.object(jQuery(this).grandChildOfTestPlugin("getInstance"));
                });
            });
            it("should copy the contents of `defaults` into the `options` member on each grandChildOfTestPlugin instance", function () {
                nonUnique.each(function () {
                    test.object(jQuery(this).grandChildOfTestPlugin("getInstance").options).is(defaults);
                });
            });
            it("should call `constructor` during instantiation and set the `initCalled` member on each grandChildOfTestPlugin instance to true", function () {
                nonUnique.each(function () {
                    test.bool(jQuery(this).grandChildOfTestPlugin("getInstance").initCalled).isTrue();
                });
            });

            describe("jQuery('.non-unique').grandChildOfTestPlugin('map', 'getTestNumber')", function () {
                it("should return a jQuery selection which can be converted to an Array matching [123, 123, 123, 123] by calling .get() on the selection", function () {
                    var results = nonUnique.grandChildOfTestPlugin("map", "getTestNumber");
                    test.object(results)
                        .array(results.get()).is([123, 123, 123, 123]);
                });
            });

            describe("jQuery('.non-unique').grandChildOfTestPlugin('map', 'getTestBoolean')", function () {
                it("should return a jQuery selection which can be converted to an Array matching [true, true, true, true] by calling .get() on the selection", function () {
                    var results = nonUnique.grandChildOfTestPlugin("map", "getTestBoolean");
                    test.object(results)
                        .array(results.get()).is([true, true, true, true]);
                });
            });

            describe("jQuery('.non-unique').grandChildOfTestPlugin('map', 'getTestString')", function () {
                it("should return a jQuery selection which can be converted to an Array matching ['A string', 'A string', 'A string', 'A string'] by calling .get() on the selection", function () {
                    var results = nonUnique.grandChildOfTestPlugin("map", "getTestString");
                    test.object(results)
                        .array(results.get()).is(["A string", "A string", "A string", "A string"]);
                });
            });

            describe("jQuery('.non-unique').first().grandChildOfTestPlugin('extend', grandChildInstanceMembers)", function () {
                var first = nonUnique.first();
                var next = first.next();

                it("should extend the first grandChildOfTestPlugin instance with additional members from `grandChildInstanceMembers`", function () {
                    first.grandChildOfTestPlugin("extend", grandChildInstanceMembers);
                });

                describe("jQuery('.non-unique').first().grandChildOfTestPlugin('setTestString', 'Hello World')", function () {
                    it("should call `setTestString` on the first .non-unique grandChildOfTestPlugin instance", function () {
                        first.grandChildOfTestPlugin("setTestString", "Hello World");
                    });
                    it("should set the `testString` key in the `options` member on the first .non-unique grandChildOfTestPlugin instance to 'Hello World'", function () {
                        test.string(first.grandChildOfTestPlugin("getInstance").options.testString).is("Hello World");
                    });
                });

                describe("jQuery('.non-unique').first().next().grandChildOfTestPlugin('setTestString', 'Hello World')", function () {
                    var testString = "Hello World";
                    it("should call `setTestString` on the second .non-unique grandChildOfTestPlugin instance", function () {
                        next.grandChildOfTestPlugin("setTestString", testString);
                    });
                    it("should set the `testString` key in the `options` member on the second .non-unique grandChildOfTestPlugin instance to 'Hello WorldHello WorldHello WorldHello World'", function () {
                        test.string(next.grandChildOfTestPlugin("getInstance").options.testString).is(testString + testString + testString + testString);
                    });
                });
            });
        });
    });

    after(function () {
        window.close();
    });
});
