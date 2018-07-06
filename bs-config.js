/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 */
module.exports = {
    'ui': {
        'port': 3001,
        'weinre': {
            'port': 8080
        }
    },
    'files': ['dist/css/**.css', 'dist/js/**.js', 'dist/docs/**.html'],
    'watchOptions': {},
    'server': {
        baseDir: 'dist/docs',
        routes: {
            '/css': 'dist/css',
            '/js': 'dist/js'
        }
    },
    'proxy': false,
    'port': 2784, // First 4 digit of project name in Telephone Letter mapping - ARTI
    'middleware': false,
    'serveStatic': [],
    'ghostMode': {
        'clicks': true,
        'scroll': true,
        'forms': {
            'submit': true,
            'inputs': true,
            'toggles': true
        }
    },
    'logLevel': 'info',
    'logPrefix': 'BS',
    'logConnections': false,
    'logFileChanges': true,
    'logSnippet': true,
    'rewriteRules': false,
    'open': 'local',
    'browser': 'default',
    'xip': false,
    'hostnameSuffix': false,
    'reloadOnRestart': false,
    'notify': true,
    'scrollProportionally': true,
    'scrollThrottle': 0,
    'scrollRestoreTechnique': 'window.name',
    'scrollElements': [],
    'scrollElementMapping': [],
    'reloadDelay': 0,
    'reloadDebounce': 0,
    'reloadThrottle': 0,
    'plugins': [],
    'injectChanges': true,
    'startPath': null,
    'minify': true,
    'host': null,
    'localOnly': false,
    'codeSync': true,
    'timestamps': true,
    'clientEvents': [
        'scroll',
        'scroll:element',
        'input:text',
        'input:toggles',
        'form:submit',
        'form:reset',
        'click'
    ],
    'socket': {
        'socketIoOptions': {
            'log': false
        },
        'socketIoClientConfig': {
            'reconnectionAttempts': 50
        },
        'path': '/browser-sync/socket.io',
        'clientPath': '/browser-sync',
        'namespace': '/browser-sync',
        'clients': {
            'heartbeatTimeout': 5000
        }
    },
    'tagNames': {
        'less': 'link',
        'scss': 'link',
        'css': 'link',
        'jpg': 'img',
        'jpeg': 'img',
        'png': 'img',
        'svg': 'img',
        'gif': 'img',
        'js': 'script'
    }
};
