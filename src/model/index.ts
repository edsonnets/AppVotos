export interface User {
    id?: number,
    name: string,
    last_name: string,
    id_card: string,
    email: string,
    phone: string,
    address: string,
    password: string,
    avatar: string,
    is_active: boolean,
    last_login_ip?: string
    last_login_at?: Date
}

export interface Candidate {
    id?: number;
    name: string;
    party: string;
    party_full_name: string;
    party_logo: string;
    photo: string;
    color: string;
    election_type_category_id: number;
    list_order: number;
    list_name: string;
}

export interface Vote {
    id?: number;
    quantity: number;
    vote_status: string;
    voting_table_id: number;
    candidate_id: number;
    election_type_id: number;
    election_type_category_id: number;
    user_id: number;
    registered_at?: Date;
    created_at?: Date;
    updated_at?: Date;
}

export interface VotingTableCategoryResult {
    voting_table_id: number;
    election_type_category_id: number;
    valid_votes: number;
    blank_votes: number;
    null_votes: number;
    total_votes: number;
    is_consistent: boolean;
    inconsistencies?: string;
    status: string;
    entered_by: number;
    entered_at?: Date;
    created_at?: Date;
    updated_at?: Date;
}

export interface RegisterVoteRequest {
    categoryResult: VotingTableCategoryResult[];
    votesByCandidate: Pick<Vote, 'voting_table_id' | 'election_type_category_id' | 'candidate_id' | 'quantity' | 'election_type_id' | 'user_id'>[];
}
