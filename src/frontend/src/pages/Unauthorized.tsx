import type { NextPage } from 'next';
import React from 'react';

const Unauthorized: NextPage = () => (
  <p>
    Unauthorized. Access is restricted to users with admin
    permission on the Discord server specified in the site configuration.
  </p>
);

export default Unauthorized;
