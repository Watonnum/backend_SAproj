const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId || "guest",
      ref: "users", // อ้างอิงไปยัง User model
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products", // อ้างอิงไปยัง Product model
          required: true,
        },
        productName: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        subtotal: {
          type: Number,
          required: false,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: false,
      default: 0,
    },
    totalItems: {
      type: Number,
      required: false,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "checkout", "abandoned"],
      default: "active",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    sessionId: {
      type: String, // สำหรับ guest users
      required: false,
    },
  },
  {
    timestamps: true, // จะสร้าง createdAt และ updatedAt อัตโนมัติ
  }
);

// Index สำหรับการค้นหาที่รวดเร็ว
cartSchema.index({ userId: 1 });
cartSchema.index({ sessionId: 1 });
cartSchema.index({ status: 1 });

module.exports = mongoose.model("Cart", cartSchema);
