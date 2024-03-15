import React, { useEffect } from 'react';
import { Typography, Paper, Grid } from '@mui/material';
import Message from './Message';

const Mainbar = ({ msges, user, messagesEndRef }) => {
  useEffect(() => {
    // Scroll to the bottom of the container when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [msges, messagesEndRef]);

  return (
    <Grid item xs={10}>
      <Paper style={{ height: '80vh', overflowY: 'auto', backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', border: '2px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)' }}>
        {msges && msges.length > 0 ? (
          msges.map((msg, i) => (
            <Message
              key={i}
              sender={msg.sender}
              message={msg.message}
              timeStamp={msg.timeStamp}
              isCurrentUser={msg.sender === user.username}
            />
          ))
        ) : (
          <Typography style={{ color: "whitesmoke" }}>There is no message</Typography>
        )}
        <div ref={messagesEndRef} />
      </Paper>
    </Grid>
  );
};

export default Mainbar;
