import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { GARAGE_PAGE_LIMIT } from '../../shared/constants';
import CarForm from './components/CarForm';
import CarItem from './components/CarItem';
import Pagination from '../../shared/components/Pagination';
import RaceControls from './components/RaceControls';
import {
  addCar,
  clearEditForm,
  editCar,
  generateCars,
  loadCars,
  removeCar,
  resetCreateForm,
  selectCarForEdit,
  setCreateForm,
  setEditForm,
  setPage,
} from './garageSlice';

function GaragePage() {
  const dispatch = useAppDispatch();
  const { cars, totalCount, page, createForm, editForm, status } = useAppSelector(
    (state) => state.garage,
  );
  const isRaceRunning = useAppSelector((state) => state.race.isRaceRunning);

  const totalPages = Math.max(1, Math.ceil(totalCount / GARAGE_PAGE_LIMIT));

  useEffect(() => {
    dispatch(loadCars(page));
  }, [dispatch, page]);

  async function handleCreate(name: string, color: string) {
    await dispatch(addCar({ name, color })).unwrap();
    dispatch(resetCreateForm());
    dispatch(loadCars(page));
  }

  async function handleEditSubmit(name: string, color: string) {
    if (editForm.id === null) return;
    await dispatch(editCar({ id: editForm.id, payload: { name, color } })).unwrap();
    dispatch(loadCars(page));
  }

  async function handleDelete(id: number) {
    await dispatch(removeCar(id)).unwrap();
    const newTotal = Math.max(0, totalCount - 1);
    const newTotalPages = Math.max(1, Math.ceil(newTotal / GARAGE_PAGE_LIMIT));
    const targetPage = Math.min(page, newTotalPages);
    if (targetPage !== page) {
      dispatch(setPage(targetPage));
    } else {
      dispatch(loadCars(page));
    }
  }

  async function handleGenerate() {
    await dispatch(generateCars()).unwrap();
    dispatch(loadCars(page));
  }

  const isEmpty = cars.length === 0 && status !== 'loading';

  return (
    <main className="page garage-page">
      <header className="garage-page__header">
        <h1>Garage ({totalCount})</h1>
        <p className="garage-page__subtitle">
          Page {page} / {totalPages}
        </p>
      </header>

      <RaceControls cars={cars} />

      <section className="garage-page__controls">
        <CarForm
          name={createForm.name}
          color={createForm.color}
          submitLabel="Create"
          disabled={isRaceRunning}
          onNameChange={(name) => dispatch(setCreateForm({ name }))}
          onColorChange={(color) => dispatch(setCreateForm({ color }))}
          onSubmit={handleCreate}
        />

        {editForm.id !== null && (
          <CarForm
            name={editForm.name}
            color={editForm.color}
            submitLabel="Update"
            disabled={isRaceRunning}
            onNameChange={(name) => dispatch(setEditForm({ name }))}
            onColorChange={(color) => dispatch(setEditForm({ color }))}
            onSubmit={handleEditSubmit}
            onCancel={() => dispatch(clearEditForm())}
          />
        )}

        <button
          type="button"
          className="garage-page__generate"
          onClick={handleGenerate}
          disabled={isRaceRunning}
        >
          Generate 100 cars
        </button>
      </section>

      {status === 'loading' && cars.length === 0 && (
        <p className="garage-page__loading">Loading…</p>
      )}

      {isEmpty ? (
        <p className="garage-page__empty">Garage is empty. Create a car to get started.</p>
      ) : (
        <ul className="garage-page__list">
          {cars.map((car) => (
            <CarItem
              key={car.id}
              car={car}
              selected={editForm.id === car.id}
              disabled={isRaceRunning}
              onSelect={(c) => dispatch(selectCarForEdit(c))}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        disabled={isRaceRunning}
        onChange={(newPage) => dispatch(setPage(newPage))}
      />
    </main>
  );
}

export default GaragePage;
