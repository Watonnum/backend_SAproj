// Shared permission configuration
const ROLE_PERMISSIONS = {
  admin: {
    users: ["read", "create", "update", "delete"],
    products: ["read", "create", "update", "delete"],
    categories: ["read", "create", "update", "delete"],
    cart: ["read", "create", "update", "delete"],
    orders: ["read", "create", "update", "delete"],
    pos: ["read", "create", "update", "delete"],
    settings: ["read", "create", "update", "delete"],
  },
  manager: {
    users: [], // ไม่สามารถเข้าถึงข้อมูล user ได้
    products: ["read", "create", "update", "delete"],
    categories: ["read", "create", "update", "delete"],
    cart: ["read", "create", "update", "delete"],
    orders: ["read", "create", "update", "delete"],
    pos: ["read", "create", "update", "delete"],
    settings: ["read"], // อ่านได้อย่างเดียว
  },
  operator: {
    users: [], // ไม่สามารถเข้าถึงข้อมูล user ได้
    products: ["read"], // อ่านได้อย่างเดียว
    categories: ["read"], // อ่านได้อย่างเดียว
    cart: ["read", "create", "update", "delete"], // จัดการตะกร้าได้
    orders: ["read", "create", "delete"], // สร้าง อ่าน และยกเลิก order ของตัวเองได้
    pos: ["read", "create"], // ใช้ POS ได้
    settings: [], // ไม่สามารถเข้าถึง settings ได้
  },
};

// Route permission mapping
const ROUTE_PERMISSIONS = {
  "/data": "products:read",
  "/categories": "categories:read",
  "/users-simple": "users:read",
  "/orders": "orders:read",
  "/cart": "cart:read",
  "/settings": "settings:read",
  "/pos": "pos:read",
  "/create": "products:create",
  "/edit/*": "products:update",
};

// ฟังก์ชันสำหรับตรวจสอบ permission
const hasPermission = (userRole, resource, action) => {
  const permissions = ROLE_PERMISSIONS[userRole];
  if (!permissions) return false;

  const resourcePermissions = permissions[resource];
  return resourcePermissions && resourcePermissions.includes(action);
};

module.exports = {
  ROLE_PERMISSIONS,
  ROUTE_PERMISSIONS,
  hasPermission,
};
