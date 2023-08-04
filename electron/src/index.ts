import { CLC_EVENTS, DownloadInfo, DownloadedInfo, DownloadingInfo } from './models';
import { getCapacitorElectronConfig, setupElectronDeepLinking, CapacitorElectronConfig } from '@capacitor-community/electron';
import { BrowserWindow, MenuItemConstructorOptions, ipcMain, app, MenuItem } from 'electron';
import electronIsDev from 'electron-is-dev';
import unhandled from 'electron-unhandled';

import { ElectronCapacitorApp, setupReloadWatcher } from './setup';
import * as electronDl from 'electron-dl';
const { download } = electronDl;
// electronDl();
// Graceful handling of unhandled errors.
unhandled();

// Define our menu templates (these are optional)
const trayMenuTemplate: (MenuItemConstructorOptions | MenuItem)[] = [new MenuItem({ label: 'Quit App', role: 'quit' })];
const appMenuBarMenuTemplate: (MenuItemConstructorOptions | MenuItem)[] = [
  { role: process.platform === 'darwin' ? 'appMenu' : 'fileMenu' },
  { role: 'viewMenu' },
];

// Get Config options from capacitor.config
const capacitorFileConfig: CapacitorElectronConfig = getCapacitorElectronConfig();

// Initialize our app. You can pass menu templates into the app here.
// const myCapacitorApp = new ElectronCapacitorApp(capacitorFileConfig);
const myCapacitorApp = new ElectronCapacitorApp(capacitorFileConfig, trayMenuTemplate, appMenuBarMenuTemplate);

// If deeplinking is enabled then we will set it up here.
if (capacitorFileConfig.electron?.deepLinkingEnabled) {
  setupElectronDeepLinking(myCapacitorApp, {
    customProtocol: capacitorFileConfig.electron.deepLinkingCustomProtocol ?? 'mycapacitorapp',
  });
}

// If we are in Dev mode, use the file watcher components.
if (electronIsDev) {
  setupReloadWatcher(myCapacitorApp);
}

// Run Application
(async () => {
  // Wait for electron app to be ready.
  await app.whenReady();
  // Security - Set Content-Security-Policy based on whether or not we are in dev mode.
  // setupContentSecurityPolicy(myCapacitorApp.getCustomURLScheme());
  // Initialize our app, build windows, and load content.
  await myCapacitorApp.init();
  // Check for updates if we are in a packaged app.
})();

// Handle when all of our windows are close (platforms have their own expectations).
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// When the dock icon is clicked.
app.on('activate', async function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (myCapacitorApp.getMainWindow().isDestroyed()) {
    await myCapacitorApp.init();
  }
});

ipcMain.on(CLC_EVENTS.DOWNLOAD, async (event, info: DownloadInfo) => {
  try {
    info.downloadOptions = {
      ...info.downloadOptions,
      onProgress: (progress: electronDl.Progress) => {
        const downloadingInfo: DownloadingInfo = {
          downloadedSize: progress.transferredBytes,
          totalSize: progress.totalBytes,
          clcOptions: info.clcOptions,
        };
        event.sender.send(CLC_EVENTS.DOWNLOADING, downloadingInfo);
        return {};
      },
    };
    const downloadedItem = await download(BrowserWindow.getFocusedWindow(), info.url, info.downloadOptions);
    const downloadedInfo: DownloadedInfo = {
      path: downloadedItem.getSavePath(),
      clcOptions: info.clcOptions,
    };
    event.sender.send(CLC_EVENTS.DOWNLOADED, downloadedInfo);
  } catch (e) {
    console.log(e);
  }
});
