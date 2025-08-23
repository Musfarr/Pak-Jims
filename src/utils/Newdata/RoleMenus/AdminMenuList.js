// Admin has access to management menus but limited settings

// Admin has access to management menus but limited settings

export function getAdminMenuList(permissions = []) {
    return [
    {
        id: 0,
        name: "dashboards",
        path: "/admin-dashboard",
        icon: 'feather-airplay',
        dropdownMenu: [
            {
                id: 1,
                name: "Admin Home",
                path: "/admin-dashboard",
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
        id: 7,
        name: "programs",
        path: "#",
        icon: 'feather-file-text',
        dropdownMenu: [
            permissions.includes("view_Programs") && {
                id: 1,
                name: "Program List",
                path: "/programs/list",
                subdropdownMenu: []
            },
            permissions.includes("add_Programs") && {
                id: 2,
                name: "Add Program",
                path: "/programs/add",
                subdropdownMenu: []
            }
        ].filter(Boolean)
    },




    {
        id: 6,
        name: "courses",
        path: "#",
        icon: 'feather-layers',
        dropdownMenu: [
            permissions.includes("view_Courses") && {
                id: 1,
                name: "Course List",
                path: "/courses/list",
                subdropdownMenu: []
            },
            permissions.includes("add_Courses") && {
                id: 2,
                name: "Add Course",
                path: "/courses/add",
                subdropdownMenu: []
            }
        ].filter(Boolean)
    },

    {
        id: 8,
        name: "departments",
        path: "#",
        icon: 'fa-building',
        dropdownMenu: [
            permissions.includes("view_Departments") && {
                id: 1,
                name: "Department List",
                path: "/departments/list",
                subdropdownMenu: []
            },
            permissions.includes("add_Departments") && {
                id: 2,
                name: "Add Department",
                path: "/departments/add",
                subdropdownMenu: []
            }
        ].filter(Boolean)
    },

    {
        id: 11,
        name: "batches",
        path: "#",
        icon: 'feather-users',
        dropdownMenu: [
            permissions.includes("view_Batches") && {
                id: 1,
                name: "Batch List",
                path: "/batches/list",
                subdropdownMenu: []
            },
            permissions.includes("add_Batches") && {
                id: 2,
                name: "Add Batch",
                path: "/batches/add",
                subdropdownMenu: []
            }
        ].filter(Boolean)
    },

    permissions.includes("view_Academic Years") && {
        id: 10,
        name: "academic years",
        path: "#",
        icon: 'feather-framer',
        dropdownMenu: [
            // {
            //     id: 1,
            //     name: "Academic Years",
            //     path: "/academic-years/list",
            //     subdropdownMenu: []
            // },
            permissions.includes("add_Academic Years") && {
                id: 2,
                name: "Add Academic Year",
                path: "/academic-years/add",
                subdropdownMenu: []
            }
        ].filter(Boolean)
    },
    
    {
        id: 9,
        name: "classes",
        path: "#",
        icon: 'feather-layers',
        dropdownMenu: [
            permissions.includes("view_Classes") && {
                id: 1,
                name: "Class List",
                path: "/classes/list",
                subdropdownMenu: []
            },
            permissions.includes("add_Classes") && {
                id: 2,
                name: "Add Class",
                path: "/classes/add",
                subdropdownMenu: []
            }
        ].filter(Boolean)
    },



    {
        id: 14,
        name: "Students",
        path: "#",
        icon: 'feather-users',
        dropdownMenu: [
            permissions.includes("add_Students") && {
                id: 1,
                name: "Student Create",
                path: "/create-student",
                subdropdownMenu: []
            },
            permissions.includes("view_Students") && {
                id: 2,
                name: "Student List",
                path: "/student-list",
                subdropdownMenu: []
            }
        ].filter(Boolean)
    },


    {
        id: 5,
        name: "Faculty",
        path: "#",
        icon: 'feather-user-check',
        dropdownMenu: [
            permissions.includes("add_Faculty") && {
                id: 1,
                name: "Faculty Create",
                path: "/create-faculty",
                subdropdownMenu: []
            },
            permissions.includes("view_Faculty") && {
                id: 2,
                name: "Faculty List",
                path: "/faculty-list",
                subdropdownMenu: []
            }
        ].filter(Boolean)
    },

    {
        id: 12,
        name: "QEC",
        path: "#",
        icon: 'feather-clipboard',
        dropdownMenu: [
            permissions.includes("view_QEC") && {
                id: 1,
                name: "QEC Questionnaires",
                path: "/qec-list",
                subdropdownMenu: []
            },
            permissions.includes("add_QEC") && {
                id: 2,
                name: "Create New Questionnaire",
                path: "/qec/add",
                subdropdownMenu: []
            },
            {
                id: 3,
                name: "Templates",
                path: "/templates",
                subdropdownMenu: []
            }
        ].filter(Boolean)
    },
    permissions.includes("view_Batches") && {
    
        id: 13,
        name: "Reporting",
        path: "#",
        icon: 'feather-bar-chart-2',
        dropdownMenu: [
            {
                id: 1,
                name: "Student Course Evaluation Questionnaire",
                path: "/reports/list/proforma1",
                subdropdownMenu: []
            },
            {
                id: 2,
                name: "Faculty Course Evaluation Questionnaire",
                path: "/reports/list/proforma3",
                subdropdownMenu: []
            },
            {
                id: 3,
                name: "Faculty Survey",
                path: "/reports/list/proforma5",
                subdropdownMenu: []
            },
            {
                id: 4,
                name: "Alumni Survey",
                path: "/reports/list/proforma7",
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
    ].filter(Boolean);
}
