import request from 'supertest';

import {Template, TemplateEvent} from '../models';
import {
  validTemplate,
  validOtherTemplate,
  invalidTemplate,
  incompleteTemplate,
  validTemplate2,
} from '../mock_data/templates';
import createMockApp, {MockApp} from '../mock_data/app';

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
        const response = await server.get(
          `/api/templates/${otherTemplate.id}`,
        );
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
      const response = await server
        .post('/api/templates')
        .send(validTemplate);
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
    // TODO add a test with a template
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

    test('valid template succeeds', async () => {
      const response = await server
        .put(`/api/templates/${template.id}`)
        .send(validOtherTemplate);
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({
        ...validOtherTemplate,
        user: mockData.mockUser.id,
        id: template.id,
      });
    });
    test('valid template replaces templateEvents', async () => {
      const response = await server
        .put(`/api/templates/${template.id}`)
        .send(validTemplate2);
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({
        ...validTemplate2,
        templateEvents: [
          {
            ...validTemplate2.templateEvents![0],
            templateId: template.id,
          },
        ],
        user: mockData.mockUser.id,
        id: template.id,
      });
    });
    test('incomplete template returns 400', async () => {
      const response = await server
        .put(`/api/templates/${template.id}`)
        .send(incompleteTemplate);
      expect(response.statusCode).toBe(400);
    });
    test('template with invalid field returns 400', async () => {
      const response = await server
        .put(`/api/templates/${template.id}`)
        .send(invalidTemplate);
      expect(response.statusCode).toBe(400);
    });
    test("modifying a different user's template returns 404", async () => {
      const response = await server.put(
        `/api/templates/${otherTemplate.id}`,
      );
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
      expect(response.body).toStrictEqual(template.toJSON());
      expect(await Template.count({where: {id: template.id}})).toBe(0);
      template.templateEvents?.forEach(async (templateEvent) => {
        expect(
          await TemplateEvent.count({where: {id: templateEvent.id}}),
        ).toBe(0);
      });
    });

    test("getting a different user's template returns 404", async () => {
      const response = await server.delete(
        `/api/templates/${otherTemplate.id}`,
      );
      expect(response.statusCode).toBe(404);
    });

    test('getting a nonexistent template returns 404', async () => {
      const response = await server.delete(
        '/api/templates/this-is-not-a-real-id',
      );
      expect(response.statusCode).toBe(404);
    });
  });
});
