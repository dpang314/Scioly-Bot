import { Container, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material"
import { FunctionComponent } from "react"
import { TemplateAttributes } from "../../models/TemplateModel"
import { TemplateCreationAttributes } from "../../models/TemplateModel"
import TemplateCreationButton from "./TemplateCreationButton"
import TemplateRow from "./TemplateRow"

type TemplateTableProps = {
  templates: Array<TemplateAttributes>,
  addTemplate: (template: TemplateCreationAttributes) => void, 
}

const TemplateTable: FunctionComponent<TemplateTableProps> = ({ templates, addTemplate }) => {
  return (
    <Container maxWidth="sm" sx={{paddingTop: "20px"}}>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={3}>
                <TemplateCreationButton addTemplate={addTemplate}/>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Template</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {templates ? templates.map((template) => (
              <TemplateRow key={template.id} id={template.id} name={template.name}/>
            )) : null}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}

export default TemplateTable;