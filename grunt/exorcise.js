module.exports = {
    options: {
        root: '../../'
    },
    docs: {
        files: {
            'dist/js/docs.min.map': ['dist/js/docs.min.js']
        }
    },
    prod: {
        files: {
            'dist/js/rcg-departure-tracker.min.map': ['dist/js/rcg-departure-tracker.min.js']
        }
    }
};
