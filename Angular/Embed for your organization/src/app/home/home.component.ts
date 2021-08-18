import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { UserprofileService } from '../services/user-profile/userprofile.service';
import { HttpClient } from '@angular/common/http';
import { models, IReportEmbedConfiguration, IEmbedConfiguration, ITileEmbedConfiguration, service, factories } from 'powerbi-client'

/**
 * This is the base URL for the POWER BI API. All API calls use this as prefix.
 */
export const POWER_BI_API = "https://api.powerbi.com/v1.0/myorg/";


/**
 * {@link EmbedType} is a list of the supported embedding types.
 */
enum EmbedType {
  REPORT = 'report',
  TILE = 'tile',
  DASHBOARD = 'dashboard'
}

/**
 * The types below are the various Power BI data types used in this code: workspace, report and tile.
 */

class WorkspaceType {
  id: string = '';
  isOnDedicatedCapacity: boolean = false;
  isReadOnly: boolean = true;
  type: string = '';
  name: string = '';
};

class DashboardType {
  id: string = '';
  name: string = '';
  displayName: string = '';
  embedUrl: string = '';
  isReadOnly: boolean = true;
  webUrl: string = '';
}

class ReportType {
  id: string = '';
  datasetId: string = '';
  name: string = '';
  webUrl: string = '';
  embedUrl: string = '';
}

class TileType {
  id: string = '';
  embedUrl: string = '';
  subTitle: string = '';
  title: string = '';
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('container') container!: ElementRef;

  powerbi!: service.Service;

  selectedWorkspace: WorkspaceType = new WorkspaceType();
  selectedDashboard: DashboardType = new DashboardType();
  selectedReport: ReportType = new ReportType();
  selectedTile: TileType = new TileType();

  embedType: EmbedType = EmbedType.REPORT;
  embedEnabled: boolean = false;

  workspaces: { [id: string]: WorkspaceType } = {};
  dashboards: { [id: string]: DashboardType } = {};
  reports: { [id: string]: ReportType } = {};
  tiles: { [id: string]: TileType } = {};

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

  constructor(private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    public profile: UserprofileService,
    private http: HttpClient) {
  }

  /**
   * Initialization of the component. This will load the users profile using the Microsoft Graph API and
   * query the workspaces from Power BI.
   */
  ngOnInit(): void {
    // Enables the PowerBI client (allowing the embedding of reports)
    this.powerbi = new service.Service(factories.hpmFactory, factories.wpmpFactory, factories.routerFactory);
    // Trigger the user-profile service to load the profile information using MS Graph. 
    this.profile.loadProfile();
    // Load the workspaces for the user that is currently logged on.
    this.loadWorkspaces();
  }

  resetWorkspaces() {
    this.workspaces = {};
    this.selectedWorkspace = new WorkspaceType();
  }

  resetDashboards() {
    this.dashboards = {};
    this.selectedDashboard = new DashboardType();    
  }

  resetTiles() {
    this.tiles = {};
    this.selectedTile = new TileType();
  }

  resetReports(){
    this.reports = {};
    this.selectedReport = new ReportType();
  }

  /**
   * This function is called when the component is initialized to load all workspaces.
   */
  loadWorkspaces() {
    this.http.get<any>(`${POWER_BI_API}groups`)
      .subscribe(groups => {
        this.resetWorkspaces();
        this.resetDashboards();
        this.resetReports();
        this.resetTiles();
        for (let gr of groups.value) {
          this.workspaces[gr.id] = gr;
        }
      })
  }

  /**
   * This function loads all dashboards for the currently selected workspace.
   */
  loadDashboards() {
    this.http.get<any>(`${POWER_BI_API}groups/${this.selectedWorkspace.id}/dashboards`)
      .subscribe(dashboards => {
        this.resetDashboards();
        this.resetTiles();
        for (let db of dashboards.value) {
          this.dashboards[db.id] = db;
        }
      });
  }

  /**
   * This function loads all reports.
   */
  loadReports() {
    this.http.get<any>(`${POWER_BI_API}groups/${this.selectedWorkspace.id}/reports`)
      .subscribe(reports => {
        this.resetReports();
        for (let rp of reports.value) {
          this.reports[rp.id] = rp;
        }
      });
  }

  /**
   * This function loads all tiles for the currently selected dashboard.
   */
  loadTiles() {
    this.http.get<any>(`${POWER_BI_API}groups/${this.selectedWorkspace.id}/dashboards/${this.selectedDashboard.id}/tiles`)
      .subscribe(tiles => {
        this.resetTiles();
        for (let tl of tiles.value) {
          this.tiles[tl.id] = tl;
        }
      });
  }

  /**
   * Handler for a change in the selected workspace. This one sets the selected workspace object
   * in the code and loads the dashboards.
   * 
   * @param event The Javascript event. 
   */
  selectedWorkspaceChanged(event: any) {
    this.selectedWorkspace = this.workspaces[event.target.value];
    console.log("Changed the workspace into: " + this.selectedWorkspace.name);
    this.loadDashboards();
    this.loadReports();
    this.updateEmbedEnable();
  }

  /**
   * Handler for a change in the selected dashboard. This one sets the selected dashboard object
   * in the code and loads the tiles.
   * 
   * @param event The Javascript event. 
   */
  selectedDashboardChanged(event: any) {
    this.selectedDashboard = this.dashboards[event.target.value];
    console.log("Changed the dashboard into: " + this.selectedDashboard.name);
    this.loadTiles();
    this.updateEmbedEnable();
  }

  /**
   * Handler for a change in the selected report. This one sets the selected report object.
   * 
   * @param event The Javascript event. 
   */
   selectedReportChanged(event: any) {
    this.selectedReport = this.reports[event.target.value];
    this.updateEmbedEnable();
  }

  /**
   * Handler for a change in the selected tile. This one sets the selected tile object.
   * 
   * @param event The Javascript event. 
   */
   selectedTileChanged(event: any) {
    this.selectedTile = this.tiles[event.target.value];
    this.updateEmbedEnable();
  }

  /**
   * Handler for a change in the selected embedding type. This one sets the {@link embed_type} value.
   * 
   * @param embed_type The embed type value as string. 
   */
   embedTypeChanged(embed_type: string) {
    try {
      this.embedType = embed_type as EmbedType;
      this.loadWorkspaces();
      this.updateEmbedEnable();
    } catch {
      return;
    }
  }

  /**
   * This function is triggered by clicking the username on the page. It will log the current user out.
   */
  logout() {
    this.authService.logoutPopup({
      mainWindowRedirectUri: "/"
    });
  }

  updateEmbedEnable() {
    switch(this.embedType) {
      case EmbedType.DASHBOARD: {
        this.embedEnabled = this.selectedWorkspace.id.length > 0 && this.selectedDashboard.id.length > 0
        break;
      }
      case EmbedType.REPORT: {
        this.embedEnabled = this.selectedWorkspace.id.length > 0 && this.selectedReport.id.length > 0
        break;
      }
      case EmbedType.TILE: {
        this.embedEnabled = this.selectedWorkspace.id.length > 0 && this.selectedDashboard.id.length > 0 && this.selectedTile.id.length > 0
        break;
      }
      default: {
        this.embedEnabled = false;
      }
    }
  }

  /**
   * Handler for the embed button. This function prepares the requested dashboard, report or tile and
   * displays it.
   */
  doEmbedPowerBiItem(){
    this.authService.acquireTokenSilent({ scopes: ['https://analysis.windows.net/powerbi/api/.default'] }).subscribe(result => {
      let config: IEmbedConfiguration | undefined;
      switch(this.embedType) {
        case EmbedType.DASHBOARD: {
          config = {
            type: 'dashboard',
            accessToken: result.accessToken,
            embedUrl: this.selectedDashboard.embedUrl,
            id: this.selectedDashboard.id,
            tokenType: models.TokenType.Aad,
          }
          break;
        }
        case EmbedType.REPORT: {
          config = {
            type: 'report',
            accessToken: result.accessToken,
            embedUrl: this.selectedReport.embedUrl,
            id: this.selectedReport.id,
            tokenType: models.TokenType.Aad,
          }
          break;
        }
        case EmbedType.TILE: {
          config = {
            type: 'tile',
            accessToken: result.accessToken,
            embedUrl: this.selectedTile.embedUrl,
            id: this.selectedTile.id,
            dashboardId: this.selectedDashboard.id,
            tokenType: models.TokenType.Aad,
          }
          break;
        }
        default: {
          console.log('Nothing to render')
        }
      }

      this.powerbi.reset(this.container.nativeElement);
      this.powerbi.embed(this.container.nativeElement, config)
    });
  }
}