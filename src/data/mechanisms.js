export const mechanisms = {
    'hydrohalogenation-ethene-bromoethane': {
        title: 'Hydrohalogenation of Ethene',
        steps: [
            {
                id: 'step1',
                description: 'Ethene (C₂H₄) and Hydrogen Bromide (HBr) approach each other.',
                atoms: [
                    { id: 'c1', label: 'C', x: 200, y: 200, color: 'bg-gray-500' },
                    { id: 'c2', label: 'C', x: 300, y: 200, color: 'bg-gray-500' },
                    { id: 'h1', label: 'H', x: 150, y: 150, color: 'bg-white text-gray-900', scale: 0.8 },
                    { id: 'h2', label: 'H', x: 150, y: 250, color: 'bg-white text-gray-900', scale: 0.8 },
                    { id: 'h3', label: 'H', x: 350, y: 150, color: 'bg-white text-gray-900', scale: 0.8 },
                    { id: 'h4', label: 'H', x: 350, y: 250, color: 'bg-white text-gray-900', scale: 0.8 },
                    { id: 'h-br', label: 'H', x: 400, y: 100, color: 'bg-white text-gray-900', scale: 0.8 },
                    { id: 'br1', label: 'Br', x: 450, y: 50, color: 'bg-red-800', scale: 1.2 },
                ],
                bonds: [
                    { from: 'c1', to: 'c2', type: 'double' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c2', to: 'h3' }, { from: 'c2', to: 'h4' },
                    { from: 'h-br', to: 'br1' },
                ]
            },
            {
                id: 'step2',
                description: 'Electrophilic Attack: The energetic pi-bond attacks the Hydrogen atom. The H-Br bond breaks.',
                atoms: [
                    { id: 'c1', label: 'C', x: 200, y: 200, color: 'bg-gray-500' },
                    { id: 'c2', label: 'C', x: 300, y: 200, color: 'bg-gray-500' }, // Becomes carbocation
                    { id: 'h1', label: 'H', x: 130, y: 150, color: 'bg-white text-gray-900', scale: 0.8 },
                    { id: 'h2', label: 'H', x: 130, y: 250, color: 'bg-white text-gray-900', scale: 0.8 },
                    { id: 'h3', label: 'H', x: 370, y: 150, color: 'bg-white text-gray-900', scale: 0.8 },
                    { id: 'h4', label: 'H', x: 370, y: 250, color: 'bg-white text-gray-900', scale: 0.8 },

                    { id: 'h-br', label: 'H', x: 200, y: 130, color: 'bg-white text-gray-900', scale: 0.8 }, // Moved to C1
                    { id: 'br1', label: 'Br⁻', x: 450, y: 80, color: 'bg-red-800', scale: 1.2 }, // Moved away
                ],
                bonds: [
                    { from: 'c1', to: 'c2', type: 'single' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c2', to: 'h3' }, { from: 'c2', to: 'h4' },
                    { from: 'c1', to: 'h-br', isForming: true }, // Forming
                ]
            },
            {
                id: 'step3',
                description: 'Carbocation Intermediate: A stable Carbocation is formed. The Bromide ion (Br⁻) hovers nearby.',
                atoms: [
                    { id: 'c1', label: 'C', x: 200, y: 200, color: 'bg-gray-500' },
                    { id: 'c2', label: 'C⁺', x: 320, y: 200, color: 'bg-blue-600', scale: 1.1 }, // Carbocation
                    { id: 'h1', label: 'H', x: 130, y: 150, color: 'bg-white text-gray-900', scale: 0.8 },
                    { id: 'h2', label: 'H', x: 130, y: 250, color: 'bg-white text-gray-900', scale: 0.8 },
                    { id: 'h3', label: 'H', x: 390, y: 150, color: 'bg-white text-gray-900', scale: 0.8 },
                    { id: 'h4', label: 'H', x: 390, y: 250, color: 'bg-white text-gray-900', scale: 0.8 },
                    { id: 'h-br', label: 'H', x: 200, y: 120, color: 'bg-white text-gray-900', scale: 0.8 },

                    { id: 'br1', label: 'Br⁻', x: 400, y: 300, color: 'bg-red-800', scale: 1.2 }, // Positioning specifically for attack
                ],
                bonds: [
                    { from: 'c1', to: 'c2', type: 'single' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c2', to: 'h3' }, { from: 'c2', to: 'h4' },
                    { from: 'c1', to: 'h-br' },
                ]
            },
            {
                id: 'step4',
                description: 'Nucleophilic Attack: The negative Bromide ion attacks the positive Carbon.',
                atoms: [
                    { id: 'c1', label: 'C', x: 200, y: 200, color: 'bg-gray-500' },
                    { id: 'c2', label: 'C', x: 300, y: 200, color: 'bg-gray-500' },
                    { id: 'h1', label: 'H', x: 130, y: 150, color: 'bg-white text-gray-900', scale: 0.8 },
                    { id: 'h2', label: 'H', x: 130, y: 250, color: 'bg-white text-gray-900', scale: 0.8 },
                    { id: 'h3', label: 'H', x: 370, y: 150, color: 'bg-white text-gray-900', scale: 0.8 },
                    { id: 'h4', label: 'H', x: 370, y: 250, color: 'bg-white text-gray-900', scale: 0.8 },
                    { id: 'h-br', label: 'H', x: 200, y: 120, color: 'bg-white text-gray-900', scale: 0.8 },

                    { id: 'br1', label: 'Br', x: 300, y: 300, color: 'bg-red-800', scale: 1.2 }, // Attached
                ],
                bonds: [
                    { from: 'c1', to: 'c2', type: 'single' },
                    { from: 'c1', to: 'h1' }, { from: 'c1', to: 'h2' },
                    { from: 'c2', to: 'h3' }, { from: 'c2', to: 'h4' },
                    { from: 'c1', to: 'h-br' },
                    { from: 'c2', to: 'br1', isForming: true },
                ]
            }
        ]
    }
};
