import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  template: `
    <div class="flex justify-center items-center p-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"
      ></div>
    </div>
  `,
  standalone: true,
})
export class LoaderComponent {}
