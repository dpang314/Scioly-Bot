import {Link, List, ListItem, Typography} from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React, {useState} from 'react';

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
      </Box>
    </Container>
  );
};

export default Home;
