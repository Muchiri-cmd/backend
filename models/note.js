const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

require('dotenv').config()
const url = process.env.MONGODB_URI

console.log('connecting ...')

mongoose.connect(url,{
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
}).then(console.log('connected to MongoDB')
).catch(error => console.log('error connecting to MongoDB:', error.message))

const noteSchema = new mongoose.Schema({
  content: {
    type:String,
    minlength:5,
    required:true
  },
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)