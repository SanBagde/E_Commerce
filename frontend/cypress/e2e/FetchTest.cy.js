// Test fetching and rendering products
describe('Fetchdata Component - Fetch and Render Products', () => {
  it('should fetch and render products', () => {
    cy.intercept('GET', 'https://dummyjson.com/products', { fixture: 'products.json' }).as('getProducts');
    cy.visit('http://localhost:3000');
    cy.wait('@getProducts');
    cy.get('[data-testid="product-card"]').should('have.length.greaterThan', 0);
  });
});

// Test filtering products
describe('Fetchdata Component - Filter Products', () => {
  it('should filter products based on category', () => {
    cy.intercept('GET', 'https://dummyjson.com/products', { fixture: 'products.json' }).as('getProducts');
    cy.visit('http://localhost:3000');
    cy.wait('@getProducts');
    cy.get('#categoryFilter').select('laptops');
    cy.get('[data-testid="product-card"]').should('have.length.greaterThan', 0).each((card) => {
      const selectedCategory = 'laptops';
      cy.get(card).find('.card-text:contains("Categories: laptops")');
    });
  });
});

// Test adding items to the cart
describe('Fetchdata Component - Add Items to Cart', () => {
  it('should add items to the cart', () => {
    cy.intercept('GET', 'https://dummyjson.com/products', { fixture: 'products.json' }).as('getProducts');
    cy.visit('http://localhost:3000');
    cy.wait('@getProducts');
    cy.get('[data-testid="product-card"]').first().find('.btn-primary').click();
    cy.get('.Toastify__toast-body').should('contain.text', 'Item added in cart')
    cy.log('Waiting for the view cart button to appear');
    cy.get('[data-testid="viewcart"]').click();
    cy.log('View cart button appeared');
    // Add any additional assertions or actions here if needed
  });
});


// Test updating the quantity in the cart
describe('Fetchdata Component - Update Quantity in Cart', () => {
  it('should update the quantity in the cart', () => {
    cy.intercept('GET', 'https://dummyjson.com/products', { fixture: 'products.json' }).as('getProducts');
    cy.visit('http://localhost:3000');
    cy.wait('@getProducts');
    cy.get('[data-testid="viewcart"]').click();
  });
});

