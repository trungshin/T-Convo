// /components/ui/Sidebar.tsx
import Link from 'next/link';
export default function Sidebar() {
  return (
    <nav className="sticky top-20 p-4 bg-white rounded border">
      <h3 className="font-semibold mb-2">Explore</h3>
      <ul className="space-y-2 text-sm">
        <li>
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link href="/hashtags" className="hover:underline">
            Hashtags
          </Link>
        </li>
        <li>
          <Link href="/notifications" className="hover:underline">
            Notifications
          </Link>
        </li>
      </ul>
    </nav>
  );
}
