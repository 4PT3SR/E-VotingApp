const AppError = require('../utils/AppError');


// This checks if the election is active
exports.isElectionActive = async (req, res, next) => {
    try {
        const election = req.election;
        console.log(election);
        next()






    } catch (error) {
        next(error)
    }
}