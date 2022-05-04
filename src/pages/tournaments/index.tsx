import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import React from 'react';
import useSWR, { useSWRConfig } from 'swr';
import Navbar from '../../components/Navbar';
import { TemplateAttributes, TournamentAttributes } from '../../models';
import TournamentTable from './TournamentTable';
import Loading from '../../components/Loading';
import { fetcher } from '../../util';
import { TournamentFormData } from './TournamentForm';

const Tournaments: NextPage = () => {
  const { mutate } = useSWRConfig();
  const { data: session, status } = useSession({
    required: true,
  });
  const { data: tournaments } = useSWR<Array<TournamentAttributes>>('/api/tournaments/', fetcher);
  const { data: templates } = useSWR<Array<TemplateAttributes>>('/api/templates/', fetcher);

  if (status === 'loading' || !session || !tournaments || !templates) {
    return <Loading />;
  }

  const addTournament = async (values: TournamentFormData): Promise<void> => {
    await fetch(
      '/api/tournaments',
      {
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    );
    mutate('/api/tournaments/');
  };

  return (
    <div style={{ backgroundColor: '#DDDDDD', height: '100vh' }}>
      <Navbar loggedIn={!!session} />
      <TournamentTable
        templates={templates}
        tournaments={tournaments}
        addTournament={addTournament}
      />
    </div>
  );
};

export default Tournaments;
