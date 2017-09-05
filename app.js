// Module declare
const express = require('express');
const app = express();
const path = require('path');
const formidable = require('formidable');
const fs = require('fs');

// Static and Routing
app.use(express.static('public')); // serving css , js for html
app.use(express.static('uploads')); 
app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/upload' , function(req, res){
  // Create formidable form for post form from html
  var form = new formidable.IncomingForm();
  var response = '';
  form.multiples = true;
  form.uploadDir = __dirname + '/uploads';
  // Get file name link
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
    response += file.name+' ';
  });

  // repond to client
  form.on('end', function() {
   res.end(response);
  });
  form.parse(req);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
