const app = require('./app')
const config = require('./utils/config')
const mongoose = require('mongoose')
const logger = require('./utils/logger')

mongoose.connect(config.MONGO_URL)

app.listen(config.PORT, () => {
  logger.info(`Server running on PORT ${config.PORT}`)
})
