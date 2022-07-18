import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';

export interface Crypto {
  name: string;
  symbol: string;
  image: string;
}

@Component({
  selector: 'app-crypto-dropdown',
  templateUrl: './crypto-dropdown.component.html',
  styleUrls: ['./crypto-dropdown.component.scss'],
})
export class CryptoDropdownComponent {
  selectedCrypto!: Crypto;
  form!: FormGroup;

  @Input()
  cryptos: Array<Crypto> = [];

  @Output()
  cryptoSelectedEvent = new EventEmitter<Crypto>();

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      cryptoDropdown: ['', { validators: [Validators.required], updateOn: 'change' }],
    });
  }

  onCryptoSelectedChange(event: any) {
    this.cryptoSelectedEvent.emit(event.value);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
