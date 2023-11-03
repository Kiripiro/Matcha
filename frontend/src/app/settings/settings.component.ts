import { Component, OnInit } from '@angular/core';
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
      username: '',
      first_name: '',
      last_name: '',
      email: ['', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")],
      password: '',
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
              // this.router.navigate(['auth/login']);
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

  onChangeFileInput(event: any) {
    const filesEvent = event.target.files;
    if (filesEvent.length) {
      if (this.newImg.length + filesEvent.length > 5) {
        alert('You can have a maximum of 5 images.');
        event.target.value = '';
        return;
      }

      for (let i = 0; i < filesEvent.length; i++) {
        const file = filesEvent[i];

        if (this.allowedTypes.indexOf(file.type) === -1) {
          alert('Only PNG and JPEG files are allowed.');
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          const res = (reader.result || '') as string;

          if (this.actualImg.length < 5) {
            this.newImg.push(res);
          }

          this.files.push(res);
        };
        reader.readAsDataURL(file);
      }

      this.updateForm.get('fileStatus')?.setValue(true);
    } else {
      this.updateForm.get('fileStatus')?.setValue(false);
    }
  }

  onSubmit(): void {
    const formValues = this.updateForm.value;
    const fieldsToCheck = [
      "username",
      "last_name",
      "first_name",
      "email",
      "password",
      "gender",
      "biography",
      "sexual_preferences",
      "latitude",
      "longitude",
      "city"
    ];

    const updatedFields: Partial<UserSettings> = {};

    fieldsToCheck.forEach((field) => {
      if (formValues[field] !== this.user?.[field as keyof UserSettings] && formValues[field] !== "") {
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
