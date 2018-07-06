module.exports = {
    coverage: {
        src: 'test/runner.html',
        dest: 'tmp/coverage/runner.html',
        rename: function (dest, src) {
            return dest + src.replace('/r', 'R');
        },
        options: {
            patterns: [
                {
                    // Step us out two directories for all external files.
                    match: /"\.\.\//g,
                    replacement: '"../../'
                },
                {
                    match: /<script src\=\"..\/tmp\/test\/integrationTests.js\"><\/script>/g,
                    replacement: ''
                },
                {
                    match: /(\.\.\/)*tmp\/test\/unitTests.js/g,
                    replacement: 'coverage-bundle.js'
                }
            ]
        }
    },

    cssTestExternalFix: {
        src: 'dist/css/article.min.css',
        dest: 'tmp/test/styles-test.css',
        options: {
            patterns: [{
                match: /(?:["']..\/)(.+?)(?:["'])/g,
                replacement: '"../../dist/$1"'
            }]
        }
    },

    cleanTestResults: {
        files: [{
            expand: true,
            flatten: true,
            src: 'tmp/test/results/*.xml',
            dest: 'tmp/test/results/'
        }],
        options: {
            patterns: [
                {
                    match: /^(Moment Timezone)(.+)$([\r\n])/gm,
                    replacement: ''
                },
                {
                    match: /^(Error loading resource)(.+)$(\n)/gm,
                    replacement: ''
                }
            ]
        }
    }
};
