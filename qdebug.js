#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const process = require('process')
const { spawn } = require('child_process');

let debugPath = ".newDebug.quickdebug"
let program = path.resolve(process.argv[2])

let launch = {
  type: "lldb",
  name: "newDebug",
  request: "launch",
  program: program,
  args: process.argv.slice(3),
  cwd: process.cwd(),
  env: process.env
}

fs.writeFileSync(debugPath, JSON.stringify(launch));

spawn('code', [debugPath]);
