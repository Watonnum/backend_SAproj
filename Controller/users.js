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
