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
            _init: function () {
                this.initCalled = true;
            },
            _setOption: function (option, value) {
                this.options[option] = value;
            },
            setTestNumber: function (value) {
                if (typeof value == "number") this._setOption("testNumber", value);
                else throw value + " is not a number";
            },
            setTestBoolean: function (value) {
                if (typeof value == "boolean") this._setOption("testBoolean", value);
                else throw value + " is not a boolean";
            },
            setTestString: function (value) {
                if (typeof value == "string") this._setOption("testString", value);
                else throw value + " is not a string";
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
        grandchildMembers = {
            setTestString: function (value, _super) {
                _super(value + value);
            }
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
            test.bool(this.instance.initCalled, true);
        });

        describe("jQuery('#unique').testPlugin('setTestNumber', 321)", function () {
            it("should call `setTestNumber` on the testPlugin instance", function () {
                unique.testPlugin("setTestNumber", 321);
            });
            it("should set the `testNumber` key in the `options` member on the testPlugin instance to 321", function () {
                test.number(this.instance.options.testNumber).is(321);
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
                this.instance = unique.data("jquery-plugincreator-cloneOfTestPlugin");
                test.object(this.instance);
            });
            it("should copy the contents of `defaults` into the `options` member on the cloneOfTestPlugin instance", function () {
                test.object(this.instance.options).is(defaults);
            });
            it("should call `constructor` during instantiation and set the `initCalled` member to true", function () {
                test.bool(this.instance.initCalled, true);
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
                this.instance = unique.data("jquery-plugincreator-childOfTestPlugin");
                test.object(this.instance);
            });
            it("should copy the contents of `defaults` into the `options` member on the childOfTestPlugin instance", function () {
                test.object(this.instance.options).is(defaults);
            });
            it("should call `constructor` during instantiation and set the `initCalled` member to true", function () {
                test.bool(this.instance.initCalled, true);
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

    after(function () {
        window.close();
    });
});
