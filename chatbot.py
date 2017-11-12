import requests
import json
import time
import cherrypy
import cv2
import requests
import threading
from Queue import Queue
from threading import Thread

startTime = time.time()
serverUrl = "https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/aa6a7704-77b6-495d-9241-5838de96050c/image"
cap = cv2.VideoCapture(0)
headers = {
        "Prediction-Key": "c1398dfc07d743ceaa1dac15e96e4a07",
        "Content-Type": "application/octet-stream"
        }
interval = float(5)

baseUrl = "https://directline.botframework.com/"
authHeader = {
	"Authorization" : "Bearer " + "l1zxk22GOgw.cwA.yq4.OFFalAXAhy5JvoFvF7g0DVshHDu-uK_Yqls0GQe2wpo"
}

contentHeader = { 
	"Content-Type": "application/json"
}

contentHeader.update(authHeader)
command = ""
messageText = ""
activity = {
    "type" : "message",
    "from" : {
    	"id": "user1"
    },
    "text" : command
}


q = Queue()

def webcam():
    global q
    startTime = time.time()

    while(True):
        currentTime = time.time() - startTime
        #print currentTime
        ret, frame = cap.read()
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2BGRA)

        cv2.imshow('frame', rgb)

        if cv2.waitKey(1):
            if currentTime > interval:
                print "Creating file..."
                out = cv2.imwrite('capture.jpg', frame)
                with open("capture.jpg", "rb") as imageFile:
                    f = imageFile.read()
                    b = bytearray(f)
                    print "Machine learning..."
                    r = requests.post(serverUrl, data = b, headers = headers)
                    print "The machine has learned"
                    data = json.loads(r.text)
                    command = data['Predictions'][0]['Tag']
                    activity['text'] = command
                    confidence = data['Predictions'][0]['Probability']
                    print activity
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
                    startTime = time.time()
                    q.put((command, messageText))
                                    #break
    cap.release()
    cv2.destroyAllWindows()


class Root(object):
    @cherrypy.expose
    def update(self):
        command = ""
        messageText = ""
        data = {
            "user": command,
            "chatbot": messageText
        }
        global q
        cherrypy.response.headers['Access-Control-Allow-Origin'] = "*"
        print q.qsize()
        while not q.empty():
            command, messageText = q.get()
            print 'In west philadelphia born and raised on the playground is where I spent most of my days,'
            data['user'] = command
            data['chatbot'] = messageText
            print data
            q.task_done()
        return json.dumps(data)

if __name__ == '__main__':
    
    p = requests.post(baseUrl + "v3/directline/conversations", headers = authHeader)
    convo = json.loads(p.text)
    print convo
    cid = convo['conversationId']
    print "Conversation started id: %s" % cid
    t = Thread(target=webcam)
    t.daemon = True
    t.start()
    cherrypy.quickstart(Root(), '/')
    q.join()
    
