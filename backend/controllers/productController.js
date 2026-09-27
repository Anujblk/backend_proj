import Product from "../models/Product.js";

export async function createProduct(req, res, next) {
  try {
    const product = await Product.create({
      name: req.body.name,
      description: req.body.description ?? "",
      price: req.body.price,
      stock: req.body.stock,
    });

    return res.status(201).json({
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProducts(req, res, next) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    return res.status(200).json({
      products,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      product,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    product.name = req.body.name;
    product.description = req.body.description ?? "";
    product.price = req.body.price;
    product.stock = req.body.stock;

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    await product.deleteOne();

    return res.status(200).json({
      message: "Product deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}
