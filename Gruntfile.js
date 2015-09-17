module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
            banner: '/*! \n Name        : <%= pkg.name %> \n Version     : <%= pkg.version %> \n Author      : <%= pkg.author.name %> - <%= pkg.author.company %>\n Date        : <%= grunt.template.today("dd-mm-yyyy") %> \n Description : <%= pkg.description %> \n Homepage    : <%= pkg.homepage %> \n Demopage    : <%= pkg.demopage %> \n */\n'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
      ngmin: { 
          options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
          files :{
    src: [ 'dist/<%= pkg.name %>.js'],
    dest: 'dist/<%= pkg.name %>.ngmin.js'
          }
},
    uglify: {
      options: {
        banner: '<%= concat.options.banner %>'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= ngmin.files.dest %>']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
 
  
 
  grunt.registerTask('default', ['concat','ngmin','uglify']);

};