module.exports = function(grunt) {
    // instructions for grunt
    
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        removelogging: {
            build: {
                src: "src/scripts/fieldValidator.js"
            }
        },
        uglify: {
            build: {
                options: {
                    mangle: true,
                    compress: true,
                    screw_ie8: true
                },
                src: "src/scripts/fieldValidator.js",
                dest: "build/js/fieldValidator.min.js"
            }
        },
        jshint: {
            src: ["src/scripts/**/*.js"]
        },
        jscs: {
            src: "src/scripts/**/*.js"
        },
        jsdoc: {
            dev: {
                src: ['src/scripts/**/*.js'],
                options: {
                    destination: 'doc',
                    configure : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json"
                }
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks("grunt-remove-logging");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-jsdoc");
    
    // dev build starts by wiping build/dev/ clean
    grunt.registerTask("test", ["jshint", "jscs"]);
    grunt.registerTask("build", ["jshint", "jscs", "removelogging:build", "uglify:build"]);
    //grunt.registerTask("prod-build", ["copy:prod"]);
};