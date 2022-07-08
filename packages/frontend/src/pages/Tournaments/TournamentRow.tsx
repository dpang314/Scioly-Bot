import {Modal, TableRow, TableCell, Switch, Button} from '@mui/material';
import Box from '@mui/material/Box';
import React, {FunctionComponent} from 'react';
import {TemplateAttributes, TournamentAttributes} from 'scioly-bot-types';
import {updateTournament} from '../../api/tournmanent';
import TournamentForm from './TournamentForm';

type Props = {
  tournament: TournamentAttributes;
  templates: TemplateAttributes[];
  addStateTournament: (tournament: TournamentAttributes) => void;
  updateStateTournament: (tournament: TournamentAttributes) => void;
};

const TournamentRow: FunctionComponent<Props> = ({
  tournament,
  templates,
  addStateTournament,
  updateStateTournament,
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

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <TournamentForm
            tournament={tournament}
            templates={templates}
            setOpen={setOpen}
            addStateTournament={addStateTournament}
            updateStateTournament={updateStateTournament}
          />
        </Box>
      </Modal>
      <TableRow
        key={tournament.id}
        sx={{'&:last-child td, &:last-child th': {border: 0}}}>
        <TableCell component="th" scope="row">
          {tournament.name}
        </TableCell>
        <TableCell align="right">
          <Switch
            onChange={toggleStatus}
            checked={tournament.active}
            // inputProps={{'aria-label': 'controlled'}}
          />
        </TableCell>
        <TableCell align="right">
          <Button onClick={handleOpen}>Edit</Button>
        </TableCell>
      </TableRow>
    </>
  );
};

export default TournamentRow;
