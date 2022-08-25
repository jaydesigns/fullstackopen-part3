const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

morgan.token('dat', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :dat'))

let persons = [
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
]

//GET REQUESTS
app.get('/', (request, response) => {
  response.send('<h1>Phonebook</h1>')
})
  
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get(`/api/persons/:id`, (request,response) => {
  const id = Number(request.params.id)
  const person = persons.find(i => i.id === id)
  person
  ? response.send(`<h2>Name: ${person.name}</h2><br><p>Number: ${person.number}</p>`) 
  : response.status(404).end()
})


//POST REQUESTS

const generateRandomId = () => {
  const randomId = persons.length>0 
    ? Math.floor(Math.random()*999999999)
    : 0
  return randomId
}


app.post('/api/persons', (request, response) => {
  
  const body = request.body

  const person = {
    id: generateRandomId(),
    name: body.name,
    number: body.number,
  }

  persons.find(p=>{
    if(p.name === body.name){
      return response.status(404).json({
        error: 'Contact already exists'
      })
    }
  })
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
  
  persons = persons.concat(person)
  response.json(person)
})

//DELETE CONTACT
app.delete('/api/persons/:id', (request,response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p=> p.id !== id)

  response.status(204).end()
})

//DISPLAY INFO PAGE

app.get('/info', (request, response) => {
  const currentDate = new Date()
  response.send(`<h2>Phonebook has info for ${persons.length} people</h2><br><p>${currentDate.toUTCString()}</p>`)
})


const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`);