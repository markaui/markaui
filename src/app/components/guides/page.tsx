import { redirect } from "next/navigation";

import { guideHref } from "@/components/showcase/urls";

/** /components/guides → first guide */
export default function GuidesIndexPage() {
  redirect(guideHref("installation"));
}
