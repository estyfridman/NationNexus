import {renderHook, waitFor} from '@testing-library/react';
import {QueryClient} from '@tanstack/react-query';
import {http, HttpResponse} from 'msw';
import {setupServer} from 'msw/node';
import {useGetUsers, useGetUserById, useUpdateUser} from '../services/hooks/useUsers';
import IUser from '../models/interfaces/iUser';
import {RoleEnum} from '../models/enums/RoleEnum';
import {TEST_CONSTANTS} from '../constants/constants';

// Mock server msw
const server = setupServer(
  http.get('/api/users', () => {
    return HttpResponse.json([
      {_id: '1', name: 'Alice', email: 'alice@example.com'},
      {_id: '2', name: 'Bob', email: 'bob@example.com'},
    ]);
  }),
  http.get('/api/users/1', () => {
    return HttpResponse.json({_id: '1', name: 'Alice', email: 'alice@example.com'});
  }),
  http.put('/api/users/1', () => {
    return HttpResponse.json({message: 'User updated successfully'});
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// useGetUsers
describe('useGetUsers', () => {
  test('מחזיר רשימת משתמשים בהצלחה', async () => {
    const {result} = renderHook(() => useGetUsers());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(2);
    expect(result.current.data).toEqual([
      {_id: '1', name: 'Alice', email: 'alice@example.com'},
      {_id: '2', name: 'Bob', email: 'bob@example.com'},
    ]);
  });

  test('מטפל בשגיאות בצורה נכונה', async () => {
    server.use(
      http.get('/api/users', () => {
        return HttpResponse.json({message: 'Internal Server Error'}, {status: 500});
      })
    );

    const {result} = renderHook(() => useGetUsers());

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});

describe('useGetUserById', () => {
  test('מחזיר משתמש לפי ID מה-Cache אם קיים', async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(['Users'], [{_id: '1', name: 'Alice', email: 'alice@example.com'}]);

    const {result} = renderHook(() => useGetUserById('1'));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({_id: '1', name: 'Alice', email: 'alice@example.com'});
  });

  test('טוען משתמש מה-API אם אינו נמצא ב-Cache', async () => {
    const {result} = renderHook(() => useGetUserById('1'));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({_id: '1', name: 'Alice', email: 'alice@example.com'});
  });

  test('מטפל במקרה של שגיאה', async () => {
    server.use(
      http.get('/api/users/1', () => {
        return HttpResponse.json({message: 'User not found'}, {status: 404});
      })
    );

    const {result} = renderHook(() => useGetUserById('1'));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});

// useUpdateUser
describe('useUpdateUser', () => {
  test('Updating a user updates the Cache', async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData<IUser[]>(
      ['Users'],
      [{_id: '1', firstName: 'Alice', lastName: '', username: '', email: 'alice@example.com', phone: '', role: RoleEnum.ADMIN, createdAt: new Date()}]
    );

    const {result} = renderHook(() => useUpdateUser());

    const formData = new FormData();
    formData.append('name', 'Error User');

    result.current.mutate({id: '1', formData});

    await waitFor(() => {
      const updatedUsers = queryClient.getQueryData<IUser[]>(['Users']);
      expect(updatedUsers).toEqual([{_id: '1', name: 'Alice Updated', email: 'alice@example.com'}]);
    });
  });

  test('מציג הודעת שגיאה כאשר ה-API נכשל', async () => {
    server.use(
      http.put('/api/users/1', () => {
        return HttpResponse.json({message: 'Failed to update user'}, {status: 500});
      })
    );

    const {result} = renderHook(() => useUpdateUser());

    const formData = new FormData();
    formData.append('name', 'Error User');

    result.current.mutate({id: '1', formData});

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
