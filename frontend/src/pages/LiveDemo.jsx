import './LiveDemo.css';

export default function LiveDemo() {
  return (
    <div className="live-demo-container">
      <iframe src="/business" />
      <iframe src="/user" />
    </div>
  );
}
