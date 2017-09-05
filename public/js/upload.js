// call input form
$('.upload-btn').on('click' , function(){
  $('#upload-input').click();
});

// check file number and cancel
$('#upload-input').on('change' , function(){
  var filesData = $(this).get(0).files;
  if(filesData.length > 0){
    // Add all file to formdata to upload with AJAX
    var datafiles = new FormData();
    for (var i = 0; i < filesData.length; i++ ){
      var file = filesData[i];
      datafiles.append('upload[]', file, file.name.replace(/\s/g,''));
    }
    // Clear link list
    $('.uploadedFiles').addClass('hidden');
    $('.uploadedFiles').text('');
    // Ajax handler
    $.ajax({
      url: '../upload', // post to app.js
      type: 'POST',
      data: datafiles,
      processData: false,
      contentType: false,
      // Get reponse from AJAX success
      success: function(data){
          console.log('upload successful!');
          var dataArray = data.split(' ');
          for(var i = 0; i < dataArray.length-1 ; i++){
            $('<li><a href="'+dataArray[i]+'">'+dataArray[i]+'</a></li>').appendTo('.uploadedFiles');
          }$('.uploadedFiles').removeClass('hidden');
      }
    });
    $('.filenum').removeClass('hidden');
    $('.filenum').text('Number of upload is ' + filesData.length + ' files');
  }else{
    console.log('user cancel operation / non file selected');
    $('.filenum').addClass('hidden');
  }
});
