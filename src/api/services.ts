import http from "./axios";
import * as fns from "../constants/api";
import * as models from "../models/entities";

export const createForm = () => {
  return http.post(fns.FORM);
};

export const createField = (data: models.TextField) => {
  return http.post(fns.FIELD, data);
};

export const updateField = (data: models.TextField, slug: string) => {
  return http.patch(`${fns.FIELD}${slug}`, data);
};

export const updateForm = (data: models.Form, slug: string) => {
  return http.patch(`${fns.FORM}${slug}`, data);
};
