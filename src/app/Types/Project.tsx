export type Project = {
    title: string;
    type: string;
    link: string;
    languages: Record<string, number>;
    photos: string[];
    feature: boolean;
}