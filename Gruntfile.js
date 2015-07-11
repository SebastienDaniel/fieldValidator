module.exports = function(grunt) {
    // instructions for grunt
    
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        removelogging: {
            build: {
                src: "fieldValidator.js"
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
                src: "fieldValidator.js",
                dest: "fieldValidator.min.js"
            }
        },
        jshint: {
            src: ["fieldValidator.js"]
        },
        jscs: {
            src: "fieldValidator.js"
        },
        jsdoc: {
            dev: {
                src: ['fieldValidator.js'],
                options: {
                    destination: 'doc/'
                }
            }
        },
        jasmine: {
            src: ["fieldValidator.js"],
            options: {
                specs: ["test/*spec.js"]
            }
        },
        githooks: {
            all: {
                "pre-commit": {
                    taskNames: "",
                    template: "gitHookTemplate.txt",
                    errorMsg: "Your files do not pass the quality tests\\nPlease fix your files before committing"
                },
                "pre-push": {
                    taskNames: "",
                    template: "gitHookTemplate.txt"
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
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-jasmine");
    grunt.loadNpmTasks("grunt-githooks");
    
    // dev build starts by wiping build/dev/ clean
    grunt.registerTask("test", ["jshint", "jscs", "jasmine"]);
    grunt.registerTask("build", ["test", "clean", "removelogging:build", "uglify:build"]);
    //grunt.registerTask("prod-build", ["copy:prod"]);
};
