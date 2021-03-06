/*
 * grunt-xamarinbuildandsign
 * https://github.com/robert-waggott/XamarinBuildAndSignGruntPlugin
 *
 * Copyright (c) 2015 robert.waggott
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function(grunt) {
    var self = this;
    var exec = require("exec-sync");

    self.getBuildCommand = function(type, project, configuration) {
        var ios = ["ios", "ipa"];
        var android = ["android", "apk"];

        if (ios.indexOf(type) !== -1) {
            return [
                "'/Applications/Xamarin Studio.app/Contents/MacOS/mdtool'",
                "build", 
                "--configuration:'" + configuration + "|iPhone'",
                project
            ].join(" ");
        }

        if (android.indexOf(type) !== -1) {
            return [
                "xbuild",
                "/t:SignAndroidPackage", 
                "/p:Configuration=" + configuration,
                project
            ].join(" ");
        }
        
        grunt.fail.fatal("unrecognized type specified:" + type);
    };

    grunt.registerMultiTask("XamarinBuildAndSign", "Builds and signs your Xamarin.iOS or Xamarin.Android", function() {
        var data = this.data;
        var type = data.type;
        var project = data.project;
        var configuration = data.configuration;
        var keychainPassword = data.keychainPassword;

        if (!type) {
            grunt.fail.fatal("type not specified");
        }

        if (!project) {
            grunt.fail.fatal("project not specified");
        }

        if (!configuration) {
            grunt.fail.fatal("configuration not specified");
        }

        if (keychainPassword) {
            exec("security -v unlock-keychain -p " + keychainPassword + " '$HOME/Library/Keychains/login.keychain'");
        }

        var output = exec(self.getBuildCommand(type.trim().toLowerCase(), project, configuration));

        grunt.log.writeln(output);
    });
};