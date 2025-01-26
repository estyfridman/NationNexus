import Country from '../models/country';
import { Request, Response } from 'express';

export const getAllCountries = async (req: Request, res: Response): Promise<void> => {
  try {
    const countries = await Country.find();
    console.log(countries);
    res.json(countries);
  } catch (error) {
    (error instanceof Error) 
      ? res.status(500).json({ error: error.message }) 
      : res.status(500).json({ error: 'An unknown error occurred' });
  }
};

export const getCountryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const country = await Country.findById(req.params.id);
    if (!country) {
      res.status(404).json({ error: 'Country not found' });
      return;
    }
    res.json(country);
  } catch (error: unknown) {
    (error instanceof Error) 
      ? res.status(500).json({ error: error.message }) 
      : res.status(500).json({ error: 'An unknown error occurred' });
  }
};

export const createCountry = async (req: Request, res: Response): Promise<void> => {
    try {
      const newCountry = await Country.create(req.body);
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
    const country = await Country.findByIdAndUpdate(id, req.body, { new: true });
    if (!country) {
      res.status(404).json({ error: 'Country not found' });
      return;
    }
    res.json(country);
  } catch (error) {
    (error instanceof Error) 
      ? res.status(500).json({ error: error.message }) 
      : res.status(500).json({ error: 'An unknown error occurred' });
  }
};

export const deleteCountry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const country = await Country.findByIdAndDelete(id);
    if (!country) {
      res.status(404).json({ error: 'Country not found' });
      return;
    }
    res.json({ message: 'Country deleted' });
  } catch (error) {
    (error instanceof Error) 
      ? res.status(500).json({ error: error.message }) 
      : res.status(500).json({ error: 'An unknown error occurred' });
  }
};