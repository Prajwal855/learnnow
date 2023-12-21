import { Box, Button, FormControlLabel, InputLabel, MenuItem, Select, TextField, Checkbox } from "@mui/material";
import logo from '../assets/images/logo-gif.gif';
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Link from '@mui/material/Link';
import { toast } from 'react-toastify';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import 'react-toastify/dist/ReactToastify.css';
import "../App.css"
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid } from '@mui/material';

const defaultTheme = createTheme();

const Academics = () => {
    const [collegeName, setCollegeName] = useState<string>('');
    const [intrestId, setIntrestId] = useState<string>('');
    const [qualificationId, setQualificationId] = useState<string>('');
    const [careerGoals, setCareerGoals] = useState<string>('');
    const [language, setLanguage] = useState<string>('');
    const [otherLanguage, setOtherLanguage] = useState<string>('');
    const [specialization, setSpecialization] = useState<string>('');
    const [currentlyWorking, setCurrentlyWorking] = useState<boolean>(false);
    const [availability, setAvailability] = useState<boolean>(false);
    const [governamentId, setGovernamentId] = useState<File | null>(null);
    const [experiance, setExperiance] = useState<string>('');
    const [cv, setCV] = useState<File | null>(null);
    const [error, setError] = useState<string>('');
    const [interestOptions, setInterestOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [qualificationOptions, setQualificationOptions] = useState<Array<{ id: string; name: string }>>([]);
    const [loading, setLoading] = useState(false);
    const [governmentIDFileName, setGovernmentIDFileName] = useState('');
    const [cvFileName, setCVFileName] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
        const savedAccessToken = localStorage.getItem("AccessToken");

        axios
            .get('http://localhost:3000/intrests', {
                headers: {
                    token: `${savedAccessToken}`,
                },
            })
            .then((response) => {
                setInterestOptions(response.data.intrests);
                console.log("Intrests", response.data.intrests);
            })
            .catch((error) => {
                console.error("Error fetching interest options", error);
            });

        axios
            .get('http://localhost:3000/qualifications', {
                headers: {
                    token: `${savedAccessToken}`,
                },
            })
            .then((response) => {
                setQualificationOptions(response.data.qualifications);
                console.log("qualifications", response.data.qualifications);
            })
            .catch((error) => {
                console.error("Error fetching qualification options", error);
            });
    }, []);

    const handleCollageNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCollegeName(event.target.value);
        setError('');
    };
    const handleCareerGoalsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCareerGoals(event.target.value);
        setError('');
    };

    const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLanguage(event.target.value);
        setError('');
    };
    const handleOtherLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOtherLanguage(event.target.value);
        setError('');
    };
    const handleSpecializationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSpecialization(event.target.value);
        setError('');
    };

    const handleGovernmentIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setGovernamentId(files[0]);
            setGovernmentIDFileName(files[0].name);
            setError("");
        }
    };

    const handleExperianceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExperiance(event.target.value);
        setError('');
    };
    const handleCVChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setCV(files[0]);
            setCVFileName(files[0].name);
            setError("");
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            const savedAccessToken = localStorage.getItem("AccessToken");
            const formData = new FormData();

            formData.append('college_name', collegeName);
            formData.append('intrest_id', intrestId);
            formData.append('qualification_id', qualificationId);
            formData.append('career_goals', careerGoals);
            formData.append('language', language);
            formData.append('other_language', otherLanguage);
            formData.append('specialization', specialization);
            if (typeof currentlyWorking !== 'boolean') {
                formData.append('currently_working', currentlyWorking);
            }
            if (typeof availability !== 'boolean') {
                formData.append('availability', availability);
            }
            formData.append('governament_id', governamentId as File);
            formData.append('experiance', experiance);
            formData.append('cv', cv as File);

            const response = await axios.post('http://localhost:3000/academics', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'token': `${savedAccessToken}`,
                },
            });
            console.log("i got response", response)
            navigate("/login");
        } catch (error) {
            toast.error("Unable to create activity");
        }
        finally {
            setLoading(true);
        }
    };

    const isSubmitDisabled = () => {
        return (
            !collegeName ||
            !intrestId ||
            !qualificationId ||
            !careerGoals ||
            !language ||
            (!currentlyWorking && !availability) ||
            !experiance
        );
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="sm">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 2,
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
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <div className="App">
                            <h1 className="tital_text">Academics Form</h1>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <InputLabel id="qualificationIdLabel">Qualification ID</InputLabel>
                                        <Select
                                            labelId="qualificationIdLabel"
                                            id="qualificationId"
                                            value={qualificationId}
                                            onChange={(e) => setQualificationId(e.target.value as string)}
                                            fullWidth
                                        >
                                            {qualificationOptions.map(option => (
                                                <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <InputLabel id="interestIdLabel">Interest ID</InputLabel>
                                        <Select
                                            labelId="interestIdLabel"
                                            id="interestId"
                                            value={intrestId}
                                            onChange={(e) => setIntrestId(e.target.value as string)}
                                            fullWidth
                                        >
                                            {interestOptions.map(option => (
                                                <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <TextField
                                            id="collegeName"
                                            label="College Name"
                                            variant="outlined"
                                            placeholder="Enter Your Collage Name"
                                            value={collegeName}
                                            onChange={handleCollageNameChange}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <TextField
                                            id="careerGoals"
                                            label="Career Goals"
                                            variant="outlined"
                                            placeholder="Enter Your carrer Goals"
                                            value={careerGoals}
                                            onChange={handleCareerGoalsChange}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <TextField
                                            id="language"
                                            label="Language"
                                            variant="outlined"
                                            placeholder="Enter Your Language"
                                            value={language}
                                            onChange={handleLanguageChange}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <TextField
                                            id="otherLanguage"
                                            label="Other Language"
                                            variant="outlined"
                                            placeholder="Enter Other Languages"
                                            value={otherLanguage || ''}
                                            onChange={handleOtherLanguageChange}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <TextField
                                            id="specialization"
                                            label="Specialization"
                                            variant="outlined"
                                            placeholder="Enter your specialization"
                                            value={specialization || ''}
                                            onChange={handleSpecializationChange}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            id="experience"
                                            label="Experience"
                                            variant="outlined"
                                            placeholder="Enter your Experience"
                                            value={experiance || ''}
                                            onChange={handleExperianceChange}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={currentlyWorking}
                                                    onChange={() => {
                                                        setCurrentlyWorking(!currentlyWorking);
                                                    }}
                                                    value="currentlyWorking"
                                                />
                                            }
                                            label={<span style={{ color: 'black' }}>Currently Working</span>}
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={availability}
                                                    onChange={() => {
                                                        setAvailability(!availability);
                                                    }}
                                                    value="availability"
                                                />
                                            }
                                            label={<span style={{ color: 'black' }}>Availability</span>}
                                        />
                                    </Grid>

                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <label
                                                htmlFor="governmentId"
                                                style={{
                                                    display: 'flex',
                                                    marginLeft: '60px',
                                                    alignItems: 'center',
                                                    color: 'black',
                                                    width: '200px',
                                                    height: '40px',
                                                }}
                                            >
                                                <CloudUploadIcon sx={{ marginRight: 1, color: governmentIDFileName ? 'green' : 'blue', flexShrink: 0 }} />
                                                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {governmentIDFileName ? <p>{governmentIDFileName}</p> : 'Upload Government ID'}
                                                </div>
                                            </label>
                                            <input
                                                id="governmentId"
                                                type="file"
                                                onChange={handleGovernmentIDChange}
                                                style={{ display: 'none' }}
                                            />
                                        </Grid>

                                        <Grid item xs={6}>
                                            <label
                                                htmlFor="cv"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    marginLeft: '80px',
                                                    color: 'black',
                                                    width: '200px',
                                                    height: '40px',
                                                }}
                                            >
                                                <CloudUploadIcon sx={{ marginRight: 1, color: cvFileName ? 'green' : 'blue', flexShrink: 0 }} />
                                                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {cvFileName ? <p>{cvFileName}</p> : 'Upload CV'}
                                                </div>
                                            </label>
                                            <input
                                                id="cv"
                                                type="file"
                                                onChange={handleCVChange}
                                                style={{ display: 'none' }}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <div>
                                            <Button
                                                variant="contained"
                                                type="submit"
                                                onClick={handleSubmit}
                                                disabled={isSubmitDisabled()}
                                            >
                                                Submit
                                            </Button>
                                        </div>
                                    </Grid>
                                </Grid>
                            </form>
                        </div>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default Academics;
