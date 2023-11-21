import { Button, Grid, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import logo from "../assets/images/logo-udemy-purple-animation.gif";
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';

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

  const fetchListOfArticles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/all_articles?language=en"
      );
      setArticleData(response.data.articles);
    } catch (error) {
      console.error(error);
      toast.error('Error fetching articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListOfArticles();
  }, []);

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
      navigate('/login');
    } catch (error) {
      console.error(error);
      toast.error('Unable to logout');
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (url: string) => {
    // Navigate to the article URL
    window.open(url, '_blank');
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <nav>
            <img src={logo} className="nav--icon" />
            <h3 className="nav--logo_text">LEARN NOW</h3>
            <Stack spacing={2} direction="row">
              <Button onClick={handleLogoutClick} variant="outlined">
                Logout
              </Button>
            </Stack>
          </nav>
          <br/><br/><br/>
          <Grid container justifyContent="center" spacing={2}>
            {articleData.map((item) => (
              <Grid key={item.id} item xs={12} sm={6} md={4} lg={3}>
                <h2>{item.title}</h2>
                <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleImageClick(item.url)}>
                  <img
                    src={item.urlToImage}
                    alt={item.title}
                    style={{ width: '100%', height: 'auto' }}
                  />
                  <p>{item.description}</p>
                  <p>Published At: {item.publishedAt}</p>
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
      )}
    </>
  );
};

export default Home;
