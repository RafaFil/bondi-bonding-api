const { getByType } = require('../models/static.model');


const getAllFaqs = async (req, res) => {
    getByType('faq')
    .then( faqs => {
        if (faqs.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No FAQs were found.`
            });
        }

        return res.status(200).json({
            success: true,
            data: faqs
        });
    })
    .catch( err => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: `Internal server error.`
        });
    });
}

const getAllTos = async (req, res) => {
    getByType('tos')
    .then( tos => {
        if (tos.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No ToS were found'
            });
        }

        return res.status(200).json({
            success: true,
            data: tos[0].text
        });
    })
    .catch( err => {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: `Internal server error.`
        });
    });
    
}

module.exports = {
    getAllFaqs, getAllTos
}

