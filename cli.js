#!/usr/bin/env node
var path = require('path');
var ldj = require('ldjson-stream');
var pumpify = require('pumpify');
var levelup = require('levelup');
var options = require('rc')('reduce-group', {
  group_level: 1,
  separator: '\xff',
  db_path: null,
  db_module: null,
  file: null
});

var db_module_name = 'memdown';
if (options.db_module) {
  db_module_name = path.resolve(process.cwd(), options.db_module);
}
var db_module = require(db_module_name);

options.db_path = options.db_path || path.resolve(require('os').tmpdir(),  'reduce-group' + Date.now()  );

var db_opts = {
  db: db_module
};

if (options.reduce === '_stats') {
  db_opts.valueEncoding = 'json'
}
if (options.file) options.reduce = require(path.resolve(process.cwd(), options.file));

var db = levelup(options.db_path, db_opts);

var reducer = require('./index')(db, options);

process.stdin
  .pipe(pumpify.obj(ldj.parse(), reducer))
  .pipe(ldj.serialize())
  .pipe(process.stdout)
