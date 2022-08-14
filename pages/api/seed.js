import Products from "../../models/Products";
import User from "../../models/User";
import { data } from "../data/data";
import db from "../data/db";

const handler = async (req, res) => {
  await db.connect();
  await User.deleteMany();

  //insertar ususarios en la base de datos
  await User.insertMany(data.users);
  await Products.deleteMany();

  //insertar productos en la base de datos
  await Products.insertMany(data.products);
  await db.disconnect();
  res.send({ messsage: "Creado con exito" });
};

export default handler;
