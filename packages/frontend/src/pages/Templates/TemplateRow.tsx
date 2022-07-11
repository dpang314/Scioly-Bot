import {Modal, TableRow, TableCell, Button} from '@mui/material';
import React, {FunctionComponent} from 'react';
import {TemplateAttributes, TemplateCreationAttributes} from 'scioly-bot-types';
import {deleteTemplate} from '../../api/templates';
import ModalBox from '../../components/ModalBox';
import TemplateForm from './TemplateForm';

type TemplateRowProps = {
  template: TemplateAttributes;
  addStateTemplate: (template: TemplateCreationAttributes) => void;
  updateStateTemplate: (template: TemplateAttributes) => void;
  deleteStateTemplate: (id: string) => void;
};

const TemplateRow: FunctionComponent<TemplateRowProps> = ({
  template,
  addStateTemplate,
  updateStateTemplate,
  deleteStateTemplate,
}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = async () => {
    await deleteTemplate(template.id);
    deleteStateTemplate(template.id);
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <ModalBox>
          <TemplateForm
            setOpen={setOpen}
            template={template}
            addStateTemplate={addStateTemplate}
            updateStateTemplate={updateStateTemplate}
          />
        </ModalBox>
      </Modal>
      <TableRow
        key={template.id}
        sx={{'&:last-child td, &:last-child th': {border: 0}}}>
        <TableCell component="th" scope="row" width="80%">
          {template.name}
        </TableCell>
        <TableCell align="right" width="10%">
          <Button onClick={handleOpen} variant="outlined">
            Edit
          </Button>
        </TableCell>
        <TableCell align="right" width="10%">
          <Button onClick={handleDelete} variant="outlined" color="error">
            Delete
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};

export default TemplateRow;
