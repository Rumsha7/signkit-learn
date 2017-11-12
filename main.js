var serverUrl = "192.168.0.1";

var demoResponse = {
	"user": "Hello",
	"chatbot": "Hello! \n What can I help you with? :)"
}

var recentReceive = "";
var recentSend = "";

var update = function update() {
	fetch(serverUrl + "/update").then(function(response) {
	  return response.json();
	}).then(function(myJson) {
	  console.log(myJson);
	  data = JSON.parse(myJson);
	  if (data.user != recentSend) {
	  	//recentSend = data.user;
	  	recentSend = demoResponse.user;
	  	updateSend();
	  }
	  if (data.chatbot != recentReceive) {
	  	//recentReceive = data.chatbot;
	  	recentReceive = demoResponse.chatbot;
	  	updateReceive();
	  }
	});
}

function updateReceive() {
	var container = document.getElementById("container")
	container.innerHTML += '<div class="receive"><p>' + recentReceive + '</p></div>"';
}

function updateReceive() {
	var container = document.getElementById("container")
	container.innerHTML += '<div class="send"><p>' + recentSend + '</p></div>"';
}

setInterval(update, 1000);