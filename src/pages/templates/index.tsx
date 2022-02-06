import type { NextPage } from 'next'
import { signIn, useSession } from 'next-auth/react'
import React from 'react';
import Navbar from '../Navbar';
import { SERVER, PORT } from '../../configLoader';
import TemplateTable from './TemplateTable';
import { TemplateEvent } from '../../models/TemplateEventModel';

type PageProps = {
  data: Array<TemplateEvent>
}

const Templates: NextPage<PageProps> = ({ data }) => {
  const { data: session } = useSession();
  const [templates, setTemplates] = React.useState(data);

  const addTemplate = (template) => {
    setTemplates(templates.concat(template));
  }
  
  if (session) {
    return (
      <>
        <Navbar loggedIn={session ? true : false} page={"index"}/>
        <TemplateTable templates={templates} addTemplate={addTemplate}/>
      </>
    )
  }
  return (
    <>
      Not signed in
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}

export async function getServerSideProps() {
  const res = await fetch(`${SERVER}:${PORT}/api/templates`);
  const data = await res.json();
  return { props: { data } };
}

export default Templates
