// Admin has access to management menus but limited settings
export const AdminMenuList = [
    {
        id: 0,
        name: "dashboards",
        path: "#",
        icon: 'feather-airplay',
        dropdownMenu: [
            {
                id: 1,
                name: "Admin",
                path: "/admin-dashboard",
                subdropdownMenu: []
            },
            {
                id: 2,
                name: "Analytics",
                path: "/dashboards/analytics",
                subdropdownMenu: []
            }
        ]
    },
  



    {
        id: 5,
        name: "Students",
        path: "#",
        icon: 'feather-users',
        dropdownMenu: [
            {
                id: 1,
                name: " Student Create",
                path: "/create-student",
                subdropdownMenu: []
            },
            {
                id: 2,
                name: "Student List",   
                path: "/student-list",
                subdropdownMenu: []
            }
        ]
    },


    {
        id: 5,
        name: "Faculty",
        path: "#",
        icon: 'feather-users',
        dropdownMenu: [
            {
                id: 1,
                name: "Faculty Create",
                path: "/create-faculty",
                subdropdownMenu: []
            },
            {
                id: 2,
                name: "Faculty List",
                path: "/faculty-list",
                subdropdownMenu: []
            }
        ]
    },
    {
        id: 6,
        name: "courses",
        path: "#",
        icon: 'feather-book',
        dropdownMenu: [
            {
                id: 1,
                name: "Course List",
                path: "/courses/list",
                subdropdownMenu: []
            },
            {
                id: 2,
                name: "Add Course",
                path: "/courses/add",
                subdropdownMenu: []
            },
            {
                id: 3,
                name: "Course Categories",
                path: "/courses/categories",
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
    //             name: "Profile",
    //             path: "/settings/profile",
    //             subdropdownMenu: []
    //         },
    //         {
    //             id: 2,
    //             name: "Notifications",
    //             path: "/settings/notifications",
    //             subdropdownMenu: []
    //         }
    //     ]
    // }
];
