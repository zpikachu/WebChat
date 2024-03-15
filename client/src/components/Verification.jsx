import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState,useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const defaultTheme = createTheme();

export default function Verification() {

  const [remainingTime, setRemainingTime] = useState(120);

  const navigate = useNavigate();
  
  useEffect(() => {
      const intervalId = setInterval(() => {
          setRemainingTime(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(intervalId);
  }, []);

  const minutes = Math.floor(remainingTime / 60); 
  const seconds = remainingTime % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const [otp,setOtp] = useState();
  const handleChange = (e) =>{
    e.preventDefault();
    setOtp({...otp,[e.target.name]:e.target.value});
  }

  const handleSubmit = () => {
    axios
    .post(`http://localhost:3000/api/user/verify`,otp)
    .then(async (response) => {
      if(response.data.success){
        navigate('/login');
        alert(response.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });

  };

  return (
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
            Verfication - {formattedTime}
          </Typography>
          <Box component="form"   noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="otp"
              name="otp"
              autoFocus
              onChange={handleChange}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
