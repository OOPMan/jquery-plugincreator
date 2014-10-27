var test = require("unit.js"),
    assert = test.assert,
    withTestHtmlIt = require("./common.js").withTestHtmlIt;

describe("pluginCreator", function () {
    describe(".addPlugin('test')", function () {
        withTestHtmlIt("should create jQuery.fn.test", function (errors, window, jQuery, pluginCreator) {
                pluginCreator.addPlugin("test");
                test.function(jQuery.fn.test)
                    .object(jQuery.fn.test.defaults)
                    .function(jQuery.fn.test.updateDefaultsWith)
                    .function(jQuery.fn.test.extendMembersWith)
                    .function(jQuery.fn.test.cloneTo)
                    .function(jQuery.fn.test.extendTo);
            }
        );
    });
});


