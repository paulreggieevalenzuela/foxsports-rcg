/* globals __coverage__ */

var fs = require('fs');

module.exports = {
    afterEnd: function (phantom) {
        fs.write('./tmp/coverage/coverage.json', phantom.page.evaluate(function () {
            return JSON.stringify(__coverage__);
        }));
    }
};
