const AppError = require('./AppError')
exports.checkIfCanAddPost = async (election, next) => {
    const date = Date.now();
    if (!(election.start > date)) {
        return next(new AppError('Cannot add a post while election is ongong or has ended', 400))
    }

}

exports.checkIfCanAddCandidate = async (Election, electioId, next) => {
    try {

        const election = await Election.findById(electioId);
        const date = Date.now();
        if (!(election.start > date)) {
            throw new AppError('Cannot add a candidate while election is ongong or has ended', 400)
        }
    } catch (error) {
        next(error)
    }
}
// election.start > date --has not started

// election.end > date -- has not ended