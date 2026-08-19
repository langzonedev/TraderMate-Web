export function Brand() {
  return (
    <a className="brand" href={import.meta.env.BASE_URL} aria-label="Market Horizons home">
      <span className="brand__mark" aria-hidden="true">
        <span className="brand__sun" />
        <span className="brand__horizons" />
      </span>
      <span className="brand__name">Market Horizons</span>
    </a>
  );
}
