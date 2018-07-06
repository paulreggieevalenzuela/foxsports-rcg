module.exports = function (grunt) {
    var target = grunt.option('target') || 'dev';

    return {
        options: {
            report    : 'min',
            mangle    : true, // (Only saves 0.2 odd seconds)
            compress  : target === 'production' ? {} : false, // dont compress on dev
            sourceMap : true,
            wrap      : true
        },
        prod: {
            files : {
                'dist/js/rcg-departure-tracker.min.js': [
                    'dist/js/rcg-departure-tracker.min.js'
                ]
            }
        }
    };
};
