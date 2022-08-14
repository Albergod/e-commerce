import Products from "../../../models/Products";
import db from "../../data/db";

const Handler = async (req, res) => {
  await db.connect();
  const product = await Products.findById(req.query.id);
  await db.disconnect();

  res.send(product);
};
export default Handler;
