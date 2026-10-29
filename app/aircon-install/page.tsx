import ServiceGuide from "@/app/components/service-guide";
import { serviceGuides } from "@/lib/service-guides";
import { pageMetadata } from "@/lib/seo";
const guide = serviceGuides.install;
export const metadata = pageMetadata(
  guide.title,
  guide.description,
  guide.path,
);
export default function InstallPage() {
  return <ServiceGuide kind="install" />;
}
