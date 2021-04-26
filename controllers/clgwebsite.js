const options = {
    top: '100px',
    bottom: 'unset', // default: '680px' 
    left: '70px', // default: '32px'
    right: 'unset', // default: 'unset'
    time: '0.5s', // default: '0.3s'
    mixColor: '#fff', // default: '#fff'
    backgroundColor: '#fff',  // default: '#fff'
    buttonColorDark: '#100f2c',  // default: '#100f2c'
    buttonColorLight: '#fff', // default: '#fff'
    saveInCookies: true, // default: true,
    label: '🌓', // default: ''
    autoMatchOsTheme: true// default: true
  }
  
  const darkmode = new Darkmode(options);
  darkmode.showWidget();

// const Darkmode = require("C:\\Users\\chira\\node_modules\\darkmode-js");
// new Darkmode().showWidget();