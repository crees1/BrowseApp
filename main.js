const { app, dialog, BrowserWindow } = require('electron')
const path = require('path')
const fs = require('fs')

function createWindow () {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
  
    win.webContents.openDevTools()
    win.loadFile('index.html')

    let options = {
        title : "Select a folder", 
        properties: ['openDirectory']
    }

    dialog.showOpenDialog(win, options)
    .then(result => {
        console.log(result.canceled)
        console.log(result.filePaths)

        fs.readdir(result.filePaths[0], (err, files) => {
            files.forEach(file => {
              console.log(file);

              fs.copyFile(result.filePaths[0] + "/" + file, file, (err) => {
                if (err) {
                    console.log("Error Found:", err);
                } else {
                    console.log('copied');
                }
              });
            });
        });
    }).catch(err => {
        console.log(err)
    })
}

app.whenReady().then(() => {
    createWindow()
  
    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})