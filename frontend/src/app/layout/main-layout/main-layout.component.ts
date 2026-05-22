import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  soon?: boolean;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  readonly navItems: NavItem[] = [
    { path: 'siege',     label: 'Siege',     icon: '⚔️' },
    { path: 'runes',     label: 'Runes',     icon: '💎', soon: true },
    { path: 'artifacts', label: 'Artefacts', icon: '🔮', soon: true },
  ];

  constructor(readonly authService: AuthService) {}

  get username(): string {
    const user = this.authService.currentUser();
    return user?.username ?? user?.email ?? 'Joueur';
  }

  logout(): void {
    this.authService.logout();
  }
}
