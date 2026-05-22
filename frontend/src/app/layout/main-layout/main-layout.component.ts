import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { SwAccountService } from '../../core/services/sw-account.service';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  showDot?: boolean;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly swAccountService = inject(SwAccountService);

  readonly hasSWData = this.swAccountService.hasData;
  readonly wizardName = this.swAccountService.wizard;

  readonly navItems = computed<NavItem[]>(() => [
    { path: 'import',    label: 'Import',   icon: '📥', showDot: !this.hasSWData() },
    { path: 'siege',     label: 'Siege',    icon: '⚔️' },
    { path: 'monsters',  label: 'Monstres', icon: '🐉' },
    { path: 'runes',     label: 'Runes',    icon: '💎' },
    { path: 'artifacts', label: 'Artefacts', icon: '🔮' },
  ]);

  get username(): string {
    const user = this.authService.currentUser();
    return user?.username ?? user?.email ?? 'Joueur';
  }

  logout(): void {
    this.authService.logout();
  }
}
