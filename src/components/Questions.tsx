import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Loading from './Loading';
import { Box, Button, CssBaseline, FormControl, InputLabel, MenuItem, Select, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';
import logo from '../assets/images/logo-gif.gif';

const defaultTheme = createTheme();

const CreateQuestion = () => {
    const [question, setQuestion] = useState<string>('');
    const [correctAnswer, setCorrectAnswer] = useState<string>('');
    const [level, setLevel] = useState<string>('');
    const [language, setLanguage] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [choices, setChoices] = useState<string[]>(['']);
    const navigate = useNavigate();

    const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuestion(event.target.value);
    };

    const handleCorrectAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCorrectAnswer(event.target.value);
    };
    const handleChoiceChange = (index: number, event: any) => {
        const updatedChoices = [...choices];
        updatedChoices[index] = event.target.value;
        setChoices(updatedChoices);
    };

    const handleAddOption = () => {
        if (choices.length < 5) {
            setChoices([...choices, '']);
        } else {
            toast.warning("Cannot add more than 5 choices");
        }
    };

    const handleQuestionSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            const savedAccessToken = localStorage.getItem("AccessToken");
            const questionResponse = await axios.post("http://localhost:3000/questions", {
                question: {
                    que: question,
                    correct_answer: correctAnswer,
                    level: level,
                    language: language
                }
            }, {
                headers: {
                    token: `${savedAccessToken}`,
                },
            });
            const questionId = questionResponse.data.question.id;
            const choicesPromises = choices.map((option, index) => {
                return axios.post("http://localhost:3000/choices", {
                    choice: {
                        option: option,
                        question_id: questionId
                    }
                }, {
                    headers: {
                        token: `${savedAccessToken}`,
                    },
                });
            });
            await Promise.all(choicesPromises);
            toast.success("Question and Choices Created");
            console.log("i got response", questionResponse);
        } catch (error) {
            toast.error("Question and Choices unable to create");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <ThemeProvider theme={defaultTheme}>
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <nav className="fixed-navbar">
                            <Link to="/Home">
                                <img src={logo} className="nav--icon" alt="Learn Now Logo" />
                            </Link>
                            <h3 className="nav--logo_text">LEARN NOW</h3>
                        </nav>
                        <div className='App'>
                            <h2 className='otp_text'>Question</h2>
                            <div>
                              
                                <TextField
                                    id="filled-hidden-label-normal"
                                    defaultValue=""
                                    label="Question"
                                    variant="outlined"
                                    placeholder="Enter the question"
                                    value={question}
                                    onChange={handleQuestionChange}
                                    style={{ marginLeft: '10px', width:'1000px' }}
                                /><br /><br />
                                <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
                    <InputLabel id="demo-simple-select-label">Level</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        placeholder="difficult-type"
                        value={level}
                        label="Level"
                        onChange={(e)=>setLevel(e.target.value)}
                        style={{  width:'1000px' }}
                    >
                        <MenuItem value={'level1'}>Level 1</MenuItem>
                        <MenuItem value={'level2'}>Level 2</MenuItem>
                        <MenuItem value={'level3'}>Level 3</MenuItem>
                    </Select>
                </FormControl>
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
                        style={{  width:'1000px' }}
                    >
                        <MenuItem value={'Ruby'}>Ruby</MenuItem>
                        <MenuItem value={'ReactNative'}>React Native</MenuItem>
                        <MenuItem value={'ReactJS'}>React JS</MenuItem>
                        <MenuItem value={'ManualQA'}>Manual QA</MenuItem>
                    </Select>
                </FormControl>

                <br/><br/>
               
                                <TextField
                                    id="filled-hidden-label-normal"
                                    defaultValue=""
                                    label="Correct Answer"
                                    variant="outlined"
                                    placeholder="Enter the correct answer"
                                    value={correctAnswer}
                                    onChange={handleCorrectAnswerChange}
                                    style={{ marginLeft: '10px' , width:"1000px"}}
                                /><br /><br />
                                 <Typography variant="h6" style={{ fontWeight: 600 }}>Options</Typography>
                                 <br />
                                 {choices.map((choice, index) => (
                    <div key={index}>
                        <TextField
                            id={`choice-${index + 1}`}
                            defaultValue=""
                            label={`Choice ${index + 1}`}
                            variant="outlined"
                            placeholder={`Enter choice ${index + 1}`}
                            value={choice}
                            onChange={(event) => handleChoiceChange(index, event)}
                            style={{ marginLeft: '10px' , width:"1000px"}}
                        /><br /><br />
                    </div>
                ))}
                <Button variant="contained" onClick={handleAddOption}>Add Option</Button>
                <br /><br />
                <Button variant="contained" onClick={handleQuestionSubmit}>Create Question</Button>
                                
                            </div>
                            <ToastContainer />
                        </div>
                    </Box>
                </ThemeProvider>
            )}
        </>
    );
};

export default CreateQuestion;
