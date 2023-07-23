const AppError = require('../utils/AppError');
const Election = require('../models/electionModel');

// This checks if the election is active
exports.isElectionActive = async (req, res, next) => {
    try {
        const electionId = req.params.electionId;
        const election = await Election.findById(electionId);
        req.election = election;
        if (!election) throw new AppError('Election does not exist', 400)
        const date = Date.now();
        // const election = await Election.findById(post.election);
        if (!(election.start < date && election.end > date)) {
            throw new AppError('Cannot participate in an election that is not active', 400)
        }



        next()






    } catch (error) {
        next(error)
    }
}