const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const connectDB = require("./Config/db");
const model_Users = require("./Model/users");

async function createAdminUser() {
  try {
    // เชื่อมต่อ database
    await connectDB();

    // ตรวจสอบว่ามี admin อยู่แล้วหรือไม่
    const existingAdmin = await model_Users.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("❌ Admin user already exists:", existingAdmin.email);
      process.exit(0);
    }

    // สร้าง admin user
    const adminEmail = "admin@example.com";
    const adminPassword = "admin123";

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

    const adminUser = new model_Users({
      email: adminEmail,
      passwordHash,
      fName: "System",
      lName: "Administrator",
      phoneNum: "0123456789",
      role: "admin",
      address: "System Address",
      regisDate: new Date(),
      updateDate: new Date(),
      isActive: true,
    });

    await adminUser.save();

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", adminEmail);
    console.log("🔑 Password:", adminPassword);
    console.log("🎭 Role: admin");

    // สร้าง manager user
    const managerEmail = "manager@example.com";
    const managerPassword = "manager123";

    const managerPasswordHash = await bcrypt.hash(managerPassword, saltRounds);

    const managerUser = new model_Users({
      email: managerEmail,
      passwordHash: managerPasswordHash,
      fName: "Store",
      lName: "Manager",
      phoneNum: "0123456788",
      role: "manager",
      address: "Manager Address",
      regisDate: new Date(),
      updateDate: new Date(),
      isActive: true,
    });

    await managerUser.save();

    console.log("✅ Manager user created successfully!");
    console.log("📧 Email:", managerEmail);
    console.log("🔑 Password:", managerPassword);
    console.log("🎭 Role: manager");

    // สร้าง operator user
    const operatorEmail = "operator@example.com";
    const operatorPassword = "operator123";

    const operatorPasswordHash = await bcrypt.hash(
      operatorPassword,
      saltRounds
    );

    const operatorUser = new model_Users({
      email: operatorEmail,
      passwordHash: operatorPasswordHash,
      fName: "POS",
      lName: "Operator",
      phoneNum: "0123456787",
      role: "operator",
      address: "Operator Address",
      regisDate: new Date(),
      updateDate: new Date(),
      isActive: true,
    });

    await operatorUser.save();

    console.log("✅ Operator user created successfully!");
    console.log("📧 Email:", operatorEmail);
    console.log("🔑 Password:", operatorPassword);
    console.log("🎭 Role: operator");

    console.log(
      "\n🚀 All test users have been created. You can now login with:"
    );
    console.log("  Admin: admin@example.com / admin123");
    console.log("  Manager: manager@example.com / manager123");
    console.log("  Operator: operator@example.com / operator123");
  } catch (error) {
    console.error("❌ Error creating users:", error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

createAdminUser();
