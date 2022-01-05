const { app } = require('electron');

const macOS = require('./macos/macos');
const zoomMacOS = require('./macos/zoom_macos');
const meetMacOS = require('./macos/meet_macos');
const webexMacOS = require('./macos/webex_macos');

require('./store');
const { initMenubar } = require('./menubar');
const { initBLE, cleanup } = require('./ble');
const { createWindow, closeWindow, initWindow } = require('./window');
const log = require('electron-log');

const osascript = require('node-osascript');

const receiveMuteStateUpdateCallbacks = [];

let globalMutedState = false;

const setMuteState = (muted) => {
  globalMutedState = muted;

  for (cb of receiveMuteStateUpdateCallbacks) {
    cb.call(null, muted);
  }

  switch (process.platform) {
    case 'darwin':
      macOS.mute(muted);
      zoomMacOS.mute(muted);
      // meetMacOS.toggleMute(); // requires too many accessibility permissions; also not needed because meet recognizes system state
      // webexMacOS.mute(muted); // webex error causes something to crash, osascripts stop running
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
          console.log("detected zoom change")
          setMuteState(zoomMuted)
        }
      }

      let webexMuted = await webexMacOS.checkMutedState();
      if (webexMuted != null) {
        if (webexMuted != globalMutedState) {
          console.log("detected webex change")
          setMuteState(webexMuted)
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
    const window = initWindow(setMuteState);
    receiveMuteStateUpdateCallbacks.push(window.onReceiveMuteStateUpdate);

    const menubar = initMenubar(setMuteState);
    receiveMuteStateUpdateCallbacks.push(menubar.onReceiveMuteStateUpdate);

    const ble = await initBLE(setMuteState);
    receiveMuteStateUpdateCallbacks.push(ble.onReceiveMuteStateUpdate);

    setInterval(checkMutedStates, 500);
  } catch (e) {
    // todo remove
    log.error(e)
    console.log("ERROR: ", e)
    // osascript.execute('display dialog msg', { msg: e.toString() })
  }

  app.on('activate', () => {
  });
});

app.on('before-quit', async () => {
  await cleanup();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  };
});