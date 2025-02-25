export   const StudentMenuList = [
    {
        id: 0,
        name: "Home",
        path: "#",
        icon: 'feather-airplay',
        dropdownMenu: [
            {
                id: 1,
                name: "CRM",
                path: "/",
                subdropdownMenu: false
            },
            
        ]
    },
    {
        id: 5,
        name: "Profile",
        path: "#",
        icon: 'feather-users',
        dropdownMenu: [
            
            {
                id: 1,
                name: "Profile View",
                path: "/customers/view",
                subdropdownMenu: false
            },
            
        ]
    },
]