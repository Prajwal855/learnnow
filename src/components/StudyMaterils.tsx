import React, {  useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Loading from './Loading';
import axios from 'axios';
import {
    Box,
    Button,
    CssBaseline,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    ThemeProvider,
    createTheme,
    TextareaAutosize,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import logo from '../assets/images/logo-gif.gif';

const defaultTheme = createTheme();

const StudyMaterials = () => {
    const [chaptersId, setChaptersId] = useState<string>('');
    const [textbook, setTextBook] = useState<string>('');
    const [videoMaterial, setVideoMaterial] = useState<File | null>(null);
    const [softcopy, setSoftcopy] = useState<File | null>(null);
    const [softcopyFileName, setSoftcopyFileName] = useState('');
    const [videoMaterialFileName, setVideoMaterialFileName] = useState('');
    const [loading, setLoading] = useState(false);
    const [chaptersOptions, setChaptersOptions] = useState<Array<{ id: string; chap: string }>>([]);
    const navigate = useNavigate();

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

    const handleTextBookChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextBook(event.target.value);
    };

    const handleVideoMaterialChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setVideoMaterial(event.target.files[0]);
            setVideoMaterialFileName(event.target.files[0].name)
        }
    };

    const handleSoftcopyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSoftcopy(event.target.files[0]);
            setSoftcopyFileName(event.target.files[0].name)
        }
    };

    const handleStudyMaterialSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            const savedAccessToken = localStorage.getItem("AccessToken");

            const formData = new FormData();
            formData.append('textbook', textbook);
            formData.append('chapter_id', chaptersId);
            formData.append('video', videoMaterial as File);
            formData.append('softcopy', softcopy as File);

            const response = await axios.post("http://localhost:3000/studymaterials", formData, {
                headers: {
                    token: `${savedAccessToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success("Study Material Created");
            navigate('/Home');
            console.log("Received response", response);
        } catch (error) {
            toast.error("Study Material unable to create");
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
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <nav className="fixed-navbar">
                            <Link to="/Home">
                                <img src={logo} className="nav--icon" alt="Learn Now Logo" />
                            </Link>
                            <h3 className="nav--logo_text">LEARN NOW</h3>
                        </nav>
                        <div className='App'>
                            <h2 className='otp_text'>Study Materials</h2>
                            <form onSubmit={handleStudyMaterialSubmit}>

                                <FormControl sx={{ m: 1, minWidth: 200, width: '100%' }} size="small">
                                    <InputLabel id="ChaptersLabel">Chapters</InputLabel>
                                    <Select
                                        labelId="ChaptersLabel"
                                        id="ChaptersId"
                                        value={chaptersId}
                                        onChange={(e) => setChaptersId(e.target.value as string)}
                                        fullWidth
                                    >
                                        {chaptersOptions.map(option => (
                                            <MenuItem key={option.id} value={option.id}>
                                                {option.chap}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextareaAutosize
                                    id="filled-hidden-label-normal"
                                    defaultValue=""
                                    placeholder="Write here"
                                    value={textbook}
                                    onChange={handleTextBookChange}

                                />

                                <label htmlFor="video-material" style={{ display: 'flex', alignItems: 'center', color: 'black' }}>
                                    <CloudUploadIcon sx={{ marginRight: 1, color: 'blue' }} />
                                    {videoMaterialFileName ? <p>{videoMaterialFileName}</p> : 'Upload Video Material'}
                                </label>
                                <input
                                    id="video-material"
                                    type="file"
                                    onChange={handleVideoMaterialChange}
                                    style={{ display: 'none' }}
                                />

                                <label htmlFor="softcopy" style={{ display: 'flex', alignItems: 'center', color: 'black' }}>
                                    <CloudUploadIcon sx={{ marginRight: 1, color: 'blue' }} />
                                    {softcopyFileName ? <p>{softcopyFileName}</p> : 'Upload Softcopy'}
                                </label>
                                <input
                                    id="softcopy"
                                    type="file"
                                    onChange={handleSoftcopyChange}
                                    style={{ display: 'none' }}
                                />

                                <Button variant="contained" type="submit">
                                    Create Study Material
                                </Button>

                            </form>
                            <ToastContainer />
                        </div>
                    </Box>

                </ThemeProvider>
            )}
        </>
    );
};

export default StudyMaterials;
