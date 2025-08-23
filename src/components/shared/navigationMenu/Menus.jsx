import React, { Fragment, useEffect, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
// import { menuList } from "@/utils/fackData/menuList";
import getIcon from "@/utils/getIcon";

import { 
    MasterAdminMenuList, 
    SuperAdminMenuList, 
    FacultyMenuList, 
    StudentMenuList 
} from "@/utils/Newdata/RoleMenus";
import { getAdminMenuList } from "@/utils/Newdata/RoleMenus/AdminMenuList";
import { useAuth } from "../../../context/AuthContext";

const Menus = () => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [openSubDropdown, setOpenSubDropdown] = useState(null);
    const [activeParent, setActiveParent] = useState("");
    const [activeChild, setActiveChild] = useState("");
    const pathName = useLocation().pathname;
    const { role, permissions } = useAuth();
    
    console.log("Current user role:", role);

    // Get the appropriate menu list based on user role
    const getMenuListByRole = () => {
        // Convert role to lowercase for case-insensitive comparison
        const roleLC = role ? role.toLowerCase() : '';
        switch(roleLC) {
            case "masteradmin":
                return MasterAdminMenuList;
            case "super_admin":
                return SuperAdminMenuList;
            case "admin":
                return getAdminMenuList(permissions);
            case "faculty":
                return FacultyMenuList;
            case "student":
                return StudentMenuList;
            default:
                return StudentMenuList;
        }
    };

    const menuList = getMenuListByRole();
    console.log("Menu list items count:", menuList.length);

    const handleMainMenu = (e, name) => {
        if (openDropdown === name) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(name);
        }
    };

    const handleDropdownMenu = (e, name) => {
        e.stopPropagation();
        if (openSubDropdown === name) {
            setOpenSubDropdown(null);
        } else {
            setOpenSubDropdown(name);
        }
    };

    useEffect(() => {
        if (pathName !== "/") {
            const x = pathName.split("/");
            setActiveParent(x[1]);
            setActiveChild(x[2]);
            setOpenDropdown(x[1]);
            setOpenSubDropdown(x[2]);
        } else {
            setActiveParent("dashboards");
            setOpenDropdown("dashboards");
        }
    }, [pathName]);

    return (
        <>
            {menuList.map(({ dropdownMenu, id, name, path, icon }) => {
                // Check if this menu item has only one dropdown item
                const hasSingleDropdownItem = dropdownMenu && dropdownMenu.length === 1;
                
                // If it has only one dropdown item, use that item's path directly
                const directPath = hasSingleDropdownItem ? dropdownMenu[0].path : path;
                
                return (
                    <li
                        key={id}
                        onClick={(e) => {
                            // Only handle dropdown menu if it has more than one item
                            if (!hasSingleDropdownItem) {
                                handleMainMenu(e, name);
                            }
                        }}
                        className={`nxl-item ${hasSingleDropdownItem ? '' : 'nxl-hasmenu'} ${activeParent === name ? "active nxl-trigger" : ""}`}
                    >
                        <Link to={directPath} className="nxl-link text-capitalize">
                            <span className="nxl-micon"> {getIcon(icon)} </span>
                            <span className="nxl-mtext" style={{ paddingLeft: "2.5px" }}>
                                {name}
                            </span>
                            {!hasSingleDropdownItem && (
                                <span className="nxl-arrow fs-16">
                                    <FiChevronRight />
                                </span>
                            )}
                        </Link>
                        {/* Only render dropdown menu if it has more than one item */}
                        {!hasSingleDropdownItem && (
                            <ul
                                className={`nxl-submenu ${openDropdown === name ? "nxl-menu-visible" : "nxl-menu-hidden"}`}
                            >
                                {dropdownMenu.map(({ id, name, path, subdropdownMenu }) => {
                                    const x = name;
                                    return (
                                        <Fragment key={id}>
                                            {subdropdownMenu && subdropdownMenu.length ? (
                                                <li
                                                    className={`nxl-item nxl-hasmenu ${activeChild === name ? "active" : ""
                                                        }`}
                                                    onClick={(e) => handleDropdownMenu(e, x)}
                                                >
                                                    <Link to={path} className={`nxl-link text-capitalize`}>
                                                        <span className="nxl-mtext">{name}</span>
                                                        <span className="nxl-arrow">
                                                            <i>
                                                                {" "}
                                                                <FiChevronRight />
                                                            </i>
                                                        </span>
                                                    </Link>
                                                    {subdropdownMenu.map(({ id, name, path }) => {
                                                        return (
                                                            <ul
                                                                key={id}
                                                                className={`nxl-submenu ${openSubDropdown === x
                                                                    ? "nxl-menu-visible"
                                                                    : "nxl-menu-hidden "
                                                                    }`}
                                                            >
                                                                <li
                                                                    className={`nxl-item ${pathName === path ? "active" : ""
                                                                        }`}
                                                                >
                                                                    <Link
                                                                        className="nxl-link text-capitalize"
                                                                        to={path}
                                                                    >
                                                                        {name}
                                                                    </Link>
                                                                </li>
                                                            </ul>
                                                        );
                                                    })}
                                                </li>
                                            ) : (
                                                <li
                                                    className={`nxl-item ${pathName === path ? "active" : ""
                                                        }`}
                                                >
                                                    <Link className="nxl-link" to={path}>
                                                        {name}
                                                    </Link>
                                                </li>
                                            )}
                                        </Fragment>
                                    );
                                })}
                            </ul>
                        )}
                    </li>
                );
            })}
        </>
    );
};

export default Menus;
