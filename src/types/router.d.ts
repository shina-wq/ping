import type { PageHeaderConfig } from "@/types/page-header";

declare module "react-router" {
  interface RouteHandle {
    pageHeader?: PageHeaderConfig;
  }
}
