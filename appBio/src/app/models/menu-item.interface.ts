export interface MenuItem {
    id: string;
    label: string;
    route: string;
    icon?: string;
    active?: boolean;
    roles: string[];
}