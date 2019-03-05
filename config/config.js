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

