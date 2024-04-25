const express = require("express");
const jsonwebtoken = require("jsonwebtoken");
const { myUser, MY_PRIVATE_KEY, tokenValidated } = require("./auth.js");

const api = express();
api.use(express.json());

api.get('/', (_, res) => res.status(200).json({
    message: 'Esta é uma rota PÚBLICA...'
}));

api.get('/login', (req, res) => {
    const [, hash] = req.headers.authorization ? req.headers.authorization.split(' ') || [' ', ' '] : [' ', ' '];
    const [email, password] = Buffer.from(hash, 'base64').toString().split(':');

    try {
        const correctPassword = email === 'ewertonjunior776@gmail.com' && password === '102030';

        if (!correctPassword) return res.status(401).send('Senha ou E-mail incorretos!');

        const token = jsonwebtoken.sign({ user: JSON.stringify(myUser) },
            MY_PRIVATE_KEY, { expiresIn: '60m' }
        );

        return res.status(200).json({ data: { user: myUser, token } });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Erro interno no servidor');
    }
});

api.use('*', tokenValidated);

api.get('/private', (req, res) => {
    const { user } = req.headers
    const currentUser = JSON.parse(user);
    return res.status(200).json({
        message: 'Esta é uma rota PRIVADA...',
        data: {
            userLogged: currentUser
        }
    })
});

api.listen(3333, () => console.log('Servidor rodando...'));


/// GET http://localhost:3333/

// GET http: //localhost:3333/login
// Authorization: Basic ewertonjunior776@gmail.com: 102030

// GET http: //localhost:3333/private
// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoie1wibmFtZVwiOlwiRXdlcnRvbiBqdW5pb1wiLFwiZW1haWxcIjpcImV3ZXJ0b25qdW5pb3I3NzZAZ21haWwuY29tXCJ9IiwiaWF0IjoxNzE0MDY5MDg2LCJleHAiOjE3MTQwNzI2ODZ9.d0arRN8wK8fxX9UMqcfJJuWkLcsMNiaZdkd06s7IE4MM