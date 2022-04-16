import { useEffect, useRef } from "react";
import { ConversationalForm } from "conversational-form";
import * as contents from "../constants/contents";
import * as services from "../api/services";
import * as models from "../models/entities";
import * as inputs from "../constants/inputs";

const starterTag = {
  tag: "fieldset",
  "cf-questions": contents.START,
  children: [
    {
      tag: "input",
      type: "radio",
      name: inputs.START,
      "cf-label": contents.FORM_CREATE,
      value: true,
    },
    {
      tag: "input",
      type: "radio",
      name: inputs.START,
      "cf-label": contents.DATE_COMMAND,
      value: false,
    },
  ],
};

const formFields = [
  starterTag,
  {
    tag: "input",
    type: "text",
    "cf-questions": contents.FIELD_TITLE,
    name: inputs.FIELD_TITLE,
  },

  {
    tag: "input",
    type: "text",
    "cf-questions": contents.FORM_TITLE,
    name: inputs.FORM_TITLE,
  },
];

let cf: any;
const ConversationalFormComponent = () => {
  const createdFormSlug = useRef("");

  const elem = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cf = ConversationalForm.startTheConversation({
      options: {
        theme: "dark",
        flowStepCallback,
        preventAutoFocus: true,
        loadExternalStyleSheet: true,
      },
      tags: formFields,
    });
    elem.current!.appendChild(cf.el);
  }, []);

  const flowStepCallback = async (dto: any, success: any, error: any) => {
    switch (dto.tag.name) {
      case inputs.START:
        if (dto.tag.value[0] === "true") {
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
        const fieldData: models.TextField = {
          form: createdFormSlug.current,
          type: "short_text",
          title: dto.tag.value,
          // required: true,
          // description: ""
        };
        await services.createField(fieldData);

        cf.addTags([
          {
            tag: "fieldset",
            "cf-questions": contents.MORE_FIELDS,
            children: [
              {
                tag: "input",
                type: "radio",
                name: inputs.MORE_FIELDS,
                "cf-label": contents.YUP,
                value: true,
              },
              {
                tag: "input",
                type: "radio",
                name: inputs.MORE_FIELDS,
                "cf-label": contents.NOPE,
                value: false,
              },
            ],
          },
        ]);
        break;

      case inputs.MORE_FIELDS:
        if (dto.tag.value[0] === "true") {
          cf.addTags([
            {
              tag: "input",
              type: "text",
              "cf-questions": contents.FIELD_TITLE,
              name: inputs.FIELD_TITLE,
            },
          ]);
        }
        break;

      case inputs.FORM_TITLE:
        const formData = { title: dto.tag.value };
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
