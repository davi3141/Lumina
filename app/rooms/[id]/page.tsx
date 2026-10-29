import RoomDetailClient from "./room-detail-client";

export const dynamicParams = true;

export function generateStaticParams() {
  return [
    { id: "sala-marketing" },
    { id: "sala-administracao" },
    { id: "sala-software" },
    { id: "sala-principal" },
  ];
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolved = await params;
  return <RoomDetailClient roomId={resolved.id} />;
}
