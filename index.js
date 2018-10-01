#!/usr/bin/env node
'use strict'

const program = require('commander'),
      exec = require('child_process').exec;


const updateProduction = (container, options) => {
  console.log(container)
  let cmd = ''
  if (options.iso) cmd += 'nohup ' 
  if (options.production) cmd += container
  cmd += ' bash -c "npm run update_database file=/data/all_student_numbers.txt"'
  if (options.iso) cmd += ' &'

  let execCallback = (error, stdout, stderr) => {
    if (error) console.log("exec error: " + error);
    if (stdout) console.log("Result: " + stdout);
    if (stderr) console.log("shell error: " + stderr);
  };
  exec(cmd, execCallback);
}

program
  .version('0.0.1')
  .command('update [container]')
  .description('run database updater')
  .option('-i', '--iso', 'flag to run in nohup')
  .action(updateProduction)

program.parse(process.argv);