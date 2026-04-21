import { notFound } from "next/navigation";
import { ModulePage } from "@/modules/shared/ui/module-page";
import { RESOURCE_META } from "@/modules/shared/config/resource-meta";

type Props = {
  params: Promise<{ module: string }>;
};

export default async function GenericModulePage({ params }: Props): Promise<JSX.Element> {
  const { module } = await params;

  if (!RESOURCE_META[module]) {
    notFound();
  }

  return <ModulePage resource={module} />;
}
