require('dotenv').config();
const express = require('express');
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = process.env;

const {
    createUser,
    getUserByUserName, 
    getUser,    
    getPublicRoutinesByUser
} = require("../db/")

const { requireUser } = require("./utils");

usersRouter.post('/register', async (req, res, next) => {
    const {username, password} = req.body
    try {
        if (password.length < 8) {
            next({message: "Password must be at least 8 characters"})
            return
        }

        const userExists = await getUserByUserName(username)

        if (userExists) {
            next({message: "User already exists"})
            return
        }

        const user = await createUser(req.body)
        const token = jwt.sign({
            id: user.id,
            username: user.username
        }, JWT_SECRET)

        res.send({user, token})
    } catch ({name, message}) {
        next({name, message})
    }
})

usersRouter.post('/login', async (req, res, next) => {
    const {username, password} = req.body

    if (!username || !password) {
        next({message: "Username and Password are required"})
        return
    }

    try {
        const user = await getUser({username, password})

        if (user) {
            const token = jwt.sign({
                id: user.id,
                username: user.username
            }, JWT_SECRET)

            res.send({message: "You are logged in!", token})
            return
        } else {
            next({message: "The Username or Password were not correct"})
            return
        }

    } catch ({name, message}) {
        next({name, message})
    }
})

usersRouter.get('/me', requireUser, async (req, res, next) => {
    try {
        res.send(req.user)
    } catch (error) {
        next(error)
    }
})

usersRouter.get("/:username/routines", async (req, res, next) => {
    const {username} = req.params;
    try {
        const routines = await getPublicRoutinesByUser({username})
        res.send(routines)
    } catch ({name, message}) {
        next({name, message})
    }
})

module.exports = usersRouter
