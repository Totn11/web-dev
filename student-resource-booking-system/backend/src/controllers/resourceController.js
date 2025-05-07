import Resource from '../models/resourceModel.js';

const manageResources = {
    fetchAll: async function(requestObj, responseObj) {
        let resultData;
        try {
            resultData = await Resource.find().sort({ updatedAt: -1 });
            responseObj.status(200).send(resultData);
        } catch (err) {
            responseObj.status(500).send({ msg: 'Failed to fetch resources', details: err });
        }
    },

    addNew: async function(requestObj, responseObj) {
        const resourceInfo = {
            name: requestObj.body.name,
            description: requestObj.body.description,
            category: requestObj.body.category,
            availableSlots: requestObj.body.availableSlots,
        };

        try {
            let newItem = new Resource(resourceInfo);
            let savedItem = await newItem.save();
            responseObj.status(201).send(savedItem);
        } catch (err) {
            responseObj.status(500).send({ msg: 'Creation failed', details: err });
        }
    },

    modifyExisting: async function(requestObj, responseObj) {
        const itemId = requestObj.params.id;
        const changes = requestObj.body;

        try {
            let result = await Resource.findByIdAndUpdate(
                itemId, 
                changes,
                { new: true, runValidators: true }
            );
            
            if (!result) {
                return responseObj.status(404).send({ msg: 'Item not found in database' });
            }
            responseObj.status(200).send(result);
        } catch (err) {
            responseObj.status(500).send({ msg: 'Update operation failed', details: err });
        }
    },

    removeItem: async function(requestObj, responseObj) {
        const itemId = requestObj.params.id;

        try {
            let result = await Resource.findByIdAndDelete(itemId);
            if (!result) {
                return responseObj.status(404).send({ msg: 'Item not found in database' });
            }
            responseObj.status(200).send({ msg: 'Successfully removed item' });
        } catch (err) {
            responseObj.status(500).send({ msg: 'Deletion failed', details: err });
        }
    }
};

export default manageResources;