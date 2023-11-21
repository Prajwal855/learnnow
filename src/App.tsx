
import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/Landingpage';
import Signup from './components/SignUp';
import Login from './components/Login';
import OTPConfirmation from './components/Otpscreen';
import Academics from './components/Academics';
import Home from './components/Home';

function App() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path = '/signup' element = {<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/otp_confirmation' element={<OTPConfirmation/>}/>
      <Route path='/create_academics' element={<Academics/>}/>
      <Route path='/Home' element={<Home/>}/>
    </Routes>
  );
}

export default App;