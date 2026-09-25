export function CustomerApiState({ loading, error, retry }) {
  if (loading) return <p role="status" className="rounded-xl bg-white p-6">Carregando informações…</p>;
  if (error) return <div role="alert" className="rounded-xl bg-white p-6"><p>{error}</p><button onClick={retry}>Tentar novamente</button></div>;
  return null;
}
