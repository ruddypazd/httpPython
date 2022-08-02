import json
from zkteco import zkteco

class Manejador:

    def __init__(self, obj):
        self.obj = obj
        self.onMessage()

    def onMessage(self):
        try:
            obj = self.obj
            if obj is not None:
                if obj["component"] is not None:
                    component = obj["component"]

                    if component == "zkteco":
                        zkteco(obj)
                        
                    elif component == "":
                        obj["estado"]="error"
                        obj["error"]="No existe component"
                    
                else:
                    obj["estado"] = "error"
                    obj["error"] = "No existe component"    
            else:
                obj = {}
                obj["component"] = ""
                obj["type"] = ""
                obj["estado"] = "error"
                obj["error"] = "No existe obj"


        except Exception as e:
            #print ("Process terminate : {}".format(e))
            self.obj["estado"] = "error"
            self.obj["error"] = "{}".format(e)
        finally:
            print("finally")
