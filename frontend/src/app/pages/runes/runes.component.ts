import { Component } from '@angular/core';

@Component({
  selector: 'app-runes',
  standalone: true,
  template: `
    <div class="coming-soon">
      <div class="cs-icon">💎</div>
      <h2>Tri automatique de Runes</h2>
      <p>Cette fonctionnalité arrive bientôt.<br>Analyse et tri de tes runes par set, stats et efficacité.</p>
      <span class="cs-badge">Bientôt disponible</span>
    </div>
  `,
  styles: [`
    .coming-soon {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      gap: 16px;
      text-align: center;
      padding: 40px 24px;
    }
    .cs-icon { font-size: 64px; }
    h2 {
      font-family: 'Rajdhani', sans-serif;
      font-size: 26px;
      font-weight: 700;
      color: var(--text);
      letter-spacing: .04em;
    }
    p { color: var(--text2); font-size: 15px; line-height: 1.6; }
    .cs-badge {
      background: var(--bg3);
      border: .5px solid var(--border2);
      color: var(--text3);
      font-size: 12px;
      font-weight: 700;
      font-family: 'Rajdhani', sans-serif;
      letter-spacing: .08em;
      text-transform: uppercase;
      padding: 6px 16px;
      border-radius: 20px;
    }
  `]
})
export class RunesComponent {}
