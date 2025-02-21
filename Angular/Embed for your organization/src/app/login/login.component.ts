import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private authService: MsalService) { }

  ngOnInit(): void {
    // if signed in, go to the home screen
    if (this.authService.instance.getAllAccounts().length > 0) {
      this.goToHome();
    }
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

}
