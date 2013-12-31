'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var SocketioGenerator = module.exports = function SocketioGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.option('format', {
    desc: 'Select one of `css`, `sass`, `less`, `stylus` for the bootstrap format.',
    type: String
  });

  this.format = options.format;

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(SocketioGenerator, yeoman.generators.Base);

SocketioGenerator.prototype.getProjectName = function getProjectName(){

  var cb = this.async();
  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [{
    name: 'projectName',
    message: 'What do you want to call this project?'
  }];

  this.prompt(prompts, function (props) {
    this.projectName = props.projectName;

    console.log(this.projectName);

    cb();
  }.bind(this));
}

SocketioGenerator.prototype.useBootstrap = function useBootstrap(){

  if (this.format) {
    // Skip if already set.
    return;
  }

  var cb = this.async();

  var prompts = [{
    type: 'confirm',
    name: 'shouldUseBootstrap',
    message: 'Do you want to use Bootstrap?',
    default: true
  }];

  this.prompt(prompts, function (props) {
    this.shouldUseBootstrap = props.shouldUseBootstrap;

    console.log(this.shouldUseBootstrap);

    cb();
  }.bind(this));
}

SocketioGenerator.prototype.formatChoice = function formatChoice() {
  
  if (this.format || !this.shouldUseBootstrap) {
    // Skip if already set.
    return;
  }

  var cb = this.async();
  var formats = ['css', 'sass', 'less', 'stylus'];
  var prompts = [{
    type: 'list',
    name: 'format',
    message: 'In what format would you like the Bootstrap stylesheets?',
    choices: formats
  }];

  this.prompt(prompts, function (props) {
    this.format = props.format;

    console.log(this.format);

    cb();
  }.bind(this));

};

SocketioGenerator.prototype.app = function app() {
  //create the structure I want
  this.mkdir('public');
  this.mkdir('public/css');
  this.mkdir('public/img');
  this.mkdir('public/js');
  this.mkdir('views');
  this.mkdir('routes');

  this.copy('_server.js', 'server.js');
  this.template('views/_index.ejs', 'views/index.ejs');
  this.template('_app.js', 'public/js/app.js');


  this.template('_Gruntfile.js', 'Gruntfile.js');

  this.template('_package.json', 'package.json');
  //this.template('_config.json', 'config.json');
  this.template('_bower.json', 'bower.json');
};

SocketioGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};

SocketioGenerator.prototype.runtime = function runtime() {
  this.copy('bowerrc', '.bowerrc');
  this.copy('gitignore', '.gitignore');
};

SocketioGenerator.prototype.bootstrapFiles = function bootstrapFiles() {
  if(!this.shouldUseBootstrap){
    //move on if we shouldn't use bootstrap
    return;
  }

  // map format -> package name
  var packages = {
    css: 'bootstrap.css',
    sass: 'sass-bootstrap',
    less: 'bootstrap',
    stylus: 'bootstrap-stylus'
  };

  this.bowerInstall(packages[this.format], { save: true });

};
