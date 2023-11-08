import { Component, KeyValueDiffers, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, concatMap, of } from 'rxjs';
import { UserSettings } from 'src/models/models';
import { AuthService } from 'src/services/auth.service';
import { DialogService } from 'src/services/dialog.service';
import { LocalStorageService } from 'src/services/local-storage.service';
import { SettingsService } from 'src/services/settings.service';
import { TagsService } from 'src/services/tags.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss', '../app.component.scss']
})
export class SettingsComponent implements OnInit {
  updateForm!: FormGroup;
  user: UserSettings | undefined;
  userTags: string[] = [];
  allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  files: string[] = [];
  actualImg: string[] = [];
  newImg: string[] = [];
  id!: number;

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private authService: AuthService,
    private router: Router,
    private localStorageService: LocalStorageService,
    protected tagsService: TagsService,
    private dialogService: DialogService

  ) {
    if (!this.authService.checkLog()) {
      this.router.navigate(['auth/login']);
      return;
    }
    if (!this.authService.checkCompleteRegister()) {
      this.router.navigate(['auth/completeRegister']);
      return;
    }
    this.id = this.localStorageService.getItem("id");
  }

  ngOnInit(): void {
    this.updateForm = this.fb.group({
      username: ['', [Validators.pattern("^[a-zA-Z0-9]*$")]],
      first_name: ['', [Validators.pattern("^[A-Z][a-zA-Z]*$")]],
      last_name: ['', [Validators.pattern("^[A-Z][a-zA-Z]*$")]],
      email: ['', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ['', Validators.minLength(8)],
      confirm_password: ['', Validators.minLength(8)],
      gender: '',
      biography: '',
      maleSexualPreference: false,
      femaleSexualPreference: false,
      otherSexualPreference: false,
      sexual_preferences: '',
      tags: false,
      fileStatus: false,
      latitude: null,
      longitude: null,
      location_permission: null,
      city: ''
    });
    this.getUser();
    this.getSelectedTags();
  }

  getUser() {
    this.authService.getUserInfosById(this.id).subscribe((userJson: any) => {
      this.user = userJson.user;
      if (this.user) {
        this.updateForm.patchValue({
          maleSexualPreference: this.user.sexual_preferences.includes('Male'),
          femaleSexualPreference: this.user.sexual_preferences.includes('Female'),
          otherSexualPreference: this.user.sexual_preferences.includes('Other'),
          gender: this.user.gender,
        });
        if (this.user.picture_1) {
          this.actualImg.push("data:image/jpeg;base64," + this.user.picture_1);
        }
        if (this.user.picture_2) {
          this.actualImg.push("data:image/jpeg;base64," + this.user.picture_2);
        }
        if (this.user.picture_3) {
          this.actualImg.push("data:image/jpeg;base64," + this.user.picture_3);
        }
        if (this.user.picture_4) {
          this.actualImg.push("data:image/jpeg;base64," + this.user.picture_4);
        }
        if (this.user.picture_5) {
          this.actualImg.push("data:image/jpeg;base64," + this.user.picture_5);
        }
        this.user.latitude = this.localStorageService.getItem('latitude');
        this.user.longitude = this.localStorageService.getItem('longitude');
        this.localStorageService.setItem('location_permission', this.user.location_permission);
      }
    });
  }

  getSelectedTags() {
    this.tagsService.getSelectedTags().subscribe((tags) => {
      this.userTags = tags.map((tag) => tag.name);
      this.tagsService.availableTags = this.tagsService.availableTags.filter((tag) => !this.userTags.includes(tag));
    });
  }

  sexualPreferenceChange(selectedPreference: string) {
    const preferences = ["Male", "Female", "Other"];
    preferences.forEach((preference) => {
      this.updateForm.get(preference.toLowerCase() + "SexualPreference")?.setValue(false);
    });
    this.updateForm.get(selectedPreference.toLowerCase() + "SexualPreference")?.setValue(true);
    this.updateForm.get('sexual_preferences')?.setValue(selectedPreference);
  }

  tagsChange() {
    this.updateForm.get('tags')?.setValue(this.userTags.length > 0);
  }

  addTag(tag: string) {
    this.tagsService.addTag(tag);
    this.userTags.push(tag);
    this.tagsChange();
  }

  removeTag(tag: string) {
    this.tagsService.removeTag(tag);
    this.userTags = this.userTags.filter((t) => t !== tag);
    this.tagsChange();
  }

  deleteAccount() {
    this.dialogService.openDialog({
      title: 'Delete account',
      text: 'Are you sure you want to delete your account ?',
      text_yes_button: "Yes",
      text_no_button: "No",
      yes_callback: () => {
        this.settingsService.deleteUser().subscribe({
          next: (response) => {
            console.log(response);
            if (response.message === "User deleted") {
              this.router.navigate(['auth/login']);
              console.log('post deleteUser successful:', response);
            }
          },
          error: (error) => {
            console.error('post deleteUser failed:', error);
          }
        });
      },
      no_callback: () => { },
      reload: false
    });

  }

  async onChangeFileInput(event: any) {
    const files = event.target.files;
    this.newImg = [];
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
      this.updateForm.get('fileStatus')?.setValue(false);
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
          this.newImg.push(res);

          if (this.files.length === files.length) {
            this.updateForm.get('fileStatus')?.setValue(true);
          }
        }
        img.onerror = () => {
          alert('Invalid image file');
          event.target.value = '';
        };
      };
      reader.readAsDataURL(file);
    }
    this.updateForm.get('fileStatus')?.setValue(true);
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

  onSubmit(): void {
    const formValues = this.updateForm.value;
    const fieldsToCheck = [
      "username",
      "last_name",
      "first_name",
      "email",
      "password",
      "confirm_password",
      "gender",
      "biography",
      "sexual_preferences",
      "latitude",
      "longitude",
      "location_permission",
      "city"
    ];

    const updatedFields: Partial<UserSettings> = {};

    fieldsToCheck.forEach((field) => {
      if (formValues[field] !== this.user?.[field as keyof UserSettings] && formValues[field] !== "" && formValues[field] !== null) {
        console.log(formValues[field]);
        updatedFields[field as keyof UserSettings] = formValues[field];
      }
    });

    let locationUpdate$: Observable<Partial<UserSettings> | undefined> = of(updatedFields);

    if (formValues.latitude && formValues.longitude) {
      locationUpdate$ = this.settingsService.updateUserLocation(formValues.latitude, formValues.longitude).pipe(
        concatMap((response) => {
          if (response) {
            this.updateForm.get('city')?.setValue(response);
            updatedFields.city = response;
            updatedFields.location_permission = true;
            this.localStorageService.setItem('location_permission', true);
            this.updateForm.get('location_permisson')?.setValue(true);
          }
          return of(updatedFields);
        }),
      );
    }

    locationUpdate$.subscribe((updatedFieldsAfterLocationUpdate) => {
      if (updatedFieldsAfterLocationUpdate === undefined) {
        return;
      }

      if (this.updateForm.get('tags')?.value) {
        updatedFieldsAfterLocationUpdate.tags = this.userTags;
      }

      if (Object.keys(updatedFieldsAfterLocationUpdate).length === 0 && this.files.length === 0) {
        const data = {
          title: 'Error',
          text: 'You must change at least one field.',
          text_yes_button: "Ok",
          yes_callback: () => { },
          reload: false
        };
        this.dialogService.openDialog(data);
        return;
      }

      if (updatedFieldsAfterLocationUpdate.password === updatedFieldsAfterLocationUpdate.confirm_password) {
        delete updatedFieldsAfterLocationUpdate.confirm_password;
      } else {
        const data = {
          title: 'Error',
          text: 'Passwords do not match.',
          text_yes_button: "Ok",
          yes_callback: () => { },
          reload: false
        };
        this.dialogService.openDialog(data);
        return;
      }

      this.settingsService.updateUser(updatedFieldsAfterLocationUpdate, this.files).subscribe({
        next: (response) => {
          if (response.message === "User updated") {
            const data = {
              title: 'Success',
              text: 'Your profile has been updated successfully.',
              text_yes_button: "Ok",
              yes_callback: () => { },
              reload: true
            };
            this.dialogService.openDialog(data);
          }
        },
        error: (error) => {
          console.error('post updateUser failed:', error);
        }
      });
    });
  }

}
