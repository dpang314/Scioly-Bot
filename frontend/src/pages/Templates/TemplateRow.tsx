import {
  Modal, TableRow, TableCell, Button, Box,
} from '@mui/material';
import React, { FunctionComponent } from 'react';
import TemplateForm from './TemplateForm';

type TemplateRowProps = {
  id: string
  name: string,
}

const TemplateRow: FunctionComponent<TemplateRowProps> = ({ id, name }) => {
  const [open, setOpen] = React.useState(false);
  const [templateName, setTemplateName] = React.useState(name);
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
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <TemplateForm setOpen={setOpen} id={id} setName={setTemplateName} />
        </Box>
      </Modal>
      <TableRow
        key={id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          {templateName}
        </TableCell>
        <TableCell align="right">
          <Button onClick={handleOpen}>Edit</Button>
        </TableCell>
      </TableRow>
    </>
  );
};

export default TemplateRow;
