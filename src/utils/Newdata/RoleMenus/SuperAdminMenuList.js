// Super Admin has access to most menus except some system settings
export const SuperAdminMenuList = [
    {
        id: 0,
        name: "dashboards",
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
        id: 1,
        name: "Branches",
        path: "#",
        icon: 'feather-list',
        dropdownMenu: [
            {
                id: 1,
                name: "Branches List",
                path: "/branches",
                subdropdownMenu: []
            },
            {
                id: 2,
                name: "Create Branch",
                path: "/create-branch",
                subdropdownMenu: []
            },
        ]
    },


    // {
    //     id: 2,
    //     name: "applications",
    //     path: '#',
    //     icon: 'feather-send',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "Chat",
    //             path: "/applications/chat",
    //             subdropdownMenu: []
    //         },
    //         {
    //             id: 2,
    //             name: "Email",
    //             path: "/applications/email",
    //             subdropdownMenu: []
    //         },
    //         {
    //             id: 3,
    //             name: "Tasks",
    //             path: "/applications/tasks",
    //             subdropdownMenu: []
    //         },
    //         {
    //             id: 4,
    //             name: "Notes",
    //             path: "/applications/notes",
    //             subdropdownMenu: []
    //         },
    //         {
    //             id: 5,
    //             name: "Calender",
    //             path: "/applications/calender",
    //             subdropdownMenu: []
    //         },
    //     ]
    // },
    {
        id: 5,
        name: "users",
        path: "#",
        icon: 'feather-users',
        dropdownMenu: [
            {
                id: 1,
                name: "Admin Management",
                path: "/users/admin",
                subdropdownMenu: []
            },
            {
                id: 2,
                name: "Faculty Management",
                path: "/users/faculty",
                subdropdownMenu: []
            },
            {
                id: 3,
                name: "Student Management",
                path: "/users/students",
                subdropdownMenu: []
            }
        ]
    },
    // {
    //     id: 8,
    //     name: "settings",
    //     path: "#",
    //     icon: 'feather-settings',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "General",
    //             path: "/settings/general",
    //             subdropdownMenu: []
    //         },
    //         {
    //             id: 2,
    //             name: "Security",
    //             path: "/settings/security",
    //             subdropdownMenu: []
    //         },
    //         {
    //             id: 3,
    //             name: "Notifications",
    //             path: "/settings/notifications",
    //             subdropdownMenu: []
    //         }
    //     ]
    // },
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
            }
        ]
    },
];
