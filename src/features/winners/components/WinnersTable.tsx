import CarIcon from '../../../shared/components/CarIcon';
import type { SortOrder, WinnerSortField } from '../../../shared/types';
import type { WinnerRow } from '../winnersSlice';

type WinnersTableProps = {
  rows: WinnerRow[];
  page: number;
  pageSize: number;
  sortField: WinnerSortField | null;
  sortOrder: SortOrder | null;
  onSortChange: (field: WinnerSortField) => void;
};

function sortArrow(active: boolean, order: SortOrder | null): string {
  if (!active || order === null) return '';
  return order === 'ASC' ? ' ↑' : ' ↓';
}

function ariaSort(active: boolean, order: SortOrder | null): 'ascending' | 'descending' | 'none' {
  if (!active) return 'none';
  return order === 'ASC' ? 'ascending' : 'descending';
}

function WinnersTable({
  rows,
  page,
  pageSize,
  sortField,
  sortOrder,
  onSortChange,
}: WinnersTableProps) {
  const startIndex = (page - 1) * pageSize;
  const winsActive = sortField === 'wins';
  const timeActive = sortField === 'time';

  return (
    <table className="winners-table">
      <thead>
        <tr>
          <th scope="col" className="winners-table__col-num">
            #
          </th>
          <th scope="col" className="winners-table__col-car">
            Car
          </th>
          <th scope="col" className="winners-table__col-name">
            Name
          </th>
          <th
            scope="col"
            className={`winners-table__col-wins winners-table__sortable${
              winsActive ? ' winners-table__sortable--active' : ''
            }`}
            aria-sort={ariaSort(winsActive, sortOrder)}
          >
            <button
              type="button"
              className="winners-table__sort-btn"
              onClick={() => onSortChange('wins')}
            >
              Wins{sortArrow(winsActive, sortOrder)}
            </button>
          </th>
          <th
            scope="col"
            className={`winners-table__col-time winners-table__sortable${
              timeActive ? ' winners-table__sortable--active' : ''
            }`}
            aria-sort={ariaSort(timeActive, sortOrder)}
          >
            <button
              type="button"
              className="winners-table__sort-btn"
              onClick={() => onSortChange('time')}
            >
              Best time (s){sortArrow(timeActive, sortOrder)}
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={row.id}>
            <td>{startIndex + idx + 1}</td>
            <td className="winners-table__icon">
              {row.car ? <CarIcon color={row.car.color} width={40} height={20} /> : '—'}
            </td>
            <td>{row.car ? row.car.name : `Car #${row.id} (deleted)`}</td>
            <td>{row.wins}</td>
            <td>{row.time.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default WinnersTable;
