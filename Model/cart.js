const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    userId: {
      type: String, // เปลี่ยนเป็น String เพื่อรองรับทั้ง ObjectId และ "guest"
      required: true,
      default: "guest",
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products", // ตรวจสอบว่า Product model ใช้ชื่อ "products" หรือ "Product"
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
          required: true, // เปลี่ยนเป็น required: true
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true, // เปลี่ยนเป็น required: true
      default: 0,
    },
    totalItems: {
      type: Number,
      required: true, // เปลี่ยนเป็น required: true
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

// Pre-save middleware เพื่ออัพเดท updatedAt
cartSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
