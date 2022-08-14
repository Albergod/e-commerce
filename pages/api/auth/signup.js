import bcryptjs from "bcryptjs";
import User from "../../../models/User";
import db from "../../data/db";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }
  const { name, email, password } = req.body;

  if (
    !name ||
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 5
  ) {
    res.status(422).json({ message: "error de validación" });
    return;
  }
  //si no hay error de validacion, se conecta  a la base de datos
  await db.connect();
  const userExist = await User.findOne({ email: email });
  //si existe el usuario, tirar error

  if (userExist) {
    res.status(422).json({ message: "Éste usuario ya está registrado." });
    await db.disconnect();
    return;
  }

  const newUser = new User({
    name,
    email,
    password: bcryptjs.hashSync(password),
    isAdmin: false,
  });

  const user = await newUser.save();
  await db.disconnect();

  res.status(201).send({
    message: "Usuario creado",
    _id: user._id,
    name: user.name,
    email: user.email,
    password: user.password,
    isAdmin: user.isAdmin,
  });
}

export default handler;
