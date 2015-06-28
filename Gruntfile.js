module.exports = function(grunt) {
    // instructions for grunt
    
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        removelogging: {
            build: {
                src: "src/scripts/fieldValidator.js"
            }
        },
        clean: ["build/**"],
        uglify: {
            build: {
                options: {
                    mangle: true,
                    compress: true,
                    screw_ie8: true,
                    preserveComments: false,
                    mangleProperties: true,
                    reserveDOMProperties: true
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
        },
        jasmine: {
            src: ["src/scripts/**/*.js"],
            options: {
                specs: ["test/*spec.js"] // jasmine node requires spec files to end with "spec.js"
                //helpers: "test/test-form.html",
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks("grunt-remove-logging");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-jsdoc");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-jasmine");
    
    // dev build starts by wiping build/dev/ clean
    grunt.registerTask("test", ["jshint", "jscs", "jasmine"]);
    grunt.registerTask("build", ["test", "clean", "removelogging:build", "uglify:build"]);
    //grunt.registerTask("prod-build", ["copy:prod"]);
};
