#!/usr/bin/env node
'use strict'

const version = require('./package.json').version
const program = require('commander')
const exec = require('child_process').exec
const spawn = require('child_process').spawn

let execCallback = (error, stdout, stderr) => {
  if (error) console.log("exec error: " + error);
  if (stdout) console.log("Result: " + stdout);
  if (stderr) console.log("shell error: " + stderr);
}
const updateProduction = (container) => {
  const target = container === 'prod' ? 'backend' : 'staging_backend'
  let cmd = `nohup docker exec ${target} bash -c "npm run update_database file=/data/all_student_numbers.txt"  &`

  exec(cmd, execCallback);
}
const opendb = (container) => {
  switch (container) {
    case 'prod':
      spawn('docker', ['exec', '-it', '-u', 'postgres', 'db', 'psql', '-d', 'tkt_oodi'], { stdio: 'inherit' })
    case 'staging':
      spawn('docker', ['exec', '-it', '-u', 'postgres', 'db_staging', 'psql', '-d', 'tkt_oodi_staging'], { stdio: 'inherit' })
    case 'testing':
      spawn('docker', ['exec', '-it', '-u', 'postgres', 'db_testing', 'psql', '-d', 'tkt_oodi_testing'], { stdio: 'inherit' })
    default:
      spawn('docker', ['exec', '-it', '-u', 'postgres', 'oodi_db', 'psql', '-d', 'tkt_oodi'], { stdio: 'inherit' })
  }
}


program
  .version(version)
  .command('update [container]')
  .description('run database updater')
  .action(updateProduction)

program
  .command('db [container]')
  .description(' open database psql in containers')
  .action(opendb)

program.parse(process.argv);
