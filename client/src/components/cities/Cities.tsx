import {useEffect, useState} from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/Button';
import {useParams} from 'react-router-dom';
import ICity from '../../models/interfaces/iCity';
import {deleteAlert, successAlert, errorDeleteAlert} from '../../utils/sweet-alerts';
import {useDeleteCity} from '../../services/hooks/cityMutations/useDeleteCity';
import Loading from '../loading/Loading';
import NotFound from '../notFound/NotFound';
import {DataGrid} from '@mui/x-data-grid';
import {useRecoilState, useRecoilValue} from 'recoil';
import {selectedCityState} from '../../services/recoilService/selectedCityState';
import {ModeEnum} from '../../models/enums/modeEnum';
import {CityForm} from '../cityForm/CityForm';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Button from '@mui/material/Button';
import {initialCity} from '../../utils/initialValues';
import './cities.scss';
import {LABELS, BUTTON_TEXT, ALERT_MESSAGES} from './../../../../shared/constants';
import {userState} from '../../services/recoilService/userState';
import {RoleEnum} from '../../../../shared/enums';
import {useNavigate} from 'react-router-dom';
import {requestPermissionsAlert} from '../../utils/sweet-alerts';
import {useFetchCountries} from '../../services/hooks/useFetchCountries';

export default function CitiesGrid() {
  const {countryId} = useParams();
  const [gridKey, setGridKey] = useState<number>(0);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedCity, setSelectedCity] = useRecoilState<ICity | null>(selectedCityState);
  const [mode, setMode] = useState<ModeEnum>(ModeEnum.NONE);
  const {user} = useRecoilValue(userState);
  const navigate = useNavigate();
  const {data, isLoading, isError, refetch} = useFetchCountries();

  const deleteCityMutation = useDeleteCity();
  const cities: (ICity | undefined)[] =
    data?.flatMap((country) => (countryId ? (country._id === countryId ? country.cityIds || [] : []) : country.cityIds)) || [];

  useEffect(() => {
    if (isError && retryCount < 3) {
      const retryTimeout = setTimeout(() => {
        setRetryCount(retryCount + 1);
        refetch();
      }, 3000);
      return () => clearTimeout(retryTimeout);
    }
  }, [isError, retryCount, refetch]);

  function handleDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) {
    e.stopPropagation();
    deleteAlert(() => {
      deleteCityMutation.mutate(id, {
        onSuccess: () => {
          setGridKey((prevKey) => prevKey + 1);
          successAlert(BUTTON_TEXT.SAVE, ALERT_MESSAGES.SUCCESS_DELETE_CITY);
          setSelectedCity(null);
        },
        onError: () => {
          errorDeleteAlert(ALERT_MESSAGES.ERROR_DELETE);
        },
      });
    });
  }

  function handleEdit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, city: ICity) {
    e.stopPropagation();
    setSelectedCity(city);
    setMode(ModeEnum.EDIT);
  }

  function handleClear() {
    setSelectedCity(null);
    refetch();
    setMode(ModeEnum.NONE);
  }
  function handleCitySelect(city: ICity) {
    setSelectedCity(city);
    setMode(ModeEnum.NONE);
  }

  const columns = [
    {field: 'name', headerName: 'Name', flex: 1, headerClassName: 'custom-header'},
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 2,
      headerClassName: 'action-header',
      sortable: false,
      renderCell: (params: any) => {
        if (!user || user.role !== RoleEnum.ADMIN) {
          return (
            <div>
              <span style={{fontSize: '0.9rem', color: 'red'}}>{LABELS.NO_PERMISSION}</span>
              <Button variant='contained' size='small' onClick={() => requestPermissionsAlert(navigate, user?._id || '')}>
                {LABELS.REQUEST_PERMISSION}
              </Button>
            </div>
          );
        }

        return (
          <>
            <IconButton onClick={(e) => handleEdit(e, params.row)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={(e) => handleDelete(e, params.row._id)}>
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : isError && retryCount >= 3 ? (
        <NotFound title={ALERT_MESSAGES.NOT_FOUND_TITLE} message={ALERT_MESSAGES.NOT_FOUND_MESSAGE} />
      ) : (
        <div className='main-container'>
          <div className='data-grid-container'>
            {cities && (
              <DataGrid
                key={gridKey}
                rows={cities?.map((city) => ({...city, id: city!._id})) || []}
                columns={columns}
                onRowClick={(params) => handleCitySelect(params.row)}
              />
            )}
          </div>
          <div className='form-container'>
            <Button
              onClick={() => setMode(ModeEnum.CREATE)}
              startIcon={<AddCircleOutlineIcon />}
              size='large'
              variant='contained'
              style={{width: '100%'}}>
              {LABELS.ADD_CITY}
            </Button>

            {(mode === ModeEnum.CREATE || mode === ModeEnum.EDIT) && (
              <CityForm city={mode === ModeEnum.EDIT ? selectedCity : initialCity} mode={mode} onClear={() => handleClear} />
            )}
          </div>
        </div>
      )}
    </>
  );
}
