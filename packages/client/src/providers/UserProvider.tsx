import React, {useEffect, useState} from 'react';
import {UserAttributes} from 'scioly-bot-types';
import {getUser} from '../api/auth';
import UserContext from './UserContext';

const UserProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<UserAttributes | undefined | null>(
    undefined,
  );

  useEffect(() => {
    getUser().then(async (res) => {
      if (res.status === 200) {
        setUser(await res.json());
      } else {
        // used to indicate that the user is not logged in
        setUser(null);
      }
    });
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export default UserProvider;
