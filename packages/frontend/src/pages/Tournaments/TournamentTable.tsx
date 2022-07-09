import {
  TableRow,
  TableCell,
  Container,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
} from '@mui/material';
import React, {FunctionComponent} from 'react';

import {TemplateAttributes, TournamentAttributes} from 'scioly-bot-types';
import TournamentModalButton from './TournamentModalButton';
import TournamentRow from './TournamentRow';

type Props = {
  templates: TemplateAttributes[];
  tournaments: TournamentAttributes[];
  addStateTournament: (tournament: TournamentAttributes) => void;
  updateStateTournament: (tournament: TournamentAttributes) => void;
  deleteStateTournament: (id: string) => void;
};

const TournamentTable: FunctionComponent<Props> = ({
  templates,
  tournaments,
  addStateTournament,
  updateStateTournament,
  deleteStateTournament,
}) => (
  <Container maxWidth="sm" sx={{paddingTop: '20px'}}>
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell colSpan={4}>
              <TournamentModalButton
                templates={templates}
                addStateTournament={addStateTournament}
                updateStateTournament={updateStateTournament}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell width="50%">Tournament</TableCell>
            <TableCell width="20%" align="right">
              Active?
            </TableCell>
            <TableCell width="10%" align="right" />
            <TableCell width="10%" align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {tournaments
            ? tournaments.map((tournament) => (
                <TournamentRow
                  key={tournament.id}
                  tournament={tournament}
                  templates={templates}
                  addStateTournament={addStateTournament}
                  updateStateTournament={updateStateTournament}
                  deleteStateTournament={deleteStateTournament}
                />
              ))
            : null}
        </TableBody>
      </Table>
    </TableContainer>
  </Container>
);

export default TournamentTable;
