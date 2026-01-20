import { Scene } from 'phaser';

export class Splash extends Scene
{
    constructor()
    {
        super('Splash');
    }

    create()
    {
        // Fond bleu dégradé style Hackathon OCP
        this.cameras.main.setBackgroundColor(0x2B7CD3);
        
        // Créer le splash screen programmatiquement
        // Fond avec dégradé
        const bg = this.add.rectangle(512, 384, 1024, 768, 0x1E5AAF);
        
        // Titre Hackathon OCP
        const title = this.add.text(512, 150, 'Hackathon OCP', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: '72px',
            color: '#FF1493',
            stroke: '#FFFFFF',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Sous-titre
        this.add.text(512, 230, '4 Teams | 4 Challenges', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: '36px',
            color: '#FFD700'
        }).setOrigin(0.5);
        
        // Logo Phaser stylisé (texte)
        this.add.text(200, 450, 'PHASER', {
            fontFamily: 'Impact, Arial Black, sans-serif',
            fontSize: '48px',
            color: '#00FFFF',
            stroke: '#000066',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Étoiles décoratives
        for (let i = 0; i < 50; i++) {
            const star = this.add.circle(
                Phaser.Math.Between(0, 1024),
                Phaser.Math.Between(0, 400),
                Phaser.Math.Between(1, 3),
                0xFFFFFF
            );
            this.tweens.add({
                targets: star,
                alpha: 0.3,
                duration: Phaser.Math.Between(500, 1500),
                yoyo: true,
                repeat: -1
            });
        }
        
        // Logo Phaser icône (losange)
        const phaserIcon = this.add.container(100, 650);
        phaserIcon.add(this.add.polygon(0, 0, [0, -40, 40, 0, 0, 40, -40, 0], 0x00BFFF));
        phaserIcon.add(this.add.polygon(0, 0, [0, -30, 30, 0, 0, 30, -30, 0], 0x0099CC));
        
        // Texte équipe
        this.add.text(512, 650, '🎮 ÉQUIPE VERTE - SaaS Academy 🎮', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#00FF00',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Animation du titre
        this.tweens.add({
            targets: title,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Fade in
        this.cameras.main.fadeIn(500);
        
        // Après 3 secondes, passer au Preloader
        this.time.delayedCall(3000, () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('Preloader');
            });
        });
        
        // Permettre de skip avec un clic ou ESPACE
        this.input.once('pointerdown', () => this.skipSplash());
        this.input.keyboard?.once('keydown-SPACE', () => this.skipSplash());
        this.input.keyboard?.once('keydown-ENTER', () => this.skipSplash());
    }
    
    skipSplash()
    {
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('Preloader');
        });
    }
}
