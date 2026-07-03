import type { ReactNode } from "react";

export type PageHeaderConfig = {
  title: string;
  description?: string;
  actions?: ReactNode;
};