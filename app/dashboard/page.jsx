import { redirect } from "next/navigation";

import ProposalWorkspace from "@/app/dashboard/_components/ProposalWorkspace";
import { getServerSession } from "@/lib/session";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  return <ProposalWorkspace user={session.user} />;
}
