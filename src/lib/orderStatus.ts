const statusClasses: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-800 border-amber-200',
  Processing: 'bg-sky-100 text-sky-800 border-sky-200',
  Delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Completed: 'bg-slate-200 text-slate-700 border-slate-300'
};

export function getOrderStatusClasses(status: string) {
  return statusClasses[status] || statusClasses.Completed;
}
