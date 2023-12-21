import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Loading from './Loading';
import { Box, Button, CssBaseline, FormControl, InputLabel, MenuItem, Select, TextField, ThemeProvider, createTheme } from '@mui/material';
import logo from '../assets/images/logo-gif.gif';

const defaultTheme = createTheme();

const Course = () => {
    const [courseName, setCourseName] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [categoriesId, setCategoriesId] = useState<string>('');
    const [subCategoriesId, setSubCategoriesId] = useState<string>('');
    const [categoriesOptions, setCategoriesOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [subCategoriesOptions, setSubCategoriesOptions] = useState<Array<{ id: string; name: string }>>([]);
    const navigate = useNavigate()

    useEffect(() => {
        const savedAccessToken = localStorage.getItem("AccessToken");

        axios
            .get('http://localhost:3000/categories', {
                headers: {
                    token: `${savedAccessToken}`,
                },
            })
            .then((response) => {
                setCategoriesOptions(response.data.categorys);
                console.log("Categories", response.data.categorys);
            })
            .catch((error) => {
                console.error("Error fetching Categories options", error);
            });

        axios
            .get('http://localhost:3000/subcategories', {
                headers: {
                    token: `${savedAccessToken}`,
                },
            })
            .then((response) => {
                setSubCategoriesOptions(response.data.subcategories);
                console.log("Sub Categories", response.data.subcategories);
            })
            .catch((error) => {
                console.error("Error fetching Sub Categories options", error);
            });
    }, []);

    const handleCourseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCourseName(event.target.value);
    };

    const handleCourseSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            const savedAccessToken = localStorage.getItem("AccessToken");
            const response = await axios.post("http://localhost:3000/courses", {
                course: {
                    modul: courseName,
                    category_id: categoriesId,
                    subcategory_id: subCategoriesId
                }
            }, {
                headers: {
                    token: `${savedAccessToken}`,
                },
            });
            toast.success("Course Created");
            navigate('/create_chapters')
            console.log("i got response", response)
        } catch (error) {
            toast.error("Course unable to create");
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
                            <h2 className='otp_text'>Course</h2>
                            <div>
                                <FormControl sx={{ m: 1, minWidth: 200, width: '100%' }} size="small">
                                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                    <Select
                                        labelId="CategoryLabel"
                                        id="CategoryId"
                                        value={categoriesId}
                                        onChange={(e) => setCategoriesId(e.target.value as string)}
                                        fullWidth
                                    >
                                        {categoriesOptions.map(option => (
                                            <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <br />
                                <FormControl sx={{ m: 1, minWidth: 200, width: '100%' }} size="small">
                                    <InputLabel id="demo-simple-select-label">Sub Category</InputLabel>
                                    <Select
                                        labelId="subCategoriesIdLabel"
                                        id="subCategoriesId"
                                        value={subCategoriesId}
                                        onChange={(e) => setSubCategoriesId(e.target.value as string)}
                                        fullWidth
                                    >
                                        {subCategoriesOptions.map(option => (
                                            <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <br />
                                <TextField id="filled-hidden-label-normal"
                                    defaultValue="" label="Course Name" variant="outlined"
                                    placeholder="Enter the Course Name"
                                    value={courseName}
                                    onChange={handleCourseChange}
                                    style={{marginLeft:'10px'}}
                                /><br /><br />
                                <Button data-testid='submit' variant="contained" onClick={handleCourseSubmit}>Create Course</Button>
                            </div>
                            <ToastContainer />
                        </div>
                    </Box>
                </ThemeProvider>
            )}
        </>
    );
};

export default Course