import React from 'react';
import styles from "./leftBar.module.css"
import {NavLink} from "react-router-dom";
import {FaTrashAlt} from "react-icons/fa"

const LeftBar = () => {
    return (
        <div className={styles.leftbar_container}>
            <ul className={styles.leftbar_menu}>
                <li><NavLink to="/products/categories">Categories</NavLink></li>
                <li><NavLink to="/products/spark_plugs">Spark Plugs</NavLink></li>
                <li><NavLink to="/products/ignition_coils">Ignition Coils</NavLink></li>
                <li><NavLink to="/products/ignition_coil_mouthpieces">Ignition Coil Mouthpieces</NavLink></li>
                <li><NavLink to="/products/airbag_cables">Airbag Cables</NavLink></li>
                <li><NavLink to="/products/crankshaft_sensors">Crankshaft Sensors</NavLink></li>
                <li><NavLink to="/products/camshaft_sensors">Camshaft Sensors</NavLink></li>
                <li><NavLink to="/models">Models</NavLink></li>

                <li className={styles.trash}>Trash <FaTrashAlt /></li>
                <li><NavLink to="/notifications_history">Notifications History</NavLink></li>
                <li><NavLink to="/messages_history">Messages History</NavLink></li>
            </ul>
        </div>
    );
};

export default LeftBar;