interface BreadcrumbProps {
  page: string
  className?: string
}

export function Breadcrumb({ page, className = '' }: BreadcrumbProps) {
  return (
    <div className={`flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-widest opacity-60 ${className}`}>
      <span className="text-[#14ffec]">azeem_sweis</span>
      <span className="text-white/30">/</span>
      <span className="text-[#a3a3a3]">blog</span>
      <span className="text-white/30">/</span>
      <span className="text-white">{page}</span>
    </div>
  )
}
