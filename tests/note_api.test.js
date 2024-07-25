const { test, describe , after,beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
//import express application from app.js
const app = require('../app')
//wraps supertest function into a superagent object
const api = supertest(app)

const Note = require('../models/note')

beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = helper.initialNotes
    .map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)
})

describe('when there is initially some notes saved', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    assert.strictEqual(response.body.length, helper.initialNotes.length)
  })

  test('there are two notes', async () => {
    const response = await api.get('/api/notes')
    assert.strictEqual(response.body.length,helper.initialNotes.length)
  })

  test('the first note is about HTTP methods', async () => {
    const response = await api.get('/api/notes')
    const contents = response.body.map(e => e.content)
    assert(contents.includes('HTML is easy'))
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(r => r.content)
    assert(contents.includes('Browser can execute only JavaScript'))
  })
})

describe ('viewing a specific note', () => {

  test(' a specific note can be viewed', async () => {
    const notesAtStart = await helper.notesInDb()

    const noteToView = notesAtStart[0]

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type',/application\/json/)

    assert.deepStrictEqual(resultNote.body,noteToView)
  })

  test('succeeds with a valid id', async () => {
    const notesAtStart = await helper.notesInDb()

    const noteToView = notesAtStart[0]

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultNote.body, noteToView)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/notes/${invalidId}`)
      .expect(400)
  })
})

describe('addition of a new note',() => {

  // TODO: ++++++++++++++++++++++++++++++ FIX TEST ++++++++++++++++++++++++++++++++++++++++++++++//
  test.skip(' a valid note can be added', async () => {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true,
    }
    await api
      .post('/api/notes')
      .send(newNote)
      .expect(201)
      .expect('Content-Type',/application\/json/)

    const notesAtEnd = await helper.notesInDb()
    assert.strictEqual(notesAtEnd.length,helper.initialNotes.length + 1)

    const contents = notesAtEnd.map(n => n.content)
    assert(contents.includes('async/await simplifies making async calls'))
  })

  //TODO: ++++++++++++++++++++++++++++++ FIX TEST ++++++++++++++++++++++++++++++++++++++++++++++//

  test('fails with status code 400 if request data not valid', async() => {
    const newNote = {
      important: true
    }
    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const notesAtEnd = await helper.notesInDb()
    assert.strictEqual(notesAtEnd.length,helper.initialNotes.length)

  })
})

describe ('deletion of a note',() => {

  test('succeeds with status code 204 if id is valid', async () => {
    const notesAtStart = await helper.notesInDb()
    const notesToDelete = notesAtStart[0]

    await api
      .delete(`/api/notes/${notesToDelete.id}`)
      .expect(204)

    const notesAtEnd = await helper.notesInDb()
    const contents = notesAtEnd.map(r => r.content)

    assert(!contents.includes(notesToDelete.content))
    assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
  })

})

after(async () => {
  await mongoose.connection.close()
})