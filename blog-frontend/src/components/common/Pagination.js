import '../../style/components/common/pagination.scss';
import qs from 'qs';
import Button from './Button';

const buildLink = ({ username, tag, page }) => {
  const query = qs.stringify({ tag, page });
  return username ? `${username}?${query}` : `?${query}`;
};

const Pagination = ({ page, lastPage, username, tag }) => {
  return (
    <div className="pagination-block">
      <Button
        disabled={page === 1}
        to={
          page === 1 ? undefined : buildLink({ username, tag, page: page - 1 })
        }
      >
        이전
      </Button>
      {page}
      <Button
        disabled={page === lastPage}
        to={
          page === lastPage
            ? undefined
            : buildLink({ username, tag, page: page + 1 })
        }
      >
        다음
      </Button>
    </div>
  );
};

export default Pagination;
