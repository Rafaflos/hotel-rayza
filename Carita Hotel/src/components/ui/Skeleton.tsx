export function TableSkeleton({ columns, rows = 5 }: { columns: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r}>
          {Array.from({ length: columns }).map((_, c) => (
            <td key={c} className="px-4 py-3">
              <div className="h-4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}
