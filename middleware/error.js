const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) => {
  // console.log('inside handler error: ', err);
  let error = { ...err }
  error.message = err.message

  if (!error.message) {
    if (err.name === 'SequelizeValidationError') {
      const message = Object.values(err.errors).map(val => val.message)
      error = new ErrorResponse(message, 400)
    } else if (err.parent.errno === 1062) {
      const message = `Duplicate Field Entered!`
      error = new ErrorResponse(message, 400)
    }
  } else if (error.message && err.name === 'SequelizeUniqueConstraintError') {
    const message = Object.values(err.errors).map(val => val.message)
    error = new ErrorResponse(message, 400)
  }

  if (process.env.NODE_ENV === 'development') console.log(err.stack.red)

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Internal Server Error',
  })
}

module.exports = errorHandler
