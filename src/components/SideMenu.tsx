import { FC, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo-gif.gif';
import "../assets/styles/Home.css";

interface SidebarProps {
  isOpen: boolean;
  toggleDrawer: (open: boolean) => () => void;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, toggleDrawer }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();  
  const handleChapterListClick = async () => {
    setLoading(true);
      navigate('/chapters');
  };

  const handleCoursesListClick = async () => {
    setLoading(true);
      navigate('/courses');
  };
  return (
    <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
        
      <List> 
      <img src={logo} className="nav--icon" style={{marginLeft:'3px'}}/>
      <ListItem button key="Courses" onClick={handleCoursesListClick}>
          <ListItemText primary="Courses" />
        </ListItem>
        <ListItem button key="Chapters" onClick={handleChapterListClick}>
          <ListItemText primary="Chapters" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
