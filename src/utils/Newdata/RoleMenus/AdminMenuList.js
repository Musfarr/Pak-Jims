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
        icon: 'feather-award',
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
            },
            {
                id: 4,
                name: "Course Setup",
                path: "/courses/setup",
                subdropdownMenu: []
            }
        ]
    },
    {
        id: 7,
        name: "programs",
        path: "#",
        icon: 'feather-award',
        dropdownMenu: [
            {
                id: 1,
                name: "Program List",
                path: "/programs/list",
                subdropdownMenu: []
            },
            {
                id: 2,
                name: "Add Program",
                path: "/programs/add",
                subdropdownMenu: []
            }
        ]
    },
    {
        id: 8,
        name: "departments",
        path: "#",
        icon: 'feather-briefcase',
        dropdownMenu: [
            {
                id: 1,
                name: "Department List",
                path: "/departments/list",
                subdropdownMenu: []
            },
            {
                id: 2,
                name: "Add Department",
                path: "/departments/add",
                subdropdownMenu: []
            }
        ]
    },
    {
        id: 9,
        name: "classes",
        path: "#",
        icon: 'feather-layers',
        dropdownMenu: [
            {
                id: 1,
                name: "Class List",
                path: "/classes/list",
                subdropdownMenu: []
            },
            {
                id: 2,
                name: "Add Class",
                path: "/classes/add",
                subdropdownMenu: []
            }
        ]
    },
    {
        id: 10,
        name: "academic years",
        path: "#",
        icon: 'feather-briefcase',
        dropdownMenu: [
            {
                id: 1,
                name: "Academic Year List",
                path: "/academic-years/list",
                subdropdownMenu: []
            },
            {
                id: 2,
                name: "Add Academic Year",
                path: "/academic-years/add",
                subdropdownMenu: []
            }
        ]
    },
    {
        id: 11,
        name: "batches",
        path: "#",
        icon: 'feather-users',
        dropdownMenu: [
            {
                id: 1,
                name: "Batch List",
                path: "/batches/list",
                subdropdownMenu: []
            },
            {
                id: 2,
                name: "Add Batch",
                path: "/batches/add",
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
