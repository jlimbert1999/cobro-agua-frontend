import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-app-loader',
  standalone: true,
  imports: [ProgressSpinnerModule],
  template: `
    <div class="p-dialog-content">
      <div class="flex gap-4 align-items-center">
        <p-progressSpinner
          ariaLabel="loading"
          styleClass="w-5rem h-5rem"
          strokeWidth="6"
        />

        <div class="flex-1 text-xl">Por favor espere....</div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLoaderComponent {}
