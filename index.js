require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/person')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
morgan.token('dat', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :dat'))

let persons = [
  {
    'id': 1,
    'name': 'Arto Hellas',
    'number': '040-123456'
  },
  {
    'id': 2,
    'name': 'Ada Lovelace',
    'number': '39-44-5323523'
  },
  {
    'id': 3,
    'name': 'Dan Abramov',
    'number': '12-43-234345'
  },
  {
    'id': 4,
    'name': 'Mary Poppendieck',
    'number': '39-23-6423122'
  }
]

//GET REQUESTS
app.get('/', (request, response) => {
  response.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (request, response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  })
})

app.get('/api/persons/:id', (request,response,next) => {
  Contact.findById(request.params.id)
    .then(person => {
      if(person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


//POST REQUESTS

const generateRandomId = () => {
  const randomId = persons.length>0
    ? Math.floor(Math.random()*999999999)
    : 0
  return randomId
}


app.post('/api/persons', (request, response, next) => {

  const body = request.body

  persons.find(p => {
    if(p.name === body.name){
      return response.status(404).json({
        error: 'Contact already exists'
      })
        .catch(error => next(error))
    }
  })
  /*
  //IF NAME IS MISSING
  if(!body.name){
    return response.status(404).json({
      error: 'You forgot the name'
    })
  }
  //IF THE NUMBER WAS FORGOTTEN
  if(!body.number){
    return response.status(404).json({
      error: 'You forgot the contact number'
    })
  }
   */
  const person = new Contact({
    id: generateRandomId(),
    name: body.name,
    number: body.number,
  })

  person.save().then(savedContact => {
    response.json(savedContact)
  })
    .catch(error => next(error))
  //persons = persons.concat(person)
  //response.json(person)
})

//DELETE CONTACT
app.delete('/api/persons/:id', (request,response,next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


//UPDATE CONTACT
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Contact.findByIdAndUpdate(request.params.id, { name,number }, { new: true, runValidators:true, context:'query' })
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error))
})

//DISPLAY INFO PAGE

app.get('/info', (request, response) => {
  const currentDate = new Date()
  response.send(`<h2>Phonebook has info for ${persons.length} people</h2><br><p>${currentDate.toUTCString()}</p>`)
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)