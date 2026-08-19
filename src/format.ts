const dateFormatter = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Australia/Adelaide",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Australia/Adelaide",
  timeZoneName: "short",
});

export const formatDate = (value: string): string => dateFormatter.format(new Date(value));

export const formatDateTime = (value: string): string => dateTimeFormatter.format(new Date(value));

export const formatMoney = (value: number, currency: string): string => new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency,
  minimumFractionDigits: 2,
}).format(value);

export const confidenceLabel = (value: number): string => {
  if (value >= 75) return "Strong";
  if (value >= 62) return "Building";
  return "Watch";
};
