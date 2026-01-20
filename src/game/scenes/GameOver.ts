import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor()
    {
        super('GameOver');
    }

    create(data: { score: number; easterEgg: boolean })
    {
        const score = data?.score || 0;
        const easterEgg = data?.easterEgg || false;
        
        // Fond ciel Minecraft
        this.cameras.main.setBackgroundColor(0x87CEEB);
        
        // Sol
        for (let x = 0; x < 1024; x += 32) {
            this.add.rectangle(x + 16, 700, 32, 32, 0x5D8C3E).setStrokeStyle(2, 0x4A7030);
            this.add.rectangle(x + 16, 732, 32, 32, 0x8B5A2B).setStrokeStyle(2, 0x6B4423);
            this.add.rectangle(x + 16, 764, 32, 32, 0x8B5A2B).setStrokeStyle(2, 0x6B4423);
        }
        
        // Nuages
        this.createCloud(100, 60);
        this.createCloud(400, 90);
        this.createCloud(750, 50);
        
        // Confetti style Minecraft (blocs qui tombent)
        for (let i = 0; i < 30; i++) {
            const block = this.add.rectangle(
                Phaser.Math.Between(0, 1024),
                Phaser.Math.Between(-200, 0),
                16, 16,
                Phaser.Math.RND.pick([0xFFC829, 0x00915A, 0x00A4EF, 0xFF6B6B, 0x5CB85C])
            );
            block.setStrokeStyle(2, 0x000000);
            
            this.tweens.add({
                targets: block,
                y: 680,
                rotation: Phaser.Math.Between(0, 6),
                duration: Phaser.Math.Between(3000, 6000),
                delay: Phaser.Math.Between(0, 2000),
                repeat: -1
            });
        }
        
        // Bannière victoire style Minecraft
        const bannerBg = this.add.rectangle(512, 80, 500, 60, 0x8B4513);
        bannerBg.setStrokeStyle(4, 0x000000);
        
        this.add.text(512, 80, '⚔️ VICTOIRE ! ⚔️', {
            fontFamily: 'Courier New, monospace',
            fontSize: '36px',
            color: '#FFC829',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);
        
        // Certificat style parchemin Minecraft
        const certBg = this.add.rectangle(512, 350, 650, 380, 0xF5DEB3);
        certBg.setStrokeStyle(6, 0x8B4513);
        
        // Décoration du certificat
        this.add.rectangle(512, 180, 600, 8, 0x8B4513);
        this.add.rectangle(512, 520, 600, 8, 0x8B4513);
        
        this.add.text(512, 200, '📜 CERTIFICAT 📜', {
            fontFamily: 'Courier New, monospace',
            fontSize: '28px',
            color: '#8B4513',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        this.add.text(512, 250, 'DocuSign Academy', {
            fontFamily: 'Courier New, monospace',
            fontSize: '20px',
            color: '#1A3D6D'
        }).setOrigin(0.5);
        
        this.add.text(512, 290, 'EXPERT SAAS', {
            fontFamily: 'Courier New, monospace',
            fontSize: '32px',
            color: '#00915A',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Score avec icône
        this.add.text(512, 360, `⭐ SCORE: ${score} ⭐`, {
            fontFamily: 'Courier New, monospace',
            fontSize: '28px',
            color: '#FFC829',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Badges collectés
        let badges = '🏆 Accueil | 💻 Tech | ⚖️ Legal';
        if (easterEgg) {
            badges += '\n\n🎉 EASTER EGG: OCP SaaS rocks! 🎉';
        }
        
        this.add.text(512, 420, badges, {
            fontFamily: 'Courier New, monospace',
            fontSize: '14px',
            color: '#555555'
        }).setOrigin(0.5);
        
        // Logo BNP
        try {
            const bnpLogo = this.add.image(350, 490, 'bnp-logo');
            bnpLogo.setScale(0.08);
        } catch {
            this.createPixelBNPLogo(350, 490);
        }
        
        // Logos partenaires
        this.add.text(512, 490, '💚 BNP | 🔷 Azure | 📝 DocuSign', {
            fontFamily: 'Courier New, monospace',
            fontSize: '12px',
            color: '#888888'
        }).setOrigin(0.5);
        
        // Message fun
        const funMessages = [
            "⛏️ Tu as miné toutes les connaissances SaaS !",
            "🏗️ Tu as crafté ton expertise cloud !",
            "💎 Tu as trouvé le diamant DocuSign !",
            "🚀 Prêt pour la migration vers Azure !"
        ];
        
        this.add.text(512, 570, Phaser.Math.RND.pick(funMessages), {
            fontFamily: 'Courier New, monospace',
            fontSize: '16px',
            color: '#00A4EF',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Bouton REJOUER style Minecraft
        const replayBg = this.add.rectangle(512, 630, 200, 50, 0x5CB85C);
        replayBg.setStrokeStyle(4, 0x000000);
        replayBg.setInteractive({ useHandCursor: true });
        
        const replayText = this.add.text(512, 630, '🔄 REJOUER', {
            fontFamily: 'Courier New, monospace',
            fontSize: '20px',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        replayBg.on('pointerover', () => {
            replayBg.setFillStyle(0x7DCE7D);
            replayText.setScale(1.1);
        });
        replayBg.on('pointerout', () => {
            replayBg.setFillStyle(0x5CB85C);
            replayText.setScale(1);
        });
        replayBg.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
        
        // Contrôles clavier
        this.input.keyboard?.once('keydown-SPACE', () => this.scene.start('MainMenu'));
        this.input.keyboard?.once('keydown-ENTER', () => this.scene.start('MainMenu'));
        
        // Hackathon banner en bas
        this.add.text(512, 750, '⚔️ HACKATHON 2026 - ÉQUIPE VERTE ⚔️', {
            fontFamily: 'Courier New, monospace',
            fontSize: '14px',
            color: '#00915A',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
    }

    createCloud(x: number, y: number)
    {
        const blocks = [
            { dx: 0, dy: 0 }, { dx: 24, dy: 0 }, { dx: 48, dy: 0 },
            { dx: 12, dy: -16 }, { dx: 36, dy: -16 }
        ];
        blocks.forEach(b => {
            this.add.rectangle(x + b.dx, y + b.dy, 24, 16, 0xFFFFFF, 0.9);
        });
    }

    createPixelBNPLogo(x: number, y: number)
    {
        const bg = this.add.rectangle(x, y, 40, 40, 0x00915A);
        bg.setStrokeStyle(2, 0x006B42);
        [{ dx: 5, dy: -5 }, { dx: -8, dy: 3 }, { dx: 3, dy: 8 }].forEach(p => {
            this.add.star(x + p.dx, y + p.dy, 4, 2, 5, 0xFFFFFF);
        });
    }
}
