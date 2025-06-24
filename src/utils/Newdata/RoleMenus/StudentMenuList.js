// Student has access to learning-related menus
export const StudentMenuList = [
    {
        id: 0,
        name: "dashboard",
        path: "#",
        icon: 'feather-airplay',
        dropdownMenu: [
            {
                id: 1,
                name: "Student",
                path: "/student-dashboard",
                subdropdownMenu: []
            }
        ]
    },
    // {
    //     id: 1,
    //     name: "courses",
    //     path: "#",
    //     icon: 'feather-book',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "My Courses",
    //             path: "/courses/enrolled",
    //             subdropdownMenu: []
    //         },
    //         {
    //             id: 2,
    //             name: "Course Catalog",
    //             path: "/courses/catalog",
    //             subdropdownMenu: []
    //         },
    //         {
    //             id: 3,
    //             name: "Assignments",
    //             path: "/courses/assignments",
    //             subdropdownMenu: []
    //         }
    //     ]
    // },
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
    //             name: "Calender",
    //             path: "/applications/calender",
    //             subdropdownMenu: []
    //         },
    //     ]
    // },
    // {
    //     id: 3,
    //     name: "grades",
    //     path: "#",
    //     icon: 'feather-award',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "My Grades",
    //             path: "/grades/view",
    //             subdropdownMenu: []
    //         },
    //         {
    //             id: 2,
    //             name: "Transcripts",
    //             path: "/grades/transcripts",
    //             subdropdownMenu: []
    //         }
    //     ]
    // },
    // {
    //     id: 4,
    //     name: "library",
    //     path: "#",
    //     icon: 'feather-book-open',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "Resources",
    //             path: "/library/resources",
    //             subdropdownMenu: []
    //         },
    //         {
    //             id: 2,
    //             name: "E-Books",
    //             path: "/library/ebooks",
    //             subdropdownMenu: []
    //         }
    //     ]
    // },
    // {
    //     id: 5,
    //     name: "profile",
    //     path: "#",
    //     icon: 'feather-user',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "View Profile",
    //             path: "/profile/view",
    //             subdropdownMenu: []
    //         },
    //         // {
    //         //     id: 2,
    //         //     name: "Edit Profile",
    //         //     path: "/profile/edit",
    //         //     subdropdownMenu: []
    //         // }
    //     ]
    // },
    {
        id: 6,
        name: "QEC",
        path: "#",
        icon: 'feather-award',
        dropdownMenu: [
            {
                id: 1,
                name: "QEC Questionnaires",
                path: "/general-qec-list",
                subdropdownMenu: []
            },
            // {
            //     id: 2,
            //     name: "Edit Profile",
            //     path: "/profile/edit",
            //     subdropdownMenu: []
            // }
        ]
    }
];
