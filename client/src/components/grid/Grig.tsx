'use client';

import { useRecoilState } from 'recoil';
import { selectedCountryState } from '../../services/recoilService/selectedCountry';
import { ICountry } from '../../models/iCountry';
import './grid.scss';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/Button';
import { useFetchCountries } from '../../services/hooks/useFetchCountries';
import Loading from '../loading/Loading';
import NotFound from '../notFound/NotFound';
import { DataGrid, GridPaginationModel } from '@mui/x-data-grid';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDeleteCountry } from '../../services/hooks/useDeleteCountry ';
import { deleteAlert, errorDeleteAlert } from '../../utils/sweet-alerts';
import { useQueryClient } from '@tanstack/react-query';

export default function Grid() {
  const queryClient = useQueryClient();
  console.log('Cached activities:', queryClient.getQueryData(['Countries']));  
  const [gridKey, setGridKey] = useState<number>(0);
  const [selectedCountry, setSelectedCountry] = useRecoilState<ICountry>(selectedCountryState);
  const { data, isLoading, isError } = useFetchCountries();
  const deleteCountryMutation = useDeleteCountry();
  const navigate = useNavigate();

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    {
      field: 'flag',
      headerName: 'Flag',
      flex: 1,
      renderCell: (params: any) => (
        <img
          src={`${params.value}`}
          alt={params.row.name}
          style={{ width: '50px', height: '30px' }}
        />
      ),
    },
    { field: 'region', headerName: 'Region', flex: 1 },
    { field: 'population', headerName: 'Population', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params: any) => (
        <>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(params.row);
            }}
            style={{ marginRight: '8px' }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            variant="text"
            color="info"
            onClick={(e) => {
              handleDelete(e, params.row._id);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const handleCountrySelect = (country: ICountry) => {
    setSelectedCountry(country);
    navigate(`/edit/${country._id}`);
  };

  function handleDelete(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) {
    e.stopPropagation();
    deleteAlert(() => {
      deleteCountryMutation.mutate(id, {
        onSuccess: () => {
          setGridKey((prevKey) => prevKey + 1);
        },
        onError: () => {
          errorDeleteAlert('Failed to delete the record. Please try again.');
        },
      });
    });
  }

  function handleEdit(country: ICountry) {
    setSelectedCountry(country)
    navigate(`/edit/${country._id}`);
  }

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <NotFound />
      ) : (
        <>
          <div className="data-grid-container" style={{ height: 700, width: '100%' }}>
            {data && (
              <DataGrid
                key={gridKey}
                rows={data?.map((country) => ({ ...country, id: country._id })) || []}
                columns={columns}
                editMode="row"
                onRowClick={(params) => handleCountrySelect(params.row)}
              />
            )}
          </div>
          <IconButton>+</IconButton>
        </>
      )}
    </>
  );
}
