const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const bcrypt = require('bcrypt');
const saltRounds = 10

const app = express();

const port = 3333;

app.use(express.json());
app.use(cors({
    methods: ['GET','POST'],
    origin:'http://localhost:3000', 
    credentials:true,            
    optionSuccessStatus:200
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    key: 'userId',
    secret: 'subscribe',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24,
    },
}))

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: '', //env.process.dbpassword
    // database: 'env.process.dbname',
})

app.post('/register', (req,res)=> {

    const username = req.body.user
    const password = req.body.pwd

    bcrypt.hash(password, saltRounds, (err, hash) => {

        if(err) {
            res.send({ err: err });
        }

        db.query('INSERT INTO users (username, password) VALUES (?,?)', [username, hash], (err, result) => {
            console.log(err)
        })
    })

})

app.post('/login', (req, res) => {
    const username = req.body.user
    const password = req.body.pwd

    db.query('SELECT * FROM users WHERE username = ?;', [username], (err, result) => {
        if(err) {
            res.send({ err: err });
        }
        if(result.length > 0) {
            bcrypt.compare(password, result[0].password, (error, response) => {
                if(response) {
                    req.session.user = result
                    console.log(req.session.user)
                    res.send(result)
                } else {
                    res.send({ message: 'Wrong username/ password combination!' });
                }
            })
        } else {
            res.send({ message: 'User does not exist' })
        }
        }
    )
})

app.listen(port, () => {
    console.log(`running server on port ${port}`);
});