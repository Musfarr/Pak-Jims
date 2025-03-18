// Master Admin has access to all menus
import { menuList } from "../../fackData/menuList";

// Log the menuList to make sure it's imported correctly
console.log("Original menuList imported:", menuList);
console.log("Original menuList length:", menuList.length);

export const MasterAdminMenuList = [ ...menuList,

    {
        id: 0,
        name: "Institutes",
        path: "#",
        icon: 'feather-airplay',
        dropdownMenu: [
            {
                id: 1,
                name: "Institutes List",
                path: "/institutes",
                subdropdownMenu: false
            },
            {
                id: 2,
                name: "Create Institutes",
                path: "/institutes/create",
                subdropdownMenu: false
            }
        ]
    },

];
