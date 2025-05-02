import { throwError } from 'rxjs';

export function handleError(message: string) {
  return (error: unknown) => {
    if (error instanceof Error) {
      console.error(`${message}:`, error.message);
    } else {
      console.error(`${message}:`, error);
    }

    return throwError(() => new Error(message));
  };
}
