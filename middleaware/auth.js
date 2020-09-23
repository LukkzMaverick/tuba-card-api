const jwt = require('jsonwebtoken')

module.exports = function (request, response, next) {
    const token = request.header('x-auth-token')
    if(!token){
        return response.status(401).json({errors: [{msg: "Token faltando, autorização negada!"}]})
    }
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if(error){
            return response.status(401).json({errors: [{msg: "Token inválido, autorização negada!"}]})
        }
        request.user = decoded.user
        next()
    })
}