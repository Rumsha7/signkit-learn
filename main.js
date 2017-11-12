var serverUrl = "http://127.0.0.1:8080";

var headers = new Headers();
headers.append("Access-Control-Allow-Origin", "*");

var demoResponse = {
	"user": "Hello",
	"chatbot": "Hello! \n What can I help you with? :)"
}

var recentReceive = "";
var recentSend = "";

var update = function update() {
	var settings = {
  	"async": true,
 		"crossDomain": true,
 		'jsonp': "callback",
 		"url": "http://127.0.0.1:8080/update",
		"method": "GET"
	}

	$.ajax(settings).done(function (myJson) {
	  //console.log(response);
	  console.log(myJson);
	  data = JSON.parse(myJson);
	  if (data.user != "") {
	  	recentSend = data.user;
	  	//recentSend = demoResponse.user;
	  	updateSend();
	  }
	  if (data.chatbot != "") {
	  	recentReceive = data.chatbot;
	  	//recentReceive = demoResponse.chatbot;
	  	updateReceive();
	  }
	});
}

function updateReceive() {
	var container = document.getElementById("container")
	container.innerHTML += '<div class="receive"><p>' + recentReceive + '</p></div>';
}

function updateSend() {
	var container = document.getElementById("container")
	container.innerHTML += '<div class="send"><p>' + recentSend + '</p></div>';
}

setInterval(update, 5000);
