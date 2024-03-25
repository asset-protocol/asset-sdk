import { Button } from "antd";

export type WidthSetterProps = {
  value?: number | string;
  onChange?: (value: number | string) => void;
};
export function WidthSetter(props: WidthSetterProps) {
  const { value, onChange } = props;
  const options = ["auto", "25%", "50%", "75%", "100%"];
  return (
    <div className="flex gap-2 px-2 py-2 rounded-sm drop-shadow-sm bg-gray-100">
      {options.map((v) => {
        return (
          <Button
            type={v === value ? "primary" : "default"}
            size="small"
            key={v}
            onClick={() => {
              onChange?.(v);
            }}
          >
            {v}
          </Button>
        );
      })}
    </div>
  );
}
