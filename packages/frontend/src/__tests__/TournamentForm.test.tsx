import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';

import TournamentForm, {FormProps} from '../pages/Tournaments/TournamentForm';
import userEvent from '@testing-library/user-event';
import {
  validCompleteTemplate,
  validCompleteTournament,
  validTournament,
  validTournamentEvent,
  validTournamentWithoutEvents,
} from 'scioly-bot-test-data';
import {UserEvent} from '@testing-library/user-event/dist/types/setup';
import {
  TournamentCreationAttributes,
  TournamentEventCreationAttributes,
} from 'scioly-bot-types';

const selectTemplate = async (user: UserEvent, templateName: string) => {
  await user.click(screen.getByLabelText('Template'));
  await user.click(screen.getByText(templateName));
};

const addEvent = async (container: HTMLElement, user: UserEvent) => {
  await user.click(container.getElementsByClassName('add-event')[0]);
};

const removeEvent = async (container: HTMLElement, user: UserEvent) => {
  await user.click(container.getElementsByClassName('remove-event')[0]);
};

const submit = async (user: UserEvent) => {
  await user.click(screen.getByRole('button', {name: 'Save'}));
};

const createTournament = async (
  container: HTMLElement,
  user: UserEvent,
  tournament: Partial<TournamentCreationAttributes>,
  shouldSubmit: boolean = true,
  extraTournamentEvents?: Partial<TournamentEventCreationAttributes>[],
  templateName?: string,
  templateTournamentEvents?: Partial<TournamentEventCreationAttributes>[],
) => {
  if (tournament.name) {
    await user.type(screen.getByLabelText('Tournament Name'), tournament.name);
  }
  if (tournament.submission) {
    await user.type(
      screen.getByLabelText('Submission Form Link'),
      tournament.submission,
    );
  }

  if (templateName) {
    await selectTemplate(user, templateName);
  }

  if (templateTournamentEvents) {
    for await (const [
      index,
      tournamentEvent,
    ] of templateTournamentEvents.entries()) {
      if (tournamentEvent.name) {
        await user.type(
          screen.getAllByLabelText('Name')[index],
          tournamentEvent.name,
        );
      }
      if (tournamentEvent.minutes) {
        await user.type(
          screen.getAllByLabelText('Minutes')[index],
          tournamentEvent.minutes.toString(),
        );
      }
      if (tournamentEvent.link) {
        await user.type(
          screen.getAllByLabelText('Link')[index],
          tournamentEvent.link,
        );
      }
    }
  }

  let index = 0;

  if (tournament.tournamentEvents) {
    for await (const tournamentEvent of tournament.tournamentEvents) {
      await addEvent(container, user);
      await user.type(
        screen.getAllByLabelText('Name')[index],
        tournamentEvent.name,
      );
      await user.type(
        screen.getAllByLabelText('Minutes')[index],
        tournamentEvent.minutes.toString(),
      );
      await user.type(
        screen.getAllByLabelText('Link')[index],
        tournamentEvent.link,
      );
      index++;
    }
  }
  if (extraTournamentEvents) {
    for await (const tournamentEvent of extraTournamentEvents) {
      await addEvent(container, user);
      if (tournamentEvent.name) {
        await user.type(
          screen.getAllByLabelText('Name')[index],
          tournamentEvent.name,
        );
      }
      if (tournamentEvent.minutes) {
        await user.type(
          screen.getAllByLabelText('Minutes')[index],
          tournamentEvent.minutes.toString(),
        );
      }
      if (tournamentEvent.link) {
        await user.type(
          screen.getAllByLabelText('Link')[index],
          tournamentEvent.link,
        );
      }
      index++;
    }
  }
  if (shouldSubmit) {
    await submit(user);
  }
};

describe('tournament form', () => {
  const user = userEvent.setup();
  describe('creating new tournament', () => {
    let props: FormProps;

    beforeEach(() => {
      props = {
        templates: [],
        setOpen: jest.fn(),
        addStateTournament: jest.fn(),
        updateStateTournament: jest.fn(),
      };
    });
    describe('with no template selected', () => {
      test('valid form without events', async () => {
        const {container} = render(<TournamentForm {...props} />);
        await createTournament(container, user, validTournamentWithoutEvents);
        await waitFor(() => {
          expect(props.setOpen).toHaveBeenCalledWith(false);
          expect(props.addStateTournament).toHaveBeenCalledWith({
            name: validTournamentWithoutEvents.name,
            submission: validTournamentWithoutEvents.submission,
            active: false,
            template: '',
            tournamentEvents: [],
          });
        });
      });

      test('valid form adding events', async () => {
        const {container} = render(<TournamentForm {...props} />);
        await createTournament(container, user, validTournament);
        await waitFor(() => {
          expect(props.setOpen).toHaveBeenCalledWith(false);
          expect(props.addStateTournament).toHaveBeenCalledWith({
            ...validTournament,
            template: '',
          });
        });
      });

      test('valid form adding and removing events', async () => {
        const {container} = render(<TournamentForm {...props} />);

        await createTournament(container, user, validTournament, false);
        await removeEvent(container, user);
        await submit(user);
        await waitFor(() => {
          expect(props.setOpen).toHaveBeenCalledWith(false);
          expect(props.addStateTournament).toHaveBeenCalledWith({
            ...validTournament,
            template: '',
            tournamentEvents: [],
          });
        });
      });

      describe("form doesn't submit without required tournament values", () => {
        test.each(['name', 'submission'])(
          'missing %p',
          async (missingValue) => {
            const {container} = render(<TournamentForm {...props} />);
            await createTournament(container, user, {
              ...validTournamentWithoutEvents,
              name:
                missingValue === 'name'
                  ? undefined
                  : validTournamentWithoutEvents.name,
              submission:
                missingValue === 'submission'
                  ? undefined
                  : validTournamentWithoutEvents.submission,
            });

            expect(props.setOpen).not.toBeCalled();
            expect(props.addStateTournament).not.toBeCalled();
            expect(screen.getByText('Required')).toBeDefined();
          },
        );
      });

      describe("form doesn't submit without required tournament event values", () => {
        test.each(['name', 'link', 'minutes'])(
          'missing %p',
          async (missingValue) => {
            const {container} = render(<TournamentForm {...props} />);
            await createTournament(
              container,
              user,
              validTournamentWithoutEvents,
              true,
              [
                {
                  ...validTournamentEvent,
                  name:
                    missingValue === 'name'
                      ? undefined
                      : validTournamentEvent.name,
                  link:
                    missingValue === 'link'
                      ? undefined
                      : validTournamentEvent.link,
                  minutes:
                    missingValue === 'minutes'
                      ? undefined
                      : validTournamentEvent.minutes,
                },
              ],
            );
            expect(props.setOpen).not.toBeCalled();
            expect(props.addStateTournament).not.toBeCalled();
            expect(screen.getByText('Required')).toBeDefined();
          },
        );
      });

      describe("form doesn't submit with invalid submission urls", () => {
        test.each(['www.google.com', 'google.com', 'not a url'])(
          'invalid url: %p',
          async (invalidUrl) => {
            const {container} = render(<TournamentForm {...props} />);
            await createTournament(container, user, {
              ...validTournament,
              submission: invalidUrl,
            });
            expect(props.setOpen).not.toBeCalled();
            expect(props.addStateTournament).not.toBeCalled();
            expect(
              screen.getByText('Must be a full URL with http:// or https://'),
            ).toBeDefined();
          },
        );
      });

      describe("form doesn't submit with invalid tournament submission links", () => {
        test.each(['www.google.com', 'google.com', 'not a url'])(
          'invalid url: %p',
          async (invalidUrl) => {
            const {container} = render(<TournamentForm {...props} />);
            await createTournament(
              container,
              user,
              validTournamentWithoutEvents,
              true,
              [
                {
                  ...validTournamentEvent,
                  link: invalidUrl,
                },
              ],
            );
            expect(props.setOpen).not.toBeCalled();
            expect(props.addStateTournament).not.toBeCalled();
            expect(
              screen.getByText('Must be a full URL with http:// or https://'),
            ).toBeDefined();
          },
        );
      });

      describe("form doesn't submit with invalid tournament event minutes", () => {
        test('number too low', async () => {
          const {container} = render(<TournamentForm {...props} />);
          await createTournament(
            container,
            user,
            validTournamentWithoutEvents,
            true,
            [
              {
                ...validTournamentEvent,
                minutes: -1,
              },
            ],
          );
          expect(props.setOpen).not.toBeCalled();
          expect(props.addStateTournament).not.toBeCalled();
          expect(
            screen.getByText('Must be at least 1 minute long'),
          ).toBeDefined();
        });
        test('number too high', async () => {
          const {container} = render(<TournamentForm {...props} />);
          await createTournament(
            container,
            user,
            validTournamentWithoutEvents,
            true,
            [
              {
                ...validTournamentEvent,
                minutes: 999999999999,
              },
            ],
          );
          expect(props.setOpen).not.toBeCalled();
          expect(props.addStateTournament).not.toBeCalled();
          expect(
            screen.getByText('Must be 1440 minutes or less'),
          ).toBeDefined();
        });
      });
    });

    describe('with templates', () => {
      let props: FormProps;
      beforeEach(() => {
        props = {
          templates: [validCompleteTemplate],
          setOpen: jest.fn(),
          addStateTournament: jest.fn(),
          updateStateTournament: jest.fn(),
        };
      });
      test('only need to fill in tournament event submission', async () => {
        const {container} = render(<TournamentForm {...props} />);
        await createTournament(
          container,
          user,
          validTournamentWithoutEvents,
          true,
          [],
          validCompleteTemplate.name,
          [{link: 'https://google.com'}],
        );
        expect(props.setOpen).toHaveBeenCalledWith(false);
        expect(props.addStateTournament).toHaveBeenCalledWith({
          name: validTournamentWithoutEvents.name,
          submission: validTournamentWithoutEvents.submission,
          active: false,
          template: 0,
          tournamentEvents: [
            {
              ...validCompleteTemplate.templateEvents![0],
              link: 'https://google.com',
            },
          ],
        });
      });

      test('choosing a template replaces current tournament events', async () => {
        const {container} = render(<TournamentForm {...props} />);
        // create without template, but don't save
        await createTournament(container, user, validTournament, false);
        await selectTemplate(user, validCompleteTemplate.name);
        expect(props.setOpen).not.toBeCalled();
        expect(props.addStateTournament).not.toBeCalled();
        // missing the link for new tournament event that template generates
        expect(screen.getByText('Required')).toBeDefined();
      });

      test('switching from no template to no template does not change tournament events', async () => {
        const {container} = render(<TournamentForm {...props} />);
        await createTournament(container, user, validTournament, false);
        await selectTemplate(user, 'None');
        await submit(user);
        expect(props.setOpen).toHaveBeenCalledWith(false);
        await waitFor(() => {
          expect(props.setOpen).toHaveBeenCalledWith(false);
          expect(props.addStateTournament).toHaveBeenCalledWith({
            ...validTournament,
            template: '',
          });
        });
      });
    });
  });

  // uses the exact same form, so previous test of validity of
  // input fields applies. Only difference is that templates can't be used
  // and values are already filled in
  describe('updating existing tournament', () => {
    let props: FormProps;
    beforeEach(() => {
      props = {
        templates: [],
        tournament: validCompleteTournament,
        setOpen: jest.fn(),
        addStateTournament: jest.fn(),
        updateStateTournament: jest.fn(),
      };
    });
    test('saving witout changes succeeds', async () => {
      const {container} = render(<TournamentForm {...props} />);
      await submit(user);
      expect(screen.queryByText('Template')).toBeNull();
      expect(props.setOpen).toHaveBeenCalledWith(false);
      expect(props.updateStateTournament).toHaveBeenCalledWith({
        ...validCompleteTournament,
        template: '',
      });
    });
    test('modifying tournament succeeds', async () => {
      const {container} = render(<TournamentForm {...props} />);
      await user.type(
        screen.getByLabelText('Tournament Name'),
        'additional text',
      );
      expect(screen.queryByText('Template')).toBeNull();
      await submit(user);
      expect(props.setOpen).toHaveBeenCalledWith(false);
      expect(props.updateStateTournament).toHaveBeenCalledWith({
        ...validCompleteTournament,
        name: validCompleteTournament.name + 'additional text',
        template: '',
      });
    });
    test('adding new events succeeds', async () => {
      const {container} = render(<TournamentForm {...props} />);
      await addEvent(container, user);
      await user.type(
        screen.getAllByLabelText('Name')[1],
        validTournamentEvent.name,
      );
      await user.type(
        screen.getAllByLabelText('Minutes')[1],
        validTournamentEvent.minutes.toString(),
      );
      await user.type(
        screen.getAllByLabelText('Link')[1],
        validTournamentEvent.link,
      );
      await submit(user);
      expect(screen.queryByText('Template')).toBeNull();
      expect(props.setOpen).toHaveBeenCalledWith(false);
      expect(props.updateStateTournament).toHaveBeenCalledWith({
        ...validCompleteTournament,
        template: '',
        tournamentEvents: [
          ...validCompleteTournament.tournamentEvents!,
          validTournamentEvent,
        ],
      });
    });
    test('removing existing events succeeds', async () => {
      const {container} = render(<TournamentForm {...props} />);
      await removeEvent(container, user);
      await submit(user);
      expect(screen.queryByText('Template')).toBeNull();
      expect(props.setOpen).toHaveBeenCalledWith(false);
      expect(props.updateStateTournament).toHaveBeenCalledWith({
        ...validCompleteTournament,
        template: '',
        tournamentEvents: [],
      });
    });
  });
});
