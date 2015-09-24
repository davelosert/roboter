#!/usr/bin/env node

'use strict';

const path = require('path');

const shell = require('shelljs');

const gulp = path.join(__dirname, '..', 'node_modules', '.bin', 'gulp');
const gulpfile = path.join(process.cwd(), 'roboter.js');

const args = process.argv.slice(2).join(' ');

shell.exec(`${gulp} --gulpfile ${gulpfile} --color -- ${args}`);
