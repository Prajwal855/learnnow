// YouTubeFeature.tsx
import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import { Stack, alpha, styled, InputBase, Grid, Paper, Typography, Link } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import logo from '../assets/images/logo-gif.gif';

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

interface Video {
  id: { videoId: string };
  snippet: { title: string };
}

const YouTubeFeature: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [clickedVideo, setClickedVideo] = useState<Video | null>(null);

  useEffect(() => {
      fetchYouTubeVideos();
  }, []);

  const onVideoSelect = (video: Video) => {
    setClickedVideo(video);
    setSelectedVideo(video);
  };

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchYouTubeVideos();
    }
  };

  const fetchYouTubeVideos = async () => {
    try {
      const response = await axios.get(
        'https://www.googleapis.com/youtube/v3/search',
        {
          params: {
            part: 'snippet',
            maxResults: 5,
            q: searchQuery,
            key: 'AIzaSyAcMIlyBJ1C3npcOCngBFON8hBY_pH7d9s', 
          },
        }
      );

      setVideos(response.data.items);
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
    }
  };

  return (
    <div>
      <nav>
        <Link href="/Home">
              <img src={logo} className="nav--icon" alt="Learn Now Logo" />
        </Link>
        <h3 className="nav--logo_text">LEARN NOW</h3>
        <Stack spacing={2} direction="row">
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              onChange={handleSearchInputChange}
              onKeyPress={handleKeyPress}
            />
          </Search>
        </Stack>
      </nav>
      <Grid container spacing={2}>
        {videos.map((video, index) => (
          <Grid item key={video.id.videoId} xs={12} sm={6} md={6} lg={6}>
            <Paper
              onClick={() => onVideoSelect(video)}
              style={{ cursor: 'pointer', padding: '16px', textAlign: 'center' }}
            >
              <YouTube videoId={video.id.videoId} />
              <Typography variant="subtitle2">{video.snippet.title}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default YouTubeFeature;
