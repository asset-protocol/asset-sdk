import { Avatar } from "antd";
import { useReplaceUri } from "../../lib/utils";
import { UserOutlined } from "@ant-design/icons";
import { AddressLink } from "../Address/AddressLink";

export type AssetCardProps = {
  name: string;
  publisher: string;
  image?: string;
};

export function AssetCard(props: AssetCardProps) {
  const replaceUri = useReplaceUri();
  return (
    <div className="shadow-md rounded-lg overflow-hidden">
      <img
        src={replaceUri(props.image)}
        alt=""
        className="w-full object-cover aspect-[2/1]"
      />
      <div className="line-clamp-2 text-xl flex-1 px-4 py-1 font-bold">
        {props.name}
      </div>
      <div className="px-4 pt-4 text-lg">
        <Avatar
          className="mr-2 bg-[#87d068]"
          size={32}
          icon={<UserOutlined />}
        />
        <AddressLink address={props.publisher} />
      </div>
      <div className="mt-4"></div>
    </div>
  );
}
