export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {Icon && (
        <div className="w-12 h-12 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl flex items-center justify-center mb-4">
          <Icon size={22} className="text-[#444]" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-sm font-medium text-[#888] mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-[#555] mb-5 max-w-xs">{description}</p>
      )}
      {action && action}
    </div>
  );
}
