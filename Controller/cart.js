const Cart = require("../Model/cart");
const Product = require("../Model/product");

// เพิ่มสินค้าเข้าตระกร้า
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, userId = "guest" } = req.body;

    // ตรวจสอบสินค้าว่ามีอยู่หรือไม่
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "ไม่พบสินค้า" });
    }

    // ตรวจสอบ stock
    if (product.stock < quantity) {
      return res.status(400).json({ message: "สินค้าไม่เพียงพอ" });
    }

    // ค้นหาตระกร้าของผู้ใช้
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // สร้างตระกร้าใหม่
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            quantity,
            price: product.price,
          },
        ],
        total: product.price * quantity,
      });
    } else {
      // ตรวจสอบว่าสินค้านี้มีในตระกร้าแล้วหรือไม่
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        // อัพเดทจำนวน
        existingItem.quantity += quantity;
      } else {
        // เพิ่มสินค้าใหม่
        cart.items.push({
          productId,
          quantity,
          price: product.price,
        });
      }

      // คำนวณราคารวมใหม่
      cart.total = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    }

    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json({
      message: "เพิ่มสินค้าเข้าตระกร้าแล้ว",
      cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Cart ADD error" });
  }
};

// ดูตระกร้าสินค้า
exports.getCart = async (req, res) => {
  try {
    const userId = req.params.userId || "guest";

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(200).json({
        cart: { items: [], total: 0 },
      });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Cart GET error" });
  }
};

// อัพเดทจำนวนสินค้าในตระกร้า
exports.updateCartItem = async (req, res) => {
  try {
    const { userId = "guest", productId, quantity } = req.body;

    if (quantity <= 0) {
      return exports.removeFromCart(req, res);
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "ไม่พบตระกร้า" });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "ไม่พบสินค้าในตระกร้า" });
    }

    // ตรวจสอบ stock
    const product = await Product.findById(productId);
    if (product.stock < quantity) {
      return res.status(400).json({ message: "สินค้าไม่เพียงพอ" });
    }

    item.quantity = quantity;
    cart.total = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json({
      message: "อัพเดทตระกร้าแล้ว",
      cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Cart UPDATE error" });
  }
};

// ลบสินค้าออกจากตระกร้า
exports.removeFromCart = async (req, res) => {
  try {
    const { userId = "guest", productId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "ไม่พบตระกร้า" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    cart.total = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json({
      message: "ลบสินค้าออกจากตระกร้าแล้ว",
      cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Cart REMOVE error" });
  }
};

// ล้างตระกร้า
exports.clearCart = async (req, res) => {
  try {
    const userId = req.params.userId || "guest";

    await Cart.findOneAndDelete({ userId });

    res.status(200).json({
      message: "ล้างตระกร้าแล้ว",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Cart CLEAR error" });
  }
};
