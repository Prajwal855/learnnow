import { FC, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';

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

  return (
    <Drawer anchor="bottom" open={isOpen} onClose={toggleDrawer(false)}>
        
      <List> 
        <ListItem button key="Chapters" onClick={handleChapterListClick}>
          <ListItemText primary="Chapters" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
