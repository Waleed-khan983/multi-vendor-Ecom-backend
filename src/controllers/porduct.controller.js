import Product from "../models/product.Model.js";
import Store from "../models/store.Model.js";
import cloudinary from "../config/cloudinary.js";


export const createProduct = async (req, res, next) => {
  try {

    const { name, price, description, stock, storeId } = req.body;

    let imageData = {};

    // Upload image to Cloudinary
    if (req.file) {

      const file = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      const result = await cloudinary.uploader.upload(file, {
        folder: "products",
      });

      imageData = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    const store = await Store.findById(storeId);

    if (!store) {
      return res.status(400).json({
        success: false,
        message: "Store not found",
      });
    }

    // check vendor
    if (store.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can add product only to your store",
      });
    }

    // check store approval
    if (!store.isApproved) {
      return res.status(403).json({
        success: false,
        message: "Store is not approved",
      });
    }

    const product = await Product.create({
      name,
      price,
      description,
      stock,
      owner: req.user._id,
      store: storeId,
      image: imageData, // ✅ image saved here
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });

  } catch (error) {
    next(error);
  }
};


export const deleteProduct = async (req, res, next) => {
    try {

        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        if (product.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this product"
            })
        }

        if(product.image?.public_id) {
            await cloudinary.uploader.destroy(product.image.public_id);
        }

        await Product.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        })

    } catch (error) {
        next(error);
    }
}



export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, price, description, stock, storeId } = req.body;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        if (
            product.owner.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to update this product",
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                name,
                price,
                description,
                stock,
                store: storeId,
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            updatedProduct,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllProducts = async (req, res, next) => {
    try {
         
        let query = {};

        // search
        if(req.query.keyword){
            query.name = {
                $regex: req.query.keyword,
                $options: "i",
            };
        }

        //filter

        if(req.query.price){
            query.price = {};

            if(req.query.price.gte){
                query.price.$gte = Number(req.query.price.gte);

            }

            if(req.query.price.lte){
                query.price.$lte = Number(req.query.price.lte);
            }
        }

        // sorting

        let sort = {};
        if(req.query.sort){
            const sortBy = req.query.sort;
            sort[sortBy.replace("-", "")] = sortBy.startsWith("-") ? -1 : 1;

        }else{
            sort.createdAt = -1;
        }


        // pagination 

        const page = Number(req.query.page ) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalProducts = await Product.countDocuments(query);




        const products = await Product.find()
        .find(query)
        .populate("store", "name")
        .populate("owner", "name email")
        .sort(sort)
        .skip(skip)
        .limit(limit);

        if (products) {
            res.status(200).json({
                success: true,
                message: "Products fetched successfully",
                totalProducts,
                page,
                pages: Math.ceil(totalProducts/limit),
                count: products.length,
                products
            })
        }



    } catch (error) {
        next(error)
    }
}

export const getSingleProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id).populate("store", "name").populate("owner", "name email")

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            product
        })
    } catch (error) {
        next(error)
    }
}


export const getProductByStore = async (req, res, next) => {
    try {
        const { storeId } = req.params;
        const products = await Product.find({ store: storeId })

        
           res.status(200).json({
            success: true,
            count: products.length,
            products,

        });
    


    } catch (error) {
        next(error)
    }
}

export const searchProducts = async (req, res, next) => {
    try {
        const keyword = req.query.keyword;
        const products = await Product.find({
            name: { $regex: keyword, $options: "i" },

        });

        res.status(200).json({
            success: true,
            count: products.length,
            products,
        })

    } catch (error) {
        next(error);
    }
}


 