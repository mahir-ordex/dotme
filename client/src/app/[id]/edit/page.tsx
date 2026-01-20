import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProfileRedirect({ params }: Props) {
  const { id } = await params;
  redirect(`/${id}`);
}
