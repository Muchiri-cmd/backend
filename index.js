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

app.get('/api/notes/:id',(req,res)=>{
    Note.findById(req.params.id).then(note=>res.json(note))
})

app.delete('/api/notes/:id',(req,res)=>{
    const id = req.params.id
    notes = notes.filter(note=> note.id!=id )
    res.status(204).end()
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

const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
})

