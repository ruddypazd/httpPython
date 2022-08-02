import requests
import json

class ibroker:
    url = None

    def __init__(self):
        self.url = "https://ruddypazd.com/zkteco"

    def getEjecutivos(self):
        try:

            aux = {'data': 'asdjnad'}
            res = requests.post(self.url, data=aux)
            response = json.loads(res.text)
            print(response)
            
        except Exception as e:
            print ("Process terminate : {}".format(e))

