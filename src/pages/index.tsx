import { useEffect, useRef } from "react";
import { ConversationalForm } from "conversational-form";
import * as contents from "../constants/contents";
import * as services from "../api/services";
import * as inputs from "../constants/inputs";
import * as models from "../models/entities";
import * as enums from "../models/enums";
import * as utils from "../utils/text";
import {
  starterTag,
  fieldTitleTag,
  requiredTag,
  hasDescriptionTag,
  descriptionTag,
  moreFieldsTag,
  formTitleTag,
} from "../data/tags";

const tags = [starterTag, fieldTitleTag, formTitleTag];

let cf: any;
const ConversationalFormComponent = () => {
  const createdFormSlug = useRef("");
  const createdFieldSlug = useRef("");

  const elem = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cf = ConversationalForm.startTheConversation({
      options: {
        theme: "dark",
        flowStepCallback,
        preventAutoFocus: true,
        loadExternalStyleSheet: true,
      },
      tags,
    });
    elem.current!.appendChild(cf.el);
  }, []);

  const flowStepCallback = async (dto: any, success: any, error: any) => {
    switch (dto.tag.name) {
      case inputs.START:
        if (+dto.tag.value[0] === enums.StartCommand.CreateForm) {
          const { slug } = (await services.createForm()).data.data.form;
          createdFormSlug.current = slug;
        } else {
          cf.addRobotChatResponse(
            new Date().toLocaleDateString("en", {
              year: "numeric",
              month: "long",
              weekday: "long",
              day: "numeric",
            })
          );

          cf.addTags([starterTag]);
        }
        break;

      case inputs.FIELD_TITLE:
        const { value } = dto.tag;
        if (!value) {
          cf.addRobotChatResponse(contents.VALIDATION);
          cf.addTags([fieldTitleTag]);
          break;
        }

        const fieldData: models.TextField = {
          form: createdFormSlug.current,
          type: "short_text",
          title: value,
        };
        const { slug: fieldSlug } = (await services.createField(fieldData)).data
          .data.field;
        createdFieldSlug.current = fieldSlug;

        cf.addTags([requiredTag]);
        break;

      case inputs.REQUIRED:
        if (+dto.tag.value[0] === enums.Required.Yeah) {
          const updatedFieldData: models.TextField = {
            form: createdFormSlug.current,
            type: "short_text",
            required: true,
          };
          await services.updateField(
            updatedFieldData,
            createdFieldSlug.current
          );
        }

        cf.addTags([hasDescriptionTag]);
        break;

      case inputs.HAS_DESCRIPTION:
        if (+dto.tag.value[0] === enums.HasDescription.Yes) {
          cf.addTags([descriptionTag]);
          break;
        }

        cf.addTags([moreFieldsTag]);
        break;

      case inputs.DESCRIPTION:
        const { value: description } = dto.tag;
        if (!description) {
          cf.addRobotChatResponse(contents.VALIDATION);
          cf.addTags([descriptionTag]);
          break;
        }
        
        const updatedFieldData: models.TextField = {
          form: createdFormSlug.current,
          type: "short_text",
          description,
        };
        await services.updateField(updatedFieldData, createdFieldSlug.current);

        cf.addTags([moreFieldsTag]);
        break;

      case inputs.MORE_FIELDS:
        if (+dto.tag.value[0] === enums.MoreFields.Yup) {
          cf.addTags([fieldTitleTag]);
        }
        break;

      case inputs.FORM_TITLE:
        const { value: formTitleValue } = dto.tag;
        if (!formTitleValue) {
          cf.addRobotChatResponse(contents.VALIDATION);
          cf.addTags([formTitleTag]);
          break;
        }

        const formData = { title: formTitleValue };
        const { subdomain, address } = (
          await services.updateForm(formData, createdFormSlug.current)
        ).data.data.form;

        cf.addRobotChatResponse(contents.CONGRATS);

        const formUrl = `https://${subdomain}.formaloo.net/${address}`;
        const formLink = `<a target="_blank" href="${formUrl}">${formUrl}</a>`;

        cf.addRobotChatResponse(formLink);

        cf.addTags([starterTag]);
        break;
    }

    success();
  };

  return <div ref={elem} />;
};

export default ConversationalFormComponent;
