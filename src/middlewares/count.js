const count = async (req, res) => {
    const idx = req.decoded;
    const result = {
        success: false,
        message: '',
    };
    try {
        await redis.connect();
        await redis.set('visitor', idx);
        result.success = true;
    } catch (err) {
        res.message = err.message;
    } finally {
        redis.disconnect();
        res.send(result);
    }
};

module.exports = { count };
