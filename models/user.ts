interface IUserMetadata {
    profession: string;
    source: string;
    about_yourself: string;
}

interface IUser {
    PIN: string;
    phone_number: string;
    nickname: string;
    email: string;
    language: string;
    metadata: IUserMetadata;
    created_at: Date;
    updated_at: Date;
    last_login: Date;
    hashed_phone_number: string;
    onboarding_completed: boolean;
    roles: string;
}

export type { IUser, IUserMetadata };