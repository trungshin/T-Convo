// /components/LeftNav.tsx
import Link from 'next/link';
export default function LeftNav() {
  return (
    <nav className="p-4 bg-white rounded border">
      <ul className="space-y-3">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/hashtags">Explore</Link></li>
        <li><Link href="/notifications">Notifications</Link></li>
        <li><Link href="/profile">Profile</Link></li>
      </ul>
    </nav>
  );
}
