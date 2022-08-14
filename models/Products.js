import mongoose from "mongoose";

const ProductModel = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    categoria: { type: String, required: true },
    imagen: { type: String, required: true },
    precio: { type: Number, required: true },
    marca: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    numVistas: { type: Number, required: true, default: 0 },
    cantidadEnVenta: { type: Number, required: true, default: 0 },
    descripcion: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Products =
  mongoose.models.Product || mongoose.model("Product", ProductModel);
export default Products;
