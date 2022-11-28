const db = require("../../database/db_connection");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.includes("Bearer")) {
    return res.status(400).json({
      message: "Token é obrigatório para acessar essa funcionalidade.",
    });
  }

  const token = authorization.split(" ")[1];

  try {
    const { id } = jwt.verify(token, process.env.JWT_PASS);

    const { password, isDeleted, office_id, ...user } = await db("users")
      .join("offices", "users.office_id", "=", "offices.id")
      .where("users.id", "=", id)
      .andWhere("users.isDeleted", "=", false)
      .first();

    req.user = user;
    next();
  } catch (e) {
    return res.status(400).json({ message: "Token inválido." });
  }
};

module.exports = auth;
