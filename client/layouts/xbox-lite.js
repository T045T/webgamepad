
i2DX.layout('xbox-lite', function(ui) {

  ui.button('xbox_up', {
    left: '30vmin',
    bottom: '47vmin',
    width: '16vmin',
    height: '25vmin',
  });

  ui.button('xbox_down', {
    left: '30vmin',
    bottom: '6vmin',
    width: '16vmin',
    height: '25vmin',
  });

  ui.button('xbox_left', {
    left: '5vmin',
    bottom: '31vmin',
    width: '25vmin',
    height: '16vmin',
  });

  ui.button('xbox_right', {
    left: '46vmin',
    bottom: '31vmin',
    width: '25vmin',
    height: '16vmin',
  });

  // ui.multiKeyButton('xbox_upleft', ['xbox_left', 'xbox_up'], {
  //   left: '14vmin',
  //   bottom: '47vmin',
  //   width: '16vmin',
  //   height: '16vmin'
  // });

  // ui.multiKeyButton('xbox_downleft', ['xbox_left', 'xbox_up'], {
  //   left: '14vmin',
  //   bottom: '15vmin',
  //   width: '16vmin',
  //   height: '16vmin'
  // });

  // ui.multiKeyButton('xbox_upright', ['xbox_left', 'xbox_up'], {
  //   left: '46vmin',
  //   bottom: '47vmin',
  //   width: '16vmin',
  //   height: '16vmin'
  // });

  // ui.multiKeyButton('xbox_downright', ['xbox_left', 'xbox_up'], {
  //   left: '46vmin',
  //   bottom: '15vmin',
  //   width: '16vmin',
  //   height: '16vmin'
  // });

  ui.roundedButton('xbox_A', {
    right: '28vmin',
    bottom: '6vmin',
    width: '20vmin',
    height: '20vmin',
  });

  ui.roundedButton('xbox_B', {
    right: '7vmin',
    bottom: '28vmin',
    width: '20vmin',
    height: '20vmin',
  });

  ui.roundedButton('xbox_X', {
    right: '49vmin',
    bottom: '28vmin',
    width: '20vmin',
    height: '20vmin',
  });

  ui.roundedButton('xbox_Y', {
    right: '28vmin',
    bottom: '50vmin',
    width: '20vmin',
    height: '20vmin',
  });

  ui.button('xbox_LB', {
    left: '0px',
    bottom: '64vmin',
    width: '25vmin',
    height: '30vmin',
  });

  ui.button('xbox_RB', {
    right: '0px',
    bottom: '64vmin',
    width: '25vmin',
    height: '30vmin',
  });

  ui.button('xbox_start', {
    right: '35%',
    top: '0px',
    width: '15%',
    height: '13vmin',
  });
  
  ui.button('xbox_select', {
    left: '35%',
    top: '0px',
    width: '15%',
    height: '13vmin',
  });

  ui.roundedButton('xbox_guide', {
    right: '43%',
    top: '15vmin',
    width: '14vw',
    height: '14vw',
  });
});
