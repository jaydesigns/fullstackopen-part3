const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
//const mongoose = require('mongoose')
require('dotenv').config()
const Contact = require('./models/person')

app.use(express.json())
app.use(cors())
morgan.token('reqBody',function(req){return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'))
app.use(express.static('build'))

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
		if (person) {
			response.json(person)
		} else {
			response.status(404).end()
		}
	})
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (request,response,next) => {
	Contact.findByIdAndRemove(request.params.id)
		.then(() => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

const generateRandomId = () => {
	return Math.floor(Math.random()*999999999)
}

app.post('/api/persons', (request,response,next) => {
	const body = request.body

	/* if (!body.name || !body.number){
      return response.status(404).json({
          error: "Name or number is missing"
      })
  } else if (persons.find(person => person.name === body.name)){
      return response.status(404).json({
          error: "Contact already exists"
      })
  } */

	const person = new Contact({
		id: generateRandomId(),
		name: body.name,
		number: body.number
	})

	person.save().then(savedPerson => {
		response.json(savedPerson)
	})
		.catch(error => next(error))
})

app.put('/api/persons/:id',(request,response,next) => {
	const { name,number }=request.body

	/* const person = {
    name: body.name,
    number: body.number,
  } */

	Contact.findByIdAndUpdate(request.params.id, { name,number }, { new:true, runValidators: true, context: 'query' })
		.then(updatedContact => {
			response.json(updatedContact)
		})
		.catch(error => next(error))
})

const errorHandler = (error,request,response,next) => {
	console.log(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(404).json({ error:error.message })
	}
	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})