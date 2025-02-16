import { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router-dom';
import ICity from '../../models/interfaces/iCity';
import { deleteAlert, successAlert, errorDeleteAlert } from '../../utils/sweet-alerts';
import { useDeleteCity } from '../../services/hooks/cityMutations/useDeleteCity';
import { useFetchCities } from '../../services/hooks/cityMutations/useFetchCities';
import Loading from '../loading/Loading';
import NotFound from '../notFound/NotFound';
import { DataGrid } from '@mui/x-data-grid';
import { useRecoilState } from 'recoil';
import { selectedCityState } from '../../services/recoilService/selectedCityState';
import { ModeEnum } from '../../models/enums/modeEnum';
import { CityForm } from '../cityForm/CityForm';

export default function CitiesGrid() {
  const { countryId } = useParams();
  const [gridKey, setGridKey] = useState<number>(0);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedCity, setSelectedCity] = useRecoilState<ICity | null>(selectedCityState);
  const [mode, setMode] = useState<ModeEnum>(ModeEnum.NONE);

  const deleteCityMutation = useDeleteCity();
  const { data, isError, isLoading, refetch } = useFetchCities();
  const navigate = useNavigate();

  function handleDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) {
    e.stopPropagation();
    deleteAlert(() => {
      deleteCityMutation.mutate(id, {
        onSuccess: () => {
          setGridKey((prevKey) => prevKey + 1);
          successAlert();
          setSelectedCity(null);
        },
        onError: () => {
          errorDeleteAlert('Failed to delete the record. Please try again.');
        },
      });
    });
  }

  function handleEdit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, city: ICity) {
    e.stopPropagation();
    setSelectedCity(city);
    setMode(ModeEnum.EDIT);
  }

  function handleCitySelect(city: ICity) {
    setSelectedCity(city);
    setMode(ModeEnum.NONE);
  }

  useEffect(() => {
    if (isError && retryCount < 3) {
      const retryTimeout = setTimeout(() => {
        setRetryCount(retryCount + 1);
        refetch();
      }, 3000);
      return () => clearTimeout(retryTimeout);
    }
  }, [isError, retryCount, refetch]);

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1, headerClassName: 'custom-header' },
    { field: 'population', headerName: 'Population', flex: 1, headerClassName: 'custom-header' },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 2,
      headerClassName: 'action-header',
      sortable: false,
      renderCell: (params: any) => (
        <>
          <IconButton onClick={(e) => handleEdit(e, params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={(e) => handleDelete(e, params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : isError && retryCount >= 3 ? (
        <NotFound
          title="Unable to retrieve data"
          message="The server is currently unavailable. Please try again later."
        />
      ) : (
        <>
          <div className="data-grid-container">
            {data && (
              <DataGrid
                key={gridKey}
                rows={data?.map((city) => ({ ...city, id: city._id })) || []}
                columns={columns}
                onRowClick={(params) => handleCitySelect(params.row)}
              />
            )}
          </div>
          {(mode === ModeEnum.CREATE || mode === ModeEnum.EDIT) && (
            <CityForm
              city={selectedCity}
              mode={mode}
              onSave={() => {
                setGridKey((prevKey) => prevKey + 1);
                setMode(ModeEnum.NONE);
                setSelectedCity(null);
                refetch();
              }}
              onCancel={() => {
                setMode(ModeEnum.NONE);
                setSelectedCity(null);
              }}
            />
          )}
          <IconButton onClick={() => navigate('/create-city')}>+</IconButton>
        </>
      )}
    </>
  );
}
