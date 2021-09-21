

var API_ENDPOINT = "Your_API_Endpoint"
var albumBucketName = "projectaudiobucket";
var bucketRegion = "us-east-1";

AWS.config.update({
	region: bucketRegion,
	credentials: new AWS.CognitoIdentityCredentials({
		IdentityPoolId: 'us-east-1:4f284853-b02b-430a-95a1-0cff32a34bbf'
	})
});

var s3 = new AWS.S3({
	apiVersion: '2006-03-01',
	params: {Bucket: albumBucketName}
});

function createUUID() {
   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
   });
}


document.getElementById("sayButton").onclick = function(){
	var files = document.getElementById('fileUpload').files;
   if (files) 
   {
     var file = files[0];
     var fileName = file.name;
	 var filePath = fileName;
	 let ext = fileName.split(".");
    if(ext[1] == 'png' || ext[1] == 'jpg'){
		s3.upload({
			Key: filePath,
			Body: file,
			ACL: 'public-read'
			}, function(err, data) {
			if(err) {
			console.log(err)
			}
			alert('Successfully Uploaded!');
			var inputData = {
				"voice": $('#voiceSelected option:selected').val(),
				"text" : $('#postText').val(),
				"image": files[0].name
			};
			$.ajax({
				url: API_ENDPOINT,
				type: 'POST',
				data:  JSON.stringify(inputData)  ,
				contentType: 'application/json; charset=utf-8',
				success: function (response) {
						  document.getElementById("postIDreturned").textContent="Post ID: " + response;
				},
				error: function () {
					alert("error");
				}
			});
			})
	} else {
		alert("Please upload a png or jpg image");
	}
    
		
   }
   


}


document.getElementById("searchButton").onclick = function(){

	var postId = $('#postId').val();


	$.ajax({
				url: API_ENDPOINT + '?postId='+postId,
				type: 'GET',
				success: function (response) {

					$('#posts tr').slice(1).remove();

	        jQuery.each(response, function(i,data) {

						var player = "<audio controls><source src='" + data['url'] + "' type='audio/mpeg'></audio>"

						if (typeof data['url'] === "undefined") {
	    				var player = ""
						}

						$("#posts").append("<tr> \
								<td>" + data['id'] + "</td> \
								<td>" + data['voice'] + "</td> \
								<td>" + data['text'] + "</td> \
								<td>" + data['comment'] + "</td> \
								<td>" + data['status'] + "</td> \
								<td>" + player + "</td> \
								</tr>");
	        });
				},
				error: function () {
						alert("error");
				}
		});
}

document.getElementById("postText").onkeyup = function(){
	var length = $(postText).val().length;
	document.getElementById("charCounter").textContent="Characters: " + length;
}
