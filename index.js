import BackgroundRoute from './routes/BackgroundRoute.js';
import ContentRoute from './routes/ContentRoute.js';
import HotelRoute from './routes/HotelRoute.js';
import BtpRoute from './routes/BtpRoute.js';
import FileUpload from "express-fileupload";
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import express from 'express'
import multer from 'multer'
import mysql from 'mysql';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.all("/", (req, res)=>{
    res.send("ebath backend running good and changing")
})
app.use(cookieParser());
app.use(FileUpload());
app.use(express.static('public'))
app.use(cors(
    {
        origin: 'https://ebath-site.vercel.app',
        methods: ['POST', 'GET', 'DELETE', 'PUT'],
        credentials: true,
        // allowedHeaders: ['*'],
    }
));
app.use(ContentRoute);
app.use(BtpRoute);
app.use(HotelRoute);
app.use(BackgroundRoute);

const db = mysql.createConnection({
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME

    // host: 'localhost',
    // user: 'root',
    // password: '',
    // database: 'ebath_btp'
})


db.connect(function(err) {
    if(err) {
        console.log("Error in Connection");
    } else {
        console.log("Connected");
    }
})

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      return cb(null, "./public/images")
    },
    filename: function (req, file, cb) {
      return cb(null, `${Date.now()}_${file.originalname}`)
    }
  })

  
const upload = multer({storage})

app.post('/create',upload.single('file'), (req, res) => {
    const sql = "INSERT INTO image (`name`,`titre`, `image`) VALUES (?)"; 
    const values = [
        req.body.name,
        req.body.titre, 
        req.file.filename
    ]
    con.query(sql, [values], (err, result) => {
        if(err) return res.json({Error: "Error singup query"});
        return res.json({Status: "Success"});
    })
})


app.listen(3000, () => {
    console.log("Démarrage de mon serveur sur le port 3000")
})
