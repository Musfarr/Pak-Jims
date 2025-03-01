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
        id: 2,
        name: "applications",
        path: '#',
        icon: 'feather-send',
        dropdownMenu: [
            {
                id: 1,
                name: "Chat",
                path: "/applications/chat",
                subdropdownMenu: []
            },
            {
                id: 2,
                name: "Email",
                path: "/applications/email",
                subdropdownMenu: []
            },
            {
                id: 3,
                name: "Tasks",
                path: "/applications/tasks",
                subdropdownMenu: []
            },
            {
                id: 4,
                name: "Calender",
                path: "/applications/calender",
                subdropdownMenu: []
            },
        ]
    },
    {
        id: 5,
        name: "users",
        path: "#",
        icon: 'feather-users',
        dropdownMenu: [
            {
                id: 1,
                name: "Faculty Management",
                path: "/users/faculty",
                subdropdownMenu: []
            },
            {
                id: 2,
                name: "Student Management",
                path: "/users/students",
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
    {
        id: 8,
        name: "settings",
        path: "#",
        icon: 'feather-settings',
        dropdownMenu: [
            {
                id: 1,
                name: "Profile",
                path: "/settings/profile",
                subdropdownMenu: []
            },
            {
                id: 2,
                name: "Notifications",
                path: "/settings/notifications",
                subdropdownMenu: []
            }
        ]
    }
];
