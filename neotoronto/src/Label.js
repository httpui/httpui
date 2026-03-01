// HTTP UI, https://httpui.com/
// Copyright (C) Alex Morales, 2026
//
// Unless otherwise stated in particular files or directories, this software is free software.
// You can redistribute it and/or modify it under the terms of the GNU Affero
// General Public License as published by the Free Software Foundation, either
// version 3 of the License, or (at your option) any later version.

const attrIsTrue = a => {
  if(!a)
    return false;
  
  const s = String(a.value).toLowerCase();

  if(
       s === 'undefined'
    || s === 'null'
    || s === 'false'
    || s === '0'
  )
    return false;
  
  return true;
};

const oklchaToCSS = oklcha => 'oklch(' + oklcha.l + ' ' + oklcha.c + ' ' + oklcha.h + ' / ' + oklcha.a + ')';

// attributes
//   flicker: boolean
//   level: [safety, notice, caution, warning, danger]
//          follows ANSI Z535

import * as httpstate from 'https://cdn.jsdelivr.net/npm/@httpstate/typescript@0.0.37/dist/index.esm.js';

export class Label extends HTMLElement {
  // OBSERVED ATTRIBUTES
  static observedAttributes = ['flicker', 'level'];
  observedAttributes = Label.observedAttributes;

  constructor() {
    super();

    this.div = undefined;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('attributeChangedCallback', name, oldValue, newValue);

    // OBSERVED ATTRIBUTES
    switch(name) {
      case 'flicker':
      case 'level':
        this.render();

        break;
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
              else
                this.setAttribute(k, v);
            }
          } catch {}
        });
    }

    // OBSERVED ATTRIBUTES
    if(this.attributes['level'] === undefined)
      this.setAttribute('level', 'notice');

    // CSS
    const cssStyleSheet = new CSSStyleSheet();
    cssStyleSheet.replace(`
      @keyframes opacityOnOff {
        50% { opacity: 0; }
      }
    `.trim());

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

      const level = attrIsTrue(this.attributes['level'])
        ? this.getAttribute('level').toLowerCase()
        : 'notice';

      let oklcha = undefined;

      switch(level) {
        case 'caution':
          oklcha = {
            l:  0.9187,
            c:  0.6002,
            h:109.7692,
            a:  1
          };

          break;
        case 'danger':
          // color = 'rgba(255, 51, 0, 1)';
          // boxShadow = 'rgba(255, 0, 0, 0.7)';
          // textShadow = 'rgba(255, 0, 0, 0.5)';
          // color = 'oklch(0.6463 0.2409 32.6151 / 1)';
          // boxShadow = 'oklch(0.5463 0.3409 32.6151 / 0.7)';
          // textShadow = 'oklch(0.5463 0.3409 32.6151 / 0.5)';
          
          oklcha = {
            l: 0.6463,
            c: 0.2409,
            h:32.6151,
            a: 1
          };

          break;
        case 'notice':
          oklcha = {
            l:  0.7072,
            c:  0.1679,
            h:242.04,
            a:  1
          };

          break;
        case 'safety':
          oklcha = {
            l:  0.7777,
            c:  0.2646,
            h:142.4953,
            a:  1
          };

          break;
        case 'warning':
          // color = 'rgba(255, 170, 0, 1)';
          // boxShadow = 'rgba(255, 102, 0, 0.7)';
          // textShadow = 'rgba(255, 102, 0, 0.5)';
          // color = 'oklch(0.8016 0.1705 73.27 / 1)';
          // boxShadow = 'oklch(0.7016 0.2705 73.27 / 0.7)';
          // textShadow = 'oklch(0.7016 0.2705 73.27 / 0.5)';

          oklcha = {
            l: 0.8016,
            c: 0.1705,
            h:73.27,
            a: 1
          };

          break;
      }
    
      const color = oklchaToCSS(oklcha);
      const boxShadow = oklchaToCSS({
        l:Math.max(0, oklcha.l-0.1),
        c:Math.min(oklcha.c+0.1, 1),
        h:oklcha.h,
        a:oklcha.a*0.7
      });
      const textShadow = oklchaToCSS({
        l:Math.max(0, oklcha.l-0.1),
        c:Math.min(oklcha.c+0.1, 1),
        h:oklcha.h,
        a:oklcha.a*0.5
      });

      const style = {
        animation:attrIsTrue(this.attributes['flicker'])
          ? 'opacityOnOff 100ms steps(1) infinite'
          : 'none',
        border:'3px solid ' + color,
        borderRadius:'8px',
        boxShadow:[
          'inset 0 0 0 1px ' + boxShadow,
          '      0 0 0 1px ' + boxShadow
        ].join(', '),
        color,
        fontFamily:'Roboto Condensed',
        fontSize:'32px',
        fontWeight:400,
        letterSpacing:'-0.8px',
        lineHeight:'1em',
        padding:'3px 6px 1px 6px',
        textShadow:[
          '-1px  1px 0 ' + textShadow,
          ' 1px -1px 0 ' + textShadow,
          '-1px -1px 0 ' + textShadow,
          ' 1px  1px 0 ' + textShadow
        ].join(', '),
        textTransform:'uppercase',
        userSelect:'none',
        whiteSpace:'nowrap',
        width:'fit-content'
      };

      Object.assign(this.div.style, style);
    }
  }
};

customElements.define('neotoronto-label', Label);

export default Label;
