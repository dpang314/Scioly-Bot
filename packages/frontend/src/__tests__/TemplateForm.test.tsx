import {render, screen, waitFor} from '@testing-library/react';

import TemplateForm, {FormProps} from '../pages/Templates/TemplateForm';
import userEvent from '@testing-library/user-event';
import {
  validCompleteTemplate,
  validTemplate,
  validTemplateEvent,
  validTemplateWithoutEvents,
  validTournamentEvent,
  validTournamentWithoutEvents,
} from 'scioly-bot-fixtures';
import {UserEvent} from '@testing-library/user-event/dist/types/setup';
import {
  TemplateCreationAttributes,
  TemplateEventCreationAttributes,
} from 'scioly-bot-types';

const addEvent = async (container: HTMLElement, user: UserEvent) => {
  await user.click(container.getElementsByClassName('add-event')[0]);
};

const removeEvent = async (container: HTMLElement, user: UserEvent) => {
  await user.click(container.getElementsByClassName('remove-event')[0]);
};

const submit = async (user: UserEvent) => {
  await user.click(screen.getByRole('button', {name: 'Save'}));
};

const createTemplate = async (
  container: HTMLElement,
  user: UserEvent,
  template: Partial<TemplateCreationAttributes>,
  shouldSubmit: boolean = true,
  extraTemplateEvents?: Partial<TemplateEventCreationAttributes>[],
) => {
  if (template.name) {
    await user.type(screen.getByLabelText('Template Name'), template.name);
  }
  let index = 0;
  if (template.templateEvents) {
    for await (const templateEvent of template.templateEvents) {
      await addEvent(container, user);
      await user.type(
        screen.getAllByLabelText('Name')[index],
        templateEvent.name,
      );
      await user.type(
        screen.getAllByLabelText('Minutes')[index],
        templateEvent.minutes.toString(),
      );
      index++;
    }
  }
  if (extraTemplateEvents) {
    for await (const templateEvent of extraTemplateEvents) {
      await addEvent(container, user);
      if (templateEvent.name) {
        await user.type(
          screen.getAllByLabelText('Name')[index],
          templateEvent.name,
        );
      }
      if (templateEvent.minutes) {
        await user.type(
          screen.getAllByLabelText('Minutes')[index],
          templateEvent.minutes.toString(),
        );
      }
      index++;
    }
  }
  if (shouldSubmit) {
    await submit(user);
  }
};

describe('template form', () => {
  const user = userEvent.setup();
  describe('creating new template', () => {
    let props: FormProps;

    beforeEach(() => {
      props = {
        setOpen: jest.fn(),
        addStateTemplate: jest.fn(),
        updateStateTemplate: jest.fn(),
      };
    });
    test('valid form without events', async () => {
      const {container} = render(<TemplateForm {...props} />);
      await createTemplate(container, user, validTemplateWithoutEvents);
      await waitFor(() => {
        expect(props.setOpen).toHaveBeenCalledWith(false);
        expect(props.addStateTemplate).toHaveBeenCalledWith({
          name: validTemplateWithoutEvents.name,
          templateEvents: [],
        });
      });
    });

    test('valid form adding events', async () => {
      const {container} = render(<TemplateForm {...props} />);
      await createTemplate(container, user, validTemplate);
      await waitFor(() => {
        expect(props.setOpen).toHaveBeenCalledWith(false);
        expect(props.addStateTemplate).toHaveBeenCalledWith(validTemplate);
      });
    });

    test('valid form adding and removing events', async () => {
      const {container} = render(<TemplateForm {...props} />);

      await createTemplate(container, user, validTemplate, false);
      await removeEvent(container, user);
      await submit(user);
      await waitFor(() => {
        expect(props.setOpen).toHaveBeenCalledWith(false);
        expect(props.addStateTemplate).toHaveBeenCalledWith({
          ...validTemplate,
          templateEvents: [],
        });
      });
    });

    test("form doesn't submit without template name", async () => {
      const {container} = render(<TemplateForm {...props} />);
      await createTemplate(container, user, {
        ...validTemplate,
        name: undefined,
      });

      expect(props.setOpen).not.toBeCalled();
      expect(props.addStateTemplate).not.toBeCalled();
      expect(screen.getByText('Required')).toBeDefined();
    });

    describe("form doesn't submit without required template event values", () => {
      test.each(['name', 'minutes'])('missing %p', async (missingValue) => {
        const {container} = render(<TemplateForm {...props} />);
        await createTemplate(
          container,
          user,
          validTournamentWithoutEvents,
          true,
          [
            {
              ...validTemplateEvent,
              name:
                missingValue === 'name' ? undefined : validTournamentEvent.name,
              minutes:
                missingValue === 'minutes'
                  ? undefined
                  : validTournamentEvent.minutes,
            },
          ],
        );
        expect(props.setOpen).not.toBeCalled();
        expect(props.addStateTemplate).not.toBeCalled();
        expect(screen.getByText('Required')).toBeDefined();
      });
    });

    describe("form doesn't submit with invalid template event minutes", () => {
      test('number too low', async () => {
        const {container} = render(<TemplateForm {...props} />);
        await createTemplate(
          container,
          user,
          validTemplateWithoutEvents,
          true,
          [
            {
              ...validTemplateEvent,
              minutes: -1,
            },
          ],
        );
        expect(props.setOpen).not.toBeCalled();
        expect(props.addStateTemplate).not.toBeCalled();
        expect(
          screen.getByText('Must be at least 1 minute long'),
        ).toBeDefined();
      });
      test('number too high', async () => {
        const {container} = render(<TemplateForm {...props} />);
        await createTemplate(
          container,
          user,
          validTemplateWithoutEvents,
          true,
          [
            {
              ...validTemplateEvent,
              minutes: 999999999999,
            },
          ],
        );
        expect(props.setOpen).not.toBeCalled();
        expect(props.addStateTemplate).not.toBeCalled();
        expect(screen.getByText('Must be 1440 minutes or less')).toBeDefined();
      });
    });
  });

  // uses the exact same form, so previous test of validity of
  // input fields applies. Only difference is that values are already filled in
  describe('updating existing template', () => {
    let props: FormProps;
    beforeEach(() => {
      props = {
        template: validCompleteTemplate,
        setOpen: jest.fn(),
        addStateTemplate: jest.fn(),
        updateStateTemplate: jest.fn(),
      };
    });
    test('saving witout changes succeeds', async () => {
      render(<TemplateForm {...props} />);
      await submit(user);
      expect(props.setOpen).toHaveBeenCalledWith(false);
      expect(props.updateStateTemplate).toHaveBeenCalledWith(
        validCompleteTemplate,
      );
    });
    test('modifying tournament succeeds', async () => {
      render(<TemplateForm {...props} />);
      await user.type(
        screen.getByLabelText('Template Name'),
        'additional text',
      );
      await submit(user);
      expect(props.setOpen).toHaveBeenCalledWith(false);
      expect(props.updateStateTemplate).toHaveBeenCalledWith({
        ...validCompleteTemplate,
        name: validCompleteTemplate.name + 'additional text',
      });
    });
    test('adding new events succeeds', async () => {
      const {container} = render(<TemplateForm {...props} />);
      await addEvent(container, user);
      await user.type(
        screen.getAllByLabelText('Name')[1],
        validTemplateEvent.name,
      );
      await user.type(
        screen.getAllByLabelText('Minutes')[1],
        validTemplateEvent.minutes.toString(),
      );
      await submit(user);
      expect(props.setOpen).toHaveBeenCalledWith(false);
      expect(props.updateStateTemplate).toHaveBeenCalledWith({
        ...validCompleteTemplate,
        templateEvents: [
          ...validCompleteTemplate.templateEvents!,
          validTemplateEvent,
        ],
      });
    });
    test('removing existing events succeeds', async () => {
      const {container} = render(<TemplateForm {...props} />);
      await removeEvent(container, user);
      await submit(user);
      expect(screen.queryByText('Template')).toBeNull();
      expect(props.setOpen).toHaveBeenCalledWith(false);
      expect(props.updateStateTemplate).toHaveBeenCalledWith({
        ...validCompleteTemplate,
        templateEvents: [],
      });
    });
  });
});
