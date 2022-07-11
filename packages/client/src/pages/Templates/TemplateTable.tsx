import {
  Container,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import {FunctionComponent} from 'react';
import {TemplateAttributes, TemplateCreationAttributes} from 'scioly-bot-types';

import TemplateCreationButton from './TemplateCreationButton';
import TemplateRow from './TemplateRow';

type TemplateTableProps = {
  templates: Array<TemplateAttributes>;
  addStateTemplate: (template: TemplateCreationAttributes) => void;
  updateStateTemplate: (template: TemplateAttributes) => void;
  deleteStateTemplate: (id: string) => void;
};

const TemplateTable: FunctionComponent<TemplateTableProps> = ({
  templates,
  addStateTemplate,
  updateStateTemplate,
  deleteStateTemplate,
}) => (
  <Container maxWidth="sm" sx={{paddingTop: '20px'}}>
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell colSpan={3}>
              <TemplateCreationButton
                addStateTemplate={addStateTemplate}
                updateStateTemplate={updateStateTemplate}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell width="80%">Template</TableCell>
            <TableCell width="10%" align="right" />
            <TableCell width="10%" align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {templates
            ? templates.map((template) => (
                <TemplateRow
                  key={template.id}
                  template={template}
                  addStateTemplate={addStateTemplate}
                  updateStateTemplate={updateStateTemplate}
                  deleteStateTemplate={deleteStateTemplate}
                />
              ))
            : null}
        </TableBody>
      </Table>
    </TableContainer>
  </Container>
);

export default TemplateTable;
