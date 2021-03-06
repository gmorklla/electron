const electron = require('electron');
const express = require('express');
const expressApp = express();
const http = require('http').Server(expressApp);
const socket = require('socket.io')(http);
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const storage = require('electron-json-storage');

const _ = require('underscore');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

var people = {};

function createWindow () {

  expressApp.use('/', express.static(__dirname + '/public'));

  http.listen(3000, function(){
    console.log('listening on *:3000');
  });

  expressApp.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });

  // socket.io code
  socket.on('connection', function(client){

    client.on("join", function(name){
        people[client.id] = {'nombre': name};
        socket.emit("update", name + " se ha unido al chat.")
        socket.emit("update-people", people);
        console.log(people);
    });

    client.on("send", function(msg){
      socket.emit("chat", people[client.id], msg);
    });

    client.on("disconnect", function(){
        socket.emit("update", people[client.id] + " ha salido del chat.");
        delete people[client.id];
        socket.emit("update-people", people);
    });

    client.on('say to someone', function(id, msg){
      console.log('ID: ' + id + ' MSG: ' + msg);
      var key = _.findKey(people, {'nombre': id});
      socket.to(key).emit('privateM', people[client.id], msg);
    });    

  });  

  // Create the browser window.
  mainWindow = new BrowserWindow({width: 600, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(`http://localhost:3000/`)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
