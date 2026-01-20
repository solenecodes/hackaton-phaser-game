import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        // Fond style Minecraft (dirt)
        this.cameras.main.setBackgroundColor(0x8B5A2B);

        // Barre de progression style Minecraft
        const barBg = this.add.rectangle(512, 384, 474, 38, 0x373737);
        barBg.setStrokeStyle(4, 0x000000);
        
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0x5CB85C);

        // Texte pixelisé
        this.add.text(512, 330, '⛏️ CHARGEMENT...', {
            fontFamily: 'Courier New, monospace',
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.load.on('progress', (progress: number) => {
            bar.width = 4 + (460 * progress);
        });
    }

    preload ()
    {
        this.load.setPath('assets');
        this.load.image('logo', 'logo.png');
        this.load.svg('bnp-logo', 'bnp-logo.svg', { width: 64, height: 64 });
    }

    create ()
    {
        this.scene.start('MainMenu');
    }
}
