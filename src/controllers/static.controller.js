const { getByType } = require('../services/static.service');


const getAllFaqs = async (req, res) => {
    const faqs = await getByType("faq");
    if (faqs.length === 0) {
        return res.status(404).json({error:"not found"});
    }
    if (faqs) {
        return res.status(200).json(faqs);
    }
}

const getAllTos = async (req, res) => {
    const tos = await getByType("text");
    if (tos.length === 0) {
        return res.status(404).json({error:"not found"});
    }
    if (tos) {
        return res.status(200).json(tos);
    }
}

module.exports = {
    getAllFaqs, getAllTos
}

