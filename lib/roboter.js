'use strict';

const fs = require('fs'),
    path = require('path');

const gulp = require('gulp');

const Roboter = function () {
  this.tasks = {};
};

Roboter.prototype.use = function (taskName, getConfiguration) {
  const taskNamePartials = taskName.split('/');

  getConfiguration = getConfiguration || (() => {});

  this.tasks[taskName] = {
    name: taskName,
    configuration: getConfiguration(),
    directory: path.join(__dirname, 'tasks', taskNamePartials[0], taskNamePartials[1])
  };
};

Roboter.prototype.useFolder = function (environment) {
  const taskDirectories = fs.readdirSync(path.join(__dirname, 'tasks', environment));

  taskDirectories.forEach(taskDirectory => {
    this.use(`${environment}/${taskDirectory}`);
  });
};

Roboter.prototype.workOn = function (environment) {
  this.environment = environment;
  return this;
};

Roboter.prototype.equipWith = function (callback) {
  this.useFolder('universal');
  this.useFolder(this.environment);

  callback(this.use.bind(this));

  return this;
};

Roboter.prototype.start = function () {
  Object.keys(this.tasks).forEach(taskName => {
    const options = this.tasks[taskName];
    const task = require(options.directory);

    task(options.configuration);
  });

  // Turn private into public tasks.
  Object.keys(gulp.tasks).forEach(taskName => {
    if (taskName.startsWith('_')) {
      gulp.task(taskName.substring(1), [ taskName ]);
    }
  });

  // Register aliases for public tasks.
  gulp.task('analyse', [ 'analyze' ]);
  gulp.task('publish', [ 'release' ]);
  gulp.task('publish-force', [ 'release-force' ]);
};

module.exports = new Roboter();