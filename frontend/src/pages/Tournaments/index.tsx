import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { TemplateAttributes } from '../../../../common/models/TemplateModel';
import { TournamentAttributes } from '../../../../common/models/TournamentModel';
import TournamentTable from './TournamentTable';
import Loading from '../../components/Loading';
import axios from 'axios';

const Tournaments = () => {
  const [tournaments, setTournaments] = useState<Array<TournamentAttributes> | null>(null);
  const [templates, setTemplates] = useState<Array<TemplateAttributes> | null>(null);
  useEffect(() => {
    (async() => {
      const { data: templates } = await axios.get('/api/templates/');
      setTemplates(templates);
      const { data: tournaments } = await axios.get('/api/templates/');
      setTournaments(tournaments);
    })();
  })

  if (!tournaments || !templates) {
    return <Loading />;
  }
// TODO change Navbar to check if actually logged in
  return (
    <>
      <Navbar loggedIn={true} />
      <TournamentTable templates={templates} tournaments={tournaments} addTournament={() => {}} />
    </>
  );
};

export default Tournaments;
