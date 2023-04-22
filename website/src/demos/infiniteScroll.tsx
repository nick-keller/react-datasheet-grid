import React, { useCallback, useMemo, useState } from 'react'
import { DataSheetGrid, intColumn, keyColumn, textColumn } from 'react-datasheet-grid'
import { QueryClient, QueryClientProvider, useInfiniteQuery } from 'react-query';

type User = Record<string, any>;
const usersPerPage = 50;

const InfiniteScroll = () => {
  const [users, setUsers] = useState<User[]>([]);
  const columns = useMemo(() => {
    return [
      { ...keyColumn('id', intColumn), title: 'id', disabled: true },
      { ...keyColumn('name', textColumn), title: 'name' },
    ]
  }, []);

  const { fetchNextPage, isFetching, hasNextPage } = useInfiniteQuery('example', async ({ pageParam = 1 }): Promise<User[]> => {
    /// Fake waiting time for data
    await new Promise((resolve) => setTimeout(resolve, 500));
    /// Build mock data
    return new Array(usersPerPage).fill(0).map((_, i) => {
      const id = (pageParam - 1) * usersPerPage + i + 1
      return { id, name: `User ${id}` };
    });
  }, {
    onSuccess: ({ pages }) => setUsers(pages.flat()),
    getNextPageParam: (_, pages) => pages.length + 1,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const fetchMoreOnBottomReached = useCallback<React.UIEventHandler<HTMLDivElement>>((e) => {
    const scrollableElement = e.target as HTMLDivElement;
    if (scrollableElement) {
      const { scrollHeight, scrollTop, clientHeight } = scrollableElement
      //once the user has scrolled within 300px of the bottom of the table, fetch more data if there is any
      if (
        scrollHeight - scrollTop - clientHeight < 300 &&
        !isFetching &&
        hasNextPage
      ) {
        fetchNextPage()
      }
    }
  }, [fetchNextPage, isFetching, hasNextPage]);

  return (
    <DataSheetGrid<User>
      value={users}
      onChange={setUsers}
      columns={columns}
      height={500}
    /// onScroll={fetchMoreOnBottomReached}
    />
  )
}

/// Setup react-query
const queryClient = new QueryClient();
export const FinalResult = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <InfiniteScroll />
    </QueryClientProvider>
  );
}
