import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Loading from './Loading';
import {
  Box,
  Card,
  CardContent,
  CssBaseline,
  Grid,
  IconButton,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material';
import logo from '../assets/images/logo-udemy-purple-animation.gif';
import SideMenu from './SideMenu';
import DehazeIcon from '@mui/icons-material/Dehaze';

const defaultTheme = createTheme();


const ChaptersList = () => {
  const [loading, setLoading] = useState(false);
  const [chaptersOptions, setChaptersOptions] = useState<Array<{ id: string; chap: string }>>([]);
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const toggleDrawer = (open: boolean) => () => {
    setSidebarOpen(open);
  };

  useEffect(() => {
    const savedAccessToken = localStorage.getItem("AccessToken");

    axios
        .get('http://localhost:3000/chapters', {
            headers: {
                token: `${savedAccessToken}`,
            },
        })
        .then((response) => {
            setChaptersOptions(response.data.chapters);
            console.log("Chapters", response.data.chapters);
        })
        .catch((error) => {
            console.error("Error fetching Categories options", error);
        });
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
                <img
                  src={logo}
                  className="nav--icon"
                  alt="Learn Now Logo"
                />
              </Link>
              <h3 className="nav--logo_text">LEARN NOW</h3>
            </nav>
            <SideMenu isOpen={isSidebarOpen} toggleDrawer={toggleDrawer} />
            <div className="App">
              <h2 className="otp_text">Chapters</h2>
              <div>
                {chaptersOptions.length > 0 ? (
                  chaptersOptions.map((chapter: any) => (
                    <div key={chapter.id}>
                      <h3>{chapter.chap}</h3>
                      {chapter.studymaterials.length > 0 ? (
                        <Grid container spacing={2}>
                          {chapter.studymaterials.map((studymaterial: any) => (
                            <Grid
                              item
                              key={studymaterial.id}
                              xs={12}
                              sm={12}
                              md={12}
                            >
                              <Card style={{display:'flex'}}>
                                <CardContent >
                                  {chapter.studymaterials.length > 0 && (
                                    <div>
                                    <span> 
                                    Video: 
                                      <a
                                        href={chapter.studymaterials[0].video}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        Watch Video
                                      </a>
                                    </span>
                                    <br />
                                    <span >
                                    PDF/Doc: 
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
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <p>No StudyMaterials added for this chapter.</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No chapter found.</p>
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

export default ChaptersList;
