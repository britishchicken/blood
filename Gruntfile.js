module.exports = function(grunt) {

// Project configuration.
grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  uglify: {
    options: {
      banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
      mangle: false
    },
    build: {
      src: 'client/dist/build_es5.js',
      dest: 'client/dist/build_min.js'
    },
  },
  concat: {
    options: {
      separator: ';',
    },
    dist: {
      src: ['client/lib/geolocation-marker/src/geolocation-marker.js', 'client/app.js', 'client/*/*_controller.js', 'client/*/*_service.js'],
      dest: 'client/dist/build.js',
    },
  },
  babel: {
    options: {
      sourceMap: true,
      presets: ['es2015']
    },
    dist: {
      files: {
        'client/dist/build_es5.js': 'client/dist/build.js'
      }
    }
  },

  connect: {
    server: {
      options: {
        hostname: 'localhost',
        port: 9876,
        base: '.'
      }
    }
  },
  protractor_webdriver: {
    webDriverStart: {
      options: {
        path: './node_modules/protractor/bin/',
        command: 'webdriver-manager start'
      }
    },
  },
  protractor: {
    options: {
      configFile: './protractor.conf.js',
      keepAlive: false,
      noColor: false,
      args: { }
    },
    test: {
      options: {
        configFile: './protractor.conf.js',
        args: { }
      }
    }
  }
});

// Load the plugin that provides the "uglify" task.
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-babel');

grunt.loadNpmTasks('grunt-contrib-connect');
grunt.loadNpmTasks('grunt-protractor-runner');
grunt.loadNpmTasks('grunt-protractor-webdriver');

// Default task(s).
grunt.registerTask('default', ['concat', 'babel', 'uglify']);
grunt.registerTask('test', ['connect', 'protractor_webdriver:webDriverStart', 'protractor:test']);

};
