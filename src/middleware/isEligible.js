const AppError = require('../utils/AppError');


const checkCollege = (userCollege, collegeEligibility) => {
    if (userCollege !== collegeEligibility) {
        throw new AppError('Sorry, you are not eligible to vote for this election', 400)
    }
}
const checkDepartment = (userDepartment, departmentEligibility) => {
    if (userDepartment !== departmentEligibility) {
        throw new AppError('Sorry, you are not eligible to vote for this election', 400)
    }
}


exports.isEligible = async (req, res, next) => {
    try {
        const user = req.user;
        const election = req.election;
        const electionType = election.election_type;
        if (electionType === 'Department') {
            checkDepartment(user.department, election.department_eligibility)
        } else if (electionType === 'College') {
            checkCollege(user.faculty, election.department_eligibility)
        }

        next()






    } catch (error) {
        next(error)
    }
}