import { Component, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';
import { UserprofileService } from '../services/user-profile/userprofile.service';
import { HttpClient } from '@angular/common/http';

enum EmbedType {
  REPORT = 'report',
  TILE = 'tile',
  DASHBOARD = 'dashboard'
}

export const POWER_BI_API = "https://api.powerbi.com/v1.0/myorg/";

type WorkspaceType = {
  id: string,
  isOnDedicatedCapacity: boolean,
  isReadOnly: boolean,
  type: string,
  name: string
};

type DashboardType = {
  id: string,
  name: string,
  displayName: string,
  embedUrl: string,
  isReadOnly: boolean,
  webUrl: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selectedWorkspace : string; 
  embedType : EmbedType;
  groups: WorkspaceType[];
  dashboards: DashboardType[];

  constructor(private authService: MsalService, private msalBroadcastService: MsalBroadcastService,
    public profile: UserprofileService,
    private http: HttpClient) {
      this.selectedWorkspace = '';
      this.embedType = EmbedType.REPORT;
      this.groups = [];
      this.dashboards = [];
     }

  ngOnInit(): void {
    this.profile.loadProfile();
    this.loadWorkspaces();
  }

  loadWorkspaces() {
    this.http.get<any>(POWER_BI_API + "groups")
    .subscribe(groups => {
      this.groups = groups['value'];
    })
  }

  loadDashboards() {
    this.http.get<any>(POWER_BI_API + "groups/" + this.selectedWorkspace + "/dashboards")
    .subscribe(dashboards => {
      this.dashboards = dashboards['value'];
    });
  }

  selectedWorkspaceChanged(event : any) {
    this.selectedWorkspace = event.target.value;
    console.log("Changed the workspace into: " + this.selectedWorkspace);
    this.loadDashboards();
  }

  embedTypeChanged(embed_type : string) {
    try {
      this.embedType = embed_type as EmbedType;
    } catch {
      return;
    }
  }

  logout() { // Add log out function here
    this.authService.logoutPopup({
      mainWindowRedirectUri: "/"
    });
  }
}