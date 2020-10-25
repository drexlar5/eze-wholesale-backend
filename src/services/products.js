const excelToJson = require("convert-excel-to-json");

const BuyRequest = require("../models/BuyRequest");
const SellRequest = require("../models/SellRequest");

const logger = require("../lib/logger");

/**
 * Saves the content of an excel file to database
 * NB: **this function work as stated only when the structure of the excel file is adhered to**
 * @param filePath
 * @returns message - String
 */
exports.saveProducts = async (filePath) => {
  try {
    const result = excelToJson({
      sourceFile: filePath,
    });

    let deviceNames = [
      "iphone xs max",
      "iphone xs",
      "iphone xr",
      "iphone x",
      "iphone 8 plus",
      "iphone 8",
      "iphone 7 plus",
      "iphone 7",
      "iphone 6s plus",
      "iphone 6s",
      "iphone 6 plus",
      "iphone 6",
      "iphone se",
    ];

    let buyRequestArray = [];
    let sellRequestArray = [];
    let deviceName;
    let storageSize;
    let conditions = ["new", "a1", "a2", "a1", "a2", "c", "c/b", "c/d"];
    let conditionsCount = 0;

    for (const item of result.IPHONES) {
      for (let obj in item) {
        if (obj === "A" && deviceNames.includes(item[obj].toLowerCase()))
          deviceName = item[obj].toLowerCase();

        if (obj === "B" && item[obj] !== "Storage Size")
          storageSize = item[obj].toLowerCase();

        if (obj === "C" && typeof item[obj] === "string") break;

        if (obj > "B" && obj < "K") {
          let newObj = {
            deviceName,
            storageSize,
            condition: conditions[conditionsCount % 8].toLowerCase(),
            price: item[obj],
          };
          buyRequestArray.push(newObj);
          conditionsCount++;
        } else if (obj > "M" && obj < "V") {
          let newObj = {
            deviceName,
            storageSize,
            condition: conditions[conditionsCount % 8].toLowerCase(),
            price: item[obj],
          };
          conditionsCount++;
          sellRequestArray.push(newObj);
        }
      }
    }

    const buyResult = await BuyRequest.insertMany(buyRequestArray);
    const sellResult = await SellRequest.insertMany(sellRequestArray);

    if (buyResult.length < 1 || sellResult.length < 1) {
      let error = new Error("File not saved");
      error.statusCode = 501;
      throw error;
    }

    return "file saved successfully";
  } catch (error) {
    logger.error("saveProducts::error", error.message);
    throw error;
  }
};

/**
 * Fetches documents from the database based on the query passed
 * returns array of total documents count and transformed documents
 * @param category
 * @param currentPage - (optional) for pagination
 * @param productsPerPage - (optional) for pagination
 * @param query - (optional) DB query logic
 * @returns [totalData, paginatedData] - Array
 */
const fetchProducts = async (
  category,
  currentPage,
  productsPerPage,
  query = {}
) => {
  let totalData;
  let paginatedData;

  logger.info("fetchProducts", query);
  if (category === "buyRequests") {
    totalData = await BuyRequest.find(query).countDocuments();
    paginatedData = await BuyRequest.find(query)
      .select("-__v  -_id")
      .skip((currentPage - 1) * productsPerPage)
      .limit(productsPerPage);
  } else {
    totalData = await SellRequest.find(query).countDocuments();
    paginatedData = await SellRequest.find(query)
      .select("-__v  -_id")
      .skip((currentPage - 1) * productsPerPage)
      .limit(productsPerPage);
  }
  return [totalData, paginatedData];
};

/**
 * Fetches all documents from the database or array of document that matches a price range passed
 * returns ten documents when @param perPage is not set
 * @param category
 * @param page - (optional) for pagination
 * @param perPage - (optional) for pagination
 * @param min - (optional) for range of prices
 * @param max - (optional) for range of prices
 * @returns { currentPage, pages, totalData, paginatedData } - Object
 */
exports.getProducts = async ({ category, page, perPage, min, max }) => {
  try {
    const currentPage = parseInt(page, 10) || 1;
    const productsPerPage = parseInt(perPage, 10) || 10;
    let query = {};

    if (min && max) query = { price: { $lte: max, $gte: min } };

    const [totalData, paginatedData] = await fetchProducts(
      category,
      currentPage,
      productsPerPage,
      query
    );

    return {
      currentPage,
      pages: Math.ceil(totalData / perPage),
      totalData,
      paginatedData,
    };
  } catch (error) {
    logger.error("getProducts::error", error.message);
    throw error;
  }
};

/**
 * Performs partial text and full search on database,
 * returns ten documents when @param perPage is not set
 * @param queryString
 * @param page - (optional) for pagination
 * @param perPage - (optional) for pagination
 * @returns { currentPage, pages, totalData, paginatedData } - Object
 */
exports.searchProducts = async ({ queryString, category, page, perPage }) => {
  const currentPage = parseInt(page, 10) || 1;
  const productsPerPage = parseInt(perPage, 10) || 10;

  try {
    let query;
    let queryArray = queryString.split(",");
    if (queryArray.length === 1) {
      // Partial text search query
      query = {
        $or: [
          {
            storageSize: {
              $regex: queryString.trim(),
              $options: "i",
            },
          },
          {
            condition: {
              $regex: queryString.trim(),
              $options: "i",
            },
          },
          {
            deviceName: {
              $regex: queryString.trim(),
              $options: "i",
            },
          },
        ],
      };
    } else {
      let storageSize, condition, deviceName;

      // format array and map respective value to key
      queryArray.map((string) => {
        let formattedString = string.toLowerCase().trim();
        if (formattedString.includes("iphone")) {
          deviceName = formattedString;
        } else if (formattedString.includes("gb")) {
          storageSize = formattedString;
        } else {
          condition = formattedString;
        }
      });

      if (deviceName && condition && storageSize) {
        query = {
          deviceName,
          storageSize,
          condition,
        };
      } else if (storageSize && condition) {
        query = {
          storageSize,
          condition,
        };
      } else if (deviceName && condition) {
        query = {
          deviceName,
          condition,
        };
      } else if (storageSize && deviceName) {
        query = {
          deviceName,
          storageSize,
        };
      }
    }

    const [totalData, paginatedData] = await fetchProducts(
      category,
      currentPage,
      productsPerPage,
      query
    );

    return {
      currentPage,
      pages: Math.ceil(totalData / perPage),
      totalData,
      paginatedData,
    };
  } catch (error) {
    return error;
  }
};
