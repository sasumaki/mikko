#!/usr/bin/env node
'use strict'

const program = require('commander'),
  exec = require('child_process').exec;

let execCallback = (error, stdout, stderr) => {
  if (error) console.log("exec error: " + error);
  if (stdout) console.log("Result: " + stdout);
  if (stderr) console.log("shell error: " + stderr);
}
const updateProduction = (container, options) => {
  let cmd = ''
  if (options.iso) cmd += 'nohup docker exec '
  if (options.production) cmd += container
  cmd += ' bash -c "npm run update_database file=/data/all_student_numbers.txt"'
  if (options.iso) cmd += ' &'


  exec(cmd, execCallback);
}
const opendb = (container) =>  exec(`docker exec -it -u postgres ${container} psql -d tkt_oodi`, execCallback)


program
  .version('0.0.666')
  .command('update [container]')
  .description('run database updater')
  .option('-i', '--iso', 'flag to run in nohup')
  .action(updateProduction)
  .command('db [container]')
  .description(' open database psql in containers')
  .action(opendb)

program.parse(process.argv);