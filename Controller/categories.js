const model_Categories = require("../Model/categories");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await model_Categories.find({}).exec();
    res.send(categories);
  } catch (error) {
    console.log(error);
    res.status(500).send("GET all categories error");
  }
};

exports.getCategories = async (req, res) => {
  try {
    const id = req.params.id;
    const categories = await model_Categories.findOne({ _id: id });
    res.send(categories);
  } catch (error) {
    console.log(error);
    res.status(500).send("Get categories by id error");
  }
};

exports.createCategories = async (req, res) => {
  try {
    const categories = await model_Categories(req.body).save();
    res.send(categories);
  } catch (error) {
    console.log(error);
    res.status(500).send("POST categories error");
  }
};

exports.updateCategories = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await model_Categories
      .findOneAndUpdate({ _id: id }, req.body, { new: true })
      .exec();
    res.send(updated);
  } catch (error) {
    console.log(error);
    res.status(500).send("UPDATE categories by id error");
  }
};

exports.removeCategories = async (req, res) => {
  try {
    const id = req.params.id;
    const removed = await model_Categories.findOneAndDelete().exec();
    res.send(removed);
  } catch (error) {
    console.log(error);
    res.status(500).send("DELETE categories error");
  }
};
