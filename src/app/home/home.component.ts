// @ts-ignore
import multiCoinValidator from 'multicoin-address-validator';
// @ts-ignore
import swyftxValidator from '@swyftx/api-crypto-address-validator/dist/wallet-address-validator.min.js';
import { tap } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Crypto } from './crypto-dropdown/crypto-dropdown.component';
import { AbstractControl, Form, FormBuilder, FormControlStatus, FormGroup, Validators } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { AnimationService } from './services/animation-service';
import { CustomValidatorService } from './services/custom-validator.service';

interface AddressValidator {
  findCurrency: Function;
  validate: Function;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('buttonSubmit', { static: false })
  private buttonRef!: ElementRef;
  @ViewChild('buttonText', { static: false })
  private buttonTextRef!: ElementRef;

  private cryptoSource = '../../assets/cryptos.json';
  private validators = new Array<AddressValidator>();
  private exceptionList = ['BTTOLD'];
  private minLengthAddress = 10;

  submitted = false;
  form!: FormGroup;

  // All Cryptos for Dropdown
  cryptos: Array<Crypto> = [];

  // Current Crypto selected
  cryptoSelected: Crypto = { name: '', symbol: '', image: '' };

  // Current address selected
  cryptoAddressSelected: string = '';

  // Boolean to understand if button can be enabled
  isValidateBtnEnabled: boolean = false;

  constructor(
    customValidator: CustomValidatorService,
    private formBuilder: FormBuilder,
    private readonly animationService: AnimationService
  ) {
    this.validators.push(multiCoinValidator);
    this.validators.push(customValidator);
    
    // Swiftx validato doesn't expose the findCurrency API
    this.validators.push({
      findCurrency: () => true,
      validate: swyftxValidator.validate,
    });
  }

  async ngOnInit(): Promise<void> {
    this.cryptos = await this.loadCryptos(this.cryptoSource);
    this.form = this.formBuilder.group({
      address: ['', { validators: [Validators.required, Validators.minLength(this.minLengthAddress)], updateOn: 'change' }],
    });

    this.form.statusChanges.subscribe((value: FormControlStatus) => this.validateForm(value))
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  validateForm(value: FormControlStatus): void {
    this.isValidateBtnEnabled = ![this.cryptoAddressSelected, this.cryptoSelected.name].includes('') && value === 'VALID';
  }

  /**
   * Load cryptos from json and then move them into a list
   * @param cryptoSource
   * @returns
   */
  async loadCryptos(cryptoSource: string): Promise<Crypto[]> {
    let updatedList: Crypto[] = [];
    const rawdata = await fetch(cryptoSource);
    const parsedCryptos: { [key: string]: Crypto } = await rawdata.json();
    for (const parsedCrypto of Object.entries(parsedCryptos)) {
      updatedList.push({
        name: parsedCrypto[1].name,
        symbol: parsedCrypto[1].symbol,
        image: parsedCrypto[0],
      });
    }
    // Sort by ascending symbol
    return updatedList.sort(function (a, b) {
      return a.symbol.localeCompare(b.symbol);
    });
  }

  /**
   * Callback fired when an element is selected inside the dropdown
   * @param event
   */
  onCryptoSelected(event: any): void {
    this.cryptoSelected = event;
    this.validateForm(this.form.status);
  }

  /**
   * Callback fired when an input event in the input box happens
   * @param event
   */
  onInput(event: any): void {
    this.cryptoAddressSelected = event.target.value;
    this.validateForm(this.form.status);
  }

  /**
   * Callback fired to trigger validator when a click happens
   * @returns nothing
   */
  onValidateClick(): void {
    let isValid = this.exceptionListProcessing();
    // if response is boolean means validation has been executed
    if (typeof isValid === 'boolean') return;
    for (const validator of this.validators) {
      if (validator.findCurrency(this.cryptoSelected.symbol)) {
        isValid = validator.validate(this.cryptoAddressSelected, this.cryptoSelected.symbol);
        //Exit from a loop if a validator has validated it
        break;
      }
    }
    this.animationService.initializeReferences(this.buttonRef, this.buttonTextRef);
    this.animationService.startButtonAnimation(isValid as boolean);
  }

  /**
   * This function is used to deal with particular cases
   * @returns boolean if an address has been validated, else undefined
   */
  exceptionListProcessing(): boolean | undefined {
    if (!this.exceptionList.includes(this.cryptoSelected.symbol)) return undefined;
    if (this.cryptoSelected.symbol === 'BTTOLD') {
      // Validate crypto address
      return swyftxValidator.validate(this.cryptoAddressSelected, 'BTT');
    }
    return undefined;
  }
}
