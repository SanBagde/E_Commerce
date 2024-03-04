// cypress/integration/fetchdata.spec.js

describe('Fetchdata Component', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000'); // Make sure to replace the URL with your application's URL
  });

  it('should display the filter and "View cart" button', () => {
    cy.get('.filter-container').should('exist');
    cy.get('.cart-container').should('exist');
  });

  it('should filter products when selecting a category', () => {
    cy.get('#categoryFilter').select('Category1'); // Replace 'Category1' with an actual category
    cy.get('.card').should('have.length.greaterThan', 0);
  });

  it('should add items to the cart', () => {
    cy.get('.card').first().as('productCard');
    cy.get('@productCard').contains('Add to Cart').click();
    cy.get('.toast-success').should('contain.text', 'Item added in cart');
    cy.get('.btn-primary:contains("View cart")').click();
    cy.url().should('include', '/Cart');
  });

  it('should show a warning when adding the same item to the cart', () => {
    cy.get('.card').first().as('productCard');
    cy.get('@productCard').contains('Add to Cart').click();
    cy.get('.toast-warning').should('contain.text', 'is already in the cart');
  });

  // Add more test cases as needed

});
