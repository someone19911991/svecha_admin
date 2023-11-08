import styles from './pagination.module.css'
import {useEffect, useState} from "react";

interface IPagination {
    itemsCount: number
    itemsPerPage: number
    active: number
    setActive: (arg: number) => void
}

const Pagination = ({
    itemsCount,
    itemsPerPage,
    active,
    setActive
}: IPagination) => {
    const [pages, setPages] = useState<Array<string>>([])
    const pageItemsCount = 7
    const pagesCount = Math.ceil(itemsCount / itemsPerPage)
    const nextToFirst = pageItemsCount - 3
    const prevToLast = pagesCount - 4

    const handleChangePage = (page: number) => {
        setActive(page)
    }


    useEffect(() => {
        if(pagesCount <= pageItemsCount){
            setPages(new Array(pagesCount).fill(undefined).map((item, index) => `${index + 1}`))
        }else if(active <= 1 + nextToFirst){
            setPages(['1', '2', '3', '4', '5', '...', `${pagesCount}`])
        }else if(active >= prevToLast && active <= pagesCount){
            setPages(['1', '...', `${pagesCount - 4}`, `${pagesCount - 3}`, `${pagesCount - 2}`, `${pagesCount - 1}`, `${pagesCount}`])
        }else{
            setPages(['1', '...', `${active}`, `${active + 1}`, `${active + 2}`, '...', `${pagesCount}`])
        }
    }, [active, pagesCount])

    if (itemsCount <= itemsPerPage) {
        return <></>
    }

    return (
        <div className={styles.container}>
            <div
                className={`${styles.pageItem} ${active <= 1 ? styles.disabled : ''}`}
                onClick={() => {
                    if(active > 1){
                        setActive(active - 1)
                    }
                }}
            >
                Prev
            </div>
            {pages.map((item, index) => (
                <div
                    className={`${styles.pageItem} ${active === +item ? styles.active : ''}`}
                    key={item + index}
                    onClick={() => {
                        if(item !== '...'){
                            handleChangePage(+item)
                        }
                    }}
                >
                    {item}
                </div>
            ))}
            <div
                className={`${styles.pageItem} ${active >= pagesCount ? styles.disabled : ''}`}
                onClick={() => {
                    if(active < pagesCount){
                        setActive(active + 1)
                    }
                }}
            >
                Next
            </div>
        </div>
    )
}

export default Pagination
