// Utility to merge tailwind classes safely if we install clsx/tailwind-merge later
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
