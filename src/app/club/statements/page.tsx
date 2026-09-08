import { getStatements } from "@/lib/queries";
import { StatementCard } from "@/components/debate/StatementCard";

export default async function StatementsPage() {
  const { statements } = await getStatements();

  return (
    <div>
      <div className="mb-6 border-b border-border pb-4">
        <div className="eyebrow mb-1">آرشیو بیانیه‌ها</div>
        <h1 className="text-2xl font-bold tracking-tight">بیانیه‌ها</h1>
      </div>

      {statements.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg text-sm text-muted">
          هنوز بیانیه‌ای وجود ندارد
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {statements.map((s) => (
            <StatementCard key={s.id} statement={s} />
          ))}
        </div>
      )}
    </div>
  );
}