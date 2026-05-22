import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      [attr.class]="'swc-logo ' + (animated ? 'swc-logo--animated' : '')"
      role="img"
      aria-label="Summoners War Companion logo">
      <defs>
        <radialGradient id="swcBg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#1c2030"/>
          <stop offset="100%" stop-color="#08090d"/>
        </radialGradient>
        <linearGradient id="swcBlade" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stop-color="#dce9ff"/>
          <stop offset="45%" stop-color="#4f8ef7"/>
          <stop offset="100%" stop-color="#9b5cf0"/>
        </linearGradient>
        <linearGradient id="swcRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stop-color="#e8643a"/>
          <stop offset="25%"  stop-color="#3a8fe8"/>
          <stop offset="50%"  stop-color="#3ab870"/>
          <stop offset="75%"  stop-color="#d4a83a"/>
          <stop offset="100%" stop-color="#9b5cf0"/>
        </linearGradient>
        <filter id="swcGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feFlood flood-color="#4f8ef7" flood-opacity="0.6" result="color"/>
          <feComposite in="color" in2="blur" operator="in" result="glow"/>
          <feComposite in="SourceGraphic" in2="glow" operator="over"/>
        </filter>
        <filter id="swcFireGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="blur"/>
          <feFlood flood-color="#e8643a" flood-opacity="0.7" result="color"/>
          <feComposite in="color" in2="blur" operator="in" result="glow"/>
          <feComposite in="SourceGraphic" in2="glow" operator="over"/>
        </filter>
        <filter id="swcWaterGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="blur"/>
          <feFlood flood-color="#3a8fe8" flood-opacity="0.7" result="color"/>
          <feComposite in="color" in2="blur" operator="in" result="glow"/>
          <feComposite in="SourceGraphic" in2="glow" operator="over"/>
        </filter>
        <filter id="swcWindGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="blur"/>
          <feFlood flood-color="#3ab870" flood-opacity="0.7" result="color"/>
          <feComposite in="color" in2="blur" operator="in" result="glow"/>
          <feComposite in="SourceGraphic" in2="glow" operator="over"/>
        </filter>
        <filter id="swcLightGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="blur"/>
          <feFlood flood-color="#d4a83a" flood-opacity="0.7" result="color"/>
          <feComposite in="color" in2="blur" operator="in" result="glow"/>
          <feComposite in="SourceGraphic" in2="glow" operator="over"/>
        </filter>
        <filter id="swcDarkGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="blur"/>
          <feFlood flood-color="#9b5cf0" flood-opacity="0.7" result="color"/>
          <feComposite in="color" in2="blur" operator="in" result="glow"/>
          <feComposite in="SourceGraphic" in2="glow" operator="over"/>
        </filter>
      </defs>

      <!-- Outer glow ring (rainbow gradient) -->
      <circle cx="100" cy="100" r="96" fill="none"
              stroke="url(#swcRing)" stroke-width="2.5" opacity="0.55"/>

      <!-- Main background circle -->
      <circle cx="100" cy="100" r="90" fill="url(#swcBg)"/>

      <!-- Inner decorative ring -->
      <circle cx="100" cy="100" r="78" fill="none"
              stroke="rgba(79,142,247,0.18)" stroke-width="1"/>

      <!-- Cross-hatch rune marks on inner ring (8 positions) -->
      <line x1="100" y1="22" x2="100" y2="28" stroke="rgba(79,142,247,0.35)" stroke-width="1.5"/>
      <line x1="156" y1="44" x2="152" y2="48" stroke="rgba(79,142,247,0.25)" stroke-width="1.2"/>
      <line x1="178" y1="100" x2="172" y2="100" stroke="rgba(79,142,247,0.35)" stroke-width="1.5"/>
      <line x1="156" y1="156" x2="152" y2="152" stroke="rgba(79,142,247,0.25)" stroke-width="1.2"/>
      <line x1="100" y1="178" x2="100" y2="172" stroke="rgba(79,142,247,0.35)" stroke-width="1.5"/>
      <line x1="44"  y1="156" x2="48"  y2="152" stroke="rgba(79,142,247,0.25)" stroke-width="1.2"/>
      <line x1="22"  y1="100" x2="28"  y2="100" stroke="rgba(79,142,247,0.35)" stroke-width="1.5"/>
      <line x1="44"  y1="44"  x2="48"  y2="48"  stroke="rgba(79,142,247,0.25)" stroke-width="1.2"/>

      <!-- ======= ELEMENT ORBS (pentagon, radius 65 from center) ======= -->
      <!-- Fire  (top,         -90°)  → (100, 35)  -->
      <!-- Water (top-right,   -18°)  → (162, 80)  -->
      <!-- Wind  (bottom-right, 54°)  → (138, 153) -->
      <!-- Light (bottom-left, 126°)  → (62,  153) -->
      <!-- Dark  (top-left,   198°)   → (38,   80) -->

      <!-- Fire orb -->
      <circle cx="100" cy="35" r="9" fill="#e8643a" filter="url(#swcFireGlow)"/>
      <circle cx="100" cy="35" r="5" fill="#ffb08a" opacity="0.8"/>

      <!-- Water orb -->
      <circle cx="162" cy="80" r="9" fill="#3a8fe8" filter="url(#swcWaterGlow)"/>
      <circle cx="162" cy="80" r="5" fill="#a0cfff" opacity="0.8"/>

      <!-- Wind orb -->
      <circle cx="138" cy="153" r="9" fill="#3ab870" filter="url(#swcWindGlow)"/>
      <circle cx="138" cy="153" r="5" fill="#96e8bf" opacity="0.8"/>

      <!-- Light orb -->
      <circle cx="62" cy="153" r="9" fill="#d4a83a" filter="url(#swcLightGlow)"/>
      <circle cx="62" cy="153" r="5" fill="#ffe090" opacity="0.8"/>

      <!-- Dark orb -->
      <circle cx="38" cy="80" r="9" fill="#9b5cf0" filter="url(#swcDarkGlow)"/>
      <circle cx="38" cy="80" r="5" fill="#d4aaff" opacity="0.8"/>

      <!-- Thin connecting lines between orbs (pentagon) -->
      <polygon points="100,35 162,80 138,153 62,153 38,80"
               fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>

      <!-- ======= SWORD (centered, vertical) ======= -->
      <!-- Blade - slim diamond taper from tip (100,52) to base (100,106) -->
      <path d="M100 52 C103 60 106 78 106 98 L100 106 L94 98 C94 78 97 60 100 52 Z"
            fill="url(#swcBlade)" filter="url(#swcGlow)" opacity="0.95"/>

      <!-- Blade center fuller (groove) -->
      <line x1="100" y1="58" x2="100" y2="100"
            stroke="rgba(255,255,255,0.35)" stroke-width="1"/>

      <!-- Guard / crossguard -->
      <path d="M80 106 C84 102 92 100 100 100 C108 100 116 102 120 106
               L120 112 C116 116 108 114 100 114 C92 114 84 116 80 112 Z"
            fill="#6070a0" opacity="0.9"/>
      <!-- Guard gem center -->
      <ellipse cx="100" cy="109" rx="5" ry="4" fill="url(#swcBlade)" opacity="0.8"/>

      <!-- Grip / handle -->
      <rect x="97" y="114" width="6" height="26" rx="3" fill="#3a4060"/>
      <!-- Grip wrapping lines -->
      <line x1="97" y1="119" x2="103" y2="119" stroke="rgba(255,255,255,0.2)" stroke-width="0.8"/>
      <line x1="97" y1="124" x2="103" y2="124" stroke="rgba(255,255,255,0.2)" stroke-width="0.8"/>
      <line x1="97" y1="129" x2="103" y2="129" stroke="rgba(255,255,255,0.2)" stroke-width="0.8"/>
      <line x1="97" y1="134" x2="103" y2="134" stroke="rgba(255,255,255,0.2)" stroke-width="0.8"/>

      <!-- Pommel -->
      <circle cx="100" cy="144" r="8" fill="#4f8ef7" filter="url(#swcGlow)" opacity="0.9"/>
      <circle cx="100" cy="144" r="4" fill="#dce9ff" opacity="0.9"/>

      <!-- Blade tip glow orb -->
      <circle cx="100" cy="55" r="5" fill="white" opacity="0.9" filter="url(#swcGlow)"/>
      <circle cx="100" cy="55" r="2.5" fill="#dce9ff"/>

      <!-- Sparkles -->
      <text x="72"  y="75"  fill="#4f8ef7" font-size="10" opacity="0.45" font-family="serif">✦</text>
      <text x="126" y="128" fill="#9b5cf0" font-size="8"  opacity="0.4"  font-family="serif">✦</text>
      <text x="74"  y="130" fill="#d4a83a" font-size="7"  opacity="0.35" font-family="serif">✦</text>
    </svg>
  `,
  styles: [`
    :host { display: inline-flex; }
    .swc-logo { display: block; }
    .swc-logo--animated circle,
    .swc-logo--animated path { }
  `]
})
export class LogoComponent {
  @Input() size: number = 64;
  @Input() animated: boolean = false;
}
