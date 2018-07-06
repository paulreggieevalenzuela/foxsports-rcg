module.exports = {
    options: {
        map: {
            prev: 'dist/css/',
            inline: false
        },
        processors: [
            require('postcss-discard-duplicates')(),
            require('postcss-discard-empty')(),
            require('autoprefixer')({
                browsers: [
                    'last 2 Chrome versions',
                    'last 2 Firefox versions',
                    'Safari >= 8',
                    'last 2 ios versions',
                    'ie >= 10'
                ]
            })
        ]
    },
    all: {
        src: 'dist/css/**/*.css'
    },
    dev: {
        src: 'dist/css/*.css'
    }
};
