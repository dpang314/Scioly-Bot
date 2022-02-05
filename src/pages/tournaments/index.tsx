import type { NextPage } from 'next'
import { signIn, useSession } from 'next-auth/react'
import React from 'react';
import Navbar from '../Navbar';
import { SERVER, PORT } from '../../configLoader';
import { TemplateAttributes } from '../../models/template';
import { TournamentAttributes } from '../../models/tournament';
import TournamentTable from './TournamentTable';

type PageProps = {
  templates: Array<TemplateAttributes>,
  initialTournaments: Array<TournamentAttributes>,
}

export type AddTournament = (tournament: TournamentAttributes) => void;

const Tournaments: NextPage<PageProps> = ({ templates, initialTournaments }) => {
  const { data: session } = useSession();
  const [tournaments, setTournaments] = React.useState(initialTournaments);

  const addTournament: AddTournament = (tournament) => {
    setTournaments(tournaments.concat(tournament));
  }
  
  if (session) {
    return (
      <>
        <Navbar loggedIn={session ? true : false} page={"index"}/>
        <TournamentTable templates={templates} tournaments={tournaments} addTournament={addTournament}/>
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
  const templatesRes = await fetch(`${SERVER}:${PORT}/api/templates`);
  const tournamentsRes = await fetch(`${SERVER}:${PORT}/api/tournaments`);
  const templates = await templatesRes.json();
  const initialTournaments = await tournamentsRes.json();
  return { props: { templates, initialTournaments } };
}

export default Tournaments
