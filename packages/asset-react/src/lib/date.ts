import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

dayjs.extend(relativeTime);

export function fromNow(date: string | number | Date | dayjs.Dayjs) {
  return dayjs(date).fromNow();
}

