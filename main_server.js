require('dotenv').config();
const http = require('http');
const express = require('express');
const app = express();
const websocket = require('ws');
const server = http.createServer(app);
const mongoose = require('mongoose');
const wss = new websocket.Server({server})
const path = require('path');
const PORT = 8000;
const body = require('body-parser');
const urlencoded = body.urlencoded({extended:false})
const route = require('./pheripherals/router');
app.set('view engine', 'ejs');
// app.use(express.static(path.join(__dirname,'sydneyLib')));

app.use('/',new route({express:express,path:path,urlencoded:urlencoded,wss:wss,mongoose:mongoose}).router)
app.use(express.static(__dirname))
app.use(express.static(path.join(__dirname,'buyData/myApp')))
app.use(express.static(path.join(__dirname,'dashboard/myApp')))
app.use(express.static(path.join(__dirname,'profile/myApp')))
app.use(express.static(path.join(__dirname,'Login/myApp')))
app.use(express.static(path.join(__dirname,'transaction/myApp')))
app.use(express.static(path.join(__dirname,'purchase/myApp')))
app.use(express.static(path.join(__dirname,'wallet/myApp')))
app.use(express.static(path.join(__dirname,'complain/myApp')))
app.use(express.static(path.join(__dirname,'admin')))
app.use(express.static(path.join(__dirname,'create_account/myApp')))
app.use(express.static(path.join(__dirname,'routePages')));

server.listen(PORT,() =>{
    console.log(`server listening at port ${PORT}`)
})