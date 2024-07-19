const express = require('express')
const app = express()
app.use(express.json())//json parser

const cors = require('cors')
app.use(cors())

app.use(express.static('dist'))

const requestLogger = (req,res,next) => {
    console.log('Method:',req.method);
    console.log('Path:',req.path);
    console.log('Body:',req.body);
    console.log('----');
    next()
}
app.use(requestLogger)

const Note = require('./models/note')
let notes = [
        {
          id: 1,
          content: "HTML is easy",
          important: true
        },
        {
          id: 2,
          content: "Browser can execute only JavaScript",
          important: false
        },
        {
          id: 3,
          content: "GET and POST are the most important methods of HTTP protocol",
          important: true
        }
]
const generateId = () => {
    const maxId = notes.length > 0
    ? Math.max(...notes.map(note => Number(note.id)))//map note.id to Numbers,return array and do a Math.max() on it
    :0
    return String(maxId + 1)//generate id for new note
}

app.get('/',(req,res) => {
    res.send('<h1>Hello World!</h1>')
})
app.get('/api/notes',(req,res)=>{
    Note.find({}).then(notes=>res.json(notes))
})

app.get('/api/notes/:id',(req,res,next)=>{
    Note.findById(req.params.id).then(note=>{
        if (note){
            res.json(note)
        }else {
            res.status(404).end()
        }
    }).catch(err => next(err))
})

app.delete('/api/notes/:id',(req,res,next)=>{
    Note.findByIdAndDelete(req.params.id)
        .then(result=>res.status(204).end())
        .catch(err => next(err))
})

app.put('/api/notes/:id',(req,res,next)=>{
    const body = req.body
    const note = {
        content : body.content,
        important: body.important
    }

    Note.findByIdAndUpdate(req.params.id,note,{new:true})
        .then(updatedNote=>res.json(updatedNote))
        .catch (err => next(err))

})

app.post('/api/notes',(req,res)=>{
    const body = req.body 

    if (!body.content){
        return res.status(400).json({error:'content missing'})
    }

    const note = new Note({
        content:body.content,
        important:Boolean(body.important) || false,
        // id:generateId(),
    })
    note.save().then(savedNote=>res.json(savedNote))
})

const unknownEndPoint = (req,res)=>{
    res.status(404).send({error:'unknown endpoint'})
}
app.use(unknownEndPoint)

const errorHandler = (err,req,res,next) =>{
    console.log(err.message)

    if (err.name === 'CastError'){
        return res.status(400).send({error:'malformtted id'})
    }
    next(err)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
})

