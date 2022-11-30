const db = require("../../database/db_connection");

const create = async (req, res) => {
  const { value, provider_id, dueDate, isPaid } = req.body;
  const newTicket = { value, provider_id, dueDate };

  if (isPaid === true) {
    newTicket.isPaid = isPaid;
  }

  try {
    await db("tickets").insert({ ...newTicket });

    return res.status(201).end();
  } catch (e) {
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};

const read = async (req, res) => {
  try {
    const dbResponse = await db("tickets")
      .where("tickets.isDeleted", "=", false)
      .leftJoin("providers", "tickets.provider_id", "=", "providers.id")
      .select(
        "tickets.id",
        "tickets.value",
        "tickets.provider_id",
        "providers.name as provider_name",
        "tickets.dueDate",
        "tickets.isPaid"
      )
      .orderBy("tickets.id");

    return res.status(200).json(dbResponse);
  } catch (e) {
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};

const readOne = async (req, res) => {
  const { id } = req.params;

  if (!Number(id)) {
    return res.status(400).json({ message: "Parâmetro inválido." });
  }

  try {
    const dbResponse = await db("tickets")
      .where("tickets.isDeleted", "=", false)
      .andWhere("tickets.id", "=", id)
      .leftJoin("providers", "tickets.provider_id", "=", "providers.id")
      .select(
        "tickets.id",
        "tickets.value",
        "tickets.provider_id",
        "providers.name as provider_name",
        "tickets.dueDate",
        "tickets.isPaid"
      )
      .first();

    if (!dbResponse) {
      return res
        .status(404)
        .json({ message: "O boleto procurado não foi encontrado." });
    }

    return res.status(200).json(dbResponse);
  } catch (e) {
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};

const update = async (req, res) => {
  const { value, provider_id, dueDate, isPaid } = req.body;

  const { id: idToUpdate } = req.params;
  if (!Number(idToUpdate)) {
    return res.status(400).json({ message: "Parâmetro inválido." });
  }

  if (!value && !provider_id && !dueDate && !isPaid) {
    return res
      .status(400)
      .json({ message: "Precisa de dados para serem atualizados." });
  }

  const dataToUpdate = {};

  try {
    //validating id to update
    const dbResponse = await db("tickets")
      .where({
        isDeleted: false,
        id: idToUpdate,
      })
      .first();

    if (!dbResponse) {
      return res
        .status(404)
        .json({ message: "Boleto procurado não foi encontrado." });
    }

    // adding data to update
    if (value) {
      dataToUpdate.value = value;
    }

    if (provider_id) {
      dataToUpdate.provider_id = provider_id;
    }

    if (dueDate) {
      dataToUpdate.dueDate = dueDate;
    }

    if (isPaid) {
      dataToUpdate.isPaid = isPaid;
    }

    // updating
    await db("tickets")
      .update({ ...dataToUpdate })
      .where({ id: idToUpdate });

    return res.status(204).end();
  } catch (e) {
    console.log(e);
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
    dbResponse = await db("tickets")
      .where({ isDeleted: false, id: idToDel })
      .first();

    if (!dbResponse) {
      return res.status(404).json({ message: "Boleto não encontrado." });
    }

    // deleting
    await db("tickets").update({ isDeleted: true }).where({ id: idToDel });

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
