const personsRouter = require('express').Router()
const Person = require('../models/person')

personsRouter.get('/', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

// personsRouter.get('/info', (request, response) => {
//   Person.find({}).then((persons) => {
//     const html = `
//       <p>Phonebook has info for ${persons.length} people</p>
//       <p>${new Date().toString()}</p>`
//     response.send(html)
//   })
// })

personsRouter.get('/:id', (request, response, next) => {
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

personsRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

personsRouter.post('/', (request, response, next) => {
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

personsRouter.put('/:id', (request, response, next) => {
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

module.exports = personsRouter
