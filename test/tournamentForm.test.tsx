import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TournamentForm, { TournamentFormData } from '../src/pages/tournaments/TournamentForm';
import { TemplateAttributes } from '../src/models';

test('rendering and submitting valid form data', async () => {
  const templates: TemplateAttributes[] = [
    {
      id: 'hunter2',
      name: '*******',
    },
  ];
  const setOpen = jest.fn();
  const addTournament = jest.fn();
  render(<TournamentForm templates={templates} setOpen={setOpen} addTournament={addTournament} />);
  const user = userEvent.setup();

  const data: TournamentFormData = {
    name: 'Valid Tournament',
    submission: 'https://www.google.com',
    template: 'hunter2',
  };

  await user.type(screen.getByLabelText(/Tournament Name/i), data.name);
  await user.type(screen.getByLabelText(/Submission Form Link/i), data.submission);
  await user.click(screen.getByLabelText(/Template/i));
  await user.click(screen.getByText('*******'));
  await user.click(screen.getByRole('button', { name: /Create/i }));

  await waitFor(() => {
    expect(setOpen).toHaveBeenCalledWith(false);
    expect(addTournament).toHaveBeenCalledWith(data);
  });
});
