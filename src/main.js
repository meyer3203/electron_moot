const { app } = require('electron');

const macOS = require('./macos/macos');
const zoomMacOS = require('./macos/zoom_macos');

const { initMenubar } = require('./menubar');
const { initBLE } = require('./ble');
const { createWindow } = require('./window');

const osascript = require('node-osascript');

const receiveMuteStateUpdateCallbacks = [];

let globalMutedState; // init?

const setMuteState = (muted) => {
  globalMutedState = muted;

  for (cb of receiveMuteStateUpdateCallbacks) {
    cb.call(null, muted);
  }

  switch (process.platform) {
    case 'darwin':
      macOS.mute(muted);
      zoomMacOS.mute(muted);
      zoomMacOS.checkMutedState();
      break;
    case 'win32':
      break;
    default:
      console.log("Platform not supported: ", process.platform);
  }
}

const checkMutedStates = async () => {
  switch (process.platform) {
    case 'darwin':
      let zoomMuted = await zoomMacOS.checkMutedState();
      if (zoomMuted != null) {
        if (zoomMuted != globalMutedState) {
          setMuteState(zoomMuted)
        }
      }
    case 'win32':
      break;
    default:
      break;
  }
}

app.whenReady().then(async () => {
  try {
    const window = createWindow(setMuteState);
    receiveMuteStateUpdateCallbacks.push(window.onReceiveMuteStateUpdate);

    const menubar = initMenubar(setMuteState);
    receiveMuteStateUpdateCallbacks.push(menubar.onReceiveMuteStateUpdate);

    const ble = await initBLE(setMuteState);
    receiveMuteStateUpdateCallbacks.push(ble.onReceiveMuteStateUpdate);

    setInterval(checkMutedStates, 500);
  } catch (e) {
    // todo remove
    osascript.execute('display dialog msg', { msg: e.toString() })
  }

  app.on('activate', () => {
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  };
});
