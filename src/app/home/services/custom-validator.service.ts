import { Injectable } from '@angular/core';
// @ts-ignore
import multiCoinValidator from 'multicoin-address-validator';

@Injectable({
  providedIn: 'root',
})
export class CustomValidatorService {
  validatorMap = new Map<string, Function>();

  constructor() {
    this.validatorMap.set('LUNA', this.isValidTerraAddress);
    this.validatorMap.set('SHIB', this.isValidShibaInuAddress);
  }

  findCurrency(code: string): boolean {
    return this.validatorMap.has(code.toUpperCase());
  }

  validate(address: string, code: string): boolean {
    const validatorFunction = this.validatorMap.get(code.toUpperCase());
    if (validatorFunction) return validatorFunction(address);
    return false;
  }

  /* Validators */
  private isValidTerraAddress(address: string) {
    // check the string format:
    // - starts with "terra1"
    // - length == 44 ("terra1" + 38)
    // - contains only numbers and lower case letters
    return /(terra1[a-z0-9]{38})/g.test(address);
  }

  private isValidShibaInuAddress(address: string) {
    return multiCoinValidator.validate(address, 'ETH');
  }
}
