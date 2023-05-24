const mongoose = require('mongoose')

const password = process.argv[2]


const url =
  `mongodb+srv://fullstack:${password}@cluster0.omqd2ki.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Contact = mongoose.model('Contact', contactSchema)

const person = new Contact({
  name: process.argv[3],
  number: process.argv[4],
})

if (process.argv.length<4){
  Contact.find({}).then(result => {
    console.log("phonebook:");
    result.forEach(note => {
      console.log(`${note.name} ${note.number}`)
    })
    mongoose.connection.close()
  })
} else {
  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}