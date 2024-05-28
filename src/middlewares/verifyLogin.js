const knex = require('../connection');
const jwt = require('jsonwebtoken');

const verifyLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json('Unauthorized');
    }

    try {
        const token = authorization.replace('Bearer', '').trim();

        const { id } = jwt.verify(token, process.env.JWT_PASS);

        const userExists = await knex('usuarios').where({ id }).first();

        if (!userExists) {
            return res.status(404).json('Invalid token');
        }

        const { senha, ...usuario } = userExists;

        req.usuario = usuario;

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = verifyLogin;