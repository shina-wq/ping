import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  CardAction,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SectionCardHeaderProps = {
  title: string;
  actionLabel: string;
  actionHref?: string;
};

export function SectionCardHeader({ title, actionLabel, actionHref }: SectionCardHeaderProps) {
  return (
    <CardHeader className="items-center border-b px-5 py-5 sm:px-6">
      <CardTitle className="text-base font-semibold leading-none">{title}</CardTitle>
      {actionHref ? (
        <CardAction className="self-center">
          <Button
            type="button"
            variant="link"
            className="h-auto px-0 text-sm font-medium text-primary"
            asChild
          >
            <Link to={actionHref}>{actionLabel}</Link>
          </Button>
        </CardAction>
      ) : null}
    </CardHeader>
  );
}