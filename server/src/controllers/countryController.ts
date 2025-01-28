import Country from '../models/country';
import { Request, Response } from 'express';
import countryService from '../services/countryService';

export const getAllCountries = async (req: Request, res: Response): Promise<void> => {
  try {
    const countries = await countryService.getAllCountries();
    res.json(countries);
  } catch (error) {
    (error instanceof Error) 
      ? res.status(500).json({ error: error.message }) 
      : res.status(500).json({ error: 'An unknown error occurred' });
  }
};

export const getCountryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const country = await countryService.getCountryById(req.params.id);
    res.json(country);
  } catch (error: unknown) {
    if (error instanceof Error) {
      const status = error.message === 'Country not found' ? 404 : 500;
      res.status(status).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

export const createCountry = async (req: Request, res: Response): Promise<void> => {
    try {
      const newCountry = await countryService.createCountry(req.body);
      res.status(201).json(newCountry);
    } catch (error) {
      (error instanceof Error)
        ? res.status(400).json({ error: error.message })
        : res.status(400).json({ error: 'An unknown error occurred' });
    }
};

export const updateCountry = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const country = await countryService.updateCountry(id, req.body);
    res.json({ id, updatedData: country });
  } catch (error) {
    (error instanceof Error) 
      ? res.status(500).json({ error: error.message }) 
      : res.status(500).json({ error: 'An unknown error occurred' });
  }
};

export const deleteCountry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const country = await countryService.deleteCountry(id);
    res.json(country);
  } catch (error) {
    (error instanceof Error) 
      ? res.status(500).json({ error: error.message }) 
      : res.status(500).json({ error: 'An unknown error occurred' });
  }
};