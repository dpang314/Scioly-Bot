import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import React from 'react';
import Navbar from '../components/Navbar';
import { SERVER, PORT } from '../../configLoader';
import { TemplateAttributes } from '../../models/TemplateModel';
import { Tournament, TournamentAttributes } from '../../models/TournamentModel';
import TournamentTable from './TournamentTable';
import Loading from '../components/Loading';
import useSWR, { useSWRConfig } from 'swr';
import { fetcher } from '../util';

export type AddTournament = (tournament: TournamentAttributes) => void;

const Tournaments: NextPage = () => {
  const { mutate } = useSWRConfig()
  const { data: session, status } = useSession({
    required: true,
  });
  const { data: tournaments, error: tournamentsError } = useSWR<Array<TournamentAttributes>>('/api/tournaments/', fetcher);
  const { data: templates, error: templatesError } = useSWR<Array<TemplateAttributes>>('/api/templates/', fetcher);
  
  if (status === "loading" || !session || !tournaments || !templates) {
    return <Loading/>
  }

  return (
    <>
      <Navbar loggedIn={session ? true : false} page={"index"}/>
      <TournamentTable templates={templates} tournaments={tournaments} addTournament={() => (mutate('/api/tournaments/'))}/>
    </>
  )
}

export default Tournaments
