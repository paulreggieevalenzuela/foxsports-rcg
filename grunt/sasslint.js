module.exports = function (grunt) {
    return {
        options: {
            configFile : '.sass-lint.yml'
        },
        target: ['src/scss/**/*.scss']
    };
};
