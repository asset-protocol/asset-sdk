import clsx from "clsx";
import { LinkHTMLAttributes } from "react";
import useToken from "antd/es/theme/useToken";

export type LinkProps = LinkHTMLAttributes<HTMLAnchorElement> & {
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
