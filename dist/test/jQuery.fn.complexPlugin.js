(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery", "../dist/jquery.plugincreator", "unit.js"], factory);
    } else if (typeof exports !== "undefined") {
        factory(require("jquery"), require("../dist/jquery.plugincreator"), require("unit.js"));
    } else {
        var mod = {
            exports: {}
        };
        factory(global.jquery, global.jquery, global.unit);
        global.jQueryFnComplexPlugin = mod.exports;
    }
})(this, function (_jquery, _jquery3, _unit) {
    "use strict";

    var _jquery2 = _interopRequireDefault(_jquery);

    var _jquery4 = _interopRequireDefault(_jquery3);

    var _unit2 = _interopRequireDefault(_unit);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _get = function get(object, property, receiver) {
        if (object === null) object = Function.prototype;
        var desc = Object.getOwnPropertyDescriptor(object, property);

        if (desc === undefined) {
            var parent = Object.getPrototypeOf(object);

            if (parent === null) {
                return undefined;
            } else {
                return get(parent, property, receiver);
            }
        } else if ("value" in desc) {
            return desc.value;
        } else {
            var getter = desc.get;

            if (getter === undefined) {
                return undefined;
            }

            return getter.call(receiver);
        }
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    describe("jQuery.fn.complexPlugin", function () {
        var test = unitjs,
            assert = unitjs.assert,
            unique = (0, _jquery2.default)("#unique"),
            nonUnique = (0, _jquery2.default)(".non-unique"),
            defaults = {
            testNumber: 123,
            testBoolean: true,
            testString: "A string"
        };

        var complexPlugin = function (_jQuery$addPlugin$jQu) {
            _inherits(complexPlugin, _jQuery$addPlugin$jQu);

            function complexPlugin() {
                _classCallCheck(this, complexPlugin);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(complexPlugin).apply(this, arguments));
            }

            _createClass(complexPlugin, [{
                key: "init",
                value: function init() {
                    this.initCalled = true;
                }
            }, {
                key: "_setOption",
                value: function _setOption(option, value) {
                    this.options[option] = value;
                }
            }, {
                key: "_getOption",
                value: function _getOption(option) {
                    return this.options[option];
                }
            }, {
                key: "setTestNumber",
                value: function setTestNumber(value) {
                    if (typeof value == "number") this._setOption("testNumber", value);else throw value + " is not a number";
                }
            }, {
                key: "getTestNumber",
                value: function getTestNumber() {
                    return this._getOption("testNumber");
                }
            }, {
                key: "setTestBoolean",
                value: function setTestBoolean(value) {
                    if (typeof value == "boolean") this._setOption("testBoolean", value);else throw value + " is not a boolean";
                }
            }, {
                key: "getTestBoolean",
                value: function getTestBoolean() {
                    return this._getOption("testBoolean");
                }
            }, {
                key: "setTestString",
                value: function setTestString(value) {
                    if (typeof value == "string") this._setOption("testString", value);else throw value + " is not a string";
                }
            }, {
                key: "getTestString",
                value: function getTestString() {
                    return this._getOption("testString");
                }
            }]);

            return complexPlugin;
        }(_jquery2.default.addPlugin.jQueryPlugin);

        var childOfComplexPlugin = function (_complexPlugin) {
            _inherits(childOfComplexPlugin, _complexPlugin);

            function childOfComplexPlugin() {
                _classCallCheck(this, childOfComplexPlugin);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(childOfComplexPlugin).apply(this, arguments));
            }

            _createClass(childOfComplexPlugin, [{
                key: "setTestNumber",
                value: function setTestNumber(value) {
                    if (typeof value == "number") this._setOption("testNumber", -value);else throw value + " is not a number";
                }
            }, {
                key: "setTestBoolean",
                value: function setTestBoolean(value) {
                    if (typeof value == "boolean") this._setOption("testBoolean", !value);else throw value + " is not a boolean";
                }
            }, {
                key: "setTestString",
                value: function setTestString(value) {
                    _get(Object.getPrototypeOf(childOfComplexPlugin.prototype), "setTestString", this).call(this, value + value);
                }
            }]);

            return childOfComplexPlugin;
        }(complexPlugin);

        var grandChildOfComplexPlugin = function (_childOfComplexPlugin) {
            _inherits(grandChildOfComplexPlugin, _childOfComplexPlugin);

            function grandChildOfComplexPlugin() {
                _classCallCheck(this, grandChildOfComplexPlugin);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(grandChildOfComplexPlugin).apply(this, arguments));
            }

            _createClass(grandChildOfComplexPlugin, [{
                key: "_setOption",
                value: function _setOption(option, value) {
                    _get(Object.getPrototypeOf(grandChildOfComplexPlugin.prototype), "_setOption", this).call(this, option, value);
                    _get(Object.getPrototypeOf(grandChildOfComplexPlugin.prototype), "_setOption", this).call(this, option + option, value);
                }
            }, {
                key: "setTestString",
                value: function setTestString(value) {
                    _get(Object.getPrototypeOf(grandChildOfComplexPlugin.prototype), "setTestString", this).call(this, value + value);
                }
            }]);

            return grandChildOfComplexPlugin;
        }(childOfComplexPlugin);

        describe("Pre-flight checks", function () {
            it("jQuery.addPlugin should be a function", function () {
                test.function(_jquery2.default.addPlugin);
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
                _jquery2.default.addPlugin(complexPlugin, defaults);
                test.function(_jquery2.default.fn.complexPlugin).object(_jquery2.default.fn.complexPlugin.defaults).is(defaults);
            });

            it("jQuery.addPlugin(childOfComplexPlugin, defaults) should create jQuery.fn.childOfComplexPlugin", function () {
                _jquery2.default.addPlugin(childOfComplexPlugin, defaults);
                test.function(_jquery2.default.fn.childOfComplexPlugin).object(_jquery2.default.fn.childOfComplexPlugin.defaults).is(defaults);
            });

            it("jQuery.addPlugin(grandChildOfComplexPlugin, defaults) should create jQuery.fn.grandChildOfComplexPlugin", function () {
                _jquery2.default.addPlugin(grandChildOfComplexPlugin, defaults);
                test.function(_jquery2.default.fn.grandChildOfComplexPlugin).object(_jquery2.default.fn.grandChildOfComplexPlugin.defaults).is(defaults);
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
                    test.object((0, _jquery2.default)(this).grandChildOfComplexPlugin("getInstance"));
                });
            });
            it("should copy the contents of `defaults` into the `options` member on each grandChildOfComplexPlugin instance", function () {
                nonUnique.each(function () {
                    test.object((0, _jquery2.default)(this).grandChildOfComplexPlugin("getInstance").options).is(defaults);
                });
            });
            it("should call `constructor` during instantiation and set the `initCalled` member on each grandChildOfComplexPlugin instance to true", function () {
                nonUnique.each(function () {
                    test.bool((0, _jquery2.default)(this).grandChildOfComplexPlugin("getInstance").initCalled).isTrue();
                });
            });

            describe("jQuery('.non-unique').grandChildOfComplexPlugin('map', 'getTestNumber')", function () {
                it("should return a jQuery selection which can be converted to an Array matching [123, 123, 123, 123] by calling .get() on the selection", function () {
                    var results = nonUnique.grandChildOfComplexPlugin("map", "getTestNumber");
                    test.object(results).array(results.get()).is([123, 123, 123, 123]);
                });
            });

            describe("jQuery('.non-unique').grandChildOfComplexPlugin('map', 'getTestBoolean')", function () {
                it("should return a jQuery selection which can be converted to an Array matching [true, true, true, true] by calling .get() on the selection", function () {
                    var results = nonUnique.grandChildOfComplexPlugin("map", "getTestBoolean");
                    test.object(results).array(results.get()).is([true, true, true, true]);
                });
            });

            describe("jQuery('.non-unique').grandChildOfComplexPlugin('map', 'getTestString')", function () {
                it("should return a jQuery selection which can be converted to an Array matching ['A string', 'A string', 'A string', 'A string'] by calling .get() on the selection", function () {
                    var results = nonUnique.grandChildOfComplexPlugin("map", "getTestString");
                    test.object(results).array(results.get()).is(["A string", "A string", "A string", "A string"]);
                });
            });
        });
    });
});