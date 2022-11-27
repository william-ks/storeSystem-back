const db = require("../../database/db_connection");
const bcrypt = require("bcrypt");

const create = async (req, res) => {
  const { name, email, office_id } = req.body;

  try {
    // validating if exists other account with same email
    const dbResponse = await db("users").where({ email, isDeleted: false });

    if (dbResponse.length > 0) {
      return res.status(400).json({ message: "Esse usuário ja existe." });
    }

    if (office_id > 3 || office_id <= 0) {
      return res.status(400).json({ message: "Cargo inválido" });
    }

    // default password of any new user
    const encryptedPass = await bcrypt.hash(process.env.DEFAULT_PASS, 10);

    const newUser = {
      name,
      email,
      office_id,
      password: encryptedPass,
    };

    await db("users").insert({ ...newUser });

    return res.status(201).end();
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};

module.exports = {
  create,
};
