import { Grid } from "@mui/material";
import NavBar from "../components/Navbar";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

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

const LandingPage = () => {
  const [loading, setLoading] = useState(false);
  const [articleData, setArticleData] = useState<ArticleDataType[]>([]);

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
  useEffect(() => {
    fetchListOfArticles();
  }, []);

  const handleImageClick = (url: string) => {
    window.open(url, '_blank');
  };
  return (
    <>
      <div>
        <NavBar />
        <br /><br /><br />
        <Grid container justifyContent="center" spacing={2}>
            {articleData.map((item) => (
              <Grid key={item.id} item xs={12} sm={6} md={4} lg={3} onClick={() => handleImageClick(item.url)}>
                <h2>{item.title}</h2>
                <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                  <img
                    src={item.urlToImage}
                    alt={item.title}
                    style={{ width: '100%', height: 'auto' }}
                  />
                  <p>{item.description}</p>
                </div>
              </Grid>
            ))}
          </Grid>
      </div>
    </>
  );
};

export default LandingPage;
