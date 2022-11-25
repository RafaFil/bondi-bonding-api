const { updateProfile } = require('../models/profile.model');

const updateFilters = async (req, res) => {
    const username = req.params.username;

    if (!req.body?.filters) {
        return res.status(400).json({
            success: false,
            message: 'No filters were included in the request.'
        });
    }

    const fieldsToChange = {
        filters: req.body.filters
    };

    updateProfile(username, fieldsToChange)
    .then( result => {
        if (result.acknowledged) { 
            return res.status(200).json({
                success: true,
                data: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s).`
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Error during update with the given parameters.'
            });
        }
    })
    .catch( err => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message:'Internal server error'
        });
    });

};

module.exports = {
    updateFilters
};