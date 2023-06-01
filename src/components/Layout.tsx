import React from 'react';
import { Outlet} from "react-router-dom";
import Header from "./Header/Header";
import LeftBar from "./LeftBar/LeftBar";

const Layout = () => {


    return (
        <div>
            <Header />
            <div className="main_container">
                <LeftBar />
                <div className="main">
                    <Outlet/>
                </div>
            </div>
        </div>
    );
};

export default Layout;