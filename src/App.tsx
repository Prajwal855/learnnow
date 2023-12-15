
import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/Landingpage';
import Signup from './components/SignUp';
import Login from './components/Login';
import OTPConfirmation from './components/Otpscreen';
import Academics from './components/Academics';
import Home from './components/Home';
import Course from './components/Course';
import Chapter from './components/Chapters';
import StudyMaterials from './components/StudyMaterils';
import ChaptersList from './components/ChaptersList';
import QuizForm from './components/QuizForm';
import QuizQuestions from './components/QuizQuestions';
import Result from './components/Result';

function App() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path = '/signup' element = {<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/otp_confirmation' element={<OTPConfirmation/>}/>
      <Route path='/create_academics' element={<Academics/>}/>
      <Route path='/create_course' element={<Course/>}/>
      <Route path='/create_chapters' element={<Chapter/>}/>
      <Route path='/Create_Study_Material' element={<StudyMaterials/>}/>
      <Route path='/Home' element={<Home/>}/>
      <Route path='/chapters' element={<ChaptersList/>}/>
      <Route path='/Quiz_form' element={<QuizForm/>}/>
      <Route path='/Quiz' element={<QuizQuestions/>}/>
      <Route path='/Result' element={<Result/>}/>
    </Routes>
  );
}

export default App;