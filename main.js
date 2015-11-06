"use strict";

global.appRoot = (require('path').resolve(__dirname)).replace(/\\/g, '/');
require(appRoot + '/app/engine/core/global.js');
require(appRoot + '/app/engine/installer.js');