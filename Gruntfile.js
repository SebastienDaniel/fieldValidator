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
                    screwIE8: true
                },
                src: "src/scripts/fieldValidator.js",
                dest: "build/js/fieldValidator.min.js"
            }
        },
        jshint: {
            src: ["src/scripts/**/*.js"]
        },
        jscs: {
            src: "src/scripts/**/*.js",
            options: {
                config: "askarii-jscs.json"
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks("grunt-remove-logging");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jscs-checker");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    
    // dev build starts by wiping build/dev/ clean
    grunt.registerTask("test", ["jshint", "jscs"]);
    grunt.registerTask("build", ["jshint", "jscs", "removelogging:build", "uglify:build"]);
    //grunt.registerTask("prod-build", ["copy:prod"]);
};