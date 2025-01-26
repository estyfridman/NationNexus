import { QueryObserverResult, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { client } from '../../api/client';
import { ICountry } from '../../models/iCountry';

const fetchCountries = async (): Promise<AxiosResponse<ICountry[], any>> => {
    return await client.get<ICountry[]>('/countries/');
};

export const useFetchCountries = (): QueryObserverResult<ICountry[], any> => {
    return useQuery<ICountry[], any>({
        queryFn: async () => {
            const { data } = await fetchCountries();
            return data;
        },
        queryKey: [ 'countries' ]
    });
};