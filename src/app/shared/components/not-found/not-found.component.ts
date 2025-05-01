import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
    <div class="flex flex-col items-center justify-center h-screen">
      <h1 class="text-4xl font-bold">404 - Page Not Found</h1>
      <p class="text-gray-600">The page you are looking for does not exist.</p>
    </div>
  `,
})
export class NotFoundComponent {}
