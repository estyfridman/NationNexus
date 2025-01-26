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

export default function Grid() {
  const [selectedCountry, setSelectedCountry] = useRecoilState<ICountry>(selectedCountryState);
  const { data, isLoading, isError } = useFetchCountries();

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
              handleEdit(params.row._id);
            }}
            style={{ marginRight: '8px' }}
          >
            <EditIcon/>
          </IconButton>
          <IconButton
            variant="text"
            color="info"
            onClick={(e) => {
              e.stopPropagation(); 
              handleDelete(params.row._id);
            }} >
            <DeleteIcon/>
          </IconButton>
        </>
      ),
    },
  ];

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 7,
  });

  const handleCountrySelect = (country: ICountry) => {
    setSelectedCountry(country);
    navigate(`/edit/${country._id}`);
  };

  function handleDelete(id: string) {
    console.log('deleting country with id:', id);
  }

  function handleEdit(id: string) {
    console.log(id);
  }

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <NotFound />
      ) : (
        <>
         <div style={{ height: 500, width: '100%' }}>
      {data && 
      <DataGrid
        rows={data.map((country) => ({ ...country, id: country._id }))}
        columns={columns}
        editMode="row"
        onRowClick={(params) => handleCountrySelect(params.row)}
      />}
      
    </div>
          <IconButton>+</IconButton>
        </>
      )}
    </>
  );
}
