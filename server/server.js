const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./models/User');
const GameModel = require('./models/Game');
const bcrypt = require('bcrypt-nodejs');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

let currentUser = "";
mongoose.connect(process.env.DATABASE_URL);

// Create New User

app.post('/login', (req, res) => {
    const {user, password} = req.body;
    UserModel.findOne({user: user})
    .then(user => {
        if (user) {
            const hashState = bcrypt.compareSync(password, user.hash);
            if (hashState) {
                currentUser = user;
                res.json("Login success");
            } else {
                res.status(400).json("Wrong password");
            }
        } else {
            res.status(400).json("Wrong username");
        }
    })
})

// Sign up a new account

app.post('/sign-up', (req, res) => {
    const {user, password, confirmPass} = req.body;

    if (password === confirmPass) {
        const hash = bcrypt.hashSync(password);
        UserModel.find({user: user})
        .then(player => {
            if (player.length === 0) {
                UserModel.create({user, hash})
                .then(user => res.json(user))
                .catch(err => res.json(err))
            } else {
                res.json("User already exist")
            }
        })
    } else {
        res.status(400).json('Password mismatch!');
    }
})

// Retrive game history of a user

app.get('/:user/games', (req, res) => {
    const user = req.params.user;
    GameModel.find({user: user})
    .then(gameHistory => {
        if (gameHistory.length === 0) {
            res.json("No game history");
        } else {
            res.json(gameHistory);
        }
    })
    .catch(err => console.log(err));
})

// Retrive a Game

app.get('/:user/:boardSize/:id', (req, res) => {
    const id = req.params.id;
    GameModel.findOne({_id: id})
    .then(game => res.json(game))
    .catch(err => console.log(err))
})

// Create New Game

app.post('/:user/:boardSize/newgame', (req, res) => {
    const boardSize = req.params.boardSize;
    const user = req.params.user;
    const {winner, board, currentPlayer} = req.body;
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = today.toLocaleDateString(undefined, options);
    GameModel.create({user, winner, boardSize, board, currentPlayer, date})
    .then(game => {
        res.json("Game Saved!");
    })
    .catch(err => console.log(err));
})

// Update Game

app.put('/:user/:boardSize/:id', (req, res) => {
    const id = req.params.id;

    const {winner, board, currentPlayer} = req.body;
    const filter = {_id: id};
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = today.toLocaleDateString(undefined, options);
    const update = {winner, board, currentPlayer, date};

    GameModel.updateOne(filter, update)
    .then(game => res.json(game))
    .catch(err => console.log(err))
})

// app.put('/maingame/:boardSize/game-log', (req, res) => {
//     let boardSize = req.params.boardSize;
//     const {_id, user, winner, board, currentPlayer} = req.body;
//     if (!_id) {
//         let date = new Date();
//         GameModel.create({user, winner, boardSize, board, currentPlayer, date})
//         .then(game => {
//             res.json("Auto saved");
//         })
//     } else {
//         const filter = {_id: _id};
//         let date = new Date();
//         const update = {user, winner, board, currentPlayer, date};
//         GameModel.updateOne(filter, update)
//         .then(game => res.json("Auto saved"))
//         .catch(err => res.json(err))
//     }
// })

app.listen(3001, () => {
    console.log('app is running on port 3001');
})