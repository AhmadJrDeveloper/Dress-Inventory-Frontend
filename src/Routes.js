import React from 'react'
import {Route, Routes} from 'react-router-dom';
import Dresses from './components/Dresses';
import Accessory from './components/Accessory';
import Users from './components/Users';
import Branches from './components/Branches';
import Sell from './components/Sell';
import Rent from './components/Rent';
import RentLog from './components/RentLog';
import SignIn from './pages/SignIn';


function AppRoutes() {
  return (
        <Routes>
            <Route exact path = "/signIn" element = {<SignIn  />} />
            <Route exact path = "/فساتين" element = {<Dresses />} />
            <Route exact path = "/الاكسسوارات" element = {<Accessory />} />
            <Route exact path = "/الموظفين" element = {<Users />} />
            <Route exact path = "/الفروع" element = {<Branches />} />
            <Route exact path = "/المبيعات" element = {<Sell />} />
            <Route exact path = "/التأجير" element = {<Rent />} />
            <Route exact path = "/عرض الفاساتين المأجرة" element = {<RentLog />} />
        </Routes>
    )
}

export default AppRoutes