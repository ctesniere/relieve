'use strict';
var assert = require('assert')
var IPCEE = require('ipcee')
var p = require('path')

/**
 * Script container
 * @module containers/ScriptContainer
 */

process.argv = process.argv.map(function(e, i) {
  if(i < 3)
    return e

  return JSON.parse(e)
})

var args = [].slice.call(process.argv, 2)

var opts = args.pop()

var ipc = IPCEE(process, opts)

var script = require(args[0])

if(typeof script == 'object' && typeof script.setChannel == 'function') {
  script.setChannel(ipc)
}

/**
 * @listens module:process#uncaughtException
 */
process.on('uncaughtException', function(err) {
  /**
   * @fires start
   */
  ipc.send('error', err.toString(), err.stack)

  process.nextTick(function() {
    process.exit(1) 
  })
})

ipc.send('start')