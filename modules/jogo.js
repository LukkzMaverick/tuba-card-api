const mongoose = require("mongoose")
const JogoSchema = new mongoose.Schema({
    nomeJogo:{
        type: String,
        required: true
    },
    propriedades:{
        type: Array,
        required: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
})

JogoSchema.path('propriedades').validate(function (value) {
    if (value.length > 5 || value.length < 2) {
      throw new Error("O tamanho de propriedades precisa ser um valor entre 2 e 5");
    }
});

module.exports = mongoose.model('jogo2', JogoSchema)