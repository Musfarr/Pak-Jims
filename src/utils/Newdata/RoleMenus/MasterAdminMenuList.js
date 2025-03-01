// Master Admin has access to all menus
import { menuList } from "../../fackData/menuList";

// Log the menuList to make sure it's imported correctly
console.log("Original menuList imported:", menuList);
console.log("Original menuList length:", menuList.length);

export const MasterAdminMenuList = menuList;
