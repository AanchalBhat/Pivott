import { ButtonLoader } from './ButtonLoader'

const LoadMore = ({
  nextPage, handleLoadMore, loader = false
}) => {
  return (
    <>
      {
        nextPage && (
          <div className='ma-loadMore-div'>
            <ButtonLoader
              loading={loader}
              classStyle={"create_btn"}
              handleClick={() => handleLoadMore()}
              title={"Load More"}
              spanTextClass={"create_btn_txt"}
            />
          </div>
        )
      }
    </>
  )
}

export default LoadMore
