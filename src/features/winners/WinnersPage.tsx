import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Pagination from '../../shared/components/Pagination';
import { WINNERS_PAGE_LIMIT } from '../../shared/constants';
import type { WinnerSortField } from '../../shared/types';
import WinnersTable from './components/WinnersTable';
import { loadWinners, setPage, setSort } from './winnersSlice';

function WinnersPage() {
  const dispatch = useAppDispatch();
  const { rows, totalCount, page, sortField, sortOrder, status } = useAppSelector(
    (state) => state.winners,
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / WINNERS_PAGE_LIMIT));

  useEffect(() => {
    dispatch(loadWinners({ page, sortField, sortOrder }));
  }, [dispatch, page, sortField, sortOrder]);

  function handleSortChange(field: WinnerSortField) {
    if (sortField !== field) {
      dispatch(setSort({ field, order: 'DESC' }));
      return;
    }
    dispatch(setSort({ field, order: sortOrder === 'ASC' ? 'DESC' : 'ASC' }));
  }

  const isEmpty = rows.length === 0 && status !== 'loading';

  return (
    <main className="page winners-page">
      <header className="winners-page__header">
        <h1>Winners ({totalCount})</h1>
        <p className="winners-page__subtitle">
          Page {page} / {totalPages}
        </p>
      </header>

      {status === 'loading' && rows.length === 0 && (
        <p className="winners-page__loading">Loading…</p>
      )}

      {isEmpty ? (
        <p className="winners-page__empty">
          No winners yet. Run a race in the Garage to create one.
        </p>
      ) : (
        <WinnersTable
          rows={rows}
          page={page}
          pageSize={WINNERS_PAGE_LIMIT}
          sortField={sortField}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={(newPage) => dispatch(setPage(newPage))}
      />
    </main>
  );
}

export default WinnersPage;
