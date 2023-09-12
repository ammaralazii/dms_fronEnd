const path = require('path')
const { exec } = require('child_process')
const express = require('express')
const serveStatic = require('serve-static')

const app = express()

// here we are configuring dist to server app files
app.use('/', serveStatic(path.join(__dirname, '/dist')))

// this * route isto serve project on different pagerouesexcept root '/'
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '/dist/index.html'))
})/* end of function  */

const port = process.env.PORT || 3011

app.use(express.json())

app.post('/webhook', (req, res) => {
  const payload = req.body

  // Verify that the push event occurred on the master branch
  if (payload.ref === 'refs/heads/master') {
    // Execute the 'git pull' command in your repository directory
    exec('cd /path/to/your/repo && git pull', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing git pull: ${error}`)
        res.status(500).send('Internal Server Error')
      }
      else {
        console.log(`Git pull successful: ${stdout}`)
        res.status(200).send('OK')
      }
    })
  }
  else {
    res.status(200).send('Not a push to master branch; ignoring.')
  }
})

const server = app.listen(port, () => {
  console.log(`Webhook receiver listening at http://localhost:${port}`)
})

// Handle Ctrl+C or VSCode exit
process.on('exit', () => {
  console.log('Shutting down gracefully...')
  server.close(() => {
    console.log('Server closed. Exiting...')
    process.exit(0)
  })
})

// Handle SIGINT (Ctrl+C) in case it's not caught by 'exit' event
process.on('SIGINT', () => {
  console.log('Ctrl+C pressed. Exiting...')
  process.exit(0)
})

console.log(`app is listing on port :${port}`)
