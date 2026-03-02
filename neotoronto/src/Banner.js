// HTTP UI, https://httpui.com/
// Copyright (C) Alex Morales, 2026
//
// Unless otherwise stated in particular files or directories, this software is free software.
// You can redistribute it and/or modify it under the terms of the GNU Affero
// General Public License as published by the Free Software Foundation, either
// version 3 of the License, or (at your option) any later version.

// API
// ...

import * as httpstate from 'https://cdn.jsdelivr.net/npm/@httpstate/typescript@0.0.39/dist/index.esm.js';

import { attrIsTrue, oklchaToCSS } from './misc.js';

export class Banner extends HTMLElement {
  // OBSERVED ATTRIBUTES
  static observedAttributes = [/* ... */];
  observedAttributes = Banner.observedAttributes;

  constructor() {
    super();

    this.div = undefined;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('attributeChangedCallback', name, oldValue, newValue);

    // OBSERVED ATTRIBUTES
    switch(name) {
      // ...
    }
  }

  async connectedCallback() {
    console.log('connectedCallback');

    if(this.attributes['httpstate']) {
      await httpstate.load();

      const uuid = this.getAttribute('httpstate');
      httpstate.load._[uuid]
        .off('change')
        .on('change', data => {
          try {
            const json = JSON.parse(data);

            if(
                 json.html
              || json.innerHTML
            ) {
              this.innerHTML = json.html || json.innerHTML;
            }

            for(const [k, v] of Object.entries(json)) {
              if(
                   k === 'html'
                || k === 'innerHTML'
              )
                this.innerHTML = v;
              else if(
                   k === 'innerText'
                || k === 'text'
              )
                this.innerText = v;
              else
                this.setAttribute(k, v);
            }
          } catch {}
        });
    }

    // OBSERVED ATTRIBUTES
    // ...

    // CSS
    const cssStyleSheet = new CSSStyleSheet();

    this.attachShadow({ mode:'open' });
    this.shadowRoot.adoptedStyleSheets = [cssStyleSheet];

    this.div = this.shadowRoot.appendChild(document.createElement('div'));

    this.render();
  }

  disconnectedCallback() {
    delete this.div;
  }

  render() {
    if(this.div) {
      this.div.innerHTML = '<slot></slot>';

      Object.assign(this.div.style, {
        backgroundColor:'#000',
        color:'#FFF'
      });
    }
  }
};

customElements.define('neotoronto-banner', Banner);

export default Banner;
