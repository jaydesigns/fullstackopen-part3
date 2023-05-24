const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

app.use(cors())
morgan.token('reqBody',function(req,res){return JSON.stringify(req.body)})
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'))
app.use(express.static('build'))

const Contact = require('./models/person')

/* let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
] */

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
  
app.get('/api/persons', (request, response) => {
  Contact.find({}).then(persons => {
    response.json(persons)
  })
})
  
app.get('/info', (request,response) => {
  const time = new Date()
  response.send(`<h5>Phonebook has info for ${persons.length} people.</h5><p>${time}</p>`)
})

app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request,response)=>{
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateRandomId = () =>{
  return Math.floor(Math.random()*999999999)
}

app.post('/api/persons', (request,response) => {
  const body = request.body

  if (!body.name || !body.number){
      return response.status(404).json({
          error: "Name or number is missing"
      })
  } else if (persons.find(person => person.name === body.name)){
      return response.status(404).json({
          error: "Contact already exists"
      })
  }

  const person = {
      id: generateRandomId(),
      name: body.name,
      number: body.number
  }

  person.save().then(savedPerson=>{
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})