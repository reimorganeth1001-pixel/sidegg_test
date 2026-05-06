export interface getTeamsResponse {
    data: Team[];
}

export type Team = {
    id: string;
    name: string;
    abbbreviation: string;
    location: string;
    displayName: string;
    shortDisplayName: string;
    slug: string;
    logo: string;
};