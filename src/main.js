const { app } = require('electron');
const { initMenubar } = require('./menubar')
const { initBLE } = require('./ble')
const { createWindow } = require('./window')

const receiveMuteStateUpdateCallbacks = [];
// const setMuteStateCallbacks = [];

const onReceiveMuteStateUpdate = (muted) => {
  for (cb of receiveMuteStateUpdateCallbacks) {
    cb.call(null, muted);
  }
}

const setMuteState = (muted) => {
  for (cb of receiveMuteStateUpdateCallbacks) {
    cb.call(null, muted);
  }
}

app.whenReady().then(async () => {
  const window = createWindow(setMuteState);
  receiveMuteStateUpdateCallbacks.push(window.onReceiveMuteStateUpdate);

  const menubar = initMenubar(setMuteState);
  receiveMuteStateUpdateCallbacks.push(menubar.onReceiveMuteStateUpdate);

  const ble = await initBLE(setMuteState);
  receiveMuteStateUpdateCallbacks.push(ble.onReceiveMuteStateUpdate);

  app.on('activate', () => {
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  };
});
