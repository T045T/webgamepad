
i2DX.ns('events');

/**
 * @class
 * @extends i2DX.events.TouchHandler
 * A button handler.
 */
i2DX.events.ButtonHandler = function(component) {
	this._component = component;
	this._count = 0;
	this._component.set('state', 'released');
};

i2DX.events.ButtonHandler.prototype = {
	check: function(touch) {
		if (this._checkBounds(touch)) {
			return this._createHandler(touch.identifier);
		}
	},
	_checkBounds: function(touch) {
		var bounds = this._component.getBounds();
		var threshould = 25;
		if (bounds.left - threshould <= touch.x && touch.x <= bounds.right + threshould) {
			if (bounds.top - threshould <= touch.y && touch.y <= bounds.bottom + threshould) {
				return true;
			}
		}
		return false;
	},
	_createHandler: function(id) {
		var that = this;
		that._down();
		return {
			move: function(touch) {
				if (touch.identifier === id && !that._checkBounds(touch)) {
					this.release(touch);
					return false;
				}
				return true;
			},
			release: function(touch) {
				var _id = touch.identifier;
				if (_id === id)
				{
					that._up();
				}
			}
		};
	},
	_down: function() {
		if (this._count == 0) {
			this._component.set('state', 'pressed');
			i2DX.broadcast('down', this._component.getName(), this._component.getPlayer());
		}
		this._count++;
	},
	_up: function() {
		this._count--;
		if (this._count == 0) {
			this._component.set('state', 'released');
			i2DX.broadcast('up', this._component.getName(), this._component.getPlayer());
		}
	}
};
