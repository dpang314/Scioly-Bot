import {useEffect, useState} from 'react';
import {
  TemplateAttributes,
  TournamentAttributes,
  TournamentCreationAttributes,
} from 'scioly-bot-types';
import TournamentTable from './TournamentTable';
import Loading from '../../components/Loading';
import {getTemplates} from '../../api/templates';
import {
  createTournament,
  getTournaments,
  updateTournament,
} from '../../api/tournmanent';

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

  const addStateTournament = async (
    newTournament: TournamentCreationAttributes,
  ) => {
    const response = await createTournament(newTournament);
    setTournaments([...tournaments, await response.json()]);
  };

  const updateStateTournament = async (
    updatedTournament: TournamentAttributes,
  ) => {
    const response = await (
      await updateTournament(updatedTournament.id, updatedTournament)
    ).json();
    setTournaments(
      tournaments.map((tournament) => {
        if (tournament.id === response.id) {
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
