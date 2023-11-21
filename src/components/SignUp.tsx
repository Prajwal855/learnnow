import React from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import '../App.css';
import Loading from './Loading';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';
import { Country, State, City }  from 'country-state-city';
import { ICountry, IState, ICity } from 'country-state-city'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
// import { ICountry, IState, ICity } from 'country-state-city';
import 'react-phone-input-2/lib/material.css';
import PhoneInput from 'react-phone-input-2';

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

const Signup = () => {
  const [email, setEmail] = useState<string>('');
  const [username, setUserName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [usernameError, setUsernameError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [phoneNumberError, setPhoneNumberError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState<boolean>(false);
  const [roleError, setRoleError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');

  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  const [selectedState, setSelectedState] = useState<IState | null>(null);
  const [selectedCity, setSelectedCity] = useState<ICity | null>(null);

  // Get all countries
  const countries = Country.getAllCountries();

  // Event handlers for dropdown changes
  const handleCountryChange = (countryCode: string) => {
    const country = countries.find((c) => c.isoCode === countryCode);
    setSelectedCountry(country || null); // Use null if country is not found
    setSelectedState(null); // Reset state when country changes
    setSelectedCity(null); // Reset city when country changes
  };

  const handleStateChange = (stateCode: string) => {
    const states = State.getStatesOfCountry(selectedCountry?.isoCode || '');
    const state = states.find((s) => s.isoCode === stateCode);
    setSelectedState(state || null); 
    setSelectedCity(null); 
  };

  const handleCityChange = (cityName: string) => {
    const cities = City.getCitiesOfState(
      selectedCountry?.isoCode || '',
      selectedState?.isoCode || ''
    );
    const city = cities.find((c) => c.name === cityName);
    setSelectedCity(city || null); 
  };


  const navigate = useNavigate();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setEmailError(false);
    setError('');
  };
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
    setUsernameError(false);
    setError('');
  };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setPasswordError(false);
    setError('');
  };

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
    setConfirmPasswordError(false);
    setError('');
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!username || !email || !phoneNumber || !password || !confirmPassword || !role) {
      setError('All fields are required');
      setUsernameError(!username);
      setEmailError(!email);
      setPhoneNumberError(!phoneNumber);
      setPasswordError(!password);
      setConfirmPasswordError(!confirmPassword);
      setRoleError(!role);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setPasswordError(true);
      setConfirmPasswordError(true);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/users', {
        user: {
          name: username,
          email: email,
          password: password,
          role: role,
          phonenumber: '+'+phoneNumber,
        },
      });
      toast.success("Account created successfully");
      console.log('i got response', response);
      localStorage.setItem('AccessToken', response.data.status.token);
      navigate('/otp_confirmation');
    } catch (error) {
      toast.error('Unable to create activity');
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
          <CssBaseline />
          <Box
            sx={{
              marginTop: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <div className="App">
                <h1 className="tital_text">Sign up</h1>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      {/* First Name */}
                      <TextField
                        id="filled-hidden-label-normal"
                        defaultValue=""
                        label="First Name"
                        variant="filled"
                        value={username}
                        onChange={handleUsernameChange}
                        placeholder="Enter Your Name"
                        error={usernameError}
                        helperText={usernameError ? 'Username is required' : ''}
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {/* Last Name */}
                      <TextField
                        id="filled-hidden-label-normal"
                        defaultValue=""
                        label="Last Name"
                        variant="filled"
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                  </Grid>
                  <br/>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      {/* Email */}
                      <TextField
                        id="filled-hidden-label-normal"
                        defaultValue=""
                        label="Email"
                        variant="filled"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter Your Email"
                        error={emailError}
                        helperText={emailError ? 'Email is required' : ''}
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {/* Password */}
                      <TextField
                        id="filled-hidden-label-normal"
                        type="password"
                        defaultValue=""
                        label="Password"
                        variant="filled"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Enter Your Password"
                        error={passwordError}
                        helperText={passwordError ? 'Password is required' : ''}
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                  </Grid>
                  <br/>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      {/* PhoneNumber */}
                      <PhoneInput
                        country={'in'}
                        value={phoneNumber}
                        onChange={(value) => setPhoneNumber(value)}
                        inputStyle={{ width: '100%' }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      {/* Confirm Password */}
                      <TextField
                        id="filled-hidden-label-normal"
                        type="password"
                        defaultValue=""
                        label="Confirm Password"
                        variant="filled"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        placeholder="Enter Your Password"
                        error={confirmPasswordError}
                        helperText={confirmPasswordError ? "Password doesn't match" : ''}
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                  </Grid>
                  <br/>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      {/* Gender */}
                      <FormControl sx={{ m: 1, minWidth: 200, width: '100%' }} size="small">
                        <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          placeholder="Role-type"
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          label="Gender"
                        >
                          <MenuItem value={'male'}>Male</MenuItem>
                          <MenuItem value={'female'}>Female</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {/* Address */}
                      <TextField
                        id="filled-hidden-label-normal"
                        defaultValue=""
                        label="Address"
                        variant="filled"
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                  </Grid>
                  <br/>
                  <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl sx={{ m: 1, minWidth: 200, width: '100%' }} size="small">
            <InputLabel>Select Country</InputLabel>
            <Select
              value={selectedCountry?.isoCode || ''}
              onChange={(e) => handleCountryChange(e.target.value as string)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {countries.map((country) => (
                <MenuItem key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
  <FormControl sx={{ m: 1, minWidth: 200, width: '100%' }} size="small">
    <InputLabel>Select State</InputLabel>
    <Select
      value={selectedState?.isoCode || ''}
      onChange={(e) => handleStateChange(e.target.value as string)}
    >
      <MenuItem value="">
        <em>None</em>
      </MenuItem>
      {State.getStatesOfCountry(selectedCountry?.isoCode || '').map((state) => (
        <MenuItem key={state.isoCode} value={state.isoCode}>
          {state.name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>

      </Grid>
      <br />
      <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
  <FormControl sx={{ m: 1, minWidth: 200, width: '100%' }} size="small">
    <InputLabel>Select City</InputLabel>
    <Select
      native
      value={selectedCity?.name || ''}
      onChange={(e) => handleCityChange(e.target.value as string)}
    >
      <option value="">
       
      </option>
      {City.getCitiesOfState(
        selectedCountry?.isoCode || '',
        selectedState?.isoCode || '' 
      ).map((city) => (
        <option key={city.name} value={city.name}>
          {city.name}
        </option>
      ))}
    </Select>
  </FormControl>
</Grid>


      
                    <Grid item xs={12} sm={6}>
                      {/* Role */}
                      <FormControl sx={{ m: 1, minWidth: 200, width: '100%' }} size="small">
                        <InputLabel id="demo-simple-select-label">Role</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          placeholder="Role-type"
                          value={role}
                          label="Role"
                          onChange={(e) => setRole(e.target.value)}
                          error={roleError}
                        >
                          <MenuItem value={'admin'}>Admin</MenuItem>
                          <MenuItem value={'teacher'}>Teacher</MenuItem>
                          <MenuItem value={'student'}>Student</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Button
                    data-testid="submit"
                    variant="contained"
                    type="submit"
                    disabled={!username || !email || !phoneNumber || !role || !password}
                    onClick={handleSubmit}
                    sx={{ width: '100%' }}
                  >
                    Sign Up
                  </Button>
                </form>
                <Grid item>
                  <Link href="http://localhost:3001/login" variant="body2">
                    {"Already have an account? login"}
                  </Link>
                </Grid>
                <ToastContainer />
              </div>
              <Copyright sx={{ mt: 8, mb: 4 }} />
            </Box>
          </Box>
        </ThemeProvider>
      )}
    </>
  );
};

export default Signup;
