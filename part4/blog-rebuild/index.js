const mongoose = require('mongoose')
const app = require('./app')


const mongoUrl = 'mongodb://localhost/bloglist'
mongoose.connect(mongoUrl)

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server connected to port ${PORT}`)
})
