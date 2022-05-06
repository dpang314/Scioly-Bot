import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TournamentForm, { TournamentFormData } from '../src/pages/tournaments/TournamentForm';
import { TemplateAttributes } from '../src/models';

const templates: TemplateAttributes[] = [
  {
    id: 'hunter2',
    name: '*******',
  },
  {
    id: 'abcdefg',
    name: 'hijklmnop',
  },
];

const data: TournamentFormData = {
  name: 'Valid Tournament',
  submission: 'https://www.google.com',
  template: 'hunter2',
};

describe('tournament creation form', () => {
  let setOpen;
  let addTournament;
  let user;
  beforeEach(() => {
    setOpen = jest.fn();
    addTournament = jest.fn();
    user = userEvent.setup();
  });
  describe('valid forms', () => {
    test('rendering and submitting valid form data', async () => {
      render(<TournamentForm
        templates={templates}
        setOpen={setOpen}
        addTournament={addTournament}
      />);
      await user.type(screen.getByLabelText(/Tournament Name/i), data.name);
      await user.type(screen.getByLabelText(/Submission Form Link/i), data.submission);
      await user.click(screen.getByLabelText(/Template/i));
      await user.click(screen.getByText(templates[0].name));
      await user.click(screen.getByRole('button', { name: /Create/i }));

      await waitFor(() => {
        expect(setOpen).toHaveBeenCalledWith(false);
        expect(addTournament).toHaveBeenCalledWith(data);
      });
    });
  });

  describe('missing fields', () => {
    test('form should not submit with missing tournament name', async () => {
      render(<TournamentForm
        templates={templates}
        setOpen={setOpen}
        addTournament={addTournament}
      />);
      await user.type(screen.getByLabelText(/Submission Form Link/i), data.submission);
      await user.click(screen.getByLabelText(/Template/i));
      await user.click(screen.getByText(templates[0].name));
      await user.click(screen.getByRole('button', { name: /Create/i }));

      await waitFor(() => {
        // Should be 1 missing field
        expect(screen.getAllByText('Required').length).toEqual(1);
      });
    });

    test('form should not submit with missing submission link', async () => {
      render(<TournamentForm
        templates={templates}
        setOpen={setOpen}
        addTournament={addTournament}
      />);
      await user.type(screen.getByLabelText(/Tournament Name/i), data.name);
      await user.click(screen.getByLabelText(/Template/i));
      await user.click(screen.getByText(templates[0].name));
      await user.click(screen.getByRole('button', { name: /Create/i }));

      await waitFor(() => {
        // Should be 1 missing field
        expect(screen.getAllByText('Required').length).toEqual(1);
      });
    });

    test('form should not submit with missing template', async () => {
      render(<TournamentForm
        templates={templates}
        setOpen={setOpen}
        addTournament={addTournament}
      />);
      await user.type(screen.getByLabelText(/Tournament Name/i), data.name);
      await user.type(screen.getByLabelText(/Submission Form Link/i), data.submission);
      await user.click(screen.getByRole('button', { name: /Create/i }));

      await waitFor(() => {
        // Should be 1 missing field
        expect(screen.getAllByText('Required').length).toEqual(1);
      });
    });

    test('form should not submit with all missing fields', async () => {
      render(<TournamentForm
        templates={templates}
        setOpen={setOpen}
        addTournament={addTournament}
      />);
      await user.click(screen.getByRole('button', { name: /Create/i }));

      await waitFor(() => {
        // Should be three missing fields
        expect(screen.getAllByText('Required').length).toEqual(3);
      });
    });

    afterEach(() => {
      expect(setOpen).toBeCalledTimes(0);
      expect(addTournament).toBeCalledTimes(0);
    });
  });

  describe('invalid fields', () => {
    test('form should not submit with an invalid submission url', async () => {
      render(<TournamentForm
        templates={templates}
        setOpen={setOpen}
        addTournament={addTournament}
      />);
      await user.type(screen.getByLabelText(/Tournament Name/i), data.name);
      await user.type(screen.getByLabelText(/Submission Form Link/i), 'this is an invalid url');
      await user.click(screen.getByLabelText(/Template/i));
      await user.click(screen.getByText(templates[0].name));
      await user.click(screen.getByRole('button', { name: /Create/i }));

      await waitFor(() => {
        expect(setOpen).toBeCalledTimes(0);
        expect(addTournament).toBeCalledTimes(0);
        expect(screen.getByText('Must be a valid URL')).toBeDefined();
      });
    });
  });
});
