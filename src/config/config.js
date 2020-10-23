require('dotenv').config();

module.exports = {
  mongoConnection: 'mongodb+srv://eze-wholesale:eze-wholesale@cluster0-g3vvd.mongodb.net/eze-wholesale?retryWrites=true&w=majority',
  // mongoTestConnection: 'mongodb+srv://softcom:softcom@cluster0-g3vvd.mongodb.net/softcom-test?retryWrites=true&w=majority',
  port: 8080,
  secret: 'eze-wholesalejwtsecret'
} 