const mongoose = require("mongoose")
const bcrypt = require('bcrypt');

const criptografarSenha = async (senha) => {
    const salt = await bcrypt.genSalt()
    senha = await bcrypt.hash(senha, salt)
    return senha
}

const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    senha:{
        type: String,
        required: true,
        select: false
    }
})
const User = mongoose.model('user',UserSchema)
module.exports = {User, criptografarSenha}