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

describe("jQuery.fn.complexPlugin", function () {
    let test = unitjs,
        assert = unitjs.assert,
        unique = jQuery("#unique"),
        nonUnique = jQuery(".non-unique"),
        defaults = {
            testNumber: 123,
            testBoolean: true,
            testString: "A string"
        };

    class complexPlugin extends jQuery.addPlugin.jQueryPlugin {
        init() {
            this.initCalled = true;
        }
        _setOption(option, value) {
            this.options[option] = value;
        }
        _getOption(option) {
            return this.options[option];
        }
        setTestNumber(value) {
            if (typeof value == "number") this._setOption("testNumber", value);
            else throw value + " is not a number";
        }
        getTestNumber() {
            return this._getOption("testNumber");
        }
        setTestBoolean(value) {
            if (typeof value == "boolean") this._setOption("testBoolean", value);
            else throw value + " is not a boolean";
        }
        getTestBoolean() {
            return this._getOption("testBoolean");
        }
        setTestString(value) {
            if (typeof value == "string") this._setOption("testString", value);
            else throw value + " is not a string";
        }
        getTestString() {
            return this._getOption("testString");
        }
    }

    class childOfComplexPlugin extends complexPlugin {
        setTestNumber(value) {
            if (typeof value == "number") this._setOption("testNumber", -value);
            else throw value + " is not a number";
        }
        setTestBoolean(value) {
            if (typeof value == "boolean") this._setOption("testBoolean", !value);
            else throw value + " is not a boolean";
        }
        setTestString(value) {
            super.setTestString(value + value);
        }
    }

    class grandChildOfComplexPlugin extends childOfComplexPlugin {
        _setOption(option, value) {
            super._setOption(option, value);
            super._setOption(option + option, value);
        }
        setTestString(value) {
            super.setTestString(value + value);
        }
    }

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
    });

    describe("jQuery.addPlugin", function () {
        it("jQuery.addPlugin(complexPlugin, defaults) should create jQuery.fn.complexPlugin", function () {
            jQuery.addPlugin(complexPlugin, defaults);
            test.function(jQuery.fn.complexPlugin)
                .object(jQuery.fn.complexPlugin.defaults)
                    .is(defaults);
        });

        it("jQuery.addPlugin(childOfComplexPlugin, defaults) should create jQuery.fn.childOfComplexPlugin", function () {
            jQuery.addPlugin(childOfComplexPlugin, defaults);
            test.function(jQuery.fn.childOfComplexPlugin)
                .object(jQuery.fn.childOfComplexPlugin.defaults)
                    .is(defaults);
        });

        it("jQuery.addPlugin(grandChildOfComplexPlugin, defaults) should create jQuery.fn.grandChildOfComplexPlugin", function () {
            jQuery.addPlugin(grandChildOfComplexPlugin, defaults);
            test.function(jQuery.fn.grandChildOfComplexPlugin)
                .object(jQuery.fn.grandChildOfComplexPlugin.defaults)
                    .is(defaults);
        });
    });

    describe("jQuery('#unique').complexPlugin()", function () {
        it("should instantiate complexPlugin on #unique", function () {
            unique.complexPlugin();
            this.instance = unique.data("jquery-plugincreator-complexPlugin");
            test.object(this.instance);
        });
        it("should copy the contents of `defaults` into the `options` member on the complexPlugin instance", function () {
            test.object(this.instance.options).is(defaults);
        });
        it("should call `constructor` during instantiation and set the `initCalled` member to true", function () {
            test.bool(this.instance.initCalled).isTrue();
        });

        describe("jQuery('#unqiue').complexPlugin('getInstance')", function () {
            it("should call `getInstance` on the complexPlugin instance and return a reference to the complexPlugin instance", function () {
                test.bool(this.instance == unique.complexPlugin("getInstance"));
            });
        });

        describe("jQuery('#unique').complexPlugin('setTestNumber', 321)", function () {
            it("should call `setTestNumber` on the complexPlugin instance", function () {
                unique.complexPlugin("setTestNumber", 321);
            });
            it("should set the `testNumber` key in the `options` member on the complexPlugin instance to 321", function () {
                test.number(this.instance.options.testNumber).is(321);
            });
        });

        describe("jQuery('#unique').complexPlugin('getTestNumber')", function () {
            it("should call `getTestNumber` on the complexPlugin instance and the number 321 should be returned", function () {
                test.number(unique.complexPlugin("getTestNumber")).is(321);
            });
        });

        describe("jQuery('#unique').complexPlugin('setTestNumber', 'a string')", function () {
            it("should trigger an exception when trying to call `setTestNumber` on the complexPlugin instance", function () {
                test.exception(function () {
                    unique.complexPlugin("setTestNumber", "a string");
                });
            });
        });

        describe("jQuery('#unique').complexPlugin('setTestBoolean', false)", function () {
            it("should call `setTestBoolean` on the complexPlugin instance", function () {
                unique.complexPlugin("setTestBoolean", false);
            });
            it("should set the `testBoolean` key in the `options` member on the complexPlugin instance to false", function () {
                test.bool(this.instance.options.testBoolean).isFalse();
            });
        });

        describe("jQuery('#unique').complexPlugin('getTestBoolean')", function () {
            it("should call `getTestBoolean` on the complexPlugin instance and the boolean false should be returned", function () {
                test.bool(unique.complexPlugin("getTestBoolean")).isFalse();
            });
        });

        describe("jQuery('#unique').complexPlugin('setTestBoolean', 'a string')", function () {
            it("should trigger an exception when trying to call `setTestBoolean` on the complexPlugin instance", function () {
                test.exception(function () {
                    unique.complexPlugin("setTestBoolean", "a string");
                });
            });
        });

        describe("jQuery('#unique').complexPlugin('setTestString', 'Hello World')", function () {
            it("should call `setTestString` on the complexPlugin instance", function () {
                unique.complexPlugin("setTestString", "Hello World");
            });
            it("should set the `testBoolean` key in the `options` member on the complexPlugin instance to 'Hello World'", function () {
                test.string(this.instance.options.testString).is("Hello World");
            });
        });

        describe("jQuery('#unique').complexPlugin('getTestString')", function () {
            it("should call `getTestString` on the complexPlugin instance and the value 'Hello World' should be returned", function () {
                test.string(unique.complexPlugin("getTestString")).is("Hello World");
            });
        });

        describe("jQuery('#unique').complexPlugin('setTestString', 321)", function () {
            it("should trigger an exception when trying to call `setTestString` on the complexPlugin instance", function () {
                test.exception(function () {
                    unique.complexPlugin("setTestString", 321);
                });
            });
        });
    });

    describe("jQuery('#unique').childOfComplexPlugin()", function () {
        it("should instantiate childOfComplexPlugin on #unique", function () {
            unique.childOfComplexPlugin();
            this.instance = unique.childOfComplexPlugin("getInstance");
            test.object(this.instance);
        });
        it("should copy the contents of `defaults` into the `options` member on the childOfComplexPlugin instance", function () {
            test.object(this.instance.options).is(defaults);
        });
        it("should call `constructor` during instantiation and set the `initCalled` member to true", function () {
            test.bool(this.instance.initCalled).isTrue();
        });

        describe("jQuery('#unique').childOfComplexPlugin('setTestNumber', 321)", function () {
            it("should call `setTestNumber` on the childOfComplexPlugin instance", function () {
                unique.childOfComplexPlugin("setTestNumber", 321);
            });
            it("should set the `testNumber` key in the `options` member on the childOfComplexPlugin instance to -321", function () {
                test.number(this.instance.options.testNumber).is(-321);
            });
        });

        describe("jQuery('#unique').childOfComplexPlugin('setTestNumber', 'a string')", function () {
            it("should trigger an exception when trying to call `setTestNumber` on the childOfComplexPlugin instance", function () {
                test.exception(function () {
                    unique.childOfComplexPlugin("setTestNumber", "a string");
                });
            });
        });

        describe("jQuery('#unique').childOfComplexPlugin('setTestBoolean', false)", function () {
            it("should call `setTestBoolean` on the childOfComplexPlugin instance", function () {
                unique.childOfComplexPlugin("setTestBoolean", false);
            });
            it("should set the `testBoolean` key in the `options` member on the childOfComplexPlugin instance to true", function () {
                test.bool(this.instance.options.testBoolean).isTrue();
            });
        });

        describe("jQuery('#unique').childOfComplexPlugin('setTestBoolean', 'a string')", function () {
            it("should trigger an exception when trying to call `setTestBoolean` on the childOfComplexPlugin instance", function () {
                test.exception(function () {
                    unique.childOfComplexPlugin("setTestBoolean", "a string");
                });
            });
        });

        describe("jQuery('#unique').childOfComplexPlugin('setTestString', 'Hello World')", function () {
            var testString = "Hello World";
            it("should call `setTestString` on the childOfComplexPlugin instance", function () {
                unique.childOfComplexPlugin("setTestString", testString);
            });
            it("should set the `testString` key in the `options` member on the childOfComplexPlugin instance to 'Hello World'", function () {
                test.string(this.instance.options.testString).is(testString + testString);
            });
        });

        describe("jQuery('#unique').childOfComplexPlugin('setTestString', 321)", function () {
            it("should trigger an exception when trying to call `setTestString` on the childOfComplexPlugin instance", function () {
                test.exception(function () {
                    unique.childOfComplexPlugin("setTestString", 321);
                });
            });
        });
    });

    describe("jQuery('#unique').grandChildOfComplexPlugin()", function () {
        it("should instantiate grandChildOfComplexPlugin on #unique", function () {
            unique.grandChildOfComplexPlugin();
            this.instance = unique.grandChildOfComplexPlugin("getInstance");
            test.object(this.instance);
        });
        it("should copy the contents of `defaults` into the `options` member on the grandChildOfComplexPlugin instance", function () {
            test.object(this.instance.options).is(defaults);
        });
        it("should call `constructor` during instantiation and set the `initCalled` member to true", function () {
            test.bool(this.instance.initCalled).isTrue();
        });

        describe("jQuery('#unique').grandChildOfComplexPlugin('setTestNumber', 321)", function () {
            it("should call `setTestNumber` on the grandChildOfComplexPlugin instance", function () {
                unique.grandChildOfComplexPlugin("setTestNumber", 321);
            });
            it("should set the `testNumber` key in the `options` member on the grandChildOfComplexPlugin instance to -321", function () {
                test.number(this.instance.options.testNumber).is(-321);
            });
            it("should set the `testNumbertestNumber` key in the `options` member on the grandChildOfComplexPlugin instance to -321", function () {
                test.number(this.instance.options.testNumbertestNumber).is(-321);
            });
        });

        describe("jQuery('#unique').grandChildOfComplexPlugin('setTestNumber', 'a string')", function () {
            it("should trigger an exception when trying to call `setTestNumber` on the grandChildOfComplexPlugin instance", function () {
                test.exception(function () {
                    unique.grandChildOfComplexPlugin("setTestNumber", "a string");
                });
            });
        });

        describe("jQuery('#unique').grandChildOfComplexPlugin('setTestBoolean', false)", function () {
            it("should call `setTestBoolean` on the grandChildOfComplexPlugin instance", function () {
                unique.grandChildOfComplexPlugin("setTestBoolean", false);
            });
            it("should set the `testBoolean` key in the `options` member on the grandChildOfComplexPlugin instance to true", function () {
                test.bool(this.instance.options.testBoolean).isTrue();
            });
            it("should set the `testBooleantestBoolean` key in the `options` member on the grandChildOfComplexPlugin instance to true", function () {
                test.bool(this.instance.options.testBooleantestBoolean).isTrue();
            });
        });

        describe("jQuery('#unique').grandChildOfComplexPlugin('setTestBoolean', 'a string')", function () {
            it("should trigger an exception when trying to call `setTestBoolean` on the grandChildOfComplexPlugin instance", function () {
                test.exception(function () {
                    unique.grandChildOfComplexPlugin("setTestBoolean", "a string");
                });
            });
        });

        describe("jQuery('#unique').grandChildOfComplexPlugin('setTestString', 'Hello World')", function () {
            var testString = "Hello World";
            it("should call `setTestString` on the grandChildOfComplexPlugin instance", function () {
                unique.grandChildOfComplexPlugin("setTestString", testString);
            });
            it("should set the `testString` key in the `options` member on the grandChildOfComplexPlugin instance to 'Hello WorldHello WorldHello WorldHello World'", function () {
                test.string(this.instance.options.testString).is(testString + testString + testString + testString);
                test.string(this.instance.options.testStringtestString).is(testString + testString + testString + testString);
            });
            it("should set the `testStringtestString` key in the `options` member on the grandChildOfComplexPlugin instance to 'Hello WorldHello WorldHello WorldHello World'", function () {
                test.string(this.instance.options.testStringtestString).is(testString + testString + testString + testString);
            });
        });

        describe("jQuery('#unique').grandChildOfComplexPlugin('setTestString', 321)", function () {
            it("should trigger an exception when trying to call `setTestString` on the grandChildOfComplexPlugin instance", function () {
                test.exception(function () {
                    unique.grandChildOfComplexPlugin("setTestString", 321);
                });
            });
        });
    });

    describe("jQuery('.non-unique').grandChildOfComplexPlugin()", function () {
        it("should instantiate grandChildOfComplexPlugin on each .non-unique", function () {
            nonUnique.grandChildOfComplexPlugin();
            nonUnique.each(function () {
                test.object(jQuery(this).grandChildOfComplexPlugin("getInstance"));
            });
        });
        it("should copy the contents of `defaults` into the `options` member on each grandChildOfComplexPlugin instance", function () {
            nonUnique.each(function () {
                test.object(jQuery(this).grandChildOfComplexPlugin("getInstance").options).is(defaults);
            });
        });
        it("should call `constructor` during instantiation and set the `initCalled` member on each grandChildOfComplexPlugin instance to true", function () {
            nonUnique.each(function () {
                test.bool(jQuery(this).grandChildOfComplexPlugin("getInstance").initCalled).isTrue();
            });
        });

        describe("jQuery('.non-unique').grandChildOfComplexPlugin('map', 'getTestNumber')", function () {
            it("should return a jQuery selection which can be converted to an Array matching [123, 123, 123, 123] by calling .get() on the selection", function () {
                var results = nonUnique.grandChildOfComplexPlugin("map", "getTestNumber");
                test.object(results)
                    .array(results.get()).is([123, 123, 123, 123]);
            });
        });

        describe("jQuery('.non-unique').grandChildOfComplexPlugin('map', 'getTestBoolean')", function () {
            it("should return a jQuery selection which can be converted to an Array matching [true, true, true, true] by calling .get() on the selection", function () {
                var results = nonUnique.grandChildOfComplexPlugin("map", "getTestBoolean");
                test.object(results)
                    .array(results.get()).is([true, true, true, true]);
            });
        });

        describe("jQuery('.non-unique').grandChildOfComplexPlugin('map', 'getTestString')", function () {
            it("should return a jQuery selection which can be converted to an Array matching ['A string', 'A string', 'A string', 'A string'] by calling .get() on the selection", function () {
                var results = nonUnique.grandChildOfComplexPlugin("map", "getTestString");
                test.object(results)
                    .array(results.get()).is(["A string", "A string", "A string", "A string"]);
            });
        });
    });
});