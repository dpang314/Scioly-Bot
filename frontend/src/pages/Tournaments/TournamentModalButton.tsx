import { Button, Modal, Box } from '@mui/material';
import React, { FunctionComponent } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { TemplateAttributes } from '../../../../common/models/TemplateModel';
import TournamentForm, { AddTournament } from './TournamentForm';

type TournamentModalButtonProps = {
  templates: Array<TemplateAttributes>
  addTournament: AddTournament,
}

const TournamentModalButton:
FunctionComponent<TournamentModalButtonProps> = ({ templates, addTournament }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
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
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <TournamentForm templates={templates} setOpen={setOpen} addTournament={addTournament} />
        </Box>
      </Modal>
    </>
  );
};

export default TournamentModalButton;
