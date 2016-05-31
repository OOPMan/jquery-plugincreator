"use strict";
var test = require("unit.js"),
    fs = require("fs"),
    jsdom = require("jsdom"),
    esprima = require("esprima"),
    html = fs.readFileSync(__dirname + "/test.html"),
    common = {
        getDocument: function () {
            return jsdom.jsdom(html);
        },
        getWindow: function (document) {
            return document ? document.parentWindow : common.getDocument().defaultView;
        },
        getjQuery: function (window) {
            var window = window || common.getWindow(),
                jQuery = require("jquery")(window),
                pluginCreator = require(__dirname + "/../dist/jquery.plugincreator.js");
            return jQuery;
        }
    };

module.exports = common;
