var test = require("unit.js"),
    fs = require("fs"),
    jsdom = require("jsdom"),
    html = fs.readFileSync(__dirname + "/test.html");
    common = {
        getDocument: function () {
            return jsdom.jsdom(html);
        },
        getWindow: function (document) {
            return document ? document.parentWindow : common.getDocument().parentWindow;
        },
        getjQuery: function (window) {
            var window = window || common.getWindow(),
                jQuery = require("jquery")(window),
                pluginCreator = require(__dirname + "/../js/jquery.plugincreator.js")(jQuery);
            return jQuery;
        }
    };

module.exports = common;
