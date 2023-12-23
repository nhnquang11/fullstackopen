require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
morgan.token('req-body', (req) => JSON.stringify(req.body))
const logFormat = ':method :url :status :response-time ms :req-body'
app.use(morgan(logFormat))

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  Person.find({}).then((persons) => {
    const html = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date().toString()}</p>`
    response.send(html)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  Person.find({}).then((persons) => {
    const result = persons.find((p) => p.name === body.name)
    if (result) {
      Person.findByIdAndUpdate(result.id, body, { new: true })
        .then((updatedPerson) => {
          response.json(updatedPerson)
        })
        .catch((error) => next(error))
    } else {
      const person = new Person({ ...request.body })
      person
        .save()
        .then((p) => {
          response.json(p)
        })
        .catch((error) => next(error))
    }
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
