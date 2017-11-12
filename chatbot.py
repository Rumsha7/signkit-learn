import requests
import json
import time

baseUrl = "https://directline.botframework.com/"
authHeader = {
	"Authorization" : "Bearer " + "l1zxk22GOgw.cwA.yq4.OFFalAXAhy5JvoFvF7g0DVshHDu-uK_Yqls0GQe2wpo"
}

contentHeader = { 
	"Content-Type": "application/json"
}

contentHeader.update(authHeader)

command = "hello"

activity = {
	"type" : "message",
	"from" : {
		"id": "user1"
	},
	"text" : command
}

p = requests.post(baseUrl + "v3/directline/conversations", headers = authHeader)
convo = json.loads(p.text)
print convo
cid = convo['conversationId']

print "Conversation started id: %s" % cid
print "Sending command %s" % command
commandUrl = baseUrl + "v3/directline/conversations/%s/activities" % cid
c = requests.post(commandUrl, data =json.dumps(activity), headers = contentHeader)
print c.text
time.sleep(2)

r = requests.get(commandUrl, headers = authHeader)
resp = json.loads(r.text)
messageIndex = int(resp['watermark'])
messageText = resp['activities'][messageIndex]['text']
print messageText
