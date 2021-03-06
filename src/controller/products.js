const productService = require("../services/products");
const logger = require("../lib/logger");

exports.saveProducts = async (req, res, next) => {
  try {
    const { files } = req;
    let fileName;
    let filePath;

    if (files.file) {
      fileName = files.file.name;
      filePath = files.file.path;

      if (fileName.slice(fileName.length - 5) !== ".xlsx") {
        const error = new Error("File format not supported.");
        error.statusCode = 415;
        throw error;
      }
    }

    const data = await productService.saveProducts(filePath);
    logger.info("Controller::saveProducts::Data", data);
    
    res.json({
      error: false,
      message: "Products succesfully saved",
      data,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const { category, page, perPage, query, min, max } = req.query;
    let data;

    if (query != 'null') {
      data = await productService.searchProducts({
        queryString: query,
        category,
        page,
        perPage,
      });
    } else {
      data = await productService.getProducts({
        category,
        page,
        perPage,
        min: +min,
        max: +max,
      });
    }

    logger.info("Controller::getProducts::Data", data);

    res.json({
      error: false,
      message: "Products succesfully fetched",
      data,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

