import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export const POWER_BI_API = "https://api.powerbi.com/v1.0/myorg/";

type WorkspaceType = {
  id: string,
  isOnDedicatedCapacity: boolean,
  isReadOnly: boolean,
  type: string,
  name: string
};

@Injectable({
  providedIn: 'root'
})
export class PowerBiApiService {
  groups!: WorkspaceType[]

  constructor(private http: HttpClient
    ) 
    { }
  
    loadWorkspaces() {
      this.http.get<any>(POWER_BI_API + "groups")
      .subscribe(groups => {
        this.groups = groups['value'];
      })
    }
  }
  