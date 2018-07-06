/**
 * Not the conventional grunt file, all tasks are
 * logged under grunt/. Each grunt file (and its name)
 * relates to a task.
 */
'use strict';

module.exports = function ( grunt ) {
    require('@fsa/fs-commons/lib/grunt/expose-version')(grunt);
    require('@fsa/fs-commons/lib/grunt/check-test-results')(grunt, ['tmp/test/results/**/*.xml']);
    require('time-grunt')(grunt);
    grunt.loadNpmTasks('grunt-notify');

    var target = grunt.option('target') || 'dev';

    grunt.loadNpmTasks('grunt-env');
    grunt.task.run('env:' + target);

    require('load-grunt-config')(grunt, {
        data: { //data passed into config.  Can use with <%= test %>
            pkg: grunt.file.readJSON('package.json')
        },
        jitGrunt: {
            staticMappings: {
                env            : 'grunt-env',
                includereplace : 'grunt-include-replace',
                sasslint       : 'grunt-sass-lint'
            }
        }
    });

    grunt.registerTask('lint-js', 'Lint JS', function () {
        var exec = require('child_process').exec;
        var done = this.async();

        exec('npm run lint-js --silent', function (error, stdout, stderr) {
            if (!error) {
                grunt.log.writeln(stdout);
            } else {
                grunt.log.error(stdout, stderr);
                grunt.fail.warn('Error: npm lint', error);
            }
            done();
        });
    });

    grunt.registerTask('build-js', 'Build Javascript Files.', function () {
        if (target == 'dev') {
            grunt.task.run('build-js-dev');
        } else {
            grunt.task.run('build-js-prod');
        }
    });

    grunt.registerTask('test', 'Run tests for all your browsers', function () {
        var exec = require('child_process').exec;
        var done = this.async();

        grunt.log.writeln('Depreciated, please use `npm test`');

        exec('npm test', function (error, stdout, stderr) {
            if (!error) {
                grunt.log.writeln(stdout);
            } else {
                grunt.log.error(stderr);
                grunt.fail.warn('Error: npm test', error);
            }
            done();
        });
    });

    grunt.registerTask('test-ci', 'Run tests for CI system', function () {
        var exec = require('child_process').exec;
        var done = this.async();

        grunt.log.writeln('Depreciated, please use `npm run test-ci`');

        exec('npm run test-ci', function (error, stdout, stderr) {
            if (!error) {
                grunt.log.writeln(stdout);
            } else {
                grunt.log.error(stderr);
                grunt.fail.warn('Error: npm test', error);
            }
            done();
        });
    });

    grunt.registerTask('watcher', 'Grunt Watches and Browserify Watches', function () {
        var child;
        var watchers = [
            'browserify:docsWatch',

            'browserify:unitTestsWatch',
            'browserify:integrationTestsWatch'
        ];

        watchers.forEach(function (watch) {
            child = grunt.util.spawn({
                grunt: true,
                args: watch
            }, function (error, result, code) {
                grunt.log.writeln(watch + ': Result');
                grunt.log.writeln(error);
                grunt.log.writeln(result);
                grunt.log.writeln(code);
            });
            child.stdout.pipe(process.stdout);
            child.stderr.pipe(process.stderr);
        });

        var linterChild;
        linterChild = grunt.util.spawn({
            cmd: 'npm',
            args: ['run', 'lint-js-watch']
        }, function (error, result, code) {
            if (error) {
                grunt.log.writeln(error);
            }

            if (result) {
                grunt.log.writeln(result);
            }

            if (code) {
                grunt.log.writeln('Linter Code Error' + code);
            }
        });
        linterChild.stdout.pipe(process.stdout);
        linterChild.stderr.pipe(process.stderr);

        grunt.task.run('watch');
    });
};
