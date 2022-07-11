import {createContext} from 'react';
import {UserAttributes} from 'scioly-bot-types';

const UserContext = createContext<UserAttributes | undefined | null>(undefined);

export default UserContext;
