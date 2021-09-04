import { format } from "date-fns";
import { useMemo } from "react";

type Props = {
  dateString: string;
};

const DateFormatter = ({ dateString }: Props) => {
  const date = useMemo(() => new Date(dateString), [dateString]);
  return <time dateTime={dateString}>{format(date, "LLLL	d, yyyy")}</time>;
};

export default DateFormatter;
