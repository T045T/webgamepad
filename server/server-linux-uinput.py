
import libi2dx
import uinput


class I2DXWebSocketUInput(libi2dx.I2DXWebSocket):
    keys = []
    for player in range(1, 5):
        if libi2dx.config.has_section('keymap_player%s' % player):
            for x in libi2dx.config.items('keymap_player%s' % player):
                keyval = uinput._CHAR_MAP.get(x[1], uinput.KEY_BACKSLASH)
                if keyval not in keys:
                    keys.append(keyval)

    devicemap = {}

    def toggle_key(self, key_id, active, player):
        if player not in self.devicemap():
            self.devicemap[player] = uinput.Device(self.keys)
        if active:
            active = 1
        else:
            active = 0
        self.devicemap[player].emit(uinput._CHAR_MAP.get(libi2dx.config.get('keymap_player%s' % player, key_id), uinput.KEY_BACKSLASH), active)

if __name__ == "__main__":
    libi2dx.serve(I2DXWebSocketUInput)
