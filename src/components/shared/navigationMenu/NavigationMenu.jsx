import React, { useContext, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiSunrise } from "react-icons/fi";
import PerfectScrollbar from "react-perfect-scrollbar";
import Menus from './Menus';

import { NavigationContext } from '../../../contentApi/navigationProvider';


const NavigationManu = () => {
    const { navigationOpen, setNavigationOpen } = useContext(NavigationContext)
    const pathName = useLocation().pathname
    useEffect(() => {
        setNavigationOpen(false)
    }, [pathName])
    return (
        <nav className={`nxl-navigation ${navigationOpen ? "mob-navigation-active" : ""}`}>
            <div className="navbar-wrapper">
                <div className="m-header flex items-center justify-center">
                    <Link to="/" className="b-brad flex items-center " style={{justifyContent:'center'}}>
                        {/* <!-- ========   change your logo hear   ============ --> */}
                        <img src="/images/logolarge.webp" alt="logo" style={{height:'65px'}} className="logo logo-lg w-20" />
                        {/* <h1 className='logo logo-lg' >Flair</h1> */}
                        <img src="/images/logo2.png" alt="logo" className="logo logo-sm" />
                    </Link>
                </div>

                <div className={`navbar-content`}>
                    <PerfectScrollbar>
                        <ul className="nxl-navbar">
                            <li className="nxl-item nxl-caption">
                                <label>Navigation</label>
                            </li>
                            <Menus />
                        </ul>
                        <div style={{ height: "18px" }}></div>
                    </PerfectScrollbar>
                </div>
            </div>
            <div onClick={() => setNavigationOpen(false)} className={`${navigationOpen ? "nxl-menu-overlay" : ""}`}></div>
        </nav>
    )
}

export default NavigationManu