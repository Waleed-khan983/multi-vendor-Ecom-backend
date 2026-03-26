import Store from "../models/store.Model.js";



export const createStore = async (req, res, next) => {
    try {

        if (req.user.role !== "vendor") {
            return res.status(403).json({
                success: false,
                message: "Only vendor can create store",
            });
        }

        const existingStore = await Store.findOne({ owner: req.user._id })

        if (existingStore) {
            return res.status(400).json({
                success: false,
                message: "You already have a store"
            });
        }

        const { name, description } = req.body;
        const store = await Store.create({
            name,
            description,
            owner: req.user._id
        })

        res.status(201).json({
            success: true,
            message: "Store created successfully",
            store,
        });

    } catch (error) {
        next(error);
    }
}


export const approveStore = async (req, res, next) => {
    try {
        const { id } = req.params;

        const store = await Store.findById(id);
        if (!store) {
            return res.status(404).json({
                success: false,
                message: "Store not found"
            });
        }

        


        store.isApproved = true;
        await store.save();
        res.status(200).json({
            success: true,
            message: "Store approved successfully",
        })
    } catch (error) {
        next(error)
    }
}
