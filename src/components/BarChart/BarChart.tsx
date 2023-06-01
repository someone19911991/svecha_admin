import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import { useGetAnalyticMutation } from '../../features/order/orderApiSlice'
import { months, categoryNames } from '../../consts'
import styles from './chart.module.css'

Chart.register(...registerables)

const BarChart = () => {
    const [dataType, setDataType] = useState('sum')
    const [countData, setCountData] = useState<Array<number>>([])
    const [sumData, setSumData] = useState<Array<number>>([])
    const chartData = {
        labels: categoryNames,
        datasets: [
            {
                label: dataType === 'sum' ? 'Sold products sum' : 'Sold products amount',
                data: dataType === 'sum' ? sumData : countData,
                backgroundColor: [
                    '#ffc827',
                    'seagreen',
                    'red',
                    'teal',
                    'seagreen',
                ],
            },
        ],
    }
    const [getAnalytic] = useGetAnalyticMutation()
    const dateNow = new Date()
    const year = dateNow.getFullYear()
    const month = dateNow.getMonth()
    const monthsArray = months.slice(0, month + 1)

    const getDate = async (monthIndex: number) => {
        const monthFrom =
            monthIndex + 1 < 10 ? `0${monthIndex + 1}` : monthIndex + 1
        const monthTo =
            monthIndex + 2 < 10 ? `0${monthIndex + 2}` : monthIndex + 2
        const dateFrom = `${year}/${monthFrom}/01`
        const dateTo = `${year}/${monthTo}/01`
        try {
            const result = await getAnalytic({ dateFrom, dateTo }).unwrap()
            const sums = result.map((item) => item.sum)
            const counts = result.map((item) => item.count)
            setSumData(sums)
            setCountData(counts)
        } catch (err) {
            console.log({ err })
        }
    }

    useEffect(() => {
        const firstAnalytic = async () => {
            await getDate(month)
        }
        firstAnalytic()
    }, [])


    return (
        <div>
            <div className={styles.months}>
                {monthsArray.map((monthItem, index) => (
                    <button key={monthItem} onClick={() => getDate(index)}>
                        <span className={month === index ? styles.active_month : ''}>{monthItem}</span>
                    </button>
                ))}
                <button className={styles.data_type_btn} onClick={() => setDataType(dataType === 'sum' ? 'amount' : 'sum')}>{dataType === 'sum' ? 'Show Amount' : 'Show Sum'}</button>
            </div>
            <Bar data={chartData} />
        </div>
    )
}

export default BarChart
