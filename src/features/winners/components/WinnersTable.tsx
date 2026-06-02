import CarIcon from '../../../shared/components/CarIcon';
import type { WinnerRow } from '../winnersSlice';

type WinnersTableProps = {
  rows: WinnerRow[];
  page: number;
  pageSize: number;
};

function WinnersTable({ rows, page, pageSize }: WinnersTableProps) {
  const startIndex = (page - 1) * pageSize;

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
          <th scope="col" className="winners-table__col-wins">
            Wins
          </th>
          <th scope="col" className="winners-table__col-time">
            Best time (s)
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