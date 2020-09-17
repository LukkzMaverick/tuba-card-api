const express = require('express');
const router = express.Router()
const Jogo = require('../../modules/jogo');
const mongoose = require("mongoose")
const { check, validationResult } = require('express-validator');
const auth = require('../../middleaware/auth')

const jogoValidatorPost = [
    check('nomeJogo','nomeJogo é um campo obrigatório').notEmpty(),
    check('nomeJogo','nomeJogo precisa ser uma string').isString(),
    check('propriedades','propriedades é um campo obrigatório').notEmpty(),
    check('propriedades','propriedades precisa ser um array').isArray(),
]
const checkId = [
    check('_id','Id em formato inválido.').isMongoId()
]

router.post('/',auth, jogoValidatorPost,async (request, response) => {
    let erros = []
    try {
        const errors = validationResult(request)
        if(!errors.isEmpty()){
            return response.status(400).json({errors: errors.array()})
        }
        const {nomeJogo, propriedades, userId} = request.body;
        const jogo = new Jogo({nomeJogo, propriedades, userId})
        await jogo.save()
        if(jogo.id){
            response.status(201).send(jogo)
        }else{
            erros.push({msg: "Erro no banco de dados ao inserir o jogo. Tente novamente mais tarde!"})
            return response.status(500).send({errors: erros})
        }
    } catch (error) {
        console.error(error)
        erros.push({msg: "Internal Server Error"})
        return response.status(500).send({errors: erros})
    }
})
router.get('/:userId',auth,async (request, response) => {
    let erros = []
    try {
        const errors = validationResult(request)

        if(!errors.isEmpty()){
            return response.status(400).json({errors: errors.array()})
        }
        const userId = request.params.userId
        const jogos = await Jogo.find({userId: userId}) 
        if(jogos){
            return response.send(jogos)
        }
        erros.push({msg: "Lista de jogos vazia."})
        return response.status(404).send({errors: erros})
        
    } catch (error) {
        console.error(error)
        erros.push({msg: "Internal Server Error"})
        return response.status(500).send({errors: erros})
    }
})
router.put('/:jogoId',auth,jogoValidatorPost,async (request, response) => {
    let erros = []
    try {
        const errors = validationResult(request)
        if(!errors.isEmpty()){
            return response.status(400).json({errors: errors.array()})
        }
        const id = request.params.jogoId
        const {nomeJogo, propriedades} = request.body
        const update = {nomeJogo, propriedades}
        const jogo = await Jogo.findByIdAndUpdate(id,update, {new: true})

        if(jogo){
            return response.status(202).send(jogo)
        }
        erros.push({msg: "Jogo não existe, id inválido", param: '_id'})
        return response.status(404).send({errors: erros})
        
    } catch (error) {
        console.error(error)
        erros.push({msg: "Internal Server Error"})
        return response.status(500).send({errors: erros})
    }
})
router.patch('/:jogoId', auth, async (request, response) =>{
    let erros = []
    try {
        const errors = validationResult(request)
        if(!errors.isEmpty()){
            return response.status(400).json({errors: errors.array()})
        }

        const id = request.params.jogoId
        const bodyRequest = request.body
        const jogo = await Jogo.findByIdAndUpdate(id, {$set: bodyRequest}, {new: true})
        if(jogo){
            return response.status(202).send(jogo)
        }

        erros.push({msg: "Jogo não existe, id inválido", param: '_id'})
        return response.status(404).send({errors: erros})

    } catch (error) {
        console.error(error)
        erros.push({msg: "Internal Server Error"})
        return response.status(500).send({errors: erros})
    }
})
router.delete('/:jogoId',auth,async (request, response) => {
    let erros = []
    try {
        const errors = validationResult(request)
        if(!errors.isEmpty()){
            return response.status(400).json({errors: errors.array()})
        }
        const id = request.params.jogoId
        const jogo = await Jogo.findByIdAndDelete(id)

        if(jogo){
            return response.status(200).send(jogo)
        }
        erros.push({msg: "Id Inválido, jogo não encontrado!", param: '_id'})
        return response.status(404).send({errors: erros})
    
    }catch(error ){
        console.error(error)
        erros.push({msg: "Internal Server Error"})
        return response.status(500).send({errors: erros})
    } 
})

module.exports = router;