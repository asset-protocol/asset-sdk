import Icon from "@ant-design/icons";
import { Button, ButtonProps } from "antd";
import clsx from "clsx";

export function SvgIcon(props: { svg: string }) {
  return (
    <Icon
      className="scale-75"
      component={() => (
        <span dangerouslySetInnerHTML={{ __html: props.svg }}></span>
      )}
    />
  );
}

export function ToolButton(props: ButtonProps) {
  const { className, ...resProps } = props;
  return <Button className={clsx(className)} {...resProps}></Button>;
}
