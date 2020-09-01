const express = require('express');
import router from express.Router();
const { check, validationResult } = require('express-validator');

router.post('/',[], (request, response) => {
    try {
        const {nome, senha} = request.body

    } catch (error) {
        
    }    
})
