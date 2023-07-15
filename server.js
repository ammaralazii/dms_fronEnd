const path = require('path')
const express = require('express')
const serveStatic = require('serve-static')

const app = express()

// here we are configuring dist to server app files
app.use('/', serveStatic(path.join(__dirname, '/dist')))

// this * route isto serve project on different pagerouesexcept root '/'
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '/dist/index.html'))
})/* end of function  */

const port = process.env.PORT || 8080

app.listen(port)
console.log(`app is listing on port :${port}`)
