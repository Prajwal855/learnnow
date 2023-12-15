import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import { Grid } from '@mui/material';
import logo from "../assets/images/logo-udemy-purple-animation.gif";

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        www.learnnow.com
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignIn() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setError('');
};

const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setPassword(event.target.value);
  setError('');
};

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setLoading(true);
  localStorage.removeItem("AccessToken");

  try {
    const response = await axios.post("http://localhost:3000/users/sign_in", {
      user: {
        email: email,
        password: password
      }
    });
    console.log("i got response", response);
    navigate('/Home');
    localStorage.setItem("AccessToken", response.data.meta.token);
  } catch (error : any) {
    if (error.response && error.response.status === 404) {
     
      toast.error("User not found. Please check your credentials.");
    } else {
      toast.error("OTP Not Verified or Academics Not Add to your profile");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <>
    {loading ? (
      <Loading />
    ) : (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
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
            <Link href="/">
            <img src={logo} className="nav--icon" alt="Learn Now Logo" />
              </Link>
              <h3 className="nav--logo_text">LEARN NOW</h3>
          </nav>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
         < div className="App">
          <h1 className="tital_text">Sign in</h1>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleEmailChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handlePasswordChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            </div>
            <ToastContainer />
          </Box>
          <Grid item>
                <Link href="http://localhost:3001/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
    )}
    </>
  );
};