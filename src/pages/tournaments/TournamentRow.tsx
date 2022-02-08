import { Modal, TableRow, TableCell, Switch, Button } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { FunctionComponent } from "react";
import { EventAttributes } from "../../models";
import TournamentEventsForm from "./TournamentEventsForm";

type Props = {
  id: string,
  name: string,
  active: boolean,
}

const TournamentRow: FunctionComponent<Props> = ({id, name, active}) => {
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState(active);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const toggleStatus = () => {
    setStatus(!status);
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
    borderRadius: 2
  };

  return(
    <>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <TournamentEventsForm id={id} tournamentName={name}/>
        </Box>
      </Modal>
      <TableRow
        key={name}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          {name}
        </TableCell>
        <TableCell align="right">
          <Switch 
            onChange={toggleStatus} 
            checked={status} 
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </TableCell>
        <TableCell align="right">
          <Button onClick={handleOpen}>Edit</Button>
        </TableCell>
      </TableRow>
    </>
  )
};

export default TournamentRow;