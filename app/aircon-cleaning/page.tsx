import ServiceGuide from "@/app/components/service-guide";
import { serviceGuides } from "@/lib/service-guides";
import { pageMetadata } from "@/lib/seo";
const guide = serviceGuides.cleaning;
export const metadata = pageMetadata(
  guide.title,
  guide.description,
  guide.path,
);
export default function CleaningPage() {
  return <ServiceGuide kind="cleaning" />;
}
