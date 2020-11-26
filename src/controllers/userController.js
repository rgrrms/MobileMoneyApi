import db from "../models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv-safe';
dotenv.config()

const Users = db.users;

const createUser = async (req, res) => {
  try {
    const { name, pass, cpf } = req.body;

    const user = new Users({
      name,
      pass: encryptPass(pass),
      cpf
    })

    await user.save();
    res.send({ message: "Usuário criado com sucesso!" })
  } catch (e) {
    res.status(500).send({ message: "Algum erro ocorreu ao criar o usuário! " + e });
  }
}

const login = async (req, res) => {
  const { cpf, pass } = req.body;

  try {
    const user = await Users.findOne({ cpf });
    if (user) {
      if (bcrypt.compareSync(pass, user.pass)) {
        const cpfToken = user.cpf;
        const token = jwt.sign({ cpfToken }, process.env.SECRET_TOKEN, { expiresIn: 3600 });
        return res.json({ auth: true, token: token });
      } else {
        res.status(401).send({ message: "Senha incorreta!" });
      }
    } else {
      res.status(401).send({ message: "Login inválido!" });
    }

  } catch (e) {
    res.status(500).send({ message: "Erro ao fazer login! " + e });
  }
}

const logout = async (req, res) => {
  res.json({ auth: false, token: null });
}

const verifyJWT = async (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });

  jwt.verify(token, process.env.SECRET_TOKEN, function(err, decoded) {
    if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });

    // se tudo estiver ok, salva no request para uso posterior
    req.userCpf = decoded.cpfToken;
    next();
  });
}

function encryptPass(pass) {
  const salt = bcrypt.genSaltSync(Number(process.env.SALT));
  const hash = bcrypt.hashSync(pass, salt);
  console.log(hash)
  return hash;
};

export default {
  login,
  logout,
  verifyJWT,
  createUser
};
