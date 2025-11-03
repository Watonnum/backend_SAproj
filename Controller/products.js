const model_Product = require("../Model/products");

exports.list = async (req, res) => {
  try {
    // Populate category information for better frontend display
    const producted = await model_Product
      .find({})
      .populate("categoryId", "name description")
      .exec();
    res.send(producted);
  } catch (error) {
    console.log(error);
    res.status(500).send("Get error");
  }
};

exports.getID = async (req, res) => {
  try {
    const id = req.params.id;
    const producted = await model_Product
      .findOne({ _id: id })
      .populate("categoryId", "name description")
      .exec();
    res.send(producted);
  } catch (error) {
    console.log(error);
    res.status(500).send("GetByID error");
  }
};

exports.create = async (req, res) => {
  try {
    const producted = await model_Product(req.body).save(); // remember -> ".save()" to save in DB
    res.send(producted);
  } catch (error) {
    console.log(error);
    res.status(500).send("POST error");
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    // Log เพื่อ debug
    console.log("Update product ID:", id);
    console.log("Update data:", req.body);

    const updated = await model_Product
      .findOneAndUpdate({ _id: id }, req.body, { new: true })
      .populate("categoryId", "name description")
      .exec();

    console.log("Updated product:", updated);
    res.send(updated);
  } catch (error) {
    console.log(error);
    res.status(500).send("PUT error");
  }
};

exports.removeID = async (req, res) => {
  try {
    const id = req.params.id;
    const removed = await model_Product.findOneAndDelete({ _id: id }).exec();
    res.send(removed);
  } catch (error) {
    console.log(error);
    res.status(500).send("DELETE ID error");
  }
};
