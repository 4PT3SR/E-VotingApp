const AppError = require('../utils/AppError');
const Election = require('../models/electionModel');

// This checks if the election is active
exports.electionEnded = async (req, res, next) => {
    try {
        const electionId = req.params.electionId;
        const election = await Election.findById(electionId);
        if (!election) throw new AppError('Election does not exist', 400);
        req.election = election;
        const date = Date.now();
        // const election = await Election.findById(post.election);
        if (!(election.end < date)) {
            throw new AppError('Cannot results till election has ended', 400)
        }



        next()






    } catch (error) {
        next(error)
    }
}