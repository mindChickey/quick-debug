#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const process = require('process')
const { spawn } = require('child_process');

function parseArgv(argv){
  let index = 2
  let dir = ''
  while(index < argv.length){
    if(!argv[index].startsWith('--')) {
      break
    } else if(argv[index] == '--dir'){
      dir = argv[index+1]
      index = index + 2
    } else {
      index = index + 1
    }
  }
  let output = path.join(dir, ".newDebug.quickdebug")
  let program = path.resolve(process.argv[index])
  let args = process.argv.slice(index + 1)
  return { output, program, args }
}

let option = parseArgv(process.argv)

let launch = {
  type: "lldb",
  name: "newDebug",
  request: "launch",
  program: option.program,
  args: option.args,
  cwd: process.cwd(),
  env: process.env
}

fs.writeFileSync(option.output, JSON.stringify(launch));

spawn('code', [option.output]);
