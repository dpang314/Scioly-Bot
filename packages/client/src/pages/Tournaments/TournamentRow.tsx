import {Modal, TableRow, TableCell, Switch, Button} from '@mui/material';
import React, {FunctionComponent} from 'react';
import {
  TemplateAttributes,
  TournamentAttributes,
  TournamentCreationAttributes,
} from 'scioly-bot-types';
import {deleteTournament, updateTournament} from '../../api/tournmanent';
import ModalBox from '../../components/ModalBox';
import TournamentForm from './TournamentForm';

type Props = {
  tournament: TournamentAttributes;
  templates: TemplateAttributes[];
  addStateTournament: (tournament: TournamentCreationAttributes) => void;
  updateStateTournament: (tournament: TournamentAttributes) => void;
  deleteStateTournament: (id: string) => void;
};

const TournamentRow: FunctionComponent<Props> = ({
  tournament,
  templates,
  addStateTournament,
  updateStateTournament,
  deleteStateTournament,
}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const toggleStatus = async () => {
    // TODO switch to PATCH
    const response = await updateTournament(tournament.id, {
      ...tournament,
      active: !tournament.active,
    });
    updateStateTournament(await response.json());
  };

  const handleDelete = async () => {
    await deleteTournament(tournament.id);
    deleteStateTournament(tournament.id);
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <ModalBox>
          <TournamentForm
            tournament={tournament}
            templates={templates}
            setOpen={setOpen}
            addStateTournament={addStateTournament}
            updateStateTournament={updateStateTournament}
          />
        </ModalBox>
      </Modal>
      <TableRow
        key={tournament.id}
        sx={{'&:last-child td, &:last-child th': {border: 0}}}>
        <TableCell width="50%" component="th" scope="row">
          {tournament.name}
        </TableCell>
        <TableCell width="30%" align="right">
          <Switch
            onChange={toggleStatus}
            checked={tournament.active}
            // inputProps={{'aria-label': 'controlled'}}
          />
        </TableCell>
        <TableCell width="10%" align="right">
          <Button onClick={handleOpen} variant="outlined">
            Edit
          </Button>
        </TableCell>
        <TableCell width="10%" align="right">
          <Button onClick={handleDelete} variant="outlined" color="error">
            Delete
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};

export default TournamentRow;
