#!/usr/bin/env coffee
mcping = require 'mc-ping-updated'
async = require 'async'
express = require 'express'
app = express()
_ = require 'underscore'

app.set 'view engine', 'jade'

app.get '/', (req, res) ->
  @res = res
  @servers = []
  async.each [25565..25569], (i, callback) =>
    mcping 'wheee.org', i, (err, rs) =>
      if err
        console.error JSON.stringify(err, null, 2)
      else
        rs.modinfo = undefined
        if typeof rs.description != 'string'
          rs.description = rs.description.text
        rs.description = rs.description.replace /§\S/g, ''
        @servers.push port: i, info: rs
      callback()
  , (err) =>
    @servers = _.sortBy @servers, (server) -> server.port
    @res.render 'index', servers: @servers

app.listen 3000, ->
  console.log 'listening on port 3000'


