var express = require("express");
var app = express();

app.use(express.static(__dirname));

console.log('listening on 2000');
app.listen(2000);
