import { Modal, TableRow, TableCell, Button } from "@mui/material";
import React from "react";
import { FunctionComponent } from "react";

type TemplateRowProps = {
  id: string
  name: string,
}

const TemplateRow: FunctionComponent<TemplateRowProps> = ({id, name}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return(
    <>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <h1>Hi!</h1>
      </Modal>
      <TableRow
        key={id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          {name}
        </TableCell>
        <TableCell align="right">
          <Button onClick={handleOpen}>Edit</Button>
        </TableCell>
      </TableRow>
    </>
  )
};

export default TemplateRow;