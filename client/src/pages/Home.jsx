// import React, { useState, useEffect, useRef } from 'react';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';
// import io from 'socket.io-client';
// import { useNavigate } from 'react-router-dom';
// import { format } from 'date-fns';
// import { Typography, Avatar, Button, TextField, Container, Paper, Grid, Card, CardContent } from '@mui/material';

// const socket = io('http://localhost:3000');

// const Message = ({ sender, message, timeStamp, isCurrentUser }) => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const truncatedMessage = message.substring(0, 100); // Truncate message to first 100 characters

//   const toggleExpand = () => {
//     setIsExpanded(!isExpanded);
//   };

//   return (
//     <div style={{ marginBottom: '10px', marginLeft: '20px', marginRight: '20px', display: 'flex', flexDirection: 'column' }}>
//       <span style={{
//         backgroundColor: isCurrentUser ? "lightblue" : "whitesmoke",
//         padding: '10px',
//         borderRadius: '5px',
//         wordWrap: 'break-word',
//         alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
//         maxWidth: '50%',
//         marginLeft: isCurrentUser ? 'auto' : '0',
//         marginRight: isCurrentUser ? '0' : 'auto'
//       }}>
//         <Typography variant="caption" sx={{ color: "blue" }}>{isCurrentUser ? "You" : sender}</Typography>
//         <Typography>{isExpanded ? message : truncatedMessage}</Typography>
//         {message.length > 100 && (
//           <Button variant="text" size="small" onClick={toggleExpand}>
//             {isExpanded ? "Read less" : "Read more"}
//           </Button>
//         )}
//         <Typography variant="caption" sx={{ color: "blue" }}>{format(new Date(timeStamp), 'hh:mm')}</Typography>
//       </span>
//     </div>
//   );
// };

// const Home = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [user, setUser] = useState(location.state);
//   const [users, setUsers] = useState([]);
//   const [text, setText] = useState('');
//   const [fetch, setFetch] = useState(true);
//   const [msges, setMsges] = useState([]);
//   const messagesEndRef = useRef(null);

//   const logout = (userId) => {
//     axios.post('http://localhost:3000/api/user/logout', { user_id: userId })
//       .then(response => {
//         console.log(response.data.message);
//       })
//       .catch(error => {
//         console.error('Error occurred:', error);
//       });
//     setUsers(prevUsers => prevUsers.filter(u => u.user_id !== userId));
//     setUser(null);
//     navigate('/login');
//   }

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const send = () => {
//     console.log(text);
//     socket.emit('send_message', text, user.user_id, user.room_id, user.username);
//     setText('');
//   }

//   useEffect(() => {
//     socket.emit('Join', user?.room_id, user?.username);
//     axios.post('http://localhost:3000/api/message/getmessage', { room_id: user?.room_id })
//       .then(response => {
//         setMsges(response.data.messages);
//         scrollToBottom(); // Scroll to bottom after messages are fetched
//       })
//       .catch(error => {
//         console.error('Error fetching messages:', error);
//       });
//   }, [fetch]);

//   useEffect(() => {
//     socket.on('receive_message', () => {
//       setFetch(prev => !prev);
//     });
//     return () => {
//       socket.off('receive_message');
//     }
//   }, []);

//   useEffect(() => {
//     axios
//       .post('http://localhost:3000/api/user/getall', { room_id: user?.room_id })
//       .then((response) => {
//         if (response.data.users) {
//           setUsers(response.data.users);
//         } else {
//           console.log(response.data.message);
//         }
//       });
//   }, [users]);

//   return (
//     <div style={{backgroundImage: `url("https://source.unsplash.com/random?night")`,
//     backgroundSize: 'cover',
//     backgroundPosition: 'center',
//     }}>
//     <Container
//       maxWidth="xl"
//       style={{
//         width: '100vw',
//         height: '100vh',
//         overflow: 'hidden',
//       }}
//     >
//       <Grid container spacing={0} style={{ height: '100%' }}>
//         {/* Header */}
//         <Grid item xs={12}>
//           <Paper style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', border: '2px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}>
//             <div style={{ display: 'flex', alignItems: 'center' }}>
//               <Avatar src={user?.profile} alt="User Profile" sx={{ width: 50, height: 50, marginRight: '10px' }} />
//               <Typography variant="h5" sx={{ color: "black" }}>{user?.username}</Typography>
//             </div>
//             <Button variant="contained" onClick={() => logout(user?.user_id)}>Logout</Button>
//           </Paper>
//         </Grid>

//         {/* Sidebar - Users List */}
//         <Grid item xs={2}>
//           <Paper style={{ height: '80vh', overflowY: 'auto', backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', border: '2px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}>
//             {users.map((obj, index) => (
//               <Card key={index + 1} style={{ marginBottom: '10px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
//                 <CardContent style={{ display: 'flex', alignItems: 'center' }}>
//                   <Avatar src={obj.profile} alt="User" sx={{ width: 50, height: 50, marginRight: '10px' }} />
//                   <Typography>{obj.username}</Typography>
//                 </CardContent>
//               </Card>
//             ))}
//           </Paper>
//         </Grid>

//         {/* Main Content - Messages List */}
//         <Grid item xs={10}>
//           <Paper style={{ height: '80vh', overflowY: 'auto', backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', border: '2px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}>
//             {msges && msges.length > 0 ? (
//               msges.map((msg, i) => (
//                 <Message
//                   key={i}
//                   sender={msg.sender}
//                   message={msg.message}
//                   timeStamp={msg.timeStamp}
//                   isCurrentUser={msg.sender === user.username}
//                 />
//               ))
//             ) : (
//               <Typography style={{ color: "whitesmoke" }}>There is no message</Typography>
//             )}
//             <div ref={messagesEndRef} />
//           </Paper>
//         </Grid>

//         {/* Send Message Form */}
//         <Grid item xs={12}>
//           <Paper style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', border: '2px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}>
//             <TextField
//               fullWidth
//               variant="outlined"
//               placeholder='Type your message'
//               onChange={e => setText(e.target.value)}
//               value={text}
//               sx={{ height: 50, marginRight: '10px' }}
//             />
//             <Button variant="contained" onClick={send}>Send</Button>
//           </Paper>
//         </Grid>
//       </Grid>
//     </Container>
//     </div>
//   );
// };

// export default Home;

import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { Container, Grid } from '@mui/material';
import Header from '../components/chat/Header';
import Sidebar from '../components/chat/Sidebar';
import Mainbar from '../components/chat/Mainbar';
import SendMessageForm from '../components/chat/SendMessageForm';

const socket = io('http://localhost:3000');

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(location.state);
  const [users, setUsers] = useState([]);
  // const [text, setText] = useState('');
  const [fetch, setFetch] = useState(true);
  const [msges, setMsges] = useState([]);
  const messagesEndRef = useRef(null);

  const logout = (userId) => {
    axios.post('http://localhost:3000/api/user/logout', { user_id: userId })
      .then(response => {
        console.log(response.data.message);
      })
      .catch(error => {
        console.error('Error occurred:', error);
      });
    setUsers(prevUsers => prevUsers.filter(u => u.user_id !== userId));
    setUser(null);
    navigate('/login');
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const send = (message) => {
    console.log(message);
    socket.emit('send_message', message, user.user_id, user.room_id, user.username);
  }

  useEffect(() => {
    socket.emit('Join', user?.room_id, user?.username);
    axios.post('http://localhost:3000/api/message/getmessage', { room_id: user?.room_id })
      .then(response => {
        setMsges(response.data.messages);
        scrollToBottom(); // Scroll to bottom after messages are fetched
      })
      .catch(error => {
        console.error('Error fetching messages:', error);
      });
  }, [fetch]);

  useEffect(() => {
    socket.on('receive_message', () => {
      setFetch(prev => !prev);
    });
    return () => {
      socket.off('receive_message');
    }
  }, []);

  useEffect(() => {
    axios
      .post('http://localhost:3000/api/user/getall', { room_id: user?.room_id })
      .then((response) => {
        if (response.data.users) {
          setUsers(response.data.users);
        } else {
          console.log(response.data.message);
        }
      });
  }, [users]);

  return (
    <div style={{backgroundImage: `url("https://source.unsplash.com/random?night")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    }}>
    <Container
      maxWidth="xl"
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <Grid container spacing={0} style={{ height: '100%' }}>
        {/* Header */}
        <Grid item xs={12}>
          <Header user={user} logout={logout} />
        </Grid>

        {/* Sidebar - Users List */}
        <Grid item xs={2}>
          <Sidebar users={users} />
        </Grid>

        {/* Main Content - Messages List */}
        <Mainbar msges={msges} user={user} messagesEndRef={messagesEndRef} />

        {/* Send Message Form */}
        <Grid item xs={12}>
          <SendMessageForm send={send} />
        </Grid>
      </Grid>
    </Container>
    </div>
  );
};

export default Home;
