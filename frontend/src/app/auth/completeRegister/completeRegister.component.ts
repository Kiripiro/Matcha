import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../services/auth.service';
import { SocketioService } from 'src/services/socketio.service';

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
    private socketService: SocketioService
  ) {

  }

  onChangeFileInput(event: any) {
    const filesEvent = event.target.files;
    this.files = [];
    if (filesEvent.length) {
      if (filesEvent.length > 5) {
        alert('You can post a maximum of 5 images.');
      }
      const maxFiles = (filesEvent.length < 5) ? filesEvent.length : 5;
      for (let i = 0; i < maxFiles; i++) {
        const file = filesEvent[i];
        if (this.allowedTypes.indexOf(file.type) === -1) {
          alert('Only PNG and JPEG files are allowed.');
          event.target.value = '';
          return;
        }

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
    } else {
      this.completeRegisterForm.get('fileStatus')?.setValue(false);
    }
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
      console.log(genderUp, biography, maleSexualPreference, femaleSexualPreference, otherSexualPreference);
      this.authService.completeRegister(genderUp, sexualPreference, biography, this.files, this.selectedTags);
    }
  }

}
