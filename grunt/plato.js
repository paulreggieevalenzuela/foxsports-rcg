module.exports = {
    all: {
        options: {
            // excludeFromFile: '.platoignore'
            //   Excludes 1 file per line.  A blank line in that file will cause
            //   plato to ignore all files.

            // Added more with | in this regex or move to the file above
            // but we shouldn't need it _ever_ and this should be moved when we get
            // some real data.
            // exclude: /src\/js\/streams\/data-mocks.js/
        },
        files: {
            'reports/plato': [
                'src/js/**/*.js',
                'src/external/**/*.js'
            ]
        }
        // Target-specific file lists and/or options go here.
    }
};
