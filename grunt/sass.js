var importPaths = require('@fsa/fs-commons/lib/grunt/helper-sass-import-path');

module.exports = {
    all: {
        'options': {
            'outputStyle' : 'compressed',
            'sourceMap'   : true,
            'importer'    : importPaths
        },
        'files': [{
            'expand' : true,
            'cwd'    : 'src/scss',
            'src'    : '**/*.scss',
            'dest'   : 'dist/css',
            'ext'    : '.min.css'
        }]
    },
    dev: {
        'options': {
            'sourceMap'   : true,
            'importer'    : importPaths
        },
        'files': [{
            'expand' : true,
            'cwd'    : 'src/scss',
            'src'    : '**/*.scss',
            'dest'   : 'dist/css',
            'ext'    : '.min.css'
        }]
    }
};
