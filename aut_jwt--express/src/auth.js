const jsonwebtoken = require("jsonwebtoken");

const MY_PRIVATE_KEY = 'Universidade2024';
const myUser = {
    name: 'Ewerton junio',
    email: 'ewertonjunior776@gmail.com'
}

function tokenValidated(
    request,
    response,
    next
) {
    const [, token] = (request.headers.authorization || '').split(' ');

    if (!token) return response.status(401).send('Acesso negado. Nenhum token fornecido.');

    try {
        const payload = jsonwebtoken.verify(token, MY_PRIVATE_KEY);
        const userIdFromToken = typeof payload !== 'string' && payload.user;

        if (!myUser && !userIdFromToken) {
            return response.status(401).json({ message: 'Token inválido' });
        }

        request.headers['user'] = payload.user;

        return next();
    } catch (error) {
        console.log(error);
        return response.status(401).json({ message: 'Token inválido' });
    }
}

module.exports = { MY_PRIVATE_KEY, myUser, tokenValidated };