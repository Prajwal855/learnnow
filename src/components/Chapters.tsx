import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Loading from './Loading';
import { Box, Button, CssBaseline, FormControl, InputLabel, MenuItem, Select, TextField, ThemeProvider, createTheme } from '@mui/material';
import logo from '../assets/images/logo-gif.gif';

const defaultTheme = createTheme();

const Chapter = () => {
    const [chapterName, setChapterName] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const [coursesId, setCoursesId] = useState<string>('');
    const [coursesOptions, setCoursesOptions] = useState<Array<{ id: string; name: string }>>([]);

    useEffect(() => {
        const savedAccessToken = localStorage.getItem("AccessToken");

        axios
            .get('http://localhost:3000/courses', {
                headers: {
                    token: `${savedAccessToken}`,
                },
            })
            .then((response) => {
                setCoursesOptions(response.data.courses);
                console.log("Courses", response.data.courses);
            })
            .catch((error) => {
                console.error("Error fetching Categories options", error);
            });
    }, []);

    const handleChapterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChapterName(event.target.value);
    };

    const handleChapterSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            const savedAccessToken = localStorage.getItem("AccessToken");
            const response = await axios.post("http://localhost:3000/chapters", {
                chapter: {
                    chap: chapterName,
                    course_id: coursesId
                }
            }, {
                headers: {
                    token: `${savedAccessToken}`,
                },
            });
            toast.success("Chapter Created");
            navigate('/Create_Study_Material');
            console.log("i got response", response)
        } catch (error) {
            toast.error("Chapter unable to create");
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
                            <h2 className='otp_text'>Chapter</h2>
                            <div>
                                <FormControl sx={{ m: 1, minWidth: 200, width: '100%' }} size="small">
                                    <InputLabel id="demo-simple-select-label">Course</InputLabel>
                                    <Select
                                        labelId="CategoryLabel"
                                        id="CategoryId"
                                        value={coursesId}
                                        onChange={(e) => setCoursesId(e.target.value as string)}
                                        fullWidth
                                    >
                                        {coursesOptions.map(option => (
                                            <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <br />
                                <br />
                                <TextField id="filled-hidden-label-normal"
                                    defaultValue="" label="Chapter Name" variant="outlined"
                                    placeholder="Enter the Chapter Name"
                                    value={chapterName}
                                    onChange={handleChapterChange}
                                    style={{marginLeft:'10px'}}
                                /><br /><br />
                                <Button data-testid='submit' variant="contained" onClick={handleChapterSubmit}>Create Chapter</Button>
                            </div>
                            <ToastContainer />
                        </div>
                    </Box>
                </ThemeProvider>
            )}
        </>
    );
};

export default Chapter;