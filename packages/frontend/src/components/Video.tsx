import * as React from 'react';

const Video = ({children}: {children: React.ReactNode}) => (
  <div
    style={{
      position: 'relative',
      paddingBottom: '56.25%',
      height: '0',
    }}>
    {children}
  </div>
);

export default Video;
