const Resource = require("../models/resourceModel")

 const fetchAll = async (req, res) => {
    let resultData;
    try {
        resultData = await Resource.find().sort({ updatedAt: -1 });
        return res.status(200).send(resultData);
    } catch (err) {
        return res.status(500).send({ msg: 'Failed to fetch resources', details: err });
    }
};

 const addNew = async (req, res) => {
    const resourceInfo = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        availableSlots: req.body.availableSlots,
    };

    try {
        let newItem = new Resource(resourceInfo);
        let savedItem = await newItem.save();
        return res.status(201).send(savedItem);
    } catch (err) {
        return res.status(500).send({ msg: 'Creation failed', details: err });
    }
};

 const modifyExisting = async (req, res) => {
    const itemId = req.params.id;
    const changes = req.body;

    try {
        let result = await Resource.findByIdAndUpdate(
            itemId, 
            changes,
            { new: true, runValidators: true }
        );
        
        if (!result) {
            return res.status(404).send({ msg: 'Item not found in database' });
        }
        return res.status(200).send(result);
    } catch (err) {
        return res.status(500).send({ msg: 'Update operation failed', details: err });
    }
};

 const removeItem = async (req, res) => {
    const itemId = req.params.id;

    try {
        let result = await Resource.findByIdAndDelete(itemId);
        if (!result) {
            return res.status(404).send({ msg: 'Item not found in database' });
        }
        return res.status(200).send({ msg: 'Successfully removed item' });
    } catch (err) {
        return res.status(500).send({ msg: 'Deletion failed', details: err });
    }
};

module.exports ={
    fetchAll,
    addNew,
    modifyExisting,
    removeItem
}