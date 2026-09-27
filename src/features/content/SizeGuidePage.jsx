import { Container } from '@/components/ui/Container'
import { usePageMeta } from '@/hooks/usePageMeta'
import { sizeCharts } from '@/content/sizeCharts'

export default function SizeGuidePage() {
  usePageMeta({ title: 'Size guide', description: 'Belt lengths and UK shoe sizes for Mental Fellow.', path: '/size-guide' })
  return (
    <Container className="max-w-3xl py-12 md:py-16">
      <h1 className="font-serif text-5xl">Size guide</h1>
      <p className="mt-3 text-muted">Belts are listed by strap length. Shoes are UK sizes, with the insole length beside them. Bags are one size; their dimensions are on the product.</p>
      <div className="mt-10 space-y-12">
        {Object.values(sizeCharts).map((chart) => (
          <section key={chart.title}>
            <h2 className="font-serif text-3xl">{chart.title}</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line">
                    {chart.columns.map((column) => (
                      <th key={column} className="py-2 pr-4 font-medium">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chart.rows.map((row) => (
                    <tr key={row[0]} className="border-b border-line">
{row.map((cell, index) => (
                      <td key={`${row[0]}-${index}`} className="py-2 pr-4">
                        {cell}
                      </td>
                    ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-muted">{chart.note}</p>
          </section>
        ))}
      </div>
    </Container>
  )
}
