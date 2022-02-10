import {
  Container, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';
import React, { FunctionComponent } from 'react';
import { TemplateAttributes } from '../../models/TemplateModel';

import TemplateCreationButton from './TemplateCreationButton';
import TemplateRow from './TemplateRow';

type TemplateTableProps = {
  templates: Array<TemplateAttributes>,
}

const TemplateTable: FunctionComponent<TemplateTableProps> = ({ templates }) => (
  <Container maxWidth="sm" sx={{ paddingTop: '20px' }}>
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell colSpan={3}>
              <TemplateCreationButton />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Template</TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {templates ? templates.map((template) => (
            <TemplateRow key={template.id} id={template.id} name={template.name} />
          )) : null}
        </TableBody>
      </Table>
    </TableContainer>
  </Container>
);

export default TemplateTable;
