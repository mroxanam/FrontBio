import { MenuItem } from '../models/menu-item.interface';

export const MENU_ITEMS: MenuItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        route: '/dash',
        icon: 'dashboard',
        roles: ['Manager', 'Cliente', 'Tecnico', 'Administracion']
    },
    {
        id: 'users',
        label: 'Usuarios',
        route: '/dash/users',
        icon: 'people',
        roles: ['Manager', 'Administracion']
    },
    {
        id: 'reports',
        label: 'Reportes',
        route: '/dash/reports',
        icon: 'assessment',
        roles: ['Manager', 'Administracion', 'Tecnico']
    },
    {
        id: 'settings',
        label: 'Configuración',
        route: '/dash/settings',
        icon: 'settings',
        roles: ['Administracion']
    }
];