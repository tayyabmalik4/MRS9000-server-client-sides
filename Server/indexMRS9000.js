const express= require('express')
const connection= require('./DataBase/db.js')
const Route= require('./Router/router.js')
const cors= require('cors')
const bodyParser= require('body-parser')
const path= require('path')
const http= require('http')


const app = express();
const server = http.createServer(app)


const hostname = '0.0.0.0'
const port = 4000;
connection();

// let __dirname = path.resolve()
app.use(bodyParser.json({extended:true}))
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())
app.use('/api',Route)

// app.use("/public",express.static("public"));
app.use("/static", express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname,'build')));
app.get('/*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'build','index.html'));
})

server.listen(port,hostname,()=>{
    console.log(`Server is running http://localhost:${port}`)
})
