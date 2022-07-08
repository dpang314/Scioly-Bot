import {Modal, TableRow, TableCell, Button, Box} from '@mui/material';
import React, {FunctionComponent} from 'react';
import {TemplateAttributes} from 'scioly-bot-types';
import TemplateForm from './TemplateForm';

type TemplateRowProps = {
  template: TemplateAttributes;
  addStateTemplate: (template: TemplateAttributes) => void;
  updateStateTemplate: (template: TemplateAttributes) => void;
};

const TemplateRow: FunctionComponent<TemplateRowProps> = ({
  template,
  addStateTemplate,
  updateStateTemplate,
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
    overflowY: 'scroll',
    maxHeight: '90vh',
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <TemplateForm
            setOpen={setOpen}
            template={template}
            addStateTemplate={addStateTemplate}
            updateStateTemplate={updateStateTemplate}
          />
        </Box>
      </Modal>
      <TableRow
        key={template.id}
        sx={{'&:last-child td, &:last-child th': {border: 0}}}>
        <TableCell component="th" scope="row">
          {template.name}
        </TableCell>
        <TableCell align="right">
          <Button onClick={handleOpen}>Edit</Button>
        </TableCell>
      </TableRow>
    </>
  );
};

export default TemplateRow;
