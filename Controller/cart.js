const Cart = require("../Model/cart");
const Product = require("../Model/products");

// เพิ่มสินค้าเข้าตระกร้า
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, userId = "guest" } = req.body; // เปลี่ยน default userId เป็น "guest"
    console.log(
      "productId : " + productId + "\n",
      "qty : " + quantity + "\n",
      "userId : " + userId + "\n\n\n"
    );

    // ตรวจสอบว่ามี productId หรือไม่
    if (!productId) {
      return res.status(400).json({ message: "ไม่พบ Product ID" });
    }

    // ตรวจสอบสินค้าว่ามีอยู่หรือไม่
    const product = await Product.findById(productId);
    console.log("Product : " + product);
    if (!product) {
      return res.status(404).json({ message: "ไม่พบสินค้า" });
    }

    // ตรวจสอบ stock (ใช้ inStock แทน stock)
    if (product.inStock < quantity) {
      return res.status(400).json({ message: "สินค้าไม่เพียงพอ" });
    }

    // ค้นหาตระกร้าของผู้ใช้
    let cart = await Cart.findOne({ userId });
    console.log("\n\n\n\n" + cart);

    if (!cart) {
      // สร้างตระกร้าใหม่
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            productName: product.name,
            price: product.price,
            quantity,
            subtotal: product.price * quantity,
          },
        ],
        totalAmount: product.price * quantity,
        totalItems: quantity,
      });
    } else {
      // ตรวจสอบว่าสินค้านี้มีในตระกร้าแล้วหรือไม่
      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (existingItemIndex > -1) {
        // อัพเดทจำนวน
        cart.items[existingItemIndex].quantity += quantity;
        cart.items[existingItemIndex].subtotal =
          cart.items[existingItemIndex].price *
          cart.items[existingItemIndex].quantity;
      } else {
        // เพิ่มสินค้าใหม่
        cart.items.push({
          productId,
          productName: product.name,
          price: product.price,
          quantity,
          subtotal: product.price * quantity,
        });
      }

      // คำนวณราคารวมใหม่
      cart.totalAmount = cart.items.reduce(
        (total, item) => total + item.subtotal,
        0
      );
      cart.totalItems = cart.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
    }

    console.log("Cart to save:", cart);

    await cart.save();

    // Populate ข้อมูลสินค้า
    await cart.populate("items.productId");

    res.status(200).json({
      success: true,
      message: "เพิ่มสินค้าเรียบร้อยแล้ว",
      cart: cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการเพิ่มสินค้า",
      error: error.message,
    });
  }
};

// ดูตระกร้าสินค้า
exports.getCart = async (req, res) => {
  try {
    const userId = req.params.userId || "guest";

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(200).json({
        userId,
        items: [],
        totalAmount: 0,
        totalItems: 0,
      });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Cart GET error" });
  }
};

exports.getAllCart = async (req, res) => {
  try {
    const cart = await Cart.find({}).exec();
    res.status(200).send(cart);
  } catch (error) {
    console.log(error);
    res.status(500).send("get all cart");
  }
};

// อัพเดทจำนวนสินค้าในตระกร้า
exports.updateCartItem = async (req, res) => {
  try {
    const { userId = "guest", productId, quantity } = req.body;

    if (quantity <= 0) {
      return exports.removeFromCart(req, res);
    }

    const cart = await Cart.findOne({ userId }); // สุ่มเสี่ยง error
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

    res.status(200).json(cart, {
      message: "อัพเดทตระกร้าแล้ว",
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

    // cart.total = cart.items.reduce(
    //   (total, item) => total + item.price * item.quantity,
    //   0
    // );

    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json(cart, {
      message: "ลบสินค้าออกจากตระกร้าแล้ว",
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
