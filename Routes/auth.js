const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const model_Users = require("../Model/users");
const { authenticateToken } = require("../Middleware/auth");

// Login route
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // หาผู้ใช้จาก email
    const user = await model_Users.findOne({ email, isActive: true });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ตรวจสอบรหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // สร้าง JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    // ส่งข้อมูลผู้ใช้กลับ (ไม่รวม passwordHash)
    const userData = {
      id: user._id,
      email: user.email,
      fName: user.fName,
      lName: user.lName,
      role: user.role,
      phoneNum: user.phoneNum,
      address: user.address,
    };

    res.json({
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route สำหรับตรวจสอบ token และดึงข้อมูลผู้ใช้
router.get("/auth/me", authenticateToken, async (req, res) => {
  try {
    const user = await model_Users
      .findById(req.user.id)
      .select("-passwordHash");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        fName: user.fName,
        lName: user.lName,
        role: user.role,
        phoneNum: user.phoneNum,
        address: user.address,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Get user info error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route สำหรับ logout (ในกรณีที่ต้องการ blacklist token)
router.post("/auth/logout", authenticateToken, (req, res) => {
  // ในการใช้งานจริงอาจต้องเก็บ token ใน blacklist
  res.json({ message: "Logout successful" });
});

// Route สำหรับสร้าง user ใหม่ (สำหรับ development)
router.post("/auth/register", async (req, res) => {
  try {
    const {
      email,
      password,
      fName,
      lName,
      phoneNum,
      role = "operator",
      address = "",
    } = req.body;

    if (!email || !password || !fName || !lName || !phoneNum) {
      return res.status(400).json({
        message: "Required fields: email, password, fName, lName, phoneNum",
      });
    }

    // ตรวจสอบว่า email ซ้ำหรือไม่
    const existingUser = await model_Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // เข้ารหัสรหัสผ่าน
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // สร้างผู้ใช้ใหม่
    const newUser = new model_Users({
      email,
      passwordHash,
      fName,
      lName,
      phoneNum,
      role,
      address,
      regisDate: new Date(),
      updateDate: new Date(),
      isActive: true,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        fName: newUser.fName,
        lName: newUser.lName,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
