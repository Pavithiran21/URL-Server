const express = require('express')
const mongoose = require('mongoose')
const userRouter = require('./routers/userRouter')
const urlRouter = require ('./routers/urlRouter')



const app = express();
app.use(express.json())

const cors = require('cors');
app.use(cors());

const dotenv=require('dotenv')
dotenv.config()





const URL = process.env.URL;
app.use('/api/auth', userRouter)
app.use('/api/url', urlRouter)
mongoose.connect(URL,
{useNewUrlParser:true,useUnifiedTopology: true ,useFindAndModify:true },(err) => {
if (err) throw err     
console.log("MongoDB Connected");
})
if(Boolean(process.env.ISPRODUCTION))
{
    process.env.BASE_URL=process.env.BASE_URL
}
else{
    process.env.BASE_URL=process.env.LOCAL_BASE_URL
}

const PORT = process.env.PORT || 9003

app.listen(PORT,() => console.log(`Server Running in the port ${PORT}`));