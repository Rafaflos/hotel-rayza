export function TableSkeleton({ columns, rows = 5 }: { columns: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-t border-line">
          {Array.from({ length: columns }).map((_, c) => (
            <td key={c} className="px-4 py-3.5">
              <div
                className="h-3.5 animate-pulse rounded bg-line"
                /* Anchos desiguales: se lee como contenido cargando, no como barras */
                style={{ width: c === 0 ? '55%' : c % 3 === 0 ? '45%' : '75%' }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}
