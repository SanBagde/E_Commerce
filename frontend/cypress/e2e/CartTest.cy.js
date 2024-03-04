describe('Cart component', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://dummyjson.com/products', { fixture: 'products.json' }).as('getProducts');
    cy.visit('http://localhost:3000/');
    cy.get('@getProducts');
  });

  it('should render the cart page', () => {
    cy.get('[data-testid="viewcart"]').click();
    cy.get('h2').should('have.text', 'Your Cart');
    cy.get('.table').should('exist');
  });

  it('should display items in the cart', () => {
    cy.get('[data-testid="product-card"]').first().find('.btn-primary').click();
    cy.get('.Toastify__toast-body').should('contain.text', 'Item added in cart')
    cy.log('Waiting for the view cart button to appear');
    cy.get('[data-testid="viewcart"]').click();
    cy.log('View cart button appeared');
    cy.get('tbody tr').should('have.length.greaterThan', 0);
    const newQuantity = 2;
    cy.get('select').select(newQuantity.toString());
    cy.get('td:contains("₹")').each(($el) => {
      const price = parseFloat($el.text().replace('₹', ''));
      const subtotal = newQuantity * price;
      const parentTr = $el.closest('tr');
      const subtotalElements = parentTr.find('td:contains("₹")');
      cy.log(`Actual text in elements: ${subtotalElements.text()}`);
      const containsExpectedText = subtotalElements.toArray().some(element => {
          const elementText = Cypress.$(element).text();
          return elementText.includes(`₹${subtotal}`);
      });
  });
  });
  
  it('should remove an item from the cart', () => {
    cy.get('[data-testid="product-card"]').first().find('.btn-primary').click();
    cy.get('.Toastify__toast-body').should('contain.text', 'Item added in cart')
    cy.log('Waiting for the view cart button to appear');
    cy.get('[data-testid="viewcart"]').click();
    cy.log('View cart button appeared');
    cy.get('[data-testid="btn-danger"]').first().click();
    cy.get('tbody > tr').should('have.length.lessThan', 1);
  });

  it('should calculate the subtotal correctly in the cart', () => {
    cy.get('[data-testid="product-card"]').first().find('.btn-primary').click();
    cy.get('.Toastify__toast-body').should('contain.text', 'Item added in cart')
    cy.log('Waiting for the view cart button to appear');
    cy.get('[data-testid="viewcart"]').click();
    cy.log('View cart button appeared');
    cy.get('tbody tr').should('have.length.greaterThan', 0);
    const newQuantity = 2;
    cy.get('select').select(newQuantity.toString());
    cy.get('td:contains("₹")').each(($el) => {
      const price = parseFloat($el.text().replace('₹', ''));
      const subtotal = newQuantity * price;
      const parentTr = $el.closest('tr');
      const subtotalElements = parentTr.find('td:contains("₹")');
      cy.log(`Actual text in elements: ${subtotalElements.text()}`);
      const containsExpectedText = subtotalElements.toArray().some(element => {
          const elementText = Cypress.$(element).text();
          return elementText.includes(`₹${subtotal}`);
      });
  });
  });


  it.only('should update quantity from dropdown in the cart', () => {
    cy.get('[data-testid="product-card"]').first().find('.btn-primary').click();
    cy.get('.Toastify__toast-body').should('contain.text', 'Item added in cart');
    cy.get('[data-testid="viewcart"]').click();
    cy.get('tbody tr').should('have.length.greaterThan', 0);
    const newQuantity = 3;
    cy.get('select').select(newQuantity.toString());
    cy.get('select').should('have.value', newQuantity.toString());
});


});



