import { Component, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';
import { PowerBiApiService } from '../services/power-bi-api/power-bi-api.service';
import { UserprofileService } from '../services/user-profile/userprofile.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selectedWorkspace : string; 

  constructor(private authService: MsalService, private msalBroadcastService: MsalBroadcastService,
    public profile: UserprofileService,
    public powerbiapi: PowerBiApiService) {
      this.selectedWorkspace = '';
     }

  ngOnInit(): void {
    /*this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
      )
      .subscribe((result: EventMessage) => {*/
        this.profile.loadProfile();
        this.powerbiapi.loadWorkspaces();
      }
//        console.log(result);
//      });
/*
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None)
      )
      .subscribe(() => {
        this.setLoginDisplay();
      })
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }
  */

  selectedWorkspaceChanged(event : any) {
    this.selectedWorkspace = event.target.value;
    console.log("Changed the workspace into: " + this.selectedWorkspace);
  }

  logout() { // Add log out function here
    this.authService.logoutPopup({
      mainWindowRedirectUri: "/"
    });
  }
}