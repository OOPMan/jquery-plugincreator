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
        global.jQueryAddPlugin = mod.exports;
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

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

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

    describe("jQuery.addPlugin", function () {
        var unique = (0, _jquery2.default)("#unique"),
            assert = _unit2.default.assert;

        describe("Pre-flight checks", function () {
            it("jQuery.addPlugin should be a function", function () {
                _unit2.default.function(_jquery2.default.addPlugin).is(_jquery2.default.addPlugin);
            });

            it("jQuery.addPlugin.jQueryPlugin should be a function", function () {
                _unit2.default.function(_jquery2.default.addPlugin.jQueryPlugin).is(_jquery2.default.addPlugin.jQueryPlugin);
            });

            it("jQuery('#unique') should contain a single item", function () {
                _unit2.default.number(unique.length).is(1);
            });
        });

        describe("jQuery.addPlugin(testPlugin)", function () {
            var testPlugin = function (_jQuery$addPlugin$jQu) {
                _inherits(testPlugin, _jQuery$addPlugin$jQu);

                function testPlugin() {
                    _classCallCheck(this, testPlugin);

                    return _possibleConstructorReturn(this, Object.getPrototypeOf(testPlugin).apply(this, arguments));
                }

                return testPlugin;
            }(_jquery2.default.addPlugin.jQueryPlugin);

            it("should create jQuery.fn.testPlugin", function () {
                _jquery2.default.addPlugin(testPlugin);
                _unit2.default.function(_jquery2.default.fn.testPlugin).object(_jquery2.default.fn.testPlugin.defaults);
            });

            describe("jQuery('#unique').testPlugin()", function () {
                it("should instantiate testPlugin on #unique", function () {
                    unique.testPlugin();
                    _unit2.default.object(unique.data("jquery-plugincreator-testPlugin"));
                });
            });

            describe("jQuery('#unique').testPlugin('destroy')", function () {
                it("should destroy testPlugin on #unique", function () {
                    unique.testPlugin("destroy");
                    _unit2.default.undefined(unique.data("jquery-plugincreator-testPlugin"));
                });
            });
        });

        describe("jQuery.addPlugin(testPlugin1, defaults)", function () {
            var testPlugin1 = function (_jQuery$addPlugin$jQu2) {
                _inherits(testPlugin1, _jQuery$addPlugin$jQu2);

                function testPlugin1() {
                    _classCallCheck(this, testPlugin1);

                    return _possibleConstructorReturn(this, Object.getPrototypeOf(testPlugin1).apply(this, arguments));
                }

                return testPlugin1;
            }(_jquery2.default.addPlugin.jQueryPlugin);

            it("should create jQuery.fn.testPlugin1", function () {
                _jquery2.default.addPlugin(testPlugin1, {
                    test: true
                });
                _unit2.default.function(_jquery2.default.fn.testPlugin1);
            });

            describe("jQuery('#unique').testPlugin1()", function () {
                it("should instantiate testPlugin1 on #unique", function () {
                    unique.testPlugin1();
                });
                it("should make `defaults` available to the instance via the `options` member created during instantiation", function () {
                    var instance = unique.data("jquery-plugincreator-testPlugin1");
                    _unit2.default.object(instance).hasProperty("options").object(instance.options).hasProperty("test", true);
                });
                after(function () {
                    unique.testPlugin1("destroy");
                });
            });
        });

        describe("jQuery.addPlugin(testPlugin2)", function () {
            var testPlugin2 = function (_jQuery$addPlugin$jQu3) {
                _inherits(testPlugin2, _jQuery$addPlugin$jQu3);

                function testPlugin2() {
                    _classCallCheck(this, testPlugin2);

                    return _possibleConstructorReturn(this, Object.getPrototypeOf(testPlugin2).apply(this, arguments));
                }

                _createClass(testPlugin2, [{
                    key: "init",
                    value: function init() {
                        this.initCalled = true;
                        this.testValue = true;
                    }
                }, {
                    key: "testFunction1",
                    value: function testFunction1() {
                        this.testFunctionResult = true;
                    }
                }, {
                    key: "testFunction2",
                    value: function testFunction2(parameter) {
                        this.testFunctionResult = parameter;
                    }
                }]);

                return testPlugin2;
            }(_jquery2.default.addPlugin.jQueryPlugin);

            it("should create jQuery.fn.testPlugin2", function () {
                _jquery2.default.addPlugin(testPlugin2);
                _unit2.default.function(_jquery2.default.fn.testPlugin2);
            });

            describe("jQuery('#unique').testPlugin2()", function () {
                it("should instantiate testPlugin2 on #unique", function () {
                    unique.testPlugin2();
                    this.instance = unique.data("jquery-plugincreator-testPlugin2");
                });
                it("should make `members` available to the instance via the prototype", function () {
                    _unit2.default.object(this.instance).hasProperty("testValue", true).function(this.instance.testFunction1).function(this.instance.testFunction2);
                });
                it("should call the `init` member on the instance if it exists", function () {
                    _unit2.default.object(this.instance).hasProperty("initCalled", true);
                });
            });

            describe("jQuery('#unique').testPlugin2('testFunction1')", function () {
                it("should set `testFunctionResult` on the instance to `true`", function () {
                    var instance = unique.data("jquery-plugincreator-testPlugin2");
                    unique.testPlugin2("testFunction1");
                    _unit2.default.object(instance).hasProperty("testFunctionResult", true);
                });
            });

            describe("jQuery('#unique').testPlugin2('testFunction2', 'someValue')", function () {
                it("should set `testFunctionResult` on the instance to `someValue`", function () {
                    var instance = unique.data("jquery-plugincreator-testPlugin2");
                    unique.testPlugin2("testFunction2", "someValue");
                    _unit2.default.object(instance).hasProperty("testFunctionResult", "someValue");
                });
                after(function () {
                    unique.testPlugin2("destroy");
                });
            });
        });
    });
});