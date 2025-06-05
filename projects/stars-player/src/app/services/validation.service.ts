import { Injectable } from '@angular/core';
import { FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { Progress } from '../models/verona';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private formControls: AbstractControl[] = [];

  registerFormControl(formControl: FormControl | FormGroup): void {
    this.formControls.push(formControl);
  }

  get responseProgress(): Progress {
    if (this.formControls.length === 0) return 'none';

    const validControls = this.formControls.filter(control => {
      if (control instanceof FormGroup) {
        const values = Object.values(control.value);
        return values.some(value => value === true);
      } else {
        return control.valid && control.value !== null && control.value !== '';
      }
    });

    if (validControls.length === 0) return 'none';
    if (validControls.length === this.formControls.length) return 'complete';
    return 'some';
  }

  reset(): void {
    this.formControls = [];
  }
}
