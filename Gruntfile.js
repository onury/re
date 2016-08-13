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
                        cleanStack: 1,
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
                    './test/**/*.spec.js'
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

    grunt.registerTask('test', ['jasmine_nodejs']);
    grunt.registerTask('build', ['webpack:full', 'webpack:min']);
    grunt.registerTask('release', ['build', 'docma']);
    grunt.registerTask('default', ['webpack:full', 'test']);
};
