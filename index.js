const express=require('express');
const jwt=require('jsonwebtoken');
const app = express();
const port = 3000;
const path = require('path');
app.use(express.json());
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

let users = [];

app.use(express.static(path.join(__dirname, 'public')));

app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/public/index.html");
})

function authMiddleware(req,res,next){
    const token=req.headers.token;
    if(!token){
        return res.status(401).json({
            message: 'Unauthorized access'
        })
    }
    try{
        const decoded=jwt.verify(token,JWT_SECRET);
        req.username = decoded.username; // Attach user info to request object
        next();
    }
    catch(error){
        return res.status(403).json({
            message: 'Invalid token'
        })
    }
}

app.post('/signup',(req,res)=>{
    const {username,password}=req.body;
    const existingUser=users.find(user=>user.username===username);
    if(existingUser){
        res.status(409).json({
            message: 'Username already exists'
        });
    }
    else{
        users.push({
            username:username,
            password:password
        });
        res.status(201).json({
            message: 'User created successfully'
        });
    }
    console.log(users);
})

app.post('/signin',(req,res)=>{
    const {username,password}=req.body;
    const foundUser=users.find(user=>user.username===username && user.password===password);
    if(foundUser){
        const token=jwt.sign({
            username:username
        },JWT_SECRET);
        // res.setHeader("token",token); 
        res.status(201).json({
            message: 'User logged in successfully',
            token:token
        });
    }
    else{
        res.status(401).json({
            message: 'Invalid username or password'
        });
    }
    console.log(users);
})


app.get('/profile', authMiddleware ,(req,res)=>{
    res.json({
        username: req.username,
        message: 'Profile fetched successfully'
    });
})
app.listen(port);