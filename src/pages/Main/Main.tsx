import React, {useEffect} from 'react';
import styles from "./main.module.css"
import BarChart from "../../components/BarChart/BarChart";



const Main = () => {

    return (
        <div className={styles.main_container}>
            <BarChart />
        </div>
    );
};

export default Main;