import {useRecoilState, useRecoilValue} from 'recoil';
import {selectedCountryState} from '../../services/recoilService/selectedCountry';
import {ICountry} from '../../models/interfaces/iCountry';
import './grid.scss';
import {useNavigate} from 'react-router-dom';
import IconButton from '@mui/material/Button';
import {useFetchCountries} from '../../services/hooks/useCountry';
import Loading from '../loading/Loading';
import NotFound from '../notFound/NotFound';
import {DataGrid} from '@mui/x-data-grid';
import {useCallback, useEffect, useState} from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {useDeleteCountry} from '../../services/hooks/useCountry';
import {deleteAlert, errorDeleteAlert, successAlert} from '../../utils/sweet-alerts';
import {userState} from '../../services/recoilService/userState';
import {RoleEnum} from '../../models/enums/RoleEnum';
import {LABELS, BUTTON_TEXT, FIELD, PATH, FUNCS} from '../../constants/constants';
import {requestPermissionsAlert} from '../../utils/sweet-alerts';
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {ADD_BUTTON} from '../../constants/sxConstants';

export default function Grid() {
  const [gridKey, setGridKey] = useState<number>(0);
  const [selectedCountry, setSelectedCountry] = useRecoilState<ICountry>(selectedCountryState);
  const [retryCount, setRetryCount] = useState(0);
  const {data, isLoading, isError, refetch} = useFetchCountries();
  const deleteCountryMutation = useDeleteCountry();
  const navigate = useNavigate();
  const {user} = useRecoilValue(userState);

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
    {field: FIELD.NAME, headerName: LABELS.NAME, flex: 1, headerClassName: 'custom-header'},
    {
      field: FIELD.FLAG,
      headerName: LABELS.FLAG_URL,
      flex: 1,
      headerClassName: 'custom-header',
      renderCell: (params: any) => <img src={`${params.value}`} alt={params.row.name} style={{width: '50px', height: '30px'}} />,
    },
    {field: FIELD.REGION, headerName: LABELS.REGION, flex: 1, headerClassName: 'custom-header'},
    {field: FIELD.POPULATION, headerName: LABELS.POPULATION, flex: 1, headerClassName: 'custom-header'},
    {
      field: FIELD.CITYIDS,
      headerName: LABELS.CITIES,
      flex: 2,
      headerClassName: 'custom-header',
      renderCell: (params: any) => {
        const cities = params.row.cityIds.map((city: {name: string}) => city.name).join(', ');
        return cities || BUTTON_TEXT.NO_CITIES;
      },
    },
    {
      field: FIELD.ACTIONS,
      headerName: BUTTON_TEXT.ACTIONS,
      flex: 2,
      headerClassName: 'action-header',
      sortable: false,
      renderCell: (params: any) => {
        if (!user || user.role !== RoleEnum.ADMIN) {
          return (
            <>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(FUNCS.CITIES_NAV(params.row._id));
                }}>
                <img src={PATH.CITIES_ICON} alt={BUTTON_TEXT.CITIES_ICON_ALT} className='city-img' />
              </IconButton>
              <Button variant='contained' size='small' onClick={() => requestPermissionsAlert(navigate, user?._id || '')}>
                {LABELS.REQUEST_PERMISSION}
              </Button>
            </>
          );
        }

        return (
          <>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(params.row);
              }}>
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={(e) => {
                handleDelete(e, params.row._id);
              }}>
              <DeleteIcon />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                navigate(FUNCS.CITIES_NAV(params.row._id));
              }}>
              <img src={PATH.CITIES_ICON} alt={BUTTON_TEXT.CITIES_ICON_ALT} className='city-img' />
            </IconButton>
          </>
        );
      },
    },
  ];

  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
      e.stopPropagation();
      deleteAlert(() => {
        deleteCountryMutation.mutate(id, {
          onSuccess: () => {
            setGridKey((prevKey) => prevKey + 1);
            successAlert();
          },
          onError: () => {
            errorDeleteAlert('Failed to delete the record. Please try again.');
          },
        });
      });
    },
    [deleteCountryMutation]
  );

  const handleEdit = useCallback(
    (country: ICountry) => {
      setSelectedCountry(country);
      navigate(`/edit/${country._id}`);
    },
    [navigate, setSelectedCountry]
  );

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : isError && retryCount >= 3 ? (
        <NotFound title='Unable to retrieve data' message='The server is currently unavailable. Please try again later.' />
      ) : (
        <>
          <div className='data-grid-container'>
            <Button variant='contained' color='primary' onClick={() => navigate('/create')} sx={ADD_BUTTON}>
              <AddCircleOutlineIcon />
              {LABELS.ADD_COUNTRY}
            </Button>

            {data && (
              <DataGrid
                key={gridKey}
                rows={data?.map((country) => ({...country, id: country._id})) || []}
                columns={columns}
                editMode='row'
                onRowClick={(params) => setSelectedCountry(params.row)}
              />
            )}
          </div>
        </>
      )}
    </>
  );
}
