import {useEffect, useState} from 'react';
import {TemplateAttributes, TournamentAttributes} from 'scioly-bot-types';
import TournamentTable from './TournamentTable';
import Loading from '../../components/Loading';
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
      setTemplates(await templates.json());
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

  const deleteStateTournament = (deletedTournamentId: string) => {
    setTournaments(
      tournaments.filter((tournament) => tournament.id !== deletedTournamentId),
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
