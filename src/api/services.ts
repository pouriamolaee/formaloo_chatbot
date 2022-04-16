import axios from "axios";
import * as fns from "../constants/api";
import * as models from "../models/entities";

export const createForm = () => {
  return axios.post(fns.CREATE_FORM);
};

export const createField = (data: models.TextField) => {
  return axios.post(fns.CREATE_FIELD, data);
};

export const updateForm = (data: models.Form, slug: string) => {
  return axios.patch(`${fns.CREATE_FORM}${slug}`, data);
};
