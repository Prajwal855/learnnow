import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import {
    Box,
    Card,
    CardContent,
    CssBaseline,
    Grid,
    IconButton,
    ThemeProvider,
    createTheme,
} from '@mui/material';
import DehazeIcon from '@mui/icons-material/Dehaze';
import logo from '../assets/images/logo-gif.gif';
import SideMenu from './SideMenu';
import Loading from './Loading';

const defaultTheme = createTheme();

interface StudyMaterial {
    id: number;
    video: string;
    softcopy: string;
}

interface Chapter {
    id: number;
    chap: string;
    studymaterials: StudyMaterial[];
}

interface Course {
    id: number;
    name: string;
    chapters: Chapter[];
}

const CourseList = () => {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

    const toggleDrawer = (open: boolean) => () => {
      setSidebarOpen(open);
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const savedAccessToken = localStorage.getItem("AccessToken");
                const response = await axios.get('http://localhost:3000/courses', {
                    headers: {
                        token: `${savedAccessToken}`,
                    },
                });
                setCourses(response.data.courses);
                console.log("Courses", response.data.courses);
            } catch (error) {
                console.error("Error fetching Courses", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

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
                    <IconButton
                onClick={toggleDrawer(true)}
                color="inherit"
                style={{ marginLeft: '1px' }}
              >
                <DehazeIcon />
              </IconButton>
                            <Link to="/Home">
                                <img src={logo} className="nav--icon" alt="Learn Now Logo" />
                            </Link>
                            <h3 className="nav--logo_text">LEARN NOW</h3>
                        </nav>
                        <SideMenu isOpen={isSidebarOpen} toggleDrawer={toggleDrawer} />
                        <div className="App">
                            <h2 className="otp_text">Courses</h2>
                            <div>
                                {courses.length > 0 ? (
                                    courses.map((course) => (
                                        <div key={course.id}>
                                            <h3>{course.name}</h3>
                                            {course.chapters.length > 0 ? (
                                                <Grid container spacing={2}>
                                                    {course.chapters.map((chapter) => (
                                                        <Grid
                                                            item
                                                            key={chapter.id}
                                                            xs={12}
                                                            sm={12}
                                                            md={12}
                                                        >
                                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                <Card>
                                                                    <CardContent>
                                                                        <h4>{chapter.chap}</h4>
                                                                        {chapter.studymaterials.length > 0 && (
                                                                            <div>
                                                                                <span>
                                                                                    Video:{' '}
                                                                                    <a
                                                                                        href={chapter.studymaterials[0].video}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                    >
                                                                                        Watch Video
                                                                                    </a>
                                                                                </span>
                                                                                <br />
                                                                                <span>
                                                                                    PDF/Doc:{' '}
                                                                                    <a
                                                                                        href={chapter.studymaterials[0].softcopy}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                    >
                                                                                        Download Softcopy
                                                                                    </a>
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </CardContent>
                                                                </Card>
                                                            </div>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            ) : (
                                                <p>No chapters added for this course.</p>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p>No courses found.</p>
                                )}
                            </div>
                            <ToastContainer />
                        </div>
                    </Box>
                </ThemeProvider>
            )}
        </>
    );
};

export default CourseList;
