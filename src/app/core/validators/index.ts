import { AbstractControl } from "@angular/forms";
import * as moment from "moment";

export function passportExpirationValidator(control: AbstractControl): { [key: string]: any } | null {

    if (moment.isMoment(control.value)) {
      const dateExpiration = moment().add(6, 'month');
      const valid = moment(control.value).isSameOrAfter(dateExpiration);
      return valid ? null : { passportDateOfExpire: { value: 'Passport must be valid for six months' } }
    }
    return null;
}

export function validateBirthdate(control: AbstractControl): { [key: string]: any } | null {
    if (control.value?.['year']) {
      const currentYear = new Date().getFullYear();
      const valid = ((currentYear - control.value.year()) > 20);
      return valid ? null : { birthdate: { value: 'should be more than 20 years old' } }
    }
    return null;
  }