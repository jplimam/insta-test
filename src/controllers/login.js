const knex = require('../connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { username, senha } = req.body;

    if (!username || !senha) {
        return res.status(404).json('Username and password required');
    }

    try {
        const user = await knex('usuarios').where({ username }).first();

        if (!user) {
            return res.status(404).json('User not found');
        }

        const correctPassword = await bcrypt.compare(senha, user.senha);

        if (!correctPassword) {
            return res.status(400).json("Email and password do not match")
        }

        const userTokenData = {
            id: user.id,
            username: user.username
        }

        const token = jwt.sign(userTokenData, process.env.JWT_PASS, { expiresIn: '8h' });

        const { senha: _, ...userData } = user;

        return res.status(200).json({
            user: userData,
            token
        });
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    login
}