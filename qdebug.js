#!/usr/bin/env node

const os = require('os')
const fs = require('fs')
const path = require('path')
const process = require('process')
const { spawn } = require('child_process');

let debugPath = path.join(os.tmpdir(), "newDebug.quickdebug")

let launch = {
  type: "lldb",
  name: "newDebug",
  request: "launch",
  program: process.argv[2],
  args: process.argv.slice(3),
  cwd: process.cwd(),
  env: process.env
}

fs.writeFileSync(debugPath, JSON.stringify(launch));

spawn('code', [debugPath]);