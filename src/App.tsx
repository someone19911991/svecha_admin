import React, { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from './hooks/redux'
import { useRefreshMutation } from './features/auth/authApiSlice'
import { setCredentialsAction } from './features/auth/authSlice'
import SignIn from './pages/SignIn/SignIn'
import { routes } from './routes'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Loading from "./components/Loading/Loading";

const App = () => {
    const dispatch = useAppDispatch()
    const [initialized, setInitialized] = useState(false)
    const { accessToken } = useAppSelector((state) => state.auth)
    const [refresh] = useRefreshMutation()
    useEffect(() => {
        if (!accessToken) {
            refresh()
                .unwrap()
                .then((res) => {
                    setInitialized(true)
                    dispatch(setCredentialsAction(res))
                })
                .catch(() => setInitialized(true))
        }
    }, [])

    if (!initialized) {
        return <Loading/>
    }

    if (!accessToken) {
        return <SignIn />
    }

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {routes.map((route) => {
                    let element: JSX.Element
                    if(route.path === '/notifications'){
                        element = <route.element status="pending"/>
                    }else if(route.path === '/messages'){
                        element = <route.element status="pending"/>
                    }else if(route.path === '/notifications_history'){
                        element = <route.element status="sold"/>
                    }else if(route.path === '/messages_history'){
                        element = <route.element status="accepted"/>
                    }else{
                        element = <route.element status=""/>
                    }
                    return (<Route
                        key={route.path}
                        path={route.path}
                        element={element}
                    />)
                })}
            </Route>
            <Route path="*" element={<Navigate to="/" />}></Route>
        </Routes>
    )
}

export default App
