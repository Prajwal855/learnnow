import { Button, TextField } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Loading from './Loading';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid } from '@mui/material';

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

const OTPConfirmation: React.FC = () => {
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleOtpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(event.target.value);
  };

  const handleVerifyOtp = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const savedAccessToken = localStorage.getItem("AccessToken");
      const response =  await axios.post("http://localhost:3000/users/sms_confirmation", {
        pin: otp,
      }, {
        headers: {
          token: `${savedAccessToken}`,
        },
      });
      toast.success("OTP Verified");
      console.log("i got response", response)
      navigate("/create_academics");
    } catch (error) {
      toast.error("Worng OTP");
    }
    finally{
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
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
    <div className='App'>
      <h2 className='otp_text'>OTP Confirmation</h2>
      <p className='description_text'>Please enter the OTP sent to your registered phone number.</p>
      <div>
        <TextField id="filled-hidden-label-normal"
            defaultValue="" label="OTP" variant="filled"
          placeholder="Enter OTP"
          value={otp}
          onChange={handleOtpChange}
        /><br/><br/>
        <Button data-testid='submit' variant="contained"  onClick={handleVerifyOtp}>Verify OTP</Button>
      </div>
      <ToastContainer />
    </div>
    </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
   )}
   </>
 );
};

export default OTPConfirmation;