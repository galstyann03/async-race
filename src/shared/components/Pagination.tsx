type PaginationProps = {
  page: number;
  totalPages: number;
  disabled?: boolean;
  onChange: (page: number) => void;
};

function Pagination({ page, totalPages, disabled = false, onChange }: PaginationProps) {
  const safeTotal = Math.max(1, totalPages);
  const canPrev = !disabled && page > 1;
  const canNext = !disabled && page < safeTotal;

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="pagination__button"
        onClick={() => onChange(page - 1)}
        disabled={!canPrev}
      >
        Prev
      </button>

      <span className="pagination__status">
        Page {page} / {safeTotal}
      </span>

      <button
        type="button"
        className="pagination__button"
        onClick={() => onChange(page + 1)}
        disabled={!canNext}
      >
        Next
      </button>
    </nav>
  );
}

export default Pagination;
