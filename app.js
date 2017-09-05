// Module declare
const express = require('express');
const app = express();
const path = require('path');
const formidable = require('formidable');
const fs = require('fs');
const cron = require('node-cron');
const moment = require('moment');
const uuidv4 = require('uuid/v4');
const mime = require('mime');

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
    var uuid = uuidv4();
    fs.rename(file.path, path.join(form.uploadDir, uuid + file.name));
    response += uuid+file.name+' ';
  });
  // response to client
  form.on('end', function() {
    res.end(response);
  });
  form.parse(req);
});

// Reading Directory every minutes
cron.schedule('*/1 * * * *', function(err){
  if(!err){
    fs.readdir(__dirname + '/uploads', function(err,filenames){
      if(!err){
        // Stamp current date
        var currentDate = moment().format();
        filenames.forEach(function(filename){
          fs.stat(__dirname + '/uploads/' + filename,function(err,fstats){
            // Check ctime valid
            if (moment(fstats.ctime).isValid()) {
              // General time format
              var fileDate = moment(fstats.ctime).format();
              // compare then delete
              var diffTime = moment(currentDate).diff(moment(fileDate),'minutes');
              if(diffTime > 30 && filename != '.gitignore'){
                fs.unlink(__dirname + '/uploads/' + filename, function(err){
                  if(!err){
                    console.log(filename + 'deleted');
                  }else{
                    console.log('unlink failed');
                  }
                });
              }
            } else {
              console.log('Invalid Date');
            }
          });
        });
      }else{
        console.log(err);
      }
    });
  }else{
    console.log(err);
  }
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
