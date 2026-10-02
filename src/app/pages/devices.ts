import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../core/api.service';
import { errorMessage } from '../core/errors';
import { Device, DeviceType } from '../core/models';

@Component({
  selector: 'app-devices',
  imports: [ReactiveFormsModule],
  template: `
    <h2>Devices</h2>
    <form class="card row" [formGroup]="form" (ngSubmit)="save()">
      <label>Name <input formControlName="name" maxlength="100" /></label>
      <label>Type
        <select formControlName="type">
          @for (t of types; track t) { <option [value]="t">{{ t }}</option> }
        </select>
      </label>
      <label>OS <input formControlName="os" maxlength="50" /></label>
      <button class="btn" [disabled]="form.invalid">{{ editingId() ? 'Update' : 'Add device' }}</button>
      @if (editingId()) { <button class="btn secondary" type="button" (click)="cancel()">Cancel</button> }
    </form>
    @if (error()) { <p class="error">{{ error() }}</p> }

    <table class="card">
      <thead><tr><th>Name</th><th>Type</th><th>OS</th><th>Status</th><th></th></tr></thead>
      <tbody>
        @for (d of devices(); track d.id) {
          <tr>
            <td>{{ d.name }}</td><td>{{ d.type }}</td><td>{{ d.os }}</td>
            <td><span class="badge" [class]="d.status.toLowerCase()">{{ d.status }}</span></td>
            <td class="actions">
              @if (d.status === 'AVAILABLE') {
                <button class="btn small" (click)="start(d)">Start session</button>
              }
              <button class="btn small secondary" (click)="edit(d)">Edit</button>
              <button class="btn small danger" (click)="retire(d)">Retire</button>
            </td>
          </tr>
        } @empty {
          <tr><td colspan="5" class="muted">No devices yet.</td></tr>
        }
      </tbody>
    </table>
  `,
})
export class Devices implements OnInit {
  private readonly api = inject(ApiService);
  private readonly fb = inject(FormBuilder).nonNullable;

  protected readonly types: DeviceType[] = ['BROWSER', 'MOBILE', 'TABLET'];
  protected readonly devices = signal<Device[]>([]);
  protected readonly editingId = signal<string | null>(null);
  protected readonly error = signal('');
  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    type: ['BROWSER' as DeviceType],
    os: [''],
  });

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.api.devices().subscribe({
      next: (d) => this.devices.set(d),
      error: (e) => this.error.set(errorMessage(e)),
    });
  }

  private run(call: { subscribe: (o: { next: () => void; error: (e: unknown) => void }) => unknown }): void {
    this.error.set('');
    call.subscribe({ next: () => this.load(), error: (e) => this.error.set(errorMessage(e)) });
  }

  save(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const body = { name: v.name, type: v.type, os: v.os || null };
    const id = this.editingId();
    this.run(id ? this.api.updateDevice(id, body) : this.api.createDevice(body));
    this.cancel();
  }

  edit(d: Device): void {
    this.editingId.set(d.id);
    this.form.setValue({ name: d.name, type: d.type, os: d.os ?? '' });
  }

  cancel(): void {
    this.editingId.set(null);
    this.form.reset({ name: '', type: 'BROWSER', os: '' });
  }

  retire(d: Device): void {
    if (confirm(`Retire device "${d.name}"?`)) this.run(this.api.retireDevice(d.id));
  }

  start(d: Device): void {
    this.run(this.api.startSession(d.id));
  }
}
