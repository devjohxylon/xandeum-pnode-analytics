export default function NodeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">pNode Details</h1>
      <p className="text-muted-foreground">Node ID: {params.id}</p>
    </div>
  );
}

