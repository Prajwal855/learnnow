import { Alert, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/images/logo-gif.gif';


const QuizForm = () => {
    const [loading, setLoading] = useState(false);
    const [difficult, setDifficult] = useState<string>('');
    const [language, setLanguage] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
      
        if (difficult && language) {
          try {
            localStorage.removeItem('Questions');
            const savedAccessToken = localStorage.getItem("AccessToken");
            const response = await axios.get(`http://localhost:3000/getquestion?lang=${language}&difficult=${difficult}`, {
              headers: {
                token: `${savedAccessToken}`,
              }
            });
            toast.success("Quiz Started");
            console.log('I got response', response.data.questions);
            localStorage.setItem('Questions', JSON.stringify(response.data.questions));
            navigate('/Quiz');
            setLoading(true);
          } catch (error) {
            toast.error('Unable to take Quiz');
          } finally {
            setLoading(false);
          }
        }
    };

    return(
        <div>
               <nav className="fixed-navbar">
              <Link to="/Home">
                <img
                  src={logo}
                  className="nav--icon"
                  alt="Learn Now Logo"
                />
              </Link>
              <h3 className="nav--logo_text">LEARN NOW</h3>
            </nav>
            <div>
            <br/><br/><br/><br/><br/><br/>
            <Alert severity="info" style={{ textAlign: 'left', width: '50%', height:'75%', backgroundBlendMode:'inherit' }}>
                <strong>Quiz Instructions:</strong>
                <li>This quiz consists of 25 questions.</li>
                <li>Each question is multiple-choice, with one correct answer.</li>
                <li>You have a total of 15 minutes to complete the quiz.</li>
                <li>Ensure you submit your answers before the timer runs out.</li>
                <li>Points are awarded for each correct answer, and there is no penalty for incorrect answers.</li>
                <li>Review your answers before submitting to maximize your score.</li>
                <li>Once you submit the quiz, you will receive instant feedback on your performance.</li>
                <li>Share your results on social media and challenge your friends to beat your score.</li>
                <li>If you encounter technical issues, please contact support for assistance.</li>
                <li>Good luck! Start the quiz by clicking the "Take Test" button below.</li>
            </Alert>
            <br/><br/><br/><br/>
            <form style={{marginLeft:"5%"}} onSubmit={handleSubmit}>
              <br/>
            <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
                    <InputLabel id="demo-simple-select-label">Language</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        placeholder="language-type"
                        value={language}
                        label="Language"
                        onChange={(e)=>setLanguage(e.target.value)}
                    >
                        <MenuItem value={'Ruby'}>Ruby</MenuItem>
                        <MenuItem value={'ReactNative'}>React Native</MenuItem>
                        <MenuItem value={'ReactJS'}>React JS</MenuItem>
                        <MenuItem value={'ManualQA'}>Manual QA</MenuItem>
                    </Select>
                </FormControl>
                <br/>
                <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
                    <InputLabel id="demo-simple-select-label">Level</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        placeholder="difficult-type"
                        value={difficult}
                        label="Level"
                        onChange={(e)=>setDifficult(e.target.value)}
                    >
                        <MenuItem value={'level1'}>Level 1</MenuItem>
                        <MenuItem value={'level2'}>Level 2</MenuItem>
                        <MenuItem value={'level3'}>Level 3</MenuItem>
                    </Select>
                </FormControl>
              
                <br/><br/><br/><br/>
                <Button style={{ marginLeft: '4%',marginBottom:'20px'}} data-testid='submit' variant="contained" type="submit" disabled={!difficult||!language} onClick={handleSubmit}>Take Test</Button>
            </form>
            <ToastContainer />
            </div>
        </div>
    );
};

export default QuizForm;
