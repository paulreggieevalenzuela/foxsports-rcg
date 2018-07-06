var merge = require('lodash').merge;

module.exports = function (grunt) {
    var target = grunt.option('target') || 'dev';

    var coreOptions = {
        options: {
            browserifyOptions: {
                debug: true,
                fullPaths: target === 'production' ? false : true // fullpaths used for watch
            }
        }
    };

    /** CORE BUILD OPTIONS **/
    var docsOptions = merge({
        src: 'src/js/docs.js',
        dest: 'dist/js/docs.min.js',
        options: {
            browserifyOptions: {
                standalone: '<%= pkg.name %>'
            }
        }
    }, coreOptions);

    var docsWatchOptions = merge({
        options: { keepAlive: true, watch: true }
    }, coreOptions, docsOptions);

    /** UNITTESTS BUILD OPTIONS **/
    var unitTestsOptions = {
        src: 'test/unit/**/*.js',
        dest: 'tmp/test/unitTests.js'
    };

    var unitTestsWatchOptions = merge({
        options: { keepAlive: true, watch: true}
    }, unitTestsOptions);

    /** INTEGRATIONTESTS BUILD OPTIONS **/
    var integrationTestsOptions = {
        src: 'test/integration/**/*.js',
        dest: 'tmp/test/integrationTests.js'
    };

    var integrationTestsWatchOptions = merge({
        options: { keepAlive: true, watch: true }
    }, integrationTestsOptions);

    var prodOptions = merge({
        src: 'src/js/rcg-departure-tracker.js',
        dest: 'dist/js/rcg-departure-tracker.min.js'
    }, coreOptions);

    return {
        docs      : docsOptions,
        docsWatch : docsWatchOptions,

        prod      : prodOptions,

        unitTests             : unitTestsOptions,
        unitTestsWatch        : unitTestsWatchOptions,
        integrationTests      : integrationTestsOptions,
        integrationTestsWatch : integrationTestsWatchOptions,

        coverage: {
            src  : 'tmp/coverage/instrument/test/**/*.js',
            dest : 'tmp/coverage/coverage-bundle.js'
        }
    };
};
