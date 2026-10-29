// Date-only values ("2026-10-31") from the promotion form: a promotion starts at the
// beginning of its start day and runs until the end of its end day.
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export const parseStartDate = (value) =>
  new Date(DATE_ONLY.test(value) ? `${value}T00:00:00.000Z` : value);

export const parseEndDate = (value) =>
  new Date(DATE_ONLY.test(value) ? `${value}T23:59:59.999Z` : value);
