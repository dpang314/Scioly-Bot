import {Button, Modal, Box} from '@mui/material';
import React, {FunctionComponent} from 'react';
import AddIcon from '@mui/icons-material/Add';
import {
  TemplateAttributes,
  TournamentAttributes,
  TournamentCreationAttributes,
} from 'scioly-bot-types';
import TournamentForm from './TournamentForm';

type TournamentModalButtonProps = {
  templates: Array<TemplateAttributes>;
  addStateTournament: (tournament: TournamentCreationAttributes) => void;
  updateStateTournament: (tournament: TournamentAttributes) => void;
};

const TournamentModalButton: FunctionComponent<TournamentModalButtonProps> = ({
  templates,
  addStateTournament,
  updateStateTournament,
}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
      <Button fullWidth onClick={handleOpen}>
        <AddIcon />
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <TournamentForm
            templates={templates}
            setOpen={setOpen}
            addStateTournament={addStateTournament}
            updateStateTournament={updateStateTournament}
          />
        </Box>
      </Modal>
    </>
  );
};

export default TournamentModalButton;
