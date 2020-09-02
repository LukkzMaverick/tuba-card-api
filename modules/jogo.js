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
        ref: 'user'
    }
})

JogoSchema.path('propriedades').validate(function (value) {
    if (value.length > 5 || value.length < 2) {
      throw new Error("The size of properties need to be between 2 and 5");
    }
});

module.exports = mongoose.model('jogo', JogoSchema)