"use client";

import { useRef } from "react";
import { CloseIcon, RulerIcon } from "@/components/ui/icons";
import { topSizes, trouserSizes } from "@/lib/size-guide";

export function SizeGuideDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="label mt-4 inline-flex items-center gap-2 border-b border-ink pb-1 text-[10px]"
      >
        <RulerIcon className="h-3.5 w-3.5" />
        View size guide chart
      </button>

      <dialog
        ref={dialogRef}
        aria-label="NOIRÉ size guide"
        className="m-auto w-[min(92vw,760px)] border border-line bg-canvas p-0 text-ink backdrop:bg-ink/50"
      >
        <div className="max-h-[85vh] overflow-y-auto p-6 sm:p-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <span className="eyebrow text-muted">Measurement desk</span>
              <h2 className="mt-2 font-serif text-[30px] leading-tight">
                Size guide
              </h2>
              <p className="mt-2 max-w-[480px] text-sm leading-relaxed text-muted">
                Body measurements in inches. If you are between sizes, size down
                for a closer fit or contact the concierge for guidance.
              </p>
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close size guide"
              className="p-1 text-muted transition-colors hover:text-ink"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-7 overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-left text-sm">
              <caption className="pb-2 text-left text-[9px] uppercase tracking-[0.16em] text-muted">
                Tops — inches
              </caption>
              <thead>
                <tr className="border-y border-line text-[9px] uppercase tracking-[0.14em] text-muted">
                  <th className="py-3 pr-4 font-medium">Size</th>
                  <th className="py-3 pr-4 font-medium">Chest</th>
                  <th className="py-3 pr-4 font-medium">Length</th>
                  <th className="py-3 font-medium">Shoulder</th>
                </tr>
              </thead>
              <tbody>
                {topSizes.map((row) => (
                  <tr key={row.size} className="border-b border-line">
                    <td className="py-3 pr-4">{row.size}</td>
                    <td className="py-3 pr-4">{row.chest}</td>
                    <td className="py-3 pr-4">{row.length}</td>
                    <td className="py-3">{row.shoulder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-7 overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-left text-sm">
              <caption className="pb-2 text-left text-[9px] uppercase tracking-[0.16em] text-muted">
                Trousers — inches
              </caption>
              <thead>
                <tr className="border-y border-line text-[9px] uppercase tracking-[0.14em] text-muted">
                  <th className="py-3 pr-4 font-medium">Size</th>
                  <th className="py-3 pr-4 font-medium">Waist</th>
                  <th className="py-3 pr-4 font-medium">Hip</th>
                  <th className="py-3 font-medium">Inseam</th>
                </tr>
              </thead>
              <tbody>
                {trouserSizes.map((row) => (
                  <tr key={row.size} className="border-b border-line">
                    <td className="py-3 pr-4">{row.size}</td>
                    <td className="py-3 pr-4">{row.waist}</td>
                    <td className="py-3 pr-4">{row.hip}</td>
                    <td className="py-3">{row.inseam}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </dialog>
    </>
  );
}
