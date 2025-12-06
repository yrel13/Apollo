import React from "react";

export default function Pagination({ total, page, pageSize, onPageChange, onPageSizeChange }) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const goTo = (p) => {
        if (p < 1) p = 1;
        if (p > totalPages) p = totalPages;
        if (p !== page) onPageChange(p);
    };

    return (
        <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
                <button onClick={() => goTo(1)} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">« First</button>
                <button onClick={() => goTo(page - 1)} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">‹ Prev</button>
                <span className="px-3">Page {page} of {totalPages}</span>
                <button onClick={() => goTo(page + 1)} disabled={page === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next ›</button>
                <button onClick={() => goTo(totalPages)} disabled={page === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Last »</button>
            </div>
            <div className="flex items-center gap-2">
                <label className="text-sm">Per page:</label>
                <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))} className="border rounded px-2 py-1">
                    {[5,10,20,50,100].map(sz => (
                        <option key={sz} value={sz}>{sz}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}
