const jwt = require("jsonwebtoken");
const model_Users = require("../Model/users");
const { ROLE_PERMISSIONS, hasPermission } = require("../Config/permissions");

// Middleware สำหรับ authentication
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
      async (err, user) => {
        if (err) {
          return res.status(403).json({ message: "Invalid token" });
        }

        // ดึงข้อมูล user จาก database เพื่อให้แน่ใจว่าข้อมูลเป็นปัจจุบัน
        const userFromDB = await model_Users.findById(user.id);
        if (!userFromDB || !userFromDB.isActive) {
          return res
            .status(403)
            .json({ message: "User not found or inactive" });
        }

        req.user = {
          id: userFromDB._id,
          email: userFromDB.email,
          role: userFromDB.role,
          name: `${userFromDB.fName} ${userFromDB.lName}`,
        };
        next();
      }
    );
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
};

// Middleware สำหรับตรวจสอบ permission
const checkPermission = (resource, action) => {
  return (req, res, next) => {
    try {
      const userRole = req.user.role;

      if (!hasPermission(userRole, resource, action)) {
        return res.status(403).json({
          message: `Access denied. Required permission: ${resource}:${action}`,
          userRole: userRole,
          requiredPermission: `${resource}:${action}`,
        });
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error);
      res.status(500).json({ message: "Permission check failed" });
    }
  };
};

// Middleware สำหรับ route ที่ต้องการเฉพาะ admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// Middleware สำหรับ route ที่ต้องการ admin หรือ manager
const requireAdminOrManager = (req, res, next) => {
  if (!["admin", "manager"].includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: "Admin or Manager access required" });
  }
  next();
};

module.exports = {
  authenticateToken,
  checkPermission,
  hasPermission,
  requireAdmin,
  requireAdminOrManager,
  ROLE_PERMISSIONS,
};
