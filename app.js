const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const user = require('./routes/user')
const http = require('http');
const session = require('express-session');
const app = express();
const {authUser, authRole} = require('./auth.js')
const mysql = require('mysql');
const {json} = require('express');



//connecting to database
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nodejs",
    connectionLimit: 10
});


global.db = connection;

connection.connect((error)=>{
    if(error){
        console.log(error);
    }
    else{
        console.log("MYSQL is connected")
    }
});

app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}));
app.set('views',path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(session({
    secret:'Christina Shrestha',
    resave: false,
    saveUninitialized:true,
    cookie:{maxAge: 60000}
}));

//LOGIN Users

app.get('/', routes.index);//call for main index page
app.get('/signup', user.signup);//call for signup page
app.post('/signup', user.signup);//call for signup post 
app.get('/login', routes.index);//call for login page
app.post('/login', user.login);//call for login post
app.get('/dashboard/logout', user.logout);//call for logout

// app.get('/dashboard', (req, res)=>{
//     res.render('login', {
//         title : 'Login for Users'
//     });
// });


app.get('/dashboard', (req, res) => {
    
    let sql = "SELECT * FROM users";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('index', {
            title : 'Dashboard for Users',
            users : rows
        });
    });
});

app.get('/add', (req,res)=>{
    res.render('user_add',{
        title:'Adding User to the Database'
    });
});
//ADD
app.post('/save', (req,res)=>{
    let data = {name:req.body.name, email:req.body.email, contact: req.body.contact, role:req.body.role};
    let sql = "INSERT INTO users SET ?";
    let query = connection.query(sql,data,(err,results)=>{
        if(err) throw err;
        res.redirect('/');
    });
});

//EDIT 
app.get('/edit/:userId',(req,res)=>{
    const userId = req.params.userId;
    let sql = `SELECT * FROM users where id = ${userId}`;
    let query = connection.query(sql, (err, result)=>{
        if(err) throw err;
        res.render('user_edit',{
            title : 'Dashboard for Users',
            user : result[0]
        });
    });
});

//UPDATE
app.post('/update',(req, res) => {
    const userId = req.body.id;
    let sql = "UPDATE users SET name='"+req.body.name+"',  email='"+req.body.email+"',  contact='"+req.body.contact+"', role='"+req.body.role+"' where id ="+userId;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

//DELETE

app.get('/delete/:userId', (req, res)=>{
    const userId = req.params.userId;
    let sql = `DELETE from users WHERE id = ${userId}`;
    let query = connection.query(sql,(err,result)=>{
        if(err) throw err;
        res.redirect('/');
    })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, function(){
    console.log(`Server started on port ${PORT}`)
});


