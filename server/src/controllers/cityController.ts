import { Request, Response } from 'express';
import cityService from '../services/citiesService';

export const getAllCities = async (req: Request, res: Response): Promise<void> => {
  try {
    const cities = await cityService.getAllCities();
    res.json(cities);
  } catch (error: unknown) {
    res
      .status(500)
      .json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

export const getCityById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { Id } = req.params;
    const cities = await cityService.getCityById(Id);
    res.json(cities);
  } catch (error: unknown) {
    res
      .status(500)
      .json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

export const getCitiesByCountryId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { countryId } = req.params;
    const cities = await cityService.getCitiesByCountryId(countryId);
    res.json(cities);
  } catch (error: unknown) {
    res
      .status(500)
      .json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

export const createCity = async (req: Request, res: Response): Promise<void> => {
  try {
    const newCity = await cityService.createCity(req.body);
    res.status(201).json(newCity);
  } catch (error: unknown) {
    res
      .status(500)
      .json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

export const updateCity = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedCity = await cityService.updateCity(req.params.id, req.body);
    if (!updatedCity) {
      res.status(404).json({ error: 'City not found' });
      return;
    }
    res.json(updatedCity);
  } catch (error: unknown) {
    res
      .status(500)
      .json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

export const deleteCity = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedCity = await cityService.deleteCity(req.params.id);
    if (!deletedCity) {
      res.status(404).json({ error: 'City not found' });
      return;
    }
    res.json({ message: 'City deleted successfully' });
  } catch (error: unknown) {
    res
      .status(500)
      .json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};
