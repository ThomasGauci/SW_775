import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { LogoComponent } from '../../components/logo/logo.component';

interface Feature {
  icon: string;
  title: string;
  desc: string;
  tag?: string;
  color: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, CommonModule, LogoComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  readonly authService = inject(AuthService);

  readonly features: Feature[] = [
    {
      icon: '📥',
      title: 'Import de compte',
      desc: 'Chargez votre fichier SW Exporter pour synchroniser instantanément vos monstres, runes et artefacts.',
      tag: 'Nouveau',
      color: 'accent',
    },
    {
      icon: '⚔️',
      title: 'Siege Tracker',
      desc: 'Enregistrez vos attaques, consultez votre historique et analysez vos statistiques de victoire par monstre et par équipe.',
      color: 'fire',
    },
    {
      icon: '🐉',
      title: 'Collection Monstres',
      desc: 'Retrouvez tous vos monstres avec leur niveau, leur statut d\'éveil et le niveau de leurs compétences.',
      color: 'wind',
    },
    {
      icon: '💎',
      title: 'Gestionnaire Runes',
      desc: 'Explorez et filtrez vos runes par set, slot ou stat. Score d\'efficacité calculé selon la formule SWOP.',
      color: 'water',
    },
    {
      icon: '🔮',
      title: 'Gestionnaire Artefacts',
      desc: 'Visualisez vos artefacts par type, attribut et style avec leur efficacité et filtres par effets secondaires.',
      color: 'dark',
    },
  ];

  readonly stats = [
    { value: '1 900+', label: 'monstres connus' },
    { value: '5',      label: 'éléments' },
    { value: '25',     label: 'sets de runes' },
    { value: '100%',   label: 'gratuit' },
  ];
}
