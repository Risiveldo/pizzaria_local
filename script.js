let currentStep = 1;
let maxSteps = 7; // Aumentou para 7 passos
let order = {
    size: null,
    division: null, // Novo campo para divisão
    border: null,
    dough: null,
    ingredients: [], // Agora será array de arrays para divisões
    drinks: {},
    total: 0
};

// Lista de ingredientes disponíveis
const availableIngredients = [
    { name: 'mozzarella', price: 4.90, emoji: '🧀', title: 'Mozzarella' },
    { name: 'pepperoni', price: 6.90, emoji: '🍕', title: 'Pepperoni' },
    { name: 'presunto', price: 5.90, emoji: '🥓', title: 'Presunto' },
    { name: 'cogumelos', price: 4.50, emoji: '🍄', title: 'Cogumelos' },
    { name: 'azeitona', price: 3.90, emoji: '🫒', title: 'Azeitona' },
    { name: 'tomate', price: 3.50, emoji: '🍅', title: 'Tomate' },
    { name: 'cebola', price: 3.90, emoji: '🧅', title: 'Cebola' },
    { name: 'pimentao', price: 4.20, emoji: '🫑', title: 'Pimentão' },
    { name: 'frango', price: 7.90, emoji: '🐔', title: 'Frango' },
    { name: 'calabresa', price: 6.50, emoji: '🌶️', title: 'Calabresa' },
    { name: 'catupiry', price: 5.90, emoji: '🦐', title: 'Catupiry' },
    { name: 'bacon', price: 8.90, emoji: '🥓', title: 'Bacon' }
];

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    updateStepIndicator();
    updateNavigationButtons();
    
    // Forma de pagamento: seleção visual
    document.getElementById('payment-options').addEventListener('click', function(e) {
        const label = e.target.closest('.payment-option');
        if (label) {
            document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
            label.classList.add('selected');
            label.querySelector('input[type="radio"]').checked = true;
        }
    });
    
    // Teclado: acessibilidade
    document.querySelectorAll('.payment-option').forEach(opt => {
        opt.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                opt.click();
            }
        });
    });
});

// Navegação entre etapas
function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < maxSteps) {
            currentStep++;
            
            // Pular etapa de divisão se for pizza pequena
            if (currentStep === 2 && order.size.name === 'pequena') {
                currentStep = 3;
            }
            
            showStep(currentStep);
            updateStepIndicator();
            updateNavigationButtons();
            
            // Preparar conteúdo específico de cada etapa
            if (currentStep === 2) {
                setupDivisionStep();
            } else if (currentStep === 5) {
                setupIngredientsStep();
            } else if (currentStep === 7) {
                updateOrderSummary();
            }
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        
        // Pular etapa de divisão se for pizza pequena
        if (currentStep === 2 && order.size.name === 'pequena') {
            currentStep = 1;
        }
        
        showStep(currentStep);
        updateStepIndicator();
        updateNavigationButtons();
    }
}

function showStep(step) {
    // Esconder todas as etapas
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Mostrar etapa atual
    document.querySelector(`.step-content[data-step="${step}"]`).classList.add('active');
}

function updateStepIndicator() {
    document.querySelectorAll('.step').forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed', 'inactive');
        
        if (stepNumber === currentStep) {
            step.classList.add('active');
        } else if (stepNumber < currentStep) {
            step.classList.add('completed');
        } else {
            step.classList.add('inactive');
        }
    });
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const navigationButtons = document.getElementById('navigation-buttons');
    
    if (currentStep === 7) {
        navigationButtons.style.display = 'none';
    } else {
        navigationButtons.style.display = 'flex';
        
        if (currentStep === 1) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'block';
        }
        
        if (currentStep === maxSteps) {
            nextBtn.textContent = '✅ Finalizar';
        } else {
            nextBtn.textContent = '➡️ Próximo';
        }
    }
}

function setupDivisionStep() {
    const divisionContent = document.getElementById('division-content');
    const sizeName = order.size.name;
    
    let html = '';
    
    if (sizeName === 'media') {
        html = `
            <p style="text-align: center; margin-bottom: 30px; color: #666; font-size: 1.1rem;">
                Sua pizza média pode ser dividida ao meio com sabores diferentes!
            </p>
            <div class="options-grid">
                <div class="option-card" data-division="inteira" data-sections="1">
                    <div class="option-title">Pizza Inteira</div>
                    <div class="option-description">Um sabor só<br>Para quem já sabe o que quer</div>
                    <div class="option-price">🍕</div>
                </div>
                <div class="option-card" data-division="meio" data-sections="2">
                    <div class="option-title">Meio a Meio</div>
                    <div class="option-description">Dois sabores diferentes<br>Perfeita para compartilhar</div>
                    <div class="option-price">🍕➕🍕</div>
                </div>
            </div>
        `;
    } else if (sizeName === 'grande' || sizeName === 'familia') {
        html = `
            <p style="text-align: center; margin-bottom: 30px; color: #666; font-size: 1.1rem;">
                Sua pizza ${sizeName} pode ter até 3 sabores diferentes!
            </p>
            <div class="options-grid">
                <div class="option-card" data-division="inteira" data-sections="1">
                    <div class="option-title">Pizza Inteira</div>
                    <div class="option-description">Um sabor só<br>Clássica e saborosa</div>
                    <div class="option-price">🍕</div>
                </div>
                <div class="option-card" data-division="meio" data-sections="2">
                    <div class="option-title">Meio a Meio</div>
                    <div class="option-description">Dois sabores diferentes<br>Variedade perfeita</div>
                    <div class="option-price">🍕➕🍕</div>
                </div>
                <div class="option-card" data-division="tres" data-sections="3">
                    <div class="option-title">Três Sabores</div>
                    <div class="option-description">Três sabores em uma pizza<br>Máxima variedade</div>
                    <div class="option-price">🍕➕🍕➕🍕</div>
                </div>
            </div>
        `;
    }
    
    divisionContent.innerHTML = html;
}

function setupIngredientsStep() {
    const ingredientsSection = document.getElementById('ingredients-sections');
    const sections = order.division ? order.division.sections : 1;
    
    let html = '';
    
    if (sections === 1) {
        html = `
            <p style="text-align: center; margin-bottom: 30px; color: #666; font-size: 1.1rem;">
                Selecione até 6 ingredientes para sua pizza
            </p>
            <div class="ingredients-section" data-section="0">
                <div class="ingredients-grid">
        `;
        
        availableIngredients.forEach(ingredient => {
            html += `
                <div class="ingredient-card" data-ingredient="${ingredient.name}" data-price="${ingredient.price}" data-section="0">
                    <div class="ingredient-emoji">${ingredient.emoji}</div>
                    <div class="ingredient-name">${ingredient.title}</div>
                    <div class="ingredient-price">+ R$ ${ingredient.price.toFixed(2)}</div>
                </div>
            `;
        });
        
        html += `
                </div>
                <div class="ingredients-counter" style="text-align: center; margin-top: 20px; font-weight: bold; color: #ff6b35;">
                    Ingredientes selecionados: 0/6
                </div>
            </div>
        `;
    } else {
        const sectionNames = sections === 2 ? ['Primeira Metade', 'Segunda Metade'] : ['Primeiro Terço', 'Segundo Terço', 'Terceiro Terço'];
        
        for (let i = 0; i < sections; i++) {
            html += `
                <div class="ingredients-section" data-section="${i}">
                    <h3 style="color: #ff6b35; margin-bottom: 20px; text-align: center; font-size: 1.3rem;">
                        ${sectionNames[i]} - Escolha até 6 ingredientes
                    </h3>
                    <div class="ingredients-grid">
            `;
            
            availableIngredients.forEach(ingredient => {
                html += `
                    <div class="ingredient-card" data-ingredient="${ingredient.name}" data-price="${ingredient.price}" data-section="${i}">
                        <div class="ingredient-emoji">${ingredient.emoji}</div>
                        <div class="ingredient-name">${ingredient.title}</div>
                        <div class="ingredient-price">+ R$ ${ingredient.price.toFixed(2)}</div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                    <div class="ingredients-counter" style="text-align: center; margin-top: 20px; font-weight: bold; color: #ff6b35;">
                        Ingredientes selecionados: 0/6
                    </div>
                </div>
            `;
            
            if (i < sections - 1) {
                html += '<hr style="margin: 30px 0; border: 2px solid #ff6b35; border-radius: 2px;">';
            }
        }
    }
    
    ingredientsSection.innerHTML = html;
    
    // Inicializar array de ingredientes baseado no número de seções
    order.ingredients = Array(sections).fill().map(() => []);
}

function validateCurrentStep() {
    switch (currentStep) {
        case 1: // Tamanho
            const selectedSize = document.querySelector('.option-card.selected[data-size]');
            if (!selectedSize) {
                alert('Por favor, escolha um tamanho para sua pizza!');
                return false;
            }
            order.size = {
                name: selectedSize.dataset.size,
                price: parseFloat(selectedSize.dataset.price),
                title: selectedSize.querySelector('.option-title').textContent
            };
            break;
            
        case 2: // Divisão (apenas para pizzas média, grande e família)
            if (order.size.name !== 'pequena') {
                const selectedDivision = document.querySelector('.option-card.selected[data-division]');
                if (!selectedDivision) {
                    alert('Por favor, escolha como dividir sua pizza!');
                    return false;
                }
                order.division = {
                    type: selectedDivision.dataset.division,
                    sections: parseInt(selectedDivision.dataset.sections),
                    title: selectedDivision.querySelector('.option-title').textContent
                };
            }
            break;
            
        case 3: // Borda
            const selectedBorder = document.querySelector('.option-card.selected[data-border]');
            if (!selectedBorder) {
                alert('Por favor, escolha o tipo de borda!');
                return false;
            }
            order.border = {
                name: selectedBorder.dataset.border,
                price: parseFloat(selectedBorder.dataset.price),
                title: selectedBorder.querySelector('.option-title').textContent
            };
            break;
            
        case 4: // Massa
            const selectedDough = document.querySelector('.option-card.selected[data-dough]');
            if (!selectedDough) {
                alert('Por favor, escolha o tipo de massa!');
                return false;
            }
            order.dough = {
                name: selectedDough.dataset.dough,
                price: parseFloat(selectedDough.dataset.price),
                title: selectedDough.querySelector('.option-title').textContent
            };
            break;
            
        case 5: // Ingredientes
            const sections = order.division ? order.division.sections : 1;
            let allSectionsHaveIngredients = true;
            
            for (let i = 0; i < sections; i++) {
                const sectionIngredients = document.querySelectorAll(`.ingredient-card.selected[data-section="${i}"]`);
                if (sectionIngredients.length === 0) {
                    allSectionsHaveIngredients = false;
                    const sectionName = sections === 1 ? 'pizza' : sections === 2 ? 
                        (i === 0 ? 'primeira metade' : 'segunda metade') :
                        (i === 0 ? 'primeiro terço' : i === 1 ? 'segundo terço' : 'terceiro terço');
                    alert(`Por favor, escolha pelo menos 1 ingrediente para a ${sectionName}!`);
                    break;
                }
                
                // Salvar ingredientes da seção
                order.ingredients[i] = Array.from(sectionIngredients).map(ing => ({
                    name: ing.dataset.ingredient,
                    price: parseFloat(ing.dataset.price),
                    title: ing.querySelector('.ingredient-name').textContent
                }));
            }
            
            return allSectionsHaveIngredients;
    }
    return true;
}

// Seleção de opções
document.addEventListener('click', function(e) {
    const optionCard = e.target.closest('.option-card');
    const ingredientCard = e.target.closest('.ingredient-card');
    
    if (optionCard && !ingredientCard) {
        // Desmarcar outras opções do mesmo grupo
        optionCard.parentElement.querySelectorAll('.option-card').forEach(card => {
            card.classList.remove('selected');
        });
        // Marcar opção selecionada
        optionCard.classList.add('selected');
    }
    
    if (ingredientCard) {
        const section = parseInt(ingredientCard.dataset.section);
        const sectionContainer = ingredientCard.closest('.ingredients-section');
        const selectedInSection = sectionContainer.querySelectorAll('.ingredient-card.selected').length;
        
        if (ingredientCard.classList.contains('selected')) {
            ingredientCard.classList.remove('selected');
        } else if (selectedInSection < 6) {
            ingredientCard.classList.add('selected');
        } else {
            alert('Máximo de 6 ingredientes por seção!');
        }
        
        updateIngredientsCounter(section);
    }
});

function updateIngredientsCounter(section) {
    const sectionContainer = document.querySelector(`.ingredients-section[data-section="${section}"]`);
    if (sectionContainer) {
        const selectedCount = sectionContainer.querySelectorAll('.ingredient-card.selected').length;
        const counter = sectionContainer.querySelector('.ingredients-counter');
        counter.textContent = `Ingredientes selecionados: ${selectedCount}/6`;
    }
}

// Controle de bebidas
function changeDrinkQuantity(drink, change) {
    if (!order.drinks[drink]) {
        order.drinks[drink] = { quantity: 0, price: 0 };
    }
    
    const newQuantity = Math.max(0, (order.drinks[drink].quantity || 0) + change);
    order.drinks[drink].quantity = newQuantity;
    
    if (newQuantity === 0) {
        delete order.drinks[drink];
    } else {
        const drinkCard = document.querySelector(`[data-drink="${drink}"]`);
        order.drinks[drink].price = parseFloat(drinkCard.dataset.price);
        order.drinks[drink].name = drinkCard.querySelector('.ingredient-name').textContent;
    }
    
    document.getElementById(`qty-${drink}`).textContent = newQuantity;
}

function updateOrderSummary() {
    const orderDetails = document.getElementById('order-details');
    let total = 0;
    let html = '';

    // Pizza base
    html += `<div class="summary-item">
        <span>${order.size.title}</span>
        <span>R$ ${order.size.price.toFixed(2)}</span>
    </div>`;
    total += order.size.price;

    // Borda
    if (order.border.price > 0) {
        html += `<div class="summary-item">
            <span>${order.border.title}</span>
            <span>R$ ${order.border.price.toFixed(2)}</span>
        </div>`;
        total += order.border.price;
    }

    // Massa
    if (order.dough.price > 0) {
        html += `<div class="summary-item">
            <span>${order.dough.title}</span>
            <span>R$ ${order.dough.price.toFixed(2)}</span>
        </div>`;
        total += order.dough.price;
    }

    // Ingredientes por seção
    const sections = order.division ? order.division.sections : 1;
    if (sections > 1) {
        const sectionNames = sections === 2 ? ['Primeira Metade', 'Segunda Metade'] : ['Primeiro Terço', 'Segundo Terço', 'Terceiro Terço'];
        
        for (let i = 0; i < sections; i++) {
            if (order.ingredients[i] && order.ingredients[i].length > 0) {
                html += `<div class="summary-section">
                    <strong>${sectionNames[i]}:</strong>
                </div>`;
                
                order.ingredients[i].forEach(ingredient => {
                    html += `<div class="summary-item indent">
                        <span>• ${ingredient.title}</span>
                        <span>R$ ${ingredient.price.toFixed(2)}</span>
                    </div>`;
                    total += ingredient.price;
                });
            }
        }
    } else {
        // Pizza inteira
        if (order.ingredients[0]) {
            order.ingredients[0].forEach(ingredient => {
                html += `<div class="summary-item">
                    <span>${ingredient.title}</span>
                    <span>R$ ${ingredient.price.toFixed(2)}</span>
                </div>`;
                total += ingredient.price;
            });
        }
    }

    // Bebidas
    Object.entries(order.drinks).forEach(([key, drink]) => {
        if (drink.quantity > 0) {
            const subtotal = drink.price * drink.quantity;
            html += `<div class="summary-item">
                <span>${drink.name} (${drink.quantity}x)</span>
                <span>R$ ${subtotal.toFixed(2)}</span>
            </div>`;
            total += subtotal;
        }
    });

    orderDetails.innerHTML = html;
    document.getElementById('total-price').textContent = `Total: R$ ${total.toFixed(2)}`;
    order.total = total;
}

function editOrder() {
    currentStep = 1;
    showStep(1);
    updateStepIndicator();
    updateNavigationButtons();
}

let lastWhatsAppUrl = '';

function finalizeOrder() {
    // Validar campos obrigatórios
    const rua = document.getElementById('rua').value.trim();
    const numero = document.getElementById('numero').value.trim();
    const bairro = document.getElementById('bairro').value.trim();
    const cidade = document.getElementById('cidade').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const formaPagamentoInput = document.querySelector('.payment-option.selected input[type="radio"]');
    const formaPagamento = formaPagamentoInput ? formaPagamentoInput.value : '';
    
    const complemento = document.getElementById('complemento').value.trim();
    const referencia = document.getElementById('referencia').value.trim();
    const observacoes = document.getElementById('observacoes').value.trim();

    // Validação dos campos obrigatórios
    if (!rua) { alert('Por favor, informe o nome da rua!'); document.getElementById('rua').focus(); return; }
    if (!numero) { alert('Por favor, informe o número da casa!'); document.getElementById('numero').focus(); return; }
    if (!bairro) { alert('Por favor, informe o bairro!'); document.getElementById('bairro').focus(); return; }
    if (!cidade) { alert('Por favor, informe a cidade!'); document.getElementById('cidade').focus(); return; }
    if (!telefone) { alert('Por favor, informe seu telefone para contato!'); document.getElementById('telefone').focus(); return; }
    if (!formaPagamento) { alert('Por favor, selecione a forma de pagamento!'); document.getElementById('payment-options').scrollIntoView({behavior: 'smooth'}); return; }

    document.querySelector('.pizza-builder').style.display = 'none';
    document.getElementById('final-order').style.display = 'block';

    // Gerar mensagem formatada para WhatsApp
    let message = '';
    message += '┌─────────────────────────────┐\n';
    message += '📋 *COMANDA DE PEDIDO*\n';
    message += '└─────────────────────────────┘\n\n';

    // Pizza
    message += '🍕 *PIZZA*\n';
    message += '--------------------------------\n';
    message += `Tamanho: ${order.size.title}\n`;
    
    if (order.division && order.division.sections > 1) {
        message += `Divisão: ${order.division.title}\n`;
    }
    
    message += `Massa: ${order.dough.title.replace('Massa ', '')}\n`;
    message += `Borda: ${order.border.title.replace('Borda ', '')}\n`;
    
    // Ingredientes por seção
    const sections = order.division ? order.division.sections : 1;
    if (sections > 1) {
        const sectionNames = sections === 2 ? ['Primeira Metade', 'Segunda Metade'] : ['Primeiro Terço', 'Segundo Terço', 'Terceiro Terço'];
        
        for (let i = 0; i < sections; i++) {
            if (order.ingredients[i] && order.ingredients[i].length > 0) {
                message += `\n*${sectionNames[i]}:*\n`;
                order.ingredients[i].forEach(ingredient => {
                    message += `  • ${ingredient.title}\n`;
                });
            }
        }
    } else {
        message += 'Ingredientes:\n';
        if (order.ingredients[0]) {
            order.ingredients[0].forEach(ingredient => {
                message += `  • ${ingredient.title}\n`;
            });
        }
    }
    message += '--------------------------------\n\n';

    // Bebidas
    if (Object.keys(order.drinks).length > 0) {
        message += '🥤 *BEBIDAS*\n';
        message += '--------------------------------\n';
        Object.entries(order.drinks).forEach(([key, drink]) => {
            if (drink.quantity > 0) {
                message += `  • ${drink.name} (${drink.quantity}x)\n`;
            }
        });
        message += '--------------------------------\n\n';
    }

    // Entrega
    message += '🚚 *ENTREGA*\n';
    message += '--------------------------------\n';
    message += `Endereço: ${rua}, ${numero}\n`;
    message += `Bairro: ${bairro}\n`;
    message += `Cidade: ${cidade}\n`;
    if (complemento) {
        message += `Complemento: ${complemento}\n`;
    }
    if (referencia) {
        message += `Referência: ${referencia}\n`;
    }
    message += `Telefone: ${telefone}\n`;
    message += '--------------------------------\n\n';

    // Observações
    if (observacoes) {
        message += '📝 *OBSERVAÇÕES*\n';
        message += '--------------------------------\n';
        message += `${observacoes}\n`;
        message += '--------------------------------\n\n';
    }

    // Pagamento
    message += '💳 *PAGAMENTO*\n';
    message += '--------------------------------\n';
    message += `Forma: ${formaPagamento}\n`;
    message += `Valor Total: R$ ${order.total.toFixed(2)}\n`;
    message += '--------------------------------\n\n';

    // Rodapé
    message += '⏰ Tempo estimado: 30-45 minutos\n';
    message += '🚀 Aguardo confirmação do pedido!\n';
    message += '└─────────────────────────────┘';

    // Número da pizzaria
    const pizzariaWhatsApp = '5581987654321';
    
    // Gerar URL do WhatsApp
    const whatsappUrl = `https://wa.me/${pizzariaWhatsApp}?text=${encodeURIComponent(message)}`;
    lastWhatsAppUrl = whatsappUrl;
    
    // Abrir WhatsApp
    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
    }, 1000);
    
    console.log('Pedido finalizado! URL do WhatsApp:', whatsappUrl);
}

function retryWhatsApp() {
    if (lastWhatsAppUrl) {
        window.open(lastWhatsAppUrl, '_blank');
    }
}

function newOrder() {
    // Resetar tudo
    currentStep = 1;
    order = {
        size: null,
        division: null,
        border: null,
        dough: null,
        ingredients: [],
        drinks: {},
        total: 0
    };
    
    // Limpar seleções
    document.querySelectorAll('.option-card, .ingredient-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Resetar quantidades de bebidas
    document.querySelectorAll('.quantity-display').forEach(display => {
        display.textContent = '0';
    });
    
    // Limpar campos
    document.getElementById('rua').value = '';
    document.getElementById('numero').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('complemento').value = '';
    document.getElementById('referencia').value = '';
    document.getElementById('telefone').value = '';
    document.getElementById('observacoes').value = '';
    
    // Limpar seleção de pagamento
    document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelectorAll('input[name="forma-pagamento"]').forEach(input => input.checked = false);
    
    // Mostrar primeira etapa
    document.querySelector('.pizza-builder').style.display = 'block';
    document.getElementById('final-order').style.display = 'none';
    showStep(1);
    updateStepIndicator();
    updateNavigationButtons();
}