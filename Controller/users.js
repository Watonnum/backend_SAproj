const model_Users = require("../Model/users");

// ดูตระกร้าสินค้า
exports.getUsers = async (req, res) => {
  try {
    const getAllusers = await model_Users.find({}).exec();
    res.status(200).send(getAllusers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "GET all users error" });
  }
};

exports.getUsersId = async (req, res) => {
  try {
    const id = req.params.id;
    const usersId = await model_Users.findOne({ _id: id }).exec();
    res.status(200).send(usersId);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "GET users by id error" });
  }
};

// ดึงข้อมูล user โดย email (สำหรับ login page)
exports.getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await model_Users.findOne({ email: email }).exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ใช้ Environment Variables แทน hardcode (ปลอดภัยกว่า)
    const passwordMapping = {
      "admin@example.com": process.env.DEMO_PASSWORD_ADMIN,
      "manager@example.com": process.env.DEMO_PASSWORD_MANAGER,
      "operator@example.com": process.env.DEMO_PASSWORD_OPERATOR,
      "user@example.com": process.env.DEMO_PASSWORD_USER,
      "ipae.wo@gmail.com": process.env.DEMO_PASSWORD_WATANYU,
    };

    // ส่งข้อมูลกลับไป (รวม plain password สำหรับ auto-fill demo)
    res.status(200).send({
      email: user.email,
      fName: user.fName,
      lName: user.lName,
      role: user.role,
      password: user.plainPassword || passwordMapping[user.email] || "", // ส่ง plain password สำหรับ auto-fill
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "GET user by email error" });
  }
};

// Quick login สำหรับ recent accounts (ใช้ stored credentials)
exports.quickLogin = async (req, res) => {
  try {
    const { email, rememberToken } = req.body;

    // หา user ในฐานข้อมูล
    const user = await model_Users.findOne({ email: email }).exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // สำหรับ demo: ถ้ามี rememberToken ใน localStorage ให้ login ได้เลย
    // ในระบบจริงควรเปรียบเทียบกับ token ที่เก็บไว้ใน database
    if (rememberToken) {
      // สร้าง JWT token
      const jwt = require("jsonwebtoken");
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "24h" }
      );

      res.status(200).json({
        success: true,
        message: "Quick login successful",
        token: token,
        user: {
          id: user._id,
          email: user.email,
          fName: user.fName,
          lName: user.lName,
          role: user.role,
        },
      });
    } else {
      res.status(401).json({ message: "Quick login not available" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Quick login error" });
  }
};

exports.createUsers = async (req, res) => {
  try {
    const created = await model_Users(req.body).save();
    res.status(200).send(created);
  } catch (error) {
    console.log(error);
    res.status(500).send("POST users error");
  }
};

exports.updateUsers = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await model_Users
      .findOneAndUpdate({ _id: id }, req.body, { new: true })
      .exec();
    res.status(200).send(updated);
  } catch (error) {
    console.log(error);
    res.status(500).send("UPDATE users by id error");
  }
};

exports.removeUsers = async (req, res) => {
  try {
    const id = req.params.id;
    const removed = await model_Users.findOneAndDelete({ _id: id }).exec();
    res.send(removed);
  } catch (error) {
    console.log(error);
    res.status(500).send("DELETE categories error");
  }
};
