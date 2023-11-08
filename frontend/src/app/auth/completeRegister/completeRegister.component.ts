import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../services/auth.service';
import { SocketioService } from 'src/services/socketio.service';
import { DialogService } from 'src/services/dialog.service';

@Component({
  selector: 'app-completeRegister',
  templateUrl: './completeRegister.component.html',
  styleUrls: ['./completeRegister.component.scss', '../../app.component.scss'],
})
export class CompleteRegisterComponent implements OnInit {
  completeRegisterForm!: FormGroup;
  genders: string[] = ['Male', 'Female', 'Other'];
  allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  files: string[] = [];
  tags: FormControl | undefined;
  availableTags: string[] = [
    'Sport',
    'Music',
    'Cinema',
    'Travel',
    'Art',
    'Politics',
    'Technology',
    'Cooking',
    'Fashion',
  ];
  selectedTags: string[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private socketService: SocketioService,
    private dialogService: DialogService
  ) {
    this.authService.getLocation();
  }

  async onChangeFileInput(event: any) {
    const files = event.target.files;
    this.files = [];
    let validMimeTypes = true;

    if (files.length > 5) {
      const data = {
        title: 'Error',
        text: 'You can only upload a maximum of 5 pictures.',
        text_yes_button: 'Ok',
        yes_callback: () => { },
        reload: false,
      };
      this.dialogService.openDialog(data);
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const mimeType = await this._getMimeTypes(file);
      if (this.allowedTypes.indexOf(mimeType) === -1) {
        validMimeTypes = false;
        break;
      }
    }

    if (!validMimeTypes) {
      const data = {
        title: 'Error',
        text: 'Only PNG and JPEG files are allowed.',
        text_yes_button: 'Ok',
        yes_callback: () => { },
        reload: false,
      };
      this.dialogService.openDialog(data);
      if (event.target instanceof HTMLInputElement) {
        const inputElement = event.target;
        inputElement.value = '';
      }
      this.completeRegisterForm.get('fileStatus')?.setValue(false);
      return;
    }

    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = window.URL.createObjectURL(file);
        img.onload = () => {
          const res = (reader.result || '') as string;
          this.files.push(res);
        };
        img.onerror = () => {
          alert('Invalid image file');
          event.target.value = '';
        };
      };
      reader.readAsDataURL(file);
    }
    this.completeRegisterForm.get('fileStatus')?.setValue(true);
  }

  _getMimeTypes(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      let mimeType = '';
      reader.onload = (event) => {
        const result = (event.target?.result as ArrayBuffer) || null;
        if (result) {
          const view = new Uint8Array(result);
          mimeType = this._checkMimeType(view);
          resolve(mimeType);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  _checkMimeType(file: Uint8Array) {
    const bytes = [];
    for (let i = 0; i < file.length; i++) {
      bytes.push(file[i].toString(16));
    }
    const hexString = bytes.join('').toUpperCase().slice(0, 8);
    const mimeTypes: Record<string, string> = {
      '89504E47': 'image/png',
      'FFD8FFDB': 'image/jpeg',
      'FFD8FFE0': 'image/jpeg',
      'FFD8FFE1': 'image/jpeg',
      'FFD8FFE2': 'image/jpeg',
      'FFD8FFE3': 'image/jpeg',
      'FFD8FFE8': 'image/jpeg',
    };
    return mimeTypes[hexString];
  }

  getMimeType(uint8Array: Uint8Array): string {
    const bytes = [];
    for (let i = 0; i < uint8Array.length; i++) {
      bytes.push(uint8Array[i].toString(16));
    }

    const hexString = bytes.join('').toUpperCase();

    const mimeTypes: Record<string, string> = {
      '89504E47': 'image/png',
      'FFD8FFDB': 'image/jpeg',
      'FFD8FFE0': 'image/jpeg',
      'FFD8FFE1': 'image/jpeg',
    };

    return mimeTypes[hexString] || 'unknown';
  }

  ngOnInit(): void {
    this.completeRegisterForm = this.fb.group({
      gender: ['', Validators.required],
      biography: ['', Validators.required],
      maleSexualPreference: false,
      femaleSexualPreference: false,
      otherSexualPreference: false,
      sexualPreference: [false, [Validators.requiredTrue]],
      tags: [false, [Validators.requiredTrue]],
      fileStatus: [false, [Validators.requiredTrue]]
    });
  }

  sexualPreferenceChange() {
    const { maleSexualPreference, femaleSexualPreference, otherSexualPreference } = this.completeRegisterForm.value;
    if (maleSexualPreference || femaleSexualPreference || otherSexualPreference) {
      this.completeRegisterForm.get('sexualPreference')?.setValue(true);
    } else {
      this.completeRegisterForm.get('sexualPreference')?.setValue(false);
    }
  }

  tagsChange() {
    if (this.selectedTags.length > 0) {
      this.completeRegisterForm.get('tags')?.setValue(true);
    } else {
      this.completeRegisterForm.get('tags')?.setValue(false);
    }
  }

  addTag(tag: string) {
    const index = this.availableTags.indexOf(tag);
    this.availableTags.splice(index, 1);
    this.selectedTags.push(tag);
    this.tagsChange();
  }

  removeTag(tag: string) {
    const index = this.selectedTags.indexOf(tag);
    this.selectedTags.splice(index, 1);
    this.availableTags.push(tag);
    this.tagsChange();
  }

  onSubmit(): void {
    if (this.completeRegisterForm.valid) {
      const { gender, biography, maleSexualPreference, femaleSexualPreference, otherSexualPreference } = this.completeRegisterForm.value;
      var sexualPreference = "";
      if (maleSexualPreference)
        sexualPreference = "Male";
      else if (femaleSexualPreference)
        sexualPreference = "Female";
      else
        sexualPreference = "Other";
      const genderUp = gender.charAt(0).toUpperCase() + gender.slice(1);
      this.authService.completeRegister(genderUp, sexualPreference, biography, this.files, this.selectedTags);
    }
  }

}
