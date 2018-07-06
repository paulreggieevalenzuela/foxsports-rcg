module.exports = {
    js: {
        files: ['src/**/*.js'],
        tasks: [
            'lint-js' // 'lint-js',
        ]
    },
    docs: {
        files: ['src/docs/**/*'],
        tasks: ['build-docs']
    },
    styles: {
        files: ['src/**/*.scss'],
        tasks: ['build-styles-dev', 'replace:cssTestExternalFix']
    }
};
