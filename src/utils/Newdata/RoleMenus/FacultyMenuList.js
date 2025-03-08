// Faculty has access to teaching-related menus
export const FacultyMenuList = [
    {
        id: 0,
        name: "dashboards",
        path: "#",
        icon: 'feather-airplay',
        dropdownMenu: [
            {
                id: 1,
                name: "Faculty",
                path: "/faculty-dashboard",
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
                name: "Calender",
                path: "/applications/calender",
                subdropdownMenu: []
            },
        ]
    },
    {
        id: 3,
        name: "courses",
        path: "#",
        icon: 'feather-book',
        dropdownMenu: [
            {
                id: 1,
                name: "My Courses",
                path: "/courses/my-courses",
                subdropdownMenu: []
            },
            {
                id: 2,
                name: "Course Materials",
                path: "/courses/materials",
                subdropdownMenu: []
            },
            {
                id: 3,
                name: "Course List",
                path: "/courses/list",
                subdropdownMenu: []
            }
        ]
    },
    {
        id: 4,
        name: "students",
        path: "#",
        icon: 'feather-users',
        dropdownMenu: [
            {
                id: 1,
                name: "My Students",
                path: "/students/list",
                subdropdownMenu: []
            },
            {
                id: 2,
                name: "Grades",
                path: "/students/grades",
                subdropdownMenu: []
            },
            {
                id: 3,
                name: "Attendance",
                path: "/students/attendance",
                subdropdownMenu: []
            }
        ]
    },
    {
        id: 5,
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
