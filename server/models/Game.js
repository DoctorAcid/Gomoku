const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    user: String,
    winner: String,
    boardSize: Number,
    board: Array,
    currentPlayer: String,
    date: String
})

const GameModel = mongoose.model("games", GameSchema);

module.exports = GameModel;