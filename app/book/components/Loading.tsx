export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center mx-auto">
      <div className="w-12 h-12 border-4 border-slate-600 border-t-slate-300 rounded-full animate-spin" />
      <p className="text-slate-400">Loading providers...</p>
    </div>
  );
}
