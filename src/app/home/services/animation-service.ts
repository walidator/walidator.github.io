import { ElementRef, Injectable, ViewChild } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AnimationService {
  @ViewChild('buttonSubmit', { static: false })
  private buttonRef!: ElementRef;

  @ViewChild('text', { static: false })
  private buttonTextRef!: ElementRef;

  isAnimating = false;

  private validAddress = 'Address is valid!';
  private invalidAddress = 'Address is invalid!';
  private buttonMessage = 'Validate';

  private tickMark =
    '<svg width="100%" height="100%" viewBox="0 0 58 45" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" fill-rule="nonzero" d="M19.11 44.64L.27 25.81l5.66-5.66 13.18 13.18L52.07.38l5.65 5.65"/></svg>';
  private error =
    '<svg width="100%" height="100%" viewBox="0 0 25 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" fill="#fff" clip-rule="evenodd" d="M4.22676 4.22676C4.5291 3.92441 5.01929 3.92441 5.32163 4.22676L12 10.9051L18.6784 4.22676C18.9807 3.92441 19.4709 3.92441 19.7732 4.22676C20.0756 4.5291 20.0756 5.01929 19.7732 5.32163L13.0949 12L19.7732 18.6784C20.0756 18.9807 20.0756 19.4709 19.7732 19.7732C19.4709 20.0756 18.9807 20.0756 18.6784 19.7732L12 13.0949L5.32163 19.7732C5.01929 20.0756 4.5291 20.0756 4.22676 19.7732C3.92441 19.4709 3.92441 18.9807 4.22676 18.6784L10.9051 12L4.22676 5.32163C3.92441 5.01929 3.92441 4.5291 4.22676 4.22676Z"/></svg>';

  private resultDelay = 1000;
  private textAppearDelay = 1250;
  private restoreButtonDelay = 5000;
  private notVisibileDelay = 250;

  initializeReferences(buttonRef: ElementRef, buttonTextRef: ElementRef): void {
    this.buttonRef = buttonRef;
    this.buttonTextRef = buttonTextRef;
  }

  startButtonAnimation(success: boolean): void {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.collapseAnimation(success);
    this.delay(this.resultDelay).then(() => this.resultAnimation(success));
    this.delay(this.textAppearDelay).then(() => this.textAppearAnimation(success));
    this.delay(this.restoreButtonDelay - this.notVisibileDelay).then(() => this.btn.classList.toggle('not-visible'));
    this.delay(this.restoreButtonDelay).then(() => {
      this.restoreDefaultButton();
      this.isAnimating = false;
    });
  }

  private get btn() {
    return this.buttonRef.nativeElement;
  }

  private get text() {
    return this.buttonTextRef.nativeElement;
  }

  private async collapseAnimation(success: boolean) {
    const icon = success ? this.tickMark : this.error;
    this.text.innerHTML = this.btn.innerText === this.buttonMessage ? icon : this.buttonMessage;
    this.btn.classList.toggle('no-hover');
    this.btn.classList.toggle('button-circle');
  }

  private textAppearAnimation(success: boolean): void {
    this.text.innerHTML = success ? this.validAddress : this.invalidAddress;
    this.text.classList.toggle('text-appear');
  }

  private resultAnimation(success: boolean): void {
    this.text.innerHTML = '';
    this.btn.classList.toggle(success ? 'success' : 'error');
  }

  private restoreDefaultButton(): void {
    const classFound = ['success', 'error'].find((item) => this.btn.classList.contains(item));
    this.btn.classList.toggle(classFound);
    this.btn.classList.toggle('button-circle');
    this.btn.classList.toggle('not-visible');
    this.btn.classList.toggle('no-hover');
    this.text.innerHTML = this.buttonMessage;
  }

  async delay(ms: number): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
  }
}
