const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron')
const path = require('path')
const fs = require('fs')

// require server
const server = require('./server');

// Check if electron is in development mode to enable Node.js on release mode
function startServer() {
    const isEnvSet = 'ELECTRON_IS_DEV' in process.env;
    const getFromEnv = Number.parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;
    const isDev = isEnvSet ? getFromEnv : !app.isPackaged;
    if (!isDev) {
        var fileName = './keys.json'
        var file = require(fileName)
        file.password = '';
        fs.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
            if (err) return console.log(err);
            console.log(JSON.stringify(file));
            console.log('writing to ' + fileName);
            var node = server.listen(3000, () => console.log(`listening on port ${3000} ...`));
          });
    }
}
startServer()

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.maximize()
    win.show()

    win.loadFile('app/index.html')

    // require update module
    const updater = require('./update')
    updater(win, ipcMain);
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (!isDev) {
            node.close();
        }
        app.quit()
    }
})


ipcMain.on('backupDB', () => {
    dialog.showSaveDialog({
        defaultPath: 'med-equipment.sql',
        properties: ['dontAddToRecent']
    }).then(function (data) {
        if (data.canceled == false) {
            mysqldump({
                connection: {
                    host: keys.host,
                    user: keys.username,
                    password: keys.password,
                    database: keys.database
                },
                dumpToFile: `${data.filePath}`
            }).then(function () {
                win.webContents.send('backup-success')
            }, function (error) {
                win.webContents.send('backup-error')
            })
        }
    })
});

// read package info
ipcMain.handle('read-package', function () {
    let data = require('./package.json');
    return data;
})