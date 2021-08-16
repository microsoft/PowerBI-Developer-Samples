import { Component, OnInit } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
import { UserprofileService } from '../services/user-profile/userprofile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public profile?: UserprofileService

  constructor(
    profile: UserprofileService
  ) {
      this.profile = profile;
   }

  ngOnInit() {
//    this.getProfile();
  }

  /*
  getProfile() {
    this.http.get(GRAPH_ENDPOINT)
      .subscribe(profile => {
        this.profile = profile;
      });
  }*/
}