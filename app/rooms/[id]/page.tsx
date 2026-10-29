import RoomDetailClient from "./room-detail-client";

export function generateStaticParams() {
  return [
    { id: "sala-principal" },
    { id: "room-alpha" },
    { id: "room-beta" },
    { id: "room-gamma" },
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
