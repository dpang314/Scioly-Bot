import request from 'supertest';

import {Template, TemplateEvent} from 'scioly-bot-models';
import {
  incompleteTemplateEvent,
  invalidTemplateEvent,
  validTemplateEvent,
} from '../mock_data/templateEvents';
import createMockApp, {MockApp} from '../mock_data/app';
import {
  validOtherTemplate,
  validTemplate,
  validTemplateWithoutEvents,
} from '../mock_data/templates';

describe('template event endpoint', () => {
  let server: request.SuperTest<request.Test>;
  let mockData: MockApp;
  beforeEach(async () => {
    mockData = await createMockApp();
    server = request(mockData.mockApp);
  });

  describe('GET', () => {
    let template: Template;
    let otherTemplate: Template;

    beforeEach(async () => {
      template = await mockData.mockUser.createTemplate(validTemplate, {
        include: [{model: TemplateEvent, as: 'templateEvents'}],
      });
      otherTemplate = await mockData.mockOtherUser.createTemplate(
        validOtherTemplate,
        {
          include: [{model: TemplateEvent, as: 'templateEvents'}],
        },
      );
    });

    test('getting list of template without template events returns empty array', async () => {
      const templateWithoutEvents = await mockData.mockUser.createTemplate(
        validTemplateWithoutEvents,
      );
      const response = await server.get(
        `/api/templates/${templateWithoutEvents.id}/events`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual([]);
    });

    test("getting list returns template's events", async () => {
      const response = await server.get(`/api/templates/${template.id}/events`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual(
        template.templateEvents?.map((event) => event.toJSON()),
      );
    });

    test('getting a template event by id succeeds', async () => {
      const response = await server.get(
        `/api/templates/${template.id}/events/${
          template.templateEvents![0].id
        }`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual(template.templateEvents![0].toJSON());
    });

    test("getting a different user's template event returns 404", async () => {
      const response = await server.get(
        `/api/templates/${otherTemplate.id}/events/${
          otherTemplate.templateEvents![0].id
        }`,
      );
      expect(response.statusCode).toBe(404);
    });

    test('getting a nonexistent template event returns 404', async () => {
      const response = await server.get(
        `/api/templates/${template.id}/events/this-is-not-a-real-event-id`,
      );
      expect(response.statusCode).toBe(404);
    });
  });

  describe('POST', () => {
    let templateWithoutEvents: Template;

    beforeEach(async () => {
      templateWithoutEvents = await mockData.mockUser.createTemplate(
        validTemplateWithoutEvents,
      );
    });

    test('creating tournament event on nonexistent template returns 404', async () => {
      const response = await server
        .post(`/api/templates/this-is-not-a-real-id/events`)
        .send(validTemplateEvent);
      expect(response.statusCode).toBe(404);
    });
    test("posting to other user's template fails", async () => {
      const otherTemplate = await mockData.mockOtherUser.createTemplate(
        validOtherTemplate,
      );
      const response = await server
        .post(`/api/templates/${otherTemplate.id}/events`)
        .send(validTemplateEvent);
      expect(response.statusCode).toBe(404);
    });
    test('valid template event succeeds', async () => {
      const response = await server
        .post(`/api/templates/${templateWithoutEvents.id}/events`)
        .send(validTemplateEvent);
      expect(response.statusCode).toBe(200);
      const newTemplateEvents = await templateWithoutEvents.getTemplateEvents();
      expect(newTemplateEvents.length).toBe(1);
      expect(response.body).toStrictEqual(newTemplateEvents![0].toJSON());
    });
    test('incomplete template event returns 400', async () => {
      const response = await server
        .post(`/api/templates/${templateWithoutEvents.id}/events`)
        .send(incompleteTemplateEvent);
      expect(response.statusCode).toBe(400);
    });
    test('template with invalid field returns 400', async () => {
      const response = await server
        .post(`/api/templates/${templateWithoutEvents.id}/events`)
        .send(invalidTemplateEvent);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('PATCH', () => {
    let template: Template;
    let otherTemplate: Template;
    let templateEvent: TemplateEvent;

    beforeEach(async () => {
      template = await mockData.mockUser.createTemplate(validTemplate, {
        include: [{model: TemplateEvent, as: 'templateEvents'}],
      });
      otherTemplate = await mockData.mockOtherUser.createTemplate(
        validOtherTemplate,
        {
          include: [{model: TemplateEvent, as: 'templateEvents'}],
        },
      );
      templateEvent = await template.createTemplateEvent(validTemplateEvent);
    });

    test('invalid template returns 404', async () => {
      const response = await server.patch(
        `/api/templates/not-an-actual-id/events/${templateEvent.id}`,
      );
      expect(response.statusCode).toBe(404);
    });

    test('invalid template event id returns 404', async () => {
      const response = await server.patch(
        `/api/templates/${template.id}/events/not-an-actual-id`,
      );
      expect(response.statusCode).toBe(404);
    });

    test('valid partial template event succeeds', async () => {
      const response = await server
        .patch(`/api/templates/${template.id}/events/${templateEvent.id}`)
        .send(incompleteTemplateEvent);
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({
        ...templateEvent.toJSON(),
        ...incompleteTemplateEvent,
      });
    });
    test('template event with invalid field returns 400', async () => {
      const response = await server
        .patch(`/api/templates/${template.id}/events/${templateEvent.id}`)
        .send(invalidTemplateEvent);
      expect(response.statusCode).toBe(400);
    });
    test("modifying a different user's template returns 404", async () => {
      const response = await server.patch(
        `/api/templates/${otherTemplate.id}/events/${templateEvent.id}`,
      );
      expect(response.statusCode).toBe(404);
    });
  });

  describe('DELETE', () => {
    let template: Template;
    let templateEvent: TemplateEvent;

    beforeEach(async () => {
      template = await mockData.mockUser.createTemplate(
        validTemplateWithoutEvents,
        {
          include: [{model: TemplateEvent, as: 'templateEvents'}],
        },
      );
      templateEvent = await template.createTemplateEvent(validTemplateEvent);
    });

    test('invalid template returns 404', async () => {
      const response = await server.delete(
        `/api/templates/not-an-actual-id/events/${templateEvent.id}`,
      );
      expect(response.statusCode).toBe(404);
    });

    test('invalid template event id returns 404', async () => {
      const response = await server.delete(
        `/api/templates/${template.id}/events/not-an-actual-id`,
      );
      expect(response.statusCode).toBe(404);
    });

    test('deleting a template event by id succeeds', async () => {
      const response = await server.delete(
        `/api/templates/${template.id}/events/${templateEvent.id}`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual(templateEvent.toJSON());
      expect(await TemplateEvent.count({where: {id: templateEvent.id}})).toBe(
        0,
      );
      template.templateEvents?.forEach(async (templateEvent) => {
        expect(await TemplateEvent.count({where: {id: templateEvent.id}})).toBe(
          0,
        );
      });
    });

    test("deleting a different user's template returns 404", async () => {
      const otherTemplate = await mockData.mockOtherUser.createTemplate(
        validOtherTemplate,
        {
          include: [{model: TemplateEvent, as: 'templateEvents'}],
        },
      );
      const otherTemplateEvent = await otherTemplate.createTemplateEvent(
        validTemplateEvent,
      );
      const response = await server.delete(
        `/api/templates/${otherTemplate.id}/events/${otherTemplateEvent.id}`,
      );
      expect(response.statusCode).toBe(404);
    });
  });
});
