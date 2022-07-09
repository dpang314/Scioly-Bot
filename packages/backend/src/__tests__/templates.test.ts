import request from 'supertest';

import {Template, TemplateEvent} from 'scioly-bot-models';
import {
  validTemplate,
  validOtherTemplate,
  invalidTemplate,
  incompleteTemplate,
  validTemplateWithoutEvents,
} from 'scioly-bot-test-data';
import createMockApp, {MockApp} from '../mock-app/app';

describe('template endpoint', () => {
  let server: request.SuperTest<request.Test>;
  let mockData: MockApp;
  beforeEach(async () => {
    mockData = await createMockApp();
    server = request(mockData.mockApp);
  });

  describe('GET', () => {
    describe('without templates', () => {
      test('getting list of user without templates returns empty array', async () => {
        const response = await server.get('/api/templates');
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
      });
    });

    describe('with templates', () => {
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

      test("getting list only returns user's templates", async () => {
        const response = await server.get('/api/templates');
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([template.toJSON()]);
      });

      test('getting a template by id succeeds', async () => {
        const response = await server.get(`/api/templates/${template.id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual(template.toJSON());
      });

      test("getting a different user's template returns 404", async () => {
        const response = await server.get(`/api/templates/${otherTemplate.id}`);
        expect(response.statusCode).toBe(404);
      });

      test('getting a nonexistent tournament returns 404', async () => {
        const response = await server.get(
          '/api/templates/this-is-not-a-real-id',
        );
        expect(response.statusCode).toBe(404);
      });
    });
  });

  describe('POST', () => {
    test('valid templates succeeds', async () => {
      const response = await server.post('/api/templates').send(validTemplate);
      expect(response.statusCode).toBe(200);
    });
    test('incomplete template returns 400', async () => {
      const response = await server
        .post('/api/templates')
        .send(incompleteTemplate);
      expect(response.statusCode).toBe(400);
    });
    test('template with invalid field returns 400', async () => {
      const response = await server
        .post('/api/templates')
        .send(invalidTemplate);
      expect(response.statusCode).toBe(400);
    });
  });

  describe('PATCH', () => {
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

    test('valid partial template succeeds', async () => {
      const response = await server
        .patch(`/api/templates/${template.id}`)
        .send({name: 'hunter2'});
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({
        ...template.toJSON(),
        name: 'hunter2',
      });
    });
    test('template with invalid field returns 400', async () => {
      const response = await server
        .patch(`/api/templates/${template.id}`)
        .send(invalidTemplate);
      expect(response.statusCode).toBe(400);
    });
    test("modifying a different user's template returns 404", async () => {
      const response = await server.patch(`/api/templates/${otherTemplate.id}`);
      expect(response.statusCode).toBe(404);
    });
  });

  describe('PUT', () => {
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

    test('valid template adds event', async () => {
      const response = await server
        .put(`/api/templates/${template.id}`)
        .send(validOtherTemplate);
      await template.reload();
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({
        ...template.toJSON(),
        ...validOtherTemplate,
        templateEvents: [
          {
            id: template.templateEvents![0].id,
            minutes: validOtherTemplate.templateEvents![0].minutes,
            name: validOtherTemplate.templateEvents![0].name,
            templateId: template.id,
          },
        ],
        userId: template.userId,
      });
    });
    test('valid template removes event', async () => {
      const response = await server
        .put(`/api/templates/${template.id}`)
        .send(validTemplateWithoutEvents);
      await template.reload();
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({
        ...template.toJSON(),
        ...validTemplateWithoutEvents,
        templateEvents: [],
        userId: template.userId,
      });
    });
    test('template with invalid field returns 400', async () => {
      const response = await server
        .put(`/api/templates/${template.id}`)
        .send(invalidTemplate);
      expect(response.statusCode).toBe(400);
    });
    test("modifying a different user's template returns 404", async () => {
      const response = await server.put(`/api/templates/${otherTemplate.id}`);
      expect(response.statusCode).toBe(404);
    });
  });

  describe('DELETE', () => {
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

    test('deleting a template by id succeeds', async () => {
      const response = await server.delete(`/api/templates/${template.id}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({});
      expect(await Template.count({where: {id: template.id}})).toBe(0);
      template.templateEvents?.forEach(async (templateEvent) => {
        expect(await TemplateEvent.count({where: {id: templateEvent.id}})).toBe(
          0,
        );
      });
    });

    test("deleting a different user's template returns 404", async () => {
      const response = await server.delete(
        `/api/templates/${otherTemplate.id}`,
      );
      expect(response.statusCode).toBe(404);
    });

    test('deleting a nonexistent template returns 404', async () => {
      const response = await server.delete(
        '/api/templates/this-is-not-a-real-id',
      );
      expect(response.statusCode).toBe(404);
    });
  });
});
