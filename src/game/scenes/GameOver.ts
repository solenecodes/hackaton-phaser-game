import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor()
    {
        super('GameOver');
    }

    create(data: { score: number; easterEgg: boolean; categoryScores?: { [key: string]: { correct: number; total: number; points: number } } })
    {
        const score = data?.score || 0;
        const easterEgg = data?.easterEgg || false;
        const categoryScores = data?.categoryScores || {};
        
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
        
        this.add.text(512, 250, 'SaaS Academy', {
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
        
        // === TABLEAU DES SCORES PAR CATÉGORIE ===
        const tableY = 330;
        
        // En-tête du tableau
        this.add.rectangle(512, tableY, 500, 30, 0x8B4513);
        this.add.text(200, tableY, 'CATÉGORIE', { fontFamily: 'Courier New', fontSize: '12px', color: '#FFFFFF' }).setOrigin(0, 0.5);
        this.add.text(380, tableY, 'RÉPONSES', { fontFamily: 'Courier New', fontSize: '12px', color: '#FFFFFF' }).setOrigin(0, 0.5);
        this.add.text(520, tableY, 'POINTS', { fontFamily: 'Courier New', fontSize: '12px', color: '#FFFFFF' }).setOrigin(0, 0.5);
        this.add.text(620, tableY, 'BONUS', { fontFamily: 'Courier New', fontSize: '12px', color: '#FFFFFF' }).setOrigin(0, 0.5);
        
        // Lignes du tableau
        const categories = [
            { name: 'Florine', icon: '🏠', role: 'Accueil / Bases SaaS' },
            { name: 'Damien', icon: '💻', role: 'Tech / Infrastructure' },
            { name: 'Christophe', icon: '⚖️', role: 'Cloud / Microsoft' }
        ];
        
        categories.forEach((cat, i) => {
            const y = tableY + 35 + (i * 32);
            const catScore = categoryScores[cat.name] || { correct: 0, total: 3, points: 0 };
            const isPerfect = catScore.correct === catScore.total;
            const rowColor = i % 2 === 0 ? 0xFFF8DC : 0xF5DEB3;
            
            this.add.rectangle(512, y, 500, 28, rowColor);
            this.add.text(200, y, `${cat.icon} ${cat.name}`, { fontFamily: 'Courier New', fontSize: '11px', color: '#333' }).setOrigin(0, 0.5);
            this.add.text(380, y, `${catScore.correct}/${catScore.total}`, { fontFamily: 'Courier New', fontSize: '11px', color: isPerfect ? '#00915A' : '#333' }).setOrigin(0, 0.5);
            this.add.text(520, y, `${catScore.correct * 10} pts`, { fontFamily: 'Courier New', fontSize: '11px', color: '#333' }).setOrigin(0, 0.5);
            this.add.text(620, y, isPerfect ? '✅ +50' : '—', { fontFamily: 'Courier New', fontSize: '11px', color: isPerfect ? '#00915A' : '#999' }).setOrigin(0, 0.5);
        });
        
        // Ligne Easter Egg si trouvé
        if (easterEgg) {
            const eggY = tableY + 35 + (3 * 32);
            this.add.rectangle(512, eggY, 500, 28, 0xFFE4B5);
            this.add.text(200, eggY, '🤖 CloudBot', { fontFamily: 'Courier New', fontSize: '11px', color: '#FF6B6B' }).setOrigin(0, 0.5);
            this.add.text(380, eggY, 'EASTER EGG', { fontFamily: 'Courier New', fontSize: '11px', color: '#FF6B6B' }).setOrigin(0, 0.5);
            this.add.text(520, eggY, '—', { fontFamily: 'Courier New', fontSize: '11px', color: '#999' }).setOrigin(0, 0.5);
            this.add.text(620, eggY, '🎉 +100', { fontFamily: 'Courier New', fontSize: '11px', color: '#FF6B6B' }).setOrigin(0, 0.5);
        }
        
        // Score total
        const totalY = tableY + 35 + ((easterEgg ? 4 : 3) * 32) + 10;
        this.add.rectangle(512, totalY, 500, 35, 0x00915A);
        this.add.text(200, totalY, '⭐ SCORE TOTAL', { fontFamily: 'Courier New', fontSize: '14px', color: '#FFFFFF' }).setOrigin(0, 0.5);
        this.add.text(520, totalY, `${score} pts`, { fontFamily: 'Courier New', fontSize: '16px', color: '#FFC829' }).setOrigin(0, 0.5);
        
        // Bouton REJOUER style Minecraft
        const replayBg = this.add.rectangle(512, totalY + 55, 200, 50, 0x5CB85C);
        replayBg.setStrokeStyle(4, 0x000000);
        replayBg.setInteractive({ useHandCursor: true });
        
        const replayText = this.add.text(512, totalY + 55, '🔄 REJOUER', {
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
        
        // Message "Tu as crafté ton expertise cloud" EN DESSOUS du bouton
        this.add.text(512, totalY + 105, '🏗️ Tu as crafté ton expertise cloud ! 🏗️', {
            fontFamily: 'Courier New, monospace',
            fontSize: '14px',
            color: '#00A4EF',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
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
