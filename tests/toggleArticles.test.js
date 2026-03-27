const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, '..', 'contratorural'), 'utf8');

describe('toggleArticles', () => {
  let dom;
  let document;
  let button;
  let container;

  beforeEach(async () => {
    dom = new JSDOM(html, {
      runScripts: 'dangerously',
      resources: 'usable'
    });

    await new Promise((resolve) => {
      dom.window.document.addEventListener('DOMContentLoaded', resolve);
    });

    document = dom.window.document;

    button = document.createElement('button');
    button.innerHTML = `
      <span class="button-text">✨ Ver Artigos Pertinentes</span>
      <div class="loader hidden"></div>
    `;

    container = document.createElement('div');
    container.id = 'articles-test';

    document.body.appendChild(button);
    document.body.appendChild(container);
  });

  afterEach(() => {
    dom.window.close();
  });

  test('adds show class and updates button text when expanding', async () => {
    await dom.window.toggleArticles('Lei do Inquilinato', 'articles-test', button);

    expect(container.classList.contains('show')).toBe(true);
    expect(button.querySelector('.button-text').textContent).toBe('Ocultar Artigos');
  });

  test('removes show class and restores original button text when toggled again', async () => {
    const originalText = button.querySelector('.button-text').textContent;

    await dom.window.toggleArticles('Lei do Inquilinato', 'articles-test', button);
    await dom.window.toggleArticles('Lei do Inquilinato', 'articles-test', button);

    expect(container.classList.contains('show')).toBe(false);
    expect(button.querySelector('.button-text').textContent).toBe(originalText);
  });
});
