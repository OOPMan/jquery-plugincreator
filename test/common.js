var test = require("unit.js"),
    fs = require("fs"),
    jsdom = require("jsdom"),
    html = fs.readFileSync(__dirname + "/test.html");


module.exports = {
    withTestHtmlIt: function (description, done) {
        it(description, function () {
            jsdom.env({
                html: html,
                done: function (errors, window) {
                    global.window = window;
                    var jQuery = require("jquery"),
                        pluginCreator = require(__dirname + "/../js/jquery.plugincreator");
                    test.function(jQuery)
                        .object(pluginCreator)
                        .function(jQuery.addPlugin)
                        .function(pluginCreator.addPlugin)
                        .is(jQuery.addPlugin);
                    done(errors, window, jQuery, pluginCreator);
                    window.close();
                }
            });
        });
    }
};
