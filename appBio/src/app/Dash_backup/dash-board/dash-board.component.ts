import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-dash-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dash-board.component.html',
  styleUrls: ['../../assets/css/style.css'],
})
export class DashBoardComponent implements OnInit {
  userRole: string = '';
  username: string = '';
  private isBrowser: boolean;

  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      const userInfo = this.authService.getUserInfo();
      this.userRole = userInfo.role|| '';
      this.username = userInfo.username|| '';
      console.log('UserInfo loaded:', { username: this.username, role: this.userRole });

      // Suscribirse a cambios en el rol y username
      this.authService.userRole$.subscribe(role => {
        console.log('Role updated from service:', role);
        this.userRole = role|| '';
      });

      this.authService.username$.subscribe(username => {
        console.log('Username updated from service:', username);
        this.username = username|| '';
      });
    }
  }
}
