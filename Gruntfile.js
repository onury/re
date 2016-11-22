const webpackConfig = require('./webpack.config');

/*!
 *  Grunt Configurations
 */
module.exports = function (grunt) {
    'use strict';

    // ----------------------------
    //  GRUNT CONFIG
    // ----------------------------

    grunt.initConfig({

        // 'pkg': grunt.file.readJSON('package.json'),

        // ----------------------------
        //  CONFIGURE TASKS
        // ----------------------------

        // for node tests
        'jasmine_nodejs': {
            options: {
                specNameSuffix: 'spec.js',
                helperNameSuffix: 'helper.js',
                useHelpers: false,
                random: false,
                seed: null,
                defaultTimeout: null,
                stopOnFailure: false,
                traceFatal: true,
                reporters: {
                    console: {
                        colors: true,
                        cleanStack: 3,
                        verbosity: 4,
                        listStyle: 'indent',
                        activity: false
                    }
                }
            },
            all: {
                specs: ['./test/**/*.spec.js']
            }
        },

        // for browser tests
        // see _SpecRunner.html file after tests are run
        'jasmine': {
            test: {
                src: './dist/re.min.js',
                options: {
                    // Prevents the auto-generated specfile used to run your
                    // tests from being automatically deleted.
                    keepRunner: true,
                    specs: './test/re.spec.js'
                }
            }
        },

        'webpack': webpackConfig,

        'docma': {
            traceFatal: true,
            options: {
                config: './docma.config.json'
            }
        },

        'watch': {
            all: {
                files: [
                    './src/*.js',
                    './test/*.spec.js'
                ],
                tasks: ['jasmine_nodejs']
            }
        }
    });

    // ----------------------------
    //  LOAD GRUNT PLUGINS
    // ----------------------------

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // ----------------------------
    //  REGISTER TASKS
    // ----------------------------

    grunt.registerTask('node-test', ['webpack:min', 'jasmine_nodejs']);
    grunt.registerTask('browser-test', ['webpack:min', 'jasmine']);
    grunt.registerTask('test', ['webpack:min', 'jasmine_nodejs', 'jasmine']);
    grunt.registerTask('build', ['webpack:full', 'webpack:min']);
    grunt.registerTask('release', ['build', 'docma']);
    grunt.registerTask('default', ['webpack:full', 'test']);
};
