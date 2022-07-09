import React, {useEffect, useState} from 'react';
import TemplateTable from './TemplateTable';
import Loading from '../../components/Loading';
import {getTemplates} from '../../api/templates';
import {TemplateAttributes} from 'scioly-bot-types';

const Templates = () => {
  const [templates, setTemplates] = useState<TemplateAttributes[]>([]);
  useEffect(() => {
    (async () => {
      const response = await getTemplates();
      setTemplates(await response.json());
    })();
  }, []);

  const addStateTemplate = (newTemplate: TemplateAttributes) => {
    setTemplates([...templates, newTemplate]);
  };

  const updateStateTemplate = (updatedTemplate: TemplateAttributes) => {
    setTemplates(
      templates.map((template) => {
        if (template.id === updatedTemplate.id) {
          return updatedTemplate;
        }
        return template;
      }),
    );
  };

  const deleteStateTemplate = (deletedTemplate: TemplateAttributes) => {
    setTemplates(
      templates.filter((template) => template.id !== deletedTemplate.id),
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
