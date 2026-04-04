import { redirect } from "next/navigation";

import ProposalBuilder from "@/app/dashboard/_components/ProposalBuilder";
import { getServerSession } from "@/lib/session";

export default async function NewProjectPage() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  return <ProposalBuilder user={session.user} />;
}
