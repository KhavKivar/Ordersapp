type ClassValue = string | null | undefined | false;
type ClassValueFn<T = unknown> = (state: T) => string | undefined;
type ClassValueLike<T = unknown> = ClassValue | ClassValueFn<T>;

export function cn<T = unknown>(
  ...values: Array<ClassValueLike<T>>
): string | ((state: T) => string) {
  const hasFunction = values.some((value) => typeof value === "function");
  if (hasFunction) {
    return (state: T) =>
      values
        .map((value) =>
          typeof value === "function" ? value(state) : value
        )
        .filter(Boolean)
        .join(" ");
  }

  return values.filter(Boolean).join(" ");
}
