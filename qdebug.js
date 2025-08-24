#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const process = require('process')
const { spawn } = require('child_process');

function parseArgv(argv){
  let index = 2
  let dir = ''
  let type = 'gdb'
  while(index < argv.length){
    let arg = argv[index]
    if(!arg.startsWith('--')) {
      break
    } else if(arg == '--dir'){
      dir = argv[index+1]
      index = index + 2
    } else if(arg == '--type'){
      type = argv[index+1]
      index = index + 2
    } else {
      throw "unknown argument: " + arg
    }
  }
  let output = path.join(dir, ".newDebug.quickdebug")
  let program = path.resolve(process.argv[index])
  let args = process.argv.slice(index + 1)
  return { output, type, program, args }
}

function makeLaunch(type, program, args){
  return {
    type,
    name: "qdebug " + type,
    request: "launch",
    program,
    args,
    cwd: process.cwd(),
    preRunCommands: ["b main"]
  }
}

function main(){
  let { output, type, program, args } = parseArgv(process.argv)
  let launch = makeLaunch(type, program, args)
  fs.writeFileSync(output, JSON.stringify(launch));
  
  spawn('code', [output]);
  setTimeout(() => {
    fs.rm(output, () => {})
  }, 10000)
}

main()