import {
  Component,
  Input,
  HostBinding,
  ContentChild,
  Optional,
  OnInit,
} from "@angular/core";
import {
  NgControl,
  AbstractControl,
  FormGroupDirective,
} from "@angular/forms";
import { FormlyField } from "@ngx-formly/core";
import { DynamicFormComponent } from "core-app/modules/common/dynamic-forms/components/dynamic-form/dynamic-form.component";

@Component({
  selector: 'op-form-field',
  templateUrl: './form-field.component.html',
})
export class OpFormFieldComponent implements OnInit{
  @HostBinding('class.op-form-field') className = true;
  @HostBinding('class.op-form-field_invalid') get errorClassName() {
    return this.showErrorMessage;
  }

  @Input() label = '';
  @Input() set helpTextAttribute(helpTextAttribute:string|undefined) {
    this._helpTextAttribute = helpTextAttribute;
  };
  @Input() set helpTextAttributeScope(helpTextAttributeScope:string|undefined) {
    this._helpTextAttributeScope = helpTextAttributeScope;
  };
  @Input() noWrapLabel = true;
  @Input() required = false;
  @Input() showValidationErrorOn: 'change' | 'blur' | 'submit' | 'never';

  @ContentChild(NgControl) ngControl:NgControl;

  get formControl ():AbstractControl|undefined|null {
    return this.ngControl?.control || this._dynamicControl?.field?.formControl;
  }

  get showErrorMessage():boolean {
    let showErrorMessage = false;

    if (!this.formControl) {
      return false;
    }

    if (this.showValidationErrorOn === 'submit') {
      showErrorMessage =  this.formControl.invalid && this._formGroupDirective?.submitted;
    } else if (this.showValidationErrorOn === 'blur') {
      showErrorMessage =  this.formControl.invalid && this.formControl.touched;
    } else if (this.showValidationErrorOn === 'change') {
      showErrorMessage =  this.formControl.invalid && this.formControl.dirty;
    }

    return showErrorMessage;
  }

  get hidden () {
    return this._dynamicControl?.field?.hide;
  }

  get helpTextAttribute() {
    return this._helpTextAttribute || this._dynamicControl?.field?.templateOptions?.property;
  }

  get helpTextAttributeScope() {
    return this._helpTextAttributeScope || this._dynamicFormComponent?.helpTextAttributeScope;
  }

  private _helpTextAttribute:string|undefined;
  private _helpTextAttributeScope:string|undefined;

  constructor(
    @Optional() private _formGroupDirective:FormGroupDirective,
    @Optional() private _dynamicFormComponent:DynamicFormComponent,
    @Optional() private _dynamicControl:FormlyField,
  ) {}

  ngOnInit() {
    this.showValidationErrorOn = this.showValidationErrorOn ||
      this._dynamicFormComponent?.showValidationErrorsOn ||
      'submit';
  }
}
