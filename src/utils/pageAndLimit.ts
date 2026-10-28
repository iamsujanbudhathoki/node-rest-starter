import appConstants from '../constants/appConstant';
import { PaginatedInput } from '../interfaces/queryInterface';

export interface Pagination {
  page: number;
  limit: number;
}

function parsePositiveInteger(
  value: number | string | undefined,
  defaultValue: number,
): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) && value > 0
      ? Math.floor(value)
      : defaultValue;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultValue;
  }
  return defaultValue;
}

export const paginateResponse = <T>(
  dataTotalCount: [T[], number],
  limit: number | string | undefined,
  page: number | string | undefined,
) => {
  const [data, total] = dataTotalCount;

  const resolvedPage = parsePositiveInteger(page, appConstants.DEFAULT_PAGE);
  const resolvedLimit = parsePositiveInteger(limit, appConstants.DEFAULT_LIMIT);

  const lastPage =
    resolvedLimit > 0 ? Math.max(1, Math.ceil(total / resolvedLimit)) : 1;
  const nextPage = resolvedPage + 1 > lastPage ? null : resolvedPage + 1;
  const prevPage = resolvedPage - 1 < 1 ? null : resolvedPage - 1;

  return {
    data,
    pagination: {
      count: total,
      currentPage: resolvedPage,
      nextPage,
      prevPage,
      lastPage,
    },
  };
};

export const skipTakeMaker = (paginationInput: PaginatedInput) => {
  const page = parsePositiveInteger(
    paginationInput.page,
    appConstants.DEFAULT_PAGE,
  );
  const limit = parsePositiveInteger(
    paginationInput.limit,
    appConstants.DEFAULT_LIMIT,
  );

  const skip = (page - 1) * limit;
  return { skip, take: limit };
};
