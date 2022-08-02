import http.server
import socketserver
import json
from Manejador import Manejador
#from zkteco import zkteco

PORT = 8000

class handler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-type','application/json')
        self.end_headers()
        self.data_string = self.rfile.read(int(self.headers['Content-Length']))


        obj = json.loads(self.data_string)

        Manejador(obj)

        #self.zk = zkteco(data["ip"], data["puerto"])

        print(obj)

        #_obj["component"] = "user.uid"
        #_obj["type"] = "user.name"
        #_obj = json.dumps(_obj)
        
        self.send_header("Content-Length: ", len(json.dumps(obj)))
        self.wfile.write(bytes(json.dumps(obj), "utf8"))

with socketserver.TCPServer(("", PORT), handler) as httpd:
    print("serving at port", PORT)
    try:        
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.exit(0)

    

