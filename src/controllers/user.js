const knex = require('../connection');
const bcrypt = require('bcrypt');

const signUp = async (req, res) => {
    const { username, senha } = req.body;

    if (!username) {
        return res.status(404).json("Username required");
    }

    if (!senha) {
        return res.status(404).json("Password required");
    }

    if (senha.length < 5) {
        return res.status(404).json("Password must contain at least 5 characters")
    }

    try {
        const userAmount = await knex('usuarios').where({ username }).first();

        if (userAmount) {
            return res.status(400).json("Username already exists");
        }

        const encryptedPassword = await bcrypt.hash(senha, 10);

        const user = await knex('usuarios').insert({
            username,
            senha: encryptedPassword
        });

        if (!user) {
            return res.status(400).json("User not registered");
        }

        return res.status(200).json("User successfully registered");
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const getProfile = async (req, res) => {
    return res.status(200).json(req.usuario);
}

const updateProfile = async (req, res) => {
    let {
        nome,
        email,
        senha,
        imagem,
        username,
        site,
        bio,
        telefone,
        genero
    } = req.body;

    const { id } = req.usuario;

    if (!nome && !email && !senha && !imagem && !username && !site && !bio && !telefone && !genero) {
        return res.status(404).json("Mandatory to inform at least one field for updating");
    }

    try {
        if (senha) {
            if (senha.length < 5) {
                return res.status(404).json("Password must contain at least 5 characters");
            }

            senha = await bcrypt.hash(senha, 10);
        }

        if (email !== req.usuario.email) {
            const userEmailExists = await knex('usuarios').where({ email }).first();

            if (userEmailExists) {
                return res.status(404).json("Email already exists");
            }
        }

        if (username !== req.usuario.username) {
            const userUsernameExists = await knex('usuarios').where({ username }).first();

            if (userUsernameExists) {
                return res.status(404).json('Username already exists');
            }
        }

        const userUpdate = await knex('usuarios')
            .where({ id })
            .update({
                nome,
                email,
                senha,
                imagem,
                username,
                site,
                bio,
                telefone,
                genero
            });

        if (!userUpdate) {
            return res.status(400).json("User has not been updated");
        }

        return res.status(200).json("User updated successfully");
    } catch (error) {
        return res.status(300).json(error.message);
    }
}

module.exports = {
    signUp,
    getProfile,
    updateProfile
}