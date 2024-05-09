import clsx from "clsx";
import useToken from "antd/es/theme/useToken";
import { AnchorHTMLAttributes } from "react";

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to?: string;
};
export function Link(props: LinkProps) {
  const [, , , realToken] = useToken();
  return (
    <a
      {...props}
      className={clsx("text-base", props.className)}
      style={{
        color: "!" + realToken.colorPrimary,
      }}
    ></a>
  );
}
