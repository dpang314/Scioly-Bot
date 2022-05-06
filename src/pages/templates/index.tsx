import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import React from 'react';
import { Session } from 'next-auth';
import useSWR from 'swr';
import Navbar from '../../components/Navbar';
import TemplateTable from './TemplateTable';
import { Template, TemplateAttributes } from '../../models';
import Loading from '../../components/Loading';
import { fetcher, TEST } from '../../util';

type PageProps = {
  initialTemplates: Array<Template>;
  session: Session;
}

const Templates: NextPage<PageProps> = () => {
  const { data: session, status } = useSession({
    required: !TEST,
  });
  const { data: templates } = useSWR<Array<TemplateAttributes>>('/api/templates/', fetcher);

  if ((!TEST && (status === 'loading' || !session)) || !templates) {
    return <Loading />;
  }

  return (
    <div style={{ backgroundColor: '#DDDDDD', height: '100vh' }}>
      <Navbar loggedIn />
      <TemplateTable templates={templates} />
    </div>
  );
};

export default Templates;
