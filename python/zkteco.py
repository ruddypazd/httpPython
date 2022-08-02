from zk import ZK, const
import json

class zkteco:
    conn = None
    info = None
    zk = None

    def __init__(self, obj):
        self.obj = obj
        if obj["type"] == "init":
            self.getInfo()
        elif obj["type"] == "sonar":
            self.sonar()
        elif obj["type"] == "verUsuarios":
            self.getAllusers()
        elif obj["type"] == "apagar":
            self.apagar()
        elif obj["type"] == "reiniciar":
            self.reiniciar()
        elif obj["type"] == "clean_buffer":
            self.clean_buffer()
        elif obj["type"] == "delete_data":
            self.delete_data()
        else:
            obj["estado"] = "error"
            obj["error"] = "No existe type."
            
    def sonar(self):
        conn = None
        try:
            self.zk = ZK(self.obj["ip"], self.obj["puerto"], timeout=5, password=0, force_udp=False, ommit_ping=False)
            conn = self.zk.connect()
            conn.test_voice(self.obj["index_saludo"])
            self.obj["estado"] = "exito"

            del self.zk
            
        except Exception as e:
            self.obj["estado"] = "error"
            self.obj["error"] = "{}".format(e)
        finally:
            if conn is not None:
                if conn.is_connect:
                    conn.disconnect()

    def apagar(self):
        conn = None
        try:
            self.zk = ZK(self.obj["ip"], self.obj["puerto"], timeout=5, password=0, force_udp=False, ommit_ping=False)
            conn = self.zk.connect()
            conn.poweroff()

            self.obj["estado"] = "exito"

            del self.zk
            
        except Exception as e:
            self.obj["estado"] = "error"
            self.obj["error"] = "{}".format(e)
        finally:
            if conn is not None:
                if conn.is_connect:
                    conn.disconnect()

    def reiniciar(self):
        conn = None
        try:
            self.zk = ZK(self.obj["ip"], self.obj["puerto"], timeout=5, password=0, force_udp=False, ommit_ping=False)
            conn = self.zk.connect()
            conn.restart()

            self.obj["estado"] = "exito"

            del self.zk
            
        except Exception as e:
            self.obj["estado"] = "error"
            self.obj["error"] = "{}".format(e)
        finally:
            if conn is not None:
                if conn.is_connect:
                    conn.disconnect()
            
    def clean_buffer(self):
        conn = None
        try:
            self.zk = ZK(self.obj["ip"], self.obj["puerto"], timeout=5, password=0, force_udp=False, ommit_ping=False)
            conn = self.zk.connect()
            conn.free_data()

            self.obj["estado"] = "exito"

            del self.zk
            
        except Exception as e:
            self.obj["estado"] = "error"
            self.obj["error"] = "{}".format(e)
        finally:
            if conn is not None:
                if conn.is_connect:
                    conn.disconnect()

    def delete_data(self):
        conn = None
        try:
            self.zk = ZK(self.obj["ip"], self.obj["puerto"], timeout=5, password=0, force_udp=False, ommit_ping=False)
            conn = self.zk.connect()
            conn.clear_data()

            self.obj["estado"] = "exito"

            del self.zk
            
        except Exception as e:
            self.obj["estado"] = "error"
            self.obj["error"] = "{}".format(e)
        finally:
            if conn is not None:
                if conn.is_connect:
                    conn.disconnect()


    def getInfo(self):
        conn = None
        try:
            self.zk = ZK(self.obj["ip"], self.obj["puerto"], timeout=5, password=0, force_udp=False, ommit_ping=False)
            conn = self.zk.connect()
            info = {}
            info["name"] =  conn.get_device_name()
            info["firmware_version"] =  conn.get_firmware_version()
            info["mac"] =  conn.get_mac()
            info["serialnumber"] =  conn.get_serialnumber()
            #info["time"] =  conn.get_time()
            #conn.test_voice()

            self.obj["data"] = info
            self.obj["estado"] = "exito"
            #conn.clear_data()
            del self.zk
        except Exception as e:
            #print ("Process terminate : {}".format(e))
            self.obj["estado"] = "error"
            self.obj["error"] = "{}".format(e)
        finally:
            if conn is not None:
                if conn.is_connect:
                    conn.disconnect()

    def getAllusers(self):
        try:
            # connect to device
            self.zk = ZK(self.obj["ip"], self.obj["puerto"], timeout=5, password=0, force_udp=False, ommit_ping=False)

            conn = self.zk.connect()
            # disable device, this method ensures no activity on the device while the process is run
            conn.disable_device()
            # another commands will be here!
            # Example: Get All Users

            users = conn.get_users()
            _json = []
            for user in users:
                privilege = 'User'
                if user.privilege == const.USER_ADMIN:
                    privilege = 'Admin'

                _obj = {}
                _obj["uid"] = user.uid
                _obj["name"] = user.name
                _obj["privilege"] = user.privilege
                _obj["password"] = user.password
                _obj["group_id"] = user.group_id
                _obj["user_id"] = user.user_id

                _json.append(_obj)


            self.obj["data"] = _json
            # Test Voice: Say Thank You
            #conn.test_voice()
            # re-enable device after all commands already executed
            conn.enable_device()
            self.obj["estado"] = "exito"
            del self.zk
            
        except Exception as e:
            self.obj["estado"] = "error"
            self.obj["error"] = "{}".format(e)
        finally:
            if conn:
                conn.disconnect()
        #return _json

    
    def addUser(self, name, id):
        try:
            # connect to device
            conn = self.zk.connect()
            # disable device, this method ensures no activity on the device while the process is run
            conn.disable_device()
            # another commands will be here!
            # Example: Get All Users

            conn.set_user(uid=id, name=name, privilege=const.USER_ADMIN, password='', group_id='', user_id=str(id), card=0)

            # Test Voice: Say Thank You
            conn.test_voice(18)
            # re-enable device after all commands already executed
            conn.enable_device()
            
        except Exception as e:
            print ("Process terminate : {}".format(e))
        finally:
            if conn:
                conn.disconnect()


