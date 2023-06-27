interface Election {
    _id: string
    title: string
    election_type: string
    start: string
    end: string
    department_eligibility: string
    createdAt: string
    updatedAt: string
    __v: number
}
export interface Posts extends Election {
    posts: string[]
}

export interface FullElection extends Election {
    posts: object[]
}