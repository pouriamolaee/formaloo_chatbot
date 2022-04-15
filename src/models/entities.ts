export interface TextField {
  form: string;
  type: "short_text";
  title: string;
  description?: string;
  required?: boolean;
}

export interface Form {
  title: string;
}
