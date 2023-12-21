import { useState, useRef } from 'react';
import { Button, TextField } from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';
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
import logo from '../assets/images/logo-gif.gif';

const defaultTheme = createTheme();

const StyledOTPInput = styled(TextField)`
  && {
    width: 3em;
    margin: 0 0.2em;
    input {
      text-align: center;
      font-size: 1.5em;
    }
  }
`;

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

const OTPConfirmation: React.FC = () => {
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(6).fill(null));

  const handleOtpChange = (index: number, value: string) => {
    setOtp((prevOtp) => {
      const newOtp = prevOtp.split('');
      newOtp[index] = value;
      if (value !== '' && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      return newOtp.join('');
    });
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const savedAccessToken = localStorage.getItem('AccessToken');
      const response = await axios.post(
        'http://localhost:3000/users/sms_confirmation',
        {
          pin: otp,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            token: `${savedAccessToken}`,
          },
        }
      );
      console.log('i got response', response);

      const userRole = response.data.user.role;
      if (userRole === 'admin' || userRole === 'student') {
        navigate('/login');
      } else if (userRole === 'teacher') {
        navigate('/create_academics');
      }
    } catch (error) {
      toast.error('Wrong OTP');
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
              <div className="App">
                <h2 className="otp_text">OTP Confirmation</h2>
                <p className="description_text">
                  Please enter the OTP sent to your registered phone number.
                </p>
                <div>
                  {/* Use multiple OTP input fields */}
                  {Array.from({ length: 6 }, (_, index) => (
                    <StyledOTPInput
                      key={index}
                      inputRef={(ref) => (inputRefs.current[index] = ref)}
                      id={`otp-input-${index}`}
                      label=""
                      variant="outlined"
                      type="tel"
                      inputProps={{ maxLength: 1 }}
                      value={otp[index] || ''}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                    />
                  ))}
                  <br />
                  <br />
                  <Button data-testid="submit" variant="contained" onClick={handleVerifyOtp}>
                    Verify OTP
                  </Button>
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
