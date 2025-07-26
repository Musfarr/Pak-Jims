// Super Admin has access to most menus except some system settings
export const SuperAdminMenuList = [
    {
        id: 0,
        name: "dashboard",
        path: "#",
        icon: 'feather-airplay',
        dropdownMenu: [
            {
                id: 1,
                name: "Super Admin",
                path: "/super-admin-dashboard",
                subdropdownMenu: []
            },
            // {
            //     id: 2,
            //     name: "Analytics",
            //     path: "/dashboards/analytics",
            //     subdropdownMenu: []
            // }
        ]
    },

    {
        id: 100,
        name: "Institutes",
        path: "#",
        icon: 'feather-airplay',
        dropdownMenu: [
            {
                id: 101,
                name: "Institutes List",
                path: "/institutes",
                subdropdownMenu: false
            },
            {
                id: 102,
                name: "Institutes Create",
                path: "/institutes/create",
                subdropdownMenu: false
            }
        ]
    },
    {
        id: 1,
        name: "Branches",
        path: "#",
        icon: 'feather-list',
        dropdownMenu: [
            {
                id: 1,
                name: "Branches List",
                path: "/branch/list",
                subdropdownMenu: []
            },
            // {
            //     id: 2,
            //     name: "Create Branch",
            //     path: "/branch/create",
            //     subdropdownMenu: []
            // },
        ]
    },

    {
        id: 5,
        name: "Admins",
        path: "#",
        icon: 'feather-users',
        dropdownMenu: [
            {
                id: 1,
                name: "Admin Management",
                path: "/super-admin/admin/list",
                subdropdownMenu: []
            },
            
        ]
    },
   
    
    {
        id: 200,
        name: "Roles & Permissions",
        path: "#",
        icon: 'feather-shield',
        dropdownMenu: [
            {
                id: 201,
                name: "Modules",
                path: "/modules",
                subdropdownMenu: []
            },
            {
                id: 202,
                name: "Roles",
                path: "/roles",
                subdropdownMenu: []
            },
            {
                id: 203,
                name: "Create Role",
                path: "/roles/create",
                subdropdownMenu: []
            }
        ]
    }
];
