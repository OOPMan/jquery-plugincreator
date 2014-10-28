var test = require("unit.js"),
    assert = test.assert,
    common = require("./common.js");

describe("jQuery.fn.testPlugin", function () {
    var window = common.getWindow(),
        jQuery = common.getjQuery(window),
        unique = jQuery("#unique"),
        constructor = function () {
            this.constructorCalled = true;
        },
        defaults = {
            testNumber: 123,
            testBoolean: true,
            testString: "A string"
        },
        members = {
            constructorCalled: false,
            _setOption: function (option, value) {
                this.options[option] = value;
            },
            _getOption: function (option) {
                return this.options[option];
            },
            setTestNumber: function (value) {
                if (typeof value == "number") this._setOption("testNumber", value);
            },
            getTestNumber: function () {
                return this._getOption("testNumber");
            },
            setTestBoolean: function (value) {
                if (typeof value == "boolean") this._setOption("testBoolean", value);
            },
            getTestBoolean: function () {
                return this._getOption("testBoolean");
            },
            setTestString: function (value) {
                if (typeof value == "string") this._setOption("testString", value);
            },
            getTestString: function () {
                return this._getOption("testString");
            }
        };

    describe("Pre-flight checks", function () {
        it("jQuery.addPlugin should be a function", function() {
            test.function(jQuery.addPlugin);
        });

        it("jQuery('#unique') should contain a single item", function () {
            test.number(unique.length).is(1);
        });

        it("jQuery.addPlugin('testPlugin', constructor, defaults, members) should create jQuery.fn.testPlugin", function () {
            jQuery.addPlugin("testPlugin", constructor, defaults, members);
            test.function(jQuery.fn.testPlugin)
                .object(jQuery.fn.testPlugin.defaults).is(defaults)
                .function(jQuery.fn.testPlugin.updateDefaultsWith)
                .function(jQuery.fn.testPlugin.extendMembersWith)
                .function(jQuery.fn.testPlugin.cloneTo)
                .function(jQuery.fn.testPlugin.extendTo);
        });
    });

    after(function () {
        window.close();
    });
});
