import { Scene } from 'phaser';
import { NPCs, NPC, EasterEggNPC, Question } from '../data/QuizData';

export class Game extends Scene
{
    // Player
    player: Phaser.GameObjects.Container;
    playerSpeed: number = 200;
    
    // Controls
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    wasd: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
    spaceKey: Phaser.Input.Keyboard.Key;
    
    // NPCs
    npcContainers: Phaser.GameObjects.Container[] = [];
    npcInteractionZones: Phaser.GameObjects.Arc[] = [];
    currentNPC: NPC | null = null;
    
    // UI
    dialogBox: Phaser.GameObjects.Rectangle;
    dialogText: Phaser.GameObjects.Text;
    optionTexts: Phaser.GameObjects.Text[] = [];
    optionBgs: Phaser.GameObjects.Rectangle[] = [];
    scoreText: Phaser.GameObjects.Text;
    hintText: Phaser.GameObjects.Text;
    exitButton: Phaser.GameObjects.Container;
    menuButton: Phaser.GameObjects.Container;
    instructionsPanel: Phaser.GameObjects.Container;
    nextButton: Phaser.GameObjects.Container;
    showingGreeting: boolean = false;
    
    // Game State
    score: number = 0;
    completedNPCs: Set<string> = new Set();
    isInDialog: boolean = false;
    currentQuestionIndex: number = 0;
    correctAnswers: number = 0;
    easterEggFound: boolean = false;
    showingInstructions: boolean = true;
    
    // Scores par catégorie
    categoryScores: { [key: string]: { correct: number; total: number; points: number } } = {};

    constructor()
    {
        super('Game');
    }

    create()
    {
        // Créer le monde style Kenney
        this.createKenneyWorld();
        
        // Créer les bâtiments pour chaque zone
        this.createBuildings();
        
        // Créer le joueur
        this.createPlayer();
        
        // Créer les NPCs
        this.createNPCs();
        
        // Créer l'interface utilisateur
        this.createUI();
        
        // Setup des contrôles
        this.setupControls();
        
        // Afficher les instructions de début
        this.showInstructions();
    }

    createKenneyWorld()
    {
        // Ciel avec dégradé (style Kenney - couleurs vives et propres)
        this.cameras.main.setBackgroundColor(0x5C94FC);
        
        // Logo BNP dans le ciel
        const bnpSkyLogo = this.add.image(900, 60, 'bnp-logo');
        bnpSkyLogo.setScale(0.8);
        bnpSkyLogo.setAlpha(0.9);
        bnpSkyLogo.setDepth(0);
        
        // Nuages style Kenney (ronds et doux)
        this.createKenneyCloud(100, 70, 1);
        this.createKenneyCloud(350, 50, 0.8);
        this.createKenneyCloud(600, 80, 1.2);
        this.createKenneyCloud(850, 40, 0.9);
        
        // Collines en arrière-plan
        this.add.ellipse(200, 680, 400, 200, 0x4CAF50).setDepth(0);
        this.add.ellipse(500, 700, 500, 250, 0x66BB6A).setDepth(0);
        this.add.ellipse(800, 680, 400, 200, 0x4CAF50).setDepth(0);
        
        // Sol principal (herbe style Kenney - propre et coloré)
        this.add.rectangle(512, 680, 1024, 160, 0x8BC34A).setDepth(1);
        this.add.rectangle(512, 760, 1024, 80, 0x6D4C41).setDepth(1); // Terre
        
        // Chemin central
        this.add.rectangle(512, 620, 800, 30, 0xBCAAA4).setDepth(2);
        this.add.rectangle(512, 620, 790, 20, 0xD7CCC8).setDepth(2);
        
        // Fleurs décoratives
        const flowerColors = [0xFF5722, 0xFFEB3B, 0xE91E63, 0x9C27B0];
        for (let i = 0; i < 15; i++) {
            const x = Phaser.Math.Between(50, 974);
            const y = Phaser.Math.Between(640, 660);
            this.createFlower(x, y, Phaser.Math.RND.pick(flowerColors));
        }
    }

    createKenneyCloud(x: number, y: number, scale: number)
    {
        // Nuages ronds style Kenney
        const cloud = this.add.container(x, y);
        cloud.add(this.add.ellipse(0, 0, 60 * scale, 40 * scale, 0xFFFFFF));
        cloud.add(this.add.ellipse(-30 * scale, 5, 40 * scale, 30 * scale, 0xFFFFFF));
        cloud.add(this.add.ellipse(30 * scale, 5, 40 * scale, 30 * scale, 0xFFFFFF));
        cloud.add(this.add.ellipse(0, -15 * scale, 40 * scale, 30 * scale, 0xFFFFFF));
        cloud.setDepth(0);
        
        // Animation douce
        this.tweens.add({
            targets: cloud,
            x: x + 20,
            duration: 3000 + Phaser.Math.Between(0, 2000),
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createFlower(x: number, y: number, color: number)
    {
        // Tige
        this.add.rectangle(x, y + 8, 3, 16, 0x388E3C).setDepth(2);
        // Pétales
        this.add.circle(x, y, 6, color).setDepth(3);
        this.add.circle(x, y, 3, 0xFFEB3B).setDepth(3);
    }

    createBuildings()
    {
        // === BÂTIMENT ACCUEIL (Gauche) - Style bureau moderne jaune ===
        this.createBuildingAccueil(170, 480);
        
        // === BÂTIMENT TECH (Centre) - Style tech moderne bleu ===
        this.createBuildingTech(512, 420);
        
        // === BÂTIMENT LEGAL (Droite) - Style officiel vert ===
        this.createBuildingLegal(854, 480);
    }

    createBuildingAccueil(x: number, y: number)
    {
        const container = this.add.container(x, y);
        
        // Bâtiment principal - Style accueillant
        const mainBuilding = this.add.rectangle(0, 0, 140, 120, 0xFFF3E0);
        mainBuilding.setStrokeStyle(3, 0xFF9800);
        container.add(mainBuilding);
        
        // Toit triangulaire
        const roof = this.add.triangle(0, -80, -80, 40, 0, -30, 80, 40, 0xFFB74D);
        roof.setStrokeStyle(3, 0xF57C00);
        container.add(roof);
        
        // Fenêtres
        [-35, 35].forEach(fx => {
            const window = this.add.rectangle(fx, -20, 30, 35, 0x81D4FA);
            window.setStrokeStyle(2, 0x5D4037);
            container.add(window);
            // Reflet
            container.add(this.add.rectangle(fx - 5, -25, 8, 15, 0xFFFFFF, 0.4));
        });
        
        // Porte d'entrée
        const door = this.add.rectangle(0, 35, 35, 50, 0x5D4037);
        door.setStrokeStyle(2, 0x3E2723);
        container.add(door);
        const doorKnob = this.add.circle(8, 35, 4, 0xFFD700);
        container.add(doorKnob);
        
        // Enseigne
        const signBg = this.add.rectangle(0, -110, 120, 28, 0xFFC107);
        signBg.setStrokeStyle(2, 0xFF8F00);
        container.add(signBg);
        const signText = this.add.text(0, -110, '🏠 ACCUEIL', {
            fontFamily: 'Arial Black',
            fontSize: '14px',
            color: '#5D4037'
        }).setOrigin(0.5);
        container.add(signText);
        
        // Lampe d'entrée
        container.add(this.add.circle(-50, 10, 8, 0xFFEB3B));
        container.add(this.add.rectangle(-50, 25, 4, 20, 0x424242));
        
        container.setDepth(3);
    }

    createBuildingTech(x: number, y: number)
    {
        const container = this.add.container(x, y);
        
        // Bâtiment principal - Style moderne tech
        const mainBuilding = this.add.rectangle(0, 10, 180, 160, 0xE3F2FD);
        mainBuilding.setStrokeStyle(3, 0x2196F3);
        container.add(mainBuilding);
        
        // Tour secondaire
        const tower = this.add.rectangle(60, -30, 50, 100, 0xBBDEFB);
        tower.setStrokeStyle(3, 0x1976D2);
        container.add(tower);
        
        // Grandes fenêtres vitrées
        const glassWall = this.add.rectangle(-30, 10, 80, 100, 0x4FC3F7, 0.6);
        glassWall.setStrokeStyle(2, 0x0288D1);
        container.add(glassWall);
        
        // Lignes de fenêtres
        for (let fy = -30; fy <= 50; fy += 25) {
            container.add(this.add.rectangle(-30, fy, 78, 2, 0x0288D1));
        }
        
        // Fenêtres tour
        [-50, -25, 0].forEach(fy => {
            const win = this.add.rectangle(60, fy, 25, 18, 0x81D4FA);
            win.setStrokeStyle(1, 0x0277BD);
            container.add(win);
        });
        
        // Porte moderne
        const door = this.add.rectangle(-30, 70, 40, 40, 0x263238);
        door.setStrokeStyle(2, 0x37474F);
        container.add(door);
        container.add(this.add.rectangle(-30, 70, 2, 35, 0x4FC3F7));
        
        // Antenne / Satellite
        container.add(this.add.rectangle(60, -90, 4, 30, 0x607D8B));
        container.add(this.add.circle(60, -105, 8, 0xF44336));
        
        // Animation lumière antenne
        const antennaLight = this.add.circle(60, -105, 8, 0xF44336);
        container.add(antennaLight);
        this.tweens.add({
            targets: antennaLight,
            alpha: 0.3,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
        
        // Enseigne
        const signBg = this.add.rectangle(0, -75, 140, 30, 0x2196F3);
        signBg.setStrokeStyle(2, 0x1565C0);
        container.add(signBg);
        const signText = this.add.text(0, -75, '💻 TECH CENTER', {
            fontFamily: 'Arial Black',
            fontSize: '14px',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        container.add(signText);
        
        // Logo cloud
        container.add(this.add.ellipse(80, 60, 30, 18, 0xFFFFFF, 0.8));
        
        container.setDepth(3);
    }

    createBuildingLegal(x: number, y: number)
    {
        const container = this.add.container(x, y);
        
        // Bâtiment principal - Style officiel/banque
        const mainBuilding = this.add.rectangle(0, 0, 140, 120, 0xE8F5E9);
        mainBuilding.setStrokeStyle(3, 0x4CAF50);
        container.add(mainBuilding);
        
        // Colonnes grecques
        [-45, -15, 15, 45].forEach(cx => {
            const column = this.add.rectangle(cx, 20, 12, 80, 0xFAFAFA);
            column.setStrokeStyle(2, 0x9E9E9E);
            container.add(column);
            // Base colonne
            container.add(this.add.rectangle(cx, 65, 18, 10, 0xE0E0E0));
            // Chapiteau
            container.add(this.add.rectangle(cx, -25, 18, 8, 0xE0E0E0));
        });
        
        // Fronton triangulaire
        const pediment = this.add.triangle(0, -70, -75, 30, 0, -15, 75, 30, 0xC8E6C9);
        pediment.setStrokeStyle(3, 0x388E3C);
        container.add(pediment);
        
        // Symbole balance/justice
        container.add(this.add.text(0, -60, '⚖️', { fontSize: '20px' }).setOrigin(0.5));
        
        // Porte officielle
        const door = this.add.rectangle(0, 40, 40, 50, 0x2E7D32);
        door.setStrokeStyle(2, 0x1B5E20);
        container.add(door);
        container.add(this.add.rectangle(0, 40, 2, 45, 0x81C784));
        
        // Fenêtres avec grilles
        [-35, 35].forEach(fx => {
            const win = this.add.rectangle(fx, -10, 25, 30, 0xA5D6A7);
            win.setStrokeStyle(2, 0x388E3C);
            container.add(win);
            // Grille
            container.add(this.add.rectangle(fx, -10, 1, 28, 0x1B5E20));
            container.add(this.add.rectangle(fx, -10, 23, 1, 0x1B5E20));
        });
        
        // Enseigne
        const signBg = this.add.rectangle(0, -100, 120, 28, 0x4CAF50);
        signBg.setStrokeStyle(2, 0x2E7D32);
        container.add(signBg);
        const signText = this.add.text(0, -100, '⚖️ LEGAL', {
            fontFamily: 'Arial Black',
            fontSize: '14px',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        container.add(signText);
        
        // Drapeaux
        container.add(this.add.rectangle(-60, -40, 3, 50, 0x5D4037));
        container.add(this.add.rectangle(-60, -60, 20, 12, 0x00915A));
        
        container.setDepth(3);
    }

    createPlayer()
    {
        this.player = this.add.container(512, 580);
        
        // Style Kenney - personnage rond et mignon
        // Corps
        const body = this.add.ellipse(0, 5, 28, 35, 0x00915A);
        body.setStrokeStyle(2, 0x1B5E20);
        
        // Tête
        const head = this.add.circle(0, -25, 18, 0xFFCC80);
        head.setStrokeStyle(2, 0xE65100);
        
        // Cheveux
        const hair = this.add.ellipse(0, -38, 24, 14, 0x5D4037);
        
        // Yeux
        const eyeL = this.add.ellipse(-6, -28, 6, 8, 0xFFFFFF);
        const eyeR = this.add.ellipse(6, -28, 6, 8, 0xFFFFFF);
        const pupilL = this.add.circle(-5, -27, 3, 0x1A237E);
        const pupilR = this.add.circle(7, -27, 3, 0x1A237E);
        
        // Sourire
        const smile = this.add.arc(0, -20, 8, 0, 180, false, 0xE65100);
        smile.setStrokeStyle(2, 0xBF360C);
        
        // Pieds
        const footL = this.add.ellipse(-8, 28, 12, 8, 0x3E2723);
        const footR = this.add.ellipse(8, 28, 12, 8, 0x3E2723);
        
        this.player.add([footL, footR, body, head, hair, eyeL, eyeR, pupilL, pupilR, smile]);
        this.player.setDepth(10);
        
        // Animation de marche
        this.tweens.add({
            targets: this.player,
            scaleY: 0.95,
            duration: 200,
            yoyo: true,
            repeat: -1
        });
    }

    createNPCs()
    {
        // NPCs principaux avec zones d'interaction visibles
        NPCs.forEach((npc, index) => {
            const container = this.createKenneyNPC(npc.x, npc.y, npc.color, npc.name, npc.role, 1, npc);
            this.npcContainers.push(container);
            
            // Zone d'interaction visuelle (cercle pulsant)
            const interactionZone = this.add.circle(npc.x, npc.y + 30, 50, npc.color, 0.15);
            interactionZone.setStrokeStyle(2, npc.color, 0.5);
            interactionZone.setDepth(4);
            this.npcInteractionZones.push(interactionZone);
            
            // Animation de pulsation
            this.tweens.add({
                targets: interactionZone,
                scale: 1.2,
                alpha: 0.05,
                duration: 1500,
                yoyo: true,
                repeat: -1
            });
            
            // Indicateur "Parler" au-dessus
            const talkIndicator = this.add.container(npc.x, npc.y - 80);
            const bubble = this.add.ellipse(0, 0, 60, 30, 0xFFFFFF);
            bubble.setStrokeStyle(2, 0x424242);
            const bubbleText = this.add.text(0, 0, '💬 ESPACE', {
                fontFamily: 'Arial',
                fontSize: '10px',
                color: '#424242'
            }).setOrigin(0.5);
            talkIndicator.add([bubble, bubbleText]);
            talkIndicator.setDepth(15);
            talkIndicator.setVisible(false);
            talkIndicator.setData('npcName', npc.name);
            
            // Animation flottante
            this.tweens.add({
                targets: talkIndicator,
                y: npc.y - 85,
                duration: 800,
                yoyo: true,
                repeat: -1
            });
        });
        
        // Easter Egg NPC (caché)
        const easterContainer = this.createKenneyNPC(
            EasterEggNPC.x, EasterEggNPC.y, 
            EasterEggNPC.color, '?', '', 
            0.6
        );
        this.npcContainers.push(easterContainer);
        
        this.tweens.add({
            targets: easterContainer,
            alpha: 0.4,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }

    createKenneyNPC(x: number, y: number, bodyColor: number, name: string, role: string, scale: number = 1, npcData?: any): Phaser.GameObjects.Container
    {
        const container = this.add.container(x, y);
        
        // Style Kenney - personnage rond
        // Pieds
        const footL = this.add.ellipse(-10 * scale, 30 * scale, 14 * scale, 10 * scale, 0x3E2723);
        const footR = this.add.ellipse(10 * scale, 30 * scale, 14 * scale, 10 * scale, 0x3E2723);
        
        // Corps
        const body = this.add.ellipse(0, 5 * scale, 30 * scale, 40 * scale, bodyColor);
        body.setStrokeStyle(2, 0x000000);
        
        // Logo BNP sur le t-shirt de Damien
        if (npcData?.hasLogo === 'bnp') {
            const bnpLogo = this.add.image(0, 5 * scale, 'bnp-logo');
            bnpLogo.setScale(0.35 * scale);
            bnpLogo.setOrigin(0.5);
            container.add(bnpLogo);
        }
        
        // Logo Microsoft si Christophe
        if (npcData?.hasLogo === 'microsoft') {
            const msRed = this.add.rectangle(-5 * scale, -2 * scale, 8 * scale, 8 * scale, 0xF25022);
            const msGreen = this.add.rectangle(5 * scale, -2 * scale, 8 * scale, 8 * scale, 0x7FBA00);
            const msBlue = this.add.rectangle(-5 * scale, 8 * scale, 8 * scale, 8 * scale, 0x00A4EF);
            const msYellow = this.add.rectangle(5 * scale, 8 * scale, 8 * scale, 8 * scale, 0xFFB900);
            container.add([msRed, msGreen, msBlue, msYellow]);
        }
        
        // Tête
        const skinColor = npcData?.skinColor || 0xFFCC80;
        const head = this.add.circle(0, -28 * scale, 20 * scale, skinColor);
        head.setStrokeStyle(2, 0xE65100);
        
        // Cheveux personnalisés
        const hairColor = npcData?.hairColor || 0x5D4037;
        let hair: Phaser.GameObjects.Shape;
        
        if (npcData?.hairStyle === 'blonde') {
            // Cheveux longs blonds pour Florine
            hair = this.add.ellipse(0, -40 * scale, 36 * scale, 22 * scale, hairColor);
            const hairSide1 = this.add.ellipse(-18 * scale, -25 * scale, 12 * scale, 30 * scale, hairColor);
            const hairSide2 = this.add.ellipse(18 * scale, -25 * scale, 12 * scale, 30 * scale, hairColor);
            container.add([hairSide1, hairSide2]);
        } else if (npcData?.hairStyle === 'short') {
            // Cheveux courts pour Damien
            hair = this.add.ellipse(0, -42 * scale, 28 * scale, 14 * scale, hairColor);
        } else {
            // Cheveux normaux
            hair = this.add.ellipse(0, -40 * scale, 30 * scale, 16 * scale, hairColor);
        }
        
        // Yeux
        const eyeL = this.add.ellipse(-7 * scale, -30 * scale, 7 * scale, 9 * scale, 0xFFFFFF);
        const eyeR = this.add.ellipse(7 * scale, -30 * scale, 7 * scale, 9 * scale, 0xFFFFFF);
        const pupilL = this.add.circle(-6 * scale, -29 * scale, 3 * scale, 0x212121);
        const pupilR = this.add.circle(8 * scale, -29 * scale, 3 * scale, 0x212121);
        
        // Sourire
        const smile = this.add.arc(0, -22 * scale, 10 * scale, 0, 180, false, 0xE65100);
        smile.setStrokeStyle(2, 0xBF360C);
        
        container.add([footL, footR, body, head, hair, eyeL, eyeR, pupilL, pupilR, smile]);
        
        // Badge avec nom
        if (name !== '?') {
            const badgeBg = this.add.rectangle(0, -60 * scale, 70 * scale, 22 * scale, 0xFFFFFF, 0.95);
            badgeBg.setStrokeStyle(2, bodyColor);
            const nameText = this.add.text(0, -60 * scale, name, {
                fontFamily: 'Arial Black',
                fontSize: `${12 * scale}px`,
                color: '#333333'
            }).setOrigin(0.5);
            container.add([badgeBg, nameText]);
            
            // Icône de rôle
            const roleIcon = role.includes('Accueil') ? '🏠' : role.includes('Tech') ? '💻' : role.includes('Conformité') ? '⚖️' : '👤';
            const icon = this.add.text(0, 35 * scale, roleIcon, { fontSize: `${20 * scale}px` }).setOrigin(0.5);
            container.add(icon);
        }
        
        container.setDepth(8);
        
        // Animation idle
        this.tweens.add({
            targets: container,
            y: y - 5,
            duration: 1200 + Phaser.Math.Between(0, 400),
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        return container;
    }

    createUI()
    {
        // === BOUTON MENU (toujours visible) ===
        this.menuButton = this.add.container(70, 30);
        const menuBg = this.add.rectangle(0, 0, 120, 35, 0x5D4037);
        menuBg.setStrokeStyle(2, 0x3E2723);
        const menuText = this.add.text(0, 0, '🏠 MENU', {
            fontFamily: 'Arial Black',
            fontSize: '14px',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        this.menuButton.add([menuBg, menuText]);
        this.menuButton.setDepth(100).setScrollFactor(0);
        menuBg.setInteractive({ useHandCursor: true });
        
        menuBg.on('pointerover', () => menuBg.setFillStyle(0x795548));
        menuBg.on('pointerout', () => menuBg.setFillStyle(0x5D4037));
        menuBg.on('pointerdown', () => this.scene.start('MainMenu'));
        
        // === SCORE ===
        const scoreBg = this.add.rectangle(930, 30, 160, 40, 0xFFC107);
        scoreBg.setStrokeStyle(3, 0xFF8F00);
        scoreBg.setDepth(100);
        
        this.scoreText = this.add.text(930, 30, '⭐ 0 pts', {
            fontFamily: 'Arial Black',
            fontSize: '18px',
            color: '#5D4037'
        }).setOrigin(0.5).setDepth(101).setScrollFactor(0);
        
        // === HINT TEXT (indication d'interaction) ===
        this.hintText = this.add.text(512, 730, '', {
            fontFamily: 'Arial Black',
            fontSize: '16px',
            color: '#FFFFFF',
            backgroundColor: '#4CAF50',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setDepth(100).setScrollFactor(0).setVisible(false);
        
        // === BOÎTE DE DIALOGUE ===
        this.dialogBox = this.add.rectangle(512, 620, 950, 200, 0xFFFFFF, 0.98).setDepth(200).setVisible(false);
        this.dialogBox.setStrokeStyle(4, 0x2196F3);
        
        this.dialogText = this.add.text(512, 550, '', {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#333333',
            align: 'center',
            wordWrap: { width: 900 }
        }).setOrigin(0.5).setDepth(201).setVisible(false);
        
        // === BOUTON EXIT (visible pendant les questions) ===
        this.exitButton = this.add.container(950, 530);
        const exitBg = this.add.rectangle(0, 0, 80, 35, 0xF44336);
        exitBg.setStrokeStyle(2, 0xC62828);
        const exitText = this.add.text(0, 0, '✕ Quitter', {
            fontFamily: 'Arial',
            fontSize: '12px',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        this.exitButton.add([exitBg, exitText]);
        this.exitButton.setDepth(250).setVisible(false);
        exitBg.setInteractive({ useHandCursor: true });
        
        exitBg.on('pointerover', () => exitBg.setFillStyle(0xEF5350));
        exitBg.on('pointerout', () => exitBg.setFillStyle(0xF44336));
        exitBg.on('pointerdown', () => this.exitDialog());
        
        // === OPTIONS DE RÉPONSE ===
        for (let i = 0; i < 4; i++) {
            const row = Math.floor(i / 2);
            const col = i % 2;
            const optX = 280 + col * 460;
            const optY = 620 + row * 45;
            
            const optBg = this.add.rectangle(optX, optY, 430, 40, 0xE3F2FD)
                .setDepth(201).setVisible(false).setInteractive({ useHandCursor: true });
            optBg.setStrokeStyle(2, 0x2196F3);
            
            const optText = this.add.text(optX, optY, '', {
                fontFamily: 'Arial',
                fontSize: '14px',
                color: '#1565C0'
            }).setOrigin(0.5).setDepth(202).setVisible(false);
            
            optBg.on('pointerover', () => {
                if (this.isInDialog) {
                    optBg.setFillStyle(0xBBDEFB);
                    optBg.setScale(1.02);
                }
            });
            optBg.on('pointerout', () => {
                if (this.isInDialog) {
                    optBg.setFillStyle(0xE3F2FD);
                    optBg.setScale(1);
                }
            });
            optBg.on('pointerdown', () => {
                if (this.isInDialog) this.selectAnswer(i);
            });
            
            this.optionBgs.push(optBg);
            this.optionTexts.push(optText);
        }
        
        // === BOUTON SUIVANT ===
        this.nextButton = this.add.container(512, 700);
        const nextBg = this.add.rectangle(0, 0, 200, 45, 0x4CAF50);
        nextBg.setStrokeStyle(3, 0x2E7D32);
        const nextText = this.add.text(0, 0, '▶ SUIVANT', {
            fontFamily: 'Arial Black',
            fontSize: '16px',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        this.nextButton.add([nextBg, nextText]);
        this.nextButton.setDepth(250).setVisible(false);
        nextBg.setInteractive({ useHandCursor: true });
        
        nextBg.on('pointerover', () => nextBg.setFillStyle(0x66BB6A));
        nextBg.on('pointerout', () => nextBg.setFillStyle(0x4CAF50));
        nextBg.on('pointerdown', () => this.onNextButtonClick());
    }

    showInstructions()
    {
        this.showingInstructions = true;
        
        // Panel d'instructions
        this.instructionsPanel = this.add.container(512, 384);
        
        // Fond semi-transparent
        const overlay = this.add.rectangle(0, 0, 1024, 768, 0x000000, 0.7);
        
        // Boîte d'instructions
        const box = this.add.rectangle(0, 0, 700, 500, 0xFFFFFF, 0.98);
        box.setStrokeStyle(4, 0x4CAF50);
        
        // Titre
        const title = this.add.text(0, -200, '📚 COMMENT JOUER', {
            fontFamily: 'Arial Black',
            fontSize: '32px',
            color: '#4CAF50'
        }).setOrigin(0.5);
        
        // Instructions
        const instructions = [
            { icon: '🎮', text: 'Utilise les touches ZQSD ou les FLÈCHES pour te déplacer' },
            { icon: '🏢', text: 'Visite les 3 bâtiments : Accueil, Tech et Legal' },
            { icon: '👤', text: 'Approche-toi des personnages (zone colorée au sol)' },
            { icon: '💬', text: 'Appuie sur ESPACE ou clique pour leur parler' },
            { icon: '❓', text: 'Réponds aux quiz pour gagner des points' },
            { icon: '🔍', text: 'Trouve l\'Easter Egg caché pour un bonus !' }
        ];
        
        instructions.forEach((inst, i) => {
            const y = -120 + i * 50;
            this.instructionsPanel.add(
                this.add.text(-300, y, inst.icon, { fontSize: '24px' }).setOrigin(0, 0.5)
            );
            this.instructionsPanel.add(
                this.add.text(-260, y, inst.text, {
                    fontFamily: 'Arial',
                    fontSize: '16px',
                    color: '#333333'
                }).setOrigin(0, 0.5)
            );
        });
        
        // Objectif
        const objective = this.add.text(0, 150, '🎯 OBJECTIF: Parle aux 3 personnages et réponds correctement !', {
            fontFamily: 'Arial Black',
            fontSize: '16px',
            color: '#FF5722'
        }).setOrigin(0.5);
        
        // Bouton commencer
        const startBg = this.add.rectangle(0, 210, 200, 50, 0x4CAF50);
        startBg.setStrokeStyle(3, 0x2E7D32);
        startBg.setInteractive({ useHandCursor: true });
        const startText = this.add.text(0, 210, '▶ COMMENCER', {
            fontFamily: 'Arial Black',
            fontSize: '18px',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        startBg.on('pointerover', () => startBg.setFillStyle(0x66BB6A));
        startBg.on('pointerout', () => startBg.setFillStyle(0x4CAF50));
        startBg.on('pointerdown', () => this.closeInstructions());
        
        this.instructionsPanel.add([overlay, box, title, objective, startBg, startText]);
        this.instructionsPanel.setDepth(500);
        
        // Fermer avec ESPACE ou ENTER
        this.input.keyboard?.once('keydown-SPACE', () => this.closeInstructions());
        this.input.keyboard?.once('keydown-ENTER', () => this.closeInstructions());
    }

    closeInstructions()
    {
        if (this.instructionsPanel) {
            this.instructionsPanel.destroy();
            this.showingInstructions = false;
        }
    }

    setupControls()
    {
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.wasd = {
            W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
            A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };
        this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        this.spaceKey.on('down', () => {
            if (this.showingInstructions) return;
            if (!this.isInDialog && this.currentNPC) {
                this.startDialog(this.currentNPC);
            }
        });
        
        // Touche ESC pour quitter le dialogue
        this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).on('down', () => {
            if (this.isInDialog) this.exitDialog();
        });
        
        for (let i = 1; i <= 4; i++) {
            this.input.keyboard!.addKey(48 + i).on('down', () => {
                if (this.isInDialog) this.selectAnswer(i - 1);
            });
        }
    }

    update()
    {
        if (this.isInDialog || this.showingInstructions) return;
        
        let vx = 0, vy = 0;
        
        if (this.cursors.left.isDown || this.wasd.A.isDown) vx = -this.playerSpeed;
        else if (this.cursors.right.isDown || this.wasd.D.isDown) vx = this.playerSpeed;
        
        if (this.cursors.up.isDown || this.wasd.W.isDown) vy = -this.playerSpeed;
        else if (this.cursors.down.isDown || this.wasd.S.isDown) vy = this.playerSpeed;
        
        this.player.x += vx * (1/60);
        this.player.y += vy * (1/60);
        
        this.player.x = Phaser.Math.Clamp(this.player.x, 50, 974);
        this.player.y = Phaser.Math.Clamp(this.player.y, 350, 630);
        
        this.checkNPCProximity();
    }

    checkNPCProximity()
    {
        this.currentNPC = null;
        let closestDistance = 70;
        let closestIndex = -1;
        
        NPCs.forEach((npc, index) => {
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
            if (dist < closestDistance && !this.completedNPCs.has(npc.name)) {
                this.currentNPC = npc;
                closestDistance = dist;
                closestIndex = index;
            }
        });
        
        // Mettre à jour la visibilité des indicateurs
        this.children.list.forEach((child: any) => {
            if (child.getData && child.getData('npcName')) {
                const npcName = child.getData('npcName');
                const isCurrentNPC = this.currentNPC && this.currentNPC.name === npcName;
                child.setVisible(isCurrentNPC && !this.completedNPCs.has(npcName));
            }
        });
        
        const easterDist = Phaser.Math.Distance.Between(this.player.x, this.player.y, EasterEggNPC.x, EasterEggNPC.y);
        if (easterDist < 50 && !this.easterEggFound) {
            this.currentNPC = EasterEggNPC;
        }
        
        if (this.currentNPC) {
            this.hintText.setText(`💬 Appuie sur ESPACE pour parler à ${this.currentNPC.name}`);
            this.hintText.setVisible(true);
        } else {
            this.hintText.setVisible(false);
        }
    }

    startDialog(npc: NPC)
    {
        this.isInDialog = true;
        this.showingGreeting = true;
        this.currentQuestionIndex = 0;
        this.correctAnswers = 0;
        
        this.showDialogText(`💬 ${npc.name}: ${npc.greeting}`);
        this.exitButton.setVisible(true);
        this.nextButton.setVisible(true);
    }
    
    onNextButtonClick()
    {
        if (!this.isInDialog || !this.currentNPC) return;
        
        if (this.showingGreeting) {
            this.showingGreeting = false;
            this.nextButton.setVisible(false);
            this.showQuestion(this.currentNPC);
        }
    }

    showDialogText(text: string)
    {
        this.dialogBox.setVisible(true);
        this.dialogText.setText(text).setVisible(true);
        this.optionTexts.forEach(opt => opt.setVisible(false));
        this.optionBgs.forEach(bg => bg.setVisible(false));
        this.hintText.setVisible(false);
    }

    showQuestion(npc: NPC)
    {
        if (!this.isInDialog) return;
        
        if (this.currentQuestionIndex >= npc.questions.length) {
            this.endDialog(npc);
            return;
        }
        
        const question = npc.questions[this.currentQuestionIndex];
        this.dialogText.setText(`❓ Question ${this.currentQuestionIndex + 1}/${npc.questions.length}\n\n${question.question}`);
        this.dialogText.setY(550);
        
        question.options.forEach((option, i) => {
            this.optionBgs[i].setVisible(true).setFillStyle(0xE3F2FD).setScale(1);
            this.optionTexts[i].setText(`${i + 1}. ${option}`).setVisible(true);
        });
        
        this.exitButton.setVisible(true);
    }

    selectAnswer(index: number)
    {
        if (!this.currentNPC || !this.isInDialog) return;
        
        const question = this.currentNPC.questions[this.currentQuestionIndex];
        if (!question) return;
        
        const isCorrect = index === question.correct;
        
        // Feedback visuel
        this.optionBgs[index].setFillStyle(isCorrect ? 0x81C784 : 0xEF5350);
        this.optionBgs[question.correct].setFillStyle(0x81C784);
        
        if (isCorrect) {
            this.correctAnswers++;
            this.score += 10;
            this.scoreText.setText(`⭐ ${this.score} pts`);
            this.dialogText.setText(`✅ Correct ! +10 points\n\n${question.explanation}`);
        } else {
            this.dialogText.setText(`❌ Pas tout à fait...\n\n${question.explanation}`);
        }
        
        // Masquer les options et afficher le bouton Suivant
        this.optionBgs.forEach(bg => bg.setVisible(false));
        this.optionTexts.forEach(txt => txt.setVisible(false));
        this.showNextQuestionButton();
    }
    
    showNextQuestionButton()
    {
        // Créer un bouton "Question suivante"
        const continueBtn = this.add.container(512, 680);
        const btnBg = this.add.rectangle(0, 0, 250, 45, 0x2196F3);
        btnBg.setStrokeStyle(3, 0x1565C0);
        const btnText = this.add.text(0, 0, '▶ QUESTION SUIVANTE', {
            fontFamily: 'Arial Black',
            fontSize: '14px',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        continueBtn.add([btnBg, btnText]);
        continueBtn.setDepth(260);
        btnBg.setInteractive({ useHandCursor: true });
        
        btnBg.on('pointerover', () => btnBg.setFillStyle(0x42A5F5));
        btnBg.on('pointerout', () => btnBg.setFillStyle(0x2196F3));
        btnBg.on('pointerdown', () => {
            continueBtn.destroy();
            if (this.isInDialog) {
                this.currentQuestionIndex++;
                this.showQuestion(this.currentNPC!);
            }
        });
    }

    exitDialog()
    {
        this.isInDialog = false;
        this.showingGreeting = false;
        this.dialogBox.setVisible(false);
        this.dialogText.setVisible(false);
        this.optionTexts.forEach(opt => opt.setVisible(false));
        this.optionBgs.forEach(bg => bg.setVisible(false));
        this.exitButton.setVisible(false);
        this.nextButton.setVisible(false);
    }

    endDialog(npc: NPC)
    {
        let bonusPoints = 0;
        if (this.correctAnswers === npc.questions.length) {
            bonusPoints = 50;
            this.score += bonusPoints;
            this.scoreText.setText(`⭐ ${this.score} pts`);
        }
        
        // Sauvegarder le score pour cette catégorie
        const categoryPoints = (this.correctAnswers * 10) + bonusPoints;
        this.categoryScores[npc.name] = {
            correct: this.correctAnswers,
            total: npc.questions.length,
            points: categoryPoints
        };
        
        let message = `🎉 ${npc.successMessage}\n\n⭐ ${this.correctAnswers}/${npc.questions.length} bonnes réponses !`;
        
        if (npc.name === 'CloudBot') {
            this.easterEggFound = true;
            this.score += 100;
            this.scoreText.setText(`⭐ ${this.score} pts`);
            message = `🤖 ${npc.successMessage}`;
        } else {
            this.completedNPCs.add(npc.name);
        }
        
        this.showDialogText(message);
        this.exitButton.setVisible(false);
        
        // Bouton pour terminer le dialogue
        const finishBtn = this.add.container(512, 680);
        const finishBg = this.add.rectangle(0, 0, 200, 45, 0x4CAF50);
        finishBg.setStrokeStyle(3, 0x2E7D32);
        const finishText = this.add.text(0, 0, '✓ CONTINUER', {
            fontFamily: 'Arial Black',
            fontSize: '14px',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        finishBtn.add([finishBg, finishText]);
        finishBtn.setDepth(260);
        finishBg.setInteractive({ useHandCursor: true });
        
        finishBg.on('pointerover', () => finishBg.setFillStyle(0x66BB6A));
        finishBg.on('pointerout', () => finishBg.setFillStyle(0x4CAF50));
        finishBg.on('pointerdown', () => {
            finishBtn.destroy();
            this.exitDialog();
            
            if (this.completedNPCs.size >= 3) {
                this.time.delayedCall(500, () => {
                    this.scene.start('GameOver', { 
                        score: this.score, 
                        easterEgg: this.easterEggFound,
                        categoryScores: this.categoryScores
                    });
                });
            }
        });
    }
}
