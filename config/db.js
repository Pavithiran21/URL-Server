const mongoose = require('mongoose')
const  URL = process.env.URL

const connectDB = async () => {
    await mongoose.connect(URL, {
        useUnifiedTopology: true,
        useCreateIndex: true,
        useNewUrlParser: true
    })
    console.log("MongoDB  connected")
}
module.exports = connectDB