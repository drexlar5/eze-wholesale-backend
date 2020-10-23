const excelToJson = require("convert-excel-to-json");

const BuyRequest = require("../models/BuyRequest");
const SellRequest = require("../models/SellRequest");

const config = require("../config/config");
const logger = require("../lib/logger");

/**
 * Saves the content of an excel file to database
 * NB: **this function work as stated only when the structure iof the excel file is adhered to**
 * @param filePath
 * @returns message - String
 */
exports.saveProducts = async (filePath) => {
  try {
    const result = excelToJson({
      sourceFile: filePath,
    });

    let deviceNames = [
      "iPhone XS Max",
      "iPhone XS",
      "iPhone XR",
      "iPhone X",
      "iPhone 8 PLUS",
      "iPhone 8",
      "iPhone 7 Plus",
      "iPhone 7",
      "iPhone 6S Plus",
      "iPhone 6S",
      "iPhone 6 Plus",
      "iPhone 6",
      "iPhone SE",
    ];
    let buyRequestArray = [];
    let sellRequestArray = [];
    let deviceName;
    let storageSize;
    let conditions = ["New", "A1", "A2", "B1", "B2", "C", "C/B", "C/D"];
    let conditionsCount = 0;

    for (const item of result.IPHONES) {
      for (let obj in item) {
        if (obj === "A" && deviceNames.includes(item[obj]))
          deviceName = item[obj];

        if (obj === "B" && item[obj] !== "Storage Size")
          storageSize = item[obj];

        if (obj === "C" && typeof item[obj] === "string") break;

        if (obj > "B" && obj < "K") {
          let newObj = {
            deviceName,
            storageSize,
            condition: conditions[conditionsCount % 8],
            price: item[obj],
          };
          buyRequestArray.push(newObj);
          conditionsCount++;
        } else if (obj > "M" && obj < "V") {
          let newObj = {
            deviceName,
            storageSize,
            condition: conditions[conditionsCount % 8],
            price: item[obj],
          };
          conditionsCount++;
          sellRequestArray.push(newObj);
        }
      }
    }

    // const buyResult = await BuyRequest.insertMany(buyRequestArray);
    // const sellResult = await SellRequest.insertMany(sellRequestArray);

    // if (buyResult.length < 1 || sellResult.length < 1) {
    //   let error = new Error('File not saved');
    //   error.statusCode = 501;
    //   throw error;
    // }

    return "file saved successfully";
  } catch (error) {
    logger.error("saveProducts::error", error.message);
    throw error;
  }
};

const fetchProducts = async (category, currentPage, productsPerPage, query = {}) => {
  let totalData;
  let paginatedData;

  console.log(category, currentPage, productsPerPage, query)
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
 * Fetches all documents from the database
 * returns ten documents when @param perPage is not set
 * @param category
 * @param page - (optional) for pagination
 * @param perPage - (optional) for pagination
 * @returns paginatedData - Array
 */
exports.getProducts = async ({ category, page, perPage }) => {
  try {
    const currentPage = parseInt(page, 10) || 1;
    const productsPerPage = parseInt(perPage, 10) || 10;

    const [totalData, paginatedData] = await fetchProducts(category, currentPage, productsPerPage);

    return {
      currentPage,
      pages: Math.round(totalData / perPage),
      totalData,
      paginatedData,
    };
  } catch (error) {
    logger.error("getProducts::error", error.message);
    throw error;
  }
};

/**
 * Performs partial text search on user model,
 * returns a maximum of two documents when @param perPage is not set
 * @param queryString
 * @param page - (optional) for pagination
 * @param perPage - (optional) for pagination
 * @returns users - Array
 */
exports.searchProducts = async ({ queryString, category, page, perPage }) => {
  const currentPage = parseInt(page, 10) || 1;
  const productsPerPage = parseInt(perPage, 10) || 10;

  try {
    const query = {
      $or: [
        {
          storageSize: {
            $regex: queryString,
            $options: "i",
          },
        },
        {
          condition: {
            $regex: queryString,
            $options: "i",
          },
        },
        {
          deviceName: {
            $regex: queryString,
            $options: "i",
          },
        },
        // {
        //   email: {
        //     $regex: queryString,
        //     $options: "i",
        //   },
        // },
      ],
    };

    const [totalData, paginatedData] = await fetchProducts(
      category,
      currentPage,
      productsPerPage,
      query
    );

    console.log('a', totalData, paginatedData)

    // if (totalData == 0) {
    //   return null;
    // }

    return {
      currentPage,
      pages: Math.round(totalData / perPage),
      totalData,
      paginatedData,
    };
  } catch (error) {
    return error;
  }
};
