const logger = require('./logger')

const requestLogger = (req,res,next) => {
  console.log('Method:',req.method)
  console.log('Path:',req.path)
  console.log('Body:',req.body)
  console.log('----')
  next()
}

const unknownEndPoint = (req,res) => {
  res.status(404).send({ error:'unknown endpoint' })
}

const errorHandler = (err,req,res,next) => {
  logger.error(err.message)

  if (err.name === 'CastError'){
    return res.status(400).send({ error:'malformtted id' })
  }else if (err.name === 'ValidationError'){
    return res.status(400).json({ err:err.message })
  }
  next(err)
}

module.exports = { requestLogger,unknownEndPoint,errorHandler }