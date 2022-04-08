import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import TemplateTable from './TemplateTable';
import Loading from '../../components/Loading';

const Templates = () => {
  const [templates, setTemplates] = useState(null);
  useEffect(() => {
    (async () => {
      const { data } = await axios.get('/api/templates/');
      setTemplates(data);
    })();
  });

  if (!templates) {
    return <Loading />;
  }

  return (
    <>
      <Navbar loggedIn />
      <TemplateTable templates={templates} />
    </>
  );
};

export default Templates;
