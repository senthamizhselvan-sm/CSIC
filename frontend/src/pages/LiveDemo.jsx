export default function LiveDemo() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <iframe src="/business" style={{ flex: 1 }} />
      <iframe src="/user" style={{ flex: 1 }} />
    </div>
  );
}
