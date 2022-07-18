import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { CryptoDropdownComponent } from './crypto-dropdown/crypto-dropdown.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AnimationService } from './services/animation-service';
import { CustomValidatorService } from './services/custom-validator.service';
import { FooterModule } from '@app/footer/footer.module';
import { HeaderModule } from '@app/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    DropdownModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    InputTextModule,
    ButtonModule,
    FooterModule,
    HeaderModule,
  ],
  providers: [CustomValidatorService, AnimationService],
  declarations: [HomeComponent, CryptoDropdownComponent],
})
export class HomeModule {}
