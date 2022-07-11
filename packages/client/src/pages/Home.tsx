import {Link, List, ListItem, Typography} from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React, {useState} from 'react';
import Video from '../components/Video';

const Home = () => {
  const [tab, setTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Container sx={{paddingTop: '20px'}}>
      <Typography variant="h4" textAlign="center" paddingBottom="20px">
        Usage
      </Typography>
      <Tabs value={tab} onChange={handleChange} centered>
        <Tab label="Users" />
        <Tab label="Administrators" />
      </Tabs>
      <Box hidden={tab !== 0} bgcolor="lightgray" padding="15px">
        <Typography variant="body1">
          The following slash commands can be run in a Discord server with
          Scioly Bot.
        </Typography>
        <List>
          <ListItem>
            <Typography variant="body1">
              /help: returns bot usage information
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              /time: returns the amount of time you have left in test(s) you are
              taking
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              /test partner1 partner2: starts a test for you and your partner(s)
            </Typography>
          </ListItem>
        </List>
        <Video>
          <video
            controls
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
            }}>
            <source
              src="https://user-images.githubusercontent.com/19295389/178362745-b0541282-6c85-40b5-a7dc-377f1be42ca6.mp4"
              type="video/mp4"
            />
          </video>
        </Video>
      </Box>
      <Box hidden={tab !== 1} bgcolor="lightgray" padding="15px">
        <Typography variant="body1">
          Requires signing in with Discord. Tournaments created will be
          available on servers with Scioly Bot that you have administrator
          permissions on.
        </Typography>
        <List>
          <ListItem>
            <Typography variant="body1">
              <Link href="/templates" color="#0000EE">
                Templates
              </Link>
              : manage templates to reuse for tournaments
            </Typography>
          </ListItem>
          <ListItem>
            <Typography variant="body1">
              <Link href="/tournaments" color="#0000EE">
                Tournaments
              </Link>
              : manage tournaments and toggle whether they should be available
              to users
            </Typography>
          </ListItem>
        </List>
        <Video>
          <video
            controls
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
            }}>
            <source
              src="https://user-images.githubusercontent.com/19295389/178367453-f1e9625c-27bc-4be3-9dbc-a99c4faf811e.mp4"
              type="video/mp4"
            />
          </video>
        </Video>
      </Box>
    </Container>
  );
};

export default Home;
