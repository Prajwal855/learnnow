import { Button, Grid, IconButton, InputBase, Stack, Typography, alpha, styled } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import logo from '../assets/images/logo-gif.gif';
import courseImage from '../assets/images/courseimage.jpg';
import CreateQuiz from '../assets/images/create_quiz.jpeg';
import createstudymaterial from '../assets/images/Create_studyMaterial.jpg';
import createChapter from '../assets/images/createchap.jpg';
import youtubelogo from '../assets/images/download (6).png'
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import DehazeIcon from '@mui/icons-material/Dehaze';
import SearchIcon from '@mui/icons-material/Search';
import SideMenu from './SideMenu';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

interface ArticleDataType {
  id: number;
  source: {
    id: null | string;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [articleData, setArticleData] = useState<ArticleDataType[]>([]);
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const toggleDrawer = (open: boolean) => () => {
    setSidebarOpen(open);
  };

  const fetchListOfArticles = async () => {
    setLoading(true);
    try {

      const randomWords = ['apple', 'tesla' ];


      const randomWord = randomWords[Math.floor(Math.random() * randomWords.length)];

      const response = await axios.get(
        `http://localhost:3000/all_articles?q=${randomWord}`
      );
      setArticleData(response.data.articles);
    } catch (error) {
      console.error(error);
      toast.error('Error fetching articles');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = async () => {
    setLoading(true);
    try {
      const savedAccessToken = localStorage.getItem('AccessToken');
      if (!savedAccessToken) {
        throw new Error('Access token not found');
      }

      const response = await axios.delete(
        'http://localhost:3000/users/sign_out',
        {
          headers: {
            token: savedAccessToken,
          },
        }
      );
      console.log('i got response', response);
      toast.success('Logout Successful');
      localStorage.removeItem('AccessToken');
      localStorage.removeItem('Questions');
      navigate('/login');
    } catch (error) {
      console.error(error);
      toast.error('Unable to logout');
    } finally {
      setLoading(false);
    }
  };
  const [userRole, setUserRole] = useState('');

  const fetchUserRole = async () => {
    try {
      const savedAccessToken = localStorage.getItem('AccessToken');
      if (!savedAccessToken) {
        throw new Error('Access token not found');
      }

      const response = await axios.get('http://localhost:3000/user', {
        headers: {
          token: savedAccessToken,
        },
      });

      const role = response.data.user.role;
      console.log('i got response for user', response);
      console.log('i got the role', role);
      setUserRole(role);
    } catch (error) {
      console.error(error);
      toast.error('Error fetching user role');
    }
  };

  useEffect(() => {
    fetchListOfArticles();
    fetchUserRole();
  }, []);

  const isAdminOrTeacher = userRole === 'admin' || userRole === 'teacher';

  const handleCreateCourseClick = async () => {
    setLoading(true);
    navigate('/create_course');
  };

  const handleCreateQuestionsClick = async () => {
    setLoading(true);
    navigate('/create_questions');
  };

  const handleTakeQuizClick = async () => {
    setLoading(true);
    navigate('/Quiz_form');
  };
  const handleYouTubeClick = async () => {
    setLoading(true);
    navigate('/youtube');
  };

  const handleCreateChapterClick = async () => {
    setLoading(true);
    navigate('/create_chapters');
  };

  const handleCreateStudyMaterialClick = async () => {
    setLoading(true);
    navigate('/Create_Study_Material');
  };

  const handleImageClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <nav>
            <IconButton onClick={toggleDrawer(true)} color="inherit" style={{ marginLeft: '1px' }}>
              <DehazeIcon />
            </IconButton>
            <img src={logo} className="nav--icon" />
            <h3 className="nav--logo_text">LEARN NOW</h3>

            <Stack spacing={2} direction="row">
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
            {userRole === 'student' && (
                <Button onClick={handleTakeQuizClick} variant="contained">
                  Take Quiz
                </Button>
              )}
             <img src={youtubelogo} className="youtube--icon" onClick={handleYouTubeClick}/>
              <Button onClick={handleLogoutClick} variant="contained">
                Logout
              </Button>
            </Stack>

          </nav>
          <div>
            <SideMenu isOpen={isSidebarOpen} toggleDrawer={toggleDrawer} />
            <br /><br /><br />
            <Grid container justifyContent="center" spacing={2}>
              {isAdminOrTeacher ? (
                <>
                  <Grid item xs={12} md={9}>
                    <Grid container spacing={2}>
                      {articleData.slice(0, 8).map((item) => (
                        <Grid key={item.id} item xs={12} onClick={() => handleImageClick(item.url)}>
                          <Typography style={{ color: '#000', fontSize:'50px', fontWeight:700}}>{item.title}</Typography>
                          <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                            <img
                              src={item.urlToImage}
                              alt={item.title}
                              style={{ width: '100%', height: 'auto' }}
                            />
                            <Typography style={{ color: '#000'}}>{item.description}</Typography>
                          </div>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Stack spacing={2}>
                      <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={handleCreateCourseClick}>
                    <img src={courseImage} alt="create Course" style={{ width: '100%', height: 'auto' }} />
                    </div>
                    <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={handleCreateChapterClick}>
                      <img src={createChapter} alt="create chapter" style={{ width: '100%', height: 'auto' }} />
                    </div>
                    <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={handleCreateStudyMaterialClick}>
                      <img src={createstudymaterial} alt="create study material" style={{ width: '100%', height: 'auto' }} />
                    </div>
                    <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={handleCreateQuestionsClick}>
                      <img src={CreateQuiz} alt="create quiz" style={{ width: '100%', height: 'auto' }} />
                    </div>
                    </Stack>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} md={12}>
                    <Grid container spacing={2}>
                      {articleData.slice(0, 12).map((item) => (
                        <Grid key={item.id} item xs={12} onClick={() => handleImageClick(item.url)}>
                           <Typography style={{ color: '#000', fontSize:'50px', fontWeight:700}}>{item.title}</Typography>
                          <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                            <img
                              src={item.urlToImage}
                              alt={item.title}
                              style={{ width: '100%', height: 'auto' }}
                            />
                            <Typography style={{ color: '#000'}}>{item.description}</Typography>
                          </div>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
