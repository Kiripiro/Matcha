import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserSettings } from 'src/models/models';
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

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    protected tagsService: TagsService
  ) { }

  ngOnInit(): void {
    this.updateForm = this.fb.group({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      gender: '',
      biography: '',
      maleSexualPreference: false,
      femaleSexualPreference: false,
      otherSexualPreference: false,
      sexualPreference: false,
      tags: false,
      profilePictures: '',
    });
    this.getUser();
    this.getSelectedTags();
  }

  getUser() {
    this.settingsService.getUser().subscribe((user: any) => {
      this.user = user;
      console.log(this.user);
    });
  }

  getSelectedTags() {
    this.tagsService.getSelectedTags().subscribe((tags) => {
      this.userTags = tags.map((tag) => tag.name);
      this.tagsService.availableTags = this.tagsService.availableTags.filter((tag) => !this.userTags.includes(tag));
      console.log(this.userTags);
    });
  }

  sexualPreferenceChange() {
    const { maleSexualPreference, femaleSexualPreference, otherSexualPreference } = this.updateForm.value;
    if (maleSexualPreference || femaleSexualPreference || otherSexualPreference) {
      this.updateForm.get('sexualPreference')?.setValue(true);
    } else {
      this.updateForm.get('sexualPreference')?.setValue(false);
    }
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
    console.log("delete account");
  }

  updateUserInfos() {
    console.log("update user infos");
  }

  onSubmit(): void {
    console.log(this.updateForm.value);
  }
}
