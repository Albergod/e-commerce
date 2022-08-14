import mongoose from "mongoose";

const OrderModel = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [
      {
        nombre: { type: String, required: true },
        imagen: { type: String, required: true },
        precio: { type: Number, required: true },
        cantidad: { type: Number, required: true },
      },
    ],
    ShippingAdress: {
      nombreCompleto: { type: String, required: true },
      direccion: { type: String, required: true },
      ciudad: { type: String, required: true },
      codigoP: { type: String, required: true },
      pais: { type: String, required: true },
    },
    PaymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: { id: String, status: String, email_address: String },
    precioArticle: { type: Number, required: true },
    taxPrecio: { type: Number, required: true },
    precioCompra: { type: Number, required: true },
    totalPrecio: { type: Number, required: true },
    pago: { type: Boolean, required: true, default: false },
    isDelivered: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model("Order", OrderModel);
export default Order;
