import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from 'react-redux';
// import {
//   decrement,
//   increment,
//   incrementByAmount,
//   incrementAsync,
//   incrementIfOdd,
//   selectCount,
// } from "./redux/counter/counterSlice";
// import styles from './styles/Counter.module.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/login";
import Contact from "./pages/contact/Contact";
import Book from "./pages/book/Book";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home/Home";
import Register from "./pages/register/Register";
import { callFetchAccount } from "./services/api";
import { useDispatch, useSelector } from "react-redux";
import { doGetAccountAction } from "./redux/account/accountSlice";
import Loading from "./components/Loading/Loading";
import Error from "./pages/error/Error";
import Admin from "./pages/admin/Admin";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import LayoutAdmin from "./pages/admin/layout-admin/LayoutAdmin";


// const LayoutAdmin = () =>{
//   const isAdminRoute = window.location.pathname.startsWith('/admin')
//   const user = useSelector(state => state.account.user);
//   const userRole = user.role;

//   return (
//     <div className="layout-app">
//       {isAdminRoute && userRole === 'ADMIN' && <Header/>}

//       <Outlet/>

//       {isAdminRoute && userRole === 'ADMIN' && <Footer/>}
//     </div>
//   )
// }
const Layout = () => {
  return (
    <div className="layout-class">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};
export default function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.account.isLoading)

  const getAccount = async () => {
    if (
      window.location.pathname === '/login'
      || window.location.pathname === '/register'
    )
      return;

    const res = await callFetchAccount();
    if (res && res.data) {
      dispatch(doGetAccountAction(res.data))
    }
  }

  useEffect(() => {
    getAccount();
  }, [])


  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout/>,
      errorElement: <Error/>,

      children: [
        { index: true, element: <Home /> },
        {
          path: "contact",
          element: <Contact />,
        },
        {
          path: "book",
          element: <Book />,
        },
      ],  
    },

    {
      path: "/admin",
      element: <LayoutAdmin/>,
      errorElement: <Error/>,

      children: [
        { index: true, element: <ProtectedRoute>
          <Admin/>
        </ProtectedRoute> },
        {
          path: "user",
          element: <Contact />,
        },  
        {
          path: "book",
          element: <Book />,
        },
      ],  
    },

    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "register",
      element: <Register />,
    },
  ]);
  return (
    <>
    {
      isLoading === false
        || window.location.pathname === '/login'
        || window.location.pathname === '/register'
        || window.location.pathname === '/'
        ?
        <RouterProvider router={router} />
        :
        <Loading />
    }
  </>
)
}