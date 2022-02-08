import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import React from 'react';
import Navbar from '../components/Navbar';
import TemplateTable from './TemplateTable';
import { Session } from 'next-auth';
import { Template, TemplateAttributes } from '../../models';
import Loading from '../components/Loading';
import useSWR, { useSWRConfig } from 'swr';
import { fetcher } from '../util';

type PageProps = {
  initialTemplates: Array<Template>;
  session: Session;
}

const Templates: NextPage<PageProps> = () => {
  const { mutate } = useSWRConfig()
  const { data: session, status } = useSession({
    required: true
  });
  const { data: templates, error } = useSWR<Array<TemplateAttributes>>('/api/templates/', fetcher);

  if (status === "loading" || !session || !templates) {
    return <Loading/>
  }

  return (
    <>
      <Navbar loggedIn={true} page="templates"/>
      <TemplateTable templates={templates} addTemplate={() => (mutate('/api/templates/'))}/>
    </>
  )
}

export default Templates
