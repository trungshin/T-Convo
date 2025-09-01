// /components/RightSidebar.tsx
export default function RightSidebar() {
  return (
    <aside className="bg-white rounded border p-4">
      <h3 className="font-semibold mb-2">Who to follow</h3>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div>
              <div className="text-sm font-medium">user {i + 1}</div>
              <div className="text-xs text-gray-500">Follow</div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
