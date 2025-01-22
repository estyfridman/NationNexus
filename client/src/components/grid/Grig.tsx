'use client'

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useRecoilState } from 'recoil';
import { selectedCountryState } from '../../services/recoilService/selectedCountry';
import { ICountry } from '../../models/iCountry';
import './grid.scss';

const countries = [
  {
    _id: '1',
    name: 'Israel',
    flag: 'israel.jpeg',
    region: 'Asia',
    population: 500000,
  },
  {
    _id: '2',
    name: 'Japan',
    flag: 'japan.jpeg',
    region: 'Asia',
    population: 126500000,
  },
  {
    _id: '3',
    name: 'United States',
    flag: 'usa.jpeg',
    region: 'North America',
    population: 331000000,
  },
  {
    _id: '4',
    name: 'Brazil',
    flag: 'brazil.jpeg',
    region: 'South America',
    population: 212600000,
  },
];

export default function Grid() {
  const [selectedCountry, setSelectedCountry] = useRecoilState<ICountry>(selectedCountryState);

  const handleCountrySelect = (country: ICountry) => {
    setSelectedCountry(country);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Flag</TableCell>
            <TableCell align="right">Region</TableCell>
            <TableCell align="right">Population</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {countries.map((country) => (
            <TableRow
              key={country._id}  onClick={() => handleCountrySelect(country)}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {country.name}
              </TableCell>
              <TableCell align="right">
                <div className="image-container">
                  <img src={`/images/${country.flag}`} alt={country.name} />
                </div>
              </TableCell>
              <TableCell align="right">{country.region}</TableCell>
              <TableCell align="right">{country.population}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>    </TableContainer>
  );
}

