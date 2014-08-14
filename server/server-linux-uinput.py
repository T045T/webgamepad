
import libi2dx
import uinput
import difflib
import subprocess
import time
import shlex
import sys
import signal
import os

class I2DXWebSocketUInput(libi2dx.I2DXWebSocket):
    extra_args = " ".join(sys.argv[1:])
    print extra_args

    keys = []
    for player in range(1, 5):
        if libi2dx.config.has_section('keymap_player%s' % player):
            for x in libi2dx.config.items('keymap_player%s' % player):
                keyval = uinput._CHAR_MAP.get(x[1], uinput.KEY_BACKSLASH)
                if keyval not in keys:
                    keys.append(keyval)

    devicemap = {}
    xboxmap = {}
    
    def toggle_key(self, key_id, active, player):
        if player not in self.devicemap:
            old_ls = subprocess.check_output('ls /dev/input/', shell=True).split()
            self.devicemap[player] = uinput.Device(self.keys,
                                                   'web_kbd%s' % player,
                                                   0x03,  # BUS_USB (at least on Ubuntu...)
                                                   0x1337,  # fake vendor id
                                                   0x1337)  # fake device id
            time.sleep(1)
            new_ls = subprocess.check_output('ls /dev/input/', shell=True).split()
            matcher = difflib.SequenceMatcher(None, old_ls, new_ls)
            for tag, i1, i2, j1, j2 in reversed(matcher.get_opcodes()):
                if tag == 'insert':
                    print "new device id is %s" % new_ls[j1]
                    print subprocess.check_output('pwd', shell=True)
                    args = shlex.split("xboxdrv -c " + os.path.abspath(os.path.join(os.path.dirname(__file__), '../web2xbox.xbox')) + ' --evdev /dev/input/' + new_ls[j1]+ " " + self.extra_args)
                    self.xboxmap[player] = subprocess.Popen(args)
        if active:
            active = 1
        else:
            active = 0
        self.devicemap[player].emit(uinput._CHAR_MAP.get(libi2dx.config.get('keymap_player%s' % player, key_id), uinput.KEY_BACKSLASH), active)

if __name__ == "__main__":
    libi2dx.serve(I2DXWebSocketUInput)
