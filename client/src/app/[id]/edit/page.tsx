import { redirect } from "next/navigation";

interface Props {
  params: { id: string };
}

export default function EditProfileRedirect({ params }: Props) {
  redirect(`/${params.id}`);
}
