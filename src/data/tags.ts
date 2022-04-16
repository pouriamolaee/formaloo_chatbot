import * as contents from "../constants/contents";
import * as inputs from "../constants/inputs";
import * as enums from "../models/enums";

export const starterTag = {
  tag: "fieldset",
  "cf-questions": contents.START,
  children: [
    {
      tag: "input",
      type: "radio",
      name: inputs.START,
      "cf-label": contents.FORM_CREATE,
      value: enums.StartCommand.CreateForm,
    },
    {
      tag: "input",
      type: "radio",
      name: inputs.START,
      "cf-label": contents.DATE_COMMAND,
      value: enums.StartCommand.DateCommand,
    },
  ],
};

export const fieldTitleTag = {
  tag: "input",
  type: "text",
  "cf-questions": contents.FIELD_TITLE,
  name: inputs.FIELD_TITLE,
};

export const requiredTag = {
  tag: "fieldset",
  "cf-questions": contents.REQUIRED,
  children: [
    {
      tag: "input",
      type: "radio",
      name: inputs.REQUIRED,
      "cf-label": contents.YEAH,
      value: enums.Required.Yeah,
    },
    {
      tag: "input",
      type: "radio",
      name: inputs.REQUIRED,
      "cf-label": contents.NAH,
      value: enums.Required.Nah,
    },
  ],
};

export const moreFieldsTag = {
  tag: "fieldset",
  "cf-questions": contents.MORE_FIELDS,
  children: [
    {
      tag: "input",
      type: "radio",
      name: inputs.MORE_FIELDS,
      "cf-label": contents.YUP,
      value: enums.MoreFields.Yup,
    },
    {
      tag: "input",
      type: "radio",
      name: inputs.MORE_FIELDS,
      "cf-label": contents.NOPE,
      value: enums.MoreFields.Nope,
    },
  ],
};

export const formTitleTag = {
  tag: "input",
  type: "text",
  "cf-questions": contents.FORM_TITLE,
  name: inputs.FORM_TITLE,
};
