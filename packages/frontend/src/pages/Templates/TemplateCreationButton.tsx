import {Button, Modal} from '@mui/material';
import React, {FunctionComponent} from 'react';
import AddIcon from '@mui/icons-material/Add';
import TemplateForm from './TemplateForm';
import {TemplateAttributes, TemplateCreationAttributes} from 'scioly-bot-types';
import ModalBox from '../../components/ModalBox';

interface FormProps {
  addStateTemplate: (template: TemplateCreationAttributes) => void;
  updateStateTemplate: (template: TemplateAttributes) => void;
}

const TemplateCreationButton: FunctionComponent<FormProps> = ({
  addStateTemplate,
  updateStateTemplate,
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
          <TemplateForm
            setOpen={setOpen}
            addStateTemplate={addStateTemplate}
            updateStateTemplate={updateStateTemplate}
          />
        </ModalBox>
      </Modal>
    </>
  );
};

export default TemplateCreationButton;
