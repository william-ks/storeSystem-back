const db = require("../../database/db_connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password: userPass } = req.body;

  try {
    // validate email
    let dbResponse = await db("users").where({ email, isDeleted: false });

    if (dbResponse.length < 1) {
      return res.status(400).json({
        messages: "E-mail ou senha incorretos.",
      });
    }

    // validate pass
    const validPass = await bcrypt.compare(userPass, dbResponse[0].password);

    if (!validPass) {
      return res.status(400).json({
        messages: "E-mail ou senha incorretos.",
      });
    }

    // generate token
    const token = jwt.sign(
      { id: dbResponse[0].id, office: dbResponse[0].office },
      process.env.JWT_PASS,
      // {
      //   expiresIn: "8h",
      // }
    );

    // response
    const response = {
      name: dbResponse[0].name,
      email: dbResponse[0].email,
      office: dbResponse[0].office,
      token,
    };

    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json("Erro interno no servidor");
  }
};

module.exports = login;
