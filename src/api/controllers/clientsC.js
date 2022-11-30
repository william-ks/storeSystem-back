const db = require("../../database/db_connection");

const create = async (req, res) => {
  const { name, cpf, email, credit } = req.body;

  if (!email && !email) {
    return res.status(400).json({ message: "O e-mail ou cpf é obrigátorio." });
  }

  try {
    const newClient = { name, cpf, email, credit };
    // validating cpf
    if (cpf) {
      const dbResponse = await db("clients")
        .where({ cpf, isDeleted: false })
        .first();

      if (dbResponse) {
        return res
          .status(400)
          .json({ message: "Esse cpf já existe no nosso banco de dados" });
      }
    }
    // validating email
    if (email) {
      const dbResponse = await db("clients")
        .where({ email, isDeleted: false })
        .first();

      if (dbResponse) {
        return res
          .status(400)
          .json({ message: "Esse e-mail já existe no nosso banco de dados" });
      }
    }

    // creating
    await db("clients").insert({ ...newClient });

    return res.status(201).end();
  } catch (e) {
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};

const read = async (req, res) => {
  try {
    const dbResponse = await db("clients")
      .where({ isDeleted: false })
      .orderBy("id");

    return res.status(200).json(dbResponse);
  } catch (e) {
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};

const readOne = async (req, res) => {
  const { id } = req.params;

  if (!Number(id)) {
    return res.status(400).json({ message: "O id inserido é inválido" });
  }

  try {
    const dbResponse = await db("clients")
      .where({ isDeleted: false, id })
      .first();

    if (!dbResponse) {
      return res.status(404).json({
        message: "O cliente buscado não existe ou não foi encontrado.",
      });
    }

    return res.status(200).json(dbResponse);
  } catch (e) {
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};

const update = async (req, res) => {
  const { name, cpf, email, credit } = req.body;
  const { id: idToUpdate } = req.params;

  if (!Number(idToUpdate)) {
    return res.status(400).json({ message: "O id inserido é inválido" });
  }

  if (!name && !cpf && !email && credit < 0) {
    return res.status(400).json({ message: "Sem dados a serem atualizados." });
  }

  const dataToUpdate = {};

  try {
    if (name) {
      dataToUpdate.name = name;
    }
    if (cpf) {
      const dbResponse = await db("clients")
        .where({ cpf, isDeleted: false })
        .andWhere("id", "!=", idToUpdate)
        .first();

      if (dbResponse) {
        return res
          .status(400)
          .json({ message: "Esse cpf já existe no nosso banco de dados" });
      }
      dataToUpdate.cpf = cpf;
    }
    if (email) {
      const dbResponse = await db("clients")
        .where({ email, isDeleted: false })
        .andWhere("id", "!=", idToUpdate)
        .first();

      if (dbResponse) {
        return res
          .status(400)
          .json({ message: "Esse e-mail já existe no nosso banco de dados" });
      }
      dataToUpdate.email = email;
    }
    if (credit <= 0 || credit) {
      if (credit <= 0) {
        dataToUpdate.credit = 0;
      } else {
        dataToUpdate.credit = credit;
      }
    }

    // updating
    await db("clients")
      .update({ ...dataToUpdate })
      .where({ id: idToUpdate });

    return res.status(201).end();
  } catch (e) {
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};

const del = async (req, res) => {
  const { user } = req;
  const { id: idToDel } = req.params;

    if (!Number(idToDel)) {
      return res.status(400).json({ message: "O id inserido é inválido" });
    }

  try {
    // validating hierarchy
    let dbResponse = await db("users")
      .where("users.isDeleted", "=", false)
      .andWhere("users.id", "=", user.id)
      .join("offices", "offices.id", "=", "users.office_id")
      .first();

    if (dbResponse.level > 2) {
      return res
        .status(401)
        .json({ message: "Você não tem autorização para isso." });
    }

    // validating id
    dbResponse = await db("clients")
      .where({ isDeleted: false, id: idToDel })
      .first();

    if (!dbResponse) {
      return res.status(404).json({ message: "cliente não encontrado." });
    }

    // deleting
    await db("clients").update({ isDeleted: true }).where({ id: idToDel });

    return res.status(204).end();
  } catch (e) {
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};

module.exports = {
  create,
  read,
  readOne,
  update,
  del,
};
