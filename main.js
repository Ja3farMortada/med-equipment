const {
    app,
    BrowserWindow,
    ipcMain,
    dialog
} = require('electron')
const path = require('path')
const fs = require('fs')

// require server
const server = require('./server');

// Check if electron is in development mode to enable Node.js on release mode

var node; //
const isEnvSet = 'ELECTRON_IS_DEV' in process.env;
const getFromEnv = Number.parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;
const isDev = isEnvSet ? getFromEnv : !app.isPackaged;
if (!isDev) {
    // var fileName = './keys.json'
    // var file = require(fileName)
    // file.password = '';
    // fs.writeFile(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
    //     if (err) return console.log(err);
    //     console.log(JSON.stringify(file));
    //     console.log('writing to ' + fileName);
        node = server.listen(3000, () => console.log(`listening on port ${3000} ...`));
        // });
}

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
                    host: 'localhost',
                    user: 'root',
                    password: keys.password,
                    database: 'med-equipments'
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

// export excel
// export to excel sheet
const Excel = require('exceljs');
ipcMain.handle('export-excel', function (event, data) {
    var workbook = new Excel.Workbook();
    workbook.created = new Date();

    var sheet = workbook.addWorksheet('Sheet 1');
    sheet.columns = [{
            header: 'ID',
            key: 'record_ID'
        },
        {
            header: 'Description',
            key: 'description'
        },
        {
            header: 'Asset No.',
            key: 'asset_no'
        },
        {
            header: 'Department',
            key: 'department'
        },
        {
            header: 'EST Report',
            key: 'est_report'
        },
        {
            header: 'Installation Date',
            key: 'installation_date'
        },
        {
            header: 'PPM Schedule',
            key: 'ppm_schedule'
        },
        {
            header: 'Last PPM',
            key: 'ppm_done'
        },
        {
            header: 'Supplier',
            key: 'supplier'
        },
        {
            header: 'Model',
            key: 'model'
        },
        {
            header: 'Serial No.',
            key: 'serial_no'
        },
        {
            header: 'Maker',
            key: 'maker'
        },
        {
            header: 'Notes',
            key: 'notes'
        }
    ]

    // sheet.views = [{
    //     rightToLeft: true
    // }]

    // add rows
    for (let i = 0; i < data.length; i++) {
        sheet.addRow({
            record_ID: data[i]['record_ID'].toString(),
            description: data[i]['description'],
            asset_no: data[i]['asset_no'],
            department: data[i]['department'],
            est_report: data[i]['est_report'], //recipient
            installation_date: data[i]['installation_date'],
            ppm_schedule: data[i]['ppm_schedule'],
            ppm_done: data[i]['ppm_done'],
            supplier: data[i]['supplier'],
            model: data[i]['model'],
            serial_no: data[i]['serial_no'],
            maker: data[i]['maker'],
            notes: data[i]['notes']
        });
    }

    // Save Excel on Hard Disk
    return dialog.showSaveDialog({
        defaultPath: 'equipments.xlsx',
        properties: ['dontAddToRecent']
    }).then(function (response) {
        if (response.canceled) {
            return ('canceled');
        } else {
            return workbook.xlsx.writeFile(response.filePath).then(function () {
                return ('success');
            }, function (error) {
                console.log(error)
                return ('error');
            });
        }
    });
});