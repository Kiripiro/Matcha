import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    this.getUser();
    this.getSelectedTags();
    this.updateForm = this.fb.group({
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

  public getUser() {
    this.settingsService.getUser().subscribe((user: any) => {
      this.user = user;
      console.log(this.user);
    });
  }

  public getSelectedTags() {
    this.tagsService.getSelectedTags().subscribe((tags) => {
      this.userTags = tags.map((tag) => tag.name);
      this.tagsService.availableTags = this.tagsService.availableTags.filter((tag) => !this.userTags.includes(tag));
    });
  }

  public tagsChange() {
    this.updateForm.get('tags')?.setValue(this.userTags.length > 0);
  }

  public addTag(tag: string) {
    this.tagsService.addTag(tag);
    this.userTags.push(tag);
    this.tagsChange();
  }

  public removeTag(tag: string) {
    this.tagsService.removeTag(tag);
    this.userTags = this.userTags.filter((t) => t !== tag);
    this.tagsChange();
  }

  deleteAccount() {
    console.log("delete account");
    // Implement your delete account logic here
  }

  updateSettings() {
    // Implement your updateSettings logic here
  }
}
