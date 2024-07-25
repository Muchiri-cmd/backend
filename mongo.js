const mongoose = require('mongoose')
require('dotenv').config()
const TEST_DB_URI = process.env.TEST_MONGODB_URI

const url = TEST_DB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => {
  const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
  })

  const Note = mongoose.model('Note', noteSchema)

  // const note = new Note({
  //   content: 'Database test',
  //   important: false,
  // })

  // note.save().then(res => {
  //   console.log('note saved!')
  //   mongoose.connection.close()
  // })

  Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
})
