import Product from "../models/product.schema";
import formidable from "formidable";
import fs from "fs"; //file system alreay in node modules
import { deleteFile, s3FileUpload } from "../services/imageUpload";
import Mongoose from "mongoose";
import asyncHandler from "../services/asyncHandler";
import CustomError from "../utils/customError";
import config from "../config/index";

/**********************************************************
 * @ADD_PRODUCT
 * @route https://localhost:5000/api/product
 * @description Controller used for adding a new product
 * @description Only admin can access all the products
 * @returns Product Object
 **********************************************************/

export const addProduct = asyncHandler(async (req, res) => {
  const form = formidable({
    multiples: true,
    keepExtensions: true,
  });

  form.parse(req, async function (err, fields, files) {
    try {
      if (err) {
        throw new CustomError(err.message || "Something Went Wrong", 500);
      }
      let productId = new Mongoose.Types.ObjectId().toHexString();
      //console.log(fields, files);

      //345a34
      //345a34/photo_1
      //345a34/photo_2

      //Check for fields
      if (
        !fields.name ||
        !fields.price ||
        !fields.description ||
        !fields.collectionId
      ) {
        throw new CustomError("Please fill all details", 500);
      }

      //handling images
      let imgArrayResp = Promise.all(
        Object.keys(files).map(async (filekey, index) => {
          const element = files[filekey];

          const data = fs.readFileSync(element.filepath);

          const upload = await s3FileUpload({
            bucketName: config.S3_BUCKET_NAME,
            key: `products/${productId}/photo_${index + 1}.png`,
            body: data,
            contentType: element.mimetype,
          });
          return {
            secure_url: upload.Location,
          };
        })
      );

      let imgArray = await imgArrayResp;

      const product = await Product.create({
        _id: productId,
        photos: imgArray,
        ...fields,
      });

      if (!product) {
        throw new CustomError("Product was not created", 400);
        //remove image
      }
      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Something went wrong",
      });
    }
  });
});

/**********************************************************
 * @GET_ALL_PRODUCT
 * @route https://localhost:5000/api/product
 * @description Controller used for getting all product details
 * @description User and Admin can get all product details
 * @returns Product Object
 **********************************************************/

export const getAllProduct = asyncHandler(async (req, res) => {
  const products = await Product.find({});

  if (!products) {
    throw new CustomError("No product was found", 404);
  }
  res.status(200).json({
    success: true,
    products,
  });
});

/**********************************************************
 * @GET_PRODUCT_BY_ID
 * @route https://localhost:5000/api/product
 * @description Controller used for getting single product details
 * @description User and Admin can get single product details
 * @returns Product Object
 **********************************************************/

export const getProductById = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findById({ productId });

  if (!product) {
    throw new CustomError("No product was found", 404);
  }
  res.status(200).json({
    success: true,
    product,
  });
});

/* 
--------------------
Assignment to read
--------------------
- model.aggregate([{},{},{}])
- $group
- $push
- $ROOT
- $lookup
- $project
*/
