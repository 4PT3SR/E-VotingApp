interface Election {
    _id: string
    title: string
    election_type: string
    start: string
    end: string
    department_eligibility?: string
    college_eligibility?: string
    createdAt: string
    updatedAt: string
    __v: number
}
export interface Posts extends Election {
    posts: string[]
}

export interface FullElection extends Election {
    posts: {
        _id: string
        title: string
        candidates: {
                _id: string
                fullname: string
                votes: number
        }[]
    }[]
}

export interface Post {
    _id: string
    title: string
    candidates: {
        _id: string
        image?: string
        fullname: string
        votes: number
        post: string
        createdAt: string
        updatedAt: string
        __v: number
    }[]
    election: string
    createdAt: string
    updatedAt: string
    __v: number
}