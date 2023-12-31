import "../assets/styles/Home.css";
import logo from '../assets/images/logo-gif.gif';
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Link, useNavigate } from "react-router-dom";
const NavBar =()=>{
    const navigate = useNavigate()

    const handleSignUpClick = () => {
        navigate('/signup');
      };
    
      const handleLoginClick = () => {
        navigate('/login');
      };
    return(
      <nav className="fixed-navbar">
             <Link to="/">
              <img src={logo} className="nav--icon" alt="Learn Now Logo" />
              
            </Link>
            <h3 className="nav--logo_text">LEARN NOW</h3>
            <Stack spacing={2} direction="row">
             <Button onClick={handleSignUpClick} variant="contained">Sign up</Button>
             <Button onClick={handleLoginClick} variant="contained">Login</Button>
             </Stack>
        </nav>
    )
}

export default NavBar;