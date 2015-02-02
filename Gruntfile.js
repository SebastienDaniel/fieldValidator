module.exports = function(grunt) {
    // instructions for grunt
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
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
        clean: {
            dev: {
                src: ["build/dev/**"]
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    
    grunt.registerTask('dev-build', ['clean:dev', 'copy:dev']);
    grunt.registerTask('prod-build', ['copy:prod']);
};