export function Badge(props) {
  return (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center rounded border border-neutral-200 bg-neutral-50 leading-4 text-neutral-900 no-underline dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 ${
        props.size === 'lg' ? 'p-2 text-xl font-semibold' : 'p-1 text-sm'
      }`}
    />
  );
}
