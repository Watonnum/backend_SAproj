const Order = require("../Model/orders");
const Cart = require("../Model/cart");
const Product = require("../Model/products");
const User = require("../Model/users");

// สร้าง Order ใหม่จาก Cart
exports.createOrder = async (req, res) => {
  try {
    const { userId, paymentMethod = "cash", notes = "" } = req.body;

    // ตรวจสอบว่ามี userId
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // ตรวจสอบว่า user มีอยู่จริง
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ดึงข้อมูล cart ของ user
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // สร้าง order items จาก cart
    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = item.productId;

      // ตรวจสอบว่าสินค้ายังมีอยู่
      if (!product) {
        return res.status(404).json({
          message: `Product not found in cart`,
        });
      }

      // คำนวณ subtotal
      const subtotal = product.price * item.quantity;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal: subtotal,
      });

      totalAmount += subtotal;

      // ⚠️ ไม่หัก stock ที่นี่ เพราะหักตอนใส่ Cart ไปแล้ว
    }

    // สร้าง order
    const order = new Order({
      userId: user._id,
      userName: `${user.fName} ${user.lName}` || user.email,
      items: orderItems,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === "cash" ? "unpaid" : "paid",
      notes,
    });

    await order.save();

    // ล้าง cart หลังจากสร้าง order สำเร็จ
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      message: "Error creating order",
      error: error.message,
    });
  }
};

// ดึง Orders ทั้งหมด (สำหรับ admin/manager)
exports.getAllOrders = async (req, res) => {
  try {
    const { status, startDate, endDate, limit = 50, page = 1 } = req.query;

    const query = {};

    // Filter by status
    if (status && status !== "all") {
      query.status = status;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate("userId", "fName lName email")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      orders,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

// ดึง Orders ของ User คนใดคนหนึ่ง
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, limit = 20, page = 1 } = req.query;

    const query = { userId };

    if (status && status !== "all") {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      orders,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      message: "Error fetching user orders",
      error: error.message,
    });
  }
};

// ดึง Order เดียว
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("userId", "fName lName email phoneNum")
      .populate("items.productId", "name images categoryId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      message: "Error fetching order",
      error: error.message,
    });
  }
};

// อัพเดทสถานะ Order
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // ตรวจสอบ status ที่รับได้
    const validStatuses = ["pending", "processing", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
        validStatuses,
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ไม่สามารถเปลี่ยนสถานะของ order ที่ถูกยกเลิกหรือเสร็จสิ้นแล้ว
    if (order.status === "cancelled") {
      return res.status(400).json({
        message: "Cannot update cancelled order",
      });
    }

    if (order.status === "completed" && status !== "completed") {
      return res.status(400).json({
        message: "Cannot change status of completed order",
      });
    }

    // อัพเดทสถานะ
    order.status = status;

    if (status === "completed") {
      order.completedAt = new Date();
      order.paymentStatus = "paid";
    }

    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      message: "Error updating order status",
      error: error.message,
    });
  }
};

// ยกเลิก Order
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancelReason = "", cancelledBy } = req.body;

    const order = await Order.findById(id).populate("items.productId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ตรวจสอบว่า order ยกเลิกได้หรือไม่
    if (order.status === "cancelled") {
      return res.status(400).json({
        message: "Order is already cancelled",
      });
    }

    if (order.status === "completed") {
      return res.status(400).json({
        message: "Cannot cancel completed order",
      });
    }

    // คืน stock
    for (const item of order.items) {
      // ใช้ item.productId._id ถ้า populate แล้ว หรือ item.productId ถ้าเป็น ObjectId
      const productId = item.productId._id || item.productId;
      const product = await Product.findById(productId);
      if (product) {
        console.log(
          `คืน stock สินค้า ${product.name}: ${product.inStock} + ${
            item.quantity
          } = ${product.inStock + item.quantity}`
        );
        product.inStock += item.quantity;
        await product.save();
      }
    }

    // อัพเดทสถานะ order
    order.status = "cancelled";
    order.cancelledAt = new Date();
    order.cancelReason = cancelReason;
    if (cancelledBy) {
      order.cancelledBy = cancelledBy;
    }

    await order.save();

    res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      message: "Error cancelling order",
      error: error.message,
    });
  }
};

// ดึงสถิติ Orders (สำหรับ Dashboard)
exports.getOrderStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateQuery = {};
    if (startDate || endDate) {
      dateQuery.createdAt = {};
      if (startDate) {
        dateQuery.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        dateQuery.createdAt.$lte = new Date(endDate);
      }
    }

    // นับจำนวน orders ตามสถานะ
    const statusCounts = await Order.aggregate([
      { $match: dateQuery },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    // รายได้รวม
    const totalRevenue = await Order.aggregate([
      {
        $match: {
          ...dateQuery,
          status: { $in: ["completed", "processing"] },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    // จำนวน orders ทั้งหมด
    const totalOrders = await Order.countDocuments(dateQuery);

    // Orders วันนี้
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today },
    });

    res.status(200).json({
      statusCounts,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalOrders,
      todayOrders,
    });
  } catch (error) {
    console.error("Error fetching order stats:", error);
    res.status(500).json({
      message: "Error fetching order stats",
      error: error.message,
    });
  }
};
