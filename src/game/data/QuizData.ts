// Quiz data pour SaaS Academy
export interface Question {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
}

export interface NPC {
    name: string;
    role: string;
    x: number;
    y: number;
    color: number;
    greeting: string;
    questions: Question[];
    successMessage: string;
    // Personnalisation avatar
    hairColor?: number;
    hairStyle?: 'blonde' | 'short' | 'normal';
    bodyColor?: number;
    hasLogo?: 'bnp' | 'microsoft' | null;
    skinColor?: number;
}

export const NPCs: NPC[] = [
    {
        name: "Florine",
        role: "Responsable Accueil",
        x: 170,
        y: 580,
        color: 0x1A1A1A, // Noir (habillée en noir)
        hairColor: 0xFFD54F, // Blonde
        hairStyle: 'blonde',
        skinColor: 0xFFCC80,
        greeting: "Bienvenue ! Je suis Florine, je vais t'expliquer les bases du monde SaaS. Prêt(e) pour un petit quiz ?",
        questions: [
            {
                question: "Que signifie SaaS ?",
                options: [
                    "Software as a Service",
                    "System and a Server",
                    "Secure Application System",
                    "Storage as a Solution"
                ],
                correct: 0,
                explanation: "SaaS (Software as a Service) signifie que le logiciel est hébergé dans le cloud et accessible via internet, sans installation locale."
            },
            {
                question: "Quel est l'avantage principal d'une solution SaaS ?",
                options: [
                    "Nécessite une installation complexe",
                    "Accessible partout, mises à jour automatiques",
                    "Fonctionne uniquement hors ligne",
                    "Requiert des serveurs locaux"
                ],
                correct: 1,
                explanation: "Les solutions SaaS sont accessibles depuis n'importe où avec internet et les mises à jour sont automatiques !"
            },
            {
                question: "Lequel de ces services est un exemple de SaaS ?",
                options: [
                    "Un disque dur externe",
                    "Microsoft 365, Salesforce, Slack",
                    "Un routeur Wi-Fi",
                    "Windows 10 installé sur PC"
                ],
                correct: 1,
                explanation: "Microsoft 365, Salesforce et Slack sont des exemples parfaits de SaaS : accessibles en ligne, par abonnement."
            }
        ],
        successMessage: "Excellent ! Tu maîtrises les bases du SaaS. Bienvenue dans le cloud ! ☁️"
    },
    {
        name: "Damien",
        role: "Expert Technique BNP",
        x: 512,
        y: 580,
        color: 0x00915A, // Vert BNP
        hairColor: 0x5D4037, // Cheveux bruns
        hairStyle: 'short',
        hasLogo: 'bnp',
        skinColor: 0xFFCC80,
        greeting: "Salut ! Moi c'est Damien de BNP Paribas. On va parler infrastructure et déploiement SaaS !",
        questions: [
            {
                question: "Dans un modèle SaaS, qui gère l'infrastructure serveur ?",
                options: [
                    "Le client final",
                    "Personne",
                    "Le fournisseur SaaS (provider)",
                    "L'utilisateur à la maison"
                ],
                correct: 2,
                explanation: "Dans le modèle SaaS, le fournisseur gère toute l'infrastructure : serveurs, stockage, sécurité, mises à jour !"
            },
            {
                question: "Quelle est la différence entre SaaS, PaaS et IaaS ?",
                options: [
                    "Aucune différence",
                    "SaaS = app prête, PaaS = plateforme dev, IaaS = infra virtuelle",
                    "Ce sont des marques de voitures",
                    "SaaS est plus ancien que IaaS"
                ],
                correct: 1,
                explanation: "SaaS (logiciel clé en main), PaaS (plateforme pour développer), IaaS (infrastructure virtualisée). 3 niveaux de service cloud !"
            },
            {
                question: "Comment une banque comme BNP utilise-t-elle le SaaS ?",
                options: [
                    "Elle n'utilise pas le cloud",
                    "Uniquement pour les emails",
                    "CRM, collaboration, analytics, conformité...",
                    "Pour jouer à des jeux"
                ],
                correct: 2,
                explanation: "Les grandes banques utilisent le SaaS pour le CRM (Salesforce), la collaboration (Microsoft 365), l'analytics et bien plus !"
            }
        ],
        successMessage: "Impressionnant ! Tu comprends l'architecture SaaS comme un pro BNP ! 🏦🚀"
    },
    {
        name: "Christophe",
        role: "Expert Cloud Microsoft",
        x: 854,
        y: 580,
        color: 0x00A4EF, // Bleu Microsoft
        hairColor: 0x424242, // Cheveux gris/foncés
        hairStyle: 'normal',
        hasLogo: 'microsoft',
        skinColor: 0xFFCC80,
        greeting: "Hello ! Je suis Christophe de Microsoft. On va parler Azure et écosystème SaaS !",
        questions: [
            {
                question: "Quel est le cloud de Microsoft qui héberge de nombreux SaaS ?",
                options: [
                    "Amazon Web Services",
                    "Google Cloud",
                    "Microsoft Azure",
                    "Oracle Cloud"
                ],
                correct: 2,
                explanation: "Microsoft Azure est le cloud de Microsoft, hébergeant Microsoft 365, Dynamics 365, et de nombreux SaaS partenaires !"
            },
            {
                question: "Qu'est-ce que le multi-tenant dans le SaaS ?",
                options: [
                    "Plusieurs immeubles",
                    "Une seule instance partagée par plusieurs clients",
                    "Un seul client par serveur",
                    "Une technique de jardinage"
                ],
                correct: 1,
                explanation: "Le multi-tenant permet à plusieurs clients de partager la même instance logicielle, réduisant les coûts tout en isolant les données."
            },
            {
                question: "Pourquoi les entreprises préfèrent-elles le SaaS au logiciel on-premise ?",
                options: [
                    "C'est plus compliqué",
                    "Ça coûte plus cher",
                    "Coûts prévisibles, scalabilité, pas de maintenance",
                    "Ça fonctionne moins bien"
                ],
                correct: 2,
                explanation: "Le SaaS offre des coûts prévisibles (abonnement), une scalabilité facile et zéro maintenance côté client !"
            }
        ],
        successMessage: "Parfait ! Tu es maintenant certifié(e) expert(e) Cloud & SaaS ! ☁️✅"
    }
];

// Easter Egg NPC (caché en haut à droite, derrière le bâtiment Legal)
export const EasterEggNPC: NPC = {
    name: "CloudBot",
    role: "Bot Secret",
    x: 980,
    y: 420,
    color: 0xFF6B6B,
    hairColor: 0x9C27B0,
    greeting: "🤖 Bip boop ! Tu m'as trouvé ! OCP SaaS rocks! Voici un bonus secret...",
    questions: [
        {
            question: "Question bonus : Quel partenariat cloud est stratégique pour le SaaS enterprise ?",
            options: [
                "Nintendo + Sony",
                "Microsoft Azure + BNP Paribas",
                "Apple + Samsung",
                "Aucun partenariat"
            ],
            correct: 1,
            explanation: "Les grandes entreprises comme BNP Paribas s'associent avec Microsoft Azure pour leurs solutions SaaS enterprise !"
        }
    ],
    successMessage: "🎉 EASTER EGG DÉBLOQUÉ ! Tu as découvert le secret du cloud ! +100 points bonus !"
};
