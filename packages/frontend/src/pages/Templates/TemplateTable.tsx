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
import {TemplateAttributes} from 'scioly-bot-types';

import TemplateCreationButton from './TemplateCreationButton';
import TemplateRow from './TemplateRow';

type TemplateTableProps = {
  templates: Array<TemplateAttributes>;
  addStateTemplate: (template: TemplateAttributes) => void;
  updateStateTemplate: (template: TemplateAttributes) => void;
  deleteStateTemplate: (template: TemplateAttributes) => void;
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
            <TableCell>Template</TableCell>
            <TableCell align="right" />
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
                />
              ))
            : null}
        </TableBody>
      </Table>
    </TableContainer>
  </Container>
);

export default TemplateTable;
