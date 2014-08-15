
i2DX.ns('ui');

/**
 * The user interface. Creates the interface and responds to touch events.
 */
i2DX.ui.UI = function() {
  this._handlers = [];
  this._touches = {};
  this._defaultPlayer = {};
  this._mousetouch;
  if ((window.navigator.msPointerEnabled)||(window.navigator.pointerEnabled)) {
    this._addPointerHandler();
  } else {
    this._addTouchHandler();
    this._addMouseHandler();
  }
};

i2DX.ui.UI.prototype = {

  /**
   * Adds a new component to the interface.
   * @param {i2DX.ui.Component} component the component to add
   * @param {i2DX.events.TouchHandler} the touch handler
   */
  add: function(component, handler) {
    component.renderTo(document.body);
    if (handler) {
      this._handlers.push(handler);
    }
  },

  /**
   * Adds a button to the UI.
   * @param {String} name name of the button.
   * @param {Object} style the style to pass to i2DX.ui.Component#button
   */
  button: function(name, style, player) {
    player = player || this._defaultPlayer;
    var component = new i2DX.ui.Component(name, style, player);
    this.add(component, new i2DX.events.ButtonHandler(component));
  },

  /**
   * Adds a rounded button to the UI.
   * @param {String} name name of the button.
   * @param {Object} style the style to pass to i2DX.ui.Component#button
   */
  roundedButton: function(name, style, player) {
    player = player || this._defaultPlayer;
    var component = new i2DX.ui.Component(name, style, player);
    this.add(component, new i2DX.events.RoundedButtonHandler(component));
  },

  /**
   * Adds a button to the UI whose bound is check by actual element.
   * @param {String} name name of the button.
   * @param {Object} style the style to pass to i2DX.ui.Component#button
   */
  elementButton: function(name, style, player) {
    player = player || this._defaultPlayer;
    var component = new i2DX.ui.Component(name, style, player);
    this.add(component, new i2DX.events.ElementButtonHandler(component));
  },

  /**
   * Adds a turntable to the UI.
   * @param {Number} width width of the turntable.
   * @param {String} placement either "left" or "right"
   */
  turntable: function(width, placement, player) {
    player = player || this._defaultPlayer;
    var style = { top: 0, bottom: 0, width: width };
    style[placement] = 0;
    var component = new i2DX.ui.Component('turntable', style, player);
    this.add(component, new i2DX.events.TurntableHandler(component, placement));
  },
  
  /**
   * Adds a full-screen turntable to the UI.
   */
  turntableFullscreen: function(player) {
    player = player || this._defaultPlayer;
    var component = new i2DX.ui.Component('turntable', { top: 0, right: 0, bottom: 0, left: 0 }, player);
    this.add(component, new i2DX.events.TurntableHandler(component, 'fullscreen'));
  },

  /**
   * Sets the default player number for newly created components.
   * @param {Number} playerNumber the player number
   */
  setDefaultPlayer: function(playerNumber) {
    this._defaultPlayer = playerNumber;
  },

  /**
   * Gets the default player number.
   * @return {Number} the default player number
   */
  getDefaultPlayer: function() {
    return this._defaultPlayer;
  },
  _addPointerHandler: function() {
    document.addEventListener('pointerdown', i2DX.proxy(this, '_updateTouches'), false);
    document.addEventListener('pointermove', i2DX.proxy(this, '_updateTouches'), false);
    document.addEventListener('pointerup', i2DX.proxy(this, '_updateTouches'), false);
    document.addEventListener('MSPointerDown', i2DX.proxy(this, '_updateTouches'), false);
    document.addEventListener('MSPointerMove', i2DX.proxy(this, '_updateTouches'), false);
    document.addEventListener('MSPointerUp', i2DX.proxy(this, '_updateTouches'), false);
  },
  _addTouchHandler: function() {
    document.addEventListener('touchstart', i2DX.proxy(this, '_updateTouches'), false);
    document.addEventListener('touchmove', i2DX.proxy(this, '_updateTouches'), false);
    document.addEventListener('touchend', i2DX.proxy(this, '_updateTouches'), false);
  },
  _addMouseHandler: function() {
    document.addEventListener('mousedown', i2DX.proxy(this, '_updateTouches'), false);
    document.addEventListener('mousemove', i2DX.proxy(this, '_updateTouches'), false);
    document.addEventListener('mouseup', i2DX.proxy(this, '_updateTouches'), false);
  },
  _updateTouches: function(e) {
    e.preventDefault();
    e.stopPropagation();

    if (e.type == 'mousemove') {
      if (this._mousetouch) {
        this._mousetouch.move(e, this._handlers);
      }
    } else if (e.type == 'mousedown') {
      if (this._mousetouch) {
        this._mousetouch.release();
      }
      this._mousetouch = new i2DX.events.Touch('mouse');
      this._mousetouch.move(e, this._handlers);
    } else if (e.type == 'mouseup') {
      if (this._mousetouch) {
        this._mousetouch.release();
        this._mousetouch = undefined;
      }
    } else if (e.type == 'touchstart') {
      var started = e.changedTouches;
      for (var i = 0; i < started.length; i++) {
        var id = started[i].identifier;
        if (this._touches[id]) {
          this._touches[id].release();
          this._touches[id] = new i2DX.events.Touch(id);
          this._touches[id].move(started[i]);
        }
      }

    } else if (e.type == 'touchmove') {
      var moved = e.changedTouches;
      for (var i = 0; i < moved.length; i++) {
        var id = moved[i].identifier;
        if (this._touches[id]) {
          this._touches[id].move(moved[i]);
        }
      }

    } else if (e.type == 'touchend') {
      var removed = e.changedTouches;
      for (var i = 0; i < removed.length; i++) {
        var id = removed[i].identifier;
        if (this._touches[id]) {
          this._touches[id].release();
          delete this._touches[id];
        }
      }

    } else if ((e.type == 'pointerdown')||(e.type == 'MSPointerDown')) {
      if (this._touches[e.pointerId]) {
        this._touches[e.pointerId].release();
      }
      this._touches[e.pointerId] = new i2DX.events.Touch(e.pointerId);

    } else if ((e.type == 'pointermove')||(e.type == 'MSPointerMove')) {
      var touch = this._touches[e.pointerId] || (this._touches[e.pointerId] = new i2DX_events.Touch(e.pointerId));
      touch.move(e, this._handlers);

    } else if ((e.type == 'pointerup')||(e.type == 'MSPointerUp')) {
      if (this._touches[e.pointerId]) {
        this._touches[e.pointerId].release();
        delete this._touches[e.pointerId];
      }
    }
  }
};
