ldjson-reduce-group
===================

Reduce ldjson by group levels, much like couchdb

Install
-------

    npm install ldjson-reduce-group

Usage
-----

first, find some data in ldjson format, with arrays on each line. Something like


```

cat data.json

["c3x2c0c","Break and Enter",0.09924843836930088]
["c3x2c0b","Break and Enter",0.07131786992142247]
["c3x2c0x","Break and Enter",0.20350682717846091]
["c3x2c0w","Break and Enter",0.221410262622791]
["c3x2c0t","Break and Enter",0.2222547142552161]
["c3x2c0s","Break and Enter",0.20580123000056702]
["c3x2c0c","Break and Enter",0.17640552899101838]
```

so to reduce to the sums of all B and E in a geohash, do the following:

```
cat mapped.json | ldjson-reduce-group  --group_level=2

{"key":["c3x2c0c","Theft From Vehicle"],"value":"0.2756539673603193"}
{"key":["c3x2c0b","Theft From Vehicle"],"value":"0.07131786992142247"}
{"key":["c3x2c0x","Theft From Vehicle"],"value":"0.20350682717846091"}
{"key":["c3x2c0w","Theft From Vehicle"],"value":"0.221410262622791"}
{"key":["c3x2c0t","Theft From Vehicle"],"value":"0.2222547142552161"}
{"key":["c3x2c0s","Theft From Vehicle"],"value":"0.20580123000056702"}
```

The ndjson output will be ordered by key. It is using _sum to reduce the last column, grouped by the first two columns.

Future
------

This is the first release. I plan to have input actual objects, and to provide reduce options such as _sum, _count and stats in the future.





