import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http"; // Import 

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { MsalModule, MsalRedirectComponent, MsalGuard, MsalInterceptor } from '@azure/msal-angular'; // Import MsalInterceptor
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { PowerBIEmbedModule } from 'powerbi-client-angular';
import { POWER_BI_API } from './home/home.component';
import { LoginComponent } from './login/login.component';


const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    HttpClientModule,
    PowerBIEmbedModule,
    MsalModule.forRoot(new PublicClientApplication({
      auth: {
        clientId: '<APPLICATION ID>',
        authority: 'https://login.microsoftonline.com/<AAD TENANT ID>'
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE,
      }
    }), {
      interactionType: InteractionType.Popup,
      authRequest: {
        scopes: ['user.read', 'https://analysis.windows.net/powerbi/api/Workspace.Read.All',
          'https://analysis.windows.net/powerbi/api/Dashboard.Read.All',
          'https://analysis.windows.net/powerbi/api/Report.Read.All']
      }
    }, {
      interactionType: InteractionType.Popup, // MSAL Interceptor Configuration
      protectedResourceMap: new Map([
        ['https://graph.microsoft.com/v1.0/me', ['user.read']],
        [POWER_BI_API + "*", ['https://analysis.windows.net/powerbi/api/Workspace.Read.All',
          'https://analysis.windows.net/powerbi/api/Dashboard.Read.All',
          'https://analysis.windows.net/powerbi/api/Report.Read.All']]
      ])
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    MsalGuard
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }