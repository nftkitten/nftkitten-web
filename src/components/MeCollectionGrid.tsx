/* eslint-disable jsx-a11y/alt-text */
import { useCallback, useMemo } from 'react'
import { useInfiniteQuery } from 'react-query'
import { MECollection, PagingResult, RenderingRows } from '../global'
import { LoadingScreen } from './LoadingScreen'
import { MediaCard } from './MediaCard'
import { fetchMeCollection } from '../services/fetchMeCollection'
import { fetchOption } from '../services/fetchOption'
import { COLLECTION_THUMB_SIZE, ME_PAGE_LIMIT } from '../constants'
import { AutoSizeGrid } from './AutoSizeGrid'

export const MeCollectionGrid = () => {
  const { isLoading, isError, fetchNextPage, data, hasNextPage } =
    useInfiniteQuery<PagingResult<MECollection>>(
      'MeCollection',
      fetchMeCollection,
      fetchOption<PagingResult<MECollection>>()
    )
  // const [scrollY, scrollHeight, viewportHeight] = useScrollPosition()

  // const shouldLoadNext = useMemo(
  //   () => scrollY + viewportHeight * 2 >= scrollHeight,
  //   [scrollY, viewportHeight, scrollHeight]
  // )
  // useEffect(() => {
  //   if (hasNextPage && shouldLoadNext) {
  //     fetchNextPage()
  //   }
  // }, [hasNextPage, shouldLoadNext, fetchNextPage])
  const itemData = useMemo(
    () =>
      data?.pages.reduce(
        (
          r: RenderingRows<{ id: string; src: string; alt: string | null }>,
          results: PagingResult<MECollection>
        ) => {
          for (const row of results.data) {
            if (!row.image) continue
            if (row.symbol in r) {
              r.ids[row.symbol]++
            } else {
              r.ids[row.symbol] = 1
              r.rows.push({
                id: row.symbol,
                src: row.image,
                alt: row.name,
              })
            }
          }
          return r
        },
        { ids: {}, rows: [] }
      ).rows,
    [data]
  )
  const loadMoreItems = useCallback(
    // eslint-disable-next-line no-unused-vars
    (startIndex: number, stopIndex: number) => {
      if (hasNextPage) {
        return fetchNextPage().then(() => {})
      }
    },
    [hasNextPage, fetchNextPage]
  )
  return (
    <div className='grow min-h-screen'>
      {isLoading ? (
        <LoadingScreen />
      ) : isError ? (
        <h1 className='h-screen text-center' style={{ lineHeight: '100vh' }}>
          500 - Something went wrong
        </h1>
      ) : (
        <AutoSizeGrid
          pageSize={ME_PAGE_LIMIT}
          width={COLLECTION_THUMB_SIZE}
          height={COLLECTION_THUMB_SIZE + 30}
          itemData={itemData}
          loadMoreItems={hasNextPage ? loadMoreItems : undefined}
        >
          {({ data, style }) => (
            <a
              href={`https://magiceden.io/marketplace/` + data.id}
              target='_blank'
              rel='noreferrer'
              className='underline'
              style={style}
            >
              <MediaCard
                src={data.src}
                alt={data.alt}
                width={COLLECTION_THUMB_SIZE}
                height={COLLECTION_THUMB_SIZE}
              ></MediaCard>
              <div className='flex overflow-hidden flex-row flex-nowrap items-center text-xs text-ellipsis whitespace-nowrap'>
                {data.alt}
              </div>
            </a>
          )}
        </AutoSizeGrid>
      )}
    </div>
  )
}
