import { TableRow, TableCell, Container, Paper, Table, TableBody, TableContainer, TableHead } from "@mui/material";
import React from "react";
import { FunctionComponent } from "react";
import { AddTournament } from ".";
import { TemplateAttributes, TournamentAttributes } from "../../models";
import TournamentModalButton from "./TournamentModalButton";
import TournamentRow from "./TournamentRow";

type Props = {
  templates: Array<TemplateAttributes>,
  tournaments: Array<TournamentAttributes>,
  addTournament: AddTournament,
}

const TournamentTable: FunctionComponent<Props> = ({templates, tournaments, addTournament}) => {
  return (
    <Container maxWidth="sm" sx={{paddingTop: "20px"}}>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={3}>
                <TournamentModalButton templates={templates} addTournament={addTournament}/>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Tournament</TableCell>
              <TableCell align="right">Active?</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tournaments ? tournaments.map((tournament) => (
              <TournamentRow key={tournament.id} id={tournament.id} name={tournament.name} active={tournament.active}/>
            )): null}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
};

export default TournamentTable;