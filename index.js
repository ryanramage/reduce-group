var through = require('through2');
var level_inc = require('level-inc');

module.exports = function transform(cache_db, opts) {

  if (!opts) opts = {};
  if (!opts.group_level) opts.group_level = 1;
  if (!opts.seperator) opts.seperator= opts.seperator = '\xff';

  // setup the inc function on the db
  var inc = level_inc(cache_db);

  return through.obj(function(obj, enc, next) {

    // handle arrays
    if (Array.isArray(obj)) {
      if (obj.length < opts.group_level) return;

      var key = obj.slice(0, opts.group_level).join(opts.seperator);
      var value = obj[obj.length -1];

      inc(key, value, next);
    }
    else if (obj.key && obj.value !== undefined) {
      var key = obj.key;

      if (Array.isArray(obj.key)) {
        if (obj.key.length < opts.group_level) return;
        key = obj.key.slice(0, opts.group_level).join(opts.seperator);
      }
      var value = obj.value || 0;
      inc(key, value, next);
    }

  }, function(cb){
    var self = this;
    cache_db.createReadStream()
      .on('data', function(data){
        data.key = data.key.split(opts.seperator);
        data.value = Number(data.value); // ensure a number comes out
        self.push(data);
      })
      .on('end', cb)
  })
}
