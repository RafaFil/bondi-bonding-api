const staticTextModel = require('../models/static.model');
const staticTextService = require('../services/static.service');


const getAllFaqs = async (req, res) => {
    const faqs = await staticTextService.getAllFaqs();
    if(faqs.length === 0) {
        res.status(404).json({error:"not found"});
    }
    if(faqs){
        return res.status(200).send(faqs);
    }
}

const getAllTos = async (req, res) => {
    const tos = await staticTextService.getAllToS();
    return res.status(200).send(tos);
}

module.exports = {
    getAllFaqs, getAllTos
}

