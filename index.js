var through = require('through2');
var level_updater = require('level-updater');

module.exports = function transform(cache_db, opts) {

  if (!opts) opts = {};
  if (!opts.group_level) opts.group_level = 1;
  if (!opts.separator) opts.separator   = '\xff';
  if (!opts.terminator) opts.terminator = '\xfe';

  // a function to unpack our stringified key
  function unpack_key(key) {
    key = key.split(opts.separator);

    // if it is length 1, and the end char is the terminator, it was just a string key
    if (key.length === 1 && key[0][key[0].length - 1] === opts.terminator) {
      key = key[0].substring(0, key[0].length - 1);
    }
    return key;
  }

  if (!opts.reduce) opts.reduce = _sum;
  else {

    if (typeof opts.reduce === 'function') {
      var supplied_reduce = opts.reduce;
      opts.reduce = function(accumulator, value, key){
        key = unpack_key(key)
        return supplied_reduce(accumulator, value, key);
      }

    }
    else {
      if (opts.reduce === '_sum')   opts.reduce = _sum;
      if (opts.reduce === '_count') opts.reduce = _count;
      if (opts.reduce === '_stats') {
        level_updater = require('level-updater', {
          valueEncoding: 'json'
        });
        opts.reduce = _stats;
      }
    }

  }

  // setup the inc function on the db
  var inc = level_updater(cache_db, opts.reduce);

  return through.obj(function(obj, enc, next) {

    // handle arrays
    if (Array.isArray(obj)) {
      if (obj.length < opts.group_level) return;

      var key = obj.slice(0, opts.group_level).join(opts.separator);
      var value = obj[obj.length -1];

      inc(key, value, function(err,val){ next() });
    }
    else if (obj.key && obj.value !== undefined) {
      var key = obj.key;

      if (Array.isArray(obj.key)) {
        if (obj.key.length < opts.group_level) return;
        key = obj.key.slice(0, opts.group_level).join(opts.separator);
      } else {
        // we do this so we know it originated as string
        key = key.concat(opts.terminator);
      }
      var value = obj.value || 0;
      inc(key, value, function(err,val){ next() });
    }

  }, function(cb){
    var self = this;
    cache_db.createReadStream()
      .on('data', function(data){
        data.key = unpack_key(data.key);
        if (opts.reduce !== _stats) {
          data.value = Number(data.value); // ensure a number comes out
        }

        self.push(data);
      })
      .on('end', cb)
  })
}



function _sum(accumulator, value) {
  if (!accumulator && accumulator !== 0) accumulator = Number(0);
  else accumulator = Number(accumulator);
  return accumulator + Number(value)
}

function _count(accumulator) {
  if (!accumulator && accumulator !== 0) accumulator = Number(0);
  else accumulator = Number(accumulator);

  return ++accumulator;
}

function _stats(accumulator, value) {
  value = Number(value);
  if (!accumulator) accumulator = {min: null, max: null, sum: 0, count: null, sumsqr: 0};


  if (!accumulator.min || value < accumulator.min) accumulator.min = value;
  if (!accumulator.max || value > accumulator.max) accumulator.max = value;
  accumulator.count++;
  accumulator.sum+= value;

  accumulator.sumsqr = accumulator.sumsqr + ( value * value );

  return accumulator;
}


