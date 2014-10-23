var fs = require("fs"),
    test = require("unit.js"),
    assert = test.assert,
    jsdom = require("jsdom"),
    html = fs.readFileSync(__dirname + "/test.html");


describe("Testing addPlugin", function () {
    it("Loading Test Environment", function () {
        jsdom.env({
            html: html,
            done: function (errors, window) {
                global.window = window;
                var jQuery = require("jquery"),
                    pluginCreator = require(__dirname + "/../js/jquery.plugincreator");
                describe("Running Tests", function () {
                    it("Confirming jQuery and jQuery-PluginCreator loaded correctly", function () {
                        test.function(jQuery)
                            .object(pluginCreator)
                            .function(jQuery.addPlugin)
                            .function(pluginCreator.addPlugin)
                                .is(jQuery.addPlugin);
                    });
                    it("Adding an empty Plugin named 'test'", function () {
                        pluginCreator.addPlugin("test");
                        test.function(jQuery.fn.test)
                            .object(jQuery.fn.test.defaults)
                            .function(jQuery.fn.test.updateDefaultsWith)
                            .function(jQuery.fn.test.extendMembersWith)
                            .function(jQuery.fn.test.cloneTo)
                            .function(jQuery.fn.test.extendTo);
                    });
                });
                window.close();
            }
        });
    });
});


