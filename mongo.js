const mongoose = require('mongoose')

const password = process.argv[2]

const url =`mongodb+srv://fullstack:${password}@cluster0.omqd2ki.mongodb.net/phonebook?retryWrites=true&w=majority`

const contactSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Contact = mongoose.model('Contact', contactSchema)

const noPassword = () => {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

process.argv.length > 3

  ? mongoose
    .connect(url)
    .then((result) => {
      console.log('connected')

      const note = new Contact({
        name: process.argv[3],
        number: process.argv[4],
      })

      return note.save()
    })
    .then(() => {
      console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))

  : process.argv.length === 3

    ? mongoose
      .connect(url)
      .then((result) => {
        console.log('connected')

        Contact.find({}).then(result => {
          result.forEach(contact => {
            console.log(`${contact.name} ${contact.number}`)
          })
          mongoose.connection.close()
        })
      })
      .catch((err) => console.log(err))

    : process.argv.length < 3
      ? noPassword()
      : console.log('Make sure to check CLI command')