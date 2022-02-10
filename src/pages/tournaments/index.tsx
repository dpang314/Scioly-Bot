import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import React from 'react';
import useSWR, { useSWRConfig } from 'swr';
import Navbar from '../../components/Navbar';
import { TemplateAttributes } from '../../models/TemplateModel';
import { TournamentAttributes } from '../../models/TournamentModel';
import TournamentTable from './TournamentTable';
import Loading from '../../components/Loading';
import { fetcher } from '../../util';

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

  return (
    <>
      <Navbar loggedIn={!!session} />
      <TournamentTable templates={templates} tournaments={tournaments} addTournament={() => (mutate('/api/tournaments/'))} />
    </>
  );
};

export default Tournaments;
