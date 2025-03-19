import {useEffect, useState} from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/Button';
import {useParams} from 'react-router-dom';
import ICity from '../../models/interfaces/iCity';
import {deleteAlert, successAlert, errorDeleteAlert} from '../../utils/sweet-alerts';
import {useDeleteCity} from '../../services/hooks/useCountry';
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
import {LABELS, BUTTON_TEXT, ALERT_MESSAGES, FIELD, ERRORS} from '../../constants/constants';
import {userState} from '../../services/recoilService/userState';
import {useNavigate} from 'react-router-dom';
import {useFetchCountries} from '../../services/hooks/useCountry';
import {PermissionEnum} from '../../models/enums/permissionEnum';

export default function CitiesGrid() {
  const {countryId} = useParams();
  const [retryCount, setRetryCount] = useState(0);
  const [selectedCity, setSelectedCity] = useRecoilState<ICity | null>(selectedCityState);
  const [mode, setMode] = useState<ModeEnum>(ModeEnum.NONE);
  const {user} = useRecoilValue(userState);
  const navigate = useNavigate();
  const {data, isLoading, isError, refetch} = useFetchCountries();
  const [cities, setCities] = useState<ICity[]>([]);

  const deleteCityMutation = useDeleteCity();
  useEffect(() => {
    if (!data) {
      setCities([]);
      return;
    }

    if (countryId) {
      const country = data.find((country) => country._id === countryId);
      setCities(country?.cityIds || []);
    } else {
      setCities(data.flatMap((country) => country.cityIds || []));
    }
  }, [data, countryId]);

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

    if (!id || typeof id !== 'string' || !countryId || typeof countryId !== 'string') {
      errorDeleteAlert(ERRORS.INVALID_ID);
      return;
    }

    deleteAlert(() => {
      deleteCityMutation.mutate(
        {cityId: id, countryId},
        {
          onSuccess: () => {
            setCities((prevCities) => prevCities.filter((city) => city._id !== id));
            successAlert(BUTTON_TEXT.SAVE, ALERT_MESSAGES.SUCCESS_DELETE_CITY);
            if (selectedCity?._id === id) {
              setSelectedCity(null);
            }
          },

          onError: () => {
            errorDeleteAlert(ALERT_MESSAGES.ERROR_DELETE);
          },
        }
      );
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
    {field: FIELD.NAME, headerName: LABELS.NAME},
    {
      field: FIELD.ACTIONS,
      headerName: FIELD.ACTIONS,
      sortable: false,
      renderCell: (params: any) => {
        if (!user) return null;
        const {permissions} = user;

        return (
          <>
            {permissions && permissions.includes(PermissionEnum.EDIT) && (
              <IconButton onClick={(e) => handleEdit(e, params.row)}>
                <EditIcon />
              </IconButton>
            )}
            {permissions && permissions.includes(PermissionEnum.DELETE) && (
              <IconButton onClick={(e) => handleDelete(e, params.row._id)}>
                <DeleteIcon />
              </IconButton>
            )}
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
        <div>
          <h1>{countryId ? data?.find((country) => country._id === countryId)?.name : LABELS.CITIES}</h1>
          <div className='main-container'>
            <div className='data-grid-container'>
              {cities && (
                <DataGrid
                  rows={cities?.map((city) => ({...city, id: city!._id})) || []}
                  columns={columns}
                  onRowClick={(params) => handleCitySelect(params.row)}
                />
              )}
            </div>
            <div className='form-container'>
              {user?.permissions?.includes(PermissionEnum.ADD) && (
                <Button onClick={() => setMode(ModeEnum.CREATE)} startIcon={<AddCircleOutlineIcon />} size='large' variant='contained'>
                  {LABELS.ADD_CITY}
                </Button>
              )}

              {mode === ModeEnum.CREATE && user?.permissions?.includes(PermissionEnum.ADD) && (
                <CityForm city={initialCity} mode={mode} countryId={countryId} onClear={handleClear} setCities={setCities} />
              )}

              {mode === ModeEnum.EDIT && user?.permissions?.includes(PermissionEnum.EDIT) && (
                <CityForm city={selectedCity} mode={mode} countryId={countryId} onClear={handleClear} setCities={setCities} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
