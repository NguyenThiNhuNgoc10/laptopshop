import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import { routes } from './routes';
import { useQuery } from '@tanstack/react-query'
import { isJsonString } from './utils';
import jwt_decode from "jwt-decode";
import * as UserService from './services/UserServices'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser, resetUser } from './redux/slides/userSlide';


// import 'dotenv/config'
// const dotenv = require('dotenv');
// dotenv.config('./.env') 

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector((state) => state.user)

  useEffect(() => {
    setIsLoading(true)
    const { storageData, decoded } = handleDecoded()
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData)
    }
    setIsLoading(false)
  }, [])

  const handleDecoded = () => {

    let storageData = user?.access_token || localStorage.getItem('access_token')
    let decoded = {}
    if (storageData && isJsonString(storageData) && !user?.access_token) {
      storageData = JSON.parse(storageData)
      decoded = jwt_decode(storageData)
    }
    // console.log('response.data,a[pp', storageData)
    return { storageData, decoded }

  }

  UserService.axiosJWT.interceptors.request.use(async (config) => {
    // Do something before request is sent
    const currentTime = new Date()
    const { decoded } = handleDecoded()
    const storage = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storage)
    const decodeRefreshToken = jwt_decode(refreshToken)
    if (decoded?.exp < currentTime.getTime() / 1000) {
      if (decodeRefreshToken?.exp > currentTime.getTime() / 1000) {
        const data = await UserService.refreshToken(refreshToken)
        config.headers['token'] = `Bearer ${data?.access_token}`
      } else {
        dispatch(resetUser())
      }
    }
    return config;
  }, (error) => {
    return Promise.reject(error)
  })

  const handleGetDetailsUser = async (id, token) => {
    const storage = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storage)
    // lay duoc du lieu tu backend
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token, refreshToken: refreshToken }))
  };


  // const fetchApi = async () => {
  //   //console.log('process.env.REACT_API_URL_BACKEND', process.env.REACT_APP_API_URL)
  //   const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all`)
  //   return res.data
  // }
  // const query = useQuery({ queryKey: ['todos'], queryFn: fetchApi })
  // console.log('query', query)

  return (
    <div style={{ height: '100vh', width: '100%' }}>

      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page
            const ischeckAuth = !route.isPrivate || user.isAdmin || ''
            const Layout = route.isShowHeader ? DefaultComponent : Fragment
            return (
              <Route key={route.path} path={ischeckAuth && route.path} element={
                <Layout>
                  <Page />
                </Layout>
              } />
            )
          })}
        </Routes>
      </Router>
    </div>
  )
}

export default App