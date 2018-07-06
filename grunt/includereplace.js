module.exports = {
    docs: {
        options: {
            globals: {
                'title': 'Fox Sports Australia - RCG Departure Tracker'
            }
        },
        files: [
            {
                expand: true,
                cwd: 'src/docs',
                src: ['**/*', '!**/*.inc.html'],
                dest: 'dist/docs'
            }
        ]
    }
};
