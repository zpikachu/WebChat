import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import Verification from '../components/Verification';
import axios from 'axios';
import ProfilePic from '../components/ProfilePic';
const defaultTheme = createTheme();

export default function Registration() {
  const [userInfo, setUserInfo] = useState({ email: "", password: "", username: "", profile: "" });
  const [display, setDisplay] = useState(true);
  const [showProfile, setShowProfile] = useState(true);
  const handleChange = (event) => {
    setUserInfo({ ...userInfo, [event.target.name]: event.target.value })
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // Assuming you have some logic here to handle form submission
    if (userInfo.username.length < 5) {
      alert("Username must be at least 5 characters long.");
      return; // Prevent further execution
    }
    if (userInfo.password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return; // Prevent further execution
    }
    axios
      .post("http://localhost:3000/api/user/register", userInfo)
      .then(async (response) => {
        alert(response.data.message);
        if (response.data.success) {
          setDisplay(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setUserInfo({ email: "", password: "", username: "", profile: "" });
  };

  useEffect(() => {
    let timerId;
    if (!display) {
      // If display is false, set it back to true after 2 minutes
      timerId = setTimeout(() => {
        setDisplay(true);
      }, 2 * 60 * 1000); // 2 minutes in milliseconds
    }
    return () => {
      clearTimeout(timerId); // Clear the timer if component unmounts or if display changes before 2 minutes
    };
  }, [display]);

  return (
    <div style={{ backgroundImage: `url("https://source.unsplash.com/random?night")`, backgroundSize: 'cover', backgroundPosition: 'center', }}>
      {showProfile ? display ? (
        <ThemeProvider theme={defaultTheme}>
          <Grid container component="main" sx={{ height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
            <CssBaseline />
            <Grid item xs={12} sm={10} md={6} lg={4} component={Paper} elevation={6} square sx={{ backdropFilter: 'blur(20px)', backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '15px', }}>
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Button onClick={() => setShowProfile(false)} sx={{ m: 1, bgcolor: 'secondary.main' }}>
                  {userInfo.profile ? (
                    <img src={userInfo.profile} alt="Profile" style={{ height: "120px", width: "120px" }} />) :
                    (<Avatar variant="solid" sx={{ width: 120, height: 120 }} />
                    )}
                </Button>
                <Typography component="h1" variant="h5" >
              Sign up
            </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="email"
                    name="email"
                    autoFocus
                    onChange={handleChange}
                    autoComplete="email"
                    value={userInfo?.email}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="username"
                    name="username"
                    autoFocus
                    onChange={handleChange}
                    autoComplete="username"
                    value={userInfo?.username}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    autoComplete='current-password'
                    onChange={handleChange}
                    value={userInfo?.password}
                    sx={{ mb: 2}}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, height: 60 }}
                  >
                    Sign Up
                  </Button>
                  <Grid container justifyContent="center">
                    <Grid item >
                      <Link to={'/login'}>
                        {"I Already have an Account ?"}
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </ThemeProvider>
      ) : (
        <Verification />
      ) : <ProfilePic setUserInfo={setUserInfo} userInfo={userInfo} setShowProfile={setShowProfile} />}
    </div>
  );
}

