import React, {useEffect, useState} from 'react';
import Navbar from '../../components/Navbar';
import {TemplateAttributes, TournamentAttributes} from 'scioly-bot-types';
import TournamentTable from './TournamentTable';
import Loading from '../../components/Loading';
import axios from 'axios';
import {getTemplates} from '../../api/templates';
import {getTournaments} from '../../api/tournmanent';

const Tournaments = () => {
  const [tournaments, setTournaments] = useState<TournamentAttributes[]>([]);
  const [templates, setTemplates] = useState<TemplateAttributes[]>([
    {
      id: '',
      name: 'None',
    },
  ]);
  useEffect(() => {
    (async () => {
      const templates = await getTemplates();
      setTemplates([
        {
          id: '',
          name: 'None',
        },
        ...(await templates.json()),
      ]);
      const tournaments = await getTournaments();
      setTournaments(await tournaments.json());
    })();
  }, []);

  const addStateTournament = (newTournament: TournamentAttributes) => {
    setTournaments([...tournaments, newTournament]);
  };

  const updateStateTournament = (updatedTournament: TournamentAttributes) => {
    setTournaments(
      tournaments.map((tournament) => {
        if (tournament.id === updatedTournament.id) {
          return updatedTournament;
        }
        return tournament;
      }),
    );
  };

  const deleteStateTournament = (deletedTournament: TournamentAttributes) => {
    setTournaments(
      tournaments.filter(
        (tournament) => tournament.id !== deletedTournament.id,
      ),
    );
  };

  if (!tournaments || !templates) {
    return <Loading />;
  }

  return (
    <>
      <TournamentTable
        templates={templates}
        tournaments={tournaments}
        addStateTournament={addStateTournament}
        updateStateTournament={updateStateTournament}
        deleteStateTournament={deleteStateTournament}
      />
    </>
  );
};

export default Tournaments;
