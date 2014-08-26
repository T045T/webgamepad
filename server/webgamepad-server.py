
import libi2dx
import uinput
import difflib
import subprocess
import time
import shlex
import sys
import signal
import os

class XPadWebSocketUInput(libi2dx.I2DXWebSocket):
    btn_map = {
        "xbox_up": uinput.BTN_0,
        "xbox_down": uinput.BTN_1,
        "xbox_left": uinput.BTN_2,
        "xbox_right": uinput.BTN_3,
        "xbox_guide": uinput.BTN_4,
        "xbox_A": uinput.BTN_A,
        "xbox_B": uinput.BTN_B,
        "xbox_X": uinput.BTN_X,
        "xbox_Y": uinput.BTN_Y,
        "xbox_LB": uinput.BTN_TL,
        "xbox_RB": uinput.BTN_TR,
        "xbox_start": uinput.BTN_START,
        "xbox_select": uinput.BTN_SELECT
        }
    
    extra_args = " ".join(sys.argv[1:])
    print extra_args

    keys = btn_map.values()

    devicemap = {}
    xboxmap = {}
    
    def toggle_key(self, key_id, active, player):
        if player not in self.devicemap:
            old_ls = subprocess.check_output('ls /dev/input/', shell=True).split()
            self.devicemap[player] = uinput.Device(self.keys,
                                                   'web_gamepad%s' % player,
                                                   0x03,  # BUS_USB (at least on Ubuntu...)
                                                   0x1337,  # fake vendor id
                                                   0x1337)  # fake device id
            time.sleep(1) # give uinput time to make device...
            new_ls = subprocess.check_output('ls /dev/input/', shell=True).split()
            matcher = difflib.SequenceMatcher(None, old_ls, new_ls)
            for tag, i1, i2, j1, j2 in reversed(matcher.get_opcodes()):
                if tag == 'insert':
                    devname = new_ls[j1]
                    print "new device id is %s" % devname
                    if not devname.startswith('event'):
                        print "not an event device, ignoring"
                        continue
                    command = "xboxdrv -c " + os.path.abspath(os.path.join(os.path.dirname(__file__), '../web2xbox.xbox')) + ' --evdev /dev/input/' + devname + " " + self.extra_args
                    args = shlex.split(command)
                    self.xboxmap[player] = subprocess.Popen(args)
        if active:
            active = 1
        else:
            active = 0
        self.devicemap[player].emit(self.btn_map[key_id], active)

if __name__ == "__main__":
    libi2dx.serve(XPadWebSocketUInput)
