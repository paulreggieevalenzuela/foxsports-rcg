module.exports = {
    'default': ['lint', 'build', 'expose-version'],

    'lint'     : ['lint-js', 'lint-css'],
    'lint-css' : ['sasslint'],

    'build': [
        'build-js',
        'build-docs',
        'build-styles',
        'replace:cssTestExternalFix' // Dev Helper to make sure we see the styles during testing.
    ],

    'build-docs'   : ['includereplace:docs'],

    'build-js'      : ['build-js-prod'],
    'build-js-dev'  : ['browserify:docs'],
    'build-js-prod' : [
        'browserify:docs', 'exorcise:docs',
        'browserify:prod', 'exorcise:prod', 'uglify:prod', 'optimize-js:prod'
    ],

    'build-styles'      : 'build-styles-prod',
    'build-styles-prod' : ['sass:all', 'postcss:all', 'lint-css'],
    'build-styles-dev'  : ['sass:dev', 'postcss:dev', 'lint-css'],

    'build-tests': [
        'browserify:unitTests',
        'browserify:integrationTests',
        'build-styles',
        'replace:cssTestExternalFix'
    ]
};
