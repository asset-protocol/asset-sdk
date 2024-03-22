import { VideoBlobUpload } from "../../../components/BlobUpload/VideoBlobUpload";

export type VideoEditorProps = {
  value?: string;
  onChange?: (v?: string) => void;
};

export default function VideoEditor(props: VideoEditorProps) {
  return <VideoBlobUpload accept=".mp4,.avi,.mkv" {...props}></VideoBlobUpload>;
}
