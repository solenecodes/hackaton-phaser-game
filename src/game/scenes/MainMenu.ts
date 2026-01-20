import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene
{
    constructor()
    {
        super('MainMenu');
    }

    create()
    {
        // Fond style Minecraft (ciel + herbe)
        this.cameras.main.setBackgroundColor(0x87CEEB);
        
        // Sol en herbe (blocs)
        for (let x = 0; x < 1024; x += 32) {
            this.add.rectangle(x + 16, 700, 32, 32, 0x5D8C3E).setStrokeStyle(2, 0x4A7030);
            this.add.rectangle(x + 16, 732, 32, 32, 0x8B5A2B).setStrokeStyle(2, 0x6B4423);
            this.add.rectangle(x + 16, 764, 32, 32, 0x8B5A2B).setStrokeStyle(2, 0x6B4423);
        }
        
        // Nuages pixelisés
        this.createCloud(100, 80);
        this.createCloud(400, 120);
        this.createCloud(750, 60);
        this.createCloud(900, 140);

        // Logo BNP en style pixel (essaye de charger l'image, sinon affiche en blocs)
        try {
            const bnpLogo = this.add.image(150, 100, 'bnp-logo');
            bnpLogo.setScale(0.15);
            bnpLogo.setOrigin(0.5);
        } catch {
            // Fallback: Logo BNP en blocs pixels
            this.createPixelBNPLogo(150, 100);
        }

        // Bannière Hackathon style Minecraft
        const bannerBg = this.add.rectangle(512, 50, 600, 50, 0x8B5A2B);
        bannerBg.setStrokeStyle(4, 0x000000);
        
        this.add.text(512, 50, '⚔️ HACKATHON 2026 - ÉQUIPE VERTE ⚔️', {
            fontFamily: 'Courier New, monospace',
            fontSize: '20px',
            color: '#5CB85C',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Titre principal style Minecraft
        const titleBg = this.add.rectangle(512, 200, 700, 120, 0x000000, 0.7);
        titleBg.setStrokeStyle(4, 0x5CB85C);

        this.add.text(512, 160, '📝 SaaS', {
            fontFamily: 'Courier New, monospace',
            fontSize: '48px',
            color: '#FFC829',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(512, 220, '⛏️ ACADEMY ⛏️', {
            fontFamily: 'Courier New, monospace',
            fontSize: '56px',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        // Sous-titre
        this.add.text(512, 300, 'Explore le monde SaaS !', {
            fontFamily: 'Courier New, monospace',
            fontSize: '18px',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Instructions style Minecraft
        const instructBg = this.add.rectangle(512, 400, 500, 80, 0x373737);
        instructBg.setStrokeStyle(3, 0x000000);

        this.add.text(512, 385, '🎮 ZQSD ou FLÈCHES pour bouger', {
            fontFamily: 'Courier New, monospace',
            fontSize: '14px',
            color: '#AAAAAA'
        }).setOrigin(0.5);

        this.add.text(512, 415, '🗣️ ESPACE pour parler aux PNJ', {
            fontFamily: 'Courier New, monospace',
            fontSize: '14px',
            color: '#AAAAAA'
        }).setOrigin(0.5);

        // Bouton JOUER style Minecraft
        const playBtn = this.add.rectangle(512, 520, 300, 60, 0x5CB85C);
        playBtn.setStrokeStyle(4, 0x000000);
        playBtn.setInteractive({ useHandCursor: true });

        const playText = this.add.text(512, 520, '▶ JOUER', {
            fontFamily: 'Courier New, monospace',
            fontSize: '32px',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Hover effect style Minecraft
        playBtn.on('pointerover', () => {
            playBtn.setFillStyle(0x7DCE7D);
            playText.setScale(1.1);
        });
        playBtn.on('pointerout', () => {
            playBtn.setFillStyle(0x5CB85C);
            playText.setScale(1);
        });
        playBtn.on('pointerdown', () => {
            playBtn.setFillStyle(0x4A9C4A);
            this.scene.start('Game');
        });

        // Crédits en bas
        this.add.text(512, 620, '💚 BNP Paribas | 🔷 Microsoft Azure | 📝 SaaS', {
            fontFamily: 'Courier New, monospace',
            fontSize: '14px',
            color: '#555555',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Personnage Minecraft animé
        this.createMinecraftPlayer(800, 580, true);

        // Contrôles clavier
        this.input.keyboard?.once('keydown-SPACE', () => this.scene.start('Game'));
        this.input.keyboard?.once('keydown-ENTER', () => this.scene.start('Game'));
    }

    createCloud(x: number, y: number)
    {
        // Nuage en blocs style Minecraft
        const blocks = [
            { dx: 0, dy: 0 }, { dx: 32, dy: 0 }, { dx: 64, dy: 0 },
            { dx: -16, dy: -20 }, { dx: 16, dy: -20 }, { dx: 48, dy: -20 }, { dx: 80, dy: -20 }
        ];
        blocks.forEach(b => {
            this.add.rectangle(x + b.dx, y + b.dy, 32, 24, 0xFFFFFF, 0.9);
        });
    }

    createPixelBNPLogo(x: number, y: number)
    {
        // Logo BNP simplifié en blocs (étoiles vertes)
        const green = 0x00915A;
        const white = 0xFFFFFF;
        
        // Fond vert
        this.add.rectangle(x, y, 80, 80, green).setStrokeStyle(3, 0x006B42);
        
        // Étoiles en blanc (simplifié)
        const starPositions = [
            { dx: 15, dy: -15 }, { dx: -20, dy: 0 }, { dx: 0, dy: 20 }, { dx: 20, dy: 10 }
        ];
        starPositions.forEach(pos => {
            this.add.star(x + pos.dx, y + pos.dy, 4, 4, 10, white);
        });
    }

    createMinecraftPlayer(x: number, y: number, animate: boolean = false)
    {
        // Tête (bloc de peau)
        const head = this.add.rectangle(x, y - 40, 24, 24, 0xFFCC99);
        head.setStrokeStyle(2, 0x000000);
        
        // Yeux
        this.add.rectangle(x - 5, y - 42, 4, 4, 0x000000);
        this.add.rectangle(x + 5, y - 42, 4, 4, 0x000000);
        
        // Corps (t-shirt bleu Microsoft)
        const body = this.add.rectangle(x, y - 10, 20, 28, 0x00A4EF);
        body.setStrokeStyle(2, 0x000000);
        
        // Jambes
        this.add.rectangle(x - 5, y + 15, 8, 20, 0x1A3D6D).setStrokeStyle(2, 0x000000);
        this.add.rectangle(x + 5, y + 15, 8, 20, 0x1A3D6D).setStrokeStyle(2, 0x000000);
        
        if (animate) {
            this.tweens.add({
                targets: [head, body],
                y: '-=5',
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        }
    }
}
