import {Button, Modal} from '@mui/material';
import React, {FunctionComponent} from 'react';
import AddIcon from '@mui/icons-material/Add';
import {
  TemplateAttributes,
  TournamentAttributes,
  TournamentCreationAttributes,
} from 'scioly-bot-types';
import TournamentForm from './TournamentForm';
import ModalBox from '../../components/ModalBox';

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

  return (
    <>
      <Button fullWidth onClick={handleOpen}>
        <AddIcon />
      </Button>
      <Modal open={open} onClose={handleClose}>
        <ModalBox>
          <TournamentForm
            templates={templates}
            setOpen={setOpen}
            addStateTournament={addStateTournament}
            updateStateTournament={updateStateTournament}
          />
        </ModalBox>
      </Modal>
    </>
  );
};

export default TournamentModalButton;
