import { Button, Modal, Box } from '@mui/material';
import React, { FunctionComponent } from 'react';
import AddIcon from '@mui/icons-material/Add';
import TemplateForm from './TemplateForm';

const TemplateCreationButton:
FunctionComponent = () => {
  const [open, setOpen] = React.useState(false);
  // const [templates, setTemplates] = React.useState(null);
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
    overflowY: 'scroll',
    maxHeight: '90vh',
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
          <TemplateForm setOpen={setOpen} />
        </Box>
      </Modal>
    </>
  );
};

export default TemplateCreationButton;
