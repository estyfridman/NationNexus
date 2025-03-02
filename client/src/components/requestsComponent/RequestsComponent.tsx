import {useState} from 'react';
import {DataGrid, GridColDef, GridRenderCellParams} from '@mui/x-data-grid';
import {RoleEnum} from '../../models/enums/RoleEnum';
import {MenuItem, Select, FormControl, InputLabel, Button, Typography} from '@mui/material';
import Loading from '../loading/Loading';
import NotFound from '../notFound/NotFound';
import IRoleRequest from '../../models/interfaces/iRoleRequests';
import {useRequests} from '../../services/hooks/useRequests';
import {useRecoilValue} from 'recoil';
import {userState} from '../../services/recoilService/userState';
import {useUpdateStatusMutation} from '../../services/hooks/usePermission';
import {LABELS, RR_OPTIONS} from '../../constants';
import './requestsComponent.scss';

const RequestsComponent = () => {
  const {data: requests, isLoading, error} = useRequests();
  const {user} = useRecoilValue(userState);
  const updateStatusMutation = useUpdateStatusMutation();
  const [showPendingOnly, setShowPendingOnly] = useState(true);

  const filteredRequests = showPendingOnly ? requests?.filter((req) => req.status === 'PENDING') : requests;

  const processedRequests = filteredRequests?.map((req) => ({
    ...req,
    username: req.userId?.username ?? 'N/A',
  }));

  const renderStatusCell = (params: GridRenderCellParams) => {
    if (user?.role !== RoleEnum.ADMIN) return params.value;
    const isPending = params.row.status === 'PENDING';
    return (
      <FormControl disabled={!isPending}>
        <InputLabel id={`status-label-${params.row.id}`}></InputLabel>
        <Select
          labelId={`status-label-${params.row.id}`}
          id={`status-select-${params.row.id}`}
          value={params.value}
          onChange={(e) => {
            const newStatus = e.target.value as string;
            const requestId = params.row._id;
            const userId = params.row.userId;
            const requestedRole = params.row.requestedRole;
            updateStatusMutation.mutate({
              requestId,
              status: newStatus,
              userId,
              role: requestedRole,
            });
          }}>
          {RR_OPTIONS.map((option) => (
            <MenuItem key={option} value={option.toUpperCase()}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  const columns: GridColDef[] = [
    {
      field: 'username',
      headerName: 'User Name',
    },
    {
      field: 'requestedRole',
      headerName: 'Requested Role',
      width: 150,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: renderStatusCell,
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 200,
      valueGetter: (params: IRoleRequest) => new Date(params.createdAt || new Date()).toLocaleString(),
    },
  ];

  if (isLoading) return <Loading />;

  if (error) return <NotFound />;

  return (
    <div className='container'>
      <Typography className='admin-dashboard-title' variant='h4'>
        {LABELS.UP_REQUEST}
      </Typography>
      <div className='buttons-container'>
        <Button variant={showPendingOnly ? 'contained' : 'outlined'} onClick={() => setShowPendingOnly(true)} className='action-button'>
          {LABELS.P_REQUEST}
        </Button>
        <Button variant={!showPendingOnly ? 'contained' : 'outlined'} onClick={() => setShowPendingOnly(false)} className='action-button'>
          {LABELS.A_REQUEST}
        </Button>
      </div>
      {requests && requests.length > 0 && <DataGrid rows={processedRequests} columns={columns} getRowId={(row) => row._id} />}
    </div>
  );
};

export default RequestsComponent;
