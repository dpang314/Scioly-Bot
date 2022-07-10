import React, {useEffect, useState} from 'react';
import TemplateTable from './TemplateTable';
import Loading from '../../components/Loading';
import {
  createTemplate,
  getTemplates,
  updateTemplate,
} from '../../api/templates';
import {TemplateAttributes, TemplateCreationAttributes} from 'scioly-bot-types';

const Templates = () => {
  const [templates, setTemplates] = useState<TemplateAttributes[]>([]);
  useEffect(() => {
    (async () => {
      const response = await getTemplates();
      setTemplates(await response.json());
    })();
  }, []);

  const addStateTemplate = async (newTemplate: TemplateCreationAttributes) => {
    const response = await createTemplate(newTemplate);
    setTemplates([...templates, await response.json()]);
  };

  const updateStateTemplate = async (updatedTemplate: TemplateAttributes) => {
    const response = await (
      await updateTemplate(updatedTemplate.id, updatedTemplate)
    ).json();
    setTemplates(
      templates.map((template) => {
        if (template.id === response.id) {
          return response;
        }
        return template;
      }),
    );
  };

  const deleteStateTemplate = (deletedTemplateId: string) => {
    setTemplates(
      templates.filter((template) => template.id !== deletedTemplateId),
    );
  };

  if (!templates) {
    return <Loading />;
  }

  return (
    <TemplateTable
      templates={templates}
      addStateTemplate={addStateTemplate}
      updateStateTemplate={updateStateTemplate}
      deleteStateTemplate={deleteStateTemplate}
    />
  );
};

export default Templates;
