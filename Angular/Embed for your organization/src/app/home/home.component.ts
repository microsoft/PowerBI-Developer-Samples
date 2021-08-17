import { Component, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';
import { UserprofileService } from '../services/user-profile/userprofile.service';
import { HttpClient } from '@angular/common/http';
import { models, IReportEmbedConfiguration, ITileEmbedConfiguration } from 'powerbi-client'

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

type TileType = {
  id: string,
  embedUrl: string,
  subTitle: string,
  title: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selectedWorkspace: string;
  selectedDashboard: string;
  selectedTile: TileType = {} as TileType;
  embedType: EmbedType;
  groups: WorkspaceType[];
  dashboards: DashboardType[];
  tiles: TileType[];
  renderTileConfig: ITileEmbedConfiguration = { 
    type: "tile",
    dashboardId: '', 
    embedUrl: undefined,
    accessToken: undefined,
    tokenType: models.TokenType.Embed,
    settings: {
      panes: {
        filters: {
          expanded: false,
          visible: true
        }
      },
      background: models.BackgroundType.Transparent,
    }
  };

  constructor(private authService: MsalService, private msalBroadcastService: MsalBroadcastService,
    public profile: UserprofileService,
    private http: HttpClient) {
    this.selectedWorkspace = '';
    this.selectedDashboard = '';
    //this.selectedTile = undefined;
    this.embedType = EmbedType.REPORT;
    this.groups = [];
    this.dashboards = [];
    this.tiles = [];
 //   this.renderTileConfig.accessToken = this.authService.instance.getActiveAccount().
    //this.renderConfig = {};
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

  loadTiles() {
    this.http.get<any>(POWER_BI_API + "groups/" + this.selectedWorkspace + "/dashboards/" + this.selectedDashboard + "/tiles")
      .subscribe(tiles => {
        this.tiles = tiles['value'];
      });
  }

  selectedWorkspaceChanged(event: any) {
    this.selectedWorkspace = event.target.value;
    console.log("Changed the workspace into: " + this.selectedWorkspace);
    this.loadDashboards();
  }

  selectedDashboardChanged(event: any) {
    this.selectedDashboard = event.target.value;
    console.log("Changed the dashboard into: " + this.selectedDashboard);
    this.loadTiles();
  }

  private getTileFromId(id : string) : TileType {
    for (let t of this.tiles) {
      if (t.id == id) {
        return t;
      }
    }
    return {} as TileType;
  }

  selectedTileChanged(event: any) {
    this.selectedTile = this.getTileFromId(event.target.value);

    this.renderTileConfig.dashboardId = this.selectedTile.id;
    this.renderTileConfig.embedUrl = this.selectedTile.embedUrl;
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