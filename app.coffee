#!/usr/bin/env coffee
mcping = require 'mc-ping-updated'
async = require 'async'
express = require 'express'
app = express()

app.get '/', (req, res) ->
  @res = res
  @servers = {}
  async.each [25565..25569], (i, callback) =>
    mcping 'wheee.org', i, (err, rs) =>
      if err
        console.error JSON.stringify(err, null, 2)
      else
        rs.modinfo = undefined
        @servers[i] = rs
      callback()
  , (err) =>
    @res.send JSON.stringify(@servers)

app.listen 3000, ->
  console.log 'listening on port 3000'


