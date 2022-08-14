import mongoose from "mongoose";

const conection = {};

async function connect() {
  if (conection.isConnected) {
    console.log("conectado");
    return;
  }
  if (mongoose.connections.length > 0) {
    conection.isConnected = mongoose.connections[0].readyState;
    if (conection.isConnected === 1) {
      console.log("conexion previa");
      return;
    }
    await mongoose.disconnect();
  }
  const db = await mongoose.connect(process.env.MONGO_URI);
  console.log("new Conection");
  conection.isConnected = db.connections[0].readyState;
}

async function disconnect() {
  if (conection.isConnected) {
    if (process.env.NODE_ENV === "production") {
      await mongoose.disconnect();
      conection.isConnected = false;
    } else {
      console.log("no desconectado");
    }
  }
}

//no se pueden mostrar los productos desde la bdatos si no están convertidos en string
function convertDocToObject(doc) {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
}

const db = { connect, disconnect, convertDocToObject };
export default db;
