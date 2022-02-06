import { Button, Modal, Box } from "@mui/material";
import { FunctionComponent } from "react";
import { TemplateCreationAttributes } from "../../models/TemplateModel";
import TemplateForm from "./TemplateForm";
import AddIcon from '@mui/icons-material/Add';
import React from "react";

type TemplateCreationButtonProps = {
  addTemplate: (template: TemplateCreationAttributes) => void,
}

const TemplateCreationButton: FunctionComponent<TemplateCreationButtonProps> = ({ addTemplate }) => {
  const [open, setOpen] = React.useState(false);
  //const [templates, setTemplates] = React.useState(null);
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
    maxHeight: "90vh"
  };

  return (
    <>
      <Button fullWidth onClick={handleOpen}>
        <AddIcon/>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <TemplateForm setOpen={setOpen} addTemplate={addTemplate}/>
        </Box>
      </Modal>
    </>
  )
}

export default TemplateCreationButton;