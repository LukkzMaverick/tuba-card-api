const { User, criptografarSenha } = require('../../modules/user');
const express = require('express');
const bcrypt = require('bcrypt')
const router = express.Router()
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const userPostValidator = [
    check('email','Email inserido não é válido.').isEmail(),
    check('senha','Insira uma senha com 6 ou mais caracteres.').isLength({min: 6})
]

router.post('/register', userPostValidator, async (request, response) => {
    try {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() })
        }

        let {email, senha} = request.body
        senha = await criptografarSenha(senha)
        const usuario = new User({email, senha})
        await usuario.save()
        if(usuario.id){
            return response.status(201).json(usuario)
        }
        return response.status(500).send({errors: [{msg: "Erro ao gravar informações no banco de dados. Tente novamente mais tarde."}]})
    } catch (error) {
        console.error(error.message)
        return response.status(500).send({errors: [{msg: "Internal Server Error"}]})
    }
})

router.post('/login', userPostValidator, async (request, response) => {
    try {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() })
        }

        let {email, senha} = request.body
        const user = await User.findOne({email}).select('_id senha')
        if(!user){
            return response.status(404).json({errors: [{msg: 'Usuário não existe!'}]})
        }
        const isMatch = await bcrypt.compare(senha, user.senha)

        if(!isMatch){
            return response.status(400).json({errors: [{msg: 'Senha incorreta'}]})
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '3 days'}, (error, token) => {
            if(error) throw error
            response.json({token, ...payload})
        })
        
    } catch (error) {
        console.error(error.message)
        return response.status(500).send({errors: [{msg: "Internal Server Error"}]})
    }
})

module.exports = router