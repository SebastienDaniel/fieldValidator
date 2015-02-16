module.exports = function(grunt) {
    // instructions for grunt
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        removelogging: {
            dev: {
                src: "build/dev/js/fieldValidator.js"
            }
        },
        jshint: {
            dev: ["build/dev/js/**/*.js"]
        },
        clean: {
            dev: {
                src: ["build/dev/**"]
            }
        },
        copy: {
            dev: {
                files: [
                    {
                        src: 'src/index.html',
                        dest: 'build/dev/index.html'
                    },
                    {
                        expand: true,
                        cwd: 'src/scripts/',
                        src: ['**/*.js'],
                        dest: 'build/dev/js/'
                    }
                ]
            },
            prod: {
                src: 'src/index.html',
                dest: 'build/prod/index.html'
            }
        },
        jscs: {
            dev: {
                src: "build/dev/js/*.js",
                options: {
                    config: "askarii-jscs.json"
                }
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-remove-logging');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs-checker');
    
    // dev build starts by wiping build/dev/ clean
    grunt.registerTask('dev-build', ['clean:dev', 'copy:dev', 'removelogging:dev', 'jshint:dev', 'jscs:dev']);
    //grunt.registerTask('prod-build', ['copy:prod']);
};