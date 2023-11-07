import { useGetTopSellingProductsQuery } from '../../features/products/productsApiSlice'
import { Bar } from 'react-chartjs-2'
import React, { useEffect, useState } from 'react'
import { IProduct } from '../../interfaces'
import styles from './topSellers.module.css'
import { categoryLabels, categoryNames } from '../../consts'

interface IDataset {
    label: string
    data: Array<number>
    backgroundColor: Array<string>
}

interface IChart {
    labels: Array<string>
    datasets: Array<IDataset>
}

const TopSellers = () => {
    const {
        data: products,
    } = useGetTopSellingProductsQuery()
    const [chartData, setChartData] = useState<IChart>({} as IChart)
    const [chosenCategory, setChosenCategory] = useState<string>('spark_plugs')
    const [chosenCategoryName, setChosenCategoryName] =
        useState<string>('Spark Plugs')

    useEffect(() => {
        const getRandomColors = (iterationCount: number) => {
            const colors = ['#FB9902', '#FD5308', '#66B132', '#0392CE', '#FFFE34']
            const arr = []
            for (let i = 0; i < iterationCount; i++) {
                const randomNum = Math.round((colors.length - 1) * Math.random())
                arr.push(colors[randomNum])
            }
            return arr
        }
        if (products && products.length) {
            const spark_plugs = products.filter(
                (product) => product.category_name === 'spark_plugs'
            )
            const ignition_coils = products.filter(
                (product) => product.category_name === 'ignition_coils'
            )
            const airbag_cables = products.filter(
                (product) => product.category_name === 'airbag_cables'
            )
            const crankshaft_sensors = products.filter(
                (product) => product.category_name === 'crankshaft_sensors'
            )
            const camshaft_sensors = products.filter(
                (product) => product.category_name === 'camshaft_sensors'
            )
            const ignition_coil_mouthpieces = products.filter(
                (product) =>
                    product.category_name === 'ignition_coil_mouthpieces'
            )
            let categoryArray: Array<IProduct> = []
            switch (chosenCategory) {
                case 'spark_plugs':
                    categoryArray = spark_plugs
                    setChosenCategoryName('Spark Plugs')
                    break
                case 'ignition_coils':
                    categoryArray = ignition_coils
                    setChosenCategoryName('Ignition Coils')
                    break
                case 'airbag_cables':
                    categoryArray = airbag_cables
                    setChosenCategoryName('Airbag Cables')
                    break
                case 'crankshaft_sensors':
                    categoryArray = crankshaft_sensors
                    setChosenCategoryName('Crankshaft Sensors')
                    break
                case 'camshaft_sensors':
                    categoryArray = camshaft_sensors
                    setChosenCategoryName('Camshaft Sensors')
                    break
                case 'ignition_coil_mouthpieces':
                    setChosenCategoryName('Ignition Coil Mouthpieces')
                    categoryArray = ignition_coil_mouthpieces
            }

            const labels = categoryArray?.map(
                (item) =>
                    `${item.brand} ${
                        item.model?.toUpperCase() || item.detail_number
                    }`
            )
            const chartData = {
                labels,
                datasets: [
                    {
                        label: 'Sold products amount',
                        data: categoryArray?.map(
                            (item) => item.total_count || 0
                        ),
                        backgroundColor: getRandomColors(categoryArray.length),
                    },
                ],
            }

            setChartData(chartData)
        }
    }, [products, chosenCategory])

    const handleCategoryBtnClick = (category: string) => {
        setChosenCategory(category)
    }

    return (
        <div className={styles.container}>
            <h1>{chosenCategoryName}</h1>
            <div className={styles.btns_container}>
                {categoryLabels.map((item, index) => (
                    <button
                        className={chosenCategory === item ? styles.active : ''}
                        key={item}
                        onClick={() => handleCategoryBtnClick(item)}
                    >
                        {categoryNames[index]}
                    </button>
                ))}
            </div>
            {chartData.labels && (
                <div className={styles.chart_container}>
                    <Bar
                        data={chartData}
                    />
                </div>
            )}
        </div>
    )
}

export default TopSellers
