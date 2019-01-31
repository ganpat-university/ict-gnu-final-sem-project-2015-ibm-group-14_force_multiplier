const _ = require('lodash');
const path = require('path');
// module variables
const config = require('./config.json');
const defaultConfig = config.development;
const environment = process.env.NODE_ENV || 'developement' ;
const environmentConfig = config[environment];
const fs = require('fs');
const finalConfig = _.merge(defaultConfig, environmentConfig);

// as a best practice
// all global variables should be referenced via global. syntax
// and their names should always begin with g
global.gConfig = finalConfig;
global.gConfig.rootPath = path.normalize(__dirname + '/../');

if (!fs.existsSync(`${global.gConfig.rootPath}uploads/`)){ fs.mkdirSync(`${global.gConfig.rootPath}uploads/`); }
if (!fs.existsSync(`${global.gConfig.rootPath}uploads/avatar`)){ fs.mkdirSync(`${global.gConfig.rootPath}uploads/avatar`); }
if (!fs.existsSync(`${global.gConfig.rootPath}uploads/video/`)){ fs.mkdirSync(`${global.gConfig.rootPath}uploads/video/`); }
if (!fs.existsSync(`${global.gConfig.rootPath}uploads/video/snapshot/`)){ fs.mkdirSync(`${global.gConfig.rootPath}uploads/video/snapshot/`); }