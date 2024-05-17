import { ImageBlobUpload } from "@asset-protocol/react";
import { DatePicker, Form, FormInstance, Input } from "antd";
import dayjs, { Dayjs } from "dayjs";

export type CurationFormData = {
  name: string;
  description: string;
  image: string;
  expiry?: Dayjs;
};

export type CurationsCreateFormProps = {
  formRef?: React.RefObject<FormInstance<CurationFormData>>;
  initialValues?: CurationFormData;
  children?: React.ReactNode;
  onSubmit?: (data: CurationFormData) => void;
};

export function CurationCreateForm(props: CurationsCreateFormProps) {
  return (
    <Form<CurationFormData> ref={props.formRef} onFinish={props.onSubmit}>
      <Form.Item
        name="name"
        label="Name"
        rules={[
          { required: true, message: "Please input the name of the curation!" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description">
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="image" label="Image">
        <ImageBlobUpload />
      </Form.Item>
      <Form.Item
        name="expire"
        label="End Time"
      >
        <DatePicker
          showTime
          placeholder="Select End Time"
          minDate={dayjs(new Date())}
        />
      </Form.Item>
      {props.children}
    </Form>
  );
}
