
const generateAuthToken = (data) => {
    return jwt.sign(data, `${process.env.JWT_SECRET}`);
}


module.exports = {
    generateAuthToken,
}