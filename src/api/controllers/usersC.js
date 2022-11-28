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
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};

const read = async (req, res) => {
  try {
    const dbResponse = await db("users")
      .where({ isDeleted: false })
      .join("offices", "users.office_id", "=", "offices.id")
      .select("users.name", "users.email", "offices.description")
      .orderBy("users.id");

    return res.status(200).json(dbResponse);
  } catch (e) {
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};

const updateSelf = async (req, res) => {
  const user = req.user;
  const { name, email } = req.body;

  const dataToUpdate = {};

  try {
    if (name) {
      dataToUpdate.name = name;
    }

    if (email) {
      // validating email
      const dbResponse = await db("users")
        .where({ isDeleted: false, email })
        .andWhere("id", "!=", user.id)
        .first();

      if (dbResponse)
        return res
          .status(400)
          .json({ message: "E-mail não autorizado ou já existe." });

      if (email !== user.email) {
        dataToUpdate.email = email;
      }
    }

    if (!dataToUpdate.name && !dataToUpdate.email) {
      return res
        .status(400)
        .json({ message: "Sem dados para serem atualizados." });
    }

    await db("users")
      .update({ ...dataToUpdate })
      .where({ id: user.id });

    return res.status(204).end();
  } catch (e) {
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};

const updateSelfPass = async (req, res) => {
  const user = req.user;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigratórios." });
  }

  try {
    // validating old pass
    const { password } = await db("users")
      .where({ id: user.id, isDeleted: false })
      .first();

    const result = await bcrypt.compare(oldPassword, password);

    if (!result) {
      return res.status(400).json({ message: "Senha incorreta" });
    }

    const encryptedPass = await bcrypt.hash(newPassword, 10);

    await db("users")
      .update({ password: encryptedPass })
      .where({ id: user.id });

    return res.status(204).end();
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};

module.exports = {
  create,
  read,
  updateSelf,
  updateSelfPass,
};
