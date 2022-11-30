const db = require("../../database/db_connection");

const create = async (req, res) => {
  const { name, orderDate, orderFrequency, deliveryDate, extraInfos } =
    req.body;

  try {
    // validating if this provider exists
    const dbResponse = await db("providers").where({ isDeleted: false, name });

    if (dbResponse.length !== 0) {
      return res.status(400).json({ message: "Esse fornecedor já existe." });
    }

    const newProvider = {
      name,
      orderDate,
      orderFrequency,
      deliveryDate,
      extraInfos,
    };

    await db("providers")
      .insert({ ...newProvider })
      .returning("*");

    return res.status(201).end();
  } catch (e) {
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};

const read = async (req, res) => {
  try {
    const dbResponse = await db("providers")
      .where({ isDeleted: false })
      .orderBy("id");

    return res.status(200).json(dbResponse);
  } catch (e) {
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};

const readOne = async (req, res) => {
  const { id } = req.params;

  try {
    const dbResponse = await db("providers")
      .where({ isDeleted: false, id: Number(id) })
      .first();

    if (!dbResponse) {
      return res.status(404).json({ message: "Fornecedor não encontrado." });
    }

    return res.status(200).json(dbResponse);
  } catch (e) {
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};

const update = async (req, res) => {
  const { name, orderDate, orderFrequency, deliveryDate, extraInfos } =
    req.body;
  const { id } = req.params;

  const dataToUpdate = {};

  try {
    // validating ID
    let dbResponse = await db("providers")
      .where({ isDeleted: false, id: Number(id) })
      .first();

    if (!dbResponse) {
      return res.status(404).json({ message: "Fornecedor não encontrado." });
    }

    // adding data to update

    if (name) {
      // validate name
      dbResponse = await db("providers")
        .where("id", "!=", Number(id))
        .andWhere({ isDeleted: false, name })
        .first();

      if (dbResponse) {
        return res
          .status(400)
          .json({ message: "Já existe outro fornecedor com este nome." });
      }

      if (dbResponse.name !== name) {
        dataToUpdate.name = name;
      }
    }

    if (orderDate) {
      dataToUpdate.orderDate = orderDate;
    }

    if (orderFrequency) {
      dataToUpdate.orderFrequency = orderFrequency;
    }

    if (deliveryDate) {
      dataToUpdate.deliveryDate = deliveryDate;
    }

    if (extraInfos) {
      dataToUpdate.extraInfos = extraInfos;
    }

    await db("providers")
      .update({ ...dataToUpdate })
      .where({ id });

    return res.status(204).end();
  } catch (e) {
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};

const del = async (req, res) => {
  const { user } = req;
  const { id: idToDel } = req.params;

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
    dbResponse = await db("providers")
      .where({ isDeleted: false, id: idToDel })
      .first();

    if (!dbResponse) {
      return res.status(404).json({ message: "Fornecedor não encontrado." });
    }

    await db("providers").update({ isDeleted: true }).where({ id: idToDel });

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
