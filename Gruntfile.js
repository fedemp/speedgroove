module.exports = function(grunt){
  "use strict";
  grunt.initConfig({
    jshint: {
      app: ['app.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('default', ['jshint']);
};
