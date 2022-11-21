
const MAP_URL = process.env.MAP_URL;
const MAP_KEY = process.env.MAP_KEY;

const getMap = async (req, res) => {
    if (MAP_URL && MAP_KEY) {
        return res.json({
            success: true,
            data: `${MAP_URL}?key=${MAP_KEY}`
        });
    } 
    res.json({
        success: false,
        message: 'Environment missing map variables.'
    });
}

module.exports = {
    getMap
}